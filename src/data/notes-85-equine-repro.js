// ============================================================
// การสืบพันธุ์ในม้า — สรุปจากรุ่นพี่ Vet 85
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

export const NOTES_85_EQUINE_REPRO = {
  "eqrepro-exam-mare": {
    "topic": "eqrepro-exam-mare",
    "title": "การตรวจระบบสืบพันธุ์แม่ม้า",
    "icon": "🐴",
    "summary": "ประวัติที่ต้องซัก สิ่งที่คลำได้และคลำไม่ได้จากทางทวารหนัก และการอ่าน ultrasound ร่วมกับ uterine edema เพื่อจัดระยะวงรอบการเป็นสัด",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "การซักประวัติก่อนตรวจ (history taking)",
        "source": "Equine repro mid 85 น.2",
        "body": [
          {
            "callout": "เฉลยชุดนี้มาจากข้อสอบกลางภาคของรุ่นก่อน ไม่ใช่ชีทเลกเชอร์ปีนี้ ให้ยึดสไลด์ของอาจารย์ปีปัจจุบันเป็นหลักเสมอ",
            "kind": "flag"
          },
          {
            "text": "ประวัติที่เอกสารระบุว่าต้องซักในการตรวจ **แม่ม้า** มี 4 กลุ่ม"
          },
          {
            "bullets": [
              "ประวัติการทำวัคซีนและการป้องกันโรค (**immuno-prophylaxis profile**)",
              "ประวัติวงรอบการเป็นสัดครั้งก่อน (**previous estrus**)",
              "ประวัติการตั้งท้องครั้งก่อน (**previous pregnancy**)",
              "ประวัติความสมบูรณ์พันธุ์ของตัวแม่ม้าเอง (**mare fertility profile**)"
            ]
          },
          {
            "text": "ข้อที่เฉลยชี้ว่า **ไม่ใช่** ส่วนหนึ่งของการซักประวัติแม่ม้า คือ **ประวัติความสมบูรณ์พันธุ์ของพ่อม้า (stallion fertility profile)** เพราะเป็นข้อมูลของสัตว์อีกตัวหนึ่ง ใช้ในการประเมิน stallion ไม่ใช่การประเมินแม่ม้า"
          }
        ]
      },
      {
        "heading": "สิ่งที่ตรวจและสิ่งที่คลำไม่ได้ในแม่ม้า",
        "source": "Equine repro mid 85 น.2",
        "body": [
          {
            "text": "รายการที่ข้อสอบถือว่าอยู่ในขอบเขตการตรวจระบบสืบพันธุ์แม่ม้า ได้แก่ สุขภาพโดยรวม รูปร่างบริเวณฝีเย็บ คอมดลูก และตัวมดลูก ส่วน **ท่ออิพิดิไดมิส (epididymis) เป็นอวัยวะของเพศผู้** จึงไม่อยู่ในการตรวจแม่ม้า"
          },
          {
            "sub": "จากการล้วงคลำทางทวารหนัก",
            "body": [
              {
                "text": "คลำได้: ความตึงตัว (tone) ของมดลูก ฟอลลิเคิลบนรังไข่ และถุงหุ้มตัวอ่อน (embryonic vesicle) เมื่อมีการตั้งท้อง"
              },
              {
                "text": "คลำ **ไม่** ได้: **คอร์ปัสลูเตียม (corpus luteum)** ซึ่งเป็นคำตอบซ้ำกันถึงสองข้อในข้อสอบชุดนี้"
              }
            ]
          },
          {
            "callout": "เหตุผลอยู่ที่กายวิภาค รังไข่ม้ากลับด้าน คือ cortex อยู่ด้านใน CL จึงฝังอยู่ในเนื้อรังไข่และไม่นูนพ้นผิวเหมือนในโค ต้องอาศัย ultrasound จึงจะเห็น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อ่านระยะวงรอบจาก ultrasound + uterine edema",
        "source": "Equine repro mid 85 น.3-4",
        "body": [
          {
            "text": "เอกสารให้ชุดตัวอย่างซ้ำหลายข้อ โดยใช้ **uterine edema score 0 ถึง 4** (score 0 = ไม่มี edema) ร่วมกับสิ่งที่พบบนรังไข่"
          },
          {
            "bullets": [
              "พบฟอลลิเคิล 3.5 ซม. + **uterine edema +4** → **estrus**",
              "พบ MSF และ CL + ฟอลลิเคิล 3.5 ซม. + **uterine edema = 0** + uterine tone fair to good → **diestrus**",
              "พบฟอลลิเคิล 3 ซม. ร่วมกับ CL บนรังไข่ → ยืนยันว่าม้ากำลังอยู่ใน **breeding season**",
              "มดลูกนิ่ม รังไข่เล็ก มีเพียงฟอลลิเคิลเล็กราว 1 ซม. หลายใบ (ตรวจเดือนธันวาคม) → **anestrus**"
            ]
          },
          {
            "text": "เครื่องมือที่เอกสารระบุว่าใช้กำหนดช่วงเวลาการตกไข่ได้แม่นยำและรวดเร็วที่สุดใน practice คือ **ultrasound** โดยเฉลยขีดฆ่าตัวเลือกที่เป็นการตรวจเซลล์เยื่อบุช่องคลอดทิ้ง"
          },
          {
            "text": "จุดตั้งต้นของการล้วงตรวจทางทวารหนักที่เฉลยยืนยันคือ **uterine bifurcation** (โจทย์ตั้งไว้ว่า cervix แล้วถูกขีดฆ่า) จากนั้นจึงไล่ไปตามปีกมดลูกจนถึงรังไข่แต่ละข้าง"
          },
          {
            "callout": "ข้อที่ตอบว่า anestrus อ้างเดือนธันวาคมตามรูปแบบฤดูกาลของเขตอบอุ่น ม้าที่เลี้ยงในไทยอาจไม่หยุดวงรอบตามเดือนแบบนี้ ให้ตรวจสอบกับสิ่งที่อาจารย์ปีนี้สอน",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "eqrepro-anatomy-cycle": {
    "topic": "eqrepro-anatomy-cycle",
    "title": "กายวิภาครังไข่ม้าและวงรอบการเป็นสัด",
    "icon": "🌙",
    "summary": "รังไข่กลับด้านกับสัตว์ชนิดอื่น การตกไข่เกิดเฉพาะที่ ovulation fossa รูปแบบ seasonal polyestrus และการควบคุมด้วยแสงกับเมลาโทนิน",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "รังไข่ม้ากลับด้าน และ ovulation fossa",
        "source": "Equine repro mid 85 น.3-4",
        "body": [
          {
            "callout": "สรุปจากเฉลยข้อสอบของรุ่นก่อน ใช้ทบทวนได้ แต่ให้ยืนยันตัวเลขและถ้อยคำกับสไลด์ปีนี้",
            "kind": "flag"
          },
          {
            "text": "รังไข่ม้าประกอบด้วยสองส่วน โดย **cortex อยู่ด้านใน** และ **medulla อยู่ด้านนอก** ซึ่งกลับด้านกับสัตว์ชนิดอื่น"
          },
          {
            "text": "ผลตามมาคือ การตกไข่เกิดขึ้นได้ **เฉพาะที่ ovulation fossa เท่านั้น** ต่างจากโคหรือสุนัขที่ตกไข่ได้ทั่วผิวรังไข่"
          },
          {
            "text": "และเป็นเหตุผลที่ **CL ของม้าคลำทางทวารหนักไม่ได้**"
          }
        ]
      },
      {
        "heading": "ตัวเลขในวงรอบที่เฉลยระบุไว้",
        "source": "Equine repro mid 85 น.3-4",
        "body": [
          {
            "bullets": [
              "ฟอลลิเคิลที่พร้อมตกไข่โดยทั่วไปขนาด **3.5 ถึง 4 ซม.**",
              "CL ของม้าจะตอบสนองต่อ prostaglandin เมื่อมีอายุ **ตั้งแต่ 5 ถึง 6 วันขึ้นไป**",
              "รูปแบบวงรอบของม้าคือ **seasonal polyestrus** ร่วมกับ **spontaneous ovulation**",
              "**diestrus ovulation** พบในม้าที่มี follicular wave แบบ **two-follicular wave pattern**"
            ]
          }
        ]
      },
      {
        "heading": "แสง เมลาโทนิน และการกลับมาเป็นสัด",
        "source": "Equine repro mid 85 น.4",
        "body": [
          {
            "text": "เฉลยมีลายมือกำกับชัดว่า เมลาโทนินสร้างจาก **pineal gland** ไม่ใช่ posterior pituitary และผลของมันคือ **ลด** การสร้าง GnRH (โจทย์เดิมเขียนว่ากระตุ้นให้เพิ่มขึ้น แล้วถูกแก้)"
          },
          {
            "text": "การเพิ่มความยาวของแสงโดยเปิดหลอดไฟในคอกม้า จึงช่วยให้แม่ม้า **กลับมามีวงรอบการเป็นสัดในช่วงหน้าหนาว** ซึ่งเป็นช่วงวันสั้น"
          },
          {
            "callout": "จำเป็นลูกโซ่: วันสั้น → เมลาโทนินสูง → GnRH ต่ำ → anestrus การเปิดไฟคือการตัดลูกโซ่นี้ที่ขั้นแรก",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "eqrepro-pregnancy": {
    "topic": "eqrepro-pregnancy",
    "title": "การตั้งท้องและการคลอดในม้า",
    "icon": "🤰",
    "summary": "ไทม์ไลน์การตั้งท้องม้าตั้งแต่ fertilization ใน oviduct จนถึงคลอด ครอบคลุม maternal recognition, endometrial cup กับ eCG และ accessory CL, ตารางตรวจ ultrasound 4 รอบ, การดูแลและวัคซีนแม่ม้าท้อง, 3 stages of parturition, intrapartum conditions, red bag และ dystocia",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ตัวเลขหลักที่ต้องจำ",
        "source": "Equine Repro Final (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "Puberty ประมาณ **1.5 ปี**",
              "Complete mature ประมาณ **6 ปี**",
              "ระยะตั้งท้องประมาณ **340 วัน**",
              "เริ่มตรวจท้องได้ตั้งแต่ **day 14** เป็นต้นไป"
            ]
          }
        ]
      },
      {
        "heading": "Early pregnancy: จาก oviduct ถึง fixation",
        "source": "Equine Repro Final (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "หลัง ovulation เกิด fertilization ที่ **oviduct** แล้วพัฒนาเป็น zygote, morula และ early blastocyst ที่วัน 6-7",
              "ช่วงนี้ตัวอ่อนยังอยู่ใน oviduct จึง **ultrasound 7 วันแรกยังไม่เจอ**",
              "วัน 6.5-7 blastocyst สร้าง **PGE2** ไปทำให้กล้ามเนื้อ uterotubal junction (UTJ) เปิด ตัวอ่อนจึงลงมาสู่มดลูกได้",
              "ม้าที่ถูกใช้งานจนอายุ 10 ปีแล้วค่อยให้มีลูก อาจมี plug มาอุด UTJ ได้",
              "วัน 10-16 หลัง ovulation เกิด **embryo migration** ตัวอ่อนกลิ้งไปทั่วมดลูก",
              "วัน 16-17 ตัวอ่อนหยุดเคลื่อนที่และฝังตัว (**fixation**)"
            ]
          },
          {
            "callout": "เอกสารทำเครื่องหมายไว้ว่ามีข้อสอบถามว่าตัวอ่อนที่ลงมาถึง uterus อยู่ในระยะใด คำตอบตามลำดับพัฒนาการในสรุปคือ early blastocyst ที่วัน 6.5-7 ซึ่งเป็นระยะที่สร้าง PGE2 พอดี",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Maternal recognition of pregnancy",
        "source": "Equine Repro Final (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "เมื่อตัวอ่อนลงมาในมดลูก จะหลั่งสารที่ **สรุปนี้ระบุว่ายังไม่ทราบชื่อ** เพื่อส่งสัญญาณ maternal recognition",
              "ปกติมดลูกจะสร้าง **PGF2α** มาสลาย CL ราววันที่ 40 แต่เมื่อเกิด maternal recognition แล้ว กระบวนการนี้จะถูกยับยั้ง"
            ]
          },
          {
            "callout": "จุดที่ต้องแยกให้ชัดคือ PGE2 ใช้เปิด UTJ ให้ตัวอ่อนผ่านลงมดลูก ส่วน PGF2α คือตัวที่จะไปสลาย CL และต้องถูกยับยั้งเพื่อให้ท้องต่อได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Mid pregnancy 40-180 วัน: endometrial cup, eCG และ accessory CL",
        "source": "Equine Repro Final (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "วัน **35-40** trophoblast พิเศษเริ่มสร้าง **endometrial cup**",
              "Endometrial cup สร้าง **eCG** ซึ่งทำงานคล้าย LH ทำให้เกิด LH surge ไข่ตกเพิ่ม และได้ **accessory CL** ที่สร้าง P4",
              "**ก่อน 35 วัน** การตั้งท้องอาศัย **primary CL**",
              "**35-120 วัน** อาศัย **accessory CL** ซึ่งอยู่ได้เกือบ 120 วันแล้วสลายไป",
              "กราฟในเอกสารเรียงลำดับ primary CL ตามด้วย accessory CL และ endometrial cup โดย eCG ขึ้นสูงช่วงกลาง ส่วน oestrogen จาก foetal gonad ขึ้นตามมาช่วงท้าย"
            ]
          }
        ]
      },
      {
        "heading": "Late pregnancy",
        "source": "Equine Repro Final (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "เดือน 4-5 ลูกโตเร็วและเริ่มสร้างอวัยวะ",
              "คลำตรวจยากเพราะลูกตกลงไปในช่องท้อง โดยเฉพาะ **เดือน 7-8** ที่ ultrasound จะเห็นแต่ถุงน้ำ",
              "ตั้งแต่ **day 150** รกจะสร้าง P4 ต่อไปจนคลอด",
              "ม้าดูท้องจากภายนอกในระยะแรกถึงกลางไม่ได้ เพราะท้องไม่กางชัดเจน",
              "วัน 180-340 ตัวอ่อนขยับได้ และ P4 ที่สูงทำให้แม่สงบ"
            ]
          }
        ]
      },
      {
        "heading": "ตารางตรวจ ultrasound 4 รอบ",
        "source": "Equine Repro Final (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "รอบ 1 วัน **14-16** ดูว่ามี**ลูกแฝด**หรือไม่ เพราะแฝดในม้ามักแท้งระยะท้าย ต้องบี้ทิ้งถุงหนึ่ง",
              "รอบ 2 วัน **22-30** ดูว่า**หัวใจเต้น**หรือไม่",
              "รอบ 3 ดูการสร้าง **endometrial cup**",
              "รอบ 4 วัน **60 ขึ้นไป** ดู**เพศ**ได้"
            ]
          }
        ]
      },
      {
        "heading": "1 เดือนก่อนคลอด",
        "source": "Equine Repro Final (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "**นมลงเต้า** และกล้ามเนื้อบริเวณ sacro-iliac หย่อนลงเพื่อให้คลอดง่ายขึ้น",
              "ใช้ **strip test** ตรวจส่วนประกอบในน้ำนมเพื่อดูว่าใกล้คลอดหรือยัง ยิ่งใกล้คลอด **แคลเซียมยิ่งสูง**",
              "**ภูมิคุ้มกันของแม่ม้าผ่านรกไม่ได้** ลูกจึงต้องกินนมน้ำเหลืองภายใน 24 ชม. แรก",
              "ตอนคลอดต้องเช็คว่า amnion และ allantochorion ออกมาครบหรือไม่"
            ]
          },
          {
            "callout": "เอกสารสะกดว่า sarco-iliac และ atlantochorian ซึ่งคำมาตรฐานคือ sacro-iliac และ allantochorion ให้ใช้คำมาตรฐานเวลาเขียนตอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Routine care และวัคซีนแม่ม้าท้อง",
        "source": "Equine Repro Final (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "แยกแม่ม้าออกมาอีกคอกก่อนคลอด เพื่อให้คลอดและเลี้ยงลูกได้",
              "**2 สัปดาห์ก่อนคลอด เปิดรอยเย็บ Caslick ที่เคยเย็บไว้** ถ้าไม่เคยเย็บก็ไม่ต้องทำ",
              "**EHV-1 และ influenza ฉีด 3 ครั้ง ที่เดือน 5, 7 และ 9** เพื่อส่งภูมิผ่านน้ำนม",
              "**Tetanus, WEE/EEE, WNV และ rabies ฉีด 1 เดือนก่อนคลอด**"
            ]
          }
        ]
      },
      {
        "heading": "3 stages of parturition",
        "source": "Equine Repro Final (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "ม้ามักคลอดกลางคืน และมีอาการปวดท้อง ปัสสาวะ ถ่าย ก่อนคลอด",
              "**Stage I 10 นาที ถึง 4 ชม.** allantochorion แตก น้ำคร่ำออกมา",
              "**Stage II 5-30 นาที** เริ่มนับตั้งแต่เห็นขาโผล่ จนลูกออกมาหมดทั้งตัว โดยลูกจะยังมี amnion หุ้มอยู่ ระหว่างนี้แม่จะลุกและลงหลายครั้ง แต่มักล้มตัวนอนตะแคง (lateral) ตอนคลอด",
              "**Stage III ภายใน 3 ชม.** แม่ต้องขับรกออกมา ถ้าเกินถือเป็น retained placenta ซึ่งในม้าพบไม่บ่อยเมื่อเทียบกับวัว"
            ]
          }
        ]
      },
      {
        "heading": "Intrapartum conditions ที่ต้องรู้จัก",
        "source": "Equine Repro Final (Vet 85) น.6",
        "body": [
          {
            "sub": "Red bag (premature separation of the allanto-chorion)",
            "body": [
              {
                "bullets": [
                  "ไม่มีการแตกของ chorioallantois ที่ cervical star",
                  "เห็นถุงสีแดงคล้ายกำมะหยี่ที่ยังไม่แตก โผล่ที่ปากช่องคลอด"
                ]
              }
            ]
          },
          {
            "sub": "Abortion",
            "body": [
              {
                "bullets": [
                  "มี vaginal discharge และนมลงเต้าก่อนกำหนด",
                  "วินิจฉัยด้วย ultrasound, การตรวจตัวอ่อน, hormonal assay และหาสาเหตุจากโรคติดเชื้อ"
                ]
              }
            ]
          },
          {
            "sub": "Uterine inertia",
            "body": [
              {
                "bullets": [
                  "เหนี่ยวนำการบีบตัวได้ด้วย **oxytocin 5-15 IU ใน saline 1 ลิตร หยดทางหลอดเลือดดำ**"
                ]
              }
            ]
          },
          {
            "sub": "Premature mammary development และ colostrum ผิดปกติ",
            "body": [
              {
                "bullets": [
                  "**นมลงเต้าเร็วกว่ากำหนด (early udder filling) อาจบ่งชี้ placental dysfunction**",
                  "ตรวจต่อด้วย ultrasound จะเห็นรกหนาและลูกโตช้า (fetal growth retardation)",
                  "จัดการด้วย supportive care และเฝ้าระวัง fetal distress"
                ]
              }
            ]
          },
          {
            "sub": "Post-partum hemorrhage",
            "body": [
              {
                "bullets": [
                  "มีเลือดออกทางช่องคลอด",
                  "วินิจฉัยจาก ultrasound ร่วมกับอาการทางคลินิก",
                  "รักษาด้วยสารน้ำ uterotonics และผ่าตัดถ้ารุนแรง"
                ]
              }
            ]
          },
          {
            "sub": "Uterine torsion",
            "body": [
              {
                "bullets": [
                  "อาการ colic และหัวใจเต้นเร็ว",
                  "วินิจฉัยด้วย ultrasound และการล้วงตรวจทางทวารหนัก",
                  "รักษาด้วยการผ่าตัดหรือ C-section"
                ]
              }
            ]
          },
          {
            "sub": "Retained fetal membranes",
            "body": [
              {
                "bullets": [
                  "รกค้างเกิน 3 ชม. และมีกลิ่นเหม็น",
                  "รักษาด้วย oxytocin, ยาปฏิชีวนะ และการล้วงเอาออก"
                ]
              }
            ]
          },
          {
            "sub": "Hypocalcemia",
            "body": [
              {
                "bullets": [
                  "อ่อนแรง สั่น นอนไม่ลุก",
                  "ตรวจระดับแคลเซียมในเลือด",
                  "รักษาด้วย calcium gluconate ทางหลอดเลือดดำช้าๆ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Red bag: premature separation of the placenta",
        "source": "Equine Repro Final (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "เยื่อหุ้มรก (chorioallantois) **ไม่แตกออก** จึงลอกหลุดจากผนังมดลูกออกมาพร้อมลูก",
              "การแลกเปลี่ยนออกซิเจนระหว่างแม่กับลูก**หยุดทันที**",
              "เมื่อแม่เบ่งจะเห็น**ถุงสีแดงเข้ม** โผล่ออกมาที่ปากช่องคลอด",
              "ลูกม้าขาดออกซิเจน จึงต้อง**รีบฉีกถุงและช่วยคลอดทันที**"
            ]
          }
        ]
      },
      {
        "heading": "Dystocia ในม้า",
        "source": "Equine Repro Final (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "ในม้าพบไม่บ่อย แต่ถ้าเกิดมัก**เกิดจาก malposition**",
              "สงสัยเมื่อ **stage I นานกว่า 45 นาที หรือ stage II นานกว่า 20 นาที**",
              "ท่าที่ปกติของม้าคือ **anterior presentation เท่านั้น**",
              "**Fetal oversized ยิ่งไม่ค่อยเจอ** เพราะขนาดลูกสัมพันธ์กับขนาดแม่"
            ]
          },
          {
            "callout": "เอกสารระบุ stage II ปกติคือ 5-30 นาที แต่เขียนเกณฑ์สงสัย dystocia ไว้ที่เกิน 20 นาที สองตัวเลขนี้ไม่สอดคล้องกันเองในเอกสาร ให้ยึดตัวเลขที่อาจารย์บรรยายในปีนี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สิ่งที่รุ่นพี่บันทึกไว้เกี่ยวกับข้อสอบส่วน pregnancy และ parturition",
        "source": "Equine Repro Final (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "ส่วนนี้ออกประมาณ **20 ข้อ** และรุ่นพี่ระบุว่าค่อนข้างยาก",
              "**โจทย์เป็นภาษาอังกฤษทั้งหมด** และ**ชื่อโรคใช้ตัวย่อ**",
              "ออกจาก**จุดเล็กๆ ในสไลด์**เยอะมาก"
            ]
          },
          {
            "callout": "ฝึกอ่านชื่อภาวะเป็นตัวย่อให้คล่อง เช่น FPT, NI, PBIE, EHV-1, WNV, WEE/EEE, MSF และ MLF เพราะโจทย์อาจไม่เขียนชื่อเต็มให้",
            "kind": "tip"
          },
          {
            "callout": "เนื้อหานี้เป็นของปีการศึกษาก่อน จำนวนข้อและรูปแบบเปลี่ยนได้ ให้ยึดสิ่งที่อาจารย์บรรยายในปีนี้เป็นหลัก",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "eqrepro-art-female": {
    "topic": "eqrepro-art-female",
    "title": "เทคโนโลยีช่วยการสืบพันธุ์ในม้า",
    "icon": "🧬",
    "summary": "การกระตุ้นตกไข่ด้วย hCG ตำแหน่งปล่อยน้ำเชื้อในการผสมเทียม การเก็บและย้ายฝากตัวอ่อน ข้อจำกัดการแช่แข็ง และหลักการ SCNT",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "การกระตุ้นตกไข่และการผสมเทียม",
        "source": "Equine repro mid 85 น.4-5",
        "body": [
          {
            "callout": "สรุปจากเฉลยข้อสอบของรุ่นก่อน ให้เทียบกับโปรโตคอลที่อาจารย์ปีนี้ให้ก่อนนำไปใช้จริง",
            "kind": "flag"
          },
          {
            "text": "ฮอร์โมนที่นิยมใช้กระตุ้นการตกไข่ในม้าคือ **human chorionic gonadotropin (hCG)** ซึ่งมีฤทธิ์คล้าย LH ในม้า"
          },
          {
            "text": "การผสมเทียมม้าปล่อยน้ำเชื้อที่ **ตัวมดลูก (uterus / body of uterus)** เพื่อเพิ่มอัตราการกระจายของอสุจิ โจทย์เดิมเขียน intracervix แล้วถูกขีดฆ่าแก้"
          },
          {
            "text": "**PGE** ใช้แก้ไขการอุดตันของท่อนำไข่จากมิวคัสในม้า โดยเฉลยขีดฆ่า oxytocin ที่โจทย์ตั้งไว้ทิ้ง"
          }
        ]
      },
      {
        "heading": "การเก็บ ย้ายฝาก และแช่แข็งตัวอ่อน",
        "source": "Equine repro mid 85 น.4",
        "body": [
          {
            "bullets": [
              "การชะล้างโพรงมดลูก (non-surgical embryo collection) **หลังผสม 7 วัน** จะได้ตัวอ่อน **ระยะ blastocyst**",
              "เพื่อให้อัตราการตั้งท้องสูง ตัวรับ (recipient) ควร **ตกไข่ในช่วงเวลาใกล้เคียงกับตัวให้ (donor)**",
              "หากมี CL อยู่ที่รังไข่ข้างซ้าย การย้ายตัวอ่อนระยะ blastocyst ให้ปล่อยที่ **uterine body**",
              "ตัวอ่อนระยะ **expanded blastocyst มีอัตรารอดหลังการแช่แข็งต่ำ** (โจทย์เขียนว่าสูงแล้วถูกแก้เป็นต่ำ)"
            ]
          }
        ]
      },
      {
        "heading": "Somatic cell nuclear transfer (cloning)",
        "source": "Equine repro mid 85 น.3-4",
        "body": [
          {
            "text": "การดูดนิวเคลียสของโอโอไซต์ออก ทำเพื่อ **produce diploid embryo** เพราะจะใส่นิวเคลียสจากเซลล์ร่างกายซึ่งเป็น diploid เข้าไปแทน"
          },
          {
            "text": "ลูกสัตว์ที่ได้มีพันธุกรรมเหมือนเซลล์ต้นแบบ **ประมาณ 99 เปอร์เซ็นต์** ไม่ใช่ 100 เปอร์เซ็นต์ เพราะไมโทคอนเดรียยังมาจากโอโอไซต์ของแม่ผู้ให้ไข่"
          },
          {
            "text": "ในเชิงระเบียบพันธุ์ ม้า **Thoroughbred** ที่จะขึ้นทะเบียนแข่งกับ Jockey club ได้ ต้องเกิดจาก **การผสมจริง** เท่านั้น (เฉลยขีดฆ่าคำว่าย้ายฝากตัวอ่อนทิ้ง)"
          }
        ]
      }
    ]
  },
  "eqrepro-stallion-infect": {
    "topic": "eqrepro-stallion-infect",
    "title": "โรคติดเชื้อทางระบบสืบพันธุ์และการติดต่อทางน้ำเชื้อ",
    "icon": "🦠",
    "summary": "แยก EHV type 1 กับ type 3 ให้ออก โรคที่ติดทางน้ำเชื้อและสำคัญต่อการขนส่งข้ามประเทศ และเชื้อที่ก่อ endometritis จากพ่อม้า",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "Equine herpesvirus แยกให้ออกเป็นคนละโรค",
        "source": "Equine repro mid 85 น.3, น.5",
        "body": [
          {
            "callout": "สรุปจากเฉลยข้อสอบของรุ่นก่อน ข้อสอบชุดนี้ถามเรื่อง EHV ถึงสี่ข้อ จึงเป็นจุดที่คุ้มกับการจำให้แม่น",
            "kind": "flag"
          },
          {
            "bullets": [
              "**EHV type 1** ทำให้เกิด **การแท้ง** ในแม่ม้า และยังทำให้เกิด **encephalomyelitis** ได้",
              "**EHV type 3** ทำให้เกิด **ตุ่มใสที่อวัยวะสืบพันธุ์ภายนอก** ของพ่อม้า คือโรค **equine coital exanthema**"
            ]
          },
          {
            "text": "ผลทางจุลพยาธิวิทยาของลูกม้าแท้งที่ช่วยยืนยันการติดเชื้อ EHV type 1 คือ **eosinophilic intranuclear inclusion body**"
          }
        ]
      },
      {
        "heading": "โรคที่ติดต่อทางการผสมพันธุ์และทางน้ำเชื้อ",
        "source": "Equine repro mid 85 น.3-5",
        "body": [
          {
            "text": "โรคที่ติดต่อได้ทางน้ำเชื้อและมีความสำคัญด้าน **การขนส่งน้ำเชื้อข้ามประเทศ** คือ **equine viral arteritis (EVA)** โดยเฉลยขีดฆ่า Taylorella equigenitalis infection ที่โจทย์ตั้งไว้ทิ้ง"
          },
          {
            "text": "**Taylorella equigenitalis** เป็นเชื้อของโรค **contagious equine metritis (CEM)**"
          },
          {
            "text": "**Dourine** เป็นโรคที่ติดต่อแบบ **venereal transmission** ในม้า"
          },
          {
            "text": "**Streptococcus zooepidemicus** เป็นเชื้อแบคทีเรียจากพ่อม้าที่มักก่อ **post breeding endometritis / metritis** ในแม่ม้า"
          },
          {
            "callout": "น.3 ข้อ 15 ถามว่า poor semen quality ในพ่อม้าที่ติดเชื้อเป็นผลของโรคใด เฉลยเขียน contagious equine metritis แล้วขีดฆ่าทิ้งโดยไม่เขียนคำแทนที่ ข้อนี้จึงยังไม่มีคำตอบที่ยืนยันได้ ให้ถามอาจารย์หรือเช็คสไลด์ปีนี้",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "eqrepro-infertility": {
    "topic": "eqrepro-infertility",
    "title": "Pneumovagina และภาวะมีบุตรยากในแม่ม้า",
    "icon": "⚠️",
    "summary": "ด่านกั้นทางกายภาพของแม่ม้า สาเหตุและการผ่าตัดแก้ pneumovagina และเส้นทางจาก post breeding endometritis ไปสู่ภาวะมีบุตรยาก",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "Pneumovagina สาเหตุและการแก้ไข",
        "source": "Equine repro mid 85 น.3-5",
        "body": [
          {
            "callout": "สรุปจากเฉลยข้อสอบของรุ่นก่อน ข้อนี้ถามซ้ำถึงสี่ครั้งในเอกสารเดียว",
            "kind": "flag"
          },
          {
            "text": "สาเหตุหลักคือ **poor conformation ของ vulva** ซึ่งเฉลยยืนยันซ้ำทั้งใน น.4 และ น.5"
          },
          {
            "text": "การผ่าตัดที่ได้ผลคือ **Caslick vulvoplasty หรือ Caslick's operation** โดยเฉลยขีดฆ่าทั้ง Buhner's operation และ vulvovestibular reconstruction ที่โจทย์ตั้งไว้ทิ้งทั้งสองครั้ง"
          },
          {
            "text": "**physical barrier** ที่เอกสารระบุว่าป้องกันการเกิด pneumovagina ได้แก่ **vulva lips** และ **vestibulovaginal fold**"
          },
          {
            "callout": "ในเอกสาร คำว่า Cervix ถูกพิมพ์ต่อท้ายด่านทั้งสองแล้วถูกขีดฆ่า โดยไม่มีคำแทนที่ ตำรามาตรฐานนับ cervix เป็นด่านที่สาม ให้ยืนยันกับสไลด์ปีนี้ว่าอาจารย์นับกี่ด่าน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Post breeding endometritis สู่ภาวะมีบุตรยาก",
        "source": "Equine repro mid 85 น.3-5",
        "body": [
          {
            "text": "**ภาวะ endometritis มักเกิดขึ้นภายหลังการผสมพันธุ์ (post breeding endometritis)**"
          },
          {
            "text": "แม่ม้าที่มีการอักเสบของเยื่อบุผนังมดลูกภายหลังการผสมพันธุ์ จะนำไปสู่ **ภาวะ infertility**"
          },
          {
            "text": "เชื้อที่มักเกี่ยวข้องและมาจากพ่อม้าคือ **Streptococcus zooepidemicus**"
          },
          {
            "text": "แม่ม้าที่มีวงรอบการเป็นสัดปกติแต่ผสมแล้วไม่ตั้งท้อง (ตรวจการตั้งท้องวันที่ 13 หลังตกไข่) เฉลยชี้ว่าให้นึกถึง **ช่วงเวลาการผสมที่ไม่สัมพันธ์กับระยะการตกไข่** เป็นอันดับแรก"
          }
        ]
      }
    ]
  },
  "eqrepro-endometritis": {
    "topic": "eqrepro-endometritis",
    "title": "Endometritis ในม้า: แยก 7 ภาวะของมดลูก และการรักษา 4 Goals",
    "icon": "🦠",
    "summary": "ตารางแยกโรค 7 ภาวะที่ทำให้ม้าผสมไม่ติด (endometrosis, bacterial/subclinical/chronic bacterial endometritis, metritis, pyometra, PBIE) ตามอาการ cytology ultrasound รังไข่ และการรักษา ต่อด้วยแนวทางรักษา endometritis แบบ 4 goals พร้อมตารางสเปกตรัมยาปฏิชีวนะ และเคสตัวอย่างที่รุ่นพี่บันทึกไว้",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ตารางแยก 7 ภาวะของมดลูกม้าที่ทำให้ผสมไม่ติด",
        "source": "Equine Repro Final (Vet 85) น.2",
        "body": [
          {
            "text": "เอกสารวางตารางเทียบ 7 ภาวะ ตาม 5 แกน คือ อาการทางคลินิก, cytology/pathology, ultrasound, รังไข่ และการรักษา แกนที่แยกโรคได้จริงคือ cytology กับรังไข่ ไม่ใช่อาการ เพราะเกือบทุกโรคมาด้วยอาการเดียวกันคือผสมไม่ติด"
          },
          {
            "sub": "1. Endometrosis",
            "body": [
              {
                "bullets": [
                  "อาการ ผสมไม่ติดเรื้อรัง ไม่มีไข้ ไม่มี discharge",
                  "Cytology/pathology **periglandular fibrosis** ร่วมกับ gland nesting, stromal fibrosis, lymphocyte และ plasma cell โดยมี PMN น้อย และ**ไม่ใช่การติดเชื้อ**",
                  "Ultrasound heterogeneous อาจเห็น cyst",
                  "รังไข่ ปกติ",
                  "รักษา **รักษาไม่หาย** ทำได้เพียง optimize breeding และ lavage ถ้ามี fluid"
                ]
              }
            ]
          },
          {
            "sub": "2. Bacterial endometritis",
            "body": [
              {
                "bullets": [
                  "อาการ infertility, discharge เล็กน้อย, ไม่มีอาการป่วยทั้งระบบ",
                  "Cytology **PMN สูงและพบ bacteria**",
                  "Ultrasound fluid 1-2 cm ลักษณะ anechoic หรือ slightly echogenic",
                  "รังไข่ ปกติ",
                  "รักษา lavage + oxytocin + antibiotics เช่น ceftiofur"
                ]
              }
            ]
          },
          {
            "sub": "3. Subclinical endometritis",
            "body": [
              {
                "bullets": [
                  "อาการ **ไม่มีอาการเลย แต่ผสมไม่ติด**",
                  "Cytology PMN สูงขึ้นเล็กน้อย อาจไม่เห็น bacteria",
                  "รังไข่ ปกติ",
                  "รักษา lavage + antibiotics ที่เลือกตามผลเพาะเชื้อ (culture-based)"
                ]
              }
            ]
          },
          {
            "sub": "4. Chronic bacterial endometritis",
            "body": [
              {
                "bullets": [
                  "อาการ ผสมไม่ติดเรื้อรัง อาการไม่ชัด",
                  "Cytology PMN + lymphocyte + plasma cell + fibrosis เล็กน้อย เป็นรูปแบบ **chronic-active inflammation**",
                  "Ultrasound เห็น debris หรือ echogenic fluid",
                  "รังไข่ ปกติ",
                  "รักษา lavage ซ้ำหลายครั้ง + antibiotics คอร์สยาว"
                ]
              }
            ]
          },
          {
            "sub": "5. Metritis (postpartum)",
            "body": [
              {
                "bullets": [
                  "อาการ **ไข้สูง ซึม ไม่กิน กลิ่นเหม็นหลังคลอด และเจ็บมดลูก** เป็นภาวะเดียวในตารางที่ม้าป่วยทั้งระบบ",
                  "Cytology **PMN สูงมากพร้อม bacteria** เป็น acute suppurative inflammation",
                  "Ultrasound fluid ขุ่นมาก ผนังมดลูกหนา",
                  "รังไข่ postpartum inactive",
                  "รักษา systemic antibiotics + NSAIDs + lavage + oxytocin หรือ PGF2α"
                ]
              }
            ]
          },
          {
            "sub": "6. Pyometra",
            "body": [
              {
                "bullets": [
                  "อาการ ผสมไม่ติด **ไม่มี discharge เพราะ cervix ปิด** และม้ามักไม่ค่อยป่วย",
                  "Cytology PMN + หนอง + bacteria",
                  "Ultrasound มดลูกใหญ่ หนองเต็ม fluid เป็น echogenic หรือ anechoic ก็ได้",
                  "รังไข่ **มี CL ที่ยัง active**",
                  "รักษา PGF2α เพื่อสลาย CL + drainage + lavage + antibiotics"
                ]
              }
            ]
          },
          {
            "sub": "7. PBIE (persistent breeding-induced endometritis)",
            "body": [
              {
                "bullets": [
                  "อาการ **fluid ค้างในมดลูกหลังผสม 12-48 ชม.** และผสมไม่ติด",
                  "Cytology PMN สูงขึ้นหลังผสม แต่**มักไม่พบเชื้อที่เป็น pathogen**",
                  "Ultrasound เห็น fluid pooling หลังผสม",
                  "รังไข่ ปกติ",
                  "รักษา oxytocin หลังผสม + lavage ที่ 4-6 ชม. หลังผสม + ลดปริมาณน้ำเชื้อ"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่แยกโรคได้เร็วที่สุดคือรังไข่กับประวัติ ถ้ารังไข่มี CL ที่ยัง active ให้นึกถึง pyometra ถ้าเพิ่งคลอดและม้าป่วยหนักให้นึกถึง metritis ส่วนที่เหลือรังไข่ปกติหมด ต้องใช้ cytology และประวัติการผสมเป็นตัวตัด",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "เกณฑ์ intraluminal fluid หลังผสม",
        "source": "Equine Repro Final (Vet 85) น.2 (บันทึกลายมือ)",
        "body": [
          {
            "bullets": [
              "**Intraluminal uterine fluid มากกว่า 2 cm ในช่วง 6-36 ชม. หลังผสม** ให้คิดถึง post-breeding endometritis",
              "แนะนำให้ ultrasound **ทั้งก่อนผสมและหลังผสม** แล้วเทียบปริมาณ fluid กัน ไม่ใช่ดูค่าครั้งเดียว"
            ]
          },
          {
            "callout": "ในตารางที่พิมพ์ไว้ของ subclinical endometritis เดิมเขียนว่า 'มักไม่มี fluid' แล้วถูกขีดฆ่าและเขียนเกณฑ์นี้ทับด้วยลายมือ ให้ถือเกณฑ์ที่เขียนทับเป็นตัวที่ใช้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Goal 1 Evacuate contents",
        "source": "Equine Repro Final (Vet 85) น.3",
        "body": [
          {
            "bullets": [
              "Uterine lavage ด้วย **warm NSS**",
              "**Ecbolic drug** ได้แก่ oxytocin และ PGF2α เช่น cloprostenol"
            ]
          }
        ]
      },
      {
        "heading": "Goal 2 Control infection: ตารางสเปกตรัมยาปฏิชีวนะ",
        "source": "Equine Repro Final (Vet 85) น.3",
        "body": [
          {
            "text": "หลักการที่เอกสารเน้นคือ **เลือก broad spectrum** ตารางจัดยาไว้ 6 รายการดังนี้"
          },
          {
            "sub": "กลุ่มที่ไม่ใช่ broad spectrum",
            "body": [
              {
                "bullets": [
                  "**Aminoglycosides** (neomycin, gentamicin, kanamycin, streptomycin, dihydrostreptomycin) เป็น protein synthesis inhibitor เด่น Gram– และ**ต้องมีออกซิเจนจึงจะฆ่าเชื้อได้ดี**",
                  "**Polymyxin B** เป็น cell membrane disruptor ครอบคลุมเฉพาะ Gram– จุดเด่นคือ**จับ endotoxin (LPS) ได้**",
                  "**Benzylpenicillin** (penicillin G) เป็น beta-lactam เด่น Gram+ ส่วน Gram– อ่อนมาก"
                ]
              }
            ]
          },
          {
            "sub": "กลุ่ม broad spectrum",
            "body": [
              {
                "bullets": [
                  "**Nitrofuran (furaltadone)** ออกฤทธิ์แบบ DNA breakage ครอบคลุมทั้ง Gram+ และ Gram– แต่**ประสิทธิภาพด้อยลงเมื่อมี debris**",
                  "**Fluoroquinolones** (enrofloxacin, ciprofloxacin, marbofloxacin) เป็น DNA gyrase inhibitor เด่น Gram– และ Gram+ พอใช้",
                  "**Ceftiofur** เป็น cephalosporin รุ่น 3 เด่น Gram– และ Gram+ ปานกลาง เป็นตัวที่ตารางแยกโรคเลือกใช้ใน bacterial endometritis"
                ]
              }
            ]
          },
          {
            "callout": "ข้อสอบที่รุ่นพี่บันทึกไว้ถามซ้ำในแนว ยาตัวนี้ใช้เพื่ออะไร ให้จำคู่ยากับกลไกและสเปกตรัม มากกว่าจำชื่อยาลอยๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Goal 3 Moderate inflammation",
        "source": "Equine Repro Final (Vet 85) น.3",
        "body": [
          {
            "sub": "3.1 Chemical curettage (ชะล้างเมือก biofilm และ debris)",
            "body": [
              {
                "bullets": [
                  "Dimethyl sulfoxide (DMSO), H2O2, MgSO4, kerosene",
                  "Povidone-iodine solution 0.2% v/v"
                ]
              }
            ]
          },
          {
            "sub": "3.2 และ 3.3",
            "body": [
              {
                "bullets": [
                  "Intrauterine platelet rich plasma (PRP) infusion",
                  "**Mucolytic drug** ได้แก่ DMSO และ **N-acetylcysteine (NAC)**"
                ]
              }
            ]
          },
          {
            "sub": "3.4 Anti-inflammatory therapies",
            "body": [
              {
                "bullets": [
                  "Endometrial mesenchymal stem cells (MSC)",
                  "Glucocorticoids เช่น dexamethasone",
                  "NSAID เช่น **flunixin meglumine** ซึ่งลดผลของ endotoxin ได้ด้วย"
                ]
              }
            ]
          },
          {
            "callout": "เอกสารเขียนว่า Intrauterine rich plasma (PRP) ซึ่งตกคำว่า platelet ชื่อเต็มคือ platelet rich plasma",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Goal 4 Prevent recurrence และภูมิคุ้มกันของมดลูกม้า",
        "source": "Equine Repro Final (Vet 85) น.3",
        "body": [
          {
            "bullets": [
              "Venereal disease screening",
              "Hygiene ที่บริเวณผสมพันธุ์",
              "**Breeding soundness examination** ซึ่งรวมการดูโครงสร้างฝีเย็บ เอกสารเขียนด้วยลายมือว่า sucken anus ซึ่งน่าจะหมายถึง sunken anus และระบุว่า**อาจแก้ด้วย Caslick's vulvoplasty**"
            ]
          },
          {
            "text": "ภาพประกอบสรุปกลไกป้องกันของมดลูกเป็น 3 ชั้น คือ (1) tract secretion ได้แก่ mucus, phagocytic activity, IgA และ scavenger cell (2) initial innate response ได้แก่ complement, macrophage และ neutrophil (3) specific immune response ได้แก่ lymphocyte, T cell และ B cell ที่สร้าง antibody โดยมีตัวรับที่ตรวจจับเชื้อ (pattern recognition receptor) ได้แก่ TLRs, NLRs, RLRs, CLRs และ AIM2 ผลลัพธ์ปลายทางคือ uterine clearance ผ่านการบีบตัวของมดลูกและ lymphatic drainage"
          },
          {
            "callout": "เอกสารทำเครื่องหมายไว้ 2 จุดว่าเป็นสิ่งที่ออกในข้อสอบของรุ่นก่อนหน้า คือ (1) การแก้ปัญหาโครงสร้างฝีเย็บด้วย Caslick's vulvoplasty และ (2) **ม้าใช้ innate immune เป็นหลักในการ defense**",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pyometra: แนวทางรักษา",
        "source": "Equine Repro Final (Vet 85) น.3",
        "body": [
          {
            "bullets": [
              "**PGF2α** คลำเจอ CL แล้วฉีดได้เลย ผลคือย่นระยะ luteal phase ทำให้ม้ากลับมาเป็นสัด และเพิ่มความสามารถของ genital tract ในการกำจัดเชื้อ",
              "Uterine lavage ร่วมกับ antibiotics",
              "**Hysterectomy** เป็นทางเลือกสุดท้าย"
            ]
          }
        ]
      },
      {
        "heading": "เคสตัวอย่างที่รุ่นพี่บันทึกไว้: ม้า 7 ปี ผสมไม่ติด 3 ครั้ง",
        "source": "Equine Repro Final (Vet 85) น.4",
        "body": [
          {
            "text": "ประวัติ ม้าอายุ 7 ปี เคยให้ลูกมาแล้ว 2 ครั้ง มีประวัติคลอดยาก และผสมมา 3 ครั้งแล้วไม่ติด"
          },
          {
            "sub": "ข้อ 1 ultrasound พบ anechoic fluid รังไข่มี follicle 3 cm และมี CL (ตัวเลือกคือ PBIE, metritis, pyometra, bacterial endometritis, endometrosis)",
            "body": [
              {
                "bullets": [
                  "การมี CL บ่งว่าม้าอยู่ระยะ diestrus ซึ่ง cervix ปิด",
                  "**การพบ intraluminal fluid ในระยะ diestrus เป็นสิ่งผิดปกติเสมอ**",
                  "ตัด metritis เพราะ metritis เกิดหลังคลอดใหม่ๆ และม้าจะป่วยหนักมีไข้",
                  "ตัด endometrosis เพราะเป็นโรคความเสื่อมของเยื่อบุที่ต้องวินิจฉัยด้วย biopsy มองไม่เห็นตรงๆ จาก ultrasound",
                  "ตัด pyometra เพราะถ้าเป็นหนองควรเห็น fluid แบบ heterogeneous echoic",
                  "ผู้เขียนตอบ PBIE แต่**เขียนกำกับไว้เองว่ายังไม่มั่นใจ** ต้องดูว่าโจทย์บอกว่าเพิ่งผสมมาหรือไม่ และ ultrasound พบ fluid เกิน 2 cm หรือไม่"
                ]
              }
            ]
          },
          {
            "callout": "โจทย์ข้อนี้ขัดกันเองในตัว เพราะ follicle 3 cm เป็นลักษณะของ estrus แต่การมี CL เป็นลักษณะของ diestrus และผู้เขียนก็ระบุว่าไม่มั่นใจ ให้จำเหตุผลการตัดตัวเลือกไปใช้ อย่าท่องคำตอบสุดท้ายไปตอบ",
            "kind": "warn"
          },
          {
            "sub": "ข้อ 2 เพาะขึ้น E. coli และ Staphylococcus พบ neutrophil เยอะมาก มี fibrotic net, plasma cell และ lymphocyte แทรกใน submucosa",
            "body": [
              {
                "bullets": [
                  "คำตอบคือ **bacterial endometritis โดยเฉพาะแบบ chronic-active**",
                  "มีเชื้อจริง คือ E. coli และ Staphylococcus",
                  "Neutrophil เยอะ คือองค์ประกอบ acute",
                  "Plasma cell และ lymphocyte คือองค์ประกอบ chronic",
                  "Fibrotic net คือ fibrosis ที่เกิดจากการอักเสบเรื้อรัง"
                ]
              }
            ]
          },
          {
            "sub": "ข้อ 3 ให้ยาและขั้นตอนมา แล้วถามวัตถุประสงค์ (ตัวเลือกคือ evacuation, control infection, promote defense, symptomatic treatment และถูกมากกว่า 1 ข้อ)",
            "body": [
              {
                "bullets": [
                  "**Cloprostenol (PGF2α)** ตอบ promote defense ร่วมกับ evacuation เพราะสลาย CL ทำให้เป็นสัด ปากมดลูกเปิด ระบายได้ และ neutrophil ทำงานดีขึ้น",
                  "**Ceftiofur ร่วมกับ uterine lavage** ตอบ control infection ร่วมกับ evacuation",
                  "**Oxytocin** ตอบ evacuation อย่างเดียว เพราะทำให้มดลูกบีบตัวขับของเหลวออก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สิ่งที่รุ่นพี่บันทึกไว้เกี่ยวกับข้อสอบส่วน endometritis",
        "source": "Equine Repro Final (Vet 85) น.3",
        "body": [
          {
            "bullets": [
              "ปีของรุ่นพี่ออกเป็น**เคสชุดใหม่ประมาณ 10 ข้อ** ไม่ตรงกับสรุปของรุ่นก่อนหน้า จึงแนะนำให้อ่านให้ครบทุกหัวข้อ",
              "เคสที่เจอ cytology พบ **neutrophil จำนวนมากร่วมกับยีสต์ระดับ moderate แต่เพาะเชื้อทั้งแบคทีเรียและเชื้อราให้ผลลบทั้งคู่** ทำให้สรุปชื่อโรคได้ยาก",
              "ยังมีข้อที่ถามว่ายาแต่ละตัวใช้เพื่ออะไร เหมือนที่เคยออกมาก่อน",
              "มีข้อที่ถามถึงการ**ล้างมดลูกด้วยน้ำส้มสายชู**"
            ]
          },
          {
            "callout": "สรุปฉบับนี้ไม่ได้อธิบายว่าการล้างด้วยน้ำส้มสายชู (acetic acid) ใช้เพื่ออะไรและใช้ความเข้มข้นเท่าไร จึงยังไม่มีคำตอบให้ในที่นี้ ให้กลับไปดูสไลด์ของปีนี้ก่อนตอบ อย่าเดา",
            "kind": "warn"
          },
          {
            "callout": "เนื้อหาทั้งหมดนี้เป็นของปีการศึกษาก่อน รูปแบบและเนื้อหาข้อสอบเปลี่ยนได้ ให้ยึดสิ่งที่อาจารย์บรรยายในปีนี้เป็นหลัก",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "eqrepro-postpartum": {
    "topic": "eqrepro-postpartum",
    "title": "ลูกม้าแรกเกิด ภาวะผิดปกติที่พบบ่อย และการผสมหลังคลอด",
    "icon": "🐴",
    "summary": "กฎ 1-2-3 ของลูกม้าแรกเกิด การดูแลวันแรกและเกณฑ์ IgG, พฤติกรรมลูกม้าและ imprinting, ภาวะผิดปกติของลูกม้าแรกเกิดที่พบบ่อยรวมถึง neonatal isoerythrolysis, ภาวะผิดปกติของแม่ม้าหลังคลอด และคำแนะนำเรื่อง foal heat",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "กฎ 1-2-3 ของลูกม้าแรกเกิด",
        "source": "Equine Repro Final (Vet 85) น.7",
        "body": [
          {
            "bullets": [
              "**ภายใน 1 ชม. ลูกม้าต้องยืนได้**",
              "**ภายใน 2 ชม. หลังคลอด ลูกม้าต้องกินนมได้**",
              "**ภายใน 3 ชม. แม่ต้องขับรกออก และลูกต้องขับ meconium (ขี้เทา)**"
            ]
          },
          {
            "callout": "เอกสารทำเครื่องหมายดาวไว้ที่กฎนี้ ให้จำว่าเลข 3 ผูกกับสองเหตุการณ์พร้อมกัน คือรกของแม่และขี้เทาของลูก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การดูแลลูกม้าในวันแรกและเกณฑ์ที่ต้องเช็ค",
        "source": "Equine Repro Final (Vet 85) น.7",
        "body": [
          {
            "bullets": [
              "สายสะดือจะแห้งขาดเอง เราแค่แต้ม **povidone-iodine 1%**",
              "**Fairy hoof (eponychium)** คือเนื้อเยื่อนุ่มที่คลุมกีบไว้ หลุดเองได้ ไม่ต้องแกะ",
              "ดูว่าลูกกิน**นมน้ำเหลืองมากกว่า 1 ลิตร ภายใน 12 ชม.**",
              "เช็ค **IgG มากกว่า 800 mg/dL**",
              "หย่านมที่ **4-6 เดือน**",
              "วัคซีนเริ่มที่ **6 เดือน** ส่วน rabies อาจเริ่มที่ 1 ปีได้",
              "ถ่ายพยาธิที่ **1 เดือน** อาจใช้ fenbendazole และที่ **6 เดือน** ใช้ ivermectin"
            ]
          },
          {
            "callout": "ตัวเลข IgG มีสองค่าที่ต้องแยกให้ออก คือ **มากกว่า 800 mg/dL** คือเกณฑ์ที่ถือว่าผ่าน ส่วน **น้อยกว่า 400 mg/dL** คือเกณฑ์วินิจฉัย failure of passive transfer",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "พฤติกรรมลูกม้าและ imprinting",
        "source": "Equine Repro Final (Vet 85) น.7",
        "body": [
          {
            "bullets": [
              "กินนมทุก **30-60 นาที** ครั้งละ **1-2 นาที**",
              "นอนเยอะ เดินสำรวจ และเข้าสังคม",
              "รักษาความสะอาดคอกลูกม้า และดูว่าลูกแอบกินอาหารของแม่หรือไม่",
              "**Imprinting** คือการทำความคุ้นเคยกับคน ใส่เชือก ลูบตัว จับขา ทำได้ตั้งแต่ **3 วันแรก**"
            ]
          }
        ]
      },
      {
        "heading": "ลูกม้ากำพร้าแม่",
        "source": "Equine Repro Final (Vet 85) น.7",
        "body": [
          {
            "bullets": [
              "ใช้แพะ ใช้ม้าโพนี่ หรือแม่ม้าตัวอื่นเป็นแม่นม แม่ม้าตัวหนึ่งเลี้ยงลูกได้ 2 ตัว และควรหาเพื่อนให้ลูกม้าด้วย",
              "ถ้าไม่มีแม่นม **ต้องป้อนนมทุกชั่วโมง**"
            ]
          }
        ]
      },
      {
        "heading": "Common neonatal abnormalities",
        "source": "Equine Repro Final (Vet 85) น.7",
        "body": [
          {
            "sub": "Failure of Passive Transfer (FPT)",
            "body": [
              {
                "bullets": [
                  "อาการ อ่อนแรง sepsis ดูดนมไม่ดี",
                  "วินิจฉัย **IgG น้อยกว่า 400 mg/dL**",
                  "รักษา **อายุน้อยกว่า 12 ชม. ให้ colostrum ทางปาก ส่วนอายุเกิน 12 ชม. ให้ plasma ทางหลอดเลือดดำ 1-2 ลิตร**"
                ]
              }
            ]
          },
          {
            "sub": "Prematurity และ dysmaturity",
            "body": [
              {
                "bullets": [
                  "อาการ ขนเป็นเงาแบบ silky coat หูอ่อนปรก และกระดูกสร้างไม่สมบูรณ์",
                  "วินิจฉัย อายุครรภ์ **น้อยกว่า 320 วัน** ร่วมกับ radiograph",
                  "รักษา ออกซิเจน ตู้อบ 28-30 องศา ดามขา และให้อาหาร"
                ]
              }
            ]
          },
          {
            "sub": "Meconium impaction",
            "body": [
              {
                "bullets": [
                  "อาการ เบ่ง สะบัดหาง ไม่ถ่าย",
                  "วินิจฉัย คลำและ radiograph",
                  "รักษา สวนด้วยน้ำสบู่หรือ acetylcysteine และให้สารน้ำทางหลอดเลือดดำ"
                ]
              }
            ]
          },
          {
            "sub": "Neonatal diarrhea",
            "body": [
              {
                "bullets": [
                  "อาการ ถ่ายเหลวเป็นน้ำและขาดน้ำ",
                  "วินิจฉัย fecal PCR หา rotavirus และ Clostridium",
                  "รักษา สารน้ำทางหลอดเลือดดำ probiotics Biosponge และแยกเลี้ยง"
                ]
              }
            ]
          },
          {
            "sub": "Umbilical infection",
            "body": [
              {
                "bullets": [
                  "อาการ สะดือบวม มีไข้ มีของเหลวไหล",
                  "วินิจฉัย ultrasound และ CBC",
                  "รักษา ampicillin ร่วมกับ gentamicin และผ่าตัดเอาฝีออกถ้ามี"
                ]
              }
            ]
          },
          {
            "sub": "Limb deformities",
            "body": [
              {
                "bullets": [
                  "อาการ ขาผิดรูปแบบ angular หรือ flexural",
                  "วินิจฉัย radiograph",
                  "รักษา ควบคุมการออกกำลัง แต่งกีบ ดาม และ oxytetracycline"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Neonatal isoerythrolysis (NI)",
        "source": "Equine Repro Final (Vet 85) น.7",
        "body": [
          {
            "bullets": [
              "กลไก ลูกม้าได้ **antigen บน RBC มาจากพ่อซึ่งแม่ไม่มี** แม่จึงสร้าง antibody ที่ไปสะสมใน colostrum เมื่อลูกกินนมน้ำเหลืองมื้อแรก antibody จะไปทำลาย RBC ของลูก",
              "อาการ เยื่อเมือกซีดจาก anemia และ **prehepatic jaundice**",
              "รักษา **blood transfusion**",
              "เอกสารระบุว่าพบไม่บ่อย แต่เป็นหัวข้อที่เคยออกสอบ"
            ]
          },
          {
            "callout": "เหตุที่ปัญหาเกิดหลังคลอดไม่ใช่ตอนอยู่ในท้อง เพราะภูมิของแม่ม้าผ่านรกไม่ได้ antibody จึงมาถึงลูกทาง colostrum เท่านั้น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Post partum breeding และ foal heat",
        "source": "Equine Repro Final (Vet 85) น.7",
        "body": [
          {
            "bullets": [
              "**Foal heat** คือแม่ม้ากลับสัดและผสมได้ตั้งแต่ **10-15 วันหลังคลอด**",
              "แต่**ไม่แนะนำให้ผสมใน foal heat** เพราะอัตราการตั้งท้องต่ำและมดลูกยังฟื้นไม่ดี",
              "ควรรอให้มดลูกกลับสภาพสมบูรณ์ **ประมาณ 20-30 วันหลังคลอด** แล้วค่อยผสม"
            ]
          }
        ]
      },
      {
        "heading": "ภาวะผิดปกติของแม่ม้าหลังคลอด",
        "source": "Equine Repro Final (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "**Retained fetal membranes** รกค้างเกิน 3 ชม. มีกลิ่นเหม็น รักษาด้วย oxytocin ยาปฏิชีวนะ และการล้วงเอาออก ในม้าพบไม่บ่อยเมื่อเทียบกับวัว",
              "**Post-partum hemorrhage** มีเลือดออกทางช่องคลอด วินิจฉัยจาก ultrasound ร่วมกับอาการ รักษาด้วยสารน้ำ uterotonics และผ่าตัดถ้ารุนแรง",
              "**Hypocalcemia** อ่อนแรง สั่น นอนไม่ลุก ตรวจระดับแคลเซียมในเลือด รักษาด้วย calcium gluconate ทางหลอดเลือดดำช้าๆ",
              "**Metritis** ไข้สูง ซึม กลิ่นเหม็น เจ็บมดลูก รักษาด้วย systemic antibiotics, NSAIDs, lavage และ oxytocin หรือ PGF2α รายละเอียดอยู่ในตารางแยกโรคหน้า 2"
            ]
          }
        ]
      }
    ]
  }
};
