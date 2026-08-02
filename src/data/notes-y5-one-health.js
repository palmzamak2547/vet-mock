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
//   { text }                     — paragraph
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
          {
            "text": "หัวข้อนี้สั้นมาก สไลด์ p.12 เป็นภาพ word diagram ตกแต่งที่ไม่มีเนื้อหาสอน เนื้อหาที่ออกสอบได้จริงอยู่ที่ p.13 เพียงสไลด์เดียว"
          },
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
  }
};

export default NOTES_Y5_ONE_HEALTH;
