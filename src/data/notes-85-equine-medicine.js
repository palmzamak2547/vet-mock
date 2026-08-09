// ============================================================
// เวชปฏิบัติม้า + ศัลย์ — สรุปจากรุ่นพี่ Vet 85
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

export const NOTES_85_EQUINE_MEDICINE = {
  "equine-intro": {
    "topic": "equine-intro",
    "title": "การระบุตัวม้า การจับบังคับ และการตรวจร่างกาย",
    "icon": "📘",
    "summary": "รวมเนื้อหาช่วงต้นของเด็ค ตั้งแต่ equine passport สีขน white marking และขวัญ การฝังไมโครชิพ อุปกรณ์ม้าและบังเหียน พฤติกรรมและการมองเห็น การจับบังคับทั้ง physical และ chemical restraint เทคนิคการให้ยา การสอดท่อกระเพาะ ไปจนถึง problem oriented approach และค่า vital signs ปกติ",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "สมุดประจำตัวม้า (Equine passport)",
        "source": "Equine Med 85 น.3",
        "body": [
          {
            "text": "Equine passport **ออกโดยสัตวแพทย์เท่านั้น** เนื้อหาประกอบด้วย diagram ลักษณะม้า การฝังไมโครชิพ ข้อมูลเจ้าของ ประวัติวัคซีน การตรวจโรค การแข่งขัน และผลตรวจสารกระตุ้น"
          },
          {
            "bullets": [
              "**Near side = ด้านซ้ายของม้า** เป็นฝั่งที่ผู้ขี่ขึ้นม้า",
              "**Far side = ด้านขวาของม้า**",
              "Languages ที่ใช้ในสมุด Eng หรือ French",
              "Gender/sex ระบุเป็น stallion, mare หรือ gelding",
              "Color ระบุสีขน",
              "Year of birth ถ้าไม่ทราบปีเกิด **ให้ประมาณจากฟันแล้วกำกับว่า estimated by dental**",
              "Height (cm) วัดจากพื้นถึง **highest point of wither** ใช้ไม้วัดเฉพาะของม้า"
            ]
          }
        ]
      },
      {
        "heading": "สีขนม้า (Coat colours)",
        "source": "Equine Med 85 น.3",
        "body": [
          {
            "bullets": [
              "**Bay** ตัวสีน้ำตาล แผงคอ ขา และหางเป็นสีดำ",
              "**Brown** ตัวและแผงคอออกน้ำตาล ขาดำ แต่หางไม่ดำล้วน",
              "**Chestnut** น้ำตาลอมเหลือง ถ้าโดนแดดแผงคออาจออกโทนทอง",
              "**Palomino** ต่างจาก chestnut ตรงที่ตัวออกทองมากกว่า และ **แผงคอกับหางเป็นสีขาว**",
              "**Grey** ขนขาวแต่หนังสีชมพู มีแบบ dapple (จุดดวง) และ flea bitten (จุดกระสีน้ำตาล)",
              "**White** ขนขาวและหนังขาว ในไทยพบน้อย",
              "**Albino** คล้าย white แต่ต่างที่ตา มีทั้งตาแดงและตาฟ้า",
              "**Black** ดำทั้งขนและหนัง อาจมี white marking บางจุด",
              "**Cremello** สีครีม ตาสีฟ้า ไม่ค่อยพบในไทย",
              "**Dun (Buckskin)** มี **เส้นสีดำพาดกลางหลัง + leg barring** เจอบ่อยในไทย",
              "**Skewbald** สีขาวปนสีอะไรก็ได้ **ยกเว้นสีดำ**",
              "**Piebald** สีขาวปนดำ",
              "**Appaloosa** มีรอยด่างขาวเป็นจุดกระจาย ระวังสับสนกับ grey",
              "**Roan** ขนสีหนึ่งมีขนอีกสีแซมขึ้นมา เช่น red roan, blue roan"
            ]
          },
          {
            "callout": "เด็คมีตารางรูป EQUINE COAT COLOURS แยกกลุ่ม DUNS / BASIC / BRIGHT / PATTERNS / GREYS / CHAMPAGNE / ROANS ควรเปิดดูภาพจริงประกอบ เพราะข้อสอบที่รุ่นพี่บันทึกไว้เป็นแบบให้ดูรูปแล้วเลือกสี",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "White markings ขวัญ และวิธีลงบันทึกในสมุด",
        "source": "Equine Med 85 น.3",
        "body": [
          {
            "text": "White marks แบ่งเป็น **3 จุดคือ หัว ขา ตัว**"
          },
          {
            "sub": "ที่หัว",
            "body": [
              {
                "bullets": [
                  "Faint, Star, Stripe, Broken Stripe, Blaze, Snip, Blaze & Snip, Star & Stripe, Bald Face"
                ]
              }
            ]
          },
          {
            "sub": "ที่ขา",
            "body": [
              {
                "bullets": [
                  "Heel, White Heel, Coronet, Half Pastern, Pastern, Fetlock, Half Cannon, Cannon",
                  "**Ermine** ส่วนมากเจอในม้า Appaloosa"
                ]
              }
            ]
          },
          {
            "sub": "ขวัญ (Whorls)",
            "body": [
              {
                "bullets": [
                  "แบ่งเป็น single whorl, double whorl, multiple whorls",
                  "**ส่วนมากขวัญจะหมุนตามเข็มนาฬิกา**",
                  "ตำแหน่งบนคอเรียงจากบนลงล่าง คือ Poll whorl, High crest, Mid crest, Low crest"
                ]
              }
            ]
          },
          {
            "sub": "การลงบันทึกในสมุด",
            "body": [
              {
                "bullets": [
                  "**ลายสีขาวบนตัวใช้ปากกาแดง**",
                  "**ปากกาดำใช้กับ** ขวัญ (วาดเป็นเครื่องหมาย X ถ้าเป็น feather ให้ลากเส้นตรงลงมาจาก X ตามความยาว), spots & marks, แผลเป็น (ใช้ลูกศรชี้), brand mark, prophet thumb mark และ zebra marks",
                  "รอยตีตราแบบ brand mark จะทำให้ขนบริเวณนั้นขึ้นเป็นสีขาว"
                ]
              }
            ]
          },
          {
            "callout": "การกรอกสมุดต้องระวังมาก ห้ามกรอกผิดและห้ามลบขีดฆ่า เป็นจุดที่รุ่นพี่บันทึกว่าถูกถามในข้อสอบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การฝังไมโครชิพ และวัคซีนม้าในไทย",
        "source": "Equine Med 85 น.4",
        "body": [
          {
            "sub": "Microchip implantation",
            "body": [
              {
                "bullets": [
                  "ต้องโกนขนและใช้ sterile technique สครับก่อนฝัง",
                  "**ฝังที่ nuchal ligament ด้านซ้ายของคอ กึ่งกลางระหว่าง poll กับ wither**",
                  "ปักตั้งฉากกับ ligament แล้วดันให้ลึก",
                  "**ยืนยันด้วย microchip reader ทุกครั้งว่าฝังเข้าจริง**"
                ]
              }
            ]
          },
          {
            "sub": "Vaccination program ในประเทศไทย",
            "body": [
              {
                "bullets": [
                  "**Tetanus**",
                  "**Influenza**",
                  "**Rabies**",
                  "**Japanese encephalitis**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อุปกรณ์ม้า (Tack) และส่วนประกอบของบังเหียน",
        "source": "Equine Med 85 น.4",
        "body": [
          {
            "sub": "อุปกรณ์ทั่วไป",
            "body": [
              {
                "bullets": [
                  "Ear net = ตาข่ายคลุมหูม้า",
                  "**Bridle = บังเหียน** ใช้บังคับทิศทางตอนขี่",
                  "Saddle = อานม้า / Half pad = เบาะรองอานแบบบาง / Saddle pad = ผ้ารองอาน",
                  "**Halter = ขลุมม้า** ใช้จับ จูง ผูก",
                  "Martingale = สายรั้งกันม้าเงยหัว",
                  "Breastplate = สายรัดอก",
                  "Boots = ที่รัดป้องกันขาม้า",
                  "**Lead = เชือกจูง ยาวไม่เกิน 2 เมตร**",
                  "**Lunge = เชือกฝึก ยาวประมาณ 15 เมตร**",
                  "Whip = แส้ / Horseshoes = เกือกม้า"
                ]
              }
            ]
          },
          {
            "sub": "ส่วนประกอบหลักของบังเหียน (Bridle)",
            "body": [
              {
                "bullets": [
                  "**Headstall (สายคล้องหัว)** สายรัดหลักที่ครอบหัวม้า ยึดบิทให้อยู่ในปากม้า",
                  "**Browband (สายรัดหน้าผาก)** พาดข้ามหน้าผาก ป้องกันบังเหียนเลื่อนถอยหลัง",
                  "**Throatlatch (สายรัดคอ)** รัดใต้คอ ป้องกันบังเหียนหลุดหรือเลื่อนมาด้านหน้า",
                  "**Noseband / Caveson (สายรัดจมูก)** ควบคุมการอ้าปาก ช่วยให้บิททำงานเหมาะสม",
                  "**Reins (สายบังคับ)** ต่อกับบิท ผู้ขี่ใช้สื่อสารและควบคุมม้า"
                ]
              }
            ]
          },
          {
            "sub": "ชนิดของบิท",
            "body": [
              {
                "bullets": [
                  "**Snaffle bit** ออกแรงกดแบบ **direct pressure** เป็นชนิดที่ใช้ทั่วไป",
                  "**Curb bit** อาศัยหลัก **leverage** กดที่ bars of the mouth ลิ้น คาง และ poll ให้แรงและละเอียดกว่า",
                  "**Bitless bridle** ไม่มีบิทในปาก อาศัยแรงกดบริเวณดั้งจมูกและคาง เหมาะกับม้าที่มีปัญหาในช่องปากหรือผู้ขี่ที่ต้องการวิธีอ่อนโยนกว่า"
                ]
              },
              {
                "callout": "คำอธิบายบิทในเด็คเขียนด้วยลายมือและอ่านได้ไม่ครบทุกบรรทัด ส่วนที่คลุมเครือจึงไม่ถูกนำมาสรุปไว้ที่นี่",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "พฤติกรรมและการมองเห็นของม้า",
        "source": "Equine Med 85 น.4-5",
        "body": [
          {
            "bullets": [
              "ม้าในไทยไม่ได้จัดเป็นปศุสัตว์ เลี้ยงเป็นสัตว์เลี้ยงและเพื่อการกีฬามากกว่า",
              "ม้าสื่อสารผ่านสีหน้า สายตา และการเคลื่อนไหวของ **หู ตา ปาก หาง ท่าทาง เสียง**",
              "ม้าเป็น **ผู้ถูกล่า** ชอบอยู่เป็นฝูง และมักตามตัวเมียจ่าฝูง (**Alpha mare**)",
              "ตัวผู้ = Stallion, ตัวเมีย = Mare, **ตัวผู้ที่ทำหมันแล้ว = Gelding ซึ่งอยู่ลำดับต่ำสุดในฝูง**",
              "สัญชาตญาณคือ **flight or fight** แต่บางตัวจะ freeze แทน",
              "ตาม้ามองความลึกได้ไม่ดีเท่าตาคน",
              "อายุขัย 25-30 ปี (Foal 0-6 เดือน, Weaning 6 เดือนถึง 1 ปี, Yearling 1-2 ปี)",
              "**คอกม้าเล็กสุด 3x3 เมตร ถ้าเป็น stallion ใช้ 4x4 เมตร**",
              "ในธรรมชาติม้ากินก้มพื้นทำให้ฟันสบกันเอง แต่ในคอกต้องยกรางอาหารสูงขึ้นเพื่อไม่ให้หก",
              "Grooming เป็นการสร้างความสัมพันธ์ การทำความสะอาดกีบก็สำคัญ",
              "**Sleeping อย่างน้อย 3 ชั่วโมงต่อวัน** บางตัวยืนหลับ"
            ]
          },
          {
            "sub": "Equine vision",
            "body": [
              {
                "bullets": [
                  "**Wide-spaced eyes** มี peripheral และ monofocal vision",
                  "**Binocular vision อยู่ด้านหน้า**",
                  "**Blind spots อยู่ 2 จุด คือ ด้านหน้าใต้จมูก และด้านหลังตรงๆ** ต้องหลีกเลี่ยงการเข้าหาจากสองจุดนี้"
                ]
              }
            ]
          },
          {
            "sub": "Horse attack ที่ต้องระวัง",
            "body": [
              {
                "bullets": [
                  "Biting",
                  "Kicking (ขาหลัง)",
                  "Striking (ขาหน้า)",
                  "Rearing and falling",
                  "Trampling",
                  "Charging or pushing"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การจับบังคับทางกายภาพ (Physical restraint)",
        "source": "Equine Med 85 น.5",
        "body": [
          {
            "bullets": [
              "เวลายืน **ให้เอาด้านข้างของเราเข้าประชิดตัวม้า**",
              "ให้มือหรือลำตัวสัมผัสตัวม้าตลอดเวลา โดยเฉพาะเวลาทำหัตถการที่ต้องใช้สองมือ",
              "เป้าหมายคือให้ม้าสงบ ห้ามให้บาดเจ็บทั้งคนและม้า มี 2 วิธีคือ **physical และ chemical**"
            ]
          },
          {
            "sub": "Halter & lead rope",
            "body": [
              {
                "bullets": [
                  "เป็นพื้นฐานของการจับบังคับม้า ควรฝึกให้ใส่ตั้งแต่แรกเกิด",
                  "**ควรเข้าหาม้าจากด้านซ้าย (left side)**",
                  "**ห้ามผูกเงื่อนตาย** ต้องผูกให้กระตุกแก้ได้ง่ายและเร็วที่สุด ถ้าม้าตกใจแล้วแก้ไม่ทันจะอันตราย",
                  "**ไม่ผูกเชือกกับเสาโดยตรง** ควรมีเชือกเซฟตี้ล็อกอีกชั้น"
                ]
              }
            ]
          },
          {
            "sub": "Horse stock (ซอง)",
            "body": [
              {
                "bullets": [
                  "ใช้ทำ PE และตรวจระบบสืบพันธุ์ ม้าจะเตะได้ยาก แต่ **ยังกระโดดได้ ต้องระวัง**",
                  "ซองที่ดีควรเปิดได้ทุกด้าน ทั้งซ้าย ขวา หน้า หลัง",
                  "ซองแม่ลูกควรแยกให้แม่กับลูกยังเห็นกัน แม่จะสบายใจและลูกจะตามแม่"
                ]
              }
            ]
          },
          {
            "sub": "Twitches และวิธีที่ใช้ไม่บ่อย",
            "body": [
              {
                "bullets": [
                  "Twitch ทำที่ **ผิวหนัง (skin) หรือจมูก (nose)** ใช้มือบิดหรือใช้เครื่องมือช่วย",
                  "วิธีที่ใช้ไม่บ่อยและมักใช้กับม้าที่ดื้อมาก ได้แก่ anti-rear bit หรือ Chiffney bit, chain shank, hobble, wooden twitch with chain และ ear twitch"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การจับบังคับด้วยยา (Chemical restraint)",
        "source": "Equine Med 85 น.6",
        "body": [
          {
            "text": "ใช้ตอนทำฟัน ตอนที่บังคับด้วยวิธีปกติไม่ได้ หรือตอนขนส่งม้า"
          },
          {
            "sub": "Routes of administration",
            "body": [
              {
                "bullets": [
                  "**IV** rapid onset, predictable",
                  "**IM** slower onset ใช้เมื่อเข้าหลอดเลือดดำได้ยาก",
                  "**Oral/mucosal** ใช้จำกัด เช่น detomidine gel สำหรับ standing sedation"
                ]
              }
            ]
          },
          {
            "sub": "Phenothiazines: Acepromazine",
            "body": [
              {
                "bullets": [
                  "ให้ **sedation โดยไม่ทำให้เกิด ataxia ที่ชัดเจน**",
                  "**ต้องระวัง persistent penile prolapse หรือ paralysis ถ้าใช้ dose สูงเกิน**",
                  "Dose 0.04-0.08 mg/kg IV หรือ IM",
                  "ออกฤทธิ์ดีประมาณ 20-30 นาที"
                ]
              }
            ]
          },
          {
            "sub": "Alpha-2 agonists",
            "body": [
              {
                "text": "**ม้าไวต่อยากลุ่มนี้มาก** ให้ทั้ง sedation, muscle relaxation, ataxia (กด CNS) และ analgesia และแรงกว่ากลุ่ม phenothiazines"
              },
              {
                "bullets": [
                  "**Xylazine** เป็นตัวที่ราคาถูกที่สุดในกลุ่มและนิยมใช้ตอนทำฟัน onset 1-2 นาที duration 15-30 นาที ให้ทาง IV **maximum dose 1.1 mg/kg**",
                  "**Detomidine** แรงกว่า xylazine ประมาณ **100 เท่า** และแพงกว่า เวลาม้าล้มจะ smooth กว่า ให้ได้ทาง IV, IM และแบบเจลอมใต้ลิ้น onset 5 นาที duration 30-45 นาที **dose 0.01-0.02 mg/kg**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เทคนิคการให้ยา IV IM PO และ SC",
        "source": "Equine Med 85 น.6-7",
        "body": [
          {
            "sub": "IV (jugular vein เป็นตำแหน่งที่ใช้บ่อยที่สุด)",
            "body": [
              {
                "bullets": [
                  "**เช็ดตามแนวขน ห้ามทวนขน** ซึ่งต่างจากสุนัข",
                  "กด jugular groove แล้วจะเห็นหลอดเลือดโป่งขึ้น",
                  "**ระวัง common carotid artery และ vagosympathetic nerve trunk ที่ทอดขนานกับหลอดเลือดดำ**",
                  "แทงที่ตำแหน่งค่อนไปทางส่วนบนของคอ ประมาณ 1 ใน 3 ส่วนบน",
                  "**ถ้าฉีดยาซึมพลาดเข้า artery ยาจะขึ้นสมองและทำให้ม้าช็อกได้ทันที**",
                  "หลอดเลือดดำอยู่ใต้ผิวหนังไม่เกิน 2 มม. จึงไม่ต้องนอนเข็มมาก"
                ]
              }
            ]
          },
          {
            "sub": "IM",
            "body": [
              {
                "bullets": [
                  "ปักเข็มเบาๆ ตรงๆ ลึก **ตั้งฉากกับกล้ามเนื้อ และอย่าลืม draw back ทุกครั้ง**",
                  "ตำแหน่งที่ใช้ ได้แก่ **brachiocephalicus ที่คอ (นิยมที่สุด)**, pectoral (ปริมาตรน้อย), gluteal (รับปริมาตรได้มาก), hamstring (ไม่ค่อยใช้)",
                  "เข็มเบอร์ 18-22 ถ้ายาหนืดใช้เบอร์ 18 ถ้าปริมาตรน้อยใช้เบอร์ 26 ได้ ความยาว 1.5 นิ้ว",
                  "**Max volume per site = 15 ml**"
                ]
              }
            ]
          },
          {
            "sub": "PO",
            "body": [
              {
                "bullets": [
                  "รูปแบบยา paste, powder, tablet, liquid",
                  "ใช้ dosing syringe หรือป้อนด้วยมือ",
                  "**สอดกระบอกยาเข้าที่ diastema ซึ่งเป็นช่องว่างระหว่างฟันหน้ากับฟันกราม**",
                  "Feed additive ต้องบดผสมอาหารให้ทั่ว"
                ]
              }
            ]
          },
          {
            "sub": "SC และ topical",
            "body": [
              {
                "bullets": [
                  "SC ปกติไม่ค่อยใช้ ตัวที่ใช้ทางนี้คือ **วัคซีน Japanese encephalitis**",
                  "Transdermal/topical ใช้กับม้าที่มีแผล และสเปรย์กันแมลง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Stomach tubing (nasogastric)",
        "source": "Equine Med 85 น.7",
        "body": [
          {
            "sub": "Indications",
            "body": [
              {
                "bullets": [
                  "ให้สารน้ำหรือยา",
                  "**Choke relief** ดันหญ้าที่ติดคอลงไป",
                  "ใช้ diagnose และ treat colic"
                ]
              }
            ]
          },
          {
            "sub": "Complications",
            "body": [
              {
                "bullets": [
                  "**Epistaxis** เลือดกำเดาไหล",
                  "**Aspiration pneumonia** ถ้ามีน้ำค้างที่ปลายท่อแล้วไหลลงปอดตอนดึงท่อขึ้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Problem Oriented Approach และการซักประวัติ",
        "source": "Equine Med 85 น.7",
        "body": [
          {
            "text": "ลำดับของ problem oriented approach คือ **client complain → history taking → physical examination → initial problem list → initial assessment → diagnosis plan → revise problem list and assessment → final/definitive diagnosis → treatment plan**"
          },
          {
            "sub": "History taking",
            "body": [
              {
                "bullets": [
                  "**Signalment** อายุ พันธุ์ เป็นลูกม้าหรือไม่ เพศ",
                  "**Past history** ดูภาวะปัจจุบันก่อนแล้วย้อนไปหา onset",
                  "**Present condition** ดู progression",
                  "**Working** ม้าตัวนี้ถูกใช้ทำอะไร"
                ]
              }
            ]
          },
          {
            "sub": "ชนิดของงานกับรอยโรคที่มักพบ",
            "body": [
              {
                "bullets": [
                  "**Show jumping** กระโดดข้ามเครื่องกีดขวาง มัก lesion ที่ **ขาหน้า navicular bone และเอ็นต่างๆ** ถ้าใช้งานหนักและเครียดจนเกินไปก็เกิด **gastric ulcer** ได้",
                  "**Dressage** บังคับให้เคลื่อนไหวอย่างมีลีลา มัก **มีปัญหาที่ขาหลัง**",
                  "**Reining** บังคับให้ปฏิบัติตามคำสั่ง เช่น sliding stop, spin"
                ]
              }
            ]
          },
          {
            "sub": "ประเภทของการตรวจร่างกาย",
            "body": [
              {
                "bullets": [
                  "General wellness exam",
                  "Insurance exam และ health certification",
                  "**Pre-purchase exam** สำคัญมาก ต้องตรวจละเอียดก่อนซื้อขาย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Normal vital signs และลำดับการตรวจร่างกาย",
        "source": "Equine Med 85 น.7",
        "body": [
          {
            "bullets": [
              "**Temperature 99.5-101.5 F**",
              "**HR 28-44 bpm** อาจขึ้นถึง 50-55 ถ้าม้าเครียด",
              "**RR 12-16 ครั้ง/นาที** ให้ดูที่สีข้างของม้า ไม่ใช่ที่รูจมูก และเสียงปอดปกติควรเงียบ",
              "Mucous membrane สีชมพู **CRT < 2 วินาที**",
              "Attitude/appetite ดูความอยากอาหารลดลง ซึม ไม่สนใจสิ่งรอบตัว",
              "**Gut sound: short sound 3-4 ครั้ง/5 นาที และ long sound 1-2 ครั้ง/5 นาที**"
            ]
          },
          {
            "callout": "ค่า HR และ RR ในหน้านี้ (HR 28-44, RR 12-16) ไม่ตรงกับค่าที่เด็คเขียนไว้ในบทเรื่อง colic (HR 30-45, RR 12-36) และจำนวน short sound ก็ต่างกันด้วย (3-4 ครั้ง/5 นาทีในหน้านี้ กับ 5 ครั้ง/5 นาทีในหน้ากายวิภาค GI) ให้ยึดค่าที่เลกเชอร์ปีนี้ให้เป็นหลัก",
            "kind": "warn"
          },
          {
            "sub": "ลำดับการตรวจ เริ่มจากระยะไกลก่อน",
            "body": [
              {
                "bullets": [
                  "ดูหัวและจมูก จากนั้นดู CRT, mucous membrane แล้วคลำ facial pulse ต่อด้วยต่อมน้ำเหลือง (ปกติมักคลำไม่ค่อยเจอ)",
                  "ดูขา **ไล่จากล่างขึ้นบน**",
                  "ตรวจอก ฟังเสียงหัวใจ วัด HR ฟังเสียงปอด (ปกติจะเงียบ) และวัด RR",
                  "ตรวจช่องท้อง ซึ่งเป็น shock organ ฟัง gut sound **แบ่งเป็น 4 จุด จุดละ 5 นาที รวม 20 นาที**",
                  "**Short sound** คือเสียงคลุกอาหาร ควรได้ยิน 3-4 ครั้งใน 5 นาที",
                  "**Long sound** คือเสียงบีบไล่อาหาร คล้ายเสียงชักโครก อาจนานถึง 30 วินาที พบ 1-2 ครั้งใน 5 นาที",
                  "ตรวจหลัง ดูความสมมาตร ใช้ปากกากดตรวจได้",
                  "**ตรวจขาหลังเป็นอันดับสุดท้าย**"
                ]
              }
            ]
          },
          {
            "sub": "Body condition scoring",
            "body": [
              {
                "text": "Six areas of focus ได้แก่ crest ที่คอ, withers, along the spine, tailhead, ribs และ behind the elbow ให้ดูไขมันที่พงส์ ซี่โครง และช่วงท้อง"
              }
            ]
          }
        ]
      },
      {
        "heading": "สิ่งที่รุ่นพี่บันทึกไว้ว่าออกสอบ (ข้อมูลจากปีก่อน)",
        "source": "Equine Med 85 น.2, น.3, น.5",
        "body": [
          {
            "callout": "ทั้งหมดในหัวข้อนี้เป็นบันทึกความจำของข้อสอบ **ของรุ่นพี่ Vet 85** ไม่ใช่เนื้อหาวิชา ให้ใช้เป็นแนวว่าอาจารย์เน้นตรงไหน ไม่ใช่คำทำนายข้อสอบปีนี้ และรูปแบบข้อสอบเปลี่ยนได้ทุกปี",
            "kind": "warn"
          },
          {
            "sub": "สัดส่วนข้อสอบตามหัวข้อที่รุ่นพี่บันทึก",
            "body": [
              {
                "bullets": [
                  "Identification 5 ข้อ",
                  "Horse restraint 15 ข้อ",
                  "Nutrition 7 ข้อ",
                  "GI parasite 20 ข้อ",
                  "GI system 44 ข้อ",
                  "Teeth 15 ข้อ"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะข้อที่ถูกบันทึกไว้",
            "body": [
              {
                "bullets": [
                  "**ข้อสอบเป็นภาษาอังกฤษเกือบทั้งหมด** ต้องจำศัพท์อังกฤษ ไม่ใช่จำแต่คำแปลไทย",
                  "ให้สมุดประจำตัวม้ามาแล้วถามอายุ หน่วยงานที่สังกัด และเลขไมโครชิพ โดยห้ามกรอกผิดหรือลบขีดฆ่า",
                  "ให้รูปม้าที่ระบายสีมา แล้วถามว่าสีจริงคือสีอะไร มีตัวเลือกรูปให้",
                  "ให้รูปม้าที่มีลายขาวตรงขาหลัง แล้วให้อธิบายว่าจะเขียนลงสมุดว่าอย่างไร",
                  "ออก 3 ข้อเป็นรูปท่าทางของม้า แล้วถามว่าม้ากำลังแสดงอะไร"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "equine-parasites": {
    "topic": "equine-parasites",
    "title": "ปรสิตในม้า",
    "icon": "📘",
    "summary": "ปรสิตในทางเดินอาหารเรียงตามตำแหน่งที่พบ ตามด้วยพยาธิตัวตืด พยาธิตัวกลมทีละชนิด large และ small strongyles การใช้ EPG ประเมินการดื้อยาและ metabarcoding แล้วปิดท้ายด้วยพยาธิในเลือดและปรสิตภายนอกทั้งเหาและไร",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "แผนที่ตำแหน่งของปรสิตในม้า",
        "source": "Equine Med 85 น.12",
        "body": [
          {
            "sub": "Stomach",
            "body": [
              {
                "bullets": [
                  "**Trichostrongylus axei** (เป็น zoonosis และพบในสัตว์เคี้ยวเอื้องด้วย)",
                  "**Habronema** กลุ่มนี้เจอบ่อยในไทย มี 3 ชนิด"
                ]
              }
            ]
          },
          {
            "sub": "Small intestine",
            "body": [
              {
                "bullets": [
                  "Anoplocephala magna",
                  "Anoplocephala perfoliata",
                  "Parascaris equorum",
                  "Strongyloides westeri"
                ]
              }
            ]
          },
          {
            "sub": "Large intestine",
            "body": [
              {
                "bullets": [
                  "Gastrodiscus secundus",
                  "Anoplocephala perfoliata",
                  "Strongylus equinus, edentatus, vulgaris",
                  "**Cyathostomum spp. (small strongyle)**",
                  "Oxyuris equi"
                ]
              }
            ]
          },
          {
            "sub": "ตำแหน่งนอกทางเดินอาหาร",
            "body": [
              {
                "bullets": [
                  "Liver: Fasciola sp., Echinococcus granulosus",
                  "**Circulation: Strongylus vulgaris ระยะตัวอ่อน**",
                  "Skin: Habronema spp. ระยะตัวอ่อน",
                  "Abdominal cavity: Setaria equina",
                  "**Eyes: Setaria spp. ระยะตัวอ่อน**"
                ]
              }
            ]
          },
          {
            "text": "กลุ่ม round worms ที่เด็คสรุปไว้ ได้แก่ Trichostrongylus, Habronema, Strongyloides westeri, Parascaris equorum, Strongylus, Trichonema, Oxyuris equi และ Setaria spp."
          }
        ]
      },
      {
        "heading": "Tapeworm: Anoplocephala perfoliata",
        "source": "Equine Med 85 น.12",
        "body": [
          {
            "bullets": [
              "อยู่ที่ **ileum และ cecum** ตัวเต็มวัยพบได้ทั้งลำไส้เล็กและลำไส้ใหญ่",
              "**ติดจากการกิน oribatid mite ที่มีระยะ cysticercoid**",
              "**PPP ประมาณ 1-1.5 เดือน**",
              "ความอันตรายต่ำ",
              "**ก่อ ulcer ที่ ileocecal valve → enteritis → colic**",
              "**Dx: fecal floatation**",
              "**Tx: praziquantel 1 mg/kg PO** หรือสอดท่อให้ bithionol 7 mg/kg PO"
            ]
          }
        ]
      },
      {
        "heading": "Trichostrongylus axei",
        "source": "Equine Med 85 น.12",
        "body": [
          {
            "bullets": [
              "**เป็น zoonosis**",
              "**PPP ประมาณ 3 สัปดาห์**",
              "**Dx: fecal floatation**",
              "อยู่ในกระเพาะและพบในสัตว์เคี้ยวเอื้องได้ด้วย"
            ]
          }
        ]
      },
      {
        "heading": "Habronema และ cutaneous habronemosis",
        "source": "Equine Med 85 น.13",
        "body": [
          {
            "bullets": [
              "มี 3 ชนิด ที่เจอบ่อยคือ **Draschia megastoma และ H. muscae เพราะมี vector เป็น Musca domestica (แมลงวันบ้าน)**",
              "**จำแนกชนิดจากลักษณะของ buccal cavity**",
              "ตัวเต็มวัยอยู่ที่กระเพาะ แต่ที่เรามักเจอคือระยะ larva แบบ cutaneous form บริเวณหัวตาและข้อเท้า",
              "**ก่อโรคได้ 2 แบบคือ gastric form และ cutaneous form (จาก L3)**",
              "**ต้องใช้ intermediate host มี PPP ประมาณ 2 เดือน**",
              "**Musca domestica (แมลงวันบ้าน) เป็นพาหะของ H. muscae และ D. megastoma**",
              "**Stomoxys calcitrans (แมลงวันคอก) เป็นพาหะของ H. microstoma**",
              "H. muscae ตัวเต็มวัยอยู่ที่ผิวกระเพาะ ทำให้เกิด **chronic catarrhal gastritis**"
            ]
          },
          {
            "sub": "Clinical signs และ diagnosis",
            "body": [
              {
                "bullets": [
                  "**Gastric form อาการไม่ชัด ต้องทำ gastric lavage แล้ว sedimentation** จะพบได้ทั้งไข่และตัวเต็มวัย",
                  "**Cutaneous form พบแผลแบบ granuloma นูนแข็ง** ต้องใช้ curette ขูด deep skin แล้วแช่ใน **0.85% NaCl** ตัวอ่อนจะออกมาตายและตกตะกอน จากนั้นนำตะกอนไปส่องกล้อง",
                  "**การให้ยาปฏิชีวนะจะรักษาแผลไม่หาย**",
                  "**Tx: ivermectin ครอบคลุมได้ทุกกรณี**"
                ]
              }
            ]
          },
          {
            "sub": "Cutaneous habronemosis (summer sore)",
            "body": [
              {
                "bullets": [
                  "**เป็น eosinophilic granuloma**",
                  "แผลหลุมบริเวณหัวตา ตรงที่แมลงวันมาตอม",
                  "**เกิดจากแมลงวันตอมแล้วนำ L3 ของ Habronema หรือ Draschia มาชอนไชผิวหนัง**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Strongyloides westeri",
        "source": "Equine Med 85 น.13",
        "body": [
          {
            "bullets": [
              "**ติดผ่าน transmammary infection**",
              "**ทำให้ลูกม้าอายุ 2-3 สัปดาห์ถ่ายเหลวเฉียบพลัน**",
              "ตัวอ่อนชอนไชผิวหนังทำให้เกิด dermatitis",
              "ทำให้เกิด enteritis เพราะอยู่ที่ small intestine",
              "**Dx: floatation โดยภายในไข่มีตัวอ่อนอยู่แล้ว**",
              "**Tx: ivermectin, oxibendazole (PO)**"
            ]
          }
        ]
      },
      {
        "heading": "Oxyuris equi (pinworm)",
        "source": "Equine Med 85 น.13",
        "body": [
          {
            "bullets": [
              "**เจอบ่อยที่ colon และ rectum**",
              "**ตัวเมียชอบออกมาวางไข่ช่วงเช้าบริเวณรอบรูก้น**",
              "ม้าจะคันแล้วเอาก้นไปถูจนเป็นแผล",
              "**PPP ประมาณ 4-6 เดือน**",
              "**Dx: scotch tape technique**",
              "**ไข่ไม่สมมาตร ด้านหนึ่งแบน อีกด้านโค้งนูน**",
              "**Tx: fenbendazole, pyrantel, ivermectin**"
            ]
          }
        ]
      },
      {
        "heading": "Parascaris equorum",
        "source": "Equine Med 85 น.13",
        "body": [
          {
            "bullets": [
              "**ยังเจอได้บ่อยในไทย อาศัยในลำไส้เล็ก**",
              "**Dx: floatation พบไข่ขนาดใหญ่ กลม**",
              "**PPP ประมาณ 3 เดือน เพราะมี hepatic-tracheal migration**",
              "**อาการในลูกม้า: โตช้า แคระ มีน้ำมูก ขนหยาบ ปอดบวม colic และตายได้**",
              "**Tx: ivermectin, fenbendazole, pyrantel (PO) แต่ต้องระวังการดื้อยา**"
            ]
          }
        ]
      },
      {
        "heading": "Large strongyles",
        "source": "Equine Med 85 น.14",
        "body": [
          {
            "bullets": [
              "สกุลที่จัดอยู่ในกลุ่มนี้ ได้แก่ **Strongylus spp., Oesophagodontus และ Triodontophorus**",
              "**Strongylus vulgaris ตัวเล็กแต่อันตรายที่สุด PPP ประมาณ 6 เดือน จึงเป็นที่มาของการให้ยาถ่ายทุก 6 เดือน**",
              "**Strongylus equinus และ edentatus:** ระยะตัวอ่อนทำให้เกิด **peritonitis และเลือดออกที่ตับและตับอ่อน → colic** ส่วนตัวเต็มวัยอยู่ที่ลำไส้ใหญ่และดูดเลือด ทำให้เกิด **ulcer และ normocytic anemia**",
              "ม้าโตอาการมักไม่เด่น แต่ **ม้าอายุน้อยกว่า 2-3 ปีที่มีพยาธิจำนวนมาก โดยเฉพาะ S. vulgaris จะเกิด colic ได้สูง**",
              "วงจรชีวิตมีทั้งแบบ non-migratory และ migratory"
            ]
          }
        ]
      },
      {
        "heading": "Small strongyles (Cyathostomes)",
        "source": "Equine Med 85 น.14",
        "body": [
          {
            "bullets": [
              "**พบบ่อยกว่า large strongyles**",
              "เป็นกลุ่มของ **Trichonemes และ Cyathostomes**",
              "**ไข่เปลือกบาง 2 ชั้น ภายในมี segmented embryo**",
              "**Non-migratory life cycle, PPP ประมาณ 6-12 สัปดาห์**",
              "**L4 กระตุ้นการสร้าง nodule ใน colonic mucosa**",
              "**ตัวเต็มวัยไม่กินเลือด**"
            ]
          },
          {
            "sub": "Diagnosis",
            "body": [
              {
                "bullets": [
                  "**Egg count (EPG) ในกรณี mixed infection: 500 = mild, 500-1,000 = moderate, มากกว่า 1,000 = severe**",
                  "**แต่ถ้าเป็น S. vulgaris พบแค่ระดับ 500 ก็ถือว่ารุนแรงแล้ว**",
                  "**Fecal culture ใช้แยกว่าเป็น large หรือ small strongyle จาก L3 เพราะดูแค่ไข่แยกชนิดไม่ได้**",
                  "ถ้าดู L3 แล้วยังแยกไม่ออก ให้ใช้ molecular diagnosis"
                ]
              }
            ]
          },
          {
            "sub": "Treatment",
            "body": [
              {
                "bullets": [
                  "**Macrocyclic lactones: ivermectin, moxidectin**",
                  "**ใช้ moxidectin ในกรณีที่ดื้อยา**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "EPG การประเมินการดื้อยา และ metabarcoding",
        "source": "Equine Med 85 น.14",
        "body": [
          {
            "bullets": [
              "**EPG ใช้ประเมินประสิทธิภาพของยาถ่ายพยาธิ โดยตรวจซ้ำหลังให้ยา 2 สัปดาห์** ถ้าลดลงมากหรือเป็น 0 ถือว่าได้ผล",
              "**ถ้าน้อยกว่า 200 EPG ไม่ต้องให้ยาถ่าย** เพื่อให้ฝูงยังสร้างภูมิต้านทานได้",
              "ใช้ ivermectin ในการควบคุม strongyle ในม้า",
              "**ERP (egg reappearance period) เป็นตัวชี้การดื้อยา ถ้า ERP สั้นกว่าปกติแปลว่าอาจเริ่มดื้อยา**",
              "**Metabarcoding ใช้ next-generation sequencing วิเคราะห์ nemabiome ซึ่งคือกลุ่มพยาธิในลำไส้ ได้ละเอียดกว่าการดูแค่ morphology**",
              "ผลที่ได้ช่วยกำหนด deworming strategy ให้เหมาะกับม้าในไทย"
            ]
          }
        ]
      },
      {
        "heading": "Setaria spp.",
        "source": "Equine Med 85 น.13",
        "body": [
          {
            "bullets": [
              "เป็น **filarial nematode**",
              "**ปกติตัวเต็มวัยอาศัยอยู่ในช่องท้อง**",
              "**L4 และ young adult อาจ migrate ผิดที่ไปอยู่ใน eye chamber หรือ vitreous humour ซึ่งถือเป็น aberrant parasite**",
              "**อาการทางตา: กลัวแสง น้ำตาไหล cornea ขุ่นมัว และตาอาจบอด**",
              "ล่าสุดที่เจอในม้า คาดว่าน่าจะเป็นชนิดที่ข้ามมาจากวัว"
            ]
          }
        ]
      },
      {
        "heading": "Blood parasites: piroplasmosis และ trypanosomosis",
        "source": "Equine Med 85 น.14",
        "body": [
          {
            "sub": "Equine piroplasmosis",
            "body": [
              {
                "bullets": [
                  "**Babesia caballi เป็น large babesia มี incubation period 10-30 วัน**",
                  "**Babesia equi เป็น small babesia มี incubation period 12-19 วัน** จึงใช้ระยะฟักตัวช่วยแยกสองชนิดนี้ได้",
                  "**Babesia equi ถ่ายทอดในเห็บแบบ transtadial transmission ซึ่งต่างจาก Babesia ชนิดอื่นที่ส่วนใหญ่เป็น transovarian transmission** (คือเชื้อส่งผ่านจากแม่เห็บไปที่ไข่)",
                  "**ในไทยเจอบ่อยที่จังหวัดลำปางเพราะมีม้าเยอะ**",
                  "อาการไม่จำเพาะ มี **acute fever จากการที่เม็ดเลือดแดงแตก**",
                  "**Vector: Rhipicephalus microplus ซึ่งเป็น one-host tick**",
                  "**ติดผ่าน mechanical transmission ได้ด้วย เช่น เข็มฉีดยาและการถ่ายเลือด**",
                  "**Dx: buffy coat thin blood smear ย้อม Giemsa, PCR, serology (IFA, Western blot)**",
                  "**Tx: imidocarb**"
                ]
              }
            ]
          },
          {
            "sub": "Trypanosoma evansi",
            "body": [
              {
                "bullets": [
                  "**Vector: Tabanus**",
                  "**Sign: intermittent fever, anemia และต้องระวังอาการทางระบบประสาท**",
                  "**Neuropathology: ataxia, blindness, circling, meningoencephalitis**",
                  "**Blood smear ย้อม Giemsa มี specificity สูง**",
                  "**Woo's technique เห็นเชื้อขยับได้ แต่บอกไม่ได้ว่าเป็นเชื้อชนิดใด**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ectoparasites: เหา (Louse)",
        "source": "Equine Med 85 น.15",
        "body": [
          {
            "text": "หลักการคือ **แยกก่อนว่าเป็นเหาดูดหรือเหาแทะ** จะได้เลือกวิธีให้ยาถูก"
          },
          {
            "sub": "Damalinia equi",
            "body": [
              {
                "bullets": [
                  "**เป็น chewing louse หัวใหญ่กว่าอก**",
                  "**Low virulence, weak**",
                  "**ชอบอยู่ที่ dorso-lateral trunk หน้าผาก และคอ** จึงเป็นตัวที่ตอบเวลาถามว่าเหาชนิดใดอยู่แถวแผงคอ",
                  "**Tx: ยาทาภายนอก เช่น pyrethroid, fipronil**"
                ]
              }
            ]
          },
          {
            "sub": "Haematopinus asini (tail louse)",
            "body": [
              {
                "bullets": [
                  "**เป็น sucking louse ตัวใหญ่ประมาณ 3 มม.**",
                  "**ไม่มีตา แต่มี ocular point**",
                  "**เห็น thoracic sternal plate ชัดที่ด้าน ventral**",
                  "Paratergal plate ชัดแต่ไม่ค่อยยื่นออกมา",
                  "**ชอบอยู่ที่หาง**",
                  "**Tx: ivermectin**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ectoparasites: ไร (Mite)",
        "source": "Equine Med 85 น.15",
        "body": [
          {
            "text": "Family **Psoroptidae** มี 3 genus คือ **Psoroptes, Chorioptes และ Otodectes** ลักษณะร่วมคือ **oval body และเป็น non-burrowing mite** โดยขาคู่ที่ 3 และ 4 ยาวจนมองเห็นได้จากด้าน dorsal"
          },
          {
            "sub": "Psoroptes equi",
            "body": [
              {
                "bullets": [
                  "เป็น house body mite ทำให้เกิด itch, mange, scab",
                  "**ปากแหลม จึงก่อโรคมากกว่า Chorioptes**",
                  "**Epimere ของขาคู่แรกไม่ fuse กัน**",
                  "**มี jointed pretarsi และ sucker รูปกรวย (funnel-shaped)**",
                  "**Tx: ivermectin**"
                ]
              }
            ]
          },
          {
            "sub": "Chorioptes equi",
            "body": [
              {
                "bullets": [
                  "**มี unjointed pretarsi และ sucker รูปถ้วย (cup-shaped) ก้านสั้น**",
                  "**ปากไม่แหลม ไม่แทงผิวหนัง**",
                  "**กินเศษเนื้อเยื่อบริเวณ fetlock**",
                  "ก่อโรคน้อยกว่า Psoroptes"
                ]
              },
              {
                "callout": "จุดแยกที่จำง่ายที่สุดคือ **pretarsi: Psoroptes เป็นข้อ (jointed) ส่วน Chorioptes ไม่มีข้อ (unjointed)** และรูปร่างของ sucker กรวยกับถ้วย",
                "kind": "tip"
              }
            ]
          }
        ]
      }
    ]
  },
  "equine-infectious": {
    "topic": "equine-infectious",
    "title": "โรคผิวหนังม้าจากเชื้อ เชื้อรา แบคทีเรีย และไวรัส",
    "icon": "📘",
    "summary": "กลุ่ม crusting and scaling ได้แก่ dermatophytosis จาก Trichophyton equinum var. equinum และ Microsporum equinum และ dermatophilosis จาก Dermatophilus congolensis ที่แสดงออกเป็น rain scald และ mud fever ต่อด้วยกลุ่มไวรัส คือ coital exanthema จาก EHV-3 และ viral papillomatosis จาก Equus caballus papillomavirus",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "Dermatophytosis การติดเชื้อราตื้นที่ผิวหนัง",
        "source": "Equine Dermatology น.25",
        "body": [
          {
            "text": "เชื้อก่อโรคที่สไลด์ระบุคือ **Trichophyton equinum var. equinum** และ **Microsporum equinum**"
          },
          {
            "bullets": [
              "ระยะแรก: urticaria เป็นเฉพาะที่หรือหลายจุด และเห็น erythema ได้ในผิวที่ไม่มีเม็ดสี",
              "ต่อมา: **เป็นขุย ตกสะเก็ด และขนร่วง เกิดสะเก็ดหนา** ร่วมกับอาการคัน"
            ]
          },
          {
            "sub": "การวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "ประวัติและอาการ",
                  "**ตรวจสะเก็ดและเส้นขนหา arthrospore และหรือ hyphae**",
                  "เพาะเชื้อรา (dermatophyte culture)",
                  "Wood's lamp"
                ]
              }
            ]
          },
          {
            "sub": "การรักษา",
            "body": [
              {
                "bullets": [
                  "**ไม่มียาต้านเชื้อราชนิดกินหรือฉีดที่ขึ้นทะเบียนสำหรับม้า**",
                  "ยาทาภายนอก: **แชมพู miconazole 2% ร่วมกับ chlorhexidine 2% อาบสัปดาห์ละ 2 ครั้ง** ผู้จดระบุชื่อการค้า Malasep และกำกับว่าใช้เยอะมาก",
                  "**สปอร์อยู่บนเส้นขนและในสะเก็ดได้นานหลายเดือน และฆ่า arthrospore ได้ยาก จึงต้องรักษาซ้ำ**"
                ]
              }
            ]
          },
          {
            "callout": "เป็นโรคติดต่อจากสัตว์สู่คน ต้องระวังทั้งตัวเองและเจ้าของ และเก็บกวาดสะเก็ดกับขนที่ร่วงออกจากสิ่งแวดล้อมด้วย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Dermatophilosis จาก Dermatophilus congolensis",
        "source": "Equine Dermatology น.26-27",
        "body": [
          {
            "bullets": [
              "**Zoospore อยู่รอดในสะเก็ดได้หลายเดือน** แต่อยู่ในดินชื้นได้ระยะสั้นกว่า และดินชื้นทำลาย epidermal barrier ได้",
              "มักเกิดในช่วงอากาศชื้นฝนตก และผิวหนังที่บาดเจ็บหรือไม่มีเม็ดสีเป็นปัจจัยเสี่ยง",
              "ผู้จดสรุปว่าเชื้อจำเพาะกับม้ามาก อยู่ตามตัวและขนอยู่แล้ว รอให้ epidermal barrier เสียหายจึงก่อโรค เช่น น้ำค้างทำให้ barrier เสีย"
            ]
          },
          {
            "sub": "2 กลุ่มอาการหลัก",
            "body": [
              {
                "bullets": [
                  "**Rain scald**: ลำตัวด้านบนและด้านข้าง ตรงตำแหน่งที่น้ำไหลผ่าน",
                  "**Mud fever**: ขาส่วนปลาย ผู้จดกำกับว่าม้าออกไปวิ่งเจอดิน และมักเกิดกับขาสีขาว"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะการดำเนินของรอยโรค",
            "body": [
              {
                "bullets": [
                  "เริ่มเป็นจุด ขนตั้งเป็นกระจุก ลักษณะ **paintbrush lesion**",
                  "แล้วกลายเป็น **สะเก็ดหนา ที่ด้านล่างเว้าและมีหนองบาง ๆ เคลือบอยู่** ร่วมกับบวมน้ำ"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและการแยกโรค",
            "body": [
              {
                "bullets": [
                  "ประวัติ อาการ และ **impression smear**",
                  "**เพาะเชื้อยาก เพราะโตช้าและต้องใช้คาร์บอนไดออกไซด์ในการเจริญ**",
                  "แยกจาก: dermatophytosis, bacterial folliculitis และสาเหตุอื่นของ greasy heel ได้แก่ pastern dermatitis, photosensitisation, contact dermatitis และ leucocytoclastic vasculitis"
                ]
              }
            ]
          },
          {
            "sub": "การรักษา",
            "body": [
              {
                "bullets": [
                  "**จัดที่อยู่ให้แห้ง และแยกสัตว์ป่วย**",
                  "ลอกสะเก็ดออกด้วยน้ำยาหรือแชมพูกลุ่ม keratolytic อาจต้องซึม",
                  "**ทิ้งสะเก็ดอย่างระมัดระวัง เพราะเป็นแหล่งเชื้อ**",
                  "อาบด้วยแชมพูหรือสครับ chlorhexidine 1 ถึง 2% ทุกวัน ทิ้งไว้สัมผัสผิว 5 ถึง 10 นาที",
                  "วันที่ไม่ได้อาบน้ำ ใช้ chlorhexidine ชนิดมูสหรือสเปรย์"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Coital exanthema จาก equine herpesvirus-3 (EHV-3)",
        "source": "Equine Dermatology น.30-31",
        "body": [
          {
            "bullets": [
              "ติดต่อทาง **การผสมพันธุ์ สิ่งของปนเปื้อน และแมลงพาหะ**",
              "**ระยะฟักตัว 5 ถึง 9 วัน**",
              "ลำดับรอยโรค: **papule ไปเป็น vesicle ไปเป็นแผลหลุม แล้วตกสะเก็ด**",
              "ตำแหน่ง: พ่อม้าที่องคชาต หนังหุ้ม และถุงอัณฑะ แม่ม้าที่ปากช่องคลอดและฝีเย็บ บางครั้งพบที่ริมฝีปาก ในช่องปาก และรูจมูก",
              "**หายภายในราว 14 วัน แต่รอยด่างสีจางอาจคงอยู่ถาวร**",
              "**ม้าจำนวนมากกลายเป็นพาหะแฝง (latent carrier)** และกลับมาแสดงอาการซ้ำในฤดูผสมพันธุ์หรือเมื่อเครียด เช่น ได้รับ glucocorticoid",
              "การติดเชื้อแทรกซ้อนทำให้รอยโรคซับซ้อนขึ้น"
            ]
          },
          {
            "sub": "การวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "แยกจากการติดเชื้อไวรัสชนิดอื่น โรคของอวัยวะสืบพันธุ์อื่น และ bullous pemphigoid",
                  "**Biopsy: ballooning degeneration ของ basal epithelium มี vesicle และ intranuclear inclusion body**",
                  "ยืนยันโดยการแยกเชื้อจาก vesicle สะเก็ด หรือชิ้นเนื้อ",
                  "Electron microscopy หรือระดับแอนติบอดีที่สูงขึ้น และ PCR จากรอยโรค ซึ่งมีให้บริการในบางห้องปฏิบัติการ",
                  "**พาหะแฝงยังไม่มีวิธีตรวจที่ใช้ได้ในปัจจุบัน**"
                ]
              }
            ]
          },
          {
            "sub": "การรักษาและการควบคุม",
            "body": [
              {
                "bullets": [
                  "การติดเชื้อแทรกซ้อน ใช้ยาฆ่าเชื้อและสารให้ความชุ่มชื้นทาภายนอก และให้ยาปฏิชีวนะชนิดกินหรือฉีดถ้ารุนแรง",
                  "**พักการผสมพันธุ์ของพ่อพันธุ์แม่พันธุ์ 3 ถึง 4 สัปดาห์**",
                  "ฆ่าเชื้อสิ่งของที่เป็นพาหะ เช่น อุปกรณ์ grooming และฟองน้ำ"
                ]
              }
            ]
          },
          {
            "callout": "เมื่อไม่มีวิธีตรวจพาหะแฝง การควบคุมจึงอาศัยการตรวจดูอวัยวะสืบพันธุ์ก่อนผสมทุกครั้ง และการจัดการสิ่งของร่วมกันเป็นหลัก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Viral papillomatosis หรือหูด",
        "source": "Equine Dermatology น.36-37",
        "body": [
          {
            "text": "ผู้จดทำเครื่องหมายดาวไว้ที่หัวข้อนี้"
          },
          {
            "bullets": [
              "**พบบ่อยในม้าอายุน้อยกว่า 3 ปี** ไม่มีความจำเพาะต่อสายพันธุ์หรือเพศ",
              "เกิดจาก **Equus caballus papillomavirus (EcPV) โดยหลักคือ EcPV-1**",
              "ติดต่อทางสัมผัสโดยตรงหรือโดยอ้อม และ **ต้องมีผิวหนังที่บาดเจ็บ** จากบาดแผล แมลงกัด ปรสิตภายนอก หรือแสง UV",
              "**ระยะฟักตัว 19 ถึง 67 วัน**"
            ]
          },
          {
            "sub": "อาการ",
            "body": [
              {
                "bullets": [
                  "ตุ่มนูนผิวขรุขระแบบ verrucous หลายตุ่ม ขนาด 1 มิลลิเมตรถึง 2 เซนติเมตร สีเทาขาวถึงชมพู ผิวหนาเป็นขุย",
                  "**ไม่คันและไม่เจ็บ**",
                  "ตำแหน่ง: รอบตา ปลายจมูก ริมฝีปาก ขาส่วนปลาย และอวัยวะเพศภายนอก"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและการแยกโรค",
            "body": [
              {
                "bullets": [
                  "อาศัย **อายุ ตำแหน่ง และลักษณะทางคลินิก** ไม่ค่อยจำเป็นต้อง biopsy",
                  "ถ้าตรวจชิ้นเนื้อจะพบ epidermal hyperplasia, papillomatosis, parakeratotic hyperkeratosis, koilocyte และ inclusion body",
                  "ตรวจหาแอนติเจนของ papillomavirus ได้ด้วย immunohistochemistry",
                  "แยกจาก: sarcoid, horse pox, molluscum contagiosum และ epidermal hamartoma หรือ nevus"
                ]
              }
            ]
          },
          {
            "sub": "การรักษาและการป้องกัน",
            "body": [
              {
                "bullets": [
                  "**มักหายเองใน 2 ถึง 3 เดือน** จาก cell-mediated immunity ซึ่งให้ภูมิคุ้มกันไปตลอดชีวิต ผู้จดกำกับว่าถ้าไม่กระทบการใช้ชีวิตก็ปล่อยให้หายเอง",
                  "รอยโรคที่ไม่ยุบ ใช้การผ่าตัดหรือ cryotherapy",
                  "ยาทาที่ใช้นอกฉลากจากยาคน: **podophyllotoxin 0.15% cream ทาวันละ 2 ครั้ง สัปดาห์ละ 3 วัน ออกฤทธิ์ยับยั้งการแบ่งเซลล์** และ **imiquimod 5% cream ทาสัปดาห์ละ 3 ครั้ง ล้างออกหลัง 6 ถึง 10 ชั่วโมง ออกฤทธิ์กระตุ้น interferon เฉพาะที่**",
                  "**การพยากรณ์โรคดี แต่ถ้าเป็นนานเกิน 12 เดือน ให้สงสัยภาวะภูมิคุ้มกันบกพร่อง**",
                  "ป้องกันโดยแยกม้าที่ติดเชื้อ ไม่ให้ม้าที่ยังไม่เคยติดเชื้อเข้าแปลงหรือพื้นที่ปนเปื้อน ฆ่าเชื้ออุปกรณ์ grooming อุปกรณ์ให้อาหาร และอานม้า",
                  "วัคซีน autogenous อาจช่วยได้ และมีหลักฐานใหม่สนับสนุนประโยชน์ในเชิงการรักษา"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "equine-tumors": {
    "topic": "equine-tumors",
    "title": "เนื้องอกผิวหนังม้า และ PPID ที่มาด้วยขนผิดปกติ",
    "icon": "📘",
    "summary": "Sarcoid เป็นเนื้องอกที่พบบ่อยที่สุดในม้าและสัมพันธ์กับ bovine papillomavirus รองลงมาคือ squamous cell carcinoma ราว 20% ของเคส ตามด้วย melanoma ที่พบมากในม้าสีเทาอายุมาก และ eosinophilic granuloma ที่เป็นก้อนไม่เจ็บไม่คัน ปิดท้ายด้วย PPID ซึ่งบรรยายไว้ในหัวข้อ alopecia",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "Sarcoid",
        "source": "Equine Dermatology น.34-35",
        "body": [
          {
            "bullets": [
              "**เป็นเนื้องอกที่พบบ่อยที่สุดในม้า** ไม่จำเพาะต่ออายุหรือเพศ แต่มีความสัมพันธ์ทางพันธุกรรมแบบ polygenic โดยพบ heritability มากกว่า 20% ในสายพันธุ์ของสวิส",
              "สัมพันธ์กับ **bovine papillomavirus BPV-1 เป็นหลัก หรือ BPV-2** และสงสัยว่ามีแมลงเป็นพาหะ",
              "เป็นก้อนเดี่ยวหรือหลายก้อน มักอยู่บริเวณที่ขนบาง ได้แก่ **ศีรษะ ขาหนีบ และท้องด้านล่าง**",
              "**ดำเนินโรคช้า แต่การบาดเจ็บทำให้รอยโรคแย่ลงได้**"
            ]
          },
          {
            "sub": "6 รูปแบบทางคลินิก",
            "body": [
              {
                "bullets": [
                  "**Occult**: แบนราบ ขนร่วง มีสะเก็ดบาง",
                  "**Verrucose**: คล้ายหูด ผิวหนาเป็นขุยแข็ง",
                  "**Nodular**: ก้อนใน dermis หรือใต้ dermis อาจเคลื่อนได้หรือยึดติด",
                  "**Fibroblastic**: เนื้อแดง มีแผลหลุม มีก้านหรือฐานแบน",
                  "**Mixed**: ผสมหลายรูปแบบ",
                  "**Malevolent หรือ malignant**: ลุกลาม สร้างเนื้อเพิ่มเร็ว และแพร่ตามท่อน้ำเหลือง ผู้จดกำกับว่าเจ็บมากและบวม"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและการแยกโรค",
            "body": [
              {
                "bullets": [
                  "อาศัยลักษณะและตำแหน่ง แล้ว **ยืนยันด้วย biopsy ร่วมกับ histopathology** ถึงแม้จะมีความเสี่ยงทำให้รอยโรคกำเริบก็ยังจำเป็น",
                  "แยกจาก: dermatophytosis, papillomatosis, squamous cell carcinoma, eosinophilic granuloma, exuberant granulation tissue และ habronemiasis"
                ]
              }
            ]
          },
          {
            "sub": "การรักษาแบบเลือกให้เหมาะรายตัว",
            "body": [
              {
                "bullets": [
                  "**Benign neglect** สำหรับรอยโรคเล็ก คงที่ และไม่รบกวนอุปกรณ์ขี่",
                  "ผ่าตัด: sharp excision **ไม่แนะนำ** cryotherapy กลับเป็นซ้ำสูง และ **laser excision ดีที่สุด หายมากกว่า 80% ตั้งแต่ครั้งแรก** ผู้จดเสริมว่า CO2 laser จี้ห้ามเลือดได้ด้วย",
                  "รังสีรักษา: brachytherapy ด้วย iridium192 หรือ gold198 สำเร็จ 81 ถึง 100%",
                  "**ฉีดเข้าก้อน: mitomycin C หายได้ถึง 96% cisplatin emulsion 87 ถึง 97% และ BCG ใช้รอบตา แต่มีความเสี่ยงเกิด hypersensitivity**",
                  "ยาทา: imiquimod 5% สำเร็จ 80% แต่ช้า Liverpool sarcoid cream มีพิษและใช้โดยสัตวแพทย์เท่านั้น และ bloodroot ointment ผลไม่แน่นอนและไม่ใช้ที่ใบหน้า",
                  "**การพยากรณ์โรคแย่ลงถ้าเคยรักษามาก่อนแล้วไม่สำเร็จ** และแนะนำให้ควบคุมแมลงร่วมด้วย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Squamous cell carcinoma (SCC)",
        "source": "Equine Dermatology น.38",
        "body": [
          {
            "text": "ผู้จดทำเครื่องหมายดาวไว้ที่หัวข้อนี้"
          },
          {
            "bullets": [
              "**เป็นเนื้องอกที่พบมากเป็นอันดับสอง ราว 20% ของเคส** โดยเฉพาะรอบตาและรอบต่อมของผิวหนัง",
              "**อายุเฉลี่ยประมาณ 12 ปี** พบในเพศผู้มากกว่าเนื่องจากรอยโรคที่อวัยวะเพศ",
              "ปัจจัยเสี่ยง: **แสง UV บนผิวที่ไม่มีเม็ดสี** และ **EcPV-2 สัมพันธ์กับรอยโรคที่องคชาตและหนังหุ้ม**",
              "ตำแหน่ง: **รอยต่อระหว่างผิวหนังกับเยื่อเมือก ได้แก่ ริมฝีปากและอวัยวะเพศ**",
              "อาการ: ก้อนสร้างเนื้อเพิ่ม อาจมีแผลหลุมร่วมด้วย เป็น **แผลเรื้อรังที่ไม่หาย** มีเลือดออกและติดเชื้อ",
              "วินิจฉัย: ประวัติ อาการ และ **histopathology**",
              "แยกจาก: habronemiasis, fibroblastic sarcoid, exuberant granulation tissue และเนื้องอกชนิดอื่น",
              "รักษา: ตัดออกให้กว้าง cryosurgery หรือ laser surgery รังสีรักษา ฉีด cisplatin ทา 5-FU และฉีด BCG เข้าก้อน",
              "**การพยากรณ์โรค: ลุกลามเฉพาะที่รุนแรง แพร่ไปต่อมน้ำเหลืองในบริเวณได้บ่อย แพร่ไกลได้ และชนิดที่องคชาตหรือหนังหุ้มดุร้ายกว่า**"
            ]
          },
          {
            "callout": "ผู้จดบันทึกว่าแผลของ SCC หน้าตาคล้าย sarcoid มาก และเขียนเพิ่มว่า sarcoid อาจ develop เป็น SCC ได้ ข้อความหลังนี้เป็นบันทึกของผู้จด ไม่ได้อยู่ในสไลด์ จึงไม่ควรนำไปตอบเป็นข้อเท็จจริงโดยไม่ยืนยันกับอาจารย์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Melanoma",
        "source": "Equine Dermatology น.39",
        "body": [
          {
            "text": "ผู้จดทำเครื่องหมายดาวไว้ที่หัวข้อนี้ และกำกับว่าน่าจะมีพื้นฐานทางพันธุกรรม"
          },
          {
            "bullets": [
              "**พบบ่อยมากในม้าสีเทาที่อายุมาก และพบน้อยในม้าสีอื่น**",
              "รอยโรค: ก้อนสีเข้มก้อนเดียวหรือหลายก้อน รวมกันเป็นแผ่น อาจมีแผลหลุม",
              "ตำแหน่ง: **โคนหาง ฝีเย็บ ปากช่องคลอด** หนังหุ้มองคชาต ริมฝีปาก ต่อมน้ำลาย parotid และอาจพบในอวัยวะภายใน ผู้จดเสริมว่าลุกลามเข้า rectum ได้",
              "อาจทำให้เกิดอาการเฉพาะที่ เช่น ถ่ายอุจจาระลำบาก หรือทางเดินหายใจถูกอุดกั้น",
              "วินิจฉัย: อาการทางคลินิกและ biopsy",
              "รักษา: **ผ่าตัดหรือใช้เลเซอร์ตัดออกตั้งแต่ระยะแรกได้ผลดีที่สุด** ฉีด cisplatin เข้าก้อนได้ ส่วน **cimetidine ผลไม่น่าเชื่อถือ**",
              "**การพยากรณ์โรค: guarded ถึง poor ในรายที่เป็นมานาน การตัดออกตั้งแต่แรกช่วยกันการแพร่กระจาย**"
            ]
          }
        ]
      },
      {
        "heading": "Eosinophilic granuloma",
        "source": "Equine Dermatology น.40-41",
        "body": [
          {
            "bullets": [
              "เป็นโรคผิวหนังที่พบบ่อยในม้า เกิดได้ทุกอายุ ทุกเพศ ทุกสายพันธุ์",
              "พบมากในฤดูใบไม้ผลิและฤดูร้อน อาจยุบเองแต่กลับเป็นซ้ำบ่อย และ **รอยโรคที่มีแคลเซียมสะสมแล้วจะคงอยู่ถาวร**",
              "**สาเหตุหลายปัจจัย สงสัย insect bite hypersensitivity** และบางครั้งพบในม้าที่เป็น atopy"
            ]
          },
          {
            "sub": "อาการทางคลินิก",
            "body": [
              {
                "bullets": [
                  "papule หรือ nodule ใน dermis ก้อนเดียวหรือหลายก้อน ขนาดไม่แน่นอน",
                  "ตำแหน่ง: **บริเวณอานม้า คอ ลำตัว และสีข้าง** แต่เกิดที่ใดก็ได้",
                  "**ขอบเขตชัด แข็ง ขนไม่ร่วง ไม่เจ็บ และไม่คัน** ผิวหนังและขนที่คลุมอยู่ปกติ ยกเว้นถูกเสียดสีจนบาดเจ็บ",
                  "รอยโรคเรื้อรัง: มีแคลเซียมสะสมและอาจดันสารที่กลายเป็นหินปูนออกมา ผู้จดกำกับว่าจับแล้วแข็งมาก ต่างจากรอยแมลงกัด"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัยและการแยกโรค",
            "body": [
              {
                "bullets": [
                  "ประวัติร่วมกับอาการ และตรวจว่ามีภาวะภูมิไวเกินร่วมด้วยหรือไม่",
                  "**การเจาะดูดมักได้สิ่งส่งตรวจน้อย**",
                  "**Biopsy: eosinophilic granulomatous dermatitis ที่มี flame figures ร่วมกับ folliculitis หรือ furunculosis และ dystrophic mineralization**",
                  "แยกจาก: habronemiasis, ปฏิกิริยาที่ตำแหน่งฉีดยา รอยกัดของสัตว์ขาปล้อง granuloma จากการติดเชื้อ และ mast cell tumour"
                ]
              }
            ]
          },
          {
            "sub": "การรักษาและการพยากรณ์โรค",
            "body": [
              {
                "bullets": [
                  "หลายรายปล่อยไว้โดยไม่รักษา และแก้ที่การรองอานถ้ารอยโรคอยู่เฉพาะที่",
                  "ผ่าตัดออกในรายที่เป็นก้อนเดียวหรือไม่กี่ก้อน",
                  "Glucocorticoid ให้ทั้งแบบทั่วร่างกาย ฉีดเข้าก้อน หรือฉีดใต้ก้อน ได้แก่ **prednisolone 1 ถึง 2 mg/kg กินวันละครั้ง 2 ถึง 3 สัปดาห์แล้วค่อยลดขนาด** หรือ **dexamethasone กิน 0.1 mg/kg 2 ถึง 3 สัปดาห์**",
                  "**Triamcinolone 3 ถึง 5 mg ต่อก้อน ไม่เกิน 20 mg ต่อม้าหนึ่งตัว ซ้ำได้หลัง 2 สัปดาห์** ผู้จดกำกับว่าฉีดเข้าก้อนได้และมีข้อจำกัดในสัตว์ใหญ่",
                  "หรือฉีด dexamethasone หรือ methylprednisolone suspension เข้าเป็นก้อน ๆ ไป",
                  "**การพยากรณ์โรค fair ถึง guarded กลับเป็นซ้ำบ่อย และการหายขาดถาวรเกิดได้ยาก** สเตียรอยด์ได้ผลน้อยกับรอยโรคเรื้อรังที่มีแคลเซียมสะสม"
                ]
              }
            ]
          },
          {
            "callout": "สเตียรอยด์ชนิด depot เพิ่มความเสี่ยงต่อ laminitis ซึ่งเป็นเหตุผลสำคัญที่ต้องคุมขนาดยาต่อก้อนและต่อตัวสัตว์",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "PPID หรือ equine Cushing's disease (pituitary pars intermedia dysfunction)",
        "source": "Equine Dermatology น.32-33",
        "body": [
          {
            "text": "สไลด์บรรยาย PPID ไว้ในกลุ่มอาการ **alopecia** เพราะมาพบสัตวแพทย์ด้วยความผิดปกติของขน"
          },
          {
            "bullets": [
              "พยาธิกำเนิด: **การเสื่อมของเซลล์ประสาทที่หลั่ง dopamine จาก hypothalamus ทำให้ pars intermedia หนาตัวหรือเกิด adenoma และ ACTH สูงขึ้น**",
              "**พบในม้าอายุมากกว่า 15 ปี ไม่จำเพาะสายพันธุ์หรือเพศ** ผู้จดกำกับว่ามักเจอในเขตหนาว"
            ]
          },
          {
            "sub": "อาการทางคลินิก",
            "body": [
              {
                "bullets": [
                  "ระยะแรก: ซึม สมรรถภาพลด **ผลัดขนช้า ขนยาวผิดปกติเฉพาะบริเวณ (regional hypertrichosis)** กล้ามเนื้อแนวสันหลังลด เหงื่อออกผิดปกติ laminitis และไขมันสะสมเฉพาะที่",
                  "ระยะท้าย: **hypertrichosis ทั่วตัว** ท้องป่อง **PU/PD** ติดเชื้อซ้ำ ๆ laminitis เอ็นและเอ็นยึดหย่อน มีบุตรยาก และอาการของโรคทางระบบ",
                  "ผู้จดสรุปภาพจำไว้ว่า ตัวอ้วน ขนหยิกยาว เดินแล้วเจ็บ PU/PD ท้องป่อง และก้าวร้าวขึ้น"
                ]
              }
            ]
          },
          {
            "sub": "การวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "อาการทางคลินิกในรายที่เป็นมาก",
                  "ผลแล็บ: **hyperglycemia, hyperinsulinemia, hypertriglyceridemia และ fecal egg count สูง**",
                  "**Basal ACTH โดยแปลผลเทียบกับค่าตัดตามฤดูกาล**",
                  "**TRH stimulation test เมื่อผลก้ำกึ่ง**"
                ]
              }
            ]
          },
          {
            "sub": "การรักษาและการพยากรณ์โรค",
            "body": [
              {
                "bullets": [
                  "**Pergolide (Prascend) เริ่มที่ 2 ug/kg กินวันละครั้ง ปรับเพิ่มได้ถึง 6 ถึง 10 ug/kg ถ้าจำเป็น**",
                  "เพิ่ม cyproheptadine ถ้าตอบสนองไม่ดี",
                  "ติดตาม ACTH และระดับน้ำตาล ปรับอาหารตาม body condition และสถานะ insulin",
                  "การดูแลประคับประคอง: คุมการติดเชื้อ ดูแลฟัน แต่งกีบ และควบคุมพยาธิ",
                  "**จัดการ laminitis ซึ่งมักต้องอาศัยช่างตีเกือกที่ชำนาญ**",
                  "**การรักษาช่วยคุณภาพชีวิต แต่อาจไม่ยืดอายุขัย** ถ้าตอบสนองไม่ดี laminitis คุมไม่ได้ หรือติดเชื้อซ้ำ ๆ ให้พิจารณาการุณยฆาต ผู้จดสรุปว่าไม่ค่อยหาย ส่วนมากเสียชีวิตก่อน"
                ]
              }
            ]
          },
          {
            "callout": "PPID เป็นโรคต่อมไร้ท่อ ไม่ใช่เนื้องอกผิวหนัง แต่ในชุดหัวข้อของ VetMock ยังไม่มีหัวข้อด้านต่อมไร้ท่อหรือผิวหนังโดยตรง จึงจัดไว้ในหัวข้อ tumor series เพราะพยาธิสภาพต้นทางคือ hyperplasia หรือ adenoma ของ pars intermedia",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "equine-respi": {
    "topic": "equine-respi",
    "title": "ระบบหายใจในม้า (Equine respiratory diseases)",
    "icon": "🫁",
    "summary": "สรุปจากสไลด์ Equine respiratory diseases ที่รุ่นพี่ Vet 85 จดกำกับไว้ ครอบคลุมอาการนำ การตรวจร่างกาย (auscultation กับ percussion) การส่องกล้องและการเก็บตัวอย่าง (TTW, BAL) sinusitis และตารางแยกสาเหตุ head shaking",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "อาการนำของปัญหาระบบหายใจ (Sign of respiratory problems)",
        "source": "Ekwai Med น.5",
        "body": [
          {
            "text": "สไลด์วางลำดับหัวข้อไว้เป็น sign of respiratory problems ตามด้วย equine respiratory examination แล้วจึงแยกเป็น upper และ lower respiratory problems"
          },
          {
            "bullets": [
              "Dyspnea และ abnormal breathing pattern",
              "Coughing, sneezing",
              "Nasal discharge",
              "Bleeding from nose (เขียนกำกับว่า epistaxis)",
              "Heave line คือแนวเส้นตามขอบล่างของช่องท้อง โน้ตกำกับว่าเกิดจากหายใจจนกล้ามเนื้อขึ้นเป็นแนว",
              "Poor performance ซึ่งโน้ตระบุว่าสำคัญในม้ากีฬา"
            ]
          },
          {
            "callout": "**ม้าเป็น obligate nasal breather** คือหายใจได้ทางจมูกทางเดียว ชดเชยด้วยการอ้าปากหายใจไม่ได้ ดังนั้นการอุดตันของทางเดินหายใจส่วนต้นจึงร้ายแรงกว่าในสัตว์เล็กมาก",
            "kind": "tip"
          },
          {
            "text": "โน้ตกำกับเรื่องน้ำที่ออกจากจมูกไว้ว่า **น้ำใส ๆ ออกมาได้จาก nasolacrimal duct** ให้ดูว่าออกทั้งสองข้างหรือข้างเดียว และให้ดูสีของสิ่งที่ออกมาด้วย"
          },
          {
            "callout": "ข้อความบรรทัดนี้เขียนคร่อมอยู่ระหว่างบรรทัด Nasal discharge กับ Bleeding from nose จึงบอกไม่ได้ชัดว่าผู้จดตั้งใจกำกับบรรทัดไหน เนื้อความสอดคล้องกับ nasal discharge มากกว่า",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สมรรถภาพการหายใจขณะออกกำลังกาย (กล่อง Exercise)",
        "source": "Ekwai Med น.5",
        "body": [
          {
            "text": "สไลด์มีกล่อง Exercise แสดงตัวเลขการระบายอากาศของม้าขณะออกกำลังกาย พร้อมโน้ตพิมพ์กำกับไว้"
          },
          {
            "bullets": [
              "อากาศเดินทางจากรูจมูกถึง alveoli ใน **0.25 วินาที** ระยะทางประมาณ 1.5 เมตร",
              "อัตราการไหลของอากาศประมาณ **1,800 ลิตรต่อนาที**",
              "ปริมาตรต่อครั้งประมาณ 15 ลิตร (สไลด์เขียน 15L/time และช่วง 15-18 ลิตรต่อ 0.25 วินาที)",
              "อัตราการหายใจประมาณ 120 ครั้งต่อนาที",
              "ความเร็วของอากาศประมาณ 21.6 กิโลเมตรต่อชั่วโมง"
            ]
          },
          {
            "callout": "ตัวเลขชุดนี้สอดคล้องกันเอง คือ 1,800 ลิตรต่อนาที หารด้วย 120 ครั้งต่อนาที ได้ 15 ลิตรต่อครั้งพอดี ใช้เป็นจุดตรวจสอบความจำได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Poor performance และการเลือกเครื่องมือตรวจตามตำแหน่ง",
        "source": "Ekwai Med น.5",
        "body": [
          {
            "text": "สาเหตุที่พบบ่อยของ poor performance ตามสไลด์มี 3 กลุ่ม เรียงเป็น musculoskeletal problem, respiratory problem และ cardiovascular problem โดยข้อ respiratory ถูกวงกรอบสีแดงเน้นไว้"
          },
          {
            "callout": "โน้ตวงเล็บปีกกาคร่อม respiratory กับ cardiovascular แล้วเขียนว่า **สองระบบนี้เชื่อมโยงกัน** จึงต้องประเมินควบคู่ ไม่แยกคิดทีละระบบ",
            "kind": "tip"
          },
          {
            "sub": "เครื่องมือแยกตามตำแหน่ง",
            "body": [
              {
                "bullets": [
                  "Upper respiratory tract ใช้ radiograph, endoscope, sinus centesis, MRI หรือ CT",
                  "Lower respiratory tract ใช้ TTW, BAL, endoscope, ultrasound, thoracocentesis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การตรวจร่างกาย: auscultation และ percussion",
        "source": "Ekwai Med น.5",
        "body": [
          {
            "text": "สไลด์ให้ลำดับเป็น history taking และ signalment ตามด้วย physical examination แล้วจึงใช้เสียงหายใจระบุตำแหน่งของปัญหา (breathing sound define problem origin)"
          },
          {
            "sub": "การแปลเสียงหายใจตามโน้ตที่จด",
            "body": [
              {
                "bullets": [
                  "**ฟัง tracheal sound ง่ายกว่าฟังปอด** จึงเริ่มที่หลอดลมก่อน",
                  "ถ้ามี obstruction of upper respiratory เสียง turbulence **จะเกิดขึ้นตอนหายใจเข้า**",
                  "ถ้าเสียงดังตอนหายใจออกอาจเป็น lower respiratory โดยผู้จดให้จำเทียบกับเสียงเป่านกหวีด",
                  "ปอดฟังยาก แต่ทำได้ถ้าทำให้ม้าหายใจแรงขึ้น เช่น **เอาถุงคลุมจมูก**",
                  "ฟังตำแหน่งข้าง ๆ กระดูกสันหลัง"
                ]
              }
            ]
          },
          {
            "sub": "Percussion",
            "body": [
              {
                "bullets": [
                  "โน้ตระบุว่า **ทำคู่กับ auscultation** เสมอ",
                  "วิธีที่จดไว้คือ **เอาช้อนวางบนผนังอกแล้วใช้นิ้วเคาะช้อน แล้วฟัง** (หลักการเดียวกับ plessimeter)",
                  "ใน pneumonia ที่มีน้ำในปอด ให้ฟังไล่จากบนลงล่าง **จะได้หาแนว fluid line ได้**"
                ]
              }
            ]
          },
          {
            "text": "ส่วน auscultation สไลด์แบ่งเป็น increase, decrease และ adventitious sounds ส่วนเครื่องมือภาพประกอบด้วย radiograph (โดยเฉพาะ sinus พร้อม technique และ position), ultrasound, CT และ MRI"
          }
        ]
      },
      {
        "heading": "การส่องกล้องและการเก็บตัวอย่างจากทางเดินหายใจ",
        "source": "Ekwai Med น.5",
        "body": [
          {
            "text": "โน้ตกำกับว่า **endoscope ใช้จนเป็นรูทีนในม้า** แยกชื่อเรียกตามตำแหน่งที่ส่อง"
          },
          {
            "bullets": [
              "Rhinoscopy",
              "Sinoscopy",
              "Tracheoscopy",
              "Laryngoscopy",
              "Bronchoscopy"
            ]
          },
          {
            "text": "หัวข้อ respiratory tract cell collection มีโน้ตว่า เมื่อส่องแล้วเห็นความผิดปกติจึงเก็บตัวอย่าง"
          },
          {
            "sub": "TTW เทียบกับ BAL",
            "body": [
              {
                "bullets": [
                  "Transtracheal wash (TTW) โน้ตว่า **ส่งเพาะเชื้อ (culture) ได้ และดู cell ได้บ้าง** ในสุนัขไม่ค่อยทำแต่ในม้าทำบ่อย",
                  "Bronchoalveolar lavage (BAL) โน้ตว่า **เก็บได้เฉพาะจุดที่อยู่ลึก บอกภาวะอักเสบได้ดี โดยดูสัดส่วน neutrophil เป็นหลัก**"
                ]
              }
            ]
          },
          {
            "text": "รายการที่เหลือคือ thoracocentesis และ sinus centesis โดยมีโน้ตกำกับว่า เวลาใส่ chest drain จะเย็บยึดสายแบบ **Chinese finger-trap pattern**"
          },
          {
            "callout": "โน้ตเรื่อง Chinese finger-trap เขียนอยู่บนบรรทัด sinus centesis แต่เนื้อความพูดถึง chest drain ซึ่งเป็นของ thoracocentesis จึงน่าจะเป็นโน้ตที่เขียนล้นบรรทัด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Sinusitis",
        "source": "Ekwai Med น.5",
        "body": [
          {
            "sub": "สาเหตุ",
            "body": [
              {
                "bullets": [
                  "Primary sinusitis เกิดจาก viral, fungus หรือ bacteria โดยมีโน้ตกำกับว่า **ไม่ค่อยเกิด**",
                  "เชื้อแบคทีเรียที่สไลด์ระบุคือ Streptococcus equi equi และ Streptococcus equi zooepidemicus โดยขีดเส้นใต้พร้อมโน้ตว่าเก็บตัวอย่างด้วย **deep nasopharyngeal swab**",
                  "**Secondary sinusitis: tooth root infection** (ไฮไลต์และขีดเส้นใต้ไว้) ตามด้วย trauma, neoplasia และ progressive hematoma",
                  "มีวงเล็บปีกกาชี้กลุ่ม secondary พร้อมเขียนว่า **เจอบ่อยสุด**"
                ]
              }
            ]
          },
          {
            "callout": "ใต้คำว่า neoplasia มีลายมือเขียนกำกับว่า neurofibroma และเหนือกลุ่ม fungus กับ bacteria มีโน้ตว่า เจอได้ในไทย รักษาราว 2 เดือน โน้ตทั้งสองจุดนี้ตำแหน่งลูกศรคาบเกี่ยว จึงระบุไม่ได้แน่ชัดว่ากำกับคำใด บันทึกไว้ตามที่เขียนจริงเท่านั้น",
            "kind": "flag"
          },
          {
            "sub": "อาการทางคลินิก",
            "body": [
              {
                "bullets": [
                  "**Nasal discharge มักเป็นข้างเดียว** โน้ตอธิบายว่าเพราะม้ามี nasal septum แบ่งซ้ายขวาออกจากกัน",
                  "Stertorous breathing",
                  "Epistaxis",
                  "Head shaking โดยโน้ตว่าอาจเกิดจากฟันคมได้ ให้ถามเจ้าของว่าสะบัดหัวตอนไหน และสะบัดตอนขี่หรือไม่",
                  "Facial asymmetry"
                ]
              }
            ]
          },
          {
            "callout": "หลักแยกตำแหน่งที่โน้ตวงเล็บไว้ **ออกข้างเดียวคิดถึง upper respiratory ส่วนออกสองข้างคิดถึง lower** เพราะเห็น mucus ที่มาจาก trachea หรือ lung",
            "kind": "tip"
          },
          {
            "sub": "การวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "Percussion โน้ตว่า **เคาะได้แต่บอกไม่ค่อยดี ต้องมี fluid อยู่เยอะจริง ๆ ถึงจะฟังออก** เทคนิคที่จดคือเอามือยัดปากม้า อีกมือเคาะ จะได้ยินชัดขึ้น",
                  "Radiograph หรือ CT",
                  "Endoscope via sinus trepanation"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แยกสาเหตุ head shaking (ตารางในเอกสาร)",
        "source": "Ekwai Med น.5",
        "body": [
          {
            "text": "เอกสารแนบตาราง 4 คอลัมน์ คือ ประเภท สาเหตุหลัก ลักษณะเฉพาะ และความสัมพันธ์กับการขี่"
          },
          {
            "sub": "Dental-related headshaking",
            "body": [
              {
                "bullets": [
                  "สาเหตุหลัก ฟันคม แผลในปาก และ bit ที่ทำให้เจ็บ",
                  "ลักษณะเฉพาะ สะบัดหัวตอนมีบังเหียน อ้าปาก บางทีมีน้ำลายหรือเลือด",
                  "ความสัมพันธ์กับการขี่ **สะบัดตอนมีแรงกดจากบิตเท่านั้น**"
                ]
              }
            ]
          },
          {
            "sub": "Trigeminal-mediated (neuropathic)",
            "body": [
              {
                "bullets": [
                  "สาเหตุหลัก **เส้นประสาท CN V hyperexcitable**",
                  "ลักษณะเฉพาะ สะบัดหัวแม้ไม่ได้ขี่ มักเกี่ยวกับแสงแดดหรือลม และปัดหน้าแรง ๆ",
                  "ความสัมพันธ์กับการขี่ สะบัดทันทีที่เริ่มเคลื่อนไหวหรืออยู่กลางแจ้ง"
                ]
              }
            ]
          },
          {
            "sub": "กลุ่มอื่น ๆ",
            "body": [
              {
                "bullets": [
                  "สาเหตุหลัก หูติดเชื้อ ไซนัสอักเสบ foreign body และ allergy",
                  "ลักษณะเฉพาะ มี discharge คัน หรือสะบัดหูร่วมด้วย",
                  "ความสัมพันธ์กับการขี่ ขึ้นกับตำแหน่งการอักเสบ"
                ]
              }
            ]
          },
          {
            "callout": "จุดแยกที่ใช้ได้เร็วที่สุดคือ **สะบัดเฉพาะตอนมีบังเหียน เอนไปทางฟัน ส่วนสะบัดแม้ไม่ได้ขี่และแย่ลงกลางแจ้ง เอนไปทาง trigeminal**",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "equine-ophth": {
    "topic": "equine-ophth",
    "title": "จักษุวิทยาในม้า (Equine ophthalmology)",
    "icon": "👁️",
    "summary": "สรุปหัวข้อจักษุวิทยาม้าแบบ bullet ที่รุ่นพี่ Vet 85 เขียนไว้ ตั้งแต่กายวิภาคและการมองเห็น กระจกตาและ keratitis การให้ยาผ่าน subpalpebral lavage ก้อนเนื้อที่ตา ERU ต้อกระจก ต้อหิน ไปจนถึงลักษณะ fundus ปกติของม้า",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "กายวิภาคและการมองเห็นของม้า",
        "source": "Ekwai Med น.6",
        "body": [
          {
            "bullets": [
              "Bony orbit ของม้าเป็นกระดูกปิดวงรอบเบ้าตา",
              "**มองเห็นด้านข้างได้ดี แต่ด้านหน้า binocular vision ไม่ดี** และ depth perception ต่ำ คือมองไม่ลึก",
              "**Large retinal field** ทำให้แม้จอตาเสียหายไปบางส่วนก็ยังคงมองเห็นได้อยู่",
              "**Lens แบนและยืดหดได้ไม่ดี** จึงมองใกล้ ๆ ไม่ชัดแต่มองไกลได้ดี",
              "ขนตามีแค่ด้านบน",
              "เวลาบาดเจ็บที่ตาจะบวมมาก เพราะมี neutrophil มหาศาล"
            ]
          }
        ]
      },
      {
        "heading": "เปลือกตา ท่อน้ำตา และ conjunctiva",
        "source": "Ekwai Med น.6",
        "body": [
          {
            "bullets": [
              "Eyelid laceration ถ้าฉีกแนวตรงจะแก้ยาก **ให้ใช้ figure of 8** ขนาดไหม 4/0 หรือ 5/0",
              "Pigmented conjunctiva เป็นลักษณะที่พบได้",
              "KCS ทำให้เกิด mucopurulent discharge",
              "Dacryocystitis คือท่อน้ำตาอักเสบจากการอุดตัน โน้ตว่า **เจอได้บ่อย**"
            ]
          }
        ]
      },
      {
        "heading": "กระจกตาและ keratitis",
        "source": "Ekwai Med น.6",
        "body": [
          {
            "bullets": [
              "กระจกตาม้าชอบมีปัญหาเพราะ **โค้งและกว้างมาก** ใสแต่มี trigeminal nerve จึงต้องระวังความเจ็บ",
              "กระจกตามีกระบวนการเรียกเซลล์อักเสบแรงมาก ให้ลองทำ corneal scraping มาตรวจ cell",
              "Eosinophilic keratitis มี eosinophil เยอะทำให้อักเสบ **รักษาด้วย CSA (cyclosporin A)**"
            ]
          },
          {
            "callout": "จุดที่ขีดเส้นใต้และโยงลูกศรไว้ในเอกสาร **น้ำตาม้ามี polymorphonuclear cell รวมถึง collagenase และ proteinase จำนวนมาก ย่อยโปรตีนในกระจกตา ทำให้รอยโรครุนแรงกว่าในสัตว์เล็ก** และลูกศรชี้ว่านี่คือที่มาของ melting cornea",
            "kind": "tip"
          },
          {
            "bullets": [
              "**Ulcerative keratomycosis** เจอเชื้อราที่ชั้น descemet membrane การรักษาไม่นิยมยาหยอดเพราะแพง จึงเอายาฉีดมาหยอดแทน",
              "**Infectious keratitis** เกิดจาก Streptococcus, Staphylococcus และ Pseudomonas การอักเสบทำให้เกิด melting cornea ได้",
              "การรักษาต้องใช้ ABO ร่วมกับ **anti-collagenase เช่น NAC และ Na EDTA**",
              "Immune mediated keratitis อาการคือ ตาขุ่น บวมน้ำ ย้อมไม่เจอแผล เพาะเชื้อไม่ขึ้น ถ้าลงไปถึงชั้น endothelial อาจจะต้องเปลี่ยนกระจกตา ใช้ยารักษาไม่ไหว"
            ]
          }
        ]
      },
      {
        "heading": "การให้ยาที่ตาในม้า",
        "source": "Ekwai Med น.6",
        "body": [
          {
            "bullets": [
              "**ม้าหยอดตายาก จึงใช้ subpalpebral lavage (SPL) เพื่อให้ยาผ่านท่อแทน**",
              "Nictitating membrane flap แนะนำให้เย็บ 3rd eyelid กับ upper eyelid เพราะจะฉีกยาก"
            ]
          }
        ]
      },
      {
        "heading": "SCC และก้อนเนื้อที่ตา",
        "source": "Ekwai Med น.6 และ น.4",
        "body": [
          {
            "bullets": [
              "**SCC มักเกิดในม้าสีอ่อนที่เจอแสง UV** มักเกิดที่ conjunctiva มากกว่า cornea",
              "ถ้าติดอยู่กับ 3rd eyelid จะมองไม่เห็นถ้าไม่ปลิ้นออกมา",
              "การรักษา SCC ต้องใช้หลายวิธีร่วมกัน คือตัด จี้ และ adjunctive therapies"
            ]
          },
          {
            "sub": "เคส tumor series จากคาบเรียนเคสจริง (น.4)",
            "body": [
              {
                "bullets": [
                  "ก้อนที่ medial canthus",
                  "ต้องทำ keratectomy ซึ่ง **ต้องวางยาสลบ (general anaesthesia)**",
                  "หลังผ่าตัดใส่ SPL เพื่อ lavage",
                  "วินิจฉัยเบื้องต้นว่าน่าจะเป็น SCC",
                  "หลังผ่า 3 สัปดาห์ ลองย้อมสีกระจกตาและทำคีโม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Uvea และ equine recurrent uveitis (ERU)",
        "source": "Ekwai Med น.6",
        "body": [
          {
            "bullets": [
              "Uvea ประกอบด้วย iris, ciliary body และ choroid",
              "**Iris ด้านบนมี granular iridica หรือ corpora nigra เป็นติ่งสีดำที่ช่วยกันแสงยูวี**",
              "**ERU หรือพระจันทร์ตาบอด** ตาจะขุ่นบวมน้ำสีฟ้า แสดงถึงการอักเสบชั้นลึกจนทำให้ตาบอดได้ **พันธุ์ Appaloosa มีโอกาสเกิดสูงถึง 8 เท่า**",
              "ทำให้เกิด posterior uveitis ซึ่ง **อาจไม่ได้ทำให้ IOP ต่ำเหมือนในสุนัข**",
              "**Posterior synechia คือไอริสมาติดเลนส์ เป็น sign ของโรคนี้**",
              "การรักษาต้องหา underlying cause ใช้ยาแก้อักเสบและยากดภูมิ ทั้งแบบ local และ systemic",
              "เคสที่เจอบ่อยคือมีพยาธิ Setaria อยู่ในตา ต้องแทงแล้วดูดออกมาแล้วเย็บปิด"
            ]
          }
        ]
      },
      {
        "heading": "Lens, cataract และ glaucoma",
        "source": "Ekwai Med น.6",
        "body": [
          {
            "bullets": [
              "Lens ของม้าจะมีสีเหลืองขุ่นไม่ใส เวลาตรวจต้องหยอด tropicamide",
              "Cataract รักษาโดยดูดเลนส์ขุ่นออกแล้วใส่เลนส์เทียม คือ phacoemulsification และ IOL implantation",
              "**เครื่องมือผ่าตัดของม้ามีขนาดใหญ่กว่าสัตว์เล็ก ห้ามใช้แทนกัน**",
              "**Glaucoma เกิดจาก aqueous humor ระบายออกจากมุมตาไม่ได้** ทำให้ IOP สูงจนกด optic disc แล้วตาบอด สาเหตุโน้มนำอื่นคือ ERU อายุมาก และพันธุ์",
              "ใช้ tonometry วัดระดับความดัน",
              "**รอยโรคที่พบคือ descemet streak หรือ Haab striae ซึ่งเป็นรอยร้าวจากความดัน** และ fundus จะไม่มีเส้นเลือดมาเลี้ยง"
            ]
          }
        ]
      },
      {
        "heading": "Retina และ fundus ปกติของม้า",
        "source": "Ekwai Med น.6",
        "body": [
          {
            "bullets": [
              "**Retina ม้ามีเซลล์ rod มากกว่า cone** จึงเห็นแค่สีฟ้าและสีเขียว",
              "เวลาตรวจนิยมใช้ **indirect ophthalmoscopy**",
              "Paurangiotic คือมีเส้นเลือดฝอยที่มาเลี้ยง optic disc",
              "**Fundus พบ dark dot เรียกว่า star of Winslow**",
              "Tapetum ของม้ามีหลายสี",
              "**Chorioretinitis พบรอยโรคแบบ bullet hole เกิดจาก ERU** ถ้าหนักก็เกิด retinal detachment ได้"
            ]
          },
          {
            "callout": "ข้าง ๆ บรรทัด indirect ophthalmoscopy มีลายมือของผู้จดเขียนว่า ในตัวเลือกของข้อสอบปีนั้นเหมือนจะมีแค่ direct ให้เลือก **นี่เป็นข้อสังเกตเฉพาะข้อสอบของรุ่นก่อน ไม่ใช่เนื้อหาวิชา** เนื้อหาที่เอกสารสอนคือนิยมใช้ indirect",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ค่าเฝ้าระวังขณะวางยาสลบม้า (กล่องที่แทรกอยู่หน้าเดียวกัน)",
        "source": "Ekwai Med น.6",
        "body": [
          {
            "text": "หน้านี้มีกล่องค่าอ้างอิงขณะวางยาสลบแทรกอยู่ พร้อมดาวและขีดเส้นใต้เน้นที่บรรทัด PaO2"
          },
          {
            "bullets": [
              "Hemodynamics: **HR 30-45 ครั้งต่อนาที** และ **MBP 70-90 mmHg**",
              "Respiratory: **PaCO2 35 ถึง 55 mmHg** และ **PaO2 50-100 mmHg**"
            ]
          },
          {
            "callout": "กล่องนี้เป็นเนื้อหาวิสัญญี ไม่ใช่จักษุวิทยา แต่ผู้จดวางไว้บนหน้าเดียวกัน จึงเก็บไว้ที่หัวข้อนี้ตามต้นฉบับ ค่าที่บันทึกคือค่าที่เอกสารเขียนไว้ ให้ยึดค่าที่ผู้สอนปีปัจจุบันให้เป็นหลัก",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "equine-poa": {
    "topic": "equine-poa",
    "title": "POA และคาบเคสจริงทางอายุรศาสตร์และศัลยศาสตร์ม้า",
    "icon": "🩺",
    "summary": "บันทึกหลังสอบของรุ่นพี่ Vet 85 เกี่ยวกับสถานี POA (แนวการตอบที่ได้และไม่ได้คะแนน) รวมกับเนื้อหาคาบเรียนแบบเคสจริง ทั้ง post operative care, melanoma, การจัดการโคลิก และเคสก้อนเนื้อ",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "หลักการให้คะแนน POA ที่รุ่นพี่บันทึกไว้",
        "source": "Ekwai Med น.3",
        "body": [
          {
            "text": "ผู้เขียนสรุปเกณฑ์ที่ได้รับฟังหลังสอบไว้ว่า **คะแนนคิดจาก keyword** ถ้าตอบครบทุก keyword จะได้เต็มตามที่กำหนดไว้แต่ละข้อ ถ้าตอบขาดคะแนนก็ลดหลั่นตามที่ขาดไป"
          },
          {
            "callout": "อีกจุดที่บันทึกไว้คือมีข้อโบนัสที่ให้ **0 หรือ 5 คะแนนเท่านั้น ไม่มีคะแนนกลาง** ผู้เขียนจึงเตือนว่าต้องใช้ technical term ให้ครบ",
            "kind": "tip"
          },
          {
            "callout": "ทั้งหมดนี้เป็นบันทึกหลังสอบของรุ่น 85 เกณฑ์และรูปแบบสถานีของแต่ละปีเปลี่ยนได้ ให้ใช้เป็นแนวฝึกคิด ไม่ใช่คำตอบสำเร็จรูปของปีนี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "POA1 ม้าผอม มีจุดเลือดออกที่ vulva mucosa",
        "source": "Ekwai Med น.3",
        "body": [
          {
            "text": "โจทย์ที่บันทึกไว้คือ ม้าตัวผอม มีวัวเลี้ยงรวมอยู่ข้าง ๆ ไม่เคยตรวจโรคก่อนซื้อ และพบจุดเลือดออกที่ vulva mucosa คำถามคือต้องการทำ diagnosis อะไรเพิ่มเติม"
          },
          {
            "sub": "คำตอบที่บันทึกว่าได้คะแนน",
            "body": [
              {
                "bullets": [
                  "CBC",
                  "Blood chemistry",
                  "**Woo's technique** สำหรับดู Trypanosoma",
                  "Buffy coat smear",
                  "**AGID** สำหรับ EIA",
                  "โน้ตกำกับว่าให้ตอบไปให้หมด โดยเฉพาะ Woo และ AGID ต้องมี"
                ]
              }
            ]
          },
          {
            "sub": "คำตอบที่บันทึกว่าไม่ได้คะแนน",
            "body": [
              {
                "bullets": [
                  "PCR, ELISA และ viral isolation ซึ่งมีคนตอบเยอะมาก",
                  "เหตุผลที่บันทึกไว้คือ PCR ไม่ใช่ screening test ที่ดีสำหรับพยาธิหรือปรสิต เพราะ sensitivity สูงแต่ specificity ต่ำ",
                  "และถ้าจะตอบต้องระบุด้วยว่า PCR หรือ ELISA หา antigen อะไร แต่ถึงตอบมาก็ไม่ได้คะแนนอยู่ดี"
                ]
              }
            ]
          },
          {
            "callout": "เหตุผลเรื่อง sensitivity กับ specificity ที่บันทึกไว้นี้เป็นคำอธิบายของผู้ตรวจในปีนั้น ตามหลักทั่วไป test ที่ sensitivity สูงมักเหมาะกับการคัดกรอง ดังนั้นถ้าปีนี้ผู้สอนอธิบายต่างออกไป **ให้ยึดคำอธิบายของผู้สอนปัจจุบัน**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "POA1 ต่อ: การแปลผลเลือดและการอธิบายเจ้าของ",
        "source": "Ekwai Med น.3",
        "body": [
          {
            "text": "ข้อที่ให้แปลผลเลือด ผู้เขียนบันทึกว่า **ต้องตอบเป็น technical term ให้ครบ** ส่วนข้อโบนัสให้อธิบายเจ้าของว่าทำไมผลไม่ตรงกัน"
          },
          {
            "bullets": [
              "คำตอบที่บันทึกว่าถูกคือ **เคยติดเชื้อมาก่อนหน้านี้จึงตรวจเจอ** หรือ **ติดเชื้อจริงแต่ปริมาณเชื้อยังน้อย**",
              "**ห้ามตอบว่าผล lab หรือชุดตรวจผิดพลาด (error)** เพราะจะถูกลบคะแนน"
            ]
          },
          {
            "callout": "เหตุผลที่บันทึกไว้ไม่ใช่เรื่องวิชาการล้วน แต่เป็นเรื่องวิชาชีพ คือ **ไม่ควรพูดกับเจ้าของม้าแบบนั้น เพราะไม่ professional และทำให้ขาดความน่าเชื่อถือ** จุดนี้ใช้ได้กับทุกสถานีที่ให้สื่อสารกับเจ้าของ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "POA2 ม้าขาหลังซ้ายบวม",
        "source": "Ekwai Med น.3",
        "body": [
          {
            "text": "โจทย์มีคลิปให้ดู แต่ในโจทย์เขียนไว้แล้วว่าเจ็บขาหลังซ้าย ผู้เขียนแนะว่าตอบตามที่โจทย์ระบุได้เลย"
          },
          {
            "sub": "ภาพรังสี",
            "body": [
              {
                "bullets": [
                  "ถ่ายที่ fetlock ท่า **AP, Lateral, DMPLO และ DLPMO**"
                ]
              }
            ]
          },
          {
            "sub": "อัลตราซาวด์",
            "body": [
              {
                "bullets": [
                  "ตำแหน่งที่ให้คะแนนคือ **3C และ 3D** ใครตอบเหนือสองตำแหน่งนี้มา 1-2 ตำแหน่งด้วยก็ได้เต็ม",
                  "ตอบแค่ช่วงตำแหน่ง fetlock ก็รับได้",
                  "แต่ถ้า **ตอบกระจาย เช่น 1A, 2A, 3C หรือติ๊กหมดทุกข้อ จะไม่ได้คะแนน** เพราะอยู่คนละตำแหน่งกันเลย"
                ]
              }
            ]
          },
          {
            "sub": "คำวินิจฉัย",
            "body": [
              {
                "bullets": [
                  "คำตอบคือ **fracture of lateral proximal sesamoid bone**",
                  "ใครตอบว่า medial หรือตอบแค่ sesamoid ก็ยังได้คะแนน",
                  "**คนไปตอบเรื่อง ligament เยอะมาก เพราะภาพอัลตราซาวด์หลอกตา**"
                ]
              }
            ]
          },
          {
            "text": "ส่วน POA3 ผู้เขียนบันทึกสั้น ๆ ว่าทำกันได้เยอะ ไม่ค่อยมีปัญหา"
          }
        ]
      },
      {
        "heading": "คาบเคสจริง: แนวการทำงานที่ผู้สอนเน้น",
        "source": "Ekwai Med น.4",
        "body": [
          {
            "bullets": [
              "**แยกให้ได้ว่าเคสไหนฉุกเฉินและไม่ฉุกเฉิน แล้วแก้อย่างไร**",
              "ถามคำถาม ทำ physical examination และ history taking",
              "ลิสต์ปัญหาแล้วจึงเลือกว่าจะใช้วิธีไหนวินิจฉัย",
              "เน้นความคิด มุมมอง และวิธีทำงานกับเคสจริง มากกว่าท่องเนื้อหา",
              "รูปแบบสอบเป็น line buffet clinical exam",
              "หัวข้อที่ยกมาคือ angular bone deformity และ bone sequestrum ซึ่งต้องผ่าเอาเศษกระดูกออก"
            ]
          }
        ]
      },
      {
        "heading": "Post operative care (NSAID, ABO) จากเคสจริง",
        "source": "Ekwai Med น.4",
        "body": [
          {
            "text": "เคสที่เล่าคือม้าอุจจาระแดง ปวดท้องเกร็ง และถูกปฏิเสธการลงแข่ง ลำดับการไล่หาสาเหตุที่บันทึกไว้เป็นดังนี้"
          },
          {
            "bullets": [
              "ส่องกล้องดู GI ulcer และวัด GI transit time ผลปกติหมด",
              "ก่อนวันแข่งทำทุกอย่างให้คลีนและเคลียร์ แต่ยังปวดอีกและ HR สูง จึงโดนปฏิเสธ แต่พอให้ยาแก้ปวดก็หายดี",
              "**สรุปว่าไม่น่าใช่ GI จึงไปตรวจ reproductive tract แทน**",
              "**ผลคือเจอการติดเชื้อราในมดลูก จึงตัดมดลูกกับรังไข่ออก**",
              "ภาวะแทรกซ้อนที่เกิดได้คือ GI insufficiency และ disturbance"
            ]
          },
          {
            "callout": "บทเรียนของเคสนี้คือ **อาการที่ดูเหมือน GI ในม้าอาจมาจากระบบสืบพันธุ์** เมื่อการตรวจ GI ปกติหมดแต่อาการยังอยู่ ต้องขยายขอบเขตการตรวจ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "เคสตัดก้อน melanoma",
        "source": "Ekwai Med น.4",
        "body": [
          {
            "bullets": [
              "ประเมินโดยวัดดูว่ามีกี่เม็ดและอยู่กี่ตำแหน่ง",
              "ลักษณะที่พบคือ multiple small perineal mass",
              "**Differential diagnosis คือ sarcoid หรือ melanoma เพราะเป็นก้อนแข็งเหมือนกัน**",
              "Biopsy ดู cell แล้วมีลักษณะเหมือน melanoma",
              "**ม้าสีเทา (grey) เป็นพันธุ์ที่ predispose**",
              "Final diagnosis จาก histopathology พบ melanocytoma ร่วมกับอัลตราซาวด์ rectum",
              "ทำ epidural drug ด้วย xylazine ร่วมกับ lidocaine",
              "แผลที่หน้าท้องหายใน 14 วัน ส่วนแผลที่หางรักษาแบบเปิด",
              "**มีวัคซีน melanoma ด้วย**"
            ]
          }
        ]
      },
      {
        "heading": "การจัดการที่เหมาะสมสำหรับปัญหาโคลิกในม้า",
        "source": "Ekwai Med น.4",
        "body": [
          {
            "bullets": [
              "เน้นรักษามุ่งเป้า",
              "**ให้ยาแก้ปวดแค่เข็มเดียว ไม่งั้นไตระเบิด**",
              "ยาซึมให้ถ้าม้าดื้อ เพราะมีฤทธิ์กด GI",
              "**ทำ NG intubation เพื่อล้างกระเพาะและกรอกยา**",
              "เอาสิ่งที่ได้มาดูว่าเป็นอะไร คืออาหารค้าง (content) หรืออาหารจากลำไส้เล็กย้อนขึ้นมา (reflux ingesta)",
              "ให้สารน้ำ อดอาหาร และให้ออกกำลังกาย"
            ]
          },
          {
            "callout": "เกณฑ์ส่งผ่าตัดที่เน้นด้วยหมึกสีแดงในเอกสาร ถ้ายังปวดอยู่ให้ดู clinical signs สองอย่างคือ **ท้องกาง และไม่ตอบสนองต่อยาแก้ปวด** สองข้อนี้บ่งว่ามีความเสี่ยงที่ต้องผ่าตัดสูงมาก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "เคสก้อนขนาดเท่าลูกเชอร์รี่ข้างแก้ม",
        "source": "Ekwai Med น.4",
        "body": [
          {
            "bullets": [
              "ขนาดประมาณ 1 คูณ 1 คูณ 1 นิ้ว",
              "เลือกทำ histopathology โดยเก็บตัวอย่างด้วยการวางยาแล้วเอาก้อนออกเลย"
            ]
          }
        ]
      },
      {
        "heading": "หัวข้อที่รุ่นก่อนเจอในข้อสอบแล้วบันทึกไว้",
        "source": "Ekwai Med น.2 และ น.4",
        "body": [
          {
            "text": "ส่วนนี้เป็นบันทึกความจำหลังสอบ ไม่ใช่เนื้อหาที่เอกสารสอนไว้ จึงเก็บเป็นแนวหัวข้อให้เตรียมตัว ไม่ใช่คำตอบ"
          },
          {
            "bullets": [
              "สถานี POA ของรุ่นก่อนมี 3 ข้อ แบ่งเป็นด้าน infectious, lameness และ respiratory",
              "ข้อ respiratory ให้ประวัติ อาการ ผลตรวจเลือดที่ปกติ และคลิปส่อง endoscope ซึ่งผู้เขียนระบุว่าดูไม่ออก",
              "ชุดเคสสูติกรรมที่บันทึกไว้ คือ ม้าคลอดลูกไม่ออกและเห็นขาโผล่ ถามแผนการรักษา ตามด้วยม้าตัวเดิมที่กระวนกระวายและมองท้อง ถาม differential diagnosis กับแผนรักษา และภาพช่องคลอดที่ผู้เขียนสงสัยว่าเป็น rectovaginal fistula พร้อมถามเรื่อง pre และ post operative care",
              "ข้อสอบจักษุวิทยาของปีนั้นมี 10 ข้อ และเป็นโจทย์ภาษาอังกฤษ",
              "ส่วนวิสัญญีในเอกสารมีการเน้นเรื่อง epidural nerve block"
            ]
          },
          {
            "callout": "รูปแบบการสอบของปีนั้นคือ ข้อสอบเด้งลิงก์มาทีละข้อ ทำให้กะเวลาไม่ได้ และรอบไฟนอลใช้แอปล็อกหน้าจอบน iPad ส่วนรอบมิดเทอมเป็นฟอร์มออนไลน์ในเบราว์เซอร์ **เรื่องนี้เป็นบริบทของปีก่อน ปีนี้อาจเปลี่ยนได้ทั้งหมด**",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "equine-nutrition": {
    "topic": "equine-nutrition",
    "title": "โภชนาการม้า",
    "icon": "📘",
    "summary": "บล็อกโภชนาการยาวของเด็ค ตั้งแต่โครงสร้างทางเดินอาหารที่กำหนดหลักการให้อาหาร hindgut acidosis ความต้องการน้ำและพลังงาน ขีดจำกัดของ starch โปรตีนและกรดอะมิโน การประเมินด้วย TES และ BCS แร่ธาตุและอิเล็กโทรไลต์ ไปจนถึงการจัดการ forage และการคำนวณ DDM DMI RFV",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ทางเดินอาหารม้ากับหลักการให้อาหาร",
        "source": "Equine Med 85 น.8",
        "body": [
          {
            "bullets": [
              "เมื่อก่อนม้ากินทีละน้อยแต่ **grazing ตลอดเวลา** เดินไปเรื่อยและอยู่เป็นฝูง ปัจจุบันเป็น **grain based กินเป็นมื้อ** อยู่แยกคอก และรูปแบบการออกกำลังกายเปลี่ยนไป",
              "ม้าเลี้ยงในคอกยืนมาก กินน้อยลง เมื่อเทียบกับม้าที่ปล่อยในทุ่งหญ้า",
              "**ฟันสำคัญมากในการบดเคี้ยวหญ้า** ม้าเป็น grazer ที่วิวัฒนาการมาเพื่อกินก้มพื้น แต่ปัจจุบันกินท่าเงยหน้าขึ้นทำให้การเรียงตัวของฟันเปลี่ยนไป",
              "**Cecum + large intestine หมักไฟเบอร์ (hindgut fermenter) สร้างพลังงานได้ถึง 70%**",
              "**Hindgut คิดเป็น 60% ของปริมาตรทางเดินอาหาร** ดูดซึม VFA เป็นหลัก",
              "Microbiome ของม้าเลี้ยงหลากหลายน้อยกว่าม้าในธรรมชาติ",
              "**Cecum คิดเป็น 16% ของปริมาตร ยาว 1-1.5 เมตร อาหารหมักอยู่ 7 ชั่วโมงถึง 1 วัน**",
              "**ประชากรจุลชีพใช้เวลา 2-3 วันในการปรับตัวกับอาหารชนิดใหม่** แม้จะเป็นหญ้าคนละล็อตก็ตาม",
              "Ventral colon มีลักษณะ sacculated แบ่งเป็นส่วนๆ",
              "**Stomach เล็ก คิดเป็นราว 10% ความจุ 8-15 ลิตร และแทบไม่เคยว่าง**",
              "**Gastric emptying time ประมาณ 15 นาที ถึง 12 ชั่วโมง** แล้วแต่ชนิดอาหาร",
              "ในมื้อเล็ก อาหาร low starch จะออกจากกระเพาะเร็วกว่า แต่ในมื้อใหญ่ อาหาร high starch จะออกไปในปริมาณที่มากกว่าและเร็วกว่าเมื่อคิดเป็น g/min",
              "**Small intestine คิดเป็น 30% ย่อยได้ทุกอย่างยกเว้นไฟเบอร์ ยาว 15-25 เมตร อาหารอยู่ในนั้น 2-3 ชั่วโมง**"
            ]
          },
          {
            "sub": "ลำดับความสำคัญของอาหาร",
            "body": [
              {
                "text": "**Forage (หญ้า) เป็นอาหารหลัก** รองลงมาคือ grain & mixture และสุดท้ายคือ supplement ซึ่งควรให้น้อยมาก ต้องรู้ก่อนว่าในหญ้าขาดอะไรแล้วค่อยเติม **ไม่ใช่ให้อาหารเม็ดเป็นหลัก**"
              }
            ]
          },
          {
            "sub": "การย่อยได้ของธัญพืชตามวิธีแปรรูป",
            "body": [
              {
                "bullets": [
                  "Oats whole 83.5% / Oats rolled 85%",
                  "Barley rolled 21.5%",
                  "**Corn whole 29% / cracked 30% / flour หรือ grinding 45% / flakes หรือ micronized 90%**"
                ]
              },
              {
                "callout": "แนวโน้มที่ควรจำคือ **ยิ่งแปรรูปละเอียดยิ่งย่อยได้มากขึ้น** โดยเฉพาะข้าวโพดที่ต่างกันจาก 29% เป็น 90%",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Hindgut acidosis",
        "source": "Equine Med 85 น.8",
        "body": [
          {
            "bullets": [
              "**เป็นปัญหาที่พบบ่อยเมื่อม้ากิน starch เยอะ**",
              "แบคทีเรียกลุ่มที่ผลิต lactate เพิ่มขึ้น",
              "**แบคทีเรียแกรมลบตายแล้วปล่อย endotoxin ไปทั่วร่างกาย นำไปสู่ laminitis, colic และ ulcer**",
              "การให้อาหารมื้อใหญ่ห่างกันแค่ 2 มื้อ ทำให้อาหารเข้า cecum ชนกันจน **colonic fermentation cycle ถูกรบกวน** ม้าจะท้องเสียตอนกลางวัน",
              "**ดังนั้นควรให้หญ้าและอาหารหยาบบ่อยๆ ตลอดวันจะดีกว่า**"
            ]
          }
        ]
      },
      {
        "heading": "น้ำและพฤติกรรมการกิน",
        "source": "Equine Med 85 น.8",
        "body": [
          {
            "bullets": [
              "**หญ้า 1 กก. ม้าเคี้ยวเกือบ 3,500 ครั้ง** ทำให้ได้น้ำลายมาก เมื่อเทียบกับอาหารเม็ด",
              "**การเคี้ยว → น้ำลาย → pH 8-9 → ทำหน้าที่เป็น buffer**",
              "**Water requirement 41-67 ml/kg BW**",
              "น้ำส่วนใหญ่ในร่างกายอยู่ใน lumen ของ GI tract",
              "เนื้อเยื่อที่มีน้ำมาก เรียงลำดับคือ ปอด > เลือด > สมอง > กระดูก",
              "ปัจจัยที่มีผลต่อการกินน้ำ ได้แก่ ชนิดของ forage, การให้อาหารเม็ดปริมาณมาก, สภาพอากาศ, อุณหภูมิน้ำ (ราว 20 องศา) และการตั้งท้อง (**75-100 ml/kg BW**)",
              "**ม้าชอบกินน้ำจากถังมากกว่าก๊อกอัตโนมัติ** และม้าที่มีปัญหา colic แนะนำให้กินจากถังเพราะวัดปริมาณได้"
            ]
          },
          {
            "sub": "สัดส่วนพฤติกรรมในหนึ่งวัน",
            "body": [
              {
                "text": "กราฟวงกลมในเด็คแสดงพฤติกรรม 4 กลุ่มคือ eat, stand, lie และ other โดย **eat กินสัดส่วนมากที่สุดราว 60%** ซึ่งบ่งชี้ถึงการเลี้ยงแบบ grazing หรือ free access และ **lie อยู่ราว 5-15% ซึ่งค่อนข้างคงที่**"
              },
              {
                "callout": "ตัวเลขที่เขียนกำกับด้วยลายมือข้างกราฟ (stand 25%, other 30%) รวมกับ eat 60% แล้วเกิน 100% และไม่ตรงกับตัวเลขบนกราฟที่พิมพ์ไว้ จึงไม่ถูกนำมาสรุปเป็นข้อเท็จจริงที่นี่",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "ความต้องการพลังงาน (Energy requirement)",
        "source": "Equine Med 85 น.8-9",
        "body": [
          {
            "bullets": [
              "**ม้าน้ำหนัก 500 กก. ต้องการพลังงานประมาณ 17,000 kcal หรือ 17 Mcal ต่อวัน**",
              "ปัจจัยที่ส่งผลต่อ digestible energy ได้แก่ **BW, metabolism และ activity**",
              "**DE (Mcal/day) = BW (kg) x 0.0333 + ส่วนเพิ่มตาม activity**",
              "นอกจาก activity แล้วยังต้องปรับตาม **age, growth, lactation และ pregnancy**"
            ]
          },
          {
            "sub": "ตาราง DE ตามระดับงาน (คิดที่ม้า 450 กก.)",
            "body": [
              {
                "bullets": [
                  "Maintenance ไม่ทำงาน: 450 x 0.0333 → ประมาณ 15-18 Mcal/วัน ขึ้นกับ metabolism",
                  "Moderate 3-5 ชม./สัปดาห์: คูณตัวประกอบ 1.40 → ประมาณ 23 Mcal/วัน",
                  "Heavy 4-5 ชม./สัปดาห์: คูณตัวประกอบ 1.7 → ประมาณ 25 Mcal/วัน",
                  "Very heavy 6-12 ชม./สัปดาห์: คูณตัวประกอบ 1.90 → ประมาณ 31 Mcal/วัน"
                ]
              },
              {
                "callout": "ตัวเลขในตารางที่เด็คคัดมาไม่ลงตัวเป๊ะกับการคูณตรงๆ (เช่น 450 x 0.0333 x 1.40 ได้ราว 21 ไม่ใช่ 23) ให้จำโครงสร้างของสูตรและลำดับของตัวคูณตามระดับงาน แล้วยึดตารางที่อาจารย์แจกในห้องสอบ",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ความต้องการของแม่ม้าตั้งท้องและให้นม (NRC table 5-5)",
            "body": [
              {
                "bullets": [
                  "Digestible energy: early gestation 15-19 Mcal / last trimester 17-22 Mcal / **lactation 26-32 Mcal**",
                  "Crude protein: early gestation 600-760 g / last trimester 750-1000 g / **lactation 1300-1700 g**"
                ]
              },
              {
                "callout": "รุ่นพี่ทำเครื่องหมายไว้ว่าถูกถามว่า **ม้าวัยไหนต้องการโปรตีนสูงที่สุด** ซึ่งจากตารางนี้คือช่วงให้นม",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "คาร์โบไฮเดรตและขีดจำกัดของ starch",
        "source": "Equine Med 85 น.9",
        "body": [
          {
            "bullets": [
              "**NSC = starch + sugar**",
              "**Lignin เป็นตัวขัดขวางการย่อยและการดูดซึม**",
              "ในม้าน้ำหนัก 500 กก. **ไม่ควรให้เกิน 2 g starch/kg BW/day หรือ 1 g starch/kg BW/meal** ถ้าเกินจะเพิ่มความเสี่ยงของ gastric squamous lesion **2 เท่า**"
            ]
          },
          {
            "sub": "ขีดจำกัด starch แยกตามความเสี่ยง",
            "body": [
              {
                "bullets": [
                  "**Starch overload ใน hindgut: < 2 g starch/kg BW/meal**",
                  "**Gastric ulcer syndrome: < 1 g starch/kg BW/meal**",
                  "**Metabolic disease เช่น insulin resistance: < 0.3 g starch/kg BW/meal**"
                ]
              }
            ]
          },
          {
            "sub": "ปริมาณ starch ในวัตถุดิบ (ต่อ 1 กก.)",
            "body": [
              {
                "bullets": [
                  "**Corn 702 g** ซึ่งสูงที่สุด",
                  "Oat 444 g",
                  "Rice bran 222 g",
                  "**Soybean meal 17.6 g** และ **sugar beet pulp 11.1 g** ซึ่งต่ำมาก"
                ]
              },
              {
                "text": "ตาราง % starch เฉลี่ยที่เด็คคัดมา เรียงจากมากไปน้อย ได้แก่ corn 70.2, wheat 62.1, barley 54.9, rice bran 22.2, wheat bran 21.9, corn gluten meal 15.5, distillers grains 5.42, carrots 3.19, linseed meal 2.85, citrus pulp 2.08, soybean meal 1.76, soybean hulls 1.44, sugar beet pulp 1.11 และ molasses 0.94"
              }
            ]
          }
        ]
      },
      {
        "heading": "ไขมันและโปรตีน",
        "source": "Equine Med 85 น.9",
        "body": [
          {
            "sub": "Fat / oil",
            "body": [
              {
                "bullets": [
                  "**Digestibility 85-100% ที่ small intestine**",
                  "**ม้าแก่ที่ฟันไม่ดีให้เสริม fat ได้** โดยลด starch แล้วเพิ่ม fat เป็นแหล่งพลังงานแทน",
                  "**การให้ vegetable oil ไม่ได้ช่วยลดการเกิด colic** เพราะย่อยหมดตั้งแต่ที่ลำไส้เล็ก",
                  "**ม้าไม่มีถุงน้ำดี แต่หลั่งน้ำดีได้ตลอดเวลา**",
                  "ม้ามี omega 3 และ 6 ที่สร้างเองไม่ได้ แต่ยังไม่ทราบปริมาณที่ต้องการแน่ชัด"
                ]
              }
            ]
          },
          {
            "sub": "Protein",
            "body": [
              {
                "bullets": [
                  "**บอกไม่ได้จาก % โปรตีนในอาหารอย่างเดียว ต้องดูปริมาณที่ให้ด้วย** จึงคิดเป็น total crude protein (g/day)",
                  "**Lysine = limiting amino acid**",
                  "**Creatine ไม่มีผล เพราะม้าดูดซึมไม่ได้**",
                  "สัดส่วนกรดอะมิโนในเนื้อเยื่อ: ขน 95%, ผนังกีบ 95%, เอ็น 93%, ผิวหนัง 90%, กล้ามเนื้อ 73%, กระดูก 30%",
                  "หน้าที่ของกรดอะมิโนตามภาพ: **lysine เพื่อ growth**, methionine กับ threonine เพื่อการซ่อมแซมและคุณภาพกีบและขน, branch chain AA (isoleucine, leucine, valine) เพื่อ performance"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างการคำนวณโปรตีน (ม้าโตเต็มวัย 500 กก. ต้องการ 630-700 g/วัน)",
            "body": [
              {
                "bullets": [
                  "หญ้าแห้ง 10 กก. ที่โปรตีน 8% = 800 g",
                  "**Alfalfa 8 กก. ที่โปรตีน 15% = 1200 g ซึ่งเกินความต้องการ**",
                  "หญ้า 6 กก. ที่ 8% + อาหาร 2 กก. ที่ 12% = 480 + 240 = 720 g",
                  "หญ้า 7 กก. ที่ 8% + balancer 500 g ที่ 30% = 560 + 150 = 710 g"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Topline Evaluation Scoring (TES) และ BCS",
        "source": "Equine Med 85 น.10",
        "body": [
          {
            "sub": "TES",
            "body": [
              {
                "bullets": [
                  "**บริเวณที่ประเมินคือ withers, back และ loin**",
                  "กล้ามเนื้อจะพัฒนาได้ถึงแค่ genetic potential ของม้าตัวนั้น",
                  "**A หรือ 3** กล้ามเนื้อพัฒนาเต็มที่ แข็งแรง เห็นสัดส่วนชัดเจน ไม่เห็นแนวกระดูกสันหลัง",
                  "**B หรือ 2** พัฒนาพอสมควร แต่ยุบลงบริเวณข้าง withers และหลัง",
                  "**C หรือ 1** พัฒนาน้อย ยุบตั้งแต่ withers ตลอดแนวหลัง กระดูกสันหลังสูงกว่ากล้ามเนื้อข้างเคียง",
                  "**D หรือ 0** กล้ามเนื้อฝ่อลีบชัดเจนทั้ง topline และสะโพก มักพบในม้าที่ป่วยหรือขาดสารอาหารรุนแรง"
                ]
              }
            ]
          },
          {
            "sub": "BCS (สเกล 1-9)",
            "body": [
              {
                "bullets": [
                  "**3 = ผอม เห็นซี่โครงและ hip bone ชัด**",
                  "**5 = กำลังดี เห็นซี่โครงได้บ้างตอนหายใจ และคลำแล้วต้องเจอ**",
                  "**7 = เริ่มอ้วน คลำซี่โครงได้ยาก มีไขมันสะสมจนบางทีดูเหมือนกล้ามเนื้อหลัง**"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุของ topline ที่ไม่ดี",
            "body": [
              {
                "bullets": [
                  "อาหาร: โปรตีนต่ำหรือแคลอรีต่ำ",
                  "โรค: **Cushing's (PPID), insulin resistance, metabolic syndrome**",
                  "ความเจ็บปวด: สภาพร่างกายไม่ดี อานไม่พอดี ขาเจ็บ",
                  "**การดูแลฟันไม่ดี**",
                  "**ปรสิต**",
                  "**แผลในกระเพาะ**",
                  "การไม่ได้ออกกำลังกาย"
                ]
              },
              {
                "callout": "รุ่นพี่ทำเครื่องหมายไว้ว่า TES และ BCS ถูกถามว่า **ใช้ประเมินอะไร และบอกได้ไหมว่าม้าขาดสารอาหารอะไร** ประเด็นสำคัญคือ **BCS ประเมินไขมัน ส่วน TES ประเมินกล้ามเนื้อ จึงต้องดูคู่กัน**",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "แร่ธาตุและอิเล็กโทรไลต์",
        "source": "Equine Med 85 น.10",
        "body": [
          {
            "bullets": [
              "**Macro minerals (คิดเป็น g/day):** calcium, phosphorus, sodium, chloride, potassium, magnesium, sulfur",
              "**Micro minerals (คิดเป็น mg/day):** copper, zinc, iron, manganese, iodine, selenium",
              "**สัดส่วน Ca:P ที่เหมาะสมคือ 1-2 : 1**",
              "**รำข้าวมี P สูงมาก** ถ้าใช้จนสัดส่วน Ca:P เสียสมดุลจะเกิดภาวะพาราไทรอยด์ทุติยภูมิจากอาหาร ทำให้เกิด **big head หรือม้าหน้าโป**",
              "**เหงื่อ 1 ลิตรมีอิเล็กโทรไลต์ประมาณ 10 กรัม**",
              "ตอนออกกำลังกายม้าอาจหลั่งเหงื่อ 10-12 ลิตร/ชั่วโมง และสูงได้ถึง 30 ลิตร/ชั่วโมง จึงต้องการ **Na และ Cl มากกว่าที่ได้จากอาหารปกติ**",
              "**Heat stress index = T - (0.55 - 0.0055 x RH) x (T - 14.5)** ใช้ทำนายว่าม้าจะทนอากาศร้อนได้แค่ไหน เพื่อป้องกัน heat stress และ heat stroke",
              "**อิเล็กโทรไลต์แบบผงกระตุ้นให้ม้าอยากกินน้ำ** และแตกตัวได้ดีเมื่อกินพร้อมน้ำ",
              "**ไม่แนะนำอิเล็กโทรไลต์แบบ paste เพราะอาจทำให้ภาวะขาดน้ำแย่ลง**"
            ]
          },
          {
            "callout": "เด็คพิมพ์ชื่อภาวะที่เกิดจาก Ca:P เสียสมดุลว่า hypoparathyroidism แต่กลไกที่บรรยายไว้ (P สูงเกิน แล้วเกิด big head) ตรงกับชื่อที่ตำรามาตรฐานใช้คือ nutritional secondary **hyper**parathyroidism ให้ยืนยันกับสไลด์ของปีนี้ก่อนตอบด้วยชื่อเต็ม",
            "kind": "warn"
          },
          {
            "sub": "ประเด็นในลูกม้าและม้าไทย",
            "body": [
              {
                "bullets": [
                  "**นมวัวหรือนมแพะทดแทนนมม้าไม่ได้** เพราะลูกม้าโตเร็วมากจนสารอาหารและแร่ธาตุไม่พอ",
                  "ช่วงแรกลูกม้ามี lactase จึงย่อยได้แต่น้ำนม ถ้าลูกม้ากินหญ้าตามแม่เร็วเกินไปจะท้องเสียได้",
                  "**ม้าในไทยมักขาด Cu และ Zn** เพราะหญ้าที่ใช้เป็นอาหารหลักมีไม่พอ",
                  "**Cu และ Zn จำเป็นต่อ cartilage formation, การเปลี่ยน cartilage เป็นกระดูก และความยืดหยุ่นของเอ็น**",
                  "สารอาหารที่ได้รับน้อยกว่าค่า NRC เรื้อรัง ร่วมกับลูกม้าที่โตเร็ว อาจนำไปสู่ **DOD (developmental orthopedic disease)**",
                  "แม่ม้าบางตัวส่งผ่านแร่ธาตุทางน้ำนมได้น้อย จึงต้องเสริมที่ลูกม้าโดยตรง",
                  "**การเสริมได้ผลเมื่อเริ่มตั้งแต่เล็ก ถ้ารอจนม้าอายุ 2 ปีแล้วจะแทบไม่ช่วยอะไร**"
                ]
              },
              {
                "callout": "บรรทัดที่ระบุอายุลูกม้าที่น้ำหนักเพิ่มเป็น 2 เท่า เขียนด้วยลายมือและอ่านได้ไม่ชัดว่าเป็นสัปดาห์หรือเดือน จึงสรุปไว้เพียงว่าลูกม้าโตเร็วมาก",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "วิตามิน",
        "source": "Equine Med 85 น.11",
        "body": [
          {
            "bullets": [
              "**Vitamin C และ D ม้าสังเคราะห์ได้เอง**",
              "**Vitamin K และ B ได้จาก microbes ในทางเดินอาหาร**",
              "**การเสริม biotin เพื่อคุณภาพกีบต้องใช้เวลาราว 6 เดือนจึงเห็นผล** และอย่าลืมว่ากีบส่วนใหญ่ประกอบด้วยกรดอะมิโน"
            ]
          }
        ]
      },
      {
        "heading": "Forage การจัดการแปลงหญ้า และ concentrate",
        "source": "Equine Med 85 น.11",
        "body": [
          {
            "sub": "Forage",
            "body": [
              {
                "bullets": [
                  "**ขั้นต่ำคือ 1% ของน้ำหนักตัว (คิดเป็น 50% ของอาหารทั้งหมด) แต่ที่ดีกว่าคือ 1.5-2% (70-90% ของอาหาร)**",
                  "การย้ายม้าจากหญ้าแห้งไปปล่อยแปลง **ถือเป็นการเปลี่ยนอาหาร** ซึ่งจุลชีพต้องใช้เวลาปรับ 2-3 วัน",
                  "**วิธีปรับคือ วันแรกปล่อยวันละ 15 นาที แล้วเพิ่มวันละ 15 นาที ครบ 20 วันจะได้วันละ 5 ชั่วโมง หลังจากนั้นจึงปล่อยได้ตลอด**",
                  "**หญ้าตอนบ่ายมีน้ำตาลสูงมากเพราะสังเคราะห์แสงมาทั้งวัน** ปล่อยม้าไปกินตอนนั้นอาจทำให้ท้องเสีย"
                ]
              }
            ]
          },
          {
            "sub": "Forage alternative และ balancer",
            "body": [
              {
                "bullets": [
                  "ถ้า forage ให้พลังงานไม่พอ **อย่าเพิ่งไปเพิ่ม concentrate ให้ลอง forage alternative ที่ไฟเบอร์สูงก่อน** เช่น beet pulp, soybean hulls และ complete feed ที่กินแทนหญ้าได้",
                  "**Balancer เป็นอาหารเสริม ไม่ใช่อาหารหลัก ม้ายังต้องกินหญ้าด้วย**"
                ]
              }
            ]
          },
          {
            "sub": "Concentrates",
            "body": [
              {
                "bullets": [
                  "การเสริมน้ำมัน **เริ่มวันแรกที่ 30 ml (270 kcal) แล้วเพิ่มวันละ 15 ml**",
                  "**น้ำมัน 330 ml ให้พลังงานทดแทนข้าวโอ๊ต 1 กก. ได้**",
                  "**Horses do not have a requirement for cereal grains**"
                ]
              }
            ]
          },
          {
            "sub": "หลักการ formulation ของอาหารม้าสำเร็จรูป",
            "body": [
              {
                "bullets": [
                  "**Fixed formula** สูตรตายตัว เหมาะกับม้าที่ sensitive **แต่แพงกว่า**",
                  "**Least cost formula** เหมาะกับม้าปกติ ประหยัด ราคาคงที่",
                  "**ทั้งสองแบบมี guaranteed analysis จึงได้สารอาหารครบเท่ากัน**"
                ]
              },
              {
                "callout": "รุ่นพี่กำกับไว้ว่าหัวข้อนี้ออกสอบมาก",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "Dried hay",
            "body": [
              {
                "bullets": [
                  "การเก็บหญ้ามีผลต่อ nutrient loss โดยเฉพาะ **protein, vitamin A และ vitamin E**",
                  "**ถ้าให้หญ้าแห้งจึงควรเสริม vitamin A และ E เพราะม้าสังเคราะห์เองไม่ได้**",
                  "**เก็บที่ความชื้นเกิน 20% จะบูดและขึ้นราแน่นอน**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การประเมินคุณภาพอาหารหยาบ DDM DMI และ RFV",
        "source": "Equine Med 85 น.11",
        "body": [
          {
            "bullets": [
              "**Relative Feed Value (RFV) คือค่าดัชนีมาตรฐานที่ใช้ประเมินคุณภาพของอาหารหยาบ** เช่น หญ้าแห้ง",
              "**Cellulose digestibility ขึ้นกับสัดส่วนของ lignin** หญ้าแก่ลำต้นตรงจะมี lignin เยอะ",
              "**Lignin ม้าย่อยไม่ได้ และยิ่งมีมาก การย่อย cellulose ยิ่งลดลง**"
            ]
          },
          {
            "sub": "สูตรทั้งสาม",
            "body": [
              {
                "bullets": [
                  "**1. DDM (%) = 88.9 - (0.779 x ADF%)** โดยค่า ADF ได้จากผลวิเคราะห์อาหารหยาบ",
                  "**2. DMI (%BW) = 120 / NDF%** โดยค่า NDF ได้จากผลวิเคราะห์อาหารหยาบ หน่วยเป็น % ของน้ำหนักตัว",
                  "**3. RFV = (DDM x DMI) / 1.29** โดย 1.29 เป็นค่าคงที่ที่ปรับสเกลให้ RFV ประมาณ 100 เท่ากับคุณภาพหญ้าแห้ง alfalfa มาตรฐาน"
                ]
              },
              {
                "callout": "จุดที่มักสับสนคือ **ADF เข้าสูตร DDM ส่วน NDF เข้าสูตร DMI** จำสลับกันเมื่อไหร่คำตอบผิดทั้งข้อ",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Balancing the diet",
        "source": "Equine Med 85 น.11",
        "body": [
          {
            "bullets": [
              "**เริ่มจาก forage ก่อนเสมอ และชั่งน้ำหนักก่อนให้ (weight not volume)**",
              "เช็กว่าต้องเสริมอะไรเพิ่ม ทั้งพลังงาน โปรตีน และวิตามิน",
              "**ประเมิน muscle กับ fat แยกกัน โดยใช้ BCS ร่วมกับ topline**",
              "หลีกเลี่ยง supplement ที่เกินความจำเป็น"
            ]
          }
        ]
      }
    ]
  },
  "equine-gi": {
    "topic": "equine-gi",
    "title": "กายวิภาคและระบบทางเดินอาหารม้า",
    "icon": "📘",
    "summary": "กายวิภาคทางเดินอาหารตั้งแต่หลอดอาหารที่ทำให้ม้าอาเจียนไม่ได้ กระเพาะสองส่วนที่แบ่งด้วย margo plicatus ลำดับการเรียงตัวของ colon จุดฟัง gut sound ทั้งสี่ตำแหน่ง เทคนิคการสอด nasogastric tube และปิดท้ายด้วย choke กับ equine gastric ulcer syndrome",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "กายวิภาคทางเดินอาหารม้า",
        "source": "Equine Med 85 น.16",
        "body": [
          {
            "callout": "**GI คือ shock organ ของม้า** เป็นประโยคเปิดของบทนี้และเป็นเหตุผลว่าทำไมโรคทางเดินอาหารในม้าถึงกลายเป็นภาวะฉุกเฉินได้เร็ว",
            "kind": "tip"
          },
          {
            "bullets": [
              "ม้าเป็น **colon fermenter** และ cecum ก็ใหญ่",
              "**อวัยวะฝั่งซ้าย:** ตับ กระเพาะอาหาร ม้าม ไต ลำไส้เล็ก และ colon เล็กน้อย",
              "**อวัยวะฝั่งขวา:** ตับ cecum และ colon เป็นส่วนใหญ่",
              "**น้ำลายทำหน้าที่ lubricate และ buffer มาจาก 4 ต่อม คือ parotid, sublingual, mandibular และ dorsal buccal**",
              "**หลอดอาหารยาวมาก การบีบตัวเป็นแบบทางเดียว (1 way)** ด้วยเหตุผล 2 ข้อคือ **มุมที่ต่อกับกระเพาะแหลมมาก** และ **LES หรือ cardiac sphincter แข็งแรงมาก** ทำให้ **ม้าอาเจียนไม่ได้**"
            ]
          }
        ]
      },
      {
        "heading": "กระเพาะอาหาร",
        "source": "Equine Med 85 น.16",
        "body": [
          {
            "bullets": [
              "**แบ่งเป็น 2 ส่วนด้วย margo plicatus**",
              "**1. Non-glandular: เป็น squamous cell บางๆ**",
              "**2. Glandular: สร้างกรด และมีเมือกคลุม**",
              "ในกระเพาะมีจุลชีพอยู่บ้างแต่ไม่มาก",
              "**Pyloric region เป็นตำแหน่งที่พบความผิดปกติได้**"
            ]
          }
        ]
      },
      {
        "heading": "ลำไส้และลำดับการเรียงตัวของ colon",
        "source": "Equine Med 85 น.16",
        "body": [
          {
            "bullets": [
              "**Small intestine ยาว 15-25 เมตร**",
              "**ม้าไม่มีถุงน้ำดี น้ำดีเข้าลำไส้เล็กผ่าน major orifice โดยตรง**",
              "**Cecum ใหญ่มาก จุได้ถึง 30 ลิตร อยู่ด้านขวาเป็นหลัก แบ่งเป็น 3 ส่วนคือ base, body, apex**",
              "**Ileocecal fold/mesentery เป็นเยื่อบางๆ ที่ใช้ระบุตำแหน่งของ ileum ได้**",
              "**Colon แบ่งเป็น 4 ส่วนคือ RVC, LVC, RDC, LDC** ทำหน้าที่หมักไฟเบอร์และดูดซึมน้ำกับแร่ธาตุ"
            ]
          },
          {
            "sub": "ลำดับการเรียงตัว",
            "body": [
              {
                "text": "**cecum → RVC → sternal flexure → LVC → pelvic flexure → LDC → diaphragmatic flexure → RDC → small colon (transverse colon → descending colon) → rectum**"
              },
              {
                "callout": "จุดที่จำง่ายคือ **ventral colon ไล่จากขวาไปซ้าย ส่วน dorsal colon ไล่กลับจากซ้ายไปขวา** โดยมี pelvic flexure เป็นจุดพลิก ซึ่งเป็นตำแหน่งที่เกิด impaction บ่อย",
                "kind": "tip"
              }
            ]
          },
          {
            "callout": "ตัวเลขความยาวลำไส้เล็กที่พิมพ์ไว้ในหน้ากายวิภาค (\"1-25-5 m\") พิมพ์ผิด จึงยึดตามค่าที่เด็คเขียนไว้ในบทโภชนาการคือ 15-25 เมตร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Gut sound 4 ตำแหน่ง",
        "source": "Equine Med 85 น.16",
        "body": [
          {
            "bullets": [
              "**ซ้ายบน = small intestine**",
              "**ซ้ายล่าง = left colon แต่แยกไม่ได้ว่าเป็น LVC หรือ LDC**",
              "**ขวาบน = base of cecum และ RDC**",
              "**ขวาล่าง = body of cecum และ RVC**"
            ]
          },
          {
            "sub": "Normal gut sound ต้องมีทั้งสองแบบ",
            "body": [
              {
                "bullets": [
                  "**Short sound เสียงค่อกแค่ก 5 ครั้งต่อ 5 นาที**",
                  "**Long sound เสียงคล้ายชักโครก 1-2 ครั้งต่อ 5 นาที**"
                ]
              },
              {
                "callout": "จำนวน short sound ในหน้านี้ (5 ครั้ง/5 นาที) ไม่ตรงกับหน้าการตรวจร่างกายทั่วไปของเด็คเดียวกัน (3-4 ครั้ง/5 นาที) ให้ยึดตัวเลขจากเลกเชอร์ปีนี้ ส่วนที่ตรงกันทุกหน้าและน่าจะเป็นสาระสำคัญคือ **ต้องมีทั้ง short และ long sound และ long sound พบน้อยกว่ามาก**",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "Nasogastric intubation",
        "source": "Equine Med 85 น.16-17",
        "body": [
          {
            "sub": "ใช้ประเมินอะไร",
            "body": [
              {
                "bullets": [
                  "**Gastric emptying time 4-6 ชั่วโมง** โดยดูดคอนเทนต์ออกแล้วกลับมาดูอีกรอบ",
                  "**Gastric content**",
                  "**Gastric reflux ซึ่งเป็น small intestinal content**"
                ]
              },
              {
                "callout": "ค่า gastric emptying time ในบทนี้ (4-6 ชม.) ต่างจากบทโภชนาการที่เขียนว่า 15 นาทีถึง 12 ชั่วโมงแล้วแต่ชนิดอาหาร ทั้งสองค่าอยู่ในเด็คเดียวกัน ให้ยืนยันกับเลกเชอร์ปีนี้",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "เทคนิค",
            "body": [
              {
                "bullets": [
                  "อุปกรณ์: ท่อ ถัง ปั๊ม กรวย พาราฟินออยล์ และขัน",
                  "**วัดความยาวท่อโดยวัดจากซี่โครงที่ 9-12 ซึ่งเป็นตำแหน่งกระเพาะ ไล่ขึ้นมาถึงจมูก** ท่ออาจยาวถึง 2 เมตร",
                  "**Lubricate ปลายท่อก่อน และสอดท่อไปทางด้าน ventral และ medial**",
                  "กดหน้าม้าลง ใส่ท่อแล้วดัน **ถ้าม้ากลืนตามให้ดันต่อจนสุด แต่ถ้าเข้าหลอดลมม้าจะไอ**",
                  "เป่าท่อตอนสอดเพื่อให้หลอดอาหารพองออก เพราะปกติจะแฟบไม่กางออก",
                  "ยืนยันตำแหน่งด้วยการดม เป่า หรือดูดออกมา",
                  "ถ้าดูดไม่ออกเพราะคอนเทนต์มากเกินไป สามารถอัดน้ำเข้าไปแล้วดูดออกมา",
                  "**ใส่น้ำเข้าไปเท่าไหร่ต้องดูดออกมาเท่าเดิม จึงต้องรู้ปริมาณน้ำที่ใส่** (กระเพาะจุประมาณ 8-15 ลิตร)",
                  "**ตอนดึงท่อออก ให้ม้วนปลายสายแล้วหักท่อ และกดหน้าม้าลง** เพราะน้ำที่ถูกดึงขึ้นมาอาจไหลเข้าหลอดลม",
                  "**ห้ามสอดท่อค้างไว้ในตัวม้าเด็ดขาด อันตรายมาก**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Choke",
        "source": "Equine Med 85 น.19",
        "body": [
          {
            "bullets": [
              "**มักติดตรงส่วนต้นของหลอดอาหาร** จะพบคอนเทนต์ไหลออกมาทางจมูก หรือทดสอบโดยลองให้ม้ากินน้ำ",
              "**สาเหตุ: เคี้ยวไม่ละเอียด ดื่มน้ำน้อย และกินหญ้าแห้ง**",
              "**Tx: ใช้ NG tube ดันลงไป**"
            ]
          }
        ]
      },
      {
        "heading": "Equine Gastric Ulcer Syndrome (EGUS)",
        "source": "Equine Med 85 น.19",
        "body": [
          {
            "sub": "ESGD: ulcer ที่ squamous region",
            "body": [
              {
                "bullets": [
                  "**Risk factor: ให้อาหารที่เป็นกรด อดอาหาร ความเครียด และม้าที่วิ่งนานๆ โดยไม่ได้พักกินอาหาร**",
                  "**กรดไปโดนตรง squamous region ซึ่งไม่มีเมือกคลุม**",
                  "**Sign: ไม่กินอาหาร กินน้ำแล้วแสบ เตะท้อง กินลม กัดแทะคอก**",
                  "**Grade 0 = ปกติ**",
                  "**Grade 1 = hyperkeratosis ล้างแล้วไม่หลุด**",
                  "**Grade 2 และ 3 = เกิด ulcer เยื่อบุแหว่ง**",
                  "**Grade 4 = deep ulceration**"
                ]
              }
            ]
          },
          {
            "sub": "EGGD: ulcer ที่ glandular region",
            "body": [
              {
                "text": "**พบไม่บ่อยเท่า และมักเกิดจากหลายสาเหตุร่วมกัน** เด็คระบุให้ไปอ่านรายละเอียดเพิ่มเติมเอง"
              }
            ]
          },
          {
            "sub": "Diagnosis และ treatment",
            "body": [
              {
                "bullets": [
                  "**Dx: gastroscope โดยฉีดน้ำล้างก่อน**",
                  "**Tx: acid suppression ด้วย omeprazole ร่วมกับการจัดการ**",
                  "**อาจให้ม้ากิน alfalfa เพื่อให้เคี้ยวเยอะและมีน้ำลายไปเป็น buffer**",
                  "**สุดท้ายการจัดการน้ำ อาหาร พฤติกรรม และการออกกำลังกาย คือปัจจัยสำคัญในการป้องกัน colic**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "equine-colic-bestfit": {
    "topic": "equine-colic-bestfit",
    "title": "Colic: การประเมินและการจัดการ",
    "icon": "📘",
    "summary": "แนวทางเคส colic ตั้งแต่สาเหตุและ predisposing factor อาการและ vital signs การใช้ blood lactate และ ultrasound เป็นตัวพยากรณ์โรค การแปลผล NG tube การให้คะแนน composite colic score เพื่อตัดสินใจว่าจะรักษาต่อหรือผ่าตัด ยาที่เลือกใช้ และ colic แต่ละชนิดที่พบบ่อย",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "สาเหตุและ predisposing factors",
        "source": "Equine Med 85 น.17",
        "body": [
          {
            "bullets": [
              "**1. จากทางเดินอาหารเอง (gastro-intestinal tract)**",
              "**2. Referred pain** จากตับ ไต กระเพาะปัสสาวะ กระดูก และระบบสืบพันธุ์ เช่น การตกไข่ มดลูกบิด การเป็นสัด การตั้งท้อง การคลอด รวมถึงโรคติดเชื้ออย่างบาดทะยักและเรบีส์",
              "**Predisposing factors: อาหาร น้ำ ปรสิต การกินทรายหรือกินลม ปัญหาฟัน การใช้ NSAID สิ่งแปลกปลอม อายุมาก และความเครียด**",
              "**เป็นภาวะฉุกเฉิน ต้องรีบวินิจฉัยและรักษา**"
            ]
          },
          {
            "sub": "Signs",
            "body": [
              {
                "text": "มองท้อง **pawing (ขาคุ้ยเขี่ย)** ยืดท้อง หายใจเร็ว เหงื่อออกเยอะ เตะท้อง ล้มนอน กลิ้ง ซึ่งอันตรายมากเพราะ **กระเพาะแตกและลำไส้บิดได้**"
              }
            ]
          },
          {
            "sub": "การซักประวัติต้องละเอียด",
            "body": [
              {
                "text": "กินอะไรมา ไปไหนมา ไปทำอะไรมา เจ็บแค่ไหน และได้รับยาอะไรมาก่อนหรือไม่"
              }
            ]
          }
        ]
      },
      {
        "heading": "Vital signs ในเคส colic",
        "source": "Equine Med 85 น.17",
        "body": [
          {
            "bullets": [
              "**HR 30-45, RR 12-36**",
              "**Temp 99-101.5 F**",
              "**MM สีชมพู CRT < 2 วินาที**",
              "ประเมิน gut sound และ dehydration status ร่วมด้วย"
            ]
          },
          {
            "callout": "ค่าชุดนี้ต่างจากค่า vital sign ที่เด็คเขียนไว้ในบทตรวจร่างกายทั่วไป (HR 28-44, RR 12-16) ให้ยึดค่าจากเลกเชอร์ปีนี้ ส่วนสิ่งที่ใช้ได้แน่คือ **HR และ RR ใช้ประเมินระดับความเจ็บปวดและเป็นองค์ประกอบหนึ่งของ composite colic score**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Blood lactate และ ultrasound",
        "source": "Equine Med 85 น.17",
        "body": [
          {
            "sub": "Blood lactate",
            "body": [
              {
                "bullets": [
                  "**ใช้พยากรณ์โรคได้** อวัยวะที่ผลิต lactate เมื่อเกิดการอักเสบหรือ sepsis คือ **ตับ กล้ามเนื้อ ปอด และทางเดินอาหาร**",
                  "**การเจาะ peritoneal fluid ให้ค่าแม่นยำกว่าการเจาะเลือด**",
                  "**ม้าปกติ < 1 mmol/L**",
                  "**ม้าโพนี่ไทยที่ 2.2-3 mmol/L ยังถือว่าไม่เป็นไร** เพราะค่าขึ้นกับชนิดของม้า"
                ]
              }
            ]
          },
          {
            "sub": "Ultrasound",
            "body": [
              {
                "bullets": [
                  "**ใช้ FLASH protocol ซาวน์ 6 ตำแหน่ง**",
                  "**ม้าเกิด diaphragmatic hernia ได้ จึงต้องซาวน์ cranial ventral thorax ด้วย**",
                  "**Spleen อยู่ติดไตซ้าย** และ spleen ต้องติดกับกระเพาะ ตับ และลำไส้เล็ก",
                  "**Rectal palpation ต้องอาศัยประสบการณ์ ใช้ดู displacement ของอวัยวะช่วงท้ายได้**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การแปลผล NG tube ในการวินิจฉัย colic",
        "source": "Equine Med 85 น.18",
        "body": [
          {
            "callout": "รุ่นพี่กำกับไว้ว่าหัวข้อนี้ออกสอบเยอะ",
            "kind": "tip"
          },
          {
            "bullets": [
              "**คอนเทนต์ในกระเพาะน้อยกว่า 0.5 ลิตร:** อาจยังขาดน้ำ แต่อย่างน้อย **ตัดโรค impaction และ tympany ออกได้** ลองใส่น้ำหรือพาราฟินดูก่อน",
              "**เจอแก๊สร่วมกับคอนเทนต์มากกว่า 0.5 ลิตร:** แสดงว่าเกิดการอุดตัน อาจมีการพันของลำไส้ ลองใส่น้ำชะล้างแล้วดูดออก",
              "**เจอ dry content:** แสดงว่าขาดน้ำ ให้อัดน้ำเข้าไปแล้วดูดออกมาเช่นกัน",
              "**มีน้ำไหลออกมามากกว่า 4 ลิตร เรียกว่า gastric reflux** ซึ่งเป็นการผสมของคอนเทนต์กับเอนไซม์ย่อยอาหาร แสดงว่าอาหารอาจติดอยู่ที่ลำไส้เล็ก **กรณีนี้จะไม่ drenching เพราะไม่ช่วยอะไร ทำแค่ lavage แล้วหาทางวินิจฉัยด้วยวิธีอื่น**"
            ]
          }
        ]
      },
      {
        "heading": "Composite colic score (CCS)",
        "source": "Equine Med 85 น.18",
        "body": [
          {
            "text": "**ใช้ประเมินว่าจะรักษาต่ออย่างไร** โดยดูค่าจากหลายพารามิเตอร์รวมกัน"
          },
          {
            "bullets": [
              "พารามิเตอร์ที่ใช้: **HR, RR, temperature, CRT, gut sound, mucous membrane, lactate, ผล NG tube, rectal palpation, ultrasound, ปริมาณอุจจาระ, การตอบสนองต่อยาลดปวด และท้องกาง**",
              "**ถ้าคะแนนไม่เกิน 14 ให้รักษาด้วยยาอย่างเดียว**",
              "**ถ้าเกิน 14 ต้องผ่าตัด หรือพิจารณาการุณยฆาต**"
            ]
          },
          {
            "callout": "เด็คเตือนไว้เองว่า **อย่าเชื่อคะแนนอย่างเดียว การประเมินจากตัวม้าจริงสำคัญกว่า** เพราะบางเคสคะแนนต่ำแต่ม้าไม่ไหว",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Tx of choice",
        "source": "Equine Med 85 น.18",
        "body": [
          {
            "callout": "รุ่นพี่บันทึกว่า **ไม่ถาม dose แต่อาจต้องจำระยะเวลาออกฤทธิ์**",
            "kind": "tip"
          },
          {
            "bullets": [
              "**Xylazine 0.5 mg ออกฤทธิ์แค่ 30 นาที จึงไม่ปิดบังอาการ ใช้ดีกับ spasmodic colic**",
              "**Flunixin meglumine (NSAID) เป็นยาสามัญประจำม้า 1.1 mg ให้ analgesia นาน 12 ชั่วโมง ลด endotoxemia ได้ดี แต่อาจปิดบังอาการ**",
              "**Phenylbutazone (NSAID) ให้ IV เท่านั้น ห้ามให้ IM เพราะระคายเคือง และห้ามให้ยารั่วออกนอกหลอดเลือด**",
              "**Buscopan / hyoscine เป็น smooth muscle relaxant ใช้ดีกับ spasmodic colic และอาการปวดไม่รุนแรง**",
              "**NG tube ใช้ใส่น้ำและอิเล็กโทรไลต์ลงกระเพาะ**",
              "**IV fluid ต้องระวัง ถ้าให้มากเกินจะเกิด GI edema**",
              "**เมื่อเกิด GI rupture ถือว่าเย็บไม่ทันแล้ว เพราะสิ่งที่รั่วออกมาจะทำให้เกิด peritonitis** จึงเป็นจุดที่พิจารณาการุณยฆาต"
            ]
          },
          {
            "callout": "เด็คใส่วงเล็บ (NSAID) กำกับ Buscopan ไว้ด้วย ซึ่งขัดกับคำอธิบายในบรรทัดเดียวกันที่บอกว่าเป็น smooth muscle relaxant ให้ยึดกลไกที่บรรยายไว้และยืนยันการจัดกลุ่มยากับเลกเชอร์ปีนี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Colic แต่ละชนิดที่เด็คสรุปไว้",
        "source": "Equine Med 85 น.18-19",
        "body": [
          {
            "sub": "Spasmodic colic",
            "body": [
              {
                "text": "**เจอบ่อย เกิดจาก pain from intestinal spasm ระหว่างการ peristalsis** Tx คือ **xylazine และ buscopan**"
              }
            ]
          },
          {
            "sub": "Pelvic flexure impaction",
            "body": [
              {
                "text": "**มักเกิดในม้าที่ไม่ได้เคลื่อนไหว เช่น ขาเจ็บ หรือช่วงฤดูหนาว** Tx คือ **NG ใส่น้ำและพาราฟิน ให้ IV fluid และผ่าตัดถ้าจำเป็น** รุ่นพี่กำกับไว้ว่าออกเป็นเคส"
              }
            ]
          },
          {
            "sub": "Nephrosplenic entrapment",
            "body": [
              {
                "text": "**Colon ขยับขึ้นไปอยู่ในช่องว่างระหว่างไตซ้ายกับม้าม** Dx ด้วย ultrasound จะ **ไม่เห็นม้ามและไต แต่เจอแก๊สใน colon บังอยู่**"
              }
            ]
          },
          {
            "sub": "GI displacement",
            "body": [
              {
                "text": "**ในม้ามักต้องผ่าตัดรักษา**"
              }
            ]
          },
          {
            "sub": "Sand colic",
            "body": [
              {
                "text": "**อาจทำให้อุดตัน เจอบ่อยในไทย** ตรวจเบื้องต้นโดย **เอาอุจจาระไปละลายน้ำแล้วดูทรายที่ตกตะกอน** รุ่นพี่กำกับไว้ว่าออกเป็นเคส"
              }
            ]
          }
        ]
      },
      {
        "heading": "รูปแบบข้อสอบส่วน GI ที่รุ่นพี่บันทึกไว้",
        "source": "Equine Med 85 น.16",
        "body": [
          {
            "callout": "ส่วนนี้เป็นบันทึกของรุ่นพี่ Vet 85 เกี่ยวกับข้อสอบปีก่อน ไม่ใช่เนื้อหาวิชา และรูปแบบข้อสอบเปลี่ยนได้ทุกปี",
            "kind": "warn"
          },
          {
            "bullets": [
              "ส่วน GI มีทั้งข้อกาประมาณ 32 ข้อ และ **ข้อเขียนแบบเคส 5 เคส**",
              "**แต่ละโรคมีคีย์เวิร์ดของตัวเอง** และอาจารย์มีตารางให้ใช้คำนวณ CCS",
              "คำถามในเคสครอบคลุมว่า **เป็นโรคอะไร ต้องรักษาแบบไหน ให้ยาหรือผ่าตัด ให้สารน้ำอย่างไร อะไรเป็น prognostic factors และวิธีป้องกันโรค**",
              "**ทุกอย่างเป็นภาษาอังกฤษ**"
            ]
          }
        ]
      }
    ]
  },
  "equine-dentistry": {
    "topic": "equine-dentistry",
    "title": "ฟันม้า (เนื้อหาในเอกสารนี้มีจำกัด)",
    "icon": "📘",
    "summary": "เอกสารฉบับนี้แทบไม่มีเนื้อหาบรรยายเรื่องฟันม้า มีเพียงรูป dental chart รูปฟิล์มเอกซเรย์ รูปช่องปาก และบันทึกของรุ่นพี่ว่าส่วนฟันออกสอบ 15 ข้อ จึงบันทึกไว้เท่าที่มีจริงพร้อมระบุช่องว่างอย่างตรงไปตรงมา",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "สิ่งที่เอกสารนี้มีและไม่มีเรื่องฟัน",
        "source": "Equine Med 85 น.2, น.3",
        "body": [
          {
            "callout": "**เอกสารนี้ไม่มีเนื้อหาบรรยายเรื่องฟันม้า** หน้าที่เกี่ยวข้องมีเพียงรูป dental chart รูปฟิล์มเอกซเรย์ช่องปาก และรูปฟันที่มีความผิดปกติ โดยไม่มีคำอธิบายประกอบ ให้ไปอ่านจากสไลด์เลกเชอร์เรื่องฟันโดยตรง อย่าใช้เอกสารนี้เป็นแหล่งเดียว",
            "kind": "warn"
          },
          {
            "bullets": [
              "จุดเดียวในเนื้อหาที่โยงถึงฟัน คือการระบุปีเกิดในสมุดประจำตัวม้า **ถ้าไม่ทราบปีเกิดให้ประมาณอายุจากฟัน แล้วกำกับว่า estimated by dental**",
              "เนื้อหาโภชนาการย้ำว่า **ฟันสำคัญมากในการบดเคี้ยวหญ้า** และ **poor dental care เป็นหนึ่งในสาเหตุของ topline ที่ไม่ดี**",
              "การจับบังคับด้วยยาระบุว่า **xylazine เป็นตัวที่นิยมใช้ตอนทำฟัน**"
            ]
          },
          {
            "sub": "รูปแบบข้อสอบส่วนฟันที่รุ่นพี่บันทึกไว้ (ข้อมูลปีก่อน)",
            "body": [
              {
                "bullets": [
                  "ส่วนฟันออกประมาณ **15 ข้อ**",
                  "มีการให้ดู **ฟิล์มเอกซเรย์** แล้วถามว่าม้าตัวนี้มีอะไรน่ากังวลหรือไม่",
                  "มีการให้ **dental chart** แล้วให้บันทึกว่าฟันผิดปกติที่ตำแหน่งใด โดยอ้างอิงระบบ **quadrant 1, 2, 3, 4**",
                  "มีการให้ดูรูปช่องปากแล้วถามความผิดปกติ"
                ]
              },
              {
                "callout": "ระบบหมายเลขฟันและเกณฑ์การประเมินความผิดปกติไม่ได้อยู่ในเอกสารนี้ จึงไม่มีการสรุปรายละเอียดหรือออกคำถามในหัวข้อนี้ เพื่อไม่ให้เกิดข้อมูลที่ไม่มีที่มา",
                "kind": "flag"
              }
            ]
          }
        ]
      }
    ]
  },
  "equine-anesthesia": {
    "topic": "equine-anesthesia",
    "title": "การวางยาม้า: ประเมินความเสี่ยง งดอาหาร field anesthesia และ recovery",
    "icon": "💉",
    "summary": "รวมส่วนที่เกี่ยวกับการวางยาจากทั้งสามชุดสไลด์ ตั้งแต่การซักประวัติหา hidden sign ที่เพิ่มความเสี่ยง การงดอาหารและน้ำ ASA physical status ไปจนถึงการวางยาในสนาม ยาที่ใช้บังคับสัตว์ การ monitor และช่วง recovery ซึ่งเป็นช่วงที่เสี่ยงที่สุด",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "Complete history taking: หา hidden sign ที่เพิ่มความเสี่ยงการวางยา",
        "source": "Equine Sx concept น.5",
        "body": [
          {
            "bullets": [
              "ใช้ประเมินทั้ง elective surgery และ routine surgery",
              "หา **hidden sign ที่เป็นความเสี่ยงต่อการวางยา** ได้แก่",
              "Influenza รวมถึงอาการไอและน้ำมูก",
              "ประวัติ colic episode",
              "**Rhabdomyolysis และ salmonellosis ซึ่งเป็นความเสี่ยงจากการขนส่ง**",
              "**Hyperkalemic periodic paralysis ในม้า Quarter Horse ที่มีกล้ามเนื้อมัดใหญ่**"
            ]
          },
          {
            "callout": "ลายมืออธิบายว่า ต้องระวังการกดทับตอน GA เพราะถ้าม้าเดินทางยืนนาน ๆ จะเป็น rhabdomyolysis มากกว่าเดิม ซึ่งเพิ่มทั้งความเสี่ยงต่อการวางยาและทำให้ recovery ช้า และเสริมว่าประวัติชุดนี้ใช้ประเมิน CCS ได้",
            "kind": "tip"
          },
          {
            "callout": "สไลด์หน้านี้พิมพ์ตกหลายจุด หัวสไลด์เขียนว่า HISTORPY TAKING และบรรทัดสุดท้ายเขียนว่า hyperkalemic periodic paraly of large muscular quarter hors ซึ่งคือ hyperkalemic periodic paralysis (HYPP) ของม้า Quarter Horse",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "งดอาหารและน้ำก่อนผ่าตัด (ชุด hospital-based)",
        "source": "Equine Sx concept น.6",
        "body": [
          {
            "bullets": [
              "**งดอาหารข้นหรือหญ้า 6 ชั่วโมงก่อนผ่าตัด**",
              "ให้ straw bedding หรือ hay ในตอนเช้าได้",
              "**ให้น้ำได้ ad libitum จนถึงเวลาผ่าตัด**",
              "**เคสเปิดช่องท้องใหญ่ (major abdominal operation) งดทั้งอาหารและวัสดุรองนอนที่กินได้นานถึง 72 ชั่วโมงก่อนผ่าตัด**",
              "หลังผ่าตัด เริ่มให้อาหารปริมาณน้อยได้ตั้งแต่ 2 ชั่วโมงหลังผ่าตัด ขึ้นกับชนิดหัตถการ"
            ]
          },
          {
            "sub": "เฉพาะ GI surgery",
            "body": [
              {
                "bullets": [
                  "การประเมินระหว่างผ่าตัดเป็นตัวกำหนดว่าจะเริ่มให้อาหารเมื่อไร",
                  "ใช้ **shaving bedding และ muzzle** เพื่อกันม้าแอบกิน",
                  "**งดทั้งอาหารและน้ำ 12 ถึง 24 ชั่วโมง หรือจนกว่า nasogastric reflux และ postoperative ileus จะทุเลา**"
                ]
              }
            ]
          },
          {
            "callout": "ลายมือให้เหตุผลว่า อดอาหาร 6 ชั่วโมงเพื่อลด secretion ที่จะย้อนกลับขึ้นมา ส่วนเคสท้องใหญ่ให้ค่อย ๆ ลดอาหารภายใน 72 ชั่วโมง และเสริมว่าถ้า colic หนักมากก็ผ่าได้เลย เพราะม้าปวดท้องมันไม่กินอยู่แล้ว",
            "kind": "tip"
          },
          {
            "callout": "ตัวเลขในเอกสารนี้ไม่ตรงกันสองที่ ชุด hospital-based (น.6) บอกงดหญ้า 6 ชั่วโมง แต่ชุด field-based (น.25) บอกงดหญ้าอย่างน้อย 12 ชั่วโมงและอาหารเม็ดอย่างน้อย 24 ชั่วโมง ให้ตอบตามบริบทที่โจทย์ถาม และยืนยันตัวเลขที่อาจารย์ปีนี้ใช้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ASA physical status classification",
        "source": "Equine Sx concept น.9",
        "body": [
          {
            "text": "สไลด์ยกตารางมาเต็ม พร้อมคอลัมน์ตัวอย่าง lab ที่แนะนำและพยากรณ์โรค โดยกรอบสีชมพูเน้นที่แถว class I"
          },
          {
            "sub": "ระดับ I ถึง V",
            "body": [
              {
                "bullets": [
                  "**I** สุขภาพดี ไม่มีโรคทางกาย ตัวอย่างคือหัตถการ elective ที่ไม่จำเป็นต่อสุขภาพ เช่น ovariectomy พยากรณ์โรค excellent",
                  "**II** โรคเฉพาะที่ ไม่มีอาการทางระบบ ตัวอย่างคือแผลฉีกขาดที่ผิวหนัง หรือ simple fracture พยากรณ์โรค good",
                  "**III** โรคทำให้เกิดอาการทางระบบระดับปานกลางจนจำกัดการทำงาน ตัวอย่างคือ heart murmur, anemia, pneumonia, mild chest trauma, moderate dehydration พยากรณ์โรค fair",
                  "**IV** โรคทำให้เกิดอาการทางระบบรุนแรงและคุกคามชีวิต ตัวอย่างคือ gastric torsion, diaphragmatic hernia, severe chest trauma, severe anemia หรือขาดน้ำรุนแรง พยากรณ์โรค guarded",
                  "**V** moribund คาดว่าจะมีชีวิตอยู่ไม่เกิน 24 ชั่วโมงไม่ว่าจะผ่าตัดหรือไม่ ตัวอย่างคือ endotoxic shock, severe trauma, multiorgan failure พยากรณ์โรค grave"
                ]
              }
            ]
          },
          {
            "bullets": [
              "**การเติมตัว E ต่อท้าย class ใดก็ได้ หมายถึง emergency surgery** ซึ่งนิยามว่าถ้าเลื่อนการรักษาออกไปจะเพิ่มภัยคุกคามต่อชีวิตหรืออวัยวะอย่างมีนัยสำคัญ พยากรณ์โรคจึงแปรผัน",
              "เชิงอรรถของตาราง: **minor คือใช้เวลาน้อยกว่า 60 นาที** ส่วน **major คือใช้เวลามากกว่า 60 นาที หรือสัตว์อายุมากกว่า 7 ปี**",
              "Surgical panel ในตารางประกอบด้วย urea, creatinine, ALP, ALT, glucose, sodium, potassium, chloride และ total protein"
            ]
          }
        ]
      },
      {
        "heading": "Field-based surgery คืออะไร และเตรียมสัตว์อย่างไร",
        "source": "Equine Sx concept น.24 และ น.25",
        "body": [
          {
            "text": "นิยามบนสไลด์คือ **การวางยานอกโรงพยาบาล มักอยู่ในพื้นที่ชนบทหรือสถานการณ์ฉุกเฉิน** จำเป็นสำหรับ **minor surgery หรือการวินิจฉัย** เช่น การตอนและการเย็บแผล"
          },
          {
            "sub": "Animal preparation",
            "body": [
              {
                "bullets": [
                  "**NPO: หญ้าอย่างน้อย 12 ชั่วโมง**",
                  "**อาหารเม็ด (pelleted feed) อย่างน้อย 24 ชั่วโมง โดยค่อย ๆ ลดล่วงหน้า 2 สัปดาห์**",
                  "**ไม่จำกัดน้ำ**",
                  "ยอมรับได้ที่จะไม่ NPO ในหัตถการเพื่อการวินิจฉัยหรือเคสฉุกเฉิน",
                  "ตรวจร่างกายให้ครบ: HR, RR, MM, CRT, HS, LS, GS, pulse, temp",
                  "**ประมาณน้ำหนักเพื่อคำนวณยาให้แม่น เช่น ใช้สูตร heart girth**"
                ]
              }
            ]
          },
          {
            "sub": "Site selection",
            "body": [
              {
                "bullets": [
                  "เลือกที่ **เงียบ พื้นราบ สะอาด และปลอดภัย**",
                  "**คำนึงถึงสภาพอากาศ หลีกเลี่ยงความร้อนจัด ฝน หรือลมแรง**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Preoperative preparation ในสนาม: การจัดท่าและอุปกรณ์",
        "source": "Equine Sx concept น.26",
        "body": [
          {
            "sub": "Positioning",
            "body": [
              {
                "bullets": [
                  "Standing anesthesia: **ต้องมี restraint box**",
                  "Generalized anesthesia: ใช้ **padded mat และฟางหรือวัสดุรองนอนที่นุ่ม**",
                  "**Lateral recumbency ดีกว่า**",
                  "**ต้องระวัง respiratory distress**",
                  "**ดึงขาหน้าด้านล่างออกมาข้างหน้า โดยให้อีก 3 ขาตั้งฉากกับลำตัว**",
                  "**เพื่อป้องกัน postanesthetic myositis และ nerve paralysis**",
                  "ห้ามกลิ้งตัวม้า"
                ]
              }
            ]
          },
          {
            "sub": "Equipment checklist",
            "body": [
              {
                "bullets": [
                  "อุปกรณ์บังคับสัตว์ ได้แก่ halter และเชือก",
                  "อุปกรณ์ monitor ได้แก่ **portable pulse oximeter**",
                  "IV catheter, สารน้ำ และชุดให้สารน้ำ",
                  "**ยาฉุกเฉิน: anticholinergic (atropine), dobutamine, dopamine**",
                  "**ผู้ช่วยที่มีประสบการณ์**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pain management",
        "source": "Equine Sx concept น.27",
        "body": [
          {
            "bullets": [
              "ยาต้านการอักเสบกลุ่ม **NSAID**",
              "**Narcotic analgesia: butorphanol, morphine, methadone**",
              "**ให้หลังจากทำให้ซึมแล้วเท่านั้น เพราะถ้าให้เดี่ยว ๆ ม้าจะตื่นเต้น (excited)**"
            ]
          },
          {
            "sub": "Local anesthesia ช่วยอะไร",
            "body": [
              {
                "bullets": [
                  "เสริมการจัดการความปวด",
                  "**ลดการใช้ยาทั้งระบบ**",
                  "เพิ่มความปลอดภัยของสัตว์",
                  "ทำให้หัตถการเล็ก ๆ เช่น การเย็บแผลและการตอน ทำได้สะดวก",
                  "ช่วยให้ recovery ราบรื่นขึ้น ความเครียดและภาวะแทรกซ้อนน้อยลง"
                ]
              }
            ]
          },
          {
            "text": "ภาพผลิตภัณฑ์บนสไลด์แสดงยาที่ใช้จริง ได้แก่ ยากลุ่ม NSAID, butorphanol และ **mepivacaine** สำหรับ local anesthesia"
          },
          {
            "callout": "สไลด์สะกดคำว่า Mehadone ซึ่งคือ methadone",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Restraint: physical และ chemical",
        "source": "Equine Sx concept น.28",
        "body": [
          {
            "sub": "Physical restraint",
            "body": [
              {
                "bullets": [
                  "ม้าบางตัวตื่นเต้นและเครียดก่อนได้ยาซึม",
                  "**ลดการบังคับให้น้อยที่สุดและตระหนักถึงอุบัติเหตุที่อาจเกิด**"
                ]
              }
            ]
          },
          {
            "sub": "Chemical restraint",
            "body": [
              {
                "bullets": [
                  "ใช้ anesthetic agent กลุ่ม **alpha-2 agonist หรือ phenothiazine**",
                  "ลายมือระบุตัวยาไว้ว่า alpha-2 agonist คือ **xylazine และ detomidine** ส่วน phenothiazine คือ **acepromazine (ACPM)**"
                ]
              }
            ]
          },
          {
            "sub": "เลือกตามว่าจะทำท่ายืนหรือวางยาสลบ",
            "body": [
              {
                "bullets": [
                  "**Standing: เน้นควบคุมสมดุลการทรงตัว และใช้ restraint box**",
                  "**Recumbency: ใช้ halter ที่พอดีและเชือกจูง พร้อมผู้ช่วยที่มีประสบการณ์อยู่ที่หัวม้า**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Monitoring และ safety ในสนาม",
        "source": "Equine Sx concept น.29",
        "body": [
          {
            "sub": "Monitoring essentials",
            "body": [
              {
                "bullets": [
                  "**ความลึกของการวางยา ดูจากตำแหน่งตาและ reflex, muscle tone, การเคลื่อนไหว และรูปแบบการหายใจ**",
                  "**Nystagmus จากฤทธิ์ ketamine เกิดขึ้นได้**",
                  "CVS: HR, rhythm, MM, CRT",
                  "Respiratory: rate, pattern, MM, เปอร์เซ็นต์ oxygen saturation"
                ]
              }
            ]
          },
          {
            "sub": "Safety tips",
            "body": [
              {
                "bullets": [
                  "**เติมยาซ้ำที่ 1/2 หรือ 1/3 ของ dose แรกในการทำ TIVA**",
                  "ใช้ IV catheter เพื่อให้ยาได้เร็ว",
                  "**เตรียมยาฉุกเฉินอย่าง epinephrine และ atropine ให้หยิบได้ทันที**",
                  "**รองพื้นให้นุ่มพอเพื่อป้องกันความเสียหายของเส้นประสาท**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Recovery: ช่วงที่เสี่ยงที่สุดของทั้งกระบวนการ",
        "source": "Equine Sx concept น.23 (โรงพยาบาล) และ น.30 (สนาม)",
        "body": [
          {
            "sub": "Recovery room ในโรงพยาบาล",
            "body": [
              {
                "bullets": [
                  "**เป็นช่วงที่เสี่ยงต่อการบาดเจ็บและการตายสูงที่สุด**",
                  "**จัดท่า lateral recumbency กลางคอก ดึงขาหน้าด้านล่างไปข้างหน้า ปกป้องตา และรองหัวเข็มขัดของ halter**",
                  "Monitor การหายใจและชีพจร โดยเฝ้าดูอย่างต่อเนื่อง",
                  "สภาพแวดล้อมต้องเงียบ แสงสลัว และสงบ",
                  "**นอนตะแคงอย่างน้อย 20 นาที แล้วนอนหมอบ (sternal) อีก 10 ถึง 20 นาทีก่อนลุกยืน**",
                  "ถ้าไม่ขยับเลยภายใน 60 นาที ให้เข้าไปประเมินอย่างนุ่มนวล",
                  "หลังผ่าตัดใหญ่ให้พักนานขึ้น",
                  "การป้องกัน: ใช้แผ่นรองและที่ครอบหัว ช่วยด้วยเชือก sling หรือ hydropool ถ้าจำเป็น"
                ]
              },
              {
                "callout": "ลายมือเตือนว่า ไม่ให้คนอยู่ในห้อง recovery เพราะอันตรายถ้าม้าฟื้นแล้วตื่น วิธีคือทิ้งม้าไว้ในห้องที่ induct เอาเชือกผูกโยงหน้ากับหางไว้เป็นการช่วยพยุง แล้วดูว่ามันจะลุกหรือยัง ถ้ายังไม่มีสติแล้วลุกต้องกดไว้ก่อน ถ้ามันเริ่มลุกจริง ๆ ค่อยออกจากห้องแล้วดูผ่านกล้องแทน",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Recovery ในสนาม",
            "body": [
              {
                "bullets": [
                  "**รอจนม้ามีสติสมบูรณ์และทรงตัวได้เอง**",
                  "**ดูแลหัวให้ปลอดภัย และควบคุมหาง**",
                  "**สำหรับม้าท่านอน ให้ลุกยืนให้จบในครั้งเดียว**",
                  "หลังผ่าตัด: อยู่ในคอกจนมีสติเต็มที่",
                  "**NPO จนกว่าจะมีสติ แล้วจึงให้เฉพาะหญ้าใน 12 ชั่วโมงแรก**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Key takeaways ของ field anesthesia",
        "source": "Equine Sx concept น.31",
        "body": [
          {
            "bullets": [
              "**Field anesthesia จำเป็นต่อการดูแลสัตว์ในพื้นที่ห่างไกล**",
              "**การเตรียมตัวและการเลือกโปรโตคอลให้เหมาะสมคือหัวใจ**",
              "**Local anesthesia เพิ่มความปลอดภัยและลดปริมาณยาสลบที่ต้องใช้**",
              "ยึดความปลอดภัยไว้ก่อน แม้สภาพจะไม่สมบูรณ์แบบ แต่ก็ยังจำเป็นต้องวางยาให้พอเพียง"
            ]
          },
          {
            "callout": "ลายมือเน้นสามจุดบนหน้านี้ คือ monitor สำคัญ ทุกอย่างต้องพร้อม และคุมความ sterile ให้มากที่สุด",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "equine-ortho": {
    "topic": "equine-ortho",
    "title": "การจัดการบาดแผลและการพันขาม้า (wound management และ bandaging)",
    "icon": "🩹",
    "summary": "ชุดสไลด์ Wound Management ทั้งชุด ตั้งแต่ระยะการหายของแผล ความต่างระหว่างม้ากับ pony exuberant granulation tissue ไปจนถึงชนิดของ bandage ทุกแบบ Robert Jones splint stent abdominal และ head bandage ซึ่งเป็นส่วนที่ลายมือรุ่นพี่กำกับว่าออกสอบทุกปี",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ระยะการหายของแผล และเส้นเวลาของม้าโดยเฉพาะ",
        "source": "Equine Sx concept น.33 และ น.34",
        "body": [
          {
            "sub": "สี่ระยะพื้นฐาน",
            "body": [
              {
                "bullets": [
                  "**Hemostasis** ร่างกายหยุดเลือดที่แผล (ลายมือกำกับว่า 4 ชั่วโมงแรก)",
                  "**Inflammation** เม็ดเลือดขาวเข้ามาทำความสะอาดแผล",
                  "**Proliferation** ร่างกายสร้างเนื้อเยื่อผิวหนังใหม่และซ่อมหลอดเลือดที่ขาด",
                  "**Remodeling** แผลปิดสนิท และเซลล์ที่ใช้ซ่อมแซมไม่จำเป็นอีกต่อไป"
                ]
              },
              {
                "callout": "สไลด์แผ่นแรกพิมพ์ระยะแรกว่า Homeostasis แต่กราฟในแผ่นถัดไปเขียนว่า Hemostasis ซึ่งคือคำที่ถูกต้องสำหรับการหยุดเลือด",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "กราฟ stage of wound healing in horse",
            "body": [
              {
                "bullets": [
                  "ลำดับบนกราฟคือ hemostasis แล้ว acute inflammatory phase แล้ว proliferative phase แล้ว remodeling phase",
                  "**Collagen synthesis พุ่งขึ้นราววันที่ 14**",
                  "**Collagen cross-linking ราววันที่ 21**",
                  "**Tensile strength ไต่ขึ้นถึงประมาณ 80 เปอร์เซ็นต์ของความแข็งแรงเดิมเมื่อครบราว 1 ปี**"
                ]
              },
              {
                "callout": "ลายมือชี้จุดที่ต่างจากสัตว์ชนิดอื่น คือ inflammatory phase ของม้านานมาก และ proliferative phase กินเวลาเกือบเดือนกว่า ในขณะที่ species อื่น 3 วันแรกก็มาแล้ว โดยให้เหตุผลว่าอาจเพราะม้าขยับตัวบ่อยและเรื่อง cytokine ต่าง ๆ ส่วนเงื่อนไขที่ทำให้ proliferative phase ขึ้นได้ดีคือ แผลสะอาดไม่มีการติดเชื้อ และมีความชื้นเหมาะสม",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "First-intention healing (primary closure) ม้าเทียบกับ pony",
        "source": "Equine Sx concept น.35 ถึง น.37",
        "body": [
          {
            "bullets": [
              "เลือกใช้เพราะ **หายเร็วและผลลัพธ์ด้านความสวยงามดี**",
              "**Pony สำเร็จสูงกว่า และเกิด bone sequestration น้อยกว่า ทั้งที่แผลลึกกว่าและใช้ยาปฏิชีวนะน้อยกว่า**",
              "**ม้ามีการตอบสนองแบบอักเสบที่ช้ากว่า จึงเสี่ยงติดเชื้อสูงกว่า และ NSAIDs อาจรบกวนการหายของแผล**"
            ]
          },
          {
            "text": "ลายมือบนภาพชุดเคสจริงอธิบายว่า เย็บแผลติดกันได้ ตัวอย่างคือเคสผ่า sarcoid แถวแก้ม ซึ่งวันที่ 8 หลังผ่ามีหนอง แผลแยก ต้องรักษาเป็นแผลเปิด และใช้เวลาราวเดือนครึ่งจึงเข้าที่ ส่วนเคส pony ที่มีแผลตรงข้อ carpus ซึ่งมีความตึงมาก ถ้าเย็บได้และคุม infection ได้มักจะหาย โดย 2 สัปดาห์ก็เกือบหายแล้ว ซึ่งต่างจากม้ามาก"
          }
        ]
      },
      {
        "heading": "Second-intention healing: contraction เทียบกับ epithelialization",
        "source": "Equine Sx concept น.38",
        "body": [
          {
            "bullets": [
              "**Pony หายเร็วกว่าโดยอาศัย wound contraction ส่วนม้าพึ่ง epithelialization มากกว่า**",
              "**แผลที่ขา หายช้ากว่า เกิด exuberant granulation tissue (EGT) มากกว่า และแผลเป็นแย่กว่า**",
              "**ในม้า การหดตัวของแผลขับเคลื่อนโดยการเรียงตัวของ myofibroblast และ TGF-beta แต่การหดตัวเกิดช้าและไม่มีประสิทธิภาพ**"
            ]
          },
          {
            "text": "กราฟเปรียบเทียบพื้นที่แผลใช้ตัวย่อ 4 กลุ่ม โดยลายมือแปลไว้ว่า HMT คือ horse metatarsal และ HB คือ horse body ส่วน PMT และ PB คือของ pony ในตำแหน่งเดียวกัน จะเห็นว่าเส้น HMT (แผลขาของม้า) ลดพื้นที่ช้าที่สุดและยังไม่ปิดที่สัปดาห์ที่ 12"
          },
          {
            "callout": "ลายมือเสริมว่าที่แผลขาแย่กว่า น่าจะเพราะบริเวณนั้นขยับเยอะ และคำว่า limb ในสไลด์หมายถึงขาส่วนปลาย (distal)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Inflammatory response, granulation tissue และ epithelialization",
        "source": "Equine Sx concept น.39 ถึง น.41",
        "body": [
          {
            "sub": "Inflammatory response",
            "body": [
              {
                "bullets": [
                  "**Pony: แรง เร็ว และสงบลงหลัง 3 สัปดาห์ กำจัดแบคทีเรียได้อย่างมีประสิทธิภาพ**",
                  "**ม้า: เริ่มอ่อนแรง แต่คงอยู่เรื้อรัง จึงนำไปสู่การหดตัวที่ช้า การเกิด EGT และ epithelialization ที่ไม่ดี**"
                ]
              },
              {
                "text": "ภาพเปรียบเทียบวันที่ 21 แสดงชัดว่าแผลม้า (H1 LMT) มี overgranulation tissue นูนปูดขึ้นมา ขณะที่แผล pony (P1 LMT) ยังเรียบ"
              }
            ]
          },
          {
            "sub": "Granulation tissue",
            "body": [
              {
                "bullets": [
                  "**ม้า: สร้างเร็ว ไร้ระเบียบ และคงอยู่นาน จนกลายเป็น EGT**",
                  "**Pony: เรียบ เป็นระเบียบ สีชมพูสุขภาพดี และไม่ลุกลาม**"
                ]
              }
            ]
          },
          {
            "sub": "Epithelialization",
            "body": [
              {
                "bullets": [
                  "**Pony: สัมพันธ์ผกผันกับการหดตัว คือหดตัวเร็ว epithelialization จะช้าลง**",
                  "**ม้า: epithelialization มากเกินไป จึงได้แผลเป็นที่เปราะและคุณภาพด้อย**"
                ]
              },
              {
                "text": "ลายมือบนภาพวันที่ 28 ระบุว่าแผลม้าตะปุ่มตะป่ำ เป็น poor quality scar และอาจมีการติดเชื้อร่วมด้วย ส่วน pony ที่ขาเกือบหายแล้ว และวันที่ 63 แผลที่ตัวม้าเพิ่งมี epithelialization ขณะที่ pony ละหายจนแทบไม่เหลือร่องรอย"
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical implications: จะเข้าไปแทรกแซงตอนไหน",
        "source": "Equine Sx concept น.42 และ น.43",
        "body": [
          {
            "bullets": [
              "**ม้า: กระตุ้นการอักเสบในช่วงต้น แล้วจึงยับยั้งเพื่อป้องกัน EGT และต้องใช้ NSAID หรือ corticosteroid อย่างระมัดระวัง**",
              "**Pony: การหายตามธรรมชาติมักเพียงพอ การแทรกแซงส่วนใหญ่เป็นแค่การประคับประคอง**"
            ]
          },
          {
            "callout": "ลายมือขยายคำว่า EGT ว่าคือ overdevelop granulation ซึ่งเป็นเหตุผลว่าทำไมช่วงหลังจึงต้องกดการอักเสบลง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Exuberant granulation tissue (EGT)",
        "source": "Equine Sx concept น.44 และ น.45",
        "body": [
          {
            "text": "นิยาม: **การเจริญของ granulation tissue มากเกินจนสูงพ้นระดับผิวหนังโดยรอบ พบบ่อยที่แผลบริเวณขาส่วนปลาย (distal limb) ของม้า**"
          },
          {
            "sub": "Etiology และปัจจัยโน้มนำ",
            "body": [
              {
                "bullets": [
                  "**แผลที่ขาส่วนปลายซึ่ง epithelialization ล่าช้า**",
                  "การอักเสบเรื้อรังหรือการติดเชื้อ",
                  "**การเคลื่อนไหวและความตึงที่ตำแหน่งแผล**",
                  "เลือดไปเลี้ยงไม่ดี"
                ]
              }
            ]
          },
          {
            "sub": "Clinical appearance",
            "body": [
              {
                "bullets": [
                  "**เนื้อเยื่อสีแดง ชุ่ม และเปราะยุ่ย (friable)**",
                  "**เลือดออกง่าย**",
                  "ขัดขวางการปิดของแผลและทำให้หายช้า"
                ]
              }
            ]
          },
          {
            "sub": "Management",
            "body": [
              {
                "bullets": [
                  "**ตัดออกด้วยการผ่าตัดหรือ sharp debridement**",
                  "**Topical corticosteroid เพื่อลดการอักเสบ**",
                  "**Pressure bandage หรือ splint เพื่อลดการเคลื่อนไหว**",
                  "การรักษาขั้นสูง เช่น hydrocolloid dressing หรือ regenerative therapy"
                ]
              },
              {
                "callout": "ลายมือเสริมประสบการณ์จริงว่า ตอน debride เลือดออกเยอะมาก ถ้าวิธีนี้ไม่ได้ผลให้หยุด infection ก่อน แล้ว epithelialization จะเร็วมาก ส่วน pressure bandage ทำหน้าที่กดการสร้าง granulation tissue และยกตัวอย่าง regenerative therapy ว่าคือ stem cell",
                "kind": "tip"
              }
            ]
          },
          {
            "sub": "ถ้าไม่รักษา",
            "body": [
              {
                "bullets": [
                  "แผลเรื้อรังไม่หาย",
                  "**เสี่ยงต่อการติดเชื้อแทรกซ้อนมากขึ้น**",
                  "เสียทั้งความสวยงามและการใช้งาน"
                ]
              }
            ]
          },
          {
            "text": "ลายมือข้างภาพเคสยังเตือนภาวะอื่นที่มาคู่กันได้ คือ laminitis และ hygroma บริเวณศอกในม้าที่นอนเยอะจนบวมน้ำและแตก ซึ่งผ่าแล้วก็ยังไม่หาย"
          }
        ]
      },
      {
        "heading": "โครงสร้าง bandage สามชั้น",
        "source": "Equine Sx concept น.46",
        "body": [
          {
            "text": "ลายมือเปิดหัวข้อว่า bandage สำคัญมากในม้า เพราะทำหน้าที่ทั้งทำแผลและ support โครงสร้างไปพร้อมกัน"
          },
          {
            "sub": "Contact หรือ primary layer",
            "body": [
              {
                "text": "ชั้นที่สัมผัสแผลโดยตรง ลายมือกำกับว่าใช้แผ่นตาข่ายหรือแผ่นปิดแผลชนิดไม่ติดแผล"
              },
              {
                "callout": "ลายมือเขียนชื่อวัสดุไว้ว่า Mylolin ซึ่งอ่านได้เท่านี้และไม่มีบนสไลด์ จึงไม่ยืนยันชื่อการค้าที่แน่นอน",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "Intermediate หรือ secondary layer",
            "body": [
              {
                "bullets": [
                  "**ยึด dressing ให้อยู่กับที่ ดูดซับ exudate และทำหน้าที่เป็น padding**",
                  "ใช้ roll cotton, sheet cotton หรือสำลีร่วมกับ conforming gauze"
                ]
              },
              {
                "text": "ลายมือย้ำว่าต้องเป็นวัสดุที่ไม่บาดผิว"
              }
            ]
          },
          {
            "sub": "Outer หรือ tertiary layer",
            "body": [
              {
                "bullets": [
                  "**ยึดชั้นกลางไว้กับที่ และป้องกันการปนเปื้อน การกระแทก และการเคลื่อนไหว**",
                  "**ในอุดมคติควรระบายอากาศได้แต่กันน้ำ**",
                  "ใช้เทปพันชนิด adhesive หรือ cohesive (ลายมือระบุ Coband และ adhesive tape)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หลักการพันผ้าที่ขา",
        "source": "Equine Sx concept น.47",
        "body": [
          {
            "bullets": [
              "เลือกชนิด bandage ตาม **ตำแหน่งและลักษณะของการบาดเจ็บ**",
              "**แต่ละรอบที่พันใหม่ต้องซ้อนทับรอบก่อนหน้า 50 เปอร์เซ็นต์**",
              "**พันจาก distal ไปหา proximal**",
              "ที่ขา ส่วน proximal มีเส้นรอบวงใหญ่กว่า ทำให้ **แรงกดใต้ bandage ที่พันสม่ำเสมอจะลดลงเองเมื่อขึ้นไปทาง proximal**",
              "**ต้องเสริม padding ที่บริเวณขาซึ่งแคบกว่า เพื่อให้แรงกดโดยรวมสม่ำเสมอ**"
            ]
          },
          {
            "callout": "ลายมือกำกับหัวข้อนี้ว่าออกสอบ VCA ทุกปี และส่วนมากออกเรื่อง Robert Jones",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ชนิดของ bandage ตามระดับของขา",
        "source": "Equine Sx concept น.48 และ น.49",
        "body": [
          {
            "bullets": [
              "**Foot bandage** พันเฉพาะกีบ",
              "**Half limb bandage: จาก heel bulb ขึ้นไปถึงระดับข้อ carpometacarpal หรือ tarsometatarsal**",
              "**Full limb bandage ขาหน้า: จาก bulb of heel ขึ้นไปถึงระดับข้อศอก (elbow region)**",
              "**Full limb bandage ขาหลัง: จาก bulb of heel ขึ้นไปถึงใต้ข้อ stifle (lower stifle region)**"
            ]
          },
          {
            "callout": "ลายมือกำกับหน้า foot และ half limb bandage ว่าออกสอบ 100 เปอร์เซ็นต์ โดยรูปแบบคำถามคือแผลตรงนี้พันแบบไหน และพันจากไหนถึงไหน ส่วนข้อบ่งใช้ที่เขียนไว้คือ laminitis และแผลที่กีบ",
            "kind": "warn"
          },
          {
            "callout": "สำหรับ full limb ลายมือระบุว่าพัน 3 layers และตรงข้อให้พันข้ามข้อแบบ figure of 8 จะได้ยังขยับข้อได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Carpal และ tarsal bandage",
        "source": "Equine Sx concept น.50 และ น.51",
        "body": [
          {
            "text": "วัตถุประสงค์: **ให้การพยุงและปกป้องบริเวณ carpus หรือ tarsus และข้อข้างเคียง** ใช้บ่อยหลังการบาดเจ็บ หลังผ่าตัด หรือเพื่อควบคุมอาการบวม (ลายมือเสริมว่าใช้กับเข่าที่มีแผล การเจาะข้อ และการฉีดยาเข้าข้อ)"
          },
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "**Start position: พันสำลีและ conforming gauze รอบวงที่ระดับ distal radius หรือ distal tibia**",
                  "**Figure-of-eight loops: พันข้ามข้อ carpus หรือ tarsus เป็นเลขแปด โดยเว้น accessory carpal bone หรือ calcaneal tuberosity ไว้ไม่ให้ถูกคลุม เพื่อเลี่ยงแผลกดทับ**",
                  "**Proximal layers: พันรอบวงต่อไปที่ proximal metacarpus หรือ metatarsus**",
                  "**Tertiary layer: พันเทป adhesive หรือ cohesive รอบวงเป็นชั้นนอก แล้วยึดขอบบนและขอบล่างด้วยเทปยืดหยุ่นชนิดกาว เพื่อยึดกับขนและกันวัสดุรองนอนหรือสิ่งสกปรกเข้าไปข้างใน**"
                ]
              },
              {
                "callout": "ลายมือสรุปหลักการให้จำง่ายว่า พันให้ข้ออยู่ตรงกลางของ bandage",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Robert Jones bandage",
        "source": "Equine Sx concept น.52 และ น.53",
        "body": [
          {
            "text": "นิยาม: **bandage แบบ full-limb ชนิดพิเศษ ออกแบบมาเพื่อให้ความแข็งแรง แรงกด และการปกป้อง สำหรับการบาดเจ็บของเนื้อเยื่ออ่อนที่รุนแรงหรือกระดูกหัก** (ลายมือระบุตำแหน่งที่ใช้คือ humerus, tibia, tendon injury และ fracture)"
          },
          {
            "sub": "Application technique",
            "body": [
              {
                "bullets": [
                  "**Primary layer: วางสำลี (cotton wool) หลายชั้นให้สม่ำเสมอทั่วทั้งขา**",
                  "**แต่ละชั้นต้องหนาน้อยกว่า 2 ซม. และรัดทีละชั้นด้วยเทปยืดหยุ่นชนิดไม่มีกาว**",
                  "**หลีกเลี่ยงการวางชั้นหนา เพราะจะทำให้วัสดุเลื่อนหรืออัดตัวกัน**",
                  "**Tertiary layer: พันเทปยืดหยุ่นชนิดกาวรอบวงให้แน่นทับชั้นสำลี**",
                  "**เมื่อเสร็จแล้วต้องได้ทรงเป็นท่อที่ด้านข้างขนานกัน และหนาประมาณ 3 เท่าของเส้นผ่านศูนย์กลางขา**",
                  "**Optional: ใส่ splint แข็งเสริมไปตามแนว bandage เพื่อเพิ่มความมั่นคงและให้ลงน้ำหนักได้บางส่วนในเคสกระดูกหัก**"
                ]
              }
            ]
          },
          {
            "sub": "Functions และ advantages",
            "body": [
              {
                "bullets": [
                  "ให้การพยุงและแรงกดที่ดีเยี่ยมต่อขาที่บาดเจ็บ",
                  "**ลดอาการบวมของเนื้อเยื่อและลดการเคลื่อนไหว**",
                  "**เมื่อใช้ร่วมกับ splint จะเพิ่มการตรึงและความมั่นคงของกระดูกหัก**"
                ]
              }
            ]
          },
          {
            "sub": "Cautions",
            "body": [
              {
                "bullets": [
                  "**ต้องให้แรงกดสม่ำเสมอ เพื่อเลี่ยงการรบกวนการไหลเวียนเลือด**",
                  "อย่าพันชั้นกาวแน่นเกินไป",
                  "**เฝ้าดูขาส่วนปลายว่ามีบวม ร้อน หรือเลือดไม่ไหลเวียนหรือไม่**"
                ]
              }
            ]
          },
          {
            "callout": "ลายมือกำกับว่า Robert Jones คือหัวข้อที่ออก VCA แทบทุกปี",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Splint bandage",
        "source": "Equine Sx concept น.54 ถึง น.56",
        "body": [
          {
            "bullets": [
              "วัตถุประสงค์: **ให้การพยุงแข็งชั่วคราวเพื่อตรึงกระดูกหักหรือการบาดเจ็บของเนื้อเยื่ออ่อน**",
              "การเลือกขึ้นกับตำแหน่งและชนิดของการบาดเจ็บ วัสดุที่หาได้ และความง่ายในการใส่",
              "คุณสมบัติสำคัญคือ ความแข็ง ความเข้ารูปกับขา และน้ำหนักเบา"
            ]
          },
          {
            "sub": "1. PVC pipe splint",
            "body": [
              {
                "bullets": [
                  "**แข็งแรงมาก เหมาะกับ fracture ของขาส่วนปลายและการตรึงในสนาม**",
                  "ราคาถูกและหาได้ทั่วไป",
                  "**ต้องผ่าตามยาวและใช้ความร้อนดัดให้เข้ารูปขา**",
                  "**ข้อควรระวัง: เข้ารูปตามธรรมชาติได้ไม่ดี จึงต้องรองนุ่มให้พอเพื่อกันแผลกดทับ**",
                  "เหมาะที่สุดสำหรับตรึงขาส่วนปลายเพื่อการขนส่ง"
                ]
              }
            ]
          },
          {
            "sub": "2. Wooden splint",
            "body": [
              {
                "bullets": [
                  "แบบดั้งเดิม แต่หนักและปรับรูปได้น้อย",
                  "**เพิ่มความแข็งแรงโดยใช้ไม้แผ่นแคบหลายแผ่นวางตั้งฉากกัน**",
                  "**ต่อจากกีบขึ้นไปถึงข้อ proximal เพื่อตรึงให้ครบ**",
                  "**การต่อออกด้านข้าง (lateral extension) ช่วยกันขากางออก โดยเฉพาะที่ radius และ tibia**",
                  "ให้ความแข็งเทียบเท่ากับ Robert Jones bandage ที่ใส่ splint"
                ]
              }
            ]
          },
          {
            "sub": "3. Fiberglass casting material",
            "body": [
              {
                "bullets": [
                  "**น้ำหนักเบาและเข้ารูป ปั้นตามกายวิภาคได้ง่ายกว่า**",
                  "**ให้ความแข็งระดับปานกลาง น้อยกว่า PVC และไม้**",
                  "ใส่ทับ bandage ที่รองนุ่มไว้ดีแล้ว มักมีชั้นกันน้ำด้วย",
                  "**ข้อจำกัด: ต่อขึ้นไปถึงข้อไหล่หรือข้อสะโพกไม่ได้ จึงเหมาะกับขาส่วนกลางถึงส่วนปลาย**"
                ]
              }
            ]
          },
          {
            "sub": "Commercial splint",
            "body": [
              {
                "bullets": [
                  "ตัวเลือกที่มีขาย ได้แก่ **Kimzey Leg Saver, Monkey Splint และ compression boot**",
                  "**ใช้ตรึงฉุกเฉินสำหรับการบาดเจ็บของขาส่วนปลาย เช่น suspensory, tendon, condylar และ phalangeal fracture**",
                  "ช่วยให้ขนย้ายได้อย่างปลอดภัย และพยุงขาหลังผ่าตัด",
                  "**Compression boot ใช้ระยะสั้นหลังวางยาสลบเพื่อป้องกันการบาดเจ็บช่วง recovery**"
                ]
              },
              {
                "callout": "ลายมือระบุเคสที่นึกถึงกลุ่มนี้ว่า วิ่งมากขาหนัก และเอ็นฉีด และเสริมว่า splint ใช้กับ metacarpus หรือ metatarsus ลงมา โดยพัน 3 layers เหมือนกับ Robert Jones แต่ด้านหลังขาจะมีแท่ง support",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Stent (tie-over) bandage",
        "source": "Equine Sx concept น.57 และ น.58",
        "body": [
          {
            "sub": "Purpose และ common uses",
            "body": [
              {
                "bullets": [
                  "**ปกป้องแผลที่เย็บแล้วในบริเวณที่พันผ้ารอบตัวไม่ได้ คือ ลำตัว คอ หรือขาส่วนบน**",
                  "**ให้แรงกด ลดความตึงของแผล และป้องกันการปนเปื้อน**",
                  "ใช้กับแผล ventral midline หรือแผล laparotomy",
                  "ใช้กับแผลที่ทรวงอกหรือคอ",
                  "ใช้กับแผลขาส่วนบนที่พันแบบปกติไม่สะดวก"
                ]
              }
            ]
          },
          {
            "sub": "Construction และ application",
            "body": [
              {
                "bullets": [
                  "**Base material: ใช้ rolled gauze หรือ laparotomy pad เป็น dressing**",
                  "**Anchoring: เย็บห่วงไหมขนาดใหญ่ (large suture loops) ไว้รอบขอบแผล**",
                  "**ใช้ umbilical tape หรือไหมร้อยผูกไขว้ทับ dressing เหมือนผูกเชือกรองเท้า**",
                  "**Replaceable type: เปลี่ยน dressing ได้โดยร้อยเชือกใหม่ผ่านห่วงเดิม**",
                  "**Non-replaceable type: เย็บ dressing ติดกับผิวหนังโดยตรง และถอดออกพร้อมการตัดไหม**"
                ]
              },
              {
                "callout": "ลายมือสรุปสั้น ๆ ว่าใช้กับแผลที่คอและท้อง เพื่อ reduce wound tension และอาจใส่ยาปฏิชีวนะคลุมไว้ด้วย",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Abdominal bandage",
        "source": "Equine Sx concept น.59",
        "body": [
          {
            "bullets": [
              "**พันคลุมตั้งแต่ด้านหลังต่อ withers อ้อมลงมาถึงด้านหลังต่อสะดือ**",
              "**รองนุ่มบริเวณ withers ซึ่งเป็นตำแหน่งอาน เพื่อกันแผลกดทับ**",
              "วาง dressing ตรงตำแหน่งแผลโดยตรง",
              "**พัน conforming gauze รอบตัวโดยซ้อนทับ 50 เปอร์เซ็นต์ แล้วปิดทับด้วย elastic adhesive bandage**",
              "ใช้หลัง laparotomy เพื่อปกป้องแผลและลดภาวะแทรกซ้อนช่วง recovery",
              "ข้อเสียคือเลื่อนหลุดง่ายและเปลี่ยนบ่อยแล้วแพง"
            ]
          },
          {
            "sub": "ตัวเลือกเชิงพาณิชย์",
            "body": [
              {
                "bullets": [
                  "**CM hernia belt ให้แรงกดใต้ bandage สูงกว่า จึงช่วยป้องกัน incisional hernia**",
                  "**Nylon binder หรือ elastic bandage ให้แรงกดต่ำกว่าและได้ผลน้อยกว่า**"
                ]
              },
              {
                "callout": "ลายมืออธิบายว่าอวัยวะทุกอย่างกดลงมาที่ท้อง จึงต้องมี belt พันรอบตัว เพราะแผลจะแรงมาก และใช้กับเคสผ่าตัดช่องท้องใหญ่เป็นหลัก",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Head bandage",
        "source": "Equine Sx concept น.60 และ น.61",
        "body": [
          {
            "sub": "Purpose และ components",
            "body": [
              {
                "bullets": [
                  "ปกป้องแผลที่หัว หรือแผลที่หายแบบ second intention",
                  "**ให้แรงกดเบา ๆ เพื่อควบคุม subcutaneous emphysema โดยเฉพาะเคสที่มีไซนัสเกี่ยวข้อง**",
                  "ส่วนประกอบ: wound dressing, **mesh stockinette ที่เจาะรูสำหรับหูและตา** และเทปยืดหยุ่นชนิดกาวถ้าต้องการแรงกด"
                ]
              }
            ]
          },
          {
            "sub": "Technique และ pattern",
            "body": [
              {
                "bullets": [
                  "**Stockinette เป็นตัวให้แรงกดเบา ๆ แล้วยึดปลายด้วยเทปโดยติดครึ่งหนึ่งบน stockinette อีกครึ่งบนผิวหนัง**",
                  "เทปเสริมทับ dressing ช่วยกันเลื่อนหลุด",
                  "**พันเทปเป็นรูป figure-of-eight ระหว่างตาสองข้าง อ้อมรอบขากรรไกรล่าง ไปด้านหลังหู แล้วลอดใต้ขากรรไกร**",
                  "**ใช้หลังการควักลูกตา (post-enucleation) หรือหลังซ่อม frontal bone**",
                  "**หลีกเลี่ยงการพันแน่นบริเวณปากหรือ throatlatch**"
                ]
              },
              {
                "callout": "ลายมือเตือนว่า พันเหมือนหัวหมา ต้องระวังบาดตา ปาก หลังหู และหนวด และเสริมว่าถ้าไม่มีตาข่ายจะใช้ Coband พันแทนแบบเลขแปดก็ได้",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "อุปกรณ์เสริมและข้อพิจารณาพิเศษ",
            "body": [
              {
                "bullets": [
                  "**Fly mask หรือหมวกสำเร็จรูปใช้เดี่ยว ๆ หรือใช้ร่วมกับ bandage ได้**",
                  "**หน้ากากชนิดมี eye cup แนะนำสำหรับตาที่บาดเจ็บ**",
                  "Elastic head wrap สำเร็จรูปเหมาะสำหรับคลุม stockinette แต่ไม่ได้ให้แรงกด",
                  "**ระวังเป็นพิเศษเมื่อพันหูที่ฉีกขาดหรือถูกตัดบางส่วน**",
                  "**เฝ้าระวังไม่ให้เกิดการบาดเจ็บที่ตาหรือรูจมูกถูกอุดตัน**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สรุป wound management ในม้า",
        "source": "Equine Sx concept น.62",
        "body": [
          {
            "bullets": [
              "**การประเมินตั้งแต่แรกคือหัวใจ ดูตำแหน่ง ความลึก การปนเปื้อน และความมีชีวิตของเนื้อเยื่อ**",
              "**เทคนิคปลอดเชื้อและการ debride ที่เหมาะสมจำเป็นต่อการหายที่ดี**",
              "**เลือกวิธีปิดแผลอย่างชาญฉลาด ระหว่าง primary, delayed primary หรือ second intention ตามสภาพแผล**",
              "การพันแผลและการตรึงที่เหมาะสมช่วยปกป้องแผลและลดการเคลื่อนไหว",
              "ควบคุมการติดเชื้อและการอักเสบด้วยยาต้านจุลชีพ NSAIDs และการระบายตามข้อบ่งใช้",
              "**รักษาความชุ่มชื้นของแผลเพื่อส่งเสริม granulation และ epithelialization**",
              "ติดตามความก้าวหน้าของการหาย และปรับการรักษาตามการตอบสนองของเนื้อเยื่อ",
              "**การป้องกันดีกว่าการรักษา คือสภาพแวดล้อมที่ปลอดภัย การปฐมพยาบาลที่รวดเร็ว และการให้ความรู้เจ้าของ**"
            ]
          }
        ]
      }
    ]
  }
};
