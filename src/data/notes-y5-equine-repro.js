// ============================================================
// การสืบพันธุ์ในม้า — Study Notes
// ============================================================
// เขียนจาก lecture 3108515 ที่แจกจริงในรายวิชา ทุก section อ้างอิงสไลด์
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

export const NOTES_Y5_EQUINE_REPRO = {
  "eqrepro-endometritis": {
    "topic": "eqrepro-endometritis",
    "title": "Endometritis in mare",
    "lecturer": "Theerawat Swangchan-Uthai",
    "icon": "🔥",
    "summary": "ภาวะเยื่อบุมดลูกอักเสบในแม่ม้า เริ่มจากหน้าที่ของมดลูกและ endometrium, contamination กับ infection, กลไกป้องกันของมดลูก และนิยามของ endometritis, metritis, perimetritis, parametritis, pyometra และ endometrosis จากนั้นไล่ชนิดของ endometritis รวม PBIE, ปัจจัยเสี่ยง, เชื้อที่เกี่ยวข้อง และผลต่อ fertility การวินิจฉัยด้วย ultrasound, cytology, culture และ biopsy พร้อม decision tree ส่วนการรักษาแบ่งเป็น 4 เป้าหมาย: ระบายสิ่งที่คั่งในมดลูก, คุมการติดเชื้อ, ลดการอักเสบ และป้องกันการกลับเป็นซ้ำ โดยมี pyometra เป็นหัวข้อแยก",
    "sections": [
      {
        "heading": "หน้าที่ของมดลูกและ endometrium",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.3-9; บันทึกคาบ 1 ต.ค. 2569 [09:33-19:32]",
        "body": [
          {
            "bullets": [
              "ม้าที่จัดการเลี้ยงดูตามโปรโตคอลครบแล้ว ก็ยังมีบางตัวผสมไม่ติด fertility ของม้าปกติอยู่ราว 75-90 % ต่อการผสม 1 ครั้ง (ตัวเลขคร่าวๆ ต่างกันตามพื้นที่)"
            ]
          },
          {
            "sub": "ชั้นของมดลูก",
            "body": [
              {
                "bullets": [
                  "**Endometrium** = mucosa (ชั้นในสุด) รวมกับ submucosa (stroma) โดยมี uterine glands อยู่ในชั้นนี้",
                  "ถัดลงไปคือ **myometrium** ที่มี circular layer กับ longitudinal layer และชั้นนอกสุดคือ serosa",
                  "endometrium ของม้าพับเป็น endometrial folds เพื่อรองรับการขยายเมื่อลูกโต และเพิ่มพื้นที่ผิวสำหรับ secretion"
                ]
              }
            ]
          },
          {
            "sub": "มดลูกรับผิดชอบเรื่องอะไร",
            "body": [
              {
                "bullets": [
                  "ผลิตลูกให้สำเร็จ (successful production of new offspring)",
                  "ตอบสนองและสร้างสภาพแวดล้อมที่เอื้อต่อ sperm และ conceptus ซึ่งทั้งสองอย่างเป็นของแปลกปลอมต่อแม่ จึงต้องมีกลไกที่ไม่ปฏิเสธทั้งคู่",
                  "ร่วมสร้าง placenta และขับลูกกับเยื่อหุ้มลูกตอนคลอด",
                  "ควบคุม luteolysis และ oestrous cyclicity โดยผลิต PGF2α ไปที่รังไข่ เกิด luteolysis แล้วมี follicle ใหม่"
                ]
              }
            ]
          },
          {
            "sub": "ภาพเปรียบเทียบเรื่อง implantation",
            "body": [
              {
                "bullets": [
                  "ลูกที่เข้ามาในมดลูกเหมือนเครื่องบินลงจอดบนเรือบรรทุกเครื่องบิน ถ้ามดลูกดี ลูกจอดได้ = successful implantation",
                  "**Embryonic defect**: ตัวลูกมีปัญหา จึง implant ไม่สำเร็จ",
                  "**Implantation site defect**: ตำแหน่งที่ implant บกพร่อง ปฏิสนธิได้แต่ implant ไม่ได้ จึงไม่ conceive"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Contamination กับ infection",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.10; บันทึกคาบ 1 ต.ค. 2569 [19:32-23:03]",
        "body": [
          {
            "bullets": [
              {
                "label": "Contamination",
                "value": "มดลูกถูก contaminate ตามปกติหลังจาก cervix เปิด เช่นตอนผสมและตอนคลอด"
              },
              {
                "label": "Infection",
                "value": "เชื้อ adherence, penetration และ colonisation ที่ mucosa ของมดลูก ครบทั้งสามอย่างจึงเรียก infection"
              },
              {
                "label": "Risk of contamination",
                "value": "host, pathogen, environment"
              }
            ]
          },
          "เมื่อมี contamination ร่างกายต้องมี inflammation เป็นกลไกปกติในการกำจัดเชื้อ ถ้าป้องกันตัวได้ contamination ก็หายไป ถ้าสู้ไม่ได้จึงเกิด infection",
          {
            "bullets": [
              "ผลลัพธ์อีกแบบคือ **unresolved endometrial inflammation**: สู้เชื้อได้แล้ว แต่ร่างกายไม่สามารถปิดการอักเสบ (resolution) จึงเกิด inflammation เรื้อรังต่อไป",
              "ภาวะนี้ทำให้เกิด endometritis ได้แม้ไม่มีเชื้อเหลืออยู่"
            ]
          }
        ]
      },
      {
        "heading": "กลไกป้องกันของมดลูก",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.13; บันทึกคาบ 1 ต.ค. 2569 [26:00-30:30]",
        "body": [
          {
            "bullets": [
              "**ด่านที่ 1, tract secretions**: mucus, proteolytic enzymes, IgA, scavenger cells ร่วมกับ uterine clearance และ uterine lymphatic drainage",
              "**ด่านที่ 2, initial innate response**: complement, macrophages, NK cells, neutrophils",
              "**ด่านที่ 3, specific immune response**: lymphocytes, T-cells, B-cells (antibodies)"
            ]
          },
          {
            "sub": "Receptors ที่ตรวจจับเชื้อ (PRRs: pattern recognition receptors)",
            "body": [
              {
                "bullets": [
                  "TLRs: Toll-like receptors",
                  "NLRs: Nucleotide oligomerisation domain-like receptors",
                  "RLRs: Retinoic acid-inducible gene-1-like receptors",
                  "CLRs: C-type lectin receptors",
                  "AIM2: Absent in melanoma 2",
                  "PRRs จำ pattern ของเชื้อ (เช่น endotoxin) ไม่ได้จำเฉพาะตัวเชื้อ"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ในมดลูกให้น้ำหนักกับ innate response มากกว่า เพราะมดลูกทำงานเป็นวงจรและมีการหลุดลอก และ innate ทำงานเป็นหลักวินาที",
              "specific immune response กว่าจะได้ antibody ใช้เวลาราว 10-14 วัน เชื้อไม่รอ"
            ]
          }
        ]
      },
      {
        "heading": "นิยามของ endometritis และภาวะที่ใกล้เคียง",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.11-12; บันทึกคาบ 1 ต.ค. 2569 [23:03-26:00]",
        "body": [
          {
            "bullets": [
              {
                "label": "Endometritis",
                "value": "การอักเสบจำกัดอยู่ที่ endometrium (mucosa กับ submucosa)"
              },
              {
                "label": "Metritis",
                "value": "การอักเสบของมดลูกทั้งความหนาของผนัง"
              },
              {
                "label": "Perimetritis",
                "value": "การอักเสบลามถึง serosa"
              },
              {
                "label": "Parametritis",
                "value": "การอักเสบลามถึง suspensory ligaments"
              },
              {
                "label": "Pyometra",
                "value": "หนองคั่งใน uterine lumen ร่วมกับมี CL ที่ active"
              },
              "Endometrosis: การอักเสบเรื้อรังนานๆ จนเกิด fibrosis ที่ endometrium ทำให้ infertility ในม้าได้มาก ภาวะนี้ค่อนข้างเป็นลักษณะเฉพาะของม้า"
            ]
          },
          "ความต่างของทุกภาวะอยู่ที่ชั้นของผนังมดลูกที่อักเสบ"
        ]
      },
      {
        "heading": "ชนิดของ endometritis และ PBIE",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.14-15; บันทึกคาบ 1 ต.ค. 2569 [30:30-34:34]",
        "body": [
          {
            "bullets": [
              "**Acute** กับ **chronic** endometritis",
              "**Clinical** กับ **subclinical** endometritis (ในคน paper ใช้ symptomatic กับ asymptomatic แต่สัตวแพทย์ยังใช้ clinical กับ subclinical)",
              "แบ่งตามเวลา: **post-breeding endometritis** และ **postpartum metritis** (acute metritis)",
              "แบ่งตามเชื้อ เช่น **fungal endometritis** เมื่อเจอเชื้อรา"
            ]
          },
          "ในโคปัญหาหลักอยู่ที่ช่วงหลังคลอด แต่ในม้าช่วงผสมเป็นช่วงที่มักมีปัญหา จึงมีชื่อเฉพาะของภาวะหลังผสมคือ PBIE",
          {
            "sub": "Persistent breeding-induced endometritis (PBIE)",
            "body": [
              {
                "bullets": [
                  "Acute inflammatory response ของ endometrium ต่อ semen",
                  "ระบาย fluids และ sperm ส่วนเกินออกไม่ได้ ซึ่งสัมพันธ์กับการอักเสบ",
                  "**Non-infectious disease**: เชื้อน่าจะถูกเคลียร์ไปแล้ว sperm เองกระตุ้นให้ defense mechanism ตอบสนองเกินและเกิดการอักเสบ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยเสี่ยงและเชื้อที่เกี่ยวข้อง",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.16-18; บันทึกคาบ 1 ต.ค. 2569 [34:34-39:00]",
        "body": [
          {
            "sub": "Predisposing factors",
            "body": [
              {
                "bullets": [
                  "อายุมาก (the elderly)",
                  "ออกลูกหลายครั้ง (multiparity)",
                  "ภูมิคุ้มกันของแม่ม้า: ไม่ได้มีแค่ต่ำ ภูมิคุ้มกันที่ไวเกินก็ทำให้เกิดปัญหาได้",
                  "perineal conformation ผิดปกติ",
                  "retained placenta จากการคลอดครั้งก่อน",
                  "**susceptible mares** กับ **resistant mares**: บางตัวผสมกี่ครั้งก็มีปัญหา บางตัวไม่เคยเป็นเลย"
                ]
              }
            ]
          },
          {
            "sub": "Bacterial induced endometritis",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Sperm-induced",
                    "value": "Taylorella equigenitalis (contagious equine metritis); Klebsiella pneumoniae, Pseudomonas aeruginosa"
                  },
                  "Opportunistic infection จาก bacterial flora และ contamination",
                  {
                    "label": "Pathogenic bacteria",
                    "value": "Streptococcus zooepidemicus, Escherichia coli, Staphylococcus spp."
                  }
                ]
              }
            ]
          },
          {
            "sub": "จุลชีพอื่น",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Fungi และ yeast",
                    "value": "Candida sp., Aspergillus sp."
                  },
                  "Virus ไม่ใช่สาเหตุโดยตรงที่ชัดเจน แต่ทำให้ภูมิคุ้มกันตกได้ จึงเปิดทางให้ opportunistic infection"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ผลของ endometritis ต่อ fertility",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.19; บันทึกคาบ 1 ต.ค. 2569 [39:00-41:30]",
        "body": [
          {
            "bullets": [
              "เป็นสาเหตุหลักของ fertility ที่ลดลง",
              "Failure to conceive: ผสมไม่ติดเพราะ implant ไม่ได้",
              "Early fetal loss: implant ได้แต่อยู่ต่อไม่ได้",
              "Mid-gestational abortion",
              "Placentitis: ตัวที่ช่วยให้ลูกอยู่รอดเสียหายไป ลูกอาจตายในท้อง",
              "Birth of septic neonate: ลูกคลอดออกมาได้แต่อาจไม่รอด หรือเป็น stillbirth",
              "Delays in re-breeding: การให้ลูกหรือการผสมครั้งถัดไปเลื่อนออกไป"
            ]
          },
          {
            "bullets": [
              {
                "label": "Subfertility",
                "value": "ติดได้ แต่ติดในอัตราต่ำกว่าปกติ ยังมีทางติดหากแก้ปัญหา"
              },
              {
                "label": "Infertility",
                "value": "นิยามต่างกันตามชนิดสัตว์ เช่น ผสมกี่ครั้งก็ไม่ติด หรือไม่เคยติดเลย"
              }
            ]
          }
        ]
      },
      {
        "heading": "Adverse outcomes: การอักเสบกระทบระบบสืบพันธุ์อย่างไร",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.20; บันทึกคาบ 1 ต.ค. 2569 [41:30-44:02]",
        "body": [
          "จุดเริ่มคือช่วง breeding และ postpartum ที่เกิด spontaneous inflammation และเชื้อเข้ามาทาง cervix ที่เปิด",
          {
            "sub": "1. Proinflammation-inflammation",
            "body": [
              {
                "bullets": [
                  "Attract WBCs",
                  "Endometrial และ tubal damage",
                  "Tubo-ovarian adhesion",
                  "Impair embryogenesis",
                  "Apoptosis"
                ]
              }
            ]
          },
          {
            "sub": "2. ROS generation",
            "body": [
              {
                "bullets": [
                  "Impair ova และ sperm function",
                  "Apoptosis ของ endometrial cell",
                  "ROS ลอยไปได้ไกลจนถึงรังไข่"
                ]
              }
            ]
          },
          {
            "sub": "3. Pro-resolution period",
            "body": [
              {
                "bullets": [
                  "ร่างกายต้องควบคุม inflammatory mediators ที่แรงด้วย TOLLIP, IGF1, GATA2, SERPINA14, SHC2",
                  "ถ้ากลไกนี้มีปัญหา จะเกิด persistent inflammation"
                ]
              }
            ]
          },
          {
            "sub": "4. Hypothalamus-pituitary-gonadal axis",
            "body": [
              {
                "bullets": [
                  "Suppress LH secretion",
                  "Decrease chance to ovulate"
                ]
              }
            ]
          },
          {
            "sub": "5. Ovary",
            "body": [
              {
                "bullets": [
                  "Slow growth of dominant follicle",
                  "Less plasma E2",
                  "Less progesterone",
                  "Disrupted luteolysis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัย: clinical และ subclinical endometritis",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.21; บันทึกคาบ 1 ต.ค. 2569 [44:31-46:33]",
        "body": [
          {
            "sub": "Clinical endometritis",
            "body": [
              {
                "bullets": [
                  "ตรวจพบ uterine fluid (ปริมาณเกินปกติ)",
                  "Vaginitis ต้องแยกออกด้วย cytology",
                  "Vaginal discharge ชนิดหนอง (PVD, purulent vaginal discharge)"
                ]
              }
            ]
          },
          {
            "sub": "Subclinical endometritis",
            "body": [
              {
                "bullets": [
                  "Ultrasound ทุกวันหรือวันเว้นวันตลอดช่วง oestrus แล้วตรวจอีก 1-2 วันหลังผสมหรือหลัง ovulation",
                  "Uterine cytology ที่มากกว่า 2 % PMNs",
                  "Bacterial culture และ sensitivity"
                ]
              }
            ]
          },
          {
            "bullets": [
              "เจอ purulent vaginal discharge ยังไม่ยืนยันว่าเป็น endometritis ทั้งในโคและม้า ในโคเป็นปัจจัยเสี่ยงที่มีงานศึกษาว่าสัมพันธ์กัน",
              "ในม้าต้องตรวจให้พบว่ามี excessive fluid ในมดลูก จะมีหนองหรือไม่ก็ได้"
            ]
          },
          {
            "callout": "เกณฑ์ PMN มีสองหน่วยในเอกสารเดียวกัน: มากกว่า 2 % PMNs (เกณฑ์ subclinical endometritis และ decision tree) กับ neutrophil มากกว่า 2 เซลล์ต่อ 400x power field (หัวข้อ cytology) ทั้งสองถูกเก็บไว้ตามที่พิมพ์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Ultrasonography",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.22-23; บันทึกคาบ 1 ต.ค. 2569 [47:00-48:30]",
        "body": [
          {
            "bullets": [
              "Transrectal sonogram ความถี่ 5-7.5 MHz ตรวจทางทวารหนัก",
              "ตรวจทุกวันตลอดช่วง estrus จนถึง 2 วันหลังผสม เพราะปัญหา post-breeding endometritis เกิดมากช่วงนี้",
              "ดู intraluminal uterine fluid ทั้งการสะสมและปริมาณ",
              "fluid มากกว่า 2 cm ในช่วง 6-36 ชั่วโมงหลังผสม บ่งชี้ **post-breeding endometritis** (Troedsson และคณะ, 1995)",
              "เส้นผ่านศูนย์กลาง uterine horn ในแม่ม้า repeat breeding ที่มี endometritis คือ 7.28 cm เทียบกับม้าปกติ 5.18 cm",
              "เครื่องมีขีด marker ให้อ่านขนาด ประมาณ 1 ขีดต่อ 1 cm"
            ]
          },
          {
            "sub": "ระดับของ fluid ที่เห็น",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ระดับ A",
                    "value": "fluid น้อย, anechoic (ดำ)"
                  },
                  {
                    "label": "ระดับ B",
                    "value": "fluid ปานกลาง, hypoechoic (เทา)"
                  },
                  {
                    "label": "ระดับ C",
                    "value": "fluid มากหรือรุนแรง, hyperechoic (ดำมีจุดขาว)"
                  },
                  "สีและ echogenicity ของ fluid บ่งชี้ว่ามีหนองอยู่ภายในมากน้อยเพียงใด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Culture, cytology และ biopsy",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.24-26; บันทึกคาบ 1 ต.ค. 2569 [49:00-54:31]",
        "body": [
          {
            "bullets": [
              {
                "label": "Bacterial culture",
                "value": "guarded swab, biopsy"
              },
              {
                "label": "Cytology",
                "value": "neutrophil มากกว่า 2 เซลล์ต่อ 400x power field; เก็บด้วย biopsy, swab หรือ cytobrush"
              },
              "เครื่องมือต้องผ่าน vulva, vestibule และ cervix ก่อนถึงมดลูก จึงใช้ swab ที่มีปลอกนำ (guard) สอดไปถึงจุดที่ต้องการก่อนเก็บตัวอย่าง",
              "ต้องการเซลล์ใช้ cytobrush (แปรงกลมเล็ก) ปัดเก็บเซลล์ไปย้อมสี ต้องการเนื้อเยื่อใช้ biopsy forceps แบบ alligator ที่หนีบ endometrium ออกมา"
            ]
          },
          {
            "sub": "เปรียบเทียบวิธีตรวจ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Ultrasound",
                    "value": "ตรวจหา fluid, เร็วและทำซ้ำได้ แต่บอกเชื้อหรือพยาธิสภาพเฉพาะไม่ได้"
                  },
                  {
                    "label": "Cytobrush",
                    "value": "ตรวจหา PMNs, ถูกและเชื่อถือได้ แต่สัตว์ไม่สบายตัวบ้าง"
                  },
                  {
                    "label": "Biopsy",
                    "value": "ใช้ grading และดู fibrosis, บอก prognosis ได้ แต่ invasive ที่สุด จึงเก็บไว้เป็นด่านสุดท้าย"
                  }
                ]
              }
            ]
          },
          "การดู fibrosis ต้องใช้ biopsy เพราะเก็บเป็นเซลล์ไม่พอ ผลบอกได้ว่าม้าตัวนี้ควรอยู่ต่อไปหรือไม่ ไม่ว่าจะมีลูกหรือไม่มี"
        ]
      },
      {
        "heading": "Diagnostic decision tree",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.27; บันทึกคาบ 1 ต.ค. 2569 [54:31-58:02]",
        "body": [
          {
            "bullets": [
              {
                "label": "เห็น fluid ในมดลูกด้วย ultrasound",
                "value": "ทำ cytology"
              },
              {
                "label": "Cytology มากกว่า 2 % PMN",
                "value": "ทำ culture/sensitivity แล้วให้ targeted antibiotic"
              },
              {
                "label": "Cytology ไม่ถึงเกณฑ์",
                "value": "พิจารณา PBIE (oxytocin หรือ lavage)"
              },
              {
                "label": "ไม่เห็น fluid",
                "value": "ติดตามหลังผสม และทบทวน perineal conformation"
              }
            ]
          },
          {
            "sub": "การอ่านผล",
            "body": [
              {
                "bullets": [
                  "แม้ไม่มี fluid แต่ม้ามีประวัติผสมไม่ติดเป็นระยะ ให้ตรวจ perineal conformation และ cervix ต่อ เพราะอาจเป็น predisposing cause",
                  "cytology บวก และ culture บวก = สงสัยการติดเชื้อ ให้ดูผล sensitivity เลือก antibiotic",
                  "cytology บวก แต่ culture ไม่พบเชื้อ = ยืนยันว่ามี inflammation หรือ endometritis แน่ แต่ไม่ได้แปลว่าไม่ติดเชื้อ เพียงแต่ตอนตรวจไม่พบ",
                  "ถ้า cytology และ culture ไม่พบอะไรเลย แสดงว่าวันที่ตรวจไม่มีปัญหา แต่ถ้ายังมีปัญหา fertility เป็นระยะ อาจต้องตรวจซ้ำ",
                  "PBIE ดูจาก fluid มากกว่า 2 cm เป็นหลัก แต่ไม่มี fluid ก็ไม่ได้แปลว่าไม่มีปัญหา เพราะ inflammation อาจมีหรือไม่มี fluid ร่วมก็ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Treatment: ภาพรวม และเป้าหมายที่ 1 ระบายสิ่งที่คั่งในมดลูก",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.28-30; บันทึกคาบ 1 ต.ค. 2569 [58:02-62:00]",
        "body": [
          {
            "bullets": [
              "หลายรายหายเอง (self-limiting) ภายใน 24-72 ชั่วโมง บางตัวไม่รักษาก็หาย บางตัวต้องรักษา",
              "**Goal 1**: evacuation of content",
              "**Goal 2**: control infection",
              "**Goal 3**: promotion of defense mechanism เพราะรักษาเองได้ไม่บ่อยเท่าการช่วยให้ร่างกายสู้โรคด้วยกลไกของตัวเอง"
            ]
          },
          {
            "sub": "1.1 Uterine lavage",
            "body": [
              {
                "bullets": [
                  "ใช้ sterile saline อุ่น 1-2 L ผ่าน catheter ขนาด 30 French (10 mm)",
                  "น้ำเกลืออุ่นช่วยกระตุ้นการบีบตัวของมดลูก จึงขับออกได้มากขึ้น",
                  "lavage คือการใส่ของเหลวเข้าไปแล้วเอาออกมาด้วย"
                ]
              }
            ]
          },
          {
            "sub": "1.2 Ecbolic drugs",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Oxytocin",
                    "value": "10-20 Unit/ตัว ฉีดเข้ากล้าม (IM) ทุก 6 ชั่วโมงตามต้องการ"
                  },
                  {
                    "label": "PGF2α",
                    "value": "cloprostenol 250 µg IM"
                  },
                  "ในม้า oxytocin และ PGF2α ได้ผลดีแม้ไม่ใช่ช่วงหลังคลอด คาดว่ามี receptor เหลืออยู่ในหลายระยะ ถ้ามี discharge อยู่ในมดลูกมากจะบีบตัวขับออกได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เป้าหมายที่ 2 คุมการติดเชื้อด้วย antibiotics",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.31; บันทึกคาบ 1 ต.ค. 2569 [62:00-66:03]",
        "body": [
          {
            "bullets": [
              "เลือกได้ระหว่าง local (intrauterine) กับ systemic และระหว่างเลือกตามผล sensitivity กับ broad-spectrum",
              "ไม่มีวิธีใดดีที่สุด ขึ้นกับดุลยพินิจของสัตวแพทย์หน้างาน",
              "ถ้าสงสัยว่าเป็นเฉพาะในมดลูก อาจเคลียร์ที่มดลูกอย่างเดียว ถ้าเชื้อกระจายเป็น septicaemia หรือลามออกนอกมดลูก ต้องใช้ systemic antibiotic",
              "ถ้าใช้ systemic ต้องคิดว่ายาไปถึงมดลูกหรือไม่ และหนองกับ pH ที่ต่างจากปกติ (7) มีผลต่อการทำงานของยา",
              "ถ้ายังไม่ได้ผล sensitivity และมีหนองไหลอยู่ ให้ broad-spectrum ก่อนแล้วติดตามผล",
              "antibiotic ไม่ได้ใช้ทุกครั้ง และไม่ใช้เพื่อ prevent"
            ]
          },
          {
            "sub": "กลุ่มยาและกลไก",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Aminoglycosides",
                    "value": "neomycin, gentamicin, kanamycin, streptomycin, dihydrostreptomycin; bactericidal โดยสร้าง channel ผิดปกติที่ cell membrane; ได้ผลในที่มี oxygen"
                  },
                  {
                    "label": "Polymyxin B",
                    "value": "bactericidal จับ cell membrane ให้ซึมผ่านได้มากขึ้น; ได้ผลกับ gram negative"
                  },
                  {
                    "label": "Nitrofuran derivative: furaltadone",
                    "value": "bactericidal โดยทำให้สาย DNA ของเชื้อขาด; ได้ผลกับ gram positive และ gram negative; ไม่ได้ผลเมื่อมี debris"
                  },
                  {
                    "label": "Benzylpenicillin",
                    "value": "beta-lactam ยับยั้งการสร้าง cell wall"
                  },
                  {
                    "label": "Fluoroquinolones",
                    "value": "enrofloxacin, ciprofloxacin, marbofloxacin; bactericidal ยับยั้ง DNA gyrase จึงหยุดการสร้าง nucleic acid"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เป้าหมายที่ 3 ลดการอักเสบ และการรักษาทางเลือก",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.32-34; บันทึกคาบ 1 ต.ค. 2569 [66:03-68:31]",
        "body": [
          {
            "callout": "เป้าหมายข้อ 3 มีสองชื่อ: promotion of defense mechanism (รายการเป้าหมายรวม) กับ moderate inflammation (หัวข้อของรายการยา) รายการยาด้านล่างอยู่ใต้ชื่อหลัง",
            "kind": "flag"
          },
          {
            "sub": "3.1 Chemical curettage",
            "body": [
              {
                "bullets": [
                  "Dimethyl sulfoxide (DMSO)",
                  "Hydrogen peroxide",
                  "Magnesium sulfate",
                  "Kerosene",
                  "Povidone-iodine solution 0.2 % v/v",
                  "มีเมือกและ debris อยู่ในมดลูกด้วย จึงอาจใช้ DMSO หรือ hydrogen peroxide ล้างสิ่งที่คั่งอยู่ก่อนรักษา"
                ]
              }
            ]
          },
          {
            "sub": "3.2 ถึง 3.4",
            "body": [
              {
                "bullets": [
                  {
                    "label": "3.2 Infusion เข้ามดลูก",
                    "value": "colostrum, plasma หรือ platelet rich plasma (PRP); รายงานว่าใช้ plasma ของตัวเอง เจาะเลือด แยก plasma แล้วฉีดเข้ามดลูก ช่วยให้เคลียร์ได้ดีขึ้น"
                  },
                  {
                    "label": "3.3 Mucolytic drug",
                    "value": "DMSO, N-acetylcysteine (NAC)"
                  },
                  {
                    "label": "3.4 Anti-inflammatory therapies",
                    "value": "endometrial mesenchymal stem cells (MSC), glucocorticoids; glucocorticoids ใช้เมื่ออักเสบมาก"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Alternative treatment",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Biofilm clearance",
                    "value": "Tris-EDTA ร่วมกับ antibiotics"
                  },
                  {
                    "label": "เชื้อรา หรือ yeast",
                    "value": "amphotericin B 100 mg, clotrimazole 500 mg"
                  },
                  {
                    "label": "Combination",
                    "value": "systemic antibiotics ร่วมกับ intrauterine antibiotic infusion และ oxytocin IM"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pyometra",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.12, p.35-37; บันทึกคาบ 1 ต.ค. 2569 [68:31-69:31]",
        "body": [
          {
            "bullets": [
              "หนองคั่งใน uterine lumen ร่วมกับมี active CL",
              "พบ mucopurulent material และ discharge",
              "ตรวจ rectal palpation และ ultrasound เห็น fluid ที่ไม่ใส",
              "ต้องแยกออกจากการตั้งท้อง"
            ]
          },
          {
            "sub": "Treatment",
            "body": [
              {
                "bullets": [
                  "**PGF2α**: เมื่อคลำ CL ได้ ทำให้ luteal phase สั้นลง ม้ากลับเป็นสัด และทางเดินสืบพันธุ์กำจัดเชื้อได้ เพราะมี CL จึงต้องเคลียร์ CL ด้วย PGF2α ก่อน",
                  "Uterine lavage",
                  "Antibiotics ตามความจำเป็น",
                  "Hysterectomy เป็นทางเลือกสุดท้าย โอกาสที่ต้องทำมีน้อย และไม่ใช่วิธีแรกที่คิดถึง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ป้องกันการกลับเป็นซ้ำ และงานวิจัยล่าสุด",
        "source": "Lecture 7: ภาวะเยื่อบุผนังชั้นในมดลูกอักเสบในม้า p.38-40; บันทึกคาบ 1 ต.ค. 2569 [69:31-71:33]",
        "body": [
          {
            "sub": "Goal 4: prevent recurrence",
            "body": [
              {
                "bullets": [
                  "Venereal disease screening",
                  "Hygiene ที่ breeding area",
                  "Breeding soundness examination (ของทั้งแม่ม้าและพ่อม้า)",
                  "ถ้า conformation ผิดปกติ ต้องแก้ไข: ดูตำแหน่งและ conformation ของ vulva, sunken anus และทำ Caslick's vulvoplasty"
                ]
              }
            ]
          },
          {
            "sub": "Frontier research และนวัตกรรม",
            "body": [
              {
                "bullets": [
                  "Diagnosis scheme สำหรับตรวจ subclinical endometritis ให้ได้เร็ว",
                  "เครื่องมือที่ใช้ตรวจ subclinical endometritis ได้จริงในฟาร์ม",
                  "Genetic selection แม่ม้าที่ไวต่อการติดเชื้อน้อยลง หรือคุมการอักเสบรุนแรงหลังคลอดได้",
                  "เครื่องมือ prophylactic และ therapeutic ใหม่สำหรับการอักเสบของ endometrium"
                ]
              }
            ]
          },
          {
            "sub": "คำที่เจ้าของใช้",
            "body": [
              {
                "bullets": [
                  "มดลูกอักเสบ = metritis หรือ endometritis",
                  "รกค้าง = retained placenta",
                  "มดลูกอักเสบเป็นหนอง = pyometra"
                ]
              },
              "คำว่า \"มดลูกอักเสบ\" ในภาษาเจ้าของอาจหมายถึงภาวะใดภาวะหนึ่งข้างต้น ต้องซักถามให้ชัดว่าเป็นภาวะไหน"
            ]
          }
        ]
      }
    ]
  },
  "eqrepro-male": {
    "topic": "eqrepro-male",
    "title": "Male reproductive anatomy, function and clinical examination of the stallion",
    "lecturer": "Theerawat Tharasanit",
    "icon": "🐴",
    "summary": "กายวิภาค การทำหน้าที่ และการตรวจระบบสืบพันธุ์พ่อม้า: penis แบบ vascular type กับ urethral process ที่เป็นจุด swab ของ CEM, prepuce, scrotum ในฐานะ thermoregulator, testicular descent กับเกณฑ์ cryptorchidism, spermatogenesis 57 วัน, epididymis, accessory sex glands กับ gel fraction และ ampullary obstruction ปิดด้วยพฤติกรรมของพ่อม้าและการผสมตามธรรมชาติ",
    "sections": [
      {
        "heading": "Breeding soundness examination ของพ่อม้า",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.2-3; บันทึกคาบ 8 ต.ค. 2569 [14:32-18:02]",
        "body": [
          {
            "sub": "The 4 elements",
            "body": [
              {
                "bullets": [
                  "**General physical examination**: general health, musculoskeletal and nervous system และ behaviors",
                  "**Examination of external reproductive organs**",
                  "**Examination of internal reproductive organs**",
                  "**Semen collection and evaluation**"
                ]
              }
            ]
          },
          "Breeding soundness examination ไม่ได้ตรวจเฉพาะระบบสืบพันธุ์ แต่รวมทุกอย่างที่ทำให้ม้าสืบพันธุ์ได้ เช่น โรคติดเชื้อ การทำวัคซีน อาการปวดกล้ามเนื้อ และความผิดปกติของกระดูก เพราะพ่อพันธุ์ต้องสมบูรณ์ทั้งร่างกายและระบบสืบพันธุ์",
          {
            "sub": "Male reproductive organs",
            "body": [
              {
                "bullets": [
                  {
                    "label": "External genital organs",
                    "value": "prepuce, penis, scrotal sac"
                  },
                  {
                    "label": "Internal genital organs",
                    "value": "testis and associated structures, accessory sex glands"
                  }
                ]
              },
              {
                "callout": "p.3 จัด testis and associated structures ไว้ใต้ Internal genital organs แต่บันทึกคาบ 8 ต.ค. 2569 [16:34-17:03, 18:02] นับอวัยวะภายในของเพศผู้เฉพาะ accessory sex glands ส่วน testis, scrotum, penis และ prepuce นับเป็นอวัยวะที่อยู่ภายนอกทั้งหมด",
                "kind": "flag"
              },
              {
                "bullets": [
                  "แม่ม้าตรวจด้วย palpation และ ultrasound มาก แต่พ่อม้าโดยทั่วไปไม่ตรวจอวัยวะภายใน เพราะปัญหาของ accessory sex glands พบน้อย จึงตรวจ external genitalia เป็นหลัก",
                  "สิ่งที่สำคัญที่สุดคือ function ของอวัยวะ: testis ต้องสร้าง hormone และ **functional gamete** คือ sperm ที่ไป fertilize ไข่ได้ จึงต้องตรวจคุณภาพ sperm",
                  "กายวิภาคและการทำหน้าที่ของเพศผู้คล้ายสัตว์ชนิดอื่น สิ่งที่ต้องรู้คือจุดที่ม้าต่างจากสัตว์อื่นและจุดที่มีความหมายทางคลินิก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Penis: vascular type, urethral process และ fossa glandis",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.3-4, p.7; บันทึกคาบ 8 ต.ค. 2569 [18:02-24:30]",
        "body": [
          "Penis แบ่งเป็น **glans, shaft (body) และ root (bulb)**",
          {
            "bullets": [
              "รูปบน: glans penis, urethral process, free body of penis, preputial ring, inner lamina of prepuce, scrotum containing testes; รูปล่าง: bulbospongiosus and bulb of penis, ischiocavernosus and crus of penis, retractor penis, preputial fold (external layer, internal layer), preputial ring, preputial orifice",
              "รูปบน: tunica albuginea, septum of penis, trabeculae, glans, fossa glandis, corona glandis, collum glandis, urethral process and external urethral orifice; เส้นสีแดง: outline of corpus cavernosum penis; เส้นสีน้ำเงิน: outline of corpus spongiosum glandis and dorsal process of glans; รูปล่าง: corpus cavernosum, corpus spongiosum, urethra, urethral sinus, urethral process within fossa glandis, preputial fold, preputial ring, prepuce"
            ]
          },
          {
            "sub": "Penis ของสัตว์เพศผู้มี 2 แบบ",
            "body": [
              {
                "bullets": [
                  "**Vascular type** (ม้า, สุนัข, แมว): มี erectile tissue มาก (corpus spongiosum, corpus cavernosum) เมื่อมี libido เลือดไหลเข้าและคั่ง (engorgement) penis จึงขยายใหญ่",
                  "**Fibroelastic type** (สุกร, โค): ไม่ค่อยเพิ่มขนาดเมื่อ erection เพราะมี sheath แบบ fibroelastic หุ้มอยู่"
                ]
              }
            ]
          },
          {
            "sub": "ข้อเสียของ vascular type: injury",
            "body": [
              {
                "bullets": [
                  "ถ้าเกิด injury โดยเฉพาะขณะ penis กำลัง engorge เช่น พ่อม้าขึ้นทับหรือกำลังรีดน้ำเชื้อแล้วถูกแม่ม้าเตะ หลอดเลือดฉีกขาด เกิด **hematoma**",
                  "penis ที่เป็น hematoma หดกลับเข้า prepuce ไม่ได้ ถูกรัด เกิด edema และนานเข้าเป็น **necrosis**",
                  "ถ้า reduce กลับไม่ได้ต้อง **amputation** ซึ่งเท่ากับจบความเป็นพ่อพันธุ์ของม้าตัวนั้น",
                  "ช่วงอันตรายที่สุดคือตอนพ่อม้ากำลังขึ้นผสม แม่ม้าจึงต้องเป็นสัดเต็มที่ก่อน"
                ]
              }
            ]
          },
          {
            "sub": "Urethral process และ fossa glandis",
            "body": [
              {
                "bullets": [
                  "ในสัตว์ทั่วไป urethral opening อยู่เป็นเนื้อเดียวกับแกน penis แต่ในม้าท่อ urethra ยื่นแยกออกมาทางด้านหน้าของ glans penis เรียกว่า **urethral process** (แพะและแกะก็มี)",
                  "รอบ urethral process เป็นร่องเรียกว่า **fossa glandis**",
                  "ร่องนี้เป็นจุดสำคัญในการวินิจฉัย **CEM (contagious equine metritis)**: ในเพศผู้เชื้อชอบอยู่ในหลืบแบบนี้ และพ่อม้าไม่แสดงอาการ ตรวจจาก clinical examination ทั่วไปไม่พบ",
                  "ต้อง **swab ให้ตรงจุด** ถ้า swab ผิดที่ผลจะเป็น negative ไปเลย ในเพศเมียจุดที่ต้อง swab คือ clitoral fossa หรือ discharge"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical examination ของ penis และ prepuce",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.5; บันทึกคาบ 8 ต.ค. 2569 [24:30-30:02]",
        "body": [
          {
            "bullets": [
              "Disease of prepuce and penis is **rare**",
              "skin ของ prepuce ควร **thin and pliable** ไม่มี inflammatory หรือ proliferative lesion",
              "Relaxation of penile urethra during sedation: **phenothiazine drug can cause penile paralysis or priapism**"
            ]
          },
          {
            "sub": "เมื่อไรจึงเห็น penis",
            "body": [
              {
                "bullets": [
                  "ภาวะปกติ penis อยู่ใน prepuce เสมอ ออกมาให้ตรวจได้เพียง 2 กรณี คือ 1. กำลังจะปัสสาวะ 2. erection",
                  "ม้าไม่ปัสสาวะใน prepuce ต้องยื่น penis ออกมาก่อน ต่างจากสุนัขและแมวที่ปัสสาวะใน prepuce ซึ่งปัสสาวะค้างแล้วมักอักเสบ จึงเห็น preputial discharge สีเหลืองในสุนัขบางตัว",
                  "ถ้าไม่ใช่ 2 กรณีนี้แล้วเห็นแกน penis ห้อยออกมา ให้ถือว่าผิดปกติทันที"
                ]
              }
            ]
          },
          {
            "sub": "การใช้ยาซึมเพื่อตรวจ",
            "body": [
              {
                "bullets": [
                  "ทางที่ 3 คือให้ยาซึมที่มีฤทธิ์ muscle relaxation penis จะยื่นออกมาเอง",
                  "อาการที่บอกว่ายาซึมออกฤทธิ์ในม้า: หัวตก ปากห้อย penis ยื่นออกจาก prepuce (ในเพศผู้) และเริ่ม incoordinate",
                  "ยากลุ่ม **phenothiazine** เช่น acepromazine ซึ่งใช้บ่อยมาก ทำให้ระบบประสาทส่วนปลายบาดเจ็บจนเกิด paralysis ของ penis ได้ พบน้อยมาก ราว 1 ใน 1,000 ถึง 1 ใน 10,000 แต่ถ้าเกิดคือเสียความเป็นพ่อพันธุ์",
                  "ถ้ามียาให้เลือก เช่น xylazine กับ acepromazine และต้องการผลแค่ให้ตรวจได้ ให้เลือก **xylazine** ถ้าไม่มีตัวเลือกต้องแจ้งเจ้าของก่อนว่าจะให้ยาอะไรและเสี่ยงเรื่องนี้ ระวังเป็นพิเศษในพ่อพันธุ์มูลค่าสูง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Diseases of penis and prepuce และการ swab",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.6-7; บันทึกคาบ 8 ต.ค. 2569 [30:02-31:30]",
        "body": [
          {
            "sub": "โรคของ penis และ prepuce",
            "body": [
              {
                "bullets": [
                  "Inflammation",
                  "Hematoma",
                  "Lesion of **herpes virus (type 3): equine coital exanthema**",
                  "Habronema granulomas, squamous cell carcinomas และ papillomas"
                ]
              },
              "โรคของ penis และ prepuce พบน้อยมาก ตัวอย่าง: penis ที่ถูกเตะจนบวมซึ่งตัวนี้ reduce กลับได้ รอยโรคเป็นจุดสีขาวของ equine coital exanthema จาก herpesvirus type 3 และ tumor"
            ]
          },
          {
            "sub": "การล้างและเชื้อก่อโรค",
            "body": [
              {
                "bullets": [
                  "Cellular debris and washing: ใช้ **weak detergents** เพื่อ maintain normal flora",
                  "Pathogenic bacteria: **Taylorella equigenitalis** (contagious equine metritis) และ Klebsiella spp., Streptococcus zooepidemicus, Pseudomonas spp. (post-breeding endometritis)",
                  "ตำแหน่งที่ swab: fossa glandis, surface of penis และ folds of prepuce"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Scrotum (scrotal sac)",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.8; บันทึกคาบ 8 ต.ค. 2569 [31:02-36:31]",
        "body": [
          "Slightly pendulous, globular and generally symmetric",
          {
            "table": {
              "headers": [
                "4 layers",
                "ลักษณะ"
              ],
              "rows": [
                [
                  "Skin",
                  "numerous sebaceous and sweat glands"
                ],
                [
                  "Tunica dartos",
                  "muscular and fibroelastic tissue"
                ],
                [
                  "Scrotal fascia",
                  "loose connective tissue between tunica dartos and parietal tunic"
                ],
                [
                  "Parietal tunic",
                  "evagination of the peritoneum"
                ]
              ]
            }
          },
          {
            "sub": "หน้าที่ของ scrotum",
            "body": [
              {
                "bullets": [
                  "1. **Protection**: สิ่งที่มากระทบโดน scrotum ก่อนถึง testis",
                  "2. **Thermoregulator**: กั้น testis จากอุณหภูมิภายนอก และมีกล้ามเนื้อเรียบที่หดตัวเมื่ออากาศหนาว ดึง testis เข้าใกล้ลำตัวให้อุ่นขึ้น เมื่อร้อนเกินจะคลายตัวให้ testis ห้อยออกห่างตัว",
                  "testis สร้าง hormone ได้ทุกอุณหภูมิ แม้อยู่ในช่องท้อง แต่การสร้าง sperm ต้องการอุณหภูมิ **ต่ำกว่าอุณหภูมิร่างกายประมาณ 3-5 องศา**",
                  "ถ้า scrotum ผิดปกติจนควบคุมอุณหภูมิไม่ได้ การสร้าง hormone ไม่เปลี่ยน แต่การสร้าง sperm เสียแน่นอน"
                ]
              }
            ]
          },
          {
            "sub": "การตรวจ",
            "body": [
              {
                "bullets": [
                  "scrotum ต้องไม่ยึดติดกับ testis: จับ scrotum แล้วบีบเบาๆ testis ต้อง **movable** เลื่อนขึ้นลงได้",
                  "ถ้า testis ยึดติดกับ scrotum การควบคุมอุณหภูมิเสีย sperm อาจสร้างไม่ได้หรือสร้างได้ไม่ดี",
                  "ม้าต่างจากสุนัขและแมว เอามือเข้าไปจับ testis เฉยๆ ม้าเตะแน่นอนและเตะแรง ต้องระวังทุกครั้งที่ตรวจ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Testis, testicular descent และ cryptorchidism",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.9, p.15; บันทึกคาบ 8 ต.ค. 2569 [36:31-44:36]",
        "body": [
          {
            "sub": "The testis and surrounding structure",
            "body": [
              {
                "bullets": [
                  "Function of testes: **sperm and hormone production**",
                  "**Testicular descent**: last 30 days of gestation ถึง first 10 days post-partum",
                  "The mechanism is unknown: combination ของ dilation of vaginal ring and inguinal canal, traction of gubernaculum และ abdominal pressure",
                  "Position of testis: caudal epididymis"
                ]
              }
            ]
          },
          {
            "sub": "Gubernaculum ดึง testis ลงถุงอย่างไร",
            "body": [
              {
                "bullets": [
                  "ในสัตว์ทุกชนิด testis ถูกสร้างในช่องท้อง มี origin เดียวกับ ovary แต่อยู่ในช่องท้องไม่ได้ เพราะการสร้าง sperm ต้องการอุณหภูมิต่ำกว่าร่างกาย จึงต้องเคลื่อนผ่าน inguinal canal ลงมาในถุง scrotum",
                  "โครงสร้างที่ยึดระหว่าง testis กับ scrotum และดึง testis ลงมาคือ **gubernaculum**",
                  "gubernaculum ที่เจริญขึ้นจะอ้วนออกด้านข้าง ความยาวจึงหดสั้นลง เหมือนยางยืดที่ถูกดึงตรงกลางออก 2 ข้าง testis จึงถูกดึงลง",
                  "testis ที่ไม่ลงถุงแปลว่า gubernaculum ผิดปกติ testis จะค้างอยู่จุดใดจุดหนึ่งบนทางเดิน คือในช่องท้อง (intra-abdominal) หรือนอกช่องท้อง (extra-abdominal) ที่ inguinal canal หรือระหว่าง inguinal canal กับ scrotum"
                ]
              }
            ]
          },
          {
            "sub": "เวลาปกติและเกณฑ์ cryptorchidism",
            "body": [
              {
                "bullets": [
                  "ในม้า testis ลงถุงตั้งแต่ก่อนเกิด จำง่ายๆ ว่า **ภายใน 1-2 สัปดาห์หลังคลอด** testis ต้องอยู่ในถุง scrotum แล้ว",
                  "Cryptorchid หมายถึง ณ เวลาที่คลำ มี testis ในถุงหรือไม่ ส่วน testis ที่ลงมาช้ากว่าเวลาที่ควรเรียกว่า **delayed testicular descent** ซึ่งเกิดได้ในสัตว์ทุกชนิดรวมทั้งม้า",
                  "จะตัดสินว่าเป็น cryptorchidism แน่นอนและ testis จะไม่ลงมาอีก ใช้เวลาประมาณ **1 ปี** สุนัขและแมวก็ใช้ราว 1 ปีเช่นกัน"
                ]
              },
              {
                "bullets": [
                  "อายุ 1 สัปดาห์ คลำได้ testis 2 ข้างในถุง: ปกติ",
                  "อายุ 1 สัปดาห์ คลำได้ testis ข้างเดียว: ยังปกติ เพราะยังอยู่ในช่วงเวลาที่ testis ลงได้",
                  "อายุ 2 เดือน testis 2 ข้างในถุง: ปกติ",
                  "อายุ 2 เดือน ข้างซ้ายอยู่ในถุง, ข้างขวาคลำไม่เจอ: ถือว่ามีภาวะ cryptorchid ณ วันที่ตรวจ",
                  "ม้าตัวเดิมที่ 7 เดือน ลงมาครบ 2 ข้าง: ปกติ เป็น delayed testicular descent"
                ]
              }
            ]
          },
          {
            "sub": "Abnormalities of testis and scrotum",
            "body": [
              {
                "bullets": [
                  "**Monorchidism and agenesis**: ตรวจด้วย hormonal challenge (hCG)",
                  "**Cryptorchidism**: left cryptorchid พบ abdominal มากกว่า inguinal; right cryptorchid พบ inguinal มากกว่า abdominal; abdominal cryptorchid ทั้ง 2 ข้างพบน้อย (14%)",
                  "Testicular torsion",
                  "Hydrocele",
                  "Varicocele",
                  "Testicular tumor"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Spermatogenesis และการควบคุม",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.10-12; บันทึกคาบ 8 ต.ค. 2569 [44:36-52:31]",
        "body": [
          {
            "sub": "Puberty, phases ของ spermatogenesis และโครงสร้าง seminiferous epithelium",
            "body": [
              {
                "bullets": [
                  "Puberty: GnRH, competence of male characteristics and sperm production",
                  "Phase of spermatogenesis (spermatogenic cycle): **spermatocytogenesis, meiosis, spermiogenesis**",
                  "primordial germ cell, spermatogonium (diploid) ผ่าน mitotic division เป็น primary spermatocyte (diploid, in prophase of meiosis I), first meiotic division ได้ secondary spermatocyte (haploid), second meiotic division ได้ spermatids (haploid)",
                  "**basal compartment** มี spermatogonium ส่วน **adluminal compartment** มี primary spermatocyte และ spermatids คั่นด้วย junctional complex ของ Sertoli cell; Leydig cell และ blood vessel อยู่นอก lamina propria",
                  "โครงสร้างของ testis: convoluted seminiferous tubule, straight tubule, rete tubule, efferent duct, head of epididymis, epididymal duct, body of epididymis, deferent duct, tunica albuginea, pampiniform plexus, testicular artery, testicular veins"
                ]
              }
            ]
          },
          {
            "sub": "Testicular reserve และ blood-testis barrier",
            "body": [
              {
                "bullets": [
                  "เซลล์ใน seminiferous tubule สร้างได้ mature sperm ที่มีหัวมีหาง เป็น mature ทางกายวิภาค (anatomically mature sperm) แต่ยังไม่ใช่ functional sperm",
                  "เซลล์ตั้งต้นคือ **spermatogonium** (spermatogonial stem cells) ทำได้ 2 ทาง คือแบ่งตัวสร้างสำเนาของตัวเอง และ differentiate ไปเป็น sperm จึงเป็น **testicular reserve**",
                  "ตราบที่เซลล์นี้ยังมีชีวิตและแบ่งตัวได้ testis สร้าง sperm ได้เรื่อยๆ ต่างจากเพศเมียที่แบ่งตัวเสร็จตั้งแต่ก่อนคลอดและไม่สร้างเพิ่มอีก",
                  "**Sertoli cells** ขนาบอยู่ 2 ข้าง ทำหน้าที่ป้องกัน testicular reserve เรียกว่า **blood-testis barrier**",
                  "เมื่อได้รับสาร toxic เซลล์ที่อยู่นอกแนวป้องกันตายก่อน ถ้า spermatogonium ยังมีชีวิต testis กลับมาสร้าง sperm ใหม่ได้"
                ]
              }
            ]
          },
          {
            "sub": "ระยะเวลาและ daily sperm output",
            "body": [
              {
                "bullets": [
                  "จาก spermatogonium ถึง mature sperm ใช้เวลาประมาณ 2 เดือนในเกือบทุก species ในม้าคือ **57 วัน**",
                  "ใช้กำหนดเวลา re-evaluation: ม้าที่ได้รับสาร toxic ต้องรอ 2 เดือนให้ sperm turn over ก่อนตรวจซ้ำ",
                  "แต่ละจุดของ tubule เริ่มสร้างไม่พร้อมกัน แต่ใช้เวลาสร้างเท่ากัน จึงมี sperm ออกมาทุกวัน เรียกว่า **daily sperm output**",
                  "ม้าที่ daily sperm output มากกว่ามี efficiency ในการสร้างสูงกว่า ตรวจได้ด้วยการรีดน้ำเชื้อ ซึ่งเป็นการประเมิน function ของ testis"
                ]
              }
            ]
          },
          {
            "sub": "Control of spermatogenesis",
            "body": [
              {
                "bullets": [
                  "**Hypothalamus-pituitary-testis axis**",
                  "Local control: autocrine and paracrine",
                  "สิ่งเร้า auditory, visual และ olfactory (VNO) กับ pineal gland ส่งเข้า hypothalamus; GnRH ไปที่ anterior pituitary แล้ว LH, PRL และ FSH ไปที่ testis (Leydig cells, Sertoli cells); T,E ย้อนกลับไปยับยั้ง (−) hypothalamus และ pituitary, T กระตุ้น (+) accessory sex glands; ลูกศร I (−) กับ A (+) จาก testis กลับไปที่ anterior pituitary"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical examination ของ scrotum และ testis",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.13-14",
        "body": [
          {
            "sub": "วิธีตรวจ",
            "body": [
              {
                "bullets": [
                  "**Palpation**: size and position ปกติคือ equal size, lying horizontally โดย tail of epididymis directed caudally",
                  "Ultrasound",
                  "Biopsy (histology)",
                  "Semen collection"
                ]
              }
            ]
          },
          {
            "sub": "Sperm production: efficacy determination",
            "body": [
              {
                "bullets": [
                  "**Daily sperm production (DSP)**: sperm production per weight of the parenchyma วัดยากในสัตว์ที่ยังมีชีวิต",
                  "Scrotal circumference (วัดในพ่อม้ายากกว่าพ่อโค) correlated กับ **daily sperm output** (predicted DSO)",
                  "ในพ่อม้ามักใช้ **total scrotal width (TSW)**",
                  "DSO: continuously semen collection"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Epididymis และ vas deferens",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.16; บันทึกคาบ 8 ต.ค. 2569 [52:31-56:32]",
        "body": [
          {
            "bullets": [
              "3 parts: **head, body และ tail**",
              "Function: **sperm maturation** (head and body) และ **sperm reservoir** (tail)",
              "Only sperm from caudal (tail) epididymis are **motile and fertilizable**",
              "Epididymal sperm จาก caudal epididymis ใช้ทำ AI ได้"
            ]
          },
          {
            "sub": "Epididymal transit",
            "body": [
              {
                "bullets": [
                  "เวลาที่ sperm ทั้งหมด turn over หลังเกิดปัญหา เช่น toxic จึงเท่ากับ 57 วันใน testis บวก 1-2 สัปดาห์ใน epididymis",
                  "sperm ใน ejaculate มากกว่า 90% มาจาก tail ของ epididymis และ vas deferens"
                ]
              }
            ]
          },
          {
            "sub": "รีดทิ้ง ejaculate แรก",
            "body": [
              {
                "bullets": [
                  "sperm ที่ถูกเก็บใน tail นานจะตายหรืออ่อนแรง ejaculate แรกของม้าที่ไม่ได้หลั่งมานานจึงเป็น sperm เก่า คุณภาพมักผิดปกติ ผลตรวจไม่ accurate และถ้านำไปแช่แข็งหรือผสมเทียม โอกาสตั้งท้องลดลง",
                  "จึง **รีดทิ้ง ejaculate แรกเสมอ** ก่อนประเมินหรือนำไปใช้จริง เช่น จะรีดไปทำน้ำเชื้อแช่แข็งพรุ่งนี้ในม้าที่ไม่เคยรีด ต้องรีดทิ้งมาแล้วรอบหนึ่งตั้งแต่สัปดาห์ก่อนหรือต้นสัปดาห์ เพื่อให้ได้ fresh ejaculate"
                ]
              }
            ]
          },
          {
            "sub": "Epididymal sperm จากม้าที่ตาย",
            "body": [
              {
                "bullets": [
                  "ม้าที่ตาย เก็บ sperm จาก cauda epididymis ไปผสมเทียมได้ เพราะเป็นส่วนเดียวที่ได้ functional sperm",
                  "sperm จากส่วน head ใช้ได้เฉพาะกับ ICSI คือฉีด sperm เข้าไข่ เพราะยังไม่ motile"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Accessory sex glands, gel fraction และ ampullary obstruction",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.17-18; บันทึกคาบ 8 ต.ค. 2569 [56:32-64:01]",
        "body": [
          {
            "bullets": [
              {
                "label": "Accessory sex glands",
                "value": "ampulla, bulbourethral glands, prostate gland, seminal vesicles"
              },
              "**Seminal vesicles produce gel fraction**",
              "ม้ามี accessory sex glands ครบทุกชนิด ต่างจากบาง species ที่ขาดบางต่อม",
              {
                "label": "ป้ายบนรูป dorsal view",
                "value": "ampulla of deferent duct, seminal vesicle, prostate (right lobe, left lobe), bulbourethral gland and bulboglandularis"
              }
            ]
          },
          {
            "sub": "Gel fraction",
            "body": [
              {
                "bullets": [
                  "gel fraction จาก seminal vesicle มีลักษณะหนืดคล้ายน้ำราดหน้าที่ใส่แป้ง ไม่เหนียวเป็นเม็ดสาคูแบบของสุกร",
                  "ในธรรมชาติทำหน้าที่ trap sperm ที่ผิดปกติหรือว่ายไม่ดี เช่น หางบิดหางเบี้ยว",
                  "น้ำเชื้อที่จะนำไป process ต้อง **กรอง gel fraction ทิ้งเสมอ** หลัง ejaculate โดยผ่านถุงกรอง ส่วนที่ผ่านออกมาเรียกว่า **gel-free fraction**",
                  "การวัดปริมาตร การตรวจคุณภาพ และการ process น้ำเชื้อทุกอย่าง ทำกับ gel-free fraction เสมอ"
                ]
              }
            ]
          },
          {
            "sub": "Ampulla และ ampullary obstruction",
            "body": [
              {
                "bullets": [
                  "Ampulla คือส่วนกระเปาะขยายของ vas deferens ก่อนเข้าสู่ pelvic urethra",
                  "เกิด **obstruction ที่ ampulla** ได้ในม้าที่ไม่ได้ ejaculate มานาน",
                  "ภาพน้ำเชื้อ: **ปริมาตรมักปกติ** เพราะ seminal plasma มาจาก accessory sex glands ที่อยู่ถัดจาก ampulla ไปทางท้าย แต่ **จำนวน sperm น้อยกว่าปกติหรือไม่มีเลย** ขึ้นกับว่าอุดตันกี่ข้าง และเป็น incomplete หรือ complete obstruction",
                  "การแก้ไขคือบีบไล่ content ออก (squeezing) โดยให้ **oxytocin** ไม่ใช้ PGE แบบที่ใช้แก้ obstruction ในแม่ม้า",
                  "ให้ oxytocin ก่อนพ่อม้าขึ้นผสมหรือก่อนรีดน้ำเชื้อ เพราะ half-life สั้น ถ้าให้ล่วงหน้านานฤทธิ์จะหมดก่อน ejaculate"
                ]
              }
            ]
          },
          {
            "sub": "Clinical examination of accessory sex glands",
            "body": [
              {
                "bullets": [
                  "**Not commonly examined** ทำเมื่อจำเป็น เช่น recurrent infertility",
                  "Rectal palpation and ultrasonography",
                  "Semen collection (open-ended AV): sperm poor fraction"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Stallion behaviors และการผสมตามธรรมชาติ",
        "source": "Lecture 8 9 Anatomy function and clinical exam stallion p.19-23; บันทึกคาบ 8 ต.ค. 2569 [64:01-70:01]",
        "body": [
          {
            "sub": "Two types of reproductive behaviors",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Territorial breeder",
                    "value": "Grevy's zebra และ donkey"
                  },
                  {
                    "label": "Harem breeder",
                    "value": "share area: domestic horse และ zebra ชนิดอื่น"
                  },
                  {
                    "label": "Sexual stimulation (libido)",
                    "value": "biting, licking, smelling; **flehmen reaction**: pheromone"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Normal stallion behaviors",
            "body": [
              {
                "bullets": [
                  "Immediate interest and interaction with an estrus mare",
                  "Erection within **2 min**",
                  "Mount readiness within **5 to 10 sec** after erection",
                  "Ejaculation on **first mount**",
                  "Total breeding time **2 to 5 min**"
                ]
              }
            ]
          },
          {
            "sub": "Libido ของพ่อม้า",
            "body": [
              {
                "bullets": [
                  "ม้าเป็น harem type ชอบคุมฝูง และมี libido สูงโดยธรรมชาติ",
                  "พ่อม้าที่เจอแม่ม้าแล้วไม่สนใจถือว่าผิดปกติ การแสดงพฤติกรรมทางเพศมากเกินไป (over aggressive) ก็ผิดปกติ",
                  "ความผิดปกติที่พบมักเป็นแบบ over aggressive มากกว่า libido ต่ำ"
                ]
              }
            ]
          },
          {
            "sub": "ภาพวิดีโอการ tease และการผสม",
            "body": [
              {
                "bullets": [
                  "Teasing ข้ามรั้ว: แม่ม้าที่เป็นสัดหันท้ายให้พ่อม้า พ่อม้ากระตุ้นให้แม่ม้ายกหาง ดมช่องคลอด แม่ม้าปัสสาวะปล่อย pheromone พ่อม้าทำ flehmen reaction บางตัวกัดหางให้แม่ม้ายกหางหรือย่อตัว การดมและการกัดเป็นพฤติกรรมปกติของพ่อม้า",
                  "การผสมแบบจูง: พ่อม้า erection แล้ว mounting ขึ้นบนแม่ม้า สอด penis แล้ว thrust ก็จบ แม่ม้าต้อง **standing** ยืนนิ่ง",
                  "แม่ม้าต้องเป็นสัดเต็มที่ teasing score 3-4 ถ้าไม่เป็นสัดเต็มที่จะเตะ penis ของพ่อม้าเสียหาย",
                  "แม่ม้าที่ยังไม่เป็นสัดเต็มที่ ต้องจับบังคับ เช่น ใช้ nose twitch มีรั้วกั้นด้านหน้าไม่ให้หนี และพันหางกันขนไปพัน penis",
                  "ช่วงที่พ่อม้ามีความต้องการทางเพศสูงควบคุมได้ยาก การจับบังคับและการรีดน้ำเชื้อจึงอันตรายต่อทั้งม้าและคน"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "eqrepro-ai": {
    "topic": "eqrepro-ai",
    "title": "Semen collection and artificial insemination in the horse",
    "lecturer": "Theerawat Tharasanit",
    "icon": "💉",
    "summary": "การเก็บน้ำเชื้อและการผสมเทียมในม้า: stallion selection กับโรคที่ติดทางการผสมพันธุ์, การรีดน้ำเชื้อด้วย artificial vagina ที่อุณหภูมิเป็นปัจจัยหลัก, semen evaluation, semen extender กับน้ำเชื้อ 3 ชนิด (สด แช่เย็น แช่แข็ง), insemination dose พร้อมตัวอย่างคำนวณ, การเตรียมแม่ม้าและเวลาผสม, เทคนิค intrauterine insemination และการติดตามหลังผสม",
    "sections": [
      {
        "heading": "ภาพรวมของ AI ในม้า: ขั้นตอน ข้อดีข้อเสีย และ breeding registry",
        "source": "Artificial insemination p.2-4, p.29; บันทึกคาบ 15 ต.ค. 2569 [02:01-08:01]",
        "body": [
          {
            "sub": "7 ขั้นของ artificial insemination",
            "body": [
              {
                "bullets": [
                  "1. Stallion selection",
                  "2. Semen collection",
                  "3. Semen evaluation",
                  "4. Semen preparation: calculation of insemination dose & volume",
                  "5. Mare selection and preparation",
                  "6. Insemination procedure",
                  "7. Post-insemination management"
                ]
              }
            ]
          },
          {
            "table": {
              "headers": [
                "Pros",
                "Cons"
              ],
              "rows": [
                [
                  "Maximize reproductive efficiency of stallion",
                  "Increase cost of AI"
                ],
                [
                  "Semen evaluation prior breeding",
                  "Increase harmful risks if works without cautions"
                ],
                [
                  "Semen extender improves semen quality: longevity, optimise condition, bactericidal/bacteriostatic",
                  "Need expertise"
                ],
                [
                  "Short- and long-term semen storage & transportable: reduce transportation of mares",
                  "**Breeding registry** โดยเฉพาะ racing horse (Thoroughbred)"
                ],
                [
                  "Reduce harmful risks during semen collection",
                  ""
                ]
              ]
            }
          },
          {
            "sub": "AI เทียบกับ ET และข้อจำกัดเรื่องทะเบียนพันธุ์",
            "body": [
              {
                "bullets": [
                  "AI ใช้ **genetic contribution ของฝั่งพ่อ** เป็นหลัก ส่วน ET เน้นทั้งพ่อและแม่ เพราะตัวอ่อนที่ย้ายฝากต้องมีพันธุกรรมเหนือกว่าจากทั้ง 2 ฝั่งจึงคุ้ม",
                  "ในม้าการเลือกผสมไม่ได้ดูแค่ genetic value แต่ขึ้นกับความต้องการของเจ้าของและ performance ของตัวสัตว์ด้วย",
                  "ม้า **Thoroughbred** ที่ใช้แข่งความเร็ว (ม้า hot blood) จะขึ้นทะเบียนเข้าแข่งได้ต้องเกิดจาก **natural breeding เท่านั้น** ทำ AI ไม่ได้ ET ก็ไม่ได้ ไม่รับ biotechnology ใดๆ",
                  "กีฬาประเภทอื่น เช่น กระโดดข้ามเครื่องกีดขวาง dressage และ eventing ใช้ biotechnology ได้ทุกแบบ",
                  "Keynotes: Breeding registry, not all horses can use AI"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Stallion selection และโรคที่ติดต่อทางการผสมพันธุ์",
        "source": "Artificial insemination p.5; บันทึกคาบ 15 ต.ค. 2569 [08:01-13:04]",
        "body": [
          {
            "bullets": [
              "Good/excellent stallion",
              "History and identification",
              "Examination of reproductive system (internal และ external)",
              "Examination of libido and mating behaviours",
              "**Free of venereal diseases** (metritis/abortion)"
            ]
          },
          {
            "table": {
              "headers": [
                "กลุ่ม",
                "เชื้อและโรค"
              ],
              "rows": [
                [
                  "แบคทีเรีย",
                  "Pseudomonas aeruginosa, Klebsiella pneumoniae, **Taylorella equigenitalis**"
                ],
                [
                  "ไวรัส",
                  "Equine herpes virus (coital exanthema), **Equine arteritis virus (equine viral arteritis)**"
                ],
                [
                  "โปรโตซัว",
                  "**Trypanosoma equiperdum (dourine)**"
                ]
              ]
            }
          },
          {
            "sub": "ทำไมพ่อพันธุ์ต้องปลอดโรคกลุ่มนี้",
            "body": [
              {
                "bullets": [
                  "AI กระจายพันธุกรรมได้เร็ว พ่อพันธุ์ที่ติดเชื้อ venereal transmission ก็กระจายเชื้อได้เร็วเช่นกัน พ่อพันธุ์ของสัตว์ทุกชนิดจึงต้องปลอดโรคกลุ่มนี้",
                  "โรคที่ต้องจำมี 3 กลุ่ม: แบคทีเรียคือ **CEM**, ไวรัสคือ **EVA (equine viral arteritis)** และโปรโตซัวคือ **Trypanosoma equiperdum**",
                  "EVA สำคัญที่สุด เพราะไวรัสถูกขับออกมาในน้ำเชื้อโดยตรง และกำจัดไวรัสออกจากน้ำเชื้อไม่ได้",
                  "Trypanosoma equiperdum ไม่มีในประเทศไทย แต่เป็นโรคตามกฎหมายที่กรมปศุสัตว์ให้ตรวจ ม้านำเข้าต้องตรวจ CEM และเริ่มให้ตรวจ EVA เพราะการขนส่งม้าข้ามประเทศมีมากขึ้น",
                  "ในต่างประเทศพ่อม้าที่จะรีดน้ำเชื้อไปใช้ผสมต้องขึ้นทะเบียนพ่อพันธุ์ ซึ่งมีเกณฑ์ตรวจโรคกลุ่มนี้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Semen collection และ artificial vagina",
        "source": "Artificial insemination p.6-7, p.9-10; บันทึกคาบ 15 ต.ค. 2569 [13:04-20:32, 22:30-24:04]",
        "body": [
          {
            "table": {
              "headers": [
                "วิธี",
                "รายละเอียด"
              ],
              "rows": [
                [
                  "Condom",
                  ""
                ],
                [
                  "Manual stimulation",
                  "need expertise but low success"
                ],
                [
                  "Pharmacological stimulation",
                  "unpredictable and low success (25%); xylazine HCl, imipramine HCl, PG"
                ],
                [
                  "**Artificial vagina (AV)**",
                  "most commonly used, high success rate, suitable for breeding programme"
                ]
              ]
            }
          },
          {
            "sub": "Artificial vagina",
            "body": [
              {
                "bullets": [
                  "Various types: Colorado, Hanover, Missouri",
                  "Technique: **temp (45-50 °C) and pressure**, lubrication, clean"
                ]
              }
            ]
          },
          {
            "sub": "อุณหภูมิเป็นปัจจัยหลักของม้า",
            "body": [
              {
                "bullets": [
                  "ส่วนประกอบของ AV ม้าเหมือนของโค ต่างกันที่ขนาด",
                  "โคหลั่งน้ำเชื้อเมื่อได้ pressure ที่ดี ไม่ต้องอาศัยอุณหภูมิ แต่ในม้า **อุณหภูมิคือตัวกระตุ้น ejaculation ที่สำคัญที่สุด** ความดันเป็นปัจจัยรอง pressure ดีแต่อุณหภูมิไม่ถึง ม้าไม่หลั่ง",
                  "อุณหภูมิที่ต้องได้คือประมาณ **45 องศา**",
                  "ควบคุมอุณหภูมิและความดันพร้อมกันด้วยการ **ใส่น้ำ** อุณหภูมิราว 45 องศาเข้าไปใน AV ในปริมาตรที่ให้ความแน่นพอเหมาะ การอัดอากาศหรืออุ่นในตู้ทำไม่ได้ เพราะอุณหภูมิตกเร็ว"
                ]
              }
            ]
          },
          {
            "sub": "การใช้งานและความปลอดภัย",
            "body": [
              {
                "bullets": [
                  "AV ของม้าใหญ่ราวขวดน้ำอัดลมขวดใหญ่ เมื่อใส่น้ำแล้วหนักราว 2 กก.เศษถึง 5 กก. ตามรุ่น และต้องถือด้วยมือข้างเดียว",
                  "lubricant ส่วนใหญ่เป็นพิษต่อ sperm เพราะสารกันเสียที่ผสมอยู่ ถ้าจะใช้ต้องระบุชัดว่าเป็น **non-spermicidal** ในม้าโดยมากไม่ใช้ แต่สวม **disposable liner** อีกชั้น penis จึงสัมผัสเฉพาะ liner และตัว AV ไม่เปื้อน",
                  "ต้องสวม AV ไปตามแนวของ penis ถ้า AV หนักจนถือไม่ไหวแล้วตกลง penis ไม่หักเพราะไม่มี os penis แต่หลอดเลือดใน erectile tissue แตก เกิด hematoma",
                  "เป็นงานอันตราย เพราะคนรีดอยู่ใกล้เท้าของแม่ม้าและพ่อม้า ถ้าแม่ม้าไม่พร้อมอาจเตะ",
                  "การรีดบน phantom และการรีดโดยให้พ่อม้าขึ้นทับแม่ม้า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ejaculation และส่วนประกอบของน้ำเชื้อ",
        "source": "Artificial insemination p.8, p.11-12; บันทึกคาบ 15 ต.ค. 2569 [20:32-22:30]",
        "body": [
          {
            "bullets": [
              "Ejaculation is controlled by **musculonervous system**",
              "Pulses of ejaculation **5-8 pulses**: สังเกตจาก **tail flagging**"
            ]
          },
          {
            "table": {
              "headers": [
                "Ejaculate: 3 fractions",
                "ที่มา"
              ],
              "rows": [
                [
                  "Sperm free fraction",
                  "bulbourethral secretion"
                ],
                [
                  "Sperm rich fraction",
                  ""
                ],
                [
                  "Sperm poor fraction",
                  "seminal vesicle"
                ]
              ]
            }
          },
          {
            "bullets": [
              "ระบบประสาทและกล้ามเนื้อทำงานประสานกันให้เกิด contraction บีบ sperm กับ seminal plasma ออกมา น้ำเชื้อ (semen) คือ sperm บวก seminal plasma",
              "seminal plasma มาจาก accessory sex glands ส่วน **gel fraction มาจาก seminal vesicle**",
              "Semen มี 2 fractions คือ gel และ gel free ส่วน gel เอาออกด้วย gauze ก่อนใช้ทุกครั้ง"
            ]
          }
        ]
      },
      {
        "heading": "Semen evaluation",
        "source": "Artificial insemination p.11, p.13-14; บันทึกคาบ 15 ต.ค. 2569 [24:04-29:34]",
        "body": [
          {
            "table": {
              "headers": [
                "ลักษณะ",
                "ค่าเฉลี่ย (แปรผันตามฤดูกาลและพันธุ์)"
              ],
              "rows": [
                [
                  "ปริมาตรน้ำเชื้อส่วนปราศจากเจล (มล.)",
                  "44"
                ],
                [
                  "ความเข้มข้น (×10^6/มล.)",
                  "170"
                ],
                [
                  "จำนวนอสุจิต่อการหลั่งน้ำเชื้อ (×10^9/มล.)",
                  "6"
                ],
                [
                  "% การเคลื่อนไหว",
                  "60%"
                ],
                [
                  "% อสุจิผิดปกติ (abnormal morphology)",
                  "30%"
                ]
              ]
            }
          },
          {
            "callout": "p.11 พิมพ์หน่วยของจำนวนอสุจิต่อการหลั่งเป็น ×10^9/มล. แต่ปริมาตร 44 มล. × ความเข้มข้น 170 ×10^6/มล. ได้ราว 7.5 ×10^9 ตัวต่อการหลั่งทั้งหมด จึงเป็น ×10^9 ต่อการหลั่ง ไม่ใช่ต่อ มล.",
            "kind": "flag"
          },
          "ค่าในตารางแปรตามพันธุ์และขนาดตัว ม้า pony 200 กก. กับ draft horse 800-900 กก. มี testis ขนาดต่างกัน จึงสร้าง sperm ได้ไม่เท่ากัน สิ่งที่ใช้เทียบกันได้ทุกตัวคือเกณฑ์คุณภาพ และค่าคงที่อย่าง insemination dose",
          {
            "sub": "Basic semen evaluation",
            "body": [
              {
                "bullets": [
                  "70-80% of total sperm: caudal epididymis",
                  "Preferred the second ejaculate มากกว่า 1st ejaculate",
                  "**Gross appearance**",
                  "**Volume (gel-free fraction)**",
                  "pH",
                  "**Motility**",
                  "Viability เช่น aniline blue eosin, eosin-nigrosin"
                ]
              },
              {
                "callout": "p.13 พิมพ์ 70-80% of total sperm อยู่ที่ caudal epididymis แต่บันทึกคาบ 15 ต.ค. 2569 [21:00-21:30] บอกว่า sperm ประมาณ 90% ใน ejaculate มาจาก cauda epididymis (บันทึกคาบ 8 ต.ค. 2569 [54:03-54:34] บอกว่ามากกว่า 90% มาจาก tail ของ epididymis และ vas deferens)",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Advanced semen evaluation",
            "body": [
              {
                "bullets": [
                  "Acrosomal integrity",
                  "DNA fragmentation",
                  "Motility pattern",
                  "Mitochondrial activity",
                  "Flow cytometry"
                ]
              }
            ]
          },
          {
            "sub": "หลักการประเมิน",
            "body": [
              {
                "bullets": [
                  "**Macroscopic** คือดูด้วยตา: สี ปริมาตร pH ส่วน **microscopic** คือดูใต้กล้องจุลทรรศน์: motility, รูปแบบการเคลื่อนที่, acrosome และโครงสร้างละเอียดอื่น",
                  "จะผสมเทียมต้องมีอย่างน้อย 2 ค่า คือ **motility** และ **ความเข้มข้นของ sperm** เพื่อใช้คำนวณ insemination dose",
                  "Motility มี 2 แบบ: **total motility** นับทุกตัวที่เคลื่อนไหว รวมตัวที่ถอยหลังหรือวิ่งวน กับ **progressive motility** ซึ่งสำคัญกว่า",
                  "Concentration มีหน่วยเป็นล้านตัวต่อ mL เสมอ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Handling, semen extender และน้ำเชื้อ 3 ชนิด",
        "source": "Artificial insemination p.15-20; บันทึกคาบ 15 ต.ค. 2569 [36:04-41:32, 46:31-47:02]",
        "body": [
          {
            "sub": "Handling and processing of semen",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Raw semen (sperm with seminal plasma)",
                    "value": "high concentration, short lifespan"
                  },
                  {
                    "label": "Extended semen (semen with semen extender)",
                    "value": "increased sperm lifespan (lower sperm concentration and other advantages of the semen extender); easy to assess the semen quality"
                  },
                  "ลำดับงาน: 1. semen collection 2. semen appearance and removing gel 3. semen evaluation 4. adding semen extender (**at least 1:3**) 5. use immediately or cool down for later use or transport"
                ]
              }
            ]
          },
          {
            "sub": "หน้าที่ของ semen extender",
            "body": [
              {
                "bullets": [
                  "Dilution",
                  "Optimize osmotic pressure: **350-370 mOsm/kg**",
                  "Nutrient supply",
                  "Reduce metabolic waste",
                  "Membrane protection: lipoprotein (milk and egg yolk)",
                  "Bacteriostatic/bactericidal",
                  "Reduce temperature sensitive semen",
                  "Cryoprotectant (in case of freezing)"
                ]
              }
            ]
          },
          {
            "sub": "Types of semen",
            "body": [
              {
                "bullets": [
                  "**Raw/fresh semen** (pregnancy rate 60-70% สำหรับ fresh หรือ extended semen): with or without semen extender, short-time storage",
                  "**Cooled semen** (pregnancy rate 60-70%): 5-8 °C, storage 48-72 h",
                  "**Frozen semen** (pregnancy rate 30-65% สำหรับ frozen-thawed semen): −196 °C, effect of stallion และ highly cold-sensitive sperm vs pregnancy rate"
                ]
              }
            ]
          },
          {
            "sub": "อายุการใช้งานของน้ำเชื้อแต่ละแบบ",
            "body": [
              {
                "bullets": [
                  "**Raw semen** ต้องใช้ให้หมดภายใน **1 ชั่วโมง** เพราะ sperm ม้าตายเร็วมาก",
                  "ใส่ **semen extender** แล้วเก็บที่อุณหภูมิห้อง ยืดได้ถึงประมาณ **6 ชั่วโมง**",
                  "นานกว่านั้นต้อง **แช่เย็น** คือลดอุณหภูมิจาก room temp ลงมาที่ประมาณ 4 องศา ด้วยเหตุผล 2 ข้อ คือลด activity ของ sperm (activity มาก sperm ตายเร็ว) และลดการเจริญของเชื้อปนเปื้อน ใช้ได้ดีภายใน 2 วัน (48 ชั่วโมง)",
                  "สุกรเป็นชนิดเดียวที่น้ำเชื้อแช่เย็นยังลงไปถึง 4 องศาไม่ได้ เก็บที่ประมาณ 18 องศา",
                  "นานกว่า 2 วันต้องแช่แข็งใน liquid nitrogen ที่ −196 °C"
                ]
              },
              {
                "callout": "สไลด์ p.18 และ p.20 พิมพ์ cooled semen ที่ 5-8 °C เก็บได้ 48-72 h (transport and use within 2-3 days) แต่ในบันทึกคาบ 15 ต.ค. 2569 [40:00-41:32] ให้ตัวเลขประมาณ 4 องศา และใช้ได้ภายใน 2 วันหรือ 48 ชั่วโมงเป็นอย่างมาก",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Chilled semen",
            "body": [
              {
                "bullets": [
                  "Not for all stallions: มี good cooler (>50% motility) และ bad cooler",
                  "Extended semen with proper semen extender",
                  "Centrifugation of semen to remove excess seminal plasma",
                  "Slowly cooling down the semen",
                  "Maintain the semen at **5-8 °C**",
                  "Transport and use within **2-3 days**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Frozen semen",
        "source": "Artificial insemination p.21-22; บันทึกคาบ 15 ต.ค. 2569 [41:32-47:02]",
        "body": [
          {
            "bullets": [
              "Freezing ability: **very poor compared with other species**",
              {
                "label": "Semen donor",
                "value": "good freezer 35% of stallions, moderate freezer 25%, poor freezer 40%"
              }
            ]
          },
          {
            "callout": "p.21 พิมพ์ good freezer 35% ของพ่อม้า แต่บันทึกคาบ 15 ต.ค. 2569 [43:01] บอกว่ามีไม่เกินประมาณ 30% ของ population",
            "kind": "flag"
          },
          {
            "sub": "Process of semen freezing",
            "body": [
              {
                "bullets": [
                  "1. Extended semen",
                  "2. Centrifuge and sperm wash to remove seminal plasma",
                  "3. Calculation of sperm concentration (50-100 ×10^6/ml) and freezing extender (with CPA) to be added",
                  "4. Adding, with or without equilibration",
                  "5. Semen loading into straws",
                  "6. Freezing in liquid nitrogen"
                ]
              }
            ]
          },
          {
            "sub": "Individual variation ต่อความเย็น",
            "body": [
              {
                "bullets": [
                  "พ่อม้าแต่ละตัวตอบสนองต่อความเย็นไม่เท่ากัน แบ่งเป็น poor freezer, moderate freezer และ good freezer ตามคุณภาพน้ำเชื้อหลังแช่แข็งและทำละลาย",
                  "น้ำเชื้อสดของ 3 กลุ่มอาจคุณภาพเท่ากัน ความต่างปรากฏหลังแช่แข็ง และไม่เกี่ยวกับ performance หรือราคาของพ่อม้า",
                  "poor freezer ขายได้เฉพาะน้ำเชื้อสดและน้ำเชื้อแช่เย็น good freezer ขายได้ทั้งสด แช่เย็น และแช่แข็ง ส่วน moderate freezer ทำน้ำเชื้อแช่แข็งพอได้แต่โอกาสได้ลูกต่ำกว่า good freezer",
                  "พ่อม้าที่ทั้ง performance ดีและเป็น good freezer หายาก น้ำเชื้อแช่แข็งจึงแพงมาก และในม้าการใช้น้ำเชื้อแช่แข็งจึงไม่ practical เท่าในโค",
                  "น้ำเชื้อสดกับแช่เย็นให้อัตราตั้งท้องใกล้กันราว 60-70% น้ำเชื้อแช่แข็งต่ำกว่า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Insemination dose, volume และตัวอย่างคำนวณ",
        "source": "Artificial insemination p.23-24; บันทึกคาบ 15 ต.ค. 2569 [28:31-36:04]",
        "body": [
          {
            "bullets": [
              {
                "label": "Insemination dose",
                "value": "progressively motile sperm = **250-500 million**; less than 100 million ทำให้ pregnancy rate ลดลง"
              },
              {
                "label": "Insemination volume",
                "value": "**10-25 ml** (for fresh/chilled semen)"
              },
              {
                "label": "Low dose insemination",
                "value": "ใช้ sperm น้อยลง 10-100 เท่า ทำโดย deep intra-uterine insemination หรือ UTJ insemination (endoscopic-guided AI)"
              }
            ]
          },
          {
            "callout": "สไลด์ p.23 พิมพ์ insemination dose เป็น 250-500 million progressively motile sperm แต่ในบันทึกคาบ 15 ต.ค. 2569 [30:02-31:32] ให้ค่า 500 ถึง 1,000 ล้าน progressively motile sperm ต่อการผสม 1 ครั้ง ตัวอย่างคำนวณในคาบใช้ 500 ล้าน ซึ่งเป็นค่าที่อยู่ในทั้ง 2 ช่วง",
            "kind": "flag"
          },
          {
            "sub": "ตัวอย่างคำนวณ",
            "body": [
              "ม้าตัวหนึ่งรีดน้ำเชื้อได้ 200 mL กรอง gel ออกแล้วเหลือ 100 mL total motility 80% progressive motility 50% ความเข้มข้น 100 ล้านตัวต่อ mL ถาม 1. ต้องใช้น้ำเชื้อกี่ mL ต่อการผสม 1 ครั้ง 2. น้ำเชื้อทั้งหมดผสมแม่ม้าได้กี่ตัว",
              {
                "bullets": [
                  "ใช้ปริมาตร **หลังกรอง** คือ 100 mL",
                  "ใช้ **progressive motility** (50%) ไม่ใช้ total motility (80%)",
                  "1 mL มี sperm 100 ล้านตัว เป็นตัวที่วิ่งไปข้างหน้า 50% = 50 ล้านตัว",
                  "ต้องการ 500 ล้านตัวต่อการผสม 1 ครั้ง: 500 ÷ 50 = **10 mL ต่อแม่ม้า 1 ตัว**",
                  "น้ำเชื้อ 100 mL ÷ 10 mL = ผสมได้ **10 ตัว**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mare preparation, เวลาผสม และเทคนิค intrauterine insemination",
        "source": "Artificial insemination p.25-27, p.29; บันทึกคาบ 15 ต.ค. 2569 [47:02-57:01]",
        "body": [
          {
            "sub": "Mare selection and preparation",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Determination of ovulation time",
                    "value": "rectal palpation, behavior changes, ultrasound"
                  },
                  {
                    "label": "Induction of ovulation",
                    "value": "**hCG หรือ GnRH agonist**; use if necessary (expensive); handy when frozen semen is used"
                  },
                  "ผลิตภัณฑ์ GnRH agonist แบบ implant พร้อมรูปการฝัง (Implant) และการเอาออก (remove) ที่ vulva",
                  "hCG ออกฤทธิ์คล้าย LH ฉีดแล้วเหนี่ยวนำการตกไข่ ส่วน GnRH agonist ใช้ผลช่วงแรกที่กระตุ้นให้ LH สูงขึ้น ก่อนจะเกิด downregulation ภายหลัง"
                ]
              }
            ]
          },
          {
            "sub": "อายุของ sperm และไข่กำหนดเวลาผสม",
            "body": [
              {
                "table": {
                  "headers": [
                    "เซลล์",
                    "อยู่รอ fertilization ได้"
                  ],
                  "rows": [
                    [
                      "sperm จากน้ำเชื้อสดหรือแช่เย็น ใน reproductive tract ของแม่ม้า",
                      "**2 วัน**"
                    ],
                    [
                      "sperm จากน้ำเชื้อแช่แข็ง",
                      "ไม่ถึง **6 ชั่วโมง**"
                    ],
                    [
                      "ไข่ที่ตกแล้ว",
                      "12 ชั่วโมง โดย golden time คือภายใน **6 ชั่วโมงหลัง ovulation**"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "น้ำเชื้อสดหรือแช่เย็น: window ของ sperm กว้างกว่าของไข่ จึง **ผสมก่อนไข่ตก** ให้ sperm ไปรอ",
                  "น้ำเชื้อแช่แข็ง: window ของ sperm แคบกว่าของไข่ ผสมล่วงหน้าไม่ได้ เพราะไม่รู้ว่าไข่จะตกภายใน 6 ชั่วโมงหรือไม่ จึงต้องตรวจรังไข่ถี่ๆ แล้วผสมเมื่อไข่ตก"
                ]
              }
            ]
          },
          {
            "sub": "Frequency of AI",
            "body": [
              {
                "table": {
                  "headers": [
                    "Fresh/chilled semen",
                    "Frozen semen"
                  ],
                  "rows": [
                    [
                      "Every 2 days",
                      "Every 4-6 h"
                    ],
                    [
                      "AI before ovulation",
                      "AI before or after ovulation"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "น้ำเชื้อสดหรือแช่เย็นผสมทุก 2 วันเพราะ sperm อยู่ได้ 2 วัน เช่น ตรวจพบ follicle 4 ซม. ผสมวันพฤหัสบดี ถ้าวันศุกร์ไข่ตกแล้วก็จบ ถ้าวันศุกร์ยังไม่ตกยังไม่ต้องผสมซ้ำ ตรวจอีกครั้งวันเสาร์ ถ้าวันเสาร์ยังไม่ตกจึงผสมซ้ำ",
                  "น้ำเชื้อแช่แข็ง: ตรวจทุก 6 ชั่วโมงจนกว่าไข่จะตก เช่น 18:00, 24:00, 06:00 น. ถ้าต้องการให้ติดดีขึ้นตรวจทุก 4 ชั่วโมง เช่น 18:00, 22:00, 02:00 น. เป็น intensive management ที่ทำให้น้ำเชื้อแช่แข็งใช้ยาก",
                  "การเหนี่ยวนำการตกไข่ด้วย hormone ช่วยให้รู้ช่วงเวลาที่ไข่จะตก จึงตรวจน้อยครั้งลง",
                  "น้ำเชื้อแช่แข็งผสมเมื่อไข่ตกแล้ว จึงไม่มี re-insemination"
                ]
              },
              {
                "callout": "สไลด์ p.27 พิมพ์ Every 4-6 h ใต้ Frozen semen ในหัวข้อ Frequency of AI: ตามบันทึกคาบ 15 ต.ค. 2569 [49:30-50:30, 57:01] 4-6 ชั่วโมงคือความถี่ของการตรวจการตกไข่ ไม่ใช่การผสมซ้ำทุก 4-6 ชั่วโมง",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Insemination procedure",
            "body": [
              {
                "bullets": [
                  "Insemination time: very important; technique: **intrauterine insemination**",
                  "ในช่วง estrus cervix ของม้านิ่มมาก จึงจับ cervix ผ่าน rectum มาสวมกับท่อผสมเทียมแบบโคไม่ได้",
                  "ผู้ผสมกำท่อผสมเทียมแล้วสอดมือและแขนเข้าไปใน vagina หา cervix แล้วสอดท่อผ่านเข้าไป cervix ของม้าสอดผ่านง่ายเพราะไม่มีหลืบมาก",
                  "ปล่อยน้ำเชื้อใน **uterine body** เลียนแบบธรรมชาติที่พ่อม้าหลั่งใน cervix แล้วน้ำเชื้อพุ่งเข้ามดลูก sperm จึงไปได้ทั้งปีกซ้ายและขวาโดยไม่ต้องสนว่าไข่ตกข้างไหน",
                  "**Deep intrauterine insemination**: นำ catheter แบบ flexible ไปปล่อยน้ำเชื้อที่ปลาย horn ข้างที่กำลังจะตกไข่ เป็นเทคนิคขั้นสูง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Post-insemination management",
        "source": "Artificial insemination p.28-29; บันทึกคาบ 15 ต.ค. 2569 [55:31-57:32]",
        "body": [
          {
            "bullets": [
              "**Check ovulation**: consider re-insemination",
              "**Check pregnancy**: consider to terminate pregnancy in case of twin",
              "± Caslick's operation",
              "**Check post breeding endometritis**"
            ]
          },
          {
            "bullets": [
              {
                "label": "Consequences/complications",
                "value": "not pregnant; uterine fluid/infection: post breeding endometritis; embryonic death"
              },
              "หลังไข่ตกต้องตรวจว่ามีน้ำในมดลูกหรือไม่ เพราะม้าเกิด endometritis ได้ง่าย ถ้ามีให้แก้ไข ถ้าไม่มีก็รอตรวจท้อง",
              "แม่ม้าที่มีแนวโน้มเกิด pneumovagina อาจทำ Caslick's operation หลังผสม",
              "ตรวจท้องครั้งแรกที่ **14 วัน**",
              "Keynotes: highly variable semen quality (chilling and freezing sensitivity); highly intensive care/management for frozen semen"
            ]
          }
        ]
      }
    ]
  },
  "eqrepro-stallion-infect": {
    "topic": "eqrepro-stallion-infect",
    "title": "Infertility problems and infectious diseases in stallions",
    "lecturer": "Theerawat Tharasanit",
    "icon": "🦠",
    "summary": "ปัญหา infertility และโรคติดเชื้อทางระบบสืบพันธุ์ของพ่อม้า: การอ่าน pregnancy rate ต่อครั้งผสม, ปัญหาพฤติกรรม, ejaculatory dysfunction, poor semen quality กับ algorithm ของ azoospermia และการใช้ alkaline phosphatase แยกการอุดตัน ครึ่งหลังเป็นโรคติดเชื้อ 4 โรค: contagious equine metritis, equine coital exanthema (EHV-3), equine viral arteritis ซึ่งเป็น persistent infection ที่ขึ้นกับ testosterone และ dourine",
    "sections": [
      {
        "heading": "High กับ low fertility stallion: ดู pregnancy rate ต่อครั้งผสม",
        "source": "Infertility problems in stallions p.2; บันทึกคาบ 15 ต.ค. 2569 [58:03-61:31]",
        "body": [
          {
            "table": {
              "headers": [
                "ครั้งที่ผสม",
                "High fertility: 60% pregnancy rate per attempt",
                "Low fertility: 40% pregnancy rate per attempt"
              ],
              "rows": [
                [
                  "1st attempt",
                  "100 mares ได้ 60 pregnant mares",
                  "100 mares ได้ 40 pregnant mares"
                ],
                [
                  "2nd attempt",
                  "40 mares ได้ 24",
                  "60 mares ได้ 24"
                ],
                [
                  "3rd attempt",
                  "16 mares ได้ 10",
                  "36 mares ได้ 14"
                ],
                [
                  "4th attempt",
                  "",
                  "22 mares ได้ 9"
                ],
                [
                  "5th attempt",
                  "",
                  "13 mares ได้ 5"
                ],
                [
                  "6th attempt",
                  "",
                  "8 mares ได้ 3"
                ],
                [
                  "**Overall pregnancy/year**",
                  "**94/100 (94%)** จาก 3 ครั้ง",
                  "**95/100 (95%)** จาก 6 ครั้ง"
                ]
              ]
            }
          },
          {
            "bullets": [
              "อัตราตั้งท้องทั้งปีเป็นข้อมูลสะสม ยิ่งผสมหลายรอบยิ่งสูงขึ้น พ่อม้า 2 ตัวจึงดูเหมือน fertility เท่ากันทั้งที่ไม่เท่า",
              "พ่อม้าที่ขายโดยอ้างอัตราตั้งท้องต่อปีสูงมาก อาจได้ตัวเลขนั้นจากการผสมจำนวนรอบมาก",
              "การเทียบ fertility ต้องใช้ **อัตราตั้งท้องต่อการผสม 1 ครั้ง (per insemination)** ไม่ใช่ต่อปี"
            ]
          }
        ]
      },
      {
        "heading": "สาเหตุของ infertility ในพ่อม้า: ภาพรวม",
        "source": "Infertility problems in stallions p.3-5, p.29; บันทึกคาบ 15 ต.ค. 2569 [61:31-62:00]",
        "body": [
          {
            "bullets": [
              {
                "label": "Non-infectious",
                "value": "physical trauma, hemospermia, priapism, dermatologic condition (Habronema), behaviour problems"
              },
              {
                "label": "Infectious",
                "value": "herpes virus, equine viral arteritis"
              }
            ]
          },
          {
            "sub": "Infertility of the stallions",
            "body": [
              {
                "bullets": [
                  "Idiopathic or acquired causes",
                  "Non-infectious vs. infectious",
                  "**Multiple factors** are normally involved",
                  "Stallion vs. mare related problems",
                  "Treatments are associated with an underlying cause"
                ]
              }
            ]
          },
          {
            "sub": "Diseases of penis and prepuce",
            "body": [
              {
                "bullets": [
                  "Inflammation",
                  "Hematoma",
                  "Lesion of herpes virus (type 3): equine coital exanthema",
                  "Habronema granulomas, squamous cell carcinomas และ papillomas",
                  "Cellular debris and washing: ใช้ weak detergents เพื่อ maintain normal flora",
                  "Pathogenic bacteria: Taylorella equigenitalis (contagious equine metritis) และ Klebsiella spp., Streptococcus zooepidemicus, Pseudomonas spp. (post-breeding endometritis)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Behavioural problems",
        "source": "Infertility problems in stallions p.6-8; บันทึกคาบ 15 ต.ค. 2569 [63:30-64:30, 65:01-67:03]",
        "body": [
          {
            "sub": "Normal stallion behaviors",
            "body": [
              {
                "bullets": [
                  "Immediate interest and interaction with an estrus mare",
                  "Erection within 2 min",
                  "Mount readiness within 5 to 10 sec after erection",
                  "Ejaculation on first mount",
                  "Total breeding time of 2 to 5 min"
                ]
              }
            ]
          },
          {
            "sub": "Inexperienced stallion",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Normality",
                    "value": "experienced stallions usually exhibit very consistent breeding behaviour; most stallions achieve an erection within one or two minutes of introduction to an oestrous mare"
                  },
                  "The onset and intensity of precopulatory and copulatory behaviour are affected by the past experience of the stallion, genetics, season and disease",
                  "The commonest causes of low libido are **inexperience and mismanagement**",
                  {
                    "label": "Abnormality",
                    "value": "novice stallions may show some interest in breeding but are easily distracted; อาจใช้เวลาถึง 1 ชั่วโมงกว่าจะ erection และ mount the mare"
                  }
                ]
              },
              {
                "bullets": [
                  {
                    "label": "Treatment",
                    "value": "gain more experience with oestrus mare"
                  },
                  "ให้ stallion ดู stallion ตัวอื่นขึ้นทับแม่ม้า หรือให้เลือกแม่ม้ามากกว่า 1 ตัว",
                  "ถ้าไม่ได้ผลใช้ pharmacological behaviour modification: **GnRH 50 µg** ให้ 2 ชั่วโมงและอีกครั้ง 1 ชั่วโมงก่อนผสม",
                  "**Diazepam** ให้ช้าๆ IV ที่ 0.05 mg/kg สูงสุด 20 mg มีประโยชน์ใน young stallions ที่แสดง signs of anxiety"
                ]
              }
            ]
          },
          {
            "sub": "Behavioural problems: others",
            "body": [
              {
                "table": {
                  "headers": [
                    "Events",
                    "Treatment"
                  ],
                  "rows": [
                    [
                      "**Mismanagement**: อาจหาปัญหาเฉพาะที่เกี่ยวกับ handler, location, type of artificial vagina ได้",
                      "Identify the problems"
                    ],
                    [
                      "**Pain**: back or hindlimb pain or penile injuries มีผลต่อ breeding behaviour",
                      "NSAID; ground semen collection"
                    ],
                    [
                      "**Hormone**: too low LH and T4",
                      "Hormone supplement, if necessary"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "แก้ตามสาเหตุ",
            "body": [
              {
                "bullets": [
                  "ม้าที่ไม่ยอมขึ้นผสมอาจกลัวแม่ม้า หรือเจ็บหลังหรือเจ็บขา ถ้าไม่แก้ที่ความเจ็บ ม้าก็ยังไม่ขึ้นเหมือนเดิม",
                  "ม้าที่ประสบการณ์น้อยและกลัวแม่ม้า: ให้เห็นพ่อม้าตัวอื่นขึ้นผสมเพื่อเรียนรู้ หรือเปลี่ยนแม่ม้าเป็นอีกตัว"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Problems associated with ejaculation",
        "source": "Infertility problems in stallions p.9-11; บันทึกคาบ 15 ต.ค. 2569 [64:30-65:30, 67:03-68:30]",
        "body": [
          {
            "sub": "No ejaculation: 4 แบบ",
            "body": [
              {
                "bullets": [
                  "Stallion with no sperm production",
                  "Stallion with sperm production but semen cannot be normally ejaculated/delivered",
                  "Stallion with sperm production and ejaculation but with **retrograde ejaculation**",
                  "Stallion with normal sperm production and ejaculation but with poor sperm quality (quantity and quality)"
                ]
              }
            ]
          },
          {
            "sub": "Non-ejaculatory coitus",
            "body": [
              {
                "bullets": [
                  "May or may not be influenced by behaviours",
                  "สาเหตุที่พบบ่อยที่สุด 1) **psychogenic** จาก overuse of the stallion, poor handling, breeding accidents หรือ unsuitable environment",
                  "2) **organic causes** พบน้อยกว่า เช่น damage to the dorsal nerve of the penis",
                  "Treatment: ensure maximum sexual arousal โดยใช้แม่ม้าที่เป็นสัด 1 ตัวหรือมากกว่า และ quiet environment",
                  "ถ้า neural mechanisms เสีย รักษาโดยกระตุ้น smooth muscle contractility ด้วยการ enhance alpha-adrenergic หรือ block beta-adrenergic activity",
                  "**Xylazine** (0.66 mg/kg) induces spontaneous emission approximately 25%",
                  "Low doses ของ tricyclic antidepressant **imipramine hydrochloride** 100 to 500 mg ให้กิน twice daily"
                ]
              }
            ]
          },
          {
            "sub": "Urinary incontinence during ejaculation",
            "body": [
              {
                "bullets": [
                  "Urination อาจเกิด intermittently หรือ continuously ตลอด ejaculation",
                  "น้ำเชื้อที่ได้มี distinctive colour and odour และ **urea กับ creatinine สูง**",
                  "Treatment: ฝึกให้ม้าปัสสาวะก่อนผสม",
                  "**Imipramine** 100 to 500 mg orally twice daily ใช้เพื่อ close the bladder neck ระหว่าง emission of semen"
                ]
              }
            ]
          },
          {
            "sub": "น้ำเชื้อน้อยกว่าปกติคิดถึงอะไร",
            "body": [
              {
                "bullets": [
                  "ไล่เป็นขั้น: ผลิต sperm ได้หรือไม่, มี ejaculate หรือไม่, ใน ejaculate มี sperm หรือไม่",
                  "**Retrograde ejaculation**: น้ำเชื้อย้อนเข้า bladder แทนที่จะออกทาง penis จึงไม่ได้ ejaculate หรือได้น้อยกว่าปกติ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Poor semen quality และ azoospermia",
        "source": "Infertility problems in stallions p.12-16; บันทึกคาบ 15 ต.ค. 2569 [68:30-71:33]",
        "body": [
          {
            "sub": "เก็บตัวอย่างที่เป็นตัวแทน",
            "body": [
              "เก็บด้วย artificial vagina หลัง **sexual rest 4-5 วัน** เก็บอย่างน้อย **2 ejaculates ห่างกัน 1 ชั่วโมง** แล้วตรวจความเป็นตัวแทนด้วย 4 เกณฑ์",
              {
                "bullets": [
                  "volume ของ 2 ejaculates ควรใกล้เคียงกัน",
                  "total number of sperm ของ ejaculate ที่ 2 ควรประมาณ **ครึ่งหนึ่ง** ของครั้งแรก",
                  "pH ควรเท่าเดิมหรือสูงขึ้นเล็กน้อย",
                  "motility ควรเท่าเดิมหรือเพิ่มขึ้นใน ejaculate ที่ 2"
                ]
              },
              "สาเหตุของ poor semen quality แบ่งเป็น testicular/scrotal/epididymal, hormonal หรือจาก inflammatory cells in the semen"
            ]
          },
          {
            "sub": "Algorithm ของ azoospermic stallion",
            "body": [
              {
                "table": {
                  "headers": [
                    "ทางแยก",
                    "ขั้นตอน"
                  ],
                  "rows": [
                    [
                      "**Stallion appears not to ejaculate**",
                      "(1) increase sexual stimulation (tease to several mares, fence-line access to mares, adjust phantom mare height หรือใช้ smaller mount, solid footing, encourage ejaculation while standing on all four feet); (2) evaluate artificial vagina (change model, pressure, temperature, position); (3) apply hot towel compress; (4) evaluate penile sensation, check for filling defects; (5) pharmacotherapy: GnRH, imipramine, short-term testosterone, xylazine or detomidine, oxytocin or prostaglandin"
                    ],
                    [
                      "**Stallion appears to ejaculate, high alkaline phosphatase level**",
                      "evaluate testes, epididymides and spermatic cords (size, texture, adhesions, ultrasonography); perform biopsy (degeneration, hypoplasia, cessation of spermatogenesis); evaluate hormonal characteristics (baseline LH, FSH, estradiol, testosterone; GnRH response; hCG response)"
                    ],
                    [
                      "**Stallion appears to ejaculate, low alkaline phosphatase level**",
                      "evaluate internal and external genitalia for evidence of semen outflow obstruction (palpation, ultrasonography); rule out retrograde ejaculation (free-catch urine midstream and examine it, bladder catheterization)"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Alkaline phosphatase แยก blockage",
            "body": [
              {
                "bullets": [
                  "ejaculate ที่มีส่วนจาก testis และ epididymis ออกมาครบ ค่า alkaline phosphatase **สูง**",
                  "ถ้ามี blockage เช่น ที่ epididymis ยังรีดได้ ejaculate เพราะ seminal plasma ไม่ถูกอุดไปด้วย แต่ alkaline phosphatase **ต่ำ**",
                  "sperm น้อยจึงต้องแยก 2 ทาง: testis สร้างได้น้อยจริง หรือมี blockage (ดูจาก alkaline phosphatase) ถ้าอยากรู้ว่า sperm สร้างได้ปกติหรือไม่ให้ทำ **testicular biopsy**"
                ]
              }
            ]
          },
          {
            "sub": "Testicular hypoplasia/degeneration",
            "body": [
              {
                "bullets": [
                  "บางพันธุ์ เช่น Welsh Mountain pony ดูเหมือน predisposed",
                  "Testicular hypoplasia อาจพบร่วมกับ epididymal hypoplasia",
                  "Testes can be **soft (early) or firm (later)**",
                  "libido และ semen volume ของ stallion **usually normal**",
                  "sperm มี morphological abnormalities สูงและ poor motility; มักพบ round spermatogenic cells และ multinucleated germ cells ใน ejaculate"
                ]
              }
            ]
          },
          {
            "sub": "Orchitis",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชนิด",
                    "ลักษณะและการรักษา"
                  ],
                  "rows": [
                    [
                      "**Traumatic orchitis**",
                      "hot and painful testes, testicular and scrotal oedema; cryotherapy (no more than 20 minutes every one to three hours), NSAID, castration or hemicastration"
                    ],
                    [
                      "**Bacterial orchitis**",
                      "hot and painful testes; the semen contains many neutrophils; antibiotics after identification of the causal organism(s), NSAID และ local cryotherapy"
                    ],
                    [
                      "**Viral orchitis**",
                      "equine infectious anaemia, equine viral arteritis และ influenza are not primary causes of orchitis แต่ secondary orchitis may result from vascular lesions"
                    ],
                    [
                      "**Parasitic orchitis**",
                      "migrating larvae of Strongylus edentatus may cause orchitis"
                    ],
                    [
                      "**Autoimmune orchitis**",
                      "antisperm antibodies may develop as a result of trauma and disruption to the blood-testis barrier"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Partial ejaculates and spermiostasis",
            "body": [
              {
                "bullets": [
                  "stallion มี intermittent or complete obstruction ของ **ampulla** ข้างเดียวหรือ 2 ข้าง",
                  "ใน spermiostasis sperm สะสมใน ampulla; ampulla อาจ enlarged and corded (**>1.0 cm**) เมื่อ palpation",
                  "Treatment: frequent collection, manual massage และ/หรือ exogenous **oxytocin 20 IU IV** ให้ **10 นาทีก่อน collection**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Contagious equine metritis (CEM)",
        "source": "Infertility problems in stallions p.17-28; บันทึกคาบ 15 ต.ค. 2569 [72:02-72:31]",
        "body": [
          {
            "sub": "Diseases affecting stallion's fertility",
            "body": [
              {
                "bullets": [
                  "Pathogenic bacteria that should be of concern: Pseudomonas aeruginosa, Klebsiella pneumoniae, Streptococcus zooepidemicus",
                  "Bacterial genital infection: contagious equine metritis (CEM)",
                  "Viral genital infection: equine viral arteritis, equine coital exanthema (herpes type 3)",
                  "Protozoa genital infection"
                ]
              }
            ]
          },
          {
            "sub": "เชื้อและลักษณะสำคัญ",
            "body": [
              {
                "bullets": [
                  "**Taylorella equigenitalis**",
                  "Highly contagious during coitus",
                  "**The only venereal transmissible bacterial agent in horses**",
                  "**No clinical sign in stallion (reservoir)**",
                  "ในแม่ม้าก่อ endometritis และ mucovaginal discharge"
                ]
              },
              "พ่อม้าไม่แสดงอาการ เชื้ออยู่รอบ urethral process จึงต้อง swab ให้ตรงตำแหน่ง แม่ม้าที่ถูกผสมจะเป็น metritis"
            ]
          },
          {
            "sub": "Transmission",
            "body": [
              {
                "bullets": [
                  "**Venereal transmission**: mainly during mating; แพร่ได้ทาง infected semen ระหว่าง artificial insemination หรือผ่าน fomites",
                  "Transmission rate high",
                  "**Stallions are most common source**",
                  "Bacteria persist months to years in reproductive tract",
                  "Asymptomatic carriage: แม่ม้า carry เชื้อที่ clitoris และใน uterus; ลูกม้าที่เกิดจากแม่ติดเชื้อ carry เชื้อบน external genitalia; กลายเป็น long-term asymptomatic carriers"
                ]
              }
            ]
          },
          {
            "sub": "Disease in male and female, morbidity and mortality",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Infected stallions",
                    "value": "no clinical signs"
                  },
                  {
                    "label": "Infected mares",
                    "value": "metritis; temporary infertility; some infections subclinical; mucopurulent vaginal discharge after breeding; vaginitis, cervicitis, metritis; abortion"
                  },
                  "No fatal infections known",
                  "**Morbidity very high**: nearly every mare mated to an infected stallion will become infected",
                  "Most mares recover; some become asymptomatic carriers",
                  "Mares can be re-infected; clinical signs most severe during first infection"
                ]
              }
            ]
          },
          {
            "sub": "Diagnosis และตัวอย่างที่เก็บ",
            "body": [
              {
                "bullets": [
                  "Clinical: นึกถึง CEM ในแม่ม้าที่มี abundant mucopurulent vaginal discharge **14 วันหลังผสม**",
                  "Differentiation: Pseudomonas aeruginosa, Streptococcus zooepidemicus, Klebsiella pneumoniae",
                  "**Culture**: genital tract swabs; อาจผสม carrier stallions กับ test mares แล้ว culture แม่ม้าหา T. equigenitalis; organism is **fastidious**",
                  "**PCR**: infected and carrier mares and stallions",
                  "Serology"
                ]
              },
              {
                "table": {
                  "headers": [
                    "สัตว์",
                    "Samples to collect"
                  ],
                  "rows": [
                    [
                      "Mares",
                      "vaginal discharge; clitoral fossa, cervix, endometrium"
                    ],
                    [
                      "Stallions",
                      "urethral fossa and sinus, distal urethra, external surface of penis and prepuce"
                    ],
                    [
                      "Foals",
                      "placenta and genital tract of normal foals born to infected mares"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Prevention and control",
            "body": [
              {
                "bullets": [
                  "CEM screening before importation",
                  "Endemic areas: breed only CEM-free animals; high risk stallions (bred for first time)",
                  "Good hygiene, decontamination and sanitation during breeding",
                  "Cleaning and disinfection: T. equigenitalis susceptible to most common disinfectants ได้แก่ chlorhexidine, ionic and non-ionic detergents, sodium hypochlorite",
                  "**No vaccine available**",
                  "Treatment of carriers: wash external genitalia with disinfectant; local antibiotic treatment; systemic antibiotics recommended in some animals",
                  "T. equigenitalis may be more readily eliminated in stallions"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Equine herpesvirus type 3: equine coital exanthema",
        "source": "Infertility problems in stallions p.30-31; บันทึกคาบ 15 ต.ค. 2569 [62:00-63:30]",
        "body": [
          {
            "bullets": [
              "ก่อโรค **equine coital exanthema**",
              "Highly contagious but **low economic impact**",
              "Transmission: direct contact, coitus",
              "Viral replication เกิดเฉพาะที่ใน stratified epithelium ทำให้ epithelium ถูกทำลาย และ/หรือมี secondary infection จาก Streptococcus zooepidemicus",
              "รอยโรคบน penis ของพ่อม้า และที่ vulva ของแม่ม้า"
            ]
          }
        ]
      },
      {
        "heading": "Equine viral arteritis (EVA)",
        "source": "Infertility problems in stallions p.32-37; บันทึกคาบ 15 ต.ค. 2569 [72:31-80:34]",
        "body": [
          {
            "bullets": [
              "Enveloped RNA virus, genus Arteriviridae",
              "Cause: **respiratory and abortion**",
              "Economic impact: export of semen, use of the stallion",
              "เป็นโรคที่หนักที่สุดในกลุ่มที่ติดทางการผสมพันธุ์ เพราะไวรัสถูกขับออกมาในน้ำเชื้อ พ่อม้าที่จะขายน้ำเชื้อหรือใช้เป็นพ่อพันธุ์ต้องปลอดโรคนี้"
            ]
          },
          {
            "callout": "สไลด์ p.32 เขียนว่า genus Arteriviridae แต่ Arteriviridae เป็นชื่อ family (EAV อยู่ใน family Arteriviridae)",
            "kind": "flag"
          },
          {
            "sub": "Mode of transmission",
            "body": [
              {
                "bullets": [
                  "Direct contact via **respiratory shedding**",
                  "**Venereal transmission via semen**",
                  "Congenital transmission ทำให้ abortion or sick foal",
                  "**Persistent infection in the stallion** ซึ่ง seems to be **testosterone dependent**",
                  "วงจรการแพร่: persistently infected stallion ผสม (breeding) ได้ acutely infected mare แล้วแพร่แบบ aerosol transmission ไปยัง in-contact naive horses เกิด respiratory disease, abortion and possible persistent infection of stallions"
                ]
              }
            ]
          },
          {
            "sub": "Clinical signs และ pathogenesis ของการแท้ง",
            "body": [
              {
                "bullets": [
                  "ชื่อโรคบอกพยาธิกำเนิด: arteritis คือหลอดเลือดอักเสบ อาการจึงขึ้นกับตำแหน่ง ถ้าเกิดที่ placenta เป็น placentitis ถ้าเกิดที่ส่วนปลายของร่างกายเห็น **edema** รอยแดงและจ้ำเลือด มักพบที่ lower extremity เช่น ขา scrotum และ prepuce",
                  "อาการ: urticaria, distal limb edema, mucosal petechial hemorrhage, preputial and distal limb edema",
                  "Pathogenesis of EAV abortion: leukocyte associated viremia, EAV infects uterine blood vessels and myometrium แล้วแยก 2 ทาง",
                  "ทางที่ 1: vasculitis and myometritis with ischemia followed by precocious chorionic detachment ได้ **uninfected aborted fetus**",
                  "ทางที่ 2: EAV infects areolar trophoblast, chorionic mesenchyma และบางครั้ง fetus ได้ **infected aborted fetus or infected newborn foal**"
                ]
              }
            ]
          },
          {
            "sub": "Persistent infection ที่ขึ้นกับ testosterone",
            "body": [
              {
                "bullets": [
                  "คำสำคัญ 2 คำ: เป็น persistent infection และการคงอยู่ของเชื้อขึ้นกับ testosterone",
                  "ม้าเพศผู้ที่ไม่ได้ใช้เป็นพ่อพันธุ์: **castration** เพื่อไม่ให้เกิด persistent infection",
                  "แม่ม้าที่ได้รับน้ำเชื้อมีไวรัสติดโรคได้ แต่ **ไม่เป็น persistent infection** เพราะภาวะนี้ขึ้นกับ testosterone"
                ]
              },
              {
                "callout": "โรคที่ทำให้แท้งเกือบทั้งหมดเกิดในช่วง last trimester และมักเหนี่ยวนำให้เกิด placentitis ซึ่งทำให้แท้งเพราะตั้งแต่ mid term ถึงปลาย term การตั้งท้องคงอยู่ได้ด้วย progesterone จาก placenta เมื่อ placenta อักเสบจึงผลิตไม่พอ (บันทึกคาบ 15 ต.ค. 2569 [79:30-80:34])",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "Diagnosis",
            "body": [
              {
                "bullets": [
                  "Differential diagnosis: EVA มักถูกเรียกว่า respiratory virus เพราะคล้าย influenza และ equine herpesviruses (EHV) 1 and 4",
                  "Diagnosis: viral isolation หรือ serology test",
                  "Acute phase: **four-fold or greater increase** in serum antibody titer (เก็บตอน acute และอีกครั้ง 21 to 28 days later)",
                  "Identification of the virus ใน nasopharyngeal secretions หรือ whole blood",
                  "ตรวจ EAV ด้วย virus isolation on appropriate cell cultures หรือ **RT-PCR**",
                  "EAV neutralization assay เป็น international regulatory assay (OIE)"
                ]
              }
            ]
          },
          {
            "sub": "Control and vaccination",
            "body": [
              {
                "bullets": [
                  "Appropriate quarantine and testing procedures for susceptible horses",
                  "ลดความเสี่ยงการแพร่ของ EAV: identification of carrier stallions; isolation of new arrivals for **3 to 4 weeks**; segregation of pregnant mares and young foals from other horses; **castration or testosterone suppression** ใน suspected or positive EVA stallion",
                  "Vaccination: EVA vaccine (Arvac) ที่ USDA อนุมัติให้ใช้ในสหรัฐอเมริกาเป็น **modified live vaccine**"
                ]
              }
            ]
          },
          {
            "sub": "Recommendations of stallion testing for EVA",
            "body": [
              {
                "bullets": [
                  "1. Serologically test stallion",
                  "2. **Seronegative**: record seronegative status with certificate and vaccinate annually",
                  "3. **Seropositive**: breed to seronegative test mares and then test mares 28 days later และ perform virus isolation on semen",
                  "4. ถ้า mares or semen test positive จัดเป็น **shedding stallion**",
                  "5. ถ้า mares or semen test negative จัดเป็น **seropositive nonshedding stallion** and vaccinate annually"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dourine: Trypanosoma equiperdum",
        "source": "Infertility problems in stallions p.38-39; บันทึกคาบ 15 ต.ค. 2569 [80:34-82:00]",
        "body": [
          {
            "bullets": [
              "Protozoal genital infection จาก **Trypanosoma equiperdum** (dourine, parasitic venereal disease)",
              "Transmission: **venereal transmission during coitus** (direct contact)",
              "พบ T. equiperdum ได้ใน vaginal secretion, seminal fluid และ discharge of the penis",
              {
                "label": "Clinical sign",
                "value": "edematous swelling of the external genitalia, mucopurulent discharge from the urethra, urticarial cutaneous lesions และบางครั้ง penile paralysis"
              },
              {
                "label": "Diagnosis",
                "value": "blood smear มี low sensitivity; identification of agents (PCR) และ serological tests (ELISA)"
              },
              "Treatment is impractical (but can be treated)"
            ]
          },
          {
            "bullets": [
              "โรคนี้ไม่มีในประเทศไทย พบในแถบแอฟริกา แต่เป็นโรคตามกฎหมายที่กรมปศุสัตว์กำหนดให้ตรวจก่อนนำม้าเข้า",
              "เชื้ออยู่ในชั้น mucosa ของ reproductive tract เพศเมีย เช่น มดลูกและ vagina ทำให้ระคายเคือง เกิด endometritis, metritis, vaginitis และมี vaginal discharge"
            ]
          }
        ]
      }
    ]
  },
  "eqrepro-surgery": {
    "topic": "eqrepro-surgery",
    "title": "Equine reproductive surgery",
    "lecturer": "Sawita Santiviparat",
    "icon": "🔪",
    "summary": "ศัลยกรรมระบบสืบพันธุ์ม้า เพศผู้: castration (standing กับ recumbent, ยาและ local block, open กับ closed technique, emasculator, การดูแลหลังผ่าตัดและ complication), cryptorchid, tumor ของ penis กับ reefing และ penile amputation เพศเมีย: Caslick's operation, perineal laceration 3 ระดับ, การตัด endometrial cyst ผ่านกล้อง และ caesarean section สไลด์ส่วนใหญ่เป็นรูป ขั้นตอนการทำจึงมาจากบันทึกคาบและระบุนาทีกำกับไว้",
    "sections": [
      {
        "heading": "ขอบเขตของ reproductive surgery ในม้า",
        "source": "Equine reproductive surgery p.2",
        "body": [
          {
            "bullets": [
              {
                "label": "เพศเมีย",
                "value": "caesarean section & other reproductive emergencies; urogenital surgery (Caslick's surgery, perineal surgery); ovariectomy (ovarian tumor/granulosa cell tumors, ovarian hematoma/abscess/cyst); repair of uterine torsion; removal of endometrial cyst"
              },
              {
                "label": "เพศผู้",
                "value": "castration; correction of inguinal hernias; cryptorchid; urogenital surgery: removal of penile/testicle tumors; penile amputation"
              }
            ]
          }
        ]
      },
      {
        "heading": "Castration: วัตถุประสงค์และช่วงเวลาที่ทำ",
        "source": "Equine reproductive surgery p.3; บันทึกคาบ 29 ต.ค. 2569 [02:30-05:30]",
        "body": [
          {
            "sub": "วัตถุประสงค์",
            "body": [
              {
                "bullets": [
                  "**Prevent unwanted breeding**",
                  "ลดการพัฒนา **stallion-like characteristics and behaviors**",
                  "ทำให้ management and handling ง่ายขึ้น",
                  "Timing ขึ้นกับ age, intended use, breeding potential และ owner preference"
                ]
              }
            ]
          },
          {
            "sub": "เหตุผลในม้าเทียบกับสัตว์เล็ก",
            "body": [
              {
                "bullets": [
                  "สุนัขและแมว: ตอนเพื่อควบคุมประชากร หรือเมื่อ reproductive tract ของเพศผู้ผิดปกติ",
                  "ม้า: เหตุผลหลักคือ **ควบคุมพฤติกรรม** stallion ที่ aggressive จนควบคุมไม่ได้จะใช้แข่งกีฬาหรือใช้งานไม่ได้",
                  "ม้าที่เลี้ยงรวมเป็นฝูง: ตอนเพื่อควบคุมประชากรด้วย เพราะในฝูงไม่รู้ว่าผสมกันเมื่อไร ลูกเป็นของพ่อแม่ตัวไหน และเกิด inbreeding ต่อไปเรื่อยๆ"
                ]
              }
            ]
          },
          "หลักการของ castration คือตัด testis ออก ทำตั้งแต่อายุน้อยได้ถ้ามั่นใจว่า testis ลงถุงครบ 2 ข้างแล้ว ส่วนมากทำเมื่อม้าโตพอให้ควบคุมและจับบังคับได้"
        ]
      },
      {
        "heading": "Standing castration กับ recumbent castration",
        "source": "Equine reproductive surgery p.4; บันทึกคาบ 29 ต.ค. 2569 [05:30-10:01]",
        "body": [
          {
            "table": {
              "headers": [
                "ชนิด",
                "สิ่งที่ต้องมี"
              ],
              "rows": [
                [
                  "**Standing castration**",
                  "safe restraint และ experienced handler; padded stocks with a high lateral bar are ideal; clean, empty stable ใช้ได้เมื่อ restraint และ assistance เพียงพอ"
                ],
                [
                  "**Recumbent castration**",
                  "large, clean, open area สำหรับ induction และ recovery; hospital หรือ surgical facility ควบคุม asepsis, monitoring และ recovery ได้ดีกว่า"
                ]
              ]
            }
          },
          {
            "sub": "เลือกแบบไหน",
            "body": [
              {
                "bullets": [
                  "**Standing** ใช้ sedation ร่วมกับ local infiltration block ม้ายืนให้ทำ ใช้ยาน้อย ใช้คนและแรงงานน้อย เมื่อหายซึมไม่เกิน 30 นาทีม้าเดินกลับได้",
                  "เลือก **recumbent (general anesthesia)** เมื่อม้า aggressive มากจน sedate หนักแล้วยังเตะ, ม้าที่ไม่ปลอดภัยพอให้มุดเข้าไปทำใต้ท้อง, หรือ testis ผิดปกติ เช่น 2 ข้างขนาดไม่เท่ากัน ข้างหนึ่งเล็ก หรือมีภาวะ cryptorchid ร่วม เพราะ standing มีพื้นที่ทำงานน้อย การล้มนอนให้พื้นที่ทำงานมากกว่า",
                  "เลือก **standing** เมื่อม้ามีปัญหา musculoskeletal หรือ nerve ซึ่งล้มนอนแล้วเสี่ยงลุกไม่ขึ้นหรือลุกแล้วล้ม โดยเฉพาะเมื่อทำในภาคสนามที่ไม่ได้ฟื้นในห้องผ่าตัด",
                  "Standing: surgeon เสี่ยงถูกเตะได้ตลอดเวลา จึงต้องมี safe restraint และบริเวณที่ทำต้องสะอาด เช่น คอกที่ทำความสะอาดแล้วหรือในซอง",
                  "Recumbent: ต้องมีพื้นที่สะอาดและกว้างพอให้ม้าล้มตัวลงนอนและลุกขึ้นได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Castration anesthesia, restraint และ local anesthesia",
        "source": "Equine reproductive surgery p.5-7; หน้า Castration Anesthesia ฉบับแก้ ส่งในกลุ่มไลน์ชั้นปี 18 พ.ย. 2569; บันทึกคาบ 29 ต.ค. 2569 [10:01-20:31]",
        "body": [
          {
            "sub": "ตารางยา",
            "body": [
              {
                "table": {
                  "headers": [
                    "Standing castration: Induction drug",
                    "Top up drug"
                  ],
                  "rows": [
                    [
                      "Xylazine / Detomidine, Acepromazine",
                      "Xylazine"
                    ],
                    [
                      "Xylazine / Detomidine",
                      "Xylazine / Detomidine"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  {
                    "label": "Recumbent castration (คอลัมน์ Drug)",
                    "value": "Xylazine + Ketamine; Detomidine + Ketamine; Diazepam + Xylazine + Ketamine; Xylazine + Tiletamine/Zolazepam; Detomidine + Tiletamine/Zolazepam"
                  }
                ]
              },
              {
                "callout": "ตารางนี้เป็นหน้าที่แก้แล้ว ส่งในกลุ่มไลน์ชั้นปีวันที่ 18 พ.ย. 2569 ฉบับเดิมในเดคหน้า 5 พิมพ์ ketamine, diazepam และ tiletamine/zolazepam ไว้ฝั่ง standing ซึ่งในคาบแจ้งว่าไม่ถูกต้อง เพราะ ketamine ทำให้ม้าล้มลงนอนทันที ยา induction เช่น ketamine หรือ Zoletil (tiletamine/zolazepam) ใช้กับ recumbent castration (บันทึกคาบ 29 ต.ค. 2569 [12:01-12:32])",
                "kind": "flag"
              },
              {
                "bullets": [
                  "Standing castration แนะนำ **detomidine** เพราะทำให้ซึมได้ผลกว่า xylazine ม้าไม่ค่อยเตะ",
                  "ตารางเป็นเพียงตัวอย่าง การเลือกยาจริงขึ้นกับว่าม้าตัวนั้นต้องซึมมากแค่ไหนและสัตวแพทย์มียาอะไรในมือ รวมถึงค่าใช้จ่ายที่เจ้าของจ่ายไหว"
                ]
              }
            ]
          },
          {
            "sub": "Restraint",
            "body": [
              {
                "bullets": [
                  "Recumbent: ส่วนมากให้นอน **left lateral recumbency** (เอาข้างขวาลงก็ได้) หรือ dorsal recumbency ก็ได้ ขอให้ surgeon เห็น testis ถ้านอนตะแคงแล้วขาหลังประกบกันจะมองไม่เห็น",
                  "นอนตะแคง: **ขาหลังข้างบนถูกผูกและยกขึ้น** เพื่อเปิดให้เห็น testis ใช้เชือกผูกที่ fetlock joint ถ้าจะให้แน่นหนาผูกจาก fetlock joint ขึ้นไปเหนือ hock แล้วให้คนดึงเปิดขาไว้",
                  "คนที่ hold ขารู้ก่อนว่าม้ากำลังจะตื่น เพราะขาจะกระตุกก่อน จึงเตือนให้เติมยาได้ทัน ความปลอดภัยของ surgeon ขึ้นกับคนนี้",
                  "Dorsal recumbency: วางฟ่อนฟางหรือฟ่อนหญ้าประกบ 2 ข้างลำตัวให้ม้านอนหงายได้โดยไม่ไหล",
                  "Standing: ควรทำในซอง มีคนจับหัวอยู่ข้างหน้า และคนประคองลำตัว 2 ข้าง เพราะม้าที่ถูก sedate อาจเซ",
                  "ยกขาหน้าข้างหนึ่งขึ้นทำให้ม้าเตะยากขึ้นเพราะต้องทรงตัวบน 3 ขา แต่ม้าบางตัวยังกระโดดเตะได้"
                ]
              }
            ]
          },
          {
            "sub": "เตรียมบริเวณผ่าตัด",
            "body": [
              {
                "bullets": [
                  "Scrub บริเวณที่จะทำ ถ้าสกปรกมากล้างด้วย chlorhexidine ก่อน แล้ว scrub แบบ sterile ด้วย betadine สลับ alcohol เช็ดวนเป็นก้นหอย",
                  "บริเวณที่มีขนหรือสกปรกต้องเอาออก บริเวณที่ไม่มีขนไม่ต้องโกน"
                ]
              }
            ]
          },
          {
            "sub": "Local anesthesia",
            "body": [
              {
                "bullets": [
                  "ประมาณ **10-15 mL ของ 2% lidocaine** ฉีด **intratesticular**",
                  "อีก **5-10 mL** อาจ infiltrate ที่ **subcutaneous**",
                  "ปริมาณขึ้นกับขนาด testis โดยทั่วไปไม่คำนวณกลับเป็น dose เพราะปริมาณที่ใช้ไม่ถึง toxic dose ของม้า testis ค่อนข้างใหญ่ใช้ราว 15-20 mL ต่อข้าง",
                  "วิธีฉีด: จับ testis ดันให้ตึงอยู่ใน scrotum แทงเข็มตรงเข้าเนื้อ testis แล้วเดินยา เมื่อยาใกล้หมดถอนเข็มขึ้นมาเล็กน้อย แล้วฉีดที่ subcutis หรือ skin ตามแนวที่จะกรีด ราว 5 mL ก็พอ ถ้าถึง 10 mL ตอนกรีดจะกลายเป็นถุงน้ำ",
                  "Standing castration ก็ block แบบเดียวกัน หลัง block ให้ scrub ซ้ำอีกรอบก่อนลงมีด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Open castration technique",
        "source": "Equine reproductive surgery p.8-9; บันทึกคาบ 29 ต.ค. 2569 [20:31-26:30]",
        "body": [
          "ทุกเทคนิคมีหลักการเดียวกันคือเอา testis ออกจากตัวโดยไม่มีเลือดออก",
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "1. กรีด skin ของ scrotum จะเห็นชั้นสีขาวคือ **tunica vaginalis**",
                  "2. **กรีดผ่าน tunica vaginalis** เข้าไปจนเห็นเนื้อ testis เมื่อกรีดแล้ว tunica ร่นขึ้นเหมือนถุงเท้า จะเห็น testis, epididymis และ spermatic cord",
                  "3. tunica vaginalis ยังมีพังผืดยึดกับ cauda epididymis จึงยังผูก cord ไม่ได้: มือหนึ่งรวบ cauda epididymis กับ testis อีกมือ (หรือผู้ช่วย หรือใช้ Allis) ดึงพังผืดให้ห่างออก แล้วตัดพังผืดขึ้นไป spermatic cord จึงเป็นอิสระ",
                  "4. **Ligate spermatic cord** 2-3 เปลาะ cord ไม่ใหญ่ผูกรอบ cord ได้เลยแล้วผูกซ้ำอีกรอบ cord ใหญ่มากให้ **transfix** ก่อน คือปักเข็มผ่านกลาง cord ผูกด้านหนึ่ง แล้วอ้อมรอบทั้ง cord ผูกอีกครั้ง",
                  "5. บางคนใช้ artery forceps หนีบ cord ให้เป็นรอยก่อน แล้วผูกไหมลงบนรอยนั้นให้แน่นขึ้น",
                  "6. ตัด testis ออก **ไม่ต้องเย็บปิด scrotum** ปล่อยเปิดไว้"
                ]
              }
            ]
          },
          {
            "table": {
              "headers": [
                "ด้าน",
                "Open castration technique"
              ],
              "rows": [
                [
                  "**Advantages**",
                  "fast and technically straightforward; can be performed under standing sedation in suitable cases; provides drainage from the surgical site"
                ],
                [
                  "**Disadvantages**",
                  "greater risk of hemorrhage and eventration than techniques that provide additional closure; open wounds may become contaminated; swelling or premature wound closure can impair drainage; return to exercise may be slower"
                ]
              ]
            }
          },
          {
            "bullets": [
              "Standing castration ควรใช้ open technique เพราะไม่ต้องวางยาลึก เปิดแล้วเห็น structure ทั้งหมด ทำเสร็จในไม่กี่นาที",
              "scrotum ที่ไม่ได้เย็บเป็นช่องกว้างให้เลือดที่ค้างระบายออกง่าย ถ้า handle tissue ดีจะไม่ค่อยบวม",
              "ถ้า handle tissue ไม่ดี เนื้อเยื่อบวมจนปากแผลปิดเข้าหากัน แผลหายช้าลง และเกิด **ascending infection** ได้ง่ายกว่า closed technique"
            ]
          }
        ]
      },
      {
        "heading": "Closed castration technique",
        "source": "Equine reproductive surgery p.10-11; บันทึกคาบ 29 ต.ค. 2569 [26:30-29:30]",
        "body": [
          "Closed technique **ไม่เปิด tunica vaginalis**: หลังกรีด skin ต้องเลาะอย่างระวังไม่ให้โดน tunica แล้วรูด fascia ขึ้นไป จะได้ testis กับ spermatic cord ที่ยังมี tunica หุ้มอยู่ จึงไม่มีรูเปิดเข้าสู่ร่างกาย จากนั้น ligate แล้วตัด",
          {
            "table": {
              "headers": [
                "ด้าน",
                "Closed castration technique"
              ],
              "rows": [
                [
                  "**Advantages**",
                  "reduces direct communication with the peritoneal cavity during the procedure; ligature placement improves hemostasis; may reduce the risk of eventration"
                ],
                [
                  "**Disadvantages**",
                  "longer operating time and additional dissection; foreign material may contribute to infection; requires meticulous aseptic technique and appropriate anesthetic conditions"
                ]
              ]
            }
          },
          {
            "bullets": [
              "เหมาะกับม้าที่วางยาสลบได้ลึกและนิ่ง เช่น ทำในโรงพยาบาลที่ maintain ด้วย gas เพราะ fascia ระหว่าง scrotum กับ tunica vaginalis หนาและเหนียว ถ้าเป็นแค่ standing sedation กล้ามเนื้อยังหดตัวได้ จะรูดขึ้นได้ยากมาก",
              "อีกแบบหนึ่ง: เปิด tunica vaginalis เพียงเล็กน้อยให้เห็น testis แต่ตอน ligate ผูกผ่าน tunica vaginalis คล้าย closed technique"
            ]
          }
        ]
      },
      {
        "heading": "Emasculator",
        "source": "Equine reproductive surgery p.12-14; บันทึกคาบ 29 ต.ค. 2569 [29:30-37:03]",
        "body": [
          {
            "bullets": [
              "Emasculator เป็นเครื่องมือช่วยตัด testis ออกที่ spermatic cord นอกเหนือจากการ ligate ด้วยไหม เครื่องมือตอนของโคคือ **Burdizzo** ซึ่งหน้าตาคนละแบบ อย่าเรียกสลับกัน",
              "หลักการ: ง้างแล้วหนีบที่ spermatic cord ตัวเครื่องมือกดเส้นเลือดและเนื้อเยื่อจนเป็นรอย (compress) **หนีบค้างไว้ประมาณ 5 นาที** ส่วนที่เป็นกรรไกรจะตัด testis หลุดออก แล้วจึงเอา emasculator ออก",
              "**Nut-to-nut**: emasculator ใช้ได้ด้านเดียว ด้านที่มีตุ่มแกนของเครื่องมือ (nut) ต้องหันเข้าหา testis ซึ่งนับเป็น nut อีกเม็ดหนึ่ง",
              "Emasculator มี 2 แบบ คือแบบที่ตัดทันที กับแบบที่หนีบค้างไว้ก่อนแล้วค่อยตัด"
            ]
          },
          {
            "sub": "ความเสี่ยงของการใช้ emasculator อย่างเดียว",
            "body": [
              {
                "bullets": [
                  "เครื่องมือที่ใช้มานาน หน้าตัดสึก ความคมลดลง",
                  "ถ้าม้าดิ้นหรือตื่นระหว่างรอ 5 นาทีแล้วเครื่องมือหลุด ตอ spermatic cord จะหดกลับเข้า inguinal canal แล้วเลือดออก",
                  "วิธีที่ปลอดภัยกว่า: ผูก cord ก่อน 1 เปลาะให้มั่นใจว่าห้ามเลือดได้ แล้วจึงหนีบ emasculator และตัด หรือ ligate แล้วตัดโดยไม่ใช้ emasculator เลยก็ได้",
                  "รูป standing castration: หนีบ artery forceps ไว้เหนือ emasculator เผื่อหลุด เมื่อตัด testis ออกแล้วตอ cord ยังไม่หดขึ้นไป จึงค่อยๆ ปล่อยขึ้นพร้อมเช็คว่ามีเลือดออกหรือไม่"
                ]
              }
            ]
          },
          {
            "sub": "Recumbent castration ในภาคสนาม",
            "body": [
              {
                "bullets": [
                  "วาง general anesthesia แล้วประคองหัวให้ม้าค่อยๆ ลงนอน หารองหัวและปิดตาไว้ไม่ให้ม้าตื่นตัว",
                  "ผูกและยกขาเปิดบริเวณผ่าตัด เช็ดทำความสะอาด แล้วกรีดแบบ open",
                  "หนีบ emasculator ค้างไว้ 5 นาทีแล้วปล่อย ทำ 2 ข้างในคราวเดียวหรือทีละข้างก็ได้",
                  "ตัว procedure ใช้เวลาไม่เกิน 10-15 นาที"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Post operative management หลัง castration",
        "source": "Equine reproductive surgery p.15-16; บันทึกคาบ 29 ต.ค. 2569 [37:03-40:31]",
        "body": [
          {
            "sub": "First 6-12 hours",
            "body": [
              {
                "bullets": [
                  "**Closely monitor recovery** จาก sedation หรือ general anesthesia",
                  "ให้ม้าอยู่ใน **clean, safe environment**",
                  "เช็ค **active hemorrhage, progressive swelling, pain** และ **abnormal behavior**",
                  "ประเมิน **vital signs** และ **general clinical condition**"
                ]
              }
            ]
          },
          {
            "sub": "Analgesia",
            "body": [
              "**NSAIDs** ประมาณ **2-3 วัน** ปรับตามสภาพสัตว์และยาที่เลือก"
            ]
          },
          {
            "sub": "Expected course",
            "body": [
              {
                "bullets": [
                  "**Mild swelling** และ **limited drainage** พบได้ในช่วงไม่กี่วันแรก (the first few days)",
                  "Swelling อาจ peak ราว **วันที่ 4-5** โดยเฉพาะหลัง closed castration",
                  "Open wounds **require drainage** และ **gradual activity** ตามความเหมาะสมทางคลินิก",
                  "ให้ **controlled in-hand walking** หรือปล่อยใน small paddock",
                  "**Maintain drainage** และ **observe the surgical site**"
                ]
              }
            ]
          },
          {
            "sub": "รายละเอียดเพิ่มเติม",
            "body": [
              {
                "bullets": [
                  "scrotum ไม่ได้เย็บปิด เลือดจึงระบายออกได้ทั้งหลัง standing และ recumbent เลือดที่หยดเป็นหยดๆ ตั้งแต่วันผ่าจนถึงราว 2 วันหลังผ่าถือว่าไม่มีปัญหา เป็นเลือดจาก capillary",
                  "แผลเป็นแผลเปิด ม้าที่เหนื่อยหรือยังไม่ฟื้นจากยาดีมักล้มตัวลงนอน ถ้าคอกไม่สะอาดเสี่ยง **tetanus** จึงต้องป้องกัน tetanus ก่อนทำ และทุกครั้งที่ผ่าตัดหรือม้ามีแผล",
                  "abnormal behavior ที่พบได้ เช่น ม้าที่ไม่เคยเตะกลับเตะเพราะเจ็บ ไม่ยอมให้ทำแผลหรือเข้าใกล้ แก้ด้วย pain management ที่ดี",
                  "การพาเดินทำให้เนื้อเยื่อบริเวณแผลขยับ เลือดและลิ่มเลือดที่ค้างอยู่ระบายออก แผลหายเร็วขึ้น บางรายให้ lunging วิ่ง trot เบาๆ วันละ 10-15 นาที",
                  "ทำแผลทุกวัน ล้างแผลและพ่น betadine"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Post operative complication หลัง castration",
        "source": "Equine reproductive surgery p.17; บันทึกคาบ 29 ต.ค. 2569 [40:31-42:32]",
        "body": [
          {
            "bullets": [
              "Scrotal swelling",
              "Edema",
              "Hemorrhage",
              "Omental herniation",
              "Eventration",
              "Penile trauma",
              "Bacterial infection of the spermatic cord เรียกอีกชื่อว่า **scirrhous cord** formation",
              "Incisional infections, hydrocele formation และ peritonitis"
            ]
          },
          {
            "bullets": [
              "Bleeding เห็นได้ตั้งแต่ตอนตัด ขึ้นกับว่าผูกแน่นและหนีบดีหรือไม่",
              "ถ้า inguinal canal ไม่แข็งแรงอาจเกิด hernia ส่วนมากที่ออกมาคือ omentum (omental hernia)",
              "ดูแลแผลไม่ดี หรือม้าเอาแผลไปถู เกิด necrotic tissue และ infection ได้"
            ]
          }
        ]
      },
      {
        "heading": "Cryptorchid",
        "source": "Equine reproductive surgery p.18-19; บันทึกคาบ 29 ต.ค. 2569 [42:32-43:31]",
        "body": [
          {
            "bullets": [
              "ตำแหน่งที่ผ่าเปิดขึ้นกับตำแหน่งของ testis: **inguinal cryptorchid** เปิดเข้าที่ inguinal, **abdominal cryptorchid** เปิดเข้าช่องท้อง",
              "การเอา testis ออกเหมือน castration ปกติ คือใช้ emasculator หรือ ligate แล้วตัด",
              "testis ที่อยู่ในช่องท้องปัจจุบันทำผ่าน **laparoscopy** แผลเล็กและทำแบบ standing ได้"
            ]
          }
        ]
      },
      {
        "heading": "Tumor of penis และ penile circumcision (reefing)",
        "source": "Equine reproductive surgery p.20-21; บันทึกคาบ 29 ต.ค. 2569 [43:31-48:01]",
        "body": [
          {
            "bullets": [
              "ปัญหาของ penis ม้าที่พบบ่อยที่สุดคือ tumor",
              {
                "label": "Tumor of penis",
                "value": "sarcoid, melanomas, viral papilloma"
              },
              "tumor ที่เกิดบนตัว penis เองมีได้บ้าง ซึ่งอาจต้องตัด penis ทิ้ง",
              "penis ของม้าเป็นชนิด **musculocavernous** การ erection อาศัยเลือดที่เข้ามาเติม"
            ]
          },
          {
            "sub": "Penile circumcision (reefing)",
            "body": [
              "ตัด preputial tissue หรือ skin ที่มีรอยโรคออกโดยรอบ lesion แล้วดึง healthy tissue margins มาประกบกัน (apposition)",
              {
                "bullets": [
                  {
                    "label": "Surgical objectives",
                    "value": "remove the affected tissue; preserve underlying penile structures; achieve hemostasis; restore tissue continuity through primary closure"
                  },
                  "ก่อนทำต้องประเมินว่า tumor มีรากลึกแค่ไหนและ superficial เพียงใด",
                  "วิธีทำ: กรีดเป็นวงรอบ tumor เลาะออก แล้วดึงเนื้อดี 2 ข้างเข้าหากันและเย็บ"
                ]
              }
            ]
          },
          {
            "sub": "ทำให้ penis ออกมาและตึงพอจะผ่า",
            "body": [
              {
                "bullets": [
                  "penis ของม้าออกมานอก prepuce เมื่อ 1. ปัสสาวะ 2. วางยา 3. จะผสมพันธุ์ การผ่าตัดจึงให้ออกมาด้วยการวางยา",
                  "penis ที่ออกมาเพราะยาจะเหี่ยวและย่น ลงมีดยาก จึงรัด **tourniquet ที่โคน penis** ให้เลือดคั่งพอให้แข็งตัวพอทำงานได้ ไม่รัดจนม่วงหรือเขียว"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Amputation of penis",
        "source": "Equine reproductive surgery p.22-23; บันทึกคาบ 29 ต.ค. 2569 [48:01-52:00]",
        "body": [
          {
            "bullets": [
              "ภาวะที่ทำให้ต้องตัด penis: priapism, laceration, balanoposthitis",
              "ตัดเมื่อ penis ผิดปกติจนกลับเข้า prepuce ไม่ได้ เช่น priapism: penis ที่ค้างอยู่ข้างนอกจะสกปรก ถูกแมลงกัด ถูกถูไถ จนอักเสบที่ glans penis (balanoposthitis) หรือเป็นแผล laceration เมื่อบวมใหญ่ขึ้นก็ยิ่งกลับเข้าไม่ได้และอาจเกิดเนื้อตาย",
              "ในม้าพบน้อยมาก ส่วนมาก detect และรักษาได้ก่อนถึงขั้นต้องตัด"
            ]
          },
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "1. รัด **tourniquet** (ใช้สายยาง) และสอด **catheter เข้า urethra** ไว้เป็น guide",
                  "2. ทำที่ด้าน **ventral**: กรีด skin เป็นรูป **triangle** (ป้าย Skin incision บนรูป A)",
                  "3. กรีดลึกผ่าน skin และ corpus cavernosum urethrae จนเห็น mucosa ของ urethra แล้วกรีด urethra ตามยาว จะเห็น catheter อยู่ข้างใน (รูป C มีป้าย Edge of urethra, Urethra, Corpus cavernosum urethrae, Skin)",
                  "4. เอา catheter ออก (รูป C: Catheter removed at this stage) แล้วเย็บ urethra กับ skin ให้แบะออกจากกัน",
                  "5. ตัดส่วนปลายที่ไม่ต้องการออก",
                  "6. เย็บ corpus cavernosum เข้าหากัน เริ่มจากตรงกลางแล้วไล่ออกทีละข้าง จากนั้นเย็บ urethra ที่แบะออกเข้ากับ skin โดยรอบ",
                  "ปลาย penis ใหม่เป็นรูเปิดที่แบะออก ไม่ใช่หัวแบบปกติ complication คือ **รูเปิดตีบ** จึงต้องติดตามต่อเนื่อง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Caslick's operation",
        "source": "Equine reproductive surgery p.24-27; บันทึกคาบ 29 ต.ค. 2569 [52:00-56:04]",
        "body": [
          "ในเพศเมียส่วนมากทำ Caslick's operation ทำเมื่อเกิด **pneumovagina** ซึ่งมาจาก **poor conformation ของ vulva** ประเมินโดยเทียบตำแหน่ง vulva กับ pelvic floor ลมที่ถูกสูบเข้าไปทำให้เกิด endometritis และ metritis ผสมไม่ติด เป็น minor operation",
          {
            "table": {
              "headers": [
                "แบบ",
                "คำอธิบาย"
              ],
              "rows": [
                [
                  "Normal",
                  "pelvic floor is high in the vagina, forming the **dorsal seal**"
                ],
                [
                  "Abnormal",
                  "when the vagina is drawn forward, over the brim of the pelvis, the dorsal seal is broken"
                ],
                [
                  "Correct Caslick placement",
                  "a Caslick's restores the dorsal seal"
                ]
              ]
            }
          },
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "1. Sedation และ **epidural** แม่ม้าที่ยืนอยู่ไม่ยอมให้กรีดถ้าไม่ชา",
                  "2. พันหาง แล้ว scrub แบบ sterile",
                  "3. **Local infiltration block** ด้วย lidocaine: แทงเข็มไล่ตามแนว labia ตรงรอยต่อระหว่างเนื้อสีชมพูกับ skin สีดำด้านนอก แล้วรอยาออกฤทธิ์",
                  "4. ใช้มีดกรีดตามรอยต่อนั้นให้เป็น **แผลสด** ทั้ง 2 ข้าง",
                  "5. เย็บแผลสด 2 ข้างเข้าหากัน แผลสดกับแผลสดจึงติดกัน นี่คือหลักการของ Caslick จะเย็บ simple interrupted, simple continuous หรือ Ford interlocking ก็ได้",
                  "6. เย็บจากด้านบนลงมา **จนถึงระดับ pelvic floor** (แนวเย็บอยู่ส่วนบนของ vulva ใต้ perineal body ส่วนล่างเปิดไว้)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Perineal laceration 3 ระดับ และ recto-vaginal fistula",
        "source": "Equine reproductive surgery p.28; บันทึกคาบ 29 ต.ค. 2569 [56:04-60:31]",
        "body": [
          "เกิดหลังคลอดลูกหรืออุบัติเหตุ ทำให้ส่วนบนของ vagina และ vulva ฉีกขาด",
          {
            "table": {
              "headers": [
                "ระดับ",
                "ส่วนที่เสียหาย"
              ],
              "rows": [
                [
                  "**First-degree laceration**",
                  "vestibular mucosa และ skin ของ dorsal vulvar commissure"
                ],
                [
                  "**Second-degree laceration**",
                  "dorsal vulvar mucosa, submucosa และ perineal body muscles (commonly constrictor vulvae); **rectum remains intact**"
                ],
                [
                  "**Third-degree laceration**",
                  "ฉีกกว้างถึง vestibular roof, perineal septum และ ventral rectal wall เกิด **communication between the rectum and vestibule**; anal sphincter อาจเสียหายด้วย"
                ]
              ]
            }
          },
          {
            "sub": "หลักการซ่อม",
            "body": [
              {
                "bullets": [
                  "ขาดชั้นไหนก็เย็บปิดชั้นนั้น เย็บเป็นชั้นๆ ขึ้นไป",
                  "แผลอยู่ที่หลังคาของ vagina ซึ่งโค้ง การตักเข็มจึงต้องตักขึ้นแล้วลง กลับกับการเย็บแผลทั่วไปที่ปักลงแล้วขึ้น",
                  "Second-degree: เย็บ dorsal wall ของ vagina แล้วเย็บ perineal muscle แบบ **purse-string**",
                  "Third-degree: เย็บ perineal muscle แบบ purse-string แล้วเย็บอีกชั้นหนึ่งต่อขึ้นไป"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Endoscopic removal ของ endometrial cyst",
        "source": "Equine reproductive surgery p.29; บันทึกคาบ 29 ต.ค. 2569 [60:31-67:30]",
        "body": [
          {
            "bullets": [
              "แม่ม้าอายุมากขึ้นอาจเกิด **endometrial cyst** ตรวจตำแหน่งด้วย ultrasound ก่อน",
              "cyst ที่ยื่นเข้ามาใน lumen ของมดลูกตัดออกได้ ส่วน cyst ที่อยู่ในเนื้อผนังมดลูกตัดออกไม่ได้ ให้ปล่อยไว้",
              "cyst อาจรบกวนการฝังตัวของตัวอ่อน แต่แม่ม้าหลายตัวตั้งท้องได้ทั้งที่มี cyst ถ้าตัวอ่อนไม่ได้ไปฝังตัวตรง cyst",
              "ทำในภาคสนามได้ ใช้เวลาราวครึ่งชั่วโมง"
            ]
          },
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "1. พันหาง sedate เล็กน้อย แล้วสอด endoscope เข้าไปถึงมดลูก ระหว่างทางประเมิน mucosa ของ reproductive tract ได้ทั้งหมด",
                  "2. cyst มี stalk ใช้ **snare** ซึ่งเป็นห่วงไฟฟ้าคล้องที่ stalk แล้วดึงห่วงให้ชิด",
                  "3. ปล่อยกระแสไฟฟ้าตัด มีเลือดออกได้บ้าง แผลหายเอง",
                  "4. น้ำสีเหลืองใน cyst ไหลออกมาในมดลูก ไม่เป็นปัญหา จะถูกขับออกมาเองภายหลัง ดึงเนื้อ cyst ออก",
                  "5. Flush ล้างมดลูกเล็กน้อย และให้ NSAIDs"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Caesarean section",
        "source": "Equine reproductive surgery p.30; บันทึกคาบ 29 ต.ค. 2569 [67:30-74:01]",
        "body": [
          {
            "bullets": [
              "ในม้าทำไม่บ่อย เพราะม้าเกิด dystocia ไม่มาก แต่เกิดได้",
              "ลูกม้าที่ออกมาจาก caesarean section อ่อนแอมาก ต้อง **intensive care**"
            ]
          },
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "1. วางยาสลบ จัดท่า **dorsal recumbency** และ scrub",
                  "2. กรีดเปิดที่ **ventral midline** ถึงมดลูก กรีดมดลูกแล้วดึงลูกออก",
                  "3. เย็บมดลูก แล้วเย็บปิดช่องท้อง",
                  "4. ลูกม้า: สอดท่อทางจมูกเพื่อให้ oxygen เช็ดตัว ยกตัวหรือเขย่าให้ secretion ออก และดูดออก"
                ]
              }
            ]
          },
          {
            "sub": "Caesarean section ที่ไม่ถูกต้อง",
            "body": [
              {
                "bullets": [
                  "เคสม้าแคระใน rural area ที่คลอดไม่ออกและถูกดึงจนช่องคลอดบวมอักเสบมาก ม้าแคระมักมีปัญหา **dystocia** ยิ่งเป็นม้าสาวที่ผสมกับพ่อม้าตัวใหญ่กว่า",
                  "ผ่าเปิดสีข้างแบบที่ทำในโค ซึ่งไม่เหมาะกับม้า เพราะกล้ามเนื้อสีข้างของม้ามีมากกว่า ถ้าเย็บและ handle tissue ไม่ดีจะอักเสบมาก",
                  "ผลของเคสนี้: ลูกตายในท้อง แม่ม้าตายในคืนวันที่ 3 หลังผ่า"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "eqrepro-pregnancy": {
    "topic": "eqrepro-pregnancy",
    "title": "Equine pregnancy and parturition",
    "lecturer": "Sawita Santiviparat",
    "icon": "🐎",
    "summary": "การตั้งท้องและการคลอดของแม่ม้า: early pregnancy กับ PGE2, maternal recognition of pregnancy, endometrial cups กับ eCG และ accessory CL, mid กับ late pregnancy, placentation, ตารางตรวจท้องและการจัดการแฝด, การดูแลแม่ม้าท้อง, เต้านมกับ colostrum และสัญญาณใกล้คลอด จนถึง 3 stages of parturition สไลด์ให้เวลาของ teat waxing และ colostrum ไว้ 2 ชุดที่ไม่ตรงกัน ซึ่งเก็บไว้ทั้งคู่พร้อมเลขหน้า ภาวะผิดปกติระหว่างและหลังคลอดอยู่ในหัวข้อ Postpartum complications ส่วนการดูแลลูกม้าแยกเป็นหัวข้อ Neonatal foal care",
    "sections": [
      {
        "heading": "Early pregnancy (0-40 วัน): oviductal transportation และ PGE2",
        "source": "Equine pregnancy and neonatal care p.2, p.4; บันทึกคาบ 29 ต.ค. 2569 [78:30-81:32, 86:30-88:32]",
        "body": [
          {
            "sub": "Oviductal transportation",
            "body": [
              {
                "bullets": [
                  "**Unfertilized oocyte** ค้างอยู่ใน convoluted folds ของ **oviduct mucosa**",
                  "Equine **embryo** เดินทางตลอด oviduct แล้วเข้า uterus ที่ **day 6-7 post ovulation (morula to early blastocyst)**",
                  "Equine D5-6 embryos secrete **prostaglandin E2**",
                  "Importance for ET: equine embryo expands rapidly",
                  "ลำดับ: ovulation, fertilization, zygote, morula, early blastocyst โดยมี PGE2 ที่รอยต่อ oviduct กับ uterus"
                ]
              }
            ]
          },
          {
            "sub": "ทำไมเฉพาะตัวอ่อนจึงลงมดลูกได้",
            "body": [
              {
                "bullets": [
                  "unfertilized oocyte รูปรีคล้ายลูกรักบี้ ส่วนไข่ที่ผสมแล้วเป็นรูปกลม",
                  "ตัวอ่อนพัฒนาอยู่ใน oviduct ราว 6-7 วัน ปลาย oviduct มี sphincter ที่แข็งแรงมาก ถ้าไม่เปิดอะไรก็ผ่านลงมดลูกไม่ได้",
                  "early blastocyst ราว day 5-6 สร้าง **PGE2** ซึ่งมีฤทธิ์เปิด sphincter นี้ ตัวอ่อน day 7 จึงลงสู่ uterus ได้",
                  "การทำ embryo transfer จึง flush ตัวอ่อนได้ที่ราว **day 6.5-7** คือวันที่ตัวอ่อนลงมาอยู่ในมดลูกแล้ว ตัวอ่อนระยะนี้เล็กมาก ต้องดูผ่าน stereo microscope"
                ]
              }
            ]
          },
          {
            "sub": "Pregnancy development บน ultrasound",
            "body": [
              {
                "bullets": [
                  "ตัวอ่อน days 9-11, day 12, day 14 และ day 16: มี capsule หุ้ม, yolk sac ใหญ่ขึ้นตามวัน และ day 16 เริ่มมี chorion, exocoelom และ amniotic fold",
                  "ถ้า ultrasound ละเอียดพอ เห็นถุงกลมได้ตั้งแต่ราว day 9, day 12 ใหญ่ขึ้น, day 14 เริ่มอยู่กับที่ และ day 16 ใหญ่จนเห็นชัด",
                  "ตรวจท้องครั้งแรกหลังผสมจึงทำราว **day 14-17**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Maternal recognition of pregnancy ในแม่ม้า",
        "source": "Equine pregnancy and neonatal care p.3; บันทึกคาบ 29 ต.ค. 2569 [81:32-86:30]",
        "body": [
          {
            "bullets": [
              "**PGF2α** from uterus causes **CL regression** (luteolysis)",
              "**Embryo migration (day 10-16)** throughout uterus ทำให้ **inhibits PGF2α release**",
              "**Fixation** occurs around **day 16-17 after ovulation**",
              "**Oxytocin ทำให้ PGF2α secretion (Pathway I)**",
              "Pregnant mare: oxytocin receptor expression ลดลง ทำให้ PGF2α release ลดลง",
              "**EPSI (Endometrial Prostaglandin Synthesis Inhibitor)** blocks PGF2α synthesis **(Pathway II)**",
              "Mechanism of luteostasis still not fully understood"
            ]
          },
          {
            "sub": "อธิบายกลไก",
            "body": [
              {
                "bullets": [
                  "ตัวอ่อนที่ลงมาในมดลูกเป็น foreign body เช่นเดียวกับ sperm มดลูกจึงตอบสนองด้วยการปล่อย PGF2α เพื่อขับออก ตัวอ่อนต้องทำให้แม่รับรู้ว่าตั้งท้อง (maternal recognition)",
                  "ในโคสัญญาณนี้คือ interferon แต่ในม้ายังไม่รู้ว่าสารที่เป็น maternal recognition signal คืออะไร",
                  "สิ่งที่รู้คือแม่รับรู้ตัวอ่อนจาก **การ migrate ไปทั่วมดลูก** ซึ่งยับยั้งการปล่อย PGF2α เมื่อ CL ไม่ถูกสลาย progesterone ก็ยังอยู่ การตั้งท้องจึงดำเนินต่อ",
                  "อีกทางคือ endometrial prostaglandin synthesis inhibitor ที่ยับยั้งการสร้าง PGF2α ผลคือ CL คงอยู่เช่นกัน",
                  "ตัวอ่อน migrate ตั้งแต่ลงมาที่ราว day 6.5-7 จนถึงราว day 16 แล้วหยุดอยู่กับที่ (day of fixation) ช่วงที่เป็นได้คือ day 14-17 บางตัวเริ่มหยุดตั้งแต่ day 14"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Endometrial cups, eCG และ accessory CL (35-60 วัน)",
        "source": "Equine pregnancy and neonatal care p.5-6, p.9; บันทึกคาบ 29 ต.ค. 2569 [88:32-92:32]",
        "body": [
          {
            "sub": "Endometrial cup",
            "body": [
              {
                "bullets": [
                  "Specialized **trophoblastic cells** that **invade endometrium**",
                  "Secrete **equine chorionic gonadotropin (eCG)** (formerly PMSG)",
                  "eCG stimulates **secondary corpora lutea** ทำให้ **progesterone เพิ่มขึ้น**",
                  "Maintains pregnancy **until placenta** assumes full endocrine support (~150-200 d)",
                  "Life cycle: form **~35 d**, peak eCG secretion **40-70 d**, regress **~120 d**"
                ]
              }
            ]
          },
          {
            "sub": "Maintenance of early pregnancy",
            "body": [
              {
                "bullets": [
                  "Transuterine **migration**",
                  "**Endometrial cup** formation และ **eCG** production",
                  "Accessory corpus lutea",
                  "eCG ทำให้เกิด **secondary CL** และ **high P4 levels** (only till mid-gestation ~100 day)"
                ]
              },
              {
                "table": {
                  "headers": [
                    "เส้นและแถบในกราฟ",
                    "ค่าโดยประมาณ (แกนนอน days of pregnancy)"
                  ],
                  "rows": [
                    [
                      "แถบ Primary C.L.",
                      "ตั้งแต่ day 0 ถึงราว day 150-160"
                    ],
                    [
                      "แถบ Accessory C.L. และ Endometrial cups",
                      "เริ่มราว day 40; endometrial cups ถึงราว day 140, accessory C.L. ถึงราว day 160"
                    ],
                    [
                      "แถบ Foetal gonads",
                      "ราว day 130 ถึงใกล้คลอด กว้างสุดราว day 240"
                    ],
                    [
                      "Progesterone (plasma, ng/ml)",
                      "มียอดเล็กช่วงแรก แล้วขึ้นสูงสุดราว day 60-80 จากนั้นลดลงต่ำตั้งแต่ราว day 160 และขึ้นอีกเล็กน้อยก่อน parturition"
                    ],
                    [
                      "eCG (serum, i.u./ml)",
                      "เริ่มขึ้นราว day 40 สูงสุดราว day 60-70 แล้วลดจนหมดราว day 140"
                    ],
                    [
                      "FSH",
                      "ขึ้นลงเป็นคลื่นถี่ๆ ตั้งแต่ต้นจนราว day 100"
                    ],
                    [
                      "Oestrogens (plasma conjugated oestrogens, ng/ml)",
                      "เริ่มขึ้นราว day 80-100 สูงสุดราว day 240 แล้วลดลงจนถึง parturition"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ทำไมต้องมี CL ชุดที่ 2",
            "body": [
              {
                "bullets": [
                  "หลัง day of fixation, CL เดิมยังสร้าง progesterone ต่อ แต่เมื่อผ่านไปราว 1 เดือน CL เริ่มเสื่อม progesterone จะลดลง ซึ่งถ้าลดลงเรื่อยๆ ลูกอยู่ไม่ได้",
                  "ราว day 35-40 trophoblastic cells ฝังลึกลงใน endometrium เป็น **endometrial cup** และหลั่ง **eCG** ซึ่งออกฤทธิ์คล้าย LH",
                  "follicle ที่มีอยู่บนรังไข่จึงโตและตก เกิด CL ใหม่ เรียกว่า **accessory CL** หรือ **secondary CL** ทำหน้าที่ maintain การตั้งท้องต่อจนกว่า endometrial cup จะสลาย",
                  "endometrial cup อยู่ตั้งแต่ราว day 35 ถึง day 70 อย่างมากราว 100 วันเศษ และเริ่มสลายราว day 120"
                ]
              }
            ]
          },
          {
            "sub": "พัฒนาการของรก",
            "body": [
              {
                "bullets": [
                  "28-30 days: allantochorion, amnios และ yolk sac",
                  "36-38 days: **chorionic girdle trophoblasts** invading endometrial stroma",
                  "45-60 days: **endometrial cup** จาก invasive trophoblasts (endometrial cup trophoblasts ล้อมด้วย maternal leukocytes ใน endometrial stroma) ส่วน non invasive trophoblasts คือ allantochorion trophoblasts ที่แนบกับ endometrial epithelium",
                  "100 ถึง 320-360 days: **allantochorion** ซึ่งเป็น the definitive form of equine placenta มี microcotyledons, fetal vessels, uterine epithelium, uterine artery, uterine vein, uterine gland และ openings of uterine glands"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mid pregnancy (40-180 วัน) และ placentation",
        "source": "Equine pregnancy and neonatal care p.7, p.15; บันทึกคาบ 29 ต.ค. 2569 [92:32-94:34, 96:31-98:01]",
        "body": [
          {
            "sub": "Mid pregnancy",
            "body": [
              {
                "bullets": [
                  "**Organogenesis** completed ~60-90 d",
                  "**Placenta development** continues; **diffuse epitheliochorial**",
                  "CL remains primary progesterone source until **~150 d**",
                  "**High oestrogen (from gonad and placenta)**: placental aromatization of dehydroandrosterone (DHA), dehydroepiandrosterone (DHEA)",
                  "**5-alpha pregnanes (progestagen)**",
                  "Unusual type of oestrogen: the rare Ring-B unsaturated oestrogen is produced **from fetal ovaries**",
                  "5α-pregnanes (ng/ml): ค่อยๆ สูงขึ้นตลอดการตั้งท้องอยู่ในช่วงราว 1-4 ng/ml แล้วพุ่งขึ้นถึงราว 8 ng/ml ใน 30 วันสุดท้ายก่อนคลอด และตกลงทันทีที่วันคลอด"
                ]
              }
            ]
          },
          {
            "sub": "Progesterone support 3 ช่วง และ oestrogen จากลูก",
            "body": [
              {
                "bullets": [
                  "ราว day 40 ถึง day 180 รกพัฒนาขึ้น รกของม้าเป็นแบบ diffuse, epitheliochorial และเป็น microcotyledon",
                  "การ maintain progesterone ในม้ามี 3 รอบ: 1. **primary CL** 2. ช่วง **endometrial cup** (accessory CL) 3. **รก** ซึ่งทำหน้าที่ต่อจนสิ้นสุดการตั้งท้อง",
                  "อวัยวะแรกที่เห็นคือหัวใจ บางตัวเห็นหัวใจเต้นตั้งแต่ราว day 20-22 ส่วนอวัยวะอื่น เช่น ซี่โครง เห็นชัดช่วงกลางของการตั้งท้อง",
                  "ช่วงนี้ตรวจฮอร์โมนของแม่พบ oestrogen สูง ทั้งที่แม่ไม่ควรมี follicle พัฒนาแล้ว เพราะในม้า **oestrogen นี้มาจากลูก**"
                ]
              }
            ]
          },
          {
            "sub": "Placentation",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Type",
                    "value": "**diffuse, epitheliochorial**, non-deciduate placenta"
                  },
                  {
                    "label": "Shape",
                    "value": "entire surface of the chorion forms **microcotyledons** attaching to the endometrium"
                  },
                  {
                    "label": "Amnion",
                    "value": "surrounds the fetus, filled with amniotic fluid"
                  },
                  {
                    "label": "Allantois",
                    "value": "fuses with chorion เป็น **allantochorion (main exchange surface)**"
                  },
                  {
                    "label": "Yolk sac",
                    "value": "functional early, regresses later"
                  },
                  {
                    "label": "Unique feature",
                    "value": "**microcotyledonary structure** increases surface area for exchange"
                  }
                ]
              },
              "ช่วงท้ายของการตั้งท้อง ultrasound วัดความหนาของรกได้ที่มุมสามเหลี่ยมตรงรอยต่อ cervix กับมดลูก และดูลักษณะของรกว่าอักเสบหรือไม่ รกที่อักเสบมักมีน้ำแทรก ถ้าหนาเกินราว 1-2 ซม. ให้สงสัย placentitis"
            ]
          }
        ]
      },
      {
        "heading": "Late pregnancy (180-340 วัน) และ length of gestation",
        "source": "Equine pregnancy and neonatal care p.8, p.14; บันทึกคาบ 29 ต.ค. 2569 [94:34-96:31, 107:32-108:30]",
        "body": [
          {
            "sub": "Late pregnancy",
            "body": [
              {
                "bullets": [
                  "**Rapid fetal growth, skeletal ossification**",
                  "Fetal **movement** palpable ~180 d",
                  "**Mammary development** begins; teats enlarge; colostrum formation 1-2 wks prepartum"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่เห็นในแม่ม้าช่วงท้าย",
            "body": [
              {
                "bullets": [
                  "แม่ม้ากล้ามเนื้อหนา ช่วงต้นถึงกลางของการตั้งท้องจึงดูจากภายนอกไม่ออกว่าท้อง บางตัวถูกใช้งานจนถึงวันคลอดเพราะเจ้าของไม่รู้",
                  "ช่วงท้ายลูกโตเร็วมาก ท้องขยายเร็ว และ ultrasound เห็นลูกดิ้น",
                  "ราว 1-2 สัปดาห์ก่อนคลอดเห็นเต้านมเริ่มขยาย",
                  "แม่ม้าช่วงนี้สงบลงเพราะ progesterone สูง"
                ]
              }
            ]
          },
          {
            "sub": "Length of gestation",
            "body": [
              {
                "bullets": [
                  "**335-342 days**",
                  "**<320 days: premature**",
                  "**<300 days: abortion**",
                  "Full term foals with characteristics of premature foals ก็พบได้",
                  "ม้าตั้งท้องประมาณ 11 เดือน ราว 330-340 วัน ลูกที่คลอดก่อน 320 วันอาจรอดได้ถ้าได้ intensive care ส่วนที่หลุดออกมาก่อน 300 วันไม่มีทางรอดเพราะปอดยังไม่พร้อม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Routine pregnancy checks และ twin management",
        "source": "Equine pregnancy and neonatal care p.10-11; บันทึกคาบ 29 ต.ค. 2569 [98:01-101:01]",
        "body": [
          {
            "bullets": [
              "**Ovulation check**: หลัง insemination; ดูว่าไข่ตกหรือยัง",
              "**1st pregnancy check**: **prior to day of fixation (D16)** มักเป็น **day 14** ของ cycle; twin management",
              "**2nd pregnancy check**: around **22-30 days**; ตรวจ **fetal viability (HB) and development**",
              "**3rd pregnancy check**: **post endometrial cup formation**",
              "**Sex determination**: **59 to 68 days**"
            ]
          },
          {
            "bullets": [
              "ครั้งที่ 1 ตรวจช่วง day 14-16 เพราะต้องเช็คแฝด ม้าตกไข่ 2 ใบพร้อมกันได้ ถ้าพบแฝดให้จัดการทันที",
              "ครั้งที่ 2 ช่วง day 20-30 เริ่มมีหัวใจแล้ว ตรวจว่าลูกยังอยู่และหัวใจยังเต้น",
              "ครั้งที่ 3 ตรวจหลังจาก endometrial cup สลายไปแล้ว ราวเดือนที่ 3-4 เพื่อดูว่ารกสร้างได้สมบูรณ์",
              "ถ้าไม่มีอะไรผิดปกติ ปล่อยยาวแล้วกลับมา monitor อีกครั้งตอนใกล้คลอด",
              "ดูเพศได้ราว day 60 แต่ทำยากเพราะต้อง ultrasound ผ่านหน้าท้อง"
            ]
          },
          {
            "callout": "สไลด์ p.10 พิมพ์ว่า third pregnancy check ทำ post endometrial cup formation แต่ในบันทึกคาบ 29 ต.ค. 2569 [99:02-99:31] ตรวจครั้งที่ 3 หลัง endometrial cup สลายแล้ว ราวเดือนที่ 3-4 ต่างกัน",
            "kind": "flag"
          },
          {
            "sub": "Twin management",
            "body": [
              {
                "table": {
                  "headers": [
                    "ช่วง",
                    "วิธี"
                  ],
                  "rows": [
                    [
                      "**Early pregnancy: before day of fixation (D16)**",
                      "easy to destroy the twin"
                    ],
                    [
                      "**Before formation of the endometrial cup**",
                      "twin crushing โดย U/S to select the conceptus; PGF2 alpha; nutritional deprivation"
                    ],
                    [
                      "**After formation of the endometrial cup**",
                      "nutritional deprivation (poor result); ultrasound guided twin puncture (50% success rate); fetal decapitation, cervical dislocation"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ราว day 14-15 ถ้าพบแฝดให้รีบบีบทิ้ง 1 ถุง เมื่อถึง day 16 ตัวอ่อนเริ่ม fix แล้วจะบีบยากขึ้น",
                  "ยิ่งปล่อยให้โตยิ่งจัดการยาก อาจต้องแทงเข็มผ่านทาง vagina เข้าหัวใจลูกเพื่อฉีด KCl หรือดูดออก",
                  "แฝดที่ไม่ได้จัดการสุดท้ายจะหลุดออกมา ตัวอย่างคือแฝดที่แท้งตอน 7 เดือนเพราะไม่รู้ว่าเป็นแฝด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Routine care of pregnant mare",
        "source": "Equine pregnancy and neonatal care p.12-13; บันทึกคาบ 29 ต.ค. 2569 [101:01-107:32]",
        "body": [
          {
            "sub": "Stable",
            "body": [
              {
                "bullets": [
                  "**Avoid stress** from moving horses in/out",
                  "**Restriction a new horse** to enter the stable โดยเฉพาะเพื่อป้องกัน infectious diseases",
                  "Enter mares into foaling barn **30 days before expected foaling date**"
                ]
              }
            ]
          },
          {
            "sub": "Monitoring",
            "body": [
              {
                "bullets": [
                  "**Open Caslick's sutures** เมื่อเห็น signs of **waxing** หรือ **2 weeks before expected foaling date**",
                  "**Monitor** mares **twice a day** for **vulvar discharge** and **udder development**",
                  "Mares with **premature udder development** should be monitored for **placentitis**"
                ]
              }
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
                  "**Nutrition**",
                  "gradually increase energy/protein/minerals in **mid-late pregnancy**; ad libitum water"
                ],
                [
                  "**Deworming**",
                  "**2-3 times during gestation**; avoid teratogenic drugs early"
                ],
                [
                  "**Vaccination**",
                  "Tetanus, **EHV-1 (abortigenic)**, influenza, WEE/EEE, WNV, rabies"
                ],
                [
                  "**Exercise**",
                  "**light to moderate**; avoid trauma, stress, strenuous work"
                ]
              ]
            }
          },
          {
            "sub": "เหตุผลของแต่ละข้อ",
            "body": [
              {
                "bullets": [
                  "แยกแม่ม้าท้องออกจากฝูงมาอยู่คอกที่สะอาดและสงบ ความเครียดทำให้แท้งได้ บางฟาร์มปล่อยรวมฝูงจนเหลือ 1-2 เดือนก่อนคลอดจึงแยก",
                  "แม่ม้าที่เย็บ Caslick's ไว้ต้องตัดเปิดก่อนคลอด ไม่อย่างนั้นตอนคลอดจะฉีกมากขึ้น",
                  "ตรวจว่ามี secretion หนอง หรือเลือดออกจาก vulva หรือไม่ และเต้านมพัฒนาก่อนเวลาหรือไม่ ซึ่งบ่งถึง placentitis และต้องรีบแก้ไข",
                  "อาหาร: เพิ่ม protein และพลังงาน เน้น minerals ช่วงแรกยังไม่ต้องเพิ่มมาก เพิ่มช่วงกลางถึงท้ายเมื่อลูกโตเร็วและดึง calcium จากแม่ไปสร้างร่างกาย ต้องมีน้ำสะอาด",
                  "ถ่ายพยาธิเพื่อไม่ให้พยาธิไปถึงลูก และลดโอกาสเกิด colic ซึ่งถ้าต้องผ่าตัดขณะท้องจะอันตรายมาก",
                  "วัคซีนทำช่วงท้ายของการตั้งท้อง เพราะต้องการให้ภูมิไปถึงลูกในวันคลอด ถ้าทำตั้งแต่ต้นภูมิจะตกก่อน tetanus ทำราวเดือนที่ 10-11",
                  "ออกกำลังได้ แต่โดยทั่วไปลดการใช้งานลง เพราะงานหนักเสี่ยงอุบัติเหตุและแท้ง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mammary gland, colostrum และสัญญาณใกล้คลอด",
        "source": "Equine pregnancy and neonatal care p.8, p.16-17; บันทึกคาบ 29 ต.ค. 2569 [102:30-104:02, 108:30-111:02, 115:00-116:03]",
        "body": [
          {
            "sub": "Mammary gland and colostrum development",
            "body": [
              {
                "bullets": [
                  "Detectable **4-6 wks prepartum**",
                  "**Teat waxing: 1-2 wks prepartum**",
                  "**Colostrum IgG** concentration: **highest 12-24 h prepartum**",
                  "Milk electrolytes: **Na ลดลง, K/Ca/Mg เพิ่มขึ้น**",
                  "Strip test or colostrometer predicts readiness"
                ]
              }
            ]
          },
          {
            "sub": "Physio-anatomical changes prior to parturition",
            "body": [
              {
                "bullets": [
                  "Parturition = foaling",
                  "Usually occurs **at night (>90%)**",
                  "**Sacrosciatic ligament relaxation** และ **vulvar edema/relaxation (~50%)**",
                  "Most reliable indicator: **udder development** in last month; **colostrum production** 2-3 weeks before foaling; **waxing of teats** 2-3 days before foaling",
                  "Changes of milk composition: เมื่อ **calcium สูงกว่า 200 ppm** จะคลอดภายใน 24 h 50% และภายใน 72 h 97%",
                  "ช่วงก่อนคลอด (days from foaling): milk Ca สูงขึ้นชันตั้งแต่ราว 2 วันก่อนคลอด; milk Mg และ milk K สูงขึ้นจนถึงยอดช่วงวันคลอดแล้วลดลงหลังคลอด; milk Na ลดลงเรื่อยๆ จนต่ำหลังคลอด; ค่าใน serum ของทั้ง 4 ตัวแทบไม่เปลี่ยน"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้เวลาไว้ 2 ชุดที่ไม่ตรงกัน Teat waxing: p.16 พิมพ์ 1-2 wks prepartum แต่ p.17 พิมพ์ 2-3 days before foaling Colostrum: p.8 พิมพ์ colostrum formation 1-2 wks prepartum แต่ p.17 พิมพ์ colostrum production 2-3 weeks before foaling ในบันทึกคาบ 29 ต.ค. 2569 น้ำนมเริ่มไหลราว 1-2 สัปดาห์ก่อนคลอด (บันทึกคาบ 29 ต.ค. 2569 [103:00, 115:31]) และ wax ที่หัวนมเห็นราว 2-3 วันก่อนคลอด (บันทึกคาบ 29 ต.ค. 2569 [110:02])",
            "kind": "flag"
          },
          {
            "sub": "การเฝ้าดูแม่ม้าใกล้คลอด",
            "body": [
              {
                "bullets": [
                  "ม้ามีนม 2 เต้า ให้ก้มดูและคลำว่าเต้าเริ่มบวมและมีน้ำนมไหลหรือยัง น้ำนมไหลก่อนคลอดราว 1-2 สัปดาห์ ถ้าไหลก่อนหน้านั้นมากถือว่าผิดปกติ",
                  "**Teat waxing** คือน้ำนมที่ไปเคลือบแห้งอยู่ปลายหัวนม เมื่อเห็นแปลว่าใกล้คลอดมากแล้ว",
                  "รีดนมมาตรวจ IgG ได้ล่วงหน้า และตรวจ electrolytes ในนมเพื่อทำนายวันคลอด ใช้ชุด strip test แบบที่วัด calcium และ magnesium ในน้ำก็ได้ ถ้า calcium เกิน 200 ppm ราว 50% จะคลอดใน 24 ชั่วโมง",
                  "ม้าคลอดกลางคืนราว 90% จึงต้องจัดเวรเฝ้าหรือใช้กล้องวงจรปิดตั้งแต่ 2-3 สัปดาห์ถึง 1 เดือนก่อนกำหนดคลอด",
                  "ราว 1-2 สัปดาห์ก่อนคลอด sacrosciatic ligament หย่อน สะโพกจากที่เคยตึงจะยุบลง และ vulva บวมน้ำมากขึ้น"
                ]
              },
              {
                "callout": "การรับภูมิคุ้มกันของลูกม้า (Immunity transfer ฝั่งขวาของ p.16) และการดูแลลูกม้าหลังคลอด อยู่ในหัวข้อ Neonatal foal care and common abnormalities ซึ่งเขียนจากชุดสไลด์เดียวกัน",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Stages of parturition",
        "source": "Equine pregnancy and neonatal care p.18; บันทึกคาบ 29 ต.ค. 2569 [111:02-120:33]",
        "body": [
          {
            "bullets": [
              "**Stage I**: initial of myometrial contraction; **10 min-4 hour**; cervical dilation, uterine contraction, abdominal discomfort; restlessness, walking, frequent urination, sweating; **end with the rupture of chorio-allantois**",
              "**Stage II**: expulsion of fetus; **5-30 min**; uterine contraction, severe abdominal contraction, limbs extended; presented foal intact amnion แล้ว expulsion of foal; intact umbilical cord broken naturally **within 6-8 mins** after foaling, should be left intact as long as possible",
              "**Stage III**: expulsion of fetal membrane; **within 3 hour**; ถ้า **> 3 hour: retained placenta**"
            ]
          },
          {
            "sub": "รายละเอียดเพิ่มเติม",
            "body": [
              {
                "bullets": [
                  "ท่าคลอดที่ถูกต้องของม้าคือ **anterior presentation เท่านั้น** ปลายเท้าหน้า 2 ข้างออกมาก่อน",
                  "Stage I: ลูกเป็นฝ่ายส่งสัญญาณ ทำให้เกิด oxytocin และมดลูกบีบตัว แม่ม้าจึงไม่สบายตัว ลุกขึ้นลุกลง เดินวน เหงื่อแตก ปัสสาวะและถ่ายบ่อย ยกหาง",
                  "Stage I จบเมื่อน้ำแตก คือ allantochorion แตก จากนั้นเห็นถุง **amnion** ที่มีขาลูกอยู่ข้างในโผล่ออกมา เป็นการเข้าสู่ stage II",
                  "ระหว่าง stage I **ห้ามเข้าไปยุ่งกับแม่ม้า** เพราะแม่ม้าตกใจแล้ว stage I จะยืดออก เข้าช่วยได้เมื่อเข้า stage II และถ้าลูกไม่ออกจึงช่วยดึง",
                  "แม่ม้าคลอดได้ทั้งท่ายืนและท่านอน ตอนลูกออก dorsal commissure ของ vulva อาจฉีกขึ้นไปได้",
                  "ลูกที่คลอดเองตามธรรมชาติแข็งแรงกว่าลูกจาก caesarean section และได้รับ probiotics จาก vagina ของแม่",
                  "Stage III ใช้เวลาราว 3 ชั่วโมง เกินกว่านั้นถือเป็น retained placenta ซึ่งในม้าพบไม่บ่อยแต่มีได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hormonal regulation และสรุปของส่วนแม่ม้า",
        "source": "Equine pregnancy and neonatal care p.26; บันทึกคาบ 29 ต.ค. 2569 [132:30-133:31]",
        "body": [
          {
            "bullets": [
              "Gestation **~340 days**; routine monitoring is essential",
              "**Endometrial cups** produce **eCG** ทำให้เกิด **secondary CL** และ **progesterone support in early pregnancy**",
              "**Mammary development** และ **colostrum preparation** begin **late gestation**",
              "Hormonal regulation: **Progesterone, Estrone sulfate, Relaxin, PGF2α, Oxytocin**",
              "**Normal parturition** occurs in **three stages**; monitor for complications",
              "Routine care: **nutrition, deworming, vaccination, exercise, monitoring**"
            ]
          },
          {
            "bullets": [
              "mammary gland ควรพัฒนาช่วง late gestation ถ้าเต้านมพัฒนาตั้งแต่ราว 5 เดือนต้องหาสาเหตุว่าผิดปกติ",
              "estrone sulfate มาจากลูก ส่วน relaxin เกี่ยวข้องช่วงใกล้คลอด"
            ]
          }
        ]
      }
    ]
  },
  "eqrepro-postpartum": {
    "topic": "eqrepro-postpartum",
    "title": "Postpartum complications",
    "lecturer": "Sawita Santiviparat",
    "icon": "🩹",
    "summary": "ความผิดปกติระหว่างคลอดและปัญหาหลังคลอดของแม่ม้า เริ่มจากสิ่งที่ต้องตรวจในแม่ม้าหลังคลอด (รก, นม, vulva, การยอมรับลูก) แล้วไล่ 9 ภาวะของ intrapartum conditions: red bag, abortion, uterine inertia, premature mammary development, placental insufficiency, post-partum hemorrhage, uterine torsion, retained fetal membrane และ hypocalcemia ต่อด้วย dystocia (เมื่อไรควรสงสัย, สาเหตุ, วิธีแก้) และ post partum breeding ที่ foal heat การตั้งท้องและ 3 stages ของการคลอดปกติอยู่ในหัวข้อ Pregnancy & parturition ส่วนการดูแลลูกม้าแยกเป็นหัวข้อ Neonatal foal care",
    "sections": [
      {
        "heading": "Post-parturition check ของแม่ม้า",
        "source": "Equine pregnancy and neonatal care p.19; บันทึกคาบ 29 ต.ค. 2569 [120:33-124:32]",
        "body": [
          {
            "table": {
              "headers": [
                "ตรวจ",
                "ดูอะไร"
              ],
              "rows": [
                [
                  "**Placenta**",
                  "รกออกครบหรือไม่ (amnion และ allantois)"
                ],
                [
                  "**Colostrum**",
                  "milk letdown, colostrum, ปริมาณและสีของนม"
                ],
                [
                  "**Vulva**",
                  "ความผิดปกติของ vulvovestibular tract"
                ]
              ]
            }
          },
          {
            "bullets": [
              "หลังคลอดต้องเข้าไปตรวจแม่เสมอ แม้เจ้าของแจ้งว่าคลอดแล้ว สิ่งแรกที่ต้องถามคือ **รกออกหรือยัง และออกครบหรือไม่** นำรกมากางดูให้ครบทุกส่วน",
              "ดูว่าแม่มีนมหรือไม่ และนมใส เหลือง หรือขาว แม่ที่คลอดก่อนกำหนดอาจมีแต่นมใส ยังไม่ใช่ colostrum จึงต้องวางแผนว่าจะให้อะไรแก่ลูก",
              "ดู vulvovestibular tract ว่าฉีกหรือไม่ รอยฉีกที่ **ไม่ถึง rectum ไม่ต้องรีบซ่อม** เพราะเนื้อเยื่อยังบวมมาก ทิ้งไว้เป็นสัปดาห์หรือเป็นเดือนแล้วค่อยแก้ได้ ไม่อันตรายถึงชีวิต แต่ถ้าฉีก **ถึง rectum ต้องแก้**",
              "ดูว่าแม่ยอมรับลูกและเลี้ยงลูกหรือไม่ แม่สาวท้องแรกบางตัวไม่รู้จักลูก รู้สึกว่าลูกทำให้เจ็บ อาจปฏิเสธหรือทำร้ายลูก แม่ที่ยอมรับจะดม เลีย และทำ flehmen เพื่อรับกลิ่นของลูก"
            ]
          },
          {
            "callout": "p.19 พิมพ์ว่าเยื่อที่ต้องออกครบคือ amnion กับ allantois แต่บันทึกคาบ 29 ต.ค. 2569 [121:01] เรียกว่า amnion กับ chorion ส่วน red bag ใช้คำว่า allanto-chorion",
            "kind": "flag"
          },
          {
            "callout": "การดูแลลูกม้า (กฎ 1-2-3, milestones, ลูกม้ากำพร้า, ความผิดปกติของลูกม้าแรกเกิด และ neonatal isoerythrolysis) อยู่ในหัวข้อ Neonatal foal care and common abnormalities",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Intrapartum conditions 1: red bag, abortion และ uterine inertia",
        "source": "Equine pregnancy and neonatal care p.20; บันทึกคาบ 29 ต.ค. 2569 [124:02-126:00]",
        "body": [
          {
            "sub": "Red bag",
            "body": [
              {
                "bullets": [
                  "**Premature separation of the allanto-chorion**",
                  "**No rupture of chorioallantois at cervical star**",
                  "พบถุงเนื้อกำมะหยี่สีแดง (**velvety red sac**) ที่ริม vulva โดยถุงยังไม่แตก (intact)",
                  "เป็น **emergency** ต้องรีบช่วยทันที สาเหตุที่ยกมา: ไวรัส, การติดเชื้อ, การอักเสบ"
                ]
              }
            ]
          },
          {
            "sub": "Abortion",
            "body": [
              {
                "bullets": [
                  {
                    "label": "อาการ",
                    "value": "vaginal discharge, premature mammary development"
                  },
                  {
                    "label": "การตรวจ",
                    "value": "U/S ของลูก, hormonal assays, หาโรคติดเชื้อ (infectious dz.)"
                  },
                  "ตัวอย่าง: ลูกที่คลอดก่อนวัยอันควรเมื่อราว 5 เดือนของการตั้งท้อง"
                ]
              }
            ]
          },
          {
            "sub": "Uterine inertia",
            "body": [
              {
                "bullets": [
                  "แม่พยายามคลอดและถุงน้ำออกหมดแล้ว แต่มดลูกเฉื่อย เบ่งลูกออกไม่หมด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Intrapartum conditions 2: premature mammary development, placental insufficiency และ post-partum hemorrhage",
        "source": "Equine pregnancy and neonatal care p.21; บันทึกคาบ 29 ต.ค. 2569 [126:00-130:02]",
        "body": [
          {
            "sub": "Premature mammary development",
            "body": [
              {
                "bullets": [
                  "**Early udder filling**",
                  "อาจบ่งชี้ **placental dysfunction**",
                  "ปกติเต้านมพัฒนาราว 1-2 สัปดาห์ก่อนคลอด ถ้านมไหลก่อนหน้านั้นให้ ultrasound ดูรกทันที เพราะสัมพันธ์กับ **placentitis**",
                  "ตัวอย่าง: แม่ม้าท้อง 7 เดือนมีนมไหล ultrasound พบรกหนาและมีน้ำแทรก คือ placentitis ต้องรีบจัดการ ไม่เช่นนั้นลูกจะไม่รอด"
                ]
              }
            ]
          },
          {
            "sub": "Placental insufficiency",
            "body": [
              {
                "bullets": [
                  "**Premature mammary development, abnormal colostrum**",
                  "U/S: **thickened placenta, fetal growth retardation**",
                  "Supportive care, monitoring fetal distress"
                ]
              }
            ]
          },
          {
            "sub": "Placentitis: ยาที่ใช้",
            "body": [
              {
                "bullets": [
                  "ยาลดการอักเสบที่เลือกใช้ได้ในแม่ม้าท้องคือกลุ่ม **selective COX-2** เพราะ COX-2 เกี่ยวกับ inflammation โดยตรง และไม่ไปกดการสร้าง progesterone",
                  "รกที่อักเสบสร้าง progesterone ได้ไม่ดี จึง **เสริม progesterone** ชนิดป้อนปากควบคู่กัน ให้ต่อเนื่องจนรกกลับมาดูปกติ และให้ต่อไปจนถึงวันคลอด"
                ]
              }
            ]
          },
          {
            "sub": "Post-partum hemorrhage",
            "body": [
              {
                "bullets": [
                  {
                    "label": "อาการ",
                    "value": "**vaginal bleeding**"
                  },
                  {
                    "label": "การตรวจ",
                    "value": "ตรวจพบได้ด้วย U/S และอาการทางคลินิก"
                  },
                  {
                    "label": "Tx",
                    "value": "fluid, uterotonics, surgery ถ้ารุนแรง"
                  },
                  "เกิดได้จากหลายสาเหตุ จึงต้องเฝ้าดูว่ามีสิ่งผิดปกติไหลออกจาก vulva หรือไม่"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Intrapartum conditions 3: uterine torsion, retained fetal membrane และ hypocalcemia",
        "source": "Equine pregnancy and neonatal care p.22; บันทึกคาบ 29 ต.ค. 2569 [129:30-130:32, 113:01-115:00]",
        "body": [
          {
            "bullets": [
              "**Uterine torsion**: colic, tachycardia; Dx: U/S, rectal palpation; รักษา: surgery, C-section /",
              "**Retained fetal membrane**: รกค้างเกิน 3 ชั่วโมง, กลิ่นเหม็น; clinical observation; รักษา: oxytocin, ABO, manual removal /",
              "**Hypocalcemia**: weakness, tremor, recumbency; blood calcium test; รักษา: calcium gluconate ช้าๆ ทาง IV"
            ]
          },
          {
            "bullets": [
              "Uterine torsion เกิดได้เมื่อลูกตัวใหญ่มากและแม่พลิกตัวกลิ้งไปมา แล้วมี colic ต้องรีบแก้",
              "Hypocalcemia เกิดได้เพราะการคลอดใช้ calcium สูงในการบีบตัวของ myometrium",
              "รกที่ไม่ออกเกิน 3 ชั่วโมงถือเป็น retained placenta พบไม่บ่อยในม้าแต่มีได้ รายที่ถูกทิ้งไว้ 3 วันรกเน่า สิ่งที่ล้างออกมาเป็นเลือดปนหนอง"
            ]
          },
          {
            "sub": "การล้างมดลูกหลังคลอด",
            "body": [
              {
                "bullets": [
                  "cervix หลังคลอดกว้างมาก ท่อล้างแบบมี balloon ค้างอยู่ไม่ได้",
                  "ใช้สายยางใหญ่แบบสายสอดกระเพาะใส่เข้าไป แล้วใช้วิธีกาลักน้ำดูดออก",
                  "รายที่ยกมาใช้น้ำเกลือล้างราว 40 L"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dystocia",
        "source": "Equine pregnancy and neonatal care p.23-25; บันทึกคาบ 29 ต.ค. 2569 [130:32-132:30]",
        "body": [
          {
            "bullets": [
              "**Difficult to give birth**",
              "สาเหตุที่พบบ่อยที่สุดคือ **abnormal orientation of the fetus within the birth canal**",
              "พบในม้าได้แต่ไม่บ่อย"
            ]
          },
          {
            "sub": "สงสัยว่าคลอดยาก (prolong) เมื่อ",
            "body": [
              {
                "bullets": [
                  "**1st stage of parturition: มากกว่า 45-90 นาที**",
                  "**2nd stage of parturition: มากกว่า 20 นาทีโดยลูกไม่มีการเคลื่อนไหว**",
                  "**เห็นขาลูก 2 ข้างอยู่ที่ vulva อย่างเดียวและไม่คืบหน้า**",
                  "Colic sign และ forceful straining"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุจากแม่",
            "body": [
              {
                "bullets": [
                  "Uterine inertia",
                  "Failure of abdominal force",
                  "Obstruction of birth canal: incomplete cervical dilation; uterine rupture; deviation of uterus"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุจากลูก",
            "body": [
              {
                "bullets": [
                  "Malposition",
                  "Fetal oversize",
                  "Congenital foal abnormality"
                ]
              }
            ]
          },
          {
            "sub": "Technique for solving dystocia",
            "body": [
              {
                "bullets": [
                  "Manual manipulation",
                  "Controlled vaginal delivery",
                  "Cesarean section",
                  "Fetotomy"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ตัวอย่าง malposition: ลูกนอนท่าขาข้างหนึ่งยื่นไปข้างหน้า อีกข้างไปข้างหลัง ในม้าแคระการล้วงเข้าไปจัดท่าทำได้ยากมาก",
              "การจัดท่าลูกเป็นงานที่สัตวแพทย์โคทำบ่อยกว่า ถ้าจัดท่าไม่ได้ให้เรียกสัตวแพทย์โค"
            ]
          },
          {
            "callout": "การผ่าคลอด (caesarean section) และการซ่อมรอยฉีกของ perineum อยู่ในหัวข้อ Equine reproductive surgery",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Post partum breeding: foal heat",
        "source": "Equine pregnancy and neonatal care p.38; บันทึกคาบ 29 ต.ค. 2569 [153:31-154:30]",
        "body": [
          {
            "bullets": [
              {
                "label": "Timing",
                "value": "foal heat เกิดราววันที่ **10** หลังคลอด (ช่วงถึงวันที่ 20)"
              },
              {
                "label": "Features",
                "value": "follicular development และ ovulation ปกติ"
              }
            ]
          },
          {
            "sub": "ผสมที่ foal heat",
            "body": [
              {
                "bullets": [
                  "**Uterine involution ยังไม่สมบูรณ์** (ต้องใช้ราว 20-30 วัน)",
                  "**Pregnancy rate ต่ำกว่า** ถ้าผสมที่ foal heat",
                  "**ไม่กระทบ fertility** ในวงรอบถัดไป"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ระหว่างที่แม่เลี้ยงลูกอยู่ foal heat เกิดได้และผสมได้ แต่ไม่แนะนำให้ผสมที่ foal heat ครั้งแรก เพราะมดลูกยังเข้าอู่ไม่เสร็จ involution จะสมบูรณ์ราว 1 เดือน",
              "ให้แม่เลี้ยงลูกไปราว 1 เดือนจนแม่และลูกแข็งแรงก่อน แล้วค่อยผสม"
            ]
          }
        ]
      }
    ]
  }
};
