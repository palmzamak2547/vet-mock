// ============================================================
// จุลชีววิทยาทางสัตวแพทย์ I (Veterinary Microbiology I) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส 3110201 ที่แจกจริงในรายวิชา ทุก section
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

export const NOTES_Y2_MICROBIO_1 = {
  "microbio-1--antimicrobial-resistance": {
    "topic": "microbio-1--antimicrobial-resistance",
    "title": "Antimicrobial resistance และ antimicrobial susceptibility testing",
    "icon": "🦠",
    "lecturer": "Associate Professor Pattrarat Chanchaithong, DVM, PhD (Department of Veterinary Microbiology, Faculty of Veterinary Science, Chulalongkorn University)",
    "summary": "เด็คนี้แบ่งเป็น 2 ครึ่งชัดเจน ครึ่งแรก (p.1-8) คือ AMR ในมุมสาธารณสุข การเชื่อมโยงระหว่างสัตว์กับคน natural vs acquired resistance โดยใช้ Pseudomonas aeruginosa เป็นตัวอย่างเดินเรื่องทั้งเรื่อง ตามด้วย antimicrobial classes กับกลไกออกฤทธิ์ และกลไกการดื้อยา 5 แบบ ครึ่งหลัง (p.8-18) เป็น antimicrobial susceptibility testing เต็ม ๆ ตั้งแต่ empirical treatment, มาตรฐาน CLSI, disk diffusion ทีละขั้น, MIC ทุกวิธี (broth macro/microdilution, agar dilution, Etest), Vitek 2 ไปจนถึงการแปลผล S/I/R และ MIC50/MIC90 มีหลายสไลด์ที่เป็นรูปหรือแผนภาพล้วน (เช่น p.3 ของแผนผัง link คนกับสัตว์, p.16-18 ภาพผลจาก Vitek) ซึ่ง text layer แทบไม่มีข้อความ จึงสรุปได้เฉพาะหัวข้อที่พิมพ์ไว้จริง",
    "sections": [
      {
        "heading": "Outline ของบทเรียน",
        "source": "Antimicrobial resistance p.1",
        "body": [
          {
            "text": "สไลด์เปิดวางกรอบไว้ 5 หัวข้อ ใช้เป็นแผนที่อ่านทั้งเด็คได้เลย"
          },
          {
            "bullets": [
              "Antimicrobial resistance: a public health problem",
              "Natural resistance vs acquired resistance",
              "Antimicrobials and mechanisms of action",
              "Antimicrobial resistance mechanisms",
              "Antimicrobial susceptibility testing"
            ]
          }
        ]
      },
      {
        "heading": "AMR เป็นปัญหาสาธารณสุข: เรื่องราวจนถึงตอนนี้",
        "source": "Antimicrobial resistance p.1",
        "body": [
          {
            "text": "ผลของการดื้อยาที่สไลด์ระบุไว้ 4 ข้อ"
          },
          {
            "bullets": [
              "Limit antimicrobial uses (ยาที่เลือกใช้ได้เหลือน้อยลง)",
              "More severe infection",
              "Treatment failure",
              "Public health problem"
            ]
          },
          {
            "callout": "**การดื้อยาลุกลามเป็นขั้น: ดื้อ 1 class → 2 classes → 3 classes ซึ่งเมื่อดื้อตั้งแต่ 3 classes ขึ้นไปเรียกว่า multidrug resistance (MDR)**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ผลของการใช้ยาต้านจุลชีพในสัตว์ต่อ resident bacteria",
        "source": "Antimicrobial resistance p.1",
        "body": [
          {
            "bullets": [
              "ANTIMICROBIALS kill bacterial pathogens",
              "**Resistant resident bacteria can survive** คือตัวที่รอดและถูกคัดเลือกไว้"
            ]
          },
          {
            "text": "สไลด์ยกบริบท in-feed antimicrobials และชื่อเชื้อที่เกี่ยวข้อง ได้แก่ Staphylococcus aureus, E. coli, Klebsiella pneumoniae, Enterococcus sp. และ Campylobacter sp."
          }
        ]
      },
      {
        "heading": "เส้นทางเชื่อมระหว่างคน สัตว์ และสิ่งแวดล้อม",
        "source": "Antimicrobial resistance p.2",
        "body": [
          {
            "text": "**Pig and human share common resident bacteria** สไลด์ระบุเส้นทางที่เชื้อและยาเดินทางถึงกันไว้ 3 ทาง"
          },
          {
            "bullets": [
              "Food chain",
              "Direct contact",
              "Shared environment"
            ]
          },
          {
            "text": "ช่องทาง/จุดที่สไลด์วางไว้ในแผนภาพ ได้แก่ human, livestock, companion animals, food products, agricultural products และ environment โดยสิ่งที่ไหลเวียนคือ ยาปฏิชีวนะตกค้าง และ แบคทีเรียดื้อยาต้านจุลชีพ"
          },
          {
            "text": "เชื้อที่ระบุซ้ำในกลุ่ม resident bacteria คือ Escherichia coli, Enterococcus sp., Staphylococcus sp., Klebsiella pneumoniae เป็นต้น"
          }
        ]
      },
      {
        "heading": "ทำไม resident bacteria ถึงกลายเป็นปัญหา",
        "source": "Antimicrobial resistance p.2",
        "body": [
          {
            "text": "สไลด์ลำดับให้เห็นเป็นสายโซ่"
          },
          {
            "bullets": [
              "Resident bacteria: keep silent and be friendly in healthy people",
              "Opportunistic pathogens: cause harmful secondary infection",
              "ANTIMICROBIAL RESISTANCE: limited antimicrobial for treatment"
            ]
          }
        ]
      },
      {
        "heading": "ยาต้านจุลชีพที่ผสมในอาหารสัตว์ในภูมิภาค SEA",
        "source": "Antimicrobial resistance p.2",
        "body": [
          {
            "text": "ตารางจาก Nhung et al., 2016. Antibiotics. 5:37 จับคู่ตัวยากับ class ไว้ดังนี้"
          },
          {
            "bullets": [
              "Chlortetracycline และ Oxytetracycline = Tetracyclines",
              "Bacitracin และ Ernamycin = Polypeptides",
              "Colistin = Polymyxins",
              "Tylosin = Macrolides",
              "Florfenicol = Phenicols",
              "Lincomycin = Lincosamides",
              "Neomycin = Aminoglycosides",
              "Tiamulin = Pleuromutilins",
              "Amoxicillin = b-lactams",
              "Halquinol = Chlorhydroxyquinolone",
              "Trimethoprim = Dihydrofolate reductase inhibitor"
            ]
          },
          {
            "text": "หน้าถัดมา (p.3) เป็นแผนภาพ links between AMR in animal and human health ที่มีแต่ชื่อยา Avoparcin, Colistin, Neomycin, Amoxicillin, Florfenicol, Lincomycin, Virginiamycin, Chlortetracycline/Oxytetracycline และ Tiamulin วางอยู่บนภาพ สไลด์ไม่ได้เขียนคำอธิบายกำกับว่าแต่ละตัวเชื่อมโยงกันอย่างไร"
          }
        ]
      },
      {
        "heading": "เคสตัวอย่างที่ 1: Pan drug-resistant P. aeruginosa ในคน",
        "source": "Antimicrobial resistance p.3",
        "body": [
          {
            "text": "Pseudomonas aeruginosa เป็นแบคทีเรียแกรมลบ รูปร่างท่อน พบได้ในสิ่งแวดล้อม"
          },
          {
            "text": "ลำดับเหตุการณ์ตามสไลด์: นิ่วในไต → ติดเชื้อ P. aeruginosa ในทางเดินปัสสาวะ → ติดเชื้อในกระแสเลือดและอวัยวะอื่น ๆ"
          },
          {
            "callout": "**เชื้อรายนี้ดื้อยาต้านจุลชีพทุกชนิดที่ใช้รักษาการติดเชื้อแบคทีเรียในทางการแพทย์ = Pan drug-resistant (PDR) P. aeruginosa**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "เคสตัวอย่างที่ 2: carbapenem-resistant P. aeruginosa ระหว่างเจ้าของกับสุนัข",
        "source": "Antimicrobial resistance p.3",
        "body": [
          {
            "bullets": [
              "เจ้าของสุนัขมีประวัติพักฟื้นในโรงพยาบาลนาน 5 เดือน",
              "สุนัขตัวที่ 1 พบ carbapenem-resistant P. aeruginosa ในอุจจาระ",
              "สุนัขตัวที่ 2 ติดเชื้อ carbapenem-resistant P. aeruginosa ที่ช่องหูส่วนนอก"
            ]
          },
          {
            "text": "เชื้อที่พบ **เป็นสายพันธุ์เดียวกันและมีรูปแบบการดื้อยาเหมือนกัน** ข้อสรุปที่สไลด์เขียนไว้คือ เจ้าของสุนัขมีโอกาสได้รับเชื้อในโรงพยาบาลและเป็นพาหะ แล้วสุนัขได้รับเชื้อจากเจ้าของ ซึ่งเรียกว่า **zooanthroponotic transmission** (คนสู่สัตว์)"
          },
          {
            "text": "อ้างอิง Mariam et al. (2018) Emerg Infect Dis. 24(6): 1160-1162"
          }
        ]
      },
      {
        "heading": "Natural resistance vs acquired resistance",
        "source": "Antimicrobial resistance p.3",
        "body": [
          {
            "sub": "1. Natural resistance หรือ intrinsic resistance",
            "body": [
              {
                "bullets": [
                  "Lack of target (ไม่มีเป้าหมายให้ยาจับตั้งแต่แรก)",
                  "Resistance in chromosome"
                ]
              }
            ]
          },
          {
            "sub": "2. Acquired resistance",
            "body": [
              {
                "bullets": [
                  "Chromosomal mutation",
                  "Acquired mobile genetic elements (MGE)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Natural resistance ของ P. aeruginosa: ดื้ออะไรมาแต่กำเนิด",
        "source": "Antimicrobial resistance p.4",
        "body": [
          {
            "sub": "Expulsion of toxic compounds (antimicrobials, heavy metals และอื่น ๆ)",
            "body": [
              {
                "bullets": [
                  "Macrolides เช่น erythromycin",
                  "Lincosamides เช่น clindamycin",
                  "Tetracyclines",
                  "Phenicols",
                  "Sulfonamides/trimethoprim",
                  "และอื่น ๆ"
                ]
              }
            ]
          },
          {
            "sub": "Enzymes for drug inactivation (β-lactamases)",
            "body": [
              {
                "bullets": [
                  "Penicillin",
                  "Amoxicillin, ampicillin",
                  "Oxacillin, cloxacillin",
                  "1st-3rd gen. cephalosporins",
                  "Amoxicillin/clavulanic acid"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Natural susceptibility ของ wild-type P. aeruginosa: ยาที่ยังใช้ได้",
        "source": "Antimicrobial resistance p.4",
        "body": [
          {
            "bullets": [
              "Aminoglycosides เช่น gentamicin, tobramycin, amikacin",
              "Fluoroquinolones เช่น enrofloxacin, marbofloxacin, pradofloxacin",
              "β-lactams เฉพาะ anti-pseudomonal penicillins (เช่น piperacillin), 4th gen. cephalosporins และ carbapenems (last-resort)",
              "Polymyxin คือ colistin"
            ]
          },
          {
            "callout": "**จำคู่กับสไลด์ก่อนหน้า: β-lactam ที่ P. aeruginosa ไวคือเฉพาะ anti-pseudomonal penicillins, 4th gen. cephalosporins และ carbapenems ส่วน penicillin/amoxicillin/1st-3rd gen. cephalosporins อยู่ในกลุ่มที่มันดื้อโดยธรรมชาติ**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Acquired resistance เกิดขึ้นได้อย่างไร",
        "source": "Antimicrobial resistance p.4",
        "body": [
          {
            "bullets": [
              "1. Chromosomal mutation",
              "2. Horizontal gene transfer ได้แก่ transformation, transduction และ conjugation"
            ]
          },
          {
            "sub": "Antimicrobial resistance genes อยู่ที่ไหนได้บ้าง",
            "body": [
              {
                "bullets": [
                  "Chromosome",
                  "Mobile genetic element (MGE) หรือ transferable element"
                ]
              }
            ]
          },
          {
            "sub": "Protein ที่ยีนเหล่านั้นสร้างเพื่อทำหน้าที่ดื้อยา",
            "body": [
              {
                "bullets": [
                  "Efflux pumps",
                  "Enzymatic inactivation",
                  "Additional functional target",
                  "และอื่น ๆ"
                ]
              }
            ]
          },
          {
            "callout": "**Co-resistance in a mobile genetic element: พลาสมิดเดียวบรรจุยีนดื้อยาได้หลายยีน (multidrug resistance plasmid) จึงถ่ายทอดการดื้อยาหลาย class ไปพร้อมกันในครั้งเดียว**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "จาก MDR ไป XDR ไป PDR ใน P. aeruginosa",
        "source": "Antimicrobial resistance p.5",
        "body": [
          {
            "text": "สไลด์ไล่เป็นขั้นบันไดจาก natural resistance แล้วสะสม acquired resistance ทีละกลุ่ม"
          },
          {
            "bullets": [
              "Natural resistance",
              "+ Acquired fluoroquinolone resistance → MDR",
              "+ Acquired aminoglycoside resistance → MDR",
              "+ Acquired anti-pseudomonal penicillin and cephalosporin resistance → XDR",
              "+ Carbapenem and colistin resistance → XDR, PDR"
            ]
          },
          {
            "callout": "**XDR = extensively drug-resistant, PDR = pan drug-resistant** สไลด์ไม่ได้ให้นิยามเชิงจำนวน class ของ XDR/PDR ไว้ ให้จำจากลำดับที่สะสมตามภาพนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การเลือกยาและ AST panel สำหรับ P. aeruginosa",
        "source": "Antimicrobial resistance p.5",
        "body": [
          {
            "text": "หลักคือ **ตัดยาที่เชื้อ natural resistance ออกจาก panel ตั้งแต่ต้น** แล้วทดสอบเฉพาะยาที่มีโอกาสใช้ได้จริง"
          },
          {
            "text": "Antimicrobial susceptibility testing panel ที่สไลด์ติ๊กไว้ให้ทดสอบ"
          },
          {
            "bullets": [
              "Aminoglycosides",
              "Fluoroquinolones",
              "Antipseudomonal penicillins",
              "4th gen. cephalosporins",
              "Carbapenems",
              "Polymyxins"
            ]
          }
        ]
      },
      {
        "heading": "Antimicrobial classes แบ่งตามกลไกออกฤทธิ์",
        "source": "Antimicrobial resistance p.5-6",
        "body": [
          {
            "text": "สไลด์รวมหัวข้อไว้ 4 กลุ่ม"
          },
          {
            "bullets": [
              "Cell wall synthesis inhibitors",
              "Cell membrane destruction",
              "Nucleic acid synthesis inhibitors",
              "Protein synthesis inhibitors"
            ]
          },
          {
            "sub": "Cell wall synthesis inhibitors (p.5)",
            "body": [
              {
                "bullets": [
                  "Inhibition of transpeptidase = β-lactams ได้แก่ penicillins, cephalosporins และ carbapenems (**last-resort drug for gram-negative**)",
                  "Inhibition of D-ala-D-ala = glycopeptides คือ vancomycin (**last-resort drug for gram-positive**)"
                ]
              }
            ]
          },
          {
            "sub": "Folic acid synthesis inhibitors (p.6)",
            "body": [
              {
                "bullets": [
                  "Sulfonamides เช่น sulfamethoxazole",
                  "Trimethoprim"
                ]
              }
            ]
          },
          {
            "sub": "Nucleic acid / DNA synthesis inhibitors (p.6)",
            "body": [
              {
                "bullets": [
                  "Quinolones และ fluoroquinolones เช่น enrofloxacin, marbofloxacin, ciprofloxacin, norfloxacin",
                  "**ยับยั้ง DNA replication โดยจับกับ DNA gyrase และ topoisomerase IV** ที่ตำแหน่ง quinolone-binding pocket"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ลิสต์ protein synthesis inhibitors ไว้ในหัวข้อรวม แต่ **ไม่มีสไลด์ที่ลงรายละเอียดตัวยาในกลุ่มนี้ สไลด์ไม่ได้บอก**",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Polymyxin และ colistin: ยาไม้ตายสำหรับแกรมลบ",
        "source": "Antimicrobial resistance p.6",
        "body": [
          {
            "bullets": [
              "Polymyxin B",
              "Polymyxin E (colistin)",
              "**Last-resort drug for gram-negative**",
              "Colistin เป็น critically important drug for serious infection (WHO, 2014)"
            ]
          },
          {
            "callout": "สไลด์นี้มีหัวเรื่อง 2 แบบซ้อนกันคือ Cell membrane destruction และ Cell wall destruction กำกับ polymyxin ทั้งคู่ **สไลด์ไม่ได้เขียนอธิบายว่าอันไหนถูกต้อง** ถ้าออกสอบให้อ้างตามที่อาจารย์บรรยาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "กลไกการดื้อยา 5 แบบ (ภาพรวม)",
        "source": "Antimicrobial resistance p.6",
        "body": [
          {
            "bullets": [
              "1. Decreased permeability",
              "2. Expulsion of drugs",
              "3. Target changes (drug cannot bind)",
              "4. Drug inactivation",
              "5. Overproduction of or additional target"
            ]
          },
          {
            "text": "อ้างอิง Wilson 2014. Nat Rev Microbiol."
          }
        ]
      },
      {
        "heading": "กลไก 1-2: Decreased permeability และ efflux pump",
        "source": "Antimicrobial resistance p.7",
        "body": [
          {
            "sub": "1. Decrease permeability to drug molecules",
            "body": [
              {
                "bullets": [
                  "**Decreased expression of specific channel** ทำให้ยาเข้าเซลล์ได้น้อยลง"
                ]
              },
              {
                "text": "อ้างอิง Li et al. 2015. Clin Microbiol Rev. 28(2)"
              }
            ]
          },
          {
            "sub": "2. Expulsion of drugs (efflux pump)",
            "body": [
              {
                "bullets": [
                  "**Cross resistance เพราะปั๊มตัวเดียวขนได้หลาย substrates**",
                  "Multidrug efflux pump"
                ]
              },
              {
                "text": "อ้างอิง Beceiro et al., 2013. Clin Microbiol Rev. 26(2):185"
              }
            ]
          }
        ]
      },
      {
        "heading": "กลไก 3: Drug inactivation ด้วยเอนไซม์",
        "source": "Antimicrobial resistance p.7",
        "body": [
          {
            "sub": "b-lactamases",
            "body": [
              {
                "bullets": [
                  "**Hydrolysis of b-lactams**",
                  "Various class of enzymes",
                  "Various specific substrates and spectrum"
                ]
              }
            ]
          },
          {
            "sub": "Aminoglycoside-modifying enzymes",
            "body": [
              {
                "text": "ทำงานแบบ enzymatic modification คือ **เติมหมู่เคมีเข้าไปที่ตัวยา** (addition of chemical groups) แบ่งเป็น 3 กลุ่มตามหมู่ที่เติม"
              },
              {
                "bullets": [
                  "AAC = aminoglycoside acetyltransferase",
                  "ANT = aminoglycoside nucleotidyltransferase",
                  "APH = aminoglycoside phosphotransferase"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "กลไก 4: Target change",
        "source": "Antimicrobial resistance p.8",
        "body": [
          {
            "sub": "Target mutation: fluoroquinolone resistance",
            "body": [
              {
                "bullets": [
                  "**Mutation of gyrA และ parC**",
                  "เกิดในบริเวณ quinolone resistance-determining region (QRDR)",
                  "ผลคือ amino acid change(s)"
                ]
              }
            ]
          },
          {
            "sub": "Modification of target site: tetracycline resistance",
            "body": [
              {
                "bullets": [
                  "**Ribosomal protective proteins (RPP)**",
                  "ได้แก่ Tet(O) และ Tet(M)"
                ]
              },
              {
                "text": "อ้างอิง Connell et al. 2003. Antimicrob Agents Chemother. 47(12)"
              }
            ]
          }
        ]
      },
      {
        "heading": "กลไก 5: Production of substituted target (methicillin-resistant staphylococci)",
        "source": "Antimicrobial resistance p.8",
        "body": [
          {
            "bullets": [
              "**สร้าง penicillin-binding protein 2a (PBP2a) ซึ่งเป็น additional transpeptidase**",
              "PBP2a มี low affinity to b-lactams"
            ]
          }
        ]
      },
      {
        "heading": "Empirical treatment: ให้ยาก่อนรู้ผลเพาะเชื้อ",
        "source": "Antimicrobial resistance p.8-9",
        "body": [
          {
            "text": "ลำดับการทำงานตามสไลด์คือ clinical diagnosis and onset of treatment ใช้ empirical treatment ไปก่อน แล้วจึงตามด้วย species identification และผล AST"
          },
          {
            "sub": "นิยามของ empirical treatment",
            "body": [
              {
                "bullets": [
                  "**Initiation of treatment prior to determination of a firm diagnosis**",
                  "อิงจาก recommendations, guidelines หรือ local antimicrobial susceptibility patterns",
                  "ใช้ระหว่างรอผล AST (pending before AST results)"
                ]
              }
            ]
          },
          {
            "sub": "ใช้อะไรช่วยเลือกยา empirical",
            "body": [
              {
                "bullets": [
                  "Common bacterial species infecting organs/body systems",
                  "Cytologic examination"
                ]
              }
            ]
          },
          {
            "sub": "ถ้า empirical treatment ได้ผล",
            "body": [
              {
                "bullets": [
                  "Improving clinical outcomes",
                  "Decreasing mortality rate"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "AST มีไว้ทำอะไร และมาตรฐานมีของใครบ้าง",
        "source": "Antimicrobial resistance p.9",
        "body": [
          {
            "sub": "วัตถุประสงค์ 3 ข้อ",
            "body": [
              {
                "bullets": [
                  "ยืนยันความไวรับต่อยา empirical ที่เลือกไว้",
                  "ตรวจหาการดื้อยาใน individual bacterial isolates",
                  "ช่วยเลือก appropriate targeted antibiotics"
                ]
              }
            ]
          },
          {
            "sub": "International standard procedure",
            "body": [
              {
                "bullets": [
                  "**CLSI** = Clinical and Laboratory Standard Institute",
                  "**EUCAST** = European Committee for Antimicrobial Susceptibility Testing",
                  "BSAC = British Society for Antimicrobial Chemotherapy",
                  "DIN = Deutsche Institut für Normung e.V.",
                  "CA-SFM = Comité de l'Antibiogramme de la Société Française de Microbiologie"
                ]
              }
            ]
          },
          {
            "callout": "**แบ่งวิธีทดสอบเป็น 2 แบบ: qualitative testing = disk diffusion test และ quantitative testing = MIC determination (MIC = minimal inhibitory concentration)**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "CLSI documents และ quality control",
        "source": "Antimicrobial resistance p.10",
        "body": [
          {
            "text": "CLSI documents เป็น an approved standard ที่ให้ precise instructions ว่าจะทำ AST in vitro อย่างไร ครอบคลุม medium (รวม supplements), inoculum density และ test conditions"
          },
          {
            "sub": "Quality controls (QCs)",
            "body": [
              {
                "bullets": [
                  "ใช้ reference strains รันคู่ขนานไปกับ test strains",
                  "reference strain ต้องมี acceptable MIC และ zone diameter range กำกับ"
                ]
              }
            ]
          },
          {
            "sub": "เงื่อนไข 4 ข้อของ QC ที่ดี",
            "body": [
              {
                "bullets": [
                  "1. reference strain ต้องสัมพันธ์กับ species ที่ทดสอบ เช่น **E. coli ATCC 25922 เมื่อทดสอบ Enterobacteriaceae**",
                  "2. reference strain ต้องเหมาะกับการ QC ของยาตัวที่ทดสอบ",
                  "3. ช่วงความเข้มข้นที่ทดสอบต้องครอบคลุม approved QC ranges ทั้งช่วง",
                  "4. disk ต้องมีปริมาณยาตรงกับที่ QC ranges นั้นอนุมัติไว้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Disk diffusion test: หลักการและวิธีทำ",
        "source": "Antimicrobial resistance p.10",
        "body": [
          {
            "text": "เรียกอีกชื่อว่า **Kirby-Bauer method** จัดเป็น qualitative testing"
          },
          {
            "sub": "หลักการ",
            "body": [
              {
                "bullets": [
                  "ยาแพร่ออกจาก disk ลงสู่ agar",
                  "**เกิด dynamically changing gradient ของความเข้มข้นยา คือใกล้ disk เข้มข้นสูง ไกลออกไปเจือจางลง**",
                  "ใช้ Müller-Hinton agar plate"
                ]
              }
            ]
          },
          {
            "sub": "Procedure",
            "body": [
              {
                "bullets": [
                  "Bacterial inoculum **1.5 X 10^8 CFU/mL ใน 0.85% normal saline เทียบเท่า 0.5 McFarland standard**",
                  "spread ลงบนผิว Müller-Hinton agar ที่หนา 4 ± 0.1 mm ด้วยวิธี 3-way cross streak",
                  "ผึ่งให้แห้ง 10 นาทีก่อนวาง disk",
                  "วาง disk แล้ว incubate ที่ 35°C นาน 18-24 h"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Inoculum: จุดที่พลาดแล้วผลเพี้ยนทั้งจาน",
        "source": "Antimicrobial resistance p.10",
        "body": [
          {
            "bullets": [
              "ใช้ inoculum suspension เตรียมจากโคโลนีที่เก็บจาก agar plate อายุ 18-24 h แขวนใน broth หรือ saline",
              "ปรับให้ได้ 0.5 McFarland standard",
              "**ต้องใช้ภายใน 15 นาทีหลังเตรียม** สำคัญมากกับ fastidious organisms เพราะเชื้อจะสูญเสีย viability ทำให้ inoculum ต่ำลง เช่น Haemophilus spp. และ beta-hemolytic streptococci"
            ]
          },
          {
            "callout": "**Too high CFU → false resistance (zone เล็กกว่าจริง) และ Too low CFU → false susceptibility (zone ใหญ่กว่าจริง)** ข้อนี้ออกสอบง่ายมาก ให้จำทิศทางให้แม่น",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การวาง disk การ incubate และการอ่าน zone",
        "source": "Antimicrobial resistance p.11",
        "body": [
          {
            "sub": "จำนวนและระยะห่างของ disk",
            "body": [
              {
                "bullets": [
                  "**12 disks ต่อจาน 150 mm และ 5 disks ต่อจาน 90 mm**",
                  "ลด zone ซ้อนกันโดยวาง disk ที่คาดว่าจะให้ zone เล็ก ไว้ข้าง disk ที่คาดว่าจะให้ zone ใหญ่",
                  "ห่างกัน 30 mm และห้ามใกล้กว่า 24 mm",
                  "**disk ที่แตะ agar แล้วห้ามขยับ เพราะยาแพร่ออกทันที**"
                ]
              }
            ]
          },
          {
            "sub": "Incubation",
            "body": [
              {
                "bullets": [
                  "คว่ำจาน (invert position of plates, agar อยู่ด้านบน)",
                  "16-18 h สำหรับ rapidly growing bacteria",
                  "นานกว่านั้นสำหรับ fastidious organisms หรือเชื้อที่มี special resistance mechanisms",
                  "**vancomycin และ oxacillin resistance ใน Staphylococcus spp. อ่านที่ 24 h**"
                ]
              }
            ]
          },
          {
            "sub": "Reading",
            "body": [
              {
                "bullets": [
                  "วัด diameter เป็นมิลลิเมตรด้วยไม้บรรทัดหรือ sliding caliper",
                  "**อ่านจากด้านหลังจานถ้าเป็น Mueller-Hinton agar แต่อ่านจากด้านหน้าจานถ้าเป็น MHA ที่เติมเลือด**",
                  "zone edge คือจุดที่ความเข้มข้นของยาเริ่มยับยั้งเชื้อที่มี cell mass มากพอ"
                ]
              }
            ]
          },
          {
            "sub": "สังเกตความหนาแน่นของเชื้อจากหน้าจาน",
            "body": [
              {
                "bullets": [
                  "เห็นเป็น individual colonies แปลว่า inoculum เบาเกินไป",
                  "ขอบ zone very hazy แปลว่า inoculum หนาเกินไป"
                ]
              }
            ]
          },
          {
            "callout": "เวลา incubate ในเด็คมี 2 ตัวเลข คือ p.10 เขียน 18-24 h ในขั้นตอน procedure ส่วน p.11 เขียน 16-18 h สำหรับเชื้อโตเร็ว **สไลด์ไม่ได้อธิบายว่าทำไมต่างกัน** ให้จำทั้งสองบริบทไว้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การแปลผล disk diffusion และตัวอย่าง breakpoint",
        "source": "Antimicrobial resistance p.11-12",
        "body": [
          {
            "text": "การแปลผลต้องรู้ 3 อย่างพร้อมกันเสมอ คือ **organism, drug และ breakpoint** โดยอ้างตารางจาก www.clsi.org"
          },
          {
            "sub": "ตัวอย่างจากตาราง Zone diameter and MIC breakpoint for Staphylococcus spp. (adapted from CLSI-V08-ED4-2018)",
            "body": [
              {
                "bullets": [
                  "ยา Oxacillin กับเชื้อ S. pseudintermedius / S. schleiferi",
                  "Disk content 1 µg",
                  "**Zone diameter breakpoint: S ที่ 18 mm และ R ที่ 17 mm ไม่มีช่วง I**",
                  "**MIC breakpoint: S ที่ 0.25 µg/mL และ R ที่ 0.5 µg/mL ไม่มีช่วง I**"
                ]
              },
              {
                "text": "เครื่องหมายมากกว่า/น้อยกว่าเท่ากับในตารางอ่านจาก text layer ได้ไม่ชัด ให้ยึดตามตารางในสไลด์จริงเวลาอ่านทบทวน"
              }
            ]
          }
        ]
      },
      {
        "heading": "ข้อได้เปรียบและข้อเสียเปรียบของ disk diffusion",
        "source": "Antimicrobial resistance p.12",
        "body": [
          {
            "sub": "ข้อได้เปรียบ",
            "body": [
              {
                "bullets": [
                  "ง่าย รวดเร็ว ราคาย่อมเยา"
                ]
              }
            ]
          },
          {
            "sub": "ข้อเสียเปรียบ",
            "body": [
              {
                "bullets": [
                  "ได้ข้อมูลเชิงคุณภาพ (qualitative data)",
                  "**จัดว่าเป็นการตรวจคัดกรองเท่านั้น**",
                  "ยาต้านจุลชีพบางชนิดไม่มีค่าวิกฤติสำหรับแปลผลด้วย disk diffusion",
                  "ยาบางชนิดต้องการการยืนยันด้วย MIC",
                  "ไม่เหมาะกับแบคทีเรียที่เจริญยากในบรรยากาศปกติ เช่น streptococci บางสปีชีส์"
                ]
              }
            ]
          },
          {
            "callout": "**Vancomycin และ colistin เป็นโมเลกุลใหญ่จึงแพร่ในวุ้นได้ไม่ดี ไม่แนะนำให้ใช้ disk diffusion ต้องทำ MIC determination**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "MIC และ MBC",
        "source": "Antimicrobial resistance p.13",
        "body": [
          {
            "sub": "Minimal Inhibitory Concentration (MIC)",
            "body": [
              {
                "bullets": [
                  "**ความเข้มข้นของยาที่ยับยั้งการเจริญของแบคทีเรีย**",
                  "bacteriostatic drugs คิดที่ 80% inhibition",
                  "bactericidal drugs คิดที่ 100% inhibition"
                ]
              }
            ]
          },
          {
            "sub": "Minimal Bactericidal Concentration (MBC)",
            "body": [
              {
                "bullets": [
                  "**ความเข้มข้นของยาที่ฆ่าแบคทีเรีย**"
                ]
              }
            ]
          },
          {
            "text": "ความเข้มข้นที่ใช้เป็น 2-fold diluted concentration หน่วย µg/mL หรือ mg/L ไล่ตั้งแต่ 0.06, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 ถึง 1024"
          },
          {
            "sub": "วิธีหา MIC ที่สไลด์แบ่งไว้",
            "body": [
              {
                "bullets": [
                  "Broth dilution techniques ได้แก่ broth macrodilution (tube-dilution) และ broth microdilution",
                  "Agar dilution technique",
                  "Antimicrobial gradient technique"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Broth macrodilution และการต่อยอดหา MBC",
        "source": "Antimicrobial resistance p.13-14",
        "body": [
          {
            "sub": "หลักการ",
            "body": [
              {
                "bullets": [
                  "เจือจางยาแบบ two-fold ใน liquid growth medium แจกใส่หลอดทดลอง",
                  "**หยอดเชื้อที่ปรับมาตรฐานแล้วให้ได้ 5 X 10^5 CFU/mL (ระบุอีกที่ว่า 1-5 X 10^5 CFU/mL ในแต่ละหลอด)**"
                ]
              }
            ]
          },
          {
            "sub": "การอ่านผล",
            "body": [
              {
                "bullets": [
                  "incubate ที่ 35°C นาน 18-24 h",
                  "หลอดที่ขุ่น (turbidity) = มีเชื้อเจริญให้เห็น",
                  "**MIC = lowest concentration preventing growth คือหลอดใสหลอดแรก**"
                ]
              }
            ]
          },
          {
            "sub": "ต่อยอดเป็น MBC",
            "body": [
              {
                "bullets": [
                  "นำจากหลอดไปเลี้ยงต่อบน agar medium",
                  "ตัวอย่างในสไลด์คือไม่มีเชื้อขึ้นที่ 64 µg/mL จึงเป็นค่า minimal bactericidal concentration (MBC)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Broth microdilution และ agar dilution",
        "source": "Antimicrobial resistance p.14",
        "body": [
          {
            "sub": "Broth microdilution",
            "body": [
              {
                "bullets": [
                  "ย่อส่วนและทำเป็นระบบอัตโนมัติมาจาก tube-dilution method",
                  "ใช้ถาดพลาสติกใช้แล้วทิ้งขนาดเล็กเรียก microdilution tray",
                  "**มี 96 wells แต่ละหลุมปริมาตร 0.1 mL และ inoculum = 5 X 10^5 CFU/mL**"
                ]
              }
            ]
          },
          {
            "sub": "Agar dilution technique",
            "body": [
              {
                "bullets": [
                  "เจือจางยาแบบ two-fold ลงในจาน agar",
                  "**หยอดเชื้อที่ปรับมาตรฐานแล้ว 1 X 10^7 CFU/mL ด้วย multipoint inoculator**",
                  "หนึ่งจาน = ยา 1 ชนิด ที่ความเข้มข้น 1 ค่า แต่ทดสอบเชื้อได้ 25 isolates พร้อมกัน",
                  "ตัวอย่างในสไลด์คือ Pasteurella multocida บน Müller-Hinton agar เติม 5% sheep blood"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างการอ่าน MIC จาก agar dilution",
            "body": [
              {
                "bullets": [
                  "จุด A3, A4 และ A5 มี MIC = 0.5 µg/mL",
                  "จุด B3, B4 และ B5 มี MIC = 1 µg/mL",
                  "จุดอื่น ๆ มี MIC มากกว่า 2 µg/mL"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Antimicrobial gradient technique (Etest)",
        "source": "Antimicrobial resistance p.15",
        "body": [
          {
            "text": "**หลักการคือรวมหลักการของ disk diffusion กับ agar dilution เข้าด้วยกัน**"
          },
          {
            "sub": "ตัวแถบทดสอบ Etest (bioMérieux AB)",
            "body": [
              {
                "bullets": [
                  "เป็น thin plastic test strips เวอร์ชันการค้า",
                  "ด้านล่างเคลือบยาไว้เป็น dried antibiotic concentration gradient",
                  "ด้านบนพิมพ์ concentration scale ไว้อ่าน"
                ]
              }
            ]
          },
          {
            "sub": "การอ่านและแปลผล",
            "body": [
              {
                "bullets": [
                  "**zone ที่เกิดมีรูปพาราโบลา (parabolic-shaped inhibition zone)**",
                  "อ่านที่จุดตัดของส่วนล่างของ zone รูปวงรีกับตัวแถบ คือจุดที่ขอบการยับยั้งตัดขอบ calibrated strip",
                  "ตัวอย่างในสไลด์: ขอบการยับยั้งอยู่ระหว่างค่า 0.38 กับ 0.5 µg **ให้แปลผลที่ค่าสูงกว่า คือ 0.5 µg/mL**"
                ]
              }
            ]
          },
          {
            "sub": "ข้อดี",
            "body": [
              {
                "bullets": [
                  "gradient เสถียร (stable gradients)",
                  "สะดวก เป็นวิธีที่ทำบน agar"
                ]
              }
            ]
          },
          {
            "sub": "ข้อเสีย",
            "body": [
              {
                "bullets": [
                  "ไม่มีให้ครบทุกตัวยา",
                  "แพงถ้าต้องทดสอบยาหลายตัว",
                  "เกิด error ในการแปลผลได้ เพราะจุดตัดกับ strip อาจไม่ชัด หรือมี microcolonies ขึ้นในบริเวณ inhibition"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ข้อได้เปรียบและข้อเสียเปรียบของ MIC determination",
        "source": "Antimicrobial resistance p.16",
        "body": [
          {
            "sub": "ข้อได้เปรียบ",
            "body": [
              {
                "bullets": [
                  "**จัดว่าเป็นวิธีมาตรฐานในการทดสอบความไวรับต่อยาต้านจุลชีพ**",
                  "ได้ข้อมูลเชิงปริมาณ (quantitative data)",
                  "หน่วยความเข้มข้น µg/mL สมมูลกับความเข้มข้นของยาในร่างกาย",
                  "วิธีที่ใช้อาหารเลี้ยงเชื้อแบบเหลว (broth microdilution) สนับสนุนการเติบโตของเชื้อที่เจริญได้ยาก"
                ]
              }
            ]
          },
          {
            "sub": "ข้อเสียเปรียบ",
            "body": [
              {
                "bullets": [
                  "ต้นทุนสูงกว่า",
                  "ใช้อุปกรณ์และขั้นตอนการเตรียมการมากกว่า",
                  "เทคนิคซับซ้อน ต้องอาศัยผู้เชี่ยวชาญ"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ย้ำนิยามอีกครั้งเป็นภาษาไทยว่า MIC คือความเข้มข้นของยาต่ำสุดในการยับยั้งการเจริญของแบคทีเรีย (µg/mL หรือ mg/L) และใช้ตัวอย่าง Staphylococcus pseudintermedius กับตาราง oxacillin breakpoint ชุดเดิม"
          }
        ]
      },
      {
        "heading": "Vitek 2 Compact และลำดับขั้นงานในห้องปฏิบัติการ",
        "source": "Antimicrobial resistance p.16-17",
        "body": [
          {
            "text": "Vitek 2 Compact เป็น automated ID/AST instrument ใช้ **ID card สำหรับ bacterial identification และ AST card สำหรับ antimicrobial susceptibility testing**"
          },
          {
            "sub": "ลำดับงานที่สไลด์วางไว้",
            "body": [
              {
                "bullets": [
                  "Sample collection",
                  "Primary culture ใช้ 1-3 วัน",
                  "Pure culture ใช้ 1 วัน",
                  "สายทางเดิม: Gram's staining และ primary identification ระดับ genus 1 วัน → secondary identification ระดับ species 1 วัน พร้อม disk susceptibility test 1 วัน → result interpretation and report",
                  "สาย Vitek: เลือก ID และ AST cards แล้วเข้าเครื่อง → report"
                ]
              }
            ]
          },
          {
            "bullets": [
              "**ID card ใช้ biochemical tests ได้ถึง 64 การทดสอบ จึงมี high discriminatory power**",
              "**Gram-positive AST panel ครอบคลุมยา 21 ชนิด**"
            ]
          },
          {
            "text": "สไลด์ p.17-18 ที่เหลือเป็นภาพหน้าจอ/ใบรายงานผล species identification และ antimicrobial susceptibility results โดยไม่มีข้อความอธิบายกำกับ"
          }
        ]
      },
      {
        "heading": "AST panels ของ Vitek",
        "source": "Antimicrobial resistance p.17",
        "body": [
          {
            "bullets": [
              "AST panel for gram-positive (Vitek AST-GP81) ยาที่สไลด์ไฮไลต์ไว้คือ amikacin, pradofloxacin, florfenicol, doxycycline และ minocycline",
              "AST panel for gram-negative ยาที่สไลด์ไฮไลต์ไว้คือ neomycin, pradofloxacin และ doxycycline"
            ]
          },
          {
            "callout": "สไลด์ไฮไลต์เฉพาะบางตัวยาบนภาพการ์ด **ไม่ได้ระบุรายชื่อยาทั้งหมดใน panel เป็นข้อความ**",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การแปลผล AST: susceptible, intermediate, resistant",
        "source": "Antimicrobial resistance p.15, p.18",
        "body": [
          {
            "text": "clinical breakpoints แบ่งเป็น 3 categories คือ susceptible, intermediate และ resistant โดยสไลด์ระบุว่ามี **inverse relationship ระหว่างค่าผลที่วัดได้กับ interpretative categories**"
          },
          {
            "sub": "susceptible",
            "body": [
              {
                "text": "เชื้อของผู้ป่วย **ควรตอบสนองต่อการรักษาด้วยยานั้น เมื่อใช้ขนาดยาที่แนะนำตามปกติสำหรับการติดเชื้อชนิดนั้นและสัตว์ชนิดนั้น**"
              }
            ]
          },
          {
            "sub": "resistant",
            "body": [
              {
                "text": "เชื้อของผู้ป่วย **ไม่ควรถูกยับยั้งด้วยความเข้มข้นของยาที่ทำได้จากขนาดยาที่ใช้ตามปกติ**"
              }
            ]
          },
          {
            "sub": "intermediate (buffer zone)",
            "body": [
              {
                "bullets": [
                  "MIC ของเชื้อตกอยู่ในช่วงที่ค่า MIC เข้าใกล้หรือเกินระดับยาที่ร่างกายทำได้",
                  "**clinical response มีแนวโน้มด้อยกว่าเชื้อที่เป็น susceptible strain**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "MIC50 และ MIC90",
        "source": "Antimicrobial resistance p.18",
        "body": [
          {
            "text": "เป็นพารามิเตอร์สำคัญเมื่อทดสอบความไวรับของเชื้อ **หลาย isolates พร้อมกัน** ไม่ใช่ตัวเดียว"
          },
          {
            "bullets": [
              "**MIC50 = ค่า MIC ที่ยับยั้งเชื้อได้มากกว่า 50% ของ isolates**",
              "**MIC90 = ค่า MIC ที่ยับยั้งเชื้อได้มากกว่า 90% ของ isolates**",
              "วิธีหาตำแหน่ง: MIC50 อ่านที่ตำแหน่ง n X 0.5 และ MIC90 อ่านที่ตำแหน่ง n X 0.9"
            ]
          },
          {
            "sub": "ตัวอย่างในสไลด์ (n = 100)",
            "body": [
              {
                "bullets": [
                  "ตำแหน่งที่ 100 x 0.5 = 50 ได้ MIC50 = 2 µg/mL",
                  "ตำแหน่งที่ 100 x 0.9 = 90 ได้ MIC90 = 32 µg/mL"
                ]
              }
            ]
          },
          {
            "callout": "**ถ้า MIC50 กับ MIC90 ห่างกันหลาย dilution steps แปลว่ามีเชื้ออย่างน้อย 2 subpopulations ปนอยู่ในชุดที่ทดสอบ**",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "microbio-1--aquatic-fungi": {
    "topic": "microbio-1--aquatic-fungi",
    "title": "Aquatic fungi: Chytridiomycosis และกลุ่ม fungal-like (Saprolegniasis, Pythiosis, Protothecosis)",
    "icon": "🍄",
    "lecturer": "Nuvee Prapasarakul, D.V.M., Ph.D. (Department of Veterinary Microbiology, Faculty of Veterinary Science, Chulalongkorn University)",
    "summary": "เด็คนี้แบ่งเป็น 2 ก้อนตามที่ outline วางไว้ คือ fungal disease ที่เป็น true fungus หนึ่งโรค (Chytridiomycosis ในสัตว์สะเทินน้ำสะเทินบก) กับ fungal-like diseases อีกสามโรค (Saprolegniasis, Pythiosis, Protothecosis) โดยน้ำหนักส่วนใหญ่ของเด็คตกอยู่ที่ Pythiosis (สไลด์ 16-31) ทั้งลักษณะเชื้อ รูปแบบโรคในม้า สุนัข ลา แพะแกะ โค และคน รวมถึงการวินิจฉัย เนื้อหาจำนวนมากเป็นสไลด์รูปพร้อมคำบรรยายภาพ (p.3, 11-13, 16-17, 22-23, 28-29, 34-36) และหลายสไลด์ให้แค่ keyword ไม่ได้อธิบายกลไกต่อ สไลด์ p.25 ตัว text layer ออกมาปนกันจนอ่านไม่ได้ ปิดท้ายด้วยสไลด์ Conclusions ที่สรุปทั้งสี่โรคเป็นข้อ ๆ",
    "sections": [
      {
        "heading": "โครงของ lecture: true fungus 1 โรค กับ fungal-like 3 โรค",
        "source": "Aquatic fungi p.2",
        "body": [
          {
            "text": "สไลด์ outline แยกหัวข้อไว้ชัดเป็นสองกลุ่ม และกลุ่มหลังคือกลุ่มที่เด็คใช้เวลาเยอะที่สุด"
          },
          {
            "bullets": [
              "**Fungal disease: Chytridiomycosis**",
              "**Fungal-like diseases: Saprolegniasis, Pythiosis, Protothecosis**"
            ]
          },
          {
            "callout": "ชื่อเด็คคือ Water mold / fungal-like infection ดังนั้นเวลาอ่านให้ยึดเส้นแบ่ง true fungus กับ parafungus ไว้ตลอด สไลด์สรุปหน้าสุดท้ายก็แบ่งด้วยเส้นนี้เหมือนกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Chytridiomycosis: ตัวเชื้อและการกระจาย",
        "source": "Aquatic fungi p.4",
        "body": [
          {
            "bullets": [
              "**Chytridion = little pot** (ที่มาของชื่อ)",
              "เป็น infectious disease of amphibians",
              "เชื้อคือ **Batrachochytrium dendrobatidis**",
              "เป็น **non-hyphal zoosporic fungus**",
              "สไลด์อ้าง (Daszak et al. 2003) กับประเด็น extinctions of amphibian species"
            ]
          },
          {
            "text": "พื้นที่ที่สไลด์ระบุ: Western North America, Central America, South America, Eastern Australia และ Dominica กับ Montserrat ใน Caribbean"
          }
        ]
      },
      {
        "heading": "ไทม์ไลน์ของ chytrid fungus และสถานะในไทย",
        "source": "Aquatic fungi p.5",
        "body": [
          {
            "bullets": [
              "In 1996: devastating Australian frogs",
              "In 1998: confirmed to be chytrid fungus",
              "In 1999: specific to amphibians",
              "In 2003: Batrachochytrium dendrobatidis",
              "In 2007: numerous frog species, salamander species, a caecilian species"
            ]
          },
          {
            "text": "**McLeod et al. (2008) found no evidence of Bd in Thailand amphibians** แต่พบใน Japan, China, Hongkong, Korea"
          },
          {
            "callout": "สไลด์นี้จัดหน้าแบบสลับปีกับข้อความ การจับคู่ปีกับเหตุการณ์อ่านตามลำดับที่ปรากฏใน text layer ส่วนรายละเอียดอื่นของแต่ละปีสไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เชื้อไปอยู่ที่ชั้นไหนของผิวหนัง",
        "source": "Aquatic fungi p.6",
        "body": [
          {
            "text": "สไลด์นี้เป็นแผนภาพสั้น ๆ ไล่จาก Environment เข้าสู่ Animals ที่ **keratin layer** โดยระบุตำแหน่งเป็น **stratum granulosum หรือ stratum corneum of the epidermis**"
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าเชื้อเข้าสู่ตัวสัตว์จากสิ่งแวดล้อมด้วยกลไกใด บอกแค่ปลายทางว่าไปที่ keratin layer",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Pathogenesis ของ Chytridiomycosis (Berger et al. 1998)",
        "source": "Aquatic fungi p.7",
        "body": [
          {
            "text": "สไลด์วางเป็นลูกโซ่ในสัตว์ระยะ juveniles และ adults"
          },
          {
            "bullets": [
              "**Bd encysts within skin cells**",
              "**Thicker skin (hyperkeratosis)**",
              "**sloughs off**",
              "**Osmotic regulation error**",
              "**Electrolyte blood levels drop**",
              "**death from cardiac arrest**"
            ]
          },
          {
            "text": "ตำแหน่งรอยโรคที่สไลด์วงเล็บไว้คือ belly, digits และ pelvic"
          },
          {
            "sub": "Mortality rate depend on",
            "body": [
              {
                "bullets": [
                  "**Infective dose (>10,000 zoospore)**",
                  "Temperature",
                  "Age",
                  "Lifestage",
                  "Species",
                  "Strain"
                ]
              },
              {
                "text": "มีคำว่า Eastern tiger salamander กำกับอยู่บนสไลด์ในฐานะภาพประกอบ ส่วนรายละเอียดของตัวอย่างนี้สไลด์ไม่ได้บอก"
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical signs และ lesions ของ Chytridiomycosis",
        "source": "Aquatic fungi p.8",
        "body": [
          {
            "bullets": [
              "Tadpole: **depigmentation at mouthpart**",
              "**thickening of skin** (สไลด์ทำเครื่องหมายดาวเน้นไว้)",
              "reddening of the skin",
              "Slow movements and refuse to move",
              "convulsions",
              "**8 days: anorexia**",
              "**12-15 days: excessive shedding of opaque, tan skin**",
              "Loss nutrient, breath and toxin releasing"
            ]
          }
        ]
      },
      {
        "heading": "Fungal-like infections: Oomycetes คือ parafungus",
        "source": "Aquatic fungi p.9",
        "body": [
          {
            "text": "สไลด์อ้าง Baldauf, 2003; Science จัดตำแหน่งเป็น **Phylum Heterokontophyta, Class Oomycetes** และสรุปด้วยประโยค **Oomycetes = Parafungus**"
          },
          {
            "bullets": [
              "**Motile spores (zoospores) with two flagella (feather และ smooth)**",
              "**Cellulose cell walls**",
              "**Low number of septa**",
              "± Sexual reproduction"
            ]
          },
          {
            "callout": "สี่ข้อนี้คือชุดลักษณะที่ใช้แยก parafungus ออกจาก true fungus ในเด็คนี้ ส่วนองค์ประกอบผนังเซลล์ของ true fungus เอาไว้เทียบ สไลด์หน้านี้ไม่ได้เขียนไว้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Saprolegnia sp. คือ cotton mold",
        "source": "Aquatic fungi p.10",
        "body": [
          {
            "bullets": [
              "**Genus of freshwater mold** ฉายาบนสไลด์คือ **cotton mold**",
              "**Tolerant from 3°C to 33°C**",
              "แหล่งอาศัย: ++ Freshwater, + brackish water และ ± moist soil",
              "แสดงออกเป็น fungal infection ที่เรียกว่า **mycoses**",
              "เป็น **Saprotroph and necrotroph**",
              "**Injured or compromised eggs**"
            ]
          }
        ]
      },
      {
        "heading": "รูปร่างและวงจรของ Saprolegnia",
        "source": "Aquatic fungi p.11-13",
        "body": [
          {
            "text": "สามสไลด์นี้เป็นภาพเกือบทั้งหมด ข้อความที่มีจริงบนสไลด์มีเท่านี้"
          },
          {
            "bullets": [
              "p.11 หัวเรื่อง Life cycle of Saprolegnia (เป็นแผนภาพ ไม่มีข้อความอื่น)",
              "p.12 **Non septate hyphae** และ **Zoosporangium**",
              "p.13 **Primary → secondary zoospores** เรียกว่า Infective cycle ของ Saprolegniasis"
            ]
          },
          {
            "callout": "รายละเอียดของแต่ละขั้นใน life cycle สไลด์ไม่ได้บอกเป็นตัวอักษร ถ้าจะตอบข้อสอบเชิงกลไกต้องกลับไปดูรูปในสไลด์จริง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Clinical signs ของ Saprolegniasis",
        "source": "Aquatic fungi p.14",
        "body": [
          {
            "bullets": [
              "**Fluffy tufts of cotton-like material**",
              "**white to shades of gray and brown hyphae**",
              "**invades epidermal tissues**",
              "**Cell necrosis and skin ulcer**",
              "Fin and gill rod, unhatched eggs (สไลด์สะกดว่า rod)"
            ]
          }
        ]
      },
      {
        "heading": "Susceptible condition สำหรับ Saprolegniasis",
        "source": "Aquatic fungi p.15",
        "body": [
          {
            "text": "สไลด์ไล่ปัจจัยเสี่ยงเป็นคำ ๆ ไม่ได้อธิบายว่าแต่ละอันทำให้ติดเชื้อง่ายขึ้นอย่างไร"
          },
          {
            "bullets": [
              "Crowed hatchery condition",
              "Epidermal integument",
              "Handling",
              "**High steroid level**",
              "Other pathogenic and parasites",
              "Spawning bed",
              "Pollution",
              "Water quality",
              "**Water temperature change**"
            ]
          }
        ]
      },
      {
        "heading": "Parafungus อีกสองตัว: Pythium และ Prototheca",
        "source": "Aquatic fungi p.16-17",
        "body": [
          {
            "text": "สไลด์ p.16 เป็นหน้าคั่นที่จับคู่ **PYTHIUM กับ Pythiosis** และ **PROTOTHECA กับ Protothecosis** ไว้ใต้หัวข้อ PARAFUNGUS ส่วน p.17 เป็นหน้าชื่อเรื่องที่ระบุเชื้อว่า **Pythium insidiosum**"
          }
        ]
      },
      {
        "heading": "ลักษณะของ Pythium insidiosum ในห้องปฏิบัติการ",
        "source": "Aquatic fungi p.18",
        "body": [
          {
            "bullets": [
              "**Growth of 25-45 °C และ grow well at 25-37 °C**",
              "ภาพ A: five days old culture ของ P. insidiosum ที่ 37 °C บน **2% Sabouraud Dextrose Agar**",
              "ภาพ B: P. insidiosum จาก plate cultures แสดง **septate hyphae in lactophenol blue**"
            ]
          },
          {
            "callout": "จุดที่ต้องระวังตอนอ่าน: p.9 บอกว่า Oomycetes มี low number of septa แต่คำบรรยายภาพหน้านี้เขียนว่า septate hyphae สไลด์ไม่ได้อธิบายว่าสองบรรทัดนี้เข้ากันอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pythiosis: ระบาดวิทยาและการติดเชื้อ",
        "source": "Aquatic fungi p.19",
        "body": [
          {
            "bullets": [
              "**Endemic in Thailand**",
              "**High rates of morbidity and mortality**",
              "**Hard for diagnosis / treatment**",
              "**++ dogs, horses and humans** ส่วน **+ cats, claves and birds**",
              "**Infects by drink water, contamination**"
            ]
          },
          {
            "text": "สไลด์ระบุว่า human and horse hair, skin และ decaying animal and plant tissue เป็น **chemoattractants for its zoospores**"
          }
        ]
      },
      {
        "heading": "รูปแบบของ Pythiosis ในสัตว์",
        "source": "Aquatic fungi p.20",
        "body": [
          {
            "text": "สไลด์เน้นด้วยดาวว่า **Immunocompetent hosts: horses and dogs**"
          },
          {
            "bullets": [
              "Cutaneous form",
              "Intestinal form",
              "Lung and bone infection",
              "Systemic dissemination"
            ]
          }
        ]
      },
      {
        "heading": "Cutaneous pythiosis และ kunkers",
        "source": "Aquatic fungi p.21-23",
        "body": [
          {
            "text": "ชื่อเรียกอีกอย่างบนสไลด์คือ **Swamp cancer**"
          },
          {
            "bullets": [
              "**Itching at ventral trunk, leg and head**",
              "**Open wound + stinky**",
              "ลักษณะรอยโรค: **Ulcerative pyogranulomatous** และ **Fibrogranulomatous**"
            ]
          },
          {
            "sub": "Kunkers",
            "body": [
              {
                "bullets": [
                  "p.21 บอกว่า kunkers เป็น **tumor-like and consist of necrotic tissue, containing eosinophils and hyphae**",
                  "p.22 บอกว่าเป็น **hard coral-like mass** และเป็น **granulomatous coagula consist of necrotic Mc, Eo and hyphae**",
                  "p.23 เป็นภาพ horse pythiosis with bone involvement จาก chronic case โดยระบุว่า kunkers ที่เอาออกมา **containe viable hyphae ของ P. insidiosum**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Differential signs: ม้า vs สุนัข",
        "source": "Aquatic fungi p.24",
        "body": [
          {
            "sub": "Horse",
            "body": [
              {
                "bullets": [
                  "**mainly skin and bone lesions**",
                  "lameness, enlargement of regional lymph nodes",
                  "anemia and hypoproteinemia",
                  "stenotic fibrous and disseminated gastrointestinal lesions"
                ]
              }
            ]
          },
          {
            "sub": "Dog",
            "body": [
              {
                "bullets": [
                  "**mainly gastrointestinal lesions**",
                  "vomiting, weight loss, intermittent diarrhea",
                  "palpable masses in the abdomen",
                  "lesions may involve legs and face or tail",
                  "**young immunocompetent adults**"
                ]
              }
            ]
          },
          {
            "callout": "คู่ที่ต้องจำคือ ม้าเด่นที่ skin และ bone ส่วนสุนัขเด่นที่ gastrointestinal",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "สไลด์ p.25 อ่านไม่ได้",
        "source": "Aquatic fungi p.25",
        "body": [
          {
            "text": "text layer ของสไลด์นี้ออกมาซ้อนกันจนอ่านไม่ออก ส่วนที่ยังอ่านได้เป็นประโยคเดียวคือ **Intestinal pythiosis is the most ...** ที่เหลือของสไลด์นี้อ่านไม่ได้ จึงไม่สรุปเนื้อหาเพิ่ม"
          },
          {
            "callout": "ถ้าจะใช้สไลด์นี้ตอนอ่านสอบ ต้องเปิดไฟล์สไลด์ตัวจริงดูเอง อย่าเดาจากข้อความที่ปนกัน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Pythiosis ในสัตว์ชนิดอื่น: ลา แพะแกะ และโค",
        "source": "Aquatic fungi p.26-27",
        "body": [
          {
            "sub": "Donkey (p.26)",
            "body": [
              {
                "text": "**Cutaneous and rhinopharyngeal disease** ร่วมกับ **bilateral serosanguineous nasal discharge** และ **swelling of nostrils** ส่วนหัวข้อ Goat and sheep with pythiosis บนสไลด์เดียวกันมีแต่ชื่อกับภาพ รายละเอียดสไลด์ไม่ได้บอก"
              }
            ]
          },
          {
            "sub": "Cattle (p.27)",
            "body": [
              {
                "bullets": [
                  "**Sporadic and epizootic diseases**",
                  "**Limbs with pruritus and claudication**",
                  "**Tumor-like masses with fistulae and ulcerated tissue**",
                  "Granulomas: hyphae surrounding with eosinophilic",
                  "**Painful, cannot stand up leads to dehydration**",
                  "**Death from secondary bacterial contamination with anaerobes**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pythiosis ในคน",
        "source": "Aquatic fungi p.28-29",
        "body": [
          {
            "text": "สองสไลด์นี้เป็นภาพผู้ป่วยพร้อมคำบรรยาย"
          },
          {
            "bullets": [
              "**Subcutaneous pythiosis in human**",
              "**Orbital pythiosis** ซึ่งสไลด์ระบุว่า similar to orbital zygomycosis and aspergillosis",
              "**Pythiosis in his carotid artery**",
              "ภาพขาที่ถูก amputate ของผู้ป่วย pythiosis แสดง **aneurysm in the femoral artery caused by P. insidiosum from a Thai human patient**"
            ]
          }
        ]
      },
      {
        "heading": "Clinical diagnosis และการยืนยัน Pythiosis",
        "source": "Aquatic fungi p.30-31",
        "body": [
          {
            "sub": "Clinical diagnosis (p.30)",
            "body": [
              {
                "bullets": [
                  "**Presence of the agent by wet mount examination in 10% KOH followed by culturing**",
                  "**Detection of anti-P. insidiosum antibodies using serological assays**",
                  "**Detection of DNA of the infectious agent in the infected tissue by PCR and sequencing**"
                ]
              },
              {
                "callout": "ประโยคที่ต้องจำไปสอบ: **Cytology and histology cannot differentiate between pythiosis and zygomycosis**",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "Confirmation (p.31)",
            "body": [
              {
                "bullets": [
                  "**Kunkers + hyphae presented on KOH + white colony**",
                  "**Induction of zoosporangium + zoospores** โดยการ culture ใน **calcium and magnesium ions และ grass leaves**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Protothecosis: โรคจาก green alga",
        "source": "Aquatic fungi p.32",
        "body": [
          {
            "text": "สไลด์พาดหัวตรง ๆ ว่า **disease from green alga**"
          },
          {
            "bullets": [
              "เชื้อ: **Prototheca wickerhamii และ P. zopfii**",
              "Susceptible hosts: **dogs, cats, cattle, and humans**",
              "แหล่ง: **In sewage and soil worldwide**",
              "ในสุนัข: **females และ Collies most commonly affected**",
              "ในโค: **protothecal enteritis and mastitis**"
            ]
          }
        ]
      },
      {
        "heading": "Canine protothecosis: อาการและรอยโรค",
        "source": "Aquatic fungi p.33-34",
        "body": [
          {
            "sub": "Clinical signs (p.33)",
            "body": [
              {
                "bullets": [
                  "**Nodular skin lesion**",
                  "**Chronic diarrhea**",
                  "**Acute blindness: uveitis, retinal detachment**",
                  "**Failure of gastrointestinal, cardiovascular, renal, and central nervous systems**"
                ]
              }
            ]
          },
          {
            "sub": "Systemic protothecosis และภาพประกอบ (p.34)",
            "body": [
              {
                "bullets": [
                  "Rectal scraping จากสุนัข: organisms มี **thin cell wall, vary size และ granular internal structure**",
                  "Nodular lesion ที่ **myocardial surface และ pancreas**",
                  "**Opacification: Lt cornea**",
                  "**Edema, thickening, diffuse hemorrhage: mucosa**",
                  "Paw ของสุนัขที่มี **draining ulcers** จาก cutaneous protothecosis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แยกกับ Cryptococcosis: look alike between non-staining bug",
        "source": "Aquatic fungi p.35",
        "body": [
          {
            "bullets": [
              "**Canine Cryptococcosis: Nasal discharge**",
              "**Canine Protothecosis: Chronic diarrhea, retinal detachment, nodular skin lesion**",
              "Needle aspiration and H and E: **Floret-like arrangement**"
            ]
          },
          {
            "callout": "บรรทัด Floret-like arrangement อยู่บนสไลด์เปรียบเทียบหน้านี้ แต่จาก text layer ระบุไม่ได้แน่ชัดว่าอยู่คอลัมน์ของโรคไหน ต้องเปิดสไลด์จริงดูตำแหน่งก่อนใช้ตอบข้อสอบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Feline protothecosis",
        "source": "Aquatic fungi p.36",
        "body": [
          {
            "bullets": [
              "a) **Spherical Algae Body by Diff-Quik** จาก Fine Needle Aspiration",
              "b) Unstained cell from culture",
              "ตำแหน่งรอยโรคที่สไลด์ยกมา: **cutaneous mass between the metacarpal pad and digital pads**"
            ]
          }
        ]
      },
      {
        "heading": "สรุปวิธีวินิจฉัยสองโรคคู่กัน",
        "source": "Aquatic fungi p.37",
        "body": [
          {
            "bullets": [
              "**Pythiosis: FNA/Biopsy, Culture, ELISA**",
              "**Protothecosis: FNA/Biopsy, Culture/VITEX**"
            ]
          },
          {
            "callout": "จุดต่างบนสไลด์นี้คือขาที่สามของแต่ละโรค Pythiosis ไปทาง ELISA ส่วน Protothecosis ไปทาง VITEX",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Conclusions ของทั้งเด็ค",
        "source": "Aquatic fungi p.38",
        "body": [
          {
            "text": "สไลด์สุดท้ายแบ่งเป็นสองคอลัมน์คือ **True Fungus** กับ **Parafungus**"
          },
          {
            "sub": "True Fungus",
            "body": [
              {
                "bullets": [
                  "**Chytridiomycosis** อยู่ใน subtropical and cold area",
                  "เป็น **amphibian disease with high mortality**",
                  "**No report in Thailand**"
                ]
              }
            ]
          },
          {
            "sub": "Parafungus",
            "body": [
              {
                "bullets": [
                  "**Saprolegniasis**: cotton mold ใน subtropical area, **skin ulcer and secondary infection**",
                  "**Pythiasis** (สไลด์สะกดแบบนี้): common in **horse, dog and human**, **granulomatous mass with kunker**, วินิจฉัยด้วย **culture, DNA sequencing และ serological diagnosis**",
                  "**Protothecosis**: common in **Collie และ Shetland sheep dogs**, **nodular skin, blindness and diarrhea**, เห็น **spherical algae body with granular**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์สรุปเพิ่มชื่อ Shetland sheep dogs เข้ามาในกลุ่มพันธุ์ที่พบบ่อยของ protothecosis ซึ่ง p.32 ไม่ได้เขียนไว้ ให้ยึดว่าเด็คพูดถึงทั้ง Collie และ Shetland sheep dogs",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "microbio-1--bacterial-genetics": {
    "topic": "microbio-1--bacterial-genetics",
    "title": "Bacterial genetics",
    "icon": "🦠",
    "lecturer": "Pattrarat Chanchaithong",
    "summary": "เด็คนี้ไล่ตั้งแต่พื้นฐาน genetics และโครงสร้าง DNA ไปจนถึงสิ่งที่เป็นแกนของวิชานี้จริง ๆ คือ bacterial chromosome ต่างจาก eukaryotic chromosome ตรงไหน mutation เกิดได้อย่างไรและมีผลอะไร gene transfer ทั้ง 3 แบบ (transformation, conjugation, transduction) mobile genetic elements (plasmid, integron, transposon) และปิดท้ายด้วย bacterial typing แบบ phenotyping กับ genotyping ตัวอย่างทางคลินิกที่สไลด์ยกมาชัดคือ fluoroquinolone resistance จาก gyr gene mutation, diphtheria toxin จาก beta prophage, Salmonella DT104 กับ SGI-1 และ MRSA fingerprinting มีหลายสไลด์ (p.15, 24, 40, 41, 45, 46) ที่เป็นภาพประกอบล้วนหรือมีข้อความน้อยมาก โน้ตนี้จึงเขียนเท่าที่สไลด์พูดจริงเท่านั้น",
    "sections": [
      {
        "heading": "Outline ของเด็คและนิยาม genetics",
        "source": "Bacterial genetics p.2",
        "body": [
          {
            "bullets": [
              "Basic genetics",
              "Structure of DNA and chromosome",
              "Flow of genetic information",
              "Mutations",
              "Gene transfer",
              "Mobile genetic elements",
              "Bacterial strain typing"
            ]
          },
          {
            "sub": "นิยาม (p.3)",
            "body": [
              {
                "text": "**GENETICS คือการศึกษา genes, heredity และ variation** ครอบคลุมข้อมูลที่เก็บใน gene, genetic materials และ gene expression"
              },
              {
                "text": "**genotype (arrangement of genes) เมื่อ interaction กับ environment จะแสดงออกเป็น phenotype (physical characteristics)** สไลด์อ้างถึง Johann Gregor Mendel (1822-1884)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Genome, chromosome, gene, allele",
        "source": "Bacterial genetics p.4",
        "body": [
          {
            "bullets": [
              "Cell's genome ถูกเก็บไว้ใน chromosome",
              "Chromosome = chain of double stranded DNA",
              "Genes = sequences of nucleotides",
              "**Alternate forms of gene เรียกว่า allele** (สไลด์ยกมาในบริบทของ eukaryotic chromosome)"
            ]
          }
        ]
      },
      {
        "heading": "โครงสร้าง DNA (Watson and Crick)",
        "source": "Bacterial genetics p.5",
        "body": [
          {
            "text": "**DNA เป็น nucleotide polymer ที่เป็น double helix และ antiparallel**"
          },
          {
            "bullets": [
              "COMPONENTS: Sugar phosphate backbone และ Nitrogenous bases"
            ]
          },
          {
            "sub": "องค์ประกอบย่อย (p.6)",
            "body": [
              {
                "text": "Deoxyribonucleic acid ประกอบด้วย Deoxyribose sugar, Phosphate group และ Nitrogenous bases"
              },
              {
                "text": "**เบสแบ่งเป็น Pyrimidine (Thymine, Cytosine) และ Purine (Adenine, Guanine)** สไลด์จับคู่ Thymine กับ Adenine และ Cytosine กับ Guanine"
              }
            ]
          }
        ]
      },
      {
        "heading": "Eukaryotic vs bacterial chromosome",
        "source": "Bacterial genetics p.7",
        "body": [
          {
            "sub": "EUKARYOTIC CHROMOSOME (p.7)",
            "body": [
              {
                "bullets": [
                  "located in nucleus",
                  "linear",
                  "diploid",
                  "มี Histone protein"
                ]
              }
            ]
          },
          {
            "sub": "BACTERIAL CHROMOSOME (p.8)",
            "body": [
              {
                "bullets": [
                  "located in cytoplasm",
                  "**single circular DNA**",
                  "**haploid จึงไม่มี dominant และ recessive genes**",
                  "no histone protein",
                  "continuous replication and transcription"
                ]
              }
            ]
          },
          {
            "callout": "ข้อยกเว้นที่สไลด์ระบุชื่อไว้ให้จำ MULTIPLE CHROMOSOME ได้แก่ Leptospira interrogans, Brucella spp., Burkholderia spp., Vibrio cholera ส่วน LINEAR CHROMOSOME ได้แก่ Borrelia และ Streptomyces",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Coding vs non-coding region และการไม่มี intron ในแบคทีเรีย",
        "source": "Bacterial genetics p.9",
        "body": [
          {
            "bullets": [
              "Coding region = gene ที่ถูกอ่านโดย translation machinery",
              "Non-coding region = จำเป็นต่อการ expression ของข้อมูลพันธุกรรม แต่ไม่ถูก translate เป็น peptide เช่น promotor, intron"
            ]
          },
          {
            "text": "**Bacterial chromosome ไม่มี intron จึงไม่มี mRNA maturation** ต่างจาก eukaryotes ที่มี processes of mRNA"
          }
        ]
      },
      {
        "heading": "Promotor, cistron และ polycistronic mRNA",
        "source": "Bacterial genetics p.10",
        "body": [
          {
            "bullets": [
              "PROMOTOR เป็น non-coding region ใช้เป็นที่ binding ของ RNA polymerase",
              "Cistron = segment of DNA ที่ carry codons ซึ่งกำหนด peptide ตัวหนึ่ง"
            ]
          },
          {
            "text": "**EUKARYOTIC GENES เป็น monocistronic คือ 1 promotor สร้าง 1 mRNA ที่มักแปลได้โปรตีนเดียว ส่วน BACTERIAL GENES เป็น polycistronic คือ 1 promotor สร้าง 1 mRNA ที่แปลได้โปรตีนมากกว่า 1 ชนิด**"
          }
        ]
      },
      {
        "heading": "Central Dogma และ codon",
        "source": "Bacterial genetics p.11",
        "body": [
          {
            "text": "**Flow of genetic information คือ DNA makes RNA makes protein** ผ่าน Replication, Transcription และ Translation"
          },
          {
            "sub": "Codon (p.12)",
            "body": [
              {
                "text": "messenger RNA คือ sense strand และ **Codon คือ triplet code ที่กำหนด amino acid**"
              },
              {
                "bullets": [
                  "**start codon = AUG**",
                  "**stop codon = UAA, UAG, UGA**"
                ]
              }
            ]
          },
          {
            "sub": "Redundant / degenerate code (p.13)",
            "body": [
              {
                "text": "**CODON เป็น redundant หรือ degenerate** สไลด์ยกตัวอย่าง ARGININE ที่มีได้หลาย codon คือ AGA AGG CGU CGC CGA CGG ส่วน AUG = METHIONINE"
              },
              {
                "text": "stop codon เป็น non sense codons ที่ไม่ code สำหรับ amino acid ใดเลย"
              }
            ]
          }
        ]
      },
      {
        "heading": "OPERON concept และ lac operon",
        "source": "Bacterial genetics p.14",
        "body": [
          {
            "text": "โปรตีนบางตัวไม่ได้จำเป็นตลอดเวลา จะถูกสร้างเมื่อมีความต้องการหรือถูกกระตุ้นด้วยสภาพแวดล้อมบางอย่าง สไลด์เรียกว่า **a special energy saving system of genetic control**"
          },
          {
            "sub": "ส่วนประกอบของ lac operon ใน E. coli",
            "body": [
              {
                "bullets": [
                  "lacI = Regulator สร้าง repressor protein",
                  "lacP = Promotor เป็นที่ RNA polymerase มาจับ",
                  "lacO = Operator เป็นที่ repressor protein มาจับเมื่อไม่มี lactose",
                  "lacZ, lacY, lacA = Structural genes สร้างเอนไซม์ย่อย lactose ได้แก่ beta galactosidase, galactoside permease และ transacetylase"
                ]
              },
              {
                "text": "**เมื่อมี lactose repressor protein จะออกจาก operator แล้วไปจับกับ lactose แทน**"
              }
            ]
          },
          {
            "callout": "p.15 เป็นสไลด์ภาพ OPERON concept ไม่มีข้อความอธิบายเพิ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "MUTATIONS หลักการพื้นฐาน",
        "source": "Bacterial genetics p.16",
        "body": [
          {
            "text": "Mutation คือ **การเปลี่ยนแปลงลำดับของ template DNA ซึ่งมีผลต่อชนิดของโปรตีนที่เป็น end product** ทำให้เกิด mutants ต่างจาก wild type"
          },
          {
            "bullets": [
              "เกิดได้ทั้งแบบ spontaneously และจาก mutagens ทั้ง chemical และ physical",
              "**Mutation rate ของ gene ใด gene หนึ่งมีค่าคงที่**",
              "**Spontaneous mutation เกิดประมาณ 1 ในทุก ๆ 1 ล้าน ถึง 1 ในทุก ๆ 1 พันล้านการแบ่งตัว และเกิดระหว่าง DNA replication**"
            ]
          }
        ]
      },
      {
        "heading": "Mutation rate แยกตามชนิดของยีน",
        "source": "Bacterial genetics p.17",
        "body": [
          {
            "text": "สไลด์แบ่งยีนเป็น 3 กลุ่มตามอัตราการกลายพันธุ์ ข้อนี้ออกสอบง่ายเพราะจับคู่ชื่อยีนกับกลุ่มได้ตรง ๆ"
          },
          {
            "bullets": [
              "**STRUCTURAL GENES (low mutation rate) เช่น 16S rRNA gene, 23S rRNA gene**",
              "**HOUSEKEEPING GENES (moderate mutation rate) เช่น sodA (superoxide dismutase), hsp60 (heat shock protein 60) gene**",
              "**HYPERVARIABLE GENES (high mutation rate) เช่น resistance genes, virulence genes**"
            ]
          }
        ]
      },
      {
        "heading": "MECHANISMS of MUTATION",
        "source": "Bacterial genetics p.18",
        "body": [
          {
            "sub": "1. Substitution of nucleotide (point mutation)",
            "body": [
              {
                "bullets": [
                  "**transition = purine เปลี่ยนเป็น purine (A หรือ G) หรือ pyrimidine เปลี่ยนเป็น pyrimidine (C หรือ T)**",
                  "**transversion = purine เปลี่ยนเป็น pyrimidine หรือกลับกัน**"
                ]
              }
            ]
          },
          {
            "sub": "2. Deletion or insertion of nucleotide (p.19)",
            "body": [
              {
                "text": "สไลด์ระบุกลไกที่สองไว้เท่านี้ ที่เหลือเป็นภาพประกอบ สไลด์ไม่ได้อธิบายรายละเอียดเพิ่ม"
              }
            ]
          }
        ]
      },
      {
        "heading": "RESULTS of MUTATION",
        "source": "Bacterial genetics p.20",
        "body": [
          {
            "bullets": [
              "**MISSENSE = one wrong codon ทำให้ได้ one wrong amino acid**",
              "**NONSENSE = เกิด stop codon ขึ้น ทำให้ protein synthesis หยุดกลางคัน**",
              "**SILENT = codon ใหม่ยัง code amino acid ตัวเดิม (synonymous)**",
              "**FRAMESHIFT = a shift of reading frame**",
              "**LETHAL = กระทบ vital functions จน mutation ฆ่าเซลล์**"
            ]
          }
        ]
      },
      {
        "heading": "SIGNIFICANCE of MUTATION",
        "source": "Bacterial genetics p.21",
        "body": [
          {
            "bullets": [
              "การค้นพบ mutation ใน gene หนึ่ง ช่วยระบุ function ของ gene นั้น",
              "การเหนี่ยวนำ mutation ที่ตำแหน่งที่ต้องการ ใช้สร้าง mutant ที่เหมาะสม โดยเฉพาะ **เพื่อผลิตวัคซีน**",
              "**เป็นที่มาของการเกิด antimicrobial resistance ในแบคทีเรีย**",
              "ทำให้ phenotype เปลี่ยน เช่น novel surface antigen, physiological properties, colony morphology, growth characteristics, virulence และ host range"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างทางคลินิก fluoroquinolone resistance",
        "source": "Bacterial genetics p.22",
        "body": [
          {
            "text": "**FLUOROQUINOLONES เช่น ciprofloxacin, norfloxacin, enrofloxacin ออกฤทธิ์ยับยั้ง DNA replication ของแบคทีเรีย โดยจับกับ DNA gyrase และ topoisomerase IV**"
          },
          {
            "sub": "กลไกดื้อยาจาก mutation (p.23)",
            "body": [
              {
                "text": "**ภายใต้ antibiotic pressure เกิด mutation ของ gyr genes ได้ โดย DNA gyrase เป็นโปรตีนที่ถูก encode ด้วย gyrA และ gyrB genes**"
              },
              {
                "text": "ตำแหน่งที่ fluoroquinolone จับเรียกว่า **quinolone-binding pocket** และบริเวณที่กลายพันธุ์แล้วทำให้ดื้อยาเรียกว่า **Quinolone-resistant determining regions (QRDR)**"
              },
              {
                "bullets": [
                  "การเปลี่ยน amino acid ที่สไลด์ยกไว้: Alanine (A) เป็น Glycine (G), Aspartate (D) เป็น Asparagine (N), Serine (S) เป็น Leucine (L)"
                ]
              },
              {
                "text": "**ผลลัพธ์คือ FQ จับไม่ได้ แต่ gyrase ยังทำงานได้ตามปกติ** จึงเป็นการดื้อยาที่แบคทีเรียไม่ต้องเสียการทำงานของเอนไซม์ตัวเอง"
              }
            ]
          },
          {
            "callout": "p.24 เป็นสไลด์ภาพภายใต้หัวข้อ SIGNIFICANCE of MUTATION ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Genetic recombination และ crossing over",
        "source": "Bacterial genetics p.25",
        "body": [
          {
            "bullets": [
              "Genetic recombination เกิดเมื่อ DNA สองชิ้นมาสัมผัสกัน แล้วมีการแลกเปลี่ยนบางส่วนของ DNA แต่ละสาย"
            ]
          },
          {
            "text": "**CROSSING OVER คือเมื่อ DNA สองสายที่มี homologous regions มาอยู่ใกล้กัน สายหนึ่งจากแต่ละฝั่งจะ cross over ไปติดกับสายใหม่ ทำให้ยีนใหม่ถูกถ่ายไปยังอีกสายหนึ่ง เรียกว่า HOMOLOGOUS RECOMBINATION**"
          }
        ]
      },
      {
        "heading": "Vertical vs horizontal gene transfer",
        "source": "Bacterial genetics p.26",
        "body": [
          {
            "bullets": [
              "**VERTICAL GENE TRANSFER = จาก parent ไปยัง offspring**",
              "**HORIZONTAL GENE TRANSFER = ระหว่าง donor และ recipient ได้แก่ Transformation, Conjugation และ Transduction**"
            ]
          }
        ]
      },
      {
        "heading": "TRANSFORMATION",
        "source": "Bacterial genetics p.27",
        "body": [
          {
            "text": "**Transformation คือ recipient bacterium รับ free หรือ naked DNA ที่ donor ปล่อยออกมา แล้ว free DNA เข้าไป incorporate ใน chromosome**"
          },
          {
            "sub": "STEPS ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "1. A donor bacterium dies and is degraded.",
                  "2. ชิ้นส่วน DNA จาก dead donor จับกับ DNA binding proteins บน cell wall ของ recipient ที่ยังมีชีวิต",
                  "3. Nuclease enzymes ตัด DNA ที่จับอยู่ให้เป็นชิ้น ๆ",
                  "4. DNA แทรกเข้าสู่ recipient bacterium",
                  "5. **RecA protein promotes recombination**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Griffith's experiment (1928)",
        "source": "Bacterial genetics p.28",
        "body": [
          {
            "text": "การทดลองใช้ Streptococcus pneumoniae (pneumococci) 2 แบบ"
          },
          {
            "bullets": [
              "**TYPE I = capsulated strain ขึ้นเป็น smooth (S) colonies**",
              "**TYPE II = noncapsulated strain ขึ้นเป็น rough (R) colonies**"
            ]
          },
          {
            "sub": "ผลการทดลอง (p.29)",
            "body": [
              {
                "bullets": [
                  "Rough (R) non capsulated Type II strain เดี่ยว ๆ หนูรอด",
                  "Smooth (S) capsulated Type I strain หนูตาย",
                  "Heat killed smooth (S) capsulated Type I strain หนูรอด",
                  "**Rough (R) Type II ผสมกับ heat killed smooth (S) Type I หนูรอด แต่แยกเชื้อ smooth capsulated Type I strain ได้จากเลือด**"
                ]
              },
              {
                "callout": "บรรทัดในสไลด์แถวสุดท้ายมี watermark ทับข้อความ ทำให้อ่านได้ว่าเป็น heat killed smooth (S) noncapsulated Type I strain ซึ่งขัดกับบรรทัดบน จุดนี้ให้ยึดตามที่สไลด์เขียนไว้ก่อนหน้าว่า smooth (S) = capsulated",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "CONJUGATION",
        "source": "Bacterial genetics p.30",
        "body": [
          {
            "text": "**Conjugation คือการถ่ายทอด DNA จาก living donor bacterium ไปยัง recipient bacterium** เกิดได้ใน same species หรือ related species"
          },
          {
            "sub": "Plasmid ที่ถูกถ่าย",
            "body": [
              {
                "bullets": [
                  "Plasmid เป็น mobile genetic element",
                  "เป็น circular pieces of double-stranded circular DNA",
                  "**self replication ได้**"
                ]
              }
            ]
          },
          {
            "sub": "F factor และการจับคู่ (p.31)",
            "body": [
              {
                "bullets": [
                  "**F+ = male, donor และ F- = female, recipient**",
                  "**F factor เรียกได้ทั้ง F plasmid, fertility factor หรือ sex factor**",
                  "Sex pilus จับกับ outer membrane protein ที่จำเพาะ"
                ]
              }
            ]
          },
          {
            "sub": "ผลของ F+ conjugation (p.32)",
            "body": [
              {
                "text": "**F+ conjugation คือการถ่าย F plasmid ซึ่ง code เฉพาะ sex pilus เท่านั้น ไม่ได้ถ่าย chromosomal DNA และผลคือ recipient กลายเป็น F+**"
              }
            ]
          }
        ]
      },
      {
        "heading": "TRANSDUCTION และวงจรชีวิตของ bacteriophage",
        "source": "Bacterial genetics p.33",
        "body": [
          {
            "text": "**Bacteriophage คือไวรัสที่ parasitize แบคทีเรีย โดยใช้ machinery ของแบคทีเรียในการเพิ่มจำนวนของตัวเอง**"
          },
          {
            "bullets": [
              "Progeny ของ phage อาจมีทั้ง host chromosome และ DNA ของ phage เอง",
              "เมื่อ phage ไปติดแบคทีเรียตัวใหม่ จึงเกิดการถ่าย bacterial chromosome เข้าสู่ chromosome ใหม่",
              "จากนั้นเกิด recombination กับ host chromosome"
            ]
          },
          {
            "sub": "Lytic และ lysogenic cycle (p.34-35)",
            "body": [
              {
                "text": "**lysogenic cycle คือ phage DNA เข้าไป incorporate กับ chromosome ของแบคทีเรีย เรียกกระบวนการนี้ว่า lysogenic conversion แบคทีเรียกลายเป็น lysogenic bacteria และ phage ที่แทรกอยู่เรียกว่า prophage**"
              },
              {
                "bullets": [
                  "1. lytic bacteriophage adsorbs กับแบคทีเรียที่ susceptible",
                  "2. genome ของ bacteriophage เข้าสู่แบคทีเรีย และใช้ metabolic machinery ของแบคทีเรีย",
                  "3. Multiplication ของ phage DNA และ phage capsids พร้อมสร้าง phage components และ enzymes",
                  "4. **Packaging ของ phage DNA เข้า capsid พร้อมกับ accidental packaging ของ host DNA**",
                  "5. Lysis of cell แล้วปล่อย phage ที่มีทั้ง DNA ของตัวเองและชิ้นส่วน host chromosomal DNA ออกมา"
                ]
              }
            ]
          },
          {
            "sub": "การส่งต่อไปยังตัวรับ (p.36)",
            "body": [
              {
                "text": "6. Phage ที่มี bacterial chromosomal DNA เข้าไปติดแบคทีเรียตัวใหม่ จากนั้น 7. **transduced chromosomal DNA แลกเปลี่ยนยีนกับ host chromosome โดย recombination**"
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างทางคลินิกของ transduction",
        "source": "Bacterial genetics p.37",
        "body": [
          {
            "bullets": [
              "**Corynebacterium diphtheriae ที่ถูก lysogenised ด้วย beta prophage จะสร้าง diphtheria toxin**",
              "**Salmonella enterica serovar Typhimurium definitive phage type DT104 มี Salmonella genomic island (SGI) I ซึ่งให้ทั้ง multidrug resistance และ virulence**"
            ]
          }
        ]
      },
      {
        "heading": "MOBILE GENETIC ELEMENTS: Plasmid",
        "source": "Bacterial genetics p.38",
        "body": [
          {
            "bullets": [
              "extrachromosomal elements",
              "circular form หรือ linear form",
              "self replication และมี origin of replication (ORI)",
              "multiple copies",
              "**ขนาดตั้งแต่ 1 kilobasepairs ถึง 400 kilobasepairs**"
            ]
          },
          {
            "text": "**Plasmid บรรจุยีนที่ไม่จำเป็นต่อการอยู่รอด แต่ให้ข้อได้เปรียบเพิ่มเติมแก่เซลล์**"
          },
          {
            "sub": "ความสำคัญและการประยุกต์ (p.39)",
            "body": [
              {
                "bullets": [
                  "**code สำหรับการดื้อยาปฏิชีวนะหลายชนิด**",
                  "code สำหรับการสร้าง toxin ได้แก่ enterotoxins โดย E. coli และ Vibrio cholera, exfoliative toxin โดย S. aureus, neurotoxins โดย Clostridium tetani",
                  "code สำหรับ resistance to heavy metals",
                  "code สำหรับ resistance to UV light ผ่าน DNA repairing enzymes"
                ]
              },
              {
                "text": "Application ที่สไลด์ระบุคือใช้เป็น vectors ใน genetic engineering และใช้ plasmid profiling เป็น genotyping method"
              }
            ]
          }
        ]
      },
      {
        "heading": "Colistin resistance",
        "source": "Bacterial genetics p.40",
        "body": [
          {
            "text": "**Colistin เป็น last-resort antimicrobial และเป็น critically important drug สำหรับ serious infection ตาม WHO ปี 2014**"
          },
          {
            "text": "p.41 พาดหัวว่า Discovery of Mechanism of Colistin Resistance โดยระบุว่าเป็น colistin resistance ใน E. coli แต่ **สไลด์ไม่ได้บอกชื่อยีนหรือกลไกระดับโมเลกุลไว้เป็นข้อความ** ส่วนที่เหลือของสไลด์เป็นภาพ"
          },
          {
            "callout": "สไลด์วาง colistin ไว้ในหมวด MOBILE GENETIC ELEMENTS จึงอนุมานบริบทได้ว่าเกี่ยวกับ plasmid แต่สไลด์ไม่ได้เขียนไว้ตรง ๆ อย่าเติมเอง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Integron และ gene cassette",
        "source": "Bacterial genetics p.42",
        "body": [
          {
            "text": "**Integron คือ genetic element ที่สามารถ acquire และ rearrange ORFs ที่ฝังอยู่ใน gene cassette units แล้วเปลี่ยนให้กลายเป็น functional genes**"
          },
          {
            "text": "สไลด์ระบุทิศทางว่า CHROMOSOMAL INTEGRONS ไปสู่ MOBILE INTEGRONS"
          },
          {
            "sub": "องค์ประกอบที่ต้องจำ",
            "body": [
              {
                "bullets": [
                  "**intI = integrase enzyme**",
                  "**Pc = strong promotor**",
                  "**attI = specific site for insertion**",
                  "**attC = recombination site ที่ถูกจดจำโดย intI**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Transposable genetic elements",
        "source": "Bacterial genetics p.43",
        "body": [
          {
            "text": "**Transposable genetic elements คือ segments of DNA ที่มีความสามารถย้ายจากตำแหน่งหนึ่งไปอีกตำแหน่งหนึ่ง หรือที่เรียกว่า jumping gene**"
          },
          {
            "sub": "Properties ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "Random movement แต่ย้ายไปยัง preferred site ของโมเลกุล DNA",
                  "**ไม่สามารถ self replication ได้ ต้องถูก replicate ในฐานะส่วนหนึ่งของ replicon อื่น**",
                  "**Transposition อาศัย site specific recombination โดยใช้ transposase ที่ transposable element เป็นตัว code เอง และไม่ต้องการ homology จึงเป็น non homologous recombination**",
                  "Transposition เกิดผ่านการ duplication ได้ คือย้ายออกจากตำแหน่งเดิม หรือทิ้งสำเนาไว้หนึ่งชุด"
                ]
              }
            ]
          },
          {
            "sub": "TRANSPOSON (Tn) (p.44)",
            "body": [
              {
                "text": "**transposonase จดจำ inverted repeats แล้วตัด transposon ออกมา และยีนดื้อยาปฏิชีวนะมักอยู่บน transposon**"
              }
            ]
          },
          {
            "callout": "p.45 และ p.46 เป็นสไลด์ภาพล้วน โดย p.46 มีเพียงหัวข้อ BACTERIAL TYPING",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "PHENOTYPING และตัวอย่าง E. coli",
        "source": "Bacterial genetics p.47",
        "body": [
          {
            "bullets": [
              "**วิธี PHENOTYPING ที่สไลด์ยกตัวอย่างคือ serotyping, biochemical characteristics และ protein pattern**"
            ]
          },
          {
            "sub": "ตัวอย่าง E. coli",
            "body": [
              {
                "text": "E. coli เป็น normal flora in animal intestine และเป็น causative agent ของ opportunistic infection, diarrhea, urinary tract infection และ hemolytic uremic syndrome"
              },
              {
                "bullets": [
                  "**E. coli O157:H7 = Enterohaemorrhagic E. coli ที่สร้าง Shiga-like toxin ซึ่งอยู่บน prophage**",
                  "ทำให้เกิด Hemolytic-Uremic Syndrome in children (HUS)",
                  "สไลด์อ้างถึง E. coli O145 outbreak in 2010"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "GENOTYPING",
        "source": "Bacterial genetics p.48",
        "body": [
          {
            "text": "สไลด์ยกตัวอย่างการใช้ **WHOLE GENOME OF BACTERIA ด้วย DNA sequencing** เพื่อแยก MRSA (methicillin-resistant S. aureus) ออกจาก MSSA (methicillin-susceptible S. aureus)"
          },
          {
            "sub": "Clonal relation (p.49)",
            "body": [
              {
                "text": "อีกวิธีคือดู nucleotide sequence ของยีนบางตัว เพื่อดู **clonal relation คือมีต้นกำเนิดจากบรรพบุรุษเดียวกันแต่ผ่าน mutational events บางอย่าง**"
              },
              {
                "text": "Different bacterial strain หมายถึงมี different property ทั้ง phenotype และหรือ genotype ในระดับ DNA sequence"
              }
            ]
          },
          {
            "sub": "DNA fingerprint (p.50-51)",
            "body": [
              {
                "text": "สไลด์แสดง DNA fingerprint ของ MRSA ที่แยกได้จาก man 1, man 2, man 3 และ dog เทียบกับ DNA marker"
              },
              {
                "text": "**หลักการคือใช้ restriction enzyme (endonuclease) ตัด chromosomal DNA ของแบคทีเรียที่ restriction site ทำให้ได้ DNA fragment ขนาดต่าง ๆ แล้วแยกด้วย electrophoresis**"
              },
              {
                "bullets": [
                  "สไลด์ยกตัวอย่าง restriction site เป็น CCC GGG และ GGG CCC",
                  "**ในเจล ชิ้นที่มี high number of base pair อยู่ด้านขั้วลบ ส่วน low number of base pair วิ่งไปทางขั้วบวก**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Applications ของ genotyping",
        "source": "Bacterial genetics p.52",
        "body": [
          {
            "bullets": [
              "เพื่อระบุความสัมพันธ์ระหว่าง bacterial strains และ clones หรือหาแหล่งต้นตอ",
              "**เพื่อสอบสวนและระบุเชื้อที่เป็นสาเหตุของ outbreak**",
              "**เพื่อหาหลักฐานของ zoonotic transmission**"
            ]
          },
          {
            "callout": "จุดนี้เชื่อมกับสไลด์ DNA fingerprint หน้า 50 ที่เทียบ MRSA จากคน 3 คนกับสุนัข ซึ่งคือรูปธรรมของ zoonotic transmission ที่หน้านี้พูดถึง",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "microbio-1--bacterial-metabolism": {
    "topic": "microbio-1--bacterial-metabolism",
    "title": "Bacterial Metabolism",
    "icon": "🦠",
    "lecturer": "Associate Professor Pattrarat Chanchaithong",
    "summary": "เด็คนี้ 54 สไลด์ แบ่งเป็นสามท่อนชัดเจน ท่อนแรก (p.2-21) คือ metabolism พื้นฐานของแบคทีเรีย ตั้งแต่นิยาม catabolism/anabolism การจำแนกสิ่งมีชีวิตตาม carbon/energy/electron source ไล่ไปถึง glycolysis, fermentation, Krebs cycle, electron transport chain, สรุป net ATP และความสัมพันธ์กับ O2 ท่อนที่สอง (p.22-47) เป็นเนื้อหาที่ยาวที่สุดของเด็ค คือ biochemical properties สำหรับ bacterial identification ไล่ทีละ test ทั้ง carbohydrate, protein/amino acid, lipid และ nitrogen metabolism พร้อมตารางผลของ Enterobacteriaceae และ coagulase-positive staphylococci ท่อนสุดท้าย (p.48-54) เป็น commercial identification systems (API, Vitek 2) และ MALDI-TOF mass spectrometry มีสไลด์ที่เป็นรูปหรือแผนภาพล้วนไม่มีข้อความ (p.17, p.52) และตารางเปรียบเทียบ Enterobacteriaceae ใน p.46 อ่านค่าจากไฟล์สไลด์ได้ไม่ครบ",
    "sections": [
      {
        "heading": "METABOLISM คืออะไร",
        "source": "Bacterial Metabolism p.2",
        "body": [
          {
            "text": "METABOLISM = **all of organism's chemical processes** คือ interaction of the molecules of the cell"
          },
          {
            "text": "IMPORTANCE ที่สไลด์เน้นคือ management of cellular materials and energy resources"
          },
          {
            "sub": "Metabolic reactions",
            "body": [
              {
                "bullets": [
                  "เป็น pathways of enzyme controlled chemical reactions",
                  "Cells need a supply of molecules and energy",
                  "Cells need to remove waste products"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Catabolic vs Anabolic reactions",
        "source": "Bacterial Metabolism p.3",
        "body": [
          {
            "sub": "Catabolic reactions",
            "body": [
              {
                "bullets": [
                  "Break down complex molecules into simple molecules",
                  "Energy stored in usable complex molecules is made เช่น ATP",
                  "Small molecules from catabolism may be used to build new molecules",
                  "ตัวอย่างที่สไลด์ยก คือ cellular respiration"
                ]
              }
            ]
          },
          {
            "sub": "Anabolic reactions",
            "body": [
              {
                "bullets": [
                  "Use energy for the biosynthesis of complex molecules from simple molecules",
                  "Energy is obtained from usable chemical forms of energy (ATP)",
                  "ตัวอย่างที่สไลด์ยก คือ synthesis of macromolecules"
                ]
              }
            ]
          },
          {
            "text": "จับคู่ให้ติด **catabolism สร้าง ATP ส่วน anabolism ใช้ ATP**"
          }
        ]
      },
      {
        "heading": "การจำแนกสิ่งมีชีวิตตาม carbon, energy และ electron source",
        "source": "Bacterial Metabolism p.4-6",
        "body": [
          {
            "text": "สไลด์แยกเกณฑ์การจำแนกออกเป็นสามแกน แต่ละแกนมีสองขั้ว"
          },
          {
            "sub": "Carbon source (p.4)",
            "body": [
              {
                "bullets": [
                  "Autotroph = CO2 is the sole or principal carbon source",
                  "Heterotroph = reduced organic molecules from other organisms"
                ]
              }
            ]
          },
          {
            "sub": "Energy source (p.5)",
            "body": [
              {
                "bullets": [
                  "Phototroph = Light",
                  "Chemotroph = Oxidation of organic or inorganic compounds"
                ]
              }
            ]
          },
          {
            "sub": "Electron source (p.6)",
            "body": [
              {
                "bullets": [
                  "Lithotroph = reduced inorganic compounds",
                  "Organotroph = organic molecules"
                ]
              }
            ]
          },
          {
            "callout": "ชื่อยาว ๆ ใน p.7 คือการเอาสามแกนนี้มาต่อกันตามลำดับ energy-electron-carbon เช่น Chemoorganoheterotrophy = chemo (energy จากเคมี) + organo (electron จากสารอินทรีย์) + heterotroph (carbon จากสารอินทรีย์)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "5 กลุ่มโภชนาการ (nutritional types) และตัวอย่างเชื้อ",
        "source": "Bacterial Metabolism p.7",
        "body": [
          {
            "sub": "1. Photolithoautotrophy (photoautotrophs)",
            "body": [
              {
                "bullets": [
                  "Energy source: Light",
                  "Electron source: Inorganic e-donor",
                  "Carbon source: CO2",
                  "ตัวอย่าง: Cyanobacteria, Purple sulfur bacteria"
                ]
              }
            ]
          },
          {
            "sub": "2. Photoorganoheterotrophy (photoheterotrophs)",
            "body": [
              {
                "bullets": [
                  "Energy source: Light",
                  "Electron source: Organic e-donor",
                  "Carbon source: Organic carbon but CO2 may be used",
                  "ตัวอย่าง: Purple nonsulfur bacteria และ Green nonsulfur bacteria"
                ]
              }
            ]
          },
          {
            "sub": "3. Chemolithoautotrophy (chemoautotrophs)",
            "body": [
              {
                "bullets": [
                  "Energy source: Inorganic chemicals",
                  "Electron source: Inorganic e-donor",
                  "Carbon source: CO2",
                  "ตัวอย่าง: Sulfur oxidizing bacteria, methanogens, nitrifying bacteria"
                ]
              }
            ]
          },
          {
            "sub": "4. Chemolithoheterotrophy",
            "body": [
              {
                "bullets": [
                  "Energy source: Inorganic chemicals",
                  "Electron source: Inorganic e-donor",
                  "Carbon source: Organic carbon but CO2 may be used",
                  "ตัวอย่าง: Some sulfur oxidizing bacteria"
                ]
              }
            ]
          },
          {
            "sub": "5. Chemoorganoheterotrophy (Chemoheterotrophs)",
            "body": [
              {
                "bullets": [
                  "Energy source: Organic chemicals often the same as C source",
                  "Electron source: Organic e-donor often the same as C source",
                  "Carbon source: Organic chemicals often the same as C source",
                  "ตัวอย่าง: **Most nonphotosynthetic microbes including most pathogens**, fungi, many protist และ many archaea"
                ]
              }
            ]
          },
          {
            "callout": "กลุ่มที่ 5 คือกลุ่มที่เราสนใจในทางสัตวแพทย์ เพราะสไลด์ระบุเองว่าเชื้อก่อโรคส่วนใหญ่อยู่ในกลุ่มนี้ และเนื้อหาสไลด์ถัดไปก็เดินต่อจากกลุ่มนี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Heterotrophic (Chemoorganotrophic) metabolism",
        "source": "Bacterial Metabolism p.8",
        "body": [
          {
            "text": "นิยามตามสไลด์: conversion of organic substrate molecules to end products by metabolic pathway that releases sufficient energy to form ATP"
          },
          {
            "sub": "Metabolic process",
            "body": [
              {
                "bullets": [
                  "Hydrolysis of large molecules in the extracellular environment by specific enzyme",
                  "Transportation of small molecules (monosaccharides, short peptide และ fatty acids)"
                ]
              }
            ]
          },
          {
            "sub": "3 Options for generating ATP",
            "body": [
              {
                "text": "สไลด์บอกว่าสามทางนี้ต่างกันที่ **Differences of electron acceptors**"
              },
              {
                "bullets": [
                  "1. Aerobic respiration",
                  "2. Anaerobic respiration",
                  "3. Fermentation"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาพรวม CATABOLISM (degradative reactions)",
        "source": "Bacterial Metabolism p.9",
        "body": [
          {
            "text": "สไลด์วางแผนผังว่าสารอาหารสามหมู่ถูกย่อยลงมารวมกันที่จุดเดียว"
          },
          {
            "bullets": [
              "Proteins ลงมาเป็น Amino acids",
              "Polysaccharides ลงมาเป็น Monosaccharides",
              "Lipids ลงมาเป็น Glycerol และ fatty acids"
            ]
          },
          {
            "text": "จากนั้นเข้าเส้นทาง Glucose ไปเป็น **Pyruvate** ซึ่งเป็นจุดแยกสองทาง"
          },
          {
            "bullets": [
              "Anaerobic reactions ไปเป็น Fermentation products (ATP + NADH)",
              "Aerobic reactions ไปเป็น Acetyl CoA เข้า Krebs cycle แล้วต่อ Electron transport chain ได้ ATP"
            ]
          }
        ]
      },
      {
        "heading": "RESPIRATION",
        "source": "Bacterial Metabolism p.10",
        "body": [
          {
            "text": "ลักษณะเฉพาะของ respiration ตามสไลด์"
          },
          {
            "bullets": [
              "**Terminal electron acceptor is present**",
              "Electron transport chain is generated",
              "ATP produced predominantly by **oxidative phosphorylation**"
            ]
          },
          {
            "text": "ประกอบด้วยสามช่วง: Glycolysis, Krebs cycle, Electron transport chain and oxidative phosphorylation"
          },
          {
            "sub": "แบ่งตามตัวรับอิเล็กตรอนตัวสุดท้าย",
            "body": [
              {
                "bullets": [
                  "Aerobic respiration: **O2 is the terminal electron acceptor**",
                  "Anaerobic respiration: others serve as electron acceptor ได้แก่ NO3-, SO42-, CO2"
                ]
              },
              {
                "text": "Some microbe can carry out both aerobic and anaerobic respiration"
              }
            ]
          },
          {
            "text": "สมการรวมที่สไลด์เขียน: C6H12O6 + 6O2 ให้ 6CO2 + 6H2O + (ATP + Heat)"
          }
        ]
      },
      {
        "heading": "GLYCOLYSIS (Emden-Meyerhof-Panas Pathway)",
        "source": "Bacterial Metabolism p.12",
        "body": [
          {
            "bullets": [
              "energy-investment phase: use 2 ATP",
              "energy-payoff phase: gain 4 ATP โดย **substrate level phosphorylation** ซึ่งสไลด์อธิบายว่า enzyme transfer Pi from substrate to ADP",
              "energy-payoff phase: gain 2 NADH (reduced coenzyme)"
            ]
          },
          {
            "sub": "สมการที่สไลด์เขียน",
            "body": [
              {
                "bullets": [
                  "Glucose ให้ 2 Pyruvate + 2H2O",
                  "2ADP + 2Pi ให้ 2ATP",
                  "2NAD+ ให้ 2NADH + 2H+"
                ]
              }
            ]
          },
          {
            "text": "ปลายทางของ glycolysis ที่สไลด์ชี้ไว้มีสองทาง คือ Krebs cycle หรือ Fermentation"
          }
        ]
      },
      {
        "heading": "FERMENTATION",
        "source": "Bacterial Metabolism p.13-14",
        "body": [
          {
            "text": "p.13 เป็นแผนภาพ alcoholic fermentation in yeasts ต่อจาก glycolysis ไม่มีข้อความอธิบายอื่นบนสไลด์"
          },
          {
            "sub": "คุณสมบัติของ fermentation (p.14)",
            "body": [
              {
                "bullets": [
                  "**Fermentation does not use an electron transport chain**",
                  "**An external terminal electron acceptor is absent**",
                  "Fermentations are balanced oxidation-reduction reactions",
                  "Terminal electron acceptor is derived from initial substrate or electron donor เช่น glucose",
                  "ATP produced predominantly by **substrate-level phosphorylation**",
                  "สไลด์กำกับผลลัพธ์ไว้ว่า No NADH และ gain 2 ATP"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ออกสอบบ่อยคือคู่ตรงข้าม respiration ใช้ ETC + external terminal electron acceptor + oxidative phosphorylation ส่วน fermentation ไม่มีทั้ง ETC และตัวรับอิเล็กตรอนภายนอก ได้ ATP จาก substrate-level phosphorylation",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Acetyl CoA จุดเชื่อมระหว่าง glycolysis กับ Krebs cycle",
        "source": "Bacterial Metabolism p.15",
        "body": [
          {
            "text": "Conversion of pyruvate to acetyl CoA คือ **the junction between glycolysis and the Krebs cycle**"
          },
          {
            "bullets": [
              "Acetyl CoA เป็น a very unstable and reactive product",
              "feeds its acetate to Krebs cycle",
              "Carbohydrate, fatty acids และ amino acids may be converted into acetyl CoA during aerobic respiration"
            ]
          },
          {
            "text": "สมการ: Pyruvate + NAD+ + CoA ให้ Acetyl CoA + NADH + CO2"
          }
        ]
      },
      {
        "heading": "KREBS CYCLE หรือ TCA CYCLE",
        "source": "Bacterial Metabolism p.16-17",
        "body": [
          {
            "text": "p.16 เป็นวงจรพร้อมกำกับผลผลิตต่อรอบไว้สั้น ๆ ว่า **3NADH, FADH2, GTP (ATP)** โดยระบุว่า GTP มาจาก substrate-level phosphorylation"
          },
          {
            "text": "p.17 เป็นแผนภาพล้วน ไม่มีข้อความบนสไลด์"
          },
          {
            "callout": "สไลด์หน้านี้ไม่ได้ไล่ชื่อสารตัวกลางหรือชื่อเอนไซม์ในวงจรให้ ให้ดูตัวเลขผลผลิตกับที่มาของ GTP เป็นหลัก แล้วไปต่อที่ตาราง net ATP ใน p.20",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ELECTRON TRANSPORT SYSTEM และ OXIDATIVE PHOSPHORYLATION",
        "source": "Bacterial Metabolism p.18-19",
        "body": [
          {
            "text": "p.18 เป็นภาพระบบล้วน มีเฉพาะหัวข้อ ELECTRON TRANSPORT SYSTEM"
          },
          {
            "sub": "หลักการที่สไลด์ p.19 เขียนไว้",
            "body": [
              {
                "bullets": [
                  "Electron transport carriers are reduced",
                  "**Proton gradient driving ATP synthesis** โดย H+ moves across plasma membrane",
                  "OXIDATIVE PHOSPHORYLATION อาศัย ATP synthase หรือ ATPase ซึ่ง catalyze ADP + Pi ไปเป็น ATP",
                  "proton gradient ยัง also create proton gradient to drive transport and flagella",
                  "Some organisms use both aerobic and anaerobic conditions ขึ้นกับ O2 condition โดยฝั่งไม่มี O2 คือ anaerobic respiration"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "NET ATP in AEROBIC RESPIRATION",
        "source": "Bacterial Metabolism p.20",
        "body": [
          {
            "sub": "SUBSTRATE-LEVEL PHOSPHORYLATION",
            "body": [
              {
                "bullets": [
                  "Glycolysis: 4 ATP และหัก -2 ATP",
                  "Citric acid cycle: 2 GTP แปลงเป็น 2 ATP"
                ]
              }
            ]
          },
          {
            "sub": "OXIDATIVE PHOSPHORYLATION",
            "body": [
              {
                "bullets": [
                  "2NADH (from glycolysis) ให้ 6 ATP",
                  "8 NADH (from TCA cycle) ให้ 24 ATP",
                  "2 FADH2 (from TCA cycle) ให้ 4 ATP",
                  "อัตราแลกเปลี่ยนที่สไลด์ใช้คือ 1 NADH ให้ 3 ATP และ 1 FADH2 ให้ 2 ATP"
                ]
              }
            ]
          },
          {
            "text": "ข้อยกเว้นที่สไลด์เขียนไว้: If membrane non permeable to NADH จะได้ 0-2 ATP เพราะ e- ถูก relayed across membrane at the expense of 2 ATP"
          },
          {
            "text": "รวมทั้งหมด **36-38 ATP**"
          }
        ]
      },
      {
        "heading": "O2 is a poison for many bacteria",
        "source": "Bacterial Metabolism p.21",
        "body": [
          {
            "sub": "กลุ่มตามความต้องการออกซิเจน",
            "body": [
              {
                "bullets": [
                  "**Obligate anaerobes** cannot grow in the presence of oxygen เช่น *Clostridium tetani*",
                  "**Obligate aerobes** require the presence of oxygen for metabolism and growth เช่น *Mycobacterium tuberculosis*",
                  "**Facultative anaerobes** grow in either the presence or the absence of oxygen"
                ]
              }
            ]
          },
          {
            "sub": "เอนไซม์ที่สไลด์ยกมาสองตัว",
            "body": [
              {
                "bullets": [
                  "**superoxide dismutase** เปลี่ยน superoxide (O2-) ไปเป็น O2 + H2O2",
                  "**catalase** ทำงานต่อกับ H2O2 ได้ H2O และ O2"
                ]
              },
              {
                "text": "สมการทั้งสองบนสไลด์ถูกจัดวางแยกบรรทัด อ่านลำดับสารตั้งต้นกับผลิตภัณฑ์ได้ตามข้างต้น แต่ตัวเลขสัมประสิทธิ์บนสไลด์วางสลับกันจนอ่านเป็นสมการเต็มไม่ได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "BIOCHEMICAL PROPERTIES for BACTERIAL IDENTIFICATION ภาพรวม",
        "source": "Bacterial Metabolism p.22",
        "body": [
          {
            "text": "สไลด์เปิดหัวข้อใหญ่ท่อนสอง โดยเริ่มที่ CARBOHYDRATE METABOLISM แล้วไล่ test ตามขนาดของ substrate"
          },
          {
            "bullets": [
              "Polysaccharide ใช้ starch hydrolysis",
              "Oligosaccharides และ disaccharides ใช้ sugar assimilation test",
              "Monosaccharide ใช้ oxidation fermentation (OF) test และ sugar assimilation test",
              "MR และ VP test",
              "Citrate utilization test"
            ]
          }
        ]
      },
      {
        "heading": "STARCH HYDROLYSIS (amylase production)",
        "source": "Bacterial Metabolism p.23",
        "body": [
          {
            "text": "ปฏิกิริยา: Starch ถูก amylase ย่อยเป็น Oligosaccharides และ Disaccharides (maltose) แล้วต่อเป็น Monosaccharide (glucose)"
          },
          {
            "bullets": [
              "หยด Starch + Iodine (Starch reagent) จะได้ purple compound = **negative**",
              "ถ้าเห็น **clear zone** แปลว่า starch was digested = **positive**"
            ]
          }
        ]
      },
      {
        "heading": "SUGAR ASSIMILATION TEST",
        "source": "Bacterial Metabolism p.24-25",
        "body": [
          {
            "text": "หลักการคือ acid production from disaccharides และ monosaccharides โดย Disaccharides ถูกย่อยเป็น Monosaccharides แล้วเข้า glycolysis pathway ได้ acid ผ่านทาง fermentation หรือ oxidation ทำให้ **decreasing pH**"
          },
          {
            "sub": "pH indicator ที่สไลด์ระบุ (p.24)",
            "body": [
              {
                "bullets": [
                  "PHENOL RED เปลี่ยน RED เป็น YELLOW",
                  "BROMOTHYMOL BLUE เปลี่ยน GREEN เป็น YELLOW",
                  "BROMOCRESOL PURPLE เปลี่ยน PURPLE เป็น YELLOW"
                ]
              },
              {
                "text": "ทุกตัวชี้ไปทาง **สีเหลืองเมื่อเป็นกรด**"
              }
            ]
          },
          {
            "sub": "เลือกอาหารเลี้ยงเชื้อ (p.25)",
            "body": [
              {
                "bullets": [
                  "**Liquid broth** สำหรับ glucose fermenter bacteria เพราะ allow both oxidation and fermentation",
                  "**Slant agar** สำหรับ glucose oxidizer bacteria"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "OF (OXIDATION-FERMENTATION) TEST",
        "source": "Bacterial Metabolism p.26",
        "body": [
          {
            "text": "ทดสอบ acid production from glucose in aerobic and anaerobic conditions"
          },
          {
            "bullets": [
              "**Glucose fermenter** utilizes glucose in both aerobic and anaerobic conditions",
              "**Glucose oxidizer** utilizes glucose in aerobic condition",
              "Non utilizer"
            ]
          }
        ]
      },
      {
        "heading": "TSI (TRIPLE SUGAR IRON) TEST",
        "source": "Bacterial Metabolism p.27-28",
        "body": [
          {
            "text": "ใช้สำหรับ **genus and species identification of Enterobacteriaceae**"
          },
          {
            "sub": "สิ่งที่ TSI อ่านได้ 3 อย่าง (p.27)",
            "body": [
              {
                "bullets": [
                  "1. sugar fermentation ของ GLUCOSE 0.1%, LACTOSE 1%, SUCROSE 1%",
                  "2. gas (CO2 หรือ H2) production",
                  "3. H2S production"
                ]
              },
              {
                "text": "pH indicator = **PHENOL RED** วิธีเพาะคือ stab into the butt and streak onto the slant"
              },
              {
                "text": "เคมีของ H2S ตามสไลด์: Bacteria ในภาวะ acid environment + sodium thiosulfate ให้ H2S แล้ว H2S + ferric ion ให้ FeS (ferrous sulfide) ซึ่ง insoluble black"
              }
            ]
          },
          {
            "sub": "การแปลผลสองแบบที่สไลด์ยกตัวอย่าง (p.28)",
            "body": [
              {
                "bullets": [
                  "Bacteria ferment GLUCOSE, SUCROSE and/or LACTOSE จะได้ acid ทั้ง yellow butt และ yellow slant with gas, no H2S เขียนเป็น **A/A/+/-**",
                  "Bacteria ferment GLUCOSE only จะได้ strong acid (yellow butt) ส่วน slant may utilize protein (alkaline) จึงเป็น red slant มี gas และ H2S เขียนเป็น **K/A/+/+**"
                ]
              },
              {
                "text": "ลำดับการอ่านรหัสคือ slant/butt/gas/H2S"
              }
            ]
          }
        ]
      },
      {
        "heading": "ตารางผล TSI รายเชื้อ",
        "source": "Bacterial Metabolism p.29",
        "body": [
          {
            "text": "อ่านเรียง slant / butt / gas / H2S วงเล็บคือผลที่พบได้อีกแบบ"
          },
          {
            "bullets": [
              "*Escherichia*: slant A (K), butt A, gas + (-), H2S -",
              "*Klebsiella*: slant A, butt A, gas +, H2S -",
              "*Enterobacter*: slant A หรือ K, butt A, gas +, H2S -",
              "*Shigella*: slant K, butt A, gas -, H2S -",
              "*Salmonella*: slant K, butt A, gas + (-), H2S + (-)",
              "*Proteus mirabilis*: slant K (A), butt A, gas +, H2S +"
            ]
          },
          {
            "callout": "butt เป็น A ทุกเชื้อในตารางนี้ ตัวที่แยกเชื้อออกจากกันคือ slant, gas และ H2S สังเกตว่า *Shigella* เป็นตัวเดียวในตารางที่ไม่สร้าง gas",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "MR และ VP TEST",
        "source": "Bacterial Metabolism p.30-32",
        "body": [
          {
            "text": "ทั้งสอง test ใช้อาหารเดียวกันคือ **Clark and Lubs medium (MR/VP broth)** แต่อ่านคนละปลายทางของการหมัก glucose"
          },
          {
            "bullets": [
              "METHYL RED TEST อ่านเชื้อที่ continue producing acids",
              "VOGES-PRAUSKER TEST อ่าน acetoin production ซึ่ง to make neutral คือลดความเป็นกรด"
            ]
          },
          {
            "sub": "METHYL RED TEST (p.31)",
            "body": [
              {
                "text": "MR positive = **produce stable acid maintaining high conc. of H+**"
              },
              {
                "bullets": [
                  "2 glucose + H2O ให้ 2 lactic acid + acetic acid + ethanol + 2CO2 + 2H2",
                  "formic acid ให้ H2 + CO2"
                ]
              },
              {
                "text": "อ่านผลโดย Add methyl red reagent"
              }
            ]
          },
          {
            "sub": "VOGES-PRAUSKER TEST (p.32)",
            "body": [
              {
                "text": "VP positive = **produce acetoin to neutralize acid**"
              },
              {
                "text": "2 glucose + 1/2 O ให้ acetoin (acetomethyl carbinol) แล้วต่อเป็น 2,3-Butanediol + lactic acid + 2CO2 + 2H2O"
              },
              {
                "bullets": [
                  "1. Add 40% KOH",
                  "2. Swirling",
                  "3. Add alpha-naphtol solution"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "CITRATE UTILIZATION TEST (Simmon's citrate)",
        "source": "Bacterial Metabolism p.33",
        "body": [
          {
            "text": "เงื่อนไขสำคัญที่สไลด์เน้นคือ **No presence of glucose** ในอาหาร เชื้อจึงต้องใช้ citrate เป็นแหล่งคาร์บอน"
          },
          {
            "bullets": [
              "Citrate ถูกนำเข้าโดย **citrate permease** แล้วเปลี่ยนเป็น oxaloacetate + acetic acid แล้วต่อเป็น pyruvate + CO2",
              "CO2 + 2Na+ + H2O ให้ Na2CO3 ซึ่งทำให้เป็น **alkaline pH**"
            ]
          }
        ]
      },
      {
        "heading": "PROTEIN and AMINO ACID METABOLISM ภาพรวม",
        "source": "Bacterial Metabolism p.34",
        "body": [
          {
            "text": "สไลด์ลิสต์ test ในหมวดนี้ไว้ 5 รายการ"
          },
          {
            "bullets": [
              "Gelatin hydrolysis test",
              "Casein hydrolysis test",
              "Amino acid decarboxylation test",
              "Indole test",
              "Hippurate hydrolysis test"
            ]
          }
        ]
      },
      {
        "heading": "GELATIN HYDROLYSIS และ DIGESTION OF CASEIN",
        "source": "Bacterial Metabolism p.35-36",
        "body": [
          {
            "sub": "Gelatin hydrolysis (p.35)",
            "body": [
              {
                "text": "Collagen (connective tissue) ให้ gelatin แล้ว gelatinase ย่อย gelatin เป็น amino acid"
              },
              {
                "bullets": [
                  "1. Bacteria grown on gelatin agar",
                  "2. Add acid mercuric chloride (HgCl2)",
                  "**Positive = gelatinase production เห็นเป็น clear zone**"
                ]
              }
            ]
          },
          {
            "sub": "Digestion of casein (p.36)",
            "body": [
              {
                "text": "caseinase ย่อย casein เป็น amino acid"
              },
              {
                "bullets": [
                  "ใช้ casein agar (5% skim milk)",
                  "**Positive = caseinase production เห็นเป็น clear zone**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "DECARBOXYLASE TEST (lysine, ornithine, arginine)",
        "source": "Bacterial Metabolism p.37-38",
        "body": [
          {
            "sub": "ปฏิกิริยา (p.37)",
            "body": [
              {
                "bullets": [
                  "Lysine decarboxylase: L-lysine ให้ **Cadaverine** (diamine) + CO2",
                  "Ornithine decarboxylase: L-Ornithine ให้ **Putrescine** (diamine) + CO2",
                  "Arginine decarboxylase: L-Arginine ให้ **Putrescine** (diamine) + CO2"
                ]
              }
            ]
          },
          {
            "sub": "การแปลผล (p.38)",
            "body": [
              {
                "bullets": [
                  "**Positive = decarboxylase production เห็นเป็นสีม่วง** เพราะ bacteria hydrolyze amino acid to amine (-NH2) in anaerobic condition ทำให้ alkaline pH",
                  "Bacteria cannot hydrolyze amino acid but utilize glucose จะได้ acid pH เห็นเป็นสีเหลือง"
                ]
              },
              {
                "text": "หลอด control (C) ที่สไลด์กำกับไว้คือหลอดที่มี only glucose และ no amino acid"
              }
            ]
          }
        ]
      },
      {
        "heading": "INDOLE TEST",
        "source": "Bacterial Metabolism p.39",
        "body": [
          {
            "text": "Tryptophan ถูก **tryptophanase** ย่อยเป็น Indole + pyruvic acid + ammonia"
          },
          {
            "text": "อ่านผลด้วย **Kovac's reagent** ซึ่งประกอบด้วย p-dimethylaminobenzaldehyde, butanol และ acid ผลบวกได้ **red violet compound**"
          }
        ]
      },
      {
        "heading": "HIPPURATE HYDROLYSIS TEST",
        "source": "Bacterial Metabolism p.40",
        "body": [
          {
            "text": "Hippurate ถูก **hippuricase** ย่อยเป็น glycine (amino acid) + benzoic acid"
          },
          {
            "text": "**Positive = hippuricase production เห็นเป็นสี purple blue** ตรวจด้วย 3.5% ninhydrin"
          }
        ]
      },
      {
        "heading": "LIPID METABOLISM: LECITHOVITELLIN TEST",
        "source": "Bacterial Metabolism p.41-42",
        "body": [
          {
            "text": "p.41 เปิดหัวข้อว่าหมวด LIPID METABOLISM มี Lecithovitelline test และหมวด NITROGEN METABOLISM มี Nitrate reduction test"
          },
          {
            "text": "หลักการ (p.42): **Digestion of lecithin (phospholipid) in egg yolk** โดยเอนไซม์ lecithinase"
          },
          {
            "bullets": [
              "ผลบวกเห็นเป็น **insoluble precipitation คือ opalescent หรือ opaque zone around colony**",
              "ถ้าเห็น clear zone สไลด์กำกับว่าเป็น proteolysis"
            ]
          }
        ]
      },
      {
        "heading": "NITRATE REDUCTION TEST",
        "source": "Bacterial Metabolism p.43",
        "body": [
          {
            "text": "ปฏิกิริยาหลัก: NO3- + 2H+ + e- ให้ NO2- + H2O"
          },
          {
            "sub": "Phase I ตรวจว่ามี nitrite หรือไม่",
            "body": [
              {
                "bullets": [
                  "Solution A = N,N dimethyl-alpha-naphthylamine",
                  "Solution B = sulfanilic acid",
                  "**Positive = red** แปลว่ามี nitrite (NO2-)",
                  "ถ้า no color change ตีความได้ 2 ทางคือ 1. Negative หรือ 2. N2 production"
                ]
              },
              {
                "text": "denitrification ที่สไลด์เขียนไว้: NO3- + 10e- + 12H+ ให้ N2 + 6H2O"
              }
            ]
          },
          {
            "sub": "Phase II: Zinc reduction ตรวจว่ายังเหลือ NO3- หรือไม่",
            "body": [
              {
                "bullets": [
                  "Add Zinc dust (Zn)",
                  "**Positive = no color change**",
                  "**Negative = red** จาก Zn(NO3)2"
                ]
              }
            ]
          },
          {
            "callout": "อ่าน Phase II กลับหัวกับ Phase I ให้ระวังตอนสอบ ถ้าเติมสังกะสีแล้วขึ้นสีแดง แปลว่า nitrate ยังอยู่ครบ เชื้อไม่ได้รีดิวซ์อะไรเลย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "UREASE TEST",
        "source": "Bacterial Metabolism p.44",
        "body": [
          {
            "text": "โน้ตบนสไลด์เขียนไว้ว่าเทสนี้ดูว่า bac. มีการใช้ urea ได้หรือเปล่า"
          },
          {
            "text": "ปฏิกิริยา: (NH2)2CO + 2H2O ถูก **urease** ย่อยเป็น CO2 + H2O + 2NH3"
          },
          {
            "bullets": [
              "Indicator = **phenol red**",
              "**Positive = red**",
              "**Negative = no color change (yellow)** เพราะโน้ตบนสไลด์กำกับว่าเดิมมันเป็นสีเหลืองอยู่แล้ว"
            ]
          }
        ]
      },
      {
        "heading": "ตาราง screening เบื้องต้นระดับ family และ genus",
        "source": "Bacterial Metabolism p.45",
        "body": [
          {
            "text": "อ่านเรียง Gram's staining / motility / catalase / oxidase / OF"
          },
          {
            "bullets": [
              "*Staphylococcus*: Gram + cocci เรียงตัวแบบ grape-like, motility -, catalase +, oxidase -, OF = F",
              "*Bacillus*: Gram + bacilli และ spore forming, motility +/-, catalase +, oxidase +/-, OF = F",
              "*Pseudomonas*: Gram - bacilli, motility +, catalase +, oxidase +, OF = O",
              "Enterobacteriaceae: Gram - bacilli, motility + (-), catalase +, oxidase -, OF = F"
            ]
          },
          {
            "text": "สไลด์ปิดท้ายว่า **ALL can grow in aerobic condition**"
          },
          {
            "callout": "ตัวแยกที่คมที่สุดในตารางนี้คือ oxidase กับ OF *Pseudomonas* เป็นตัวเดียวที่ oxidase + และ OF เป็น O ส่วน Enterobacteriaceae oxidase - และ OF เป็น F",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตัวอย่างที่ 1: Family Enterobacteriaceae",
        "source": "Bacterial Metabolism p.46",
        "body": [
          {
            "text": "สไลด์เอา test ที่เรียนมาทั้งหมดมาเรียงเป็นตารางแยกเชื้อ 4 ตัว คือ *Escherichia coli*, *Klebsiella pneumoniae*, *Salmonella enterica* และ *Shigella dysenteriae*"
          },
          {
            "sub": "คอลัมน์ที่ตารางใช้",
            "body": [
              {
                "bullets": [
                  "TSI",
                  "Decarboxylase test ได้แก่ lysine, arginine, ornithine",
                  "Lactose assimilation",
                  "iMViC ได้แก่ MR, VP, indole, citrate",
                  "urease",
                  "Nitrate"
                ]
              }
            ]
          },
          {
            "sub": "TSI pattern ของสี่เชื้อ (อ่านเรียง slant/butt/gas/H2S)",
            "body": [
              {
                "bullets": [
                  "*Escherichia coli*: **A/A/+/-**",
                  "*Klebsiella pneumoniae*: **A/A/+/-**",
                  "*Salmonella enterica*: **K/A/+/+**",
                  "*Shigella dysenteriae*: **K/A/-/-**"
                ]
              }
            ]
          },
          {
            "callout": "ค่าบวกลบรายช่องของคอลัมน์ที่เหลือในตารางนี้ เรียงไม่ครบในไฟล์สไลด์ที่อ่านได้ จึงไม่ยกมา ให้เปิดสไลด์ p.46 อ่านตารางเต็มจากของจริง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ตัวอย่างที่ 2: coagulase-positive staphylococci",
        "source": "Bacterial Metabolism p.47",
        "body": [
          {
            "text": "ตารางแยก coagulase-positive *Staphylococcus* sp. 4 ตัว ด้วย coagulase test, VP, sugar assimilation test (maltose, galactose, lactose, trehalose) และ mannitol fermentation test"
          },
          {
            "bullets": [
              "*Staphylococcus aureus*: coagulase +, VP +, maltose +, galactose +, lactose +, trehalose +, mannitol +",
              "*S. pseudintermedius*: coagulase +, VP -, maltose +, galactose +, lactose +, trehalose +, mannitol -",
              "*S. intermedius*: coagulase +, VP -, maltose +, galactose -, lactose +, trehalose +, mannitol +",
              "*S. schleiferi* subsp. *coagulans*: coagulase +, VP +, maltose -, galactose +, lactose -, trehalose -, mannitol -"
            ]
          },
          {
            "callout": "coagulase เป็นบวกทั้งสี่ตัว จึงแยกกันไม่ได้ด้วย coagulase อย่างเดียว ตัวที่ช่วยแยกคือ VP กับน้ำตาลแต่ละชนิด",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Commercial identification systems",
        "source": "Bacterial Metabolism p.48-49",
        "body": [
          {
            "sub": "API identification product (p.48)",
            "body": [
              {
                "bullets": [
                  "ย่อมาจาก **Analytical profile index** เป็นชื่อทางการค้า",
                  "เป็น BIOCHEMICAL TEST KIT",
                  "โน้ตบนสไลด์กำกับว่า 1 หลุม = 1 test"
                ]
              }
            ]
          },
          {
            "sub": "Vitek 2 identification system (p.49)",
            "body": [
              {
                "bullets": [
                  "โน้ตบนสไลด์กำกับว่าทำเหมือนเป็นการ์ด",
                  "ประมาณ 60 หลุม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "MALDI-TOF mass spectrometry",
        "source": "Bacterial Metabolism p.50-54",
        "body": [
          {
            "text": "โน้ตบนสไลด์สรุปว่านี่คือการหามวลโมเลกุลของแบคทีเรียเพื่อจำแนกชนิด bac."
          },
          {
            "sub": "หลักการ (p.50)",
            "body": [
              {
                "bullets": [
                  "ชื่อเต็มคือ **Matrix Assisted Laser Desorption Ionization-Time Of Flight mass spectrometry**",
                  "MALDI คือ ionization technique ส่วน TOF คือส่วน mass spectrometry",
                  "ใช้ analysis of biomolecules and biopolymers เช่น DNA, proteins, peptides และ sugars",
                  "กลไก MALDI: laser beam trigger matrix materials ทำให้ ionized and transfer proton to the analyte molecules เช่น protein"
                ]
              }
            ]
          },
          {
            "sub": "ขั้นตอนทำจริง (p.51)",
            "body": [
              {
                "bullets": [
                  "ใช้ **single colony from pure culture**",
                  "Smear on the metal plate and drop matrix",
                  "โน้ตบนสไลด์กำกับว่า 1 หลุม 1 เชื้อ ทำได้ถึง 90 เชื้อ"
                ]
              }
            ]
          },
          {
            "sub": "Time of flight (p.53)",
            "body": [
              {
                "bullets": [
                  "อ่านค่าเป็น **m/z value คือ mass to charge ratio**",
                  "**small ion and more highly charged ion = move faster** ผ่าน drift space จนถึง detector",
                  "โน้ตบนสไลด์อธิบายลำดับว่า ยิงเลเซอร์เข้า bac. แล้ว protein ใน bac. แตกตัว จากนั้นหามวลของโปรตีน"
                ]
              }
            ]
          },
          {
            "sub": "จุดเด่นและข้อจำกัด (p.54)",
            "body": [
              {
                "text": "โน้ตบนสไลด์เขียนว่ารู้ชนิดของ bac. ไม่ถึง 3 นาที **But! ต้องมี database**"
              },
              {
                "text": "รูปประกอบเป็น spectral fingerprints obtained from whole colonies of five different bacterial species โดย matrix ที่ใช้คือ HCCA อ้างอิง Carbonnelle et al., 2011. Clinical Biochemistry. 44(1): 104-109"
              }
            ]
          },
          {
            "callout": "p.52 เป็นภาพล้วนไม่มีข้อความบนสไลด์",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "microbio-1--bacterial-physiology-and-taxonomy": {
    "topic": "microbio-1--bacterial-physiology-and-taxonomy",
    "title": "Bacterial Physiology: structure and function และ Bacterial Taxonomy",
    "icon": "🦠",
    "lecturer": "Associate Professor Pattrarat Chanchaithong, DVM, PhD",
    "summary": "Deck 49 หน้า แบ่งเป็นสองครึ่งชัดเจน ครึ่งแรก (p.3-43) ไล่โครงสร้างของ bacterial cell จากนอกเข้าใน คือ cell wall, structures located outside the cell wall (flagella, pili, capsule), cytoplasmic membrane, cytoplasm, endospore แล้วปิดท้ายด้วย biofilm และ quorum sensing โดยผูกแต่ละโครงสร้างเข้ากับสองเรื่องที่ใช้สอบและใช้จริงในคลินิกคือ การย้อมสีเพื่อ identification (Gram's stain, acid-fast stain, spore stain) และ targets for antimicrobial drug ครึ่งหลัง (p.44-49) เป็น taxonomy คือลำดับชั้นการจัดจำแนก ประวัติเกณฑ์การจำแนก แนวคิด phenotypic/genotypic/polyphasic, chemotaxonomy และ cut-off ตัวเลขของ genotypic approach หมายเหตุความซื่อสัตย์: p.5, p.36, p.48 เป็นสไลด์ภาพล้วนไม่มีข้อความอธิบาย และ p.49 เป็นภาพ phylogenetic ที่มีแต่ป้ายชื่อ phylum ไม่มีคำบรรยาย",
    "sections": [
      {
        "heading": "ขอบเขตของ deck นี้",
        "source": "Bacterial Physiology and taxonomy p.2",
        "body": [
          {
            "text": "สไลด์ Overviews วางลำดับเรื่องไว้ชัดเจน ให้ใช้เป็นโครงในการทบทวน"
          },
          {
            "bullets": [
              "Bacterial physiology: structure and function ประกอบด้วย bacterial cell, shapes and arrangements",
              "bacterial cell wall",
              "structures located outside the cell wall",
              "cytoplasmic membrane and cytoplasm",
              "bacterial endospore",
              "TAXONOMY of pathogenic bacteria"
            ]
          }
        ]
      },
      {
        "heading": "ส่วนประกอบของ prokaryotic cell",
        "source": "Bacterial Physiology and taxonomy p.3",
        "body": [
          {
            "text": "สไลด์เป็นภาพ bacterial cell พร้อมป้ายชื่อโครงสร้าง ไม่ได้อธิบายหน้าที่ในหน้านี้ (หน้าที่จะไปอยู่ในสไลด์ถัด ๆ ไปของแต่ละโครงสร้าง)"
          },
          {
            "bullets": [
              "cell wall, periplasm, cell membrane, cytoplasm",
              "mesosome, ribosome, nucleoid, cytoplasmic inclusion",
              "flagella, fimbriae หรือ pili, capsule",
              "endospore, biofilm"
            ]
          }
        ]
      },
      {
        "heading": "รูปร่างและการเรียงตัวของแบคทีเรีย",
        "source": "Bacterial Physiology and taxonomy p.4",
        "body": [
          {
            "bullets": [
              "**Sphere คือ Coccus** ตัวอย่างที่สไลด์ยกคือ Staphylococcus spp.",
              "**Rod คือ Bacillus** ตัวอย่างคือ Bacillus spp.",
              "**Spiral คือ Spirillum หรือ Spirochete** ตัวอย่างคือ Leptospira spp."
            ]
          },
          {
            "callout": "สไลด์ p.5 ต่อจากนี้เป็นภาพ bacterial cell ล้วน ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "โครงสร้างที่อยู่นอก cell wall มีอะไรบ้าง",
        "source": "Bacterial Physiology and taxonomy p.6",
        "body": [
          {
            "text": "สไลด์นี้เป็นหน้าคั่นหัวข้อ ระบุแค่รายการโครงสร้างสามอย่าง"
          },
          {
            "bullets": [
              "flagella",
              "pili หรือ fimbria",
              "capsule"
            ]
          }
        ]
      },
      {
        "heading": "ย้อมสีเพื่อ identification เป็น simple diagnostic technique",
        "source": "Bacterial Physiology and taxonomy p.7",
        "body": [
          {
            "text": "สไลด์วางกรอบคิดของทั้ง deck ไว้ตรงนี้ คือมองเซลล์แบคทีเรียเป็นสองมุมพร้อมกัน"
          },
          {
            "bullets": [
              "**การย้อมสีคือเทคนิควินิจฉัยอย่างง่าย** ภาพตัวอย่างที่สไลด์แสดงคือ Gram-negative bacilli และ Gram-positive cocci",
              "**Bacterial cell: targets for antimicrobial drug** คือโครงสร้างเดียวกันนี้เป็นเป้าของยาต้านจุลชีพ"
            ]
          }
        ]
      },
      {
        "heading": "ตารางยาต้านจุลชีพ กลไก และเป้าที่โครงสร้างเซลล์",
        "source": "Bacterial Physiology and taxonomy p.8",
        "body": [
          {
            "text": "ตารางนี้เป็นแกนเชื่อมของ deck ทั้งอัน โครงสร้างที่เรียนหน้าถัดไปแทบทุกอันโผล่มาเป็น Target ในตารางนี้"
          },
          {
            "bullets": [
              "**b-lactams** เช่น Penicillin, Amoxicillin, cephalexin กลไก Inhibition of cell wall synthesis เป้าคือ Peptidoglycan (cell wall)",
              "**Glycopeptides** เช่น Vancomycin กลไก Inhibition of cell wall synthesis เป้าคือ D-alanine-D-alanine (cell wall)",
              "**Polymyxins** เช่น Polymyxin B, Colistin กลไก Membrane disruption เป้าคือ Lipid A and cell membrane",
              "**Macrolides** เช่น Erythromycin, Azithromycin กลไก Inhibition of protein synthesis เป้าคือ 50S ribosome",
              "**Lincosamides** เช่น Clindamycin กลไก Inhibition of protein synthesis เป้าคือ 50S ribosome",
              "**Tetracyclines** เช่น Tetracycline, Doxycycline กลไก Inhibition of protein synthesis เป้าคือ 30S ribosome",
              "**Aminoglycosides** เช่น Gentamicin, Kanamycin กลไก Inhibition of protein synthesis เป้าคือ 30S ribosome"
            ]
          }
        ]
      },
      {
        "heading": "ขั้นตอนของ Gram's staining",
        "source": "Bacterial Physiology and taxonomy p.9",
        "body": [
          {
            "text": "สไลด์เป็นไดอะแกรมที่มีเฉพาะป้ายกำกับขั้นตอน ไม่ได้เขียนคำอธิบายกลไกเป็นประโยค"
          },
          {
            "bullets": [
              "**CV-I complex**",
              "**Lugol's solution**",
              "**alcohol หรือ acetone** สไลด์กำกับไว้ว่า loss outer membrane"
            ]
          },
          {
            "callout": "รายละเอียดขั้นตอนอื่นของ Gram's stain นอกจากป้ายทั้งสามนี้ สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Bacterial cell wall หน้าที่ และการแบ่งสองกลุ่มใหญ่",
        "source": "Bacterial Physiology and taxonomy p.10",
        "body": [
          {
            "text": "**Functions ของ cell wall คือ mechanical strength และกำหนด shape ของแบคทีเรีย** และ Gram's stain ใช้แยกแบคทีเรียเป็นสองกลุ่มใหญ่"
          },
          {
            "bullets": [
              "**GRAM-POSITIVE** มี thick layer of peptidoglycan ติดสีม่วง (purple)",
              "**GRAM-NEGATIVE** มี outer membrane และ lipopolysaccharide (LPS) กับ thin layer of peptidoglycan ติดสีแดง (red)"
            ]
          },
          {
            "text": "ที่มาทางประวัติศาสตร์ที่สไลด์เล่า คือ Hans Christian Joachim Gram (1853-1938) พัฒนาวิธีนี้เพื่อแยก Streptococcus pneumoniae ออกจาก Klebsiella ซึ่งเป็นสาเหตุของ severe pneumonia"
          }
        ]
      },
      {
        "heading": "Gram-positive cell wall",
        "source": "Bacterial Physiology and taxonomy p.11",
        "body": [
          {
            "bullets": [
              "**many layers of peptidoglycan**",
              "**containing teichoic acid**",
              "เป็น pathogen-associated molecular patterns (PAMPs) ที่จับกับ pattern recognizing receptors (PRRs)"
            ]
          },
          {
            "text": "**PRRs ที่สไลด์ระบุคือ TLR-2 และคู่ TLR-2/TLR-6 ซึ่งจดจำ peptidoglycan และ teichoic acid**"
          }
        ]
      },
      {
        "heading": "Gram-negative cell wall",
        "source": "Bacterial Physiology and taxonomy p.12",
        "body": [
          {
            "bullets": [
              "**outer membrane ประกอบด้วย lipopolysaccharide-lipoprotein-phospholipid**",
              "**thin peptidoglycan layer**",
              "**no teichoic acid**"
            ]
          }
        ]
      },
      {
        "heading": "Periplasm",
        "source": "Bacterial Physiology and taxonomy p.13",
        "body": [
          {
            "text": "**Periplasm พบเฉพาะใน gram-negative bacteria เท่านั้น เป็นช่องว่างระหว่าง inner membrane กับ outer membrane**"
          },
          {
            "sub": "Functions ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "nutrient binding",
                  "transport, folding, degradation สำหรับ peptidoglycan synthesis",
                  "electron transport",
                  "xenobiotic metabolism"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Lipopolysaccharide (LPS) ใน gram-negative",
        "source": "Bacterial Physiology and taxonomy p.14",
        "body": [
          {
            "sub": "Components",
            "body": [
              {
                "bullets": [
                  "lipid A",
                  "core polysaccharide",
                  "O-antigen polysaccharide"
                ]
              }
            ]
          },
          {
            "sub": "Functions",
            "body": [
              {
                "bullets": [
                  "endotoxin",
                  "receptors for bacteriophages",
                  "serological properties"
                ]
              }
            ]
          },
          {
            "text": "PAMPs และ PRRs ที่เกี่ยวข้อง สไลด์ระบุ **TLR-4**"
          }
        ]
      },
      {
        "heading": "Bacterial endotoxin เทียบกับ exotoxin",
        "source": "Bacterial Physiology and taxonomy p.15",
        "body": [
          {
            "text": "**BACTERIAL ENDOTOXIN คือ Lipid A ของ Lipopolysaccharide** สไลด์ระบุผลว่า elicits a variety of immune response, releasing of proinflammatory cytokines และ causing fever and septic shock"
          },
          {
            "sub": "ตารางเปรียบเทียบ ENDOTOXIN กับ EXOTOXIN",
            "body": [
              {
                "bullets": [
                  "Chemical nature: ENDOTOXIN เป็น Lipopolysaccharide (MW=10 kDa) ส่วน EXOTOXIN เป็น Protein (MW=50-1000 kDa)",
                  "Relationship to cell: ENDOTOXIN เป็น part of outer membrane ส่วน EXOTOXIN เป็น extracellular, diffusible",
                  "Denatured by boiling: ENDOTOXIN relatively heat stable ส่วน EXOTOXIN relatively heat labile",
                  "Antigenic: ทั้งคู่ Yes",
                  "Potency: ENDOTOXIN relatively low (>100 µg) ส่วน EXOTOXIN relatively high (1 µg)",
                  "Specificity: ENDOTOXIN low ส่วน EXOTOXIN high",
                  "Enzymatic activity: ENDOTOXIN No ส่วน EXOTOXIN often",
                  "Pyrogenicity: ENDOTOXIN Yes ส่วน EXOTOXIN occasionally"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Peptidoglycan คือ Achilles' heel ของแบคทีเรีย",
        "source": "Bacterial Physiology and taxonomy p.16",
        "body": [
          {
            "text": "สไลด์อ้างคำว่า **Bacterial Achilles' heel (Coyette, 2008)** และระบุว่า peptidoglycan เป็น target of successful sets of antibacterial agents ได้แก่ beta-lactams, glycopeptides และอื่น ๆ"
          },
          {
            "text": "สไลด์เสริมว่า งานวิจัยระยะหลังทำให้เข้าใจมากขึ้นว่าจะใช้ประโยชน์จาก peptidoglycan-based therapeutics ได้อย่างไร (Lovering et al., 2012)"
          }
        ]
      },
      {
        "heading": "เป้าของยาบน peptidoglycan",
        "source": "Bacterial Physiology and taxonomy p.17",
        "body": [
          {
            "text": "**Peptidoglycan พบทั้งใน gram-positive และ gram-negative** จึงเป็นเป้าที่ใช้ได้กว้าง"
          },
          {
            "bullets": [
              "**beta-lactams เช่น penicillin ยับยั้ง transpeptidase**",
              "**glycopeptides เช่น vancomycin ยับยั้ง D-ala-D-ala synthesis**",
              "สไลด์ p.18 ขยายภาพให้เห็นว่า transpeptidase คือเอนไซม์ที่ทำ cross-linking และ D-alanine-D-alanine คือ side chain amino acid ซึ่งเป็นเป้าของ glycopeptides"
            ]
          }
        ]
      },
      {
        "heading": "ตารางเปรียบเทียบ gram-positive กับ gram-negative",
        "source": "Bacterial Physiology and taxonomy p.19",
        "body": [
          {
            "bullets": [
              "Gram reaction: gram-positive retain crystal violet ติดสีน้ำเงินหรือม่วง ส่วน gram-negative ถูก decolorized แล้วรับ counter stain (safranin) ติดสีชมพูหรือแดง",
              "Peptidoglycan layer: thick (multiple) เทียบกับ thin (single)",
              "**Teichoic acid: present in many ใน gram-positive แต่ absent ใน gram-negative**",
              "**Periplasmic space: absent ใน gram-positive แต่ present ใน gram-negative**",
              "**Outer membrane: absent เทียบกับ present**",
              "LPS content: virtually none เทียบกับ high",
              "Lipid and lipoprotein content: gram-positive low โดยสไลด์วงเล็บไว้ว่า acid fast bacteria have lipid links to peptidoglycan ส่วน gram-negative high เพราะมี outer membrane",
              "**Flagella structure: gram-positive มี 2 rings in basal body ส่วน gram-negative มี 4 rings in basal body**",
              "**Toxin produced: gram-positive สร้าง exotoxin ส่วน gram-negative สร้างทั้ง endotoxin และ exotoxin**",
              "Resistance to physical disruption: gram-positive high ส่วน gram-negative low",
              "Cell wall disruption by lysozyme: gram-positive high ส่วน gram-negative low เพราะต้อง pretreatment และ destabilize outer membrane ก่อน"
            ]
          }
        ]
      },
      {
        "heading": "Atypical cell wall",
        "source": "Bacterial Physiology and taxonomy p.20",
        "body": [
          {
            "sub": "Mycoplasma",
            "body": [
              {
                "bullets": [
                  "**lack of cell wall**",
                  "มี sterols ใน plasma membrane ช่วย protect from osmotic lysis"
                ]
              }
            ]
          },
          {
            "sub": "Mycobacterium",
            "body": [
              {
                "bullets": [
                  "**Mycolic acid ทำให้เป็น waxy cell wall ที่ resistant to decolorization เมื่อย้อมด้วย carbolfuschin**",
                  "Arabinogalactan",
                  "Lipoarabinomanan"
                ]
              }
            ]
          },
          {
            "sub": "Nocardia",
            "body": [
              {
                "bullets": [
                  "**intermediate-length mycolic acid**",
                  "**partially acid fast**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Acid-fast staining (Ziehl-Neelsen stain)",
        "source": "Bacterial Physiology and taxonomy p.21",
        "body": [
          {
            "bullets": [
              "**Primary stain คือ carbol fuschin ร่วมกับ heat**",
              "**Decolorization ใช้ acid alcohol**",
              "**Counter stain คือ methylene blue**"
            ]
          },
          {
            "text": "สไลด์แสดงผลเป็นสองแบบคือ acid-fast กับ non acid-fast แต่ไม่ได้เขียนกำกับว่าสีที่เห็นในแต่ละแบบเรียกว่าอะไร"
          }
        ]
      },
      {
        "heading": "Bacterial flagellum โครงสร้าง",
        "source": "Bacterial Physiology and taxonomy p.22",
        "body": [
          {
            "bullets": [
              "**Filament เป็น helix และ rigid สร้างจากโปรตีน flagellin ซึ่งเป็น flagella antigen หรือ H-antigen**",
              "Hook",
              "**Basal body ทำหน้าที่เป็น rotary motor**",
              "**พลังงานมาจาก proton motive force**"
            ]
          }
        ]
      },
      {
        "heading": "การจัดเรียงของ flagella",
        "source": "Bacterial Physiology and taxonomy p.23",
        "body": [
          {
            "bullets": [
              "**Monotrichous flagellum** คือ a single flagellum ปกติอยู่ที่ขั้วเดียว",
              "**Lophotrichous flagella** คือ two or more flagella ที่ปลายด้านเดียวหรือทั้งสองด้าน",
              "**Amphitrichous flagella** คือมี flagellum ที่ปลายทั้งสองด้าน",
              "**Peritrichous flagella** คือ flagella กระจายทั่วผิวเซลล์",
              "**Axial filaments** หรือ endoflagella (axial fibrils)"
            ]
          }
        ]
      },
      {
        "heading": "หน้าที่ของ flagellum และ motility test",
        "source": "Bacterial Physiology and taxonomy p.24",
        "body": [
          {
            "text": "**Function ของ bacterial flagellum คือ bacterial motility and movement**"
          },
          {
            "bullets": [
              "**Motility test ใช้ motility test medium ซึ่งเป็น semisolid**",
              "สไลด์กำกับรูปแบบการเคลื่อนที่ไว้ว่า running and tumbling"
            ]
          }
        ]
      },
      {
        "heading": "Fimbria และ pilus",
        "source": "Bacterial Physiology and taxonomy p.25",
        "body": [
          {
            "text": "**Fimbria และ pilus เป็น thin and short appendages** สไลด์แสดงภาพเทียบให้เห็น flagella, fimbriae และ sex pilus บนเซลล์เดียวกัน"
          },
          {
            "sub": "Function",
            "body": [
              {
                "bullets": [
                  "Twitching motility",
                  "**Conjugation ผ่าน sex pilus**",
                  "**Adhesion molecule**",
                  "Receptors for bacteriophage",
                  "Fimbrial antigen"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ p.26 ขยายว่า fimbria เป็นกลไก bacterial adhesion โดยจับกับ oligosaccharides บน target cells และเป็น protein receptors สำหรับ bacteriophage ส่วน sex pilus ใช้ในการ conjugation"
          }
        ]
      },
      {
        "heading": "Capsule",
        "source": "Bacterial Physiology and taxonomy p.27",
        "body": [
          {
            "bullets": [
              "องค์ประกอบเป็น polysaccharides, polypeptides และอื่น ๆ",
              "รูปแบบที่เกี่ยวข้องคือ slime layer",
              "**ลักษณะโคโลนีที่เห็นคือ mucoid colonies**"
            ]
          },
          {
            "sub": "Functions",
            "body": [
              {
                "bullets": [
                  "**virulence factor เช่น antiphagocytosis และ adhesion**",
                  "prevent desiccation",
                  "prevent bacterial viruses",
                  "prevent hydrophobic toxic substances",
                  "**capsular antigen หรือ K-antigen**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cell membrane",
        "source": "Bacterial Physiology and taxonomy p.28",
        "body": [
          {
            "bullets": [
              "โครงสร้างเป็น phospholipid bilayer ร่วมกับ membrane protein"
            ]
          },
          {
            "sub": "Functions",
            "body": [
              {
                "bullets": [
                  "**permeability barrier ทั้งแบบ active transport และ passive transport**",
                  "Secretory system"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Membrane proteins",
        "source": "Bacterial Physiology and taxonomy p.29",
        "body": [
          {
            "bullets": [
              "**Protein channels** สไลด์ชี้ตำแหน่งไว้ที่ outer membrane ของ gram-negative cell wall",
              "**Efflux pump** สไลด์ชี้ตำแหน่งไว้ที่ cell membrane"
            ]
          },
          {
            "text": "สไลด์อ้างอิงภาพจาก Li et al. 2015. Clin Microbiol Rev. 28(2): 337-418"
          }
        ]
      },
      {
        "heading": "Efflux pump กับการดื้อยา",
        "source": "Bacterial Physiology and taxonomy p.30",
        "body": [
          {
            "text": "**Efflux pump ทำหน้าที่ expulsion of toxic compounds คือขับสารพิษออกจากเซลล์**"
          },
          {
            "bullets": [
              "**Multidrug efflux pump**",
              "**Cross resistance เพราะปั๊มรับ substrates ได้หลากหลาย**"
            ]
          },
          {
            "text": "สไลด์อ้างอิงภาพ Functional roles of bacterial multidrug efflux pumps จาก Beceiro et al., 2013. Clin Microbiol. Rev. 26(2):185"
          }
        ]
      },
      {
        "heading": "Bacterial secretion systems",
        "source": "Bacterial Physiology and taxonomy p.31",
        "body": [
          {
            "text": "**สไลด์ระบุว่า bacterial secretion systems มี 6 types** แต่ไม่ได้ไล่ชื่อครบทั้งหกในหน้านี้"
          },
          {
            "bullets": [
              "หน้าที่คือ secretion of bacterial substances",
              "**เกี่ยวข้องกับ pathogenesis โดยเป็นการหลั่ง virulence factors รวมถึง exotoxins ซึ่งเป็นโปรตีน**",
              "**ตัวอย่างที่สไลด์ยกคือ Type III secretion system ซึ่งมี needle-liked structure**"
            ]
          },
          {
            "callout": "รายละเอียดของ secretion system ชนิดที่เหลืออีก 5 ชนิด สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ยาที่ออกฤทธิ์ที่ cell membrane",
        "source": "Bacterial Physiology and taxonomy p.32",
        "body": [
          {
            "text": "**Polymyxins ได้แก่ Polymyxin B และ colistin ออกฤทธิ์โดย destabilization of membranes**"
          },
          {
            "bullets": [
              "**Binding to LPS แล้ว displaces cations**",
              "**Destabilization ทั้ง outer membrane และ inner membrane**",
              "**Lysis of bacterial cells**"
            ]
          },
          {
            "text": "สไลด์อ้างอิงภาพ Action of colistin on bacterial membrane จาก Matis et al. 2014. J Infect. 69(1): 1-12"
          }
        ]
      },
      {
        "heading": "Mesosome",
        "source": "Bacterial Physiology and taxonomy p.33",
        "body": [
          {
            "text": "**Mesosome คือ folded invaginations ของ cell membrane**"
          },
          {
            "sub": "Functions",
            "body": [
              {
                "bullets": [
                  "cellular respiration และ oxidative phosphorylation",
                  "cell wall formation ระหว่าง cell division"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cytoplasm ประกอบด้วยอะไร",
        "source": "Bacterial Physiology and taxonomy p.34",
        "body": [
          {
            "bullets": [
              "Cytosol",
              "Organelle ได้แก่ ribosome",
              "**Cytoplasmic inclusions คือ small particles of insoluble substances**",
              "Nucleoid",
              "Mobile genetic elements"
            ]
          }
        ]
      },
      {
        "heading": "Ribosome",
        "source": "Bacterial Physiology and taxonomy p.35",
        "body": [
          {
            "text": "**Ribosome เป็น non membrane-bounded organelle หน้าที่คือ protein synthesis**"
          },
          {
            "bullets": [
              "องค์ประกอบคือ 65% ribosomal RNA และ 35% ribosomal protein",
              "**Prokaryotic ribosome คือ 70S ribosome**",
              "**large subunit (50S) ประกอบด้วย 23S RNA subunit และ 5S RNA subunit**",
              "**small subunit (30S) ประกอบด้วย 16S RNA subunit**"
            ]
          }
        ]
      },
      {
        "heading": "ยาที่ออกฤทธิ์ที่ ribosome",
        "source": "Bacterial Physiology and taxonomy p.37",
        "body": [
          {
            "text": "**กลไกร่วมคือ inhibition of protein synthesis** สไลด์แยกตาม subunit ที่ยาไปจับ"
          },
          {
            "bullets": [
              "**Small subunit (30S) ได้แก่ Tetracyclines และ Aminoglycosides**",
              "**Large subunit (50S) ได้แก่ Macrolides, Lincosamides, Phenicols และ Oxazolidiones**"
            ]
          },
          {
            "callout": "สไลด์ p.36 ก่อนหน้านี้เป็นภาพ prokaryotic ribosome ขณะทำ protein synthesis ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Nucleoid และ mobile genetic elements",
        "source": "Bacterial Physiology and taxonomy p.38",
        "body": [
          {
            "sub": "Nucleoid (nucleus-like)",
            "body": [
              {
                "bullets": [
                  "**เป็น genetic materials แบบ circular, supercoiling double-stranded DNA**",
                  "เรียกว่า genophore ซึ่งเทียบได้กับ chromosome",
                  "องค์ประกอบคือ DNA 60% และมี RNA กับ protein จำนวนเล็กน้อย ได้แก่ messenger RNA, transcriptional factors และ nucleoid-associated protein"
                ]
              }
            ]
          },
          {
            "sub": "Mobile genetic elements ตัวอย่างคือ Plasmid",
            "body": [
              {
                "bullets": [
                  "**เป็น extrachromosomal DNA และเป็น mobile genetic element**",
                  "**เป็น circular DNA ที่ self replication ได้ และพา gene สำหรับการอยู่รอด**",
                  "**ยีนที่สไลด์ระบุคือ antimicrobial resistance genes และ virulence genes**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Bacterial endospore",
        "source": "Bacterial Physiology and taxonomy p.39",
        "body": [
          {
            "text": "**Spore-forming bacteria ที่สไลด์ยกตัวอย่างคือ Bacillus spp. และ Clostridium spp.** วงจรที่สไลด์กำกับไว้คือ sporulation และ germination"
          },
          {
            "bullets": [
              "**มี hard protective coating เปรียบเหมือน mummified bacterium**",
              "**มีไว้เพื่อ survive ในสภาพแวดล้อมที่ขาดแคลน คือ dry, hot และ lack of nutrients**"
            ]
          },
          {
            "sub": "For resistance to",
            "body": [
              {
                "bullets": [
                  "ultraviolet radiation",
                  "desiccation",
                  "high temperature และ freezing",
                  "**chemical disinfectants**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Spore stain (Schaeffer-Fulton stain)",
        "source": "Bacterial Physiology and taxonomy p.40",
        "body": [
          {
            "bullets": [
              "**Primary stain คือ malachite green ร่วมกับ heat**",
              "**Counter stain หรือ secondary stain คือ safranin**",
              "**ผลที่อ่านได้คือ spore ติดสีเขียว ส่วน vegetative cell ติดสีแดง**"
            ]
          },
          {
            "sub": "โครงสร้างของ spore ที่สไลด์กำกับในภาพ",
            "body": [
              {
                "bullets": [
                  "Cr คือ core และ Cx คือ cortex ซึ่งเป็น cortex peptidoglycan",
                  "Coat แบ่งเป็น outer coat (Oc), inner coat (Ic) และ under coat (Uc) เป็น protein coat",
                  "membrane และ thin germ cell wall"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Biofilm formation",
        "source": "Bacterial Physiology and taxonomy p.41",
        "body": [
          {
            "bullets": [
              "**เกิดจาก production of extracellular matrix**",
              "**สารที่สร้างคือ extracellular polymeric substance (EPS)**",
              "สไลด์เทียบสองสถานะคือ planktonic cell กับ sessile cells โดยแยกกรณี biofilm formation และ no biofilm formation"
            ]
          }
        ]
      },
      {
        "heading": "ความสำคัญของ biofilm",
        "source": "Bacterial Physiology and taxonomy p.42",
        "body": [
          {
            "bullets": [
              "**Persistent colonization ในสิ่งแวดล้อม**",
              "**Colonization of medical devices ตัวอย่างที่สไลด์ยกคือ IV catheter และ urethral catheter**",
              "**decrease susceptibility to antimicrobial drugs**",
              "**evade immune system**",
              "**allow exchange of extrachromosomal DNA ภายใน bacterial community**"
            ]
          }
        ]
      },
      {
        "heading": "Quorum sensing",
        "source": "Bacterial Physiology and taxonomy p.43",
        "body": [
          {
            "text": "หัวข้อบนสไลด์คือ bacterial communication"
          },
          {
            "bullets": [
              "**แบคทีเรียสร้าง signaling molecules เรียกว่า autoinducer**",
              "**ทำงานผ่าน positive feedback loops แล้วเกิด induction of gene expression**",
              "**ผลคือ expression of virulence factors และ biofilm formation**"
            ]
          },
          {
            "text": "ตัวอย่างที่สไลด์แสดงคือ bioluminescence of Vibrio fischeri"
          }
        ]
      },
      {
        "heading": "ลำดับชั้นของ Bacterial Taxonomy และประวัติเกณฑ์การจำแนก",
        "source": "Bacterial Physiology and taxonomy p.44",
        "body": [
          {
            "sub": "ลำดับชั้นจากบนลงล่าง",
            "body": [
              {
                "bullets": [
                  "Domain (superkingdom), Kingdom, Phylum หรือ division, Class, Order, Family, Genus, Species"
                ]
              }
            ]
          },
          {
            "sub": "History of classification of Bacteria and Archaea",
            "body": [
              {
                "bullets": [
                  "**Late 19th century จำแนกด้วย Morphology, Growth Requirements, Pathogenic potentials**",
                  "**1900-1960 ใช้ Morphology, Physiology, Biochemistry**",
                  "**1960-1980 ใช้ Chemotaxonomy, Numerical Taxonomy, DNA-DNA Hybridization**",
                  "**1980-today ใช้ Genotypic Analyses, Multilocus Sequence Analyses, Average Nucleotide Identity, Whole Genome Analysis**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Concepts of classification",
        "source": "Bacterial Physiology and taxonomy p.45",
        "body": [
          {
            "text": "สไลด์แบ่งแนวคิดเป็นสองแบบใหญ่"
          },
          {
            "sub": "Theory-based model for speciation",
            "body": [
              {
                "bullets": [
                  "อาศัย interbreeding natural populations",
                  "**ใช้ได้กับ animals และ some plants** ซึ่งสื่อว่าใช้กับแบคทีเรียไม่ได้ตรง ๆ"
                ]
              }
            ]
          },
          {
            "sub": "Operational-based model คือใช้ criteria และ cut-off value ในการจัดกลุ่ม",
            "body": [
              {
                "bullets": [
                  "**phenotypic approach** ใช้ morphological, physiological และ chemotaxonomic properties",
                  "**genotypic approach** ใช้ DNA-DNA hybridization และ sequence analyses",
                  "**polyphasic approach** ใช้ร่วมกันทั้ง phenotypic data, chemotaxonomic data, genotypic data และ phylogenetic data"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Chemotaxonomy",
        "source": "Bacterial Physiology and taxonomy p.46",
        "body": [
          {
            "bullets": [
              "**DNA base composition ดู Guanine-cytosine content (GC content) ของ DNA โดยสิ่งมีชีวิตใน genus เดียวกันต่างกันน้อยกว่า 10%**",
              "**Lipids: Bacteria มี fatty acid ester lipid ส่วน Archaea มี alkyl glycerol ether lipids**",
              "**Cytochrome: absence of cytochrome C ในกลุ่ม staphylococci และ enterobacteria ส่วน presence of cytochrome C ในกลุ่ม micrococci และ pseudomonads**",
              "**Peptidoglycan คิดเป็นมากกว่า 30% ของ cell wall ใน gram-positive bacteria**"
            ]
          }
        ]
      },
      {
        "heading": "Genotypic approach และตัวเลข cut-off",
        "source": "Bacterial Physiology and taxonomy p.47",
        "body": [
          {
            "text": "หน้านี้เป็นตัวเลขที่ต้องจำ"
          },
          {
            "bullets": [
              "**DNA-DNA hybridization มากกว่า 70% identity**",
              "**DNA sequence ของ 16S rRNA gene มากกว่า 98.5% identity**",
              "**Average nucleotide identity จาก complete genome sequence ที่ 95%**"
            ]
          },
          {
            "text": "สไลด์อธิบายรากศัพท์ PHYLOGENETICS ไว้ว่า phylo- (phylon) แปลว่า race หรือ tribe และ genetics (genesis) แปลว่า source พร้อมภาพ phylogenetic tree"
          },
          {
            "callout": "สไลด์ p.48 เป็นภาพเปรียบเทียบ DNA-DNA hybridization กับ DNA sequence analysis โดยไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "BACTERIAL PHYLA",
        "source": "Bacterial Physiology and taxonomy p.49",
        "body": [
          {
            "text": "หน้าสุดท้ายเป็นภาพต้นไม้ที่มีเฉพาะป้ายกำกับ ไม่มีคำบรรยาย ป้ายที่ปรากฏคือ"
          },
          {
            "bullets": [
              "Phylum Bacillota",
              "Phylum Pseudomonadota",
              "Mycobacterium and higher bacteria"
            ]
          },
          {
            "callout": "ความสัมพันธ์ระหว่าง phyla เหล่านี้ และรายชื่อ phyla อื่นที่เหลือ สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "microbio-1--biosafety": {
    "topic": "microbio-1--biosafety",
    "title": "Biosafety, Biosecurity และ Good Laboratory Practice",
    "icon": "🦠",
    "lecturer": "Associate Prof. Dr. Channarong Rodkhum",
    "summary": "เด็คนี้ 13 สไลด์ เนื้อหาที่มีตัวอักษรจริงอยู่แค่ 3 เรื่อง คือ นิยาม biohazards, ระบบ Biosafety level (BSL-1 ถึง BSL-4) แบบละเอียดทีละระดับ และ Biosafety Cabinets (BSC) 3 classes. หน้า 8 ถึง 11 เป็นสไลด์รูปล้วน ไม่มีข้อความให้สรุป. ชื่อเด็คมีคำว่า Biosecurity และ Good laboratory practice แต่ในตัวอักษรของสไลด์ไม่มีส่วนที่อธิบายสองเรื่องนี้เลย น่าจะอยู่ในหน้ารูปหรืออาจารย์พูดเสริมในห้อง",
    "sections": [
      {
        "heading": "Biohazards คืออะไร",
        "source": "Biosafety p.2",
        "body": [
          {
            "text": "**Biohazards คือ infectious agents หรือ disease causing agents ที่เป็นภัยคุกคามต่อ public health หรือต่อสิ่งแวดล้อม**"
          },
          {
            "text": "สไลด์ยกตัวอย่างสิ่งที่นับเป็น biohazard ไว้ดังนี้"
          },
          {
            "bullets": [
              "bacteria",
              "fungi",
              "viruses",
              "parasites",
              "allergens",
              "cultured cells",
              "และอื่น ๆ (สไลด์เขียน etc. ไว้ ไม่ได้ระบุครบ)"
            ]
          },
          {
            "callout": "จำไว้ว่านิยามนี้กว้างกว่าที่หลายคนคิด allergens และ cultured cells ก็ถูกนับเป็น biohazard ตามสไลด์นี้ ไม่ได้จำกัดแค่เชื้อก่อโรค",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Biosafety level ภาพรวม",
        "source": "Biosafety p.3",
        "body": [
          {
            "text": "**Biosafety level คือชุดของ biocontainment precautions ที่ต้องใช้เพื่อ isolate เชื้อที่อันตราย ไว้ในห้องปฏิบัติการที่ปิด (enclosed laboratory facility)**"
          },
          {
            "text": "ระดับของ containment ไล่จากต่ำสุด **BSL-1** ไปสูงสุด **BSL-4** และสไลด์ระบุว่าในสหรัฐอเมริกา **CDC (Centers for Disease Control and Prevention) เป็นผู้กำหนดระดับเหล่านี้**"
          },
          {
            "sub": "ระดับต่ำสุดกับระดับสูงต่างกันตรงไหน",
            "body": [
              {
                "bullets": [
                  "ระดับต่ำสุด: มาตรการอาจมีแค่ regular hand-washing และ protective equipment ขั้นต่ำ",
                  "ระดับสูงขึ้น: airflow systems, multiple containment rooms, sealed containers, positive pressure personnel suits, established protocols สำหรับทุกขั้นตอน, การ training บุคลากรอย่างเข้มข้น และ security ระดับสูงเพื่อคุมการเข้าออกอาคาร"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "BSL-1",
        "source": "Biosafety p.4",
        "body": [
          {
            "text": "**เหมาะกับงานที่ใช้เชื้อที่ well-characterized และไม่ก่อโรคในคนสุขภาพดี** เชื้อกลุ่มนี้ควรมี potential hazard น้อยที่สุดทั้งต่อผู้ปฏิบัติงานและต่อสิ่งแวดล้อม"
          },
          {
            "sub": "ข้อปฏิบัติตามสไลด์",
            "body": [
              {
                "bullets": [
                  "บุคลากรต้อง **ล้างมือทั้งตอนเข้าและตอนออก** จากห้องปฏิบัติการ",
                  "ทำงานบน **standard open laboratory benches ได้ ไม่ต้องใช้ containment equipment พิเศษ**",
                  "โดยทั่วไป **ห้ามกินและดื่ม** ในพื้นที่ห้องปฏิบัติการ",
                  "วัสดุที่อาจติดเชื้อต้อง decontaminate ก่อนทิ้ง โดยเติมสารเคมีเช่น bleach หรือ isopropanol หรือแพ็คส่งไป decontaminate ที่อื่น",
                  "PPE จำเป็นเฉพาะกรณีที่บุคลากรอาจสัมผัส hazardous material เท่านั้น"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างเชื้อที่สไลด์ยกไว้",
            "body": [
              {
                "bullets": [
                  "non-pathogenic strains ของ Escherichia coli และ Staphylococcus",
                  "Bacillus subtilis",
                  "Saccharomyces cerevisiae",
                  "และเชื้ออื่นที่ไม่สงสัยว่าก่อโรคในคน"
                ]
              }
            ]
          },
          {
            "text": "สไลด์บอกว่าห้องระดับนี้คือแบบที่ใช้เป็น **teaching space ของโรงเรียนมัธยมและมหาวิทยาลัย**"
          }
        ]
      },
      {
        "heading": "BSL-2",
        "source": "Biosafety p.5",
        "body": [
          {
            "text": "**ใช้ข้อปฏิบัติทั้งหมดของ BSL-1 เป็นพื้นฐาน** แล้วเพิ่มมาตรการต่อไปนี้ (สไลด์เขียนชัดว่า BSL-2 ต่างจาก BSL-1 ตรงจุดเหล่านี้)"
          },
          {
            "bullets": [
              "บุคลากรได้รับ **specific training ในการจัดการ pathogenic agents** และทำงานภายใต้การกำกับของนักวิทยาศาสตร์ที่ผ่านการอบรมขั้นสูง",
              "**จำกัดการเข้าห้องปฏิบัติการขณะกำลังทำงาน**",
              "ระวังอย่างยิ่งกับ contaminated sharp items",
              "**บางขั้นตอน (certain procedures) ที่อาจเกิด infectious aerosols ทำใน biological safety cabinets** หรือ physical containment equipment อื่น สไลด์เขียนว่า \"Certain procedures in which infectious aerosols may be created are conducted in biological safety cabinets or other physical containment equipment\" ไม่ได้เขียนว่าทุกขั้นตอน"
            ]
          },
          {
            "text": "**เหมาะกับงานที่ใช้เชื้อซึ่งมี moderate potential hazard ต่อคนและสิ่งแวดล้อม** ได้แก่เชื้อที่ก่อโรคไม่รุนแรงในคน หรือเชื้อที่ติดทาง aerosol ในห้องแล็บได้ยาก"
          },
          {
            "sub": "ตัวอย่างเชื้อที่สไลด์ยกไว้",
            "body": [
              {
                "bullets": [
                  "Hepatitis A, B และ C viruses",
                  "human immunodeficiency virus (HIV)",
                  "pathogenic strains ของ Escherichia coli และ Staphylococcus",
                  "Salmonella",
                  "Plasmodium falciparum",
                  "Toxoplasma gondii"
                ]
              }
            ]
          },
          {
            "callout": "สังเกตว่า E. coli และ Staphylococcus โผล่ทั้งใน BSL-1 และ BSL-2 ตัวแบ่งคือคำว่า non-pathogenic strains (BSL-1) กับ pathogenic strains (BSL-2) ไม่ใช่ตัวชื่อ genus",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "BSL-3",
        "source": "Biosafety p.6",
        "body": [
          {
            "text": "**เหมาะกับงานที่ใช้เชื้อซึ่งก่อโรครุนแรงและอาจถึงตายผ่าน inhalation route** สไลด์ระบุว่างานลักษณะนี้ทำได้ทั้งใน clinical, diagnostic, teaching, research หรือ production facilities"
          },
          {
            "text": "ใช้ข้อปฏิบัติของ BSL-1 และ BSL-2 ทั้งหมด แล้วเพิ่ม 4 ข้อนี้"
          },
          {
            "bullets": [
              "บุคลากรทุกคนได้รับ **medical surveillance และได้รับข้อเสนอให้ immunization ที่เกี่ยวข้อง** เพื่อลดความเสี่ยงการติดเชื้อโดยอุบัติเหตุหรือแบบไม่รู้ตัว",
              "**ทุกขั้นตอนที่เกี่ยวกับ infectious material ต้องทำใน biological safety cabinet**",
              "ต้องสวม **solid-front protective clothing** (เสื้อคลุมที่ผูกด้านหลัง) ห้ามใส่ออกนอกห้องปฏิบัติการ และต้องทิ้งหรือ decontaminate หลังใช้ทุกครั้ง",
              "ต้องมี **laboratory-specific biosafety manual** ที่เขียนรายละเอียดว่าห้องนี้จะดำเนินงานให้เป็นไปตามข้อกำหนดด้านความปลอดภัยอย่างไร"
            ]
          },
          {
            "sub": "ตัวอย่างเชื้อที่สไลด์ยกไว้ (ติดทาง aerosols และ/หรือก่อโรครุนแรง)",
            "body": [
              {
                "bullets": [
                  "Francisella tularensis",
                  "Mycobacterium tuberculosis",
                  "Chlamydia psittaci",
                  "Venezuelan equine encephalitis virus",
                  "Eastern equine encephalitis virus",
                  "SARS coronavirus",
                  "Coxiella burnetii",
                  "Rift Valley fever virus",
                  "Rickettsia rickettsii",
                  "Brucella หลาย species",
                  "chikungunya",
                  "yellow fever virus",
                  "West Nile virus"
                ]
              }
            ]
          },
          {
            "callout": "ตัวแยก BSL-2 กับ BSL-3 ที่สไลด์ใช้คือ inhalation route และความรุนแรงถึงตาย ไม่ใช่แค่ความเป็น pathogen และที่ BSL-3 คำว่า certain procedures (BSL-2) กลายเป็น all procedures ที่เกี่ยวกับ infectious material ต้องอยู่ใน BSC",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "BSL-4",
        "source": "Biosafety p.7",
        "body": [
          {
            "text": "**ระดับสูงสุด เหมาะกับเชื้อที่ติดทาง aerosol ในห้องแล็บได้ง่าย และก่อโรครุนแรงถึงตายในคน โดยที่ยังไม่มี vaccine หรือ treatment ที่ใช้ได้**"
          },
          {
            "sub": "รูปแบบห้อง BSL-4",
            "body": [
              {
                "text": "สไลด์บอกว่าโดยทั่วไปจัดเป็น 2 แบบ คือ **cabinet laboratories** หรือ **protective-suit laboratories**"
              },
              {
                "bullets": [
                  "ใน cabinet laboratories งานทุกอย่างต้องทำใน **class III biosafety cabinet**",
                  "วัสดุที่ออกจาก cabinet ต้อง decontaminate โดยผ่าน autoclave หรือถังน้ำยา disinfectant"
                ]
              }
            ]
          },
          {
            "sub": "การออกจากห้องและการควบคุมคนเข้า",
            "body": [
              {
                "text": "**ขั้นตอนออกจากห้อง BSL-4 ตามสไลด์เรียงตามลำดับคือ chemical shower เพื่อ decontamination แล้วเข้าห้องถอด positive-pressure suit แล้วจึงอาบน้ำส่วนตัว (personal shower)**"
              },
              {
                "text": "การเข้าห้อง BSL-4 จำกัดเฉพาะผู้ที่ผ่านการอบรมและได้รับอนุญาต และ **ทุกคนที่เข้าและออกต้องถูกบันทึกไว้**"
              }
            ]
          }
        ]
      },
      {
        "heading": "สไลด์หน้า 8 ถึง 11",
        "source": "Biosafety p.8-11",
        "body": [
          {
            "text": "สไลด์ 4 หน้านี้ **ไม่มีข้อความในชั้น text เลย** น่าจะเป็นสไลด์รูปหรือแผนผังล้วน จึงสรุปเป็นตัวอักษรไม่ได้ ต้องกลับไปดูสไลด์จริงหรือฟังที่อาจารย์บรรยายในห้อง"
          },
          {
            "callout": "อย่าเดาเนื้อหาช่วงนี้ ตำแหน่งของมันอยู่ระหว่าง BSL-4 กับ Biosafety Cabinets แต่สไลด์ไม่ได้บอกว่าเป็นเรื่องอะไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Biosafety Cabinets (BSC)",
        "source": "Biosafety p.12-13",
        "body": [
          {
            "text": "**BSC ออกแบบมาเพื่อป้องกัน 3 อย่าง คือ ผู้ใช้ (user), ตัวอย่าง (samples) และ/หรือสิ่งแวดล้อม จากการปนเปื้อนด้วย biological materials**"
          },
          {
            "text": "มี **3 classes คือ Class I, II และ III** ซึ่งให้ระดับการป้องกันต่อผู้ปฏิบัติงาน ตัวอย่าง และสิ่งแวดล้อม เพิ่มขึ้นตามลำดับ"
          },
          {
            "sub": "Class I",
            "body": [
              {
                "text": "**ป้องกัน user และ environment แต่ไม่ป้องกัน sample** เพราะอากาศถูกดูดจากห้องปฏิบัติการผ่านตัวอย่างแล้วไหลออกทางด้านหลังตู้ ตัวอย่างจึงอาจปนเปื้อนได้ เหมาะกับงานที่ใช้เชื้อความเสี่ยง low ถึง moderate"
              }
            ]
          },
          {
            "sub": "Class II",
            "body": [
              {
                "text": "**ป้องกันครบทั้ง user, sample และ environment และเป็น class ที่ใช้กันเป็นหลัก** class นี้ยังแบ่งย่อยเป็นหลาย types ตามปริมาณอากาศที่ถูกดูดเข้าตู้และวิธีระบายอากาศออก (สไลด์ไม่ได้ระบุว่ามี type อะไรบ้าง)"
              }
            ]
          },
          {
            "sub": "Class III",
            "body": [
              {
                "text": "**ใช้กับสารที่อันตรายอย่างยิ่ง ซึ่งพบในห้องปฏิบัติการ BSL-4**"
              }
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่ายสุดคือ Class I ไม่ป้องกัน sample ส่วน Class II ป้องกันครบสามอย่างและเป็นตัวที่ใช้บ่อยที่สุด แล้ว Class III ผูกกับ BSL-4 ซึ่งตรงกับหน้า BSL-4 ที่บอกว่า cabinet laboratory ต้องทำงานใน class III BSC",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "สิ่งที่ชื่อเด็คสัญญาไว้แต่ตัวสไลด์ไม่ได้พูดถึง",
        "source": "Biosafety p.1",
        "body": [
          {
            "text": "หน้าปกตั้งชื่อว่า **Biosafety, Biosecurity and Good laboratory practice** แต่ในข้อความของสไลด์ทั้งเด็คมีแต่ส่วน Biosafety (biohazards, BSL 1-4, BSC)"
          },
          {
            "bullets": [
              "**Biosecurity** สไลด์ไม่ได้บอกนิยามหรือรายละเอียด",
              "**Good laboratory practice (GLP)** สไลด์ไม่ได้บอกนิยามหรือรายละเอียด"
            ]
          },
          {
            "callout": "สองหัวข้อนี้อาจอยู่ในสไลด์รูปหน้า 8 ถึง 11 หรืออาจารย์อธิบายปากเปล่า ถ้าจะสอบควรถามอาจารย์หรือดูสไลด์ต้นฉบับ อย่าเอานิยามจากที่อื่นมาใส่แทนโดยไม่เช็ค",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "microbio-1--epidemiology-of-viral-infection": {
    "topic": "microbio-1--epidemiology-of-viral-infection",
    "title": "Epidemiology of viral infection",
    "icon": "🧬",
    "lecturer": "Navapon Techakriengkrai",
    "summary": "เดคนี้ (29 สไลด์) วางกรอบ epidemiology ของ viral infection เป็น 3 ส่วนใหญ่ คือ (1) นิยาม epidemiology และการแยก infection ออกจาก disease (2) ปัจจัยที่กำหนดการเกิดโรค 3 กลุ่ม ได้แก่ environmental, viral และ host factors พร้อม route of transmission และ (3) การวัดการเกิดโรค (occurrence measurement) ทั้ง type of study, frequency และ distribution ตามเวลาและ pattern มีสไลด์ที่เป็นรูปล้วนไม่มีข้อความอธิบาย 5 สไลด์ (p.8 แผนภาพ climate, p.15-16 host factors, p.22 แผนภาพ incidence-prevalence, p.27 แผนภาพ endemic-pandemic-epidemic) และสไลด์สุดท้ายเป็น Any Question ตัวเลขและสูตรที่ต้องท่องอยู่ที่ p.23-24 เป็นหลัก",
    "sections": [
      {
        "heading": "Epidemiology คืออะไร",
        "source": "epidemiology of viral infection p.2-3",
        "body": [
          {
            "text": "สไลด์แยกรากศัพท์ให้ดูก่อน คือ **epi \"upon\" + demos \"people\" + logos \"study\"**"
          },
          {
            "text": "นิยามที่เดคยกมา (John Murray Last) คือ **\"the study of the distribution and determinants of health-related states or events in specified populations, and the application of this study to the prevention and control of health problems\"** อ้างอิง Last, J.M. A dictionary of epidemiology, 4th ed. 2001"
          },
          {
            "sub": "ตารางแตกความหมายทีละคำ (p.3)",
            "body": [
              {
                "bullets": [
                  "study = scientific, data-driven",
                  "distribution = frequency, pattern",
                  "determinants = causes, risk factors",
                  "health-related status = disease, cause of death",
                  "specific population = those with identifiable characteristics",
                  "prevention and control = promote, protect, restore health"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Epidemiology of viral infection นิยามเฉพาะทาง",
        "source": "epidemiology of viral infection p.4",
        "body": [
          {
            "text": "เดคให้นิยามไว้ว่า **\"the circumstances under which both viral infection and disease occur in a population and the factors that influence their occurrence\"**"
          },
          {
            "text": "จุดที่ต้องสังเกตคือ นิยามพูดถึง **ทั้ง infection และ disease** ไม่ใช่แค่โรค ซึ่งเป็นการปูไปสไลด์ถัดไปที่แยกสองคำนี้ออกจากกัน"
          }
        ]
      },
      {
        "heading": "viral infection ≠ disease: สเปกตรัมระดับเซลล์ถึงระดับตัวสัตว์",
        "source": "epidemiology of viral infection p.5",
        "body": [
          {
            "text": "สไลด์แบ่งการมองออกเป็น 2 ระดับ คือ **cellular level** และ **host level**"
          },
          {
            "sub": "cellular level",
            "body": [
              {
                "bullets": [
                  "cytopathic effects ที่ระบุไว้คือ cell lysis, inclusion body และ syncytial formation"
                ]
              }
            ]
          },
          {
            "sub": "host level ไล่จากมีอาการลงไปหาไม่ติดเชื้อ",
            "body": [
              {
                "bullets": [
                  "visible → **clinical disease** (แยกย่อยเป็น severe disease และ mild disease)",
                  "invisible → **subclinical disease**",
                  "cell entry w/o multiplication → **asymptomatic infection**",
                  "exposed w/o cell entry → **exposed but not infected**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์วางลำดับนี้ไว้เป็นบันได แต่ไม่ได้ให้สัดส่วนหรือตัวเลขว่าแต่ละขั้นพบมากน้อยแค่ไหน สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "นิยาม infection กับ disease และปัจจัยที่เกี่ยวข้อง",
        "source": "epidemiology of viral infection p.6",
        "body": [
          {
            "bullets": [
              "**infection = introduction of virus and its multiplication** ระบุลักษณะไว้ว่า inapparent/subclinical",
              "**disease = recognisable pattern of responses to such infection** ระบุลักษณะไว้ว่า clinical manifestation"
            ]
          },
          {
            "text": "ครึ่งล่างของสไลด์ขึ้นหัวว่า \"the factors\" และแบ่งเป็น **3 กลุ่ม คือ environment, host และ virus** ซึ่งตรงกับสไลด์ p.7, p.9 และ p.14 ที่ตามมา"
          },
          {
            "sub": "รายการปัจจัยที่พิมพ์อยู่บนสไลด์",
            "body": [
              {
                "bullets": [
                  "exposure",
                  "behaviour",
                  "susceptibility",
                  "which virus?",
                  "age/gender/breed",
                  "health status",
                  "immunogenetic"
                ]
              },
              {
                "text": "สไลด์ไม่ได้เขียนเส้นโยงชัดว่ารายการไหนอยู่ใต้กลุ่มไหนในรูปแบบที่อ่านจากข้อความได้ตรง ๆ จึงไม่ควรจำแบบจับคู่ตายตัวจากสไลด์นี้ แต่ให้ไปดูสไลด์ที่แจกแจงแต่ละกลุ่มโดยเฉพาะ (p.7 environmental, p.9 และ p.11 viral, p.14 host)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Environmental factors",
        "source": "epidemiology of viral infection p.7-8",
        "body": [
          {
            "text": "สไลด์กรอบไว้ว่าเป็นปัจจัยด้าน **availability ที่ส่งผลต่อ virus ตัวใดก็ได้ (that could affect any given virus)**"
          },
          {
            "bullets": [
              "**population size** ยกตัวอย่าง city vs. provincial",
              "**climate** โดย hot climate ทำให้ drink more water จึงเชื่อมกับ water-borne disease ส่วน cold climate ทำให้อยู่ indoor จึงเชื่อมกับ air-borne และ vector-borne",
              "สไลด์ปิดท้ายด้วย etc. คือไม่ได้ไล่ครบทุกปัจจัย"
            ]
          },
          {
            "callout": "p.8 เป็นสไลด์รูปล้วน (ภาพจาก Climate Reanalyzer, Climate Change Institute, University of Maine) ไม่มีข้อความอธิบายบนสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Viral factors ตอนที่ 1: infectivity",
        "source": "epidemiology of viral infection p.9",
        "body": [
          {
            "text": "สไลด์นิยาม viral factors ว่าเป็น **quantifiable properties of virus** คือคุณสมบัติที่วัดเป็นตัวเลขได้"
          },
          {
            "sub": "infectivity แตกเป็น 3 ความสามารถ",
            "body": [
              {
                "bullets": [
                  "**being infectious** = ability to infect target cell โดยวัดจาก minimum no. of infectious unit คือจำนวน virion",
                  "**being contagious** = ability to spread from one person to another",
                  "**being zoonotic** = ability to spread from animal to human ส่วน **reverse-zoonotic** คือ spread from human to animal"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "R0 (R naught)",
        "source": "epidemiology of viral infection p.10",
        "body": [
          {
            "text": "สไลด์ยกลำดับความ contagious ไว้ว่า **Measles is more contagious than SARS > COVID-19 > seasonal influenza** อ้างอิง Department of Health, Republic of Ireland"
          },
          {
            "callout": "สไลด์ใช้คำว่า R0 เป็นหัวเรื่องและแสดงเป็นการเปรียบเทียบระหว่างเชื้อ แต่ไม่ได้เขียนนิยามของ R0 เป็นข้อความ และไม่ได้ให้ค่าตัวเลข R0 ของแต่ละเชื้อไว้ในข้อความ สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Viral factors ตอนที่ 2: pathogenicity, virulence, adaptability",
        "source": "epidemiology of viral infection p.11-12",
        "body": [
          {
            "bullets": [
              "**pathogenicity = ability to produce clinically significant disease** วัดด้วย **morbidity rate = symptomatic / total number of infection**",
              "**virulence** วัดด้วย **mortality rate = fatal infection / total number of infection**",
              "**adaptability** สไลด์ระบุตัวอย่างเดียวคือ **immune evasion**"
            ]
          },
          {
            "text": "p.12 ยกลำดับ virulence ไว้ว่า **MERS is more fatal (virulence) than SARS > COVID-19 > seasonal influenza**"
          },
          {
            "callout": "คู่ที่ออกสอบง่ายคือลำดับสองแถวนี้ไม่เหมือนกัน แถว contagious (p.10) ขึ้นต้นด้วย Measles ส่วนแถว fatal (p.12) ขึ้นต้นด้วย MERS",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Route of transmission",
        "source": "epidemiology of viral infection p.13",
        "body": [
          {
            "sub": "horizontal transmission",
            "body": [
              {
                "bullets": [
                  "respiratory",
                  "enteric",
                  "direct cutaneous",
                  "sexual",
                  "blood-borne",
                  "vector-borne",
                  "urinary",
                  "nosocomial",
                  "fomite",
                  "environmental"
                ]
              }
            ]
          },
          {
            "sub": "vertical transmission",
            "body": [
              {
                "bullets": [
                  "**intrauterine / intrapartum**",
                  "intrachromosomal",
                  "extrachromosomal"
                ]
              }
            ]
          },
          {
            "text": "สไลด์เป็นรายการชื่อ route ล้วน ไม่ได้ยกตัวอย่างไวรัสประจำแต่ละ route ไว้ สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Host factors",
        "source": "epidemiology of viral infection p.14-16",
        "body": [
          {
            "text": "สไลด์กำกับหัวข้อไว้ด้วยคำ 4 คำที่บอกว่า host factors ไปกำหนดอะไร คือ **susceptibility - resistance - severity - duration**"
          },
          {
            "bullets": [
              "age at onset of infection",
              "gender",
              "breed โดยระบุว่าเป็น geographic/behavioral influence",
              "genetics และ immunogenetic",
              "**level of pre-existing immunity** ซึ่งสไลด์ระบุที่มา 2 ทางคือ maternal และ vaccination",
              "behaviour/lifestyle",
              "co-infections",
              "pre-existing non-infectious condition",
              "nutritional status",
              "psychological factors",
              "และปิดท้ายด้วย etc."
            ]
          },
          {
            "callout": "p.15 และ p.16 ขึ้นหัวว่า host factors เหมือนกันแต่เป็นสไลด์รูปล้วน ไม่มีข้อความบนสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Interactions between factors",
        "source": "epidemiology of viral infection p.17",
        "body": [
          {
            "text": "สไลด์นี้ผูก 3 ปัจจัยเข้าด้วยกันด้วยศัพท์ประจำแต่ละฝั่ง"
          },
          {
            "bullets": [
              "environmental → **\"inoculum\" = amount of transmitted virus**",
              "viral → **\"infectivity\" = minimal size of inoculum required to initiate infection**",
              "host → **\"outcome\" = immune responses to viral infection**"
            ]
          }
        ]
      },
      {
        "heading": "Occurrence measurement ภาพรวม 3 หัวข้อ",
        "source": "epidemiology of viral infection p.18",
        "body": [
          {
            "text": "สไลด์นี้เป็นสารบัญของครึ่งหลังของเดค ควรจำโครง 3 ชั้นนี้ไว้"
          },
          {
            "bullets": [
              "**type of study** → prospective vs. retrospective",
              "**frequency** → incidence vs. prevalence และ morbidity, mortality, case fatality",
              "**distribution** → time (seasonal-secular) และ pattern (sporadic-endemic-epidemic-pandemic)"
            ]
          }
        ]
      },
      {
        "heading": "Type of study: prospective vs. retrospective",
        "source": "epidemiology of viral infection p.19-20",
        "body": [
          {
            "sub": "prospective",
            "body": [
              {
                "bullets": [
                  "คำที่ใช้คู่กันคือ **cohort, longitudinal, going forward**",
                  "วิธีทำคือ divide the population into 2 group and compare",
                  "สิ่งที่ได้คือ **effect of infection**"
                ]
              }
            ]
          },
          {
            "sub": "retrospective",
            "body": [
              {
                "bullets": [
                  "คำที่ใช้คู่กันคือ **case-controlled, outcome-oriented**",
                  "วิธีทำคือเทียบ populations with (case) vs. without infections (control)",
                  "สิ่งที่ได้คือ **risk factors determination**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างงานวิจัยที่สไลด์ยกมา (p.20)",
            "body": [
              {
                "bullets": [
                  "prospective study: FIV infection and survival เปรียบเทียบ single (group 1) vs. multiple (group 2) อ้างอิง Beczkowski et al., 2015",
                  "retrospective study: gender and FIV infection เปรียบเทียบ positive (case) vs. negative (control) อ้างอิง Techakriengkrai et al., 2016"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Frequency: incidence vs. prevalence",
        "source": "epidemiology of viral infection p.21-22",
        "body": [
          {
            "text": "สไลด์กรอบทั้งสองคำไว้ว่าเป็นการ determining the number of infected individuals"
          },
          {
            "bullets": [
              "**incidence = number of new cases within a population in a specific period** เขียนเป็นหน่วยได้ 2 แบบคือ new cases/location/time และ new cases/population/time",
              "**prevalence = number of infected individuals at one moment in time**"
            ]
          },
          {
            "callout": "จุดต่างที่ออกสอบคือ incidence ต้องมี period หรือช่วงเวลากำกับ ส่วน prevalence เป็นภาพ ณ ขณะเดียว (one moment in time)",
            "kind": "tip"
          },
          {
            "callout": "p.22 เป็นแผนภาพล้วน มีเพียงป้ายกำกับ population, new cases, incidence, prevalence ไม่มีข้อความอธิบายเพิ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Morbidity, mortality และ case fatality ratio",
        "source": "epidemiology of viral infection p.23",
        "body": [
          {
            "bullets": [
              "**morbidity = no. of infected individuals who became ill**",
              "**mortality = no. of infected individuals who die**",
              "**case fatality ratio = no. of individuals with illness who die**"
            ]
          },
          {
            "callout": "สไลด์เขียนวงเล็บกำกับ case fatality ratio ไว้ว่า (attack rate) ตามที่พิมพ์บนสไลด์ ควรจำตามคำที่อาจารย์เขียนไว้ตอนตอบข้อสอบ",
            "kind": "warn"
          },
          {
            "callout": "ตัวหารต่างกันคือหัวใจของสามคำนี้ morbidity และ mortality หารด้วยจำนวน infection ส่วน case fatality ratio หารด้วยจำนวนคนที่ป่วย (illness)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตัวอย่างการคำนวณจากแผนภาพ",
        "source": "epidemiology of viral infection p.24",
        "body": [
          {
            "text": "สไลด์ให้ป้ายกำกับสูตรไว้เป็น incidence (infection/population), morbidity (illness/infection), mortality (death/infection) และ case fatality ratio (death/illness)"
          },
          {
            "sub": "ตัวเลขที่พิมพ์อยู่บนสไลด์",
            "body": [
              {
                "bullets": [
                  "population = 100,000",
                  "**incidence = 20,000/100,000 = 20%**",
                  "**morbidity = 10,000/20,000 = 50%**",
                  "**mortality = 4,000/20,000 = 20%**",
                  "**case fatality ratio = 1,000/10,000 = 10%**"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขจำนวนตายที่ใช้ในสองบรรทัดไม่เท่ากัน คือ mortality ใช้ 4,000 ส่วน case fatality ratio ใช้ 1,000 และบนแผนภาพยังมีเลข 3,000 กับ 20,000 กำกับอยู่ด้วย สไลด์ไม่ได้อธิบายว่าตัวเลขเหล่านี้แบ่งกันอย่างไร ตอนอ่านให้จำสูตร (ตัวเศษ/ตัวส่วน) เป็นหลัก อย่าจำตัวเลขชุดนี้แบบผูกกันเอง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Distribution ตามเวลา: seasonal vs. secular",
        "source": "epidemiology of viral infection p.25",
        "body": [
          {
            "bullets": [
              "**seasonal trend = short term fluctuation / periodic**",
              "**secular trend = no fluctuation over long period**"
            ]
          },
          {
            "text": "กราฟทั้งสองรูปมีแกนตั้งเป็น no. of cases อ้างอิง www.cdc.gov สไลด์ไม่ได้ยกตัวอย่างโรคประกอบกราฟไว้เป็นข้อความ"
          }
        ]
      },
      {
        "heading": "Pattern of occurrence: sporadic, endemic, epidemic, pandemic",
        "source": "epidemiology of viral infection p.26-28",
        "body": [
          {
            "bullets": [
              "**sporadic** = occasional cases at irregular interval",
              "**endemic (enzootic)** = continuous occurrence at expected frequency over a certain period of time and in a certain location",
              "**epidemic (epizootic) / outbreak** = occurrence with a frequency clearly in excess (temporarily prevalent) of normal expectancy",
              "**pandemic (panzootic)** = epidemic involves several countries/continents"
            ]
          },
          {
            "callout": "ให้จำคำคู่ฝั่งสัตว์ด้วย เพราะสไลด์วงเล็บไว้ทุกตัว คือ endemic-enzootic, epidemic-epizootic และ pandemic-panzootic",
            "kind": "tip"
          },
          {
            "text": "p.28 สรุปคู่เทียบสั้น ๆ ว่า **endemic คือ constant number of cases ส่วน epidemic คือ increased number of cases**"
          },
          {
            "callout": "p.27 เป็นสไลด์รูปล้วน มีเพียงคำกำกับสามคำคือ endemic, pandemic, epidemic ไม่มีข้อความอธิบายบนสไลด์",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "microbio-1--exercise-2-sample-collection-bacterial-isolation-primary-ide": {
    "topic": "microbio-1--exercise-2-sample-collection-bacterial-isolation-primary-ide",
    "title": "Exercise 2 การเก็บตัวอย่าง การเพาะแยกเชื้อ และ primary identification",
    "icon": "🦠",
    "lecturer": "Pattrarat Chanchaithong",
    "summary": "สไลด์ปฏิบัติการ 37 หน้า แบ่งเป็น 3 ท่อนใหญ่ คือ (1) หลักการเก็บตัวอย่างส่งตรวจทางแบคทีเรียวิทยา ไล่ทีละระบบตั้งแต่ผิวหนัง ตา หู ทางเดินหายใจ ทางเดินอาหาร ของเหลวในช่องลำตัว น้ำนม ปัสสาวะ เลือด และตัวอย่างสำหรับ anaerobe (2) อาหารเลี้ยงเชื้อกับเทคนิค four-way cross streak เพื่อให้ได้ pure culture และ (3) primary identification 5 อย่างที่จะทำในคาบนี้ หลายหน้าเป็นรูปอุปกรณ์ รูป colony และรูปผลการทดสอบโดยไม่มีข้อความกำกับ โดยเฉพาะหน้าอ่านผล catalase oxidase motility และ O F test ที่สไลด์เขียนแค่คำว่า Interpretation แล้วให้ดูรูปเอา ส่วน 4 หน้าสุดท้ายเป็นใบสั่งงานของคาบปฏิบัติการวันนั้น",
    "sections": [
      {
        "heading": "วัตถุประสงค์ของปฏิบัติการ",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.1-2",
        "body": [
          {
            "text": "ปฏิบัติการนี้ตั้งวัตถุประสงค์ไว้ 3 ข้อ"
          },
          {
            "bullets": [
              "ศึกษาวิธี กระบวนการ และอุปกรณ์ในการเก็บตัวอย่างจากสัตว์ป่วย สำหรับการตรวจวินิจฉัยทางแบคทีเรียวิทยาด้วยการเพาะเชื้อ",
              "ฝึกปฏิบัติการเพาะแยกเชื้อแบคทีเรียจากตัวอย่างส่งตรวจทางคลินิก",
              "ฝึกปฏิบัติการระบุและจำแนกชนิดแบคทีเรียขั้นแรก"
            ]
          }
        ]
      },
      {
        "heading": "Microbiological diagnosis ใช้กับตัวอย่างแบบไหน",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.3",
        "body": [
          {
            "text": "สไลด์วางกรอบไว้ว่างานตรวจวินิจฉัยทางจุลชีววิทยามี 2 เป้าหมาย คือ **หาเชื้อแบคทีเรียก่อโรคใน clinical samples หรือตัวอย่างจาก necropsy** และ **หาการปนเปื้อนของแบคทีเรียในอาหาร สิ่งแวดล้อม หรือ inanimate samples**"
          },
          {
            "bullets": [
              "Lesions from diseased animals",
              "Necropsy",
              "Contaminated food"
            ]
          }
        ]
      },
      {
        "heading": "ลำดับงานตั้งแต่คลินิกจนถึงห้องแล็บ",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.4",
        "body": [
          {
            "text": "สไลด์วางเส้นทางไว้ว่า history และ physical examination นำไปสู่การตรวจในคลินิก แล้วจึง sample collection และ sample submission เข้าห้องแล็บ โดยมี **communication ระหว่างคลินิกกับห้องแล็บคั่นอยู่ตลอดเส้นทาง**"
          },
          {
            "sub": "On clinic laboratory diagnosis",
            "body": [
              {
                "bullets": [
                  "Microscopic examination",
                  "Staining",
                  "Urinalysis",
                  "Test kits"
                ]
              }
            ]
          },
          {
            "sub": "Laboratory diagnosis",
            "body": [
              {
                "bullets": [
                  "Bacterial culture",
                  "Isolation",
                  "Identification",
                  "Antimicrobial susceptibility testing"
                ]
              }
            ]
          },
          {
            "text": "ปลายทางคือ report and interpretation ซึ่งนำไปสู่ therapeutic plan quarantine และ management"
          }
        ]
      },
      {
        "heading": "หลักการเก็บตัวอย่าง เก็บเมื่อไหร่ และเก็บตรงไหนของรอยโรค",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.5",
        "body": [
          {
            "bullets": [
              "เก็บให้เร็วที่สุดนับจาก onset of clinical signs",
              "เก็บจาก active lesion คือตำแหน่งที่มี active microbial replication",
              "**เก็บที่ edge of lesion พร้อมเนื้อเยื่อที่ดูปกติด้วยตาเปล่าติดมาบางส่วน**",
              "เก็บแบบ aseptically",
              "avoid cross contamination",
              "avoid human infection",
              "แจ้งห้องแล็บด้วยถ้าสัตว์ได้รับการรักษาไปแล้ว"
            ]
          },
          {
            "sub": "ปริมาณตัวอย่าง",
            "body": [
              {
                "bullets": [
                  "exudate เก็บหลาย mL คือของเหลว เช่น น้ำในช่องอก ช่องท้อง",
                  "tissue biopsy ขนาด 2 cm3"
                ]
              }
            ]
          },
          {
            "sub": "กรณีสัตว์ตาย",
            "body": [
              {
                "text": "เก็บก่อนเกิด autolytic changes สไลด์ระบุว่าถ้าเกิน 6 ชั่วโมงตัวอย่างจะ **heavily contaminated ด้วย GI contaminants**"
              }
            ]
          }
        ]
      },
      {
        "heading": "ลำดับการเก็บตัวอย่างจาก necropsy",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.6",
        "body": [
          {
            "text": "สไลด์เรียงลำดับการเก็บจากตำแหน่งที่สะอาดที่สุดไปหาสกปรกที่สุด **เก็บที่ปกติปลอดเชื้อหรือปนเปื้อนน้อยที่สุดก่อนเสมอ**"
          },
          {
            "bullets": [
              "ลำดับ 1 ตำแหน่งที่ปกติ sterile หรือปนเปื้อนน้อย ได้แก่ heart spleen brain",
              "ลำดับ 2 โอกาสปนเปื้อนต่ำถึงปานกลาง ได้แก่ lung liver lymph nodes kidneys uterus",
              "ลำดับ 3 ตำแหน่งที่มีจำนวนเชื้อสูง"
            ]
          },
          {
            "callout": "ลำดับที่ 3 สไลด์เขียนไว้แค่ว่า high number of organisms ไม่ได้บอกว่าเป็นอวัยวะใดบ้าง",
            "kind": "flag"
          },
          {
            "text": "หัวสไลด์ยังแบ่งกลุ่มตัวอย่างเป็น tissue from outside the body cavities tissue from thorax และ tissue from abdomen"
          }
        ]
      },
      {
        "heading": "แยกตำแหน่งเก็บตัวอย่างตามการมี normal flora และการแปลผล",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.7",
        "body": [
          {
            "text": "หน้านี้เป็นหัวใจของการแปลผลเพาะเชื้อ เพราะ **เชื้อที่ขึ้นจะหมายความว่าอะไร ขึ้นกับว่าเก็บมาจากตำแหน่งกลุ่มไหน**"
          },
          {
            "sub": "Sterile sites ตำแหน่งที่ในภาวะปกติไม่มีเชื้อประจำถิ่น",
            "body": [
              {
                "bullets": [
                  "exudate จาก pleural cavity abdominal cavity subcutaneous tissue",
                  "blood",
                  "prostate gland",
                  "urinary bladder"
                ]
              },
              {
                "text": "แปลผลเป็น **infection**"
              }
            ]
          },
          {
            "sub": "Colonized areas ตำแหน่งที่มีการอาศัยอยู่ของเชื้อประจำถิ่นในภาวะปกติ",
            "body": [
              {
                "bullets": [
                  "nasal discharge",
                  "vaginal discharge",
                  "conjunctiva",
                  "intestinal mucosa"
                ]
              },
              {
                "text": "แปลผลเป็น opportunistic infection หรือ contamination ซึ่ง **ต้องประเมินร่วมกับรอยโรคและผลการตอบสนองต่อการรักษา**"
              }
            ]
          },
          {
            "sub": "Contaminated area ตำแหน่งที่มีการปนเปื้อนเชื้อจากสิ่งแวดล้อมได้ง่าย",
            "body": [
              {
                "bullets": [
                  "open wound"
                ]
              },
              {
                "text": "แปลผลเป็น opportunistic infection หรือ contamination ต้องประเมินร่วมกับรอยโรคและผลการรักษาเช่นเดียวกัน"
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาชนะและ transport medium",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.8",
        "body": [
          {
            "sub": "Swab กับ bacterial transport medium",
            "body": [
              {
                "bullets": [
                  "หน้าที่คือ prevent bacterial death and desiccation",
                  "ใช้กับรอยโรคขนาดเล็กหรือช่องทางที่แคบ",
                  "ตัวอย่างที่ใช้ nasal swab pharyngeal swab cloacal หรือ rectal swab ear swab และ wound"
                ]
              },
              {
                "callout": "ห้ามใช้ virus transport medium เก็บตัวอย่างสำหรับเพาะแบคทีเรีย เพราะมีการเติม antibiotics ไว้",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Sterile screw-capped containers",
            "body": [
              {
                "bullets": [
                  "เก็บของเหลว และเก็บตัวอย่างปริมาณมาก",
                  "เก็บ tissue biopsy โดย **ห้ามใส่ formalin**",
                  "ต้อง leak proof"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ผิวหนัง ตา และหู",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.9-10",
        "body": [
          {
            "sub": "Integumentary system ผิวหนัง",
            "body": [
              {
                "bullets": [
                  "Intact abscess หรือ pustule ให้ disinfect ด้วย 70% alcohol แล้วรอให้แห้ง จากนั้นทำ skin incision หรือ needle aspiration",
                  "Ulcer ใช้วิธี swab ที่ผิว",
                  "Hair สำหรับ dermatophyte culture เก็บโดยการตัดหรือถอนขน"
                ]
              }
            ]
          },
          {
            "sub": "Sensory organs ตาและหู",
            "body": [
              {
                "bullets": [
                  "corneal scraping สำหรับ Gram's stain",
                  "conjunctival swab",
                  "corneal swab"
                ]
              },
              {
                "callout": "หัวสไลด์เขียนว่า eyes and ears แต่เนื้อหาที่เป็นข้อความมีเฉพาะของตา สไลด์ไม่ได้บอกวิธีเก็บตัวอย่างจากหูไว้ในหน้านี้ ตัว ear swab ไปปรากฏในหน้า containers and samples แทน",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "ระบบทางเดินหายใจ",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.11",
        "body": [
          {
            "sub": "Upper respiratory tract",
            "body": [
              {
                "bullets": [
                  "มี normal flora อยู่แล้ว",
                  "เป็น **carriage site ของเชื้อดื้อยา**",
                  "มีการปนเปื้อนของ saprophytes เช่น fungal spores",
                  "Tonsils สไลด์ยกตัวอย่างเชื้อไว้คือ Streptococcus suis"
                ]
              }
            ]
          },
          {
            "sub": "Lower respiratory tract",
            "body": [
              {
                "bullets": [
                  "วิธีเก็บคือ bronchoalveolar lavage BAL และ endotracheal aspiration",
                  "อุปกรณ์ sterile endotracheal tube sterile red rubber polypropylene tubes sterile 0.9% NSS และ sterile tube หรือ vial",
                  "ตัวอย่างที่ได้ใช้ทำ cytology และ culture เก็บโดย refrigeration"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ระบบทางเดินอาหาร ลำไส้จาก necropsy และอุจจาระ",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.12-14",
        "body": [
          {
            "sub": "Necropsy ligated intestinal loop",
            "body": [
              {
                "bullets": [
                  "ผูกลำไส้เป็น loop ยาว 5-10 cm",
                  "ตำแหน่งที่เก็บ เช่น duodenum colon เป็นต้น ขึ้นกับเชื้อที่สงสัย",
                  "**เชื้อก่อโรคหลายชนิดเกาะอยู่ที่ mucosa ไม่ได้อยู่ใน intestinal contents**"
                ]
              }
            ]
          },
          {
            "sub": "Feces",
            "body": [
              {
                "text": "สไลด์ระบุว่าการเก็บอุจจาระใช้สำหรับ specific detection of particular bacterial species"
              },
              {
                "bullets": [
                  "Freshly voided เก็บจาก rectum 5-10 g ใส่ sterile screw-capped container",
                  "Rectal หรือ cloacal swab ใช้ในสัตว์แรกเกิดและสัตว์เล็ก",
                  "ข้อเสียของ swab คือ **ได้จำนวนเชื้อไม่พอ** และ **ไม่ปกป้องเชื้อกลุ่ม anaerobe หรือ microaerophilic**"
                ]
              }
            ]
          },
          {
            "sub": "Fecal smear ตรวจโดยตรง",
            "body": [
              {
                "bullets": [
                  "protozoa",
                  "egg",
                  "spirochete"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ของเหลวในช่องลำตัวและน้ำนม",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.15-16",
        "body": [
          {
            "sub": "Fluid in body cavities เช่น pleural cavity peritoneal cavity",
            "body": [
              {
                "bullets": [
                  "วิธีเก็บ thoracocentesis และ abdominocentesis",
                  "อุปกรณ์ butterfly catheter หรือ intravenous catheter",
                  "ภาชนะ sterile screw-capped tube"
                ]
              }
            ]
          },
          {
            "sub": "Milk จากโค",
            "body": [
              {
                "bullets": [
                  "ทำความสะอาดด้วยน้ำ",
                  "ทำให้แห้ง",
                  "เช็ด teats ด้วย 70% alcohol",
                  "**ควรหลีกเลี่ยง antiseptics**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัสสาวะสำหรับ urine quantitative culture",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.17-18",
        "body": [
          {
            "text": "สไลด์เรียงวิธีเก็บปัสสาวะ 3 วิธีตามระดับการปนเปื้อนจากน้อยไปมาก คือ **abdominal cystocentesis ปนเปื้อนน้อยที่สุด ตามด้วย urinary catheterization และ voiding ปนเปื้อนมากที่สุด** โดยแยกหัวคอลัมน์เป็น companion animals กับ large animals"
          },
          {
            "sub": "การเก็บและการส่งตรวจ",
            "body": [
              {
                "bullets": [
                  "**ห้ามใช้ swab และ transport medium กับปัสสาวะ**",
                  "ปัสสาวะเป็น good growth medium อยู่ในตัวเอง",
                  "แช่เย็นภายใน 1 ชั่วโมง",
                  "ห้องแล็บต้อง process ภายใน 12 ชั่วโมง",
                  "ขนส่งบนน้ำแข็ง"
                ]
              }
            ]
          },
          {
            "sub": "ตารางเกณฑ์ quantitative culture หน่วย colony forming unit ต่อ mL",
            "body": [
              {
                "text": "สไลด์ทำเป็นตาราง 3 แถวตามวิธีเก็บ คูณ 4 คอลัมน์คือ Dog male Dog female Cat male Cat female ค่าที่ปรากฏในสไลด์คือ"
              },
              {
                "bullets": [
                  "Cystocentesis มากกว่า 10 ยกกำลัง 2 ทั้งสี่ช่อง",
                  "Catheterization มากกว่า 10 ยกกำลัง 3 และ 10 ยกกำลัง 5 ในฝั่งสุนัข และ 10 ยกกำลัง 3 ทั้งสองช่องในฝั่งแมว",
                  "Voiding มากกว่า 10 ยกกำลัง 5 ทั้งสองช่องในฝั่งสุนัข และ 10 ยกกำลัง 4 ทั้งสองช่องในฝั่งแมว"
                ]
              },
              {
                "callout": "ตัวเลขชุดนี้อ่านจาก text layer ของสไลด์ซึ่งทำให้ตำแหน่งช่องในตารางคลาดเคลื่อนได้ ให้เทียบกับตารางในสไลด์จริงหน้า 18 ก่อนท่องจำ ประเด็นที่ชัดเจนแน่นอนคือ cystocentesis ใช้เกณฑ์ต่ำที่สุด และ voiding ใช้เกณฑ์สูงที่สุด",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "เลือดสำหรับ hemoculture",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.19",
        "body": [
          {
            "bullets": [
              "Bacteremia เกิดแบบ intermittent จึงต้องเก็บ **มากกว่า 1 ตัวอย่างภายในช่วง 24 ชั่วโมง**",
              "ใช้ strictly aseptic technique",
              "ใช้ double needle technique",
              "เก็บเลือดจาก vein"
            ]
          },
          {
            "sub": "Blood culture bottle",
            "body": [
              {
                "bullets": [
                  "อุ่นที่อุณหภูมิห้องก่อนใช้",
                  "**ห้ามเก็บในตู้เย็นหลังจากใส่เลือดลงขวดแล้ว**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างสำหรับ anaerobic bacterial culture",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.20",
        "body": [
          {
            "text": "**Anaerobes ทนการสัมผัสออกซิเจนในอากาศได้ไม่เกิน 20 นาที** ตัวอย่างจึงต้องถึงห้องแล็บให้เร็วที่สุด"
          },
          {
            "bullets": [
              "sterile closed container",
              "blocked tissue",
              "anaerobic transport medium",
              "anaerobic jar",
              "**การ aspiration ดีกว่าการใช้ swab**"
            ]
          }
        ]
      },
      {
        "heading": "Sample submission การส่งตัวอย่าง",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.21",
        "body": [
          {
            "bullets": [
              "ต้องมี good communication ระหว่างห้องแล็บกับ clinicians",
              "ตัวอย่างอยู่ใน container หรือ transport medium และมี clear labelling",
              "ส่งพร้อม submission form ที่มีรายละเอียดเฉพาะ",
              "กำหนดเวลาส่งเป็นช่วงเวลาของแต่ละวันหรือวันที่กำหนดไว้"
            ]
          },
          {
            "sub": "รายละเอียดที่ต้องระบุใน submission form",
            "body": [
              {
                "bullets": [
                  "Signalment",
                  "Clinical history",
                  "Differential diagnosis",
                  "Vaccine",
                  "Therapy"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ชนิดของ artificial culture media แบ่งตามความเข้มข้นของ agar",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.22",
        "body": [
          {
            "bullets": [
              "Solid media ใช้ agar 1-5% w/v",
              "Semisolid media ใช้ agar 0.2-0.5% w/v",
              "Liquid media มี agar 0% เรียกว่า broth"
            ]
          },
          {
            "text": "รูปแบบภาชนะที่สไลด์แสดงคือ agar plate agar tube และ agar slant"
          }
        ]
      },
      {
        "heading": "Blood agar และ MacConkey agar",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.23-24",
        "body": [
          {
            "sub": "องค์ประกอบทั่วไปของ solid media",
            "body": [
              {
                "bullets": [
                  "agar เป็น solidifying agent 1-5% w/v",
                  "protein sources",
                  "carbohydrate sources",
                  "NaCl",
                  "water",
                  "supplement"
                ]
              }
            ]
          },
          {
            "sub": "Blood agar",
            "body": [
              {
                "text": "คือ **nutrient agar ที่เติม sheep blood 5%**"
              }
            ]
          },
          {
            "sub": "MacConkey agar",
            "body": [
              {
                "text": "ส่วนประกอบที่สไลด์ระบุคือ peptone proteose peptone lactose bile salt neutral red NaCl และ water"
              },
              {
                "bullets": [
                  "เป็น indicator medium โดย neutral red ทำให้ **โคโลนีสีชมพูเท่ากับ lactose fermenter**",
                  "เป็น low selective medium โดย **bile salt ยับยั้งแบคทีเรีย Gram-positive ส่วนใหญ่**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Primary culture การ streak และการทำ pure culture",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.25-28",
        "body": [
          {
            "sub": "Primary plate",
            "body": [
              {
                "text": "การ inoculate ตัวอย่างลงบน blood agar และ MacConkey agar เรียกว่า primary plate หรือ primary culture"
              },
              {
                "text": "**ประชากรเชื้อที่ขึ้นเป็นกลุ่มใหญ่ที่สุดคือกลุ่มที่ควรสงสัยว่าเป็น primary pathogen**"
              }
            ]
          },
          {
            "sub": "Subculture",
            "body": [
              {
                "bullets": [
                  "เขี่ย single colony ขึ้นมา",
                  "streak ลงบนจานใหม่เพื่อให้ได้ pure culture",
                  "ใช้เทคนิค four-way cross streak"
                ]
              }
            ]
          },
          {
            "sub": "Colony morphology",
            "body": [
              {
                "text": "**หนึ่ง colony มาจากแบคทีเรียหนึ่งเซลล์**"
              },
              {
                "text": "สไลด์แสดงรูปลักษณะ hemolysis 3 แบบคือ beta hemolysis double hemolysis และ alpha hemolysis เป็นรูปประกอบ โดยไม่ได้เขียนคำอธิบายลักษณะของแต่ละแบบเป็นข้อความ"
              }
            ]
          }
        ]
      },
      {
        "heading": "Primary identification กับ secondary identification ต่างกันอย่างไร",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.29",
        "body": [
          {
            "sub": "Primary identification ทำในคาบนี้",
            "body": [
              {
                "bullets": [
                  "Gram's staining",
                  "catalase",
                  "oxidase",
                  "motility",
                  "oxidation-fermentation test หรือ O F test"
                ]
              },
              {
                "text": "ระดับที่บอกได้คือ **Genus หรือ Family**"
              }
            ]
          },
          {
            "sub": "Secondary identification ทำสัปดาห์หน้า",
            "body": [
              {
                "bullets": [
                  "sugar assimilation test",
                  "amino acid decarboxylation test",
                  "urease test",
                  "citrate test",
                  "nitrate reduction test",
                  "และอื่น ๆ"
                ]
              },
              {
                "text": "ระดับที่บอกได้คือ **Species หรือ Genus**"
              }
            ]
          }
        ]
      },
      {
        "heading": "วิธีทำการทดสอบ primary identification",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.30-33",
        "body": [
          {
            "sub": "Catalase test",
            "body": [
              {
                "text": "อุปกรณ์ที่สไลด์ระบุคือ glass slide เชื้อแบคทีเรีย และ **3% hydrogen peroxide**"
              }
            ]
          },
          {
            "sub": "Oxidase test",
            "body": [
              {
                "text": "ใช้ filter paper ที่ชุบ oxidase reagent สไลด์ระบุว่าเป็น **Wurster's reagent** และแสดงผลลบกับผลบวกเป็นรูป"
              }
            ]
          },
          {
            "sub": "Motility test",
            "body": [
              {
                "bullets": [
                  "ระวังเรื่อง aseptic technique",
                  "ใช้ needle แทงเชื้อลงใน motility test medium ซึ่งเป็น semisolid แบบ stab",
                  "**incubate ที่ 37 องศาเซลเซียส นาน 24 ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "sub": "Oxidation-fermentation test",
            "body": [
              {
                "bullets": [
                  "ระวังเรื่อง aseptic technique"
                ]
              },
              {
                "text": "การแปลผลที่สไลด์ระบุมี 3 แบบคือ Negative หรือ non utilizer, Oxidation และ Fermentation"
              }
            ]
          },
          {
            "callout": "ทั้ง 4 การทดสอบ สไลด์เขียนแค่คำว่า Interpretation แล้วแสดงรูปหลอดหรือแผ่นทดสอบ ไม่ได้เขียนเกณฑ์อ่านผลเป็นข้อความ ดังนั้นเกณฑ์อ่านผลต้องดูจากรูปในสไลด์จริงหรือจากที่อาจารย์สาธิตในคาบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "งานที่ต้องทำในคาบปฏิบัติการ",
        "source": "Exercise 2 Sample collection bacterial isolation primary identification p.34-37",
        "body": [
          {
            "sub": "1. Sample collection for bacterial culture",
            "body": [
              {
                "text": "เป็น demonstration อุปกรณ์เก็บตัวอย่างและภาชนะ"
              }
            ]
          },
          {
            "sub": "2. Bacterial culture and isolation",
            "body": [
              {
                "text": "สังเกต colony บน BA และ MAC ของ sample 2A แล้วทำ **4-way cross streak** จาก blood agar plate 2A ซึ่งเป็น primary culture โดยใช้ reusable metal loop"
              }
            ]
          },
          {
            "sub": "3. Primary identification",
            "body": [
              {
                "text": "ทำ Gram's staining จาก plate 2B 2C 2D และ 2E โดยดู 3 อย่างคือ **stained, shape และ arrangement**"
              },
              {
                "bullets": [
                  "Test catalase ด้วย 3% hydrogen peroxide",
                  "Test oxidase",
                  "Observe motile",
                  "Observe O F"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "microbio-1--fundamental-of-host-microbe-interaction": {
    "topic": "microbio-1--fundamental-of-host-microbe-interaction",
    "title": "Fundamental of Host Microbe Interaction",
    "icon": "🦠",
    "lecturer": "Channarong Rodkhum",
    "summary": "Deck ปูพื้นความสัมพันธ์ระหว่าง host กับ microbe แล้วไล่ตาม bacterial disease process ตั้งแต่ entry ไป adherence ไป colonization ไป invasion จนถึง clinical disease โดยลงรายละเอียดสองช่วงหลักคือ bacterial adherence (pre-adhesion physicochemical forces, adhesive interactions, adhesins, host receptors, tissue tropism, consequences) และ bacterial invasion (extracellular vs intracellular, สองกลยุทธ์ intracellular, ตัวอย่าง EPEC/EHEC intimin-Tir, consequences) ข้อควรรู้คือสไลด์ 44 หน้ามีหลายหน้าที่เป็นรูปหรือ diagram โดยไม่มีข้อความบรรยายเลย (p.4, p.11, p.19, p.26, p.28-30, p.32-33, p.39, p.41, p.44) และอีกหลายหน้ามีเพียงหัวข้อกำกับรูป (p.12, p.18, p.23, p.25, p.27, p.36, p.38, p.42) รูปส่วนใหญ่อ้างอิงจาก Wilson et al. โน้ตนี้จึงสรุปเฉพาะหน้าที่มีตัวหนังสือจริง และไม่เดาเนื้อหาจากรูป",
    "sections": [
      {
        "heading": "ขอบเขตของ lecture",
        "source": "Fundamental of Host Microbe interaction p.2",
        "body": [
          {
            "text": "สไลด์ Outline วางหัวข้อไว้ 4 เรื่อง"
          },
          {
            "bullets": [
              "Types of host-pathogen interactions",
              "Common themes in bacterial infection and virulence",
              "Bacterial adherence",
              "Bacterial invasion"
            ]
          }
        ]
      },
      {
        "heading": "Types of hosts-microbe interaction",
        "source": "Fundamental of Host Microbe interaction p.3",
        "body": [
          {
            "text": "สไลด์แบ่งความสัมพันธ์ระหว่าง host กับ microbe เป็น 3 แบบ โดยดูที่ว่าใครได้ประโยชน์และใครเสียหาย"
          },
          {
            "bullets": [
              "**Mutualism : ทั้ง host และ microbe ได้ประโยชน์ และไม่มีฝ่ายใดเสียหาย**",
              "**Commensalism : เฉพาะ microbe ได้ประโยชน์ และไม่มีฝ่ายใดเสียหาย**",
              "**Parasitism : เฉพาะ microbe ได้ประโยชน์ แต่ host เสียหาย**"
            ]
          }
        ]
      },
      {
        "heading": "Common themes in infection: endogenous กับ exogenous",
        "source": "Fundamental of Host Microbe interaction p.3",
        "body": [
          {
            "bullets": [
              "**Endogenous หรือ opportunistic infection คือโรคที่เกิดจาก normal microflora (commensal organisms) ของตัว host เอง**",
              "**Exogenous infection หรือ classical infection คือโรคที่เกิดจาก exogenous pathogen**"
            ]
          }
        ]
      },
      {
        "heading": "เมื่อไรที่ normal microflora กลายเป็นตัวก่อโรค",
        "source": "Fundamental of Host Microbe interaction p.5",
        "body": [
          {
            "text": "สไลด์ให้เงื่อนไขที่ทำให้ members of normal microflora ก่อโรคได้ 7 ข้อ"
          },
          {
            "bullets": [
              "Damage to the epithelium",
              "The presence of a foreign body",
              "**The transfer of bacteria to sites where they are not part of the normal microflora** คือย้ายไปอยู่ตำแหน่งที่ตัวมันไม่ใช่ normal microflora ของที่นั่น",
              "Suppression of the immune system by drugs or radiation",
              "Impairment of host defense due to infection by an exogenous pathogens",
              "Disruption of the normal microflora by antibiotics",
              "Unknown factors"
            ]
          }
        ]
      },
      {
        "heading": "Bacterial pathogen และ virulence",
        "source": "Fundamental of Host Microbe interaction p.6",
        "body": [
          {
            "text": "**Bacterial pathogens = bacteria ที่สามารถ induce disease ในตัวที่มี specific และ non-specific defense systems ครบสมบูรณ์ (intact)**"
          },
          {
            "text": "**Virulence = ความสามารถโดยเปรียบเทียบ (relative capacity) ของ microbe ในการทำให้เกิด damage ใน host**"
          },
          {
            "text": "สไลด์ย้ำว่า different strains ของ bacterial species เดียวกัน สามารถมี virulence ต่างกันได้มาก"
          }
        ]
      },
      {
        "heading": "Bacterial virulence factors คืออะไร",
        "source": "Fundamental of Host Microbe interaction p.7",
        "body": [
          {
            "bullets": [
              "**เป็น components ของ pathogen ที่จำเป็นต่อการทำ damage ต่อ host และรวมถึง components ที่จำเป็นต่อ survival และ persistence ของ bacteria ภายใน host ด้วย**",
              "ถือว่าเป็นสิ่งสำคัญใน disease process",
              "ความต่างของ virulence factor ทำให้ virulence ต่างกัน",
              "**Not present in non-pathogenic bacteria**"
            ]
          }
        ]
      },
      {
        "heading": "General virulence factors ของ pathogenic bacteria",
        "source": "Fundamental of Host Microbe interaction p.8",
        "body": [
          {
            "text": "สไลด์เป็นรูป bacterial cell ที่ชี้ป้ายองค์ประกอบที่เป็น virulence factor ทั่วไป ได้แก่"
          },
          {
            "bullets": [
              "Capsular polysaccharide",
              "LPS",
              "**Extracellular product ได้แก่ hemolysin, cytolysin, protease**",
              "Surface antigen",
              "Iron uptake system",
              "Pili (fimbria)",
              "Flagellum"
            ]
          }
        ]
      },
      {
        "heading": "ประโยชน์ของงานวิจัยด้าน bacterial virulence",
        "source": "Fundamental of Host Microbe interaction p.9",
        "body": [
          {
            "bullets": [
              "**Bacterial pathogenesis** เพื่อเข้าใจ disease process",
              "**Vaccine development** โดยการ attenuation ด้วยการลด virulence",
              "**Diagnostic purposes** เป็นเครื่องมือสำหรับ identification ของ virulence strains",
              "**Development of antimicrobial agents** โดยใช้ virulence genes เป็น drug targets"
            ]
          }
        ]
      },
      {
        "heading": "Bacterial disease process ทั้งเส้น",
        "source": "Fundamental of Host Microbe interaction p.10",
        "body": [
          {
            "text": "สไลด์วางลำดับของ disease process เป็นเส้นเดียวกัน จาก entry ไปจนถึง clinical disease"
          },
          {
            "sub": "1. Bacteria entry to host",
            "body": [
              {
                "bullets": [
                  "Eating",
                  "Breathing",
                  "Injected into host by an arthropod",
                  "Trauma of the epithelium"
                ]
              }
            ]
          },
          {
            "sub": "2. Adherence",
            "body": [
              {
                "text": "อาศัย **adhesins**"
              }
            ]
          },
          {
            "sub": "3. Colonization",
            "body": [
              {
                "text": "สไลด์ระบุเป็นขั้นตอนถัดจาก adherence แต่ไม่ได้ให้รายละเอียดเพิ่ม"
              }
            ]
          },
          {
            "sub": "4. Invasion",
            "body": [
              {
                "bullets": [
                  "**Extracellular invasion อาศัย exotoxins และ enzyme**",
                  "**Intracellular invasion อาศัย actin rearrangement**"
                ]
              }
            ]
          },
          {
            "sub": "5. Activation of host cells signalling cascade แล้วจึงเป็น Clinical disease",
            "body": [
              {
                "text": "สไลด์ไม่ได้ลงรายละเอียดว่า signalling cascade ใดบ้าง"
              }
            ]
          }
        ]
      },
      {
        "heading": "หัวข้อย่อยของ bacterial adherence",
        "source": "Fundamental of Host Microbe interaction p.13",
        "body": [
          {
            "text": "สไลด์แตกเรื่อง adherence ออกเป็นหัวข้อย่อยตามนี้ ซึ่งเป็นโครงของสไลด์ถัดไป"
          },
          {
            "bullets": [
              "Mechanisms involved in bacterial adhesion ได้แก่ pre-adhesion event, adhesive interactions หรือ specific interaction, bacterial structures involved in adhesion, host molecules functioning as receptors",
              "Tissue tropism",
              "Consequences of bacterial adhesion",
              "Prevention of bacterial adhesion"
            ]
          },
          {
            "callout": "หัวข้อ Prevention of bacterial adhesion ถูกลิสต์ไว้ในสไลด์นี้ แต่สไลด์ที่เหลือของ deck ไม่มีเนื้อหาส่วนนี้เป็นตัวหนังสือ สไลด์ไม่ได้บอกว่าป้องกันอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pre-adhesion events: ระยะห่างกำหนดว่าแรงใดทำงาน",
        "source": "Fundamental of Host Microbe interaction p.14",
        "body": [
          {
            "text": "ก่อนจะเกิดการเกาะจริง สไลด์อธิบายด้วย distance between host cells and bacteria คู่กับ physiochemical forces ที่ทำงานในแต่ละช่วงระยะ"
          },
          {
            "bullets": [
              "**> 50 nm : Van der Waals forces ทำงาน ทำให้เกิด mutual interaction**",
              "**10-20 nm : electrostatic forces เริ่มมีนัยสำคัญ**",
              "**0.5-2 nm : hydrophobic interaction**",
              "**< 1 nm : specific interaction ได้แก่ hydrogen bonding, cation binding และ receptor-ligand interaction**"
            ]
          },
          {
            "text": "สไลด์ p.15 เป็นรูปสรุปช่วงระยะทั้งสี่นี้เทียบกับ substratum โดยไม่มีข้อความเพิ่ม"
          },
          {
            "callout": "ช่วง 0.5-2 nm กับ < 1 nm ทับซ้อนกันตามที่สไลด์เขียน สไลด์ไม่ได้บอกว่าแยกสองช่วงนี้ออกจากกันอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Adhesive interactions หรือ specific interaction",
        "source": "Fundamental of Host Microbe interaction p.16",
        "body": [
          {
            "text": "สไลด์ระบุ principle types ของ molecular interaction ที่เกี่ยวข้องกับ bacterial adhesion และย้ำว่าการเกาะของ bacterium กับ substratum หนึ่งครั้ง **อาจใช้แบบใดแบบหนึ่งหรือหลายแบบร่วมกันก็ได้**"
          },
          {
            "bullets": [
              "Hydrophobic interactions (hydrogen bonding)",
              "**Cation-bridging** ซึ่งรูปในสไลด์ใช้ Ca2+ เป็นตัวอย่างเชื่อมระหว่าง bacterium กับ substratum",
              "Receptor-ligand binding"
            ]
          }
        ]
      },
      {
        "heading": "Bacterial structures ที่ใช้ในการเกาะ และธรรมชาติของ adhesins",
        "source": "Fundamental of Host Microbe interaction p.17",
        "body": [
          {
            "text": "สไลด์ตั้งคำถามสองข้อคือ bacterial structures ใดบ้างที่เกี่ยวข้องกับ adhesion และ adhesins บนโครงสร้างเหล่านั้นมีลักษณะอย่างไร แล้วตอบด้วยประเด็นต่อไปนี้"
          },
          {
            "bullets": [
              "โมเลกุลหลากหลายชนิดที่อยู่บน adherent structures ของ bacteria สามารถทำหน้าที่เป็น adhesins ได้",
              "**หลายกรณี adhesins อยู่ที่ปลายของโครงสร้าง (fimbriae, fibrils, flagella) ที่ยื่นออกไปไกลจาก bacterial cell wall**",
              "**Enzyme glyceraldehyde-3-phosphate dehydrogenase (GADPH ตามที่สไลด์สะกด) ซึ่งเป็น key enzyme ของ glycolytic pathway เมื่ออยู่ที่ surface structures จะทำหน้าที่เป็น adhesin** และเกี่ยวข้องกับ acquisition of transferrin-bound iron รวมถึง bacteria-host signalling"
            ]
          },
          {
            "text": "สไลด์ p.18 และ p.19 ที่ตามมาเป็นรูปประกอบคำถาม what bacterial structures are involved in adhesion อ้างอิง Wilson et al. โดยไม่มีข้อความบรรยาย"
          }
        ]
      },
      {
        "heading": "Host molecules ที่ทำหน้าที่เป็น receptors",
        "source": "Fundamental of Host Microbe interaction p.20",
        "body": [
          {
            "text": "สไลด์ลิสต์โมเลกุลบนผิว host cell ที่ทำหน้าที่เป็น receptor ให้ bacterial adhesins"
          },
          {
            "bullets": [
              "Membrane spanning protein หรือ transmembrane protein",
              "Surface immunoglobulin",
              "Glycolipids",
              "Glycoproteins",
              "**Extracellular matrix proteins เช่น fibronectin และ collagen**"
            ]
          },
          {
            "text": "**สไลด์เขียนข้อยกเว้นไว้หนึ่งอันคือ translocated intimin receptor (Tir) ใน E. coli**"
          },
          {
            "callout": "สไลด์ระบุ Tir เป็นข้อยกเว้นของกลุ่ม host molecules แต่ไม่ได้อธิบายเหตุผลไว้ที่หน้านี้ ให้ไปอ่านคู่กับ p.37 ที่พูดถึง protein translocation และ intimin-Tir interaction",
            "kind": "tip"
          },
          {
            "text": "สไลด์ p.21 เป็น diagram ของโมเลกุลหลักบนผิว typical mammalian cell พร้อมคำบรรยายว่าโมเลกุลเหล่านี้ส่วนใหญ่ทำหน้าที่เป็น receptors ให้ bacterial adhesins ได้"
          }
        ]
      },
      {
        "heading": "Tissue tropism",
        "source": "Fundamental of Host Microbe interaction p.22",
        "body": [
          {
            "text": "**Bacterial species หนึ่ง ๆ มักจะ adhere, colonize และอาจ induce pathology ในเนื้อเยื่อเพียงชนิดเดียว**"
          },
          {
            "text": "**พื้นฐานของ bacterial adhesion คือ specific ligand-receptor interactions**"
          },
          {
            "text": "สไลด์มีหัวข้อ example of tissue tropism และ p.23 เป็นตาราง bacterial adhesins and their receptors แต่ทั้งสองหน้าเป็นรูปอ้างอิง Wilson et al. ที่ไม่มีข้อความในไฟล์ จึงไม่มีตัวอย่างเชื้อระบุไว้ในโน้ตนี้"
          }
        ]
      },
      {
        "heading": "Consequences of bacterial adhesion",
        "source": "Fundamental of Host Microbe interaction p.24",
        "body": [
          {
            "text": "สไลด์แยกผลของการเกาะเป็นสองฝั่งคือ effect on the bacterium และ effect on the host"
          },
          {
            "sub": "Effect on the host แยกตามชนิดเซลล์",
            "body": [
              {
                "text": "ชนิดเซลล์ที่สไลด์ยกมาคือ epithelial cells, fibroblasts, endothelial cells และ phagocytic cells"
              },
              {
                "text": "สำหรับ epithelial cells สไลด์ไล่ผลที่เกิดได้เป็น"
              },
              {
                "bullets": [
                  "**Adhesion without apparent effect** คือเกาะแล้วไม่เห็นผลอะไร",
                  "Induction of morphological alterations",
                  "Induction of functional changes",
                  "Invasion",
                  "Cell death"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ p.25 ถึง p.30 เป็นรูปประกอบหัวข้อ effect on the bacterium และ effect on the host อ้างอิง Wilson et al. โดยไม่มีข้อความ สไลด์จึงไม่ได้บอกรายละเอียดของผลฝั่ง bacterium ไว้เป็นตัวหนังสือ"
          }
        ]
      },
      {
        "heading": "Invasion mechanism ภาพรวม",
        "source": "Fundamental of Host Microbe interaction p.31",
        "body": [
          {
            "bullets": [
              "Pathogen จับกับ host molecules เพื่อ mediate invasion",
              "**เมื่อเกาะกับผิว host ได้แล้ว pathogen บางตัวจะเข้าไปลึกกว่านั้นเพื่อทำให้ infection cycle ดำเนินต่อไป**",
              "แบ่งเป็น extracellular invasion และ intracellular invasion",
              "**เซลล์ host หลักที่ถูก bacteria invade คือ epithelial cells และ endothelial cells**"
            ]
          },
          {
            "sub": "สองกลยุทธ์ของ intracellular invasion",
            "body": [
              {
                "bullets": [
                  "**Induced change in cell's cytoskeleton**",
                  "**Enter the cell without any involvement of cytoskeleton**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ p.34 มีคำบรรยายสั้น ๆ ว่ารูปแสดง two of the three types of filament ที่ประกอบเป็น cytoskeleton ของ eukaryotic cells แต่ไม่ได้ระบุชื่อ filament ทั้งสามไว้เป็นข้อความ"
          }
        ]
      },
      {
        "heading": "สองรูปแบบการ invade ตามคำบรรยายรูป A และ B",
        "source": "Fundamental of Host Microbe interaction p.35",
        "body": [
          {
            "sub": "แบบ A ใช้ injection secretion system",
            "body": [
              {
                "text": "**Bacterial cell มี injection secretion system ที่ฉีด proteins หลายตัวเข้าไปใน host cell โปรตีนบางตัวทำให้เกิด cytoskeletal reorganization ซึ่งไป engulf ตัว bacteria เข้ามา** เมื่ออยู่ใน cytosol แล้ว bacteria จะ lyse vacuolar membrane หนีออกมา และเคลื่อนที่ไปมาได้"
              }
            ]
          },
          {
            "sub": "แบบ B ใช้ bacterial surface protein",
            "body": [
              {
                "text": "**Bacterial surface protein จับกับผิวเซลล์แล้วชักนำให้เซลล์ทำ endocytosis ตัวมันเอง** เมื่อเข้าไปในเซลล์ บางตัวหนีออกมาเหมือนแบบ A ส่วนบางตัว **multiply อยู่ใน phagosome**"
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง EPEC และ EHEC: intimin, Tir และ pedestal formation",
        "source": "Fundamental of Host Microbe interaction p.37",
        "body": [
          {
            "text": "**EPEC และ EHEC จับกับ plasma membrane ของ epithelial cells ผ่าน hollow EspA filaments**"
          },
          {
            "text": "**หลังจากนั้นเกิด protein translocation แล้วตามด้วย interaction ระหว่าง outer membrane adhesin intimin กับ Tir**"
          },
          {
            "text": "**Intimin-Tir interaction นำไปสู่ reorganisation ของทั้ง micro filaments และ intermediate filaments ใต้ตัวเชื้อที่เกาะอยู่ เกิด pedestal formation และ intimate attachment**"
          },
          {
            "text": "สไลด์ p.36 เป็นรูป invasion mechanism of E. coli และ p.38 เป็นรูป type III secretion system ซึ่งทั้งสองหน้าไม่มีข้อความบรรยาย"
          }
        ]
      },
      {
        "heading": "Consequences of invasion: effect on host cells",
        "source": "Fundamental of Host Microbe interaction p.40",
        "body": [
          {
            "text": "สไลด์ลิสต์ผลต่อ host cells ไว้ 5 ข้อ"
          },
          {
            "bullets": [
              "Cytokine release",
              "Prostaglandin release (สไลด์สะกดว่า proataglandin)",
              "The expression of adhesion molecules และ neutrophil adhesion",
              "Cell death",
              "**Synthesis of tissue factor**"
            ]
          },
          {
            "sub": "Tissue factor ตามที่สไลด์ขยายความ",
            "body": [
              {
                "text": "**เป็น transmembrane protein ที่สร้างโดย endothelial cells เพื่อตอบสนองต่อ stimuli หลายชนิด**"
              },
              {
                "text": "**ผลคือเกิดการสร้าง fibrin ที่มาเคลือบเซลล์ ซึ่งสไลด์โยงไปที่ vegetative endocarditis ของ heart valves**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Consequences of invasion: effect on bacteria",
        "source": "Fundamental of Host Microbe interaction p.43",
        "body": [
          {
            "text": "**สไลด์ระบุผลต่อตัวเชื้อไว้ประโยคเดียวคือ up- หรือ down-regulate ของ bacterial genes**"
          },
          {
            "text": "สไลด์ไม่ได้บอกว่ายีนกลุ่มใดถูก regulate หรือ regulate ไปในทิศทางใด"
          }
        ]
      }
    ]
  },
  "microbio-1--fungal-culture-and-identification-lab": {
    "topic": "microbio-1--fungal-culture-and-identification-lab",
    "title": "Fungal Culture and Identification (LAB)",
    "icon": "🍄",
    "summary": "สไลด์ lab 9 หน้า ว่าด้วยการเก็บตัวอย่าง เพาะเชื้อรา และ identify เบื้องต้นจาก morphology ครึ่งแรก (p.1-4) มีเนื้อหาเป็นตัวหนังสือจริง คือโจทย์ของ lab, collection methods, สูตรและชนิดของ culture medium และเทคนิค slide culture ส่วนครึ่งหลัง (p.5-9) เป็นสไลด์รูปเชื้อราแทบล้วน ๆ มีแค่ชื่อ genus/species กำกับ (Rhizopus, Mucor, Syncephalastrum, Aspergillus series, Penicillium, Helminthosporium, Paecillomyces, Scopulariopsis, Fusarium, Alternaria) ไม่มีคำบรรยายลักษณะแยกชนิด และหน้าสุดท้ายเป็นคำสั่งให้ไป identify เชื้อของตัวเอง โน้ตนี้จึงบันทึกเฉพาะสิ่งที่สไลด์เขียนไว้จริง",
    "sections": [
      {
        "heading": "โจทย์และงานที่ต้องทำใน lab นี้",
        "source": "Fungal Culture and Identification LAB p.1",
        "body": [
          {
            "text": "Lab exercise ทำ **by group หรือ by person** โดยหัวข้อคือ Type of Fungi เทคนิคที่ต้องทำมี 4 อย่าง"
          },
          {
            "bullets": [
              "Fungal culture",
              "Direct mounting",
              "Scotch tape technique",
              "Slide culture technique"
            ]
          },
          {
            "sub": "LAB EXAMINATION 2024 Student Assignment (ตามที่สไลด์เขียน)",
            "body": [
              {
                "bullets": [
                  "identify เชื้อราที่ขึ้นในเบื้องต้น โดยใช้ feature ของ morphology ร่วมกับ direct mounting ดูใต้กล้อง",
                  "**แยกให้ออกว่าอันไหนคือ major fungus อันไหนคือ contamination ที่เป็นไปได้**",
                  "รู้จัก advance technique สำหรับ diagnosis",
                  "ส่งงานได้ทั้งแบบวาดรูป ถ่ายรูป หรือทำเป็น VDO clip"
                ]
              }
            ]
          },
          {
            "text": "ตัวอย่างที่นำมา collection และ culture มี 2 แหล่ง คือ **environmental samples** และ **human or animal samples**"
          }
        ]
      },
      {
        "heading": "Collection methods: direct vs indirect",
        "source": "Fungal Culture and Identification LAB p.2",
        "body": [
          {
            "text": "สไลด์แบ่งวิธีเก็บเป็น 2 แบบ ซึ่งใช้ PPE และการนำส่งเหมือนกันทุกอย่าง **ต่างกันแค่อุปกรณ์ที่ใช้เก็บ**"
          },
          {
            "sub": "Direct",
            "body": [
              {
                "bullets": [
                  "Gown, glove, mask และ antiseptic",
                  "**Blade และ forceps**",
                  "ใส่ plastic envelop หรือ drug box (nonsterile may be fine)",
                  "เก็บที่ room temp และส่งถึง lab ภายใน 3 วัน"
                ]
              }
            ]
          },
          {
            "sub": "Indirect",
            "body": [
              {
                "bullets": [
                  "Gown, glove, mask และ antiseptic",
                  "**Toothbrush หรือ cotton swab**",
                  "ใส่ plastic envelop หรือ drug box (nonsterile may be fine)",
                  "เก็บที่ room temp และส่งถึง lab ภายใน 3 วัน"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าเคสแบบไหนควรเลือก direct และเคสแบบไหนควรเลือก indirect บอกแค่อุปกรณ์ของแต่ละแบบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Principle of fungal culture และสูตร SDA",
        "source": "Fungal Culture and Identification LAB p.2",
        "body": [
          {
            "text": "องค์ประกอบของการเพาะเชื้อตามสไลด์มี 3 ส่วน"
          },
          {
            "bullets": [
              "Container: test tube หรือ Petri dish",
              "A sample: tissue หรือ body fluid",
              "Culture medium: **Sabouraud dextrose agar (SDA)**"
            ]
          },
          {
            "text": "สไลด์ระบุว่า SDA มาจาก **Raymond Sabouraud ปี 1892**"
          },
          {
            "sub": "องค์ประกอบ SDA ที่สไลด์เขียนไว้",
            "body": [
              {
                "bullets": [
                  "กล่องแรก: dextrose 40 g/L, peptone 10 g/L, agar 20 g/L, **pH 5.6**",
                  "ตาราง Ingredients of SDA: mycological peptone (enzymatic digest of casein and animal tissues) 10 gm, dextrose 40 gm, agar 15 gm, ปรับ pH เป็น 5.6 ที่ 25 องศา"
                ]
              },
              {
                "callout": "สไลด์หน้าเดียวกันให้ปริมาณ agar ไม่ตรงกัน (20 g/L ในกล่องแรก แต่ 15 gm ในตาราง ingredients) ส่วน dextrose 40 peptone 10 และ pH 5.6 ตรงกันทั้งสองที่ สไลด์ไม่ได้บอกว่าเลขไหนคือที่ถูก",
                "kind": "warn"
              }
            ]
          },
          {
            "text": "สำหรับการกระตุ้นให้สร้าง conidia (**for conidial development**) สไลด์ระบุให้ใช้ **Potato dextrose agar และ Corn meal agar**"
          }
        ]
      },
      {
        "heading": "Veterinary mycological diagnosis: วิธีตรวจทั้งชุด",
        "source": "Fungal Culture and Identification LAB p.2",
        "body": [
          {
            "sub": "Culture and staining",
            "body": [
              {
                "bullets": [
                  "Routine culture: **SDA, CMA, PDA (+ supplement)**",
                  "Selective culture: Chrome agar, Niger seed agar, selective agar (+CHPC, CHX), mycosel agar",
                  "Staining: **lactophenol cotton blue**",
                  "Biochemical tests"
                ]
              },
              {
                "text": "สไลด์กำกับตัวย่อไว้ว่า **CHX และ CHPC = cycloheximide และ chloramphenicol**"
              }
            ]
          },
          {
            "sub": "วิธีอื่นที่สไลด์ไล่ต่อ",
            "body": [
              {
                "bullets": [
                  "Serological test: **complement fixation**",
                  "Molecular biology สำหรับ epidemiological study"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์แค่ list ชื่อวิธีไว้ ไม่ได้อธิบายว่าแต่ละวิธีทำอย่างไร แปลผลอย่างไร หรือเลือกใช้เมื่อไหร่",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Type of fungal culture: routine / selective / testing media",
        "source": "Fungal Culture and Identification LAB p.3",
        "body": [
          {
            "text": "**Mycosel agar (BBL)** = highly selective medium ที่ได้จากการผสม **cycloheximide กับ chloramphenicol**"
          },
          {
            "text": "สไลด์แบ่ง media เป็น 3 กลุ่ม"
          },
          {
            "bullets": [
              "Routine media: Sabouraud Dextrose Agar (SDA), Potato Dextrose Agar (PDA), Corn Meal Agar",
              "Selective media: Chrome Agar, Dermatophytes Test Medium และ routine agar ที่เติม specific supplements",
              "Testing media: Urea agar, Cremophor EL agar, Tween esculine agar"
            ]
          },
          {
            "text": "ท้ายหน้าสไลด์ยังมีคำกำกับลอย ๆ อีกชุด คือ Red; Phenol red / Violet; Bromcresol purple / Vitamine B1, thymine / Lipid; castrol oil, olive oil"
          },
          {
            "callout": "สไลด์วางคำชุดหลังนี้ไว้เฉย ๆ ไม่ได้เขียนว่า indicator หรือ supplement ตัวไหนคู่กับ media ตัวไหน จำแค่ว่า phenol red กับ bromcresol purple เป็นสีที่ถูกพูดถึงคู่กับกลุ่ม media เหล่านี้ อย่าเดาการจับคู่เอง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Fungal characteristics",
        "source": "Fungal Culture and Identification LAB p.3",
        "body": [
          {
            "bullets": [
              "**Yeast**",
              "**Glabrous**",
              "**Granular**",
              "**Velvety**",
              "**Cottony**"
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อลักษณะ ไม่ได้เขียนคำนิยามของแต่ละคำ และไม่ได้บอกว่าลักษณะไหนพบในเชื้อ genus ใด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Isolation และ slide culture technique",
        "source": "Fungal Culture and Identification LAB p.4",
        "body": [
          {
            "text": "หน้านี้เป็นรูปประกอบเป็นหลัก หัวข้อที่เขียนไว้คือ Isolation by culturing on appropriated medium ซึ่งทำได้ทั้งบน **plate agar** และ **slant agar**"
          },
          {
            "sub": "Slide culture technique: equipments ที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "**Glass rod**",
                  "**Slide**",
                  "**Filter membrane**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนขั้นตอนการทำ slide culture ไว้เป็นข้อความ มีเพียงรายการอุปกรณ์กับรูป ต้องดูวิธีทำจากการสาธิตในห้อง lab",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Identification: กลุ่ม Zygomycota",
        "source": "Fungal Culture and Identification LAB p.5",
        "body": [
          {
            "text": "หน้า Identification หน้าแรกจัดกลุ่ม **Zygomycota** และยกตัวอย่าง 3 genus"
          },
          {
            "bullets": [
              "**Rhizopus spp.**",
              "**Mucor spp.**",
              "**Syncephalastrum sp.**"
            ]
          },
          {
            "text": "โครงสร้างที่สไลด์ชี้ไว้บนรูปคือ **sporangium**, **columella** และ **aseptate hypha**"
          },
          {
            "callout": "สไลด์ให้เฉพาะชื่อโครงสร้างกับรูป ไม่ได้เขียนว่า Rhizopus, Mucor และ Syncephalastrum ต่างกันตรงจุดไหน ต้องเทียบจากรูปในสไลด์และของจริงใต้กล้อง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Aspergillus series",
        "source": "Fungal Culture and Identification LAB p.6",
        "body": [
          {
            "text": "สไลด์ยก Aspergillus series มา 4 species"
          },
          {
            "bullets": [
              "**As. flavus**",
              "**As. fumigatus**",
              "**As. terreus**",
              "**As. niger**"
            ]
          },
          {
            "sub": "feature ที่สไลด์ให้ใช้เทียบ (วางไว้ข้างรูป A. fumigatus กับ A. flavus)",
            "body": [
              {
                "bullets": [
                  "**Biseriate หรือ uniseriate**",
                  "**Surface**",
                  "**Vesicle arrangement**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์บอกแค่ว่าให้ดู 3 feature นี้ แต่ไม่ได้เขียนว่า species ไหนเป็น biseriate หรือ uniseriate ไม่ได้บรรยาย surface หรือ vesicle arrangement ของแต่ละตัว ห้ามเติมเอง ต้องอ่านจากรูปในสไลด์จริง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Penicillium และเชื้อราอื่นในหน้าเดียวกัน",
        "source": "Fungal Culture and Identification LAB p.7",
        "body": [
          {
            "text": "หัวข้อหลักคือ **Penicillium spp.** โดยมีคำกำกับข้างชื่อว่า **Penicillium marneffei**, **antibiotic producer** และ **ear rot in corn**"
          },
          {
            "text": "genus อื่นที่ปรากฏชื่อในหน้านี้"
          },
          {
            "bullets": [
              "**Helminthosporium spp.**",
              "**Paecillomyces spp.**",
              "**Scopulariopsis spp.**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้อธิบายว่า antibiotic producer และ ear rot in corn เกี่ยวกับ species ใดโดยเฉพาะ และไม่ได้บรรยายลักษณะ morphology ของ Helminthosporium, Paecillomyces หรือ Scopulariopsis เลย มีแต่ชื่อกับรูป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Fusarium, Alternaria และ MALDI-TOF",
        "source": "Fungal Culture and Identification LAB p.8",
        "body": [
          {
            "text": "genus ที่ปรากฏในหน้านี้คือ **Fusarium sp.** และ **Alternaria sp.**"
          },
          {
            "sub": "คำอธิบายรูป Fusarium ที่สไลด์อ้างจากแหล่งภายนอก",
            "body": [
              {
                "text": "a F. equiseti, b F. oxysporum, c F. graminearum, d F. solani, e F. commune, f F. verticillioides, g F. proliferatum, h F. fujikuroi, i F. avenaceum โดย scale bar = 20 ไมโครเมตร (สไลด์ให้ image source เป็น DOI 10.1007/s10658-017-1410-7)"
              }
            ]
          },
          {
            "text": "ท้ายหน้ามีหัวข้อ **Fungal identification by MALDI-TOF**"
          },
          {
            "callout": "สไลด์เขียนชื่อ MALDI-TOF ไว้เป็นหัวข้อเฉย ๆ ไม่ได้อธิบายหลักการ ขั้นตอน หรือข้อจำกัดของวิธีนี้เลย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "หน้าปิดท้าย",
        "source": "Fungal Culture and Identification LAB p.9",
        "body": [
          {
            "text": "สไลด์สุดท้ายมีข้อความเดียวคือ **Let's identify your own fungus** ซึ่งเป็นการส่งต่อให้ไปทำงานจริงตาม assignment ในหน้าแรก"
          }
        ]
      }
    ]
  },
  "microbio-1--fungal-disease-and-classification-lect1": {
    "topic": "microbio-1--fungal-disease-and-classification-lect1",
    "title": "Fungal Disease and Classification (Lect 1)",
    "icon": "🍄",
    "lecturer": "Assoc. Prof. Dr. Nuvee Prapasarakul",
    "summary": "เลกเชอร์เปิดหมวด Fungi ของ VET Mycology ปูตั้งแต่ fungus คืออะไร ต่างจาก bacteria พืช สัตว์ตรงไหน ecology แบบ heterotroph โครงสร้างเซลล์ (chitin, ergosterol) รูปแบบ hypha การจำแนก phylum (Ascomycota, Basidiomycota, Zygomycota, Chytridiomycota, Glomeromycota และ Deuteromycota/Fungi Imperfecti) วิธีตั้งชื่อและจัดกลุ่มโรคเชื้อรา predisposing causes และกลไกกว้าง ๆ ว่าเชื้อราก่อโรคอย่างไร สไลด์เป็นแนวภาพรวมกว้างมากกว่าลงลึกรายโรค หลายหน้า (p.15, p.16, p.18, บางส่วนของ p.7, p.12, p.21) เป็นรูป colony/รอยโรค/แผนภาพวงจรชีวิตที่แทบไม่มีข้อความ และตัวเลขจำนวน species ในสไลด์เองยังไม่ตรงกันระหว่างหน้า",
    "sections": [
      {
        "heading": "ขอบเขตของเลกเชอร์ (Key Features: VET Mycology)",
        "source": "Fungal Disease and classification Lect1 p.2",
        "body": [
          {
            "text": "สไลด์เปิดวางกรอบไว้ว่าวิชานี้จะเดินตามหัวข้อเหล่านี้ ใช้เป็นโครงในการทบทวนได้เลย"
          },
          {
            "bullets": [
              "What's fungus",
              "Ecology",
              "Physiological features",
              "Morphological features",
              "Structure",
              "Classification",
              "Fungal associated diseases"
            ]
          }
        ]
      },
      {
        "heading": "Fungi ต่างจาก Bacteria พืช และสัตว์ อย่างไร",
        "source": "Fungal Disease and classification Lect1 p.3",
        "body": [
          {
            "text": "สไลด์เทียบ 5 features ได้แก่ Cell type, DNA, Reproductive, Ribosomes และ Cell wall"
          },
          {
            "sub": "แถวของ Fungi (ตัวที่ต้องจำ)",
            "body": [
              {
                "bullets": [
                  "Cell type: **Eukaryote**",
                  "DNA: **Intron + Exon**",
                  "Reproductive: **Asexual + Sexual**",
                  "Ribosomes: **80S**",
                  "Cell wall: **Chitin** และ **Ergosterol**"
                ]
              }
            ]
          },
          {
            "sub": "เทียบกับกลุ่มอื่นในตารางเดียวกัน",
            "body": [
              {
                "bullets": [
                  "Bacteria: Prokaryote, Exon, Asexual, ribosome **50S**, ผนังเป็น Peptidoglycan และ LPS",
                  "Plants: Eukaryote, Intron + Exon, Asexual + Sexual, 80S, Cellulose และ Chlorophyll",
                  "Animals: Eukaryote, Intron + Exon, Sexual, 80S, Cholesterol Glycogen Keratin"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่ายสุดในตารางนี้คือคู่ ribosome 50S ของ bacteria กับ 80S ของ eukaryote และคู่ผนังเซลล์ peptidoglycan กับ chitin",
            "kind": "tip"
          },
          {
            "text": "สไลด์ยังเขียนเรื่องความหลากหลายไว้ว่า Species มีราว **1.5-5 ล้านชนิด แต่ระบุชนิดได้แล้วเพียง 5%** และเชื้อรามีบทบาททั้ง symbiosis, commensalism, mutualism และเป็น decomposer รวมถึงเป็นแหล่งของ antibiotic และ antinematode"
          }
        ]
      },
      {
        "heading": "Fungi เป็น Heterotroph",
        "source": "Fungal Disease and classification Lect1 p.3-4",
        "body": [
          {
            "text": "**Heterotroph** (héteros = other + trophe = nutrition) คือสิ่งมีชีวิตที่สร้างอาหารเองไม่ได้ ต้องรับสารอาหารจากแหล่ง organic carbon อื่น ส่วนใหญ่คือซากพืชหรือซากสัตว์ สไลด์กำกับเป็นภาษาไทยไว้สั้น ๆ ว่า หาอาหารเองไม่ได้"
          },
          {
            "sub": "ตัวอย่าง heterotroph ที่สไลด์ยกมา",
            "body": [
              {
                "bullets": [
                  "Fungal decomposers",
                  "Rhizopogon rubescens",
                  "Entomophthora sp.",
                  "Arthrobotrys oligospora ซึ่งสไลด์จัดเป็น **Nematophageous fungi**"
                ]
              }
            ]
          },
          {
            "sub": "Biochemical feature",
            "body": [
              {
                "bullets": [
                  "Disaccharide **trehalose**",
                  "Sugar alcohols ได้แก่ **mannitol** และ **arabitol**"
                ]
              }
            ]
          },
          {
            "text": "หน้าเดียวกันมีรายชื่อจุลินทรีย์แบ่งเป็น 3 กลุ่ม คือ ราชนิดที่ไม่เปลี่ยนแอลกอฮอล์ (Amylomyces rouxii, Rhizopus spp.) ยีสต์หรือราเซลล์เดียวที่เปลี่ยนแอลกอฮอล์ (Endomycopsis spp. พบจำนวนมาก, Hasenula spp. พบจำนวนมาก, Saccharomyces cerevisiae พบน้อย) และแบคทีเรีย (Pediococcus pentosaceus, Lactobacillus spp.)"
          },
          {
            "callout": "ข้อความไทยในหน้านี้ text layer แตกอ่านยาก จับได้แค่โครงสามกลุ่มกับรายชื่อเชื้อ สไลด์ไม่ได้อธิบายต่อว่ากลุ่มพวกนี้ใช้ทำอะไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Growth condition และ Nutrition ของเชื้อรา",
        "source": "Fungal Disease and classification Lect1 p.5",
        "body": [
          {
            "sub": "Growth",
            "body": [
              {
                "bullets": [
                  "**Room temperature**",
                  "**Acid condition**",
                  "**Light** สไลด์ระบุว่าเกี่ยวกับ sexual reproduction"
                ]
              }
            ]
          },
          {
            "sub": "Nutrition",
            "body": [
              {
                "bullets": [
                  "**Absorb rather than ingest** คือดูดซึมไม่ใช่กลืนกิน",
                  "Medium: CHO และใช้ organic หรือ inorganic เป็น nitrogen source",
                  "Glucose + organic nitrogen (ammonium compound)",
                  "**Do not require exogenous vitamins**"
                ]
              }
            ]
          },
          {
            "text": "หน้านี้ยังพาดหัวว่า Three Major Types of Fungus แต่รูป Fungal morphologies ที่วางไว้มี 5 ป้ายคือ Mushroom, Sponge, Mold, Yeast และ Lichen สไลด์ไม่ได้เขียนว่า three major types หมายถึงอันไหนบ้าง"
          }
        ]
      },
      {
        "heading": "โครงสร้างเซลล์และเป้าของยา",
        "source": "Fungal Disease and classification Lect1 p.6",
        "body": [
          {
            "sub": "Plasma membrane",
            "body": [
              {
                "bullets": [
                  "**Ergosterol** ซึ่งเป็น **Vit D2 precursor**"
                ]
              }
            ]
          },
          {
            "sub": "Capsule",
            "body": [
              {
                "bullets": [
                  "Mannan",
                  "**b glucan** สไลด์ทำดาวไว้ว่าเป็น **PAMPs (Pathogen Associated Molecular Patterns)** โดยยกตัวอย่าง Saccharomyces cerevisiae",
                  "Cellulose",
                  "**Chitin** สไลด์กำกับว่าเป็นโครงสร้างของ arthropod ด้วย และเป็น **target ของ polyoxin antibiotic**"
                ]
              }
            ]
          },
          {
            "callout": "คู่ที่ต้องจำคือ ergosterol อยู่ที่ membrane ส่วน chitin อยู่ที่ผนัง และ chitin คือเป้าของ polyoxin ตามที่สไลด์เขียน สไลด์ไม่ได้พูดถึงยากลุ่มอื่นหรือกลไกของ ergosterol กับยาใด ๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "MOLD: ชนิดของ hypha และหน้าตา colony",
        "source": "Fungal Disease and classification Lect1 p.6-7",
        "body": [
          {
            "sub": "แบ่งตาม septum (p.6)",
            "body": [
              {
                "bullets": [
                  "**Non-septate hypha (coenocytic hypha)** พบใน **Zygomycetes**",
                  "**Septate hypha** พบใน **Ascomycetes** และ **Basidiomycetes**"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะ filamentous colonies (p.7)",
            "body": [
              {
                "bullets": [
                  "Glabrous",
                  "Powdery",
                  "Velvety",
                  "Fluffy",
                  "Cottony"
                ]
              }
            ]
          },
          {
            "text": "หน้า p.7 ที่เหลือเป็นรูป TREE of Fungi, Mold: Asexual sporulation และ Structure of Fungus แบบ filamentous ซึ่งเป็นภาพล้วน ไม่มีคำอธิบายเป็นข้อความในสไลด์"
          }
        ]
      },
      {
        "heading": "การระบุชนิดด้วยวิธี molecular และ MALDI-TOF",
        "source": "Fungal Disease and classification Lect1 p.8",
        "body": [
          {
            "bullets": [
              "Concordance ระหว่าง **18S rDNA RT-PCR** กับผล culture เท่ากับ **91%**",
              "Congruence ระหว่าง 18S rDNA RT-PCR กับผล **ITS PCR** เท่ากับ **94%**",
              "**Internal transcribed spacers (ITS) regions มีความแปรผันมากกว่า** จึงมักใช้แยกเชื้อราต่าง species ได้",
              "**MALDI-TOF** และ MALDI-TOF/TOF MS ใช้เป็น workflow สำหรับ biotyping และวิเคราะห์ fungal species"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าตัวเลข 91% และ 94% มาจากการศึกษาใด และไม่ได้เทียบข้อดีข้อเสียของ 18S กับ ITS มากไปกว่าประโยคที่ยกมา",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Fungal biology and physiology ที่เกี่ยวกับการเกิดโรค",
        "source": "Fungal Disease and classification Lect1 p.9",
        "body": [
          {
            "sub": "Growth and Reproduction",
            "body": [
              {
                "bullets": [
                  "**Yeasts เป็น unicellular** สืบพันธุ์แบบ asexual ด้วย **budding หรือ fission**",
                  "**Molds เป็น multicellular filaments เรียก hyphae** สานกันเป็นร่างแหเรียก **mycelium**",
                  "**Dimorphic fungi สลับสองรูปแบบได้ตามสภาพแวดล้อม** ซึ่งสไลด์ระบุว่ามักสัมพันธ์กับความสามารถในการก่อโรค",
                  "ตัวอย่าง: **Histoplasma capsulatum อยู่ในสิ่งแวดล้อมเป็น mold แต่เปลี่ยนเป็น yeast form ในตัว host** ซึ่งเอื้อต่อ pathogenicity"
                ]
              }
            ]
          },
          {
            "sub": "Virulence Factors",
            "body": [
              {
                "text": "เชื้อราสร้าง virulence factors หลายอย่างที่ช่วยให้ติดเชื้อ หลบ immune response และก่อโรค ได้แก่ enzymes ที่ย่อย host tissues, toxins และโมเลกุลที่รบกวนภูมิคุ้มกันของ host"
              },
              {
                "text": "ตัวอย่างที่สไลด์ยก: **Cryptococcus neoformans สร้าง capsule ที่ป้องกัน phagocytosis** โดย immune cells ทำให้อยู่รอดและกระจายตัวในตัว host ได้"
              }
            ]
          },
          {
            "sub": "Metabolism",
            "body": [
              {
                "text": "เชื้อราเป็น heterotroph ได้สารอาหารจาก organic sources และมี metabolic pathways ที่ย่อย substrate ได้หลากหลายรวมถึง polymer ซับซ้อนอย่าง **cellulose และ lignin** จึงเป็น decomposer สำคัญของระบบนิเวศ ส่วนเชื้อราก่อโรคก็วิวัฒน์กลไกในการ metabolize host tissues ซึ่งเป็นที่มาของอาการแสดงของโรค"
              }
            ]
          },
          {
            "sub": "Environmental Adaptations",
            "body": [
              {
                "text": "เชื้อราอยู่รอดในสิ่งแวดล้อมที่หลากหลายและรุนแรงได้ ตั้งแต่ความเย็นจัดถึงความเค็มสูง กลไกหนึ่งคือ **การสร้าง spores ที่ทน desiccation, heat และ UV radiation** เชื้อก่อโรคใช้กลไกเหล่านี้อยู่รอดในตัว host ด้วย และ **spores มีบทบาทสำคัญในการ transmission และการเริ่มต้นการติดเชื้อ**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical signs ที่สไลด์ยกเป็นตัวอย่าง",
        "source": "Fungal Disease and classification Lect1 p.10",
        "body": [
          {
            "bullets": [
              "**Dermatophytes เช่น Trichophyton spp. ทำให้เกิด skin infection ลักษณะผื่นเป็นวง (ring-shaped) และคัน**",
              "**Systemic infection เช่น histoplasmosis ทำให้มี fever, cough และ fatigue** สะท้อนการกระจายแบบ systemic"
            ]
          },
          {
            "text": "สไลด์สรุปว่าอาการแสดงที่หลากหลายนี้เป็นเหตุผลว่าทำไมต้องนึกถึง fungal infection ไว้ใน differential diagnoses โดยเฉพาะในผู้ป่วยที่มีอาการอธิบายไม่ได้"
          }
        ]
      },
      {
        "heading": "ปัญหาการจำแนก: Teleomorph กับ Anamorph และ Fungi Imperfecti",
        "source": "Fungal Disease and classification Lect1 p.10-11",
        "body": [
          {
            "sub": "กรอบคิดของหัวข้อนี้ (p.10)",
            "body": [
              {
                "text": "สไลด์วางหัวข้อว่า How to study mycology: taxonomic exemption แล้วเขียนกำกับไว้เป็นภาษาไทยสี่ประเด็นคือ ความหมายและคุณลักษณะ วิธีคิดในเรื่องของการจำแนก ความสำคัญต่อวิชาชีพ และโครงสร้างกับการเกิดโรค"
              },
              {
                "bullets": [
                  "**Past**: เคยเป็น formal phylum ของ kingdom Fungi",
                  "**Present**: ใช้แบบไม่เป็นทางการเพื่อหมายถึง species ที่สืบพันธุ์แบบ asexual"
                ]
              }
            ]
          },
          {
            "sub": "Fungi Imperfecti (p.11)",
            "body": [
              {
                "text": "สมาชิกที่สืบพันธุ์แบบ asexual มาจาก **Ascomycota** และ **Basidiomycota**"
              },
              {
                "text": "สไลด์ยกตัวอย่างปัญหาการตั้งชื่อไว้ตรง ๆ คือเชื้อตัวเดียวกันมีสองชื่อ **Teleomorph = Emericella nidulans ส่วน Anamorph = Aspergillus nidulans** และยก Aspergillus niger มาในกลุ่มเดียวกัน"
              },
              {
                "bullets": [
                  "**Deuteromycota มี septate mycelium**",
                  "**Always asexual reproduction**",
                  "อยู่ใน **conidia stage**"
                ]
              }
            ]
          },
          {
            "callout": "Teleomorph คือชื่อของ sexual stage ส่วน anamorph คือชื่อของ asexual stage ตามที่สไลด์จับคู่ Emericella กับ Aspergillus ไว้ สไลด์ไม่ได้นิยามคำสองคำนี้เป็นประโยคตรง ๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "โครงสร้างที่ใช้ identification",
        "source": "Fungal Disease and classification Lect1 p.12",
        "body": [
          {
            "sub": "Structure for identification in vitro",
            "body": [
              {
                "bullets": [
                  "**Conidiospore = conidium** (พหูพจน์ conidia)",
                  "**Sporangiospore**",
                  "**Arthrospore**",
                  "**Annelloconidia**",
                  "**Macroconidia**",
                  "**Chlamydospore**",
                  "**Blastic-sympodial conidiogenesis** สไลด์กำกับว่าเป็นราดำ dematiaceous fungi"
                ]
              }
            ]
          },
          {
            "sub": "Structure for identification in vivo: Disease in host",
            "body": [
              {
                "bullets": [
                  "**Hypha**",
                  "**Sclerotia**",
                  "**Arthrospore**",
                  "**Spherule with endospore**",
                  "**Sclerotic bodies / muriform**"
                ]
              }
            ]
          },
          {
            "callout": "แยกให้ชัดว่าอันไหนดูจากการเพาะเลี้ยง (in vitro) อันไหนคือรูปที่เจอในเนื้อเยื่อของ host (in vivo) เพราะ arthrospore เป็นตัวเดียวที่สไลด์ใส่ไว้ทั้งสองฝั่ง",
            "kind": "tip"
          },
          {
            "sub": "Species of Fungi: Deuteromycota ที่สไลด์ลิสต์เป็นชื่อโรค",
            "body": [
              {
                "bullets": [
                  "Candidiasis",
                  "Histoplasmosis",
                  "Cryptococcosis",
                  "Chytridiomycosis ซึ่งสไลด์กำกับเชื้อไว้ว่า Chytrid **Batrachochytrium dendrobatidis**",
                  "Sporotrichosis",
                  "Saprolegniasis",
                  "Pythiosis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การจัดกลุ่มโรคเชื้อรา (Fungal disease classifications)",
        "source": "Fungal Disease and classification Lect1 p.13",
        "body": [
          {
            "sub": "แบ่งตามลักษณะของเชื้อ",
            "body": [
              {
                "bullets": [
                  "**Pathogenic fungi**: Blastomycosis, Coccidiomycosis, Paracoccidomycosis, Histoplasmosis",
                  "**Opportunistic fungi**: Mycetoma, otomycosis, mycotic keratitis, meningitis, mycotic abscess, pulmonary aspergillosis, onychomycosis, dermatophytosis"
                ]
              }
            ]
          },
          {
            "sub": "เกณฑ์ที่ใช้ตั้งชื่อและจัดกลุ่มโรค",
            "body": [
              {
                "text": "สไลด์ลิสต์เกณฑ์ไว้ว่า **Phylum names, Organ involvement, Species of Fungi, Feature of diseases และ Rule of fungus** แล้วโยงกับตัวอย่างชื่อโรคชุดหนึ่งคือ Zygomycosis, Ascomycosis, Cutaneous mycoses, Subcutaneous mycoses, Systemic mycoses, Candidiasis, Actinomycosis, Aspergillosis, Mycetoma, Chromoblastomycosis รวมถึงคำว่า Opportunistic fungi และ Pathogenic fungi"
              },
              {
                "callout": "สไลด์วางชื่อเกณฑ์กับชื่อโรคเป็นแผนภาพ ไม่ได้เขียนจับคู่ทีละบรรทัดว่าโรคไหนมาจากเกณฑ์ไหน แต่เห็นแนวได้ว่า Zygomycosis กับ Ascomycosis มาจาก phylum ส่วน cutaneous, subcutaneous, systemic mycoses มาจาก organ involvement",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Organ involvements: cutaneous, subcutaneous, systemic",
        "source": "Fungal Disease and classification Lect1 p.13",
        "body": [
          {
            "sub": "Cutaneous mycoses",
            "body": [
              {
                "bullets": [
                  "Phaeohyphomycosis",
                  "Hyalohyphomycosis",
                  "Dermatophytosis",
                  "Dermatomycosis"
                ]
              }
            ]
          },
          {
            "sub": "Subcutaneous mycoses",
            "body": [
              {
                "bullets": [
                  "Mycetoma",
                  "Chromoblastomycosis",
                  "Lobomycosis"
                ]
              }
            ]
          },
          {
            "sub": "Systemic mycoses",
            "body": [
              {
                "bullets": [
                  "Histoplasmosis",
                  "Coccidioidomycosis",
                  "Blastomycosis",
                  "Invasive candidiasis",
                  "Zygomycosis"
                ]
              }
            ]
          },
          {
            "text": "หน้าเดียวกันมีรูปกำกับว่า Canine dermatophytosis and seborrheic dermatitis และหน้า p.14 มีรูป Disseminated Cryptococcosis and Candidiasis สไลด์ไม่ได้เขียนคำบรรยายรอยโรคไว้"
          }
        ]
      },
      {
        "heading": "Predisposing causes ของการติดเชื้อรา",
        "source": "Fungal Disease and classification Lect1 p.14",
        "body": [
          {
            "sub": "Immunosuppression therapy",
            "body": [
              {
                "bullets": [
                  "**Azathioprin**",
                  "**Steroid**"
                ]
              }
            ]
          },
          {
            "sub": "Cytotoxic drugs",
            "body": [
              {
                "bullets": [
                  "Anti-cancer therapy"
                ]
              }
            ]
          },
          {
            "sub": "Immunodeficiency syndrome",
            "body": [
              {
                "bullets": [
                  "**Feline Immunodeficiency Virus**",
                  "**Thymic hypoplasia**"
                ]
              }
            ]
          },
          {
            "sub": "Long period of antimicrobial administration",
            "body": [
              {
                "bullets": [
                  "**Inhibition of phagocytosis of white blood cell**",
                  "**Interfere vitamin synthesis of normal flora**"
                ]
              }
            ]
          },
          {
            "sub": "Chemotoxic and radiotoxic conditions",
            "body": [
              {
                "bullets": [
                  "Radiation",
                  "Mycotoxin"
                ]
              }
            ]
          },
          {
            "sub": "Final stage of cancer",
            "body": [
              {
                "bullets": [
                  "Leukemia",
                  "Lymphoma"
                ]
              }
            ]
          },
          {
            "callout": "ท้ายหน้ามีหัวข้อค้างไว้ว่า กลาก VS เกลื้อน แต่สไลด์ไม่ได้บอกว่าสองอย่างนี้ต่างกันอย่างไร ต้องรอเลกเชอร์ถัดไปหรือคำอธิบายในห้อง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เชื้อราก่อโรคอย่างไร (How do fungi cause disease?)",
        "source": "Fungal Disease and classification Lect1 p.16-17",
        "body": [
          {
            "text": "สไลด์ตั้งคำถามนี้ไว้ที่ p.16 ท้ายชุดรูปเคส (Feline cryptococcosis, Feline Sporotrichosis, Equine Pythiosis) แล้วตอบด้วยหัวข้อสั้น ๆ ที่ p.17"
          },
          {
            "bullets": [
              "**Asexual stage** คือรูปที่เกี่ยวข้องกับการก่อโรค",
              "**Low invasive and low contagious**",
              "**Non-production of endotoxin and exotoxin**",
              "**Need predisposing factors**",
              "**Hypersensitivities and mycotoxicosis**"
            ]
          },
          {
            "callout": "จุดที่ต่างจาก bacteria ชัดที่สุดตามสไลด์คือเชื้อราไม่สร้าง endotoxin และ exotoxin การก่อโรคจึงพึ่ง predisposing factors เป็นหลัก และพยาธิสภาพส่วนหนึ่งมาจาก hypersensitivity กับ mycotoxin",
            "kind": "tip"
          },
          {
            "text": "หน้า p.15 และ p.16 ที่เหลือเป็นชุดรูปเคส (Aspergillosis: a case study, Chronic seborrheic dermatitis, Fungal allergic diseases, Canine Dermatophytosis) ที่ไม่มีข้อความอธิบายในสไลด์"
          }
        ]
      },
      {
        "heading": "Five important true fungi และจำนวน species",
        "source": "Fungal Disease and classification Lect1 p.17",
        "body": [
          {
            "text": "สไลด์ใช้ตัวย่อ **A B C G Z** แทน 5 phylum หลัก"
          },
          {
            "bullets": [
              "**A = Ascomycota**",
              "**B = Basidiomycota**",
              "**C = Chytridiomycota**",
              "**G = Glomeromycota**",
              "**Z = Zygomycota**"
            ]
          },
          {
            "sub": "Fungal Classification ตามลำดับชั้น",
            "body": [
              {
                "bullets": [
                  "Domain: **Eukaryota**",
                  "Kingdom: **Fungi**",
                  "Divisions: รวมประมาณ **100,000 species**",
                  "Zygomycota: 600",
                  "Ascomycota: 60,000",
                  "Basidiomycota: 25,000"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขในเดคนี้ไม่ตรงกันเอง หน้า p.17 เขียน Zygomycota 600 และ Ascomycota 60,000 แต่ p.21 เขียนว่า Ascomycota เป็นกลุ่มที่หลากหลายที่สุดด้วย 64,000 species และตารางสรุป p.26 เขียน Zygomycota 750 กับ Ascomycota 64,000 ถ้าข้อสอบถามตัวเลขให้ยึดตามที่อาจารย์เน้นในห้อง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Phylum Chytridiomycota",
        "source": "Fungal Disease and classification Lect1 p.19",
        "body": [
          {
            "text": "สไลด์ระบุว่ามี **Class Chytridiomycetes เพียง class เดียว**"
          },
          {
            "bullets": [
              "ส่วนใหญ่ **unicellular** มีบางส่วนที่เป็น multicellular และสร้าง hyphae",
              "**No septa between cells (coenocytic)**",
              "มี **gametes และ diploid zoospores**",
              "**Spore ว่ายน้ำได้ด้วย single flagellum**",
              "เป็น protists ที่อยู่ในแหล่งน้ำ",
              "**ก่อโรคผิวหนังใน amphibians**"
            ]
          },
          {
            "text": "สไลด์อีกกล่องในหน้าเดียวกัน (The Chytrids) เขียนย้ำว่ารูปร่างเป็น spherical unicellular และ filamentous และภายในบรรจุ **motile zoospores**"
          }
        ]
      },
      {
        "heading": "ตารางเปรียบเทียบ phylum ที่เกี่ยวกับ mycotic disease",
        "source": "Fungal Disease and classification Lect1 p.19",
        "body": [
          {
            "text": "ตารางเทียบ 4 phylum ตาม sexual spore, asexual spore, septate hyphae และชื่อโรค"
          },
          {
            "bullets": [
              "**Ascomycota**: sexual spore = **Ascospore**, asexual = conidia, **septate hyphae +**, โรค = Ascomycosis",
              "**Basidiomycota**: sexual spore = **Basidiospore**, asexual = conidia, **septate hyphae +**, โรค = Basidiomycosis",
              "**Zygomycota**: sexual spore = **Zygospore**, asexual = **sporangiospores**, **septate hyphae -**, โรค = Zygomycosis",
              "**Deuteromycota (Fungi Imperfecti)**: **No sexual stage**, asexual = conidia, **septate hyphae +**, โรค = Deuteromycosis"
            ]
          },
          {
            "text": "สไลด์ปิดท้ายตารางว่า **เชื้อก่อโรคจำนวนมากไม่สร้าง sexual structures จึงถูกจัดอยู่ใน class deuteromycetes**"
          },
          {
            "callout": "ตารางนี้คือหน้าที่คุ้มค่าที่สุดของเลกเชอร์ จำสามคู่ ascospore กับ ascomycota, basidiospore กับ basidiomycota, zygospore กับ zygomycota แล้วจำว่า Zygomycota คือตัวเดียวที่ไม่มี septum และ Deuteromycota คือตัวเดียวที่ไม่มี sexual stage",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Phylum Zygomycota: common molds",
        "source": "Fungal Disease and classification Lect1 p.19-21",
        "body": [
          {
            "sub": "ลักษณะทั่วไป (p.19)",
            "body": [
              {
                "bullets": [
                  "Class: **Zygomycetes** และ **Trichomycetes**",
                  "เป็น terrestrial organisms พบหลัก ๆ ในดิน",
                  "Hyphae: **coenocytic คือ non-septate hypha**",
                  "พบได้ทุกที่ที่มีน้ำและสารอาหาร เช่น ขนมปัง ดิน กาแฟ ผัก"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างและวงจรชีวิต (p.20)",
            "body": [
              {
                "bullets": [
                  "Hyphae เป็นท่อยาวต่อเนื่อง มี **haploid nuclei** และมี specialization of function",
                  "**A. Rhizoids** เป็นโครงสร้างคล้ายราก",
                  "**B. Stolons** เชื่อมกลุ่ม rhizoids กลุ่มหนึ่งไปยังอีกกลุ่ม",
                  "Life cycle มีทั้ง **Asexual และ Sexual stages** แต่ **common molds สืบพันธุ์แบบ asexual บ่อยกว่า sexual**",
                  "เมื่อ mating types หรือ strains ต่างกันโตใกล้กัน จะสืบพันธุ์แบบ sexual ด้วย **conjugation**"
                ]
              },
              {
                "text": "คำศัพท์ **Sexual phase**: HOMOTHALLIC (self-fertile), HETEROTHALLIC (self-sterile), PROGAMETANGIUM, GAMETANGIUM, KARYOGAMY, ZYGOSPORE"
              },
              {
                "text": "คำศัพท์ **Asexual phase**: SPORANGIOPHORE, SPORANGIUM (พหูพจน์ SPORANGIA), **non-motile sporangiospores**, APLANOSPORES, COLUMELLA"
              }
            ]
          },
          {
            "sub": "Harm or benefit organism (p.20)",
            "body": [
              {
                "bullets": [
                  "**Rhizopus oryzae**: alcohol production",
                  "**R. nigricans**: ผลิต citric และ lactic acid สไลด์กำกับว่าเป็นทั้ง food spoilager และ pathogen",
                  "**R. microsporus var. rhizopodiformis**: **Rhinocerebral zygomycosis**",
                  "**Mucor sp.**: allergen, irritant, hypersensitivity pneumonitis, dermatitis",
                  "**Basidiobolus ranarum**: เป็น **normal flora ในลำไส้กบ แต่เป็น pathogen ในม้าและคน**",
                  "**Mucor amphiborum**: ทำให้เกิด skin lesions หรือ systemic disease ในกบออสเตรเลียทั้งที่เลี้ยงและจับจากธรรมชาติ"
                ]
              }
            ]
          },
          {
            "sub": "Identification (p.21)",
            "body": [
              {
                "text": "สไลด์วางรูป **Rhizopus spp., Mucor spp., Syncephalastrum sp.** ให้เทียบกัน โดยชี้โครงสร้างที่ใช้ดูคือ **sporangium, columella และ aseptate hypha** สไลด์ไม่ได้เขียนว่าสามสกุลนี้ต่างกันที่จุดใดเป็นข้อความ ต้องดูจากรูป"
              }
            ]
          }
        ]
      },
      {
        "heading": "Phylum Ascomycota",
        "source": "Fungal Disease and classification Lect1 p.21-22",
        "body": [
          {
            "sub": "ภาพรวม (p.21)",
            "body": [
              {
                "text": "สไลด์เรียกว่าเป็น **the most diverse group of fungi with 64,000 species**"
              },
              {
                "bullets": [
                  "รวม unicellular yeast, cup fungi และ truffles",
                  "Parasites of food ได้แก่ morrels และ mildews"
                ]
              }
            ]
          },
          {
            "sub": "วงจรสืบพันธุ์แบบ sexual (p.22)",
            "body": [
              {
                "bullets": [
                  "Gametangia: **Ascogonium** สไลด์ใส่เครื่องหมายคำถามว่าเป็น female และ **Antheridium** ว่าเป็น male",
                  "**Plasmogamy**: trichogyne ของ ascogonium สัมผัส antheridium แล้ว cytoplasm รวมกัน",
                  "**Karyogamy**: nuclei รวมกันจนครบ syngamy กลายเป็น **Ascus**",
                  "**Ascus**: meiosis ได้ **four meiotic cells** แล้ว mitosis ได้ asci **eight final cells**",
                  "**Ascospores งอกเป็น haploid mycelium (gametophyte)**",
                  "Dikaryotic หรือ heterokaryotic mycelium: เซลล์ที่รวมกันกลายเป็น **ascogenous hyphae** และ **ascocarp** คือปลายของ ascogenous hyphae ที่สร้างชั้น hymenium"
                ]
              }
            ]
          },
          {
            "callout": "เลข 4 แล้วเป็น 8 คือจุดที่ชอบออกสอบ meiosis ให้ 4 เซลล์ แล้ว mitosis ตามอีกหนึ่งรอบจึงได้ 8 ascospores ต่อ ascus",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Ascomycota: harmful interactions และ mycotoxin",
        "source": "Fungal Disease and classification Lect1 p.23",
        "body": [
          {
            "bullets": [
              "**Claviceps purpurea** บน rye (Secale cereale) คือ **Ergot** สร้าง **carcinogenic alkaloids** ทำให้เกิด **ergotism** อาการที่สไลด์ระบุคือ hallucinations, stomach cramp และ **Saint Anthony's Fire**",
              "Blue-green, red และ brown moulds ทำให้อาหารเน่าเสีย ตัวอย่างคือ **Penicillium italicum ทำให้ส้มเน่า**",
              "**Fusarium graminearum** มี mycotoxin เช่น **deoxynivalenol (DON)**",
              "**Aspergillus flavus** ขึ้นบนถั่วลิสงและ host อื่น สร้าง **aflatoxin ซึ่งทำลายตับและเป็น carcinogen สูง**",
              "**Candida albicans** ทำให้เกิด thrush หรือ candidiasis และ yeast allergies"
            ]
          },
          {
            "sub": "Aspergillus series ที่สไลด์ลิสต์",
            "body": [
              {
                "bullets": [
                  "As. flavus",
                  "As. fumigatus",
                  "As. terreus",
                  "As. niger"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ascomycota: การแยก Aspergillus และสกุลใกล้เคียง",
        "source": "Fungal Disease and classification Lect1 p.24",
        "body": [
          {
            "text": "สไลด์เทียบ **A. fumigatus** กับ **A. flavus** โดยระบุจุดที่ใช้ดูสามอย่าง"
          },
          {
            "bullets": [
              "**Biseriate หรือ uniseriate**",
              "**Surface**",
              "**Vesicle arrangement**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่า species ไหนเป็น biseriate หรือ uniseriate บอกแค่ว่าให้ใช้สามลักษณะนี้แยก",
            "kind": "flag"
          },
          {
            "sub": "สกุลอื่นในหน้าเดียวกัน",
            "body": [
              {
                "bullets": [
                  "**Penicillium spp.** สไลด์ลิสต์คำกำกับไว้สามบรรทัดคือ **Penicillium marneffei**, Antibiotic producer และ Ear rot in corn",
                  "**Paecilomyces spp.**",
                  "**Scopulariopsis spp.**"
                ]
              },
              {
                "callout": "สามบรรทัดใต้ Penicillium spp. เป็นคำกำกับรูปที่วางเรียงกัน สไลด์ไม่ได้เขียนเป็นประโยคว่า species ใดเป็นตัวผลิต antibiotic หรือ species ใดทำให้เกิด ear rot in corn",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Phylum Basidiomycota",
        "source": "Fungal Disease and classification Lect1 p.25-26",
        "body": [
          {
            "sub": "Reproduction (p.25)",
            "body": [
              {
                "bullets": [
                  "เน้นการสืบพันธุ์ด้วย reproductive structures เป็นหลัก และ **seldom reproduce asexually**",
                  "**Basidium (พหูพจน์ basidia)** เป็นโครงสร้างที่สร้าง spore แบบ sexual",
                  "**Basidiocarp**: ด้านในบุด้วย gills อยู่ในหมวดเห็ด มี stem ที่เรียก **stalk** และโครงสร้างแบนเรียก **cap**",
                  "ใต้ cap มี **rows of gills** แผ่ออกจากจุดกึ่งกลาง"
                ]
              }
            ]
          },
          {
            "sub": "Basidiomycota member for VET (p.26)",
            "body": [
              {
                "bullets": [
                  "**Malassezia spp.**",
                  "**Cryptococcus spp.**"
                ]
              },
              {
                "callout": "สองสกุลนี้คือจุดที่ผูกกับงานสัตวแพทย์โดยตรง สไลด์ในหน้านี้ไม่ได้อธิบายโรคที่ทั้งสองสกุลทำให้เกิด แต่ Cryptococcosis ปรากฏในลิสต์โรคที่ p.12 และ Feline cryptococcosis เป็นรูปเคสที่ p.16",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "บทบาทอื่นของ Basidiomycota ที่สไลด์ยกไว้ (p.26)",
            "body": [
              {
                "bullets": [
                  "**Sporobolomyces roseus** พบบ่อยบนผิวใบไม้ที่กำลังตาย และ **basidiospores เป็น respiratory allergens**",
                  "Larger fruitbodies (toadstools) ทำหน้าที่ wood decay, ย่อยสลาย leaf litter และมูลสัตว์ และเป็น mycorrhizal บนต้นไม้ในป่า",
                  "เป็นอาหาร เช่น **Agaricus bisporus** และ species แปลก ๆ อื่น",
                  "**Mycetism** สไลด์ระบุว่าอาการมีตั้งแต่ gastrointestinal disorder ไปจนถึงเสียชีวิต"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตารางสรุปสี่ division ท้ายเลกเชอร์",
        "source": "Fungal Disease and classification Lect1 p.26",
        "body": [
          {
            "text": "ตารางเทียบ Division, Species, Wall, Life Cycle, Examples และ Special Vocabulary"
          },
          {
            "bullets": [
              "**Zygomycota (Bread Mold)**: 750 species, wall = **chitin**, life cycle = **zygotic**, ตัวอย่าง = **Rhizopus**",
              "**Ascomycota (Sac Fungi)**: 64,000 species, wall = **chitin/glucan**, life cycle = sporic/dikaryotic",
              "**Basidiomycota (Club Fungi)**: 25,000 species, wall = **chitin/glucan**, life cycle = sporic/dikaryotic, ตัวอย่าง = **Agaricus, Amanita**",
              "**Deuteromycota (Imperfects)**: 17,000 species, wall = **chitin/glucan**, life cycle = **unknown**, ตัวอย่าง = **Penicillium, Aspergillus**"
            ]
          },
          {
            "sub": "Special vocabulary ที่ตารางแนบไว้แต่ละ division",
            "body": [
              {
                "bullets": [
                  "**Zygomycota**: sporangiophore, rhizoid, stolon, coenocytic hypha(e), gametangium, zygospore",
                  "**Ascomycota**: budding, ascus, conidia, ascogonium, antheridium, heterokaryon, hypha(e), ascocarp, ascospore, mycelium",
                  "**Basidiomycota**: hypha(e), dikaryotic, heterokaryon, cap (pileus), stalk (stipe), ring (annulus), cup (volva), gills (lamellae), mycelium, basidium, basidiospores",
                  "**Deuteromycota**: hypha(e), conidia, mycelium"
                ]
              }
            ]
          },
          {
            "callout": "ในช่อง Examples ของตารางนี้มีชื่อ Saccharomyces และ Cryptococcus วางคาบระหว่างคอลัมน์ Ascomycota กับ Basidiomycota จน text layer แยกไม่ออกว่าตัวใดอยู่ช่องไหน แต่หน้าเดียวกันระบุชัดว่า Cryptococcus spp. เป็น Basidiomycota member for VET",
            "kind": "flag"
          },
          {
            "text": "หน้า p.18 ในไฟล์เป็นสไลด์ที่ไม่มีข้อความเลย"
          }
        ]
      }
    ]
  },
  "microbio-1--higher-bacteria": {
    "topic": "microbio-1--higher-bacteria",
    "title": "แบคทีเรียชั้นสูง (Higher Bacteria) และ Mycetoma",
    "icon": "🍄",
    "summary": "เด็คนี้อยู่ในบล็อก Fungi แต่เนื้อหาจริงคือ higher bacteria (fungus-like bacteria) ที่ทำให้เกิด subcutaneous mycoses โดยเฉพาะ mycetoma ครอบคลุมนิยามและการแบ่งกลุ่ม mycetoma, คุณสมบัติของแบคทีเรียชั้นสูงเทียบกับ fungi และ bacteria ทั่วไป, กลุ่ม Actinobacteria, รายชื่อเชื้อก่อ eumycetoma กับ actinomycetoma, รอยโรคทางคลินิก แล้วลงรายละเอียดเชื้อทีละตัว (Nocardia, Streptomyces, Actinomyces bovis, Dermatophilus congolensis, Trueperella pyogenes) ปิดท้ายด้วยการตรวจ grains, culture differentiation และตารางแยกเชื้อ ข้อจำกัดที่ควรรู้: สไลด์ 1-3, 10, 21 และ 29-31 ไม่มีข้อความเลย (เป็นหน้าปกหรือหน้าภาพล้วน) และหลายสไลด์เป็นภาพรอยโรคที่มีแค่คำบรรยายภาพสั้น ๆ เด็คนี้ไม่ได้พูดถึงการรักษาหรือยาที่ใช้เลย",
    "sections": [
      {
        "heading": "Mycetoma คืออะไร",
        "source": "Higher Bacteria p.5",
        "body": [
          {
            "text": "สไลด์แปลคำว่า mycetoma ตรงตัวว่า **ก้อนของเส้นใย**"
          },
          {
            "text": "**Mycetoma is a chronic subcutaneous infection caused by actinomycetes or fungi** คือติดเชื้อเรื้อรังใต้ผิวหนัง เกิดได้จากทั้ง actinomycetes และเชื้อรา"
          },
          {
            "bullets": [
              "สาเหตุมาได้จาก true fungi หรือ higher bacteria",
              "Chronic localized lesions",
              "Tropical zone"
            ]
          },
          {
            "callout": "ตัวช่วยจำบนสไลด์: ร = ร้อน เรื้อรัง ระยาง ซึ่งเข้ากับคำว่า tropical zone และ chronic localized lesions ที่อยู่บนสไลด์เดียวกัน แต่สไลด์ไม่ได้ขยายความคำว่า ระยาง ไว้",
            "kind": "tip"
          },
          {
            "text": "สไลด์เขียนคำว่า Appendix part กำกับไว้ด้วย แต่สไลด์ไม่ได้บอกว่าหมายถึงส่วนไหน"
          }
        ]
      },
      {
        "heading": "Mycetoma Family แบ่งเป็น 3 กลุ่ม",
        "source": "Higher Bacteria p.6",
        "body": [
          {
            "bullets": [
              "**Eumycetoma**",
              "**Actinomycetoma**",
              "**Pseudomycetoma in cat : atypical dermatophytosis**"
            ]
          },
          {
            "text": "สไลด์ให้แค่ชื่อกลุ่ม ไม่ได้อธิบายเกณฑ์แบ่งในหน้านี้"
          }
        ]
      },
      {
        "heading": "แบคทีเรียชั้นสูง (Fungus-like bacteria, higher bacteria)",
        "source": "Higher Bacteria p.7",
        "body": [
          {
            "bullets": [
              "**Prokaryote**",
              "**Filament, fine hyphae < 1 um**",
              "**Gram positive** และ **without chitin**",
              "**Sensitive to antibacterial antibiotics**",
              "**Lack of mitochondria and nuclear membrane**"
            ]
          },
          {
            "callout": "จุดที่ทำให้มันไม่ใช่เชื้อรา แม้จะมี hyphae คือ เป็น prokaryote ไม่มี chitin ไม่มี mitochondria และ nuclear membrane และตอบสนองต่อ antibacterial antibiotics",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "องค์ประกอบผนังเซลล์ เทียบ 4 กลุ่ม",
        "source": "Higher Bacteria p.8",
        "body": [
          {
            "text": "สไลด์เป็นภาพเปรียบเทียบผนังเซลล์ 4 คอลัมน์"
          },
          {
            "bullets": [
              "**Fungi: Mannanoprotein, Glucan, Chitin**",
              "**Gram – : Peptidoglycan + Lipopolysaccharide**",
              "**Gram + : Peptidoglycan +++, Teichoic acid**",
              "**Higher Bacteria: Peptidoglycan + Arabinogalactan + Mycolic acid**"
            ]
          },
          {
            "callout": "Higher bacteria มี mycolic acid และ arabinogalactan ในผนังเซลล์ ซึ่งเป็นคนละชุดกับ chitin/glucan ของ fungi",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "The Actinobacteria",
        "source": "Higher Bacteria p.9",
        "body": [
          {
            "bullets": [
              "Procaryote",
              "Gram-positive",
              "**Branching filaments of less than 1 μm in diameter**"
            ]
          },
          {
            "sub": "The main animal pathogens (genera)",
            "body": [
              {
                "bullets": [
                  "Actinomyces",
                  "Actinobaculum",
                  "Trueperella",
                  "Mycobacterium",
                  "Corynebacterium",
                  "Rhodococcus",
                  "Dermatophilus",
                  "Nocardia"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เชื้อก่อ Mycetoma: Eumycetoma เทียบ Actinomycetoma",
        "source": "Higher Bacteria p.11",
        "body": [
          {
            "text": "สไลด์ใช้ชื่อไทยว่า โรคฝีรั่ว และย้ำนิยามเดิมว่า mycetoma is a chronic subcutaneous infection caused by actinomycetes or fungi"
          },
          {
            "sub": "Eumycetoma (เชื้อรา)",
            "body": [
              {
                "bullets": [
                  "Pseudallescheria boydii",
                  "Exophiala jeanselmei",
                  "Curvularia geniculata",
                  "Madurella grisea",
                  "Madurella mycetomatis",
                  "Fusarium moniliforme"
                ]
              }
            ]
          },
          {
            "sub": "Actinomycetoma (แบคทีเรียชั้นสูง)",
            "body": [
              {
                "bullets": [
                  "Nocardia brasiliensis",
                  "Nocardia caviae",
                  "Nocardia asteroides",
                  "Streptomyces somaliensis",
                  "Trueperella pyogenes",
                  "Dermatophilus congolensis",
                  "Actinomyces bovis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Actinomycotic mycetoma",
        "source": "Higher Bacteria p.12",
        "body": [
          {
            "text": "สไลด์ระบุ genus ที่ทำให้เกิด actinomycotic mycetoma ไว้ 4 กลุ่ม"
          },
          {
            "bullets": [
              "**Nocardia sp.**",
              "**Actinomadura sp.**",
              "**Streptomyces sp.**",
              "**Actinomyces sp.**"
            ]
          }
        ]
      },
      {
        "heading": "รอยโรคทางคลินิกของ Mycetoma",
        "source": "Higher Bacteria p.13",
        "body": [
          {
            "text": "การติดเชื้อ: **เชื้อจากธรรมชาติเข้าทางบาดแผลที่ผิวหนัง**"
          },
          {
            "bullets": [
              "**การบวม (Tumefaction)**",
              "**Draining sinus tracts**",
              "**Grains (granules)** โดยสไลด์แปลว่า ตะกอน หรือ ก้อนโคโลนี",
              "**No fever, no lymph node enlargement**"
            ]
          },
          {
            "callout": "ไตรลักษณ์ที่ควรจำคู่กัน คือ บวม + รูระบายหนอง + grains และรอยโรคนี้ไม่มีไข้และต่อมน้ำเหลืองไม่โต",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Nocardia sp.",
        "source": "Higher Bacteria p.14",
        "body": [
          {
            "bullets": [
              "**Aerobe, gram +ve branching hyphae**",
              "**Partially positive acid-fast**",
              "Fragmentation rods, coccoid",
              "โคโลนีแห้ง ขรุขระ สีส้ม เหลือง ขาว",
              "**Grains สีอ่อน (ขาว ถึง เหลือง)**"
            ]
          }
        ]
      },
      {
        "heading": "เคสรายงานของ Nocardia ในแมว",
        "source": "Higher Bacteria p.15-16",
        "body": [
          {
            "text": "สไลด์สองหน้านี้เป็นภาพเคสพร้อมคำบรรยายภาพ ไม่มีเนื้อหาบรรยายเพิ่ม"
          },
          {
            "bullets": [
              "Cutaneous pyogranulomas associated with **Nocardia jiangxiensis** in a cat",
              "Multiple dermal ulcers in a case of **feline nocardial mycetoma**",
              "Uncommon **mandibular osteomyelitis** in a cat caused by **Nocardia africana**"
            ]
          }
        ]
      },
      {
        "heading": "Streptomyces sp.",
        "source": "Higher Bacteria p.17",
        "body": [
          {
            "bullets": [
              "**Aerobe, gram +ve branching hyphae**",
              "**Negative acid-fast**",
              "Well-developed vegetative hyphae",
              "เมื่อแก่สร้าง **arthrospore** โคโลนีแห้งสีครีม น้ำตาล เหลือง",
              "**Grains แข็ง (< 2 มม.) สีเหลือง น้ำตาล**"
            ]
          },
          {
            "sub": "ชนิดและรอยโรคที่สไลด์ยกมา",
            "body": [
              {
                "bullets": [
                  "**S. cinnamoneus caused of feline orbital actinomycosis**",
                  "S. cyaneus",
                  "(a) Marked periorbital swelling, exophthalmos and prolapse of the nictitating membrane (OD) และ (b) oral cavity swelling in the right pterygopalatine fossa",
                  "Multinodular, ulcerated lesions at elbow and thorax และ subcutaneous tissues บริเวณนั้นมี brown purulent material with multiple black flecks"
                ]
              },
              {
                "text": "สไลด์ไม่ได้บอกชัดว่าคำบรรยายภาพชุด elbow และ thorax เป็นของเชื้อชนิดใดในสองชนิดนี้"
              }
            ]
          }
        ]
      },
      {
        "heading": "Actinomyces bovis",
        "source": "Higher Bacteria p.18",
        "body": [
          {
            "bullets": [
              "**Grow slowly จึงเป็น chronic infection**",
              "**Facultative or strict anaerobic Gram-positive bacilli**",
              "เรียกว่า **\"ray fungus\"**",
              "**No endospore**",
              "**Negative with acid-fast**",
              "**Morphologically similar to Nocardia**",
              "Granulation tissue infiltrated by macrophages and plasma cells",
              "โรคที่รู้จักกันคือ **Lumpy Jaw**"
            ]
          },
          {
            "text": "สไลด์มีภาพ direct microscopic finding ประกอบ แต่ไม่มีคำบรรยายภาพเพิ่ม"
          }
        ]
      },
      {
        "heading": "Actinomyces: Epidemiology and Clinical Syndromes",
        "source": "Higher Bacteria p.19",
        "body": [
          {
            "bullets": [
              "**Normal flora of the upper respiratory, gastrointestinal and female genital tracts**",
              "**Low virulence potential, only causing opportunistic disease**",
              "**Acute infection: pyogenic form**",
              "**Chronic infection: pyogranulomatous form**",
              "**A. israelii is the most common cause of human endocarditis**"
            ]
          }
        ]
      },
      {
        "heading": "Disease characteristics ของ Actinomyces",
        "source": "Higher Bacteria p.20",
        "body": [
          {
            "bullets": [
              "**Macroscopic masses of filamentous bacterial cells ที่ถูก \"cemented\" together by calcium phosphate**",
              "**Sulfur granules (yellow or orange appearance)**",
              "Pyogranulomatous osteomyelitis"
            ]
          }
        ]
      },
      {
        "heading": "Dermatophilus congolensis",
        "source": "Higher Bacteria p.22",
        "body": [
          {
            "bullets": [
              "**Aerobic and capnophillic bacteria**",
              "**สัตว์ที่พบ: cattle, sheep, goats and horses**",
              "ชื่อโรค **Mud fever หรือ Rain scald**",
              "**Growth on sheep blood-enriched agarose medium at 37°C ใน 5-10% CO2**"
            ]
          },
          {
            "sub": "Morphologies",
            "body": [
              {
                "bullets": [
                  "**Filamentous hyphae (1-5 µm)**",
                  "**Motile zoospores (0.6-1 µm)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "รอยโรคของ Dermatophilus",
        "source": "Higher Bacteria p.23",
        "body": [
          {
            "bullets": [
              "**Thick crusts which come away easily with a tuft of hair**",
              "**Depressed area with bleeding points from capillaries**",
              "**Rainy season: รอยโรคที่หลัง**",
              "**Dry season: รอยโรคที่ปาก หัว และ แขนขา**",
              "**Paintbrush lesion**"
            ]
          },
          {
            "callout": "ตำแหน่งรอยโรคเปลี่ยนตามฤดู หลังในหน้าฝน ปาก หัว แขนขาในหน้าแล้ง เป็นจุดที่ออกสอบง่าย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Trueperella pyogenes",
        "source": "Higher Bacteria p.24",
        "body": [
          {
            "text": "**เดิมชื่อ Actinomyces pyogenes**"
          },
          {
            "bullets": [
              "**Non-motile**",
              "**Facultatively anaerobic, capnophillic**",
              "Cells 0.5 by 2.0 μm",
              "**Pleomorphic or coccoid rods เรียงตัวเดี่ยว เป็น short chains หรือ V-shaped pairs**",
              "**Biota: skin and mucous membranes of the upper respiratory, gastrointestinal, or urogenital tracts of animals**",
              "**Opportunistic pathogens: metritis, mastitis, pneumonia, and abscesses**",
              "**The most common cause of \"summer mastitis\" in cattle และ pyometra in dogs**"
            ]
          }
        ]
      },
      {
        "heading": "Trueperella pyogenes ในสุกร",
        "source": "Higher Bacteria p.25",
        "body": [
          {
            "text": "สไลด์เป็นภาพ 2 ภาพพร้อมคำบรรยาย"
          },
          {
            "bullets": [
              "A: **Inflammatory and degenerative lesions of the mammary gland**",
              "B: **Extensive swelling of the tarsal and knee joints in a grow-finish pig**"
            ]
          }
        ]
      },
      {
        "heading": "การตรวจ Grains ทางห้องปฏิบัติการ",
        "source": "Higher Bacteria p.26",
        "body": [
          {
            "text": "สไลด์ระบุวิธีดู grains ด้วย **KOH** และ **Gram**"
          },
          {
            "bullets": [
              "Grains คือ **microcolonies ที่เป็น hyphae อัดตัวกันแน่น**",
              "**ขนาด 300 um ถึง 5 mm**",
              "มีรูปร่างต่าง ๆ สีขาว เหลือง น้ำตาล ดำ แดง"
            ]
          },
          {
            "sub": "แยกด้วยขนาดเส้นใย",
            "body": [
              {
                "bullets": [
                  "**Mold: > 1 um**",
                  "**Fungus-like bacteria: < 1 um** เช่น Actinomyces sp. และ Actinomadura sp."
                ]
              }
            ]
          },
          {
            "callout": "ขนาดเส้นใยคือตัวตัดสินระหว่างเชื้อรากับแบคทีเรียชั้นสูงบนสไลด์นี้ เกิน 1 um คือ mold ต่ำกว่า 1 um คือ fungus-like bacteria",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Culture Differentiation จาก grain tissue",
        "source": "Higher Bacteria p.27",
        "body": [
          {
            "text": "สไลด์แตกแนวทางเพาะเชื้อจาก **grain tissue** ออกเป็น 2 ทาง"
          },
          {
            "sub": "Fungus-like bacteria",
            "body": [
              {
                "bullets": [
                  "**Blood agar, brain heart infusion agar at 37°C**",
                  "Morphological observation",
                  "**Aerobic / Facultative anaerobic / Obligate anaerobic for A. israelii**",
                  "**Acid-fast staining**",
                  "Biochemical properties"
                ]
              }
            ]
          },
          {
            "sub": "Molds",
            "body": [
              {
                "bullets": [
                  "**SDA (without cycloheximide) at 25°C**",
                  "Morphological classification"
                ]
              }
            ]
          },
          {
            "callout": "อุณหภูมิและอาหารเลี้ยงเชื้อต่างกันชัด 37°C บน blood agar หรือ BHI สำหรับแบคทีเรียชั้นสูง เทียบกับ 25°C บน SDA ที่ไม่ใส่ cycloheximide สำหรับเชื้อรา",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Key Features for Differentiation",
        "source": "Higher Bacteria p.28",
        "body": [
          {
            "sub": "Acid fast staining",
            "body": [
              {
                "bullets": [
                  "**Actinomyces (-)**",
                  "**Streptomyces (-)**",
                  "**Nocardia (+) partially**",
                  "**Mycobacterium (++)**"
                ]
              }
            ]
          },
          {
            "sub": "Aerobic growth",
            "body": [
              {
                "bullets": [
                  "**Actinomyces (-)**",
                  "**Streptomyces (+)**",
                  "**Nocardia (+)**"
                ]
              }
            ]
          },
          {
            "sub": "Produce granule grains",
            "body": [
              {
                "bullets": [
                  "**Actinomyces (+++)**",
                  "**Streptomyces (+++)**",
                  "**Nocardia (+)**"
                ]
              }
            ]
          },
          {
            "callout": "เชิงอรรถบนสไลด์: The spores of some Streptomyces spp. may be acid fast",
            "kind": "warn"
          },
          {
            "text": "สไลด์ไม่ได้ให้ข้อมูล aerobic growth และ produce granule grains ของ Mycobacterium ไว้ในตารางนี้"
          }
        ]
      }
    ]
  },
  "microbio-1--immune-responses-to-viral-infections": {
    "topic": "microbio-1--immune-responses-to-viral-infections",
    "title": "การตอบสนองทางภูมิคุ้มกันต่อการติดเชื้อไวรัส (Immune Responses to viral infections)",
    "icon": "🧬",
    "lecturer": "Navapon Techakriengkrai",
    "summary": "เด็คนี้ไล่ระบบป้องกันของ host ต่อไวรัสเป็นชั้น ๆ ตามแกนเวลาหลังได้รับเชื้อ เริ่มจากเงื่อนไขที่ทำให้ไวรัสติดเชื้อได้สำเร็จและ viral tropism แล้วต่อด้วย physical/anatomical barriers, intrinsic cellular defenses (APOBEC, TRIM5α, tetherin, apoptosis), innate immunity (PAMPs-PRRs, interferons, sentinel cells), adaptive immunity (HMI ของ B lymphocyte และ CMI ของ CD4+/CD8+ T lymphocyte), ตารางเทียบ innate versus adaptive และปิดท้ายด้วย immune evasion ของไวรัส หมายเหตุความซื่อสัตย์: สไลด์หลายหน้า (p.9, p.11, p.12, p.13, p.16 และบางส่วนของ p.14) เป็นรูปภาพพร้อมเครดิตอ้างอิงเท่านั้น แทบไม่มีข้อความ จึงสรุปได้เฉพาะหัวเรื่องกับคำที่พิมพ์บนสไลด์ ส่วนกลไกที่รูปอธิบายนั้นสไลด์ไม่ได้เขียนเป็นตัวอักษรไว้ และหน้าสุดท้ายเป็นรายการหนังสืออ่านเพิ่มเติม",
    "sections": [
      {
        "heading": "อะไรทำให้การติดเชื้อไวรัสสำเร็จ และ viral tropism",
        "source": "Immune Responses to viral infections p.2",
        "body": [
          {
            "text": "สไลด์เปิดด้วยเงื่อนไขของ **a successful viral infection** ว่าต้องมีทั้งปริมาณไวรัสที่พอ และเซลล์เป้าหมายที่ \"ใช่\""
          },
          {
            "bullets": [
              "**sufficient number of infectious virion** จำนวน virion ที่ติดเชื้อได้ต้องมากพอ",
              "**target cell availability** ต้องมีเซลล์เป้าหมายให้เข้า",
              "**susceptible** = เซลล์มี receptor สำหรับ entry",
              "**permissive** = เซลล์สนับสนุนให้ไวรัสทำ replication ได้ครบวงจร"
            ]
          },
          {
            "text": "ทั้งหมดนี้สไลด์สรุปด้วยคำเดียวว่า **viral tropism**"
          },
          {
            "callout": "จำแยกให้ชัด susceptible คือเข้าเซลล์ได้ (มี receptor) ส่วน permissive คือ replicate ได้จนจบ สองคำนี้ไม่เหมือนกัน และสไลด์ไม่ได้ยกตัวอย่างไวรัสหรือ receptor ตัวใดประกอบ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ชั้นการป้องกันเรียงตามเวลาหลังได้รับเชื้อ",
        "source": "Immune Responses to viral infections p.3",
        "body": [
          {
            "text": "สไลด์ series of defenses against invaders วางแกน **time post-exposure** แล้วเรียงด่านป้องกันสี่ชั้นตามช่วงเวลาที่ออกฤทธิ์"
          },
          {
            "bullets": [
              "**continuous** = physical/anatomical barriers ได้แก่ tear/saliva, skin, mucus, acid/alkaline",
              "**immediate** = intrinsic ได้แก่ genome editing, blocking, apoptosis",
              "**minutes/hours** = innate immunity ได้แก่ interferons และ sentinel cells",
              "**days** = adaptive immunity ได้แก่ humoral และ cell mediated"
            ]
          },
          {
            "callout": "หน้านี้คือโครงของเด็คทั้งอัน สไลด์หน้าถัด ๆ ไปคือการขยายทีละชั้นตามลำดับนี้เป๊ะ ๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "physical/anatomical barriers",
        "source": "Immune Responses to viral infections p.4",
        "body": [
          {
            "text": "ด่านแรกที่ทำงานตลอดเวลา สไลด์แจกแจงเป็น 4 กลุ่ม"
          },
          {
            "sub": "tear/saliva",
            "body": [
              {
                "text": "มี **antibodies** และ **lysozyme**"
              }
            ]
          },
          {
            "sub": "skin",
            "body": [
              {
                "text": "อาศัย **dryness, acidity และ normal bacterial flora**"
              }
            ]
          },
          {
            "sub": "mucus",
            "body": [
              {
                "bullets": [
                  "**mucociliary blanket** ใน respiratory tract",
                  "intestinal/urogenital mucus"
                ]
              }
            ]
          },
          {
            "sub": "acid/alkaline ของทางเดินอาหาร",
            "body": [
              {
                "text": "**acidic stomach** และ **alkalinic intestine**"
              }
            ]
          }
        ]
      },
      {
        "heading": "intrinsic cellular defenses",
        "source": "Immune Responses to viral infections p.5",
        "body": [
          {
            "text": "สไลด์ให้นิยามไว้ตรง ๆ ว่า **pre-existing คือมีอยู่ในเซลล์เสมอ ออกฤทธิ์ทันทีและโดยตรง** ไม่ต้องรอถูกกระตุ้น"
          },
          {
            "sub": "viral genome editing",
            "body": [
              {
                "text": "**APOBEC (apolipoprotein B mRNA editing catalytic polypeptide)** ทำ **cytidine deamination** ทำให้เกิด **G-to-A hypermutation**"
              }
            ]
          },
          {
            "sub": "blocking viral replication cycle",
            "body": [
              {
                "text": "**TRIM5α และ tetherin** เป็นต้น สไลด์เขียนต่อท้ายว่า etc. แต่ไม่ได้ระบุตัวอื่นเพิ่ม"
              }
            ]
          },
          {
            "sub": "apoptosis",
            "body": [
              {
                "text": "**programmed cell death**"
              }
            ]
          }
        ]
      },
      {
        "heading": "รูปประกอบ intrinsic defenses ระบุจุดที่ถูกบล็อก",
        "source": "Immune Responses to viral infections p.6",
        "body": [
          {
            "text": "หน้านี้เป็นรูปพร้อมคำกำกับสั้น ๆ สิ่งที่สไลด์เขียนไว้จริงคือ"
          },
          {
            "bullets": [
              "**APOBEC3G หรือ 3F** ทำ cytidine deamination, G-to-A hypermutation",
              "**TRIM5 block viral uncoating**",
              "**Tetherin block releasing**"
            ]
          },
          {
            "callout": "สอบมักถามว่าตัวไหนบล็อกขั้นตอนไหน จำคู่ TRIM5 กับ uncoating และ tetherin กับ releasing ส่วนรายละเอียดกลไกระดับโมเลกุลสไลด์ไม่ได้บอก เพราะเป็นรูปล้วน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "innate immunity แยกตัวเองจากสิ่งแปลกปลอมด้วย pattern",
        "source": "Immune Responses to viral infections p.7",
        "body": [
          {
            "text": "สไลด์นิยาม innate immunity ว่า **induced by infection** คือถูกเหนี่ยวนำเมื่อมีการติดเชื้อ ต่างจาก intrinsic ที่มีอยู่ก่อนแล้ว"
          },
          {
            "bullets": [
              "ทำงานโดย **distinguish patterns (self/non-self)**",
              "ฝั่งเชื้อคือ **Pathogen-Associated Molecular Patterns (PAMPs)**",
              "ฝั่ง host คือ **Patterns-Recognition-Receptor (PRRs)**"
            ]
          },
          {
            "text": "สไลด์ระบุว่า innate immunity มี **two major components** คือ **interferons** และ **sentinel cells** ซึ่งเป็นหัวข้อของสองสไลด์ถัดไป"
          }
        ]
      },
      {
        "heading": "interferons (IFNs)",
        "source": "Immune Responses to viral infections p.8",
        "body": [
          {
            "sub": "PAMPs-PRRs ที่สไลด์ระบุชื่อ",
            "body": [
              {
                "bullets": [
                  "**endosomal TLRs (toll like receptors)**",
                  "**cytoplasmic sensor RIG-I (retinoid inducible gene-I)**"
                ]
              }
            ]
          },
          {
            "sub": "คุณสมบัติของ IFNs ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "**secreted by both immune and non-immune cells** ไม่ได้จำกัดเฉพาะเซลล์ภูมิคุ้มกัน",
                  "**act on both infected and uninfected cell** ออกฤทธิ์ทั้งเซลล์ที่ติดเชื้อแล้วและยังไม่ติด",
                  "เหนี่ยวนำ **interferon stimulated genes (ISGs)**"
                ]
              }
            ]
          },
          {
            "text": "ผลลัพธ์ที่สไลด์เน้นเป็นวลีเดี่ยวคือ **antiviral state**"
          },
          {
            "callout": "จุดที่ทำให้ IFN สำคัญคือมันเตือนเซลล์ข้างเคียงที่ยังไม่ติดเชื้อด้วย ไม่ใช่แค่เซลล์ที่โดนแล้ว สไลด์ไม่ได้แจกแจงว่ามี IFN กี่ type หรือ ISG ตัวใดบ้าง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หน้ารูป interferons",
        "source": "Immune Responses to viral infections p.9",
        "body": [
          {
            "text": "หน้านี้มีเพียงหัวเรื่อง interferons (IFNs) กับรูปและเครดิตอ้างอิงสองแหล่ง **ไม่มีข้อความอธิบายบนสไลด์** จึงไม่มีข้อเท็จจริงใหม่ให้จดนอกจากที่อยู่ใน p.8"
          }
        ]
      },
      {
        "heading": "sentinel cells",
        "source": "Immune Responses to viral infections p.10",
        "body": [
          {
            "text": "สไลด์บรรยายบทบาทว่า **patrolling and constantly sampling for foreign invaders** คือลาดตระเวนและสุ่มตรวจสิ่งแปลกปลอมตลอดเวลา แล้วแบ่งหน้าที่เป็น 3 อย่าง"
          },
          {
            "bullets": [
              "**kill infected cell** โดย **natural killer (NK) cell**",
              "**phagocyte dead cell** โดย **macrophage**",
              "**communicate with adaptive immunity** โดย **dendritic cell (DC)** และ **macrophage** ซึ่งสไลด์เรียกรวมว่า **antigen presenting cell**"
            ]
          },
          {
            "callout": "macrophage ถูกนับสองหน้าที่ในสไลด์เดียว ทั้งกิน dead cell และเป็น antigen presenting cell",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "to kill or not to kill",
        "source": "Immune Responses to viral infections p.11",
        "body": [
          {
            "text": "หน้านี้เป็นรูปพร้อมหัวเรื่องคำถาม to kill or not to kill? คำที่พิมพ์บนสไลด์มีเพียง **perforin, granzyme** กับเครดิตอ้างอิง"
          },
          {
            "text": "เกณฑ์การตัดสินใจว่า NK cell จะฆ่าหรือไม่ฆ่าเซลล์เป้าหมาย **สไลด์ไม่ได้บอก** เป็นตัวอักษร ต้องดูรูปในสไลด์จริงหรือถามในคาบ"
          }
        ]
      },
      {
        "heading": "การสื่อสารกับ adaptive immunity",
        "source": "Immune Responses to viral infections p.12",
        "body": [
          {
            "text": "หัวเรื่อง communicating with adaptive immunity คำบนสไลด์มีแค่ **ligands** และ **cytokines** ที่เหลือเป็นรูปกับเครดิต"
          },
          {
            "text": "รายละเอียดว่า ligand คู่ไหนจับกับ receptor ตัวใด หรือ cytokine ตัวใดทำอะไร **สไลด์ไม่ได้บอก**"
          }
        ]
      },
      {
        "heading": "Major Histocompatibility Complex (MHC)",
        "source": "Immune Responses to viral infections p.13",
        "body": [
          {
            "text": "หน้านี้มีเพียงหัวเรื่อง **Major Histocompatibility Complex (MHC)** กับรูปและเครดิต **ไม่มีข้อความอธิบาย** ความแตกต่างระหว่าง class I กับ class II ไม่ได้เขียนไว้ที่หน้านี้ แต่ไปโผล่เป็นคู่กับ CD8+ และ CD4+ ที่ p.19 และ p.20"
          }
        ]
      },
      {
        "heading": "epitope และ peptide",
        "source": "Immune Responses to viral infections p.14",
        "body": [
          {
            "text": "สไลด์ยกคำสำคัญไว้ 4 คำคู่กับรูป ได้แก่ **epitope/peptide**, **envelope glycoprotein**, **linear epitope** และ **conformational epitope**"
          },
          {
            "callout": "สไลด์ตั้งคำคู่ linear epitope กับ conformational epitope ไว้ให้เทียบกัน แต่ไม่ได้เขียนนิยามหรือความต่างของสองแบบนี้เป็นตัวอักษร สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "adaptive immunity แบ่งเป็นสองสาย",
        "source": "Immune Responses to viral infections p.15",
        "body": [
          {
            "bullets": [
              "**humoral immunity (HMI)** อาศัย **B lymphocyte**",
              "**cell mediated immunity (CMI)** อาศัย **T lymphocyte** ซึ่งจำแนกด้วย **Cluster of Differentiation (CD)**",
              "**CD4+ T helper lymphocyte**",
              "**CD8+ cytotoxic T lymphocyte**"
            ]
          },
          {
            "text": "โครงนี้คือแกนของสไลด์ p.17 ถึง p.20 ที่ขยายทีละเซลล์"
          }
        ]
      },
      {
        "heading": "phases of adaptive immune responses",
        "source": "Immune Responses to viral infections p.16",
        "body": [
          {
            "text": "หน้านี้มีเพียงหัวเรื่อง phases of adaptive immune responses กับรูปและเครดิตหนังสือ **ไม่มีข้อความบนสไลด์** ว่าแต่ละ phase ชื่ออะไรหรือกินเวลาเท่าไร สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "humoral immunity (HMI)",
        "source": "Immune Responses to viral infections p.17",
        "body": [
          {
            "bullets": [
              "**B lymphocyte** มี **B cell receptor**",
              "**plasma cell**",
              "**antibody (Ab)**"
            ]
          },
          {
            "sub": "หน้าที่ของ antibody ที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "**neutralisation**",
                  "**opsonisation**"
                ]
              }
            ]
          },
          {
            "text": "รูปโครงสร้าง antibody บนสไลด์กำกับสองส่วนคือ **Fab** และ **Fc**"
          },
          {
            "callout": "สไลด์บอกแค่ชื่อกลไก neutralisation กับ opsonisation ไม่ได้อธิบายว่าแต่ละกลไกทำงานอย่างไร หรือส่วน Fab กับ Fc ทำหน้าที่อะไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "five classes of antibodies",
        "source": "Immune Responses to viral infections p.18",
        "body": [
          {
            "text": "หัวเรื่องคือ **five classes of antibodies** และคำที่พิมพ์บนสไลด์อีกสองคำคือ **affinity maturation** กับ **heavy chain isotype (class) switching**"
          },
          {
            "callout": "ชื่อ antibody ทั้งห้า class ไม่ปรากฏเป็นข้อความบนสไลด์ อยู่ในรูป สไลด์ไม่ได้บอก แต่คำที่ต้องจำจากหน้านี้คือการเปลี่ยน class เกิดที่ **heavy chain** และเรียกว่า isotype switching ส่วนการเพิ่มความแรงในการจับคือ affinity maturation",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "CD8+ cytotoxic T lymphocyte (CTL)",
        "source": "Immune Responses to viral infections p.19",
        "body": [
          {
            "bullets": [
              "จดจำผ่าน **T cell receptor (TCR)**",
              "รู้จำ **peptide-MHC class I**",
              "หน้าที่คือ **killing of infected cells (apoptosis)**"
            ]
          },
          {
            "sub": "กลไกการฆ่าที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "**perforin/granzyme**",
                  "**Fas Ligand/Fas receptors**"
                ]
              }
            ]
          },
          {
            "callout": "คู่ที่ต้องจำคือ **CD8+ กับ MHC class I** และผลลัพธ์คือ apoptosis ของเซลล์ที่ติดเชื้อ ไม่ใช่การฆ่าไวรัสโดยตรง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "CD4+ T helper lymphocyte (Th)",
        "source": "Immune Responses to viral infections p.20",
        "body": [
          {
            "bullets": [
              "จดจำผ่าน **T cell receptor (TCR)** เช่นกัน",
              "รู้จำ **peptide-MHC class II**",
              "บทบาทคือ **orchestrate immune responses**"
            ]
          },
          {
            "sub": "เครื่องมือที่ Th ใช้ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "**cytokines** ได้แก่ **interferon (IFN)** และ **interleukin (IL)**",
                  "**ligands/receptors**"
                ]
              }
            ]
          },
          {
            "callout": "เทียบกับ p.19 ให้ชัด CD8+ คู่กับ MHC class I และลงมือฆ่า ส่วน CD4+ คู่กับ MHC class II และทำหน้าที่กำกับวงออร์เคสตราของภูมิคุ้มกัน สไลด์ไม่ได้แบ่ง Th ออกเป็น subset ย่อยเช่น Th1 หรือ Th2",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "innate versus adaptive immunity ตารางเปรียบเทียบ",
        "source": "Immune Responses to viral infections p.21",
        "body": [
          {
            "text": "สไลด์เทียบ 6 หัวข้อ ได้แก่ responses, diversity, specificity, memory, improvement และ location"
          },
          {
            "sub": "innate immunity",
            "body": [
              {
                "bullets": [
                  "responses **faster (minutes to hours)**",
                  "diversity **limited**",
                  "specificity เป็นแบบ **pattern recognition**",
                  "memory **absent**",
                  "improvement **none**",
                  "location **patrolling site of infection**"
                ]
              }
            ]
          },
          {
            "sub": "adaptive immunity",
            "body": [
              {
                "bullets": [
                  "responses **slower (weeks to months)**",
                  "diversity **high**",
                  "specificity **tailored to antigen, epitope**",
                  "memory **present**",
                  "improvement **yes**",
                  "location **mostly in immune organs**"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขเวลาในเด็คนี้ไม่ตรงกันสองหน้า p.3 วางแกนเวลาของ adaptive ไว้ที่ days แต่ตาราง p.21 เขียนว่า slower (weeks to months) ถ้าข้อสอบถามเวลาให้อิงหน้าที่โจทย์อ้างถึง และตอบตามที่อาจารย์บรรยาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "immune evasion ของไวรัส",
        "source": "Immune Responses to viral infections p.22",
        "body": [
          {
            "sub": "viral protein ที่ต้าน host immune responses",
            "body": [
              {
                "bullets": [
                  "**PRRSV N could induce Treg differentiation**",
                  "**SARS-CoV-2 interfere with type 1 IFN responses**"
                ]
              }
            ]
          },
          {
            "sub": "hidden epitopes",
            "body": [
              {
                "text": "ตัวอย่างที่สไลด์ยกคือ **heavily glycosylated envelope of HIV**"
              }
            ]
          },
          {
            "sub": "escape mutation",
            "body": [
              {
                "text": "สไลด์อธิบายสั้น ๆ ว่า **changing target** คือเปลี่ยนเป้าที่ภูมิคุ้มกันเล็งไว้"
              }
            ]
          },
          {
            "callout": "สองตัวอย่างแรกเป็นชื่อไวรัสที่ต้องจำคู่กับกลไก PRRSV N กับ Treg และ SARS-CoV-2 กับ type 1 IFN ส่วนรายละเอียดว่า N protein เหนี่ยวนำ Treg ด้วยวิธีใด สไลด์ไม่ได้บอก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "further readings ที่อาจารย์แนะนำ",
        "source": "Immune Responses to viral infections p.23",
        "body": [
          {
            "bullets": [
              "Cellular and Molecular Immunology, 9th edition, Saunders",
              "Principles of Virology, 4th edition, ASM press",
              "Viral Pathogenesis and Immunity, 1st edition, Lippincott Williams & Wilkins"
            ]
          },
          {
            "text": "หน้านี้เป็นหน้าอ้างอิงล้วน ไม่มีเนื้อหาวิชาการเพิ่ม"
          }
        ]
      }
    ]
  },
  "microbio-1--lab-pcr-other-molecular-techniques": {
    "topic": "microbio-1--lab-pcr-other-molecular-techniques",
    "title": "Lab: PCR และเทคนิคทาง molecular อื่น ๆ สำหรับตรวจ viral nucleic acid",
    "icon": "🧬",
    "lecturer": "Aunyaratana Thontiravong",
    "summary": "เด็คนี้เป็น lab lecture เรื่องการตรวจ viral nucleic acid โดยตรง ไล่จากภาพรวมการวินิจฉัย virus ในห้องแล็บ ข้อดีข้อเสียของการตรวจ nucleic acid แล้วลงราย 3 กลุ่มเทคนิค คือ nucleic acid hybridization, nucleic acid amplification (PCR, RT-PCR, real-time PCR) และ DNA sequencing ปิดท้ายด้วยการใช้ข้อมูลลำดับพันธุกรรมมาจำแนก virus (genotype vs serotype, HPAI H5 clade และ IBV genotype) มี 2 สไลด์ที่เป็นรูปล้วนไม่มีข้อความ คือสไลด์ gel electrophoresis (p.14) และผล automated DNA sequencing (p.23) นอกจากนี้สไลด์ตารางข้อดีข้อเสีย (p.5) ข้อความถูกแบ่งเป็นสองคอลัมน์จนอ่านต่อเนื่องยาก โน้ตนี้จึงเรียงกลับตามที่สไลด์เขียนเท่านั้น",
    "sections": [
      {
        "heading": "Outline ของเด็ค",
        "source": "Lab PCR other molecular techniques p.2",
        "body": [
          {
            "text": "สไลด์วาง scope ของ lecture ไว้ที่ **viral nucleic acid detection** อย่างเดียว แบ่งเป็น 3 หัวข้อย่อย"
          },
          {
            "bullets": [
              "Nucleic acid hybridization",
              "Nucleic acid amplification ได้แก่ PCR และ real-time PCR",
              "DNA sequencing"
            ]
          }
        ]
      },
      {
        "heading": "Laboratory diagnosis of virus infection ภาพใหญ่ก่อนเข้าเรื่อง",
        "source": "Lab PCR other molecular techniques p.3",
        "body": [
          {
            "text": "สไลด์แบ่งการวินิจฉัยการติดเชื้อ virus เป็น 2 ขา และบอกว่าขาไหนเรียนวิชาไหน"
          },
          {
            "sub": "Virus detection (เรียนใน Vet Micro I)",
            "body": [
              {
                "bullets": [
                  "Direct detection เช่น EM, antigen detection (FA), viral genome detection (PCR) เป็นต้น",
                  "Virus isolation & identification โดย virus isolation ทำใน host system ได้แก่ cell culture, embryonated eggs และ experimental animals ส่วน sample preparation ใช้ tissue, swab, blood เป็นต้น",
                  "ขั้น virus identification สไลด์บอกว่า identify virus ด้วยวิธี direct detection"
                ]
              }
            ]
          },
          {
            "sub": "Antibody detection หรือ serological test (เรียนใน Vet Micro II)",
            "body": [
              {
                "bullets": [
                  "ตัวอย่างที่สไลด์ยกไว้ ได้แก่ SN, HI, ELISA, IFA และ AGID"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ต้องจำคือ **viral genome detection (PCR) จัดอยู่ในกลุ่ม direct detection** ไม่ใช่ virus isolation",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Viral nucleic acid detection เอาไปใช้ทำอะไร",
        "source": "Lab PCR other molecular techniques p.4",
        "body": [
          {
            "text": "สไลด์แบ่ง application ออกเป็น 2 กลุ่ม"
          },
          {
            "sub": "ใช้ detect viral nucleic acid โดยตรงใน clinical specimens หรือใน cultures",
            "body": [
              {
                "bullets": [
                  "Direct examination",
                  "Viral identification หลังจากทำ virus isolation แล้ว"
                ]
              }
            ]
          },
          {
            "sub": "ใช้ทำ viral characterization",
            "body": [
              {
                "bullets": [
                  "ดู virulence ของ virus",
                  "ตรวจ gene mutation ของ virus ซึ่งสไลด์โยงไปที่ anti-viral drug resistance และ vaccine resistance",
                  "ทำ virus genotyping"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ข้อดีและข้อเสียของ viral nucleic acid detection",
        "source": "Lab PCR other molecular techniques p.5",
        "body": [
          {
            "sub": "Advantages",
            "body": [
              {
                "bullets": [
                  "Rapid detection times",
                  "High sensitivity และ specificity",
                  "ดีสำหรับ virus ที่ culture ยาก เพาะใน vitro ไม่ได้ หรือใช้เวลานานกว่าจะขึ้น",
                  "ใช้ได้กับตัวอย่างที่มี inactivated virus",
                  "ลดความเสี่ยงที่เจ้าหน้าที่ห้องแล็บจะสัมผัส pathogen"
                ]
              }
            ]
          },
          {
            "sub": "Disadvantages",
            "body": [
              {
                "bullets": [
                  "Expensive",
                  "ต้องมีเครื่องมือเฉพาะสำหรับ testing และ detection",
                  "**ไม่ได้พิสูจน์ว่ามี virus ที่ยังมีชีวิต (viable) อยู่จริง**",
                  "Positive results ไม่ได้มี biological significance เสมอไป"
                ]
              }
            ]
          },
          {
            "callout": "ข้อความในสไลด์นี้ถูกจัดเป็นสองคอลัมน์ซ้อนกัน จึงอ่านต่อเนื่องได้ยาก โน้ตนี้เรียงตามที่สไลด์เขียน ไม่ได้เพิ่มเนื้อหาใหม่",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "3 basic nucleic acid detections ในห้องแล็บ clinical virology",
        "source": "Lab PCR other molecular techniques p.6",
        "body": [
          {
            "bullets": [
              "**Nucleic acid hybridization techniques**",
              "**Nucleic acid amplification techniques** ได้แก่ PCR และ real-time PCR",
              "**DNA sequencing**"
            ]
          }
        ]
      },
      {
        "heading": "Nucleic acid hybridization techniques",
        "source": "Lab PCR other molecular techniques p.7",
        "body": [
          {
            "text": "หลักการคือ detect viral nucleic acid target ด้วยการ hybridization โดยใช้ **labeled specific DNA/RNA probes**"
          },
          {
            "sub": "Procedure 3 ขั้นตอนตามสไลด์",
            "body": [
              {
                "bullets": [
                  "แยก double strands ของ target DNA ออกจากกันก่อนด้วยความร้อน",
                  "หลังจากปล่อยให้เย็นลง ให้ hybridize กับ labeled single-stranded DNA หรือ RNA probe",
                  "ตรวจหา labeled probe ด้วยวิธีที่เหมาะสม ถ้าเจอก็ยืนยันว่ามี nucleic acid ของ pathogen อยู่"
                ]
              }
            ]
          },
          {
            "text": "ตัวอย่างเทคนิคที่สไลด์ยกไว้ ได้แก่ **Southern blot, Northern blot และ in situ hybridization**"
          },
          {
            "text": "ส่วนการ detection สไลด์ระบุเครื่องมือไว้เป็น radioactivity detector, fluorimeter และ colorimeter หรือการดูด้วยตา (visual inspection)"
          }
        ]
      },
      {
        "heading": "Nucleic acid amplification techniques",
        "source": "Lab PCR other molecular techniques p.8",
        "body": [
          {
            "bullets": [
              "ใช้ detect viral nucleic acid ใน clinical samples",
              "เพิ่มปริมาณ nucleic acid ของ virus เป้าหมายได้ในเวลาสั้น",
              "**sensitive กว่า nucleic acid hybridization**",
              "ตัวอย่างคือ PCR และ real-time PCR"
            ]
          }
        ]
      },
      {
        "heading": "PCR คืออะไร",
        "source": "Lab PCR other molecular techniques p.9",
        "body": [
          {
            "bullets": [
              "เริ่มใช้ในปี **1983** และผู้คิดค้นได้ Nobel prize สาขา Chemistry ในปี **1994**",
              "Amplify specific nucleic acids ใน vitro สไลด์เปรียบว่าเหมือนการ Xerox DNA",
              "**เพิ่มจำนวน DNA fragment ที่จำเพาะได้ประมาณ million-fold ภายในไม่กี่ชั่วโมง**",
              "ตรวจเจอ virus ได้แม้มีจำนวนน้อยมาก",
              "มี sensitivity, specificity และตรวจได้เร็ว",
              "ใช้บ่อยในการตรวจ microorganisms ใน clinical samples"
            ]
          }
        ]
      },
      {
        "heading": "PCR components",
        "source": "Lab PCR other molecular techniques p.10",
        "body": [
          {
            "bullets": [
              "**DNA template** ได้จากการ isolate nucleic acid จาก clinical samples",
              "**Primers** เป็น oligonucleotides ที่ anneal จำเพาะกับ target DNA และเป็นจุดเริ่มการสร้าง DNA strand ใหม่",
              "**Thermostable DNA polymerase** ทำหน้าที่สังเคราะห์ DNA สายใหม่ ที่ใช้บ่อยที่สุดคือ Taq DNA polymerase",
              "**Magnesium** เป็นสิ่งที่ DNA polymerase ต้องใช้",
              "**Buffer** ทำให้สภาวะและ pH เหมาะกับ DNA polymerase",
              "**dNTPs (dATP, dTTP, dGTP, dCTP)** เป็นวัตถุดิบที่ DNA polymerase ใช้สร้าง DNA ใหม่"
            ]
          }
        ]
      },
      {
        "heading": "3 ขั้นตอนของ PCR",
        "source": "Lab PCR other molecular techniques p.11",
        "body": [
          {
            "bullets": [
              "**Denaturation** ใช้ความร้อนแยก double stranded DNA ให้เป็น single strands ที่ **94-95 องศาเซลเซียส**",
              "**Primer annealing** primer ที่จำเพาะเข้าจับปลายของ ssDNA template โดยอุณหภูมิขึ้นกับ **Tm ของ primer**",
              "**Primer extension** DNA polymerase สังเคราะห์ DNA สายใหม่ที่ **68-72 องศาเซลเซียส**"
            ]
          },
          {
            "text": "Note ในสไลด์ระบุว่า ทั้ง 3 ขั้นตอนนี้ทำซ้ำ **30-40 รอบ** และทำอยู่ในหลอดเดียวกันแต่คนละอุณหภูมิ จึงต้องใช้ **thermal cycler**"
          }
        ]
      },
      {
        "heading": "เจาะขั้น Primer extension และ Taq DNA polymerase",
        "source": "Lab PCR other molecular techniques p.12",
        "body": [
          {
            "bullets": [
              "ขั้นนี้ทำโดย thermostable DNA polymerase",
              "DNA polymerase หยิบ dNTP ทีละตัวมาต่อที่ **ปลาย 3 ไพรม์ของ primer** ที่ anneal อยู่กับ target DNA strand",
              "ที่ใช้บ่อยที่สุดคือ Taq DNA polymerase"
            ]
          },
          {
            "sub": "ที่มาและคุณสมบัติของ Taq pol ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "มาจาก **Thermus aquaticus** ซึ่งเป็น thermophilic bacteria ที่ค้นพบและแยกได้ในปี **1969** จากบ่อน้ำพุร้อนใน Yellowstone National Park",
                  "**ทำงานได้ดีที่สุดราว 72 องศาเซลเซียส และทน (stable) ได้ถึง 96 องศาเซลเซียส ซึ่งเป็นอุณหภูมิที่ใช้ denature**"
                ]
              }
            ]
          },
          {
            "text": "เวลาที่ใช้ในขั้น extension ตามสไลด์คือ **68-72 องศาเซลเซียส ประมาณ 0.5-2 นาที**"
          }
        ]
      },
      {
        "heading": "จำนวน product ที่ได้ และการอ่านผลด้วย gel electrophoresis",
        "source": "Lab PCR other molecular techniques p.13-14",
        "body": [
          {
            "text": "สไลด์ p.13 ให้สูตรเดียวคือ **Total DNA no. = 2 ยกกำลัง n** โดย n คือจำนวนรอบ (cycle) ของ PCR"
          },
          {
            "text": "สไลด์ p.14 หัวข้อ Gel electrophoresis เป็นรูปเจลล้วน มีเพียงป้ายกำกับ lane คือ M และเลข 1 ถึง 5 กับช่อง + และ - **สไลด์ไม่ได้บอก** วิธีแปลผลเจลเป็นข้อความไว้"
          },
          {
            "callout": "ถ้าอาจารย์ถามว่า 20 รอบได้ product กี่เท่า ให้กลับไปที่สูตร 2 ยกกำลัง n ตัวเดียวนี้ อย่าไปจำตัวเลขที่ไม่ได้อยู่ในสไลด์",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "RT-PCR สำหรับ RNA viruses",
        "source": "Lab PCR other molecular techniques p.15",
        "body": [
          {
            "bullets": [
              "ใช้ตรวจ **RNA viruses** จาก clinical samples",
              "ขั้นที่ 1 สังเคราะห์ **complementary DNA (cDNA)** จาก RNA template",
              "เอนไซม์ที่ใช้คือ **reverse transcriptase (RNA-dependent DNA polymerase)** สไลด์ยกตัวอย่างที่มาไว้ 2 ตัว คือ Avian Myeloblastosis Virus (AMV) และ Mouse Moloney Leukemia virus (M-MLV)",
              "ขั้นที่ 2 ใช้ cDNA เป็น template ใน PCR reaction ต่อ"
            ]
          }
        ]
      },
      {
        "heading": "Real-time PCR",
        "source": "Lab PCR other molecular techniques p.16",
        "body": [
          {
            "bullets": [
              "คือการ detect การเพิ่มขึ้นของ PCR product แบบอัตโนมัติตลอดกระบวนการ amplification โดยใช้ **fluorescent reporter dye** ที่วัดด้วยเครื่อง real-time PCR",
              "**Fluorescent signal เท่ากับ PCR product**",
              "เห็นผลบวกได้เร็ว ตั้งแต่ assay ยังรันอยู่ และ **ไม่ต้องใช้ agarose gel**",
              "ใช้ quantitate nucleic acids ได้ จึงมีประโยชน์ในการติดตามความคืบหน้าของโรค (viral-load monitoring)"
            ]
          }
        ]
      },
      {
        "heading": "วิธี detect ใน real-time PCR",
        "source": "Lab PCR other molecular techniques p.17-19",
        "body": [
          {
            "sub": "Dye based ใช้ intercalating dyes (p.17-18)",
            "body": [
              {
                "bullets": [
                  "ตัวอย่างคือ **SYBR Green**",
                  "SYBR green เป็นสีที่ **binds หรือ intercalates กับ double stranded DNA แต่ไม่จับ single-stranded DNA**"
                ]
              }
            ]
          },
          {
            "sub": "Probe based (p.17, 19)",
            "body": [
              {
                "bullets": [
                  "**Hybridization probes** อาศัย donor และ acceptor dye molecules",
                  "**Hydrolysis probes หรือ TaqMan probes** อาศัย 5 ไพรม์ exonuclease activity และมี quencher กับ reporter dye molecules"
                ]
              }
            ]
          },
          {
            "sub": "TaqMan ทำงานอย่างไร (p.19)",
            "body": [
              {
                "bullets": [
                  "quencher dye (สีแดงในรูป) คอยรบกวนสัญญาณจาก reporter dye (วงกลมสีเขียวในรูป)",
                  "**Taq polymerase ต่อ nucleotide ไปเรื่อย ๆ แล้วย่อยเอา TaqMan probe ออกจาก DNA ทำให้ quencher แยกจาก reporter แล้ว reporter จึงปล่อยสัญญาณออกมาได้**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การแปลผล real-time PCR: Ct value",
        "source": "Lab PCR other molecular techniques p.20",
        "body": [
          {
            "text": "**Ct หรือ threshold cycle คือ cycle number ที่ fluorescence ซึ่งเกิดขึ้นในปฏิกิริยาตัดผ่านเส้น fluorescence threshold** โดย threshold นี้หมายถึงระดับสัญญาณ fluorescent ที่สูงกว่า background fluorescence อย่างมีนัยสำคัญ"
          },
          {
            "text": "ตัวอย่างในกราฟของสไลด์แสดง Ct = 19 ที่ปริมาณราว 10 ยกกำลัง 7 copies ต่อไมโครลิตร"
          },
          {
            "callout": "สไลด์ให้เพียงนิยามของ Ct กับตัวอย่างเส้นเดียวเท่านั้น **สไลด์ไม่ได้บอก** เกณฑ์ว่า Ct เท่าไรถือว่าบวกหรือลบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "DNA sequencing",
        "source": "Lab PCR other molecular techniques p.21",
        "body": [
          {
            "text": "นิยามตามสไลด์คือ **การหาลำดับ (order หรือ sequence) ของ nucleotides ในชิ้นส่วน DNA**"
          },
          {
            "sub": "ใช้ทำอะไร",
            "body": [
              {
                "bullets": [
                  "identify virus จาก clinical specimens หรือใช้ยืนยันผลการ identify virus",
                  "ตรวจ gene mutation ที่เกิดขึ้นใน virus",
                  "ใช้ทำ virus genotyping",
                  "ประยุกต์กับงานสเกลใหญ่ เช่น whole genome sequencing ของคนและ pathogen หลายชนิด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วิธี DNA sequencing ที่สไลด์ยกมา",
        "source": "Lab PCR other molecular techniques p.22-23",
        "body": [
          {
            "bullets": [
              "**Sanger-Coulson method หรือ Dideoxy Chain Termination** สไลด์ระบุว่าใช้กันทั่วไป",
              "**Automated DNA sequencing** พัฒนามาจาก Sanger method ใช้หลักการเดียวกันแต่ต่างกันที่วิธี detection และสไลด์ระบุว่าเป็น **วิธีที่นิยมที่สุด**",
              "**Maxam-Gilbert method หรือ Chemical Degradation method** สไลด์ระบุว่าปัจจุบันไม่ค่อยใช้แล้ว"
            ]
          },
          {
            "callout": "สไลด์ p.23 หัวข้อ Automated DNA sequencing result เป็นรูป chromatogram ล้วน ไม่มีข้อความอธิบายวิธีอ่านผล",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Virus classification: genotype vs serotype",
        "source": "Lab PCR other molecular techniques p.24",
        "body": [
          {
            "sub": "Genotype",
            "body": [
              {
                "bullets": [
                  "จำแนกจาก **genetic variation ของ gene ที่แปรผันสูงของ virus** เช่น envelope หรือ capsid gene",
                  "ตรวจด้วย nucleic acid-based method ได้แก่ **PCR/RT-PCR และ DNA sequencing**",
                  "**ทำง่าย จึงใช้กันแพร่หลายที่สุด**"
                ]
              }
            ]
          },
          {
            "sub": "Serotype",
            "body": [
              {
                "bullets": [
                  "จำแนกจาก **ปฏิกิริยาระหว่าง virus strain กับ antibody ที่จำเพาะต่อ serotype ของ virus**",
                  "ตรวจด้วย **virus neutralization test หรือ HI test**",
                  "สไลด์ระบุว่า less practical"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างที่ 1: HPAI H5 clade nomenclature",
        "source": "Lab PCR other molecular techniques p.25",
        "body": [
          {
            "text": "สไลด์ให้เกณฑ์ของ clade nomenclature system ไว้ 2 ข้อ"
          },
          {
            "bullets": [
              "**Phylogenetic tree**: ต้องมี common node ร่วมกันและรวมกันเป็น monophyletic group ที่มี **isolate ตั้งแต่ 4 ตัวขึ้นไป** โดยมี **bootstrap value ตั้งแต่ 60% ขึ้นไป**",
              "**HA gene sequence homology**: within-clade average pairwise nucleotide distance ต้อง **ไม่เกิน 1.5%**"
            ]
          },
          {
            "text": "สไลด์อ้างอิงเกณฑ์นี้จาก WHO / OIE / FAO H5N1 Evolution Working Group ปี 2008"
          }
        ]
      },
      {
        "heading": "ตัวอย่างที่ 1 ต่อ: HPAI H5 classification",
        "source": "Lab PCR other molecular techniques p.26",
        "body": [
          {
            "bullets": [
              "**HPAI H5 แบ่งได้เป็น 10 clades คือ clade 0 ถึง 9 โดยอาศัย genetic variation ของ HA gene**",
              "Progenitor หรือบรรพบุรุษร่วมคือ **A/Goose/Guangdong/1/96 ซึ่งเป็น clade 0**",
              "**Clade 1, 2 และ 7** ปัจจุบันก่อโรครุนแรงใน avian species",
              "**Clade 1 และ 2.3.4** เคยระบาดในประเทศไทยช่วงปี 2004-2008",
              "**Clade 2.3.4.4** เป็น clade ใหม่ล่าสุดที่ emerge ขึ้นมา ปัจจุบันระบาดใน EU, US และเอเชีย ตัวอย่าง subtype ที่สไลด์ยกไว้คือ H5N1, H5N2, H5N3, H5N5, H5N6 และ H5N8"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างที่ 2: IBV genotype classification",
        "source": "Lab PCR other molecular techniques p.27",
        "body": [
          {
            "bullets": [
              "แบ่งเป็น **genotypes และ lineages**",
              "**จำแนกโดยใช้ complete S1 gene**",
              "วิธีที่ใช้มี 2 แบบ คือ phylogenetic ML tree ซึ่งสไลด์ระบุว่าเหมาะสมกว่า และการดู % pairwise nucleotide distances",
              "**Genotype ต่างกันตั้งแต่ 30/31% ขึ้นไปทั้ง nucleotide และ amino acid**",
              "**Lineage ต่างกันตั้งแต่ 13/14% ขึ้นไปทั้ง nucleotide และ amino acid**"
            ]
          },
          {
            "callout": "ตัวเลข 30/31% และ 13/14% เขียนคู่กันแบบนี้ในสไลด์ (nt/aa) จำให้ตรงตามที่สไลด์เขียน",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout": {
    "topic": "microbio-1--lab-virus-isolation-propagation-embryonated-egg-handout",
    "title": "Virus isolation and propagation: embryonated egg",
    "icon": "🧬",
    "lecturer": "Aunyaratana Thontiravong",
    "summary": "เด็คนี้ว่าด้วยการใช้ embryonated egg เป็น host system สำหรับ virus isolation โดยเริ่มจากกรอบใหญ่ของ laboratory diagnosis of virus infection แล้วลงรายละเอียดเฉพาะไข่ ได้แก่ ข้อดีของระบบไข่ การใช้ประโยชน์ แหล่งไข่ SPF สภาวะ incubator การ candling ปัจจัยที่มีผลต่อการเจริญของไวรัส route of inoculation 3 ทาง (allantoic cavity, CA membrane, amniotic cavity) พร้อมอายุ embryo ปริมาณ inoculum และตัวอย่างไวรัส อุณหภูมิ incubation ก่อนและหลัง inoculation การอ่านผลไข่ที่ติดเชื้อ การ harvest ไวรัส และปิดท้ายด้วยขั้นตอน LAB จริง 3 สไลด์ (materials, allantoic cavity inoculation, CA membrane inoculation) ส่วนที่ต้องบอกตามตรงคือมีหลายสไลด์ที่เป็นหน้าคั่นหรือเป็นรูปล้วนโดยไม่มีข้อความ (p.4, p.11, p.12, p.13, p.19) เหลือแค่ชื่อหัวข้อกับ URL ที่มาของรูป จึงไม่มีเนื้อหาให้สรุป",
    "sections": [
      {
        "heading": "กรอบใหญ่: Laboratory diagnosis of virus infection",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.2",
        "body": [
          {
            "text": "สไลด์แบ่งการวินิจฉัยโรคไวรัสในห้องปฏิบัติการเป็น 2 ทางหลัก และบอกไว้ชัดว่า **Virus detection อยู่ในขอบเขตของ Vet Micro I ส่วน Antibody detection (serological test) ไปเรียนใน Vet Micro II**"
          },
          {
            "sub": "Virus detection",
            "body": [
              {
                "bullets": [
                  "Direct detection เช่น EM, antigen detection (FA), viral genome detection (PCR) etc.",
                  "Virus isolation & identification"
                ]
              },
              {
                "text": "ในส่วน virus isolation สไลด์ระบุ **host system ได้แก่ cell culture, embryonated eggs & experimental animals** และ sample preparation ได้แก่ tissue, swab & blood etc. ส่วน virus identification คือ identify virus ด้วย direct detection tests"
              }
            ]
          },
          {
            "sub": "Antibody detection (serological test)",
            "body": [
              {
                "bullets": [
                  "ตัวอย่างที่สไลด์ยกมา: SN, HI, ELISA, IFA & AGID etc.",
                  "สไลด์กำกับไว้ว่าเป็นเนื้อหาของ Vet Micro II"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Virus isolation & identification ใช้เมื่อไหร่",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.3",
        "body": [
          {
            "text": "สไลด์ระบุว่า **มีประโยชน์มากในกรณีที่ตัวอย่างมีปริมาณไวรัสน้อย จนตรวจด้วย direct examination ไม่ได้**"
          },
          {
            "sub": "1. Virus isolation",
            "body": [
              {
                "text": "คือการ isolate (amplify) ไวรัสด้วย host system อย่างใดอย่างหนึ่งใน 3 แบบ ได้แก่ **1. Cell cultures 2. Embryonated eggs 3. Experimental animals**"
              }
            ]
          },
          {
            "sub": "2. Virus identification",
            "body": [
              {
                "text": "คือการ identify ไวรัสด้วย direct detection techniques"
              }
            ]
          }
        ]
      },
      {
        "heading": "ทำไมใช้ embryonated eggs",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.5",
        "body": [
          {
            "bullets": [
              "Bacteriological sterile",
              "Lack of production of antibodies against viral inoculum",
              "Provide a variety of differentiated tissues จึงเป็น substrates ให้ไวรัสหลายชนิดเจริญได้",
              "**Many avian viruses replicate much better in eggs**",
              "Inexpensive system for virus isolation"
            ]
          },
          {
            "callout": "สไลด์จบด้วยคำว่า \"Availability?\" เป็นคำถามค้างไว้ ไม่ได้บอกคำตอบว่าหาไข่ได้ง่ายหรือยากแค่ไหน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Use of embryonated eggs",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.6",
        "body": [
          {
            "bullets": [
              "Isolation of viruses",
              "Preparation of stock viruses",
              "Titration of viruses",
              "Production of vaccines",
              "Detection of virus specific antibodies"
            ]
          }
        ]
      },
      {
        "heading": "Egg source: SPF eggs",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.7",
        "body": [
          {
            "text": "สไลด์ระบุให้ใช้ **Specific pathogen free (SPF) embryonated eggs** ซึ่งได้มาจาก flocks ที่ปลอดทั้งการติดเชื้อไวรัสที่สนใจและปลอดการทำวัคซีน (free of specific virus infections and vaccinations)"
          }
        ]
      },
      {
        "heading": "Egg incubator: สภาวะก่อน inoculation",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.8",
        "body": [
          {
            "bullets": [
              "Temperature: **38-39 องศาเซลเซียส**",
              "Relative humidity: **55-60%**",
              "Turned **2-4 times/day**"
            ]
          },
          {
            "text": "สไลด์อธิบายว่าการกลับไข่มีไว้เพื่อ **prevent adhesions of embryonic membranes และ keep embryo centralized** และเน้นว่า **การกลับไข่ทำเฉพาะก่อน virus inoculation เท่านั้น**"
          }
        ]
      },
      {
        "heading": "Egg candling",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.9",
        "body": [
          {
            "bullets": [
              "ใช้ egg candler",
              "**Investigate embryo viability**",
              "Locate air space, blood vessel & hole punching"
            ]
          }
        ]
      },
      {
        "heading": "Factors influencing the growth of viruses",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.10",
        "body": [
          {
            "bullets": [
              "Age of embryo",
              "Route of inoculation",
              "Concentration of virus & volume of inoculum",
              "Time & temperature of incubation after inoculation"
            ]
          }
        ]
      },
      {
        "heading": "Route of inoculation ทั้ง 3 ทาง",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.14-16",
        "body": [
          {
            "sub": "Allantoic cavity (p.14)",
            "body": [
              {
                "bullets": [
                  "Embryo: **9-11 days**",
                  "Inoculum: **0.1-0.2 ml**",
                  "**Most used**",
                  "ตัวอย่างไวรัส: IBV, NDV, IAV"
                ]
              }
            ]
          },
          {
            "sub": "Chorioallantoic (CA) membrane (p.15)",
            "body": [
              {
                "bullets": [
                  "Embryo: **10-12 days**",
                  "Inoculum: **0.1-0.5 ml**",
                  "ตัวอย่างไวรัส: fowl pox virus, ILTV, MDV, PRV"
                ]
              }
            ]
          },
          {
            "sub": "Amniotic cavity (p.16)",
            "body": [
              {
                "bullets": [
                  "Embryos: **7-15 days**",
                  "Inoculum: **0.1-0.2 ml**",
                  "ตัวอย่างไวรัส: IAV"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่ายคือคู่ อายุ embryo กับ route: allantoic 9-11 วัน, CAM 10-12 วัน, amniotic 7-15 วัน และสังเกตว่า **IAV ปรากฏทั้งทาง allantoic cavity และ amniotic cavity** ส่วนสไลด์ไม่ได้บอกว่าเลือกทางไหนในสถานการณ์ใด",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Temperature of incubation",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.17",
        "body": [
          {
            "bullets": [
              "Pre-inoculation: **38-39 องศาเซลเซียส**",
              "Post-inoculation: **33-37 องศาเซลเซียส**"
            ]
          },
          {
            "text": "สไลด์ไม่ได้บอกเหตุผลว่าทำไมอุณหภูมิหลัง inoculation จึงต่ำลง"
          }
        ]
      },
      {
        "heading": "Recognition of virus-infected eggs",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.18, p.20-21",
        "body": [
          {
            "sub": "Embryonic changes (p.18)",
            "body": [
              {
                "bullets": [
                  "**Hemorrhage**",
                  "**Stunt**"
                ]
              }
            ]
          },
          {
            "sub": "Pock formation (p.20-21)",
            "body": [
              {
                "text": "สไลด์ระบุ **pock formation on CA membrane** เป็นอีกลักษณะที่บอกว่าไข่ติดเชื้อ โดยมี 2 สไลด์ติดกันที่หัวข้อเดียวกัน เนื้อความที่เป็นตัวอักษรมีเท่านี้ ที่เหลือเป็นรูป"
              }
            ]
          },
          {
            "callout": "p.19 อยู่ในชุดหัวข้อนี้เช่นกันแต่เป็นสไลด์รูปล้วน ไม่มีข้อความใด ๆ ให้สรุป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Harvesting of virus",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.22",
        "body": [
          {
            "bullets": [
              "ใช้ **aseptic technique**",
              "**Performed immediately after embryo death**",
              "Stock virus preparation: **harvest ก่อน embryo ตาย จะได้ virus titer สูง**",
              "Only performed for certain viruses",
              "**Chill eggs ที่ 4 องศาเซลเซียส ข้ามคืน หรือ -20 องศาเซลเซียส 30 นาที** เพื่อ kill the embryo and clot the blood"
            ]
          },
          {
            "callout": "สไลด์นี้เป็น layout ที่มีเลขกำกับรูป 1 2 3 แทรกอยู่ระหว่างบูลเล็ต ทำให้จาก text layer บอกไม่ได้แน่ชัดว่าบูลเล็ตไหนคู่กับรูปหมายเลขใด และข้อ \"only performed for certain viruses\" สไลด์ไม่ได้ระบุว่าหมายถึงไวรัสกลุ่มใด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Virus identification หลัง isolation",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.23",
        "body": [
          {
            "bullets": [
              "Direct detection technique เช่น **viral genome detection, HA test**",
              "Pathological investigation",
              "Serological test"
            ]
          }
        ]
      },
      {
        "heading": "LAB: materials",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.24",
        "body": [
          {
            "bullets": [
              "**10-day-old embryonated chicken eggs**",
              "Tuberculin syringe",
              "Pencil, glue, nail & rubber bulb",
              "Egg candler",
              "Betadine",
              "Egg incubator"
            ]
          }
        ]
      },
      {
        "heading": "LAB: allantoic cavity inoculation ทีละขั้น",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.25",
        "body": [
          {
            "bullets": [
              "1. Candle ไข่ฟักอายุ 10 วัน เพื่อเช็ค embryo viability",
              "2. Mark เปลือกด้วยดินสอเพื่อระบุตำแหน่ง air sac และ mark จุดที่จะ inoculate",
              "3. Disinfect บริเวณที่จะ inoculate ด้วย betadine",
              "4. เจาะรูเล็ก ๆ ที่จุด mark ด้วยตะปูที่ disinfect แล้ว",
              "5. **Inoculate virus inoculum 0.1 ml เข้า allantoic cavity**",
              "6. Seal รูด้วย glue เพื่อกัน contamination",
              "7. **Incubate ที่ 37 องศาเซลเซียส ใน egg incubator นาน 5-7 วัน**",
              "8. Candle ไข่ที่ inoculate แล้วทุกวัน"
            ]
          }
        ]
      },
      {
        "heading": "LAB: CA membrane inoculation ทีละขั้น",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.26",
        "body": [
          {
            "bullets": [
              "1. Mark เปลือกเพื่อระบุตำแหน่ง air sac และ **mark 2 จุด** คือจุดเหนือ air sac และอีกจุดที่ด้านข้างของไข่",
              "2. Disinfect ทั้ง 2 บริเวณด้วย betadine",
              "3. เจาะ 2 รูที่จุด mark ด้วยตะปูที่ disinfect ด้วย betadine",
              "4. **ใช้ rubber bulb ดูดเบา ๆ ที่รูเหนือ air sac เพื่อสร้าง artificial air sac**",
              "5. Mark บริเวณ artificial air sac ด้วยดินสอ",
              "6. **Inoculate virus 0.1 ml ลงบน CA membrane ที่ dropped ลงมา** โดยแทงเข็มผ่านรูด้านข้างของไข่",
              "7. Seal รูทั้ง 2 ด้วย glue",
              "8. **Incubate ที่ 37 องศาเซลเซียส นาน 5-7 วัน**",
              "9. Candle ไข่ที่ inoculate แล้วทุกวัน"
            ]
          },
          {
            "callout": "สไลด์เตือน 2 จุดในขั้นตอนนี้: **do not insert the needle too deep** เพราะจะทำ CA membrane เสียหาย และ **do not turn the eggs** ทั้งหลัง inoculation และตลอดช่วง incubation ซึ่งต่างจากช่วงก่อน inoculate ที่ต้องกลับไข่วันละ 2-4 ครั้ง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นหน้าคั่นหรือรูปล้วน",
        "source": "Lab Virus isolation propagation embryonated egg Handout p.4, p.11-13, p.19",
        "body": [
          {
            "text": "บันทึกไว้ตามตรงว่าเด็คนี้มีสไลด์ที่ text layer ไม่มีเนื้อหาให้สรุป ได้แก่ p.4 เป็นหน้าคั่นชื่อ Virus isolation in embryonated eggs, p.11 และ p.13 ชื่อ Route of inoculation แต่มีเพียง URL ที่มาของรูป, p.12 ชื่อ Development of chick embryo มีเพียง URL, และ p.19 อยู่ในหัวข้อ Recognition of virus-infected eggs แต่ไม่มีข้อความเลย"
          },
          {
            "callout": "รูป development of chick embryo (p.12) กับ route of inoculation (p.11, p.13) น่าจะเป็นรูปที่ต้องดูจากไฟล์สไลด์จริงตอนอ่านทบทวน เพราะข้อความในเด็คไม่ได้บรรยายรูปไว้",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "microbio-1--lab-virus-isolation-propagation-embryonated-egg": {
    "topic": "microbio-1--lab-virus-isolation-propagation-embryonated-egg",
    "title": "Virology Lab: Sample collection, handling and preparation",
    "icon": "🧬",
    "lecturer": "Aunyaratana Thontiravong",
    "summary": "แม้ชื่อไฟล์จะเป็น Virus isolation propagation embryonated egg แต่เนื้อสไลด์จริงคือคาบแรกของ Virology lab เรื่อง Sample collection, handling and preparation ตัวเนื้อหาแบ่งเป็น 3 ก้อน คือ (1) ภาพรวมว่า laboratory diagnosis ของไวรัสทำได้ทางไหนบ้าง (2) หลักการเก็บตัวอย่าง ขนส่ง และเตรียมตัวอย่างก่อน inoculate เข้า host system และ (3) protocol ของ LAB I คือการเตรียม tissue sample (pig liver) สำหรับ virus isolation ทั้งวัสดุและขั้นตอน 8 ข้อ สไลด์นี้ไม่ได้ลงรายละเอียดวิธี isolation ใน embryonated egg เลย และมี 1 หน้าเป็นตารางตารางเรียนแลป กับอีก 2 หน้าเป็นรูปจาก Fenner's Veterinary Virology ที่ไม่มีข้อความประกอบ",
    "sections": [
      {
        "heading": "สไลด์ชุดนี้พูดถึงอะไรจริง ๆ",
        "source": "Lab Virus isolation propagation embryonated egg p.1",
        "body": [
          {
            "text": "หน้าไตเติ้ลระบุหัวข้อว่า **Vet Microbiol Lab: Virology — Sample collection, handling and preparation** ไม่ใช่หัวข้อ embryonated egg ตามชื่อไฟล์"
          },
          {
            "callout": "ถ้าจะอ่านเรื่อง virus isolation ใน embryonated eggs ต้องไปดูสไลด์อีกชุด สไลด์ชุดนี้ไม่ได้บอกวิธีฉีดไข่ฟักหรือ route การฉีดใด ๆ เลย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ภาพรวมการวินิจฉัยโรคไวรัส",
        "source": "Lab Virus isolation propagation embryonated egg p.2",
        "body": [
          {
            "text": "การวินิจฉัยโรคไวรัสโดยรวมประกอบด้วย 4 ส่วน"
          },
          {
            "bullets": [
              "History taking",
              "Clinical examination",
              "Pathological diagnosis",
              "Laboratory diagnosis"
            ]
          },
          {
            "text": "สไลด์ย้ำว่า **Laboratory diagnosis คือวิธีที่ดีที่สุดในการ confirm โรคติดเชื้อไวรัส และใช้ identify causative agents**"
          }
        ]
      },
      {
        "heading": "Laboratory diagnosis แบ่งเป็น 2 ขา: virus detection กับ antibody detection",
        "source": "Lab Virus isolation propagation embryonated egg p.3",
        "body": [
          {
            "sub": "Virus detection (เรียนใน Vet Micro I)",
            "body": [
              {
                "bullets": [
                  "**Direct detection** เช่น EM, antigen detection (FA), viral genome detection (PCR) เป็นต้น",
                  "**Virus isolation & identification** คือ isolate ไวรัสใน host system แล้วจึง identify"
                ]
              },
              {
                "text": "Host system ที่สไลด์ระบุมี 3 อย่าง คือ **cell culture, embryonated eggs และ experimental animals** ส่วน sample ที่เอามาเตรียมได้แก่ tissue, swab, blood เป็นต้น"
              },
              {
                "text": "ขั้น virus identification สไลด์บอกว่าใช้วิธี direct detection เดิมมา identify ไวรัสที่ isolate ได้"
              }
            ]
          },
          {
            "sub": "Antibody detection (serological test, เรียนใน Vet Micro II)",
            "body": [
              {
                "text": "ตัวอย่างที่สไลด์ยกไว้คือ SN, HI, ELISA, IFA และ AGID เป็นต้น"
              }
            ]
          }
        ]
      },
      {
        "heading": "Sample collection: right time และ right place",
        "source": "Lab Virus isolation propagation embryonated egg p.5",
        "body": [
          {
            "text": "หลักคือ **ต้องรู้จักโรคก่อน จึงจะรู้ว่าเก็บอะไร (right place) และเก็บเมื่อไหร่ (right time)**"
          },
          {
            "sub": "Right time",
            "body": [
              {
                "bullets": [
                  "เก็บให้เร็วที่สุดหลังสัตว์เริ่มแสดง clinical signs",
                  "ช่วง acute phase ของโรค หรือสัตว์ที่เพิ่งตาย (recently dead animals)"
                ]
              }
            ]
          },
          {
            "sub": "Right place",
            "body": [
              {
                "bullets": [
                  "สัมพันธ์กับ clinical signs หรือ lesions ที่พบ",
                  "เก็บจาก target organs"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 6 และหน้า 9 เป็นรูปจาก MacLachlan (2011) Fenner's Veterinary Virology, 4th edition ไม่มีข้อความบรรยายในสไลด์ จึงสรุปรายละเอียดของรูปไม่ได้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "วิธีเก็บตัวอย่าง: ภาชนะและ transport media",
        "source": "Lab Virus isolation propagation embryonated egg p.7",
        "body": [
          {
            "bullets": [
              "**เลี่ยง contamination ด้วย aseptic technique**",
              "ใช้ภาชนะให้ถูกชนิด และใช้ transport media ที่เหมาะสม",
              "ติดฉลากตัวอย่างให้เรียบร้อยด้วย waterproof ink",
              "ให้ clinical history ของสัตว์และ suspected pathogen(s) อย่างละเอียดไปพร้อมตัวอย่าง"
            ]
          },
          {
            "sub": "ภาชนะแยกตามชนิดตัวอย่าง",
            "body": [
              {
                "bullets": [
                  "Solid tissue ใส่ plastic bags",
                  "Swabs ใส่ **viral transport medium (VTM)**",
                  "Serum samples ใส่ lock tight tubes"
                ]
              },
              {
                "text": "ส่วนประกอบของ VTM ตามสไลด์ = **PBS หรือ cell culture medium + bovine serum albumin (BSA) + antibiotic/antifungal agents**"
              }
            ]
          }
        ]
      },
      {
        "heading": "การขนส่งและเก็บรักษาตัวอย่าง",
        "source": "Lab Virus isolation propagation embryonated egg p.8",
        "body": [
          {
            "bullets": [
              "ส่งตัวอย่างถึงห้องแล็บให้เร็วที่สุด",
              "**ตัวอย่างต้อง keep cold และ moist ตลอด**",
              "ทุกตัวอย่างยกเว้น blood ให้เก็บที่ 4 องศาเซลเซียสระหว่างขนส่ง และเก็บใน sealed containers"
            ]
          },
          {
            "sub": "ถ้ายัง process ทันทีไม่ได้",
            "body": [
              {
                "bullets": [
                  "เก็บที่ **4 องศาเซลเซียส ไม่เกิน 24 ชั่วโมง**",
                  "ถ้านานกว่า 24 ชั่วโมงขึ้นไป ให้ **แช่แข็งที่ -80 องศาเซลเซียส**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์บอกแค่ว่า blood เป็นข้อยกเว้นจากการเก็บที่ 4 องศาเซลเซียส แต่ไม่ได้บอกว่าแล้ว blood ต้องเก็บที่อุณหภูมิเท่าไหร่",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Sample preparation: หลักการก่อนลงมือ",
        "source": "Lab Virus isolation propagation embryonated egg p.10",
        "body": [
          {
            "text": "**เป้าหมายของ sample preparation คือปล่อยไวรัสออกจาก infected cells ลงมาอยู่ใน solution** และยังต้องเลี่ยง contamination ด้วย aseptic technique เช่นเดิม วิธีเตรียมขึ้นกับชนิดของตัวอย่าง"
          },
          {
            "sub": "Tissue samples",
            "body": [
              {
                "bullets": [
                  "บดด้วย mortar & pestle หรือ homogenizer",
                  "Sonication",
                  "Multiple freeze-thawing"
                ]
              }
            ]
          },
          {
            "sub": "ขั้นตอนต่อจากการทำให้เซลล์แตก",
            "body": [
              {
                "bullets": [
                  "**Clarify ด้วย centrifugation ที่ 4 องศาเซลเซียส เพื่อกำจัด cell debris และแบคทีเรีย**",
                  "Treat ด้วย antibiotics หรือกรองผ่าน **0.45 ไมโครเมตร membrane filter**",
                  "Inoculate เข้า host ที่เหมาะสม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "LAB I: Materials สำหรับเตรียม tissue sample",
        "source": "Lab Virus isolation propagation embryonated egg p.11",
        "body": [
          {
            "text": "ตัวอย่างที่ใช้ในแลปคือ **pig liver ประมาณ 1 กรัม**"
          },
          {
            "bullets": [
              "Pestle & mortar",
              "Sterile scissors",
              "**Phosphate buffered saline solution (PBS) pH 7.2-7.4**",
              "Sterile sand",
              "Sterile centrifuge tubes",
              "Refrigerated centrifuge",
              "Antibiotic",
              "Single channel pipette และ pipette tips",
              "**0.45 ไมโครเมตร membrane filter หรือ filter disc**",
              "Syringe and needle"
            ]
          }
        ]
      },
      {
        "heading": "LAB I: Methods 8 ขั้นตอน",
        "source": "Lab Virus isolation propagation embryonated egg p.13-15",
        "body": [
          {
            "bullets": [
              "1. บด tissue sample ใน mortar & pestle **พร้อม sand**",
              "2. เติม **PBS 1-2 ml** แล้วบดต่อจนเนียน",
              "3. ย้าย tissue suspension ลง centrifuge tube",
              "4. เติม PBS จนได้ **10% suspension**",
              "5. Centrifuge ที่ **1000-3000 rpm, 4 องศาเซลเซียส, 10-15 นาที**",
              "6. เก็บ supernatant ออกมา",
              "7. เติม antibiotics แล้ว incubate **15-30 นาที ที่ 4 องศาเซลเซียส หรือที่ room temperature**",
              "8. **Inoculate supernatant เข้า culture system ที่เหมาะสม หรือเก็บที่ -80 องศาเซลเซียส**"
            ]
          },
          {
            "callout": "สไลด์หน้า 12 ว่างเปล่า (น่าจะเป็นหน้ารูปประกอบขั้นตอน) จึงไม่มีข้อความให้สรุป",
            "kind": "flag"
          },
          {
            "callout": "จำลำดับ บด-เจือจางเป็น 10%-ปั่นเย็น-เก็บ supernatant-ใส่ยาปฏิชีวนะ-inoculate ไว้ให้แม่น เพราะเป็นโครงเดียวกับหลักการหน้า 10 ทุกขั้น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตารางแลป Virology (ข้อมูลบริหารจัดการ)",
        "source": "Lab Virus isolation propagation embryonated egg p.4",
        "body": [
          {
            "text": "หน้านี้เป็นตารางเรียนของ Vet Microbiol I 2024: Virology lab ล้วน ๆ ไม่ใช่เนื้อหาวิชาการ ลำดับหัวข้อทั้ง 5 คาบเรียงตามนี้"
          },
          {
            "bullets": [
              "2 Apr 24 — Sample collection, handling and preparation",
              "9 Apr 24 — Virus isolation and propagation I: cell culture",
              "23 Apr 24 — Virus isolation and propagation II: embryonated eggs",
              "30 Apr 24 — Virus detection (immunostaining & PCR) มีแต่ lecture 13.00-15.30 ไม่มี lab",
              "7 May 24 — Virus titration"
            ]
          },
          {
            "text": "คาบอื่นแบ่งเป็น lecture 13.00-13.45 ที่ห้อง 201 แล้วต่อด้วย lab 14.00-16.00 ที่ห้อง 602"
          }
        ]
      }
    ]
  },
  "microbio-1--principle-of-bacterial-diagnosis-in-clinical": {
    "topic": "microbio-1--principle-of-bacterial-diagnosis-in-clinical",
    "title": "Principle of bacterial diagnosis in clinical",
    "icon": "🦠",
    "lecturer": "Assistant Prof. Dr. Channarong Rodkhum",
    "summary": "เด็คนี้เดินตามลำดับงาน bacterial diagnosis ตั้งแต่เก็บ specimen จนถึงการเลือก antibiotic แต่เนื้อหาส่วนใหญ่จริง ๆ คือคู่มือ lab สำหรับ phenotypic identification โดยไล่ทีละ test (oxidase, catalase, O/F, motility, sugar assimilation, urease, amino acid decarboxylation, nitrate reduction, indole, MR, VP, citrate, TSI, gluconate, bile esculin) ในรูปแบบ purpose / media-reagent / method / interpretation ซ้ำ ๆ กันทุกอัน ส่วนต้นเรื่อง culture media และ genotypic identification สไลด์พูดไว้สั้นมาก เป็นแค่รายการหัวข้อ ไม่ได้ขยายความ และมีสไลด์รูปล้วนไม่มีข้อความอีกหลายหน้า (p.12, 24-27, 43, 46, 49, 57, 62, 80, 98) ซึ่งอ่านจาก text layer ไม่ได้ ต้องกลับไปดูรูปในไฟล์สไลด์เอง",
    "sections": [
      {
        "heading": "ลำดับขั้นตอนของ bacterial diagnosis ทั้งกระบวนการ",
        "source": "Principle of bacterial diagnosis in clinical p.2",
        "body": [
          {
            "text": "สไลด์วางลำดับงานทั้งหมดไว้เป็นโครงของทั้งเด็ค ให้จำลำดับนี้ก่อน แล้วค่อยเอา test ย่อย ๆ ทีหลังไปแขวนไว้ในขั้น Bacterial Identification"
          },
          {
            "bullets": [
              "**Specimen Collection และ Transportation**",
              "**Direct Microscopic Examination**",
              "**Specimen Processing**",
              "**Selection of bacterial culturing method และ bacterial culture**",
              "**Bacterial Identification** แบ่งเป็น Phenotypic Identification และ Genotypic Identification",
              "**Antimicrobial Susceptibility test**",
              "**Interpretation of the results**",
              "**Selection of antibiotic for treatment of animal diseases**"
            ]
          }
        ]
      },
      {
        "heading": "Specimens Collection หลักการเก็บตัวอย่าง",
        "source": "Principle of bacterial diagnosis in clinical p.3",
        "body": [
          {
            "bullets": [
              "เลือก **appropriate sites or organs** ให้ตรงกับโรคที่สงสัย",
              "ใช้ **sterile equipment** ในการเก็บ",
              "**Labeling** ตัวอย่างทุกครั้ง",
              "เก็บและส่งตัวอย่างใน **medium และ condition ที่เหมาะสม**"
            ]
          }
        ]
      },
      {
        "heading": "ชนิดของตัวอย่างที่เก็บจากสัตว์ป่วย",
        "source": "Principle of bacterial diagnosis in clinical p.4-5",
        "body": [
          {
            "bullets": [
              "Blood",
              "Exudate, Pus (สไลด์กำกับไทยว่า หนอง)",
              "Cerebrospinal fluid",
              "Throat swab",
              "Ear wax",
              "Tracheal lavage (สไลด์กำกับไทยว่า ต้องทำในสัตว์สลบ)",
              "Eye discharge",
              "Wound",
              "Feces",
              "Samples from genital tract",
              "Urine",
              "Milk",
              "Tissue biopsy"
            ]
          },
          {
            "text": "หน้า How to Sampling ยกตัวอย่างเทคนิคเดียวคือ **Cystocentesis** ที่เหลือเป็นรูปประกอบ สไลด์ไม่ได้อธิบายขั้นตอนการทำ"
          }
        ]
      },
      {
        "heading": "Direct Microscopic Examination",
        "source": "Principle of bacterial diagnosis in clinical p.6",
        "body": [
          {
            "text": "สไลด์ยกตัวอย่างเดียวคือ **Stapylococcus และ Streptococcus จาก throat swab** ที่เหลือเป็นรูป ไม่มีคำอธิบายวิธีอ่านหรือเกณฑ์ตัดสินบนสไลด์"
          }
        ]
      },
      {
        "heading": "Transportation of Specimens",
        "source": "Principle of bacterial diagnosis in clinical p.7",
        "body": [
          {
            "bullets": [
              "**Fast** ส่งให้เร็ว",
              "**Safety** ปลอดภัย",
              "**Appropriate conditions (Transport medium)** สไลด์แยกเป็น facultative anaerobic และ anaerobic",
              "**No contamination**"
            ]
          }
        ]
      },
      {
        "heading": "Specimen Processing",
        "source": "Principle of bacterial diagnosis in clinical p.8",
        "body": [
          {
            "text": "สไลด์ให้ไว้แค่ 3 คำ ไม่ได้ขยายว่าแต่ละอันทำอย่างไรหรือใช้เมื่อไร"
          },
          {
            "bullets": [
              "**Pre-enrichment**",
              "**Concentration**",
              "**Decontamination**"
            ]
          }
        ]
      },
      {
        "heading": "Bacterial cultivation: Nutritional Requirements",
        "source": "Principle of bacterial diagnosis in clinical p.9",
        "body": [
          {
            "bullets": [
              "Energy",
              "Carbon Sources",
              "Electron Sources",
              "Nitrogen Sources",
              "Oxygen, Sulfur และ Phosphorus",
              "**Ion of heavy metals (K+, Mg2+, Fe2+, Ca2+)**",
              "Vitamin"
            ]
          }
        ]
      },
      {
        "heading": "Culture Media: องค์ประกอบพื้นฐาน",
        "source": "Principle of bacterial diagnosis in clinical p.10",
        "body": [
          {
            "text": "Basic Nutrient Media ประกอบด้วย Peptones, Infusion and Extract, Solidifying agents, Indicators, Salt (NaCl), Dextrose, Water, Selective agents, reducing agent และ Blood"
          }
        ]
      },
      {
        "heading": "Type of Culture Medium แบ่งตามคุณสมบัติ",
        "source": "Principle of bacterial diagnosis in clinical p.11",
        "body": [
          {
            "sub": "Physiological properties",
            "body": [
              {
                "bullets": [
                  "**Solid Media**",
                  "**Liquid Media (Broth)**",
                  "**Semisolid Media**"
                ]
              }
            ]
          },
          {
            "sub": "Nutritional properties",
            "body": [
              {
                "bullets": [
                  "Chemical defined media",
                  "Plain Media",
                  "**Enriched Media** และ **Enrichment media** (สไลด์แยกเป็นสองรายการ แต่ไม่ได้อธิบายความต่าง)",
                  "**Selective media**",
                  "**Differential media**",
                  "Assay Media",
                  "Media for enumeration of bacteria",
                  "Media for characterization of bacteria",
                  "Maintenance media"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อประเภท ไม่ได้นิยามว่า selective ต่างจาก differential อย่างไร ต้องไปฟังคำอธิบายในห้องหรือดูสไลด์รูปหน้าถัดไปที่ text layer อ่านไม่ได้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Media ที่ใช้บ่อย: ขนส่งตัวอย่าง และ initial identification",
        "source": "Principle of bacterial diagnosis in clinical p.13",
        "body": [
          {
            "sub": "Media commonly used for transportation of bacterial sample",
            "body": [
              {
                "bullets": [
                  "**Thioglycolate broth**",
                  "**Stuart's transport medium**",
                  "**Cary-Blair transport medium**"
                ]
              }
            ]
          },
          {
            "sub": "Media commonly used for initial bacterial identification",
            "body": [
              {
                "bullets": [
                  "**Blood agar**",
                  "**MacConkey agar**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "MacConkey agar",
        "source": "Principle of bacterial diagnosis in clinical p.14-15",
        "body": [
          {
            "bullets": [
              "ใช้หลักในการ identify **lactose fermenting, Gram-negative enteric pathogens**",
              "colony ที่ **ferment lactose ได้ ทำให้ medium เปลี่ยนเป็นสีแดง** เพราะ pH indicator ตอบสนองต่อสภาพเป็นกรดที่เกิดจากการ ferment lactose",
              "organism ที่ **ไม่ ferment lactose จะไม่ทำให้สีเปลี่ยน**"
            ]
          },
          {
            "text": "สไลด์ถัดมาเป็นรูปเปรียบเทียบ colony ของ lactose fermentor กับ non-lactose fermentor บน MacConkey agar ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "Isolation of Bacteria from Specimens",
        "source": "Principle of bacterial diagnosis in clinical p.16-17",
        "body": [
          {
            "bullets": [
              "**Evaluation of colony morphologies**",
              "**Type of media supporting bacterial growth** คือดูว่าเชื้อขึ้นบน media ชนิดไหน",
              "**Relative quantities of each colony type** สัดส่วนของ colony แต่ละแบบ",
              "**Select colonies for identification**"
            ]
          },
          {
            "text": "หน้า How to streak a plate เป็นรูปล้วน สไลด์ไม่ได้เขียนขั้นตอนการ streak เป็นตัวอักษร"
          }
        ]
      },
      {
        "heading": "เกณฑ์การจำแนกเชื้อ: Phenotypic กับ Genotypic criteria",
        "source": "Principle of bacterial diagnosis in clinical p.18",
        "body": [
          {
            "sub": "Phenotypic criteria",
            "body": [
              {
                "bullets": [
                  "Macroscopic Morphology",
                  "Microscopic Morphology",
                  "Staining Characteristics",
                  "Environmental Requirements",
                  "Resistance profiles",
                  "Antigenic properties",
                  "subcellular properties"
                ]
              }
            ]
          },
          {
            "sub": "Genotypic criteria",
            "body": [
              {
                "bullets": [
                  "**DNA base composition ratio (G+C content)**",
                  "**Nucleic acid base sequence analysis**"
                ]
              }
            ]
          },
          {
            "callout": "genotypic criteria สไลด์บอกไว้แค่ 2 บรรทัดนี้ ทั้งเด็คไม่ได้ลงรายละเอียดวิธี genotypic identification เลย เนื้อหาที่เหลือเป็น phenotypic ทั้งหมด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Macroscopic (colony) morphology",
        "source": "Principle of bacterial diagnosis in clinical p.19-20",
        "body": [
          {
            "bullets": [
              "Size",
              "Shape",
              "Color (Pigment)",
              "Surface appearance",
              "**Hemolysis**"
            ]
          },
          {
            "text": "สไลด์ยกรูป colony ของ **Salmonella Enteritidis** เป็นตัวอย่าง และมีสไลด์ Hemolysis เป็นรูปล้วน ไม่ได้เขียนชนิดของ hemolysis เป็นตัวอักษร"
          }
        ]
      },
      {
        "heading": "หลักการของ phenotypic based identification",
        "source": "Principle of bacterial diagnosis in clinical p.21-22",
        "body": [
          {
            "text": "สไลด์เรียงหลักการเป็น 4 ขั้น ซึ่งเป็นโครงเดียวกับที่ใช้ในทุก test ที่เหลือของเด็ค"
          },
          {
            "bullets": [
              "**Selection และ inoculation of the test**",
              "**Incubation for substrate utilization**",
              "**Detection of metabolic activity**",
              "**Analysis of metabolic profile**"
            ]
          },
          {
            "sub": "phenotypic criteria ที่ใช้บ่อยที่สุด",
            "body": [
              {
                "bullets": [
                  "Environmental requirement for growth",
                  "Microscopic morphology และ staining characteristics",
                  "Nutritional requirements และ metabolic capabilities"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โครงของ Phenotypic Bacterial Identification: Primary กับ Secondary test",
        "source": "Principle of bacterial diagnosis in clinical p.23, 28, 47",
        "body": [
          {
            "text": "สไลด์ย้ำโครงนี้ซ้ำสองครั้ง (p.23 และ p.28) แล้วค่อยไล่ test ทีละอัน ให้ใช้หน้านี้เป็นสารบัญของครึ่งหลังทั้งเด็ค"
          },
          {
            "sub": "Primary Test",
            "body": [
              {
                "bullets": [
                  "**Gram's staining และ Cell Morphology**",
                  "**Environmental requirement for growth**",
                  "**Catalase test**",
                  "**Oxidase test**",
                  "**Oxidative-Fermentative test (O/F test)**",
                  "**Motility test**"
                ]
              }
            ]
          },
          {
            "sub": "Secondary test",
            "body": [
              {
                "bullets": [
                  "Other enzymatic-based tests",
                  "Other metabolic capability tests"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Microscopic morphology และ staining characteristics",
        "source": "Principle of bacterial diagnosis in clinical p.29-32",
        "body": [
          {
            "sub": "Microscopic Morphology",
            "body": [
              {
                "bullets": [
                  "Size",
                  "**Shape**: cocci, bacilli, coccobacilli, curve spiral, pleomorphic",
                  "**Arrangement**: diplococci, tetrad, cluster, palisade"
                ]
              }
            ]
          },
          {
            "sub": "Staining Characteristics",
            "body": [
              {
                "bullets": [
                  "**Gram negative และ Gram positive**",
                  "**Acid fast**",
                  "Spore",
                  "Capsule"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ Gram stain, Acid Fast stain และ Microscopic Morphology เป็นรูปล้วน ไม่มีขั้นตอนการย้อมเขียนไว้ในเด็คนี้"
          }
        ]
      },
      {
        "heading": "Environmental requirement for growth",
        "source": "Principle of bacterial diagnosis in clinical p.33",
        "body": [
          {
            "sub": "Atmospheres",
            "body": [
              {
                "bullets": [
                  "**Aerobic**",
                  "**Anaerobic**",
                  "**Microaerophilic**"
                ]
              }
            ]
          },
          {
            "sub": "Temperature",
            "body": [
              {
                "bullets": [
                  "**25 องศาเซลเซียส**",
                  "**37 องศาเซลเซียส**",
                  "**42 องศาเซลเซียส**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "OXIDASE TEST",
        "source": "Principle of bacterial diagnosis in clinical p.34-35",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถของเชื้อในการสร้าง **oxidase enzyme**"
              }
            ]
          },
          {
            "sub": "Reagent",
            "body": [
              {
                "text": "**Tetramethyl-p-phenylenediamine dihydrochloride (Oxidase Reagent)**"
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "**Positive: deep purple ภายใน 5-10 วินาที** หลัง culture สัมผัส oxidase reagent",
                  "**Negative: สีไม่เปลี่ยน หรือเปลี่ยนช้า (delay)**"
                ]
              }
            ]
          },
          {
            "callout": "กรอบเวลา 5-10 วินาที คือจุดที่สไลด์เน้น อ่านช้ากว่านั้นแล้วเห็นสีม่วงถือว่า negative ตามสไลด์",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "CATALASE TEST",
        "source": "Principle of bacterial diagnosis in clinical p.36-38",
        "body": [
          {
            "sub": "หลักการที่สไลด์ให้",
            "body": [
              {
                "bullets": [
                  "ระหว่าง **aerobic respiration** microorganism สร้าง hydrogen peroxide (สไลด์เขียนกำกับว่า toxic superoxide)",
                  "ถ้าสารนี้สะสมจะทำให้เชื้อตาย",
                  "เชื้อบางชนิดย่อยสลายสารนี้ด้วยเอนไซม์ได้ (**catalase หรือ peroxidase**)"
                ]
              }
            ]
          },
          {
            "sub": "Purpose และ reaction",
            "body": [
              {
                "text": "ดูความสามารถในการสร้าง **catalase** ที่ย่อย **2 H2O2 ไปเป็น 2 H2O + O2** (free oxygen)"
              }
            ]
          },
          {
            "sub": "Interpretation (SLIDE TEST)",
            "body": [
              {
                "bullets": [
                  "**Positive: มี gas bubbles**",
                  "**Negative: ไม่มี gas bubbles**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "OXIDATIVE FERMENTATIVE TEST (O/F test)",
        "source": "Principle of bacterial diagnosis in clinical p.39-42",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูว่าเชื้อใช้ carbohydrate แบบไหน ใช้แบบ aerobic เรียก **oxidation / oxidative / oxidizer** ใช้แบบ anaerobic เรียก **fermentation / fermentative / fermenter** ถ้าใช้ไม่ได้ทั้งสองทางเรียก **non saccharolytic หรือ non utilizer**"
              }
            ]
          },
          {
            "sub": "Media และ Reagents",
            "body": [
              {
                "bullets": [
                  "**Hugh & Leifson's medium (O/F medium)**",
                  "**Sterile liquid paraffin**"
                ]
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "**Oxidative (O)**: หลอดเปิดเปลี่ยนจากเขียวเป็นเหลือง หลอดปิดไม่เปลี่ยน",
                  "**Fermentative (F)**: เปลี่ยนจากเขียวเป็นเหลืองทั้งหลอดปิดและหลอดเปิด",
                  "**Non utilizer (-)**: ไม่เปลี่ยนทั้งสองหลอด"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ใส่ remark ไว้ว่า สีตั้งต้นและสีที่เปลี่ยนของ O/F medium ขึ้นกับ indicator ที่ใส่ลงไปใน medium ฉะนั้นอย่าท่องแค่คู่เขียว-เหลือง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "MOTILITY TEST",
        "source": "Principle of bacterial diagnosis in clinical p.44-45",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถในการเคลื่อนที่ เชื้อที่เคลื่อนที่ด้วย **flagella** แสดงผลได้โดย inoculate ลง **semi-solid media** ส่วนเชื้อที่เคลื่อนที่แบบ **gliding หรือ flexioning** ต้องใช้เทคนิค **hanging drop preparation**"
              }
            ]
          },
          {
            "sub": "Interpretation ใน semi-solid agar",
            "body": [
              {
                "bullets": [
                  "**Positive: เชื้อขึ้นและกระจายเป็น brush shape like turbidity**",
                  "**Negative: เชื้อขึ้นเฉพาะบริเวณ stab ไม่กระจาย**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Sugar assimilation test",
        "source": "Principle of bacterial diagnosis in clinical p.48-51",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถในการใช้ carbohydrate (sugars) ชนิดจำเพาะ แล้วเกิดเป็นกรด"
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "bullets": [
                  "inoculate เชื้อลงใน lactose broth",
                  "**incubate 37 องศาเซลเซียส 24 ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "**Positive: สีเหลือง**",
                  "**Negative: สีเขียว (no acid)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "UREASE TEST",
        "source": "Principle of bacterial diagnosis in clinical p.52-55",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถในการสร้าง **urease** ซึ่งบ่งว่าเชื้อใช้ **urea เป็น sole source of nitrogen** ได้ ผลของปฏิกิริยาเหลือ **ammonia จึงทำให้เป็นด่าง (alkalinity)**"
              }
            ]
          },
          {
            "sub": "Reaction",
            "body": [
              {
                "text": "Urea + 2H2O ผ่าน urease ได้เป็น CO2 + H2O + 2NH3 (ammonia, alkaline)"
              }
            ]
          },
          {
            "sub": "Media และ Method",
            "body": [
              {
                "bullets": [
                  "**Urea agar slants**",
                  "inoculate เชื้อบน urea agar slant แล้ว **incubate 37 องศาเซลเซียส 24 ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "**Positive: มี growth และสีชมพู (pink)**",
                  "**Negative: มี growth แต่ยังเป็นสีเหลือง**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "AMINO ACID DECARBOXYLATION TEST",
        "source": "Principle of bacterial diagnosis in clinical p.56-60",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถในการสร้าง **decarboxylase** ที่ตัด carboxyl bond ของ amino acid แล้วได้ **amine**"
              }
            ]
          },
          {
            "sub": "Media และ Reagents",
            "body": [
              {
                "bullets": [
                  "หลอด **Arginine (arg.) ADM**",
                  "หลอด **Lysine (lys.) ADM**",
                  "หลอด **Ornithine (orn.) ADM**",
                  "หลอด **Control ADM**",
                  "**Sterile liquid paraffin**"
                ]
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "bullets": [
                  "**ปิดหลอด ADM ทุกหลอดด้วย liquid paraffin**",
                  "inoculate เชื้อลงในหลอด arg. ADM คู่กับ control, หลอด lys. ADM คู่กับ control และหลอด orn. ADM คู่กับ control",
                  "incubate ทุกหลอดที่ **37 องศาเซลเซียส 24 ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "text": "สไลด์อธิบาย reaction ว่า **กรดที่เกิดจาก glucose fermentation เป็นตัวกระตุ้นปฏิกิริยา decarboxylation**"
              },
              {
                "bullets": [
                  "**Positive: สีม่วง (purple) และมี growth**",
                  "**Negative: สีเหลือง และมี growth**",
                  "**Control: สีเหลือง และมี growth**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "NITRATE REDUCTION TEST",
        "source": "Principle of bacterial diagnosis in clinical p.61-65",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถของเชื้อในการ **reduce nitrate เป็น nitrite** บางตัวลดต่อไปได้เป็น nitrogen, nitrous oxide หรือ ammonia ซึ่งสไลด์เรียกรวมว่า gas ทั้งหมดนี้เป็นการทำงานของ **nitrate reductase**"
              }
            ]
          },
          {
            "sub": "Media และ Reagents",
            "body": [
              {
                "bullets": [
                  "Nitrate broth 3 หลอด",
                  "**Solution A: sulfanilic acid ใน 5 N acetic acid**",
                  "**Solution B: alpha-naphthylamine ใน 5 N acetic acid**",
                  "**Zinc dust**"
                ]
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "text": "inoculate เชื้อลงในแต่ละหลอด nitrate broth แล้ว **incubate 37 องศาเซลเซียส 24 ชั่วโมง**"
              }
            ]
          },
          {
            "sub": "การอ่านผลทีละขั้น",
            "body": [
              {
                "bullets": [
                  "หยด solution A และ B อย่างละ 5-10 หยด",
                  "**ถ้าเกิดสีแดงเข้มทันที = มี nitrite (positive, +)**",
                  "**ถ้ายังใส ให้เติม zinc dust ถ้าแล้วเกิดสีแดง แปลว่า nitrate ถูกรีดิวซ์โดย zinc ไม่ใช่โดยเชื้อ = negative (-)**",
                  "**ถ้าเติม zinc แล้วยังใส แปลว่า nitrate ถูกรีดิวซ์ไปเป็น gas = positive (+)**"
                ]
              }
            ]
          },
          {
            "sub": "Interpretation ตามสัญลักษณ์บนสไลด์",
            "body": [
              {
                "bullets": [
                  "**+ = present of nitrite**",
                  "**++ = present of gas**",
                  "**- = no reduction**"
                ]
              }
            ]
          },
          {
            "callout": "ขั้น zinc dust คือหัวใจของ test นี้ หลอดที่ใสหลังหยด A และ B ยังตัดสินไม่ได้ ต้องเติม zinc ก่อนถึงจะรู้ว่าเป็น negative จริงหรือเป็น positive ที่ลดต่อไปจนเป็น gas",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Indole Test",
        "source": "Principle of bacterial diagnosis in clinical p.66-69",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถในการสร้าง **indole** จาก amino acid **tryptophan** (สไลด์บรรยาย indole ว่าเป็น the volatile alcohol)"
              }
            ]
          },
          {
            "sub": "Media และ Reagents",
            "body": [
              {
                "bullets": [
                  "**Indole (tryptone water) broth**",
                  "**Kovac's reagent**"
                ]
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "text": "inoculate เชื้อลงใน indole broth แล้ว incubate 24 ชั่วโมง (สไลด์เว้นอุณหภูมิไว้ ไม่ได้ระบุ)"
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "ก่อนอ่านผล **หยด Kovac's reagent 5-8 หยด แล้วเขย่าให้เข้ากัน**",
                  "**Positive: สีแดงใน alcohol layer**",
                  "**Negative: สีเหลืองใน alcohol layer**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "METHYL RED (MR) TEST",
        "source": "Principle of bacterial diagnosis in clinical p.70-72",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถในการ **ferment glucose ใน glucose phosphate medium จนได้กรดที่ pH ต่ำ (ประมาณ 4.5 หรือต่ำกว่า)**"
              }
            ]
          },
          {
            "sub": "Media และ Reagents",
            "body": [
              {
                "bullets": [
                  "**Clark and Lubs (MR-VP) medium**",
                  "**Methyl red solution (MR reagent)**"
                ]
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "text": "inoculate เชื้อลงใน MR-VP medium แล้ว **incubate 37 องศาเซลเซียส 24 ชั่วโมง**"
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "หยด **MR reagent 3-5 หยด**",
                  "**Positive: สีแดง**",
                  "**Negative: สีส้มหรือเหลือง**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "VOGES-PROSKAUER (V-P) TEST",
        "source": "Principle of bacterial diagnosis in clinical p.73-76",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถในการ ferment glucose ใน glucose phosphate medium **แล้วเปลี่ยนต่อไปเป็น acetylmethylcarbinol หรือที่เรียกว่า acetoin**"
              }
            ]
          },
          {
            "sub": "Media และ Reagents",
            "body": [
              {
                "bullets": [
                  "**Clark & Lubs (MR-VP) medium** ใช้ medium เดียวกับ MR test",
                  "**Potassium hydroxide 40% solution**",
                  "**Alpha-naphthol in alcoholic solution**"
                ]
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "text": "inoculate เชื้อลงใน MR-VP medium แล้ว **incubate 37 องศาเซลเซียส 24 ชั่วโมง**"
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "หยด **40% KOH 6 หยด และ alpha-naphthol 10 หยด** แล้วผสมให้เข้ากัน",
                  "**วางหลอดเอียง (decline position) ทิ้งไว้ 10-20 นาที**",
                  "**Positive: สีแดงเข้ม (deep red)**",
                  "**Negative: สีน้ำตาล (brown)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "CITRATE UTILIZATION TEST",
        "source": "Principle of bacterial diagnosis in clinical p.77-79",
        "body": [
          {
            "sub": "Purpose",
            "body": [
              {
                "text": "ดูความสามารถของเชื้อในการใช้ **citrate เป็น sole source of carbon** สำหรับ metabolism ผลลัพธ์ทำให้เกิดสภาพเป็นด่าง"
              }
            ]
          },
          {
            "sub": "Media",
            "body": [
              {
                "text": "**Simmons citrate agar slant** 2 หลอด"
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "text": "inoculate colony ของเชื้อลงบน citrate agar slant แล้ว **incubate 37 องศาเซลเซียส 24 ชั่วโมง**"
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "**Positive: มี growth และ slant เป็นสีน้ำเงินเข้ม (deep blue)**",
                  "**Negative: ไม่มี growth และยังเป็นสีเขียว**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "TRIPLE SUGAR IRON AGAR (TSI) TEST",
        "source": "Principle of bacterial diagnosis in clinical p.81-88",
        "body": [
          {
            "sub": "Principle",
            "body": [
              {
                "text": "การ metabolism น้ำตาลจำเพาะที่ผสมอยู่ใน basal medium ทำให้เกิดกรดและแก๊ส หรือไม่เกิดก็ได้ ให้ปฏิกิริยาที่ซับซ้อน และอาจมีหรือไม่มี **H2S production** ร่วมด้วย"
              }
            ]
          },
          {
            "sub": "Purpose",
            "body": [
              {
                "bullets": [
                  "ดูความสามารถในการ **ferment น้ำตาลจำเพาะ พร้อมสร้างกรดและแก๊ส**",
                  "ดูความสามารถในการ **สร้าง H2S จาก sulfur amino acids**",
                  "**Differentiation among genus or species**"
                ]
              }
            ]
          },
          {
            "sub": "องค์ประกอบของ TSI",
            "body": [
              {
                "bullets": [
                  "**Glucose 0.1%**",
                  "**Lactose 1.0%**",
                  "**Saccharose 1.0%**",
                  "**Ferrous ion**",
                  "**Phenol red เป็น indicator**"
                ]
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "bullets": [
                  "ใช้ **inoculating needle** เขี่ย colony แล้ว **stab ลงใน butt และ streak บน slant**",
                  "**incubate 37 องศาเซลเซียส 18-24 ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "sub": "อักษรย่อในการอ่านผล อ่านจาก slant ไป butt",
            "body": [
              {
                "bullets": [
                  "**K (Alkaline) = alkaline ที่ slant**",
                  "**A (Acid) = acid ที่ slant และหรือ butt**",
                  "**B (Blackening) = hydrogen sulfide (H2S)**",
                  "**G (gases) = H2S และแก๊สอื่น**"
                ]
              }
            ]
          },
          {
            "sub": "Expression of the results ตัวอย่างที่สไลด์ให้",
            "body": [
              {
                "bullets": [
                  "**E. coli = A/A/-/-**",
                  "**S. sonnei = K/A/-/-**",
                  "**S. Enteritidis = K/A/B/-**",
                  "**A. faecalis = -/-/-/-**"
                ]
              }
            ]
          },
          {
            "callout": "หน้า TSI Interpretation เป็นตารางจับคู่ reaction กับ glucose, lactose, saccharose, H2S, gases แต่ text layer ของสไลด์ทำให้คอลัมน์เลื่อนจนอ่านคู่ไม่ครบ ให้กลับไปดูตารางจากรูปสไลด์จริงก่อนท่อง มีเชิงอรรถกำกับไว้ว่า (-)* มักหมายถึง + ในกรณีที่ H2S เป็น +",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "GLUCONATE TEST",
        "source": "Principle of bacterial diagnosis in clinical p.89-96",
        "body": [
          {
            "sub": "Principle",
            "body": [
              {
                "text": "ดูความสามารถของเชื้อในการ **oxidize gluconic acid เป็น sole carbon source** โดยรีดิวซ์สารประกอบไปเป็น **alpha-2-ketogluconate**"
              }
            ]
          },
          {
            "sub": "Purpose ใช้แยกอะไร",
            "body": [
              {
                "bullets": [
                  "แยก genus **Enterobacter ออกจาก E. coli**",
                  "แยก **Pseudomonas aeruginosa ออกจาก Pseudomonas sp. อื่น**"
                ]
              }
            ]
          },
          {
            "sub": "Media และ Reagents",
            "body": [
              {
                "bullets": [
                  "**Gluconate broth**",
                  "**Benedict's Reagent**"
                ]
              }
            ]
          },
          {
            "sub": "Method",
            "body": [
              {
                "bullets": [
                  "เขี่ย colony ลง inoculate ใน gluconate broth",
                  "**incubate 37 องศาเซลเซียส 24-48 ชั่วโมง**",
                  "ก่อนอ่านผล **หยด Benedict's Reagent 5-10 หยด แล้วต้มใน water bath 10 นาที**"
                ]
              }
            ]
          },
          {
            "sub": "Interpretation",
            "body": [
              {
                "bullets": [
                  "**Positive: ตะกอนหนา (heavy precipitation) สีน้ำตาลหรือเหลืองเข้ม**",
                  "**Negative: ใส หรือไม่มีตะกอน** (สไลด์อีกหน้าเขียนว่า negative เป็น solution สีเขียวหรือแดง ไม่มีตะกอน)"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างผลที่สไลด์ให้",
            "body": [
              {
                "bullets": [
                  "**P. aeruginosa: สีน้ำตาลและตะกอนหนา แปลว่า oxidize gluconic acid ได้**",
                  "**E. coli: ไม่มีตะกอน แปลว่า oxidize gluconic acid ไม่ได้**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "BILE ESCULIN AGAR",
        "source": "Principle of bacterial diagnosis in clinical p.97-98",
        "body": [
          {
            "bullets": [
              "เป็น medium ที่ใช้ identify **group D streptococci**",
              "เชื้อกลุ่มนี้ **โตได้ในภาวะที่มี bile** ซึ่งเป็น emulsifying agent ที่สร้างจากตับ",
              "group D streptococci ยัง **hydrolyze esculin ได้**",
              "**การ hydrolyze esculin ทำให้ medium กลายเป็นสีดำ ซึ่งคือผล positive** ส่วนเชื้ออื่นที่โตในภาวะมี bile ได้จะไม่ทำให้ medium ดำ",
              "medium สูตรดัดแปลงบางสูตรใส่ **sodium azide เพื่อยับยั้งการเจริญของแบคทีเรีย Gram-positive และ Gram-negative อื่นทั้งหมด**"
            ]
          },
          {
            "text": "หน้าถัดไปเป็นรูป BILE ESCULIN AGAR อย่างเดียว ไม่มีข้อความ"
          }
        ]
      },
      {
        "heading": "สิ่งที่เด็คนี้เปิดประเด็นไว้แต่ไม่ได้ตอบ",
        "source": "Principle of bacterial diagnosis in clinical p.2, 18",
        "body": [
          {
            "bullets": [
              "**Antimicrobial Susceptibility test** อยู่ในผังขั้นตอนหน้า 2 แต่ทั้งเด็คไม่มีสไลด์อธิบายวิธีทำหรือการอ่านผลเลย สไลด์ไม่ได้บอก",
              "**Selection of antibiotic for treatment of animal diseases** เป็นปลายทางของผัง แต่สไลด์ไม่ได้บอกเกณฑ์การเลือกยา",
              "**Genotypic identification** ระบุไว้แค่ G+C content และ nucleic acid base sequence analysis ไม่มีรายละเอียดวิธีการ",
              "การ **interpret ผล culture ว่าเชื้อที่ขึ้นเป็นตัวก่อโรคจริงหรือเป็น contaminant** สไลด์ไม่ได้บอก"
            ]
          },
          {
            "callout": "สไลด์รูปล้วนที่ text layer อ่านไม่ออกอยู่ที่หน้า 12, 24-27, 43, 46, 49, 57, 62 และ 80 หน้าเหล่านี้น่าจะเป็นรูปผลการทดสอบและตารางประกอบ ต้องเปิดไฟล์สไลด์ดูเอง อย่าเดาว่าไม่มีเนื้อหา",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "microbio-1--vaccination-against-viral-diseases": {
    "topic": "microbio-1--vaccination-against-viral-diseases",
    "title": "Vaccination against viral diseases",
    "icon": "🧬",
    "lecturer": "Aunyaratana Thontiravong, DVM, MS, PhD",
    "summary": "เด็คนี้ปูพื้น vaccination ของโรคไวรัสทั้งสาย เริ่มจากแยก passive กับ active immunization แล้วเข้า principle of vaccination ต่อด้วย traditional vaccine (modified-live กับ inactivated) พร้อมวิธี attenuation ข้อดีข้อเสียของแต่ละแบบและเรื่อง adjuvant จากนั้นไล่ new generation vaccine 7 แบบ (subunit, VLPs, gene deleted/marker, virus-vectored, DNA, mRNA, reverse genetic) และปิดท้ายด้วย failures in vaccination p.3 และ p.6 มีแค่หัวข้อ Types of immunization กับ citation ของ Tizard ไม่มีข้อความอธิบาย ส่วน p.8 คือหน้าที่ประกาศการแบ่งประเภทวัคซีน มีข้อความว่า Types of viral vaccine แล้วแยกเป็นสองตระกูลคือ New generation vaccine และ Traditional vaccine และ reverse genetic vaccine (p.26) มีแต่ลิงก์รูปอย่างเดียวไม่มีเนื้อความเลย จึงบันทึกไว้ตามที่สไลด์มีจริง",
    "sections": [
      {
        "heading": "โครงของ lecture นี้",
        "source": "Vaccination against viral diseases p.2",
        "body": [
          {
            "text": "สไลด์ outline วางหัวข้อไว้ 4 ก้อน ใช้เป็นแผนที่อ่านทั้งเด็ค"
          },
          {
            "bullets": [
              "Types of immunization: passive immunization และ active immunization",
              "Principle of vaccination",
              "Types of viral vaccine: **traditional vaccine** (killed / inactivated, live attenuated) และ **new generation vaccine** (subunit, gene deleted, virus-vectored, DNA และ mRNA vaccines ฯลฯ)",
              "Failures in vaccination"
            ]
          }
        ]
      },
      {
        "heading": "Passive immunization",
        "source": "Vaccination against viral diseases p.4",
        "body": [
          {
            "text": "**Passive immunization คือการถ่าย preformed antibodies จากสัตว์ที่ต้านทานโรคไปให้สัตว์ที่ไวต่อโรค** ได้ภูมิคุ้มกันชั่วคราว เป็น HMI (antibodies) เป็นหลัก ป้องกันได้ทันที แต่ภูมิที่ได้อยู่ได้ไม่นาน"
          },
          {
            "sub": "1. Artificial passive immunity (injection of antibody)",
            "body": [
              {
                "text": "ใช้ hyperimmune serum คือ serum ที่มี anti-viral specific antibody อยู่"
              },
              {
                "text": "ตัวอย่างในสไลด์: การให้ HRIG/ERIG แก่คนที่ถูกสัตว์สงสัยเป็นโรคพิษสุนัขบ้ากัด"
              }
            ]
          },
          {
            "sub": "2. Natural passive immunity",
            "body": [
              {
                "text": "คือ maternal derived antibody (MDA)"
              },
              {
                "bullets": [
                  "Primates ผ่าน placenta เป็น IgG",
                  "สัตว์เลี้ยงส่วนใหญ่ผ่าน colostrum และเป็น IgG เป็นหลัก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Active immunization",
        "source": "Vaccination against viral diseases p.5",
        "body": [
          {
            "text": "**Active immunization คือการให้ antigen แก่สัตว์เพื่อให้ร่างกายสัตว์สร้าง immune response ขึ้นเอง** ภูมิเกิดช้ากว่า passive แต่อยู่ได้นานและมี immunological memory"
          },
          {
            "bullets": [
              "1. Natural infection",
              "2. Artificial immunization หรือ vaccination"
            ]
          },
          {
            "text": "ในกรณี vaccination จะใช้ vaccine ที่มี live หรือ dead organisms เพื่อกระตุ้น specific immune response ต่อไวรัส **โดยไม่ผ่านกระบวนการก่อโรค (without the course of causing pathogenesis)**"
          }
        ]
      },
      {
        "heading": "Principle of vaccination",
        "source": "Vaccination against viral diseases p.7",
        "body": [
          {
            "bullets": [
              "ถือเป็นวิธีที่ดีที่สุดในการป้องกันโรคไวรัส (the best way for viral disease prevention)",
              "เป้าหมายคือกระตุ้น adaptive immune responses ทั้ง **HMI และ CMI** ที่จำเพาะต่อไวรัสนั้น เพื่อป้องกันสัตว์เมื่อมี reinfection ด้วยไวรัสตัวเดียวกัน",
              "หลักคือ **เลียนแบบการติดเชื้อไวรัสตามธรรมชาติ แต่ไม่ก่อ pathogenesis**"
            ]
          }
        ]
      },
      {
        "heading": "Modified-live (live-attenuated) virus vaccine",
        "source": "Vaccination against viral diseases p.9-10",
        "body": [
          {
            "text": "Traditional vaccine ในเด็คนี้มี 2 ตัว คือ modified-live (live-attenuated) virus vaccine และ inactivated (killed) virus vaccine"
          },
          {
            "bullets": [
              "**สร้างโดยลด virulence ของ wild-type virus จนได้ avirulent mutant virus แต่ไวรัสยังมีชีวิต (viable) อยู่**",
              "ไวรัสวัคซีน replicate ในตัวสัตว์ที่ได้รับ จึงกระตุ้น immune response ที่อยู่ได้นาน โดยก่อโรคน้อยมากหรือไม่ก่อเลย",
              "กระตุ้นได้ทั้ง humoral และ cell-mediated immune responses"
            ]
          }
        ]
      },
      {
        "heading": "วิธีทำ attenuated virus vaccine",
        "source": "Vaccination against viral diseases p.11",
        "body": [
          {
            "sub": "จาก naturally occurring attenuated viruses",
            "body": [
              {
                "bullets": [
                  "ใช้ low virulent strains ที่เป็น naturally-occurring mutants",
                  "ใช้ไวรัสจาก different host เช่น smallpox vaccination"
                ]
              }
            ]
          },
          {
            "sub": "จากการ attenuation ของ wild-type viruses",
            "body": [
              {
                "text": "**หลักคือทำให้ wild-type virus ปรับตัวไปโตใน unusual host จนสูญเสียการปรับตัวต่อ host เดิมของมัน**"
              },
              {
                "bullets": [
                  "Serial passage in heterologous host เช่น **CSFV passage ในกระต่าย**",
                  "Serial passage in cultured cells เช่น **CDV vaccine passage ใน MDCK cells**",
                  "Selection of cold adapted mutants เช่น equine influenza vaccine ในม้า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ข้อดีและข้อเสียของ modified-live virus vaccine",
        "source": "Vaccination against viral diseases p.12",
        "body": [
          {
            "sub": "Advantages",
            "body": [
              {
                "bullets": [
                  "ใช้จำนวนโดสน้อยกว่าและใช้ปริมาณ virus antigen น้อยกว่า",
                  "กระตุ้นทั้ง humoral และ cell-mediated immune response",
                  "ไม่จำเป็นต้องใช้ adjuvant",
                  "โอกาสเกิด hypersensitivity น้อยกว่า",
                  "ป้องกันได้เร็วกว่าและนานกว่า"
                ]
              }
            ]
          },
          {
            "sub": "Disadvantages",
            "body": [
              {
                "bullets": [
                  "**มีโอกาส reversion to virulence**",
                  "อาจมี residual virulence เหลืออยู่",
                  "เสี่ยงแพร่ตามธรรมชาติไปยังสัตว์ที่ไม่ได้ทำวัคซีน",
                  "เสี่ยงต่อการปนเปื้อน unwanted organisms",
                  "อาจทำให้โรครุนแรงขึ้นในสัตว์ที่ immunosuppressive",
                  "เสี่ยงทำให้แท้งหรือเกิด transient infertility",
                  "ต้องระวังในการเตรียม เก็บรักษา และ handling เพื่อไม่ให้ไวรัสตาย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Inactivated (killed) virus vaccine",
        "source": "Vaccination against viral diseases p.13",
        "body": [
          {
            "text": "**ทำจาก natural virulent virus ที่ถูก inactivate ด้วย chemical หรือ physical agents เพื่อทำลาย infectivity แต่ยังคง immunogenicity ไว้ (ไม่ทำให้ antigen เปลี่ยนไป)**"
          },
          {
            "bullets": [
              "Physical methods: UV light",
              "Chemical agents: formalin, beta propriolactone เป็นต้น"
            ]
          },
          {
            "bullets": [
              "ต้องมี booster และต้องใช้ antigen ปริมาณมาก",
              "กระตุ้น HMI เป็นหลัก",
              "ให้ร่วมกับ adjuvant เพื่อเสริม immune response"
            ]
          }
        ]
      },
      {
        "heading": "Adjuvant",
        "source": "Vaccination against viral diseases p.14-15",
        "body": [
          {
            "text": "Adjuvant แปลว่า to help คือ **สารที่เสริม immune response ต่อวัคซีน** สไลด์ให้กลไกไว้ 3 ข้อ"
          },
          {
            "bullets": [
              "ยืดกระบวนการ antigen degradation ให้นานขึ้น",
              "ชักนำและเรียก immune cells เข้ามาที่ตำแหน่งที่ antigen สะสมอยู่",
              "ทำให้ใช้จำนวนโดสและปริมาณ virus vaccine น้อยลง"
            ]
          },
          {
            "sub": "ชนิดของ adjuvant ตามวิธีนำเสนอ antigen ต่อ immune system",
            "body": [
              {
                "bullets": [
                  "Depot adjuvants เช่น aluminum salts, water-in-oil emulsion (Freund's incomplete adjuvant)",
                  "Particulate adjuvants เช่น emulsions, microparticles, ISCOM, liposome",
                  "Immunostimulatory adjuvants เช่น microbial products, saponin",
                  "Combined adjuvants เช่น **Freund's complete adjuvant = Mycobacterium spp. ผสมใน water-in-oil emulsion**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ข้อดีและข้อเสียของ inactivated (killed) virus vaccine",
        "source": "Vaccination against viral diseases p.16",
        "body": [
          {
            "sub": "Advantages",
            "body": [
              {
                "bullets": [
                  "ไม่ค่อยก่อโรคจาก residual virulence",
                  "**ไม่มีความเสี่ยง reversion**",
                  "ไม่ค่อยมี live contaminating organisms ปนมา",
                  "ไม่แพร่ไปยังสัตว์ตัวอื่น",
                  "ปลอดภัยในสัตว์ immunodeficient หรือสัตว์ตั้งท้อง",
                  "เก็บได้นานและเก็บรักษาง่ายกว่า"
                ]
              }
            ]
          },
          {
            "sub": "Disadvantages",
            "body": [
              {
                "bullets": [
                  "**โดยทั่วไปไม่กระตุ้น CMI**",
                  "ต้องใช้ antigen ปริมาณมากเพื่อกระตุ้นภูมิคุ้มกัน",
                  "มีโอกาสเกิด allergic reactions และ post vaccination lumps จาก adjuvant มากกว่า",
                  "ภูมิขึ้นช้าและอยู่ได้ระยะสั้น",
                  "ต้อง booster เป็นระยะเพื่อคงภูมิคุ้มกัน"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์หน้านี้จัดเป็นสองคอลัมน์ ข้อความในไฟล์จึงสลับกันไปมา แต่คู่ advantage และ disadvantage ที่จับคู่ได้ตรงกันคือชุดที่สรุปไว้ข้างบน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ข้อจำกัดของ traditional vaccine",
        "source": "Vaccination against viral diseases p.17",
        "body": [
          {
            "bullets": [
              "ไวรัสบางตัวเลี้ยงในสัตว์หรือ cell culture ไม่ได้ จึงยังไม่มีวัคซีน",
              "มี residual virulence จากการ kill หรือ attenuate ไม่เพียงพอ",
              "**attenuated strains มีโอกาส reversion to virulence**",
              "ไม่ใช่ทุกโรคไวรัสที่ป้องกันได้ด้วย traditional vaccine เพราะไวรัสบางตัวมี mutation rate สูง เช่น HIV, hepatitis C virus",
              "การผลิตวัคซีนมีต้นทุนสูง",
              "shelf life จำกัดและต้องแช่เย็น"
            ]
          }
        ]
      },
      {
        "heading": "New generation vaccine มีอะไรบ้าง",
        "source": "Vaccination against viral diseases p.18",
        "body": [
          {
            "bullets": [
              "Subunit vaccine",
              "Virus like particles (VLPs)",
              "Gene deleted หรือ marker vaccine",
              "Virus-vectored vaccine",
              "DNA vaccine",
              "mRNA vaccine",
              "Reverse genetic vaccine"
            ]
          }
        ]
      },
      {
        "heading": "Subunit vaccine",
        "source": "Vaccination against viral diseases p.19",
        "body": [
          {
            "text": "**Subunit vaccine ประกอบด้วย viral protein หนึ่งตัวหรือมากกว่า แต่ไม่ใช่โปรตีนทั้งหมดของไวรัส**"
          },
          {
            "bullets": [
              "Traditional: purified subunit",
              "Recombinant: recombinant subunit"
            ]
          }
        ]
      },
      {
        "heading": "Virus like particles (VLPs) หรือ virosomes",
        "source": "Vaccination against viral diseases p.20",
        "body": [
          {
            "bullets": [
              "**อนุภาคมีลักษณะเหมือน virion แต่ไม่มี viral nucleic acid อยู่ข้างใน**",
              "ปลอดภัยกว่าวัคซีนที่มี modified-live หรือ killed viruses",
              "ตัวอย่างในสไลด์: HBV vaccine, HPV vaccine"
            ]
          }
        ]
      },
      {
        "heading": "Gene deleted หรือ marker vaccine",
        "source": "Vaccination against viral diseases p.21",
        "body": [
          {
            "text": "**ทำโดยลบ non-essential genes ที่มีส่วนทำให้เกิด virulence ออก**"
          },
          {
            "bullets": [
              "ตัวอย่างคือ herpesvirus vaccines เช่น **TK และ gE deleted pseudorabies vaccine ในสุกร**",
              "เป็น **DIVA vaccine (Differentiation of infected from vaccinated animals)**",
              "ช่วยในโปรแกรมกำจัดโรค (eradication program) ด้วย"
            ]
          }
        ]
      },
      {
        "heading": "Virus-vectored vaccine",
        "source": "Vaccination against viral diseases p.22",
        "body": [
          {
            "bullets": [
              "**นำยีนที่ควบคุม protective antigens ของไวรัสก่อโรค ใส่เข้าไปใน genome ของ avirulent virus recombinant vector** เช่น poxviruses, adenoviruses, herpesviruses",
              "ใช้ recombinant virus ตัวใหม่นั้นเป็นวัคซีนเลย",
              "เมื่อเข้าไปติดเชื้อ ไวรัสตัวใหม่จะแสดงออกและกระตุ้น immune response ทั้งต่อ virus vector และต่อ antigen ที่ใส่เข้าไป",
              "ตัวอย่าง: vaccinia-vectored rabies vaccine, HVT-vectored NDV F / AIV H5 / IBDV VP2 vaccine"
            ]
          }
        ]
      },
      {
        "heading": "DNA vaccine",
        "source": "Vaccination against viral diseases p.23",
        "body": [
          {
            "text": "**ฉีด plasmid DNA เข้าตัวสัตว์โดยตรง** ตัวอย่างที่สไลด์ยกคือ West Nile virus commercial vaccine ในม้า"
          },
          {
            "bullets": [
              "1. สร้าง recombinant plasmids ที่มี DNA ซึ่ง encode key viral antigens",
              "2. ฉีด recombinant plasmid เข้าสัตว์ แล้วให้ host cells รับเข้าไป โดยให้ทาง IM หรือ gene gun",
              "3. DNA ถูก transcribe และ translate เป็น endogenous viral proteins ใน human หรือ mammalian cells",
              "4. **กระตุ้นได้ทั้ง CMI และ HMI**"
            ]
          },
          {
            "callout": "Major concern ของ DNA vaccine ตามสไลด์คือโอกาส integration เข้า host genome และระดับ immunogenicity",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "mRNA vaccine",
        "source": "Vaccination against viral diseases p.24-25",
        "body": [
          {
            "text": "**ส่ง mRNA ที่ encode key viral antigens เข้าไปในตัวสัตว์**"
          },
          {
            "sub": "Concept ตามลำดับที่สไลด์เขียน",
            "body": [
              {
                "bullets": [
                  "สร้าง recombinant plasmids ที่มี DNA ซึ่ง encode key viral antigens",
                  "In vitro transcribe ให้เป็น mRNA",
                  "ส่ง mRNA เข้าสัตว์ แล้วให้ host cells รับเข้าไป",
                  "mRNA ถูก translate เป็น endogenous viral proteins ใน human หรือ mammalian cells",
                  "**กระตุ้นได้ทั้ง CMI และ HMI**"
                ]
              }
            ]
          },
          {
            "sub": "2 รูปแบบของ mRNA vaccine",
            "body": [
              {
                "bullets": [
                  "Conventional mRNA vaccine ที่ encode key viral antigens",
                  "**Self-amplifying mRNA vaccine หรือ replicon** มาจาก genome ของ (+) ssRNA virus โดย encode ทั้ง key viral antigens และ viral nonstructural proteins (RdRp) จึงเพิ่มจำนวนตัวเองได้ ทำให้ได้ mRNA ที่ encode antigen หลายชุด และผลิต antigen ได้ในระดับสูง"
                ]
              }
            ]
          },
          {
            "callout": "Major concern ของ mRNA vaccine ตามสไลด์คือ instability และ low immunogenicity",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Reverse genetic vaccine",
        "source": "Vaccination against viral diseases p.26",
        "body": [
          {
            "text": "สไลด์หน้านี้มีแค่หัวข้อ Reverse genetic vaccine กับลิงก์รูปแผนภาพเท่านั้น **ไม่มีข้อความอธิบายกลไกเลย สไลด์ไม่ได้บอก** ว่า reverse genetics ทำอย่างไรหรือใช้กับไวรัสตัวใด รู้เพียงว่ามันถูกจัดอยู่ในกลุ่ม new generation vaccine ตามที่ระบุไว้ใน p.18"
          }
        ]
      },
      {
        "heading": "Failures in vaccination",
        "source": "Vaccination against viral diseases p.27",
        "body": [
          {
            "sub": "Incorrect administration",
            "body": [
              {
                "bullets": [
                  "Live vaccine ตาย จากการเก็บรักษาไม่ดี หรือใช้สารเคมีฆ่าเชื้อ syringe เป็นต้น",
                  "ให้ทาง nonconventional routes เช่น aerosol หรือผสมน้ำดื่ม"
                ]
              }
            ]
          },
          {
            "sub": "Failure to response",
            "body": [
              {
                "bullets": [
                  "Biological variation",
                  "สัตว์อยู่ในภาวะ immunosuppressed",
                  "**ให้วัคซีนในสัตว์ที่มี passive protection อยู่ คือ maternal antibody interference**"
                ]
              }
            ]
          },
          {
            "sub": "Others",
            "body": [
              {
                "bullets": [
                  "ให้วัคซีนช้าเกินไป สัตว์ติดเชื้อไปแล้ว",
                  "ใช้ strain หรือ organism ผิดตัว"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "microbio-1--veterinary-mycology-practical-assignment": {
    "topic": "microbio-1--veterinary-mycology-practical-assignment",
    "title": "Veterinary Mycology Practical Assignment (โจทย์ปฏิบัติการเชื้อรา)",
    "icon": "🍄",
    "summary": "เดคนี้ไม่ใช่ lecture เนื้อหา แต่เป็น assignment brief ของ CUVET 2024 ส่วนใหญ่เป็นเรื่องบริหารจัดการงาน คือ วัตถุประสงค์ของงาน ขั้นตอนที่ต้องทำในแล็บ แบบฟอร์มรายงาน 11 หัวข้อ ข้อกำหนดวิดีโอนำเสนอ 5 นาที เกณฑ์ให้คะแนน 100 คะแนน และการส่งงาน ส่วนที่เป็นเนื้อหา mycology จริงมีอยู่ไม่มาก คือ ใช้ SDA เป็น media, identify ด้วย colony morphology ร่วมกับ microscopic findings, ใช้ MALDI-TOF เมื่อระบุไม่ได้ และหน้าท้าย ๆ เป็นแนวปฏิบัติด้าน biosafety กับการป้องกัน contamination ตัวสไลด์ไม่ได้ระบุชื่อเชื้อรา อุณหภูมิ ระยะเวลา incubation หรือวิธีย้อมสีที่เจาะจงไว้เลย",
    "sections": [
      {
        "heading": "งานนี้ให้ทำอะไร (Assignment Objective + Stem)",
        "source": "Veterinary Mycology Practical Assignment p.1",
        "body": [
          {
            "text": "วัตถุประสงค์คือประเมิน knowledge และ skills ใน basic mycological practices ได้แก่ **sample collection, laboratory identification ผ่าน microscopic findings และ colony morphology, และการใช้ MALDI-TOF กับเชื้อราที่ระบุไม่ได้**"
          },
          {
            "text": "แต่ละกลุ่มจะได้รับ sample ที่แตกต่างกัน ซึ่งสงสัยว่ามี fungal organisms อยู่ งานคือต้องไปเก็บเอง identify เอง และวิเคราะห์เอง ด้วยเทคนิคและขั้นตอนที่ระบุไว้ในเอกสารนี้"
          },
          {
            "callout": "การ identification ใช้ทั้ง morphological และ microscopic analysis ก่อน **ถ้าระบุเชื้อไม่ได้ด้วยสองวิธีนี้ จึงใช้ MALDI-TOF mass spectrometry** ไม่ใช่ใช้ตั้งแต่แรก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Laboratory Directions: 4 ขั้นตอนที่ต้องทำ",
        "source": "Veterinary Mycology Practical Assignment p.1",
        "body": [
          {
            "sub": "Sample Collection",
            "body": [
              {
                "text": "ใช้ **aseptic technique** เก็บ sample ที่ได้รับมอบหมาย เก็บวัสดุตัวอย่างไว้ใน clean envelop หรือภาชนะแข็งที่สะอาด (hard clean container) ติด label ให้ถูกต้องและเก็บในภาชนะที่เหมาะสม"
              }
            ]
          },
          {
            "sub": "Culturing and Isolation",
            "body": [
              {
                "text": "เตรียม culture media ที่เหมาะสมคือ **SDA** แล้ว inoculate ด้วย sample จากนั้น incubate ภายใต้ recommended conditions เพื่อให้เชื้อราขึ้นได้ดีที่สุด"
              }
            ]
          },
          {
            "sub": "Morphological and Microscopic Analysis",
            "body": [
              {
                "text": "ดู colony characteristics ได้แก่ **color, texture, size** หลังปล่อยให้เจริญเป็นช่วงเวลาที่เหมาะสม จากนั้นเตรียม slide สำหรับ microscopic examination โดยย้อมสีตามความจำเป็นเพื่อดู fungal structures"
              }
            ]
          },
          {
            "sub": "MALDI-TOF Analysis (ถ้าจำเป็น)",
            "body": [
              {
                "text": "เตรียม sample สำหรับ MALDI-TOF ตาม manufacturer's instructions แล้ว analyze และ interpret spectral data เพื่อระบุชนิดเชื้อรา"
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกอุณหภูมิและระยะเวลา incubation ที่แน่นอน เขียนไว้แค่ recommended conditions และ appropriate period และไม่ได้ระบุว่าให้ย้อมด้วยสีอะไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Guidelines of Procedure ระหว่างทำงาน",
        "source": "Veterinary Mycology Practical Assignment p.2",
        "body": [
          {
            "bullets": [
              "Safety First: ใส่ PPE ที่เหมาะสมเสมอ และคำนึงถึง biosafety procedures",
              "Documentation: จดบันทึกละเอียดทุกการสังเกต รวมถึง **dates, culture conditions และ anomalies** ที่พบ",
              "Photography: ถ่ายภาพ sample ให้ชัดในทุกขั้นตอน เพื่อใช้ในการนำเสนอ",
              "Chemical and Reagent Handling: ต้องรู้จัก **MSDS** ของสารเคมีและ reagent ทุกตัวที่ใช้ และปฏิบัติตามวิธีใช้กับวิธีทิ้งที่ถูกต้อง"
            ]
          }
        ]
      },
      {
        "heading": "Exercise Form ข้อ 1-8 (สิ่งที่ต้องกรอกลงรายงาน)",
        "source": "Veterinary Mycology Practical Assignment p.2",
        "body": [
          {
            "bullets": [
              "1. Sample Information",
              "2. Sample ID",
              "3. Collection Date",
              "4. Sample Source",
              "5. Media Used",
              "6. Incubation Conditions",
              "7. Colony Description",
              "8. Microscopic Findings"
            ]
          },
          {
            "text": "สังเกตว่าฟอร์มบังคับให้แยก **Colony Description** กับ **Microscopic Findings** ออกจากกัน ตรงกับที่ Laboratory Directions บอกว่า identification ต้องใช้ทั้ง morphological และ microscopic analysis"
          }
        ]
      },
      {
        "heading": "Exercise Form ข้อ 9-11 (staining, MALDI-TOF, สรุปผล)",
        "source": "Veterinary Mycology Practical Assignment p.3",
        "body": [
          {
            "bullets": [
              "9. Staining Technique",
              "10. MALDI-TOF Analysis (if applicable) แยกเป็น a. Sample Preparation, b. Identified Fungus, c. Conclusion",
              "11. สรุปกระบวนการ identification ทั้งหมดและผลการระบุเชื้อขั้นสุดท้าย"
            ]
          },
          {
            "callout": "MALDI-TOF ในฟอร์มเขียนกำกับว่า if applicable แปลว่ากลุ่มที่ระบุเชื้อได้จาก morphology กับ microscopy แล้ว ไม่จำเป็นต้องทำส่วนนี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Final Examination: วิดีโอนำเสนอกลุ่ม 5 นาที",
        "source": "Veterinary Mycology Practical Assignment p.4",
        "body": [
          {
            "text": "แต่ละกลุ่มต้องทำ **video presentation ความยาว 5 นาที** อธิบายโปรเจกต์ของตัวเอง โดยต้องมีครบ 5 ส่วน"
          },
          {
            "bullets": [
              "Introduction: ภาพรวมสั้น ๆ ของ sample และแหล่งที่มา",
              "Methodology: อธิบายขั้นตอนตั้งแต่ sample collection, culturing, identification รวมถึง **การใช้เครื่องมือในห้องแล็บอย่างถูกต้อง**",
              "Results: แสดงรูป sample, microscopic images, colony morphology และผลจาก MALDI-TOF ถ้ามี",
              "Discussion: อธิบายลักษณะของเชื้อราที่ระบุได้ รวมถึงความเกี่ยวข้องและความสำคัญต่อ biomedical science",
              "Conclusion: สรุปผลสำคัญและอุปสรรคที่พบระหว่างทำงาน"
            ]
          }
        ]
      },
      {
        "heading": "Evaluation criteria (100 คะแนน)",
        "source": "Veterinary Mycology Practical Assignment p.4",
        "body": [
          {
            "bullets": [
              "Content Accuracy & Completeness = **20** ความถูกต้องของข้อมูลและความครบถ้วนของ sample details, procedures, fungal identification และความสำคัญของเชื้อ",
              "Technical Execution = **10** คุณภาพการผลิตวิดีโอ เสียงชัด ภาพนิ่งและชัด แสงเหมาะสม",
              "Use of Visual Aids = **20** ความชัดเจนและประสิทธิภาพของสื่อภาพ ทั้งรูป sample, diagrams, microscopic images ต้องช่วยให้เข้าใจเนื้อหา",
              "Presentation Structure = **15** การจัดลำดับที่เป็นเหตุเป็นผล มี introduction, methodology, results, discussion, conclusion",
              "Delivery & Communication = **15** ความชัดเจนของการบรรยาย จังหวะการพูด และการดึงความสนใจ ต้องฟังแล้วตามง่าย",
              "Creativity & Engagement = **10** ใช้ความสร้างสรรค์ดึงผู้ฟัง เช่น storytelling, interesting facts หรือ interactive element อย่าง quizzes หรือ polls",
              "Educational Value = **10** ให้ความรู้ผู้ฟังได้จริงเรื่องความสำคัญของเชื้อราต่อ biomedical science รวมถึง health implications"
            ]
          },
          {
            "text": "น้ำหนักคะแนนบอกว่าอะไรสำคัญ **Content Accuracy กับ Use of Visual Aids รวมกัน 40 คะแนน** มากกว่าคุณภาพการผลิตวิดีโอ (10) หลายเท่า"
          }
        ]
      },
      {
        "heading": "Submission Details",
        "source": "Veterinary Mycology Practical Assignment p.4",
        "body": [
          {
            "bullets": [
              "Due Date: **19th April, 2024**",
              "รูปแบบส่ง: อัปโหลด video clip ขึ้น shared files ที่ใช้ได้ แล้วส่งลิงก์เข้า Assignment ใน **MyCourseville**",
              "ต้องระบุรายชื่อสมาชิกกลุ่มทุกคนพร้อมส่วนที่แต่ละคนรับผิดชอบ"
            ]
          }
        ]
      },
      {
        "heading": "Enhanced Guidelines: การป้องกัน contamination และ biosafety",
        "source": "Veterinary Mycology Practical Assignment p.5",
        "body": [
          {
            "sub": "Safety and PPE",
            "body": [
              {
                "text": "ใส่ PPE ตลอดเวลา ได้แก่ lab coats, gloves และ eye protection เพื่อลดการสัมผัส fungal spores และสารเคมี และ **ใช้ face mask หรือ respirator เมื่อจัดการเชื้อราที่ก่อภูมิแพ้สูงหรือเป็น pathogen เพื่อไม่ให้สูดดม spores**"
              }
            ]
          },
          {
            "sub": "Work Area Preparation",
            "body": [
              {
                "text": "disinfect พื้นผิวทำงานทั้งก่อนและหลังทุกขั้นตอน และใช้ **laminar flow hood หรือ biosafety cabinet** ในการจัดการและเตรียม sample เพื่อให้ได้พื้นที่ปลอดเชื้อและกักละออง aerosols ไว้"
              }
            ]
          },
          {
            "sub": "Aseptic Technique",
            "body": [
              {
                "text": "ทำ aseptic technique อย่างเคร่งครัดตอนเก็บ ถ่าย และเพาะเชื้อ เพื่อกัน cross-contamination ระหว่าง sample และกันสิ่งปนเปื้อนจากสิ่งแวดล้อม และ **flame sterilize เครื่องมือทุกครั้งระหว่างการใช้ และเมื่อเปลี่ยนไปทำ sample หรือ media อื่น**"
              }
            ]
          },
          {
            "sub": "Sample Handling",
            "body": [
              {
                "text": "ลดเวลาที่ sample สัมผัสอากาศเปิดให้น้อยที่สุด และปิดภาชนะให้แน่นเสมอเมื่อไม่ได้ใช้และตอนเก็บรักษา"
              }
            ]
          },
          {
            "sub": "Waste Disposal",
            "body": [
              {
                "text": "ทิ้งของเสียทั้งหมดรวมถึง used media, gloves และ pipette tips ลงภาชนะ biohazard waste ที่กำหนด และ **autoclave ขยะเชื้อราก่อนทิ้งเพื่อฆ่า spores ที่ยังมีชีวิต** ไม่ให้ปนเปื้อนสู่สิ่งแวดล้อม"
              }
            ]
          },
          {
            "sub": "Incident Response",
            "body": [
              {
                "text": "ต้องมี protocol ชัดเจนสำหรับกรณีหกและการสัมผัสโดยอุบัติเหตุ เพื่อตอบสนองได้เร็วและลดความเสี่ยงการปนเปื้อนกับการสัมผัสเชื้อ"
              }
            ]
          },
          {
            "sub": "Equipment and Material Sterilization",
            "body": [
              {
                "text": "sterilize อุปกรณ์และวัสดุที่ใช้เก็บกับจัดการ sample อย่างสม่ำเสมอ ด้วย autoclave หรือ disinfectant ที่เหมาะสม และใช้ของ disposable เมื่อทำได้เพื่อลด cross-contamination"
              }
            ]
          },
          {
            "sub": "Culturing and Incubation",
            "body": [
              {
                "text": "ตรวจ culture สม่ำเสมอว่ามีสัญญาณของ contamination หรือไม่ ถ้าเจอให้ **แยก culture ที่ปนเปื้อนออกทันที** เพื่อกันการแพร่ และใช้ selective media กับ incubation conditions ที่เหมาะสมเพื่อกดการเจริญของเชื้อปนเปื้อน"
              }
            ]
          },
          {
            "sub": "Documentation and Training",
            "body": [
              {
                "text": "เก็บบันทึกทุกขั้นตอน ทุกการสังเกต และทุกเหตุการณ์ contamination อย่างละเอียด เพราะช่วยหาต้นตอและรูปแบบการปนเปื้อนได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "Training ของผู้ปฏิบัติงาน",
        "source": "Veterinary Mycology Practical Assignment p.6",
        "body": [
          {
            "text": "สไลด์หน้าสุดท้ายมีประโยคเดียวคือ ต้องมั่นใจว่าผู้ปฏิบัติงานทุกคนได้รับการ training อย่างทั่วถึงใน **mycological techniques, contamination prevention และ safety protocols**"
          }
        ]
      }
    ]
  },
  "microbio-1--viral-ag-detection": {
    "topic": "microbio-1--viral-ag-detection",
    "title": "Viral antigen detection (ICC/IHC และ FA)",
    "icon": "🧬",
    "lecturer": "Navapon Techakriengkrai, DVM, MSc, PhD",
    "summary": "เด็คนี้สอนการตรวจหา viral antigen ในตัวอย่างด้วย immunoassay ที่อาศัย antigen-antibody interaction แล้วอ่านผลผ่าน antibody ที่ถูก label ไว้ แบ่งเป็น Immunochemistry (ICC/IHC, label ด้วย enzyme) กับ Immunofluorescence (FA, label ด้วย fluorochrome) ครอบคลุมวัสดุที่ต้องใช้ การ fixation ความต่างของ monoclonal กับ polyclonal antibody ความต่างของ direct กับ indirect staining ที่มาของ secondary species-specific antibody และข้อดีข้อเสียของวิธี ทั้งนี้สไลด์หลายหน้าเป็นภาพล้วน (หน้าเครื่องมือ p.5-6 และภาพเปรียบเทียบผลย้อม p.8-10) ที่มีแค่ label สั้น ๆ กับเครดิตรูป ไม่มีคำอธิบายเป็นข้อความ และหน้าสุดท้ายเป็น Any question?",
    "sections": [
      {
        "heading": "หลักการของ viral antigen detection",
        "source": "Viral Ag detection p.2",
        "body": [
          {
            "text": "เป็น **immunoassay ที่อาศัย antigen-antibody interaction เพื่อ detect viral antigen ในตัวอย่างโดยตรง**"
          },
          {
            "bullets": [
              "ตัวอย่างที่สไลด์ระบุ: tissue sections, infected cell cultures หรือ fresh smear"
            ]
          },
          {
            "text": "หัวใจของวิธีคือ **viral antigen specific antibodies ถูก labelled ด้วย indicator** แล้วเราอ่านสัญญาณจาก indicator นั้น แผนภาพในสไลด์เรียงชั้นจากล่างขึ้นบนเป็น antigen แล้ว primary antibody แล้ว secondary antibody แล้ว reporter"
          },
          {
            "sub": "แบ่งตามชนิดของ indicator",
            "body": [
              {
                "bullets": [
                  "**Immunochemistry (ICC)** = Ab labelled with **enzyme**",
                  "**Immunofluorescence (FA)** = Ab labelled with **fluorochrome**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ระบบ label สองแบบ: enzyme กับ fluorochrome",
        "source": "Viral Ag detection p.3",
        "body": [
          {
            "sub": "Enzyme labelled antibody (ICC/IHC)",
            "body": [
              {
                "bullets": [
                  "Enzyme: **horseradish peroxidase (HRP)**",
                  "Substrate: **H2O2**",
                  "Chromogen: **diaminobenzidine (DAB)**"
                ]
              },
              {
                "text": "อ่านผลจาก **DAB precipitate** ที่เกิดขึ้นตรงตำแหน่งที่มี antigen ในแผนภาพ HRP ติดอยู่กับ secondary antibody"
              }
            ]
          },
          {
            "sub": "Fluorochrome labelled antibody (FA)",
            "body": [
              {
                "text": "แผนภาพเรียงเป็น antigen แล้ว primary antibody แล้ว secondary antibody ที่ติด fluorochrome จากนั้น **laser beam กระตุ้นให้เกิด emission แล้วอ่านด้วย fluorescent detector**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Materials ที่ต้องเตรียม",
        "source": "Viral Ag detection p.4",
        "body": [
          {
            "sub": "Specimens",
            "body": [
              {
                "bullets": [
                  "target organ",
                  "virus infected cell cultures",
                  "sample smear"
                ]
              }
            ]
          },
          {
            "sub": "Control specimens",
            "body": [
              {
                "bullets": [
                  "**negative control = negative for Ag**",
                  "**positive control = positive for Ag**"
                ]
              }
            ]
          },
          {
            "sub": "Antibodies",
            "body": [
              {
                "bullets": [
                  "direct vs. indirect",
                  "monoclonal vs. polyclonal"
                ]
              }
            ]
          },
          {
            "sub": "Specific equipment",
            "body": [
              {
                "bullets": [
                  "microtome / cryostat",
                  "fluorescent microscope"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สไลด์เครื่องมือ (ภาพล้วน)",
        "source": "Viral Ag detection p.5-6",
        "body": [
          {
            "text": "สองหน้านี้เป็นรูปเครื่องมือล้วน หัวสไลด์เขียนว่า Microtome & Cryostat (p.5) และ Fluorescent microscope (p.6) **ไม่มีข้อความอธิบายหลักการหรือวิธีใช้เครื่องในสไลด์**"
          }
        ]
      },
      {
        "heading": "Fixation",
        "source": "Viral Ag detection p.7",
        "body": [
          {
            "bullets": [
              "**fix tissue หรือ cells ให้ติดกับ glass slide**",
              "**increase permeability of cell membrane** เพื่อให้ penetrate เข้า cells หรือ tissue ได้",
              "**preserve cellular structure ก่อนที่ cell จะ react จนเกิด structural artifacts**"
            ]
          },
          {
            "text": "น้ำยาที่สไลด์ระบุ: **ethanol, methanol, acetone, carbon tetrachloride**"
          }
        ]
      },
      {
        "heading": "ภาพเปรียบเทียบ Immunochemical vs. Immunofluorescent",
        "source": "Viral Ag detection p.8-9",
        "body": [
          {
            "text": "สองหน้านี้เป็นภาพผลย้อมเทียบกันล้วน ๆ p.8 มี label ชนิดตัวอย่างว่าเป็น **effusion smear** (สองภาพ) และ **tissue biopsy** ส่วน p.9 ไม่มี label ชนิดตัวอย่าง มีแต่เครดิตรูป"
          },
          {
            "text": "เครดิตรูปที่ปรากฏ: Kipar, 2014 และ Litster, 2013 (p.8) กับ Kipar, 2014 และ Melzi, 2016 (p.9)"
          },
          {
            "callout": "สไลด์ไม่ได้เขียนข้อสรุปเป็นข้อความว่า ICC กับ FA ต่างกันอย่างไรในภาพเหล่านี้ ต้องดูรูปจริงจากสไลด์อาจารย์ประกอบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "H&E vs. IHC vs. FA",
        "source": "Viral Ag detection p.10",
        "body": [
          {
            "bullets": [
              "**H&E** ให้เห็น **negri bodies**",
              "**IHC** ย้อมติด **N protein**",
              "**FA** ย้อมติด **N protein**"
            ]
          },
          {
            "text": "เครดิตรูป: Chiou et al., 2015"
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าเป็นเชื้ออะไรหรือสัตว์ชนิดใด บอกแค่ว่าย้อมด้วยวิธีไหนแล้วเห็นอะไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Monoclonal vs. Polyclonal antibody",
        "source": "Viral Ag detection p.11",
        "body": [
          {
            "bullets": [
              "**Monoclonal** = antibody จาก **single clone ของ B cell** และ **specific ต่อ epitope เดียว**",
              "**Polyclonal** = **mixture ของ antibodies จากหลาย clone ของ B cell** แต่ละตัว specific ต่อ **epitope ที่ต่างกันบน antigen เดียวกัน**"
            ]
          }
        ]
      },
      {
        "heading": "Direct vs. Indirect detection",
        "source": "Viral Ag detection p.12",
        "body": [
          {
            "bullets": [
              "**Direct staining**: ใช้ **Ag-specific antibody ที่ conjugate กับ fluorochrome โดยตรง** (ชั้นเดียว: antigen แล้ว primary antibody ที่ติด reporter)",
              "**Indirect staining**: ใช้ **primary Ag-specific antibody แล้วตามด้วย secondary species-specific antibody ที่ conjugate กับ fluorochrome** (สองชั้น)"
            ]
          }
        ]
      },
      {
        "heading": "Direct detection protocol",
        "source": "Viral Ag detection p.13",
        "body": [
          {
            "text": "เริ่มจาก virus infected cell/tissue บน slide แล้วหยด **fluorochrome conjugated Ab** ลงไป"
          },
          {
            "bullets": [
              "**positive = มี Ag/Ab binding จึงได้ fluorescent signal**",
              "**negative = ไม่มี Ag/Ab binding จึงไม่มี signal**"
            ]
          }
        ]
      },
      {
        "heading": "Indirect detection protocol",
        "source": "Viral Ag detection p.14",
        "body": [
          {
            "text": "เริ่มจาก virus infected cell/tissue บน slide แล้วหยด **primary antigen specific antibody** ก่อน จากนั้นตามด้วย **fluorochrome conjugated secondary Ab**"
          },
          {
            "bullets": [
              "ขั้นแรก positive = มี Ag/Ab binding, negative = ไม่มี Ag/Ab binding",
              "ขั้นที่สอง **positive = มี 2' Ab binding จึงได้ fluorescent signal**, negative = ไม่มี 2' Ab binding จึงไม่มี signal"
            ]
          }
        ]
      },
      {
        "heading": "Secondary species-specific antibody มาจากไหน",
        "source": "Viral Ag detection p.15",
        "body": [
          {
            "text": "สไลด์ยกตัวอย่าง **rabbit anti-swine IgG conjugated with fluorochrome** โดยเรียงขั้นตอนว่า"
          },
          {
            "bullets": [
              "เริ่มจาก **purified swine IgG**",
              "ได้ **purified rabbit Ig ที่มี anti-swine IgG specificity**",
              "แล้วนำไป **conjugate rabbit anti-swine IgG กับ fluorochrome**"
            ]
          },
          {
            "text": "ในแผนภาพชั้นล่างสุดคือ antigen แล้ว primary antibody ซึ่งเป็น swine IgG ที่ **specific ต่อ viral antigen** ส่วน secondary antibody **specific ต่อ swine IgG** ไม่ใช่ต่อ virus"
          }
        ]
      },
      {
        "heading": "ทำไม indirect ถึงคุ้มกว่า",
        "source": "Viral Ag detection p.16",
        "body": [
          {
            "bullets": [
              "ใช้ **secondary species-specific antibody ที่ conjugate fluorochrome ตัวเดียว กับ primary antigen-specific antibodies ได้หลายชนิด**",
              "**cheaper**"
            ]
          },
          {
            "text": "ตัวอย่างในสไลด์: primary antibody ที่ specific ต่อ **CSFV antigen**, **PRRSV antigen** และ **PRV antigen** ต่างก็เป็น swine IgG จึงใช้ **rabbit IgG specific to swine IgG** ตัวเดียวกันอ่านได้ทั้งหมด"
          }
        ]
      },
      {
        "heading": "Signal amplification",
        "source": "Viral Ag detection p.17",
        "body": [
          {
            "text": "หน้านี้เทียบ direct FA กับ indirect FA ภายใต้หัวข้อ **signal amplification** โดยแผนภาพ direct FA มี reporter อยู่บน primary antibody ส่วน indirect FA มี reporter อยู่บน secondary antibody ที่มาจับ primary antibody อีกที"
          },
          {
            "callout": "สไลด์ไม่ได้เขียนเป็นข้อความว่าขยายสัญญาณได้กี่เท่าหรือด้วยกลไกใด มีแค่คำว่า signal amplification กับแผนภาพเทียบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Advantages และ disadvantages",
        "source": "Viral Ag detection p.18",
        "body": [
          {
            "sub": "Advantages",
            "body": [
              {
                "bullets": [
                  "**Specificity** จาก viral antigen specific antibodies (monoclonal vs. polyclonal)",
                  "**Sensitivity** ขึ้นกับ antigen quantity in samples",
                  "**Rapid** เพราะ **could be done with a single staining cycle**"
                ]
              }
            ]
          },
          {
            "sub": "Disadvantages",
            "body": [
              {
                "bullets": [
                  "**Non-specific signal** จาก poor antibody specificity โดยสไลด์เขียนว่า **polyclonal > monoclonal**",
                  "**Autofluorescence (เฉพาะ FA)** จาก tissue ที่หนาเกินไป, elastic fiber ใน blood vessels และ hemosiderin pigment จากเลือด"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "microbio-1--viral-diagnosis": {
    "topic": "microbio-1--viral-diagnosis",
    "title": "Viral diagnosis",
    "icon": "🧬",
    "lecturer": "Aunyaratana Thontiravong",
    "summary": "เด็คนี้วางโครงการวินิจฉัยโรคไวรัสทั้งเส้น เริ่มจากการเก็บและส่งตัวอย่าง (right time / right place / อุณหภูมิ) แล้วแบ่งวิธีทาง laboratory ออกเป็น 3 กลุ่มใหญ่คือ direct examination, virus isolation and identification และ serologic diagnosis พร้อมลงรายละเอียดของแต่ละเทคนิค (EM, FA, IHC/ICC, HA, PCR, host systems 3 แบบ, types of cell culture, CPE, SN, ELISA, HI, AGID) ข้อควรรู้คือหลายสไลด์เป็นภาพประกอบล้วนโดยไม่มีข้อความ ได้แก่ p.19 (Routes of inoculation มีแต่หัวข้อกับรูป), p.23 (มีแต่ลิงก์รูปห้องปฏิบัติการ), p.34 (สไลด์ว่าง) และ p.38 (แผนภาพ indirect ELISA พร้อมเอกสารอ้างอิง) ดังนั้นรายละเอียดที่ต้องดูจากรูปจริงในไฟล์สไลด์จะไม่ปรากฏในโน้ตนี้",
    "sections": [
      {
        "heading": "General diagnostic methods กับที่ทางของ laboratory diagnosis",
        "source": "Viral diagnosis p.2",
        "body": [
          {
            "text": "สไลด์ไล่วิธีวินิจฉัยทั่วไปไว้ 4 อย่าง"
          },
          {
            "bullets": [
              "History taking",
              "Clinical examination",
              "Pathologic diagnosis",
              "Laboratory diagnosis"
            ]
          },
          {
            "text": "และระบุชัดว่า **Laboratory diagnosis คือ the best way to confirm the viral infectious diseases เพราะเป็นวิธีที่ identify causative agents ได้**"
          }
        ]
      },
      {
        "heading": "Sample collection ถูกเวลาและถูกที่",
        "source": "Viral diagnosis p.3",
        "body": [
          {
            "text": "หลักคือ know the disease แล้วจึงรู้ว่าจะเก็บอะไร (right place) และเก็บเมื่อไหร่ (right time)"
          },
          {
            "sub": "Right time",
            "body": [
              {
                "bullets": [
                  "เก็บ as soon as possible after animals first develops clinical signs",
                  "**เก็บช่วง acute phase of disease หรือจาก recently dead animals**"
                ]
              }
            ]
          },
          {
            "sub": "Right place",
            "body": [
              {
                "text": "เลือกตามที่สัมพันธ์กับ clinical signs หรือ lesions หรือ target organs"
              }
            ]
          },
          {
            "sub": "Collection",
            "body": [
              {
                "bullets": [
                  "หลีกเลี่ยง contamination ด้วย aseptic technique",
                  "ใช้ containers และ transport media ให้ถูกชนิด: solid tissue ใส่ plastic bags, swabs ใส่ **viral transport medium (VTM)**, serums ใส่ lock tight tubes",
                  "ติด label ให้ถูกต้อง และแนบ detailed clinical history ของสัตว์ไปด้วย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Transportation และ maintenance ของตัวอย่าง",
        "source": "Viral diagnosis p.4",
        "body": [
          {
            "bullets": [
              "ส่งตัวอย่างถึง laboratory ให้เร็วที่สุด",
              "**ตัวอย่างต้อง keep cold และ moist และทุกตัวอย่างยกเว้น clotted blood ให้เก็บที่ 4 องศาเซลเซียสระหว่างขนส่ง**"
            ]
          },
          {
            "text": "ถ้า process ทันทีไม่ได้"
          },
          {
            "bullets": [
              "**เก็บที่ 4 องศาเซลเซียส ได้ไม่เกิน 24 ชั่วโมง**",
              "**ถ้านานกว่า 24 ชั่วโมง ให้ frozen ที่ -80 องศาเซลเซียส**"
            ]
          }
        ]
      },
      {
        "heading": "ภาพรวม Laboratory diagnosis แบ่งเป็น virus detection กับ antibody detection",
        "source": "Viral diagnosis p.5",
        "body": [
          {
            "sub": "Virus detection",
            "body": [
              {
                "bullets": [
                  "Direct detection คือแสดงให้เห็นว่ามี infectious virus หรือ viral nucleic acid หรือ viral antigen อยู่",
                  "Virus isolation and identification คือ cultivate ไวรัสก่อน แล้วค่อย identify ด้วยวิธี direct โดยแบ่งเป็น virus isolation in host system และ virus identification"
                ]
              }
            ]
          },
          {
            "sub": "Antibody detection (serological test)",
            "body": [
              {
                "text": "แสดงการมีอยู่และ quantification ของ antiviral antibodies"
              }
            ]
          }
        ]
      },
      {
        "heading": "Viral diagnostic methods 3 กลุ่ม",
        "source": "Viral diagnosis p.6",
        "body": [
          {
            "callout": "**เด็คทั้งอันเดินตามโครง 3 ข้อนี้ ตั้งแต่ p.7 ถึงจบ**",
            "kind": "tip"
          },
          {
            "bullets": [
              "**Direct examination** เพื่อแสดงว่ามี virus particle หรือ viral nucleic acid หรือ viral antigen ในตัวอย่าง",
              "**Virus isolation and identification** เพื่อ cultivate ไวรัสแล้ว identify ด้วยวิธี direct",
              "**Serologic diagnosis** เพื่อแสดงการมีอยู่และ quantification ของ antiviral antibodies"
            ]
          }
        ]
      },
      {
        "heading": "1. Direct examination and identification ข้อดีข้อเสีย",
        "source": "Viral diagnosis p.7",
        "body": [
          {
            "bullets": [
              "Advantage: rapid result",
              "**Disadvantage: อาจให้ผลผิดได้ถ้าในตัวอย่างมีไวรัสจำนวนน้อย (low number of viruses)**",
              "ตัวอย่างวิธี: EM, FA, IHC และ molecular techniques"
            ]
          }
        ]
      },
      {
        "heading": "Electron microscopy (EM)",
        "source": "Viral diagnosis p.8",
        "body": [
          {
            "text": "มองเห็น virus particles ที่อยู่ในตัวอย่างโดยตรง และดู virus morphology ได้"
          },
          {
            "sub": "Advantages",
            "body": [
              {
                "bullets": [
                  "เป็น rapid method",
                  "**มีประโยชน์กับไวรัสที่เพาะใน cell culture ไม่ได้**"
                ]
              }
            ]
          },
          {
            "sub": "Limitation",
            "body": [
              {
                "bullets": [
                  "**Low sensitivity**",
                  "ต้องใช้ equipment ที่แพง และต้องมี microscopist ที่ชำนาญสูง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Immunofluorescent antibody (FA) staining",
        "source": "Viral diagnosis p.9",
        "body": [
          {
            "text": "เป็นการ direct detection of viral antigens ใน clinical samples"
          },
          {
            "bullets": [
              "ตัด cryostat tissue section หรือ smear cells แล้ว fix บน slide",
              "**ย้อมด้วย viral specific antibody ที่ conjugated กับ fluorochrome**"
            ]
          }
        ]
      },
      {
        "heading": "Immunohistochemical / immunocytochemical (IHC/ICC) staining",
        "source": "Viral diagnosis p.10",
        "body": [
          {
            "bullets": [
              "หลักการคล้าย FA test มาก และเป็นการ direct detection of viral antigens ใน clinical samples เหมือนกัน",
              "**จุดต่าง: viral specific antibody ถูก conjugated กับ enzyme ไม่ใช่ fluorochrome**",
              "enzyme ทำปฏิกิริยากับ substrate เกิด colored product ที่มองเห็นใน infected cells ด้วย light microscope"
            ]
          }
        ]
      },
      {
        "heading": "Hemagglutination (HA) test",
        "source": "Viral diagnosis p.11",
        "body": [
          {
            "bullets": [
              "ใช้ detection หรือ titration ของ viral antigen",
              "อาศัย specific antigen บนผิวไวรัสที่จับและ agglutinate RBC ของสัตว์บางชนิดได้",
              "**ข้อจำกัด: ใช้ได้เฉพาะไวรัสที่ agglutinate RBC ได้เท่านั้น**"
            ]
          },
          {
            "text": "สไลด์ไม่ได้บอกว่าไวรัสชนิดใดบ้างที่ agglutinate RBC ได้ และไม่ได้ระบุ species ของ RBC ที่ใช้"
          }
        ]
      },
      {
        "heading": "Molecular techniques: Polymerase chain reaction (PCR)",
        "source": "Viral diagnosis p.12",
        "body": [
          {
            "text": "ใช้ detect viral nucleic acid โดยตรงจาก clinical specimens"
          },
          {
            "sub": "มีประโยชน์เมื่อ",
            "body": [
              {
                "bullets": [
                  "ไวรัส culture ยากหรือ culture ไม่ได้",
                  "**ไม่มี viable viruses อยู่ในตัวอย่างแล้ว**"
                ]
              }
            ]
          },
          {
            "bullets": [
              "molecular technique ที่ใช้บ่อยที่สุดคือ PCR และ qPCR",
              "**PCR คือการ enzymatic amplify viral nucleic acid ให้เพิ่มเป็นล้าน copies จนวิธีอื่นตรวจจับได้**"
            ]
          }
        ]
      },
      {
        "heading": "2. Virus isolation and identification ทำเมื่อไหร่",
        "source": "Viral diagnosis p.13",
        "body": [
          {
            "text": "**มีประโยชน์มากในกรณีที่ตัวอย่างมีปริมาณไวรัสน้อยจน direct examination ตรวจไม่เจอ**"
          },
          {
            "bullets": [
              "ขั้น Virus isolation คือ isolate หรือ amplify ไวรัสใน host system 1 ใน 3 แบบ ได้แก่ cell cultures, embryonated eggs และ experimental animals",
              "ขั้น Virus identification คือ identify ไวรัสด้วยเทคนิค direct examination"
            ]
          }
        ]
      },
      {
        "heading": "The host systems ทำไมต้องมี",
        "source": "Viral diagnosis p.14",
        "body": [
          {
            "text": "**เพราะไวรัสเป็น obligate intracellular parasite จึงต้องเพาะในเซลล์ที่มีชีวิต**"
          },
          {
            "text": "สไลด์เรียง 3 host systems ที่ใช้บ่อยไว้ว่า experimental animals, embryonated eggs และ cell cultures"
          }
        ]
      },
      {
        "heading": "Host system 1: Experimental animals",
        "source": "Viral diagnosis p.15",
        "body": [
          {
            "sub": "Direct experimental animals",
            "body": [
              {
                "bullets": [
                  "**เป็นสัตว์ชนิดเดียวกับ natural host**",
                  "เหมาะสำหรับการศึกษา viral pathogenesis และ clinical studies"
                ]
              }
            ]
          },
          {
            "sub": "Indirect experimental animals",
            "body": [
              {
                "text": "เป็นสัตว์ที่พิสูจน์แล้วว่า reproduce โรค หรือแสดง indication of infection อื่นได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "Experimental animals แบบอื่น SPF และ germ-free gnotobiotes",
        "source": "Viral diagnosis p.16",
        "body": [
          {
            "bullets": [
              "**Specific pathogen free (SPF) animals คือสัตว์ที่การันตีว่าปลอดเชื้อก่อโรคบางชนิด**",
              "Germ-free gnotobiotes (โนโตไบโอต) คือ caesarian-derived colostrum-deprived animals"
            ]
          },
          {
            "callout": "**ข้อเสียของ germ-free gnotobiotes: การสัมผัสเชื้อก่อโรคใด ๆ จะถึงตาย เพราะไม่มี protective bacterial flora อยู่เลย**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Experimental animals ข้อดีข้อเสีย",
        "source": "Viral diagnosis p.17",
        "body": [
          {
            "sub": "Advantages",
            "body": [
              {
                "bullets": [
                  "ศึกษา virus pathogenicity และ host immune response ได้",
                  "ใช้ vaccine efficacy testing และ vaccine production",
                  "ใช้ผลิต hyperimmune serum",
                  "**ใช้กับไวรัสที่เพาะใน system อื่นไม่ได้ เช่น rotaviruses บางตัว**",
                  "ใช้ isolate ไวรัสที่ยังไม่รู้ชนิด (unknown viruses)"
                ]
              }
            ]
          },
          {
            "sub": "Disadvantages",
            "body": [
              {
                "bullets": [
                  "ไม่สะดวกและแพง ทั้ง cost of animals และ cost of maintenance",
                  "**มีประเด็น animal welfare concerns**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Host system 2: Embryonated eggs",
        "source": "Viral diagnosis p.18",
        "body": [
          {
            "bullets": [
              "**bacteriological sterile และไม่มีการสร้าง antibodies ต่อ viral inoculum**",
              "ให้ differentiated tissues หลากหลายเป็น substrate สำหรับไวรัสหลายชนิด",
              "**avian viruses หลายตัวเพิ่มจำนวนในไข่ได้ดีกว่ามาก**",
              "เป็นระบบที่ inexpensive สำหรับ virus isolation"
            ]
          },
          {
            "text": "สไลด์ทิ้งคำว่า Available? ไว้เป็นคำถามเรื่องความหาง่ายของไข่ แต่สไลด์ไม่ได้บอกคำตอบ"
          }
        ]
      },
      {
        "heading": "Routes of inoculation ในไข่",
        "source": "Viral diagnosis p.19",
        "body": [
          {
            "text": "สไลด์นี้มีแต่หัวข้อ Routes of inoculation กับรูปประกอบ **สไลด์ไม่ได้บอกชื่อ route แต่ละเส้นทางเป็นตัวอักษร** ต้องดูจากรูปในไฟล์สไลด์จริง"
          }
        ]
      },
      {
        "heading": "Host system 3: Cell cultures",
        "source": "Viral diagnosis p.20",
        "body": [
          {
            "bullets": [
              "คือการ maintenance of animal cells in vitro",
              "**เป็นระบบที่ใช้กว้างขวางที่สุดในการ cultivation และ assay ของไวรัส**"
            ]
          },
          {
            "sub": "Advantages",
            "body": [
              {
                "bullets": [
                  "เพาะได้ปริมาณมากและเก็บไว้ตอนไม่ใช้ได้",
                  "isolate ไวรัสได้หลายชนิด"
                ]
              }
            ]
          },
          {
            "sub": "Disadvantages",
            "body": [
              {
                "bullets": [
                  "ต้องใช้ expertise",
                  "แพง"
                ]
              }
            ]
          },
          {
            "text": "สไลด์แสดงรูปเซลล์ 2 แบบกำกับไว้คือ epithelial-like และ fibroblast-like"
          }
        ]
      },
      {
        "heading": "Types of cell culture: monolayer และ suspension",
        "source": "Viral diagnosis p.21",
        "body": [
          {
            "sub": "1. Monolayer culture (stationary culture)",
            "body": [
              {
                "text": "เซลล์โตเป็นชั้นเดียวบน solid surface แบ่งย่อยเป็น"
              },
              {
                "bullets": [
                  "**Primary culture ได้มาจาก animal tissues โดยตรง และ susceptible ต่อ virus isolation มากกว่า continuous cell lines**",
                  "**Continuous cell lines คือ cell population ที่ passage ได้ไม่จำกัด และใช้บ่อยใน virus isolation**"
                ]
              }
            ]
          },
          {
            "sub": "2. Suspension culture",
            "body": [
              {
                "bullets": [
                  "ได้จากเซลล์ที่อยู่รอดและ proliferate ได้โดยไม่ต้องเกาะพื้นผิว",
                  "**มีประโยชน์สำหรับ vaccine production**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Types of cell culture: organ culture",
        "source": "Viral diagnosis p.22",
        "body": [
          {
            "text": "**Organ culture คือ 3D culture ของเนื้อเยื่อที่ยังไม่ถูก disaggregate จึงคง histological features บางส่วนหรือทั้งหมดเหมือน in vivo**"
          },
          {
            "text": "ตัวอย่างที่สไลด์ยกคือ thin section of trachea ที่เลี้ยงใน cell culture medium"
          }
        ]
      },
      {
        "heading": "Virus isolation ขั้นเตรียมตัวอย่าง",
        "source": "Viral diagnosis p.24",
        "body": [
          {
            "text": "**วัตถุประสงค์ของ sample preparation คือปล่อยไวรัสออกจาก infected cells มาอยู่ใน solution**"
          },
          {
            "bullets": [
              "เตรียม tissues เป็น 10% suspension (ถ้าเป็น swab ใช้ transport medium)",
              "**Clarification ที่ 1000-3000 rpm นาน ประมาณ 15 นาที**",
              "ส่วน tissue debris จะตกลงไป และเก็บ supernatant with virus ไปใช้ต่อ"
            ]
          }
        ]
      },
      {
        "heading": "Virus isolation ใน cell cultures",
        "source": "Viral diagnosis p.25",
        "body": [
          {
            "bullets": [
              "Inoculate ด้วย supernatant จาก 10% suspension",
              "**เลี้ยงที่ 37 องศาเซลเซียส และสังเกต CPE ประมาณ 2-7 วัน**",
              "**ข้อควรระวัง: ไม่ใช่ทุกไวรัสที่ให้ CPE ที่ดี (Not all viruses produce good CPE)**",
              "ชนิดเซลล์ที่ใช้ขึ้นกับไวรัสที่สงสัย เช่น primary cells, MDBK, MDCK, Vero, PK-15, BHK-21"
            ]
          },
          {
            "text": "สไลด์ไม่ได้บอกว่าเซลล์ไลน์แต่ละตัวคู่กับไวรัสชนิดใด"
          }
        ]
      },
      {
        "heading": "Identification of virus-infected cells: cytopathic effect (CPE)",
        "source": "Viral diagnosis p.26-28",
        "body": [
          {
            "text": "สไลด์กลุ่มนี้เป็นรูปเปรียบเทียบ normal cells กับเซลล์ที่ติดเชื้อ โดยมีข้อความกำกับ CPE 3 แบบ"
          },
          {
            "bullets": [
              "**Round CPE** (p.26 คู่กับรูป normal cells)",
              "**Syncytial formation** คือการ fusion ของ cellular membrane ของเซลล์หลายเซลล์ ทำให้เกิด multinuclear cell ที่ cytoplasm ขยายใหญ่ขึ้นภายใน cell membrane เดียวกัน (p.27)",
              "**Inclusion bodies แบ่งเป็น intracytoplasmic inclusion bodies และ intranuclear inclusion bodies** (p.28)"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าไวรัสชนิดใดให้ CPE แบบใด ข้อความบนสไลด์มีเท่านี้ ที่เหลือเป็นรูป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Virus isolation ใน embryonated eggs หรือ lab animals",
        "source": "Viral diagnosis p.29-31",
        "body": [
          {
            "bullets": [
              "Inoculate ด้วย supernatant จาก 10% suspension เช่นเดียวกับ cell culture (p.29)",
              "**อ่านผลโดยสังเกต specific lesions บน embryos หรือ pock formation บน CAM** (p.30)",
              "ในกรณี lab animals สังเกต specific clinical signs หรือ lesions (p.31)"
            ]
          },
          {
            "text": "สไลด์ไม่ได้อธิบายลักษณะของ pock หรือ lesion ที่จำเพาะกับไวรัสแต่ละชนิด"
          }
        ]
      },
      {
        "heading": "Virus identification หลัง isolation",
        "source": "Viral diagnosis p.32",
        "body": [
          {
            "text": "**หลังเพาะได้แล้วต้อง identify ไวรัสใน inoculated cell cultures หรือ eggs หรือ lab animals ด้วยเทคนิค direct examination ได้แก่ FA, IHC/ICC, PCR หรือ electron microscope**"
          },
          {
            "text": "ตัวอย่างที่สไลด์ยกคือการย้อม FA และ ICC"
          }
        ]
      },
      {
        "heading": "3. Serological diagnosis หลักการและข้อจำกัด",
        "source": "Viral diagnosis p.33",
        "body": [
          {
            "text": "เป็นการวัด antibody response ของ host ต่อไวรัสที่สนใจ"
          },
          {
            "callout": "**เป็น indirect measure of virus คือตรวจ host antiviral response ไม่ใช่ตัว viral particles**",
            "kind": "warn"
          },
          {
            "sub": "ใช้เพื่อ",
            "body": [
              {
                "bullets": [
                  "identify ไวรัสที่เพาะใน culture ยาก",
                  "ดู immune response ต่อไวรัสจำเพาะและต่อ vaccination",
                  "diagnosis ของ recent viral infection"
                ]
              }
            ]
          },
          {
            "sub": "Paired serum",
            "body": [
              {
                "bullets": [
                  "Acute-phase serum เก็บให้เร็วที่สุดเท่าที่ทำได้ตอนเริ่มป่วย",
                  "**Convalescence-phase serum เก็บห่างออกไปอย่างน้อย 2 สัปดาห์**",
                  "**แปลผลว่าติดเชื้อเมื่อ titer เพิ่มขึ้น 4-fold หรือมากกว่า**"
                ]
              }
            ]
          },
          {
            "text": "อีกทางเลือกที่สไลด์ระบุคือการตรวจ **virus-specific IgM antibodies ใน single acute-phase serum**"
          }
        ]
      },
      {
        "heading": "Serological tests 4 ตัวที่เด็คนี้เน้น",
        "source": "Viral diagnosis p.35",
        "body": [
          {
            "text": "สไลด์บอกว่าเนื้อหาส่วนนี้จำกัดอยู่ที่ Ab detection ด้วย serological tests ต่อไปนี้"
          },
          {
            "bullets": [
              "**Serum neutralization (SN) test ซึ่งเป็น gold standard**",
              "Enzyme-linked immunosorbent assay (ELISA)",
              "Hemagglutination inhibition (HI) test",
              "Agar gel immunodiffusion (AGID) test"
            ]
          },
          {
            "callout": "p.34 เป็นสไลด์ว่างไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Serum / viral neutralization (SN/VN) test",
        "source": "Viral diagnosis p.36",
        "body": [
          {
            "text": "**ถือเป็น gold standard ของ serological tests เพราะ antibodies ที่วัดได้คือ neutralizing antibodies ซึ่งเป็น protective antibodies**"
          },
          {
            "text": "หลักการ: อาศัยกลไกที่ specific antibodies ยับยั้ง virus infection จึงป้องกันการเปลี่ยนแปลงที่ไวรัสก่อใน host system รวมถึง CPE ใน cell culture"
          },
          {
            "bullets": [
              "**High antibody เท่ากับไวรัสถูก neutralized ไวรัสที่ถูก neutralized จะ infect เซลล์ไม่ได้ จึงเห็น normal cell monolayer**"
            ]
          }
        ]
      },
      {
        "heading": "Enzyme-Linked Immunosorbent Assay (ELISA)",
        "source": "Viral diagnosis p.37",
        "body": [
          {
            "text": "หลักการ: อาศัย specific interactions ระหว่าง antigens กับ antibodies ร่วมกับคุณสมบัติของ enzyme ที่ catalyze substrate ที่เหมาะสม เกิด colored products แล้ว **quantify ด้วย spectrophotometer**"
          },
          {
            "bullets": [
              "**ตรวจได้ทั้ง antigen หรือ antibodies**",
              "เร็วและค่อนข้างง่ายสำหรับ screen sera หาแอนติบอดีต่อไวรัสจำเพาะ",
              "มีชุดขายเชิงพาณิชย์เป็น ready-to-use assay",
              "**อาจแยกตรวจ Ig แต่ละ class ได้ เช่น IgG, IgM, IgA**"
            ]
          },
          {
            "text": "p.38 เป็นแผนภาพ indirect ELISA พร้อมเอกสารอ้างอิง ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "Hemagglutination Inhibition (HI) test",
        "source": "Viral diagnosis p.39",
        "body": [
          {
            "text": "**ตรวจแอนติบอดีที่จำเพาะต่อ viral HA protein ซึ่งยับยั้ง hemagglutination activity ของไวรัสได้**"
          },
          {
            "bullets": [
              "**เห็น hemagglutination เท่ากับ antibody negative**",
              "**เห็น hemagglutination inhibition เท่ากับ antibody positive**",
              "ข้อจำกัด: ใช้ได้เฉพาะแอนติบอดีของไวรัสที่ agglutinate RBCs ได้เท่านั้น"
            ]
          }
        ]
      },
      {
        "heading": "Agar gel immunodiffusion assay (AGID)",
        "source": "Viral diagnosis p.40",
        "body": [
          {
            "bullets": [
              "specific antibody และ viral antigen แพร่ (diffuse) เข้าหากันใน agar gel",
              "**precipitin line บ่งชี้การตกตะกอนของ Ag-Ab complex**",
              "ใช้เป็น screening test สำหรับตรวจแอนติบอดีต่อไวรัส เช่น **all type A influenza group-specific antigens และ equine infectious anemia (EIA) virus ซึ่งเรียกว่า Coggins test**"
            ]
          }
        ]
      },
      {
        "heading": "Summary ที่สไลด์สรุปเอง",
        "source": "Viral diagnosis p.41",
        "body": [
          {
            "bullets": [
              "**Direct examination** แสดงว่ามี virus particle หรือ viral nucleic acid หรือ viral antigen ในตัวอย่าง ตัวอย่างวิธี EM, FA, IHC, HA และ molecular techniques",
              "**Virus isolation and identification** เพาะไวรัสแล้ว identify ด้วยวิธี direct",
              "**Serologic diagnosis** แสดงการมีอยู่และ quantification ของ antiviral antibodies ตัวอย่างวิธี SN, ELISA, HI, AGID"
            ]
          },
          {
            "callout": "สังเกตว่าสไลด์สรุปจัด **HA ไว้ในกลุ่ม direct examination** (ตรวจ antigen) ส่วน **HI อยู่ในกลุ่ม serologic diagnosis** (ตรวจ antibody) จุดนี้สับสนกันได้ง่าย",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "microbio-1--viral-pathogenesis": {
    "topic": "microbio-1--viral-pathogenesis",
    "title": "Viral pathogenesis",
    "icon": "🧬",
    "lecturer": "Kanisak Oraveerakul",
    "summary": "เด็คนี้วาง viral pathogenesis เป็น 2 ระดับ คือ cellular level (CPE 6 แบบ, cell transformation, functional impairs, no overt effects) และ host animal level (route of entry, dissemination, shedding และรูปแบบการติดเชื้อ 6 แบบ). ต้องบอกตามตรงว่าเด็คนี้เป็นเลกเชอร์ที่เดินด้วยรูปเป็นหลัก จาก 47 สไลด์มีเพียงไม่กี่สไลด์ที่ให้คำนิยามเป็นตัวหนังสือ (CPE, syncytial formation, inclusion bodies, apoptosis) ส่วนที่เหลือเป็นรูป cell culture, รูปพยาธิสภาพ และรูปสัตว์ป่วยพร้อมแคปชันสั้น ๆ ที่ระบุแค่ชื่อปรากฏการณ์กับตัวอย่างไวรัส โน้ตนี้จึงเก็บเฉพาะสิ่งที่สไลด์เขียนไว้จริง และระบุไว้ทุกจุดที่สไลด์ยกหัวข้อขึ้นมาแต่ไม่ได้อธิบายต่อ",
    "sections": [
      {
        "heading": "ผลของไวรัสในระดับเซลล์ (cellular level)",
        "source": "Viral pathogenesis p.2",
        "body": [
          {
            "text": "สไลด์แบ่งผลที่ไวรัสทำกับเซลล์ออกเป็น 4 กลุ่ม โดยกลุ่มแรกคือ **Cytopathic Effects (CPE)** ซึ่งเด็คจะขยายรายละเอียดต่อไปอีกหลายสไลด์"
          },
          {
            "bullets": [
              "**Cytopathic Effects (CPE)** ได้แก่ Round, Shrink, Syncytia, Inclusion Bodies, Apoptosis",
              "**Cell Transformation**",
              "**Functional Impairs**",
              "**No Overt Effects**"
            ]
          },
          {
            "callout": "สไลด์นี้เขียนไว้แค่เป็นรายชื่อ ไม่ได้อธิบายกลไกของ Cell Transformation, Functional Impairs และ No Overt Effects ในระดับเซลล์ต่อ สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "CPE คืออะไร",
        "source": "Viral pathogenesis p.3",
        "body": [
          {
            "text": "สไลด์ให้คำนิยามสั้นมากคำเดียวว่า CPE คือ **a morphological alteration of cells** คือการเปลี่ยนแปลงรูปร่างลักษณะของเซลล์"
          },
          {
            "text": "สไลด์ถัดมาเป็นรูปเปรียบเทียบ **fresh monolayer of cell culture** กับ **stained monolayer of cell culture** ซึ่งเป็นภาพล้วน ไม่มีข้อความอธิบายกำกับ"
          }
        ]
      },
      {
        "heading": "CPE แบบที่ 1 และ 2: Round up",
        "source": "Viral pathogenesis p.6",
        "body": [
          {
            "bullets": [
              "**1. Round Up and Aggregation** คือเซลล์กลมขึ้นแล้วเกาะกลุ่มกัน",
              "**2. Round Up and Shrink** คือเซลล์กลมขึ้นแล้วหดตัว"
            ]
          },
          {
            "text": "เด็คให้เห็นเป็นรูป Round CPE ตามมา 1 สไลด์ ไม่มีคำอธิบายกลไกเพิ่ม"
          }
        ]
      },
      {
        "heading": "CPE แบบที่ 3: Syncytial formation",
        "source": "Viral pathogenesis p.8",
        "body": [
          {
            "text": "สไลด์นิยามว่าเป็น **a fusion of cellular membrane of cells** ทำให้เกิดเซลล์ที่มี **หลายนิวเคลียส (multinuclear cell)** และมี cytoplasm ขนาดใหญ่ขึ้นอยู่ภายใน cell membrane เดียวกัน"
          },
          {
            "text": "หลังสไลด์นิยามเป็นรูป syncytial formation ติดกัน 3 สไลด์ ไม่มีข้อความประกอบ"
          }
        ]
      },
      {
        "heading": "CPE แบบที่ 4: Inclusion bodies",
        "source": "Viral pathogenesis p.12",
        "body": [
          {
            "text": "สไลด์นิยามว่าเป็น **foreign intracellular masses with abnormal staining** และเน้นว่า **usually are sites of viral replication** คือส่วนใหญ่เป็นตำแหน่งที่ไวรัสเพิ่มจำนวน"
          },
          {
            "bullets": [
              "**Intranuclear inclusion bodies**",
              "**Intracytoplasmic inclusion bodies**"
            ]
          },
          {
            "text": "สไลด์ถัดมาเป็นรูปตัวอย่างของทั้งสองแบบอย่างละ 1 สไลด์ เด็คไม่ได้ระบุว่าไวรัสตัวใดสร้าง inclusion body แบบไหน สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "CPE แบบที่ 5: Apoptosis",
        "source": "Viral pathogenesis p.15",
        "body": [
          {
            "text": "สไลด์เขียนกำกับว่า **APOPTOSIS : PROGRAMMED CELL DEATH** และนิยามว่าเป็นการตายของเซลล์ที่ถูกเหนี่ยวนำโดย **expression of a group of genes** ที่โปรแกรม physiological aging ของเซลล์ไว้"
          },
          {
            "text": "ผลที่ตามมาตามที่สไลด์ระบุคือ **chromatin condensation**, **DNA fragmentation** และ **blebbing to apoptotic bodies**"
          },
          {
            "text": "อีกสไลด์หนึ่งตั้งหัวเรื่องว่า Virus induced cell death: **Apoptosis and Necrosis** แต่เป็นรูปเปรียบเทียบล้วน เด็คไม่ได้เขียนข้อแตกต่างระหว่าง apoptosis กับ necrosis เป็นตัวหนังสือ สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "CPE แบบที่ 6: Plaque formation",
        "source": "Viral pathogenesis p.18",
        "body": [
          {
            "text": "สไลด์มีเพียงหัวข้อ **6. Plaque formation** เท่านั้น ไม่มีคำนิยามหรือคำอธิบายว่า plaque เกิดขึ้นอย่างไรหรือใช้ทำอะไร สไลด์ไม่ได้บอก"
          },
          {
            "callout": "จุดที่ต้องระวังตอนท่อง: สไลด์ภาพรวม p.2 ลิสต์ CPE ไว้ 5 อย่าง (Round, Shrink, Syncytia, Inclusion Bodies, Apoptosis) แต่สไลด์ที่ไล่หมายเลขจริงนับถึง **6 แบบ** โดยมี Plaque formation เป็นข้อที่ 6",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ระดับตัวสัตว์: ทางเข้า การกระจาย และการปล่อยเชื้อ",
        "source": "Viral pathogenesis p.19",
        "body": [
          {
            "text": "เมื่อขึ้นหัวข้อ **HOST ANIMAL LEVEL** เด็คไล่หัวข้อไว้ 3 เรื่องต่อกันเป็นสไลด์หัวเรื่องกับรูป"
          },
          {
            "bullets": [
              "**Route of Virus Entry**",
              "**Dissemination, Replication Sites and Shedding of Viruses**",
              "**Dissemination of Viruses** ซึ่งเป็นสไลด์รูปแผนภาพการกระจายของไวรัส"
            ]
          },
          {
            "callout": "ทั้งสามสไลด์เป็นหัวเรื่องกับรูปเท่านั้น ไม่มีการไล่ชื่อ route of entry แต่ละทาง ไม่มีการระบุ replication site หรือ shedding route เป็นตัวหนังสือ สไลด์ไม่ได้บอก ถ้าจะสอบส่วนนี้ต้องอาศัยรูปในสไลด์จริงกับที่อาจารย์พูดในคาบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "รูปแบบการติดเชื้อในระดับตัวสัตว์ 6 แบบ",
        "source": "Viral pathogenesis p.22",
        "body": [
          {
            "text": "สไลด์นี้คือโครงของครึ่งหลังทั้งเด็ค สไลด์ที่เหลือหลังจากนี้คือรูปตัวอย่างของหัวข้อทั้ง 6 นี้"
          },
          {
            "bullets": [
              "**Acute Lytic Infection**",
              "**Persistent Infection**",
              "**Transplacental Infection**",
              "**Transformation**",
              "**Immunopathologic Diseases**",
              "**Immunodeficiency, Immunosuppression**"
            ]
          }
        ]
      },
      {
        "heading": "Acute lytic infection แสดงออกได้ 4 ระดับ",
        "source": "Viral pathogenesis p.23",
        "body": [
          {
            "text": "เด็คใช้สไลด์รูป 4 สไลด์ติดกัน แต่ละสไลด์มีแคปชันบอกว่ากำลังดู acute lytic infection ในระดับใด"
          },
          {
            "bullets": [
              "**Clinical Signs**",
              "**Death**",
              "**Gross Pathologic Lesions**",
              "**Histopathologic Lesions**"
            ]
          },
          {
            "text": "ทั้ง 4 สไลด์ไม่ได้ระบุชื่อโรคหรือชื่อไวรัสที่เป็นเจ้าของรูป สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Acute lytic vs Persistent infection",
        "source": "Viral pathogenesis p.27",
        "body": [
          {
            "text": "สไลด์เปรียบเทียบสองแบบนี้ด้วยแผนภาพ โดยเขียนหัวข้อที่ใช้เทียบไว้ **3 แกน**"
          },
          {
            "bullets": [
              "**Viruses shedding** คือการปล่อยเชื้อ",
              "**Presenting viruses in tissues** คือการพบไวรัสในเนื้อเยื่อ",
              "**Clinical signs** คืออาการทางคลินิก"
            ]
          },
          {
            "callout": "แกนเปรียบเทียบทั้ง 3 มีชื่อแกนแต่ไม่มีคำบรรยายว่า acute lytic กับ persistent ต่างกันอย่างไรในแต่ละแกน ข้อมูลอยู่ในรูปแผนภาพของสไลด์เท่านั้น",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Transplacental infection กับตัวอย่างไวรัสที่เด็คยกไว้",
        "source": "Viral pathogenesis p.28",
        "body": [
          {
            "text": "ส่วนนี้เป็นส่วนที่จำง่ายที่สุดของเด็ค เพราะแต่ละสไลด์จับคู่ **ผลต่อลูกในท้อง** กับ **ไวรัสตัวอย่าง** ไว้ตรง ๆ"
          },
          {
            "bullets": [
              "**Mummification** ตัวอย่างคือ **Porcine Parvovirus**",
              "**Embryonic death** ตัวอย่างคือ **Pseudorabies**",
              "**Abortion** มี 2 สไลด์ สไลด์แรกไม่ระบุไวรัส สไลด์ที่สองระบุ **PRRSV**",
              "**Malformation** ตัวอย่างคือ **Japanese encephalitis virus**"
            ]
          },
          {
            "callout": "คู่ผลลัพธ์กับชื่อไวรัสชุดนี้คือสิ่งที่ควรจำจากเด็คนี้ให้ได้ เพราะเป็นข้อมูลไม่กี่ชุดในเด็คที่เขียนเป็นตัวหนังสือชัดเจน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Transformation: ไวรัสที่เหนี่ยวนำให้เกิดเนื้องอก",
        "source": "Viral pathogenesis p.33",
        "body": [
          {
            "text": "เด็คแสดงรูปเนื้องอกพร้อมแคปชัน **Tumors induced** และระบุไวรัสตัวอย่างไว้"
          },
          {
            "bullets": [
              "**Marek's virus** มี 2 สไลด์",
              "**Avian Leukosis virus**",
              "**Papillomavirus**"
            ]
          },
          {
            "text": "หลังจากนั้นมีสไลด์หัวเรื่อง **Oncogenesis by viruses** แต่เป็นสไลด์รูป ไม่มีข้อความอธิบายกลไกการก่อมะเร็งของไวรัส สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Virus induced immunologic disease",
        "source": "Viral pathogenesis p.40",
        "body": [
          {
            "text": "เด็คยกตัวอย่างโรคที่พยาธิสภาพเกิดจากปฏิกิริยาทางภูมิคุ้มกันไว้ 2 ตัวอย่าง"
          },
          {
            "bullets": [
              "**Feline Infectious Peritonitis virus** มี 2 สไลด์",
              "**Blue eyes** จาก **Canine Hepatitis virus**"
            ]
          },
          {
            "text": "มีอีกสไลด์หนึ่งที่ตั้งหัวเรื่องว่า Virus induced immunologic disease เฉย ๆ โดยไม่ระบุไวรัส และเด็คไม่ได้อธิบายว่ากลไกทางภูมิคุ้มกันที่ทำให้เกิดรอยโรคเหล่านี้คืออะไร สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Immunodeficiency",
        "source": "Viral pathogenesis p.45",
        "body": [
          {
            "text": "สไลด์ 3 สไลด์สุดท้ายของเด็คเป็นรูปชุดเดียวกัน แคปชันว่า **Immunodeficiency : Feline Immunodeficiency virus with Feline Calicivirus** คือแมวที่ติด **FIV** ร่วมกับ **Feline Calicivirus**"
          },
          {
            "callout": "สไลด์ p.22 ลิสต์หัวข้อนี้ไว้ว่า Immunodeficiency, Immunosuppression แต่ตอนลงรายละเอียดเด็คให้เพียงชุดรูปตัวอย่างนี้ ไม่มีคำอธิบายว่า FIV กดภูมิคุ้มกันอย่างไรจนทำให้ Feline Calicivirus แสดงอาการรุนแรงขึ้น สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "microbio-1--virus-isolation-in-cell-culture": {
    "topic": "microbio-1--virus-isolation-in-cell-culture",
    "title": "Virus isolation in cell culture",
    "icon": "🧬",
    "lecturer": "Navapon Techakriengkrai",
    "summary": "เด็คนี้ปูพื้นเรื่องการแยกเชื้อไวรัสด้วย cell culture ตั้งแต่เหตุผลที่ต้องใช้เซลล์เป็น host system, cell culture คืออะไรและต้องการ culture condition แบบไหน, morphology ของเซลล์ 3 แบบ, monolayer กับ contact inhibition, การ subculture ด้วย trypsinisation, ชนิดของ cell culture (primary culture, cell line, finite vs continuous), explant และ organ culture, ชนิดของ specimen ที่ใช้ isolate, วิธี inoculate (adsorption และ co-culture) และการอ่านผลด้วย cytopathic effect (round CPE, syncytium, inclusion body) รวมถึงทางเลือกเมื่อไวรัสไม่ทำให้เกิด CPE. ครึ่งหลังของเด็คเป็นสไลด์ภาพเป็นหลัก โดยเฉพาะหน้า 14 และ 15 ที่มีแต่หัวเรื่อง cytopathic effect: round CPE ไม่มีข้อความอธิบาย ส่วนหน้า 20 ว่างเปล่าและหน้า 21 เป็นหน้า Any question จึงไม่มีเนื้อหาให้สรุป.",
    "sections": [
      {
        "heading": "ทำไมต้อง isolate ไวรัส และ host system ที่ใช้ได้",
        "source": "Virus isolation in cell culture p.2",
        "body": [
          {
            "text": "เหตุผลพื้นฐานคือ **ไวรัสเป็น obligate intracellular parasite จึงต้องมี host cell ให้ replication** เพาะบนอาหารเลี้ยงเชื้อเปล่าแบบแบคทีเรียไม่ได้"
          },
          {
            "sub": "host system ที่สไลด์ระบุไว้ 3 แบบ",
            "body": [
              {
                "bullets": [
                  "experimental animal",
                  "embryonated egg",
                  "cell culture"
                ]
              }
            ]
          },
          {
            "sub": "จุดประสงค์ของการ isolation",
            "body": [
              {
                "bullets": [
                  "diagnosis หรือ identification เพื่อ establish Dx of viral infection และสไลด์ระบุว่าเป็น **gold standard for viral infection diagnosis**",
                  "virus propagation ซึ่งจำเป็นเพราะตัวอย่างมักมี low amount of virus containing in the samples",
                  "vaccine production"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์วางหัวข้อ host system 3 แบบไว้เฉย ๆ ไม่ได้เปรียบเทียบข้อดีข้อเสียของ experimental animal กับ embryonated egg กับ cell culture สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cell culture คืออะไร",
        "source": "Virus isolation in cell culture p.3",
        "body": [
          {
            "text": "นิยามตามสไลด์คือ **การนำเซลล์ออกจากสัตว์หรือพืช แล้วส่งเสริมให้เซลล์เติบโตใน favourable artificial environment**"
          },
          {
            "sub": "วิธีนำเซลล์ออกมา",
            "body": [
              {
                "bullets": [
                  "by mechanic means",
                  "by enzymatic means",
                  "by specific cell sorting methods"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่ใช้ทำให้สภาพแวดล้อมเหมาะกับการเติบโต",
            "body": [
              {
                "bullets": [
                  "specific cell culture media",
                  "selective agent"
                ]
              }
            ]
          },
          {
            "callout": "หน้านี้มีภาพประกอบกำกับว่า mechanical means และ enzymatic means แต่ไม่มีข้อความอธิบายว่าแต่ละวิธีทำอย่างไรหรือใช้เอนไซม์ตัวไหน สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Culture conditions",
        "source": "Virus isolation in cell culture p.4",
        "body": [
          {
            "text": "สไลด์เน้นว่า **culture condition vary widely for each cell type** ไม่มีสูตรเดียวที่ใช้ได้กับทุกเซลล์"
          },
          {
            "sub": "culture vessel",
            "body": [
              {
                "text": "mostly polystyrene plastic"
              }
            ]
          },
          {
            "sub": "culture media",
            "body": [
              {
                "bullets": [
                  "essential nutrients ได้แก่ amino acids, carbohydrates, vitamins, minerals",
                  "hormones และ growth factors ซึ่งได้จาก **animal serum 5-20%**"
                ]
              }
            ]
          },
          {
            "sub": "regulated physico-chemical environment",
            "body": [
              {
                "bullets": [
                  "O2 กับ CO2",
                  "temperature",
                  "pH",
                  "osmolarity"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้ช่วง serum 5-20% แต่ไม่ได้ระบุค่า temperature, pH หรือ %CO2 ที่ใช้จริง สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Morphology of cells in culture",
        "source": "Virus isolation in cell culture p.5",
        "body": [
          {
            "text": "สไลด์แบ่งเซลล์ตามรูปร่างและการเกาะพื้นผิวเป็น 3 กลุ่ม โดยจัดกลุ่มแรกและกลุ่มที่สองเป็น **adherent cell** ส่วนกลุ่มสุดท้ายเป็น **suspension cell**"
          },
          {
            "bullets": [
              "**Fibroblastic (fibroblast-like) cells** เป็น bipolar หรือ multipolar รูปร่างยาว elongated และ grow attached to a surface",
              "**Epithelial-like cells** รูปร่าง polygonal มีสัดส่วนสม่ำเสมอกว่า และเกาะพื้นผิวโตเป็นหย่อม discrete patches",
              "**Lymphoblast-like cells** รูปร่างกลม spherical และมักโตแบบ suspension โดยไม่เกาะพื้นผิว"
            ]
          }
        ]
      },
      {
        "heading": "Cell monolayer และ contact inhibition",
        "source": "Virus isolation in cell culture p.6",
        "body": [
          {
            "text": "หน้านี้เป็นสไลด์ภาพ monolayer สองแบบคือ epithelial-like cell monolayer และ fibroblastic cell monolayer โดยมีคำที่ต้องจำคำเดียวคือ **contact inhibition**"
          },
          {
            "callout": "สไลด์ใส่คำว่า contact inhibition ไว้ในเครื่องหมายคำพูดเฉย ๆ ไม่ได้อธิบายกลไกหรือความหมายเป็นข้อความ สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Subculture of cell monolayer",
        "source": "Virus isolation in cell culture p.7",
        "body": [
          {
            "text": "หน้านี้เป็นแผนภาพการ subculture ของ monolayer โดยมีคำสำคัญคำเดียวคือ **trypsinisation** อ้างอิงจาก Freshney IR, Culture of animal cells, 6 edition: 198, 2010"
          },
          {
            "callout": "ขั้นตอนย่อยของ trypsinisation ไม่ได้เขียนเป็นข้อความบนสไลด์ อยู่ในรูปอย่างเดียว สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Types of cell culture",
        "source": "Virus isolation in cell culture p.8",
        "body": [
          {
            "sub": "Primary culture",
            "body": [
              {
                "bullets": [
                  "คือ culture หลังจากแยกเซลล์ออกจาก tissue หรือ organ",
                  "เซลล์จะโตจนเต็มพื้นที่ที่มี เรียกว่า **confluent**"
                ]
              }
            ]
          },
          {
            "sub": "Cell line",
            "body": [
              {
                "text": "**หลังจาก subculture ครั้งแรก primary culture จะเรียกว่า cell line** และสไลด์แบ่งต่อเป็น finite กับ continuous cell line"
              }
            ]
          },
          {
            "bullets": [
              "**Finite cell line กำกับด้วยคำว่า senescence**",
              "**Continuous cell line กำกับด้วยคำว่า immortalization**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกจำนวน passage ที่ใช้แบ่ง finite ออกจาก continuous และไม่ได้อธิบายว่า transformation เกิดขึ้นได้อย่างไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Explant culture และ organ culture",
        "source": "Virus isolation in cell culture p.9",
        "body": [
          {
            "sub": "explant culture",
            "body": [
              {
                "bullets": [
                  "closely resembles the tissue in vivo",
                  "อยู่ใน molecular communication กับ companion cells ของ explant",
                  "**more biologically relevant**"
                ]
              }
            ]
          },
          {
            "sub": "organ culture",
            "body": [
              {
                "bullets": [
                  "**preserve 3D structure**",
                  "accurately model functions of an organ",
                  "ดู effect on the organ ได้"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์คือ Freshney IR, Culture of animal cells, 6 edition: 198, 2010 และ Frade MAC et al., An Bras Dermatol 2015"
          }
        ]
      },
      {
        "heading": "Specimens for virus isolation",
        "source": "Virus isolation in cell culture p.10",
        "body": [
          {
            "text": "หลักการเดียวที่สไลด์ย้ำคือ **appropriate clinical specimens depends on suspected viral disease** และตัวอย่าง **ต้องอยู่ในรูป liquid form**"
          },
          {
            "sub": "ตัวอย่างที่สไลด์ยกมา",
            "body": [
              {
                "bullets": [
                  "CSF",
                  "vesicular fluid",
                  "serum หรือ plasma",
                  "blood cell culture (PBMC)",
                  "secretion fluid หรือ swab",
                  "supernatant จาก 10% tissue suspension",
                  "etc."
                ]
              }
            ]
          },
          {
            "callout": "สไลด์มีคำว่า 0.2 micron filter กำกับภาพไว้ แต่ไม่ได้เขียนเป็นข้อความว่ากรองเพื่ออะไรหรือกรองขั้นตอนไหน สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "วิธี inoculate ที่ใช้บ่อย: adsorption และ co-culture",
        "source": "Virus isolation in cell culture p.11",
        "body": [
          {
            "sub": "adsorption ซึ่งสไลด์ระบุว่า most common",
            "body": [
              {
                "bullets": [
                  "sample inoculation แล้ว **incubate for 1-2 hr**",
                  "remove media",
                  "wash and replace media",
                  "incubation and observation of virus growth"
                ]
              }
            ]
          },
          {
            "sub": "co-culture",
            "body": [
              {
                "text": "ใช้ **trypsinised cell หรือ cell suspension** มา culture together กับ sample"
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าเลือกใช้ co-culture แทน adsorption ในกรณีไหน สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cytopathic effect (CPE) คืออะไร และดูด้วยอะไร",
        "source": "Virus isolation in cell culture p.12",
        "body": [
          {
            "text": "CPE คือ **evidence of viral growth in cultured cells** คือหลักฐานว่าไวรัสโตในเซลล์ที่เลี้ยงไว้"
          },
          {
            "sub": "simple light หรือ phase-contrast microscope ที่ low power",
            "body": [
              {
                "bullets": [
                  "round CPE",
                  "syncytium"
                ]
              }
            ]
          },
          {
            "sub": "high-power microscopy",
            "body": [
              {
                "text": "เห็น intracellular masses of viral particle คือ **inclusion bodies**"
              }
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่ายคือกำลังขยาย round CPE กับ syncytium ดูได้ที่ low power ส่วน inclusion body ต้อง high power",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Round CPE ตามเวลาหลัง inoculation",
        "source": "Virus isolation in cell culture p.13",
        "body": [
          {
            "text": "หน้านี้เป็นภาพเปรียบเทียบ round CPE 4 ภาพ ไล่ตามเวลา โดยมีเพียง caption กำกับว่า **uninfected control, 5 hours, 8 hours และ 24 hours after inoculation** ดัดแปลงจาก Principle of Virology, 4th edition, 2015"
          },
          {
            "callout": "สไลด์ไม่ได้บรรยายเป็นข้อความว่าแต่ละช่วงเวลาเซลล์เปลี่ยนไปอย่างไร ต้องดูจากภาพในสไลด์เอง และหน้า 14 กับ 15 เป็นสไลด์ภาพ round CPE ต่อเนื่องที่มีแต่หัวเรื่อง ไม่มีข้อความใด ๆ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ตัวอย่าง CPE ที่มีชื่อเรียกเฉพาะ: FHV-1",
        "source": "Virus isolation in cell culture p.16",
        "body": [
          {
            "text": "สไลด์ยกตัวอย่างเดียวคือ **FHV-1 ใน FK81 cell** ให้ลักษณะ **cell rounding, pyknosis และ Fleece-Pulling CPE**"
          },
          {
            "text": "อ้างอิงบนสไลด์คือ Sun H et al., Viruses, 2014 และดัดแปลงจาก Principle of Virology, 4th edition, 2015"
          }
        ]
      },
      {
        "heading": "CPE แบบ syncytial formation",
        "source": "Virus isolation in cell culture p.17",
        "body": [
          {
            "text": "หน้านี้เป็นแผนภาพการเกิด syncytium โดยมีคำอธิบายสัญลักษณ์เพียง 2 อย่างคือ **viral glycoprotein** และ **cellular receptor** ดัดแปลงจาก Principle of Virology, 4th edition, 2015"
          },
          {
            "callout": "ลำดับขั้นของการเกิด syncytium ไม่ได้เขียนเป็นข้อความบนสไลด์ มีแต่รูปกับ key สองตัวนี้ สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "CPE แบบ inclusion body และตัวอย่างที่ต้องจำ",
        "source": "Virus isolation in cell culture p.18",
        "body": [
          {
            "text": "สไลด์แบ่ง inclusion body ตามตำแหน่งเป็น **intranuclear inclusion body** กับ **intracytoplasmic inclusion body** แล้วยกตัวอย่างคู่กับเชื้อไว้ 2 คู่"
          },
          {
            "bullets": [
              "**intranuclear eosinophilic viral bodies คือ Cowdry type A inclusions พบใน herpesvirus**",
              "**intracytoplasmic eosinophilic viral bodies คือ Negri body พบใน rabies virus**"
            ]
          },
          {
            "callout": "จำคู่ตำแหน่งกับชื่อให้แน่น Cowdry type A อยู่ใน nucleus ของ herpesvirus ส่วน Negri body อยู่ใน cytoplasm ของ rabies virus ทั้งสองเป็น eosinophilic เหมือนกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ถ้าไวรัสไม่ทำให้เกิด CPE จะตรวจอย่างไร",
        "source": "Virus isolation in cell culture p.19",
        "body": [
          {
            "text": "สไลด์ระบุทางเลือกเมื่อเจอ **virus without CPE** ไว้ 3 แนวทาง"
          },
          {
            "bullets": [
              "**Immunostaining ได้แก่ ICC (immunocytochemistry) และ IF (immunofluorescence)**",
              "**detection of viral nucleic acid เช่น PCR, real-time PCR**",
              "**detection of viral protein เช่น ELISA**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เปรียบเทียบความไวหรือข้อจำกัดของแต่ละวิธี และไม่ได้ยกตัวอย่างไวรัสที่ไม่ทำให้เกิด CPE สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "microbio-1--virus-replication-genetic": {
    "topic": "microbio-1--virus-replication-genetic",
    "title": "Virus replication และ viral genetics",
    "icon": "🧬",
    "lecturer": "Aunyaratana Thontiravong",
    "summary": "เด็คนี้แบ่งเป็นสองครึ่งชัดเจน ครึ่งแรก (สไลด์ 1-26) เดินตาม replication cycle ของไวรัสทีละขั้น ตั้งแต่ attachment ถึง release พร้อม one-step growth curve กลยุทธ์การสร้าง genome และ protein ตามชนิดของ nucleic acid และตาราง Baltimore classification ครึ่งหลัง (สไลด์ 27-43) เป็น viral genetics ครอบคลุม mutation ทั้ง spontaneous และ induced การจำแนก mutant แบบ genotype และ phenotype เหตุการณ์จาก mixed infection (recombination, reassortment, complementation, phenotypic mixing, interference/DI mutants) และปิดท้ายด้วยการจำแนกไวรัสแบบ genotype เทียบกับ serotype มีหลายสไลด์ที่เป็นรูปประกอบล้วนโดยไม่มีข้อความอธิบาย (สไลด์ 7, 8, 13, 16, 18, 26, 40) เนื้อหาในโน้ตนี้จึงมาจากสไลด์ที่มีตัวอักษรจริงเท่านั้น",
    "sections": [
      {
        "heading": "ทำไมต้องเรียน virus replication",
        "source": "Virus replication&genetic p.2",
        "body": [
          {
            "text": "สไลด์เปิดด้วยคำถามว่า Why we need to learn virus replication? แล้วตอบเป็นเหตุผล 5 ข้อ"
          },
          {
            "bullets": [
              "To classify virus",
              "To understand **viral pathogenesis และ viral oncogenesis**",
              "To find the ways to **diagnose viral infection** (สไลด์เขียนกำกับว่า คิดค้นวิธีการวินิจฉัยโรคทางห้องแลป)",
              "To know how to **culture virus**",
              "To know how to develop **antiviral drug**"
            ]
          }
        ]
      },
      {
        "heading": "Virus คือ obligate intracellular parasite",
        "source": "Virus replication&genetic p.3",
        "body": [
          {
            "text": "**Virus ไม่เรียกว่าการแบ่งตัว แต่เรียกว่าการเพิ่มจำนวน** และ **unable to replicate outside the host cell**"
          },
          {
            "text": "genome ของไวรัสต้องเข้าไปใน host cell ก่อน เพื่อสร้าง viral nucleic acid และ protein สำหรับการเพิ่มจำนวน (สไลด์เขียนกำกับว่า ปล่อย genome เข้า host cell แล้วเกิดการสร้างโปรตีนขึ้นมาใหม่)"
          },
          {
            "text": "ไวรัสยืม host cell ไปทั้งสองบทบาท"
          },
          {
            "bullets": [
              "Host cell as a **manufacture** ได้แก่ nucleus, ribosome, golgi apparatus",
              "Host as a **source of raw materials** ได้แก่ nucleotides, amino acids และ some enzymes"
            ]
          }
        ]
      },
      {
        "heading": "One-step growth curve",
        "source": "Virus replication&genetic p.4",
        "body": [
          {
            "text": "สไลด์อธิบายวิธีทำว่า ทดลองใส่ไวรัสเข้าเซลล์เพาะเลี้ยง แล้วตรวจหาจำนวนไวรัสมา plot กราฟ กราฟแบ่งได้เป็น 3 ระยะ"
          },
          {
            "bullets": [
              "**Attachment stage** ระยะที่ virus ยึดเกาะกับ cell",
              "**Eclipse stage** (uncoating และ viral synthesis) มีการสังเคราะห์แล้วแต่ยังตรวจไม่พบไวรัสลูกหลาน เพราะไวรัสถอด capsid ออกไป",
              "**Productive stage** (maturation และ release)"
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์ Shore T (2009) Understanding viruses, USA, Jones and Bartlett Publishers"
          }
        ]
      },
      {
        "heading": "ภาพรวม 6 ขั้นตอนของ virus replication",
        "source": "Virus replication&genetic p.5",
        "body": [
          {
            "text": "ลำดับที่เด็คใช้เดินเรื่องทั้งครึ่งแรก จำให้ครบและเรียงถูก"
          },
          {
            "bullets": [
              "**1. Attachment**",
              "**2. Penetration/entry**",
              "**3. Uncoating**",
              "**4. Viral synthesis**",
              "**5. Assembly**",
              "**6. Release**"
            ]
          }
        ]
      },
      {
        "heading": "ขั้นที่ 1 Attachment หรือ adsorption",
        "source": "Virus replication&genetic p.6",
        "body": [
          {
            "text": "คือการจับกันระหว่าง **viral attachment proteins** กับ **specific receptors บน host cell membrane**"
          },
          {
            "text": "การจับคู่นี้เป็นตัวกำหนดสองอย่าง"
          },
          {
            "bullets": [
              "**Host species specific of virus** เรียกว่า host range",
              "**Cell or tissue specific of virus** เรียกว่า cell tropism"
            ]
          },
          {
            "sub": "Viral attachment proteins",
            "body": [
              {
                "bullets": [
                  "Capsid proteins",
                  "Enveloped proteins"
                ]
              }
            ]
          },
          {
            "sub": "Specific receptors on host cells",
            "body": [
              {
                "bullets": [
                  "Only 1 receptor",
                  "Multiple receptors คือมี **primary receptor และ co-receptors**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ 7 และ 8 เป็นรูปประกอบเรื่อง attachment และ viral receptors ล้วน (อ้างอิง Santos M et al 2003 Nature Reviews Immunology และ Knipe & Howley 2007 Field Virology 5th edn) ไม่มีข้อความอธิบายเพิ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 2 Penetration หรือ uptake มี 3 แบบ",
        "source": "Virus replication&genetic p.9-11",
        "body": [
          {
            "text": "เด็คแยกวิธีเข้าเซลล์เป็นสไลด์ละแบบ ให้จำคู่กับว่าไวรัสมี envelope หรือไม่"
          },
          {
            "bullets": [
              "**Direct penetration หรือ translocation** เป็นของ **non-enveloped viruses** ที่แทรกผ่าน plasma membrane เข้าสู่ cytoplasm ได้โดยตรง (p.9)",
              "**Endocytosis หรือ viropexis** ไวรัสหลายชนิดทั้งชนิดมีและไม่มี envelope ถูก plasma membrane โอบเข้าไปกลายเป็น endocytic vesicle (p.10)",
              "**Fusion of virus envelope with cell membrane** ไวรัสที่มี envelope บางชนิดหลอมรวมกับ plasma membrane ได้โดยตรง (p.11)"
            ]
          }
        ]
      },
      {
        "heading": "ขั้นที่ 3 Uncoating",
        "source": "Virus replication&genetic p.12",
        "body": [
          {
            "text": "คือการ **remove หรือ degrade capsid** ซึ่งเกิดได้ที่ตำแหน่งต่างกันไปในเซลล์ ผลคือปล่อย genome ออกสู่ host cell"
          },
          {
            "text": "หลังจากนั้น genome จะถูกขนส่งไปยังตำแหน่งที่ transcription หรือ replication จะเริ่มได้"
          },
          {
            "callout": "สไลด์ 13 เป็นรูป uncoating ล้วน ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 4 ชนิดของ viral genome",
        "source": "Virus replication&genetic p.14",
        "body": [
          {
            "text": "สไลด์ไล่ผังชนิดของ nucleic acid genome ออกเป็น"
          },
          {
            "bullets": [
              "**DNA** แยกเป็น **dsDNA** และ **ssDNA**",
              "**RNA** แยกเป็น **dsRNA**, **ssRNA** และ **ssRNA(RT)**",
              "ssRNA ยังแยกย่อยเป็น **(+) sense ssRNA** และ **(-) sense ssRNA**"
            ]
          },
          {
            "text": "ประเด็นที่สไลด์เน้น **genome ต่างชนิดกันบังคับให้ใช้ replication strategy ต่างกัน**"
          },
          {
            "bullets": [
              "Replication strategy ของ DNA viruses ส่วนใหญ่คล้ายกับ eukaryotic DNA replication และ transcription",
              "**RNA virus replication ซับซ้อนกว่า DNA virus** เพราะ genome ของมันหลากหลายและมีลักษณะเฉพาะตัว"
            ]
          },
          {
            "text": "สไลด์ 15 สรุปว่าขั้น viral synthesis มี 2 ขั้นสำคัญคือ 1. viral protein production (transcription, translation) และ 2. viral nucleic acid replication"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 4.1 Transcription",
        "source": "Virus replication&genetic p.17",
        "body": [
          {
            "text": "หลักที่สไลด์ขีดเส้นใต้ **ไวรัสทุกชนิดต้องแสดงยีนออกมาเป็น viral mRNA ตั้งแต่ระยะต้นของการติดเชื้อ เพื่อจะสร้าง viral proteins ได้**"
          },
          {
            "sub": "DNA viruses",
            "body": [
              {
                "text": "ส่วนใหญ่อาศัย **DNA-dependent RNA polymerase ของ host cell**"
              }
            ]
          },
          {
            "sub": "RNA viruses",
            "body": [
              {
                "bullets": [
                  "**(+) ss RNA ทำตัวเหมือน mRNA จึงถูก translate ได้ทันที**",
                  "ชนิดอื่นทั้งหมดต้องถูก transcribe เป็น mRNA ก่อน โดย **viral RNA-dependent RNA polymerase ซึ่งไม่มีใน host cell**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ 16 เป็นรูป eukaryotic DNA replication, RNA transcription และ translation ที่กำกับแค่ชื่อเอนไซม์ DNA-dependent DNA polymerase และ DNA-dependent RNA polymerase ส่วนสไลด์ 18 มีแต่หัวข้อ Transcription of DNA & RNA viral genome กับรูป ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 4.1 Translation",
        "source": "Virus replication&genetic p.19",
        "body": [
          {
            "text": "**Translation อาศัย host cell translation machinery ทั้งหมด (completely rely)**"
          },
          {
            "sub": "DNA viruses แบ่งโปรตีนเป็นสองช่วง",
            "body": [
              {
                "bullets": [
                  "**Early proteins** คือ enzymes และ proteins ที่ต้องใช้ในการ replicate viral nucleic acid รวมถึง cell shut down proteins",
                  "**Late proteins** คือ structural proteins และ virion associated enzymes"
                ]
              }
            ]
          },
          {
            "sub": "RNA viruses",
            "body": [
              {
                "text": "**All genes are expressed continuously** ไม่ได้แบ่ง early กับ late แบบ DNA viruses"
              }
            ]
          }
        ]
      },
      {
        "heading": "ขั้นที่ 4.2 Viral nucleic acid replication",
        "source": "Virus replication&genetic p.20",
        "body": [
          {
            "sub": "DNA viruses",
            "body": [
              {
                "bullets": [
                  "ใช้ replication mechanism เดียวกับ host cell",
                  "Viral DNA replication ทำโดย host cell machinery เช่น **DNA polymerase ของ host cell**"
                ]
              }
            ]
          },
          {
            "sub": "RNA viruses",
            "body": [
              {
                "bullets": [
                  "**พก viral RNA-dependent RNA polymerase มาเอง เพราะเอนไซม์นี้ไม่มีใน host cell**",
                  "ต้องสร้าง **complementary RNA** ขึ้นมาก่อน เพื่อใช้เป็น template ในการสร้าง viral RNA ต่อ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตำแหน่งที่เกิด transcription และ replication",
        "source": "Virus replication&genetic p.21",
        "body": [
          {
            "bullets": [
              "**DNA viruses ส่วนใหญ่เกิดใน nucleus** ใช้ cellular DNA-dependent RNA polymerase, DNA polymerase และเอนไซม์อื่นของเซลล์",
              "**RNA viruses ส่วนใหญ่เกิดใน cytoplasm** ใช้ viral RNA-dependent RNA polymerase ที่ host cell ไม่ได้จัดหาให้ หรือถ้าเป็น (+)ssRNA ตัว genome ก็ทำหน้าที่เป็น mRNA เอง"
            ]
          }
        ]
      },
      {
        "heading": "Baltimore classification",
        "source": "Virus replication&genetic p.22",
        "body": [
          {
            "text": "ตารางแบ่งไวรัสเป็น 7 class ตามชนิด nucleic acid พร้อมตัวอย่าง เอนไซม์ที่ใช้ และตำแหน่งที่เกิด transcription กับ replication"
          },
          {
            "bullets": [
              "**Class I dsDNA** ตัวอย่าง Herpesvirus, Adenovirus, Poxvirus เอนไซม์ที่ตารางระบุคือ cellular DdRp และ DpDp กับ viral DdRp และ DpDp ตำแหน่งคือ nucleus และ cytoplasm",
              "**Class II ssDNA** ตัวอย่าง Parvovirus ใช้ cellular DdRp และ DpDp ที่ **nucleus**",
              "**Class III dsRNA** ตัวอย่าง Rotavirus, Reovirus ใช้ **viral RdRp** ที่ **cytoplasm**",
              "**Class IV (+) ssRNA** ตัวอย่าง Piconavirus, Flavivirus, Coronavirus, Togavirus ใช้ **viral RdRp เฉพาะตอน replication** ที่ **cytoplasm**",
              "**Class V (-) ssRNA** ตัวอย่าง Paramyxovirus, Orthomyxovirus, Rhabdovirus ใช้ **viral RdRp** ที่ **cytoplasm**",
              "**Class VI (+) ssRNA with DNA intermediate** ตัวอย่าง Retrovirus ใช้ **viral RTase และ cellular DdRp** ที่ **nucleus และ cytoplasm**",
              "**Class VII dsDNA with RNA intermediate** ตัวอย่าง Hepadnavirus ใช้ **viral RTase และ cellular DdRp** ที่ **nucleus และ cytoplasm**"
            ]
          },
          {
            "callout": "ใน class I ตารางให้เอนไซม์และตำแหน่งไว้สองชุด (cellular DdRp&DpDp ที่ nucleus กับ viral DdRp&DpDp ที่ cytoplasm) แต่ text layer ที่ดึงมาไม่ได้บอกชัดว่าตัวอย่างไหนคู่กับชุดไหน ให้เปิดสไลด์จริงดูการเรียงคอลัมน์ก่อนท่องคู่",
            "kind": "warn"
          },
          {
            "callout": "ตัวย่อในตาราง DdRp = DNA-dependent RNA polymerase, DpDp = DNA-dependent DNA polymerase, RdRp = RNA-dependent RNA polymerase ตามที่ใช้ในสไลด์ก่อนหน้า สไลด์นี้ไม่ได้กางตัวย่อไว้เอง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 5 Assembly",
        "source": "Virus replication&genetic p.23",
        "body": [
          {
            "text": "คือกระบวนการที่ virus particle ถูกประกอบขึ้น เมื่อองค์ประกอบทั้งหมดของไวรัส (viral genome และ proteins ที่เพิ่งสังเคราะห์เสร็จ) มารวมกันที่ตำแหน่งจำเพาะในเซลล์"
          },
          {
            "text": "**Assembly sites ได้แก่ nucleus, cytoplasm และ cellular membrane**"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 6 Release มี 2 แบบ",
        "source": "Virus replication&genetic p.24-25",
        "body": [
          {
            "sub": "Cell lysis (p.24)",
            "body": [
              {
                "bullets": [
                  "พบใน **non-enveloped viruses ส่วนใหญ่ และ enveloped virus บางชนิด**",
                  "เซลล์ที่ติดเชื้อแตกออกแล้วปล่อยไวรัสออกมา",
                  "**Host cell dies immediately**"
                ]
              }
            ]
          },
          {
            "sub": "Budding (p.25)",
            "body": [
              {
                "bullets": [
                  "พบใน **enveloped virus**",
                  "Bud ผ่าน plasma membrane ตรงบริเวณที่มี **glycoprotein spikes** มาสะสมอยู่",
                  "**Exocytosis** คือ bud เข้า cytoplasmic vesicles ที่ RER หรือ Golgi แล้วเดินทางผ่าน cytoplasm ใน smooth vesicles ก่อนถูกปล่อยออกโดย exocytosis",
                  "**Host cells remain alive for a while** ต่างจาก cell lysis"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์ MacLachlan (2011) Fenner's Veterinary Virology, 4th edition, USA, Elsevier"
          }
        ]
      },
      {
        "heading": "แผนภาพสรุป replication cycle",
        "source": "Virus replication&genetic p.26",
        "body": [
          {
            "text": "สไลด์นี้เป็นแผนภาพวงจรที่ไล่ ATTACHMENT ไป PENETRATION ไป UNCOATING ไป REPLICATION (transcription, translation) ไป ASSEMBLY (MATURATION) ไป RELEASE"
          },
          {
            "text": "จุดที่แผนภาพกำกับไว้คือคำว่า **HOST FUNCTIONS** ซึ่งครอบช่วง replication, transcription และ translation นอกนั้นเป็นรูปล้วน ไม่มีคำอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "ทำไมต้องรู้ viral genetics",
        "source": "Virus replication&genetic p.28",
        "body": [
          {
            "text": "สไลด์ 27 เป็นสไลด์คั่นหัวข้อ Viral genetics เฉย ๆ ส่วนสไลด์ 28 ให้เหตุผลว่าความรู้ด้าน viral genetics สำคัญต่อ"
          },
          {
            "bullets": [
              "การเข้าใจ **viral pathogenesis และ transmission**",
              "การเข้าใจทั้ง **การเกิดโรคไวรัสอุบัติใหม่** และ **การคงอยู่ของโรคประจำถิ่น**",
              "การ **prevention, control และ treatment** ของโรคไวรัส รวมถึงการพัฒนา antiviral drug และ vaccine ตัวใหม่"
            ]
          }
        ]
      },
      {
        "heading": "ทำไมไวรัสถึงเปลี่ยนแปลงทางพันธุกรรมได้เร็ว",
        "source": "Virus replication&genetic p.29",
        "body": [
          {
            "bullets": [
              "ไวรัสเพิ่มจำนวนเร็ว จึงมี **progeny virions จำนวนมาก**",
              "**โอกาสเกิดการเปลี่ยนแปลงทางพันธุกรรม (mutation, reassortment, recombination) ในเวลาสั้น ๆ จึงสูง**",
              "เกิด **genetic variants** ซึ่งบางตัวมีคุณสมบัติทางชีวภาพต่างจาก parental virus เช่น **virulence, tropism, host range หรือ antibody response**",
              "ผลปลายทางคือการเกิดโรคไวรัสอุบัติใหม่และการคงอยู่ของโรคประจำถิ่น"
            ]
          }
        ]
      },
      {
        "heading": "ผังรวมการเปลี่ยนแปลงทางพันธุกรรมของไวรัส",
        "source": "Virus replication&genetic p.30",
        "body": [
          {
            "text": "สไลด์นี้เป็นสารบัญของครึ่งหลัง แบ่งเป็นสองสาย"
          },
          {
            "sub": "Mutation (genetic drift)",
            "body": [
              {
                "bullets": [
                  "Base substitution mutation หรือ point mutation",
                  "Frameshifting",
                  "Mutation rates in viruses"
                ]
              }
            ]
          },
          {
            "sub": "Mixed infection",
            "body": [
              {
                "bullets": [
                  "**Genetic interaction** ได้แก่ recombination และ reassortment",
                  "**Protein interaction** ได้แก่ complementation และ phenotypic mixing"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์วงเล็บคำว่า genetic drift ไว้หลัง mutation เท่านั้น ไม่ได้นิยาม genetic drift หรือพูดถึง genetic shift เลยในเด็คนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Mutation คืออะไร และเกิดจากอะไร",
        "source": "Virus replication&genetic p.31",
        "body": [
          {
            "text": "นิยามบนสไลด์ **mutation คือการเปลี่ยนแปลงของ nucleotide sequence ที่เกิดเฉพาะจุด (localized) และถ่ายทอดต่อได้ (inheritable)**"
          },
          {
            "bullets": [
              "**Spontaneous mutation** เกิดจาก errors ในการ copy viral nucleic acid โดย viral polymerase ระหว่าง replication cycle",
              "**Induced mutation** เกิดจาก chemical damage ต่อ viral nucleic acid"
            ]
          }
        ]
      },
      {
        "heading": "Spontaneous mutation และ quasispecies",
        "source": "Virus replication&genetic p.32",
        "body": [
          {
            "text": "สไลด์นี้ขยายเรื่อง polymerase error ซึ่งเป็นข้อสอบคลาสสิก"
          },
          {
            "bullets": [
              "**Mutation rates สูงกว่าใน RNA viruses มากกว่า DNA viruses**",
              "เหตุผลคือ **RNA-dependent RNA polymerase ของ RNA viruses ขาด proofreading activity (3'-5' exonuclease activity)**",
              "ผลลัพธ์คือได้ส่วนผสมของ virus variants หลายแบบ เรียกว่า **quasispecies**"
            ]
          }
        ]
      },
      {
        "heading": "Induced mutation",
        "source": "Virus replication&genetic p.33",
        "body": [
          {
            "bullets": [
              "**Physical agents** เช่น UV light และ X-irradiation",
              "**Chemical agents** เช่น nitrous acid, intercalating agent, hydroxylating agent และ alkylating agent",
              "**Base analog**"
            ]
          },
          {
            "callout": "สไลด์ 31 บอกว่า induced mutation เกิดจาก chemical damage แต่สไลด์ 33 ใส่ physical agents เข้ามาด้วย ให้ยึดรายการบนสไลด์ 33 เวลาตอบว่ามีอะไรบ้าง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Types of mutation แบบที่ 1 จำแนกตาม genotype",
        "source": "Virus replication&genetic p.34-35",
        "body": [
          {
            "sub": "Base substitution mutation หรือ point mutation (p.34)",
            "body": [
              {
                "bullets": [
                  "คือการแทนที่ nucleotide ตัวเดียวด้วย nucleotide ตัวอื่นใน sequence",
                  "**เป็น mutation ที่พบบ่อยที่สุด (most common mutations)**",
                  "แบ่งย่อยเป็น **silent mutation, mis-sense mutation และ non-sense mutation** โดยสไลด์ไม่ได้อธิบายความต่างของสามแบบนี้เป็นข้อความ มีแต่รูปประกอบ"
                ]
              }
            ]
          },
          {
            "sub": "Frameshift mutation (p.35)",
            "body": [
              {
                "bullets": [
                  "เกิดจาก **insertion หรือ deletion ของ nucleotide**",
                  "ผลคือ **เลื่อน open reading frame ทั้งอัน**",
                  "สไลด์เขียนเปรียบเทียบไว้สั้น ๆ ว่า point mutation > frameshifting แต่ไม่ได้บอกว่าเทียบกันในแง่ใด (ความถี่หรือความรุนแรง) สไลด์ไม่ได้บอก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Types of mutation แบบที่ 2 จำแนกตาม phenotype",
        "source": "Virus replication&genetic p.36",
        "body": [
          {
            "text": "สไลด์ไล่ชื่อ mutant ตามลักษณะที่แสดงออก ไม่ได้อธิบายแต่ละตัว"
          },
          {
            "bullets": [
              "**Plaque morphology mutants**",
              "**Antibody escape mutants**",
              "**Conditional lethal mutants**",
              "**Host range mutants**",
              "**Temperature-sensitive mutants**",
              "**Cold-adaptive mutants**",
              "**Drug resistance mutants**"
            ]
          },
          {
            "callout": "สไลด์จัด conditional lethal mutants ไว้เป็นหัวข้อแล้วมีรายการต่อท้าย แต่ไม่ได้ระบุชัดว่าตัวไหนเป็นลูกของ conditional lethal ให้เปิดสไลด์จริงดูการเยื้องบรรทัด",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Mixed infection: viral genetic interactions",
        "source": "Virus replication&genetic p.37-38",
        "body": [
          {
            "text": "สไลด์ 37 วางกรอบว่า mixed infection ทำให้เกิด genetic interaction (recombination, reassortment) และ protein interaction (complementation, phenotypic mixing) สไลด์ 38 นิยามฝั่ง genetic"
          },
          {
            "bullets": [
              "**Recombination คือการแลกเปลี่ยน nucleotide sequences ระหว่าง genome สองอัน**",
              "**Reassortment คือการแลกเปลี่ยน genome segments ระหว่าง viral strains ที่ต่างกัน**",
              "**Reassortment เกิดเฉพาะใน RNA viruses ที่มี segmented genome เท่านั้น (unique)**"
            ]
          }
        ]
      },
      {
        "heading": "Mixed infection: complementation",
        "source": "Virus replication&genetic p.39",
        "body": [
          {
            "bullets": [
              "คือ **interaction ระหว่าง viral proteins ในเซลล์ที่ติดเชื้อสองไวรัสพร้อมกัน** ผลคือ rescue หรือเพิ่ม yield ของไวรัสตัวใดตัวหนึ่งหรือทั้งสองตัว",
              "**เป็น interaction ที่ระดับ functional ไม่ใช่ระดับ nucleic acid**"
            ]
          },
          {
            "callout": "สไลด์ 40 เป็นแผนภาพ complementation ที่กำกับเพียงคำว่า ENV, POL, infecting viruses, infected cell และ progeny viruses ไม่มีคำอธิบายเป็นข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Mixed infection: phenotypic mixing",
        "source": "Virus replication&genetic p.41",
        "body": [
          {
            "text": "**Progeny virions ได้ลักษณะทาง phenotype มาจาก parental viruses ทั้งสองตัว หลังเกิด mixed infection** สไลด์เขียนไว้เท่านี้ ที่เหลือเป็นรูปประกอบ"
          }
        ]
      },
      {
        "heading": "Mixed infection: interference และ DI mutants",
        "source": "Virus replication&genetic p.42",
        "body": [
          {
            "text": "**Interference คือปรากฏการณ์ที่ไวรัสสองตัวมีปฏิสัมพันธ์กันในโฮสต์ แล้วส่งผลต่อความสามารถในการเพิ่มจำนวนของอย่างน้อยหนึ่งในสองตัวนั้น**"
          },
          {
            "sub": "Defective interfering (DI) mutants",
            "body": [
              {
                "bullets": [
                  "ส่วนใหญ่จัดเป็น **deletion mutants** คือมี RNA molecule สั้นลง ทำให้ขาดหน้าที่ที่จำเป็นต่อการทำ replication cycle ให้ครบ",
                  "**เพิ่มจำนวนเองไม่ได้ (non-infectious virus)** ต้องอาศัย wild-type ที่เป็น **helper virus** (infectious virus) มาเติมหน้าที่ที่ขาดไป",
                  "**รบกวนการเพิ่มจำนวนของ infectious virus**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Virus classification: genotype เทียบกับ serotype",
        "source": "Virus replication&genetic p.43",
        "body": [
          {
            "sub": "Genotype",
            "body": [
              {
                "bullets": [
                  "จำแนกจาก **genetic variation ของยีนที่แปรผันสูงของไวรัส** เช่น envelope หรือ capsid gene",
                  "ตรวจด้วย nucleic acid-based method ได้แก่ **PCR/RT-PCR และ DNA sequencing** หรือ **genotype-specific qPCR/RT-qPCR**",
                  "**ทำง่าย จึงใช้กันแพร่หลายที่สุด**"
                ]
              }
            ]
          },
          {
            "sub": "Serotype",
            "body": [
              {
                "bullets": [
                  "จำแนกจาก **ปฏิกิริยาระหว่าง virus strain กับ antibody ที่จำเพาะต่อ serotype นั้น**",
                  "ตรวจด้วย **virus neutralization test หรือ HI test**",
                  "**Less practical เมื่อเทียบกับ genotype**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "microbio-1--virus-structure-classification": {
    "topic": "microbio-1--virus-structure-classification",
    "title": "Virus Structure Classification",
    "icon": "🧬",
    "summary": "เด็คเปิดหัวข้อ Virus ของวิชาจุลชีววิทยาทางสัตวแพทย์ I ครอบคลุม 5 เรื่องหลัก คือ (1) นิยามและคุณสมบัติของ virus (2) โครงสร้าง virion ตั้งแต่ nucleic acid, capsid, nucleocapsid ถึง envelope (3) รูปแบบ symmetry สามแบบ icosahedral helical complex และ five basic structural forms พร้อมตัวอย่างไวรัส (4) หลักการ classification และ virus taxonomy ตาม ICTV (5) unconventional agents คือ viroids และ prions ทั้งเด็คมี 36 สไลด์ แต่หลายสไลด์เป็นภาพล้วนไม่มีข้อความ (สไลด์ 4, 5, 6, 8, 9, 26, 33) สไลด์ 7 มีแต่หัวเรื่อง CORONAVIRUS STRUCTURE และสไลด์ 28-29 เป็นแผนภาพ RNA Viruses กับ DNA Viruses ที่อ้างจาก Principles of Virology (Flint et al, ASM Press) โดยไม่มีคำอธิบายเป็นตัวอักษร สไลด์สุดท้ายเป็นข้อความให้กำลังใจ ไม่ใช่เนื้อหาวิชาการ",
    "sections": [
      {
        "heading": "Virus คืออะไร",
        "source": "Virus Structure Classification p.2",
        "body": [
          {
            "text": "สไลด์นิยาม virus ว่าเป็น **subcellular organism ขนาด 25-300 nm** และเป็น **obligate parasite** ของ animals, plants และ bacteria"
          },
          {
            "bullets": [
              "**cannot grow without host cells** คือเจริญเองไม่ได้ ต้องอาศัย host cell เสมอ",
              "virus ใช้ host cell เป็น **factory** โดยใช้ machinery และ resources ของเซลล์เจ้าบ้าน ภายใต้การกำกับของ viral genome เพื่อสร้าง virus progeny"
            ]
          }
        ]
      },
      {
        "heading": "Virus Characteristics",
        "source": "Virus Structure Classification p.3",
        "body": [
          {
            "bullets": [
              "Genome เป็น **DNA หรือ RNA อย่างใดอย่างหนึ่ง** (ไม่มีทั้งสองอย่างพร้อมกัน)",
              "Genome ถูกห่อหุ้มด้วย capsid proteins เรียกโครงสร้างรวมนี้ว่า **nucleocapsid**",
              "หน่วยย่อยที่เป็นโปรตีนของ capsid เรียกว่า **capsomers หรือ capsomeres**",
              "อาจมีหรือไม่มี envelope (lipid bilayer + enveloped proteins) จึงแบ่งเป็น **Enveloped หรือ Naked viruses**",
              "อนุภาคไวรัสที่สมบูรณ์เรียกว่า **virion**"
            ]
          },
          {
            "callout": "คำสี่คำที่ต้องแยกให้ออกตั้งแต่สไลด์นี้ คือ capsid (เปลือกโปรตีน) capsomer (หน่วยย่อยของ capsid) nucleocapsid (genome + capsid) และ virion (อนุภาคไวรัสสมบูรณ์)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Viral structure: ทุกไวรัสมีอะไรบ้าง",
        "source": "Virus Structure Classification p.10",
        "body": [
          {
            "text": "**ไวรัสทุกชนิดมี nucleic acid genome (RNA หรือ DNA) และ protective protein coat ที่เรียกว่า capsid** และเรียก nucleic acid genome รวมกับ protective protein coat ว่า **nucleocapsid**"
          }
        ]
      },
      {
        "heading": "Symmetry ของ nucleocapsid และที่มาของ envelope",
        "source": "Virus Structure Classification p.11",
        "body": [
          {
            "bullets": [
              "nucleocapsid อาจมี symmetry แบบ **icosahedral, helical หรือ complex**",
              "nucleocapsid ของไวรัสบางชนิดถูกหุ้มด้วย **lipoprotein envelope ที่ได้มาจากการ budding ผ่าน host cell membrane**",
              "membrane ที่ budding ผ่านอาจเป็น plasma membrane หรือ membrane อื่น เช่น **Golgi body หรือ nucleus**"
            ]
          }
        ]
      },
      {
        "heading": "Viral nucleic acids: ประเภทของ genome",
        "source": "Virus Structure Classification p.12",
        "body": [
          {
            "text": "Viral genes ถูก encode อยู่ใน genome ที่เป็น DNA หรือ RNA และแบ่งย่อยได้ตามลักษณะดังนี้"
          },
          {
            "bullets": [
              "**Double stranded หรือ Single stranded**",
              "**Monopartite (non-segmented) หรือ Multipartite (segmented)**"
            ]
          }
        ]
      },
      {
        "heading": "Sense (polarity) ของ single stranded RNA",
        "source": "Virus Structure Classification p.13",
        "body": [
          {
            "text": "**Single stranded genomic RNA จำแนกตาม sense หรือที่เรียกอีกอย่างว่า polarity**"
          },
          {
            "bullets": [
              "**Positive sense** คือมี sense เดียวกับ mRNA",
              "**Negative sense** คือ genome เป็น complementary ต่อ mRNA ซึ่ง mRNA นั้นถูก transcribe โดย **RNA-dependent RNA polymerase (transcriptase)**"
            ]
          }
        ]
      },
      {
        "heading": "รูปร่างของ genome: Linear หรือ Circular",
        "source": "Virus Structure Classification p.14",
        "body": [
          {
            "text": "สไลด์ระบุเพียงว่า viral nucleic acid เป็นได้ทั้งแบบ **Linear หรือ Circular** ส่วนที่เหลือของสไลด์เป็นภาพประกอบ ไม่มีคำอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "The crucial function of the capsid",
        "source": "Virus Structure Classification p.15",
        "body": [
          {
            "bullets": [
              "**ปกป้อง nucleic acid genome จาก physical, chemical หรือ enzymatic damage**",
              "**นำพา viral genome ผ่าน host cells**"
            ]
          }
        ]
      },
      {
        "heading": "Icosahedral symmetry",
        "source": "Virus Structure Classification p.16",
        "body": [
          {
            "text": "**icosahedron เป็น Platonic solid ที่มี 12 vertices, 30 edges และ 20 faces**"
          }
        ]
      },
      {
        "heading": "5:3:2 rotational symmetry",
        "source": "Virus Structure Classification p.17",
        "body": [
          {
            "text": "สไลด์นี้ระบุสั้น ๆ ว่า icosahedral symmetry เป็นแบบ **5:3:2 rotational symmetry** ส่วนรายละเอียดว่าแกนแต่ละชุดวางตัวอย่างไร สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Capsomers, pentons และ hexons",
        "source": "Virus Structure Classification p.18",
        "body": [
          {
            "bullets": [
              "capsid shell ประกอบด้วย repeating polypeptide subunits เรียกว่า **capsomers**",
              "capsomers ที่อยู่ตรงมุม (corners) จะ interact กับเพื่อนบ้าน **5 ตัว** จึงเรียกว่า **pentons หรือ pentamers**",
              "ในไวรัสที่ใหญ่ขึ้น capsomers จะ bond กับ capsomers ข้างเคียง **6 ตัว** เรียกว่า **hexons หรือ hexamers**"
            ]
          }
        ]
      },
      {
        "heading": "Helical symmetry",
        "source": "Virus Structure Classification p.20",
        "body": [
          {
            "text": "**Protein subunits สามารถ interact กันเองและ interact กับ nucleic acid เกิดเป็นโครงสร้างขดแบบ coiled ribbon like structure** ตัวอย่างที่สไลด์ยกคือ **Tobacco mosaic virus, Sendai virus** เป็นต้น"
          }
        ]
      },
      {
        "heading": "Complex symmetry",
        "source": "Virus Structure Classification p.21",
        "body": [
          {
            "text": "**เป็นโครงสร้างที่ regular แต่ธรรมชาติของ symmetry ยังไม่เข้าใจอย่างสมบูรณ์ (not fully understood)** ตัวอย่างคือ **Poxvirus**"
          }
        ]
      },
      {
        "heading": "Viral envelopes: ได้มาจากไหน",
        "source": "Virus Structure Classification p.22",
        "body": [
          {
            "bullets": [
              "**Enveloped virions ได้ชั้นนอกมาตอนที่ nucleocapsid ถูกดันผ่าน cellular membrane กระบวนการนี้เรียกว่า budding**",
              "**lipids มาจาก cellular membrane โดยตรง แต่ proteins ที่อยู่กับ envelope เป็นของไวรัสเอง (virus coded)**"
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่ายคือการแยกว่าอะไรเป็นของเซลล์เจ้าบ้านและอะไรเป็นของไวรัส ไขมันของ envelope มาจาก host membrane แต่โปรตีนบน envelope ไวรัสเป็นคน code เอง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "โปรตีนที่เกี่ยวข้องกับ envelope",
        "source": "Virus Structure Classification p.23",
        "body": [
          {
            "bullets": [
              "**Matrix proteins** เป็น internal virion proteins ทำหน้าที่เชื่อม internal nucleocapsid assembly เข้ากับ envelope",
              "**Glycoproteins** เป็น transmembrane proteins ที่ anchor อยู่กับ membrane",
              "**External glycoproteins เรียกว่า spikes**",
              "**Transport channel proteins**"
            ]
          }
        ]
      },
      {
        "heading": "หน้าที่สำคัญสี่อย่างของ envelope-associated proteins",
        "source": "Virus Structure Classification p.24",
        "body": [
          {
            "bullets": [
              "**Receptor binding**",
              "**Membrane fusion**",
              "**Uncoating**",
              "**Receptor destruction**"
            ]
          }
        ]
      },
      {
        "heading": "FIVE BASIC STRUCTURAL FORMS OF VIRUSES",
        "source": "Virus Structure Classification p.25",
        "body": [
          {
            "text": "สไลด์แบ่งไวรัสตามโครงสร้างเป็น 5 แบบพร้อมตัวอย่าง ควรจำคู่ตัวอย่างให้ได้เพราะเป็นสไลด์สรุปที่รวบทุกอย่างก่อนหน้าเข้าด้วยกัน"
          },
          {
            "bullets": [
              "**Naked icosahedral** เช่น circovirus, parvovirus, adenovirus, reovirus, birnavirus",
              "**Naked helical** เช่น tobacco mosaic virus",
              "**Enveloped icosahedral** เช่น herpesvirus, flavivirus, retrovirus, arterivirus",
              "**Enveloped helical** เช่น rabies virus, influenza virus, parainfluenza virus, coronavirus",
              "**Complex** เช่น poxvirus"
            ]
          }
        ]
      },
      {
        "heading": "Classification of viruses",
        "source": "Virus Structure Classification p.27",
        "body": [
          {
            "text": "การจำแนกไวรัสอ้างอิงจากสองอย่าง คือ"
          },
          {
            "bullets": [
              "**The structure หรือ composition ของ virus particle (virion)**",
              "**The mode of replication**"
            ]
          },
          {
            "text": "สไลด์ถัดไปอีกสองหน้าเป็นแผนภาพ RNA Viruses และ DNA Viruses ที่อ้างที่มาว่า From Principles of Virology Flint et al ASM Press โดยไม่มีข้อความอธิบายในสไลด์ ต้องดูจากภาพในเด็คของอาจารย์เอง"
          }
        ]
      },
      {
        "heading": "Virus Taxonomy: ลำดับขั้นและคำลงท้าย",
        "source": "Virus Structure Classification p.30",
        "body": [
          {
            "text": "Universal Scheme จัดไวรัสเข้าลำดับขั้นต่อไปนี้ โดยแต่ละขั้นมี **suffix** ประจำที่ต้องจำ"
          },
          {
            "bullets": [
              "**Orders ลงท้าย -virales** เช่น Mononegavirales",
              "**Families ลงท้าย -viridae** เช่น Poxviridae",
              "**Subfamilies ลงท้าย -virinae** เช่น Alphaherpesvirinae",
              "**Genera ลงท้าย -virus** เช่น genus Simplexvirus",
              "**Species** นิยามตาม van Regenmortel (1990) ว่า a virus species is defined as a polythetic class of viruses that constitutes a replicating lineage and occupies a particular ecological niche"
            ]
          }
        ]
      },
      {
        "heading": "Some Properties of Viruses Used in Taxonomy",
        "source": "Virus Structure Classification p.31",
        "body": [
          {
            "text": "สไลด์นี้เป็นตารางยาวรวมคุณสมบัติที่ใช้ในการจัดหมวดหมู่ไวรัส แบ่งเป็นกลุ่มใหญ่ ๆ ดังนี้"
          },
          {
            "sub": "Morphology",
            "body": [
              {
                "bullets": [
                  "virion size, virion shape",
                  "presence or absence and nature of **peplomers**",
                  "presence or absence of an envelope",
                  "capsid symmetry and structure"
                ]
              }
            ]
          },
          {
            "sub": "Physicochemical and Physical Properties",
            "body": [
              {
                "bullets": [
                  "virion molecular mass (Mr), virion buoyant density (in CsCl, sucrose เป็นต้น), virion sedimentation coefficient",
                  "pH stability, thermal stability, cation stability (Mg++, Mn++), solvent stability, detergent stability, irradiation stability"
                ]
              }
            ]
          },
          {
            "sub": "Genome",
            "body": [
              {
                "bullets": [
                  "type of nucleic acid (DNA หรือ RNA), size of genome เป็น kb หรือ kbp",
                  "strandedness single หรือ double stranded, linear หรือ circular",
                  "sense (positive-sense, negative-sense, **ambisense**), number and size of segments",
                  "nucleotide sequence หรือ partial sequence, presence of repetitive sequence elements, presence of isomerization, G+C ratio",
                  "presence or absence and type of **5'-terminal cap**, presence or absence of 5'-terminal covalently-linked protein, presence or absence of **3'-terminal poly (A) tract**"
                ]
              }
            ]
          },
          {
            "sub": "Proteins",
            "body": [
              {
                "bullets": [
                  "number, size and functional activities ของ structural proteins และ non-structural proteins",
                  "special functional activities โดยเฉพาะ **transcriptase, reverse transcriptase, hemagglutinin, neuraminidase และ fusion activities**",
                  "amino acid sequence หรือ partial sequence, glycosylation, phosphorylation, myristylation, epitope mapping"
                ]
              }
            ]
          },
          {
            "sub": "Lipids และ Carbohydrates",
            "body": [
              {
                "text": "สไลด์ระบุเพียง content, character เป็นต้น ไม่ได้ลงรายละเอียดมากกว่านี้"
              }
            ]
          },
          {
            "sub": "Genome organization and replication",
            "body": [
              {
                "bullets": [
                  "genome organization, strategy of replication, number and position of **open reading frames**",
                  "transcriptional characteristics, translational characteristics, post-translational processing",
                  "site of accumulation of virion proteins, site of virion assembly, site and nature of virion maturation and release"
                ]
              }
            ]
          },
          {
            "sub": "Antigenic Properties และ Biologic Properties",
            "body": [
              {
                "bullets": [
                  "**Antigenic**: serologic relationships โดยเฉพาะที่ได้จาก reference centers",
                  "**Biologic**: natural host range, mode of transmission in nature, vector relationships, geographic distribution, pathogenicity และความสัมพันธ์กับโรค, tissue tropisms, pathology, histopathology"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ฐานข้อมูล taxonomy ที่ใช้อ้างอิง",
        "source": "Virus Structure Classification p.32",
        "body": [
          {
            "text": "สไลด์ชี้ไปที่ **Virus Taxonomy: The database of the International Committee on Taxonomy of Viruses (ICTV)** เป็นแหล่งอ้างอิง taxonomy ส่วนสไลด์ถัดไปเป็นภาพประกอบไม่มีข้อความ"
          }
        ]
      },
      {
        "heading": "Unconventional agents: Viroids",
        "source": "Virus Structure Classification p.34",
        "body": [
          {
            "bullets": [
              "เป็น **small (น้อยกว่า 400 nucleotides), single stranded, circular RNAs**",
              "**RNA ไม่ถูก packaged** และ **ไม่ปรากฏว่า code สำหรับโปรตีนใด ๆ**",
              "**เท่าที่มีรายงาน พบสัมพันธ์กับ plant disease เท่านั้น**"
            ]
          }
        ]
      },
      {
        "heading": "Unconventional agents: Prions",
        "source": "Virus Structure Classification p.35",
        "body": [
          {
            "bullets": [
              "**Prions ประกอบด้วยโปรตีนเพียงอย่างเดียว (protein only)**",
              "เป็น **small proteinaceous particles**",
              "ตัวอย่างโรคในคนที่เกิดจาก prion ที่สไลด์ยก คือ **Kuru, Creutzfeldt-Jakob disease และ Gerstmann-Straussler syndrome**",
              "ในสัตว์ สไลด์ยก **scrapie ในแกะ และ BSE ในโค**"
            ]
          },
          {
            "callout": "สไลด์บอกแค่ว่า prion เป็นโปรตีนล้วนและยกรายชื่อโรค ส่วนกลไกการเกิดโรคหรือการเปลี่ยนรูปของโปรตีน สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นภาพล้วน ต้องเปิดเด็คจริงประกอบ",
        "source": "Virus Structure Classification p.4",
        "body": [
          {
            "text": "เด็คนี้มี 36 สไลด์ แต่มีหลายสไลด์ที่ text layer ว่างเปล่าเพราะเป็นภาพล้วน ได้แก่ **สไลด์ 4, 5, 6, 8, 9, 26 และ 33** และสไลด์ 7 มีแต่หัวเรื่อง **CORONAVIRUS STRUCTURE** โดยไม่มีข้อความอธิบาย เนื้อหาในภาพเหล่านี้อ่านจากไฟล์ข้อความไม่ได้ ต้องเปิดสไลด์ของอาจารย์ดูเอง"
          },
          {
            "callout": "สไลด์ 19 ไม่ได้ว่างเปล่า แต่มีเฉพาะที่อยู่ของรูปสามบรรทัด คือ www.vir.gla.ac.uk/staff/rixonfj/hexpen.jpg, hub.med.uth.tmc.edu/~plo/subunits-new.jpg (herpes) และ www.fhcrc.org/.../2002/mar21/CAPSID.jpg (human papilloma) ส่วนสไลด์ 23 มีลิงก์วิดีโอ youtube.com/watch?v=M1zws0bF4w8 และไฟล์ coronavirus-diagram.gif แนบไว้ ตัวเนื้อหาในภาพและวิดีโอ สไลด์ไม่ได้เขียนเป็นตัวอักษร",
            "kind": "flag"
          }
        ]
      }
    ]
  }
};
