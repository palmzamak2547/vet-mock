// ============================================================
// อายุรศาสตร์สัตว์ปีก — Study Notes
// ============================================================
// เขียนจาก lecture 3107510 ที่แจกจริงในรายวิชา ทุก section อ้างอิงสไลด์
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

export const NOTES_Y5_AVIAN_MEDICINE = {
  "avian-ib": {
    "topic": "avian-ib",
    "title": "โรคหลอดลมอักเสบติดต่อ (Infectious Bronchitis, IB)",
    "lecturer": "ผศ.สพ.ญ.ดร.ณเทยา เจริญวิศาล (ภาควิชาอายุรศาสตร์ คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย)",
    "icon": "🫁",
    "summary": "IB เกิดจาก Infectious bronchitis virus (IBV) ใน genus Gammacoronavirus เป็นโรคติดต่อง่ายมาก morbidity สูงแต่ mortality ต่ำ (ยกเว้นมี secondary infection) เป้าหมายคือ epithelial cell ของ trachea, lung และลามไป oviduct, kidney, cecal tonsil ทำให้เกิดอาการได้ 3 ระบบคือ ระบบหายใจ ระบบสืบพันธุ์ (false layer, ไข่ลด, คุณภาพไข่แย่) และไตอักเสบ (QX) ความเสียหายหลักคือเศรษฐกิจ ไม่ใช่การตาย จำแนก genotype ด้วย S1 gene (GI-1-29, GII-VII) และแต่ละ serotype cross protection กันไม่ได้ จึงต้องเลือกวัคซีนให้ตรงสายพันธุ์ที่ระบาดในพื้นที่ ควบคู่กับ biosecurity และ management",
    "sections": [
      {
        "heading": "ภาพรวมของโรค (Overview)",
        "source": "1.2_IBV p.2",
        "body": [
          {
            "text": "IB เป็น **respiratory disease** เป็นหลัก แต่ยังทำให้เกิด **reproductive disorder** และ **nephritis** ได้ด้วย"
          },
          {
            "bullets": [
              "**Highly contagious**",
              "**High morbidity, low mortality** ยกเว้นมี secondary infection",
              "แต่มีผลกับเศรษฐกิจ/อุตสาหกรรมมาก"
            ]
          },
          {
            "sub": "production loss ที่เกิดขึ้น",
            "body": [
              {
                "bullets": [
                  "**Poor weight gain**",
                  "**decrease egg production & quality**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ต้องจำ: โรคนี้ไม่ได้ฆ่าไก่โดยตรง แต่สร้างความเสียหายทางเศรษฐกิจมาก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ประวัติช่วงแรกของโรค (1930-1941)",
        "source": "1.2_IBV p.3",
        "body": [
          {
            "bullets": [
              "รายงานครั้งแรกในปี **ค.ศ. 1930** ที่รัฐ **North Dakota** ประเทศสหรัฐอเมริกา โดย **Schalk and Hawn**",
              "ในช่วงแรกเข้าใจว่าเป็นไวรัสที่ก่อโรค **Infectious laryngotracheitis (ILT, โรคกล่องเสียงอักเสบติดต่อ)** ชนิดอ่อน (mild form)",
              "ในปี **1936, Beach and Schalm** พบว่าเป็นไวรัสคนละชนิดจากการทำ **neutralization studies**",
              "ในปี **1937, Beaudette and Hudson** พบว่าสามารถเพาะเลี้ยงไวรัสนี้ได้ใน **allantoic cavity ของไข่ไก่ฟัก**",
              "ในปี **1941, Delaplane and Stuart** พบว่าไวรัสที่เพาะเลี้ยงจากไข่ไก่ฟักสามารถกระตุ้นภูมิคุ้มกันในไก่ได้ จึงนำไปสู่การคิดค้นวัคซีนป้องกันโรคหลอดลมอักเสบติดต่อโดย van Roeckel"
            ]
          }
        ]
      },
      {
        "heading": "ประวัติ: วัคซีนตัวแรกและการค้นพบว่ามีหลาย serotype",
        "source": "1.2_IBV p.4",
        "body": [
          {
            "bullets": [
              "ในปี **1941 van Roekel** ได้พัฒนาวัคซีนชนิดแรก **\"M41 strain\"** ซึ่งเพาะแยกได้ที่ University of Massachusetts (ปัจจุบัน คือ **Mass serotype**)",
              "ในปี **1956 Jungherr** รายงานว่า ภูมิคุ้มกันที่ถูกกระตุ้นโดยไวรัสหลอดลมอักเสบติดต่อที่เพาะแยกจาก **Connecticut ไม่สามารถป้องกันโรคชนิด Mass ได้**",
              "ตั้งแต่นั้นมา จึงรู้ว่าไวรัสโรคหลอดลมอักเสบติดต่อ **มีหลาย serotype และแต่ละ serotype ไม่สามารถ cross protection กันได้**"
            ]
          },
          {
            "callout": "หมายเหตุการอ่านสไลด์: ชื่อผู้พัฒนาวัคซีนสะกดไม่ตรงกันระหว่างสองสไลด์ หน้า 3 เขียน van Roeckel ส่วนหน้า 4 เขียน van Roekel",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เชื้อสาเหตุและการจัดจำแนก (Etiology)",
        "source": "1.2_IBV p.5",
        "body": [
          {
            "text": "เกิดจากเชื้อ **Infectious bronchitis virus (IBV)**"
          },
          {
            "bullets": [
              "Genus **Gammacoronavirus**",
              "Subfamily **Coronavirinae**",
              "Family **Coronaviridae**"
            ]
          },
          {
            "text": "Gammacoronavirus เป็น **อาร์เอ็นเอไวรัสสายเดี่ยว (สายบวก) มีเปลือกหุ้ม**"
          },
          {
            "sub": "โครงสร้างจากรูปในสไลด์ (viralzone.expasy.org)",
            "body": [
              {
                "bullets": [
                  "**Spike glycoprotein trimer (S)**",
                  "**Nucleoprotein (N)** และ RNA genome",
                  "**Membrane protein (M)**",
                  "**Envelope small membrane protein pentamer (E)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Genotype และสายพันธุ์ของ IBV",
        "source": "1.2_IBV p.6",
        "body": [
          {
            "text": "Genotype จำแนกด้วย **S1 gene** แบ่งเป็น **GI-1 ถึง GI-29 และ GII-VII**"
          },
          {
            "bullets": [
              "**GI-1**: Massachusetts (Mass/Ma5/M41), Connecticut (Con), H120",
              "**GI-13**: 4/91, 793B",
              "**GI-19**: QX, QX-like",
              "etc.: Arkansas/Delaware/California/Beaudette",
              "other variant strains or recombinant strains"
            ]
          }
        ]
      },
      {
        "heading": "ความรุนแรงของโรคและปัจจัยที่มีผล",
        "source": "1.2_IBV p.7",
        "body": [
          {
            "text": "ทั่วไปแล้ว ก่อให้เกิด **acute upper respiratory disease with 100% morbidity and 0% mortality**"
          },
          {
            "sub": "ความรุนแรงของอาการและรอยโรคขึ้นกับ",
            "body": [
              {
                "bullets": [
                  "**strain ของไวรัส**",
                  "ชนิดของไก่/เพศ/พันธุ์/อายุ",
                  "**Immune status** (vaccination, immune suppression, Maternal derived antibody (MDA))",
                  "**Co-infection/secondary infection**",
                  "environment: climate, dust, ammonia, temp, stress"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขในสไลด์หน้า 7 (100% morbidity, 0% mortality) กับหน้า 11 (อัตราการป่วยถึง 100%, อัตราการตาย 5-25%) ต่างกัน สไลด์ไม่ได้อธิบายว่าเงื่อนไขไหนใช้ตัวเลขชุดใด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เซลล์และอวัยวะเป้าหมาย การติดต่อ ระยะฟักตัว",
        "source": "1.2_IBV p.8",
        "body": [
          {
            "bullets": [
              "**เซลล์เป้าหมาย: epithelial cells**",
              "**อวัยวะเป้าหมาย Respiratory: Trachea, lung**",
              "**Urogenital: oviduct, kidney**",
              "**chronic: intestinal tract: cecal tonsil**"
            ]
          },
          {
            "sub": "ระบาดวิทยาเชิงตัวเลข",
            "body": [
              {
                "bullets": [
                  "การติดต่อ: **Aerosol, direct contact**",
                  "ระยะฟักตัวของโรค: **36 hrs.**",
                  "**Shedding though the flock within 2 days**",
                  "**Recovery within 14 days**",
                  "Susceptible age: **all ages**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พยาธิกำเนิดในระบบหายใจ (Pathogenesis, respiratory tract)",
        "source": "1.2_IBV p.9",
        "body": [
          {
            "text": "**IBV damage ciliated epithelial cell and mucus producing cell of trachea**"
          },
          {
            "sub": "URT",
            "body": [
              {
                "bullets": [
                  "เซลล์ที่โดนทำลายคือ **ciliated epithelial cell และ mucus producing cells**",
                  "**Found virus in nose & trachea 1-5 DPI**"
                ]
              }
            ]
          },
          {
            "sub": "LRT",
            "body": [
              {
                "bullets": [
                  "**Found virus in lung and airsac**",
                  "**Cause mild or no pneumonia (if no 2nd infection)**"
                ]
              }
            ]
          },
          {
            "text": "**After IBV replicate in URT (1-5 DPI), its viremia to other organs (found IBV at 7 DPI onward)**"
          },
          {
            "callout": "รูปประกอบด้านขวาของสไลด์หน้า 9 (แผนภาพ health เทียบกับ disease) ถูกตัดขอบ อ่านข้อความในรูปไม่ครบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "อวัยวะที่ IBV เข้าไปติดเชื้อได้",
        "source": "1.2_IBV p.10",
        "body": [
          {
            "text": "IBV can infect in:"
          },
          {
            "bullets": [
              "**Respiratory tract**",
              "**Reproductive tract**",
              "**Urogenital tract**",
              "**Gastrointestinal tract**"
            ]
          },
          {
            "text": "ในรูปไก่ผ่าซาก มีการชี้ตำแหน่ง **Nephropathy/Nephritis** ที่ไต และ **Oviduct** ที่ท่อนำไข่"
          }
        ]
      },
      {
        "heading": "อาการโดยรวม",
        "source": "1.2_IBV p.11",
        "body": [
          {
            "bullets": [
              "ขึ้นกับ **อายุของไก่ ระดับภูมิคุ้มกัน และ IBV strain**",
              "อัตราการป่วย **can be up to 100%**, อัตราการตาย **5-25%**",
              "มักแสดงอาการประมาณ **3-7 วัน** และหายได้เองภายใน **2 สัปดาห์** แต่หากเป็นแบบเรื้อรังอาจป่วยได้ **2-3 สัปดาห์**",
              "ผอม ซึม ขนยุ่ง ไม่ขยับตัว"
            ]
          },
          {
            "sub": "อาจพบอาการและรอยโรคใน 3 ระบบ (แล้วแต่ strain)",
            "body": [
              {
                "bullets": [
                  "**ระบบหายใจ**",
                  "**ระบบสืบพันธุ์ (QX)**",
                  "**ไตอักเสบ (QX)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อาการระบบหายใจ และ secondary infection",
        "source": "1.2_IBV p.12-13",
        "body": [
          {
            "bullets": [
              "**ไอ, จาม, หายใจลำบาก, เสียง tracheal rales**, +/- มีน้ำมูก",
              "ตาแดง ตาบวม **conjunctivitis**",
              "ซึม, อ่อนแรง"
            ]
          },
          {
            "text": "**ตัว IBV ไม่ทำให้ไก่ตาย แต่ทำให้ cilia ในท่อลม หรือ epithelial ของท่อลมตาย ทำให้เกิด secondary infection ได้ง่าย**"
          },
          {
            "sub": "หากเกิด secondary infection: mortality rate can be up to 20-80%",
            "body": [
              {
                "bullets": [
                  "**E. coli**: airsaculitis, pericarditis, perihepatitis, peritonitis",
                  "**MG, MS**: more severe clinical signs, decrease growth, airsaculitis"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์หน้า 13 เป็นรูปสภาพลูกไก่ป่วยจริง (ยืนหลังโก่ง ขนยุ่ง หน้าตาซึม) พร้อมไอคอนไฟล์เสียง 7 อัน ซึ่งน่าจะเป็นเสียงหายใจ แต่ไฟล์เสียงเปิดจากสไลด์ไม่ได้ ในสไลด์ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "อาการระบบสืบพันธุ์ (ไข่ลดและคุณภาพไข่)",
        "source": "1.2_IBV p.14",
        "body": [
          {
            "bullets": [
              "อาจเกิดเมื่อ **ติดเชื้อตอนอายุน้อย** หรือ **ติดเชื้อช่วงที่ให้ผลผลิตแล้ว** ก็ได้",
              "**ไข่ลด 3-10% หรือบางฝูงอาจมากถึง 50%** (แล้วแต่ strain ของไวรัสและอายุแม่ไก่ที่ติดเชื้อด้วย)",
              "**อัตราการฟักต่ำ**"
            ]
          },
          {
            "sub": "คุณภาพของไข่",
            "body": [
              {
                "bullets": [
                  "**ไข่ฟองเล็ก, ไข่ผิดรูป, เปลือกบาง, แตกง่าย, สีซีด, ไข่ขาวเหลว**"
                ]
              }
            ]
          },
          {
            "text": "มักกลับมาให้ผลผลิตปกติใน **1-2 สัปดาห์** แต่ในฝูงที่ติดเชื้อรุนแรงอาจใช้เวลาถึง **6-8 สัปดาห์** หรือบางฝูงอาจให้ **ไข่ลดลง 6-12% ตลอดไป และกลับมาไม่ได้อีก**"
          }
        ]
      },
      {
        "heading": "False layer และ Penguin-like posture",
        "source": "1.2_IBV p.15-16",
        "body": [
          {
            "bullets": [
              "**False layer, Penguin-like posture**",
              "**มักเป็นเมื่อติดเชื้ออายุน้อยกว่า 2 สัปดาห์**",
              "**ฝูงที่มี false layer อาจให้ peak production แค่ 35%**"
            ]
          },
          {
            "callout": "สไลด์หน้า 15 เป็นรูปประกอบ ไก่ไข่ท้องป่องยืนตัวตั้งแบบเพนกวิน และรูปผ่าซากเห็นถุงน้ำขนาดใหญ่ในช่องท้อง สไลด์ไม่มีคำบรรยายใต้รูป",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการไตอักเสบ และฝูงที่ป่วยน้อย",
        "source": "1.2_IBV p.16",
        "body": [
          {
            "sub": "ไตอักเสบ",
            "body": [
              {
                "bullets": [
                  "**ไก่มีสภาพแห้งน้ำ**",
                  "**ดื่มน้ำเยอะ, ถ่ายเหลว**"
                ]
              }
            ]
          },
          {
            "text": "**ฝูงที่ป่วยน้อย อาจไม่เห็นอาการของ IB แต่มีติดเชื้ออยู่ และเห็นอาการชัดเจนเมื่อเกิด secondary infection และทำให้วินิจฉัยสาเหตุผิดได้**"
          }
        ]
      },
      {
        "heading": "รอยโรค (Lesions)",
        "source": "1.2_IBV p.17",
        "body": [
          {
            "sub": "ระบบหายใจ",
            "body": [
              {
                "bullets": [
                  "**Tracheal congestion with excessive mucus**",
                  "**Foamy air sac**, ถุงลมขุ่นหรือมี **caseous exudate**"
                ]
              }
            ]
          },
          {
            "sub": "ระบบสืบพันธุ์",
            "body": [
              {
                "bullets": [
                  "อาจพบ **การเสื่อมของรังไข่**",
                  "**ท่อนำไข่สั้นลง**",
                  "ในไก่ที่ติดเชื้อ **ก่อนอายุ 2 สัปดาห์** ท่อนำไข่อาจ **ไม่พัฒนาหรือกลายเป็นถุงน้ำ** ทำให้ไม่ให้ผลผลิต"
                ]
              }
            ]
          },
          {
            "sub": "ไตอักเสบ",
            "body": [
              {
                "bullets": [
                  "มีสภาพแห้งน้ำ **กล้ามเนื้อมีสีเข้ม**",
                  "**ไตบวม, ซีด หรือ เป็นสี marble มี urate คั่งในท่อไต**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัย (Diagnosis)",
        "source": "1.2_IBV p.18",
        "body": [
          {
            "bullets": [
              "1. จากประวัติ อาการและรอยโรค"
            ]
          },
          {
            "sub": "2. การตรวจทางไวรัสวิทยา: ตัวอย่างคือ trachea",
            "body": [
              {
                "bullets": [
                  "เพาะแยกเชื้อในไก่ปลอดเชื้อ ไข่ไก่ฟัก: พบ **stunning (dwarfing), curling** ของตัวอ่อน",
                  "Molecular techniques: **RT-PCR**",
                  "**S1 glycoprotein: sequencing เพื่อแยก field strain ออกจาก vaccine strain**"
                ]
              }
            ]
          },
          {
            "sub": "3. การตรวจทางซีรั่มวิทยา",
            "body": [
              {
                "bullets": [
                  "**ELISA**",
                  "**Virus neutralization test (VN)**"
                ]
              }
            ]
          },
          {
            "sub": "4. วินิจฉัยแยกแยะจากโรค",
            "body": [
              {
                "bullets": [
                  "**ILT, ND, LPAI, Infectious coryza**"
                ]
              }
            ]
          },
          {
            "callout": "รูปประกอบในสไลด์หน้า 18 เป็นตัวอ่อนไก่ในไข่ฟักที่แคระและขดตัว (stunting/curling) เทียบกับตัวปกติ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การควบคุมและป้องกันโรค: หลักการ 2 ข้อ",
        "source": "1.2_IBV p.19",
        "body": [
          {
            "bullets": [
              "1. **Vaccine**",
              "2. **Biosecurity and management**"
            ]
          }
        ]
      },
      {
        "heading": "Biosecurity",
        "source": "1.2_IBV p.20",
        "body": [
          {
            "bullets": [
              "**เลี้ยงไก่อายุเดียวใน 1 โรงเรือน (all in all out)**",
              "ควบคุมการเข้าออกของคน สัตว์ สิ่งของ ยานพาหนะ",
              "การทำความสะอาด ฆ่าเชื้อ โรงเรือน สิ่งของ ยานพาหนะ",
              "สุขศาสตร์ของฟาร์ม พนักงาน"
            ]
          }
        ]
      },
      {
        "heading": "Management",
        "source": "1.2_IBV p.21",
        "body": [
          {
            "bullets": [
              "คุณภาพลูกไก่ ไก่สาว",
              "คุณภาพสิ่งปูรอง",
              "ความสะอาด + คุณภาพ น้ำ",
              "คุณภาพอาหาร (**ระวังสารพิษจากเชื้อรา**)",
              "การกกลูกไก่",
              "ความหนาแน่น",
              "**การถ่ายเทอากาศที่ดี**"
            ]
          }
        ]
      },
      {
        "heading": "วัคซีนเชื้อเป็น (Live vaccine)",
        "source": "1.2_IBV p.22",
        "body": [
          {
            "bullets": [
              "**เลือก strain**",
              "**Route: coarse spray, aerosol, eye drop, intranasal, drinking water**"
            ]
          },
          {
            "sub": "โปรแกรมตามชนิดไก่",
            "body": [
              {
                "bullets": [
                  "**1 day old at hatchery: low virulent strain by coarse spray**",
                  "**Broiler: booster (more than 7-10 day old or at 10-18 day old): more virulent strain by drinking water or aerosol**",
                  "**Breeder and layer: booster at 2-3-week-old and during laying period**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วัคซีนเชื้อตาย (Killed vaccine)",
        "source": "1.2_IBV p.23",
        "body": [
          {
            "text": "**ให้ในไก่ไข่และไก่พ่อแม่พันธุ์**"
          },
          {
            "bullets": [
              "ให้ช่วงอายุ **13-18 สัปดาห์ (ให้ก่อนให้ไข่)**",
              "หรือให้ **2 ครั้ง ตอนอายุ 10 และ 18 สัปดาห์ (ห่างกันอย่างน้อย 4-6 สัปดาห์)**"
            ]
          },
          {
            "sub": "เหตุผลและข้อจำกัด",
            "body": [
              {
                "bullets": [
                  "เพื่อ **ลดผลกระทบต่อการผลิตไข่ และส่งภูมิคุ้มกันไปยังลูกไก่**",
                  "**Good protection to internal tissue/organs** ได้แก่ **ไต, reproductive organ**",
                  "**แต่ไม่ค่อยมีผลกับ epithelial cell, esp. respiratory tract**",
                  "**ดังนั้น ต้อง booster ด้วยวัคซีนเชื้อเป็นอย่างสม่ำเสมอ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "MDA และหลักการเลือกวัคซีนให้ตรงสายพันธุ์",
        "source": "1.2_IBV p.24",
        "body": [
          {
            "text": "**MDA ช่วยป้องกันความเสียหายที่จะเกิดกับท่อลม, ไต, ท่อนำไข่ได้ (ในไก่อายุน้อย) แต่อาจมีผลกับการตอบสนองต่อการทำวัคซีนเชื้อเป็นที่ทำตอนอายุ 1 วัน**"
          },
          {
            "sub": "Vaccination",
            "body": [
              {
                "bullets": [
                  "**Reduce viral transmission**",
                  "**Low cross-protection between different serotypes: choose the right vaccine**"
                ]
              }
            ]
          },
          {
            "text": "**วัคซีนสามารถป้องกัน IBV สายพันธุ์เดียวกันได้ดี แต่การป้องกัน IBV คนละสายพันธุ์จะให้ผลที่หลากหลาย**"
          },
          {
            "text": "**ดังนั้น สามารถเติมวัคซีนเชื้อเป็นสายพันธุ์อื่นที่พบการแพร่ระบาดในพื้นที่เข้าไปในโปรแกรมวัคซีนได้ หรืออาจทำการตรวจ cross-protection ก่อน**"
          }
        ]
      },
      {
        "heading": "ข้อควรระวังในการใช้วัคซีนเชื้อเป็น",
        "source": "1.2_IBV p.25",
        "body": [
          {
            "bullets": [
              "**ไม่ใช้วัคซีนสายพันธุ์ที่ยังไม่เคยมีการระบาดในประเทศ**",
              "**การให้วัคซีนไม่ทั่วทั้งฝูง อาจทำให้เกิด rolling infection ได้** คือ ไวรัสในวัคซีนสามารถพัฒนาและแพร่ไปยังตัวที่ไม่ได้รับวัคซีน และก่อให้เกิดโรคในตัวที่ไม่ได้รับวัคซีนได้ โดยไวรัสที่ทำให้เกิดโรคนี้มันพัฒนาตัวเองให้ **ก่อโรครุนแรงกว่าไวรัสในวัคซีนที่เป็นต้นฉบับ**",
              "**การให้วัคซีนป้องกันโรค ND, IB, aMPV พร้อมๆ กัน อาจ interfere การกระตุ้นระบบภูมิคุ้มกันของกันและกันได้** ขึ้นกับสายพันธุ์, ความเข้มข้น และวิธีการให้วัคซีน รวมถึง MDA และความพร้อมของระบบภูมิคุ้มกันของไก่ด้วย",
              "**หากต้องการทำ autogenous vaccine ที่เป็น new variant strain หรือ recombinant strain ต้องทำเป็นวัคซีนเชื้อตาย** เพื่อไม่ให้เกิดการแพร่กระจายของไวรัส"
            ]
          }
        ]
      },
      {
        "heading": "วัคซีนที่มีในประเทศไทย",
        "source": "1.2_IBV p.26",
        "body": [
          {
            "bullets": [
              "1. **Massachusetts (Mass)**, สแตรนฮอลแลนด์",
              "2. **Massachusetts + Connecticut (Mass+Con)**",
              "3. กรมปศุสัตว์",
              "4. **793B (4/91, IBird, IB88)**",
              "5. **QX-like**",
              "6. **H120+D274**"
            ]
          },
          {
            "callout": "สไลด์เขียนรายการนี้เป็นหัวข้อสั้นๆ ตามที่ปรากฏ ไม่ได้อธิบายว่ารายการที่ 1 และ 3 (สแตรนฮอลแลนด์ กับ กรมปศุสัตว์) หมายถึงผู้ผลิตหรือสายพันธุ์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ตัวอย่างโปรแกรมวัคซีนในไก่เนื้อ",
        "source": "1.2_IBV p.27",
        "body": [
          {
            "sub": "ไก่เนื้อ",
            "body": [
              {
                "bullets": [
                  "**ครั้งแรก (เชื้อเป็น): 1 วัน**",
                  "**ครั้งที่ 2 (เชื้อเป็น): 7-14 วัน**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างโปรแกรมวัคซีนในไก่ไข่และไก่พ่อแม่พันธุ์ (ช่วงไก่เล็กถึงไก่รุ่น)",
        "source": "1.2_IBV p.28",
        "body": [
          {
            "bullets": [
              "**1 วัน**: ND + IB, route = **Spray ที่โรงฟัก**",
              "**7 วัน**: ND (B1) + IB, route = **Eye drop**",
              "**21 วัน**: ND (LaSota) + IB, route = **Eye drop**",
              "**8 สัปดาห์**: ND (LaSota) + IB, route = **Drinking water**",
              "**12 สัปดาห์**: ND (LaSota) + IB, route = Eye drop/Drinking water และ **วัคซีนเชื้อตาย ND+IB+EDS+IC** route = **IM/SQ**"
            ]
          },
          {
            "callout": "สังเกตว่า IB ถูกให้คู่กับ ND ทุกครั้งในโปรแกรมนี้ และเข็มเชื้อตายรวม ND+IB+EDS+IC มาที่ 12 สัปดาห์ ก่อนเข้าไข่",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "avian-lt": {
    "topic": "avian-lt",
    "title": "Infectious Laryngotracheitis (ILT) โรคกล่องเสียงอักเสบติดต่อ",
    "lecturer": "ผศ.สพ.ญ.ดร.ณทยา เจริญวิศาล",
    "icon": "🐔",
    "summary": "ILT (โรคกล่องเสียงอักเสบติดต่อ) เป็น upper respiratory disease จากเชื้อ Gallid herpesvirus type 1 (GaHV-1) พบทั่วโลก อัตราการป่วยสูง 90-100% อัตราการตายปานกลาง 5-20% เชื้อเข้าทำลาย epithelial cells ของ larynx และ trachea ทำให้เกิด hemorrhagic tracheitis และ mucoid plug อุดหลอดลม ไก่ที่หายแล้วเป็นพาหะโดยเชื้อแฝงอยู่ใน trigeminal ganglion และปล่อยเชื้อออกมาเมื่อเครียด วินิจฉัยจากประวัติ อาการ รอยโรค ร่วมกับ histopathology (eosinophilic cytoplasmic inclusion body), PCR และ ELISA ควบคุมด้วยวัคซีน (เชื้อเป็น CEO/TCO และ recombinant FPV-ILT/HVT-ILT) ร่วมกับ biosecurity แบบ all in all out",
    "sections": [
      {
        "heading": "ภาพรวมของโรค (Overview)",
        "source": "1.3_ILT p.2",
        "body": [
          {
            "bullets": [
              "เป็น **upper respiratory disease**",
              "**พบได้ทั่วโลก**",
              "พบได้ใน **ไก่ ไก่ฟ้า ไก่งวง และนกหลายชนิด**",
              "**อัตราการป่วยสูง อัตราการตายปานกลาง**",
              "แพร่ระบาดได้ง่าย",
              "มักพบในไก่อายุ **≥ 8 สัปดาห์** แต่อาจพบได้ตั้งแต่อายุ **3 สัปดาห์**"
            ]
          }
        ]
      },
      {
        "heading": "เชื้อสาเหตุ (Etiology)",
        "source": "1.3_ILT p.3",
        "body": [
          {
            "text": "เกิดจากเชื้อ **Gallid herpesvirus type 1 (GaHV-1)**"
          },
          {
            "bullets": [
              "Genus **Iltovirus**",
              "Subfamily **Alphaherpesvirinae**",
              "Family **Herpesviridae**"
            ]
          },
          {
            "text": "Herpesvirus เป็น **ดีเอ็นเอไวรัสสายคู่ มีเปลือกหุ้ม**"
          },
          {
            "callout": "สไลด์นี้มีรูป virion ประกอบ (จาก viralzone.expasy.org) แต่ไม่ได้อธิบายรายละเอียดโครงสร้างเพิ่มเติมนอกจากที่เขียนไว้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "เซลล์เป้าหมาย การติดต่อ และระยะฟักตัว",
        "source": "1.3_ILT p.4",
        "body": [
          {
            "bullets": [
              "เซลล์เป้าหมาย: **epithelial cells of larynx and trachea**",
              "อวัยวะเป้าหมาย: **larynx and trachea (ด้าน mucosa)**",
              "การติดต่อ: **aerosol, oral, direct contact and contact with contaminated litter and other equipment**",
              "ระยะฟักตัวของโรค: **3-7 วัน**"
            ]
          },
          {
            "sub": "ไก่ที่หายจากโรคเป็นพาหะได้",
            "body": [
              {
                "text": "ไก่ที่หายจากอาการของโรค สามารถเป็นพาหะของโรคได้ ไวรัสจะยังอยู่ในร่างกายไก่ โดยแอบอยู่ใน **trigeminal ganglion (latent period)** ถ้าไก่เครียดก็ไวรัสสามารถแบ่งตัว และไก่จะปลดปล่อยเชื้อออกมาได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "พยาธิกำเนิด (Pathogenesis) และวงจรการแพร่เชื้อ",
        "source": "1.3_ILT p.5-6",
        "body": [
          {
            "text": "**ILT first replicate in epithelium of conjunctiva and upper respiratory tract**"
          },
          {
            "bullets": [
              "**ILTV enters through the respiratory tract, ocular and to the lesser extent through oral routes**",
              "จาก stage of infection ไก่ส่วนหนึ่งกลายเป็น **latent carriers** โดยเชื้อแฝงอยู่ **in trigeminal ganglion (activate when stress)**",
              "**Infected birds shed the virus in the respiratory secretions**",
              "**Direct transmission**: infected birds readily transmit infection than carriers ไปยัง naive birds",
              "**Survivor-carrier birds** can also transmit to naive birds",
              "**Indirect / mechanical transmission** through contaminated equipment, litter, feed bags, feathers, vehicles, dust, footwear, clothes, and movement of people"
            ]
          },
          {
            "callout": "รูปวงจรนี้อ้างอิงจาก review article Veterinary Quarterly 2020, Vol. 40, No. 1, 140-161 ชื่อ Infectious laryngotracheitis: Etiology, epidemiology, pathobiology, and advances in diagnosis and control - a comprehensive review",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการ (Clinical signs)",
        "source": "1.3_ILT p.7-8",
        "body": [
          {
            "bullets": [
              "ไอ จาม มีน้ำมูก น้ำตา",
              "**เยื่อบุตาอักเสบ (with frothy ocular secretion)**",
              "หายใจลำบาก ยืดคอ อ้าปากหายใจ",
              "ถ้ารุนแรงอาจไอ จาม ออกมาเป็น **เมือกเลือด หรือเสมหะปนเลือด**",
              "**swelling of infraorbital sinuses** บางตัวมีก้อนหนองใต้เปลือกตา",
              "**persistent nasal discharge**",
              "บางตัวมีคราบน้ำตาที่ขนบริเวณคอ และปีก",
              "**mild respiratory rale**",
              "อัตราการป่วยสูง **90-100%**",
              "อัตราการตายปานกลาง **5-20%**",
              "ไก่โตช้า ไข่ลด"
            ]
          },
          {
            "text": "สไลด์ p.8 เป็นรูปประกอบอาการ 2 รูป (จาก Disease of Poultry, 14th edition) แสดง **เยื่อบุตาอักเสบ (with frothy ocular secretion)** และ **swelling of infraorbital sinuses**"
          }
        ]
      },
      {
        "heading": "รอยโรค (Lesions)",
        "source": "1.3_ILT p.9-10",
        "body": [
          {
            "bullets": [
              "**Early stage: mucoid tracheitis**",
              "**Later stage: hemorrhage and necrosis of trachea mucosa**"
            ]
          },
          {
            "sub": "รายละเอียดของ later stage",
            "body": [
              {
                "bullets": [
                  "**Hemorrhage localized in larynx and upper trachea**",
                  "**Diphtheritic in trachea**",
                  "**Blood casts / plug in trachea lumen**",
                  "**Severe inflammation** พบรอยโรคในท่อลม ปอด และถุงลมได้"
                ]
              }
            ]
          },
          {
            "bullets": [
              "**Severe epithelial damage and hemorrhage of larynx and trachea**",
              "**Mucoid plugs in trachea and obstruct airway** ทำให้ไก่ขาดอากาศหายใจ"
            ]
          },
          {
            "text": "สไลด์ p.10 เป็นรูปหลอดลมผ่า 2 รูป (จาก Disease of Poultry, 14th edition) ระบุเป็น **mild hemorrhagic-mucoid tracheitis** และ **severe hemorrhagic tracheitis**"
          }
        ]
      },
      {
        "heading": "การวินิจฉัย (Diagnosis)",
        "source": "1.3_ILT p.11",
        "body": [
          {
            "sub": "1. จากประวัติ อาการและรอยโรค",
            "body": [
              {
                "bullets": [
                  "Histopathology: **Eosinophilic cytoplasmic inclusion body in epithelial cell**"
                ]
              }
            ]
          },
          {
            "sub": "2. การตรวจทางไวรัสวิทยา",
            "body": [
              {
                "bullets": [
                  "**Molecular techniques; PCR**"
                ]
              }
            ]
          },
          {
            "sub": "3. การตรวจทางซีรั่มวิทยา",
            "body": [
              {
                "bullets": [
                  "**ELISA**"
                ]
              }
            ]
          },
          {
            "sub": "4. วินิจฉัยแยกแยะจากโรค",
            "body": [
              {
                "bullets": [
                  "**IB, ND, LPAI**",
                  "**Avian poxvirus**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การควบคุมและป้องกันโรค ภาพรวม",
        "source": "1.3_ILT p.12",
        "body": [
          {
            "text": "สไลด์แบ่งการควบคุมและป้องกันโรคเป็น 2 หัวข้อหลัก"
          },
          {
            "bullets": [
              "**Vaccine**",
              "**Biosecurity and management**"
            ]
          }
        ]
      },
      {
        "heading": "วัคซีนเชื้อเป็น CEO และ TCO",
        "source": "1.3_ILT p.13",
        "body": [
          {
            "text": "วัคซีนเชื้อเป็น มี **2 ชนิด**"
          },
          {
            "sub": "1. Chicken embryo origin (CEO)",
            "body": [
              {
                "bullets": [
                  "Route: **eye drop, drinking water, coarse spray**",
                  "**Dose 1: 3-8 weeks old**",
                  "**Dose 2: 9-14 weeks old** หรือก่อนขึ้นไข่"
                ]
              }
            ]
          },
          {
            "sub": "2. Tissue culture origin (TCO)",
            "body": [
              {
                "bullets": [
                  "Route: **eye drop only**",
                  "**Dose 1: 4-8 weeks old**",
                  "**Dose 2: 10 สัปดาห์หลัง dose แรก** หรือก่อนขึ้นไข่"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ทั้ง CEO และ TCO **มักทำในไก่ไข่และไก่พันธุ์**",
              "**CEO ป้องกันโรคได้ดีกว่า TCO**"
            ]
          }
        ]
      },
      {
        "heading": "ข้อควรระวังในการใช้วัคซีนเชื้อเป็น",
        "source": "1.3_ILT p.14",
        "body": [
          {
            "bullets": [
              "**CEO ก่อให้เกิดการแพ้วัคซีนได้ โดยเฉพาะการทำวัคซีนโดย coarse spray ในไก่เนื้อ** (อาการแพ้วัคซีน)",
              "วัคซีนเชื้อเป็น **ไม่ควรให้ก่อนอายุ 3 สัปดาห์**",
              "**ไม่ควรให้วัคซีนเชื้อเป็น ILT ในช่วงเดียวกับที่ให้วัคซีนป้องกันโรคระบบหายใจอื่นๆ ควรให้ห่างกันประมาณ 7 วัน**",
              "การทำวัคซีน (CEO) **ไม่ทั่วทั้งฝูง** อาจทำให้เชื้อไวรัสของวัคซีนพัฒนาให้สามารถก่อโรค ติดเชื้อและแพร่กระจายไปในฝูงได้ (**rolling infection**)"
            ]
          },
          {
            "callout": "ในสไลด์ ข้อความ (อาการแพ้วัคซีน) ถูกไฮไลต์สีเหลือง และข้อ ไม่ควรให้ก่อนอายุ 3 สัปดาห์ ถูกกำกับด้วยเครื่องหมายดอกจันคู่ แสดงว่าอาจารย์เน้น 2 จุดนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Recombinant vaccine (Virus vector vaccine)",
        "source": "1.3_ILT p.15",
        "body": [
          {
            "sub": "1. Fowlpox virus (FPV-ILT)",
            "body": [
              {
                "bullets": [
                  "บรรจุ **GaHV-1 glycoprotein B and UL32 protein**",
                  "**wing-web vaccination in breeder, 7-8 weeks old**",
                  "**Subcutaneous vaccination in 1 day old in layer**"
                ]
              }
            ]
          },
          {
            "sub": "2. Turkey herpesvirus (HVT-ILT)",
            "body": [
              {
                "bullets": [
                  "บรรจุ **GaHV-1 glycoprotein I, D and B protein**",
                  "**Subcutaneous vaccination in 1 day old in layer, breeder**",
                  "**in ovo vaccination in layer, breeder, broiler**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างโปรแกรมวัคซีน: ไก่พันธุ์",
        "source": "1.3_ILT p.16",
        "body": [
          {
            "bullets": [
              "**TCO: eye drop 4-6 weeks old**"
            ]
          },
          {
            "sub": "ในฝูงที่มีการแพร่ระบาดของ ILT สูง และบริเวณใกล้เคียงมีฟาร์มไก่เนื้อและไก่ไข่อยู่หนาแน่น",
            "body": [
              {
                "bullets": [
                  "**CEO: drinking water; twice at 4-5- and 10-12-week-old**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างโปรแกรมวัคซีน: ไก่ไข่",
        "source": "1.3_ILT p.17",
        "body": [
          {
            "bullets": [
              "**Recombinant vaccine: S/C at 1 day old**",
              "ตามด้วย **TCO: eye drop** หรือ **CEO: eye drop or drinking water at 8-12-week-old**"
            ]
          },
          {
            "text": "หรือ"
          },
          {
            "bullets": [
              "**FPV-ILT: wing web at 5-12-week-old**"
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างโปรแกรมวัคซีน: ไก่เนื้อ",
        "source": "1.3_ILT p.18",
        "body": [
          {
            "bullets": [
              "**Recombinant vaccine: S/C at 1 day old** เพื่อ **ลดความเสี่ยงในการแพ้วัคซีน**"
            ]
          },
          {
            "sub": "แต่ถ้าเกิดการระบาดที่การให้เพียง Recombinant vaccine ควบคุมไม่ได้",
            "body": [
              {
                "bullets": [
                  "ให้วัคซีน **CEO: drinking water at 7-12-day-old**",
                  "และเมื่อควบคุมโรคได้แล้ว **ให้กลับไปใช้เพียง Recombinant vaccine ในฝูงถัดไป**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ข้อสรุปเรื่องวัคซีน และการให้วัคซีนตอนเกิดการระบาด",
        "source": "1.3_ILT p.19",
        "body": [
          {
            "bullets": [
              "**Recombination vaccine สามารถลดอาการป่วยและอัตราการตายในไก่เนื้อได้ แต่ไม่สามารถลดการแพร่เชื้อได้เท่าวัคซีน CEO**",
              "หากเกิดการระบาดของโรค **การให้วัคซีนจะช่วยลดการระบาดได้**"
            ]
          },
          {
            "sub": "วิธีให้เมื่อเกิดการระบาด",
            "body": [
              {
                "bullets": [
                  "ควรให้โดยการ **coarse spray หรือ drinking water (2 dose ต่อเนื่อง)** โดย **drinking water จะแพ้น้อยกว่า**",
                  "**แต่การหยอดตา มักลดการระบาดไม่ทัน**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เขียนคำว่า Recombination vaccine ในหน้านี้ ขณะที่หน้า p.15 ใช้คำว่า Recombinant vaccine ผมคงคำตามที่พิมพ์ในแต่ละสไลด์",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Biosecurity และการจัดการ",
        "source": "1.3_ILT p.20",
        "body": [
          {
            "bullets": [
              "**โรคมักวนเวียนอยู่ในฟาร์มที่มีการเลี้ยงไก่หลายอายุร่วมกัน** จึงควร **เลี้ยงไก่อายุเดียวกัน = all in all out**",
              "**ทำความสะอาดให้ทั่วถึงและพักเล้านานพอ**",
              "ให้ความสำคัญกับความสะอาดของ **พื้น/สิ่งปูรอง, รางน้ำ รางอาหาร**"
            ]
          },
          {
            "callout": "สไลด์ชุดนี้จบที่ biosecurity แล้วต่อด้วยสไลด์ปิดที่เป็นรูปประกอบอย่างเดียว (p.21) สไลด์ไม่ได้กล่าวถึงการรักษา (treatment) หรือรายละเอียดของสารฆ่าเชื้อและระยะเวลาพักเล้าที่แน่นอน",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "avian-mpv": {
    "topic": "avian-mpv",
    "title": "Avian Metapneumovirus (AMPV) / โรคหัวบวม",
    "lecturer": "ผศ.สพ.ญ.ดร.ณทยา เจริญวิศาล ภาควิชาอายุรศาสตร์ คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
    "icon": "🐔",
    "summary": "โรคหัวบวม (Avian Metapneumovirus, AMPV หรือ Swollen head syndrome, SHS) เป็นโรคทางเดินหายใจที่ติดต่อได้ง่ายมาก พร้อมกับก่อความผิดปกติของระบบสืบพันธุ์ นกป่าเป็น natural reservoir ลักษณะเด่นคือ high morbidity แต่ low mortality ยกเว้นเมื่อมี secondary infection เชื้ออยู่ใน genus Metapneumovirus วงศ์ Pneumoviridae เป็น RNA ไวรัสสายเดี่ยว (สายลบ) มีเปลือกหุ้ม แบ่งเป็น 4 subtypes (A, B, C, D) ไวรัสเพิ่มจำนวนที่ upper respiratory tract ทำให้เกิด ciliostasis และสูญเสีย cilia จึงเปิดทางให้เชื้อแทรกซ้อน สไลด์ครอบคลุมประวัติโรค อาการ รอยโรค การวินิจฉัย การเก็บตัวอย่าง การควบคุม biosecurity management และโปรแกรมวัคซีน",
    "sections": [
      {
        "heading": "โรคหัวบวมคืออะไร (ภาพรวม)",
        "source": "1.4_AMPV p.2",
        "body": [
          {
            "text": "Avian Metapneumovirus (AMPV หรือ aMPV) มีชื่อเรียกอื่นตามที่สไลด์ระบุคือ Swollen head syndrome (SHS) และ โรคหัวบวม"
          },
          {
            "sub": "ลักษณะสำคัญของโรค",
            "body": [
              {
                "bullets": [
                  "แสดงออกได้ 2 ระบบ คือ **Respiratory disease** และ **Reproductive disorder**",
                  "เป็น **Highly contagious infectious respiratory disease**",
                  "**Wild birds are natural reservoirs**",
                  "**High morbidity, low mortality** (ยกเว้นมี secondary infection)"
                ]
              }
            ]
          },
          {
            "sub": "ความสำคัญในไก่งวง",
            "body": [
              {
                "bullets": [
                  "เป็นโรคสำคัญในไก่งวง เรียกว่า **Turkey rhinotracheitis (TRT)**",
                  "อัตราการป่วยอาจสูง **100%** อัตราการตายอาจถึง **50% ในลูกไก่งวง**",
                  "อาการทางระบบหายใจ และอาจพบท่อนำไข่ยื่นออกมา"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ประวัติช่วงแรกของโรคหัวบวม",
        "source": "1.4_AMPV p.3",
        "body": [
          {
            "bullets": [
              "รายงานครั้งแรกในไก่งวง ประมาณปี **ค.ศ. 1970 ประเทศแอฟริกาใต้** (ตอนนั้นจัดอยู่ใน genus *Pneumovirus*)",
              "ประมาณปี **1980** พบในไก่ และเรียกว่า **Swollen head syndrome (SHS)**",
              "ประมาณปี **1990** เริ่มพัฒนาวัคซีนเชื้อเป็น",
              "ปี **1994** พบว่ามี **2 subtype คือ A และ B**",
              "ปี **1996** พบการระบาดใหญ่ในไก่งวงในรัฐ Colorado, Minnesota และในนกตามธรรมชาติ แต่ไม่พบในไก่ และพบว่าเป็นอีก subtype คือ **subtype C**"
            ]
          },
          {
            "sub": "การกระจายของ subtype C ต่อมา",
            "body": [
              {
                "text": "ต่อมาพบในเป็ดและไก่ในฝรั่งเศสและจีน และในไก่ฟ้าในเกาหลี และนกน้ำตามธรรมชาติในประเทศเนเธอร์แลนด์ แต่แตกต่างจากสายพันธุ์อเมริกันเล็กน้อย"
              }
            ]
          },
          {
            "sub": "subtype D",
            "body": [
              {
                "text": "ส่วน subtype D เจอจากการทำ **retrospective molecular analysis** จากไก่งวงในประเทศฝรั่งเศสที่เก็บตัวอย่างประมาณปี **1985** (แต่ไม่พบ subtype นี้อีก)"
              }
            ]
          }
        ]
      },
      {
        "heading": "เชื้อสาเหตุและการจัดจำแนก (Classification)",
        "source": "1.4_AMPV p.4",
        "body": [
          {
            "bullets": [
              "เกิดจากเชื้อ **Avian Metapneumovirus (AMPV)**",
              "Genus ***Metapneumovirus***",
              "Family ***Pneumoviridae***"
            ]
          },
          {
            "text": "Metapneumovirus เป็น **อาร์เอ็นเอไวรัสสายเดี่ยว (สายลบ) มีเปลือกหุ้ม**"
          },
          {
            "sub": "จากรูปโครงสร้างไวรัสในสไลด์ (Pictures from viralzone.expasy.org)",
            "body": [
              {
                "text": "คำบรรยายใต้รูประบุว่า Enveloped, spherical. Diameter from about **150 nm**"
              },
              {
                "bullets": [
                  "โปรตีนที่ชี้ในรูป: Glycoprotein (G), Fusion protein (F), SH protein, Matrix protein (M), Phosphoprotein (P), Nucleoprotein (N), Polymerase (L)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Subtypes ของ AMPV",
        "source": "1.4_AMPV p.5",
        "body": [
          {
            "bullets": [
              "Avian Metapneumovirus (AMPV) มี **4 subtypes: A, B, C, D**",
              "**มักจะพบ subtype A และ B**",
              "**subtype C** พบเฉพาะในสหรัฐอเมริกาและฝรั่งเศส และพบเฉพาะในไก่งวง",
              "**subtype D** พบเฉพาะในฝรั่งเศส"
            ]
          }
        ]
      },
      {
        "heading": "เซลล์เป้าหมาย การติดต่อ และระยะฟักตัว",
        "source": "1.4_AMPV p.6",
        "body": [
          {
            "bullets": [
              "เซลล์เป้าหมาย: **epithelial cells of respiratory tract and reproductive tract**",
              "อวัยวะเป้าหมาย: **Respiratory tract and reproductive tract**",
              "การติดต่อ: **direct contact, aerosol**",
              "ระยะฟักตัวของโรค: **3-5 วัน**",
              "**Recovery within 10-14 days**",
              "Susceptible age: **all ages**"
            ]
          }
        ]
      },
      {
        "heading": "พยาธิกำเนิดในทางเดินหายใจ (Respiratory tract)",
        "source": "1.4_AMPV p.7",
        "body": [
          {
            "bullets": [
              "**Replicate in upper respiratory tract**",
              "**Induces ciliostasis**",
              "**Loss of cilia**",
              "**Allow 2nd infection**"
            ]
          },
          {
            "text": "กล่องเน้นในสไลด์ระบุว่า **Virus can be found in nasal turbinates, Harderian gland, trachea, and lung**"
          },
          {
            "callout": "รูปประกอบด้านขวาของสไลด์นี้ (เปรียบเทียบ health กับ disease ในระดับ URT และ LRT) ถูกตัดขอบไป อ่านข้อความในรูปไม่ครบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "อาการทางคลินิก (Clinical signs)",
        "source": "1.4_AMPV p.8",
        "body": [
          {
            "sub": "อัตราการป่วยและอัตราการตาย",
            "body": [
              {
                "bullets": [
                  "**Morbidity rate 4-10% ในไก่, but can be up to 100%**",
                  "**Low mortality rate, can be 0.4% to 2%** (can be up to **50% in young turkey** and by secondary infection or co-infection)"
                ]
              }
            ]
          },
          {
            "sub": "Mild respiratory disease",
            "body": [
              {
                "bullets": [
                  "กินน้ำ กินอาหารลดลง",
                  "**rales**, ไอ จาม มีน้ำมูก",
                  "**foamy conjunctivitis**",
                  "**submandibular edema** (อาจพบลักษณะเป็น gelatin หรือหนอง)",
                  "**swelling of periorbital and infraorbital sinuses**",
                  "**Torticollis, disorientation, opisthotonos**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาพอาการจากตำรา",
        "source": "1.4_AMPV p.9",
        "body": [
          {
            "bullets": [
              "Figure 3.6 Avian metapneumovirus (AMPV) infection in a chicken. Experimental infection leads to **foaming eyes and nasal discharge**. Source: S. Rautenschlein (จากตำรา Disease of Poultry, 14th ed.)",
              "Fig. 4 **Swollen head syndrome in a 29 day-old broiler chicken** (จากตำรา Avian Disease Manual, 7th ed.)"
            ]
          }
        ]
      },
      {
        "heading": "Secondary infection และผลต่อการให้ไข่",
        "source": "1.4_AMPV p.10",
        "body": [
          {
            "text": "สไลด์ยังอยู่ภายใต้หัวข้อ Mild respiratory disease โดยระบุว่า **increase mortality rate to 25%, if secondary infection**"
          },
          {
            "sub": "เชื้อแทรกซ้อนที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "***E.coli*** (ทำให้เกิด Torticollis, disorientation, opisthotonos)",
                  "***Mycoplasma gallisepticum*, *M. synoviae***",
                  "**lentogenic NDV, Avian Influenza**",
                  "**IB**",
                  "Etc."
                ]
              }
            ]
          },
          {
            "sub": "ผลต่อระบบสืบพันธุ์",
            "body": [
              {
                "bullets": [
                  "**ไข่ลด อาจถึง 15-30% ในไก่** และพบไข่เปลือกบาง สีซีด",
                  "**peritonitis**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "รอยโรค (Lesions)",
        "source": "1.4_AMPV p.11",
        "body": [
          {
            "sub": "ระบบหายใจ",
            "body": [
              {
                "bullets": [
                  "**swelling infraorbital sinus**",
                  "**watery to mucoid exudate in turbinates**",
                  "**mucus in trachea**",
                  "**yellow gelatinous to purulent edema in subcutaneous tissue of the head, neck, wattle**"
                ]
              }
            ]
          },
          {
            "sub": "ระบบสืบพันธุ์",
            "body": [
              {
                "bullets": [
                  "**Egg peritonitis**",
                  "**misshapen eggs, thin shell, discolor, rough egg**",
                  "**salphingitis** (สะกดตามที่พิมพ์ในสไลด์)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัย (Diagnosis)",
        "source": "1.4_AMPV p.12",
        "body": [
          {
            "sub": "1. จากประวัติ อาการและรอยโรค",
            "body": [
              {
                "text": "สไลด์ระบุเป็นข้อแรกโดยไม่ได้ขยายความเพิ่ม"
              }
            ]
          },
          {
            "sub": "2. การตรวจทางไวรัสวิทยา",
            "body": [
              {
                "bullets": [
                  "เพาะแยกเชื้อใน **ไก่ปลอดเชื้อ, ไข่ไก่ฟัก, cell culture, Tracheal organ culture** (แต่**เพาะเชื้อได้ยาก**)",
                  "Molecular techniques: **RT-PCR**"
                ]
              }
            ]
          },
          {
            "sub": "3. การตรวจทางซีรั่มวิทยา",
            "body": [
              {
                "bullets": [
                  "**ELISA**",
                  "**Virus neutralization test (VN)**"
                ]
              }
            ]
          },
          {
            "sub": "4. วินิจฉัยแยกแยะจากโรค",
            "body": [
              {
                "bullets": [
                  "**ND, IBV, LPAI, Infectious coryza, Mycoplasma infection**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การเก็บตัวอย่าง: ชนิดตัวอย่างและจังหวะเวลา",
        "source": "1.4_AMPV p.13",
        "body": [
          {
            "bullets": [
              "เก็บชิ้นเนื้อ **ท่อลม ปอด ovary, uterus**",
              "**Ocular and nasal secretions**",
              "**Choanal swabs**"
            ]
          },
          {
            "callout": "ต้องเก็บทันทีในช่วงที่ไก่ติดเชื้อ หรือมีอาการ เพราะไวรัสจะอยู่บริเวณ sinus, turbinate แค่ **6-7 วัน**",
            "kind": "warn"
          },
          {
            "sub": "วิธีทำ Choanal cleft swab (จากรูปในสไลด์)",
            "body": [
              {
                "bullets": [
                  "If you are right-handed",
                  "Use your left hand to open chicken mouth/beak",
                  "Use your right hand holding the swab",
                  "Gently swab at the cleft area"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การเก็บตัวอย่าง: จากสัตว์เป็นและจากการผ่าซาก",
        "source": "1.4_AMPV p.14",
        "body": [
          {
            "text": "**Collect sample at early stage of infection or from severely sick animal**"
          },
          {
            "sub": "Sample collection from live animal",
            "body": [
              {
                "bullets": [
                  "**Oropharyngeal swab**",
                  "**Choanal cleft swab**",
                  "**Tracheal swab**",
                  "**Nasal exudate**"
                ]
              }
            ]
          },
          {
            "sub": "Sample collection during necropsy",
            "body": [
              {
                "bullets": [
                  "**Scraping sinus turbinate or collect trachea exudate**",
                  "Respiratory organs: **trachea, lung**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การควบคุมโรค",
        "source": "1.4_AMPV p.15",
        "body": [
          {
            "bullets": [
              "**แยกตัวป่วยออกจากฝูง**",
              "**ให้ยาปฏิชีวนะ เพื่อควบคุมหรือลดการติดเชื้อแบคทีเรียแทรกซ้อน**",
              "**หลีกเลี่ยงการตัดปากและให้วัคซีนในช่วงที่ไก่ป่วย**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุชนิดยาปฏิชีวนะหรือขนาดยาที่ใช้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การป้องกันโรค: 2 เสาหลัก",
        "source": "1.4_AMPV p.16",
        "body": [
          {
            "bullets": [
              "1. **Vaccine**",
              "2. **Biosecurity and management**"
            ]
          }
        ]
      },
      {
        "heading": "Biosecurity",
        "source": "1.4_AMPV p.17",
        "body": [
          {
            "bullets": [
              "เลี้ยงไก่อายุเดียวใน 1 โรงเรือน (**all in all out**)",
              "ควบคุมการเข้าออกของคน สัตว์ สิ่งของ ยานพาหนะ",
              "**ระวังไม่ให้นกธรรมชาติเข้ามาในโรงเรือน**",
              "การทำความสะอาด ฆ่าเชื้อ โรงเรือน สิ่งของ ยานพาหนะ",
              "สุขศาสตร์ของฟาร์ม พนักงาน"
            ]
          },
          {
            "callout": "ข้อ ระวังไม่ให้นกธรรมชาติเข้ามาในโรงเรือน สอดคล้องกับที่สไลด์ p.2 ระบุว่า wild birds เป็น natural reservoirs",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Disinfectant ที่ใช้ได้",
        "source": "1.4_AMPV p.18",
        "body": [
          {
            "bullets": [
              "**quaternary ammonium compounds (Quats)**",
              "**Iodophore**",
              "**Phenol**",
              "**Sodium hypochloride** (สะกดตามที่พิมพ์ในสไลด์)"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุความเข้มข้นหรือ contact time ของน้ำยาฆ่าเชื้อแต่ละชนิด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Management",
        "source": "1.4_AMPV p.19",
        "body": [
          {
            "bullets": [
              "**การถ่ายเทอากาศที่ดี อุณหภูมิที่เหมาะสม**",
              "ความหนาแน่น",
              "คุณภาพสิ่งปูรอง",
              "ความสะอาด",
              "คุณภาพอาหาร และน้ำ",
              "**ระวัง secondary infection**"
            ]
          }
        ]
      },
      {
        "heading": "วัคซีน: ชนิดและคุณสมบัติ",
        "source": "1.4_AMPV p.20-21",
        "body": [
          {
            "text": "สไลด์ p.20 แบ่งวัคซีนเป็น 2 ชนิด คือ **วัคซีนเชื้อเป็น** และ **วัคซีนเชื้อตาย** แล้วขยายรายละเอียดใน p.21"
          },
          {
            "sub": "1. เชื้อเป็น (live)",
            "body": [
              {
                "bullets": [
                  "**Stimulate both systemic immunity and local immunity in the respiratory tract**",
                  "**Subtype A & B showed good cross protection**",
                  "Route: **spray, drinking water, eye drop**"
                ]
              }
            ]
          },
          {
            "sub": "2. เชื้อตาย (killed)",
            "body": [
              {
                "bullets": [
                  "ใช้ใน **ไก่พ่อแม่พันธุ์**",
                  "ให้ช่วงอายุ **16-20 สัปดาห์**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "คำแนะนำการทำวัคซีน และการรบกวนจากวัคซีน IB กับ NDV",
        "source": "1.4_AMPV p.22",
        "body": [
          {
            "sub": "recommend",
            "body": [
              {
                "bullets": [
                  "**วัคซีนเชื้อเป็น 2 ครั้ง และ วัคซีนเชื้อตาย 1 ครั้ง**",
                  "**วัคซีนเชื้อเป็น 1 ครั้งไม่เพียงพอที่จะป้องกันโรค**"
                ]
              }
            ]
          },
          {
            "callout": "**The use of a live IB and NDV vaccines may interfere with the replication of live AMPV vaccines, resulting in a reduction in the AMPV antibody response**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ตัวอย่างโปรแกรมวัคซีนในประเทศไทย",
        "source": "1.4_AMPV p.23",
        "body": [
          {
            "text": "**ในประเทศไทยจะทำวัคซีนโรคหัวบวมเฉพาะฝูงที่มีปัญหา**"
          },
          {
            "sub": "ตัวอย่างโปรแกรมวัคซีนในฝูงพ่อแม่พันธุ์ไก่เนื้อ",
            "body": [
              {
                "bullets": [
                  "ครั้งแรก (เชื้อเป็น): **12 สัปดาห์ (drinking water)**",
                  "ครั้งที่ 2 (เชื้อตาย): **16 สัปดาห์ (IM)**"
                ]
              },
              {
                "text": "หรืออาจเพิ่มการให้วัคซีนเชื้อเป็นที่อายุ **1 วัน** โดยการ **coarse sprayed, eye drop, drinking water**"
              }
            ]
          }
        ]
      }
    ]
  },
  "avian-nd": {
    "topic": "avian-nd",
    "title": "โรคนิวคาสเซิล (Newcastle Disease, ND)",
    "lecturer": "ผศ.สพ.ญ.ดร. ณฐยา เจริญวิศาล",
    "icon": "🐔",
    "summary": "เลกเชอร์ ND ของวิชา Avian Medicine (3107510) ปี 5 ครอบคลุมตั้งแต่ประวัติ 100 ปีของโรค (รายงานครั้งแรก ค.ศ. 1926 ที่ Java อินโดนีเซีย และ Newcastle upon Tyne อังกฤษ) ตัวเชื้อ NDV (APMV-1, Family Paramyxoviridae, RNA สายเดี่ยวสายลบ มีเปลือกหุ้ม, 1 serotype แต่ 21 genotypes) การแบ่ง 5 pathotypes และเกณฑ์ของ WOAH (MDT, ICPI, IVPI) อาการและรอยโรคแยกตามระบบหายใจ ทางเดินอาหาร และประสาท การวินิจฉัยพร้อมเทคนิคเก็บ swab การบรรจุ 3 ชั้นและการเก็บรักษาตัวอย่าง จนถึงการควบคุมป้องกันด้วย biosecurity, management และวัคซีน (เชื้อเป็น เชื้อตาย recombinant) พร้อมตัวอย่างโปรแกรมวัคซีนไก่เนื้อและไก่ไข่ ประเด็นปิดท้ายที่อาจารย์ย้ำคือวัคซีนป้องกันอาการและการตายได้ แต่ป้องกันการติดเชื้อไม่ได้",
    "sections": [
      {
        "heading": "โรคนิวคาสเซิลคืออะไร และทำไมต้องสนใจ",
        "source": "1.1_NDV p.2",
        "body": [
          {
            "bullets": [
              "ND เกิดจากเชื้อ **Newcastle disease virus (NDV)**",
              "NDV can be able to infect **over 200 species of birds**",
              "อัตราการตายสูงถึง **100% ในไก่ที่ไม่ได้รับวัคซีน**",
              "ก่อให้เกิดโรคใน **ระบบหายใจ ระบบทางเดินอาหาร ระบบประสาท**",
              "ND can cause **conjunctivitis in human**"
            ]
          },
          {
            "callout": "ตัวเลขที่ต้องจำจากสไลด์แรกสุด คือ 200 ชนิดของนกที่ติดเชื้อได้ และ 100% mortality ในฝูงที่ไม่ได้รับวัคซีน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ประวัติช่วงแรก 100 ปีของโรคนิวคาสเซิล (อินโดนีเซีย)",
        "source": "1.1_NDV p.3-5",
        "body": [
          {
            "text": "สไลด์วางกรอบเรื่องเป็น **100 ปี ของโรคนิวคาสเซิล** โดยเริ่มจากรายงานครั้งแรก"
          },
          {
            "sub": "รายงานครั้งแรก",
            "body": [
              {
                "bullets": [
                  "ในเดือน **มีนาคม ปี ค.ศ. 1926**",
                  "ที่ **เกาะชวา ประเทศอินโดนีเซีย**",
                  "เมือง **ปัตตาเวีย (Batavia)** ปัจจุบัน คือ เมืองจาการ์ตา"
                ]
              }
            ]
          },
          {
            "sub": "ชื่อเรียกในยุคแรก",
            "body": [
              {
                "bullets": [
                  "**Prof. Dr. F.C. Kraneveld** รายงานโรคนี้ในชื่อ **New Poultry Disease**",
                  "ภาษาอินโดนีเซีย เรียกว่า โรค **Tetelo** แปลว่า **คอบิด**",
                  "ช่วงแรก รู้จักในชื่อ **Psuedo Fowl Pest** เนื่องจากมีอาการคล้าย Fowl Plague หรือ ไข้หวัดนก"
                ]
              }
            ]
          },
          {
            "text": "หลังจากปี 1926 โรคนิวคาสเซิลกลายเป็น **โรคประจำถิ่นของอินโดนีเซีย** สไลด์แสดงภาพ VEEARTSENIJKUNDIGE INSTITUUT, Buitenzorg (Bogor) ปี 1927-1941 ประกอบ"
          }
        ]
      },
      {
        "heading": "ประวัติช่วงแรก (อังกฤษ) และที่มาของชื่อ Newcastle",
        "source": "1.1_NDV p.6-7",
        "body": [
          {
            "text": "ช่วงฤดูร้อนในปีเดียวกัน (ค.ศ. 1926) พบที่ฟาร์มแห่งหนึ่งใกล้เมืองท่าในประเทศอังกฤษ"
          },
          {
            "bullets": [
              "ฟาร์มแห่งหนึ่งใกล้เมือง Newcastle (สไลด์ p.6 พิมพ์ว่า Newcastle-upon-type และ p.7 พิมพ์ว่า **Newcastle upon Tyne, England**) ประเทศอังกฤษ เป็น **เมืองท่า**",
              "**Dr. T.M. Doyle (Weybridge Laboratory)** เป็นผู้รายงาน โดยสไลด์แสดงหน้าปกบทความ NEWCASTLE DISEASE OF FOWLS ลงวันที่ MARCH 30th, 1935",
              "ในช่วงแรกก็สับสนกับโรคไข้หวัดนก"
            ]
          },
          {
            "callout": "สไลด์ p.7 สรุปว่ารายงานครั้งแรกในปี ค.ศ. 1926 เกิดขึ้นทั้งที่ Java, Indonesia และที่ Newcastle upon Tyne, England",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การระบาดทั่วโลกและความเสียหายทางเศรษฐกิจ",
        "source": "1.1_NDV p.7",
        "body": [
          {
            "bullets": [
              "แพร่ไปทั่วโลกในเวลา **10 ปี**",
              "ในช่วงปี **1940** พบ low to moderate strain in US",
              "ในปี **1941, 1946, 1951** พบสายพันธุ์รุนแรง ใน US",
              "ในปี **1971, 2002** พบสายพันธุ์รุนแรง ใน US และทำการกำจัดไก่ที่ติดเชื้อ มีบันทึกไว้ว่าใช้เงินไปถึง **52M USD และ 170M USD**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุว่าตัวเลข 52M USD กับ 170M USD ตรงกับปีไหนแบบจับคู่ชัดเจน บอกเพียงว่าเป็นค่าใช้จ่ายของการระบาดปี 1971 และ 2002",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เชื้อก่อโรค: ชื่อเรียก การจัดจำแนก และโครงสร้างไวรัส",
        "source": "1.1_NDV p.8",
        "body": [
          {
            "sub": "ชื่อของเชื้อ (สไลด์ให้ไว้หลายชื่อ)",
            "body": [
              {
                "bullets": [
                  "**Newcastle disease virus (NDV)**",
                  "หรือ **Avian avulavirus 1**",
                  "หรือ **Avian paramyxovirus type 1 (APMV-1)**",
                  "หรือ Avian orthoavulavirusvirus 1 (สะกดตามที่พิมพ์บนสไลด์)",
                  "Genus ***Orthoavulavirus***",
                  "Family ***Paramyxoviridae***"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้าง",
            "body": [
              {
                "bullets": [
                  "Newcastle virus เป็น **อาร์เอ็นเอไวรัสสายเดี่ยว (สายลบ) มีเปลือกหุ้ม**",
                  "Enveloped, spherical. **Diameter of about 150 nm**",
                  "โปรตีนที่แสดงในรูป: **Hemagglutinin-neuraminidase (HN)**, **Fusion protein (F)**, Matrix protein (M), Phosphoprotein (P), Nucleoprotein (N), Polymerase (L)"
                ]
              }
            ]
          },
          {
            "text": "รูปประกอบมาจาก viralzone.expasy.org"
          }
        ]
      },
      {
        "heading": "Serotype กับ Genotype ของ NDV",
        "source": "1.1_NDV p.9",
        "body": [
          {
            "bullets": [
              "AMPV มี **21 serotype: AMPV1-21** (สไลด์หน้านี้สะกดว่า AMPV ส่วนหน้า p.8 สะกดว่า APMV-1)",
              "NDV (AMPV-1) has **1 serotype**",
              "NDV has been classified into **21 genotypes**",
              "**All genotypes are in the same serotype**",
              "**Antibody induce from each genotype can cross protect the other NDV genotype**"
            ]
          },
          {
            "callout": "จุดที่มักออกสอบ: NDV มี serotype เดียว แต่มีถึง 21 genotypes และแอนติบอดีจาก genotype หนึ่งสามารถ cross protect genotype อื่นได้",
            "kind": "tip"
          },
          {
            "text": "อ้างอิงในสไลด์: (Dimitrov, et al. 2019)"
          }
        ]
      },
      {
        "heading": "Genotype ที่สำคัญ (วัคซีน และสายพันธุ์ของเอเชียตะวันออกเฉียงใต้)",
        "source": "1.1_NDV p.10",
        "body": [
          {
            "bullets": [
              "NDV has been classified into 21 genotypes",
              "**Genotype I & II: vaccine**",
              "**Genotype VII** แบ่งย่อยเป็น VII.1.1 (VIIb, VIId, VIIe, VIIj, VIII), VII.1.2 (VIIf), VII.2 (VIIa, VIIh, VIIk)",
              "Genotype VII **important in South East Asia**"
            ]
          },
          {
            "callout": "สไลด์ระบุแค่ว่า genotype VII สำคัญในเอเชียตะวันออกเฉียงใต้ แต่ไม่ได้บอกสถานการณ์ genotype ที่ระบาดในประเทศไทยโดยเฉพาะ",
            "kind": "flag"
          },
          {
            "text": "อ้างอิงในสไลด์: (Dimitrov, et al. 2019)"
          }
        ]
      },
      {
        "heading": "NDV มี 5 pathotypes",
        "source": "1.1_NDV p.11",
        "body": [
          {
            "bullets": [
              "**Viscerotropic velogenic (vvNDV)**",
              "**Neurotropic velogenic (nvNDV)**",
              "**Mesogenic**",
              "**Lentogenic**",
              "**Asymtomatic enteric or subclinical** (สะกดตามสไลด์)"
            ]
          }
        ]
      },
      {
        "heading": "การแบ่ง pathotypes ตาม OIE (WOAH) วิธีที่ 1: Mean Dead Time (MDT)",
        "source": "1.1_NDV p.12",
        "body": [
          {
            "text": "ทดสอบใน **Chicken embryo after inoculate in allantoic sac**"
          },
          {
            "bullets": [
              "**Less than 60 hrs = high virulent (velogenic)**",
              "**60-90 hrs = moderate virulent (mesogenic)**",
              "**Greater than 90 hrs. = low virulent (lentogenic)**"
            ]
          }
        ]
      },
      {
        "heading": "วิธีที่ 2: Intracerebral pathogenicity index (ICPI)",
        "source": "1.1_NDV p.13",
        "body": [
          {
            "sub": "วิธีทำ",
            "body": [
              {
                "bullets": [
                  "ลูกไก่ **SPF อายุ 1 วัน หรืออายุ 24-40 ชั่วโมง จำนวน 10 ตัว**",
                  "ฉีดไวรัส (น้ำไข่ฟัก) **0.05 ml, 1:10 dilution**",
                  "**HA titer > 16**",
                  "ดูการป่วยการตาย **8 วัน**",
                  "ให้คะแนน แล้วหาค่า mean score โดย **0 = normal, 1 = sick, 2 = dead**"
                ]
              }
            ]
          },
          {
            "sub": "การแปลผล",
            "body": [
              {
                "bullets": [
                  "**ICPI > 1.5 = velogenic**",
                  "**ICPI 0.7 - 1.5 = mesogenic**",
                  "**ICPI < 0.7 = lentogenic**"
                ]
              }
            ]
          },
          {
            "callout": "**ICPI ≥ 0.7 จึงจะนับเป็นเชื้อก่อโรครุนแรง ที่ต้องรายงาน WOAH**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "วิธีที่ 3: Intravenous pathogenicity index (IVPI)",
        "source": "1.1_NDV p.14",
        "body": [
          {
            "bullets": [
              "**ปัจจุบันไม่ค่อยใช้วิธีนี้แล้ว** โดยสไลด์ระบุว่า **ใช้ในโรคไข้หวัดนก**",
              "ไก่อายุ **6 สัปดาห์ จำนวน 10 ตัว**",
              "ให้ไวรัส **0.1 ml ทาง wing vein**",
              "ให้คะแนนอาการเวลาเดิมทุกวัน เป็นเวลา **10 วัน**",
              "**0 = normal, 1 = sick, 2 = severe, 3 = dead**",
              "คำนวณดังตาราง แล้ว **หาร 100**"
            ]
          },
          {
            "sub": "ค่าสุดขั้วสองด้าน",
            "body": [
              {
                "bullets": [
                  "**Mean IVPI = 3** (ตายทั้ง 10 ตัว ภายใน 24 ชั่วโมง)",
                  "**Mean IVPI = 0** (ไม่ป่วยเลยทั้ง 10 ตัว ตลอด 10 วัน)",
                  "**IVPI > 1.2 = High Pathogenic avian influenza virus**"
                ]
              }
            ]
          },
          {
            "text": "ตารางตัวอย่างในสไลด์ (OIE/FAO international reference laboratory for AI, Appendix 1) อ่านคอลัมน์คะแนนได้ว่า Normal 20 x 0 = 0, Sick 3 x 1 = 3, Paralysed 10 x 2 = 20, Dead 67 x 3 = 201 รวม **Total = 224** ส่วนตัวเลขรายวัน D1-D10 ในตารางพิมพ์เล็กมากจนอ่านได้ไม่ครบทุกช่อง"
          }
        ]
      },
      {
        "heading": "รายละเอียดของ pathotype ที่รุนแรง (vvNDV, nvNDV, Mesogenic)",
        "source": "1.1_NDV p.15",
        "body": [
          {
            "sub": "1. Viscerotropic velogenic (vvNDV)",
            "body": [
              {
                "bullets": [
                  "**hemorrhage lesion in gastrointestinal tract**",
                  "neurologic signs"
                ]
              }
            ]
          },
          {
            "sub": "2. Neurotropic velogenic (nvNDV)",
            "body": [
              {
                "bullets": [
                  "**neurologic sign**",
                  "**respiratory involvement**",
                  "พบใน US"
                ]
              }
            ]
          },
          {
            "sub": "3. Mesogenic",
            "body": [
              {
                "bullets": [
                  "**low or no mortality**",
                  "neurologic signs",
                  "**dead in young chicken**"
                ]
              }
            ]
          },
          {
            "callout": "จุดแยก vvNDV กับ nvNDV คือ vvNDV เด่นที่รอยโรคเลือดออกในทางเดินอาหาร ส่วน nvNDV เด่นที่อาการทางประสาทร่วมกับระบบหายใจ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "รายละเอียดของ pathotype ที่ไม่รุนแรง (Lentogenic, Asymtomatic enteric)",
        "source": "1.1_NDV p.16",
        "body": [
          {
            "sub": "4. Lentogenic (NDV)",
            "body": [
              {
                "bullets": [
                  "**asymptomatic infection**",
                  "**can cause respiratory sign in young naive chick and SPF chicken**",
                  "**used as live vaccine**",
                  "แต่ก็ต้องระวัง **vaccine reaction ในไก่เล็ก**"
                ]
              }
            ]
          },
          {
            "sub": "5. Asymtomatic enteric",
            "body": [
              {
                "bullets": [
                  "**not cause clinical disease**",
                  "**used as live vaccine**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เซลล์และอวัยวะเป้าหมาย การติดต่อ และระยะฟักตัว",
        "source": "1.1_NDV p.17",
        "body": [
          {
            "bullets": [
              "เซลล์เป้าหมาย: **epithelial cells**",
              "อวัยวะเป้าหมาย: **Respiratory & Gastrointestinal tract** และเมื่อเป็น **Chronic: Nervous system**",
              "การติดต่อ: **aerosol, oral-fecal route, direct contact**",
              "**No evident of vertical transmission because NDV cause embryonic dead & dead-in-shell**",
              "ระยะฟักตัวของโรค: **2-15 วัน (โดยมากจะประมาณ 5-6 วัน)**",
              "Susceptible age: **all ages**"
            ]
          },
          {
            "callout": "เหตุผลที่ไม่มีการติดต่อแนวดิ่ง ไม่ใช่เพราะไวรัสเข้าไข่ไม่ได้ แต่เพราะ NDV ทำให้ตัวอ่อนตายและตายคาเปลือกไปก่อน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการทั่วไปและปัจจัยที่กำหนดความรุนแรง",
        "source": "1.1_NDV p.18",
        "body": [
          {
            "sub": "อาการขึ้นกับ",
            "body": [
              {
                "bullets": [
                  "**อายุ และ ระดับภูมิคุ้มกันของไก่**",
                  "**ความรุนแรง และ ปริมาณของเชื้อที่ไก่ได้รับ**"
                ]
              }
            ]
          },
          {
            "sub": "อาการที่พบ",
            "body": [
              {
                "bullets": [
                  "ซึม",
                  "กินน้ำและอาหารลดลง",
                  "**ไข่ลด, ไข่ผิดรูป, เปลือกซีด, เปลือกนิ่ม**"
                ]
              }
            ]
          },
          {
            "text": "รูปประกอบเป็นไข่รูปร่างผิดปกติ จาก textbook Disease of Poultry (14th ed.)"
          }
        ]
      },
      {
        "heading": "อาการและรอยโรค: ระบบหายใจ",
        "source": "1.1_NDV p.19-21",
        "body": [
          {
            "text": "สไลด์ p.19 แบ่งอาการและรอยโรคออกเป็น 3 ระบบ คือ **Respiratory system, Gastrointestinal system, Nervous system**"
          },
          {
            "sub": "อาการที่เห็นจากภายนอก",
            "body": [
              {
                "bullets": [
                  "**Conjunctivitis**",
                  "**Facial swelling, sometime show cyanotic comb**",
                  "**Clear mucus pour from the mouth**",
                  "**Head droop to the ground**"
                ]
              }
            ]
          },
          {
            "sub": "รอยโรคจากการผ่าซาก",
            "body": [
              {
                "bullets": [
                  "**Necrotic and hemorrhage of cranial part of the trachea can be observed in vvNDV**",
                  "**Air-saculitis may observed, especially if 2nd infection**",
                  "Other lesion in respiratory system **did not observe by gross lesion but may seen in microscopic lesion**"
                ]
              }
            ]
          },
          {
            "callout": "รอยโรคที่หลอดลมเน้นเฉพาะ **ส่วนต้น (cranial part)** ของ trachea และพบใน vvNDV",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการและรอยโรค: ระบบทางเดินอาหาร",
        "source": "1.1_NDV p.22-23",
        "body": [
          {
            "bullets": [
              "**Green and watery feces**",
              "**Hemorrhagic proventriculus**",
              "**Necrotic and hemorrhagic of GALT**",
              "**Enlarged spleen, splenic congestion**"
            ]
          },
          {
            "text": "รูปประกอบเป็นภาพจากการทดลองของผู้สอน แสดง proventriculus ที่มีจุดเลือดออก และรอยโรค necrotic hemorrhagic ที่ลำไส้บริเวณ GALT รวมถึงม้ามที่ขยายใหญ่และคั่งเลือด"
          }
        ]
      },
      {
        "heading": "อาการและรอยโรค: ระบบประสาท",
        "source": "1.1_NDV p.24",
        "body": [
          {
            "bullets": [
              "**Depress**",
              "**Tremor**",
              "**Torticollis**",
              "**Paralysis of one wing or one leg**",
              "Lesion in central nervous system **did not observe by gross lesion but may seen in microscopic lesion**",
              "**ไก่อาจตายจากการกินน้ำกินอาหารไม่ได้**"
            ]
          },
          {
            "callout": "ทั้งระบบหายใจส่วนอื่นและระบบประสาทส่วนกลาง ไม่เห็นรอยโรคจาก gross lesion ต้องดูด้วย microscopic lesion",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การวินิจฉัยและการวินิจฉัยแยกแยะ",
        "source": "1.1_NDV p.25",
        "body": [
          {
            "sub": "1. จากประวัติ อาการและรอยโรค",
            "body": [
              {
                "text": "สไลด์ระบุเป็นข้อแรกของการวินิจฉัย"
              }
            ]
          },
          {
            "sub": "2. การตรวจทางไวรัสวิทยา (ตัวอย่าง: trachea)",
            "body": [
              {
                "bullets": [
                  "เพาะแยกเชื้อใน **ไก่ปลอดเชื้อ ไข่ไก่ฟัก, cell line**",
                  "Molecular techniques: **RT-PCR**"
                ]
              }
            ]
          },
          {
            "sub": "3. การตรวจทางซีรัมวิทยา",
            "body": [
              {
                "bullets": [
                  "**Hemagglutination Inhibition test (HI)**",
                  "**ELISA**"
                ]
              }
            ]
          },
          {
            "sub": "4. วินิจฉัยแยกแยะจากโรค",
            "body": [
              {
                "bullets": [
                  "**HPAI, IB, ILT, Mycoplasmosis, Fowl Cholera**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างที่เก็บ (สัตว์เป็น และตอนผ่าซาก)",
        "source": "1.1_NDV p.26",
        "body": [
          {
            "sub": "Sample collection from live animal",
            "body": [
              {
                "bullets": [
                  "**Oropharyngeal swab**",
                  "**Tracheal swab**",
                  "**Cloacal swab**"
                ]
              }
            ]
          },
          {
            "sub": "Sample collection during necropsy",
            "body": [
              {
                "bullets": [
                  "Respiratory organs: **trachea, lung**",
                  "Digestive organs: **cecal tonsil**",
                  "**Other organ/tissue with obvious NDV lesion**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เทคนิคการเก็บ swab (oropharyngeal, tracheal, cloacal)",
        "source": "1.1_NDV p.27-29",
        "body": [
          {
            "sub": "Oropharyngeal swab",
            "body": [
              {
                "bullets": [
                  "If you are right-handed: **Use your left hand to open chicken mouth/beak**",
                  "**If you suspect AI, you must wear gloves and appropriate PPE**",
                  "Use your right hand holding the swab",
                  "**Make sure to swab all the oropharyngeal area by rolling the swab around inside the mouth and behind the tongue**"
                ]
              }
            ]
          },
          {
            "sub": "Tracheal swab",
            "body": [
              {
                "bullets": [
                  "ใช้มือซ้ายเปิดปาก มือขวาถือ swab เช่นเดียวกัน และต้องใส่ PPE ถ้าสงสัย AI",
                  "**Wait until the glottis open**",
                  "Gently put the swab inside the trachea (in appropriate deep normally I insert about **0.5-1 cm.**)"
                ]
              },
              {
                "callout": "ข้อความที่อาจารย์ไฮไลต์สีเหลืองไว้: **But if you are not well train to do this, I am not recommend** และ **The oropharyngeal swab is Fine for pathogen detection**",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Cloacal swab",
            "body": [
              {
                "bullets": [
                  "If you are right-handed: **Use your left hand to gently push chicken tail upward**",
                  "If you suspect AI, you must wear gloves and appropriate PPE",
                  "Use your right hand holding the swab",
                  "Insert the swab into the vent with appropriate deep (normally I insert about **2 cm.**)",
                  "**Make sure that swab contact the mucous membrane**"
                ]
              }
            ]
          },
          {
            "callout": "รูปประกอบหน้า oropharyngeal swab มีป้ายชี้ 2 จุดในช่องปาก อ่านได้ชัดเจนเฉพาะ Glottis อีกป้ายหนึ่งอ่านไม่ออก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ชนิดของ swab และวิธีใช้",
        "source": "1.1_NDV p.30-31",
        "body": [
          {
            "bullets": [
              "**Rayon or Dacron swab**",
              "**Wooden shaft swab**"
            ]
          },
          {
            "sub": "วิธีใช้ที่ต่างกัน",
            "body": [
              {
                "bullets": [
                  "Rayon or Dacron swab: **put the tip of swab in the medium**",
                  "Wooden shaft swab: **After swabbing immediately put the swab in the transport media and immediately removed and discarded the swab after expelling the swab content into transport medium**"
                ]
              }
            ]
          },
          {
            "callout": "swab ก้านไม้ไม่ทิ้งไว้ในหลอด ต้องบีบเนื้อตัวอย่างลงใน transport medium แล้วเอาก้านออกทิ้งทันที ต่างจาก Rayon หรือ Dacron ที่ปล่อยหัว swab แช่ไว้ในน้ำยาได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Containment: การบรรจุตัวอย่างอย่างน้อย 3 ชั้น",
        "source": "1.1_NDV p.32-33",
        "body": [
          {
            "callout": "**At least 3 layers of container = Suitable for suspected infected samples transportation**",
            "kind": "warn"
          },
          {
            "sub": "Inner container",
            "body": [
              {
                "bullets": [
                  "**FTA card** สำหรับ swab sample, fresh tissue sample, blood โดย **make sure the card was dry before pack** และ **keep at room temp.**",
                  "**Transport media** สำหรับ swab sample โดย **keep cold หรือ pack in icebox**",
                  "**Ziplock bag** สำหรับ fresh tissue sample โดย **keep cold หรือ pack in icebox**"
                ]
              }
            ]
          },
          {
            "sub": "Middle container",
            "body": [
              {
                "bullets": [
                  "**Ziplock bag**"
                ]
              }
            ]
          },
          {
            "sub": "Outer container",
            "body": [
              {
                "bullets": [
                  "**Ziplock bag**",
                  "**Envelop for FTA card (keep in room temp.)**",
                  "**Icebox for samples that must keep cold**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การเก็บรักษาตัวอย่างตามวิธีตรวจ (virus culture vs molecular)",
        "source": "1.1_NDV p.34",
        "body": [
          {
            "sub": "For Virus culture",
            "body": [
              {
                "bullets": [
                  "**Put swab or organ in Viral Transport Media (VTM)**",
                  "**Keep sample in refrigerator (4°C) for 1-2 day**",
                  "**Not recommend to keep in the freezer (20°C)**"
                ]
              }
            ]
          },
          {
            "sub": "For Molecular techniques",
            "body": [
              {
                "bullets": [
                  "Put swab in Viral Transport Media (VTM)",
                  "**But organ can be in the zip lock bag, no need to put in VTM**",
                  "Keep sample in refrigerator (4°C) for **1-2 day**",
                  "Keep sample in freezer (20°C) for **3-5 day**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์พิมพ์อุณหภูมิช่องแช่แข็งว่า 20°C ทั้งสองบรรทัด (ไม่ได้พิมพ์เครื่องหมายลบ) จดตามที่พิมพ์ไว้ก่อน และควรถามอาจารย์ยืนยัน",
            "kind": "flag"
          },
          {
            "callout": "จุดต่างที่ออกสอบได้: virus culture ห้ามแช่แข็ง แต่ molecular techniques แช่แข็งได้ 3-5 วัน และอวัยวะไม่ต้องแช่ VTM",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Hemagglutination Inhibition Test (HI)",
        "source": "1.1_NDV p.35",
        "body": [
          {
            "bullets": [
              "**Antibody detection**",
              "ใช้กับ **ND, AI, Adenovirus (egg drop syndrome)**",
              "และ **Infectious coryza, Mycoplasma**"
            ]
          },
          {
            "sub": "หลักการที่แสดงในรูป",
            "body": [
              {
                "bullets": [
                  "A: RBCs อย่างเดียว = **No Reaction**",
                  "B: Virus + RBCs = **Hemagglutination**",
                  "C: Virus + Antibody + RBCs = **Hemagglutination Inhibition**",
                  "รูปแผ่น microtiter แสดง dilution 1:1 ถึง 1:128 โดยตัวอย่าง A titer = **128**, ตัวอย่าง B **no neutralizing antibody**, ตัวอย่าง C titer = **64**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หลักการควบคุมและป้องกันโรค และ Epidemiology triad",
        "source": "1.1_NDV p.36-37",
        "body": [
          {
            "sub": "3 เสาหลัก",
            "body": [
              {
                "bullets": [
                  "**Strict Biosecurity**",
                  "**Good management**",
                  "**Vaccine**"
                ]
              }
            ]
          },
          {
            "sub": "Epidemiology triad",
            "body": [
              {
                "bullets": [
                  "**Host (chicken)**: Genetic (genotype, phenotype), **Immune response**, normal flora, Age, sex, metabolic stage, Productive stage",
                  "**Agents (pathogens)**: Pathogens, Nutritional imbalance, Chemical, toxin, Trauma",
                  "**Environments**: **Bad environment resulting in stress, and stress lower the immunity**, Temperature, Humidity, Ventilation, litter, density, Inadequate water or feed, Foreign objects, Mismanagement, Environment that enhances pathogen growth"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Flock immunity (ภูมิคุ้มกันระดับฝูง)",
        "source": "1.1_NDV p.38",
        "body": [
          {
            "text": "หัวข้อของสไลด์คือ **Immunize the chicken flock**"
          },
          {
            "callout": "**Flock immunity**: If the flock has high number of high immunity chicken, when the pathogen enter the flock, there will be a greater chance of encountering immunized chicken, so it will not widely spread in the flock",
            "kind": "tip"
          },
          {
            "text": "รูปประกอบเป็นภาพ Herd immunity ที่ระบุไว้ว่าเป็น **Fictitious example based on R0 = two** เปรียบเทียบกรณี If no one is immune กับ If 50% are immune"
          }
        ]
      },
      {
        "heading": "Biosecurity และสารฆ่าเชื้อ",
        "source": "1.1_NDV p.39-40",
        "body": [
          {
            "sub": "Biosecurity",
            "body": [
              {
                "bullets": [
                  "**เลี้ยงไก่อายุเดียวใน 1 โรงเรือน (all in all out)**",
                  "ควบคุมการเข้าออกของคน สัตว์ สิ่งของ ยานพาหนะ",
                  "**การป้องกันนกธรรมชาติ**",
                  "การทิ้งซากไก่ตาย, litter",
                  "การทำความสะอาด ฆ่าเชื้อ โรงเรือน สิ่งของ ยานพาหนะ",
                  "สุขศาสตร์ของฟาร์ม พนักงาน"
                ]
              }
            ]
          },
          {
            "sub": "Disinfectants",
            "body": [
              {
                "bullets": [
                  "**Soap, detergents**",
                  "**Oxidizing agent: sodium hypochlorite**",
                  "**Glutaraldehyde**",
                  "**Formaldehyde (gas)**",
                  "**Heat more than 70°C**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Management ที่ช่วยควบคุมโรค",
        "source": "1.1_NDV p.41",
        "body": [
          {
            "bullets": [
              "**คุณภาพลูกไก่ ไก่สาว**",
              "คุณภาพสิ่งปูรอง",
              "**ความสะอาดและคุณภาพน้ำ**",
              "**คุณภาพอาหาร (ระวังสารพิษจากเชื้อรา)**",
              "การกกลูกไก่",
              "**ความหนาแน่น**",
              "**การถ่ายเทอากาศที่ดี**"
            ]
          }
        ]
      },
      {
        "heading": "วัคซีนชนิดที่ 1: วัคซีนเชื้อเป็น",
        "source": "1.1_NDV p.42",
        "body": [
          {
            "sub": "ข้อกำหนดค่า ICPI ของ seed vaccine",
            "body": [
              {
                "bullets": [
                  "Seed vaccine ต้องมี **ICPI ไม่เกิน 0.4-0.5 (EU regulation)**",
                  "Seed vaccine ต้องมี **ICPI ไม่เกิน 0.7 (OIE (WOAH) regulation)**",
                  "แต่ **master seed virus ต้อง ICPI ไม่เกิน 0.4**"
                ]
              }
            ]
          },
          {
            "sub": "คุณสมบัติและวิธีให้",
            "body": [
              {
                "bullets": [
                  "**ราคาไม่แพง**",
                  "**วิธีการให้ง่าย**",
                  "**กระตุ้น mucosal antibody ได้ดี**",
                  "ให้โดยการ **หยอดตา, ผสมน้ำให้ไก่กิน, สเปรย์**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตาราง vaccine strain, pathotype, genotype และ ICPI",
        "source": "1.1_NDV p.43",
        "body": [
          {
            "text": "สไลด์ยกตาราง **Table 3.2** จาก textbook Disease of Poultry (14th ed.) หัวข้อ Commonly used live lentogenic (loNDV) vaccine strains, rarely used mesogenic vaccine strains, and virulent challenge virus strains and their genotype and pathogenicity indices for chickens (11, 140, 167, 221, 255) โดยเชิงอรรถระบุว่า ICPI คือ intracerebral pathogencity index in day-old chickens"
          },
          {
            "sub": "Asymptomatic",
            "body": [
              {
                "bullets": [
                  "**Ulster 2C** genotype I, ICPI **0.0**",
                  "**QV4** genotype I, ICPI **0.0**",
                  "**VG/GA** (Asymptomatic/lentogenic) genotype II, ICPI **0.0**"
                ]
              }
            ]
          },
          {
            "sub": "Lentogenic",
            "body": [
              {
                "bullets": [
                  "**Hitchner B1** genotype II, ICPI **0.2**",
                  "**LaSota** genotype II, ICPI **0.4**"
                ]
              }
            ]
          },
          {
            "sub": "Mesogenic",
            "body": [
              {
                "bullets": [
                  "**Mukteswar** genotype IV, ICPI **1.4**",
                  "**Roakin** genotype II, ICPI **1.5**",
                  "**Beaudette C** genotype II, ICPI **1.6**"
                ]
              }
            ]
          },
          {
            "sub": "Velogenic",
            "body": [
              {
                "bullets": [
                  "**TXGB** genotype II, ICPI **1.8**",
                  "**Herts 33/1956** genotype III, ICPI **1.9**",
                  "**CA/2002** genotype Vb, ICPI **1.8**",
                  "**ZJ1** genotype VIId, ICPI **1.9**"
                ]
              }
            ]
          },
          {
            "callout": "สังเกตว่า Hitchner B1 (0.2) และ LaSota (0.4) ซึ่งเป็นวัคซีนเชื้อเป็นที่ใช้จริงในโปรแกรม มีค่า ICPI ต่ำกว่าเกณฑ์ 0.7 ของ WOAH",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "วัคซีนชนิดที่ 2 และ 3: เชื้อตาย และ recombinant",
        "source": "1.1_NDV p.44",
        "body": [
          {
            "sub": "2. วัคซีนเชื้อตาย",
            "body": [
              {
                "bullets": [
                  "**แพงกว่าวัคซีนเชื้อเป็น**",
                  "วิธีการให้ง่าย",
                  "**กระตุ้น humoral antibody ได้ดี ได้ภูมิคุ้มกันสูงและอยู่นาน**",
                  "ให้โดย **S/C, IM**"
                ]
              }
            ]
          },
          {
            "sub": "3. Recombinant vaccine",
            "body": [
              {
                "bullets": [
                  "**HVT-ND, Fowl Pox-ND**"
                ]
              }
            ]
          },
          {
            "callout": "คู่เปรียบเทียบที่ต้องจำ: เชื้อเป็นเด่นที่ **mucosal antibody** ให้ทางหยอดตา น้ำ สเปรย์ ส่วนเชื้อตายเด่นที่ **humoral antibody** สูงและอยู่นาน ให้ทาง S/C หรือ IM",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตัวอย่างโปรแกรมวัคซีน: ไก่เนื้อ",
        "source": "1.1_NDV p.45",
        "body": [
          {
            "sub": "Day old 1",
            "body": [
              {
                "bullets": [
                  "**Live ND+IB** ให้โดย **Spray**",
                  "**Killed ND** ให้โดย **S/C**",
                  "และหรือ **rHVT-ND** ให้โดย **S/C**",
                  "สไลด์กำกับว่า **(depend on disease incidence)**"
                ]
              }
            ]
          },
          {
            "sub": "อายุ 7-14 วัน",
            "body": [
              {
                "bullets": [
                  "**Live ND+IB** ให้โดย **Spray or Drinking water**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างโปรแกรมวัคซีน: ไก่ไข่และไก่พ่อแม่พันธุ์",
        "source": "1.1_NDV p.46",
        "body": [
          {
            "bullets": [
              "**1 วัน**: ND + IB ทาง **Spray ที่โรงฟัก**",
              "**7 วัน**: **ND (B1)** + IB ทาง **Eye drop**",
              "**21 วัน**: **ND (LaSota)** + IB ทาง **Eye drop**",
              "**8 สัปดาห์**: ND (LaSota) + IB ทาง **Drinking water**",
              "**12 สัปดาห์**: ND (LaSota) + IB ทาง **Eye drop หรือ Drinking water** ร่วมกับ **วัคซีนเชื้อตาย ND+IB+EDS+IC** ทาง **IM/SQ**"
            ]
          },
          {
            "callout": "ไล่ลำดับ strain ในโปรแกรมนี้: เริ่มจาก B1 ที่อายุ 7 วัน แล้วเปลี่ยนเป็น LaSota ตั้งแต่ 21 วันเป็นต้นไป และปิดท้ายด้วยเชื้อตายรวม 4 โรคที่ 12 สัปดาห์",
            "kind": "tip"
          },
          {
            "callout": "หัวสไลด์เขียนว่า ในไก่ไข่ และ ไก่พ่อแม่พันธุ์ ช่วง แต่สไลด์ไม่ได้ระบุต่อว่าเป็นช่วงอะไร และไม่ได้ให้โปรแกรมของช่วงให้ไข่ (laying period)",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ถ้าเจอ NDV ในฟาร์มต้องทำอย่างไร",
        "source": "1.1_NDV p.47",
        "body": [
          {
            "text": "คำถามบนสไลด์คือ **What should I do, if there is NDV in the farm**"
          },
          {
            "bullets": [
              "**Eliminate the virus**",
              "**Prevent the spread of virus**",
              "**Supportive treatment by giving vitamin in drinking water**",
              "**Increase Biosecurity strictness: type of disinfectant etc.**",
              "**Evaluate the efficacy of vaccination and types of vaccines**"
            ]
          },
          {
            "callout": "สไลด์ให้เป็นหลักการ 5 ข้อ แต่ไม่ได้ลงรายละเอียดวิธีการ eliminate virus หรือขั้นตอนตามกฎหมายของกรมปศุสัตว์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Please keep in mind: ประเด็นที่อาจารย์ย้ำปิดท้าย",
        "source": "1.1_NDV p.48",
        "body": [
          {
            "callout": "**วัคซีนสามารถป้องกันอาการและการตายได้ หรืออาจลดอัตราการแพร่เชื้อได้ แต่ไม่สามารถป้องกันการติดเชื้อได้**",
            "kind": "warn"
          },
          {
            "bullets": [
              "**Vaccines need time to induce chicken immunity**",
              "**High MDA in the chick**",
              "**Always do serology monitoring after vaccination**",
              "**Beware of vaccine reaction, ex. Live vaccine spread to the naive flock**",
              "**Strict biosecurity + Good management is very important**"
            ]
          },
          {
            "text": "กราฟประกอบแสดงแกน Protection กับ Age โดยเส้น **MDA** ลดลงตามอายุ ส่วนเส้น **Active immunity (induce by vaccine)** ค่อยๆ สูงขึ้น และช่วงที่ทั้งสองเส้นต่ำคือ **Protection gap** ส่วนรูปวงกลมด้านขวาสรุปว่าภูมิคุ้มกันของไก่มาจาก **Immunization** ร่วมกับ **Physical Barrier หรือ Biosecurity**"
          },
          {
            "callout": "Protection gap คือช่วงที่ MDA ตกลงแล้วแต่ภูมิจากวัคซีนยังขึ้นไม่ทัน เป็นเหตุผลว่าทำไม MDA สูงในลูกไก่จึงเป็นประเด็นที่ต้องคำนึงตอนวางโปรแกรมวัคซีน",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "avian-pox": {
    "topic": "avian-pox",
    "title": "โรคฝีดาษไก่ (Fowlpox)",
    "lecturer": "ผศ.สพ.ญ.ดร.ณทยา เจริญวิศาล",
    "icon": "🐔",
    "summary": "โรคฝีดาษไก่ เกิดจาก Fowlpox virus (FPV) ใน genus Avipoxvirus เป็น DNA ไวรัสสายคู่ มีเปลือกหุ้ม รูปร่าง brick-shape เข้าทำลาย epithelial cells ติดต่อผ่านบาดแผล โดยมีแมลงและยุงเป็นพาหะ หรือหายใจเอาขนและสะเก็ดเข้าไป ระยะฟักตัว 4-10 วัน แบ่งเป็น 2 form คือ Cutaneous form (dry form) ที่เกิด nodular lesion บนผิวหนังส่วนที่ไม่มีขนและมีอัตราการตายต่ำ กับ Diphtheritic form (wet form) ที่เกิดเยื่อสีเหลืองในทางเดินหายใจส่วนต้นและมีอัตราการตายสูงกว่า วินิจฉัยจากประวัติ รอยโรค histopathology (eosinophilic cytoplasmic inclusion body) การเพาะแยกเชื้อ molecular technique และซีรัมวิทยา ควบคุมด้วยวัคซีนเชื้อเป็นทาง wing web พร้อมตรวจสอบผลวัคซีน และงาน biosecurity คุมยุงกับความหนาแน่นในโรงเรือน",
    "sections": [
      {
        "heading": "ภาพรวมโรคฝีดาษไก่ (Fowlpox)",
        "source": "1.5_Avian_Pox p.2",
        "body": [
          {
            "text": "สไลด์เปิดหัวข้อด้วยชื่อเรียกอื่นของโรค และลักษณะทางระบาดวิทยาแบบกว้างๆ ของโรคฝีดาษไก่"
          },
          {
            "sub": "ชื่ออื่นของโรค",
            "body": [
              {
                "bullets": [
                  "**Contagious epithelioma**",
                  "**Avian diphtheria**"
                ]
              }
            ]
          },
          {
            "sub": "สัตว์ที่พบและลักษณะการระบาด",
            "body": [
              {
                "bullets": [
                  "พบได้ใน **ไก่ ไก่งวง และนกสวยงามหลายชนิด**",
                  "พบได้ใน **ไก่ทุกอายุ**",
                  "**แพร่ระบาดช้า**",
                  "**อยู่ได้นานในสะเก็ดแห้งๆ**",
                  "มักพบในที่ที่มี **การเลี้ยงไก่หนาแน่น**",
                  "เลี้ยงไก่หลายอายุ"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่เชื่อมกับการควบคุมโรคท้ายสไลด์ คือเชื้ออยู่ได้นานในสะเก็ดแห้ง จึงเป็นเหตุผลที่ต้องพักเล้าให้นานพอ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ประวัติช่วงแรกของโรคฝีดาษไก่",
        "source": "1.5_Avian_Pox p.3",
        "body": [
          {
            "bullets": [
              "**Woodruff and Goodpasture (1929, 1931)**",
              "พบ virus particles คือ **Borrell bodies**",
              "อยู่ใน Inclusion bodies คือ **Bollinger bodies**"
            ]
          },
          {
            "callout": "จำคู่กัน Borrell bodies คือตัวอนุภาคไวรัส ส่วน Bollinger bodies คือ inclusion body ที่ห่ออนุภาคไวรัสไว้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "เชื้อก่อโรคและการจัดจำแนก (Fowlpox virus)",
        "source": "1.5_Avian_Pox p.4",
        "body": [
          {
            "text": "โรคฝีดาษไก่เกิดจากเชื้อ **Fowlpox virus (FPV)**"
          },
          {
            "sub": "การจัดจำแนก (taxonomy) ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "Genus **Avipoxvirus**",
                  "Subfamily **Chordopoxvirinae**",
                  "Family **Poxviridae**"
                ]
              }
            ]
          },
          {
            "sub": "คุณสมบัติของ Poxvirus",
            "body": [
              {
                "bullets": [
                  "เป็น **ดีเอ็นเอไวรัสสายคู่**",
                  "**มีเปลือกหุ้ม**",
                  "ลักษณะเป็น **Brick-shape**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์มีภาพโครงสร้าง virion ประกอบ (ที่มา viralzone.expasy.org) แสดง Mature Virion (MV) และ Enveloped Virion (EV) พร้อมป้ายชี้ EV envelope, MV membrane, Lateral body, Core wall และ Nucleocapsid โดยมีสเกลกำกับ **250nm** ในแนวตั้ง และ **360nm** ในแนวนอน"
          }
        ]
      },
      {
        "heading": "เซลล์เป้าหมาย อวัยวะเป้าหมาย การติดต่อ และระยะฟักตัว",
        "source": "1.5_Avian_Pox p.5",
        "body": [
          {
            "sub": "เซลล์และอวัยวะเป้าหมาย",
            "body": [
              {
                "bullets": [
                  "เซลล์เป้าหมาย **epithelial cells**",
                  "อวัยวะเป้าหมาย **ผิวหนังส่วนที่ไม่มีขน และต่อมขน**",
                  "อวัยวะเป้าหมาย **ระบบหายใจส่วนต้น ปาก หลอดอาหาร**"
                ]
              }
            ]
          },
          {
            "sub": "การติดต่อ",
            "body": [
              {
                "bullets": [
                  "**ติดเชื้อเข้าทางบาดแผล**",
                  "**แมลง ยุง เป็นพาหะนำโรค** ที่ผิวหนัง หรือตา",
                  "**หายใจเอาขน หรือสะเก็ดเข้าไป**"
                ]
              }
            ]
          },
          {
            "sub": "ระยะฟักตัวของโรค",
            "body": [
              {
                "text": "**4 - 10 วัน**"
              }
            ]
          }
        ]
      },
      {
        "heading": "รูปแบบของโรค 2 forms",
        "source": "1.5_Avian_Pox p.6",
        "body": [
          {
            "bullets": [
              "**Cutaneous form (dry form)**",
              "**Diphtheritic form (wet form)**",
              "**อาจพบทั้ง 2 ฟอร์มในไก่ 1 ตัว**"
            ]
          }
        ]
      },
      {
        "heading": "พยาธิกำเนิด (Pathogenesis) เทียบ 2 form ตาม DPI",
        "source": "1.5_Avian_Pox p.7",
        "body": [
          {
            "text": "สไลด์กำกับไว้ว่า **DPI = day post infection** และวางไทม์ไลน์ของ 2 form คู่กัน โดยจุดต่างอยู่ที่ทางที่ได้รับเชื้อ"
          },
          {
            "sub": "Cutaneous form - ได้รับเชื้อทางผิวหนัง",
            "body": [
              {
                "bullets": [
                  "**2 DPI: replicate in skin**",
                  "**4 DPI found in lung**",
                  "**5 DPI viremia**",
                  "**5-10 DPI พบ Nodular lesion**"
                ]
              }
            ]
          },
          {
            "sub": "Diphtheritic form - ได้รับเชื้อทางท่อลม",
            "body": [
              {
                "bullets": [
                  "**2 DPI found in lung**",
                  "**4 DPI viremia**",
                  "**5-10 DPI พบ Diphtheritic lesion**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์สรุปในกรอบท้ายภาพว่า หลังจาก viremia แล้ว สามารถแยกเชื้อไวรัสได้จาก **ม้าม ตับ ไต สมอง**"
          },
          {
            "callout": "จุดเทียบที่ออกสอบได้ Cutaneous เริ่มที่ผิวหนัง (2 DPI) แล้วค่อยถึงปอด 4 DPI และ viremia 5 DPI ส่วน Diphtheritic เริ่มที่ปอดเลย (2 DPI) และ viremia เร็วกว่าคือ 4 DPI แต่ทั้งคู่เห็นรอยโรคที่ 5-10 DPI เท่ากัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการของ Cutaneous form (dry form)",
        "source": "1.5_Avian_Pox p.8",
        "body": [
          {
            "bullets": [
              "**Nodular lesion ในผิวหนังส่วนที่ไม่มีขน** เช่น บนหัว หงอน เหนียง เปลือกตา เท้า ขา",
              "**ไวรัสอยู่ในสะเก็ด ที่ลอกหลุดออกมา**",
              "หากใกล้ตา ไก่จะมองไม่เห็น กินน้ำ อาหารลำบาก",
              "**ไก่โตช้า ไข่ลด**",
              "**อัตราการตายต่ำ**"
            ]
          },
          {
            "callout": "สไลด์ระบุแค่ว่าอัตราการตายต่ำ ไม่ได้ให้ตัวเลขเปอร์เซ็นต์ไว้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "รอยโรคของ Cutaneous form (dry form)",
        "source": "1.5_Avian_Pox p.9-10",
        "body": [
          {
            "text": "รอยโรคหลักคือ **Discrete nodular proliferative lesion: epithelial hyperplasia & feather follicles**"
          },
          {
            "bullets": [
              "มักเกิดที่ **ผิวหนังส่วนที่ไม่มีขน** เช่น บนหัว หงอน เหนียง เปลือกตา เท้า ขา"
            ]
          },
          {
            "sub": "ลำดับการเปลี่ยนแปลงของรอยโรค",
            "body": [
              {
                "bullets": [
                  "ตอนแรกจะเป็น **ตุ่มสีขาวเล็กๆ**",
                  "จากนั้นขยายขนาดอย่างรวดเร็วและ **เปลี่ยนเป็นสีเหลือง**",
                  "กลายเป็น **papule และ vesicular ตามลำดับ**",
                  "จากนั้นผนังหนาขึ้น แข็ง **เปลี่ยนเป็นสีดำ และมีสะเก็ด** บางครั้งอาจมีหนอง อาจรวม 2 ตุ่มมาเป็นตุ่มเดียวก็ได้",
                  "ผ่านไป **2 สัปดาห์** สะเก็ดและผิวหนังส่วนนั้นจะค่อยๆ ลอกหลุด อาจใช้เวลาถึง **1-2 สัปดาห์**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์หน้า 10 เป็นภาพประกอบ Cutaneous form แสดงตุ่มสะเก็ดสีดำจำนวนมากบนหงอนและรอบตาของไก่ และอีกภาพเป็นก้อนสะเก็ดสีดำขนาดใหญ่บริเวณหัว โดยสไลด์ไม่ได้เขียนคำบรรยายภาพเพิ่มเติมไว้"
          }
        ]
      },
      {
        "heading": "อาการของ Diphtheritic form (wet form)",
        "source": "1.5_Avian_Pox p.11",
        "body": [
          {
            "bullets": [
              "**มีเยื่อสีเหลืองคลุม เยื่อเมือกที่ปาก หลอดอาหาร กล่องเสียง ท่อลม**",
              "**หายใจลำบาก ไม่กินน้ำและอาหาร**",
              "**ไก่โตช้า ไข่ลด**",
              "**อัตราการตายสูงกว่า Cutaneous form**"
            ]
          },
          {
            "callout": "สไลด์เปรียบเทียบอัตราการตายเป็นเชิงเทียบกันเท่านั้น ไม่ได้ให้ตัวเลขของทั้งสอง form",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "รอยโรคของ Diphtheritic form (wet form)",
        "source": "1.5_Avian_Pox p.12-13",
        "body": [
          {
            "text": "รอยโรคหลักคือ **Fibrino-necrotic & proliferative lesion in mucous membrane of upper respiratory tract, mouth, esophagus**"
          },
          {
            "bullets": [
              "มีเยื่อสีเหลืองคลุม เยื่อเมือกในปาก หลอดอาหาร กล่องเสียง ท่อลม"
            ]
          },
          {
            "sub": "ลำดับการเปลี่ยนแปลงของรอยโรค",
            "body": [
              {
                "bullets": [
                  "ตอนแรก มี **ตุ่มนูนสีขาว โปร่งแสง หรือสีเหลืองขุ่น** ขึ้นที่เยื่อเมือกในปาก หลอดอาหาร กล่องเสียง ลิ้น ท่อลม",
                  "ตุ่มจะใหญ่ขึ้นอย่างรวดเร็ว",
                  "ตุ่มในบริเวณเดียวกันจะรวมตัวกัน กลายเป็น **เนื้อตายสีเหลือง (pseudodiphtheritic membrane)**",
                  "ถ้าแกะเยื่อสีเหลืองนี้ออก จะพบ **ปื้นเลือดออก หรือแผลหลุม**"
                ]
              }
            ]
          },
          {
            "sub": "เมื่อการอักเสบลุกลาม",
            "body": [
              {
                "bullets": [
                  "หากการอักเสบขยายไป **infraorbital sinuses** จะทำให้ **ตาอักเสบ บวม**",
                  "หากขยายไป **กล่องเสียงและคอหอย** จะไป **ขวางกั้นระบบหายใจ**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์หน้า 13 เป็นภาพประกอบ Diphtheritic form แสดงเยื่อ/ก้อนสีเหลืองในช่องปากและบริเวณหัวที่ผ่าเปิด และอีกภาพเป็นท่อลมที่ผ่าเปิดตรึงหมุด พบวัสดุสีเหลืองเกาะตามเยื่อเมือก โดยสไลด์ไม่ได้เขียนคำบรรยายภาพเพิ่มเติมไว้"
          }
        ]
      },
      {
        "heading": "การวินิจฉัย (Diagnosis)",
        "source": "1.5_Avian_Pox p.14",
        "body": [
          {
            "sub": "1. จากประวัติ อาการและรอยโรค",
            "body": [
              {
                "bullets": [
                  "Histopathology: **Eosinophilic cytoplasmic inclusion body in epithelial cell**"
                ]
              }
            ]
          },
          {
            "sub": "2. การตรวจทางไวรัสวิทยา",
            "body": [
              {
                "bullets": [
                  "**เพาะแยกเชื้อในไก่ปลอดเชื้อ ไข่ไก่ฟัก เซลล์เพาะเลี้ยง**",
                  "Molecular techniques; **PCR, RFLP, DNA probes**"
                ]
              }
            ]
          },
          {
            "sub": "3. การตรวจทางซีรั่มวิทยา",
            "body": [
              {
                "bullets": [
                  "**ELISA**",
                  "**VN**",
                  "**IFA**"
                ]
              }
            ]
          },
          {
            "sub": "4. วินิจฉัยแยกแยะจากโรค",
            "body": [
              {
                "bullets": [
                  "Diphtheritic form; **ILT, T-2 toxin**",
                  "Cutaneous form; **ขาด Pantothenic acid or biotin ในลูกไก่**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์มีภาพประกอบทางขวา เป็นเนื้อเยื่อแผ่นบางที่มีรอยโรคกลมสีขาวนูนกระจายอยู่ และมีลูกศรชี้รอยโรค 2 ตำแหน่ง แต่สไลด์ไม่ได้เขียนคำบรรยายภาพหรือระบุว่าเป็นเนื้อเยื่อใดไว้"
          },
          {
            "callout": "Eosinophilic cytoplasmic inclusion body ใน epithelial cell คือจุดชี้ขาดทาง histopathology ของสไลด์นี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การควบคุมและป้องกันโรค ภาพรวม",
        "source": "1.5_Avian_Pox p.15",
        "body": [
          {
            "bullets": [
              "**Vaccine**",
              "**Biosecurity and management**"
            ]
          },
          {
            "callout": "สไลด์ชุดนี้ไม่ได้พูดถึงการรักษา (treatment) เลย หัวข้อการจัดการมีเฉพาะวัคซีนกับ biosecurity เท่านั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "วัคซีนเชื้อเป็นและวิธีการให้วัคซีน",
        "source": "1.5_Avian_Pox p.16",
        "body": [
          {
            "sub": "ชนิดวัคซีนเชื้อเป็น",
            "body": [
              {
                "bullets": [
                  "**Chicken-embryo origin vaccine**",
                  "**Cell-culture origin vaccine**"
                ]
              }
            ]
          },
          {
            "sub": "อายุและตำแหน่งที่ให้",
            "body": [
              {
                "bullets": [
                  "**ให้ได้ตั้งแต่อายุ 1 วัน**",
                  "**wing web ที่อายุ 4 สัปดาห์ ขึ้นไป** หรือ **4-8 สัปดาห์ก่อนไข่**",
                  "**ห้ามให้ตอนแม่ไก่กำลังให้ไข่**",
                  "Route อื่นที่ให้ได้ แต่ไม่นิยม; **oral, IM, feather follicles, intranasal**",
                  "**ควรทำวัคซีนวันเดียวกันทุกตัว ใน 1 โรงเรือน**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์มีภาพเข็มแทงปีก (wing web applicator) ประกอบไว้มุมขวาบน"
          }
        ]
      },
      {
        "heading": "Recombinant vaccine",
        "source": "1.5_Avian_Pox p.17",
        "body": [
          {
            "bullets": [
              "ใช้ **Poxvirus เป็น Vector**",
              "**ตัดยีนส่วนที่กระตุ้นภูมิคุ้มกันของไวรัสอื่น มาใส่ใน Poxvirus** เช่น **F gene ของ NDV, HN gene ของ ILT**",
              "ไก่จะสร้างภูมิคุ้มกัน **ทั้งต่อ Poxvirus และ F gene ของ NDV หรือ HN gene ของ ILT**"
            ]
          },
          {
            "callout": "ชื่อยีนตรงนี้คัดตามที่พิมพ์บนสไลด์ทุกตัวอักษร สไลด์ไม่ได้อธิบายรายละเอียดของยีนเหล่านี้เพิ่มเติม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การตรวจสอบผลการให้วัคซีนที่ wing web",
        "source": "1.5_Avian_Pox p.18",
        "body": [
          {
            "bullets": [
              "**สุ่มตรวจไก่อย่างน้อย 50 ตัว ต่อ 1 โรงเรือน**",
              "หากวัคซีนได้ผล จะพบ **ตุ่มนูนแข็งบริเวณที่ให้วัคซีน 5-10 วัน หลังทำวัคซีน**"
            ]
          },
          {
            "sub": "หากสุ่มตรวจไก่แล้ว ไม่พบตุ่มมากกว่า 10%",
            "body": [
              {
                "bullets": [
                  "ให้ **ทำวัคซีนใหม่อย่างถูกต้องและระมัดระวัง ทั้งโรงเรือน**",
                  "**การทำวัคซีนครั้งใหม่นี้ จะไม่สามารถตรวจผลโดยดูตุ่มนูนที่ wing web ได้**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เขียนเงื่อนไขไว้ว่า ไม่พบตุ่มมากกว่า 10% ตามนี้ ไม่ได้ขยายความว่านับอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Biosecurity and management",
        "source": "1.5_Avian_Pox p.19",
        "body": [
          {
            "bullets": [
              "**กำจัดพาหะนำโรค แหล่งเพาะพันธุ์ยุง**",
              "**ความหนาแน่นเหมาะสม**",
              "**เลี้ยงไก่อายุเดียวกัน all in - all out**",
              "**ทำความสะอาดและพักเล้านานพอ** เพราะ **สะเก็ดอยู่ในโรงเรือนได้นาน**"
            ]
          },
          {
            "callout": "ข้อ biosecurity ทุกข้อสอดคล้องกับสไลด์หน้า 2 และหน้า 5 คือคุมยุงซึ่งเป็นพาหะ คุมความหนาแน่น และจัดการสะเก็ดที่เป็นแหล่งไวรัสคงทน",
            "kind": "tip"
          }
        ]
      }
    ]
  }
};
