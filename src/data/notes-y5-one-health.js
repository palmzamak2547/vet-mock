// ============================================================
// Y5 สุขภาพหนึ่งเดียว (3109502) — Study Notes
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
//   "..."                        — paragraph: a plain string (lint:note-shapes)
// ============================================================

export const NOTES_Y5_ONE_HEALTH = {
  "oh-vet-role": {
    "topic": "oh-vet-role",
    "title": "บทบาทสัตวแพทย์ใน One Health",
    "lecturer": "Saharuetai Jeamsripong",
    "icon": "🩺",
    "summary": "เลกเชอร์วันที่ 5 ส.ค. 2569 ว่าด้วยบทบาทของสัตวแพทย์ใน One Health โดยไล่ตาม 8 ประเด็นหลักที่สไลด์วางไว้ ตั้งแต่โรคติดเชื้ออุบัติใหม่ สาธารณสุข ความปลอดภัยอาหาร สัตว์เลี้ยง AMR การก่อการร้ายชีวภาพ มลพิษสิ่งแวดล้อม จนถึงการเปลี่ยนแปลงสภาพภูมิอากาศ ทั้งเลกเชอร์เป็นภาษาอังกฤษ มีตัวเลขอ้างอิงพร้อมแหล่งที่มาแทบทุกสไลด์ และมีแผนปฏิบัติการ AMR ของไทย 2023-2027 เป็นเนื้อหาเฉพาะประเทศไทยชิ้นเดียวในเลกเชอร์นี้",
    "sections": [
      {
        "heading": "บทนำ — ทำไม One Health ต้องมีสัตวแพทย์",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.2-5",
        "body": [
          {
            "sub": "9 เหตุผลที่สไลด์ยกมา (p.2)",
            "body": [
              {
                "bullets": [
                  "ประชากรมนุษย์เพิ่มขึ้น (increase of human population)",
                  "การสัมผัสระหว่างคนกับสัตว์ป่าเพิ่มขึ้น (increase in human-wildlife contact)",
                  "การเปลี่ยนแปลงของสิ่งแวดล้อม (environmental changes)",
                  "การเดินทางระหว่างประเทศขยายตัว (expansion of international travel)",
                  "การใช้ยาต้านจุลชีพและการดื้อยา (**AMU** and **AMR**)",
                  "การคุ้มครองอาหาร (food protection)",
                  "ประชากรกลุ่ม immunocompromised เพิ่มขึ้น",
                  "การผลิตอาหารทางทะเล (marine food production)",
                  "มลพิษจากจุลชีพและสารเคมี (microbial and chemical pollution)"
                ]
              }
            ]
          },
          {
            "sub": "นิยามที่สไลด์ใช้ (p.3)",
            "body": [
              {
                "bullets": [
                  "One Health คือ **integrative effort of multiple disciplines** ที่ทำงานร่วมกันทั้งระดับ local, national และ global เพื่อให้ได้ optimal health ของคน สัตว์ และสิ่งแวดล้อม",
                  "สัตวแพทย์เป็น **บุคลากรสุขภาพกลุ่มเดียวที่มีโอกาสได้เห็นทั้งตัวคนและสัตว์ของเขาพร้อมกัน** (the only health care professional likely to see both people and their animals)"
                ]
              }
            ]
          },
          {
            "sub": "ตัวเลขในสไลด์ (p.4)",
            "body": [
              {
                "bullets": [
                  "โรคในคนทั้งหมด **1,461 โรค** มี **60%** ที่เกิดจาก multi-host pathogens (สไลด์อ้าง AVMA 2008, Gibbs and Gibbs 2012) แต่ตัวเลขชุดนี้คลาดเคลื่อนจากต้นทาง ต้นฉบับคือ Taylor et al., 2001 ซึ่งนับ **เชื้อก่อโรคในคน 1,415 ชนิด (species) ไม่ใช่ 1,461 โรค** และในจำนวนนี้ **868 ชนิด คิดเป็น 61%** ที่เป็น zoonotic หน่วยที่ถูกต้องคือชนิดของเชื้อก่อโรค ไม่ใช่จำนวนโรค เวลาสอบให้ตอบตามสไลด์ว่า 1,461 และ 60% แต่ให้จำเลขต้นฉบับ 1,415 species กับ 61% zoonotic ไว้ด้วย",
                  "ในช่วง **30 ปี** ที่ผ่านมา โรคติดเชื้ออุบัติใหม่ในคน **75%** เป็น zoonotic",
                  "สัตวแพทย์คลินิกเกือบ **77%** ทำงานกับ companion animals",
                  "**8%** ทำงานกับ food animals ส่วนสายงาน wildlife และ ecosystem health มีจำนวนเพิ่มขึ้นเรื่อยๆ"
                ]
              }
            ]
          },
          {
            "sub": "จุดกำเนิดแนวคิด — Calvin Schwabe (p.5)",
            "body": [
              {
                "bullets": [
                  "**Calvin Schwabe, DVM** เป็น veterinary epidemiologist หนังสือ **Veterinary Medicine and Human Health (1984)** ของเขาคือจุดเริ่มของแนวคิด One Health สมัยใหม่",
                  "Schwabe เสนอ **combined medical and veterinary approach** สำหรับการป้องกันและควบคุม zoonoses"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เดียวพิมพ์ครบทั้งชื่อคน ชื่อหนังสือ ปี และแนวคิด จำเป็นชุดเดียวไปเลย Schwabe, Veterinary Medicine and Human Health, 1984, combined medical and veterinary approach",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ภาพรวม — 8 ประเด็น One Health ที่สัตวแพทย์เกี่ยวข้อง",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.6",
        "body": [
          {
            "bullets": [
              "1. **Emerging Infectious Diseases**",
              "2. **Public Health**",
              "3. **Food Safety**",
              "4. **Companion Animals**",
              "5. **Antimicrobial Resistance**",
              "6. **Bioterrorism**",
              "7. **Environmental Pollution**",
              "8. **Global Climate Change**"
            ]
          },
          {
            "callout": "เนื้อหาที่เหลือทั้งเลกเชอร์เดินตามลำดับ 8 ข้อนี้เป๊ะๆ ใช้สไลด์นี้เป็น checklist ทวนก่อนสอบได้เลย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ประเด็นที่ 1 — Emerging infectious diseases, OHZDP และการกำจัดโรคพิษสุนัขบ้า",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.7-11",
        "body": [
          {
            "sub": "ขนาดของปัญหาและตัวอย่าง (p.7)",
            "body": [
              {
                "bullets": [
                  "โรคติดเชื้อทั่วโลกทำให้เสียชีวิต **มากกว่า 13 ล้านคนต่อปี** (Taylor et al., 2001, WHO, 1999)",
                  "**75%** ของโรคติดเชื้ออุบัติใหม่เป็น zoonotic (Taylor et al., 2001, WHO, 1999)",
                  "ตัวอย่างที่สไลด์ยกมา ได้แก่ **Ebola virus** ระบาดในแอฟริกากลาง, **Nipah virus** ในมาเลเซียและสิงคโปร์, **avian influenza** ในฮ่องกง, **Hantavirus** และ **West Nile virus** ในสหรัฐฯ"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลข 75% โผล่ 2 ครั้งในเลกเชอร์เดียวกัน คือ p.4 เขียนแบบ over the past 30 years และ p.7 เขียนแบบกว้างๆ ว่า 75% of EIDs are zoonotic เป็นตัวเลขเดียวกันแต่คนละสำนวน อย่าตกใจถ้าโจทย์ถามคนละแบบ",
            "kind": "tip"
          },
          {
            "sub": "บทบาทสัตวแพทย์ต่อ EIDs (p.8)",
            "body": [
              {
                "bullets": [
                  "ระบุ **source of infection** ของโรค",
                  "ระบุ **route of transmission**",
                  "ระบุ **nature** ของโรคติดเชื้ออุบัติใหม่"
                ]
              }
            ]
          },
          {
            "sub": "OHZDP — 5 โรค zoonotic ที่ถูกจัดลำดับความสำคัญ (p.9)",
            "body": [
              {
                "bullets": [
                  "1. **Zoonotic Avian Influenza** เพราะอัตราตายในคนสูงและมีโอกาส reassortment กลายเป็นสายพันธุ์ระบาดใหญ่",
                  "2. **Emerging Coronaviruses** เพราะแพร่ทั่วโลกได้เร็วและกระทบเศรษฐกิจสังคมมหาศาล",
                  "3. **Nipah Virus** เพราะ case-fatality rate สูงและยังไม่มีการรักษาจำเพาะหรือวัคซีน",
                  "4. **Rabies** เพราะเกือบ **100% fatal**",
                  "5. **Ebola** เพราะเสี่ยงต่อการนำเข้าจากต่างประเทศ"
                ]
              }
            ]
          },
          {
            "callout": "Rabies สไลด์ระบุว่า nearly 100% fatal และย้ำว่า mass vaccination กับ surveillance ยังเป็นมาตรการควบคุมที่สำคัญที่สุด",
            "kind": "warn"
          },
          {
            "callout": "Ebola ไม่เป็นโรคประจำถิ่นในประเทศไทย แต่ยังติดอยู่ในลิสต์ OHZDP ด้วยเหตุผลเรื่องความเสี่ยงจากการนำเข้าข้ามประเทศ ข้อนี้เป็นจุดที่โจทย์ชอบหลอก",
            "kind": "flag"
          },
          {
            "sub": "7 องค์ประกอบยุทธศาสตร์กำจัดโรคพิษสุนัขบ้า (p.10)",
            "body": [
              {
                "bullets": [
                  "surveillance, control และ prevention ทั้งในคนและในสัตว์",
                  "การควบคุมประชากรสัตว์ (animal population control)",
                  "การประเมินโครงการ (project evaluation)",
                  "การมีส่วนร่วมของชุมชน (community participation)",
                  "การประชาสัมพันธ์ (public relations)",
                  "การจัดการข้อมูล (information management)",
                  "นวัตกรรมและการถ่ายทอดเทคโนโลยี (innovation and technology transfer)"
                ]
              }
            ]
          },
          {
            "sub": "6 ความรับผิดชอบของสัตวแพทย์ในการป้องกันและควบคุม zoonoses (p.11)",
            "body": [
              {
                "bullets": [
                  "1. ปกป้องคนจากการสัมผัสโรคที่ติดจากสัตว์",
                  "2. ปกป้องสัตว์จากการติดเชื้อ zoonotic",
                  "3. ให้ความรู้เจ้าของสัตว์และประชาชนให้ป้องกันตัวเองได้",
                  "4. ใช้ **epidemiology (herd health medicine)** หาแหล่งโรคและ transmission dynamics",
                  "5. ทำ disease surveillance และ eradication programs",
                  "6. ป้องกันและควบคุมโรค"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ประเด็นที่ 2 — บทบาทด้านสาธารณสุขของสัตวแพทย์",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.13",
        "body": [
          "หัวข้อนี้สั้นมาก สไลด์ p.12 เป็นภาพ word diagram ตกแต่งที่ไม่มีเนื้อหาสอน เนื้อหาที่ออกสอบได้จริงอยู่ที่ p.13 เพียงสไลด์เดียว",
          {
            "bullets": [
              "พัฒนาระบบเกษตรและระบบอาหาร (improve agriculture and food systems)",
              "ผลักดันงานวิจัย biomedical และ comparative medicine",
              "ป้องกันและควบคุมโรค zoonotic",
              "ส่งเสริมสุขภาพสิ่งแวดล้อมและระบบนิเวศ (environmental and ecosystem health)"
            ]
          }
        ]
      },
      {
        "heading": "ประเด็นที่ 3 — ความปลอดภัยอาหาร จากฟาร์มถึงโต๊ะอาหาร",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.14-16",
        "body": [
          {
            "sub": "เชื้อก่อโรคและมิติใหม่ของ food safety (p.14)",
            "body": [
              {
                "bullets": [
                  "เชื้อ foodborne ทั้งดั้งเดิมและอุบัติใหม่ที่สไลด์ระบุชื่อ ได้แก่ **Escherichia**, **Salmonella**, **Campylobacter** และ **Listeria**",
                  "**4 New Dimensions** ของ food safety คือ การขนส่งอาหารระหว่างประเทศ, ความต้องการโปรตีนจากสัตว์ที่เพิ่มขึ้น, globalization ของห่วงโซ่อาหาร และโอกาสการแพร่กระจายของโรคติดเชื้อ",
                  "อาหารเป็น **vehicle** ของการแพร่โรคได้ ผลิตในท้องถิ่นแต่กระจายทั่วโลก ทำให้เชื้อข้ามพรมแดนได้ **ภายในไม่กี่ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "sub": "Farm to fork 5 ขั้น (p.15)",
            "body": [
              {
                "bullets": [
                  "**Farm production → Animal health management → Processing & slaughter → Inspection & monitoring → Consumer**",
                  "บทบาทสัตวแพทย์ในสายนี้คือ ดูแลการผลิตอาหารตั้งแต่ farm to fork, จัดการระบบนิเวศ และแก้ปัญหาการปนเปื้อนของจุลชีพ"
                ]
              }
            ]
          },
          {
            "sub": "ความรับผิดชอบต่ออาหาร 3 กิจกรรม (p.16)",
            "body": [
              {
                "bullets": [
                  "การผลิตสัตว์ที่มีสุขภาพดี (production of healthy animals)",
                  "การฆ่าและแปรรูปสัตว์เพื่อการบริโภค (slaughter and processing)",
                  "การตรวจสอบผลิตภัณฑ์จากสัตว์ (inspection of animal products)",
                  "ทั้ง 3 กิจกรรมครอบคลุม **food quantity, food quality และ food safety**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.16 พิมพ์คำว่า quantity, quality, safety ไว้ด้วยกัน จำเป็นชุด 3 คำนี้ อย่าตอบแค่ safety อย่างเดียวเวลาโจทย์ถามว่าสัตวแพทย์รับผิดชอบอะไรบ้างในอาหาร",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ประเด็นที่ 4 — สัตว์เลี้ยงเป็นเพื่อน (Companion animals)",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.17",
        "body": [
          {
            "bullets": [
              "**57%** ของครัวเรือนในสหรัฐฯ เลี้ยงสุนัข แมว หรือทั้งสองอย่าง และยังมี exotic animals, นก และสัตว์เลื้อยคลานอีกหลายล้านตัวที่ถูกเลี้ยงเป็นสัตว์เลี้ยง",
              "บทบาทสัตวแพทย์คือ ให้ความรู้ประชาชนเรื่องการป้องกัน zoonoses",
              "ฉีดวัคซีนป้องกันโรค zoonotic ในสัตว์เลี้ยง โดยสไลด์ระบุชื่อไว้ 2 โรคคือ **rabies** และ **leptospirosis**",
              "ลด **ectoparasites** และพยาธิในทางเดินอาหารโดยเฉพาะ **roundworms**"
            ]
          }
        ]
      },
      {
        "heading": "ประเด็นที่ 5 — การดื้อยาต้านจุลชีพและแผน AMR ของไทย",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.18-22",
        "body": [
          {
            "sub": "AMU และการแพร่ของ resistance ในห่วงโซ่อาหาร (p.18)",
            "body": [
              {
                "bullets": [
                  "วัตถุประสงค์ของการใช้ยาต้านจุลชีพมี **3 ข้อ** คือ **treatment, prophylaxis และ growth promotion**",
                  "สไลด์แสดงการแพร่ของ resistance ข้ามห่วงโซ่อาหารเป็น 4 compartments โดยพิมพ์เส้นทางไว้ว่า **Livestock and Aquaculture → Food Products → Humans**",
                  "AMR ในห่วงโซ่อาหารคุกคามความสำเร็จของการรักษาและการป้องกันโรคติดเชื้อ"
                ]
              }
            ]
          },
          {
            "sub": "AMR One Health continuum 3 compartments (p.19, Robinson et al., 2016)",
            "body": [
              {
                "bullets": [
                  "**HUMANS** การใช้ยาทางคลินิกและการติดเชื้อดื้อยาในสถานพยาบาล",
                  "**ANIMALS & AGRICULTURE** การใช้ยาในปศุสัตว์และสัตว์น้ำเพื่อ treatment, prophylaxis และ growth promotion",
                  "**ENVIRONMENT** แบคทีเรียดื้อยาและ residues ที่เข้าสู่ดินและน้ำจากของเสียและ runoff"
                ]
              }
            ]
          },
          {
            "sub": "แผนปฏิบัติการ AMR แห่งชาติของไทย ฉบับที่ 2 ปี 2023-2027 (p.20)",
            "body": [
              {
                "bullets": [
                  "1. ลดการป่วยจาก AMR ในคน เป้าหมาย **10%**",
                  "2. ลดการใช้ยาต้านจุลชีพ เป้าหมาย **10% ในคน และ 50% ในสัตว์** (สไลด์พิมพ์ไว้ว่า 10%/50%)",
                  "3. เพิ่มความรู้และความตระหนักของประชาชนเรื่อง AMU เป้าหมาย **30%**",
                  "4. ลดความเสี่ยง AMR ในอาหารและสิ่งแวดล้อม (ไม่มีตัวเลขเป้าหมายพิมพ์ไว้)",
                  "5. เสริมความเข้มแข็งของการจัดการ AMR (ไม่มีตัวเลขเป้าหมายพิมพ์ไว้)"
                ]
              }
            ]
          },
          {
            "callout": "อย่าสลับตัวเลข ลด AMU ในคน 10% แต่ในสัตว์ 50% และมีเพียง 3 จาก 5 objectives เท่านั้นที่มีตัวเลขเป้าหมายพิมพ์บนสไลด์ ข้อ 4 และ 5 ไม่มีตัวเลข",
            "kind": "flag"
          },
          {
            "sub": "บทบาทสัตวแพทย์ต่อ AMR (p.22, WHO, 2015)",
            "body": [
              {
                "bullets": [
                  "สัตวแพทย์สาย pharmacology และยาทำงานข้ามสาขา ทั้งสัตว์เลี้ยงและสัตว์เศรษฐกิจ ครอบคลุม food security และการควบคุม drug residue ของภาครัฐ",
                  "ความสำคัญของ **prudent antibiotic use** ภายใต้แนวคิด One Health เพิ่มขึ้นเรื่อยๆ",
                  "ติดตาม (monitoring) ทั้ง AMU และ AMR ในปศุสัตว์และสัตว์น้ำ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ประเด็นที่ 6 — Bioterrorism",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.23-25",
        "body": [
          {
            "sub": "นิยามและตัวอย่างในอดีต (p.23)",
            "body": [
              {
                "bullets": [
                  "**Bioterrorism** คือการใช้จุลชีพ ได้แก่ **bacteria, viruses และ fungi** หรือ **toxins** สร้างเป็นอาวุธที่ก่อให้เกิดความตายและโรคในคน สัตว์ และพืช",
                  "ตัวอย่างในอดีตที่สไลด์ยกมา ได้แก่ การทิ้งศพลงบ่อน้ำของศัตรูเพื่อวางยาน้ำดื่ม, ผ้าห่มปนเปื้อน smallpox, การจงใจปนเปื้อน **Salmonella** ในสลัดบาร์, จดหมายที่มี **anthrax** รวมถึงการใช้ **botulism, tularemia และ hemorrhagic fever** เป็นอาวุธชีวภาพ"
                ]
              }
            ]
          },
          {
            "sub": "3 บทบาทของสัตวแพทย์ (p.24)",
            "body": [
              {
                "bullets": [
                  "**surveillance** เฝ้าระวังเชื้อที่ใช้ก่อการร้ายชีวภาพ",
                  "**treatment and disease control** รักษาและควบคุมโรค",
                  "**early warning systems** ระบบเตือนภัยล่วงหน้า"
                ]
              }
            ]
          },
          {
            "sub": "การแบ่งงานระหว่าง animal health กับ law enforcement (p.25)",
            "body": [
              {
                "bullets": [
                  "เป้าหมายร่วมของทั้งสองฝ่ายคือ **protect public health and safety**",
                  "ฝ่าย animal health ในภาวะปกติ ดูแลสวัสดิภาพสัตว์, ป้องกันการระบาดในสัตว์, หยุดยั้งไม่ให้เกิดเคสและการระบาดเพิ่ม, สอบสวนทางระบาดวิทยา และสร้างฐานความรู้ทางวิทยาศาสตร์เพื่อการป้องกันในอนาคต",
                  "ฝ่าย animal health เมื่อเกิด **deliberate release** ต้องตรวจจับเหตุการณ์โรคที่น่าสงสัยและให้ความเชี่ยวชาญเฉพาะทาง",
                  "ฝ่าย law enforcement ในภาวะปกติ สนับสนุนมาตรการด้านสุขภาพและรักษาความสงบเรียบร้อย",
                  "ฝ่าย law enforcement เมื่อเกิด deliberate release ต้องปราบ agrocrimes และ agroterrorism, สกัดการโจมตีซ้ำ, รักษาหลักฐาน, สอบสวนทางอาญา และระบุตัวผู้ก่อเหตุ ผู้สมรู้ร่วมคิด พยาน และผู้เสียหาย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ประเด็นที่ 7 — มลพิษสิ่งแวดล้อมและการใช้สัตว์เป็น sentinel",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.26-27",
        "body": [
          {
            "sub": "ภาระโรคจากสิ่งแวดล้อม (p.26, Barrett et al., 2011)",
            "body": [
              {
                "bullets": [
                  "**24%** ของ global burden of disease มาจากสิ่งแวดล้อม",
                  "**23%** ของการเสียชีวิตทั่วโลกทั้งหมดเกิดจากปัจจัยด้านสิ่งแวดล้อม"
                ]
              }
            ]
          },
          {
            "callout": "สองตัวเลขนี้อยู่สไลด์เดียวกันและใกล้กันมาก แยกให้ชัด 24% คือ burden of disease ส่วน 23% คือ deaths",
            "kind": "tip"
          },
          {
            "sub": "แนวคิด sentinel (p.26)",
            "body": [
              {
                "bullets": [
                  "อาหารสามารถทำหน้าที่เป็น **sentinel** สำหรับติดตามการปนเปื้อนในสิ่งแวดล้อม ตัวอย่างที่สไลด์ยกคือการปนเปื้อนสารชีวฆาต (biocide)ในน้ำผึ้ง",
                  "**animal sentinels** ช่วยให้ตรวจจับและจัดการความเสี่ยงสุขภาพร่วมได้เร็วและมีประสิทธิภาพมากขึ้น",
                  "การปนเปื้อนจากภาคเกษตรอาจนำไปสู่การปนเปื้อนในอาหารที่มาจากสัตว์"
                ]
              }
            ]
          },
          {
            "sub": "เส้นทางการเฝ้าระวังสารชีวฆาต (biocide)ด้วยผึ้ง (p.27, Cirelli et al., 2026)",
            "body": [
              {
                "bullets": [
                  "สารชีวฆาต (biocide)ปนเปื้อนพืชนอกเป้าหมาย (off-target contamination)",
                  "เกสรผึ้งปนเปื้อนและผึ้ง **Apis mellifera** ซึ่งเป็น pollinator ได้รับสัมผัส",
                  "นำการวิเคราะห์สารชีวฆาต (biocide)ในเกสรผึ้ง มารวมกับการระบุ botanical origin, ข้อมูลอุตุนิยมวิทยา และบันทึกการใช้สารเคมี เพื่อเข้าใจกระบวนการกระจายตัวของสารในภูมิทัศน์เกษตร"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ประเด็นที่ 8 — การเปลี่ยนแปลงสภาพภูมิอากาศและความรับผิดชอบด้านสิ่งแวดล้อม",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.28-29",
        "body": [
          {
            "sub": "ผลของ climate change ต่อโรค (p.28)",
            "body": [
              {
                "bullets": [
                  "เพิ่มความเสี่ยงของโรคที่มีแมลงเป็นพาหะ (vector-borne diseases) โดยสไลด์ยกตัวอย่าง **yellow fever** และ **encephalitis**",
                  "อุณหภูมิที่สูงขึ้นและฤดูหนาวที่สั้นลงทำให้ขอบเขตของโรคเขตร้อนขยายตัว โดยสไลด์ยกตัวอย่าง **dengue** และ **malaria**",
                  "บทบาทสัตวแพทย์คือ สร้างความตระหนักถึงผลของ climate change ต่อสุขภาพสัตว์ zoonoses และสาธารณสุข พร้อมทั้งเฝ้าระวังและตอบสนองต่อโรคที่เกิดจาก climate change"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์แยกกลุ่มตัวอย่างไว้คนละบรรทัด yellow fever กับ encephalitis อยู่ในกลุ่ม vector-borne ส่วน dengue กับ malaria อยู่ในกลุ่มโรคเขตร้อนที่ขยายพื้นที่ตามอุณหภูมิ",
            "kind": "flag"
          },
          {
            "sub": "2 ความรับผิดชอบด้านสุขภาพสิ่งแวดล้อมของสัตวแพทย์ (p.29)",
            "body": [
              {
                "bullets": [
                  "1. ปกป้องสิ่งแวดล้อมทั้งในชนบทและในเมืองจากความเสื่อมโทรมที่เกิดจากการเลี้ยงสัตว์หนาแน่น",
                  "2. ปกป้องคนและสัตว์จากผลกระทบทางสิ่งแวดล้อม"
                ]
              },
              {
                "bullets": [
                  "ทำผ่าน **4 การกระทำ** ได้แก่ ระบุแหล่งน้ำที่ปลอดภัย, ให้คำแนะนำเรื่องการปกป้องแหล่งน้ำ, วินิจฉัยโรคที่มากับน้ำและภาวะพิษ, และให้คำแนะนำเรื่องอันตรายต่อสุขภาพคนที่เกี่ยวข้องกับสัตว์และของเสียจากสัตว์"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "บทสรุป — อุปสรรค โอกาส และข้อเสนอแนะปิดท้าย",
        "source": "Role_of_Vet_in_One_Health_Saharuetai_2026 p.30-31",
        "body": [
          {
            "sub": "4 challenges และ 2 opportunities (p.30)",
            "body": [
              {
                "bullets": [
                  "**Challenges** ได้แก่ ความยากในการร่วมมือระหว่างวิชาชีพ, การประสานงานและการสื่อสารที่ไม่มีประสิทธิภาพ, การทำงานข้ามศาสตร์ร่วมกันไม่ได้จริง และการขาดทรัพยากร",
                  "**Opportunities** มี 2 ข้อ คือ การร่วมมือที่ดีขึ้นกับแพทย์ เจ้าหน้าที่สาธารณสุข และนักวิชาชีพด้านสัตว์ป่าและสิ่งแวดล้อม ทำให้เข้าใจโรคได้ดีขึ้น และการควบคุมป้องกันโรคที่มีประสิทธิภาพมากขึ้น"
                ]
              }
            ]
          },
          {
            "sub": "4 ข้อเสนอแนะสำหรับสัตวแพทย์ (p.31)",
            "body": [
              {
                "bullets": [
                  "1. เพิ่มการสื่อสารข้ามศาสตร์",
                  "2. เข้าไปเป็นส่วนหนึ่งของกระบวนการวางแผน ดำเนินการ บริหารจัดการ และให้คำปรึกษาในกิจกรรม One Health ทุกระดับ",
                  "3. เข้าร่วมกับ One Health initiatives ทั้งระดับท้องถิ่น ระดับชาติ และระดับโลก",
                  "4. **ไม่จำกัดตัวเองอยู่แค่งานคลินิกสัตว์** แต่เข้าไปทำงานด้านสาธารณสุข สุขภาพสิ่งแวดล้อม และการควบคุมความปลอดภัยอาหารด้วย"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "oh-global-network": {
    "topic": "oh-global-network",
    "title": "Global One Health Activity Network",
    "lecturer": "Saharuetai Jeamsripong",
    "icon": "🌐",
    "summary": "เลกเชอร์นี้ประมาณ 70% เป็นการออกแบบกิจกรรมของรายวิชา (เครือข่าย node จำลอง, บทบาทผู้เข้าร่วม, เวลาในการทำ exercise, สัดส่วนคะแนน, ตาราง 6 สัปดาห์) มากกว่าจะเป็นเนื้อหาบรรยาย เนื้อหาที่เป็น exam-grade จริงกระจุกอยู่ไม่กี่สไลด์ ได้แก่ ตัวเลข 75% zoonotic EID, โรคสัตว์สู่คนที่จัดลำดับความสำคัญ, case study รายภูมิภาค, ตาราง CDC priority zoonoses และส่วน Quadripartite",
    "sections": [
      {
        "heading": "ภาพรวม นิยาม และ One Health triad",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.2-4",
        "body": [
          {
            "sub": "ทำไมเรื่องนี้สำคัญ (Why this matters)",
            "body": [
              {
                "bullets": [
                  "**75%** ของ emerging infectious diseases มีต้นกำเนิดเป็น zoonotic",
                  "การเปลี่ยนแปลงของ climate, land-use และ biodiversity เป็นตัวขับเคลื่อนความเสี่ยงโรคใหม่",
                  "การตอบสนองที่ได้ผลต้องอาศัย vets, physicians, ecologists และ policymakers ทำงานเป็นทีมเดียวกัน"
                ]
              }
            ]
          },
          {
            "sub": "นิยามที่ใช้ในเลกเชอร์นี้",
            "body": [
              {
                "bullets": [
                  "**One Health approach** = กรอบการทำงานแบบบูรณาการและร่วมมือกัน (integrated, collaborative framework) ที่เชื่อมสุขภาพคน สัตว์ และสิ่งแวดล้อมเข้าด้วยกัน",
                  "**One Health triad** = 3 domains ที่เชื่อมถึงกัน ได้แก่ Animal Health, Human Health, Environmental Health โดยมี shared health outcome ร่วมกันหนึ่งเดียว",
                  "แนวคิดหลักที่พิมพ์บนสไลด์ โรค เชื้อก่อโรค และ environmental stressors เคลื่อนที่ข้าม species และข้าม ecosystem ได้อย่างอิสระ ดังนั้นวิธีแก้ปัญหาสุขภาพก็ต้องข้ามขอบเขตตามไปด้วย"
                ]
              }
            ]
          },
          {
            "sub": "6 learning objectives",
            "body": [
              {
                "bullets": [
                  "apply systems thinking",
                  "build collaborative networks",
                  "investigate real cases",
                  "communicate across disciplines",
                  "design interventions",
                  "evaluate outcomes"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โครงสร้างเครือข่าย บทบาทผู้เข้าร่วม และ reporting protocol",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.5-8",
        "body": [
          {
            "sub": "โครงสร้างเครือข่าย",
            "body": [
              {
                "bullets": [
                  "ศูนย์กลางคือ **Global Coordination Hub** เชื่อมกับ **6 nodes** ได้แก่ Africa Node, Asia-Pacific Node, Americas Node, Europe Node, Middle East Node และ Your Class Node",
                  "แต่ละ node แทนสถาบันที่เป็น partner หนึ่งแห่ง"
                ]
              }
            ]
          },
          {
            "sub": "4 บทบาทของผู้เข้าร่วม",
            "body": [
              {
                "bullets": [
                  "**Field veterinarian** เฝ้าระวังประชากรสัตว์ เก็บตัวอย่าง รายงาน morbidity และ mortality ที่ผิดปกติ",
                  "**Public health liaison** ติดตามข้อมูลผู้ป่วยในคน และประสานกับ clinical health services",
                  "**Environmental analyst** ประเมินปัจจัยด้าน habitat, climate และ ecosystem ที่มีผลต่อการอุบัติของโรค",
                  "**Communications lead** เรียบเรียงผลการสอบสวนเป็น brief สำหรับ policymakers และประชาชน",
                  "บทบาทหมุนเวียนทุก **2 สัปดาห์** เพื่อให้นิสิตได้ผ่านครบทั้ง 4 มุมมอง"
                ]
              }
            ]
          },
          {
            "sub": "Scenario 1 กรณี wetland reservoir",
            "body": [
              {
                "bullets": [
                  "โคตาย **12 ตัว ภายใน 10 วัน** ใกล้พื้นที่ชุ่มน้ำที่ได้รับการคุ้มครอง",
                  "ผู้ป่วยคน **2 ราย** มีอาการไข้ลักษณะคล้ายกัน",
                  "พบกิจกรรมของนกอพยพเพิ่มขึ้นหลังน้ำท่วมตามฤดูกาล",
                  "node ต้องสอบสวนและรายงานผลภายใน **48 ชั่วโมง**"
                ]
              }
            ]
          },
          {
            "sub": "5 ขั้นตอนของการสื่อสารและรายงาน",
            "body": [
              {
                "bullets": [
                  "1. **Detect** node ในพื้นที่พบความผิดปกติจากรายงานภาคสนามหรือรายงานทางคลินิก",
                  "2. **Report** ส่ง standardized case form ไปยัง regional hub",
                  "3. **Share** hub กระจาย alert ไปยัง nodes ที่เกี่ยวข้อง",
                  "4. **Convene** ทีมสหสาขาประชุมทบทวนร่วมกัน",
                  "5. **Respond** ออกข้อเสนอแนะแบบประสานงานไปยัง stakeholders"
                ]
              },
              {
                "callout": "ลำดับ Detect ไป Report ไป Share ไป Convene ไป Respond เป็นลำดับที่สไลด์พิมพ์เลขกำกับไว้ชัดเจน ข้อสอบชอบสลับขั้น Share กับ Convene ให้จำว่าต้องกระจายข่าวก่อนจึงจะเรียกประชุมทีมได้",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 2 — surveillance dashboard และโรคสัตว์สู่คนที่จัดลำดับความสำคัญ",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.9-10",
        "body": [
          {
            "sub": "ค่าบน dashboard รายงานสัตว์ป่วยรายสัปดาห์ของ regional node",
            "body": [
              {
                "bullets": [
                  "Wk1 = **4**, Wk2 = **7**, Wk3 = **12**, Wk4 = **9**, Wk5 = **15**, Wk6 = **11**"
                ]
              },
              {
                "callout": "สไลด์ตั้งคำถามว่าอะไรทำให้เกิด spike ที่ **Week 3** แต่ค่าที่สูงที่สุดในกราฟจริงคือ **Week 5 ที่ 15** ระวังอย่าสลับสองตัวนี้กัน",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "การอ่าน dashboard ต้องทำ 3 อย่าง",
            "body": [
              {
                "bullets": [
                  "ระบุ spike ที่อาจบ่งชี้การอุบัติของ outbreak",
                  "เปรียบเทียบข้อมูลข้าม 3 ชั้น คือชั้นสัตว์ ชั้นคน และชั้นสิ่งแวดล้อม",
                  "แจ้ง anomaly ไปยัง nodes อื่นเพื่อ cross-check"
                ]
              }
            ]
          },
          {
            "sub": "4 โรคสัตว์สู่คนที่ถูก spotlight พร้อมจุดจับในการควบคุมและเฝ้าระวัง",
            "body": [
              {
                "bullets": [
                  "**Avian influenza** เฝ้าระวังในนกป่าและสัตว์ปีก มีความเสี่ยง spillover สู่คน",
                  "**Rabies** รณรงค์ฉีดวัคซีนข้ามพรมแดน และจัดการประชากรสุนัข",
                  "**Brucellosis** คัดกรองในปศุสัตว์ เชื่อมโยงกับการสัมผัสเชิงอาชีพในคน",
                  "**Leptospirosis** สัตว์ฟันแทะเป็น reservoir และมีเส้นทางการติดต่อสัมพันธ์กับน้ำท่วม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 3 — regional case studies และ cross-node simulation",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.11-12",
        "body": [
          {
            "sub": "จับคู่โรคกับ node ให้ได้ (ออกสอบง่ายมาก)",
            "body": [
              {
                "bullets": [
                  "**Africa Node** = Rift Valley Fever outbreak เชื่อมโยงกับการค้าปศุสัตว์และรูปแบบปริมาณฝน",
                  "**Asia-Pacific Node** = avian influenza แพร่ผ่าน live bird markets และเส้นทางนกอพยพ",
                  "**Americas Node** = AMR ในฟาร์มโคนม ส่งผลต่อชุมชนใกล้เคียง",
                  "**Europe Node** = tick-borne disease ขยายพื้นที่การระบาดตามภาวะโลกร้อน",
                  "**Middle East Node** = การเฝ้าระวัง MERS-CoV ในประชากรอูฐ"
                ]
              }
            ]
          },
          {
            "sub": "รูปแบบ cross-node outbreak simulation",
            "body": [
              {
                "bullets": [
                  "ทีมละ **4 คน** แต่ละคนแทน node คนละภูมิภาค",
                  "ต้องร่าง One Health response plan ที่ครอบคลุมปัจจัยด้านสัตว์ คน และสิ่งแวดล้อม ภายใน **30 นาที**",
                  "การจัดสรรเวลา briefing **10 นาที**, investigation and planning **30 นาที**, cross-node presentation **15 นาที**, facilitated debrief **15 นาที**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 4-5 — stakeholders, policy briefing, จริยธรรม และ digital tools",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.13-16",
        "body": [
          {
            "sub": "6 กลุ่ม stakeholder ที่ต้องดึงเข้ามามีส่วนร่วม",
            "body": [
              {
                "bullets": [
                  "ministries of health",
                  "veterinary authorities",
                  "environmental agencies",
                  "local communities",
                  "research institutions",
                  "media and public communication"
                ]
              }
            ]
          },
          {
            "sub": "Policy briefing role-play",
            "body": [
              {
                "bullets": [
                  "สถานการณ์คือรัฐมนตรีเกษตรมีเวลา **10 นาที** ก่อนแถลงข่าว",
                  "หลักการ briefing 3 ข้อ คือ **Lead with Impact** (พูดความเสี่ยงต่อคนและต่อการทำมาหากินก่อน), **Avoid jargon** และ **Be action-oriented**",
                  "ปิดท้ายด้วยข้อเสนอแนะที่ชัดเจนและทำได้จริง **2 ถึง 3 ข้อ**"
                ]
              }
            ]
          },
          {
            "sub": "4 ประเด็นด้านจริยธรรมและวัฒนธรรมในเครือข่ายสุขภาพระดับโลก",
            "body": [
              {
                "bullets": [
                  "**Cultural sensitivity** เคารพวิถีปฏิบัติ การทำมาหากิน และความเชื่อของท้องถิ่น",
                  "**Equitable data sharing** ทุก node มีเสียงและเข้าถึงข้อมูลร่วมได้ ไม่ว่าจะมีทรัพยากรมากหรือน้อย",
                  "**Avoiding harm** คำนึงถึงผลกระทบที่ไม่ได้ตั้งใจของมาตรการ เช่น การ culling และการจำกัดการเดินทาง",
                  "**Informed consent** การเก็บข้อมูลภาคสนามจากชุมชนและเกษตรกรต้องโปร่งใสและเป็นไปโดยสมัครใจ"
                ]
              }
            ]
          },
          {
            "sub": "4 digital tools ที่หนุนการทำงานของเครือข่าย",
            "body": [
              {
                "bullets": [
                  "**GIS mapping platforms** แสดงการกระจายเชิงพื้นที่ตรงรอยต่อสัตว์ คน สิ่งแวดล้อม",
                  "**Shared dashboards** รายงานเคสแบบ real-time และดูแนวโน้ม",
                  "**Discussion forums** ทำงานร่วมกันข้าม node แบบ asynchronous",
                  "**Lab information systems** ติดตามการส่งตัวอย่างและผลวินิจฉัยข้ามสถาบัน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Module 6 — peer review และตาราง CDC priority zoonoses",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.17-18",
        "body": [
          {
            "sub": "5 เกณฑ์ในการทำ cross-node peer review",
            "body": [
              {
                "bullets": [
                  "**Scientific accuracy** การวินิจฉัยและการประเมินความเสี่ยงอิงหลักฐานหรือไม่",
                  "**Cross-sector integration** แผนครอบคลุมครบทั้ง 3 domains ของ One Health หรือไม่",
                  "**Feasibility** ข้อเสนอแนะทำได้จริงในระดับพื้นที่หรือไม่",
                  "**Communication clarity** ผู้ที่ไม่ใช่ผู้เชี่ยวชาญเข้าใจได้หรือไม่",
                  "**Ethical soundness** มีการคำนึงถึงมิติวัฒนธรรมและความเป็นธรรมหรือไม่"
                ]
              }
            ]
          },
          {
            "sub": "รูป CDC \"Priority Zoonoses around the Globe\"",
            "body": [
              {
                "bullets": [
                  "โรคสัตว์สู่คนที่ถูกจัดเป็นลำดับความสำคัญบ่อยที่สุดทั่วโลก ได้แก่ **Rabies (24 จาก 25 workshops ที่จัดมา)**, zoonotic influenzas, viral hemorrhagic fevers, anthrax และ brucellosis",
                  "แหล่งอ้างอิงที่พิมพ์บนรูปคือ cdc.gov/onehealth/global-activities/prioritization.html"
                ]
              },
              {
                "callout": "ถ้าโจทย์ถามว่าโรคใดถูกจัดลำดับความสำคัญบ่อยที่สุดในเวที prioritization ทั่วโลก ตอบ **Rabies** และจำตัวเลข **24 of 25 workshops** ไว้เป็นตัวยึด",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "การประเมินผลและตารางกิจกรรม 6 สัปดาห์",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.19-20",
        "body": [
          {
            "sub": "สัดส่วนคะแนน",
            "body": [
              {
                "bullets": [
                  "Case investigation report **30%** เป็นงานเขียนวิเคราะห์รายบุคคลจาก scenario ของ node ตัวเอง",
                  "Cross-node response plan **30%** เป็นแผนกลุ่มที่ต้องครอบคลุมทุก domain ของ One Health",
                  "Policy briefing presentation **20%** ประเมินจากความชัดเจนและความเป็นไปได้ของ role-play",
                  "Peer review and participation **20%**"
                ]
              }
            ]
          },
          {
            "sub": "ตารางกิจกรรม 6 สัปดาห์",
            "body": [
              {
                "bullets": [
                  "Wk1 orientation และ node assignment",
                  "Wk2 ปล่อย case scenario และเริ่มสอบสวน",
                  "Wk3 data sharing และวิเคราะห์ dashboard",
                  "Wk4 cross-node simulation exercise",
                  "Wk5 stakeholder role-play briefings",
                  "Wk6 peer review และ reflection"
                ]
              },
              {
                "callout": "ส่วนนี้เป็นกลไกของกิจกรรมในรายวิชา ไม่ใช่เนื้อหาวิชาการ อ่านไว้พอให้ทำกิจกรรมถูกและกันข้อที่ถามตรงตัวเลข ไม่ต้องลงแรงเท่าส่วนโรคและ Quadripartite",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Background — Quadripartite และกรอบ One Health ระดับโลก",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.21-23",
        "body": [
          {
            "sub": "องค์กรและ remit ที่สไลด์พิมพ์ไว้",
            "body": [
              {
                "bullets": [
                  "**Quadripartite** ประกอบด้วย 4 องค์กร คือ **WHO, WOAH, FAO และ UNEP** และมี **Joint Plan of Action** เป็นฐานของวาระ One Health ระดับโลกที่อ้างถึงตลอดรายวิชานี้ (บรรทัดนี้พิมพ์ซ้ำอยู่ท้ายทุกสไลด์ในหมวดนี้)",
                  "**WOAH** = World Organisation for Animal Health, remit คือมาตรฐานและการรายงานโรคสัตว์",
                  "**WHO** = World Health Organization, remit คือแนวทางด้านสุขภาพคนและการประสาน International Health Regulations (IHR)",
                  "**UNEP** = UN Environment Programme, remit คือปัจจัยด้านสิ่งแวดล้อมที่ทำให้เกิดการอุบัติของโรค",
                  "**FAO** = Food and Agriculture Organization, remit คือระบบอาหารและสุขภาพภาคเกษตร"
                ]
              }
            ]
          },
          {
            "sub": "จาก screenshot เว็บไซต์ WOAH บนสไลด์",
            "body": [
              {
                "bullets": [
                  "WOAH อธิบาย One Health ว่าเป็นแนวคิดที่รู้จักกันมา **มากกว่าหนึ่งศตวรรษ** โดยสุขภาพคน สัตว์ และพืช พึ่งพากันและผูกกับสุขภาพของ ecosystems ที่สิ่งเหล่านั้นดำรงอยู่",
                  "**WAHIS** (World Animal Health Information System) ถูกระบุว่าเป็น global reference platform สำหรับเผยแพร่ข้อมูลทางการของโรคที่มีความสำคัญทางระบาดวิทยาในสัตว์เลี้ยงและสัตว์ป่า"
                ]
              },
              {
                "callout": "สไลด์ชุดนี้ให้แค่ชื่อองค์กรกับ remit เท่านั้น ไม่มีการพิมพ์ปีก่อตั้ง ไม่มีวันที่ UNEP เข้าร่วมจนเปลี่ยน Tripartite เป็น Quadripartite และไม่มีช่วงปีของ Joint Plan of Action อยู่ในเลกเชอร์นี้เลย อย่าเดาปีเอง",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างจริง อุปสรรคที่พบบ่อย และ key takeaways",
        "source": "Global_One_Health_Activity_Network_Saharuetai_2026 p.28-30",
        "body": [
          {
            "sub": "3 ตัวอย่างเครือข่าย One Health ที่ทำงานได้จริง",
            "body": [
              {
                "bullets": [
                  "**Rabies-free regions** การรณรงค์ฉีดวัคซีนสุนัขจำนวนมากแบบประสานงานกัน ทำให้หลายประเทศไม่มีผู้เสียชีวิตจากพิษสุนัขบ้าอีก",
                  "**Wetland outbreak response** การเฝ้าระวังร่วมด้านสัตว์และสิ่งแวดล้อมทำให้ตรวจพบ **Rift Valley Fever** outbreak ได้แต่เนิ่น",
                  "**Cross-border AMR surveillance** เครือข่ายห้องปฏิบัติการที่ใช้ร่วมกันติดตาม AMR ข้ามระบบปศุสัตว์และระบบสุขภาพคน"
                ]
              }
            ]
          },
          {
            "sub": "4 อุปสรรคของเครือข่ายและวิธีแก้ที่สไลด์ให้ไว้",
            "body": [
              {
                "bullets": [
                  "**ข้อมูลขัดแย้งกันระหว่าง node** แก้โดยอภิปรายความต่างอย่างเปิดเผย บันทึกสมมติฐานและความต่างของ methodology",
                  "**ความต่างของ time zone และการนัดหมาย** แก้โดยอัปเดตผ่าน forum แบบ asynchronous และหมุนเวียนเวลาประชุมแบบ synchronous ให้เป็นธรรม",
                  "**กำแพงศัพท์เฉพาะทาง** แก้โดยทำ shared glossary และถามให้กระจ่างตั้งแต่เนิ่น",
                  "**เห็นไม่ตรงกันเรื่องข้อเสนอแนะ** แก้โดยจัด structured debate เสนอหลักฐานของแต่ละทางเลือกก่อนตัดสินใจ"
                ]
              }
            ]
          },
          {
            "sub": "4 key takeaways",
            "body": [
              {
                "bullets": [
                  "**Health is interconnected** สุขภาพสัตว์ คน และสิ่งแวดล้อม จัดการแยกส่วนไม่ได้",
                  "**Collaboration is a skill** การสื่อสารข้ามสาขาเป็นทักษะที่ต้องฝึก ไม่ใช่สิ่งที่เกิดขึ้นเอง",
                  "**Data drives decisions** การเฝ้าระวังที่แบ่งปันข้อมูลกันทำให้ตอบสนองได้เร็วขึ้นและมีข้อมูลรองรับมากขึ้น",
                  "**Equity matters** ทางออกที่ยั่งยืนต้องอาศัยการมีส่วนร่วมอย่างเป็นธรรมของ partner ทุกรายในเครือข่าย"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // เอกสารมาตรฐานสากล — รวบรวมจาก docs/vet-standards/README.md
  // (editorial layer: wiki/domain/food-safety/vet-standards-reference.md)
  // ไม่ใช่เนื้อหาเลกเชอร์ ทุก section อ้างเอกสารทางการของแต่ละองค์กร
  // ─────────────────────────────────────────────────────────────
  "vet-standards-catalog": {
    topic: "vet-standards-catalog",
    title: "Vet Standards Reference — มาตรฐานสากลที่ต้องรู้ (WOAH, Codex, WHO, EAEVE)",
    icon: "🌐",
    summary: "เอกสารอ้างอิงทางการที่วิชา One Health, Zoonoses และ Food Safety ยึดใช้ — Terrestrial/Aquatic Code และ Terrestrial Manual ของ WOAH, มาตรฐานอาหารของ Codex, IHR ของ WHO, แผน One Health ร่วม 4 องค์กร และ Day-1 Competencies ของ EAEVE",
    sections: [
      {
        "heading": "WOAH (World Organisation for Animal Health)",
        "source": "docs/vet-standards/README.md — เอกสารทางการของ WOAH (woah.org)",
        "body": [
          { bullets: [
            '**Terrestrial Animal Health Code** (2024, ปรับปรุงปีละครั้ง) — มาตรฐานการค้าสัตว์และผลิตภัณฑ์สัตว์ปลอดโรค โรคติดต่อจากสัตว์สู่คน และหลัก biosecurity',
            '**Aquatic Animal Health Code** (2024) — มาตรฐานสำหรับสัตว์น้ำและโรคสัตว์น้ำที่กระทบการค้าและ One Health',
            '**Manual of Diagnostic Tests and Vaccines for Terrestrial Animals** (2024) — วิธีตรวจวินิจฉัยและวัคซีนมาตรฐานสำหรับโรคสัตว์',
            '**PVS Pathway** — เครื่องมือประเมินสมรรถนะของ veterinary services ระดับประเทศ',
          ] },
        ],
      },
      {
        "heading": "Codex Alimentarius (FAO/WHO)",
        "source": "docs/vet-standards/README.md — เอกสารทางการของ Codex Alimentarius (fao.org)",
        "body": [
          { bullets: [
            '**General Principles of Food Hygiene (CXC 1-1969)** rev. 2022 — หลักสุขลักษณะอาหารทั่วไปตั้งแต่ production ถึง consumption',
            '**HACCP Guidelines** (ภาคผนวกของ CXC 1-1969) — ระบบวิเคราะห์อันตรายและจุดวิกฤตที่ใช้ทั้งโรงงานและฟาร์ม',
            '**MRLs for Veterinary Drugs** — ระดับตกค้างสูงสุดของยาในสัตว์ที่ใช้เป็นอาหาร',
            '**Code of Practice to Minimize and Contain AMR (CXC 67-2009)** rev. 2022 — แนวปฏิบัติลดการดื้อยาในสัตว์ผลิตอาหาร',
          ] },
        ],
      },
      {
        "heading": "WHO (World Health Organization)",
        "source": "docs/vet-standards/README.md — เอกสารทางการของ WHO (who.int)",
        "body": [
          { bullets: [
            '**International Health Regulations (IHR 2005)** — กฎอนามัยระหว่างประเทศ การรายงานโรคระบาด',
            '**หน้า One Health ของ WHO** — ภาพรวม One Health, rabies, zoonoses และ foodborne diseases จากมุมสาธารณสุข',
          ] },
        ],
      },
      {
        "heading": "One Health — Quadripartite (FAO, UNEP, WHO, WOAH)",
        "source": "docs/vet-standards/README.md — เอกสารร่วมของ 4 องค์กร (Quadripartite)",
        "body": [
          { bullets: [
            '**One Health Joint Plan of Action (2022–2026)** — แผนปฏิบัติการร่วม 4 องค์กรเรื่อง One Health ระดับโลก',
            '**One Health Definition (OHHLEP, 2021)** — นิยาม One Health ที่ใช้อ้างอิงอย่างเป็นทางการ',
          ] },
        ],
      },
      {
        "heading": "FAO",
        "source": "docs/vet-standards/README.md — เอกสารทางการของ FAO (fao.org)",
        "body": [
          { bullets: [
            '**Food Safety and Quality resources** — เครื่องมือ food safety ตั้งแต่ฟาร์มถึงโต๊ะอาหาร รวม food control systems',
          ] },
        ],
      },
      {
        "heading": "EAEVE",
        "source": "docs/vet-standards/README.md — เอกสารทางการของ EAEVE (eaeve.net)",
        "body": [
          { bullets: [
            '**Day-1 Competencies** (2019) — สมรรถนะขั้นต่ำของผู้สำเร็จการศึกษาแพทย์สัตว์ในยุโรป (เทียบเคียงหลักสูตรทั่วโลก)',
          ] },
        ],
      },
      {
        "heading": "งานวิจัย One Health ที่ถูกอ้างถึงมาก",
        "source": "docs/vet-standards/README.md + PubMed abstract ของแต่ละงาน",
        "body": [
          { bullets: [
            '**Gibbs, Vet Rec 2014** — ทบทวน 10 ปีของ One Health หลังยุค OIE/FAO/WHO ร่วมมือ พร้อมความท้าทายสู่อนาคต',
            '**Destoumieux-Garzón et al., Front Vet Sci 2018** — รีวิวแนวคิด One Health อายุ 10 ปี รวมข้อจำกัดในการนำไปปฏิบัติจริง',
            '**McEwen, Microbiol Spectr 2018** — AMR ในมุมมอง One Health เชื่อมการใช้ยาต้านจุดชีพในสัตว์ คน และสิ่งแวดล้อม',
          ] },
        ],
      },
      {
        "heading": "ใช้กับวิชาในหลักสูตร",
        "source": "การจับคู่เอกสารมาตรฐานกับวิชาในหลักสูตรของ VetMock",
        "body": [
          { bullets: [
            '**One Health** — One Health Joint Plan of Action, OHHLEP Definition, หน้า One Health ของ WHO',
            '**Zoonoses** — WOAH Terrestrial/Aquatic Codes, WHO IHR (2005), Codex AMR Code of Practice',
            '**Milk & Meat Hygiene** — Codex General Principles of Food Hygiene, HACCP, MRLs, FAO Food Safety resources',
            '**มาตรฐาน/การรับรอง** — EAEVE Day-1 Competencies, WOAH PVS Pathway, WOAH Codes',
          ] },
        ],
      },
    ],
  },

  "oh-env-carcinogen": {
    "topic": "oh-env-carcinogen",
    "title": "OH approach to address environmental health risks I: ปศุสัตว์แบบเข้มข้นกับสิ่งแวดล้อม",
    "lecturer": "วรญาณี ธรรมธร",
    "icon": "☠️",
    "summary": "ความเสี่ยงต่อสุขภาพจากสิ่งแวดล้อมที่มาจากการผลิตปศุสัตว์แบบเข้มข้น จากเด็ค One Health Approach to Address Environmental Health Risks I (13 หน้า) และบันทึกคาบ 21 ต.ค. 2569 เริ่มจากคำศัพท์ (GHG, VOCs, PM) การปล่อยก๊าซเรือนกระจกต่อกิโลกรัมอาหาร farm-to-fork life cycle assessment แล้วไล่แผนผังผลกระทบของอาหารสัตว์ ฟาร์ม คุณภาพอากาศ และคุณภาพน้ำ ปิดด้วยกลยุทธ์ลดความเสี่ยง 3 แนวและกรอบการเปลี่ยนระบบปศุสัตว์",
    "sections": [
      {
        "heading": "คำศัพท์: GHG, VOCs, PM",
        "source": "One Health approach to address environmental health risks I p.2; คลิป pj_zkis2ziU [10:15-14:48]",
        "body": [
          {
            "sub": "Greenhouse gas (GHG) = ก๊าซที่กักความร้อนไว้ในบรรยากาศ",
            "body": [
              "ปกติมีอยู่ในบรรยากาศปริมาณหนึ่งเพื่อไม่ให้โลกหนาวเกินไป ถ้ามีมากเกินไปโลกจะร้อนเกินไป (คลิป 10:15-10:40)",
              {
                "table": {
                  "headers": [
                    "ก๊าซ",
                    "แหล่งที่มา",
                    "คำอธิบายเพิ่มเติม"
                  ],
                  "rows": [
                    [
                      "**Carbon dioxide (CO2)**",
                      "Fossil fuels and biological materials",
                      "จากการเผาเชื้อเพลิงฟอสซิลและวัสดุชีวภาพ"
                    ],
                    [
                      "**Methane (CH4)**",
                      "Livestock and agricultural practices; decay of organic waste; coal and natural gas",
                      "สัตว์เคี้ยวเอื้องปล่อยผ่านการเรอ การหมัก และการผายลม ในไทยมีไม่มากแต่ทั่วโลกมีมาก"
                    ],
                    [
                      "**Nitrous oxide (N2O)**",
                      "Agricultural and industrial activities; wastewater treatment; fossil fuels",
                      "เช่น ปุ๋ยที่มีไนโตรเจนระเหยขึ้นมาเป็น N2O"
                    ],
                    [
                      "**Fluorinated gases**",
                      "Household and industrial applications (smaller quantity but potent)",
                      "มีอะตอม fluorine เช่น จากแอร์และตู้เย็น ปริมาณน้อยแต่ก่อภาวะโลกร้อนได้สูงมากเมื่อเทียบกับ CO2"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Volatile organic compounds (VOCs)",
            "body": [
              {
                "bullets": [
                  "สารประกอบอินทรีย์ที่ **high vapor pressure** (ระเหยเป็นไอง่าย) และ **low water solubility** (ละลายน้ำได้น้อย)",
                  "ตัวอย่าง: สีทาบ้าน, ยาฆ่าแมลง, ผลิตภัณฑ์ในบ้าน",
                  "ความเข้มข้น **ในบ้านสูงกว่านอกบ้าน (indoors > outdoors)**"
                ]
              }
            ]
          },
          {
            "sub": "Particulate matter (PM)",
            "body": [
              {
                "bullets": [
                  "อนุภาคของแข็งและหยดของเหลว (solid particles and liquid droplets) เช่น **PM10** และ **PM2.5**",
                  "PM10 = อนุภาคขนาดไม่เกิน 10 ไมครอน (จึงรวม PM2.5 ด้วย; ช่วง 2.5-10 ไมครอนคือส่วนหยาบ); PM2.5 = ไม่เกิน 2.5 ไมครอน",
                  "ทั้งสองขนาดกระทบ **ระบบทางเดินหายใจและระบบเลือด** (คลิป 14:48)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ก๊าซเรือนกระจกต่อกิโลกรัมอาหาร และผลต่อการค้า",
        "source": "One Health approach to address environmental health risks I p.3; คลิป pj_zkis2ziU [8:35-9:50, 14:48-17:21]",
        "body": [
          "กราฟ Our World in Data (ข้อมูล Poore and Nemecek, 2018) วัดเป็น **kg CO2-equivalents** ต่อ 1 kg อาหาร",
          {
            "bullets": [
              "**CO2-equivalent**: ก๊าซอื่นถูกถ่วงน้ำหนักตามความร้อนที่ก่อในช่วง 100 ปี แล้วแปลงเทียบเป็น CO2 รวมเป็นค่าเดียว เพื่อให้คุยกันด้วยมาตรฐานเดียว (สไลด์และคลิป 16:04-16:55)",
              "ข้อมูลเป็นปี 2018 เพราะการเก็บข้อมูลแบบนี้ใช้เวลานาน (คลิป 14:48-15:13)"
            ]
          },
          {
            "table": {
              "headers": [
                "ผลิตภัณฑ์จากสัตว์",
                "kg CO2-eq ต่อ kg"
              ],
              "rows": [
                [
                  "Beef (beef herd)",
                  "**99.48**"
                ],
                [
                  "Lamb and mutton",
                  "39.72"
                ],
                [
                  "Beef (dairy herd)",
                  "33.3"
                ],
                [
                  "Prawns (farmed)",
                  "26.87"
                ],
                [
                  "Pig meat",
                  "12.31"
                ],
                [
                  "Poultry meat",
                  "9.87"
                ],
                [
                  "Eggs",
                  "4.67"
                ],
                [
                  "Milk",
                  "3.15"
                ]
              ]
            }
          },
          "พืชส่วนใหญ่บนกราฟเดียวกันต่ำกว่าเนื้อสัตว์มาก เช่น maize 1.7, peas 0.98, nuts 0.43 แต่ rice 4.45 สูงกว่า milk 3.15 และใกล้ eggs 4.67; cheese 23.88 อยู่บนกราฟแต่ไม่ได้ไฮไลต์",
          {
            "callout": "เพราะการผลิตปศุสัตว์ปล่อยก๊าซเรือนกระจกมาก **environmental impact จึงใช้เป็นเครื่องมือทางการค้าได้** นโยบายสิ่งแวดล้อมของกรมปศุสัตว์มักตามกลไกตลาดของประเทศคู่ค้า เช่น มาตรการของ EU ที่ให้ประโยชน์ทางการค้าตาม carbon footprint ฟาร์มหรือโรงฆ่าที่ทำตามได้จึงได้เปรียบ (คลิป 8:58-9:50, 17:21)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Farm-to-fork life cycle assessment",
        "source": "One Health approach to address environmental health risks I p.4; คลิป pj_zkis2ziU [17:48-19:56]",
        "body": [
          {
            "bullets": [
              "ประเมินวัฏจักรชีวิตของอาหารตั้งแต่การผลิตถึงผู้บริโภคและการกำจัดของเสีย เพื่อหาว่า **ขั้นใดก่อผลกระทบต่อสิ่งแวดล้อมมากที่สุด** แล้ววางหลักการ regulation หรือ intervention ที่ขั้นนั้น",
              "ผลกระทบที่สนใจ เช่น carbon footprint, ก๊าซเรือนกระจก, ไนโตรเจน, ฟอสฟอรัส หรือ antimicrobial resistance (คลิป 19:06)"
            ]
          },
          {
            "table": {
              "headers": [
                "ขั้น (p.4)",
                "สิ่งที่ใส่เข้าและออกตามแผนภาพ"
              ],
              "rows": [
                [
                  "**Production**",
                  "เข้า: fertilizers, pesticides, seeds, animal feed, irrigation, soil management, manure application, manure management, energy use, water use"
                ],
                [
                  "**Processing/packaging**",
                  "energy use, packaging materials, water use"
                ],
                [
                  "**Retail/purchasing**",
                  "energy use, water use"
                ],
                [
                  "**Consumption**",
                  "energy use, water use; ออก: food loss/waste, packaging disposal"
                ],
                [
                  "**Transportation** ระหว่างขั้น",
                  "ใช้ fuel ปล่อย emissions"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "Intensive livestock production: สิ่งที่ปล่อยออกจากฟาร์ม",
        "source": "One Health approach to address environmental health risks I p.5; คลิป pj_zkis2ziU [19:56-25:06]",
        "body": [
          "แผนภาพการเคลื่อนที่ของมลพิษจากฟาร์มอุตสาหกรรม เส้นทาง และปลายทางในสิ่งแวดล้อม (ดัดแปลงจาก Grzinic et al., 2023)",
          {
            "sub": "Factors emitted from farms",
            "body": [
              {
                "bullets": [
                  "**VOCs (with NH3)**",
                  "**Bioaerosols**: ฝุ่นหรือละอองที่มี pathogen เกาะอยู่ (คลิป 23:22-23:46)",
                  "**PM (with sorbed pollutants)**: PM ที่ดูดซับสารเคมีไว้"
                ]
              }
            ]
          },
          {
            "callout": "NH3 อยู่ในวงเล็บกับ VOCs เพราะระเหยขึ้นอากาศได้ แต่ **แอมโมเนียไม่ใช่ VOC** เพราะไม่มีคาร์บอนเป็นองค์ประกอบ (เป็นสารอนินทรีย์) และละลายน้ำได้ดี ขณะที่ VOCs ละลายน้ำได้น้อย (p.2; คลิป 20:43-23:22)",
            "kind": "warn"
          },
          {
            "bullets": [
              "Input ของการผลิต: animal feed, seeds, fertilizers, manure application, pesticides, soil management, irrigation, manure management, energy use, water use",
              "มลพิษลอยขึ้นอากาศ หรือลงน้ำและดินโดยตรง ฝนพาสารเคมีและ pathogen ลงสู่คน สัตว์ น้ำ ดิน พืช และสิ่งมีชีวิตที่ไม่ใช่เป้าหมาย (non-target organisms) เช่น ปลา กุ้งตัวเล็ก และจุลชีพที่มีประโยชน์ (คลิป 24:14-25:06)",
              "แผนภาพแสดงการปนเปื้อนลงถึง **groundwater**"
            ]
          }
        ]
      },
      {
        "heading": "แผนผังผลกระทบ 1: การผลิตอาหารสัตว์",
        "source": "One Health approach to address environmental health risks I p.6; คลิป pj_zkis2ziU [25:33-31:05]",
        "body": [
          "แผนภาพใช้ลูกศรสีแดงเป็นผลเชิงลบ สีเขียวเป็นผลเชิงบวก และสีม่วงเป็นส่วนของภาคปศุสัตว์ (คลิป 26:51, 28:10)",
          {
            "table": {
              "headers": [
                "จุดเริ่ม",
                "เส้นทางในแผนภาพ"
              ],
              "rows": [
                [
                  "**Water use**",
                  "freshwater withdrawals (ขาดแคลนน้ำ)"
                ],
                [
                  "**Energy use**",
                  "greenhouse gas emissions → climate change"
                ],
                [
                  "**Seeds → land use**",
                  "deforestation → biodiversity loss และ climate change"
                ],
                [
                  "**Fertilizers, pesticides, soil management, irrigation, manure application**",
                  "air, soil and water pollution → chemical bioaccumulation → contaminated feed → diseased livestock"
                ],
                [
                  "**Manure application**",
                  "ทางบวก: improved soil health ถ้าควบคุมดี (คลิป 30:39-31:05)"
                ]
              ]
            }
          },
          {
            "bullets": [
              "**Climate change** → freshwater withdrawals ได้ทั้งลบ (ที่ร้อนจัดขาดน้ำ) และบวก (บางพื้นที่น้ำท่วม น้ำจืดเพิ่ม) จึงมีลูกศรเขียว (คลิป 26:51-27:43)",
              "Climate change → biodiversity loss และ → diseased livestock (ภูมิคุ้มกันสัตว์ลด อุบัติการณ์โรคเพิ่ม) (คลิป 28:10-28:35)",
              "สารเคมีสะสมในดิน พืชดูดซึม นำไปทำอาหารสัตว์ สัตว์ป่วย (คลิป 30:12-30:39)"
            ]
          },
          {
            "callout": "วงจรที่วนซ้ำในแผนภาพอาหารสัตว์ คุณภาพอากาศ และคุณภาพน้ำ (p.6, 8, 9): **diseased livestock → lower yield → more livestock and pharmaceuticals needed** → มลพิษ air, soil, water และก๊าซเรือนกระจกเพิ่มขึ้นอีก (คลิป 28:35-29:00)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "แผนผังผลกระทบ 2: ฟาร์มและคุณภาพอากาศ",
        "source": "One Health approach to address environmental health risks I p.7-8; คลิป pj_zkis2ziU [31:31-39:52]",
        "body": [
          {
            "sub": "ฟาร์ม (p.7)",
            "body": [
              {
                "bullets": [
                  "สัตว์ในฟาร์มผลิต VOCs, แอมโมเนีย, pathogen และฝุ่น (คลิป 31:54)",
                  "Irrigation และ manure management ที่ไม่เหมาะสม → air, soil and water pollution; land use → deforestation → biodiversity loss",
                  "Irrigation, manure management และ energy use → greenhouse gas emissions → climate change",
                  "Water use → freshwater withdrawals; climate change → freshwater withdrawals (ลูกศรเขียว)"
                ]
              }
            ]
          },
          {
            "sub": "คุณภาพอากาศ (p.8)",
            "body": [
              {
                "bullets": [
                  "มลพิษอากาศจากฟาร์ม: **noise, PM, nitrogen compounds และ VOCs**",
                  "ผลต่อสัตว์: **respiratory disorders** และ **susceptible to infections (bioaerosols)** → diseased livestock",
                  "ผลต่อดิน: **soil acidification** สารบางตัวเป็นกรด รวมกับน้ำแล้วตกลงมากับฝน ดินเป็นกรดมากขึ้น สิ่งมีชีวิตในดินหายไป (คลิป 38:37-39:28)",
                  "Climate change → ภูมิคุ้มกันสัตว์ลด ติดเชื้อง่าย และ → **affected spread of diseases** (คิดในกรณีเลวที่สุดคือแพร่ง่ายขึ้น) (คลิป 35:41-36:53)",
                  "PM2.5 ก่อผลต่อระบบทางเดินหายใจ (คลิป 39:28)"
                ]
              }
            ]
          },
          {
            "callout": "เมื่อเชื้อแพร่ง่ายขึ้นและสัตว์ไวต่อการติดเชื้อมากขึ้น สัตว์ป่วย ผลผลิตลด จึงต้องเพิ่มสัตว์หรือใช้ยา วงจรนี้เชื่อมกับเหตุที่มีการใช้ยาต้านจุลชีพหลายตัวในฟาร์มสุกรและไก่ และกับปัญหา antimicrobial resistance (คลิป 36:53-37:45)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "แผนผังผลกระทบ 3: คุณภาพน้ำ",
        "source": "One Health approach to address environmental health risks I p.9; คลิป pj_zkis2ziU [45:46-51:15]",
        "body": [
          "น้ำเสียจากฟาร์มที่ **ไม่ผ่านการบำบัด** แล้วปล่อยสู่สิ่งแวดล้อมโดยตรงเปลี่ยนคุณภาพน้ำผ่าน 3 กลุ่มหลัก (คลิป 47:54-48:46)",
          {
            "table": {
              "headers": [
                "กลุ่ม",
                "เส้นทางในแผนภาพ"
              ],
              "rows": [
                [
                  "**Chemicals**",
                  "physiological disruption (ฮอร์โมนอาจทำให้สัตว์เปลี่ยนเพศจากผู้เป็นเมีย), antimicrobial resistance (ยาที่ปนเปื้อน), chemical bioaccumulation → biodiversity loss และ susceptible to infections; สารเคมีเองยังเปลี่ยน water quality"
                ],
                [
                  "**Nitrogen and phosphorus** (มีมากในมูลสัตว์)",
                  "algal blooms → altered water quality → สัตว์น้ำตาย"
                ],
                [
                  "**Microbes** (ทั้งก่อโรคและไม่ก่อโรค)",
                  "ใช้ออกซิเจน ทำให้ **dissolved oxygen ลดลง** → altered water quality; pathogenic microbes → diseased livestock เมื่อนำน้ำกลับมาใช้ในฟาร์ม"
                ]
              ]
            }
          },
          {
            "bullets": [
              "Climate change → เชื้อเพิ่มจำนวนในน้ำได้ดีขึ้น และสัตว์น้ำปรับตัวกับอุณหภูมิที่เปลี่ยนไม่ได้ → susceptible to infections → **mortality of aquatic organisms** → น้ำเน่าเสีย (คลิป 46:11-47:24)",
              "Altered water quality → **soil contamination** เมื่อนำน้ำไปใช้ → จุลินทรีย์และสิ่งมีชีวิตในดินลดความหลากหลาย (คลิป 47:24)",
              "Pathogenic microbes วนกลับไปที่ diseased livestock → lower yield → more livestock and pharmaceuticals needed ส่วน soil contamination และ mortality of aquatic organisms → biodiversity loss",
              "Climate change → affected spread of diseases และ susceptible to infections ซึ่งแยกเป็น 2 ทาง: **aquatic** → mortality of aquatic organisms และ **terrestrial** → diseased livestock"
            ]
          }
        ]
      },
      {
        "heading": "กลยุทธ์ลดความเสี่ยงต่อสุขภาพจากสิ่งแวดล้อม",
        "source": "One Health approach to address environmental health risks I p.10-12; คลิป pj_zkis2ziU [51:45-67:04]",
        "body": [
          {
            "sub": "1. Agroecology strategy (p.10)",
            "body": [
              "นิเวศเกษตร = แนวคิดเกษตรยั่งยืนที่สมดุลทั้งเศรษฐกิจ สังคม และสิ่งแวดล้อม (คลิป 51:45-52:12)",
              {
                "bullets": [
                  "**Decreased livestock number**: ลดจำนวนสัตว์ในฟาร์มเข้มข้น มลพิษก็ลดลง",
                  "**Feed additives**: ลดการปล่อย GHG จากปศุสัตว์",
                  "**Breeding**: เพิ่ม productivity (เนื้อหรือนมมากขึ้น จึงใช้สัตว์น้อยลง), low-methane, disease resistance",
                  "**Good animal health**: vaccination, biosecurity, welfare",
                  "**Efficient management**: ปุ๋ย ยาฆ่าแมลง มูลสัตว์ และน้ำเสีย",
                  "**Policy and regulation**: จำกัดการใช้ที่ดิน, การปล่อยมลพิษ, และการใช้มูลสัตว์เป็นปุ๋ย (ตรวจก่อนว่ามูลปนเปื้อนสารเคมีมากน้อยเพียงใด) (คลิป 53:59-54:26)",
                  "**Monitoring and assessment**: มลพิษในน้ำเสีย มูลสัตว์ สิ่งแวดล้อม และสุขภาพประชากรกลุ่มเสี่ยง เช่น เด็กที่อยู่ในฟาร์มกับอาการทางเดินหายใจ (คลิป 54:26-55:18)"
                ]
              }
            ]
          },
          {
            "sub": "2. Diet change strategy (p.11)",
            "body": [
              "**Alternative proteins**: ลดการบริโภคเนื้อ เช่น plant-based protein ซึ่งตอบทั้งเรื่องภูมิแพ้และสิ่งแวดล้อม (คลิป 55:18-55:45)"
            ]
          },
          {
            "sub": "3. Feed and food industry energy efficiency strategy (p.11)",
            "body": [
              {
                "bullets": [
                  "**Clean energy**: solar, hydropower, wind, geothermal, biomass energy; โรงฆ่าเริ่มใช้โซลาร์เซลล์หรือพลังงานน้ำ พลังงานลมไม่เหมาะกับไทย; biomass คือหมักสารอินทรีย์แล้วนำก๊าซที่ได้ไปเป็นเชื้อเพลิง (คลิป 56:09-56:58)",
                  "**Smart management system**: precision livestock farming technologies ตรวจจับความผิดปกติและน้ำหนักสัตว์ เพื่อรู้ล่วงหน้าว่าตัวใดจะป่วยและรักษาได้ทัน (คลิป 57:26)"
                ]
              }
            ]
          },
          {
            "callout": "ทุกกลยุทธ์ต้องถามกลับว่า **กระทบความมั่นคงทางอาหาร (food security) และรายได้ของคน (เช่น เกษตรกร) หรือไม่** (p.10-11; คลิป 52:42, 57:52)",
            "kind": "warn"
          },
          {
            "sub": "กรอบเปลี่ยนระบบปศุสัตว์ให้ดีต่อ One Health (p.12, Ducrot et al., 2024)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ขั้น",
                    "สาระบนแผนภาพ"
                  ],
                  "rows": [
                    [
                      "**A. Define One Health by stakeholders**",
                      "หาวิธีประเมินที่ practical และ objective; มุมมองของ stakeholders (เกษตรกร สัตวแพทย์ ผู้เชี่ยวชาญ) กับ objective indicators (on-farm monitoring ด้วย precision livestock farming)"
                    ],
                    [
                      "**B. Consider positive and negative interactions, and trade-offs**",
                      "ระหว่าง human health, animal health, environmental health"
                    ],
                    [
                      "**C. Transform livestock farming systems**",
                      "ทุก stakeholders ร่วมสร้าง (co-construction, living lab) → innovations → design of livestock system ที่ได้ good health, economic profitability, livestock sector adaptation"
                    ],
                    [
                      "**D. Multiperformance and sustainability**",
                      "environmental health กับ human and animal health เชื่อมด้วย pathogen, antimicrobial resistance, pollution → societal demand; การยอมรับมุมมอง One Health ของสังคม"
                    ]
                  ]
                }
              },
              "ขั้นตอนในทางปฏิบัติ: เริ่มจากคุยกับเจ้าของกิจการหรือ stakeholders ว่ากลยุทธ์ practical หรือไม่ และวัดผลได้หรือไม่, ฟาร์มรับผลดีผลเสียได้แค่ไหน (เช่น เปลี่ยนจาก intensive เป็น free range), แล้วร่วมกันออกแบบระบบ และสุดท้ายต้องดูการรับรู้ของผู้บริโภค ซึ่งมักเข้าใจผ่านคำอย่าง ลด carbon footprint หรือ animal welfare มากกว่าคำว่า One Health (คลิป 58:44-65:22)"
            ]
          },
          {
            "callout": "การลดความเสี่ยงต่อสุขภาพจากสิ่งแวดล้อม **อยู่เหนือขอบเขตของสาขาเดียวในสัตวศาสตร์และสัตวแพทย์** ต้องมองกว้างถึงระบบเกษตร value chain และสิ่งแวดล้อมทางนิเวศและสังคม (p.12)",
            "kind": "tip"
          }
        ]
      }
    ]
  },

  "oh-env-mutagen": {
    "topic": "oh-env-mutagen",
    "title": "OH approach to address environmental health risks II: สัตว์เลี้ยงเป็น sentinel",
    "lecturer": "วรญาณี ธรรมธร",
    "icon": "🧬",
    "summary": "สัตว์เลี้ยงในฐานะ sentinel ของอันตรายจากสิ่งแวดล้อม และในฐานะแบบจำลองมะเร็งและความชราของคน จากเด็ค One Health Approach to Address Environmental Health Risks II (20 หน้า, สอน 28 ต.ค. 2569) ได้แก่ นิยาม sentinel, กรณีผู้ป่วยพิษปรอทที่แมวในบ้านตายก่อน, บทบาทสัตวแพทย์, สารพิษในบ้าน 6 ชนิดพร้อมแหล่ง ทางเข้า ระยะเวลา และอาการในสัตว์เทียบคน, และแนวคิด One Medicine – One Pathogenesis",
    "sections": [
      {
        "heading": "Sentinel species คืออะไร",
        "source": "One Health approach to address environmental health risks II p.2-4",
        "body": [
          {
            "bullets": [
              "**Sentinel species** = สัตว์ที่ **อยู่ในสิ่งแวดล้อมเดียวกับคน** ใช้วัดระดับการสัมผัส (extent of exposure) เมื่อการวัดในคน **ทำไม่ได้ในทางปฏิบัติหรือผิดจริยธรรม** (impractical or unethical)",
              "ให้ **สัญญาณเตือนล่วงหน้า (early warning signs)** ของความเสี่ยงที่อาจเกิดกับคน (p.4)",
              "เหตุที่สัตว์เลี้ยงเป็น sentinel ของอันตรายจากสิ่งแวดล้อมได้ (p.3): **shared environment, greater exposure and susceptibility, shorter latency**"
            ]
          }
        ]
      },
      {
        "heading": "กรณีผู้ป่วยพิษปรอทที่แมวในบ้านเป็นสัญญาณเตือน",
        "source": "One Health approach to address environmental health risks II p.5-7 (Beck et al., 2020)",
        "body": [
          {
            "table": {
              "headers": [
                "ขั้น",
                "สาระ"
              ],
              "rows": [
                [
                  "ผู้ป่วย (p.5)",
                  "ชาย 55 ปี เป็นเบาหวานชนิดที่ 2 และสูบบุหรี่; ไอไม่มีเสมหะ 2 สัปดาห์, หายใจลำบาก, hypoxia, สติเปลี่ยน (ataxic gait, confusion), chest x-ray พบ multifocal airspace disease"
                ],
                [
                  "วินิจฉัยแรก (p.5)",
                  "**ARDS จากที่คิดว่าเป็น infectious pneumonia** เข้า ICU แล้วส่งต่อโรงพยาบาลตติยภูมิเพื่อพิจารณา ECMO"
                ],
                [
                  "ซักประวัติ (p.6)",
                  "คนรอบตัวไม่มีใครป่วย; **แมวในบ้าน 3 ตัวตายไม่นานนี้**; สัปดาห์ก่อนสัตว์ตาย ผู้ป่วย **หลอมวัสดุอุดฟันเก่า (old dental fillings) ในกระทะบนเตา**"
                ],
                [
                  "ตรวจ (p.6)",
                  "ปรอทระดับเป็นพิษใน **serum และปัสสาวะ** ของผู้ป่วย และพบปรอทในอากาศภายในบ้าน (ambient levels)"
                ],
                [
                  "รักษา (p.7)",
                  "ทั้งครอบครัวได้ **chelation**; บ้านทำ environmental cleanup; ผู้ป่วยอยู่ ICU หลายสัปดาห์ สติดีขึ้นแต่ยังมี peripheral motor weakness และ neuropathy ต้องทำกายภาพฟื้นฟู"
                ]
              ]
            }
          },
          {
            "callout": "คำถามซักประวัติ 3 ข้อที่พาไปถึงสาเหตุ (p.6): มีคนรอบตัวป่วยด้วยไหม, **มีสัตว์หรือสัตว์เลี้ยงในบ้านป่วยหรือตายไม่นานนี้ไหม**, และมีกิจกรรมอะไรผิดปกติไหม",
            "kind": "tip"
          },
          {
            "sub": "ข้อเสนอจากกรณีนี้ (p.7)",
            "body": [
              {
                "bullets": [
                  "ใช้สัตว์บ้านและสัตว์ป่าเป็น sentinel ของอันตรายต่อสุขภาพจากสิ่งแวดล้อม",
                  "สัตว์เลี้ยง **สัมผัสดิน ฝุ่นในบ้าน และอนุภาคในอากาศมากกว่า** คน",
                  "พฤติกรรม **grooming** เป็นประจำเพิ่มการได้รับฝุ่นและอนุภาคในอากาศ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สัตวแพทย์: ปกป้องสุขภาพทั้งสัตว์และคน",
        "source": "One Health approach to address environmental health risks II p.8 (Beck et al., 2020)",
        "body": [
          "แผนภาพบน p.8:",
          {
            "bullets": [
              "คน **ก่อ (cause)** อันตรายจากสิ่งแวดล้อม และอันตรายนั้น **ทำร้าย (harm)** ทั้งคนและสัตว์เลี้ยง",
              "สัตว์เลี้ยงมาพบสัตวแพทย์ (visit) สัตวแพทย์รักษา (treat)",
              "สัตวแพทย์ **แจ้ง (inform)** หน่วยงานสาธารณสุข (public health authorities) และแจ้งเจ้าของ",
              "หน่วยงานสาธารณสุขแจ้งแพทย์ (physicians) และตรวจคน (check)",
              "คนไปพบแพทย์ ได้ **early diagnosis and treatment**",
              "ใช้ **silicone samplers** ประเมินมลพิษได้ทั้งในคนและสัตว์เลี้ยง"
            ]
          }
        ]
      },
      {
        "heading": "สารพิษในบ้าน 6 ชนิด: ภาพรวม",
        "source": "One Health approach to address environmental health risks II p.3, 9-16",
        "body": [
          {
            "table": {
              "headers": [
                "ที่",
                "สารพิษ",
                "Route",
                "Timeline",
                "สัตว์",
                "คน"
              ],
              "rows": [
                [
                  "1",
                  "**Teflon (PTFE)**",
                  "Inhalation",
                  "Acute",
                  "นก: ตายเฉียบพลัน (30 นาที)",
                  "Polymer fume fever (ชั่วโมง)"
                ],
                [
                  "2",
                  "**Elemental mercury (Hg0)**",
                  "Inhalation",
                  "Acute",
                  "แมว สุนัข: ARDS (นาทีถึงชั่วโมง)",
                  "หายใจลำบากรุนแรง (6-48 ชม.)"
                ],
                [
                  "3",
                  "**Organic mercury (methylmercury, MeHg)**",
                  "Oral",
                  "Chronic (bioaccumulation along food webs)",
                  "แมว สุนัข: อาการประสาท, dancing cat fever (เดือนถึงปี)",
                  "อาการประสาท (เดือนถึงปี)"
                ],
                [
                  "4",
                  "**Lead**",
                  "Oral",
                  "Chronic",
                  "แมว สุนัข: ประสาทและทางเดินอาหาร (เดือนถึงปี)",
                  "ประสาทและทางเดินอาหาร (เดือนถึงปี)"
                ],
                [
                  "5",
                  "**Asbestos**",
                  "Inhalation",
                  "Chronic",
                  "แมว สุนัข: mesothelioma (ปี)",
                  "asbestosis, mesothelioma, lung cancer (ปี)"
                ],
                [
                  "6",
                  "**Herbicides (2,4-D)**",
                  "Oral, dermal, inhalation",
                  "Chronic",
                  "สุนัข: lymphoma-lymphadenopathy (ปี)",
                  "non-Hodgkin lymphoma (ปี)"
                ]
              ]
            }
          },
          {
            "callout": "แบบแผนที่ช่วยจำ: สัตว์เลี้ยงแสดงอาการ **เร็วกว่า** คน (นกตายใน 30 นาที ขณะคนป่วยในหลายชั่วโมง; แมวสุนัขเกิด ARDS ในนาทีถึงชั่วโมง ขณะคนใช้ 6-48 ชม.) และถ้าไม่มีสัตว์เตือน อาการของคน **มักถูกวินิจฉัยผิด** เป็นโรคทางเดินหายใจจากการติดเชื้อหรือการอักเสบ (p.3 shorter latency; p.10, 12)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Teflon และปรอท",
        "source": "One Health approach to address environmental health risks II p.10-13",
        "body": [
          {
            "sub": "1 Teflon (p.10)",
            "body": [
              {
                "bullets": [
                  "**Source**: ภาชนะเคลือบกันติด (nonstick) ที่เคลือบ polytetrafluoroethylene (PTFE, Teflon) แล้ว **ร้อนเกินไป (overheated)**",
                  "Route: inhalation; timeline: acute",
                  "**นก**: ตายเฉียบพลัน (30 นาที); alveolar congestion และ lung edema",
                  "**คน**: **polymer fume fever** กลุ่มอาการคล้ายไข้หวัด (หายใจสั้น ไอ ไข้) ภายในหลายชั่วโมง หายเองได้ (self-limiting); ถ้าไม่มีสัตว์เตือนมักวินิจฉัยผิดเป็น upper respiratory viral illness"
                ]
              }
            ]
          },
          {
            "sub": "รูปแบบของปรอทกับทางเข้า (p.11)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Exposure route",
                    "Elemental (Hg0)",
                    "Inorganic (Hg2+)",
                    "Organic (MeHg, EtHg)"
                  ],
                  "rows": [
                    [
                      "Inhalation",
                      "**High**",
                      "Low",
                      "Low"
                    ],
                    [
                      "Oral",
                      "Low",
                      "Medium",
                      "**High**"
                    ],
                    [
                      "Dermal",
                      "Low",
                      "Medium",
                      "Low"
                    ],
                    [
                      "ตัวอย่าง",
                      "dental amalgam, เทอร์โมมิเตอร์ปรอท (เกือบเลิกใช้แล้ว), หลอดฟลูออเรสเซนต์",
                      "aquatic organisms",
                      "aquatic organisms (MeHg); วัคซีนไข้หวัดใหญ่ที่มี thimerosal (EtHg; ไม่ใช้ในเด็กแล้ว)"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "2 Elemental mercury (p.12)",
            "body": [
              {
                "bullets": [
                  "**Source**: dental amalgam, เทอร์โมมิเตอร์ปรอท (เกือบเลิกใช้แล้ว), หลอดฟลูออเรสเซนต์",
                  "Toxicant: Hg0; route: **inhalation**; timeline: **acute**",
                  "**แมวและสุนัข**: acute respiratory distress syndrome (นาทีถึงชั่วโมง)",
                  "**คน**: ไอแห้ง, tachypnea, hypoxia, หายใจลำบากรุนแรง (6-48 ชม.); ถ้าไม่มีสัตว์เตือนมักวินิจฉัยผิดเป็นโรคทางเดินหายใจจากการอักเสบหรือการติดเชื้อ"
                ]
              }
            ]
          },
          {
            "sub": "3 Organic mercury (p.13)",
            "body": [
              {
                "bullets": [
                  "**Source**: สัตว์น้ำและสิ่งแวดล้อมที่ปนเปื้อน",
                  "Toxicant: **methylmercury (MeHg)**; route: **oral**; timeline: **chronic** (สะสมตามห่วงโซ่อาหาร)",
                  "**แมวและสุนัข**: อาการประสาท (น้ำลายไหล, ataxia, ชัก, พฤติกรรมผิดปกติ) คือ **dancing cat fever** (เดือนถึงปี)",
                  "**คน**: อาการประสาท (ชา, การได้ยินหรือการมองเห็นผิดปกติ, tremors, เดินลำบาก, สมองเสียหาย; เดือนถึงปี)"
                ]
              }
            ]
          },
          {
            "callout": "Hg0 เข้าทางหายใจ เป็นพิษเฉียบพลันต่อระบบหายใจ ส่วน MeHg เข้าทางปาก เป็นพิษเรื้อรังต่อระบบประสาท",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ตะกั่ว แร่ใยหิน และสารกำจัดวัชพืช",
        "source": "One Health approach to address environmental health risks II p.14-16",
        "body": [
          {
            "sub": "4 Lead (p.14)",
            "body": [
              {
                "bullets": [
                  "**Source**: สีที่มีตะกั่ว (ของใช้ก่อน พ.ศ. 2519 และอาคารก่อน พ.ศ. 2521), สิ่งมีชีวิตและสิ่งแวดล้อมที่ปนเปื้อน, ท่อ, แบตเตอรี่, กระสุนตะกั่ว",
                  "Route: **oral**; timeline: **chronic**",
                  "**แมวและสุนัข**: อาการประสาทและทางเดินอาหาร (ataxia, ชัก, ซึม, อาเจียน, ท้องเสีย; เดือนถึงปี)",
                  "**คน**: อาการประสาทและทางเดินอาหาร (ปวดท้อง, ปวดหัว, ชา, สมองเสียหาย, แท้งในหญิงตั้งครรภ์; เดือนถึงปี)"
                ]
              }
            ]
          },
          {
            "sub": "5 Asbestos (p.15)",
            "body": [
              {
                "bullets": [
                  "**Source**: วัสดุก่อสร้าง (แผ่นมุงหลังคา, กระเบื้องเพดานและพื้น, ผลิตภัณฑ์ใยหินซีเมนต์), ผลิตภัณฑ์เสียดทาน (คลัตช์และเบรกรถยนต์), ผ้าทนความร้อน",
                  "Route: **inhalation**; timeline: **chronic**",
                  "**แมวและสุนัข**: **mesothelioma** (ปี)",
                  "**คน**: asbestosis, mesothelioma, lung cancer (ปี)"
                ]
              }
            ]
          },
          {
            "sub": "6 Herbicides (p.16)",
            "body": [
              {
                "bullets": [
                  "Example toxicant: **2,4-dichlorophenoxyacetic acid (2,4-D)**",
                  "Route: oral, dermal และ inhalation; timeline: chronic",
                  "อาการแสดงที่มีความสัมพันธ์ **เชิงบวกแบบอ่อน (weak positive association)**: **สุนัข** lymphoma-lymphadenopathy (ปี); **คน** non-Hodgkin lymphoma (ปี)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สัตว์เลี้ยงเป็นแบบจำลองมะเร็งและความชราของคน",
        "source": "One Health approach to address environmental health risks II p.17-20 (National Academies, 2022)",
        "body": [
          {
            "sub": "One Medicine – One Pathogenesis (p.18)",
            "body": [
              {
                "bullets": [
                  "สัตว์เลี้ยงคล้ายคนในด้าน **genetics, physiology, tumorigenesis และ cancer progression**",
                  "**อายุขัยสั้นกว่า** (shorter life span) และ **โรคดำเนินเร็วกว่า** (more rapid disease progression)",
                  "โรคที่ใช้เทียบระหว่างคนกับแมวสุนัขตามแผนภาพ: Alzheimer's disease (brain atrophy, plaques, tangles), aging, brain cancer, oral melanoma, leukemia, lymphoma, cutaneous melanoma, breast cancer, bladder cancer, prostate cancer, bone cancer"
                ]
              }
            ]
          },
          {
            "sub": "ข้อจำกัด (p.18)",
            "body": [
              {
                "bullets": [
                  "**Neutered pets**: ระบบต่อมไร้ท่อเปลี่ยน ผลลัพธ์จึงต่างออกไป",
                  "**Validation** ของสัตว์เลี้ยงในฐานะ sentinel: กลไกเทียบกับคนได้แค่ไหน และจะทำให้แนวคิด pet sentinel เป็นมาตรฐานเดียวกันด้วย biomarker ทาง genetic, histopathological หรืออื่นๆ ที่อาจไม่เหมือนของคนได้อย่างไร"
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยที่กระทบคนและสัตว์เลี้ยง (p.19)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ปัจจัย",
                    "ตัวอย่างบนแผนภาพ"
                  ],
                  "rows": [
                    [
                      "**Ecosystem**",
                      "แหล่งขายอาหารและแอลกอฮอล์, ความหนาแน่นประชากร, walkability"
                    ],
                    [
                      "**Lifestyle**",
                      "การออกกำลังกาย, การนอน, อาหาร"
                    ],
                    [
                      "**Socio-economics**",
                      "รายได้ครัวเรือน, ความเหลื่อมล้ำ, เครือข่ายสังคม, บรรทัดฐานวัฒนธรรม"
                    ],
                    [
                      "**Physical-chemical stressors**",
                      "อุณหภูมิ, ความชื้น, มลพิษ"
                    ],
                    [
                      "**Intrinsic factors**",
                      "health responses"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "**Public-private partnerships**: แพทย์ สัตวแพทย์ นักวิจัยทางสัตวแพทย์ นักวิจัยสุขภาพคน และ exposure scientists ทำงานร่วมกัน",
                  "Animal medicine ยับยั้ง aging and cancer → increased animal lifespan; ร่วมกับ developed human medicine → increased human lifespan"
                ]
              }
            ]
          },
          "คำถามชวนคิดปิดท้าย: **Longevity: curse or blessing?** (p.20)"
        ]
      }
    ]
  },

  "oh-gmo": {
    "topic": "oh-gmo",
    "title": "One Health perspective of food and feed GMOs",
    "lecturer": "วรญาณี ธรรมธร",
    "icon": "🌾",
    "summary": "GMO ในอาหารคนและอาหารสัตว์มองผ่านสุขภาพคน สุขภาพสัตว์ และสุขภาพสิ่งแวดล้อม จากเด็ค One Health Perspective on Food and Feed GMOs (21 หน้า, สอน 4 พ.ย. 2569) ได้แก่ นิยามและตัวอย่าง GMO, ห่วงโซ่อาหาร, ผลโดยตรงและการประเมินความปลอดภัย 4 ด้าน, ผลทางอ้อมจากพืช HT และ Bt ต่อสารตกค้าง รายได้ และสิ่งแวดล้อม, มาตรการป้องกัน 3 ข้อ และสถานะในประเทศไทย หน้า 8-17 วิเคราะห์ฉากเดียวกันคือพืช GM ที่ทนสารกำจัดวัชพืชและต้านแมลงที่ขายในตลาด ผลทางอ้อม (หน้า 10-11, 16-17), ช่องว่างความรู้ (หน้า 18) และมาตรการป้องกัน (หน้า 19) อ้างอิงบทความ Noack et al. (2024)",
    "sections": [
      {
        "heading": "GMO คืออะไร ทำไมต้องมี และตัวอย่าง",
        "source": "One Health perspective of food and feed GMOs p.2-4",
        "body": [
          {
            "bullets": [
              "**GMO (genetically modified organism)** = พืช สัตว์ หรือจุลชีพที่สารพันธุกรรม (DNA) ถูกเปลี่ยนด้วยเทคโนโลยีที่ดัดแปลง DNA อย่างจำเพาะ รวมทั้ง **การถ่ายโอน DNA จำเพาะจากสิ่งมีชีวิตหนึ่งไปอีกสิ่งมีชีวิตหนึ่ง** (p.2)",
              "ตัวอย่าง genetic engineering บนสไลด์: ใส่ยีนจากแบคทีเรียในดิน (Bt) เข้า DNA ของข้าวโพด ได้ข้าวโพดต้านแมลง (p.2)"
            ]
          },
          {
            "sub": "เหตุผลที่มี GMO (p.3): ปรับปรุงลักษณะที่สำคัญทางเศรษฐกิจ",
            "body": [
              {
                "bullets": [
                  "อัตราการเติบโตและการรอดชีวิต",
                  "ต้านทานโรคหรือแมลง",
                  "ทนสารกำจัดวัชพืชหรือทนแล้ง",
                  "คุณภาพและองค์ประกอบของพืชและอาหารจากสัตว์"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง GMO (p.4)",
            "body": [
              {
                "table": {
                  "headers": [
                    "GMO",
                    "ยีนที่ใส่และแหล่งของยีน",
                    "ผล"
                  ],
                  "rows": [
                    [
                      "**Bt corn**",
                      "ยีนสารฆ่าแมลงธรรมชาติ **Bt delta endotoxin** จาก Bacillus thuringiensis",
                      "ข้าวโพดต้านแมลง"
                    ],
                    [
                      "**Roundup Ready soybean**",
                      "ยีนต้าน glyphosate (**EPSP synthase แบบไม่ไวต่อ glyphosate**) จาก Agrobacterium sp.",
                      "ถั่วเหลืองทนสารกำจัดวัชพืช glyphosate"
                    ],
                    [
                      "**AquAdvantage salmon**",
                      "ยีน growth hormone จาก **Chinook salmon** ใส่ใน Atlantic salmon ร่วมกับ promoter (สวิตช์เปิด) จาก **ocean pout**",
                      "สไลด์ไม่ได้ระบุ"
                    ],
                    [
                      "**GM E. coli ผลิต bST**",
                      "ใส่ยีน bovine somatotropin เข้า E. coli ให้ผลิต **recombinant bST (rbST)**",
                      "เพิ่มผลผลิตน้ำนมของโคนม (rbST milk)"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "อาหารจาก GMO ห่วงโซ่อาหาร และกรอบ One Health",
        "source": "One Health perspective of food and feed GMOs p.5-7",
        "body": [
          {
            "sub": "อาหารและอาหารสัตว์ที่มาจาก GMO (p.5)",
            "body": [
              {
                "table": {
                  "headers": [
                    "สำหรับบริโภค (For consumption)",
                    "GM crops",
                    "GM animals",
                    "GM microbes"
                  ],
                  "rows": [
                    [
                      "**GMO เอง (GMOs)**",
                      "ส่วนของข้าวโพด เช่น ข้าวโพดอ่อน ฝัก เมล็ด",
                      "ส่วนของแซลมอน เช่น เนื้อ ไข่ (roe)",
                      "เช่น live starter culture"
                    ],
                    [
                      "**ผลิตภัณฑ์ GMO แปรรูป**",
                      "ข้าวโพดกระป๋อง ซุปข้าวโพด",
                      "แซลมอนรมควัน หนังแซลมอนทอดกรอบ",
                      "yeast extract"
                    ],
                    [
                      "**ผลพลอยได้แปรรูป (by-products)**",
                      "น้ำมันข้าวโพด, sorbitol จากแป้งข้าวโพด, แป้งข้าวโพดดัดแปร",
                      "น้ำมันแซลมอน, คอลลาเจนแซลมอน, สารสกัดกระดูกอ่อนจมูกแซลมอน",
                      "oligosaccharides, vitamin B12, steviol glycoside, เอนไซม์ในการผลิตอาหาร"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ห่วงโซ่อาหาร (p.6)",
            "body": [
              {
                "bullets": [
                  "**GM crops** เป็นผู้ผลิต (producers)",
                  "เส้นทาง 1: พืช GM ถึงคนโดยตรง คนเป็น primary consumer",
                  "เส้นทาง 2: พืช GM เป็นอาหารของ **ปศุสัตว์ (primary consumers)** แล้วถึงคนซึ่งเป็น **secondary consumer**"
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยที่เกี่ยวข้องในกรอบ One Health (p.7)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ด้าน",
                    "ตัวอย่างปัจจัยบนสไลด์"
                  ],
                  "rows": [
                    [
                      "**Human health**",
                      "social determinants, population movements, diet, food security, antibiotics and other antimicrobials"
                    ],
                    [
                      "**Animal health**",
                      "food security, antibiotics and other antimicrobials, intensive livestock farming, disease vectors"
                    ],
                    [
                      "**Environmental health**",
                      "climate change, water pollution, air pollution, deforestation, biodiversity loss"
                    ]
                  ]
                }
              },
              "สไลด์หมายเหตุว่าปัจจัยเหล่านี้เป็นเพียงตัวอย่าง ไม่ครบทั้งหมด"
            ]
          }
        ]
      },
      {
        "heading": "สุขภาพคน: ผลโดยตรงและการประเมินความปลอดภัยอาหาร",
        "source": "One Health perspective of food and feed GMOs p.8-9",
        "body": [
          "ฉากที่ใช้ในหน้า 8-17: **พืช GM ที่ทนสารกำจัดวัชพืช (herbicide-tolerant, HT) และต้านแมลง (insect-resistant, Bt) ที่ขายในตลาด**",
          {
            "sub": "ผลโดยตรงต่อสุขภาพกายของผู้บริโภค (p.8)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "ประเด็น"
                  ],
                  "rows": [
                    [
                      "**Concern**: substantial equivalence",
                      "Nutrition?; Toxicity? (transgenic DNA หรือ protein อยู่รอดในอาหารจากสัตว์และในทางเดินอาหารหรือไม่, มีผลเสียที่ไม่ได้ตั้งใจหรือไม่); Allergenicity?"
                    ],
                    [
                      "**Benefit**",
                      "food security และการได้รับอาหารเพิ่มขึ้น"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Food safety assessment (p.9)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ลำดับ",
                    "การประเมิน"
                  ],
                  "rows": [
                    [
                      "1",
                      "**Molecular characterization**: การเปลี่ยนแปลงของ DNA ที่ถูกดัดแปลง"
                    ],
                    [
                      "2",
                      "**Nutritional assessments**"
                    ],
                    [
                      "3",
                      "**Toxicological assessment**"
                    ],
                    [
                      "4",
                      "**Allergenicity assessment**"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ผลเสียโดยตรงต่อสุขภาพคนจากการบริโภค **ปัจจุบันถือกันกว้างๆ ว่าน้อยมาก (negligible)**",
                  "**Consumer choice**: ฉลาก GMO ใช้กับ **GMO ตั้งแต่ 5%** ข้อความบนฉลากของ อย. คือ \"GMO คือ ผลิตภัณฑ์ที่มีส่วนผสมจากวัตถุดิบดัดแปรพันธุกรรม\""
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สุขภาพคน: ผลทางอ้อมต่อสุขภาพกายและเศรษฐกิจ",
        "source": "One Health perspective of food and feed GMOs p.10-11 (Noack et al., 2024)",
        "body": [
          {
            "sub": "ผลทางอ้อมต่อสุขภาพกาย (p.10)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "Benefit (+)",
                    "Concern (-)"
                  ],
                  "rows": [
                    [
                      "เกษตรกรปลูกพืช GM: **HT trait**",
                      "สารที่ใช้แทนอาจเป็นพิษน้อยลง",
                      "ใช้สารกำจัดวัชพืชเท่าเดิมหรือมากขึ้น (วัชพืชดื้อ HT); สารที่ใช้แทนอาจเป็นพิษมากขึ้น"
                    ],
                    [
                      "เกษตรกรปลูกพืช GM: **Bt trait**",
                      "ใช้ยาฆ่าแมลงลดลง (แมลงศัตรูเป้าหมาย)",
                      "ใช้ยาฆ่าแมลงมากขึ้น (แมลงศัตรูที่ไม่ใช่เป้าหมาย และแมลงดื้อ Bt)"
                    ],
                    [
                      "ผู้ผลิตอาหารสัตว์ เกษตรกรเลี้ยงสัตว์ และผู้บริโภค",
                      "สารตกค้างในอาหารสัตว์และอาหารคนลดลง",
                      "สารตกค้างในอาหารสัตว์และอาหารคนเพิ่มขึ้น"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ผลทางอ้อมต่อ social determinant: ความมั่นคงทางเศรษฐกิจ (p.11)",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "ผล"
                  ],
                  "rows": [
                    [
                      "เกษตรกรปลูกพืช GM",
                      "(+) ผลผลิตเพิ่มมาก ราคาพืชลดลง; (+) รายได้เพิ่ม; (-) **การผูกขาด** (ราคาเมล็ดพันธุ์และข้อจำกัดการผลิต)"
                    ],
                    [
                      "เกษตรกรปลูกพืชที่ไม่ใช่ GM",
                      "(-) รายได้ลดลง ตามราคาพืชที่ลดลง"
                    ],
                    [
                      "ผู้ผลิตอาหารสัตว์ เกษตรกรเลี้ยงสัตว์ และผู้บริโภค",
                      "(+) ต้นทุนอาหารสัตว์และอาหารคนลดลง ตามราคาพืชที่ลดลง"
                    ]
                  ]
                }
              },
              "การควบคุมผลด้านนี้: **economic politics**"
            ]
          }
        ]
      },
      {
        "heading": "สุขภาพสัตว์: อาหารสัตว์ GM",
        "source": "One Health perspective of food and feed GMOs p.12-14",
        "body": [
          {
            "bullets": [
              "**ผลโดยตรง** (p.12): concern เรื่อง substantial equivalence ชุดเดียวกับของคน คือ nutrition, toxicity (transgenic DNA หรือ protein อยู่รอดในทางเดินอาหารของสัตว์หรือไม่, ผลเสียที่ไม่ได้ตั้งใจ), allergenicity; benefit คือ **feed security**",
              "**Feed safety assessment** (p.13) ใช้ 4 ด้านเดียวกัน: molecular characterization, nutritional, toxicological, allergenicity"
            ]
          },
          {
            "sub": "ผลการประเมินอาหารสัตว์ GM (p.13)",
            "body": [
              {
                "bullets": [
                  "**ไม่มีความแตกต่าง** ของคุณค่าทางโภชนาการของอาหารสัตว์ GM",
                  "**ไม่มีหลักฐานชัดเจน** ของผลเสียโดยตรงต่อสุขภาพสัตว์จากอาหารสัตว์ GM",
                  "**ไม่มีความแตกต่าง** ของโอกาสการถ่ายทอดยีนจากอาหารสัตว์ GM",
                  "**ไม่มีรายงาน** การแพ้จากการกินอาหารสัตว์ GM"
                ]
              }
            ]
          },
          {
            "sub": "ผลทางอ้อม (p.14): อาหารสัตว์ GM ที่มี HT และ Bt traits",
            "body": [
              {
                "bullets": [
                  "สารกำจัดวัชพืชที่ใช้แทนอาจเป็นพิษมากขึ้นหรือน้อยลง",
                  "การใช้สารกำจัดศัตรูพืชเพิ่มขึ้นหรือลดลง",
                  "ทั้งสองข้อข้างบนทำให้สารตกค้างที่เป็นพิษในอาหารสัตว์เพิ่มขึ้นหรือลดลง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สุขภาพสิ่งแวดล้อม",
        "source": "One Health perspective of food and feed GMOs p.15-18 (Noack et al., 2024)",
        "body": [
          {
            "sub": "ผลผลิตกับการใช้ที่ดิน (p.16)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "พืช GM (HT และ Bt)",
                    "พืชที่ไม่ใช่ GM"
                  ],
                  "rows": [
                    [
                      "การควบคุมวัชพืชและศัตรูพืช",
                      "ได้ผล → ผลผลิตเพิ่มมาก",
                      "ไม่ได้ผล → ผลผลิตน้อยและไม่คุ้มทุน → การขยายพื้นที่เกษตรลดลง"
                    ],
                    [
                      "Benefit (+)",
                      "ถางป่าและสูญเสียความหลากหลายทางชีวภาพลดลง; ก๊าซเรือนกระจกลดลง",
                      "ถางป่าและสูญเสียความหลากหลายทางชีวภาพลดลง; ก๊าซเรือนกระจกลดลง"
                    ],
                    [
                      "Concern (-)",
                      "ถางป่าและสูญเสียความหลากหลายทางชีวภาพเพิ่มขึ้น (ปลูกพืชหมุนเวียนลดลง, transgene เคลื่อนย้ายมากขึ้น); ก๊าซเรือนกระจกเพิ่มขึ้น",
                      "สไลด์ไม่ได้ให้"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "การใช้สารเคมี (p.17)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Trait",
                    "การใช้สาร",
                    "ผล"
                  ],
                  "rows": [
                    [
                      "**HT**",
                      "สารกำจัดวัชพืช **เพิ่มขึ้น (spray drift)**",
                      "(-) มลพิษอากาศ ดิน น้ำ; (-) สูญเสียความหลากหลายทางชีวภาพมากขึ้น เป็นพิษต่อสิ่งมีชีวิตที่ไม่ใช่เป้าหมาย"
                    ],
                    [
                      "**Bt**",
                      "ยาฆ่าแมลง **ลดลง**",
                      "(+) สูญเสียความหลากหลายทางชีวภาพลดลง"
                    ],
                    [
                      "**Bt**",
                      "ยาฆ่าแมลง **เพิ่มขึ้น (spray drift)**",
                      "(-) มลพิษอากาศ ดิน น้ำ; (-) สูญเสียความหลากหลายทางชีวภาพมากขึ้น เป็นพิษต่อสิ่งมีชีวิตที่ไม่ใช่เป้าหมาย"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Environmental risk assessment: ช่องว่างความรู้ขนาดใหญ่ (p.18)",
            "body": [
              {
                "bullets": [
                  "ผลระยะยาวของพืช GM: การขยายตัวของ **monocultures**, การแพร่ของวัชพืชและศัตรูพืชที่ดื้อ, ผลต่อสิ่งมีชีวิตที่ไม่ใช่เป้าหมาย",
                  "การวัดปริมาณการถางป่าที่เกิดจากพืช GM ในระดับโลก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การป้องกันและควบคุม และสถานะในประเทศไทย",
        "source": "One Health perspective of food and feed GMOs p.19-21 (Noack et al., 2024)",
        "body": [
          {
            "sub": "Prevention and control: การใช้และการตกค้างของสารกำจัดศัตรูพืช (p.19)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ลำดับ",
                    "มาตรการ"
                  ],
                  "rows": [
                    [
                      "1",
                      "**Farm management**: refuge area, crop rotation และ diversification"
                    ],
                    [
                      "2",
                      "**Regional pesticide regulation**"
                    ],
                    [
                      "3",
                      "**Pesticide residue monitoring in feed and food**"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "พืช GM ในประเทศไทย (p.20)",
            "body": [
              {
                "bullets": [
                  "**ห้ามปลูกพืช GM เชิงพาณิชย์**",
                  "**อนุญาตนำเข้าพืช GM เป็นวัตถุดิบ** เพื่อแปรรูปอาหารหรือการผลิตต่อ",
                  "ถั่วเหลืองหรือข้าวโพด GM ที่นำเข้า **แสดงข้อความ** เช่น Genetically Modified Soybean, Genetically Modified Corn"
                ]
              }
            ]
          },
          "p.21 ปิดด้วยคำถามชวนคิด \"What do you think?\" GMO หรือ non-GMO โดยไม่มีข้อความสอนเพิ่ม"
        ]
      }
    ]
  },

  "oh-livestock-waste": {
    "topic": "oh-livestock-waste",
    "title": "Application of OH approach for livestock waste management",
    "lecturer": "Sirawit Pagdepanichkit",
    "icon": "🚜",
    "summary": "การจัดการของเสียจากฟาร์มปศุสัตว์ในมุม One Health จากเด็ค One Health Approach for Livestock Waste Management ฉบับปี 2569 (56 หน้า) ได้แก่ ของเสียและปัญหาที่เกิด, หลัก 3 ประการ reduce, reuse, treatment, กระบวนการบำบัดทางกายภาพ เคมี และชีวภาพ, ระบบบ่อบำบัด 4 บ่อ, ระบบก๊าซชีวภาพ 3 แบบ, การเลือกระบบ และมาตรฐานน้ำทิ้งจากฟาร์มสุกร",
    "sections": [
      {
        "heading": "One Health กับการจัดการของเสีย",
        "source": "One Health Approach for Livestock Waste Management (2569) p.2-3",
        "body": [
          {
            "sub": "มุมมอง One Health (p.2)",
            "body": [
              {
                "bullets": [
                  "แนวทาง **transdisciplinary** ที่พิจารณาสุขภาพคน สัตว์ และสิ่งแวดล้อม ซึ่งเกี่ยวกับการจัดการของเสียและน้ำ",
                  "กิจกรรมของมนุษย์ทำให้น้ำปนเปื้อนสิ่งปนเปื้อนทางชีวภาพ เคมี และกายภาพมากขึ้น",
                  "แหล่งปนเปื้อน: **pathogens** จากการปนเปื้อนมูลปศุสัตว์, **agrochemicals** จากเกษตรแบบเข้มข้น, **sediments** จากการกัดเซาะดิน, **microplastics** จากกิจกรรมของมนุษย์หลากหลาย"
                ]
              }
            ]
          },
          {
            "sub": "Integrated One Health approach ต่อการปนเปื้อนของเสียและน้ำ (p.3)",
            "body": [
              {
                "bullets": [
                  "เคารพแนวปฏิบัติทางสังคมและวัฒนธรรม",
                  "ปรับปรุงการจัดการที่ดิน",
                  "ปรับปรุงโครงสร้างพื้นฐานการจัดการของเสียและน้ำ",
                  "ปรับปรุงแนวปฏิบัติทางการเกษตร",
                  "ป้องกันผ่านระบบการจัดการสิ่งแวดล้อม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ของเสียจากฟาร์มปศุสัตว์และปัญหาที่ตามมา",
        "source": "One Health Approach for Livestock Waste Management (2569) p.4-5, 8-9",
        "body": [
          "**ของเสียจากฟาร์มปศุสัตว์** = ของเหลือทิ้งจากกระบวนการเลี้ยงสัตว์ ซึ่งนำกลับมาใช้อีกไม่ได้หากไม่ผ่านการบำบัด (p.4)",
          {
            "table": {
              "headers": [
                "ชนิด",
                "ตัวอย่าง (p.4)"
              ],
              "rows": [
                [
                  "**ของแข็ง** (solid waste/manure)",
                  "มูลสัตว์, ซากสัตว์, เศษอาหาร, ขยะมูลฝอย, ชิ้นส่วนอุปกรณ์ที่ชำรุด"
                ],
                [
                  "**ของเหลว** (liquid waste/manure)",
                  "น้ำปัสสาวะ, น้ำล้างคอก, น้ำล้างโรงเรือนหรือตัวสัตว์, น้ำทิ้งจากกิจกรรมในฟาร์ม"
                ]
              ]
            }
          },
          {
            "sub": "แหล่งกำเนิดของเสียและน้ำเสียในฟาร์ม (p.8)",
            "body": [
              {
                "bullets": [
                  "**ของเสีย**: วัสดุรองพื้นคอก, เศษอาหารหรือขยะ, มูลหรือซากสัตว์",
                  "**น้ำเสีย**: น้ำฝน, น้ำกินหรือน้ำใช้, น้ำทำความสะอาดโรงเรือนหรือตัวสัตว์, ปัสสาวะหรือน้ำจากมูลสัตว์",
                  "ภาพตัวอย่างแหล่งกำเนิดของเสียและน้ำเสีย (p.9): ขวดยาและวัคซีนใช้แล้ว, การฉีดน้ำล้างตัวสุกรในคอก, กระสอบวัสดุรองพื้นในโรงเรือนสัตว์ปีก, ซากสัตว์ปีกที่เก็บลงถุง, วัสดุรองพื้นคอกที่ใช้แล้ว"
                ]
              }
            ]
          },
          {
            "sub": "ปัญหาที่เกิดจากของเสีย (p.5)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ปัญหา",
                    "รายละเอียด"
                  ],
                  "rows": [
                    [
                      "**แหล่งสะสมเชื้อโรคและพาหะนำโรค**",
                      "เชื้อโรคปนเปื้อนมากับสิ่งขับถ่ายหรือซากสัตว์; เศษอาหาร มูล และซากเป็นอาหารของสัตว์พาหะ"
                    ],
                    [
                      "**มลพิษต่อสิ่งแวดล้อม**",
                      "ดิน น้ำ อากาศ"
                    ],
                    [
                      "**ผลกระทบด้านสังคมและสาธารณสุข**",
                      "ความขัดแย้ง และปัญหาสุขภาพของคนที่อยู่ใกล้เคียง"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "หลัก 3 ประการ และการลดปริมาณของเสีย (reduce)",
        "source": "One Health Approach for Livestock Waste Management (2569) p.6-7, 10-19",
        "body": [
          {
            "table": {
              "headers": [
                "หลักการ (p.6)",
                "ความหมาย"
              ],
              "rows": [
                [
                  "**Reduce** การลดปริมาณของเสีย",
                  "ลดของเสียจาก **แหล่งกำเนิด**"
                ],
                [
                  "**Reuse** การนำของเสียไปใช้ประโยชน์",
                  "ใช้เป็นอาหารสัตว์ ปุ๋ยอินทรีย์ แหล่งพลังงาน"
                ],
                [
                  "**Treatment** การบำบัดหรือจัดการของเสีย",
                  "บำบัดน้ำเสีย ทำลายขยะหรือของแข็ง"
                ]
              ]
            }
          },
          {
            "sub": "Reduce (p.7)",
            "body": [
              {
                "bullets": [
                  "ลดของเสียจากแหล่งกำเนิด, เพิ่มประสิทธิภาพการผลิต, พัฒนาวิธีจัดการฟาร์ม",
                  "กระบวนการลดการเกิดของเสีย: **ทำให้สัตว์ขับถ่ายลดลง**, ลดอัตราตาย, เพิ่มอัตราการเปลี่ยนอาหารเป็นเนื้อ (FCR), ใช้ทรัพยากรและพลังงานอย่างมีประสิทธิภาพ"
                ]
              }
            ]
          },
          {
            "sub": "การลดปริมาณของเสียภายในฟาร์ม 6 ด้าน (p.10)",
            "body": [
              "พันธุ์สัตว์, อาหารสัตว์, โรงเรือน, สุขาภิบาล, สุขภาพสัตว์, ทรัพยากรและพลังงาน"
            ]
          },
          {
            "sub": "การจัดการโรงเรือน (p.11-16)",
            "body": [
              {
                "bullets": [
                  "การวางผังฟาร์มและโรงเรือน; การจัดพื้นที่และประเภทโรงเรือน",
                  "ความเหมาะสมในการออกแบบโรงเรือนกับชนิดและจำนวนสัตว์และการสุขาภิบาล",
                  "การล้างทำความสะอาดคอก โรงเรือน และตัวสัตว์: วิธีการและความถี่",
                  "p.12-16 เป็นภาพประกอบ (การจัดการโรงเรือน, การวางผังฟาร์ม, การวางผังในโรงเรือน, การเก็บกวาดมูลปศุสัตว์)"
                ]
              }
            ]
          },
          {
            "sub": "ส้วมน้ำในฟาร์มสุกร (p.17-18)",
            "body": [
              {
                "bullets": [
                  "สุกรชอบนอนแช่น้ำหรือที่ชื้นเพื่อลดความร้อน จึง **สร้างส้วมน้ำในตำแหน่งที่ทำความสะอาดง่าย** ใช้เป็นที่รวบรวมของเสียในคอก",
                  "ประโยชน์: ปรับสภาพแวดล้อมในโรงเรือน, **ลดกลิ่น** จากการหมักของจุลินทรีย์, เพิ่มประสิทธิภาพการกินอาหารและการเจริญเติบโต, ลดการใช้น้ำ แรงงาน และเวลาทำความสะอาด"
                ]
              }
            ]
          },
          {
            "sub": "ประโยชน์ของการลดปริมาณของเสีย (p.19)",
            "body": [
              {
                "bullets": [
                  "ลดต้นทุนการกำจัดและบำบัดของเสีย",
                  "ลดต้นทุนการผลิต เพิ่มกำไร",
                  "ส่งเสริมสุขภาพสัตว์ในฟาร์ม",
                  "อนุรักษ์สิ่งแวดล้อมและพลังงาน",
                  "สร้างภาพลักษณ์ที่ดีของฟาร์ม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การนำของเสียไปใช้ประโยชน์ (reuse)",
        "source": "One Health Approach for Livestock Waste Management (2569) p.20-25",
        "body": [
          {
            "bullets": [
              "ใช้ได้ 3 ทาง: **อาหารสัตว์, ปุ๋ยอินทรีย์, แหล่งพลังงาน** (p.20)",
              "วัตถุประสงค์: ลดค่าใช้จ่ายในการกำจัดของเสีย, ลดผลกระทบต่อสิ่งแวดล้อม, สร้างรายได้ให้ฟาร์ม (p.20)"
            ]
          },
          {
            "table": {
              "headers": [
                "การใช้ประโยชน์",
                "สาระ"
              ],
              "rows": [
                [
                  "**มูลสัตว์ทำปุ๋ย** (p.21)",
                  "ปุ๋ยอินทรีย์ ปุ๋ยหมัก ปุ๋ยชีวภาพ; มีแร่ธาตุหลัก **N, P, K** และแร่ธาตุรอง Ca, Mg, Mn, Cu, Fe, Zn; มี **ฮิวมัส (humus)** ช่วยปรับปรุงคุณภาพดิน"
                ],
                [
                  "**อาหารเลี้ยงสัตว์** (p.22)",
                  "ภาพโรงเรือนสัตว์ปีกสร้างยกพื้นเหนือบ่อน้ำ และไก่ไข่ในกรงบนพื้นยกสูง ไม่มีข้อความเพิ่ม"
                ],
                [
                  "**ก๊าซชีวภาพ** (p.23-24)",
                  "ผลิตไฟฟ้า, เชื้อเพลิงเครื่องยนต์, หุงต้ม อบผลผลิตการเกษตร กกลูกหมู"
                ],
                [
                  "**ซากสัตว์: rendering** (p.25)",
                  "ตัดซากเป็นชิ้นเล็ก ผ่านความร้อน **มากกว่า 120°C** แล้วบดละเอียด ใช้เป็นวัตถุดิบผสมอาหารสัตว์"
                ]
              ]
            }
          }
        ]
      },
      {
        "heading": "การบำบัด (treatment): ขั้นตอนและกระบวนการ 3 ประเภท",
        "source": "One Health Approach for Livestock Waste Management (2569) p.26-32",
        "body": [
          {
            "bullets": [
              "Treatment = กระบวนการกำจัดหรือย่อยสลายสารอินทรีย์ในน้ำเสียหรือของเสีย **ก่อนปล่อยออกสู่สิ่งแวดล้อม** (p.26)",
              "ขั้นตอน: preliminary treatment (ขั้นเตรียมการ) → primary (ขั้นต้น) → secondary (ขั้นที่สอง) → tertiary (ขั้นที่สาม) (p.26)"
            ]
          },
          {
            "table": {
              "headers": [
                "ประเภท (p.27)",
                "วิธี"
              ],
              "rows": [
                [
                  "**Physical processes** (p.28)",
                  "screening (กรองด้วยตะแกรง), skimming (เก็บกวาด), floatation (ทำให้ลอยตัว), **sedimentation (ตกตะกอน)**"
                ],
                [
                  "**Chemical processes** (p.30)",
                  "**precipitation (ทำให้เกิดตะกอน)**, neutralization (ทำให้เป็นกลาง), sterilization (ฆ่าเชื้อด้วยสารเคมี)"
                ],
                [
                  "**Biological processes** (p.31): aerobic",
                  "ponding system (ระบบบ่อบำบัด), activated sludge (ตะกอนเร่ง, AS), trickling filters (โปรยกรอง)"
                ],
                [
                  "**Biological processes** (p.31): anaerobic",
                  "biogas system (ระบบก๊าซชีวภาพ), anaerobic filter (ถังกรองไร้อากาศ)"
                ]
              ]
            }
          },
          {
            "callout": "Sedimentation (การตกตะกอน) เป็นกระบวนการ **ทางกายภาพ** ส่วน precipitation (การทำให้เกิดตะกอน) เป็นกระบวนการ **ทางเคมี** ชื่อไทยคล้ายกัน",
            "kind": "warn"
          },
          {
            "sub": "ปฏิกิริยาของจุลินทรีย์ในระบบบำบัด (p.32)",
            "body": [
              {
                "table": {
                  "headers": [
                    "แบบ",
                    "ปฏิกิริยา"
                  ],
                  "rows": [
                    [
                      "**ใช้อากาศ**",
                      "Bacteria + COHNS + O2 → new cell + sludge + CO2 + H2O + NH3 + ∆E"
                    ],
                    [
                      "**ไม่ใช้อากาศ**",
                      "Bacteria + COHNS → new cell + H2O + **CH4** + N2 + H2S + CO2 + ∆E"
                    ],
                    [
                      "**กึ่งใช้อากาศ**",
                      "Bacteria + COHNS + NO3- + O2 → H2O + N2 + H2S + CO2 + ∆E"
                    ]
                  ]
                }
              }
            ]
          },
          "p.29 เป็นแผนภาพระบบอบแห้งมูลสัตว์เป็นปุ๋ยเม็ด (Modified from Vulcan drying systems): แยกเศษปนด้วยตะแกรงหมุน (trommel), อบในเตาหมุน (rotary dryer), คัดขนาดเม็ด และดักแอมโมเนียเป็นแอมโมเนียมซัลเฟตใช้เป็นปุ๋ยน้ำ"
        ]
      },
      {
        "heading": "ระบบบ่อบำบัด (ponding system)",
        "source": "One Health Approach for Livestock Waste Management (2569) p.33-40",
        "body": [
          {
            "bullets": [
              "ปรับสภาพแต่ละบ่อให้เหมาะกับจุลินทรีย์ทั้งแบบใช้และไม่ใช้อากาศ (p.33)",
              "**ก่อสร้างและบำรุงรักษาง่าย ค่าใช้จ่ายน้อยกว่า** (p.33)",
              "**ต้องแยกมูลและตกตะกอนก่อน** เพื่อลด organic loading (p.33)",
              "เป็นบ่อรองรับน้ำเสีย **3-4 บ่อต่อเนื่องกัน** (p.34)"
            ]
          },
          {
            "table": {
              "headers": [
                "บ่อ",
                "สาระ"
              ],
              "rows": [
                [
                  "**บ่อหมัก, บ่อเหม็น (anaerobic pond)** (p.35)",
                  "บำบัดน้ำเสียที่มีสารอินทรีย์เข้มข้นสูง; ประสิทธิภาพขึ้นกับจุลินทรีย์ไม่ใช้อากาศ; ปล่อยน้ำเสียเข้าที่ก้นบ่อแล้วไหลตามความยาวบ่อ; ลึก 3-5 m; anaerobic digestion ได้ CH4 + H2S + CO2"
                ],
                [
                  "**บ่อหมักผสม (facultative pond)** (p.36)",
                  "จุลินทรีย์ 3 ชั้น: ก้นบ่อ (ลึกจากผิวน้ำ >1 m) สารอินทรีย์สูง ย่อยแบบไม่ใช้อากาศ; ชั้นกลาง (0.5-1 m) จุลินทรีย์ได้ทั้งสองแบบ; ชั้นบน (<0.5 m) พืชน้ำและสาหร่ายสังเคราะห์แสงเพิ่ม O2 ย่อยแบบใช้อากาศ"
                ],
                [
                  "**บ่อผึ่ง, บ่อใช้อากาศ (aerobic pond)** (p.37)",
                  "ต้องมี dissolved oxygen (DO) ทั่วทั้งบ่อ; สาหร่ายและแพลงก์ตอนพืชช่วยบำบัดและเพิ่ม O2; ลึก 1-2 m"
                ],
                [
                  "**บ่อปรับเสถียร, บ่อคงตัว (stabilization pond)** (p.39)",
                  "พักน้ำที่บำบัดแล้วก่อนปล่อยทิ้งหรือนำกลับมาใช้; ปรับสารเคมีที่เหลือและคุณภาพน้ำ; มีพืชน้ำเติม O2 แต่ไม่มากจนน้ำเน่า; **เลี้ยงปลากินพืช** ช่วยคุมสาหร่ายและสารอินทรีย์"
                ]
              ]
            }
          },
          "ลำดับบ่อในภาพ p.39: anaerobic pond → facultative pond → maturation ponds in series → แหล่งรับน้ำหรือนำกลับมาใช้ (receiving body or reuse)",
          {
            "sub": "คุณลักษณะบ่อบำบัด (p.38)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ลักษณะ",
                    "บ่อหมัก",
                    "บ่อหมักผสม",
                    "บ่อผึ่ง",
                    "หน่วย"
                  ],
                  "rows": [
                    [
                      "อัตรารับสารอินทรีย์",
                      "200-800",
                      "35",
                      "45",
                      "BOD5/m3-day"
                    ],
                    [
                      "ความลึก",
                      ">3.0",
                      "<2.5",
                      "1.0-2.0",
                      "m"
                    ],
                    [
                      "เวลากักเก็บ",
                      ">30",
                      ">15",
                      ">15",
                      "day"
                    ],
                    [
                      "pH",
                      "6.8-7.2",
                      "6.5-9.0",
                      "6.5-10.5",
                      ""
                    ],
                    [
                      "อุณหภูมิ",
                      "30-35",
                      "25-35",
                      "20-30",
                      "°C"
                    ],
                    [
                      "ประสิทธิภาพ",
                      "50-60",
                      "75-90",
                      "80-95",
                      "%"
                    ]
                  ]
                }
              },
              "p.40 เป็นภาพบ่อบำบัดต่อเนื่องกัน 4 บ่อ (Modified from องค์การจัดการน้ำเสีย, 2559)"
            ]
          }
        ]
      },
      {
        "heading": "ระบบก๊าซชีวภาพ (biogas system)",
        "source": "One Health Approach for Livestock Waste Management (2569) p.33, 41-49, 51",
        "body": [
          {
            "bullets": [
              "อาศัย **จุลินทรีย์แบบไม่ใช้อากาศ** เป็นหลัก; ขนาดใหญ่ ใช้เวลาย่อยสลายสารอินทรีย์นาน (p.33)",
              "**ออกแบบเพื่อผลิตพลังงานทดแทนมากกว่าเพื่อบำบัด** (p.33, 41)",
              "น้ำที่ผ่านระบบ **ยังมีสารอินทรีย์มาก ต้องบำบัดขั้นหลังเพิ่ม** (p.41)",
              "บ่อบำบัดขั้นหลัง (p.49): UASB reactor → polishing ponds → แหล่งรับน้ำ (receiving body); บ่อคลุม → digester effluent → บ่อ post treatment"
            ]
          },
          {
            "table": {
              "headers": [
                "",
                "โดมคงที่ (fixed dome digester) p.42",
                "ยูเอเอสบี (UASB) p.44",
                "บ่อคลุม (covered lagoon, CIGAR) p.46"
              ],
              "rows": [
                [
                  "ประสิทธิภาพบำบัดน้ำเสีย",
                  "**ต่ำ 50-65%**",
                  "ปานกลาง 60-70%",
                  "ปานกลาง **70-80%**"
                ],
                [
                  "จุดเด่น",
                  "เหมาะ **ฟาร์มเล็กถึงกลาง**; ได้ CH4 ความดันสูง (~2 bar)",
                  "รับสารอินทรีย์จำนวนมากได้; ต้องออกแบบให้ทางน้ำเข้าและออกอยู่ห่างกันเพื่อให้กักเก็บได้สมบูรณ์",
                  "รับสารอินทรีย์ได้ **มากกว่าระบบอื่น**; **ไม่ได้กากตะกอน**"
                ],
                [
                  "ระยะกักเก็บ",
                  "**สั้น ~15-20 วัน**",
                  "ไม่ระบุ",
                  "**นาน >120 วัน**"
                ]
              ]
            }
          },
          "ชื่อเต็มของ UASB = Upflow Anaerobic Sludge Blanket reactor; CIGAR = Covered In-Ground Anaerobic Reactor (p.41) หน้า UASB (p.44) ยังระบุระบบก๊าซชีวภาพแบบราง หรือพลาสติกคลุมราง (anaerobic channel digestion)",
          {
            "sub": "กระบวนการย่อยสลายแบบไม่ใช้อากาศ (anaerobic digestion process, p.51)",
            "body": [
              "วัตถุดิบ slurry (มูลสัตว์), พืชพลังงาน (energy crops) และเศษอาหาร (food waste) เข้าสู่ anaerobic digester แล้วได้ผล 2 ทาง",
              {
                "bullets": [
                  "กากหมัก (digestate) → digestate storage → ใช้เป็นปุ๋ยแก่พืช (fertilized crops)",
                  "ก๊าซชีวภาพ (biogas) → CHP unit (ผลิตไฟฟ้าและความร้อนร่วมกัน) → ไฟฟ้าและความร้อน"
                ]
              }
            ]
          },
          {
            "sub": "เปรียบเทียบระบบก๊าซชีวภาพ (p.48)",
            "body": [
              {
                "table": {
                  "headers": [
                    "รายการ",
                    "โดมคงที่",
                    "ยูเอเอสบี",
                    "บ่อคลุม"
                  ],
                  "rows": [
                    [
                      "ค่าก่อสร้าง",
                      "ปานกลาง",
                      "สูง",
                      "ต่ำ"
                    ],
                    [
                      "พื้นที่ก่อสร้าง",
                      "น้อย",
                      "ปานกลางถึงมาก",
                      "มาก"
                    ],
                    [
                      "การบำรุงรักษา",
                      "ปานกลาง",
                      "ยาก",
                      "ง่าย"
                    ],
                    [
                      "การผลิตก๊าซชีวภาพ",
                      "ปานกลาง",
                      "สูงมาก",
                      "สูง"
                    ],
                    [
                      "คุณภาพน้ำทิ้ง",
                      "ไม่ผ่าน",
                      "ไม่ผ่าน",
                      "ขึ้นกับขนาด"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "ส่วนประกอบในภาพ (p.43, 45, 47)",
            "body": [
              {
                "bullets": [
                  "Fixed dome: waste เข้า, gas collector แบบ fixed dome, ท่อ biogas, automatic overflow, slurry, sludge outlet",
                  "UASB (p.45): แผนภาพบ่อหรือรางยาวคลุมพลาสติก มีลูกศรแสดงทิศทางการไหลตามความยาว และภาพถ่ายบ่อคลุมพลาสติก 2 ภาพ ไม่มีข้อความพิมพ์บนภาพ",
                  "Covered lagoon: digester influent เข้า, cover เป็น biogas storage, digester effluent ออก, influent และ effluent structure"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เลือกระบบบำบัด และมาตรฐานน้ำทิ้งฟาร์มสุกร",
        "source": "One Health Approach for Livestock Waste Management (2569) p.50, 52-55",
        "body": [
          {
            "sub": "บ่อบำบัดเทียบก๊าซชีวภาพ (p.50)",
            "body": [
              {
                "table": {
                  "headers": [
                    "รายการ",
                    "ระบบบ่อบำบัด",
                    "ระบบก๊าซชีวภาพ"
                  ],
                  "rows": [
                    [
                      "ค่าก่อสร้าง",
                      "ต่ำ",
                      "สูง"
                    ],
                    [
                      "พื้นที่ก่อสร้าง",
                      "มาก",
                      "น้อย (หมายเหตุ 1)"
                    ],
                    [
                      "การบำรุงรักษา",
                      "ง่าย",
                      "ยาก"
                    ],
                    [
                      "ผลตอบแทน",
                      "ปานกลาง",
                      "สูง (หมายเหตุ 2)"
                    ],
                    [
                      "คุณภาพน้ำทิ้ง",
                      "ผ่าน",
                      "ไม่ผ่าน (หมายเหตุ 1)"
                    ]
                  ]
                }
              },
              "หมายเหตุ 1: ตัวระบบใช้พื้นที่น้อย แต่ต้องมีพื้นที่สำหรับบำบัดขั้นหลัง เพราะน้ำทิ้งจากระบบก๊าซชีวภาพไม่ผ่านเกณฑ์มาตรฐาน; หมายเหตุ 2: ผลตอบแทนสูงถ้านำก๊าซชีวภาพมาใช้ได้ทั้งหมด"
            ]
          },
          {
            "sub": "หลักเกณฑ์การเลือกและออกแบบระบบบำบัด (p.52-53)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ปัจจัยภายใน (p.52)",
                    "ปัจจัยภายนอก (p.53)"
                  ],
                  "rows": [
                    [
                      "ชนิดและจำนวนสัตว์ในฟาร์ม",
                      "เทคโนโลยีที่มีอยู่ขณะสร้างระบบ"
                    ],
                    [
                      "ภูมิศาสตร์และขนาดพื้นที่ฟาร์ม",
                      "ความยุ่งยากในการควบคุมดูแลและบำรุงรักษา"
                    ],
                    [
                      "ความต้องการคุณภาพน้ำหลังบำบัด",
                      "การยอมรับของชุมชนรอบฟาร์ม"
                    ],
                    [
                      "แผนใช้ประโยชน์จากผลผลิตของระบบ",
                      "กฎหมาย ระเบียบ ข้อบังคับ และแนวปฏิบัติด้านสิ่งแวดล้อม"
                    ],
                    [
                      "งบประมาณ ค่าดำเนินการ และค่าบำรุงรักษา",
                      ""
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "มาตรฐานควบคุมการระบายน้ำทิ้งจากฟาร์มเลี้ยงสุกร (p.54, ประกาศกระทรวงทรัพยากรธรรมชาติฯ)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ประเภท",
                    "น้ำหนักหน่วยปศุสัตว์ตามประกาศ",
                    "เทียบเท่าสุกรขุน (ตัว)"
                  ],
                  "rows": [
                    [
                      "ก",
                      ">600 หน่วย",
                      ">5,000"
                    ],
                    [
                      "ข",
                      "60-600 หน่วย",
                      "500-5,000"
                    ],
                    [
                      "ค",
                      "6-60 หน่วย",
                      "50-500"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "พารามิเตอร์",
                    "ประเภท ก",
                    "ประเภท ข และ ค",
                    "หน่วย"
                  ],
                  "rows": [
                    [
                      "pH",
                      "5.5-9",
                      "5.5-9",
                      ""
                    ],
                    [
                      "BOD",
                      "≤60",
                      "≤100",
                      "mg/L"
                    ],
                    [
                      "SS (suspended solids)",
                      "≤150",
                      "≤200",
                      "mg/L"
                    ],
                    [
                      "COD",
                      "≤300",
                      "≤400",
                      "mg/L"
                    ],
                    [
                      "TKN (total Kjeldahl nitrogen)",
                      "≤120",
                      "≤200",
                      "mg/L"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "กระบวนการกำจัดของเสียจากฟาร์ม (p.55)",
            "body": [
              {
                "bullets": [
                  "ฟาร์ม → เก็บกวาดมูลสัตว์ → **มูลสด** → ใช้เลี้ยงสัตว์ หรือ ตากแห้ง → เลี้ยงสัตว์หรือทำปุ๋ยอินทรีย์",
                  "เก็บกวาดมูลแล้ว ล้างพื้นคอก → **มูลกับน้ำสกปรก** (รวมมูลสดบางส่วน) → ผ่านระบบบำบัด หรือ ผลิตก๊าซชีวภาพ",
                  "ผลิตก๊าซชีวภาพ → ส่งต่อเข้าระบบบำบัด และใช้ทำปุ๋ยอินทรีย์",
                  "ผ่านระบบบำบัด → ปล่อยทิ้ง หรือ นำไปใช้ประโยชน์อื่น เช่น กลับมาเป็นน้ำล้างพื้นคอก"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  "oh-import-risk": {
    "topic": "oh-import-risk",
    "title": "Import risk assessment: กุ้งและผลิตภัณฑ์กุ้ง",
    "lecturer": "Suphachai Nuanualsuwan",
    "icon": "🚢",
    "summary": "การประเมินความเสี่ยงการนำเข้าตามกรอบ WOAH (entry, exposure, consequence, risk estimation) สอนผ่านตัวอย่าง WSSV ในกุ้งนำเข้าเพื่อการบริโภคของออสเตรเลีย จากเด็ค Import Risk Assessment for Prawn and Prawn Products, เอกสารประกอบการอ่าน 4 หน้า และบันทึกคาบ 7 ต.ค. 2569 รายงานนี้ประเมินเชิงคุณภาพทั้งหมด จึงรวมระดับ likelihood กับ impact ด้วย matrix ไม่ใช่ด้วยการคำนวณ",
    "sections": [
      {
        "heading": "Import risk คืออะไร และกรอบ WOAH",
        "source": "Import Risk Assessment (Present) p.5-8; Import Risk Assessment (Reading Material) p.1; คลิป hLl7taXYRWQ [29:26-38:13, 41:04-42:29]",
        "body": [
          {
            "bullets": [
              "**Import risk** = ความเสี่ยงของ **ประเทศผู้นำเข้า** ที่โรคจะติดมากับสัตว์มีชีวิตหรือผลิตภัณฑ์สัตว์ที่ค้าขายระหว่างประเทศ ประเด็นหลักจึงอยู่ที่การค้าระหว่างประเทศ (WTO) (คลิป 30:51-32:37)",
              "เชื้อตัวเดียวมองได้ทั้งในมุม food risk (สุขภาพคน) และ import risk (สุขภาพสัตว์) เช่น zoonoses อย่าง Salmonella หรือ avian influenza (คลิป 29:57-30:51)",
              "องค์กรที่ดูแลกรอบ food risk analysis คือ **Codex Alimentarius Commission (CAC)** ส่วนกรอบสุขภาพสัตว์คือ **WOAH** (คลิป 33:08-33:40)"
            ]
          },
          {
            "sub": "WOAH risk analysis (Aquatic Animal Health Code 2019, p.5-6)",
            "body": [
              {
                "bullets": [
                  "มี 4 ส่วน: **hazard identification**, **risk assessment**, **risk management**, **risk communication**",
                  "WOAH แยก hazard identification ออกมาทำก่อน ถ้าประเทศส่งออกไม่มีอันตรายที่ก่อ consequence ในประเทศนำเข้าได้ ก็ไม่ต้องประเมินต่อ (คลิป 33:40-34:33)",
                  "Risk assessment: entry, exposure, consequence assessment และ risk estimation",
                  "Risk management: risk evaluation, option evaluation, implementation, monitoring and review",
                  "งานที่ใช้ประกอบการประเมิน (evaluation of): Competent Authority, zoning and regionalisation, surveillance and monitoring of aquatic animal health"
                ]
              }
            ]
          },
          {
            "sub": "นิยามและ 4 ขั้นของ risk assessment (Reading Material p.1, Import p.7)",
            "body": [
              "ตามนิยามของ WOAH การประเมินความเสี่ยงคือการประเมิน **โอกาส** และ **ผลกระทบเชิงชีวภาพ (biological consequence) และเศรษฐศาสตร์ (economic consequence)** ของการผ่านเข้า (entry), การก่อตัว (establish) หรือการแพร่ (spread) ของอันตรายในสินค้า (commodity) จากประเทศผู้ส่งออกเข้าสู่ประเทศผู้นำเข้า",
              {
                "table": {
                  "headers": [
                    "ขั้น",
                    "ชื่อ",
                    "เกิดที่"
                  ],
                  "rows": [
                    [
                      "1",
                      "**Entry assessment** (การประเมินการนำเข้า)",
                      "ประเทศผู้ส่งออก จนถึงพรมแดนประเทศนำเข้า"
                    ],
                    [
                      "2",
                      "**Exposure assessment** (การประเมินการสัมผัส)",
                      "ประเทศผู้นำเข้า: สินค้าถึงสัตว์ที่ไวต่อโรค"
                    ],
                    [
                      "3",
                      "**Consequence assessment** (การประเมินผลกระทบ)",
                      "ประเทศผู้นำเข้า: establish และ spread"
                    ],
                    [
                      "4",
                      "**Risk estimation** (การประมาณความเสี่ยง)",
                      "รวม 3 ขั้นแรกตลอดเส้นทาง"
                    ]
                  ]
                }
              },
              "เส้นทางตาม p.8: exporting country → importing country border → importing country → exposure susceptible animals → establish and spread",
              "Entry assessment เดิมเรียก **release assessment** (release ออกจากประเทศผู้ส่งออก) จึงยังเห็นตัวย่อ **LR** (likelihood of release) ใช้กับค่าของ entry (คลิป 37:46-38:39)",
              "ความเสี่ยง (risk) คือผลรวมของ **โอกาส (likelihood)** กับ **ผลกระทบ (consequence หรือ impact)** ของอันตรายในการนำเข้าสินค้า (Reading Material p.1)"
            ]
          },
          {
            "callout": "แยกขั้นจากสถานที่ของเหตุการณ์ (คลิป 41:04-42:29): เหตุการณ์ในประเทศส่งออกเป็น **entry**; สัตว์ในประเทศนำเข้ามาพบอันตราย เช่น วัวกินฟางนำเข้าที่อาจมีเชื้อ เป็น **exposure**; การระบาด สัตว์ป่วยตาย เป็น **consequence**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Entry assessment และ exposure assessment",
        "source": "Import Risk Assessment (Present) p.9-10; Import Risk Assessment (Reading Material) p.1-2; คลิป hLl7taXYRWQ [35:29-40:35]",
        "body": [
          {
            "table": {
              "headers": [
                "",
                "Entry assessment (p.9)",
                "Exposure assessment (p.10)"
              ],
              "rows": [
                [
                  "Objective",
                  "Likelihood ที่เชื้อ **ยังมีชีวิตและติดเชื้อได้ (viable and infective)** อยู่ในผลิตภัณฑ์กุ้งที่นำเข้า",
                  "Likelihood ที่ **exposure groups** จะพบเชื้อผ่าน pathway"
                ],
                [
                  "Procedure 1",
                  "ตรวจ biological pathway(s) ในประเทศผู้ส่งออก",
                  "ตรวจ biological pathway(s) ในประเทศผู้นำเข้า ตั้งแต่ port of entry ถึง final end-use"
                ],
                [
                  "Procedure 2",
                  "ประมาณ probability ของ pathway นั้น",
                  "ประมาณ probability ของ pathway นั้น"
                ]
              ]
            }
          },
          {
            "sub": "ปัจจัยที่ใช้ใน entry assessment (Reading Material p.1-2)",
            "body": [
              {
                "bullets": [
                  "**Biological factor**: ชนิดหรือ strain หรือ genotype ของสัตว์, ชนิดไวรัส, เนื้อเยื่อเป้าหมาย, การปนเปื้อน, การทำวัคซีน, การทดสอบ, การรักษา และการกักสัตว์",
                  "**Country factor**: ความชุก, การประเมิน Competent Authority, โปรแกรมควบคุมและเฝ้าระวังโรค, zoning ของประเทศส่งออก",
                  "**Commodity factor**: สัตว์หรือผลิตภัณฑ์สัตว์, ปริมาณการค้า (volume of trade), การปนเปื้อน, ผลของการแปรรูป (processing module) และของการเก็บรักษาและขนส่งต่ออันตรายในสินค้า",
                  "Entry assessment เป็นหน้าที่ของประเทศส่งออกที่ต้องแจ้งประเทศนำเข้าว่าสินค้ามีโอกาสมีอันตรายมากน้อยเพียงใด"
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยที่ใช้ใน exposure assessment (Reading Material p.2)",
            "body": [
              {
                "bullets": [
                  "ประเมินโอกาสที่สัตว์และคนในประเทศนำเข้าจะสัมผัสอันตรายจาก risk source ได้ทั้ง **เชิงคุณภาพ (ตัวอักษร)** และ **เชิงปริมาณ (ตัวเลข)**",
                  "ต้องคำนึงถึงปริมาณ, เวลา, ความถี่, ระยะเวลาการสัมผัส, route of exposure (กิน, หายใจ, แมลงกัด) และชนิด จำนวน ลักษณะของประชากรที่สัมผัส",
                  "**Biological factors**: คุณสมบัติของอันตรายหรือสาเหตุโรค",
                  "**Country factors**: vector, demographic ของสัตว์และคน, วัฒนธรรม, ภูมิศาสตร์และสิ่งแวดล้อม",
                  "**Commodity factors**: ปริมาณสินค้า, การใช้ตามวัตถุประสงค์, วิธีกำจัดเศษเหลือ (disposal practices)"
                ]
              }
            ]
          },
          {
            "callout": "ถ้า entry assessment หรือ exposure assessment แสดงว่า **ไม่มีความเสี่ยงที่มีนัยสำคัญ** การประเมินความเสี่ยงอาจสรุปจบได้ที่ขั้นนั้น (Reading Material p.2)",
            "kind": "tip"
          },
          "Exposure assessment คือจังหวะที่อันตรายจาก entry มาพบ host ในประเทศนำเข้า ประเทศนำเข้าจึงต้องรู้ว่าตนมี host ใดที่ไวต่ออันตรายนั้น การอ้างอันตรายที่ไม่มี host ให้เสียหายในประเทศตนไม่สมเหตุสมผลและกลายเป็นการกีดกันทางการค้า (คลิป 38:39-40:07)"
        ]
      },
      {
        "heading": "Likelihood เชิงคุณภาพ และ matrix ที่ใช้รวมค่า",
        "source": "Import Risk Assessment (Present) p.11, 17, 20; คลิป hLl7taXYRWQ [47:11-49:08, 55:12-57:52]",
        "body": [
          {
            "bullets": [
              "รายงานของออสเตรเลียเป็นการประเมินความเสี่ยง **เชิงคุณภาพ (qualitative)** ไม่ใช่เชิงปริมาณ (คลิป 47:42)",
              "Likelihood 6 ระดับ: **High, Moderate, Low, Very low, Extremely low, Negligible**",
              "ไม่มีความเสี่ยงเท่ากับศูนย์ ระดับต่ำสุดที่ใกล้ศูนย์ที่สุดเรียก **negligible** (คลิป 48:39-49:08)",
              "ค่าที่เป็นตัวอักษรบวกลบคูณหารไม่ได้ จึงรวมกันด้วย **matrix** (คลิป 56:27-56:55)"
            ]
          },
          {
            "sub": "Matrix 1: combining likelihoods of entry and exposure (p.11)",
            "body": [
              {
                "table": {
                  "headers": [
                    "",
                    "High",
                    "Moderate",
                    "Low",
                    "Very low",
                    "Extremely low",
                    "Negligible"
                  ],
                  "rows": [
                    [
                      "**High**",
                      "High",
                      "Moderate",
                      "Low",
                      "Very low",
                      "Extremely low",
                      "Negligible"
                    ],
                    [
                      "**Moderate**",
                      "",
                      "Low",
                      "Low",
                      "Very low",
                      "Extremely low",
                      "Negligible"
                    ],
                    [
                      "**Low**",
                      "",
                      "",
                      "Very low",
                      "Very low",
                      "Extremely low",
                      "Negligible"
                    ],
                    [
                      "**Very low**",
                      "",
                      "",
                      "",
                      "Extremely low",
                      "Extremely low",
                      "Negligible"
                    ],
                    [
                      "**Extremely low**",
                      "",
                      "",
                      "",
                      "",
                      "Negligible",
                      "Negligible"
                    ],
                    [
                      "**Negligible**",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "Negligible"
                    ]
                  ]
                }
              },
              "ตารางเติมเฉพาะครึ่งบนขวา อ่านค่าที่จุดตัดของสองระดับ โดยให้ระดับที่สูงกว่าเป็นแถว เช่น High กับ Low ได้ Low (p.31)"
            ]
          },
          {
            "sub": "Matrix 2: likely consequence ของแต่ละ outbreak (p.17), แถว = PLES, คอลัมน์ = impact",
            "body": [
              {
                "table": {
                  "headers": [
                    "PLES \\ Impact",
                    "N",
                    "VL",
                    "L",
                    "M",
                    "H",
                    "E"
                  ],
                  "rows": [
                    [
                      "**H**",
                      "N",
                      "VL",
                      "L",
                      "M",
                      "H",
                      "E"
                    ],
                    [
                      "**M**",
                      "N",
                      "VL",
                      "L",
                      "M",
                      "H",
                      "E"
                    ],
                    [
                      "**L**",
                      "N",
                      "N",
                      "VL",
                      "L",
                      "M",
                      "H"
                    ],
                    [
                      "**VL**",
                      "N",
                      "N",
                      "N",
                      "VL",
                      "L",
                      "M"
                    ],
                    [
                      "**EL**",
                      "N",
                      "N",
                      "N",
                      "N",
                      "VL",
                      "L"
                    ],
                    [
                      "**N**",
                      "N",
                      "N",
                      "N",
                      "N",
                      "N",
                      "VL"
                    ]
                  ]
                }
              },
              "ตัวย่อ: N = negligible, VL = very low, L = low, M = moderate, H = high, E = extreme, EL = extremely low",
              "ตัวอย่างในคาบ: PLES High กับ impact Low ได้ likely consequence **Low** (คลิป 56:27-57:26)"
            ]
          },
          {
            "sub": "Matrix 3: risk estimation (p.20), แถว = likelihood of entry and exposure, คอลัมน์ = consequences",
            "body": [
              {
                "table": {
                  "headers": [
                    "Likelihood \\ Consequence",
                    "Negligible",
                    "Very low",
                    "Low",
                    "Moderate",
                    "High",
                    "Extreme"
                  ],
                  "rows": [
                    [
                      "**High**",
                      "Negligible",
                      "Very low",
                      "Low",
                      "Moderate",
                      "High",
                      "Extreme"
                    ],
                    [
                      "**Moderate**",
                      "Negligible",
                      "Very low",
                      "Low",
                      "Moderate",
                      "High",
                      "Extreme"
                    ],
                    [
                      "**Low**",
                      "Negligible",
                      "Negligible",
                      "Very low",
                      "Low",
                      "Moderate",
                      "High"
                    ],
                    [
                      "**Very low**",
                      "Negligible",
                      "Negligible",
                      "Negligible",
                      "Very low",
                      "Low",
                      "Moderate"
                    ],
                    [
                      "**Extremely low**",
                      "Negligible",
                      "Negligible",
                      "Negligible",
                      "Negligible",
                      "Very low",
                      "Low"
                    ],
                    [
                      "**Negligible**",
                      "Negligible",
                      "Negligible",
                      "Negligible",
                      "Negligible",
                      "Negligible",
                      "Very low"
                    ]
                  ]
                }
              },
              "ทุกช่องเป็น \"... risk\" ระดับสูงสุดของ consequence และ risk คือ **Extreme**"
            ]
          }
        ]
      },
      {
        "heading": "Consequence assessment",
        "source": "Import Risk Assessment (Present) p.12-16; Import Risk Assessment (Reading Material) p.3; คลิป hLl7taXYRWQ [49:08-55:12]",
        "body": [
          {
            "bullets": [
              "**Objective** (p.12): likelihood และ impact ของการ establishment และ spread ของเชื้อ",
              "**Establishment** = เชื้อเพิ่มจำนวนในพื้นที่แคบ ส่วน **spread** = แพร่กระจายออกไป (คลิป 40:07-40:35)",
              "Procedure (p.12): ระบุ outbreak scenarios ที่เป็นไปได้ของแต่ละ exposure group, ประมาณ impact ของแต่ละ scenario, รวม likely consequence ของแต่ละ scenario, รวมเป็น overall likely consequence ของแต่ละ exposure group"
            ]
          },
          {
            "sub": "Likely consequence (p.13)",
            "body": [
              {
                "bullets": [
                  "ระบุ major outbreak scenarios หลักๆ คือ **ระบาด (outbreak) กับไม่ระบาด (no outbreak)** (คลิป 51:02)",
                  "หา likelihood ของแต่ละ scenario = **PLES (partial likelihood of establishment and/or spread)**",
                  "ประมาณ impact ของแต่ละ scenario",
                  "**Likely consequence = PLES + impact** (รวมด้วย matrix p.17)",
                  "**Overall likely consequence** = รวม likely consequence ของทุก outbreak scenario"
                ]
              }
            ]
          },
          {
            "sub": "ข้อมูลที่ต้องใช้ (p.14)",
            "body": [
              {
                "bullets": [
                  "Infective dose; transmission; susceptibility ของ crustacean",
                  "การที่ finfish ซึ่งไม่ไวต่อโรคกินเนื้อเยื่อหรือสัตว์ที่ติดเชื้อ (predation)",
                  "Impact ที่อาจเกิด ทั้งด้านเศรษฐกิจ สังคม สิ่งแวดล้อม ทั้งทางตรงและทางอ้อม"
                ]
              }
            ]
          },
          {
            "sub": "ผลกระทบ 2 ส่วน (Reading Material p.3)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชนิด",
                    "สิ่งที่พิจารณา"
                  ],
                  "rows": [
                    [
                      "**Direct consequences**",
                      "การเจ็บป่วย การอยู่รอด และจำนวนประชากรของปศุสัตว์ สัตว์เลี้ยง สัตว์ป่า; ผลด้านสาธารณสุข; ผลด้านสิ่งแวดล้อม เช่น ผลข้างเคียงของมาตรการควบคุม ความหลากหลายทางชีวภาพ การสูญพันธุ์"
                    ],
                    [
                      "**Indirect consequences**",
                      "เศรษฐศาสตร์: ค่าควบคุมโรค ค่าชดเชย ค่าเฝ้าระวัง ค่าสร้าง biosecurity ความเสียหายในประเทศ (พฤติกรรมผู้บริโภค อุตสาหกรรมที่เกี่ยวข้อง) และระหว่างประเทศ (การกีดกันทางการค้า โอกาสทางการตลาด); สิ่งแวดล้อม เช่น การท่องเที่ยวลดลง"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "โครงของ consequence assessment (p.15-16)",
            "body": [
              "Prawn consignment at port of entry แตกเป็น 3 exposure groups (farmed, hatchery, wild crustaceans) แต่ละกลุ่มมี PLES ของ outbreak scenario 1, scenario 2 และ no outbreak; scenario ที่ระบาดมี impact จึงได้ likely consequence 1 และ 2 แล้วรวมเป็น overall likely consequence ของกลุ่มนั้น",
              "Scenario ที่ไม่ระบาดไม่มี impact จึงไม่มี likely consequence (คลิป 52:51-53:22)"
            ]
          }
        ]
      },
      {
        "heading": "Risk estimation: PALEE, partial annual risk และ overall annual risk",
        "source": "Import Risk Assessment (Present) p.18-23, 31; Import Risk Assessment (Reading Material) p.3-4; คลิป hLl7taXYRWQ [57:52-65:57, 69:48-72:28]",
        "body": [
          {
            "bullets": [
              "**Objective** (p.18): ความเสี่ยงของเชื้อที่เกิดจาก likelihood ของ entry, exposure, establishment, spread และ impact",
              "Procedure: likelihood of entry and exposure, likely consequences, แล้วรวม likelihood กับ consequences",
              "Risk estimation บูรณาการผลจาก 3 ขั้นแรกเป็น **risk pathway** ตั้งแต่ระบุอันตรายจนเกิดผลกระทบ (Reading Material p.3)"
            ]
          },
          {
            "table": {
              "headers": [
                "ตัวย่อ",
                "ชื่อเต็ม",
                "ได้จาก"
              ],
              "rows": [
                [
                  "**LR**",
                  "likelihood of release (entry) ของเชื้อในสินค้า",
                  "entry assessment (p.26)"
                ],
                [
                  "**PLE**",
                  "partial likelihood of exposure ของแต่ละ exposure group",
                  "exposure assessment (p.28)"
                ],
                [
                  "**PALEE**",
                  "partial annual likelihood of entry and exposure ของแต่ละ group",
                  "**LR × PLE** ของ group นั้น (p.31) รวมด้วย matrix p.11"
                ],
                [
                  "**PLES**",
                  "partial likelihood of establishment and/or spread ของแต่ละ outbreak scenario",
                  "consequence assessment (p.13)"
                ],
                [
                  "**PAR**",
                  "partial annual risk ของแต่ละ group",
                  "PALEE กับ overall likely consequence ของ group นั้น (p.21) รวมด้วย matrix p.20"
                ],
                [
                  "**Overall annual risk**",
                  "ความเสี่ยงรายปีรวม",
                  "Σ ของ PAR ทุก group: Σ [PARfarm, PARhatchery, PARwild] (p.21-22)"
                ]
              ]
            }
          },
          {
            "callout": "PAR เรียกว่า partial เพราะเป็นความเสี่ยงรายปี **เฉพาะ exposure group เดียว** (คลิป 64:30) การรวม likely consequence ของ outbreak กับ no outbreak และการรวม PAR ของทุก group เป็นการรวมแบบ summation ที่ **ยึดค่าสูงสุด** ไม่ได้ใช้ matrix (คลิป 69:48, 71:09)",
            "kind": "tip"
          },
          {
            "callout": "PALEE (entry and exposure) กับ PLES (establishment and spread) ชื่อคล้ายกันแต่อยู่คนละขั้น",
            "kind": "warn"
          },
          {
            "sub": "เมื่อประเมินเชิงปริมาณ ผลสุดท้ายควรมี (Reading Material p.3-4)",
            "body": [
              {
                "bullets": [
                  "จำนวนฝูงสัตว์หรือประชากรมนุษย์ที่อาจได้รับผลทางสุขภาพในระดับความรุนแรงต่างๆ ในช่วงเวลาหนึ่ง",
                  "Probability distribution, confidence interval และวิธีอื่นที่อธิบายความไม่รู้ (uncertainty) ของค่าประมาณ",
                  "ความแปรปรวนของตัวแปรในแบบจำลอง (model)",
                  "การวิเคราะห์ dependence และ correlation ระหว่างตัวแปรในแบบจำลอง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง WSSV ในกุ้งนำเข้าออสเตรเลีย: ภูมิหลัง entry และ exposure",
        "source": "Import Risk Assessment (Present) p.2-3, 24-31; คลิป hLl7taXYRWQ [43:18-45:13, 65:57-67:49]",
        "body": [
          {
            "sub": "ภูมิหลัง (p.2-3)",
            "body": [
              {
                "bullets": [
                  "นำเข้ากุ้งและผลิตภัณฑ์กุ้ง **เพื่อการบริโภคของคน**",
                  "ปี 2001 ออสเตรเลียตั้ง interim quarantine condition สำหรับ white spot syndrome virus, yellowhead virus และ Taura syndrome virus (เช่น ตรวจ WSSV)",
                  "**Biosecurity Australia** ทำ import risk analysis เพื่อเสนอมาตรการจัดการความเสี่ยงให้อยู่ใน **ALOP (appropriate level of protection)** ของออสเตรเลีย",
                  "เชื้อที่มีความเสี่ยงยอมรับไม่ได้ 5 ตัว: **WSSV, YHV, IHHNV, TSV, NHPB** (necrotising hepatopancreatitis bacterium)",
                  "ต้องทำ import risk assessment **แยกทีละเชื้อ** ไม่ใช่ one size fits all; WSSV เป็นตัวอย่างในคาบ (คลิป 44:44-45:13)"
                ]
              }
            ]
          },
          {
            "sub": "Entry assessment (p.25-26): LR = HIGH",
            "body": [
              {
                "bullets": [
                  "WSSV พบ **ความชุกสูง** ในกุ้งเชิงพาณิชย์จากพื้นที่ที่เคยระบาดหนัก",
                  "อาการแปรผัน กุ้งที่ติดเชื้อทั้งแบบมีอาการและไม่แสดงอาการ **ผ่านการตรวจตามปกติได้**",
                  "กุ้งที่ผ่าน post-harvest inspection อาจมีไวรัสปริมาณมาก",
                  "ตรวจพบ WSSV ด้วย **PCR** ในกุ้งแช่แข็งดิบนำเข้าในออสเตรเลีย",
                  "สรุป: LR ของ WSSV จากการนำเข้ากุ้งทั้งตัว ดิบ แช่แข็ง ไม่มีชีวิต จากฟาร์ม เพื่อการบริโภค แบบไม่มีข้อจำกัด = **HIGH**"
                ]
              }
            ]
          },
          {
            "sub": "Exposure assessment (p.27-29)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Exposure group",
                    "Pathway",
                    "PLE"
                  ],
                  "rows": [
                    [
                      "1 Farm crustaceans",
                      "ให้กุ้งดิบเป็นอาหารกุ้งโต",
                      "**Low**"
                    ],
                    [
                      "2 Hatchery crustaceans",
                      "ใช้เป็นอาหารปรับสภาพพ่อแม่พันธุ์ (broodstock)",
                      "**High**"
                    ],
                    [
                      "3 Wild crustaceans",
                      "เหยื่อตกปลา (recreational fishing bait) หรือ berley",
                      "**High**"
                    ]
                  ]
                }
              },
              "WSSV ในกุ้งดิบที่ทิ้งลงแหล่งน้ำธรรมชาติยังติดเชื้อได้ ณ จุดสัมผัส และ host ที่ไวต่อโรครับไปได้ (p.27)"
            ]
          },
          {
            "sub": "PALEE = LR × PLE (p.31)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Group",
                    "LR",
                    "PLE",
                    "PALEE"
                  ],
                  "rows": [
                    [
                      "Farm",
                      "High",
                      "Low",
                      "**Low**"
                    ],
                    [
                      "Hatchery",
                      "High",
                      "High",
                      "**High**"
                    ],
                    [
                      "Wild",
                      "High",
                      "High",
                      "**High**"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่าง WSSV: consequence และ risk estimation",
        "source": "Import Risk Assessment (Present) p.32-43; คลิป hLl7taXYRWQ [67:49-71:35]",
        "body": [
          {
            "sub": "หลักฐานของ consequence (p.32)",
            "body": [
              {
                "bullets": [
                  "กุ้งติด WSSV หนัก และติดต่อทางปาก",
                  "ความหนาแน่นของสัตว์ไวรับสูงทำให้ establishment มีโอกาสมากขึ้น",
                  "Establishment และ spread ใน exposure group 3 (wild) ไม่น่าเกิด แต่อาจแพร่ไปประชากรป่าอื่น แล้วไปถึงฟาร์มและ hatchery",
                  "Hatchery แพร่ไปฟาร์มได้ ส่วนฟาร์มแพร่กลับไป hatchery มีโอกาสน้อยกว่า"
                ]
              }
            ]
          },
          {
            "sub": "PLES, impact และ likely consequence (p.33-37)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Group",
                    "Scenario",
                    "PLES",
                    "Impact",
                    "Likely consequence",
                    "Overall likely consequence"
                  ],
                  "rows": [
                    [
                      "Farm",
                      "Establishment and spread",
                      "Moderate",
                      "High",
                      "High",
                      "**High**"
                    ],
                    [
                      "Farm",
                      "No outbreak",
                      "Moderate",
                      "Negligible",
                      "Negligible",
                      ""
                    ],
                    [
                      "Hatchery",
                      "Establishment and spread",
                      "Moderate",
                      "High",
                      "High",
                      "**High**"
                    ],
                    [
                      "Hatchery",
                      "No outbreak",
                      "Moderate",
                      "Negligible",
                      "Negligible",
                      ""
                    ],
                    [
                      "Wild",
                      "Establishment and spread",
                      "Very low",
                      "High",
                      "Low",
                      "**Low**"
                    ],
                    [
                      "Wild",
                      "No outbreak",
                      "High",
                      "Negligible",
                      "Negligible",
                      ""
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Partial annual risk และ overall annual risk (p.40-41)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Group",
                    "PALEE",
                    "Overall likely consequence",
                    "PAR"
                  ],
                  "rows": [
                    [
                      "Farm",
                      "Low",
                      "High",
                      "**Moderate**"
                    ],
                    [
                      "Hatchery",
                      "High",
                      "High",
                      "**High**"
                    ],
                    [
                      "Wild",
                      "High",
                      "Low",
                      "**Low**"
                    ]
                  ]
                }
              },
              "Overall annual risk = ค่าสูงสุดของ [Moderate, High, Low] = **HIGH**"
            ]
          },
          {
            "sub": "ข้อสรุป (p.43)",
            "body": [
              {
                "bullets": [
                  "**Unrestricted risk** ของ WSSV (รวม PAR ทั้ง 3 group) = **HIGH**",
                  "สูงกว่า ALOP ของออสเตรเลียซึ่งเท่ากับ **very low** จึงต้องมี risk management"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Risk management ของ WSSV",
        "source": "Import Risk Assessment (Present) p.4, 44-46; คลิป hLl7taXYRWQ [45:13-46:13]",
        "body": [
          {
            "sub": "มาตรการที่เสนอ (p.4)",
            "body": [
              {
                "bullets": [
                  "นำเข้าจาก **ประเทศหรือเขตที่ปลอดอันตราย**",
                  "**PCR ให้ผลลบ** (ความเชื่อมั่น 95% ที่ตรวจพบได้เมื่อความชุก 5%)",
                  "**Highly processed**: เอาหัวและเปลือกออกแล้วเคลือบ เพราะเชื้อมักอยู่ในเครื่องในและใต้เปลือก การเอาออกจึงลดปริมาณเชื้อ (คลิป 45:44)",
                  "**ทำให้สุก** ที่อุณหภูมิแกนกลาง **85°C**"
                ]
              }
            ]
          },
          {
            "sub": "ทางเลือกทั่วไป (p.44) และผลต่อ PALEE ของ WSSV (p.45)",
            "body": [
              {
                "table": {
                  "headers": [
                    "ทางเลือก",
                    "ผลต่อ PALEE ของ WSSV (p.45)"
                  ],
                  "rows": [
                    [
                      "1 Sourcing from free stocks",
                      "ไม่ระบุระดับ"
                    ],
                    [
                      "2 Pathogen inactivation",
                      "ลด PALEE เป็น extremely low"
                    ],
                    [
                      "3 Testing",
                      "PALEEfarm และ PALEEhatch เป็น extremely low, PALEEwild เป็น very low"
                    ],
                    [
                      "4 Highly processed prawns",
                      "PALEEfarm และ PALEEhatch เป็น negligible, PALEEwild เป็น very low"
                    ],
                    [
                      "5 Minimum size",
                      "ไม่อยู่ในรายการของ WSSV"
                    ],
                    [
                      "6 Labelling for human consumption",
                      "ไม่อยู่ในรายการของ WSSV"
                    ],
                    [
                      "7 Post-harvest inspection ให้แน่ใจว่าไม่มีอาการ",
                      "ไม่อยู่ในรายการของ WSSV"
                    ],
                    [
                      "8 Head/shell removal",
                      "PALEEfarm และ PALEEhatch เป็น extremely low, PALEEwild เป็น very low"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Restricted risk estimation (p.46)",
            "body": [
              {
                "bullets": [
                  "เมื่อ PALEE ทั้ง 3 group ลดเป็น **extremely low** และ overall likely consequence เท่าเดิม (High, High, Low)",
                  "PAR: farm **very low**, hatchery **very low**, wild **negligible**",
                  "Restricted overall annual risk = **very low**"
                ]
              }
            ]
          },
          {
            "callout": "p.46 ใช้ PALEE extremely low ทั้ง 3 group ซึ่งตรงกับข้อ 2 บน p.45 ถ้าใช้ matrix p.20 กับข้อ 3 หรือข้อ 8 (farm และ hatchery extremely low, wild very low) ได้ PAR very low, very low, negligible และ overall very low เท่ากัน ส่วนข้อ 4 ได้ negligible ทุก group ผลทั้งหมดนี้ไม่เกิน ALOP ของออสเตรเลียซึ่งเท่ากับ very low (p.43)",
            "kind": "tip"
          }
        ]
      }
    ]
  }
};

export default NOTES_Y5_ONE_HEALTH;
