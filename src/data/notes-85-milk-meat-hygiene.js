// ============================================================
// สุขศาสตร์น้ำนม + เนื้อ — สรุปจากรุ่นพี่ Vet 85
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

export const NOTES_85_MILK_MEAT_HYGIENE = {
  "milk-quality-composition": {
    "topic": "milk-quality-composition",
    "title": "กายวิภาคเต้านม การสร้างน้ำนม และองค์ประกอบน้ำนมโค",
    "icon": "📘",
    "summary": "สรุปข้อเท็จจริงที่กระดาษคำตอบชุด True/False 20 ข้อแรกยืนยันไว้ ครอบคลุมโครงสร้างค้ำจุนเต้านม ระบบเลือดและประสาท กลไก milk let-down และสารตั้งต้นของไขมัน โปรตีน แลคโตสในน้ำนม",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "โครงสร้างค้ำจุนเต้านม (suspensory apparatus)",
        "source": "Milk Hygiene MID 85 น.5-6, น.14",
        "body": [
          {
            "text": "ข้อสอบเน้นการแยกว่าโครงสร้างใดค้ำจุนจริงและโครงสร้างใดเป็นตัวประกอบ"
          },
          {
            "bullets": [
              "**Median suspensory ligament คือโครงสร้างค้ำจุนที่สำคัญที่สุด และเป็นเนื้อเยื่อ elastic**",
              "Deep lateral suspensory ligament ค้ำจุนร่วมด้วย แต่ข้อสอบระบุว่าไม่ใช่เนื้อเยื่อ elastic",
              "**ผิวหนังกับ superficial fascia มีบทบาทค้ำจุนน้อยที่สุด** ไม่ใช่โครงสร้างค้ำจุนหลัก",
              "Coarse areolar tissue เชื่อมด้าน dorsal ของเต้านมคู่หน้ากับผนังช่องท้อง ถ้าอ่อนแอเต้านมจะแยกออกจากผนังช่องท้องโดยเฉพาะเมื่อน้ำนมเต็มเต้า"
            ]
          }
        ]
      },
      {
        "heading": "ท่อน้ำนมและหูรูดหัวนม",
        "source": "Milk Hygiene MID 85 น.2",
        "body": [
          {
            "text": "โจทย์ข้อ 1 ตอบ False โดยมีคำอธิบายเขียนกำกับว่า Furstenberg's rosette ไม่ได้อยู่ที่ปลายด้านในของ gland cistern และไม่ใช่กล้ามเนื้อหูรูด"
          },
          {
            "bullets": [
              "**กล้ามเนื้อที่ป้องกันน้ำนมรั่วคือ teat sphincter muscle** รอบ teat canal",
              "Furstenberg's rosette อยู่บริเวณรอยต่อของ teat cistern กับ teat canal",
              "Annular fold คือรอยพับที่กั้นระหว่าง gland cistern กับ teat cistern"
            ]
          }
        ]
      },
      {
        "heading": "ระบบเลือดและระบบประสาทของเต้านม",
        "source": "Milk Hygiene MID 85 น.8, น.10, น.15",
        "body": [
          {
            "bullets": [
              "**การสร้างน้ำนม 1 หน่วยน้ำหนัก ต้องการเลือดผ่านเต้านมประมาณ 400 ถึง 500 หน่วย** (โจทย์ที่เขียนว่า 10 กก. ตอบ False)",
              "เส้นเลือดแดงโค้งเป็นรูปตัว S เรียก sigmoid flexure ช่วยลดความดันจากการกดทับเมื่อน้ำนมเต็มเต้า",
              "**Venous circle เกิดจาก anterior milk vein ต่อกับ posterior milk vein** ไม่ใช่ perineal vein ตามที่โจทย์หลอก",
              "**ภายในเต้านมมีเส้นประสาทน้อยและเป็นระบบ sympathetic เท่านั้น ไม่มี parasympathetic**"
            ]
          },
          {
            "callout": "เต้านมคู่หลังมีขนาดใหญ่กว่าคู่หน้าและให้น้ำนมมากกว่า จึงมีโอกาสเกิดเต้านมอักเสบมากกว่า ข้อนี้ตอบ True",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Milk let-down และผลของความเครียด",
        "source": "Milk Hygiene MID 85 น.7, น.11, น.21",
        "body": [
          {
            "bullets": [
              "การเช็ดเต้านมก่อนรีดกระตุ้นการหลั่ง oxytocin ทำให้ **myoepithelium หดตัว** และเกิดการขับน้ำนม",
              "**การรีดนมไม่ควรนานเกินประมาณ 5 ถึง 7 นาทีต่อครั้ง** (โจทย์ที่เขียนว่า 30 นาที ตอบ False)",
              "การทำให้แม่โคตกใจกระตุ้นการหลั่ง epinephrine ทำให้หลอดเลือดหดตัวและต้านฤทธิ์ oxytocin น้ำนมจึงลดลง"
            ]
          },
          {
            "callout": "ข้อ 6 ของกระดาษคำตอบ ('milk let-down ไม่ได้ขึ้นกับระบบประสาท แต่ตอบสนองต่อ oxytocin เท่านั้น') ถูกทำเครื่องหมายว่าตอบ True แต่มีรอยกากบาททับคำว่าระบบประสาทด้วย จึงอ่านเจตนาไม่ชัด ตำราทั่วไปถือว่า milk ejection เป็น neuroendocrine reflex ที่มีขาประสาทรับความรู้สึกร่วมด้วย ให้ยึดคำบรรยายปีนี้เป็นหลัก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สารตั้งต้นขององค์ประกอบน้ำนม",
        "source": "Milk Hygiene MID 85 น.9, น.12, น.17, น.20",
        "body": [
          {
            "sub": "แลคโตส",
            "body": [
              {
                "text": "**Propionate จากรูเมน ไปตับ เปลี่ยนเป็น glycogen แล้วเป็นกลูโคส เข้าสู่ secretory cell แล้วเปลี่ยนเป็น galactose รวมกับกลูโคสได้แลคโตส**"
              },
              {
                "text": "แลคโตสเป็นตัวกำหนดปริมาตรน้ำนม และในภาวะสมดุลมีประมาณ **5 เปอร์เซ็นต์** (โจทย์ที่เขียน 8 ถึง 10 เปอร์เซ็นต์ ตอบ False)"
              }
            ]
          },
          {
            "sub": "ไขมันนม",
            "body": [
              {
                "text": "**Acetate และ butyrate จากการหมักอาหารหยาบในรูเมน** เป็นแหล่งสำคัญ แล้วเปลี่ยนเป็น triglyceride ที่เต้านม"
              }
            ]
          },
          {
            "sub": "โปรตีน",
            "body": [
              {
                "text": "**เคซีนสังเคราะห์ที่เซลล์สร้างน้ำนมจากกรดอะมิโนในกระแสเลือด** และจัดเป็น phosphoprotein"
              },
              {
                "text": "beta-lactoglobulin และ alpha-lactalbumin เป็นเวย์โปรตีนที่พบมากในน้ำนมโค แต่ **ไม่ได้ทำหน้าที่เสริมภูมิคุ้มกันให้ผู้บริโภค** (ข้อนี้ตอบ False)"
              }
            ]
          }
        ]
      }
    ]
  },
  "milk-raw-std": {
    "topic": "milk-raw-std",
    "title": "Raw milk and milk products standard",
    "icon": "📏",
    "summary": "มกษ. 6003-2553 ประกาศ สธ. 350/2556 และ 406/2562 มาตรฐานนมผงนมข้น และมาตรฐานการรับซื้อน้ำนมโค",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "มกษ. 6003-2553 นิยามและคุณภาพน้ำนมโคดิบ",
        "source": "Milk pp Vet85 น.3",
        "body": [
          {
            "bullets": [
              "นิยาม: น้ำนมจากแม่โคหลังคลอดลูกแล้ว **ไม่น้อยกว่า 3 วัน**, ไม่มีน้ำนมเหลือง (colostrum), ไม่ผ่านการแยกองค์ประกอบ, ไม่ผ่านกรรมวิธีใด ยกเว้นการทำให้เย็น <4C",
              "สีขาว/ขาวนวล กลิ่นรสธรรมชาติ สะอาด ไม่มีการตกตะกอนของโปรตีนเมื่อตรวจ **alcohol test** (ถ้าไม่ผ่านตกตะกอนเป็นเม็ดทราย) ยืนยันด้วย **clot on boiling test**",
              "ความเป็นกรด (titration) <0.16% และ pH 6.6-6.8; จุดเยือกแข็ง < -0.520C; ความถ่วงจำเพาะ >1.028 ที่ 20C",
              "**Methylene blue > 4 ชั่วโมง** หรือ resazurin ที่ 1 ชั่วโมง ไม่น้อยกว่าเกรด 4.5 (ทดสอบ bacteria ปนเปื้อน)",
              "**Somatic cell < 500,000 cells/ml**, protein > 3.00%, fat > 3.35%, solid not fat > 8.25% โดยน้ำหนัก"
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์จุลินทรีย์และสารตกค้างในนมดิบ",
        "source": "Milk pp Vet85 น.3",
        "body": [
          {
            "bullets": [
              "Standard plate count **< 5 x 10^5 cfu/ml**, coliform count < 10^4 cfu/ml, thermoduric count < 10^3 cfu/ml",
              "จุลินทรีย์ก่อโรคร้ายแรง **ต้องไม่พบ (ใน 25 ml)**: Brucella spp. (ก่อ undulant fever), Mycobacterium bovis (bovine TB); Salmonella spp. (~3,000 serovars) ทำท้องเสีย ซีสต์, Listeria monocytogenes, E. coli O157:H7 ท้องเสีย เป็นเลือด ไตวาย",
              "ยาต้านจุลชีพตกค้าง: **ไม่พบ จากชุดทดสอบเบื้องต้น (Delvo test)**; วัตถุเจือปนอาหาร (สี แต่งกลิ่น ยืดอายุ) ห้ามใช้"
            ]
          }
        ]
      },
      {
        "heading": "ประกาศ สธ. 350/2556 และ 406/2562 นิยามผลิตภัณฑ์นมโค",
        "source": "Milk pp Vet85 น.4-6",
        "body": [
          {
            "bullets": [
              "**น้ำนมโคดิบ** = น้ำนมรีดจากแม่โคที่ยังไม่ผ่านกรรมวิธีฆ่าเชื้อด้วยความร้อน",
              "**น้ำนมโคสด** = ผ่าน pasteurization ที่อุณหภูมิ **<80C มีมันเนยไม่น้อยกว่า 3.2%** ไม่เติมหรือแยกสิ่งอื่นนอกจากแยกมันเนย",
              "น้ำนมโค = นำน้ำนมโคที่ไม่ได้แยก/เติมสิ่งอื่น (ปรับเนื้อนมด้วยนมผงได้ <1%); นมผง = ผ่าน evaporation จนเป็นผง; นมข้น; นมคืนรูป (recombine) = นมผงกลับมาละลายน้ำ; นมแปลงไขมัน (filled milk) = ใช้ไขมันอื่นแทน milk fat",
              "ฉบับ 406/2562: **coliform ไม่เกิน 10 CFU/mL ในน้ำนมโคสด และ 1 CFU/mL ในน้ำนมโคพาสเจอร์ไรส์ ณ แหล่งผลิต**"
            ]
          }
        ]
      },
      {
        "heading": "Heat treatment ตามกฎหมาย และการเก็บ",
        "source": "Milk pp Vet85 น.6",
        "body": [
          {
            "bullets": [
              "Pasteurization: **LTLT >63C นานกว่า 30 นาที** / **HTST >72C นานกว่า 15 วินาที**; Sterilization **>100C นานกว่า 15 นาที**; **UHT >133C นานกว่า 1 วินาที**",
              "LTLT กับ HTST ต้นทุนไม่ได้ต่างกันมาก โรงงานใหญ่ใช้ HTST 15 วินาทีก็เสร็จ",
              "การเก็บ: pasteurized **<8C ไม่เกิน 10 วันจากวันบรรจุ**; UHT และ sterilized เก็บ room temperature ได้"
            ]
          }
        ]
      },
      {
        "heading": "มาตรฐานนมผง และนมข้น",
        "source": "Milk pp Vet85 น.6",
        "body": [
          {
            "bullets": [
              "ประเภทนมตาม % milk fat: whole/full cream (>= 3.2% ไม่แยกไขมัน วิตามินครบ), skimmed (~0.1-3.2%), non-fat (<0.1%)",
              "นมผง: **ความชื้น <5%**, protein >34% โดยน้ำหนัก, fat: whole >26% / skimmed 1.5-26% / non-fat <1.5%, total bacteria <5 x 10^4 ใน 1 g, **E. coli ต้องไม่พบใน 0.1 g**",
              "นมข้น: protein >34%, **vitamin A >330 ug/100 g** (บ่งบอกองค์ประกอบยังเหลือหลังผ่านความร้อนหลายขั้น), yeast & fungus <10/g, total bacteria 1 x 10^4/g, coliform ไม่พบใน 0.1 ml",
              "ทั้งคู่ห้ามมี contamination, zoonotic agents, preservative; นมคืนรูปใช้มาตรฐานเท่าน้ำนมโคสด/นมโคชนิดนั้น"
            ]
          }
        ]
      },
      {
        "heading": "มาตรฐานการรับซื้อน้ำนมโค พ.ศ. 2558",
        "source": "Milk pp Vet85 น.8",
        "body": [
          {
            "bullets": [
              "เก็บไม่เกิน 24 ชั่วโมง; **อุณหภูมิ <8C ณ จุดรับซื้อ**; sp.gr. 1.026-1.030 ที่ 20C หรือ 1.028-1.034 ที่ 15C; ไม่มี additives/ยาปฏิชีวนะ (Delvo test); ไม่ใช่ refusal milk",
              "Alcohol test ต้อง negative ถ้า positive ใช้ clot on boiling ยืนยัน; methylene blue >4 ชั่วโมง; resazurin เกรด >4.5 ที่ 1 ชั่วโมง; titration 0.16% pH 6.6-6.8",
              "การให้ราคา: ช่วง **ไม่ลด/ไม่เพิ่ม** ได้แก่ fat 3.40-3.59%, SNF 8.35-8.49%, SPC 400,001-500,000 colonies, SCC 400,001-500,000 cells; นอกช่วงปรับเพิ่ม-ลดเป็นขั้น; freezing point ผิดปกติ (>= 0.510) ลดราคา 1 บาท/กก. หรือส่งคืนสหกรณ์"
            ]
          }
        ]
      },
      {
        "heading": "การเก็บตัวอย่างน้ำนม",
        "source": "Milk pp Vet85 น.7",
        "body": [
          {
            "bullets": [
              "ใช้ aseptic technique อุปกรณ์ปราศจากเชื้อ ติด label ถูกต้อง เขย่าให้นมเข้ากันก่อนเก็บ เก็บที่ **0-4C**",
              "**Individual samples** เก็บจุดเดียว ใช้ตรวจตอนรับน้ำนมที่จุดรับ ตอนเกษตรกรมาส่งนม; **composite samples** เก็บหลายจุดรวมกัน ใช้ตรวจที่โรงผลิต",
              "ห้ามใส่สารกันเสียหากใช้ตรวจ microbiological และ organoleptic tests"
            ]
          }
        ]
      }
    ]
  },
  "milk-raw-storage": {
    "topic": "milk-raw-storage",
    "title": "Storage of raw milk",
    "icon": "❄️",
    "summary": "หลักการรักษาคุณภาพน้ำนมดิบด้วยความเย็น วิธีลดอุณหภูมิแบบต่างๆ วิธีทางเลือก และการขนส่ง",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "จุดรับน้ำนมและศูนย์รวมนม",
        "source": "Milk pp Vet85 น.44",
        "body": [
          {
            "bullets": [
              "เกษตรกรนำนมรวมที่ **จุดรับน้ำนม (collecting point)** ตรวจเบื้องต้น: ชั่งน้ำหนัก ดมกลิ่น ดูสี วัดความถ่วงจำเพาะ อุณหภูมิ",
              "**Milk collecting center (ศูนย์รวมนม) = สถานที่ตรวจและรักษาคุณภาพน้ำนมหลัก**; ในไทยการตรวจคุณภาพส่วนใหญ่ทำที่ศูนย์รวมนม ไม่ค่อยตรวจที่จุดรับเล็กๆ"
            ]
          }
        ]
      },
      {
        "heading": "หลักการรักษาคุณภาพด้วยความเย็น",
        "source": "Milk pp Vet85 น.44",
        "body": [
          {
            "bullets": [
              "\"The cooling of milk is to keep it in a **bacteriologically stable state**\" ทำให้จุลินทรีย์ไม่สามารถเจริญเติบโตได้",
              "หัวใจคือ **ยืด lag phase ของเชื้อให้นานที่สุด ไม่ให้เข้า log phase**: ลดอุณหภูมิรวดเร็วลงต่ำกว่า 5C, อุณหภูมิแนะนำ **4C**, เก็บนาน ควร 2C, เก็บเย็นจนกว่าจะถึงโรงงานหรือผู้บริโภค",
              "15-45C คือช่วง mesophiles โตดี เอนไซม์ทำงานดี; ต่ำกว่า 4C ชะลอแบคทีเรียโดยไม่กระทบคุณค่าอาหาร",
              "นมคุณภาพดี + เก็บเย็นดี = ดีมาก แต่ถ้านมคุณภาพไม่ดีแต่แรก แช่เย็นก็ช่วยอะไรไม่ได้",
              "ข้อควรระวัง: **ห้ามผสมนมอุ่นกับนมเย็น** (ทำให้นมเย็นคุณภาพดีเสียทั้งหมด); ขนส่งภายใน 2 ชั่วโมงหลังรีด; วางแผนขนส่งให้ใช้เวลาน้อยสุด (1-2 ชั่วโมงดีที่สุด)"
            ]
          }
        ]
      },
      {
        "heading": "วิธีลดอุณหภูมิน้ำนมดิบ",
        "source": "Milk pp Vet85 น.45",
        "body": [
          {
            "bullets": [
              "**Surface cooling**: นมไหลเป็นฟิล์มบางบนผิวโลหะเย็น ลด 1-5C ใน 5-10 วินาที; plate exchanger (นมกับ coolant ไม่สัมผัสกัน) และ **tubular exchanger ระบบปิด สะอาดกว่า นิยมกว่า** (เกษตรกร/ศูนย์ เช่น อ.ส.ค. สวนจิตร ใช้)",
              "**In-can cooling**: บรรจุถังแล้วแช่น้ำเย็น ช้ากว่าวิธีอื่น ต้นทุนต่ำ เหมาะรายย่อย",
              "**Immersion cooler**: ท่องขดจุ่มในน้ำนม มีสารให้ความเย็นไหลเวียน กวนนมไปด้วย เหมาะปริมาณน้อย",
              "**Ice cone**: ใส่น้ำแข็ง(สะอาด)ลงในกรวย **แทนที่ 1/3 ของปริมาตรน้ำนม** ลดจาก 30C เหลือ 5-10C เหมาะรายย่อย",
              "**Bulk tank cooler**: ถังขนาดใหญ่ ต้นทุนสูง มีระบบทำความเย็น + เครื่องกวน (propeller) กวนเพื่อ **ไม่ให้ไขมันเกาะตัวเป็น curd (ลิ่ม)**"
            ]
          }
        ]
      },
      {
        "heading": "วิธีรักษาคุณภาพแบบอื่น",
        "source": "Milk pp Vet85 น.45-46",
        "body": [
          {
            "bullets": [
              "**Thermisation**: ต้มน้ำนม 60-66C (ปกติ ~65C) นาน 15 วินาที แล้วทำให้เย็นทันทีต่ำกว่า 10C **เก็บน้ำนมดิบได้นานขึ้นถึง 7 วัน**",
              "สารเคมี: ใช้ได้เฉพาะน้ำนมที่จะส่งโรงงานแปรรูป **ห้ามเติมในนมพร้อมดื่ม** ไม่ทำให้นมสะอาดขึ้น เพียงยืดอายุ หลังเติมต้องลดอุณหภูมิ <10C ด้วย และ **ไม่นิยมใช้แล้ว**",
              "Hydrogen peroxide 0.03-0.05% เก็บนมได้ 6-24 ชั่วโมง กำจัดออกด้วยเอนไซม์ catalase; ฤทธิ์ฆ่าเชื้อจาก free radicals",
              "**Lactoperoxidase system**: ระบบที่มีในน้ำนมอยู่แล้ว กระตุ้นโดยเติม **sodium thiocyanate + sodium percarbonate** ใช้กับนมรีดมาไม่เกิน 2-3 ชั่วโมง; เก็บได้นานตามอุณหภูมิ (25-30C ได้ 8 ชั่วโมง จนถึง 4C ได้ 48 ชั่วโมง)"
            ]
          }
        ]
      },
      {
        "heading": "การขนส่งน้ำนมดิบ",
        "source": "Milk pp Vet85 น.46",
        "body": [
          {
            "bullets": [
              "เงื่อนไขสำคัญ: **อุณหภูมิของนมต้องไม่เปลี่ยนเกิน 2C** และ **ต้องส่งเสร็จสิ้นภายใน 2 ชั่วโมงหลังรีด**",
              "พาหนะถูกสุขลักษณะ มีฉนวนกันความร้อน (insulation) คุณภาพดี รักษาอุณหภูมิระหว่างขนส่ง",
              "ทำความสะอาดถังขนส่งด้วยระบบ **CIP** (ปล่อยน้ำ น้ำร้อน น้ำยาฆ่าเชื้อไหลผ่านท่อ ไม่ต้องใช้แปรงขัด)"
            ]
          }
        ]
      }
    ]
  },
  "milk-quality-determination": {
    "topic": "milk-quality-determination",
    "title": "การตรวจวัดคุณภาพน้ำนม",
    "icon": "📘",
    "summary": "เครื่องมือและวิธีทดสอบที่ข้อสอบถามซ้ำ ทั้งการวิเคราะห์องค์ประกอบ การตรวจสารตกค้าง และการตรวจแบบรวดเร็วหน้าจุดรับน้ำนม",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "จับคู่เครื่องมือกับค่าที่วัด",
        "source": "Milk Hygiene MID 85 น.26, น.43, น.45, น.61",
        "body": [
          {
            "bullets": [
              "**Delvo test ตรวจการตกค้างของยาต้านจุลชีพ**",
              "**Kjeldahl method ตรวจโปรตีน**",
              "**Milkoscan วิเคราะห์ไตรกลีเซอไรด์ (ไขมัน) โปรตีน และแลคโตส**",
              "**Lactodensitometer วัดความถ่วงจำเพาะ**",
              "**Beta-lactoglobulin ใช้แยกว่านมพาสเจอร์ไรส์ทำจากน้ำนมดิบหรือนมผงคืนรูป**"
            ]
          }
        ]
      },
      {
        "heading": "ค่าที่ SNF มีผลและไม่มีผล",
        "source": "Milk Hygiene MID 85 น.32, น.27",
        "body": [
          {
            "bullets": [
              "SNF มีผลต่อ refractive index, boiling point และ density",
              "**SNF ไม่มีผลต่อ titratable acidity**",
              "การเหม็นหืนของน้ำนมสัมพันธ์กับเอนไซม์ **lipase** มากที่สุด ส่วน phosphatase ใช้คู่กับการตรวจการพาสเจอร์ไรส์"
            ]
          }
        ]
      },
      {
        "heading": "การตรวจแบบรวดเร็วและการตรวจเต้านมอักเสบ",
        "source": "Milk Hygiene MID 85 น.87, น.23-24",
        "body": [
          {
            "bullets": [
              "**การตรวจแบบรวดเร็วได้แก่ alcohol test, clot-on-boiling test และ acidity test** ทั้งหมดอาศัยความคงตัวของโปรตีน",
              "**California mastitis test อาศัยปฏิกิริยาระหว่างกรดนิวคลิอิกของเซลล์โซมาติกกับสารลดแรงตึงผิว**",
              "**เครื่อง mastitis detector วัดการเปลี่ยนแปลงค่าการนำไฟฟ้าของน้ำนม** ซึ่งขึ้นกับปริมาณ Na และ Cl เป็นสำคัญ",
              "**NAGase (N-acetyl-beta-D-glucosaminidase) เป็น lysosomal enzyme จากเม็ดเลือดขาวและเซลล์เยื่อบุ ใช้บ่งชี้ความรุนแรงของเต้านมอักเสบ**"
            ]
          }
        ]
      }
    ]
  },
  "milk-microbiology": {
    "topic": "milk-microbiology",
    "title": "Milk microbiology",
    "icon": "🦠",
    "summary": "กลุ่มจุลินทรีย์ในนม indicator bacteria spoilage bacteria และ starter cultures",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "จุลินทรีย์ในนม และแหล่งปนเปื้อน",
        "source": "Milk pp Vet85 น.9",
        "body": [
          {
            "bullets": [
              "นม water activity สูง อุดมสารอาหาร pH 6.6-6.8 = medium ที่เหมาะต่อการเจริญของเชื้อ",
              "แบ่ง 4 กลุ่ม: **pathogenic** (ก่อโรคคนและสัตว์), **indicator** (บ่งชี้คุณภาพความปลอดภัย), **spoilage** (เปลี่ยนรส กลิ่น สี เนื้อสัมผัส), **starter cultures** (มีประโยชน์ ทำโยเกิร์ต ชีส) และยังพบ virus, fungi, parasite ได้",
              "แหล่งปนเปื้อน: ตัวโค สิ่งแวดล้อม (อากาศ น้ำ อาหาร bedding) อุปกรณ์รีดนม คนรีด และ **after processing** (ขนส่ง เก็บรักษา หลัง pasteurization)"
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยการเจริญ และการควบคุม",
        "source": "Milk pp Vet85 น.9-10",
        "body": [
          {
            "bullets": [
              "Intrinsic: nutrient, moisture, pH, oxygen, biological structures, antimicrobial factors; extrinsic: temperature, relative humidity",
              "**Refrigeration ชะลอการเจริญ แต่ไม่กำจัด psychrotrophs**; การทำแห้ง/เข้มข้นลด water activity ยับยั้งการเจริญ",
              "การควบคุม: cooling, natural souring (pH ต่ำ กด lipolytic และ proteolytic bacteria ใช้ทำ yogurt sour cream buttermilk cheese รายย่อย), pasteurization, sterilization"
            ]
          }
        ]
      },
      {
        "heading": "Indicator bacteria",
        "source": "Milk pp Vet85 น.11",
        "body": [
          {
            "bullets": [
              "ICMSF criteria การเลือก indicator: อยู่รอด คงทน ตรวจง่าย รวดเร็ว ไม่แพง มีความเกี่ยวโยงกับปัญหา",
              "TBC: **ไม่ใช่ safety indicator** ใช้บอก process integrity และ sanitation",
              "LPC/thermoduric count: ไม่ใช่ safety indicator ใช้บอก farm sanitation, hygiene",
              "Coliforms: aerobic/facultative anaerobic gram-negative lactose-fermenting rods ใช้บอก process integrity ไม่ใช่ safety indicator",
              "**E. coli = fecal contamination indicator ที่ดีที่สุด** (จาก warm-blooded animals)"
            ]
          }
        ]
      },
      {
        "heading": "Spoilage bacteria",
        "source": "Milk pp Vet85 น.11-12",
        "body": [
          {
            "bullets": [
              "**Psychrotrophic** เจริญได้ที่ตู้เย็น (<=7C) เช่น Pseudomonas fluorescens, P. fragi, Bacillus spp.: ผลิต proteases ย่อย casein รสขม และ lipases ให้กลิ่นหืน **เอนไซม์ทนความร้อน survive pasteurization** จึงก่อ spoilage แม้เชื้อถูกฆ่า; แหล่ง = post-pasteurization contamination",
              "**LAB** (Lactococcus, Lactobacillus, Leuconostoc): ferment lactose เป็น lactic acid นมเปรี้ยว จับก้อน (coagulated)",
              "**Gas-producing** = coliforms (E. coli, Enterobacter aerogenes) นมเป็นฟองมีแก๊ส (frothy) แหล่งคือ fecal contamination น้ำสกปรก",
              "**Spore-forming** (Bacillus cereus, Clostridium): สปอร์ทน pasteurization แล้ว germinate ภายหลัง เกิดรส-กลิ่นผิดปกติ curdling",
              "**Thermoduric** (Micrococcus, Enterococcus): ทนอุณหภูมิ pasteurization แหล่งคืออุปกรณ์ล้างไม่สะอาด biofilms",
              "สรุปตาราง: souring = LAB; ropiness (นมหนืดเมือก) = Enterobacter; rancidity = Pseudomonas/Bacillus lipases; bitterness = Pseudomonas proteases; gas = coliforms",
              "ควบคุม: rapid cooling <=4C, สุขศาสตร์การรีดและอุปกรณ์, pasteurization ที่ถูกต้อง, เลี่ยง post-pasteurization contamination"
            ]
          }
        ]
      },
      {
        "heading": "Starter cultures",
        "source": "Milk pp Vet85 น.12-13",
        "body": [
          {
            "bullets": [
              "Starter culture = เชื้อแบคทีเรียที่เติมลงในนมโดยตั้งใจ เพื่อกระตุ้นและควบคุม fermentation; ต่างจาก natural microflora ที่ inefficient ควบคุมไม่ได้ ไม่แน่นอน",
              "หน้าที่: ผลิต lactic acid, สร้าง flavor-aroma, ปรับ texture (coagulation เพิ่ม viscosity), safety (ลด pH ยับยั้งเชื้อก่อโรค), consistency",
              "**Mesophilic (~30C)**: Lactococcus lactis subsp. lactis, L. lactis subsp. cremoris, Leuconostoc mesenteroides ใช้ผลิต **Cheddar, Gouda, cultured buttermilk**",
              "**Thermophilic (~42-45C)**: Streptococcus thermophilus, Lactobacillus delbrueckii subsp. bulgaricus, L. helveticus ใช้ผลิต **yogurt, mozzarella, Swiss-type cheeses**",
              "Adjunct cultures เติมเพื่อ flavor การบ่ม texture; probiotic cultures (L. acidophilus, Bifidobacterium bifidum, L. casei) เพิ่มใน yogurt และ fermented milk",
              "Challenges: **bacteriophage infection** ทำ culture หยุดทำงาน, culture drift, contamination"
            ]
          }
        ]
      }
    ]
  },
  "milk-borne-pathogens": {
    "topic": "milk-borne-pathogens",
    "title": "Milk-borne pathogens and diseases",
    "icon": "☣️",
    "summary": "เชื้อก่อโรคที่ติดต่อทางน้ำนม 10 กลุ่มหลัก outbreaks สำคัญ และการควบคุมป้องกัน",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "แหล่งปนเปื้อนเชื้อก่อโรค",
        "source": "Milk pp Vet85 น.14",
        "body": [
          {
            "bullets": [
              "Inside udder: Streptococcus, Corynebacterium, Micrococcus; outside udder: Micrococcus, Staphylococcus, Enterococcus, Bacillus",
              "Animal feed: Salmonella, Aspergillus spp.; feces: E. coli, Staphylococcus, Listeria, Salmonella, Mycobacterium; รวมถึงน้ำล้าง อุปกรณ์ คน บรรจุภัณฑ์ (mold)"
            ]
          }
        ]
      },
      {
        "heading": "เชื้อก่อโรคสำคัญในนม",
        "source": "Milk pp Vet85 น.14-18",
        "body": [
          {
            "sub": "Salmonella spp.",
            "body": [
              {
                "bullets": [
                  "Gram-negative rod, Enterobacteriaceae; ปนเปื้อนจาก fecal contamination จากสัตว์ติดเชื้อ",
                  "Typhoid Salmonella (S. Typhi, S. Paratyphi) มี **human reservoir**; สำคัญ: S. Typhimurium, S. Enteritidis",
                  "**S. Dublin ปรับตัวกับโค** ก่อ bovine mastitis และ invasive disease ในคน (septicemia, endocarditis) mortality สูงกว่า; incubation 6-72 ชั่วโมง (ปกติ 12-36)"
                ]
              }
            ]
          },
          {
            "sub": "Staphylococcus aureus",
            "body": [
              {
                "bullets": [
                  "Gram-positive cocci, coagulase-positive; สาเหตุหลัก contagious mastitis และเป็น foodborne pathogen ด้วย",
                  "ผลิต **heat-stable enterotoxin**: pasteurization ฆ่าเชื้อได้ **แต่ไม่ทำลาย enterotoxin** เก็บนมอุ่นเกินไปเกิด toxin",
                  "Staphylococcal food poisoning: **onset เร็ว 1-6 ชั่วโมง** อาเจียน คลื่นไส้ ปวดท้อง self-limiting 24-48 ชั่วโมง จาก pre-formed toxin ไม่ใช่เชื้อมีชีวิต"
                ]
              }
            ]
          },
          {
            "sub": "Bacillus cereus",
            "body": [
              {
                "bullets": [
                  "Gram-positive spore-forming rod พบทั่วไปในดิน; **spores ทนร้อน survive pasteurization**",
                  "Food poisoning 2 แบบ: **emetic (heat-stable toxin ในอาหาร)** 1-6 ชั่วโมง อาเจียน; **diarrheal (heat-labile toxin สร้างในลำไส้)** 6-15 ชั่วโมง ถ่ายเหลว"
                ]
              }
            ]
          },
          {
            "sub": "Listeria monocytogenes",
            "body": [
              {
                "bullets": [
                  "Gram-positive facultative intracellular rod; **psychrotrophic โตได้ในนมแช่เย็น**",
                  "กลุ่มเสี่ยง: **หญิงตั้งครรภ์ (แท้ง ตายคลอด)** ทารก ผู้สูงอายุ immunocompromised; incubation 3-70 วัน รุนแรง meningitis encephalitis septicemia",
                  "**Post-pasteurization contamination เป็นปัญหาใหญ่**; control: hygiene, pasteurization, cold chain"
                ]
              }
            ]
          },
          {
            "sub": "Cronobacter sakazakii",
            "body": [
              {
                "bullets": [
                  "Gram-negative rod (เดิม Enterobacter sakazakii) ปนเปื้อน **powdered infant formula (PIF)** และ dried milk products",
                  "Severe neonatal infections: meningitis, septicemia, necrotizing enterocolitis **fatality สูง**",
                  "ป้องกัน: ชง PIF ด้วยน้ำ **>=70C** ใช้ทันที หรือ cool <5C และใช้ภายใน 24 ชั่วโมง"
                ]
              }
            ]
          },
          {
            "sub": "Shiga-toxin producing E. coli (O157:H7)",
            "body": [
              {
                "bullets": [
                  "ผลิต Shiga toxins (Stx1, Stx2); reservoir = cattle, sheep; ปนเปื้อนผ่าน feces",
                  "**Infectious dose ต่ำมาก ~10-100 เซลล์**; รุนแรง hemorrhagic colitis และ **HUS** (renal failure, thrombocytopenia, hemolytic anemia)",
                  "Pasteurization ฆ่าได้ แต่ post-pasteurization contamination ก่อ outbreak ได้"
                ]
              }
            ]
          },
          {
            "sub": "Campylobacter spp.",
            "body": [
              {
                "bullets": [
                  "C. jejuni, C. coli; fastidious; **raw milk เป็น source หลัก**; 1 ใน 4 สาเหตุหลัก global diarrheal disease",
                  "**C. jejuni = major cause ของ milkborne gastroenteritis**; ถ่ายเป็นเลือด ไข้ ปวดท้อง",
                  "Post-infection: reactive arthritis และ **Guillain-Barre syndrome**"
                ]
              }
            ]
          },
          {
            "sub": "Streptococcus agalactiae",
            "body": [
              {
                "bullets": [
                  "Gram-positive beta-hemolytic **group B strep**; ในโค = **obligate udder pathogen ก่อ contagious mastitis**",
                  "ในคน: neonatal sepsis pneumonia meningitis (vertical transmission); **pasteurization ทำลายได้**"
                ]
              }
            ]
          },
          {
            "sub": "Mycobacterium bovis",
            "body": [
              {
                "bullets": [
                  "Acid-fast rod ก่อ **bovine tuberculosis (zoonotic TB)**; กลุ่มเสี่ยง: ดื่มนมดิบ farm workers สัตวแพทย์ abattoir workers",
                  "GI TB ปวดท้อง ถ่ายเหลว น้ำหนักลด; **pasteurization ฆ่าเชื้อได้**; ควบคุมด้วย animal testing (TST), culling, hygienic milking"
                ]
              }
            ]
          },
          {
            "sub": "Brucella spp.",
            "body": [
              {
                "bullets": [
                  "Gram-negative non-motile coccobacilli; B. abortus (โค), **B. melitensis (แพะ แกะ) pathogenic ที่สุดในคน**",
                  "**Undulant fever ไข้ขึ้นๆ ลงๆ** incubation 1-3 สัปดาห์ night sweats อ่อนเพลีย ปวดข้อ; chronic: arthritis, endocarditis, neuro",
                  "ยังพบมากใน Asia, Africa, Middle East; control: animal testing, pasteurization, vaccination"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เชื้ออื่น outbreaks และการควบคุม",
        "source": "Milk pp Vet85 น.18",
        "body": [
          {
            "bullets": [
              "ตารางเชื้ออื่น: Coxiella burnetii = Q fever อาจเกิด endocarditis; Yersinia enterocolitica = gastroenteritis อาการคล้ายไส้ติ่งอักเสบ; hepatitis A virus; tick-borne encephalitis; Taenia spp.; Toxoplasma gondii; Candida krusei และ Nocardia asteroids สัมพันธ์กับ bovine mastitis",
              "Outbreaks สำคัญ: **Listeria monocytogenes (US, 1985) soft cheese 108 ราย ตาย 21**; E. coli O157:H7 (US, 1993) raw milk >200 ราย มี HUS หลายราย; Streptococcus zooepidemicus septicemia meningitis 11 ราย ตาย 7",
              "ควบคุม: **pasteurization ได้ผลกับเชื้อส่วนใหญ่แต่ไม่ทำลาย toxins**, hygienic milking, cold chain management, animal testing และ culling (TB, brucellosis), surveillance, ให้ความรู้เรื่องความเสี่ยงนมดิบ"
            ]
          }
        ]
      }
    ]
  },
  "milk-mastitis": {
    "topic": "milk-mastitis",
    "title": "Mastitis",
    "icon": "🩺",
    "summary": "รูปแบบเต้านมอักเสบ เชื้อ contagious-environmental การตรวจวินิจฉัย และผลต่อคุณภาพน้ำนมและผลิตภัณฑ์",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "กลไกการติดเชื้อ และรูปแบบของ mastitis",
        "source": "Milk pp Vet85 น.40",
        "body": [
          {
            "bullets": [
              "เชื้อเข้าสู่เต้านมทาง **teat canal** เข้าทำลาย secretory cells เกิด inflammation เม็ดเลือดขาวเข้ามาสะสม (SCC สูงขึ้น) เนื้อเยื่อฝ่อ (atrophy) หรือเป็นพังผืด (scar tissue) องค์ประกอบน้ำนมเปลี่ยน คุณภาพลดลง",
              "Clinical: **peracute** (เฉียบพลันรุนแรง agalactia น้ำนมเป็นน้ำเหลืองใสๆ serous แม่โคอาจเสียชีวิต), **acute**, **subacute** (พบมาก อักเสบเล็กน้อย อาจไม่มีอาการให้เห็น), **chronic** (พบมาก เรื้อรัง กำเริบเป็นครั้งคราว)",
              "**Subclinical mastitis พบบ่อยที่สุดในฟาร์มโคนม** ไม่มีการอักเสบให้เห็นชัดที่เต้าหรือน้ำนม แต่ผลผลิตและคุณภาพลดลง **เป็นปัญหาเศรษฐกิจสำคัญเพราะตรวจจับยาก**"
            ]
          }
        ]
      },
      {
        "heading": "Contagious mastitis",
        "source": "Milk pp Vet85 น.40-41",
        "body": [
          {
            "bullets": [
              "ติดต่อจากโคสู่โค ส่วนใหญ่ขณะรีดนม ผ่านอุปกรณ์และมือคนงาน มักอยู่ในรูป subclinical หรือ chronic",
              "**Streptococcus agalactiae**: อยู่ teat cistern และ gland cistern; SCC สูงมาก 1-10 ล้านเซลล์/มล. น้ำนมไม่เปลี่ยนสีชัดเจน; **ไวต่อยาปฏิชีวนะ รักษาได้ง่ายกว่าเชื้ออื่น**",
              "**Staphylococcus aureus** (เจอได้บ่อยสุด): สร้าง endotoxins และเอนไซม์หลายชนิดโดยเฉพาะ **hyaluronidase ทำลายเนื้อเยื่อ**; ก่อ chronic mastitis เนื้อเยื่อเต้านมแข็งกลายเป็นพังผืด; **ดื้อยาปฏิชีวนะสูง รักษายากมาก**",
              "**Mycoplasma bovis**: ไม่มีผนังเซลล์ pleomorphic ดื้อยาสูง; น้ำนมคล้ายหนอง ปริมาณลดลง เต้านมแข็ง มีก้อนหนอง; มักระบาดพร้อมกันหลายตัวในฝูง = **mastitis epizootic**; จัดการด้วยการแยกออกจากฝูงหรือคัดทิ้ง",
              "**Corynebacterium pyogenes**: บุกรุกเนื้อเยื่อ เต้านมแข็ง เป็นฝี หนองข้นคล้ายชีส กลิ่นเหม็นคล้ายชีส; พบในสภาพแวดล้อมชื้น ฟางไม้ ที่รองนอน"
            ]
          }
        ]
      },
      {
        "heading": "Environmental และ opportunistic mastitis",
        "source": "Milk pp Vet85 น.41",
        "body": [
          {
            "bullets": [
              "**Coliform bacteria** (E. coli, Klebsiella, Enterobacter, Citrobacter) จากขี้ ดิน bedding: สร้าง **endotoxins อักเสบรุนแรง** ผลผลิตลด น้ำนมสีเหลืองใส ตะกอนสูง",
              "**Environmental streptococci** (S. dysgalactiae, S. uberis, Enterococci) บนผิวหนัง: น้ำนมเปลี่ยนสี ตะกอน แยกน้ำส่วนใสจากตะกอน **SCC สูงมาก 300,000-2,000,000 เซลล์/มล.** ส่วนใหญ่ยังไวต่อยาปฏิชีวนะ",
              "**Pseudomonas aeruginosa** (opportunistic): พบทั่วไปโดยเฉพาะในท่อน้ำและสายยาง สร้าง **biofilm** ก่อ **gangrene mastitis (เนื้อตาย)** รุนแรงถึงตาย ดื้อยาสูงมาก",
              "**Corynebacterium bovis**: กรณีไม่ได้จุ่มหัวนมหลังรีด SCC สูงถึง ~400,000 เซลล์/มล. อักเสบไม่รุนแรง นมกลิ่นคล้ายเนย",
              "เชื้อรา ยีสต์: Candida spp. ทำน้ำนมข้นคล้ายโยเกิร์ตสีขาว/เหลืองคล้ายส่าเหล้า; Aspergillus spp. สีเขียว/ดำ ในสภาพแวดล้อมอับชื้น"
            ]
          }
        ]
      },
      {
        "heading": "การตรวจวินิจฉัย mastitis",
        "source": "Milk pp Vet85 น.41-42",
        "body": [
          {
            "bullets": [
              "**SCC**: จำนวนเม็ดเลือดขาวในน้ำนม ใช้วัดระดับการอักเสบ; **ค่าปกติ <100,000-200,000 เซลล์/มล. = ไม่มีการติดเชื้อ**; ตาราง Phipot & Nickerson (1991): <140,000 ผลผลิตไม่ลด, 1,280,000-2,280,000 ลด 19-25%",
              "วิธีตรวจ SCC: direct microscopic count (ไม่ค่อยทำ), **California Mastitis Test (CMT) = cow-side test น้ำยาทำลายผนังเซลล์ ให้ DNA หลุดออกมา ทำให้น้ำยาข้นหนืดขึ้น** (เหนียวมาก = อักเสบแรง), Wisconsin Mastitis Test, electronic counter (Lactoscan)",
              "**NAGase** (N-acetyl-beta-D-glucosaminidase): เอนไซม์เพิ่มขึ้นเมื่อเกิด mastitis จากเม็ดเลือดขาวและ epithelial cells หลุดลอก",
              "**Electrical conductivity**: ช่วง mastitis **Na+ และ Cl- สูงขึ้น, K+ และ lactose ลดลง** ความนำไฟฟ้าสูงขึ้น ต้อง calibrate กับค่าเฉลี่ยของฝูง",
              "**Antibody detection (ELISA)** หาภูมิคุ้มกันต่อ Staphylococcus aureus เหมาะกับ chronic mastitis และ screening ทั้งฝูง"
            ]
          }
        ]
      },
      {
        "heading": "ผลของ mastitis ต่อน้ำนมและผลิตภัณฑ์",
        "source": "Milk pp Vet85 น.42-43",
        "body": [
          {
            "bullets": [
              "ผลผลิตลดลง 3-50%: hormone กระตุ้นการสร้างน้ำนม (galactopoietic hormone) ลดลง metabolism ของ secretory cells ลด",
              "**Lactose ลดลง** (chloride-lactose ratio ปกติ 1.0-2.5 จะสูงขึ้นใน mastitis) นมรสเค็มขึ้น มีกลิ่น acetone",
              "**Casein ลดลง**: ถูกย่อยโดย plasmin (จากเลือด) และเอนไซม์จาก leukocytes/แบคทีเรีย; การจับตัวเป็นลิ่ม (curding) แย่ลง **cheese yield ต่ำลง**",
              "Milk fat ลดลงและ lipase เพิ่ม (จากเม็ดเลือดขาว แบคทีเรีย) triglyceride แตกตัว เกิดกลิ่นเหม็นหืน; % ไขมันอาจไม่เห็นเปลี่ยนชัดเพราะปริมาณน้ำนมโดยรวมลดลงด้วย",
              "**Na+ Cl- เพิ่มขึ้น K+ ลดลง** จาก tight junction เสียหาย; PMN, albumin, immunoglobulins, bicarbonate เพิ่ม (นมเค็ม เป็นด่าง); Ca และ P ลดลง; เอนไซม์เพิ่ม (acid/alkaline phosphatase, catalase, lysozyme, plasmin, NAGase)",
              "ผลต่อผลิตภัณฑ์: free fatty acids สูง กลิ่นหืน โดยเฉพาะเมื่อ **SCC > 400,000 เซลล์/มล.**; yield ชีส-เวย์ลด; pH สูง **rennet coagulation ช้าลง** เนื้อชีส pasty รสไม่สะอาด; โยเกิร์ตแยกชั้น; heat stability ต่ำ; ยาปฏิชีวนะตกค้างทำแบคทีเรียหมักถูกฆ่า ผลิตภัณฑ์หมักคุณภาพต่ำ"
            ]
          }
        ]
      },
      {
        "heading": "การควบคุม และความสูญเสียทางเศรษฐกิจ",
        "source": "Milk pp Vet85 น.42",
        "body": [
          {
            "bullets": [
              "มาตรการหลัก: **ตรวจพบการติดเชื้อให้เร็วที่สุด**, ระบุชนิดเชื้อก่อโรคและสาเหตุ, ป้องกันการแพร่ในฝูง (รีดนมสะอาด จุ่มหัวนมหลังรีดนม)",
              "ความสูญเสีย: ผลผลิตลด, ทิ้งน้ำนมผิดปกติ, นมช่วงรักษาด้วยยาปฏิชีวนะต้องถูกกันออก (ระยะหยุดยา), มูลค่าโคที่ถูกคัดทิ้ง, ค่ารักษาและสัตวแพทย์, ค่าแรงงานเพิ่ม"
            ]
          }
        ]
      }
    ]
  },
  "milk-processing": {
    "topic": "milk-processing",
    "title": "Processing and manufacturing technology",
    "icon": "⚙️",
    "summary": "ขั้นตอนแปรรูปนม separation standardization homogenization heat treatment และการผลิตผลิตภัณฑ์นมแต่ละชนิด",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ขั้นตอนหลักของ dairy processing",
        "source": "Milk pp Vet85 น.29",
        "body": [
          {
            "bullets": [
              "ลำดับ: separation, standardization, homogenization, heat treatment, evaporation, cleaning in place (CIP), dairy products",
              "**Separation (cream separator)** ใช้ centrifugal action แยก cream ออกจาก skim milk; 3 แบบ: open, semi-open, **close separator ประสิทธิภาพดีที่สุด ได้ครีมที่ milk fat เข้มข้นสุด**",
              "**Standardization = ปรับ % milk fat** ให้อยู่ระดับที่ต้องการ: whole milk แยกเป็น cream + skim milk แล้วผสมกลับตามสัดส่วน (คำนวณแบบ Pearson square มีตัวอย่างโจทย์ในเอกสาร) ส่วนครีมเกินเอาไปทำชีสได้"
            ]
          }
        ]
      },
      {
        "heading": "Homogenization",
        "source": "Milk pp Vet85 น.30",
        "body": [
          {
            "bullets": [
              "ทำให้ fat แตกตัวเป็นอนุภาคเล็ก รวมเป็นเนื้อเดียวกับนม ไม่ตกตะกอน; เพิ่ม **viscosity**, ความคงตัวและอายุเก็บ, ความนุ่มเนียน, ลดการใช้สารเติมแต่ง, คงสีและรสชาติ",
              "ใช้กับ milk, yogurt, ice-cream, butter รวมถึง soy milk, egg products, fruit juice, sauce",
              "Timing 2 แบบ: **ก่อน heat treatment เน้น hygiene**; **หลัง heat treatment เพื่อลด rancidity ที่เกิดจาก milk lipases**"
            ]
          }
        ]
      },
      {
        "heading": "Heat treatment และ heat exchangers",
        "source": "Milk pp Vet85 น.30",
        "body": [
          {
            "bullets": [
              "ตารางในการแปรรูป: thermisation 63-65C 15 วิ; LTLT 63C 30 นาที; HTST milk 72-75C 15-20 วิ; HTST cream >80C 1-5 วิ; ultra pasteurization 125-138C 2-4 วิ; **UHT 135-140C 1-3 วิ**; **sterilization 115-120C 20-30 นาที**",
              "เครื่องแลกเปลี่ยนความร้อน 3 แบบ: **plate (PHE)** ของเหลวไหลผ่านแผ่นโลหะหลายชั้น ถ่ายเทความร้อนดี เหมาะของเหลวหนืดต่ำ; **tubular (THE)** ไหลในท่อซ้อนกัน counter current หรือ co-current flow ทนอุณหภูมิสูงกว่า; **scraped-surface** double cylinder + scraper blade เหมาะของหนืดสูง เช่น ice cream, tomato sauce, juice concentrate"
            ]
          }
        ]
      },
      {
        "heading": "ผลิตภัณฑ์นม",
        "source": "Milk pp Vet85 น.31-34",
        "body": [
          {
            "bullets": [
              "**Pasteurized milk**: ตรวจคุณภาพนมดิบ, thermization 63-65C 15 วิ (ยืด shelf life ก่อน pasteurize), homogenization, pasteurization (LTLT >63C 30 นาที / HTST 72-75C 15-20 วิ แล้ว cooling 5C), บรรจุ",
              "**UHT milk** ให้ความร้อนหลายรอบ: thermization, homogenization, pasteurization 83-85C 15-16 วิ แล้ว **sterilization + homogenization 135-150C นาน 2-3 วิ** และ aseptic packaging; ลด browning กว่า sterilization ทำลาย spore ได้ เก็บ 5-6 เดือน; direct (injection, infusion) / indirect (plate, tube) system",
              "**Sterilized milk**: ปิดภาชนะสนิท**ก่อน**ให้ความร้อน 115-120C นาน 20-30 นาที เก็บได้นานกว่า UHT",
              "**นมผง (dried milk)**: standardized milk, pasteurization, evaporation, homogenization, dehydration (drum drier หรือ spray drier); ทำจากนมดิบล้นตลาด เก็บนาน ส่งออกได้; **milk tablet** ใช้หลักการอัด (compression): Talcum = ตัวประสานให้คงตัว, Cab-o-sil = กันจับเป็นก้อน, icing sugar ให้ความหวาน",
              "**นมข้นหวาน**: น้ำตาล ~50%, น้ำมันปาล์ม 10%, นมผง 8%, เวย์ผง 8%; ขั้นตอนมี sugar addition, evaporation, **seeding and crystallization** คุมผลึกน้ำตาลให้เนื้อเนียน, บรรจุกระป๋อง sterilized",
              "**นมข้นจืด (evaporated milk)**: นมสดระเหยน้ำออกบางส่วน ไม่เติมน้ำตาล; มี pilot sterilization test ก่อน sterilization จริง",
              "**Cheese**: acidify milk (denature โปรตีน เกิด curd), เติม coagulant, cut the curd, agitate เพิ่มอุณหภูมิ (cook) ล้าง curd, aging; แบ่ง soft / semi-hard (cheddar) / hard (parmesan)",
              "**Yogurt** ต้องมี 2 ตัวทำงานร่วมกัน: **Lactobacillus bulgaricus ย่อย casein และสร้างสภาพแวดล้อมให้เหมาะกับ Streptococcus thermophilus**; **S. thermophilus ใช้ glucose และ lactose ผลิต lactic acid** และกระตุ้น L. bulgaricus ผลิตกรดและ volatile fatty acid (เปรี้ยว หอม); 2 แบบ: set type (กึ่งแข็ง) กับ stirred type (คนได้ ไม่แข็ง)",
              "**Whey powder**: โปรตีนคุณภาพสูง complete protein มี essential amino acids ครบ ย่อยง่าย เป็น liquid residue จากการทำชีส เคซีน โยเกิร์ต ราคาสูง"
            ]
          },
          {
            "callout": "ขั้น cut the curd เอกสารเขียนว่า solid = butter, liquid = whey ส่วนของแข็งที่ได้จากการตัดโดยทั่วไปคือ curd ที่นำไปทำชีส น่าจะเป็นจุดพิมพ์คลาดของเอกสาร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สวนจิตรลดา และ อ.ส.ค.",
        "source": "Milk pp Vet85 น.35",
        "body": [
          {
            "bullets": [
              "โรงโคนม/ศูนย์รวมนม สวนจิตรลดา: รับซื้อน้ำนมจากเกษตรกร แก้ปัญหา **น้ำนมดิบล้นตลาด**; เป็น**ต้นแบบการผลิตนม UHT จากนมโคสด 100%**",
              "โรงนมผง โรงนมเนยแข็ง: เกิดจากผลกระทบเรื่องกลไกราคานม ผลิตนมผงเป็นทางเลือกการแปรรูป ผลิตเนยแข็ง Gouda, Cheddar และโยเกิร์ต",
              "โรงงานแปรรูปนม โครงการส่วนพระองค์: ผลิตนม pasteurized, sterilized และไอศกรีม soft serve สาธิตการแปรรูปสร้างมูลค่าเพิ่ม",
              "**อ.ส.ค.** (องค์การส่งเสริมกิจการโคนมแห่งประเทศไทย): ผลิตภัณฑ์จากนมโคสด 100%; พันธกิจ: ส่งเสริมการเลี้ยงโคนมเป็นอาชีพแก่เกษตรกรไทย พัฒนาธุรกิจอุตสาหกรรมนมให้ครบวงจร สร้างแหล่งความรู้ด้านกิจการโคนม บริหารองค์กรด้วยธรรมาภิบาล"
            ]
          }
        ]
      }
    ]
  },
  "milk-cleaning": {
    "topic": "milk-cleaning",
    "title": "Cleaning and disinfectants in MCC",
    "icon": "🧼",
    "summary": "การทำความสะอาดสายการผลิตนม คุณสมบัติ disinfectant ในอุดมคติ กลไกการทำลายเชื้อ สารฆ่าเชื้อรายกลุ่ม และการคำนวณ Phenol coefficient",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "กติกาการทำความสะอาดสายการผลิตนม (CIP)",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.2",
        "body": [
          {
            "bullets": [
              "CIP ระหว่าง pasteurization: ล้างด้วยน้ำอุ่นนาน 10 นาที เพื่อเอา **milk fat ที่ตกค้าง** ออก",
              "หยุด pasteurization นานเกิน **4 ชั่วโมง** ต้อง re-cleaning ระบบก่อนเดินเครื่องใหม่",
              "หยุดผลิตเป็นเวลานาน ต้องทำความสะอาดสม่ำเสมอทุกวัน",
              "การล้างด้วยไอน้ำหรือน้ำร้อน ใช้อุณหภูมิ **85 องศาเซลเซียส** (ตัวเลขนี้ปรากฏในข้อสอบที่บันทึกไว้ น.3)"
            ]
          }
        ]
      },
      {
        "heading": "คุณสมบัติของ disinfectant ในอุดมคติ",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.2",
        "body": [
          {
            "bullets": [
              "**Broad spectrum** ครอบคลุมเชื้อกว้าง และ **fast acting** ฆ่าเชื้อได้เร็ว",
              "ไม่ถูกรบกวนจากปัจจัยแวดล้อม เช่น เลือด เศษเนื้อ สบู่ ดีเทอร์เจนต์ สารเคมีอื่น",
              "ไม่เป็นพิษต่อผู้ใช้ ไม่กัดกร่อนเครื่องมือ/พื้นผิวโลหะ",
              "มี residual effect บนพื้นผิวหลังใช้",
              "ใช้ง่าย ฉลากชัด ไม่มีกลิ่นรบกวน ราคาประหยัด",
              "ละลายน้ำได้ คงตัวทั้งรูปเข้มข้นและเจือจาง ชะล้างได้ดี และเป็นมิตรต่อสิ่งแวดล้อมเมื่อทิ้ง"
            ]
          }
        ]
      },
      {
        "heading": "กลไกการทำลายเชื้อของ disinfectant ในการผลิตนม",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.2",
        "body": [
          {
            "bullets": [
              "ทำให้โครงสร้างโปรตีนและไขมันเสียสภาพ: quaternary ammonium compounds, chlorhexidine, phenolic compounds, กรด-ด่าง, **alcohol**",
              "ทำลาย covalent bond: **aldehydes** และ enzymes",
              "เป็น oxidizing agent ต่อธาตุ C S N: **halogens**, hydrogen peroxide, ozone"
            ]
          }
        ]
      },
      {
        "heading": "สารฆ่าเชื้อรายกลุ่ม",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.2",
        "body": [
          {
            "sub": "Alcohol",
            "body": [
              {
                "bullets": [
                  "เป็นทั้ง antiseptic และ disinfectant ครอบคลุม gram บวก/ลบ, TB, เชื้อรา, ไวรัส (ethanol ฆ่าไวรัสได้)",
                  "กลไก: **ละลายไขมันใน cell membrane ทำให้โปรตีนตกตะกอน/เสียสภาพ**",
                  "Isopropanol ออกฤทธิ์เร็วแต่ระเหยช้าและระคายเคือง"
                ]
              }
            ]
          },
          {
            "sub": "Glutaraldehyde และ aldehydes",
            "body": [
              {
                "bullets": [
                  "ใช้ที่ความเข้มข้น **มากกว่า 2%** ฆ่าสปอร์ได้ดีกว่า formaldehyde **2-8 เท่า**",
                  "ระเหยและระคายเคืองน้อยกว่า formaldehyde ใช้กับ **อุปกรณ์ที่ไม่ทนความร้อน**",
                  "pH dependent ทำงานดีช่วง 7.4-8.5 (ฝั่งด่าง)"
                ]
              }
            ]
          },
          {
            "sub": "Phenolic compounds (phenol, cresol, xylenol)",
            "body": [
              {
                "bullets": [
                  "classical disinfectant ใช้แพร่หลายในโรงพยาบาลและโรงงาน",
                  "กลไก: **ทำลาย cell membrane แล้วทำให้โปรตีนเสียสภาพ**"
                ]
              }
            ]
          },
          {
            "sub": "Surface active agents (quaternary ammonium compounds, cationic)",
            "body": [
              {
                "bullets": [
                  "เป็นทั้ง antiseptic และ disinfectant เช่น benzalkonium, cetylpyridium, benzethonium พิษและการระคายเคืองต่ำ",
                  "ประสิทธิภาพลดเมื่อใช้ร่วมกับสาร **anion** และเมื่อมี **สารอินทรีย์**",
                  "ห้ามเจือจางด้วยน้ำกระด้าง"
                ]
              }
            ]
          },
          {
            "sub": "Halogen compounds",
            "body": [
              {
                "bullets": [
                  "chlorine, iodine และสารประกอบ (sodium/calcium hypochlorite) ฆ่าได้ทั้งแบคทีเรีย รา ไวรัส และ **สปอร์แบคทีเรีย**",
                  "กลไกตามแนวข้อสอบ: **ออกซิไดซ์หมู่ไทออล (thiol)** ทำให้โครงสร้างและหน้าที่ของจุลินทรีย์เปลี่ยนแปลง",
                  "Chlorine: ตัวออกฤทธิ์จริงคือ **hypochlorous acid (HOCl)** ทำงานดีเมื่อ pH ต่ำกว่า 7.5 ใช้กับน้ำประปา สระว่ายน้ำ และล้าง teat แต่ฤทธิ์ลดในสารอินทรีย์",
                  "Sodium hypochlorite = liquid bleach ใช้กับผ้าเปื้อนเลือด/ซีรัม และล้างพื้นผิว"
                ]
              }
            ]
          },
          {
            "sub": "Iodophores",
            "body": [
              {
                "bullets": [
                  "iodine + detergents/wetting agents เช่น povidone ทำงานดีที่ **pH ต่ำกว่า 5 (กรด)** โดยปล่อย iodine ion ไปทำลายเชื้อ",
                  "ระคายเคืองต่ำ ใช้ **จุ่มหัวนมก่อนรีดนม** ล้างมดลูกอักเสบ และทาก่อนผ่าตัด",
                  "**ฤทธิ์ลดลงเมื่อมีสารอินทรีย์สะสม** (จุดที่แนวข้อสอบถาม)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Phenol coefficient (P.C.)",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.2",
        "body": [
          {
            "text": "P.C. = ความเข้มข้น (dilution) ของสารทดสอบที่ฆ่าเชื้อได้ภายใน 10 นาทีแต่ยังไม่ตายที่ 5 นาที หารด้วยค่าเดียวกันของ phenol ภายใต้เงื่อนไขเดียวกัน"
          },
          {
            "bullets": [
              "ตัวอย่างในเอกสาร: สาร X ฆ่า S. typhi ได้ที่ dilution 1/350 ส่วน phenol ทำได้ที่ 1/90 ดังนั้น P.C. = 350/90 = **3.89**",
              "ถ้าค่ากลางของตารางหายไป ให้ใช้ **ค่าเฉลี่ยของสองจุดข้อมูลข้างเคียง** เช่น phenol = (90+100)/2 = 95 และสาร A = (300+350)/2 = 325 ทำให้ P.C. = 325/95 = **3.42**"
            ]
          },
          {
            "callout": "ผู้เขียนสรุประบุว่าข้อคำนวณ P.C. มักมีประมาณ 2-3 ข้อ และตารางในข้อสอบอาจสลับแกนความเข้มข้นกับเวลา ต่างจากในสไลด์ ให้อ่านหัวตารางก่อนคำนวณ",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "milk-industry-std": {
    "topic": "milk-industry-std",
    "title": "Standard of milk industry and products",
    "icon": "🏭",
    "summary": "ISO GMP HACCP มาตรฐานศูนย์รวบรวมน้ำนมดิบ มกษ. 6401(G)-2560 และ GMP 420 โรงงานแปรรูปนม",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ภาพรวมระบบมาตรฐาน",
        "source": "Milk pp Vet85 น.19",
        "body": [
          {
            "bullets": [
              "**ISO 9000** = quality management system, **ISO 22000** = Food Safety Management System โรงงานได้ ISO = มาตรฐานสูงสุด",
              "**HACCP**: จำเป็นถ้าต้องส่งออก แต่ละโรงงานไม่เหมือนกันขึ้นกับ flow การผลิต พัฒนาต่อยอดจาก GMP **ไม่ได้มีทุกโรงงาน**",
              "**GMP-Law**: กฎหมายบังคับ **ต้องมีทุกโรงงาน** ที่เกี่ยวกับอาหาร; GMP-International อ้างอิงกฎจากต่างประเทศ เกี่ยวกับการส่งออก; minimum requirement เป็นเกณฑ์เบื้องต้น; 5ส: สะสาง สะดวก สะอาด สุขลักษณะ สร้างนิสัย"
            ]
          }
        ]
      },
      {
        "heading": "GMP ศูนย์รวบรวมน้ำนมดิบ (มกษ. 6401(G)-2560)",
        "source": "Milk pp Vet85 น.19-22",
        "body": [
          {
            "bullets": [
              "นิยามสำคัญ: **Plate heat exchanger (PHE) ลดอุณหภูมิน้ำนมให้ต่ำทันที** ใช้ทำพลาสเจอไรส์ได้; **CIP = ทำความสะอาดภายในอุปกรณ์โดยไม่แยกชิ้นส่วน เป็นระบบปิด (closed system)**",
              "เครื่องจักร: สแตนเลส ท่อไม่มีรอยปะต่อ ส่วนสัมผัสน้ำนมดิบไม่เป็นสนิม ไม่ทำปฏิกิริยากับน้ำนม; เครื่องชั่ง ตวง วัด **สอบเทียบอย่างน้อยปีละ 1 ครั้ง**; น้ำที่ใช้ในโรงงาน = คุณภาพน้ำดื่ม",
              "การรับน้ำนมดิบ: **ก่อนเทลงถัง** ตรวจสี กลิ่น, CMT/SCC <500,000 cells/ml, alcohol test (ดูการตกตะกอน); **หลังเทลงถัง** ตรวจยาปฏิชีวนะ (Delvo test) และปริมาณจุลินทรีย์ (methylene blue หรือ resazurin)",
              "การลดอุณหภูมิ: หลังรับนมดิบให้ลดเหลือ 4C — ใช้ PHE ลด **ไม่เกิน 4C ทันที** หรือถังเก็บที่มีระบบเย็น ลดไม่เกิน 4C **ภายใน 2 ชั่วโมง**",
              "การขนส่ง: รถขนส่งมี**ฉนวน** รักษาอุณหภูมิไม่เกิน 8C จนถึงปลายทาง เก็บตัวอย่างก่อนออกจากศูนย์ ควบคุมเวลาขนส่ง",
              "ระบบอื่น: traceability สอบย้อนกลับแหล่งที่มา, การฝึกอบรม, ระบบส่งเสริมสมาชิก (ประเมินคุณภาพนมสมาชิก กำหนดราคาตามคุณภาพ SNF fat SCC SPC freezing point), **บันทึกข้อมูลเก็บไว้อย่างน้อย 3 ปี**"
            ]
          }
        ]
      },
      {
        "heading": "GMP 420 โรงงานแปรรูปนม",
        "source": "Milk pp Vet85 น.23-27",
        "body": [
          {
            "bullets": [
              "ออกตาม พ.ร.บ. อาหาร พ.ศ. 2522 กองอาหาร อย. กำกับดูแล ครอบคลุมตั้งแต่ศูนย์รวบรวมน้ำนมดิบ กระบวนการผลิต ถึงการเก็บรักษาผลิตภัณฑ์",
              "แบ่ง 2 ส่วน: **ข้อกำหนดพื้นฐาน** (สถานที่ผลิตอาหารทุกประเภท: อาคาร เครื่องมือ การควบคุมกระบวนการ สุขาภิบาล บุคคล) + **ข้อกำหนดเฉพาะ** (กรรมวิธีเฉพาะและความเสี่ยงสูง เช่น นมพร้อมบริโภคชนิดเหลวผ่านพาสเจอไรซ์)",
              "การผลิตนมพาสเจอไรซ์ 4 หัวข้อ: (1) **รับน้ำนมดิบ**: ป้องกันยาปฏิชีวนะ (Delvo test) + ควบคุมจำนวนเชื้อเริ่มต้น (เก็บ <8C / 24 ชั่วโมง, FIFO) เพื่อกันการสร้าง heat-stable toxin (2) **ควบคุมการพาสเจอไรซ์**: batch (ต้มถังใหญ่ โรงเล็ก ผลิตน้อย) vs continuous (โรงใหญ่ ต้องมี validation ของ holding time) สอบเทียบอย่างน้อยปีละครั้ง (3) **ป้องกันการปนเปื้อนซ้ำ** หลังพาสเจอไรซ์ (ภาชนะ พื้นผิวสัมผัส ผู้บรรจุ) + **ควบคุมอุณหภูมิผลิตภัณฑ์ <=8C หลังพาสเจอไรซ์** ทั้งเก็บและขนส่ง (4) **ผู้ควบคุมการผลิต** ต้องผ่านหลักสูตรที่ อย. หรือหน่วยฝึกอบรมที่ขึ้นทะเบียนกับ อย. รับรอง",
              "การตรวจประสิทธิภาพพาสเจอไรซ์: อุณหภูมิ **>=63C >=30 นาที หรือ >=72C >=15 วินาที ใช้ phosphatase test**; **>=80C >=5 วินาที ใช้ peroxidase test**; ควบคุมอุณหภูมิ-เวลาในทุกรุ่นการผลิตพร้อมบันทึกผล",
              "วิธีฆ่าเชื้อนมโค: LTLT >=63C อย่างน้อย 30 นาที / HTST >=72C อย่างน้อย 15 วินาที แล้วทำให้เย็น **<=5C ทันที**",
              "บทกำหนดโทษ: มาตรา 49 ปรับไม่เกิน 10,000 บาท; มาตรา 58 จำคุกไม่เกิน 2 ปี หรือปรับไม่เกิน 20,000 บาท หรือทั้งจำทั้งปรับ"
            ]
          }
        ]
      },
      {
        "heading": "HACCP",
        "source": "Milk pp Vet85 น.27-28",
        "body": [
          {
            "bullets": [
              "ระบบควบคุมกระบวนการผลิตอาหาร ระบุและป้องกันอันตรายทั้ง **ชีวภาพ เคมี กายภาพ**; ต่างจาก GMP คือไม่ใช่กฎหมายบังคับ โรงงานกำหนดเอง โดย QA/QC หรือสัตวแพทย์ทำได้",
              "**7 หลักการ**: (1) hazard analysis (2) identify CCP (3) establish critical limits ระบุเป็นตัวเลข เช่น อุณหภูมิ เวลา pH (4) monitoring (5) corrective actions (6) verification (7) documentation",
              "**12 ขั้นตอนการนำไปใช้**: ทีม, describe product, intended use, flow diagram, on-site confirmation แล้วต่อด้วย 7 หลักการ",
              "**CCP decision tree**: Q1 มีมาตรการควบคุมไหม (ไม่มี = ปรับปรุงขั้นตอน); **Q2 ขั้นตอนนั้นออกแบบเพื่อลดอันตรายให้อยู่ระดับยอมรับได้ไหม ถ้าใช่ = CCP**; Q3 การปนเปื้อนเกินระดับยอมรับไหม (ไม่ใช่ = No CCP); **Q4 มีขั้นตอนอื่นถัดไปที่กำจัด/ลดอันตรายไหม ถ้ามี = No CCP** ถ้าไม่มี = CCP",
              "ตัวอย่างนม UHT: **CCP1 = milk reception (CL: ต้องไม่มี antibiotic residue)**, **CCP2 = UHT sterilization** (CL ตามเอกสาร: >133C อย่างน้อย 4 วินาที), **CCP3 = aseptic filling** (บรรจุภัณฑ์ต้องปิดสนิท)",
              "CL ต้องเป็นค่าที่วัดได้ ถ้าไม่ผ่านต้องทำ corrective action เช่น re-pasteurization"
            ]
          },
          {
            "callout": "CL ของ CCP2 ในหน้านี้เขียน >133C อย่างน้อย 4 วินาที ขณะที่นิยาม UHT ตามกฎหมายในเอกสารเดียวกันคือ >133C นานกว่า 1 วินาที ควรเช็คกับสไลด์ปีปัจจุบัน",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "milk-biosec-dairy": {
    "topic": "milk-biosec-dairy",
    "title": "Biosecurity on dairy farms",
    "icon": "🚜",
    "summary": "มาตรฐานฟาร์มโคนมและแพะนม (GAP) วงจรใบรับรอง การใช้ยาสัตว์ และสุขศาสตร์ทุ่งหญ้า",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "มาตรฐานฟาร์มโคนม (GAP)",
        "source": "Milk pp Vet85 น.50",
        "body": [
          {
            "bullets": [
              "GAP / มาตรฐานฟาร์มเลี้ยงสัตว์ = วิธีการปฏิบัติที่ดีในการเลี้ยงสัตว์ ให้ได้น้ำนมคุณภาพดี ถูกสุขลักษณะ ปลอดภัยต่อผู้บริโภค; 4 ด้าน: **การจัดการฟาร์ม การจัดการด้านสุขภาพสัตว์ สวัสดิภาพสัตว์ การจัดการด้านสิ่งแวดล้อม**",
              "ขนาดฟาร์มโคนม (นับเฉพาะ **แม่โค = โคที่เคยคลอดลูกแล้ว** ไม่ใช่โคสาว): เล็ก **ไม่เกิน 20 ตัว**, กลาง 21-100 ตัว, ใหญ่ มากกว่า 100 ตัว",
              "เกณฑ์ตรวจประเมิน 7 หมวด: องค์ประกอบฟาร์ม การจัดการฟาร์ม บุคลากร สุขภาพสัตว์ สวัสดิภาพสัตว์ สิ่งแวดล้อม การบันทึกข้อมูล (แต่ละข้อจัดเป็น MAJOR/MINOR/REC)"
            ]
          }
        ]
      },
      {
        "heading": "วงจรใบรับรอง และการตรวจประเมิน",
        "source": "Milk pp Vet85 น.51",
        "body": [
          {
            "bullets": [
              "Maintaining = คงไว้ซึ่งการอนุมัติ GAP + ตรวจติดตาม; recertification = ต่ออายุเมื่อใกล้หมด",
              "**Suspending (พักใช้)** 3 กรณี: ไม่ปฏิบัติตามหลักเกณฑ์/เงื่อนไข, ไม่แก้ไขข้อบกพร่องในเวลากำหนด, **หยุดพักการเลี้ยงสัตว์ชั่วคราว 6 เดือน ถึง 1 ปี**",
              "**Withdrawing (เพิกถอน)** 4 กรณี: ไม่ปฏิบัติตามหลักเกณฑ์, ไม่ปฏิบัติตามระบบในสาระสำคัญ, **ถูกพักใช้ 2 ครั้งภายใน 3 ปี**, มีข้อร้องเรียนที่ก่อความเสียหายต่อการรับรอง",
              "**Cancelling (ยกเลิก)**: เลิกประกอบกิจการ เสียชีวิต โอนกิจการให้บุคคลอื่นที่ไม่ใช่สมาชิกในครอบครัว หรือไม่สามารถปฏิบัติตามที่เปลี่ยนแปลงภายหลังได้",
              "Audit 6 แบบ: initial (ละเอียดทุกข้อ ครั้งแรก), surveillance (ติดตามหลังได้ใบ), follow-up (ตามผลการแก้ไข), recertification, **special audit (มีปัญหา/ข้อร้องเรียน เข้าตรวจเฉพาะเรื่อง โดยไม่แจ้งฟาร์มล่วงหน้า)**",
              "ข้อบกพร่อง: **minor** = ไม่เป็นไปตามข้อกำหนดบางส่วน ไม่มีผลร้ายแรงต่อระบบการผลิต; **major** = ไม่ปฏิบัติตาม GAP ที่ส่งผลร้ายแรง; recommendation/observation = ไม่ถือเป็นข้อบกพร่อง แต่ละเลยได้จะนำไปสู่ข้อบกพร่อง"
            ]
          }
        ]
      },
      {
        "heading": "มาตรฐานฟาร์มแพะนม และการใช้ยาสัตว์",
        "source": "Milk pp Vet85 น.54-58",
        "body": [
          {
            "bullets": [
              "**น้ำนมแพะดิบ** = น้ำนมรีดจากแม่แพะ **หลังคลอดลูกแล้วเป็นเวลาไม่น้อยกว่า 3 วัน** ไม่แยกองค์ประกอบหรือเติมวัตถุอื่น ไม่ผ่านกรรมวิธีใด ยกเว้นการทำให้เย็น",
              "เกณฑ์ประเมินฟาร์มแพะนมโครงเดียวกับโคนม: องค์ประกอบฟาร์ม อาหาร น้ำ การจัดการฟาร์ม บุคลากร สุขภาพสัตว์ สวัสดิภาพ สิ่งแวดล้อม บันทึกข้อมูล + หมวดการผลิตน้ำนมดิบ (ผู้รีด การเตรียมแม่ก่อนรีด การรีด การเก็บรักษา-ขนส่ง)",
              "การเก็บตัวอย่างอาหารสัตว์ส่งตรวจ (ฟาร์มโคนม-แพะนม): aflatoxin ชนิด B1, กลุ่ม nitrofuran, oxytetracycline, chlortetracycline ผ่าน screening test",
              "การใช้ยาสัตว์: จ่าย-สั่งใช้โดยสัตวแพทย์หรือผู้ได้รับมอบหมายภายใต้การดูแล; กรณียาไม่ขึ้นทะเบียนกับ target species (**off label use**) ต้องอยู่ใต้การกำกับของสัตวแพทย์พร้อมบันทึก; **ต้องมีระยะเวลาหยุดยา (withdrawal period) ก่อนส่งน้ำนม/ผลิตภัณฑ์ถึงผู้บริโภค**",
              "ยาต้านจุลชีพ: คำนึงผลกระทบต่อเชื้อประจำถิ่น (commensal flora) และเลือกยา **ออกฤทธิ์แคบ (narrow spectrum) เป็นลำดับแรกก่อน**; **บันทึกประวัติการใช้ยาเก็บไว้อย่างน้อย 3 ปี**"
            ]
          }
        ]
      },
      {
        "heading": "สุขศาสตร์ทุ่งหญ้า",
        "source": "Milk pp Vet85 น.59-60",
        "body": [
          {
            "bullets": [
              "ทุ่งหญ้าที่ดี: คำนึงคุณภาพ+ปริมาณหญ้า ไม่เป็นแหล่งแพร่และสะสมโรค ไม่เอื้อต่อการเจริญของจุลชีพ พยาธิ และปรสิต",
              "อายุหญ้าที่ตัด: หญ้าอายุน้อยตัด **30-45 วัน ให้ผลผลิตดีกว่าที่ตัด 60 วัน**; หญ้าอายุมาก คุณภาพต่ำ **crude protein น้อย crude fiber มาก**; อายุตัด 45-60 วันเหมาะสำหรับหญ้าเนเปียร์ปากช่อง; ไม่ควรตัดชิดดินเกินไป (ลำต้นเหลือน้อย สังเคราะห์แสงได้น้อย)",
              "การควบคุมโรคในทุ่งหญ้า: ไม่ปล่อยสัตว์ป่วยลงแปลง (แยกรักษาให้หายก่อน), สัตว์ในแปลงปลอดโรค (ถ่ายพยาธิ กำจัดปรสิตภายนอก), ระบายน้ำไม่ให้มีแอ่งน้ำขัง, แหล่งน้ำสะอาด, แปลงที่เคยมีโรคระบาดร้ายแรง กำจัดเชื้อลงไถอย่างน้อยด้านล่างแล้วปลูกหญ้าใหม่, สลับปลูกพืชเศรษฐกิจอื่น, เผาแปลงฆ่าเชื้อได้ (แต่เกิด pollution ไฟลุกลาม หน้าดินเสีย), **ผงกำมะถันโรยดินทำให้ดินเป็นกรดอ่อนๆ กำจัดพยาธิในดิน**",
              "ระบบแทะเล็ม: **continuous stocking** (ปล่อยกินอิสระ ไม่ลงทุนจัดการ แต่ใช้ทุ่งหญ้าไม่เต็มที่ **คุมการแพร่โรคไม่ได้**); **rotation grazing** (แบ่งแปลงหมุนเวียน หญ้าได้พักฟื้น สม่ำเสมอ **ลดโอกาสการติดโรคเพราะพักแปลงให้ระยะเวลาไข่พยาธิถูกทำลาย**); **strip grazing** (จำกัดพื้นที่ตามความต้องการรายวัน ใช้แปลงมีประสิทธิภาพ คุมโรคได้ แต่ต้องใช้แรงงาน ทุนรั้ว และคำนวณแม่นยำ); **zero grazing / cut and carry** (ตัดหญ้าให้กินในคอก คุมปริมาณได้ **ไม่มีการปนเปื้อนจากเชื้อโรคและไข่พยาธิ** แต่แรงงานเพิ่ม สัตว์ขาดการออกกำลังกาย)"
            ]
          },
          {
            "callout": "หัวข้อสุขศาสตร์ทุ่งหญ้าไม่มี topic แยกใน curriculum จึงเก็บไว้ใต้ biosecurity ของฟาร์มซึ่งใกล้เคียงที่สุด",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "milk-overview": {
    "topic": "milk-overview",
    "title": "Introduction to Milk Hygiene",
    "icon": "🐄",
    "summary": "นมในฐานะอาหาร กายวิภาคและสรีรวิทยาเต้านมโค การสร้างและการหลั่งน้ำนม",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "นมในฐานะอาหาร และทำไมนมมีสีขาว",
        "source": "Milk pp Vet85 น.37",
        "body": [
          {
            "bullets": [
              "นมสีขาวเพราะ **casein กระจายตัวทำให้แสงกระเจิง** ร่วมกับ cream ที่ทำให้นมขุ่น ของเหลวไม่ดูดซับแสงจึงสะท้อนกลับเป็นสีขาว",
              "นมโค **ไม่แนะนำให้แช่แข็ง** เพราะโปรตีนเสียสภาพ แยกตัว ตกตะกอน และไม่ควรเก็บนมด้วยการแช่แข็งเพื่อรอตรวจ เพราะ bacterial count จะเพี้ยน",
              "นมแม่คนแช่แข็งได้เพราะเน้น Ig มากกว่าโปรตีน แต่ห้าม freeze ซ้ำบ่อยๆ",
              "นม 1 แก้ว (240 ml) ให้โปรตีน 17%, แคลเซียม 29%, ฟอสฟอรัส 23%, riboflavin 23%, vitamin D 25%, B12 15% ของความต้องการต่อวัน",
              "นมสารอาหารสูง จุลชีพก็ชอบเช่นกัน นมจึงเป็น **perishable food** เน่าเสียง่าย"
            ]
          }
        ]
      },
      {
        "heading": "กายวิภาคเต้านมโค และ suspensory system",
        "source": "Milk pp Vet85 น.37",
        "body": [
          {
            "bullets": [
              "1 udder = **4 mammary glands (quarters)** เป็น skin gland บริเวณ inguinal",
              "เต้านมคู่หลังมีน้ำหนักและให้น้ำนม **50-60% ของทั้งหมด**",
              "โครงสร้างพยุง 7 ชั้น: skin, superficial fascia, coarse areolar tissue, subpelvic tendon, superficial lateral suspensory ligament (fibrous + elastic ยืดได้), deep lateral suspensory ligament (fibrous ล้วน ยืดไม่ได้), median suspensory ligament",
              "**Median suspensory ligament สำคัญที่สุด** เป็น elastic tissue แข็งแรงมาก แบ่งเต้านมซีกซ้าย-ขวา"
            ]
          }
        ]
      },
      {
        "heading": "โครงสร้างภายใน หลอดเลือด น้ำเหลือง ประสาท",
        "source": "Milk pp Vet85 น.38",
        "body": [
          {
            "bullets": [
              "Secretory tissue = **alveoli รวมเป็น lobule แล้วเป็น lobe** พัฒนาขึ้นกับสายพันธุ์ สุขภาพ การเจริญเติบโต อาหาร",
              "กล้ามเนื้อหูรูด **Furstenberg's rosette ป้องกันน้ำนมรั่ว**ก่อนถูกรีด",
              "การสร้างน้ำนมใช้เลือดมาก เฉลี่ยเลือด **400-500 หน่วยไหลผ่านเต้านมต่อการสร้างน้ำนม 1 หน่วย**",
              "Arterial: aorta ถึง external pudic artery ลอดผ่าน inguinal canal มี **sigmoid flexure** กันการกดทับเวลาน้ำนมเต็มเต้า",
              "**Milk vein = subcutaneous abdominal vein** ระบายจากเต้าคู่หน้าเข้า vena cava รวมเป็น venous circle รอบเต้านม",
              "Supramammary lymph node ข้างละ 2-3 ต่อม ถ้าระบายไม่ดีจะบวมน้ำ เกี่ยวข้องกับ mastitis",
              "เต้านมมีประสาทน้อย ขึ้นกับฮอร์โมนเป็นหลัก **มีแต่ sympathetic ไม่มี parasympathetic**"
            ]
          }
        ]
      },
      {
        "heading": "การสร้างน้ำนม การหลั่งน้ำนม และการรีด",
        "source": "Milk pp Vet85 น.39",
        "body": [
          {
            "bullets": [
              "ใน secretory cell: **lactose สร้างจาก glucose**, casein จาก amino acids, triglyceride จาก acetate, butyrate และ fatty acids",
              "Milk let-down อาศัยฮอร์โมน ไม่ใช่ระบบประสาทโดยตรง: stimulus (ดูดนม นวดเต้า เสียง กลิ่น) กระตุ้นประสาทไป pituitary gland หลั่ง **oxytocin** ทำให้ myoepithelium รอบ alveoli หดตัว",
              "ความเครียด/ตื่นเต้น หลั่ง epinephrine หลอดเลือดหดตัว oxytocin ไปไม่ถึง myoepithelial cells **น้ำนมไม่ไหลออกมา**",
              "Oxytocin หลั่งภายใน 30 วินาทีหลัง stimulus อยู่ในเลือด **~8 นาที**, teat opening ปิดใน 30 นาที ถึง 2 ชั่วโมง",
              "ควรรีดทุก 12 ชั่วโมง ครั้งละไม่เกิน 7-8 นาที"
            ]
          }
        ]
      }
    ]
  },
  "milk-products-storage": {
    "topic": "milk-products-storage",
    "title": "Storage of milk products",
    "icon": "🧀",
    "summary": "อายุการเก็บรักษาผลิตภัณฑ์นมแต่ละชนิด ทั้งก่อนเปิดและหลังเปิด",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "ความผิดปกติของนม และหลักการเก็บ",
        "source": "Milk pp Vet85 น.47",
        "body": [
          {
            "bullets": [
              "Abnormalities: **abnormal milk** (สี กลิ่น เนื้อสัมผัสผิดปกติ เห็นชัด), **undesirable milk** (ไม่ควรจำหน่าย เช่น colostrum), **contaminated milk** (ปนเปื้อน เช่น antibiotic ไม่ควรจำหน่าย)",
              "หลักการ: คงคุณสมบัติทางสรีรวิทยา รักษาสารอาหาร รักษาคุณภาพด้านจุลชีววิทยา เป้าหมายคือปลอดภัยและส่งเสริมสุขภาพ"
            ]
          }
        ]
      },
      {
        "heading": "อายุการเก็บของแต่ละผลิตภัณฑ์",
        "source": "Milk pp Vet85 น.47",
        "body": [
          {
            "bullets": [
              "**Pasteurized**: LTLT 63C 30 นาที nutrient สูงแต่อายุน้อย / HTST 71.7C 15-20 วิ นิยม เก็บได้นานขึ้น 2-3 สัปดาห์; ฆ่าเชื้อก่อโรคแต่ไม่หมด เหลือ enzyme remnants; เก็บ <4C (เอกสารส่วนนี้เขียนไม่เกิน 3 วัน) ห้ามฟรีซ หลีกเลี่ยงแดด",
              "**UHT**: >135C 1-2 วินาที ฆ่าเชื้อและ spore เกือบหมด อาจมีกลิ่นเฉพาะ; ไม่เปิดเก็บอุณหภูมิห้อง **6 เดือน**; เปิดแล้ว <10C ไม่เกิน 3 สัปดาห์ (ควรดื่มให้หมด)",
              "**Sterilized**: 120C ไม่กี่นาที หรือ >100C 20-30 นาที คุณค่าอาหารต่ำมาก ฆ่าเชื้อและ spore ได้; ไม่เปิดเก็บได้ **1-2 ปี**; เปิดแล้ว <10C ไม่เกิน 3 สัปดาห์",
              "**นมข้น (concentrated)**: เติม nitrogen/CO2 ไม่เกิน 1 cc ลดโอกาสจุลชีพ; กระป๋องไม่เปิด 6 เดือนถึงหลายปี; เปิดแล้ว <4C ไม่เกิน 3 สัปดาห์",
              "**นมผง**: ไม่ต้องแช่เย็นเพราะความชื้นต่ำ; ไม่เปิดเก็บห้อง 6 เดือน (skim milk powder 3 ปี); เปิดแล้วไม่เกิน 2 สัปดาห์; ละลายแล้ว <10C",
              "**Cream**: <4C ไม่เกิน 2 เดือน ไม่ควรแช่แข็ง (แยกชั้น ตกตะกอน)",
              "**Fermented milk / yogurt**: <5C ไม่เกิน 10 วัน ไม่ควรแช่แข็ง (แบคทีเรียดีตาย แยกชั้น); pasteurized yogurt เก็บได้นานขึ้น",
              "**Butter**: <4C ได้ 8 สัปดาห์ขึ้นไป เปิดแล้วไม่เกิน 3 สัปดาห์ freeze ได้ 6 เดือน",
              "**Cheese** (<4C): soft 1 สัปดาห์, semisoft 3-4 สัปดาห์, hard **10 เดือน**"
            ]
          }
        ]
      }
    ]
  },
  "meat-hygiene-intro": {
    "topic": "meat-hygiene-intro",
    "title": "Meat hygiene intro",
    "icon": "🥩",
    "summary": "นิยาม meat hygiene ประเภทเนื้อสัตว์ muscle fiber types โปรตีนและ dipeptides สำหรับระบุชนิดเนื้อ ไขมัน แร่ธาตุ วิตามิน",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "นิยามและประเภทเนื้อสัตว์",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.4",
        "body": [
          {
            "bullets": [
              "Meat hygiene = expert supervision of all meat products เพื่อให้ได้ **wholesome meat สำหรับการบริโภคของมนุษย์** และป้องกันอันตรายต่อ public health",
              "Meat = animal tissues that are **suitable for use as food**",
              "หมวดหมู่: red meat (โค สุกร แกะ/แพะ ลูกวัว), poultry (ไก่ ไก่งวง เป็ด ห่าน), seafood (ปลา หอย ปู กุ้ง), game meat (เนื้อจากสัตว์ที่ไม่ใช่สัตว์เลี้ยง non-domesticated)"
            ]
          }
        ]
      },
      {
        "heading": "Muscle fiber types",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.4",
        "body": [
          {
            "bullets": [
              "จำแนกตาม **myosin isoforms**: Type I และ IIA = red muscle fibers, Type IIX(D) และ IIB = white muscle fibers",
              "Red fiber (Type I): หดตัวช้า **myoglobin สูง capillary density สูงสุด** oxidative metabolism เด่น",
              "White fiber (Type IIB): หดตัวเร็วสุด **fiber diameter ใหญ่** glycolytic metabolism เด่น",
              "สัมพันธ์กับสีเนื้อและความนุ่มของเนื้อ"
            ]
          }
        ]
      },
      {
        "heading": "โปรตีนและ dipeptides ระบุชนิดเนื้อ",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.4",
        "body": [
          {
            "bullets": [
              "สารกลุ่ม purine, pyrimidine, nucleopeptide ให้ flavor และ aroma ของเนื้อ",
              "Dipeptides: Carnosine (CAR), Anserine (ANS), Balenine (BAL) ใช้ทำ **meat species identification**",
              "ตารางในเอกสาร: เนื้อโค (ขา) Car/Ans = **5.45**, Bal/Ans = 0.017; เนื้อสุกร (ขา) Car/Ans = 20.8, **Bal/Ans = 1.25**; เนื้อม้า (ขา) Car/Ans = 242"
            ]
          },
          {
            "callout": "แนวข้อสอบที่บันทึกไว้ (น.7) ใช้ช่วง Carnosine/Anserine ratio 5.2-7.2 สำหรับยืนยันเนื้อโค และใช้ Balenine/Anserine ratio เป็นตัวเด่นของเนื้อสุกร (ค่าเกิน 1)",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ไขมัน แร่ธาตุ คาร์โบไฮเดรต วิตามิน",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.4",
        "body": [
          {
            "bullets": [
              "ความแข็งของไขมันสัมพันธ์กับสัดส่วน **SFA/UFA**",
              "PUFA:SFA ratio สูงสุดใน **salmon (1.41)**; n-6/n-3 ratio สูงสุดใน **pork (7.22)** ต่ำสุดใน salmon (0.34)",
              "เนื้อเป็นแหล่ง **เหล็ก (heme-iron) และสังกะสี** ที่ดี แต่ **แคลเซียมต่ำ**",
              "คาร์โบไฮเดรตในเนื้อสดต่ำ เก็บในรูป glycogen (ตับ 2-8% ของน้ำหนักตับ) แล้วเปลี่ยนเป็น lactic acid หลังตาย",
              "วิตามิน B complex สูง แต่ **วิตามิน C ต่ำ**; ตับอุดมด้วยวิตามิน A, B complex, D และ K"
            ]
          }
        ]
      }
    ]
  },
  "meat-seafood": {
    "topic": "meat-seafood",
    "title": "Seafood hygiene",
    "icon": "🐟",
    "summary": "องค์ประกอบเนื้อสัตว์น้ำ การเสื่อมเสียและกลิ่นคาว การประเมินความสด และสารพิษในอาหารทะเล",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "องค์ประกอบของเนื้อปลา",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "น้ำ 60-80% ของเนื้อปลา: free water เสียไประหว่าง freezing/thawing และการเก็บ ส่วน bound water มีประมาณ 4-5%",
              "**Myofibrillar protein ประมาณ 65-75%** ของโปรตีนทั้งหมด (สัดส่วนสูงกว่าสัตว์บก) เป็น salt-soluble ได้แก่ actin และ myosin",
              "Stroma protein เพียง 3-10% คือ collagen, elastin, gelatin โดย **collagen ต่ำทำให้เนื้อปลานุ่ม** และ thermolabile กว่า",
              "**Non-protein nitrogen (NPN) compounds** ได้แก่ amino acids, dipeptides, nucleotides, guanidine compounds, amine oxides, urea เป็นสารระเหยง่าย กลิ่นแรง รับผิดชอบทั้ง sensorial characteristics และ **การเน่าเสีย**",
              "Guanidine compounds = energy reservoir ของกล้ามเนื้อปลา พบใน **white muscle มากกว่า dark muscle**",
              "**TMAO** พบใน demersal fish มากกว่า pelagic fish มีหน้าที่ควบคุม osmotic pressure เมื่อถูกย่อยสลายกลายเป็น **trimethylamine (TMA) ให้กลิ่นคาว (fishy odor)**"
            ]
          }
        ]
      },
      {
        "heading": "ไขมันและสารอาหารอื่นของสัตว์น้ำ",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.5",
        "body": [
          {
            "bullets": [
              "SFA ประมาณ 20-43% ของกรดไขมันในปลาธรรมชาติ และ **ต่ำกว่าในปลาน้ำเย็น (coldwater fish)**",
              "Omega-3 (DHA, EPA) มีต้นกำเนิดจาก **phytoplankton และ seaweed**",
              "ค่าแนะนำขั้นต่ำของ **PUFA/SFA ratio = 0.45** สำหรับ balanced diet",
              "glycogen ในกล้ามเนื้อปลาต่ำกว่าสัตว์เลี้ยงลูกด้วยนม แต่ marine invertebrate บางชนิดมีคาร์โบไฮเดรตสูง",
              "แร่ธาตุ: Ca และ P สูง; Fe ใน dark muscle มากกว่า white; Zn สูงใน oyster ตับ และเครื่องในปลา; วิตามินละลายไขมัน A D K ใน fish liver oil",
              "Dark muscle เทียบ white muscle: ไขมันและ myoglobin สูงกว่า แร่ธาตุ (Fe) และวิตามินมากกว่า **TMAO สูงกว่า** และมีเอนไซม์มากกว่า"
            ]
          }
        ]
      },
      {
        "heading": "การประเมินความสดของปลาและอาหารทะเล",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "Biochemical/chemical: วัด **total volatile basic nitrogen (TVB-N)** ครอบคลุม TMA, DMA, ammonia เหมาะกับ **cephalopods และ crustaceans**",
              "Physical: วัด pH โดยจิ้ม electrode ลงเนื้อปลา/suspension และ mollusks",
              "ตรวจ **indole** จาก tryptophan degradation ใช้ประเมินความสดของ **กุ้งและปู**",
              "**Sensory methods ใช้ได้กับปลาและอาหารทะเลทุกชนิด** เร็วและไม่ทำลายตัวอย่าง ตัดสินจาก appearance, odor, texture, flavor มีระบบ Quality Index Method (QIM)",
              "Microbiological: total counts บอก shelf life และตรวจ spoilage bacteria",
              "แบคทีเรียในลำไส้ปลาทะเล/น้ำจืดและหอย: **Achromobacter, Pseudomonas, Flavobacterium**",
              "Melanosis ในกุ้ง: เอนไซม์ tyrosinase (ในเอกสารสะกดว่า tylosinase) สร้างเม็ดสี melanin ทำให้เนื้อกุ้งมีจุดคล้ำ"
            ]
          }
        ]
      },
      {
        "heading": "สารพิษในอาหารทะเล",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.6",
        "body": [
          {
            "bullets": [
              "Puffer fish poisoning: กินปลากลุ่ม tetraodontiformes (fugu) พิษคือ **tetrodotoxin ซึ่งสร้างโดยแบคทีเรีย** (Proteobacteria, Firmicutes, Actinobacteria, Bacteroidetes)",
              "อาการคล้าย PSP เด่นที่ **ระบบประสาท** อาจมีคลื่นไส้ อาเจียน ปวดท้องตามมา"
            ]
          },
          {
            "callout": "ข้อสอบที่บันทึกไว้ (น.7) จัด domoic acid, brevetoxin, saxitoxin เป็นกลุ่ม phytotoxins, จับคู่ saxitoxin กับ tetrodotoxin เป็นพิษต่อระบบประสาทที่ทำให้เสียชีวิต และโยง red tide กับพิษต่อระบบประสาท",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "meat-microbiology": {
    "topic": "meat-microbiology",
    "title": "Microbiology of meat",
    "icon": "🦠",
    "summary": "การควบคุมจุลินทรีย์บนเนื้อ เชื้อเด่นตามสภาวะการเก็บ เกณฑ์จุลชีววิทยาของกรมปศุสัตว์ และคำตอบข้อเขียนที่บันทึกไว้",
    "provenance": "vet85",
    "sections": [
      {
        "heading": "หลักการควบคุมจุลินทรีย์บนเนื้อสัตว์",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.8",
        "body": [
          {
            "bullets": [
              "เนื้อยังไม่บูดถ้าจำนวนแบคทีเรีย **ต่ำกว่า 10^6** การยืด lag phase = ยืดอายุการเก็บ",
              "3 ขั้นตอนหลัก: (1) **ป้องกันการปนเปื้อน** เช่น ไม่เปิดช่องท้องก่อนถลกหนัง สุขอนามัยส่วนบุคคล อุปกรณ์สะอาด (2) **ทำลาย/ลดจำนวนเชื้อ** เช่น trimming, ล้างซากด้วยน้ำร้อน **82 องศาเซลเซียส**, พ่นกรดอินทรีย์ (lactic acid 1-2%), steam pasteurization, ฉายรังสี gamma 5 kGy (3) **ป้องกัน/ชะลอการเจริญ** เช่น ลดอุณหภูมิเนื้อและซากเหลือ 4 องศาเซลเซียสโดยเร็ว, vacuum package",
              "การเก็บตัวอย่าง 5 ขั้น: sampling (swabbing, rinsing, excision), dilution, plating, incubation, นับ colony"
            ]
          }
        ]
      },
      {
        "heading": "เชื้อเด่นตามสภาวะการเก็บ",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.8-9",
        "body": [
          {
            "bullets": [
              "**Pseudomonas spp.** (gram ลบ, obligate aerobe, psychrotroph) = สาเหตุสำคัญที่สุดของ **aerobic spoilage** และเชื้อเด่นบน **chilled meat** รวมถึง consumer packaged meat (บรรจุภัณฑ์ให้ O2 ผ่านสูง)",
              "**Brochothrix thermosphacta** (gram บวก, facultative anaerobe โตได้ที่อุณหภูมิต่ำ aw ต่ำ) และ **Lactobacillus spp.** (aerotolerant, โตดีในสภาพกรด pH ไม่เกิน 4.5 ให้กลิ่น cheesy) = ตัวหลักของ **vacuum packaged meat** และเด่นขึ้นเมื่อ aw ลด",
              "**Clostridium spp.** (spore-forming, obligate anaerobe จากดินและทางเดินอาหาร) ร่วมกับ **Enterococcus** = ตัวการ **deep spoilage** เช่น bone taint ในเนื้อติดกระดูก",
              "ยีสต์ Candida, Torulopsis, Rhodotorula, Candida zeylanoides, Yarrowia lipolytica ทำให้เกิด **slime**",
              "จากหน้า matching: รา **Chrysosporium pannorum ทำจุดสีขาว**, **Cladosporium herbarum ทำจุดสีดำ**, Moraxella = low spoilage potential, Enterobacter liquefaciens = เน่าเสียของ vacuum packaged DFD meat (pH สูงกว่า 6), Shewanella (Alteromonas) putrefaciens สัมพันธ์กับ DFD",
              "Freshly-slaughtered meat มีเชื้อราว 10^2-10^4 CFU/g เป็น mesophiles (coliforms, enterococci) จากผิวหนัง ลำไส้ สิ่งแวดล้อม และคน",
              "Micrococcus, Streptococcus, Staphylococcus **ทนต่อ freezing/frozen storage** ได้ดีกว่าเชื้ออื่น"
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์จุลชีววิทยาของกรมปศุสัตว์ (DLD)",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.8",
        "body": [
          {
            "bullets": [
              "เนื้อปรุงสุก: aerobic plate count ไม่เกิน **1.0x10^5 CFU/g**, coliform ไม่เกิน 100, Enterococcus ไม่เกิน 100, yeasts & molds ไม่เกิน 100",
              "เนื้อปรุงสุกต้องตรวจไม่พบ (ND): **E. coli, S. aureus, C. perfringens** และใน 25 g ต้องไม่พบ **Salmonella, Listeria monocytogenes, Campylobacter jejuni/coli**",
              "เนื้อดิบ: aerobic plate count ไม่เกิน 5.0x10^5, coliform ไม่เกิน 5,000, E. coli ไม่เกิน 100, S. aureus ไม่เกิน 100, Enterococcus ไม่เกิน 1,000",
              "**Salmonella ต้องไม่พบใน 25 g ทั้งเนื้อดิบและเนื้อปรุงสุก** (เชื้อเดียวที่ ND ทั้งสองแบบ)"
            ]
          }
        ]
      },
      {
        "heading": "คำตอบข้อเขียนที่รุ่นก่อนบันทึกไว้",
        "source": "ซอยจุ๊ Meat Hygiene (Vet 85) น.9",
        "body": [
          {
            "bullets": [
              "ปัจจัย 2 อย่างที่สำคัญที่สุดต่อจุลินทรีย์บน chilled meat = **อุณหภูมิ และ water activity**",
              "การตรวจเชื้อปนเปื้อนขั้นต่ำ = **total plate count + จำนวนเชื้อตระกูล Enterobacteriaceae และ coliforms**",
              "เชื้อที่ห้ามพบในเนื้อปรุงสุก 4 ตัว = S. aureus, E. coli, Salmonella spp., Listeria monocytogenes",
              "การลด pH ที่เร็วผิดปกติขณะซากยังอุ่นทำให้เนื้อสุกรเป็น **PSE (Pale, Soft, Exudative)**",
              "ประโยชน์ของ growth curve: ควบคุมให้เชื้ออยู่ใน **lag phase นานที่สุด** (ช่วงที่เชื้อปรับตัวยังไม่เพิ่มจำนวน) เนื้อจะเก็บได้นานขึ้น"
            ]
          }
        ]
      }
    ]
  }
};
