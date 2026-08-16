// ============================================================
// ปรสิตวิทยาทางสัตวแพทย์ I (Veterinary Parasitology I) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส 3105201 ที่แจกจริงในรายวิชา ทุก section
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

export const NOTES_Y2_PARASIT_1 = {
  "parasit-1--lect-10-1-rickettsia-and-hemotrophic-mycoplasma": {
    "topic": "parasit-1--lect-10-1-rickettsia-and-hemotrophic-mycoplasma",
    "title": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma",
    "icon": "📖",
    "lecturer": "Morakot Kaewthamasorn",
    "summary": "เด็ค 12 หน้า ครอบคลุม 3 กลุ่มเชื้อในเลือด คือ Anaplasma (โค แพะแกะ สุนัข แมว ม้า), Ehrlichia canis ในสุนัข และ hemotropic Mycoplasma ในแมวกับสุกร เนื้อหาที่เป็นตัวหนังสือจริงกระจุกอยู่ที่หน้า 2-9 ส่วนหน้า 1 เป็นหน้าปกกับภาพเก็บตัวอย่าง หน้า 8, 9, 11 และ 12 เกือบทั้งหมดเป็นสไลด์ภาพ SEM/TEM/blood smear ที่ไม่มีข้อความอธิบาย และหน้า 10 เป็นรายการปฏิบัติการ (lab list) สไลด์ไม่ได้ลงรายละเอียดการวินิจฉัยทางห้องปฏิบัติการ ระบาดวิทยา หรือการป้องกันของเชื้อกลุ่มนี้",
    "sections": [
      {
        "heading": "หน้าปกและขอบเขตของเด็ค",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.1",
        "body": [
          {
            "text": "หัวเรื่องของเลคเชอร์คือ **Vector-borne rickettsia and hemotrophic Mycoplasma** บรรยายโดย Morakot Kaewthamasorn จาก Veterinary Parasitology Research Unit คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
          },
          {
            "text": "ส่วนที่เหลือของหน้าเป็นภาพงานภาคสนาม ได้แก่ goat sample collections, tick's flagging และ cattle blood sample collection โดยไม่มีข้อความอธิบายประกอบภาพ"
          }
        ]
      },
      {
        "heading": "Anaplasma species ที่สำคัญทางสัตวแพทย์",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.2",
        "body": [
          {
            "bullets": [
              "**Anaplasma marginale และ A. centrale ในโค** โดย buffaloes เป็น carriers ได้",
              "**A. ovis และ A. mesaeterum ในแกะและแพะ**",
              "**A. phagocytophilum ในสุนัข แมว และม้า** และเป็นสาเหตุของ Human granulocytic anaplasmosis",
              "**A. platys ในสุนัข**"
            ]
          },
          {
            "text": "หน้านี้ยังมีภาพ buffalo blood and tick sample collections และภาพ Anaplasma marginale in bovine RBC ประกอบ"
          }
        ]
      },
      {
        "heading": "Bovine anaplasmosis — เชื้อ เห็บ และการส่งผ่าน",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.3",
        "body": [
          {
            "text": "**A. marginale เป็น species ที่ pathogenic ที่สุดในกลุ่ม** ทำให้เกิด anaplasmosis ซึ่งเป็น tick fever รูปแบบหนึ่งที่นำโดยเห็บโคบาง species"
          },
          {
            "text": "**เชื้อเพิ่มจำนวนอยู่ภายในตัวเห็บ (R. microplus) และส่งต่อไปยัง stage ถัดไปของวงจรชีวิตเห็บได้ แต่ไม่ถ่ายทอดลงสู่ไข่**"
          },
          {
            "callout": "จุดที่ต้องจำให้แม่น คือ ผ่านไปยัง later stages ของเห็บได้ แต่ the infection is not passed to the eggs",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Bovine anaplasmosis — อาการและกลไกการเกิดโรค",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.3",
        "body": [
          {
            "sub": "Clinical symptoms of infection",
            "body": [
              {
                "bullets": [
                  "Transient fever",
                  "Weakness",
                  "Depression",
                  "Loss of appetite",
                  "Jaundice",
                  "Brown urine due to bile pigments",
                  "Respiratory distress โดยเฉพาะหลังออกแรง (physical exertions)"
                ]
              }
            ]
          },
          {
            "sub": "กลไกตามที่สไลด์เขียน",
            "body": [
              {
                "bullets": [
                  "โรคเริ่มจากเชื้อ **invade และเพิ่มจำนวนภายใน red blood cells** ของโฮสต์ (โค)",
                  "เป็น **gram-negative bacteria ที่สร้าง endotoxins ผ่าน lipopolysaccharide outer membrane**",
                  "**ทั้ง infected และ uninfected RBC ถูกทำลายเป็นหลักที่ liver และ spleen** ทำให้ anemia มากขึ้นเรื่อย ๆ และในรายรุนแรงถึงตาย"
                ]
              }
            ]
          },
          {
            "callout": "ข้อสังเกตจากสไลด์ คือ uninfected RBC ก็ถูกทำลายด้วย ไม่ใช่เฉพาะเม็ดเลือดที่ติดเชื้อ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Small ruminant anaplasmosis และการรักษา",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.4",
        "body": [
          {
            "text": "สไลด์นิยามเชื้อว่าเป็น **obligate intracellular microorganism, gram-negative bacteria**"
          },
          {
            "text": "Important species ที่สไลด์หน้านี้ระบุ ได้แก่ **Anaplasma marginale, A. centrale, A. ovis, A. bovis และ A. capra** ซึ่งเป็นคนละชุดกับรายชื่อในหน้า 2 (หน้า 2 มี A. mesaeterum, A. phagocytophilum และ A. platys แต่หน้า 4 มี A. bovis กับ A. capra แทน) สไลด์ไม่ได้อธิบายว่าทำไมสองหน้าจึงลิสต์ไม่เหมือนกัน"
          },
          {
            "sub": "Signs",
            "body": [
              {
                "bullets": [
                  "**anemia และ icterus โดยไม่มี hemoglobinemia และ hemoglobinuria**",
                  "fever, weight loss, abortion, lethargy และ death"
                ]
              },
              {
                "text": "สไลด์ระบุว่าความรุนแรงเป็นได้ตั้งแต่ mild to severe disease และมีหัวข้อ economic significance แต่ไม่ได้ให้ตัวเลขหรือรายละเอียดใด ๆ"
              }
            ]
          },
          {
            "sub": "ANAPLASMOSIS TREATMENT",
            "body": [
              {
                "text": "สไลด์เขียนว่า **buparvaquone, halofuginone, tetracycline, butalex และ oxytetracycline ล้วนแสดงว่าใช้ได้ผล** โดยไม่ได้ระบุขนาดยา ระยะเวลา หรือทางที่ให้"
              }
            ]
          },
          {
            "callout": "icterus แต่ไม่มี hemoglobinemia กับ hemoglobinuria เป็นจุดแยกที่สไลด์เน้นไว้ชัด",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Ehrlichiosis — ชื่อเรียก เชื้อ และ vector",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.4-5",
        "body": [
          {
            "text": "Ehrlichiosis มีชื่อเรียกอื่นว่า **canine rickettsiosis, canine hemorrhagic fever, canine typhus, tracker dog disease และ tropical canine pancytopenia**"
          },
          {
            "bullets": [
              "เป็น **tick-borne disease ของสุนัข ปกติเกิดจาก Ehrlichia canis**",
              "Ehrlichia เป็น **obligately intracellular pathogens**",
              "**E. canis ทำให้อาการรุนแรงที่สุด และเข้าไปติดใน monocytes ใน peripheral blood**",
              "เห็บที่ส่งเชื้อสู่สุนัขคือ **brown dog tick หรือ Rhipicephalus sanguineous** ซึ่งพบแพร่หลายทั่วโลก"
            ]
          }
        ]
      },
      {
        "heading": "Ehrlichiosis — 3 phases ของโรค",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.5",
        "body": [
          {
            "bullets": [
              "**Acute phase** ทำให้เกิดไข้ และ peripheral blood cell counts ลดลงจาก bone marrow suppression",
              "**Subclinical phase** อยู่ได้ยาวไปตลอดชีวิตที่เหลือของสุนัข",
              "**Chronic phase เป็นระยะที่รุนแรงที่สุด** เกิด pancytopenia, bleeding, bacterial infection, lameness, neurological และ ophthalmic disorders และ kidney disease และ chronic ehrlichiosis อาจถึงตายได้"
            ]
          },
          {
            "callout": "คำที่ต้องผูกกับ chronic phase คือ pancytopenia ซึ่งตรงกับชื่อเรียกอีกชื่อของโรคว่า tropical canine pancytopenia",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการของ chronic phase และภาพพยาธิสภาพ",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.6",
        "body": [
          {
            "text": "Clinical signs ของ chronic phase ตามสไลด์ ได้แก่ **weight loss, pale gums จาก anemia, bleeding จาก thrombocytopenia, vasculitis, lymphadenopathy, dyspnea, coughing, polyuria, polydipsia, lameness** รวมถึง ophthalmic diseases เช่น retinal hemorrhage และ anterior uveitis และ neurological disease"
          },
          {
            "text": "สไลด์ระบุว่าสุนัขที่เป็นรุนแรงตายจากโรคนี้ได้"
          },
          {
            "sub": "ภาพในหน้านี้ (คำบรรยายใต้ภาพ เครดิต AFIP)",
            "body": [
              {
                "bullets": [
                  "Several cutaneous ecchymoses ในสุนัขที่เป็น canine monocytic ehrlichiosis",
                  "Multiple petechiae และ ecchymoses บน gingival และ buccal mucosa",
                  "Multiple coalescing hemorrhages บน pleural surface โดย right middle lobe มี edema ร่วมด้วย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hemotropic Mycoplasma ในแมว",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.7",
        "body": [
          {
            "text": "สไลด์ขึ้นหัวข้อว่า **Non-Rickettsia** แล้วเข้าสู่ hemotropic Mycoplasma"
          },
          {
            "text": "**ในแมวมี haemotropic mycoplasmas ที่ได้รับการยอมรับอย่างน้อย 3 ชนิด**"
          },
          {
            "bullets": [
              "**Mycoplasma haemofelis (Mhf)**",
              "**Candidatus Mycoplasma haemominutum (CMhm)**",
              "**Candidatus M. turicensis (CMt)**"
            ]
          },
          {
            "bullets": [
              "**M. haemofelis เดิมชื่อ Haemobartonella felis** เป็น gram-negative epierythrocytic parasitic bacterium",
              "**เชื่อว่าแพร่กระจายหลักผ่าน blood-sucking arthropod vectors ได้แก่ fleas, mosquitoes และ ticks**",
              "**ทำให้เกิด Feline Infectious Anemia**"
            ]
          }
        ]
      },
      {
        "heading": "ลักษณะของ Mycoplasma และสไลด์ภาพกล้องจุลทรรศน์",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.8",
        "body": [
          {
            "text": "ข้อความเดียวในหน้านี้คือ **Mycoplasma เป็น mollicute genus ของแบคทีเรียที่ไม่มี cell wall หุ้ม cell membrane**"
          },
          {
            "text": "ที่เหลือเป็นสไลด์ภาพล้วน ได้แก่ SEM ของ cat RBC จาก experimental infection ด้วย M. haemofelis และด้วย Candidatus M. turicensis, ภาพ M. haemofelis ย้อม Wright-Giemsa ที่กำลังขยาย 100X และ TEM ของ cat RBC ที่ติด Candidatus M. turicensis (a) กับ M. haemofelis (b) ทุกภาพอ้างอิง Willi et al. 2011 และมี scale bar 1 µm สไลด์ไม่ได้เขียนคำอธิบายว่าให้ดูอะไรในแต่ละภาพ"
          }
        ]
      },
      {
        "heading": "Mycoplasma suis ในสุกร",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.9",
        "body": [
          {
            "text": "หน้านี้มีเพียงชื่อเชื้อกับภาพ คือ **Mycoplasma suis (formerly Eperythrozoon zuis ตามที่สไลด์สะกด)** พร้อมภาพจาก Groebel et al. 2009 และหัวข้อท้ายหน้าว่า suggested further readings"
          },
          {
            "callout": "สไลด์ไม่ได้บอกอาการ พยาธิกำเนิด vector หรือการรักษาของ Mycoplasma suis เลย มีแค่ชื่อเชื้อ ชื่อเดิม และภาพ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "รายการปฏิบัติการ (Lab)",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.10",
        "body": [
          {
            "text": "หน้า lab ชื่อ Lab Rickettsia and hemotrophic Mycoplasma โดยสไลด์พาดหัวกลุ่มไว้ว่า Protozoa แล้วไล่รายการ 5 ข้อ"
          },
          {
            "bullets": [
              "1. Anaplasma marginale",
              "2. Mycoplasma spp. (cat)",
              "3. Mycoplasma suis (pig)",
              "4. Ehrlichia canis",
              "5. Unknown"
            ]
          },
          {
            "text": "มีหมายเหตุว่าเป็น cattle blood Giemsa stain smear โดยสไลด์เขียนไว้ว่า Demo/self study และ Slide no.30 Demo Demo Demo / slide no. 31 Assignment สไลด์ไม่ได้ระบุชัดว่าเลข slide คู่กับรายการข้อไหนแบบหนึ่งต่อหนึ่ง"
          }
        ]
      },
      {
        "heading": "สไลด์ภาพท้ายเด็ค",
        "source": "Lect 10.1 Rickettsia and hemotrophic Mycoplasma p.11",
        "body": [
          {
            "text": "หน้า 11 และ 12 เป็นสไลด์ภาพล้วน ไม่มีเนื้อหาข้อความ มีเพียงคำบรรยายภาพว่า **Anaplasma marginale in bovine RBC**, **Ehrlichia canis in canine monocyte** และ **Hemotrophic Mycoplasma in feline RBC** (ภาพ hemotrophic Mycoplasma in feline RBC ปรากฏซ้ำอีกครั้งในหน้า 12)"
          },
          {
            "callout": "สามคำบรรยายนี้คือสิ่งที่ต้องจำคู่กับภาพ คือ Anaplasma อยู่ใน RBC ของโค, Ehrlichia canis อยู่ใน monocyte ของสุนัข, hemotrophic Mycoplasma อยู่ที่ RBC ของแมว",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "parasit-1--lect-12-2-diagnostic-techniques": {
    "topic": "parasit-1--lect-12-2-diagnostic-techniques",
    "title": "Lect 12.2 Diagnostic techniques",
    "icon": "📖",
    "lecturer": "Morakot Kaewthamasorn",
    "summary": "เดค 31 สไลด์ว่าด้วย diagnostic techniques ทางปรสิตวิทยา แบ่งเป็นสองบล็อกใหญ่คือการตรวจจาก blood samples และ fecal examinations แต่ต้องบอกตามตรงว่าเนื้อความที่เป็นตัวอักษรมีน้อยมาก สไลด์ส่วนใหญ่เป็นหัวข้อชื่อเทคนิค มีเพียงสองสไลด์เท่านั้นที่มีข้อความอธิบาย คือ p.2 (แบ่ง qualitative กับ quantitative และวิธีนับสำหรับ intracellular กับ extracellular parasites) และ p.16 (การตรวจ coccidia oocyst) ที่เหลือคือรายชื่อเทคนิคที่ต้องรู้จักว่ามีอะไรบ้าง ส่วนขั้นตอน หลักการ และการแปลผลของแต่ละเทคนิคนั้นสไลด์ไม่ได้เขียนไว้",
    "sections": [
      {
        "heading": "การตรวจจาก Blood samples: qualitative กับ quantitative",
        "source": "Lect 12.2 Diagnostic techniques p.2",
        "body": [
          {
            "text": "สไลด์แบ่ง diagnostic techniques สำหรับ blood samples ออกเป็น **Qualitative techniques กับ Quantitative techniques**"
          },
          {
            "bullets": [
              "**Intracellular parasites รายงานเป็น % infected cells**",
              "**Extracellular parasites รายงานเป็นจำนวนปรสิตต่อปริมาตรเลือด (number of parasites per blood volume)**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าเทคนิคไหนจัดเป็น qualitative และเทคนิคไหนจัดเป็น quantitative รวมถึงไม่ได้ให้เกณฑ์หรือค่าตัดสินใด ๆ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Fresh blood smear",
        "source": "Lect 12.2 Diagnostic techniques p.3-4",
        "body": [
          {
            "text": "หัวข้อสไลด์คือ FRESH BLOOD SMEAR โดยเน้นคำว่า **PARASITE MOVEMENT** (p.3) ซึ่งเป็นสิ่งที่ดูได้จาก smear สด"
          },
          {
            "text": "p.4 แบ่งหัวข้อย่อยเป็น INTRACELLULAR และ EXTRACELLULAR แต่ไม่มีข้อความอธิบาย"
          },
          {
            "callout": "วิธีเตรียม fresh blood smear กำลังขยายที่ใช้ และลักษณะการเคลื่อนไหวที่ต้องมอง สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "The haematocrit centrifuge technique (Woo's technique)",
        "source": "Lect 12.2 Diagnostic techniques p.6",
        "body": [
          {
            "text": "สไลด์ระบุชื่อเทคนิค **THE HAEMATOCRIT CENTRIFUGE TECHNIQUE (WOO'S TECHNIQUE)** ไว้เป็นหัวข้อ"
          },
          {
            "callout": "ชื่อเทคนิคนี้ต้องจำคู่กับชื่อ Woo's technique ส่วนขั้นตอน ความเร็ว/เวลาปั่น ตำแหน่งที่อ่านผล และปรสิตที่เหมาะกับเทคนิคนี้ สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Thin blood smear กับ thick blood smear",
        "source": "Lect 12.2 Diagnostic techniques p.8-11",
        "body": [
          {
            "text": "เดคแยกหัวข้อไว้สามหัวข้อบนสี่สไลด์ติดกัน ได้แก่ **THIN BLOOD SMEAR** (p.8 และ p.9), **THICK BLOOD SMEAR** (p.10) และสไลด์เปรียบเทียบ **THIN BLOOD SMEAR VS THICK BLOOD SMEAR** (p.11)"
          },
          {
            "callout": "สไลด์เปรียบเทียบมีแต่หัวข้อ ข้อดีข้อเสียของแต่ละแบบ ความไวในการตรวจ และการเลือกใช้ในสถานการณ์ไหน สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Trypanosoma cruzi กับ Trypanosoma brucei",
        "source": "Lect 12.2 Diagnostic techniques p.12",
        "body": [
          {
            "text": "สไลด์ตั้งหัวข้อเปรียบเทียบ **Trypanosoma cruzi VS Trypanosoma brucei** ไว้ตรงกลางบล็อกของการตรวจเลือด"
          },
          {
            "callout": "สไลด์ไม่ได้เขียนข้อแตกต่างไว้เป็นตัวอักษรเลย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Fecal examinations: การตรวจ coccidia oocyst",
        "source": "Lect 12.2 Diagnostic techniques p.16",
        "body": [
          {
            "text": "สไลด์เปิดบล็อกที่สองด้วยหัวข้อ FECAL EXAMINATIONS และระบุว่าเป็น **qualitative and quantitative examination of coccidia oocyst**"
          },
          {
            "text": "วิธีที่สไลด์ระบุชื่อไว้สำหรับการตรวจ oocyst มีสามอย่าง"
          },
          {
            "bullets": [
              "**simple fresh smear**",
              "**floatation**",
              "**oocyst count โดยใช้ McMaster counting chamber**"
            ]
          }
        ]
      },
      {
        "heading": "เทคนิคตรวจอุจจาระที่เดคระบุชื่อไว้",
        "source": "Lect 12.2 Diagnostic techniques p.17-30",
        "body": [
          {
            "text": "ครึ่งหลังของเดคไล่ชื่อเทคนิคตรวจอุจจาระทีละสไลด์ ตามลำดับนี้"
          },
          {
            "bullets": [
              "**DIRECT FECAL SMEAR** (p.17)",
              "**SIMPLE FLOTATION** (p.21 และย้ำอีกครั้ง p.23)",
              "**MCMASTER FECAL EGG COUNT** (p.26) และ **McMaster counting chamber** (p.27)",
              "**FLUKE FINDER** (p.28)",
              "**SIMPLE SEDIMENTATION** (p.29)",
              "**FORMALIN-ETHER SEDIMENTATION** (p.30)"
            ]
          },
          {
            "text": "ลำดับนี้เองก็เป็นข้อมูล คือเดคจัดกลุ่ม flotation ไว้ก่อน แล้วตามด้วยการนับไข่ (McMaster) แล้วจึงเป็นกลุ่ม sedimentation ปิดท้าย"
          },
          {
            "callout": "น้ำยาที่ใช้ ความถ่วงจำเพาะ ปริมาตรอุจจาระ สูตรคำนวณ eggs per gram และไข่ปรสิตชนิดใดเหมาะกับ flotation หรือ sedimentation สไลด์ไม่ได้บอกไว้เป็นตัวอักษรเลย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ข้อควรรู้ก่อนใช้เดคนี้อ่านสอบ",
        "source": "Lect 12.2 Diagnostic techniques",
        "body": [
          {
            "text": "จาก 31 สไลด์ มีสไลด์ที่ไม่มีข้อความใด ๆ เลย ถึง 12 สไลด์ ได้แก่ p.5, p.7, p.13, p.14, p.15, p.18, p.19, p.20, p.22, p.24, p.25 และ p.31"
          },
          {
            "text": "สิ่งที่เดคนี้ให้แน่ ๆ คือ **รายชื่อเทคนิคที่ต้องรู้จักและการจัดกลุ่มว่าเทคนิคไหนใช้กับเลือดและเทคนิคไหนใช้กับอุจจาระ** ส่วนรายละเอียดวิธีทำและการแปลผลไม่ได้อยู่ในตัวอักษรของสไลด์"
          },
          {
            "callout": "อย่าเดารายละเอียดขั้นตอนจากชื่อเทคนิคเอง ให้ไปดูภาพในสไลด์จริงหรือคู่มือปฏิบัติการประกอบ",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "parasit-1--lect-6-general-overview-of-protozoa": {
    "topic": "parasit-1--lect-6-general-overview-of-protozoa",
    "title": "Lect 6 General overview of protozoa",
    "icon": "📖",
    "lecturer": "Assist. Prof. Woraporn Sukhumavasi, DVM, Ph.D.",
    "summary": "เลกเชอร์ภาพรวม protozoa สกัดมา 7 หน้า โดยเลขสไลด์ในเด็คเดินจาก 25 ถึง 48 อ้างอิง Jacobs et al. 2016 Principles of Veterinary Parasitology เดินตาม key concepts 5 หัวข้อคือ classification, locomotion, nutrition, transmission และ reproduction ปิดท้ายด้วยนิยาม enteric coccidia เทียบ tissue cyst-forming coccidia และสไลด์สรุป ตัวเลกเชอร์เป็นภาพรวมล้วน ไม่มีชื่อเชื้อรายตัว ไม่มียา ไม่มีอาการทางคลินิก และมีหลายสไลด์ที่เป็นรูปเปล่าไม่มีข้อความ (เช่นสไลด์ locomotion apicomplexa และสไลด์ sporogony) รวมทั้งมีสไลด์ที่ซ้ำกันคำต่อคำ",
    "sections": [
      {
        "heading": "Key concepts ที่เลกเชอร์นี้จะเดิน",
        "source": "Lect 6 General overview of protozoa p.1",
        "body": [
          {
            "text": "สไลด์เปิดวาง **โครง 5 หัวข้อของทั้งเลกเชอร์** ไว้ตั้งแต่ต้น ทุกสไลด์ถัดไปเป็นการขยายหัวข้อเหล่านี้"
          },
          {
            "bullets": [
              "Classification",
              "Locomotion",
              "Nutrition",
              "Transmission",
              "Reproduction"
            ]
          },
          {
            "text": "แหล่งอ้างอิงที่พิมพ์ไว้ท้ายสไลด์เกือบทุกแผ่นคือ Jacobs et al. 2016 Principles of Veterinary Parasitology และมีภาพจาก Prof. Dr. Dwight Bowman"
          }
        ]
      },
      {
        "heading": "Classification: กลุ่ม protozoan parasite ที่สำคัญทางสัตวแพทย์",
        "source": "Lect 6 General overview of protozoa p.2",
        "body": [
          {
            "text": "สไลด์เป็นแผนผังภายใต้หัวคอลัมน์ Subkingdom และ Phylum โดยตั้งต้นที่ **Protozoa** แล้วแตกเป็นกลุ่มดังนี้"
          },
          {
            "bullets": [
              "Ciliates",
              "Amoebae",
              "Flagellates",
              "Apicomplexa"
            ]
          },
          {
            "text": "ชื่อที่สไลด์วางไว้ในสายของ **Apicomplexa** ได้แก่ Coccidia, Tissue cyst-forming coccidia, Piroplasms และ Cryptosporidia"
          },
          {
            "callout": "สไลด์นี้เป็นแผนผัง สไลด์ไม่ได้เขียนเป็นประโยคว่าชื่อใดอยู่ระดับ Subkingdom และชื่อใดอยู่ระดับ Phylum นอกจากหัวคอลัมน์สองคำนั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Locomotion: ตารางเทียบ 4 กลุ่มหลัก",
        "source": "Lect 6 General overview of protozoa p.2",
        "body": [
          {
            "text": "ตารางในสไลด์เทียบสองคอลัมน์คือ Locomotion by และ Intracellular stages"
          },
          {
            "bullets": [
              "Ciliates เคลื่อนที่ด้วย **cilia** และมี intracellular stages หรือไม่ ตอบว่า No",
              "Amoebae เคลื่อนที่ด้วย **pseudopodia** และ intracellular stages ตอบว่า No",
              "Flagellates เคลื่อนที่ด้วย **flagellae** และ intracellular stages ตอบว่า **some spp.**",
              "Apicomplexa เคลื่อนที่แบบ **gliding** และ intracellular stages ตอบว่า **Yes**"
            ]
          },
          {
            "callout": "ตารางนี้คือจุดที่สรุปทั้งเรื่อง locomotion ไว้ในหน้าเดียว ท่องแนวนอนทีละกลุ่มจะจำได้ว่ากลุ่มไหนเข้าเซลล์ได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Locomotion: ciliates และ amoebae",
        "source": "Lect 6 General overview of protozoa p.2",
        "body": [
          {
            "sub": "Ciliates",
            "body": [
              {
                "bullets": [
                  "จำได้จาก **ขนสั้นจำนวนหลายพันเส้น (cilia) ปกคลุมทั่วผิวลำตัว**",
                  "cilia โบกพัดเป็นระลอกที่ประสานกัน (coordinated ripples) เพื่อดันตัวเชื้อไปข้างหน้า สไลด์เปรียบเทียบกับคลื่นเม็กซิกันเวฟรอบสนามกีฬา"
                ]
              }
            ]
          },
          {
            "sub": "Amoebae",
            "body": [
              {
                "bullets": [
                  "รูปร่างไม่แน่นอนเหมือนก้อนวุ้น เคลื่อนที่โดย**ยื่นส่วนคล้ายนิ้วออกไปเรียกว่า pseudopodium** แล้วขยายขึ้นเมื่อ cytoplasm ไหลเข้าไป",
                  "amoebae **ต้องมี substrate ที่เหมาะสม** จึงจะเคลื่อนที่แบบ active ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Locomotion: flagellates และ apicomplexa",
        "source": "Lect 6 General overview of protozoa p.3",
        "body": [
          {
            "sub": "Flagellates",
            "body": [
              {
                "bullets": [
                  "ว่ายน้ำเก่ง ใช้เส้นใยยาวที่หดตัวได้หนึ่งเส้นหรือมากกว่า เรียก **flagellae** สะบัดแบบแส้ (whiplike)",
                  "**เหมาะกับการอยู่ในเลือดหรือของเหลวอื่นในร่างกาย**"
                ]
              },
              {
                "text": "สไลด์มีคำบรรยายลักษณะการเคลื่อนไหวสองแบบกำกับไว้คือ A falling leaf และ Erratic jerky movement โดย**สไลด์ไม่ได้บอก**ว่าคำบรรยายแต่ละแบบเป็นของเชื้อชนิดใด"
              }
            ]
          },
          {
            "sub": "Apicomplexa",
            "body": [
              {
                "bullets": [
                  "**ไม่มี external organelle สำหรับการเคลื่อนที่**",
                  "ระยะ intracellular ใน life cycle **ไม่เคลื่อนที่** ส่วนระยะที่ออกจาก host cell หนึ่งไปหาอีกเซลล์จะมีลำตัวเพรียวรูปเสี้ยวจันทร์ (crescent-shaped) และเคลื่อนไปตามวิถีเกลียว (spiral trajectory)",
                  "เรียกการเคลื่อนที่แบบนี้ว่า **gliding motility**",
                  "อาศัย **intracellular contractile microfilaments** ที่ทำให้เกิดการเปลี่ยนแปลงเล็กน้อยตามผิวลำตัว",
                  "เมื่อเจอ host cell ที่เหมาะสมแล้ว การเจาะเข้าเซลล์ทำได้ด้วยโครงสร้างจำเพาะที่เรียกว่า **apical complex**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Nutrition",
        "source": "Lect 6 General overview of protozoa p.4",
        "body": [
          {
            "bullets": [
              "protozoa กินอาหารเป็น **particulate material** เป็นหลัก",
              "cell membrane จะบุ๋มและพับตัวช้า ๆ ห่ออาหารปริมาณเล็กน้อยแล้วดึงเข้าเซลล์ ได้แก่ **pinocytosis** และ **phagocytosis**",
              "ใน **ciliates** อาหารถูก cilia พัดไปที่ฐานของโครงสร้างรูปกรวยชื่อ **cytostome** เมื่อสะสมพอจะเกิด vacuole แล้วถูกกลืนเข้าสู่ cytoplasm",
              "protozoa ที่เป็นปรสิตหลายชนิด**ดูดซึม liquid nutrients ได้ด้วย** และในบางกรณีนี่คือแหล่งอาหารหลัก"
            ]
          },
          {
            "text": "ระยะที่กินอาหารใน life cycle ของ protozoa เรียกว่า **trophozoite** หลายชนิดมีเพียงรูปแบบนี้รูปแบบเดียว แต่บางชนิดมีระยะต่อเนื่องกันหลายระยะที่หน้าที่ รูปร่าง และชื่อเรียกต่างกัน"
          },
          {
            "callout": "สไลด์มีป้ายกำกับ Size of particle อยู่เหนือหัวข้อ pinocytosis กับ phagocytosis แต่สไลด์ไม่ได้บอกตัวเลขหรือเกณฑ์ขนาดที่ใช้แบ่งสองอย่างนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Transmission",
        "source": "Lect 6 General overview of protozoa p.4",
        "body": [
          {
            "text": "**trophozoite ที่ปรับตัวมาเป็นปรสิตมักทนสภาพแวดล้อมภายนอกไม่ได้** หลายชนิดจึงสร้างผนังห่อหุ้มตัวเองเป็น **cyst** หรือ **oocyst** ที่ทนทาน ก่อนออกจาก host"
          },
          {
            "sub": "Method of transfer ตามที่สไลด์แจกแจง",
            "body": [
              {
                "bullets": [
                  "**Passive** คือ fecal-oral transfer ของ trophozoite, cyst หรือ oocyst",
                  "**Arthropod vector** ทั้งแบบกัด (bite) และแบบถูกกินเข้าไป (being consumed)",
                  "**Ingestion by carnivores** โดยกินเชื้อที่อยู่ใน intermediate hosts"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Reproduction: ภาพรวมและการแลกเปลี่ยนสารพันธุกรรม",
        "source": "Lect 6 General overview of protozoa p.5",
        "body": [
          {
            "bullets": [
              "**protozoa ทุกชนิดสืบพันธุ์แบบ asexual ได้ คือแบ่งตัวด้วย mitosis**",
              "ถึงอย่างนั้นหลายชนิดก็สามารถแลกเปลี่ยนสารพันธุกรรมกันภายใน species ได้",
              "ใน **ciliates** ใช้ **conjugation ของ trophozoite เพื่อสลับ micronuclei**"
            ]
          },
          {
            "sub": "รูปแบบการสืบพันธุ์แบบ asexual ที่สไลด์ระบุ",
            "body": [
              {
                "text": "รูปแบบต่างกันไปตาม species และตามช่วงของ life cycle ได้แก่"
              },
              {
                "bullets": [
                  "Binary fission",
                  "Budding",
                  "Multiple fission",
                  "Sporogony หรือ sporulation"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ชุด Reproduction มีแผ่นที่เนื้อหาซ้ำกันคำต่อคำ (สไลด์ 39 กับ 45 และสไลด์ 40 กับ 41) ไม่ใช่เนื้อหาใหม่",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Reproduction: multiple fission",
        "source": "Lect 6 General overview of protozoa p.5",
        "body": [
          {
            "bullets": [
              "เป็นการเพิ่มจำนวนแบบ asexual ที่ให้ลูกจำนวนมาก **พบเด่นใน Apicomplexa**",
              "มีอีกชื่อว่า **schizogony หรือ merogony**",
              "**nucleus แบ่งตัวซ้ำ ๆ แต่ cytoplasm ยังไม่แบ่ง** จนกระทั่งก่อนที่เซลล์ซึ่งเรียกว่า **schizont หรือ meront** จะแตกออกปล่อยตัวลูกจำนวนมากที่เรียกว่า **merozoites**"
            ]
          }
        ]
      },
      {
        "heading": "Reproduction: sporogony",
        "source": "Lect 6 General overview of protozoa p.6",
        "body": [
          {
            "bullets": [
              "คือการแบ่งเซลล์ที่เกิด **ภายใน oocyst ของ apicomplexan**",
              "ผลคือ oocyst ที่แก่แล้ว (mature หรือ sporulated) จะมีตัวเชื้อที่ก่อโรคได้ตั้งแต่ 2 ตัวขึ้นไป เรียกว่า **sporozoites** ซึ่งมักจัดเรียงเป็นกลุ่มอยู่ในผนังห่อหุ้มแยกกันเรียกว่า **sporocysts**",
              "**จำนวน sporocyst และจำนวน sporozoite ภายใน oocyst เป็นลักษณะที่ใช้ประโยชน์ในการ Dx**"
            ]
          },
          {
            "callout": "สไลด์ถัดมาในหัวข้อ Reproduction sporogony เป็นรูปล้วน ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Reproduction: sexual phase ของ apicomplexa",
        "source": "Lect 6 General overview of protozoa p.6",
        "body": [
          {
            "bullets": [
              "**apicomplexans มี life cycle ที่ซับซ้อน ประกอบด้วยทั้ง asexual phase และ sexual phase**",
              "**male และ female gametes เกิดจากการแบ่งตัวแบบ meiotic division**",
              "ในบาง genus เซลล์ที่ปฏิสนธิแล้วจะสร้างผนังป้องกันกลายเป็น **oocyst**"
            ]
          }
        ]
      },
      {
        "heading": "Enteric coccidia เทียบ tissue cyst-forming coccidia",
        "source": "Lect 6 General overview of protozoa p.7",
        "body": [
          {
            "text": "สไลด์วางนิยามสองกลุ่มเทียบกันตรง ๆ โดยแยกที่จำนวนชนิดของ host ที่ใช้ใน life cycle"
          },
          {
            "bullets": [
              "**Enteric coccidia** อยู่กับ host เพียงชนิดเดียวตลอด life cycle",
              "**Tissue cyst-forming coccidia** อาศัย host มากกว่าหนึ่งชนิด โดยเฉพาะอย่างยิ่ง**ต้องมี host อย่างน้อยสองชนิดจึงจะครบ life cycle**"
            ]
          },
          {
            "callout": "สไลด์นี้ให้แต่นิยามเชิงจำนวน host ไม่ได้ยกชื่อ genus หรือ species ตัวอย่างของทั้งสองกลุ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Summary of pathogenic protozoa",
        "source": "Lect 6 General overview of protozoa p.7",
        "body": [
          {
            "text": "สไลด์ปิดสรุปว่า protozoa คือ **unicellular eukaryotic organism** แล้วไล่สี่แกนดังนี้"
          },
          {
            "bullets": [
              "**Location** แบ่งเป็น extracellular และ intracellular โดยสไลด์วงเล็บกำกับ intracellular ว่า **(Apicomplexa)**",
              "**Reproduction** มีทั้ง asexual และ sexual",
              "**Site of infection** ได้แก่ digestive, blood, reproductive, reticuloendothelial, neuronal sys., muscle และอื่น ๆ"
            ]
          },
          {
            "sub": "4 major groups ตามสไลด์สรุป",
            "body": [
              {
                "bullets": [
                  "**Ciliates**",
                  "**Amoebae**",
                  "**Flagellates** แยกย่อยเป็น hemoflagellates และ mucosoflagellates",
                  "**Apicomplexans** แยกย่อยเป็น enteric coccidia, tissue-cyst forming coccidia, blood borne apicomplexans และ cryptosporidia"
                ]
              },
              {
                "callout": "ชื่อกลุ่มย่อยฝั่ง apicomplexans ในสไลด์สรุปไม่ตรงคำกับแผนผัง classification หน้าแรกเสียทีเดียว หน้าแผนผังใช้คำว่า Coccidia และ Piroplasms ส่วนหน้าสรุปใช้ enteric coccidia และ blood borne apicomplexans สไลด์ไม่ได้อธิบายว่าคำคู่นี้หมายถึงสิ่งเดียวกันหรือไม่",
                "kind": "warn"
              }
            ]
          }
        ]
      }
    ]
  },
  "parasit-1--lect-7-part-1-mucosoflagellates": {
    "topic": "parasit-1--lect-7-part-1-mucosoflagellates",
    "title": "Mucosoflagellates: Giardia และ Trichomonads",
    "icon": "📖",
    "lecturer": "Woraporn Sukhumavasi, DVM, Ph.D. (Parasitology Unit, Dept. of Pathology, Faculty of Veterinary Science, Chulalongkorn University)",
    "summary": "เด็คนี้เป็น Lecture เต็ม 20 หน้า แบ่งเป็น 2 ครึ่งชัดเจน ครึ่งแรกคือ Giardia (ประวัติ assemblage morphology biology life cycle epidemiology pathogenesis clinical signs Dx Tx prevention) ครึ่งหลังคือ Trichomonads โดยเน้น Tritrichomonas foetus ทั้งในโค (bovine genital trichomoniasis) และในแมว แล้วปิดท้ายด้วย Trichomonas gallinae ในนกและ trichomonad ในสุกรแบบสั้นๆ มีหลายสไลด์ที่เป็นรูปล้วน (รูป cyst/trophozoite, รูปพยาธิสภาพในโค, คลิปการเคลื่อนที่, รูป flagellates และ ciliate ในสุกรที่ถ่ายจาก diarrheal pig) ซึ่ง text layer ไม่มีคำอธิบาย รวมถึงสไลด์ควิซ \"Which ones are Giardia cyst?\" ที่สไลด์ไม่ได้เฉลย สไลด์หน้าแรกไล่รายชื่อ protozoa ที่จะเรียนทั้งหมด แต่ Amoeba, Histomonas meleagridis และ Balantidium coli ยกไปคาบถัดไป ไม่ได้อยู่ในเด็คนี้",
    "sections": [
      {
        "heading": "ขอบเขต: protozoa ที่เรียนคาบนี้และคาบถัดไป",
        "source": "Lect 7 Part 1 Mucosoflagellates p.1",
        "body": [
          {
            "text": "สไลด์เปิดไล่รายชื่อ protozoa ที่สำคัญสำหรับ \"today and following class\" ไว้ทั้งชุด"
          },
          {
            "bullets": [
              "**Intestinal flagellates**: Giardia และ Trichomonads (Trichomonas, Tritrichomonas, Pentatrichomonas)",
              "**Amoeba**: Intestinal amebas (Entamoeba histolytica, Entamoeba coli) และ Facultative amebas",
              "**Histomonas meleagridis**",
              "**Ciliates**: Balantidium coli"
            ]
          },
          {
            "callout": "เด็ค Part 1 นี้ลงรายละเอียดเฉพาะ Giardia และ Trichomonads ส่วน Amoeba, Histomonas และ Balantidium coli สไลด์ชุดนี้แค่ list ชื่อไว้ ไม่ได้อธิบายต่อ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Giardia: ประวัติและที่มาของชื่อ",
        "source": "Lect 7 Part 1 Mucosoflagellates p.3",
        "body": [
          {
            "text": "สไลด์หัวข้อ Giardia Kunstler 1882: history ไล่ไทม์ไลน์ไว้ดังนี้"
          },
          {
            "bullets": [
              "1861: Antonie van Leeuwenhoek first described and sketched the trophozoites and cyst",
              "1850: Vilem Lambl ค้นพบจริงจาก stool ของเด็กที่มี diarrhea และตั้งชื่อว่า **Cermomonas intestinalis**",
              "1888: Raphael Anatole Emile Blanchard เปลี่ยนชื่อเป็น **Lamblia intestinalis**",
              "1915: Charles Wardell Stiles เปลี่ยนชื่อเป็น **Giardia lamblia** เพื่อเป็นเกียรติแก่ Prof. A. Giard (Paris) และ Dr. F. Lambl (Prague)"
            ]
          },
          {
            "callout": "สไลด์เรียงปี 1861 ไว้ก่อน 1850 ตามลำดับที่พิมพ์ไว้จริง (ลำดับดูสลับกัน) จดตามที่สไลด์เขียน สไลด์ไม่ได้อธิบายว่าทำไมเรียงแบบนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Giardia: assemblage และ host ที่เกี่ยวข้อง",
        "source": "Lect 7 Part 1 Mucosoflagellates p.3",
        "body": [
          {
            "bullets": [
              "เป็น **Mucoflagellate**",
              "Classification ใช้ **molecular epidemiology** แบ่งเป็น **Assemblage A ถึง G**",
              "**Dog: Assemblage A, B, C**",
              "**Cat: Assemblage A, F**",
              "Cause diarrhea in dogs and cats",
              "Common in animals housed in stressful situation, shelters, catteries",
              "มี **2 life stages: trophozoite และ cyst**"
            ]
          }
        ]
      },
      {
        "heading": "Giardia: การจำแนก genotype ทำด้วยอะไร",
        "source": "Lect 7 Part 1 Mucosoflagellates p.4",
        "body": [
          {
            "bullets": [
              "Genetics of Giardia are **still not clearly defined**",
              "Classification ของ Giardia อิงจาก **genotypes** ซึ่งกำหนดด้วยเทคนิคทาง molecular หลายแบบ",
              "**PCR** ที่ยีน **GDH (glutamate dehydrogenase)**, **ef1-α (elongation factor 1-α)**, **TPI (triphosphate isomerase)** และ **rDNA**"
            ]
          }
        ]
      },
      {
        "heading": "Giardia: morphology ของ trophozoite",
        "source": "Lect 7 Part 1 Mucosoflagellates p.4",
        "body": [
          {
            "bullets": [
              "รูปร่าง **teardrop shape** หรือ split pears ที่มี flattened ventral surface และเรียวไปทาง posterior เป็นหาง",
              "ขนาด **12-17 x 7-10 μm**",
              "มี **sucking disc (ventral adhesive disk)** ด้านหนึ่งกดเข้าไปเพื่อ attach กับ mucous epithelial cells ที่บุ small intestine",
              "**2 nuclei** แต่ละอันมี large endosome",
              "**2 slender axonemes** อยู่ภายใน trophozoite",
              "**4 pairs of flagella**",
              "มี **a pair of median bodies**"
            ]
          }
        ]
      },
      {
        "heading": "Giardia: biology ของ trophozoite",
        "source": "Lect 7 Part 1 Mucosoflagellates p.4",
        "body": [
          {
            "bullets": [
              "แบ่งตัวแบบ **longitudinal binary fission**",
              "เป็น **feeding stage** อยู่ที่ **jejunum และ ileum**",
              "สลับระหว่างช่วง attachment กับ free-swimming",
              "**Rarely passed directly into the environment** จะออกมาก็ต่อเมื่อ intestinal motility เร็วมากจนเป็น very liquid diarrhea",
              "**incapable of causing infection** และตายเร็วเมื่ออยู่นอก host",
              "**Unable to osmoregulate** จึง lysing ใน fresh water"
            ]
          },
          {
            "callout": "จำคู่กันว่า trophozoite = ระยะกิน อยู่ในลำไส้ ไม่ใช่ระยะติดต่อ ส่วน cyst = infective stage (หน้า 5)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Giardia: morphology ของ cyst",
        "source": "Lect 7 Part 1 Mucosoflagellates p.5",
        "body": [
          {
            "bullets": [
              "ขนาด **9-13 x 7-9 μm**",
              "ภายในมี **2 potential trophozoites** ซึ่งเป็น mitotically arrested trophozoites",
              "**Remain infectious for months** ในสิ่งแวดล้อมที่ cool, wet",
              "**Environmentally stable** เป็น major factor ของ high prevalence ของ giardiasis ทั่วโลก",
              "เป็น **infective stage**",
              "พบได้บ่อยใน normal stools ของ asymptomatic host"
            ]
          }
        ]
      },
      {
        "heading": "Giardia: การเกิด cyst (encystation)",
        "source": "Lect 7 Part 1 Mucosoflagellates p.5",
        "body": [
          {
            "bullets": [
              "Trophozoite มักสร้าง infective cyst ก่อนออกไปกับ feces",
              "**Encystation เกิดขณะ parasite เคลื่อนไปทาง colon**",
              "การ reabsorb น้ำ หรือการเปลี่ยนแปลงทางเคมีและ enzyme ทำให้เกิด stress ต่อ trophozoite",
              "**การลดลงของ free cholesterol** อาจเป็น molecular signal แรก",
              "ระหว่าง encystment มีการปล่อย **encystment proteins** ออกจาก vesicles ซึ่งสไลด์วงเล็บไว้ว่าเป็น **Dx tool**"
            ]
          }
        ]
      },
      {
        "heading": "Giardia: life cycle และ transmission",
        "source": "Lect 7 Part 1 Mucosoflagellates p.5",
        "body": [
          {
            "bullets": [
              "Host กิน **infective cysts** เข้าไป",
              "**Acidic conditions ในกระเพาะกระตุ้น excystation อย่างรวดเร็ว** (มีการเปลี่ยน mRNA expression และ cell ultrastructure)",
              "Parasite ที่ excyst แล้วไปถึง **alkaline environment ของ small intestine** และสัมผัส digestive enzymes กับ bile salts เพื่อทำ excystation ให้สมบูรณ์",
              "**4 nucleated stage แบ่งเป็น 2 trophozoites** โดยแต่ละตัวมี 2 nuclei"
            ]
          },
          {
            "sub": "Transmission",
            "body": [
              {
                "bullets": [
                  "Contamination in food and water",
                  "**Fecal-oral route**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Giardia: epidemiology",
        "source": "Lect 7 Part 1 Mucosoflagellates p.6",
        "body": [
          {
            "text": "พบ worldwide ทั้งในคนและสัตว์ และแตกต่างกันตาม geographic location"
          },
          {
            "sub": "Cyst",
            "body": [
              {
                "bullets": [
                  "**Shed in the feces intermittently**",
                  "Survive ในสิ่งแวดล้อมชื้น",
                  "**Resistant to most disinfectants** รวมถึง water treatment disinfection",
                  "เกิด waterborne outbreak ในคนได้ทั้งชุมชน rural และ urban",
                  "Norway (fall 2004): largest outbreak of acute giardiasis"
                ]
              }
            ]
          },
          {
            "sub": "Incidence in dogs and cats",
            "body": [
              {
                "bullets": [
                  "Confined breeding facilities, crowded and poor sanitation shelters",
                  "**Re-infection by grooming**",
                  "Inanimate objects เช่น food bowls ใน catteries และ kennels"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Giardia: pathogenesis",
        "source": "Lect 7 Part 1 Mucosoflagellates p.6",
        "body": [
          {
            "bullets": [
              "ขึ้นกับ **จำนวน cyst ที่กินเข้าไป** โดยในคนใช้ **10-100 cysts** ก็ establish infection ได้",
              "**Loss of microvillus brush border** จากการที่ parasite เกาะ",
              "**Disaccharidase insufficiency** นำไปสู่ malabsorption ของ electrolytes, nutrients และ water",
              "**Disrupt epithelial tight junctions**",
              "**T-lymphocyte mediated enterocytic injury**",
              "Increase intestinal permeability",
              "Destruction of enterocytes",
              "อาจนำไปสู่ **IBD, Crohn disease, food allergies**"
            ]
          }
        ]
      },
      {
        "heading": "Giardia: clinical signs",
        "source": "Lect 7 Part 1 Mucosoflagellates p.6",
        "body": [
          {
            "text": "ความรุนแรงแตกต่างกันตาม age, stress level, immune และ nutritional status, animal species และ parasite strain"
          },
          {
            "bullets": [
              "**Asymptomatic** ก็ได้",
              "Slight abdominal discomfort",
              "Severe abdominal pain and cramping",
              "**Explosive watery foul-smelling diarrhea**",
              "เป็น **small bowel diarrhea (self-limiting)**"
            ]
          },
          {
            "sub": "ระยะเวลาแยกตาม host",
            "body": [
              {
                "bullets": [
                  "Parasitize small intestine ทำให้เกิด **malabsorption syndrome**",
                  "**Human**: incubation period ~1-14 days (avg 7 days), อาการอยู่นาน 1-3 wks",
                  "**Dog**: diarrhea อาจเริ่มเร็วสุดที่ 5 days p.i., **Ppp ~1-2 wk**, อาการอยู่ได้ตั้งแต่ 1 วันถึงหลายเดือน",
                  "**Cat**: persistent diarrhea จาก intestinal malabsorption, feces เป็น mucoid, pale, soft, malodorous"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Giardia: Dx",
        "source": "Lect 7 Part 1 Mucosoflagellates p.7",
        "body": [
          {
            "callout": "**ต้องทำ repeat fecal analyses** เพราะ cyst shedding เป็นแบบ intermittently สไลด์ย้ำข้อนี้ซ้ำสองสไลด์",
            "kind": "warn"
          },
          {
            "sub": "วิธีตรวจ",
            "body": [
              {
                "bullets": [
                  "**Direct fecal smear**: เจอ trophozoite ใน diarrheal feces",
                  "**Lugol's solution staining**: ย้อมทั้ง trophozoite และ cyst เพิ่ม contrast ของ nuclei",
                  "**Fecal flotation**: ใช้ **ZnSO4 (SG 1.18)** ส่วน **sucrose ทำให้ cyst หดและบิดเบี้ยว**",
                  "**IFA**: MeriFluor Cryptosporidium/Giardia",
                  "**PCR**",
                  "**Antigen detection kits**: SNAP Giardia antigen test (IDEXX) ซึ่งเป็น ELISA ต่อ **Giardia cyst wall protein ที่หลั่งช่วง encystation** และ Anigen Rapid Giardia antigen test (Bionote)"
                ]
              }
            ]
          },
          {
            "sub": "จุดที่ทำให้อ่านผิด",
            "body": [
              {
                "bullets": [
                  "ควรใช้ **combination ของหลายเทคนิค** เพื่อ confirm diagnosis",
                  "**Pseudoparasites** ที่หลอกได้: yeasts, plant remnants and debris",
                  "**Trophozoites are rarely seen in direct fecal smears** จะเจอได้จาก rectum และ diarrheic feces",
                  "การเคลื่อนที่ของ trophozoite: **tumbling หรือ falling-leaf motion**"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 7 มีสไลด์ควิซรูป \"Which ones are Giardia cyst?\" ที่มีตัวเลือก A-E พร้อมภาพ fungal spore และ iodine-stained yeast ปนอยู่ แต่สไลด์ไม่ได้เฉลยว่าอันไหนคือ cyst",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Giardia: Tx",
        "source": "Lect 7 Part 1 Mucosoflagellates p.8",
        "body": [
          {
            "sub": "Dogs",
            "body": [
              {
                "bullets": [
                  "**Fenbendazole 50 mg/kg once daily for 3-5 days**",
                  "Febantel-pyrantel-praziquantel",
                  "**Albendazole** ระวัง **bone marrow toxicosis**",
                  "Quinacrine 6.6 mg/kg twice a day for 5 days",
                  "**Metronidazole 22 mg/kg orally twice a day for 5 days**",
                  "Tinidazole 44 mg/kg once daily for 3 days"
                ]
              }
            ]
          },
          {
            "sub": "Cats",
            "body": [
              {
                "bullets": [
                  "**Metronidazole 22-25 mg orally twice a day for 5-7 days** (สไลด์เขียนหน่วยเป็น mg ไม่ใช่ mg/kg)",
                  "Febantel-pyrantel-praziquantel ที่ 37.8 mg/kg, 7.56 mg/kg และ 7.56 mg/kg ตามลำดับ"
                ]
              }
            ]
          },
          {
            "sub": "หลักการรักษา",
            "body": [
              {
                "bullets": [
                  "คนและสัตว์ส่วนใหญ่จะสัมผัส cyst แต่ **ส่วนใหญ่ไม่ป่วย**",
                  "**Strongly recommended ให้รักษาในสุนัขและแมว** เพราะ possible zoonotic risk",
                  "หลายเคส **ไม่ตอบสนองต่อการรักษาครั้งแรก** ซึ่งอาจเป็นเพราะ **re-infection**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Giardia: prevention, control และ vaccination",
        "source": "Lect 7 Part 1 Mucosoflagellates p.8",
        "body": [
          {
            "sub": "Prevention and control",
            "body": [
              {
                "bullets": [
                  "Hygiene and sanitation",
                  "ป้องกัน fecal contamination ของ feed และ water supplies",
                  "**Disinfection ของสิ่งแวดล้อม: Lysol (2-5%), Sterinol (1%), chlorine bleach (sodium hypochlorite 1%)**",
                  "**Reduce the stressful environment**"
                ]
              }
            ]
          },
          {
            "sub": "Vaccination",
            "body": [
              {
                "bullets": [
                  "มี vaccine ที่ approved สำหรับป้องกัน giardiasis ใน USA คือ **Canine GiardiaVax** และ **Feline Fel-O-Vax**",
                  "**The efficacy is not proven** ว่าป้องกัน infection ได้ในสุนัขหรือแมว",
                  "Canine vaccine guidelines ของ American Animal Hospital Association 2006 จัดไว้ใน **\"Not recommended category\"**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Trichomonads: species และจำนวน flagella",
        "source": "Lect 7 Part 1 Mucosoflagellates p.9",
        "body": [
          {
            "sub": "Species กับ host",
            "body": [
              {
                "bullets": [
                  "**Trichomonas vaginalis: human**",
                  "**Tritrichomonas foetus: bovine, feline, porcine**",
                  "**Trichomonas gallinae: birds (pigeon)**"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างร่วม",
            "body": [
              {
                "bullets": [
                  "เป็น flagellate ที่มี **2-5 free anterior flagella** (ขึ้นกับ species) และ **one posterior flagellum**",
                  "**Tritrichomonas foetus: 3 anterior flagella**",
                  "**Trichomonas gallinae: 4 anterior flagella**",
                  "**Trichomonas vaginalis: 4 anterior flagella**",
                  "**Pentatrichomonas hominis: 5 anterior flagella**",
                  "Posterior flagellum วิ่งไปกับ **undulating membrane** แล้วมี free posterior flagellum",
                  "**Single nucleus**",
                  "**Axostyle** ที่ยื่นออกจาก basal body เป็น microtubule"
                ]
              }
            ]
          },
          {
            "callout": "ชื่อสกุลบอกจำนวน flagella ให้เอง: Tri- = 3, Penta- = 5 ส่วน Trichomonas ในสไลด์นี้ทั้งสองตัว (vaginalis, gallinae) = 4",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Trichomonads: ชีววิทยาทั่วไป",
        "source": "Lect 7 Part 1 Mucosoflagellates p.10",
        "body": [
          {
            "bullets": [
              "พบใน **intestinal tract หรือ reproductive tract ของ mammals**",
              "มีทั้ง **pathogenic และ non-pathogenic**",
              "แบ่งตัวแบบ **longitudinal binary fission**",
              "**No cyst stage**",
              "มี mitochondria และ golgi complex"
            ]
          },
          {
            "callout": "**No cyst stage** คือจุดต่างสำคัญจาก Giardia (ย้ำอีกครั้งในสไลด์แมว หน้า 15)",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Tritrichomonas foetus: history",
        "source": "Lect 7 Part 1 Mucosoflagellates p.10",
        "body": [
          {
            "bullets": [
              "1888: โรคนี้ถูกอธิบายครั้งแรกโดย Kunstler",
              "1900: Mazzanti (นักวิทยาศาสตร์ชาวอิตาลี) ค้นพบ T. foetus โดยรายงาน trichomonads จากโคที่ถูกฆ่า 2 ตัวและ heifer 1 ตัว ที่มีปัญหา infertility",
              "1924-1929: รายงานโรคในเยอรมนีโดย Drescher, Riedmuller และ Abelein",
              "1928: ชื่อ **Trichomonas foetus** ถูกเสนอครั้งแรกโดย Riedmuller (พบใน 9 จาก 105 aborted fetuses)",
              "1932: first report case of trichomonosis ใน USA"
            ]
          }
        ]
      },
      {
        "heading": "Tritrichomonas foetus: morphology (สายพันธุ์โค)",
        "source": "Lect 7 Part 1 Mucosoflagellates p.10",
        "body": [
          {
            "bullets": [
              "ขนาด **10-25 μm** รูปร่าง **pear-shaped trichomonad**",
              "**Single nucleus**",
              "มี **rodlike axostyle** ยื่นออกจากปลาย posterior ที่แหลมกว่า",
              "**3 anterior flagella** และ **undulating membrane** ที่มี long trailing flagellum ยื่นเลย undulating membrane ออกไป",
              "**No cyst stage**"
            ]
          }
        ]
      },
      {
        "heading": "T. foetus: serotype และการแยก taxonomy กับ T. suis",
        "source": "Lect 7 Part 1 Mucosoflagellates p.11",
        "body": [
          {
            "sub": "Serotype",
            "body": [
              {
                "bullets": [
                  "มี **3 serotypes: var. brisbane, var. belfast, var. manley**",
                  "แยกด้วย agglutination, passive hemagglutination และ skin tests",
                  "**Antigenic types ดูเหมือนไม่มีบทบาทสำคัญต่อ immunity ของ T. foetus**",
                  "Heifers ที่ immunized ด้วย serotype หนึ่ง พัฒนา resistance ต่อทั้ง homologous และ heterologous strains"
                ]
              }
            ]
          },
          {
            "sub": "Synonymy กับ T. suis ในสุกร",
            "body": [
              {
                "bullets": [
                  "Trichomonad cultures จากสุกร (nasal และ digestive tract) เมื่อ inoculate เข้า reproductive tract ของโค ทำให้เกิด apparent infection",
                  "ใช้ **Random amplified polymorphic DNA technique** เปรียบเทียบหลาย isolates ของ T. foetus และ T. suis",
                  "**Genetical genomic fingerprints ของสอง isolates นี้บอกว่าเป็น variants ของ species เดียวกัน**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Bovine genital trichomoniasis: ภาพรวมในฝูง",
        "source": "Lect 7 Part 1 Mucosoflagellates p.12",
        "body": [
          {
            "bullets": [
              "เป็น **venereal disease**",
              "**Bulls are the long-term carriers** และเป็น **inapparent infection** จึงเป็นตัวกระจายโรคในฝูง ตำแหน่งที่พบคือ **prepuce, penis, epididymis, vas deferens** เก็บตัวอย่างด้วย **preputial swabs/washing**",
              "**Cows clear infection spontaneously ประมาณ 4 เดือน** และเป็น apparent ในโคและ heifers ที่ **vagina, uterus และ macerated fetus**",
              "**Clinical signs: infertility, abortion, pyometra และบางครั้งพบ fetal mummification**"
            ]
          },
          {
            "callout": "จับคู่ให้ถูกว่า long-term carrier + inapparent = bulls ส่วน clear เองได้ + แสดงอาการ = cows/heifers",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "T. foetus: transmission",
        "source": "Lect 7 Part 1 Mucosoflagellates p.12",
        "body": [
          {
            "bullets": [
              "เป็น **venereal disease** ติดผ่าน **natural breeding**",
              "**Coital exposure** จาก persistently infected male",
              "**Passive transmission**: จาก bull ที่เดิมไม่ติดเชื้อแต่เพิ่ง coitus กับ female ที่ติดเชื้อ โดยห่างกัน **น้อยกว่า 20 นาที** ซึ่งสไลด์ระบุว่า **much less important** ในการแพร่โรค",
              "Infected bull ผสมกับ susceptible female (cow หรือ heifer)",
              "Susceptible bull ผสมกับ infected female",
              "**Increased bull-to-cow ratio ทำให้โอกาสเกิดโรคสูงขึ้น**"
            ]
          }
        ]
      },
      {
        "heading": "T. foetus: pathogenesis ในเพศผู้",
        "source": "Lect 7 Part 1 Mucosoflagellates p.12",
        "body": [
          {
            "bullets": [
              "อยู่ใน secretions ของ epithelial lining ของ **penis, prepuce และ distal urethra**",
              "**Does not invade the epithelium**",
              "มี minimal purulent discharge จาก prepuce ในช่วง 2 สัปดาห์แรกของการติดเชื้อ",
              "**No significant pathologic lesion**",
              "**Older bull (3-4 ปีขึ้นไป): chronic carrier stage** สัมพันธ์กับการที่ epithelial crypts ของ penis และ prepuce ลึกขึ้น ทำให้เป็น **suitable microaerophilic environment**",
              "**Young bull: transient carrier** ติดเชื้ออยู่ช่วงสั้นๆ"
            ]
          }
        ]
      },
      {
        "heading": "T. foetus: pathogenesis ในเพศเมีย",
        "source": "Lect 7 Part 1 Mucosoflagellates p.12",
        "body": [
          {
            "bullets": [
              "เชื้อเข้าสู่ uterine lumen ผ่าน **cervix ระหว่าง estrus**",
              "**Colonization ทั่ว reproductive tract ภายใน 1-2 สัปดาห์**",
              "รบกวน fertilization และ development of embryo",
              "**Conceptus death ที่ 50-70 วันของ gestation**",
              "**Prolonged interestrous interval**",
              "**การกำจัดเชื้อออกจากตัวเมียแปรปรวนมาก ตั้งแต่ 95 วัน ถึง 22 เดือน**",
              "Clinical signs: **mild vaginitis, pyometra, abortion**"
            ]
          }
        ]
      },
      {
        "heading": "T. foetus: pathogenesis ในลูกในท้อง",
        "source": "Lect 7 Part 1 Mucosoflagellates p.13",
        "body": [
          {
            "bullets": [
              "มี **tissue-invasive effect ใน last trimester abortion**",
              "**Necrotizing enteritis**",
              "**Pyogranulomatous bronchopneumonia** ที่มี tissue invasion โดย T. foetus",
              "**กลไกที่ทำให้ conceptus ตายหรือเกิด mucosal injury ของ fetus ยังไม่ทราบ** สไลด์ระบุว่า unknown mechanism",
              "มี cytotoxic และ hemolytic effect ต่อ mammalian cells และมี **a surface adhesin**"
            ]
          },
          {
            "text": "สไลด์คู่กันเป็นรูปพยาธิสภาพ: mild diffuse endometritis and exudate และ bovine chorioallantois ที่มี cotyledons with placenta edema พร้อมลูกศรชี้ areas of **adventitial placentation**"
          }
        ]
      },
      {
        "heading": "T. foetus: immune response",
        "source": "Lect 7 Part 1 Mucosoflagellates p.13",
        "body": [
          {
            "bullets": [
              "**Ab และ complement ช่วย promote protection** ต่อ T. foetus",
              "**T. foetus ถูกฆ่าได้โดย bovine complement** และ specific antibody เพิ่ม complement-mediated killing ได้มาก",
              "**Leukocyte**: T. foetus ที่ถูก opsonized ด้วย Ab และ complement ทำให้ bovine neutrophils ฆ่าได้สูงสุด"
            ]
          }
        ]
      },
      {
        "heading": "ลักษณะโรคและ DDx ของ bovine trichomonosis",
        "source": "Lect 7 Part 1 Mucosoflagellates p.13",
        "body": [
          {
            "bullets": [
              "**ไม่มี pathognomonic signs**",
              "**Nonclinical carrier state ของ bulls**",
              "พบอาการ infertility ในตัวเมียเป็นครั้งคราว",
              "ตัวเมียที่ติดเชื้อสุดท้ายก็ตั้งท้องได้ เพียงแต่ **calving interval ยาวขึ้น**"
            ]
          },
          {
            "sub": "DDx",
            "body": [
              {
                "bullets": [
                  "**Campylobacter foetus**",
                  "**Leptospira hardjo**",
                  "**Ureaplasma sp.**",
                  "Nutritional condition และอื่นๆ (สไลด์เขียน Etc. ไม่ได้ไล่ต่อ)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Tritrichomonas foetus: Dx ในโค",
        "source": "Lect 7 Part 1 Mucosoflagellates p.14",
        "body": [
          {
            "sub": "หลักการวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "Clinical signs",
                  "**Host and site specificity**",
                  "**Microscopic examination** โดยดูจำนวน anterior และ trailing flagella",
                  "Molecular technique",
                  "**ระวัง fecal contamination** เพราะสับสนกับ intestinal flagellates ได้",
                  "**T. foetus ตรวจพบได้ภายใน 14-20 วัน** จาก vaginal discharges ของ virgin heifer หลัง coitus กับ bull ที่ติดเชื้อ",
                  "**Culture technique: InPouch TF transport and culture kit**"
                ]
              }
            ]
          },
          {
            "sub": "Microscopic Dx",
            "body": [
              {
                "bullets": [
                  "**ตัวอย่าง**: suspended preputial secretions, smegma, fluids จาก cervicovaginal mucus หรือ uterine fluid",
                  "**Wet mount ด้วย normal saline** เพื่อดู motility ซึ่งมีลักษณะเฉพาะคือ **spiral, jerky movement**",
                  "**Staining slide ที่ 400x** เพื่อดู 3 anterior flagella, one posterior flagellum และ undulating membrane",
                  "สำคัญที่ต้อง **differentiate จาก contaminant flagellate ตัวอื่น**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Bovine genital trichomoniasis: Tx, control และ vaccination",
        "source": "Lect 7 Part 1 Mucosoflagellates p.14",
        "body": [
          {
            "sub": "Tx",
            "body": [
              {
                "bullets": [
                  "**Metronidazole 75 mg/kg i.v. 3 ครั้ง ห่างกัน 12 ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "sub": "Control",
            "body": [
              {
                "bullets": [
                  "**Artificial insemination** เพราะ **semen is not infectious**",
                  "**Culling infected bulls** แล้วแทนที่ด้วย younger uninfected bulls",
                  "**Sexual rest ในโคและ heifers**"
                ]
              }
            ]
          },
          {
            "sub": "Vaccination",
            "body": [
              {
                "bullets": [
                  "**TrichGuard (Fort Dodge)** เป็น USDA-approved trichomonosis vaccine ใน USA",
                  "เป็น **Freund adjuvant killed protozoal-derived vaccine**",
                  "ให้ใน **all herd females ไม่มีประโยชน์ในโคเพศผู้**",
                  "**ฉีด s/c 2 เข็ม ห่างกัน 2-4 สัปดาห์ โดยเข็มสุดท้ายให้ 4 สัปดาห์ก่อนเริ่ม breeding season** แล้ว booster เข็มเดียวทุกปี (4 สัปดาห์ก่อน breeding season)",
                  "**Vaccine efficacy: ไม่ป้องกัน infection หรือ disease แต่ลด severity และ duration ของโรค**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Tritrichomonas foetus ในแมว: ภาพรวม",
        "source": "Lect 7 Part 1 Mucosoflagellates p.15",
        "body": [
          {
            "bullets": [
              "**Tritrichomoniasis in cat เป็น emerging infectious diarrheal disease ของแมวทั่วโลก**",
              "**Prevalent in shelters และ purebred show cats**",
              "พบใน densely housed young cats",
              "**Fecal-oral transmission เกิดได้ง่าย**",
              "**เป็นเชื้อตัวเดียวกับที่ทำให้เกิด early abortion และ infertility ในโคที่ผสมตามธรรมชาติ**"
            ]
          }
        ]
      },
      {
        "heading": "Tritrichomonas foetus ในแมว: morphology",
        "source": "Lect 7 Part 1 Mucosoflagellates p.15",
        "body": [
          {
            "bullets": [
              "อยู่ในกลุ่ม **Parabasalia**",
              "**Pear-shaped with one nucleus**",
              "มี **rodlike axostyle**",
              "**No cyst stage**",
              "เป็น small flagellates ขนาด **8-11 x 3-4 μm**",
              "**3 free anterior flagella** และ recurrent flagellum อีก 1 เส้นที่สร้าง **well-developed undulating membrane** โดยปลายด้าน posterior เป็นอิสระ",
              "**Binary fission within the intestine**"
            ]
          },
          {
            "callout": "เทียบขนาดกับตัวในโค (10-25 μm) ตัวเลขที่สไลด์ให้สำหรับแมวเล็กกว่าชัดเจน (8-11 x 3-4 μm) แต่สไลด์ไม่ได้อธิบายว่าทำไมต่างกัน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "T. foetus ในแมว: pathogenesis",
        "source": "Lect 7 Part 1 Mucosoflagellates p.16",
        "body": [
          {
            "bullets": [
              "เป็น **intestinal pathogen ในแมว**",
              "พบใน **feline uterus ที่มี pyometra** ได้ด้วย",
              "**พบได้น้อยมากใน intestinal tract ของสุนัข**",
              "ทำให้เกิด **chronic large bowel diarrhea**",
              "**Colonize ที่ feline ileum, cecum และ colon**",
              "Proposed pathogenesis: enteritis จากการเปลี่ยนแปลงของ mucosa surface และการแทรกของ inflammatory cells รวมถึงการเปลี่ยนแปลงของ normal intestinal flora",
              "**Isolates ของ T. foetus จากโคติดเชื้อในแมวได้ และในทางกลับกันก็เช่นกัน**"
            ]
          }
        ]
      },
      {
        "heading": "T. foetus ในแมว: clinical signs",
        "source": "Lect 7 Part 1 Mucosoflagellates p.16",
        "body": [
          {
            "bullets": [
              "แมวบางตัว **asymptomatic** เพราะ trichomonads มักเป็น **commensal organisms** ที่ไม่ทำให้เกิดอาการใน host",
              "**Chronic large bowel diarrhea แต่ body condition และ appetite ยังดี**",
              "พบ **blood, mucus, flatulence, tenesmus และ anal irritation**",
              "**Malodorous feces**"
            ]
          }
        ]
      },
      {
        "heading": "T. foetus ในแมว: Dx และ DDx",
        "source": "Lect 7 Part 1 Mucosoflagellates p.16",
        "body": [
          {
            "bullets": [
              "มักได้รับการวินิจฉัย **หลังจากที่ diarrhea ไม่ตอบสนองต่อ routine therapies**",
              "**Direct fecal smear** ดู erratic motility จาก fresh feces หรือ cultured feces",
              "**InPouch TF-Feline: gold standard Dx ในแมว** โดยสไลด์ใส่เครื่องหมายคำถามกำกับไว้ (?)"
            ]
          },
          {
            "sub": "DDx",
            "body": [
              {
                "bullets": [
                  "**Giardia**: ขนาดใกล้เคียงกันแต่ **เคลื่อนที่ต่างกัน (falling leaf)**",
                  "**Nonpathogenic intestinal trichomonads เช่น Pentatrichomonas hominis**",
                  "Rule out infectious pathogens อื่นและ nutritional problems"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การเคลื่อนที่: ตัวแยกที่ใช้ได้ใต้กล้อง",
        "source": "Lect 7 Part 1 Mucosoflagellates p.17",
        "body": [
          {
            "bullets": [
              "**Giardia spp. = \"A falling leaf\"**",
              "**Tritrichomonas foetus = \"Erratic movement\"**"
            ]
          },
          {
            "text": "ตัวอักษรบนสไลด์มีเพียงชื่อเชื้อและวลีบรรยายการเคลื่อนที่ ไม่มีคำอธิบายอื่น"
          },
          {
            "callout": "ในสไลด์ Dx ของโค (p.14) ใช้คำว่า **spiral, jerky movement** สำหรับ T. foetus ซึ่งเป็นคำเดียวกับ erratic movement ตรงนี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "New species of Tritrichomonas in cats",
        "source": "Lect 7 Part 1 Mucosoflagellates p.18",
        "body": [
          {
            "text": "สไลด์นี้เป็นแผนภาพ ข้อความบนสไลด์มีแค่คำว่า Morphology, Pathogenicity, Phylogenic และปลายทางคือ **New Tritrichomonas blagburni species**"
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าใช้เกณฑ์อะไรตัดสิน ไม่ได้บอกความต่างจาก T. foetus และไม่ได้บอกความสำคัญทางคลินิก จำแค่ว่ามีการเสนอ species ใหม่ชื่อ Tritrichomonas blagburni ในแมว",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "T. foetus ในแมว: Tx และ control",
        "source": "Lect 7 Part 1 Mucosoflagellates p.18",
        "body": [
          {
            "bullets": [
              "**No approved treatment ในแมว**",
              "**ไม่มี antimicrobial ตัวใดที่ทำให้อาการหายได้** มียาที่ถูกแนะนำหลายตัวแต่ success ยังจำกัด",
              "**Ronidazole 30 mg/kg once a day for 10 days** ซึ่ง **not readily available** และ **ต้องใช้อย่างระวังเพราะ neurologic side effects**",
              "**Sanitation ของแมวใน cattery เป็นเรื่องวิกฤต** เพราะ trichomonads อยู่นอก host ได้ไม่นาน สัตว์ปล่อยเชื้อลงสิ่งแวดล้อม และแมวมีพฤติกรรม constant grooming"
            ]
          }
        ]
      },
      {
        "heading": "Avian trichomoniasis (Canker)",
        "source": "Lect 7 Part 1 Mucosoflagellates p.19",
        "body": [
          {
            "sub": "เชื้อและการติดต่อ",
            "body": [
              {
                "bullets": [
                  "เรียกว่า **Canker** ในนกพิราบและนกเขา host หลักคือ pigeon และนกอื่นๆ",
                  "เชื้อคือ **Trichomonas gallinae** ขนาด **6-19 x 2-5 μm**",
                  "**4 anterior flagella และ no free flagellum**",
                  "**Transmission ผ่าน pigeon milk ที่สร้างจาก crop mucosa จากแม่สู่ลูกนก** และผ่าน drinking water (พบน้อย)",
                  "**Common in Thailand**"
                ]
              }
            ]
          },
          {
            "sub": "อาการและรอยโรค",
            "body": [
              {
                "bullets": [
                  "**นกอายุน้อย 1-3 สัปดาห์ susceptible**",
                  "อวัยวะที่ได้รับผลกระทบ: **oral cavity, sinus, pharynx, esophagus, crop** และอาจ disseminate ไปยัง visceral organ",
                  "**Lesions: yellow button หรือลักษณะ cheesy**",
                  "สไลด์บรรยายว่าอาการที่พบบ่อยที่สุดของ canker คือ **yellow หรือ brownish cheeselike growth ในช่องปาก ซึ่งมักอยู่ลึกไปทางด้านหลังของปาก**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ให้ Tx หรือ control ของ avian trichomoniasis เลย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Trichomonad และ flagellates/ciliate ในสุกร",
        "source": "Lect 7 Part 1 Mucosoflagellates p.19",
        "body": [
          {
            "bullets": [
              "**Trichomonad in pig: พบใน intestines หรือ mucosal scraping**",
              "**Non-pathogenic**"
            ]
          },
          {
            "text": "หัวข้อ Flagellates and ciliate in pig เป็นสไลด์รูปล้วน ต่อเนื่องถึงหน้า 20 มีคำบรรยายภาพเพียงว่า Diarrheal pig, May'17 และเด็คปิดท้ายด้วยสไลด์ Any question?"
          },
          {
            "callout": "สไลด์ไม่ได้ระบุชื่อ species ของ flagellates และ ciliate ที่พบในสุกรจากรูปเหล่านี้ และไม่ได้อธิบายความสำคัญทางคลินิกไว้",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "parasit-1--lect-7-part-2-hemoflagellates": {
    "topic": "parasit-1--lect-7-part-2-hemoflagellates",
    "title": "Lect 7 Part 2 Hemoflagellates",
    "icon": "📖",
    "lecturer": "Assist. Prof. Woraporn Sukhumavasi, DVM, Ph.D.",
    "summary": "เด็คนี้แบ่งเป็นสองครึ่งชัดเจน ครึ่งแรกเป็น Trypanosoma spp. (นิยาม flagellate, forms ในโฮสต์, morphology, เส้นทางการถ่ายทอดแบบ salivarian/stercorarian/mechanical/venereal, ตารางสปีชีส์สำคัญ, การวินิจฉัยตาม OIE) ครึ่งหลังเป็น Leishmania spp. (developmental stages, การถ่ายทอดโดย sandfly, ตำแหน่งที่ติดเชื้อ, cutaneous/visceral/mucocutaneous, รายชื่อสปีชีส์) แล้วลงลึกเรื่องสถานการณ์ในประเทศไทยมาก ทั้ง autochthonous cases, สปีชีส์ที่เพิ่งตั้งชื่อใหม่ (L. martiniquensis, L. siamensis, L. orientalis), reservoir, vector ที่สงสัย และผลซีโรโลยีในสุนัข-แมวไทย ⚠️ สไลด์จำนวนมากในครึ่งหลัง (โดยเฉพาะ p.6-7, p.14, p.16-17, p.25-29) เป็นรูปภาพ แผนที่ หรือกราฟล้วน ไม่มีข้อความอธิบาย โน้ตส่วนนั้นจึงสั้นตามของจริง",
    "sections": [
      {
        "heading": "Flagellates คืออะไร และแบ่งเป็นกลุ่มไหนบ้าง",
        "source": "Lect 7 Part 2 Hemoflagellates p.1",
        "body": [
          {
            "text": "Flagellates คือ protozoa ที่เคลื่อนที่ด้วยเส้นใยหดตัวได้คล้ายแส้ เรียกว่า **flagellum/flagella** อาจมีเส้นเดียวหรือหลายเส้น ส่วนใหญ่เป็น commensal หรือ symbiont แม้ว่าบางชนิดจะเป็น pathogen ที่อันตราย"
          },
          {
            "sub": "Pathogenic flagellates แบ่งตามที่อยู่ในร่างกายเป็น 2 กลุ่ม",
            "body": [
              {
                "bullets": [
                  "**Hemoflagellates** อยู่ภายใน body tissues โดยเฉพาะ blood และ lymph ได้แก่ Trypanosoma spp. และ Leishmania spp.",
                  "**Mucosoflagellates** ไม่ penetrate เข้าเนื้อเยื่อ แต่อยู่ใน lumen ของ alimentary tract, uterus หรือ prepuce ได้แก่ Giardia spp. และ Trichomonads"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์หน้านี้พิมพ์ชื่อ T. equiperdum ไว้ด้วย แต่การจัดคอลัมน์อ่านไม่ชัดว่าอยู่ฝั่ง hemoflagellates หรือ mucosoflagellates ให้ดูสไลด์จริงประกอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ภาพรวม Hemoflagellates",
        "source": "Lect 7 Part 2 Hemoflagellates p.2",
        "body": [
          {
            "bullets": [
              "มี 2 genera หลักคือ **Trypanosoma** และ **Leishmania**",
              "ทั้งสองสำคัญที่สุดในเขต tropical และ subtropical climates",
              "เป็น **indirect life cycle** ใช้แมลงเป็น vector และมี life-cycle stages ที่รูปร่างต่างกันต่อเนื่องกันเป็นลำดับ"
            ]
          }
        ]
      },
      {
        "heading": "Forms ของ hemoflagellates ในโฮสต์ mammal",
        "source": "Lect 7 Part 2 Hemoflagellates p.2",
        "body": [
          {
            "text": "ในโฮสต์ mammal พบ 2 forms"
          },
          {
            "bullets": [
              "**Trypomastigote** อยู่ใน blood plasma",
              "**Amastigote** เป็น intracellular form"
            ]
          },
          {
            "callout": "**ไม่ใช่ hemoflagellate ทุกตัวที่มี amastigote stage** สไลด์ระบุว่า amastigote เป็นลักษณะเฉพาะของการติดเชื้อ Trypanosoma cruzi และ Leishmania spp.",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "โรคที่เกิดจาก Trypanosoma",
        "source": "Lect 7 Part 2 Hemoflagellates p.3",
        "body": [
          {
            "sub": "ในคน ทำให้เกิดโรครุนแรง",
            "body": [
              {
                "bullets": [
                  "**Sleeping sickness** ที่ Africa จาก **T. brucei** (บาง subspecies)",
                  "**Chagas disease** ในบางส่วนของ Latin America จาก **T. cruzi**"
                ]
              }
            ]
          },
          {
            "sub": "ใน ruminants และ draught animals ทำให้ตายและเป็นโรคเรื้อรัง",
            "body": [
              {
                "bullets": [
                  "**Surra** ที่ Sub-Saharan Africa และ Asia จาก **T. evansi**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Morphology ของ Trypanosoma",
        "source": "Lect 7 Part 2 Hemoflagellates p.3",
        "body": [
          {
            "bullets": [
              "ความยาวมากกว่า **20 µm**",
              "มี flagellum เส้นเดียว ออกจากบริเวณ hind end ของตัวปรสิต จาก basal body ที่ติดสีเข้ม เรียกว่า **kinetosome/kinetoplast**",
              "flagellum ทอดคดเคี้ยวไปตามความยาวลำตัวก่อน โดยถูกยึดไว้ด้วย **undulating membrane**",
              "ส่วนที่เหลือของ flagellum เป็นอิสระและยื่นออกไปทางด้านหน้า (anteriorly)",
              "ระยะที่แสดงในสไลด์คือ **trypomastigote stage** ซึ่งว่ายน้ำแบบ **corkscrew movement**"
            ]
          }
        ]
      },
      {
        "heading": "Life cycle ของ Trypanosoma: indirect กับ direct",
        "source": "Lect 7 Part 2 Hemoflagellates p.4",
        "body": [
          {
            "sub": "Indirect",
            "body": [
              {
                "bullets": [
                  "ใช้ **biological vector**",
                  "มี **multiplication ใน insect gut**",
                  "เดินตามเส้นทาง **Salivarian** หรือ **Stercorarian** อย่างใดอย่างหนึ่ง ขึ้นกับสปีชีส์ของ trypanosome"
                ]
              }
            ]
          },
          {
            "sub": "Direct",
            "body": [
              {
                "bullets": [
                  "ผ่าน insect vector แบบ **mechanical vector** คือ **ไม่มี multiplication ภายใน vector** ตัวอย่างคือ **T. evansi**",
                  "ผ่าน coitus คือ **venereal transmission** ตัวอย่างคือ **T. equiperdum**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Indirect transmission: Salivarian กับ Stercorarian",
        "source": "Lect 7 Part 2 Hemoflagellates p.4",
        "body": [
          {
            "sub": "Salivarian",
            "body": [
              {
                "bullets": [
                  "Vector คือ **Tsetse fly** สปีชีส์ที่ใช้เส้นทางนี้คือ **T. congolense, T. brucei, T. vivax**",
                  "ลำดับ: blood meal เข้า insect gut ➜ **salivary glands** (multiplication of trypanosome) ➜ **saliva** ➜ inoculate เข้าโฮสต์ตัวใหม่"
                ]
              }
            ]
          },
          {
            "sub": "Stercorarian",
            "body": [
              {
                "bullets": [
                  "Vector คือ **Reduviid bug (Triatomine)** สปีชีส์คือ **T. cruzi**",
                  "ลำดับ: blood meal เข้า insect gut ➜ **rectum** (multiplication of trypanosome) ➜ **feces** ➜ ลงบน skin ของโฮสต์ตัวใหม่",
                  "trypanosomes ถูกถูไถและเข้าสู่ร่างกายทาง bite wound แผลถลอกอื่น หรือทาง mucous membrane"
                ]
              }
            ]
          },
          {
            "callout": "จุดต่างที่ออกสอบง่าย: Salivarian เข้าทาง **น้ำลาย** ของแมลง ส่วน Stercorarian เข้าทาง **อุจจาระ** ของแมลงที่ถูกถูเข้าแผล",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Direct transmission: T. evansi กับ T. equiperdum",
        "source": "Lect 7 Part 2 Hemoflagellates p.4",
        "body": [
          {
            "sub": "T. evansi (mechanical transfer)",
            "body": [
              {
                "bullets": [
                  "พาหะที่ระบุในสไลด์: **Tabanid fly, Stable fly, Vampire bat**",
                  "กลไก: infected blood จากโฮสต์ตัวหนึ่ง ➜ **interrupted feeding** ➜ แมลงรีบหาโฮสต์ตัวใหม่เร็ว ➜ mechanical transfer สู่ new host"
                ]
              }
            ]
          },
          {
            "sub": "T. equiperdum (venereal)",
            "body": [
              {
                "bullets": [
                  "จาก **genital tract** ของม้าตัวหนึ่ง ➜ **coitus** ➜ ม้าตัวใหม่ ไม่ต้องใช้แมลงเลย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตาราง Trypanosoma species ที่สำคัญ",
        "source": "Lect 7 Part 2 Hemoflagellates p.5",
        "body": [
          {
            "bullets": [
              "**T. evansi** โรค **Surra** โฮสต์กว้าง (cattle, horse, pig, camel, dog ฯลฯ) vector = Tabanid fly, Stable fly การถ่ายทอดแบบ Mechanical กระจายใน Asia, North Africa, South America",
              "**T. equiperdum** โรค **Dourine** โฮสต์คือ **Horse** vector = **None** การถ่ายทอดแบบ Venereal กระจายใน Mediterranean area, South Africa, South America",
              "**T. congolense** โฮสต์กว้าง vector = Tsetse fly การถ่ายทอดแบบ Salivarian กระจายใน Sub-Saharan Africa",
              "**T. brucei** โรค **Sleeping sickness** (บาง subspecies) โฮสต์กว้างและแตกต่างกันตาม subspecies vector = Tsetse fly แบบ Salivarian กระจายใน Sub-Saharan Africa",
              "**T. vivax** โฮสต์กว้าง vector = Tsetse fly แบบ Salivarian กระจายใน Africa, South America",
              "**T. cruzi** โรค **Chagas** โฮสต์คือ armadillo, possum, human vector = **Reduviid bug** แบบ Stercorarian กระจายใน South America"
            ]
          },
          {
            "text": "หน้าเดียวกันมี phylogenetic tree ของ Trypanosoma species ที่สร้างจาก **SSU rRNA sequences** และแผนที่ distribution แต่เป็นรูปล้วน ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "Surra ในสัตว์ชนิดต่าง ๆ",
        "source": "Lect 7 Part 2 Hemoflagellates p.6",
        "body": [
          {
            "text": "สไลด์ชุดนี้เป็น **ภาพถ่ายล้วน** ได้แก่ distribution ของ T. evansi และภาพ Surra ใน horse, cattle, pig และต่อไปที่ p.7 คือ Surra ใน dog อ้างอิงภาพจาก Desquesnes et al. 2013 BioMed Research International สไลด์ไม่ได้เขียนบรรยายอาการทางคลินิกของแต่ละสปีชีส์ไว้เป็นตัวอักษร"
          }
        ]
      },
      {
        "heading": "การวินิจฉัย Trypanosoma spp. (ตาม OIE 2008)",
        "source": "Lect 7 Part 2 Hemoflagellates p.7",
        "body": [
          {
            "sub": "Identification of agent: Direct methods",
            "body": [
              {
                "bullets": [
                  "Usual field methods",
                  "Concentration methods",
                  "**Animal inoculation**",
                  "**Recombinant DNA probes** เพื่อ detection of trypanosomal DNA"
                ]
              }
            ]
          },
          {
            "sub": "Indirect methods",
            "body": [
              {
                "bullets": [
                  "**Hematology**",
                  "**Serological test**"
                ]
              }
            ]
          },
          {
            "sub": "Direct methods: usual field methods",
            "body": [
              {
                "bullets": [
                  "Blood sampling",
                  "**Wet blood films**",
                  "**Stained thick smears**",
                  "**Stained thin smears**",
                  "**Lymph node biopsies**"
                ]
              }
            ]
          },
          {
            "sub": "Direct methods: concentration methods",
            "body": [
              {
                "bullets": [
                  "**Hematocrit centrifugation (Woo's technique)**",
                  "**Dark-ground/phase-contrast buffy coat technique**",
                  "**Hemolysis techniques**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Serological test สำหรับ Trypanosoma",
        "source": "Lect 7 Part 2 Hemoflagellates p.8",
        "body": [
          {
            "bullets": [
              "**ELISA**",
              "**Card agglutination tests (CATT)**",
              "**Latex agglutination tests (LAT)**"
            ]
          }
        ]
      },
      {
        "heading": "Case report: Canine trypanosomosis ในประเทศไทย (2015) — สัตว์ป่วยและอาการนำ",
        "source": "Lect 7 Part 2 Hemoflagellates p.8",
        "body": [
          {
            "text": "เป็น case report ชื่อ Molecular Diagnosis and Treatment of Canine Trypanosomosis: a Case Report in Thailand ปี 2015"
          },
          {
            "sub": "Signalment และประวัติ",
            "body": [
              {
                "bullets": [
                  "สุนัขพันธุ์ผสม เพศผู้ไม่ทำหมัน อายุ **3 ปี** จังหวัด **ตรัง** BCS **2/5**",
                  "ไม่เคยทำ routine vaccination",
                  "ไม่มี tick prevention",
                  "เลี้ยงแบบ free-roaming และอยู่ **outdoor 100%**",
                  "มีพฤติกรรม scavenging ตลอด"
                ]
              }
            ]
          },
          {
            "sub": "Chief complaints",
            "body": [
              {
                "bullets": [
                  "**ตาขวา third eyelid protrusion มา 2 วัน**",
                  "ตาซ้ายเคยมีปัญหาคล้ายกันร่วมกับ hyperlacrimation มา 1 สัปดาห์ แต่หายเองได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Case report: Physical examination และแผนการวินิจฉัย",
        "source": "Lect 7 Part 2 Hemoflagellates p.9",
        "body": [
          {
            "sub": "Physical examination",
            "body": [
              {
                "bullets": [
                  "**High fever 106.0 °F**",
                  "**Pale mucous membrane**",
                  "Panting",
                  "**Dehydration 7%**",
                  "Depression",
                  "ตาขวา: severe inflammation ของ 3rd eyelid และ inflammation ของ palpebral conjunctiva ร่วมกับ purulent ocular discharge ปริมาณมาก",
                  "ตาซ้าย: ปกติ"
                ]
              }
            ]
          },
          {
            "sub": "Diagnostic plans (blood examination)",
            "body": [
              {
                "bullets": [
                  "CBC และ blood chemistry",
                  "Parasitological diagnosis ได้แก่ **direct blood smear**, **Woo's technique** และ **Giemsa-stained buffy coat smear**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Case report: ผลเลือดวันแรก",
        "source": "Lect 7 Part 2 Hemoflagellates p.9",
        "body": [
          {
            "text": "สไลด์ทำตารางเปรียบเทียบกับ normal range และกำกับความผิดปกติหลักไว้ 4 อย่างคือ **moderate anemia**, **mild leukocytosis**, **severe thrombocytopenia** และ **mild elevated ALP**"
          },
          {
            "bullets": [
              "Hb **8.5** g/dl (normal 12.4-19.1)",
              "Hct **24** % (normal 29.8-57.5)",
              "BUN **4** mg/dl (normal 7-26)",
              "Creatinine 0.5 mg/dl (normal 0.6-1.4)",
              "ALT 54 IU (normal 4-91)",
              "ALP **111** IU (normal 3-60)",
              "Total protein 7.9 g/dl (normal 5.8-7.9)",
              "Albumin 2.5 g/dl (normal 2.6-4.0)",
              "**Blood parasite จาก buffy coat smear: พบ Trypanosomes**",
              "SNAP4Dx: Not done"
            ]
          },
          {
            "callout": "ค่า WBC และ platelet ในสไลด์วางซ้อนกันจนอ่านจับคู่ตัวเลขไม่ชัดในไฟล์ข้อความ ให้ยึดคำกำกับของอาจารย์ (mild leukocytosis, severe thrombocytopenia) และดูตัวเลขจากสไลด์จริง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Case report: การตรวจติดตามและการรักษา",
        "source": "Lect 7 Part 2 Hemoflagellates p.9-11",
        "body": [
          {
            "bullets": [
              "ตรวจติดตามที่ **Day 1, 5, 13, 19, 30 และ 61**",
              "ยาที่ให้คือ **Berenil** (สไลด์ระบุชื่อยาไว้บนไทม์ไลน์ แต่ไม่ได้เขียนขนาดยาหรือวิธีให้)",
              "การตรวจที่ใช้ตามไทม์ไลน์: **Woo's technique**, **thin blood smear**, **CATT/T. evansi** และ **molecular detection by PCR**",
              "PCR ให้แถบขนาด **177 bp**",
              "มีการติดตาม physical examination ที่ **1 week post treatment** และ **2 weeks post treatment with Berenil**"
            ]
          },
          {
            "callout": "สไลด์แสดงผลเป็นภาพ gel และภาพสัตว์ป่วยตามวัน แต่ไม่ได้เขียนสรุปเป็นข้อความว่าผลแต่ละวันบวกหรือลบอย่างไร และ **ไม่ได้ระบุ dose ของ Berenil** ต้องดูภาพในสไลด์จริงประกอบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Developmental stages ของ Leishmania",
        "source": "Lect 7 Part 2 Hemoflagellates p.12",
        "body": [
          {
            "text": "มี 2 ระยะตามที่อยู่: **Amastigote** ใน macrophage ของ vertebrate hosts และ **Promastigote** ใน sandfly"
          },
          {
            "sub": "Amastigote",
            "body": [
              {
                "bullets": [
                  "เป็น small spherical **non-flagellated cells**",
                  "ขนาด **2-4 μm** in diameter",
                  "nucleus และ kinetoplast ถูกล้อมด้วยวงแคบ ๆ ของ vacuolated cytoplasm"
                ]
              }
            ]
          },
          {
            "sub": "Promastigote",
            "body": [
              {
                "bullets": [
                  "เป็น thin elongate cells มี **anterior kinetoplast** และมี **free flagellum** ยื่นออกมา",
                  "รูปร่างโดยทั่วไปคล้ายหอก (lance-like)",
                  "ขนาด **5-14 µm ยาว × 1.5-3.5 µm กว้าง**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mode of Leishmania transmission",
        "source": "Lect 7 Part 2 Hemoflagellates p.13",
        "body": [
          {
            "bullets": [
              "**Leishmania ทุกสปีชีส์ถ่ายทอดโดย female sandflies ที่ดูดเลือด** (bites of infected female phlebotomine sandflies)",
              "amastigotes ที่ถูกกินเข้าไปตอนดูดเลือด จะเปลี่ยนรูปใน **midgut หรือ hindgut** เป็น promastigotes แล้วเพิ่มจำนวนด้วย **binary fission**",
              "ปรสิตเคลื่อนไปข้างหน้าสู่ **foregut และ proboscis** แล้วบางส่วนถูกน้ำลายพัดพาเข้าสู่ bite site ตอนแมลงกัดดูดเลือด"
            ]
          }
        ]
      },
      {
        "heading": "Site of Leishmania infection",
        "source": "Lect 7 Part 2 Hemoflagellates p.13",
        "body": [
          {
            "text": "ขึ้นกับสปีชีส์ของปรสิต amastigotes จะเข้าไปใน macrophage cells ของ"
          },
          {
            "bullets": [
              "Reticuloendothelial system",
              "Lymphoid system",
              "Skin",
              "Nasopharynx",
              "Visceral organs"
            ]
          },
          {
            "text": "ปรสิต **รอดชีวิตอยู่ใน phagosomes และต้านทานการย่อยด้วย lysosomal enzymes** จากนั้นเพิ่มจำนวนและเติบโตจนทำให้ host cell แตก แล้วปล่อยระยะติดต่อไปติด macrophage ใหม่ รวมถึงตัวที่ไหลเวียนอยู่ในเลือด (monocytes)"
          }
        ]
      },
      {
        "heading": "Leishmaniosis: นิยามและรูปแบบของโรค",
        "source": "Lect 7 Part 2 Hemoflagellates p.15",
        "body": [
          {
            "bullets": [
              "เป็น **vector-borne disease** ถ่ายทอดผ่านการกัดของ **female phlebotomine sandfly**",
              "เกิดจาก **obligate intracellular protozoa** สกุล Leishmania",
              "มีมากกว่า **20 leishmanial species**"
            ]
          },
          {
            "sub": "2 major disease manifestations",
            "body": [
              {
                "bullets": [
                  "**Cutaneous**",
                  "**Visceral (kala-azar)**",
                  "(**Mucocutaneous** เป็นรูปแบบที่พบยากแต่รุนแรง กระทบ nasal และ oral mucosa)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cutaneous Leishmaniosis",
        "source": "Lect 7 Part 2 Hemoflagellates p.15",
        "body": [
          {
            "bullets": [
              "เป็น **รูปแบบที่พบบ่อยที่สุด** ทำให้เกิด skin ulcers",
              "มีแผลหนึ่งแผลหรือหลายแผลบนผิวหนัง แผลเปลี่ยนขนาดและลักษณะได้ตามเวลา",
              "แผลมักจบลงด้วยหน้าตาคล้าย **ภูเขาไฟ คือมีขอบนูนและมีแอ่งตรงกลาง (raised edge and central crater)**",
              "บางแผลมี scab คลุม",
              "อาจ **ไม่เจ็บหรือเจ็บก็ได้**",
              "บางรายมี swollen glands ใกล้แผล เช่นที่รักแร้",
              "**90% ของ cutaneous leishmaniasis** เกิดใน Afghanistan, Algeria, Iran, Saudi Arabia, Syria, Brazil, Columbia, Peru, Bolivia"
            ]
          }
        ]
      },
      {
        "heading": "Visceral Leishmaniosis",
        "source": "Lect 7 Part 2 Hemoflagellates p.16",
        "body": [
          {
            "bullets": [
              "ทำให้เกิด **severe systemic disease** และ **fatal without treatment**",
              "มักมี fever, weight loss, **enlarged spleen และ liver โดยขนาด spleen มักใหญ่กว่า liver**",
              "บางรายมี swollen glands",
              "ผลเลือดผิดปกติได้แก่ **anemia, leukopenia, thrombocytopenia**",
              "บางรายพัฒนาเป็น **post kala-azar dermal leishmaniasis**",
              "เป็น **opportunistic infection ในผู้ป่วย HIV**",
              "**90% ของ visceral leishmaniasis** เกิดใน India, Bangladesh, Nepal, Sudan, Ethiopia, Brazil"
            ]
          }
        ]
      },
      {
        "heading": "Geographic distribution ของ leishmaniosis",
        "source": "Lect 7 Part 2 Hemoflagellates p.16",
        "body": [
          {
            "bullets": [
              "พบ **ทั่วโลก** ในบางส่วนของประมาณ **88 ประเทศ**",
              "ประเทศที่ได้รับผลกระทบส่วนใหญ่อยู่ใน tropics และ subtropics",
              "ครอบคลุมตั้งแต่ **rain forests ใน Central และ South America ไปจนถึง deserts ใน West Asia**"
            ]
          },
          {
            "text": "สไลด์ชุด Impact of Leishmaniasis (อ้างอิง Alvar et al. 2012 Plos One) เป็นกราฟและแผนที่ล้วน ไม่มีข้อความบรรยาย"
          }
        ]
      },
      {
        "heading": "รายชื่อ Leishmania และการแยกสปีชีส์",
        "source": "Lect 7 Part 2 Hemoflagellates p.17",
        "body": [
          {
            "sub": "สปีชีส์ที่สไลด์ยกมา",
            "body": [
              {
                "bullets": [
                  "L. donovani complex",
                  "L. mexicana complex",
                  "L. tropicana",
                  "L. major",
                  "L. aethiopica",
                  "Subgenus Viannia ได้แก่ L. (V.) braziliensis, L. (V.) guyanensis, L. (V.) panamensis, L. (V.) peruviana"
                ]
              }
            ]
          },
          {
            "callout": "**สปีชีส์ต่าง ๆ แยกจากกันด้วยรูปร่างไม่ได้ (morphologically indistinguishable)** ต้องแยกด้วย **isoenzyme analysis, molecular methods หรือ monoclonal Ab**",
            "kind": "tip"
          },
          {
            "text": "Leishmania spp. ทุกตัวติดเชื้อใน mammals และพบบ่อยที่สุดใน **humans, dogs และ rodents**"
          }
        ]
      },
      {
        "heading": "สปีชีส์ไหนทำให้เกิดรูปแบบโรคใด",
        "source": "Lect 7 Part 2 Hemoflagellates p.18",
        "body": [
          {
            "bullets": [
              "**L. donovani และ L. infantum** เป็นสาเหตุหลักของ **visceral leishmaniasis (kala-azar)**",
              "**L. infantum มักถูกเรียกว่า L. chagasi** ในทวีปอเมริกา",
              "**L. tropicana** และสปีชีส์ใกล้เคียง ทำให้เกิด cutaneous leishmaniasis หลายรูปแบบใน humans, dogs, rodents และ wild mammals ใน Eurasia และ Africa",
              "**L. mexicana** เป็น complex ของสปีชีส์ที่ทำให้เกิด cutaneous lesions ในทวีปอเมริกา โดยใช้ animal reservoir hosts หลากหลาย",
              "**L. braziliensis** และสปีชีส์ใกล้เคียง ทำให้เกิด **mucocutaneous leishmaniasis** ในทวีปอเมริกา"
            ]
          },
          {
            "text": "หน้าเดียวกันมีสไลด์ newly proposed nomenclature of Leishmania (Antinori et al. 2012) และ life cycle เป็นแผนภาพ ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "Leishmaniosis ในประเทศไทย: จากโรคนำเข้าสู่โรคประจำถิ่น",
        "source": "Lect 7 Part 2 Hemoflagellates p.19",
        "body": [
          {
            "bullets": [
              "เดิม leishmaniosis ถูกมองว่าเป็นโรคที่ **หายากและเป็นโรคนำเข้า (imported disease)** ในประเทศไทย",
              "เคสนำเข้าส่วนใหญ่รายงานระหว่าง **ปี 1960-1986** ในแรงงานไทยที่กลับจาก Middle East",
              "รายงาน imported หรือ indigenous leishmaniasis ในไทยมีน้อยมาก และยิ่งน้อยในผู้ป่วย HIV โดยมีเพียง 1 case report ในอดีต",
              "ปัจจุบันเป็นที่กังวลมากขึ้น เพราะเป็นหนึ่งใน potential opportunistic infections ของผู้ติดเชื้อ HIV/AIDS ในไทยซึ่งประมาณ **370,000 คน**"
            ]
          },
          {
            "sub": "Autochthonous leishmaniasis ในคนไทย",
            "body": [
              {
                "bullets": [
                  "**ก่อนปี 1999** leishmaniasis ยังถือเป็นโรคนำเข้าในไทย",
                  "หลังจากนั้นมีรายงาน **autochthonous leishmaniasis** ทั้งในผู้ป่วย immunocompetent และ immunocompromised โดยเฉพาะ HIV/AIDS",
                  "มีรายงาน autochthonous cases ทั้งจากไทยและพม่า",
                  "พบทั้ง **CL และ VL** ในผู้ป่วยไทย",
                  "ผู้ป่วยบางรายที่มี HIV/AIDS coinfection แสดงอาการเป็น **disseminated CL และ VL**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ไทม์ไลน์ VL และการกระจายในไทย",
        "source": "Lect 7 Part 2 Hemoflagellates p.20",
        "body": [
          {
            "bullets": [
              "**ปี 1996 รายงาน autochthonous VL รายแรก ในเด็กหญิงอายุ 2 ปีที่จังหวัดสุราษฎร์ธานี**",
              "หลังจากนั้นเคส VL แบบ sporadic เพิ่มขึ้นในทศวรรษที่ผ่านมาในจังหวัดอื่น ๆ",
              "**ส่วนใหญ่อยู่ภาคใต้** ได้แก่ สุราษฎร์ธานี, พังงา, สงขลา, นครศรีธรรมราช, ตรัง และสตูล",
              "รองลงมาคือ **ภาคตะวันออก** ได้แก่ จันทบุรี",
              "และ **ภาคเหนือ** ได้แก่ เชียงราย และลำพูน"
            ]
          },
          {
            "sub": "ตาราง tracking ผู้ป่วยในไทย (ปี และจังหวัด)",
            "body": [
              {
                "bullets": [
                  "1996 สุราษฎร์ธานี",
                  "2005 น่าน",
                  "2006 พังงา",
                  "2007 กรุงเทพฯ",
                  "2009 จันทบุรี",
                  "2010 ตรัง และสตูล",
                  "2014 ตรัง, สงขลา, เชียงราย, เชียงใหม่, ลำพูน (2 แห่ง), น่าน, ลพบุรี",
                  "2017 กาญจนบุรี",
                  "สปีชีส์ที่กำกับในตารางคือ L. martiniquensis, L. infantum, L. orientalis และ N/A"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สปีชีส์ใหม่ที่พบในประเทศไทย",
        "source": "Lect 7 Part 2 Hemoflagellates p.20",
        "body": [
          {
            "text": "สไลด์ชื่อ Discovery of newly emerged Leishmania species in Thailand เริ่มจากชื่อเดิม **Leishmania siamensis** แล้วใช้ **analysis of isoenzyme** แยกออกเป็น **lineage PG** และ **lineage TR** จนได้ชื่อสปีชีส์ดังนี้"
          },
          {
            "bullets": [
              "**Leishmania martiniquensis (MON-229)** เป็นสปีชีส์ที่รายงานครั้งแรกจาก Martinique Island และ **ตรวจพบบ่อยกว่าในประเทศไทย**",
              "**Leishmania siamensis (MON-324)** สไลด์ตั้งคำถามว่า the true novel species? และระบุว่าตรวจพบครั้งแรกในประเทศไทย",
              "**Leishmania orientalis (MON-....)** สไลด์ไม่ได้ระบุเลข MON"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกชัดเจนในเนื้อข้อความว่า lineage PG กับ lineage TR ตรงกับสปีชีส์ตัวไหน ให้ดูลูกศรในสไลด์จริง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Clinical manifestations ของ 16 autochthonous cases",
        "source": "Lect 7 Part 2 Hemoflagellates p.21",
        "body": [
          {
            "text": "สไลด์สรุป 16 autochthonous cases แยกตามสปีชีส์ที่ตรวจได้"
          },
          {
            "bullets": [
              "**L. martiniquensis**: สไลด์ระบุ VL 4 ราย และ disseminated CL 4 ราย",
              "**L. orientalis** 3 ราย",
              "**L. infantum** 1 ราย",
              "**Unknown spp.** 3 ราย",
              "รูปแบบทางคลินิกที่ปรากฏในสไลด์คือ VL, CL, disseminated CL และแบบผสม VL & CL หรือ VL & disseminated CL"
            ]
          },
          {
            "sub": "เคสที่สไลด์เน้นเป็นรายบุคคล",
            "body": [
              {
                "bullets": [
                  "หญิงอายุ 34 ปี จ.ตรัง ติด HIV ตรวจพบ **Leishmania DNA ในน้ำลาย**",
                  "ชายอายุ 30 ปี จ.ตรัง ติด HIV ใช้ TCA cream มา 1 ปี เป็น CL",
                  "ชายอายุ 49 ปี ภาคใต้ อาชีพกรีดยาง ติด HIV",
                  "เด็กหญิงอายุ 3 ปี จ.ลพบุรี เป็น **autochthonous CL รายแรก**"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขในสไลด์นี้ซ้อนกันหลายชั้น ทำให้จับคู่จำนวนเคสกับรูปแบบโรครายสปีชีส์ได้ไม่ครบทุกช่อง ควรเปิดสไลด์จริงดูตารางประกอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Vector ที่สงสัยในไทย และสถานะ endemic",
        "source": "Lect 7 Part 2 Hemoflagellates p.21",
        "body": [
          {
            "sub": "Potential vectors for transmission of Leishmania in Thailand",
            "body": [
              {
                "bullets": [
                  "ตรวจพบ **L. martiniquensis DNA ใน Sergentomyia gemmea และ Sergentomyia barraudi** ซึ่งเป็น sandfly species เด่นในพื้นที่ที่มีการระบาด",
                  "**แต่ยังต้องมีการศึกษาเพิ่มเติมเพื่อพิสูจน์ว่า sandflies เหล่านี้ทำหน้าที่เป็น vector ของ leishmaniasis ในไทยจริงหรือไม่**"
                ]
              }
            ]
          },
          {
            "sub": "สถานะการระบาด: Thailand = endemic",
            "body": [
              {
                "bullets": [
                  "นิยาม **Endemic** ตามสไลด์คือ มีรายงาน autochthonous case อย่างน้อย 1 ราย **และ** มีการแสดงให้เห็นว่า whole cycle of transmission เกิดขึ้นที่ใดที่หนึ่งในประเทศนั้น",
                  "ระดับที่สไลด์ใช้แบ่ง: No autochthonous reported cases ➜ Previously reported cases (>1 autoch. case) ➜ **Endemic (>1 autoch. case และมี whole cycle of transmission)**",
                  "จังหวัดที่กำกับไว้ใต้แผนที่: 1 สุราษฎร์ธานี, 3 พังงา, 5 สงขลา, 6 ตรัง, 9 สตูล"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Leishmania siamensis: reservoir และ vector",
        "source": "Lect 7 Part 2 Hemoflagellates p.22",
        "body": [
          {
            "bullets": [
              "ในคน: มีการระบุ **11 autochthonous cases** ในประเทศไทย",
              "Animal reservoirs ได้แก่ **horses ใน Central Europe และ USA**, **a cow ใน Switzerland** และ **black rat (Rattus rattus) ในประเทศไทย**",
              "**2 potential sandfly vectors ในไทย** คือ **Phlebotomus argentipes** และ **Sergentomyia (Neophlebotomus) gemmea**"
            ]
          }
        ]
      },
      {
        "heading": "Autochthonous infection ในผู้ป่วย HIV ประเทศไทย",
        "source": "Lect 7 Part 2 Hemoflagellates p.23",
        "body": [
          {
            "sub": "เคสที่ 1 (2012, สงขลา, ภาคใต้)",
            "body": [
              {
                "bullets": [
                  "ชายอายุ 46 ปี อาชีพกรีดยาง ติด HIV ตั้งแต่ปี 2003",
                  "Clinical features: **CL ร่วมกับ VL**",
                  "Tx: **ABd + itraconazole** ผลลัพธ์ **ไม่กลับเป็นซ้ำหลังติดตาม 9 เดือน**",
                  "มาด้วยแผล ulcer ขนาดใหญ่ที่ขา ร่วมกับ unilateral groin lymphadenopathy และเกิด **hepatosplenomegaly หลังได้ high-dose steroids เพียง 4 สัปดาห์**",
                  "ตรวจพบ **amastigote ใน macrophage จาก bone marrow** และ **promastigote จาก culture ของ bone marrow**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ควรจำจากสองเคสแรก: การใช้ **steroid** (ทั้ง high-dose systemic และ topical) นำมาก่อนการเกิด visceral involvement ในผู้ป่วยที่มี CL อยู่เดิม",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อีกสองเคสจากตรัง และวิธี identify สปีชีส์",
        "source": "Lect 7 Part 2 Hemoflagellates p.24",
        "body": [
          {
            "sub": "เคสที่ 2 (2012, ตรัง, ภาคใต้)",
            "body": [
              {
                "bullets": [
                  "ชายอายุ 30 ปี เจ้าของร้านขายสัตว์เลี้ยง ติด HIV ตั้งแต่ปี 1999",
                  "Clinical features: **CL, VL** Tx: **ABd + itraconazole** ผลลัพธ์ไม่กลับเป็นซ้ำหลังติดตาม 3 เดือน",
                  "มีอาการ **diffused CL มา 4 ปี** แล้วเกิด visceral involvement หลังใช้ topical steroid (0.1% triamcinolone acetonide cream and lotion) นาน 1 ปี"
                ]
              }
            ]
          },
          {
            "sub": "เคสที่ 3 (2012, ตรัง, ภาคใต้)",
            "body": [
              {
                "bullets": [
                  "หญิงอายุ 32 ปี ไม่ระบุอาชีพ ติด HIV ตั้งแต่ปี 2007",
                  "Clinical features: **CL, VL** Tx: **ยังไม่ได้รับการรักษา** ผลลัพธ์: **เสียชีวิต**",
                  "ลักษณะรอยโรค: diffuse irregular hard subcutaneous nodules ขนาดต่าง ๆ โดยเฉพาะที่ใบหน้า ลำตัว และแขนขา",
                  "พยาธิสภาพ: diffuse dermal และ subcutaneous infiltration ของ mixed inflammatory cells ที่เด่นเป็น **macrophages** ปนกับ lymphocytes และ plasma cells โดย macrophages มี **intracellular amastigotes ของ Leishmania จำนวนมาก**"
                ]
              }
            ]
          },
          {
            "sub": "Molecular identification",
            "body": [
              {
                "bullets": [
                  "identify Leishmania species ด้วย **18S rRNA gene primers**",
                  "ระบุสปีชีส์จาก nucleotide sequences ของ PCR products บริเวณ **internal transcribed spacer 1 (ITS1)** ของ rRNA gene",
                  "ตรวจพบ **Leishmania DNA ในทุกตัวอย่าง**",
                  "ใช้ **L. braziliensis DNA เป็น positive control** โดย amplicon ของ L. braziliensis = **327 bp** ส่วน amplicon ของสปีชีส์ใหม่ = **379 bp**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Leishmania ในสัตว์: รายงานจากยุโรปและสหรัฐฯ",
        "source": "Lect 7 Part 2 Hemoflagellates p.26",
        "body": [
          {
            "bullets": [
              "**L. siamensis autochthonous infection ใน cattle ในยุโรป** (Lobsiger et al. 2010, Vet Parasitol 169:408-414)",
              "**L. siamensis autochthonous infection ใน horse ในยุโรป** (Muller et al. 2009, Vet Parasitol 166:346-351)",
              "**L. siamensis autochthonous infection ใน horse ที่ Florida, USA** (Reuss et al. 2012, Emerging Infectious Diseases (CDC) 18(9):1545-7) อยู่ที่ p.27"
            ]
          },
          {
            "text": "สไลด์กลุ่มนี้แสดงเป็นหน้าปกเปเปอร์และรูปประกอบ ไม่ได้เขียนรายละเอียดอาการหรือวิธีวินิจฉัยเป็นข้อความ"
          }
        ]
      },
      {
        "heading": "ผลซีโรโลยี Leishmania ในสุนัขและแมวในประเทศไทย",
        "source": "Lect 7 Part 2 Hemoflagellates p.27",
        "body": [
          {
            "sub": "Leishmania-positive dogs in Thailand",
            "body": [
              {
                "bullets": [
                  "Seropositive **8.4% (23/273)**",
                  "Seroreactivity ต่อ **DAT** พบ **2.7% (14/519)** ของสุนัข"
                ]
              }
            ]
          },
          {
            "sub": "Leishmania-seropositive cats in Thailand",
            "body": [
              {
                "bullets": [
                  "DAT-seropositive cats **7.8% (21/269)**",
                  "Seroreactivity ต่อ DAT พบ **5.6% (14/250)** ของแมว"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้ตัวเลขสองชุดในแต่ละสปีชีส์โดยมีจำนวนสัตว์ที่ตรวจไม่เท่ากัน แต่ **ไม่ได้บอกว่าเป็นคนละการศึกษาหรือคนละวิธีตรวจอย่างไร**",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Leishmaniasis ในสุนัขและแมว (สไลด์ภาพ)",
        "source": "Lect 7 Part 2 Hemoflagellates p.27-29",
        "body": [
          {
            "text": "สไลด์หัวข้อ Diagnosis of Leishmania, Leishmaniasis in cats และ Leishmaniasis in dogs เป็น **ภาพทางคลินิกล้วน** ไม่มีข้อความอธิบายอาการหรือขั้นตอนการวินิจฉัยกำกับไว้"
          },
          {
            "text": "คำที่กำกับบนรูปมีเพียงคำเดียวคือ **Onychogryphosis** ส่วนอาการอื่น ๆ ของ canine leishmaniasis **สไลด์ไม่ได้บอก** ต้องดูรูปในสไลด์จริงและอ้างอิงเสริมจากลิงก์ที่อาจารย์แปะไว้ (parasitesandvectors.biomedcentral.com)"
          }
        ]
      }
    ]
  },
  "parasit-1--lect-8-amoeba-histomonas-balantidium-final": {
    "topic": "parasit-1--lect-8-amoeba-histomonas-balantidium-final",
    "title": "Lect 8 Amoeba, Histomonas meleagridis และ Balantidium coli",
    "icon": "📖",
    "lecturer": "Woraporn Sukhumavasi",
    "summary": "เด็คนี้ครอบคลุม 3 กลุ่มหลักตาม outline ท้ายเรื่อง คือ Amoeba (intestinal amebas เน้น Entamoeba histolytica และ facultative amebas), Histomonas meleagridis และ Ciliates (Balantidium coli เป็นหลัก) โดยเนื้อหาหนักที่สุดอยู่ที่ E. histolytica (morphology ของ trophozoite/cyst การวินิจฉัย และ life cycle) กับ B. coli แม้ outline หน้าแรกและหน้าสรุปจะลิสต์ intestinal flagellates (Giardia, Trichomonads) ไว้ด้วย แต่เด็คนี้ไม่มีเนื้อหาส่วน flagellates เลย มีเพียงชื่อในลิสต์เท่านั้น หลายสไลด์ (p.2, p.7 บางส่วน, p.14, p.16-17 บางส่วน, p.20-21) เป็นภาพ วิดีโอ หรือตารางเปรียบเทียบที่ไม่มีข้อความอธิบาย จึงสรุปเป็นตัวหนังสือได้จำกัด",
    "sections": [
      {
        "heading": "ขอบเขตของ lecture และตำแหน่งทาง taxonomy",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.1",
        "body": [
          {
            "text": "สไลด์หัวเรื่องคือ **Amoeba in domestic animals** โดย outline ทั้ง lecture ครอบคลุม intestinal flagellates (Giardia, Trichomonads: Trichomonas, Tritrichomonas, Pentatrichomonas), Amoeba (intestinal amebas: Entamoeba histolytica, Entamoeba coli และ facultative amebas), Histomonas meleagridis และ Ciliates (Balantidium coli)"
          },
          {
            "sub": "Taxonomic classification of protozoa (อ้าง Bowman 2009)",
            "body": [
              {
                "bullets": [
                  "**Zoomastigina (Flagellates)** แบ่งเป็น Kinetoplastida (hemoflagellates: Trypanosoma, Leishmania), Parabasalia (mucosoflagellates: Trichomonads) และ Diplomonada (Giardia and relatives)",
                  "**Rhizopoda (amebas)** แบ่งเป็น intestinal amebas และ facultative amebas",
                  "**Ciliophora (ciliates)**",
                  "**Apicomplexa**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การจัดกลุ่ม amebas ที่ต้องรู้จัก",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.3",
        "body": [
          {
            "sub": "Pathogenic intestinal ameba",
            "body": [
              {
                "bullets": [
                  "**Entamoeba histolytica**"
                ]
              }
            ]
          },
          {
            "sub": "Nonpathogenic amebas",
            "body": [
              {
                "bullets": [
                  "Entamoeba coli",
                  "Entamoeba dispar",
                  "Entamoeba hartmanni",
                  "Entamoeba poleki",
                  "Entamoeba gingivalis",
                  "Iodamoeba buetschlii",
                  "Endolimax nana"
                ]
              }
            ]
          },
          {
            "sub": "Facultative amebas",
            "body": [
              {
                "bullets": [
                  "Acanthamoeba culbertsoni และ Acanthamoeba spp.",
                  "Naegleria fowleri",
                  "Balamuthia mandrillaris"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Entamoeba histolytica ภาพรวมและความสำคัญทางสัตวแพทย์",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.3",
        "body": [
          {
            "bullets": [
              "เป็น parasite ของ large intestine",
              "ทำให้เกิด **amebic dysentery ในคน**",
              "เป็น endemic disease ของเขตร้อน และเกิดประปราย (sporadically) ในเขตอบอุ่น",
              "ทำให้เกิด **amebic abscess of liver** ซึ่งเป็น serious and life-threatening sequela"
            ]
          },
          {
            "callout": "ในสัตว์เลี้ยง E. histolytica cause little harm โดย trophozoites และ cysts พบได้บ่อยใน fresh fecal smears ของ cattle, sheep, goats, horses และ swine ที่สุขภาพดี ข้อยกเว้นคือ special cases ที่มี clinical importance ใน primates",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Entamoeba grouping แยกกลุ่มด้วยจำนวน nuclei และ chromatoid bar",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.3",
        "body": [
          {
            "sub": "Histolytica group",
            "body": [
              {
                "bullets": [
                  "สมาชิก: E. histolytica, E. harmanni, E. equi, E. anatis",
                  "**small 4 nuclei** ที่มี centrally located endosome และมี peripheral chromatin granule",
                  "**Chromatoid bar: round ends**"
                ]
              }
            ]
          },
          {
            "sub": "Coli group",
            "body": [
              {
                "bullets": [
                  "สมาชิก: E. coli, E. wenyonni, E. muris",
                  "**8 nuclei**",
                  "**Chromatoid bar: splinter-like ends**"
                ]
              }
            ]
          },
          {
            "sub": "กลุ่มอื่น",
            "body": [
              {
                "bullets": [
                  "Bovis group: E. bovis, E. bubalis, E. suis",
                  "Gingivalis group: E. gingivalis",
                  "Insufficiently known species"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกลักษณะแยกเพิ่มเติมของ Bovis group และ Gingivalis group นอกจากรายชื่อ species",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Amebiasis ในสัตว์ที่สไลด์ยกตัวอย่าง",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.3",
        "body": [
          {
            "sub": "Silver leaf monkey (Presbytis cristatus)",
            "body": [
              {
                "bullets": [
                  "**Gastric amebiasis**",
                  "อาการ: anorexia, diarrhea, weight loss"
                ]
              }
            ]
          },
          {
            "sub": "Red-footed tortoises (Geochelone carbonaria)",
            "body": [
              {
                "bullets": [
                  "เชื้อคือ **Entamoeba invadens**",
                  "cause severe disease and death",
                  "อาการ: anorexia, listlessness, diarrhea",
                  "**Necropsy: necrosis of duodenal mucosa และ multifocal hepatic necrosis**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Geographic distribution และ life cycle ของ E. histolytica",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.4",
        "body": [
          {
            "sub": "Geographic distribution",
            "body": [
              {
                "bullets": [
                  "พบ **worldwide** โดยมี higher incidence ของ amebiasis ใน developing countries",
                  "ใน industrialized countries กลุ่มเสี่ยงได้แก่ male homosexuals, travelers, recent immigrants และ institutionalized population"
                ]
              }
            ]
          },
          {
            "sub": "Life cycle 3 ขั้นตอนที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "**Excystation: cyst to trophozoite ใน small intestine**",
                  "**Asexual binary fission**: multiplication ของ trophozoite",
                  "**Encystation: trophozoite to cyst**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ life cycle ที่เหลือเป็นวิดีโอ (รวมทั้งคลิปของ E. invadens) จึงไม่มีข้อความรายละเอียดเพิ่มเติม",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Transmission ของ E. histolytica",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.5",
        "body": [
          {
            "bullets": [
              "ติดโดย **ingestion of mature cyst** จาก food, water หรือ hands ที่ปนเปื้อนอุจจาระ",
              "**Cyst เป็น environmentally resistant stage** อยู่นอกร่างกายได้ days to weeks จึงเป็นระยะที่รับผิดชอบต่อการแพร่เชื้อ",
              "**Trophozoites ถูกทำลายเร็วเมื่อออกนอกร่างกาย** และถ้ากินเข้าไปก็ไม่รอด gastric juice",
              "exposure to fecal matters ระหว่าง sexual contact ก็เป็นช่องทางติดเชื้อ"
            ]
          },
          {
            "sub": "Asymptomatic carriers",
            "body": [
              {
                "bullets": [
                  "trophozoites อยู่จำกัดใน intestinal lumen (**noninvasive**)",
                  "ปล่อย cysts ออกมาในอุจจาระ"
                ]
              }
            ]
          },
          {
            "callout": "Developmental stages ของ ameba มี 2 ระยะคือ trophozoite (actively parasitic form) และ cyst และ **ทั้งสองระยะถูกขับออกมาในอุจจาระ**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Trophozoite ของ E. histolytica: morphology และการกินอาหาร",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.5",
        "body": [
          {
            "bullets": [
              "motile และ**พบได้ทั่วไปใน diarrheal stool**",
              "แบ่งตัวแบบ asexual binary fission",
              "**ขนาด 15-20 μm (range 10-60 μm)**",
              "มี **a single nucleus** ที่มี centrally placed karyosome และ uniformly distributed peripheral chromatin",
              "cytoplasm มีลักษณะ granular หรือ ground-glass appearance"
            ]
          },
          {
            "callout": "**Erythrophagocytosis เป็น morphologic characteristic เพียงอย่างเดียวที่ใช้แยก E. histolytica ออกจาก E. dispar ที่ไม่ก่อโรค** แต่สไลด์ระบุว่าโดยทั่วไปจะไม่ค่อยเห็นลักษณะนี้ใน stained smears ของ E. histolytica",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Trophozoite ของ E. histolytica: การเคลื่อนที่ การกินอาหาร และการ invade",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.6",
        "body": [
          {
            "bullets": [
              "แบ่งตัวแบบ asexual binary fission",
              "กินอาหารแบบ **holozoic nutrient** โดยอาศัย phagocytosis",
              "เคลื่อนที่แบบ amoeboid motion โดยใช้ **pseudopodia**"
            ]
          },
          {
            "sub": "นิยาม holozoic nutrition ตามสไลด์",
            "body": [
              {
                "text": "Holozoic nutrition (Gr. holo = whole, zoikos = of animals) คือวิธีการกินอาหารที่รวม ingestion ของ liquid หรือ solid organic material แล้ว digestion, absorption และ assimilation เพื่อนำไปใช้ คือการรับสารซับซ้อนเข้าไปแล้วเปลี่ยนเป็นรูปที่ง่ายขึ้น"
              }
            ]
          },
          {
            "sub": "การ invade ในผู้ป่วยบางราย",
            "body": [
              {
                "bullets": [
                  "trophozoites invade **intestinal mucosa**",
                  "ผ่านทาง **bloodstream**",
                  "ไปยัง **extraintestinal sites: liver, brain, lungs**"
                ]
              }
            ]
          },
          {
            "text": "ในภาพ preparation ที่สไลด์แสดง (direct wet mount ย้อม iodine และตัวอย่างที่เก็บใน PVA ย้อม trichrome) **ingested erythrocyte จะเห็นเป็น dark inclusion**"
          }
        ]
      },
      {
        "heading": "Cyst ของ E. histolytica",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.7",
        "body": [
          {
            "bullets": [
              "**พบได้ทั่วไปใน formed stool** (ต่างจาก trophozoite ที่พบใน diarrheal stool)",
              "**ขนาด 12-15 μm**",
              "**Mature cysts มี 4 nuclei** (vesicular nucleus)",
              "มี centrally located karyosomes เป็นลักษณะเฉพาะ",
              "peripheral chromatin แบบ fine และ uniformly distributed",
              "**Chromatoid body/bar: blunt, rounded ends**"
            ]
          },
          {
            "callout": "สไลด์แสดงภาพ cyst หลายแบบ (wet mount ย้อม iodine, unstained wet mount, wet mount ย้อม trichrome) และมีสไลด์ตาราง Characteristics of intestinal amebas in fecal preparations ซึ่งเป็นภาพตาราง ไม่มีข้อความในเด็ค",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Laboratory diagnosis ของ E. histolytica",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.8",
        "body": [
          {
            "bullets": [
              "**ต้องแยกจาก nonpathogenic intestinal protozoa ตัวอื่น** ได้แก่ E. coli, E. hartmanni, E. gingivalis, Endolimax nana, Iodamoeba buetschlii",
              "ใช้ morphologic characteristics ของ cysts และ trophozoites",
              "**E. dispar มี morphology เหมือน E. histolytica ทุกประการ** จึงต้องใช้ isoenzymatic หรือ immunologic analysis หรือ molecular diagnosis"
            ]
          },
          {
            "sub": "Microscopic identification of ameba",
            "body": [
              {
                "bullets": [
                  "Fresh stool: ทำ wet mounts และ permanently stained preparations (trichrome)",
                  "**Concentrates from fresh stool: not useful for demonstrating trophozoite** ทำได้ทั้ง wet mounts แบบไม่ย้อม หรือย้อมด้วย iodine หรือ trichrome",
                  "Aspirates หรือ biopsy จาก colonoscopy/surgery"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ Differential morphology of ameba trophozoites และ Differential morphology of ameba cysts เป็นตารางภาพ ไม่มีข้อความรายละเอียดในเด็ค",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Immunodiagnosis และ molecular diagnosis ของ ameba",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.9",
        "body": [
          {
            "sub": "Immunodiagnosis",
            "body": [
              {
                "bullets": [
                  "**Enzyme immunoassay (EIA)** แบบ antibody detection: **most useful ในผู้ป่วยที่มี extraintestinal disease เช่น amebic liver abscess**",
                  "EIA แบบ antigen detection: เป็น adjunct ต่อ microscopic Dx และช่วยแยก pathogenic ออกจาก nonpathogenic infections",
                  "Indirect hemagglutination (IHA)",
                  "Immunodiffusion test"
                ]
              }
            ]
          },
          {
            "sub": "Molecular diagnosis",
            "body": [
              {
                "bullets": [
                  "Conventional PCR (สไลด์แสดงการแยก E. histolytica ออกจาก E. dispar)",
                  "**Real-Time PCR: target 18S rRNA gene ด้วย species-specific probe**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Facultative amebiasis",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.10",
        "body": [
          {
            "text": "**เป็น amebas ที่ปกติ free-living แต่ก่อโรครุนแรงได้ถ้าเข้าสู่ human hosts**"
          },
          {
            "sub": "โรคในคน",
            "body": [
              {
                "bullets": [
                  "**Fulminate primary amebic meningoencephalitis (PAM)** จาก **Naegleria fowleri** เป็นหลัก",
                  "**Chronic amebic encephalitis** จาก **Acanthamoeba culbertsoni** และ species อื่น",
                  "**Acanthamoeba keratitis** จาก Acanthamoeba spp."
                ]
              }
            ]
          },
          {
            "sub": "โรคในสัตว์",
            "body": [
              {
                "bullets": [
                  "**Amebic encephalitis** พบใน dogs, gibbons, sheep, cattle, beavers, tapirs",
                  "**Balamuthia mandrillaris** ก่อโรคใน mandrill และทำให้ gorillas, orangutan, horse และ dogs ตายได้"
                ]
              }
            ]
          },
          {
            "callout": "จุดจำแยก genus จากสไลด์ภาพ p.11 คือ Acanthamoeba มี **filamentous pseudopods** และ large central karyosome ภายใน nucleus ส่วน Balamuthia mandrillaris มี **multiple finger-like acanthopodia เป็น distinctive feature ของ genus นี้** และมี clear circular vesicle ซึ่งคือ contractile vacuole",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Histomonas meleagridis: โรคและ host",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.12",
        "body": [
          {
            "bullets": [
              "เป็นสาเหตุของ **Blackhead of turkeys**, **Histomoniasis** และ **Infectious enterohepatitis**",
              "**Infects ceca และต่อมาที่ liver** ของ turkeys, chickens และ gallinaceous birds อื่น",
              "**ใน turkeys การติดเชื้อส่วนใหญ่ fatal โดยเฉพาะ young turkeys** ส่วนในนกชนิดอื่น mortality พบน้อยกว่า"
            ]
          }
        ]
      },
      {
        "heading": "Life cycle ของ Histomonas meleagridis",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.12",
        "body": [
          {
            "bullets": [
              "**Definitive hosts: birds**",
              "**Intermediate hosts: cecal worms (Heterakis gallinarum)**",
              "**Paratenic hosts: earthworms/annelids**",
              "**Transmission mode: ingestion ของ intermediate หรือ paratenic hosts**",
              "**Infective stage: egg ที่มี flagellated trophozoite อยู่ข้างใน**"
            ]
          },
          {
            "callout": "กลไกที่ทำให้ไข่พยาธิเป็นระยะติดต่อ: **trophozoites ใน cecal lumen เข้าถึง germinal zone ของ ovaries ของ cecal worm แล้ว invade เข้าไปในไข่ของพยาธิ**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Clinical signs ของ blackhead และ morphology ของ Histomonas",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.12",
        "body": [
          {
            "sub": "Clinical signs",
            "body": [
              {
                "bullets": [
                  "**เริ่มแสดงอาการ 8 วันหรือมากกว่าหลังติดเชื้อ**",
                  "depression, anorexia และใน turkeys จะมี **sulphur-yellow droppings**",
                  "**death เกิดได้ภายใน 24 ชั่วโมงโดยไม่มี clinical signs**",
                  "**Cyanotic discoloration of the head จึงเรียกว่า blackhead**"
                ]
              }
            ]
          },
          {
            "sub": "Morphology",
            "body": [
              {
                "bullets": [
                  "**มีลักษณะของทั้ง flagellates และ amebas แต่ถูกจัดเป็น flagellate เพราะมี axostyle**",
                  "Trophozoite stage มีได้หลายรูปแบบ",
                  "**Flagellate form: อยู่ใน lumen of cecum มี 1-2 flagella**",
                  "**ในเนื้อเยื่อ เชื้อจะสูญเสีย flagella และเคลื่อนที่แบบ amoeboid form**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "รอยโรคของ Histomonas meleagridis",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.13",
        "body": [
          {
            "bullets": [
              "**Lesions ที่ liver และ ceca ถือเป็น pathognomonic**",
              "**Focal necrosis**",
              "**รอยโรคที่ตับเป็น yellow ถึง yellow-green circular depressions** ซึ่งสไลด์เรียกว่า **bulls-eye lesion**",
              "ในภาพ cecum ระบุว่า **ameboid form แบ่งตัวแบบ binary fission**"
            ]
          }
        ]
      },
      {
        "heading": "Ciliates: สไลด์นำเข้าเรื่อง",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.14",
        "body": [
          {
            "text": "สไลด์ช่วงนี้เป็นภาพและวิดีโอเพื่อแนะนำ ciliates ได้แก่ **A typical ciliate: Paramecium** และ **Ingestion and digestion of food: Tetrahymena** พร้อมทวน outline อีกครั้ง"
          },
          {
            "callout": "สไลด์ไม่ได้บอกรายละเอียดเชิงเนื้อหาของ Paramecium และ Tetrahymena นอกจากหัวข้อภาพ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Balantidium coli: ภาพรวม",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.15",
        "body": [
          {
            "bullets": [
              "รากศัพท์ G. balanto- แปลว่า bag",
              "เป็นสาเหตุของ **Balantidiasis**",
              "**เป็น ciliated protozoon ชนิดเดียวที่พบใน pigs และ humans**",
              "**เป็น protozoon ที่ใหญ่ที่สุดที่ติดเชื้อในคน nonhuman primates และหมู**",
              "มี **2 developmental stages: trophozoite = reproductive stage และ cyst = infective stage**",
              "**ตำแหน่งที่อยู่: cecum และ colon**"
            ]
          }
        ]
      },
      {
        "heading": "Trophozoite ของ Balantidium coli",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.15",
        "body": [
          {
            "bullets": [
              "**ปกคลุมด้วย short cilia ทั้งตัว**",
              "**ขนาด 30-150 μm ยาว x 25-120 μm กว้าง**",
              "**มีทั้ง macronucleus และ micronucleus**",
              "**มี 2 contractile vacuoles**",
              "พบได้ทั่วไปใน lumen ของ large intestine"
            ]
          }
        ]
      },
      {
        "heading": "Trophozoite ของ B. coli: โครงสร้างละเอียดและอาหาร",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.16",
        "body": [
          {
            "sub": "Nuclei และช่องเปิด",
            "body": [
              {
                "bullets": [
                  "**Macronucleus: long, kidney-shaped structure**",
                  "**Micronucleus: spherical และอยู่ติดกับ macronucleus**",
                  "**Cytostome อยู่ subterminal ที่ปลายด้านหน้าซึ่งเรียวแหลม (tapering anterior end)**",
                  "**Cytopyge อยู่ที่ปลายด้านท้ายซึ่งมน (rounded posterior end)**"
                ]
              }
            ]
          },
          {
            "sub": "Food source และผิวเซลล์",
            "body": [
              {
                "bullets": [
                  "**Food source: carbohydrate**",
                  "เต็มไปด้วย food vacuoles ที่บรรจุ starch, bacteria และ red blood cell (ในกรณีที่ invading)",
                  "ผิวปกคลุมด้วย cilia เรียงแบบ oblique longitudinal"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cyst ของ Balantidium coli",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.17",
        "body": [
          {
            "bullets": [
              "**เป็น infective stage**",
              "รูปร่าง spherical หรือ slightly ovoid",
              "**มี double-walled coverings**",
              "**ขนาด 40x60 μm**",
              "ถูกขับออกมาใน feces ของ host",
              "**บรรจุทั้ง macronucleus และ micronucleus**",
              "**ไม่มีการแบ่งตัวเกิดขึ้นใน cyst**"
            ]
          }
        ]
      },
      {
        "heading": "Reproduction และ life cycle ของ B. coli",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.18",
        "body": [
          {
            "sub": "Reproduction",
            "body": [
              {
                "bullets": [
                  "**Asexual transverse binary fission**: mother cell แบ่งเป็น two asymmetric daughter cells",
                  "**Anterior (proter): retain oral apparatus เดิม**",
                  "**Posterior (opisthe): สร้าง apparatus ใหม่ขึ้นมา**",
                  "**Sexual reproduction: conjugation** คือถ่ายทอด genetic material ผ่าน direct cell-to-cell contact"
                ]
              }
            ]
          },
          {
            "sub": "Life cycle",
            "body": [
              {
                "bullets": [
                  "**Simple life cycle**: dormant cyst เปลี่ยนเป็น trophozoite และ trophozoite เปลี่ยนกลับเป็น cyst",
                  "**Direct transmission ไม่มี intermediate host**",
                  "ติดผ่าน contaminated water หรือ food"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "B. coli ในหมู: ระบาดวิทยาและการวินิจฉัย",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.19",
        "body": [
          {
            "sub": "ลักษณะการติดเชื้อในหมู",
            "body": [
              {
                "bullets": [
                  "**การติดเชื้อส่วนใหญ่ทั้งใน swine และ humans เป็น subclinical และในหมูมักไม่แสดงอาการ**",
                  "individual infection rates เข้าใกล้ 100% ได้ใน weaned pigs และ breeding stock (อ้าง Hindsbo et al. 2000)",
                  "**พบบ่อยในประเทศไทย**",
                  "**Sows เป็น carrier ส่งต่อให้ลูกหมู** และกลุ่มที่แสดง clinical signs คือ weaned piglets หรือ nursery pigs"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis ในหมู",
            "body": [
              {
                "bullets": [
                  "**Wet fecal mount ด้วย normal saline: เห็นทั้ง trophozoite motility และ cyst**",
                  "**Simple sedimentation ด้วยน้ำ: เห็น cyst เท่านั้น**",
                  "**Histopathology: เห็น invading trophozoites**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "B. coli กับ public health",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.19",
        "body": [
          {
            "bullets": [
              "**Balantidiosis เป็น waterborne zoonotic disease**",
              "**เป็น ciliate protozoon ชนิดเดียวที่ทราบว่าติดต่อสู่คนได้**",
              "คนรับ Balantidium cyst ผ่าน **fecal-oral route** และอาจมี **human-to-human transmission** ได้ด้วย"
            ]
          },
          {
            "sub": "การติดเชื้อในคน",
            "body": [
              {
                "bullets": [
                  "อยู่ที่ **cecum และ colon**",
                  "อาจ asymptomatic หรือเป็น **dysentery**",
                  "**รุนแรงในคนที่ undernourished ในประเทศกำลังพัฒนา**",
                  "**เป็น opportunistic parasite ใน immunosuppressed hosts**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ciliates ในสัตว์อื่นที่สไลด์ยกเป็นเคส",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.20",
        "body": [
          {
            "sub": "Ciliates in De Brazza's monkey",
            "body": [
              {
                "bullets": [
                  "ลิงถูกนำเข้ามาช่วงต้นเดือน ม.ค. 2019 เพื่อมา register ด้วย microchip ID",
                  "**1 ใน 6 ตัวของการเข้าตรวจครั้งนั้นมี mucous large bowel diarrhea ร่วมกับ hematochezia และพบ motile trophozoites**"
                ]
              }
            ]
          },
          {
            "sub": "Buxtonella sulcata",
            "body": [
              {
                "text": "สไลด์ระบุชื่อ **Buxtonella sulcata** ไว้ในชุดเคสเดียวกัน แต่ **สไลด์ไม่ได้บอกรายละเอียด host, morphology หรือความสำคัญของเชื้อนี้** มีเพียงชื่อและภาพ"
              }
            ]
          }
        ]
      },
      {
        "heading": "Symbiotic ciliates และ Ichthyophthirius multifiliis",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.21",
        "body": [
          {
            "sub": "Symbiotic ciliates",
            "body": [
              {
                "bullets": [
                  "พบใน **forestomachs ของ ruminants**",
                  "พบใน **ceca และ colons ของ horses**",
                  "**เป็น ciliates ขนาดใหญ่รูปร่างแปลกตา ที่ทั้งไม่ก่อโรคและไม่จำเป็นต่อ host (neither pathogenic nor indispensable to their hosts)**"
                ]
              }
            ]
          },
          {
            "sub": "Ichthyophthirius multifiliis",
            "body": [
              {
                "text": "สไลด์ระบุว่าเป็นสาเหตุของ **White spot หรือ Ich in fish** และ **ไม่ได้ให้รายละเอียด life cycle การวินิจฉัย หรือการรักษาเพิ่มเติม**"
              }
            ]
          }
        ]
      },
      {
        "heading": "สรุปท้าย lecture",
        "source": "Lect 8 Amoeba Histomonas Balantidium (final) p.22",
        "body": [
          {
            "text": "สไลด์สรุปทวน outline เดิมทั้งหมด คือ intestinal flagellates (Giardia, Trichomonads: Trichomonas, Tritrichomonas, Pentatrichomonas), Amoeba (intestinal amebas: Entamoeba histolytica, Entamoeba coli และ facultative amebas), Histomonas meleagridis และ Ciliates (Balantidium coli)"
          },
          {
            "callout": "หน้าสรุปเป็นการทวนหัวข้อล้วน ไม่มี take-home message หรือประเด็นเน้นเพิ่มเติม และส่วน intestinal flagellates ที่อยู่ในลิสต์ไม่มีเนื้อหาในเด็คนี้",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "parasit-1--lect-9-1-enteric-and-tissue-apicomplexa": {
    "topic": "parasit-1--lect-9-1-enteric-and-tissue-apicomplexa",
    "title": "Lect 9.1 Enteric and tissue apicomplexa",
    "icon": "📖",
    "lecturer": "Woraporn Sukhumavasi, DVM, Ph.D.",
    "summary": "เดกครอบคลุม Apicomplexa 2 กลุ่มใหญ่ คือ enteric coccidia (Eimeria, Cystoisospora, Cryptosporidium) และ tissue cyst-forming coccidia (Toxoplasma, Neospora, Hammondia, Besnoitia) ตั้งแต่ classification, life cycle, pathogenesis, clinical findings, Dx, Tx และ prevention โดยลงรายละเอียดมากที่สุดที่ Cystoisospora suis, Cryptosporidium parvum และ Toxoplasma gondii ส่วน Sarcocystis ปรากฏแค่ในผังจัดจำแนกและรายชื่อ ไม่มีสไลด์เนื้อหาของตัวเอง มีสไลด์จำนวนหนึ่งเป็นรูป วิดีโอ ตารางหรือลิงก์ข่าวล้วนโดยไม่มีข้อความ (p.2, p.3, p.7, p.20, p.31, p.34 บางส่วน และ p.38-40)",
    "sections": [
      {
        "heading": "ที่ยืนของ Apicomplexa ในผังจัดจำแนก protozoa",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.1",
        "body": [
          {
            "text": "สไลด์เปิดวางผังจาก Subkingdom Protozoa ลงมาเป็นกลุ่มใหญ่ที่มีความสำคัญทางสัตวแพทย์ ได้แก่ Ciliates, Amoebae, Flagellates และ **Apicomplexa**"
          },
          {
            "text": "ภายใน Apicomplexa สไลด์แบ่งย่อยเป็น 4 กลุ่ม"
          },
          {
            "bullets": [
              "Enteric coccidia",
              "Tissue cyst-forming coccidia",
              "Piroplasms (blood-borne)",
              "Cryptosporidia"
            ]
          },
          {
            "text": "อ้างอิงที่สไลด์ระบุคือ Jacobs et al. 2016. Principles of Veterinary Parasitology ส่วนชื่อ Phylum ในช่องบนของผังถูกเว้นเป็นเส้นประไว้ให้เติม"
          }
        ]
      },
      {
        "heading": "Apical complex และการแบ่งตามอวัยวะที่พบ",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.4",
        "body": [
          {
            "text": "ลักษณะประจำ phylum คือมี **apical complex ที่ส่วนหน้าของ merozoite** ซึ่งประกอบด้วย polar rings, micronemes, rhoptries, conoid, dense granules และ subpellicular tubule (Speer et al, 1999)"
          },
          {
            "text": "ตำแหน่งทางอนุกรมวิธานที่สไลด์เขียนไว้คือ Phylum Apicomplexa ต่อด้วย Class Sporozoasida และ Order Eucoccidiorida"
          },
          {
            "sub": "แบ่งตามจำนวนชนิดของ host",
            "body": [
              {
                "bullets": [
                  "Enteric coccidia (Eimeria spp., Cystoisospora spp., Cryptosporidium spp.) — living on only one kind of host throughout its life cycle",
                  "Tissue cyst-forming coccidia (Toxoplasma gondii, Neospora caninum, Hammondia spp., Besnoitia spp., Sarcocystis spp.) — infesting more than one kind of host โดยเฉพาะต้องการ host อย่างน้อย 2 ชนิดจึงจะครบวงจรชีวิต"
                ]
              }
            ]
          },
          {
            "sub": "แบ่งตามตำแหน่งที่พบ (สไลด์ยกตัวอย่างซ้ำอีกครั้งที่ p.26)",
            "body": [
              {
                "bullets": [
                  "GI: Eimeria, Cystoisospora, Cryptosporidium, Toxoplasma, Neospora, Sarcocystis, Hammondia, Besnoitia",
                  "Tissue: Toxoplasma, Neospora, Sarcocystis, Hammondia, Besnoitia",
                  "Blood: Hepatozoon, Plasmodium, Leucocytozoon, Haemoproteus, Babesia, Theileria"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Order Eucoccidiorida แยกลงถึง family และ subfamily",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.5",
        "body": [
          {
            "bullets": [
              "Suborder Eimeriina — Family Eimeriidae: **Eimeria, Cystoisospora**",
              "Family Cryptosporidiidae: **Cryptosporidium** โดยสไลด์วงเล็บไว้ว่าย้ายไปอยู่ใต้ Suborder Cryptosporida และ subjected to change",
              "Family Sarcocystidae, Subfamily Toxoplasmatinae: **Toxoplasma, Neospora, Hammondia, Besnoitia**",
              "Family Sarcocystidae, Subfamily Sarcocystinae: **Sarcocystis**"
            ]
          },
          {
            "callout": "ผัง Eucoccidiorida นี้ถูกฉายซ้ำอีก 2 ครั้งตอนขึ้นหัวข้อ Toxoplasma (p.26) และ Neospora (p.35) เพื่อชี้ว่าทั้งคู่อยู่ใต้ Subfamily Toxoplasmatinae เดียวกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Enteric coccidia: ลักษณะทั่วไปที่ต้องจำ",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.5",
        "body": [
          {
            "bullets": [
              "Eimeria และ Isospora โดยทั่วไปต้องการ host เพียงชนิดเดียวในการครบวงจรชีวิต",
              "Isospora บางชนิดมี facultative intermediate host (paratenic หรือ transfer host) จึงมีการเสนอชื่อ genus ใหม่ว่า **Cystoisospora** สำหรับกลุ่มนี้",
              "**Coccidia มี host specificity สูง และไม่มี cross-immunity ระหว่าง species**",
              "Coccidiosis พบได้ทั่วโลก และพบบ่อยที่สุดในสัตว์เล็กที่ถูกเลี้ยงรวมหรือขังในพื้นที่แคบที่ปนเปื้อน oocyst",
              "Coccidia เป็น opportunistic pathogen ถ้าก่อโรค ความรุนแรงจะถูกอิทธิพลจาก stressor ต่าง ๆ"
            ]
          },
          {
            "text": "ด้วยเหตุนี้ clinical coccidiosis จึงพบมากที่สุดในสภาวะ poor nutrition, poor sanitation, overcrowding หรือหลังความเครียดจาก weaning, shipping, การเปลี่ยนอาหารกะทันหัน และ severe weather"
          }
        ]
      },
      {
        "heading": "ระบาดวิทยาในสัตว์ฟาร์ม",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.6",
        "body": [
          {
            "bullets": [
              "ในสัตว์ฟาร์มส่วนใหญ่ **infection rate สูงแต่ rate of clinical disease ต่ำ (5-10%)** แม้ในกลุ่มเสี่ยงสูงอาจแสดงอาการได้ถึง 80%",
              "สัตว์ส่วนใหญ่ติด Eimeria หรือ Isospora ที่ความรุนแรงต่างกันช่วงอายุ **1 เดือนถึง 1 ปี**",
              "สัตว์อายุมากมักต้านทานต่อการเกิดโรค แต่อาจมี inapparent infection เป็นครั้งคราว",
              "สัตว์โตที่ดูสุขภาพดีจึงเป็นแหล่งเชื้อให้สัตว์เล็กที่ยัง susceptible ได้",
              "Host ที่พบ Eimeria spp. บ่อย: cattle, sheep, goats, pigs, rabbits — **สุนัขและแมวไม่มี Eimeria**"
            ]
          }
        ]
      },
      {
        "heading": "Pathogenesis ตอนที่ 1: oocyst และการ sporulate",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.6",
        "body": [
          {
            "bullets": [
              "การติดเชื้อเกิดจากการกิน infective oocyst เข้าไป",
              "Oocyst ออกสู่สิ่งแวดล้อมทางอุจจาระ แต่ oocyst ของ Eimeria และ Isospora ที่ออกมาเป็น **unsporulated จึงยังไม่ infective**",
              "ภายใต้สภาวะที่เหมาะสมของ oxygen, humidity และ temperature oocyst จะ sporulate และ infective ภายในไม่กี่วัน",
              "ระหว่าง sporulation protoplasm ที่ไร้รูปร่างจะพัฒนาเป็น sporozoite ภายใน sporocyst ที่อยู่ใน oocyst"
            ]
          },
          {
            "callout": "จุดจำสำหรับข้อสอบ: **Eimeria = 4 sporocysts ละ 2 sporozoites** ส่วน **Isospora = 2 sporocysts ละ 4 sporozoites**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Pathogenesis ตอนที่ 2: endogenous development",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.6",
        "body": [
          {
            "bullets": [
              "เมื่อสัตว์ที่ susceptible กิน sporulated oocyst เข้าไป sporozoite จะออกจาก oocyst แล้วรุกเข้า intestinal mucosa หรือ epithelial cell ที่ตำแหน่งอื่น และพัฒนาภายในเซลล์เป็น multinucleate **schizont (meront)**",
              "แต่ละ nucleus พัฒนาเป็น **merozoite** ซึ่งเข้าเซลล์ใหม่แล้ววนซ้ำกระบวนการเดิม",
              "หลังผ่าน asexual generation จำนวนหนึ่ง merozoite จะพัฒนาเป็น macrogametocyte (เพศเมีย) หรือ microgametocyte (เพศผู้) โดย macrogametocyte ให้ macrogamete 1 ตัว ส่วน microgametocyte ให้ microgamete หลายตัวในเซลล์ host",
              "หลังถูก fertilize ด้วย microgamete แล้ว macrogamete จะพัฒนาเป็น oocyst",
              "Oocyst มีผนังทนทานและถูกขับออกทางอุจจาระในสภาพ unsporulated"
            ]
          },
          {
            "text": "เรื่องความทนทาน สไลด์ระบุว่า **oocyst อยู่ไม่ค่อยรอดที่อุณหภูมิต่ำกว่าประมาณ 30 องศาเซลเซียส หรือสูงกว่า 40 องศาเซลเซียส แต่ภายในช่วงอุณหภูมินี้อาจอยู่รอดได้นานกว่าหรือเท่ากับ 1 ปี**"
          }
        ]
      },
      {
        "heading": "ความรุนแรงไม่เท่ากันในทุก species",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.8",
        "body": [
          {
            "bullets": [
              "ในบรรดา Eimeria หรือ Cystoisospora หลาย species ที่ติด host ชนิดหนึ่งได้ **ไม่ใช่ทุก species ที่ pathogenic**",
              "Concurrent infection ด้วย 2 species ขึ้นไป ซึ่งบางตัวปกติไม่ถือว่า pathogenic ก็มีผลต่อการเกิด clinical disease",
              "ภายใน pathogenic species เดียวกัน แต่ละ strain ยังมี virulence ต่างกัน"
            ]
          }
        ]
      },
      {
        "heading": "Clinical findings ของ enteric coccidiosis",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.8",
        "body": [
          {
            "bullets": [
              "อาการเกิดจาก **การทำลาย intestinal epithelium** และบ่อยครั้งรวมถึง connective tissue ที่รองอยู่ใต้ mucosa",
              "อาจมี hemorrhage เข้าสู่ lumen ของลำไส้ ร่วมกับ catarrhal inflammation และ diarrhea",
              "อาการที่พบได้: discharge of blood or tissue, tenesmus และ dehydration",
              "Serum protein และ electrolyte เปลี่ยนแปลงได้ชัดเจน (โดยทั่วไปเป็น **hyponatremia**) แต่ **Hgb หรือ PCV จะเปลี่ยนเฉพาะในสัตว์ที่เป็นรุนแรงเท่านั้น**"
            ]
          }
        ]
      },
      {
        "heading": "Dx: enteric coccidia",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.8",
        "body": [
          {
            "bullets": [
              "ตรวจ oocyst ในอุจจาระด้วยวิธี **salt หรือ sugar flotation**",
              "การพบ oocyst ของ pathogenic species จำนวนมากถือว่า diagnostic โดยสไลด์ให้ตัวเลข **มากกว่า 100,000 oocysts ต่อกรัมอุจจาระใน severe outbreak**"
            ]
          },
          {
            "text": "ข้อควรระวังที่สไลด์เน้น คือ diarrhea อาจมาก่อนการขับ oocyst จำนวนมาก 1-2 วัน และอาจดำเนินต่อหลัง oocyst discharge ลดกลับสู่ระดับต่ำแล้ว จึง **ไม่เสมอไปที่จะเจอ oocyst จากอุจจาระตัวอย่างเดียว** อาจต้องตรวจอุจจาระสัตว์ตัวเดิมหลายครั้ง หรือตรวจครั้งเดียวจากสัตว์หลายตัวที่เลี้ยงในสภาพแวดล้อมเดียวกัน"
          }
        ]
      },
      {
        "heading": "ปัจจัยที่มีผลต่อจำนวน oocyst ในอุจจาระ",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.9",
        "body": [
          {
            "bullets": [
              "Reproductive potential ของ species นั้นซึ่งถูกกำหนดทางพันธุกรรม",
              "จำนวน infective oocyst ที่กินเข้าไป",
              "Stage ของการติดเชื้อ",
              "อายุสัตว์",
              "Immune status และการเคยสัมผัสเชื้อมาก่อน",
              "Consistency ของอุจจาระ (ปริมาณน้ำอิสระ)",
              "วิธีที่ใช้ตรวจ"
            ]
          },
          {
            "callout": "สรุปจากสไลด์: ผลตรวจอุจจาระต้องแปลร่วมกับ clinical signs และ intestinal lesion ทั้ง gross และ microscopic และต้องพิสูจน์ด้วยว่า species นั้น pathogenic ใน host ตัวนั้นจริง **การเจอ oocyst จำนวนมากของ nonpathogenic species พร้อมกับ diarrhea ยังไม่ถือเป็นการวินิจฉัย clinical coccidiosis**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Tx: enteric coccidia",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.9",
        "body": [
          {
            "bullets": [
              "Coccidiostat ส่วนใหญ่ออกฤทธิ์กด **first-stage schizont ระยะต้น** จึงเหมาะกับการ control มากกว่าการ treatment",
              "Soluble sulfonamides ให้กินในลูกโคที่มี clinical coccidiosis และเชื่อกันว่าได้ผลดีกว่าสูตร intestinal sulfonamide แบบ bolus",
              "Amprolium ให้กินได้ในลูกโค แกะ และแพะที่มี clinical coccidiosis",
              "การให้ยาป้องกันในสัตว์ที่สุขภาพดีแต่สัมผัสเชื้อแล้ว เป็นข้อพิจารณาสำคัญเมื่อกำลังรักษาสัตว์รายที่แสดงอาการ"
            ]
          },
          {
            "sub": "สถานะการขึ้นทะเบียนยา (ตามสไลด์)",
            "body": [
              {
                "bullets": [
                  "FDA กำลังเปลี่ยนสถานะยาที่ใช้ในคนด้วย เช่น sulfonamides จาก over-the-counter เป็นยาที่ต้องมีใบสั่งสัตวแพทย์สำหรับ water medication หรือใช้ Veterinary Feed Directive (VFD) สำหรับ feed medication",
                  "ยาที่ไม่ได้ใช้ในคน เช่น ionophores ยังคงสถานะ over-the-counter"
                ]
              }
            ]
          },
          {
            "sub": "ธรรมชาติของโรคกับการรักษา",
            "body": [
              {
                "bullets": [
                  "**วงจรชีวิตของ Eimeria และ Isospora เป็น self-limiting และจบเองภายในไม่กี่สัปดาห์ ถ้าไม่มี reinfection**",
                  "การให้ยาเร็วอาจชะลอหรือยับยั้ง stage ที่เกิดจาก reinfection จึงย่นระยะป่วย ลดการขับ oocyst บรรเทา hemorrhage และ diarrhea และลดโอกาสติดเชื้อแทรกซ้อนและการตาย",
                  "สัตว์ป่วยควรแยกและรักษาเป็นรายตัวเท่าที่ทำได้ เพื่อให้ได้ระดับยาที่ therapeutic และกันไม่ให้ตัวอื่นสัมผัสเชื้อ",
                  "อย่างไรก็ตาม **ยังไม่มียาใดที่พิสูจน์ประสิทธิภาพในการรักษา clinical coccidiosis ได้** แม้จะยอมรับกันทั่วไปว่ายาได้ผลกับ reinfection และช่วยให้ฟื้นตัว"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Prevention: enteric coccidia",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.9",
        "body": [
          {
            "text": "หลักการที่สไลด์วางไว้คือ **จำกัดปริมาณ sporulated oocyst ที่สัตว์เล็กได้รับ ให้ติดเชื้อพอกระตุ้นภูมิคุ้มกันแต่ไม่ถึงกับแสดงอาการ**"
          },
          {
            "bullets": [
              "การให้อาหารและการจัดการที่ดีรวมถึง sanitation ช่วยไปถึงเป้าหมายนี้",
              "ลูกสัตว์แรกเกิดควรได้รับ colostrum",
              "สัตว์เล็กที่ susceptible ควรอยู่ในที่สะอาดและแห้ง",
              "ภาชนะให้อาหารและน้ำต้องสะอาดและป้องกันการปนเปื้อนอุจจาระ โดยทั่วไปหมายถึงวางรางอาหารสูงจากพื้นและจัดตำแหน่งให้อุจจาระปนเปื้อนได้ยาก",
              "ลดความเครียด เช่น การหย่านม การเปลี่ยนอาหารกะทันหัน และการขนส่ง"
            ]
          }
        ]
      },
      {
        "heading": "การใช้ coccidiostat เชิงป้องกัน",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.10",
        "body": [
          {
            "bullets": [
              "แนะนำให้ใช้เชิงป้องกันเมื่อคาดการณ์ได้ล่วงหน้าว่าสัตว์ภายใต้ระบบการจัดการแบบนั้นจะเกิด coccidiosis",
              "**แทบทุกกรณีที่ต้องใช้เชิงป้องกันเป็น Eimeria spp.**",
              "Decoquinate และ ionophorous antibiotics ใช้กันแพร่หลายในสัตว์เคี้ยวเอื้องอายุน้อย",
              "การให้ decoquinate, lasalocid, monensin หรือ amprolium ในอาหารระดับต่ำต่อเนื่องช่วงเดือนแรกของการเข้า feedlot มีรายงานว่าช่วยป้องกันได้",
              "Ionophorous antibiotics และ amprolium มีรายงานว่าได้ผลในลูกแพะ ส่วนในสุกรมีรายงานทั้ง sulfonamides และ amprolium"
            ]
          }
        ]
      },
      {
        "heading": "Cystoisospora ในสุนัขและแมว: species และ oocyst",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.12",
        "body": [
          {
            "sub": "Canine coccidia",
            "body": [
              {
                "bullets": [
                  "Cystoisospora canis",
                  "Cystoisospora ohioensis",
                  "Cystoisospora burrowsi",
                  "Cystoisospora neorivolta"
                ]
              }
            ]
          },
          {
            "sub": "Feline coccidia",
            "body": [
              {
                "bullets": [
                  "Isospora felis",
                  "Isospora rivolta"
                ]
              }
            ]
          },
          {
            "text": "สไลด์เทียบภาพ oocyst ของ C. felis ทั้งระยะ **unsporulated** และ **sporulated** และชี้โครงสร้าง sporont, sporocyst, sporozoite บนภาพ oocyst จากอุจจาระสด"
          },
          {
            "text": "อีกสไลด์เทียบ oocyst ขนาดเล็กและขนาดกลางในสุนัข ระหว่าง Hammondia heydorni กับ Isospora ohioensis (p.13)"
          }
        ]
      },
      {
        "heading": "Life cycle ของ Cystoisospora felis และ monozoic tissue cyst",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.13",
        "body": [
          {
            "bullets": [
              "**Definitive host คือแมว**",
              "Mode of transmission แบบ direct คือกิน sporulated oocyst",
              "Mode of transmission แบบ indirect คือกิน **monozoic tissue cyst** ในสัตว์เหยื่อ",
              "ใน intermediate host สปอโรซอยต์ที่ excyst แล้วจะ migrate ไปยังเนื้อเยื่อและสร้าง cyst"
            ]
          },
          {
            "sub": "รายละเอียด monozoic tissue cyst (ตัวอย่างจาก C. ohioensis)",
            "body": [
              {
                "bullets": [
                  "Sporozoite ถูกปล่อยจาก oocyst โดยอาศัย **bile** ในลำไส้",
                  "Sporozoite บางส่วนไชผ่านผนังลำไส้เข้า mesenteric lymph node หรือเนื้อเยื่อนอกลำไส้อื่น แล้วสร้าง unicellular cyst ที่ค่อย ๆ ขยายขนาด",
                  "ภาพในสไลด์มาจาก smear ของ mesenteric lymph node ของหนูที่ติดเชื้อในการทดลอง",
                  "Sporozoite ถูกล้อมด้วย **thick cyst wall**",
                  "Cyst นี้อาจเป็นแหล่งของ intestinal reinfection และการ relapse ของ enteric coccidiosis",
                  "Monozoic cyst อยู่ในเนื้อเยื่อนอกลำไส้ของทั้ง definitive host และ paratenic host ได้ **ตลอดอายุขัยของ host**",
                  "การกิน monozoic cyst ใน paratenic host ทำให้เกิด intestinal infection ใน definitive host (สุนัขและแมว)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dx: Cystoisospora ในสุนัขและแมว",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.14",
        "body": [
          {
            "text": "อาศัยการ identify oocyst โดยสไลด์แยกด้วยขนาดเป็นหลัก"
          },
          {
            "bullets": [
              "**C. canis คือ coccidia ขนาดใหญ่ในสุนัข**",
              "**C. felis คือ coccidia ขนาดใหญ่ในแมว**",
              "**C. rivolta, C. burrowsi และ C. ohioensis แยกจากกันด้วยสัณฐานวิทยาไม่ได้** จัดเป็นขนาดกลาง"
            ]
          },
          {
            "text": "เทคนิคที่สไลด์ระบุคือ **Sheather's sugar centrifugation flotation technique** และมีสไลด์รูป coccidia ในสุนัขและแมวกำกับ U = unsporulated, S = sporulated ให้ฝึกอ่าน"
          },
          {
            "callout": "สไลด์มีกราฟ prevalence ของ canine coccidiosis แยกตามอายุ (Blagburn et al. 1996) แต่ text layer ไม่มีตัวเลข จึงบอกไม่ได้ว่ากราฟระบุค่าเท่าไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cystoisospora suis: porcine neonatal coccidiosis",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.15",
        "body": [
          {
            "bullets": [
              "เป็น porcine neonatal coccidiosis และสไลด์ระบุว่าเป็น **protozoa ที่สำคัญที่สุดที่ก่อโรคในสุกร**",
              "เกิดใน **nursing piglets**",
              "**ไม่ก่อโรคใน finishing pig หรือ breeding stock**"
            ]
          },
          {
            "text": "Life cycle แบ่งเป็น 3 phase ตามสไลด์ ได้แก่ **sporogony, excystation และ endogenous development** (Lindsay and Dubey, 2006. Coccidia and other protozoa. In: Diseases of Swine)"
          }
        ]
      },
      {
        "heading": "Fecal examination สำหรับ C. suis",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.15",
        "body": [
          {
            "bullets": [
              "เป็น **วิธีที่เร็วที่สุดในการวินิจฉัย I. suis** ทำได้ทั้ง fecal smear และ fecal flotation",
              "ควรเก็บจากหลายครอกภายในโรงเรือนคลอด",
              "เก็บจากลูกสุกรที่แสดงอาการมาแล้ว 2-3 วัน",
              "**Peak oocyst production เกิดประมาณ 2-3 วันหลังเริ่มแสดงอาการ**",
              "ลูกสุกรขับ oocyst เป็นช่วง ๆ จึงอาจให้ผลลบในบางช่วง",
              "**ตัวอย่างอุจจาระที่เป็น pasty มักมี oocyst มากกว่าตัวอย่างที่เหลว**"
            ]
          },
          {
            "sub": "สารละลายและเทคนิค (ต่อที่ p.16)",
            "body": [
              {
                "bullets": [
                  "Sheather's sugar",
                  "Saturated sodium chloride และ glucose โดยใช้ **glucose 500 g ในสารละลาย saturated sodium chloride 1000 ml**",
                  "Centrifugal flotation",
                  "ล้างตัวอย่างอุจจาระด้วยน้ำเพื่อกำจัดไขมันก่อนทำ flotation ด้วย saturated solution",
                  "**2.5% K2Cr2O7 (potassium dichromate) ใช้ induce sporulation in vitro**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Oocyst ของ C. suis: hazy body",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.17",
        "body": [
          {
            "bullets": [
              "โครงสร้างเด่นคือ **hazy bodies** อยู่ **ระหว่าง oocyst wall กับ sporont**",
              "เป็น diagnostic point ของ I. suis และ **ไม่พบใน Eimeria ของสุกร**",
              "อีกจุดที่ใช้วินิจฉัยคือ **2 celled sporoblast stage**"
            ]
          },
          {
            "callout": "hazy body คือคำตอบมาตรฐานของคำถาม แยก C. suis จาก Eimeria ในสุกรด้วยอะไร",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Histopathology และสรุปการวินิจฉัย C. suis",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.18",
        "body": [
          {
            "sub": "Small intestinal mucosal smear",
            "body": [
              {
                "bullets": [
                  "แสดง developmental stage ของ I. suis ได้",
                  "ขูดด้วย scalpel หรือ coverslip ลงบนสไลด์แก้ว แล้วย้อมด้วย routine blood stain ชนิดใดก็ได้",
                  "**Paired type 1 merozoites เป็น diagnostic**",
                  "สิ่งที่พบเพิ่มได้: asexual stage อื่น เช่น binucleated type 1 meront หรือ type 2 meront และ merozoite โดย multinucleated type 2 meront ของ I. suis มีรูปร่างยาวและมักพบหลายตัวในเซลล์ host เดียวกัน",
                  "Sexual stage ได้แก่ microgamont และ macrogamont โดย **macrogamont ของ I. suis ไม่มี eosinophilic wall-forming bodies แบบที่เห็นใน Eimeria**"
                ]
              }
            ]
          },
          {
            "sub": "สไลด์สรุป Diagnosis: Cystoisospora suis",
            "body": [
              {
                "bullets": [
                  "Clinical signs: diarrhea ในลูกสุกร",
                  "Fecal examination: centrifugal flotation ด้วย Sheather's solution, unsporulated oocyst ที่มี hazy body เพื่อแยกจาก Eimeria และ sporulated oocyst ที่มี **2 sporocysts และ 4 sporozoites ต่อ sporocyst**",
                  "Histopathology: villous necrosis, fusion และ atrophy ของลำไส้เล็ก และพบ merozoites หรือ schizonts หรือ gametocytes ภายใน enterocyte"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Treatment and control ของ C. suis",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.18",
        "body": [
          {
            "sub": "Anticoccidial drugs ในลูกสุกร",
            "body": [
              {
                "bullets": [
                  "**Toltrazuril (Baycox 5% suspension)** เป็นยากลุ่ม triazinon antiprotozoal",
                  "ขนาด **20-30 mg/kg single dose ในลูกสุกรอายุ 3-6 วัน**",
                  "ลด clinical signs และการสร้าง oocyst",
                  "**ฆ่าได้ทั้ง asexual และ sexual stage**",
                  "**Amprolium, furazolidone และ monensin ไม่ได้ผลกับ neonatal porcine coccidiosis**"
                ]
              }
            ]
          },
          {
            "sub": "Sanitation",
            "body": [
              {
                "bullets": [
                  "Disinfectants: **bleach อย่างน้อย 50%** หรือสารประกอบ ammonia",
                  "Steam cleaning",
                  "Biosecurity"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงที่สไลด์ระบุ: Mundt et al. 2007. Parasitol Res. / Muangyai et al. 2001. Thai J Vet Med. / Stuart et al. 1981. Vet Med Small Anim Clin."
          }
        ]
      },
      {
        "heading": "Cryptosporidium: ลักษณะเฉพาะและประวัติ",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.19",
        "body": [
          {
            "bullets": [
              "**Oocyst เล็กมาก 3-5 ไมโครเมตร มี 4 sporozoites และไม่มี sporocyst**",
              "**Merozoite ไม่มี mitochondria**",
              "จัดเป็น **Category B Biothreat Pathogen (NIH)**"
            ]
          },
          {
            "sub": "History",
            "body": [
              {
                "bullets": [
                  "1907: Ernest E. Tyzzer สังเกตพบครั้งแรกในหนูทดลอง",
                  "1976: รายงาน cryptosporidiosis ในคนครั้งแรก",
                  "ทศวรรษ 1980: ความสำคัญทางคลินิกเด่นขึ้นจากผู้ป่วยติดเชื้อ HIV"
                ]
              }
            ]
          },
          {
            "sub": "Outbreaks",
            "body": [
              {
                "bullets": [
                  "1989: waterborne outbreak ที่ Swindon และ Oxfordshire สหราชอาณาจักร ประมาณ 5,000 คน",
                  "1993: น้ำดื่มปนเปื้อนที่ Milwaukee รัฐ Wisconsin สหรัฐอเมริกา **มากกว่า 400,000 คน**",
                  "การระบาดอื่นเกี่ยวข้องกับสระว่ายน้ำและทะเลสาบ, unpasteurized apple cider, โรงพยาบาล (nosocomial) และโรงพยาบาลเด็ก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ชีววิทยาที่ทำให้ Cryptosporidium ใกล้ gregarines",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.21",
        "body": [
          {
            "bullets": [
              "**Syzygy** คือการจับคู่หรือเชื่อมกันของ trophozoite หรือ gamont แบบปลายต่อปลายหรือด้านข้าง ก่อนการสร้าง gamont หรือ gamete",
              "Cryptosporidium มีการสร้าง **epimerite (feeder organelle)**",
              "Feeder organelle คือ anterior vacuolar membrane ของ zoite ที่พับตัวอย่างซับซ้อนกลายเป็นโครงสร้างสำหรับดูดสารอาหาร เทียบเท่ากับ epimerite ของ gregarines"
            ]
          },
          {
            "text": "อ้างอิง Thompson et al. 2005. Advances in Parasitology และสไลด์ p.20 วางผัง hypothetical tree of Apicomplexa เทียบ gregarines กับ Cryptosporidium ไว้เป็นภาพประกอบ"
          }
        ]
      },
      {
        "heading": "Cryptosporidium: การติดเชื้อในสัตว์",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.21",
        "body": [
          {
            "bullets": [
              "**สัตว์เล็กเป็นกลุ่มที่ susceptible**",
              "Livestock: เกิดความสูญเสียทางเศรษฐกิจ โดยเฉพาะในลูกโค",
              "พบในสัตว์ป่า สัตว์เลี้ยงเป็นเพื่อน และสัตว์ปีก ได้แก่ ไก่ ไก่งวง เป็ด ห่าน นกกระทา",
              "เป็น **waterborne zoonotic pathogen** ในสัตว์เลี้ยงลูกด้วยนม"
            ]
          }
        ]
      },
      {
        "heading": "Cryptosporidium parvum",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.22",
        "body": [
          {
            "bullets": [
              "Tyzzer 1912 เป็น **species หลักที่ก่อโรคในคนและสัตว์เลี้ยง**",
              "Host range กว้าง: cattle, dog, cat, pig, goat, sheep, horse, mouse, human",
              "Pathogenic ต่อ calves, pigs, sheep, rodents และ humans เป็น zoonosis",
              "Clinical signs: **diarrhea ในลูกโค** ร่วมกับ depression, anorexia และ abdominal pain",
              "การศึกษาทาง molecular epidemiology แบ่งเป็น **2 genotypes: Genotype I ในคน ซึ่งภายหลังจัดใหม่เป็น C. hominis และ Genotype II ในโค**"
            ]
          },
          {
            "sub": "C. parvum ในลูกโค",
            "body": [
              {
                "bullets": [
                  "**Oocyst shedding ช่วงอายุ 1-4 สัปดาห์ โดย peak ประมาณ 2 สัปดาห์ และเริ่มได้เร็วสุดที่อายุ 2 วัน**",
                  "ความรุนแรงและระยะเวลาแปรผัน",
                  "อุจจาระเหลว สีเหลืองซีดมีมูก และเป็น profuse watery diarrhea"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dx: Cryptosporidium",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.23",
        "body": [
          {
            "bullets": [
              "Clinical signs ประกอบกับ morphology ของ oocyst ที่เล็ก 3-5 ไมโครเมตร มี 4 sporozoites และไม่มี sporocyst",
              "ย้อมอุจจาระที่ถ่ายเหลวด้วย **modified acid fast staining (Ziehl-Neelsen's carbol-fuchsin)** หรือ immunofluorescent",
              "Histopathology: **พบเชื้อที่ brush border บริเวณปลาย villi**",
              "Immunolabelling Ag detection ด้วย polyclonal หรือ monoclonal Ab ราคาแพงกว่า แต่รวดเร็วและเหมาะกับการตรวจตัวอย่างจำนวนมาก"
            ]
          },
          {
            "text": "สไลด์ยังมีภาพ sugar floatation เทียบ C. parvum กับ C. andersoni ไว้ให้ดูสัณฐาน"
          }
        ]
      },
      {
        "heading": "Transmission ของ Cryptosporidium",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.24",
        "body": [
          {
            "bullets": [
              "Aerosol (พบได้น้อย)",
              "Fecal-oral route ได้แก่ person-to-person และ animal-to-person",
              "**Waterborne โดย oocyst ทน chlorine**",
              "Foodborne",
              "Mechanical ผ่านแมลงสาบและแมลงวัน"
            ]
          }
        ]
      },
      {
        "heading": "Cryptosporidium ในคน: คนปกติกับคนภูมิคุ้มกันบกพร่อง",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.24",
        "body": [
          {
            "sub": "Healthy people",
            "body": [
              {
                "bullets": [
                  "อาจ asymptomatic",
                  "Watery diarrhea ร่วมกับ abdominal cramps, weight loss, vomiting และ low-grade fever",
                  "ในวัยทารกอาจมีผลถาวรต่อ growth และ development",
                  "เป็น acute self-limiting gastroenteritis **ระยะเวลา 9-15 วัน**"
                ]
              }
            ]
          },
          {
            "sub": "Immunocompromised people",
            "body": [
              {
                "bullets": [
                  "กลุ่ม HIV, drug-induced, ผู้ปลูกถ่ายอวัยวะ และผู้ป่วยที่ได้ cancer chemotherapy",
                  "**Chronic diarrhea, severe dehydration, weight loss, malnutrition และเป็นอันตรายถึงชีวิต**",
                  "ความรุนแรงและระยะเวลาของโรคขึ้นกับ immune status ของ host"
                ]
              }
            ]
          },
          {
            "text": "High risk groups ที่สไลด์ระบุ: **สัตวแพทย์**, เด็กและเจ้าหน้าที่ใน day care center, เกษตรกร, บุคลากรทางการแพทย์ และนักเดินทาง"
          }
        ]
      },
      {
        "heading": "Cryptosporidium ในสัตว์ปีก",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.25",
        "body": [
          {
            "bullets": [
              "**C. baileyi เป็น species ที่พบมากที่สุดในสัตว์ปีก** โดยทั่วไปติดที่ respiratory tract และ Bursa of Fabricius ทำให้เกิด severe respiratory disease ได้แก่ ไอ จาม มี mucoid discharge และหายใจลำบาก โดยนกอายุน้อย susceptible กว่านกโต",
              "**C. meleagridis ติดที่ลำไส้** ทำให้ท้องเสียตั้งแต่เล็กน้อยถึงรุนแรง ร่วมกับ dehydration, น้ำหนักลด และอ่อนแรง"
            ]
          }
        ]
      },
      {
        "heading": "Tx และ prevention ของ Cryptosporidium",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.25",
        "body": [
          {
            "callout": "**ไม่มีการรักษาจำเพาะที่ได้ผลสำหรับ Cryptosporidium infection ในสัตว์** ตามที่สไลด์ระบุตรง ๆ",
            "kind": "warn"
          },
          {
            "bullets": [
              "**Nitazoxanide (Alinia)** เป็นยาตัวเดียวที่ FDA อนุมัติสำหรับ C. parvum ใช้กับ pediatric diarrhea ในเด็กอายุ 1-11 ปี ช่วยลดระยะเวลาท้องเสียและการขับ oocyst",
              "Supportive treatment: **oral หรือ i.v. rehydration**",
              "สารกลุ่มใหม่และ immunotherapy อยู่ระหว่างการพัฒนา"
            ]
          },
          {
            "sub": "ยาที่สไลด์ระบุสำหรับสัตว์เลี้ยง",
            "body": [
              {
                "bullets": [
                  "Paromomycin 150 mg/kg วันละครั้ง 5 วัน",
                  "Tylosin 10-15 mg/kg วันละ 3 ครั้ง นาน 2-3 สัปดาห์ (สำหรับแมว)",
                  "Azithromycin 5-10 mg/kg วันละ 2 ครั้ง 5-7 วัน (สำหรับแมว)"
                ]
              }
            ]
          },
          {
            "sub": "Prevention and control",
            "body": [
              {
                "bullets": [
                  "ลดการแพร่ของ oocyst ในสิ่งแวดล้อม",
                  "การจัดการปศุสัตว์เรื่อง water run-off",
                  "Water treatment ด้วย **ozone และ UV**",
                  "Personal hygiene",
                  "ให้ความสำคัญกับกลุ่มผู้ที่ภูมิคุ้มกันถูกกด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Toxoplasma gondii: พื้นฐานและ host",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.26",
        "body": [
          {
            "bullets": [
              "Nicolle and Manceux, 1908 ชื่อมาจาก toxo แปลว่า arc หรือ bow และ plasma แปลว่า life",
              "รายงานครั้งแรกใน african rodent ชื่อ **Ctenodactylus gundi**",
              "เป็น **obligate intracellular coccidian parasite**",
              "**Definitive host = feline**",
              "**Intermediate host = สัตว์เลือดอุ่นหลากหลายชนิด**",
              "**เซลล์ที่มีนิวเคลียสแทบทุกชนิดติดเชื้อได้**"
            ]
          }
        ]
      },
      {
        "heading": "3 infective forms ของ T. gondii",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.27",
        "body": [
          {
            "bullets": [
              "**Sporozoite-containing oocyst (10x12 ไมโครเมตร)** โดยแต่ละ oocyst มี **2 sporocysts และ 4 sporozoites ต่อ sporocyst** ทนต่อสิ่งแวดล้อมและ **sporulate นอกตัว host**",
              "**Bradyzoite-containing tissue cyst**",
              "**Tachyzoite** รูปเสี้ยวพระจันทร์ ขนาด 2-3 x 4-8 ไมโครเมตร ปลายหน้าเรียวแหลม ปลายหลังมน และมีนิวเคลียสขนาดใหญ่"
            ]
          },
          {
            "sub": "Transmission ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "กินเนื้อที่ปรุงไม่สุกซึ่งมี cyst",
                  "อาหารปนเปื้อน oocyst จากอุจจาระแมว",
                  "Transplacental infection",
                  "Organ transplantation"
                ]
              }
            ]
          },
          {
            "text": "แผนภาพ life cycle (Hutchison and Dunachie, 1971) ยังกำกับเส้นทาง reinfection, congenital transmission และ organ transplantation ไปยัง fetus และผู้รับอวัยวะ"
          }
        ]
      },
      {
        "heading": "T. gondii: biology และกลไกการรุกเข้าเซลล์",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.28",
        "body": [
          {
            "bullets": [
              "**Gametogenesis เกิดใน felid enterocytes**",
              "**หนู สุกร และสัตว์เคี้ยวเอื้องขนาดเล็กมัก harbor tissue cyst ส่วนในโคพบได้น้อย**",
              "**Cyst พบที่ brain, heart และ muscle**",
              "ใช้เป็นเครื่องมือศึกษา cell และ molecular biology เพราะเลี้ยงใน cell culture ได้ และเป็น model ให้ apicomplexan ตัวอื่น เช่น Plasmodium และ Cryptosporidium"
            ]
          },
          {
            "sub": "Invasion",
            "body": [
              {
                "bullets": [
                  "ใช้ **actin-myosin based motor complex** ขับเคลื่อนการไชเข้าเซลล์แบบ active penetration และ **gliding motility**",
                  "มีการ **sequential discharge ของโปรตีนจาก organelle**",
                  "**Broad host specificity**",
                  "สร้าง **parasitophorous vacuole**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "T. gondii: clinical importance และสมดุลภูมิคุ้มกัน",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.29",
        "body": [
          {
            "bullets": [
              "**Tachyzoites = acute infection ส่วน bradyzoites ใน cyst = chronic infection**",
              "**Asymptomatic ในคนที่ immunocompetent** โดยบางรายอาจพบ lymphadenopathy",
              "**เกิด cyst reactivation ใน immunocompromised host เช่น ผู้ป่วย HIV** เรียกภาวะโรคว่า toxoplasmosis",
              "Congenital infection: abortion, chorioretinitis, mental retardation, hydrocephalus"
            ]
          },
          {
            "text": "สไลด์วางแผนภาพ the critical balance between immune control and pathology คือ acute (tachyzoite) เมื่อมี healthy immune response จะเข้าสู่ chronic (bradyzoite) และเมื่อมี **immunosuppression หรือ AIDS หรือการติดเชื้อ in utero** จะเกิด reactivation กลับเป็น tachyzoite โดยมีภาพ toxoplasmic encephalitis และ cyst in retinal epithelium ประกอบ"
          }
        ]
      },
      {
        "heading": "T. gondii: ความสำคัญทางสัตวแพทย์",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.29",
        "body": [
          {
            "bullets": [
              "เกิด toxoplasmosis ในปศุสัตว์ สัตว์เลี้ยงเป็นเพื่อน และสัตว์ป่า **รวมถึงสัตว์เลี้ยงลูกด้วยนมทางทะเล**",
              "**เป็นหนึ่งในสาเหตุหลักของการแท้งในแกะและแพะ**",
              "ในแม่สุกร: abortion และ stillbirth",
              "ก่อความสูญเสียทางเศรษฐกิจและการเกษตร",
              "เป็น **foodborne และ waterborne zoonotic pathogen**"
            ]
          },
          {
            "sub": "ความไวรับต่อเชื้อและผลต่อพฤติกรรม (p.30)",
            "body": [
              {
                "bullets": [
                  "**Susceptible species (Innes, 1997): hares, marsupials, new world monkeys**",
                  "**Resistant species (Dubey and Beattie, 1998): cattle**",
                  "**เปลี่ยนพฤติกรรมในหนู (Vyas et al, 2007) จากการหลีกเลี่ยงกลิ่นแมวกลายเป็นถูกดึงดูดเข้าหา**"
                ]
              }
            ]
          },
          {
            "text": "หัวข้อ feline toxoplasmosis ในสไลด์เดียวกันแสดงภาพ necrotic hepatitis ของลูกแมวที่ติดเชื้อแบบ congenital และแยกภาพ prenatal toxoplasmosis แบบ severe กับ postnatal toxoplasmosis แต่ text layer ไม่มีคำบรรยายรายละเอียดของภาพ"
          }
        ]
      },
      {
        "heading": "Dx: Toxoplasma gondii",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.32",
        "body": [
          {
            "sub": "Serological methods",
            "body": [
              {
                "bullets": [
                  "**Sabin-Feldman Dye Test: IgG**",
                  "IgG Avidity Test",
                  "Latex Agglutination Test",
                  "**Modified Agglutination Test (MAT)** (Dubey, 1997)"
                ]
              }
            ]
          },
          {
            "sub": "Detection of parasites",
            "body": [
              {
                "bullets": [
                  "**Floatation เพื่อตรวจ oocyst ทำได้เฉพาะใน felid เท่านั้น**",
                  "Immunohistochemistry (IHC) โดยสไลด์ p.33 ระบุว่าใช้ rabbit anti-Toxoplasma antiserum",
                  "**PCR ต่อยีน highly repetitive B1 ของ Toxoplasma**",
                  "Histopathology เพื่อดู cyst หรือ tachyzoite และ developmental stage"
                ]
              }
            ]
          },
          {
            "sub": "การตรวจ oocyst",
            "body": [
              {
                "bullets": [
                  "Fecal floatation",
                  "Formalin-ether sedimentation",
                  "**ข้อจำกัดคือแมวขับ oocyst เป็นช่วงสั้น ๆ เท่านั้น**"
                ]
              }
            ]
          },
          {
            "sub": "Bioassay (p.34)",
            "body": [
              {
                "bullets": [
                  "Bioassay in mice มีความไวในการตรวจเนื้อสุกรที่ติด T. gondii (Garcia et al, 2006)",
                  "ใช้ร่วมกับ pepsin digestion"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ T. gondii: Tx and Control (p.34) เป็นตารางที่มีเพียงคำอธิบายสัญลักษณ์ C: Cat และ D: Dog พร้อมอ้างอิง Dubey JP et al. 2009. Vet Clin Small Anim 39: 1009-1034 ตัวยาและขนาดยาในตารางไม่ปรากฏใน text layer สไลด์ไม่ได้บอกในรูปข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Neospora caninum: ประวัติและการแยกจาก Toxoplasma",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.35",
        "body": [
          {
            "bullets": [
              "Dubey, 1988 โดย neosporosis ถูกรู้จักครั้งแรกใน **สุนัขพันธุ์ boxer ที่ประเทศนอร์เวย์ ซึ่งเกิดความผิดปกติทางระบบประสาท** (Bjerkas et al. 1984)",
              "ต่อมามีรายงาน **Neospora-induced myeloencephalitis ในลูกโค** (Parish et al. 1987)",
              "มีการกระจายทั่วโลกเช่นเดียวกับ Toxoplasma และ Cryptosporidium",
              "**มักถูกวินิจฉัยผิดเป็น T. gondii เพราะภาพทางคลินิกในสุนัขคล้ายกัน จึงต้องทำ Ddx**"
            ]
          }
        ]
      },
      {
        "heading": "Neospora caninum: host, การแพร่ และความสำคัญ",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.36",
        "body": [
          {
            "bullets": [
              "**Definitive host: สุนัขและ coyote**",
              "**Intermediate host: โค และสัตว์เลือดอุ่นหลากหลายชนิด**",
              "**สุนัขขับ oocyst จำนวนน้อย ประมาณวันที่ 5-13 หลังติดเชื้อ**",
              "**Clinical disease: ascending hindleg paralysis**",
              "**Oocyst sporulate ภายใน 24-72 ชั่วโมงในสิ่งแวดล้อม**",
              "**เนื้อโคที่ติด N. caninum เป็นแหล่งเชื้อสำคัญ เพราะทำให้สุนัขผลิต oocyst จำนวนมาก**",
              "**Transplacental infection ในโคมากกว่าในสุนัข**",
              "**เป็นสาเหตุสำคัญของการแท้งในโค โดยเฉพาะเมื่อแม่โคท้องติดเชื้อครั้งแรก (primary infection)**",
              "**ยังไม่มีหลักฐานว่าเป็น zoonosis**"
            ]
          },
          {
            "text": "สไลด์ transmission of bovine neosporosis ระบุการถ่ายทอดแบบ **transplacental ทั้งชนิด exogenous และ endogenous** และมีภาพลูกโคเพศเมียที่คลอดออกมาแล้วติดเชื้อ"
          }
        ]
      },
      {
        "heading": "Pathogenesis ของการแท้งใน bovine neosporosis",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.36",
        "body": [
          {
            "text": "หลัง parasitemia จะตามด้วยการรุกเข้า placenta และ fetus โดยสาเหตุของการแท้งที่เป็นไปได้ตามสไลด์มี 5 ข้อ"
          },
          {
            "bullets": [
              "Placental damage จากตัวเชื้อโดยตรงจนคุกคามการรอดของ fetus",
              "การหลั่ง maternal prostaglandins นำไปสู่ luteolysis",
              "ความเสียหายของเนื้อเยื่อ fetus โดยตรงจากการเพิ่มจำนวนของ N. caninum",
              "ออกซิเจนหรือสารอาหารไม่พอ อันเป็นผลตามมาจาก placental damage",
              "การที่แม่ขับ fetus ออกด้วยกลไกภูมิคุ้มกัน จาก maternal placental inflammation และการหลั่ง maternal proinflammatory cytokines"
            ]
          },
          {
            "text": "สไลด์ p.37 แสดงภาพ tachyzoite ในสมองของ fetus ทั้งรูปแบบ extracellular crescentic form และ intracellular tachyzoites, tissue cyst ที่มีความหนาของผนัง cyst แตกต่างกันในสมองของ fetus ที่แท้ง และ N. caninum induced myositis ใน fetus และลูกโค (Dubey et al. 2006. J. Comp. Pathol.)"
          }
        ]
      },
      {
        "heading": "Besnoitia และ Hammondia",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.37",
        "body": [
          {
            "sub": "Besnoitia",
            "body": [
              {
                "bullets": [
                  "**Cyst ขนาดใหญ่ประมาณ 0.5 มิลลิเมตร**",
                  "พบที่ **ผิวหนังของโค** ทำให้เกิด **scleroderma**",
                  "พบในเนื้อเยื่อต่าง ๆ ของสัตว์ชนิดอื่นได้",
                  "**แมวขับ oocyst**"
                ]
              }
            ]
          },
          {
            "sub": "Hammondia",
            "body": [
              {
                "bullets": [
                  "**Oocyst คล้ายกับของ T. gondii และ Neospora**",
                  "**H. hammondi ในแมว**",
                  "**H. heydorni ในสุนัข สุนัขจิ้งจอก และ coyote**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้ข้อมูล Besnoitia และ Hammondia เพียงเท่านี้ ไม่มี life cycle, clinical signs หรือแนวทางการรักษาของทั้งสอง genus สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นภาพ วิดีโอ หรือลิงก์ล้วน",
        "source": "Lect 9.1 Enteric and tissue apicomplexa p.2",
        "body": [
          {
            "text": "หลายสไลด์ในเดกไม่มีเนื้อความให้สรุป มีเพียงหัวเรื่องกับภาพหรือลิงก์ ควรกลับไปดูภาพจริงในไฟล์สไลด์"
          },
          {
            "bullets": [
              "p.2 Locomotion: apicomplexa มีเพียงหัวเรื่องกับภาพ",
              "p.3 Sporulation (or Sporogony) มีเพียงหัวเรื่องกับภาพ",
              "p.7 Life cycle: enteric coccidia รวม 4 สไลด์เป็นภาพและลิงก์วิดีโอ ไม่มีข้อความบรรยาย",
              "p.20 Cryptosporidium: Life Cycle และ hypothetical tree เป็นภาพจาก CDC DPDx และ tolweb",
              "p.31 และ p.32 บางส่วน เป็นข่าวจากเว็บไซต์ข่าวไทยเกี่ยวกับ toxoplasmosis",
              "p.33 เป็นภาพ histopathology และ IHC ที่กำลังขยาย 100x, 400x พร้อม scale bar 500 และ 100 ไมโครเมตร",
              "p.38-40 เป็น additional reading, ตาราง coccidia in dogs and cats (U = unsporulated, S = sporulated), ลิงก์ข่าว toxoplasmosis จากเนื้อหมู, รายการวิทยุสัตวแพทย์สนทนา FM101.5 และสไลด์ Any question?"
            ]
          }
        ]
      }
    ]
  },
  "parasit-1--lect-9-2-blood-apicomplexa": {
    "topic": "parasit-1--lect-9-2-blood-apicomplexa",
    "title": "Lect 9.2 Blood apicomplexa",
    "icon": "📖",
    "lecturer": "Morakot Kaewthamasorn",
    "summary": "เดค 33 หน้านี้จริง ๆ แล้วเป็นสามเลกเชอร์ต่อกัน แต่ละส่วนมีสไลด์ปกของตัวเอง คือ (1) Haemosporidian: Plasmodium spp. หน้า 1-12 (2) Hepatocystis, Leucocytozoon และ Haemoproteus หน้า 12-23 (3) Piroplasms ในเม็ดเลือด (Babesia, Theileria) และปิดท้ายด้วย Hepatozoon หน้า 24-33 เนื้อหาที่เป็นตัวหนังสือหนาแน่นที่สุดอยู่ที่ Leucocytozoon และ Haemoproteus ส่วน Plasmodium ในสัตว์ (แพะ ควาย กระจง ไก่) เป็นแผ่นภาพงานวิจัยภาคสนามของผู้สอนที่มีแค่คำบรรยายใต้ภาพ ไม่มีเนื้อหาบรรยายกลไกหรือการรักษาในสัตว์เหล่านั้น สไลด์ ultrastructure ของ Apicomplexa หน้า 2 เหลือเฉพาะคำในวงเล็บ ชื่อ organelle แต่ละอันหลุดหายไปจาก text layer",
    "sections": [
      {
        "heading": "ภาพรวม Phylum Apicomplexa และตำแหน่งของ blood parasites",
        "source": "Lect 9.2 Blood apicomplexa p.2",
        "body": [
          {
            "text": "สไลด์เปิดด้วย ULTRASTRUCTURAL CHARACTERISTICS OF APICOMPLEXA ชี้ว่าที่ anterior end มี secretory organelle และมี plastid กับ secretory organelle อื่น รวมถึง posterior end แต่ **สไลด์ไม่ได้บอก** ชื่อ organelle แต่ละอัน (ในไฟล์เหลือเฉพาะคำในวงเล็บ)"
          },
          {
            "sub": "การแบ่งกลุ่ม HAEMATOZOA",
            "body": [
              {
                "bullets": [
                  "**HAEMOSPORIDIA (MALARIA PARASITES)** ได้แก่ Plasmodium, Leucocytozoon, Haemoproteus",
                  "**PIROPLASMS** ได้แก่ Babesia, Theileria"
                ]
              },
              {
                "text": "สไลด์ผังเดียวกันนี้ถูกฉายซ้ำอีกในหน้า 13 และหน้า 24 โดยเพิ่ม **Hepatocystis** เข้าไปในกลุ่ม HAEMOSPORIDIA ด้วย"
              }
            ]
          },
          {
            "callout": "หัวข้อ จำนวน Species มีดาวกำกับไว้บนผัง แต่สไลด์ไม่ได้ให้ตัวเลขจำนวน species ไว้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "วงจรชีวิต Haemosporidia และยาที่ออกฤทธิ์ตามระยะ",
        "source": "Lect 9.2 Blood apicomplexa p.3",
        "body": [
          {
            "text": "Haemosporidia เป็น **DIXENIC คือต้องใช้ทั้ง vertebrate และ invertebrate host**"
          },
          {
            "text": "ระยะที่ปรากฏบนแผนภาพวงจร ได้แก่ Sporogony, Exo-erythrocytic schizogony, Erythrocytic schizogony และ Gametogony"
          },
          {
            "sub": "ยาที่สไลด์เขียนกำกับไว้ที่แต่ละระยะ",
            "body": [
              {
                "bullets": [
                  "**Exo-erythrocytic schizogony ใช้ Primaquine**",
                  "**Erythrocytic schizogony ใช้ Chroroquine, Artimisinin, Tafenoqiune, Pyrimethamine, Quinin** (สะกดตามที่พิมพ์บนสไลด์)"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อระยะบนแผนภาพกับชื่อยา ไม่ได้อธิบายว่าแต่ละระยะเกิดที่ไหนหรือเกิดอะไรขึ้นในระยะนั้น",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Human malaria parasites",
        "source": "Lect 9.2 Blood apicomplexa p.3",
        "body": [
          {
            "bullets": [
              "**Plasmodium falciparum คือ species ที่ virulent ที่สุด**",
              "P. vivax, P. ovale, P. malariae",
              "**P. knowlesi และ P. cynomolgi เป็น ZOONOTIC species**"
            ]
          }
        ]
      },
      {
        "heading": "หลักการวินิจฉัย malaria",
        "source": "Lect 9.2 Blood apicomplexa p.3",
        "body": [
          {
            "bullets": [
              "**Microscopic identification เป็นวิธีที่ใช้บ่อยที่สุดในการแสดงว่ามี active infection**",
              "ใช้การเปรียบเทียบ morphology และภาพของ Plasmodium แต่ละ species",
              "Molecular diagnosis ใช้เสริมกับกล้องจุลทรรศน์ โดยเฉพาะตอน species identification",
              "**Antibody detection บอกได้ว่าเคยติดเชื้อในอดีต ไม่จำเป็นต้องเป็น active infection**",
              "การตรวจ immunologic/biochemical ต่อผลผลิตของเชื้อมีให้ใช้แล้วและอยู่ระหว่างการประเมิน"
            ]
          }
        ]
      },
      {
        "heading": "เครื่องมือวินิจฉัยจริงและระยะที่เห็นใน thin blood smear",
        "source": "Lect 9.2 Blood apicomplexa p.4",
        "body": [
          {
            "bullets": [
              "MOLECULAR DIAGNOSIS ที่ยกตัวอย่างคือ PCR",
              "Loop-mediated Isothermal Amplification (LAMP) สไลด์แสดงการอ่านผลสองแบบ คือ ดูจากแสงไฟปกติ และ ดูจากแสงไฟ UV",
              "**ANTIBODY/ANTIGEN DETECTION มีเฉพาะกับ species ที่ติดในคนเท่านั้น**"
            ]
          },
          {
            "sub": "ระยะของ P. falciparum ใน thin blood smear (ตามคำบรรยายแผ่นภาพ)",
            "body": [
              {
                "bullets": [
                  "Trophozoites รวมถึง ring-stage trophozoites",
                  "Schizonts รวมถึง ruptured schizont",
                  "Mature macrogametocytes คือเพศเมีย",
                  "Mature microgametocytes คือเพศผู้"
                ]
              },
              {
                "text": "แผ่นภาพอ้างอิงจาก Coatney et al. The Primate Malarias, 1971"
              }
            ]
          }
        ]
      },
      {
        "heading": "Thick blood smear และ vectors ของ malaria",
        "source": "Lect 9.2 Blood apicomplexa p.5",
        "body": [
          {
            "text": "สไลด์แสดง thin และ thick blood smear จากนิสิตสัตวแพทย์ที่ตรวจที่ Vet Parasitology Unit, CU และภาพระยะของ P. falciparum ใน thick blood smear (Wilcox A., 1960)"
          },
          {
            "sub": "VECTORS",
            "body": [
              {
                "bullets": [
                  "Anopheles dirus",
                  "Anopheles gambiae",
                  "Anopheles minimus",
                  "Anopheles stephensi",
                  "**Aedes spp. และ Culex spp. เป็น vector เฉพาะใน avian malaria เช่น Plasmodium gallinaceum และ P. juxtanucleare**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ระยะของเชื้อในตัวยุง",
        "source": "Lect 9.2 Blood apicomplexa p.6",
        "body": [
          {
            "bullets": [
              "**Oocysts พบที่ midgut ของยุง**",
              "**Sporozoites พบที่ salivary glands ของยุง**"
            ]
          },
          {
            "text": "ภาพประกอบมาจากงานภาคสนาม ได้แก่ mosquito light trap ที่สถานีวิจัยมาลาเรีย จังหวัดกาญจนบุรี และการผ่ายุง (mosquito dissection) ที่ Vet Parasitology Unit, CU"
          }
        ]
      },
      {
        "heading": "Pre-erythrocytic schizont และ malaria ในลิง",
        "source": "Lect 9.2 Blood apicomplexa p.7",
        "body": [
          {
            "text": "ภาพชิ้นเนื้อตับคนแสดง **pre-erythrocytic schizont ของ Plasmodium vivax อายุ 7 วัน**"
          },
          {
            "sub": "MALARIA IN NON-HUMAN PRIMATES",
            "body": [
              {
                "bullets": [
                  "Plasmodium cynomolgi",
                  "Plasmodium fragile",
                  "Plasmodium simium",
                  "Plasmodium brasilianum",
                  "Plasmodium knowlesi",
                  "Plasmodium inui"
                ]
              },
              {
                "text": "host ที่แสดงบนสไลด์คือ long-tailed macaques และ pig-tailed macaques"
              },
              {
                "text": "แผนที่การกระจายของเคส P. knowlesi ซ้อนทับกับพื้นที่ของยุง **Anopheles leucosphyrus group** ใน Southeast Asia โดยลิง macaque อาศัยในป่าและชายป่าตั้งแต่ India, Myanmar, Thailand, Cambodia, Laos, Vietnam, Southern China, Taiwan, the Philippines, Malaysia จนถึง Indonesia (Trends in Parasitology 2009)"
              }
            ]
          },
          {
            "text": "สไลด์ยังแสดงภาพงาน primate malaria research ที่จังหวัดราชบุรี"
          }
        ]
      },
      {
        "heading": "UNGULATE MALARIA PARASITES",
        "source": "Lect 9.2 Blood apicomplexa p.8",
        "body": [
          {
            "bullets": [
              "**P. caprae ในแพะ (goats)**",
              "**P. bubalis ในควาย (buffaloes)**",
              "**P. traguli ในกระจงหนู (mouse deer)**",
              "**P. odocoilei ใน white-tailed deer**"
            ]
          }
        ]
      },
      {
        "heading": "P. caprae ในแพะ",
        "source": "Lect 9.2 Blood apicomplexa p.9",
        "body": [
          {
            "text": "สไลด์เป็นภาพจากงาน goat malaria research ที่จังหวัดเพชรบุรี แสดงระยะ **trophozoite** ของ P. caprae"
          },
          {
            "text": "คำบรรยายภาพจากตัวอย่าง KEGoat2017-43 ระบุว่า (A) putative trophozoite ที่มี crystal เล็ก 1 อันและ vacuole 2 อัน (B) putative trophozoite ที่มี double rod-shaped crystals (Kaewthamasorn et al., 2018)"
          },
          {
            "callout": "สไลด์หน้านี้เป็นภาพล้วน ไม่ได้บอกอาการทางคลินิก การวินิจฉัย หรือการรักษา malaria ในแพะ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "P. bubalis ในควาย และ P. traguli ในกระจงหนู",
        "source": "Lect 9.2 Blood apicomplexa p.10",
        "body": [
          {
            "text": "สไลด์แสดงระยะ **trophozoite** ของ P. bubalis และหัวข้อภาพ MOUSE DEER MALARIA PARASITE (P. traguli)"
          },
          {
            "sub": "ข้อมูลควายที่สไลด์ให้ไว้",
            "body": [
              {
                "bullets": [
                  "**Swamp buffaloes** กระจายจาก Assam ทางตะวันตกผ่าน Southeast Asia ไปถึงจีน และถูกนำมาเลี้ยงเมื่อประมาณ 4,000 ปีก่อน",
                  "**River buffaloes** อยู่ใน South Asia และไกลออกไปทางตะวันตกถึง Balkans, Egypt และ Italy มีต้นกำเนิดใน India และถูกนำมาเลี้ยงเมื่อประมาณ 5,000 ปีก่อน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Avian malaria: P. gallinaceum",
        "source": "Lect 9.2 Blood apicomplexa p.11",
        "body": [
          {
            "text": "ภาพจากงาน avian malaria research ที่จังหวัดฉะเชิงเทรา แสดงนกที่ติดเชื้อ Plasmodium gallinaceum และภาพ **exo-erythrocytic schizogony** ของ P. gallinaceum"
          },
          {
            "text": "หน้าถัดไปแสดง P. gallinaceum mix blood stage จากงานวินิจฉัยที่ Vet Parasitology Unit, CU"
          }
        ]
      },
      {
        "heading": "SUMMARY ปิดท้ายส่วน Plasmodium",
        "source": "Lect 9.2 Blood apicomplexa p.12",
        "body": [
          {
            "bullets": [
              "**ยาที่ออกฤทธิ์สั้นและเป็น drug of choice คือ artemisinin derivatives** เพราะยาต้านมาลาเรียส่วนใหญ่ออกฤทธิ์ได้ดีกับ blood stage",
              "**Primaquine แนะนำสำหรับ liver stage**",
              "**P. gallinaceum มีวงจรชีวิตซับซ้อนที่สุด และมักพบ recrudescent คือการกลับมาของอาการ**"
            ]
          }
        ]
      },
      {
        "heading": "Hepatocystis: host และ vector",
        "source": "Lect 9.2 Blood apicomplexa p.13",
        "body": [
          {
            "bullets": [
              "**Hepatocystis ถ่ายทอดโดยริ้น midges สกุล Culicoides**",
              "host ได้แก่ old world primates, bats, hippopotamus และ squirrels",
              "**ไม่พบสกุลนี้ใน new world**",
              "GENUS: Hepatocystis; Levaditi & Schoen, 1932 อยู่ใน FAMILY Plasmodiidae",
              "**ในไทยมีรายงานในลิงแสมและค้างคาว**"
            ]
          }
        ]
      },
      {
        "heading": "Hepatocystis: จุดที่ต้องจำเรื่องวงจร",
        "source": "Lect 9.2 Blood apicomplexa p.14",
        "body": [
          {
            "bullets": [
              "**SCHIZOGONY เกิดที่ตับเท่านั้น (SEEN IN LIVER ONLY)**",
              "**NO BLOOD SCHIZOGONY คือไม่มี schizogony ในเลือด**"
            ]
          },
          {
            "text": "ภาพในเลือดที่สไลด์แสดงจึงเป็น microgametocyte และ macrogametocyte รวมถึงภาพที่พบทั้งสองระยะร่วมกัน โดยตัวอย่างมาจากค้างคาวหน้ายักษ์ทศกัณฐ์ (Hipposideros armiger)"
          }
        ]
      },
      {
        "heading": "Leucocytozoon: species และลักษณะร่วมของสกุล",
        "source": "Lect 9.2 Blood apicomplexa p.15",
        "body": [
          {
            "sub": "Species ที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "Leucocytozoon simondi พบใน young erythrocyte",
                  "Leucocytozoon smithi พบใน WBC",
                  "Leucocytozoon caulleryi",
                  "Leucocytozoon sabrazesi"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะร่วมของสกุล",
            "body": [
              {
                "bullets": [
                  "ทุก species ก่อโรคทั้งใน domestic และ wild hosts",
                  "**Schizogony เกิดใน host tissue, gametogony เกิดใน leukocytes และ immature erythrocytes, sporogony เกิดในแมลง**",
                  "**ไม่พบ malarial pigment ในทุกระยะ (No malarial pigment found in all stages)**",
                  "**ในไทยมีอย่างน้อย 2 species สำคัญ คือ L. caulleryi และ L. sabrazesi (maybe more)**"
                ]
              }
            ]
          },
          {
            "text": "vector ที่แสดงคือ black flies (Diptera: Simuliidae)"
          }
        ]
      },
      {
        "heading": "Leucocytozoonosis ในนก: host, อาการ และวงจรช่วงในตัวนก",
        "source": "Lect 9.2 Blood apicomplexa p.16",
        "body": [
          {
            "sub": "species กับ host",
            "body": [
              {
                "bullets": [
                  "**L. smithi ในไก่งวง (turkeys)**",
                  "**L. simondi ในห่านและเป็ด (geese and ducks)**",
                  "**L. caulleryi และ L. sabrazesi ในไก่ (chickens)**"
                ]
              }
            ]
          },
          {
            "sub": "ความรุนแรงและอาการ",
            "body": [
              {
                "bullets": [
                  "**ทุก species ก่อโรครุนแรงในนกอายุน้อย**",
                  "L. smithi ทำให้ anorexia, emaciation และ extreme limb weakness",
                  "**ลูกห่านและลูกเป็ดที่ติด L. simondi ตายได้เร็วภายใน 1 วันหลังรับเชื้อ**",
                  "นกที่ได้รับวัคซีนและนกที่รอดจากโรคแล้ว ไม่เสี่ยงต่อปรสิตนี้อีก",
                  "**No known guaranteed cure คือยังไม่มีการรักษาที่รับรองผลได้**"
                ]
              }
            ]
          },
          {
            "sub": "Life cycle ช่วงในตัวนก",
            "body": [
              {
                "bullets": [
                  "intermediate host คือ blackfly วงศ์ Simuliidae (Simulium)",
                  "sporozoites ถูกปล่อยจาก saliva ของ vector เข้าสู่ระบบไหลเวียนเลือดของนก",
                  "sporozoites เข้า liver cells แล้วพัฒนาเป็น small schizonts ซึ่งสร้าง merozoites",
                  "merozoites เข้าได้ทั้ง red blood cells หรือ macrophages"
                ]
              }
            ]
          },
          {
            "sub": "Tissue stage",
            "body": [
              {
                "bullets": [
                  "ใน macrophage หรือเนื้อเยื่ออื่น merozoites พัฒนาเป็น **megaloschizonts** แล้วแบ่งเป็น **primary cytomeres**",
                  "megaloschizont บางส่วนเกิดใน hepatocytes หรือ hepatic sinusoidal endothelial cells",
                  "**ระยะนี้ merozoites จะเข้า white blood cells หรือ developing red blood cells เพื่อกลายเป็น elongated gametocytes ซึ่งยาวประมาณ 12-14 microns**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Leucocytozoon: ระยะในเลือดและใน vector รวมถึง epidemiology",
        "source": "Lect 9.2 Blood apicomplexa p.17",
        "body": [
          {
            "sub": "Blood and vector stages",
            "body": [
              {
                "bullets": [
                  "blackfly กิน elongated gametocytes เข้าไป",
                  "**macrogametocyte เพศเมียมี red-staining nucleus ส่วน microgametocyte เพศผู้มี pale-staining diffuse nucleus** เมื่อผสมกันได้ ookinete",
                  "ookinete เข้า intestinal cell ของแมลง แล้วเจริญเป็น oocyst",
                  "oocyst สร้าง sporozoites ที่ย้ายไปที่ salivary glands ของ blackfly แล้ววงจรเริ่มใหม่"
                ]
              },
              {
                "text": "ภาพประกอบแสดง megaloschizont, cytomeres และ merozoites"
              }
            ]
          },
          {
            "sub": "Epidemiology",
            "body": [
              {
                "bullets": [
                  "L. simondi ถูกสงสัยว่าเกี่ยวข้องกับประชากร Canadian geese ในบางพื้นที่ รวมถึง upper Midwestern USA และ Canada",
                  "L. smithi กระทบฟาร์มไก่งวงทางตะวันออกเฉียงใต้ของ USA",
                  "**Leucocytozoon ไม่ติดในคน และสัตว์ปีกที่ติดเชื้อไม่ก่อโรคในคน**"
                ]
              },
              {
                "callout": "ประโยคเรื่อง Canadian geese บนสไลด์พิมพ์ไม่สมบูรณ์ (เขียนว่า major inhabited of ... population growth) จึงบอกไม่ได้ชัดว่าผู้สอนหมายถึงเป็นตัวจำกัดหรือส่งเสริมประชากร",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "ผลกระทบทางเศรษฐกิจ การควบคุม และ Leucocytozoonosis ในไทย",
        "source": "Lect 9.2 Blood apicomplexa p.18",
        "body": [
          {
            "bullets": [
              "**อัตราตายสูงมากโดยเฉพาะในนกอายุน้อย จึงกระทบรายได้ผู้เลี้ยงสัตว์ปีก**",
              "**การควบคุม blackfly vector น่าจะเป็นวิธีที่ดีที่สุดในการลดการติดเชื้อ แต่ blackfly ขยายพันธุ์ได้เร็วและง่ายเมื่อสภาพเหมาะสม**",
              "L. simondi: gamonts อยู่ใน RBC, vector คือ Simulium sp., มีระยะ megaloschizont"
            ]
          },
          {
            "sub": "สองชนิดในไทย",
            "body": [
              {
                "bullets": [
                  "**L. caulleryi เป็น highly pathogenic species ในไก่ vector บนสไลด์คือ Culicoides**",
                  "**L. sabrazesi เป็น species ที่ก่อโรคน้อยกว่า พบในไก่บ้านที่เลี้ยงในพื้นที่ป่า vector บนสไลด์คือ Simulium**"
                ]
              }
            ]
          },
          {
            "sub": "L. caulleryi (Mathis & Leger, 1909)",
            "body": [
              {
                "bullets": [
                  "เป็น pathogenic protozoan parasite ของไก่ พบ megaloschizont ได้ทั่วไปในหลายประเทศแถบเอเชีย (Akiba, 1960, 1970)",
                  "**leucocytozoonosis ทำให้ไข่ลดลง น้ำหนักลด และบางครั้งถึงตาย**",
                  "การวินิจฉัยทาง serology รายงานครั้งแรกโดย Morii (1972) ที่ใช้ agar gel precipitation (AGP) ตรวจ soluble antigen และ antibody ในซีรัมไก่ที่ติดเชื้อ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "L. caulleryi pathogenesis และข้อมูลของ L. sabrazesi",
        "source": "Lect 9.2 Blood apicomplexa p.19",
        "body": [
          {
            "sub": "พยาธิกำเนิดของ L. caulleryi",
            "body": [
              {
                "bullets": [
                  "**พบ schizont ขนาดใหญ่จำนวนมากใน ovary และ oviducts ของไก่**",
                  "รอยโรคร่วมคือ granulomatous และ lymphocytic inflammation, edema และ pressure atrophy",
                  "**uterine region ซึ่งเป็นส่วนที่สร้างเปลือกไข่ เสียหายรุนแรงที่สุด**",
                  "รอยโรคในอวัยวะสืบพันธุ์เหล่านี้อธิบายกลไกของการที่แม่ไก่ไข่ที่ติด L. caulleryi ไข่ลดลงและออกไข่เปลือกนิ่ม (soft-shelled eggs)"
                ]
              }
            ]
          },
          {
            "sub": "L. sabrazesi",
            "body": [
              {
                "bullets": [
                  "**มีบันทึกในฐานข้อมูลนานาชาติน้อยมาก**",
                  "รายงานแรกมาจาก Malayan jungle fowl (Gallus gallus spadiceus)"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ยังวางภาพ Culicoides และ Simulium คู่กับภาพ microgamete และ macrogamete ของ L. caulleryi"
          }
        ]
      },
      {
        "heading": "Haemoproteus: ลักษณะและ host",
        "source": "Lect 9.2 Blood apicomplexa p.20",
        "body": [
          {
            "bullets": [
              "เป็น blood parasite สำคัญอีกตัวหนึ่งในไก่",
              "**ในกระแสเลือดพบเฉพาะ gametocytes เท่านั้น (Only gametocytes are found in the blood circulation)**",
              "**Morphology คือเซลล์รูปไส้กรอก (sausage-like cell) อยู่ใน cytoplasm ของ RBC นก**",
              "บางครั้งเรียกกันว่า pigeon malaria และมักสับสนกับ blood parasite ที่คล้ายกัน เช่น P. gallinaceum",
              "เป็นปรสิตของเม็ดเลือดแดงใน pigeons และ doves"
            ]
          },
          {
            "sub": "สาม species ที่พบในนกพิราบ",
            "body": [
              {
                "bullets": [
                  "**H. columbae ซึ่งพบมาก (abundant)**",
                  "H. sacharrovi ระบุว่า unidentified",
                  "H. maccallumi ระบุว่า unidentified"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เดียวกันนี้อ้าง Zhao W et al. (2015) ว่า gametocytes ของ Leucocytozoon sabrazesi ติดใน chicken thrombocytes ไม่ใช่เซลล์เลือดชนิดอื่น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Haemoproteus: pathology, morphology และ life cycle",
        "source": "Lect 9.2 Blood apicomplexa p.21",
        "body": [
          {
            "sub": "Pathology",
            "body": [
              {
                "bullets": [
                  "**Haemoproteus ในนกพิราบก่อโรคต่ำ (low pathogenic)** และมักไม่ก่อโรค อยู่ในนกโดยไม่ถูกตรวจพบ",
                  "มีรายงานเคสหายากที่ทดลองทำให้นก super infected ด้วยจำนวนเชื้อสูงผิดธรรมชาติ ผลคือนกทนต่อ cold stress ได้น้อยลงระดับปานกลาง"
                ]
              }
            ]
          },
          {
            "sub": "แยก macro กับ micro gametocyte",
            "body": [
              {
                "bullets": [
                  "**Macrogametocyte: cytosol ออกน้ำเงิน นิวเคลียสสีแดงเข้ม granules กระจายทั่ว**",
                  "**Microgametocyte: cytosol สีชมพูหรือสีจาง granules อยู่ที่ปลายทั้งสองข้าง**"
                ]
              }
            ]
          },
          {
            "sub": "Life cycle",
            "body": [
              {
                "bullets": [
                  "**vector คือ pigeon fly สกุล Pseudolynchia**",
                  "sporozoites จากแมลงถูกฉีดเข้าตัวนก แล้วย้ายไปที่ lung, liver และ spleen",
                  "เชื้อเพิ่มจำนวนสองวิธี จนได้ปรสิตจำนวนมากที่ถูกปล่อยเข้าสู่กระแสเลือด แต่ **สไลด์ไม่ได้บอก** ว่าสองวิธีนั้นคืออะไร",
                  "microgametocytes และ macrogametocytes เข้า RBC ของนกพิราบ แล้วถูก pigeon fly ตัวถัดไปกินระหว่าง blood meal",
                  "sporozoites พบที่ salivary glands ของ pigeon fly พร้อมฉีดเข้านกพิราบตัวใหม่",
                  "**วงจรใช้เวลา 6 สัปดาห์**"
                ]
              },
              {
                "text": "แผนภาพวงจรบนสไลด์ระบุคำสำคัญไว้คือ lung, megaloschizont, sporozoites, macrogametocyte และ microgametocyte"
              }
            ]
          }
        ]
      },
      {
        "heading": "การป้องกัน Haemoproteus",
        "source": "Lect 9.2 Blood apicomplexa p.22",
        "body": [
          {
            "bullets": [
              "**ยาต้านมาลาเรียใช้เพื่อป้องกันการติด Haemoproteus ไม่ใช่เพื่อรักษา**",
              "ถ้ารักษานกพิราบที่ติดเชื้อแล้ว ปรสิตจะกลับเข้าไปติดเม็ดเลือดแดงใหม่เมื่อหยุดยา",
              "**เมื่อนกพิราบติดเชื้อแล้ว ไม่มีทางรักษาให้หาย (no cure once infected)**",
              "เมื่อใช้ chloroquine, primaquine หรือ quinacrine เป็นยาป้องกัน แม้ในขนาดต่ำก็อาจเกิดผลข้างเคียงได้",
              "**การใช้ insecticide powders ก่อนและหลังการแข่ง เป็น best management practice เพื่อกัน pigeon flies และการติด Haemoproteus**"
            ]
          }
        ]
      },
      {
        "heading": "สไลด์เทียบ gametocyte สี่สกุล",
        "source": "Lect 9.2 Blood apicomplexa p.23",
        "body": [
          {
            "text": "หน้านี้เป็นแผ่นภาพเปรียบเทียบล้วน ไม่มีคำอธิบายเป็นข้อความ ประกอบด้วย"
          },
          {
            "bullets": [
              "Hepatocystis แสดง macrogametocyte และ microgametocyte",
              "Gametocytes ของ Leucocytozoon sp. แยก microgametocytes กับ macrogametocytes",
              "Gametocytes ของ Haemoproteus sp. แยก microgametocytes กับ macrogametocytes",
              "**Plasmodium gallinaceum แสดงครบทั้ง trophozoite (ring form), schizonts, macrogametocyte และ microgametocyte**"
            ]
          },
          {
            "callout": "จุดที่แผ่นภาพนี้สื่อคือ Plasmodium เห็นได้ทั้ง trophozoite และ schizont ในเลือด ขณะที่อีกสามสกุลบนแผ่นเดียวกันแสดงเฉพาะ gametocyte แต่สไลด์ไม่ได้เขียนข้อสรุปนี้เป็นตัวหนังสือ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Piroplasms: ภาพรวม Babesiosis",
        "source": "Lect 9.2 Blood apicomplexa p.24",
        "body": [
          {
            "bullets": [
              "**VECTORS คือ hard ticks เช่น Ixodes, Rhipicephalus และอื่น ๆ**",
              "HOSTS ได้แก่ ruminants, canids, felids, equids, swine, humans, rodents และ bats",
              "TARGET CELLS คือ haematopoietic systems",
              "**มีทั้ง TRANSOVARIAL และ TRANSSTADIAL TRANSMISSION**"
            ]
          }
        ]
      },
      {
        "heading": "Human babesiosis",
        "source": "Lect 9.2 Blood apicomplexa p.25",
        "body": [
          {
            "bullets": [
              "**เกิดจาก B. microti, B. duncani, B. venatorum และ B. divergens**",
              "อาการคล้าย malaria คือ ไข้สูงถึง 40.5 องศาเซลเซียส, shaking chills, severe anemia แบบ hemolytic anemia และ organ failure",
              "**เคสรุนแรงมักเกิดในเด็กเล็กมาก ผู้สูงอายุมาก ผู้ที่ไม่มีม้าม (asplenic) และผู้ที่มี immunodeficiency เช่นผู้ป่วย HIV/AIDS**",
              "vector ที่แสดงคือ Ixodes spp."
            ]
          },
          {
            "sub": "รูปร่างในเม็ดเลือดแดงคน (จากคำบรรยายแผ่นภาพ)",
            "body": [
              {
                "bullets": [
                  "Paired piriforms",
                  "Ring forms"
                ]
              },
              {
                "text": "แผ่นภาพเทียบ B. divergens, B. venatorum, Babesia sp. MO1, B. microti, B. duncani และ Babesia sp. KO1"
              }
            ]
          }
        ]
      },
      {
        "heading": "Bovine babesiosis",
        "source": "Lect 9.2 Blood apicomplexa p.26",
        "body": [
          {
            "bullets": [
              "เป็นโรคปรสิตที่คล้าย malaria เกิดจากการติดเชื้อ Babesia ซึ่งเป็น Apicomplexa",
              "**ชื่ออื่นคือ Texas cattle fever, Redwater หรือ Piroplasmosis**",
              "**No exoerythrocytic stage**",
              "**Vector คือ Rhipicephalus (Boophilus) microplus**",
              "เพิ่มจำนวนแบบ binary fission",
              "**Babesia bovis เป็น species ที่ virulent ที่สุด**"
            ]
          },
          {
            "sub": "Clinical signs ของ Bovine Babesiosis",
            "body": [
              {
                "bullets": [
                  "Fever",
                  "**Coffee color of urine**",
                  "Lymph node swelling",
                  "Weakness, edema และตายถ้าไม่ได้รับการรักษา"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาพพยาธิสภาพของ B. bovis และ B. bigemina",
        "source": "Lect 9.2 Blood apicomplexa p.27",
        "body": [
          {
            "text": "ภาพ venule จาก cerebral cortex ของลูกวัวที่ถูกตัดม้ามและติด B. bovis แสดง **sequestration ของ parasitized erythrocytes** (Everit et al, 1986, Vet. Pathol. 23:556-562)"
          },
          {
            "text": "อีกภาพหัวข้อว่า Bovine babesiosis: Babesia bigemina แต่สไลด์ไม่ได้เขียนคำบรรยายเพิ่มเติมให้"
          }
        ]
      },
      {
        "heading": "Canine babesiosis",
        "source": "Lect 9.2 Blood apicomplexa p.28",
        "body": [
          {
            "bullets": [
              "**เกิดจาก B. canis canis, B. canis vogeli, B. canis conrade ซึ่งเป็น large Babesia และ B. gibsoni ซึ่งเป็น small Babesia**",
              "**Vector คือ Rhipicephalus sanguineus (brown dog tick)**",
              "อาการได้แก่ ไข้, severe anemia แบบ hemolytic anemia และ organ failure"
            ]
          },
          {
            "text": "สไลด์แสดงภาพ Babesia canis และเคส canine babesiosis จากนครราชสีมา เดือนธันวาคม 2019"
          }
        ]
      },
      {
        "heading": "TREATMENT ของ babesiosis",
        "source": "Lect 9.2 Blood apicomplexa p.29",
        "body": [
          {
            "bullets": [
              "**Diminazene aceturate (berenil) 3.5 mg/kg ให้ทาง im หรือ sc**",
              "**Imidocarb diproprionate (imizol) 1-3 mg/kg ให้ทาง im หรือ sc**",
              "Supportive treatment เช่น glucose"
            ]
          },
          {
            "callout": "สไลด์ให้เฉพาะขนาดยาและทางให้ยา ไม่ได้ระบุว่าใช้กับสัตว์ชนิดใด ความถี่ หรือระยะเวลาการรักษา",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Theileriosis: species, vector และอาการ",
        "source": "Lect 9.2 Blood apicomplexa p.29",
        "body": [
          {
            "bullets": [
              "**Theileria สอง species ที่สำคัญในโคคือ T. annulata และ T. parva**",
              "**ถ่ายทอดโดยเห็บ โดย T. annulata มี Hyaloma และ T. parva มี R. appendiculatus**",
              "**T. annulata ทำให้เกิด tropical theileriosis ส่วน T. parva ทำให้เกิด east coast fever**",
              "ในไทย T. orientalis ติดในโค และ T. luweshuni ติดในแพะ",
              "Animal hosts คือ ruminants"
            ]
          },
          {
            "sub": "อาการที่สไลด์แสดง",
            "body": [
              {
                "bullets": [
                  "**ไข้สูง 41.2 องศาเซลเซียส เป็นลักษณะที่พบบ่อยในเคส acute**",
                  "ท้องเสียมีลิ่มเลือดปนในลูกวัว"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Theileriosis: การรักษาและสถานการณ์ในไทย",
        "source": "Lect 9.2 Blood apicomplexa p.30",
        "body": [
          {
            "text": "สไลด์แสดงภาพ lymph node enlargement ในลูกวัวอายุ 6 เดือนที่ติดเชื้อแบบไม่แสดงอาการ และภาพ Theileria annulata piroplasms ในโค"
          },
          {
            "sub": "TREATMENT",
            "body": [
              {
                "bullets": [
                  "**Buparvaquone, halofuginone, tetracycline, butalex และ oxytetracycline สไลด์ระบุว่าได้ผลทั้งหมด**"
                ]
              }
            ]
          },
          {
            "sub": "Theileriosis in Thailand",
            "body": [
              {
                "bullets": [
                  "**T. orientalis ในโคและกระบือ ซึ่งในอดีตเรียกว่า T. sergenti และ T. buffeli ทำให้เกิด benign หรือ nontransforming theileriosis**",
                  "**T. luweshuni ในแกะและแพะ vector น่าจะเป็น Haemaphysalis (สไลด์ใช้คำว่า probably)**",
                  "**ส่วนใหญ่ของเคสไม่ก่อโรค (most cases are non pathogenic)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ความชุกของ Theileria ในไทย",
        "source": "Lect 9.2 Blood apicomplexa p.31",
        "body": [
          {
            "bullets": [
              "**T. orientalis ในเลือดโค มีความชุก 50 เปอร์เซ็นต์ในโคพื้นเมืองไทย (Kaewthamasorn et al, 2007)**",
              "สไลด์แสดงการตรวจด้วยกล้องจุลทรรศน์พบ T. luwenshuni ในแพะไทย"
            ]
          }
        ]
      },
      {
        "heading": "Hepatozoosis",
        "source": "Lect 9.2 Blood apicomplexa p.32",
        "body": [
          {
            "bullets": [
              "Hepatozoon เป็นสกุลใน Apicomplexa alveolates ที่มีมากกว่า 300 species และสไลด์ระบุว่าเป็น obligate intraerythrocytic parasites",
              "**การสืบพันธุ์แบบอาศัยเพศและ sporogenic development เกิดใน haemocoel ของ invertebrate host ซึ่งต่อมาถูกสัตว์มีกระดูกสันหลังกินเข้าไป**",
              "sporozoites ย้ายไปที่ตับของ vertebrate host แล้วแบ่งตัวแบบ multiple fission เพื่อสร้าง merozoites",
              "**meronts ถูกปล่อยเข้ากระแสเลือดแล้วสร้าง gametocytes ซึ่งเป็นระยะสุดท้ายของการเจริญใน vertebrate host**",
              "invertebrate ที่แสดงบนสไลด์คือ Rhipicephalus sanguineus"
            ]
          },
          {
            "callout": "สไลด์เขียนว่า Hepatozoon เป็น obligate intraerythrocytic parasites แต่หน้าถัดไปแสดง gamont อยู่ใน neutrophil สไลด์ไม่ได้อธิบายความไม่ตรงกันนี้",
            "kind": "flag"
          },
          {
            "text": "หน้าเดียวกันยังมีภาพเทียบ Theileria สาม species คือ T. luwenshuni, T. uilenbergi และ T. ovis (Zhang et al 2013)"
          }
        ]
      },
      {
        "heading": "Hepatozoon canis: รอยโรคและการรักษา",
        "source": "Lect 9.2 Blood apicomplexa p.33",
        "body": [
          {
            "bullets": [
              "**ชิ้นเนื้อไขกระดูกจาก red fox พบ mature meronts ของ H. canis ที่มี typical wheelspoke structure คือ micromerozoites เรียงเป็นวงรอบแกนกลางทึบ**",
              "ชิ้นเนื้อม้ามจาก red fox พบ developing meront (Cardoso et al, 2014, Parasites & Vectors 7:113)",
              "**ในเลือดพบ gamont หรือ gametocyte ของ H. canis อยู่ใน neutrophil**"
            ]
          },
          {
            "sub": "TREATMENT",
            "body": [
              {
                "bullets": [
                  "**Hepatozoon canis รักษาด้วย imidocarb dipropionate 5-6 mg/kg ทุก 14 วัน จนกว่าจะไม่พบปรสิตใน blood smears**"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
