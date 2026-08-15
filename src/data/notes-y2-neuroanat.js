// ============================================================
// ประสาทกายวิภาคสัตว์ (Veterinary Neuroanatomy) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส 3101209 ที่แจกจริงในรายวิชา ทุก section
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

export const NOTES_Y2_NEUROANAT = {
  "neuroanat--basal-nuclei": {
    "topic": "neuroanat--basal-nuclei",
    "title": "Basal nuclei (Telencephalon)",
    "icon": "📖",
    "lecturer": "Damri Darawiroj",
    "summary": "เด็คนี้ว่าด้วย basal nuclei ในฐานะ deep gray matter ของ telencephalon ครอบคลุมรายชื่อและการจัดกลุ่มนิวเคลียส ลักษณะรายตัวของ caudate nucleus, accumbens nucleus, putamen, pallidum และ claustrum ตามด้วยหน้าที่รวม (movement co-ordination), basal nuclei circuit แบบ direct/indirect pathway ที่มี dopamine กำกับ และ blood supply สองเส้น มี 1 สไลด์เป็นลิงก์วิดีโอ YouTube ล้วน (p.14) ส่วน amygdala กับ endopeduncular nucleus ถูกเอ่ยชื่อในรายการแต่ไม่มีสไลด์อธิบายรายละเอียด",
    "sections": [
      {
        "heading": "Basal nuclei อยู่ตรงไหนใน Telencephalon",
        "source": "Basal nuclei p.2",
        "body": [
          {
            "text": "สไลด์แบ่งเนื้อของ telencephalon เป็น gray matter กับ white matter แล้ววาง basal nuclei ไว้ในฝั่ง gray matter"
          },
          {
            "sub": "Gray matter",
            "body": [
              {
                "bullets": [
                  "Superficial คือ cerebral cortex",
                  "**Deep คือ basal nuclei**"
                ]
              }
            ]
          },
          {
            "sub": "White matter",
            "body": [
              {
                "bullets": [
                  "Association fiber ได้แก่ arcuate fibers",
                  "Commissural fiber ได้แก่ corpus callosum และ rostral commissure",
                  "Projection fiber ได้แก่ coronal radiata, internal capsule และ external capsule"
                ]
              }
            ]
          },
          {
            "callout": "จำโครงว่า basal nuclei = gray matter ที่อยู่ลึก ส่วน internal capsule กับ external capsule ที่จะโผล่มาเป็นขอบเขตของแต่ละนิวเคลียสในสไลด์ถัดไป เป็น projection fiber ของ white matter",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "รายชื่อและการจัดกลุ่มของ basal nuclei",
        "source": "Basal nuclei p.3",
        "body": [
          {
            "text": "สไลด์นี้เป็นแผนผังชื่อ ไล่ตามที่สไลด์วางไว้คือ caudate nucleus, accumbens nucleus, striatum, putamen, pallidum, lentiform nucleus, endopeduncular (subthalamic) nucleus, claustrum และ amygdala"
          },
          {
            "bullets": [
              "**Striatum** เป็นชื่อกลุ่ม วางคร่อม caudate nucleus, accumbens nucleus และ putamen",
              "**Lentiform nucleus** เป็นชื่อกลุ่ม วางคร่อม putamen และ pallidum",
              "**Endopeduncular nucleus สไลด์วงเล็บกำกับว่าคือ subthalamic nucleus** ชื่อนี้จะกลับมาอีกครั้งในหัวข้อ circuit",
              "Claustrum และ amygdala สไลด์แยกออกมาเป็นชื่อเดี่ยว ไม่ได้อยู่ในกลุ่ม striatum หรือ lentiform"
            ]
          },
          {
            "callout": "สไลด์เป็นแผนผังวงเล็บปีกกา ลำดับชื่อที่สรุปไว้ข้างบนอ่านจากตำแหน่งที่ชื่อกลุ่มวางอยู่ ถ้าจะยืนยันขอบเขตของแต่ละปีกกาแบบเป๊ะ ให้กลับไปดูรูปในสไลด์จริงอีกรอบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "เลขกำกับนิวเคลียส",
        "source": "Basal nuclei p.5",
        "body": [
          {
            "text": "ต้องท่องคู่เลขให้ได้เพราะเป็นชุดเดียวกับที่ใช้ในสไลด์ถัดไป (p.6)"
          },
          {
            "bullets": [
              "1: accumbens",
              "2: caudate",
              "3: endopeduncular",
              "4: pallidum",
              "5: putamen",
              "6: amygdala",
              "7: claustrum"
            ]
          }
        ]
      },
      {
        "heading": "Caudate nucleus",
        "source": "Basal nuclei p.8",
        "body": [
          {
            "bullets": [
              "**เป็น comma-shaped nucleus**",
              "Head โป่งเข้าไปใน floor of lateral ventricle",
              "Body โค้งไปตามรูปร่างของ lateral ventricle",
              "Tail เรียวเล็กลงใน temporal lobe"
            ]
          },
          {
            "sub": "ขอบเขตและการเชื่อมต่อ",
            "body": [
              {
                "bullets": [
                  "**Lateral boundary คือ internal capsule ส่วน medial boundary คือ lateral ventricle**",
                  "Receive axon จาก prefrontal cortex",
                  "Send axon ไปที่ pallidum",
                  "**หน้าที่ที่สไลด์ระบุคือ control eye movements**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Accumbens nucleus",
        "source": "Basal nuclei p.10",
        "body": [
          {
            "bullets": [
              "อยู่ cranial-ventral ต่อ head of caudate nucleus",
              "**เกิดจากการเชื่อมกัน (fusion) ของส่วน rostral ของ caudate nucleus กับ putamen**",
              "Receive axon จาก prefrontal cortex และ limbic system",
              "Send axon ไปที่ hypothalamus",
              "**เป็น emotional-related nucleus**"
            ]
          }
        ]
      },
      {
        "heading": "Putamen",
        "source": "Basal nuclei p.11",
        "body": [
          {
            "bullets": [
              "อยู่ระหว่าง internal capsule กับ lateral medullar lamina",
              "**การเชื่อมต่อกับ caudate nucleus ทำให้เห็นเป็นลายทาง (stripe appearance)**",
              "Receive axon จาก sensory และ motor area ของ cerebral cortex",
              "**Control simple movement ของ limbs และ trunk**"
            ]
          }
        ]
      },
      {
        "heading": "Pallidum (globus pallidus)",
        "source": "Basal nuclei p.12",
        "body": [
          {
            "bullets": [
              "อยู่ medial ต่อ putamen และ lateral ต่อ endopeduncular nucleus",
              "**เป็น reticulate nucleus**",
              "Receive axon จาก caudate nucleus และ putamen",
              "**Send axon ไปที่ cerebral cortex ของ frontal lobe**"
            ]
          },
          {
            "callout": "อ่านคู่กับ caudate (p.8) และ putamen (p.11) จะได้ทิศทางของวงจร คือ caudate กับ putamen ส่งเข้า pallidum แล้ว pallidum ส่งออกไป frontal lobe",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Claustrum",
        "source": "Basal nuclei p.13",
        "body": [
          {
            "bullets": [
              "**เป็น plate-shaped nucleus**",
              "อยู่ lateral ต่อ lentiform nucleus",
              "อยู่ lateral ต่อ external capsule",
              "**Unknown function สไลด์ระบุตรง ๆ ว่ายังไม่ทราบหน้าที่**"
            ]
          }
        ]
      },
      {
        "heading": "หน้าที่รวมของ basal nuclei",
        "source": "Basal nuclei p.15",
        "body": [
          {
            "text": "สไลด์สรุปหน้าที่ไว้คำเดียวคือ **movement co-ordination** แล้วไล่ลำดับของ voluntary movement เป็นสามขั้น"
          },
          {
            "bullets": [
              "Motivated by limbic system",
              "Decision by prefrontal cortex",
              "**Selection และ execution ทำโดย basal nuclei circuit**"
            ]
          },
          {
            "callout": "สไลด์บอกแค่ว่าใครทำขั้นไหน ไม่ได้อธิบายกลไกของแต่ละขั้นว่าเกิดอะไรขึ้นในระดับ synapse",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Basal nuclei circuit: direct และ indirect pathway",
        "source": "Basal nuclei p.16",
        "body": [
          {
            "sub": "Direct pathway",
            "body": [
              {
                "bullets": [
                  "**Striatum ไป endopeduncular nucleus โดยตรง**",
                  "**Turn up motor activity**"
                ]
              }
            ]
          },
          {
            "sub": "Indirect pathway",
            "body": [
              {
                "bullets": [
                  "**Striatum ไป endopeduncular nucleus โดยผ่าน pallidum**",
                  "**Turn down motor activity**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์มีเชิงอรรถกำกับว่าทั้งสองทางถูกกำกับ (supervises) โดย **dopamine จาก substantia nigra ซึ่ง activate direct pathway และ suppress indirect pathway**"
          },
          {
            "callout": "จุดต่างของสองทางอยู่ที่ผ่าน pallidum หรือไม่ผ่านเท่านั้น ไม่ผ่าน = เร่ง ผ่าน = ลด และ dopamine เอียงไปทางเร่ง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Blood supply of basal nuclei",
        "source": "Basal nuclei p.20",
        "body": [
          {
            "bullets": [
              "**Middle cerebral artery เลี้ยง striatum**",
              "**Internal carotid artery เลี้ยง pallidum**"
            ]
          },
          {
            "callout": "สไลด์ให้แค่สองเส้นนี้ ไม่ได้บอกเส้นเลือดที่เลี้ยง claustrum, amygdala หรือ endopeduncular nucleus",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สิ่งที่เด็คเอ่ยชื่อแต่ไม่ได้อธิบาย",
        "source": "Basal nuclei",
        "body": [
          {
            "text": "อ่านครบทั้งเด็คแล้วยังมีช่องว่างที่ต้องไปหาต่อจากแหล่งอื่น หรือถามอาจารย์"
          },
          {
            "bullets": [
              "**Amygdala** ปรากฏในรายการ (p.3) และเป็นเลข 6 บนภาพ (p.5, p.6) แต่ไม่มีสไลด์อธิบายตำแหน่ง การเชื่อมต่อ หรือหน้าที่ สไลด์ไม่ได้บอก",
              "**Endopeduncular (subthalamic) nucleus** มีชื่อในรายการและเป็นปลายทางของทั้ง direct และ indirect pathway (p.16) แต่ไม่มีสไลด์บรรยายรูปร่างหรือขอบเขตของมันเอง สไลด์ไม่ได้บอก",
              "สไลด์ p.14 มีเพียงลิงก์วิดีโอ YouTube สำหรับดูเสริมเรื่อง basal nuclei"
            ]
          }
        ]
      }
    ]
  },
  "neuroanat--diencephalon": {
    "topic": "neuroanat--diencephalon",
    "title": "Diencephalon",
    "icon": "📖",
    "summary": "เด็ค 23 สไลด์เรื่อง diencephalon แต่เนื้อความจริง ๆ กระจุกอยู่ไม่กี่หน้า สไลด์ที่มีข้อความคือ learning objectives (p.2), แผนผังเติมคำ (p.5), ตาราง geniculate nuclei (p.8), epithalamus (p.11-13), subthalamus (p.14), thalamus (p.15-16), hypothalamus 3 regions + ตารางนิวเคลียส (p.19-20) และหัวข้อ Obesity/Narcolepsy (p.21) ส่วนสไลด์ p.3, p.4, p.6, p.7, p.9, p.17, p.18, p.22 เป็นรูปล้วน ไม่มีข้อความให้สรุป และ p.5 เป็นสไลด์ฝึกเติมชื่อโครงสร้างที่ไม่ได้เฉลยไว้ในเด็ค โน้ตนี้จึงสั้นตามที่สไลด์บอกจริง ไม่เติมกลไกหรือรายละเอียดจากที่อื่น",
    "sections": [
      {
        "heading": "Learning objectives ของเลกเชอร์นี้",
        "source": "Diencephalon p.2",
        "body": [
          {
            "bullets": [
              "To identify the anatomy and functions of **five major divisions of the diencephalon**",
              "To learn the functional relationship of diencephalon to other structures"
            ]
          },
          {
            "text": "สไลด์บอกว่ามี five major divisions แต่ไม่มีสไลด์ไหนลิสต์ทั้งห้าชื่อไว้ในหน้าเดียว ส่วนที่เด็คเอ่ยชื่อจริง ๆ กระจายอยู่คือ **thalamus** และ **metathalamus** (p.5, p.15), **epithalamus** (p.5, p.11-13), **subthalamus** (p.5, p.14) และ **hypothalamus** (p.19-20)"
          }
        ]
      },
      {
        "heading": "แผนผัง diencephalon (สไลด์เติมคำ)",
        "source": "Diencephalon p.5",
        "body": [
          {
            "text": "สไลด์นี้เป็นรูปตัดพร้อมป้ายชื่อให้เติมเอง โครงสร้างที่สไลด์เขียนชื่อไว้ครบแล้วมีดังนี้"
          },
          {
            "bullets": [
              "thalamus & metathalamus",
              "epithalamus",
              "subthalamus",
              "lamina terminalis"
            ]
          },
          {
            "text": "ส่วนที่เว้นว่างไว้ให้เติม ได้แก่ CN _?_ (_? nerve), __?__ ventricle, ________ nucleus, S___ h______ thalami, ___________ adhesion และ ____ ____"
          },
          {
            "callout": "สไลด์ไม่ได้เฉลยช่องว่างเหล่านี้ไว้ในหน้าเดียวกัน มีเพียงช่อง ___________ adhesion ที่ไปตรงกับคำว่า Interthalamic adhesion ซึ่งเขียนไว้ในสไลด์ thalamus (p.15) ช่องที่เหลือสไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Geniculate nuclei",
        "source": "Diencephalon p.8",
        "body": [
          {
            "text": "สไลด์ทำเป็นตารางเทียบสองนิวเคลียส โดยระบุ type, output และ function ให้ทั้งคู่"
          },
          {
            "sub": "Medial geniculate nucleus",
            "body": [
              {
                "bullets": [
                  "type: relay sensory",
                  "output: **primary auditory cortex**",
                  "function: **Auditory pathway**"
                ]
              }
            ]
          },
          {
            "sub": "Lateral geniculate nucleus",
            "body": [
              {
                "bullets": [
                  "type: relay sensory",
                  "output: **primary visual cortex**",
                  "function: **Visual pathway**"
                ]
              }
            ]
          },
          {
            "callout": "จำคู่นี้ให้แน่น medial = การได้ยิน, lateral = การมองเห็น ทั้งคู่เป็น relay sensory เหมือนกัน ต่างกันที่ปลายทาง cortex",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Epithalamus: habenula กับ pineal body",
        "source": "Diencephalon p.11-13",
        "body": [
          {
            "text": "สไลด์ p.11 กับ p.12 เป็นหน้าเดียวกันซ้ำสองครั้ง เนื้อหาแบ่งเป็นสองโครงสร้าง"
          },
          {
            "sub": "Habenula",
            "body": [
              {
                "bullets": [
                  "'reward-negative'",
                  "emotive decision making",
                  "**depression!!** (สไลด์เขียนเน้นด้วยเครื่องหมายอัศเจรีย์ไว้เอง แต่ไม่ได้อธิบายกลไกต่อ)"
                ]
              }
            ]
          },
          {
            "sub": "Pineal body",
            "body": [
              {
                "bullets": [
                  "**melatonin**",
                  "**circadian rhythm**"
                ]
              },
              {
                "text": "สไลด์ p.13 ย้ำสองคำนี้อีกครั้งเป็นหน้าเต็ม (melatonin, circadian rhythm) ประกอบรูป"
              }
            ]
          }
        ]
      },
      {
        "heading": "Subthalamus",
        "source": "Diencephalon p.14",
        "body": [
          {
            "text": "สไลด์นี้ชี้ชื่อโครงสร้างสองอย่างบนรูป โดยไม่มีข้อความอธิบายหน้าที่กำกับ"
          },
          {
            "bullets": [
              "**zona incerta**",
              "**subthalamic nucleus**"
            ]
          },
          {
            "callout": "หน้าที่ของ zona incerta และ subthalamic nucleus สไลด์ไม่ได้บอก มีแต่ชื่อกับตำแหน่งบนรูป",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Thalamus: กลุ่มนิวเคลียสหลัก",
        "source": "Diencephalon p.15",
        "body": [
          {
            "text": "สไลด์ชี้ป้ายบนรูป thalamus แบ่งเป็นกลุ่มใหญ่ตามตำแหน่ง"
          },
          {
            "bullets": [
              "**anterior nuclei**",
              "**medial n.**",
              "**lateral nuclei**",
              "**Interthalamic adhesion**"
            ]
          },
          {
            "callout": "สไลด์หน้านี้ไม่ได้บอกหน้าที่ของ anterior nuclei และ medial nucleus มีการลงรายละเอียดหน้าที่เฉพาะกลุ่ม lateral ในหน้าถัดไปเท่านั้น",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Lateral nuclei ของ thalamus: ส่วนบนกับส่วนล่าง",
        "source": "Diencephalon p.16",
        "body": [
          {
            "text": "สไลด์แบ่งกลุ่ม lateral ออกเป็น ส่วนบน และ ส่วนล่าง แล้วกำกับหน้าที่พร้อมชนิด (associate-sensory / relay-motor / sensory)"
          },
          {
            "sub": "ส่วนบน",
            "body": [
              {
                "bullets": [
                  "pulvinar",
                  "lateral dorsal (LD)",
                  "lateral posterior (LP)",
                  "หน้าที่ที่สไลด์กำกับกลุ่มนี้: **visual attention (associate-sensory)**"
                ]
              },
              {
                "text": "สไลด์เขียนหน้าที่ให้กลุ่มนี้บรรทัดเดียว ไม่ได้แยกหน้าที่ของ LD กับ LP ออกจาก pulvinar"
              }
            ]
          },
          {
            "sub": "ส่วนล่าง",
            "body": [
              {
                "bullets": [
                  "**ventral anterior (VA)** = initiation and planning of movement (relay-motor)",
                  "**ventral lateral (VL)** = co-ordination of movement (relay-motor)",
                  "ventral posterior แยกเป็นสองนิวเคลียสด้านล่าง",
                  "**ventral posteromedial (VPM)** = somatic sense from head (sensory)",
                  "**ventral posterolateral nuclei (VPL)** = somatic sense from body (sensory)"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่ายที่สุดในหน้านี้คือคู่ VPM กับ VPL: **VPM = head, VPL = body**",
            "kind": "tip"
          },
          {
            "text": "สไลด์แปะลิงก์วิดีโอประกอบไว้ท้ายหน้า: https://www.youtube.com/watch?v=JiTz2i4VHFw&t=77s"
          }
        ]
      },
      {
        "heading": "Hypothalamus: แบ่งเป็น 3 regions",
        "source": "Diencephalon p.19",
        "body": [
          {
            "bullets": [
              "**anterior**",
              "**tuberal**",
              "**posterior**"
            ]
          },
          {
            "text": "สไลด์หน้านี้มีแค่ชื่อสาม region กับรูป รายละเอียดนิวเคลียสอยู่ในตารางหน้าถัดไป"
          }
        ]
      },
      {
        "heading": "ตาราง hypothalamic nuclei กับหน้าที่",
        "source": "Diencephalon p.20",
        "body": [
          {
            "text": "ตารางสามคอลัมน์ Region / Nucleus / Function เป็นสไลด์ที่มีเนื้อหาหนาที่สุดของเด็คนี้"
          },
          {
            "sub": "Anterior region",
            "body": [
              {
                "bullets": [
                  "**preoptic nucleus** = Regulates the release of gonadotropic hormones, releases **GnRH**, differential development between sexes is based upon in utero testosterone levels",
                  "**Supraoptic nucleus (SO)** = Release **oxytocin, vasopressin**",
                  "**Paraventricular nucleus (PV)** = Release **corticotropin-releasing hormone**, oxytocin, vasopressin",
                  "**Anterior hypothalamic nucleus (AH)** = **Thermoregulation (panting, sweating)**, thyrotropin inhibition, Circadian rhythms, water balance"
                ]
              }
            ]
          },
          {
            "sub": "Tuberal region",
            "body": [
              {
                "bullets": [
                  "**Dorsomedial nucleus (DM)** = Blood Pressure, Heart Rate, GI stimulation",
                  "**Ventromedial nucleus (VM)** = **satiety**, neuroendocrine control",
                  "**Arcuate nucleus (AR)** = **GHRH, Dopamine**",
                  "**Lateral hypothalamic area (LHA)** = feeding, **thirst and hunger**"
                ]
              }
            ]
          },
          {
            "sub": "Posterior region",
            "body": [
              {
                "bullets": [
                  "**Mammillary nuclei** = **memory**, limbic",
                  "**Posterior nucleus (PN)** = **Increase blood pressure, pupillary dilation, shivering**"
                ]
              }
            ]
          },
          {
            "text": "ตารางยังมีป้ายคร่อมกลุ่มหน้าที่ไว้ด้วยคือ Hormone release (กลุ่ม preoptic/SO/PV), Homeostasis และ food intake"
          },
          {
            "callout": "สไลด์ใส่เครื่องหมาย * ไว้ที่ Paraventricular nucleus* (PV) แต่ไม่มีคำอธิบายว่าดอกจันหมายถึงอะไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          },
          {
            "callout": "จับคู่ที่ตรงข้ามกันไว้: **VM = satiety** กับ **LHA = thirst and hunger / feeding** และคู่อุณหภูมิ **AH = thermoregulation (panting, sweating)** กับ **PN = shivering**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Obesity และ Narcolepsy",
        "source": "Diencephalon p.21",
        "body": [
          {
            "bullets": [
              "Obesity",
              "Narcolepsy"
            ]
          },
          {
            "callout": "สไลด์หน้านี้ต่อจากตาราง hypothalamus และมีแค่สองหัวข้อนี้กับรูป ไม่ได้เขียนกลไก ไม่ได้เขียนว่าเชื่อมกับนิวเคลียสตัวไหน สไลด์ไม่ได้บอก ตรงนี้ต้องฟังจากที่อาจารย์พูดในคาบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สไลด์ที่ไม่มีข้อความให้สรุป",
        "source": "Diencephalon p.3",
        "body": [
          {
            "text": "สไลด์ p.3, p.4, p.6, p.7, p.9, p.17, p.18 และ p.22 เป็นรูปภาพล้วน ไม่มีข้อความในสไลด์เลย ส่วน p.10 มีแค่หัวข้อ Epithalamus-thalamus-subthalamus และ p.23 คือ Questions? ปิดท้าย"
          },
          {
            "callout": "เนื้อหาที่อยู่บนภาพเปล่าเหล่านี้จึงอยู่ที่คำบรรยายในคาบเท่านั้น โน้ตนี้ไม่เดาแทน",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "neuroanat--limbic-system-nonolfactory-rhinencephalon": {
    "topic": "neuroanat--limbic-system-nonolfactory-rhinencephalon",
    "title": "Limbic System (Nonolfactory Rhinencephalon)",
    "icon": "📖",
    "lecturer": "Asst. Prof. Dr. Promporn Raksaseri",
    "summary": "เด็คนี้เป็น anatomy ล้วนของ limbic system ตามหนังสือ de Lahunta ไล่จากที่มาของชื่อ (limbus = ขอบ) แล้วแยกองค์ประกอบตามส่วนของสมองเป็น 3 ชุด คือ telencephalon (amygdaloid body, hippocampus และ fornix, septal area, cingulate gyrus และ cingulum), diencephalon (habenular nucleus, rostral thalamic nucleus, mamillary body) และ mesencephalon (intercrural nucleus) โดยแต่ละโครงสร้างบอกตำแหน่ง เส้นทางที่เชื่อมออกไป และหน้าที่สั้น ๆ เน้นด้าน emotion และ behavior เนื้อหาส่วน function ถูกให้ไว้เป็นหัวข้อสั้นมาก ไม่มีการอธิบายกลไก และไม่มีเนื้อหา clinical case เลย มีสไลด์รูปสัตว์และรูป schematic หลายแผ่นที่ไม่มีข้อความ ส่วนหน้า 8 และหน้า 9 เป็นสไลด์รูป section ของสมองที่มีแต่ชื่อ label โครงสร้าง ไม่มีคำอธิบายประกอบ และสไลด์สุดท้ายเป็น reference เล่มเดียว",
    "sections": [
      {
        "heading": "ทำไมถึงเรียกว่า Limbic System",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.2",
        "body": [
          {
            "text": "สไลด์วางกรอบไว้ก่อนว่า limbic system เกี่ยวข้องกับ **emotion และ behavior**"
          },
          {
            "bullets": [
              "**Limbus แปลว่า edge หรือ border** จึงเป็นที่มาของชื่อ",
              "ชื่อนี้อ้างถึงการจัดเรียงตัวทาง anatomy ของ telencephalic neurons และ tract ที่เรียงเป็น **two incomplete ring-like structure** บน medial aspect ของ cerebral hemisphere ตรงรอยต่อกับ diencephalon",
              "โครงสร้างของ limbic system ยังรวม major nuclei และ tract ของ rostral brainstem ที่เชื่อมกับโครงสร้าง telencephalon เหล่านั้นด้วย ซึ่ง rostral brainstem ในที่นี้คือ **diencephalon และ mesencephalon**"
            ]
          },
          {
            "callout": "สไลด์ที่แสดงภาพสัตว์ (สุนัข แมว ม้า flehmen response) เป็นรูปประกอบล้วน ไม่มีข้อความอธิบายเพิ่ม",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Background: Rhinencephalon และการแบ่ง cerebral cortex",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.3",
        "body": [
          {
            "text": "Cerebrum มี neuronal cells อยู่ 2 ที่ คือ external surface ของ gyri และ basal nuclei"
          },
          {
            "sub": "Cerebral cortex แบ่งเป็น 3 ส่วน",
            "body": [
              {
                "bullets": [
                  "**Paleopallium**: olfactory bulb, olfactory peduncle, piriform lobe",
                  "**Archipallium**: hippocampus",
                  "**Neopallium**: ส่วนที่เหลือของ cerebrum รวม gyri ที่อยู่ dorsal ต่อ rhinal sulcus"
                ]
              }
            ]
          },
          {
            "text": "**Rhinencephalon = smell brain** ประกอบด้วย olfactory component (paleopallium) และ **non-olfactory component ซึ่งก็คือ limbic system** ตรงนี้คือที่มาของชื่อเด็คว่า Nonolfactory Rhinencephalon"
          }
        ]
      },
      {
        "heading": "วงแหวนสองวงของ limbic system (Telencephalon)",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.3",
        "body": [
          {
            "text": "Limbic system ในส่วน telencephalon คือ **two cortical rings ที่ border ของ diencephalic-telencephalic junction**"
          },
          {
            "bullets": [
              "**Inner ring**: amygdaloid body, hippocampus และ fornix ของมัน",
              "**Outer ring**: cingulate gyrus และ cingulum ของมัน, septal nuclei"
            ]
          },
          {
            "callout": "จุดที่มักถูกถามเทียบกัน: basal nuclei ของ telencephalon (caudate nucleus, pallidum, putamen) ทำหน้าที่ใน extrapyramidal system ส่วน amygdaloid body และ septal nuclei ทำหน้าที่หลักใน limbic system",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Amygdaloid body และ stria terminalis",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.3",
        "body": [
          {
            "bullets": [
              "Amygdaloid body เป็น **complex of nuclei ที่อยู่ใน piriform lobe**",
              "Projection pathway ของมันเรียกว่า **stria terminalis** ซึ่งทอดอยู่ในมุมระหว่าง thalamus กับ caudate nucleus",
              "Stria terminalis เป็นรูป **incomplete C shape** ไปสิ้นสุดที่ septal area (ใน septum pellucidum) และ rostral hypothalamus"
            ]
          },
          {
            "sub": "Amygdala: emotion of smells",
            "body": [
              {
                "bullets": [
                  "control of **fear and anger**",
                  "control of **sexual behavior**",
                  "control of **food and water intake**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hippocampus: รูปร่างและตำแหน่ง",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.4",
        "body": [
          {
            "bullets": [
              "เป็นโครงสร้างรูป **C shape** เริ่มจาก amygdaloid body ในแต่ละ piriform lobe แล้วทอดไปทาง caudally, dorsally แล้วจึง rostrally ข้ามเหนือ diencephalon",
              "เป็นส่วนหนึ่งของ medial และ dorsal wall ของ lateral ventricle ทางด้าน ventral และเป็นส่วนของ medial และ ventral wall ของ lateral ventricle ทางด้าน dorsal",
              "วางตัวติดกับ **lateral geniculate nucleus**",
              "Dorsal ต่อ caudal thalamus มี **hippocampal commissure** อยู่ที่ median plane เกิดจาก hippocampus ของ cerebral hemisphere ทั้งสองข้าง",
              "บน ventral surface ของสมอง caudal ต่อ piriform lobe hippocampus ถูกคลุมด้วย **parahippocampal gyrus (PHG)** ซึ่งมีขอบด้าน lateral เป็น caudal lateral rhinal sulcus",
              "PHG ทอดต่อขึ้นไปทาง dorsal เหนือ corpus callosum กลายเป็น **cingulate gyrus**"
            ]
          }
        ]
      },
      {
        "heading": "Fornix: ทางเดิน axon ของ hippocampus",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.4",
        "body": [
          {
            "bullets": [
              "Axon เรียงตัวตาม lateral side ของ hippocampus เกิดเป็น **fimbria** แล้วแยกออกจาก hippocampus เป็น **crus of the fornix**",
              "Crura ทั้งสองข้างมาบรรจบกัน rostral ต่อ hippocampal commissure แล้วทอดต่อไปทาง rostral เป็น **body of fornix**",
              "Body of fornix สั้น และอยู่ dorsal ต่อ rostral commissure จากนั้นโค้งลงทาง ventral แยกออกเป็น **2 columns of fornix**",
              "แต่ละข้างแตกเป็น 2 มัด: มัดเล็ก **pre-commissural fiber** ทอดไปทาง rostral เข้าสู่ septal area และมัดใหญ่ **post-commissural fiber** ทอดไป caudal ต่อ rostral commissure แล้วลง ventral สู่ hypothalamus ไปสิ้นสุดที่ **mamillary body (MB)**"
            ]
          },
          {
            "callout": "สไลด์ถัดจากนี้ในหน้าเดียวกันเป็นภาพ schematic ของ hippocampus และ fornix ที่ไม่มีข้อความบรรยาย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หน้าที่ของ Hippocampus",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.5",
        "body": [
          {
            "bullets": [
              "**memories และ learning** โดยเฉพาะการแปลง short-term memories ไปเป็น long-term memories",
              "**emotions expression และ rage** โดยมี inhibitory effect ต่อ rage (violence) ที่ hypothalamus และ frontal lobe"
            ]
          },
          {
            "callout": "สไลด์เขียนคำว่า Rabies ไว้ข้างหน้าที่ข้อ rage พร้อมลิงก์ภายนอก แต่ **สไลด์ไม่ได้บอก** ว่า rabies เกี่ยวข้องกับ hippocampus อย่างไร ไม่มีคำอธิบายกลไกหรือรอยโรคใด ๆ ในเด็คนี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Septal area",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.5",
        "body": [
          {
            "text": "อยู่ที่ **medial surface ของ cerebral hemisphere** ประกอบด้วย 2 ส่วน"
          },
          {
            "bullets": [
              "**Subcallosal area** คือ cerebral cortex ที่อยู่ ventral ต่อ genu ของ corpus callosum",
              "**Septal nuclei** คือ neuronal cell bodies ใน rostral septum pellucidum"
            ]
          },
          {
            "text": "Septum pellucidum ยึด body และส่วน proximal ของ fornix ไว้กับ corpus callosum และ rostral ต่อ septum pellucidum จะพบ neuronal cells ของ septal nuclei"
          },
          {
            "sub": "การเชื่อมต่อของ septal area",
            "body": [
              {
                "bullets": [
                  "เชื่อมกับ hippocampus ด้วย **column of the fornix**",
                  "เชื่อมกับ amygdaloid body ด้วย **stria terminalis**",
                  "เชื่อมกับ habenular nucleus ผ่าน **stria habenularis thalamus**",
                  "เชื่อมกับ hypothalamus ด้วย **medial forebrain bundle (MFB)**"
                ]
              },
              {
                "text": "เพราะเส้นทาง MFB นี้ limbic system จึงมีอิทธิพลต่อ hypothalamic centers ที่ควบคุมการทำงานของ **general visceral efferent (GVE) system** โดย hypothalamic nuclei ทำหน้าที่เป็น upper motor neuron ที่ regulate GVE และรับ efferents จาก limbic system จำนวนมาก"
              },
              {
                "text": "หน้าที่: เป็น **pleasure center** เกี่ยวกับ pleasure และ emotion (sexual behavior และ aggression)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Cingulate gyrus และ cingulum",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.6",
        "body": [
          {
            "bullets": [
              "Cingulate gyrus ประกอบด้วย cerebral cortex และ cingulum ของมัน (corona radiata)",
              "อยู่ **dorsal ต่อ corpus callosum**",
              "ต่อเนื่องไปทาง caudal กับ parahippocampal gyrus และทาง rostral กับ septal area",
              "**Cingulum เป็น long association tract** ประกอบด้วย longitudinal axons ใน white matter (corona radiata) ของ cingulate gyrus โดย axon เหล่านี้ทอดจาก parahippocampal gyrus ไปยัง septal area และ frontal lobe gyri",
              "หน้าที่: **aggressive behaviors, maternal behavior และ behaviors ที่เกี่ยวกับ pain memories**"
            ]
          }
        ]
      },
      {
        "heading": "Limbic system ส่วน Diencephalon: habenular nucleus และ rostral thalamic nucleus",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.6",
        "body": [
          {
            "text": "ใน diencephalon ตัวที่ทำหน้าที่หลักใน limbic system คือ **epithalamic habenular nucleus และ rostral thalamic nuclei**"
          },
          {
            "bullets": [
              "Habenular nucleus เป็นส่วนหนึ่งของ **epithalamus**",
              "ติดต่อกับ septal nuclei ผ่าน **stria habenularis thalami** ซึ่งวางตัวชิดกับส่วน dorsal ของ third ventricle",
              "Habenular nucleus (HB) เชื่อมกับ **intercrural nucleus (IC) ของ mesencephalon ผ่าน habenulointercrural tract (HIC)**",
              "Rostral thalamic nucleus (RT) รับ afferents จาก mammillary body ของ hypothalamus ผ่าน **mamillothalamic tract (MT)**",
              "RT ส่ง projection ไปที่ **cingulate gyrus** เป็นหลัก"
            ]
          }
        ]
      },
      {
        "heading": "Mamillary body",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.6",
        "body": [
          {
            "text": "เป็น **limbic system component ของ hypothalamus**"
          },
          {
            "bullets": [
              "อยู่เป็นคู่ที่ ventral midline ในส่วนที่ caudal ที่สุดของ hypothalamus",
              "โป่งออกมาจาก ventral surface ของ hypothalamus ตรงตำแหน่ง **caudal ต่อ infundibulum**",
              "เชื่อมกับ hippocampus ด้วย **column of fornix**",
              "เชื่อมกับ rostral thalamic nucleus ผ่าน **mammillothalamic tract**",
              "เชื่อมกับ mesencephalic tegmentum และ visceral motor nuclei ใน medulla ผ่าน **mamillotegmental tract**",
              "**Mammillary peduncle** เชื่อมไปทาง caudal กับ mesencephalic intercrural nucleus"
            ]
          }
        ]
      },
      {
        "heading": "Limbic system ส่วน Mesencephalon: intercrural nucleus",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.7",
        "body": [
          {
            "bullets": [
              "อยู่ทาง ventral ติดกับ **intercrural fossa ระหว่าง crus cerebri สองข้าง** บน ventral surface ของ mesencephalon",
              "เชื่อมกับ HB ผ่าน **habenulointercrural tract**",
              "เชื่อมกับ mammillary body ผ่าน **mamillary peduncle**",
              "เชื่อมกับ **reticular formation ใน brainstem** ซึ่งมีอิทธิพลต่อ visceral motor nuclei และ **GVE lower motor neuron ใน medulla**"
            ]
          }
        ]
      },
      {
        "heading": "สไลด์รูปที่มีแต่ชื่อ label และ reference",
        "source": "Limbic System (Nonolfactory Rhinencephalon) p.7-9",
        "body": [
          {
            "text": "สองหน้าท้ายเด็คเป็นภาพ specimen และ section ของสมองที่มีเฉพาะชื่อ label ไม่มีข้อความบรรยาย ควรใช้ฝึกชี้โครงสร้างจากสไลด์จริง ชื่อที่ปรากฏ ได้แก่"
          },
          {
            "bullets": [
              "ภาพตัด midbrain X-section: lateral ventricle, internal capsule, optic tract, caudate nucleus, crus of fornix, parahippocampal gyrus, cerebral peduncle, crus cerebri, cerebral aqueduct, third ventricle",
              "ภาพ medial และ dorsal view: cingulate gyrus, cingulum, corpus callosum (รวมภาพ corpus callosum flip), fornix, body of fornix, hippocampal commissure, hippocampus, thalamus, mammillary body",
              "ภาพ ventral และ lateral view: olfactory bulb, olfactory peduncle, olfactory tract, lateral rhinal sulcus, amygdala, frontal lobe, parietal lobe, temporal lobe, occipital lobe, rostral colliculus, cerebellar vermis, paramedian lobule, ansiform lobule"
            ]
          },
          {
            "callout": "หน้า 9 เพิ่ม label ชุด septum pellucidum, septal nuclei, dentate gyrus, fornix (body/crus/column), stria habinularis thalami, pineal gland, rostral commissure, hypothalamus, mammillary body, caudal colliculus, middle cerebellar peduncle, 4th ventricle, dorsal acoustic stria, splenial sulcus, colossal sulcus",
            "kind": "tip"
          },
          {
            "text": "Reference ที่สไลด์ให้ไว้เล่มเดียว (อยู่ในสไลด์สุดท้ายของหน้า 7) คือ De Lahunta A, Glass E, and Kent M 2021. Nonolfactory Rhinencephalon: Limbic System In: Veterinary neuroanatomy and clinical neurology 5th ed. Saunders Elsevier 471-476"
          }
        ]
      }
    ]
  },
  "neuroanat--metencephalon": {
    "topic": "neuroanat--metencephalon",
    "title": "Metencephalon",
    "icon": "📖",
    "lecturer": "Damri Darawiroj",
    "summary": "เด็คนี้ครอบคลุม Metencephalon ทั้งสองส่วน คือ cerebellum (dorsal) และ pons (ventral) โดยเน้นที่ cerebellum เป็นหลัก ไล่ตั้งแต่การแบ่งแบบ developmental, anatomical และ functional classification, cerebellar nuclei พร้อม afferent/efferent, lobules, peduncles, afferent/efferent tracts, หน้าที่ ไปจนถึง cerebellar disorders แล้วจึงต่อด้วย pons แยกเป็น ventral (basal) portion และ dorsal portion (pontine tegmentum) ปิดท้ายด้วย Laboratory Guide 6 สไลด์ที่เป็นภาพติดป้ายชื่อโครงสร้างล้วน ไม่มีคำบรรยาย ข้อควรรู้คือมีสไลด์ที่เป็นภาพล้วนไม่มีข้อความอยู่หลายหน้า (p.12, 14, 16, 21, 27) และอีกหลายหน้าเป็นเพียง label ของรูป เช่น p.6, 9, 10, 15, 17, 25, 29, 31 เนื้อหาที่เป็นตัวหนังสือจริงจึงกระจุกอยู่ไม่กี่สไลด์",
    "sections": [
      {
        "heading": "Metencephalon อยู่ตรงไหนใน Rhombencephalon",
        "source": "Metencephalon p.2",
        "body": [
          {
            "text": "สไลด์เปิดด้วยการวางตำแหน่งก่อนว่า **Rhombencephalon ประกอบด้วย Metencephalon และ Myelencephalon** แล้วจึงแตก Metencephalon ออกเป็นสองส่วนตามทิศทาง"
          },
          {
            "bullets": [
              "Metencephalon: **Dorsal portion คือ Cerebellum, Ventral portion คือ Pons**",
              "Myelencephalon: Medulla oblongata",
              "Fourth ventricle"
            ]
          },
          {
            "text": "สไลด์เขียน Fourth ventricle ไว้เป็นหัวข้อคู่กันในระดับเดียวกับ Metencephalon และ Myelencephalon แต่ไม่ได้อธิบายรายละเอียดต่อในหน้านี้"
          }
        ]
      },
      {
        "heading": "โครงสร้างมหภาคของ cerebellum และเยื่อหุ้มรอบ ๆ",
        "source": "Metencephalon p.3-4",
        "body": [
          {
            "sub": "p.3 โครงสร้างที่อยู่รอบ cerebellum",
            "body": [
              {
                "bullets": [
                  "Occipital bone",
                  "Tentorium ossium",
                  "Tentorium cerebelli"
                ]
              },
              {
                "text": "สไลด์นี้เป็นภาพติดป้ายชื่อ ไม่มีคำอธิบายความสัมพันธ์ของทั้งสามโครงสร้าง"
              }
            ]
          },
          {
            "sub": "p.4 เนื้อ cerebellum",
            "body": [
              {
                "text": "หัวข้อสไลด์เขียนว่า **Cerebellar cortex and cerebellar medullarae** แล้วติดป้ายโครงสร้างต่อไปนี้"
              },
              {
                "bullets": [
                  "Folium และ Sulcus",
                  "**Arbor Vitae**",
                  "Fourth ventricle"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Developmental classification",
        "source": "Metencephalon p.5-6",
        "body": [
          {
            "text": "แบ่งตามพัฒนาการ ได้ 3 ส่วน จับคู่ตรง ๆ กับ lobe"
          },
          {
            "bullets": [
              "**Archicerebellum คือ Flocculonodular lobe**",
              "**Paleocerebellum คือ Rostral lobe**",
              "**Neocerebellum คือ Caudal lobe**"
            ]
          },
          {
            "text": "p.6 เป็นภาพติดป้าย Caudal lobe, Flocculonodular lobe และ Rostral lobe ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "Anatomical classification",
        "source": "Metencephalon p.7",
        "body": [
          {
            "sub": "External structures",
            "body": [
              {
                "bullets": [
                  "Hemispheres",
                  "Vermis",
                  "**Cerebellar peduncles: Rostral / Middle / Caudal**"
                ]
              }
            ]
          },
          {
            "sub": "Internal structures",
            "body": [
              {
                "text": "คือ **Cerebellar nuclei** ได้แก่ **Fastigial / Interposital / Dentate (lateral) nucleus**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Cerebellar nuclei กับ afferent และ efferent ของแต่ละนิวเคลียส",
        "source": "Metencephalon p.8",
        "body": [
          {
            "text": "สไลด์นี้จับคู่ nucleus แต่ละตัวกับโซนของ cerebellum ที่มันสังกัด แล้วไล่ afferent กับ efferent ให้ครบ เป็นสไลด์ที่มีข้อมูลแน่นที่สุดของเด็ค"
          },
          {
            "sub": "Fastigial nucleus (Vermis)",
            "body": [
              {
                "bullets": [
                  "Afferent: **Vestibular nuclei ผ่าน Vestibulocerebellar tract**",
                  "Efferent: Vestibular nuclei และ **Reticular formation (RF) of pons and medulla**"
                ]
              }
            ]
          },
          {
            "sub": "Interposital nucleus (Paravermis)",
            "body": [
              {
                "bullets": [
                  "Afferent: **Spinal cord และ Medulla oblongata ผ่าน Spinocerebellar tract**",
                  "Efferent: **red nucleus, RF of midbrain**"
                ]
              }
            ]
          },
          {
            "sub": "Dentate nucleus (Cerebellar hemisphere)",
            "body": [
              {
                "bullets": [
                  "Afferent: **Pons ผ่าน Pontocerebellar tract**",
                  "Efferent: **thalamus**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Functional zones และ Functional classification",
        "source": "Metencephalon p.9-11",
        "body": [
          {
            "text": "p.9 และ p.10 เป็นภาพ Functional zones of the cerebellum ติดป้ายเพียง 3 คำคือ Hemisphere, Paravermis, Vermis ส่วนเนื้อหาจริงอยู่ที่ p.11"
          },
          {
            "sub": "Cerebellar hemispheres คือ Cerebro-cerebellum (D)",
            "body": [
              {
                "text": "**Control voluntary movement ในแง่ direction, timing และ force**"
              }
            ]
          },
          {
            "sub": "Vermis + Paravermis คือ Spino-cerebellum (F & I)",
            "body": [
              {
                "bullets": [
                  "**Regulate muscle tone**",
                  "**Unconscious motor movement for posture and gait**",
                  "สไลด์ทำดาวกำกับคำว่า **PROPRIOCEPTION** ไว้ที่โซนนี้"
                ]
              }
            ]
          },
          {
            "sub": "Flocculonodular lobe คือ Vestibulo-cerebellum (F)",
            "body": [
              {
                "bullets": [
                  "**Maintain body balance**",
                  "**Coordinating movement of head and eyes**",
                  "สไลด์ทำดาวกำกับคำว่า **NYSTAGMUS** ไว้ที่โซนนี้"
                ]
              }
            ]
          },
          {
            "callout": "อักษรย่อในวงเล็บ (D), (F & I), (F) ที่กำกับแต่ละโซนไว้ สไลด์ไม่ได้บอกว่าย่อมาจากอะไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cerebellar lobules และ fissures",
        "source": "Metencephalon p.13, p.15",
        "body": [
          {
            "sub": "Vermis (9 lobules) จาก p.13",
            "body": [
              {
                "bullets": [
                  "Lingula cerebelli",
                  "Lobular centralis",
                  "Culmen",
                  "Declive",
                  "Folium",
                  "Tuber",
                  "Pyramis",
                  "Uvula",
                  "Nodulus"
                ]
              }
            ]
          },
          {
            "sub": "Cerebellar hemispheres (5 lobules) จาก p.13",
            "body": [
              {
                "bullets": [
                  "Flocculus",
                  "Paraflocculus",
                  "Paramedian lobule",
                  "Ansiform lobule",
                  "Simplex lobule"
                ]
              }
            ]
          },
          {
            "sub": "fissures ที่ติดป้ายไว้บนภาพ p.15",
            "body": [
              {
                "bullets": [
                  "**Primary fissure**",
                  "Preculmenta fissure",
                  "**Prepyramidal fissure**",
                  "**Secondary fissure**",
                  "**Caudolateral fissure**"
                ]
              },
              {
                "text": "p.15 ติดป้าย lobule เรียงคู่กับ fissure เหล่านี้ด้วย ได้แก่ Culmen, Central, Folium, Tuber, Declive, Pyramis, Uvula, Lingula, Nodulus และ Rostral medullary velum จำง่ายที่สุดคือดูภาพประกอบ เพราะสไลด์ไม่ได้เขียนลำดับเป็นข้อความ"
              }
            ]
          },
          {
            "callout": "p.12, p.14 และ p.16 เป็นสไลด์ที่ไม่มีข้อความเลย ในไฟล์ข้อความว่างทั้งหน้า",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cerebellar peduncles ทั้งสามคู่",
        "source": "Metencephalon p.17-18",
        "body": [
          {
            "text": "p.17 เป็นภาพติดป้ายเพียง Rostral, middle, caudal ส่วนเนื้อหาอยู่ที่ p.18 ซึ่งบอกทั้งว่าแต่ละ peduncle เชื่อมกับที่ใด และมี fiber อะไรวิ่งเข้าออก"
          },
          {
            "sub": "Rostral cerebellar peduncle: Midbrain and forebrain",
            "body": [
              {
                "bullets": [
                  "Afferent fiber จาก **ventral spinocerebellar tract**",
                  "Efferent fiber จาก **Interposital nucleus ไป red nucleus และ RF of midbrain** (สไลด์ทำดาวกำกับข้อนี้)",
                  "Efferent fiber จาก **Dentate nucleus ไป thalamus และ cerebral cortex**"
                ]
              }
            ]
          },
          {
            "sub": "Middle cerebellar peduncle: Pons",
            "body": [
              {
                "text": "Afferent fiber จาก **contralateral pontine nucleus** มาในรูป **transverse fiber of pons (pontocerebellar tract)**"
              }
            ]
          },
          {
            "sub": "Caudal cerebellar peduncle: Medulla oblongata / spinal cord",
            "body": [
              {
                "bullets": [
                  "Afferent fiber จาก **lateral cuneate nucleus, vestibular nuclei และ olivary nucleus (climbing fiber)** (สไลด์ทำดาวกำกับข้อนี้)",
                  "Efferent fiber จาก **Fastigial nucleus ไป RF และ vestibular nuclei**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Afferent tract to cerebellum",
        "source": "Metencephalon p.19",
        "body": [
          {
            "bullets": [
              "**Pontocerebellar tract: motor planning**",
              "**Vestibulocerebellar tract: control eye-head-neck movements**",
              "**Dorsal spinocerebellar tract และ Ventral spinocerebellar tract: proprioception from hindlimb และ caudal half of the body**",
              "**Rostral spinocerebellar tract และ Cuneocerebellar tract: proprioception from forelimb และ cranial half of the body**",
              "**Cervicospinocerebellar tract: proprioception from head and neck**"
            ]
          },
          {
            "text": "สไลด์นี้จัดเป็นคอลัมน์ให้ tract คู่บนแชร์คำอธิบายเดียวกัน จึงต้องอ่านเป็นคู่ ไม่ใช่ทีละบรรทัด"
          }
        ]
      },
      {
        "heading": "Efferent tract from cerebellum",
        "source": "Metencephalon p.20",
        "body": [
          {
            "bullets": [
              "To **red nucleus**",
              "To **thalamus (and cerebrum)**",
              "To **reticular formation**",
              "To **vestibular nuclei**"
            ]
          },
          {
            "text": "สไลด์เขียนคำว่า Medulla oblongata กำกับไว้ข้างสองข้อล่าง แต่ไม่ได้อธิบายเพิ่มว่าหมายถึงอะไร"
          }
        ]
      },
      {
        "heading": "Cerebellar functions",
        "source": "Metencephalon p.22-23",
        "body": [
          {
            "text": "สองสไลด์นี้เขียนข้อความเหมือนกันทุกตัวอักษร ต่างกันแค่ภาพประกอบ"
          },
          {
            "bullets": [
              "**Coordination of movement**",
              "**Maintain posture and muscle tone**"
            ]
          },
          {
            "callout": "p.21 เป็นสไลด์ที่ไม่มีข้อความเลย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cerebellar disorders",
        "source": "Metencephalon p.24-25",
        "body": [
          {
            "sub": "Cerebellar Ataxia",
            "body": [
              {
                "text": "สไลด์นิยามว่า **loss of balance (sensory dysfunction)** และเน้นว่าเป็น **an incoordination of movements โดยไม่มี paresis หรือ weakness**"
              },
              {
                "bullets": [
                  "**Wide-based stance, Swaying**",
                  "**An abnormal range and force of movements เรียกว่า dysmetria**",
                  "**Hypermetria (too long) หรือ goose gait**",
                  "**Hypometria (too short)**"
                ]
              }
            ]
          },
          {
            "sub": "Intention tremor",
            "body": [
              {
                "text": "**Involuntary shaking during movement** สไลด์ยกตัวอย่างว่า **overshoot หรือ undershoot ตอนกินหรือดื่ม**"
              }
            ]
          },
          {
            "sub": "Decerebellate rigidity (Opisthotonus)",
            "body": [
              {
                "bullets": [
                  "**Dorsal extension of the head**",
                  "**Extension of thoracic limbs**",
                  "**Flexion of hip / Extension of hind limb**"
                ]
              }
            ]
          },
          {
            "sub": "อาการที่ติดป้ายไว้บนภาพ p.25",
            "body": [
              {
                "bullets": [
                  "Abnormal gait",
                  "Wide-base stance",
                  "Head-tilt",
                  "Swaying",
                  "Falling",
                  "Nystagmus",
                  "Tremor"
                ]
              },
              {
                "text": "p.25 แนบลิงก์วิดีโอ YouTube ไว้ 3 ลิงก์ อันหนึ่งชื่อ Neurological Disease. Cerebellar Ataxia in an older poodle สไลด์ไม่ได้เขียนคำบรรยายวิดีโอไว้"
              }
            ]
          }
        ]
      },
      {
        "heading": "PONS ภาพรวม",
        "source": "Metencephalon p.26",
        "body": [
          {
            "text": "สไลด์เปิดหัวข้อว่า **PONS (ventral metencephalon)** แล้วแบ่ง pons ออกเป็นสองส่วนตามภาพ"
          },
          {
            "bullets": [
              "**Dorsal portion (tegmentum)**",
              "**Ventral (basal) portion**",
              "Medial lemniscus (ติดป้ายไว้บนภาพ)"
            ]
          },
          {
            "callout": "p.27 เป็นสไลด์ที่ไม่มีข้อความเลย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Ventral (basal) portion ของ pons",
        "source": "Metencephalon p.28-29",
        "body": [
          {
            "sub": "Fibers (tract)",
            "body": [
              {
                "bullets": [
                  "**Transverse fibers of pons: จาก pontine nuclei ไป cerebellum ผ่าน middle cerebellar peduncle**",
                  "**Longitudinal fiber of pons: จาก cerebral cortex ไป pontine nuclei และ medulla oblongata**"
                ]
              }
            ]
          },
          {
            "sub": "Nuclei",
            "body": [
              {
                "text": "**Pontine nuclei** สไลด์อธิบายว่า **fibers จาก cerebral cortex มา synapse แล้ว decussate ไป cerebellum**"
              }
            ]
          },
          {
            "text": "p.29 เป็นภาพติดป้าย Rostral cerebellar peduncle, Middle cerebellar peduncle, RF, Pontine nuclei, Transverse fibers of pons, Lateral lemniscus และ Longitudinal fibers of pons โดยอ้างที่มาภาพจาก vanat.cvm.umn.edu"
          }
        ]
      },
      {
        "heading": "Dorsal portion หรือ Pontine tegmentum",
        "source": "Metencephalon p.30-31",
        "body": [
          {
            "sub": "Fiber (tract)",
            "body": [
              {
                "bullets": [
                  "**Lateral lemniscus: ascending fiber จาก cochlear nuclei และ dorsal trapezoid nucleus ไป midbrain เป็น auditory system**",
                  "**Medial lemniscus: decussated axon จาก nucleus gracilis และ nucleus cuneatus**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ทำดาวสองดวงกำกับนิยามไว้ว่า lemniscus = crossed sensory fibers ส่วน decussation = crossed motor fibers",
            "kind": "tip"
          },
          {
            "sub": "Nuclei",
            "body": [
              {
                "bullets": [
                  "**(Pontine) reticular formation nuclei ให้ pontine reticulospinal tract และเป็นที่ตั้งของ pneumotaxic center, micturition center, sleep center**",
                  "**Sensory nuclei of CN V: touch and pressure**",
                  "**Nucleus of spinal tract of CN V: pain & temperature**",
                  "**Motor nuclei of CN V: muscles of mastication**",
                  "**Mesencephalic nucleus of CN V: proprioception**"
                ]
              }
            ]
          },
          {
            "text": "p.31 เป็นภาพติดป้าย RF, transverse fiber, longitudinal fiber, sensory nucleus of CN V, CN V, motor nucleus of CN V, lateral lemniscus และ medial lemniscus ซึ่งตรงกับรายการข้างบน"
          }
        ]
      },
      {
        "heading": "Cerebellum & Pons Laboratory Guide",
        "source": "Metencephalon p.32-37",
        "body": [
          {
            "text": "หกสไลด์สุดท้ายเป็น Laboratory Guide ทั้งหมดเป็นภาพติดป้ายชื่อโครงสร้าง ไม่มีคำบรรยายหรือคำถามใด ๆ ใช้เป็นเช็กลิสต์ว่าต้องชี้อะไรได้บ้างในแล็บ"
          },
          {
            "sub": "p.33",
            "body": [
              {
                "bullets": [
                  "Ventral paraflocculus, Flocculus",
                  "CN IX, CN X, CN XI",
                  "Spinal tract of CN V",
                  "Crus cerebri, CN V, CN VII, CN VIII, Trapezoid body"
                ]
              }
            ]
          },
          {
            "sub": "p.34 X-section ระดับ pyramids",
            "body": [
              {
                "bullets": [
                  "Cerebellar vermis, Cerebellar hemisphere",
                  "**Cerebellar cortex, Cerebellar medulla, Cerebellar nuclei**",
                  "Caudal cerebellar peduncle",
                  "Pyramids, Nodulus, Fourth ventricle"
                ]
              }
            ]
          },
          {
            "sub": "p.35 lobules และ fissures ของ vermis",
            "body": [
              {
                "text": "ติดป้าย Folium, Declive, 1o fissure, Tuber, Prepyramidal fissure, Pyramis, 2o fissure, Uvula, Caudolateral fissure, Nodulus, Culmen, Central และ Lingula ซึ่งเป็นชุดเดียวกับ p.15"
              }
            ]
          },
          {
            "sub": "p.36 มุมมองที่เห็น lobe และ hemisphere",
            "body": [
              {
                "bullets": [
                  "Rostral colliculus, Lobulus simplex",
                  "Paramedian lobule, Ansiform lobule",
                  "Brachium of caudal colliculus, Lateral lemniscus",
                  "Dorsal paraflocculus, Flocculus, Ventral paraflocculus, Pons"
                ]
              }
            ]
          },
          {
            "sub": "p.37",
            "body": [
              {
                "bullets": [
                  "**Primary fissure, Secondary fissure, Caudolateral fissure**",
                  "**Cranial lobe, Caudal lobe, Flocculonodular lobe (Nodulus)**",
                  "Rostral medullary velum, Midbrain, Fourth ventricle",
                  "Transverse fiber of pons, longitudinal fiber of pons"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "neuroanat--midbrain": {
    "topic": "neuroanat--midbrain",
    "title": "Midbrain (Mesencephalon)",
    "icon": "📖",
    "summary": "เด็คนี้ไล่ midbrain แบบกายวิภาคล้วน เริ่มจาก development แล้วต่อด้วยขอบเขต dorsal/ventral, โครงสร้างภายใน 4 ส่วน (aqueduct, tectum, tegmentum, cerebral peduncle), รายละเอียดของ tectum (rostral/caudal colliculi กับ reflex ที่คุม), nuclei ใน tegmentum (reticular formation, CN III, Edinger Wesphal, CN IV, mesencephalic nucleus ของ CN V, red nucleus, PAG, substantia nigra), องค์ประกอบของ crus cerebri และปิดท้ายด้วย clinical correlations 1 สไลด์ ประมาณ 12 จาก 28 สไลด์เป็นภาพหรือ label ล้วน (หน้า 4, 6, 9, 13, 14, 15, 17, 18, 19, 21, 23, 28) จึงไม่มีคำอธิบายเป็นข้อความให้จด สไลด์ไม่ได้ลงรายละเอียดกลไกหรือการรักษาใด ๆ",
    "sections": [
      {
        "heading": "Development ของ midbrain",
        "source": "Midbrain p.2",
        "body": [
          {
            "text": "สไลด์หัวข้อ development ให้ข้อความไว้คำเดียวคือ **Cerebral/Mesencephalic Aqueduct**"
          },
          {
            "text": "ส่วนขั้นตอนการพัฒนา (จาก vesicle ไหน แบ่งอย่างไร) สไลด์ไม่ได้บอกเป็นข้อความ หน้านี้เป็นภาพประกอบ"
          }
        ]
      },
      {
        "heading": "ตำแหน่งของ midbrain: dorsal part",
        "source": "Midbrain p.3",
        "body": [
          {
            "text": "Midbrain วางตัวอยู่ **ระหว่าง diencephalon กับ pons**"
          },
          {
            "sub": "ขอบเขตด้าน dorsal",
            "body": [
              {
                "bullets": [
                  "Cranial: caudal commissure / pineal gland",
                  "Caudal: rostral cerebellar peduncle"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่อยู่ด้าน dorsal",
            "body": [
              {
                "bullets": [
                  "**Corpora quadrigemina** ประกอบด้วย rostral colliculi และ caudal colliculi",
                  "Rostral colliculi: visual reflex",
                  "Caudal colliculi: auditory reflex",
                  "Trochlear nerve (CN IV) สไลด์จัดไว้ในรายการของ dorsal part"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ตำแหน่งของ midbrain: ventral part",
        "source": "Midbrain p.5",
        "body": [
          {
            "sub": "ขอบเขตด้าน ventral",
            "body": [
              {
                "bullets": [
                  "Cranial: mammillary body",
                  "Caudal: pons"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่อยู่ด้าน ventral",
            "body": [
              {
                "bullets": [
                  "Cerebral peduncle และ Interpeduncular fossa",
                  "**Oculomotor nerve (CN III)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โครงสร้างภายใน midbrain",
        "source": "Midbrain p.7",
        "body": [
          {
            "bullets": [
              "Cerebral (mesencephalic) aqueduct",
              "Tectum",
              "Tegmentum",
              "**Cerebral peduncle** ซึ่งสไลด์แจกแจงว่าประกอบด้วย Substantia nigra และ Crus cerebri"
            ]
          },
          {
            "callout": "สไลด์ใช้คำว่า cerebral peduncle สองแบบ หน้า 6 พาดหัวภาพว่า Cerebral peduncle (crus cerebri) เหมือนเป็นคำเดียวกัน แต่หน้า 7 แยกว่า cerebral peduncle = substantia nigra + crus cerebri ตอนตอบข้อสอบให้ดูว่าโจทย์ถามตามสไลด์หน้าไหน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Tectum: rostral และ caudal colliculi",
        "source": "Midbrain p.8",
        "body": [
          {
            "sub": "Rostral colliculi",
            "body": [
              {
                "bullets": [
                  "Commissure of rostral colliculi",
                  "Brachium of rostral colliculi ไปยัง **lateral geniculate body**",
                  "Visual reflex: pupillary light reflex, lens accommodation, menace response, dazzle reflex (medial tectospinal tract)"
                ]
              }
            ]
          },
          {
            "sub": "Caudal colliculi",
            "body": [
              {
                "bullets": [
                  "Commissure of caudal colliculi",
                  "Brachium of caudal colliculi ไปยัง **medial geniculate body**",
                  "Auditory reflex: acoustic startle reflex (turn head to loud sound/noise) และ middle ear reflex (medial tectospinal tract)"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ต้องจำให้ไม่สลับกัน คือ rostral colliculus คู่กับ lateral geniculate body และงานเห็น ส่วน caudal colliculus คู่กับ medial geniculate body และงานได้ยิน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ภาพ auditory pathway (label ล้วน)",
        "source": "Midbrain p.9",
        "body": [
          {
            "text": "หน้านี้เป็นภาพ มี label ดังนี้ ไม่มีคำอธิบายเป็นข้อความ"
          },
          {
            "bullets": [
              "Medial geniculate body",
              "Caudal colliculus",
              "Trapezoid nuclei",
              "Cochlear nuclei",
              "Lateral lemniscus"
            ]
          }
        ]
      },
      {
        "heading": "Tegmentum และของที่อยู่ในนั้น",
        "source": "Midbrain p.10",
        "body": [
          {
            "text": "Tegmentum คือ **core ของ midbrain**"
          },
          {
            "bullets": [
              "Reticular formation: consciousness",
              "Oculomotor nuclei (motor nuclei of CN III)",
              "Edinger Wesphal (parasympathetic nuclei of CN III)",
              "Trochlear nuclei",
              "Mesencephalic nuclei of CN V (proprioception from head & neck)",
              "Red nucleus",
              "Periaqueductal gray",
              "Substantia nigra"
            ]
          }
        ]
      },
      {
        "heading": "Reticular formation (RF)",
        "source": "Midbrain p.11",
        "body": [
          {
            "bullets": [
              "เป็น mixture ของ fibers และ neurons อยู่ในบริเวณ core ขนาดใหญ่ของ brain stem โครงสร้างแบบ ill-defined organization",
              "Dendrites ของ RF synapse กับ **ทุก ascending และ descending axon** ที่ผ่านบริเวณนี้",
              "Axons ของ RF ไปได้กว้างทั่ว CNS ทั้ง CN nuclei, thalamus และ spinal cord",
              "หน้าที่คือ integrate สัญญาณ sensory และ motor เพื่อควบคุม viscera, posture, locomotion และ state of consciousness",
              "Efferent RF fiber ที่ไปยัง cerebral cortex เรียกว่า **ascending reticular activating system (ARAS)** ดูแล sleep-wake cycle และ state of consciousness"
            ]
          }
        ]
      },
      {
        "heading": "Oculomotor nucleus และ Edinger Wesphal nucleus",
        "source": "Midbrain p.12",
        "body": [
          {
            "sub": "Oculomotor nucleus (motor nucleus of CN III)",
            "body": [
              {
                "bullets": [
                  "อยู่ **ventral ต่อ periaqueductal gray ที่ระดับ rostral colliculi**",
                  "Innervate dorsal rectus, ventral rectus, medial rectus และ ventral oblique muscle ของตา"
                ]
              }
            ]
          },
          {
            "sub": "Edinger Wesphal nucleus (parasympathetic nucleus of CN III)",
            "body": [
              {
                "bullets": [
                  "ควบคุม constrictor ciliary muscle และ constrictor pupillae of iris"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์สะกดว่า Edinger Wesphal ตามนั้น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Cross section ที่ระดับ rostral colliculi (ภาพ label)",
        "source": "Midbrain p.14-15",
        "body": [
          {
            "text": "หน้า 14 เป็นภาพชื่อ Level of rostral colliculi หน้า 15 เป็น label ของภาพเดียวกัน คำที่ปรากฏได้แก่"
          },
          {
            "bullets": [
              "Mesencephalic nuclei of CN V",
              "Medial geniculate body",
              "Brachium of caudal colliculus",
              "Spinothalamic tract",
              "Crus cerebri",
              "Rostral colliculus",
              "Periaqueductal gray",
              "RF",
              "Red nuclei"
            ]
          },
          {
            "text": "ใช้หน้านี้ฝึกชี้ตำแหน่งบนภาพตัดขวาง สไลด์ไม่ได้เขียนคำอธิบายของแต่ละ label ไว้ที่หน้านี้"
          }
        ]
      },
      {
        "heading": "Trochlear nuclei (CN IV) และ MLF",
        "source": "Midbrain p.16",
        "body": [
          {
            "bullets": [
              "พบที่ **ระดับ caudal colliculus**",
              "Fibers **decussate ใน rostral medullary velum** ก่อนโผล่ออกมาเป็น trochlear n. ที่ caudal part ของ caudal colliculus",
              "Innervate dorsal oblique muscle"
            ]
          },
          {
            "sub": "Medial Longitudinal Fasciculus (MLF)",
            "body": [
              {
                "bullets": [
                  "เป็น ascending tract ที่เชื่อม vestibular nuclei (CN VIII) เข้ากับ motor nuclei ของ **CN III, IV, VI**",
                  "ทำหน้าที่ coordinate การเคลื่อนไหวของตา"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาพระดับ caudal colliculus (label ล้วน)",
        "source": "Midbrain p.17-19",
        "body": [
          {
            "bullets": [
              "หน้า 17: ภาพชื่อ Level of caudal colliculus",
              "หน้า 18: ภาพชื่อ Level of caudal part of caudal colliculus",
              "หน้า 19: ภาพที่มี label Rostral colliculus, Medial geniculate body, Caudal colliculus และ Middle cerebellar peduncle"
            ]
          },
          {
            "text": "ทั้งสามหน้าไม่มีข้อความอธิบายเพิ่ม เป็นภาพให้ดูตำแหน่ง"
          }
        ]
      },
      {
        "heading": "Trigeminal nerve (CN V) nuclei",
        "source": "Midbrain p.20",
        "body": [
          {
            "bullets": [
              "**Mesencephalic nuclei of CN V**: proprioception ของ head อยู่ที่ border ของ periaqueductal gray",
              "**Nucleus of spinal tract of CN V**: pain และ temp จาก face, nasal และ oral cavities",
              "**Pontine sensory nucleus of CN V**: touch จาก face",
              "**Motor nucleus of CN V**: ควบคุม muscle of mastication"
            ]
          },
          {
            "callout": "หน้า 10 เขียน mesencephalic nucleus ของ CN V ว่ารับ proprioception จาก head & neck ส่วนหน้า 20 เขียนแค่ head ให้ยึดคำที่อาจารย์เขียนไว้ในสไลด์ที่โจทย์อ้างถึง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Red nucleus",
        "source": "Midbrain p.22",
        "body": [
          {
            "bullets": [
              "เป็น nucleus ที่ **highly vascularized**",
              "อยู่ที่ center ของ tegmentum ทั้งสองข้างของ midline ที่ระดับ rostral colliculus",
              "รับ axon จาก **ipsilateral motor cortex** และ **contralateral cerebellar nuclei**",
              "ส่ง axon ลง spinal cord เป็น **Rubrospinal tract** และไปยัง olivary nucleus ใน medulla oblongata เป็น **Rubro-olivary fiber**",
              "ควบคุม voluntary movement ในระบบ extrapyramidal system"
            ]
          },
          {
            "text": "หน้า 23 พาดหัวว่า Red nucleus pathway แต่เป็นภาพล้วน ไม่มีข้อความอธิบาย"
          }
        ]
      },
      {
        "heading": "Periaqueductal gray (PAG)",
        "source": "Midbrain p.24",
        "body": [
          {
            "bullets": [
              "ล้อมรอบ cerebral aqueduct",
              "เป็น small neurons ที่มี **opiate receptor**",
              "รับ input จาก hypothalamus, mammillary body, amygdala (limbic system) และ cerebral cortex",
              "ส่งสัญญาณไปยัง sympathetic, parasympathetic และ somatic motor nuclei ของ brain stem และ spinal cord โดยผ่าน reticular formation",
              "ออกฤทธิ์ต่อ pain fiber โดยหลั่ง **serotonin และ Nor-E**",
              "หน้าที่รวม: regulation ของ autonomic function (heart rate, blood pressure), emotion และ modulation of pain"
            ]
          }
        ]
      },
      {
        "heading": "Substantia nigra",
        "source": "Midbrain p.25",
        "body": [
          {
            "bullets": [
              "อยู่ **ระหว่าง red nucleus กับ crus cerebri**",
              "มี brown-to-black pigments ใน neuron",
              "สร้างและหลั่ง **dopamine**",
              "ทำงานด้าน motor movement ของ extrapyramidal system โดยควบคุม basal nuclei",
              "สไลด์ระบุความเชื่อมโยงกับ Parkinson's disease in human"
            ]
          }
        ]
      },
      {
        "heading": "Crus cerebri, interpeduncular fossa และ caudal perforated substance",
        "source": "Midbrain p.26",
        "body": [
          {
            "sub": "Crus cerebri",
            "body": [
              {
                "text": "เป็น white matter mass ที่บรรจุ **3 tracts จาก internal capsule** ได้แก่ Corticopontine, Corticonuclear และ Corticospinal tracts"
              }
            ]
          },
          {
            "sub": "Interpeduncular fossa",
            "body": [
              {
                "text": "อยู่ระหว่าง crus ซ้ายและขวา **CN III โผล่ออกจาก medial side ของ crus ในแอ่งนี้**"
              }
            ]
          },
          {
            "sub": "Caudal perforated substance",
            "body": [
              {
                "text": "สไลด์เขียนกำกับไว้เพียงว่า Caudal cerebral artery รายละเอียดอื่นสไลด์ไม่ได้บอก"
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical correlations",
        "source": "Midbrain p.27",
        "body": [
          {
            "sub": "Crus cerebri",
            "body": [
              {
                "bullets": [
                  "Sensory deficit: proprioception absent, loss of pain",
                  "Motor deficit: menace response ลบ, hyperreflexia, hypertonia",
                  "Coma จากการ block ascending จาก reticular formation (ARAS)"
                ]
              }
            ]
          },
          {
            "sub": "Oculomotor nerve",
            "body": [
              {
                "bullets": [
                  "**Ptosis, pupillary dilate, ventrolateral strabismus**"
                ]
              }
            ]
          },
          {
            "sub": "Trochlear nerve",
            "body": [
              {
                "bullets": [
                  "**Extortion ของตาข้าง ipsilateral**"
                ]
              }
            ]
          },
          {
            "sub": "Tectum",
            "body": [
              {
                "bullets": [
                  "Loss of hearing จาก lateral lemniscus และ caudal colliculus",
                  "Loss of visual และ auditory reflex จาก rostral colliculus"
                ]
              }
            ]
          },
          {
            "sub": "Tegmentum",
            "body": [
              {
                "bullets": [
                  "Disrupt ของ voluntary motor จาก red nucleus หรือ rubrospinal tract",
                  "Loss of vestibulo-ocular reflex จาก MLF"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์จัด coma (ARAS) ไว้ในกลุ่มบูลเล็ตของ crus cerebri ตามที่พิมพ์ไว้ ส่วนหน้า 28 พาดหัวว่า Ventrolateral strabismus แต่เป็นภาพล้วนไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "neuroanat--myelencephalon": {
    "topic": "neuroanat--myelencephalon",
    "title": "Myelencephalon (Medulla oblongata)",
    "icon": "📖",
    "lecturer": "Damri Darawiroj",
    "summary": "เด็คนี้ไล่ medulla oblongata ตามลำดับ external surface (dorsal, ventral, lateral) ต่อด้วย boundaries แล้วเข้า internal structure แยกเป็น nuclei 3 กลุ่ม กับ tracts จากนั้นลง nuclei ของ cranial nerve V-XII, reticular formation กับ ARAS, relay nuclei (cuneatus, gracilis, trapezoid, olivary), nucleus ambiguous, solitary nucleus และปิดท้ายด้วย fourth ventricle (ขอบเขต roof wall floor) เนื้อหาเป็น bullet ล้วน ไม่มีการอธิบาย mechanism เพิ่ม สไลด์หน้า 4 เป็นรูปกับหัวข้ออาการ (medial strabismus, facial paralysis, nystagmus) พร้อมลิงก์ YouTube โดยไม่มีข้อความอธิบายว่าอาการแต่ละอย่างมาจาก lesion ที่ไหน",
    "sections": [
      {
        "heading": "ขอบเขต (Boundaries) ของ medulla oblongata",
        "source": "Myelencephalon p.1",
        "body": [
          {
            "text": "สไลด์แบ่งขอบเขตเป็น cranial กับ caudal และให้ cranial boundary ต่างกันระหว่างด้าน dorsal กับ ventral"
          },
          {
            "bullets": [
              "Cranial boundary ด้าน Dorsal: **caudal cerebellar peduncle**",
              "Cranial boundary ด้าน Ventral: **caudal border of pons**",
              "Caudal boundary: **the 1st cervical nerve**"
            ]
          },
          {
            "callout": "สไลด์กำกับดาวไว้ว่า caudal boundary ในบางตำราใช้ **pyramidal decussation** หรือ **rootlets of CN XII** แทน 1st cervical nerve",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Dorsal external surface",
        "source": "Myelencephalon p.1",
        "body": [
          {
            "bullets": [
              "**4th ventricle** (median sulcus / sulcus limitans)",
              "**Obex**",
              "Dorsal acoustic stria",
              "**Fasciculus cuneatus** รับ signal from **C1-T5**",
              "Cuneate tubercle (lateral cuneate nucleus)",
              "**Fasciculus gracilis** รับ signal from **T6-S3**",
              "Gracile nucleus",
              "Spinal tract of trigeminal nerve (CN V)",
              "Superficial arcuate fiber นำ proprioception to cerebellum"
            ]
          },
          {
            "callout": "คู่ที่ต้องจำให้แม่นคือระดับ segment ของ fasciculus สองเส้น cuneatus = C1-T5 ส่วน gracilis = T6-S3",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Ventral external surface",
        "source": "Myelencephalon p.1",
        "body": [
          {
            "bullets": [
              "**Trapezoid body**",
              "**Pyramids** ประกอบด้วย corticospinal และ corticonuclear tract",
              "**Pyramidal decussation** สไลด์ระบุว่า **70% in dog** แล้วแยกต่อเป็น Lateral และ Ventral corticospinal tract",
              "Cranial nerves **VI-XII**",
              "Ventral medial fissure"
            ]
          }
        ]
      },
      {
        "heading": "Lateral external surface",
        "source": "Myelencephalon p.2",
        "body": [
          {
            "text": "หน้านี้ให้ทั้งชื่อโครงสร้างและหน้าที่กำกับไว้ในวงเล็บ"
          },
          {
            "bullets": [
              "**Superficial arcuate fiber**: proprioception จาก **thoracic limb** ไป cerebellum",
              "**Spinal tract of trigeminal n.**: **pain & temperature from the face**",
              "**Dorsal spinocerebellar tract**: proprioception จาก **trunk และ pelvic limb** ไป cerebellum"
            ]
          }
        ]
      },
      {
        "heading": "Internal structure: nuclei แบ่ง 3 กลุ่ม",
        "source": "Myelencephalon p.2",
        "body": [
          {
            "text": "สไลด์บอกว่า nuclei ใน medulla oblongata มี **3 groups**"
          },
          {
            "sub": "1. Reticular formation nuclei",
            "body": [
              {
                "text": "สไลด์ระบุว่าเป็นที่ตั้งของ **cardiovascular center และ respiratory center**"
              }
            ]
          },
          {
            "sub": "2. Nuclei of cranial nerve VI-XII",
            "body": [
              {
                "text": "สไลด์กำกับ **Ambiguous nucleus** ไว้ด้วยดาวในกลุ่มนี้"
              }
            ]
          },
          {
            "sub": "3. Relay station nuclei",
            "body": [
              {
                "bullets": [
                  "**olivary nucleus**",
                  "**trapezoid nucleus**",
                  "**nucleus gracilis & nucleus cuneatus**",
                  "**solitary nucleus**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Internal structure: tracts",
        "source": "Myelencephalon p.2",
        "body": [
          {
            "text": "ภายในมีทั้ง ascending และ descending tracts รวมทั้ง cranial nerves **VI-XII**, fibers to cerebellum (**olivocerebellar tract**) และ fibers ที่ traverse หรือ terminate ใน medulla oblongata"
          },
          {
            "sub": "Motor",
            "body": [
              {
                "bullets": [
                  "corticospinal tract",
                  "corticonuclear tract",
                  "rubrospinal tract",
                  "reticulospinal tract",
                  "**MLF (Medial longitudinal fasciculus)**"
                ]
              }
            ]
          },
          {
            "sub": "Sensory",
            "body": [
              {
                "bullets": [
                  "fasciculus cuneatus",
                  "fasciculus gracilis",
                  "spinomedullary tract",
                  "spinocerebellar tract",
                  "spinal tract of CN V"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Nuclei ของ cranial nerves V-XII",
        "source": "Myelencephalon p.3",
        "body": [
          {
            "text": "หน้านี้เป็นภาพ cranial nuclei in brainstem พร้อมลิสต์ว่าเส้นประสาทแต่ละคู่มี nucleus ชนิดใดบ้าง"
          },
          {
            "bullets": [
              "**CN V**: nucleus of spinal tract of trigeminal nerve",
              "**CN VI**: motor nucleus",
              "**CN VII**: motor, sensory, parasympathetic nuclei",
              "**CN VIII**: vestibular และ cochlear nuclei",
              "**CN IX**: motor, sensory, parasympathetic nuclei",
              "**CN X**: motor, sensory, parasympathetic nuclei",
              "**CN XI**: motor nucleus",
              "**CN XII**: motor nucleus"
            ]
          }
        ]
      },
      {
        "heading": "อาการทางคลินิกที่สไลด์ยกหัวข้อไว้",
        "source": "Myelencephalon p.4",
        "body": [
          {
            "text": "หน้านี้เป็นสไลด์รูป nuclei of cranial nerves พร้อมหัวข้ออาการเป็นคำ ๆ ไม่มีข้อความอธิบาย"
          },
          {
            "bullets": [
              "**MEDIAL STRABISMUS**",
              "**FACIAL PARALYSIS**",
              "**NYSTAGMUS** พร้อมคำกำกับ Circling, Falling, Head tilt"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าอาการแต่ละอย่างเกิดจาก lesion ที่ nucleus หรือเส้นประสาทคู่ไหน มีแต่หัวข้ออาการกับลิงก์วิดีโอประกอบ ต้องฟังคำอธิบายในคาบหรือถามอาจารย์เพิ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Reticular formation, ARAS และ reticulospinal pathway",
        "source": "Myelencephalon p.5",
        "body": [
          {
            "text": "สไลด์พาดหัวว่า **RETICULAR FORMATION NUCLEI: CONTROLS VITAL FUNCTIONS (GI, RESP, CARDIO)**"
          },
          {
            "sub": "ARAS (Ascending Reticular Activating System)",
            "body": [
              {
                "bullets": [
                  "**Sleep-wake cycle**",
                  "Keep cerebrum in a state of **alert consciousness**"
                ]
              }
            ]
          },
          {
            "sub": "Reticulospinal pathway",
            "body": [
              {
                "bullets": [
                  "Continued from **rubrospinal tract**",
                  "ทำหน้าที่เกี่ยวกับ **movement and posture**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Nucleus cuneatus และ nucleus gracilis",
        "source": "Myelencephalon p.5",
        "body": [
          {
            "sub": "NUCLEUS CUNEATUS",
            "body": [
              {
                "bullets": [
                  "**medial cuneate nucleus**: touch & proprioception ของ **cranial half of the body และ thoracic limb** ไปที่ **thalamus**",
                  "**lateral cuneate nucleus**: proprioception ของ **neck** ไปที่ **cerebellum**"
                ]
              }
            ]
          },
          {
            "sub": "NUCLEUS GRACILIS",
            "body": [
              {
                "text": "**Discriminative touch และ proprioception** จาก **caudal half of the body และ pelvic limb** ไปที่ **thalamus**"
              },
              {
                "callout": "สไลด์กำกับดาวไว้ว่า some textbook บอกว่าส่วนนี้ conveys by **spinomedullary tract** แล้วไป terminate ที่ **Nucleus Z** ซึ่งอยู่ rostral ต่อ nucleus gracilis",
                "kind": "tip"
              }
            ]
          },
          {
            "callout": "จุดเปรียบเทียบที่ต้องแยกให้ออกคือปลายทาง medial cuneate กับ gracilis ไป thalamus ส่วน lateral cuneate ไป cerebellum",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Trapezoid nucleus และ olivary nucleus (relay nuclei)",
        "source": "Myelencephalon p.5",
        "body": [
          {
            "bullets": [
              "**TRAPEZOID NUCLEUS**: relay nuclei ของ **auditory fibers** ไปที่ midbrain (**caudal colliculus**)",
              "**OLIVARY NUCLEUS**: relay nuclei จาก **telencephalon, diencephalon, mesencephalon** ไปที่ **cerebellum** ที่ระดับ **CN VII-XII**"
            ]
          },
          {
            "text": "ภาพในหน้าเดียวกันยังชี้ตำแหน่ง vestibular nuclei, cochlear nuclei, RF (reticular formation), cuneate nucleus และ nucleus of spinal tract of trigeminal nerve"
          }
        ]
      },
      {
        "heading": "Nucleus ambiguous และ solitary nucleus",
        "source": "Myelencephalon p.6",
        "body": [
          {
            "sub": "NUCLEUS AMBIGUOUS (C.N. IX, X, XI)",
            "body": [
              {
                "bullets": [
                  "เป็น **motor nuclei**",
                  "Innervates skeletal muscles ของ **pharynx, larynx และ esophagus**",
                  "**Controls swallowing**"
                ]
              }
            ]
          },
          {
            "sub": "SOLITARY NUCLEUS",
            "body": [
              {
                "bullets": [
                  "เป็น **sensory nuclei**",
                  "รับ input จาก **internal organ** ผ่าน sensory fiber ของ **Vagus nerve**",
                  "อยู่ **dorsal-medial** ของ medulla oblongata"
                ]
              }
            ]
          },
          {
            "text": "ภาพ cross section ในหน้านี้กำกับตำแหน่ง gracile nucleus, cuneate nucleus, nucleus of the spinal tract of C.N. V และ pyramidal decussation"
          }
        ]
      },
      {
        "heading": "The fourth ventricle: รูปร่างและขอบเขต",
        "source": "Myelencephalon p.6",
        "body": [
          {
            "text": "สไลด์ระบุว่าเป็น **diamond-shape cavity**"
          },
          {
            "bullets": [
              "**Ventral**: pons & medulla",
              "**Dorsal**: cerebellum",
              "**Cranial**: mesencephalic aqueduct",
              "**Caudal**: obex"
            ]
          }
        ]
      },
      {
        "heading": "The fourth ventricle: roof, wall และ floor",
        "source": "Myelencephalon p.7",
        "body": [
          {
            "sub": "Roof",
            "body": [
              {
                "bullets": [
                  "**rostral medullary velum** เป็น cerebellar white matter",
                  "**caudal medullary velum** เป็น ependymal pia mater",
                  "**choroid plexus** ทำหน้าที่สร้าง **CSF**"
                ]
              }
            ]
          },
          {
            "sub": "Wall",
            "body": [
              {
                "bullets": [
                  "**area postrema** คือ **emetic center, CTZ** อยู่ **cranial ต่อ obex**",
                  "**lateral aperture of 4th ventricle (lateral recess)**",
                  "**dorsal และ ventral cochlear nuclei**"
                ]
              }
            ]
          },
          {
            "sub": "Floor",
            "body": [
              {
                "bullets": [
                  "**rhomboidal fossa** และ ventral median sulcus",
                  "**Sulcus limitans** เป็นรอยต่อจาก floor ไป wall ตรงนี้คือที่ตั้งของ **vestibular nuclei**"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "neuroanat--neuro-exam-anatomy2024": {
    "topic": "neuroanat--neuro-exam-anatomy2024",
    "title": "Basic Neurological Examination (Neuro exam anatomy 2024)",
    "icon": "🔬",
    "lecturer": "Waruntip Bunyaputikul",
    "summary": "สไลด์ lab วางโครงการตรวจระบบประสาทเบื้องต้นในสัตว์เล็ก แบ่งเป็น Observation (hands-off) กับ Hands-on examination แล้วไล่หัวข้อย่อยทีละอัน เนื้อหาที่เป็นข้อมูลจริงหนักที่สุดอยู่ที่ตาราง 2 ตาราง คือ spinal reflexes (reflex กับ peripheral nerve กับ spinal cord segment) และ cranial nerve examination (afferent, efferent, effect) นอกนั้นสไลด์ส่วนใหญ่เป็นชื่อหัวข้อกับรูปหรือคลิปสาธิตที่ไม่มีข้อความ ได้แก่ mental status p.5-6, ataxia p.11-12, involuntary movements p.13-14, spinal reflexes p.19, palpebral reflex p.23 และ case study p.26-27 หน้า 21 กับ 22 เป็นสไลด์ตาราง cranial nerve เดียวกันซ้ำกัน 2 หน้า",
    "sections": [
      {
        "heading": "ทำไมต้องตรวจระบบประสาท",
        "source": "Neuro exam anatomy2024 p.1",
        "body": [
          {
            "text": "สไลด์เปิดตั้งคำถามว่า Why doing the neurological examination? แล้วตอบเป็น 3 ข้อสั้น ๆ"
          },
          {
            "bullets": [
              "**Neurological problem?** คือดูว่าเป็นปัญหาทางระบบประสาทจริงหรือไม่",
              "**Anatomical localisation** คือระบุตำแหน่งรอยโรค",
              "**Prognosis**"
            ]
          },
          {
            "callout": "สไลด์เขียนไว้แค่ 3 คำนี้ ไม่ได้ขยายความว่าแต่ละข้อทำอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "อุปกรณ์และแบบฟอร์มการตรวจ",
        "source": "Neuro exam anatomy2024 p.2",
        "body": [
          {
            "text": "สไลด์มีหัวข้อ **Equipments** และ **Neurological examination sheet** แต่ตัวรายการอุปกรณ์เป็นรูปภาพ ไม่มีข้อความในสไลด์ จึงบอกไม่ได้ว่ามีอุปกรณ์อะไรบ้าง สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "โครงของการตรวจ: hands-off กับ hands-on",
        "source": "Neuro exam anatomy2024 p.3",
        "body": [
          {
            "text": "สไลด์แบ่งการตรวจออกเป็น **2 ส่วนใหญ่** คือ Observation (Hands-off examination) และ Hands-on examination"
          },
          {
            "sub": "Observation (Hands-off examination) ประกอบด้วย 4 หัวข้อ",
            "body": [
              {
                "bullets": [
                  "**Mental status and behaviour**",
                  "**Gait**",
                  "**Posture and body position at rest**",
                  "**Abnormal involuntary movements**"
                ]
              }
            ]
          },
          {
            "callout": "หัวข้อย่อยของ Hands-on examination ไปแจกแจงที่ p.15 ไม่ได้อยู่ในสไลด์นี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Mental status and behaviour",
        "source": "Neuro exam anatomy2024 p.4-6",
        "body": [
          {
            "sub": "Mental status (p.4)",
            "body": [
              {
                "bullets": [
                  "**Alert**",
                  "**Disoriented**",
                  "**Obtunded**",
                  "**Stuporous**",
                  "**Comatose**"
                ]
              }
            ]
          },
          {
            "sub": "Behaviour (p.4)",
            "body": [
              {
                "bullets": [
                  "**Circling**",
                  "**Head pressing**",
                  "**Compulsive walking**",
                  "**Aggression**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์หน้าเดียวกันยังพิมพ์คำว่า **Brainstem**, **Ascending reticular activating system (ARAS)**, **Forebrain** และ **Severe systemic disease** วางไว้ด้วย ซึ่งเป็นโครงสร้างและสาเหตุที่เกี่ยวข้องกับ mental status"
          },
          {
            "callout": "สไลด์วางคำเหล่านี้ไว้เป็นกล่อง ไม่ได้เขียนเป็นประโยคว่าอาการระดับไหนจับคู่กับโครงสร้างใด ตรงนี้สไลด์ไม่ได้บอก ต้องฟังคำอธิบายในคาบ",
            "kind": "warn"
          },
          {
            "text": "p.5 และ p.6 เป็นสไลด์รูปหรือคลิปตัวอย่าง mental status and behaviour ไม่มีข้อความ"
          }
        ]
      },
      {
        "heading": "Posture and body position at rest: ศีรษะและลำตัว",
        "source": "Neuro exam anatomy2024 p.7",
        "body": [
          {
            "sub": "Abnormalities of the head posture",
            "body": [
              {
                "bullets": [
                  "**Head tilt**",
                  "**Head turn**"
                ]
              }
            ]
          },
          {
            "sub": "Abnormalities of the trunk",
            "body": [
              {
                "bullets": [
                  "**Spinal curvatures**",
                  "**Ventral flexion of the neck**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อท่า ไม่ได้อธิบายว่าแต่ละท่าบ่งชี้รอยโรคที่ตำแหน่งไหน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Posture and body position at rest: ขา",
        "source": "Neuro exam anatomy2024 p.8-9",
        "body": [
          {
            "sub": "Abnormalities of the limbs (p.8)",
            "body": [
              {
                "bullets": [
                  "**Wide base stance**",
                  "**Spontaneous knuckling**",
                  "**Schiff-Sherrington posture**",
                  "**Decerebrate rigidity**",
                  "**Decerebellate rigidity**"
                ]
              }
            ]
          },
          {
            "text": "p.9 เพิ่มอีกหนึ่งท่าคือ **Plantigrade or palmigrade postures** โดยเป็นสไลด์รูปสองหน้าย่อยที่มีแค่ชื่อท่า"
          },
          {
            "callout": "สไลด์พิมพ์ไว้เฉพาะชื่อ ไม่ได้บรรยายลักษณะขาหน้าขาหลังหรือตำแหน่งรอยโรค",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Gait: ataxia, paresis/paralysis, lameness",
        "source": "Neuro exam anatomy2024 p.10-12",
        "body": [
          {
            "sub": "Ataxia",
            "body": [
              {
                "bullets": [
                  "เกิดจาก **dysfunction of sensory system**",
                  "**Cerebellar ataxia**",
                  "**Vestibular ataxia**",
                  "**Proprioceptive ataxia**"
                ]
              }
            ]
          },
          {
            "sub": "Paresis / Paralysis (Plegia)",
            "body": [
              {
                "bullets": [
                  "เกิดจาก **dysfunction of motor system**",
                  "แบ่งเป็น **ambulatory** หรือ **nonambulatory**",
                  "แบ่งตามจำนวนขาที่เป็น **mono-, hemi-, para-, tetra-**",
                  "แบ่งตามรอยโรคเป็น **LMN** และ **UMN**"
                ]
              }
            ]
          },
          {
            "sub": "Lameness",
            "body": [
              {
                "bullets": [
                  "**Orthopedic disease**",
                  "**Neurologic lesions**"
                ]
              }
            ]
          },
          {
            "text": "p.11 และ p.12 เป็นคลิปหรือรูปสาธิต cerebellar ataxia, vestibular ataxia และ proprioceptive ataxia ไม่มีข้อความอธิบายความต่างของแต่ละแบบในสไลด์"
          },
          {
            "callout": "จุดที่สไลด์แยกชัดคือ ataxia จัดอยู่ฝั่ง sensory ส่วน paresis/paralysis จัดอยู่ฝั่ง motor",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Abnormal involuntary movements",
        "source": "Neuro exam anatomy2024 p.13-14",
        "body": [
          {
            "bullets": [
              "**Tremors** (p.13)",
              "**Myoclonus** (p.13)",
              "**Epileptic seizures** (p.14)",
              "**Feline hyperesthesia** (p.14)"
            ]
          },
          {
            "callout": "ทั้งสี่สไลด์นี้มีแต่ชื่อกับคลิปสาธิต ไม่มีคำนิยามหรือกลไกในสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Hands-on examination: ภาพรวมและ postural reactions",
        "source": "Neuro exam anatomy2024 p.15",
        "body": [
          {
            "sub": "Hands-on examination มี 5 หัวข้อ",
            "body": [
              {
                "bullets": [
                  "**Postural reactions**",
                  "**Spinal reflexes**",
                  "**Cutaneous trunci reflex**",
                  "**Cranial nerve examination**",
                  "**Palpation and sensory testing**"
                ]
              }
            ]
          },
          {
            "text": "หลักที่สไลด์เน้นสำหรับ postural reactions คือเป็น **conscious reaction ที่วิ่งไปที่ contralateral forebrain**"
          },
          {
            "text": "สไลด์อ้างอิงรูปจาก André Jaggy (ed.), Small Animal Neurology An Illustrated Text, 2010"
          }
        ]
      },
      {
        "heading": "Postural reaction tests ที่สไลด์ระบุ",
        "source": "Neuro exam anatomy2024 p.16-18",
        "body": [
          {
            "bullets": [
              "**Paw replacement response** (p.16)",
              "**Tactile placing response** (p.16)",
              "**Hopping response** (p.17)",
              "**Extensor postural thrust** (p.18)",
              "**Wheelbarrowing** (p.18)"
            ]
          },
          {
            "callout": "แต่ละ test มีแต่ชื่อกับรูปสาธิต สไลด์ไม่ได้เขียนวิธีทำหรือเกณฑ์แปลผล",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Spinal reflexes: reflex กับ nerve กับ spinal cord segment",
        "source": "Neuro exam anatomy2024 p.18-19",
        "body": [
          {
            "text": "หลักที่สไลด์เขียนไว้ตัวใหญ่คือ spinal reflexes เป็น **segmental และ do not require consciousness** ตารางแบ่งเป็นสามกลุ่ม คือ thoracic limbs, pelvic limbs และ tail and anus โดยมีสามคอลัมน์ ได้แก่ spinal reflex, peripheral nerve และ spinal cord segments"
          },
          {
            "sub": "Thoracic limbs",
            "body": [
              {
                "bullets": [
                  "**Withdrawal reflex** เส้นประสาท Musculocutaneous, median and ulnar nerves segment **C6-T2**",
                  "**Extensor carpi radialis reflex** เส้นประสาท Radial nerve segment **C7-T2**",
                  "**Biceps brachii radialis reflex** (ตามที่สไลด์พิมพ์) เส้นประสาท Musculocutaneous nerve segment **C6-C8**",
                  "**Triceps reflex** เส้นประสาท Radial nerve segment **C7-T2**"
                ]
              }
            ]
          },
          {
            "sub": "Pelvic limbs",
            "body": [
              {
                "bullets": [
                  "**Withdrawal reflex** เส้นประสาท Sciatic nerve segment **L7-S1**",
                  "**Patellar reflex** เส้นประสาท Femoral nerve segment **L4-L6**",
                  "**Cranial tibial reflex** เส้นประสาท Peroneal nerve segment **L6-S1**",
                  "**Gastrocnemius reflex** เส้นประสาท Tibial nerve segment **L6-S1**"
                ]
              }
            ]
          },
          {
            "sub": "Tail and anus",
            "body": [
              {
                "bullets": [
                  "**Perineal reflex** เส้นประสาท Pudendal nerve segment **S1-S3**"
                ]
              }
            ]
          },
          {
            "callout": "ตารางนี้ถูกดึงออกมาเป็นข้อความเรียงกันเป็นคอลัมน์ การจับคู่ข้างบนเรียงตามลำดับที่สไลด์พิมพ์ทั้งสามคอลัมน์ ตอนอ่านทวนควรเปิดสไลด์จริงเทียบแถวอีกครั้ง",
            "kind": "warn"
          },
          {
            "text": "p.19 เป็นรูปสาธิตการทำ cranial tibial reflex, patellar reflex, gastrocnemius reflex และ withdrawal reflex ไม่มีข้อความเพิ่ม"
          }
        ]
      },
      {
        "heading": "Cutaneous trunci reflex",
        "source": "Neuro exam anatomy2024 p.20",
        "body": [
          {
            "text": "สไลด์เขียนไว้บรรทัดเดียวและซ้ำสองครั้งในหน้าเดียวกันว่า **Start at L4 -> T2** คือเริ่มทดสอบจาก L4 ไล่ขึ้นไปทาง T2"
          },
          {
            "callout": "สไลด์ไม่ได้บอกวงจร afferent หรือ efferent ของ cutaneous trunci reflex ไว้ในหน้านี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cranial nerve examination: afferent, efferent, effect",
        "source": "Neuro exam anatomy2024 p.21",
        "body": [
          {
            "text": "ตารางนี้มี 4 คอลัมน์ คือ clinical testing, afferent innervation, efferent innervation และ effect"
          },
          {
            "bullets": [
              "**Palpebral reflex** afferent **CN V** efferent **Facial nerve** ผลคือ blink เมื่อสัมผัสที่ lateral และ medial canthus ของตา",
              "**Menace response (conscious)** afferent **CN II และ central pathways** efferent **Facial nerve** ผลคือ blink เมื่อทำท่าขู่ที่ตา",
              "**Pupillary light reflex** afferent **CN II** efferent **Oculomotor nerve** ผลคือ pupillary constriction เมื่อส่องไฟสว่าง",
              "**Facial sensation (conscious)** afferent **three branches of CN V และ central pathways** ผลคือ withdrawal of the head",
              "**Vestibulo-ocular reflex** afferent **CN VIII และ central pathway** efferent **CN III Oculomotor, CN IV Trochlear, CN VI Abducent** ผลคือ physiological nystagmus เมื่อหันหัวไปมาซ้ายขวา",
              "**Tongue** afferent **CN XII** efferent **CN XII** ผลคือดู tongue size and movement",
              "**Gag reflex** afferent **CN IX และ CN X Vagus** efferent **CN IX และ CN X Vagus** ผลคือ swallowing"
            ]
          },
          {
            "callout": "ในตาราง คอลัมน์ efferent ของแถว facial sensation ไม่ปรากฏชัดในตัวสไลด์ที่อ่านได้ ตรงนี้สไลด์ไม่ได้บอก",
            "kind": "flag"
          },
          {
            "callout": "สไลด์พิมพ์ afferent ของ menace response ว่า CV II ซึ่งในตารางเดียวกันคือ CN II ให้ระวังเวลาลอกตาม และสังเกตว่า menace response เป็น conscious response ไม่ใช่ reflex ธรรมดา ตารางเดียวกันนี้ถูกใส่ซ้ำอีกครั้งที่ p.22",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Palpebral reflex และ pathological nystagmus",
        "source": "Neuro exam anatomy2024 p.23-24",
        "body": [
          {
            "text": "p.23 เป็นรูปสาธิต **palpebral reflex** ไม่มีข้อความเพิ่มจากตารางหน้าก่อน"
          },
          {
            "text": "p.24 หัวข้อ **Pathological nystagmus** แยกไว้ 2 แบบ"
          },
          {
            "bullets": [
              "**Vertical nystagmus**",
              "**Horizontal nystagmus**"
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อสองแบบกับคลิป ไม่ได้บอกว่า nystagmus แต่ละทิศบ่งชี้รอยโรคที่ไหน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Palpation and sensory testing",
        "source": "Neuro exam anatomy2024 p.25",
        "body": [
          {
            "text": "ลำดับการคลำที่สไลด์กำหนดคือ **From Head ไป vertebral columns ไป limbs**"
          },
          {
            "sub": "สิ่งที่ต้องมองหาระหว่างคลำ",
            "body": [
              {
                "bullets": [
                  "**asymmetry**",
                  "**deformity**",
                  "**area of discomfort**",
                  "**joint swelling** (สไลด์พิมพ์ว่า join swelling)",
                  "**focal or diffuse muscle atrophy**"
                ]
              }
            ]
          },
          {
            "sub": "Pain perception (nociception)",
            "body": [
              {
                "bullets": [
                  "**Superficial pain**",
                  "**Deep pain**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์แยกแค่ superficial pain กับ deep pain ไม่ได้อธิบายวิธีทดสอบหรือความหมายทาง prognosis",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Case study, examination sheet และ suggested reading",
        "source": "Neuro exam anatomy2024 p.26-29",
        "body": [
          {
            "text": "p.26 และ p.27 เป็นสไลด์ **Case study** ที่มีแต่หัวข้อกับรูปหรือคลิป ไม่มีตัวเคสเป็นข้อความ"
          },
          {
            "text": "p.28 เป็น **Neurological examination sheet** ซ้ำกับ p.2 เป็นรูปแบบฟอร์ม ไม่มีข้อความให้อ่าน"
          },
          {
            "text": "p.29 เป็นสไลด์ **Suggested reading** และคำขอบคุณปิดท้าย แต่รายชื่อหนังสือเป็นรูป ไม่มีข้อความ หนังสือเล่มเดียวที่ถูกพิมพ์เป็นตัวอักษรในเดคนี้คือ André Jaggy (ed.), Small Animal Neurology An Illustrated Text, 2010 ที่อ้างไว้ที่ p.15"
          }
        ]
      }
    ]
  },
  "neuroanat--visual-vestibular-systems": {
    "topic": "neuroanat--visual-vestibular-systems",
    "title": "Visual และ Vestibular systems",
    "icon": "📖",
    "summary": "เด็คนี้มี 59 สไลด์ แต่เกือบทั้งหมดเป็นภาพและแผนภาพที่ไม่มีชั้นข้อความ ส่วนที่อ่านเป็นตัวอักษรได้จริงมีไม่มาก และเป็นแบบคำหลักหรือลิสต์สั้น ๆ เนื้อหาที่จับได้คือ receptor ใน retina และ transduction, การแบ่ง visual field เป็น nasal half กับ temporal half, visual pathway จาก photoreceptor ไป primary visual cortex พร้อมการแตกแขนง 80/20, รายการตรวจ neuro-ophthalmology, PLR กับกล้ามเนื้อม่านตา, Horner syndrome, receptor และ pathway ของ vestibular system, VOR, ตาราง extra-ocular muscles กับ innervation และตารางเทียบ central กับ peripheral vestibular disease ส่วนคำอธิบายกลไกโดยละเอียดอยู่ในภาพหรือคำบรรยายปากเปล่า ไม่ได้อยู่บนสไลด์",
    "sections": [
      {
        "heading": "Retina receptors และ transduction",
        "source": "visual vestibular systems p.12-14",
        "body": [
          {
            "text": "สไลด์ช่วงต้นของเด็ค (หัวข้อ การรับภาพ) เป็นภาพล้วน ข้อความที่มีจริงคือชื่อ receptor สองชนิด **Rods & cones**"
          },
          {
            "text": "สไลด์ Transduction in retina ไล่ลำดับไว้เป็นสามบรรทัดตามนี้"
          },
          {
            "bullets": [
              "rods & cones",
              "bipolar neurone",
              "ganglion cell axons"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกกลไกของ transduction เขียนไว้แค่ลำดับเซลล์สามชั้นนี้เท่านั้น รายละเอียดอยู่ในภาพหรือคำบรรยาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Visual field: nasal half กับ temporal half",
        "source": "visual vestibular systems p.18, p.21",
        "body": [
          {
            "text": "สไลด์ VISUAL FIELD แบ่ง retina ออกเป็น **nasal half** และ **temporal half**"
          },
          {
            "text": "สไลด์ถัดมาระบุว่า **ในคน 50%** และเขียนกำกับว่า **nasal half = contralateral ส่วน temporal half = ipsilateral**"
          },
          {
            "callout": "ตัวเลขเปอร์เซ็นต์ของสัตว์แต่ละชนิด สไลด์ไม่ได้บอก บนสไลด์มีเฉพาะเลข 50% ของคน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Visual pathway ตั้งแต่ photoreceptor ถึง visual cortex",
        "source": "visual vestibular systems p.20",
        "body": [
          {
            "text": "สไลด์เขียน pathway เป็นผังไล่ลงมาแบบนี้"
          },
          {
            "bullets": [
              "photoreceptors in retina",
              "optic nerve",
              "**optic chiasma (nasal half = decussation)**",
              "optic tract",
              "แยกเป็นสองทาง คือ lateral geniculate nucleus **(80%)** และ rostral colliculus **(20%)**",
              "ทาง lateral geniculate nucleus ไปต่อที่ optic radiation แล้วเข้า **primary visual cortex (occipital lobe)**",
              "ทาง rostral colliculus ไปทำหน้าที่ **visual reflex**"
            ]
          },
          {
            "callout": "ตัวเลข 80% กับ 20% และคำว่า nasal half = decussation คือจุดที่สไลด์เน้นไว้บนผังโดยตรง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "20% ของ fibres จาก optic tract ไปไหนบ้าง",
        "source": "visual vestibular systems p.24-26",
        "body": [
          {
            "text": "สไลด์หัวข้อ 20% ของ fibres จาก optic tract ลิสต์ปลายทางไว้ตามนี้"
          },
          {
            "bullets": [
              "1. **motor of CN III, IV, VI และ pupillary reflex (ANS)**",
              "2. **Tectospinal tract**",
              "3. **reticular formation**",
              "**limbic system** (สไลด์เขียนไว้โดยไม่ได้ใส่หมายเลขกำกับ และมีสไลด์ถัดไปขึ้นคำว่า limbic system เดี่ยว ๆ อีกหนึ่งสไลด์)"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้อธิบายว่าแต่ละเส้นทางทำหน้าที่อะไรต่อ เขียนไว้แค่ชื่อปลายทาง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Monocular vs Binocular vision",
        "source": "visual vestibular systems p.22-23",
        "body": [
          {
            "text": "มีสองสไลด์ติดกันชื่อ Monocular vs. Binocular Vision ข้อความบนสไลด์มีแค่สองคำคือ **Predator** และ **Prey** ที่เหลือเป็นภาพประกอบ สไลด์ไม่ได้เขียนอธิบายว่าแต่ละแบบต่างกันอย่างไร"
          }
        ]
      },
      {
        "heading": "รายการตรวจ Neuro-ophthalmology",
        "source": "visual vestibular systems p.31",
        "body": [
          {
            "text": "สไลด์ Neuro-ophthalmology Evaluation ลิสต์หัวข้อที่ต้องตรวจไว้ดังนี้"
          },
          {
            "bullets": [
              "**menace**",
              "**PLR**",
              "**swinging light**",
              "**dazzle**",
              "**palpebral reflex**",
              "**corneal reflex**",
              "**strabismus**",
              "**nystagmus**"
            ]
          },
          {
            "callout": "สไลด์ให้แค่รายชื่อการตรวจ ไม่ได้บอกวิธีทำหรือการแปลผลของแต่ละอัน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "รูม่านตา: miosis, mydriasis และ PLR",
        "source": "visual vestibular systems p.32, p.34, p.36",
        "body": [
          {
            "sub": "กล้ามเนื้อที่ทำให้รูม่านตาหดและขยาย",
            "body": [
              {
                "bullets": [
                  "**Miosis (constrict) ใช้ m. sphincter pupillae**",
                  "**Mydriasis (dilate) ใช้ m. dilator pupillae**"
                ]
              }
            ]
          },
          {
            "sub": "Pupillary light reflex (PLR)",
            "body": [
              {
                "text": "มีสไลด์ PLR สามสไลด์ติดกัน แต่ข้อความที่พิมพ์ไว้บนสไลด์มีเพียงชื่อ reflex กับชื่อนิวเคลียส **Edinger-Westphal n.** ส่วนวงจรที่เหลือเป็นแผนภาพ"
              }
            ]
          },
          {
            "sub": "ตัวอย่างรอยโรค",
            "body": [
              {
                "text": "สไลด์ภาพเคสเขียนคำบรรยายว่า **Left mydriasis and ptosis due to oculomotor nerve paralysis**"
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนลำดับ afferent กับ efferent ของ PLR เป็นตัวหนังสือ ให้ดูจากแผนภาพหรือคำบรรยายในคาบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Menace response",
        "source": "visual vestibular systems p.27, p.38, p.40",
        "body": [
          {
            "text": "มีสองสไลด์ที่พิมพ์คำว่า **menace response** ไว้เป็นหัวเรื่อง ส่วนเนื้อหาเป็นภาพหรือคลิป สไลด์ไม่ได้เขียนเส้นทางประสาทหรือเกณฑ์แปลผลของ menace response ไว้"
          },
          {
            "text": "ในเด็คยังมีสไลด์หนึ่งที่เป็นลิงก์ไปวิดีโอสอนทางระบบประสาทของ Cornell เพียงอย่างเดียว ไม่มีข้อความอื่น"
          }
        ]
      },
      {
        "heading": "Horner syndrome",
        "source": "visual vestibular systems p.41",
        "body": [
          {
            "text": "สไลด์นิยามไว้ตรง ๆ ว่า **Horner syndrome (HS) = decreased sympathetic supply to the eye**"
          },
          {
            "text": "อาการที่สไลด์ลิสต์ไว้"
          },
          {
            "bullets": [
              "**miosis**",
              "**ptosis**",
              "**enophthalmos**",
              "**protrusion of the nictitating membrane**"
            ]
          }
        ]
      },
      {
        "heading": "Heterochromia iridis",
        "source": "visual vestibular systems p.30",
        "body": [
          {
            "text": "มีสไลด์ภาพหนึ่งที่พิมพ์คำว่า **heterochromia iridis** ไว้คำเดียว สไลด์ไม่ได้เขียนคำอธิบายหรือความเกี่ยวข้องกับหัวข้ออื่นในเด็ค"
          }
        ]
      },
      {
        "heading": "Vestibular receptors",
        "source": "visual vestibular systems p.42-44",
        "body": [
          {
            "text": "สไลด์ระบุโครงสร้างที่เกี่ยวข้องคือ **saccule, utricle และ semicircular canal (ampulla)**"
          },
          {
            "text": "และระบุตัวรับไว้ชัดเจนว่า **Receptor = hair cells**"
          }
        ]
      },
      {
        "heading": "Vestibular pathway จาก hair cell ไป 5 ปลายทาง",
        "source": "visual vestibular systems p.48",
        "body": [
          {
            "text": "สไลด์สรุปทางเดินไว้ว่า **receptor = hair cell ใน saccule, utricle, ampullae** แล้วส่งสัญญาณผ่าน **CN VIII ผ่าน vestibular ganglion** เข้าสู่ **vestibular nuclei** จากนั้นแตกออกเป็นห้าทาง"
          },
          {
            "bullets": [
              "1. วิ่งขึ้นไป **cerebellum (vestibulocerebellar tract) ผ่าน caudal peduncle**",
              "2. ผ่าน **medial longitudinal fasciculus (MLF) ไป nuclei of CN III, IV, VI**",
              "3. **reticular formation**",
              "4. **vestibulospinal tract**",
              "5. ผ่าน **diencephalon ไป temporal lobe**"
            ]
          }
        ]
      },
      {
        "heading": "Vestibulo-ocular reflex (VOR)",
        "source": "visual vestibular systems p.49-52",
        "body": [
          {
            "text": "สไลด์ให้คำนิยามสั้น ๆ ว่า **Vestibulo-ocular reflex = keep head balance & gaze steady**"
          },
          {
            "text": "จากนั้นเป็นแผนภาพเทียบสองสถานการณ์ โดยข้อความที่ติดมาบนสไลด์คือชื่อโครงสร้างในผัง"
          },
          {
            "bullets": [
              "สไลด์แรกหัวเรื่อง **PATHWAY ปกติ**",
              "สไลด์ถัดมาหัวเรื่อง **PATHWAY ที่ Abducens nerve เสีย**",
              "ป้ายชื่อในผังทั้งสองสไลด์เหมือนกัน คือ Cerebrum, **Abducens (VI) nucleus, Abducens (VI) nerve, Lateral rectus, Oculomotor (III) nucleus, Oculomotor (III) nerve, Medial rectus** พร้อมฝั่ง Right และ Left"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนเป็นตัวหนังสือว่าเมื่อ abducens nerve เสียแล้วลูกตาจะเบนไปทางไหน ต้องอ่านจากลูกศรในผังหรือคำบรรยายในคาบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Extra-ocular muscles กับ innervation",
        "source": "visual vestibular systems p.53-54",
        "body": [
          {
            "text": "สไลด์ระบุว่า Extra-ocular muscles **controlled by CN III, IV, VI** แล้วให้ตารางกล้ามเนื้อ การทำงาน และเส้นประสาทที่เลี้ยง"
          },
          {
            "bullets": [
              "**Lateral rectus** moves eye laterally, **CN VI**",
              "**Medial rectus** moves eye medially, **CN III**",
              "**Dorsal rectus** elevates eye, **CN III**",
              "**Ventral rectus** depresses eye, **CN III**",
              "**Ventral oblique** rotates lateroventrally, **CN III**",
              "**Dorsal oblique** rotates medioventrally, **CN IV**"
            ]
          },
          {
            "callout": "ตามตารางนี้ มีเพียง lateral rectus ที่เลี้ยงด้วย CN VI และ dorsal oblique ที่เลี้ยงด้วย CN IV ส่วนที่เหลือทั้งหมดเป็น CN III",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อาการของ Vestibular diseases",
        "source": "visual vestibular systems p.55",
        "body": [
          {
            "text": "สไลด์ Vestibular diseases ลิสต์อาการไว้ดังนี้"
          },
          {
            "bullets": [
              "**head tilt**",
              "**ataxia**",
              "**circling, leaning, falling**",
              "**nystagmus**",
              "**strabismus**",
              "**vomiting**"
            ]
          }
        ]
      },
      {
        "heading": "Central vs Peripheral vestibular disease",
        "source": "visual vestibular systems p.56",
        "body": [
          {
            "text": "สไลด์เป็นตารางเทียบสองคอลัมน์ Central กับ Peripheral ตามที่พิมพ์ไว้บนสไลด์"
          },
          {
            "bullets": [
              "Loss of balance / ataxia: Central **Yes**, Peripheral **Yes**",
              "Head tilt: Central **Yes**, Peripheral **Yes**",
              "Falling or rolling: Central **Yes**, Peripheral **Yes**",
              "Nystagmus: Central **Vertical / positional**, Peripheral **All directions**",
              "Strabismus: Central **Yes**, Peripheral **Yes**",
              "Cranial nerve deficits: Central **Yes**, Peripheral **VII only**",
              "Horner's syndrome: Central **Less likely**, Peripheral **Yes**",
              "Cerebellar disease: Central **Yes**, Peripheral **No**",
              "Mental alteration: Central **Yes**, Peripheral **No**",
              "Proprioceptive deficits / paresis: Central **Yes**, Peripheral **No**"
            ]
          }
        ]
      },
      {
        "heading": "สไลด์ท้ายเด็ค: strabismus และ nystagmus",
        "source": "visual vestibular systems p.57, p.59",
        "body": [
          {
            "text": "สองสไลด์สุดท้ายที่มีตัวอักษรคือ **strabismus** และ **nystagmus** พิมพ์ไว้เป็นหัวเรื่องคำเดียว เนื้อหาเป็นภาพหรือคลิปตัวอย่าง สไลด์ไม่ได้เขียนการจำแนกชนิดหรือการแปลผลไว้เป็นตัวหนังสือ"
          }
        ]
      }
    ]
  }
};
