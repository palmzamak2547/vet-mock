// ============================================================
// สรีรวิทยาสัตว์ III (Veterinary Physiology III) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส 3102205 ที่แจกจริงในรายวิชา ทุก section
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

export const NOTES_Y2_PHYSIO_3 = {
  "physio-3--body-temperature": {
    "topic": "physio-3--body-temperature",
    "title": "Body Temperature, Temperature Regulation and Fever",
    "icon": "📘",
    "lecturer": "Saikaew Sutayatram, DVM., PhD.",
    "summary": "เด็คนี้ครอบคลุมอุณหภูมิร่างกายและการควบคุม (core vs skin temperature, ค่าปกติรายชนิดสัตว์, thermoregulatory center ที่ hypothalamus, temperature sensors/receptors, heat production ทั้ง metabolic และ fermentation, shivering, BAT thermogenesis, heat loss ทั้ง 4 ทาง, insulator, sweat, panting, set-point) และความผิดปกติของการควบคุมอุณหภูมิ (fever, stages of fever, antipyretic drugs, heat stress, heatstroke) สไลด์หัวข้อ (p.1) ประกาศไว้ 3 หัวข้อ แต่หัวข้อที่ 3 \"Special physiological and behavioral adjustments\" ไม่มีสไลด์ที่ขึ้นหัวเรื่องนี้แยกออกมา มีเพียงพฤติกรรม เช่น move to cooler/warmer places และ huddling แทรกอยู่ในหัวข้อ control เนื้อหาส่วนใหญ่เป็น bullet สั้นและ flow chart กลไกเชิงลึกหลายจุดสไลด์ไม่ได้อธิบายต่อ",
    "sections": [
      {
        "heading": "Core temperature กับ skin temperature",
        "source": "Body Temperature p.1",
        "body": [
          {
            "sub": "Core temperature (core t°)",
            "body": [
              {
                "bullets": [
                  "เป็นอุณหภูมิของ **deep tissue** วัดได้ per mouth หรือ rectal",
                  "วัดทางปาก **ต่ำกว่า** ทาง rectum ประมาณ **1°F**",
                  "การเปลี่ยนแปลงเพียงเล็กน้อย (**± 1°F หรือ ± 0.6°C**) มีความสำคัญต่อ cellular functions ของ vital organs",
                  "ช่วง 94-104°F: emotion, exercise และ extreme heat/cold"
                ]
              }
            ]
          },
          {
            "sub": "Skin temperature (skin t°)",
            "body": [
              {
                "bullets": [
                  "**เปลี่ยนแปลงง่ายและเร็ว** แปรผันตาม environment",
                  "สะท้อนการ heat loss หรือ heat reserve"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ไม่ได้บอกว่าช่วง 94-104°F หมายถึงอุณหภูมิร่างกายหรืออุณหภูมิสิ่งแวดล้อม บอกเพียงว่าสัมพันธ์กับ emotion, exercise และ extreme heat/cold"
          }
        ]
      },
      {
        "heading": "หัวข้อของเด็ค (topics)",
        "source": "Body Temperature p.1",
        "body": [
          {
            "bullets": [
              "Body temperature and its control",
              "Abnormalities in body temperature control",
              "Special physiological and behavioral adjustments"
            ]
          }
        ]
      },
      {
        "heading": "อุณหภูมิร่างกายปกติรายชนิดสัตว์",
        "source": "Body Temperature p.1",
        "body": [
          {
            "text": "ตารางในสไลด์ให้ค่า °C, °F และคอลัมน์ Range (หน่วย °F) เรียงตามลำดับสัตว์เดียวกัน"
          },
          {
            "bullets": [
              "Man 36.0°C / 97.0°F (range 97.0-99.5)",
              "Stallion 37.6°C / 99.7°F (range 99.0-100.6)",
              "Mare 37.8°C / 100.0°F (range 99.1-100.8)",
              "Camel 37.5°C / 99.5°F (range **93.6-105.3** กว้างที่สุดในตาราง)",
              "Dairy cow 38.6°C / 101.5°F (range 100.4-102.8)",
              "Sheep 39.1°C / 102.3°F (range 100.9-103.8)",
              "Pig 39.2°C / 102.5°F (range 101.6-103.6)",
              "**Dog 38.9°C / 102.0°F** (range 100.2-103.8)",
              "**Cat 38.6°C / 101.5°F** (range 100.5-102.5)",
              "Rabbit 39.5°C / 103.1°F (range 101.5-104.2)",
              "**Chicken 41.7°C / 107.1°F** (range 105.0-109.4) สูงที่สุดในตาราง"
            ]
          },
          {
            "callout": "จำแนวโน้ม: นก (chicken) สูงสุด และ man ต่ำสุดในตาราง ส่วน camel เด่นที่ช่วงกว้างผิดปกติ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Temperature integrator: posterior hypothalamus",
        "source": "Body Temperature p.2",
        "body": [
          {
            "text": "การควบคุมอุณหภูมิร่างกายใช้ **nervous feedback mechanisms** ผ่าน thermoregulatory center ที่ hypothalamus ร่วมกับ temperature detectors"
          },
          {
            "text": "**Temperature integrator = posterior hypothalamus** ทำหน้าที่รวมสัญญาณ 2 อย่าง"
          },
          {
            "bullets": [
              "Sensory signals: อุณหภูมิของ skin, deep body และ anterior hypothalamic preoptic area",
              "Set-point temperature"
            ]
          },
          {
            "text": "จากนั้นส่ง motor signals ออกไปควบคุมอุณหภูมิร่างกายให้อยู่ในช่วง **97-100°F**"
          },
          {
            "sub": "ตัวอย่างในสไลด์ (nude person)",
            "body": [
              {
                "bullets": [
                  "ดู core t° ของ nude person ระหว่างอยู่ใน dry air ไม่กี่ชั่วโมง",
                  "ใน dry air ช่วง **55-130°F** core t° ยังคงเสถียร",
                  "Curve factor ที่มีผล: wind, moisture และ surroundings"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Thermoneutral zone",
        "source": "Body Temperature p.2",
        "body": [
          {
            "bullets": [
              "ช่วงของ ambient t° ที่ **BMR คงที่**",
              "ไม่มีการสร้างหรือสูญเสียความร้อน (รู้สึกไม่ร้อนไม่หนาว)",
              "เรียกภาวะนี้ว่า **normothermia**"
            ]
          }
        ]
      },
      {
        "heading": "Temperature sensors และ temperature receptors",
        "source": "Body Temperature p.2",
        "body": [
          {
            "sub": "Temperature sensors ที่ anterior hypothalamic preoptic area",
            "body": [
              {
                "bullets": [
                  "**Heat-sensitive neurons** (hyperthermic หรือ heat loss center) เพิ่ม firing rate **2-10 เท่า** เมื่ออุณหภูมิร่างกายเพิ่ม 10°C",
                  "**Cold-sensitive neurons** (hypothermic center) เพิ่ม firing rate เมื่อเย็น"
                ]
              }
            ]
          },
          {
            "sub": "Temperature receptors ที่ skin และ deep body",
            "body": [
              {
                "bullets": [
                  "Skin t° receptors: **cold receptor มากกว่า warmth receptor**",
                  "Cold receptor = **Krause's corpuscle**",
                  "Warmth receptor = **Ruffini's end organ**",
                  "Deep body t° receptors: cold มากกว่า warmth เช่นกัน อยู่ที่ spinal cord, abdominal viscera และ great veins (upper abdomen และ thorax)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Heat production",
        "source": "Body Temperature p.2",
        "body": [
          {
            "sub": "1. Metabolic heat",
            "body": [
              {
                "bullets": [
                  "BMR จาก deep organs และ muscle",
                  "Muscle activity และ shivering",
                  "Extra metabolism แบบ neurohormonal: **thyroxine, GH, testosterone, Epi, NE, cortisol** และ sympathetic stimulation ไปที่ BAT",
                  "Increased temperature ตาม **Van Hoff's law: เพิ่ม 10°C = MR เพิ่ม 2-3 เท่า** รวมทั้ง fever และ thermogenic effect of food"
                ]
              }
            ]
          },
          {
            "sub": "2. Fermentation heat (rumen)",
            "body": [
              {
                "bullets": [
                  "คิดเป็น **7-8% ของ heat production** ในโค"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ectotherm กับ endotherm",
        "source": "Body Temperature p.3",
        "body": [
          {
            "bullets": [
              "**Ectotherm (poikilotherm)**: สร้างความร้อนเองทาง physiology ไม่ได้ ต้องพึ่ง environment t° ได้แก่ invertebrates, ปลา (ส่วนใหญ่), reptiles และ amphibians",
              "**Endotherm (homeotherm)**: สร้างความร้อนได้เพียงพอ ได้แก่ **birds (อายุมากกว่า 2 สัปดาห์)** และ mammals"
            ]
          }
        ]
      },
      {
        "heading": "Shivering",
        "source": "Body Temperature p.3",
        "body": [
          {
            "text": "สไลด์วางเป็น flow chart จาก anterior hypothalamic-preoptic hyperthermic center และความรู้สึกหนาว ร่วมกับ cold signals จาก skin และ spinal cord"
          },
          {
            "bullets": [
              "สัญญาณไปที่ **primary motor center ที่ dorsomedial posterior hypothalamus**",
              "ผ่าน brain stem bilateral tracts",
              "ลง spinal cord lateral columns",
              "ไปยัง anterior motor neurons",
              "ถึง skeletal muscles"
            ]
          },
          {
            "text": "ผลคือ **เพิ่ม muscle tone เหนือ critical level** เกิดการเคลื่อนไหวแบบ nonrhythmical และ involuntary โดย**ยังไม่เห็นกล้ามเนื้อสั่นจริง**"
          },
          {
            "bullets": [
              "เพิ่ม heat production ได้ **4-5 เท่า**",
              "ต้องใช้พลังงานจาก hormonal metabolic effects: **Epi, NE, thyroxine และ cortisol**"
            ]
          }
        ]
      },
      {
        "heading": "Heat production กับ circadian rhythm",
        "source": "Body Temperature p.3",
        "body": [
          {
            "bullets": [
              "Diurnal variation คือการเปลี่ยนแปลง**ภายในช่วง core t° ปกติ** ตามการหลับและตื่น",
              "เกิดจาก physiology, activity และอุณหภูมิสิ่งแวดล้อม",
              "**เห็นชัดขึ้นเมื่อมีไข้**",
              "Nocturnal: มี activity สูงตอนกลางคืน",
              "Diurnal: มี activity สูงตอนกลางวัน"
            ]
          }
        ]
      },
      {
        "heading": "Sympathetic chemical thermogenesis และ BAT",
        "source": "Body Temperature p.3",
        "body": [
          {
            "text": "เมื่อรู้สึกหนาว จะเกิด sympathetic stimulation, NE และ Epi หรือ thyroxine ทำให้ **chemical thermogenesis เพิ่มขึ้นในทุกเซลล์**"
          },
          {
            "bullets": [
              "ออกฤทธิ์ผ่าน **β3 adrenergic receptor ของ BAT**",
              "BAT = specialized adipocyte ที่มี mitochondria มาก",
              "**Uncouple oxidative phosphorylation** จึงได้ความร้อนออกมาโดย**ไม่ได้ ATP**"
            ]
          },
          {
            "sub": "ขนาดของผลที่ได้",
            "body": [
              {
                "bullets": [
                  "Acclimatized animal: เพิ่ม **100-500%**",
                  "Unacclimatized animal: ประมาณ **1/3** ของค่าข้างต้น",
                  "Adult ที่แทบไม่มี BAT: **10-15%**",
                  "โดยรวม สัตว์ทำได้มากกว่ามนุษย์"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Heat loss: หลักการรวม",
        "source": "Body Temperature p.4",
        "body": [
          {
            "bullets": [
              "Heat production มาจาก BMR ของ deep organs (เช่น liver, brain, heart) และจาก activity/exercise ของ skeletal muscles",
              "Heat transfer ไหลจาก deeper tissues ไปยัง skin แล้วออกสู่ environment",
              "**Sensible / non-evaporative heat loss: ไปได้ 2 ทิศทาง**",
              "**Insensible / evaporative heat loss: ไปได้ทิศทางเดียว**"
            ]
          },
          {
            "text": "อัตรา heat loss ขึ้นกับ 2 ขั้นตอน คือ (1) rate of heat transfer to skin และ (2) rate of heat transfer to the environment"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 1: rate of heat transfer to skin",
        "source": "Body Temperature p.4",
        "body": [
          {
            "bullets": [
              "Blood flow จาก body core มาที่ skin คิดเป็น **0-30% ของ CO** แปรผันตาม vascular tone",
              "ควบคุมด้วย hypothalamic-sympathetic tone"
            ]
          },
          {
            "sub": "Vascular control ที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "Arteriole vasodilation ผ่าน **Ach-Bradykinin**",
                  "Arteriole vasoconstriction ผ่าน **α1**",
                  "Arteriovenous anastomosis ผ่าน **α2**",
                  "Vasoconstriction ทำให้ blood flow ลดลง โดยเฉพาะที่ extremities"
                ]
              }
            ]
          },
          {
            "text": "การกระจายความร้อนที่ผิวหนังอาศัย continuous venous plexus และ capillary ทำให้ **skin blood flow ทำหน้าที่เป็นตัวคุม body heat radiator**"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 2: การถ่ายเทความร้อนสู่สิ่งแวดล้อม 4 ทาง",
        "source": "Body Temperature p.4",
        "body": [
          {
            "sub": "1. Radiation",
            "body": [
              {
                "bullets": [
                  "เป็น infrared heat ray คิดเป็น **60% ของ total heat loss**",
                  "อัตราแปรผันตามความต่างของอุณหภูมิร่างกายกับสิ่งแวดล้อม"
                ]
              }
            ]
          },
          {
            "sub": "2. Conduction",
            "body": [
              {
                "bullets": [
                  "เกิดจากการสัมผัสโดยตรง คิดเป็น **3-15% ของ total heat loss**",
                  "ความต่างอุณหภูมิระหว่างร่างกายกับวัตถุทำให้กระบวนการ self-limited"
                ]
              }
            ]
          },
          {
            "sub": "3. Convection",
            "body": [
              {
                "bullets": [
                  "อากาศไหลพาความร้อนจากผิวหนังออกไป",
                  "**ลมเพิ่ม convection เป็นสัดส่วนกับรากที่สองของ wind velocity**",
                  "Conduction และ convection ใน **น้ำมากกว่าอากาศอย่างมาก**"
                ]
              }
            ]
          },
          {
            "sub": "4. Evaporation",
            "body": [
              {
                "bullets": [
                  "ระเหยน้ำออกไป (sweat และ panting)",
                  "เป็น insensible และ **uncontrollable** คิดเป็น **25-75% ของ heat loss**",
                  "แปรผันกับ relative humidity",
                  "**เป็นทางเดียวที่ยังระบายความร้อนได้เมื่ออุณหภูมิสิ่งแวดล้อมสูง**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Body insulator system",
        "source": "Body Temperature p.4",
        "body": [
          {
            "sub": "1. Skin, subcutaneous tissues และ fat",
            "body": [
              {
                "bullets": [
                  "**Fat นำความร้อนได้แย่ ประมาณ 1/3 ของเนื้อเยื่ออื่น** จึงเป็นฉนวนที่ดี"
                ]
              }
            ]
          },
          {
            "sub": "2. Hair, feather และ fur",
            "body": [
              {
                "bullets": [
                  "ลด conduction และ convection โดยสร้าง **private zone of air ที่หนาขึ้น**",
                  "ต่อ radiation ทำหน้าที่เป็น radiative shield และมี light scattering property จึงทำให้ fur ดูเป็นสีขาว",
                  "**สูญเสียหน้าที่เมื่อเปียก** ยกเว้น sea otter และ seal ที่มีขนหนามาก"
                ]
              }
            ]
          },
          {
            "sub": "3. Blubber (skin fat)",
            "body": [
              {
                "bullets": [
                  "ไขมันใต้ผิวหนังหนามาก (**2-3 นิ้ว หรือราว 30% BW**)",
                  "ลด conduction และ convection",
                  "**เป็นฉนวนสู้ fur ไม่ได้ แต่ทำงานได้ดีในน้ำ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clothing ในการเป็นฉนวน",
        "source": "Body Temperature p.5",
        "body": [
          {
            "bullets": [
              "ต่อ conduction และ convection: เพิ่มความหนาของชั้นอากาศติดผิวหนัง แล้วค่อย ๆ อุ่นอากาศชั้นนั้นด้วยความร้อนของร่างกาย",
              "ต่อ radiation: ชั้น gold ด้านในสะท้อนความร้อนกลับ",
              "**เสียหน้าที่เมื่อเปียก** ไม่ว่าจะจากน้ำหรือเหงื่อ"
            ]
          },
          {
            "sub": "ข้อยกเว้นที่สไลด์ยกมา",
            "body": [
              {
                "bullets": [
                  "Wet suit: มีชั้น nitrogen gas bubble ที่ thermal conductivity ต่ำ",
                  "Ski jacket: กันลมและกันน้ำ",
                  "Quick dry material"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Control และ regulation ของเหงื่อ",
        "source": "Body Temperature p.5",
        "body": [
          {
            "text": "Warmth receptor ที่ skin และ brain ส่งสัญญาณไป hypothalamus และ thermoregulatory center แล้วออกเป็น sympathetic stimulation โดยมี ANS, emotion และ exercise เข้ามาเกี่ยวข้อง"
          },
          {
            "sub": "เส้นทางการควบคุม",
            "body": [
              {
                "bullets": [
                  "ความร้อนที่มากเกินหรือ sympathetic stimulation กระตุ้น **anterior hypothalamus-preoptic area**",
                  "ส่งสัญญาณผ่าน autonomic pathways ลง spinal cord ออกเป็น sympathetic outflow",
                  "ปลายทางเป็น **cholinergic nerve fibers (Ach)** และมี Epi หรือ NE ร่วมด้วยระหว่าง exercise",
                  "ไปออกฤทธิ์ที่ skin sweat glands"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างต่อมเหงื่อ 2 ส่วน",
            "body": [
              {
                "bullets": [
                  "**Deep subdermal coiled portion** ใน dermis: หลั่ง **primary (precursor) sweat** แบบ active",
                  "**Duct portion** ใน dermis และ epidermis: ปรับ primary sweat โดย**ดูดกลับ Na+ และ Cl- เกือบทั้งหมด**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Sweat: ปริมาณความร้อนและชนิดต่อมตามสัตว์",
        "source": "Body Temperature p.5",
        "body": [
          {
            "bullets": [
              "เกิดจาก cholinergic sympathetic stimulation นำไปสู่ evaporative heat loss",
              "**0.58 kcal ต่อน้ำที่ระเหย 1 กรัม**",
              "600-700 ml/วัน เท่ากับ **16-19 kcal/ชั่วโมง**"
            ]
          },
          {
            "sub": "ชนิดต่อมและความสามารถในการขับเหงื่อ",
            "body": [
              {
                "bullets": [
                  "**Eccrine gland: humans, cattle และ horse**",
                  "**Apocrine gland: สัตว์ชนิดอื่น**",
                  "Humans, horses และ cattle ขับเหงื่อได้มากกว่า dogs และ cats อย่างมาก",
                  "**นกไม่มีต่อมเหงื่อ**",
                  "สุนัขและแมวใช้เหงื่อจาก nose และ foot pads ป้ายเคลือบผิวหนัง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Panting",
        "source": "Body Temperature p.5",
        "body": [
          {
            "text": "ใช้ในสัตว์ที่มี fur หรือมีต่อมเหงื่อน้อย ซึ่งระบายความร้อนทางผิวได้น้อย"
          },
          {
            "bullets": [
              "เลือดที่ร้อนเกินไปกระตุ้น thermoregulatory centers ที่ hypothalamus",
              "**Panting center อยู่ที่ pons** ทำงานร่วมกับ pneumotaxic respiratory center",
              "หายใจ **ตื้นและเร็ว** แต่ **ไม่มีผลต่อ alveolar ventilation**",
              "อากาศใหม่ปริมาณมากสัมผัส upper respiratory tract แล้วระเหยน้ำจาก mucosal surface ทำให้เลือดเย็นลง",
              "พบใน birds, dogs และ cats"
            ]
          },
          {
            "callout": "แมวที่ panting ให้นึกถึง dyspnea และปัญหาหัวใจมากกว่าเรื่องร้อน ตามที่สไลด์เน้นไว้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Set-point ของการควบคุมอุณหภูมิ",
        "source": "Body Temperature p.6",
        "body": [
          {
            "bullets": [
              "Critical body core t° หรือ set-point ของคน = **37.1°C (98.8°F)**",
              "การเปลี่ยนแปลงมีผลทั้ง heat loss และ heat production",
              "**สูงกว่า set-point: rate of heat loss มากกว่า heat production**",
              "**ต่ำกว่า set-point: rate of heat production มากกว่า heat loss**"
            ]
          },
          {
            "sub": "Skin t° เปลี่ยน set-point ของ core t° ได้",
            "body": [
              {
                "bullets": [
                  "**ผิวหนังเย็น: sweating set-point สูงขึ้น และเกิด shivering เร็วขึ้น** ป้องกันการสูญเสียความร้อนมากเกินไปและเพิ่มการสร้างความร้อนในที่เย็น",
                  "**ผิวหนังร้อน: sweating set-point ต่ำลง** ช่วยเพิ่มการระบายความร้อนในที่ร้อน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Feel hot: temperature-decreasing mechanisms",
        "source": "Body Temperature p.6",
        "body": [
          {
            "sub": "1. เพิ่ม skin blood flow (skin vasodilation)",
            "body": [
              {
                "bullets": [
                  "ยับยั้ง vasoconstriction ที่ posterior hypothalamic sympathetic center",
                  "ปล่อย **bradykinin** จาก sweat glands ที่ถูกกระตุ้น"
                ]
              }
            ]
          },
          {
            "sub": "2. เพิ่ม evaporation (sweating / panting)",
            "body": [
              {
                "bullets": [
                  "เมื่อ core t° สูงกว่า upper critical level **ทุก 1°C ที่เพิ่ม** จะเพิ่ม sweating และกระตุ้น panting center ที่ pons"
                ]
              }
            ]
          },
          {
            "sub": "3. ลด heat production",
            "body": [
              {
                "bullets": [
                  "ยับยั้ง shivering และ chemical thermogenesis เช่นที่ BAT",
                  "ลด physical activity และการกิน"
                ]
              }
            ]
          },
          {
            "sub": "4. ย้ายไปที่เย็นกว่า",
            "body": [
              {
                "text": "เป็นการปรับตัวเชิงพฤติกรรมที่สไลด์ระบุไว้ในกลุ่มเดียวกัน"
              }
            ]
          }
        ]
      },
      {
        "heading": "Feel cold: temperature-increasing mechanisms",
        "source": "Body Temperature p.6",
        "body": [
          {
            "sub": "ลดการสูญเสียความร้อน",
            "body": [
              {
                "bullets": [
                  "**ลดพื้นที่ผิวกาย**: huddling และการหดตัวของพื้นผิวร่างกาย",
                  "ย้ายไปที่อุ่นกว่า หรือใส่เสื้อผ้าหนา",
                  "**Skin vasoconstriction** จากการกระตุ้น posterior hypothalamic sympathetic centers",
                  "**Piloerection**: การหดตัวของ arrector pili muscles จาก sympathetic stimulation"
                ]
              }
            ]
          },
          {
            "sub": "เพิ่มการสร้างความร้อน",
            "body": [
              {
                "bullets": [
                  "เพิ่ม thermogenesis ด้วย shivering, movement, sympathetic induced heat production (BAT), การกิน และการหลั่ง thyroxine"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Fever: สาเหตุและกลไก pyrogen",
        "source": "Body Temperature p.6",
        "body": [
          {
            "text": "Fever มีคำเรียกอื่นว่า pyrexia และ febrile response สาเหตุที่สไลด์ระบุคือ primary brain abnormality, dehydration และ pyrogens"
          },
          {
            "text": "**Pyrogens = สารจากภายในหรือภายนอกร่างกายที่เพิ่ม set-point ของ hypothalamus** ได้แก่ bacterial proteins, protein breakdown, สารเคมีบางชนิด, virus และเนื้อเยื่อร่างกายที่เสื่อมจาก infection หรือ inflammation"
          },
          {
            "sub": "ลำดับเหตุการณ์ที่สไลด์ไล่เป็นขั้น",
            "body": [
              {
                "bullets": [
                  "1. Pyrogen ถูก **phagocytized และย่อยโดย WBC**",
                  "2. WBC ปล่อย **interleukin-1 (IL-1)**",
                  "3. เหนี่ยวนำการสร้าง **prostaglandin E2 (PGE2)** จาก cell membrane",
                  "4. **เพิ่ม set-point ของ hypothalamus**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การ reset set-point และผลของไข้",
        "source": "Body Temperature p.7",
        "body": [
          {
            "bullets": [
              "5. Hypothalamus นำ set-point ใหม่ที่สูงขึ้นมารวมกับข้อมูลจาก peripheral t° receptor แล้ว**ตีความว่าอุณหภูมิร่างกายต่ำเกินไป**",
              "6. ส่ง error signals ไปยัง target effectors เพื่อเพิ่มอุณหภูมิร่างกาย"
            ]
          },
          {
            "sub": "ประโยชน์ของไข้",
            "body": [
              {
                "bullets": [
                  "**ลดการเพิ่มจำนวนของ virus และ bacteria**",
                  "**เพิ่ม immune function**"
                ]
              }
            ]
          },
          {
            "sub": "ผลเสียเมื่อ host cell ร้อนเกินไป",
            "body": [
              {
                "bullets": [
                  "สูญเสียหน้าที่ของ enzyme",
                  "Cellular injury",
                  "การยิง action potential ของ CNS ผิดปกติจนชักได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Stages of fever",
        "source": "Body Temperature p.7",
        "body": [
          {
            "sub": "1. Chills",
            "body": [
              {
                "bullets": [
                  "set-point ของ hypothalamus **ถูกยกขึ้นอย่างฉับพลัน**",
                  "สัตว์รู้สึกหนาวสั่นมาก เพราะร่างกายพยายามไปให้ถึง set-point ใหม่ที่สูงขึ้น",
                  "ลด heat loss ด้วย **skin vasoconstriction และ piloerection**",
                  "เพิ่ม heat production ด้วย **sympathetic stimulated MR และ shivering**",
                  "จบเมื่ออุณหภูมิร่างกายขึ้นถึง set-point ใหม่"
                ]
              }
            ]
          },
          {
            "sub": "2. Crisis หรือ flush",
            "body": [
              {
                "bullets": [
                  "Pyrogen หรือสาเหตุของไข้ถูกกำจัดออกไป",
                  "Hypothalamus **reset set-point กลับสู่ค่าปกติ**",
                  "สัตว์รู้สึกร้อนมาก ร่างกายจึงพยายามลดอุณหภูมิ",
                  "เพิ่ม heat loss ด้วย **skin vasodilation และเหงื่อออกมาก**",
                  "อุณหภูมิค่อย ๆ ลดลงเข้าหา set-point ใหม่หรือค่าปกติ"
                ]
              }
            ]
          },
          {
            "callout": "แกนที่ทำให้ตอบข้อสอบได้: อาการหนาวหรือร้อนของสัตว์เกิดจากส่วนต่างระหว่างอุณหภูมิจริงกับ set-point ไม่ใช่จากค่าอุณหภูมิสัมบูรณ์",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Antipyretic drugs",
        "source": "Body Temperature p.7",
        "body": [
          {
            "bullets": [
              "เป็นยาแก้ปวด หรือ **NSAIDs**",
              "ช่วยให้ hypothalamus **ลบล้างฤทธิ์ pyretic ของ IL-1 และ PGE2**"
            ]
          },
          {
            "text": "สไลด์ไม่ได้ระบุชื่อยาตัวใดตัวหนึ่ง ขนาดยา หรือข้อควรระวังในสัตว์แต่ละชนิด"
          }
        ]
      },
      {
        "heading": "Heat stress",
        "source": "Body Temperature p.8",
        "body": [
          {
            "text": "สไลด์แสดงหัวข้อ heat-induced alteration in body functions โดยระบุระบบที่ถูกกระทบไว้เป็นรายการ"
          },
          {
            "bullets": [
              "Milk และ egg production",
              "Growth",
              "Feed intake",
              "CVS functions"
            ]
          },
          {
            "text": "สไลด์ไม่ได้บอกทิศทางหรือขนาดของการเปลี่ยนแปลงในแต่ละหัวข้อ บอกเพียงว่าความร้อนทำให้หน้าที่เหล่านี้เปลี่ยนไป"
          }
        ]
      },
      {
        "heading": "Heatstroke",
        "source": "Body Temperature p.8",
        "body": [
          {
            "bullets": [
              "**สุนัขที่เป็น heatstroke อุณหภูมิร่างกายขึ้นถึง 106°F และในรายรุนแรงประมาณ 107-109°F**"
            ]
          },
          {
            "sub": "การสัมผัสความร้อนที่ทำให้เกิด",
            "body": [
              {
                "bullets": [
                  "ความร้อนสูงมาก ตั้งแต่ **94°F ที่ความชื้นสูง จนถึง 130°F ในอากาศแห้ง**",
                  "การออกแรงหนักในอากาศร้อน **85-90°F**"
                ]
              }
            ]
          },
          {
            "sub": "Signs ที่สไลด์ไล่ไว้",
            "body": [
              {
                "bullets": [
                  "เหงื่อออกมาก, panting, น้ำลายไหล, ผิวหนังหรือ mucous membrane แดง",
                  "เวียนศีรษะ, ปวดท้อง, อาเจียน, delirium หรือจ้องนิ่ง",
                  "ชัก, หมดสติ, circulatory shock จากการเสียเหงื่อมาก และ brain injury",
                  "เสียชีวิต"
                ]
              }
            ]
          },
          {
            "text": "ความเสียหายของเนื้อเยื่อจากความร้อนที่สไลด์ระบุคือ **hemorrhage และ cellular degeneration**"
          },
          {
            "callout": "สไลด์ไม่ได้ให้แนวทางการรักษาหรือการลดอุณหภูมิในสัตว์ป่วย heatstroke ให้ยึดตามที่อาจารย์สอนในคาบคลินิก",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-3--chapter-25-overview-of-gastrointestinal-function-and-regulat": {
    "topic": "physio-3--chapter-25-overview-of-gastrointestinal-function-and-regulat",
    "title": "Chapter 25 ภาพรวมการทำงานและการควบคุมของระบบทางเดินอาหาร",
    "icon": "📗",
    "summary": "เอกสารชุดนี้เป็น text เต็มของบทที่ 25 จาก Ganong's Review of Medical Physiology, 26e (30 หน้า) ไม่ใช่สไลด์แบบ bullet ของอาจารย์ เนื้อหาไล่ตั้งแต่โครงสร้างทางเดินอาหารและ sphincters ชั้นผนังลำไส้ villi/crypts แล้วเข้าสู่ digestive secretions ทั้ง 4 ชุด (saliva, gastric juice, pancreatic juice, bile) ต่อด้วย GI regulation (endocrine, paracrine, neurocrine) ฮอร์โมนและ peptides รายตัว (gastrin, CCK, secretin, GIP, VIP, motilin, somatostatin, peptide YY, ghrelin, guanylin) enteric nervous system, mucosal immune system กับ microbiota, splanchnic circulation และปิดท้ายด้วย intestinal fluid and electrolyte transport พร้อม Clinical Box 2 กล่อง (Peptic ulcer disease และ Cholera) ส่วนที่เป็นภาพนั้นเหลือแต่ caption ในไฟล์ text จึงจดได้เฉพาะข้อความที่ caption เขียนไว้ และตาราง Table 25-2 (principal digestive enzymes) มีคอลัมน์เละจากการแปลง PDF จึงจดเฉพาะคู่ enzyme-substrate ที่อ่านได้ชัดเจนเท่านั้น",
    "sections": [
      {
        "heading": "หน้าที่หลักของ gastrointestinal system",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.1",
        "body": [
          {
            "text": "หน้าที่หลักของ gastrointestinal tract คือ **เป็น portal ให้ nutrients และน้ำถูกดูดซึมเข้าสู่ร่างกาย** โดยอาหารที่กินเข้าไปจะถูกผสมกับ secretions ทั้งจากตัวทางเดินอาหารเองและจากอวัยวะที่ระบายเข้ามา ได้แก่ pancreas, gallbladder และ salivary glands"
          },
          {
            "text": "intestine มี motility patterns หลายรูปแบบที่ทำหน้าที่ผสมอาหารกับ digestive secretions และเคลื่อนอาหารไปตามความยาวของทางเดินอาหาร ส่วนกากที่ดูดซึมไม่ได้พร้อม cellular debris จะถูกขับออกจากร่างกาย"
          },
          {
            "text": "เพราะทางเดินอาหารต่อเนื่องกับสิ่งแวดล้อมภายนอกและอยู่ร่วมกับ microbiota ที่ซับซ้อนตลอดชีวิต จึงมีทั้ง innate และ adaptive immune systems ที่พัฒนาดี แต่กระนั้น **ทางเดินอาหารก็ยังคงเป็น portal สำคัญของการติดเชื้อ**"
          },
          {
            "text": "การทำงานทั้งหมดถูกควบคุมอย่างแน่นหนาให้สอดคล้องกับการกินอาหาร ระบบทางเดินอาหารจึงพัฒนา regulatory mechanisms จำนวนมากที่ออกฤทธิ์ทั้งเฉพาะที่ (locally) และในระยะไกล (over long distances) เพื่อประสานการทำงานของ gut กับอวัยวะที่ระบายเข้ามา"
          }
        ]
      },
      {
        "heading": "ลำดับของทางเดินอาหารและ sphincters ที่แบ่ง functional segments",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.1",
        "body": [
          {
            "text": "ส่วนของทางเดินอาหารที่อาหารหรือกากอาหารผ่าน เรียงตามลำดับ:"
          },
          {
            "bullets": [
              "mouth",
              "esophagus",
              "stomach",
              "duodenum",
              "jejunum",
              "ileum",
              "cecum",
              "colon",
              "rectum",
              "anus"
            ]
          },
          {
            "text": "ตลอดความยาวของลำไส้มี glandular structures ปล่อย secretions เข้า lumen โดยเฉพาะที่ stomach และ mouth และยังมี secretions จาก pancreas และ biliary system ของ liver ที่สำคัญต่อการย่อย ตัว intestine เองมี surface area มากซึ่งสำคัญต่อหน้าที่ดูดซึม"
          },
          {
            "text": "**ทางเดินอาหารถูกแบ่งเป็น functional segments ด้วย sphincters ซึ่งเป็นวงกล้ามเนื้อ (muscle rings) ที่จำกัดการไหลของสิ่งที่อยู่ในลำไส้ เพื่อให้ digestion และ absorption เกิดได้ดีที่สุด**"
          },
          {
            "sub": "sphincters ที่ระบุไว้",
            "body": [
              {
                "bullets": [
                  "upper และ lower esophageal sphincters",
                  "pylorus ที่หน่วงการระบายของกระเพาะ (retards emptying of the stomach)",
                  "ileocecal valve ที่กักสิ่งที่อยู่ใน colon รวมทั้งแบคทีเรียจำนวนมากไว้ใน large intestine",
                  "inner และ outer anal sphincters ซึ่งหลัง toilet training ทำให้เลื่อนการขับถ่ายไปจนถึงเวลาที่เหมาะสมได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ชั้น (functional layers) ของผนังลำไส้",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.2",
        "body": [
          {
            "text": "ชั้นที่ติดกับ nutrients ใน lumen คือ **single layer ของ columnar epithelial cells ซึ่งเป็น barrier ที่ nutrients ต้องข้ามเพื่อเข้าสู่ร่างกาย**"
          },
          {
            "bullets": [
              "ใต้ epithelium คือ lamina propria ซึ่งเป็น loose connective tissue ที่มี immune และ inflammatory cells จำนวนมากแม้ในภาวะปกติ",
              "ถัดออกมาเป็น smooth muscle เรียงซ้อนกันสองชั้น คือ circular muscle layer (วางรอบแกนลำไส้) และ longitudinal muscle layer (วางตามแกนลำไส้)",
              "myenteric plexus แทรกอยู่ระหว่างกล้ามเนื้อสองชั้น ส่วน submucosal plexus อยู่ใน submucosa ทั้งคู่เป็นส่วนของ enteric nervous system",
              "sensory nerves ยื่นไปทาง epithelium ส่วน secretomotor nerves เลี้ยงทั้ง epithelium และชั้นกล้ามเนื้อ",
              "ลำไส้มี blood vessels และ lymphatics มาเลี้ยงอย่างมากมาย"
            ]
          }
        ]
      },
      {
        "heading": "Villi, crypts, brush border และการผลัดเซลล์ของ epithelium",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.3",
        "body": [
          {
            "text": "epithelium ของลำไส้ถูกออกแบบให้เพิ่ม surface area สำหรับดูดซึม โดยตลอด small intestine จะพับเป็นแท่งคล้ายนิ้วมือเรียกว่า **villi** และรอยพับลงไประหว่าง villi เรียกว่า **crypts**"
          },
          {
            "text": "**stem cells ที่ให้กำเนิดทั้ง crypt และ villus epithelial cells อยู่ที่ฐานของ crypt** และรับผิดชอบการสร้าง epithelium ใหม่ทั้งหมดทุกไม่กี่วัน gastrointestinal epithelium จึงเป็นเนื้อเยื่อที่แบ่งตัวเร็วที่สุดชุดหนึ่งของร่างกาย daughter cells แบ่งตัวหลายรอบใน crypt แล้วเคลื่อนออกไปบน villi และสุดท้ายหลุดออกไปกับอุจจาระ"
          },
          {
            "text": "villus epithelial cells มี **microvilli** จำนวนมากบน apical membrane และ microvilli เหล่านี้มี glycocalyx หนาแน่นเรียกว่า **brush border** ซึ่งน่าจะช่วยป้องกันเซลล์จาก digestive enzymes ได้ระดับหนึ่ง"
          },
          {
            "text": "digestive enzymes บางตัวเป็น membrane-bound proteins ที่เป็นส่วนหนึ่งของ brush border เรียกว่า **brush border hydrolases** ทำหน้าที่ย่อยขั้นสุดท้าย (final steps of digestion) ของ nutrients บางชนิด"
          },
          {
            "sub": "จาก caption ของ Figure 25-3",
            "body": [
              {
                "bullets": [
                  "ชั้น epithelium ยังมี endocrine cells และ intraepithelial lymphocytes กระจายอยู่",
                  "ฐานของ crypt มี Paneth cells ซึ่งหลั่ง antimicrobial peptides และมี stem cells สำหรับ turnover ของ crypt และ villus epithelium",
                  "epithelium ผลัดใหม่ทุก 3-5 วัน ในคนโตที่สุขภาพดี"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Salivary secretion: ต่อม องค์ประกอบ และการปรับที่ duct",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.4",
        "body": [
          {
            "text": "secretion แรกที่อาหารพบคือ saliva ซึ่งผลิตจาก **salivary glands 3 คู่ ได้แก่ parotid, submandibular และ sublingual glands** ที่ระบายเข้าสู่ oral cavity"
          },
          {
            "sub": "organic constituents ของน้ำลาย",
            "body": [
              {
                "bullets": [
                  "amylase เริ่มการย่อย starch",
                  "immunoglobulin A และ lysozyme ป้องกัน oral cavity จากแบคทีเรีย",
                  "mucins ช่วยหล่อลื่น food bolus"
                ]
              }
            ]
          },
          {
            "text": "**saliva เป็น hypotonic เมื่อเทียบกับ plasma และเป็น alkaline** ความเป็นด่างนี้สำคัญเพราะช่วย neutralize gastric secretions ที่ reflux ขึ้นมาใน esophagus"
          },
          {
            "text": "ต่อมน้ำลายประกอบด้วย acini (blind end pieces) ที่สร้าง primary secretion ซึ่งมี organic constituents ละลายอยู่ในของเหลวที่องค์ประกอบเหมือน plasma แทบทุกประการ ต่อมน้ำลายทำงานหนักมากเมื่อถูกกระตุ้นเต็มที่ คือ **หลั่งน้ำลายได้เท่ากับน้ำหนักตัวเองในหนึ่งนาที** จึงมี blood vessels ล้อมรอบจำนวนมากที่ขยายตัวเมื่อเริ่มการหลั่ง"
          },
          {
            "text": "องค์ประกอบของน้ำลายถูกดัดแปลงระหว่างไหลจาก acini ออกไปตาม ducts คือ **Na+ และ Cl− ถูกดึงออก ส่วน K+ และ bicarbonate ถูกเติมเข้า** และเพราะ ducts ค่อนข้าง impermeable ต่อน้ำ การสูญเสีย NaCl จึงทำให้น้ำลาย hypotonic โดยเฉพาะที่อัตราการหลั่งต่ำ"
          },
          {
            "callout": "เมื่ออัตราการหลั่งสูงขึ้น เวลาที่ดึง NaCl ออกน้อยลง tonicity ของน้ำลายจึงสูงขึ้น แต่ยังคง hypotonic เมื่อเทียบกับ plasma เสมอ",
            "kind": "tip"
          },
          {
            "text": "รวมทั้ง 3 คู่ ต่อมน้ำลายผลิตน้ำลาย **1000-1500 mL ต่อวัน**"
          }
        ]
      },
      {
        "heading": "การควบคุมการหลั่งน้ำลาย และหน้าที่ของน้ำลาย",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.5",
        "body": [
          {
            "text": "**การหลั่งน้ำลายถูกควบคุมด้วย neural influences แทบทั้งหมด โดย parasympathetic branch ของ autonomic nervous system มีบทบาทเด่นที่สุด** ส่วน sympathetic input ปรับองค์ประกอบเล็กน้อย (เพิ่ม proteinaceous content) แต่มีผลต่อ volume น้อยมาก"
          },
          {
            "text": "การหลั่งถูกกระตุ้นด้วย reflexes จากการเคี้ยว แต่เริ่มขึ้นตั้งแต่ก่อนอาหารเข้าปากด้วย central triggers จากการคิดถึง เห็น หรือได้กลิ่นอาหาร และ **การหลั่งน้ำลาย conditioned ได้ง่าย เช่นการทดลองคลาสสิกของ Pavlov ที่สุนัขถูก condition ให้หลั่งน้ำลายเมื่อได้ยินเสียงกระดิ่ง**"
          },
          {
            "bullets": [
              "nausea กระตุ้นการหลั่งน้ำลาย",
              "fear และช่วง sleep ยับยั้งการหลั่งน้ำลาย"
            ]
          },
          {
            "sub": "หน้าที่ของน้ำลาย",
            "body": [
              {
                "bullets": [
                  "ช่วยการกลืน (facilitates swallowing) และทำให้ปากชุ่มชื้น",
                  "เป็น solvent ให้โมเลกุลที่กระตุ้น taste buds",
                  "ช่วยการพูดโดยทำให้ริมฝีปากและลิ้นขยับได้สะดวก",
                  "ทำให้ปากและฟันสะอาด และมี antibacterial action บ้าง",
                  "buffers ในน้ำลายรักษา oral pH ไว้ที่ประมาณ 7.0"
                ]
              },
              {
                "text": "ผู้ป่วยที่หลั่งน้ำลายบกพร่อง (**xerostomia**) มีอุบัติการณ์ dental caries สูงกว่าปกติ"
              }
            ]
          },
          {
            "text": "caption ของ Figure 25-4 ระบุว่ารูปแสดงการควบคุมโดย parasympathetic nervous system (ACh = acetylcholine) และว่า sublingual glands ซึ่งไม่ได้วาดไว้ในรูปเป็นตัวที่มีส่วนร่วมน้อยที่สุดทั้งใน resting และ stimulated salivary flow"
          }
        ]
      },
      {
        "heading": "Gastric secretion: กายวิภาคของต่อมในกระเพาะอาหาร",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.5",
        "body": [
          {
            "text": "อาหารถูกเก็บใน stomach ผสมกับ acid, mucus และ pepsin แล้วปล่อยเข้าสู่ duodenum ในอัตราที่ควบคุมและสม่ำเสมอ"
          },
          {
            "bullets": [
              "gastric mucosa มี deep glands จำนวนมาก",
              "ที่ cardia และ pyloric region ต่อมหลั่ง mucus",
              "ที่ body ของกระเพาะรวมทั้ง fundus ต่อมมี parietal cells และ chief cells ด้วย",
              "secretions เหล่านี้ผสมกับ mucus ที่หลั่งจากเซลล์ที่คอของต่อม (necks of the glands)",
              "ต่อมหลายต่อมเปิดเข้าสู่ห้องร่วมกันเรียกว่า gastric pit ซึ่งเปิดออกที่ผิว mucosa",
              "mucus cells ที่ผิว epithelium ระหว่างต่อมหลั่ง mucus พร้อมกับ HCO3−"
            ]
          },
          {
            "text": "caption ของ Figure 25-6 ระบุว่าต่อมที่สร้าง acid และ pepsinogen ในบางตำราเรียกว่า **oxyntic glands** และเรียก parietal cells ว่า oxyntic cells ส่วน ECL ย่อมาจาก enterochromaffin-like"
          },
          {
            "text": "กระเพาะมี blood และ lymphatic supply มาก **parasympathetic nerve supply มาจาก vagi และ sympathetic supply มาจาก celiac plexus** (หน้า 7)"
          }
        ]
      },
      {
        "heading": "สามระยะของการหลั่งน้ำย่อยกระเพาะ และสิ่งที่แต่ละเซลล์หลั่ง",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.7",
        "body": [
          {
            "text": "เช่นเดียวกับน้ำลาย กระเพาะเตรียมตัวรับอาหารก่อนอาหารเข้าจริง แบ่งเป็น 3 ระยะ:"
          },
          {
            "bullets": [
              "cephalic phase ซึ่งได้รับอิทธิพลจากความชอบอาหาร (food preferences)",
              "gastric phase ซึ่ง **มีปริมาณมากที่สุดในเชิงปริมาณ (quantitatively the most significant)**",
              "intestinal phase หลังอาหารออกจากกระเพาะไปแล้ว"
            ]
          },
          {
            "text": "แต่ละระยะถูกควบคุมอย่างใกล้ชิดด้วย triggers ทั้งแบบ local และ distant"
          },
          {
            "sub": "แหล่งของ gastric secretions",
            "body": [
              {
                "bullets": [
                  "surface cells หลั่ง mucus และ bicarbonate เป็นหลัก เพื่อป้องกันกระเพาะจากการย่อยตัวเอง พร้อมกับ trefoil peptides ที่ทำให้ชั้น mucus-bicarbonate เสถียร",
                  "parietal cells (ที่ fundus หรือ body) หลั่ง hydrochloric acid และ intrinsic factor",
                  "chief cells หลั่ง pepsinogens และ gastric lipase"
                ]
              },
              {
                "text": "**acid จาก parietal cells ทำหน้าที่ sterilize อาหาร และเริ่ม hydrolysis โดยเฉพาะของ dietary protein ส่วน intrinsic factor สำคัญต่อการดูดซึม vitamin B12 (cobalamin) ในภายหลัง** pepsinogen เป็น precursor ของ pepsin ซึ่งเริ่มการย่อยโปรตีน และ lipase เริ่มการย่อยไขมัน"
              }
            ]
          },
          {
            "sub": "Table 25-1 contents of normal gastric juice (fasting state)",
            "body": [
              {
                "bullets": [
                  "Cations: Na+, K+, Mg2+, H+ (pH ประมาณ 3.0)",
                  "Anions: Cl−, HPO4 2−, SO4 2−",
                  "Pepsins",
                  "Lipase",
                  "Mucus",
                  "Intrinsic factor"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สามตัวกระตุ้นการหลั่งกรด: gastrin, histamine, acetylcholine",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.8",
        "body": [
          {
            "text": "**Gastrin** เป็นฮอร์โมนที่ถูกปล่อยจาก **G cells ใน antrum** ทั้งจากการตอบสนองต่อ neurotransmitter จากปลายประสาท enteric ที่ชื่อ **gastrin-releasing peptide (GRP)** และจากการมี oligopeptides ใน gastric lumen"
          },
          {
            "text": "gastrin ถูกลำเลียงทางกระแสเลือดไปยัง fundic glands จับกับ receptors บน parietal cells (และน่าจะรวม chief cells) เพื่อกระตุ้นการหลั่ง และจับกับ **enterochromaffin-like cells (ECL cells)** ในต่อมซึ่งจะปล่อย **histamine** ออกมา histamine เป็นตัวกระตุ้น parietal cell อีกทางผ่านการจับ **H2-receptors**"
          },
          {
            "text": "ท้ายที่สุด parietal และ chief cells ยังถูกกระตุ้นด้วย **acetylcholine** ที่ปล่อยจากปลายประสาท enteric ใน fundus ได้ด้วย"
          },
          {
            "callout": "caption ของ Figure 25-7 ระบุตรงว่า agonists จำเพาะตัวอื่นของ chief cell ยังเข้าใจกันไม่ดี (not well understood) และการปล่อย gastrin ถูก negatively regulated ด้วยความเป็นกรดใน lumen ผ่านการปล่อย somatostatin จาก antral D cells",
            "kind": "flag"
          },
          {
            "sub": "cephalic phase",
            "body": [
              {
                "text": "การหลั่งช่วง cephalic phase ถูกกระตุ้นเป็นหลักด้วย vagal input ที่มาจากสมองส่วน **dorsal vagal complex** ซึ่งประสานสัญญาณจาก higher centers vagal outflow ไปกระเพาะจะปล่อย GRP และ acetylcholine เพื่อเริ่มการหลั่ง แต่ก่อนอาหารเข้ากระเพาะยังมี triggers อื่นน้อย **ปริมาณการหลั่งในระยะนี้จึงจำกัด**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Gastric phase และการปิดการหลั่งด้วย somatostatin",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.9",
        "body": [
          {
            "text": "เมื่อกลืนอาหารลงไปแล้ว องค์ประกอบของอาหารกระตุ้นการปล่อย gastrin อย่างมาก และ **การมีอาหารอยู่จริงยังทำให้กระเพาะขยาย (distends) กระตุ้น stretch receptors ซึ่งกระตุ้น vago-vagal reflex และ local reflexes ที่ยิ่งขยายการหลั่งใน gastric phase**"
          },
          {
            "text": "การมีอาหารอยู่ยัง buffer ความเป็นกรดของกระเพาะด้วย ถ้าไม่มีอาหาร ความเป็นกรดจะทำหน้าที่เป็น **feedback inhibitory signal** ปิดการหลั่ง โดยผ่านการปล่อย **somatostatin ซึ่งยับยั้งทั้ง G cells, ECL cells และการหลั่งของ parietal cells เอง**"
          },
          {
            "callout": "กลไก somatostatin นี้น่าจะเป็นกลไกสำคัญที่ทำให้ gastric secretion ยุติลงหลังอาหารเคลื่อนจากกระเพาะเข้าสู่ small intestine",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Parietal cell: proton pump, tubulovesicles และ canaliculi",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.9",
        "body": [
          {
            "text": "parietal cells ถูกออกแบบมาเฉพาะสำหรับงานผิดปกติคือหลั่งกรดเข้มข้น เซลล์อัดแน่นด้วย mitochondria ที่ให้พลังงานขับ **apical H+, K+-ATPase หรือ proton pump ซึ่งดัน H+ ออกจากเซลล์ทวน concentration gradient มากกว่าล้านเท่า**"
          },
          {
            "bullets": [
              "ขณะพัก proton pumps ถูกเก็บไว้ในเซลล์ในถุงเยื่อชุดหนึ่งเรียกว่า tubulovesicles",
              "เมื่อเซลล์เริ่มหลั่ง ถุงเหล่านี้ fuse กับรอยเว้าของ apical membrane ที่เรียกว่า canaliculi ทำให้พื้นที่ apical membrane เพิ่มขึ้นมากและวาง proton pumps ให้พร้อมหลั่งกรด",
              "apical membrane ยังมี potassium channels ที่ให้ K+ มาแลกกับ H+ และ Cl− channels ที่ให้ counterion สำหรับการหลั่ง HCl",
              "การหลั่ง protons มาพร้อมกับการปล่อย bicarbonate ions จำนวนเท่ากันเข้าสู่กระแสเลือด ซึ่งจะถูกนำไป neutralize กรดในกระเพาะภายหลังเมื่อกรดทำหน้าที่เสร็จแล้ว"
            ]
          },
          {
            "text": "caption ของ Figure 25-10 ระบุว่า protons ถูกสร้างใน cytoplasm ด้วยการทำงานของ **carbonic anhydrase II** และ bicarbonate ถูกส่งออกทาง basolateral pole ผ่าน vesicular fusion หรือผ่าน chloride/bicarbonate exchanger ส่วน **NHE1** ที่ basolateral membrane ถือเป็น housekeeping transporter ที่รักษา intracellular pH ในภาวะไม่ถูกกระตุ้น (หน้า 10)"
          }
        ]
      },
      {
        "heading": "Second messengers ของ parietal cell และ synergism",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.10",
        "body": [
          {
            "text": "agonists ทั้งสามของ parietal cell คือ gastrin, histamine และ acetylcholine ต่างจับกับ receptors คนละตัวบน basolateral membrane"
          },
          {
            "bullets": [
              "**gastrin และ acetylcholine กระตุ้นการหลั่งโดยเพิ่ม cytosolic free calcium**",
              "**histamine เพิ่ม intracellular cyclic AMP (cAMP)**"
            ]
          },
          {
            "text": "**สองวิถีนี้เป็น synergistic คือรวมกันแล้วได้ผลมากกว่าผลบวก (greater than additive)** เมื่อ histamine กับ gastrin หรือ acetylcholine หรือทั้งสามตัวมีพร้อมกัน"
          },
          {
            "sub": "ความสำคัญของ synergism",
            "body": [
              {
                "bullets": [
                  "เชิงสรีรวิทยา: กระตุ้นการหลั่งอัตราสูงได้ด้วยการเปลี่ยนแปลงปริมาณของแต่ละ stimulus เพียงเล็กน้อย",
                  "เชิงการรักษา: **ยับยั้งการหลั่งได้อย่างชัดเจนด้วยการ block เพียง trigger เดียว** ซึ่งที่ใช้บ่อยที่สุดคือ block histamine ด้วย H2-antagonists"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical Box 25-1 Peptic ulcer disease",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.11",
        "body": [
          {
            "text": "gastric และ duodenal ulceration ในคนเกี่ยวข้องเป็นหลักกับ **การพังของ barrier ที่ปกติป้องกัน mucosa จากการระคายและการย่อยตัวเองโดย gastric secretions**"
          },
          {
            "bullets": [
              "การติดเชื้อ Helicobacter pylori ทำลาย barrier นี้",
              "aspirin และ nonsteroidal anti-inflammatory drugs (NSAIDs) ก็ทำลาย barrier เช่นกัน โดยยับยั้งการสร้าง prostaglandins ทำให้การหลั่ง mucus และ HCO3− ลดลง",
              "อีกสาเหตุคือการหลั่งกรดมากเกินเป็นเวลานาน ตัวอย่างคือ ulcers ใน Zollinger-Ellison syndrome ซึ่งพบในผู้ป่วยที่มี gastrinomas เนื้องอกเหล่านี้เกิดได้ที่ stomach และ duodenum แต่ **ส่วนใหญ่พบที่ pancreas** gastrin ทำให้เกิด hypersecretion ของกรดยาวนานและเกิด ulcers รุนแรง"
            ]
          },
          {
            "sub": "Therapeutic highlights ตามที่กล่องเขียนไว้",
            "body": [
              {
                "bullets": [
                  "ยับยั้งการหลั่งกรดด้วย omeprazole และยากลุ่มเดียวกันที่ยับยั้ง H+-K+ ATPase (proton pump inhibitors) หรือด้วย histamine H2-receptor antagonists เพื่อให้แผลมีโอกาสหาย",
                  "ถ้ามี H. pylori กำจัดได้ด้วย antibiotics",
                  "NSAID-induced ulcers รักษาด้วยการหยุด NSAID หรือถ้าหยุดไม่ได้ ใช้ prostaglandin agonist misoprostol",
                  "gastrinomas บางครั้งผ่าตัดออกได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปริมาณน้ำย่อยกระเพาะ และความ dispensable ของมัน",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.11",
        "body": [
          {
            "text": "gastric secretion เพิ่มของเหลวเข้าสู่ลำไส้ประมาณ **2.5 L ต่อวัน**"
          },
          {
            "text": "แม้จะมีปริมาณมากและควบคุมละเอียด แต่ **gastric secretions เป็นสิ่งที่ dispensable สำหรับการย่อยและดูดซึมอาหารอย่างครบถ้วน ยกเว้นการดูดซึม cobalamin** ซึ่งสะท้อนหลักการสำคัญข้อหนึ่งของ gastrointestinal physiology คือ digestive และ absorptive capacities มีมากเกินความต้องการปกติอย่างชัดเจน"
          },
          {
            "callout": "แต่ถ้า gastric secretion ลดลงเรื้อรัง คนคนนั้นอาจมีความไวต่อการติดเชื้อที่เข้าทางปาก (oral route) เพิ่มขึ้น",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Principal digestive enzymes (Table 25-2 เท่าที่อ่านได้)",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.11",
        "body": [
          {
            "callout": "ตาราง Table 25-2 ในไฟล์ text ถูกแปลงมาแบบคอลัมน์แตก จึงจดเฉพาะคู่ที่อ่านได้แน่ชัดเท่านั้น รายละเอียดที่เหลือให้กลับไปดูตารางในสไลด์จริง",
            "kind": "warn"
          },
          {
            "bullets": [
              "salivary glands: salivary α-amylase มี activator คือ Cl− ย่อย starch ได้ α-limit dextrins, maltotriose และ maltose โดย hydrolyze 1:4α linkages",
              "stomach: pepsins (จาก pepsinogens) มี activator คือ HCl ทำงานกับ proteins และ polypeptides ตัดพันธะ peptide ที่ติดกับ aromatic amino acids",
              "stomach: gastric lipase ย่อย triglycerides ได้ fatty acids และ glycerol",
              "exocrine pancreas: trypsin (จาก trypsinogen) มี activator คือ enteropeptidase ตัดพันธะ peptide ที่ฝั่ง carboxyl ของ basic amino acids (arginine หรือ lysine)",
              "exocrine pancreas: chymotrypsins, elastase, carboxypeptidase A, carboxypeptidase B, colipase และ prophospholipase A2 ทั้งหมดถูก activate ด้วย trypsin",
              "exocrine pancreas: pancreatic α-amylase มี activator คือ Cl− และทำงานเหมือน salivary α-amylase",
              "intestinal mucosa: enteropeptidase เปลี่ยน trypsinogen เป็น trypsin",
              "intestinal mucosa: maltase, lactase, sucrase, isomaltase, dipeptidases และ nuclease and related enzymes"
            ]
          },
          {
            "text": "หมายเหตุใต้ตารางระบุว่า proenzymes ที่เกี่ยวข้องเขียนไว้ในวงเล็บ และว่า **sucrase กับ isomaltase เป็น separate subunits ของโปรตีนตัวเดียวกัน** (หน้า 13)"
          }
        ]
      },
      {
        "heading": "กายวิภาคของ exocrine pancreas และทางเดินท่อ",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.13",
        "body": [
          {
            "text": "ส่วนของ pancreas ที่หลั่ง pancreatic juice เป็น **compound alveolar gland ที่คล้าย salivary glands** ต้องแยกจาก **endocrine pancreas ที่สร้าง insulin และฮอร์โมนอื่นจาก islets of Langerhans** แม้ทั้งสองส่วนอยู่ในอวัยวะเดียวกัน"
          },
          {
            "text": "granules ที่บรรจุ digestive enzymes เรียกว่า **zymogen granules** ถูกสร้างในเซลล์และปล่อยออกด้วย exocytosis จากยอดเซลล์เข้าสู่ lumen ของ pancreatic ducts"
          },
          {
            "bullets": [
              "ท่อเล็กรวมกันเป็นท่อเดียวคือ pancreatic duct of Wirsung",
              "ท่อนี้เชื่อมกับ bile duct เป็น ampulla of the bile duct หรือ ampulla of Vater",
              "ampulla เปิดผ่าน duodenal papilla และรูเปิดถูกล้อมด้วย **sphincter of Oddi**"
            ]
          }
        ]
      },
      {
        "heading": "องค์ประกอบของ pancreatic juice และการทำให้กรดเป็นกลาง",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.14",
        "body": [
          {
            "text": "**pancreatic juice เป็น alkaline และมี HCO3− สูง ประมาณ 113 mEq/L เทียบกับ 24 mEq/L ใน plasma** หลั่งประมาณ **1500 mL ต่อวัน**"
          },
          {
            "text": "**bile และ intestinal juices ก็เป็นกลางหรือด่าง ทั้งสามสารคัดหลั่งนี้รวมกัน neutralize กรดจากกระเพาะ ทำให้ pH ของสิ่งที่อยู่ใน duodenum ขึ้นมาที่ 6.0-7.0** และเมื่อ chyme ไปถึง jejunum pH จะเกือบเป็นกลาง"
          },
          {
            "sub": "Table 25-3 composition of normal human pancreatic juice",
            "body": [
              {
                "bullets": [
                  "Cations: Na+, K+, Ca2+, Mg2+ (pH ประมาณ 8.0)",
                  "Anions: HCO3−, Cl−, SO4 2−, HPO4 2−",
                  "Digestive enzymes (คิดเป็น 95% ของโปรตีนในน้ำย่อย)",
                  "Other proteins"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การ activate เอนไซม์ตับอ่อน trypsin inhibitor และ acute pancreatitis",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.14",
        "body": [
          {
            "text": "เอนไซม์ส่วนใหญ่ใน pancreatic juice **ถูกปล่อยออกมาในรูป inactive และถูก activate เมื่อไปถึง intestinal lumen เท่านั้น** โดยเอนไซม์ถูก activate ผ่าน proteolytic cleavage ด้วย **trypsin ซึ่งเองก็ถูกปล่อยมาในรูป inactive precursor คือ trypsinogen**"
          },
          {
            "text": "อันตรายของการปล่อย active trypsin แม้เพียงเล็กน้อยภายใน pancreas เห็นได้ชัด เพราะจะเกิด chain reaction สร้างเอนไซม์ active ที่ย่อยอวัยวะตัวเองได้ **จึงไม่น่าแปลกใจที่ pancreas หลั่ง trypsin inhibitor ออกมาด้วยตามปกติ**"
          },
          {
            "sub": "phospholipase A2 กับสมมติฐานของ acute pancreatitis",
            "body": [
              {
                "text": "phospholipase A2 ซึ่งถูก activate ด้วย trypsin ตัด fatty acid ออกจาก phosphatidylcholine (PC) ได้เป็น lyso-PC ซึ่ง **ทำลาย cell membranes**"
              },
              {
                "text": "มีสมมติฐานว่าใน acute pancreatitis ซึ่งเป็นโรครุนแรงและบางครั้งถึงตาย phospholipase A2 ถูก activate ก่อนเวลาใน pancreatic ducts เกิด lyso-PC จาก PC ที่เป็นองค์ประกอบปกติของ bile ทำให้เนื้อ pancreas ถูกทำลายและมี necrosis ของไขมันโดยรอบ"
              },
              {
                "text": "ปกติมี pancreatic digestive enzymes รั่วเข้ากระแสเลือดเล็กน้อย แต่ใน acute pancreatitis ระดับในเลือดจะสูงขึ้นชัดเจน **การวัด plasma amylase หรือ lipase จึงมีค่าในการวินิจฉัยโรคนี้**"
              }
            ]
          }
        ]
      },
      {
        "heading": "การควบคุมการหลั่ง pancreatic juice: secretin กับ CCK",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.14",
        "body": [
          {
            "text": "**การหลั่ง pancreatic juice อยู่ใต้การควบคุมของฮอร์โมนเป็นหลัก** โดยควบคุมบางส่วนด้วย reflex mechanism และบางส่วนด้วยฮอร์โมน secretin และ cholecystokinin (CCK)"
          },
          {
            "bullets": [
              "**secretin ออกฤทธิ์ที่ pancreatic ducts ทำให้หลั่งน้ำย่อยปริมาณมากที่เป็นด่างจัด rich ใน HCO3− แต่ poor ในเอนไซม์** ผลต่อ duct cells เกิดจากการเพิ่ม intracellular cAMP และ secretin ยังกระตุ้น bile secretion ด้วย",
              "**CCK ออกฤทธิ์ที่ acinar cells ทำให้ปล่อย zymogen granules ได้น้ำย่อยที่ rich ในเอนไซม์แต่ volume ต่ำ** ผ่าน phospholipase C",
              "ทั้งสองตัวทำงานร่วมกัน คือ CCK เติมเอนไซม์เข้าไป และ secretin ทำให้เอนไซม์ถูกชะล้างเข้าสู่ลำไส้ (หน้า 15)"
            ]
          },
          {
            "text": "จาก Figure 25-13 เมื่อ volume ของ pancreatic secretion เพิ่มขึ้น **ความเข้มข้นของ Cl− จะลดลงและ HCO3− จะเพิ่มขึ้นแบบสวนทางกัน** ทั้งนี้ HCO3− ถูกหลั่งที่ท่อเล็กแต่ถูกดูดกลับที่ท่อใหญ่โดยแลกกับ Cl− และขนาดของการแลกเปลี่ยนแปรผกผันกับอัตราการไหล ส่วนการที่ amylase concentration ลดลงในรูปนั้นสะท้อนการเจือจางเมื่อ volume เพิ่มขึ้น (หน้า 15)"
          },
          {
            "text": "acetylcholine ก็ออกฤทธิ์ที่ acinar cells ผ่าน phospholipase C เหมือน CCK ทำให้ปล่อย zymogen granules และ **การกระตุ้น vagi ทำให้หลั่ง pancreatic juice ปริมาณน้อยที่ rich ในเอนไซม์** มีหลักฐานว่ามี conditioned reflex secretion ของ pancreatic juice ผ่าน vagus เมื่อเห็นหรือได้กลิ่นอาหาร (หน้า 16)"
          },
          {
            "text": "caption ของ Figure 25-14 ระบุตัวขนส่งที่ pancreatic duct cells ได้แก่ **CFTR** (cystic fibrosis transmembrane conductance regulator), **NHE-1** (sodium/hydrogen exchanger-1) และ **NBC** (sodium-bicarbonate cotransporter)"
          }
        ]
      },
      {
        "heading": "Biliary secretion: หน้าที่ของ bile และชนิดของ bile acids",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.16",
        "body": [
          {
            "text": "bile มาจาก liver **bile acids ในน้ำดีสำคัญต่อการย่อยและดูดซึมไขมัน** นอกจากนี้ bile ยังเป็น **excretory fluid สำคัญ** ที่ร่างกายใช้กำจัด lipid soluble end products ของ metabolism และ lipid soluble xenobiotics"
          },
          {
            "callout": "bile เป็นทางเดียวที่ร่างกายกำจัด cholesterol ได้ ไม่ว่าจะในรูปเดิมหรือหลังเปลี่ยนเป็น bile acids",
            "kind": "tip"
          },
          {
            "bullets": [
              "bile ประกอบด้วย bile acids, bile pigments และสารอื่นที่ละลายในสารละลาย electrolyte ที่เป็นด่างซึ่งคล้าย pancreatic juice",
              "**หลั่งประมาณ 500 mL ต่อวัน**",
              "องค์ประกอบบางส่วนถูกดูดกลับที่ลำไส้แล้วขับออกทางตับอีกครั้ง เรียกว่า enterohepatic circulation",
              "glucuronides ของ bile pigments คือ bilirubin และ biliverdin เป็นตัวให้สีเหลืองทองของ bile และเป็น breakdown products ของ hemoglobin"
            ]
          },
          {
            "sub": "primary กับ secondary bile acids",
            "body": [
              {
                "text": "bile acids ถูกสังเคราะห์จาก **cholesterol** และหลั่งเข้าน้ำดีในรูป conjugated กับ **glycine หรือ taurine** และมี steroid nucleus เช่นเดียวกับ vitamin D, cholesterol และ steroid hormones"
              },
              {
                "bullets": [
                  "**primary bile acids ที่สร้างในตับคือ cholic acid และ chenodeoxycholic acid**",
                  "ใน colon แบคทีเรียเปลี่ยน cholic acid เป็น deoxycholic acid และเปลี่ยน chenodeoxycholic acid เป็น lithocholic acid",
                  "มี ursodeoxycholic acid ปริมาณเล็กน้อยเกิดจาก chenodeoxycholic acid",
                  "**deoxycholic, lithocholic และ ursodeoxycholic acids เรียกว่า secondary bile acids เพราะเกิดจากการกระทำของแบคทีเรีย**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Micelles การดูดซึม bile acids และ enterohepatic circulation",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.17",
        "body": [
          {
            "text": "bile acids ลด surface tension และร่วมกับ phospholipids และ monoglycerides ทำให้เกิด **emulsification ของไขมัน** เตรียมพร้อมสำหรับการย่อยและดูดซึมใน small intestine"
          },
          {
            "text": "bile acids เป็น **amphipathic** คือมีทั้งด้าน hydrophilic (จากพันธะ peptide ที่มีขั้ว กลุ่ม carboxyl และ hydroxyl) และด้าน hydrophobic จึงรวมกันเป็นแผ่นทรงกระบอกเรียกว่า **micelles** โดยหันด้าน hydrophilic ออกและด้าน hydrophobic เข้า **เมื่อเกินความเข้มข้นระดับหนึ่งที่เรียกว่า critical micellar concentration bile salts ทั้งหมดที่เติมลงไปจะรวมเป็น micelles**"
          },
          {
            "sub": "การดูดซึมกลับ",
            "body": [
              {
                "bullets": [
                  "**90-95% ของ bile acids ถูกดูดซึมจาก small intestine**",
                  "เมื่อ deconjugated แล้วดูดซึมได้ด้วย nonionic diffusion แต่ส่วนใหญ่ถูกดูดซึมในรูป conjugated ที่ **terminal ileum** ผ่านระบบ **Na+-bile salt cotransport (ABST)** ที่มีประสิทธิภาพสูงมาก ซึ่งขับเคลื่อนทางอ้อมด้วย sodium ในเซลล์ที่ต่ำจาก basolateral Na+, K+ ATPase",
                  "อีก 5-10% เข้าสู่ colon และถูกเปลี่ยนเป็นเกลือของ deoxycholic acid และ lithocholic acid",
                  "**lithocholate ละลายน้ำได้น้อย ถูกขับออกทางอุจจาระเป็นส่วนใหญ่ ดูดซึมเพียง 1% ส่วน deoxycholate ถูกดูดซึม**"
                ]
              }
            ]
          },
          {
            "text": "bile acids ที่ถูกดูดซึมจะถูกส่งกลับตับทาง **portal vein** แล้วขับออกทางน้ำดีอีกครั้ง (enterohepatic circulation) ส่วนที่เสียไปกับอุจจาระถูกทดแทนด้วยการสังเคราะห์ที่ตับ **อัตราการสังเคราะห์ปกติคือ 0.2-0.4 g ต่อวัน bile acid pool ทั้งหมดประมาณ 3.5 g และหมุนเวียนซ้ำประมาณ 2 ครั้งต่อมื้ออาหาร หรือ 6-8 ครั้งต่อวัน** (หน้า 18)"
          },
          {
            "text": "caption ของ Figure 25-17 ระบุว่า **fecal loss ต้องเท่ากับ hepatic synthesis ของ bile acids ที่ steady state** และมี bile acid ส่วนน้อยอยู่ใน systemic circulation เพราะ hepatocyte เก็บจาก portal blood ได้ไม่หมด"
          }
        ]
      },
      {
        "heading": "สามกลไกของ gastrointestinal regulation",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.19",
        "body": [
          {
            "text": "หน้าที่ต่าง ๆ ของทางเดินอาหาร ทั้ง secretion, digestion, absorption และ motility ต้องถูกควบคุมอย่างบูรณาการ มี 3 modalities หลักที่ทำงานเสริมกัน:"
          },
          {
            "bullets": [
              "**endocrine** คือปล่อยฮอร์โมนจาก triggers ที่มากับมื้ออาหาร ฮอร์โมนเดินทางทางกระแสเลือดไปเปลี่ยนการทำงานของทางเดินอาหารส่วนที่อยู่ไกลออกไป หรือของอวัยวะที่ระบายเข้ามาเช่น pancreas หรือทั้งสองอย่าง",
              "**paracrine** คือ mediators บางตัวไม่เสถียรพอจะอยู่ในกระแสเลือด จึงเปลี่ยนการทำงานของเซลล์เฉพาะบริเวณที่ถูกปล่อยออกมา",
              "**neural** คือทั้ง extrinsic innervation ที่เชื่อมกับ CNS และ enteric nervous system ที่เป็นอิสระเป็นส่วนใหญ่ ประกอบด้วย sensory และ secretomotor neurons"
            ]
          },
          {
            "text": "enteric nervous system รวมสัญญาณจากส่วนกลางเข้ากับ gut แต่ก็ควบคุมการทำงานของ gut ได้เองตามการเปลี่ยนแปลงของ luminal environment **ในบางกรณีสารตัวเดียวกันทำหน้าที่ได้ทั้ง endocrine, paracrine และ neurocrine เช่น CCK**"
          }
        ]
      },
      {
        "heading": "ตระกูลของฮอร์โมนทางเดินอาหาร และ enteroendocrine cells",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.19",
        "body": [
          {
            "text": "polypeptides ที่มี biological activity ซึ่งหลั่งจาก nerve cells และ gland cells ใน mucosa ออกฤทธิ์แบบ paracrine แต่ก็เข้าสู่กระแสเลือดด้วย เมื่อให้ฮอร์โมนขนาดสูง ฤทธิ์จะซ้อนทับกัน แต่ฤทธิ์ทางสรีรวิทยาจริงค่อนข้างแยกกันชัด"
          },
          {
            "bullets": [
              "**gastrin family** สมาชิกหลักคือ gastrin และ CCK",
              "**secretin family** สมาชิกหลักคือ secretin, glucagon, vasoactive intestinal peptide (VIP ซึ่งจริง ๆ เป็น neurotransmitter หรือ neurocrine) และ gastric inhibitory polypeptide หรือ glucose-dependent insulinotropic peptide (GIP)",
              "ยังมี regulatory peptides อื่นที่ไม่อยู่ในสองตระกูลนี้"
            ]
          },
          {
            "text": "มีการระบุ **enteroendocrine cells ที่หลั่งฮอร์โมนมากกว่า 15 ชนิด** ใน mucosa ของ stomach, small intestine และ colon หลายชนิดหลั่งฮอร์โมนเพียงตัวเดียวและเรียกด้วยตัวอักษร เช่น G cells, S cells ส่วนเซลล์ที่สร้าง serotonin หรือ histamine เรียกว่า **enterochromaffin cells** และ **ECL cells** ตามลำดับ"
          }
        ]
      },
      {
        "heading": "Gastrin",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.20",
        "body": [
          {
            "text": "gastrin สร้างจาก **G cells ใน antral portion ของ gastric mucosa** G cells รูปร่างคล้ายขวด ฐานกว้างบรรจุ gastrin granules จำนวนมาก ปลายแคบไปถึงผิว mucosa มี microvilli ยื่นเข้า lumen และมี receptors ที่ microvilli ทำหน้าที่รับสัญญาณการเปลี่ยนแปลงของสิ่งที่อยู่ในกระเพาะ เซลล์หลั่งฮอร์โมนอื่นในทางเดินอาหารมี morphology คล้ายกัน"
          },
          {
            "sub": "รูปแบบโมเลกุล",
            "body": [
              {
                "bullets": [
                  "precursor คือ preprogastrin ถูกตัดเป็นชิ้นหลายขนาด สามชิ้นหลักมี 34, 17 และ 14 amino acid residues เรียกว่า **G 34, G 17 และ G 14** ทุกชิ้นมี carboxyl terminal เหมือนกัน",
                  "gastrins อาจถูก sulfate ที่ tyrosine ตัวที่ 6 นับจาก carboxyl terminal ในเลือดและเนื้อเยื่อมีทั้งรูป nonsulfated และ sulfated ในปริมาณใกล้เคียงกันและ **ออกฤทธิ์ได้เท่ากัน**",
                  "carboxyl terminal phenylalanine ถูก amidate ซึ่งน่าจะเพิ่มความเสถียรใน plasma โดยทำให้ทน carboxypeptidases",
                  "**G 14 และ G 17 มี half-life 2-3 นาที ส่วน G 34 มี half-life 15 นาที** gastrins ถูกทำลายเป็นหลักที่ kidney และ small intestine"
                ]
              }
            ]
          },
          {
            "text": "**ฤทธิ์ทางสรีรวิทยาหลักของ gastrin คือกระตุ้นการหลั่ง gastric acid และ pepsin และกระตุ้นการเจริญของ mucosa ของ stomach และทั้ง small และ large intestine (trophic action)**"
          },
          {
            "text": "gastrin ออกฤทธิ์ผ่าน receptor **CCK-B** ซึ่งสัมพันธ์กับ receptor หลักของ cholecystokinin คือ **CCK-A** สะท้อนความคล้ายเชิงโครงสร้างของฮอร์โมนสองตัว และอาจทำให้ฤทธิ์ทับซ้อนกันถ้ามีฮอร์โมนตัวใดตัวหนึ่งมากผิดปกติ เช่นในกรณี gastrinoma"
          }
        ]
      },
      {
        "heading": "Table 25-4 สิ่งที่กระตุ้นและยับยั้งการหลั่ง gastrin",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.21",
        "body": [
          {
            "sub": "กระตุ้นการหลั่ง gastrin",
            "body": [
              {
                "bullets": [
                  "Luminal: peptides และ amino acids, distention",
                  "Neural: increased vagal discharge ผ่าน GRP",
                  "Bloodborne: calcium, epinephrine"
                ]
              }
            ]
          },
          {
            "sub": "ยับยั้งการหลั่ง gastrin",
            "body": [
              {
                "bullets": [
                  "Luminal: acid, somatostatin",
                  "Bloodborne: secretin, GIP, VIP, glucagon, calcitonin"
                ]
              }
            ]
          },
          {
            "text": "การหลั่ง gastrin เพิ่มขึ้นจากการมี products of protein digestion ในกระเพาะ โดยเฉพาะ **amino acids ซึ่งออกฤทธิ์ตรงที่ G cells และ phenylalanine กับ tryptophan ได้ผลดีเป็นพิเศษ** (หน้า 20)"
          },
          {
            "text": "**acid ใน antrum ยับยั้งการหลั่ง gastrin ส่วนหนึ่งโดยออกฤทธิ์ตรงที่ G cells และอีกส่วนโดยปล่อย somatostatin ซึ่งเป็นตัวยับยั้งที่ค่อนข้างแรง นี่คือฐานของ negative feedback loop** คือ gastrin เพิ่ม acid แล้ว acid ย้อนกลับมายับยั้ง gastrin"
          },
          {
            "callout": "ในภาวะเช่น pernicious anemia ที่เซลล์หลั่งกรดของกระเพาะถูกทำลาย การหลั่ง gastrin จะสูงเรื้อรัง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Cholecystokinin (CCK)",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.21",
        "body": [
          {
            "text": "CCK หลั่งจาก endocrine cells ที่เรียกว่า **I cells ใน mucosa ของ upper small intestine**"
          },
          {
            "sub": "ฤทธิ์ที่สำคัญที่สุด",
            "body": [
              {
                "bullets": [
                  "**กระตุ้นการหลั่ง pancreatic enzyme**",
                  "**ทำให้ gallbladder หดตัว ซึ่งเป็นฤทธิ์ที่เป็นที่มาของชื่อ**",
                  "**คลาย sphincter of Oddi ให้ทั้ง bile และ pancreatic juice ไหลเข้า intestinal lumen ได้**"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างและ metabolism",
            "body": [
              {
                "bullets": [
                  "prepro-CCK ถูกตัดเป็นหลายชิ้น ทุกชิ้นมี amino acids 5 ตัวที่ carboxyl terminal เหมือนกับ gastrin",
                  "carboxyl terminal ถูก amidate และ tyrosine ตัวที่ 7 จาก carboxyl terminal ถูก sulfate",
                  "ต่างจาก gastrin ตรงที่ **ยังไม่พบรูป nonsulfated ของ CCK ในเนื้อเยื่อ**",
                  "half-life ประมาณ 5 นาที แต่ **สไลด์บอกว่ารู้เรื่อง metabolism ของมันน้อยมาก (little is known about its metabolism)**"
                ]
              }
            ]
          },
          {
            "text": "นอกจากหลั่งจาก I cells ยังพบ CCK ในเส้นประสาทที่ distal ileum และ colon และในเซลล์ประสาทในสมองโดยเฉพาะ cerebral cortex รวมทั้งในเส้นประสาทหลายส่วนของร่างกาย **ในสมอง CCK อาจเกี่ยวข้องกับการควบคุม food intake**"
          },
          {
            "sub": "ฤทธิ์เพิ่มเติมและ receptors (หน้า 22)",
            "body": [
              {
                "bullets": [
                  "เสริมฤทธิ์ secretin ในการทำให้หลั่ง alkaline pancreatic juice",
                  "ยับยั้ง gastric emptying",
                  "มี trophic effect ต่อ pancreas",
                  "เพิ่มการสังเคราะห์ enterokinase",
                  "อาจเพิ่ม motility ของ small intestine และ colon",
                  "มีหลักฐานบ้างว่าร่วมกับ secretin เสริมการหดตัวของ pyloric sphincter จึงป้องกัน reflux ของสิ่งใน duodenum กลับเข้ากระเพาะ",
                  "**CCK-A receptors อยู่ที่ periphery เป็นหลัก ส่วนในสมองพบทั้ง CCK-A และ CCK-B (gastrin) receptors ทั้งคู่ activate PLC และส่งสัญญาณผ่าน calcium**"
                ]
              }
            ]
          },
          {
            "sub": "การควบคุมการหลั่ง CCK (หน้า 22)",
            "body": [
              {
                "text": "การหลั่ง CCK เพิ่มขึ้นเมื่อ intestinal mucosa สัมผัสกับ products of digestion โดยเฉพาะ peptides และ amino acids และเมื่อมี **fatty acids ที่มีคาร์บอนมากกว่า 10 อะตอมใน duodenum**"
              },
              {
                "text": "มี protein-releasing factors สองตัวที่กระตุ้นการหลั่ง CCK คือ **CCK-releasing peptide (จาก intestinal mucosa) และ monitor peptide (จาก pancreas)** เพราะ bile และ pancreatic juice ที่เข้ามาตอบสนอง CCK ช่วยย่อยโปรตีนและไขมัน และผลผลิตของการย่อยไปกระตุ้น CCK ต่อ จึงเกิด **positive feedback**"
              },
              {
                "text": "positive feedback นี้ยุติเมื่อผลผลิตการย่อยเคลื่อนไปยังส่วนล่างของทางเดินอาหาร และเพราะ CCK-releasing peptide กับ monitor peptide ถูกย่อยด้วย proteolytic enzymes เมื่อเอนไซม์เหล่านั้นไม่ได้ยุ่งอยู่กับการย่อยโปรตีนในอาหารแล้ว"
              }
            ]
          }
        ]
      },
      {
        "heading": "Secretin",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.22",
        "body": [
          {
            "text": "secretin มีตำแหน่งพิเศษในประวัติศาสตร์สรีรวิทยา **ปี 1902 Bayliss และ Starling แสดงให้เห็นเป็นครั้งแรกว่าผลกระตุ้นการหลั่งของตับอ่อนจากการกระตุ้น duodenum เกิดจาก bloodborne factor นำไปสู่การค้นพบฮอร์โมนตัวแรกคือ secretin**"
          },
          {
            "bullets": [
              "หลั่งจาก **S cells** ที่อยู่ลึกในต่อมของ mucosa ส่วนบนของ small intestine",
              "โครงสร้างต่างจาก CCK และ gastrin แต่คล้าย GIP, glucagon และ VIP มาก",
              "แยกได้เพียง active form เดียว half-life ประมาณ 5 นาที แต่ **รู้เรื่อง metabolism ของมันน้อยมาก**"
            ]
          },
          {
            "sub": "ฤทธิ์",
            "body": [
              {
                "bullets": [
                  "**เพิ่มการหลั่ง bicarbonate โดย duct cells ของ pancreas และ biliary tract จึงทำให้ได้ pancreatic juice ที่เป็นน้ำและด่าง** ผ่าน cAMP",
                  "เสริมฤทธิ์ CCK ในการทำให้ตับอ่อนหลั่ง digestive enzymes",
                  "ลดการหลั่ง gastric acid และอาจทำให้ pyloric sphincter หดตัว"
                ]
              }
            ]
          },
          {
            "text": "การหลั่ง secretin เพิ่มขึ้นจาก products of protein digestion และจาก **กรดที่อาบ mucosa ของ small intestine ส่วนบน** การปล่อย secretin ด้วยกรดเป็นอีกตัวอย่างของ feedback control คือ secretin ทำให้ alkaline pancreatic juice ไหลท่วม duodenum ทำให้กรดจากกระเพาะเป็นกลาง จึงยับยั้งการหลั่งฮอร์โมนตัวเองต่อไป"
          }
        ]
      },
      {
        "heading": "GIP",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.22",
        "body": [
          {
            "bullets": [
              "มี **42 amino acid residues** สร้างจาก **K cells ใน mucosa ของ duodenum และ jejunum**",
              "การหลั่งถูกกระตุ้นด้วย **glucose และ fat ใน duodenum**",
              "ชื่อเดิม gastric inhibitory peptide มาจากการที่ขนาดสูงยับยั้ง gastric secretion และ motility แต่ **ปัจจุบันดูเหมือนว่ามันไม่มีฤทธิ์ยับยั้งกระเพาะที่มีนัยสำคัญเมื่อให้ในขนาดเทียบเท่ากับที่พบหลังมื้ออาหาร**",
              "**GIP กระตุ้นการหลั่ง insulin ที่ระดับ physiological จึงมักเรียกว่า glucose-dependent insulinotropic peptide**",
              "glucagon derivative **GLP-1 (7-36)** ก็กระตุ้นการหลั่ง insulin และอาจเป็น physiologic B cell-stimulating hormone ของทางเดินอาหารด้วย"
            ]
          },
          {
            "callout": "caption ของ Figure 25-19 บอกตรง ๆ ว่าตัวตนที่แน่ชัดของ hormonal factor จากลำไส้ที่ยับยั้ง gastric acid secretion และ motility ยังไม่ลงตัว (unsettled) แต่อาจเป็น peptide YY",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "VIP, motilin และ somatostatin",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.23",
        "body": [
          {
            "sub": "VIP",
            "body": [
              {
                "bullets": [
                  "มี 28 amino acid residues พบใน**เส้นประสาท**ของทางเดินอาหาร **จึงไม่ใช่ฮอร์โมนในตัวมันเอง** แม้จะคล้าย secretin แต่พบในเลือดโดยมี half-life ประมาณ 2 นาที",
                  "ในลำไส้ **กระตุ้นการหลั่ง electrolytes และจึงรวมถึงน้ำอย่างมาก**",
                  "คลาย intestinal smooth muscle รวมทั้ง sphincters, ขยาย peripheral blood vessels, ยับยั้ง gastric acid secretion",
                  "พบในสมองและ autonomic nerves หลายเส้น มักอยู่ในเซลล์ประสาทเดียวกับ acetylcholine และ **potentiate ฤทธิ์ของ acetylcholine ใน salivary glands** แต่ VIP กับ acetylcholine ไม่ได้อยู่ร่วมกันในเซลล์ประสาทที่เลี้ยงส่วนอื่นของทางเดินอาหาร",
                  "**VIPomas สัมพันธ์กับอาการท้องเสียรุนแรง**"
                ]
              }
            ]
          },
          {
            "sub": "Motilin",
            "body": [
              {
                "bullets": [
                  "polypeptide 22 amino acid residues หลั่งจาก **enterochromaffin cells และ Mo cells** ใน stomach, small intestine และ colon",
                  "ออกฤทธิ์ที่ G-protein-coupled receptors บน enteric neurons ใน duodenum และ colon",
                  "**ทำให้ smooth muscle ของกระเพาะและลำไส้หดตัวในช่วงระหว่างมื้ออาหาร (between meals)**"
                ]
              }
            ]
          },
          {
            "sub": "Somatostatin",
            "body": [
              {
                "bullets": [
                  "เดิมคือ growth hormone-inhibiting hormone ที่แยกได้จาก hypothalamus หลั่งแบบ **paracrine จาก D cells** ทั้งใน pancreatic islets และใน gastrointestinal mucosa",
                  "มีสองรูปคือ somatostatin 14 และ somatostatin 28 หลั่งทั้งคู่",
                  "**ยับยั้งการหลั่ง gastrin, VIP, GIP, secretin และ motilin** การหลั่งถูกกระตุ้นด้วยกรดใน lumen และออกฤทธิ์แบบ paracrine เป็นตัวกลางของการที่กรดยับยั้ง gastrin",
                  "ยังยับยั้ง pancreatic exocrine secretion, gastric acid secretion และ motility, gallbladder contraction และการดูดซึม glucose, amino acids และ triglycerides"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Peptide YY, ghrelin, guanylin และ peptides อื่น",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.24",
        "body": [
          {
            "sub": "Peptide YY",
            "body": [
              {
                "text": "**ยับยั้ง gastric acid secretion และ motility และเป็นตัวเต็งที่จะเป็น gastric inhibitory peptide ตัวจริง การปล่อยจาก jejunum ถูกกระตุ้นด้วยไขมัน**"
              }
            ]
          },
          {
            "sub": "Ghrelin",
            "body": [
              {
                "bullets": [
                  "หลั่งจาก **stomach** เป็นหลัก และมีบทบาทสำคัญในการควบคุมการกินที่ส่วนกลาง",
                  "กระตุ้นการหลั่ง growth hormone โดยออกฤทธิ์ตรงที่ receptors ใน pituitary",
                  "**ระดับเพิ่มขึ้นก่อนมื้ออาหาร และการให้จากภายนอกเพิ่ม appetite และ food intake อย่างชัดเจน**",
                  "การหลั่งลดลงมากในผู้ป่วยที่ผ่าตัด gastric bypass เพื่อรักษาโรคอ้วนรุนแรง ซึ่งอาจมีส่วนทำให้การรักษาได้ผล"
                ]
              }
            ]
          },
          {
            "sub": "peptides อื่น",
            "body": [
              {
                "bullets": [
                  "**Substance P** พบใน endocrine cells และ nerve cells ของทางเดินอาหาร อาจเข้าสู่กระแสเลือด และ **เพิ่ม motility ของ small intestine**",
                  "**GRP** อยู่ในปลายประสาท vagal ที่ไปสิ้นสุดที่ G cells และเป็น neurotransmitter ที่ทำให้ vagus เพิ่มการหลั่ง gastrin",
                  "**glucagon** จากทางเดินอาหารอาจเป็นสาเหตุอย่างน้อยส่วนหนึ่งของ hyperglycemia ที่พบหลังตัดตับอ่อน"
                ]
              }
            ]
          },
          {
            "sub": "Guanylin",
            "body": [
              {
                "bullets": [
                  "polypeptide 15 amino acid residues หลั่งจากเซลล์ของ intestinal mucosa **จับกับ guanylyl cyclase**",
                  "การกระตุ้น guanylyl cyclase เพิ่ม intracellular cGMP ซึ่งทำให้ **หลั่ง Cl− เข้า intestinal lumen มากขึ้น**",
                  "ออกฤทธิ์แบบ paracrine เป็นหลัก และสร้างในเซลล์ตั้งแต่ pylorus ถึง rectum",
                  "**ตัวอย่างของ molecular mimicry คือ heat-stable enterotoxin ของ Escherichia coli สายพันธุ์ที่ก่อท้องเสียบางสายพันธุ์ มีโครงสร้างคล้าย guanylin มากและกระตุ้น guanylin receptors ในลำไส้ได้**",
                  "guanylin receptors ยังพบที่ kidneys, liver และ female reproductive tract จึงอาจออกฤทธิ์แบบ endocrine ควบคุมการเคลื่อนที่ของของเหลวในเนื้อเยื่อเหล่านี้ โดยเฉพาะการประสานการทำงานของลำไส้กับไต"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Enteric nervous system",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.24",
        "body": [
          {
            "text": "มี network ของเส้นประสาทสองชุดที่เป็น intrinsic ของทางเดินอาหาร คือ **myenteric plexus ระหว่างชั้นกล้ามเนื้อ longitudinal ด้านนอกกับ circular ตรงกลาง** และ **submucous plexus ระหว่างชั้น circular กับ mucosa** รวมกันเรียกว่า enteric nervous system"
          },
          {
            "text": "**ระบบนี้มี sensory neurons, interneurons และ motor neurons ประมาณ 100 ล้านเซลล์ในคน ซึ่งมากพอ ๆ กับที่พบใน spinal cord ทั้งอัน** จึงมองได้ว่าเป็นส่วนของ CNS ที่ย้ายตำแหน่งมาดูแลการทำงานของทางเดินอาหาร และถูกเรียกว่า **little brain** เชื่อมกับ CNS ผ่าน parasympathetic และ sympathetic fibers แต่ทำงานเองได้โดยไม่ต้องมีการเชื่อมต่อเหล่านี้"
          },
          {
            "bullets": [
              "**myenteric plexus เลี้ยงกล้ามเนื้อ longitudinal และ circular และเกี่ยวข้องกับ motor control เป็นหลัก**",
              "**submucous plexus เลี้ยง glandular epithelium, intestinal endocrine cells และ submucosal blood vessels และเกี่ยวข้องกับการควบคุม intestinal secretion เป็นหลัก**"
            ]
          },
          {
            "text": "neurotransmitters ในระบบนี้ได้แก่ acetylcholine, amines คือ norepinephrine และ serotonin, amino acid คือ GABA, purine คือ ATP, ก๊าซคือ NO และ CO และ peptides กับ polypeptides อีกหลายชนิด บางตัวออกฤทธิ์แบบ paracrine บางตัวเข้ากระแสเลือดกลายเป็นฮอร์โมน และส่วนใหญ่พบในสมองด้วย"
          }
        ]
      },
      {
        "heading": "Extrinsic innervation และเลือดที่มาเลี้ยงลำไส้",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.24",
        "body": [
          {
            "text": "ลำไส้ได้รับ dual extrinsic innervation จาก autonomic nervous system โดย **parasympathetic cholinergic activity โดยทั่วไปเพิ่มการทำงานของ intestinal smooth muscle ส่วน sympathetic noradrenergic activity โดยทั่วไปลดการทำงานลงพร้อมกับทำให้ sphincters หดตัว**"
          },
          {
            "bullets": [
              "preganglionic parasympathetic fibers ประกอบด้วย **vagal efferents ประมาณ 2000 เส้น** และ efferents อื่นใน sacral nerves โดยทั่วไปไปสิ้นสุดที่ cholinergic nerve cells ของ myenteric และ submucous plexuses",
              "sympathetic fibers เป็น postganglionic หลายเส้นไปสิ้นสุดที่ postganglionic cholinergic neurons ซึ่ง **norepinephrine ที่หลั่งออกมายับยั้งการหลั่ง acetylcholine ผ่าน α2 presynaptic receptors**",
              "sympathetic fibers อื่นดูเหมือนไปสิ้นสุดที่ intestinal smooth muscle cells โดยตรง",
              "ยังมี fibers ที่เลี้ยง blood vessels ทำให้เกิด vasoconstriction"
            ]
          },
          {
            "text": "intestinal blood vessels ดูจะมี dual innervation คือ extrinsic noradrenergic innervation และ intrinsic innervation จาก enteric nervous system โดยมี **VIP และ NO เป็น mediators ของ intrinsic innervation ซึ่งน่าจะรับผิดชอบ hyperemia คือการเพิ่ม local blood flow ที่มาพร้อมกับการย่อยอาหาร**"
          },
          {
            "callout": "สไลด์ระบุว่ายังไม่ลงตัว (unsettled) ว่าหลอดเลือดเหล่านี้มี cholinergic innervation เพิ่มอีกชุดหรือไม่",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Mucosal immune system และ microbiota",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.25",
        "body": [
          {
            "text": "การที่ intestinal lumen ต่อเนื่องกับโลกภายนอกทำให้ระบบทางเดินอาหารเป็น **portal สำคัญของการติดเชื้อ** ขณะเดียวกันลำไส้ก็ได้ประโยชน์จาก **commensal bacteria** ที่ให้ metabolic functions ที่เป็นประโยชน์และน่าจะเพิ่มความต้านทานต่อเชื้อก่อโรค"
          },
          {
            "text": "ภายใต้การกระตุ้นจากจุลชีพตลอดเวลา ลำไส้ของสัตว์เลี้ยงลูกด้วยนมจึงพัฒนากลไก innate และ adaptive immunity ที่ซับซ้อนเพื่อแยกมิตรจากศัตรู **intestinal mucosa มี lymphocytes มากกว่าที่พบในกระแสเลือด** และมี inflammatory cells จำนวนมากที่วางตัวพร้อมป้องกัน mucosa หากด่าน epithelium ถูกทะลุ"
          },
          {
            "callout": "immune cells และผลผลิตของมันน่าจะมีผลต่อการทำงานเชิงสรีรวิทยาของ epithelium, endocrine cells, nerves และ smooth muscle โดยเฉพาะช่วงติดเชื้อและเมื่อมี immune response ที่ไม่เหมาะสมยืดเยื้อ เช่นใน inflammatory bowel diseases",
            "kind": "warn"
          },
          {
            "sub": "intestinal microbiota",
            "body": [
              {
                "bullets": [
                  "**จำนวนจุลชีพเพิ่มขึ้นอย่างมากเมื่อเคลื่อนไป aborally และสูงสุดที่ colon ซึ่ง microbiota ถูกครองโดย strict anaerobes**",
                  "จุลชีพสร้าง metabolites จำนวนมากที่เซลล์สัตว์เลี้ยงลูกด้วยนมสร้างไม่ได้ รวมทั้ง vitamins และช่วยกู้สารอาหารที่ pancreatic enzymes ย่อยไม่ได้ เช่น **dietary fiber ถูกย่อยเป็น short chain fatty acids ที่ดูดซึมผ่าน colonic epithelium ได้**",
                  "**แบคทีเรีย deconjugate bile acids ทำให้รูป unconjugated ซึ่ง hydrophobic กว่า ถูกดูดซึมกลับเข้า portal circulation แบบ passive ได้**",
                  "microbiota น่าจะเพิ่มความต้านทานต่อการ colonize ของเชื้อก่อโรค สอน mucosal immune system ในช่วงต้นหลังคลอด และส่งสัญญาณไปสมองที่เปลี่ยนพฤติกรรมได้"
                ]
              },
              {
                "text": "เมื่อสมดุลของชุมชนจุลชีพเสียไป เรียกว่า **dysbiosis** จากโรคหรือจากการใช้ broad spectrum antibiotics อาจกระทบสรีรวิทยาของลำไส้หรือเปิดโอกาสให้เชื้อก่อโรคเข้ามา เช่น **Clostridium difficile ที่มักเจริญเกินในลำไส้ของผู้ป่วยในโรงพยาบาลที่ได้รับ antibiotics** ทำให้เกิดอาการทางเดินอาหารรุนแรงและกำจัดยากมาก โดยการศึกษาทางคลินิกล่าสุดพบว่าผู้ป่วยที่ติดเชื้อ C. difficile ซ้ำ ๆ มักได้ประโยชน์อย่างมากจากการปลูกถ่ายจุลชีพจากอุจจาระของผู้บริจาคที่สุขภาพดีผ่านการสวน (enema)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Splanchnic circulation",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.25",
        "body": [
          {
            "text": "เลือดที่ไปเลี้ยง stomach, intestines, pancreas และ liver **จัดเรียงเป็น series of parallel circuits โดยเลือดทั้งหมดจากลำไส้และตับอ่อนระบายเข้า portal vein ไปยัง liver**"
          },
          {
            "bullets": [
              "เลือดจาก intestines, pancreas และ spleen ระบายผ่าน hepatic portal vein ไป liver แล้วออกทาง hepatic veins สู่ inferior vena cava",
              "**viscera และ liver ได้รับประมาณ 30% ของ cardiac output ผ่าน celiac, superior mesenteric และ inferior mesenteric arteries**",
              "**ขณะอดอาหาร liver ได้รับประมาณ 1300 mL/min จาก portal vein และ 500 mL/min จาก hepatic artery** และ portal supply ยิ่งเพิ่มขึ้นหลังมื้ออาหาร"
            ]
          },
          {
            "callout": "caption ของ Figure 25-20 ย้ำว่าแม้ในช่วงอดอาหาร liver ก็ยังได้เลือดส่วนใหญ่มาทาง portal vein",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Water balance ในทางเดินอาหาร (Table 25-5)",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.26",
        "body": [
          {
            "text": "**ในแต่ละวันลำไส้ได้รับของเหลวที่กินเข้าไปประมาณ 2000 mL บวกกับ secretions อีก 7000 mL จาก mucosa ของทางเดินอาหารและต่อมที่เกี่ยวข้อง มี 98% ถูกดูดซึมกลับ เหลือสูญเสียไปกับอุจจาระเพียง 200 mL ต่อวัน**"
          },
          {
            "sub": "ตัวเลขใน Table 25-5 (หน่วย mL ต่อวัน, หน้า 27)",
            "body": [
              {
                "bullets": [
                  "Ingested 2000",
                  "Endogenous secretions รวม 7000 ได้แก่ salivary glands 1500, stomach 2500, bile 500, pancreas 1500, intestine 1000",
                  "Total input 9000",
                  "Reabsorbed รวม 8800 ได้แก่ jejunum 5500, ileum 2000, colon 1300",
                  "Balance in stool 200"
                ]
              }
            ]
          },
          {
            "text": "**น้ำเคลื่อนเข้าออก lumen แบบ passive ตาม electrochemical gradients ที่สร้างโดย active transport ของ ions และ solutes อื่น** หลังมื้ออาหาร การดูดน้ำกลับส่วนใหญ่ขับเคลื่อนด้วย coupled transport ของ nutrients เช่น glucose ร่วมกับ sodium ส่วนช่วงระหว่างมื้อ กลไกการดูดซึมอาศัย electrolytes ล้วน ๆ และในทั้งสองกรณี secretory fluxes ถูกขับเคลื่อนด้วย **active transport ของ chloride เข้า lumen** เป็นหลัก แม้โดยรวมการดูดซึมจะเหนือกว่าเสมอ"
          }
        ]
      },
      {
        "heading": "การดูดซึม Na+ แบบ electroneutral กับ electrogenic",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.27",
        "body": [
          {
            "text": "ใน small intestine **secondary active transport ของ Na+ สำคัญต่อการดูดซึม glucose, amino acids บางตัว และสารอื่นเช่น bile acids** และในทางกลับกัน **การมี glucose ใน intestinal lumen ช่วยให้ดูดซึม Na+ ได้ดีขึ้น**"
          },
          {
            "bullets": [
              "ช่วงระหว่างมื้อที่ไม่มี nutrients **sodium และ chloride ถูกดูดซึมพร้อมกันด้วยการทำงานคู่กันของ sodium/hydrogen exchanger (NHE) และ chloride/bicarbonate exchanger ที่ apical membrane เรียกว่า electroneutral mechanism** แล้วน้ำตามมาเพื่อรักษาสมดุล osmotic",
              "ใน colon โดยเฉพาะ distal colon ยังมีกลไก **electrogenic sodium absorption ผ่าน ENaC (epithelial sodium channel) ซึ่งเหมือนกับที่ distal tubule ของไต** เป็นพื้นฐานให้ colon ทำให้อุจจาระแห้งและเสียของเหลวออกไปน้อย",
              "**เมื่อกินอาหาร low-salt การแสดงออกของ ENaC เพิ่มขึ้นตอบสนองต่อ aldosterone ทำให้กู้ sodium จากอุจจาระได้มากขึ้น**"
            ]
          },
          {
            "text": "caption ของ Figure 25-21 ระบุว่า chloride/bicarbonate exchanger คือ DRA (down-regulated in adenoma) หรือ PAT1 (putative anion transporter-1) มี putative potassium/chloride cotransporter (KCC1) ที่ basolateral membrane ให้ chloride ออก ส่วน sodium ถูกดันออกด้วย Na+, K+ ATPase (หน้า 28)"
          }
        ]
      },
      {
        "heading": "Chloride secretion: NKCC1 และ CFTR",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.28",
        "body": [
          {
            "text": "แม้กลไกดูดซึมจะเด่นกว่า แต่ **การหลั่งเกิดขึ้นต่อเนื่องตลอด small intestine และ colon เพื่อปรับความเหลวของสิ่งที่อยู่ในลำไส้ให้เหมาะกับการผสม การแพร่ และการเคลื่อนของอาหารและกาก**"
          },
          {
            "bullets": [
              "**Cl− เข้าสู่ enterocytes จาก interstitial fluid ผ่าน Na+-K+-2Cl− cotransporters (NKCC1) ที่ basolateral membrane**",
              "**แล้ว Cl− ถูกหลั่งเข้า lumen ผ่าน channels ที่ถูกควบคุมโดย protein kinases ต่าง ๆ**",
              "**CFTR (cystic fibrosis transmembrane conductance regulator) ซึ่งบกพร่องในโรค cystic fibrosis เป็นช่องที่สำคัญที่สุดเชิงปริมาณ และถูก activate ด้วย protein kinase A จึงถูก activate ด้วย cAMP**"
            ]
          }
        ]
      },
      {
        "heading": "Clinical Box 25-2 Cholera และ oral rehydration",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.29",
        "body": [
          {
            "text": "cholera เป็น **secretory diarrheal disease รุนแรง** ที่มักระบาดพร้อมภัยพิบัติธรรมชาติซึ่งระบบสุขาภิบาลปกติล่มสลาย และร่วมกับโรคท้องเสียชนิด secretory อื่นจากแบคทีเรียและไวรัส ก่อ morbidity และ mortality จำนวนมาก โดยเฉพาะในเด็กเล็กและในประเทศกำลังพัฒนา"
          },
          {
            "sub": "กลไก",
            "body": [
              {
                "bullets": [
                  "**cAMP ใน intestinal epithelial cells เพิ่มขึ้นใน cholera**",
                  "เชื้อ cholera อยู่ใน intestinal lumen แต่สร้าง toxin ที่จับ receptors บน apical membrane ทำให้ **A subunit ของ toxin เข้าสู่เซลล์**",
                  "**toxin จับ adenosine diphosphate ribose เข้ากับ α subunit ของ Gs ทำให้ GTPase activity ถูกยับยั้ง G-protein จึงถูก activate อย่างถาวร กระตุ้น adenylyl cyclase ต่อเนื่องและ cAMP ในเซลล์เพิ่มขึ้นมาก**",
                  "นอกจาก Cl− secretion เพิ่มแล้ว **การทำงานของ NHE3 ยังลดลง ทำให้การดูดซึม NaCl ลดลงด้วย** ส่งผลให้ electrolyte และน้ำในลำไส้เพิ่ม เกิดท้องเสีย",
                  "**แต่ Na+, K+ ATPase และ Na+/glucose cotransporter ไม่ถูกกระทบ การดูดซึม glucose ร่วมกับ Na+ จึงข้ามความบกพร่องนี้ไปได้**"
                ]
              }
            ]
          },
          {
            "sub": "Therapeutic highlights ตามที่กล่องเขียนไว้",
            "body": [
              {
                "bullets": [
                  "การรักษาส่วนใหญ่เป็น supportive เพราะสุดท้ายการติดเชื้อจะหายเอง แม้บางครั้งใช้ antibiotics",
                  "**สิ่งสำคัญที่สุดคือการทดแทนของเหลวและ electrolytes ปริมาณมากที่เสียไปกับอุจจาระเพื่อไม่ให้ขาดน้ำ โดย stool volume อาจสูงถึง 20 L ต่อวัน**",
                  "ถ้ามีอุปกรณ์ปลอดเชื้อ ให้ทดแทนทางหลอดเลือดดำได้สะดวกที่สุด แต่ในสถานการณ์ระบาดมักทำไม่ได้",
                  "**การที่ Na+/glucose cotransporter ยังทำงานอยู่เป็นพื้นฐานทางสรีรวิทยาของการรักษาด้วย oral rehydration solution ซึ่งเป็นน้ำตาลผสมเกลือสำเร็จรูปละลายน้ำ และช่วยลดอัตราการตายในการระบาดของ cholera และโรคท้องเสียอื่นอย่างมาก**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Osmolality ในลำไส้และการจัดการ K+",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.30",
        "body": [
          {
            "text": "**น้ำเคลื่อนเข้าออกลำไส้จนกว่า osmotic pressure ของสิ่งที่อยู่ในลำไส้จะเท่ากับของ plasma** osmolality ของสิ่งที่อยู่ใน duodenum อาจ hypertonic หรือ hypotonic ขึ้นกับมื้ออาหาร แต่ **เมื่ออาหารเข้าสู่ jejunum osmolality จะใกล้เคียงกับ plasma** และคงระดับนี้ตลอด small intestine ที่เหลือ เพราะอนุภาคที่ osmotically active ที่เกิดจากการย่อยถูกดูดซึมออกไปและน้ำเคลื่อนออกจาก gut ตาม osmotic gradient ที่เกิดขึ้น ส่วนใน colon เมื่อ Na+ ถูกดูดซึม น้ำก็เคลื่อนตามไปแบบ passive ตาม osmotic gradient เช่นกัน"
          },
          {
            "bullets": [
              "**saline cathartics เช่น magnesium sulfate เป็นเกลือที่ดูดซึมได้ไม่ดี จึงกักน้ำในปริมาณเทียบเท่า osmotic ไว้ในลำไส้ เพิ่ม intestinal volume และให้ฤทธิ์ระบาย**",
              "ปริมาณของเหลวใน lumen ยังขึ้นกับอัตรา intestinal motility ด้วย **เมื่อ motility ช้า จะมีเวลาให้ดูดซึมมากขึ้น** ยาแก้ท้องเสียหลายตัวออกฤทธิ์โดยทำให้การหดตัวของกล้ามเนื้อ gut ไม่ประสานกันและชะลอ propulsive motility"
            ]
          },
          {
            "sub": "K+ ใน colon",
            "body": [
              {
                "bullets": [
                  "K+ บางส่วนถูกหลั่งเข้า lumen โดยเฉพาะในฐานะองค์ประกอบของ mucus",
                  "**enterocytes ของ colon มี K+ channels ทั้งที่ luminal และ basolateral membrane K+ จึงถูกหลั่งเข้า colon และเคลื่อนตาม electrochemical gradient แบบ passive**",
                  "การสะสม K+ ใน colon ถูกชดเชยบางส่วนด้วย **H+-K+ ATPase ที่ luminal membrane ของเซลล์ใน distal colon ซึ่งขนส่ง K+ กลับเข้าเซลล์แบบ active**",
                  "**การสูญเสียของเหลวจาก ileum หรือ colon ในภาวะท้องเสียเรื้อรังทำให้เกิด hypokalemia รุนแรงได้**",
                  "เมื่อกิน K+ สูงเป็นเวลานาน การหลั่ง aldosterone เพิ่มขึ้นและ K+ เข้าสู่ colonic lumen มากขึ้น ส่วนหนึ่งจากการมี Na+, K+ ATPase pumps ที่ basolateral membrane มากขึ้น ทำให้ K+ ในเซลล์สูงขึ้นและแพร่ออกทาง luminal membrane มากขึ้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Chapter summary ตามที่บทสรุปเขียนไว้",
        "source": "Chapter 25 Overview of Gastrointestinal Function and Regulation p.30",
        "body": [
          {
            "bullets": [
              "ระบบทางเดินอาหารวิวัฒน์มาเป็น portal ให้รับสารอาหารอย่างควบคุมได้ในสิ่งมีชีวิตหลายเซลล์ และขับกากอาหารรวมทั้ง lipid-soluble metabolic waste ของร่างกายเอง มันต่อเนื่องกับสิ่งแวดล้อมภายนอกและมี immune system ที่พัฒนาดี",
              "ทางเดินอาหารบุด้วย columnar epithelial cells ที่ถูกแทนที่ตลอดเวลา และพับเป็น crypts และ villi โดยมี lamina propria และ submucosa อยู่ใต้ epithelium บรรจุ immune cells, blood vessels และ lymphatics ส่วนชั้นกล้ามเนื้อ circular และ longitudinal ทำหน้าที่ motility",
              "digestive secretions เปลี่ยนแปลงองค์ประกอบของอาหารทางเคมี โดยเฉพาะ macromolecules ให้ดูดซึมผ่าน epithelium ได้ อาหารถูกกระทำตามลำดับด้วย saliva, gastric juice, pancreatic juice และ bile",
              "การทำงานถูกควบคุมแบบบูรณาการด้วยกลไก endocrine, paracrine และ neurocrine โดยฮอร์โมนและ paracrine factors ถูกปล่อยจาก enteroendocrine cells ตามสัญญาณที่มาพร้อมมื้ออาหาร",
              "enteric nervous system นำข้อมูลจาก CNS มาสู่ทางเดินอาหาร แต่บ่อยครั้งก็ activate programmed responses ของ secretion และ motility ได้เอง",
              "ลำไส้มี mucosal immune system กว้างขวางที่ควบคุมการตอบสนองต่อ microbiota และป้องกันการรุกรานของเชื้อก่อโรค",
              "ลำไส้มีระบบไหลเวียนที่ไม่ธรรมดา คือเลือดดำส่วนใหญ่ไม่กลับเข้าหัวใจโดยตรง แต่ถูกส่งไป liver ทาง portal vein ก่อน",
              "**ลำไส้และอวัยวะที่ระบายเข้ามาหลั่งของเหลวประมาณ 8 L ต่อวัน รวมกับน้ำที่กินเข้าไป ส่วนใหญ่ถูกดูดซึมกลับ เหลือประมาณ 200 mL ไปกับอุจจาระ และทั้งการหลั่งและการดูดซึมต้องอาศัย active epithelial transport ของ ions หรือ nutrients หรือทั้งสองอย่าง**"
            ]
          }
        ]
      }
    ]
  },
  "physio-3--chapter-26-digestion-and-absorption-of-nutrients": {
    "topic": "physio-3--chapter-26-digestion-and-absorption-of-nutrients",
    "title": "Chapter 26 การย่อยและการดูดซึมสารอาหาร (Digestion and Absorption of Nutrients)",
    "icon": "📗",
    "summary": "เอกสารชุดนี้ไม่ใช่สไลด์บรรยายแบบ bullet แต่เป็น text เต็มของ Ganong's Review of Medical Physiology 26e บทที่ 26 (20 หน้า) ครอบคลุมหลักโภชนาการและการกระจาย calorie ตามด้วยการย่อยและดูดซึม carbohydrate protein lipid nucleic acid แล้วต่อด้วย SCFA ใน colon การดูดซึม minerals (Ca2+ และ Fe) และ vitamins ปิดท้ายด้วยการควบคุมการกินอาหาร leptin ghrelin และ obesity มี Clinical Box 4 กล่อง (lactose intolerance, malabsorption syndrome, disorders of iron uptake, obesity) และตาราง 4 ตาราง หมายเหตุความซื่อสัตย์: ตาราง 26-2 (ตำแหน่งที่ดูดซึมมากที่สุดของแต่ละสาร) ในไฟล์ text ถูกสลับคอลัมน์จนอ่านจับคู่ไม่ได้ จึงไม่สรุปค่ารายช่วงลำไส้ในโน้ตนี้ และรูป Figure 26-1 ถึง 26-9 เป็นภาพซึ่งอ่านได้เฉพาะคำบรรยายใต้ภาพ",
    "sections": [
      {
        "heading": "ภาพรวม: ทางเดินอาหารคือประตูเข้าของสารอาหาร",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.1",
        "body": [
          {
            "text": "gastrointestinal system คือ portal ที่สารอาหาร vitamins minerals และของเหลวเข้าสู่ร่างกาย proteins fats และ complex carbohydrates ถูกย่อยเป็นหน่วยที่ดูดซึมได้ (digested) **โดยหลักที่ small intestine แม้จะไม่ใช่ทั้งหมด** จากนั้นผลิตภัณฑ์ของการย่อยพร้อมกับ vitamins minerals และน้ำจะข้าม mucosa เข้าสู่ lymph หรือเลือด (absorption)"
          },
          {
            "sub": "แหล่งของ digestive enzymes ตามที่บทนี้เรียง",
            "body": [
              {
                "bullets": [
                  "salivary glands: โจมตี carbohydrates (และ fats ในสัตว์บางชนิด)",
                  "stomach: โจมตี proteins และ fats",
                  "exocrine pancreas: โจมตี carbohydrates, proteins, lipids, DNA และ RNA",
                  "เอนไซม์ที่ทำให้การย่อยสมบูรณ์ อยู่ที่ luminal membranes และ cytoplasm ของเซลล์ที่บุ small intestine"
                ]
              }
            ]
          },
          {
            "text": "การทำงานของเอนไซม์เหล่านี้อาศัย hydrochloric acid ที่หลั่งจากกระเพาะและ bile ที่หลั่งจากตับช่วย"
          },
          {
            "text": "สารส่วนใหญ่ผ่านจาก intestinal lumen เข้า enterocytes แล้วออกจาก enterocytes สู่ interstitial fluid โดย **กระบวนการที่พาสารข้าม luminal cell membrane มักต่างจากกระบวนการที่พาข้าม basal และ lateral membrane**"
          }
        ]
      },
      {
        "heading": "Caloric intake และการกระจาย calorie",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.2",
        "body": [
          {
            "text": "อาหารที่ดี (optimal diet) นอกจากน้ำที่เพียงพอ ต้องมี calories, protein, fat, minerals และ vitamins อย่างเพียงพอ ค่าพลังงานของอาหารที่กินต้องใกล้เคียงกับพลังงานที่ใช้ ถ้าจะรักษาน้ำหนักตัวไว้"
          },
          {
            "bullets": [
              "basal needs ประมาณ **2000 kcal/d**",
              "กิจกรรมประจำวันต้องการเพิ่มอีก **500-2500 kcal/d หรือมากกว่า**",
              "protein ที่พึงประสงค์ **1 g/kg body weight ต่อวัน**",
              "fat ให้พลังงาน **9.3 kcal/g** เป็นรูปอาหารที่กระชับที่สุด แต่มักแพงที่สุด",
              "carbohydrate เป็นแหล่ง calorie ที่ถูกที่สุด และให้ 50% หรือมากกว่าของ calories ในอาหารส่วนใหญ่"
            ]
          },
          {
            "text": "ใน average middle-class American diet ประมาณ **50% ของ calories มาจาก carbohydrate, 15% จาก protein และ 35% จาก fat**"
          },
          {
            "sub": "ตัวอย่างการคำนวณตามบทนี้",
            "body": [
              {
                "text": "เวลาคำนวณความต้องการอาหาร ให้ตอบความต้องการ protein ก่อน แล้วค่อยแบ่ง calorie ที่เหลือระหว่าง fat กับ carbohydrate ตามรสนิยม รายได้ และปัจจัยอื่น ตัวอย่างในบท: ชาย 65 kg ที่ moderately active ต้องการประมาณ 2800 kcal/d ควรกิน protein อย่างน้อย 65 g ซึ่งให้ 267 kcal (65 x 4.1) ตัวเลข fat ที่สมเหตุสมผลคือ 50-60 g ส่วนที่เหลือเติมด้วย carbohydrate"
              }
            ]
          },
          {
            "text": "เรื่อง fat: ในชุมชน Central และ South American Indian ที่ใช้ corn (carbohydrate) เป็นอาหารหลัก ผู้ใหญ่อยู่ได้หลายปีโดยไม่มีผลเสียแม้กิน fat ต่ำมาก ดังนั้นถ้าได้ essential fatty acids (FA) เพียงพอ การกิน fat ต่ำดูจะไม่เป็นอันตราย และ diet ที่ต่ำใน saturated fats เป็นสิ่งที่พึงประสงค์"
          }
        ]
      },
      {
        "heading": "Essential amino acids และคุณภาพของ protein (Grade I vs Grade II)",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.2",
        "body": [
          {
            "text": "**essential amino acids คือกรดอะมิโนที่ร่างกายมนุษย์สังเคราะห์เองไม่ได้ จึงต้องได้จาก dietary protein** บทนี้ระบุว่ามี 8 ตัว ตาม Table 26-1"
          },
          {
            "sub": "Table 26-1 จัดกลุ่มตาม class",
            "body": [
              {
                "bullets": [
                  "Basic: lysine, histidine",
                  "Aliphatic: valine, leucine, isoleucine",
                  "Aromatic: phenylalanine, tryptophan",
                  "Hydroxyl: threonine",
                  "Sulfur: methionine"
                ]
              }
            ]
          },
          {
            "bullets": [
              "**Grade I proteins** = animal proteins จาก meat, fish, dairy products และ eggs มี amino acid ครบรวมทั้ง essential amino acids ในสัดส่วนใกล้เคียงกับที่ต้องใช้",
              "**Grade II proteins** = plant proteins ส่วนใหญ่ ให้สัดส่วน amino acid ต่างออกไป และบางชนิดขาด essential amino acid ไปหนึ่งตัวหรือมากกว่า",
              "ผู้ที่กินมังสวิรัติจึงต้องกิน grade II proteins แบบผสมกันอย่างมีกลยุทธ์ และมักต้องกินปริมาณมากเพราะเกิด amino acid wastage"
            ]
          }
        ]
      },
      {
        "heading": "Carbohydrate digestion ในช่วง luminal: alpha-amylase",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.3",
        "body": [
          {
            "text": "carbohydrate ในอาหารหลัก ๆ คือ polysaccharides, disaccharides และ monosaccharides โดย **starches (glucose polymers) และอนุพันธ์ เป็น polysaccharide ชนิดเดียวที่ถูกย่อยได้จริงในทางเดินอาหารมนุษย์ด้วยเอนไซม์ของมนุษย์**"
          },
          {
            "bullets": [
              "amylopectin ซึ่งเป็นราว **75% ของ dietary starch** เป็นโมเลกุลแบบ branched",
              "amylose เป็นสายตรงที่มีเฉพาะ alpha1:4 linkages",
              "disaccharides ที่กิน ได้แก่ lactose (milk sugar) และ sucrose (table sugar) ส่วน monosaccharides ได้แก่ fructose และ glucose"
            ]
          },
          {
            "text": "ในปาก starch ถูกโจมตีโดย salivary alpha-amylase ซึ่งมี **optimal pH 6.7** แต่ยังทำงานได้บางส่วนเมื่อเข้าไปในกระเพาะแม้ gastric juice จะเป็นกรด เพราะ active site ถูกป้องกันบางส่วนเมื่อมี substrate อยู่"
          },
          {
            "text": "ใน small intestine ทั้ง salivary และ pancreatic alpha-amylase ออกฤทธิ์ต่อ polysaccharides ทั้งคู่ **hydrolyze internal alpha1:4 linkages แต่ไม่แตะ alpha1:6 linkages และ terminal alpha1:4 linkages**"
          },
          {
            "sub": "end products ของการย่อยด้วย alpha-amylase เป็น oligosaccharides",
            "body": [
              {
                "bullets": [
                  "maltose (disaccharide)",
                  "maltotriose (trisaccharide)",
                  "alpha-limit dextrins = branched polymers ของ glucose เฉลี่ยประมาณ 8 โมเลกุล ที่มี alpha1:6 linkages"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Brush border oligosaccharidases และผลของการขาดเอนไซม์",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.3",
        "body": [
          {
            "text": "oligosaccharidases ที่ย่อยอนุพันธ์ของ starch ต่อ **อยู่ที่ brush border ของ small intestinal epithelial cells** และบางตัวมี substrate มากกว่าหนึ่งชนิด"
          },
          {
            "bullets": [
              "isomaltase รับผิดชอบ hydrolysis ของ alpha1:6 linkages เป็นหลัก และร่วมกับ maltase และ sucrase ย่อย maltotriose และ maltose ด้วย",
              "sucrase และ isomaltase ถูกสังเคราะห์เริ่มแรกเป็น **single glycoprotein chain** เดียวที่แทรกเข้าไปใน brush border membrane แล้วจึงถูก pancreatic proteases ตัดเป็น subunit sucrase และ isomaltase",
              "sucrase ย่อย sucrose ได้ glucose 1 โมเลกุล + fructose 1 โมเลกุล",
              "lactase ย่อย lactose ได้ glucose + galactose"
            ]
          },
          {
            "callout": "การย่อยที่ brush border สร้าง monosaccharides ความเข้มข้นสูงตรงตำแหน่งที่จะถูกดูดซึมพอดี ซึ่งอาจช่วย sequester น้ำตาลออกจาก bacteria และเลี่ยง bacterial overgrowth ใน small intestine",
            "kind": "tip"
          },
          {
            "sub": "เมื่อขาด brush border oligosaccharidase ตัวใดตัวหนึ่ง",
            "body": [
              {
                "text": "อาจเกิด diarrhea, bloating และ flatulence หลังกินน้ำตาล กลไกตามบทนี้คือ **diarrhea เกิดจากจำนวนโมเลกุล oligosaccharide ที่ osmotically active ค้างใน intestinal lumen มากขึ้น ทำให้ปริมาตรของ intestinal contents เพิ่ม** และใน colon แบคทีเรียย่อย oligosaccharides บางส่วนต่อ ยิ่งเพิ่มจำนวนอนุภาคที่ osmotically active ส่วน bloating และ flatulence เกิดจากการสร้างแก๊ส **CO2 และ H2** จากเศษ disaccharide ใน lower small intestine และ colon"
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical Box 26-1: Lactose intolerance",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.4",
        "body": [
          {
            "text": "ใน mammals ส่วนใหญ่และในมนุษย์หลายเชื้อชาติ **intestinal lactase activity สูงตอนแรกเกิด แล้วลดลงสู่ระดับต่ำในวัยเด็กและวัยผู้ใหญ่** ระดับ lactase ที่ต่ำนี้สัมพันธ์กับภาวะทนนมไม่ได้ (lactose intolerance)"
          },
          {
            "bullets": [
              "ชาว Europeans ส่วนใหญ่และลูกหลานชาวอเมริกันของพวกเขายังคงมี lactase เพียงพอในวัยผู้ใหญ่ อุบัติการณ์ของ lactase deficiency ใน northern และ western Europeans เพียงประมาณ **15%**",
              "แต่อุบัติการณ์ใน blacks, American Indians, Asians และประชากรแถบ Mediterranean สูงถึง **70-100%**"
            ]
          },
          {
            "text": "เมื่อคนกลุ่มนี้กิน dairy products จะย่อย lactose ได้ไม่พอ จึงเกิดอาการ bloating, pain, gas และ diarrhea จาก unabsorbed osmoles ที่ถูก colonic bacteria ย่อยต่อ"
          },
          {
            "sub": "Therapeutic highlights",
            "body": [
              {
                "text": "วิธีที่ง่ายที่สุดคือเลี่ยง dairy products แต่บางครั้งก็ทำได้ยาก อาการบรรเทาได้ด้วยการให้ commercial lactase preparations แต่ราคาแพง"
              }
            ]
          }
        ]
      },
      {
        "heading": "การดูดซึม hexoses และ SGLT-1",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.5",
        "body": [
          {
            "text": "hexoses ถูกดูดซึมอย่างรวดเร็วผ่านผนัง small intestine **แทบทั้งหมดถูกเอาออกไปก่อนที่เศษอาหารจะถึงส่วนปลายของ ileum** โมเลกุลน้ำตาลผ่านจาก mucosal cells เข้าสู่เลือดใน capillaries ที่ระบายลง portal vein"
          },
          {
            "text": "การขนส่ง glucose และ galactose ขึ้นกับ Na+ ใน intestinal lumen โดย **Na+ ความเข้มข้นสูงที่ผิว mucosal ช่วยให้น้ำตาลไหลเข้าเซลล์ epithelial ส่วนความเข้มข้นต่ำจะยับยั้ง** เพราะน้ำตาลกลุ่มนี้กับ Na+ ใช้ cotransporter (symport) ตัวเดียวกัน คือ sodium-dependent glucose transporter (SGLT หรือ Na+ glucose cotransporter)"
          },
          {
            "bullets": [
              "**SGLT-1 รับผิดชอบการนำ dietary glucose เข้าจากลำไส้**",
              "**SGLT-2 รับผิดชอบการขนส่ง glucose ออกจาก renal tubules**"
            ]
          },
          {
            "callout": "ตาราง 26-2 ในเอกสารระบุตำแหน่งที่ดูดซึมหรือหลั่งมากที่สุดของสารแต่ละชนิด (ให้คะแนน + ถึง +++) แต่ในไฟล์ text ที่อ่านได้ คอลัมน์ upper small intestine, mid, lower และ colon ถูกสลับปนกันจนจับคู่กับแต่ละแถวไม่ได้ จึงไม่สรุปค่ารายช่วงลำไส้ในโน้ตนี้ เชิงอรรถที่อ่านได้ชัดคือ Sec หมายถึงหลั่งออกเมื่อ luminal K+ ต่ำ และ upper small intestine หมายถึง jejunum เป็นหลัก แม้ duodenum จะคล้ายกันในกรณีที่ศึกษาส่วนใหญ่ ยกเว้นข้อที่ว่า duodenum หลั่ง HCO3- และแทบไม่มี net absorption หรือ secretion ของ NaCl",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Secondary active transport, GLUT2 และเส้นทางของ fructose",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.6",
        "body": [
          {
            "text": "เพราะ intracellular Na+ ใน intestinal epithelial cells ต่ำ Na+ จึงเคลื่อนเข้าเซลล์ตาม concentration gradient และ glucose เคลื่อนตาม Na+ เข้ามาด้วย จากนั้น **Na+ ถูกส่งออกทาง basolateral โดย Na+, K+ ATPase** ส่วน glucose ที่เซลล์ไม่ต้องการจะออกจากเซลล์โดย facilitated diffusion ผ่าน **GLUT2** เข้า interstitium แล้วไปยัง capillaries"
          },
          {
            "text": "**การขนส่ง glucose จึงเป็นตัวอย่างของ secondary active transport** พลังงานมาทางอ้อมจาก active transport ของ Na+ ออกจากเซลล์ ซึ่งรักษา concentration gradient ที่ luminal border ให้ Na+ และ glucose เข้ามาได้อีก"
          },
          {
            "callout": "เมื่อ Na+/glucose cotransporter บกพร่องแต่กำเนิด จะเกิด glucose/galactose malabsorption ทำให้ diarrhea รุนแรงและมักถึงแก่ชีวิตถ้าไม่รีบเอา glucose และ galactose ออกจากอาหาร ในทางกลับกัน glucose และ polymers ของมันใช้ retain Na+ ในโรคท้องร่วงได้",
            "kind": "warn"
          },
          {
            "bullets": [
              "SGLT-1 ขนส่ง galactose ด้วย แต่ **fructose ใช้กลไกต่างออกไป ไม่ขึ้นกับ Na+ และไม่ขึ้นกับการขนส่ง glucose/galactose**",
              "fructose เข้าจาก intestinal lumen สู่ enterocytes โดย facilitated diffusion ผ่าน **GLUT5** และออกจาก enterocytes สู่ interstitium ผ่าน **GLUT2**",
              "fructose บางส่วนถูกเปลี่ยนเป็น glucose ใน mucosal cells"
            ]
          },
          {
            "text": "**insulin มีผลน้อยมากต่อการขนส่งน้ำตาลในลำไส้** ในแง่นี้การดูดซึมในลำไส้คล้ายกับการดูดกลับ glucose ที่ proximal convoluted tubules ของไต คือทั้งสองกระบวนการไม่ต้องการ phosphorylation ยังปกติในผู้ป่วย diabetes แต่ถูกกดโดยยา phlorizin อัตราการดูดซึม glucose สูงสุดจากลำไส้ประมาณ **120 g/h**"
          }
        ]
      },
      {
        "heading": "Protein digestion เริ่มที่กระเพาะ: pepsin",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.7",
        "body": [
          {
            "text": "การย่อย protein เริ่มในกระเพาะที่ pepsin ตัด peptide linkages บางส่วน เช่นเดียวกับเอนไซม์ย่อยโปรตีนอื่น ๆ **pepsin ถูกหลั่งในรูป inactive precursor (proenzyme) คือ pepsinogen แล้วจึงถูก activate ด้วย gastric acid ในทางเดินอาหาร**"
          },
          {
            "bullets": [
              "pepsin hydrolyze พันธะระหว่าง aromatic amino acids เช่น phenylalanine หรือ tyrosine กับกรดอะมิโนตัวที่สอง ผลิตภัณฑ์จึงเป็น polypeptides ขนาดหลากหลายมาก",
              "**pepsin มี pH optimum 1.6-3.2** การทำงานจึงยุติเมื่อ gastric contents ผสมกับ alkaline pancreatic juice ใน duodenum และ jejunum",
              "pH ของ intestinal contents ใน duodenal bulb คือ 3.0-4.0 แต่สูงขึ้นอย่างรวดเร็ว ส่วนที่เหลือของ duodenum มี pH ประมาณ 6.5"
            ]
          }
        ]
      },
      {
        "heading": "Pancreatic proteases และกลไกความปลอดภัยด้วย enterokinase",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.7",
        "body": [
          {
            "text": "ใน small intestine polypeptides ที่ได้จากกระเพาะถูกย่อยต่อโดย proteolytic enzymes ที่ทรงพลังของ pancreas และ intestinal mucosa **trypsin, chymotrypsin และ elastase ออกฤทธิ์ที่พันธะ peptide ภายในโมเลกุล จึงเรียกว่า endopeptidases**"
          },
          {
            "sub": "ทำไมตับอ่อนถึงไม่ย่อยตัวเอง",
            "body": [
              {
                "bullets": [
                  "เอนไซม์เหล่านี้ถูกหลั่งเป็น inactive proenzymes และ **การกลายเป็น endopeptidase ที่ active เกิดขึ้นก็ต่อเมื่อไปถึงตำแหน่งออกฤทธิ์แล้ว โดยอาศัย brush border hydrolase ชื่อ enterokinase**",
                  "trypsinogen ถูกเปลี่ยนเป็น trypsin โดย enterokinase เมื่อ pancreatic juice เข้าสู่ duodenum",
                  "enterokinase มี polysaccharide 41% ซึ่งดูเหมือนจะป้องกันไม่ให้ตัวมันเองถูกย่อยก่อนออกฤทธิ์",
                  "trypsin เปลี่ยน chymotrypsinogen เป็น chymotrypsin และเปลี่ยน proenzyme อื่นให้ active ทั้งยัง activate trypsinogen ได้เอง จึงเกิด **auto-catalytic chain reaction** เมื่อมี trypsin เกิดขึ้นแล้วบางส่วน"
                ]
              },
              {
                "text": "**enterokinase deficiency เป็นความผิดปกติแต่กำเนิด และนำไปสู่ protein malnutrition**"
              }
            ]
          },
          {
            "text": "carboxypeptidases ของ pancreas เป็น **exopeptidases** ที่ hydrolyze กรดอะมิโนที่ปลาย carboxyl ของ polypeptides กรดอะมิโนอิสระบางส่วนถูกปลดปล่อยใน intestinal lumen ด้วยกลไกนี้ แต่บางส่วนถูกปลดปล่อยที่ผิวเซลล์โดย aminopeptidases, carboxypeptidases, endopeptidases และ dipeptidases ที่อยู่ใน brush border ของ mucosal cells"
          },
          {
            "callout": "จุดที่ต้องจำ: dipeptides และ tripeptides บางส่วนถูกขนส่งเข้าเซลล์ลำไส้แบบ active แล้วถูก hydrolyze โดย intracellular peptidases ดังนั้นการย่อยขั้นสุดท้ายจนเป็น amino acids เกิดขึ้นใน 3 ตำแหน่ง คือ intestinal lumen, brush border และ cytoplasm ของ mucosal cells",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การดูดซึม amino acids และ peptides (PepT1)",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.8",
        "body": [
          {
            "bullets": [
              "มี **transport systems อย่างน้อย 7 ระบบ** ที่ขนส่ง amino acids เข้า enterocytes",
              "5 ระบบต้องการ Na+ และ cotransport amino acids กับ Na+ ในลักษณะเดียวกับ cotransport ของ Na+ กับ glucose",
              "2 ใน 5 ระบบนี้ต้องการ Cl- ด้วย",
              "อีก 2 ระบบ ขนส่งได้โดยไม่ขึ้นกับ Na+"
            ]
          },
          {
            "text": "**dipeptides และ tripeptides ถูกขนส่งเข้า enterocytes โดยระบบ PepT1 (peptide transporter 1) ซึ่งต้องการ H+ แทน Na+** โดย proton มาจาก apical sodium/hydrogen exchanger (NHE) ส่วน peptide ที่ใหญ่กว่านั้นซึ่งมาจากอาหาร ถูกดูดซึมน้อยมากหลังพ้นช่วง neonatal"
          },
          {
            "text": "ใน enterocytes กรดอะมิโนที่ได้จากการ hydrolysis ภายในเซลล์ รวมกับกรดอะมิโนที่ดูดซึมจาก lumen และ brush border จะถูกขนส่งออกทาง basolateral border โดย **transport systems อย่างน้อย 5 ระบบ** จากนั้นเข้าสู่ hepatic portal blood"
          }
        ]
      },
      {
        "heading": "ตัวเลขและความผิดปกติทางพันธุกรรมของการดูดซึม protein",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.9",
        "body": [
          {
            "text": "การดูดซึม amino acids รวดเร็วที่ duodenum และ jejunum ในภาวะปกติมีการดูดซึมที่ ileum เพียงเล็กน้อย เพราะ free amino acids ส่วนใหญ่ถูกดูดซึมไปก่อนถึงจุดนั้นแล้ว"
          },
          {
            "bullets": [
              "protein ที่ถูกย่อยมาจาก ingested food ประมาณ **50%** จาก proteins ใน digestive juices **25%** และจาก desquamated mucosal cells อีก **25%**",
              "มีเพียง **2-5%** ของ protein ใน small intestine ที่หนีการย่อยและการดูดซึม บางส่วนถูกย่อยด้วย bacterial action ใน colon ในภายหลัง",
              "**protein ในอุจจาระเกือบทั้งหมดไม่ได้มาจากอาหาร แต่มาจาก bacteria และ cellular debris**"
            ]
          },
          {
            "text": "มีหลักฐานว่า peptidase activity ของ brush border และ cytoplasm ของ mucosal cell เพิ่มขึ้นเมื่อ resect ileum บางส่วน และเปลี่ยนแปลงอย่างเป็นอิสระในภาวะ starvation ดังนั้นเอนไซม์เหล่านี้ดูจะอยู่ภายใต้ homeostatic regulation"
          },
          {
            "sub": "ความผิดปกติแต่กำเนิดในมนุษย์",
            "body": [
              {
                "bullets": [
                  "**Hartnup disease** = ความบกพร่องแต่กำเนิดของกลไกที่ขนส่ง neutral amino acids ในลำไส้และ renal tubules",
                  "**cystinuria** = ความบกพร่องแต่กำเนิดของการขนส่ง basic amino acids"
                ]
              },
              {
                "text": "อย่างไรก็ตามผู้ป่วยส่วนใหญ่ไม่เกิดภาวะขาดสารอาหารจากกรดอะมิโนเหล่านี้ **เพราะ peptide transport ชดเชยให้**"
              }
            ]
          }
        ]
      },
      {
        "heading": "การดูดซึม protein ที่ยังไม่ถูกย่อยในทารก และ food allergy",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.9",
        "body": [
          {
            "text": "ในทารก มีการดูดซึม undigested proteins ในปริมาณปานกลาง **antibodies ใน maternal colostrum ส่วนใหญ่เป็น secretory immunoglobulins (IgAs)** ซึ่งการผลิตเพิ่มขึ้นในเต้านมช่วงท้ายของการตั้งครรภ์"
          },
          {
            "bullets": [
              "IgA ข้าม mammary epithelium โดย **transcytosis** และเข้าสู่ circulation ของทารกจากลำไส้ ให้ passive immunity ต่อการติดเชื้อ",
              "การดูดซึมเกิดโดย **endocytosis แล้วตามด้วย exocytosis**",
              "การดูดซึม intact proteins ลดลงอย่างชัดเจนหลัง weaning แต่ผู้ใหญ่ยังดูดซึมได้ปริมาณเล็กน้อย"
            ]
          },
          {
            "text": "foreign proteins ที่เข้าสู่ circulation กระตุ้นการสร้าง antibodies และปฏิกิริยา antigen-antibody เมื่อได้รับ protein เดิมซ้ำ อาจทำให้เกิดอาการภูมิแพ้ **การดูดซึม protein จากลำไส้จึงอาจอธิบายอาการแพ้หลังกินอาหารบางชนิด** อุบัติการณ์ food allergy ในเด็กมีการกล่าวว่าสูงถึง 8% แต่ในคนส่วนใหญ่ไม่เกิด และมีหลักฐานว่ามี genetic component ในความไวต่อภาวะนี้"
          }
        ]
      },
      {
        "heading": "Nucleic acids",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.9",
        "body": [
          {
            "bullets": [
              "nucleic acids ถูกแยกเป็น nucleotides ในลำไส้โดย **pancreatic nucleases**",
              "nucleotides ถูกแยกเป็น nucleosides และ phosphoric acid โดยเอนไซม์ที่ดูเหมือนจะอยู่ที่ luminal surfaces ของ mucosal cells",
              "nucleosides ถูกแยกต่อเป็นน้ำตาลที่เป็นองค์ประกอบ กับ purine และ pyrimidine bases",
              "**bases ถูกดูดซึมโดย active transport**",
              "มีการค้นพบ nucleoside transporters ทั้งกลุ่ม equilibrative (passive) และ concentrative (secondary active) ซึ่งแสดงออกบน apical membrane ของ enterocytes"
            ]
          }
        ]
      },
      {
        "heading": "Fat digestion: lingual/gastric lipase, pancreatic lipase และ colipase",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.10",
        "body": [
          {
            "text": "**lingual lipase หลั่งจาก Ebner glands บนผิวด้านหลังของลิ้นในสัตว์บางชนิด (in some species) และกระเพาะก็หลั่ง lipase ด้วย** ทั้งสองมีความสำคัญเชิงปริมาณน้อยต่อการย่อย lipid ยกเว้นในภาวะ pancreatic insufficiency แต่อาจสร้าง free fatty acids (FFA) ที่ส่งสัญญาณไปยังทางเดินอาหารส่วนปลาย เช่น ทำให้หลั่ง CCK"
          },
          {
            "text": "**การย่อยไขมันส่วนใหญ่จึงเริ่มที่ duodenum โดยมี pancreatic lipase เป็นเอนไซม์ที่สำคัญที่สุดตัวหนึ่ง**"
          },
          {
            "bullets": [
              "pancreatic lipase hydrolyze พันธะที่ตำแหน่ง **1 และ 3** ของ triglycerides (triacylglycerols) ได้ง่าย แต่ออกฤทธิ์ที่พันธะตำแหน่ง 2 ในอัตราที่ต่ำมาก",
              "ผลิตภัณฑ์หลักจึงเป็น **FFA และ 2-monoglycerides (2-monoacylglycerols)**",
              "เอนไซม์นี้ออกฤทธิ์ต่อไขมันที่ถูก emulsified แล้วเท่านั้น"
            ]
          },
          {
            "sub": "colipase",
            "body": [
              {
                "text": "colipase เป็น accessory factor ที่หลั่งใน pancreatic juice ในรูป inactive proform และถูก **activate โดย trypsin ใน intestinal lumen** ช่วย stabilize pancreatic lipase ให้อยู่ใน active conformation และสำคัญมากเพราะ **ทำให้ lipase ยังเกาะกับหยดไขมันในอาหารได้แม้จะมี bile acids อยู่**"
              }
            ]
          },
          {
            "sub": "cholesterol esterase",
            "body": [
              {
                "text": "เป็น pancreatic lipase อีกตัวที่ถูก activate โดย bile acids คิดเป็นราว **4% ของ total protein ใน pancreatic juice** ในผู้ใหญ่ pancreatic lipase active กว่า 10-60 เท่า แต่ต่างกันตรงที่ cholesterol esterase เร่งการ hydrolysis ของ cholesterol esters, esters ของ fat-soluble vitamins และ phospholipids ได้ด้วย นอกเหนือจาก triglycerides และพบเอนไซม์คล้ายกันมากใน human milk"
              }
            ]
          }
        ]
      },
      {
        "heading": "Micelle formation และการข้าม unstirred layer",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.10",
        "body": [
          {
            "text": "ไขมันละลายน้ำได้ไม่ดี ซึ่งจำกัดความสามารถในการข้าม unstirred layer ไปถึงผิวของ mucosal cells แต่ไขมันถูก **emulsify อย่างละเอียดใน small intestine โดย detergent action ของ bile acids, phosphatidylcholine และ monoglycerides**"
          },
          {
            "text": "เมื่อความเข้มข้นของ bile acids ในลำไส้สูงหลังกินอาหารและ gallbladder หดตัว lipids และ bile acids จะรวมตัวกันเองเป็น **micelles** ซึ่งเป็น cylindrical aggregates ที่รับ lipids เข้าไป โดยทั่วไปมี FA, monoglycerides และ cholesterol อยู่ในแกน hydrophobic"
          },
          {
            "text": "การเกิด micelle ทำให้ lipids ละลายได้มากขึ้นและเป็นกลไกขนส่งไปยัง enterocytes **micelles เคลื่อนตาม concentration gradient ผ่าน unstirred layer ไปถึง brush border แล้ว lipids จึง diffuse ออกจาก micelle** ทำให้มีสารละลายอิ่มตัวของ lipids สัมผัสกับ brush border ตลอดเวลา"
          }
        ]
      },
      {
        "heading": "Steatorrhea และ anatomic reserve",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.11",
        "body": [
          {
            "text": "สัตว์ที่ถูก pancreatectomize และผู้ป่วยที่มีโรคทำลาย exocrine portion ของตับอ่อน จะมีอุจจาระ **fatty, bulky, clay-colored (steatorrhea)** เพราะการย่อยและดูดซึมไขมันบกพร่อง steatorrhea แบบนี้ **ส่วนใหญ่เกิดจาก lipase deficiency**"
          },
          {
            "bullets": [
              "กรดยับยั้ง lipase และการขาด alkaline secretion จากตับอ่อนยังซ้ำเติมโดยทำให้ pH ของ intestinal contents ต่ำลง",
              "บางกรณี **hypersecretion of gastric acid** ทำให้เกิด steatorrhea ได้",
              "อีกสาเหตุคือ **การดูดกลับ bile acids ที่ distal ileum บกพร่อง**"
            ]
          },
          {
            "text": "เมื่อ bile ถูกกันออกจากลำไส้อย่างสมบูรณ์ ไขมันที่กินเข้าไปอาจปรากฏในอุจจาระได้ถึง **50%** และเกิด malabsorption ของ fat-soluble vitamins อย่างรุนแรงด้วย เมื่อการดูดกลับ bile acid ถูกขัดขวางจากการ resect terminal ileum หรือมีโรคที่ส่วนนี้ ปริมาณไขมันในอุจจาระอาจเพิ่มขึ้น เพราะเมื่อ enterohepatic circulation ถูกตัด ตับอาจเพิ่มอัตราการผลิต bile acid ได้ไม่มากพอจะชดเชย"
          },
          {
            "callout": "anatomic reserve: บางคนอาจไม่เกิด steatorrhea แม้ไม่มี micelles เพราะลำไส้มี absorptive surface area สำรองมาก ซึ่งดูดซึม lipid ในรูป molecular form ได้ เพียงแต่ช้ากว่าแบบ micellar หลักการสำรองนี้ใช้กับผลิตภัณฑ์การย่อยของ protein และ carbohydrate ด้วย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Clinical Box 26-2: Malabsorption syndrome และ celiac disease",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.11",
        "body": [
          {
            "text": "หน้าที่ย่อยและดูดซึมของ small intestine จำเป็นต่อชีวิต แต่ **ความสามารถนี้มีมากกว่าที่ต้องใช้ในภาวะปกติ (anatomic reserve)** การตัด jejunum หรือ ileum เป็นช่วงสั้น ๆ มักไม่ทำให้เกิดอาการรุนแรง และเกิด compensatory hypertrophy กับ hyperplasia ของ mucosa ที่เหลือ"
          },
          {
            "bullets": [
              "แต่เมื่อ **small intestine ถูก resect หรือ bypass มากกว่า 50% (short gut syndrome)** การดูดซึมสารอาหารและ vitamins จะเสียหายจนป้องกัน malnutrition และ wasting ได้ยากมาก",
              "การ resect terminal ileum ยังขัดขวางการดูดซึม bile acids ซึ่งทำให้การดูดซึมไขมันบกพร่องตามมา และ **ทำให้ท้องเสียเพราะ bile acids ที่ไม่ถูกดูดซึมเข้าสู่ colon แล้วกระตุ้น chloride secretion**",
              "ภาวะแทรกซ้อนอื่นของการ resect หรือ bypass ลำไส้ ได้แก่ hypocalcemia, arthritis และอาจมี fatty infiltration ของตับตามด้วย cirrhosis"
            ]
          },
          {
            "sub": "รูปแบบของ malabsorption syndrome",
            "body": [
              {
                "text": "โรคหลายอย่างทำให้การดูดซึมเสียได้โดยไม่ต้องสูญเสียความยาวลำไส้ รูปแบบการขาดสารอาหารต่างกันไปตามสาเหตุ แต่อาจรวมถึงการดูดซึม amino acids บกพร่องจน body wasting ชัดเจน และในที่สุดเกิด hypoproteinemia และ edema การดูดซึม carbohydrate และ fat ก็ลดลง และเพราะการดูดซึมไขมันบกพร่อง **fat-soluble vitamins (A, D, E, K) จึงถูกดูดซึมไม่เพียงพอ**"
              }
            ]
          },
          {
            "sub": "celiac disease",
            "body": [
              {
                "text": "เป็น autoimmune disease ที่เกิดในผู้ที่มี genetic predisposition ซึ่ง **gluten และ proteins ที่เกี่ยวข้องใกล้ชิดทำให้ intestinal T cells สร้าง immune response ที่ไม่เหมาะสม ทำลาย intestinal epithelial cells จนสูญเสีย villi และ mucosa แบนราบ** โปรตีนกลุ่มนี้พบใน wheat, rye, barley และพบน้อยกว่าใน oats แต่ไม่พบใน rice หรือ corn เมื่องดธัญพืชที่มี gluten การทำงานของลำไส้มักกลับคืนสู่ปกติ"
              }
            ]
          },
          {
            "sub": "Therapeutic highlights",
            "body": [
              {
                "bullets": [
                  "การรักษา malabsorption ขึ้นกับสาเหตุพื้นฐาน",
                  "celiac disease: mucosa กลับเป็นปกติถ้างดอาหารที่มี gluten อย่างเคร่งครัด แม้จะทำได้ยาก",
                  "diarrhea ที่มากับ bile acid malabsorption รักษาด้วย resin (**cholestyramine**) ที่จับ bile acids ใน lumen และป้องกันฤทธิ์ secretory ต่อ colonocytes",
                  "ผู้ที่ขาด fat-soluble vitamins อาจให้ในรูป water-soluble derivatives",
                  "short bowel syndrome ที่รุนแรงอาจต้องให้สารอาหารทาง parenteral และมีความหวังว่า small bowel transplantation จะกลายเป็นเรื่องปกติ แต่ก็มีข้อเสียระยะยาวของตัวเองและต้องมีแหล่ง donor tissue ที่เชื่อถือได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Fat absorption: ความยาวสาย FA เป็นตัวตัดสินเส้นทาง",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.12",
        "body": [
          {
            "text": "เดิมเชื่อว่า lipids เข้า enterocytes โดย passive diffusion แต่ปัจจุบันมีหลักฐานบ่งชี้ว่ามี carriers เกี่ยวข้อง เมื่อเข้าไปในเซลล์ **lipids ถูก esterified อย่างรวดเร็ว จึงคง concentration gradient ที่เอื้อให้ไหลจาก lumen เข้าเซลล์ต่อไป** และยังมี carriers ที่ export lipid บางชนิดกลับเข้า lumen ซึ่งจำกัด oral availability ของมัน กรณีนี้ใช้กับทั้ง plant sterols และ cholesterol"
          },
          {
            "sub": "ชะตากรรมของ FA ใน enterocytes ขึ้นกับขนาด",
            "body": [
              {
                "bullets": [
                  "**FA ที่มี carbon น้อยกว่า 10-12 อะตอม** ละลายน้ำได้พอที่จะผ่าน enterocyte ไปโดยไม่ถูกดัดแปลง และถูก actively transported เข้า portal blood แล้วหมุนเวียนในรูป free (unesterified) FA",
                  "**FA ที่มี carbon มากกว่า 10-12 อะตอม** ไม่ละลายพอ จึงถูก reesterified เป็น triglycerides ใน enterocytes และ cholesterol ที่ดูดซึมบางส่วนก็ถูก esterified",
                  "triglycerides และ cholesterol esters ถูกเคลือบด้วยชั้นของ protein, cholesterol และ phospholipid กลายเป็น **chylomicrons** ซึ่งออกจากเซลล์โดย exocytosis และ **เข้าสู่ lymphatics เพราะใหญ่เกินกว่าจะผ่าน junctions ระหว่าง capillary endothelial cells**"
                ]
              }
            ]
          },
          {
            "bullets": [
              "การดูดซึม long-chain FA มากที่สุดที่ส่วนต้นของ small intestine แต่ ileum ก็ดูดซึมได้ในปริมาณที่สังเกตได้",
              "เมื่อกินไขมันปริมาณปานกลาง **ไขมันที่กินเข้าไปถูกดูดซึม 95% หรือมากกว่า**",
              "กระบวนการดูดซึมไขมันยังไม่สมบูรณ์เต็มที่ตอนแรกเกิด **ทารกดูดซึมไขมันไม่ได้ 10-15% ของที่กิน** จึงไวต่อผลเสียจากโรคที่ลดการดูดซึมไขมันมากกว่า"
            ]
          }
        ]
      },
      {
        "heading": "Short-chain fatty acids (SCFAs) ใน colon",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.12",
        "body": [
          {
            "text": "**SCFAs ถูกผลิตใน colon และดูดซึมจาก colon** เป็น weak acids ที่มี carbon 2-5 อะตอม มีความเข้มข้นปกติเฉลี่ยประมาณ **80 mmol/L** ใน lumen"
          },
          {
            "bullets": [
              "ประมาณ **60% เป็น acetate, 25% propionate และ 15% butyrate**",
              "เกิดจากการทำงานของ colonic bacteria (fermentation) ต่อ complex carbohydrates, resistant starches และองค์ประกอบอื่นของ dietary fiber คือวัสดุที่หนีการย่อยในทางเดินอาหารส่วนบนแล้วเข้าสู่ colon"
            ]
          },
          {
            "sub": "หน้าที่ของ SCFAs ตามบทนี้",
            "body": [
              {
                "bullets": [
                  "ถูก metabolize และมีส่วนสำคัญต่อ total caloric intake",
                  "มี **trophic effect** ต่อ colonic epithelial cells",
                  "combat inflammation",
                  "ถูกดูดซึมบางส่วนโดยแลกเปลี่ยนกับ H+ ช่วยรักษา acid-base equilibrium",
                  "ดูดซึมผ่าน specific transporters ที่มีใน colonic epithelial cells และ **ส่งเสริมการดูดซึม Na+**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Minerals และ trace elements",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.13",
        "body": [
          {
            "text": "ต้องได้รับ minerals จำนวนหนึ่งทุกวันเพื่อรักษาสุขภาพ นอกจากตัวที่มี recommended daily dietary allowance แล้วยังต้องมี trace elements หลายชนิด **trace elements นิยามว่าเป็นธาตุที่พบในเนื้อเยื่อในปริมาณน้อยมาก และในหลายกรณีกลไกการนำเข้าจากอาหารยังเข้าใจได้ไม่ดี**"
          },
          {
            "sub": "Table 26-3 trace elements ที่เชื่อว่าจำเป็นต่อชีวิต",
            "body": [
              {
                "bullets": [
                  "arsenic, chromium, cobalt, copper, fluorine, iodine, iron",
                  "manganese, molybdenum, nickel, selenium, silicon, vanadium, zinc"
                ]
              }
            ]
          },
          {
            "sub": "ผลของการขาดในมนุษย์ตามที่บทนี้ระบุ",
            "body": [
              {
                "bullets": [
                  "iron deficiency: anemia",
                  "cobalt เป็นส่วนหนึ่งของโมเลกุล vitamin B12 และการขาด B12 นำไปสู่ megaloblastic anemia",
                  "iodine deficiency: thyroid disorders",
                  "zinc deficiency: skin ulcers, depressed immune responses, hypogonadal dwarfism",
                  "copper deficiency: anemia และการเปลี่ยนแปลงของ ossification",
                  "chromium deficiency: insulin resistance",
                  "fluorine deficiency: เพิ่มอุบัติการณ์ของ dental caries"
                ]
              },
              {
                "text": "sodium และ potassium ก็เป็น essential minerals แต่การระบุไว้เป็นเพียงเชิงวิชาการ เพราะเตรียมอาหารที่ปราศจาก sodium หรือ potassium ได้ยากมาก อย่างไรก็ตาม low-salt diet ทนได้เป็นเวลานานเพราะมีกลไกชดเชยที่สงวน Na+"
              }
            ]
          },
          {
            "callout": "แร่ธาตุบางชนิดเป็นพิษเมื่อมีมากเกิน เช่น iron overload รุนแรงเห็นได้ใน hemochromatosis และ copper ที่มากเกินทำให้เกิด brain damage (Wilson disease)",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การดูดซึม calcium",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.13",
        "body": [
          {
            "bullets": [
              "**calcium ที่กินเข้าไปถูกดูดซึม 30-80%**",
              "ผ่านอนุพันธ์ของ vitamin D คือ **1,25-dihydroxycholecalciferol** การดูดซึม Ca2+ ถูกปรับตามความต้องการของร่างกาย คือ **เพิ่มขึ้นเมื่อขาด Ca2+ และลดลงเมื่อมี Ca2+ เกิน**",
              "การดูดซึม Ca2+ ถูก **ส่งเสริมโดย protein**",
              "และถูก **ยับยั้งโดย phosphates และ oxalates** เพราะ anion เหล่านี้สร้างเกลือที่ไม่ละลายกับ Ca2+ ในลำไส้"
            ]
          }
        ]
      },
      {
        "heading": "สมดุลของ iron และเคมีของการดูดซึม",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.13",
        "body": [
          {
            "text": "ในผู้ใหญ่ ปริมาณ iron ที่สูญเสียจากร่างกายค่อนข้างน้อย และการสูญเสียโดยทั่วไปไม่ถูกควบคุม **ปริมาณ iron สะสมทั้งร่างกายจึงถูกควบคุมด้วยการเปลี่ยนอัตราการดูดซึมจากลำไส้**"
          },
          {
            "bullets": [
              "ผู้ชายเสีย iron ประมาณ **0.6 mg/d** ส่วนใหญ่ทางอุจจาระ",
              "ผู้หญิงวัยก่อนหมดประจำเดือนเสียมากกว่าและแปรผัน เฉลี่ยประมาณ **2 เท่า** ของค่านี้ เพราะเสีย iron เพิ่มระหว่างมีประจำเดือน",
              "iron intake เฉลี่ยใน United States และ Europe ประมาณ **20 mg/d** แต่ปริมาณที่ดูดซึมเท่ากับที่เสียไปเท่านั้น จึงเท่ากับราว **3-6% ของที่กินเข้าไป**",
              "ปัจจัยในอาหารมีผลต่อ availability เช่น **phytic acid ในธัญพืช** ทำปฏิกิริยากับ iron เกิดสารประกอบที่ไม่ละลาย เช่นเดียวกับ phosphates และ oxalates"
            ]
          },
          {
            "text": "**iron ในอาหารส่วนใหญ่อยู่ในรูป ferric (Fe3+) แต่รูปที่ถูกดูดซึมคือ ferrous (Fe2+)** โดยมี Fe3+ reductase activity อยู่คู่กับ iron transporter ที่ brush borders ของ enterocytes"
          },
          {
            "callout": "gastric secretions ละลาย iron และทำให้มันสร้าง soluble complexes กับ ascorbic acid และสารอื่นที่ช่วย reduction เป็น Fe2+ ความสำคัญของหน้าที่นี้เห็นได้จากข้อเท็จจริงที่ว่า iron deficiency anemia เป็นภาวะแทรกซ้อนที่กวนใจและพบได้ค่อนข้างบ่อยหลัง partial gastrectomy",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Transporters และการเก็บสะสม iron",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.14",
        "body": [
          {
            "text": "**การดูดซึม iron เกือบทั้งหมดเกิดที่ duodenum**"
          },
          {
            "sub": "โมเลกุลที่ Figure 26-8 ระบุตามลำดับเส้นทาง",
            "body": [
              {
                "bullets": [
                  "**DCYTB** = ferric reductase ที่เปลี่ยน Fe3+ เป็น Fe2+",
                  "**DMT1 (divalent metal transporter 1)** = ตัวขนส่ง Fe2+ เข้า enterocyte ทาง apical membrane",
                  "heme เข้า enterocyte ทาง heme transporter แยกต่างหาก (น่าจะเป็น **heme carrier protein 1, HCP1**) แล้ว **heme oxygenase-2 (HO2)** ปลดปล่อย Fe2+ ออกจาก heme เข้าสู่ intracellular Fe2+ pool",
                  "Fe2+ ในเซลล์บางส่วนถูกเปลี่ยนเป็น Fe3+ และจับกับ **ferritin**",
                  "ส่วนที่เหลือจับกับตัวขนส่ง basolateral คือ **ferroportin-1 (FPN1)** ออกสู่ interstitial fluid โดยมี **hephaestin (Hp)** ช่วย ซึ่งไม่ใช่ transporter เองแต่เอื้อการขนส่งและเปลี่ยน Fe2+ เป็น Fe3+",
                  "ใน plasma Fe3+ ถูกขนส่งโดยจับกับ **transferrin (TF)**"
                ]
              }
            ]
          },
          {
            "bullets": [
              "transferrin มี **2 iron-binding sites** ปกติอิ่มตัวด้วย iron ประมาณ **35%**",
              "ระดับ plasma iron ปกติประมาณ **130 µg/dL (23 µmol/L) ในผู้ชาย และ 110 µg/dL (19 µmol/L) ในผู้หญิง**",
              "**70% ของ iron ในร่างกายอยู่ใน hemoglobin, 3% ใน myoglobin** ที่เหลืออยู่ใน ferritin ซึ่งพบทั้งใน enterocytes และเซลล์อื่นอีกมาก",
              "apoferritin เป็น globular protein ที่ประกอบด้วย **24 subunits** และโมเลกุล ferritin ใน lysosomal membranes อาจรวมกลุ่มเป็น deposits ที่มี iron ได้ถึง 50% เรียกว่า **hemosiderin**"
            ]
          },
          {
            "callout": "การดูดซึม iron ในลำไส้ถูกควบคุมด้วย 3 ปัจจัย คือ ปริมาณ iron ที่กินเข้าไปเมื่อไม่นานมานี้ สภาวะของ iron stores ในร่างกาย และสภาวะของ erythropoiesis ใน bone marrow",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Clinical Box 26-3: Disorders of iron uptake",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.15",
        "body": [
          {
            "text": "iron deficiency ทำให้เกิด anemia ในทางกลับกัน **iron overload ทำให้ hemosiderin สะสมในเนื้อเยื่อ เกิดเป็น hemosiderosis** และ hemosiderin ปริมาณมากทำลายเนื้อเยื่อได้ ดังที่เห็นในโรคทางพันธุกรรมที่พบบ่อยคือ hemochromatosis"
          },
          {
            "sub": "ลักษณะของ hemochromatosis ตามที่บทนี้ระบุ",
            "body": [
              {
                "bullets": [
                  "pigmentation ของผิวหนัง",
                  "pancreatic damage พร้อม diabetes (เรียกว่า bronze diabetes)",
                  "cirrhosis of the liver",
                  "อุบัติการณ์สูงของ hepatic carcinoma",
                  "gonadal atrophy"
                ]
              }
            ]
          },
          {
            "text": "hemochromatosis เป็นได้ทั้ง hereditary และ acquired สาเหตุที่พบบ่อยที่สุดของแบบ hereditary คือ **mutated HFE gene** ซึ่งพบบ่อยในประชากรผิวขาว อยู่บน short arm ของ chromosome 6 และเชื่อมโยงใกล้ชิดกับ HLA-A locus"
          },
          {
            "callout": "บทนี้บอกตรงว่า ยังไม่ทราบแน่ชัดว่า mutations ใน HFE ทำให้เกิด hemochromatosis ได้อย่างไร ทราบเพียงว่าผู้ที่ homogenous สำหรับ HFE mutations ดูดซึม iron มากเกินไป เพราะปกติ HFE ยับยั้งการแสดงออกของ duodenal transporters ที่ร่วมในการนำ iron เข้า",
            "kind": "flag"
          },
          {
            "text": "แบบ acquired เกิดเมื่อระบบควบคุม iron ถูก overwhelm ด้วย iron load ที่มากเกิน จาก chronic destruction ของ red blood cells, liver disease หรือการให้เลือดซ้ำ ๆ ในโรคเช่น intractable anemia"
          },
          {
            "sub": "Therapeutic highlights",
            "body": [
              {
                "text": "ถ้าวินิจฉัย hereditary hemochromatosis ได้ก่อนที่ iron จะสะสมในเนื้อเยื่อมากเกินไป จะยืดอายุขัยได้อย่างมากด้วยการ **withdrawal of blood ซ้ำ ๆ**"
              }
            ]
          }
        ]
      },
      {
        "heading": "การดูดซึม vitamins",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.15",
        "body": [
          {
            "text": "คำว่า vitamin ปัจจุบันหมายถึง **องค์ประกอบอินทรีย์ในอาหารที่จำเป็นต่อชีวิต สุขภาพ และการเจริญเติบโต ซึ่งไม่ได้ทำหน้าที่โดยการให้พลังงาน และร่างกายสังเคราะห์เองไม่ได้ (อย่างน้อยในปริมาณที่เพียงพอ)** vitamins ถูกค้นพบเมื่อสังเกตว่าอาหารบางแบบซึ่งมี calories กรดอะมิโนจำเป็น ไขมัน และแร่ธาตุเพียงพอ กลับไม่สามารถรักษาสุขภาพไว้ได้"
          },
          {
            "bullets": [
              "vitamins ส่วนใหญ่ถูกดูดซึมที่ **upper small intestine** แต่ **vitamin B12 ถูกดูดซึมที่ ileum** โดยจับกับ **intrinsic factor** ซึ่งเป็นโปรตีนที่หลั่งจาก parietal cells ของกระเพาะ และ complex นี้คือรูปที่ถูกดูดซึมข้าม ileal mucosa",
              "การดูดซึม **vitamin B12 และ folate ไม่ขึ้นกับ Na+**",
              "แต่ water-soluble vitamins ที่เหลืออีก 7 ตัว คือ **thiamin, riboflavin, niacin, pyridoxine, pantothenate, biotin และ ascorbic acid ถูกดูดซึมผ่าน carriers ที่เป็น Na+ cotransporters**"
            ]
          },
          {
            "sub": "fat-soluble vitamins",
            "body": [
              {
                "text": "water-soluble vitamins ดูดซึมได้ง่าย แต่ **fat-soluble vitamins (A, D, E, K) ดูดซึมได้ไม่ดีเมื่อไม่มี bile และ/หรือ pancreatic juice เพราะการดูดซึมของมันขึ้นกับ micellar solubilization แทบทั้งหมด** และยังต้องมีไขมันในอาหารบ้าง ดังนั้นใน obstructive jaundice หรือโรคของ exocrine pancreas จึงเกิดภาวะขาด fat-soluble vitamins ได้แม้กินเข้าไปเพียงพอ"
              },
              {
                "bullets": [
                  "vitamin A และ vitamin D จับกับ transfer proteins ใน circulation",
                  "รูป alpha-tocopherol ของ vitamin E ปกติจับกับ chylomicrons ในตับถูกส่งต่อไปยัง VLDL และกระจายสู่เนื้อเยื่อโดย alpha-tocopherol transfer protein",
                  "เมื่อโปรตีนตัวนี้ผิดปกติจาก mutation ของยีนในมนุษย์ จะเกิด cellular deficiency ของ vitamin E และเกิดภาวะที่คล้าย Friedreich ataxia"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่สำคัญสำหรับสัตวแพทย์: เพราะ metabolism แตกต่างกันเล็กน้อยระหว่าง mammalian species สารบางอย่างจึงเป็น vitamin ในสัตว์ชนิดหนึ่งแต่ไม่เป็นในอีกชนิดหนึ่ง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Table 26-4 (ตอนที่ 1): vitamin A และ B complex",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.16",
        "body": [
          {
            "text": "ตารางนี้ระบุ action, deficiency symptoms และ sources ของ vitamins ที่จำเป็นหรือน่าจะจำเป็นต่อโภชนาการมนุษย์ ส่วนที่อ่านได้ชัดในหน้านี้มีดังนี้"
          },
          {
            "bullets": [
              "**A (A1, A2)**: เป็นองค์ประกอบของ visual pigments จำเป็นต่อ fetal development และ cell development ตลอดชีวิต ขาดแล้วเกิด night blindness และ dry skin แหล่ง yellow vegetables and fruit",
              "**Thiamin (vitamin B1)**: cofactor ใน decarboxylations ขาดแล้วเกิด beriberi และ neuritis แหล่ง liver, unrefined cereal grains",
              "**Riboflavin (vitamin B2)**: เป็นองค์ประกอบของ flavoproteins ขาดแล้วเกิด glossitis และ cheilosis แหล่ง liver, milk",
              "**Niacin**: เป็นองค์ประกอบของ NAD+ และ NADP+ ขาดแล้วเกิด pellagra แหล่ง yeast, lean meat, liver",
              "**Pyridoxine (vitamin B6)**: สร้าง prosthetic group ของ decarboxylases และ transaminases บางตัว ถูกเปลี่ยนในร่างกายเป็น pyridoxal phosphate และ pyridoxamine phosphate ขาดแล้วเกิด convulsions และ hyperirritability แหล่ง yeast, wheat, corn, liver",
              "**Pantothenic acid**: เป็นองค์ประกอบของ CoA ขาดแล้วเกิด dermatitis, enteritis, alopecia และ adrenal insufficiency แหล่ง eggs, liver, yeast",
              "**Biotin**: เร่งการ fixation ของ CO2 (เช่นใน fatty acid synthesis) ขาดแล้วเกิด dermatitis และ enteritis แหล่ง egg yolk, liver, tomatoes"
            ]
          }
        ]
      },
      {
        "heading": "Table 26-4 (ตอนที่ 2): folates, B12 และ vitamins C, D, E, K",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.17",
        "body": [
          {
            "bullets": [
              "**Folates (folic acid) และสารที่เกี่ยวข้อง**: coenzymes สำหรับการถ่ายทอด 1-carbon และเกี่ยวข้องกับ methylating reactions ขาดแล้วเกิด sprue และ anemia รวมทั้ง neural tube defects ในเด็กที่เกิดจากมารดาที่ขาด folate แหล่ง leafy green vegetables",
              "**Cyanocobalamin (vitamin B12)**: coenzyme ใน amino acid metabolism และกระตุ้น erythropoiesis ขาดแล้วเกิด pernicious anemia แหล่ง liver, meat, eggs, milk โครงสร้างเป็น complex ของ substituted pyrrole ring 4 วงรอบอะตอม **cobalt**",
              "**C**: รักษา prosthetic metal ions ให้อยู่ในรูปรีดิวซ์ และ scavenge free radicals ขาดแล้วเกิด scurvy แหล่ง citrus fruits, leafy green vegetables",
              "**D group**: เพิ่มการดูดซึม calcium และ phosphate ในลำไส้ ขาดแล้วเกิด rickets แหล่ง fish liver เป็นกลุ่มของ sterols",
              "**E group**: antioxidants และเป็น cofactors ใน electron transport ของ cytochrome chain (ตารางใส่เครื่องหมายคำถามไว้) ขาดแล้วเกิด ataxia และอาการอื่นของ spinocerebellar dysfunction แหล่ง milk, eggs, meat, leafy vegetables",
              "**K group**: เร่ง gamma carboxylation ของ glutamic acid residues บนโปรตีนหลายชนิดที่เกี่ยวกับ blood clotting ขาดแล้วเกิด hemorrhagic phenomena แหล่ง leafy green vegetables"
            ]
          }
        ]
      },
      {
        "heading": "Choline และความเป็นพิษของ vitamins ขนาดสูง",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.18",
        "body": [
          {
            "text": "เชิงอรรถของตาราง 26-4 ระบุว่า **choline ถูกสังเคราะห์ในร่างกายได้ในปริมาณเล็กน้อย แต่เพิ่งถูกเพิ่มเข้าในรายการ essential nutrients**"
          },
          {
            "callout": "ควรจำไว้ว่า fat-soluble vitamins ในขนาดที่สูงมากเป็นพิษอย่างแน่นอน",
            "kind": "warn"
          },
          {
            "bullets": [
              "**Hypervitaminosis A**: anorexia, headache, hepatosplenomegaly, irritability, scaly dermatitis, ผมร่วงเป็นหย่อม, bone pain และ hyperostosis ภาวะ acute vitamin A intoxication ถูกบรรยายครั้งแรกในนักสำรวจแถบอาร์กติกที่มี headache, diarrhea และ dizziness หลังกินตับหมีขั้วโลก ซึ่งมี vitamin A สูงเป็นพิเศษ",
              "**Hypervitaminosis D**: weight loss, calcification ของ soft tissues หลายแห่ง และ acute kidney injury",
              "**Hypervitaminosis K**: gastrointestinal disturbances และ anemia",
              "water-soluble vitamins เคยถูกมองว่าเสี่ยงน้อยกว่าเพราะขับออกจากร่างกายได้เร็ว แต่มีการแสดงให้เห็นแล้วว่า **megadoses ของ pyridoxine (vitamin B6) ทำให้เกิด peripheral neuropathy ได้**"
            ]
          }
        ]
      },
      {
        "heading": "Control of food intake: สัญญาณจากรอบนอกและ CNS",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.18",
        "body": [
          {
            "text": "การกินสารอาหารอยู่ภายใต้การควบคุมที่ซับซ้อน โดยมีสัญญาณจากทั้งรอบนอกและ central nervous system ที่ทำให้ภาพซับซ้อนขึ้นคือ **higher functions ยังปรับการตอบสนองต่อสัญญาณทั้งจากส่วนกลางและรอบนอกที่กระตุ้นหรือยับยั้งการกิน** ดังนั้น food preferences, emotions, environment, lifestyle และ circadian rhythms จึงมีผลอย่างมากต่อการที่จะหาอาหารหรือไม่ และจะกินอาหารชนิดใด"
          },
          {
            "text": "hormones และปัจจัยหลายอย่างที่ถูกปล่อยพร้อมกับมื้ออาหาร และมีบทบาทสำคัญอื่นในการย่อยและดูดซึม ก็เกี่ยวข้องกับการควบคุม feeding behavior ด้วย ตัวอย่างเช่น **CCK ไม่ว่าจะสร้างจาก I cells ในลำไส้หรือปล่อยจาก nerve endings ในสมอง ยับยั้งการกินอาหารต่อ จึงนิยามว่าเป็น satiety factor หรือ anorexin**"
          },
          {
            "text": "CCK และปัจจัยคล้ายกันดึงดูดความสนใจอย่างมากจากอุตสาหกรรมยา ด้วยความหวังว่าอนุพันธ์อาจใช้ช่วยการลดน้ำหนักได้ ซึ่งเป็นเป้าหมายที่เร่งด่วนขึ้นเมื่อพิจารณาการระบาดของ obesity ในประเทศตะวันตก"
          },
          {
            "sub": "Figure 26-9 สรุปกลไก",
            "body": [
              {
                "text": "สิ่งกระตุ้นและตัวยับยั้งจากรอบนอกซึ่งถูกปล่อยเพื่อรอรับหรือเพื่อตอบสนองต่อการกินอาหาร ข้าม blood-brain barrier ไปกระตุ้นการปล่อยและ/หรือการสังเคราะห์ central factors ใน hypothalamus ที่เพิ่มหรือลดการกินอาหารในเวลาต่อมา และการกินยังถูกปรับได้ด้วยสัญญาณจาก higher centers ตัวย่อในภาพได้แก่ AA (amino acid), CART (cocaine- and amphetamine-regulated transcript), CCK (cholecystokinin), CRH (corticotropin-releasing hormone), FFA (free fatty acids), NE (norepinephrine), NPY (neuropeptide Y), POMC (pro-opiomelanocortin) และ PYY (Peptide YY)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Leptin และ ghrelin: คู่ตรงข้ามที่ควบคุมการกิน",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.19",
        "body": [
          {
            "text": "**leptin และ ghrelin เป็น peripheral factors ที่ออกฤทธิ์สวนทางกันต่อการกินอาหาร** ทั้งคู่ activate receptors ของตัวเองใน hypothalamus ซึ่งเริ่ม signaling cascades ที่นำไปสู่การเปลี่ยนแปลงการกิน"
          },
          {
            "sub": "leptin",
            "body": [
              {
                "bullets": [
                  "ผลิตโดย **adipose tissue** และส่งสัญญาณบอกสถานะของ fat stores",
                  "เมื่อ adipocytes ขยายขนาด จะปล่อย leptin มากขึ้น ซึ่งมีแนวโน้ม **ลดการกินอาหาร** ส่วนหนึ่งโดยเพิ่มการแสดงออกของ anorexigenic factors อื่นใน hypothalamus เช่น **POMC, CART, neurotensin และ CRH**",
                  "leptin ยัง **กระตุ้น metabolic rate** ด้วย",
                  "การศึกษาในสัตว์แสดงว่าเกิด **resistance ต่อ leptin** ได้ ในภาวะนั้นการกินยังคงดำเนินต่อไปแม้ adipose stores จะเพียงพอหรือกระทั่งกำลังเพิ่มขึ้น จึงเกิด obesity"
                ]
              }
            ]
          },
          {
            "sub": "ghrelin",
            "body": [
              {
                "bullets": [
                  "เป็น orexin ที่ออกฤทธิ์เร็วเป็นหลัก และ **กระตุ้นการกินอาหาร**",
                  "ผลิตหลักจาก **กระเพาะ** และจากเนื้อเยื่ออื่นเช่น pancreas และ adrenal glands ตามการเปลี่ยนแปลงของภาวะโภชนาการ",
                  "ระดับ ghrelin ในเลือด **เพิ่มขึ้นก่อนมื้ออาหาร (preprandially) แล้วลดลงหลังกิน** เชื่อว่าเกี่ยวข้องหลักกับ meal initiation ต่างจากผลระยะยาวกว่าของ leptin",
                  "ออกฤทธิ์ผ่าน hypothalamus เป็นส่วนใหญ่ โดยเพิ่มการสังเคราะห์และ/หรือปล่อย central orexins รวมทั้ง **neuropeptide Y และ cannabinoids** และกดความสามารถของ leptin ในการกระตุ้น anorexigenic factors",
                  "**การสูญเสียฤทธิ์ของ ghrelin อาจอธิบายประสิทธิผลของ gastric bypass procedures ในการรักษา obesity ได้ส่วนหนึ่ง**",
                  "การหลั่ง ghrelin อาจถูกยับยั้งโดย leptin ด้วย ซึ่งย้ำความสัมพันธ์แบบตอบกลับของสองฮอร์โมนนี้ แต่มีหลักฐานบางอย่างชี้ว่าความสามารถของ leptin ในการลดการหลั่ง ghrelin หายไปในภาวะ obesity"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical Box 26-4: Obesity",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.19",
        "body": [
          {
            "text": "obesity เป็นปัญหาโภชนาการที่พบบ่อยที่สุดและแพงที่สุดใน United States ตัวชี้วัดไขมันในร่างกายที่สะดวกและเชื่อถือได้คือ **body mass index (BMI) = น้ำหนักตัวเป็นกิโลกรัม หารด้วยส่วนสูงเป็นเมตรยกกำลังสอง**"
          },
          {
            "bullets": [
              "ค่ามากกว่า **25 ถือว่าผิดปกติ**",
              "**25-30 = overweight**",
              "**มากกว่า 30 = obese**",
              "ใน United States ประชากร **34% overweight และ 34% obese** และอุบัติการณ์ยังเพิ่มขึ้นในประเทศอื่นด้วย จนมีการประมาณว่าจำนวนคนน้ำหนักเกินในโลกตอนนี้มากพอ ๆ กับจำนวนคนที่ได้อาหารไม่พอ"
            ]
          },
          {
            "sub": "ทำไมถึงเป็นปัญหา",
            "body": [
              {
                "bullets": [
                  "สัมพันธ์กับ accelerated atherosclerosis และอุบัติการณ์ของโรค gallbladder และโรคอื่นที่เพิ่มขึ้น",
                  "ความสัมพันธ์กับ **type 2 diabetes เด่นชัดเป็นพิเศษ** เมื่อน้ำหนักเพิ่ม insulin resistance เพิ่มขึ้นและปรากฏเป็น frank diabetes อย่างน้อยในบางกรณี glucose tolerance กลับคืนมาเมื่อน้ำหนักลด",
                  "อัตราการเสียชีวิตจากมะเร็งหลายชนิดสูงขึ้นในผู้ที่อ้วน"
                ]
              }
            ]
          },
          {
            "sub": "สาเหตุ",
            "body": [
              {
                "text": "สาเหตุน่าจะมีหลายอย่าง การศึกษาในฝาแฝดที่ถูกเลี้ยงแยกกันแสดง genetic component ที่ชัดเจน มีการชี้ว่าตลอดวิวัฒนาการของมนุษย์ ทุพภิกขภัยเกิดบ่อย กลไกที่เพิ่มการเก็บพลังงานเป็นไขมันจึงมีคุณค่าต่อการอยู่รอด แต่ปัจจุบันอาหารมีอย่างเหลือเฟือ ความสามารถในการสะสมไขมันจึงกลายเป็นภาระ **สาเหตุพื้นฐานยังคงเป็นการที่พลังงานที่ได้รับจากอาหารเกินพลังงานที่ใช้ไป**"
              },
              {
                "text": "เมื่อให้อาสาสมัครกินอาหาร high-calorie แบบตายตัว บางคนน้ำหนักขึ้นเร็วกว่าคนอื่น แต่คนที่น้ำหนักขึ้นช้ากว่ามีการใช้พลังงานเพิ่มในรูปของการเคลื่อนไหวเล็ก ๆ ยุกยิก เรียกว่า **nonexercise activity thermogenesis (NEAT)** น้ำหนักตัวโดยทั่วไปเพิ่มขึ้นช้า ๆ แต่สม่ำเสมอตลอดวัยผู้ใหญ่ กิจกรรมทางกายที่ลดลงเป็นปัจจัยแน่นอน แต่ความไวต่อ leptin ที่ลดลงก็อาจมีส่วนด้วย"
              }
            ]
          },
          {
            "sub": "Therapeutic highlights",
            "body": [
              {
                "text": "obesity เป็นปัญหาที่แก้ยากเพราะการรักษาที่ได้ผลขึ้นกับการเปลี่ยน lifestyle อย่างมาก **การลดน้ำหนักระยะยาวทำได้ด้วยการลดการกิน เพิ่มการใช้พลังงาน หรือดีที่สุดคือทั้งสองอย่างรวมกัน** การออกกำลังกายอย่างเดียวมักไม่พอเพราะโดยทั่วไปทำให้ผู้ป่วยกินแคลอรีมากขึ้น สำหรับผู้ที่อ้วนมากและมีภาวะแทรกซ้อนรุนแรง มีการพัฒนาวิธีผ่าตัดหลายแบบที่ลดขนาด stomach reservoir และ/หรือ bypass ไปเลย ซึ่งตั้งใจให้ลดขนาดมื้ออาหารที่ทนได้ แต่ยังมีผลทาง metabolic อย่างชัดเจนตั้งแต่ก่อนน้ำหนักจะลดมาก อาจเป็นเพราะการผลิต peripheral orexins เช่น ghrelin จากลำไส้ลดลง"
              }
            ]
          }
        ]
      },
      {
        "heading": "Chapter summary ตามที่บทนี้สรุปเอง",
        "source": "Chapter 26 Digestion and Absorption of Nutrients p.20",
        "body": [
          {
            "bullets": [
              "อาหารที่สมดุลสำคัญต่อสุขภาพ และสารบางอย่างที่ได้จากอาหารจำเป็นต่อชีวิต ค่าพลังงานของอาหารต้องใกล้เคียงกับพลังงานที่ใช้เพื่อคง homeostasis",
              "มื้ออาหารผสมทั่วไปประกอบด้วย carbohydrates, proteins และ lipids (ส่วนหลังส่วนใหญ่อยู่ในรูป triglycerides) แต่ละอย่างต้องถูกย่อยก่อนจึงจะเข้าสู่ร่างกายได้ และมี transporters จำเพาะพาผลิตภัณฑ์ของการย่อยเข้าสู่ร่างกาย",
              "**ในการดูดซึม carbohydrate epithelium ขนส่งได้เฉพาะ monomers ขณะที่ protein ดูดซึมได้ทั้ง short peptides และ amino acids**",
              "กลไกการดูดซึม protein พึ่งพา proteases ใน pancreatic juice อย่างมาก และถูกจัดวางไม่ให้เอนไซม์เหล่านี้ถูก activate จนกว่าจะถึง substrate ใน small intestinal lumen ซึ่งทำได้ด้วย **การจำกัดตำแหน่งของเอนไซม์ที่ทำหน้าที่ activate คือ enterokinase**",
              "lipids เผชิญความท้าทายพิเศษเพราะความ hydrophobic ของมัน **bile acids ละลายผลิตภัณฑ์ของ lipolysis ใน micelles และเร่งการแพร่ไปยังผิว epithelium การดูดซึม triglycerides ถูกส่งเสริมด้วยกลไกนี้ ส่วน cholesterol และ fat-soluble vitamins จำเป็นต้องอาศัยกลไกนี้อย่างเด็ดขาด**",
              "การกินอาหารถูกควบคุมด้วยเครือข่ายสัญญาณที่ซับซ้อนทั้งจากรอบนอกและใน CNS **ghrelin ที่ปล่อยจากกระเพาะเป็น peripheral orexin สำคัญที่กระตุ้นศูนย์ใน hypothalamus ให้เริ่มกิน ส่วน leptin ปล่อยจาก adipocytes เพื่อบอกสถานะของ fat stores** และถ้ายังไม่เกิด leptin resistance มันจะกระตุ้นการปล่อย anorexins ใน hypothalamus เพื่อยุติพฤติกรรมการกิน",
              "เมื่อพลังงานที่ได้รับเกินพลังงานที่ใช้ ก็เกิดโรคยุคใหม่ที่พบมากขึ้นเรื่อย ๆ คือ obesity"
            ]
          }
        ]
      }
    ]
  },
  "physio-3--chapter-27-gastrointestinal-motility": {
    "topic": "physio-3--chapter-27-gastrointestinal-motility",
    "title": "Chapter 27 Gastrointestinal Motility",
    "icon": "📗",
    "summary": "เนื้อหาทั้งเล่มมาจาก Ganong's Review of Medical Physiology ฉบับที่ 26 บทที่ 27 เต็มบท (13 หน้า) ไม่ใช่สไลด์บรรยายย่อ จึงมีทั้งเนื้อความหลัก ตาราง 27-1 คำบรรยายรูป 27-1 ถึง 27-10 และ Clinical Box 5 กล่อง (Motor Disorders of the Esophagus, Gastric Bypass, Ileus, Hirschsprung Disease, Constipation) พร้อม THERAPEUTIC HIGHLIGHTS ของแต่ละกล่อง ครอบคลุมรูปแบบการเคลื่อนไหวของ GI tract ทั้งหมด ตั้งแต่ peristalsis กับ segmentation, BER, MMC, การกลืน, LES, gastric emptying, vomiting, small intestine, colon จนถึง defecation ตัวไฟล์เป็น text layer ที่ดึงจาก PDF จึงมีบรรทัด header/footer ลิขสิทธิ์และเลข IP ปนอยู่กลางย่อหน้าเป็นระยะ และหน้าถัด ๆ ไปมักซ้ำย่อหน้าท้ายของหน้าก่อนหน้า ตัวเลขทุกตัวในโน้ตนี้ยกมาจากตัวเล่มโดยตรง และหนังสือเล่มนี้อ้างอิงข้อมูลของมนุษย์ ไม่ใช่ค่าของสัตว์",
    "sections": [
      {
        "heading": "OBJECTIVES และภาพรวมของบท",
        "source": "Chapter 27 Gastrointestinal Motility p.1",
        "body": [
          {
            "text": "สไลด์เปิดบทวาง objectives ไว้ 6 ข้อ ใช้เป็นโครงอ่านทั้งบทได้เลย"
          },
          {
            "bullets": [
              "บอกรูปแบบหลักของ motility ใน gastrointestinal tract และบทบาทต่อ digestion กับ excretion และ **แยก peristalsis ออกจาก segmentation ให้ได้**",
              "อธิบายพื้นฐานทางไฟฟ้าของการหดตัว และบทบาทของ basic electrical activity ในการกำกับ motility pattern",
              "อธิบายว่า GI motility เปลี่ยนไปอย่างไรในภาวะ fasting",
              "เข้าใจว่าอาหารถูกกลืนและถูกส่งลงกระเพาะอย่างไร",
              "ระบุปัจจัยที่กำหนด gastric emptying และการตอบสนองที่ผิดปกติคือ vomiting",
              "อธิบายว่า motility pattern ของ colon ทำหน้าที่ desiccate และ evacuate อุจจาระได้อย่างไร"
            ]
          },
          {
            "text": "INTRODUCTION ระบุว่ากลไกเหล่านี้ทำให้อาหารนุ่มลง ถูกขับเคลื่อนไปตามความยาวของทางเดินอาหาร และผสมกับ bile จาก gallbladder และ digestive enzymes จาก salivary glands และ pancreas โดยบางกลไกอาศัย intrinsic properties ของ intestinal smooth muscle เอง ส่วนที่เหลืออาศัย reflex ของ neurons ที่อยู่ในลำไส้เอง reflex ที่ผ่าน central nervous system (CNS) ผลแบบ paracrine ของ chemical messengers และ gastrointestinal hormones"
          },
          {
            "sub": "TABLE 27-1 ความยาวเฉลี่ยของแต่ละส่วน (วัดด้วย intubation ในคนที่มีชีวิต)",
            "body": [
              {
                "bullets": [
                  "Pharynx, esophagus และ stomach รวมกัน 65 cm",
                  "Duodenum 25 cm",
                  "Jejunum และ ileum 260 cm",
                  "Colon 110 cm"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "PERISTALSIS",
        "source": "Chapter 27 Gastrointestinal Motility p.2",
        "body": [
          {
            "text": "**Peristalsis คือ reflex response ที่เริ่มเมื่อผนังลำไส้ถูกยืดด้วยสิ่งที่อยู่ใน lumen** และเกิดได้ทุกส่วนของ gastrointestinal tract ตั้งแต่ esophagus จนถึง rectum"
          },
          {
            "text": "การยืดกระตุ้นให้เกิด **circular contraction ด้านหลังจุดกระตุ้น และเกิด relaxation ด้านหน้า** จากนั้น wave of contraction เคลื่อนในทิศ oral-to-caudal ดันสิ่งที่อยู่ใน lumen ไปข้างหน้าด้วยอัตรา **2 ถึง 25 cm/s**"
          },
          {
            "text": "Autonomic input เพิ่มหรือลด peristaltic activity ได้ แต่ **การเกิด peristalsis ไม่ขึ้นกับ extrinsic innervation** หลักฐานที่หนังสือยกมาคือ ถ้าตัดลำไส้ออกมาแล้วเย็บกลับที่เดิมในทิศเดิม การเคลื่อนของสิ่งที่อยู่ข้างในไม่ถูกขวาง จะถูกขวางก็ต่อเมื่อกลับหัวกลับหางชิ้นนั้นก่อนเย็บกลับ"
          },
          {
            "sub": "ลำดับสารสื่อประสาทตามที่บทนี้เขียนไว้",
            "body": [
              {
                "bullets": [
                  "การยืดเฉพาะที่ปล่อย **serotonin** ซึ่งไปกระตุ้น sensory neurons ที่ไปกระตุ้น myenteric plexus",
                  "Cholinergic neurons ที่วิ่งย้อนทาง (retrograde) ใน plexus นี้ ไปกระตุ้น neurons ที่ปล่อย **substance P และ acetylcholine ทำให้ smooth muscle หดตัวด้านหลัง bolus**",
                  "พร้อมกันนั้น cholinergic neurons ที่วิ่งไปข้างหน้า (anterograde) กระตุ้น neurons ที่หลั่ง **NO และ vasoactive intestinal polypeptide (VIP) ทำให้เกิด relaxation ด้านหน้าจุดกระตุ้น**"
                ]
              },
              {
                "text": "หนังสือสรุปว่า peristalsis เป็นตัวอย่างชั้นดีของการทำงานแบบบูรณาการของ enteric nervous system"
              }
            ]
          },
          {
            "text": "คำบรรยาย FIGURE 27-1 เทียบสามแบบไว้ในภาพเดียว isolated contraction เคลื่อนสิ่งที่อยู่ข้างในทั้งทาง orally และ aborally, segmentation ผสมสิ่งที่อยู่ข้างในในช่วงสั้น ๆ ของลำไส้, ส่วน peristalsis มีทั้ง contraction และ relaxation และเคลื่อนสิ่งที่อยู่ข้างในไปทาง aborally"
          }
        ]
      },
      {
        "heading": "SEGMENTATION และการผสม",
        "source": "Chapter 27 Gastrointestinal Motility p.2",
        "body": [
          {
            "text": "เมื่อมีอาหารอยู่ enteric nervous system จะสร้าง motility pattern ที่เกี่ยวข้องกับ peristalsis แต่ **ออกแบบมาเพื่อหน่วงการเคลื่อนที่ของสิ่งที่อยู่ในลำไส้ เพื่อให้มีเวลา digestion และ absorption** เรียกว่า segmentation"
          },
          {
            "text": "กลไก คือ **ลำไส้ท่อนหนึ่งหดตัวที่ปลายทั้งสองข้าง แล้วเกิดการหดตัวครั้งที่สองตรงกลางท่อน ดัน chyme ทั้งถอยหลังและไปข้างหน้า** ดังนั้นต่างจาก peristalsis ตรงที่ **retrograde movement ของ chyme เกิดขึ้นเป็นปกติใน segmentation**"
          },
          {
            "text": "pattern การผสมนี้คงอยู่ตราบเท่าที่ยังมี nutrients เหลือใน lumen ให้ดูดซึม หนังสือบอกว่าน่าจะสะท้อน programmed activity ของลำไส้ที่ถูกกำหนดโดย enteric nervous system และเกิดได้โดยไม่ต้องพึ่ง central input แม้ central input จะ modulate ได้"
          }
        ]
      },
      {
        "heading": "BASIC ELECTRICAL RHYTHM (BER) และ interstitial cells of Cajal",
        "source": "Chapter 27 Gastrointestinal Motility p.3",
        "body": [
          {
            "text": "**ยกเว้น esophagus และส่วนต้นของ stomach** smooth muscle ของ gastrointestinal tract มี spontaneous rhythmic fluctuations ของ membrane potential อยู่ระหว่างประมาณ **-65 ถึง -45 mV** เรียกว่า basic electrical rhythm (BER)"
          },
          {
            "text": "**BER ถูกริเริ่มโดย interstitial cells of Cajal** ซึ่งเป็น stellate mesenchymal pacemaker cells ที่มีลักษณะคล้าย smooth muscle และแตกแขนงยาวหลายแขนงเข้าไปใน intestinal smooth muscle"
          },
          {
            "bullets": [
              "ใน stomach และ small intestine เซลล์เหล่านี้อยู่ที่ **outer circular muscle layer ใกล้ myenteric plexus**",
              "ใน colon อยู่ที่ **submucosal border ของ circular muscle layer**",
              "ใน stomach และ small intestine มี descending gradient ของ pacemaker frequency และเหมือนหัวใจคือ **pacemaker ที่ความถี่สูงสุดมักเป็นตัวคุม**"
            ]
          },
          {
            "sub": "BER เองไม่ทำให้กล้ามเนื้อหดตัว",
            "body": [
              {
                "text": "**ตัว BER แทบไม่ทำให้กล้ามเนื้อหดตัว แต่ spike potentials ที่ซ้อนอยู่บนช่วงที่ depolarize มากที่สุดของ BER wave ต่างหากที่เพิ่ม muscle tension** ส่วน depolarizing ของแต่ละ spike เกิดจาก Ca2+ influx และส่วน repolarizing เกิดจาก K+ efflux"
              },
              {
                "text": "**Acetylcholine เพิ่มจำนวน spike และ tension ของ smooth muscle ส่วน epinephrine ลดจำนวน spike และ tension** หนังสือระบุว่ามี polypeptides และ neurotransmitters อีกหลายชนิดที่มีผลต่อ BER แต่ยกตัวอย่างไว้แค่สองตัวนี้"
              }
            ]
          },
          {
            "sub": "อัตรา BER ของแต่ละส่วน (ตัวเลขที่ต้องจำ)",
            "body": [
              {
                "bullets": [
                  "Stomach ประมาณ **4/min**",
                  "Duodenum ประมาณ **12/min** และลดลงเหลือประมาณ **8/min ที่ distal ileum**",
                  "Colon เพิ่มขึ้นจากประมาณ **2/min ที่ cecum ไปเป็น 6/min ที่ sigmoid**"
                ]
              }
            ]
          },
          {
            "text": "**หน้าที่ของ BER คือประสาน peristaltic activity และ motor activity อื่น เช่นตั้งจังหวะของ segmentation โดยการหดตัวเกิดได้เฉพาะช่วง depolarizing ของคลื่นเท่านั้น** หลักฐานคือหลัง vagotomy หรือหลังตัดผนัง stomach ขาด peristalsis ใน stomach จะกลายเป็นแบบไม่สม่ำเสมอและวุ่นวาย"
          },
          {
            "text": "คำบรรยาย FIGURE 27-2 แสดง membrane potential ที่มี spike potentials ภายใต้ maximal cholinergic tone เทียบกับการถูกยับยั้งภายใต้ adrenergic tone และแถบล่างคือการเปลี่ยนแปลงของ muscle tension ที่เกิดตามกัน"
          }
        ]
      },
      {
        "heading": "MIGRATING MOTOR COMPLEX (MMC) รูปแบบตอนอดอาหาร",
        "source": "Chapter 27 Gastrointestinal Motility p.3",
        "body": [
          {
            "text": "ช่วง fasting ระหว่างมื้อ รูปแบบ electrical และ motor activity ถูกดัดแปลงจนเกิด cycle ของ motor activity ที่ **เคลื่อนจาก stomach ไปยัง distal ileum** เรียกว่า migrating motor complex (MMC)"
          },
          {
            "bullets": [
              "**Phase I** ช่วงเงียบ (quiescent period)",
              "**Phase II** ช่วงที่มี electrical และ mechanical activity แบบไม่สม่ำเสมอ",
              "**Phase III** ปิดท้ายด้วย burst ของ regular activity"
            ]
          },
          {
            "text": "**MMC ถูกริเริ่มโดย motilin** โดยระดับฮอร์โมนนี้ในเลือดสูงขึ้นเป็นช่วง ๆ ทุกประมาณ **100 นาที** ในภาวะ interdigestive สอดคล้องกับ contractile phases ของ MMC การหดตัวเคลื่อนไปทาง aborally ด้วยอัตราประมาณ **5 cm/min** และเกิดทุกประมาณ 100 นาทีเช่นกัน"
          },
          {
            "text": "ระหว่างแต่ละ MMC **gastric secretion, bile flow และ pancreatic secretion เพิ่มขึ้น** หนังสือบอกว่าน่าจะทำหน้าที่กวาด stomach และ small intestine ให้ว่างจากสิ่งที่ค้างใน lumen เพื่อเตรียมรับมื้อถัดไป"
          },
          {
            "callout": "คำบรรยาย FIGURE 27-3 ให้ตัวเลขละเอียดกว่าเนื้อความ คือ phase III กินเวลาประมาณ 5 นาที และกวาดไปตามความยาวลำไส้ ส่วนทั้ง cycle เกิดซ้ำทุก 90 ถึง 100 นาทีในภาวะ fasting และถูกยับยั้งอย่างสมบูรณ์เมื่อกินอาหาร แล้วกลับมาใหม่ในอีก 90 ถึง 120 นาที",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "MMC ถูกดับเมื่อกินอาหาร",
        "source": "Chapter 27 Gastrointestinal Motility p.4",
        "body": [
          {
            "text": "ในทางกลับกัน เมื่อกินอาหาร **การหลั่ง motilin ถูกกด และ MMC ถูกยกเลิกไปจนกว่า digestion และ absorption จะเสร็จ**"
          },
          {
            "callout": "หนังสือระบุตรง ๆ ว่ากลไกที่การกินอาหารไปกดการหลั่ง motilin นั้น ยังไม่ถูกอธิบาย (have not yet been elucidated) จึงเป็นจุดที่สไลด์ไม่ได้บอกกลไก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "MOUTH & ESOPHAGUS และ MASTICATION",
        "source": "Chapter 27 Gastrointestinal Motility p.4",
        "body": [
          {
            "text": "ในปาก อาหารถูกผสมกับ saliva แล้วถูกดันเข้า esophagus จากนั้น peristaltic waves ใน esophagus พาอาหารลงสู่ stomach"
          },
          {
            "text": "**Chewing (mastication) ทำให้ชิ้นอาหารใหญ่แตกและผสมกับสารคัดหลั่งจาก salivary glands** การทำให้เปียกและเป็นเนื้อเดียวนี้ช่วยทั้งการกลืนและการย่อยต่อไป"
          },
          {
            "bullets": [
              "ชิ้นอาหารใหญ่ย่อยได้ แต่ทำให้ esophageal musculature หดตัวแรงและมักเจ็บ",
              "ชิ้นที่เล็กเกินไปมีแนวโน้มกระจายตัวเมื่อไม่มี saliva และกลืนยากเพราะ **ไม่รวมตัวเป็น bolus**",
              "จำนวนครั้งของการเคี้ยวที่เหมาะสมขึ้นกับชนิดอาหาร แต่โดยทั่วไปอยู่ที่ **20 ถึง 25 ครั้ง**",
              "ผู้ป่วย edentulous มักถูกจำกัดให้กินอาหารอ่อน และมีปัญหามากกับอาหารแห้ง"
            ]
          }
        ]
      },
      {
        "heading": "SWALLOWING (deglutition)",
        "source": "Chapter 27 Gastrointestinal Motility p.4",
        "body": [
          {
            "text": "**Swallowing เป็น reflex response ที่ถูกกระตุ้นโดย afferent impulses ใน trigeminal, glossopharyngeal และ vagus nerves** impulses เหล่านี้ถูกบูรณาการที่ **nucleus of the tractus solitarius และ nucleus ambiguus** ส่วน efferent fibers วิ่งไปยัง pharyngeal musculature และลิ้นผ่าน **trigeminal, facial และ hypoglossal nerves**"
          },
          {
            "text": "จุดเริ่มต้นเป็น **voluntary** คือรวบสิ่งที่อยู่ในปากไว้บนลิ้นแล้วดันไปทาง pharynx จากนั้นจึงเกิดคลื่นการหดตัวแบบ involuntary ของ pharyngeal muscles ที่ดันอาหารเข้า esophagus โดย **การยับยั้งการหายใจและการปิด glottis เป็นส่วนหนึ่งของ reflex นี้**"
          },
          {
            "text": "peristaltic ring contraction ของกล้ามเนื้อ esophagus ก่อตัวขึ้นด้านหลังอาหาร แล้วกวาดลงไปด้วยความเร็วประมาณ **4 cm/s**"
          },
          {
            "callout": "จุดที่ชอบออกสอบ ในท่ายืน ของเหลวและอาหารกึ่งแข็งมักตกลงสู่ esophagus ส่วนล่างด้วยแรงโน้มถ่วงนำหน้า peristaltic wave ไปก่อน แต่ถ้ายังมีอาหารค้าง จะถูกกวาดด้วย peristalsis คลื่นที่สอง หนังสือจึงสรุปว่า **กลืนอาหารในท่าหัวกลับลงก็ยังทำได้**",
            "kind": "tip"
          },
          {
            "text": "คำบรรยาย FIGURE 27-4 ไล่ลำดับสี่ขั้น A ลิ้นดัน food bolus ไปด้านหลังปาก B soft palate ยกขึ้นกันอาหารเข้าโพรงจมูก C epiglottis ปิด glottis กันอาหารเข้า trachea และ upper esophageal sphincter คลายตัว D อาหารลงสู่ esophagus"
          }
        ]
      },
      {
        "heading": "LOWER ESOPHAGEAL SPHINCTER (LES) สามองค์ประกอบ",
        "source": "Chapter 27 Gastrointestinal Motility p.5",
        "body": [
          {
            "text": "ต่างจาก esophagus ส่วนที่เหลือ กล้ามเนื้อของ gastroesophageal junction หรือ lower esophageal sphincter (LES) **มี tonic activity ตลอดเวลาแต่คลายตัวเมื่อกลืน** และ **tonic activity ระหว่างมื้อนี่เองที่กันไม่ให้สิ่งที่อยู่ในกระเพาะไหลย้อนขึ้น esophagus**"
          },
          {
            "sub": "LES ประกอบด้วยสามส่วน",
            "body": [
              {
                "bullets": [
                  "**Intrinsic sphincter** คือ esophageal smooth muscle ที่หนาเด่นขึ้นตรงรอยต่อกับ stomach",
                  "**Extrinsic sphincter** คือ fibers ของ crural portion ของ diaphragm ซึ่งเป็น skeletal muscle ล้อมรอบ esophagus ตรงจุดนี้ และออกแรงบีบแบบ pinchcock",
                  "**Oblique หรือ sling fibers ของผนัง stomach** สร้าง flap valve ที่ช่วยปิดรอยต่อ esophagogastric และกัน regurgitation เมื่อ intragastric pressure สูงขึ้น"
                ]
              }
            ]
          },
          {
            "sub": "การควบคุมด้วยระบบประสาท",
            "body": [
              {
                "text": "**Acetylcholine จาก vagal endings ทำให้ intrinsic sphincter หดตัว ส่วน NO และ VIP จาก interneurons ที่ถูกเลี้ยงด้วย vagal fibers อีกชุดหนึ่งทำให้คลายตัว**"
              },
              {
                "text": "การหดตัวของ crural portion ของ diaphragm ซึ่งเลี้ยงด้วย **phrenic nerves** ถูกประสานกับการหายใจและการหดตัวของกล้ามเนื้อทรวงอกกับหน้าท้อง ทั้ง intrinsic และ extrinsic sphincter จึงทำงานร่วมกันเพื่อให้อาหารไหลเข้ากระเพาะอย่างเป็นระเบียบและกัน reflux"
              }
            ]
          },
          {
            "text": "คำบรรยาย FIGURE 27-5 ย้ำว่า intrinsic sphincter ถูกเสริมด้วย crural portion ของ diaphragm และทั้งสองถูกยึดเข้าหากันด้วย **phrenoesophageal ligament**"
          }
        ]
      },
      {
        "heading": "CLINICAL BOX 27-1 Motor Disorders of the Esophagus",
        "source": "Chapter 27 Gastrointestinal Motility p.6",
        "body": [
          {
            "sub": "Achalasia",
            "body": [
              {
                "text": "แปลตรงตัวว่า failure to relax เป็นภาวะที่ **อาหารสะสมใน esophagus จนอวัยวะขยายใหญ่มากได้** เกิดจาก **resting LES tone ที่สูงขึ้นและการคลายตัวที่ไม่สมบูรณ์เมื่อกลืน**"
              },
              {
                "text": "กลไกที่หนังสือระบุคือ **myenteric plexus ของ esophagus บกพร่องที่ตำแหน่ง LES และการปล่อย NO กับ VIP เสียไป**"
              }
            ]
          },
          {
            "sub": "LES incompetence และ gastroesophageal reflux disease",
            "body": [
              {
                "text": "เป็นภาวะตรงข้ามกับ achalasia คือยอมให้ **acid gastric contents ไหลย้อนขึ้น esophagus** หนังสือระบุว่าเป็น **ความผิดปกติทางเดินอาหารที่พบบ่อยที่สุดที่ทำให้ผู้ป่วยมาพบแพทย์** ทำให้เกิด heartburn และ esophagitis และนำไปสู่ ulceration กับ stricture ของ esophagus จาก scarring ได้"
              },
              {
                "text": "ในรายที่รุนแรง intrinsic sphincter หรือ extrinsic sphincter หรือทั้งคู่จะอ่อนแรง ส่วนรายที่ไม่รุนแรงเกิดจากช่วงที่ neural drive ไปยัง sphincter ทั้งสองลดลงเป็นพัก ๆ ซึ่งหนังสือบอกเองว่า **ยังเข้าใจได้ไม่ดี (poorly understood)**"
              }
            ]
          },
          {
            "sub": "THERAPEUTIC HIGHLIGHTS ที่กล่องนี้เขียนไว้",
            "body": [
              {
                "bullets": [
                  "Achalasia รักษาได้ด้วย pneumatic dilation ของ sphincter หรือผ่าตัดกรีดกล้ามเนื้อ esophagus (myotomy)",
                  "การฉีด botulinum toxin เข้า LES เพื่อยับยั้งการปล่อย acetylcholine ก็ได้ผล และบรรเทาอาการอยู่ได้หลายเดือน",
                  "Gastroesophageal reflux disease รักษาด้วยการยับยั้งการหลั่งกรดด้วย H2-receptor blockers หรือ proton pump inhibitors",
                  "การผ่าตัด fundoplication คือเอา fundus ส่วนหนึ่งพันรอบ esophagus ส่วนล่างจน LES อยู่ในอุโมงค์สั้น ๆ ของกระเพาะ ทำได้แต่ผู้ป่วยจำนวนมากกลับมามีอาการอีกในที่สุด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "AEROPHAGIA และแก๊สในลำไส้",
        "source": "Chapter 27 Gastrointestinal Motility p.6",
        "body": [
          {
            "text": "การกลืนอากาศบางส่วนเลี่ยงไม่ได้ระหว่างกินและดื่ม เรียกว่า **aerophagia** อากาศบางส่วนถูกเรอออก (belching) แก๊สบางส่วนถูกดูดซึม แต่ส่วนใหญ่ผ่านลงไปถึง colon"
          },
          {
            "text": "ที่ colon ออกซิเจนบางส่วนถูกดูดซึม และมี **hydrogen, hydrogen sulfide, carbon dioxide และ methane ที่ colonic bacteria สร้างจาก carbohydrates และสารอื่น** เติมเข้าไป ก่อนถูกขับออกเป็น flatus โดย **กลิ่นส่วนใหญ่มาจาก sulfides**"
          },
          {
            "bullets": [
              "ปริมาตรแก๊สที่พบตามปกติในทางเดินอาหารมนุษย์ประมาณ **200 mL**",
              "การผลิตต่อวันประมาณ **500 ถึง 1500 mL**",
              "ในบางคน แก๊สในลำไส้ทำให้เกิด cramps, borborygmi (เสียงท้องร้อง) และไม่สบายท้อง"
            ]
          }
        ]
      },
      {
        "heading": "GASTRIC MOTILITY & EMPTYING",
        "source": "Chapter 27 Gastrointestinal Motility p.6",
        "body": [
          {
            "text": "หน้าที่ของ stomach ตามที่หนังสือสรุปคือ เก็บอาหาร ผสมกับกรด mucus และ pepsin แล้วปล่อยเข้า duodenum ในอัตราที่ควบคุมและสม่ำเสมอ"
          },
          {
            "text": "**เมื่ออาหารเข้ากระเพาะ fundus และส่วนบนของ body คลายตัวรับอาหารโดยความดันแทบไม่เพิ่ม เรียกว่า receptive relaxation** จากนั้น peristalsis เริ่มที่ส่วนล่างของ body ผสมและบดอาหาร แล้วปล่อยส่วนที่เป็นกึ่งเหลวปริมาณน้อย ๆ ผ่าน pylorus เข้า duodenum"
          },
          {
            "bullets": [
              "Receptive relaxation **ส่วนหนึ่งผ่าน vagus** และถูกกระตุ้นโดยการเคลื่อนไหวของ pharynx และ esophagus นอกจากนี้ intrinsic reflexes ก็ทำให้คลายตัวเมื่อผนังกระเพาะถูกยืด",
              "Peristaltic waves ที่ถูกคุมโดย gastric BER เริ่มตามมาไม่นานและกวาดไปทาง pylorus",
              "การหดตัวของ distal stomach จากแต่ละคลื่น บางครั้งเรียกว่า **antral systole ซึ่งกินเวลาได้ถึง 10 วินาที** และคลื่นเกิด **3 ถึง 4 ครั้งต่อนาที**"
            ]
          },
          {
            "sub": "antrum, pylorus และ upper duodenum ทำงานเป็นหน่วยเดียวกัน",
            "body": [
              {
                "text": "การหดตัวของ antrum ตามด้วยการหดตัวเป็นลำดับของ pyloric region และ duodenum **ที่ antrum การหดตัวบางส่วนนำหน้าสิ่งที่เคลื่อนมา จึงกันไม่ให้ก้อนแข็งเข้า duodenum และถูกผสมกับบดแทน ส่วนที่เหลวกว่าถูกฉีดเข้าลำไส้เล็กทีละนิด**"
              },
              {
                "text": "ตามปกติไม่มี regurgitation จาก duodenum เพราะ **การหดตัวของ pyloric segment มักคงอยู่นานกว่าของ duodenum เล็กน้อย** และหนังสือเสริมว่าการป้องกัน regurgitation อาจเกิดจากฤทธิ์กระตุ้นของ **cholecystokinin (CCK) และ secretin ต่อ pyloric sphincter** ด้วย"
              }
            ]
          }
        ]
      },
      {
        "heading": "REGULATION OF GASTRIC MOTILITY & EMPTYING",
        "source": "Chapter 27 Gastrointestinal Motility p.7",
        "body": [
          {
            "text": "**อัตราที่กระเพาะปล่อยอาหารลง duodenum ขึ้นกับชนิดของอาหารที่กิน** โดยเรียงตามที่หนังสือระบุ"
          },
          {
            "bullets": [
              "อาหารที่มี carbohydrate มาก ออกจากกระเพาะภายในไม่กี่ชั่วโมง",
              "อาหารที่มี protein มาก ออกช้ากว่า",
              "**การปล่อยช้าที่สุดคือหลังมื้อที่มี fat**"
            ]
          },
          {
            "text": "อัตรายังขึ้นกับ **osmotic pressure ของสิ่งที่เข้า duodenum** ด้วย โดย hyperosmolality ของสิ่งที่อยู่ใน duodenum ถูกรับรู้โดย duodenal osmoreceptors ที่ทำให้ gastric emptying ลดลง ซึ่งหนังสือระบุว่ากลไก **น่าจะ (probably) เป็นทางประสาท** จึงยังไม่ฟันธง"
          },
          {
            "text": "**Fats, carbohydrates และกรดใน duodenum ยับยั้งทั้ง gastric acid secretion, pepsin secretion และ gastric motility ผ่านกลไกทางประสาทและฮอร์โมน** โดยหนังสือระบุว่า messenger ที่เกี่ยวข้องน่าจะเป็น **peptide YY** และมีการเสนอว่า **CCK** เป็นตัวยับยั้ง gastric emptying ด้วย"
          },
          {
            "text": "คำบรรยาย FIGURE 27-6 ระบุว่ากราฟผลของ protein และ fat ต่ออัตราการปล่อยอาหารของกระเพาะมนุษย์นั้น ได้จากอาสาสมัครที่กินมื้ออาหารเหลวปริมาณ 300 mL"
          }
        ]
      },
      {
        "heading": "CLINICAL BOX 27-2 ผลของ Gastric Bypass Surgery และ dumping syndrome",
        "source": "Chapter 27 Gastrointestinal Motility p.7",
        "body": [
          {
            "text": "ผู้ป่วยอ้วนมากอาจได้รับการผ่าตัดที่เย็บลวดหรือลดขนาดกระเพาะจนส่วนใหญ่ถูก bypass ทำให้ **เสียหน้าที่ reservoir ของกระเพาะไป พร้อมกับเสียสัญญาณจากกระเพาะเช่น ghrelin ที่กระตุ้นการกินอาหาร** ผลคือกินได้ครั้งละน้อย"
          },
          {
            "sub": "ทำไมกินมื้อใหญ่แล้วมีอาการ",
            "body": [
              {
                "text": "ถ้ากินมื้อใหญ่ จะเกิด **การดูดซึม glucose จากลำไส้อย่างรวดเร็ว ตามด้วย hyperglycemia และการหลั่ง insulin ที่พุ่งขึ้นทันที ทำให้เกิดอาการ hypoglycemia ประมาณ 2 ชั่วโมงหลังอาหาร**"
              },
              {
                "text": "อาการอ่อนแรง เวียนศีรษะ และเหงื่อออกหลังอาหาร ซึ่งส่วนหนึ่งมาจาก hypoglycemia นี้เป็นส่วนหนึ่งของภาพ **dumping syndrome** ซึ่งเกิดได้ในผู้ป่วยที่ถูกตัดกระเพาะบางส่วนหรือถูกต่อ jejunum เข้ากับกระเพาะด้วย"
              },
              {
                "text": "อีกสาเหตุของอาการคือ **การที่มื้ออาหาร hypertonic เข้าลำไส้อย่างรวดเร็ว ดึงน้ำเข้าลำไส้มากจนเกิด hypovolemia และ hypotension อย่างมีนัยสำคัญ**"
              }
            ]
          },
          {
            "text": "THERAPEUTIC HIGHLIGHTS ของกล่องนี้ระบุว่า **ไม่มีการรักษาจำเพาะสำหรับ dumping syndrome** นอกจากเลี่ยงมื้อใหญ่ โดยเฉพาะมื้อที่มี simple sugars เข้มข้น และหนังสือตั้งข้อสังเกตว่าการเกิดอาการนี้อาจมีส่วนช่วยให้การผ่าตัด bypass ลดการกินและลดความอ้วนได้สำเร็จ"
          }
        ]
      },
      {
        "heading": "VOMITING ลำดับเหตุการณ์และศูนย์ควบคุม",
        "source": "Chapter 27 Gastrointestinal Motility p.8",
        "body": [
          {
            "text": "**Vomiting เป็นตัวอย่างของการควบคุม gut motility จากส่วนกลาง** ลำดับตามที่หนังสือเขียน"
          },
          {
            "bullets": [
              "เริ่มด้วย **salivation และความรู้สึก nausea**",
              "**Reverse peristalsis** ดันสิ่งที่อยู่ในลำไส้เล็กส่วนต้นกลับเข้า stomach",
              "**Glottis ปิด** เพื่อกัน aspiration ของ vomitus เข้า trachea และกลั้นหายใจไว้กลางการหายใจเข้า",
              "กล้ามเนื้อผนังหน้าท้องหดตัว และเพราะทรวงอกถูกตรึงไว้ การหดตัวจึง **เพิ่ม intra-abdominal pressure**",
              "**LES และ esophagus คลายตัว แล้วสิ่งที่อยู่ในกระเพาะถูกขับออก**"
            ]
          },
          {
            "text": "**vomiting center อยู่ใน reticular formation ของ medulla** ประกอบด้วยกลุ่ม neurons กระจายอยู่หลายกลุ่มในบริเวณนี้ ที่ควบคุมองค์ประกอบต่าง ๆ ของการอาเจียนคนละส่วนกัน"
          },
          {
            "sub": "สิ่งกระตุ้นที่ทำให้อาเจียน",
            "body": [
              {
                "bullets": [
                  "**การระคายเยื่อบุของ upper gastrointestinal tract** โดย impulses ถูกส่งจาก mucosa ไป medulla ผ่าน visceral afferent pathways ใน sympathetic nerves และ vagi",
                  "**Afferents จาก vestibular nuclei** เป็นตัวกลางของ nausea และ vomiting ใน motion sickness",
                  "Afferents จาก **diencephalon และ limbic system** ซึ่งอธิบายการอาเจียนต่อสิ่งเร้าที่กระตุ้นอารมณ์ โดยหนังสือใช้คำว่า presumably คือยังเป็นการสันนิษฐาน"
                ]
              }
            ]
          },
          {
            "sub": "Chemoreceptor trigger zone",
            "body": [
              {
                "text": "Chemoreceptor cells ใน medulla เริ่มการอาเจียนได้เมื่อถูกกระตุ้นด้วยสารเคมีในกระแสเลือด **chemoreceptor trigger zone อยู่ที่ area postrema ซึ่งเป็นแถบเนื้อเยื่อรูปตัว V บนผนังด้านข้างของ fourth ventricle ใกล้ obex เป็นหนึ่งใน circumventricular organs และไม่ถูกปกป้องด้วย blood-brain barrier**"
              },
              {
                "text": "**Lesions ของ area postrema แทบไม่มีผลต่อการอาเจียนจากการระคายทางเดินอาหารหรือจาก motion sickness แต่ยกเลิกการอาเจียนที่ตามมาหลังฉีด apomorphine และยา emetic อื่น ๆ** และยังลดการอาเจียนใน uremia และ radiation sickness ซึ่งทั้งสองภาวะอาจสัมพันธ์กับการสร้าง emetic substances ในกระแสเลือดเอง"
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวรับและยาที่เกี่ยวกับการอาเจียน",
        "source": "Chapter 27 Gastrointestinal Motility p.9",
        "body": [
          {
            "text": "**Serotonin (5-HT) ที่ปล่อยจาก enterochromaffin cells ใน small intestine ดูเหมือนจะเริ่ม impulses ผ่าน 5-HT3 receptors ที่กระตุ้นการอาเจียน** และยังมี **dopamine D2 receptors กับ 5-HT3 receptors ที่ area postrema และ nucleus of the solitary tract ที่อยู่ติดกัน**"
          },
          {
            "bullets": [
              "**5-HT3 antagonists เช่น ondansetron** และ **D2 antagonists เช่น chlorpromazine และ haloperidol** เป็น antiemetic agents ที่ได้ผล",
              "**Corticosteroids, cannabinoids และ benzodiazepines** ใช้เดี่ยวหรือร่วมกับ 5-HT3 และ D2 antagonists ก็มีประโยชน์ในการรักษาอาเจียนจาก chemotherapy"
            ]
          },
          {
            "callout": "หนังสือระบุตรง ๆ ว่า **กลไกการออกฤทธิ์ของ corticosteroids และ cannabinoids ยังไม่ทราบ** ส่วน benzodiazepines น่าจะออกฤทธิ์โดยลดความวิตกกังวลที่มากับ chemotherapy",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "SMALL INTESTINE และสามชนิดของการหดตัว",
        "source": "Chapter 27 Gastrointestinal Motility p.9",
        "body": [
          {
            "text": "ใน small intestine สิ่งที่อยู่ในลำไส้ถูกผสมกับสารคัดหลั่งของ mucosal cells กับ pancreatic juice และ bile และ **chyme ถูกกักไว้นานพอให้ nutrient absorption เกิดขึ้น**"
          },
          {
            "text": "ในลำไส้เล็ก BER เฉลี่ย **12 cycles/min ที่ proximal jejunum ลดลงเหลือ 8/min ที่ distal ileum**"
          },
          {
            "sub": "smooth muscle contractions มีสามชนิด",
            "body": [
              {
                "bullets": [
                  "**Peristaltic waves** ขับ intestinal contents ไปทาง large intestines",
                  "**Segmentation contractions** ขยับ chyme ไปมาและเพิ่มการสัมผัสกับผิว mucosa โดยถูกริเริ่มด้วย **focal increases ของ Ca2+ influx และมีคลื่นความเข้มข้น Ca2+ แผ่จากแต่ละจุด**",
                  "**Tonic contractions** เป็นการหดตัวที่ยาวนานกว่า ซึ่งมีผลเป็นการ **แยกลำไส้ท่อนหนึ่งออกจากอีกท่อน**"
                ]
              },
              {
                "text": "หนังสือย้ำว่า **สองชนิดหลังทำให้ transit ในลำไส้เล็กช้าลงจน transit time ในภาวะกินอาหารยาวกว่าภาวะอดอาหาร** ซึ่งทำให้ chyme สัมผัส enterocytes นานขึ้นและส่งเสริมการดูดซึม"
              }
            ]
          }
        ]
      },
      {
        "heading": "CLINICAL BOX 27-3 Ileus",
        "source": "Chapter 27 Gastrointestinal Motility p.9",
        "body": [
          {
            "bullets": [
              "เมื่อลำไส้ถูกกระทบกระเทือน จะเกิด **การยับยั้ง smooth muscle โดยตรง ทำให้ intestinal motility ลดลง ซึ่งส่วนหนึ่งเกิดจากการกระตุ้น opioid receptors**",
              "เมื่อ peritoneum ถูกระคาย เกิด **reflex inhibition จากการเพิ่ม discharge ของ noradrenergic fibers ใน splanchnic nerves**",
              "การยับยั้งทั้งสองแบบร่วมกันทำให้เกิด **paralytic (adynamic) ileus หลังผ่าตัดช่องท้อง**"
            ]
          },
          {
            "text": "เพราะ peristaltic activity ในลำไส้เล็กลดลงแบบกระจาย สิ่งที่อยู่ข้างในจึงไม่ถูกดันเข้า colon และลำไส้พองไม่สม่ำเสมอด้วยกระเปาะแก๊สและของเหลว"
          },
          {
            "callout": "ตัวเลขการฟื้นตัวที่กล่องนี้ให้ไว้ **intestinal peristalsis กลับมาใน 6 ถึง 8 ชั่วโมง ตามด้วย gastric peristalsis ส่วน colonic activity ใช้เวลา 2 ถึง 3 วันจึงกลับมา**",
            "kind": "tip"
          },
          {
            "text": "THERAPEUTIC HIGHLIGHTS ระบุว่า adynamic ileus บรรเทาได้ด้วยการใส่ท่อผ่านจมูกลงไปยังลำไส้เล็กแล้วดูดของเหลวและแก๊สออกสองสามวันจนกว่า peristalsis จะกลับมา อุบัติการณ์ของ ileus ลดลงจากการใช้การผ่าตัดแบบ minimally invasive เช่น laparoscopic มากขึ้น การให้ผู้ป่วยลุกเดินเร็วก็ช่วยเพิ่ม intestinal motility และมีการศึกษาวิจัยเรื่อง specific opioid antagonists อยู่"
          }
        ]
      },
      {
        "heading": "COLON หน้าที่ reservoir และการดูดน้ำ",
        "source": "Chapter 27 Gastrointestinal Motility p.10",
        "body": [
          {
            "text": "**Colon เป็น reservoir สำหรับกากอาหารที่ย่อยหรือดูดซึมไม่ได้** และ motility ในส่วนนี้ถูกทำให้ช้าลงเพื่อให้ colon ดูดซึม water, Na+ และแร่ธาตุอื่น"
          },
          {
            "text": "**โดยการเอาน้ำออกประมาณ 90% colon เปลี่ยน isotonic chyme 1000 ถึง 2000 mL ที่เข้ามาจาก ileum ในแต่ละวัน ให้เหลือ semisolid feces ประมาณ 200 mL**"
          }
        ]
      },
      {
        "heading": "MOTILITY OF THE COLON และ ileocecal valve",
        "source": "Chapter 27 Gastrointestinal Motility p.10",
        "body": [
          {
            "sub": "Ileocecal valve",
            "body": [
              {
                "text": "**ileum ต่อกับ colon ด้วย ileocecal valve ซึ่งจำกัดการไหลย้อนของสิ่งที่อยู่ใน colon โดยเฉพาะ commensal bacteria จำนวนมาก ไม่ให้เข้า ileum ที่ค่อนข้างปลอดเชื้อ**"
              },
              {
                "text": "ส่วนของ ileum ที่มี ileocecal valve ยื่นเข้าไปใน cecum เล็กน้อย ดังนั้น **ความดันใน colon ที่เพิ่มขึ้นจะบีบให้ปิด ส่วนความดันใน ileum ที่เพิ่มขึ้นจะเปิด** ตามปกติ valve นี้ปิดอยู่ และเปิดสั้น ๆ ทุกครั้งที่ peristaltic wave มาถึง ปล่อยให้ ileal chyme บางส่วนพุ่งเข้า cecum"
              },
              {
                "text": "**เมื่ออาหารออกจากกระเพาะ cecum คลายตัวและการผ่านของ chyme ผ่าน ileocecal valve เพิ่มขึ้น เรียกว่า gastroileal reflex** ซึ่งหนังสือระบุว่า presumably เป็น vagovagal reflex"
              }
            ]
          },
          {
            "sub": "รูปแบบการหดตัวใน colon",
            "body": [
              {
                "bullets": [
                  "**Segmentation contractions** ผสมสิ่งที่อยู่ใน colon และเพิ่มการสัมผัสกับ mucosa จึงช่วยการดูดซึม",
                  "**Peristaltic waves** ดันสิ่งที่อยู่ข้างในไปทาง rectum แม้บางครั้งจะเห็น weak antiperistalsis",
                  "**Mass action contraction เป็นชนิดที่สามและเกิดเฉพาะใน colon เท่านั้น เกิดประมาณ 10 ครั้งต่อวัน เป็นการหดตัวพร้อมกันของ smooth muscle เป็นบริเวณกว้างต่อเนื่อง** ย้ายสิ่งที่อยู่ข้างในจากส่วนหนึ่งไปอีกส่วนหนึ่งของ colon และดันเข้า rectum ด้วย โดยการที่ rectum ถูกขยายจะเริ่ม defecation reflex"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "CLINICAL BOX 27-4 Hirschsprung Disease",
        "source": "Chapter 27 Gastrointestinal Motility p.11",
        "body": [
          {
            "text": "เด็กบางคนมีภาวะ colonic motility ผิดปกติที่กำหนดโดยพันธุกรรม เรียกว่า **Hirschsprung disease หรือ aganglionic megacolon** มีลักษณะเด่นคือ **abdominal distension, anorexia และ lassitude** มักวินิจฉัยได้ตั้งแต่วัยทารก และพบได้มากถึง **1 ใน 5000 การเกิดมีชีพ**"
          },
          {
            "text": "**สาเหตุคือการขาด ganglion cells แต่กำเนิดทั้งใน myenteric และ submucous plexuses ของ colon ส่วน distal ท่อนหนึ่ง อันเป็นผลจากความล้มเหลวของการอพยพของ neural crest cells จาก cranial ไป caudal ตามปกติระหว่างการเจริญ**"
          },
          {
            "bullets": [
              "ฤทธิ์ของ **endothelins ต่อ endothelin B receptor** จำเป็นต่อการอพยพตามปกติของ neural crest cells บางกลุ่ม",
              "หนู knockout ที่ขาด endothelin B receptors เกิด megacolon",
              "ในคน สาเหตุหนึ่งของ congenital aganglionic megacolon ดูเหมือนจะเป็น **mutation ใน endothelin B receptor gene**"
            ]
          },
          {
            "text": "**การไม่มี peristalsis ทำให้อุจจาระผ่านบริเวณ aganglionic ได้ยาก และเด็กที่เป็นโรคนี้อาจถ่ายอุจจาระห่างถึง 3 สัปดาห์ต่อครั้ง**"
          },
          {
            "text": "THERAPEUTIC HIGHLIGHTS ระบุว่าอาการหายได้อย่างสมบูรณ์ถ้าตัดส่วน aganglionic ของ colon ออกแล้วต่อ colon ส่วนเหนือขึ้นไปเข้ากับ rectum แต่ทำไม่ได้ถ้าส่วนที่เป็นยาวมาก ในกรณีนั้นผู้ป่วยอาจต้องทำ colectomy"
          },
          {
            "callout": "หน้าเดียวกันยังปิดท้ายด้วยข้อมูล BER ของ colon ว่า **การเคลื่อนไหวของ colon ถูกประสานด้วย BER ของ colon ซึ่งต่างจากลำไส้เล็กตรงที่ความถี่เพิ่มขึ้นเรื่อย ๆ ไปตามความยาว จากประมาณ 2/min ที่ ileocecal valve เป็น 6/min ที่ sigmoid**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "TRANSIT TIME ในลำไส้เล็กและ colon",
        "source": "Chapter 27 Gastrointestinal Motility p.11",
        "body": [
          {
            "bullets": [
              "ส่วนแรกของอาหารทดสอบไปถึง **cecum ในราว 4 ชั่วโมง** ในคนส่วนใหญ่",
              "ส่วนที่ย่อยไม่ได้ทั้งหมดเข้าสู่ colon ภายใน **8 ถึง 9 ชั่วโมง**",
              "โดยเฉลี่ย เศษอาหารส่วนแรกผ่าน **หนึ่งในสามแรกของ colon ใน 6 ชั่วโมง หนึ่งในสามถัดไปใน 9 ชั่วโมง และถึง sigmoid colon ใน 12 ชั่วโมง**",
              "**จาก sigmoid colon ถึง anus การเคลื่อนที่ช้ากว่านั้นมาก**"
            ]
          },
          {
            "text": "เมื่อป้อนเม็ดลูกปัดสีเล็ก ๆ พร้อมอาหาร **เฉลี่ย 70% ถูกเก็บได้จากอุจจาระภายใน 72 ชั่วโมง แต่การเก็บได้ครบต้องใช้เวลามากกว่าหนึ่งสัปดาห์**"
          },
          {
            "text": "หนังสือยังระบุว่า transit time, ความผันผวนของความดัน และการเปลี่ยนแปลง pH ในทางเดินอาหาร สังเกตได้ด้วยการติดตามเม็ดยาขนาดเล็กที่บรรจุ sensors และเครื่องส่งวิทยุจิ๋ว"
          }
        ]
      },
      {
        "heading": "CLINICAL BOX 27-5 Constipation",
        "source": "Chapter 27 Gastrointestinal Motility p.11",
        "body": [
          {
            "text": "**Constipation หมายถึงการลดลงของการถ่ายอุจจาระในเชิงพยาธิสภาพ** เดิมเชื่อว่าสะท้อนการเปลี่ยนแปลงของ motility แต่ความสำเร็จของยาที่ออกแบบมาเพื่อเพิ่ม chloride secretion ในการรักษา chronic constipation บ่งชี้ว่า **ความไม่สมดุลระหว่าง secretion กับ absorption ใน colon ก็อาจมีส่วนทำให้เกิดอาการ**"
          },
          {
            "bullets": [
              "ผู้ป่วยที่ท้องผูกเรื้อรัง โดยเฉพาะรายที่เพิ่งมีการเปลี่ยนแปลงของนิสัยการขับถ่าย ควรถูกตรวจอย่างละเอียดเพื่อแยกโรคทางกาย",
              "**คนปกติจำนวนมากถ่ายเพียงทุก 2 ถึง 3 วัน ขณะที่บางคนถ่ายวันละครั้ง และบางคนถ่ายถึงวันละสามครั้ง**",
              "อาการเดียวที่เกิดจาก constipation คือ **เบื่ออาหารเล็กน้อย และไม่สบายท้องกับท้องอืดเล็กน้อย**",
              "อาการเหล่านี้ **ไม่ได้เกิดจากการดูดซึม toxic substances** เพราะหายทันทีเมื่อถ่ายอุจจาระออกจาก rectum และสร้างขึ้นใหม่ได้ด้วยการขยาย rectum ด้วยวัสดุ inert"
            ]
          },
          {
            "text": "THERAPEUTIC HIGHLIGHTS ระบุว่ากรณีส่วนใหญ่บรรเทาได้ด้วยการปรับอาหารให้มี fiber มากขึ้น หรือใช้ laxatives ที่เก็บของเหลวไว้ใน colon จึงเพิ่ม bulk ของอุจจาระและกระตุ้น reflexes ที่นำไปสู่การขับถ่าย และ **lubiprostone เพิ่งถูกเพิ่มเข้ามาในการรักษา constipation โดยเชื่อว่าออกฤทธิ์เพิ่มการหลั่ง chloride และน้ำเข้า colon จึงเพิ่มความเหลวของสิ่งที่อยู่ใน colon**"
          }
        ]
      },
      {
        "heading": "DEFECATION",
        "source": "Chapter 27 Gastrointestinal Motility p.12",
        "body": [
          {
            "text": "**การขยายของ rectum ด้วยอุจจาระเริ่ม reflex contractions ของกล้ามเนื้อ rectum และความรู้สึกอยากถ่าย**"
          },
          {
            "sub": "การเลี้ยงของเส้นประสาทต่อ sphincter ทั้งสอง",
            "body": [
              {
                "bullets": [
                  "ในคน **sympathetic ที่ไปเลี้ยง internal (involuntary) anal sphincter เป็น excitatory ส่วน parasympathetic เป็น inhibitory** และ sphincter นี้คลายตัวเมื่อ rectum ถูกขยาย",
                  "**External anal sphincter เป็น skeletal muscle เลี้ยงด้วย pudendal nerve** ถูกคงไว้ในภาวะ tonic contraction และการขยาย rectum ระดับปานกลางยิ่งเพิ่มแรงหดตัวของมัน"
                ]
              }
            ]
          },
          {
            "sub": "ตัวเลขความดันที่ต้องจำ",
            "body": [
              {
                "bullets": [
                  "**ความรู้สึกอยากถ่ายเกิดครั้งแรกเมื่อ rectal pressure เพิ่มถึงประมาณ 18 mm Hg**",
                  "**เมื่อความดันถึง 55 mm Hg ทั้ง external และ internal sphincter คลายตัว และเกิดการขับสิ่งที่อยู่ใน rectum ออกแบบ reflex**",
                  "นี่คือเหตุผลที่ **reflex evacuation ของ rectum เกิดได้แม้ในผู้ที่มี spinal injury**"
                ]
              }
            ]
          },
          {
            "sub": "การเบ่งถ่ายโดยตั้งใจ",
            "body": [
              {
                "text": "ก่อนถึงความดันที่ทำให้ external anal sphincter คลาย การถ่ายโดยตั้งใจเริ่มได้ด้วยการเบ่ง ตามปกติ **มุมระหว่าง anus กับ rectum อยู่ที่ประมาณ 90 ถึง 100 องศา ซึ่งเมื่อรวมกับการหดตัวของ puborectalis muscle จะยับยั้งการถ่าย**"
              },
              {
                "text": "เมื่อเบ่ง **กล้ามเนื้อหน้าท้องหดตัว pelvic floor ลดต่ำลง 1 ถึง 3 cm และ puborectalis muscle คลายตัว ทำให้ anorectal angle ตรงขึ้น** เมื่อรวมกับการคลายของ external anal sphincter การถ่ายจึงเกิดขึ้น"
              },
              {
                "text": "หนังสือสรุปว่า **defecation เป็น spinal reflex ที่ยับยั้งได้ตามใจด้วยการหดเกร็ง external sphincter ไว้ หรือส่งเสริมได้ด้วยการคลาย sphincter ร่วมกับหดกล้ามเนื้อหน้าท้อง**"
              }
            ]
          },
          {
            "text": "คำบรรยาย FIGURE 27-9 อธิบายว่าการขยายทำให้เกิด passive tension จากการยืดผนัง rectum และเกิด active tension เพิ่มเมื่อ smooth muscle ในผนังหดตัว โดย internal และ external sphincter จะคลายและหดตามลำดับ แล้ว accommodate ในการขยายแต่ละขั้น จนถึง pressure threshold ของการถ่าย"
          }
        ]
      },
      {
        "heading": "GASTROCOLIC REFLEX",
        "source": "Chapter 27 Gastrointestinal Motility p.13",
        "body": [
          {
            "text": "**การขยายของ stomach ด้วยอาหารเริ่มการหดตัวของ rectum และมักทำให้อยากถ่าย เรียกว่า gastrocolic reflex** และหนังสือระบุว่าอาจถูกขยายผลด้วยฤทธิ์ของ **gastrin** ต่อ colon"
          },
          {
            "text": "เพราะการตอบสนองนี้ **การถ่ายหลังอาหารจึงพบบ่อยในเด็ก ส่วนในผู้ใหญ่ นิสัยและปัจจัยทางวัฒนธรรมมีบทบาทมากในการกำหนดว่าจะถ่ายเมื่อใด**"
          }
        ]
      },
      {
        "heading": "CHAPTER SUMMARY ตามที่หนังสือสรุปเอง",
        "source": "Chapter 27 Gastrointestinal Motility p.13",
        "body": [
          {
            "bullets": [
              "ปัจจัยควบคุมที่กำกับ gastrointestinal secretion ก็กำกับ motility ด้วย เพื่อทำให้อาหารนุ่ม ผสมกับสารคัดหลั่ง และขับไปตามความยาวของทางเดินอาหาร",
              "**สอง pattern หลักคือ peristalsis กับ segmentation ซึ่งทำหน้าที่ขับเคลื่อน กับหน่วงและผสม ตามลำดับ** โดย peristalsis มีการหดตัวและคลายตัวที่ประสานกันเหนือและใต้ food bolus",
              "membrane potential ของ GI smooth muscle ส่วนใหญ่แกว่งเป็นจังหวะและกวาดไปตามความยาวของลำไส้ จังหวะต่างกันในแต่ละส่วน และถูกตั้งโดย pacemaker cells คือ **interstitial cells of Cajal** โดย BER ให้ตำแหน่งที่กล้ามเนื้อหดตัวได้เมื่อมีสิ่งกระตุ้นมาซ้อน spike potentials บนช่วง depolarizing ของคลื่น",
              "ระหว่างมื้อ ลำไส้ค่อนข้างเงียบ แต่ทุกประมาณ 90 นาทีจะถูกกวาดด้วย peristaltic wave ใหญ่ที่ถูกกระตุ้นด้วยฮอร์โมน **motilin** ซึ่ง MMC นี้ทำหน้าที่แบบ housekeeping",
              "**Swallowing ถูกกระตุ้นจากส่วนกลางและประสานกับ peristaltic wave ตลอดความยาวของ esophagus จนอาหารลงถึงกระเพาะได้แม้ต้านแรงโน้มถ่วง** โดยการคลายตัวของ LES ถูกจับจังหวะให้เกิดก่อน bolus มาถึงเล็กน้อยเพื่อจำกัด reflux แต่กระนั้น gastroesophageal reflux disease ก็ยังเป็นข้อร้องเรียนทางเดินอาหารที่พบบ่อยที่สุดอย่างหนึ่ง",
              "กระเพาะรับมื้ออาหารด้วย **receptive relaxation** ที่ยอมให้ปริมาตรเพิ่มโดยความดันไม่เพิ่มมาก แล้วจึงผสม บด และควบคุมการส่งต่อไปยังส่วนถัดไป",
              "การตอบสนองด้าน motility ของลำไส้เล็กผสมอาหารกับ pancreatic juice และ bile และขับไปตามความยาวเพื่อให้สิ่งที่ย่อยแล้วสัมผัสผิว epithelium เกิดการดูดซึม",
              "สิ่งที่อยู่ใน lumen เคลื่อนช้าผ่าน colon ซึ่งเพิ่มการดึงน้ำกลับ **การขยายของ rectum ทำให้ internal anal sphincter หดตัวแบบ reflex และเกิดความอยากถ่าย และหลังฝึกขับถ่ายแล้วสามารถเลื่อนการถ่ายไปได้ด้วยการหดเกร็ง external anal sphincter โดยตั้งใจ**"
            ]
          },
          {
            "callout": "ข้อสุดท้ายของ CHAPTER SUMMARY เขียนว่าการขยาย rectum ทำให้ internal anal sphincter หดตัวแบบ reflex ซึ่งอ่านสวนทางกับหัวข้อ DEFECATION ในหน้า 12 ที่เขียนว่า sphincter นี้คลายตัวเมื่อ rectum ถูกขยาย ให้ยึดตามคำที่ใช้จริงในสไลด์หน้าที่อาจารย์ถามถึง และในการอธิบายกลไก ให้ยึดตามหัวข้อ DEFECATION",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-3--food-intake-body-weight-control": {
    "topic": "physio-3--food-intake-body-weight-control",
    "title": "การควบคุมการกินอาหารและน้ำหนักตัว (Food intake & body weight control)",
    "icon": "📘",
    "lecturer": "สัมพันธ์ ธรรมเจริญ (Thammacharoen S) ภาควิชาสรีรวิทยา คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
    "summary": "เด็คนี้ไล่จาก phenomenology ของการกิน (สัตว์เลี้ยงลูกด้วยนมกินเป็น discrete meals) ไปสู่ 4 กระบวนการใน 1 meal cycle, การควบคุมการกิน 3 ทาง (neural, metabolic, endocrine), dual-center hypothesis (VMH/LHA) และ cFos mapping, glucostatic theory, ตารางฮอร์โมน inhibitory/excitatory, lipostatic hypothesis, การวัดความอ้วน (BMI, % body fat, BCS สุนัขและแมว) และชีววิทยาของ adipose tissue จนถึง lipid droplet formation. ต้องบอกตามตรงว่าสไลด์จำนวนมากเป็นรูปกราฟหรือรูปภาพที่มีแต่หัวข้อ ไม่มีตัวหนังสืออธิบาย (meal pattern ในแพะนม, environmental temperature, reproductive cycle, adipose tissue as endocrine organ, nomogram ของ BMI, รูป BCS) และหลายสไลด์กำกับว่าเป็น Unpublished Data ดังนั้นเนื้อความที่ดึงออกมาได้จึงน้อยกว่าที่บรรยายจริงในห้อง",
    "sections": [
      {
        "heading": "The functional analysis of eating: กินเป็นมื้อ ไม่ใช่กินตลอดเวลา",
        "source": "Food intake & body weight control p.2",
        "body": [
          {
            "text": "สไลด์เปิดด้วยหัวข้อ PHENOMENOLOGY แล้ววางข้อเท็จจริงตั้งต้นว่า **EATING in mammals occurs as discrete meals** คือสัตว์เลี้ยงลูกด้วยนมกินเป็นมื้อ ๆ แยกจากกันชัดเจน"
          },
          {
            "text": "จากข้อเท็จจริงนั้นสไลด์สรุปต่อ 3 ข้อ (Therefore)"
          },
          {
            "bullets": [
              "The meal is a product of the integratory action of the brain — มื้ออาหารเป็นผลจากการทำงานประสานกันของสมอง",
              "**The meal is the functional unit of eating** — meal คือหน่วยเชิงหน้าที่ของการกิน",
              "If you understand meals, you understand eating"
            ]
          }
        ]
      },
      {
        "heading": "4 กระบวนการทางจิตวิทยาใน 1 meal cycle",
        "source": "Food intake & body weight control p.2",
        "body": [
          {
            "text": "สไลด์เขียนหัวข้อว่า (THEORETICAL) PSYCHOLOGICAL PROCESSES INVOLVED in MEALS แล้ววางแผนภาพ Meal 1 → Intermeal Interval → Meal 2 พร้อมกำกับหมายเลข (1) ถึง (4)"
          },
          {
            "bullets": [
              "(1) **HUNGER causes meal initiation** — ความหิวเป็นตัวเริ่มมื้อ",
              "(2) **OROSENSORY FOOD REWARD (\"Palatability\") stimulates eating during meals = Appetite** — ความอร่อยกระตุ้นการกินระหว่างมื้อ และสไลด์ให้เท่ากับคำว่า Appetite",
              "(3) **SATIATION causes meal end** — satiation เป็นตัวจบมื้อ",
              "(4) **POSTPRANDIAL SATIETY inhibits eating during the intermeal interval** — satiety หลังอาหารยับยั้งการกินในช่วงระหว่างมื้อ"
            ]
          },
          {
            "callout": "จุดที่ข้อสอบชอบจับคือคู่คำ SATIATION กับ SATIETY สไลด์แยกให้ชัดแล้วว่า satiation = จบมื้อ ส่วน postprandial satiety = กดการกินในช่วง intermeal interval",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Metabolism & Energy Balance: แผนภาพภาพรวมของระบบ",
        "source": "Food intake & body weight control p.2",
        "body": [
          {
            "text": "สไลด์เป็นแผนภาพ Energy input → Energy balance → Energy output โดยมีคำกำกับกระจายอยู่ในแผนภาพดังนี้"
          },
          {
            "sub": "ฝั่ง input และ output",
            "body": [
              {
                "bullets": [
                  "Energy input: Food, Water, Air",
                  "Energy output: Activities, Heat production",
                  "Catabolism และ Anabolism วางคร่อมกลางแผนภาพ",
                  "Nutrients catabolism → ATP",
                  "Anabolism ชี้ไปที่ DNA & RNA, Protein & lipid"
                ]
              }
            ]
          },
          {
            "sub": "ตัวควบคุมที่วางอยู่ในแผนภาพเดียวกัน",
            "body": [
              {
                "bullets": [
                  "Eating behavior เชื่อมกับ Brain, Sense organs และ GI system",
                  "เส้นเชื่อมกำกับว่า Endocrine, GI-Neuro, Sense-Neuro",
                  "Body weight เชื่อมกับ Adipose tissue"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์นี้เป็นแผนภาพล้วน ไม่มีประโยคอธิบายกลไกของแต่ละลูกศร สไลด์ไม่ได้บอกว่าแต่ละเส้นทำงานอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Daily meal pattern ในหนูและในคน",
        "source": "Food intake & body weight control p.2",
        "body": [
          {
            "text": "สไลด์เอากรอบทฤษฎี 4 ขั้นตอนไปทาบกับข้อมูลจริง เฉพาะรูปหนู (Daily meal pattern of one representative rat, Strubbe 2002) ที่กำกับ Meal 1 / Intermeal int / Meal 2 พร้อมเลข (1) (2) (3) (4) ส่วนรูปคน (Daily meal pattern in human) มีแต่เลข (1) (2) (3) (4) อย่างเดียว"
          },
          {
            "callout": "ทั้งสองสไลด์เป็นกราฟ ไม่มีตัวเลขหรือคำบรรยายเพิ่มในเนื้อความ สไลด์ไม่ได้บอกว่าหนูหรือคนกินกี่มื้อต่อวัน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Meal pattern ในแพะนม: แยก light phase กับ dark phase",
        "source": "Food intake & body weight control p.3",
        "body": [
          {
            "text": "มี 2 สไลด์คู่กันคือ Light phase (day) meal pattern in dairy goat และ Dark phase (night) meal pattern in dairy goat กำกับที่มาว่า ThammacharoenS15, Unpublished Data"
          },
          {
            "callout": "ทั้งสองสไลด์เป็นกราฟล้วน ไม่มีข้อความสรุปว่ากลางวันกับกลางคืนต่างกันอย่างไร สไลด์ไม่ได้บอก ต้องฟังคำอธิบายจากอาจารย์ในห้อง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "The controls of eating: เริ่ม กินต่อ และหยุด",
        "source": "Food intake & body weight control p.3",
        "body": [
          {
            "text": "สไลด์วางโครงการควบคุมการกินเป็น 3 จังหวะ **Start eating → Continue eating → Stop eating**"
          },
          {
            "text": "และแยกชนิดของการควบคุมเป็น 3 แบบ"
          },
          {
            "bullets": [
              "**Endocrine control**",
              "**Neural control**",
              "**Metabolic control**"
            ]
          },
          {
            "text": "โครงสร้างที่เข้ามาเกี่ยวข้องตามที่สไลด์เขียนไว้"
          },
          {
            "bullets": [
              "Sensory Organs",
              "Nervous System แบ่งเป็น Motor part, Integrator part, Sensory part",
              "GI tract",
              "Adipose tissue"
            ]
          },
          {
            "callout": "สไลด์ลิสต์ไว้ตามลำดับ Endocrine → Neural → Metabolic แต่เด็คเดินเรื่องคนละลำดับ คือ Neural control of eating (p.3–5) → Metabolic control of eating-Glucostatic Theory (p.5–6) → Endocrine control of eating (p.6) ดังนั้นตารางฮอร์โมนมาท้ายสุด ไม่ใช่หัวข้อแรก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Neural control: the dual-center hypothesis (VMH กับ LHA)",
        "source": "Food intake & body weight control p.3",
        "body": [
          {
            "text": "สไลด์เรียกว่า The classic satiety & hungry center (the dual-center hypothesis) อ้าง King, 2006"
          },
          {
            "bullets": [
              "The lesion encompassing the VMH resulted in **hyperphagia and obesity**",
              "The stimulation of VMH resulted in **aphagia**",
              "ดังนั้น **VMH = Satiety center**",
              "The lesion encompassing the LHA resulted in **aphagic and loss body weight**",
              "ดังนั้น **LHA = Hunger center**"
            ]
          },
          {
            "callout": "บรรทัดสุดท้ายของสไลด์เขียนเองว่า **Today, the Dual-center hypothesis is too simple to explain eating behavior** อย่าตอบว่า VMH กับ LHA อธิบายพฤติกรรมการกินได้ครบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Neural control: cFos mapping ของสมองที่ตอบสนองต่อการกิน",
        "source": "Food intake & body weight control p.4",
        "body": [
          {
            "text": "สไลด์แรกของชุดนี้ชื่อ The Hypothalamus: Forebrain control of eating เป็นรูปล้วน ไม่มีข้อความอธิบาย จากนั้นเป็นชุด Temporal pattern of eating induced cFos สองสไลด์ อ้าง Johnstone, 2006"
          },
          {
            "sub": "ชุดที่ 1",
            "body": [
              {
                "bullets": [
                  "A: Nucleus tractus solitarius (NTS)",
                  "B: Area postrema (AP)",
                  "C: Locus coeruleus (LC)",
                  "D: C1/A1 region",
                  "F: cFos at AP & NTS"
                ]
              }
            ]
          },
          {
            "sub": "ชุดที่ 2 (hypothalamus)",
            "body": [
              {
                "bullets": [
                  "A: Lateral hypothalamus (LH)",
                  "B: Dorsomedial hypothalamus (DMH)",
                  "C: Arcuate nucleus (Arc)",
                  "D: Ventromedial hypothalamus (VMH)",
                  "E: Supraoptic nucleus (SON)",
                  "รวมถึง Paraventricular nucleus (PVN)",
                  "F: Open bar is pool -30 and 0 min, Black bars are pool 60 and 90 min"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อ nucleus กับป้ายกำกับกราฟ ไม่ได้เขียนว่าแต่ละที่ cFos ขึ้นหรือลงเท่าไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Fasting induced cFos ถูก reverse ด้วย refeeding",
        "source": "Food intake & body weight control p.4",
        "body": [
          {
            "text": "หัวสไลด์เขียนว่า **Fasting induced cFos in mice is reversed by refeeding** อ้าง Becskei et al. บริเวณที่แสดงคือ Paraventricular nucleus และ Arcuate nucleus"
          },
          {
            "bullets": [
              "รูป Arc เปรียบเทียบสภาวะ fasted กับ refed",
              "แกน y ของกราฟคือ c-Fos IR cells / slice (สเกล 0 ถึง 50)",
              "สไลด์กำกับ n = 174 fasted และ n = 170 refed พร้อมเครื่องหมาย *** ระหว่างสองกลุ่ม"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่า n ที่เขียนไว้นับเป็นหน่วยอะไร (เซลล์ สไลซ์ หรือสัตว์) และไม่ได้ระบุค่า p ที่ *** แทน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Eating behavior ถูกควบคุมจากหลายระบบพร้อมกัน",
        "source": "Food intake & body weight control p.5",
        "body": [
          {
            "text": "สไลด์วาง Eating behavior ไว้ตรงกลาง แล้วโยงปัจจัยรอบตัวพร้อมระบุสมองส่วนที่เกี่ยวข้องของแต่ละปัจจัย"
          },
          {
            "bullets": [
              "**Homeostasis control: Hypothalamus & NTS** (สไลด์ใส่เครื่องหมายคำถามไว้ท้ายหัวข้อนี้)",
              "**Hedonic control: Nac & PFC**",
              "**Stress-Emotion: PVN & Amygdala**",
              "**Environmental temperature: MnPO, Arc**",
              "**Circadian rhythm: SCN, DMH & LH**",
              "**Reproductive cycle: VMH & MPO, PVN, NTS**",
              "NeuroEndocrine related Eating disorders / Starvation & Over eating: ACN, PVN",
              "Aging และ Growth วางอยู่ในแผนภาพด้วย แต่สไลด์ไม่ได้ระบุสมองส่วนที่เกี่ยวข้องของสองอันนี้"
            ]
          },
          {
            "text": "ถัดจากแผนภาพมีสไลด์ Neural control of eating: Environmental temperature และ Neural control of eating: Reproductive cycle (กำกับ ThammacharoenS08a) ทั้งสองเป็นรูปล้วน ไม่มีเนื้อความ"
          },
          {
            "callout": "แผนภาพนี้คือคำตอบของประโยคที่ว่า dual-center hypothesis ง่ายเกินไป เพราะการกินถูกดึงด้วย homeostasis, hedonic, stress, อุณหภูมิ, circadian และ reproductive cycle พร้อมกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Metabolic control: Glucostatic theory และ TDBG",
        "source": "Food intake & body weight control p.5",
        "body": [
          {
            "text": "**Small transient declines in blood glucose (TDBG) before meals may stimulate hunger** คือระดับกลูโคสในเลือดตกลงเล็กน้อยชั่วคราวก่อนมื้ออาหาร อาจกระตุ้นความหิว (สไลด์สะกดตัวย่อสลับไปมาทั้ง TDBG และ TGBG) อ้าง Campfield & Smith, Physiol Rev 83: 25, 2002 และมีข้อมูลกำกับ SuwannapapornP17a"
          },
          {
            "bullets": [
              "รูปที่แสดงคือ Transient premeal decline in blood glucose ในหนู",
              "**This is a very small event – too small to produce metabolic effects** คือเป็นเหตุการณ์เล็กมากจนไม่พอจะสร้างผลทาง metabolic",
              "**Blood glucose must be measured continuously on line to see it** ต้องวัดกลูโคสแบบต่อเนื่องเท่านั้นจึงจะเห็นปรากฏการณ์นี้"
            ]
          },
          {
            "callout": "ประโยค too small to produce metabolic effects คือกับดัก ห้ามตอบว่า TDBG ทำให้เกิดผลทาง metabolic สไลด์บอกตรงข้าม มันเล็กเกินไป แต่ยังพอเป็นสัญญาณกระตุ้นความหิวได้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "หลักฐานฝั่งตรงข้าม: การป้องกัน TDBG ทำให้มื้ออาหารเลื่อนออกไป",
        "source": "Food intake & body weight control p.6",
        "body": [
          {
            "text": "สไลด์ทวนประโยคเดิมแล้วเติมประโยคสำคัญว่า **Preventing TDBG delays meal onset** คือถ้าไม่ให้เกิดการตกของกลูโคสชั่วคราวก่อนมื้อ การเริ่มมื้อจะช้าลง อ้าง Campfield & Smith, Physiol Rev 83: 25, 2002"
          },
          {
            "callout": "คู่ประโยค TDBG กระตุ้นความหิว กับ preventing TDBG delays meal onset คือหลักฐานสองทางของ glucostatic theory ที่ควรจำคู่กัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Endocrine control of eating: ตารางฮอร์โมนแยก Inhibitory กับ Excitatory",
        "source": "Food intake & body weight control p.6",
        "body": [
          {
            "text": "สไลด์ทำเป็นตาราง 2 คอลัมน์คือ Inhibitory และ Excitatory โดยระบุอวัยวะต้นทางกำกับแต่ละฮอร์โมน อ้าง Geary, Physiol Behav 81: 719, 2004"
          },
          {
            "sub": "ฝั่ง Inhibitory",
            "body": [
              {
                "bullets": [
                  "Intestine: **CCK**, Apolipoprotein A-IV, **Glucagon-like peptide 1**, **Peptide YY(3-36)**, Enterostatin",
                  "Adipose Tiss.: **Leptin**",
                  "Pancreas: Pancreatic glucagon, **Insulin**, **Amylin**, Somatostatin",
                  "Stomach: Gastrin-Releasing Peptide, Neuromedin B",
                  "Ovaries: **Estradiol**"
                ]
              }
            ]
          },
          {
            "sub": "ฝั่ง Excitatory",
            "body": [
              {
                "bullets": [
                  "Stomach: **Ghrelin**",
                  "Testes: **Testosterone**"
                ]
              }
            ]
          },
          {
            "callout": "ข้อความที่ดึงจากสไลด์เป็นตาราง 2 คอลัมน์ที่บรรทัดสลับกัน การจัดฝั่งข้างบนอ่านจากการเรียงคู่ของบรรทัด (Intestine CCK คู่กับ Stomach Ghrelin, Apolipoprotein A-IV คู่กับ Testes Testosterone) ก่อนสอบควรเปิดสไลด์จริงเทียบอีกรอบว่าคอลัมน์ตรงกัน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Leptin และ insulin กับ DIO diet",
        "source": "Food intake & body weight control p.6",
        "body": [
          {
            "text": "หัวข้อ Metabolic & Endocrine controls of eating โยงมาที่ **Leptin & insulin** (กำกับ SchwartzMW05a) และมีสไลด์การทดลองเปรียบเทียบอาหาร 2 สูตร (กำกับ ThammacharoenS24, Unpublished)"
          },
          {
            "bullets": [
              "**Control: Chow, 3.04 kcal/g**",
              "**DIO diet: Hypercaloric diet (Hi fat & carb diets) 4.65 kcal/g**"
            ]
          },
          {
            "callout": "สไลด์ให้แค่ค่าพลังงานต่อกรัมของอาหารสองสูตร ไม่ได้เขียนผลการทดลองเป็นตัวหนังสือ สไลด์ไม่ได้บอกว่า leptin หรือ insulin เปลี่ยนไปเท่าไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Obesity & energy homeostasis: สมการสมดุลพลังงาน",
        "source": "Food intake & body weight control p.7",
        "body": [
          {
            "text": "**ENERGY BALANCE EQUATION: ENERGY IN − ENERGY OUT = ENERGY STORED**"
          },
          {
            "bullets": [
              "ในสัตว์โตเต็มวัย สไลด์เขียนว่า **Food intake − (MR, physical work) = Δ Fat mass**",
              "**Obese individuals must have a history of positive energy balance (Energy input > Energy output)** คือคนหรือสัตว์ที่อ้วนต้องเคยมีช่วงที่พลังงานเข้ามากกว่าออก",
              "**They need not have present or ongoing positive energy balance** คือไม่จำเป็นว่าตอนนี้ยังต้องอยู่ในภาวะพลังงานเกินอยู่"
            ]
          },
          {
            "callout": "สองบรรทัดสุดท้ายคือประเด็นที่ตั้งใจให้จำ ความอ้วนบอกถึงอดีตของสมดุลพลังงาน ไม่ได้แปลว่าปัจจุบันยังกินเกินอยู่",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "The long term control: lipostatic hypothesis",
        "source": "Food intake & body weight control p.7",
        "body": [
          {
            "text": "สไลด์วางแผนภาพ Stored Energy (Low – Balance – High) โยงกับ Food intake ภายใต้หัวข้อ Energy homeostasis อ้าง WoodsSC et al., 1998"
          },
          {
            "bullets": [
              "**The lipostatic hypothesis** คือสมมติฐานที่เชื่อมปริมาณอาหารที่กินเข้ากับปริมาณพลังงานสะสม (fat mass และ leptin/insulin)",
              "**Leptin & insulin are lipostatic hormone and the secretion is proportion to the size of adipose mass** คือการหลั่งเป็นสัดส่วนกับขนาดของมวลไขมัน"
            ]
          },
          {
            "callout": "สไลด์จบบรรทัดด้วยคำว่า HOWEVER ตัวใหญ่แล้วไม่มีข้อความต่อ สไลด์ไม่ได้บอกว่าข้อยกเว้นหรือข้อโต้แย้งของ lipostatic hypothesis คืออะไร ตรงนี้ต้องได้จากคำบรรยายในห้อง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "What is obesity: นิยามและวิธีวัด (BMI)",
        "source": "Food intake & body weight control p.7",
        "body": [
          {
            "text": "**Obesity is an unusual or abnormal amount of body fat (= adiposity)** สไลด์ให้วิธีวัด 2 แบบคือ Body Mass Index (BMI) และ % Body fat content (= adiposity) พร้อม Nomogram for BMI (Bray, 1978)"
          },
          {
            "bullets": [
              "**BMI = mass / height², usually kg/m²**",
              "**> 25 = Overweight**",
              "**> 30 = Obese**",
              "**> 40 = Morbidly obese**"
            ]
          }
        ]
      },
      {
        "heading": "Body Condition Score ในสุนัขและแมว",
        "source": "Food intake & body weight control p.8",
        "body": [
          {
            "text": "มีสไลด์ตั้งคำถามซ้ำสองสไลด์ว่า **Body Condition Score in dog: 5, 6, 7 or 9 ?** โดยใช้แผนภูมิของ Purina กำกับที่มาไว้ว่า CanineBCSPurina14a และ FelineBCSPurina14a รวมถึง GossellinJ07a"
          },
          {
            "callout": "สไลด์ตั้งคำถามค้างไว้เป็นรูปให้ดูและตอบในห้อง สไลด์ไม่ได้เขียนคำตอบว่าเป็น 5, 6, 7 หรือ 9 และไม่ได้ให้เกณฑ์ของแต่ละสกอร์เป็นตัวหนังสือ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Adipose tissue: ชนิดและการเก็บไขมัน",
        "source": "Food intake & body weight control p.8",
        "body": [
          {
            "sub": "Types of adipose tissue",
            "body": [
              {
                "bullets": [
                  "**White adipose tissue (WAT)** แบ่งเป็น Subcutaneous WAT และ Visceral WAT",
                  "**Brown adipose tissue (BAT)**"
                ]
              }
            ]
          },
          {
            "sub": "Fat or lipid storage",
            "body": [
              {
                "bullets": [
                  "**WAT is the largest site of fat storage**",
                  "**Almost all mammalian cells have ability to store fat as triacylglycerol (TG) in lipid droplet (LD)** และสไลด์เรียกภาวะนี้ว่า **Ectopic fat storage**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์อ้าง Gregoire et al 1998 และ Rosen and Spiegelman, 2000"
          }
        ]
      },
      {
        "heading": "Adipose tissue: lipogenesis, TG synthesis และ lipolysis",
        "source": "Food intake & body weight control p.9",
        "body": [
          {
            "text": "สไลด์แบ่งการควบคุม lipid metabolism เป็น 2 หัวข้อใหญ่"
          },
          {
            "bullets": [
              "**Metabolic control of lipid metabolism** โยงกับ Energy balance",
              "**Neuroendocrine control of lipid metabolism** ได้แก่ **Insulin & Epinephrine** และ **Autonomic nervous system**"
            ]
          },
          {
            "text": "อ้างอิงหลายฉบับ (LargeV04a, DuncanRE07a, NyeC08a, JaworskiK07a, WangS08a และ ZechnerR09a) และมีสไลด์ Adipose tissue functions: endocrine organ ที่เป็นรูปล้วน อ้าง Flier 2003 กับ Trayhurn and Beattie 2001"
          },
          {
            "callout": "สไลด์ endocrine organ มีแต่หัวข้อกับรูป ไม่มีรายชื่อฮอร์โมนที่ adipose tissue หลั่งเป็นตัวหนังสือในเนื้อความ สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Mature adipocyte และการสร้าง lipid droplet",
        "source": "Food intake & body weight control p.9",
        "body": [
          {
            "sub": "Lipid droplet (LD) formation",
            "body": [
              {
                "bullets": [
                  "**Triacylglycerol synthesis between the ER membranes** คือสังเคราะห์ TG ระหว่างเยื่อของ ER",
                  "**Budding of mature LD**",
                  "**LD maturation** พร้อม LD-associated protein"
                ]
              }
            ]
          },
          {
            "sub": "LD-associated protein (PAT-domain proteins)",
            "body": [
              {
                "bullets": [
                  "**Perilipin**",
                  "**ADRP หรือ adipophilin**",
                  "**TIP47**"
                ]
              }
            ]
          },
          {
            "text": "อ้าง MartinS, 2006 และสไลด์ท้ายเด็คมีรายการอ้างอิงยาว (BernotieneE06a, LargoR08a, MorrisonCD08a, MyerMG08a, HillJ08a, MoschosS02a, SchwartzMW00a, TrayhurnP01a)"
          }
        ]
      }
    ]
  },
  "physio-3--gastrointestinal-physiology-final": {
    "topic": "physio-3--gastrointestinal-physiology-final",
    "title": "สรีรวิทยาระบบทางเดินอาหารของสัตว์ (Gastrointestinal Physiology)",
    "icon": "📗",
    "lecturer": "ศ. น.สพ. ดร. กฤษ อังคนาพร",
    "summary": "เด็คหลักของ GI physiology ภาคปลาย 59 สไลด์ ไล่ตั้งแต่การเปรียบเทียบทางเดินอาหารตามชนิดอาหารที่กิน โครงสร้าง histology การควบคุมด้วย ENS กับ ANS ฮอร์โมนทางเดินอาหาร การเคลื่อนไหว (motility) การหลั่ง (secretion) ของกระเพาะ ตับอ่อน ตับ และลำไส้ ต่อด้วยการย่อยและการดูดซึม carbohydrate protein fat vitamins แล้วปิดท้ายด้วย microflora probiotic prebiotic และ pathophysiology (vomiting jaundice diarrhea). สไลด์เกือบครึ่งเป็นรูปภาพ แผนภาพ หรือมีแต่เลขหน้าโดยไม่มีข้อความ (เช่น p.9 p.10 p.24 p.53) จึงสรุปได้เฉพาะสไลด์ที่มีตัวอักษรจริง ส่วน p.54 เป็นแผนภาพที่มีเนื้อหาอ่านได้จริง (ตารางสรุปการย่อยตั้งแต่ mouth ถึง blood และ Calcium transport ใน duodenal cells) ซึ่งสรุปไว้ในหัวข้อ Type of Absorption แล้ว และเนื้อหาบางเรื่องที่สไลด์เกริ่นไว้แต่ไม่ได้อธิบายต่อ ผมระบุไว้ว่าสไลด์ไม่ได้บอก. หน้าแรกยังเป็นสไลด์ธุรการเรื่องตารางเรียนและการวัดผล.",
    "sections": [
      {
        "heading": "การวัดผลและหนังสืออ่านเพิ่มเติม",
        "source": "Gastrointestinal Physiology (final) p.2",
        "body": [
          {
            "text": "สไลด์นี้เป็นสไลด์ธุรการของรายวิชา ภาคปลาย ปีการศึกษา 2566 (CU VET 86)"
          },
          {
            "bullets": [
              "Lecture 12 ชม แบ่งเป็น **90% สอบข้อเขียนปลายภาค + 10% Home work**",
              "ข้อสอบเป็น **MCQ 4 ตัวเลือก**",
              "**คะแนนรวม = 40% ของ Vet Physio 3**",
              "มี Lab GI physio (Pig & Dog), Lab GI physio (Sheep) และ Lab GI discussion แทรกในตารางบรรยาย"
            ]
          },
          {
            "sub": "หนังสืออ่านเพิ่มเติมที่อาจารย์ให้ไว้",
            "body": [
              {
                "bullets": [
                  "Cunningham, J.G. and Klein, B.G. Textbook of Veterinary Physiology 5th edition 2012",
                  "Ganong Review of Medical Physiology 23rd edition 2010 (now 25 ed 2016)",
                  "Johnson, L.R. Gastrointestinal Physiology 9th edition, Mosby Physiology series 2018",
                  "ชัยวัฒน์ ต่อสกุลแก้ว สรีรวิทยาทางเดินอาหาร คณะวิทยาศาสตร์ มหาวิทยาลัยมหิดล 2nd edition 2542",
                  "ดวงพร ทองงาม สรีรวิทยาระบบทางเดินอาหารและการประยุกต์ทางคลินิก คณะแพทยศาสตร์ จุฬาฯ 2555",
                  "e-book จุฬาลงกรณ์มหาวิทยาลัย: สรีรวิทยากระเพาะสัตว์เคี้ยวเอื้อง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ทางเดินอาหารเปลี่ยนไปตามชนิดอาหารที่กิน",
        "source": "Gastrointestinal Physiology (final) p.3",
        "body": [
          {
            "text": "สไลด์เปิดด้วยประโยค **Gut health indicates Animal health** แล้วเทียบลักษณะทางเดินอาหารตามชนิดอาหาร"
          },
          {
            "sub": "Herbivore (กินพืช)",
            "body": [
              {
                "bullets": [
                  "ฟันมีลักษณะ **กว้างและนูนเป็นสัน** สำหรับบดอาหาร",
                  "**ลำไส้เล็กยาว** สำหรับย่อยอาหารพืชได้นาน ๆ"
                ]
              }
            ]
          },
          {
            "sub": "Carnivore (กินเนื้อ)",
            "body": [
              {
                "bullets": [
                  "มีฟันหน้า (incisor) และเขี้ยว (canine) ที่แหลม",
                  "ฟันเหมาะสำหรับ **แทง ฉีก และเคี้ยว** อาหาร",
                  "**ลำไส้เล็กสั้น**"
                ]
              }
            ]
          },
          {
            "sub": "Omnivore (กินทั้งพืชและเนื้อ)",
            "body": [
              {
                "bullets": [
                  "ฟันหน้าสำหรับกัด เขี้ยวไว้สำหรับฉีก",
                  "ฟันกรามหน้า (premolar) สำหรับบด ฟันกรามหลัง (molar) สำหรับเคี้ยว",
                  "**ลำไส้เล็กยาวปานกลาง**",
                  "สไลด์เขียนว่ามนุษย์ถือเป็น Cucinivore (กินเนื้อและพืชที่ปรุงสุก)"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.4 พูดถึงเอนไซม์ย่อยแป้งของสัตว์กินเนื้อเทียบกับสัตว์อื่น และหลัก Rule Size = Function ของ Stomach, Small Intestine, Cecum, Large Intestine แต่เป็นรูปภาพล้วน ไม่มีตัวเลขหรือคำอธิบายเป็นตัวอักษร สไลด์ไม่ได้บอกรายละเอียด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "GI tract คืออะไร และหน้าที่หลัก 4 อย่าง",
        "source": "Gastrointestinal Physiology (final) p.5",
        "body": [
          {
            "bullets": [
              "Gastrointestinal tract (GI tract, Bowel หรือ Gut) คือ **The largest hollow organ in animal's body**",
              "**หน้าที่หลัก 4 อย่าง: Motility, Secretion, Digestion และ Absorption**",
              "แบ่งใหญ่เป็น Ruminants และ non-ruminant animals"
            ]
          },
          {
            "sub": "Types of Digestive Systems (ตัวอย่างสัตว์ตามสไลด์)",
            "body": [
              {
                "bullets": [
                  "**Monogastrics**: Chickens, Turkeys, Pigs, Dogs, Cats, Ostrich",
                  "**Ruminants**: Beef Cattle, Dairy Cattle, Goats, Sheep, Deer",
                  "**Hind Gut Fermentors**: Horses, Rabbits"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Comparison of GI capacity",
        "source": "Gastrointestinal Physiology (final) p.5",
        "body": [
          {
            "text": "สไลด์เทียบสัดส่วนความจุของทางเดินอาหารในสามชนิดสัตว์ ตัวเลขนี้เป็นตัวเลขที่ควรจำเพราะสะท้อนตำแหน่งที่เกิด fermentation"
          },
          {
            "bullets": [
              "**Cow: 71% ของ GI capacity อยู่ที่ Rumen** และ 11% อยู่ที่ colon และ rectum",
              "**Horse: 8.5% อยู่ที่ stomach แต่ 61.3% อยู่ที่ colon และ rectum**",
              "**Pig: 30% อยู่ที่ stomach และ 37% อยู่ที่ colon และ rectum**"
            ]
          }
        ]
      },
      {
        "heading": "โครงสร้างผิวดูดซึมและเซลล์เฉพาะบน villi",
        "source": "Gastrointestinal Physiology (final) p.7-8",
        "body": [
          {
            "text": "หัวข้อสไลด์คือ Enhanced Surface Area for Increased Nutrient Absorption โดยอาศัย **Intestinal villi** และ **Brush border** ของ Intestinal Epithelial Cell"
          },
          {
            "sub": "Specialized Cells Lining Villi",
            "body": [
              {
                "bullets": [
                  "**Endocrine cell**: หลั่งฮอร์โมนเข้าสู่ bloodstream หรือ local cells ตัวอย่างที่สไลด์ยกคือ **CCK, Secretin** เป็นต้น",
                  "**Paneth cell**: มี secretory granules ที่มีคุณสมบัติ **antimicrobial** (anti-microbial compounds)"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.6 (Histology of the GUT) p.9 และ p.10 เป็นภาพล้วน ไม่มีข้อความ จึงไม่มีเนื้อหาให้สรุป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Structure-Function Adaptation ของ GI tract",
        "source": "Gastrointestinal Physiology (final) p.11",
        "body": [
          {
            "bullets": [
              "Specific function of each section",
              "Local Gut-associated lymphoid system",
              "Sphincter and Muscle layer",
              "Intrinsic nerve plexus",
              "Absorptive capacity",
              "**Auto-digestion prophylaxis** คือกลไกกันไม่ให้ทางเดินอาหารย่อยตัวเอง"
            ]
          },
          {
            "sub": "Auto-digestion prophylaxis ประกอบด้วย",
            "body": [
              {
                "bullets": [
                  "**Alkaline mucus secretion**",
                  "**Inactive enzymes** (หลั่งออกมาในรูปที่ยังไม่ทำงาน)",
                  "**Tight junction**",
                  "**Mucosal cell regeneration**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์หน้าเดียวกันมีเคส 4 month Male Labrador - vomiting เป็นหัวเรื่องรูป แต่ไม่มีรายละเอียดเคสเป็นตัวอักษร สไลด์ไม่ได้บอกว่าเคสนี้วินิจฉัยหรือลงเอยอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Blood flow to various organs",
        "source": "Gastrointestinal Physiology (final) p.12",
        "body": [
          {
            "text": "ตารางเทียบเลือดที่ไปเลี้ยงอวัยวะ จุดที่ต้องจำคือ **splanchnic circulation รับ 25% ของ cardiac output ซึ่งมากที่สุดในตาราง ทั้งที่มีน้ำหนักเพียง 5.7% ของ body weight**"
          },
          {
            "bullets": [
              "Splanchnic: 25 %C.O., 1,400 ml/min/organ, 5.7 % of BW",
              "Skeletal m: 20 %C.O., 1,200 ml/min, 40.0 % of BW",
              "Kidneys: 20 %C.O., 1,100 ml/min, 6.5 % of BW",
              "Brain: 15 %C.O., 750 ml/min, 2.0 % of BW",
              "Skin: 6 %C.O., 350 ml/min, 10.0 % of BW",
              "Heart: 6 %C.O., 300 ml/min, 0.5 % of BW"
            ]
          }
        ]
      },
      {
        "heading": "Blood circulation ของ GI tract",
        "source": "Gastrointestinal Physiology (final) p.13",
        "body": [
          {
            "text": "**Autoregulation of splanchnic vessels อยู่ในช่วง 70-170 mmHg**"
          },
          {
            "sub": "เส้นทางเลือดตามผังในสไลด์",
            "body": [
              {
                "bullets": [
                  "ขาเข้า: Celiac artery, Cranial mesenteric a, Caudal mesenteric a ไปยัง small arteries in serosa muscles แล้วต่อไป mucosal arterioles และ capillary plexus in villi and glands",
                  "ขาออก: venules ใน L. propria และ submucosa ไป small veins in serosa ไป celiac vein, cranial mesenteric v, caudal mesenteric v",
                  "ทั้งหมดรวมเข้า **Hepatic portal vein ไป Liver แล้วออกทาง Hepatic v เข้า Caudal vena cava กลับสู่ Heart**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Enteric nervous system (ENS)",
        "source": "Gastrointestinal Physiology (final) p.13",
        "body": [
          {
            "bullets": [
              "**Myenteric (Auerbach's Plexus)**: อยู่ระหว่าง longitudinal และ circular smooth muscle ทำหน้าที่ **control GI movements**",
              "**Submucosal (Meissner's Plexus)**: อยู่ใน submucosal layer ทำหน้าที่ **control GI secretion, absorption, blood flow**"
            ]
          },
          {
            "callout": "สไลด์ยกโรค ลำไส้ใหญ่โป่งพองแต่กำเนิด (Hirschsprung's disease) ขึ้นมาคู่กับหัวข้อ ENS แต่ไม่ได้อธิบายกลไกหรืออาการไว้ สไลด์ไม่ได้บอก",
            "kind": "flag"
          },
          {
            "text": "แผนภาพหน้าเดียวกันมีคำ Nodose ganglion, Solitary nucleus, Dorsal Root Ganglia, Vagus nerve พร้อมกำกับ Ach และ NE และคำว่า inhibitory กับ stimulatory แต่ไม่มีคำบรรยายประกอบ"
          }
        ]
      },
      {
        "heading": "Autonomic nervous system (ANS) ที่ควบคุม GI",
        "source": "Gastrointestinal Physiology (final) p.14",
        "body": [
          {
            "sub": "Parasympathetic control: Craniosacral part",
            "body": [
              {
                "bullets": [
                  "**Cranial nerve 3, 7, 9, 10 และ Pelvic nerve**",
                  "Supply to M. mucosae, secretory และ endocrine cell",
                  "**Mainly stimulate GI contraction and secretion**"
                ]
              }
            ]
          },
          {
            "sub": "Sympathetic control: Thoracolumbar part",
            "body": [
              {
                "bullets": [
                  "Sympathetic ganglion, Celiac ganglion และ Hypogastric plexus",
                  "**Relaxation of circular and longitudinal muscle**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Receptors ของ GI tract",
        "source": "Gastrointestinal Physiology (final) p.15",
        "body": [
          {
            "text": "หัวข้อสไลด์คือ LOCAL AND CENTRAL REFLEX PATHWAYS IN THE GASTROINTESTINAL SYSTEM"
          },
          {
            "bullets": [
              "**Mechanoreceptors และ chemoreceptors** ตอบสนองต่อ **stretch, osmolarity และ pH**",
              "ตอบสนองต่อ presence of substrate และ end products of digestion",
              "แล้วเริ่ม reflexes ที่ **activate หรือ inhibit digestive glands** และ **mix lumen contents แล้วเคลื่อนไปข้างหน้า**"
            ]
          }
        ]
      },
      {
        "heading": "Endocrine control of GI functions",
        "source": "Gastrointestinal Physiology (final) p.16",
        "body": [
          {
            "bullets": [
              "**GI เป็น largest and most complex endocrine system in the body**",
              "สร้างโดย **amine-precursor-uptake-decarboxylase cells (APUD cells)** ที่กระจายอยู่ตาม gut mucosa",
              "การหลั่งฮอร์โมนเกิดขึ้นเพื่อตอบสนองต่อ **chemical stimuli บน mucosa** และ **neural reflex**",
              "**Hormones: no feedback inhibition of that hormone**",
              "มี Paracrine control ร่วมด้วย"
            ]
          },
          {
            "text": "**GI hormones ทุกตัวเป็นสารพวก peptides** และ GI peptides แบ่งได้เป็น Endocrines (hormones), Paracrines และ Neurocrines (neurotransmitters)"
          }
        ]
      },
      {
        "heading": "เกณฑ์ที่สารหนึ่งจะเรียกว่าเป็น GI hormone",
        "source": "Gastrointestinal Physiology (final) p.17",
        "body": [
          {
            "bullets": [
              "**หลั่งเมื่อถูกกระตุ้นทางสรีรวิทยา** เช่น การกินอาหาร",
              "**สารนั้นต้องแสดงผลได้แม้มีการตัดเส้นประสาท**",
              "**ต้องแยกสารดังกล่าวออกมาได้ และเมื่อฉีดกลับเข้าไปต้องแสดงผลได้เช่นเดิม**",
              "**ต้องรู้โครงสร้างทางเคมีที่แน่นอน**"
            ]
          },
          {
            "text": "เส้นทางของ GI hormone ตามผังคือ release จาก endocrine cells ใน mucosa ของ stomach และ intestine ไปสู่ **portal circulation ผ่าน liver ไป heart แล้วจึงกลับมาออกฤทธิ์ที่ digestive system**"
          }
        ]
      },
      {
        "heading": "กินอาหารหนึ่งครั้งกระตุ้นสามกลไกพร้อมกัน",
        "source": "Gastrointestinal Physiology (final) p.17",
        "body": [
          {
            "sub": "Endocrine mechanism",
            "body": [
              {
                "text": "ปล่อย transmitter (เช่น peptide) เข้าสู่เลือด: **Protein กระตุ้น antral G cells ให้หลั่ง gastrin เข้า blood ไปที่ stomach (parietal cells) ได้ H+**"
              }
            ]
          },
          {
            "sub": "Neural mechanism",
            "body": [
              {
                "text": "กระตุ้นเส้นประสาทและ neurotransmitter ที่มีผลต่อ secretory หรือ motor activity: **smell of food กระตุ้น vagus nerve หลั่ง acetylcholine ไปที่ parietal cells ได้ H+**"
              }
            ]
          },
          {
            "sub": "Paracrine mechanism",
            "body": [
              {
                "text": "transmitter ถูกปล่อยจาก sensor cell แล้วออกฤทธิ์ต่อเซลล์ข้างเคียงโดยไม่เข้าเลือดและไม่ผ่านเส้นประสาท: **enterochromaffin-like (ECL) cells หลั่ง histamine ไปที่ parietal cells ได้ H+**"
              }
            ]
          },
          {
            "callout": "ประโยคปิดของสไลด์: These responses never occur as isolated events, they rather are part of an integrated response that results in food digestion and absorption",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "GI peptides สามประเภทและวิธีเดินทาง",
        "source": "Gastrointestinal Physiology (final) p.18",
        "body": [
          {
            "bullets": [
              "**Endocrines หรือ hormones**: หลั่งเข้าสู่กระแสเลือด ไปเนื้อเยื่อเป้าหมาย จับกับตัวรับ แล้วออกฤทธิ์",
              "**Paracrines**: หลั่งจาก endocrine cells แล้ว diffuse ผ่านช่องว่างระหว่างเซลล์ (extracellular space) ถึงอวัยวะเป้าหมาย",
              "**Neurocrines หรือ neurotransmitters**: หลั่งจากเซลล์ประสาทใกล้เนื้อเยื่อเป้าหมาย diffuse ผ่าน synaptic cleft เข้าสู่เซลล์เป้าหมาย"
            ]
          }
        ]
      },
      {
        "heading": "Gastrin (Gastrin-Cholecystokinin family)",
        "source": "Gastrointestinal Physiology (final) p.18",
        "body": [
          {
            "text": "**Gastrin สร้างจาก G-cell ใน Antral และ Duodenal mucosa**"
          },
          {
            "sub": "Effect ของ gastrin ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "**Increase gastric secretion**",
                  "Increase pancreatic enzyme secretion",
                  "Increase Motility of Antrum",
                  "Increase Splanchnic blood flow",
                  "**Close lower esophageal sphincter**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์เสริมว่า **Gastrin stimulates acid secretion, release of histamine, and regulates mucosal growth** และสร้างมาจาก Pre-pro Gastrin ขนาด 101 aa ที่ผ่าน cleavage และ post-translational modifications ทำให้ **more active และ lower rate of degradation**"
          }
        ]
      },
      {
        "heading": "Cholecystokinin-Pancreozymin (CCK-PZ)",
        "source": "Gastrointestinal Physiology (final) p.19",
        "body": [
          {
            "text": "**CCK มี sequence homology บางส่วนกับ gastrin แต่มาจากคนละ gene และมีผลตรงข้ามกันในการควบคุม gastric acid secretion**"
          },
          {
            "sub": "Site of secretion",
            "body": [
              {
                "text": "Primarily duodenal mucosa"
              }
            ]
          },
          {
            "sub": "Stimuli for secretion",
            "body": [
              {
                "bullets": [
                  "Chyme ที่มี **High amino acid concentration**",
                  "Chyme ที่มี **High fatty acid concentration**",
                  "**Low pH**"
                ]
              }
            ]
          },
          {
            "sub": "Actions",
            "body": [
              {
                "bullets": [
                  "**Inhibits gastric emptying**",
                  "**เพิ่ม secretion ของ pancreatic enzymes และ HCO3-**",
                  "**Stimulates release of enteropeptidase**",
                  "**Stimulates gall bladder contractions**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Secretin-Glucagon family",
        "source": "Gastrointestinal Physiology (final) p.19-20",
        "body": [
          {
            "bullets": [
              "**Secretin**: มีผลต่อ Gastric secretion และ motility, **Delay gastric emptying**, **Inhibit motility of small intestine**",
              "**Glucagon**: Pancreatic secretion และ Gastric motility",
              "**Vasoactive Intestinal Peptide (VIP)**: Water and electrolyte secretion, Gastric secretion และ motility"
            ]
          },
          {
            "sub": "Secretin แบบละเอียด (p.20)",
            "body": [
              {
                "bullets": [
                  "Site of secretion: **Duodenal mucosa** (สไลด์อีกหน้าเขียนว่า secreted by cells at the beginning of the small intestine)",
                  "Stimuli: chyme ที่มี **Low pH** และ **High fatty acid concentration**",
                  "Actions: **ลด HCl production ในกระเพาะ**, **เพิ่ม pancreatic HCO3- secretion**, **เพิ่ม biliary HCO3- secretion**",
                  "หน้าที่โดยสรุปตามสไลด์: Secretin tells the pancreas to secrete bicarbonate to neutralize the partially digested acidic food leaving the stomach"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Prehension (การคาบหรือจับอาหารเข้าปาก)",
        "source": "Gastrointestinal Physiology (final) p.20",
        "body": [
          {
            "text": "**Prehension = Seizing and conveying of food to the mouth** ใช้ teeth, lips และ tongue โดย **สัตว์เคี้ยวเอื้องส่วนใหญ่มี dental pad**"
          },
          {
            "bullets": [
              "**Bovine spp**: Tongue, Immobile lips",
              "**Ovine และ Caprine spp**: Partially cleft upper lips",
              "**Swine spp**: Tongue (fine feed), Lips, Cheek, Palate และ Snout",
              "**Equine spp**: Mobile lips",
              "**Canine และ Feline spp**: Tongue, Teeth, Head และ Leg",
              "**Avian spp**: Beak"
            ]
          }
        ]
      },
      {
        "heading": "Mastication (Chewing)",
        "source": "Gastrointestinal Physiology (final) p.21",
        "body": [
          {
            "text": "**Mastication = Mechanical reduction of food to smaller particle size**"
          },
          {
            "bullets": [
              "**Carnivores และ Omnivores เคี้ยวในแนว Vertical direction**",
              "**Herbivores เคี้ยวในแนว Horizontal** และมี Dental pad",
              "กล้ามเนื้อที่เกี่ยวข้อง: **Masseter, Temporalis, Lateral และ Medial Pterygoid, Digastricus**",
              "**Not exist in Avian spp** (นกไม่มีการเคี้ยว)"
            ]
          }
        ]
      },
      {
        "heading": "Deglutition (Swallowing) แบ่งเป็น 3 stages",
        "source": "Gastrointestinal Physiology (final) p.21",
        "body": [
          {
            "sub": "1. Oral stage: Voluntary stage",
            "body": [
              {
                "text": "อาหารกระตุ้นผ่าน **CN 5, 9 และ 10** ไปยัง **Deglutition center in Medulla** แล้วส่งออกทาง **CN 5, 9, 10, 11 และ 12** ไปยัง Pharyngeal และ Laryngeal muscle"
              }
            ]
          },
          {
            "sub": "2. Pharyngeal stage: Involuntary stage",
            "body": [
              {
                "bullets": [
                  "**nasopharynx closes, epiglottis closes the larynx**",
                  "soft palate elevates",
                  "**respiration inhibited**",
                  "contraction ของ mylohyoid และ hyoglossus ทำให้ bolus เคลื่อนจากด้านหลังของปากไปสู่ upper esophagus"
                ]
              }
            ]
          },
          {
            "sub": "3. Esophageal stage (รายละเอียดอยู่ที่ p.23)",
            "body": [
              {
                "text": "เริ่มจาก cranio-esophageal ไปถึง caudo-esophageal sphincter"
              }
            ]
          }
        ]
      },
      {
        "heading": "การเคลื่อนที่ของอาหารในหลอดอาหาร",
        "source": "Gastrointestinal Physiology (final) p.23",
        "body": [
          {
            "bullets": [
              "**Primary peristalsis**: True peristaltic contraction ที่เกิดจากการกลืน **นำ bolus ไปได้เพียง upper portion ของ esophagus**",
              "**Secondary peristalsis**: Local esophageal peristaltic movement ที่เกิดจากการกระตุ้นของ bolus เอง ผ่าน **reflex stimulation via vagus nerve**",
              "**Reverse peristalsis เกิดขึ้นได้ ใน vomiting, regurgitation และ eructation**"
            ]
          },
          {
            "sub": "ลำดับเหตุการณ์ที่คอหอยและหลอดอาหาร (p.22)",
            "body": [
              {
                "bullets": [
                  "เมื่อไม่มีอาหาร: esophageal sphincter หดตัว, epiglottis ยกขึ้น, glottis เปิด (ทางเดินหายใจเปิด ทางเดินอาหารปิด)",
                  "เมื่ออาหารมาถึงคอหอย: กระตุ้นการกลืน กล่องเสียง (larynx) และ glottis ยกตัวขึ้น epiglottis เคลื่อนมาปิด (ทางเดินหายใจปิด ทางเดินอาหารเปิด)",
                  "esophageal sphincter คลายตัว อาหารเคลื่อนสู่หลอดอาหาร",
                  "กล้ามเนื้อหดและคลายตัวเป็นจังหวะ (**peristalsis**) ดันอาหารจากหลอดอาหารสู่กระเพาะอาหาร"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Function and Properties of Saliva",
        "source": "Gastrointestinal Physiology (final) p.23",
        "body": [
          {
            "text": "**pH ของน้ำลาย: Pig 7.3, Dog และ Cat 7.5, Ruminant 8-8.5**"
          },
          {
            "bullets": [
              "Mixing และ lubricate foods ช่วยการกลืน (aid deglutition)",
              "**Digest carbohydrate ด้วย a-amylase**",
              "**Evaporative cooling ในสุนัขและแมว**"
            ]
          },
          {
            "sub": "ทำไมน้ำลายจึงสำคัญมากในสัตว์เคี้ยวเอื้อง",
            "body": [
              {
                "bullets": [
                  "**Anti-frothing agents** (กันการเกิดฟอง)",
                  "**Nutrient for reticulorumen microbes**",
                  "มี **salivary lipase (pregastric esterase)**",
                  "**Neutralize acidic products จาก microbial digestion**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Control of Salivation",
        "source": "Gastrointestinal Physiology (final) p.25",
        "body": [
          {
            "bullets": [
              "Local stimuli เช่น food",
              "Mastication",
              "**Mineralocorticoid เช่น aldosterone**",
              "Autonomic nervous control",
              "**Higher brain: Pavlov's conditioned reflex**"
            ]
          },
          {
            "sub": "สารสื่อประสาทที่ควบคุม motility และ secretion (แผนภาพหน้าเดียวกัน)",
            "body": [
              {
                "bullets": [
                  "Enteric myenteric plexus: **excitatory = ACh, Substance P** และ **inhibitory = VIP, NO (nitric oxide)**",
                  "Submucosal plexus: excitatory = ACh, VIP",
                  "Autonomic parasympathetic (excitatory) = ACh ทำให้เกิด peristalsis และ **relaxes sphincters** รวมทั้งกระตุ้น secretions",
                  "Autonomic sympathetic (inhibitory) = epinephrine, norepinephrine ในภาวะ fright or flight response",
                  "Nicotinic Acetylcholine Receptor เป็น ionotropic ion channel นำ Na+ (และ Ca2+ บ้าง) ทำให้เกิด depolarization ของ inter-neurons และ motor neurons"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Slow waves และการหดตัวของ visceral smooth muscle",
        "source": "Gastrointestinal Physiology (final) p.26",
        "body": [
          {
            "bullets": [
              "**Frequency of contractions ถูกกำหนดโดย basic electrical rhythm ของ interstitial pacemaker cells**",
              "**Force of contraction ถูกกำหนดโดย neural และ hormonal input ที่เพิ่มเข้ามา**",
              "Slow wave ต้องขึ้นถึง AP threshold จึงเกิด action potentials และต้องถึง contraction threshold จึงเกิดการหดตัว",
              "Resting potential ประมาณ -60 mV เกิดจาก gNa + gK + Na pump ส่วน plateau เกิดจาก Na + Ca influx = K efflux โดยใน interstitial pacemaker cells เกิดจาก slow closing ของ delayed gK"
            ]
          },
          {
            "sub": "Small intestinal motility ในภาพเดียวกัน",
            "body": [
              {
                "bullets": [
                  "**Peristaltic propulsion**: สไลด์แยกไว้เป็นสองแบบคู่กัน **propulsive segment = Relaxation of longitudinal muscle & Contraction of circular muscle** ส่วน **receiving segment = Contraction of longitudinal muscle & Relaxation of circular muscle**",
                  "**Mixing** เป็นการเคลื่อนแบบ bidirectional",
                  "**MMC occurs in the fasting state และ MMC ถูกหยุดโดยอาหาร**"
                ]
              }
            ]
          },
          {
            "callout": "หมายเหตุ: ข้อความจากเว็บ Santa Fe Railway ที่ปนอยู่ในสไลด์หน้านี้เป็นภาพพื้นหลังที่ติดมา ไม่เกี่ยวกับเนื้อหา",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Gastric motility",
        "source": "Gastrointestinal Physiology (final) p.26",
        "body": [
          {
            "bullets": [
              "**1.1 Motility of empty stomach: Hunger pang**",
              "**1.2 Gastric filling: Receptive relaxation via Vagus nerve**",
              "**1.3 Motility of the full stomach**: 1.3.1 Peristalsis, 1.3.2 Retropulsion, 1.3.3 Systolic contraction",
              "**1.4 Gastric emptying (Pyloric pump)**"
            ]
          }
        ]
      },
      {
        "heading": "Gastric Emptying และ Enterogastric reflex",
        "source": "Gastrointestinal Physiology (final) p.27",
        "body": [
          {
            "sub": "Gastric Emptying",
            "body": [
              {
                "bullets": [
                  "อาศัย **Antral peristaltic movement (Pyloric pump) และการเปิดของ pyloric sphincter**",
                  "ถูกกระตุ้นโดย **1. Nervous signal จาก distension ของกระเพาะ 2. Hormone gastrin**",
                  "ช่วยให้อาหารผ่านจากกระเพาะไปลำไส้",
                  "**ปกติใช้เวลา 3-4 ชั่วโมงในสัตว์ส่วนใหญ่**"
                ]
              }
            ]
          },
          {
            "sub": "Enterogastric reflex = การยับยั้ง gastric emptying",
            "body": [
              {
                "text": "เกิดขึ้นเมื่อมีอาหารอยู่ใน duodenum แล้ว โดยทำงานผ่าน 3 ทาง: **ผ่าน enteric nervous system**, **ผ่าน extrinsic nerve ไป sympathetic ganglion** และ **ผ่าน vagus nerve (ยับยั้งสัญญาณกระตุ้นปกติ)**"
              },
              {
                "bullets": [
                  "Distension of duodenum",
                  "Irritation of duodenum",
                  "**Acidity of duodenal chyme (pH < 3.5-4)**",
                  "**Osmolality: hypertonic chyme**",
                  "Breakdown products of protein and fat",
                  "**Hormone Enterogastrone (Gastric inhibitory peptide, GIP) จาก duodenum**",
                  "**Hormones CCK และ secretin**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Motility ในลำไส้เล็ก",
        "source": "Gastrointestinal Physiology (final) p.28",
        "body": [
          {
            "bullets": [
              "**2.1 Peristaltic movement**",
              "**2.2 Pendulous movement**",
              "**2.3 Rhythmic segmentation**",
              "**2.4 Tonic contraction**"
            ]
          },
          {
            "sub": "What happens to a bolus in the gut",
            "body": [
              {
                "bullets": [
                  "bolus ทำให้ลำไส้ขยาย (distends the gut) และยืดผนัง",
                  "เกิด nerve stimulation ที่ตำแหน่ง distension ปล่อย neurotransmitter ไปยัง smooth muscle ทำให้ membrane potential depolarize",
                  "**เกิด spike potentials แล้วเกิดการหดตัว**",
                  "**การหดตัวเคลื่อนไปตามลำไส้อย่างประสานกันเพราะ smooth muscle มี gap junction**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาพรวมการหลั่งของ GI และ Pathophysiology ที่จะเรียน",
        "source": "Gastrointestinal Physiology (final) p.29",
        "body": [
          {
            "sub": "Gastrointestinal secretions",
            "body": [
              {
                "bullets": [
                  "Gastric acid secretion",
                  "Pancreatic (exocrine) secretion",
                  "Bile secretion",
                  "Intestinal secretion"
                ]
              }
            ]
          },
          {
            "sub": "Pathophysiology of GI tract",
            "body": [
              {
                "bullets": [
                  "Gastric and Duodenal ulcer",
                  "Vomiting",
                  "Jaundice",
                  "Exocrine pancreatic insufficiency",
                  "Constipation",
                  "Diarrhea",
                  "**Bloat (ruminants)**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เขียนหัวข้อไว้ว่า In Addition to Its Function in Nutrition, the GI Plays Important Roles in Excretion, Fluid and Electrolyte Balance แต่ไม่มีคำอธิบายต่อในหน้านั้น. หัวข้อ Exocrine pancreatic insufficiency, Constipation และ Bloat ที่ลิสต์ไว้ ก็ไม่มีสไลด์อธิบายรายละเอียดในเด็คนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Overview of gastric function และเซลล์ในกระเพาะ",
        "source": "Gastrointestinal Physiology (final) p.30",
        "body": [
          {
            "text": "**The Proximal Portion of the Stomach Secretes Acid, Pepsinogens, Intrinsic Factor, Bicarbonate, and Mucus, Whereas the Distal Part Releases Gastrin and Somatostatin**"
          },
          {
            "sub": "CORPUS (Body)",
            "body": [
              {
                "bullets": [
                  "**Parietal cells (หรือ oxyntic cells)** หลั่ง **Acid และ intrinsic factor**",
                  "Mucin และ HCO3-, Mucin และ Pepsinogens (โดย exocytosis)",
                  "**Enterochromaffin-like (ECL) cells ซึ่งหลั่ง histamine**",
                  "องค์ประกอบของสารคัดหลั่ง: [Na+] และ [Cl-] คล้าย plasma ส่วน **[HCO3-] และ [K+] สูงกว่ามาก**",
                  "สไลด์ระบุยา **Omeprazole** ไว้ในผัง แต่ไม่ได้อธิบายกลไก สไลด์ไม่ได้บอก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การกระตุ้น parietal cell ให้หลั่งกรด",
        "source": "Gastrointestinal Physiology (final) p.31",
        "body": [
          {
            "text": "**Acetylcholine, Gastrin และ Histamine กระตุ้นการหลั่งกรดของ parietal cells ทั้งทางตรงและทางอ้อม**"
          },
          {
            "bullets": [
              "Direct stimulation of parietal cells",
              "**Indirect stimulation of parietal cells ผ่าน histamine ที่ถูกปล่อยจาก ECL cells**"
            ]
          }
        ]
      },
      {
        "heading": "Composition of gastric juice",
        "source": "Gastrointestinal Physiology (final) p.31",
        "body": [
          {
            "bullets": [
              "Water และ electrolytes: **H+, Cl-, Na+, K+, HCO3-**",
              "**pH 2-3 ในสัตว์โต แต่ pH 4-5 ในสัตว์เล็ก (young animals)**",
              "**Enzymes: pepsin, rennin, gelatinase, lipase, tributyrase**",
              "**Mucoprotein intrinsic factor สำหรับ Vitamin B12**",
              "**Partial gastrectomy นำไปสู่ Pernicious anemia**"
            ]
          }
        ]
      },
      {
        "heading": "Gastric mucosal barrier และสมดุล aggressive กับ defensive",
        "source": "Gastrointestinal Physiology (final) p.31",
        "body": [
          {
            "sub": "องค์ประกอบของ mucosal barrier",
            "body": [
              {
                "bullets": [
                  "**Epithelial regeneration**",
                  "**Alkaline mucus secretion จาก mucous neck cell**",
                  "**Epithelial tight junction: ไม่มีการดูดซึมสารใด ยกเว้น alcohol และ aspirin (NSAID)**"
                ]
              }
            ]
          },
          {
            "sub": "ยาและสารที่ทำลาย mucosal barrier",
            "body": [
              {
                "bullets": [
                  "**1. Aspirin**",
                  "**2. Acids: acetic acid, butyric acid, propionic acid**",
                  "**3. Detergents: bile acid, lysolecithin**"
                ]
              }
            ]
          },
          {
            "sub": "Balance of Gastric Aggressive and Defensive Factors",
            "body": [
              {
                "bullets": [
                  "**Defensive factors**: Alkaline Mucus, Rapid epithelial cell regeneration, Tight mucosal junction, No passive transport of H2O and electrolytes, **Prostaglandin E2**",
                  "**Aggressive factors**: HCl, pepsin, Vagal stimulation, Bile acid, parietal cell mass, **Stress**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Control of gastric secretion แบ่งเป็น 3 phases",
        "source": "Gastrointestinal Physiology (final) p.32",
        "body": [
          {
            "sub": "1. Cephalic phase (neural control) 45 %",
            "body": [
              {
                "text": "vision, taste, smell, chewing, swallow กระตุ้น chemoreceptor และ mechanoreceptor ส่งผ่าน **afferent vagus nerve ไป Medulla แล้วกลับมาทาง efferent vagus nerve** กระตุ้น parietal cell ให้หลั่งกรด และกระตุ้น **G-cell in the mucosa ผ่าน Bombesin ให้หลั่ง Gastrin**"
              }
            ]
          },
          {
            "sub": "2. Gastric phase 45 %",
            "body": [
              {
                "text": "**Distended stomach กระตุ้น mechanoreceptor ที่ fundus และ pylorus** ผ่าน 3 ทาง: local nervous secretory reflex (short reflex), **vago-vagal reflex (long reflex)** และ gastrin stimulation. สไลด์อีกหน้าระบุ **Gastrin Releasing Peptide (GRP) และ Bombesin** ในเฟสนี้"
              }
            ]
          },
          {
            "sub": "3. Intestinal phase 10 %",
            "body": [
              {
                "text": "**Amino acids และ polypeptides ใน duodenum กระตุ้นการหลั่ง** ผ่าน Nervous mechanism (local reflex) และ **Hormonal mechanism (secretin)**"
              }
            ]
          },
          {
            "callout": "จำสัดส่วน 45 : 45 : 10 ของ cephalic : gastric : intestinal phase ของการหลั่งกรด แล้วเทียบกับสัดส่วนของตับอ่อนที่เป็น 20 : 10 : 70 ซึ่งกลับกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "เส้นทางยับยั้งการหลั่งกรดเพิ่มเติม",
        "source": "Gastrointestinal Physiology (final) p.34",
        "body": [
          {
            "text": "สไลด์ ADDITIONAL INHIBITORY PATHWAYS แสดงตัวยับยั้งและแหล่งที่มา แต่เป็นแผนภาพเป็นส่วนใหญ่"
          },
          {
            "bullets": [
              "**Neurotensin และ Peptide YY**",
              "**Somatostatin จาก D cells** (ออกฤทธิ์ผ่าน Somatostatin Rc)",
              "**GIP (gastric inhibitory peptide) จาก K cells ใน duodenum และ jejunum**",
              "**Secretin จาก S cell ใน small intestine**",
              "**Prostaglandin E2 (PGE2) จาก surface cells**",
              "Cholecystokinin (CCK) ผ่าน receptor CCKA และ CCKB, Histamine จาก ECL ผ่าน H2, ACh ผ่าน M3, Gastrin จาก G cells ที่ antrum, VIP และ endocrine cell ของ ileum และ colon"
            ]
          },
          {
            "callout": "สไลด์เขียนคำว่า Digitalis glycoside ไว้ลอย ๆ ในหน้าถัดจากผังนี้ โดยไม่มีคำอธิบายว่าเกี่ยวข้องอย่างไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Physiology of Vomiting และการแยกศัพท์",
        "source": "Gastrointestinal Physiology (final) p.34",
        "body": [
          {
            "text": "**Vomiting = Forceful expulsion ของสิ่งที่อยู่ในกระเพาะและ proximal small intestine** ผลตามมาที่สไลด์ระบุคือ **acid-base imbalance, malnutrition และ aspiration pneumonia** และเป็น reflex ที่ต้องอาศัย complex neural integration"
          },
          {
            "sub": "Nausea",
            "body": [
              {
                "text": "ความรู้สึกไม่สบายและมี psychic changes โดย **gastric motility ลดลง แต่ tone ของ small intestine เพิ่มขึ้น** อาการที่สังเกตได้คือ depression, salivation, licking of the lip และ repeated swallowing"
              }
            ]
          },
          {
            "sub": "Retching",
            "body": [
              {
                "text": "**spasmodic respiratory movements ขณะ glottis ปิด** เกิด sudden inspiratory movement และ **pyloric กับ antrum portion ของกระเพาะหดตัว**"
              }
            ]
          },
          {
            "sub": "Vomiting (Emesis)",
            "body": [
              {
                "text": "gastric และ duodenal contents ถูกดันขึ้นมาที่ปาก โดย **cardia คลายตัว และ intra-abdominal pressure ที่สูงขับสิ่งที่อยู่ในกระเพาะออกมา**"
              }
            ]
          },
          {
            "sub": "Regurgitation",
            "body": [
              {
                "text": "**เป็นความผิดปกติของ esophagus** เป็นการขับออกแบบ passive และ **เกิดก่อนที่ ingesta จะไปถึงกระเพาะ**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Series of vomiting (ลำดับเหตุการณ์ขณะอาเจียน)",
        "source": "Gastrointestinal Physiology (final) p.35",
        "body": [
          {
            "bullets": [
              "**Deep breath, glottis closed, larynx raised, soft palate elevated และ cranial esophageal sphincter opened**",
              "**Diaphragm contracted, negative pressure ในทรวงอกเพิ่มขึ้น, caudal esophageal sphincter opened**",
              "**Abdominal muscle contracted, กระเพาะถูกบีบ, intragastric pressure เพิ่มขึ้น**",
              "**Pyloric sphincter closed และ esophagus ว่างแล้วเปิดออก**",
              "**Content ในกระเพาะถูกดันขึ้นสู่ปาก**"
            ]
          },
          {
            "callout": "หัวข้อ Vomiting center and pathway ในหน้าเดียวกันเป็นแผนภาพล้วน สไลด์ไม่ได้เขียนชื่อ center หรือเส้นทางเป็นตัวอักษร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Composition of pancreatic juice และการควบคุมด้วยเส้นประสาท",
        "source": "Gastrointestinal Physiology (final) p.36",
        "body": [
          {
            "bullets": [
              "**Water (98%) และ electrolytes เช่น HCO3-, Na+, Cl-, Ca2+, K+, Mg2+**",
              "Mucoprotein, mucin, albumin และ globulin",
              "**Proteolytic enzymes เช่น trypsin, chymotrypsin**",
              "**Hydrolytic enzymes เช่น amylase**",
              "**Lipolytic enzymes เช่น lipase, co-lipase**"
            ]
          },
          {
            "sub": "Nervous control of the pancreas",
            "body": [
              {
                "bullets": [
                  "ตับอ่อนได้รับ innervation จากแขนงของ **vagus nerve** โดยปลายประสาทพบร่วมกับ acinar cells และ **gap junctions ช่วยกระจายสัญญาณ**",
                  "**เชื่อว่าเส้นประสาทมีบทบาทน้อย (minor role) เมื่อเทียบกับ CCK ในการกระตุ้นการหลั่งของตับอ่อน**",
                  "**Sympathetic fibers ก็เลี้ยงตับอ่อนเช่นกัน แต่บทบาทยังไม่ทราบ (their role is not known)**"
                ]
              }
            ]
          },
          {
            "text": "**Acinar Cells Are Specialized Protein-Synthesizing Cells** สร้าง Trypsinogen, Chymotrypsinogen, Proelastase, Procarboxypeptidase A และ B พร้อมกับ HCO3- และ digesting enzymes (proteases, amylases, nucleases, lipases), NaCl-rich fluid และ high-molecular weight proteoglycans"
          }
        ]
      },
      {
        "heading": "Exocrine Pancreatic Secretion แบ่งเป็น 2 ส่วน",
        "source": "Gastrointestinal Physiology (final) p.37",
        "body": [
          {
            "sub": "Aqueous และ bicarbonate components",
            "body": [
              {
                "bullets": [
                  "**หลั่งจากเซลล์ท่อ (duct cells)**",
                  "ช่วยลดความเป็นกรดของ duodenal content",
                  "**ป้องกัน duodenal mucosa**",
                  "**ปรับ pH ของ content ใน duodenum ให้เหมาะกับการทำงานของ pancreatic enzymes**"
                ]
              }
            ]
          },
          {
            "sub": "Enzymatic components",
            "body": [
              {
                "bullets": [
                  "**หลั่งจากเซลล์ต่อม (acinar cells)**",
                  "**หลั่งในปริมาณน้อย**",
                  "Enzymes ที่สำคัญคือ **pancreatic amylase, trypsin, chymotrypsin, carboxypeptidase และ pancreatic lipase**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Activation ของ pancreatic proteases ในลำไส้เล็ก",
        "source": "Gastrointestinal Physiology (final) p.37-38",
        "body": [
          {
            "text": "**CCK กระตุ้น duodenal mucosal cells ให้สร้าง enteropeptidase (enterokinase)** ซึ่งเป็นตัวจุดชนวนของ cascade ทั้งหมด"
          },
          {
            "bullets": [
              "**Trypsinogen ถูกเปลี่ยนเป็น Trypsin โดย enterokinase และโดย trypsin เอง**",
              "**Chymotrypsinogen ถูกเปลี่ยนเป็น Chymotrypsin โดย trypsin**",
              "**Proelastase ถูกเปลี่ยนเป็น Elastase โดย trypsin**",
              "**Procarboxypeptidase A, B ถูกเปลี่ยนเป็น Carboxypeptidase A, B โดย trypsin**"
            ]
          },
          {
            "callout": "จุดที่ต้องจำ: trypsin เป็นตัวกลางที่ activate เอนไซม์อื่นทั้งหมด ส่วนตัวที่ activate trypsin เองคือ enterokinase จาก duodenal mucosa (ไม่ใช่จากตับอ่อน) นี่คือกลไก auto-digestion prophylaxis ที่กล่าวไว้ตั้งแต่ p.11",
            "kind": "tip"
          },
          {
            "sub": "ผลลัพธ์ปลายทางของ cascade (p.38 และ p.49)",
            "body": [
              {
                "bullets": [
                  "Trypsin ตัดโปรตีนให้ได้ **arg และ cyst C-terminal peptides**",
                  "Chymotrypsin ให้ **aromatic C-terminal peptides**",
                  "Elastase ให้ **aliphatic C-terminal peptides**",
                  "ที่ **brush border ของ jejunum (และ ileum)** มี carboxypeptidase, amino-oligopeptidase และ dipeptidyl peptidase ย่อยต่อเป็น amino acids, dipeptides และ tripeptides โดย **basic amino acids ขนส่งช้ากว่า ส่วน di- และ tri-peptides ขนส่งเร็วกว่า**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Control of pancreatic secretion แบ่งเป็น 3 phases",
        "source": "Gastrointestinal Physiology (final) p.39-40",
        "body": [
          {
            "sub": "1. Cephalic phase (neural control) 20 %",
            "body": [
              {
                "bullets": [
                  "**Vagus nerve กระตุ้นทั้ง acinar และ ductule secretion**",
                  "**Gastrin กระตุ้น acinar secretion**",
                  "สิ่งกระตุ้นคือ vision, taste, smell, chewing, swallow ผ่าน chemoreceptor และ mechanoreceptor ไปที่ Medulla"
                ]
              }
            ]
          },
          {
            "sub": "2. Gastric phase 10 %",
            "body": [
              {
                "text": "**distended stomach และ digestion products** ทำงานผ่าน **vagovagal reflex**"
              }
            ]
          },
          {
            "sub": "3. Intestinal phase 70 %",
            "body": [
              {
                "bullets": [
                  "**acid chyme ใน duodenum (pH < 4.5) กระตุ้น Secretin ให้หลั่ง water และ HCO3-**",
                  "**protein และ fatty acid ใน chyme กระตุ้น cholecystokinin (CCK-PZ)**",
                  "สไลด์สรุปสิ่งกระตุ้นในเฟสนี้เป็นสามอย่างคือ 1. Vagus 2. Secretin (จาก fat, H+) 3. CCK (จาก fat, H+, peptides)"
                ]
              }
            ]
          },
          {
            "text": "ผลผลิตสองแบบที่สไลด์แยกไว้คือ **water + HCO3- (hydrelatic)** และ **pancreatic enzymes (ecbolic)** โดย secretin เป็นตัวคุมส่วนแรก และ CCK คุมส่วนหลัง"
          }
        ]
      },
      {
        "heading": "Bile: ส่วนประกอบและหน้าที่",
        "source": "Gastrointestinal Physiology (final) p.40",
        "body": [
          {
            "text": "**Bile salts ถูกสังเคราะห์โดย hepatocytes จาก cholesterol**"
          },
          {
            "sub": "องค์ประกอบหลัก 2 อย่าง",
            "body": [
              {
                "bullets": [
                  "**Bile pigments: Bilirubin (yellow-orange) และ Biliverdin**",
                  "**Bile salts: Na หรือ K salt ของ bile acids**"
                ]
              }
            ]
          },
          {
            "sub": "Function of bile",
            "body": [
              {
                "bullets": [
                  "**Assist digestion and absorption of lipids**",
                  "**เป็นเส้นทางขับ endogenous metabolites บางชนิด**",
                  "**เป็น buffer เสริมเพื่อ neutralize acid chyme ใน duodenum**"
                ]
              }
            ]
          },
          {
            "callout": "**Gall bladder ไม่มีในสัตว์บางชนิด เช่น Horse, rat, deer, camel และ elephant**",
            "kind": "warn"
          },
          {
            "text": "สไลด์ p.41 แสดง structure of bile acids และคำว่า chenodeoxycholic acid กับ Taurine รวมทั้ง bilirubin glucuronide แต่เป็นภาพสูตรโครงสร้าง ไม่มีคำอธิบายเป็นข้อความ"
          }
        ]
      },
      {
        "heading": "เปรียบเทียบ bile จากตับกับ bile จากถุงน้ำดี",
        "source": "Gastrointestinal Physiology (final) p.42",
        "body": [
          {
            "text": "ตารางนี้แสดงผลของการ concentrate น้ำดีในถุงน้ำดี คือ **น้ำลดลง ส่วน bile salts, bilirubin, cholesterol และ Ca2+ เข้มข้นขึ้น ขณะที่ Na+ และ Cl- ลดลง**"
          },
          {
            "bullets": [
              "water: **Liver bile 97.5 gm% เทียบกับ Gall bladder bile 92 gm%**",
              "bile salts: **1.2 gm% เทียบกับ 6 gm%**",
              "bilirubin: **0.04 gm% เทียบกับ 0.3 gm%**",
              "cholesterol: 0.1 gm% เทียบกับ 0.3-0.9 gm%",
              "Na+: 145 mEq/L เทียบกับ 130 mEq/L",
              "Cl-: **100 mEq/L เทียบกับ 25 mEq/L**",
              "Ca2+: 5 mEq/L เทียบกับ 23 mEq/L"
            ]
          }
        ]
      },
      {
        "heading": "Control of Bile secretion",
        "source": "Gastrointestinal Physiology (final) p.42",
        "body": [
          {
            "bullets": [
              "**1. Bile acid (choleretic agent): เพิ่ม bile flow และ HCO3- ผ่าน Enterohepatic circulation**",
              "**2. Hormonal control**: **Secretin เพิ่ม bile flow และ HCO3- และกระตุ้น smooth muscle ของถุงน้ำดี** ส่วน **CCK กระตุ้นการหดตัวของถุงน้ำดี และกระตุ้นการคลายตัวของ Sphincter of Oddi**",
              "**3. Neural control: Autonomic nervous system**"
            ]
          }
        ]
      },
      {
        "heading": "Jaundice และการแยก conjugated กับ free bilirubin",
        "source": "Gastrointestinal Physiology (final) p.42-43",
        "body": [
          {
            "text": "**Jaundice = Increase plasma bilirubin level** สาเหตุตามสไลด์มี 5 กลุ่ม"
          },
          {
            "bullets": [
              "**Overproduction**",
              "**Impaired Secretion**",
              "**Impaired uptake of bilirubin**",
              "**Impaired conjugation of bilirubin**",
              "**Regurgitation of bilirubin from liver to blood**"
            ]
          },
          {
            "sub": "Conjugated เทียบกับ Free (Unconjugated) bilirubin",
            "body": [
              {
                "bullets": [
                  "Reaction with diazo: **Conjugated = Direct, Free = Indirect**",
                  "Structure: **Conjugated = Bilirubin diglucuronide, Free = Bilirubin**",
                  "Water solubility: **Conjugated ละลายน้ำได้ (+), Free ไม่ละลาย**",
                  "Compound: **Conjugated = Polar, Free = Non-polar**",
                  "**Present in urine: พบเฉพาะ conjugated**",
                  "ภาวะที่พบ: **Hemolytic สัมพันธ์กับ free bilirubin ส่วน Obstructive และ Hepatocellular สัมพันธ์กับ conjugated bilirubin**"
                ]
              }
            ]
          },
          {
            "callout": "ตารางในสไลด์มีเครื่องหมาย + ++ +++ กำกับหลายช่อง แต่ text layer สลับตำแหน่งจนอ่านการจับคู่ที่แน่นอนไม่ได้ทุกช่อง ควรกลับไปดูสไลด์ต้นฉบับก่อนท่องตัวเลขระดับ +",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Intestinal secretion ของน้ำและ electrolytes",
        "source": "Gastrointestinal Physiology (final) p.43-44",
        "body": [
          {
            "bullets": [
              "**Osmolality และความเข้มข้น Na+ ของ intestinal secretion เท่ากับ Plasma แต่มี K+ สูงกว่า (10-15 mEq/l)**",
              "Flux ของน้ำมีทั้งแบบ **Passive และ Active**",
              "**Passive flux ขึ้นกับ**: Osmolality ของ intestinal contents, Plasma และ interstitial oncotic pressure, Capillary และ interstitial hydrostatic pressure"
            ]
          },
          {
            "sub": "I Passive intestinal secretion",
            "body": [
              {
                "bullets": [
                  "**Hyperosmotic food (salt, sweet)**",
                  "**Products of digestion เช่น amino acid และ fat**"
                ]
              }
            ]
          },
          {
            "sub": "II Active intestinal secretion",
            "body": [
              {
                "bullets": [
                  "**Na+ และ Cl- pump ที่ basolateral membrane**",
                  "**Na+ ถูกปั๊มออกโดย Na+-K+ ATPase**",
                  "**Intracellular Cl- เคลื่อนออกสู่ lumen**",
                  "**Na+ เคลื่อนสู่ lumen ทาง paracellular pathway**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ยก **Vibrio cholera** ขึ้นมาคู่กับ **cyclic AMP-dependent chloride channel หรือ cystic fibrosis transmembrane conductance regulator (CFTR)** แต่ไม่ได้อธิบายกลไก toxin เป็นข้อความ สไลด์ไม่ได้บอกรายละเอียด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Polysaccharides: storage เทียบกับ structural",
        "source": "Gastrointestinal Physiology (final) p.45-46",
        "body": [
          {
            "sub": "Storage Polysaccharides",
            "body": [
              {
                "bullets": [
                  "**Starch และ glycogen เป็น storage polysaccharides ในสัตว์และพืช เป็น polymers ของ glucose ใช้เป็น reserve fuel**",
                  "**Starch (amylose) เป็น isomer ของ cellulose มี glycosidic bond คนละแบบ อยู่ใน plant cells**",
                  "**Glycogen (animal cells) โครงสร้างคล้ายกันแต่แตกแขนงมากกว่า ถูกย่อยจากปลายสาย การแตกแขนงจึงทำให้ย่อยได้เร็ว**"
                ]
              }
            ]
          },
          {
            "sub": "Structural Polysaccharides",
            "body": [
              {
                "bullets": [
                  "**Chitin**: พบใน exoskeletons (crustaceans, insects) และ cell walls ของ fungi และ algae เป็น **polymers ของ N-acetylglucosamine**",
                  "**Cellulose**: พบใน plant cell walls ทำหน้าที่รับน้ำหนัก คิดเป็น **50% ของ carbon ใน biosphere** และมีได้ถึง **15,000 glucose residues**",
                  "**การย่อย cellulose ต้องอาศัย bacteria ใน bovine G.I. tract**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Digestion of Carbohydrates",
        "source": "Gastrointestinal Physiology (final) p.47",
        "body": [
          {
            "sub": "Luminal phase: Salivary และ pancreatic amylase",
            "body": [
              {
                "bullets": [
                  "**Pancreatic amylase ย่อย starches ให้เป็น polysaccharides ที่เล็กลง**",
                  "Starch (amylose, amylopectin) ถูกย่อยได้เป็น **limit dextrin (พันธะ 1,6 linkage)**, **maltotriose (พันธะ 1,4 linkage)** และ **maltose**"
                ]
              }
            ]
          },
          {
            "sub": "Mucosal phase: Brush-border disaccharidases",
            "body": [
              {
                "bullets": [
                  "**Intestinal mucosal cells หลั่ง maltase, sucrase และ lactase**",
                  "**lactase และ sucrase ให้ glucose, fructose และ galactose**",
                  "**maltase และ limit dextrinase (isomaltase) ย่อยส่วนที่เหลือ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Digestion of proteins",
        "source": "Gastrointestinal Physiology (final) p.48-49",
        "body": [
          {
            "sub": "Luminal phase: proteolytic enzymes",
            "body": [
              {
                "bullets": [
                  "**จากกระเพาะ: Pepsin**",
                  "**จากตับอ่อน: Endopeptidase และ Exopeptidase**"
                ]
              }
            ]
          },
          {
            "sub": "Mucosal phase",
            "body": [
              {
                "text": "**Aminopolypeptidase และ di-peptidase รวมทั้ง intracellular oligopeptidases**"
              }
            ]
          },
          {
            "sub": "ความจำเพาะของ Pepsin (p.49)",
            "body": [
              {
                "bullets": [
                  "**Pepsin ตัดที่ hydrophobic residues โดยเฉพาะ aromatic residues ที่ตำแหน่ง P1 และ P1'**",
                  "ถูกย่อยง่ายขึ้นถ้ามี sulfur-containing amino acid อยู่ใกล้พันธะ peptide ที่มี aromatic amino acid",
                  "สไลด์ยกตัวอย่างพันธะที่ pepsin ตัดใน B chain ของ insulin ได้แก่ Phe1-Val, Gln4-His, Glu13-Ala, Ala14-Leu, Leu15-Tyr, Tyr16-Leu, Gly23-Phe, Phe24-Phe และ Phe25-Tyr"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Digestion of Fat และ Micelles",
        "source": "Gastrointestinal Physiology (final) p.50",
        "body": [
          {
            "sub": "Luminal phase",
            "body": [
              {
                "bullets": [
                  "**gastric, pancreatic และ intestinal lipase**",
                  "**Emulsification by bile salts**",
                  "**Facilitated lipase activity โดย co-lipase** (ลำดับตามสไลด์คือ Fat globules ไป bile salt ไป co-lipase ไป lipase)"
                ]
              }
            ]
          },
          {
            "sub": "Mucosal phase",
            "body": [
              {
                "text": "**Formation of micelles** ได้ผลผลิตเป็น **2 free fatty acids + monoglyceride**"
              }
            ]
          },
          {
            "sub": "Micelles",
            "body": [
              {
                "bullets": [
                  "**Water-soluble aggregates ของ lipid molecules โดยมี polar group อยู่ด้านนอกและ nonpolar core อยู่ด้านใน**",
                  "เป็น very fine dispersion ของ lipid ในน้ำ ขนาด **50 ถึง 100 A diameter**",
                  "**พา lipid digestion products (fatty acids, monoglycerides) ไปที่ mucosa**"
                ]
              }
            ]
          },
          {
            "sub": "ลำดับ 9 ขั้นตอนของการย่อยและดูดซึมไขมันตามสไลด์",
            "body": [
              {
                "bullets": [
                  "1-2. Emulsification by bile salts",
                  "3. Pancreatic lipase digestion",
                  "4. Mixed micelles",
                  "5. Digested fats เข้า epithelium และ **bile salts ถูก recycle**",
                  "6. Chylomicrons",
                  "7-8. Exit to lymph",
                  "9. **Small fatty acids ถูกส่งเข้าเลือดโดยตรง** ได้แก่ Volatile fatty acid (acetate, propionate, butyrate) และ Medium chain fatty acid (น้ำมันมะพร้าว น้ำมันปาล์ม)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Absorption: การเพิ่มพื้นที่ผิวและชั้นเยื่อที่ต้องผ่าน",
        "source": "Gastrointestinal Physiology (final) p.51-52",
        "body": [
          {
            "text": "**GI tract เปลี่ยนรูปเพื่อเพิ่มการดูดซึมให้มากที่สุด โดยพื้นที่ผิวเพิ่มขึ้นเป็นชั้น ๆ**"
          },
          {
            "bullets": [
              "**Submucosal fold: เพิ่มพื้นที่ 3 เท่า**",
              "**Villi: โครงสร้างคล้ายนิ้วมือของ L. propria และ epithelium เพิ่มพื้นที่ 10 เท่า**",
              "**Microvilli: ที่ apical surface ของ epithelium เพิ่มพื้นที่ 20 เท่า**"
            ]
          },
          {
            "sub": "Layers of Mucosal membrane ที่สารต้องผ่าน",
            "body": [
              {
                "bullets": [
                  "unstirred water layer",
                  "glycocalyx (fuzzy coat)",
                  "cell membrane",
                  "cytoplasm",
                  "basal หรือ lateral cell membrane",
                  "intercellular space",
                  "basement membrane",
                  "membrane ของ capillary หรือ lymph vessel"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Type of Absorption",
        "source": "Gastrointestinal Physiology (final) p.52",
        "body": [
          {
            "sub": "Active transport",
            "body": [
              {
                "bullets": [
                  "**Movement จากที่เข้มข้นต่ำไปสูง และต้องใช้พลังงาน (ATP)**",
                  "**Primary active transport** เช่น Na+-K+ ATPase",
                  "**Secondary active transport** เช่น co-transport ของ Na กับ glucose หรือ amino acid",
                  "**Endocytosis (Pinocytosis)** เช่น TG, Ab และ albumin"
                ]
              }
            ]
          },
          {
            "sub": "Passive transport",
            "body": [
              {
                "bullets": [
                  "**Movement จากที่เข้มข้นสูงไปต่ำ ไม่ต้องใช้พลังงาน**",
                  "**Simple diffusion**",
                  "**Non-ionic diffusion** เช่น Aspirin",
                  "**Facilitated (carrier-mediated) transport** เช่น Fructose"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.53 (Absorption of Fat และ Absorption of protein) มีแต่ชื่อหัวข้อกับรูป ไม่มีข้อความบรรยายให้สรุป",
            "kind": "flag"
          },
          {
            "sub": "สรุปการย่อยและการดูดซึมตามผังใน p.54",
            "body": [
              {
                "bullets": [
                  "ตารางไล่ carbohydrate protein fat จาก **mouth (ptyalin, lingual lipase, Fat + fat soluble vitamins ADEK)**",
                  "**Stomach: acid & pepsin**",
                  "**Duodenum: pancreatic amylase, pancreatic proteases, pancreatic lipases & bile, calcium & iron absorbed**",
                  "**Brush border enzymes ที่ jejunum & ileum**: glucose galactose fructose, di- และ tri-peptides amino acids, mixed micelles",
                  "**Intestinal cell: re-esterification แล้วได้ chylomicrons ซึ่ง absorbed into lacteals** ส่วนที่เหลือเข้าสู่ blood",
                  "ผัง **Calcium transport ใน duodenal cells** ระบุ **1,25-(OH)2-D3 (metabolite ของ Vitamin D), Calcitriol, cholecalciferol, Ca binding protein และ calmodulin** พร้อม gradient **Ca about 100 nanomolar เทียบกับ Ca between 1 & 10 mM**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การดูดซึม Vitamins",
        "source": "Gastrointestinal Physiology (final) p.55",
        "body": [
          {
            "bullets": [
              "**โดยทั่วไปดูดซึมด้วย simple diffusion**",
              "**B1 (thiamine): ดูดซึมที่ jejunum ด้วย Na+-dependent active transport**",
              "**B2 (riboflavin): ดูดซึมที่ proximal small intestine ด้วย facilitated transport**",
              "**Vitamin C: ทั้ง passive และ active transport (energy-dependent และต้องการ Na+)**",
              "**Vitamin K1 จากอาหาร: active transport**",
              "**Vitamin K2 จากแบคทีเรีย: passive transport**"
            ]
          }
        ]
      },
      {
        "heading": "Motility ในลำไส้ใหญ่",
        "source": "Gastrointestinal Physiology (final) p.56",
        "body": [
          {
            "bullets": [
              "**3.1 Haustration (Mixing movement)**",
              "**3.2 Propulsion (Massive movement) นำไปสู่ Defecation**"
            ]
          }
        ]
      },
      {
        "heading": "Defecation",
        "source": "Gastrointestinal Physiology (final) p.57",
        "body": [
          {
            "text": "**Defecation เป็น reflex ที่เกี่ยวข้องกับ sphincter สองตัว**"
          },
          {
            "bullets": [
              "**1. Internal anal sphincter**: เป็น smooth muscle รับ **parasympathetic nerve จาก pelvic nerve และ sympathetic nerve จาก hypogastric nerve**",
              "**2. External anal sphincter**: เป็น striated muscle เลี้ยงด้วย **somatic nerve (pudendal nerve)** คงสภาพ **tonic contraction** และอยู่ภายใต้ **voluntary control**"
            ]
          },
          {
            "sub": "ลำดับของ reflex",
            "body": [
              {
                "text": "distention ทำให้เกิด **Intrinsic reflex** และ **peristaltic wave** ร่วมกับ **parasympathetic defecation reflex** โดย **reflex นี้จะจางหายไปเองถ้า external anal sphincter ถูกเกร็งไว้ (It dies out if external anal sphincter is kept contracted)** สไลด์ระบุ Pudendal nerve ไว้ในผังด้วย แต่ไม่ได้บอกว่า reflex เดินผ่านเส้นใด"
              }
            ]
          }
        ]
      },
      {
        "heading": "Mucus secretion ในลำไส้",
        "source": "Gastrointestinal Physiology (final) p.57",
        "body": [
          {
            "sub": "Crypts of Lieberkuhn, Goblet cells",
            "body": [
              {
                "bullets": [
                  "**High concentration ของ HCO3-**",
                  "กระตุ้นโดยการที่อาหารสัมผัส mucosa โดยตรง",
                  "**Control by pelvic nerve**"
                ]
              }
            ]
          },
          {
            "sub": "Brunner gland",
            "body": [
              {
                "bullets": [
                  "กระตุ้นโดยการที่อาหารสัมผัส mucosa โดยตรง",
                  "**Vagal stimulation**",
                  "**GI hormones**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Microflora of the GI tract",
        "source": "Gastrointestinal Physiology (final) p.57",
        "body": [
          {
            "bullets": [
              "**ส่วนใหญ่เป็น anaerobes หรือ facultative anaerobes**",
              "**ปริมาณ: Large intestine > small intestine > stomach**",
              "**ในกระเพาะขณะ fasting: 10^1 - 10^2 cells/g และหลังกินอาหาร: 10^4 - 10^5 cells/g**",
              "**ใน saliva, mouth และ stomach: Bacteroides, Streptococcus, Lactobacillus, Neisseria**",
              "**ใน small และ large intestine: E. coli, Enterobacter, Strep, Staph, Lactobacillus, Pseudomonas (aerobes) และ Bacteroides**"
            ]
          }
        ]
      },
      {
        "heading": "Probiotic และ Prebiotic",
        "source": "Gastrointestinal Physiology (final) p.58",
        "body": [
          {
            "bullets": [
              "**Probiotic: ตัวอย่างที่สไลด์ยกคือ Lactobacillus spp**",
              "**Prebiotic: ตัวอย่างที่สไลด์ยกคือ Oligofructose**"
            ]
          },
          {
            "callout": "สไลด์หน้านี้มีแต่ชื่อหัวข้อกับตัวอย่างและรูปภาพ ไม่ได้ให้นิยามหรืออธิบายความแตกต่างระหว่าง probiotic กับ prebiotic เป็นข้อความ สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Mechanism of Salmonella invasion",
        "source": "Gastrointestinal Physiology (final) p.59",
        "body": [
          {
            "text": "ผังในสไลด์แสดงลำดับว่า **Salmonella จับกับ Saccharide chain receptor แล้วเกิด Feed Induced Endocytosis เข้าสู่ Epithelium mucosa Cells จากนั้น Exocytosis ออกสู่ Lamina propria mucosa และ submucosa**"
          },
          {
            "callout": "สไลด์แสดงเป็นผังลำดับเท่านั้น ไม่ได้อธิบายกลไกระดับโมเลกุลหรือผลทางคลินิกเพิ่มเติม สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pathophysiology of Diarrhea",
        "source": "Gastrointestinal Physiology (final) p.59",
        "body": [
          {
            "text": "สไลด์สุดท้ายแบ่งกลไกการเกิดท้องเสียเป็น 4 ข้อ ซึ่งเป็นชุดที่ควรท่องให้ครบ"
          },
          {
            "bullets": [
              "**1. Accumulation of osmotically active particles in GI tract: sugar, salt**",
              "**2. Breakdown of the permeability barrier of intestine** (mucosal cell ulceration นำไปสู่ plasma protein losing enteropathy)",
              "**3. Stimulation of intestinal secretory mechanism** (bacterial enterotoxin)",
              "**4. Alteration of intestinal motility**"
            ]
          }
        ]
      }
    ]
  },
  "physio-3--lactation-physiology-i": {
    "topic": "physio-3--lactation-physiology-i",
    "title": "Lactation physiology I: จาก mammogenesis ถึง involution",
    "icon": "📗",
    "lecturer": "อ. สัมพันธ์ ธรรมเจริญ ภาควิชาสรีรวิทยา คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
    "summary": "เด็คนี้เป็นครึ่งแรกของเรื่อง lactation วางแผนที่ของทั้งคอร์สไว้ที่สไลด์ 2-3 แล้วเดินเรื่องตามลำดับ evolution และ comparative lactation strategies ถัดมาเป็น anatomy กับ histology ของ mammary gland แล้วต่อด้วย stage ของ lactation ตามลำดับ mammogenesis I (pre-natal) ไป mammogenesis II (post-natal) ไป lactogenesis I และ II ไป galactopoiesis และจบที่ involution ทั้งใน rodent model และใน bovine เนื้อหาส่วน knockout mouse ใช้พิสูจน์ว่าฮอร์โมนตัวไหนจำเป็นในระยะไหน จุดที่ต้องรู้ล่วงหน้าคือสไลด์จำนวนไม่น้อยเป็นรูปหรือ figure legend ล้วน ๆ ไม่มี text อธิบาย (สไลด์ 14, 18, 21, 23, 24, 25, 29, 35, 41-42, 45-46) โดย p.22 ไม่ใช่รูปล้วน สไลด์เขียนไว้ว่า GHRKO (C) and control (D) were grafted into opposite glands of the same recipient and harvested 8 weeks after surgery สไลด์ 4 เป็นเรื่องธุรการหนังสือ และสไลด์ 5 เป็นรายการอ้างอิงอย่างเดียว ส่วน functions ของน้ำนม การเลี้ยงโคนม แพะนม และโรคของเต้านม ถูกประกาศไว้ในแผนที่คอร์สแต่ยังไม่ได้สอนในเด็คนี้",
    "sections": [
      {
        "heading": "แผนที่ของเรื่อง lactation ทั้งหมด (ใช้จับว่าเด็คนี้อยู่ตรงไหน)",
        "source": "Lactation physiology I p.2",
        "body": [
          {
            "text": "สไลด์นี้กาง scope ของ **lactation and mammary gland physiology** ออกเป็นสองแกนใหญ่ คือ **evolution & structure** และ **stage & mechanism of lactation**"
          },
          {
            "sub": "stage ของ lactation ที่จะเดินตามลำดับ",
            "body": [
              {
                "bullets": [
                  "**Mammogenesis**",
                  "**Lactogenesis** ซึ่งผลผลิตที่ระบุไว้คือ lactose, casein & fat, immunoglobulin และ growth factors",
                  "**Galactopoiesis**",
                  "**Involution**"
                ]
              }
            ]
          },
          {
            "sub": "แกนที่ตัดขวางทุก stage",
            "body": [
              {
                "bullets": [
                  "**Organogenesis**: differentiation & proliferation, tissue remodeling, program cell death",
                  "**Neuroendocrine & behaviors**: mom-child bond, milk ejection, milk synthesis",
                  "**Hormone & local factors** ร่วมกับ nutritional & environmental factors"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ส่วนของคอร์สที่ประกาศไว้แต่ยังไม่ได้สอนในเด็คนี้",
        "source": "Lactation physiology I p.3",
        "body": [
          {
            "text": "สไลด์นี้ list หัวข้อที่เหลือของวิชาไว้ ให้รู้ว่ามันมีอยู่ แต่รายละเอียดไม่ได้อยู่ในเด็คนี้"
          },
          {
            "bullets": [
              "**Functions**: colostrum & immunity, milk & nutrient, mother & offspring bond",
              "**Lactation in dairy goat & cattle**: high environmental temperature (HTa), eating behavior, home made ration (HMR), DCAD, fat supplementation, R:C ratio, hormonal control of lactation คือ somatotropin, lactation curve & persistency",
              "**Diseases of mammary gland & abnormal in lactation**: mastitis, milk fever, low milk fat syndrome, breast cancer, delay lactogenesis, subclinical ketosis"
            ]
          },
          {
            "callout": "หัวข้อกลุ่มนี้มีแต่ชื่อบนสไลด์ สไลด์ไม่ได้บอกกลไกหรือรายละเอียดใด ๆ ของมันในเด็คนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lactation strategies แบ่งตามกลุ่มสัตว์",
        "source": "Lactation physiology I p.6",
        "body": [
          {
            "bullets": [
              "**Monotremes** (platypus & echidna): Letherly-shelled eggs & altricial young",
              "**Marsupials** (tammar wallaby, koala): short intrauterine fetus development & altricial young",
              "**Eutherians**: long intrauterine fetus development & altricial young"
            ]
          }
        ]
      },
      {
        "heading": "Lactation length เทียบข้ามสปีชีส์",
        "source": "Lactation physiology I p.7",
        "body": [
          {
            "bullets": [
              "**Short lactation length**: earless seal (Phocidae) เพียง **4-5 days** โดยตัวอย่างที่ยกคือ hooded seal (Cystophora cristata)",
              "**Long lactation length**: **over 900 days** ใน primates คือ chimpanzees & orangutang",
              "ความยาวของ lactation **correlated with female body mass** แต่มี outlier คือ earless seal & whales",
              "ในกลุ่ม eutherians **primates และ bats มี lactation length ยาวที่สุด**"
            ]
          }
        ]
      },
      {
        "heading": "Diversity of milk composition",
        "source": "Lactation physiology I p.8",
        "body": [
          {
            "bullets": [
              "**Fat content** กวาดตั้งแต่ **rhinoceros (0%) ถึง pinnipeds (50%)**",
              "**Protein composition** ยกตัวอย่างสองแบบ คือ **asynchronous concurrent lactation (ACL)** ใน tammar wallaby และการเปลี่ยนจาก **colostrum ไป mature milk** ใน eutherian"
            ]
          },
          {
            "callout": "สไลด์ให้แค่ช่วงตัวเลข fat content กับชื่อรูปแบบ protein composition ไม่ได้บอกว่าองค์ประกอบโปรตีนต่างกันอย่างไรในเชิงตัวเลข",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Anatomy ของ mammary gland: number, position, size & shape",
        "source": "Lactation physiology I p.10",
        "body": [
          {
            "bullets": [
              "**Number**: pair(s) or odd",
              "**Position**: ventral thorax and abdomen, ventral thorax, ventral abdomen และ dorsolateral ซึ่งสไลด์ใส่เครื่องหมายคำถามไว้เอง (?)",
              "**Size & shape**: breast หรือ udder"
            ]
          },
          {
            "callout": "ตำแหน่ง dorsolateral สไลด์เขียนกำกับ (?) ไว้เอง แปลว่าอาจารย์ตั้งไว้เป็นข้อสงสัย ไม่ใช่ข้อสรุป",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ทางเดินน้ำนม: cistern และ teat canal",
        "source": "Lactation physiology I p.11",
        "body": [
          {
            "text": "ไล่จากบนลงล่างตามที่สไลด์ label ไว้"
          },
          {
            "bullets": [
              "**Opening from milk ducts**",
              "**Gland cistern**",
              "**Fuerstenberg's rosette**",
              "**Teat cistern** และ **teat sinus**",
              "**Teat canal**"
            ]
          },
          {
            "sub": "จำนวน gland ต่อ udder",
            "body": [
              {
                "bullets": [
                  "**Cow udder: หนึ่ง udder ประกอบด้วย 2 pairs of gland**",
                  "**Goat udder: หนึ่ง udder ประกอบด้วย 1 pair of gland**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Blood supply และ suspensory ligaments",
        "source": "Lactation physiology I p.12",
        "body": [
          {
            "sub": "Blood supply",
            "body": [
              {
                "bullets": [
                  "**External pudic artery** แตกต่อเป็น cranial & caudal mammary artery",
                  "หลอดเลือดดำคือ **external pudic vein** และ **subcutaneous abdominal vein**",
                  "**Mammary blood flow เท่ากับ 15.6% (7 L/min) ของ cardiac output 45 L/min** ตัวเลขนี้อ้างจาก udder ของ Jersey cow น้ำหนัก 350 kg ที่ peak of lactation",
                  "**Mammary blood flow ต่อ milk yield เท่ากับ 500 ต่อ 1**"
                ]
              }
            ]
          },
          {
            "sub": "Suspensory ligaments (SL)",
            "body": [
              {
                "bullets": [
                  "**Superficial & deep lateral SL**",
                  "**Median SL**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Histology: ชนิดเซลล์ใน mammary gland",
        "source": "Lactation physiology I p.13",
        "body": [
          {
            "sub": "Parenchymal cells",
            "body": [
              {
                "bullets": [
                  "**Alveolar cells**",
                  "**Myoepithelial cells**",
                  "**Alveolar duct**"
                ]
              }
            ]
          },
          {
            "sub": "Stromal cells",
            "body": [
              {
                "bullets": [
                  "**Adipose หรือ fat cells**",
                  "**Fibroblast**",
                  "**Immune cells**"
                ]
              }
            ]
          },
          {
            "text": "และมี **alveolar capillaries & nerve** ประกอบอยู่ด้วย"
          }
        ]
      },
      {
        "heading": "Pre-natal mammogenesis (mammogenesis I)",
        "source": "Lactation physiology I p.15-16",
        "body": [
          {
            "bullets": [
              "**Pre-natal mammary growth หรือ mammogenesis I คือขั้น programming**",
              "ถูกควบคุมด้วย **interaction ระหว่าง epithelium กับ mesenchyme**",
              "มี **local signaling molecules หลายตัว** ที่รับผิดชอบการควบคุม mammogenesis I"
            ]
          },
          {
            "text": "ที่ **E18.5** mammary bud ประกอบด้วย **duct system, fat pad, mesenchymal cell และ nipple** (p.16)"
          },
          {
            "callout": "สไลด์บอกว่ามี local signaling molecules หลายตัว แต่ไม่ได้ระบุว่าเป็นโมเลกุลใดบ้าง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Post-natal mammogenesis (mammogenesis II) และ terminal end bud",
        "source": "Lactation physiology I p.17, 19",
        "body": [
          {
            "bullets": [
              "**Isometric mammary growth** คือรูปแบบการโตในช่วงนี้",
              "โครงสร้างสำคัญคือ **terminal end bud (TEB)**",
              "ใน mouse ช่วง **pre-pubertal period (before 3 weeks)** สไลด์เขียนว่า growth hormone & estrogens พร้อมเครื่องหมาย (?)"
            ]
          },
          {
            "sub": "TEB activities (p.19)",
            "body": [
              {
                "bullets": [
                  "**Proliferation**",
                  "**Program cell death**",
                  "**Extracellular matrix remodelling**"
                ]
              }
            ]
          },
          {
            "callout": "บทบาทของ GH และ estrogens ในช่วง pre-pubertal ของหนู สไลด์ใส่ (?) กำกับไว้เอง ไม่ได้ยืนยัน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Peri-pubertal period: ductal elongation และ branching",
        "source": "Lactation physiology I p.20",
        "body": [
          {
            "bullets": [
              "**Peri-puberty period คือ 3-4 weeks ใน mouse ควบคุมโดย estrogens**",
              "เกิด **ductal elongation**",
              "เกิด **bifurcation (2X primary ducts)** และ **lateral side branching** ได้ท่อลำดับที่สองเพิ่มขึ้นหนึ่ง",
              "**Formation of lateral & alveolar bud เกิดในช่วง post-pubertal period ควบคุมโดย progesterone** พร้อม lateral side branching ที่ให้ท่อลำดับที่สาม",
              "**Puberty growth ของ mammary gland หยุดที่อายุ 10-12 weeks**"
            ]
          }
        ]
      },
      {
        "heading": "Knockout models ที่ใช้พิสูจน์ฮอร์โมนในช่วง ductal growth",
        "source": "Lactation physiology I p.21-24",
        "body": [
          {
            "text": "สี่สไลด์กลุ่มนี้ (p.21, 22, 23, 24) เป็นรูปเปรียบเทียบ knockout กับ wild type โดย p.22 มีข้อความบรรยายวิธี graft กำกับไว้ด้วย"
          },
          {
            "bullets": [
              "**αERKO** คือ estrogen receptor knockout mouse เทียบกับ WT ที่อายุ 3, 4 และ 10 weeks (p.21)",
              "**GHRKO** คือ growth hormone receptor knockout mouse เทียบกับ WT โดยเนื้อเยื่อ GHRKO และ control ถูก **grafted เข้า gland คนละข้างของ recipient ตัวเดียวกัน แล้วเก็บ 8 weeks หลังผ่าตัด** (p.22)",
              "**IGFKO** คือ IGF-I knockout mouse เทียบกับ WT (p.23-24)"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนข้อสรุปเป็นตัวอักษรว่าผลของแต่ละ knockout ออกมาอย่างไร ต้องอ่านจากรูปในคาบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Progesterone receptor knockout (PRKO)",
        "source": "Lactation physiology I p.26",
        "body": [
          {
            "bullets": [
              "**Double PRKO: PR is required for pregnancy associated mammary ductal branching**",
              "**PR is required for lobuloalveolar differentiation**",
              "เทียบ **PRAKO กับ PRBKO** แล้วพบว่า **PRB สำคัญกว่า PRA**"
            ]
          }
        ]
      },
      {
        "heading": "Alveologenesis ในช่วงตั้งท้อง",
        "source": "Lactation physiology I p.27",
        "body": [
          {
            "text": "**Alveologenesis คือการทำให้ mammogenesis II สมบูรณ์ (P 16.5)**"
          },
          {
            "bullets": [
              "**Side branching หรือ tertiary duct ควบคุมโดย progesterone**",
              "**Alveolar bud ควบคุมโดย prolactin**"
            ]
          },
          {
            "text": "รูปประกอบเป็น cow mammary epithelial cell ที่ **mid-pregnancy (150 days)** กำลังขยายสูงสุด 5,000 เท่า โดย label ไว้ว่า E คือ endoplasmic reticulum, G คือ golgi apparatus, L คือ lipid droplet, N คือ nucleus"
          }
        ]
      },
      {
        "heading": "Lactogenesis I: การ differentiate ของเซลล์ให้พร้อมหลั่ง",
        "source": "Lactation physiology I p.28-29",
        "body": [
          {
            "text": "**Alveolar differentiation เกิดระหว่างตั้งท้อง และนี่คือ lactogenesis I หรือ initiation phase**"
          },
          {
            "sub": "สิ่งที่เกิดใน mammocyte",
            "body": [
              {
                "bullets": [
                  "**Mammocyte secretory compartment differentiation** ได้แก่ golgi apparatus, ER, mitochondria และ lipid droplets",
                  "**Polarization** ของเซลล์ สไลด์ p.29 วางรูป non polarized cell เทียบกับ polarized cell โดยชี้ตำแหน่ง rER, nucleus, mitochondria และ golgi",
                  "**Mammocyte specific gene expression** คือ enzyme สำหรับ lactose synthesis และ milk protein expression"
                ]
              }
            ]
          },
          {
            "text": "รูปเทียบอีกใบเป็น cow mammary epithelial cell ที่ **three weeks after parturition** ขยายสูงสุด 5,000 เท่า ใช้ label ชุดเดียวกับสไลด์ก่อนหน้า"
          }
        ]
      },
      {
        "heading": "Enzyme ที่ถูกเปิดใน lactogenesis I",
        "source": "Lactation physiology I p.30-32",
        "body": [
          {
            "sub": "Lactose synthetic pathway (p.30)",
            "body": [
              {
                "bullets": [
                  "**UDP glucose-4-epimerase**",
                  "**UDP glucose pyrophosphorylase**",
                  "**Lactose synthetase**"
                ]
              }
            ]
          },
          {
            "sub": "Fatty acid metabolism (p.31)",
            "body": [
              {
                "bullets": [
                  "**Acetyl-CoA-synthetase**",
                  "**Lipoprotein lipase**"
                ]
              }
            ]
          },
          {
            "sub": "Casein synthetic pathway (p.32)",
            "body": [
              {
                "text": "สไลด์มีแต่หัวเรื่องกับรูป **สไลด์ไม่ได้บอก** ชื่อ enzyme ในเส้นทางนี้เป็นตัวอักษร"
              }
            ]
          }
        ]
      },
      {
        "heading": "Colostrogenesis: IgG ข้ามเซลล์ด้วย FcRn",
        "source": "Lactation physiology I p.33",
        "body": [
          {
            "text": "สไลด์วางลำดับสี่ขั้นจากด้าน basal ไป apical พร้อมกำกับ pH ไว้"
          },
          {
            "bullets": [
              "**1 Fluid-phase endocytosis** ที่ด้าน basal ซึ่ง pH 7.4",
              "**2 Endosome acidification** ลงมาที่ **pH 6.0**",
              "**3 IgG-FcRn binding** โดย FcRn คือ neonatal Fc receptor",
              "**4 Transcytosis mechanism** ออกด้าน apical ซึ่งกลับเป็น pH 7.4 ได้เป็น colostrum"
            ]
          },
          {
            "callout": "จุดที่ต้องจำคือ IgG จับ FcRn ได้ที่ pH เป็นกรดใน endosome แล้วปล่อยออกฝั่ง apical ที่ pH 7.4 ตามที่สไลด์ไล่ลำดับไว้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Lactogenesis II: จุดเริ่มหลั่งน้ำนมจริง",
        "source": "Lactation physiology I p.34",
        "body": [
          {
            "text": "**Lactogenesis II คือช่วงที่ mammary gland เริ่ม secretion process ทั้ง colostrum และ milk** มี copious milk secretion และมีการเปลี่ยนองค์ประกอบจาก colostrum ไปเป็น mature milk"
          },
          {
            "text": "**The high level of prolactin and the fall of progesterone are necessary for the onset of lactogenesis II**"
          },
          {
            "bullets": [
              "**Prolactin (Prl) is essential for lactogenesis**",
              "**Growth hormone is lactogenic in many species**",
              "**Exogenous progesterone prevents lactose and lipid synthesis** แม้จะเอาแหล่ง endogenous progesterone ออกไปแล้ว"
            ]
          },
          {
            "text": "สไลด์ถัดไป (p.35) เป็นกราฟ plasma progesterone ช่วง peri-parturition ใน mouse, women และ dairy cattle เป็นรูปอย่างเดียว ไม่มีข้อความสรุป"
          }
        ]
      },
      {
        "heading": "Galactopoiesis: การคงสภาพการให้นม",
        "source": "Lactation physiology I p.36-37",
        "body": [
          {
            "text": "p.36 วาง timeline ของ bovine, rat และ human ให้เห็นว่า **lactogenesis I ไป lactogenesis II ไป galactopoiesis ไป involution** วางตัวอย่างไรเทียบกับ pregnancy (P) และ lactation (L) โดยใน bovine มีหมุด 105, 165 และ 221 และปิดท้ายด้วย Dry1 กับ Dry2"
          },
          {
            "sub": "บทบาทของ prolactin ต่างกันตามสปีชีส์ (p.37)",
            "body": [
              {
                "bullets": [
                  "ในหลายสปีชีส์ การกด prolactin ระหว่าง lactation มี **dramatic effect** ต่อ milk secretion เช่น **rabbit, mouse & pig**",
                  "**ใน ruminant การกด prolactin จาก 30 เหลือ 3 ng/ml มีผลน้อยมากต่อ milk yield**",
                  "**ใน goat การกด prolactin ทำให้ milk yield ลดลง 10-15%**",
                  "**ใน ruminant มีการแสดงความสัมพันธ์ระหว่าง milk yield กับ plasma GH**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Involution: โมเดลสัตว์สองแบบ",
        "source": "Lactation physiology I p.38",
        "body": [
          {
            "bullets": [
              "**Rodents มี gestation และ lactation period แยกกัน จึงเกิด complete involution**",
              "**Bovine มี gestation ซ้อนทับกับ lactation period จึงมี dry period และเป็น regenerative involution**"
            ]
          }
        ]
      },
      {
        "heading": "Phases ของ involution ใน rodent",
        "source": "Lactation physiology I p.39-40",
        "body": [
          {
            "sub": "แบ่งตามวันหลังหย่านม (p.40)",
            "body": [
              {
                "bullets": [
                  "**First reversible phase: 1-3 days after weaning** เกิด removal of mammary epithelial cell ผ่าน **program cell death (PCD)**",
                  "**Second irreversible phase: 4-10 days after weaning** เกิด tissue remodeling ผ่าน **matrix metalloproteinase (MMP)** และ **plasmin/plasminogen system (PPS)**"
                ]
              }
            ]
          },
          {
            "sub": "แบ่งตามชั่วโมงในหนู (p.39)",
            "body": [
              {
                "bullets": [
                  "**0-12 hrs และ 12-48 hrs ยัง reversible**",
                  "**มากกว่า 72 hrs กลายเป็น irreversible**"
                ]
              }
            ]
          },
          {
            "callout": "สองสไลด์นี้ใช้หน่วยเวลาคนละแบบ p.39 นับเป็นชั่วโมงและตัดที่ 72 hrs ส่วน p.40 นับเป็นวันหลัง weaning และตัดที่วันที่ 3 ถึง 4 ให้ตอบตามสไลด์ที่โจทย์อ้างถึง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Marker ระดับ mRNA ที่ใช้ติดตาม involution",
        "source": "Lactation physiology I p.43",
        "body": [
          {
            "text": "สไลด์วิเคราะห์ mRNA จาก mouse mammary gland ที่ involute เป็นช่วงเวลาต่าง ๆ โดยตัวย่อบนสไลด์แปลว่า"
          },
          {
            "bullets": [
              "**SGP-2** คือ sulfated glycoprotein-2 ซึ่งเป็น **apoptotic marker**",
              "**TIMP-1** คือ tissue inhibitor of metalloproteinase",
              "**Beta-casein**",
              "**Gelatinase A** เป็น MMP",
              "**Stromelysin-1** เป็น MMP",
              "**Urokinase** คือ urokinase plasminogen activator (uPA)"
            ]
          },
          {
            "text": "สไลด์ 41-42 เป็นรูป histology ของ involution วันที่ 2, 3 และ 4 เทียบกับ lactation วันที่ 7 โดยลูกศรชี้ apoptotic cells ใน lumen ของ alveolus ลูกศรตรงชี้ collapsed alveoli และลูกศรโค้งชี้ adipocytes"
          }
        ]
      },
      {
        "heading": "Involution ใน bovine และ dry period",
        "source": "Lactation physiology I p.44, 46-47",
        "body": [
          {
            "bullets": [
              "**Overlapping ของ lactation กับ gestation period** คือลักษณะเฉพาะของโค",
              "**Dry period ยาว 40-60 days และมีผลต่อ milk yield** (p.44)"
            ]
          },
          {
            "text": "p.46 เทียบภาพต่อมนมโคที่ dry ต่างกันคือ **7-day, 25-day, 40-day และ 53-day dry** เป็นรูปอย่างเดียว"
          },
          {
            "text": "p.47 สรุป **mammary epithelial cell turnover ช่วง late gestation ถึง early lactation** โดยแท่งสีดำคือ **60 days dry** และแท่งสีเทาคือ **continuous milking**"
          },
          {
            "callout": "สไลด์บอกว่า dry period มีผลต่อ milk yield และเทียบ 60 days dry กับ continuous milking ไว้ในรูป แต่ไม่ได้เขียนตัวเลขผลลัพธ์เป็นข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "หมายเหตุเรื่องธุรการและสไลด์ที่ไม่มีเนื้อหา",
        "source": "Lactation physiology I p.4-5",
        "body": [
          {
            "bullets": [
              "p.4 เป็นเรื่องหนังสือประกอบ ราคา **350 บาทที่ศูนย์หนังสือจุฬาฯ** หรือ **300 บาทจากอาจารย์** และมี **บริจาคสำหรับนิสิต 20 เล่ม (ฟรี)**",
              "p.5 เป็นรายการอ้างอิงล้วน ๆ ไม่มีเนื้อหาวิชาการ",
              "p.9, 14, 18, 25, 45 เป็นหัวเรื่องหรือ figure legend โดยไม่มีข้อความอธิบายเพิ่ม"
            ]
          }
        ]
      }
    ]
  },
  "physio-3--lactation-physiology-ii": {
    "topic": "physio-3--lactation-physiology-ii",
    "title": "Lactation Physiology II",
    "icon": "📗",
    "lecturer": "สัมพันธ์ ธรรมเจริญ",
    "summary": "เด็คนี้เป็น Lactation physiology ที่เน้นระดับเซลล์ของ mammary gland เป็นหลัก คือ colostrogenesis และการถ่ายทอด IgG1 สู่ลูกสัตว์ องค์ประกอบน้ำนมเปรียบเทียบข้ามสปีชีส์ ห้าเส้นทางของการหลั่งน้ำนม การสังเคราะห์ lactose (lactose synthase = GT กับ alpha-lactalbumin) การสังเคราะห์ casein และ milk fat รวมถึง low milk fat syndrome ต่อด้วย aqueous phase (Na K Cl, phosphate, calcium และ milk fever, iodide) paracellular route แล้วปิดท้ายด้วย lactation curve กับ hormonal control (oxytocin, prolactin, growth hormone) สไลด์ p.2-3 เป็นภาพโบราณคดีเรื่องการรีดนมวัวที่ไม่มีเนื้อหาสรีรวิทยา และมีอีกหลายหน้า (p.7, p.8, p.25, p.26, p.27, p.30, p.31, p.33, p.37, p.47, p.48, p.50) ที่เป็นรูป diagram หรือกราฟล้วนโดยไม่มีข้อความให้อ่านได้ ส่วน p.55 เป็นประกาศขายหนังสือ ไม่ใช่เนื้อหาวิชาการ",
    "sections": [
      {
        "heading": "ขอบเขตของเด็คนี้",
        "source": "Lactation Physiology II p.4",
        "body": [
          {
            "text": "สไลด์วางหัวข้อทั้งหมดไว้เป็น 3 กลุ่ม ใช้เป็นแผนที่อ่านสอบได้เลย"
          },
          {
            "bullets": [
              "Lactation and mammary gland physiology: Functions ได้แก่ Colostrum และ immunity, Milk และ nutrient, Mother และ offspring bond",
              "Lactation in dairy cattle: Lactation curve และ persistency, Hormonal control of lactation คือ somatotropin, Environmental effect คือ Heat stress",
              "Diseases of mammary gland และ abnormal in lactation: Breast cancer, Mastitis, Delay lactogenesis, Milk fever, Low milk fat syndrome"
            ]
          },
          {
            "callout": "หัวข้อโรคที่ประกาศไว้ใน p.4 เนื้อเด็คลงรายละเอียดจริงเฉพาะ Milk fever (p.42) และ Low milk fat syndrome (p.32, p.36) ส่วน Breast cancer, Mastitis และ Delay lactogenesis สไลด์ไม่ได้บอกรายละเอียดไว้ (mastitis ถูกเอ่ยถึงเพียงในฐานะตัวอย่างของ paracellular route)",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Colostrogenesis และการถ่ายทอดภูมิคุ้มกัน",
        "source": "Lactation Physiology II p.5",
        "body": [
          {
            "bullets": [
              "Colostrogenesis เริ่ม 4-5 weeks prepartum",
              "ใน ruminant เป็น Syndesmochorial placenta จึงเป็นเหตุผลที่ immunoglobulin ผ่านรกไม่ได้",
              "**Calves are born agammaglobulinemic**",
              "**The major Ig in bovine colostrum is IgG1**",
              "Passive immunity: ประมาณ 35% ของ dairy calves ถูกประเมินว่าเกิด FPT",
              "FPT = Failure of passive transfer"
            ]
          },
          {
            "sub": "Factors influencing IgG transfer in calves",
            "body": [
              {
                "bullets": [
                  "Timing of ingestion: **non-selective absorption เกิดในช่วง 24-36 hr postpartum แล้วปิดตัวลงเรียกว่า Closure**",
                  "Quality of colostrum: สไลด์ระบุเกณฑ์ > 50 g/L และปริมาณ 2 L"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เส้นทางลำเลียง Ig และการเปลี่ยนแปลงของน้ำนมช่วงแรก",
        "source": "Lactation Physiology II p.6",
        "body": [
          {
            "text": "หน้านี้เป็นแผนภาพ transcytosis ข้าม mammary epithelial cell มีเพียงป้ายกำกับสั้น ๆ คือฝั่ง Basal pH 7.4 ผ่าน vesicle ที่ pH 6.0 แล้วออกทางฝั่ง Apical ที่ pH 7.4 พร้อมป้าย IgA กำกับ"
          },
          {
            "callout": "สไลด์หน้านี้ไม่ได้อธิบายกลไกเป็นข้อความ บอกได้เท่าที่ป้ายกำกับเขียนไว้เท่านั้น ส่วน p.7 (colostrum) และ p.8 (Change in milk volume and composition, อ้าง Neville MC., 2001) เป็นรูปล้วน ไม่มีข้อความให้สรุป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "องค์ประกอบน้ำนมเปรียบเทียบข้ามสปีชีส์",
        "source": "Lactation Physiology II p.9",
        "body": [
          {
            "text": "ตารางเทียบ Fat, Protein (Casein/Whey), Lactose, Ash และ Total Solid ระหว่างวัวสายพันธุ์ต่าง ๆ กับสัตว์ชนิดอื่น"
          },
          {
            "bullets": [
              "Cows: fat 3.90%, protein 3.20%, lactose 4.60%, ash 0.72%, total solid 12.60%",
              "สายพันธุ์วัว fat เรียงได้ Ayrshire 3.97, Brown Swiss 3.80, Guernsey 4.58, Holstein 3.56, Jersey 4.97 โดย Jersey มี total solid สูงสุด 14.15%",
              "Sheep fat 7.10% protein 5.70% total solid 18.20%",
              "Goats fat 3.60% protein 3.30% total solid 12.10%",
              "**Dog fat 9.47% protein 7.53% total solid 22.70% และ Cat fat 12.70% protein 8.70% total solid 27.90% คือเข้มข้นกว่าน้ำนมวัวมาก**",
              "**Horse ตรงข้าม คือ fat ต่ำสุด 1.57% protein 2.17% แต่ lactose สูงสุด 6.36% และ total solid ต่ำสุด 10.80%**"
            ]
          },
          {
            "text": "ในคอลัมน์ Casein/Whey ที่สไลด์แจกแจงเฉพาะสายพันธุ์วัวจะเห็นว่า casein มากกว่า whey ทุกสายพันธุ์ เช่น Ayrshire 2.68/0.60, Jersey 3.02/0.63"
          }
        ]
      },
      {
        "heading": "สัตว์ที่น้ำนมสุดขั้ว",
        "source": "Lactation Physiology II p.10",
        "body": [
          {
            "text": "ตารางที่สองขยายไปยังสัตว์กลุ่มอื่น โดยเทียบกับ Cows fat 3.90%"
          },
          {
            "bullets": [
              "**Blue whale fat 39.40% และ Common dolphin fat 30.00%**",
              "Rabbit fat 16.70%",
              "Elephant fat 9.30%",
              "Pig fat 8.50%",
              "Human fat 3.80%"
            ]
          },
          {
            "callout": "แถว Camel ในสไลด์ไม่มีตัวเลข fat ปรากฏใน text layer และคอลัมน์ protein กับ total solid ของหน้านี้เรียงไม่ตรงกับชื่อแถว จึงจับคู่ตัวเลขให้แน่นอนไม่ได้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Carbohydrate กับ fat ในน้ำนมสวนทางกัน",
        "source": "Lactation Physiology II p.11",
        "body": [
          {
            "text": "ตารางของ Jones 1977 เรียง order ตาม carbohydrate จากน้อยไปมาก แล้วให้ fat, energy content และสัดส่วนแคลอรีที่มาจาก CHO"
          },
          {
            "bullets": [
              "Pinnipedia (seals): CHO 0.80, fat 43.90 g/100ml, energy 465 kcal/100ml, CHO ให้พลังงาน 1%",
              "Cetacea (whales): CHO 0.90, fat 29.60, 328 kcal, 1%",
              "Lagomorpha (rabbits): 1.40, 17.40, 266 kcal, 2%",
              "Muridae (mice): 1.80, 14.70, 206 kcal, 4%",
              "Marsupialia (kangaroos): 3.90, 4.80, 94 kcal, 16%",
              "Felidae (cats): 4.10, 10.50, 169 kcal, 9%",
              "Proboscidea (elephants): 4.20, 10.50, 141 kcal, 12%",
              "Bovidea (cows): 4.70, 5.20, 99 kcal, 19%",
              "Camelidae (camels): 5.40, 4.10, 87 kcal, 24%",
              "Equidae (horses): 6.80, 1.70, 54 kcal, 50%",
              "Primates: 6.90, 4.10, 79 kcal, 34%"
            ]
          },
          {
            "callout": "**อ่านตารางนี้ให้ออกว่า carbohydrate ยิ่งสูง fat ยิ่งต่ำ และพลังงานรวมยิ่งต่ำ แมวน้ำกับวาฬได้พลังงานจาก CHO เพียง 1% ส่วนม้าได้ถึง 50%**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ข้อมูลน้ำนมของไทย",
        "source": "Lactation Physiology II p.12",
        "body": [
          {
            "text": "สไลด์เอาตารางสายพันธุ์วัวชุดเดิมมาต่อด้วยข้อมูลไทย คือ Crossbred HF แยกเป็น Early, Mid, Late (อ้าง ChaiyabutrN07a) และ Crossbred dairy goat (อ้าง ThammacharoenT14a) เทียบกับ Goat Thailand ที่ fat 3.60% protein 3.30% lactose 4.60% total solid 12.10%"
          },
          {
            "callout": "ตัวเลขของแถวไทยใน text layer เรียงไม่ตรงกับชื่อแถว จึงระบุไม่ได้ว่าค่า fat protein lactose ใดเป็นของ Early Mid Late หรือของแพะลูกผสม สไลด์ในไฟล์ที่อ่านได้บอกได้แค่ว่ามีการเก็บข้อมูลชุดนี้ไว้เทียบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การจำแนกองค์ประกอบน้ำนม",
        "source": "Lactation Physiology II p.13",
        "body": [
          {
            "bullets": [
              "milk sugar: Lactose และ other oligosaccharides",
              "milk protein แบ่งเป็น Milk specific คือ Casein และ Whey protein กับ Milk non-specific คือ Serum protein และ enzyme",
              "milk fat: Triglyceride",
              "**Solid phase of milk: Fat globule, Casein micelle และส่วนที่เหลือคือ whey**",
              "Aqueous phase of milk: Ionics คือ Cationic และ Anionic ส่วน Non-Ionics คือ Lactose และ urea"
            ]
          }
        ]
      },
      {
        "heading": "ห้าเส้นทางของการหลั่งน้ำนม",
        "source": "Lactation Physiology II p.15",
        "body": [
          {
            "text": "Five major routes of milk secretion ตามแบบจำลองของ Linzell และ Peaker 1971 และ Shennan และ Peaker 2000"
          },
          {
            "bullets": [
              "**1. Membrane route: water, urea, Na+, K+ และ Cl-**",
              "**2. Golgi route: lactose, casein, citrate, calcium**",
              "**3. Milk fat route: fat globule**",
              "**4. Transcytosis route: IgG (colostrum)**",
              "**5. Paracellular route: interstitial fluid ซึ่งสไลด์วงเล็บกำกับว่า mastitis**"
            ]
          },
          {
            "text": "สไลด์ p.14 ที่มาก่อนหน้าเป็นรูป overview ของ Lactose synthesis, Casein synthesis, Fat synthesis, Aqueous phase และ Milk secretion โดยไม่มีข้อความอธิบาย"
          }
        ]
      },
      {
        "heading": "Lactose synthesis: ปฏิกิริยาและเอนไซม์",
        "source": "Lactation Physiology II p.16",
        "body": [
          {
            "bullets": [
              "**UDP-galactose + glucose ผ่าน Lactose synthase (GT ร่วมกับ alpha-LA) โดยต้องมี Mn2+ ได้ Lactose + UDP**",
              "Lactose MW = 342.30 และ Glucose MW = 180.16",
              "**Cows lactose producing capacity: 4.7 g% = 47 g/L = 940 g สำหรับน้ำนม 20 L**",
              "**sea-lion ไม่มี alpha-LA จึงไม่มี lactose ในน้ำนม sea-lion**"
            ]
          },
          {
            "callout": "สไลด์ตั้งหัวข้อ The rate limiting factor of lactose synthesis แล้ววาง UDP-Galactose, Lactose synthase, Galactosyltransferase (GT) และ alpha-lactalbumin ไว้ พร้อมความเข้มข้น intracellular ใน rat mammary gland สองค่าคือ 0.1-0.3 mmol/L และ 60-80 micromol/L แต่ text layer เรียงสลับกันจนบอกไม่ได้ว่าค่าไหนคู่กับสารใด และสไลด์ที่อ่านได้ไม่ได้ชี้ชัดว่าตัวใดคือ rate limiting factor",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "เส้นทางเมแทบอลิซึมสู่ lactose ในเซลล์",
        "source": "Lactation Physiology II p.18",
        "body": [
          {
            "text": "แผนภาพเดินจาก glucose เข้าเซลล์แล้วแปลงเป็น G-6-P ไปเป็น UDP-Glucose และ UDP-Galactose ก่อนเข้า Golgi apparatus"
          },
          {
            "bullets": [
              "ใน Golgi App เกิด lactose synthase ทำงานบน UDP-Galactose กับ Glucose ได้ Lactose แล้วปล่อย UMP",
              "alpha-lactalbumin เป็น soluble protein ส่วน Galactosyltransferase เป็น membrane bounded protein",
              "มี ST คือ sialyltransferase ที่ใช้ CMP sialic acid และ FT คือ fucosyltransferase ซึ่งสไลด์เขียนสารตั้งต้นไว้ว่า GDP Fructose สร้าง Milk sugars ตัวอื่นนอกเหนือจาก lactose",
              "RER อยู่ต้นทางก่อน Golgi App"
            ]
          },
          {
            "callout": "หมายเหตุนอกสไลด์ ไม่ใช่ข้อความบนสไลด์: ตำรามาตรฐานเขียนสารตั้งต้นของ fucosyltransferase ว่า GDP-fucose ส่วนสไลด์ p.18 เขียนว่า GDP Fructose เวลาเปิดสไลด์ตามให้หาคำว่า GDP Fructose",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ตัวขนส่งและวงจรที่ป้อน lactose synthesis",
        "source": "Lactation Physiology II p.19",
        "body": [
          {
            "bullets": [
              "**GLUT1 นำ Glucose เข้า และ UDP-Gal transporter นำ UDP-Galactose เข้า Golgi App**",
              "Glucose ในเซลล์ไปได้หลายทางคือ G-6-P ต่อไป G-1-P แล้วเป็น UDP-Glucose และ UDP-Galactose",
              "G-6-P ยังเข้า Pentose Phosphate Shunt ให้ NADPH และเข้าสาย F-6-P, Phosphoenolpyruvate, Pyruvate สู่ Citric acid cycle ใน Mitochondria แล้วได้ Citrate ออกมา"
            ]
          }
        ]
      },
      {
        "heading": "Glucose uptake และ Galactosyltransferase",
        "source": "Lactation Physiology II p.20",
        "body": [
          {
            "sub": "Glucose uptake และ glucose transport ใน mammary cell",
            "body": [
              {
                "bullets": [
                  "**Glucose uptake (mg/min) = Mammary blood flow (L/min) x A-V difference of Glucose (mg/ml)**",
                  "GLUT1 is the major transporter in mammary cell",
                  "**The expression of GLUT1 is controlled by both prolactin และ growth hormone**"
                ]
              }
            ]
          },
          {
            "sub": "Galactosyltransferase (GT)",
            "body": [
              {
                "bullets": [
                  "เป็น Golgi apparatus membrane bound protein",
                  "เป็น Glycoprotein enzyme ขนาด 40-60 kDa MW",
                  "**The substrate of GT in vivo is UDP-Galactose**",
                  "**ปฏิกิริยาต้องการ divalent cation คือ Mn2+**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "alpha-lactalbumin: โครงสร้างและหน้าที่",
        "source": "Lactation Physiology II p.21",
        "body": [
          {
            "text": "ระดับ alpha-LA ในน้ำนมที่สไลด์ระบุคือ 70-480 micromol/L"
          },
          {
            "bullets": [
              "เป็น soluble protein ขนาดประมาณ 14 kDa MW ที่มี ratio ของ essential amino acids สูง",
              "alpha-LA มี aa sequence homology กับ human และ egg-white lysozyme",
              "**alpha-LA change the affinity of UDP-Galactose to GT**",
              "alpha-LA เป็น metalloprotein ที่มี high affinity binding site สำหรับ Ca2+"
            ]
          },
          {
            "text": "แผนภาพข้างสไลด์แสดง beta1-4 GT1 ที่มี Cytoplasmic domain, Transmembrane, Stem และ Catalytic domain ยื่นเข้า Golgi lumen โดยมี Mn2+ กับ UDP จับที่ catalytic domain"
          }
        ]
      },
      {
        "heading": "การควบคุมและบทบาทของ alpha-lactalbumin",
        "source": "Lactation Physiology II p.22",
        "body": [
          {
            "bullets": [
              "**The expression of alpha-LA เกิดก่อน lactose synthesis 12 hr**",
              "**The expression of alpha-LA ต้องการ prolactin และถูกหน่วง (retarded) โดย progesterone**",
              "สัดส่วนต่อโปรตีนรวม สไลด์ให้ human milk 25-35% และ bovine milk 2-5%"
            ]
          },
          {
            "sub": "The physiological role of alpha-LA",
            "body": [
              {
                "bullets": [
                  "Nutritional source of amino acid",
                  "Antimicrobial role",
                  "**A novel alpha-LA/fatty acid complex (C18:1) เรียกว่า HAMLET**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เอ่ยชื่อ HAMLET ไว้เฉย ๆ ไม่ได้อธิบายว่ามันทำอะไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "โปรตีนในน้ำนม",
        "source": "Lactation Physiology II p.23",
        "body": [
          {
            "bullets": [
              "**Caseins are specific milk phosphoproteins ได้แก่ alpha-casein ซึ่งแยกเป็น alphas1-casein และ alphas2-casein, beta-casein และ kappa-casein**",
              "Non-casein proteins (Whey) มีทั้ง milk-specific และ serum proteins",
              "**alpha-lactalbumin: human มากกว่า bovine ส่วน beta-lactoglobulin: bovine มากกว่า human**",
              "Non specific milk protein หรือ serum proteins ที่สไลด์ยกมาคือ Lactoferrin และ Albumin",
              "**The concentration of milk protein: 3.3 g/dl = 33 g/L = 660 g ต่อน้ำนม 20 L ส่วน human milk อยู่ที่ 1.2 g/dl**"
            ]
          },
          {
            "text": "สไลด์ปิดท้ายด้วยหัวข้อ The amino acid requirement for milk protein synthesis แต่ไม่ได้ให้ตัวเลขหรือรายละเอียดไว้"
          }
        ]
      },
      {
        "heading": "Casein micelle",
        "source": "Lactation Physiology II p.24",
        "body": [
          {
            "bullets": [
              "**Casein micelles ขนาด 150-200 nm**",
              "**Comprising app 80% of milk protein**",
              "**Ratio ของ alpha1 : alpha2 : beta : kappa ใน casein molecule = 4 : 1 : 3.5 : 1.5**"
            ]
          },
          {
            "sub": "โครงสร้างตามคำบรรยายใต้ภาพ",
            "body": [
              {
                "bullets": [
                  "alphas- และ beta-caseins เกาะและเชื่อมกับ calcium phosphate nanocluster",
                  "beta-casein บางส่วนจับกับ casein อื่นด้วยแรง hydrophobic และสามารถถูกดึงออกได้ด้วยการทำให้เย็น",
                  "**para kappa-casein และ caseinomacropeptide chain อยู่ที่ส่วนนอกสุดของผิว micelle**",
                  "ในโครงสร้างมีบริเวณที่เป็นน้ำแทรกอยู่ภายใน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Casein kinase",
        "source": "Lactation Physiology II p.28",
        "body": [
          {
            "bullets": [
              "**Subcellular location of Casein kinase: Golgi apparatus**",
              "**Dephosphorylated caseins are the best substrates**",
              "**The enzymatic pathway needs Ca2+**"
            ]
          },
          {
            "callout": "p.25 และ p.26 ที่มาก่อนหน้าเป็น electron micrograph ของ lactating mouse mammary epithelial cell (คำบรรยายบอกว่า basolateral region มี ER ปริมาณมาก) และเป็นแผนภาพ Golgi route ตามลำดับ ส่วน p.27 ว่างเปล่าไม่มีข้อความเลย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Milk fat: องค์ประกอบ",
        "source": "Lactation Physiology II p.29",
        "body": [
          {
            "bullets": [
              "**Triacylglycerol (TAG) is the major fat (98%) in milk**",
              "**ในคน milk fat ให้พลังงาน 40-50% ของ total energy content**",
              "The range of TAG in milk อยู่ระหว่าง 0 ถึง 50%"
            ]
          },
          {
            "sub": "Fatty acid composition of TAG ที่สไลด์แบ่งไว้",
            "body": [
              {
                "bullets": [
                  "Short chain fatty acid",
                  "Medium chain fatty acid (C8-14)",
                  "Saturated และ Monounsaturated long chain fatty acid (C16-18)",
                  "Poly unsaturated chain fatty acid (C16-18)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อะไรกำหนดชนิดของ fatty acid ในน้ำนม",
        "source": "Lactation Physiology II p.32",
        "body": [
          {
            "sub": "The fatty acid composition of TAG depend on",
            "body": [
              {
                "bullets": [
                  "Species",
                  "Dietary fat",
                  "Carbohydrate to lipid ratio (สไลด์ให้ดูตารางและ grain rich diet ประกอบ)",
                  "Starvation ซึ่งหมายถึง Depot fat mobilization"
                ]
              }
            ]
          },
          {
            "sub": "The sources of fatty acid for TAG",
            "body": [
              {
                "bullets": [
                  "**Short chain FA (butyric และ hexanoic acid) มาจาก plasma ซึ่งเป็น fermentation product**",
                  "**Medium chain FA มาจาก Glucose และ acetate ผ่าน de novo FA synthesis**",
                  "**Long chain FA มาจาก Dietary fatty acid และ Depot fatty acid**"
                ]
              }
            ]
          },
          {
            "sub": "Factors decrease de novo fatty acid synthesis (medium chain FA)",
            "body": [
              {
                "bullets": [
                  "High fat diet ในคน",
                  "**High grain low forage diet ในโคนม ซึ่งมาพร้อมกับการลดลงของ total milk fat content เรียกว่า low milk fat syndrome (BaumanDE01a/03a)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Major fatty acids ของน้ำนมคนกับน้ำนมวัว",
        "source": "Lactation Physiology II p.34",
        "body": [
          {
            "text": "สไลด์เป็นกราฟเทียบ major fatty acids สองสปีชีส์ มีป้ายกำกับว่า High fat diet, Hi carb diet (และ Fish) และ Product from ruminal fermentation พร้อมช่วงเปอร์เซ็นต์ 5%, 10-15%, 20-30% และ 30-40% กำกับบนแท่ง"
          },
          {
            "callout": "text layer ไม่ได้ผูกช่วงเปอร์เซ็นต์เข้ากับ fatty acid ตัวใดตัวหนึ่ง จึงบอกไม่ได้ว่า 30-40% เป็นของกรดไขมันตัวใด ต้องกลับไปดูรูปจริง สไลด์ p.35 เป็นกราฟชุดเดียวกันที่กำกับ 20-30% และ 10% ในลักษณะเดียวกัน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Low milk fat syndrome",
        "source": "Lactation Physiology II p.36",
        "body": [
          {
            "text": "แผนภาพเดินจากกระเพาะ ruminant (1 Cardia, 2 Rumen, 3 Reticulum, 4 Omasum, 5 Abomasum) มายัง mammary gland"
          },
          {
            "bullets": [
              "**Linoleic acid ถูกเปลี่ยนใน rumen ได้ trans-10 C18:1 และ t10/c12 CLA คือ Trans 10 cis 12 conjugated linoleic acid**",
              "ใน mammary cell แหล่งของ fatty acid มีสามทางคือ Dietary FFA, Depot FFA และ De novo FFA โดยแผนภาพวาง AcetylCoA, MalonylCoA และ FASN ไว้ในเส้นทาง de novo นี้ สไลด์ไม่ได้ระบุว่า FASN เร่งขั้นตอนใด",
              "Fatty acyl CoA รวมกับ Glycerol-3-P ผ่าน Diacylglycerol แล้วมี DGAT1 และ DGAT2 ทำให้ได้ TG"
            ]
          },
          {
            "callout": "จำคู่กับ p.32 ว่า high grain low forage diet คือชนวน และ t10/c12 CLA คือสารที่สไลด์ชี้ในเส้นทางนี้ ส่วนสไลด์ p.37 เป็นภาพการสร้าง milk lipid globule จาก lipid droplet ที่มีแต่ป้ายกำกับ ไม่มีข้อความอธิบาย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Aqueous phase of milk: องค์ประกอบ",
        "source": "Lactation Physiology II p.38",
        "body": [
          {
            "bullets": [
              "Water",
              "**Monovalence ions: Na+, K+ และ Cl-**",
              "**Di หรือ Polyvalence ions: Ca2+, HPO4 และ Mg2+**",
              "Small organic substances: urea, glucose, lactose, whey protein, citrate",
              "Large organic substances: Whey protein และ Immunoglobulin"
            ]
          }
        ]
      },
      {
        "heading": "Na+, K+ และ Cl- ในน้ำนม",
        "source": "Lactation Physiology II p.39",
        "body": [
          {
            "text": "สไลด์อ้าง transport model ของ Linzell และ Peaker (1971)"
          },
          {
            "bullets": [
              "**Na+ และ K+ pump อยู่ที่ basolateral membrane**",
              "**Cl- pump มีทั้งที่ apical membrane และที่ basolateral membrane**",
              "Ouabain-sensitive Na+-K+ ATPase",
              "Na+-K+ และ Cl- cotransport",
              "มีความสัมพันธ์ระหว่างการขนส่ง Na+, K+, Cl- กับการเคลื่อนที่ของน้ำ",
              "**In a number of secretory epithelium, intracellular Cl- is the driving force ของ Na+-K+-Cl- cotransport**"
            ]
          },
          {
            "callout": "สไลด์เขียนคำว่า Lactose พร้อมข้อความสั้นและยกตัวอย่าง pinnipeds ค้างไว้ในบรรทัดเดียวกับเรื่องการเคลื่อนที่ของน้ำ แต่ข้อความไม่สมบูรณ์พอจะสรุปได้ว่าสไลด์ต้องการบอกอะไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Phosphate ในน้ำนม",
        "source": "Lactation Physiology II p.40",
        "body": [
          {
            "text": "Total concentration ของ phosphate ใน goat milk ที่สไลด์ให้ไว้คือ 20.5 mM แบ่งเป็นสามรูปแบบ"
          },
          {
            "bullets": [
              "**Free inorganic orthophosphate (Pi) คือ HPO4 2- และ HPO4 - ที่ 6.7 mM**",
              "**Colloidal phosphate คือ Calcium phosphate ที่จับกับ casein micelles ที่ 8.9 mM**",
              "**Casein phosphate ที่ 4.9 mM**"
            ]
          },
          {
            "sub": "Phosphate transport",
            "body": [
              {
                "bullets": [
                  "**Sodium dependent phosphate cotransport อยู่ที่ basolateral membrane**",
                  "**เนื่องจาก milk phosphate มีความเข้มข้นสูงกว่า plasma phosphate จึงถือว่า Golgi route คือเส้นทางหลัก**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Calcium ในน้ำนมและ milk fever",
        "source": "Lactation Physiology II p.42",
        "body": [
          {
            "text": "p.41 ระบุว่า Milk is a calcium-rich fluid โดยแบ่งรูปของ calcium เป็น Free ionized calcium, Casein bound calcium และ Calcium complexed to inorganic anions คือ Ca-citrate และ Ca-Pi"
          },
          {
            "bullets": [
              "**Mammary epithelium cells maintain intracellular calcium at low concentration**",
              "**Secretory pathway Ca2+ ATPase (SPCA) อยู่ที่ Golgi และ basolateral membrane นอกจากนี้มี PMCA และ SERCA**",
              "มี Ca sensing receptor (CaR) และ stretch-activated Ca pathway รวมถึง TRP Ca channel",
              "**Bovine milk total Ca = 30 mM (120 mg/dl) ในขณะที่ Bovine blood total Ca = 2.1-2.5 mM (8.5-10 mg/dl)**"
            ]
          },
          {
            "sub": "Milk fever (นิยามตามสไลด์คือน้อยกว่า 8 mg/dl)",
            "body": [
              {
                "bullets": [
                  "**Abruptly high demand of calcium for milk**",
                  "**Insensitive of PTH และ 1,25-VitD during early lactation**",
                  "**Decreased available of intestinal Ca (anorexia, reabsorption)**",
                  "Prevention: Low calcium of prepartum diet"
                ]
              }
            ]
          },
          {
            "callout": "หัวข้อ Treatment สไลด์เขียนไว้แต่ข้อความที่ตามมาเป็นลายมือที่อ่านไม่ออก จึงไม่ทราบว่าสไลด์ระบุการรักษาอย่างไร สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Iodide ในน้ำนม",
        "source": "Lactation Physiology II p.43",
        "body": [
          {
            "bullets": [
              "**Milk iodide concentration can be 20-30 higher than that found in maternal plasma**",
              "**Sodium dependent iodide transport เป็นระบบที่ prolactin sensitive**"
            ]
          },
          {
            "text": "สไลด์วางเทียบกับ Iodine trapping by thyroid gland ที่ใช้ Iodine pump คือ Na+/I- symporter (NIS) และเอ่ยถึง Pendrin กับ Pendred syndrome ไว้ด้วย แต่ไม่ได้อธิบายรายละเอียดของ Pendred syndrome"
          }
        ]
      },
      {
        "heading": "Paracellular route และ tight junction",
        "source": "Lactation Physiology II p.44",
        "body": [
          {
            "bullets": [
              "**Paracellular route ลำเลียง Interstitial fluid เข้าน้ำนม และสไลด์วงเล็บกำกับว่า effect of glucocorticoid on tight junction**",
              "องค์ประกอบรอยต่อระหว่างเซลล์ที่สไลด์ระบุคือ TJ complex ได้แก่ Claudin และ Occludin หรือ JAM กับ ZO ต่อด้วย AJ complex และ Desmosome",
              "แผนภาพแสดง mammary epithelial cell ที่มี Microvilli, Golgi App, RER, Nucleus และมี Myoepithelial cell อยู่ด้านนอก"
            ]
          },
          {
            "callout": "อ่านคู่กับ p.15 ที่ระบุว่า paracellular route คือเส้นทางที่เกี่ยวข้องกับ mastitis",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Lactation curve และ persistency",
        "source": "Lactation Physiology II p.45",
        "body": [
          {
            "sub": "พารามิเตอร์ของเส้นโค้ง (p.45)",
            "body": [
              {
                "bullets": [
                  "**Yp = peak milk yield**",
                  "**b2 = P คือ persistency of constant daily yield**",
                  "**b3 = rate of decline**",
                  "**Area under curve = total milk yield และ t3 (day in milk) = 305 days**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวเลขตัวอย่างจริง (p.46, ThammachareonS20a)",
            "body": [
              {
                "bullets": [
                  "Yp = 21.56 kg/day",
                  "P = 33 days",
                  "b3 = -0.03 kg/day",
                  "**Total milk yield (305 days) = 5407 kg**"
                ]
              }
            ]
          },
          {
            "callout": "p.47 ตั้งหัวข้อ The effect of parity และ p.48 ตั้งหัวข้อ The environmental effect แต่ทั้งสองหน้าเป็นกราฟที่มีแต่ลายมือกำกับ อ่านไม่ออก จึงสรุปทิศทางของผลไม่ได้ สไลด์ที่อ่านได้ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Hormonal control of lactation: ภาพรวม",
        "source": "Lactation Physiology II p.49",
        "body": [
          {
            "text": "สไลด์จับคู่ฮอร์โมนกับช่วงเวลาทางสรีรวิทยาที่ฮอร์โมนนั้นทำงาน"
          },
          {
            "sub": "Steroid hormones",
            "body": [
              {
                "bullets": [
                  "Estrogens และ Progesterone คู่กับ Reproductive stages และ Mammogenesis",
                  "Adrenal hormones คู่กับ Stress, Pregnant และ Parturition"
                ]
              }
            ]
          },
          {
            "sub": "Protein hormones",
            "body": [
              {
                "bullets": [
                  "**Prolactin และ Placental lactogen คู่กับ Pregnant และ Suckling**",
                  "**Growth hormone และ Insulin like growth factor คู่กับ Growth, Pregnant, Mammogenesis และ Lactation ซึ่งสไลด์ใส่เครื่องหมายคำถามไว้เอง**",
                  "**Oxytocin คู่กับ Suckling induced oxytocin release และถูกกำกับว่าเป็น neuroendocrine**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Oxytocin และ milk ejection",
        "source": "Lactation Physiology II p.51",
        "body": [
          {
            "text": "สไลด์แสดงการบันทึกไฟฟ้าจาก magnocellular neuron ที่ PVN ในสมองหนู โดยเริ่มกระตุ้นหัวนมก่อนเริ่มบันทึก"
          },
          {
            "bullets": [
              "การบันทึกแสดงทั้ง individual extracellular recorded action potential, discharge rate และ intramammary duct pressure พร้อมกัน",
              "**A คือ Response of an oxytocin-secreting neuron ซึ่ง suckling ทำให้เกิดการยิงแบบ High frequency แล้วตามด้วย ejection และแรงดันใน intramammary duct**",
              "**B คือ vasopressin-secreting neuron (AVP neuron) ซึ่งสไลด์วางไว้เป็นตัวเปรียบเทียบ**",
              "แผนภาพมี Oxy และ Avp neuron ที่ PVN ยื่นไปยัง ME"
            ]
          }
        ]
      },
      {
        "heading": "Oxytocin ออกฤทธิ์ที่ myoepithelium อย่างไร",
        "source": "Lactation Physiology II p.52",
        "body": [
          {
            "bullets": [
              "**สไลด์ระบุว่า oxytocin เป็นเปปไทด์ 9 amino acid และมีป้ายกรดอะมิโนรอบผังโมเลกุลคือ Gly, Gln, Asn, Leu, Phe, Ile, Pro, Cys, Arg, Tyr, Cys ซึ่งเป็นผังรวมของ oxytocin กับ vasopressin ที่วางเทียบกัน สไลด์ไม่ได้เรียงลำดับกรดอะมิโนของ oxytocin ไว้ และไม่ได้ระบุพันธะระหว่าง Cys**",
              "**receptor ต่อกับ Gq alpha แล้วสลาย PIP2 ได้ IP3 ทำให้ Ca2+ เพิ่มขึ้น**",
              "**Ca2+ รวมกับ Calmodulin เป็น Ca2+/Calmodulin complex ไปกระตุ้น Myosin light chain kinase ซึ่งเติม Pi ทำให้ myoepithelium หดตัว**"
            ]
          },
          {
            "callout": "แผนภาพสไลด์มี Arg อยู่ในผังโมเลกุลด้วย ซึ่งเป็นกรดอะมิโนของ vasopressin ที่วางเทียบไว้ในหน้าเดียวกัน อ่านคู่กันให้ระวังอย่าสับสนสองเปปไทด์",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Prolactin และ mammary gland function",
        "source": "Lactation Physiology II p.53",
        "body": [
          {
            "bullets": [
              "**Prolactin (Prl) เป็น protein hormone ขนาด 199 aa และ 23 kD**",
              "**Origin: Lactotroph of anterior pituitary**",
              "**Upper regulator: PIF (dopamine) จาก NEDA ได้แก่ PHDA, TIDA และ THDA**",
              "**Prl receptor เป็น Cytokine receptor superfamily class I**",
              "**Intracellular signaling: JAK/STAT และ MAPKinase โดยแผนภาพระบุ Jak2 และ Stat5 ที่ถูก phosphorylate**"
            ]
          },
          {
            "text": "แผนภาพประกอบแสดง Arc, ME, Portal vessels และ Lactotroph เป็นเส้นทางจาก hypothalamus ลงสู่ต่อมใต้สมองส่วนหน้า ส่วน p.50 ก่อนหน้าเป็นแผนที่ hypothalamus ของสมองหนู (MnPO, MPO, LPOA, PVN, DMH, LH, VMH, Arc, ME) โดยไม่มีข้อความอธิบาย"
          }
        ]
      },
      {
        "heading": "Growth hormone และ mammary gland function",
        "source": "Lactation Physiology II p.54",
        "body": [
          {
            "bullets": [
              "**Growth hormone เป็น protein hormone ขนาด 191 aa และ 22 kD**",
              "**Origin: Somatotroph of anterior pituitary**",
              "**Upper regulator: GHRH, Somatostatin และ Ghrelin**",
              "signaling ที่ somatotroph และเซลล์เป้าหมายใช้ Jak2 และ Stat5",
              "**GH ไปที่ Liver ให้สร้าง IGF1 และ IGFBP**",
              "**ที่ Mammary epithelium cell มี IGF1 ทำงานผ่าน IRS1-4 ให้ผลเป็น Proliferation หรือ apoptosis และ Specific gene expression**"
            ]
          },
          {
            "callout": "ผูกกับ p.4 ที่ประกาศว่า Hormonal control of lactation ของโคนมคือ somatotropin และกับ p.20 ที่บอกว่า GLUT1 ถูกควบคุมโดยทั้ง prolactin และ growth hormone",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "physio-3--male-reproductive-system": {
    "topic": "physio-3--male-reproductive-system",
    "title": "Male reproductive system",
    "icon": "📘",
    "lecturer": "Chutamas Benjanirut",
    "summary": "เด็คนี้ไล่ระบบสืบพันธุ์เพศผู้ตั้งแต่โครงสร้าง testis และทางเดินของ sperm, spermatogenesis กับฮอร์โมนที่ควบคุม, ผลของอุณหภูมิ, การ descend ของ testis และ cryptorchidism, การ maturation ของ sperm ใน epididymis, โครงสร้างและ physiology ของ sperm, องค์ประกอบของ semen และหน้าที่ของ accessory glands (รวมการเปรียบเทียบระหว่าง species), testosterone และ DHT, ไปจนถึง stage ของ male sexual act และ mating behavior ของสุนัข ตัวเนื้อหาส่วนใหญ่เป็น physiology ตรงตามตำรา แต่สไลด์ p.5, p.8, p.9, p.17, p.18, p.22, p.27 มีแต่หัวข้อหรือคำบรรยายภาพ ไม่มีเนื้อหาอธิบายใน text layer ซึ่งต้องเปิดสไลด์จริงดูรูปประกอบ",
    "sections": [
      {
        "heading": "โครงสร้างและทางเดินของ sperm",
        "source": "male reproductive system p.2",
        "body": [
          {
            "text": "สไลด์เป็นภาพ 2 ส่วน คือ A. various portions of the male reproductive systems และ B. โครงสร้างที่ละเอียดขึ้นของ testis กับความสัมพันธ์ระหว่าง testis กับ epididymis"
          },
          {
            "bullets": [
              "testis ประกอบด้วย coiled seminiferous tubules ซึ่งเป็นที่สร้าง sperm",
              "**ทางเดินของ sperm: seminiferous tubules ไปยัง epididymis ไปยัง vas deferens ไปยัง urethra**"
            ]
          }
        ]
      },
      {
        "heading": "หน้าที่ของ testis",
        "source": "male reproductive system p.3",
        "body": [
          {
            "text": "testicle เป็น homologous กับ ovary และทำหน้าที่ในสองระบบพร้อมกัน"
          },
          {
            "bullets": [
              "Reproductive system (เป็น gonad) สร้าง sperm หรือ spermatozoa",
              "Endocrine system (เป็น endocrine gland) สร้าง male sex hormone ซึ่งตัวที่รู้จักดีที่สุดคือ **testosterone**"
            ]
          },
          {
            "text": "**หน้าที่ทั้งสองอย่างของ testicle อยู่ภายใต้การควบคุมของ gonadotropic hormone ที่สร้างจาก anterior pituitary คือ luteinizing hormone (LH) และ follicle-stimulating hormone (FSH)**"
          }
        ]
      },
      {
        "heading": "Spermatogenesis",
        "source": "male reproductive system p.4-5",
        "body": [
          {
            "bullets": [
              "เกิดใน seminiferous tubules ทุกท่อ ตลอดช่วง active sexual life โดยเป็นผลจากการกระตุ้นของ anterior pituitary gonadotropic hormones",
              "seminiferous tubules บุด้วย germinal epithelial cells จำนวนมากที่เรียกว่า **spermatogonia** ซึ่ง proliferate อย่างต่อเนื่องเพื่อ replenish ตัวเอง และ differentiate ผ่าน definite stages ของ development จนกลายเป็น sperm"
            ]
          },
          {
            "text": "สไลด์ p.5 ให้ไว้เพียงชื่อเรียกว่า **Leydig cells หรือ interstitial cells (of Leydig)** ประกอบภาพ ไม่มีคำอธิบายอื่นในสไลด์"
          }
        ]
      },
      {
        "heading": "Hormonal factors ที่กระตุ้น spermatogenesis",
        "source": "male reproductive system p.6-7",
        "body": [
          {
            "sub": "5 ปัจจัยตามที่สไลด์เรียงไว้",
            "body": [
              {
                "bullets": [
                  "1. **Testosterone** หลั่งจาก Leydig cells จำเป็นต่อ growth and division ของ testicular germinal cells ซึ่งเป็นขั้นแรกของการสร้าง sperm",
                  "2. **Luteinizing hormone** หลั่งจาก anterior pituitary gland กระตุ้น Leydig cells ให้หลั่ง testosterone",
                  "3. **Follicle-stimulating hormone** หลั่งจาก anterior pituitary gland กระตุ้น Sertoli cells โดยถ้าไม่มีการกระตุ้นนี้ **การเปลี่ยน spermatids ไปเป็น sperm จะไม่เกิดขึ้น**",
                  "4. **Estrogens** สร้างจาก testosterone โดย Sertoli cells เมื่อถูกกระตุ้นด้วย FSH น่าจะจำเป็นต่อ spermiogenesis ด้วย",
                  "5. **Growth hormone** ส่งเสริม early division ของ spermatogonia โดยเฉพาะ ถ้าขาดไป spermatogenesis จะ deficient รุนแรงหรือไม่เกิดเลย จึงทำให้ infertility"
                ]
              }
            ]
          },
          {
            "text": "LH ในเพศผู้ยังมีอีกชื่อว่า **interstitial cell stimulating hormone (ICSH)**"
          },
          {
            "sub": "Androgen-binding protein (ABP)",
            "body": [
              {
                "bullets": [
                  "Sertoli cells สร้าง ABP ซึ่งทำหน้าที่เป็น protein carrier ของ testosterone",
                  "ABP ช่วยรักษาความเข้มข้นของ testosterone ให้สูงภายใน tubular compartment ของ mammalian testis",
                  "**high local concentration ของ testosterone ภายใน testis ถือว่าจำเป็นต่อการเกิด normal spermatogenesis**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Secretory products ของ Sertoli cells และ feedback ของ testicular function",
        "source": "male reproductive system p.8-9",
        "body": [
          {
            "callout": "สองสไลด์นี้มีแต่หัวข้อกับภาพ คือ Secretory products of the Sertoli cells (p.8) และ Control and feedback of testicular function (p.9) ตัว text layer ไม่มีรายละเอียดใด ๆ ต่อจากหัวข้อ ดังนั้นรายการสารที่ Sertoli cells หลั่ง และแผนภาพ feedback loop สไลด์ไม่ได้บอกเป็นข้อความ ต้องเปิดสไลด์จริงดูรูป",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ผลของอุณหภูมิต่อ spermatogenesis",
        "source": "male reproductive system p.10",
        "body": [
          {
            "bullets": [
              "การเพิ่มอุณหภูมิของ testes สามารถ prevent spermatogenesis ได้ โดยทำให้เซลล์ส่วนใหญ่ของ seminiferous tubules degenerate",
              "**testes อยู่ใน scrotum ที่ห้อยลงมา เพื่อรักษาอุณหภูมิของต่อมนี้ให้ต่ำกว่าอุณหภูมิภายในร่างกาย โดยทั่วไปต่ำกว่าประมาณ 2 องศาเซลเซียส**"
            ]
          }
        ]
      },
      {
        "heading": "Descent of the testis",
        "source": "male reproductive system p.11-12",
        "body": [
          {
            "text": "มีการเสนอว่าการเคลื่อนที่ของ testis เกิดเป็น 2 phases"
          },
          {
            "bullets": [
              "**Phase แรก** เคลื่อนข้าม abdomen มาถึงทางเข้าของ inguinal canal ถูกควบคุม หรืออย่างน้อยได้รับอิทธิพลอย่างมาก จาก **anti-mullerian hormone (AMH)**",
              "**Phase ที่สอง** testes เคลื่อนผ่าน inguinal canal เข้าสู่ scrotum ขึ้นกับ **androgens โดยที่สำคัญที่สุดคือ testosterone**"
            ]
          },
          {
            "sub": "ช่วงเวลาที่ testis ลง scrotum ตามปกติในแต่ละ species",
            "body": [
              {
                "bullets": [
                  "Horse: 9 ถึง 11 เดือนของ gestation",
                  "Cattle: 3.5 ถึง 4 เดือนของ gestation",
                  "Sheep: 80 วันของ gestation",
                  "Pig: 90 วันของ gestation",
                  "Dog: 5 วันหลังเกิด",
                  "Cat: 2 ถึง 5 วันหลังเกิด"
                ]
              },
              {
                "text": "อ่านจากรายการนี้จะเห็นว่า horse, cattle, sheep และ pig testis ลงตั้งแต่ยังอยู่ในระยะ gestation ส่วน **dog และ cat ลงหลังคลอด**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Cryptorchidism",
        "source": "male reproductive system p.13-14",
        "body": [
          {
            "text": "Cryptorchidism คือศัพท์ทางการแพทย์ที่หมายถึงการไม่มี testis ข้างใดข้างหนึ่งหรือทั้งสองข้างใน scrotum โดยทั่วไปเป็นผลจาก failure ของ testis ที่จะเคลื่อนที่หรือ descend ระหว่าง fetal development จากตำแหน่งใน abdomen ผ่าน inguinal canal ลงสู่ scrotum"
          },
          {
            "callout": "**cryptorchid testis ยังสามารถสร้าง testosterone ได้ แต่ไม่สามารถสร้าง normal spermatozoa ได้**",
            "kind": "tip"
          },
          {
            "sub": "ในสุนัข",
            "body": [
              {
                "bullets": [
                  "ปกติกระบวนการนี้ complete ภายในอายุ 10 วัน",
                  "ถ้ายังไม่เกิดภายใน 8 สัปดาห์ โดยทั่วไปจะ diagnose ว่าเป็น cryptorchid แม้ testicle อาจยังลงได้จนถึงราว 4 เดือน",
                  "**treatment เดียวคือการเอา testicle ออกทั้งสองข้าง (neutering หรือ castration)**",
                  "เหตุผล 2 ข้อที่สไลด์ให้ไว้ คือ ถ้าไม่เอา testicle ออกจะมีความเสี่ยง testicular cancer เพิ่มขึ้น และถ้านำสุนัขไปผสมพันธุ์ trait นี้จะถ่ายทอดไปยังรุ่นถัดไป"
                ]
              },
              {
                "text": "พันธุ์ที่สไลด์ระบุว่าพบ cryptorchidism บ่อยที่สุด ได้แก่ toy and miniature poodle, pomeranian, Yorkshire และ Cairn terrier, dachshund, Chihuahua, Maltese, boxer, Pekingese, English bulldog, miniature schnauzer และ Shetland sheepdog"
              }
            ]
          }
        ]
      },
      {
        "heading": "Gubernaculum",
        "source": "male reproductive system p.15",
        "body": [
          {
            "bullets": [
              "ช่วยใน descent ของ gonads ทั้ง testes และ ovaries",
              "ในเพศผู้ ส่วนบนของ gubernaculum จะ degenerate",
              "ส่วนล่างคงอยู่เป็น **gubernaculum testis หรือ scrotal ligament** ซึ่งยึด testis ไว้กับส่วนล่างสุดของ scrotum ทำให้ testis อยู่กับที่และจำกัดระยะที่ testis จะเคลื่อนไหวได้ภายใน scrotum"
            ]
          }
        ]
      },
      {
        "heading": "Maturation of sperm ใน epididymis",
        "source": "male reproductive system p.16-18",
        "body": [
          {
            "bullets": [
              "หลังสร้างเสร็จใน seminiferous tubules sperm ยัง **nonmotile** และยัง fertilize ovum ไม่ได้",
              "**หลังจากอยู่ใน epididymis ประมาณ 18 ถึง 24 ชั่วโมง sperm จึงพัฒนา capability of motility** แม้ว่า inhibitory proteins หลายชนิดใน epididymal fluid จะยังยับยั้ง final motility ไว้จนกว่าจะเกิด ejaculation",
              "หลัง ejaculation sperm จึงจะ motile และสามารถ fertilize ovum ได้"
            ]
          },
          {
            "callout": "p.17 (Maturation of sperm in the epididymis ต่อ) และ p.18 (Fertility of spermatozoa from different regions of epididymis) เป็นสไลด์ภาพ ไม่มีข้อความอธิบาย ตัวเลข fertility ของ sperm จากแต่ละส่วนของ epididymis สไลด์ไม่ได้บอกเป็นข้อความ ต้องดูกราฟหรือรูปในสไลด์จริง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "โครงสร้างของ sperm",
        "source": "male reproductive system p.19-20",
        "body": [
          {
            "sub": "Head",
            "body": [
              {
                "bullets": [
                  "ประกอบด้วย condensed nucleus ของเซลล์ มี cytoplasm บาง ๆ และ cell membrane หุ้มรอบผิว",
                  "**anterior 2 ใน 3 ของ head เป็น thick cap เรียกว่า acrosome ซึ่งสร้างมาจาก Golgi apparatus เป็นหลัก**",
                  "acrosome บรรจุ enzyme หลายชนิดที่พบใน lysosome รวมทั้ง **hyaluronidase** และ powerful proteolytic enzymes",
                  "enzyme เหล่านี้มีบทบาทสำคัญในการทำให้ sperm เข้าไปใน ovum และ fertilize ได้"
                ]
              }
            ]
          },
          {
            "sub": "Tail",
            "body": [
              {
                "bullets": [
                  "1. microtubules",
                  "2. thin cell membrane",
                  "3. mitochondria ที่ล้อมรอบส่วน proximal ของ tail"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Physiology of the mature sperm",
        "source": "male reproductive system p.21-22",
        "body": [
          {
            "bullets": [
              "sperm ที่ normal motile และ fertile เคลื่อนที่แบบ flagellate movement ผ่าน fluid medium ด้วยความเร็ว **1 ถึง 4 mm ต่อนาที**",
              "activity ของ sperm เพิ่มขึ้นมากใน neutral และ slightly alkaline medium อย่างที่มีอยู่ใน ejaculated semen",
              "activity ของ sperm ถูกกดอย่างมากใน mildly acidic medium และ **strong acidic medium ทำให้ sperm ตายเร็ว**",
              "activity ของ sperm เพิ่มขึ้นชัดเจนเมื่ออุณหภูมิสูงขึ้น แต่ rate of metabolism ก็เพิ่มตามไปด้วย ทำให้ life ของ sperm สั้นลงมาก",
              "**sperm อยู่ใน testes ในสภาพ suppressed ได้หลายสัปดาห์ แต่ ejaculated sperm ใน female genital tract มี life expectancy เพียง 1 ถึง 2 วัน**"
            ]
          },
          {
            "text": "p.22 เป็นภาพเปรียบเทียบ abnormal infertile sperm กับ normal sperm ที่อยู่ด้านขวา สไลด์ไม่ได้เขียนอธิบายลักษณะความผิดปกติเป็นข้อความ"
          }
        ]
      },
      {
        "heading": "องค์ประกอบของ semen",
        "source": "male reproductive system p.23",
        "body": [
          {
            "bullets": [
              "fluid และ sperm จาก vas deferens ประมาณ **10%**",
              "fluid จาก seminal vesicles ประมาณ **60%**",
              "fluid จาก prostate gland ประมาณ **30%**",
              "และปริมาณเล็กน้อยจาก mucous gland โดยเฉพาะ bulbourethral gland"
            ]
          },
          {
            "bullets": [
              "**average pH ของ semen ที่รวมกันแล้วอยู่ที่ประมาณ 7.5**",
              "semen เก็บได้นานหลายปีเมื่อ frozen ที่อุณหภูมิต่ำกว่า -100 องศาเซลเซียส"
            ]
          }
        ]
      },
      {
        "heading": "Function of prostate gland",
        "source": "male reproductive system p.24",
        "body": [
          {
            "bullets": [
              "หลั่ง thin milky fluid ที่มี calcium, citrate ion, phosphate ion, clotting enzyme และ profibrinolysin",
              "ลักษณะ slightly alkaline ของ prostatic fluid อาจมีความสำคัญมากต่อการ fertilize ovum ให้สำเร็จ",
              "vaginal secretion ของเพศเมียเป็นกรด pH ประมาณ **3.5 ถึง 4.0**",
              "**sperm จะยังไม่ optimally motile จนกว่า pH ของ fluid โดยรอบจะสูงขึ้นถึงประมาณ 6.0 ถึง 6.5**"
            ]
          }
        ]
      },
      {
        "heading": "Function of seminal vesicles",
        "source": "male reproductive system p.25",
        "body": [
          {
            "text": "หลั่ง mucoid material ที่มี **fructose**, citric acid และสารอาหารอื่น ๆ อยู่มาก รวมทั้ง prostaglandins และ fibrinogen ในปริมาณมาก"
          },
          {
            "sub": "Prostaglandins เชื่อว่าช่วย fertilization ได้ 2 ทาง",
            "body": [
              {
                "bullets": [
                  "1. ทำปฏิกิริยากับ female cervical mucus ทำให้ receptive ต่อการเคลื่อนที่ของ sperm มากขึ้น",
                  "2. อาจทำให้เกิด backward หรือ reverse peristaltic contraction ใน uterus และ fallopian tubes เพื่อพา sperm เคลื่อนไปทาง ovaries"
                ]
              }
            ]
          },
          {
            "text": "**Fibrinogen เมื่อรวมกับ clotting enzyme จาก prostatic fluid จะสร้าง weak fibrin ที่ยึด semen ไว้ในส่วนลึกของ vagina**"
          }
        ]
      },
      {
        "heading": "เปรียบเทียบ accessory glands ระหว่าง species",
        "source": "male reproductive system p.26-27",
        "body": [
          {
            "text": "สไลด์เปรียบเทียบขนาดสัมพัทธ์ของ accessory glands ต่าง ๆ ในแต่ละ species พร้อมข้อสังเกตดังนี้"
          },
          {
            "bullets": [
              "**ทุก species ในภาพมี prostate gland**",
              "**Dog และ cat ไม่มี seminal vesicle**",
              "**Dog ไม่มี Cowper's gland หรือ bulbourethral gland**",
              "Cat, boar และ man ไม่มี ampullar swelling",
              "Bull และ boar มี sigmoid flexure ของ penis",
              "**Dog และ cat มี os penis**",
              "Boar มี preputial pouch"
            ]
          },
          {
            "text": "p.27 หัวข้อ Accessory glands เป็นสไลด์ภาพล้วน ไม่มีข้อความอธิบาย"
          }
        ]
      },
      {
        "heading": "Testosterone แหล่งสร้างและช่วงชีวิต",
        "source": "male reproductive system p.28",
        "body": [
          {
            "bullets": [
              "สร้างโดย **interstitial cells of Leydig**",
              "Leydig cells แทบไม่มีอยู่ใน testes ในช่วง childhood ซึ่งเป็นช่วงที่ testes หลั่ง testosterone แทบไม่มีเลย",
              "**แต่มี Leydig cells จำนวนมากใน newborn male infant ในช่วงไม่กี่เดือนแรกของชีวิต และใน adult male ซึ่งทั้งสองช่วงนี้ testes หลั่ง testosterone ในปริมาณมาก**"
            ]
          }
        ]
      },
      {
        "heading": "Function of testosterone ในช่วง fetal development",
        "source": "male reproductive system p.29",
        "body": [
          {
            "bullets": [
              "ระหว่าง fetal life testes ถูกกระตุ้นโดย **chorionic gonadotropin จาก placenta** ให้สร้าง testosterone ในปริมาณปานกลาง",
              "รับผิดชอบการสร้าง penis, scrotum, prostate gland, seminal vesicles และ male genital duct",
              "**stimulus สำหรับ descent of testes คือ testosterone**",
              "โดยรวมแล้ว testosterone รับผิดชอบต่อลักษณะที่ทำให้ masculine body แตกต่างออกไป"
            ]
          }
        ]
      },
      {
        "heading": "Function of testosterone ต่อ primary และ secondary sexual characteristics",
        "source": "male reproductive system p.30-31",
        "body": [
          {
            "text": "**หลัง puberty การหลั่ง testosterone ที่เพิ่มขึ้นทำให้ penis, scrotum และ testes ขยายขนาดประมาณ 8 เท่า ก่อนอายุ 20 ปี**"
          },
          {
            "sub": "secondary sexual characteristics ที่สไลด์ไล่ไว้ 4 ข้อ",
            "body": [
              {
                "bullets": [
                  "1. Hair: ทำให้ขนขึ้นเกือบทั่วร่างกาย แต่ **ลดการงอกของผมบน top of the head**",
                  "2. Voice: ทำให้เกิด hypertrophy ของ laryngeal mucosa และ larynx ขยายใหญ่ขึ้น",
                  "3. Skin และ acne: เพิ่มความหนาของผิวหนังทั่วร่างกาย เพิ่ม ruggedness ของ subcutaneous tissue และเพิ่มอัตราการหลั่งของ sebaceous glands บางส่วนหรืออาจทั้งหมด",
                  "4. Protein formation และ muscle development: หนึ่งในลักษณะสำคัญที่สุดของเพศผู้คือ musculature ที่เพิ่มขึ้นหลัง puberty"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Testosterone mechanism of action และ DHT",
        "source": "male reproductive system p.32-33",
        "body": [
          {
            "sub": "Mechanism of action",
            "body": [
              {
                "bullets": [
                  "testosterone จับกับ **intracellular receptor**",
                  "receptor-steroid complex จากนั้นจะจับกับ DNA ใน nucleus ซึ่ง facilitate การ transcription ของยีนต่าง ๆ",
                  "ใน target cell บางชนิด testosterone ถูกเปลี่ยนเป็น **dihydrotestosterone (DHT) โดยเอนไซม์ 5-alpha-reductase**",
                  "**DHT จับกับ intracellular receptor ตัวเดียวกับ testosterone**"
                ]
              }
            ]
          },
          {
            "sub": "DHT action",
            "body": [
              {
                "bullets": [
                  "DHT-receptor complexes จำเป็นต่อการสร้าง **male external genitalia**",
                  "รับผิดชอบหลักต่อการขยายขนาดของ prostate และน่าจะรวมถึง penis ในช่วง puberty",
                  "รวมถึง facial และ body hair growth",
                  "**และยังทำให้เกิด temporal recession ของ hairline ด้วย**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Stage of male sexual act",
        "source": "male reproductive system p.34-36",
        "body": [
          {
            "sub": "1. Penile erection บทบาทของ parasympathetic nerves",
            "body": [
              {
                "bullets": [
                  "เป็น **ผลแรก** ของ male sexual stimulation",
                  "เกิดจาก parasympathetic impulses ที่ผ่านจาก sacral portion ของ spinal cord ผ่าน pelvic nerve ไปยัง penis",
                  "parasympathetic fiber เหล่านี้หลั่ง **nitric oxide และหรือ vasoactive intestinal peptide นอกเหนือจาก acetylcholine**",
                  "**nitric oxide คลาย arteries ของ penis และคลาย smooth muscle fiber ใน erectile tissue ของ corpora cavernosa และ corpus spongiosum**"
                ]
              }
            ]
          },
          {
            "sub": "2. Lubrication",
            "body": [
              {
                "text": "ระหว่าง sexual stimulation parasympathetic impulses นอกจากจะส่งเสริม erection แล้ว ยังทำให้ **urethral glands และ bulbourethral glands หลั่ง mucus**"
              }
            ]
          },
          {
            "sub": "3. Emission และ Ejaculation หน้าที่ของ sympathetic nerves",
            "body": [
              {
                "bullets": [
                  "เมื่อ sexual stimulus รุนแรงมาก reflex centers ของ spinal cord เริ่มส่ง sympathetic impulses ที่ออกจาก cord ที่ระดับ **T12 ถึง L2** และผ่านไปยัง genital organs ทาง hypogastric และ pelvic sympathetic nerve plexus เพื่อเริ่ม emission",
                  "**Emission** คือการปล่อย spermatozoa และ accessory gland fluid เข้าสู่ pelvic urethra ได้แก่ contraction ของ vas deferens ที่ขับ sperm เข้า internal urethra ร่วมกับ contraction ของ prostate gland และ seminal vesicles ที่ขับ prostatic และ seminal fluid เข้า urethra โดย fluid ทั้งหมดผสมกันใน internal urethra",
                  "**Ejaculation** คือ forceful expulsion ของ semen ออกจาก urethra ลำดับคือ internal urethra ถูกเติมด้วย semen ทำให้เกิด sensory signal ผ่าน pudendal nerves ไปยัง sacral region ของ cord แล้วเกิด contraction ของ ischiocavernosus และ bulbocavernosus muscles ที่ฐานของ penile erectile tissue ทำให้ความดันใน genital duct เพิ่มขึ้น จนขับ semen ออกมา"
                ]
              },
              {
                "callout": "**ช่วงของ emission และ ejaculation ทั้งหมดนี้เรียกรวมว่า male orgasm**",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Mating behavior ของสุนัขเพศผู้",
        "source": "male reproductive system p.37",
        "body": [
          {
            "bullets": [
              "a. Mounting and clasping",
              "b. Pelvic thrusting",
              "c. Intense ejaculation reaction",
              "d. **Copulatory lock**"
            ]
          },
          {
            "callout": "สไลด์ให้ไว้เพียงชื่อ 4 ขั้นตอนนี้ประกอบภาพ ไม่ได้อธิบายรายละเอียดหรือระยะเวลาของแต่ละขั้น สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "physio-3--metabolism": {
    "topic": "physio-3--metabolism",
    "title": "Metabolism",
    "icon": "📘",
    "lecturer": "Saikaew Sutayatram, DVM., PhD.",
    "summary": "เด็คนี้ยาว 72 สไลด์ แบ่งเป็น 4 ส่วนใหญ่ตามที่สไลด์ Topics เขียนไว้ คือ Introduction, Metabolic rates, Factors of metabolism และ Metabolism of nutrients (Carbohydrate, Fat, Protein) ส่วน metabolic rate ลงลึกทั้งนิยาม BMR/RMR/RER/SMR วิธีวัดด้วย direct และ indirect calorimetry พร้อมตัวอย่างคำนวณจาก spirometer และไล่ปัจจัยที่มีผลต่อ MR ครบ 9 ข้อ ส่วน nutrient metabolism ไล่ CHO (ตั้งแต่ digestion จนถึง pentose phosphate pathway), lipid (ตั้งแต่ absorption จนถึง feedback control ของ cholesterol) และ protein (ตั้งแต่ absorption จนถึง hormonal regulation) มีตัวเลขเยอะมากและอาจารย์อ้างอิงงานวิจัยกำกับไว้หลายจุด หมายเหตุความซื่อสัตย์ สไลด์ 30, 42 และ 59 เป็นสไลด์คั่นหัวข้อที่มีแต่รายการหัวข้อย่อยกับรูป สไลด์ 61 ไม่มีข้อความเลย (เป็นรูปล้วน) และสูตร RER ของสุนัขกับแมวในสไลด์ 8 อยู่ในรูปภาพ ไม่ได้อยู่ในชั้นข้อความ จึงสรุปตัวเลขสูตรนั้นให้ไม่ได้",
    "sections": [
      {
        "heading": "Metabolism คืออะไร",
        "source": "Metabolism p.3",
        "body": [
          {
            "text": "Metabolism มาจากภาษากรีก แปลว่า **\"Change\"** หมายถึงชุดของ chemical และ energy transformations ที่เกิดภายใน living cell หรือ body"
          },
          {
            "text": "สไลด์วางกรอบไว้ว่าเป็นวงจร Acquire—Inter-convert—Use or dispose energy เพื่อรองรับการทำงานตั้งแต่ระดับเซลล์ไปจนถึงทั้งร่างกาย"
          },
          {
            "sub": "Work ที่ metabolism ไปรองรับ",
            "body": [
              {
                "bullets": [
                  "Mechanical works",
                  "Electrical works",
                  "Potential works",
                  "Thermal works",
                  "Chemical works"
                ]
              }
            ]
          },
          {
            "bullets": [
              "Metabolism of the body = **All chemical reactions in all of the body cells**",
              "Living cell metabolism เป็น dynamic แปรผันตาม stimuli",
              "Regulation ควบคุมโดย **Neurohormonal system**"
            ]
          }
        ]
      },
      {
        "heading": "Metabolic pathway, enzyme และชนิดของ cellular metabolism",
        "source": "Metabolism p.4",
        "body": [
          {
            "sub": "Metabolic pathway",
            "body": [
              {
                "text": "คือ chemical reaction chain ที่มีหลายขั้นตอนของ chemical transformation"
              },
              {
                "bullets": [
                  "เป็น fixed step",
                  "มี specific substrate และ product",
                  "Usually require enzyme"
                ]
              }
            ]
          },
          {
            "sub": "Enzyme",
            "body": [
              {
                "text": "ทำหน้าที่เป็น catalyzer คือ **speed up the reaction โดยลด activation energy** และถูก regulate ได้"
              }
            ]
          },
          {
            "sub": "Types of cellular metabolism",
            "body": [
              {
                "bullets": [
                  "**Catabolism**: breakdown big molecule",
                  "**Anabolism**: biosynthesis, building หรือ growth"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พลังงานจากอาหาร, กฎ thermodynamic และหน่วยวัดพลังงาน",
        "source": "Metabolism p.5",
        "body": [
          {
            "text": "สัตว์ได้พลังงานจาก chemical energy bonds ของอาหาร (glucose, proteins หรือ fats) ผ่านปฏิกิริยาอย่าง glycolysis, β-oxidation ฯลฯ แล้วปลดปล่อยพลังงานเป็น ATP"
          },
          {
            "bullets": [
              "Use energy และ convert ไปเป็นรูปพลังงานที่เสถียรและเหมาะสม (ATP)",
              "Store energy ในรูปเสถียร คือ **glycogen และ fat**",
              "Release waste (CO2 หรือ acid) และ heat"
            ]
          },
          {
            "sub": "Law of thermodynamic and energy",
            "body": [
              {
                "bullets": [
                  "**1st law**: close system ไม่มีการสูญเสียหรือสร้างพลังงานขึ้นใหม่ มีแต่ inter-convert",
                  "**2nd law**: universe เคลื่อนไปสู่ entropy จึงต้องใช้พลังงานเพื่อรักษา homeostasis โดยเฉพาะส่วนที่สูญเสียเป็น heat"
                ]
              }
            ]
          },
          {
            "sub": "หน่วยมาตรฐานของ energy metabolism คือ Heat energy",
            "body": [
              {
                "bullets": [
                  "**calorie (gram calorie, cal)**: พลังงานที่ทำให้น้ำ 1 g อุณหภูมิเพิ่ม 1 ˚C",
                  "**Cal หรือ kcal (kilocalorie)**: พลังงานที่ทำให้น้ำ 1000 g อุณหภูมิเพิ่ม 1 ˚C",
                  "ระบบ SI ใช้ **Joule (J)** โดย **1 cal = 4.184 J**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Metabolic rate (MR) และองค์ประกอบของ energy expenditure",
        "source": "Metabolism p.6",
        "body": [
          {
            "text": "Metabolic rate คือ **all cellular energy expenditure ต่อหนึ่งหน่วยเวลา**"
          },
          {
            "sub": "หน่วยที่ใช้รายงาน",
            "body": [
              {
                "bullets": [
                  "Energy expenditure: kcal/day",
                  "O2 consumption: L O2 ต่อหน่วยเวลา",
                  "Normalized ด้วย body weight หรือ body surface: kcal/day/m2"
                ]
              }
            ]
          },
          {
            "text": "Total energy expenditure (kcal/day) = all cellular metabolism and functions + physical activity + thermogenesis"
          },
          {
            "sub": "สองสมการที่สไลด์เขียนไว้",
            "body": [
              {
                "bullets": [
                  "**TMR = BMR + daily activity + thermogenesis**",
                  "**TDEE = BMR + TEF (หรือ SDA) + NEAT + EAT**"
                ]
              },
              {
                "text": "TEF = Thermic Effect of Food หรือ Specific Dynamic Action of Food (SDA), NEAT = Non-Exercise Activity Thermogenesis, EAT = Exercise Activity Thermogenesis"
              }
            ]
          }
        ]
      },
      {
        "heading": "Basal metabolic rate (BMR) และเงื่อนไขการวัด",
        "source": "Metabolism p.7",
        "body": [
          {
            "text": "BMR คือ **minimal energy for sustaining body functions** วัดในภาวะ at rest, post-absorptive และ thermal neutrality"
          },
          {
            "bullets": [
              "คิดเป็น **60-70% ของ total energy expenditure**",
              "ใช้เพื่อเปรียบเทียบ MR ระหว่าง subject"
            ]
          },
          {
            "sub": "Conditions ที่สไลด์กำหนด",
            "body": [
              {
                "bullets": [
                  "หลังมื้ออาหาร **≥ 12-18 ชม. ในคน, 24-30 ชม. ในไก่ และ 65-80 ชม. ในโค**",
                  "After a night of restful sleep",
                  "ไม่มี strenuous physical activity ภายใน 1 ชม. ก่อนวัด",
                  "Rest, no excitement, no physical activity, no sleep",
                  "อยู่ใน Thermoneutral zone (TNZ) ~68-80˚F (20-27°C)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ค่าตัวเลข BMR และนิยาม RMR, RER, SMR",
        "source": "Metabolism p.8",
        "body": [
          {
            "sub": "BMR",
            "body": [
              {
                "bullets": [
                  "Normal men: **1600-1800 kcal/day**",
                  "Normal women: **1300-1500 kcal/day**",
                  "Humans = **37 - [(age-20)/10] kcal/m2/hr**",
                  "Adult dogs: **48-114 kcal/kg0.75/day**",
                  "Adult cats: **75 kcal/kg0.67/day**"
                ]
              }
            ]
          },
          {
            "sub": "Resting Metabolic Rate (RMR)",
            "body": [
              {
                "text": "วัดก่อนมื้ออาหารเช้า ในท่า resting position และอยู่ใน TNZ"
              }
            ]
          },
          {
            "sub": "Resting Energy Requirements (RER)",
            "body": [
              {
                "text": "คือ calculated daily energy requirement สำหรับสุนัขและแมว อ้างอิง The OSU, 2019"
              },
              {
                "callout": "สูตรคำนวณ RER ของสุนัขและแมวอยู่ในรูปภาพบนสไลด์ ไม่ได้อยู่ในชั้นข้อความ จึงยกตัวเลขสูตรมาให้ไม่ได้ ต้องเปิดสไลด์ตัวจริงดู",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Standard Metabolic Rate (SMR) สำหรับ ectotherm",
            "body": [
              {
                "text": "วัดในภาวะ rest, post-absorptive และ non-growing/active metabolic stage"
              },
              {
                "text": "ตัวอย่างที่สไลด์ยก คือ Crocodiles (0.19–389 kg) = **1.01 kcal/kg0.829/day** (Seymour et al., 2013)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Energy output และหลักการวัด MR",
        "source": "Metabolism p.9",
        "body": [
          {
            "sub": "Energy output from metabolism มี 3 ทาง",
            "body": [
              {
                "bullets": [
                  "External work (force x length)",
                  "Energy storage (stored ATP)",
                  "Heat"
                ]
              }
            ]
          },
          {
            "sub": "Heat มาจากไหน",
            "body": [
              {
                "bullets": [
                  "**ATP formation (35% of food energy)** และ ATP usage",
                  "Chemical reactions และ mechanical events"
                ]
              }
            ]
          },
          {
            "text": "การวัด MR หรือ energy expenditure ทำโดยวัด **rate of heat liberation** ซึ่งมี 2 วิธี"
          },
          {
            "bullets": [
              "**Direct calorimetry**: วัด heat โดยตรง เพราะ energy expenditure ทั้งหมดจาก metabolism ออกมาเป็น heat energy",
              "**Indirect calorimetry**: วัด O2 consumption หรือ CO2 production เพราะ **95% ของ energy expenditure ปล่อยออกจาก O2 dependent metabolism** จึงคำนวณ heat energy แบบสัดส่วนได้"
            ]
          }
        ]
      },
      {
        "heading": "Direct calorimetry: room-sized และ bomb calorimeter",
        "source": "Metabolism p.10",
        "body": [
          {
            "text": "Direct calorimetry วัด total heat ที่เกิดจากระบบใน closed chamber ใช้ได้ทั้งกับทั้งตัวสัตว์และกับ chemical reaction"
          },
          {
            "sub": "Room-sized calorimeter",
            "body": [
              {
                "text": "วัด total heat production จากสิ่งมีชีวิต แบ่งความร้อนที่วัดเป็น"
              },
              {
                "bullets": [
                  "Sensible heat loss: Conduction, Convection, Radiation",
                  "Insensible heat loss: Vaporization"
                ]
              }
            ]
          },
          {
            "sub": "Bomb calorimetry",
            "body": [
              {
                "text": "วัด heat energy จากการเผา substrate"
              },
              {
                "bullets": [
                  "CHO = **4.1 kcal/g**",
                  "Fats = **9.3 kcal/g**",
                  "Proteins = **5.4 kcal/g**"
                ]
              },
              {
                "text": "**The protein oxidation is incomplete** end product คือ Urea และ related nitrogen compounds ไม่ใช่ CO2 + H2O"
              }
            ]
          }
        ]
      },
      {
        "heading": "Indirect calorimetry: พลังงานต่อ L O2 และรูปแบบเครื่องมือ",
        "source": "Metabolism p.11-12",
        "body": [
          {
            "text": "Indirect calorimetry ประมาณ heat generation ทางอ้อมจาก O2 consumption (VO2) หรือ CO2 production เพราะ 95% ของพลังงานปล่อยจาก oxidative metabolism"
          },
          {
            "sub": "พลังงานที่ได้ต่อ 1 ลิตร O2 ที่ STP แปรผันตามชนิดเชื้อเพลิง",
            "body": [
              {
                "bullets": [
                  "Glucose: **5.1 kcal/L O2**",
                  "Fat: **4.7 kcal/L O2**",
                  "Protein: **4.6 kcal/L O2**",
                  "Mixed food: **4.825 kcal/L O2**"
                ]
              }
            ]
          },
          {
            "sub": "รูปแบบเครื่องมือ (p.12)",
            "body": [
              {
                "bullets": [
                  "**Closed-circuit**: spirometer หรือ respiration chamber (desiccator) มี CO2 absorber",
                  "**Open-circuit**: opened circuit spirometry พร้อม expired gas analysis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตัวอย่างคำนวณ MR จาก spirometer",
        "source": "Metabolism p.13",
        "body": [
          {
            "text": "สไลด์ไล่ตัวอย่างคำนวณ liberated heat energy ต่อพื้นที่ผิวต่อเวลา (kcal/m2/hr) ทีละขั้น"
          },
          {
            "sub": "1. หา O2 consumption ใน 1 ชม.",
            "body": [
              {
                "text": "กำหนด 1 mm = 30 mL ถ้ากราฟ drift 100 mm ใน 10 นาที จะได้ VO2 = 30 x 100 x (60/10) = 18,000 mL/hr = **18 L/hr**"
              }
            ]
          },
          {
            "sub": "2. แปลงปริมาตร O2 เป็น STP",
            "body": [
              {
                "text": "STP กำหนด P2 = 760 mmHg, T2 = 273 ˚K ใช้ P1V1/T1 = P2V2/T2 จาก 750 x 18/(25+273) = 760 x V2/273 ได้ **V2 = 16.3 L**"
              }
            ]
          },
          {
            "sub": "3. แปลงเป็น kcal/hr จาก mixed food",
            "body": [
              {
                "text": "16.3 x 4.825 = **78.65 kcal/hr**"
              }
            ]
          },
          {
            "sub": "4. Normalize ด้วย body surface area (A)",
            "body": [
              {
                "text": "Human A = 0.007184 x H0.725 x W0.425 (A เป็น m2, H เป็น cm, W เป็น kg) ถ้า A = 1.462 m2 จะได้ Metabolic rate = 78.65/1.462 = **53.79 kcal/m2/hr**"
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 1 Genetics: species และ breed",
        "source": "Metabolism p.14",
        "body": [
          {
            "bullets": [
              "ขนาดเท่ากัน: **Endothermic > Ectothermic animals**",
              "ขนาดต่างกัน: ต่างที่ basal body activities ได้แก่ HR, cellular metabolism และ thermoregulation"
            ]
          },
          {
            "text": "**สัตว์ตัวเล็กมี heat production ต่อตัวต่ำกว่า แต่ BMR ต่อ body mass สูงกว่า**"
          },
          {
            "bullets": [
              "Mice = 4 kcal/20 g = **200 kcal/kg**",
              "Cow = 7,000 kcal/500 kg = **14 kcal/kg**"
            ]
          },
          {
            "text": "BMR แปรผันตาม body surface (พื้นที่ผิวมากกว่า = heat loss มากกว่า)"
          },
          {
            "sub": "Race และ breed",
            "body": [
              {
                "bullets": [
                  "White people BMR > Asians (Pi-Suñer J., 1933)",
                  "Great Danes MER > Beagle (NCR, 2006)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 2 Gender",
        "source": "Metabolism p.15",
        "body": [
          {
            "text": "**Male RMR > Female ประมาณ 23%** หลังปรับ body composition และ aerobic fitness แล้ว (Arciero et al., 1993)"
          },
          {
            "sub": "Testosterone",
            "body": [
              {
                "bullets": [
                  "มี anabolic effects ต่อ skeletal muscle มากกว่า female sex hormones",
                  "**Increase BMR 10-15%**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 3 Physical activity",
        "source": "Metabolism p.16",
        "body": [
          {
            "text": "ขึ้นกับ types, intensity และ duration และสไลด์ระบุว่าเป็น **most important factor ของ MR**"
          },
          {
            "sub": "Exercise เพิ่ม heat production จากทั้งร่างกาย",
            "body": [
              {
                "text": "ทั้งจาก muscle work, utilization of nutrients, waste elimination (CO2, acid และ excess heat) และการทำงานของระบบอื่น"
              },
              {
                "bullets": [
                  "Maximal exercise เพิ่มได้ **50 เท่า**",
                  "Sustained exercise เพิ่มได้ **20 เท่า**",
                  "Total energy expenditure ~2000 kcal/day",
                  "ปั่นจักรยาน 45 นาที = 590 kcal โดย MR เพิ่มเป็น 190 kcal/hr ได้นานถึง 14 ชม."
                ]
              }
            ]
          },
          {
            "bullets": [
              "**Sleeping ลด MR ได้ 10-15%** จากการลด muscle tone และ nervous system function",
              "คนที่ aerobically fit มี BMR สูงกว่า เพราะมี muscle mass มากกว่าและ/หรือมี cellular adaptations"
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 4 Age",
        "source": "Metabolism p.17",
        "body": [
          {
            "text": "**BMR declines with aging** ลำดับคือ Adolescent > adult > elderly"
          },
          {
            "sub": "Adolescent",
            "body": [
              {
                "bullets": [
                  "Body mass ต่ำ (heat loss) แต่ growth rate สูง",
                  "Growth hormone (GH) กระตุ้น cellular metabolism ที่ adipose, bone, muscle, nervous, immune และ liver tissues",
                  "**GH increases BMR ~15-20%**"
                ]
              }
            ]
          },
          {
            "sub": "Elderlies (degenerative stage)",
            "body": [
              {
                "bullets": [
                  "Sex hormone และ GH ต่ำ",
                  "Muscle mass น้อยลง fat mass เพิ่มขึ้น",
                  "Physical activity ลดลงจาก muscle dystrophy",
                  "Glucose และ lipid metabolism ไม่มีประสิทธิภาพ (Shimokata and Kuzuya, 1993)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 5 Hormones: Thyroxine",
        "source": "Metabolism p.18",
        "body": [
          {
            "text": "Thyroxine เพิ่ม cellular chemical reaction rate โดยมี main targets คือ **brain, liver, pancreas, skeletal muscle และ adipocyte**"
          },
          {
            "bullets": [
              "ทำงาน synergist กับ sympathetic nervous system",
              "เพิ่ม heat production",
              "Cold climate adaptation สัมพันธ์กับระดับ thyroxine"
            ]
          },
          {
            "text": "ตัวเลขที่สไลด์เขียน คือ Max level of thyroxine: **MR หรือ BMR 50-100%** และ Without thyroxine: **MR หรือ BMR 40-60%**"
          },
          {
            "callout": "บนสไลด์เดิมสองบรรทัดนี้มีลูกศรขึ้น/ลงกำกับ แต่ลูกศรหายไปตอนดึงข้อความออกมา จึงเก็บเฉพาะตัวเลขที่อ่านได้ ให้ไปดูทิศทางลูกศรจากสไลด์ตัวจริง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 5 Hormones: Cortisol และ glucocorticoids",
        "source": "Metabolism p.19",
        "body": [
          {
            "sub": "Increase",
            "body": [
              {
                "bullets": [
                  "Metabolic (catabolic) rate",
                  "การปล่อย fuel substrates ออกจากแหล่งเก็บเข้าสู่เลือด ได้แก่ glucose, free fatty acid และ amino acid",
                  "Energy expenditure",
                  "Appetite จนเกิด **Polyphagia**",
                  "Fat accumulation"
                ]
              }
            ]
          },
          {
            "sub": "Decrease",
            "body": [
              {
                "bullets": [
                  "Muscle mass"
                ]
              }
            ]
          },
          {
            "text": "Main targets: **Liver, skeletal muscle และ adipose tissue** (Mohd Azmi et al., 2021)"
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 6 Sympathetic function",
        "source": "Metabolism p.20",
        "body": [
          {
            "text": "ออกฤทธิ์ผ่าน **β-adrenergic receptor** ให้ผลแบบ catabolic effect"
          },
          {
            "sub": "Increase",
            "body": [
              {
                "bullets": [
                  "O2 consumption และ MR **เพิ่ม 100% ใน newborn และ 15% ใน adult**",
                  "Glucose metabolism (hepatic gluconeogenesis)",
                  "Lipid metabolism คือ WAT lipolysis และ **BAT non-shivering thermogenesis**"
                ]
              }
            ]
          },
          {
            "text": "Targets ครอบคลุมเนื้อเยื่อส่วนใหญ่ ได้แก่ CVS, liver, adipose tissue, pancreas และ skeletal muscle"
          },
          {
            "sub": "Sympathetic tone reduction ทำให้ RMR ลดลง",
            "body": [
              {
                "text": "เห็นชัดในคนที่มี basal sympathetic tone สูงอยู่แล้ว"
              },
              {
                "bullets": [
                  "Young, aerobic fit และ men (Bell et al., 2001)",
                  "Obesity และ metabolic syndrome (Thorp and Schlaich, 2015)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 7 Physiological/Pathophysiological conditions",
        "source": "Metabolism p.21-22",
        "body": [
          {
            "sub": "Body composition (p.21)",
            "body": [
              {
                "bullets": [
                  "Skeletal muscle MR: **20% ของ BMR**",
                  "Fat tissue: **4-5% ของ BMR**",
                  "Organs (heart, lung, kidney และ brain): **50% ของ BMR**"
                ]
              }
            ]
          },
          {
            "sub": "Fever (p.21)",
            "body": [
              {
                "text": "สไลด์เขียนว่าเพิ่ม cellular MR ประมาณ **120% ต่อการเพิ่มอุณหภูมิทุก 10 °C** ร่วมกับการเปลี่ยน body temperature set point ที่ hypothalamus"
              },
              {
                "bullets": [
                  "Chill: เพิ่ม heat production ทำให้ body temperature สูงขึ้นและเร่ง cellular chemical reactions",
                  "Flush: เพิ่ม heat loss"
                ]
              },
              {
                "text": "อ้างอิง Guyton and Hall, 2006"
              }
            ]
          },
          {
            "sub": "ภาวะอื่น (p.22)",
            "body": [
              {
                "bullets": [
                  "**Acute starvation**: เพิ่ม MR เพื่อรักษา fuel ให้ vital organs หลักคือ gluconeogenesis ใช้ carbohydrate และ fat ก่อน แล้วจึง protein",
                  "**Chronic malnutrition**: ลด MR ประมาณ **20-30%** จากพลังงานใน substrate ในเซลล์ไม่พอ และมีการสลาย muscle mass มาใช้",
                  "**Pregnancy and lactation**: เพิ่ม MR จาก fetal formation, placental function และ milk synthesis",
                  "**Stress and anxiety**: เพิ่มการทำงานของ sympathetic nervous system และ cortisol",
                  "**Cancer**: ขึ้นกับชนิดของมะเร็ง บางชนิดมี metabolism หรือ secretory function สูง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 8 Specific dynamic action (SDA)",
        "source": "Metabolism p.23",
        "body": [
          {
            "text": "SDA หรือ thermic effect of food หรือ heat increment คือพลังงานส่วนเกินที่ใช้ไปกับ **ingestion, digestion, secretion, absorption, transformation, mobilization, elimination และ storage** โดยหลักเกิดจาก liver deamination"
          },
          {
            "sub": "ตามชนิดและปริมาณอาหาร",
            "body": [
              {
                "bullets": [
                  "**Protein: SDA (30%) > carbohydrate และ fat (5-15%)**",
                  "Fat ให้พลังงานและน้ำสูงแต่ heat increment ต่ำ จึง **ดีในภาวะ heat stress**"
                ]
              }
            ]
          },
          {
            "sub": "% ของพลังงานในอาหารที่ถูกเปลี่ยนเป็น SDA",
            "body": [
              {
                "bullets": [
                  "Protein **20-35%**",
                  "Carbohydrate **10-15%**",
                  "Fat **5-10%**"
                ]
              }
            ]
          },
          {
            "sub": "% การเพิ่ม MR แตกต่างกันมากระหว่างสัตว์",
            "body": [
              {
                "bullets": [
                  "Human **25%**",
                  "Fishes **136%**",
                  "Snakes **687%** (Secor, 2009)"
                ]
              }
            ]
          },
          {
            "text": "Duration of SDA: **dog 5-10 ชม. และ human 10 ชม.** (Mccue, 2006)"
          }
        ]
      },
      {
        "heading": "ปัจจัยที่ 9 Environment: อุณหภูมิและความชื้น",
        "source": "Metabolism p.24",
        "body": [
          {
            "text": "อุณหภูมิสัมพันธ์กับ MR แบบ **U-shape curve** โดยจุดต่ำสุดคือ Thermoneutral zone (TNZ) ซึ่งเป็นช่วงอุณหภูมิที่ MR ต่ำที่สุด"
          },
          {
            "bullets": [
              "Human **25-30°C**",
              "Cat and dog **20-25°C**",
              "Rat **26-30°C**"
            ]
          },
          {
            "bullets": [
              "ต่ำกว่า **Lower Critical Temperature** (cold) ร่างกาย conserve heat และ shivering ทำให้ **MR เพิ่ม**",
              "สูงกว่า **Upper Critical Temperature** (hot) ร่างกายกำจัดความร้อนและ sweating ทำให้ **MR เพิ่ม** เช่นกัน",
              "อุณหภูมิร่างกาย 1 °C สัมพันธ์กับ MR **14%**"
            ]
          },
          {
            "sub": "Humidity",
            "body": [
              {
                "text": "Relative humidity สูงทำให้ evaporative cooling ไม่มีประสิทธิภาพ ร่างกายต้องเพิ่มการกำจัดความร้อนด้วยวิธีอื่น จนเกิด heat stress (อ้างอิง Kingma and Lichtenbelt, 2015)"
              }
            ]
          },
          {
            "callout": "สังเกตว่าสไลด์ 7 เขียน TNZ ~68-80˚F (20-27°C) ขณะที่สไลด์ 24 ระบุ human 25-30°C ตัวเลขสองที่ไม่ตรงกันและสไลด์ไม่ได้อธิบายว่าทำไม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Intermediary metabolism และ energy balance",
        "source": "Metabolism p.25",
        "body": [
          {
            "text": "Intermediary metabolism คือ intracellular process ที่เปลี่ยน nutritive materials ไปเป็น cellular components"
          },
          {
            "text": "สไลด์ย้ำ 1st law of thermodynamic ว่า \"the energy is neither created nor destroyed when it is converted from one form to another form\" พลังงานจึงไปได้ 3 ทาง คือ energy intake, energy expenditure หรือ storage fuel"
          },
          {
            "bullets": [
              "**Energy balance**: E intake = E output (น้ำหนักคงที่)",
              "**Negative energy balance**: E intake < E output (น้ำหนักลด)",
              "**Positive energy balance**: E intake > E output (น้ำหนักเพิ่ม)"
            ]
          },
          {
            "text": "การเพิ่ม calorie intake จะเพิ่ม thermogenesis และ metabolism และอาจเพิ่ม body mass โดยสไลด์ให้ตัวเลขว่า **พลังงานส่วนเกิน 7,700 kcal = ไขมัน 1 kg**"
          }
        ]
      },
      {
        "heading": "การส่งผ่านพลังงานจากสารอาหาร 4 ขั้น และ coupled reaction",
        "source": "Metabolism p.26",
        "body": [
          {
            "sub": "4 ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "**Digestion**: CHO, proteins และ fats ถูกย่อยเป็น hexoses, AA และ FA",
                  "**Absorption and energy coupling**: hexoses, AA และ FA เข้า CAC ให้ E, CO2 และ H2O",
                  "**Transformation and storage**: hexoses, AA และ FA เปลี่ยนเป็น glycogen, proteins, fats ฯลฯ",
                  "**Utilization of storage fuel**: ใช้ CHO และ fats ก่อน แล้วจึงใช้ proteins"
                ]
              }
            ]
          },
          {
            "sub": "ทำไมต้องเป็น coupled reaction",
            "body": [
              {
                "text": "การเผาสารอาหารนอกร่างกายให้ heat energy ออกมาแบบระเบิด แต่ **ไม่ใช่ทุก cellular function ที่ต้องการพลังงานในรูป heat**"
              },
              {
                "bullets": [
                  "เซลล์จึงเปลี่ยน fuel substrates ไปเป็นพลังงานรูปแบบเฉพาะที่เหมาะกับแต่ละหน้าที่",
                  "Cellular chemical reactions ต้องถูก couple เข้ากับ physiological functions โดยใช้ specific enzymes และ metabolic pathways"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Energy transfer: free energy ของอาหาร และรูปพลังงานที่เซลล์ใช้",
        "source": "Metabolism p.27",
        "body": [
          {
            "text": "Free energy of oxidation of food (G) คือพลังงานที่ได้จากการ oxidize อาหารสมบูรณ์ สไลด์ยกตัวอย่าง **Glucose 1 mol (180 g) = 686,000 cal/mol**"
          },
          {
            "text": "**ATP คือ energy currency** ทั้งฝั่งผลิตและฝั่งใช้ metabolism ของอาหารคือการสร้าง ATP จาก ADP"
          },
          {
            "sub": "รูปพลังงานที่ถูกแปลงไป",
            "body": [
              {
                "text": "1. High-energy phosphate compounds"
              },
              {
                "bullets": [
                  "ATP: Adenosine triphosphate",
                  "CrP: Creatine phosphate หรือ phosphorylcreatine",
                  "GTP: Guanosine-5-triphosphate",
                  "CTP: Cytidine triphosphate",
                  "UTP: Uracil triphosphate",
                  "ITP: Inosine triphosphate"
                ]
              },
              {
                "text": "2. Thioester ได้แก่ CoA (Co-enzyme A)"
              }
            ]
          },
          {
            "callout": "สไลด์ 27 เขียนพลังงานของ glucose 1 mol = 686,000 cal ขณะที่สไลด์ 35 และ 38 ใช้ ~668,000 cal ตัวเลขในเด็คเดียวกันไม่ตรงกัน สไลด์ไม่ได้บอกว่าอันไหนถูก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Redox reactions และ coenzyme",
        "source": "Metabolism p.28",
        "body": [
          {
            "bullets": [
              "**Oxidation**: loss electron หรือ H+ หรือ gain O2",
              "**Reduction**: gain electron หรือ H+ หรือ loss O2"
            ]
          },
          {
            "text": "Cellular respiration ที่ผลิต ATP คือการ oxidize glucose และ reduce O2 ตามสมการ **C6H12O6 + 6 O2 → 6 CO2 + 6 H2O + ATP**"
          },
          {
            "sub": "Coenzyme ที่ต้องใช้",
            "body": [
              {
                "bullets": [
                  "**NAD+** = nicotinamide adenine dinucleotide (NAD+ + H+ → NADH)",
                  "**NADP+** = nicotinamide adenine dinucleotide phosphate",
                  "**FAD** = flavin adenine dinucleotide"
                ]
              }
            ]
          },
          {
            "text": "การส่ง H+ ใช้ **flavoprotein-cytochrome system** ปลายทางคือ O2 + H+ → H2O"
          }
        ]
      },
      {
        "heading": "Oxidative phosphorylation และการใช้ ATP ของเซลล์",
        "source": "Metabolism p.29",
        "body": [
          {
            "text": "Flavoprotein-cytochrome system ใน mitochondria ทำหน้าที่ transport H+ คือ (1) ข้าม mitochondrial membrane สร้าง electrochemical gradient และ (2) จาก intracisterna space เข้า matrix space"
          },
          {
            "sub": "ปัจจัยที่กำหนด rate of phosphorylation",
            "body": [
              {
                "bullets": [
                  "**ADP concentration**",
                  "Rate of substrates delivery (fats, lactate และ glucose)",
                  "O2 availability"
                ]
              }
            ]
          },
          {
            "text": "**Mitochondria ใช้ 90% ของ O2 consumption โดย 80% ใช้ไปกับการสร้าง ATP**"
          },
          {
            "sub": "Utilization of ATP",
            "body": [
              {
                "bullets": [
                  "Protein synthesis **27%**",
                  "Na/K ATPase **24%**",
                  "Gluconeogenesis **9%**",
                  "CaATPase **6%**",
                  "MyosinATPase **5%**",
                  "Ureagenesis **3%**",
                  "cAMP production (สไลด์ไม่ได้ให้ตัวเลข %)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "CHO digestion และ glucose homeostasis",
        "source": "Metabolism p.30-31",
        "body": [
          {
            "text": "สไลด์ 30 เป็นสไลด์คั่นหัวข้อ ไล่หัวข้อย่อยของ carbohydrate metabolism ไว้ คือ CHO digestion and glucose conversion, glucose transportation into cell, glucose phosphorylation, glucose utilization and storage, anaerobic CHO metabolism, pentose phosphate pathway และ gluconeogenesis"
          },
          {
            "sub": "ชนิดของ CHO (p.31)",
            "body": [
              {
                "bullets": [
                  "Simple sugars: mono และ disaccharides",
                  "Polysaccharides: glycogen, starch และ fibers"
                ]
              }
            ]
          },
          {
            "text": "**Glucose คือ final common CHO circulating unit** โดย CHO digestion ให้ monosaccharides เป็น glucose 80%, fructose และ galactose"
          },
          {
            "sub": "Glucose homeostasis",
            "body": [
              {
                "bullets": [
                  "สุนัขและแมวอยู่ที่ประมาณ **80-120 mg/dL**",
                  "Hypoglycemic hormone: **insulin**",
                  "Hyperglycemic hormones: **glucagon, glucocorticoid, GH และ epinephrine**"
                ]
              }
            ]
          },
          {
            "text": "**แมวเป็น obligate carnivore จึงมี limited capacity ในการย่อย CHO**"
          }
        ]
      },
      {
        "heading": "Glucose transport เข้าเซลล์ และบทบาทของ insulin",
        "source": "Metabolism p.32",
        "body": [
          {
            "text": "Glucose transporters เป็น transmembrane protein carriers แบ่งเป็น 2 แบบ"
          },
          {
            "bullets": [
              "**Facilitated diffusion: GLUT** ไปตาม concentration gradient พบในเซลล์ส่วนใหญ่",
              "**Active transport: Na-glucose cotransport (SGLT)** ทวน concentration gradient พบที่ GI และ renal tubular epithelial cell"
            ]
          },
          {
            "sub": "Insulin",
            "body": [
              {
                "text": "เป็น **hypoglycemic hormone ตัวเดียว** ออกฤทธิ์กระตุ้น **GLUT4 translocation** เพิ่มอัตราการขนส่ง glucose ผ่าน GLUT4 ในเซลล์ส่วนใหญ่ **ยกเว้น liver และ brain**"
              },
              {
                "text": "ถ้าไม่มี insulin จะเกิด Diabetes mellitus (DM) และเซลล์ไม่สามารถรักษาการทำงานไว้ได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "Glucose phosphorylation",
        "source": "Metabolism p.33",
        "body": [
          {
            "text": "glucose ถูกดักไว้ในเซลล์ในรูป **Glucose-6-phosphate**"
          },
          {
            "sub": "สิ่งที่ต้องใช้",
            "body": [
              {
                "bullets": [
                  "Enzymes: **Glucokinase ที่ liver** และ **Hexokinase ที่เนื้อเยื่ออื่น**",
                  "Phosphate radical จาก ATP"
                ]
              }
            ]
          },
          {
            "text": "ปฏิกิริยานี้ reversible ได้ด้วย **Glucose 6-phosphatase** ซึ่งปล่อย glucose ออกนอกเซลล์ได้ พบที่ **liver, renal tubular และ intestinal epithelial cell**"
          }
        ]
      },
      {
        "heading": "Glucose storage, glycogenesis และ glycogenolysis",
        "source": "Metabolism p.34",
        "body": [
          {
            "sub": "Glucose storage",
            "body": [
              {
                "bullets": [
                  "**Glycogen**: เก็บมากที่ liver และ muscle อยู่ในรูป solid จึงไม่สร้าง osmotic pressure เก็บได้สูงสุด **2000 kcal ภายในเซลล์**",
                  "**Fat**: เก็บที่ adipose tissue"
                ]
              }
            ]
          },
          {
            "sub": "Glycogenesis (สร้าง glycogen)",
            "body": [
              {
                "text": "สร้างได้จาก monosaccharides, lactic acid, pyruvic acid และ de-aminated amino acid โดย **insulin กระตุ้นการทำงานของ glycogen synthase**"
              }
            ]
          },
          {
            "sub": "Glycogenolysis (สลาย glycogen)",
            "body": [
              {
                "text": "ใช้ phosphorylation แยก glucose ออกทีละโมเลกุล โดย **epinephrine และ glucagon เพิ่ม cAMP แล้ว cAMP ไป activate phosphorylase**"
              }
            ]
          }
        ]
      },
      {
        "heading": "การสลาย glucose: glycolysis, acetyl-CoA และ citric acid cycle",
        "source": "Metabolism p.35-36",
        "body": [
          {
            "text": "Glucose 1 mol ให้พลังงาน ~668,000 cal ขณะที่การสร้าง ATP 1 mol จาก ADP ใช้ 12,000 cal การสลาย glucose จึงทำเป็นหลายขั้นเพื่อปล่อยพลังงานทีละน้อย รวมแล้ว **1 glucose ให้ 38 ATP**"
          },
          {
            "sub": "1. Glycolysis",
            "body": [
              {
                "text": "1 glucose ให้ **2 ATP (สร้าง 4 ATP ใช้ไป 2 ATP) + 2 pyruvic acid + 4 H+**"
              }
            ]
          },
          {
            "sub": "2. Conversion of pyruvic acid to acetyl-CoA",
            "body": [
              {
                "text": "1 glucose ให้ 2 pyruvic acid ซึ่งเปลี่ยนเป็น **2 acetyl-CoA + 4 H+ โดยไม่มี ATP เกิดขึ้น** acetyl-CoA จะไปให้ ATP ต่อใน Citric acid cycle"
              }
            ]
          },
          {
            "sub": "3. Citric acid cycle (CAC) (p.36)",
            "body": [
              {
                "text": "หรือ Krebs cycle หรือ tricarboxylic acid cycle (TCA) เกิดที่ **mitochondrial matrix**"
              },
              {
                "text": "2 Acetyl-part + 2 oxaloacetic acid → 2 oxaloacetic acid + **16 H+ + 2 ATP**"
              },
              {
                "text": "รวม 1 glucose ได้ **24 H+ แต่ใช้จริงเพียง 20 H+**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Oxidative phosphorylation 3 ขั้นใน mitochondria",
        "source": "Metabolism p.37",
        "body": [
          {
            "text": "หลังแยก H atom จากอาหารเป็น H+ และ e- แล้ว **NAD+ รับ H+ กลายเป็น NADH และ FAD รับ 2H+ กลายเป็น FADH2**"
          },
          {
            "sub": "1. Electron transport chain",
            "body": [
              {
                "text": "อยู่ที่ mitochondria matrix และ inner membrane"
              },
              {
                "bullets": [
                  "Electron carrier: **NADH และ FADH2**",
                  "Electron acceptors: flavoprotein, iron sulfide proteins, ubiquinone และ cytochromes B, C1, C, A และ A3"
                ]
              }
            ]
          },
          {
            "sub": "2. Chemiosmotic mechanism",
            "body": [
              {
                "text": "ที่ inner membrane ของ mitochondria มีการปั๊ม H+ ออกไป outer chamber โดยใช้พลังงานที่ปล่อยระหว่างการขนส่ง e- แล้ว **special ATPase (ATP synthetase) เปลี่ยน ADP เป็น ATP โดยใช้พลังงานจากการไหลของ H+**"
              }
            ]
          },
          {
            "sub": "3. ATP transportation into cytosol",
            "body": [
              {
                "text": "ขนส่ง **3 ATP (จาก 2e-)** ออกสู่ cytosol ด้วย facilitated และ passive diffusion"
              }
            ]
          }
        ]
      },
      {
        "heading": "บัญชี ATP รวม 38 ATP และการควบคุมอัตราการปล่อยพลังงาน",
        "source": "Metabolism p.38",
        "body": [
          {
            "sub": "ATP formation ใน aerobic glucose metabolism",
            "body": [
              {
                "bullets": [
                  "Glycolysis net = 4 ATP - 2 ATP = **2 ATP**",
                  "CAC net = **2 ATP** ต่อ 2 pyruvic acid หรือ 1 glucose",
                  "Chemiosmotic mechanism จาก 20 H+ = 3 ATP x (20 H+/2 H+) = **30 ATP**",
                  "อีก 4 H+ ให้ 2 ATP ต่อ 2 H+ = **4 ATP** โดยไม่ผ่าน electron transport chain",
                  "**รวม 38 ATP = 456,000 cal จาก glucose 1 mol (~668,000 cal)**"
                ]
              },
              {
                "text": "คิดเป็น **energy transfer efficiency 66% และเป็น heat 34%**"
              }
            ]
          },
          {
            "sub": "Control of rate energy release",
            "body": [
              {
                "bullets": [
                  "**ความเข้มข้นของ ADP และ ATP**: ATP ยับยั้ง phosphofructokinase ใน glycolysis ส่วน ADP และ AMP กระตุ้น enzyme นี้",
                  "**ความเข้มข้นของ citrate ion ใน CAC**: citrate ion ยับยั้ง phosphofructokinase",
                  "**AMP-ADP-ATP system**: ขึ้นกับการมี AMP และ ADP (substrates) ให้เปลี่ยนเป็น ATP"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Anaerobic CHO metabolism, Cori cycle และ oxygen debt",
        "source": "Metabolism p.39",
        "body": [
          {
            "text": "Anaerobic energy คือกลไก lifesaving ตอน O2 ไม่พอ"
          },
          {
            "bullets": [
              "**Glycogenolysis** ปล่อย glucose ได้นานถึง 1 ชม.",
              "**Anaerobic glycolysis** เป็น wasteful energy transfer ได้เพียง **2 ATP ต่อ glucose ที่เปลี่ยนเป็น pyruvic acid**"
            ]
          },
          {
            "sub": "Formation of lactic acid",
            "body": [
              {
                "text": "เกิดมากที่ skeletal muscle เมื่อมี pyruvic acid, H+ และ NADH เกิน จะถูกเปลี่ยนเป็น lactic acid โดย **Lactic dehydrogenase (LDH)**"
              },
              {
                "text": "เมื่อมี O2 แล้ว lactic acid ถูกใช้เป็น fuel เปลี่ยนกลับเป็น pyruvic acid หรือ glucose โดยเกิดมากที่ **liver และ heart**"
              },
              {
                "text": "**Cori cycle**: skeletal muscle เปลี่ยน glucose เป็น lactate ส่วน liver และ heart เปลี่ยน lactate กลับเป็น glucose"
              }
            ]
          },
          {
            "sub": "Oxygen debt",
            "body": [
              {
                "text": "เกิดหลัง anaerobic metabolism สูง เช่น strenuous exercise ที่ทำให้ glycogen, ATP และ creatine phosphate พร่อง"
              },
              {
                "bullets": [
                  "มี prolonged increased O2 consumption และ high oxidation metabolic process",
                  "เพื่อ replenish glycogen, ATP และ CrP",
                  "และ clear waste products คือ lactic acid และ heat"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Gluconeogenesis",
        "source": "Metabolism p.40",
        "body": [
          {
            "text": "Gluconeogenesis คือการเปลี่ยน amino acid และ fat ไปเป็น CHO เกิดเมื่อ cellular CHO หรือ blood glucose level ลดลง"
          },
          {
            "sub": "Substrates",
            "body": [
              {
                "bullets": [
                  "Amino acid (AA)",
                  "Glycerol ของ fat",
                  "Lactic acid"
                ]
              }
            ]
          },
          {
            "sub": "ฮอร์โมนที่เกี่ยวข้อง",
            "body": [
              {
                "bullets": [
                  "Pancreas: **Glucagon**",
                  "Adenohypophysis: Corticotrophin releasing hormone (CRH)",
                  "Adrenal cortex: **Cortisol (glucocorticoid)** ซึ่ง mobilize protein ให้เป็น AA"
                ]
              }
            ]
          },
          {
            "sub": "อวัยวะ",
            "body": [
              {
                "bullets": [
                  "**Liver**: รักษา blood glucose ระหว่างมื้อ เพื่อ brain และ RBC ผ่าน glycogenolysis และ gluconeogenesis จาก lactic acid และ AA (alanine)",
                  "**Kidney**: ใช้ AA และ substrate อื่น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pentose phosphate pathway",
        "source": "Metabolism p.41",
        "body": [
          {
            "text": "คิดเป็น **30% ของการสลาย glucose** เกิดที่ **liver และ fat tissue**"
          },
          {
            "sub": "สิ่งที่สร้างได้",
            "body": [
              {
                "bullets": [
                  "**NADPH**",
                  "Pentoses (5-carbon sugars)",
                  "Ribose 5-phosphate"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ใช้ใน fatty acid synthesis เมื่อ glycogen เต็มแล้ว",
              "Regenerate glucose ได้",
              "เป็น precursor สำหรับการสังเคราะห์ nucleotides"
            ]
          }
        ]
      },
      {
        "heading": "ชนิดของ lipid ในร่างกาย",
        "source": "Metabolism p.42-44",
        "body": [
          {
            "text": "สไลด์ 42 เป็นสไลด์คั่นหัวข้อ ไล่หัวข้อย่อยของ lipid metabolism คือ Lipids, Lipid absorption, Lipid transportation และ Lipid utilization and storage"
          },
          {
            "sub": "Simple lipids (p.43)",
            "body": [
              {
                "text": "เป็น ester ของ fatty acid (FA) กับ alcohol โดย FA คือ long-chain hydrocarbon organic acid ตัวอย่างคือ **Triglyceride = 3 long-chain FA กับ 1 glycerol**"
              }
            ]
          },
          {
            "sub": "Compound lipids (p.43)",
            "body": [
              {
                "bullets": [
                  "**Phospholipid** = FA + phosphoric acid radical 1 หมู่",
                  "**Glycolipid** = FA + CHO"
                ]
              }
            ]
          },
          {
            "sub": "Derived lipids (p.43)",
            "body": [
              {
                "text": "เป็น metabolites ของ simple หรือ compound lipid อาจไม่มี FA เช่น steroid nucleus (สร้างจาก FA) และ cholesterol"
              }
            ]
          },
          {
            "sub": "Triglyceride (p.44)",
            "body": [
              {
                "bullets": [
                  "เป็น natural fat จาก animal, dairy หรือ vegetable",
                  "FA ที่พบบ่อยที่สุดในสัตว์คือ **steric, oleic และ palmitic acids**",
                  "เป็น **main energy donor** ใน lipid family และเป็นส่วนหนึ่งของ membrane"
                ]
              }
            ]
          },
          {
            "sub": "Phospholipid (p.44)",
            "body": [
              {
                "bullets": [
                  "ได้แก่ **lecithin, cephalin และ sphingomyelin** ละลายได้ทั้งใน lipid และ water ขนส่งในรูป lipoproteins",
                  "สังเคราะห์ได้ทุกเซลล์แต่ **90% มาจาก liver**",
                  "อัตราการสังเคราะห์ขึ้นกับระดับ TG หรือ metabolic rate, ระดับ choline สำหรับ lecithin และระดับ inositol สำหรับ cephalins"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cholesterol และประโยชน์ 4 ข้อ",
        "source": "Metabolism p.45",
        "body": [
          {
            "bullets": [
              "**Exogenous cholesterol** มาจากอาหาร ดูดซึมที่ GI ผ่าน protein transporter",
              "**Endogenous cholesterol** สังเคราะห์ได้ในเซลล์ส่วนใหญ่ โดยหลักจาก liver และเป็นสัดส่วนส่วนใหญ่ของ cholesterol ทั้งหมด สร้างจาก sterol nucleus ที่มาจาก acetyl-CoA และถูกนำไปประกอบใน cell membrane"
            ]
          },
          {
            "sub": "Uses of cholesterols",
            "body": [
              {
                "bullets": [
                  "**Formation of cholic acid ที่ liver ใช้ cholesterol ถึง 80%** เพื่อสร้าง bile salts สำหรับ fat digestion และ absorption",
                  "**Steroid hormone และ Vitamin D synthesis** ได้แก่ adrenocortical hormones, progesterone, estrogen และ testosterone",
                  "**Incorporation ใน corneum ของผิวหนัง** ซึ่งทนต่อ chemical reactions สูง ป้องกันการระเหยของน้ำและการดูดซึมสาร water-soluble",
                  "**Cellular membrane structure**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Lipid absorption: จากลำไส้สู่กระแสเลือด",
        "source": "Metabolism p.46",
        "body": [
          {
            "sub": "1. GI absorption ที่ duodenum และ jejunum",
            "body": [
              {
                "bullets": [
                  "Bile salt จับกับ phospholipid ของ fat particle เกิด emulsion ของ fat droplet",
                  "Enterocyte water soluble lipase ย่อยได้ monoglyceride และ FA ซึ่ง diffuse เข้า enterocyte",
                  "**Micelle** = small lipids + cholesterols + fat soluble Vitamin"
                ]
              }
            ]
          },
          {
            "sub": "2. จาก GI สู่เลือด ผ่าน GI epithelium",
            "body": [
              {
                "bullets": [
                  "Monoglyceride และ FA รวมตัวใหม่เป็น TG",
                  "แพ็กเป็น **chylomicron** ขนาด **0.08-0.6 micron** ประกอบด้วย TG + apoprotein B, phospholipid และ cholesterol",
                  "ขนส่งเข้า lymphatic circulation ผ่าน thoracic duct เข้าสู่ venous blood circulation"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การกำจัด chylomicron ออกจากเลือด และผลต่อการเจาะเลือด",
        "source": "Metabolism p.47",
        "body": [
          {
            "text": "Plasma chylomicron **เพิ่มเป็น 1-2% ที่ 1 ชม. หลังอาหาร ทำให้พลาสมาขุ่น (turbid)**"
          },
          {
            "bullets": [
              "**Lipoprotein lipase** ที่ fat tissue และ liver capillary ย่อย TG และ phospholipid ปล่อย FA และ glycerol",
              "FA diffuse ผ่าน capillary endothelium เข้า storage cell แล้วรวมกับ glycerol ของเซลล์เป็น TG ใหม่",
              "เซลล์ใช้ FA เป็นพลังงานได้"
            ]
          },
          {
            "callout": "จุดประยุกต์ทางคลินิกที่สไลด์เขียนไว้ Turbidity ทำให้เกิด blood chemistry error จึงต้อง **FAST 8-12 ชม. ก่อนเก็บเลือด**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Free fatty acid (FFA)",
        "source": "Metabolism p.48",
        "body": [
          {
            "text": "เมื่อ blood glucose และ α-glycerophosphate ต่ำ ร่างกายต้องดึงไขมันจากที่เก็บมาใช้เป็นเชื้อเพลิง"
          },
          {
            "bullets": [
              "**Epinephrine และ glucagon เพิ่ม cAMP ไป activate hormone-sensitive triglycerol lipase**",
              "เกิด hydrolysis ของ TG ได้ FA และ glycerol แล้วขนส่ง FA ไปยังเซลล์อื่นที่ต้องการพลังงาน"
            ]
          },
          {
            "sub": "ลักษณะของ FFA ในพลาสมา",
            "body": [
              {
                "bullets": [
                  "FFA = **3-30 ionized FA จับกับ albumin 1 โมเลกุล**",
                  "FFA dissociate แล้ว diffuse ไปใช้ที่ **skeletal muscle, heart และ renal cortex**",
                  "**Turnover rate: 2-3 นาที**"
                ]
              }
            ]
          },
          {
            "text": "การเพิ่มการใช้ไขมันจะเพิ่มทั้งระดับในพลาสมาและการขนส่ง"
          }
        ]
      },
      {
        "heading": "Lipoproteins และการแบ่งชนิดตาม density",
        "source": "Metabolism p.49-50",
        "body": [
          {
            "text": "Lipoproteins คือ lipid-binding proteins ซึ่งคิดเป็น **95% ของ plasma lipid** ทำหน้าที่ขนส่งไขมันระหว่างอวัยวะ สังเคราะห์ที่ liver และ intestinal epithelial cell ประกอบด้วย TG, phospholipid, cholesterol และ protein"
          },
          {
            "bullets": [
              "Density แปรผันตามสัดส่วนองค์ประกอบ โดย **TG ทำให้ density ต่ำ ส่วน protein ทำให้ density สูง**",
              "VLDL ขนส่งจาก liver ไป fat tissue ส่วนชนิดอื่นขนส่งระหว่าง liver กับเนื้อเยื่ออื่นในร่างกาย",
              "ที่ capillary ของ target tissue lipoprotein lipase ย่อย TG เป็น FA แล้ว FA diffuse เข้า target cell"
            ]
          },
          {
            "sub": "4 ชนิดตาม density (p.50)",
            "body": [
              {
                "bullets": [
                  "**VLDL**: TG สูง cholesterol และ phospholipid ปานกลาง",
                  "**IDL**: TG น้อยลง cholesterol และ phospholipid เพิ่มขึ้น",
                  "**LDL**: TG ต่ำมาก cholesterol และ phospholipid สูงกว่า เป็น **bad lipoprotein** สัมพันธ์กับ atherosclerosis และ coronary disease",
                  "**HDL**: protein สูงมาก cholesterol และ phospholipid ต่ำ แทบไม่มี TG เป็น **good lipoprotein** พา bad cholesterol จาก artery กลับไป liver ลดความเสี่ยง atherosclerosis และ coronary disease"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การใช้ TG เป็น ATP และการขนส่ง FA เข้า mitochondria",
        "source": "Metabolism p.51",
        "body": [
          {
            "text": "เมื่อ CHO เกิน ร่างกายเปลี่ยน CHO เป็น TG เก็บเป็น energy reserve และเมื่อ CHO ต่ำหรือต้องการพลังงานเพิ่ม จึงเปลี่ยน TG กลับเป็น ATP"
          },
          {
            "sub": "1. TG ใน storage cell",
            "body": [
              {
                "text": "**Hormone-sensitive triglycerol lipase** ถูกกระตุ้นโดย glucagon หรือ epinephrine ผ่าน cAMP ย่อย TG เป็น FA + glycerol (lipolysis) แล้วขนส่ง FA ในรูป lipoproteins หรือ FFA ไปเซลล์อื่น **ยกเว้น brain และ RBC**"
              }
            ]
          },
          {
            "sub": "2. ใน cytoplasm และ mitochondria",
            "body": [
              {
                "bullets": [
                  "Glycerol เปลี่ยนเป็น glycerol-3-phosphate เข้าสู่ glycolysis",
                  "**FA จับกับ carnitine ซึ่งทำหน้าที่เป็น shuttle** ที่ outer mitochondrial membrane เพื่อขนส่ง FA เข้า mitochondria matrix",
                  "FA + CoA เป็น fatty acyl-CoA และผ่านรูป fatty acyl-carnitine ก่อนกลับเป็น fatty acyl-CoA พร้อมปล่อย free carnitine"
                ]
              }
            ]
          },
          {
            "text": "3. Fatty acyl-CoA ใน mitochondrial matrix เข้าสู่ **beta-oxidation pathway** ให้ acetyl-CoA, NAD+ และ FAD"
          }
        ]
      },
      {
        "heading": "Beta-oxidation และบัญชี ATP ของ steric acid",
        "source": "Metabolism p.52",
        "body": [
          {
            "text": "Beta-oxidation เกิดมากที่ **heart และ skeletal muscle**"
          },
          {
            "sub": "ขั้นตอน",
            "body": [
              {
                "bullets": [
                  "FA + CoA เป็น fatty acyl-CoA",
                  "**Beta-carbon (คาร์บอนตัวที่ 2 นับจากขวา)** ของ fatty acyl-CoA ถูก oxidize กับ oxygen",
                  "คาร์บอน 2 ตัวถูกแยกออกมาเป็น acetyl-CoA และ CoA ใหม่จับกับ FA ที่สั้นลง 2 คาร์บอนและ 4 H เพื่อวน beta-oxidation ต่อ",
                  "Acetyl-CoA เข้า cellular fluid แล้วเข้า CAC ให้ ATP และ 8 H+ เข้าสู่ chemiosmotic phosphorylation"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่าง steric acid 18 C คือ CH3(CH2)16CO2H",
            "body": [
              {
                "bullets": [
                  "ถูก oxidize ที่ beta-carbon **8 ครั้ง**",
                  "ได้ 9 Acetyl-CoA เข้า CAC = 9(1 ATP + 8 H+) = **9 ATP + 72 H+**",
                  "อีก 32 H+ มาจาก 8 รอบของ beta-oxidation (4 H+ ต่อการแยก 1 acetyl-CoA)",
                  "**รวม 104 H+**",
                  "34 H+ จับกับ FAD (1 ATP/H+) = 34 ATP",
                  "70 H+ จับกับ NAD+ (1.5 ATP/H+) = 105 ATP",
                  "net ATP = 148 - 2 (ATP ที่ใช้ตอนเริ่ม beta-oxidation) = **146 ATP**",
                  "**Total ATP = 9 + 146 = 155 ATP**"
                ]
              }
            ]
          },
          {
            "callout": "ระวังตอนท่องตัวเลขชุดนี้ บนสไลด์เดียวกัน 34 + 105 รวมได้ 139 ไม่ใช่ 148 ตามที่เขียนไว้ในบรรทัด net ATP สไลด์ไม่ได้อธิบายส่วนต่างนี้ เวลาสอบให้ยึดตัวเลขตามที่อาจารย์เขียน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Ketone body และ ketosis",
        "source": "Metabolism p.53-54",
        "body": [
          {
            "sub": "Acetoacetic acid formation (p.53)",
            "body": [
              {
                "text": "ที่ liver เมื่อ acetyl-CoA จาก beta-oxidation มากกว่า oxaloacetate จะเกิด **2 acetyl-CoA + H2O → acetoacetic acid + 2 HCoA** แล้ว acetoacetic acid เปลี่ยนต่อเป็น hydroxybutyric (มากกว่า) หรือ acetone"
              },
              {
                "text": "**Ketone body ประกอบด้วย acetoacetic acid, hydroxybutyric และ acetone**"
              },
              {
                "bullets": [
                  "Diffuse ออกจาก liver cell แบบ passive เข้าสู่กระแสเลือดไปยัง target cells ได้เร็วเพราะละลายน้ำได้ดี",
                  "Target tissue ที่ใช้เป็นพลังงาน คือ **heart, skeletal muscle และ kidney** โดย acetoacetic acid ย้อนกลับเป็น acetyl-CoA เข้า CAC"
                ]
              }
            ]
          },
          {
            "sub": "Ketosis (p.54)",
            "body": [
              {
                "text": "คือภาวะที่ ketone bodies ใน ECF สูงมาก พบระหว่าง"
              },
              {
                "bullets": [
                  "มีอัตราการใช้ไขมันหรือ deamination เพิ่มขึ้น",
                  "**DM** ซึ่งเซลล์ไม่สามารถ uptake glucose ได้",
                  "**Starvation** ซึ่งไม่มี CHO ให้ใช้",
                  "อาหารที่ขาด CHO หรือ high fat diet"
                ]
              },
              {
                "text": "**Ketoacidosis** คือ ketosis ที่ควบคุมไม่ได้ร่วมกับ acidosis เช่น **Diabetic ketoacidosis (DKA)** ซึ่งสไลด์ระบุว่าเป็น lethal situation"
              }
            ]
          }
        ]
      },
      {
        "heading": "Lipogenesis",
        "source": "Metabolism p.55",
        "body": [
          {
            "text": "คือการเปลี่ยน CHO ส่วนเกินไปเป็น FA และ TG โดย CHO จะไปเป็น glycogen ก่อนแล้วจึงเป็น TG เกิดที่ **liver และ fat cells** โดย liver ขนส่ง TG ออกในรูป VLDL ส่วน fat cell ย่อย FA แล้วเก็บเป็น TG"
          },
          {
            "sub": "ขั้นตอนที่สไลด์เขียนไว้",
            "body": [
              {
                "bullets": [
                  "CHO เปลี่ยนเป็น Acetyl-CoA ผ่าน pentose phosphate pathway และ glycolysis โดย **insulin เพิ่ม glucose uptake และ utilization**",
                  "Acetyl-CoA + 16 NADPH + 16 H+ → steric acid + 8 CO2 + 9 CoA + 16 NADP+ + 7 H2O",
                  "FA (C14-18) + glycerol (จาก α-glycerophosphate ใน glycolysis) → **TG**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Fat deposits: adipose tissue และ liver",
        "source": "Metabolism p.56",
        "body": [
          {
            "sub": "1. Adipose tissue",
            "body": [
              {
                "bullets": [
                  "เก็บไขมัน โดย **TG คิดเป็น 80-95% ของ cell volume** และทำหน้าที่ heat insulation",
                  "สังเคราะห์ TG และ FA จาก CHO ได้เล็กน้อย",
                  "**Capillary lipoprotein lipase** ย่อย TG จาก plasma chylomicron หรือ lipoprotein",
                  "**Hormone-sensitive triglycerol lipase** ย่อย TG เพื่อส่ง FFA ให้เซลล์อื่น เกิดเมื่อ CHO ไม่พอ, glucocorticoid และ glucagon สูง, insulin ต่ำ",
                  "มี fat turnover ภายในเซลล์"
                ]
              }
            ]
          },
          {
            "sub": "2. Liver",
            "body": [
              {
                "bullets": [
                  "Catalyze FA ให้เป็นสารที่เล็กลง คือ ketone bodies",
                  "สังเคราะห์ TG จาก acetyl-CoA, CHO และ proteins",
                  "สังเคราะห์ cholesterol และ phospholipid",
                  "**Desaturate FA เป็น unsaturated FA ด้วย dehydrogenase** แล้วส่งต่อไปเซลล์อื่น (สไลด์ระบุว่ายังไม่พอ)"
                ]
              },
              {
                "text": "**Feline hepatic lipidosis** พบใน early starvation, DM และภาวะที่ใช้ไขมันสูง กลไกตามสไลด์คือ adipocyte ปล่อย TG เป็น plasma FFA แล้ว liver resynthesize กลับเป็น TG จนเกิด fatty liver (Verbrugghe and Bakovic, 2013)"
              }
            ]
          }
        ]
      },
      {
        "heading": "การควบคุมการปล่อยพลังงานจาก TG",
        "source": "Metabolism p.57",
        "body": [
          {
            "text": "สไลด์ไล่ 5 ภาวะ โดย 4 ข้อแรก (insulin insufficiency, exercise-induced sympathetic stimulation, stress-induced corticotrophin และ glucocorticoid release, growth hormone) สไลด์ระบุตรงกันว่า **activate hormone-sensitive triglycerol lipase ใน fat cells** ส่วนข้อ 5 Thyroid hormone สไลด์เขียนเพียงว่าเพิ่ม MR และ lipolysis ไม่ได้ระบุกลไกผ่าน hormone-sensitive triglycerol lipase"
          },
          {
            "bullets": [
              "**Insulin insufficiency**: ใช้ CHO ไม่ได้ จึงเพิ่มการใช้ TG และเพิ่มความเสี่ยง ketosis และ DKA",
              "**Exercise-induced sympathetic stimulation**: เพิ่มการสลาย TG",
              "**Stress-induced corticotrophin และ glucocorticoid release**: พบใน chronic stress หรือ Cushing's disease เพิ่มความเสี่ยง ketosis",
              "**Growth hormone**: มี mild ketogenic effect",
              "**Thyroid hormone**: เพิ่ม MR และ lipolysis"
            ]
          }
        ]
      },
      {
        "heading": "Feedback control ของระดับ cholesterol",
        "source": "Metabolism p.58",
        "body": [
          {
            "bullets": [
              "**กิน cholesterol เพิ่ม** ทำให้ plasma cholesterol เพิ่ม และไปยับยั้ง enzyme สังเคราะห์ cholesterol คือ **3-hydroxy-3-methylglutaryl CoA reductase**",
              "**Highly saturated fatty diet** เพิ่ม liver acetyl-CoA สำหรับสังเคราะห์ cholesterol ทำให้ plasma cholesterol เพิ่ม **15-25%**",
              "**Highly unsaturated fatty acid diet** ลดความเข้มข้นของ plasma cholesterol",
              "**Insulin ลดลง หรือ thyroid hormone สูง** เพิ่มการทำงานของ lipid enzyme ทำให้ blood cholesterol เพิ่ม",
              "**การใช้และขนส่งไขมันเพิ่มขึ้น** จาก MR สูงและการออกกำลังกาย เพิ่ม blood cholesterol"
            ]
          }
        ]
      },
      {
        "heading": "Proteins: องค์ประกอบและชนิดของ amino acid",
        "source": "Metabolism p.59-60",
        "body": [
          {
            "text": "สไลด์ 59 เป็นสไลด์คั่นหัวข้อ ระบุหัวข้อย่อย 3 ส่วน คือ Proteins, Protein absorption transportation and storage และ Controls of protein metabolism"
          },
          {
            "text": "Proteins คิดเป็น **สามในสี่ของ body solid** ได้แก่ structural proteins, enzymes, nucleoproteins, transporters, contractile proteins ฯลฯ"
          },
          {
            "text": "**Amino acids (AA)** เป็น subunit ของ protein และให้พลังงานได้ (muscle fiber) โครงสร้างประกอบด้วย amino group (-NH2), carboxyl group (-COOH), hydrogen atom (-H) และ central (alpha) carbon ที่มี side chain (-R)"
          },
          {
            "sub": "การแบ่งชนิดของ AA ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "Structures",
                  "Polarity",
                  "Charged",
                  "Acid-base",
                  "Essential"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ 61 ไม่มีข้อความเลย เป็นรูปล้วน (น่าจะเป็นตารางหรือโครงสร้าง AA) จึงสรุปเนื้อหาให้ไม่ได้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Essential และ non-essential amino acid",
        "source": "Metabolism p.62",
        "body": [
          {
            "sub": "Essential AA",
            "body": [
              {
                "text": "ได้จากอาหาร มีประมาณ **10 ชนิด และเป็น species specific** เพราะร่างกายสังเคราะห์เองไม่ได้ (หรือได้ไม่พอ)"
              }
            ]
          },
          {
            "sub": "Non-essential AA",
            "body": [
              {
                "text": "สังเคราะห์ที่ liver ผ่าน **transamination** โดยย้าย -NH2 จาก AA ตัวหนึ่ง (glutamate) ไปยัง keto oxygen ของ α-keto acid (เช่น pyruvic acid) ได้เป็น AA ตัวใหม่ (เช่น alanine)"
              },
              {
                "bullets": [
                  "Enzyme: **amino transferase เช่น alanine transferase (ALT)**",
                  "ต้องใช้ **Vit B6 derivatives**",
                  "Pyruvic acid (จาก glycolysis) และ glutamate (ซึ่งเป็น amino radical storehouse) มีอยู่มาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พันธะและการแบ่งชนิดของ protein",
        "source": "Metabolism p.63",
        "body": [
          {
            "sub": "Peptide bond",
            "body": [
              {
                "text": "เป็น **covalent bond** ระหว่าง C ของ -COOH กับ N ของ -NH2 โดยเกิด dehydration (ปล่อย H2O ออก) ส่วนพันธะอื่นที่เชื่อม peptide chain เข้าด้วยกันคือ hydrogen, disulphide หรือ salt bond"
              }
            ]
          },
          {
            "sub": "แบ่งตามจำนวน AA",
            "body": [
              {
                "bullets": [
                  "**Peptides: 2-10 AA**",
                  "**Polypeptides: 11-99 AA**",
                  "**Proteins: มากกว่า 100 AA** อาจมีองค์ประกอบอื่นร่วม"
                ]
              }
            ]
          },
          {
            "sub": "แบ่งตาม composition",
            "body": [
              {
                "bullets": [
                  "**Glycoproteins**: มี CHO",
                  "**Lipoproteins**: มี lipids",
                  "**Complete proteins**: สัดส่วนของ AA ใกล้เคียงกับ body proteins"
                ]
              }
            ]
          },
          {
            "text": "แบ่งตาม structures ได้เป็น primary, secondary, tertiary และ quaternary structures"
          }
        ]
      },
      {
        "heading": "Plasma protein: หน้าที่และการสร้าง",
        "source": "Metabolism p.64",
        "body": [
          {
            "sub": "หน้าที่",
            "body": [
              {
                "bullets": [
                  "**Albumin**: oncotic pressure",
                  "**Globulin**: enzymatic และ immune functions",
                  "**Fibrinogen**: blood coagulation"
                ]
              }
            ]
          },
          {
            "sub": "Plasma protein formation",
            "body": [
              {
                "text": "**Liver** สร้าง albumin, fibrinogen และ **50-80% ของ globulin**"
              },
              {
                "bullets": [
                  "อัตราการสร้างเพิ่มขึ้นเมื่อมีการใช้หรือสูญเสียเพิ่ม เช่น burn, PLE และ PLN",
                  "อัตราการสร้างลดลงใน cirrhosis และ starvation"
                ]
              },
              {
                "text": "**Lymphoid tissue** สร้าง gamma globulin โดยอัตราการสร้างแปรผันตาม immune status"
              }
            ]
          }
        ]
      },
      {
        "heading": "Protein absorption, transportation และ storage",
        "source": "Metabolism p.65-66",
        "body": [
          {
            "sub": "1. GI Absorption (p.65)",
            "body": [
              {
                "bullets": [
                  "Digestion เกิดที่ lumen, membrane และ cytoplasm ใช้ acid และ proteolytic enzymes",
                  "Absorption ผ่าน AA transporters โดย AA ถูกดูดซึมมากกว่า small peptides",
                  "**ค่อย ๆ ดูดซึมใช้เวลา 2-3 ชม.**"
                ]
              }
            ]
          },
          {
            "sub": "2. Blood AA (p.65)",
            "body": [
              {
                "bullets": [
                  "ระดับในเลือดเพิ่มเพียงไม่กี่ mg/dL เพราะขนส่งเร็ว",
                  "อยู่ในรูป ionized และ acid forms"
                ]
              }
            ]
          },
          {
            "sub": "3. Cellular uptake (p.65)",
            "body": [
              {
                "bullets": [
                  "ใช้ carriers ทั้งแบบ facilitated และ active transport",
                  "เซลล์รับ AA จากเลือดได้เร็ว โดยเฉพาะที่ **liver**",
                  "Proximal tubular epithelium มี **renal threshold for AA reabsorption**"
                ]
              }
            ]
          },
          {
            "sub": "4-6. ภายในเซลล์และการส่งกลับเข้าเลือด (p.66)",
            "body": [
              {
                "bullets": [
                  "AA ในเซลล์สร้าง peptide bond เป็นโปรตีน **ควบคุมโดย mRNA** แล้วโปรตีนนั้นถูกใช้ ส่งออก หรือเก็บไว้",
                  "การสลายโปรตีนในเซลล์กลับเป็น AA ใช้ **lysosomal proteolytic enzymes แต่ไม่ทำกับ cellular DNA-RNA, structures และ contractile fibers**",
                  "การส่ง AA จากในเซลล์กลับเข้าเลือดเกิดที่ **liver และ skeletal muscle** เพื่อรักษาระดับ blood AA และส่งไป target organs สำหรับ growth, protein synthesis หรือ energy",
                  "**Macrophage** ทำ pinocytosis จับ plasma proteins มาย่อยเป็น AA แล้วปล่อยกลับเข้าเลือด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Protein equilibrium",
        "source": "Metabolism p.67",
        "body": [
          {
            "text": "สไลด์ระบุ **cell-to-blood ratio ของโปรตีนที่ 33:1**"
          },
          {
            "sub": "รักษาสมดุลโดย",
            "body": [
              {
                "bullets": [
                  "Cellular AA uptake",
                  "Protein formation และ storage (proteins, glycogen และ lipids)",
                  "Protein degradation",
                  "Cell-blood AA transportation"
                ]
              }
            ]
          },
          {
            "sub": "ถูกเปลี่ยนแปลงโดย",
            "body": [
              {
                "bullets": [
                  "Pathophysiologic events บางอย่าง เช่น **cancer หรือ malnutrition**",
                  "ฮอร์โมนที่เพิ่ม protein storage คือ **insulin และ GH**",
                  "ฮอร์โมนที่เพิ่ม protein degradation คือ **glucocorticoids**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ketogenic และ glucogenic amino acid",
        "source": "Metabolism p.68",
        "body": [
          {
            "text": "Liver จะใช้ protein เป็นพลังงานเมื่อ CHO หรือ fat พร่อง และเมื่อกิน AA มากเกิน"
          },
          {
            "sub": "Ketogenic amino acid",
            "body": [
              {
                "text": "ได้แก่ **Leucine, isoleucine และ valine** สังเคราะห์ไปเป็น ketone body หรือ acetyl-CoA แล้วเข้า CAC เพื่อให้พลังงาน หรือไปเป็น fatty acid (ketogenesis)"
              }
            ]
          },
          {
            "sub": "Glucogenic amino acid",
            "body": [
              {
                "text": "ได้แก่ **Alanine, aspartate, glutamate และ glutamine** ผ่าน deamination แล้วเข้า gluconeogenesis และ glycogenesis"
              },
              {
                "bullets": [
                  "Skeletal muscle เป็นตัวส่ง **alanine** ให้ liver",
                  "**Glutamate มีมากใน liver**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Deamination, urea cycle และ oxidation ของ deaminated AA",
        "source": "Metabolism p.69-70",
        "body": [
          {
            "sub": "1. Deamination of AA เกิดที่ liver และ kidney (p.69)",
            "body": [
              {
                "text": "สไลด์แบ่งไว้ 2 แบบตามชื่อและ enzyme ที่เขียนกำกับ"
              },
              {
                "bullets": [
                  "**Non oxidative deamination**: ใช้ deaminase enzyme ได้ α-keto acid และ **Ammonia (NH3)**",
                  "**Oxidative deamination**: ใช้ aminotransferase ดึงหมู่ amino (ในรูป NH3) จาก primary AA ไปให้ α-keto acid ทำให้ primary AA กลายเป็น keto acid และได้ AA ตัวใหม่ กระตุ้นได้ด้วยการมี AA เพิ่มขึ้น"
                ]
              }
            ]
          },
          {
            "sub": "2. Urea formation in liver: urea cycle (p.69)",
            "body": [
              {
                "bullets": [
                  "กำจัด NH3 ซึ่งมีความเป็นพิษสูงออกจากเลือด",
                  "สร้าง urea ที่ liver โดยใช้ enzyme หลายตัว แล้ว urea diffuse เข้าเลือดอย่างอิสระและถูก filtrate ที่ไต",
                  "วัดได้เป็น **Blood urea nitrogen (BUN)** ถ้า BUN สูงเรียก **uremia**",
                  "ถ้า liver ทำงานผิดปกติจะเกิด **NH3 คั่งในเลือด (ammoniemia)** ทำให้เกิดปัญหาทางสมอง คือ **HE: hepatic encephalopathy**"
                ]
              }
            ]
          },
          {
            "sub": "3. Oxidation of deaminated AA (p.70)",
            "body": [
              {
                "text": "**α-ketoglutaric acid ซึ่งเป็น carbon skeleton** เปลี่ยนเป็น substrate ใน CAC และเป็น acetyl-CoA เพื่อให้พลังงาน (ATP) โดยสไลด์ระบุว่า **ได้ ATP น้อยกว่า glucose เล็กน้อย**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Obligatory degradation และ severe starvation",
        "source": "Metabolism p.71",
        "body": [
          {
            "sub": "Obligatory degradation of proteins",
            "body": [
              {
                "text": "คือปริมาณโปรตีนที่ต้องถูกสลายและใช้ไปแม้ไม่ได้กินโปรตีนเลย ประมาณ **20-30 g/day**"
              },
              {
                "text": "ขณะที่ recommended protein intake อยู่ที่ประมาณ **60-75 g/day (1-1.2 g/kg BW/day)**"
              }
            ]
          },
          {
            "sub": "Severe starvation",
            "body": [
              {
                "bullets": [
                  "ขาดสิ่งที่ช่วย spare protein คือ CHO และ lipids",
                  "**เพิ่ม protein degradation เป็นประมาณ 125 g/day**",
                  "เพิ่ม oxidative deamination ของ AA",
                  "เกิด **negative nitrogen balance** ตามด้วย cellular malfunctions และเสียชีวิต"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hormonal regulation ของ protein metabolism",
        "source": "Metabolism p.72",
        "body": [
          {
            "bullets": [
              "**GH**: เพิ่ม protein synthesis ผ่านการ uptake AA และกระบวนการ transcription-translation-protein synthesis",
              "**Insulin**: เพิ่ม AA uptake และ glucose availability",
              "**Glucocorticoids**: เพิ่ม extrahepatic protein breakdown แต่เพิ่ม hepatic และ plasma proteins",
              "**Testosterone**: เพิ่ม protein synthesis และ deposition โดยเฉพาะที่กล้ามเนื้อ ต่อเนื่องได้หลายเดือนจนถึงขีดจำกัด",
              "**Estrogen**: ออกฤทธิ์ได้น้อยกว่า testosterone",
              "**Thyroxine**: เพิ่ม metabolism ของสารอาหารทุกชนิดทั้ง anabolic และ catabolic โดยใน **hyperthyroid จะเด่นไปทาง catabolic effect ทำให้สูญเสีย lean body mass**"
            ]
          }
        ]
      }
    ]
  },
  "physio-3--neonatal-physiology": {
    "topic": "physio-3--neonatal-physiology",
    "title": "Neonatal Physiology",
    "icon": "📘",
    "lecturer": "Chutamas Benjanirut",
    "summary": "เด็คนี้พูดถึงการปรับตัวของทารกแรกเกิดสู่ extrauterine life 2 เรื่องเท่านั้นตามที่สไลด์แบ่งไว้เอง คือ (1) Onset of Breathing และ (2) Circulatory Readjustments at Birth เนื้อหาส่วนใหญ่ (สไลด์ 5-11) เทน้ำหนักไปที่ระบบไหลเวียนเลือด คือ fetal circulation แล้วไล่การปิดของ shunt ทั้งสาม (foramen ovale, ductus arteriosus, ductus venosus) พร้อม patent ductus arteriosus เป็นภาวะผิดปกติเดียวที่เด็คพูดถึงยาว ส่วนระบบหายใจมีแค่สไลด์ 2-4 (สาเหตุที่เริ่มหายใจ, สาเหตุที่หายใจช้าหรือผิดปกติ, hypoxia ที่ทนได้, และ surfactant กับ respiratory distress syndrome) เด็คมีสไลด์รูป fetal circulation หลายแผ่นที่ text layer เหลือแค่คำว่า Ductus venosus ซ้ำ ๆ จึงไม่มีเนื้อความให้สรุปเพิ่มจากรูปเหล่านั้น และมี URL อ้างอิงภาพจากเว็บ (Cleveland Clinic, thirdage, heartbirthdefect) แทรกอยู่",
    "sections": [
      {
        "heading": "กรอบใหญ่ของเด็ค: การปรับตัว 2 อย่างของทารกแรกเกิด",
        "source": "Neonatal Physiology p.2",
        "body": [
          {
            "text": "สไลด์วางกรอบไว้ว่า Adjustments of the Infant to Extrauterine Life มี **2 หัวข้อ คือ 1. Onset of Breathing และ 2. Circulatory Readjustments at birth** ทั้งเด็คเดินตามสองหัวข้อนี้"
          }
        ]
      },
      {
        "heading": "Onset of Breathing และสาเหตุที่ทำให้เริ่มหายใจ",
        "source": "Neonatal Physiology p.2",
        "body": [
          {
            "text": "สไลด์ระบุว่าการเริ่มหายใจคือ one of the most important immediate adjustments"
          },
          {
            "bullets": [
              "หลัง normal delivery จากแม่ที่ไม่ถูกกด (not depressed by anesthetics) เด็ก **เริ่มหายใจภายในไม่กี่วินาที และมี normal respiratory rhythm ภายในน้อยกว่า 1 นาทีหลังคลอด**"
            ]
          },
          {
            "sub": "Cause of breathing at birth (2 ข้อตามสไลด์)",
            "body": [
              {
                "bullets": [
                  "**A slightly asphyxiated state** ที่เกิดขึ้นตามกระบวนการคลอด",
                  "**Sensory impulses ที่มาจากผิวหนังที่เย็นลงอย่างทันที** (suddenly cooled skin)"
                ]
              },
              {
                "text": "ถ้าเด็กไม่หายใจทันที ร่างกายจะ **hypoxic และ hypercapnia มากขึ้นเรื่อย ๆ ซึ่งเป็น additional stimulus ต่อ respiratory center** และมักทำให้เริ่มหายใจได้ภายในอีก 1 นาทีหลังคลอด"
              }
            ]
          }
        ]
      },
      {
        "heading": "Causes of delay or abnormal breathing at birth",
        "source": "Neonatal Physiology p.3",
        "body": [
          {
            "bullets": [
              "แม่ถูกกดด้วย **general anesthetic ระหว่างคลอด** ยาจะ partially anesthetize fetus ไปด้วย ทำให้ onset of respiration ช้าไปหลายนาที",
              "ทารกที่มี **head trauma ระหว่างคลอด** โดยสไลด์เน้นว่า intracranial hemorrhage หรือ brain contusion ทำให้เกิด concussion syndrome ที่ respiratory center ถูกกดอย่างมาก",
              "ทารกที่ผ่าน **prolonged delivery** จะหายใจช้า หรือบางครั้งไม่หายใจเลย"
            ]
          }
        ]
      },
      {
        "heading": "Prolonged hypoxia ระหว่างคลอด เกิดจากอะไร",
        "source": "Neonatal Physiology p.3",
        "body": [
          {
            "text": "สไลด์ให้เหตุ 4 ข้อของ prolong hypoxia ระหว่างคลอด"
          },
          {
            "bullets": [
              "Compression of the umbilical cord",
              "Premature separation of placenta",
              "Excessive contraction of the uterus ซึ่งตัดเลือดจากแม่ที่ไปเลี้ยง placenta",
              "Excessive anesthesia of the mother ซึ่งกด oxygenation ของเลือดแม่"
            ]
          }
        ]
      },
      {
        "heading": "Degree of Hypoxia ที่ทารกแรกเกิดทนได้",
        "source": "Neonatal Physiology p.3",
        "body": [
          {
            "bullets": [
              "ใน adult การไม่หายใจเพียง **4 นาที** มักทำให้เสียชีวิต",
              "แต่ neonate มักรอดได้นานถึง **10 นาที** ของการไม่หายใจหลังคลอด",
              "อย่างไรก็ตาม **ถ้าการหายใจถูกหน่วงเกิน 8 ถึง 10 นาที มักเกิด permanent and very serious brain impairment**"
            ]
          },
          {
            "callout": "ตัวเลขชุดนี้ (adult 4 นาที เทียบ neonate 10 นาที และเส้นแบ่ง 8 ถึง 10 นาที) เป็นจุดที่สไลด์เขียนชัดเจนที่สุดในหัวข้อระบบหายใจ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Respiratory Distress Syndrome กับ surfactant",
        "source": "Neonatal Physiology p.4",
        "body": [
          {
            "text": "สไลด์บอกว่า **หนึ่งใน most characteristic findings ของ respiratory distress syndrome คือ failure ของ respiratory epithelium ที่จะหลั่ง surfactant ในปริมาณเพียงพอ**"
          },
          {
            "bullets": [
              "Surfactant คือสารที่ปกติหลั่งเข้าสู่ alveoli เพื่อ **ลด surface tension ของ alveolar fluid ทำให้ alveoli เปิดออกได้ง่ายตอน inspiration**",
              "เซลล์ที่หลั่ง surfactant คือ **type II alveolar epithelial cells** และ **จะยังไม่เริ่มหลั่ง surfactant จนกระทั่ง 1 ถึง 3 เดือนสุดท้ายของ gestation**",
              "ดังนั้น premature babies จำนวนมาก และ full-term babies บางราย จึงเกิดมาโดยไม่สามารถหลั่ง surfactant ได้เพียงพอ และจะมี **collapse tendency ของ alveoli**"
            ]
          }
        ]
      },
      {
        "heading": "Circulatory Readjustments at Birth: ทำไม fetus ไม่ต้องปั๊มเลือดผ่านปอดและตับมาก",
        "source": "Neonatal Physiology p.4",
        "body": [
          {
            "bullets": [
              "สไลด์บอกว่าการปรับระบบไหลเวียน **สำคัญเท่า ๆ กับการเริ่มหายใจ** และ immediate circulatory adjustments ทำให้มี adequate blood flow ผ่าน lungs",
              "นอกจากนี้ circulatory adjustments ในช่วง **first few hours of life** ยังทำให้เลือดไหลผ่าน **liver** มากขึ้นเรื่อย ๆ ซึ่งก่อนหน้านี้มีเลือดผ่านน้อยมาก"
            ]
          },
          {
            "text": "เหตุผลที่สไลด์ให้คือ **เพราะ lungs แทบไม่ทำงานใน fetal life และ liver ทำงานเพียงบางส่วน จึงไม่จำเป็นที่ fetal heart จะต้องปั๊มเลือดผ่านทั้ง lungs และ liver มากนัก**"
          }
        ]
      },
      {
        "heading": "Fetal circulation: เส้นทางเลือดตามสไลด์",
        "source": "Neonatal Physiology p.5",
        "body": [
          {
            "bullets": [
              "เลือดที่กลับจาก placenta ผ่าน **umbilical vein** จะผ่าน **ductus venosus** ซึ่ง **bypass liver เป็นหลัก**",
              "เลือดส่วนใหญ่ที่เข้า right atrium จาก **inferior vena cava** ถูกส่งเป็นทางตรงไปตามด้านหลังของ right atrium ผ่าน **foramen ovale เข้าสู่ left atrium โดยตรง (bypass right ventricle)**",
              "ผลคือ **well-oxygenated blood จาก placenta เข้าหัวใจซีกซ้ายเป็นหลัก ไม่ใช่ซีกขวา** แล้วถูก left ventricle ปั๊มไปเลี้ยง arteries of the head and forelimbs เป็นหลัก",
              "ส่วนเลือดที่เข้า right atrium จาก **superior vena cava** จะถูกส่งลงล่างผ่าน **tricuspid valve เข้าสู่ right ventricle**"
            ]
          },
          {
            "callout": "สไลด์หน้านี้มีรูป fetal circulation ที่ text เหลือเพียงคำกำกับ Ductus venosus ซ้ำหลายครั้ง ไม่มีข้อความอธิบายเพิ่มจากรูป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Fetal circulation ต่อ: เลือดจากซีกขวาไปที่ไหน",
        "source": "Neonatal Physiology p.6",
        "body": [
          {
            "text": "เลือดชุดนี้เป็น **deoxygenated blood จาก head region ของ fetus เป็นหลัก** ถูก right ventricle ปั๊มเข้า **pulmonary artery** แล้วผ่าน **ductus arteriosus เข้าสู่ descending aorta เป็นหลัก** จากนั้นผ่าน **umbilical arteries ทั้งสองเส้นกลับไปที่ placenta** ซึ่งเลือด deoxygenated จะกลายเป็น oxygenated"
          }
        ]
      },
      {
        "heading": "Changes in the Fetal Circulation at Birth",
        "source": "Neonatal Physiology p.6",
        "body": [
          {
            "sub": "First: เสีย placental blood flow",
            "body": [
              {
                "text": "การสูญเสีย blood flow มหาศาลผ่าน placenta ทำให้ **systemic vascular resistance เพิ่มขึ้นประมาณ 2 เท่า** ซึ่งไปเพิ่ม **aortic pressure รวมทั้ง pressure ใน left ventricle และ left atrium**"
              }
            ]
          },
          {
            "sub": "Second: pulmonary vascular resistance ลดลง",
            "body": [
              {
                "bullets": [
                  "**Pulmonary vascular resistance ลดลงมาก จากการขยายตัวของปอด** เพราะใน unexpanded fetal lungs หลอดเลือดถูกกดจากปริมาตรปอดที่เล็ก",
                  "ทันทีที่ปอดขยาย หลอดเลือดเหล่านี้ไม่ถูกกดอีก และ **resistance ลดลงหลายเท่า**",
                  "นอกจากนี้ใน fetal life **hypoxia ของปอดทำให้เกิด tonic vasoconstriction ของหลอดเลือดปอดอย่างมาก แต่จะเกิด vasodilation เมื่อ aeration ของปอดกำจัด hypoxia ออกไป**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ผลรวมของการเปลี่ยนแปลง และ Closure of the Foramen Ovale",
        "source": "Neonatal Physiology p.7",
        "body": [
          {
            "text": "การเปลี่ยนแปลงทั้งหมดรวมกันลด resistance ของการไหลผ่านปอด **ได้ถึง 5 เท่า** ซึ่งลด **pulmonary arterial pressure, right ventricular pressure และ right atrial pressure**"
          },
          {
            "sub": "กลไกการปิด",
            "body": [
              {
                "bullets": [
                  "**Right atrial pressure ที่ต่ำ ร่วมกับ left atrial pressure ที่สูง** (ผลตามมาจากการเปลี่ยนแปลงของ pulmonary และ systemic resistance) ทำให้เลือดไหล **ย้อนกลับผ่าน foramen ovale คือจาก left atrium ไป right atrium** ตรงข้ามกับทิศทางใน fetal life",
                  "ผลคือ **valve เล็ก ๆ ที่คลุม foramen ovale อยู่ทางด้านซ้ายของ atrial septum ปิดลงบนรูนี้** จึงกันไม่ให้มีการไหลผ่าน foramen ovale ต่อไป"
                ]
              }
            ]
          },
          {
            "sub": "ระยะเวลาและกรณีที่ไม่ปิดถาวร",
            "body": [
              {
                "bullets": [
                  "ใน **two thirds ของคนทั้งหมด** valve จะ adherent คลุม foramen ovale ภายใน **a few months ถึง a few years และกลายเป็น permanent closure**",
                  "แม้ไม่เกิด permanent closure **left atrial pressure ตลอดชีวิตปกติจะสูงกว่า right atrial pressure อยู่ 2 ถึง 4 mm Hg** และ backpressure นี้ทำให้ valve ปิดอยู่"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Closure of the Ductus Arteriosus",
        "source": "Neonatal Physiology p.8",
        "body": [
          {
            "text": "สไลด์เน้นว่า **ductus arteriosus ก็ปิดเช่นกัน แต่ด้วยเหตุผลที่ต่างออกไป (for different reasons)**"
          },
          {
            "bullets": [
              "**First:** systemic resistance ที่เพิ่มขึ้นทำให้ aortic pressure สูงขึ้น ขณะที่ pulmonary resistance ที่ลดลงทำให้ pulmonary arterial pressure ต่ำลง",
              "ดังนั้นหลังคลอด **เลือดเริ่มไหลย้อนจาก aorta เข้า pulmonary artery ผ่าน ductus arteriosus** ตรงข้ามกับทิศทางใน fetal life",
              "หลังจากนั้นเพียง **a few hours ผนังกล้ามเนื้อของ ductus arteriosus หดตัวอย่างมาก และภายใน 1 ถึง 8 วัน การหดตัวมักเพียงพอที่จะหยุด blood flow ทั้งหมด**",
              "ในช่วง **1 ถึง 4 เดือนถัดมา ductus arteriosus จะถูกปิดในเชิงกายวิภาค (anatomically occluded) ด้วยการเจริญของ fibrous tissue เข้าไปใน lumen**",
              "**สาเหตุของการปิด ductus arteriosus สัมพันธ์กับ oxygenation ของเลือดที่ไหลผ่าน ductus ที่เพิ่มขึ้น**"
            ]
          }
        ]
      },
      {
        "heading": "ตัวเลข pO2 ที่อธิบายการปิด ductus arteriosus",
        "source": "Neonatal Physiology p.9",
        "body": [
          {
            "bullets": [
              "ใน fetal life **pO2 ของเลือดใน ductus อยู่เพียง 15 ถึง 20 mm Hg แต่เพิ่มเป็นประมาณ 100 mm Hg ภายในไม่กี่ชั่วโมงหลังคลอด**",
              "สไลด์ระบุว่ามีการทดลองจำนวนมากแสดงว่า **degree of contraction ของ smooth muscle ที่ผนัง ductus สัมพันธ์อย่างมากกับ availability of oxygen นี้**"
            ]
          }
        ]
      },
      {
        "heading": "Patent Ductus Arteriosus",
        "source": "Neonatal Physiology p.9",
        "body": [
          {
            "bullets": [
              "สไลด์ระบุอุบัติการณ์ว่า **ประมาณ 1 ใน 5,500 ราย ductus ไม่ปิด ทำให้เกิดภาวะ patent ductus arteriosus**",
              "ในช่วง **early months ของชีวิต patent ductus มักยังไม่ทำให้การทำงานผิดปกติรุนแรง**",
              "แต่เมื่อโตขึ้น **ความต่างระหว่าง pressure สูงใน aorta กับ pressure ต่ำกว่าใน pulmonary artery จะเพิ่มขึ้นเรื่อย ๆ** พร้อมกับ backward flow จาก aorta เข้า pulmonary artery ที่เพิ่มตาม",
              "นอกจากนี้ **aortic blood pressure ที่สูงมักทำให้เส้นผ่านศูนย์กลางของ ductus ที่เปิดอยู่บางส่วนกว้างขึ้นตามเวลา ทำให้ภาวะแย่ลงอีก**"
            ]
          },
          {
            "callout": "สไลด์ถัดมาในหน้าเดียวกันเป็นสไลด์รูป patent ductus arteriosus พร้อม URL อ้างอิงเท่านั้น ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Recirculation Through the Lungs และผลหลักของ patent ductus arteriosus",
        "source": "Neonatal Physiology p.10",
        "body": [
          {
            "sub": "Recirculation",
            "body": [
              {
                "text": "ในเด็กโตที่มี patent ductus **หนึ่งในสองถึงสองในสามของ aortic blood flow ไหลย้อนผ่าน ductus เข้า pulmonary artery แล้วผ่านปอด กลับเข้า left ventricle และ aorta** ทำให้เลือดผ่านปอดและหัวใจซีกซ้าย **สองรอบหรือมากกว่า ต่อการผ่าน systemic circulation หนึ่งรอบ**"
              }
            ]
          },
          {
            "sub": "The major effects",
            "body": [
              {
                "bullets": [
                  "ระหว่างออกกำลังกาย **net blood flow ไปยังส่วนที่เหลือของร่างกายไม่สามารถเพิ่มถึงระดับที่ strenuous activity ต้องการได้เลย** แม้ออกกำลังหนักปานกลาง ผู้ป่วยก็มักอ่อนแรงและอาจเป็นลมจาก momentary heart failure",
                  "**Pressure ที่สูงใน pulmonary vessels จาก excess flow ผ่านปอด มักนำไปสู่ pulmonary congestion และ pulmonary edema**",
                  "จาก excessive load ต่อหัวใจ และโดยเฉพาะเพราะ pulmonary congestion รุนแรงขึ้นตามอายุ **ผู้ป่วย uncorrected patent ductus ส่วนใหญ่เสียชีวิตจาก heart disease ระหว่างอายุ 20 ถึง 40 ปี**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Closure of the Ductus Venosus",
        "source": "Neonatal Physiology p.10",
        "body": [
          {
            "text": "ทันทีหลังคลอด **blood flow ผ่าน umbilical vein หยุดลง แต่ portal blood ส่วนใหญ่ยังไหลผ่าน ductus venosus อยู่ โดยมีเพียงส่วนน้อยที่ผ่าน channels ของ liver**"
          }
        ]
      },
      {
        "heading": "Closure of the Ductus Venosus (ต่อ) และสิ่งที่สไลด์บอกว่ายังไม่รู้",
        "source": "Neonatal Physiology p.11",
        "body": [
          {
            "bullets": [
              "อย่างไรก็ตาม **ภายใน 1 ถึง 3 ชั่วโมง ผนังกล้ามเนื้อของ ductus venosus หดตัวอย่างแรงและปิดทางไหลนี้**",
              "**ductus venosus แทบไม่เคยล้มเหลวที่จะปิด**"
            ]
          },
          {
            "callout": "สไลด์บอกตรง ๆ ว่า we know almost nothing about what causes the closure ของ ductus venosus ดังนั้นกลไกการปิด สไลด์ไม่ได้บอก ต่างจาก ductus arteriosus ที่ผูกกับ oxygen ชัดเจน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สรุปเทียบ 3 shunt ตามตัวเลขที่สไลด์ให้",
        "source": "Neonatal Physiology p.7–p.11 (foramen ovale p.7 · ductus arteriosus p.8–p.9 · ductus venosus p.11)",
        "body": [
          {
            "text": "จุดที่ออกสอบง่ายที่สุดคือกรอบเวลาและกลไกของแต่ละ shunt ซึ่งสไลด์ให้ไว้ครบทั้งสาม"
          },
          {
            "bullets": [
              "**Foramen ovale** ปิดด้วยความต่างของ atrial pressure (left สูงกว่า right) valve ปิดทันที และ adherent ถาวรใน two thirds ของคนภายใน a few months ถึง a few years โดยมี pressure gradient 2 ถึง 4 mm Hg ค้ำไว้ตลอดชีวิต (p.7)",
              "**Ductus arteriosus** กล้ามเนื้อหดภายใน a few hours หยุดเลือดภายใน 1 ถึง 8 วัน และปิดเชิงกายวิภาคด้วย fibrous tissue ใน 1 ถึง 4 เดือน กลไกผูกกับ oxygen โดย pO2 ไป 15 ถึง 20 เป็น 100 mm Hg (p.8, p.9)",
              "**Ductus venosus** กล้ามเนื้อหดตัวปิดภายใน 1 ถึง 3 ชั่วโมง แต่กลไกที่ทำให้ปิด สไลด์ไม่ได้บอก (p.11)"
            ]
          },
          {
            "callout": "หัวข้อนี้เป็นการรวบข้อมูลจากสไลด์ p.7 ถึง p.11 มาวางเทียบกัน ไม่มีตัวเลขใดที่เพิ่มเข้ามาเองนอกเหนือจากที่เด็คเขียนไว้",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "physio-3--physiology-of-aging": {
    "topic": "physio-3--physiology-of-aging",
    "title": "Physiology of Aging",
    "icon": "📘",
    "lecturer": "Chutamas Benjanirut",
    "summary": "เด็ค 12 หน้า แบ่งเป็น 2 ส่วนใหญ่ ส่วนแรก (p.2-p.9) เป็นการเปลี่ยนแปลงตามอายุของ cardiovascular system (vascular, cardiac, conductive system, blood pressure, baroreceptor) และ respiratory system (chest wall, airway, lung volume) โดยใช้ตัวเลขอ้างอิงจากคน ส่วนที่สอง (p.9-p.11) เป็นตารางเทียบอายุแมวและสุนัขกับคน แยกตามขนาดสายพันธุ์ พร้อม life span สไลด์หลายแผ่นเป็นรูปประกอบและรายชื่อสายพันธุ์ที่ไม่มีเนื้อความ และหน้าสุดท้าย (p.12) มีแค่คำว่า Question ไม่มีเนื้อหา อนึ่ง เนื้อหาสรีรวิทยาทั้งหมดในเด็คนี้พูดถึงมนุษย์ ไม่ได้เทียบกับสัตว์",
    "sections": [
      {
        "heading": "Aging คืออะไร และอะไรทำให้คนอายุเท่ากันต่างกัน",
        "source": "Physiology of Aging p.2",
        "body": [
          {
            "text": "สไลด์นิยามว่า **Aging เป็นส่วนหนึ่งตามปกติของชีวิต ไม่ใช่โรค (normal part of life not disease)** และย้ำว่าคน 2 คนที่อายุเท่ากันอาจต่างกันอย่างมากทั้งรูปลักษณ์ภายนอกและสรีรวิทยา"
          },
          {
            "bullets": [
              "**genetic factors**",
              "**environmental factors** ได้แก่ diet, exercise, exposure to microorganisms, pollutants และ radiation",
              "**Gender** ในประเทศพัฒนาแล้วส่วนใหญ่ ผู้หญิงมีอายุยืนกว่าผู้ชายประมาณ 7-10 ปี"
            ]
          },
          {
            "text": "ขอบเขตที่เด็คนี้จะพูดถึงมี 2 ระบบ คือ **Cardiovascular system** และ **Respiratory system** โดยฝั่ง cardiovascular แบ่งเป็น vascular change (tunica media, endothelium), cardiac change (cardiac muscle, conductive system) และ blood pressure change"
          }
        ]
      },
      {
        "heading": "Vascular changes: หลอดเลือดแข็งขึ้น ความต้านทานเพิ่มขึ้น",
        "source": "Physiology of Aging p.3",
        "body": [
          {
            "text": "ในคนอายุน้อย arteries มีลักษณะ elastic, flexible และ compliant ระหว่าง ventricular systole เลือดถูกฉีดออกไปยัง pulmonary และ systemic circuits แล้ว **arteries ยืดออกเพื่อลดความต้านทานต่อการไหลของเลือด** เมื่ออายุมากขึ้น หลอดเลือดโดยเฉพาะ arteries สูญเสีย elasticity และ compliant น้อยลง ทำให้ **ความต้านทาน (resistance) เพิ่มขึ้น**"
          },
          {
            "sub": "The tunica media",
            "body": [
              {
                "text": "เป็นชั้นของ smooth muscle ที่เชื่อมและอยู่ภายใต้อิทธิพลของ vasomotor center ใน medulla oblongata ที่ brain stem"
              },
              {
                "bullets": [
                  "**หนาตัวขึ้นทีละน้อย (gradual thickening)** ร่วมกับจำนวนและความหนาแน่นของ collagen fibers ที่เพิ่มขึ้น ทำให้ artery แข็ง (rigid) ขึ้นและ compliant น้อยลง",
                  "หลอดเลือดยังมี **fracturing ของ elastic (elastin) components** และมักพบ calcification ในระดับที่ต่างกันไป"
                ]
              }
            ]
          },
          {
            "sub": "The endothelium",
            "body": [
              {
                "text": "endothelium คือชั้นในสุดของหลอดเลือด ประกอบด้วย squamous epithelial cells ชั้นเดียว ในเด็กและผู้ใหญ่วัยหนุ่มสาวเซลล์เหล่านี้เรียงตัวสม่ำเสมอและเรียบ จึงให้ความต้านทานต่อการไหลของเลือดน้อยที่สุด"
              },
              {
                "text": "เมื่ออายุมากขึ้น endothelial layer เริ่มมีเซลล์รูปร่างไม่สม่ำเสมอ และมักหนาขึ้นจาก **smooth muscle fibers ที่ migrate มาจาก tunica media**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Cardiac changes: หัวใจต้องบีบแรงขึ้น จึง hypertrophy",
        "source": "Physiology of Aging p.3-4",
        "body": [
          {
            "text": "เพื่อเอาชนะ arterial compliance ที่ลดลงและ peripheral resistance ที่เพิ่มขึ้น **ventricles ต้องบีบด้วยแรงที่มากขึ้น** และ myocardium ก็ตอบสนองเหมือนกล้ามเนื้ออื่นที่เจอ load เพิ่ม คือ **enlargement และ hypertrophy** (p.3)"
          },
          {
            "bullets": [
              "**left ventricle หนาขึ้นประมาณ 30% ระหว่างอายุ 20 ถึง 80 ปี** และน้ำหนักหัวใจค่อย ๆ เพิ่มขึ้น",
              "**จำนวน cardiac myocytes ลดลงอย่างต่อเนื่อง** ส่วนเซลล์ที่เหลือมักมีขนาดใหญ่ขึ้น และ myocardium มีระดับ collagen เพิ่มขึ้น"
            ]
          }
        ]
      },
      {
        "heading": "Functional cardiac changes และ conductive system",
        "source": "Physiology of Aging p.4",
        "body": [
          {
            "text": "การเปลี่ยนแปลงเชิงหน้าที่ที่สไลด์เน้นคือ **maximal heart rate ที่ทำได้ขณะออกกำลังกายลดลง**"
          },
          {
            "bullets": [
              "ในเด็กที่แข็งแรง maximal heart rate ประมาณ **220 bpm** หลังออกกำลังกายหนักถือว่าปกติ",
              "เมื่ออายุมากขึ้น ค่านี้ลดลงคร่าว ๆ ตามสูตร **220 ลบด้วยอายุเป็นปี** ดังนั้นที่อายุ 60 ปีจะอยู่ราว **160 bpm**",
              "เชื่อว่าการลดลงนี้เกิดจากการเปลี่ยนแปลงของ conductive system ของหัวใจเป็นหลัก"
            ]
          },
          {
            "sub": "The cardiac conductive system",
            "body": [
              {
                "bullets": [
                  "**sinoatrial node สูญเสีย pacemaker cells ไป 50-75% จาก apoptosis เมื่ออายุ 50 ปี**",
                  "จำนวนเซลล์ใน **atrioventricular node ค่อนข้างคงที่** แต่มี fibrosis และการตายของเซลล์ใน **atrioventricular bundle (bundle of His)**"
                ]
              },
              {
                "text": "การเปลี่ยนแปลงของ conductive tissues เหล่านี้อาจลดประสิทธิภาพการนำไฟฟ้าของหัวใจ และมีส่วนทำให้ **maximal heart rate ลดลง** และ **arrhythmias เพิ่มขึ้น** ตามอายุ"
              }
            ]
          }
        ]
      },
      {
        "heading": "Changes in blood pressure",
        "source": "Physiology of Aging p.5",
        "body": [
          {
            "bullets": [
              "**Systolic blood pressure ค่อย ๆ เพิ่มขึ้นตามอายุ** ค่าเฉลี่ยในเพศชายประมาณ 126 mmHg ที่อายุ 25 ปี และ 140 mmHg ที่อายุ 60 ปี",
              "สะท้อนการลดลงของ elasticity และ lumen diameter ภายใน arteries ร่วมกับ hypertrophy ของ left ventricle",
              "small arteries และ arterioles **ตอบสนองต่อ vasodilator cues ได้น้อยลง** ตามอายุ ยิ่งเพิ่ม peripheral resistance",
              "**ถ้าไม่มีพยาธิสภาพ diastolic pressure เปลี่ยนแปลงน้อยมากตามอายุ**"
            ]
          },
          {
            "callout": "อายุมากขึ้นแล้ว systolic ขึ้น แต่ diastolic แทบไม่เปลี่ยน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Baroreceptor function และ postural hypotension",
        "source": "Physiology of Aging p.5",
        "body": [
          {
            "text": "เมื่อเปลี่ยนท่าทาง เช่น จากนั่งเป็นยืน เลือดจะไหลลงสู่ lower extremities และความดันเลือดตก"
          },
          {
            "bullets": [
              "hypotension นี้ถูกตรวจจับทันทีโดย **baroreceptors ที่ aortic arch และ carotid sinus**",
              "ข้อมูลถูกส่งต่อไปยัง **cardiac center และ vasomotor center ใน medulla oblongata**",
              "cardiac center ตอบสนองโดย **เพิ่ม heart rate** ส่วน vasomotor center สั่ง **vasoconstriction** ทำให้ความดันกลับสู่ปกติ เลือดไปเลี้ยงสมองเพียงพอ และป้องกัน postural hypotension กับ syncope"
            ]
          },
          {
            "sub": "ในผู้สูงอายุ",
            "body": [
              {
                "text": "**baroreceptor reflexes ทำงานมีประสิทธิภาพน้อยลง** เพราะผนังหลอดเลือดที่หนาตัวขึ้นรบกวนความสามารถในการวัดระดับการยืด (stretch) ของหลอดเลือดอย่างแม่นยำ จึงนำไปสู่ postural hypotension และเป็นลมได้"
              },
              {
                "text": "สไลด์ระบุว่า **postural hypotension พบใน 30-50% ของคนอายุมากกว่า 75 ปี**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Aging respiratory system: changes of the chest wall",
        "source": "Physiology of Aging p.6",
        "body": [
          {
            "text": "ฝั่ง respiratory สไลด์แบ่งเป็น chest wall changes (rib, muscle), airway changes (cilia, sensory receptor) และ lung volume changes (residual volume, vital capacity)"
          },
          {
            "sub": "rib",
            "body": [
              {
                "bullets": [
                  "ในวัยต้นของชีวิต chest wall ค่อนข้างอ่อนตัวและยืดหยุ่น",
                  "เมื่ออายุมากขึ้นมี **rib calcification เพิ่มขึ้นทีละน้อย** โดยเฉพาะบริเวณ anterior cartilaginous (costal) ใกล้ sternum และพบน้อยกว่าที่บริเวณซี่โครงต่อกับ vertebral column",
                  "ผลคือ **chest wall แข็ง (rigid) ขึ้นเรื่อย ๆ**"
                ]
              }
            ]
          },
          {
            "sub": "muscle",
            "body": [
              {
                "text": "การสูญเสีย muscle mass (motor units) ใน **diaphragm และ intercostal** ทำให้ **แรงของ respiratory muscles ลดลงตามอายุ** การหายใจจึงอาจเหนื่อยหนัก (labored) ขึ้น และเห็นชัดเป็นพิเศษในคนที่ใช้ชีวิตแบบ sedentary เพราะทราบกันว่าทำให้กล้ามเนื้อลีบและอ่อนแรง"
              }
            ]
          }
        ]
      },
      {
        "heading": "Airway changes: ciliary escalator และ cough reflex",
        "source": "Physiology of Aging p.7",
        "body": [
          {
            "sub": "ciliary escalator ปกติทำงานอย่างไร",
            "body": [
              {
                "bullets": [
                  "สร้าง mucus เคลือบผิวด้านในของ bronchial tree และดักจับอนุภาคที่สูดเข้าไป เช่น ฝุ่นและแบคทีเรีย",
                  "**Ciliated cells พา mucus ที่ปนเปื้อนขึ้นออกจากปอด** เมื่อถึง pharynx จะถูกกลืนลงไปสู่สภาพแวดล้อมที่เป็นกรดและฆ่าเชื้อในกระเพาะอาหาร"
                ]
              }
            ]
          },
          {
            "sub": "เมื่ออายุมากขึ้น",
            "body": [
              {
                "bullets": [
                  "**ความถี่ของการโบกของ cilia ลดลง** ทำให้ ciliary escalator ช้าลง",
                  "**จำนวน cilia ลดลง**"
                ]
              },
              {
                "text": "ผลรวมคือ **การกำจัด pathogens และ debris ออกจากปอดลดลง เพิ่มโอกาสติดเชื้อ**"
              }
            ]
          },
          {
            "sub": "sensory receptor และ coughing reflex",
            "body": [
              {
                "text": "ในคนอายุน้อย airways ไวต่อ mechanical stimulation อย่างมาก เศษวัสดุที่สูดเข้าไปมักกระตุ้น **coughing reflex** ที่รุนแรงเพื่อขับออก"
              },
              {
                "text": "แต่ **sensory receptors ที่คอยตรวจ airways ดูจะไวน้อยลงตามอายุ** จึงอาจไม่เกิด coughing reflex ตอบสนองต่อสิ่งที่สูดเข้าไปในผู้สูงอายุ เพิ่มโอกาสที่ pathogens และสารระคายเคืองจะลงไปถึงเนื้อปอดส่วนลึกและทำให้เกิด respiratory tract infections"
              }
            ]
          }
        ]
      },
      {
        "heading": "ปอดสูญเสีย elasticity และ lung volume ที่เปลี่ยนไป",
        "source": "Physiology of Aging p.8",
        "body": [
          {
            "text": "แม้ **ปริมาณ elastin และ collagen fibers ในปอดจะค่อนข้างคงที่** แต่ปอดค่อย ๆ สูญเสีย elasticity และ distensible (ขยายตัว) มากขึ้น เชื่อว่าเกิดจากการเปลี่ยนคุณสมบัติของ collagen และ elastin fibers ที่เกิด **cross-linked** ทำให้ recoil ของเนื้อปอดลดลงเรื่อย ๆ"
          },
          {
            "sub": "Residual volume (RV)",
            "body": [
              {
                "bullets": [
                  "RV คืออากาศที่เหลือในปอดหลังหายใจออกเต็มที่และแรงที่สุด",
                  "ปกติประมาณ **1.2 L ที่อายุ 25 ปี** และค่อย ๆ เพิ่มขึ้นตามอายุจากการสูญเสีย lung elasticity",
                  "ปอดที่ยืดหยุ่นน้อยลงจะ distensible มากขึ้นและ recoil ตอนหายใจออกลดลง เกิด **air trapping**",
                  "คนอายุ 70 ปีโดยทั่วไป RV เพิ่มเป็นราว **1.8 L**"
                ]
              }
            ]
          },
          {
            "sub": "Vital capacity (VC)",
            "body": [
              {
                "bullets": [
                  "VC คือปริมาตรอากาศทั้งหมดที่หายใจออกได้หลังหายใจเข้าเต็มที่",
                  "เพศชายเฉลี่ยอายุ 25 ปีประมาณ **5 L** ลดลงเหลือราว **3.9 L ที่อายุ 65 ปี**",
                  "เพศหญิงลดลงในลักษณะคล้ายกัน จากเฉลี่ยราว **3.5 L ที่อายุ 25 ปี** เหลือราว **2.8 L ที่อายุ 65 ปี**",
                  "สาเหตุหลักคือ **chest wall rigidity ที่เพิ่มขึ้นและแรงของ respiratory muscles ที่ลดลง** ตามที่กล่าวไว้ก่อนหน้า"
                ]
              }
            ]
          },
          {
            "callout": "จำทิศทางให้แม่น RV เพิ่มขึ้น (air trapping) ส่วน VC ลดลง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "บทสรุปฝั่ง respiratory",
        "source": "Physiology of Aging p.9",
        "body": [
          {
            "text": "สไลด์ปิดท้ายส่วน respiratory ว่า **ในกรณีที่ไม่มีพยาธิสภาพ respiratory system ยังคงสามารถรักษา gas exchange ให้เพียงพอและทำหน้าที่อื่น ๆ ได้ตลอดชีวิต**"
          }
        ]
      },
      {
        "heading": "Cats and People: การเทียบอายุแมวกับคน",
        "source": "Physiology of Aging p.9",
        "body": [
          {
            "bullets": [
              "**แมวอายุ 1 ปี เทียบเท่าคนอายุประมาณ 15 ปี**",
              "**เมื่อแมวอายุ 2 ปี เทียบเท่าคนอายุ 24 ปี**",
              "หลังจากนั้น **ปีละประมาณ 4 human years** ดังนั้นแมวอายุ 9 ปีเทียบเท่าคนอายุประมาณ 52 ปี ตามการคำนวณในสไลด์ 24 + (7 x 4) = 52"
            ]
          },
          {
            "sub": "Cats life span",
            "body": [
              {
                "bullets": [
                  "อีกปัจจัยที่มีผลต่อ life span คือ **แมวเลี้ยงในบ้านหรือนอกบ้าน**",
                  "**แมวในบ้านที่ทำหมันแล้วอายุ 16 ปี เทียบเท่าทางสรีรวิทยากับแมวนอกบ้านที่ไม่ทำหมันอายุ 8 ปี**",
                  "แมวส่วนใหญ่เมื่ออายุถึง **7 ปี ถือว่าเข้าสู่ senior years**",
                  "สถิติแมวที่อายุยืนที่สุดคือ **36 ปี**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dogs and People: เทียบอายุตามขนาดสายพันธุ์",
        "source": "Physiology of Aging p.10-11",
        "body": [
          {
            "sub": "Small (20 LB หรือน้อยกว่า) และ Medium (21-50 LB)",
            "body": [
              {
                "bullets": [
                  "อายุ 1 ปี เทียบเท่าคนประมาณ 15 ปี และเมื่ออายุ 2 ปี เทียบเท่าคน 24 ปี",
                  "หลังจากนั้น **ปีละประมาณ 4 human years** ดังนั้นสุนัข small หรือ medium อายุ 9 ปี เทียบเท่าคนอายุ 52 ปี ตามสไลด์ 24 + (7 x 4) = 52",
                  "ตัวอย่าง small size breeds ที่สไลด์ยกมา Maltese, Yorkshire Terrier, Shih Tzu, Pomeranian, Chihuahua, Pug",
                  "ตัวอย่าง medium size breeds Bulldog, Bull Terrier, Shar-Pei, Border Collie"
                ]
              }
            ]
          },
          {
            "sub": "Large (มากกว่า 50 LB)",
            "body": [
              {
                "bullets": [
                  "อายุ 1 ปี เทียบเท่าคนประมาณ 15 ปี และเมื่ออายุ 2 ปี เทียบเท่าคน 24 ปี",
                  "หลังจากนั้น **ปีละประมาณ 6 human years** ดังนั้นสุนัข large breed อายุ 9 ปี เทียบเท่าคนอายุ 66 ปี ตามสไลด์ 24 + (7 x 6) = 66",
                  "ตัวอย่าง large size breeds German Shepherd, Bernese Mountain, Rottweiler, Golden Retriever"
                ]
              }
            ]
          },
          {
            "sub": "Giant breed",
            "body": [
              {
                "bullets": [
                  "**Giant breed แก่ช้ากว่าในช่วงแรก แล้วแก่เร็วขึ้นภายหลัง** ที่อายุ 1 ปี เทียบเท่าทางสรีรวิทยากับเด็กอายุประมาณ 12 ปี",
                  "หลังจากนั้น **ปีละประมาณ 8 human years** สไลด์เขียนว่าสุนัขอายุ 9 ปีเทียบเท่าคนอายุ 76 ปี ตามการคำนวณ 12 + (8 x 8) = 76",
                  "ตัวอย่าง giant size breeds Mastiff, Saint Bernard, Great Dane"
                ]
              },
              {
                "callout": "ระวังจุดที่สไลด์เขียนไม่ตรงกันเอง ประโยคของ giant breed เขียนว่า Large and giant breed dogs ได้ 76 ปี ทั้งที่สไลด์ก่อนหน้าให้ large breed อายุ 9 ปี เท่ากับ 66 ปี สไลด์ไม่ได้อธิบายว่าอันไหนถูก",
                "kind": "warn"
              }
            ]
          },
          {
            "sub": "Dogs life span",
            "body": [
              {
                "bullets": [
                  "**อายุขัยเฉลี่ยของสุนัขประมาณ 12 ปี** แต่แตกต่างกันไปตามสายพันธุ์",
                  "สุนัขส่วนใหญ่เมื่ออายุถึง **7 ปี ถือว่าเข้าสู่ senior years**",
                  "สำหรับ **giant breed ถือว่า 5 ปีเป็นจุดเริ่มต้นของวัยชรา**",
                  "สถิติสุนัขที่อายุยืนที่สุดคือ **29 ปี**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "physio-3--undergrad-reproductive-2023-female-repro": {
    "topic": "physio-3--undergrad-reproductive-2023-female-repro",
    "title": "Physiology of Female Reproductive System (ระบบสืบพันธุ์เพศเมีย)",
    "icon": "📘",
    "lecturer": "Sutthasinee Poonyachoti, DVM, MS, PhD",
    "summary": "เด็ค 63 หน้า ครอบคลุมสรีรวิทยาระบบสืบพันธุ์เพศเมียตั้งแต่ functional anatomy ของ ovary และ duct system, oogenesis กับ folliculogenesis, กระบวนการและกลไกของ ovulation, การควบคุมและการสลายของ corpus luteum, จนถึง estrous cycle และการตรวจการเป็นสัดรายชนิดสัตว์ พร้อมเวลาผสมที่เหมาะสม จุดที่ต้องรู้ล่วงหน้าคือเด็คนี้มีสไลด์รูปล้วนหรือมีแต่หัวข้ออยู่มาก (เช่น หน้า 6, 7, 9, 13, 17, 24, 26, 30, 31, 33, 34, 38, 40, 41, 45, 48, 49, 50, 53, 55, 57, 61, 63) และมีหน้าที่เป็นแผนภาพเติมช่องว่าง (หน้า 22) กับคำถามแบบเลือกตอบที่ไม่ได้เฉลย 2 ข้อ (หน้า 28 และ 60) โน้ตนี้จึงเขียนเฉพาะสิ่งที่สไลด์เขียนไว้จริง และระบุตรงจุดที่สไลด์ไม่ได้บอก",
    "sections": [
      {
        "heading": "ขอบเขตของเลกเชอร์ (Learning objectives)",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.2",
        "body": [
          {
            "bullets": [
              "บทนำของระบบสืบพันธุ์เพศเมีย ได้แก่ ลักษณะกายวิภาค จุลกายวิภาค และการทำหน้าที่ (functional anatomy)",
              "กลไกและการควบคุมของ gametogenesis เพศเมีย คือ oogenesis และ folliculogenesis",
              "กลไกและการควบคุมกระบวนการตกไข่ (ovulation)",
              "ความสำคัญ การควบคุม และการสลายของ corpus luteum",
              "วงจรการเป็นสัด (estrus cycle) และการควบคุมด้วยฮอร์โมนในสัตว์เลี้ยงชนิดต่างๆ รวมถึง **การประเมินช่วงเวลาตกไข่ว่าตรงกับช่วงใดหลังจากยืนนิ่ง** และการประเมินช่วงเวลาที่เหมาะสมของการผสมพันธุ์"
            ]
          }
        ]
      },
      {
        "heading": "หน้าที่ของ ovary",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.3",
        "body": [
          {
            "text": "สไลด์แบ่งหน้าที่ของ ovary เป็น 3 ข้อ"
          },
          {
            "bullets": [
              "**Produce the gametes**",
              "Produce female sex hormones จาก follicular cells โดยสไลด์เขียนว่า **granulosa cells สร้าง estrogens** และ **theca cells สร้าง progesterone**",
              "Maintain pregnancy โดย **corpus luteum สร้าง progesterone**"
            ]
          },
          {
            "callout": "หน้านี้จับคู่ theca cells กับ progesterone ไว้ตรงตัว ขณะที่หน้า 19 และ 20 พูดถึง two-cell two-gonadotropin theory ของการสร้าง estrogen แต่เนื้อหาของทฤษฎีอยู่ในรูป ไม่ได้เขียนเป็นข้อความ ถ้าจะตอบตามเด็คนี้ให้ยึดถ้อยคำบนสไลด์และเช็คกับที่อาจารย์บรรยายในคาบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Female reproductive duct system",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.4",
        "body": [
          {
            "sub": "1. Fallopian tube",
            "body": [
              {
                "text": "เป็น **site of fertilization ที่ AIJ** ซึ่งสไลด์กางชื่อไว้ว่า Ampullo-ischemic-Junction โดย haploid sperm กับ egg รวมกันได้ diploid zygote"
              }
            ]
          },
          {
            "sub": "2. Uterine horn / Uterus",
            "body": [
              {
                "text": "เป็นที่พัฒนาของ embryo และ fetus และ **สร้าง prostaglandin เมื่อไม่ตั้งท้อง ซึ่งทำให้เกิด luteolysis**"
              }
            ]
          },
          {
            "sub": "3. Cervix",
            "body": [
              {
                "bullets": [
                  "ทำหน้าที่เป็น barrier โดยเลือกให้ sperm ผ่านเข้า uterus และ oviduct",
                  "**ปิดหรือถูกผนึกระหว่างตั้งท้อง**",
                  "ทำหน้าที่ expulsion of fetus"
                ]
              }
            ]
          },
          {
            "sub": "4. Vagina และ 5. Vulva",
            "body": [
              {
                "text": "Vagina เป็น female copulatory organ และเป็น birth canal ส่วน vulva เป็นทางเปิดของ female reproductive tract"
              }
            ]
          }
        ]
      },
      {
        "heading": "ชั้นของผนังมดลูก",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.5",
        "body": [
          {
            "bullets": [
              "**Perimetrium** ประกอบด้วย tunica serosa บุด้วย connective tissue fiber พร้อมเซลล์ของมัน และ mesothelium",
              "**Myometrium** ประกอบด้วย smooth muscle fiber ชั้น inner circular ที่หนาและ outer longitudinal และเป็นชั้นที่มีหลอดเลือดมาก",
              "**Endometrium** เป็นชั้นในสุด โดย functional zone เป็นชั้นบางบุด้วย simple columnar epithelium ที่ **หลุดลอกระหว่าง estrus cycle**"
            ]
          },
          {
            "text": "subepithelial tissue ของ endometrium มี lymphocytes, monocytes, plasma cells, fibroblasts และ connective tissue cell กับ fiber อื่นๆ และสไลด์ระบุว่า **พบ melanocytes ใน sheep**"
          },
          {
            "text": "ถัดจาก functional zone คือ basal zone และใน endometrium มี simple branched tubular gland จำนวนมาก ซึ่งบุด้วย pseudostratified columnar epithelium"
          }
        ]
      },
      {
        "heading": "Oogenesis กับ folliculogenesis เดินคู่กัน",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.8",
        "body": [
          {
            "text": "สไลด์วางสองกระบวนการเทียบกันคนละแกน คือ **oogenesis = nuclear maturation** และ **folliculogenesis = follicular cell maturation** โดยมี **pre-ovulatory LH surge** เป็นจุดเปลี่ยน และปลายทางฝั่ง oogenesis ที่สไลด์เขียนไว้คือ pronucleated ootid"
          },
          {
            "text": "รายละเอียดที่เหลือของหน้านี้อยู่ในรูป สไลด์ไม่ได้เขียนเป็นข้อความ"
          }
        ]
      },
      {
        "heading": "ลำดับ meiosis และช่วงที่พึ่งกับไม่พึ่ง GnRH",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.10",
        "body": [
          {
            "bullets": [
              "แผนภาพแบ่งช่วงเป็น **GnRH independent** ในช่วงต้น และ **GnRH dependent** ในช่วงหลัง",
              "**Meiotic arrest อยู่ที่ diplotene ของ prophase ใน meiosis I**",
              "ระดับ ploidy ที่สไลด์กำกับ คือ 2n ไปจนถึง metaphase I แล้วเป็น n ที่ metaphase II และ n หลัง meiosis II",
              "ลำดับ follicle ตามหน้านี้ คือ primordial follicle จากนั้น after birth เป็น 1° preantral, before puberty เป็น 2° และ 3° antral แล้วจึง preovulatory",
              "**Puberty + FSH ทำให้ estrogen เพิ่ม** แล้วได้ Graafian follicle ที่ ovulation"
            ]
          },
          {
            "sub": "สิ่งที่ FSH+LH surge ทำ ตามที่สไลด์ไล่เป็น 3 ข้อ",
            "body": [
              {
                "bullets": [
                  "Follicular growth",
                  "สไลด์เขียนไว้สั้นๆ ว่า \"No egg ovulate\" โดยไม่ได้ขยายความ",
                  "**Resume meiosis ได้ secondary oocyte กับ polar body 1 ใบ ที่ metaphase II แล้วจึงเกิด ovulation**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ลำดับขั้นของ oocyte และของ follicle",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.11",
        "body": [
          {
            "sub": "I. Oocyte development",
            "body": [
              {
                "text": "Germinal epithelium ไป oogonium ไป **primary oocyte** ไป **secondary oocyte** ไป pronucleate egg (ootid)"
              }
            ]
          },
          {
            "sub": "II. Follicle development",
            "body": [
              {
                "bullets": [
                  "Primary oocyte",
                  "Primodial follicle",
                  "**Primary follicle: granulosa cells ชั้นเดียว**",
                  "**Secondary follicle (preantral): granulosa cells หลายชั้น**",
                  "**Pre-tertiary (antral follicle): เกิด antrum**",
                  "Tertiary, Graffian follicle, preovulatory"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์กำกับตัวเลข **85 days** ไว้ในลำดับนี้ แต่ไม่ได้ระบุว่านับจากขั้นไหนถึงขั้นไหน สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "รายละเอียดของ follicle แต่ละขั้น",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.12",
        "body": [
          {
            "sub": "Primary oocyte และ primodial follicle",
            "body": [
              {
                "bullets": [
                  "Primary oocyte มีเฉพาะ granulosa (G-cells) precursor cells",
                  "Primodial follicle: เซลล์ถูกล้อมทีละใบด้วย pre-granulosa cells ที่เป็น flat cells"
                ]
              }
            ]
          },
          {
            "sub": "Primary follicle",
            "body": [
              {
                "bullets": [
                  "Follicular cells กลายเป็น stratified epithelium หรือ granulosa cells",
                  "**แยกจาก theca folliculi ด้วย basement membrane** (สไลด์ทำดาวเน้นไว้)",
                  "**Zona pellucida เป็นชั้น glycoprotein ที่หลั่งจาก granulosa cells และ oocyte**"
                ]
              }
            ]
          },
          {
            "sub": "Secondary follicle (preantral)",
            "body": [
              {
                "bullets": [
                  "**Stratum granulosum หนา 6-12 ชั้น จากการกระตุ้นของ FSH**",
                  "มี liquor folliculli ซึ่งเป็น hyaluronic acid"
                ]
              }
            ]
          },
          {
            "sub": "Early tertiary (antral follicle)",
            "body": [
              {
                "bullets": [
                  "**เป็นขั้นที่ยาวนานที่สุด**",
                  "**เกิด antrum** (สไลด์ทำดาวเน้นไว้)",
                  "Granulosa cells ที่ล้อม oocyte ยังอยู่ครบ และ oocyte อยู่เยื้องจากศูนย์กลาง",
                  "**Theca interna และ externa ชัดเจน จากการกระตุ้นของ LH และ inhibin**"
                ]
              }
            ]
          },
          {
            "sub": "Graffian follicle (preovulatory, dominant follicle)",
            "body": [
              {
                "bullets": [
                  "กินความกว้างทั้ง cortex จนนูนขึ้นที่ผิว ovary",
                  "Stratum granulosum ดูบางลง และมี antral cavity ใหญ่อันเดียว",
                  "Cumulus oophorus และ corona radiata เชื่อมกันหลวมๆ เพื่อตอบสนองต่อ LH",
                  "**เมื่อเกิด LH surge จะแบ่ง meiosis I เสร็จ คือ primary oocyte แบ่งเป็น secondary oocyte กับ polar body**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หน้ารูปแบบแผนของ GnRH และ estrogen ระหว่างชนิดสัตว์",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.14-15",
        "body": [
          {
            "text": "หน้า 14 หัวข้อคือ patterns of gonadotropin-releasing hormone (GnRH) secretion in domestic animals อ้างอิง Duittoz และคณะ (2016) Animal reproduction 13:313-333 ส่วนหน้า 15 มีคำเดียวคือ estrogen อ้างอิง Brown J.L., Theriogenology (2018)"
          },
          {
            "text": "ทั้งสองหน้าเป็นกราฟ **สไลด์ไม่ได้เขียนคำอธิบายเป็นข้อความ** ว่ารูปแบบของแต่ละชนิดสัตว์ต่างกันอย่างไร"
          }
        ]
      },
      {
        "heading": "ปัจจัยที่สไลด์ยกมาว่ามีผลต่อระบบสืบพันธุ์",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.16",
        "body": [
          {
            "bullets": [
              "Hormonal ได้แก่ GnRH, melatonin และ sex hormones",
              "Genetics",
              "Environment ได้แก่ light กับ dark cycle",
              "Nutritional ได้แก่ under-nutrition กับ over-weight"
            ]
          },
          {
            "text": "หน้านี้เป็นรายการปัจจัยล้วน ไม่มีหัวเรื่องและไม่มีคำอธิบายกลไกในสไลด์"
          }
        ]
      },
      {
        "heading": "Stage of follicle growth: 3 phases",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.18",
        "body": [
          {
            "bullets": [
              "ที่ puberty ซึ่งเป็นจุดเริ่มของ ovarian cycle มี **preantral follicle 15-20 ใบถูกกระตุ้นให้โตภายใต้อิทธิพลของ FSH**",
              "**มีเพียงใบเดียวที่โตเต็มที่ ที่เหลือกลายเป็น atretic**",
              "ก่อน ovulation เล็กน้อย vesicular follicle (Graffian follicle) เริ่มโตขึ้นเป็น mature follicle"
            ]
          },
          {
            "callout": "หัวข้อสไลด์บอกว่ามี 3 phases แต่ **สไลด์ไม่ได้ไล่ชื่อทั้งสาม phase เป็นข้อความ** เนื้อหาส่วนนั้นอยู่ในรูป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Two-cell two-gonadotropin theory",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.19-20",
        "body": [
          {
            "text": "หน้า 19 มีเพียงชื่อทฤษฎีและคำกำกับว่า **LH surge** อ้างอิง Berne and Levy Physiology ฉบับที่ 6 หน้า 20 ต่อเนื่องกัน หัวข้อคือ growth and maturation of a primary, secondary and tertiary follicle และ two cell mechanism endocrine regulation of follicular estrogen synthesis กำกับด้วย LH surge แล้ว ovulation อ้างอิง Fails A.D., Magee C., Anatomy and physiology of farm animals (2018)"
          },
          {
            "text": "**เนื้อหาของทฤษฎีทั้งหมดอยู่ในรูป สไลด์ไม่ได้เขียนขั้นตอนเป็นข้อความ** ต้องอ่านจากรูปในสไลด์จริงหรือที่จดในคาบ"
          }
        ]
      },
      {
        "heading": "Ovulation: นิยามและกระบวนการ 6 ขั้น",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.21",
        "body": [
          {
            "text": "นิยามตามสไลด์คือ การปล่อย mature oocyte จาก ovary เข้าสู่ fallopian tube โดยอาศัย **chemical, mechanical และ hormonal means**"
          },
          {
            "bullets": [
              "**LH binding to G-cells**",
              "Protein synthesis ได้แก่ histamine, lysosymes, proteolytic enzyme และอื่นๆ (สะกดตามสไลด์)",
              "หลั่ง liquor folliculi มากขึ้น ทำให้ follicle บวม",
              "**ผนัง follicle บางลง และมีการหดตัวของ smooth muscle**",
              "**Rupture of the follicle**",
              "ปล่อย oocyte พร้อม corona radiata เข้าสู่ peritoneal cavity"
            ]
          }
        ]
      },
      {
        "heading": "กลไกของ LH surge ต่อ ovulation (สไลด์เติมช่องว่าง)",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.22",
        "body": [
          {
            "text": "หน้านี้เป็นแผนภาพที่เว้นช่องให้เติม มีหัวข้อว่า what is the mechanism of LH surge on ovulation และมีเลขข้อ 1 ถึง 6 แต่คำที่ปรากฏจริงมีเพียง COX-2 (อยู่ที่ข้อ 2 และ 3), histamine, progesterone, TNF-α และปลายทางคือ ovulation"
          },
          {
            "callout": "**ลำดับกลไกเต็มของหน้านี้ สไลด์ไม่ได้เขียนไว้** ต้องเติมจากที่อาจารย์บรรยายในคาบ อย่าเดาเอง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "บทบาทของ LH surge ในกระบวนการ ovulation",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.23",
        "body": [
          {
            "bullets": [
              "**เพิ่มการสร้างและการหลั่ง PGF2alpha**",
              "เหนี่ยวนำ inflammatory process เพื่อช่วยให้เกิด ovulation ได้แก่ vascularization, hyperemia, activate proteolytic enzyme และ damage granulosa cell",
              "**ทำให้ meiosis I เสร็จสมบูรณ์ แล้วเข้าสู่ meiosis II ที่ metaphase II** (สไลด์ทำดาวเน้นไว้)",
              "**PGF2alpha ร่วมกับ oxytocin ทำให้ myometrium หดตัว**",
              "Estrogen ทำให้ fimbria และ cilia เคลื่อนไหว ช่วยการขนส่ง gamete"
            ]
          }
        ]
      },
      {
        "heading": "Spontaneous vs reflex ovulation",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.24",
        "body": [
          {
            "text": "หน้านี้เป็นภาพเปรียบเทียบ อ้างอิง Physiological Review 79:263 ข้อความที่เหลือมีเพียงหน่วยเวลาบนแกน คือ Weeks, Days/Weeks และ Months"
          },
          {
            "text": "**สไลด์ไม่ได้เขียนเป็นข้อความ** ว่าสัตว์ชนิดใดจัดอยู่กลุ่ม spontaneous หรือ reflex ovulation ต้องอ่านจากรูป"
          }
        ]
      },
      {
        "heading": "Induced ovulation ในกระต่าย",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.25",
        "body": [
          {
            "text": "หัวข้อคือ the physiology of induced ovulation in female rabbits คำเดียวที่ปรากฏในเนื้อสไลด์คือ **norepinephrine** ส่วนกลไกที่เหลือเป็นรูป สไลด์ไม่ได้เขียนไว้"
          }
        ]
      },
      {
        "heading": "การควบคุม corpus luteum ในสัตว์ที่ไม่ตั้งท้อง",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.27",
        "body": [
          {
            "bullets": [
              "เมื่อ **ไม่มีสัญญาณการตั้งท้อง** estrogens ทำให้มี **oxytocin receptor (OTR)** ปรากฏขึ้น แล้วเริ่มให้มดลูกสังเคราะห์ **PGF2α**",
              "**การสังเคราะห์ PGF2α ถูกกระตุ้นโดย oxytocin receptor (OTR)**"
            ]
          }
        ]
      },
      {
        "heading": "คำถามในสไลด์: ฮอร์โมนที่มีฤทธิ์ luteolytic",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.28",
        "body": [
          {
            "text": "โจทย์บนสไลด์คือ ฮอร์โมนข้อใดมีฤทธิ์เป็น luteolytic ในสัตว์เกือบทุก species"
          },
          {
            "bullets": [
              "ก. LH",
              "ข. Prolactin",
              "ค. Estrogen",
              "ง. Progesterone",
              "จ. prostaglandin F2α (PGF2α)"
            ]
          },
          {
            "callout": "**สไลด์ไม่ได้เฉลย** ข้อมูลที่เด็คให้ไว้เองสำหรับตัดสินคือ หน้า 4 (มดลูกที่ไม่ตั้งท้องสร้าง prostaglandin แล้วทำให้เกิด luteolysis) และหน้า 27 (ไม่มีสัญญาณตั้งท้องแล้วมดลูกสังเคราะห์ PGF2α)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Follicular wave ในโค",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.29",
        "body": [
          {
            "bullets": [
              "**มี FSH pulse ระหว่าง diestrus**",
              "สไลด์เขียนว่า follicular wave มักพบระหว่างตั้งท้อง เพื่อสร้าง atretic follicle แล้วได้ CL มากขึ้น จึงมี progesterone มากขึ้น"
            ]
          },
          {
            "callout": "บรรทัดที่สองบนสไลด์เขียนสั้นและตัดตอนมาก **สไลด์ไม่ได้อธิบายกลไกเพิ่ม** ว่า atretic follicle นำไปสู่ CL เพิ่มได้อย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ระยะเวลาการทำงานของ CL ระหว่างชนิดสัตว์",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.30",
        "body": [
          {
            "text": "หัวข้อคือ duration of luteal function across species ใช้ภาพชุดเดียวกับหน้า 24 อ้างอิง Physiological Review 79:263 ข้อความที่เหลือมีเพียง Weeks, Days/Weeks และ Months **ไม่มีตัวเลขรายชนิดสัตว์เป็นข้อความ**"
          }
        ]
      },
      {
        "heading": "การควบคุม corpus luteum ของ primate",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.31",
        "body": [
          {
            "text": "หัวข้อคือ control of the primate corpus luteum และวงเล็บกำกับไว้ว่า **(LH action)** ส่วนที่เหลือเป็นรูป สไลด์ไม่ได้เขียนรายละเอียด"
          }
        ]
      },
      {
        "heading": "Ovarian cycle แบ่งเป็นสองระยะ",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.32",
        "body": [
          {
            "text": "สไลด์แบ่งวงจรเป็น **1. follicular phase** และ **2. luteal phase** โดยมี **ovulation คั่นระหว่างสองระยะ**"
          }
        ]
      },
      {
        "heading": "Estrus และ estrous cycle คืออะไร",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.35",
        "body": [
          {
            "bullets": [
              "**Estrus** คือช่วง sexual excitement หรือ standing heat ที่ตัวเมียยอมรับตัวผู้และจะยืนนิ่งให้ผสม สไลด์เขียนกำกับว่า receptivity เท่ากับ estrus",
              "**Estrous cycle** คือวงจรสืบพันธุ์ของสัตว์เลี้ยง วัดจาก **จุดเริ่มของ estrus หนึ่งถึงจุดเริ่มของ estrus ถัดไป** โดยสไลด์ยกตัวอย่างไว้ที่ 21 วัน"
            ]
          }
        ]
      },
      {
        "heading": "Sexual receptivity กับฮอร์โมนรายชนิดสัตว์",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.36",
        "body": [
          {
            "bullets": [
              "**ตัวเมียยอมรับการผสมอย่างน้อย 24 ชั่วโมงก่อน ovulation**",
              "**การผสมเกิดขึ้นก่อน ovulation**",
              "ต้องมีเวลาให้เกิด **sperm capacitation อย่างน้อย 6-12 ชั่วโมง** และเกิด acrosomal reaction ใน female genital tract"
            ]
          },
          {
            "sub": "Specie differences ตามที่สไลด์เขียน",
            "body": [
              {
                "bullets": [
                  "Cow: สไลด์เขียน P4 นำหน้าแล้วตามด้วย standing heat",
                  "**Mare, Ewe, Sow: ↑E2 แล้ว standing heat**",
                  "**Cat: ↑E2 แล้ว standing heat**",
                  "**Dog: E2 ↑ เพื่อ prime ก่อน แล้ว ↑P4 จึง standing heat**",
                  "สไลด์วงเล็บไว้ว่า E2 ทำให้ตัวเมียน่าสนใจต่อตัวผู้ประมาณหนึ่งสัปดาห์"
                ]
              }
            ]
          },
          {
            "callout": "ในบรรทัดของ Cow ลูกศรที่กำกับ P4 หายไปจาก text layer จึงระบุไม่ได้ว่าเป็นขึ้นหรือลง หน้า 51 ก็เขียนแบบเดียวกันว่า Cow: P4 incidence of standing heat = Estrus start ให้ตรวจทิศทางลูกศรจากสไลด์ตัวจริง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Estrous cycle ควบคุมอะไร",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.37",
        "body": [
          {
            "text": "สไลด์นิยามว่า estrous cycle คือ dynamic hormonal cycle ที่ควบคุมการสืบพันธุ์ในสัตว์เลี้ยงลูกด้วยนมเพศเมีย โดยสัมพันธ์กับ 2 เรื่อง"
          },
          {
            "bullets": [
              "**Ovulation คือการปล่อย egg หรือ oocyte**",
              "**Implantation คือการเตรียมมดลูกสำหรับ fertilized embryo**"
            ]
          }
        ]
      },
      {
        "heading": "Estrus pattern อยู่ใต้การควบคุมของ GnRH neurons",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.38",
        "body": [
          {
            "text": "หัวข้อระบุว่า estrus pattern อยู่ภายใต้การควบคุมของ **GnRH neurons** อ้างอิง Brown J.L., Theriogenology (2018) ที่เหลือเป็นรูป สไลด์ไม่ได้เขียนคำอธิบาย"
          }
        ]
      },
      {
        "heading": "แสง melatonin และการเริ่มวงจร",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.39",
        "body": [
          {
            "bullets": [
              "**เมื่อชั่วโมงแสงต่อวันเพิ่มขึ้น melatonin ลดลง** ซึ่งกระตุ้น hypothalamus ของตัวเมียให้หลั่ง GnRH",
              "**GnRH กระตุ้นเซลล์ของ pituitary gland ให้หลั่ง FSH และ LH**",
              "จากนั้น follicle cells และ oocyte เติบโต ทำให้ E2 เพิ่ม แล้วนำไปสู่ estrous และ ovulation"
            ]
          }
        ]
      },
      {
        "heading": "สัตว์ที่ผสมพันธุ์ตามฤดูกาลและบทบาทของ kisspeptin",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.42",
        "body": [
          {
            "bullets": [
              "**Pineal ทำหน้าที่ synchronize กิจกรรมสืบพันธุ์ในสัตว์ที่ผสมพันธุ์ตามฤดูกาล**",
              "ระหว่าง **anestrus (long-day)** gonadal estrogen มีความเข้มข้นต่ำ เกิด negative feedback ที่ periventricular และ arcuate nuclei ทำให้ **ยับยั้งการหลั่ง kisspeptin** และ GnRH หลั่งน้อย",
              "ใน **short-day breeder** เมื่อ photoperiod ลดลง melatonin หลั่งเพิ่ม และ **เพิ่ม GnRH pulse โดยตรง** จึงกระตุ้นการพัฒนาของ gonad",
              "ระหว่าง breeding season estrogen negative feedback ลดลง ร่วมกับ kisspeptin เพิ่มความถี่ของ GnRH pulse ทำให้ follicle พัฒนาและ estrogen เพิ่ม จนเกิด **positive feedback ของ estrogen แล้วเกิด LH surge และ ovulation**"
            ]
          }
        ]
      },
      {
        "heading": "Estrous detection: พฤติกรรมรายชนิดสัตว์",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.43",
        "body": [
          {
            "bullets": [
              "**Cow**: พยายามขึ้นขี่ตัวอื่น, ถูกตัวอื่นขึ้นขี่, standing heat, กระวนกระวายและตื่นตัว",
              "**Mare**: ปัสสาวะบ่อย, winking ซึ่งคือการขยับของ clitoris, ยืนถ่างขา (straddling posture)",
              "**Ewe**: ใช้ teaser ram, สะบัดหาง, ปัสสาวะบ่อย",
              "**Sow**: immobility หรือ standing",
              "**Bitch**: มี blood stained discharge จาก vulva",
              "**Queen**: ร้อง call ตอนกลางคืน, กลิ้งและตะกุยพรม, lordosis"
            ]
          }
        ]
      },
      {
        "heading": "ตารางเปรียบเทียบ estrous cycle, ความยาว estrus และจังหวะ ovulation",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.44",
        "body": [
          {
            "bullets": [
              "**Cow**: estrous cycle 21 วัน, estrus 12-18 ชั่วโมง, **ovulation 10-14 ชั่วโมงหลัง estrus**",
              "**Mare**: estrous cycle 22 วัน, estrus 6-8 วัน, **ovulation 1-2 วันก่อน estrus จะจบ**",
              "**Doe (goat)**: estrous cycle 21 วัน, estrus 30-40 ชั่วโมง, **ovulation ที่ปลายของ estrus**",
              "**Doe (rabbit)**: สไลด์เขียนว่า constant ทั้ง cycle และความยาว estrus, **ovulation 8-10 ชั่วโมงหลังผสม**",
              "**Sow**: estrous cycle 20-21 วัน, estrus 40-72 ชั่วโมง, **ovulation กลาง estrus**",
              "**Ewe**: estrous cycle 17 วัน, estrus 24-36 ชั่วโมง, **ovulation ช่วงท้ายของ estrus**",
              "**Dog**: estrus 9 วัน, **ovulation 1-2 วันหลัง estrus เริ่ม**",
              "**Cat**: estrus 5 วัน, **ovulation 24 ชั่วโมงหลังผสม**"
            ]
          },
          {
            "callout": "ในคอลัมน์ estrous cycle ของตารางยังเหลือค่า 14-21 อีกหนึ่งค่า ซึ่ง text layer ไม่ได้ผูกชัดว่าเป็นของ Dog หรือ Cat จึงไม่ระบุลงในสองแถวข้างบน ให้ตรวจกับสไลด์ตัวจริง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Primate cycle: 4 phases",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.46",
        "body": [
          {
            "bullets": [
              "**เฉลี่ย 28 วัน โดยมีช่วง 14-40 วัน**",
              "**Follicular phase 14 วัน** ประกอบด้วย 1. active menstruation และ 2. proliferation phase",
              "**Luteal phase 14-15 วัน** ประกอบด้วย 3. secretory phase และ 4. regression phase"
            ]
          },
          {
            "text": "สไลด์แสดงสองแถบคู่กันคือ endometrium และ ovary ส่วนรายละเอียดของแต่ละแถบอยู่ในรูป"
          }
        ]
      },
      {
        "heading": "The reproductive cycle of the primate",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.47",
        "body": [
          {
            "bullets": [
              "GnRH จาก hypothalamus กระตุ้น anterior pituitary ให้หลั่ง FSH และ LH",
              "**FSH กระตุ้นให้ follicle โตและแสดง LH receptors** แล้วสร้างฮอร์โมน P และ E",
              "**LH กระตุ้นการเติบโตของ theca cell และสร้าง testosterone** แล้วกระตุ้นให้เกิด ovulation ซึ่งเกิด **1 วันหลัง LH peak**",
              "Estrogen (E2) จาก follicle ที่กำลังโต กระตุ้นการหลั่ง GnRH ทำให้ LH และ FSH เพิ่มขึ้น",
              "**E2 peak ทำให้เกิด LH peak** และ **LH surge ทำให้เกิด ovulation**",
              "Follicle cells กลายเป็น CL",
              "**Progesterone และ E2 จาก CL รักษา endometrium ให้หนา เพื่อรอ embryo implant**",
              "**ถ้าไม่มีการปฏิสนธิ CL สลาย E2 และ P ลดลง หลอดเลือดหดตัว endometrium หลุดลอก เกิด menstruation**"
            ]
          }
        ]
      },
      {
        "heading": "Cervical mucus และ spinnbarkeit (หน้ารูปล้วน)",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.49",
        "body": [
          {
            "text": "หน้านี้มีเพียงหัวข้อ cervical mucus and spinnbarkeit เช่นเดียวกับหน้า 48 ที่มีเพียงหัวข้อ characteristic of primate estrous cycle **สไลด์ไม่ได้อธิบายเป็นข้อความ** ทั้งสองหน้า"
          }
        ]
      },
      {
        "heading": "โค: ฮอร์โมน พฤติกรรม และจังหวะตกไข่",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.51",
        "body": [
          {
            "bullets": [
              "สไลด์เขียนว่า Cow: P4 incidence of standing heat เท่ากับ **จุดเริ่มของ estrus**",
              "**จุดจบของ standing heat คือจุดจบของ estrus**",
              "**Ovulation เกิดที่ 10-14 ชั่วโมงหลัง estrus**"
            ]
          },
          {
            "text": "อ้างอิง Galina and Orihuela, Hormones and Behavior (2007) 52:32-38"
          }
        ]
      },
      {
        "heading": "โค: เวลาผสมเทียมที่เหมาะสม",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.52",
        "body": [
          {
            "bullets": [
              "**Ovulation ที่ 10-14 หลัง estrus** (สไลด์หน้านี้เขียนตัวเลขไว้โดยไม่ระบุหน่วยซ้ำ ส่วนหน้า 44 และ 51 ระบุว่าเป็นชั่วโมง)",
              "**Insemination time เท่ากับ 12 ชั่วโมงหลัง standing heat**"
            ]
          }
        ]
      },
      {
        "heading": "ม้า: Flehmen response",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.54",
        "body": [
          {
            "text": "หน้า estrus detection in mare ระบุคำเดียวคือ **Flehmen response** ที่เหลือเป็นรูป ส่วนพฤติกรรมอื่นของ mare อยู่ในตารางหน้า 43"
          }
        ]
      },
      {
        "heading": "สุกร: standing heat, ovulation และเวลาผสม",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.56",
        "body": [
          {
            "bullets": [
              "สัญญาณที่สไลด์ระบุ ได้แก่ vulva แดงและบวม, มองหาพ่อพันธุ์ (seeking the boar) และ riding behavior",
              "**Sow: ↑E2 แล้วเกิด standing heat ซึ่งคือจุดเริ่มของ estrus**",
              "**Ovulation ที่กลาง estrus เท่ากับ 1-2 วันหลัง standing estrus**",
              "**Insemination time เท่ากับ 12 ชั่วโมง และ 24 ชั่วโมงหลัง standing heat** โดยสไลด์วงเล็บว่า estrus ยาว 2-3 วัน"
            ]
          }
        ]
      },
      {
        "heading": "สุนัข: standing heat, ovulation และเวลาผสม",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.58",
        "body": [
          {
            "bullets": [
              "**Dog: E2 ↑ เพื่อ prime ก่อน แล้ว ↑P4 จึงเกิด standing heat ซึ่งคือจุดเริ่มของ estrus** โดย estrus ยาว 9 วัน",
              "**Ovulation ที่ 1-2 วันหลัง estrus เริ่ม**",
              "**Insemination time เท่ากับ 2 วันหลัง standing heat หรือดูจาก keratinized vaginal smear**"
            ]
          }
        ]
      },
      {
        "heading": "Vaginal smear ในสุนัข",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.59",
        "body": [
          {
            "text": "สไลด์เป็นภาพ smear ของ 4 ระยะ คือ anestrus, proestrus, estrus และ diestrus พร้อม label ชนิดเซลล์"
          },
          {
            "bullets": [
              "**Estrus**: unucleated cell (keratinized) ตามที่สไลด์สะกด",
              "**Diestrus**: intermediate, neutrophil และ parabasal"
            ]
          }
        ]
      },
      {
        "heading": "คำถามในสไลด์: vaginal smear day 1 ในสุนัข",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.60",
        "body": [
          {
            "text": "โจทย์คือ ผลการตรวจ vaginal smear ของสุนัขพบ **เซลล์เม็ดเลือดแดงจำนวนมากปะปนกับ intermediate cell และ parabasal cell** ถามว่าสุนัขเพศเมียตัวนี้อยู่ระยะใดของการเป็นสัด และควรแนะนำให้ผสมในอีกกี่วันต่อมา"
          },
          {
            "bullets": [
              "ก. ระยะ diestrus ให้รอผสมรอบหน้า",
              "ข. ระยะ estrus ให้ผสมในวันที่ตรวจทันที",
              "ค. ระยะ proestrus ให้ผสมในวันที่ตรวจทันที",
              "ง. ระยะ estrus ให้ผสมในวันที่ 12-13 หลังจากการตรวจ",
              "จ. ระยะ proestrus ให้ผสมในวันที่ 12-13 หลังจากการตรวจ"
            ]
          },
          {
            "callout": "**สไลด์ไม่ได้เฉลย** ข้อมูลในเด็คที่ใช้ตัดสินได้คือ หน้า 59 (ชนิดเซลล์ของแต่ละระยะ), หน้า 58 (ผสม 2 วันหลัง standing heat หรือเมื่อ smear เป็น keratinized) และหน้า 44 (dog estrus 9 วัน ovulation 1-2 วันหลัง estrus เริ่ม)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "แมว (queen): reflex ovulator",
        "source": "UnderGrad Reproductive 2023 (Female Repro) p.62",
        "body": [
          {
            "text": "หัวข้อระบุว่า estrus detection in queen และกำกับว่า **reflex ovulators** ที่เหลือเป็นรูป ตัวเลขของแมวอยู่ในหน้า 44 (estrus 5 วัน, ovulation 24 ชั่วโมงหลังผสม) และพฤติกรรมอยู่ในหน้า 43"
          }
        ]
      }
    ]
  },
  "physio-3--undergrad-reproductive-2023-fer-par-preg": {
    "topic": "physio-3--undergrad-reproductive-2023-fer-par-preg",
    "title": "Fertilization, Implantation, Pregnancy และ Parturition",
    "icon": "📘",
    "lecturer": "Sutthasinee Poonyachoti",
    "summary": "เด็คนี้ไล่ตั้งแต่การขนส่ง gamete และการปฏิสนธิที่ท่อนำไข่ ไปจนถึง implantation 5 phases, maternal recognition of pregnancy แยกตามชนิดสัตว์ (cow, sow, mare, dog) และปิดท้ายด้วยการคลอด ต้องบอกตามตรงว่าเกินครึ่งของสไลด์เป็นรูปหรือ diagram ที่ text layer มีแค่เลขหน้าหรือคำกำกับสั้น ๆ เช่น P4 กับ E2 ที่มีลูกศรขึ้นลง เนื้อความจริง ๆ จึงกระจุกอยู่ราว 20 สไลด์ และส่วน parturition ท้ายเล่มบางมาก มีแค่สไลด์เดียวที่บอกช่วงเวลาการคลอดกับลิงก์วิดีโอ",
    "sections": [
      {
        "heading": "ขอบเขตของ lecture นี้",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.2",
        "body": [
          {
            "text": "Learning objectives ที่อาจารย์วางไว้มี 5 หัวข้อใหญ่ ใช้เป็นโครงอ่านทั้งเด็คได้เลย"
          },
          {
            "bullets": [
              "บทนำขั้นตอนการปฏิสนธิ การฝังตัว การตั้งท้อง และการคลอด",
              "กลไกและการควบคุม Fertilization ได้แก่ gamete transport, acrosomal reaction, oocyte reaction และ fusion of gametes",
              "กลไกและการควบคุม Implantation ได้แก่ hatching, apposition, adhesion, invasion และ post implantation phase",
              "กลไกและการควบคุม Pregnancy ในสัตว์ชนิดต่าง ๆ ครอบคลุม hormonal changes during pregnancy, maternal recognition และการเปลี่ยนแปลงฮอร์โมนเมื่อครบกำหนดคลอด",
              "การครบกำหนดคลอด กลไกและขั้นตอนของ parturition"
            ]
          }
        ]
      },
      {
        "heading": "ตำแหน่งสำคัญบนท่อนำไข่",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.3-4",
        "body": [
          {
            "text": "สไลด์ชี้ตำแหน่งบนท่อนำไข่ไว้ 2 จุดที่ต้องแยกให้ออก"
          },
          {
            "bullets": [
              "**Ampullary-Isthmic Junction (AIJ) คือ site of fertilization**",
              "**Utero-tubal Junction ทำหน้าที่ block polyspermy**",
              "โครงสร้างอื่นที่ระบุบนภาพคือ Ampulla และ Isthmus"
            ]
          },
          {
            "text": "หน้าถัดมาสรุปว่าการปฏิสนธิคือการที่ viable gametes เคลื่อนมาพบกันที่ ampullary portion นับจาก AIJ โดยมีทั้ง oocyte transport และ spermatozoa transport และสไลด์ย้ำด้วยดอกจันสี่ตัวว่า **appropriated time is important**"
          }
        ]
      },
      {
        "heading": "Sperm transport และ capacitation",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.5",
        "body": [
          {
            "text": "สไลด์เป็นผังไล่จาก mating ไปจนถึง ampullo-isthmus ready for fertilization"
          },
          {
            "bullets": [
              "ตำแหน่งหลั่งน้ำเชื้อ sperm deposition อยู่ที่ vagina ในสัตว์ส่วนใหญ่ แต่ **dog และ sow หลั่งที่ cervix**",
              "Sperm transport ถูกคุมด้วย **E2 and P4 balance** ปัจจัยที่สไลด์ลิสต์ไว้คือ cilia, uterus ที่ถูก E2 primed ร่วมกับ oxytocin และ PGF2, oviduct, peristalsis, penetration, mixing movement และ secretion",
              "**Sperm capacitation คือการ remove inhibitor ซึ่งเป็น glycoproteins**",
              "Acrosomal reaction ทำให้เปลี่ยน morphology และสภาพ biochemical จนพร้อมเจาะ egg membrane"
            ]
          }
        ]
      },
      {
        "heading": "Oocyte transport และฮอร์โมนที่คุมการบีบตัวของ oviduct",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.9-10",
        "body": [
          {
            "text": "oocyte พร้อม cumulus mass ถูกเก็บโดย ciliated epithelial cells ของ infundibulum และ **ใช้เวลาผ่าน AIJ ประมาณ 60-72 ชั่วโมง**"
          },
          {
            "text": "กลไกที่พา oocyte ลงมาตามสไลด์มี 3 ข้อ"
          },
          {
            "bullets": [
              "Cilia beating toward uterus พร้อม directional flow ของ oviductal fluid มายัง AIJ",
              "Segmented, peristaltic contractions ของ oviduct ทำหน้าที่ milking the oocyte down",
              "Secretions จาก epithelial cells ที่บุ ampulla ช่วยเตรียม sperm สำหรับ capacitation และช่วย early development ของไข่"
            ]
          },
          {
            "sub": "Note ฮอร์โมนบนสไลด์ p.10",
            "body": [
              {
                "bullets": [
                  "**Progesterone ลด alpha-adrenergic แต่เพิ่ม beta-adrenergic receptor activity ทำให้ oviduct คลายตัว**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ลำดับเหตุการณ์ตั้งแต่ ovulation ถึง first cleavage",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.8, p.11",
        "body": [
          {
            "text": "ผัง p.8 เริ่มที่ mating และ ovulation ซึ่งปล่อย **secondary oocyte ที่ระยะ metaphase II** ออกมา"
          },
          {
            "text": "Ovum transport ถูกคุมด้วย E2 and P4 balance ผ่าน motility ที่สไลด์แจกแจงเป็น cilia, smooth muscle contraction, peristalsis, segmentation, mixing movement และ secretion"
          },
          {
            "text": "เมื่อถึง ampulla แล้วเกิด sperm penetration สไลด์ให้ oocyte reaction ออกมา 2 อย่าง"
          },
          {
            "bullets": [
              "**Block to polyspermy ผ่าน zona reaction**",
              "**Resume และ complete meiosis II**"
            ]
          },
          {
            "text": "จากนั้นไล่ต่อเป็น sperm รวมกับ ootid แบบ cytoplasmic fusion ไปสู่ pronuclei development แล้ว **syngamy หรือ amphimixis** และจบที่ first cleavage"
          },
          {
            "text": "สไลด์ p.11 สรุปเรื่องเดียวกันเป็น 3 หัวข้อคือ sperm penetration (capacitation, acrosomal reaction ที่มีทั้ง release of enzyme และ polyspermy block), oocyte reaction (harden of zona pellucida, complete of meiosis II) และ pronucleus formation and syngamy"
          }
        ]
      },
      {
        "heading": "Fast block และ slow block to polyspermy",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.13-14",
        "body": [
          {
            "sub": "Acrosomal reaction และ fast block",
            "body": [
              {
                "bullets": [
                  "acrosomal reaction ถูก trigger เมื่อ sperm พบ egg",
                  "acrosome ที่ปลาย sperm ปล่อย hydrolytic enzymes ย่อย cumulus oophorus และมี **acrosin สำหรับย่อย zona pellucida**",
                  "**gamete contact หรือ fusion ทำให้ egg cell membrane depolarize ซึ่งเป็น fast block to polyspermy**"
                ]
              }
            ]
          },
          {
            "sub": "Cortical reaction และ slow block",
            "body": [
              {
                "bullets": [
                  "การ fusion ของไข่กับอสุจิเริ่ม cortical reaction",
                  "**ปฏิกิริยานี้ทำให้ Ca2+ สูงขึ้น กระตุ้น cortical granules ปล่อยสารออกนอกไข่**",
                  "**การเปลี่ยนแปลงนี้สร้าง fertilization envelope ซึ่งทำหน้าที่เป็น slow block to polyspermy**"
                ]
              }
            ]
          },
          {
            "callout": "คู่ที่ข้อสอบชอบสลับ fast block เกิดจาก depolarization ของ egg membrane ส่วน slow block เกิดจาก cortical reaction ที่สร้าง fertilization envelope",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ภาพรวม 4 step ของทั้งกระบวนการ",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.15",
        "body": [
          {
            "bullets": [
              "Step 1 Embryo Development ได้แก่ zygote, morula, blastocyst, hatching, expansion",
              "Step 2 Implantation ได้แก่ shedding of ZP, pre-contact and conceptus orientation, apposition, adhesion, invasive, post-implantation",
              "Step 3 Pregnancy Recognition ประกอบด้วย hormonal signal จาก fetal ได้แก่ E2 และ IFN และจาก placenta ได้แก่ relaxin, prolactin, P4 ร่วมกับ contact signal",
              "Step 4 Parturition"
            ]
          }
        ]
      },
      {
        "heading": "Implantation แบ่งเป็น 5 phases",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.16",
        "body": [
          {
            "bullets": [
              "**Hatching Phase คือ blastocyst หลุดออกจาก zona pellucida**",
              "Apposition Phase คือ hatched blastocyst จัดแนวและวางทิศทางตัวเองเพื่อเตรียม attachment",
              "**Adhesion Phase อาศัย laminin และ fibronectin** เกิด attachment ระหว่าง uterine surface epithelium กับ trophoblast",
              "**Invasion Phase เป็นแบบ phagocyte** หลังจาก blastocyst ยึดกับผิวมดลูกแน่นแล้ว trophoblast cells หลั่ง hydrolytic enzyme เจาะ uterine epithelial layer แล้วกลายเป็น syncytiotrophoblast",
              "Postimplantation Phase คือ trophoblast cells หยุด invasive activity และความสัมพันธ์ maternal-fetal เข้าสู่ภาวะคงที่"
            ]
          }
        ]
      },
      {
        "heading": "Endometrium ระยะ pre-receptive เทียบกับ receptive",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.17",
        "body": [
          {
            "sub": "Pre-receptive stage",
            "body": [
              {
                "bullets": [
                  "Long microvilli",
                  "**Thick glycocalyx ชนิด Mucin (Muc-1)**",
                  "High surface charge"
                ]
              }
            ]
          },
          {
            "sub": "Receptive stage",
            "body": [
              {
                "bullets": [
                  "**มี pinopods สำหรับ reabsorb uterine fluid**",
                  "สูญเสีย negative charge และ mucin พร้อม villi shortening",
                  "**แสดงออกของ adhesion molecules คือ integrin receptors**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เขียนคำว่า Estrogen และ Progesterone กำกับการเปลี่ยนจาก pre-receptive ไป receptive แต่วางเป็นผังภาพ สไลด์ไม่ได้บอกชัดว่าฮอร์โมนตัวไหนรับผิดชอบข้อไหน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "LIF cascade ในการฝังตัว",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.19",
        "body": [
          {
            "text": "สไลด์ไล่การฝังตัวเป็น 6 ขั้นโดยยึด LIF เป็นแกน โดยระบุว่า **LIF คือ Leukemia inhibiting Factor ในกลุ่ม IL-6 และ LIF receptor คือ gp130**"
          },
          {
            "bullets": [
              "Free floating blastocyst ยังถูกหุ้มด้วย zona pellucida",
              "Blastocyst hatch ออกจาก zona pellucida",
              "Gradual apposition ของ blastocyst กับ endometrium คือจุดเริ่มของ implantation ช่วงนี้ **endometrium หลั่ง LIF สูงสุด และ blastocyst แสดง LIF receptor (gp130)**",
              "Blastocyst adhere กับ endometrium แล้ว blastocyst จึงหลั่ง LIF ตามมา endometrium สร้าง soluble gp130 และ LIF receptor ซึ่ง **soluble gp130 induce การเกิด pinopodes บนผิว endometrium** และ adhesion ยังทำให้ trophoblast แยกเป็น inner cytotrophoblast กับ outer syncytiotrophoblast",
              "**Syncytiotrophoblast หลั่ง cytokines เช่น IL-1 แล้ว invade เข้า luminal epithelium**",
              "Implantation สมบูรณ์ โดย endometrium หลั่ง LIF"
            ]
          }
        ]
      },
      {
        "heading": "ชั้นเซลล์และหน้าที่ของ placenta",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.18",
        "body": [
          {
            "text": "สไลด์เป็นรูปไล่ 5 phase ของการฝังตัว โดยมีป้ายชื่อชั้นเซลล์คือ endometrium, syncytiotrophoblast, cytotrophoblast และ inner mass cell"
          },
          {
            "text": "หน้าที่ของ placenta ที่สไลด์ระบุมี 4 ข้อ"
          },
          {
            "bullets": [
              "**Respiration**",
              "**Nutrition**",
              "**Protection**",
              "**Hormone secretion**"
            ]
          }
        ]
      },
      {
        "heading": "บทบาทของ Progesterone และ Estrogen ระหว่างตั้งท้อง",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.20-21",
        "body": [
          {
            "text": "สไลด์ p.20 เป็นรูปที่กำกับไว้สั้น ๆ ว่า **Progesterone ที่เพิ่มขึ้นคือสิ่งที่ maintain pregnancy** และคำว่า recognition of pregnancy"
          },
          {
            "sub": "ระหว่างตั้งท้อง Progesterone",
            "body": [
              {
                "bullets": [
                  "**Relax myometrium**",
                  "**Tight contraction ของ cervix**"
                ]
              }
            ]
          },
          {
            "sub": "ช่วง late pregnancy Estrogen",
            "body": [
              {
                "bullets": [
                  "**Myometrium contract**",
                  "Production of contraction protein",
                  "**Formation of gap-junction ระหว่าง smooth muscle cells**",
                  "เพิ่ม prolactin production จาก anterior pituitary gland",
                  "เพิ่มการพัฒนา mammary gland และ alveolar ในระยะ post partum"
                ]
              }
            ]
          },
          {
            "callout": "ครึ่งล่างของสไลด์เป็นผังจับคู่ชนิดสัตว์กับแหล่ง progesterone โดยฝั่งหนึ่งเขียน Mare, Ewe, Dog, Primate คู่กับ Placenta และอีกฝั่งเขียน Cow, Sow, Goat คู่กับ CL ส่วนคำว่า Progesterone, Relaxin, Prolactin และ Uterus กระจายอยู่รอบผัง text layer อ่านลำดับลูกศรไม่ได้ จึงไม่ระบุมากกว่านี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Establishment และ maintenance of pregnancy",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.23",
        "body": [
          {
            "sub": "Modification of synthesis and release ของ uterine PGF-2a",
            "body": [
              {
                "bullets": [
                  "**Cow ใช้วิธี suppress**",
                  "**Sheep ไม่มี pulsatile secretion กลายเป็นแบบ continuous**",
                  "CL life span ยืดออกจากการเพิ่มของ P4 ผ่าน utero-ovarian relationships"
                ]
              }
            ]
          },
          {
            "sub": "สัญญาณจากตัวอ่อน",
            "body": [
              {
                "bullets": [
                  "Embryo estrogen synthesis ทำหน้าที่ inform endometrium ว่ามีตัวอ่อนอยู่",
                  "**Trophoblastin เป็นโปรตีนจากตัวอ่อน โครงสร้างเป็น interferon และผลิตก่อนวันที่ 14 หลัง ovulation ใน cattle และ sheep**"
                ]
              }
            ]
          },
          {
            "sub": "Movement of embryo in female tract",
            "body": [
              {
                "bullets": [
                  "**Mare ตัวอ่อนเคลื่อนทั่วทั้งสองข้างของมดลูกแล้ว fixed ที่วันที่ 16**",
                  "สัตว์ที่ออกลูกเป็น litter มี transuterine migration",
                  "การเคลื่อนที่นี้มีผลทั้งเลือกตำแหน่งฝังตัวที่ดีที่สุดและเรื่อง pregnancy recognition"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Maternal recognition of pregnancy แยกตามชนิดสัตว์",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.29",
        "body": [
          {
            "bullets": [
              "**Cow ใช้ bovine interferon tau (bIFNt) สร้างจาก conceptus โดยวันที่ 15-16 ของ gestation เป็นช่วงวิกฤต**",
              "**Sow ใช้ estradiol สร้างจาก conceptus ทำให้ PGF2 alpha ถูก reroute และต้องเกิดในวันที่ 11-12**",
              "**Mare ใช้ protein หรือ estrogen complex ร่วมกับ embryo migration โดยตั้งแต่วันที่ 12 ตัวอ่อนต้องเคลื่อนที่ 12-15 ครั้งต่อวัน**"
            ]
          }
        ]
      },
      {
        "heading": "ทิศทางการหลั่ง PGF ใน swine",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.33",
        "body": [
          {
            "text": "**สัญญาณ anti luteolytic สำหรับ pregnancy recognition ใน swine คือ estrogen**"
          },
          {
            "bullets": [
              "**Cyclic gilt หลั่ง PGF ในทิศทาง endocrine ออกไปยัง uterine vasculature แล้วถูกส่งไปที่ CL ทำให้ CL regression**",
              "**ในหมูที่ตั้งท้อง ทิศทางการหลั่ง PGF เปลี่ยนเป็น exocrine เข้าสู่ uterine lumen ถูกกักไว้ให้ออกฤทธิ์ใน utero และหรือถูก metabolise จึงป้องกัน luteolysis**"
            ]
          }
        ]
      },
      {
        "heading": "Conceptus ยับยั้ง uterine PGF และการเกิด accessory CL",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.36",
        "body": [
          {
            "bullets": [
              "**Uterine luteolytic hormone คือ PGF**",
              "Conceptus ดูเหมือนจะยับยั้งการสร้าง PGF จาก uterine endometrium ในช่วงที่สไลด์เขียนว่า at 1 and 2 semester",
              "**PMSG ยังกระตุ้น follicular wave ทำให้เกิด accessory CL**"
            ]
          },
          {
            "callout": "สไลด์หน้านี้ไม่ได้พิมพ์ชื่อชนิดสัตว์กำกับไว้ในตัวอักษรที่อ่านได้ มีแต่รูปประกอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สุนัข CL, pseudopregnancy และ relaxin",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.38",
        "body": [
          {
            "sub": "เมื่อไม่ตั้งท้อง",
            "body": [
              {
                "bullets": [
                  "**CL ไม่ regress แม้ไม่ตั้งท้อง จึงเกิด pseudopregnancy และ CL อยู่ได้นานพอ ๆ กับตอนตั้งท้อง**",
                  "**เป็น passive degeneration ของ CL ไม่เกี่ยวกับผลจากมดลูก คือไม่ผ่าน PGF2a แต่เกิดจากการไม่มี PRL, LH ลดลง หรือ PGE2 ลดลง**"
                ]
              }
            ]
          },
          {
            "sub": "เมื่อตั้งท้อง",
            "body": [
              {
                "bullets": [
                  "**Placenta หลั่ง prolactin ไปเพิ่ม LH receptor ทำให้มีการสร้าง P4 เหมือนตอนไม่ตั้งท้อง**",
                  "**Placenta หลั่ง relaxin ซึ่งเป็น pregnancy marker ในสุนัข ทำหน้าที่คลายการหดตัวของกล้ามเนื้อเพื่อต้านฤทธิ์ oxytocin**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Placenta กับ fetus ในการสร้างสเตียรอยด์ช่วงท้ายของการตั้งท้อง",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.27",
        "body": [
          {
            "bullets": [
              "**Placenta สร้างทั้ง progesterone และ estrogen**",
              "**Fetus รับ pregnenolone จาก placenta ไปสร้าง DHEA ที่ adrenal แล้วใช้สร้าง cortisol ในช่วง late term ของการตั้งท้อง จากนั้น E2 จึงเพิ่มขึ้น**"
            ]
          }
        ]
      },
      {
        "heading": "ฮอร์โมนเมื่อครบกำหนดคลอด",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.41",
        "body": [
          {
            "text": "สไลด์นี้มีข้อความสั้นเพียงบรรทัดเดียวคือ **เมื่อ pregnancy is completed แล้ว estrogen จะเพิ่มขึ้น** ที่เหลือเป็นกราฟ สไลด์ไม่ได้อธิบายกลไกต่อ"
          }
        ]
      },
      {
        "heading": "Parturition",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.43",
        "body": [
          {
            "text": "สไลด์ปิดท้ายเรื่องการคลอดเป็นรูปที่กำกับช่วงเวลาไว้ 3 ค่าคือ 2-6 ชั่วโมง, น้อยกว่า 2 ชั่วโมง และ 2-8 ชั่วโมง แต่ text layer ไม่ได้บอกว่าค่าใดคู่กับระยะใดของการคลอด"
          },
          {
            "bullets": [
              "**Normal process ใช้เวลา 30 นาทีถึง 4 ชั่วโมง**",
              "**สังเกตทุก 15-20 นาที ซึ่งสไลด์วงเล็บไว้ว่าเป็นช่วงการออกฤทธิ์ของ oxytocin**",
              "**ถ้าไม่เข้าสู่ labor ภายใน 24 ชั่วโมง ถือว่าเป็น dystocia**"
            ]
          },
          {
            "text": "สไลด์แนบลิงก์วิดีโอ YouTube ให้ไปดูขั้นตอนการคลอดเพิ่ม"
          },
          {
            "callout": "objective ข้อ 5 เขียนว่าจะสอนกลไกและขั้นตอนของ parturition แต่ในเด็คมีสไลด์ที่มีข้อความเรื่องการคลอดแค่หน้านี้หน้าเดียว รายละเอียดกลไกและ stage of labor สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นรูปล้วนหรือมีแต่ป้ายกำกับ",
        "source": "Undergrad Reproductive 2023 (Fer Par Preg) p.6-7, p.12, p.22, p.24-26, p.28, p.30-32, p.34-35, p.37, p.39-40, p.42, p.44",
        "body": [
          {
            "text": "ส่วนนี้ไม่ใช่เนื้อหา แต่บันทึกไว้ให้รู้ว่าอ่านจาก text อย่างเดียวจะไม่ครบ ต้องเปิดสไลด์จริงดูรูป"
          },
          {
            "bullets": [
              "p.6, p.7, p.12, p.22, p.25, p.28, p.30, p.31, p.34, p.42 และ p.44 ไม่มีข้อความเลย มีแต่เลขหน้า",
              "p.24 มีเพียงวงเล็บว่า action like LH to maintain CL",
              "p.26 เป็นผังที่มีแต่คำว่า Placenta, CL และ Pituitary เรียงกัน น่าจะเป็นตารางแหล่งฮอร์โมนแยกชนิดสัตว์ แต่ text layer อ่านการจับคู่ไม่ได้",
              "p.32 มีป้ายว่า PGF-2, interferon-delta (IFND), IFN-gamma (IFNG), Day 21, P4 และ after breeding อ้างอิงจากเว็บ therio ของ LSU",
              "p.35 มีเพียง P4 เพิ่มสองลูกศรและ E2 เพิ่ม",
              "p.37 มีเพียง E2 เพิ่ม, P4 เพิ่ม, Relaxin เพิ่ม และ P4 ขึ้นแล้วลง",
              "p.40 มีเพียง P4 เพิ่ม, E2 ลด และ prolactin ในช่วง mid-late"
            ]
          },
          {
            "callout": "ป้ายฮอร์โมนบนกราฟหน้าเหล่านี้น่าจะเป็นกราฟการตั้งท้องแยกตามชนิดสัตว์ต่อเนื่องจากหน้าที่มีข้อความ แต่ text layer ไม่ได้ระบุชื่อชนิดสัตว์กำกับกราฟแต่ละอัน จึงไม่จับคู่ให้",
            "kind": "flag"
          }
        ]
      }
    ]
  }
};
