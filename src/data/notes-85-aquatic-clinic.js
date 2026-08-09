// ============================================================
// คลินิกสัตว์น้ำ — สรุปจากรุ่นพี่ Vet 85
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

export const NOTES_85_AQUATIC_CLINIC = {
  "aqua-fish-diseases": {
    "topic": "aqua-fish-diseases",
    "title": "โรคในปลาเลี้ยง (Disease in fish culture)",
    "icon": "📘",
    "summary": "ปรสิตภายนอกและการคำนวณยาแช่ โรคแบคทีเรียหลัก 6 กลุ่ม แนวทางวินิจฉัยและการใช้ยาปฏิชีวนะ และโรคไวรัสในปลาเศรษฐกิจ (VNN, Megalocytivirus, TiLV, KHV, SVCV, CEVD) พร้อมสถานะในบัญชีโรคของ WOAH",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ปรสิตภายนอก (Ectoparasites)",
        "source": "Aquamed final (Vet 85) น.3",
        "body": [
          {
            "text": "เป็นปัญหาหลักใน **ปลาวัยอ่อน (juvenile fish)** มักโยงกับสิ่งแวดล้อมที่ไม่ดี ออกซิเจนต่ำ บ่อปรก และเลี้ยงหนาแน่นเกินไป"
          },
          {
            "bullets": [
              "Clinical sign: ปลาว่ายผิดปกติ ว่ายแฉลบ น้ำเป็นฟอง เพราะปลาขับเมือกออกมามาก ถ้าหนักมากจะเหงือกเปิดและลอยตัว",
              "Trichodina (เห็บระฆัง) เป็น ciliated protozoa พบบ่อย ชอบเกาะที่ **เหงือก**",
              "การตรวจ: ขูดเมือก ถ้าปลาตายอาจตัดเหงือกหรือปลายครีบมาส่องกล้อง"
            ]
          },
          {
            "sub": "การรักษาและข้อควรระวัง",
            "body": [
              {
                "bullets": [
                  "ใช้ยาแบบแช่ **Immersion dip (high dose short time)**",
                  "เห็บระฆังรักษาด้วย **Potassium permanganate (ด่างทับทิม)** เป็นตัวที่ปลอดภัยที่สุด",
                  "เป็นสารที่ทำปฏิกิริยากับแสง จึงต้องให้ตอนเช้าหรือหลังพระอาทิตย์ตก",
                  "เป็นสารจับตะกอน ต้องปิดใบพัดตีน้ำก่อน ไม่งั้นตะกอนจะฟุ้ง",
                  "**สารนี้ดึงออกซิเจนในน้ำ** จึงต้องงดกิจกรรมที่ใช้ออกซิเจน เช่น การให้อาหาร"
                ]
              }
            ]
          },
          {
            "callout": "โน้ตข้างรูปเขียนไว้ว่า ถ้าเห็น eye spot ในพยาธิใบไม้ตัวแบน (monogenean) ให้นึกถึง Dactylogyrus ควรกลับไปดูรูปที่อาจารย์ฉายในคาบประกอบ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การคำนวณยาแช่ (ออกสอบคำนวณ 4 ข้อ)",
        "source": "Aquamed final (Vet 85) น.3",
        "body": [
          {
            "bullets": [
              "**1 ppm = 1 กรัมต่อตัน = 1 มิลลิกรัมต่อลิตร**",
              "1 ไร่ = 400 ตารางวา = 1,600 ตารางเมตร",
              "1 ตัน = 1,000 ลิตร",
              "ถ้าคิดปริมาตรได้เป็นลูกบาศก์เมตร ให้เทียบเป็นตันได้เลย",
              "ทรงกระบอก volume = pi r ยกกำลังสอง คูณ h"
            ]
          },
          {
            "sub": "ตัวอย่างที่ทำไว้ในสรุป (บ่อรูปตัว L)",
            "body": [
              {
                "text": "ส่วนที่ 1 กว้าง 3 ยาว 4 ลึก 1.5 เมตร = 18 ลูกบาศก์เมตร ส่วนที่ 2 กว้าง 7 ยาว 4 ลึก 1.5 เมตร = 42 ลูกบาศก์เมตร รวม **60 ลูกบาศก์เมตร = 60 ตัน**"
              },
              {
                "text": "ใช้ด่างทับทิม 3 ppm เท่ากับ 3 กรัมต่อตัน ดังนั้น 60 คูณ 3 = **180 กรัม**"
              }
            ]
          }
        ]
      },
      {
        "heading": "แบคทีเรีย: Streptococcus",
        "source": "Aquamed final (Vet 85) น.3",
        "body": [
          {
            "bullets": [
              "เป็นเชื้อ **ตัวเดียวในกลุ่มนี้ที่เป็น Gram positive**",
              "White pinpoint colony with hemolysis",
              "S. agalactiae ในปลานิล และ S. iniae ในปลากะพง",
              "ในปลานิลและปลากะพงถือเป็น **true pathogen ไม่ใช่เชื้อฉวยโอกาส**",
              "มักเจอในปลาขุนที่เลี้ยงนาน ทำให้เสียหายมาก อัตราตายสูง โดยเฉพาะช่วงอากาศร้อน"
            ]
          },
          {
            "text": "อาการ: generalized septicemia (spleen, anterior kidney, brain), **bilateral exophthalmos**, skin abscess และ **swirling (ว่ายหมุน) เพราะเชื้อขึ้นสมอง**"
          },
          {
            "text": "ถ้าเป็นแบบ chronic จะทำให้เกิดพยาธิสภาพในอวัยวะภายในและที่กระดูก ทำให้ **กระดูกสันหลังคด ตัวเบี้ยว**"
          }
        ]
      },
      {
        "heading": "แบคทีเรีย: Flavobacterium, Aeromonas, Edwardsiella, Francisella, Vibrio",
        "source": "Aquamed final (Vet 85) น.3-4",
        "body": [
          {
            "sub": "Flavobacterium spp.",
            "body": [
              {
                "bullets": [
                  "ทำให้เกิดโรคเหงือกเน่า (**Columnaris disease**)",
                  "เป็น **opportunistic pathogen ชอบอากาศเย็น**",
                  "ปกติเชื้ออยู่ในเหงือกและเมือกอยู่แล้ว พออากาศหนาว ปลาภูมิตกจึงโดนแทรกซ้อน",
                  "อาการที่พบได้คือ Saddle back syndrome",
                  "การรักษา: ลดเชื้อในสิ่งแวดล้อมให้มากที่สุด เอาปลาป่วยและปลาตายออก งดอาหาร"
                ]
              }
            ]
          },
          {
            "sub": "Aeromonas spp. (A. hydrophila)",
            "body": [
              {
                "text": "ทำให้เกิด **Motile aeromonas septicemia (MAS)** อาการคือเลือดออกทั่วร่างกาย ครีบและหางกร่อน (fin or tail rot)"
              }
            ]
          },
          {
            "sub": "Edwardsiella spp.",
            "body": [
              {
                "text": "Facultative intracellular bacteria ทำให้เกิดโรค **Hole in the head** ในปลาดุกอเมริกา และทำให้เกิด granuloma ขนาดเล็กแบบ pin-point ที่ม้ามและไต"
              }
            ]
          },
          {
            "sub": "Francisella spp.",
            "body": [
              {
                "text": "Gram negative facultative intracellular ทำให้เกิด **multifocal granuloma ในหลายอวัยวะ ก้อนใหญ่กว่าของ Edwardsiella**"
              }
            ]
          },
          {
            "sub": "Vibriosis",
            "body": [
              {
                "text": "โรคแบคทีเรียใน **น้ำเค็ม** ทำให้เกิด scale drop and muscle necrosis disease ในปลากะพง"
              }
            ]
          }
        ]
      },
      {
        "heading": "การวินิจฉัยโรคแบคทีเรียในปลา และการใช้ยาปฏิชีวนะ",
        "source": "Aquamed final (Vet 85) น.4",
        "body": [
          {
            "sub": "ลำดับการวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "1. Clinical signs and lesions",
                  "2. HP examination (ไม่ค่อยทำ ข้ามไป)",
                  "3. **เพาะเชื้อ นิยมที่สุด** เก็บตัวอย่างจาก **ไตส่วนหน้า (pronephros) ดีที่สุด รองลงมาคือสมอง แล้วจึงม้าม** จากนั้นเลือก selective medium ดูโคโลนี ลักษณะเชื้อ ย้อม Gram แล้วทำ AST ต่อ",
                  "4. PCR (ไม่ค่อยแม่นสำหรับแบคทีเรีย ใช้กับโรคไวรัสดีกว่า)"
                ]
              }
            ]
          },
          {
            "sub": "การใช้ยาปฏิชีวนะ",
            "body": [
              {
                "bullets": [
                  "ฟาร์มนิยมให้ยาผสมกับอาหาร",
                  "**อย่างแรกที่ควรทำก่อนใช้ยาคือ improve management**",
                  "ปลาป่วยไม่ค่อยกิน เน้นให้ยาเพื่อเซฟตัวที่ยังพอกินได้ และควรจำกัดปริมาณอาหาร",
                  "**ใช้ได้: OTC, Amoxicillin, Enrofloxacin, SXT**",
                  "**ห้ามใช้ในปลาที่ไว้บริโภค: Chloramphenicol, Nitrofuran, Malachite green**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างการคำนวณยากินที่ทำไว้ในสรุป",
            "body": [
              {
                "text": "ปลานิลอายุ 4 เดือน เป็น Streptococcosis ในบ่อมีปลาประมาณ 5,000 ตัว น้ำหนักเฉลี่ย 600 กรัม จะให้ Enrofloxacin 10 เปอร์เซ็นต์ ผสมอาหาร"
              },
              {
                "text": "น้ำหนักรวม 5,000 คูณ 0.6 = 3,000 กิโลกรัม ขนาดยา 0.05 ถึง 0.1 มิลลิลิตรต่อ 1 กิโลกรัม ถ้าเลือกขนาดสูง 0.1 จะได้ 3,000 คูณ 0.1 = **300 มิลลิลิตรต่อวัน**"
              }
            ]
          }
        ]
      },
      {
        "heading": "โรคไวรัส: Viral Nervous Necrosis (VNN)",
        "source": "Aquamed final (Vet 85) น.4",
        "body": [
          {
            "bullets": [
              "เป็น **RNA virus** อีกชื่อคือ Viral Encephalopathy and Retinopathy (VER)",
              "ไวรัสเข้าทำลาย **สมองและตา** ของปลา",
              "พบการติดเชื้อได้ตั้งแต่ปลาอายุ 2 วันแรก",
              "ปลาที่โตแล้วจะเป็น carrier ถ้าเครียดช่วงผสมพันธุ์จะปล่อยไวรัสออกมากับไข่",
              "อาการทางระบบประสาท **corkscrew หรือ whirling swimming pattern**",
              "HP: เอาเนื้อเยื่อสมองไปตรวจ เจอ **vacuolation ร่วมกับ ICIB**",
              "เป็น **ไวรัสตัวเดียวที่ยืนยันว่าส่งเชื้อแบบ vertical transmission ได้**"
            ]
          },
          {
            "callout": "สรุปบันทึกว่า VNN เคยอยู่ในบัญชีของ WOAH แต่ถูกเอาออกแล้ว และปัจจุบันก่อโรครุนแรงลดลง ข้อนี้เป็นสถานะที่เปลี่ยนได้ตามการปรับบัญชีรายปี ให้ยึดตามที่อาจารย์ปีนี้บรรยาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "โรคไวรัส: Megalocytivirus (ISKNV, SDDV, RSIV)",
        "source": "Aquamed final (Vet 85) น.5",
        "body": [
          {
            "text": "เป็น **DNA virus** มี 3 species ที่ก่อโรค"
          },
          {
            "sub": "ISKNV (Infectious Spleen and Kidney Necrosis Virus)",
            "body": [
              {
                "bullets": [
                  "**ยังอยู่ในบัญชีของ WOAH**",
                  "ก่อโรคในปลากะพง ตายแบบเฉียบพลัน 80 ถึง 90 เปอร์เซ็นต์ และในปลานิล",
                  "Horizontal transmission ผ่านทางน้ำปนเปื้อนและ carrier",
                  "ยังไม่มีรายงานว่ามี vertical transmission ในปลากะพง"
                ]
              }
            ]
          },
          {
            "sub": "SDDV (Scale Drop Disease Virus)",
            "body": [
              {
                "bullets": [
                  "**ไม่ได้อยู่ในบัญชีของ WOAH**",
                  "เป็นโรคที่เจอในปลากะพงระยะ grow out",
                  "ทำให้เกิด **generalized vasculitis**",
                  "DDx คือ Vibrio harveyi ซึ่งทำให้เกล็ดหลุดได้เหมือนกัน"
                ]
              }
            ]
          },
          {
            "sub": "RSIV (Red sea bream iridovirus)",
            "body": [
              {
                "text": "มีความใกล้เคียงกับ ISKNV แต่ทำให้ปลากะพง **ตับม้ามโต ท้องกาง ตายจำนวนมาก**"
              }
            ]
          }
        ]
      },
      {
        "heading": "โรคไวรัส: TiLV, KHV, SVCV, CEVD และการวินิจฉัย",
        "source": "Aquamed final (Vet 85) น.5",
        "body": [
          {
            "sub": "Tilapia Lake Virus (TiLV)",
            "body": [
              {
                "bullets": [
                  "RNA virus **ยังไม่ได้อยู่ในบัญชีของ WOAH**",
                  "มักเจอในปลานิลที่เลี้ยงในกระชังเปิดที่ใช้แหล่งน้ำร่วมกัน มากกว่าการเลี้ยงในบ่อดิน",
                  "Mass mortality โดยเฉพาะในลูกปลาวัยอ่อน และรุนแรงขึ้นถ้าอากาศเปลี่ยนหรือมีการติดเชื้อซ้ำซ้อน",
                  "HP: **syncytial hepatitis**"
                ]
              }
            ]
          },
          {
            "sub": "Koi Herpes Virus (KHV)",
            "body": [
              {
                "bullets": [
                  "คือ **Cyprinid herpesvirus 3 (CyHV-3)**",
                  "เชื้อชอบอากาศเย็น หน้าหนาว พบในฟาร์มที่เลี้ยงในร่ม",
                  "Mortality 70 ถึง 100 เปอร์เซ็นต์ แต่อาการไม่ชัด เหงือกเน่า",
                  "**สิ่งที่ทำให้โรคนี้ติดบัญชี WOAH คือปลาที่หายป่วยจะเป็น persistent infection แพร่เชื้อได้ตลอด**",
                  "ทำให้ตามกฎหมายต้องกักโรคไว้ **อย่างน้อย 21 วัน**"
                ]
              }
            ]
          },
          {
            "sub": "SVCV และ CEVD",
            "body": [
              {
                "bullets": [
                  "SVCV (Spring Viremia of Carp Virus) มักเจอในปลาคาร์ปที่เอาไว้กินในเมืองหนาว **อยู่ในบัญชีของ WOAH เหมือน KHV** target organ คือ ไต และตับ",
                  "CEVD (Carp Edema Virus Disease) เป็น poxvirus ปลาหลับไม่ขยับตัวอยู่ที่ก้นบ่อ เกล็ดฟู เหงือกบวมน้ำ **ไม่ใช่โรคใน WOAH list จึงไม่ต้องตรวจตอนนำเข้า**"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยโรคไวรัส",
            "body": [
              {
                "bullets": [
                  "นิยม molecular techniques เช่น PCR",
                  "ถ้าเป็น VNN เก็บตัวอย่างจาก **สมองและตา**",
                  "โรคอื่นเน้น ไต ม้าม เหงือก ส่วนตับอาจมีไขมันเยอะทำให้ PCR ยาก",
                  "ถ้าเป็น RNA virus ต้องทำ RT-PCR เช่น VNN และ TiLV"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "aqua-shrimp-diseases": {
    "topic": "aqua-shrimp-diseases",
    "title": "โรคในกุ้งและความปลอดภัยทางชีวภาพ (Shrimp diseases)",
    "icon": "📘",
    "summary": "ไวรัสในกุ้งที่อยู่ในบัญชี WOAH กลุ่มโรคที่เกี่ยวข้องกับ Vibrio (AHPND, TPD, WFS) ปรสิต EHP วิธีตรวจวินิจฉัยเชิงโมเลกุล และแนวทางป้องกันในฟาร์ม",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ชนิดกุ้งที่เกี่ยวข้อง และไวรัสกลุ่ม DNA",
        "source": "Aquamed final (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "P. monodon กุ้งกุลาดำ, L. vannamei กุ้งขาวแวนนาไมต์, F. chinensis กุ้งจีน, Macrobrachium spp. กุ้งก้ามกราม",
              "**ไวรัสที่เป็น DNA virus มี 2 ตัวคือ WSSV และ IHHNV** ที่เหลือในหัวข้อนี้เป็น RNA virus ยกเว้น SHIV"
            ]
          }
        ]
      },
      {
        "heading": "White Spot Syndrome Virus (WSSV)",
        "source": "Aquamed final (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "**DNA virus** ทำให้เกิดโรคตัวแดงดวงขาว อยู่ในบัญชีของ WOAH",
              "**100 เปอร์เซ็นต์ mortality ภายใน 3 ถึง 10 วัน**",
              "เจอได้ทั่วโลก ติดกุ้งเลี้ยงทุกชนิด ทุกอายุ",
              "ชอบอากาศเย็น ระบาดตั้งแต่เดือนตุลาคมเป็นต้นไป",
              "**Extremely wide host range** เชื้ออยู่ได้ทั้งในกุ้ง ปู และสัตว์กลุ่ม crustacean อื่น",
              "เชื้ออยู่ในน้ำได้นาน biosecurity จึงสำคัญมาก",
              "สรุปสรุปว่าเป็นโรคที่รุนแรงที่สุด ถ้าคุมโรคนี้ได้ก็คุมโรคอื่นได้หมด"
            ]
          },
          {
            "sub": "การป้องกันเข้าฟาร์ม",
            "body": [
              {
                "bullets": [
                  "ฆ่าเชื้อในบ่อ ตากแดดทั้งก่อนและหลังการเลี้ยง",
                  "ระวัง cross contamination เพราะเชื้อเข้าฟาร์มได้หลายทาง",
                  "ระวัง PL และอาหารสด (fresh food) นำเชื้อเข้ามา",
                  "ฆ่าสัตว์พาหะในบ่อก่อนเลี้ยง โดยใช้คลอรีน กากชา หรือไอโอดีน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "YHV, IMNV, SHIV, MrNV, IHHNV, TSV",
        "source": "Aquamed final (Vet 85) น.6",
        "body": [
          {
            "sub": "Yellowhead Virus (YHV) genotype I",
            "body": [
              {
                "text": "**RNA virus มีเปลือกหุ้ม** ทำให้เกิดโรคหัวเหลือง เจอทั้งในกุ้งกุลาดำ (พบครั้งแรก) และกุ้งขาว มักเจอในกุ้งที่เลี้ยงในพื้นที่ความเค็มต่ำ ตอนระบาดทำให้ฟาร์มกุ้งกุลาดำในภาคกลางเสียหายทั้งหมด และ **กุ้งก้ามกรามเป็นพาหะ** อยู่ในบัญชีของ WOAH"
              }
            ]
          },
          {
            "sub": "Infectious Myonecrosis Virus (IMNV)",
            "body": [
              {
                "text": "โรคติดเชื้อไวรัสกล้ามเนื้อขุ่นขาว **แต่เกิดในกุ้งขาว** เริ่มขุ่นที่กล้ามเนื้อด้านท้ายลำตัวแล้วลามมาด้านหน้า มักเจอในกุ้งโต **กุ้งกุลาดำเป็นพาหะ** ยังไม่มีรายงานในไทย อยู่ในบัญชีของ WOAH"
              },
              {
                "callout": "กล้ามเนื้อขุ่นขาวไม่ใช่ pathognomonic lesion ของโรคนี้ กุ้งที่เป็นตะคริว เครียด แร่ธาตุไม่พอ หรือติดเชื้อแบคทีเรียและปรสิต ก็ทำให้กล้ามเนื้อขุ่นขาวได้",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Shrimp hemocyte iridescent virus (SHIV)",
            "body": [
              {
                "text": "หรือ **Decapod iridescent virus 1 (DIV1)** เป็น DNA virus มีเป้าหมายคือ **hematopoietic tissue และ hemocyte** สัตว์ที่ไวรับคือ L. vannamei, F. chinensis และ M. rosenbergii ในกุ้งก้ามกรามอาการชัดมากคือโรคหัวขาว เกิดสีขาวตรงฐานหนวด (antennal gland) อยู่ในบัญชีของ WOAH"
              }
            ]
          },
          {
            "sub": "MrNV, IHHNV, TSV",
            "body": [
              {
                "bullets": [
                  "Macrobrachium rosenbergii nodavirus ทำให้เกิด **white tail disease** เป็นโรคเดียวที่มีผลกับกุ้งก้ามกรามเป็นหลัก เป็นได้ทุกระยะแต่รุนแรงในระยะลูกกุ้ง",
                  "IHHNV เป็น DNA, Parvovirus ทำให้เกิด **Runt Deformity Syndrome (RDS)**",
                  "TSV แบบ acute กุ้งตัวแดงส้ม ระยะ transition ถ้ารอดมาจะมีจุดดำตรงเปลือก ระยะ chronic เป็น persistent ใน lymphoid organ เมื่อก่อนรุนแรงแต่มีการคัดเลือกกุ้งจนทนเชื้อได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วิธีตรวจวินิจฉัยโรคไวรัสในกุ้ง",
        "source": "Aquamed final (Vet 85) น.7",
        "body": [
          {
            "bullets": [
              "ต้องรู้ก่อนว่าไวรัสอยู่ที่อวัยวะไหน และเป็นไวรัสชนิด RNA หรือ DNA",
              "**Molecular-based technique เป็น gold standard คือ PCR และ RT-PCR**",
              "ตรวจในกุ้งทั่วไป: ตัดเหงือก หรือขาว่ายน้ำ (pleopod)",
              "**ตรวจในพ่อแม่พันธุ์: นิยมตัดปลายขาว่ายน้ำ หรือเก็บขี้กุ้งมาตรวจ** เพราะไม่ต้องฆ่าตัวสัตว์",
              "Hepatopancreas ใช้ตรวจ MBV และ BP",
              "**RT-PCR ดูค่า Cycle threshold (Ct) ถ้าค่าต่ำ แปลว่าเครื่องตรวจสัญญาณได้ตั้งแต่รอบน้อย แสดงว่ามีเชื้อจำนวนมาก**"
            ]
          }
        ]
      },
      {
        "heading": "กลุ่มโรคที่สัมพันธ์กับ Vibrio และ EHP",
        "source": "Aquamed final (Vet 85) น.7",
        "body": [
          {
            "sub": "AHPND (Acute Hepatopancreatic Necrosis Disease)",
            "body": [
              {
                "bullets": [
                  "หรือ EMS (Early Mortality Syndrome) เป็น WOAH listed disease",
                  "เกิดจาก **Vibrio parahaemolyticus ที่ได้รับ toxin gene (Pir-like gene)** ซึ่งทำให้สัตว์กลุ่ม arthropods ตายได้",
                  "**ไม่ใช่กุ้งทุกตัวที่ติด V. parahaemolyticus แล้วจะเกิดโรคตายด่วน** เพราะต้องติดเชื้อสายพันธุ์ที่มียีนสร้าง toxin",
                  "เป็น toxin-like pathology แต่ไม่พบตัวเชื้อที่รอยโรค เพราะเชื้ออยู่ใน GI แล้วส่ง toxin เข้ามาที่ตับ",
                  "Histopath: **HP tubular deformation ร่วมกับ severe inflammation (melanization) ของ HP tubule** ทำให้ตับฝ่อและซีด"
                ]
              }
            ]
          },
          {
            "sub": "TPD, Vibrio harveyi, WFS",
            "body": [
              {
                "bullets": [
                  "**TPD (Translucent post-larvae disease หรือ glass postlarvae disease)** เป็นโรคใหม่ กุ้งไม่กินอาหาร ตัวใส เกิดจาก hyper virulent Vibrio parahaemolyticus",
                  "**Vibrio harveyi** ทำให้เกิด luminous vibriosis หรือโรคเรืองแสง",
                  "**White Feces Syndrome (WFS)** ทุกอย่างที่ทำให้กุ้งมีปัญหาระบบ GI ก็ทำให้ขี้ขาวได้ คาดว่าสาเหตุโน้มนำมาจาก EHP ร่วมกับ Vibrio จำนวนมากและ stress มีการใช้กากถั่วเหลืองผสมในอาหารกุ้งมากเกินไป กุ้งย่อยไม่ค่อยได้ Vibrio จึงโตเยอะ ติด EHP ก่อนทำให้เซลล์ตับตายหลุดลอก Vibrio จึงซ้ำเติม อาการคือลำไส้เป็นสีขาว"
                ]
              }
            ]
          },
          {
            "sub": "EHP (Enterocytozoon hepatopenaei)",
            "body": [
              {
                "bullets": [
                  "**Spore-forming intracellular parasite** ในกลุ่ม microsporidian",
                  "spore เข้าไปใน GI แล้วไปที่ HP ชอบ B cell และ R cell ที่สะสมอาหาร จากนั้น **ยิง polar tube ปล่อย merozoite** ทำให้เซลล์ตับตาย",
                  "แทนที่กุ้งจะเอาพลังงานไปใช้เจริญเติบโต ต้องเอามาซ่อมท่อตับตัวเอง จึง **โตช้าแต่ไม่ตาย ทำให้ FCR สูง**",
                  "**ไม่มีการรักษาจำเพาะ** ทำได้แค่ตอนเตรียมบ่อ โดยเพิ่ม pH ในน้ำหลอกให้ spore ยิง polar tube ออกมา พอไม่เจอกุ้งก็ตายไปเอง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การป้องกันโรคแบคทีเรียในกุ้ง และโรคจากสารพิษ",
        "source": "Aquamed final (Vet 85) น.7",
        "body": [
          {
            "bullets": [
              "ถ้าใช้ยาปฏิชีวนะต้องมีระยะหยุดยา และดูเงื่อนไขการส่งออก",
              "ใช้ probiotic เพื่อไปแบ่งพื้นที่กับแบคทีเรียก่อโรค",
              "Screening ตั้งแต่พ่อแม่พันธุ์ ส่วน PL อนุบาลให้แข็งแรงก่อนแล้วค่อยปล่อยลงบ่อใหญ่"
            ]
          },
          {
            "text": "Toxic diseases ที่ต้องนึกถึง: **algae blooms, mold toxin, heavy metal (copper, cadmium), pesticide และ herbicide ที่ชะล้างลงมา**"
          }
        ]
      }
    ]
  },
  "aqua-water-quality": {
    "topic": "aqua-water-quality",
    "title": "พิษวิทยาสัตว์น้ำและคุณภาพน้ำ (Aquatic toxicology)",
    "icon": "📘",
    "summary": "แหล่งมลพิษในน้ำ สามเฟสของการเกิดพิษ ปัจจัยที่มีผลต่อความเป็นพิษ แนวคิด Adverse Outcome Pathway กลุ่มสารพิษหลัก 6 กลุ่ม และ biochemical markers ที่ใช้บอกการตอบสนองของสัตว์น้ำ",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "แหล่งที่มาของมลพิษ และสามเฟสของการเกิดพิษ",
        "source": "Aquamed final (Vet 85) น.8",
        "body": [
          {
            "text": "สารพิษส่งผลต่อสุขภาพคนและสัตว์น้ำ จึงมีการทำ **Hazard และ risk assessment** ถ้ามี risk ก็ต้องมี management โดยอาศัยการ communication ที่ดี ซึ่งเป็นงานสาย VPH"
          },
          {
            "sub": "Source ของมลพิษ",
            "body": [
              {
                "bullets": [
                  "ชุมชน เช่น เศษอาหาร ยาสีฟัน เครื่องสำอาง สบู่ ยา",
                  "อุตสาหกรรม เช่น ไมโครพลาสติก โลหะหนัก",
                  "เกษตรกรรม เช่น ยาฆ่าแมลง ปุ๋ย ของเสียจากสัตว์",
                  "ขนส่งน้ำมัน เช่น เรือขนน้ำมันล่ม ปิโตรเลียมและ PAHs รั่ว"
                ]
              }
            ]
          },
          {
            "sub": "Phases of toxic effects มี 3 เฟส",
            "body": [
              {
                "bullets": [
                  "**1. Fate และ exposure** สารพิษความเข้มข้นเท่าไหร่ ไปที่ไหน มีการเปลี่ยนแปลงรูปเป็นพิษน้อยลงหรือมากขึ้น ทั้งหมดมีผลต่อ **bioavailability ยิ่งค่าสูงสารพิษยิ่งเข้าร่างกายได้มาก**",
                  "**2. Effects** Toxicokinetic (uptake) ทำให้เกิด bioaccumulation ในร่างกาย ส่วน Toxicodynamic คือผลของสารพิษต่อเนื้อเยื่อเป้าหมาย เน้นที่ MOA ผลลัพธ์มี 2 ทางคือตายหรือรอด ขึ้นกับการปรับตัวหรือ compensate ของร่างกาย",
                  "**3. Ecological effects** มีผลต่อประชากร ระบบนิเวศ และ biocoenosis ซึ่งคือความสัมพันธ์ร่วมกันระหว่างสิ่งมีชีวิต"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Factors affecting toxicity",
        "source": "Aquamed final (Vet 85) น.8",
        "body": [
          {
            "bullets": [
              "**Chemicals** เน้น systemic effects และ biotransformation เช่น แบคทีเรียเปลี่ยนสารพิษให้เป็น active หรือ inactive",
              "**Exposure** ระยะเวลาและรูปแบบของการสัมผัส"
            ]
          },
          {
            "sub": "Surrounding medium ในน้ำ (ออกสอบบ่อย)",
            "body": [
              {
                "bullets": [
                  "Temperature: **Ammonia จะ toxic มากขึ้นถ้าอุณหภูมิสูง**",
                  "DO: ออกซิเจนสูงทำให้สัตว์หายใจมากขึ้น จึงรับสารพิษเข้ามามากขึ้นตาม",
                  "**pH: pH สูงทำให้ ammonium (NH4+) แตกตัวเป็น ammonia (NH3) มากขึ้น ซึ่ง NH3 เป็นพิษมากกว่าเพราะผ่าน cell membrane ได้**",
                  "Salinity: ความเป็นพิษพอกันทั้งน้ำจืดและน้ำเค็ม",
                  "**ความกระด้าง: ถ้ากระด้างมากคือมี Ca2+ เยอะ ไอออนพวกนี้จะไปจับที่เหงือก ทำให้สารพิษเข้าทางเหงือกได้น้อยลง**",
                  "สารแขวนลอยในน้ำมักทำให้ความเป็นพิษลดลง"
                ]
              }
            ]
          },
          {
            "sub": "Organisms",
            "body": [
              {
                "bullets": [
                  "Test species เช่น พืช ปลา กุ้ง",
                  "Sex: ฮอร์โมนเพศมีผลต่อการกำจัดสารพิษที่ต่างกัน",
                  "**Age และ size: ยิ่งเด็กยิ่งไวรับ**",
                  "Life stage: ระยะ inter-molt เสี่ยงน้อยที่สุด",
                  "Health and nutrition",
                  "Acclimation: การได้รับสารพิษขนาดต่ำเป็นเวลานาน อาจทนได้มากขึ้นหรืออ่อนแอลงก็ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Adverse Outcome Pathway (AOP)",
        "source": "Aquamed final (Vet 85) น.9",
        "body": [
          {
            "text": "เป็นแนวคิดที่อธิบายว่าผลกระทบจากสารเคมีหนึ่งอย่าง สามารถลุกลามจากระดับเล็กที่สุดในร่างกาย ไปสู่ผลเสียใหญ่ที่สังเกตได้อย่างไร โดยเรียงเป็นลำดับขั้นชัดเจนตั้งแต่ต้นเหตุจนถึงผลลัพธ์ปลายทาง"
          },
          {
            "bullets": [
              "เริ่มจาก **Molecular Initiating Event (MIE)** คือเหตุการณ์ระดับโมเลกุลที่สารไปกระทบต่อระบบชีวภาพ ณ จุดเริ่มต้น เช่น การจับกันของสารพิษกับตัวรับหรือกับ DNA",
              "จากนั้นเกิด **Key Events (KEs)** ซึ่งไล่ระดับจากโมเลกุล ไปออร์แกเนลล์ เซลล์ เนื้อเยื่อ อวัยวะ สิ่งมีชีวิต และประชากร",
              "แต่ละ KE เชื่อมโยงกันด้วย **Key Event Relationships (KERs)** ที่บอกความเป็นเหตุและผล เช่น mitochondria พัง แล้วขาดพลังงาน แล้วเซลล์ตาย",
              "เมื่อสะสมรุนแรงมากพอจะไปสู่ **Adverse Outcome (AO)** คือผลเสียปลายทางที่มองเห็นได้ในระดับสิ่งมีชีวิตหรือประชากร เช่น gross pathology การรอดต่ำ การเจริญพันธุ์ผิดปกติ หรือผลกระทบเชิงนิเวศ"
            ]
          },
          {
            "sub": "ตัวอย่าง AOP ของ Fadrozole",
            "body": [
              {
                "bullets": [
                  "เป็นสารที่ปนเปื้อนในแหล่งน้ำและสัมผัสกับปลา",
                  "**ไปยับยั้ง Aromatase ทำให้ปลาสร้าง E2 น้อยลง จึงสร้าง vitellogenin น้อยลง วางไข่น้อยลง และประชากรลดลง**",
                  "ผลระดับ molecular ทดสอบ in vitro ได้โดยไม่ต้องใช้สิ่งมีชีวิตจริง แต่ผลระดับ organ ขึ้นไปต้องทำในสัตว์ทดลอง",
                  "แนวคิดนี้จึงมีเป้าหมายเพื่อ **ลดการใช้สัตว์ทดลอง** โดยเช็คในหลอดทดลองหา MIE เพื่อเชื่อมโยงไปหา AO"
                ]
              }
            ]
          },
          {
            "sub": "Network of AOP และ chemical mixtures",
            "body": [
              {
                "bullets": [
                  "สารเคมีหนึ่งชนิดสามารถกระตุ้น MIE ได้หลายแบบ และ MIE ที่ต่างกันจะนำไปสู่ KE ที่ต่างกันและให้ AO คนละรูปแบบ",
                  "**ความเข้มข้นมีผลมาก** ถ้าความเข้มข้นต่ำอาจกระตุ้นเพียงบาง MIE แต่พอสูงขึ้นจะเกิด MIE เพิ่มอีกทาง",
                  "Key Events จากแต่ละเส้นทางแบ่งปัน ทับซ้อน หรือเสริมกันได้ ทำให้ผลสุดท้ายรุนแรงขึ้น",
                  "ผลกระทบจึงไม่ใช่เส้นทางเดี่ยว แต่เป็นเครือข่ายของ AOP หลายเส้นที่เชื่อมโยงกัน ทำให้การคาดการณ์ผลของสารผสมยากกว่าสารเดี่ยว"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Aquatic toxicants 6 กลุ่ม",
        "source": "Aquamed final (Vet 85) น.10",
        "body": [
          {
            "sub": "1. โลหะหนัก",
            "body": [
              {
                "bullets": [
                  "**Methylmercury**: เกิด oxidative stress ทำลายโปรตีน นำไปสู่ neurodegeneration",
                  "**Lead**: รบกวน MEK-ERK1/2 pathway ทำให้เกิด Ca2+ dysregulation และ neurotoxicity",
                  "**Cadmium**: MIE หลักคือ receptor-mediated endocytosis ทำลาย lysosome นำไปสู่ nephrotoxicity และ backbone deformity",
                  "**Arsenic**: จับกับหมู่ SH ของโปรตีน เกิด oxidative stress มีผลหลายอวัยวะ เช่น ระบบประสาทและการกดภูมิ"
                ]
              }
            ]
          },
          {
            "sub": "2. POPs และ PFAS",
            "body": [
              {
                "bullets": [
                  "**PCBs, Dioxins, PAHs มี MIE เหมือนกันคือจับกับ AhR (Aryl hydrocarbon receptor)** ทำให้เกิด endocrine disruption และระบบสืบพันธุ์ล้มเหลว",
                  "**PFAS (forever chemicals)** อยู่ในวัสดุหลายอย่างที่ใช้ในชีวิตประจำวัน ส่งผลต่อร่างกายไม่ค่อยจำเพาะแต่อันตราย จัดอยู่ในกลุ่ม POPs เหมือนกัน"
                ]
              }
            ]
          },
          {
            "sub": "3. Microplastics",
            "body": [
              {
                "text": "MIE คือ **ROS เพิ่มขึ้น ทำให้เกิด oxidative stress** รอยโรคไม่จำเพาะ ขึ้นกับอวัยวะ"
              }
            ]
          },
          {
            "sub": "4. ยาฆ่าแมลง (Pesticides) 3 กลุ่ม",
            "body": [
              {
                "bullets": [
                  "**Organochlorine เช่น DDT** จัดอยู่ใน POPs จับกับ estrogen หรือ androgen receptor รบกวนฮอร์โมนเพศ ทำให้ตัวผู้มีลักษณะเป็นตัวเมีย หรือไข่ไม่สมบูรณ์",
                  "**Organophosphate และ Carbamates ยับยั้ง Acetylcholinesterase (AChE)** ทำให้ acetylcholine คั่งใน synaptic cleft กระแสประสาทรวน อัมพาตหรือตาย",
                  "**Pyrethroids ขวางการปิดของ Na+ channel** ทำให้ depolarization ค้าง ระบบประสาทผิดปกติ"
                ]
              }
            ]
          },
          {
            "sub": "5. PPCPs (ยาและผลิตภัณฑ์ดูแลส่วนบุคคล)",
            "body": [
              {
                "text": "**SSRI (ยาต้านซึมเศร้า) ไปจับ Serotonin Transporter (SERT)** ทำให้ serotonin นอกเซลล์เยอะเกิน พฤติกรรมสัตว์เปลี่ยน เช่น ก้าวร้าวลดลง ไม่กินอาหาร หรือว่ายน้ำผิดปกติ"
              }
            ]
          },
          {
            "sub": "6. Cyanotoxins",
            "body": [
              {
                "bullets": [
                  "สร้างจาก cyanobacteria หรือสาหร่ายสีเขียวแกมน้ำเงิน เกิดจากปุ๋ยปนเปื้อนลงน้ำ",
                  "**Microcystin และ Nodularin ยับยั้ง protein phosphatase ทำให้เกิด hepatotoxicity**",
                  "**Anatoxin แข่งจับ acetylcholine receptor ทำให้เกิด muscle stimulation**",
                  "**Saxitoxin บล็อก Na+ channel ทำให้กระแสประสาทเดินไม่ได้ เกิดอัมพาต** เป็นต้นเหตุของ Paralytic Shellfish Poisoning จากการกินหอยที่ปนเปื้อน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Biochemical markers และกรณีศึกษา",
        "source": "Aquamed final (Vet 85) น.11",
        "body": [
          {
            "text": "Biochemical marker คือ **การตรวจการตอบสนองของสิ่งมีชีวิตหลังได้รับสารพิษในน้ำ** ในระดับ molecule ไป cell ไป tissue ใช้บอกว่าสิ่งมีชีวิตกำลังเครียด กำลัง detox โดน endocrine disrupt หรือเกิด oxidative stress"
          },
          {
            "sub": "กลุ่ม markers ที่ต้องจำ",
            "body": [
              {
                "bullets": [
                  "**ROS = oxidative stress นำไปสู่ cell damage**",
                  "**Antioxidant system (SOD, CAT, GPx) เพิ่มขึ้น = ร่างกายกำลังต้าน oxidative stress**",
                  "**VTG และ sex hormone = endocrine disruptor indicator**",
                  "**EROD และ P450 = detoxification activation** เอนไซม์พวกนี้บอกว่าเกิดความเครียดหรือร่างกายพยายามกำจัดสารพิษ",
                  "**Metallothionein = metal exposure**",
                  "ปลาไม่วางไข่ = endocrine disruption",
                  "ตรวจ metabolite แทนสารพิษตัวจริง = biotransformation concept"
                ]
              }
            ]
          },
          {
            "sub": "Case 1 Whitebait deformity",
            "body": [
              {
                "text": "สารพิษกลุ่ม herbicide ทำให้ immunity ในปลาต่ำลง ปลาจึงติดปรสิต ปรสิตแพร่พันธุ์ออกมาและเพิ่มจำนวนในหอยซึ่งเป็นพาหะ ปลาตัวเล็กติดปรสิตมากจนกระดูกคด และโดนล่าได้ง่ายขึ้น **ประเด็นสำคัญคือไม่ใช่เพราะปรสิตเก่งขึ้น แต่เพราะสารพิษทำลาย immune และเพิ่ม reproduction ของพาหะ**"
              }
            ]
          },
          {
            "sub": "Case 2 White spot in prawn",
            "body": [
              {
                "text": "พบร่องรอย pesticide mixture ก่อนเกิด outbreak สารกำจัดศัตรูพืชทำให้สุขภาพกุ้งแย่ลงจึงอ่อนแอต่อไวรัส **ประเด็นสำคัญคือสารเคมีไม่ได้ฆ่ากุ้งโดยตรง แต่ทำให้ภูมิตกจนไวต่อโรค**"
              }
            ]
          }
        ]
      },
      {
        "heading": "ค่าคุณภาพน้ำที่ต้องจำ (จากส่วน Aquarium management)",
        "source": "Aquamed final (Vet 85) น.12",
        "body": [
          {
            "bullets": [
              "ตรวจวัดคุณภาพน้ำ แร่ธาตุ ค่า DO และอุณหภูมิ **วัดในตู้เลยจะแม่นยำที่สุด**",
              "**pH 8.1 ถึง 8.4 และ Alkalinity 90 ถึง 180**",
              "**Nitrate ต่ำกว่า 5 มิลลิกรัมต่อลิตร** ต้องเปลี่ยนน้ำเพื่อกำจัดออกให้ได้มากที่สุด ไม่ให้สะสม",
              "**Ammonia และ Nitrite มีความเป็นพิษแบบเฉียบพลันมากกว่า Nitrate**",
              "**ค่า ORP สัมพันธ์กับโอโซน ถ้ามีประจุในน้ำมาก ORP จะสูง แสดงว่าอาจมีโอโซนในน้ำสูง**",
              "Spectrometer ใช้วัดปริมาณแร่ธาตุโดยดูค่าสี",
              "เกลือมีหลายแบบราคาต่างกัน ทั้งเกลือเลี้ยงปลา เกลือปะการัง และเกลือนา ซึ่งต้องใส่แร่ธาตุเพิ่ม",
              "น้ำที่ stock ไว้ต้องหมุนเวียนตลอด ถ้าน้ำนิ่งสิ่งมีชีวิตจะตายและน้ำจะเสีย"
            ]
          }
        ]
      }
    ]
  },
  "aqua-aquarium-vet": {
    "topic": "aqua-aquarium-vet",
    "title": "สัตวแพทย์พิพิธภัณฑ์สัตว์น้ำ (Aquarium veterinarian)",
    "icon": "📘",
    "summary": "เป้าหมายและบทบาทของสัตวแพทย์ในพิพิธภัณฑ์สัตว์น้ำ การออกแบบและดูแลตู้ อาหารและการให้อาหาร การกักโรค รวมถึงงาน health management และ medical management ตามสไลด์ที่อาจารย์บรรยาย",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "เป้าหมายและขอบเขตงาน",
        "source": "Aquamed final (Vet 85) น.12-13",
        "body": [
          {
            "bullets": [
              "**Goal คือกักขังได้อย่างมีสวัสดิภาพและอายุยืนยาวที่สุด**",
              "ตู้เล็ก ตู้ใหญ่ หรือพิพิธภัณฑ์สัตว์น้ำ นับเป็น aquarium ทั้งหมด",
              "**สัตวแพทย์พิพิธภัณฑ์สัตว์น้ำมักรักษาแบบฝูง** ถ้ามีตัวที่ต้องรักษารายเดี่ยวก็ทำได้",
              "ต้อง know the species เพราะในพิพิธภัณฑ์มีสัตว์หลายร้อยชนิด ทั้งปลากระดูกอ่อน (ฉลาม กระเบน) สัตว์ไม่มีกระดูกสันหลัง (นอติลุส กุ้งมังกร) และสัตว์เลื้อยคลานกับนก (เต่า งู เพนกวิน)"
            ]
          },
          {
            "sub": "สิ่งที่ต้องคิดตอน set up aquarium",
            "body": [
              {
                "bullets": [
                  "จะใช้ตู้แบบไหน ใส่อะไร เลี้ยงชนิดไหน และอยู่ร่วมกันได้หรือไม่",
                  "น้ำต้องมีแร่ธาตุถ้าเลี้ยงพวกกุ้งและปู",
                  "ระบบกรอง LSS",
                  "อาหารส่งผลระยะยาว ต้องดูความสดและขนาดอาหารเทียบกับตัวปลา",
                  "ตัวสัตว์ จับมาอย่างไร ขนส่ง กักโรค และการรักษาผ่าซาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การออกแบบตู้และการบำรุงรักษา",
        "source": "Aquamed final (Vet 85) น.12",
        "body": [
          {
            "bullets": [
              "ต้องมีที่หลบภัย และจัดตู้ให้เหมาะทั้งกับการโชว์และลักษณะนิสัยของสัตว์แต่ละชนิด เช่น ปลาชอบว่ายผิวน้ำ หรือปลาก้นตู้",
              "**ตู้ปะการังต้องมีน้ำหมุนตลอดและแสงต้องแรง** อาจต้องทำความสะอาดบ่อยเพราะแสงในตู้ไม่แรงเท่าแสงธรรมชาติ และมีการสลับตัวที่โชว์กับตัวที่พักฟื้นหลังบ้านที่โดนแดด เพื่อให้สีสวยตลอด",
              "**ตู้แมงกะพรุนต้องไม่มีเหลี่ยม และน้ำหมุนเวียน** เพราะแมงกะพรุนจะเคลื่อนที่ตามกระแสน้ำตลอด",
              "ปลาตีนต้องมีทั้งที่บกและน้ำตื้น",
              "Maintenance: ทำความสะอาด ขัดกระจก พื้นที่หมักหมมต้องดูดสิ่งสกปรกออกโดยใช้ vacuum หรือ syphon และเปลี่ยนน้ำพร้อมเติมแร่ธาตุ หรือกรองน้ำเดิมตลอด"
            ]
          }
        ]
      },
      {
        "heading": "อาหาร การให้อาหาร และการกักโรค",
        "source": "Aquamed final (Vet 85) น.12",
        "body": [
          {
            "bullets": [
              "**Live food** ให้กับปลาที่เพิ่งเข้ามาใหม่และยังไม่ชินกับการกินอาหารเม็ด",
              "**Blend food** คือผสมอาหารทำเป็นก้อน",
              "**Vitamin** ให้เป็นเม็ดสำหรับรายตัว หรือเป็นผงสำหรับให้ทั้งฝูง",
              "ทำ **feeding station** เอาอาหารใส่ถาด ถ้าตู้ใหญ่มากอาจมี 2 ถึง 3 จุด และให้ได้ทั้งรายตัวและทั้งฝูง",
              "**Quarantine เพื่อป้องกันการแพร่โรคและปรสิต กักอย่างน้อย 1 เดือน และปรับอาหารในช่วงนี้**"
            ]
          }
        ]
      },
      {
        "heading": "Health management และ Medical management (สไลด์)",
        "source": "Aquamed final (Vet 85) น.13-16",
        "body": [
          {
            "bullets": [
              "**Animal observation ทุกวัน** สัตวแพทย์ต้องรู้จักสัตว์ ดูพฤติกรรม การกินอาหาร และบาดแผล บางครั้งต้องดำน้ำลงไปดูในตู้เอง",
              "Water quality and interpretation ตรวจน้ำและแปลผลได้",
              "Life Support System",
              "Nutritional requirement และ food preserve and preparation ละลายอาหารแช่แข็งแบบ **slow thawing** โดยไล่อุณหภูมิเป็นขั้นตามที่จดไว้ข้างสไลด์ คือจาก -20 องศาเซลเซียส ไป -2 แล้ว 0 แล้ว 4 องศาเซลเซียส",
              "Food quality ต้องคัดปลาที่ช้ำหรือเสียออก ไม่นำมาใช้",
              "Team work and safety การจับสัตว์ใหญ่ต้องทำเป็นทีม",
              "Health check, diagnosis (X-ray, ultrasound), treatment, surgical treatment, force feeding โดยใช้สายยาง และ target feeding",
              "Research and conservation เช่น breeding program"
            ]
          },
          {
            "callout": "โน้ตข้างสไลด์เขียนเตือนเรื่อง capture myopathy ว่าการจับควรทำให้เสร็จภายในเวลาจำกัด และมีตัวเลขกำกับไว้ประมาณ 12 นาที ตัวเลขนี้อ่านจากลายมือ ควรเช็คกับที่อาจารย์บรรยายปีนี้อีกครั้ง",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "aqua-life-support": {
    "topic": "aqua-life-support",
    "title": "ระบบพยุงชีวิตและการบำบัดน้ำ (Life Support System)",
    "icon": "📘",
    "summary": "การปรับอุณหภูมิและ pH การฆ่าเชื้อด้วย UV และโอโซน ระบบกรอง 3 แบบ protein skimmer และ backwash ตามที่บันทึกไว้ในส่วน aquarium management",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "Water treatment",
        "source": "Aquamed final (Vet 85) น.12",
        "body": [
          {
            "bullets": [
              "**Temperature** ปรับด้วย heater หรือ chiller",
              "**pH buffer** ใช้ Na2CO3 ซึ่งเป็นเบสแก่ ร่วมกับ NaHCO3 ซึ่งเป็นเบสอ่อน **ใส่ 2 ตัวเพื่อไม่ให้ pH แกว่งเกินไป** เติมแล้วน้ำอาจขุ่นได้เป็นปกติ",
              "**UV** น้ำผ่านหลอดไฟในกระบอกเคลือบ ถ้ามีตะกรันจะบัง จึงต้องทำความสะอาด และหลอดมีระยะใช้งานต้องเปลี่ยนตามกำหนด",
              "**Ozone** เครื่องต่อเข้ากับ protein skimmer โดยทิศทางน้ำกับลมสวนทางกัน การอัดโอโซนกับอากาศเข้าไปสวนทางกับน้ำ **ทำให้โอโซนแตกตัวง่ายขึ้น และช่วยฆ่าเชื้อไปด้วย**"
            ]
          }
        ]
      },
      {
        "heading": "Filtration",
        "source": "Aquamed final (Vet 85) น.12",
        "body": [
          {
            "bullets": [
              "**Mechanical** กรองเชิงกล",
              "**Chemical** เช่น UV และ charcoal",
              "**Biological** ใช้วัสดุที่มีพื้นที่ผิวมากให้แบคทีเรียเกาะได้เยอะ",
              "**Backwash คือการล้างตะกอนใน sand filter ออก**",
              "Protein skimmer จะมีปัญหาถ้าน้ำและลมไหลสวนทางกันด้วยความเร็วไม่เท่ากัน",
              "ใน 1 ตู้สามารถมีระบบบำบัดน้ำมากกว่า 1 ระบบได้",
              "ระบบที่ใช้ในพิพิธภัณฑ์คือ sand filter ร่วมกับโอโซน"
            ]
          }
        ]
      }
    ]
  },
  "aqua-conservation": {
    "topic": "aqua-conservation",
    "title": "สัตว์ทะเลเลี้ยงลูกด้วยนมและการอนุรักษ์ (Marine mammals)",
    "icon": "📘",
    "summary": "สัตว์สงวนทางทะเลของไทย การจำแนก Cetacea Pinnipedia Sirenia ลักษณะที่ใช้จำแนก กายวิภาคและสรีรวิทยาที่ปรับตัวสำหรับการดำน้ำ ชีววิทยาของพะยูนและหญ้าทะเล รวมถึงโรคสัตว์สู่คนที่พบในสัตว์ทะเล",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "สัตว์สงวน (สัตว์ทะเล) ตาม พ.ร.บ.สงวนและคุ้มครองสัตว์ป่า พ.ศ. 2562",
        "source": "Aquamed final (Vet 85) น.17 (สไลด์ติดป้าย ออกสอบ 100 เปอร์เซ็นต์)",
        "body": [
          {
            "bullets": [
              "**พะยูนหรือหมูน้ำ (Dugong dugon)**",
              "**วาฬบรูด้า (Balaenoptera edeni)**",
              "**วาฬโอมูระ (Balaenoptera omurai)**",
              "**ปลาฉลามวาฬ (Rhincodon typus)**",
              "**เต่ามะเฟือง (Dermochelys coriacea)**"
            ]
          },
          {
            "text": "อินโฟกราฟิกบนสไลด์พาดหัวว่าเป็นสัตว์ทะเล 4 ชนิดที่ประกาศเป็นสัตว์สงวนใหม่ (วาฬบรูด้า วาฬโอมูระ ปลาฉลามวาฬ เต่ามะเฟือง) โดยพะยูนถูกขึ้นบัญชีสัตว์สงวนอยู่ก่อนแล้ว"
          },
          {
            "callout": "โน้ตข้างสไลด์ Baleen whale เขียนว่า วาฬบรูด้า วาฬโอมูระ และวาฬสีน้ำเงิน เป็นสัตว์สงวนในไทย แต่รายชื่อบนสไลด์สัตว์สงวนเองไม่มีวาฬสีน้ำเงิน ตรงนี้ขัดกันเอง ให้ยึดรายชื่อบนสไลด์และที่อาจารย์บรรยายปีนี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การจำแนกกลุ่มและลักษณะที่ใช้จำแนก",
        "source": "Aquamed final (Vet 85) น.17",
        "body": [
          {
            "sub": "Marine Mammal Classification",
            "body": [
              {
                "bullets": [
                  "**Order Cetacea**: Toothed whales และ Baleen whales",
                  "**Order Pinnipedia**: Seal, Sea lion หรือ Fur seal และ Walrus โดย Family Otariidae คือกลุ่ม eared seal และไม่มี order นี้ในธรรมชาติของไทย",
                  "**Order Sirenia**: Dugong (Family Dugongidae) และ Manatee (Family Trichechidae)"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะที่ใช้ในการจำแนก",
            "body": [
              {
                "bullets": [
                  "**Blowhole หรือจำนวนรูหายใจ 1 หรือ 2 รู โดย 1 รูคือ toothed whales และ 2 รูคือ baleen whales**",
                  "**Dorsal fin หรือครีบหลัง ดูขนาด รูปร่าง และตำแหน่ง ใช้แยกตัวเป็นรายตัวได้เลย**",
                  "Baleen หรือซี่กรอง ปากและหัว ฟันหรือซี่กรองและจำนวนฟัน",
                  "ครีบข้าง ดูรูปร่างและขนาด ครีบหาง และลำตัว ดูสีและลวดลาย"
                ]
              }
            ]
          },
          {
            "sub": "Baleen whale",
            "body": [
              {
                "text": "สไลด์ระบุจำนวนชนิดในไทย 5 ชนิด และทั่วโลก 16 ชนิด โน้ตข้างสไลด์เขียนว่า **มีแค่วาฬบรูด้าที่อาศัยอยู่ในน่านน้ำไทยจริง ที่เหลือแค่ว่ายผ่านมา**"
              }
            ]
          },
          {
            "sub": "โลมาอิรวดี (Irrawaddy dolphin)",
            "body": [
              {
                "text": "สไลด์ระบุจำนวนประชากรตามแหล่ง ได้แก่ Ayeyarwady River ประมาณ 59 ตัวในปี 1998, Mekong River ประมาณ 69 ตัวในปี 2001 ถึง 2003, Malampaya Sound ประมาณ 77 ตัวในปี 2001 และ **ทะเลสาบสงขลา ประมาณ 25 ตัวในปี 2003 เหลือ 14 ตัวในปี 2023** โดยมีโน้ตว่าเดิมโลมาอิรวดีไม่ได้อยู่ในทะเลสาบตั้งแต่แรกแต่หลุดเข้ามา และลักษณะเด่นคือครีบหลังเล็ก"
              }
            ]
          }
        ]
      },
      {
        "heading": "กายวิภาคและสรีรวิทยาที่ต้องจำ",
        "source": "Aquamed final (Vet 85) น.18-19",
        "body": [
          {
            "sub": "ลักษณะร่วมของสัตว์เลี้ยงลูกด้วยนม",
            "body": [
              {
                "bullets": [
                  "**Dark red skeletal muscle เพราะมี myoglobin สูง ทำให้ oxygen carrying capacity สูง จึงดำน้ำได้อย่างมีประสิทธิภาพ**",
                  "Terminal airways reinforced with cartilage และ/หรือ muscle",
                  "มี diaphragm",
                  "มี fur หรือ hair ไม่ใช่ขนนก เพื่อเก็บความร้อน",
                  "มี mammary glands, viviparous โดยตัวอ่อนรับสารอาหารผ่านรก และเป็น ascrotal testicles"
                ]
              }
            ]
          },
          {
            "sub": "External appearance",
            "body": [
              {
                "bullets": [
                  "**Pectoral fin หรือ flippers ใช้เปลี่ยนมุมเอียงขณะว่ายน้ำ ไม่มีกระดูกไหปลาร้า (no clavicle) และ humero-scapular joint เป็นข้อที่ยึดติด (fixed)**",
                  "ผิวหนังของ cetacean ดัดแปลงให้ต้านน้ำน้อยและลำตัวเพรียว",
                  "**Blubber คือชั้นไขมันหนาที่มีหลอดเลือดมาเลี้ยง อยู่ใต้ผิวหนังของ cetacean pinniped และ sirenian ทุกชนิด เป็นแหล่งสะสมพลังงานหลัก ให้ฉนวนความร้อน และช่วยเรื่อง positive buoyancy**"
                ]
              }
            ]
          },
          {
            "sub": "ระบบภายใน",
            "body": [
              {
                "bullets": [
                  "**ปอด: cetacean แลกเปลี่ยนอากาศได้ประมาณ 80 ถึง 90 เปอร์เซ็นต์ของปริมาตรอากาศในปอดต่อการหายใจ 1 ครั้ง ขณะที่สัตว์เลี้ยงลูกด้วยนมบนบกได้ประมาณ 10 ถึง 15 เปอร์เซ็นต์ และมี cartilaginous bronchioles เพื่อกันหลอดลมยุบตัวใต้ความดันสูง**",
                  "**Hepatobiliary: cetacean ไม่มีถุงน้ำดี (no gall bladder) และ common bile duct เปิดเข้าสู่ duodenal ampullae โดยตรง**",
                  "**ไต: multilobulated kidneys มีความสามารถทำให้ปัสสาวะเข้มข้นสูง และมี ureter แยกไปยังกระเพาะปัสสาวะ**"
                ]
              }
            ]
          },
          {
            "sub": "Biology of Sirenians",
            "body": [
              {
                "bullets": [
                  "**มีฟัน incisor 2 ซี่ที่เป็น tusk เห็นชัดในตัวผู้**",
                  "**โครงกระดูกจัดเป็นกระดูกที่หนาแน่นที่สุดกลุ่มหนึ่งในอาณาจักรสัตว์ เพื่อถ่วงสมดุลกับ blubber ที่ลอยน้ำ ช่วยควบคุมการลอยจมใต้น้ำ**",
                  "**หญ้าทะเลที่ระบุบนสไลด์ (ติดป้ายออกสอบ) ได้แก่ หญ้าใบมะกรูด (Spoon seagrass, Halophila ovalis), หญ้าชะเงาใบฟันเลื่อย (Serrated ribbon seagrass, Cymodocea serrulata) และหญ้ากุยช่ายทะเล (Narrowleaf seagrass, Halodule uninervis)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Zoonosis จากสัตว์ทะเลเลี้ยงลูกด้วยนม",
        "source": "Aquamed final (Vet 85) น.19",
        "body": [
          {
            "bullets": [
              "**Brucellosis เป็น zoonosis**",
              "**Melioidosis เกิดจาก Burkholderia pseudomallei ซึ่งชื่อเดิมคือ Pseudomonas pseudomallei**",
              "**Mycobacterium เป็น zoonosis** สไลด์ยกรายงาน Mycobacterium abscessus pneumonia ในโลมาปากขวดแอตแลนติก (Tursiops truncatus) ประกอบ"
            ]
          },
          {
            "callout": "หน้าแรกของสรุปบันทึกไว้ว่าข้อสอบพาร์ทนี้ถามเรื่อง zoonosis จาก marine mammals ว่ามีโรคอะไรบ้าง และถามเรื่องการช่วยเหลือสัตว์ทะเล ให้ทบทวนหัวข้อนี้ให้ครบ",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "aqua-disease-control": {
    "topic": "aqua-disease-control",
    "title": "หน่วยงานและกฎหมายควบคุมโรคระบาดสัตว์น้ำ (Aquatic disease control)",
    "icon": "📘",
    "summary": "บทบาทของกรมประมง กรมปศุสัตว์ และ มกอช. องค์กรระหว่างประเทศ WOAH CODEX IPPC และ WTO SPS โครงสร้าง Aquatic Code และ Aquatic Manual ระบบ WAHIS องค์กรระดับภูมิภาค และมาตรฐานบังคับของไทย",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "หน่วยงานไทย 3 หน่วยงานหลัก",
        "source": "Aquamed final (Vet 85) น.20-23 (คลังข้อสอบเก่า)",
        "body": [
          {
            "callout": "ส่วนนี้เรียบเรียงจากคลังข้อสอบที่รุ่นพี่รวบรวมไว้ ไม่ใช่โน้ตเลกเชอร์ที่เขียนเป็นเนื้อความ จึงเป็นเนื้อหาที่ผ่านการจำและเรียบเรียงต่อ ให้ใช้เป็นแนวทางทบทวนและยึดคำบรรยายของอาจารย์ปีนี้เป็นหลัก",
            "kind": "flag"
          },
          {
            "sub": "กรมประมง (Department of Fisheries)",
            "body": [
              {
                "bullets": [
                  "**เป็น Competent Authority ทางด้านสุขอนามัยสัตว์น้ำของไทย**",
                  "ให้การรับรองด้านสุขอนามัยสัตว์น้ำ และออกใบรับรองสุขภาพสัตว์น้ำเพื่อการส่งออก",
                  "ขึ้นทะเบียนสถานประกอบการสัตว์น้ำและคอมพาร์ตเมนต์สัตว์น้ำ",
                  "วินิจฉัยและเฝ้าระวังโรคในสัตว์น้ำ",
                  "ส่งเสริมการผลิตและจำหน่ายสัตว์น้ำ และตรวจสอบมาตรฐานบังคับของฟาร์มลูกกุ้งขาวแวนนาไม",
                  "**ไม่ใช่ผู้กำหนดมาตรฐานการเลี้ยงสัตว์น้ำหรือมาตรฐานการชันสูตรโรค ซึ่งเป็นงานของ มกอช.**"
                ]
              }
            ]
          },
          {
            "sub": "กรมปศุสัตว์ (Department of Livestock Development)",
            "body": [
              {
                "bullets": [
                  "**เป็น Veterinary Authority ของประเทศไทย และเป็น Permanent Delegate ของไทยใน WOAH**",
                  "รับผิดชอบ พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558 ซึ่งครอบคลุมโรคในสัตว์น้ำด้วย",
                  "**เป็นผู้จัดทำข้อมูลและขอการรับรองสถานะปลอดโรคจาก WOAH รวมถึงรายงานสถานการณ์โรคเข้าระบบ WAHIS**",
                  "ควบคุมดูแลคุณภาพอาหารสัตว์น้ำและอาหารสัตว์ที่ผสมยา (medicated feed)"
                ]
              }
            ]
          },
          {
            "sub": "สำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช. หรือ ACFS)",
            "body": [
              {
                "bullets": [
                  "**เป็น Focal point ด้านการกำหนดมาตรฐานสินค้าเกษตรและอาหารของไทย**",
                  "กำหนดมาตรฐานการเลี้ยงสัตว์น้ำ ผลิตภัณฑ์สัตว์น้ำ การชันสูตรโรคสัตว์น้ำ และมาตรฐาน GAP",
                  "**ออกเครื่องหมายรับรอง Q mark ให้ฟาร์มที่ผ่านมาตรฐาน**",
                  "ร่วมกำหนดมาตรฐานกับองค์กรมาตรฐานระหว่างประเทศ ได้แก่ CODEX, WOAH และ IPPC",
                  "**ไม่ใช่หน่วยงานหลักในการเฝ้าระวังโรคระบาดในสัตว์น้ำ และไม่ออกใบอนุญาตนำเข้าสัตว์น้ำ**",
                  "แอปพลิเคชันของ มกอช. ชื่อ TAS2GO"
                ]
              }
            ]
          },
          {
            "sub": "ระดับกระทรวง",
            "body": [
              {
                "bullets": [
                  "**กระทรวงเกษตรและสหกรณ์ดูแลความปลอดภัยและคุณภาพในขั้นตอนการผลิตขั้นต้น และดูแลด้านการส่งออกเป็นหลัก**",
                  "**กระทรวงสาธารณสุขดูแลตลาดในประเทศ ผู้ให้บริการด้านอาหาร การคุ้มครองผู้บริโภค และการนำเข้า** โดย อย. อยู่ภายใต้กระทรวงสาธารณสุข"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "WOAH และการกำหนดมาตรฐาน",
        "source": "Aquamed final (Vet 85) น.20-23 (คลังข้อสอบเก่า)",
        "body": [
          {
            "bullets": [
              "**ชื่อเดิมคือ OIE ก่อตั้ง พ.ศ. 2467 เนื่องจากการระบาดของ rinderpest ในทวีปยุโรป โดยกลุ่มอาชีพสัตวแพทย์** และไทยเป็นหนึ่งใน 28 ประเทศผู้ก่อตั้ง",
              "**เป็นผู้ออก Aquatic Animal Health Code และ Aquatic Manual**",
              "**WAHIS (World Animal Health Information System) เป็นระบบรายงานข้อมูลโรคสัตว์แบบ real-time ของประเทศสมาชิก เพื่อเฝ้าระวังและควบคุมโรค**",
              "**WOAH ไม่มีหน้าที่ประกาศเขตปลอดโรคเอง** ประเทศสมาชิกเป็นผู้ยื่นขอรับรอง และ WOAH ไม่ได้จัดหาเงินทุนหรืออุดหนุนการซื้อวัคซีนให้ประเทศสมาชิก",
              "**Specialist Commission ที่ดูแลมาตรฐานด้านสัตว์น้ำโดยตรงมีเพียงชุดเดียว คือ Aquatic Animal Health Commission**"
            ]
          },
          {
            "sub": "ลำดับขั้นตอนการกำหนดมาตรฐาน (Standard setting process)",
            "body": [
              {
                "bullets": [
                  "ประเทศสมาชิกเสนอเรื่องเข้าไปในเวทีระดับนานาชาติ",
                  "Specialist Commissions ประชุมร่วมกันเพื่อดูว่าสามารถกำหนดมาตรฐานได้หรือไม่",
                  "คณะผู้เชี่ยวชาญระดับโลกจัดทำร่างเอกสาร",
                  "**ส่งร่างให้ประเทศสมาชิกตรวจและแก้ไข (Delegates comment) อย่างน้อย 2 รอบ**",
                  "เสนอในที่ประชุม general session ของ World Assembly of Delegates เพื่อรับรองมาตรฐาน",
                  "ประกาศเป็น WOAH International Standards"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้าง Aquatic Code และ Aquatic Manual",
            "body": [
              {
                "bullets": [
                  "**Section 4 ของ Aquatic Code คือการป้องกันและควบคุมโรค ครอบคลุมการฆ่าเชื้อและมาตรการด้านสุขอนามัย การจัดตั้งโซนและคอมพาร์ตเมนต์ การพักบ่อและหยุดพักการเลี้ยง และการทำลายของเสียจากสัตว์น้ำ**",
                  "การวิเคราะห์ความเสี่ยงในการนำเข้าอยู่คนละ section (สรุประบุว่าอยู่ Section 2)",
                  "**การใช้ยาต้านจุลชีพอย่างมีความรับผิดชอบและสมเหตุสมผลอยู่ใน Aquatic Code ไม่ใช่ Aquatic Manual** โดยลายมือแก้ไว้ว่าอยู่ Section 6",
                  "**Aquatic Manual ครอบคลุม การเก็บและนำส่งตัวอย่างเพื่อตรวจวินิจฉัยและชันสูตรโรค คุณภาพของห้องปฏิบัติการ และการตรวจสอบความใช้ได้ของวิธีทดสอบ**"
                ]
              }
            ]
          },
          {
            "sub": "บัญชีรายชื่อโรคสัตว์น้ำของ WOAH",
            "body": [
              {
                "text": "ภาพสไลด์ที่แนบในสรุป (อ้าง Aquatic Code ปี 2024) ระบุจำนวนโรคเป็น **fish 11 โรค, mollusc 7 โรค, crustacean 10 โรค และ amphibian 3 โรค**"
              },
              {
                "callout": "บัญชีรายชื่อโรคของ WOAH มีการทบทวนและปรับทุกปี ตัวเลขชุดนี้เป็นของฉบับปี 2024 ที่ปรากฏในเอกสารรุ่นพี่ อย่าท่องเป็นตัวเลขตายตัวโดยไม่เช็คปีล่าสุดที่อาจารย์ใช้",
                "kind": "warn"
              },
              {
                "text": "**นิยาม aquatic animal ของ WOAH ครอบคลุมปลา หอย สัตว์น้ำมีเปลือก และสัตว์สะเทินน้ำสะเทินบก แต่ไม่ครอบคลุมสัตว์ทะเลเลี้ยงลูกด้วยนม เช่น โลมา**"
              }
            ]
          }
        ]
      },
      {
        "heading": "WTO SPS และองค์กรมาตรฐานระหว่างประเทศ",
        "source": "Aquamed final (Vet 85) น.20-23 (คลังข้อสอบเก่า)",
        "body": [
          {
            "bullets": [
              "**SPS Agreement อยู่ภายใต้ WTO** มีวัตถุประสงค์เพื่อคุ้มครองชีวิตและสุขภาพของมนุษย์ สัตว์ และพืชจากโรคและศัตรูพืช ไม่ใช่เพื่อกีดกันทางการค้า",
              "**มาตรการ SPS ต้องตั้งอยู่บนพื้นฐานข้อมูลทางวิทยาศาสตร์ และต้องอ้างอิงมาตรฐานสากล**",
              "**องค์กรมาตรฐานระหว่างประเทศที่ WTO ยอมรับ เรียกว่า three sisters ได้แก่ CODEX Alimentarius Commission, WOAH และ IPPC**"
            ]
          }
        ]
      },
      {
        "heading": "องค์กรระดับภูมิภาค",
        "source": "Aquamed final (Vet 85) น.20-23 (คลังข้อสอบเก่า)",
        "body": [
          {
            "bullets": [
              "**NACA (Network of Aquaculture Centres in Asia-Pacific)** มีสำนักงานอยู่ที่ประเทศไทย ส่งเสริมการเพาะเลี้ยงสัตว์น้ำอย่างยั่งยืน ยกระดับความมั่นคงทางอาหารและลดความยากจนในชุมชนชนบท เป็นศูนย์กลางแลกเปลี่ยนข้อมูลและฝึกอบรม และมีบทบาทเฝ้าระวังโรคสัตว์น้ำร่วมกับกรมประมง **แต่ไม่ได้มีหน้าที่ป้องกันควบคุมโรคติดต่อระหว่างสัตว์และมนุษย์**",
              "**SEAFDEC (Southeast Asian Fisheries Development Center)** สำนักงานใหญ่อยู่ที่ประเทศไทย มีประเทศสมาชิกคือ ASEAN และญี่ปุ่น มีหน้าที่หลักด้านการฝึกอบรมวิธีการทำประมง",
              "**ASWGFi (ASEAN Sectoral Working Group on Fisheries)** ส่งเสริมการค้าสัตว์น้ำและผลิตภัณฑ์จากสัตว์น้ำในภูมิภาค และสนับสนุนการใช้เทคโนโลยีที่ยั่งยืน",
              "**ASA (ASEAN Shrimp Alliance)** เป็นเวทีร่วมระหว่างภาครัฐและเอกชน เพื่อปรับประสานมาตรฐานและการรับรองด้านการผลิตกุ้ง",
              "**ARASFF (ASEAN Rapid Alert System for Food and Feed)** ระบบแจ้งเตือนเร็วด้านอาหารและอาหารสัตว์ ส่วน ATFC คือ ASEAN task force on CODEX และ AFSN คือ ASEAN Food safety network"
            ]
          },
          {
            "callout": "คลังข้อสอบระบุว่าติมอร์-เลสเตเข้าเป็นสมาชิกอาเซียนลำดับที่ 11 (อัปเดตเดือนตุลาคม พ.ศ. 2568) ข้อมูลจำนวนสมาชิกเป็นข้อมูลที่เปลี่ยนตามเวลา ให้เช็คความเป็นปัจจุบันก่อนใช้ตอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "กฎหมายและมาตรฐานบังคับของไทย",
        "source": "Aquamed final (Vet 85) น.20-23 (คลังข้อสอบเก่า)",
        "body": [
          {
            "bullets": [
              "**นิยามสัตว์น้ำตาม พ.ร.ก.การประมง พ.ศ. 2558 ครอบคลุมสัตว์ที่อาศัยอยู่ในน้ำเป็นปกติ สัตว์สะเทินน้ำสะเทินบก สัตว์ที่มีวงจรชีวิตช่วงหนึ่งอาศัยอยู่ในน้ำ สัตว์ที่อาศัยในบริเวณที่น้ำท่วมถึง รวมถึงไข่และน้ำเชื้อของสัตว์น้ำ และพืชน้ำบางกลุ่ม แต่ไม่ครอบคลุมแบคทีเรียที่อาศัยอยู่ในน้ำ**",
              "**พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558 (ฉบับที่ 4) ระบุโรคระบาดในสัตว์น้ำไว้ เช่น โรคหัวเหลืองในกุ้ง โรคจุดขาวในกุ้ง และ Tilapia Lake Virus**",
              "**มกษ.7432-2558 คือมาตรฐานบังคับ ว่าด้วยการปฏิบัติทางการเพาะเลี้ยงสัตว์น้ำที่ดี สำหรับฟาร์มผลิตลูกกุ้งขาวแวนนาไมปลอดโรค** กำหนดว่าพ่อแม่พันธุ์ต้องปลอดจากโรคที่กำหนด ตรวจสอบแหล่งที่มาได้ และมีระบบกักกันโรค รวมถึงต้องมีบันทึกข้อมูลการผลิตเก็บให้ตรวจสอบได้ 2 ปี",
              "ลายมือข้างข้อสอบระบุโรคที่กำหนดไว้ในมาตรฐานนี้ 6 โรค ได้แก่ **โรคจุดขาว โรคหัวเหลือง โรคทอราซินโดรม โรค IHHNV โรค IMNV และโรคตายด่วน**",
              "**GAP ย่อมาจาก Good Aquaculture Practice**"
            ]
          },
          {
            "callout": "เรื่องกฎหมายที่ควบคุมการนำเข้าและส่งออกสัตว์น้ำ คลังข้อสอบให้คำตอบไม่ตรงกันถึงสามแบบระหว่างข้อ (บางข้อตอบว่า พ.ร.บ.ควบคุมคุณภาพอาหารสัตว์ ไม่ใช่ บางข้อตอบว่า พ.ร.ก.การประมง ไม่ใช่ และของรุ่น 84 ตอบว่า พ.ร.บ.ยา ไม่ใช่) ประเด็นนี้ยังสรุปไม่ได้จากเอกสาร ให้ถามอาจารย์หรือดูเอกสารประกอบการเรียนของปีนี้",
            "kind": "warn"
          },
          {
            "callout": "อีกจุดที่ขัดกัน คือคำถามว่าหน่วยงานใดเป็นผู้รายงานข้อมูลโรคระบาดสัตว์น้ำ ฉบับรุ่น 84 เฉลยว่ากรมประมง (และผู้รวบรวมทำเครื่องหมายสงสัยไว้เอง) ขณะที่ฉบับรุ่น 85 ชี้ว่าการรายงานเข้า WAHIS เป็นบทบาทของกรมปศุสัตว์ในฐานะ Veterinary Authority ให้ยึดคำบรรยายปีนี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "บทบาทสัตวแพทย์เทียบกับผู้เชี่ยวชาญด้านสุขภาพสัตว์น้ำ",
        "source": "Aquamed final (Vet 85) น.20-22 (คลังข้อสอบเก่า)",
        "body": [
          {
            "bullets": [
              "ทั้งสองกลุ่มทำได้ทั้ง การตรวจวินิจฉัย การควบคุมป้องกันโรค การรักษาโรคในสัตว์น้ำ การดูแลคุณภาพน้ำ การจัดการน้ำใช้และน้ำทิ้ง และการดูแลด้านอาหารสัตว์",
              "**สิ่งที่ต่างกันคือการสั่งใช้ยา ซึ่งเป็นหน้าที่ของสัตวแพทย์เท่านั้น**",
              "การรับรองกฎหมายด้านการควบคุมคุณภาพสินค้าเกษตรไม่ใช่หน้าที่ของทั้งสองกลุ่ม",
              "การทำงานด้านสัตว์น้ำต้องอาศัย partner หลายสาขา ทั้งประมง วิทยาศาสตร์ทางทะเล และสัตวบาล"
            ]
          }
        ]
      }
    ]
  }
};
