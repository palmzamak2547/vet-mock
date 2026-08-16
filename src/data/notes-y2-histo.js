// ============================================================
// จุลกายวิภาคสัตวแพทย์ (Veterinary Histology) — Study Notes
// ============================================================
// เขียนจากสไลด์บรรยายรหัส 3101206 ที่แจกจริงในรายวิชา ทุก section
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

export const NOTES_Y2_HISTO = {
  "histo--avian": {
    "topic": "histo--avian",
    "title": "Avian histology",
    "icon": "🔬",
    "lecturer": "Benchaphorn Limcharoen, DVM. (Hons), Ph.D., Department of Anatomy, Faculty of Veterinary Science, Chulalongkorn University",
    "summary": "เล็กเชอร์ Avian histology (27 Nov 2023) กวาดจุลกายวิภาคของนกทีละระบบ เทียบกับ mammal ตลอดทั้ง deck คือ blood cells, nervous system (รวม glycogen body และ accessory lobe of Lachi), lymphatic system (thymus, bursa of Fabricius, spleen, GALT/BALT), respiratory (trachea, parabronchus, air capillary, air sac), digestive (esophagus, crop, proventriculus, gizzard, intestine, liver, pancreas) และ urinary (kidney, ureter) สไลด์หลายหน้าเป็นภาพ histology ล้วนหรือภาพเทียบของ dog/mouse โดยไม่มีข้อความอธิบาย และหน้า 2 (Suggested reading) ไม่มีข้อความในชั้นข้อความเลย ⚠️ ข้อควรรู้ Scopes หน้า 3 ประกาศว่าจะครอบคลุม Reproductive system (ovary, oviduct, testis) ด้วย แต่ในเนื้อ deck ไม่มีสไลด์ระบบสืบพันธุ์เลย จบที่ ureter แล้วต่อด้วยรายการสไลด์ LAB",
    "sections": [
      {
        "heading": "Scopes ของเล็กเชอร์นี้",
        "source": "Avian p.3",
        "body": [
          {
            "text": "สไลด์วาง scope ไว้ 6 ระบบ ใช้เป็นโครงอ่านทั้ง deck ได้เลย"
          },
          {
            "bullets": [
              "**Nervous system**: Brain, spinal cord และ Blood cells",
              "**Immune system**: Bursa of Fabricius, Thymus, GALT, BALT",
              "**Respiratory system**: Trachea, lung",
              "**Digestive system**: Crop, proventriculus, gizzard, small intestine",
              "**Urinary system**: Kidney",
              "**Reproductive system**: Ovary and oviduct, testis"
            ]
          },
          {
            "callout": "Reproductive system ถูกประกาศไว้ใน scope แต่ deck ไม่มีสไลด์ระบบสืบพันธุ์ตามมา สไลด์เนื้อหาจบที่ ureter (p.62) แล้วเป็นรายการ LAB เพราะฉะนั้นถ้าจะอ่าน ovary/oviduct/testis ต้องหาจากแหล่งอื่น สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Blood: ภาพรวมชนิดเซลล์",
        "source": "Avian p.4",
        "body": [
          {
            "text": "สไลด์แบ่งเม็ดเลือดของนกออกเป็นสามกลุ่มใหญ่"
          },
          {
            "bullets": [
              "**Erythrocytes**",
              "**Thrombocytes**",
              "**Leukocytes** แยกเป็น Agranulocytes (Lymphocytes, Monocytes) และ Granulocytes (Heterophils, Eosinophils, Basophils)"
            ]
          },
          {
            "callout": "จำโครงนี้ก่อน แล้วค่อยจำลักษณะ nucleus กับ granule ของแต่ละตัวในหน้า 5-7",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Erythrocyte และ Thrombocyte",
        "source": "Avian p.5",
        "body": [
          {
            "sub": "Erythrocyte",
            "body": [
              {
                "text": "**เป็นเซลล์ใหญ่ รูปร่างยาว (elongated) มี oval nucleus ที่ chromatin กระจายเป็นก้อนเล็ก ๆ (small distributed clumps of chromatin)** cytoplasm ติดสีชมพูจาง (pale pink)"
              },
              {
                "text": "สไลด์ระบุว่าขนาดของ erythrocyte ขึ้นกับ Breed และ Sex"
              }
            ]
          },
          {
            "sub": "Thrombocyte",
            "body": [
              {
                "text": "**Round nucleus, cytoplasm รูปไข่สีจาง มี vacuoles**"
              },
              {
                "text": "สไลด์กำกับว่า Similar function to mammalian platelets"
              }
            ]
          }
        ]
      },
      {
        "heading": "Leukocytes: Agranulocytes",
        "source": "Avian p.6",
        "body": [
          {
            "sub": "Lymphocyte",
            "body": [
              {
                "text": "**Nucleus กลมและอยู่กลางเซลล์ (centrally located & round nucleus) cytoplasm ติดสีเบโซฟิลิกเล็กน้อย** สไลด์ระบุว่าเป็น Most abundant WBC ของนก"
              },
              {
                "text": "แบ่งเป็น T-cell / B-cell"
              }
            ]
          },
          {
            "sub": "Monocyte",
            "body": [
              {
                "text": "**Indented nucleus, cytoplasm สีจาง basophilic และมี vacuole**"
              },
              {
                "text": "หน้าที่ที่สไลด์ระบุคือ Phagocytosis"
              }
            ]
          }
        ]
      },
      {
        "heading": "Leukocytes: Granulocytes",
        "source": "Avian p.7",
        "body": [
          {
            "sub": "Heterophil",
            "body": [
              {
                "text": "**Rod-shaped granules, cytoplasm สีจาง, nucleus แบบ lobulated**"
              },
              {
                "text": "**Functionally equivalent to mammalian neutrophil** และ Involved in early acute inflammation"
              }
            ]
          },
          {
            "sub": "Eosinophil",
            "body": [
              {
                "text": "**Granule กลม สีชมพู จำนวนน้อยกว่า (fewer round, pink granules) อยู่ใน cytoplasm สีฟ้าจาง (pale blue)** และ nuclear chromatin เป็นแบบ block-like"
              }
            ]
          },
          {
            "sub": "Basophil",
            "body": [
              {
                "text": "**Granule basophilic ขนาดกลาง จำนวนมาก (large numbers of medium-size basophilic granules) nucleus สีจางและไม่แบ่ง lobe (unlobulated)**"
              }
            ]
          },
          {
            "callout": "หน้า 8 เป็นภาพ Psittacine heterophils อย่างเดียว มีแต่เครดิตภาพ (Moichor Inc.) ไม่มีข้อความอธิบายเพิ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Nervous system: ภาพรวม",
        "source": "Avian p.9",
        "body": [
          {
            "text": "**Histology of the nervous system is similar that of mammals (CNS/PNS)** สไลด์ใช้ภาพ normal sagittal section ของ chicken ชี้ส่วน spinal cord, cerebellum, brain stem และ cerebrum"
          }
        ]
      },
      {
        "heading": "องค์ประกอบเซลล์ใน cerebrum และ cerebellum",
        "source": "Avian p.10-12",
        "body": [
          {
            "text": "หน้า 10 (Cerebrum, grey matter) ระบุเซลล์ที่ต้องดูให้ออก"
          },
          {
            "bullets": [
              "**Neurons**",
              "**Glial cell**: Astrocytes, Oligodendrocytes (Myelin for axon), Microglia",
              "**White matter คือ nerve fiber**"
            ]
          },
          {
            "text": "หน้า 11 เป็นภาพเทียบ Cerebrum ของ Dog (cerebral cortex, grey matter)"
          },
          {
            "text": "หน้า 12 เป็น cerebellum ชี้ **Normal scattered darkly stained Purkinje cells** และชั้นทั้งสาม คือ Molecular layer, Purkinje cell layer และ Granular layer"
          }
        ]
      },
      {
        "heading": "Glycogen body",
        "source": "Avian p.13",
        "body": [
          {
            "text": "**Glycogen body อยู่ที่ lumbosacral enlargement ของ spinal cord ซึ่งบรรจุอยู่ใน synsacrum ประกอบด้วย glycogen-rich glial cells ที่ dorsal groove ของ spinal cord**"
          },
          {
            "text": "สไลด์ยังชี้ AL (Accessory lobe) ว่าเป็น ventrolateral protrusion เกี่ยวกับ CSF movement และเป็น mechanoreceptor"
          },
          {
            "text": "**สไลด์บรรยายว่าเป็น a sense organ of equilibrium which is involved in the control of walking และเน้นว่า not seem to be related to the normal function of glycogen in animals** คือมี glycogen มากแต่ไม่ได้ทำหน้าที่แบบ glycogen ทั่วไป"
          },
          {
            "callout": "สไลด์อ้างอิงงาน Güntürkün et al. 2017, Raja K. et al. 2019 และ Watterson R.L. 1949 แต่ไม่ได้อธิบายกลไกว่า glycogen ในนี้ถูกใช้ทำอะไรกันแน่ สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Accessory lobe of Lachi และ label ในภาพตัดขวาง",
        "source": "Avian p.14",
        "body": [
          {
            "text": "**Accessory lobe of Lachi เป็น extra labyrinthine organ ประกอบด้วย multipolar neurons กับ myelinated และ non-myelinated axons ทำหน้าที่เป็น mechanoreceptor เกี่ยวกับ locomotion และ posture**"
          },
          {
            "text": "เซลล์ของ glycogen body ที่ dorsal groove เป็น **large polygonal cells (glial cells)**"
          },
          {
            "text": "หมายเลขในภาพตัดขวาง lumbosacral part ของ spinal cord"
          },
          {
            "bullets": [
              "glycogen body in the sinus rhomboideus",
              "grey substance of the spinal cord",
              "white substance of the spinal cord",
              "synsacral vertebra",
              "striated muscle และ integument",
              "cell of the glycogen body, nucleus, central canal",
              "อีกภาพชี้ spinal cord, accessory lobe of Lachi, vertebral canal และ pneumatized bone"
            ]
          }
        ]
      },
      {
        "heading": "Lymphatic system: หลักการที่ต้องจำก่อน",
        "source": "Avian p.15",
        "body": [
          {
            "text": "**นกไม่มี lymph nodes มีแต่ diffuse lymphatic tissue และ lymphatic nodules**"
          },
          {
            "sub": "Primary lymphatic tissues (Development and maturation of lymphocyte)",
            "body": [
              {
                "bullets": [
                  "**Thymus: T lymphocyte**",
                  "**Bursa of Fabricius: B lymphocyte**"
                ]
              }
            ]
          },
          {
            "sub": "Secondary lymphatic tissues (Mature lymphocytes interact with antigen)",
            "body": [
              {
                "bullets": [
                  "**Spleen**",
                  "**Mucosa-Associated Lymphoid Tissue**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Thymus",
        "source": "Avian p.16-19",
        "body": [
          {
            "bullets": [
              "**Source of T-cell**",
              "**จัดเรียงเป็น lobules ที่ถูกแบ่งไม่สมบูรณ์ (incompletely separated lobules) ด้วย trabeculae**",
              "มี Thymic capsule แล้วแบ่งเป็น Cortex และ Medulla",
              "**Hassall's corpuscles เหมือนที่พบใน mammals แต่พบไม่บ่อย (seen infrequently)**",
              "**Reticular structure ที่มี dense eosinophilic reticular cells**"
            ]
          },
          {
            "text": "สไลด์ยังชี้ Aging thymus ที่บริเวณ cortex-medulla และ Thymic capsule ที่มี adipose tissue"
          },
          {
            "text": "หน้า 18 (Thymus-medulla) ชี้ reticular structure และ **vesicle with eosinophilic content**"
          },
          {
            "callout": "หน้า 17 เป็นภาพ 1 lobule ชี้ CNT capsule, cortex, medulla และ reticular structure ส่วนหน้า 19 เป็นภาพ Thymus ของ Dog ไว้เทียบ ทั้งสองหน้าไม่มีข้อความอธิบายเพิ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Bursa of Fabricius (Cloacal bursa)",
        "source": "Avian p.20",
        "body": [
          {
            "sub": "ช่วงอายุที่เห็นชัด",
            "body": [
              {
                "bullets": [
                  "**Source of B-cell**",
                  "**Obvious at 1-2-month-old chicken**",
                  "**Regress at 8-12 months**",
                  "**Remnant at 20 months**"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างจุลกายวิภาค",
            "body": [
              {
                "bullets": [
                  "**Mucosal fold (plicae) หนาและสูง เต็มไปด้วย polyhedral follicles จำนวนมาก**",
                  "**Pseudostratified columnar epithelium ทั้งหมด ยกเว้นที่ยอดของแต่ละ follicle ซึ่งคลุมด้วย epithelial tuft ของ simple columnar cells**",
                  "Lymphatic tissue follicle แบ่งเป็น cortex-medulla",
                  "**ชั้นของ undifferentiated epithelial cells และ capillary layer อยู่ที่ขอบของ medulla**"
                ]
              }
            ]
          },
          {
            "text": "ภาพชี้ Bursal capsule, mucosal fold (plicae) และ Lumen"
          }
        ]
      },
      {
        "heading": "Bursa: ศัพท์ epithelium สองตัวที่มักสับสน",
        "source": "Avian p.21",
        "body": [
          {
            "bullets": [
              "**ISE = Interfollicular surface epithelium เป็น Pseudostratified columnar epithelium**",
              "**FAE = Follicular associated epithelium เป็น Simple columnar epithelium ที่กลายเป็น epithelial tuft**"
            ]
          },
          {
            "text": "ภาพชี้เพิ่ม Bursal capsule, blood vessels, bursal follicle (cortex กับ medulla), undifferentiated epithelial cells ที่เป็น cuboidal cells, capillary และ interfollicular connective tissue"
          }
        ]
      },
      {
        "heading": "Bursa: schematic ตำราอ้างอิง",
        "source": "Avian p.22",
        "body": [
          {
            "text": "สไลด์แปะ schematic จาก Nándor Nagy, Imre Oláh, Lonneke Vervelde ใน Avian Immunology (3rd ed.), 2022 พร้อมชุดตัวย่อ"
          },
          {
            "bullets": [
              "**CME = corticomedullary epithelium (อยู่ใน medulla)**",
              "**FAE-SC = follicle-associated epithelium supportive cell**",
              "**ERC = epithelial reticular cell**",
              "**BSDC = bursal secretory dendritic cell**",
              "**IFE = interfollicular epithelium**",
              "BL = basal lamina, Ly = lymphocyte, MØ = macrophage, M = medulla, C = cortex, MRC = mesenchymal reticular cell in the cortex"
            ]
          },
          {
            "callout": "หน้านี้เป็น caption ของรูปล้วน ๆ สไลด์ไม่ได้อธิบายว่าเซลล์แต่ละตัวทำหน้าที่อะไรต่อกันเป็น pathway",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Secondary lymphoid tissue: รายการ",
        "source": "Avian p.23",
        "body": [
          {
            "bullets": [
              "**Spleen**",
              "**Mucosa-Associated Lymphoid Tissues (MALT)** ได้แก่ Gut-associated lymphoid tissues (GALT), Bronchus-associated lymphoid tissues (BALT) และ Head-associated lymphoid tissues"
            ]
          }
        ]
      },
      {
        "heading": "Spleen: schematic ของ chicken spleen",
        "source": "Avian p.24",
        "body": [
          {
            "text": "caption จาก Nándor Nagy et al. ใน Avian Immunology (3rd ed.), 2022 อธิบายโครงหลัก"
          },
          {
            "bullets": [
              "**Ellipsoid (E) หรือ Schweigger-Seidel sheath ห่อรอบ penicilliform capillaries**",
              "**Penicilliform capillary ภายใน ellipsoid มี discontinuous thick basement membrane และมี stomata ที่ antigen ออกจากกระแสเลือดมาสัมผัส ellipsoid-associated cells (EAC) ได้**",
              "Ellipsoid ถูกล้อมด้วย EAC และฝังอยู่ใน periellipsoidal white pulp (PWP) ซึ่งเป็นส่วนผสมของ B cells กับ macrophages",
              "**CA (central artery) ถูกล้อมด้วย T lymphocytes เกิดเป็น PALS และ GC (germinal center) พัฒนาใกล้ central artery**"
            ]
          },
          {
            "text": "caption ยังเสนอสองโมเดลของการเกิด splenic dendritic cell โมเดลแรก FDCs และ IDCs มาจาก precursor ร่วมคือ EAC ใน ellipsoid โดย EAC จับ antigen แล้วหลุดออกจาก ellipsoid ย้ายไป PALS กลายเป็น IDC ก่อนแล้วจึงเป็น FDC ส่วนโมเดลที่สองบอกว่า EAC เปลี่ยนเป็น FDC โดยตรงและเริ่มการสร้าง GC"
          },
          {
            "callout": "เป็นสองโมเดลที่ยังไม่สรุป สไลด์ไม่ได้บอกว่าโมเดลไหนถูก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Spleen: โครงสร้างที่ต้องชี้ได้ในภาพ",
        "source": "Avian p.25-26",
        "body": [
          {
            "bullets": [
              "**White pulp**: PALS และ Splenic nodule (Lymphatic nodule)",
              "**Red pulp**: Splenic sinus และ Splenic cord",
              "**Pulp arteriole (Penicillar arteriole)**",
              "**Sheathed arteriole (Ellipsoid)**"
            ]
          },
          {
            "text": "หน้า 25 เป็น caption Blood flow in the spleen จาก Mescher AL, Junqueira's Basic Histology 16e (2021) ไล่จาก trabecular artery ไป central arteriole ที่ถูกห่อด้วย PALS แล้วแตกเป็น penicillar arterioles ไป sheathed capillaries จากนั้นเลือดไปได้ทั้ง closed circulation เข้า splenic sinuses โดยตรง หรือ open circulation ที่ถูกเทออกสู่ splenic cords ของ red pulp ก่อนกลับเข้าหลอดเลือดผ่านผนัง sinus"
          },
          {
            "text": "หน้า 26 ใช้ภาพ Spleen ของ Dog เป็นตัวเทียบ"
          }
        ]
      },
      {
        "heading": "Spleen ของนกต่างจาก mammal อย่างไร",
        "source": "Avian p.27",
        "body": [
          {
            "sub": "Function",
            "body": [
              {
                "bullets": [
                  "**Production and storage of primarily B-lymphocytes**",
                  "**Filtration of blood and destruction of erythrocytes and antigens**",
                  "**ในนก spleen ไม่ได้มีบทบาทสำคัญในการเก็บ erythrocytes หรือทำ erythropoiesis**"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างที่ต่างจาก mammal",
            "body": [
              {
                "bullets": [
                  "**Muscular capsule และไม่มี trabeculae**",
                  "**ขอบเขตของ red pulp กับ white pulp ไม่ชัดเจน (indistinct) ต่างจาก mammalian**",
                  "**White pulp กระจายทั่ว spleen แบบ diffuse ประกอบด้วย small lymphocytes เป็นหลัก**",
                  "Red pulp เกิดจาก venous sinuses และ anastomosing cords ของ reticular cells, macrophages, lymphocytes และ red blood cells"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 28 เป็น Spleen ของ dog ที่เห็น Trabeculae ชัดและมี Mantle zone / Marginal zone ใช้เทียบให้เห็นว่านกไม่มี trabeculae และขอบเขต pulp ไม่ชัด",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "GALT: ตำแหน่งที่ต้องท่อง",
        "source": "Avian p.29",
        "body": [
          {
            "text": "**GALT เป็น well-organized structure โดย B-lymphocytes รวมเป็น follicles ส่วน T-cells สะสมอยู่ใน interfollicular spaces**"
          },
          {
            "bullets": [
              "**Peyer's patch ใน small intestines**",
              "**Esophageal tonsil ที่ esophagus ตรงรอยต่อกับ proventriculus**",
              "**Pyloric tonsil ที่รอยต่อของ duodenum กับ gizzard (อยู่ฝั่ง duodenum)**",
              "**Cecal tonsils**",
              "**Meckel's diverticulum**",
              "**Lymphoid tissue บนผนัง cloaca**",
              "**Annular bands of lymphoid tissue ใน jejunum และ ileum พบใน Duck**"
            ]
          },
          {
            "text": "หน้าเดียวกันยังสรุป **BALT อยู่ที่ผนังของ primary และ secondary bronchi** และ Head-associated lymphoid tissues เช่น CALT (Conjunctiva-associated lymphoid tissues)"
          }
        ]
      },
      {
        "heading": "GALT: ภาพตำแหน่งและภาพจุลกายวิภาค",
        "source": "Avian p.30-33",
        "body": [
          {
            "text": "หน้า 30 เป็นแผนภาพ Chicken intestinal tract ชี้ตำแหน่ง GALT ทั้งชุด (pharyngeal tonsil ที่ roof of the pharynx, esophageal tonsil, pyloric tonsil, Peyer's patches, Meckel's diverticulum ที่รอยต่อ duodenum กับ jejunum, cecal tonsils ที่ apical wall of the cecum, cloacal bursa และ lymphoid tissue ที่ dorsal wall of the proctodeum) อ้างอิง C. Casteleyn M. et al., 2010 Avian Pathology และ Histology of the bird, Ghent University"
          },
          {
            "text": "หน้า 31 เป็นภาพ GALT ชี้ **lymphoid aggregates located within the lamina propria** พร้อม crypts, connective tissue และ B lymphocytes in the follicle"
          },
          {
            "text": "หน้า 32 เป็น schematic ของ immune cell compartments ใน small intestine คู่กับภาพ chicken ileum ที่เห็น villi และ crypts (ตัวย่อ IEL = intraepithelial lymphocyte, NK = natural killer) อ้างอิง Adrian L et al. ใน Avian Immunology (3rd ed.), 2022"
          },
          {
            "text": "หน้า 33 เป็น Cecal tonsil ชี้ crypt of tonsil, septum, lumen, tunica muscularis, lamina propria, lymphoid follicles และ aggregated lymphoid tissue"
          },
          {
            "callout": "หน้า 30-33 เป็นภาพและ label เป็นหลัก สไลด์ไม่ได้เขียนกลไกการทำงานของ GALT เพิ่มจากหน้า 29",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "BALT",
        "source": "Avian p.34",
        "body": [
          {
            "bullets": [
              "**Lymphoid tissue ของ BALT ประกอบด้วย aggregations of lymphocytes และ lymphatic nodules**",
              "**อยู่ใต้ epithelium ของ bronchus หรือแทรกเข้าไปใน covering epithelium จนกลายเป็น lymphoepithelium หรือ follicle associated epithelium (FAE)**"
            ]
          },
          {
            "text": "ภาพประกอบเป็น 2° Bronchus"
          }
        ]
      },
      {
        "heading": "Respiratory system: Conducting part",
        "source": "Avian p.35",
        "body": [
          {
            "sub": "ลำดับทางเดินอากาศ",
            "body": [
              {
                "bullets": [
                  "**Trachea** (สไลด์ยังชี้ Syrinx และ Bronchus ในแผนภาพ)",
                  "**1° Bronchi** แยกเป็น Extrapulmonary 1° bronchi และ Intrapulmonary 1° bronchi (mesobronchi)",
                  "**2° Bronchi**",
                  "**3° Bronchi (parabronchi) ซึ่ง anastomoses กันเอง โดย small air capillaries รวมเป็นเครือข่ายใหญ่ที่เชื่อม tertiary bronchi เข้าด้วยกัน**",
                  "**Air sac**"
                ]
              }
            ]
          },
          {
            "sub": "Air sac",
            "body": [
              {
                "bullets": [
                  "**Epithelium เป็น simple squamous epithelial cells รองด้วย collagen และ elastic CNT ชั้นบาง และ poorly vascularized**",
                  "**Not participate in the gas exchange**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Trachea",
        "source": "Avian p.36",
        "body": [
          {
            "bullets": [
              "**Overlapping complete tracheal ring ที่เป็น hyaline cartilage**",
              "**Intraepithelial mucous gland**",
              "**Ciliated pseudostratified columnar epithelium**"
            ]
          },
          {
            "callout": "สไลด์เขียนคำว่า Goblet cells ทิ้งไว้พร้อมเครื่องหมายคำถาม (Goblet cells ?) แปลว่าอาจารย์ตั้งคำถามค้างไว้ สไลด์ไม่ได้บอกคำตอบว่ามีหรือไม่มี",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Respiratory system: Gas-exchanged part",
        "source": "Avian p.38-39",
        "body": [
          {
            "sub": "ลำดับจนถึงจุดแลกเปลี่ยนก๊าซ (p.38)",
            "body": [
              {
                "text": "Primary bronchi (Mesobronchi) เข้าปอด ไป Secondary bronchi ไป Tertiary bronchi (parabronchi) ไป **Atria (air vesicles)** แล้วจึงถึง **Air capillaries ซึ่งเป็น gas exchange part** โดยมี epithelial lining เป็น type I & II pneumocytes ส่วน Air sacs แยกออกไป"
              }
            ]
          },
          {
            "sub": "จุดต่างจาก mammal (p.39)",
            "body": [
              {
                "bullets": [
                  "**ไม่มี blind ending alveoli แบบปอด mammal แต่เป็น anastomosing air capillaries แทน**",
                  "**2° bronchi เชื่อมถึงกันด้วยเครือข่ายของ 3° bronchi หรือ parabronchi**",
                  "**Parabronchus เป็น lung unit และ anastomoses กันเอง**",
                  "Atria (air vesicle) นำไปสู่ air capillaries",
                  "**Gas exchange เกิดระหว่าง blood capillaries กับ air capillaries ในผนังของ parabronchi**",
                  "Arterioles และ venules พบได้ใน interparabronchial septa ส่วนหลอดเลือดใหญ่กว่านั้นวิ่งไปตามการแตกแขนงของ primary และ secondary bronchi"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 37 เป็นภาพเทียบปอด Dog และ Mouse ชี้ Type II cuboidal cells ที่สร้าง surfactant และตำแหน่ง gas exchange ของ mammal ไว้ให้เห็นความต่างกับนก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Lung: epithelium ของแต่ละระดับ bronchus",
        "source": "Avian p.40-41",
        "body": [
          {
            "bullets": [
              "**Intrapulmonary 1° bronchus (mesobronchus): ciliated pseudostratified columnar epithelium มี goblet cells และ mucous glands ผนังรองรับด้วย cartilaginous plates**",
              "**2° bronchus: ciliated simple หรือ pseudostratified columnar epithelium มี goblet cells, cartilaginous plates แทบไม่มีแล้ว แต่ muscular layer พัฒนาดีกว่า และมี BALT ใน lamina propria**",
              "**3° bronchus (parabronchus): simple columnar epithelium, anastomoses กันเอง โดย small respiratory air capillaries สร้างเครือข่ายเชื่อม tertiary bronchi**",
              "**Atria: simple squamous epithelium**"
            ]
          },
          {
            "text": "หน้า 40 เป็นภาพ parabronchi ของไก่ (schematic คู่กับ SEM x50) ที่เทียบว่า Atria เทียบได้กับ alveolar duct และ air capillaries เทียบได้กับ alveoli อ้างอิง Liebich H.G. ใน Vet histology of domestic mammals and birds 5th ed."
          }
        ]
      },
      {
        "heading": "Gastrointestinal system: ภาพรวมอวัยวะ",
        "source": "Avian p.42-43",
        "body": [
          {
            "bullets": [
              "**Mouth: beak**",
              "**Oropharynx: no teeth / no soft palate**",
              "**Esophagus, Crop**",
              "**Proventriculus, Ventriculus (gizzard)**",
              "**Small intestine: Duodenum / Jejunum / Ileum**",
              "**Large intestine, Cecum**",
              "**Liver, Pancreas, Gall bladder**"
            ]
          },
          {
            "text": "หน้า 43 เป็นภาพ Histologic organization of the entire digestive tube อ้างอิง Zachary J.F. ใน Pathologic Basis of Vet Disease 7th ed. ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "Esophagus",
        "source": "Avian p.44",
        "body": [
          {
            "bullets": [
              "**Longitudinal fold บนผิวด้านใน**",
              "**T. mucosa: epithelial lining เป็น thick non-keratinized stratified squamous epithelium**",
              "**L. propria: มี mucous glands (esophageal gland)**",
              "T. submucosa (สไลด์กำกับว่า esophageal gland ในตำแหน่งนี้พบใน dog)",
              "T. muscularis: inner circular / outer longitudinal muscle",
              "T. adventitia",
              "**Esophageal tonsil: lymphoid tissue ที่ distal esophagus**"
            ]
          }
        ]
      },
      {
        "heading": "Esophagus เทียบ Crop",
        "source": "Avian p.45",
        "body": [
          {
            "text": "ทั้งสองบุด้วย **non-keratinized stratified squamous epithelium** เหมือนกัน และภาพชี้ l.propria, muscularis mucosae (mm.), T. submucosa และ T. muscularis"
          },
          {
            "bullets": [
              "**Esophagus: mucous glands occur in l.propria**",
              "**Crop: no mucous glands in l.propria โดยต่อมจะมีเฉพาะบริเวณรูเปิด (glands are present only at the opening)**"
            ]
          },
          {
            "callout": "หน้า 45 เป็นสไลด์ภาพเทียบสองช่อง ให้ยึดหน้า 44 ที่เขียนชัดว่า esophagus มี mucous gland ใน l.propria เป็นหลักในการจำว่าฝั่งไหนเป็นฝั่งไหน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Proventriculus (glandular stomach)",
        "source": "Avian p.47",
        "body": [
          {
            "bullets": [
              "**Circular fold mucosa เป็น finger-like projection (mucosal ridge)**",
              "**Tunica mucosa: simple columnar epithelium และไม่มี goblet cells**",
              "**Mucosal tubular gland หลั่ง mucous**",
              "**Muscularis mucosae: scanty and discontinuous**",
              "**Tunica submucosa: มี submucosal compound glands (gastric gland) เรียกว่า ADENOMIA จัดเป็น lobule บุด้วย columnar lining epithelium และหลั่งทั้ง HCl และ pepsinogen คือทำหน้าที่ของทั้ง parietal cell และ chief cell**",
              "**Tunica muscularis: two thin muscular layers**"
            ]
          },
          {
            "callout": "จุดต่างที่ออกสอบง่ายคือ ใน mammal (หน้า 46 ใช้ fundic stomach ของ dog เทียบ) gastric gland อยู่ใน l.propria และแยกเป็น chief cell ที่หลั่ง pepsinogen ติดสี basophilic กับ parietal cell ที่หลั่ง HCl ติดสี eosinophilic แต่ใน proventriculus ของนก ต่อมหลักอยู่ใน submucosa",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Ventriculus (Gizzard): muscular stomach",
        "source": "Avian p.48-49",
        "body": [
          {
            "text": "**หน้าที่คือ grinding and mixing of ingesta**"
          },
          {
            "sub": "Cuticle (pedicle) หรือ koilin layer",
            "body": [
              {
                "bullets": [
                  "**เป็น CHO-Protein complex**",
                  "**ทำหน้าที่ protect mucosa from digestion by acid and enzyme from proventriculus**",
                  "**เป็นชั้นหนา แข็ง คล้าย keratin คลุมบน epithelium**"
                ]
              }
            ]
          },
          {
            "sub": "ชั้นของผนัง",
            "body": [
              {
                "bullets": [
                  "**T. mucosa: simple columnar epithelium, lamina propria เป็น CNT ที่มี branched tubular mucosal gland (gizzard gland) และไม่มี muscularis mucosae**",
                  "T. submucosa: loose CNT",
                  "**T. muscularis: very thick smooth muscle**",
                  "T. adventitia: collagenous meshwork"
                ]
              }
            ]
          },
          {
            "text": "สไลด์หน้า 48 ยังกำกับไว้ว่า **Proteolysis site (pH 1.5-2.5)**"
          }
        ]
      },
      {
        "heading": "Intestine",
        "source": "Avian p.50-51",
        "body": [
          {
            "text": "**Small intestine คล้ายของ mammals แต่ villi สม่ำเสมอกว่าตลอดความยาว (villi are more uniform throughout its length)**"
          },
          {
            "bullets": [
              "Simple columnar epithelium ที่มี goblet cells",
              "Intestinal mucosal glands",
              "L. propria และ T. submucosa มี diffuse lymphatic tissue"
            ]
          },
          {
            "sub": "Differences ที่สไลด์เน้น",
            "body": [
              {
                "bullets": [
                  "**ไม่มี duodenal glands (submucosal gland) ใน chickens, ducks และ geese**",
                  "**Submucosa บางมาก (extremely thin submucosa)**"
                ]
              }
            ]
          },
          {
            "text": "หน้า 51 เป็นภาพเทียบ duodenum x40, jejunum x25, ileum x25 และ cecum x25 ของไก่ ชี้ intestinal villi ที่บุด้วย simple columnar epithelium, l.propria ที่มี lymphatic tissue, intestinal gland (crypt), T. submucosa บาง และ T. muscularis อ้างอิง Hans-Georg Liebich, Veterinary Histology of Domestic Mammals and Birds 5th ed. ข้อสังเกตจากภาพคือ cecum ของไก่ก็มี intestinal villi"
          }
        ]
      },
      {
        "heading": "Liver",
        "source": "Avian p.52-53",
        "body": [
          {
            "bullets": [
              "**คลุมด้วย mesothelium และ Glisson's capsule**",
              "**แบ่งเป็น lobe แต่ lobule ไม่ชัดเจน (indistinct lobule)**",
              "**Liver unit เหมือน mammals คือมี central vein ที่มี cords ของ hepatocytes เรียงเป็นรัศมีรอบ ๆ และถูกคั่นด้วย sinusoids**",
              "**Hepatic cords ในนกส่วนใหญ่หนา 2 เซลล์ (two cells thick) คั่นกันด้วย sinusoids**",
              "**Sinusoids เต็มไปด้วย nucleated erythrocytes**",
              "มี branch of the portal vein, branch of hepatic artery และ vein และ bile duct (portal triad)"
            ]
          },
          {
            "text": "หน้า 53 แปะ caption ตำราของ Gordillo M. et al., Development 2015 ที่อธิบายโครง lobule ของตับทั่วไป รวม stellate (Ito) cells ใน space of Disse, Kupffer cells ที่เป็น macrophage ของตับ, bile canaliculi และ cholangiocytes ที่บุ bile duct"
          }
        ]
      },
      {
        "heading": "Liver: Extramedullary hematopoiesis",
        "source": "Avian p.54-55",
        "body": [
          {
            "text": "**EMH = Extramedullary hematopoiesis คือการสร้างเม็ดเลือดในอวัยวะนอก bone marrow ซึ่งสไลด์ระบุว่า common in both normal and diseased birds**"
          },
          {
            "text": "ภาพหน้า 55 เป็น extramedullary myelopoiesis คือ **large collection of granulocytic myeloid cells ที่มี characteristic red cytoplasmic granules (myelocytes) อยู่รอบ central vein** สไลด์อธิบายว่า focus นี้เป็น myelopoietic เป็นหลักเพราะประกอบด้วย myelocytes ในระยะการเจริญที่ต่างกัน"
          },
          {
            "callout": "จุดนี้สำคัญตอนอ่านสไลด์ตับนก เจอกลุ่มเซลล์เม็ดเลือดในตับแล้วอย่ารีบตีความว่าผิดปกติ สไลด์บอกว่าพบได้ทั้งในนกปกติและนกป่วย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Pancreas",
        "source": "Avian p.57",
        "body": [
          {
            "text": "สไลด์อ้างประโยคว่า The pancreas of the chicken resembles that of the mammal"
          },
          {
            "bullets": [
              "**Exocrine portion เป็น tubuloacinar**",
              "**Lobulation ไม่ชัดเจน และขาด interlobular CNT**",
              "**มี islets of Langerhans จำนวนมาก (abundant)**",
              "**Islet มี 2 ชนิด คือ alpha (glucagon) และ beta (insulin)**"
            ]
          }
        ]
      },
      {
        "heading": "Urinary system: Kidney",
        "source": "Avian p.59-61",
        "body": [
          {
            "sub": "การแบ่งส่วน",
            "body": [
              {
                "bullets": [
                  "**แต่ละ subdivision ประกอบด้วย lobules จำนวนมาก**",
                  "**หนึ่ง lobule แบ่งเป็น cortex (พื้นที่ใหญ่) และ medulla (แคบ)**",
                  "**กลุ่ม lobule ที่ระบายเข้าสู่ branch ของ ureter เดียวกันประกอบกันเป็น lobe**"
                ]
              }
            ]
          },
          {
            "sub": "Nephron มี 2 ชนิด (จุดที่ต้องแยกให้ออก)",
            "body": [
              {
                "bullets": [
                  "**Cortical (reptilian) type: จำนวนมากกว่า, ไม่มี loop of Henle, อยู่ใน cortex ทั้งหมด และ renal corpuscle มีขนาดเล็ก**",
                  "**Medullary (mammalian) type: จำนวนน้อยกว่า, renal corpuscle ขนาดใหญ่และอยู่ใกล้ renal medulla, มี loop of Henle ที่ทอดลงไปถึง renal medulla**"
                ]
              }
            ]
          },
          {
            "text": "ภาพชี้ Medullary cone ประกอบ ส่วนหน้า 58 เป็นภาพ Kidney ของ Dog และหน้า 61 เป็นภาพ Renal cortex อย่างเดียว ไม่มีข้อความอธิบาย"
          }
        ]
      },
      {
        "heading": "Medullary cone และ Ureter",
        "source": "Avian p.62",
        "body": [
          {
            "bullets": [
              "**Medullary cone ประกอบด้วย collecting duct, loops tubules ของ mammalian nephrons, ureteral branches และ capillaries**",
              "**Ureter บุด้วย pseudostratified columnar epithelium ที่มีเซลล์ 2 ชนิด**",
              "**Basal cuboidal cells**",
              "**Columnar cells ที่มี apical vacuoles บรรจุ mucopolysaccharide ซึ่งสร้าง mucous เพื่อ precipitate acid**"
            ]
          }
        ]
      },
      {
        "heading": "รายการสไลด์ LAB ที่ต้องดูให้ครบ",
        "source": "Avian p.63",
        "body": [
          {
            "text": "หน้าสุดท้ายเป็นรายการสไลด์ปฏิบัติการ 12 รายการ ใช้เช็คว่าดูครบหรือยัง"
          },
          {
            "bullets": [
              "B 157: Blood",
              "Thymus (chicken)",
              "Bursa of Fabricius",
              "Spleen chicken",
              "B 184, 01B49-1: Lung",
              "B 182: Trachea",
              "Esophagus and crop (Chicken)",
              "B 158: Gizzard",
              "Proven Chicken",
              "Cecum chicken",
              "Liver chicken",
              "Kidney chicken"
            ]
          },
          {
            "callout": "รายการ LAB ไม่มีสไลด์ระบบสืบพันธุ์เช่นกัน สอดคล้องกับที่เนื้อ deck ไม่มี ovary/oviduct/testis ทั้งที่ประกาศไว้ใน scope",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "histo--bone-marrow-laboratory": {
    "topic": "histo--bone-marrow-laboratory",
    "title": "Bone Marrow Laboratory",
    "icon": "🔬",
    "lecturer": "Associate Professor Dr. Paisan Tienthai, Ph.D., Department of Anatomy, Faculty of Veterinary Science, Chulalongkorn University",
    "summary": "เดคแลป Bone Marrow ทั้งหมด 56 สไลด์ แต่เนื้อความจริง ๆ มีแค่ 4 สไลด์แรก คือ lab checklist ของ Erythropoiesis, Granulopoiesis และ Platelet formation ที่ต้องหาให้เจอในกล้อง ส่วนที่เหลือ (หน้า 5-55) เป็นภาพ bone marrow smear ที่มีแต่ป้ายชื่อเซลล์ชี้ลงบนภาพ ไม่มีข้อความอธิบายลักษณะ ไม่มีเกณฑ์แยกเซลล์ ไม่มีตัวเลขใด ๆ แบ่งเป็น 2 ส่วนตามวิธีย้อม คือ Wright-Giemsa staining (ภาพที่ 1-45) และ Papanicolaou method (ภาพที่ 1-4) สไลด์สุดท้ายคือ QUESTIONS? โน้ตนี้จึงทำได้แค่รวบรวม checklist ตามที่สไลด์เขียน แล้วทำดัชนีว่าเซลล์แต่ละตัวถูกกำกับไว้ที่ภาพหน้าไหนบ้าง เพื่อใช้เปิดเทียบตอนส่องกล้อง",
    "sections": [
      {
        "heading": "เดคนี้คืออะไร และอ่านมันยังไง",
        "source": "Bone Marrow Laboratory p.1",
        "body": [
          {
            "text": "สไลด์แรกเป็นหน้าปกล้วน BONE MARROW LABORATORY โดย Associate Professor Dr. Paisan Tienthai, Ph.D. จาก Department of Anatomy คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
          },
          {
            "text": "**เดคนี้เป็นเดคแลป ไม่ใช่เดคเลกเชอร์** โครงของมันคือ lab checklist 3 หน้า แล้วตามด้วยภาพ bone marrow smear ที่กำกับชื่อเซลล์ไว้บนภาพเป็นสิบ ๆ หน้า"
          },
          {
            "callout": "สไลด์ไม่ได้บอกเกณฑ์การแยกเซลล์เลย ไม่มีคำอธิบายเรื่องขนาดเซลล์ สี cytoplasm รูปร่าง nucleus หรือ chromatin pattern ในเดคนี้ ทุกอย่างเป็นแค่ป้ายชื่อชี้ลงบนภาพ ถ้าต้องการเกณฑ์แยกต้องไปหาจากเลกเชอร์หรือ atlas อื่น",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Lab checklist 1 — Erythropoiesis",
        "source": "Bone Marrow Laboratory p.2",
        "body": [
          {
            "text": "รายการเซลล์สาย Erythropoiesis ที่สไลด์สั่งให้หาในแลป เรียงตามที่สไลด์เขียน"
          },
          {
            "bullets": [
              "Rubriblast",
              "Prorubricyte (+/-)",
              "Basophilic rubricyte",
              "Polychromatic rubricyte",
              "Normochromatic rubricyte (+/-)",
              "Metarubricyte",
              "Reticulocyte (-)",
              "Erythrocyte in bone marrow smear"
            ]
          },
          {
            "text": "**สังเกตว่า Reticulocyte ถูกกำกับด้วย (-) เพียงตัวเดียวในลิสต์นี้** และมีอีก 2 ตัวคือ Prorubricyte กับ Normochromatic rubricyte ที่กำกับ (+/-)"
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าเครื่องหมาย (+/-) และ (-) หมายถึงอะไร ทั้งเดคไม่มีคำอธิบายสัญลักษณ์นี้ ต้องถามอาจารย์ในแลป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lab checklist 2 — Granulopoiesis",
        "source": "Bone Marrow Laboratory p.3",
        "body": [
          {
            "text": "สาย Granulopoiesis เป็นลิสต์ที่ยาวที่สุดในเดค เพราะแตกย่อยเป็น neutrophilic, eosinophilic และ basophilic ในทุกขั้นตั้งแต่ myelocyte ลงมา"
          },
          {
            "sub": "ขั้นต้น",
            "body": [
              {
                "bullets": [
                  "Myeloblast",
                  "Progranulocyte (+/-)",
                  "Promyelocyte (+/-)"
                ]
              }
            ]
          },
          {
            "sub": "Myelocyte",
            "body": [
              {
                "bullets": [
                  "Neutrophilic myelocyte",
                  "Eosinophilic myelocyte",
                  "Basophilic myelocyte (+/-)"
                ]
              }
            ]
          },
          {
            "sub": "Metamyelocyte",
            "body": [
              {
                "bullets": [
                  "Neutrophilic metamyelocyte",
                  "Eosinophilic metamyelocyte",
                  "Basophilic metamyelocyte (+/-)"
                ]
              }
            ]
          },
          {
            "sub": "Band cell",
            "body": [
              {
                "bullets": [
                  "Neutrophilic band cell",
                  "Eosinophilic band cell",
                  "Basophilic band cell (+/-)"
                ]
              }
            ]
          },
          {
            "text": "**ทุกสาย basophilic ในลิสต์นี้ถูกกำกับ (+/-) หมดทั้ง myelocyte, metamyelocyte และ band cell** ส่วน neutrophilic กับ eosinophilic ไม่มีเครื่องหมาย"
          },
          {
            "callout": "สไลด์ลิสต์ Progranulocyte กับ Promyelocyte เป็นคนละบรรทัดกัน แต่ไม่ได้อธิบายว่าสองคำนี้ต่างกันยังไง และในภาพหน้า 44 ก็ปรากฏทั้งสองป้ายอยู่บนสไลด์เดียวกัน สไลด์ไม่ได้บอกว่าแยกจากอะไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lab checklist 3 — Platelet formation",
        "source": "Bone Marrow Laboratory p.4",
        "body": [
          {
            "text": "ลิสต์สั้นที่สุด มีแค่ 2 รายการ"
          },
          {
            "bullets": [
              "Megakaryocyte",
              "Effete megakaryocyte"
            ]
          },
          {
            "text": "**Effete megakaryocyte ถูกแยกเป็นรายการต่างหากจาก Megakaryocyte** และในเดคมีภาพกำกับคำนี้ไว้จริง 2 ภาพ (หน้า 18 และหน้า 47) แต่สไลด์ไม่ได้บอกว่า effete ต่างจากตัวปกติอย่างไร"
          },
          {
            "callout": "checklist ไม่ได้ลิสต์ platelet หรือ thrombocyte เป็นรายการที่ต้องหา หัวข้อนี้จบที่ megakaryocyte เท่านั้น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "โครงของภาพ — 2 วิธีย้อม",
        "source": "Bone Marrow Laboratory p.5, p.51",
        "body": [
          {
            "text": "เดคแบ่งภาพเป็น 2 ชุดด้วยสไลด์คั่นหัวข้อ"
          },
          {
            "bullets": [
              "**BONE MARROW SMEAR WITH WRIGHT-GIEMSA STAINING** (สไลด์คั่นหน้า 5) ตามด้วยภาพหน้า 6-50 ซึ่งมีเลขกำกับภาพเป็น 1-45 ที่มุมสไลด์",
              "**BONE MARROW SMEAR WITH PAPANICOLAOU METHOD** (สไลด์คั่นหน้า 51) ตามด้วยภาพหน้า 52-55 ซึ่งมีเลขกำกับภาพเป็น 1-4 นับใหม่"
            ]
          },
          {
            "text": "เลขภาพจะรีเซ็ตเมื่อเปลี่ยนวิธีย้อม ดังนั้นเวลาอ้างอิงในแลปต้องบอกด้วยว่าเป็นภาพของชุดย้อมไหน ไม่งั้น \"ภาพที่ 1\" กำกวมทันที"
          },
          {
            "callout": "สไลด์ไม่ได้เปรียบเทียบว่า Wright-Giemsa กับ Papanicolaou ให้ภาพต่างกันอย่างไร แค่ตั้งเป็นหัวข้อคั่นเฉย ๆ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ดัชนีภาพ Wright-Giemsa — สาย erythroid",
        "source": "Bone Marrow Laboratory p.6-50",
        "body": [
          {
            "text": "ใช้เปิดเทียบตอนส่องกล้อง เลขคือหน้าสไลด์ในเดค (ภาพชุด Wright-Giemsa เริ่มที่หน้า 6 = ภาพที่ 1)"
          },
          {
            "bullets": [
              "Rubriblast — หน้า 6, 7, 13 (มี 2 ตัวในภาพเดียว), 20, 24, 26, 27, 34, 38, 39, 42, 45, 46",
              "Prorubricyte — หน้า 16 และ 41 เท่านั้น",
              "Basophilic rubricyte — พบมาก เช่น หน้า 7, 8, 9, 10, 12, 13, 15, 17, 31, 35, 41",
              "Polychromatic rubricyte — เป็นเซลล์ที่ถูกกำกับบ่อยที่สุดในเดค แต่ปรากฏใน 18 ภาพจาก 45 ภาพของชุด Wright-Giemsa คือ หน้า 6, 7, 8, 10, 11, 12, 13, 16, 17, 20, 23, 24, 27, 30, 37, 40, 43, 45",
              "Normochromatic rubricyte — หน้า 13 และ 45 เท่านั้น",
              "Metarubricyte — หน้า 14, 17, 20, 23",
              "RBC — กำกับไว้ที่ภาพแรกภาพเดียว คือหน้า 6"
            ]
          },
          {
            "text": "**Prorubricyte และ Normochromatic rubricyte ซึ่งเป็นสองตัวที่ checklist กำกับ (+/-) ปรากฏในชุด Wright-Giemsa แค่ตัวละ 2 ภาพเท่านั้น** ส่วน Reticulocyte ที่ checklist กำกับ (-) ไม่มีภาพไหนในเดคกำกับชื่อนี้เลย"
          }
        ]
      },
      {
        "heading": "ดัชนีภาพ Wright-Giemsa — สาย granulocytic",
        "source": "Bone Marrow Laboratory p.6-50",
        "body": [
          {
            "bullets": [
              "Myeloblast — หน้า 33 ภาพเดียวในทั้งเดค",
              "Progranulocyte — หน้า 44 ภาพเดียว (อยู่ภาพเดียวกับป้าย Promyelocyte)",
              "Promyelocyte — หน้า 6, 9, 14, 15, 17, 19, 35, 37, 44",
              "Eosinophilic Promyelocyte — หน้า 25 (สไลด์เขียนแยกเป็นคำนี้ แม้ checklist หน้า 3 จะไม่ได้ลิสต์ไว้)",
              "Neutrophilic myelocyte — หน้า 7 และ 46",
              "Eosinophilic myelocyte — หน้า 8 และ 23",
              "Neutrophilic metamyelocyte — พบมาก เช่น หน้า 7, 8, 9, 10, 11, 14, 15, 17, 19, 23, 28, 29, 30, 36, 40, 42, 43",
              "Eosinophilic metamyelocyte — หน้า 10 และ 24",
              "Basophilic metamyelocyte — หน้า 10, 11, 42",
              "Neutrophilic band cell — พบมากที่สุดในสายนี้ หน้า 32 มีกำกับไว้ถึง 5 ตำแหน่งในภาพเดียว"
            ]
          },
          {
            "callout": "**เซลล์ 3 ตัวใน checklist ที่ไม่มีภาพไหนในเดคกำกับชื่อไว้เลย คือ Basophilic myelocyte, Eosinophilic band cell และ Basophilic band cell** ทั้งสามตัวเป็นตัวที่ checklist กำกับ (+/-) ไว้ ยกเว้น Eosinophilic band cell ที่ไม่มีเครื่องหมาย สไลด์ไม่ได้บอกว่าให้ไปหาจากที่ไหนแทน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ดัชนีภาพ Wright-Giemsa — Megakaryocyte",
        "source": "Bone Marrow Laboratory p.18, p.21-22, p.39, p.47",
        "body": [
          {
            "bullets": [
              "Megakaryocyte — หน้า 21 และ 22 เป็นภาพที่มีป้ายเดียวทั้งภาพ (ภาพเน้น megakaryocyte ล้วน) และหน้า 39 อยู่คู่กับ Rubriblast",
              "**Effete megakaryocyte — หน้า 18 และ 47 ทั้งสองภาพมีป้ายนี้ป้ายเดียวทั้งภาพ**"
            ]
          }
        ]
      },
      {
        "heading": "ภาพ bone marrow section ของ cat fetus",
        "source": "Bone Marrow Laboratory p.48-50",
        "body": [
          {
            "text": "3 หน้าสุดท้ายของชุด Wright-Giemsa เปลี่ยนจาก smear ไปเป็น section สไลด์เขียนกำกับชัดว่าเป็น **bone marrow section of cat fetus**"
          },
          {
            "bullets": [
              "หน้า 48 — Megakaryocyte in bone marrow section of cat fetus",
              "หน้า 49 — Megakaryocyte in bone marrow section of cat fetus (กำกับ 2 ตำแหน่ง)",
              "หน้า 50 — **Osteoclast** in bone marrow section of cat fetus (กำกับ 2 ตำแหน่ง)"
            ]
          },
          {
            "callout": "**Osteoclast ไม่ได้อยู่ใน lab checklist ทั้ง 3 หน้าเลย** แต่โผล่มาเป็นภาพในเดค สไลด์ไม่ได้บอกว่าต้องหาในแลปด้วยหรือไม่ และไม่ได้อธิบายว่าทำไม osteoclast ถึงอยู่ในภาพ bone marrow",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ชุด Papanicolaou method",
        "source": "Bone Marrow Laboratory p.51-55",
        "body": [
          {
            "text": "ชุดนี้สั้นมาก มีแค่ 4 ภาพ และกำกับเฉพาะเซลล์สาย erythroid ปลายทางเท่านั้น"
          },
          {
            "bullets": [
              "หน้า 52 (ภาพที่ 1) — Metarubricyte",
              "หน้า 53 (ภาพที่ 2) — Metarubricyte",
              "หน้า 54 (ภาพที่ 3) — Normochromatic rubricyte และ Polychromatic rubricyte",
              "หน้า 55 (ภาพที่ 4) — Metarubricyte"
            ]
          },
          {
            "text": "**ทั้ง 4 ภาพของชุด Papanicolaou มีแต่ rubricyte กับ metarubricyte ไม่มีภาพสาย granulocytic หรือ megakaryocyte เลย**"
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าทำไมชุด Papanicolaou ถึงแสดงเฉพาะสาย erythroid และไม่ได้บอกว่าย้อมวิธีนี้แล้วเซลล์ต่างจาก Wright-Giemsa อย่างไร",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "histo--bone-marrow": {
    "topic": "histo--bone-marrow",
    "title": "Bone Marrow",
    "icon": "📖",
    "lecturer": "Associate Professor Dr. Paisan Tienthai, Ph.D., D.T.B.T., Department of Anatomy, Faculty of Veterinary Science, Chulalongkorn University",
    "summary": "เด็คนี้ครอบคลุม bone marrow ตั้งแต่นิยามและหน้าที่ ชนิด red vs yellow marrow โครงสร้าง 2 compartment (vascular และ extravascular) Monophyletic theory จากนั้นไล่ hematopoiesis ทีละสาย คือ erythropoiesis granulopoiesis agranulopoiesis (monocytopoiesis กับ lymphopoiesis) plasma cell formation และ thrombopoiesis โดยให้ลักษณะจำเพาะของแต่ละระยะ (ขนาด N:C ratio สีของ cytoplasm nucleoli) ปิดท้ายด้วยการเคลื่อนเซลล์ออกจากไขกระดูกผ่าน sinusoid วิธี aspiration และ M:E ratio ทางคลินิก ส่วนสไลด์หน้า 9, 26, 30, 48, 55-56 เป็นรูปภาพล้วนไม่มีข้อความ หน้า 13 มีเพียงคำกำกับรูปว่า (Pluripotential stem cells) และหน้า 39 เป็นหัวข้อคำถามที่สไลด์ไม่ได้ให้คำตอบไว้",
    "sections": [
      {
        "heading": "Bone marrow คืออะไร และหน้าที่",
        "source": "Bone Marrow p.2",
        "body": [
          {
            "text": "Bone marrow เป็น **soft connective tissue ที่อยู่ใน medullary cavity ของ long bones และในทุกช่องว่างระหว่าง trabeculae ของ spongy bone** เรียกอีกชื่อว่า myeloid tissue หรือ myelogenous hemopoietic tissue"
          },
          {
            "text": "ประกอบด้วย 2 ส่วน"
          },
          {
            "bullets": [
              "Vascular compartment",
              "Extravascular compartment"
            ]
          },
          {
            "sub": "Functions",
            "body": [
              {
                "bullets": [
                  "**Production of all blood cells (WBC, RBC) and platelets**",
                  "Destruction of old RBC",
                  "Storing iron"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ศัพท์ของ Hematopoiesis",
        "source": "Bone Marrow p.3",
        "body": [
          {
            "text": "การสร้างเซลล์เม็ดเลือดในไขกระดูกเรียกว่า **Hematopoiesis หรือ Hemopoiesis** แบ่งย่อยตามสายเซลล์"
          },
          {
            "bullets": [
              "**Erythropoiesis** การสร้าง red blood cell หรือ erythrocyte",
              "**Granulopoiesis** การสร้าง neutrophil, eosinophil และ basophil",
              "**Agranulopoiesis** การสร้าง monocyte (Monocytopoiesis) และการสร้าง lymphocyte (Lymphopoiesis)",
              "**Thrombopoiesis** การสร้าง platelets"
            ]
          }
        ]
      },
      {
        "heading": "Red marrow และ Yellow marrow",
        "source": "Bone Marrow p.4-6",
        "body": [
          {
            "text": "เมื่อดูด้วยกล้องจุลทรรศน์ แบ่ง bone marrow ได้ 2 ชนิด คือ red marrow และ yellow marrow"
          },
          {
            "sub": "Red marrow (Hematopoietically active)",
            "body": [
              {
                "bullets": [
                  "ในสัตว์โตเต็มวัย red marrow เป็น **ที่เดียวที่สร้างเม็ดเลือด** และจำกัดอยู่ที่ sternum, vertebrae, ribs, cranial bones และ epiphysis ของ long bones",
                  "ส่วนใน fetal และ young bones red marrow เป็น **ชนิดเดียวที่พบ**"
                ]
              }
            ]
          },
          {
            "sub": "Yellow marrow (Hematopoietically inactive)",
            "body": [
              {
                "bullets": [
                  "ส่วนใหญ่ประกอบด้วย fat cells ที่ค่อย ๆ เข้าไปแทนที่ marrow elements อื่น",
                  "**ถ้ามี adequate stimulus yellow marrow สามารถกลับไปมีลักษณะแบบ red marrow และกลับมาสร้างเม็ดเลือดได้อีก**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Vascular compartment",
        "source": "Bone Marrow p.7-8",
        "body": [
          {
            "text": "ลำดับการไหลของเลือดในไขกระดูก"
          },
          {
            "bullets": [
              "Nutrient artery แตกแขนงไปเป็น",
              "Central longitudinal arteries ซึ่งส่ง",
              "Radial branches ที่สุดท้ายเปิดเข้าสู่",
              "**Venous sinuses หรือ sinusoids (mature blood cells ทุกตัวในไขกระดูกออกผ่านทาง sinusoid นี้)** ซึ่งรวมกันเป็น",
              "Central longitudinal vein ที่นำเลือดออกจากไขกระดูกเข้าสู่ general circulation"
            ]
          },
          {
            "callout": "Notice: bone marrow ไม่มี Lymphatic drainage",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Extravascular compartment",
        "source": "Bone Marrow p.10",
        "body": [
          {
            "sub": "Stroma",
            "body": [
              {
                "bullets": [
                  "เนื้อเยื่อทั้งหมดที่ **ไม่ได้เกี่ยวข้องโดยตรง** กับหน้าที่หลักคือ hematopoiesis",
                  "ประกอบด้วย Reticular CNT (adventitial reticular cells และ fibers), Macrophages, Fat cells, Osteoblast, Osteoclast, Endothelial cells (ใน sinusoids) และ extracellular matrix"
                ]
              }
            ]
          },
          {
            "sub": "Hematopoietic tissue",
            "body": [
              {
                "bullets": [
                  "ประกอบด้วย **irregular และ anastomosing cords ที่วางตัวอยู่ระหว่าง venous sinuses**",
                  "คือเซลล์ทุกตัวที่เกี่ยวข้องกับ hematopoiesis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Monophyletic theory",
        "source": "Bone Marrow p.11-12",
        "body": [
          {
            "text": "ดังนั้น hematopoiesis เกิดขึ้นโดยเฉพาะใน hematopoietic tissue ของ red marrow และทฤษฎีที่ยอมรับกันในปัจจุบันเรียกว่า **Monophyletic theory**"
          },
          {
            "text": "Monophyletic theory กล่าวว่า **mature blood cells ทุกชนิดในร่างกายมีต้นกำเนิดจาก stem cell ชนิดเดียว** คือ Hematopoietic stem cell (HSC) หรือ Colony forming unit-stem cell (CFU-S)"
          },
          {
            "text": "HSC หรือ CFU-S แบ่งตัวไปเป็น"
          },
          {
            "bullets": [
              "**Myeloid stem cell** หรือ Colony forming unit-granulocyte, erythrocyte, monocyte and megakaryocyte (**CFU-GEMM**)",
              "**Lymphoid stem cell** หรือ Colony forming unit-lymphoid (**CFU-L**)"
            ]
          },
          {
            "text": "สไลด์หน้า 13 เขียนกำกับรูปไว้เพียงว่า (Pluripotential stem cells) ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "หลักการของ hematopoiesis และการเปลี่ยนแปลงทั่วไปของเซลล์",
        "source": "Bone Marrow p.14-15",
        "body": [
          {
            "sub": "Principle in hematopoiesis",
            "body": [
              {
                "bullets": [
                  "**All bone marrow เป็น primary site ของการสร้างเม็ดเลือดในสัตว์โตเต็มวัย**",
                  "Blood cells มีอายุสั้น",
                  "Late stage และ mature blood cells ไม่สามารถทำ mitosis ได้",
                  "Stem cells ในไขกระดูกต้องถูกเก็บรักษาและเติมกลับ (preserved and refilled)",
                  "การสร้างต้องอาศัยทั้ง cell proliferation และ cell maturation"
                ]
              }
            ]
          },
          {
            "sub": "General cellular changes จาก young cell ไป mature cell",
            "body": [
              {
                "bullets": [
                  "**ขนาดเซลล์เล็กลง ยกเว้น megakaryocyte**",
                  "N/C ratio ลดลง",
                  "Nuclear density เพิ่มขึ้น (จางไปเข้ม)",
                  "Nucleolus หดเล็กลงหรือหายไป",
                  "จากไม่มี specific granule จนพบ specific granules"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Erythropoiesis ลำดับขั้นและ essential events",
        "source": "Bone Marrow p.16-18",
        "body": [
          {
            "text": "Erythropoiesis คือกระบวนการพัฒนาที่นำไปสู่การเกิด mature erythrocytes โดยมวลรวมของ circulating erythrocytes กับ marrow erythropoietic tissue เรียกว่า **Erythron**"
          },
          {
            "sub": "ลำดับขั้น",
            "body": [
              {
                "text": "Myeloid stem cell CFU-GEMM > BFU-E > **CFU-E ซึ่งถูกกระตุ้นโดย erythropoietin** > Rubriblast > Prorubricyte > Basophilic rubricyte > Polychromatic rubricyte > Normochromatic rubricyte > Metarubricyte > Reticulocyte > Erythrocyte หรือ RBC"
              }
            ]
          },
          {
            "sub": "Essential events",
            "body": [
              {
                "bullets": [
                  "ขนาดเซลล์และสีของ cytoplasm ลดลง",
                  "**Cytoplasm เปลี่ยนจาก basophilic (ribosome) ไปเป็น acidophilic (hemoglobin)**",
                  "Nucleus เล็กลง เกิด pyknosis และถูก extrusion ออก",
                  "Nuclear chromatin condense มากขึ้น",
                  "Nucleoli มีตอนแรกและหายไปในที่สุด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ลักษณะจำเพาะของแต่ละระยะใน erythroid series",
        "source": "Bone Marrow p.19-25, 27",
        "body": [
          {
            "sub": "Rubriblast (p.19)",
            "body": [
              {
                "bullets": [
                  "รูปร่าง spherical หรือ oval เส้นผ่านศูนย์กลางประมาณ 15-19 µm",
                  "**N:C ratio = 8:1**",
                  "Cytoplasm สีน้ำเงินเข้ม (ribosome สูง)",
                  "Nucleus สีม่วงจาง chromatin กระจาย พบ nucleoli 1-3 อันหรือมากกว่า"
                ]
              }
            ]
          },
          {
            "sub": "Prorubricyte (p.20)",
            "body": [
              {
                "bullets": [
                  "คล้าย rubriblast **ยกเว้นไม่มี nucleoli**",
                  "N:C ratio = 7:1",
                  "Cytoplasm ยังสีน้ำเงินเข้ม",
                  "Nuclear chromatin เริ่ม condensation ที่ระยะนี้"
                ]
              }
            ]
          },
          {
            "sub": "Basophilic rubricyte (p.21)",
            "body": [
              {
                "bullets": [
                  "ขนาดประมาณ 14-16 µm, N:C ratio = 6:1",
                  "**Nucleus มี clumped chromatin เรียงแบบ radial pattern (checkerboard)** และไม่มี nucleoli",
                  "Cytoplasm สีน้ำเงินเข้ม"
                ]
              }
            ]
          },
          {
            "sub": "Polychromatic rubricyte (p.22)",
            "body": [
              {
                "bullets": [
                  "ขนาดประมาณ 10-12 µm, N:C ratio = 2:1",
                  "Nucleus เข้มและ condensed มี clumped chromatin ชัดเจน",
                  "Cytoplasm สี muddy bluish red (hemoglobin ค่อย ๆ เพิ่มขึ้น)",
                  "**Mitotic division หยุดที่ระยะนี้**"
                ]
              }
            ]
          },
          {
            "sub": "Normochromatic rubricyte (p.23)",
            "body": [
              {
                "bullets": [
                  "ขนาดประมาณ 8-10 µm, N:C ratio = 2:1",
                  "Nucleus แน่น (dense)",
                  "Cytoplasm สี reddish orange มากกว่า polychromatic rubricyte"
                ]
              }
            ]
          },
          {
            "sub": "Metarubricyte (p.24)",
            "body": [
              {
                "bullets": [
                  "ขนาดประมาณ 6-9 µm, **N:C ratio = 1:2**",
                  "Nucleus เป็น pyknotic และอาจถูก extrude บางส่วนหรือแตกเป็นชิ้น",
                  "Cytoplasm slightly polychromatic หรือ normochromatic ขึ้นกับปริมาณ hemoglobin"
                ]
              }
            ]
          },
          {
            "sub": "Reticulocyte (p.25)",
            "body": [
              {
                "bullets": [
                  "ขนาดประมาณ 7-8 µm, **nucleus ถูก extrude ออกไปแล้ว**",
                  "Cytoplasm สีน้ำเงินขุ่นเล็กน้อยจาก residual RNA และ reticulum ที่ปนกับ eosinophilic ของ hemoglobin",
                  "หายากใน bone marrow smear ที่ย้อมด้วย Wright-Giemsa"
                ]
              }
            ]
          },
          {
            "sub": "Erythrocyte (p.27)",
            "body": [
              {
                "bullets": [
                  "**ระยะสุดท้ายของการ maturation เกิดขึ้นติดกับผนังของ venous sinus ซึ่งเป็นจุดที่ metarubricyte เริ่มเบียดตัวผ่าน endothelial lining**",
                  "ขนาดประมาณ 7-7.5 µm ขึ้นกับชนิดสัตว์",
                  "ไม่มี nucleus และ cytoplasm สี red orange"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Erythroblastic island",
        "source": "Bone Marrow p.28",
        "body": [
          {
            "bullets": [
              "เซลล์ erythropoietic ใน bone marrow section จัดตัวเป็นหน่วยเล็ก ๆ เรียกว่า **Erythroblastic island ซึ่งอยู่ติดกับ venous sinuses**",
              "แต่ละ island ประกอบด้วย **central macrophage 1 ตัว ล้อมรอบด้วย erythropoietic cells ระยะต่าง ๆ 1-2 ชั้น**",
              "Cytoplasmic processes ของ macrophage ยื่นแทรกระหว่าง erythropoietic cells โดยรอบ และให้สารจำเป็น เช่น iron แก่เซลล์เหล่านั้น"
            ]
          }
        ]
      },
      {
        "heading": "Stimulation of erythropoiesis",
        "source": "Bone Marrow p.29",
        "body": [
          {
            "bullets": [
              "**Hypoxia** คือภาวะที่ร่างกายหรือบางส่วนของร่างกายได้รับ oxygen ไม่เพียงพอในระดับเนื้อเยื่อ",
              "**Hypoxia กระตุ้น kidney ให้สร้าง Erythropoietin (EPO)**",
              "EPO ส่งเสริม erythropoiesis ในไขกระดูก",
              "Erythropoietin จำเป็นต่อ terminal maturation ของ erythrocytes",
              "**ถ้าไม่มี erythropoietin BFU-E และ CFU-E จะไม่สามารถ differentiate ไปเป็น mature erythrocytes ได้**"
            ]
          }
        ]
      },
      {
        "heading": "Granulopoiesis ลำดับขั้น",
        "source": "Bone Marrow p.31",
        "body": [
          {
            "text": "Myeloid stem cell CFU-GEMM > **CFU-GM** > CFU-N, CFU-Eo, CFU-Ba > Myeloblast > Progranulocyte > Promyelocyte > Myelocyte > Metamyelocyte > Band cell (หรือ band form) > Mature granulocyte (neutrophil, eosinophil, basophil)"
          }
        ]
      },
      {
        "heading": "ลักษณะจำเพาะของแต่ละระยะใน granulocytic series",
        "source": "Bone Marrow p.32-38",
        "body": [
          {
            "sub": "Myeloblast (p.32)",
            "body": [
              {
                "bullets": [
                  "เซลล์รูป oval ขนาดประมาณ 10-18 µm, N:C ratio = 6:1",
                  "Nucleus กลมสีม่วง chromatin แบบ stippled พบ nucleoli 2-6 อัน",
                  "**Cytoplasm สีฟ้าอมเขียวจาง ไม่มี azurophilic granules**"
                ]
              }
            ]
          },
          {
            "sub": "Progranulocyte (p.33, rarely investigated)",
            "body": [
              {
                "bullets": [
                  "เป็น daughter cell ของ myeloblast บางครั้งใหญ่กว่าเซลล์ต้นกำเนิดของตัวเอง",
                  "รูป oval หรือ spherical ขนาด 12-20 µm, N:C ratio = 6:1",
                  "Nucleus สีม่วง มักอยู่ตรงกลาง chromatin เริ่มจับกลุ่ม พบ nucleoli 3-6 อัน",
                  "**Cytoplasm สีม่วงจาง มี coarse azurophilic granules ปริมาณไม่แน่นอน**"
                ]
              }
            ]
          },
          {
            "sub": "Promyelocyte (p.34)",
            "body": [
              {
                "bullets": [
                  "เป็น daughter cell ของ progranulocyte ขนาด 12-18 µm, N:C ratio = 4:1",
                  "Nucleus รูป spherical หรือ ovoid อยู่เยื้องศูนย์ chromatin หยาบ มี nucleoli เล็กน้อย",
                  "**Cytoplasm สีฟ้าอ่อน มีทั้ง residual azurophilic granules และ specific granules ชนิดต่าง ๆ**"
                ]
              }
            ]
          },
          {
            "sub": "Myelocyte (p.35)",
            "body": [
              {
                "bullets": [
                  "เป็น daughter cell ของ promyelocyte และเป็น **ระยะสุดท้ายที่เกิดขึ้นโดย mitosis**",
                  "เซลล์กลม ขนาด 12-18 µm, N:C ratio = 2:1",
                  "Nucleus รูป oval เยื้องศูนย์ chromatin จับกลุ่ม และ **ไม่มี nucleoli**",
                  "Cytoplasm สีฟ้าจาง มี specific granules ของแต่ละชนิด"
                ]
              }
            ]
          },
          {
            "sub": "Metamyelocyte (p.36)",
            "body": [
              {
                "bullets": [
                  "จากระยะ myelocyte เซลล์ผ่านการเปลี่ยนแปลงต่อเนื่องมาเป็นระยะนี้",
                  "ขนาดประมาณ 12-15 µm, N:C ratio = 1.5:1",
                  "**Nucleus มี indentation ชัดเจน** chromatin หยาบ ไม่มี nucleoli",
                  "Cytoplasm เต็มไปด้วย specific granules ที่มีสีเฉพาะตัว"
                ]
              }
            ]
          },
          {
            "sub": "Band cell (p.37)",
            "body": [
              {
                "bullets": [
                  "ขนาด 10-16 µm, N:C ratio = 1:2",
                  "**Nucleus รูป horseshoe, C, S หรือ V โดย indentation ต้องเลย central axis ของ nucleus**",
                  "พบ mature specific granules ใน cytoplasm",
                  "บางครั้งพบใน peripheral blood circulation"
                ]
              }
            ]
          },
          {
            "sub": "Mature granulocytes: neutrophil, eosinophil, basophil (p.38)",
            "body": [
              {
                "bullets": [
                  "ขนาด 9-10 µm, N:C ratio = 1:3",
                  "**Nucleus คอดหรือแบ่งเป็น lobe หรือ bi-lobed**",
                  "Cytoplasm เต็มไปด้วย mature specific granules"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "คำถามที่สไลด์ตั้งไว้แต่ไม่ได้ตอบ",
        "source": "Bone Marrow p.39",
        "body": [
          {
            "text": "สไลด์หน้านี้มีเพียงหัวข้อว่า THE MAIN DIFFERENCE BETWEEN ORIGINATING CELL OF ERYTHROPOIESIS AND ORIGINATING CELL OF GRANULOPOIESIS"
          },
          {
            "callout": "สไลด์ไม่ได้บอกคำตอบของหัวข้อนี้ไว้ มีแต่หัวข้อเปล่า ๆ ต้องไปถามอาจารย์หรือจดจากในคาบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Agranulopoiesis: Monocytopoiesis",
        "source": "Bone Marrow p.40",
        "body": [
          {
            "text": "ลำดับ: CFU-GEMM > CFU-GM > **CFU-M** > Monoblast > Promonocyte > Monocyte"
          },
          {
            "bullets": [
              "**Monoblast** ค่อนข้างเล็กและจดจำได้ยาก",
              "**Promonocyte** ขนาด 15-20 µm, nucleus ใหญ่รูป oval หรือ spherical มี nucleoli 2-5 อัน, cytoplasm ติดสีน้ำเงินมากและมี azurophilic granules",
              "**Monocyte** ขนาด 12-18 µm, nucleus มี indentation, cytoplasm สีเทาอมน้ำเงินและมี vacuoles",
              "**Monocyte จะทำหน้าที่ได้เต็มที่เมื่อเคลื่อนเข้าสู่เนื้อเยื่อกลายเป็น macrophages**"
            ]
          }
        ]
      },
      {
        "heading": "Agranulopoiesis: Lymphopoiesis",
        "source": "Bone Marrow p.41",
        "body": [
          {
            "text": "ลำดับ: CFU-L > Lymphoblast > Prolymphocyte > Lymphocyte"
          },
          {
            "bullets": [
              "**Lymphoblast** ขนาด 12-15 µm, nucleus กลม chromatin หยาบ nucleoli ไม่แน่นอน, cytoplasm เป็นขอบบาง ๆ ติดสี basophilic เข้ม",
              "**Prolymphocyte** เล็กกว่า lymphoblast",
              "**Lymphocyte** จะกลายเป็น B- หรือ T-lymphocyte ขึ้นกับเส้นทางการพัฒนา โดย **B-lymphocyte พบได้ในไขกระดูก**"
            ]
          },
          {
            "callout": "Lymphocytes และเซลล์ต้นกำเนิดของมันดูแยกยากมากในไขกระดูก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Plasma cell formation",
        "source": "Bone Marrow p.42-43",
        "body": [
          {
            "bullets": [
              "ปกติ **ไม่พบ plasma cell ใน peripheral blood circulation**",
              "คิดเป็นเพียง **1-2% ของ nucleated cells ในไขกระดูก**",
              "พบใน secondary lymphatic organs (lymph nodes, spleen, tonsils) และพบบ่อยใน lamina propria ของลำไส้และใน CNT",
              "ทฤษฎีที่ยอมรับกันมากที่สุดคือ **plasma cells พัฒนามาจาก B-lymphocytes ที่ผ่านการแบ่งตัวแบบ mitosis หลายครั้งพร้อมกับเปลี่ยนรูปร่าง**"
            ]
          },
          {
            "sub": "ระยะต่าง ๆ (p.43)",
            "body": [
              {
                "bullets": [
                  "**Plasmablast** ขนาด 14-24 µm รูปทรงลูกแพร์, cytoplasm ติดสี basophilic เข้ม halo area ยังไม่ชัด, nucleus เยื้องศูนย์ chromatin หยาบ มี nucleoli 2-3 อัน",
                  "**Proplasmacyte** คล้าย plasmablast แต่ nucleus เยื้องศูนย์มี nucleoli 1-2 อัน, cytoplasm basophilic จัดมาก และ **halo area เริ่มมองเห็นได้**",
                  "**Plasma cell (plasmacyte)** ขนาด 8-18 µm, cytoplasm สีน้ำเงินเข้ม halo area ชัดเจน, **nucleus แบบ cartwheel และไม่มี nucleoli**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Thrombopoiesis: Platelet formation",
        "source": "Bone Marrow p.44-45",
        "body": [
          {
            "text": "ลำดับ: CFU-GEMM > BFU-MK > CFU-MK > Megakaryoblast > Promegakaryocyte > Megakaryocyte"
          },
          {
            "bullets": [
              "**Megakaryoblast** รูป spherical หรือ oval ขนาด 25-35 µm, N:C ratio = 10:1, cytoplasm basophilic เล็กน้อย, nucleus เดี่ยว chromatin กระจาย มี nucleoli หลายอัน",
              "**Promegakaryocyte** ขนาด 25-50 µm, cytoplasm basophilic มี azurophilic granules, nucleus อาจเป็นก้อนเดียว มี indentation หรือ lobulated มี nucleoli 1-2 อัน",
              "**Megakaryocyte** ขนาด 40-100 µm, cytoplasm สีน้ำเงินปริมาณมาก มี membrane-bounded dense bodies (เห็นด้วย EM), nucleus แบบ lobulation"
            ]
          },
          {
            "sub": "กลไกการสร้าง platelet (p.45)",
            "body": [
              {
                "bullets": [
                  "**Endomitosis** คือกระบวนการที่ nucleus แบ่งตัวและ cytoplasm เจริญเต็มที่ **โดยที่เซลล์ไม่แบ่งตัว**",
                  "มี **Demarcation membrane system (DMS)** ใน cytoplasm",
                  "Megakaryocyte เคลื่อนเข้าใกล้ sinusoid แล้วยื่น long pseudopodia ของ cytoplasm ผ่านช่องว่างระหว่าง endothelial cells",
                  "**หนีบ (pinching off) ชิ้นส่วนของ cytoplasm ออกมาเป็น platelets**",
                  "เหลือไว้เพียง nucleus เรียกว่า **Effete megakaryocyte**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เซลล์อื่น ๆ ในไขกระดูกที่ดูสับสนได้",
        "source": "Bone Marrow p.46",
        "body": [
          {
            "bullets": [
              "**Osteoblast** ดูคล้าย proplasmacyte แต่ **halo area อยู่ห่างจาก nucleus**",
              "**Osteoclast** ดูคล้าย megakaryocyte แต่ **มีหลาย nuclei**"
            ]
          }
        ]
      },
      {
        "heading": "Transfer of blood cells ออกจากไขกระดูก",
        "source": "Bone Marrow p.47, 49-50",
        "body": [
          {
            "sub": "เส้นทาง (p.47)",
            "body": [
              {
                "text": "Mature blood cells ในไขกระดูกจะระบายเข้าสู่ **venous sinus หรือ sinusoids** ซึ่งเปิดเข้าสู่ **central longitudinal vein** แล้วเข้าสู่ systemic circulation ทาง **nutrient และ periosteal veins**"
              }
            ]
          },
          {
            "sub": "กลไกการผ่านผนัง sinusoid (p.49)",
            "body": [
              {
                "bullets": [
                  "เซลล์ที่เกือบ mature เคลื่อนมาชิด sinusoid แล้วพยายามผ่าน **discontinuous basement membrane และช่องว่างระหว่าง overlapping endothelial cells**",
                  "โดยมี **adventitial reticular cells** ช่วยสนับสนุน",
                  "แรงดันจากจำนวนเซลล์ที่มากอาจดัน erythrocytes ผ่านช่องว่างระหว่าง endothelial cells",
                  "White blood cells เคลื่อนไปตาม sinusoid แล้วทำ **diapedesis** ผ่านช่องว่างระหว่าง endothelial cells",
                  "Megakaryocytes ยื่น long pseudopodia ผ่านช่องว่างระหว่าง endothelial cells แล้วปล่อยชิ้นส่วน cytoplasm เล็ก ๆ ออกมาเป็น platelets"
                ]
              }
            ]
          },
          {
            "sub": "Wall of sinusoid ในไขกระดูก (p.50)",
            "body": [
              {
                "bullets": [
                  "**Single layer ของ overlapping endothelial cells**",
                  "**Discontinuous basement membrane**",
                  "**Adventitial reticular cells**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Method to collect bone marrow",
        "source": "Bone Marrow p.51",
        "body": [
          {
            "sub": "Aspiration",
            "body": [
              {
                "bullets": [
                  "ดูดเอาสิ่งที่อยู่ใน marrow cavity ออกมาโดยใช้แรงดัน ด้วยการเจาะเข้า marrow cavity",
                  "ใช้สำหรับ **Cytology**"
                ]
              }
            ]
          },
          {
            "sub": "Sites of bone marrow aspiration",
            "body": [
              {
                "bullets": [
                  "**Dog, Cat**: iliac crest, proximal femur, proximal humerus",
                  "**Cattle, Horse, Sheep, Goat**: proximal rib, tuber coxae, sternum, vertebral spine"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Clinical evaluation of bone marrow",
        "source": "Bone Marrow p.52",
        "body": [
          {
            "bullets": [
              "การตรวจไขกระดูกเป็น **adjunct ของการตรวจเลือดตามปกติ (complete blood cell count)** ไม่ใช่ตัวแทนกัน",
              "ให้ข้อมูลที่มีค่าเกี่ยวกับ hematopoietic status ของสัตว์แต่ละตัว และแนะนำให้ทำเมื่อสงสัย marrow disorder",
              "ตัวอย่างเช่น nonregenerative anemia, neutropenia, การสร้างเซลล์ผิดปกติ, การแสดง metastatic neoplasm, leukemia และ Histoplasma, Leishmania, Toxoplasma บางชนิด",
              "สิ่งที่ให้ความสนใจในการประเมิน ได้แก่ **cellularity, cellular composition, distribution ของ blood cell lines ต่าง ๆ และ myeloid:erythroid (M:E) ratio**"
            ]
          }
        ]
      },
      {
        "heading": "Myeloid : Erythroid (M:E) ratio",
        "source": "Bone Marrow p.53",
        "body": [
          {
            "text": "ทำจาก bone marrow aspiration และคำนวณโดย **นับ marrow nucleated cells จำนวน 500 เซลล์ ภายใต้ light microscope (oil immersion x100)**"
          },
          {
            "bullets": [
              "**M = Myelocytic series** เน้นที่ granulocytic cells ได้แก่ myeloblast, progranulocyte, promyelocyte, myelocyte, metamyelocyte, band cell, segmented neutrophil, eosinophil, basophil",
              "**E = Erythrocytic series** ได้แก่ rubriblast, prorubricyte, basophilic rubricyte, polychromatic rubricyte, normochromatic rubricyte, metarubricyte"
            ]
          },
          {
            "text": "ต้องแปลผล **เทียบกับ normal total WBC count** เสมอ"
          },
          {
            "bullets": [
              "**M:E เพิ่ม (มากกว่า 1) และ WBC ปกติ** เช่น 4:1 อาจหมายถึง decrease in erythropoiesis หรือส่วนใหญ่คือ acute infection, granulocytic leukemia เป็นต้น",
              "**M:E ลด (น้อยกว่า 1) และ WBC ปกติ** เช่น 1:4 อาจหมายถึง increase in erythropoiesis เช่น severe blood loss หรือ erythrocyte destruction, hemorrhagic anemia, hemolytic anemia"
            ]
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นรูปภาพล้วน",
        "source": "Bone Marrow p.9, 13, 26, 30, 48, 54-56",
        "body": [
          {
            "text": "หน้า 9, 26, 30, 48, 55 และ 56 เป็นรูปภาพที่ไม่มีข้อความประกอบเลย หน้า 13 มีเพียงคำกำกับว่า (Pluripotential stem cells) และหน้า 54 เป็นหน้าคั่นชื่อ Histological slides for Bone Marrow"
          },
          {
            "callout": "เนื้อหาของรูปเหล่านี้อ่านจากตัวหนังสือไม่ได้ ต้องดูสไลด์จริงหรือ histological slide ในคาบปฏิบัติการเอง",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "histo--circulatory-system": {
    "topic": "histo--circulatory-system",
    "title": "Circulatory System",
    "icon": "🔬",
    "lecturer": "Tilladit Rung-rungkijkrai, D.V.M., Ph.D.",
    "summary": "เด็คนี้ไล่จาก Heart (ผนัง 3 ชั้น, cardiac skeleton, impulse conducting system) ไป Blood vessels โดยยึดโครงสร้าง 3 coats (tunica intima / media / adventitia) แล้วเทียบทีละชนิด: elastic artery, muscular artery, arteriole, capillary, venule, medium-sized vein, large vein พร้อมตารางเทียบ artery กับ vein จบด้วย special blood vessels, arteriovenous anastomosis, sensory receptors ที่ carotid และ lymph circulatory system เนื้อหาที่เหลือส่วนใหญ่เป็นสไลด์ภาพ histology ที่มีแต่ label ชั้นเนื้อเยื่อ (เช่น p.10, 12, 19, 28-29, 32-34) และมีสไลด์ที่ไม่มีข้อความเลยที่ p.39, 47, 49 และ p.60-64 สไลด์ Functions (p.4) ตัวหนังสือในไฟล์แตกเป็นชิ้น ๆ จึงสรุปได้เท่าที่คำบนสไลด์ระบุจริง",
    "sections": [
      {
        "heading": "Objectives และการแบ่งระบบไหลเวียน",
        "source": "Circulatory System p.2-3",
        "body": [
          {
            "text": "สไลด์ objectives วางกรอบไว้ 3 อย่างคือ Heart กับ Blood vessels, เรื่อง **specific 3 coats** และการเทียบ Artery กับ Vein กับ Lymph vessel ซึ่งเป็นโครงของทั้งเด็ค"
          },
          {
            "text": "Circulatory system แบ่งเป็น **Blood circulatory system (Cardiovascular system)** และ **Lymph circulatory system**"
          }
        ]
      },
      {
        "heading": "Functions ของ blood และ lymph circulation",
        "source": "Circulatory System p.4",
        "body": [
          {
            "text": "สไลด์นี้ list หน้าที่ไว้เป็นคำสั้น ๆ ไม่ได้เขียนเป็นประโยคเต็ม รายการที่ปรากฏบนสไลด์คือ"
          },
          {
            "bullets": [
              "body fluids และ tissue fluid",
              "O2, nutrient, CO2, metabolic waste product",
              "Fluid: blood",
              "Nutrients: venous system",
              "Temp. regulation",
              "Hormones, cells of immune system"
            ]
          },
          {
            "callout": "ข้อความบนสไลด์นี้ขาดเป็นช่วง ๆ ไม่ได้บอกว่าแต่ละหัวข้อเชื่อมกันอย่างไร สไลด์ไม่ได้บอกกลไกไว้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "องค์ประกอบและลำดับของ blood circulatory system",
        "source": "Circulatory System p.5-6",
        "body": [
          {
            "text": "Blood circulatory system (cardio-vascular) ประกอบด้วย **Heart** และ **Blood vessels** ได้แก่ artery, capillary, sinusoid, vein"
          },
          {
            "text": "สไลด์ structure and relation ไล่ลำดับเป็นวงว่า Heart ไป Artery (elastic ไป muscular ไป arteriole) ไป Capillary (Sinusoid) กับ venule และ arteriovenous anastomose ไป Vein (small ไป medium ไป large) แล้วกลับเข้า Heart"
          }
        ]
      },
      {
        "heading": "Heart ภาพรวม",
        "source": "Circulatory System p.7-8",
        "body": [
          {
            "bullets": [
              "originates from blood vessel",
              "contraction ไปเลี้ยง body",
              "specialized muscle cells"
            ]
          },
          {
            "text": "หัวใจ **contracts regularly, involuntary, and continuously** โดย electrical signals ส่งไปยัง neighboring cells ทำให้ rhythmically contract ส่ง O2 blood และ nutrients ไป the body และส่ง deoxygenated blood ไป the lung"
          }
        ]
      },
      {
        "heading": "ผนังหัวใจ 3 ชั้น และ Endocardium",
        "source": "Circulatory System p.9, p.11",
        "body": [
          {
            "text": "ผนังหัวใจแบ่งเป็น **1. Endocardium 2. Myocardium 3. Epicardium**"
          },
          {
            "sub": "Endocardium (p.11)",
            "body": [
              {
                "bullets": [
                  "endothelium วางบน thin basal lamina",
                  "subendothelial layer: CNT วางขนานกับ endothelial surface",
                  "subendocardial layer: CNT, blood และ lymph vessel, มี adipose tissue และมี Purkinje's fibers (impulse-conducting cardiac myofibers)"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ทำดาว *** ไว้ที่ Purkinje's fibers ในชั้น subendocardial layer",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Purkinje fibers",
        "source": "Circulatory System p.13-14",
        "body": [
          {
            "bullets": [
              "อยู่ที่ **subendocardial layer**",
              "มี **1-2 large spherical nuclei**",
              "**scarce myofibrils** และอยู่ที่ periphery ของเซลล์",
              "cytoplasm rich in **mitochondria and glycogen**"
            ]
          },
          {
            "text": "สไลด์ p.13 กับ p.14 เป็นข้อความชุดเดียวกัน ต่างกันแค่ภาพประกอบที่ label ชั้น endothelium, subendothelial layer และ subendocardial layer"
          }
        ]
      },
      {
        "heading": "Myocardium และ cardiac muscle",
        "source": "Circulatory System p.15-16",
        "body": [
          {
            "bullets": [
              "เป็นชั้น **middle and thickest**",
              "cardiac muscles กับ loose CNT",
              "dense capillary network",
              "มี cardiac skeleton และ conducting system อยู่ในชั้นนี้"
            ]
          },
          {
            "sub": "Cardiac muscle (p.16)",
            "body": [
              {
                "text": "แบ่งเป็น contractile cells และ impulse generating and conducting cells"
              },
              {
                "text": "จุดเชื่อมระหว่างเซลล์คือ **intercalated disc** ทำหน้าที่ส่ง electrical impulse ไปสู่ contraction ประกอบด้วย junctional complex คือ **fascia adherens, desmosome และ gap junction**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Epicardium",
        "source": "Circulatory System p.17",
        "body": [
          {
            "bullets": [
              "**Mesothelium (Parietal pericardium)**",
              "**Subepicardial layer** มี coronary vessel และ CNT"
            ]
          },
          {
            "text": "ภาพบนสไลด์ label ไล่จาก mesothelium ลง subepicardium ลง myocardium"
          }
        ]
      },
      {
        "heading": "Cardiac skeleton",
        "source": "Circulatory System p.18",
        "body": [
          {
            "text": "นิยามบนสไลด์คือ **CNT inserted into the atrial and ventricular walls** แบ่งเป็น 3 ส่วน"
          },
          {
            "bullets": [
              "**Anulus fibrosus (fibrous ring)**: ที่ atrioventricular opening, aorta, pulmonary a.",
              "**Trigonum fibrosum (fibrous trigone / triangle)**: ระหว่าง atrioventricular opening กับ base of aorta",
              "**interventricular septum**"
            ]
          },
          {
            "text": "สไลด์ยังเขียนลำดับเนื้อเยื่อไว้ว่า **CNT ไป cartilage ไป bone เป็น age-dependence** และ list ชนิดไว้คือ fibrocartilage, hyalin cartilage และ bone (os cordis)"
          }
        ]
      },
      {
        "heading": "Impulse conducting system",
        "source": "Circulatory System p.20",
        "body": [
          {
            "bullets": [
              "**1. Sinoatrial (SA) node (pace maker)**: อยู่ระหว่าง cranial vena cava กับ right atrium ทำให้เกิด atrial contraction",
              "**2. Atrioventricular (AV) node**: ที่ atrioventricular valve ทำหน้าที่ delay impulse",
              "**3. Atrioventricular bundle (bundle of His)**: จาก AV wall ไป ventricles แยกเป็น ant. และ post. fascicles และ **distally become larger คือกลายเป็น Purkinje fibers**"
            ]
          }
        ]
      },
      {
        "heading": "Blood vessels: general structure 3 coats",
        "source": "Circulatory System p.22-23",
        "body": [
          {
            "text": "สไลด์วางคู่กันว่าหัวใจมี Endocardium, Myocardium, Epicardium ส่วน blood vessels มี **Tunica intima (T. interna), Tunica media, Tunica externa (T. adventitia)**"
          },
          {
            "sub": "1. Tunica intima (T. interna)",
            "body": [
              {
                "bullets": [
                  "Endothelial cells",
                  "Subendothelial layer: loose CNT",
                  "Internal elastic lamina"
                ]
              }
            ]
          },
          {
            "sub": "2. Tunica media",
            "body": [
              {
                "bullets": [
                  "Circular smooth m.",
                  "CNT",
                  "External elastic lamina",
                  "สไลด์ทำดาวกำกับไว้ที่ Large artery"
                ]
              }
            ]
          },
          {
            "sub": "3. Tunica adventitia (T. externa)",
            "body": [
              {
                "bullets": [
                  "CNT",
                  "Blood vessel คือ **vasa vasorum**",
                  "Nerve คือ **nervi vasorum / vasa nervi**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Artery ภาพรวมและการแบ่งชนิด",
        "source": "Circulatory System p.25-26",
        "body": [
          {
            "text": "หน้าที่ที่สไลด์เขียนคือ **control blood flow** จาก heart ไป smaller vessels ไป tissues เพื่อส่ง O2 และ nutrient"
          },
          {
            "bullets": [
              "**1. Elastic (large) artery**",
              "**2. Muscular (medium-sized) artery**",
              "**3. Arteriole (small) artery**"
            ]
          }
        ]
      },
      {
        "heading": "1. Elastic (large) artery",
        "source": "Circulatory System p.27, p.30",
        "body": [
          {
            "text": "ลักษณะเด่นบนสไลด์คือ **yellowish จาก elastic fibers**"
          },
          {
            "sub": "T. intima",
            "body": [
              {
                "bullets": [
                  "Endothelium",
                  "Subendothelial layer",
                  "Internal elastic lamina"
                ]
              }
            ]
          },
          {
            "sub": "T. media (สไลด์ทำดาว ***)",
            "body": [
              {
                "bullets": [
                  "**Thickest ในบรรดา 3 ชั้น**",
                  "Sm. m., elastic laminae, collagen f.",
                  "**Proximal: elastic f. ส่วน distal: sm. m.**",
                  "External elastic lamina"
                ]
              }
            ]
          },
          {
            "sub": "T. adventitia",
            "body": [
              {
                "bullets": [
                  "CNT ที่มี collagen เรียงตัว longitudinally",
                  "Few elastic f. และ fibroblast",
                  "**Vasa vasorum, nervi vasorum** (p.30 เป็นภาพเน้นจุดนี้)"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ภาพ p.29 เป็น elastic artery ย้อม Koneff's aniline blue เทียบกับ H&E โดย label แค่ tunica intima, tunica media, tunica externa"
          }
        ]
      },
      {
        "heading": "2. Muscular artery",
        "source": "Circulatory System p.31",
        "body": [
          {
            "text": "เป็น **medium-sized, distributive artery** ที่กระจายเลือดเข้าสู่ organ"
          },
          {
            "sub": "T. intima",
            "body": [
              {
                "bullets": [
                  "endothelium",
                  "subendothelial layer",
                  "**Internal elastic lamina** (สไลด์ทำดาว *** ไว้ตรงนี้)"
                ]
              }
            ]
          },
          {
            "sub": "T. media",
            "body": [
              {
                "bullets": [
                  "**Mainly sm. m. หนา 3-40 layers**",
                  "CNT",
                  "External elastic lamina"
                ]
              }
            ]
          },
          {
            "sub": "T. adventitia",
            "body": [
              {
                "bullets": [
                  "CNT กับ fibroblasts",
                  "Vasa vasorum, nervi vasorum"
                ]
              }
            ]
          },
          {
            "text": "p.33-34 เป็นภาพ muscular artery ย้อม Koneff's aniline blue เทียบ H&E label แค่ 3 ชั้น"
          }
        ]
      },
      {
        "heading": "3. Arteriole (small artery)",
        "source": "Circulatory System p.35-36",
        "body": [
          {
            "text": "ตำแหน่งในลำดับคือ muscular a. ไป arteriole ไป capillary และไป arteriovenous anastomoses แบ่งเป็น large และ small arteriole ขนาด **Ø < 0.3 mm.**"
          },
          {
            "sub": "T. intima",
            "body": [
              {
                "bullets": [
                  "endothelium",
                  "subendothelial layer",
                  "Internal elastic lamina"
                ]
              }
            ]
          },
          {
            "sub": "T. media (สไลด์ทำดาว ***)",
            "body": [
              {
                "bullets": [
                  "**thin, 1-3 layers of sm. m.**",
                  "External elastic lamina"
                ]
              }
            ]
          },
          {
            "sub": "T. adventitia",
            "body": [
              {
                "bullets": [
                  "loose CNT, thin, not develop"
                ]
              }
            ]
          },
          {
            "text": "ภาพ p.36 ให้จำ small arteriole ด้วย **endothelium กับ 1-3 smooth muscle layers**"
          }
        ]
      },
      {
        "heading": "4. Capillary",
        "source": "Circulatory System p.37-38",
        "body": [
          {
            "bullets": [
              "**smallest** ในระบบ",
              "ทำ **gas (O2 และ CO2) exchange between blood and tissues**",
              "**Ø 5-10 µm**",
              "differentiate from mesenchymal cells"
            ]
          },
          {
            "sub": "ผนัง",
            "body": [
              {
                "bullets": [
                  "**1 layer of endothelial cell**",
                  "**no T. media คือไม่มี smooth muscle ในผนัง**",
                  "T. adventitia: pericyte, CNT"
                ]
              }
            ]
          },
          {
            "text": "ภาพ p.38 ให้ดู capillary เป็น endothelium กับ lumen ที่มี RBC อยู่ 1-2 เม็ด"
          }
        ]
      },
      {
        "heading": "Vein: การแบ่งชนิด และ small vein (venule)",
        "source": "Circulatory System p.40-42",
        "body": [
          {
            "text": "Vein แบ่งเป็น **Small vein (venule), Medium-sized vein และ Large vein**"
          },
          {
            "sub": "1. Small vein (venule)",
            "body": [
              {
                "bullets": [
                  "receive blood from capillary",
                  "**similar to capillary แต่ใหญ่กว่า Ø ประมาณ 20 µm**",
                  "T. intima (สไลด์ทำดาว **): endothelium",
                  "T. media (สไลด์ทำดาว **): **none หรือ 1-2 sm. m. และมี pericyte**",
                  "T. adventitia: thin loose CNT"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "2. Medium-sized vein",
        "source": "Circulatory System p.43-44",
        "body": [
          {
            "bullets": [
              "**พบครบทั้ง 3 layers**",
              "**similar to artery แต่บางกว่ามาก**",
              "**irregular-shaped lumen**"
            ]
          },
          {
            "sub": "แต่ละชั้น",
            "body": [
              {
                "bullets": [
                  "T. intima: endothelium on basal lamina",
                  "T. media: **2-4 layers of sm. m.**",
                  "T. adventitia: CNT"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "3. Large vein",
        "source": "Circulatory System p.45-46",
        "body": [
          {
            "bullets": [
              "T. intima: endothelium on basal lamina",
              "T. media: **relatively thin เมื่อเทียบกับ lumen และมี sm. m. น้อยหรือไม่มีเลย**",
              "T. adventitia: **clearly define และเป็นชั้นที่หนาที่สุด** มี **sm. m. cells** ที่ทำให้ชั้นนี้หนา และมี CNT"
            ]
          },
          {
            "callout": "สไลด์ทำดาว *** ไว้ 2 จุดใน large vein คือ T. adventitia เป็นชั้นที่หนาที่สุด และการที่มี smooth muscle cells อยู่ในชั้นนั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เทียบ Artery กับ Vein",
        "source": "Circulatory System p.48",
        "body": [
          {
            "sub": "Artery",
            "body": [
              {
                "bullets": [
                  "non or few blood cell",
                  "**thick T. media**",
                  "small และ narrow, round-shaped lumen, thick wall"
                ]
              }
            ]
          },
          {
            "sub": "Vein",
            "body": [
              {
                "bullets": [
                  "full of blood cells",
                  "**thick T. adventitia**",
                  "irregular-shaped lumen",
                  "large lumen, thin wall"
                ]
              }
            ]
          },
          {
            "callout": "จุดตัดที่ใช้แยกใต้กล้องตามสไลด์คือ artery หนาที่ T. media ส่วน vein หนาที่ T. adventitia และรูปร่าง lumen กลมเทียบกับ irregular",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Special blood vessels",
        "source": "Circulatory System p.50",
        "body": [
          {
            "text": "สไลด์อธิบายว่า special features สัมพันธ์กับ specific functions เพื่อ regulate blood flow"
          },
          {
            "bullets": [
              "**เพิ่มความหนา** ในบริเวณที่ blood pressure สูง ได้แก่ arteries and veins of teat และ veins of gland, penis",
              "**ลดความหนา** ในบริเวณที่ blood pressure ต่ำ ได้แก่ skull (artery of brain, venous sinus), bone, lung",
              "**Longitudinal muscle bundle** ทำหน้าที่ stop blood flow อยู่ที่ T. interna ใน artery และ vein ของ penis และ uterus"
            ]
          }
        ]
      },
      {
        "heading": "Arteriovenous anastomosis (AV shunt)",
        "source": "Circulatory System p.51",
        "body": [
          {
            "bullets": [
              "หน้าที่: **control blood flow และ temperature**",
              "**directly interconnect arteriole กับ venule**",
              "**bypass คือไม่ผ่าน capillary bed**",
              "พบที่ skin, lips, intestine, nasal mucosa, reproductive tract"
            ]
          },
          {
            "text": "สไลด์เขียนสองสถานะไว้ว่า **open คือเลือดไม่ผ่าน capillary beds แต่ไปตรง ส่วน close คือเลือดเข้า capillary beds มากขึ้น**"
          }
        ]
      },
      {
        "heading": "Sensory receptors ที่ carotid",
        "source": "Circulatory System p.52-53",
        "body": [
          {
            "text": "ทำหน้าที่ monitor การเปลี่ยนแปลงของ **BP ผ่าน baroreceptors** และ **chemical composition ผ่าน chemoreceptors** อยู่ที่ **bifurcation of common carotid artery** มี 2 อย่างคือ carotid body และ carotid sinus"
          },
          {
            "sub": "1. Carotid body (chemoreceptor)",
            "body": [
              {
                "bullets": [
                  "รับ changes in conc. of **blood pH, O2, CO2**",
                  "ตำแหน่ง common carotid artery ตรง bifurcation"
                ]
              }
            ]
          },
          {
            "sub": "2. Carotid sinus (baroreceptor, mechanoreceptor)",
            "body": [
              {
                "bullets": [
                  "ตอบสนองต่อ **blood pressure ที่สูงขึ้น**",
                  "เป็น dilation of internal carotid artery",
                  "ผลที่สไลด์เขียนไว้คือ Brachycardia (สะกดตามสไลด์), blood pressure ลดลง และ dilate visceral blood vessels"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Lymph circulatory system",
        "source": "Circulatory System p.54-57",
        "body": [
          {
            "text": "หน้าที่ตามสไลด์คือ **maintain quality and quantity of tissue fluid** โดย lymph ไหลจาก tissues ไป lymph node แล้วเข้า vein"
          },
          {
            "text": "สไลด์ lymph formation (p.55) เขียนไว้แค่ **hydrostatic pressure กับ osmotic pressure** ส่วนรายละเอียดกลไก สไลด์ไม่ได้บอก"
          },
          {
            "sub": "ลำดับทางเดิน lymph (p.57)",
            "body": [
              {
                "bullets": [
                  "Tissue ไป Interstitial fluid",
                  "Lymph capillary",
                  "Lymph vessel",
                  "Lymph node",
                  "Collecting duct",
                  "Vein แล้วเข้า Heart"
                ]
              },
              {
                "text": "ภาพบนสไลด์เดียวกัน label โครงสร้างไว้ว่า internal jugular vein, external jugular vein, visceral trunk, lumbar trunk, Lt. jugular trunk, Lt. venous angle, cranial vena cava และ thoracic duct"
              }
            ]
          }
        ]
      },
      {
        "heading": "Lymph vessels",
        "source": "Circulatory System p.58-59",
        "body": [
          {
            "bullets": [
              "**similar to vein แต่ NO RBC**",
              "**irregular-shaped lumen**",
              "**valve พบใน large lymph vessel**"
            ]
          },
          {
            "sub": "แต่ละชั้น",
            "body": [
              {
                "bullets": [
                  "T. intima: endothelium (สไลด์ทำดาว ***)",
                  "T. media: **2-4 layers of sm. m.** และ CNT",
                  "T. adventitia: CNT"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ใช้แยก lymph vessel ออกจาก vein ใต้กล้องตามสไลด์คือ ไม่มี RBC ใน lumen",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นภาพหรือไม่มีข้อความ",
        "source": "Circulatory System p.39, p.47, p.49, p.60-64",
        "body": [
          {
            "text": "สไลด์เหล่านี้ไม่มีข้อความในไฟล์เลย ส่วนสไลด์ p.10, 12, 19, 28, 29, 32, 33, 34 เป็นภาพ histology ที่มีแต่ label ชื่อชั้น เช่น lumen, endothelium, tunica intima, tunica media, tunica externa ไม่มีเนื้อหาเพิ่มจากที่สรุปไว้ข้างบน ส่วน p.36, 38, 42, 44, 46 ไม่ใช่สไลด์ label ล้วน แต่มีข้อความบนสไลด์ด้วย คือ p.36 \"* endothelium * 1-3 smooth muscle layers\", p.38 \"Capillary: endothelium + lumen ( + 1,2 RBC)\", p.42 \"Similar to capillary but bigger Ø~20µm / T. media: 1-2 layers of smooth muscle cells, pericyte\", p.44 \"Similar to artery but much thinner / Irregular-shaped lumen / 2-4 layers of smooth muscle cells\" และ p.46 \"Thin T. media (few smooth muscle cells) / Thick T. adventitia with smooth muscle cells\" ซึ่งสรุปไว้ในหัวข้อข้างบนแล้ว"
          },
          {
            "callout": "ถ้าต้องการรายละเอียดจากภาพเหล่านี้ ต้องดูสไลด์จริง เพราะ text layer ไม่ได้บอกอะไรมากกว่า label",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "histo--cytology-lab-11aug23": {
    "topic": "histo--cytology-lab-11aug23",
    "title": "Cytology Lab: รายการสไลด์และโครงสร้างที่ต้องหาในกล้อง",
    "icon": "🔬",
    "lecturer": "Benchaphorn Limcharoen",
    "summary": "เดคนี้เป็น lab checklist ของ Cytology lab (11 Aug 2023) ทั้งหมด 18 หน้า หน้าแรกเป็น title slide ที่เหลืออีก 17 หน้าเป็นรายการสไลด์ทีละแผ่น แต่ละหน้ามีแค่ 2 บรรทัดคือ รหัสสไลด์กับชื่ออวัยวะ และโครงสร้างที่ต้องหาในสไลด์นั้น ไม่มีคำอธิบาย ไม่มีนิยาม ไม่มีกลไก และไม่มีข้อความประกอบภาพใด ๆ โน้ตนี้จึงเป็นการจัดกลุ่มรายการสไลด์ตามโครงสร้างที่โจทย์สั่งให้หา ไม่ใช่เนื้อหาบรรยาย",
    "sections": [
      {
        "heading": "เดคนี้คืออะไร และให้ข้อมูลแค่ไหน",
        "source": "Cytology Lab 11Aug23 p.1",
        "body": [
          {
            "text": "หน้าแรกระบุว่าเป็น **VET HISTOLOGY: 11 AUG 2023, CHAPTER 01 Cytology lab** ผู้สอนคือ Benchaphorn Limcharoen, DVM., Ph.D. จาก Department of Anatomy, Faculty of Veterinary Science, Chulalongkorn University"
          },
          {
            "text": "หน้า 2 ถึง 18 เป็นสไลด์แลบ 17 แผ่น แต่ละหน้าเขียนแค่ **รหัสสไลด์ + ชื่ออวัยวะ แล้วตามด้วยโครงสร้างที่ต้องหา** เช่น หน้า 5 เขียนว่า A10-3 Serous gland แล้วบรรทัดถัดมาเขียนว่า Mitochondria"
          },
          {
            "callout": "เดคไม่ได้อธิบายว่าแต่ละโครงสร้างคืออะไร ย้อมด้วยอะไร หรือดูที่กำลังขยายเท่าไร สไลด์ไม่ได้บอก สิ่งที่เดคนี้ให้จริง ๆ คือคู่ระหว่างรหัสสไลด์กับโครงสร้างที่ต้องชี้ให้ได้เท่านั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cell size",
        "source": "Cytology Lab 11Aug23 p.2, p.13",
        "body": [
          {
            "bullets": [
              "**A1-3 ovary swine** ให้ดู Cell size (หน้า 2)",
              "**B183 Spinal ganglion** ให้ดู Lipofuscin และ cell size (หน้า 13)"
            ]
          },
          {
            "text": "เดคไม่ได้ระบุว่าเซลล์ไหนในสไลด์ที่ให้เทียบขนาด หรือให้เทียบกับอะไร สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Binucleated cell",
        "source": "Cytology Lab 11Aug23 p.3-4",
        "body": [
          {
            "bullets": [
              "**A95-1 GB&Liver** ให้ดู Binucleated cell (หน้า 3)",
              "**A95-17 GB&Liver** ให้ดู Binucleated cell (หน้า 4)"
            ]
          },
          {
            "text": "หัวข้อนี้มี 2 สไลด์ที่หาโครงสร้างเดียวกัน ทั้งคู่เป็นสไลด์ GB&Liver"
          }
        ]
      },
      {
        "heading": "Organelle ในไซโตพลาซึม: mitochondria และ zymogen granules",
        "source": "Cytology Lab 11Aug23 p.5-6",
        "body": [
          {
            "bullets": [
              "**A10-3 Serous gland** ให้ดู Mitochondria (หน้า 5)",
              "**A13 Pancreas** ให้ดู Zymogen granules และ Basophilic cytoplasm (หน้า 6)"
            ]
          },
          {
            "text": "สไลด์ A13 Pancreas เป็นหน้าเดียวในเดคที่พูดถึงสีของไซโตพลาซึม โดยระบุว่าเป็น **basophilic cytoplasm** แต่ไม่ได้อธิบายว่าทำไม สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Surface modification: microvilli, flagella, stereocilia",
        "source": "Cytology Lab 11Aug23 p.7-10",
        "body": [
          {
            "bullets": [
              "**A91-2 Ileum** ให้ดู Microvilli (หน้า 7)",
              "**A88-3 Ileum** ให้ดู Microvilli (หน้า 8)",
              "**B101-53 Testis, epidipymis** ให้ดู Sperm และ flagella (หน้า 9 สะกดตามสไลด์)",
              "**B106-1 Testis, (epididymis)** ให้ดู Stereocilia (หน้า 10)"
            ]
          },
          {
            "text": "จำคู่ให้แม่น สไลด์ ileum 2 แผ่นใช้หา microvilli ส่วนอีก 2 แผ่นเดคเขียนชื่ออวัยวะไว้เป็นคู่เหมือนกันทั้งคู่ คือ **B101-53 Testis, epidipymis** ให้หา Sperm, flagella และ **B106-1 Testis, (epididymis)** ให้หา Stereocilia เดคไม่ได้บอกว่าโครงสร้างไหนอยู่ในอวัยวะไหน และไม่ได้อธิบายความต่างของทั้งสามอย่าง สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Plasma cell และ Golgi apparatus",
        "source": "Cytology Lab 11Aug23 p.11-12",
        "body": [
          {
            "bullets": [
              "**A41-3 Duodenum** ให้ดู Plasma cell และ Golgi apparatus (หน้า 11)",
              "**B150-1 Lymph node** ให้ดู Plasma cell และ Golgi apparatus (หน้า 12)"
            ]
          },
          {
            "text": "โครงสร้างคู่นี้ปรากฏ 2 สไลด์ในอวัยวะต่างกันคือ duodenum กับ lymph node"
          }
        ]
      },
      {
        "heading": "Cell junction: desmosome และ gap junction",
        "source": "Cytology Lab 11Aug23 p.15-16",
        "body": [
          {
            "bullets": [
              "**A26-7 Metacarpal pad** ให้ดู Melanin pigment และ desmosome (หน้า 15)",
              "**A34-52 Left ventricle** ให้ดู Gap junction (หน้า 16)"
            ]
          },
          {
            "text": "ในเดคนี้ **desmosome ผูกกับสไลด์ metacarpal pad ส่วน gap junction ผูกกับสไลด์ left ventricle** ไม่มีคำอธิบายโครงสร้างหรือหน้าที่ของ junction ทั้งสองแบบ สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Pigment และ inclusion: lipofuscin กับ melanin",
        "source": "Cytology Lab 11Aug23 p.13-15, p.17",
        "body": [
          {
            "bullets": [
              "**B183 Spinal ganglion** ให้ดู Lipofuscin และ cell size (หน้า 13)",
              "**A11-1 Lower lip, prepuce** ให้ดู Melanin pigment (หน้า 14)",
              "**A26-7 Metacarpal pad** ให้ดู Melanin pigment และ desmosome (หน้า 15)",
              "**B117-3 Eyeball** ให้ดู Melanin pigment (หน้า 17)"
            ]
          },
          {
            "text": "**Melanin pigment เป็นโครงสร้างที่ถูกสั่งให้หามากที่สุดในเดคนี้ คือ 3 สไลด์** ได้แก่ lower lip prepuce, metacarpal pad และ eyeball ส่วน lipofuscin มีสไลด์เดียวคือ spinal ganglion เดคไม่ได้บอกลักษณะสีหรือวิธีแยก lipofuscin ออกจาก melanin สไลด์ไม่ได้บอก"
          }
        ]
      },
      {
        "heading": "Cell cycle",
        "source": "Cytology Lab 11Aug23 p.18",
        "body": [
          {
            "text": "หน้าสุดท้ายคือ **157-Allium root ให้ดู Cell cycle**"
          },
          {
            "text": "เดคไม่ได้ระบุว่าต้องดูระยะไหนของ cell cycle หรือให้แยกกี่ระยะ สไลด์ไม่ได้บอก"
          }
        ]
      }
    ]
  },
  "histo--cytology": {
    "topic": "histo--cytology",
    "title": "Cytology",
    "icon": "📖",
    "lecturer": "Benchaphorn Limcharoen, DVM., Ph.D. (Department of Anatomy, Faculty of Veterinary Science, Chulalongkorn University)",
    "summary": "เด็คนี้เป็น Chapter 01 ของ Vet Histology แบ่งเป็น 2 ครึ่ง ครึ่งแรก (p.1-41) ไล่โครงสร้างพื้นฐานของเซลล์ทีละส่วน (nucleus, cell membrane, organelles, cytoskeleton, cell surface specialization, cell cycle) จบด้วย synopsis ตารางหน้าที่ ครึ่งหลัง (p.42-91) ชื่อ Cell structure correlates with functions เป็นการสอนอ่านเซลล์จากภาพจริง โดยใช้ descriptive terms (ขนาด รูปร่าง สีของ cytoplasm ลักษณะ nucleus) แล้วโยงกลับไปหา organelle ที่เด่นในเซลล์นั้น รวมถึง cytoplasmic inclusion ทั้งหมด ต้องบอกตรง ๆ ว่าสไลด์จำนวนมากในเด็ค (โดยเฉพาะ p.45, 50, 57-59, 64-66, 82, 84-91) เป็นภาพ photomicrograph ที่แทบไม่มีข้อความประกอบ และ 2 หน้าสุดท้าย (p.92-93) เป็นรายการสไลด์ lab ล้วน ๆ",
    "sections": [
      {
        "heading": "Cytology คืออะไร และเซลล์ประกอบขึ้นเป็นร่างกายอย่างไร",
        "source": "Cytology p.3-4",
        "body": [
          {
            "text": "สไลด์เปิดด้วยลำดับชั้นของสิ่งมีชีวิต **differentiated cell types → tissues → organ → organ system → organism** โดยยกตัวอย่าง organ เป็น kidney และ organ system เป็น urinary tract system"
          },
          {
            "text": "cell types ที่สไลด์ยกมาเป็นตัวอย่างของ differentiated cell มี 4 กลุ่ม",
            "bullets": [
              "Muscle tissue cells",
              "Nerve cells",
              "Epithelial cells",
              "Connective cells"
            ]
          },
          {
            "sub": "Diversity of functions of the cells (p.4)",
            "body": [
              {
                "bullets": [
                  "Motility: muscle cell",
                  "Clearance of debris and foreign materials: inflammatory cells",
                  "Nutrient absorption: cell of gastrointestinal tract",
                  "Ion transport: cells of kidney",
                  "Conductivity of an electrical signal: nerve cell",
                  "Synthesis and secretions of enzymes, mucous materials, steroids และอื่น ๆ: pancreatic acinar cells, mucous gland cells, gonadal cells"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Microscopes and techniques",
        "source": "Cytology p.5",
        "body": [
          {
            "text": "สไลด์เทียบกล้อง 2 แบบด้วย resolution และวิธีย้อม **Light microscope = 0.2 µm ย้อม H&E, Electron microscope = 0.2-0.5 nm ใช้ metals**"
          },
          {
            "bullets": [
              "H&E: Blue-purple = Basophilic, Pink = acidophilic",
              "EM: ภาพเป็น Black-white โดย metals ทำหน้าที่ enhance contrast"
            ]
          },
          {
            "text": "ภาพตัวอย่างบนสไลด์เป็น chondrocyte ใน hyaline cartilage ทั้ง 3 เทคนิค คือ LM 400× H&E, EM 2000× และ High-resolution Scanning EM (HRSEM) 2000× โดยมี label Nu (nucleus), Cy (cytoplasm) และ ECM"
          }
        ]
      },
      {
        "heading": "Nucleus: องค์ประกอบและสิ่งที่บรรจุอยู่",
        "source": "Cytology p.7, p.53",
        "body": [
          {
            "text": "p.7 แบ่งเซลล์เป็น 3 ส่วนหลัก คือ nucleus, cytoplasm และ cell membrane แล้วซูมเข้าไปที่ nucleus ซึ่งประกอบด้วย chromatin, nucleolus, nuclear envelope และ nuclear pores โดยรอบ nucleus เป็น rough ER"
          },
          {
            "sub": "สรุปนิวเคลียสจาก p.53",
            "body": [
              {
                "bullets": [
                  "Genetic materials: DNA + Nucleoprotein (Histone และ non-histone proteins) และ RNA (mRNA, tRNA, rRNA)",
                  "Size and shape: spherical, ellipsoidal, elongated, lobulated",
                  "Number of nucleus: one nucleus, binucleated, multinucleated",
                  "Composition: Nucleolus, Chromatin, Nuclear envelope"
                ]
              },
              {
                "text": "**All eukaryotic cells have nucleus except e.g., mammalian red blood cells**"
              }
            ]
          },
          {
            "text": "p.8 หัวข้อ Chromatin distribution ระบุว่าเป็น New finding และวางภาพเทียบ previous กับผลจากงาน live imaging ปี 2021 ใน Science Advances แต่สไลด์ไม่ได้เขียนข้อความอธิบายว่าหลักการใหม่คืออะไร"
          }
        ]
      },
      {
        "heading": "Nuclear envelope และ nucleolus",
        "source": "Cytology p.13-14",
        "body": [
          {
            "sub": "Nuclear envelope (p.13)",
            "body": [
              {
                "bullets": [
                  "เป็น Two lipid bilayer",
                  "Outer membrane: continuous กับ rER",
                  "Inner membrane: อยู่ near heterochromatin",
                  "Perinuclear space",
                  "Nuclear pore"
                ]
              }
            ]
          },
          {
            "sub": "Nucleolus (p.14)",
            "body": [
              {
                "bullets": [
                  "Dense structure in nucleus during interphase",
                  "รูปร่าง spherical และ ovoid",
                  "**Site of ribosomal RNA synthesis แล้ว release เข้าสู่ cytoplasm**",
                  "Size of the nucleolus สะท้อน amount of stored RNA"
                ]
              },
              {
                "text": "ภาพประกอบเป็น cerebrum ของสุนัข (scale 20 µm)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Central dogma of life",
        "source": "Cytology p.9-11",
        "body": [
          {
            "text": "**Gene = segment of DNA encoding a particular protein** และการทำงานคือ DNA (A,T,C,G codes) → mRNA (sets of instruction) → Protein (sequences of amino acids)"
          },
          {
            "bullets": [
              "Replication: ที่ระดับ DNA",
              "Transcription: mRNA is synthesized based on the DNA template",
              "Translation: เกิด in cytoplasm ได้ protein ตามรหัสใน DNA",
              "mRNA เป็น single strand และ Thymine เปลี่ยนเป็น uracil"
            ]
          },
          {
            "sub": "สิ่งที่ต้องเกิดก่อน transcription (p.11)",
            "body": [
              {
                "bullets": [
                  "Opening of the DNA double helix",
                  "Assembling the set of enz.",
                  "Gathering of nucleotides"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cytoplasm และ cell membrane",
        "source": "Cytology p.15-16",
        "body": [
          {
            "text": "p.15 ลิสต์สิ่งที่ cytoplasm เกี่ยวข้อง ได้แก่ Volume, Phagocytosis, Motility, Energy formation and release, Protein synthesis และ Growth"
          },
          {
            "sub": "Cell membrane (p.16)",
            "body": [
              {
                "bullets": [
                  "เป็น Semipermeable barriers ที่ Selectively regulate movement of ions, water, and macromolecules",
                  "**Trilaminar structure (unit membrane) และอธิบายด้วย Fluid mosaic model**",
                  "Phospholipid: hydrophilic head และ hydrophobic tail",
                  "โปรตีนมี Integral proteins และ peripheral structure proteins"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Mitochondria",
        "source": "Cytology p.18",
        "body": [
          {
            "text": "**Membrane-bound organelle หน้าที่ ATP** กระจายทั่ว cytoplasm โดยเฉพาะบริเวณที่ใช้พลังงานสูง"
          },
          {
            "sub": "ตำแหน่งที่สไลด์ระบุว่าพบ mitochondria หนาแน่น",
            "body": [
              {
                "bullets": [
                  "Apical area of ciliated cells",
                  "Basal area of ion-transporting cells",
                  "Subsarcolemmal area of skeletal and cardiac muscle cells"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้าง",
            "body": [
              {
                "bullets": [
                  "Outer membrane: smooth contour มี Porin ซึ่ง increases membrane permeability ให้โมเลกุลและ metabolites ผ่านเข้าไปเพื่อ ATP synthesis",
                  "Inner membrane: พับเป็น cristae (transverse shelf-like หรือ tubular folds) ยื่นเข้าไปในช่องด้านใน ซึ่งเรียกว่า mitochondrial matrix"
                ]
              },
              {
                "text": "ภาพเป็น High resolution SEM แบบ fractured open view ที่เห็น internal cristae"
              }
            ]
          }
        ]
      },
      {
        "heading": "Endoplasmic reticulum",
        "source": "Cytology p.19",
        "body": [
          {
            "text": "ER ต่อเนื่องกับ outer nuclear envelope เป็น **anastomosing (interconnected) network ของ membrane-delimited sacs (cisternae) และ tubules**"
          },
          {
            "bullets": [
              "rER: มี Ribosome ทำ protein synthesis",
              "sER: lacking ribosome ทำ Lipid synthesis, steroid hormone synthesis และ detoxification of harmful agents"
            ]
          },
          {
            "sub": "ตัวอย่างเซลล์ที่ sER เด่น",
            "body": [
              {
                "bullets": [
                  "Hepatocyte ย่อยสลาย lipid-soluble drug และ alcohol ด้วย enz. CYP450",
                  "Steroid-secreting cells ใน ovary, testis และ adrenal gland ทำ lipid และ lipoprotein synthesis",
                  "Muscle cell: sER คือ sarcoplasmic reticulum ทำหน้าที่ calcium ion regulation สำหรับ muscle contraction"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Ribosome",
        "source": "Cytology p.20",
        "body": [
          {
            "text": "เป็น cytoplasmic granules และเป็น **Non-membranous organelle** หน้าที่ protein synthesis โดยจำนวน ribosome สัมพันธ์กับ rate of protein synthesis"
          },
          {
            "bullets": [
              "Free ribosomes: synthesize protein สำหรับใช้ภายใน cytoplasm",
              "Ribosomes attached to the ER: สำหรับ secretion, lysosomal enzymes และ protein for new membrane"
            ]
          },
          {
            "text": "**Nissl substances ใน neuron ติดสี basophilic** (สไลด์โยงเรื่องนี้อีกครั้งที่ p.58 และ p.79)"
          }
        ]
      },
      {
        "heading": "Golgi complex",
        "source": "Cytology p.23-24",
        "body": [
          {
            "text": "เป็น complex array ของ flattened, slightly curved, closely packed membrane-bound sacs (cisternae) พร้อม vesicles และ vacuoles ขนาดใหญ่ และมี **functional polarity**"
          },
          {
            "sub": "3 functionally distinct compartments",
            "body": [
              {
                "bullets": [
                  "cis-Golgi network of vesicles (convex side)",
                  "medial compartment of stacks of flattened saccules",
                  "trans-Golgi network of vesicles (concave side)"
                ]
              }
            ]
          },
          {
            "sub": "หน้าที่",
            "body": [
              {
                "bullets": [
                  "adding proteins to sugars to form glycoproteins",
                  "assembling polysaccharides",
                  "elaborating membrane lipids",
                  "producing lysosomes that are kept by cells"
                ]
              }
            ]
          },
          {
            "sub": "เส้นทางของ secretory vesicle (p.24)",
            "body": [
              {
                "text": "Secretory vesicles ออกจากด้าน trans ของ Golgi แล้วเดินทางผ่านระบบ microtubules หรือ microfilaments ไปยัง cell surface จากนั้น outer membrane ของ transport vesicle fuse กับ cell membrane และปล่อยสิ่งที่บรรจุออกสู่ extracellular environment ซึ่งคือ **exocytosis**"
              },
              {
                "text": "vesicle อื่น ๆ ถูกส่งไปที่ apical และ basolateral regions เพื่อรวมเข้ากับ plasma membrane และส่งไปที่ endosomes และ lysosomes"
              }
            ]
          },
          {
            "callout": "Clinical link ที่สไลด์เขียนไว้: Alzheimer disease มี fragmentation and marked atrophy of the Golgi complex ร่วมกับ abnormal protein aggregates",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lysosomes และ Peroxisomes",
        "source": "Cytology p.25, p.28",
        "body": [
          {
            "sub": "Lysosomes (p.25)",
            "body": [
              {
                "text": "**Hydrolytic enzymes สำหรับ intracellular digestion โดยเฉพาะใน phagocytic cells**"
              },
              {
                "bullets": [
                  "Heterophagy: ย่อย macromolecule, phagocytose microorganisms และ cellular debris",
                  "Autophagy: ย่อย excess หรือ senescent organelles เช่น mitochondria และ RER",
                  "กลไกการนำเข้า: Phagocytosis, pinocytosis และ Receptor-mediated endocytosis"
                ]
              },
              {
                "text": "สไลด์เขียนหัวข้อ Lysosomal Storage disease ไว้ และหน้าถัดมา (p.27) อ้างงานตีพิมพ์เรื่อง Gangliosidoses in cats ใน The Thai Journal of Veterinary Medicine ปี 2022 แต่ไม่ได้อธิบายรายละเอียดของโรคบนสไลด์"
              }
            ]
          },
          {
            "sub": "Peroxisomes (p.28)",
            "body": [
              {
                "text": "เป็น Membranous-sac ของ oxidase และ catalase enz. มี lipid bilayer และ crystalline core"
              },
              {
                "bullets": [
                  "Detoxify สารพิษหลายชนิด เช่น Free radicals (Reactive oxygen species; ROS) โดย **catalase breaks down hydrogen peroxide**",
                  "Break down long chain fatty acids (lipid metabolism)",
                  "Help form phospholipid สำหรับ cell membrane โดยเฉพาะใน myelination of nerve cells"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cytoskeleton: ตารางเปรียบเทียบ 3 ชนิด",
        "source": "Cytology p.29-30",
        "body": [
          {
            "text": "ทั้งสามเป็น Non-membrane-bound organelles สไลด์ทำเป็นตารางเทียบ subunit, โครงสร้าง, ขนาด, ตำแหน่ง และหน้าที่"
          },
          {
            "sub": "Microfilament",
            "body": [
              {
                "bullets": [
                  "Subunit: G-actin monomers, monomeric protein คือ Globular actin",
                  "โครงสร้าง: 2 intertwined filaments of F-actin, diameter **5-7 nm**",
                  "ตำแหน่ง: Concentrated beneath cell membrane และใน cell extensions เช่น microvilli",
                  "หน้าที่: Contract and move cells, change cell shape, cytokinesis, cytoplasmic transport and streaming (p.30 เพิ่ม pinocytosis, phagocytosis)"
                ]
              }
            ]
          },
          {
            "sub": "Intermediate filament",
            "body": [
              {
                "bullets": [
                  "Subunit: Antiparallel tetramers of 2 rod-like dimers, monomeric protein คือ various α-helical rod-like protein",
                  "โครงสร้าง: Cable of 4 intertwined protofibrils แต่ละอันเป็น bundled tetramers ต่อกันแบบ end to end, diameter **8-10 nm**",
                  "ตำแหน่ง: Arrayed throughout cytoplasm, at desmosomes, inside nuclear envelope",
                  "หน้าที่: Strengthen cell and tissue structure, maintain cell shape, maintain nuclear shape",
                  "p.30 เพิ่มว่า **Tissue specific จึงใช้เป็น Dx tumor marker ได้**"
                ]
              }
            ]
          },
          {
            "sub": "Microtubule",
            "body": [
              {
                "bullets": [
                  "Subunit: Heterodimers of αβ-tubulin (α และ β tubulin, 54 kDa)",
                  "โครงสร้าง: Hollow tube ผนังเป็น 13 parallel protofilaments, diameter **25 nm**",
                  "ตำแหน่ง: ทอดผ่าน cytoplasm จากจุดรวมที่ centrosomes",
                  "หน้าที่: Maintain cell's shape and polarity, เป็น tracks สำหรับ organelle และ chromosome movement, move cilia and flagella",
                  "p.30 ระบุ Centriole เป็น Microtubule triplet แบบ **9+0 pattern**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cell surface specialization ด้าน apical",
        "source": "Cytology p.31-36 (ภาพซ้ำที่ p.64-68)",
        "body": [
          {
            "sub": "Microvilli (p.31, p.67)",
            "body": [
              {
                "text": "Cylindrical, membrane-bound projections of cytoplasm จาก apical surface ของ epithelial cells หน้าที่ **Increase surface area of absorption** ตัวอย่างคือ small intestine (ภาพ jejunum สุนัข, enterocyte)"
              }
            ]
          },
          {
            "sub": "Stereocilia (p.32, p.68)",
            "body": [
              {
                "text": "**Long-branched microvilli ที่พบเฉพาะใน epididymis และ sensory hair cells of cochlea (inner ear)**"
              },
              {
                "bullets": [
                  "หน้าที่ใน epididymis: increase surface area",
                  "หน้าที่ใน hair cells: signal generation",
                  "เป็น Non motile structure",
                  "ภาพเป็น tail of epididymis ของม้า (stallion)"
                ]
              }
            ]
          },
          {
            "sub": "Cilia (p.34-35, p.64-65)",
            "body": [
              {
                "text": "Motile, hair-like projection แบบ **microtubule 9+2** งอกจาก centriole (basal body) และมีแกน axoneme core แบบ 9+2"
              },
              {
                "bullets": [
                  "พบที่ Respiratory tract และ Reproductive tract",
                  "หน้าที่: Mucociliary clearance และ Move ovum from ovary to uterus",
                  "ภาพประกอบ: horse trachea และ ciliated columnar respiratory epithelial cells ของไก่"
                ]
              }
            ]
          },
          {
            "sub": "Flagella (p.36, p.66)",
            "body": [
              {
                "text": "สไลด์เขียนว่าเป็น Single cilia ตัวอย่างคือ spermatozoa ใน seminiferous tubules ของ testis (scale 20 µm)"
              }
            ]
          }
        ]
      },
      {
        "heading": "Cell surface specialization ด้าน lateral และ basolateral: Junctional complex",
        "source": "Cytology p.69-71",
        "body": [
          {
            "text": "สไลด์แบ่งผิวเซลล์เป็น Apical และ Lateral/Basolateral แล้วอธิบาย junctional complex 3 ชนิด"
          },
          {
            "bullets": [
              "**Tight junction: อยู่ Most apical พบใน epithelial cells ทำหน้าที่ Selective permeability barrier**",
              "Adhering junction, Desmosome: มี Granular materials และ microfilament หน้าที่ Resist to shearing force",
              "Gap junction: คือ intercalated disc ของ Cardiac muscle ทำหน้าที่เป็น ion channels"
            ]
          },
          {
            "text": "ภาพประกอบคือ desmosome ที่เห็นเป็น Intercellular bridging หรือ Spiny projection ใน stratum spinosum ของ epidermis หนูขาว (p.70 และย้ำอีกที่ p.33) และ gap junction ที่ intercalated disc ของ cardiomyocyte ในหัวใจสุนัข (p.71)"
          }
        ]
      },
      {
        "heading": "Cell cycle",
        "source": "Cytology p.37 (ภาพชุดที่ p.38-39, p.82)",
        "body": [
          {
            "text": "แบ่งเป็น Interphase และ Mitotic phase (M phase) ซึ่งประกอบด้วย Mitosis (Prophase, Metaphase, Anaphase, Telophase) และ Cytokinesis ได้ผลลัพธ์เป็น 2 daughter cells โดยมี chromosome duplication เกิดขึ้นก่อน"
          },
          {
            "sub": "การจัดกลุ่มเซลล์ตามความสามารถในการแบ่งตัว",
            "body": [
              {
                "bullets": [
                  "**Labile cells: M→G1 ได้แก่ epidermis (skin), blood cells, intestine**",
                  "**Stable cells: M→G0 ได้แก่ hepatocytes**",
                  "**Permanent cells: อยู่ G0 ได้แก่ cardiac myocyte, neuron**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Synopsis: หน้าที่ของส่วนประกอบหลักของเซลล์",
        "source": "Cytology p.40-41",
        "body": [
          {
            "sub": "Nucleus",
            "body": [
              {
                "bullets": [
                  "Nucleus: Synthesizes all types of RNA และ replicates its DNA",
                  "Heterochromatin: Condenses inactive DNA",
                  "Euchromatin: Renders DNA accessible to transcription",
                  "Nucleolus: Produces ribosomal RNA และ assembles ribosome particles",
                  "Nuclear envelope: Segregates DNA from cytoplasmic constituents",
                  "Nuclear pore: Controls access ของโมเลกุลที่เคลื่อนที่ระหว่าง nucleus กับ cytoplasm"
                ]
              }
            ]
          },
          {
            "sub": "Cell Surface",
            "body": [
              {
                "bullets": [
                  "Microvillus: Increases the area of plasmalemma ที่ free (apical) surface ของ epithelial cell",
                  "Cilium: Moves the material along the apical surface ของ epithelial cell",
                  "Basal lamina: Contributes to the boundary ระหว่างเซลล์กับ interstitium โดยรอบ"
                ]
              }
            ]
          },
          {
            "sub": "Cytoskeleton",
            "body": [
              {
                "bullets": [
                  "Actin filament: contraction, cell motility, cell stiffness, muscle contraction",
                  "Intermediate filament: structural (mechanical) strength ของเซลล์",
                  "Microtubule: tracks สำหรับ intracellular movement, การเคลื่อนไหวของ cilia และของ chromosomes ระหว่างแบ่งเซลล์"
                ]
              }
            ]
          },
          {
            "sub": "Cytoplasm",
            "body": [
              {
                "bullets": [
                  "Mitochondria: Generate ATP และช่วยสังเคราะห์บางโมเลกุล",
                  "Ribosome: Translates mRNA to polypeptides",
                  "RER: Synthesizes proteins ที่จะถูกกักไว้ในเมมเบรนหรือเกี่ยวข้องกับเมมเบรน",
                  "SER: lipid metabolism, drug detoxification, calcium regulation",
                  "Golgi complex: Modifies, packages, and traffics proteins",
                  "Lysosome: Degrades extraneous material",
                  "Vesicles: Segregate molecules from cytosol"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปรัชญาการอ่านเซลล์: Cellular biology and cytological interpretation",
        "source": "Cytology p.44 (ซ้ำที่ p.54), p.55",
        "body": [
          {
            "text": "สไลด์วางกรอบการบรรยายเซลล์ไว้ 2 กลุ่มใหญ่"
          },
          {
            "sub": "Cellular morphologies",
            "body": [
              {
                "bullets": [
                  "Size of cells",
                  "Cellular shape",
                  "Nuclear:cytoplasmic (n/c) ratio",
                  "Specialized cellular structures",
                  "Shape of the nucleus, Location of the nucleus, Number of nuclei",
                  "Chromatin patterns, Nucleolus, Mitosis"
                ]
              }
            ]
          },
          {
            "sub": "Cytoplasmic morphologies",
            "body": [
              {
                "bullets": [
                  "Color of the cytoplasm",
                  "Pattern of the cytoplasm",
                  "Visible intracytoplasmic structures and inclusions"
                ]
              }
            ]
          },
          {
            "callout": "ประโยคแกนของครึ่งหลังอยู่ที่ p.55 คือ **The ultrastructure and general histologic appearance of a cell are determined by the nature of the most prominent proteins the cell is making**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Descriptive terms: cell size และ cell shape",
        "source": "Cytology p.45-47",
        "body": [
          {
            "text": "p.45 เป็นภาพเปรียบเทียบขนาดเซลล์ล้วน ๆ ได้แก่ lymphocyte (thymus หนู 400×), RBC และ WBC (blood smear สุนัข 400×), nerve cell (dorsal root ganglion 235×), megakaryocyte (BM smear 560×) และ ovary ของสุนัขเพศเมีย 125× โดยไม่มีข้อความอธิบายเพิ่ม"
          },
          {
            "sub": "รูปร่างของ epithelial cell (p.46)",
            "body": [
              {
                "bullets": [
                  "Squamous: Flattened shape",
                  "**Cuboidal: Height = width**",
                  "**Columnar: Height > width**"
                ]
              }
            ]
          },
          {
            "sub": "รูปร่างอื่น ๆ (p.47)",
            "body": [
              {
                "bullets": [
                  "Spherical/ovoid: Ball-shaped หรือ egg-shaped เช่น mast cell, plasma cell",
                  "Fusiform: Elongated และ tapering ที่ปลายทั้ง 2 ข้าง เช่น smooth muscle cells โดยขอบเขตของเซลล์รูป long spindle นี้แยกยาก",
                  "Polyhedral: Pentagon, hexagon เช่น hepatocyte",
                  "Polarized: ปลายด้านหนึ่งต่างจากอีกด้าน เช่น intestinal epithelium (apical ไม่เท่ากับ basal) และ mucus-secreting cell ที่มี secretory vesicles"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Descriptive terms: cytoplasm features",
        "source": "Cytology p.48-49",
        "body": [
          {
            "text": "ในภาพย้อม H&E **Basophilic components ติดสี blue-purple ส่วน Acidophilic components ติดสี pink-red**"
          },
          {
            "sub": "Granules และ vesicles (p.48)",
            "body": [
              {
                "bullets": [
                  "Small acidophilic granules: eosinophil",
                  "Large acidophilic secretory granules ที่ apical cytoplasm: Paneth cell",
                  "**Basal cytoplasm ที่ติดสี basophilic บ่งว่ามี large amounts of rER**"
                ]
              }
            ]
          },
          {
            "sub": "Vacuolate cytoplasm และปริมาณ cytoplasm (p.49)",
            "body": [
              {
                "bullets": [
                  "Vacuolate cytoplasm: เห็นเป็น empty holes ซึ่งเป็น lipid droplets หรือ vesicles เช่นใน steroid hormone-producing cell ภาพที่ยกมาคือ adrenal cortex ที่มี droplets ของ lipid ชนิด cholesterol",
                  "Abundant: มี cytoplasm ปริมาณมาก / Scant: มี cytoplasm บาง ๆ ล้อมรอบ nucleus"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Descriptive terms: nucleus features",
        "source": "Cytology p.51-52",
        "body": [
          {
            "bullets": [
              "Large versus small",
              "**Euchromatin: dispersed, lightly stained, accessible to transcription / Heterochromatin: condensed, darkly stained, inactive** และมีแบบ mixed",
              "Nucleoli prominent: การเห็น nucleolus ชัดบ่งว่าเซลล์กำลัง actively synthesizing ribosomes จึงกำลังสร้าง proteins",
              "Mitotic nucleus: เช่น metaphase cell ที่ nuclear envelope ละลายไป เห็น dark chromosomes และ condensed particles หรือ anaphase cell ที่เห็น chromosome 2 กลุ่ม"
            ]
          },
          {
            "sub": "Simple versus segmented (p.52)",
            "body": [
              {
                "bullets": [
                  "Simple nucleus: เป็น single structure รูปร่างได้หลายแบบ (round, oval, indented, fusiform, irregular)",
                  "**Segmented nucleus: แบ่งเป็น 2 lobes ขึ้นไป พบใน white blood cells บางชนิด** (ภาพเป็นเลือดสุนัข)"
                ]
              }
            ]
          },
          {
            "callout": "Inference ที่สไลด์ให้ไว้ตรง ๆ: เซลล์ที่ active in protein synthesis จะมี fairly large nuclei, prominent nucleoli และ preponderance of euchromatin เช่น rapidly dividing cells, cells that secrete proteins และ neurons",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "โยงโครงสร้างกลับไปหา organelle: ตัวอย่างจากภาพจริง",
        "source": "Cytology p.56, p.58-63",
        "body": [
          {
            "sub": "rER และ secretory granules: pancreatic acinar cell (p.56)",
            "body": [
              {
                "bullets": [
                  "เห็น nucleus, nucleoli และ euchromatin",
                  "**Basophilic cytoplasm ที่ basal end ของเซลล์ = high conc. rER ที่ตำแหน่งนั้น**",
                  "Golgi apparatus ปรากฏเป็น pale, unstained area ของ cytoplasm ที่ขอบด้าน apical ของ nucleus",
                  "Secretory granules ติดสี acidophilic (eosinophilic)"
                ]
              },
              {
                "text": "p.58 ยกภาพ spinal cord สุนัข ระบุคำว่า rER หรือ ergastoplasm และ Nissl body"
              }
            ]
          },
          {
            "sub": "Mitochondria: striated duct และ ion-pumping cells (p.59-60)",
            "body": [
              {
                "bullets": [
                  "Striated duct cell ของ serous gland สุนัข เห็นเป็น vertical stripes ระหว่าง apical กับ basement",
                  "Ion-pumping cells ของ renal tubule: อยู่ที่ baso และ lateral surface ของเซลล์ มี **acidophilic (eosinophilic) cytoplasm ซึ่งบ่งถึง abundance of mitochondria ที่ basal portions ของเซลล์**"
                ]
              }
            ]
          },
          {
            "sub": "Golgi: plasma cell (p.61-62)",
            "body": [
              {
                "bullets": [
                  "**halo area ใน plasma cell คือ clear zone ที่บรรจุ Golgi apparatus**",
                  "Plasma cells: Eccentric nuclei, condensed chromatin, abundant deeply basophilic cytoplasm พร้อม perinuclear clear area (Golgi region)",
                  "Macrophages ในภาพเดียวกัน: Abundant, vacuolated cytoplasm และ irregularly shaped nuclei ที่มี moderately condensed chromatin",
                  "ภาพเป็น lymph node aspiration ย้อม Wright-Giemsa กำลังขยาย 1000×"
                ]
              }
            ]
          },
          {
            "sub": "Lysosome: macrophage และ mesothelial cell (p.63)",
            "body": [
              {
                "bullets": [
                  "Macrophages: foamy cytoplasm",
                  "Mesothelial cells: deeply basophilic cytoplasm, ระบุ nuclear:cytoplasmic ratio และเป็น binucleated",
                  "ภาพเป็น pericardial fluid ย้อม Wright-Giemsa 1000×"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Intermediate filament: clinical application",
        "source": "Cytology p.72",
        "body": [
          {
            "text": "สไลด์เป็นภาพ immunohistochemistry ชุดหนึ่งเพื่อแสดงว่า IF ใช้เป็น marker ได้ ตัวอย่างที่ label ไว้คือ"
          },
          {
            "bullets": [
              "PanCK: Ovarian tumor ในหมี",
              "SMA: teratoma ในสุนัข",
              "Vimentin: teratoma ในสุนัข",
              "Keratin-10: Skin หนูขาว",
              "**Glial Fibrillary Acidic Protein (GFAP) ใน Human astrocytoma**"
            ]
          },
          {
            "text": "สไลด์ไม่ได้เขียนเกณฑ์การแปลผลหรือบอกว่า marker ไหนคู่กับเนื้อเยื่อต้นกำเนิดใดอย่างเป็นระบบ มีเพียงชื่อ marker คู่กับภาพ"
          }
        ]
      },
      {
        "heading": "Cytoplasmic inclusion",
        "source": "Cytology p.73-81",
        "body": [
          {
            "text": "นิยามที่สไลด์ให้: เป็น **Deposits of materials ที่ No metabolic activity** แบ่งเป็น storage and reserve materials (glycogen, fats, proteins) และ pigments ซึ่งมีทั้ง Endogenous (hemosiderin, melanin) และ Exogenous (dust, heavy metals)"
          },
          {
            "sub": "Glycogen (p.74)",
            "body": [
              {
                "text": "เป็น storage structure ของเซลล์ ภาพเป็น glycogen ใน cytoplasm ของ hepatocyte ย้อมด้วย **Periodic acid-Schiff (PAS)** และสไลด์เขียนชื่อโรค Glycogen storage disease (GSD) ไว้โดยไม่ได้อธิบายต่อ"
              }
            ]
          },
          {
            "sub": "Lipid (p.75-76)",
            "body": [
              {
                "bullets": [
                  "ภาพ fat cells ใน adipose tissue 480× H&E label Nu (nucleus) และ Cy (cytoplasm)",
                  "Lipid droplets พบใน adipocytes, adrenal cortical cells และ liver cells",
                  "**Lipid ใน cytoplasm ของ hepatocyte ย้อมด้วย oil red o** และสไลด์เขียนคำว่า Fatty liver กำกับภาพตับหนู"
                ]
              }
            ]
          },
          {
            "sub": "Hemosiderin (p.77)",
            "body": [
              {
                "text": "**Hemosiderin เกิดจาก the breakdown of hemoglobin เป็น Iron storage complex จัดเป็น hematogeneous pigments** พบที่ Liver, spleen, LN (ภาพเป็นตับสุนัข)"
              }
            ]
          },
          {
            "sub": "Lipofuscin (p.78-79)",
            "body": [
              {
                "bullets": [
                  "Yellow to brown pigment เป็น insoluble degradation product ของ organelle",
                  "เป็น Undigestible remnants of lysosomal activity หรือ Residual bodies",
                  "**เรียกว่า Aging pigment, wear and tear pigment, waste pigment**",
                  "พบใน long-lived cell เช่น cardiac muscle, neurons และ ovum (ภาพเป็นสมองสุนัข)",
                  "p.79 เทียบให้เห็นคู่กันในเซลล์ประสาท คือ Nissl substance ที่ทำให้ cytoplasm basophilia จาก abundant ribosomes และ rER (protein synthesis) กับ Lipofuscin (Lf) ที่เป็น wear-and-tear pigment"
                ]
              }
            ]
          },
          {
            "sub": "Melanin (p.80)",
            "body": [
              {
                "text": "Melanin pigments มาจาก melanocyte ติดสี Brown พบเช่นที่ skin และ pigment cells of retina ภาพเป็นผิวหนังสุนัข และสไลด์เขียนคำว่า Melanoma ไว้โดยไม่ได้อธิบายต่อ"
              }
            ]
          },
          {
            "callout": "p.81 พาดหัวว่า Cytoplasmic inclusion?????? -- artifacts เป็นการเตือนว่าสิ่งที่เห็นในไซโทพลาซึมอาจเป็น artifact ไม่ใช่ inclusion จริง แต่สไลด์ไม่ได้บอกว่าจะแยก artifact ออกจาก inclusion อย่างไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Review และรายการสไลด์ Lab",
        "source": "Cytology p.83-93",
        "body": [
          {
            "text": "p.84-91 เป็นช่วง Review ซึ่งเป็นภาพล้วนพร้อม label สั้น ๆ ให้ฝึกอ่านเอง ได้แก่ fibroblast กับ collagen fiber (tendon), neuron ที่มี huge nucleus with nucleolus เทียบกับ small nucleus, skeletal muscle, serous gland สุนัขที่ให้ดู euchromatin (light) กับ heterochromatin (dark), jejunum สุนัข, uterine tube สุนัขที่ label Sq. shape (Endothelium) และ erythrocytes และ liver สุนัขที่ label Binuclei"
          },
          {
            "text": "p.84 ให้ Tips ในการบรรยายเซลล์ไว้เป็นหัวข้อ: General characteristics and biological function, Shape and size, Nucleus, Cytoplasm, Location, Cytoarchitectures"
          },
          {
            "sub": "หัวข้อที่ต้องดูใน Cytology Lab (p.92-93)",
            "body": [
              {
                "bullets": [
                  "โครงสร้างพื้นฐาน: Nucleus, Cytoplasm, Binucleated cell, Fibroblast, RBC (no nucleus), Barr body/sex chromatin, Mitochondria/chromatin, rER, Plasma cell",
                  "Cell inclusions: melanin pigment (eye, lower lips), secretory granules หรือ zymogen granules (pancreas), lipofuscin (ovary, ganglion), hemosiderin (spleen)",
                  "Apical surface specialization: Cilia, Flagella, Microvilli, Stereocilia",
                  "Lateral surface specialization (junctional complexes): Desmosome, Gap junction (intercalated disc)",
                  "Cell division"
                ]
              },
              {
                "text": "สองหน้านี้เป็นรายการเลขสไลด์แก้ว lab ทั้งหมด ไม่มีเนื้อหาบรรยายเพิ่ม"
              }
            ]
          }
        ]
      }
    ]
  },
  "histo--digestive-system-i": {
    "topic": "histo--digestive-system-i",
    "title": "Digestive System I",
    "icon": "📖",
    "lecturer": "Kamol Sakulwira",
    "summary": "เลกเชอร์นี้เดินจาก pattern 4 ชั้นของ digestive tract แล้วไล่ตาม oral cavity ทีละส่วน (lips, cheeks, hard palate, soft palate, tongue กับ lingual papillae และ taste buds, teeth และการพัฒนาของฟัน), ต่อด้วย salivary glands (parotid, mandibular, sublingual, zygomatic, molar) และจบที่ pharynx โดยยังไม่แตะ esophagus ลงไป. เนื้อหาจริงเป็น bullet สั้น ๆ เน้นชนิดของ epithelium, ต่อมประจำแต่ละบริเวณ และความแตกต่างระหว่างสัตว์แต่ละชนิด ส่วนสไลด์อีกจำนวนมาก (ราวครึ่งเด็ค) เป็นภาพ histology ที่มีแต่ตัวเลข-ตัวอักษรชี้โครงสร้าง ไม่มีคำบรรยายเพิ่ม และหน้า 37 เป็นหน้าว่างไม่มีข้อความเลย",
    "sections": [
      {
        "heading": "ขอบเขตของ Digestive system ที่เด็คนี้นับรวม",
        "source": "Digestive System I p.2",
        "body": [
          {
            "text": "สไลด์ไล่รายชื่ออวัยวะทั้งระบบไว้ก่อน แล้วค่อยเจาะ oral cavity เป็นอันดับแรก"
          },
          {
            "bullets": [
              "ทางเดินหลัก: oral cavity, pharynx, esophagus, stomach, small intestine, large intestine, anus",
              "associated organs: salivary glands, liver, gall bladder, pancreas",
              "**Oral cavity ประกอบด้วย lips, cheeks, hard palate, soft palate, tongue และ teeth**"
            ]
          },
          {
            "callout": "เด็ค Digestive System I หยุดที่ pharynx (สไลด์สุดท้ายคือ oropharynx) ยังไม่ลง esophagus ลงไป",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Pattern พื้นฐาน 4 ชั้นของ digestive tract",
        "source": "Digestive System I p.3",
        "body": [
          {
            "text": "**ผนังทางเดินอาหารวางตัวเป็น 4 tunica เสมอ** และสไลด์ผูก plexus ของระบบประสาทไว้กับชั้นที่มันอยู่"
          },
          {
            "sub": "1. Tunica mucosa",
            "body": [
              {
                "bullets": [
                  "1.1 epithelium",
                  "1.2 lamina propria",
                  "1.3 lamina muscularis หรือ muscularis mucosae"
                ]
              }
            ]
          },
          {
            "sub": "2-4 ชั้นถัดออกไป",
            "body": [
              {
                "bullets": [
                  "**T. submucosa: submucosal plexus**",
                  "**T. muscularis: myenteric plexus**",
                  "T. serosa หรือ T. adventitia"
                ]
              }
            ]
          },
          {
            "text": "หน้า 4 และ 5 เป็นภาพ illustration และภาพ x-section ของ gastrointestinal tract ล้วน ไม่มีข้อความอธิบายบนสไลด์"
          }
        ]
      },
      {
        "heading": "Lips",
        "source": "Digestive System I p.6-7",
        "body": [
          {
            "text": "**Lips คือรอยต่อ (junction) ระหว่าง integument กับ digestive system** ด้านนอกคลุมด้วย skin ด้านในคลุมด้วย mucous membrane"
          },
          {
            "bullets": [
              "Epithelium: stratified squamous epithelium",
              "**Keratin: พบใน ruminants และ horse**",
              "Propria-submucosa: labial glands",
              "T. muscularis: striated muscles (Orbicularis oris)"
            ]
          },
          {
            "text": "ภาพ lower lip ของสุนัข (p.7) ชี้ให้ดู keratinized stratified squamous epi. ที่รอยต่อ โดยฝั่งซ้ายเป็น mucous membrane ฝั่งขวาเป็น skin พร้อม sebaceous glands และ hair follicles ด้านผิวหนัง"
          }
        ]
      },
      {
        "heading": "Cheeks",
        "source": "Digestive System I p.8-10",
        "body": [
          {
            "text": "โครงสร้างสามชั้นจากนอกเข้าใน: **skin (outer) → muscle (middle) → mucous membrane (inner)**"
          },
          {
            "bullets": [
              "Buccal mucosa: stratified squamous epithelium",
              "**conical papillae พบใน ruminants**",
              "T. submucosa และ T. muscularis: buccal glands"
            ]
          },
          {
            "text": "ภาพเปรียบเทียบบนสไลด์: cheek ของสุนัข (p.9) ชี้ stratified squamous epithelium กับ striated muscles ส่วน cheek ของแกะ (p.10) ชี้ conical papillae ที่เป็น keratinized stratified squamous epithelium พร้อม duct"
          }
        ]
      },
      {
        "heading": "Hard palate",
        "source": "Digestive System I p.11-15",
        "body": [
          {
            "text": "เป็น roof ของ oral cavity ส่วน rostral"
          },
          {
            "bullets": [
              "Keratinized stratified squamous epithelium",
              "**stratum corneum ของส่วน rostral หนามากใน ruminants เรียกว่า dental pad**",
              "Lamina propria มี papillae ยื่นเข้าไปใน epithelium",
              "Propria-submucosa: dense networks ของ collagen และ reticular fibers ที่ blend เข้ากับ periosteum, มี capillaries และ large veins"
            ]
          },
          {
            "text": "**ส่วน caudal ของ hard palate มี palatine glands** โดยสไลด์วงเล็บกำกับไว้สั้น ๆ ว่า \"pig (no)\" ซึ่งสไลด์ไม่ได้ขยายความต่อว่าเพราะอะไร"
          },
          {
            "text": "ภาพประกอบ: dental pad ของ ox (p.13) ชี้ stratum corneum, stratified squamous epithelium, lamina propria; hard palate caudal ของสุนัข (p.14) ชี้ palatine gland กับ palatine bone; hard palate ของหมู (p.15) ชี้ keratinized stratified squamous epithelium, papilla of connective tissue และ loose connective tissue"
          }
        ]
      },
      {
        "heading": "Soft palate",
        "source": "Digestive System I p.16-18",
        "body": [
          {
            "text": "**Soft palate คือ mucous membrane ของ oral cavity กับ nasal cavity ประกบกัน โดยมีแกนกลางเป็น striated muscle fibers**"
          },
          {
            "bullets": [
              "**Oral surface: stratified squamous epithelium**",
              "**Nasal mucosa: pseudostratified columnar epithelium**",
              "สิ่งที่ยึด mucous membrane สองแผ่นเข้าด้วยกัน: diffuse และ nodular lymphatic tissues, striated muscle fibers และ CNT.",
              "Propria-submucosa: palatine glands"
            ]
          },
          {
            "text": "ภาพ soft palate ของวัว (p.18) ชี้ keratinized stratified squamous epithelium, lamina propria, adipose tissue และ mucous gland"
          }
        ]
      },
      {
        "heading": "Tongue ภาพรวม",
        "source": "Digestive System I p.19, p.23-24",
        "body": [
          {
            "text": "หน้าที่ที่สไลด์ระบุ: **prehension, mastication และ swallowing of food**"
          },
          {
            "sub": "Tunica mucosa",
            "body": [
              {
                "bullets": [
                  "**Dorsal surface: keratinized stratified squamous epithelium** มี macroscopic papillae จำนวนมาก หน้าที่ mechanical และ gustatory",
                  "**Ventral surface: nonkeratinized stratified squamous epithelium** มี capillaries และ arteriovenous anastomoses จำนวนมาก หน้าที่ elimination of heat"
                ]
              }
            ]
          },
          {
            "sub": "Tunica muscularis",
            "body": [
              {
                "bullets": [
                  "striated muscles วางตัวสามทิศ: longitudinal, transverse, vertical (ภาพตัดตามยาวของแมว p.39 ชี้ทั้งสามชุด)",
                  "Tunica submucosa และ muscularis: lingual glands"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Lingual papillae ทั้ง 6 ชนิด",
        "source": "Digestive System I p.20-22",
        "body": [
          {
            "bullets": [
              "1. Filiform papillae",
              "2. Conical papillae",
              "3. **Lenticular papillae: มีใน ruminant**",
              "4. Fungiform papillae",
              "5. Vallate papillae",
              "6. **Foliate papillae: ไม่มีใน ruminant**"
            ]
          },
          {
            "text": "ภาพลิ้นสุนัข (p.21) ชี้เฉพาะ filiform กับ fungiform papillae ส่วนภาพลิ้นวัว (p.22) ชี้ torus linguae, lingual fossa และ papilla ครบทั้ง vallate, conical, lenticular, fungiform, filiform"
          },
          {
            "callout": "สไลด์ลิสต์ conical papillae ไว้ในหกชนิดและชี้ในภาพลิ้นวัว แต่ไม่มีสไลด์ที่บรรยายรายละเอียด conical papillae แยกออกมาเหมือนชนิดอื่น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Filiform papillae",
        "source": "Digestive System I p.25-28",
        "body": [
          {
            "bullets": [
              "**เป็นชนิดที่มีจำนวนมากที่สุด (the most numerous type)**",
              "Keratinized stratified squamous epithelium ที่มี stratum corneum หนา",
              "**Horse: thin cornified threads ยื่นพ้นผิวขึ้นมา**",
              "**Dog: two papillae**",
              "**Cat: a large papilla with two papillae**"
            ]
          },
          {
            "text": "ภาพ filiform ของแมว (p.28) ชี้ชื่อเรียกย่อยเป็น rostral papilla, caudal papilla และ spine บน striated muscles"
          }
        ]
      },
      {
        "heading": "Fungiform papillae",
        "source": "Digestive System I p.29-30",
        "body": [
          {
            "bullets": [
              "กระจายแทรกอยู่ท่ามกลาง filiform papillae",
              "**Nonkeratinized stratified squamous epithelium** (ต่างจาก filiform ที่เป็น keratinized)",
              "**มี taste buds**"
            ]
          },
          {
            "text": "ภาพลิ้นแพะ (p.30) ให้เทียบ filiform กับ fungiform ในภาพเดียวกัน พร้อม papilla of connective tissues และ striated muscles"
          }
        ]
      },
      {
        "heading": "Vallate papillae",
        "source": "Digestive System I p.31-33",
        "body": [
          {
            "bullets": [
              "ตำแหน่ง: dorsal และ rostral ต่อ root of tongue",
              "Stratified squamous epithelium",
              "**เป็นโครงสร้างขนาดใหญ่ แบน ล้อมรอบด้วย furrow ที่บุด้วย epithelium**",
              "**Taste buds อยู่บนฝั่ง papillary side ของ furrow**",
              "**Duct ของ serous gland (Ebner's gland) เปิดเข้าสู่ furrow**"
            ]
          },
          {
            "text": "ภาพ vallate ของแพะ (p.33) ชี้ core of CNT., papilla of CNT., duct, lingual gland, stratified squamous และ taste buds"
          }
        ]
      },
      {
        "heading": "Foliate papillae",
        "source": "Digestive System I p.34-35",
        "body": [
          {
            "bullets": [
              "**ไม่พบใน ruminants**",
              "เป็น parallel fold ของ lingual mucosa",
              "Stratified squamous epithelium",
              "**Taste buds อยู่ใน epithelium ด้านข้างของ fold**",
              "**Duct ของ serous gland (Gustatory gland) เปิดเข้าสู่ furrow**"
            ]
          },
          {
            "callout": "จุดที่สอบชอบถาม: vallate ผูกกับ **Ebner's gland** ส่วน foliate สไลด์เรียกต่อมที่เปิดเข้า furrow ว่า **Gustatory gland**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Taste buds",
        "source": "Digestive System I p.36, p.38",
        "body": [
          {
            "text": "**Taste buds อยู่ใน stratified squamous epithelium ของ fungiform, vallate และ foliate papillae** (สไลด์ไม่ระบุ filiform)"
          },
          {
            "text": "มีลักษณะเป็น ellipsoid clusters ประกอบด้วยเซลล์ 3 ชนิด"
          },
          {
            "bullets": [
              "1. **Sensory หรือ neuroepithelial taste cells** มี taste pore และ taste hairs (microvilli)",
              "2. Supporting หรือ sustentacular cells",
              "3. Basal cells"
            ]
          },
          {
            "text": "ภาพ taste bud จาก fungiform papilla ของม้า (p.38) ชี้ nucleus ของ sensory cell กับ supporting cell, taste pore และ stratum spinosum"
          },
          {
            "callout": "หน้า 37 เป็นสไลด์ว่าง ไม่มีข้อความใด ๆ ในไฟล์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lyssa โครงสร้างพิเศษของลิ้น",
        "source": "Digestive System I p.40-41",
        "body": [
          {
            "text": "สไลด์จัด Lyssa ไว้ในหัวข้อ special structures of the tongue โดยระบุว่า **Dog: อยู่ที่ ventral surface ของลิ้น**"
          },
          {
            "bullets": [
              "1. Collagen sheath",
              "2. Striated muscle",
              "3. Adipose tissue",
              "4. Blood vessels และ nerves"
            ]
          },
          {
            "text": "สไลด์ไม่ได้บอกหน้าที่ของ lyssa และไม่ได้บอกว่าสัตว์ชนิดอื่นมีหรือไม่"
          }
        ]
      },
      {
        "heading": "Types of teeth: Brachydont",
        "source": "Digestive System I p.42-43",
        "body": [
          {
            "text": "**Brachydont แยกองค์ประกอบตามส่วนของฟัน**"
          },
          {
            "bullets": [
              "Crown: dentin และ enamel",
              "Neck: dentin, enamel และ cementum",
              "Root: dentin และ cementum"
            ]
          },
          {
            "sub": "ตัวอย่างที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "primates และ carnivores",
                  "**canine และ P1 ของม้า**",
                  "**incisor ของ ruminant**",
                  "**ฟันของหมูทุกซี่ ยกเว้น boar tusks**"
                ]
              }
            ]
          },
          {
            "text": "หน้า 43 เป็น diagram ของ incisor แบบ brachydont ล้วน ไม่มีข้อความกำกับ"
          }
        ]
      },
      {
        "heading": "Types of teeth: Hypsodont",
        "source": "Digestive System I p.44-45",
        "body": [
          {
            "text": "**Hypsodont: ทั้ง crown และ root ประกอบด้วย dentin, enamel และ cementum** (ไม่แยกองค์ประกอบตามส่วนแบบ brachydont)"
          },
          {
            "sub": "ตัวอย่างที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "**ม้า ยกเว้น canine และ P1**",
                  "**cheek teeth ของ ruminant**",
                  "**tusks (canine teeth) ของ boar**"
                ]
              }
            ]
          },
          {
            "callout": "สังเกตว่ารายการของสองชนิดเป็นคู่สลับกันพอดี: ม้าที่ไม่ใช่ canine/P1 กับ cheek teeth ของ ruminant และ tusk ของ boar เป็น hypsodont ส่วนซี่ที่เหลือของสัตว์กลุ่มเดียวกันไปอยู่ฝั่ง brachydont",
            "kind": "tip"
          },
          {
            "text": "หน้า 45 เป็น diagram ของ molar แบบ hypsodont ล้วน ไม่มีข้อความกำกับ"
          }
        ]
      },
      {
        "heading": "Development of a tooth: enamel organ",
        "source": "Digestive System I p.46, p.48",
        "body": [
          {
            "text": "**Oral epithelium (ectoderm) invaginate เข้าไปใน mesenchyme (mesoderm) กลายเป็น dental lamina**"
          },
          {
            "sub": "Enamel organ ประกอบด้วย 4 ชั้น",
            "body": [
              {
                "bullets": [
                  "1. Outer enamel epithelium",
                  "2. Stellate reticulum",
                  "3. Stratum intermedium",
                  "4. Inner enamel epithelium"
                ]
              }
            ]
          },
          {
            "text": "ภาพ developing teeth (p.48) ชี้ dental lamina, outer/inner enamel epithelium, stellate reticulum และ dental papilla"
          }
        ]
      },
      {
        "heading": "Development of a tooth: เซลล์ไหนสร้างอะไร",
        "source": "Digestive System I p.49-51",
        "body": [
          {
            "text": "สไลด์ p.51 สรุปเป็นสายการเปลี่ยนแปลง ต้นทาง → เซลล์ → ผลผลิต"
          },
          {
            "bullets": [
              "**Inner enamel epithelium → ameloblasts → enamel**",
              "**Mesenchymal cells ที่ถูกล้อมโดย enamel organ → odontoblasts → pre-dentin**",
              "**Dental papilla → dental pulp (pulp cavity)**",
              "**Dental sac (ชั้น connective หนา) → cementocytes → cementum**"
            ]
          },
          {
            "text": "ภาพ p.49 และ p.50 ชี้โครงสร้างในระยะกำลังสร้างฟัน ได้แก่ alveolar bone, dental sac, outer enamel epithelium, stellate reticulum, stratum intermedium, ameloblasts, enamel, odontoblasts, pre-dentin, dentin, dental papilla"
          }
        ]
      },
      {
        "heading": "Salivary glands: การแบ่ง major กับ minor",
        "source": "Digestive System I p.52-53",
        "body": [
          {
            "sub": "1. Major salivary glands",
            "body": [
              {
                "bullets": [
                  "**parotid, mandibular และ sublingual glands**",
                  "buccal gland",
                  "**zygomatic gland ของสุนัข**",
                  "**molar gland ของแมว**"
                ]
              }
            ]
          },
          {
            "sub": "2. Minor salivary glands (อยู่ใน submucosa ของ oral cavity)",
            "body": [
              {
                "bullets": [
                  "labial, buccal, palatine และ lingual glands"
                ]
              }
            ]
          },
          {
            "callout": "buccal gland ปรากฏอยู่ทั้งในลิสต์ major และ minor บนสไลด์เดียวกัน สไลด์ไม่ได้อธิบายว่าแยกกันอย่างไร",
            "kind": "flag"
          },
          {
            "text": "แผนผังหน้า 53 ใช้สีแยกต่อม (ส้ม = parotid, ขาว = mandibular, เหลือง = sublingual, แดง = buccal) และชี้ท่อ ได้แก่ parotid duct, mandibular duct, monostomatic กับ polystomatic sublingual gland, zygomatic gland ในสุนัข, dorsal/middle/ventral buccal gland"
          }
        ]
      },
      {
        "heading": "Parotid salivary gland",
        "source": "Digestive System I p.55-58",
        "body": [
          {
            "bullets": [
              "ต่อมแบ่งเป็น lobular units คั่นด้วย connective tissue septa",
              "**Lobule ประกอบด้วย serous acini ที่เกิดจากเซลล์รูป pyramid นิวเคลียสอยู่กลางเซลล์**",
              "**Apex ของแต่ละเซลล์เต็มไปด้วย zymogen granules ซึ่งคือ enzyme**",
              "**Myoepithelial cells (basket cells) รูปดาว อยู่ระหว่าง secretory cells กับ basement membrane**"
            ]
          },
          {
            "sub": "ลำดับท่อและ epithelium ของแต่ละช่วง",
            "body": [
              {
                "bullets": [
                  "Serous acinus",
                  "**Intercalated duct: cuboidal epithelium**",
                  "**Striated duct: columnar epithelium มี mitochondria อยู่ใน basal infolding**",
                  "**Interlobular duct ใน CNT.: stratified columnar epithelium**",
                  "**Main parotid duct: stratified squamous epithelium**"
                ]
              }
            ]
          },
          {
            "text": "ภาพ parotid ของม้า (p.59-60) ชี้ interlobular CNT., interlobular ducts, lobule, intralobular duct แล้วซูมเข้าไปที่ serous acinus, intercalated duct และ striated duct ส่วนภาพของสุนัข (p.61) ชี้ serous acinus, striated duct และ interlobular connective tissue"
          }
        ]
      },
      {
        "heading": "Mandibular และ Sublingual salivary gland",
        "source": "Digestive System I p.62-63",
        "body": [
          {
            "bullets": [
              "**Mucous acini พร้อม serous demilunes** (จุดที่ต่างจาก parotid ซึ่งเป็น serous acini ล้วน)",
              "Intercalated duct: cuboidal epithelium",
              "Striated duct: columnar epithelium",
              "Interlobular duct ใน CNT.: stratified columnar epithelium",
              "Main duct: stratified squamous epithelium"
            ]
          },
          {
            "text": "ภาพ mandibular gland ของสุนัข (p.64) ชี้ mucous acinus, serous demilune, serous acinus, striated duct และของแกะ (p.65) ชี้ mucous acinus, serous demilune, intercalated duct, striated duct"
          }
        ]
      },
      {
        "heading": "Zygomatic และ Molar salivary gland",
        "source": "Digestive System I p.66",
        "body": [
          {
            "bullets": [
              "**Zygomatic salivary gland: carnivores**",
              "**Molar salivary gland: cat**",
              "**เป็น mucous acini แทบทั้งหมด มี serous demilunes บ้าง**",
              "**ไม่มี intercalated และ striated ducts**",
              "Interlobular duct และ main duct เหมือนต่อมน้ำลายอื่น"
            ]
          },
          {
            "callout": "การไม่มี intercalated และ striated duct คือจุดแยกที่ชัดที่สุดของสองต่อมนี้จาก parotid/mandibular/sublingual",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Pharynx",
        "source": "Digestive System I p.67-68",
        "body": [
          {
            "bullets": [
              "**Epithelium: stratified squamous epithelium**",
              "**Propria-submucosa: fibroelastic tissue, lymphatic tissue และ mucous glands**",
              "**Tunica muscularis: striated muscles**",
              "**Tunica adventitia: fibroelastic layer** (ไม่ใช่ serosa)"
            ]
          },
          {
            "text": "ภาพ oropharynx ของสุนัข (p.68) ชี้ stratified squamous epithelium, duct, mucous glands และ striated muscle ซึ่งเป็นสไลด์สุดท้ายของเด็คนี้"
          }
        ]
      }
    ]
  },
  "histo--digestive-system-iii": {
    "topic": "histo--digestive-system-iii",
    "title": "Digestive System III: กระเพาะสัตว์เคี้ยวเอื้อง ตับ ถุงน้ำดี และตับอ่อน",
    "icon": "📖",
    "lecturer": "Kriengyot Sajjacharoenpong",
    "summary": "สไลด์ชุดนี้มี 57 หน้า แต่มีข้อความจริงประมาณ 26 หน้า ที่เหลือเป็นภาพ histology ล้วน ไม่มีตัวอักษรใด ๆ เนื้อหาที่มีข้อความแบ่งเป็น 2 ก้อน คือ (1) กระเพาะสัตว์เคี้ยวเอื้อง 4 ส่วน (rumen, reticulum, omasum, abomasum) ไล่ทีละชั้นตั้งแต่ epithelium จนถึง tunica serosa แล้วปิดด้วยตารางเปรียบเทียบ และ (2) อวัยวะช่วยย่อย ได้แก่ liver, gallbladder และ pancreas สไลด์เขียนแบบ list สั้น ๆ เป็นส่วนใหญ่ ไม่ได้อธิบายกลไกยาว ๆ สองหน้าสุดท้าย (p.56-57) เป็นรายการสไลด์แล็บพร้อมรหัส A พร้อมโครงสร้างที่ต้องหาให้เจอ ซึ่งใช้เป็น checklist ตอนขึ้นแล็บได้เลย",
    "sections": [
      {
        "heading": "ขอบเขตที่สไลด์ประกาศไว้เอง",
        "source": "Digestive System III p.1-2",
        "body": [
          {
            "text": "หน้าผลลัพธ์การเรียนรู้เขียนไว้ว่าให้นิสิตเข้าใจและอธิบายโครงสร้างทางจุลกายวิภาคและหน้าที่ของ 2 กลุ่มนี้"
          },
          {
            "bullets": [
              "**กระเพาะอาหารสัตว์เคี้ยวเอื้อง**",
              "**อวัยวะที่ช่วยในการย่อยอาหาร ได้แก่ ตับ ถุงน้ำดี และตับอ่อน**"
            ]
          }
        ]
      },
      {
        "heading": "Stomach of ruminant แบ่งตามการมีต่อม",
        "source": "Digestive System III p.3",
        "body": [
          {
            "bullets": [
              "**Forestomach = rumen, reticulum และ omasum จัดเป็น nonglandular**",
              "**Glandular = abomasum**"
            ]
          },
          {
            "text": "สไลด์ให้แค่การจัดกลุ่มนี้ ไม่ได้อธิบายเหตุผลเชิงหน้าที่ในหน้าเดียวกัน"
          }
        ]
      },
      {
        "heading": "Rumen",
        "source": "Digestive System III p.5-10",
        "body": [
          {
            "sub": "Epithelium และหน้าที่",
            "body": [
              {
                "text": "Rumen บุด้วย **keratinized stratified squamous epi.** หน้าที่ที่สไลด์ระบุมี 3 อย่าง คือ protection, metabolism และ absorption"
              },
              {
                "bullets": [
                  "**upper layer : protective shield**",
                  "**deeper layer : metabolite volatile fatty acid (butyric, acetic และ propionic acid)**",
                  "**deeper layer : absorption (Na, K, NH3 และ urea)**"
                ]
              }
            ]
          },
          {
            "sub": "Lamina propria และ tunica submucosa",
            "body": [
              {
                "text": "สไลด์เขียน **no muscularis mucosae** แล้วเขียน lamina propria กับ tunica submucosa รวมกันเป็นก้อนเดียว"
              },
              {
                "bullets": [
                  "loose CNT",
                  "blood vessels",
                  "submucosal plexus (**Meissner's plexus**)"
                ]
              }
            ]
          },
          {
            "sub": "Tunica muscularis",
            "body": [
              {
                "text": "เป็น smooth muscle เรียง **inner circular และ outer longitudinal** มี **Auerbach's plexus**"
              }
            ]
          },
          {
            "sub": "Tunica serosa",
            "body": [
              {
                "bullets": [
                  "loose CNT",
                  "fat",
                  "blood vessels",
                  "lymph vessels",
                  "nerves",
                  "mesothelium"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.8 เขียนตรง ๆ ว่า **no muscularis mucosae** ส่วนในตาราง p.29 แถวที่ต่างกันระหว่าง forestomach ทั้งสามมี 2 แถว ไม่ใช่แถวเดียว คือแถว **m.m** ที่ rumen เป็นลบ ส่วน reticulum และ omasum เป็นบวก และแถว **special** ที่เขียน ruminal papilla ให้ rumen, reticular fold กับ conical papilla ให้ reticulum, omasal lamina กับ horny papilla ให้ omasum สไลด์ไม่ได้บอกว่า m.m เป็นข้อเดียวที่แยก rumen ออกจากอีกสองส่วน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Reticulum",
        "source": "Digestive System III p.14, 16-17",
        "body": [
          {
            "text": "Mucosa ของ reticulum เป็น **permanent folds** สไลด์แยกเป็น **primary reticular folds** และ **secondary reticular folds** และมี **conical papillae**"
          },
          {
            "sub": "ชั้นต่าง ๆ",
            "body": [
              {
                "bullets": [
                  "keratinized stratified squamous epi.",
                  "laminar propria (CNT)",
                  "**laminar muscularis อยู่ที่ upper part of reticular fold**",
                  "T. submucosa"
                ]
              }
            ]
          },
          {
            "text": "Tunica muscularis เป็น smooth muscle และ **Tunica serosa เหมือน rumen** สไลด์ไม่ได้ลงรายละเอียดการเรียงชั้นกล้ามเนื้อของ reticulum"
          }
        ]
      },
      {
        "heading": "Omasum",
        "source": "Digestive System III p.20-21",
        "body": [
          {
            "text": "Omasum มี **longitudinal laminae ประมาณ 100 อัน**"
          },
          {
            "sub": "ชั้นของ lamina",
            "body": [
              {
                "bullets": [
                  "keratinized stratified squamous epi.",
                  "lamina propria (CNT)",
                  "**lamina muscularis หนา และอยู่ทั้งสองด้านของ lamina**",
                  "tunica submucosa (CNT)",
                  "**horny papilla**"
                ]
              }
            ]
          },
          {
            "sub": "Tunica muscularis และ serosa",
            "body": [
              {
                "bullets": [
                  "outer: thin longitudinal layer",
                  "**inner: thicker circular layer**",
                  "**intermediate sheet**",
                  "Tunica serosa (CNT)"
                ]
              }
            ]
          },
          {
            "callout": "omasum เป็นส่วนเดียวในสไลด์ชุดนี้ที่บอกความหนาเทียบกันของ 2 ชั้นกล้ามเนื้อ และเป็นส่วนเดียวที่มี **intermediate sheet** ส่วน rumen สไลด์บอกแค่ลำดับ inner circular กับ outer longitudinal เฉย ๆ ไม่ได้บอกความหนา",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Abomasum",
        "source": "Digestive System III p.25",
        "body": [
          {
            "text": "สไลด์เขียนว่า abomasum **like simple stomach** แล้วแบ่งเป็น 3 region"
          },
          {
            "bullets": [
              "cardiac gland region",
              "**fundic gland region 2/3**",
              "**pyloric gland region 1/3**"
            ]
          },
          {
            "text": "บนหน้าเดียวกันมีคำกำกับภาพว่า cardia (rumen) แต่สไลด์ไม่ได้อธิบายเพิ่มว่าหมายถึงอะไร"
          },
          {
            "callout": "สัดส่วน 2/3 ต่อ 1/3 ของ fundic ต่อ pyloric gland region เป็นตัวเลขเดียวที่สไลด์ให้ในหัวข้อ abomasum จำไว้ให้แม่น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตารางเปรียบเทียบกระเพาะทั้ง 4 ส่วน",
        "source": "Digestive System III p.29",
        "body": [
          {
            "text": "หน้านี้เป็นตารางสรุปเทียบ rumen, reticulum, omasum และ abomasum ตามชั้นต่าง ๆ"
          },
          {
            "bullets": [
              "**epi ของ rumen, reticulum, omasum = keratinized stratified squamous epi. ส่วน abomasum = sim. col. ที่มี gastric pit และ chief and parietal cells**",
              "l.p มีครบทั้ง 3 forestomach",
              "**m.m : rumen เป็นลบ ส่วน reticulum และ omasum เป็นบวก**",
              "t.sub และ t.mus มีครบ",
              "special : rumen = ruminal papilla, reticulum = reticular fold และ conical papilla, omasum = omasal lamina และ horny papilla"
            ]
          },
          {
            "callout": "ตารางในไฟล์สไลด์แถวที่เป็นเครื่องหมายบวกลบอ่านการจับคู่คอลัมน์ของ abomasum ได้ไม่ชัด จึงไม่สรุปว่า abomasum มีหรือไม่มีชั้นไหนจากตารางนี้ ให้ยึดจากหน้า p.25 ที่บอกว่า abomasum เหมือน simple stomach แทน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Liver: หน้าที่ที่สไลด์ list ไว้",
        "source": "Digestive System III p.30-31",
        "body": [
          {
            "bullets": [
              "excretion (waste products)",
              "**secretion (bile)**",
              "storage (lipids, vit. A and B, glycogen)",
              "**synthesis (fibrinogen, globulin, albumin, prothrombin)**",
              "phagocytosis",
              "**detoxification (lipid soluble drugs)**",
              "conjugation (toxic sub., steroid, hormones)",
              "esterification",
              "metabolism (protien, CBH, fats, Hb, drugs)",
              "hemopoiesis"
            ]
          },
          {
            "text": "สไลด์เขียนเป็นรายการล้วน ไม่ได้อธิบายกลไกของแต่ละหน้าที่"
          }
        ]
      },
      {
        "heading": "Liver: เปลือกหุ้ม และ dual blood supply",
        "source": "Digestive System III p.32, 34",
        "body": [
          {
            "bullets": [
              "visceral peritoneum (mesothelium)",
              "capsule (thin CNT)",
              "interlobular septa"
            ]
          },
          {
            "text": "**Liver has a dual blood supply คือ 1. portal vein และ 2. hepatic artery**"
          },
          {
            "sub": "ลำดับทางเดินเลือดตามสไลด์",
            "body": [
              {
                "text": "portal v. และ hepatic a. → interlobar vessels → interlobular vessels → **sinusoid (mixed)** → central v. → hepatic v. และ caudal vena cava"
              }
            ]
          }
        ]
      },
      {
        "heading": "Liver lobule concepts",
        "source": "Digestive System III p.35",
        "body": [
          {
            "bullets": [
              "**Hepatic lobule หรือ classical lobule : distinctly observed only in pig**",
              "Portal lobule",
              "Liver acinus"
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อของ Portal lobule และ Liver acinus ไม่ได้บอกว่าแต่ละ concept ลากขอบเขตอย่างไรหรือใช้ทำอะไร ตรงนี้สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Portal canals หรือ portal areas",
        "source": "Digestive System III p.39",
        "body": [
          {
            "bullets": [
              "CNT",
              "lymph vessels",
              "branches of hepatic a.",
              "branches of portal v.",
              "**bile ductule (simple cuboidal epi.)**"
            ]
          }
        ]
      },
      {
        "heading": "Hepatocyte, bile canaliculi และ sinusoid",
        "source": "Digestive System III p.41-42",
        "body": [
          {
            "text": "**Hepatocyte absorb bilirubin from blood, conjugate it and secret it as one component of bile**"
          },
          {
            "sub": "Bile canaliculi",
            "body": [
              {
                "bullets": [
                  "**อยู่ระหว่าง apposing hepatocyte**",
                  "short microvilli"
                ]
              }
            ]
          },
          {
            "sub": "Sinusoid",
            "body": [
              {
                "bullets": [
                  "endothelial cell",
                  "**Kupffer cell**",
                  "**perisinusoidal space อยู่ระหว่าง sinusoid กับ hepatocyte**",
                  "lymph vessels within the portal area"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ทางเดินน้ำดีตามลำดับ",
        "source": "Digestive System III p.45",
        "body": [
          {
            "text": "**bile canaliculi → bile ductule → interlobular duct → interlobar duct → hepatic duct → cystic duct → gallbladder**"
          },
          {
            "callout": "ลำดับนี้เป็นสิ่งที่ท่องได้ตรง ๆ จากสไลด์ และคู่กันกับลำดับทางเดินเลือดใน p.34 ให้จำเป็นคู่",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Gallbladder",
        "source": "Digestive System III p.46-47",
        "body": [
          {
            "sub": "หน้าที่และเยื่อบุ",
            "body": [
              {
                "bullets": [
                  "**store bile**",
                  "**reabsorption of water and inorganic salts**",
                  "**sim. col. epi. with microvilli**",
                  "**goblet cells พบใน cattle**"
                ]
              }
            ]
          },
          {
            "sub": "ชั้นอื่น ๆ และความต่างระหว่างสปีชีส์",
            "body": [
              {
                "bullets": [
                  "lamina propria-submucosa (loose CNT)",
                  "Tunica muscularis (smooth muscle) แบบ circular และ longitudinal",
                  "**thickest ใน bovine และ thinnest ใน carnivore**",
                  "**no gallbladder ใน horse, elephant และ rat**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่าสัตว์ที่ไม่มีถุงน้ำดีจัดการน้ำดีอย่างไร ให้จำแค่รายชื่อ horse, elephant, rat ตามที่สไลด์เขียน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Pancreas",
        "source": "Digestive System III p.50-51, 53",
        "body": [
          {
            "sub": "ภาพรวมและหน้าที่",
            "body": [
              {
                "bullets": [
                  "**เป็นทั้ง exocrine และ endocrine**",
                  "capsule (CNT)",
                  "lobule",
                  "**compound tubuloacinar gland**",
                  "**Function: produce enzymes ได้แก่ amylase, lipase และ trypsin**"
                ]
              }
            ]
          },
          {
            "sub": "Lobule",
            "body": [
              {
                "bullets": [
                  "secretory units เป็นแบบ tubuloacinar",
                  "cytoplasm มี rER และ mitochondria",
                  "**zymogen granules อยู่ apical region**",
                  "intralobular ducts"
                ]
              }
            ]
          },
          {
            "sub": "ระบบท่อ",
            "body": [
              {
                "bullets": [
                  "**acinar lumen มี centroacinar cell**",
                  "intercalated duct (low cuboid)",
                  "interlobular duct (sim. col.)",
                  "collecting duct",
                  "**goblet cell พบใน larger ducts**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์พูดถึงส่วน exocrine อย่างเดียวตลอดหัวข้อ ระบุแค่คำว่า endocrine ไว้ในวงเล็บหน้าแรก แต่ไม่ได้อธิบาย islet หรือส่วน endocrine เลย ตรงนี้สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Checklist สไลด์แล็บที่ต้องดู",
        "source": "Digestive System III p.56-57",
        "body": [
          {
            "text": "สองหน้าสุดท้ายเป็นรายการสไลด์แล็บพร้อมรหัส A และโครงสร้างที่ต้องหาให้เจอในแต่ละแผ่น"
          },
          {
            "sub": "กระเพาะสัตว์เคี้ยวเอื้อง",
            "body": [
              {
                "bullets": [
                  "**Rumen A79** : ruminal papilla, เยื่อบุและชั้นต่าง ๆ",
                  "**Reticulum A80** : reticular fold, conical papilla, เยื่อบุและชั้นต่าง ๆ",
                  "**Omasum A81** : omasal lamina, horny papilla, เยื่อบุและชั้นต่าง ๆ",
                  "**Abomasum A82** : เยื่อบุและชั้นต่าง ๆ, chief and parietal cells"
                ]
              },
              {
                "text": "สไลด์กำกับไว้ท้ายหน้าว่า laminar muscularis คือ muscularis mucosae"
              }
            ]
          },
          {
            "sub": "ตับ ถุงน้ำดี และตับอ่อน",
            "body": [
              {
                "bullets": [
                  "**Liver A95, 96** : hepatocyte, sinusoid, Kupffer cell, central vein, portal area, bile ductule, br. of hepatic a. and portal v., lymph vessel",
                  "**Pancreas A13** : pancreatic cell, pancreatic acinus, centroacinar cell, intercalated duct, pancreatic juice, interlobular duct",
                  "**Gall bladder A95, 96** : เยื่อบุและชั้นต่าง ๆ"
                ]
              }
            ]
          },
          {
            "callout": "ใช้หน้านี้เป็น checklist ตอนขึ้นแล็บได้เลย เพราะเป็นรายการโครงสร้างที่ผู้สอนเขียนเองว่าต้องดูให้เจอในสไลด์แต่ละแผ่น",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "histo--endocrine": {
    "topic": "histo--endocrine",
    "title": "ระบบต่อมไร้ท่อ (Endocrine System)",
    "icon": "📖",
    "lecturer": "Sayamon Srisuwatanasagul",
    "summary": "เด็คนี้ไล่โครงสร้างจุลกายวิภาคของต่อมไร้ท่อทีละต่อม ตั้งแต่ hypophysis (adenohypophysis + neurohypophysis), pineal gland, thyroid, parathyroid, adrenal gland ไปจนถึง endocrine pancreas (Islets of Langerhans) และปิดท้ายด้วยนิยาม APUD cells กับ PAS reaction ทั้งเด็คมี 41 สไลด์ โดยมี 6 หน้าที่ไม่มีข้อความเลย (หน้า 7, 9, 10, 11, 33, 34) และอีกหลายหน้ามีแค่ชื่อหัวข้อกับรูป (หน้า 4 ENDOCRINE SYSTEM, หน้า 6 Development of hypophysis, หน้า 8 Hypophysis (pituitary gland), หน้า 19 Hypothalamic-pituitary gland axis, หน้า 21 Neurohypophysis, หน้า 24 Pineal gland กับคำว่า Brain sand, หน้า 29 Parathyroid, หน้า 36 Adrenal medulla) โน้ตนี้จึงสรุปได้เฉพาะจากสไลด์ที่มีตัวหนังสือจริง เนื้อหาที่มีส่วนใหญ่เป็นรายชื่อเซลล์ ชื่อชั้น และฮอร์โมนที่หลั่ง โดยไม่ได้ลงรายละเอียด mechanism และมีอย่างน้อย 2 จุดที่สไลด์ตั้งคำถามค้างไว้โดยไม่เฉลย",
    "sections": [
      {
        "heading": "นิยามของระบบต่อมไร้ท่อ",
        "source": "Endocrine p.2",
        "body": [
          {
            "text": "**ต่อมไร้ท่อไม่มี tubular system** (No tubular system)"
          },
          {
            "text": "การหลั่ง hormone เดินทางตามลำดับนี้"
          },
          {
            "bullets": [
              "หลั่งเข้าสู่ intercellular space",
              "เข้าสู่ perivascular space",
              "เข้าสู่ circulation"
            ]
          }
        ]
      },
      {
        "heading": "ต่อมไร้ท่อแท้ vs กลุ่มเซลล์ไร้ท่อในอวัยวะอื่น",
        "source": "Endocrine p.3",
        "body": [
          {
            "text": "สไลด์แยกออกเป็น 2 กลุ่มชัดเจน ให้จำแยกกัน"
          },
          {
            "sub": "Endocrine glands (ต่อมไร้ท่อแท้ 5 ต่อม)",
            "body": [
              {
                "bullets": [
                  "Hypophysis",
                  "Pineal gland",
                  "Thyroid gland",
                  "Parathyroid gland",
                  "Adrenal gland"
                ]
              }
            ]
          },
          {
            "sub": "Cell groups in non-endocrine glands (กลุ่มเซลล์ไร้ท่อที่แทรกอยู่ในอวัยวะที่ไม่ใช่ต่อมไร้ท่อ)",
            "body": [
              {
                "bullets": [
                  "Pancreatic islets",
                  "Theca & corpus luteum cells ใน ovary",
                  "Interstitial cells ใน testis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hypophysis (pituitary gland) กำเนิดจาก 2 แหล่ง",
        "source": "Endocrine p.5",
        "body": [
          {
            "text": "**สองส่วนของ hypophysis มี embryonic origin คนละที่กัน** ซึ่งเป็นเหตุผลที่ histology ของสองส่วนต่างกันสิ้นเชิง"
          },
          {
            "bullets": [
              "Adenohypophysis: dorsal invagination of roof of the embryonic pharynx",
              "Neurohypophysis: ventral outgrowth of diencephalon"
            ]
          },
          {
            "callout": "หน้า 6 ชื่อสไลด์ว่า Development of hypophysis หน้า 8 มีแค่ชื่อ Hypophysis (pituitary gland) ส่วนหน้า 7, 9, 10, 11 ไม่มีข้อความเลย เด็คจึงไม่มีข้อความอธิบายขั้นตอนการพัฒนาเพิ่มเติม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Adenohypophysis แบ่ง 3 ส่วน และเซลล์ใน Pars distalis",
        "source": "Endocrine p.12-13",
        "body": [
          {
            "text": "Adenohypophysis ประกอบด้วย **Pars distalis, Pars intermedia, Pars tuberalis**"
          },
          {
            "sub": "Pars distalis: Chromophobes",
            "body": [
              {
                "bullets": [
                  "Follicular cells",
                  "Stellate cells"
                ]
              }
            ]
          },
          {
            "sub": "Pars distalis: Chromophils",
            "body": [
              {
                "bullets": [
                  "**Acidophils: Eosinophilic granules**",
                  "**Basophils: PAS reaction**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ใช้แยก acidophil กับ basophil ในเด็คนี้คือการติดสี acidophil ติด eosinophilic granules ส่วน basophil ตรวจด้วย PAS reaction",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ชนิดย่อยของ Acidophils และ Basophils",
        "source": "Endocrine p.14-15",
        "body": [
          {
            "sub": "Acidophils",
            "body": [
              {
                "bullets": [
                  "Lactotrophs หรือ Prolactin cells",
                  "Somatotrophs"
                ]
              }
            ]
          },
          {
            "sub": "Basophils",
            "body": [
              {
                "bullets": [
                  "Thyrotrophs",
                  "Gonadotrophs",
                  "Corticotrophs"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อชนิดเซลล์ ไม่ได้ระบุว่าแต่ละชนิดหลั่งฮอร์โมนตัวไหนบ้าง (ยกเว้น Lactotrophs ที่เขียนกำกับว่า Prolactin cells)",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pars intermedia และ Pars tuberalis",
        "source": "Endocrine p.16-17",
        "body": [
          {
            "sub": "Pars intermedia",
            "body": [
              {
                "bullets": [
                  "**แยกจาก Pars distalis ด้วย hypophyseal cleft**",
                  "ประกอบด้วย ACTH cells, follicular cells, stellate cells",
                  "**Produce MSH**"
                ]
              }
            ]
          },
          {
            "sub": "Pars tuberalis",
            "body": [
              {
                "bullets": [
                  "ล้อมรอบ median eminence เหมือนปลอกแขน (like a sleeve)",
                  "มี gonadotrophs และ thyrotrophs อยู่บ้างเล็กน้อย",
                  "มี secretory cells ที่สไลด์ระบุว่า of unknown significant"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hypothalamic control ของ Adenohypophysis",
        "source": "Endocrine p.18",
        "body": [
          {
            "text": "เส้นทางควบคุมตามที่สไลด์เขียนเป็นลำดับ"
          },
          {
            "bullets": [
              "Neuron in hypothalamus",
              "Axons",
              "Median eminence",
              "**Hypophyseal portal system**",
              "Adenohypophysis"
            ]
          },
          {
            "callout": "หน้า 19 ชื่อว่า Hypothalamic-pituitary gland axis แต่เป็นรูปล้วน ไม่มีข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Releasing hormones, inhibiting hormones และ releasing factors",
        "source": "Endocrine p.20",
        "body": [
          {
            "text": "สไลด์ให้ตัวย่อพร้อมชื่อเต็มไว้ทั้งหมด 8 ตัว"
          },
          {
            "bullets": [
              "SRH = Somatotropin releasing hormone",
              "Somatostatin",
              "PRF = Prolactin releasing factor",
              "PIF = Prolactin inhibiting factor",
              "TRH = Thyrotropin releasing hormone",
              "GnRH = Gonadotropin releasing hormone",
              "CRH = Corticotropin releasing hormone",
              "MIF = Melanocyte inhibiting factor"
            ]
          }
        ]
      },
      {
        "heading": "Neurohypophysis",
        "source": "Endocrine p.22",
        "body": [
          {
            "bullets": [
              "เป็นส่วนหนึ่งของ **Hypothalamoneurohypophyseal system**",
              "**SO & PV nuclei** ใน hypothalamus",
              "**Herring bodies**",
              "**Neurosecretory granules: Oxytocin, ADH**",
              "**Pituicytes**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่า oxytocin กับ ADH ตัวไหนสร้างจาก nucleus ไหน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pineal gland",
        "source": "Endocrine p.23-24",
        "body": [
          {
            "bullets": [
              "ยึดกับ diencephalon ด้วย stalk",
              "เซลล์ที่พบ: **Pinealocytes** และ **astrocytes**",
              "**Brain sand = intercellular calcium deposits** (สไลด์หน้า 24 ชี้ให้ดู brain sand ในภาพ)",
              "หลั่ง **methoxyindoles (melatonin)**"
            ]
          }
        ]
      },
      {
        "heading": "Thyroid gland",
        "source": "Endocrine p.25",
        "body": [
          {
            "bullets": [
              "มี **CNT capsule** หุ้ม",
              "หน่วยพื้นฐานคือ **thyroid follicles** ซึ่งบุด้วย follicular cells",
              "มี **Parafollicular cells (C-cell)** แทรกอยู่",
              "**Follicular cells หลั่ง Thyroxine (T4) และ Triiodothyronine (T3)**",
              "**C-cells หลั่ง Calcitonin**"
            ]
          }
        ]
      },
      {
        "heading": "Thyroid follicle: active vs inactive",
        "source": "Endocrine p.26-27",
        "body": [
          {
            "sub": "Active follicle (p.26)",
            "body": [
              {
                "bullets": [
                  "**Simple cuboidal** epithelium",
                  "เห็น **vacuole** ใน colloid"
                ]
              }
            ]
          },
          {
            "sub": "Inactive follicle (p.27)",
            "body": [
              {
                "bullets": [
                  "**Simple squamous ถึง low cuboidal**",
                  "**Homogeneous colloid** (ไม่เห็น vacuole)"
                ]
              }
            ]
          },
          {
            "callout": "ข้อความบนสไลด์หน้า 27 ถูกพิมพ์ทับกับ placeholder ของ template จนตัวอักษรสลับกันอ่านยาก คำที่แกะได้ชัดคือ simple squamous, low cuboidal และ homogeneous colloid ถ้าจะอ้างคำต่อคำในการสอบควรกลับไปดูสไลด์จริงอีกครั้ง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Parathyroid gland",
        "source": "Endocrine p.28",
        "body": [
          {
            "bullets": [
              "**Chief cells** แบ่งเป็น light cells และ dark cells",
              "**PTH: control calcium level**",
              "**Oxyphil cells**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกหน้าที่ของ oxyphil cells",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การตอบสนองของ C cells และ chief cells ต่อระดับแคลเซียม",
        "source": "Endocrine p.30",
        "body": [
          {
            "text": "หน้านี้เป็นคำบรรยายใต้ภาพเปรียบเทียบ **Parathormone from parathyroid** กับ **Calcitonin from thyroid**"
          },
          {
            "sub": "ภาวะ hypocalcemia",
            "body": [
              {
                "bullets": [
                  "**C cells สะสม secretory granules**",
                  "**Chief cells แทบ degranulate หมด** แต่มี synthetic และ secretory organelles พัฒนาเพิ่มขึ้น"
                ]
              }
            ]
          },
          {
            "sub": "ภาวะ hypercalcemia",
            "body": [
              {
                "bullets": [
                  "**C cells degranulated**",
                  "**Parathyroid chief cells อยู่ใน inactive stage ของ secretory cycle เป็นส่วนใหญ่**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Adrenal gland และ Adrenal cortex 3 ชั้น",
        "source": "Endocrine p.31-32",
        "body": [
          {
            "text": "Adrenal gland มี **CNT capsule** หุ้ม ภายในแบ่งเป็น **Cortex** และ **Medulla**"
          },
          {
            "sub": "Zona glomerulosa",
            "body": [
              {
                "bullets": [
                  "เรียก **Z. arcuata** ใน carnivore, horse, pig",
                  "หลั่ง **mineralocorticoid (aldosterone)**"
                ]
              }
            ]
          },
          {
            "sub": "Zona fasciculata",
            "body": [
              {
                "bullets": [
                  "เซลล์ชื่อ **Spongiocyte**",
                  "หลั่ง **glucocorticoids (cortisol)**"
                ]
              }
            ]
          },
          {
            "sub": "Zona reticularis",
            "body": [
              {
                "bullets": [
                  "สไลด์เขียนว่าหลั่ง **glucocorticoids** (คำภาษาไทยบนสไลด์พิมพ์ตกจนอ่านได้ไม่ครบ แต่ตามด้วยคำว่า glucocorticoids)"
                ]
              }
            ]
          },
          {
            "sub": "การทำงานของ aldosterone ตามคำบรรยายใต้ภาพหน้า 32",
            "body": [
              {
                "bullets": [
                  "ออกฤทธิ์ที่ **distal portions of the nephron**",
                  "**เพิ่ม tubular excretion ของ potassium**",
                  "**เพิ่ม resorption ของ sodium** และตามมาด้วย chloride",
                  "osmotic gradient ที่เกิดขึ้นทำให้น้ำเคลื่อนจาก glomerular filtrate เข้าสู่ extracellular fluid (ECF)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Adrenal medulla",
        "source": "Endocrine p.35",
        "body": [
          {
            "bullets": [
              "เซลล์หลักคือ **Chromaffin cells**",
              "**มีสีน้ำตาล เพราะ catecholamines ถูก oxidize เป็น melanin เมื่อ fix ด้วยน้ำยาที่มี chromium salt**",
              "ในเนื้อเยื่อมี blood vessels และ **preganglionic sympathetic fibers**",
              "หลั่ง **catecholamine**"
            ]
          }
        ]
      },
      {
        "heading": "การควบคุมการหลั่งฮอร์โมนของ Adrenal gland",
        "source": "Endocrine p.37",
        "body": [
          {
            "bullets": [
              "**Adrenal cortex: ควบคุมโดย Adrenocorticotrophic hormone (ACTH) จาก hypophysis**",
              "**Adrenal medulla: ควบคุมโดย sympathetic nervous system**"
            ]
          },
          {
            "callout": "สไลด์เขียนวงเล็บถามไว้ว่า ACTH มาจาก hypophysis ส่วนไหน (which part?) แต่สไลด์ไม่ได้เฉลย ให้กลับไปเทียบกับหน้า 16 (Pars intermedia) ที่ระบุ ACTH cells เอง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cushing's vs Addison's",
        "source": "Endocrine p.38",
        "body": [
          {
            "bullets": [
              "**Cushing: Hyperadrenocorticism**",
              "**Addison's: Hypoadrenocorticism**"
            ]
          },
          {
            "callout": "สไลด์ให้แค่คู่คำนี้ ไม่ได้ลงอาการทางคลินิก ภาพจุลกายวิภาค หรือการวินิจฉัย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pancreas และ Islets of Langerhans",
        "source": "Endocrine p.39-40",
        "body": [
          {
            "text": "Pancreas มีทั้งส่วน **Pancreatic acinus** (exocrine) และ **Endocrine pancreas: Islets of Langerhans**"
          },
          {
            "sub": "เซลล์ใน Islets of Langerhans",
            "body": [
              {
                "bullets": [
                  "**A cell: Glucagon**",
                  "**B-cell: Insulin** สไลด์กำกับว่า uptake glucose to cell",
                  "**C-cell: สไลด์ใส่เครื่องหมายคำถามไว้ ไม่ได้บอกว่าหลั่งอะไร**",
                  "**D-cell: Somatostatin**",
                  "**F-cell: Pancreatic polypeptide**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "นิยามท้ายเด็ค: APUD cells และ PAS reaction",
        "source": "Endocrine p.41",
        "body": [
          {
            "sub": "APUD cells (สไลด์ยกตัวอย่างที่ adrenal medulla)",
            "body": [
              {
                "text": "เซลล์ที่สามารถทำ **amine precursor uptake and decarboxylation** และสังเคราะห์กับหลั่ง **polypeptide hormones** ได้"
              }
            ]
          },
          {
            "sub": "PAS reaction (สไลด์ยกตัวอย่างที่ basophils และ follicular colloid)",
            "body": [
              {
                "text": "การย้อม PAS ใช้ย้อมโครงสร้างที่มี **carbohydrate macromolecules** ในสัดส่วนสูง ได้แก่ **glycogen, glycoprotein, proteoglycans**"
              }
            ]
          },
          {
            "callout": "สองนิยามนี้ผูกกลับไปที่เนื้อหาก่อนหน้าโดยตรง PAS reaction คือเกณฑ์แยก basophils ในหน้า 13 และใช้กับ follicular colloid ของ thyroid",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "histo--epithelium": {
    "topic": "histo--epithelium",
    "title": "Epithelium (Epithelial tissue)",
    "icon": "🔬",
    "lecturer": "Tilladit Rung-ruangkijkrai, DVM., Ph.D.",
    "summary": "เด็คนี้ปูพื้น epithelial tissue ทั้งก้อนตั้งแต่ลำดับชั้น cell ถึง system แล้วลงรายละเอียด 2 ประเภทใหญ่คือ covering and lining epithelium (simple, stratified, pseudostratified, transitional) กับ modified epithelium (glandular epithelium และ myoepithelium) ปิดท้ายด้วยการแบ่งชนิดของ gland 4 เกณฑ์ ได้แก่ morphology, function, nature of secretion และ mode of secretion จุดสำคัญของเด็คอยู่ที่สไลด์ตารางสรุป 3 แผ่น (p.30 simple, p.31 modification กับตำแหน่ง, p.48 stratified) ซึ่งเป็นเนื้อหาที่อัดแน่นที่สุด ส่วนสไลด์อีกจำนวนมาก (p.9, 14-18, 20, 23-24, 27-28, 38-40, 42, 45, 47, 54, 59-62, 64-65, 67) เป็นภาพ histology ล้วนหรือมีแต่ป้ายชื่อโครงสร้าง ไม่มีคำอธิบายเป็นข้อความ",
    "sections": [
      {
        "heading": "epithelium อยู่ตรงไหนในลำดับชั้นของร่างกาย",
        "source": "Epithelium p.2-3",
        "body": [
          {
            "text": "สไลด์ไล่ลำดับจากเล็กไปใหญ่ Cells (organelles เช่น rER, Golgi, mitochondria) → Tissues (group of cells ที่ทำงานร่วมกัน) → Organs (heart, brain, kidney, stomach) → System (cardiovascular, urinary, digestive)"
          },
          {
            "text": "**basic tissue มี 4 types** และสไลด์กำกับหน้าที่หลักของแต่ละอันไว้ในวงเล็บ"
          },
          {
            "bullets": [
              "Epithelial tissue (covering)",
              "Connective tissue (supporting)",
              "Muscular tissue (movement)",
              "Nervous tissue (controlling)"
            ]
          }
        ]
      },
      {
        "heading": "คุณสมบัติร่วมของ epithelial tissue",
        "source": "Epithelium p.4",
        "body": [
          {
            "bullets": [
              "**High cellularity** คือมี ECM น้อยมาก (minimal amounts of ECM)",
              "**Specialized contacts** เชื่อมกันด้วย special junctions",
              "**Polarity** มี apical surface",
              "**Supported by connective tissue + basement membrane**",
              "**Avascular but innervated** ไม่มีหลอดเลือดของตัวเอง แต่มีเส้นประสาทมาเลี้ยง และรับ nts จาก CNT",
              "**Regeneration** ด้วย mitosis"
            ]
          },
          {
            "callout": "avascular but innervated เป็นคู่คำที่ออกสอบง่ายเพราะฟังดูขัดกันเอง จำว่า ไม่มีเลือดเข้ามาในชั้น epithelium เอง แต่มีปลายประสาทได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Development จาก germ layers",
        "source": "Epithelium p.5",
        "body": [
          {
            "bullets": [
              "**Ectoderm → epidermis, skin**",
              "**Endoderm → the lining of digestive & respiratory tracts**",
              "**Mesoderm → the lining of body cavity, urogenital system, blood & lymph vessels**"
            ]
          }
        ]
      },
      {
        "heading": "Functions ของ epithelium",
        "source": "Epithelium p.6",
        "body": [
          {
            "bullets": [
              "Protection underlying tissues",
              "Sensory reception ผ่าน nerve endings หรือ receptors",
              "Selective diffusion (move molecules → conc.)",
              "Absorption (molecules → cells)",
              "Secretion (molecules ← cells)",
              "Ion transport (charged ions เข้าออกเนื้อเยื่อ)",
              "Filtration (molecules ← fluid)",
              "Forms slippery surfaces (mucus)"
            ]
          },
          {
            "callout": "สไลด์ใช้ทิศทางลูกศรแยก absorption (เข้าเซลล์) ออกจาก secretion (ออกจากเซลล์) ตรงนี้อ่านจากลูกศรอย่างเดียว ไม่มีคำอธิบายกลไกเพิ่ม",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "epithelium แบ่งใหญ่เป็น 2 ประเภท",
        "source": "Epithelium p.7",
        "body": [
          {
            "sub": "1. Covering and lining epithelium",
            "body": [
              {
                "bullets": [
                  "lines open cavities ของ digestive และ respiratory system",
                  "covers the walls of organs",
                  "outer layer of the skin"
                ]
              }
            ]
          },
          {
            "sub": "2. Modified epithelium",
            "body": [
              {
                "text": "แตกเป็น glandular (secretory) epithelium กับ myoepithelium"
              },
              {
                "bullets": [
                  "**Endocrine gland: secrete → bl.vsl. → organ**",
                  "**Exocrine gland: secrete → duct → organ**",
                  "Myoepithelium"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หลักการจำแนก covering & lining epithelium",
        "source": "Epithelium p.8",
        "body": [
          {
            "text": "สไลด์ใช้ **2 เกณฑ์คู่กันเสมอ** คือจำนวนชั้น คูณ รูปร่างของเซลล์"
          },
          {
            "sub": "1. Number of cell layers",
            "body": [
              {
                "bullets": [
                  "Simple epithelium = single layer",
                  "Stratified epithelium = multiple layers"
                ]
              }
            ]
          },
          {
            "sub": "2. Shape and height",
            "body": [
              {
                "bullets": [
                  "Squamous: flat and scale-like",
                  "Cuboidal: box-like (height เท่ากับ width)",
                  "Columnar: tall (column shaped)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "SIMPLE EPITHELIUM ภาพรวมและชนิดย่อย",
        "source": "Epithelium p.10-11",
        "body": [
          {
            "bullets": [
              "Single layer, thin",
              "**Direct contact with basement membrane** ทุกเซลล์",
              "**Found where absorption and filtration occur**",
              "Classified by the shape of cells"
            ]
          },
          {
            "text": "สไลด์แจกแจง 4 ชนิด คือ 1. Simple squamous 2. Simple cuboidal 3. Simple columnar 4. Pseudostratified columnar"
          },
          {
            "callout": "สังเกตว่าเด็คนี้จัด pseudostratified columnar ไว้ใต้หัวข้อ SIMPLE epithelium ไม่ได้แยกเป็นกลุ่มที่สาม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Simple squamous epithelium และชื่อเฉพาะตามตำแหน่ง",
        "source": "Epithelium p.12-13",
        "body": [
          {
            "text": "เซลล์ flattened, scale- or plate-like พบที่"
          },
          {
            "bullets": [
              "Filtration (kidneys, lungs)",
              "Passive diffusion of gases (capillaries, pericardial, pleural, peritoneal cavities)",
              "Inner surface of blood, lymph vsl.",
              "Outer surface of internal organ"
            ]
          },
          {
            "sub": "Special names (location) ที่ต้องแยกให้ออก",
            "body": [
              {
                "bullets": [
                  "**Endothelium** เป็น friction-reducing บุ lymph & blood vessels",
                  "**Mesothelium** คือ serous membranes, membranes lining body cavity, covering the internal organs",
                  "**Mesenchymal epithelium** อยู่ที่ subdural space และ anterior chamber"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cornea จุดที่ชื่อกับชนิดของ epithelium ไม่ตรงกัน",
        "source": "Epithelium p.16-18",
        "body": [
          {
            "bullets": [
              "**Corneal epithelium = stratified squamous epithelium**",
              "**Corneal endothelium = mesenchymal epithelium = simple squamous epithelium (high)**"
            ]
          },
          {
            "callout": "สไลด์วงเล็บคำว่า corneal endothelium ไว้ทุกครั้ง แล้วเขียนกำกับว่าจริง ๆ คือ mesenchymal epithelium ชนิด simple squamous (high) นี่คือกับดักคำถามแบบ ชื่อบอกอย่าง ชนิดเป็นอีกอย่าง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Simple cuboidal epithelium",
        "source": "Epithelium p.19",
        "body": [
          {
            "bullets": [
              "รูปร่าง cuboidal เมื่อดูใน sections",
              "**Function: secrete / absorb / excrete**",
              "พบที่ small collecting ducts of kidney",
              "พบที่ duct of gland (pancreas & salivary gland)",
              "เมื่อรวมตัวเป็น secretory unit จะเรียกว่า **pyramidal epithelium**"
            ]
          }
        ]
      },
      {
        "heading": "Simple columnar epithelium และ cell modification",
        "source": "Epithelium p.21-22, 24",
        "body": [
          {
            "bullets": [
              "Cell สูงกว่ากว้าง (taller than wide)",
              "**Nucleus อยู่ที่ base of the cell**",
              "**Extremely high secretive ที่ stomach และ high absorptive ที่ small intestine**"
            ]
          },
          {
            "sub": "Cell modification ที่สไลด์แบ่งตามด้านของเซลล์",
            "body": [
              {
                "bullets": [
                  "**APICAL: Microvilli (small intestine)**",
                  "**APICAL: Cilia (respiratory / female reproductive tr.)**",
                  "**APICAL: Stereocilia (sperm duct)**",
                  "**LATERAL: Junctional complex (terminal bar)**",
                  "Goblet cell คือ unicellular mucous gland"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pseudostratified columnar epithelium",
        "source": "Epithelium p.25-26",
        "body": [
          {
            "bullets": [
              "จริง ๆ คือ simple columnar epithelium",
              "**nucleus อยู่คนละระดับความสูงกัน จึงดูเหมือนหลายชั้น เลยเรียก PSEUDO**",
              "Cilia เป็น hair-like extension ที่ apical หรือ luminal membrane เรียกว่า ciliated pseudostratified epithelium",
              "พบที่ respiratory และ genital system"
            ]
          },
          {
            "text": "apical (luminal) modification ที่สไลด์ระบุคู่กัน คือ **cilia ที่ respiratory และ female reproductive tract** กับ **stereocilia ที่ sperm duct**"
          }
        ]
      },
      {
        "heading": "สูตรจำ goblet cell คู่กับ striation",
        "source": "Epithelium p.29",
        "body": [
          {
            "text": "สไลด์นี้ทำเป็นตารางเทียบ 3 บรรทัด ใช้ 2 ตัวแปรคือ มี goblet cell หรือไม่ และ striation สั้นหรือยาว"
          },
          {
            "bullets": [
              "**Simple columnar + goblet + short → microvilli (intestine)** เรียก simple columnar epithelium with goblet cell & microvilli",
              "**Pseudostratified columnar + goblet + long / straight → cilia (respiratory)** เรียก ciliated pseudostratified columnar epithelium with goblet cell",
              "**Pseudostratified columnar ไม่มี goblet + long + curl → stereocilia** เรียก pseudostratified columnar epithelium with stereocilia"
            ]
          },
          {
            "callout": "text layer ของบรรทัดสุดท้ายในสไลด์นี้พิมพ์ซ้อนกันจนอ่านวงเล็บท้ายไม่ออก ตัวชนิดของ epithelium อ่านได้ชัดว่าเป็น pseudostratified columnar with stereocilia แต่คำในวงเล็บให้ไปเปิดสไลด์จริงยืนยันอีกที",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ตารางสรุป SIMPLE epithelium",
        "source": "Epithelium p.30",
        "body": [
          {
            "sub": "Squamous",
            "body": [
              {
                "bullets": [
                  "Location: heart, serosae, blood, lymph vsl.",
                  "Cells: single flattened scale-like layer",
                  "Nuclei: centrally located",
                  "**Functions: diffusion, lubrication**"
                ]
              }
            ]
          },
          {
            "sub": "Cuboidal",
            "body": [
              {
                "bullets": [
                  "Location: kidney tubules, duct of glands, ovary surface",
                  "Cells: single square-like layer",
                  "Nuclei: centrally located, spherical",
                  "**Functions: absorb, secrete, protect**"
                ]
              }
            ]
          },
          {
            "sub": "Columnar",
            "body": [
              {
                "bullets": [
                  "Location ciliated: bronchi, oviduct, uterus",
                  "Location non-ciliated: digestive tract, gallbladder",
                  "Cells: tall single-layered, มี cilia, มี goblet cells with microvilli",
                  "Nuclei: basally located, elongated",
                  "**Functions: absorb, secrete, protect**"
                ]
              }
            ]
          },
          {
            "sub": "Pseudostratified",
            "body": [
              {
                "bullets": [
                  "Location ciliated: trachea",
                  "Location non-ciliated: sperm ducts",
                  "Cells: differ in height",
                  "Nuclei: various positions",
                  "**Functions: absorb, secrete, transport**"
                ]
              }
            ]
          },
          {
            "callout": "nuclei เป็นตัวแยกที่ใช้ได้จริงตอนส่องสไลด์ centrally located คือ squamous กับ cuboidal, basally located คือ columnar, various positions คือ pseudostratified",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตารางจับคู่ modification กับตำแหน่ง",
        "source": "Epithelium p.31",
        "body": [
          {
            "bullets": [
              "**Microvilli → simple columnar → digestive tract, small intestine**",
              "**Cilia → pseudostratified columnar → respiratory tract (trachea) และ female reproductive (oviduct, uterus)**",
              "**Stereocilia → pseudostratified columnar → male reproductive (epididymis, ductus deferens)**"
            ]
          },
          {
            "callout": "ตาราง p.30 เขียนว่า simple columnar แบบ ciliated พบที่ bronchi, oviduct, uterus ส่วนตาราง p.31 จับ cilia ไว้กับ pseudostratified columnar ที่ trachea, oviduct, uterus สไลด์ไม่ได้อธิบายว่าสองตารางนี้ตกลงกันอย่างไร ให้ท่องตามตารางที่อาจารย์ใช้ถามในข้อนั้น ๆ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "STRATIFIED EPITHELIUM ภาพรวมและชนิดย่อย",
        "source": "Epithelium p.32-34",
        "body": [
          {
            "bullets": [
              "Multilayer",
              "**ทนต่อ mechanical หรือ chemical insult**",
              "เมื่อถูก abraded และหลุดไป จะเปิดเผย subepithelial layer",
              "ตั้งชื่อตามเซลล์ชั้น apical ว่าเป็น squamous, cuboid หรือ columnar"
            ]
          },
          {
            "text": "แบ่งเป็น 4 ชนิด คือ 1. Stratified squamous 2. Stratified cuboidal 3. Stratified columnar 4. Transitional"
          },
          {
            "sub": "รายละเอียดของ stratified squamous",
            "body": [
              {
                "bullets": [
                  "Vary in thickness",
                  "**Deepest cells contact with the basement membrane เป็น cuboidal หรือ columnar เรียก basal cell layer**",
                  "**Basal cells are mitotically active and replace** เซลล์ที่หลุดไป",
                  "เซลล์ที่ผิวจะแบน (flat at the surface)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Keratinized กับ Non-keratinized stratified squamous",
        "source": "Epithelium p.35-37, 40",
        "body": [
          {
            "sub": "1. Keratinized",
            "body": [
              {
                "bullets": [
                  "**Apical เป็นเซลล์ตายและไม่มี nucleus**",
                  "มี tough, resistant protein คือ **keratin**",
                  "Protect from abrasion และ waterproof (mammalian skin)",
                  "พบที่ dry skin, teat, paw, masticatory mucosa",
                  "สไลด์บอกว่าเรียกอีกชื่อว่า **cornified** ประกอบด้วย dead squamous cells หลายชั้น"
                ]
              }
            ]
          },
          {
            "sub": "2. Non-keratinized",
            "body": [
              {
                "bullets": [
                  "**Apical layer ยังมี nucleus อยู่**",
                  "ไม่มี keratin เป็น wet skin หรือ moist stratified epithelium",
                  "พบที่ mouth (buccal), esophagus, vagina"
                ]
              }
            ]
          },
          {
            "text": "สไลด์ภาพ p.40 กำกับตัวอย่างไว้เป็น thick skin กับ thin skin หรือ hairy skin แต่ไม่ได้เขียนข้อความอธิบายความต่างเพิ่ม"
          }
        ]
      },
      {
        "heading": "5 ชั้นของ stratified squamous epithelium",
        "source": "Epithelium p.41-42",
        "body": [
          {
            "bullets": [
              "**1. Stratum basale** อยู่ที่ base, cuboid, 1 layer, mitotic",
              "**2. Stratum spinosum** มี desmosome และ melanin pigment",
              "**3. Stratum granulosum** มี keratohyalin granule → keratin",
              "**4. Stratum lucidum** พบใน non-hairy skin only",
              "**5. Stratum corneum** เกิด keratinization ไม่พบใน non-keratinized epithelium ที่อยู่บนผิว moist"
            ]
          },
          {
            "text": "สไลด์เขียนคำว่า **STRATUM GERMINATIVUM** กำกับไว้ตรงชั้นที่ 1 และ 2"
          },
          {
            "callout": "ขอบเขตของวงเล็บปีกกา STRATUM GERMINATIVUM อ่านจากตำแหน่งที่พิมพ์ในสไลด์ ถ้าเปิดสไลด์จริงแล้วปีกกาคลุมกว้างกว่านี้ ให้ยึดตามภาพในสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Stratified cuboidal และ Stratified columnar",
        "source": "Epithelium p.43-44",
        "body": [
          {
            "sub": "2. Stratified cuboidal epithelium",
            "body": [
              {
                "bullets": [
                  "multiple layer of cells",
                  "**Superficial layer เป็น cuboidal cells**",
                  "พบที่ excretory duct of glands"
                ]
              }
            ]
          },
          {
            "sub": "3. Stratified columnar epithelium",
            "body": [
              {
                "bullets": [
                  "multiple layer of cells",
                  "**Superficial layer สูงกว่ากว้าง (taller than wide)**",
                  "พบที่ large salivary duct (parotid, mandibular duct)",
                  "พบที่ lacrimal sac และ duct"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Transitional epithelium",
        "source": "Epithelium p.46",
        "body": [
          {
            "bullets": [
              "Multiple layer หน้าตาคล้าย stratified cuboidal epithelium",
              "**Superficial cells เป็น dome-shaped และ bulge เข้าไปใน lumen**",
              "**รูปร่างและจำนวนแถวขึ้นกับ degree of distention**",
              "**ตอน stretch เซลล์เป็น squamous ตอน low tension เป็น pillow-shaped**",
              "พบที่ urinary system"
            ]
          }
        ]
      },
      {
        "heading": "ตารางสรุป STRATIFIED epithelium",
        "source": "Epithelium p.48",
        "body": [
          {
            "sub": "Squamous",
            "body": [
              {
                "bullets": [
                  "Non-keratinized: mouth, tongue, pharynx, esophagus & vagina",
                  "Keratinized: skin, hair, claws, nails (dry surface)",
                  "Cells: apical เป็น squamous ส่วน basal เป็น cuboid ถึง columnar",
                  "Nuclei: centrally located",
                  "**Function: protection**"
                ]
              }
            ]
          },
          {
            "sub": "Cuboidal",
            "body": [
              {
                "bullets": [
                  "Location: sweat glands, mammary glands, conjunctiva, female urethra",
                  "Cells: two layers",
                  "Nuclei: centrally located, spherical",
                  "**Function: absorption, secretion**"
                ]
              }
            ]
          },
          {
            "sub": "Columnar",
            "body": [
              {
                "bullets": [
                  "Location: vas deferens, male urethra, trachea & bronchi",
                  "Cells: single layer of columnar cells วางบน several layers of cuboidal cells",
                  "Nuclei: basal oval",
                  "**Function: protection, secretion**"
                ]
              }
            ]
          },
          {
            "sub": "Transitional",
            "body": [
              {
                "bullets": [
                  "**Location: only in bladder, ureter & urethra**",
                  "Cells: vary ตามการ stretch, apical large, round and binucleated",
                  "Nuclei: centrally located",
                  "**Function: distension**"
                ]
              }
            ]
          },
          {
            "callout": "คำว่า only ใน only in bladder, ureter & urethra เป็นคำที่สไลด์เขียนเอง ใช้ตอบข้อสอบแบบ transitional พบที่ไหนได้เลย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Type 2: Secretory (glandular) epithelium กำเนิดของ gland",
        "source": "Epithelium p.49-50",
        "body": [
          {
            "bullets": [
              "**developmentally derived from epithelium**",
              "**Form a down-growth into the underlying CNT**",
              "Develop the special characteristics of gland"
            ]
          },
          {
            "sub": "การจำแนก gland มี 4 เกณฑ์",
            "body": [
              {
                "bullets": [
                  "**A. Morphology: unicellular / multicellular gland**",
                  "**B. Function: endocrine / exocrine gland**",
                  "**C. Nature of secretion: serous / mucous / mixed (seromucous)**",
                  "**D. Mode of secretion: merocrine / apocrine / holocrine**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "A. แบ่งตาม morphology",
        "source": "Epithelium p.51-52",
        "body": [
          {
            "sub": "1. Unicellular gland",
            "body": [
              {
                "bullets": [
                  "Single secretory cell",
                  "**Goblet cell → mucin → lubricate**",
                  "พบใน simple columnar with goblet cell และ pseudostratified columnar with goblet cell"
                ]
              }
            ]
          },
          {
            "sub": "2. Multicellular gland",
            "body": [
              {
                "bullets": [
                  "ประกอบด้วยเซลล์มากกว่า 1 ตัว รวมเป็น cluster หรือ secretory unit",
                  "หน้าที่ protect, lubricate, digest",
                  "ตัวอย่าง salivary gland, mammary gland, sweat gland"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "B. แบ่งตาม function: endocrine กับ exocrine",
        "source": "Epithelium p.53",
        "body": [
          {
            "sub": "Endocrine gland",
            "body": [
              {
                "bullets": [
                  "**secrete → blood stream**",
                  "**lack a duct system**",
                  "หลั่ง hormones",
                  "ตัวอย่าง thymus, pituitary, thyroid"
                ]
              }
            ]
          },
          {
            "sub": "Exocrine gland",
            "body": [
              {
                "bullets": [
                  "**secrete → duct → outer (skin หรือ GI tract)**",
                  "Secretion is directly onto the apical surface"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "รูปร่างของ secretory unit และ duct system ของ exocrine gland",
        "source": "Epithelium p.55-56",
        "body": [
          {
            "text": "แบ่งใหญ่เป็น **simple gland** กับ **compound gland**"
          },
          {
            "bullets": [
              "**Simple gland: tubular, acinar, alveolar** โดยแต่ละแบบยังเป็น straight, coiled หรือ branched ได้",
              "**Compound gland: tubular, tubuloacinar**"
            ]
          },
          {
            "text": "สไลด์ภาพ p.56 ไล่ตัวอย่างไว้เป็น simple straight tubular, simple branched tubular, simple coiled tubular, simple straight acinar, simple branched acinar, compound tubular, compound acinar และ compound tubuloacinar"
          },
          {
            "callout": "หัวข้อ p.55 เขียน compound gland ว่ามีแค่ tubular กับ tubuloacinar แต่ภาพ p.56 มี compound acinar ให้ด้วย สไลด์ไม่ได้อธิบายความต่างของสองแผ่นนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "C. แบ่งตาม nature of secretory product",
        "source": "Epithelium p.57-58",
        "body": [
          {
            "bullets": [
              "**Serous gland (acinus)**",
              "**Mucous gland (acinus)**",
              "**Mixed gland หรือ seromucous**"
            ]
          },
          {
            "text": "สไลด์เรียกเซลล์ของต่อมกลุ่มนี้ว่า **PYRAMIDAL (GLANDULAR) EPITHELIUM** และชี้โครงสร้างชื่อ **serous demilunes** ไว้ในต่อมแบบผสม"
          },
          {
            "callout": "สไลด์ p.59-62 เป็นภาพ histology ล้วน ป้ายกำกับมีแค่ serous acini, mucous acini, duct, mucous, serous และ serous demilunes ไม่มีคำอธิบายวิธีแยกด้วยการติดสี",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "D. แบ่งตาม mode of secretion",
        "source": "Epithelium p.63",
        "body": [
          {
            "sub": "Merocrine",
            "body": [
              {
                "bullets": [
                  "**Most common**",
                  "Enclosed within a membrane แบบ exocytosis",
                  "**Without loss of cell**",
                  "ตัวอย่าง sweat gl., salivary gl., prostate gl. (dog)"
                ]
              }
            ]
          },
          {
            "sub": "Apocrine",
            "body": [
              {
                "bullets": [
                  "**Secretory droplets ออกไปพร้อม plasmalemma**",
                  "**Rest of cell restore itself**",
                  "ตัวอย่าง mammary gl., special sweat gl."
                ]
              }
            ]
          },
          {
            "sub": "Holocrine",
            "body": [
              {
                "bullets": [
                  "**Cell breakdown ทั้งเซลล์**",
                  "ตัวอย่าง sebaceous gl."
                ]
              }
            ]
          },
          {
            "callout": "text layer ของสไลด์แผ่นนี้พิมพ์คำว่า Apocrine ซ้อนทับกับรายชื่อตัวอย่างของ merocrine จนอ่านยาก ผมอ่านว่ารายชื่อ sweat, salivary, prostate (dog) เป็นตัวอย่างของ merocrine ให้เปิดสไลด์จริงยืนยันการวางบรรทัดอีกครั้งก่อนท่อง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Myoepithelial cells",
        "source": "Epithelium p.66",
        "body": [
          {
            "bullets": [
              "**Modified muscle + epithelial cells**",
              "**Found in glandular epithelium ได้แก่ sweat gland, mammary gland, salivary gland**",
              "**Contract แล้ว expel the secretion**"
            ]
          },
          {
            "text": "สไลด์สุดท้าย p.67 เป็นภาพ myoepithelial cells ไม่มีข้อความประกอบ"
          }
        ]
      }
    ]
  },
  "histo--female-lab-manual": {
    "topic": "histo--female-lab-manual",
    "title": "Female reproductive organs (lab manual)",
    "icon": "🔬",
    "lecturer": "Sayamon Srisuwatanasagul",
    "summary": "Lab manual ของ female reproductive organs (หัวสไลด์เขียนว่า LAB MANUAL /2013 และ 2022 after Covid-19) ไล่จาก ovary (cortex/medulla, folliculogenesis, corpus luteum, atresia) ไป oviduct, uterus, cervix, clitoris และปิดท้ายด้วย canine vaginal cytology. เนื้อหาเป็นแบบคู่มือแลบ คือ ข้อความสั้นๆ กำกับภาพสไลด์ที่ label ไว้เป็น A-F หลายหน้าเป็นแผ่นภาพล้วนที่มีแค่คำบรรยายภาพ (เช่น p.1, p.4, p.8) จึงไม่มีรายละเอียดกลไกหรือฮอร์โมนใดๆ ในเด็คนี้",
    "sections": [
      {
        "heading": "ภาพรวมของ ovary: cortex กับ medulla",
        "source": "female lab manual p.1",
        "body": [
          {
            "text": "**Ovary แบ่งเป็น cortex และ medulla** โดยผิวนอกคลุมด้วย germinal epithelium ซึ่งเป็น simple cuboidal epithelium"
          },
          {
            "bullets": [
              "**Tunica albuginea** = connective tissue ที่อยู่ใต้ germinal epithelium",
              "**Cortex**: มี follicle หลายระยะ และ corpus luteum",
              "**Medulla**: blood vessel, nerve, connective tissue"
            ]
          },
          {
            "text": "**Ovarian follicle = oocyte + follicular cells** และ ovarian follicles ฝังตัวอยู่ใน ovarian stroma"
          },
          {
            "callout": "หน้านี้เป็นแผ่นภาพเป็นหลัก คำบรรยายภาพที่มีคือ ovarian cortex with fimbria (A) กับ higher magnification (B), primordial follicle, primordial special stain และ primary follicle",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Folliculogenesis (1): primordial และ primary follicle",
        "source": "female lab manual p.2",
        "body": [
          {
            "sub": "1. Primordial follicle",
            "body": [
              {
                "text": "**primary oocyte ล้อมด้วย follicular cells ชั้นเดียวที่เป็นรูปแบน (flattened)**"
              },
              {
                "text": "พบที่ส่วนนอกของ cortex มักอยู่ใต้ tunica albuginea พอดี"
              },
              {
                "text": "**การกระจายต่างกันตามสัตว์: ใน carnivores อยู่รวมกันเป็น clusters ส่วนใน ruminants และ sow กระจายสม่ำเสมอ**"
              }
            ]
          },
          {
            "sub": "2. Primary follicle",
            "body": [
              {
                "text": "**primary oocyte ล้อมด้วย cuboidal epithelium**"
              },
              {
                "text": "**Zona pellucida เริ่มพัฒนาที่ระยะนี้** เป็นชั้น glycoprotein ระหว่าง granulosa cells กับ oocyte"
              }
            ]
          },
          {
            "callout": "ภาพในหน้านี้กำกับว่าเป็น follicles ในหลายระยะของการเจริญและการเสื่อม (growth and degeneration)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Folliculogenesis (2): secondary, mature follicle และ theca",
        "source": "female lab manual p.3",
        "body": [
          {
            "sub": "3. Secondary follicle",
            "body": [
              {
                "text": "primary oocyte ล้อมด้วย cuboidal epithelium (ตามที่สไลด์เขียน) และ **เริ่มเห็น follicular antrum** พร้อม zona pellucida"
              },
              {
                "bullets": [
                  "มี liquor folliculi อยู่ใน antrum",
                  "**stromal cells เปลี่ยนไปเป็น theca cells**"
                ]
              }
            ]
          },
          {
            "sub": "4. Mature follicle (tertiary / graafian / preovulatory follicle)",
            "body": [
              {
                "bullets": [
                  "**antrum ขนาดใหญ่** และมี liquor folliculi อยู่ภายใน",
                  "มี corona radiata และ cumulus oophorus"
                ]
              }
            ]
          },
          {
            "sub": "Theca 2 ชั้น (จุดที่ต้องแยกให้ออกในแลบ)",
            "body": [
              {
                "text": "**Theca interna: เซลล์ขนาดใหญ่ กลม foamy หน้าตาคล้าย epithelium และหลั่ง androgens**"
              },
              {
                "text": "**Theca externa: เซลล์คล้าย fibroblast เรียงล้อมรอบ follicle อยู่นอกชั้น theca interna**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Corona radiata กับ cumulus oophorus ต่างกันตรงไหน",
        "source": "female lab manual p.4",
        "body": [
          {
            "text": "**Corona radiata = granulosa cells ที่ยังติดไปกับ oocyte หลัง ovulation**"
          },
          {
            "text": "**Cumulus oophorus = granulosa cells ที่ล้อมรอบ oocyte แต่ยังคงอยู่ใน ovary หลัง ovulation**"
          },
          {
            "callout": "หน้านี้มีแค่คำนิยาม 2 บรรทัดนี้กับภาพ ไม่มีรายละเอียดอื่นเพิ่ม",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หลัง ovulation: corpus hemorrhagicum ไป corpus luteum ไป corpus albicans",
        "source": "female lab manual p.5",
        "body": [
          {
            "sub": "Corpus hemorrhagicum",
            "body": [
              {
                "text": "หลังจาก ovum ถูกปล่อยออกไป **follicle ที่ยุบตัวจะกลายเป็น corpus hemorrhagicum เพราะเลือดไหลเข้าไปใน antrum**"
              }
            ]
          },
          {
            "sub": "Corpus luteum",
            "body": [
              {
                "text": "**basal lamina ของ follicular cells สลายลง แล้ว capillaries จาก stroma รุกเข้าไปใน follicle ที่ยุบตัว** เปลี่ยนให้กลายเป็น **temporary endocrine organ ที่พับซับซ้อนและมีหลอดเลือดมาก เรียกว่า corpus luteum**"
              },
              {
                "bullets": [
                  "**granulosa cells ขยายใหญ่มากและมี lipid droplets เล็กๆ จำนวนมาก เรียกว่า granulosa lutein cells**",
                  "**theca interna cells ถูกรวมเข้าไปในรอยพับ กลายเป็น thecal lutein cells**"
                ]
              }
            ]
          },
          {
            "sub": "Corpus albicans",
            "body": [
              {
                "text": "**คือการสะสมของ fibrous connective tissue หลังจาก CL เสื่อมสลาย (luteolysis)**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Atretic follicle และการเปลี่ยนแปลงที่ต้องดูออก",
        "source": "female lab manual p.6",
        "body": [
          {
            "text": "**มี follicle เพียงจำนวนน้อยที่โตจนถึงระยะสมบูรณ์และถูกปล่อยออกมาทาง ovulation ส่วนใหญ่จะเสื่อมสลายไปด้วยกระบวนการ atresia**"
          },
          {
            "sub": "Atretic alterations ที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "**clumping ของ nuclear chromatin (pyknosis)**",
                  "cytoplasm ของ oocyte, granulosa หรือ follicular cells หดตัวและสลาย (shrinkage and lysis)",
                  "**basement membrane ที่กั้น granulosa cells ออกจาก theca interna อาจหนาตัวและยุบลงจนกลายเป็น glassy membrane**"
                ]
              },
              {
                "text": "ท้ายที่สุด oocyte, zona pellucida และ follicular cells จะเสื่อมสลายและถูกดูดซึมกลับไป"
              }
            ]
          }
        ]
      },
      {
        "heading": "Oviduct: ผนังและเซลล์ 2 ชนิดใน epithelium",
        "source": "female lab manual p.7",
        "body": [
          {
            "sub": "ชั้นของผนัง",
            "body": [
              {
                "bullets": [
                  "**surface epithelium เป็น ciliated simple columnar หรือ pseudocolumnar epithelium**",
                  "**muscularis externa มี inner circular layer ของ smooth muscle และ outer longitudinal layer ที่พัฒนาน้อยกว่า**",
                  "serosa มี simple squamous epithelium อยู่บน connective tissue"
                ]
              }
            ]
          },
          {
            "sub": "เซลล์ 2 ชนิดใน epithelium",
            "body": [
              {
                "text": "**1) Ciliated cells** พบมากที่สุดที่ผิวของ fimbriae รองลงมาที่ ampulla และพบน้อยลงอีกที่ isthmus กับ interstitial segment"
              },
              {
                "text": "**2) Secretory cells** เป็นเซลล์รูปลิ่ม (wedge-shaped) ไม่มี cilia มี secretory granules ใน cytoplasm **สารที่หลั่งออกมาให้สารอาหารแก่ ovum ระหว่างเดินทางผ่าน oviduct**"
              }
            ]
          },
          {
            "callout": "สไลด์เขียนกำกับไว้ว่า ในแลบไม่ต้องแยก (คือไม่ต้องแยก ciliated cell กับ secretory cell ตอนดูสไลด์)",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Oviduct 3 ส่วน และวิธีแยกจากรูปร่าง mucosa",
        "source": "female lab manual p.8",
        "body": [
          {
            "text": "**Oviduct แบ่งเป็น 3 ส่วน คือ infundibulum, ampulla และ isthmus**"
          },
          {
            "bullets": [
              "**tunica mucosa แตกแขนงและพับซับซ้อนมาก โดยเฉพาะที่ infundibulum และ ampulla** (ภาพ A, B)",
              "**Isthmus: mucosal folds ซับซ้อนน้อยกว่า ampulla มาก และผนังกล้ามเนื้อหนาขึ้นอย่างมาก** (ภาพ C)"
            ]
          }
        ]
      },
      {
        "heading": "Uterus (1): endometrium และความต่างระหว่างสัตว์",
        "source": "female lab manual p.9",
        "body": [
          {
            "text": "**Uterus มี 3 ชั้นหรือ 3 compartments คือ endometrium, myometrium และ perimetrium**"
          },
          {
            "sub": "Surface epithelium แยกตามชนิดสัตว์",
            "body": [
              {
                "text": "**simple columnar ใน mare, bitch, queen ส่วน sow และ ruminants เป็น simple หรือ pseudostratified columnar** (ภาพ D, E)"
              }
            ]
          },
          {
            "sub": "Uterine glands",
            "body": [
              {
                "bullets": [
                  "พบใน endometrium ของสัตว์ส่วนใหญ่",
                  "**epithelium ของต่อมเป็น simple columnar และมีทั้ง secretory และ non-secretory cells**",
                  "**เป็น simple หรือ branched tubular glands อยู่ใน lamina propria-tunica submucosa** (ภาพ E, F)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Uterus (2): myometrium, stratum vasculare และ perimetrium",
        "source": "female lab manual p.10",
        "body": [
          {
            "bullets": [
              "**myometrium มี inner circular layer ที่หนา และ outer longitudinal layer ของ smooth muscle ที่บางกว่า** (ภาพ B)",
              "**บริเวณระหว่างกล้ามเนื้อเรียบสองชั้นมีหลอดเลือดขนาดใหญ่ เรียกว่า stratum vasculare** (ภาพ A, C)",
              "**Perimetrium คือ tunica serosa ของ uterus** มีองค์ประกอบแบบ loose connective tissue ตามปกติ"
            ]
          },
          {
            "callout": "ภาพ F ในหน้านี้กำกับว่าเป็น special staining ของ sow uterus แต่สไลด์ไม่ได้บอกว่าย้อมด้วยสีอะไร",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Cervix และ clitoris",
        "source": "female lab manual p.11",
        "body": [
          {
            "sub": "Cervix",
            "body": [
              {
                "bullets": [
                  "มี smooth muscle และ dense connective tissue ค่อนข้างมาก",
                  "**T. mucosa: simple columnar epithelium ที่มี mucous-secreting cells**",
                  "**T. muscularis: 2 ชั้น คือ inner circular และ outer longitudinal**"
                ]
              },
              {
                "text": "**ใน bitch: lumen ของ cervix บุด้วย simple columnar epithelium แล้วที่ external os epithelium จะเปลี่ยนเป็น stratified squamous epithelium อย่างทันที (abruptly)** ตามลูกศรในภาพ A, B"
              }
            ]
          },
          {
            "sub": "Clitoris",
            "body": [
              {
                "bullets": [
                  "**เทียบเท่ากับ penis ในเพศผู้**",
                  "**non-keratinized stratified epithelium**",
                  "dense connective tissue ที่มี erectile tissue (ภาพ D, E)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Canine vaginal cytology: แยก 3 ชนิดเซลล์จาก vaginal smear",
        "source": "female lab manual p.12",
        "body": [
          {
            "text": "**Superficial cells ที่ไม่มีนิวเคลียส = fully cornified**"
          },
          {
            "sub": "Parabasal cells",
            "body": [
              {
                "bullets": [
                  "**เป็น epithelial cell ที่เล็กที่สุดที่เห็นใน vaginal smear ทั่วไป**",
                  "รูปกลมหรือเกือบกลม **มี nuclear to cytoplasmic ratio สูง**"
                ]
              }
            ]
          },
          {
            "sub": "Intermediate cells",
            "body": [
              {
                "text": "**ขนาดและรูปร่างหลากหลาย เส้นผ่านศูนย์กลางประมาณ 2-3 เท่าของ parabasal cells**"
              }
            ]
          },
          {
            "sub": "Superficial cells",
            "body": [
              {
                "bullets": [
                  "**เป็นเซลล์ที่ใหญ่ที่สุดใน vaginal smear**",
                  "รูป polygonal และแบนชัดเจน",
                  "**นิวเคลียสหายไปหรือเป็น pyknotic (เล็กมากและติดสีเข้ม)**"
                ]
              }
            ]
          },
          {
            "callout": "เด็คจบแค่การบรรยายลักษณะเซลล์ ไม่ได้บอกว่าสัดส่วนเซลล์แต่ละชนิดสัมพันธ์กับ stage ของ estrous cycle อย่างไร",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "histo--female-reproductive-organ": {
    "topic": "histo--female-reproductive-organ",
    "title": "Female reproductive organ",
    "icon": "📖",
    "lecturer": "Assoc. Prof. Dr. Sayamon Srisuwatanasagul",
    "summary": "เด็ค 41 สไลด์ ไล่โครงสร้าง histology ของอวัยวะสืบพันธุ์เพศเมียตามลำดับ ovary (ชั้น cortex/medulla, follicle classification, theca cells, zona pellucida, corpus luteum, atretic follicle) แล้วต่อด้วยท่อ oviduct, uterus, cervix, vagina, clitoris และปิดท้ายด้วย vaginal cytology (ชนิดเซลล์ + ภาพเซลล์ในแต่ละระยะของ cycle ในสุนัข) เนื้อหาเป็น bullet สั้นแบบ descriptive histology เป็นหลัก ไม่ได้ลงกลไก hormone แบบละเอียด สไลด์ p.3, p.4, p.14, p.15 และ p.20 ไม่มีข้อความอธิบาย (เป็นรูปหรือมีแต่ลิงก์อ้างอิงกับหัวข้อ) และ estrous cycle ถูกพูดถึงแค่สไลด์เดียวเฉพาะช่วงหลัง ovulation",
    "sections": [
      {
        "heading": "เด็คนี้ต้องการให้ทำอะไรได้",
        "source": "Female reproductive organ p.2",
        "body": [
          {
            "bullets": [
              "เข้าใจ micro-structure ของ female reproductive organs",
              "**แยกชนิดของเซลล์ (cell types) ในอวัยวะต่าง ๆ ของ female reproductive system ออกจากกันได้**",
              "รู้ fundamental physiology ของอวัยวะสืบพันธุ์เพศเมีย",
              "เชื่อมโยงความรู้กับวิชาอื่น เช่น Anatomy, Pathology, theriogenology"
            ]
          }
        ]
      },
      {
        "heading": "Ovary: ชั้นและหน้าที่",
        "source": "Female reproductive organ p.5-6",
        "body": [
          {
            "text": "สไลด์แบ่ง ovary ตามชั้นที่เห็นใต้กล้อง สามส่วน"
          },
          {
            "bullets": [
              "**ผิวนอกคลุมด้วย surface epithelium ชนิด simple cuboidal**",
              "Cortex: มี ovarian follicle และ corpus luteum",
              "Medulla: connective tissue และ vessels"
            ]
          },
          {
            "text": "หน้าที่ของ ovary ตามสไลด์ p.6 คือ **oogenesis, steroid secretion และ ovulation** สไลด์ไม่ได้บอกรายละเอียดว่า steroid ตัวไหนถูกสร้างจากเซลล์ใดในหน้านี้"
          }
        ]
      },
      {
        "heading": "Ovarian follicle คืออะไร",
        "source": "Female reproductive organ p.7",
        "body": [
          {
            "text": "หัวข้อ follicular development นิยามไว้สั้นมาก **OVARIAN FOLLICLE = OOCYTE + FOLLICULAR CELLS**"
          }
        ]
      },
      {
        "heading": "Follicle classification: primordial, primary, secondary",
        "source": "Female reproductive organ p.8-10",
        "body": [
          {
            "sub": "1. Primordial follicle",
            "body": [
              {
                "text": "**primary oocyte ล้อมด้วย follicular cells ที่แบน (flattened) เพียงชั้นเดียว**"
              }
            ]
          },
          {
            "sub": "2. Primary follicle",
            "body": [
              {
                "bullets": [
                  "primary oocyte กับ **cuboidal epithelium**",
                  "เห็นลักษณะ granular appearance เรียกเซลล์เหล่านี้ว่า **granulosa cells**"
                ]
              }
            ]
          },
          {
            "sub": "3. Secondary follicle",
            "body": [
              {
                "bullets": [
                  "primary oocyte กับ cuboidal epithelium",
                  "**เริ่มมองเห็น follicular antrum**",
                  "มี zona pellucida",
                  "มี liquor folliculi อยู่ใน antrum",
                  "**stromal cells เปลี่ยนไปเป็น theca cells**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ใช้แยก primary กับ secondary ในเด็คนี้คือ antrum, zona pellucida, liquor folliculi และการเกิด theca cells สไลด์ไม่ได้ให้เกณฑ์เรื่องจำนวนชั้นของ granulosa cells",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Theca cells: interna vs externa",
        "source": "Female reproductive organ p.11",
        "body": [
          {
            "bullets": [
              "**Theca interna: เซลล์ใหญ่ กลม foamy หน้าตาคล้าย epithelial cells และหลั่ง androgens**",
              "Theca externa: เซลล์คล้าย fibroblast เรียงตัวรอบ follicle อยู่นอกชั้น theca interna"
            ]
          }
        ]
      },
      {
        "heading": "Mature follicle (Tertiary / Graafian / Pre-ovulatory)",
        "source": "Female reproductive organ p.12",
        "body": [
          {
            "text": "สไลด์ให้สามชื่อนี้ใช้แทนกันได้: **Tertiary = Graafian = Pre-ovulatory follicle**"
          },
          {
            "bullets": [
              "มองเห็น follicle antrum",
              "มี liquor folliculi ใน antrum",
              "มี corona radiata และ cumulus oophorus",
              "**primary oocyte ใน mature follicle ทำ meiosis I จนจบ ได้ secondary oocyte กับ polar body**"
            ]
          }
        ]
      },
      {
        "heading": "Corona radiata vs cumulus oophorus",
        "source": "Female reproductive organ p.13",
        "body": [
          {
            "text": "สองคำนี้เป็น granulosa cells เหมือนกัน แต่แยกกันด้วยว่าหลัง ovulation แล้วเซลล์ไปอยู่ที่ไหน"
          },
          {
            "bullets": [
              "**Corona radiata: granulosa cells ที่ยังติดไปกับ oocyte หลัง ovulation**",
              "**Cumulus oophorus: granulosa cells ที่ล้อมรอบ oocyte แต่ยังคงอยู่ใน ovary หลัง ovulation**"
            ]
          },
          {
            "callout": "ข้อนี้เป็นคู่ที่ถามแยกกันได้ง่าย จำที่ปลายทางของเซลล์ ติดไปกับไข่ = corona radiata, เหลือค้างในรังไข่ = cumulus oophorus",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Zona pellucida",
        "source": "Female reproductive organ p.16",
        "body": [
          {
            "bullets": [
              "เป็น extracellular matrix ประกอบด้วย glycoprotein **ZP1-ZP3**",
              "**ZP3 binding molecule บน sperm plasma membrane จับกับ ZP3**",
              "**การจับนี้กระตุ้นให้ส่วนหัวของ sperm เกิด acrosome reaction**"
            ]
          }
        ]
      },
      {
        "heading": "Corpus luteum: เกิดขึ้นและจบลงอย่างไร",
        "source": "Female reproductive organ p.17-18",
        "body": [
          {
            "text": "**ลำดับหลัง ovulation: เลือดออกเข้าไปในซาก follicle กลายเป็น corpus hemorrhagicum แล้วจึงกลายเป็น corpus luteum**"
          },
          {
            "bullets": [
              "**LH จาก pituitary gland เป็นตัวเริ่ม luteinization และกระตุ้น granulosa cells ให้หลั่ง progesterone**",
              "granulosa cells เกิด hyperplasia (proliferation) และ hypertrophy (enlargement) แล้วเปลี่ยนเป็น granulosa lutein cells",
              "การสะสม yellow lipid pigment (lutein) และ lipid อื่น ๆ คือจุดที่บ่งว่าเปลี่ยนเป็น granulosa luteal cells แล้ว",
              "**เซลล์ของ theca interna ก็เปลี่ยนเป็นเซลล์สร้าง lipid เรียกว่า theca luteal cells**",
              "**ถ้ามี fertilization corpus luteum จะคงอยู่และหลั่ง progesterone ต่อ ถ้าไม่มี จะกลายเป็น corpus albican**"
            ]
          }
        ]
      },
      {
        "heading": "Atretic follicle",
        "source": "Female reproductive organ p.19",
        "body": [
          {
            "bullets": [
              "**oocyte ส่วนใหญ่ไม่เคยไปถึงระยะ maturity**",
              "follicle เสื่อมสลายได้ทุกระยะ (any stage)",
              "**nuclei ของ granulosa cells กลายเป็น pyknotic**",
              "**basement ที่กั้นระหว่าง oocyte กับ granulosa cells มักหนาตัวขึ้นกลายเป็น glassy membrane และมี fibrous material เข้ามาแทนที่ granulosa cells**"
            ]
          }
        ]
      },
      {
        "heading": "Germinal epithelium ของ ovary",
        "source": "Female reproductive organ p.21",
        "body": [
          {
            "text": "สไลด์อ้าง Wikipedia ว่า เมื่อพิสูจน์ได้แล้วว่า ovarian surface cells มี oogenic capability จึงเชื่อกันตอนนี้ว่า **oocytes อาจกำเนิดมาจากเซลล์ผิวรังไข่ได้** และคำว่า germinal epithelium ก็อาจนำกลับมาใช้ได้อย่างสมเหตุสมผล"
          },
          {
            "callout": "สไลด์เสนอเป็นประเด็นที่ยังถกกันเรื่องการใช้ชื่อ ไม่ได้สรุปชัดว่าให้ยึดคำไหนในการสอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Uterine tube (oviduct): สามส่วนและหน้าที่",
        "source": "Female reproductive organ p.22-25",
        "body": [
          {
            "text": "**แบ่งเป็น 3 ส่วน: infundibulum, ampulla, isthmus**"
          },
          {
            "text": "หน้าที่ตามสไลด์: ขนส่ง ovum และ spermatozoa และ **จัดสภาพแวดล้อมที่เหมาะสมสำหรับ fertilization** เยื่อบุประกอบด้วย ciliated cells และ secretory cells"
          },
          {
            "sub": "Infundibulum",
            "body": [
              {
                "bullets": [
                  "อยู่ใกล้ ovary รูปกรวย มีส่วนยื่นคล้ายนิ้วเรียกว่า fimbriae",
                  "**tunica mucosa กินความหนาของผนังเกือบทั้งหมด epithelium เป็น pseudostratified columnar**"
                ]
              }
            ]
          },
          {
            "sub": "Ampulla",
            "body": [
              {
                "text": "ลักษณะทาง histology คล้าย infundibulum และ **เป็นจุดที่เกิด fertilization**"
              }
            ]
          },
          {
            "sub": "Isthmus",
            "body": [
              {
                "bullets": [
                  "อยู่ใกล้ uterus",
                  "**tunica muscularis เป็นชั้นที่หนาที่สุดของผนัง ส่วน tunica submucosa บางมาก**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.25 เป็นภาพเปรียบเทียบ ampulla กับ isthmus พร้อมเลขกำกับ 1 = Ampulla, 2 = Isthmus, 3 = Infundibulum ใช้ฝึกแยกภาพได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Uterus: สามชั้นของผนัง",
        "source": "Female reproductive organ p.26",
        "body": [
          {
            "bullets": [
              "**Endometrium = tunica mucosa + tunica submucosa** epithelium เป็น simple columnar หรือ pseudostratified columnar และมี uterine glands อยู่ใน lamina propria",
              "**Myometrium = tunica muscularis เรียงเป็น inner circular และ outer longitudinal**",
              "**Perimetrium = tunica serosa เป็น loose connective tissue**"
            ]
          },
          {
            "callout": "จุดที่สไลด์ทำเครื่องหมายดาวไว้: **ใน ruminants บาง region ของ endometrium ไม่มี glands เลยและมีเส้นเลือดมาก เรียกว่า caruncle**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Uterus: ความแตกต่างระหว่างสัตว์แต่ละชนิด",
        "source": "Female reproductive organ p.27",
        "body": [
          {
            "bullets": [
              "**Stratum vasculare คือชั้นของเส้นเลือดขนาดใหญ่ที่อยู่ระหว่างชั้นกล้ามเนื้อเรียบชั้นในกับชั้นนอกของ myometrium**",
              "**ใน bitch, queen และ mare epithelium ของ tunica mucosa เป็น simple cuboidal หรือ columnar**",
              "**ใน ruminants และ sow epithelium เป็น stratified หรือ pseudostratified**",
              "Uterine glands อาจขดเป็น coiled ใน ruminants, sow และ mare"
            ]
          }
        ]
      },
      {
        "heading": "Estrous cycle: สิ่งที่เกิดหลัง ovulation",
        "source": "Female reproductive organ p.28",
        "body": [
          {
            "text": "สไลด์นี้พูดถึง estrous cycle เฉพาะช่วงหลัง ovulation เท่านั้น **progesterone เพิ่มขึ้นจาก granulosa และ theca luteal cells ทั้งใน corpus hemorrhagicum และใน corpus luteum**"
          },
          {
            "bullets": [
              "uterine epithelial cells เกิด hypertrophy ต่อเนื่อง",
              "uterine glands proliferate ต่อเนื่อง",
              "vascular supply เพิ่มขึ้นต่อเนื่อง"
            ]
          },
          {
            "callout": "เด็คไม่ได้อธิบายระยะอื่นของ estrous cycle (proestrus, estrus, diestrus, anestrus) ในเชิง endocrine ที่หน้านี้ ระยะเหล่านั้นถูกพูดถึงอีกทีเฉพาะในแง่ภาพเซลล์ที่ vaginal cytology ท้ายเด็ค",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cervix",
        "source": "Female reproductive organ p.29",
        "body": [
          {
            "bullets": [
              "มี smooth muscle และ dense connective tissue ปริมาณมาก (considerable)",
              "**T. mucosa: simple columnar epithelium ที่มี mucous-secreting cells**",
              "**T. muscularis: 2 ชั้น inner circular และ outer longitudinal**"
            ]
          }
        ]
      },
      {
        "heading": "Cervix in bitch",
        "source": "Female reproductive organ p.30-32",
        "body": [
          {
            "bullets": [
              "cervical canal เปิดทางด้าน cranial เข้าสู่ body of the uterus ที่ **internal uterine ostium**",
              "cervical canal เปิดทางด้าน caudal เข้าสู่ vagina ที่ **external uterine ostium**",
              "**lumen ของ cervix บุด้วย simple columnar epithelium แล้วเปลี่ยนเป็น stratified squamous epithelium อย่างทันทีทันใด (abruptly) ที่ external os**"
            ]
          },
          {
            "callout": "ประโยคเรื่องรอยต่อ epithelium ที่ external os ถูกเขียนซ้ำถึงสามสไลด์ติดกัน (p.30, p.31, p.32) เป็นสัญญาณว่าอาจารย์เน้นจุดนี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Vagina",
        "source": "Female reproductive organ p.33",
        "body": [
          {
            "bullets": [
              "**epithelium เป็น stratified squamous และโดยทั่วไป nonglandular**",
              "**หนาขึ้นในช่วง proestrus และ estrus และในบางชนิดโดยเฉพาะ rodent กับ carnivores epithelium จะ keratinize ในช่วง estrus**",
              "Tunica muscularis ประกอบด้วย smooth muscle สองถึงสามชั้น",
              "พบ lymphocytes และ lymphatic nodules ได้ใน connective tissue",
              "**ส่วน cranial ของ vagina มี tunica serosa ส่วน caudal ที่ใหญ่กว่ามี tunica adventitia**"
            ]
          }
        ]
      },
      {
        "heading": "Clitoris",
        "source": "Female reproductive organ p.34",
        "body": [
          {
            "bullets": [
              "**เทียบเท่ากับ penis ในเพศผู้**",
              "**non-keratinized stratified epithelium**",
              "dense connective tissue ร่วมกับ erectile tissue"
            ]
          }
        ]
      },
      {
        "heading": "Vaginal cytology: ทำไปทำไม และเซลล์อะไรบ้าง",
        "source": "Female reproductive organ p.35-37",
        "body": [
          {
            "text": "**การเปลี่ยนแปลงทาง cytology สะท้อน endocrine events ที่อยู่เบื้องหลัง cycle** ตรวจโดยการทำ vaginal smear"
          },
          {
            "sub": "Parabasal cells",
            "body": [
              {
                "bullets": [
                  "**เป็น epithelial cells ที่เล็กที่สุดที่เห็นใน vaginal smear ทั่วไป**",
                  "รูปกลมหรือเกือบกลม มี nuclear to cytoplasmic ratio สูง"
                ]
              }
            ]
          },
          {
            "sub": "Intermediate cells",
            "body": [
              {
                "bullets": [
                  "ขนาดและรูปร่างหลากหลาย",
                  "**เส้นผ่านศูนย์กลางประมาณ 2-3 เท่าของ parabasal cells**"
                ]
              }
            ]
          },
          {
            "sub": "Superficial cells",
            "body": [
              {
                "bullets": [
                  "**เป็นเซลล์ที่ใหญ่ที่สุดใน vaginal smear**",
                  "รูป polygonal และแบนชัดเจน",
                  "**nuclei ไม่มีเลย หรือเป็น pyknotic คือเล็กมากและเข้ม**",
                  "superficial cells ที่ไม่มี nucleus เรียกว่า fully cornified"
                ]
              }
            ]
          },
          {
            "sub": "เซลล์อื่นที่พบร่วม",
            "body": [
              {
                "bullets": [
                  "**Erythrocytes: พบจำนวนมากช่วง proestrus และ estrus ใน bitch บางตัว**",
                  "**Neutrophils: พบมากในช่วง early diestrus พบได้ไม่แปลกในระยะอื่น แต่พบน้อยมากในช่วง estrus**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Vaginal cytology แยกตามระยะของ cycle",
        "source": "Female reproductive organ p.38-41",
        "body": [
          {
            "sub": "Proestrus",
            "body": [
              {
                "bullets": [
                  "**ค่อย ๆ เปลี่ยนจาก intermediate และ parabasal cells ไปเป็น superficial cells**",
                  "พบ RBC รวมทั้ง neutrophils และ bacteria"
                ]
              }
            ]
          },
          {
            "sub": "Estrus",
            "body": [
              {
                "text": "**superficial cells เด่นชัด และเกือบทั้งหมดเป็น anucleate superficial cells**"
              }
            ]
          },
          {
            "sub": "Diestrus",
            "body": [
              {
                "text": "**superficial cells ลดจำนวนลง และ intermediate กับ parabasal cells กลับมาปรากฏอีกครั้ง**"
              }
            ]
          },
          {
            "sub": "Anestrus",
            "body": [
              {
                "bullets": [
                  "**intermediate และ parabasal cells เป็นเซลล์เด่นใน smear**",
                  "superficial cells ไม่พบเลยหรือพบน้อยมาก",
                  "neutrophils อาจพบหรือไม่พบก็ได้"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ทั้งสี่หน้านี้อ้างแหล่งเดียวกันและเป็นคำอธิบายภาพ smear ของสุนัข ไม่ได้ให้ค่าเปอร์เซ็นต์ของเซลล์แต่ละชนิดในแต่ละระยะ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สไลด์ที่ไม่มีข้อความให้จด",
        "source": "Female reproductive organ p.3-4, p.14-15, p.20",
        "body": [
          {
            "bullets": [
              "p.3 Female reproductive organs และ p.4 Reproductive organ position: มีแต่หัวข้อกับลิงก์อ้างอิงภายนอก เป็นสไลด์ภาพ",
              "p.14 Pre-ovulatory follicle และ p.15: เป็นภาพล้วน ไม่มีข้อความ",
              "**p.20 Oogenesis: มีแต่หัวข้อ ไม่มีคำอธิบาย สไลด์ไม่ได้บอกลำดับขั้นของ oogenesis ไว้เป็นข้อความ ต้องดูจากภาพในคาบหรือถามอาจารย์เพิ่ม**"
            ]
          }
        ]
      }
    ]
  },
  "histo--fish": {
    "topic": "histo--fish",
    "title": "Histology of Fish",
    "icon": "🔬",
    "lecturer": "Tilladit Rung-ruangkijkrai, D.V.M., Ph.D.",
    "summary": "เด็คนี้เดินจากอนุกรมวิธานและรูปร่างภายนอกของปลา ผ่าน histological techniques (การเก็บตัวอย่าง fixation processing staining) แล้วไล่ histology ทีละระบบ ตั้งแต่ skeletal integumentary muscular gills heart blood cells digestive accessory glands swim bladder ไปจนถึง sense organs lymphoid และ kidney ปิดท้ายด้วยจุดเจาะเลือด น้ำหนักของเด็คอยู่ที่ integument gills blood cells digestive tract และ lymphoid/kidney ซึ่งเขียนละเอียดที่สุด ส่วน endocrine system มีแค่ชื่อต่อม 3 ต่อมไม่มีเนื้อหาต่อ และมีสไลด์ที่เป็นรูปล้วนไม่มีข้อความอยู่หลายหน้า (หน้า 39, 54, 57, 58, 65, 73, 81, 82) จึงสรุปเป็นตัวหนังสือไม่ได้",
    "sections": [
      {
        "heading": "ปลาอยู่ตรงไหนในอนุกรมวิธาน และแบ่งเป็น 3 กลุ่ม",
        "source": "Fish p.2",
        "body": [
          {
            "text": "Phylum: **Chordata** · Subphylum: **Vertebrata** ลักษณะทางสัณฐานคือมี Head, Trunk, Tail แบบ symmetry ไม่มี limb แต่มี fins แทน"
          },
          {
            "sub": "Classification (3 กลุ่ม)",
            "body": [
              {
                "bullets": [
                  "**Agnatha** = jawless fish ไม่มี scale มี notochord ตัวอย่าง lamprey, hagfish",
                  "**Chondrichthyes** = cartilaginous fish ตัวอย่าง shark, stingray, guitar fish (โรนัน), bowmouth guitarfish",
                  "**Osteichthyes** = bony fish ตัวอย่าง tilapia, tuna, carp"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cartilaginous fish เทียบ Bony fish",
        "source": "Fish p.3-4",
        "body": [
          {
            "sub": "Cartilaginous fish",
            "body": [
              {
                "bullets": [
                  "โครงร่างเป็น cartilaginous skeleton ลำตัวแบน **dorso-ventrally flattened**",
                  "**5 pairs of gill slits** (+ spiracle) เห็นเป็นช่องเปิดโดยตรง",
                  "Mouth ใหญ่ อยู่ใต้หัว (underside of the head)",
                  "เกล็ดเป็น dermal **placoid scales**",
                  "มี **cloaca** (urinary & genital) และ **ไม่มี swim bladder**",
                  "ไข่จำนวนน้อย ฟองใหญ่ yolk มาก · Ovoviviparous (develop internally) หรือ Oviparous (develop externally in egg)"
                ]
              }
            ]
          },
          {
            "sub": "Bony fish",
            "body": [
              {
                "bullets": [
                  "โครงร่างเป็น bony skeleton ลำตัวแบน **laterally flattened**",
                  "**5 pairs of gills** ถูกคลุมป้องกันด้วย **operculum**",
                  "Mouth อยู่ที่หรือใกล้ปลาย snout",
                  "เกล็ดซ้อนเหลื่อมกัน (overlapping scales)",
                  "มี **swim bladder** ใช้รักษาระดับความลึกให้คงที่ และ **ไม่มี cloaca**",
                  "Spawn ไข่จำนวนมาก ฟองเล็ก yolk น้อย ปล่อยกระจายใน water column"
                ]
              }
            ]
          },
          {
            "callout": "จุดจำง่าย ๆ คือทิศทางที่ลำตัวแบน cartilaginous fish แบนบนลงล่าง ส่วน bony fish แบนด้านข้าง และ cloaca มีเฉพาะฝั่ง cartilaginous",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Body morphology และรูปทรงลำตัว",
        "source": "Fish p.5-7",
        "body": [
          {
            "sub": "แบ่งลำตัวเป็น 3 ส่วนด้วยหลักหมุดที่ชัดเจน",
            "body": [
              {
                "bullets": [
                  "**Head**: Snout ถึง Operculum ประกอบด้วย snout, mouth, nostril (olfactory sac), eyes, operculum",
                  "**Trunk**: Operculum ถึง Anus มี pectoral, dorsal, pelvic/ventral fins และ urogenital pore/urinary pore + female genital pore",
                  "**Tail**: Anus ถึง Caudal fin มี anus, anal fin, caudal fin"
                ]
              }
            ]
          },
          {
            "sub": "Shape and body",
            "body": [
              {
                "bullets": [
                  "**Fusiform** รูปร่างปกติคล้ายลูกศร ว่ายเร็วมาก เช่น tuna, salmon, seabass · เด็คจัดเป็นพวก fast @ long distance",
                  "**Anguiculiform/snake shape** ลำตัวยาว เช่น eel",
                  "**Taeniform** รูปริบบิ้น ว่ายช้า เช่น scabbard fish (ปลาดาบเงิน)",
                  "**Compressiform** แบนด้านข้าง เช่น pompadour, butterfly fish · fast @ short distance",
                  "**Depressiform/flattened** แบนบนลงล่าง เช่น stingray · เคลื่อนที่แบบ flying like bird",
                  "**Globiform** เช่น globefish",
                  "**Filiform** คล้ายเส้นด้าย · ตารางหน้า 7 ยก eel เป็นตัวอย่าง เคลื่อนที่แบบ move like snake"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 6 จัด eel เป็น Anguiculiform แต่ตารางหน้า 7 ใส่ eel ไว้ในช่อง Filiform สไลด์ไม่ได้อธิบายว่าสองคำนี้ต่างกันตรงไหน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ลำดับช่วงชีวิตของปลา",
        "source": "Fish p.8",
        "body": [
          {
            "text": "**Egg → Embryo → Larva → Fry → Fingering → Adult fish** สไลด์ให้มาเป็นลำดับเปล่า ๆ ไม่ได้บอกอายุหรือขนาดของแต่ละช่วง"
          }
        ]
      },
      {
        "heading": "Histological techniques ตั้งแต่เก็บตัวอย่างถึง coverslipping",
        "source": "Fish p.9-13",
        "body": [
          {
            "text": "ลำดับงานทั้งหมดคือ Sample collection → Fixation → Tissue Processing (dehydration and infiltration of tissue) → Embedding → Sectioning tissue → Staining → Coverslipping"
          },
          {
            "sub": "Sample collection",
            "body": [
              {
                "bullets": [
                  "เก็บจากปลาที่ **freshly dead** ไม่ใช่ปลาแช่แข็งหรือปลาที่ตายมานาน (Extremely Dead)",
                  "ปริมาตรชิ้นเนื้อ **ไม่เกิน 1/10 ของปริมาตร fixative**",
                  "ใส่ใน fixative ที่เหมาะสม และติดฉลาก"
                ]
              }
            ]
          },
          {
            "sub": "Fixation",
            "body": [
              {
                "bullets": [
                  "**Fry** fix ได้ทั้งตัว",
                  "**Fingerlings และเล็กกว่านั้น** ตัด gill opercula ออก ผ่าตามแนว midline และดึง viscera ออก",
                  "**ปลาใหญ่** เก็บตัวอย่างในภาคสนาม ชิ้นเนื้อ **หนาไม่เกิน 3 mm**",
                  "Fixative ที่ใช้แพร่หลายที่สุดคือ **Formalin** ซึมได้ 2 mm ใน 4 ชั่วโมง และ 10 mm ใน 24 ชั่วโมง จุดเด่นคือ **ไม่เกิด overfixation**"
                ]
              }
            ]
          },
          {
            "sub": "Staining",
            "body": [
              {
                "bullets": [
                  "**H&E** ใช้บ่อยที่สุด สกัดจาก heartwood ของ logwood trees ย้อมติดองค์ประกอบของเนื้อเยื่อ เช่น nuclei, mitotic structures, mitochondria",
                  "**Giemsa** (สไลด์สะกด Geimsa) ใช้ดู blood, bacteria and parasites"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Skeleton: skull, vertebrae, ribs",
        "source": "Fish p.16-18",
        "body": [
          {
            "text": "โครงกระดูกที่เด็คไล่คือ Skull, Vertebrae, Ribs และ Fin"
          },
          {
            "sub": "Vertebrae",
            "body": [
              {
                "bullets": [
                  "**Centrum**",
                  "**Vertebral arches** ได้แก่ neural arch และ hemal arch/chevron (พบใน caudal vertebrae)",
                  "**Processes**"
                ]
              }
            ]
          },
          {
            "sub": "Ribs มี 2 ชุด",
            "body": [
              {
                "bullets": [
                  "**Ventral (pleural) ribs** วางชิดกับ bony cavity",
                  "**Dorsal ribs** อยู่ลึกกว่า ฝังอยู่ใน **myosepta** ของ body wall"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Fin: โครงสร้าง spines กับ rays และชนิดของครีบ",
        "source": "Fish p.19-21",
        "body": [
          {
            "bullets": [
              "Fin เป็นลักษณะเด่นที่สุดของปลา และ **ไม่ต่อกับ spine โดยตรง ยกเว้น tail fin** ครีบอื่นถูกพยุงด้วยกล้ามเนื้อเท่านั้น",
              "ตำแหน่งที่ต่างกันให้หน้าที่ต่างกัน ทั้งเคลื่อนที่ไปข้างหน้า เลี้ยว และรักษาลำตัวให้ตั้งตรง",
              "Function: swim, gliding หรือ crawling (flying fish และ frogfish)"
            ]
          },
          {
            "sub": "Spines กับ Rays",
            "body": [
              {
                "bullets": [
                  "ครีบประกอบด้วย **bony Spines** หรือ **soft Rays** ที่ยื่นออกจากลำตัว มีผิวหนังคลุมและเชื่อมเข้าด้วยกัน",
                  "**Spines** แข็ง แหลม และ unsegmented ใช้ป้องกันตัว และใช้ล็อกตัวเองในซอกหินไม่ให้ถูกดึงออก",
                  "**Rays** นุ่ม ยืดหยุ่น **segmented** และอาจแตกแขนง"
                ]
              }
            ]
          },
          {
            "sub": "Pair fins",
            "body": [
              {
                "bullets": [
                  "**Pectoral fins** อยู่หลัง operculum · **homologous กับ forelimbs**",
                  "**Pelvic/ventral fins** อยู่ด้านล่างและถัดจาก pectoral fins · **homologous กับ hindlimbs** · ใช้ขึ้นลง เลี้ยวหักศอก และหยุดเร็ว"
                ]
              }
            ]
          },
          {
            "sub": "Single fin",
            "body": [
              {
                "bullets": [
                  "**Dorsal fins** อยู่บนหลัง มี 1-3 อัน กันปลาม้วนตัว (rolling) ตอนเลี้ยวกะทันหันและตอนหยุด",
                  "**Anal/cloacal fin** อยู่ด้านท้องถัดจาก anus/cloaca ช่วยทรงตัวขณะว่าย",
                  "**Caudal fin** คือหาง",
                  "**Adipose fin** ไม่มีในหลายวงศ์ ลักษณะนุ่มเป็นเนื้อ อยู่บนหลังหลัง dorsal fin และอยู่หน้า caudal fin พบใน salmon และ catfish"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Caudal fin: 4 แบบตามแนว vertebrae และ subtype ของ homocercal",
        "source": "Fish p.22-23",
        "body": [
          {
            "text": "Caudal fin เกาะที่ปลาย **caudal peduncle** ซึ่งเป็นส่วนคอดของลำตัวที่หางติดอยู่ แบ่งตามการทอดของ vertebrae ได้ 4 แบบ"
          },
          {
            "bullets": [
              "**Heterocercal**: vertebrae ทอดเข้าไปใน upper lobe ทำให้พูบนยาวกว่า พบใน shark · ส่วน **Hypocercal** พูล่างยาวกว่า พบใน Anaspida",
              "**Protocercal**: vertebrae ทอดถึงปลาย สมมาตรแต่ไม่แผ่ขยาย พบใน amphioxus",
              "**Diphycercal**: vertebrae ทอดถึงปลาย สมมาตรและแผ่ขยาย พบใน lungfish, lamprey และ coelacanth",
              "**Homocercal**: พบในปลากระดูกแข็งส่วนใหญ่ ดูเผิน ๆ สมมาตร แต่จริง ๆ vertebrae ทอดเข้า upper lobe เพียงสั้นมาก"
            ]
          },
          {
            "sub": "Subtype ของ Homocercal",
            "body": [
              {
                "bullets": [
                  "**Rounded** ปลายมน ว่ายเร็วในระยะสั้น",
                  "**Truncated** ปลายตัดเป็นแนวดิ่ง เช่นใน salmon",
                  "**Emarginate** เว้าเข้าเล็กน้อย",
                  "**Forked** แยกเป็นสองแฉก",
                  "**Lunate**",
                  "**Continuous** ต่อเนื่องกับ dorsal และ anal fin เช่นใน eels"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Scales: 4 ชนิดหลัก และโครงสร้าง 2 ชั้น",
        "source": "Fish p.24-25, 29",
        "body": [
          {
            "bullets": [
              "เกล็ดกำเนิดจาก **mesoderm (skin)** คล้ายกับฟัน เป็นแผ่นแข็งเล็ก ๆ ที่งอกออกจากผิวหนัง",
              "หน้าที่: camouflage จากผู้ล่าโดยการสะท้อนแสงและสี และให้ hydrodynamic advantages"
            ]
          },
          {
            "sub": "4 principal types",
            "body": [
              {
                "bullets": [
                  "**Placoid scales (dermal denticles)** คล้ายฟัน ทำจาก **dentin ที่คลุมด้วย enamel** พบใน cartilaginous fish (sharks and rays)",
                  "**Ganoid scales** multi-layered mineralized แบน ดูเป็นฐาน คลุมลำตัวโดยซ้อนเหลื่อมกันน้อย เป็นแบบฉบับของ gar",
                  "**Cycloid scales** รูปไข่เล็ก ๆ มี growth rings ผิวเรียบ ขอบนอกเรียบ พบมากที่สุดในปลาที่มี soft fin rays เช่น salmon, carp",
                  "**Ctenoid scales** เหมือน cycloid แต่มีหนามเล็ก ๆ (**spinules**) เรียงตามขอบ"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างของเกล็ดในทางจุลกายวิภาค",
            "body": [
              {
                "bullets": [
                  "**Outer osseous layer** สร้างโดยเซลล์ที่มีลักษณะคล้าย osteoblasts",
                  "**Inner fibrous layer** ประกอบด้วย collagenous fibers ที่สร้างโดย fibroblasts"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Integumentary system: Epidermis และเซลล์พิเศษ 3 ชนิด",
        "source": "Fish p.26",
        "body": [
          {
            "bullets": [
              "ผิวหนังเป็นเปลือกนอกของร่างกาย ป้องกันสารและอิทธิพลที่ทำอันตราย แบ่งเป็น **Epidermis** และ **Dermis**",
              "Epidermis คลุมผิวลำตัวรวมถึงหางและครีบ เป็น **stratified squamous epithelium** และถูกคลุมด้วยชั้น **mucopolysaccharide**"
            ]
          },
          {
            "sub": "Specific accessory organs ใน epidermis",
            "body": [
              {
                "bullets": [
                  "**Mucous gland cells (goblet cells)** อยู่ชั้นกลางของ epidermis",
                  "**Club cells (alarm cells)** เซลล์กลมขนาดใหญ่ อยู่ชั้นล่างและชั้นกลางของ epidermis หลั่ง **alarm substance** ที่แรงลงในน้ำเมื่อผิวหนังบาดเจ็บ เป็นสัญญาณเตือน",
                  "**Granule cells** บรรจุสาร (oil droplets) ที่เป็นพิษปล่อยลงน้ำ",
                  "เซลล์อื่น ๆ ได้แก่ lymphocytes, macrophages เป็นต้น"
                ]
              }
            ]
          },
          {
            "callout": "Club cell เป็นคำที่ต้องผูกกับ alarm substance ให้ได้ทันที",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Dermis 2 ชั้น และการเปลี่ยนสี",
        "source": "Fish p.27-28, 30",
        "body": [
          {
            "text": "Dermis อยู่ระหว่าง epidermis กับกล้ามเนื้อที่อยู่ข้างใต้ ประกอบด้วย connective tissue ที่จัดเรียงซับซ้อน **2 ชั้น**"
          },
          {
            "bullets": [
              "**Stratum spongiosum** ชั้นบน (นอก) เป็นร่างแหของ collagen, fibroblasts, pigment cells, phagocytic cells และมี **scale bed กับ scales** อยู่ในชั้นนี้",
              "**Stratum compactum** อยู่ถัดลงมา เป็น collagenous dense matrix ให้ความแข็งแรงแก่ผิวหนัง"
            ]
          },
          {
            "sub": "Colour change",
            "body": [
              {
                "bullets": [
                  "การเปลี่ยนสีพัฒนาสูงมากในปลา เพื่อกลมกลืนกับสิ่งแวดล้อม หรือเกี่ยวข้องกับ sexual activity",
                  "ถูกเหนี่ยวนำโดย chromophores ได้แก่ **Melanophores** (เซลล์ที่มี melanin pigment) และ **Lipophores** (เซลล์ที่มี soluble pigment) ซึ่งแยกเป็น **Erythrophores** (เม็ดสีแดง) และ **Xanthophores** (เม็ดสีเหลือง)"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างที่ต้องชี้ได้ในภาพตัดขวางผิวหนัง (สไลด์หน้า 30)",
            "body": [
              {
                "bullets": [
                  "squamous epithelial cells, mucous cells, cuboidal epithelial cells",
                  "alarm cell (club cell)",
                  "scale pocket และ scale",
                  "dermis (stratum compactum)",
                  "skeletal muscle",
                  "chromatophores (melanocytes)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Muscular system",
        "source": "Fish p.31",
        "body": [
          {
            "bullets": [
              "**Skeletal (striated) muscle** เป็น voluntary",
              "**Cardiac muscle** เป็น involuntary เส้นผ่านศูนย์กลาง **6 μm ประมาณครึ่งหนึ่งของ mammal**",
              "**Smooth muscle** เป็น involuntary"
            ]
          }
        ]
      },
      {
        "heading": "Gills: องค์ประกอบและเซลล์บน lamella",
        "source": "Fish p.32-35",
        "body": [
          {
            "bullets": [
              "เป็นอวัยวะหายใจ ทำ oxygenation ของเลือด คือดึง O2 จากน้ำและขับ CO2",
              "อยู่ใต้ **operculum** จึงมักมองไม่เห็นจากภายนอก ยกเว้นใน shark ที่เห็นได้",
              "นอกจากหายใจยังควบคุมสมดุล **salt + water exchange** และ nitrogenous waste",
              "Breathing: น้ำเข้าทางปาก ผ่าน gills แล้วออกทาง opercula"
            ]
          },
          {
            "sub": "องค์ประกอบ",
            "body": [
              {
                "bullets": [
                  "**Gill arch**",
                  "**Gill rakers** เป็นกระดูกหรือกระดูกอ่อน รูปนิ้วมือ ทำหน้าที่กรองเหยื่อไว้ใน filter-feeders",
                  "**Gill filaments**",
                  "**Gill lamellae** เรียงเป็นซี่หวีบน filament เพื่อ **เพิ่มพื้นที่ผิว**"
                ]
              }
            ]
          },
          {
            "sub": "Histology ที่ต้องแยกให้ออก",
            "body": [
              {
                "bullets": [
                  "**Gill filament** = primary lamella คลุมด้วย **stratified squamous epithelium**",
                  "**Gill lamella** อยู่ทั้งสองด้านของ filament เป็น **simple epithelium**",
                  "**Pillar cells** ทำหน้าที่ค้ำ lamella",
                  "**Chloride cell** ทำหน้าที่ osmoregulatory จึงเรียกว่า **ionocyte** เป็นเซลล์ขนาดใหญ่อยู่ที่ฐานของ lamella",
                  "โครงสร้างที่ต้องชี้ในภาพ: epithelial cell, pillar cell, capillary, chloride cell (สไลด์เขียน chloroid cell) พร้อม RBC ใน capillary"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cardiovascular system: หัวใจและทางเดินเลือด",
        "source": "Fish p.36-38, 40",
        "body": [
          {
            "bullets": [
              "เลือดจากหัวใจไปที่ gill แล้วถูก oxygenate โดย **diffusion** ที่ gill lamellae",
              "จำนวนห้องหัวใจเทียบข้าม class: **ปลา 2 ห้อง**, amphibian และ reptile ส่วนใหญ่ 3 ห้อง, mammal และ bird 4 ห้อง"
            ]
          },
          {
            "sub": "หัวใจปลาแบ่งเป็น 4 compartments",
            "body": [
              {
                "bullets": [
                  "**Sinus venosus** ถุงผนังบาง รับเลือดจาก hepatic และ common cardinal veins",
                  "**Atrium** ผนังหนากว่า เป็น muscular chamber",
                  "**Ventricle** ผนังหนา เป็น muscular chamber",
                  "**Bulbus arteriosus** ส่งเลือดออกไปที่ gills"
                ]
              },
              {
                "text": "ทางเดินคือ HEART → Gills → Body โดย **เลือดที่ผ่าน gill แล้วไม่กลับเข้าหัวใจก่อนไปเลี้ยงร่างกาย** ลำดับหลอดเลือดที่สไลด์เขียนคือ ventral aorta → afferent branchial artery → efferent branchial artery → dorsal aorta และเลือดกลับทาง hepatic + common cardinal vein"
              }
            ]
          },
          {
            "sub": "ชั้นของผนังหัวใจและหลอดเลือด",
            "body": [
              {
                "bullets": [
                  "หัวใจ: **Endocardium** (epithelial cells และ CNT), **Myocardium** (สไลด์ระบุ CNT ที่ sinus venosus), **Epicardium** (simple flat epithelium + CNT)",
                  "หลอดเลือด (arteries, veins, capillaries): **Tunica intima** (endothelial cell, CNT), **Tunica media** (smooth muscle, CNT), **Tunica externa**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์บอกทั้ง 2 chambers และ 4 compartments ในเด็คเดียวกันโดยไม่ได้อธิบายว่าขัดกันหรือไม่",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Blood cells ของปลา",
        "source": "Fish p.41-45",
        "body": [
          {
            "text": "เลือดคิดเป็นประมาณ **5% ของน้ำหนักตัว** แบ่งเป็น Erythrocytes, Leukocytes และ Thrombocytes"
          },
          {
            "sub": "Erythrocytes",
            "body": [
              {
                "bullets": [
                  "รูป **ovoid และมี nucleus อยู่กลางเซลล์**",
                  "ขนาด **10-11 μm** ส่วน nucleus 4-5 μm",
                  "จำนวน **1.05-3.0 × 10⁶ /mm³**"
                ]
              }
            ]
          },
          {
            "sub": "Leukocytes",
            "body": [
              {
                "bullets": [
                  "**Agranulocyte** ได้แก่ lymphocyte, monocyte · **Granulocyte** ได้แก่ neutrophil, eosinophil, basophil",
                  "ที่พบบ่อยคือ **Lymphocytes และ Neutrophil**",
                  "**Lymphocytes**: ขนาด 1/3 ถึง 1/2 ของ erythrocyte (5-9 microns) nucleus อยู่กลาง กลม/รี ใหญ่ chromatin เข้ม ติดสีน้ำเงินเข้ม cytoplasm มี pale perinuclear zone สัดส่วน **70-90% (48 × 10³ /mm³)**",
                  "**Neutrophils**: ใหญ่กว่า erythrocyte nucleus กลม/รี อยู่เยื้องศูนย์ (ตัวอ่อนรูป kidney ตัวแก่แบ่ง 2-3 lobed) สัดส่วน **6-8% (3-6 × 10³ /mm³) เท่ากับใน mammals**",
                  "**Monocytes** พัฒนาไปเป็น macrophages คิดเป็น **0.1%** ของ leukocyte ทั้งหมด cytoplasm มี pseudopodia และ Golgi apparatus พัฒนาดี nucleus อยู่เยื้องศูนย์"
                ]
              }
            ]
          },
          {
            "sub": "Thrombocytes",
            "body": [
              {
                "bullets": [
                  "พบได้บ่อย รูป **spindle หรือ ellipsoidal** สั้นกว่า erythrocyte",
                  "Nucleus chromatin เข้ม ติดสี dark violet · cytoplasm น้อยมาก ติดสีฟ้าอ่อน",
                  "จำนวน **60,000 ถึง 70,000 /mm³**"
                ]
              }
            ]
          },
          {
            "callout": "เรื่อง Eosinophils, Basophils และ Mast cells สไลด์ตั้งคำถามค้างไว้ว่ามีหรือไม่มีในปลา (presence or absence ???) และบอกว่า eosinophil เป็นตัวที่สับสนกันมาก ส่วน mast cell คล้ายของ mammals และพบเป็น numerous granular cells ที่ intestine, dermis, gills สไลด์ไม่ได้ให้ข้อสรุป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Digestive tract: ปาก 3 แบบ และผนัง 4 ชั้น",
        "source": "Fish p.46-51",
        "body": [
          {
            "text": "ทางเดินอาหารคือ Mouth ถึง Anus โดยมี associated glands คือ liver และ pancreas ซึ่งอยู่นอกทางเดินอาหารและส่งสารคัดหลั่งเข้าระบบท่อ"
          },
          {
            "sub": "Mouth 3 general types",
            "body": [
              {
                "bullets": [
                  "**Terminal mouths** ชี้ตรงไปข้างหน้า พบเป็นส่วนใหญ่ กินได้ทั้งพืชและสัตว์ (omnivore)",
                  "**Superior (supra-terminal) mouths** เชิดขึ้น กินแมลงและปลาที่ว่ายใกล้ผิวน้ำ",
                  "**Inferior (sub-terminal) mouths** ชี้ลง เป็นพวก bottom feeders มักมี barbels ช่วยหาอาหาร พบในวงศ์ catfish และพวก sucker mouth กิน algae, invertebrates (snails), detritus",
                  "ปลานักล่ามีปากใหญ่ที่สุดและมีฟันใหญ่คม ยืดออกไปงับเหยื่อได้ และมี **pharyngeal teeth** ไว้จับและกลืนเหยื่อ"
                ]
              }
            ]
          },
          {
            "sub": "ผนังทางเดินอาหาร 4 ชั้น",
            "body": [
              {
                "bullets": [
                  "**Mucosa**: Epithelium, Lamina propria, Muscularis mucosae",
                  "**Submucosa**: areolar CNT, blood vessels และ nerves ทำให้ mucosa ขยับได้",
                  "**Muscularis**: smooth muscle **inner circular / outer longitudinal** ใช้ดันอาหารด้วย peristalsis และผสมอาหารกับเอนไซม์",
                  "**Adventitia**: dense CNT + blood vessels, nerves, lymph · ถ้าถูกคลุมด้วย peritoneum จะเรียกว่า serosa"
                ]
              }
            ]
          },
          {
            "sub": "Histology รายส่วนต้นทางเดินอาหาร",
            "body": [
              {
                "bullets": [
                  "**Lip**: stratified squamous epithelium",
                  "**Tongue**: แกนเป็น CNT (+ smooth muscle) ผิวเป็น stratified epithelium ที่มี goblet cells จำนวนมาก",
                  "**Oral cavity**: non-keratinized stratified squamous epithelium + ชั้นฐานเป็น cuboidal/columnar germinativum",
                  "**Pharynx**: ติดต่อกับ gill chamber มี **taste bud** เยื่อบุเป็น non-keratinized stratified squamous epithelium + cuboidal/columnar basal + goblet cells",
                  "**Esophagus**: goblet cells พัฒนาดีมาก และมี tunica muscularis แบบ circular/longitudinal"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Stomach, intestine และ anus",
        "source": "Fish p.52-58",
        "body": [
          {
            "sub": "Stomach",
            "body": [
              {
                "bullets": [
                  "**Cardia** ผนังหนา มี mucosal gland",
                  "**Fundus** มี gastric gland",
                  "**Pylorus** มี gastric gland จำนวนมาก และ mucosa บาง",
                  "**Pyloric caeca** พบในบางชนิด เป็น diverticula ที่แยกจากรอยต่อ stomach กับ intestine โครงสร้างคล้าย intestine ทำหน้าที่ย่อยและดูดซึม"
                ]
              }
            ]
          },
          {
            "sub": "Intestine",
            "body": [
              {
                "bullets": [
                  "ความยาว **ขึ้นกับอาหาร** ปลากินเนื้อ (predacious) ลำไส้สั้น ปลากินพืช (herbivorous) ลำไส้ยาว",
                  "แบ่งเป็น 2 ส่วนแต่ไม่ชัดเจน: small intestine (anterior/proximal) เป็น simple columnar epithelium และ large intestine (posterior/distal) มี goblet cells จำนวนมาก",
                  "**Shark ไม่มี small intestine** แต่ใช้ **spiral intestine** เชื่อม stomach กับ rectum เพื่อเพิ่มพื้นที่ผิวและย่อยได้มีประสิทธิภาพ"
                ]
              }
            ]
          },
          {
            "sub": "ผนัง intestine ที่ต่างจากสัตว์บก",
            "body": [
              {
                "bullets": [
                  "**T. Mucosa** พับเป็นคลื่น เยื่อบุด้านหน้าเป็น simple columnar มี microvilli ส่วนด้านหลังมี goblet cell จำนวนมาก · lamina propria เป็น loose connective tissue **ไม่มี muscularis mucosae**",
                  "**ไม่มี T. submucosa**",
                  "**T. Muscularis** inner circular และ outer longitudinal",
                  "**Serosa**"
                ]
              }
            ]
          },
          {
            "sub": "Anus",
            "body": [
              {
                "bullets": [
                  "เป็นรูเปิดปลายสุด มี mucous cells มาก",
                  "T. muscularis inner circular / outer longitudinal โดย **circular muscle พัฒนาขึ้นเป็น sphincter**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่ายคือลำไส้ปลาไม่มีทั้ง muscularis mucosae และ submucosa ต่างจากผนังทางเดินอาหารมาตรฐาน 4 ชั้นที่สไลด์หน้า 48 วางไว้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Accessory digestive organs: gallbladder, liver, pancreas",
        "source": "Fish p.59-62",
        "body": [
          {
            "sub": "Gallbladder",
            "body": [
              {
                "bullets": [
                  "เป็น diverticulum ปลายตัน รูป pear-shape"
                ]
              }
            ]
          },
          {
            "sub": "Liver",
            "body": [
              {
                "bullets": [
                  "เป็น **อวัยวะที่ใหญ่ที่สุด** เป็นต่อมใหญ่ที่อยู่ถัดจากผิวหนัง เจริญเป็น outgrowth ของ foregut และทอดไปตามทางเดินอาหาร",
                  "หน้าที่: detoxification, protein และ enzyme synthesis",
                  "**Hepatocytes ไม่ได้เรียงเป็น cords ที่ชัดเจน** แต่เป็นร่างแหคล้ายฟองน้ำของเซลล์ polyhedral ขนาดใหญ่ร่วมกับ reticular fibers",
                  "Nucleus ติดสีเข้ม cytoplasm เป็น granular · **Sinusoid** เป็นช่องหลอดเลือดที่ขยายไม่สม่ำเสมอและซึมผ่านได้"
                ]
              }
            ]
          },
          {
            "sub": "Pancreas",
            "body": [
              {
                "bullets": [
                  "มีทั้งส่วน exocrine และ endocrine",
                  "**ตำแหน่งแปรผันมาก** ได้แก่ ฝังอยู่ใน liver จนกลายเป็น **hepatopancreas**, กระจายไปตาม intestine, เป็นชั้น subcapsular ของ spleen หรืออยู่รอบ hepatic portal vein"
                ]
              }
            ]
          },
          {
            "callout": "เพราะ pancreas ฝังอยู่ในตับได้ ภาพตัดที่เห็นบนสไลด์จึงถูกเรียกว่า liver + pancreas รวมกัน อย่าตกใจถ้าเห็น exocrine acini ปนอยู่ในเนื้อตับ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Swim bladder และกลไกควบคุมการลอยตัว",
        "source": "Fish p.63-65",
        "body": [
          {
            "bullets": [
              "เป็นถุงผนังบางที่บรรจุแก๊ส อยู่ **dorsal ต่อทางเดินอาหาร** ทำหน้าที่ควบคุม buoyancy ให้ปลาลอยอยู่ได้โดยไม่เปลืองพลังงานในการว่าย",
              "**พบเฉพาะใน bony fishes** และ **ไม่มีในปลาที่ว่ายเร็ว** เช่น tuna และ mackerel",
              "เกี่ยวข้องกับ equilibration และ hydrostasis โดยมีการถ่ายเท O2 ระหว่าง swim bladder กับเลือด"
            ]
          },
          {
            "sub": "3 functional components",
            "body": [
              {
                "bullets": [
                  "**Oval gland** อยู่ด้าน dorsal ทำหน้าที่ให้ O2 เคลื่อนจาก swim bladder เข้าสู่เลือด",
                  "**Gas gland** อยู่ด้าน ventral มีชั้น epithelium หนาของ gas gland cells ร่วมกับ rete mirabile",
                  "**Rete mirabile** เป็นกลุ่ม arterial และ venous capillaries ทำให้เลือดอุ่น",
                  "Gas gland cells ทำให้เลือดเป็นกรดด้วย **lactic acid** จึงปล่อย O2 เข้า lumen ทำให้ **ปริมาตร swim bladder เพิ่มขึ้น**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Reproductive system และ Endocrine system",
        "source": "Fish p.66-67",
        "body": [
          {
            "sub": "Testes",
            "body": [
              {
                "bullets": [
                  "เป็น **paired organs** อยู่ที่ dorsal abdominal wall **ใต้ swim bladder**",
                  "ประกอบด้วย **seminiferous tubules** ซึ่งเป็น tubules หรือ blind sacs",
                  "บุด้วย spermatogenic epithelium เป็นที่ maturation ของ male gamete และสร้าง spermatocyte"
                ]
              }
            ]
          },
          {
            "sub": "Ovary",
            "body": [
              {
                "bullets": [
                  "**Follicle** คือกลุ่มของ ova รวมกับ epithelial cells",
                  "**Oogonia** สร้าง oocyte"
                ]
              }
            ]
          },
          {
            "callout": "Endocrine system ในเด็คนี้มีเพียงรายชื่อต่อม 3 ต่อมคือ Pituitary, Thyroid Gland และ Adrenal Gland สไลด์ไม่ได้บอกลักษณะทางจุลกายวิภาคหรือหน้าที่ของต่อมเหล่านี้เลย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Sense organs: barbels, eye, lateral line",
        "source": "Fish p.68-73",
        "body": [
          {
            "text": "อวัยวะรับความรู้สึกที่เด็คไล่คือ Eye, Olfactory, Barbels, Lateral line และ Pineal Organ โดยมีรายละเอียดเฉพาะ barbels, eye และ lateral line ส่วน olfactory และ pineal organ สไลด์ให้ไว้แค่ชื่อ"
          },
          {
            "sub": "Barbels",
            "body": [
              {
                "bullets": [
                  "เป็นอวัยวะรับความรู้สึกเรียวคล้ายหนวด อยู่ใกล้ปาก",
                  "พบใน catfish, carp, goatfish, zebrafish และ shark บางชนิด",
                  "**เป็นที่อยู่ของ taste buds** ใช้หาอาหารในน้ำขุ่น"
                ]
              }
            ]
          },
          {
            "sub": "Eye",
            "body": [
              {
                "bullets": [
                  "**ไม่มี outer eyelid** แต่มี nictitating membrane ในฉลามบางชนิด และมีฟิล์มบางใสคลุมป้องกันตา",
                  "**Lens ค่อนข้างกลม (spherical) และไม่ยืดหยุ่น (inelastic)**",
                  "การโฟกัสต่างจากสัตว์บก: นกและสัตว์เลี้ยงลูกด้วยนมเปลี่ยนรูปร่างของ lens แต่ **ปลาเลื่อน lens เข้าออกจาก retina**",
                  "Cornea มี refractive index ใกล้เคียงน้ำ · Retina เป็นเนื้อเยื่อไวแสง มีชั้นของ nervous tissue, rod และ cone cells, ชั้น black pigmented และแบ่งได้ **8 specific layers**",
                  "**Choroid gland** เป็นร่างแห capillary ใต้ sclera ทำหน้าที่เลี้ยง retina และหลั่ง oxygen ให้ retina มีระดับออกซิเจนสูง",
                  "โครงสร้างที่ต้องชี้ในภาพ: retina, optic nerve, lens, iris, cornea, corneal epithelium, choroid gland"
                ]
              }
            ]
          },
          {
            "sub": "Lateral line",
            "body": [
              {
                "bullets": [
                  "เป็นอวัยวะรับความรู้สึกที่ตรวจจับ **movement และ vibration** ของน้ำรอบตัว",
                  "เป็นแนวของ receptors ที่ทอดยาวตามลำตัวทั้งสองข้าง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Lymphoid system, Spleen และ Melanomacrophage center",
        "source": "Fish p.74-78",
        "body": [
          {
            "sub": "Hematopoietic tissues ของปลาต่างจากสัตว์บก",
            "body": [
              {
                "bullets": [
                  "**ไม่มี lymph nodes** และ **ไม่มี medullary cavity ของ bone marrow**",
                  "เนื้อเยื่อสร้างเม็ดเลือดจึงอยู่ที่ stroma ของ spleen, interstitium ของ kidney, periportal areas ของ liver และ thymus"
                ]
              }
            ]
          },
          {
            "sub": "Spleen",
            "body": [
              {
                "bullets": [
                  "เป็น accessory hematopoietic organ ปกติมีอันเดียว บางชนิดแยกเป็นสองอันหรือมากกว่า",
                  "อยู่ใน mesentery ใกล้ greater curvature ของ stomach หรือใกล้ flexure ของ intestine",
                  "หน้าที่: **ตัวกรองหลักของระบบไหลเวียน**, ทำลายเซลล์ และเก็บสำรอง erythrocyte · เป็นอวัยวะที่มีลักษณะคล้าย lymph node",
                  "ในปลาสุขภาพดีมีสี **แดงเข้มหรือดำ** การผ่าซากจึงจำเป็นเพื่อดู size, color และ texture",
                  "**Capsule** เป็น thin squamous epithelium + CNT คลุมด้วย serous membrane",
                  "**Red pulp** เป็น sinusoid ที่มี erythrocyte, erythroblast และ macrophage · **White pulp** มี basophilic reticular cell, lymphocyte และ macrophage",
                  "สไลด์เตือนว่า pancreas อาจวางตัวเป็นชั้น subcapsular ของม้ามได้"
                ]
              }
            ]
          },
          {
            "sub": "Melanomacrophages และ Melanomacrophage Center (MMC)",
            "body": [
              {
                "bullets": [
                  "**Melanomacrophages** คือ phagocytes ที่มี pigment อยู่ภายใน เมื่อรวมกลุ่มเป็นก้อนเรียก **Melanomacrophage Center** พบใน **spleen, kidney และ liver**",
                  "จัดการ endogenous materials เช่น erythrocytes (iron recycling)",
                  "จัดการ exogenous materials ได้แก่ debris clearance และเก็บสะสมระยะยาวของสารที่ย่อยไม่ได้ สารพิษ และ infectious materials",
                  "เป็นเซลล์ที่ phagocytic อย่างดุดัน เข้าจัดการ bacteria, fungi และไข่ของ helminth parasite",
                  "MMC ถูกเทียบว่าคล้าย **germinal center** และใช้เป็น **indicator ของการอักเสบ ความเครียดหลังติดเชื้อแบคทีเรียหรือไวรัส และ environmental stress**",
                  "**Melanin มีคุณสมบัติ antimicrobial**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Kidney: อวัยวะภูมิคุ้มกันหลักของปลากระดูกแข็ง",
        "source": "Fish p.79-82",
        "body": [
          {
            "bullets": [
              "เป็น **major immune tissue และเป็นแหล่ง hematopoiesis หลักของ bony fish**",
              "เป็น mixed organ คือทำหน้าที่ hematopoietic, reticuloendothelial, endocrine และ excretory",
              "อยู่ **retroperitoneal** ทางด้าน ventral ของ vertebral column สีน้ำตาลเข้มหรือดำ รูปยาวทอดตลอดความยาวของช่องลำตัว",
              "แบ่งเป็น **Anterior (head) kidney** ซึ่งเป็นส่วนที่มี hematopoietic elements และระบบภูมิคุ้มกัน กับ **posterior (tail, excretory) kidney**"
            ]
          },
          {
            "sub": "Function",
            "body": [
              {
                "bullets": [
                  "ภูมิคุ้มกันและ hematopoiesis",
                  "osmotic regulation ของน้ำและเกลือ · โดย **ของเสียไนโตรเจนถูกขับทาง gills ไม่ใช่ไต**",
                  "ในปลาน้ำจืด (freshwater) ไตต้อง **สงวนเกลือ**: glomerular filtration rate สูง, ดูดเกลือกลับที่ proximal tubules และเจือจางปัสสาวะที่ distal tubule"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์อธิบายเฉพาะกลไกของปลาน้ำจืด ส่วนปลาน้ำเค็มทำอย่างไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "จุดเก็บเลือด",
        "source": "Fish p.83-84",
        "body": [
          {
            "text": "Blood collection ทำที่ **caudal vein หรือ tail vein** สไลด์ให้ไว้เป็นชื่อตำแหน่งพร้อมรูปประกอบ ไม่ได้อธิบายเทคนิคหรือปริมาณเลือดที่เก็บได้"
          }
        ]
      }
    ]
  },
  "histo--histo-lab-block-ii": {
    "topic": "histo--histo-lab-block-ii",
    "title": "HISTO LAB - Block II (สรุปสไลด์แล็บ)",
    "icon": "🔬",
    "summary": "เดคสรุปแล็บ Block II เขียนมือทับบนภาพ photomicrograph 50 หน้า ครอบคลุม Muscular System, Cardiovascular System, Nervous System, Lymphatic System และ Respiratory System โครงเดคเป็นแบบ \"ภาพสไลด์ + ลูกศรชี้ชื่อโครงสร้าง\" พร้อมรหัสสไลด์จริงที่ต้องส่องในแล็บ (เช่น Slide 63-3 : Aorta, dog, Slide B150 : Lymph node, Dog) สิ่งที่เอาไปใช้ได้จริงคือ criteria สำหรับแยกชนิดของกล้ามเนื้อ แยกชั้นของหัวใจและหลอดเลือด และแยกอวัยวะน้ำเหลืองแต่ละอัน หมายเหตุสำคัญ: หลายหน้าเป็นภาพล้วนที่มีแต่ป้ายชื่อ และลายมือภาษาไทยจำนวนมากอ่านไม่ออกจาก text layer จึงสรุปได้เฉพาะส่วนที่อ่านได้ชัดเจนเท่านั้น",
    "sections": [
      {
        "heading": "เดคนี้คืออะไร และอ่านยังไง",
        "source": "HISTO LAB - Block II p.1",
        "body": [
          {
            "text": "หน้าแรกเขียนแค่ **HISTO part LAB II summary** คือเป็นชีตสรุปแล็บ Block II ไม่ใช่ lecture"
          },
          {
            "text": "เนื้อหาที่เหลือเป็นภาพสไลด์จริงพร้อมลูกศรชี้ชื่อโครงสร้าง และรหัสสไลด์กำกับไว้ ควรใช้คู่กับกล้องตอนส่องจริง"
          },
          {
            "callout": "ลายมือภาษาไทยบนสไลด์จำนวนมากอ่านไม่ออกจากไฟล์ข้อความ โน้ตนี้จึงเก็บเฉพาะคำศัพท์และข้อความที่อ่านได้แน่ชัด ส่วนที่หายไปต้องกลับไปดูสไลด์ตัวจริง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Muscular System: ตารางเทียบกล้ามเนื้อ 3 ชนิด",
        "source": "HISTO LAB - Block II p.2",
        "body": [
          {
            "text": "หน้านี้เป็นตารางเทียบรูปร่างเซลล์กับตำแหน่ง nucleus ของกล้ามเนื้อ 3 ชนิด"
          },
          {
            "bullets": [
              "รูปร่างเซลล์ที่เดคเขียนไว้: **elongated cylindrical**, **branched**, **fusiform (spindle)**",
              "ตำแหน่ง nucleus ที่เขียนไว้: **eccentric nucleus** หนึ่งช่อง และ **concentric nucleus** อีกสองช่อง"
            ]
          },
          {
            "text": "ข้อความไทยที่กำกับแต่ละช่องในตารางอ่านไม่ออก แต่หน้าถัดไปของเดคระบุชัดว่า skeletal = elongated + eccentric nucleus, cardiac = branched + concentric nucleus, smooth = fusiform + concentric nucleus"
          }
        ]
      },
      {
        "heading": "Skeletal muscle: 3 ข้อที่ใช้ตัดสิน",
        "source": "HISTO LAB - Block II p.3-6",
        "body": [
          {
            "text": "เดคเขียน criteria ของ muscle fiber ของ skeletal muscle ไว้เป็น 3 ข้อชัดเจน (p.6)"
          },
          {
            "bullets": [
              "**multinucleated cell**",
              "**eccentric nucleus** (nucleus ชิดขอบเซลล์)",
              "**มี cross striation**"
            ]
          },
          {
            "sub": "connective tissue ที่ห่อหุ้ม (p.3)",
            "body": [
              {
                "bullets": [
                  "**epimysium** หุ้มชั้นนอกสุด",
                  "**perimysium** หุ้มระดับ bundle",
                  "ในชั้น connective tissue เห็น collagen, nerve, blood vessel และ smooth muscle ของหลอดเลือดปนอยู่"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างระดับ sarcomere (p.4)",
            "body": [
              {
                "text": "เดคชี้ป้าย **sarcomere**, **A-band**, **I-band**, **Z-line** และเขียนกำกับว่า Z-line สัมพันธ์กับ I-band แต่คำอธิบายไทยของแต่ละแถบอ่านไม่ออก"
              }
            ]
          },
          {
            "sub": "สไลด์ที่ต้องส่อง",
            "body": [
              {
                "bullets": [
                  "**Slide A26-17 : Metacarpal pad** และ **Slide A27-3 : Tongue, dog** ดู cross striation, nucleus และ **sarcolemma** ซึ่งเดคกำกับว่าคือ cell membrane ของ muscle fiber (p.5)",
                  "**Slide 63-11 : Esophagus, cat** เดคเขียนว่าใช้ดู cross striation (p.6)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cardiac muscle",
        "source": "HISTO LAB - Block II p.7",
        "body": [
          {
            "bullets": [
              "**มี cross striation**",
              "**branched fiber** (เส้นใยแตกแขนง)",
              "**concentric nucleus** (nucleus อยู่กลางเซลล์)",
              "**มี intercalated disc**"
            ]
          },
          {
            "text": "เดคเขียนคำว่า **gap junction** กำกับไว้ที่ intercalated disc"
          },
          {
            "text": "ป้ายอื่นบนภาพ: capillary, sarcoplasm, myofibril"
          },
          {
            "callout": "จุดที่แยก cardiac ออกจาก skeletal ในกล้องคือ branched fiber + intercalated disc + nucleus อยู่กลาง ทั้งสองอย่างมี cross striation เหมือนกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Smooth muscle",
        "source": "HISTO LAB - Block II p.8-9",
        "body": [
          {
            "bullets": [
              "**ไม่มี cross striation**",
              "**fusiform (spindle) shape**",
              "**cigar shaped nucleus** และเป็น **concentric nucleus**"
            ]
          },
          {
            "sub": "Slide A91-2 : Ileum (p.8)",
            "body": [
              {
                "text": "ใช้ดู **tunica muscularis** ซึ่งแบ่งเป็น **inner circular** และ **outer longitudinal** และเทียบภาพ cross section กับ longitudinal"
              }
            ]
          },
          {
            "sub": "Slide 63-12 : Stomach, cat (p.9)",
            "body": [
              {
                "text": "เดคชี้ **corkscrew nuclei** และวงเล็บกำกับว่า **partial contracted** คือรูป nucleus บิดเป็นเกลียวเพราะเซลล์หดตัวบางส่วน"
              }
            ]
          }
        ]
      },
      {
        "heading": "Esophagus - Stomach junction",
        "source": "HISTO LAB - Block II p.10",
        "body": [
          {
            "text": "หน้านี้เป็นภาพรอยต่อ ใช้เทียบกล้ามเนื้อสองชนิดในภาพเดียว"
          },
          {
            "bullets": [
              "ฝั่ง **esophagus** = **skeletal muscle**",
              "ฝั่ง **stomach** = **smooth muscle**"
            ]
          }
        ]
      },
      {
        "heading": "Heart: 3 ชั้นของผนังหัวใจ",
        "source": "HISTO LAB - Block II p.11",
        "body": [
          {
            "text": "Slide C3-4 : Atrium, gibbon เดคเขียนไล่จากในออกนอกเป็น endocardium, myocardium, epicardium"
          },
          {
            "sub": "1. Endocardium",
            "body": [
              {
                "bullets": [
                  "**endothelium** เป็น **simple squamous** วางบน basal lamina",
                  "**subendothelial layer** เป็น **dense irregular CNT** (elastic, collagen)",
                  "**subendocardial layer** เป็น **loose CNT**"
                ]
              },
              {
                "text": "บรรทัดที่เขียนกำกับเรื่อง Purkinje's fiber ในชั้นนี้ ลายมืออ่านไม่ออกว่าเขียนว่ามีหรือไม่มี แต่หน้า p.12 ชี้ Purkinje fibers ไว้ที่ subendocardial layer ของ ventricle ชัดเจน"
              }
            ]
          },
          {
            "sub": "2. Myocardium",
            "body": [
              {
                "text": "**cardiac muscle + loose CNT**"
              }
            ]
          },
          {
            "sub": "3. Epicardium",
            "body": [
              {
                "bullets": [
                  "**subepicardial layer** เป็น CNT และเดคกำกับว่า **พบ coronary vessels** ที่ชั้นนี้",
                  "**mesothelium (parietal pericardium)** อยู่ผิวนอกสุด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Purkinje fibers ใน ventricle",
        "source": "HISTO LAB - Block II p.12",
        "body": [
          {
            "text": "Slide 63-7 : Ventricle, cat เดคชี้ **Purkinje fibers** อยู่ใน **subendocardial layer** ของ ventricle"
          },
          {
            "text": "ลักษณะที่เดคเขียนกำกับตัว Purkinje fiber: **มี 1-2 nucleus**, **มี mitochondria** และ **glycogen**"
          },
          {
            "text": "ป้ายอื่นบนภาพเดียวกัน: mesothelium, epicardium, myocardium, endothelium, subendothelial layer, loose CNT"
          }
        ]
      },
      {
        "heading": "Blood vessels comparison: ตารางเทียบหลอดเลือด",
        "source": "HISTO LAB - Block II p.13-14",
        "body": [
          {
            "text": "หน้านี้คือหัวใจของบทหลอดเลือด เดคไล่เทียบทีละชนิด"
          },
          {
            "sub": "Elastic (large) artery",
            "body": [
              {
                "bullets": [
                  "**tunica media** มี collagen, smooth muscle และ **elastic fiber** เป็นจุดเด่น",
                  "**tunica adventitia** เป็น CNT ที่มี collagen และ elastic เล็กน้อย (few elastic)",
                  "**พบ vasa vasorum และ nervi vasorum**",
                  "ป้ายอื่นบนภาพ: internal elastic lamina, endothelium"
                ]
              }
            ]
          },
          {
            "sub": "Muscular artery",
            "body": [
              {
                "bullets": [
                  "**internal elastic lamina** เห็นชัดเป็นคลื่น (เดคเขียนกำกับคำว่า fold)",
                  "**tunica media** เด่นด้วย **smooth muscle** และมี elastic **น้อยกว่า** elastic artery",
                  "**มี external elastic lamina**"
                ]
              }
            ]
          },
          {
            "sub": "Small artery (arteriole)",
            "body": [
              {
                "text": "**tunica media มี smooth muscle 1-3 layers**"
              }
            ]
          },
          {
            "sub": "Large vein / Medium sized-vein / Small vein (venule)",
            "body": [
              {
                "bullets": [
                  "vein เขียนกำกับว่า **irregular shaped lumen**",
                  "**Large vein**: tunica adventitia เด่นและมี smooth muscle อยู่ในชั้น adventitia ด้วย",
                  "**Medium sized-vein**: tunica media มี smooth muscle ไม่กี่ชั้น (ตัวเลขบนสไลด์เขียนทับกันจนอ่านไม่ชัด)",
                  "**Small vein (venule)**: ขนาดใกล้เคียง capillary **∅ ≈ 20 µm**, tunica media มี smooth muscle ราว 1-2 ชั้น และมี **pericyte**"
                ]
              }
            ]
          },
          {
            "sub": "Capillary",
            "body": [
              {
                "bullets": [
                  "**∅ 5-10 µm** และมี RBC เรียงอยู่ในรูเพียง 1-2 เซลล์",
                  "**1 layer of endothelial cell**",
                  "**ไม่มี tunica media และไม่มี smooth muscle**",
                  "**tunica adventitia** = **pericyte + CNT**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สไลด์หลอดเลือดและการย้อมพิเศษ",
        "source": "HISTO LAB - Block II p.15-18",
        "body": [
          {
            "bullets": [
              "**Slide 63-3 : Aorta, dog** = elastic artery ชี้ internal elastic lamina, tunica media (smooth muscle + elastic fiber), tunica adventitia (CNT) และ **vasa vasorum** (p.15)",
              "**Slide A9-2 : Muscular artery (elastic stain)** ชี้ internal elastic lamina, tunica media, tunica adventitia พร้อม **nervi vasorum** และ **vasa vasorum** (p.17)",
              "**Slide C2-53 : Pancreatic duct, buffalo** ใช้ดู muscular artery ที่แทรกอยู่ และ internal elastic lamina ที่พับเป็น fold (p.17)",
              "**Slide A15-1 : Large vein** และ **Slide 63-5 : Portal vein, dog** ชี้ endothelium, tunica media (smooth muscle), tunica adventitia (p.18)"
            ]
          },
          {
            "sub": "การย้อม (p.16)",
            "body": [
              {
                "bullets": [
                  "**Aniline blue**: ติดสีที่ **collagen และ smooth muscle** ส่วนอีกสีหนึ่งขึ้นที่ **elastic fiber** (คำระบุสีของ elastic fiber บนสไลด์อ่านไม่ออก)",
                  "**Elastic staining**: ใช้ให้เห็น **elastic fiber** ชัด จึงใช้ตาม internal elastic lamina กับ external elastic lamina ได้ง่าย"
                ]
              },
              {
                "text": "ป้ายที่ไล่ครบบนภาพย้อม: tunica intima, internal elastic lamina, tunica media, external elastic lamina, tunica adventitia, vasa vasorum"
              }
            ]
          }
        ]
      },
      {
        "heading": "Other blood vessels, lymph vessel, AV shunt",
        "source": "HISTO LAB - Block II p.19-22",
        "body": [
          {
            "text": "p.19-20 เป็นภาพเทียบ arteriole, venule, vein และ capillary ทั้ง cross section และ longitudinal section เกือบทั้งหมดเป็นภาพที่มีแต่ป้ายชื่อ ไม่มีข้อความอธิบาย"
          },
          {
            "text": "จุดที่เดคเขียนกำกับได้ชัด: ใน capillary **เห็น RBC เรียงเพียง 1-2 แถว**"
          },
          {
            "sub": "Lymph vessels (p.21)",
            "body": [
              {
                "bullets": [
                  "**คล้าย vein** แต่ **ไม่มี RBC** ในรู (พบ **WBC** แทน)",
                  "**มี valve**",
                  "สไลด์อ้างอิง **Slide B125 : Heart, rat** ในภาพเดียวกันมี elastic artery, arteriole, vein, lymph vessel และ lymph node ให้เทียบ"
                ]
              }
            ]
          },
          {
            "sub": "AV shunt (arteriovenous anastomosis) (p.22)",
            "body": [
              {
                "text": "**Slide A94 : Liver, canine** ชี้ **hepatic cord** และ **sinusoid** ซึ่งใน sinusoid พบทั้ง RBC และ WBC"
              }
            ]
          }
        ]
      },
      {
        "heading": "Nervous System: Neuron cell",
        "source": "HISTO LAB - Block II p.23",
        "body": [
          {
            "bullets": [
              "nucleus ของ neuron เป็น **concentric nucleus**",
              "เป็น **euchromatin nucleus** ซึ่งเดคกำกับว่าสัมพันธ์กับ **activity สูง**",
              "**nucleolus** เห็นเด่น",
              "**Nissl's substance** คือส่วนใน cytoplasm ที่ **มี RER**",
              "**lipofuscin** เดคระบุว่าเป็น **inclusion body**",
              "**axon hillock** คือส่วนของ cell body ที่ต่อออกไปเป็น **axon**"
            ]
          },
          {
            "sub": "Autonomic ganglion",
            "body": [
              {
                "text": "**Slide A45-7 : Celiacomesenteric ganglion** เดคเขียนว่าเซลล์ใน autonomic ganglion มี nucleus แบบ **eccentric nucleus** และมี **satellite cell** ล้อมรอบ"
              }
            ]
          },
          {
            "callout": "จุดต่างที่เดคเน้น: neuron ทั่วไป nucleus อยู่กลาง (concentric) แต่ใน autonomic ganglion เขียนกำกับว่าเป็น eccentric nucleus",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Myelinated และ Non-myelinated nerve fiber",
        "source": "HISTO LAB - Block II p.24-25",
        "body": [
          {
            "text": "เดคเขียนลำดับของ PNS ว่า ตัว neuron อยู่ใน **ganglion** ส่วน bundle ของเส้นใยรวมกันเป็น **nerve** และในนั้นคือ **nerve fiber**"
          },
          {
            "sub": "ชั้น connective tissue ของเส้นประสาท (p.24)",
            "body": [
              {
                "bullets": [
                  "**epineurium** หุ้มนอกสุด",
                  "**perineurium** หุ้มระดับ bundle",
                  "**endoneurium** หุ้มรอบ Schwann cell แต่ละเซลล์"
                ]
              }
            ]
          },
          {
            "sub": "Myelinated fiber (p.24)",
            "body": [
              {
                "bullets": [
                  "**nucleus of Schwann cell** รูปร่าง **cigar shape**",
                  "**myelin sheath** หุ้มรอบ axon",
                  "**internode** และ **node of Ranvier** ซึ่งเดคกำกับว่าเป็นช่วงที่ myelin ขาดตอน",
                  "**fibroblast** ในภาพเป็นเซลล์ **fusiform shape**"
                ]
              }
            ]
          },
          {
            "sub": "Non-myelinated fiber (p.25)",
            "body": [
              {
                "text": "มี **Schwann cell** อยู่ แต่ **ไม่มี myelin** หุ้ม"
              }
            ]
          }
        ]
      },
      {
        "heading": "Spinal cord",
        "source": "HISTO LAB - Block II p.25",
        "body": [
          {
            "bullets": [
              "แยก **dorsal horn** กับ **ventral horn**",
              "neuron ที่อยู่ใน **ventral horn** เป็น **multipolar neuron** และเดคกำกับว่าเป็น **motor nerve**",
              "เดคเขียนคำว่า **interneuron** กำกับ neuron อีกกลุ่มไว้ด้วย แต่ข้อความไทยที่ขยายอ่านไม่ออก"
            ]
          },
          {
            "sub": "Ependymal cells",
            "body": [
              {
                "text": "บุ **central canal** เดคเขียนว่าเหมือน epithelium และเป็น **columnar cells with cilia or microvilli**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Cerebrum",
        "source": "HISTO LAB - Block II p.26",
        "body": [
          {
            "bullets": [
              "**pia mater** คลุมผิวนอก",
              "**cerebral cortex** = ชั้นที่ **มี neuron**",
              "**cerebral medulla** = ชั้นที่ **ไม่มี neuron**",
              "**supporting cell (glia cell)** มีจำนวนมากกว่า neuron"
            ]
          },
          {
            "sub": "เซลล์ที่ต้องชี้ได้ในภาพ",
            "body": [
              {
                "bullets": [
                  "**astrocyte** เดคกำกับว่าอยู่ติดกับ **capillary**",
                  "**oligodendrocyte**",
                  "**microglia**",
                  "**multipolar neuron** และ capillary"
                ]
              }
            ]
          },
          {
            "text": "**Silver staining** เดคเขียนว่าใช้เพื่อ **ดู axon**"
          }
        ]
      },
      {
        "heading": "Cerebellum: 3 layers ของ cortex",
        "source": "HISTO LAB - Block II p.27",
        "body": [
          {
            "text": "เดคเขียนว่า cerebellar cortex **แบ่งเป็น 3 layers**"
          },
          {
            "bullets": [
              "**molecular layer**",
              "**Purkinje cell layer**",
              "**granule cell layer**"
            ]
          },
          {
            "text": "**cerebellar medulla** คือ **white matter**"
          },
          {
            "text": "เรื่อง **Purkinje cell** เดคชี้ว่า **dendrite แผ่ขึ้นไปใน molecular layer** ส่วน **axon ลงไปทาง medulla**"
          },
          {
            "text": "มีคำว่า **basket cell** เขียนกำกับที่ molecular layer แต่ประโยคไทยรอบ ๆ อ่านไม่ออก"
          }
        ]
      },
      {
        "heading": "Plexus ในลำไส้ และ spiral ganglion",
        "source": "HISTO LAB - Block II p.28",
        "body": [
          {
            "sub": "Jejunum",
            "body": [
              {
                "bullets": [
                  "**myenteric plexus**",
                  "**submucosal plexus**",
                  "เดคเขียนคำว่า **peristalsis** กำกับไว้กับ smooth muscle"
                ]
              }
            ]
          },
          {
            "sub": "Internal ear, cochlea",
            "body": [
              {
                "text": "ในภาพเดียวกันมี **spiral ganglion of CN VIII (vestibulocochlear nerve)**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Encapsulated receptor",
        "source": "HISTO LAB - Block II p.29",
        "body": [
          {
            "sub": "Meissner's corpuscle (touch corpuscle)",
            "body": [
              {
                "text": "อยู่ใน **connective tissue** ใต้ epidermis (เดคชี้ชั้น epidermis กับ dermis กำกับไว้) และเขียนคำว่า **touch / tactile** กำกับหน้าที่"
              }
            ]
          },
          {
            "sub": "Pacinian corpuscle (lamella corpuscle)",
            "body": [
              {
                "bullets": [
                  "**มี capsule ซ้อนกันเป็นชั้น ๆ** รอบ **peripheral axon** ตรงกลาง",
                  "เป็น **mechanoreceptor** รับ **pressure และ vibration**",
                  "เดคเขียนคำว่า **pseudounipolar** กำกับชนิดของ neuron ไว้"
                ]
              }
            ]
          },
          {
            "text": "สไลด์อ้างอิงบนหน้านี้: **Slide K13 : Fingertip** และ **Slide B195 : Pancreas, cat**"
          }
        ]
      },
      {
        "heading": "Lymphatic System: Thymus",
        "source": "HISTO LAB - Block II p.30-31",
        "body": [
          {
            "bullets": [
              "**2 lobe** แบ่งย่อยเป็น **lobules** และ **1 lobule ประกอบด้วย cortex และ medulla**",
              "มี **capsule** และเดคเขียนกำกับว่า medulla ระหว่าง lobule **แยกไม่ขาดจากกัน (incomplete separated)**"
            ]
          },
          {
            "sub": "เซลล์ใน thymus (p.31)",
            "body": [
              {
                "bullets": [
                  "**thymic epithelial cell** เดคเขียนว่า **มี process** ยื่นออกไปโอบ WBC",
                  "**WBC ใน thymus คือ T-lymphocyte** และอยู่หนาแน่นที่ **cortex**",
                  "ใน cortex เป็น **T-lymphoblast (thymocyte)** ที่มาจาก **bone marrow**",
                  "ใน **medulla** มี T-lymphocyte **น้อยกว่า cortex**",
                  "เดคเขียนกำกับ blood vessel ไว้ด้วย แต่ประโยคขยายอ่านไม่ออก"
                ]
              }
            ]
          },
          {
            "sub": "Hassall's corpuscle (thymic corpuscle)",
            "body": [
              {
                "bullets": [
                  "เกิดจาก **reticular cell** และพบใน **medulla**",
                  "รูปร่าง **whorl-shaped** (ม้วนเป็นวง)",
                  "เดคเขียนคำว่า **keratohyalin granule** กำกับไว้"
                ]
              }
            ]
          },
          {
            "callout": "Hassall's corpuscle = ตัวชี้ขาดว่านี่คือ thymus และอยู่ที่ medulla เสมอ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Lymph node",
        "source": "HISTO LAB - Block II p.32-34",
        "body": [
          {
            "sub": "โครงสร้างรวม (p.32)",
            "body": [
              {
                "bullets": [
                  "**capsule** และ **trabecula** ที่แตกเข้าไปจาก capsule",
                  "**subcapsular sinus** ใต้ capsule",
                  "แบ่งเป็น **cortex - paracortex - medulla**",
                  "**medullary cord** และ **medullary sinus** อยู่ชั้น medulla",
                  "รอบ ๆ node พบ **adipose tissue**",
                  "**silver stain** ใช้ให้เห็น **reticular fiber**"
                ]
              }
            ]
          },
          {
            "sub": "Cortex กับ paracortex (p.34)",
            "body": [
              {
                "bullets": [
                  "**cortex มี lymphatic nodule** และใน nodule เป็น **B-lymphocyte**",
                  "**paracortex ไม่มี lymphatic nodule** และเป็นที่อยู่ของ **T-cell**",
                  "**germinal center** พบเมื่อมี **antigenic challenge** จึงเรียกเป็น **secondary lymphatic nodule**",
                  "**mantle zone** เดคกำกับว่าเป็น **inactive lymphocyte**",
                  "**follicular dendritic cell** อยู่ใน germinal center และเดคชี้ว่าดู nucleolus ได้"
                ]
              },
              {
                "text": "เดคเขียนคำว่า **immunohistochemistry** กำกับไว้กับการดู germinal center แต่ประโยคไทยที่ขยายอ่านไม่ออก"
              }
            ]
          },
          {
            "sub": "Medullary cord (p.33)",
            "body": [
              {
                "bullets": [
                  "ประกอบด้วย **B-lymphocyte** และ **plasma cell**",
                  "**plasma cell** ลักษณะ **eccentric nucleus + มี halo area**",
                  "เดคเขียนคำว่า **post-capillary venule** และ endothelial cell กำกับไว้ แต่ประโยคขยายอ่านไม่ออก"
                ]
              }
            ]
          },
          {
            "text": "สไลด์อ้างอิง: **Slide B150 : Lymph node, Dog**, **Slide 001 : Lymph node** และ **Slide : Lymph node, Pig**"
          }
        ]
      },
      {
        "heading": "Spleen",
        "source": "HISTO LAB - Block II p.35-38",
        "body": [
          {
            "text": "เดคเขียนว่า spleen แบ่งเป็น **white pulp** และ **red pulp**"
          },
          {
            "sub": "White pulp",
            "body": [
              {
                "bullets": [
                  "**central artery** เป็นแกน",
                  "**PALS (periarterial lymphatic sheath)** คือ **T-lymphocyte ที่เรียงรอบ central artery**",
                  "**lymphatic nodule (splenic nodule)** คล้ายกับที่พบใน lymph node และมี **germinal center** กับ **mantle zone**",
                  "**marginal sinus** เป็นรอยต่อระหว่าง white pulp กับ red pulp และเดคกำกับว่าเกี่ยวกับ **antigen**"
                ]
              }
            ]
          },
          {
            "sub": "Capsule และ trabecula (p.37)",
            "body": [
              {
                "bullets": [
                  "**capsule** เป็น **dense irregular CNT** และ **มี smooth muscle**",
                  "**trabecula** แตกเข้าไปจาก capsule และเดคเขียนว่ามี smooth muscle ราว **1-3 ชั้น**"
                ]
              }
            ]
          },
          {
            "sub": "Red pulp (p.37-38)",
            "body": [
              {
                "bullets": [
                  "**sheathed capillary** ล้อมด้วย **macrophage (ellipsoid)**",
                  "เดคชี้ **endothelium** ของหลอดเลือดใน red pulp ไว้ด้วย"
                ]
              }
            ]
          },
          {
            "text": "สไลด์อ้างอิง: **Slide B130 : Spleen, Pig**"
          }
        ]
      },
      {
        "heading": "MALT และ Tonsil",
        "source": "HISTO LAB - Block II p.39-40",
        "body": [
          {
            "sub": "MALTs : Mucosa-Associated Lymphoid Tissue",
            "body": [
              {
                "bullets": [
                  "เป็น **non-encapsulated lymphoid tissue** ที่อยู่ใน **mucosa**",
                  "รูปแบบที่พบ: **diffuse lymphoid tissue** และ **lymphatic nodules**",
                  "lymphatic nodules แบ่งเป็น **isolated** กับ **aggregated**",
                  "**aggregated lymphatic nodules = Peyer's patch**",
                  "อยู่ใน **lamina propria** ซึ่งเป็น CNT ใต้ epithelium และมี **B-lymphocyte**"
                ]
              },
              {
                "text": "สไลด์อ้างอิง: **Slide B131-50 : Duodenum** และ **Slide A91-2 : Ileum**"
              }
            ]
          },
          {
            "sub": "Tonsil",
            "body": [
              {
                "bullets": [
                  "บุด้วย **stratified squamous epithelium** (เดคเขียนกำกับ oropharynx ไว้)",
                  "**มี tonsillar crypts**",
                  "**มี capsule**",
                  "เนื้อในเป็น **lymphatic tissue**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Respiratory System: Respiratory & Olfactory mucosa",
        "source": "HISTO LAB - Block II p.42-43",
        "body": [
          {
            "bullets": [
              "เยื่อบุที่เดคระบุคือ **ciliated pseudostratified columnar epithelium**",
              "ใต้เยื่อบุเรียกชั้น **propria-submucosa**",
              "ในภาพหัวมีป้ายกำกับ nasal cavity, oral cavity, tongue, hard palate, eye และ **hyaline cartilage**",
              "เดคเขียนคำว่า **goblet cell** กำกับไว้ในการเทียบ respiratory mucosa กับ **olfactory mucosa** แต่ประโยคเปรียบเทียบเป็นลายมือที่อ่านไม่ออก จึงสรุปไม่ได้ว่าเดคบอกว่าอันไหนมีหรือไม่มี goblet cell"
            ]
          },
          {
            "sub": "Vomeronasal organ (p.43)",
            "body": [
              {
                "bullets": [
                  "อยู่ใน **nasal cavity**",
                  "**J-shaped cartilage** และเดคระบุว่าเป็น **hyaline cartilage**",
                  "สไลด์อ้างอิง **Slide A39 : Embryonal tissue** (ในหน้า p.42 เขียนเป็น Slide A39 : Embryonal tissue, Rat)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Larynx",
        "source": "HISTO LAB - Block II p.44",
        "body": [
          {
            "bullets": [
              "cartilage บางชิ้นของ larynx เป็น **elastic cartilage**",
              "**epiglottic cartilage** อยู่ทางด้าน cranial",
              "**mixed gland**",
              "ไล่จาก cranial ไป caudal: **vestibular fold → laryngeal ventricle → vocal fold**",
              "**vocal ligament** ประกอบด้วย **elastic fiber**"
            ]
          }
        ]
      },
      {
        "heading": "Trachea และความต่างระหว่างสัตว์",
        "source": "HISTO LAB - Block II p.45-46",
        "body": [
          {
            "text": "ชั้นที่ต้องชี้ได้: **epithelium → propria-submucosa → cartilage (มี perichondrium) → trachealis muscle → tunica adventitia**"
          },
          {
            "bullets": [
              "**Slide A24-1 : Trachea, Equine** ชี้ perichondrium, propria-submucosa, tunica adventitia และ trachealis muscle",
              "**Slide B123 : Trachea, Swine** ชี้ propria-submucosa และ tunica adventitia",
              "**Slide PW102 : Trachea, Canine** เห็น **adipose tissue** ร่วมด้วย",
              "**Slide 63-2 : Trachea, Cat** ชี้ epithelium, propria-submucosa, cartilage, trachealis muscle, tunica adventitia",
              "**Slide : Trachea, Rat** เห็น trachea คู่กับ esophagus ในภาพเดียว"
            ]
          },
          {
            "text": "เดคเขียนกำกับว่าใน **carnivores** มี **trachealis muscle** และเขียนถึง **elastic lamina** ในชั้น propria-submucosa แต่ประโยคขยายทั้งสองจุดเป็นลายมือที่อ่านไม่ออก"
          },
          {
            "text": "อีกจุดที่เขียนไว้: บริเวณที่มี **mesothelium** คือ **tunica serosa** ส่วนที่ไม่มีคือ **tunica adventitia**"
          }
        ]
      },
      {
        "heading": "Bronchus, Bronchioles, Lung",
        "source": "HISTO LAB - Block II p.47-50",
        "body": [
          {
            "text": "หัวข้อหน้าเปิดเขียนไว้สั้น ๆ ว่า **มี myoelastic layer** และ **no cartilage** (p.47)"
          },
          {
            "sub": "เยื่อบุที่ไล่ตามลำดับ",
            "body": [
              {
                "bullets": [
                  "**bronchus** มี **respiratory mucosa** และเห็น fold (p.48)",
                  "**primary และ secondary bronchiole** = **simple columnar epithelium** (p.49)",
                  "**terminal bronchioles** = **simple cuboidal epithelium** (p.48)",
                  "**respiratory bronchioles** = เริ่มมี **squamous (alveolus) epithelium** (p.48)",
                  "ถัดจาก respiratory bronchioles คือ **alveolar duct** (p.49)"
                ]
              }
            ]
          },
          {
            "sub": "จุดอื่นที่ชี้ไว้บนภาพ",
            "body": [
              {
                "bullets": [
                  "**smooth muscle** รอบ bronchiole (p.48-49)",
                  "**lymphatic tissue** ในเนื้อปอด (p.48, p.50)",
                  "ใน alveolus: เซลล์แบบ **squamous** และเซลล์แบบ **cuboidal** ซึ่งเดคกำกับว่าเกี่ยวกับ **pulmonary surfactant** (p.50)",
                  "**Slide A67-3 : Lung, Swine** เดคเขียนคำว่า **foreign body** กำกับไว้ (p.50)"
                ]
              }
            ]
          },
          {
            "text": "สไลด์อ้างอิงในกลุ่มนี้: **Slide : Lung, Rat**, **Slide 63-2 : Lung, Cat**, **Slide PW104 : Lung, Canine**, **Slide B151 : Lung, Canine**, **Slide A67-3 : Lung, Swine**"
          },
          {
            "callout": "หน้า p.19-20, p.36 และ p.41 เป็นภาพล้วนหรือหน้าคั่นหัวข้อ ไม่มีเนื้อหาอธิบายให้สรุป",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "histo--integument": {
    "topic": "histo--integument",
    "title": "Integument (ผิวหนัง อวัยวะแนบผิวหนัง และ special epidermal structures)",
    "icon": "🔬",
    "summary": "เด็ค 79 สไลด์ ไล่จากหน้าที่และการเจริญของผิวหนัง เข้าโครงสร้าง epidermis 5 layers และเซลล์ในนั้น ต่อด้วย dermis กับ hypodermis แล้วเข้า skin appendages (hair, hair follicle, skin glands ทั้ง 5 ชนิด) และจบที่ special epidermal structures ซึ่งลงรายละเอียดเฉพาะ hoof (โดยเฉพาะ buffalo's hoof slide B196) ส่วน claw กับ horn มีแค่ชื่อในหัวข้อ ประมาณหนึ่งในสามของสไลด์ทั้งเด็คเป็นภาพ micrograph หรือภาพ label ที่ไม่มีข้อความบรรยาย จึงสรุปเป็นตัวหนังสือไม่ได้ ต้องดูภาพในสไลด์จริงประกอบ",
    "sections": [
      {
        "heading": "หน้าที่ของ integument",
        "source": "Integument p.2",
        "body": [
          {
            "bullets": [
              "**Environmental barrier**",
              "**Sensory reception**",
              "**Thermoregulation**",
              "**Immune defense**",
              "**Vitamin D production**"
            ]
          }
        ]
      },
      {
        "heading": "Development of the skin",
        "source": "Integument p.3",
        "body": [
          {
            "bullets": [
              "**Ectoderm** ให้กำเนิด epidermis, skin glands, nerve และ hair follicles",
              "**Mesoderm** ให้กำเนิด dermis และ blood vessels"
            ]
          }
        ]
      },
      {
        "heading": "องค์ประกอบของ integument และรอยต่อ epidermis กับ dermis",
        "source": "Integument p.4, p.6",
        "body": [
          {
            "text": "สไลด์แบ่ง integument ออกเป็น 3 หมวดใหญ่ ซึ่งเป็นโครงของทั้งเด็ค"
          },
          {
            "bullets": [
              "**Skin**",
              "**Skin appendages**",
              "**Special epidermal structures**"
            ]
          },
          {
            "text": "หน้าถัดมาเป็นภาพ label รอยต่อระหว่างสองชั้น ให้จำคู่ **epidermal peg (ของ epidermis) คู่กับ dermal papilla (ของ dermis)**"
          }
        ]
      },
      {
        "heading": "Skin / Cutis แบ่งเป็น 2 ชั้น",
        "source": "Integument p.7",
        "body": [
          {
            "sub": "Epidermis",
            "body": [
              {
                "bullets": [
                  "**Keratinized stratified squamous epithelium**",
                  "มี **5 layers**",
                  "ประกอบด้วย keratinocytes และ specialized cell อื่น ๆ"
                ]
              }
            ]
          },
          {
            "sub": "Dermis",
            "body": [
              {
                "bullets": [
                  "Connective tissues",
                  "Blood vessels และ lymphatic vessels",
                  "Nerve fibers"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Epidermis 5 layers",
        "source": "Integument p.9-12",
        "body": [
          {
            "sub": "Stratum basale (st. germinativum)",
            "body": [
              {
                "bullets": [
                  "**single layer ของ cuboidal หรือ columnar cells**",
                  "แยกจาก dermis",
                  "พบ **melanocytes และ Merkel cell**"
                ]
              }
            ]
          },
          {
            "sub": "Stratum spinosum",
            "body": [
              {
                "bullets": [
                  "**ชั้นที่หนาที่สุดของ epidermis** ประกอบด้วย polyhedral cells หลายชั้น",
                  "พบ **desmosome**",
                  "หนาหลายชั้นใน thick skin แต่เหลือ **2-3 layers ใน thin skin**",
                  "พบ **Langerhans cell**"
                ]
              }
            ]
          },
          {
            "sub": "Stratum granulosum",
            "body": [
              {
                "bullets": [
                  "เซลล์เปลี่ยนรูปจาก polyhedral ไปเป็น squamous",
                  "พบ **keratohyalin granules**",
                  "keratinocytes เป็น flat cell"
                ]
              }
            ]
          },
          {
            "sub": "Stratum lucidum",
            "body": [
              {
                "bullets": [
                  "keratinized squamous cell หลายชั้น",
                  "**พบใน thick skin ส่วนใหญ่ (เช่น metacarpal pad) และ hairless thin skin (เช่น lip)**",
                  "**ไม่พบใน hairy thin skin**"
                ]
              }
            ]
          },
          {
            "sub": "Stratum corneum",
            "body": [
              {
                "bullets": [
                  "**3-50 layers ของ keratinized squamous cells**",
                  "หลุดลอกตลอดเวลา (constantly shedding)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Thick skin กับ thin skin",
        "source": "Integument p.12, p.15-16",
        "body": [
          {
            "bullets": [
              "**Thin skin มี 5 layers**",
              "**Thin hairy skin มี 4 layers**"
            ]
          },
          {
            "callout": "ชั้นที่หายไปใน thin hairy skin คือ stratum lucidum ตามที่สไลด์ p.12 บอกว่า absent in hairy thin skin ส่วนสไลด์ที่ขึ้นหัวว่า Thick skin (p.15) เป็นภาพล้วน ไม่มีข้อความอธิบาย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Cells in epidermis 4 ชนิด",
        "source": "Integument p.17-18",
        "body": [
          {
            "sub": "Keratinocytes",
            "body": [
              {
                "bullets": [
                  "เรียงตัวอยู่ใน 5 layers",
                  "รูปร่างจาก polyhedral shape ไปเป็น squamous shape",
                  "สร้าง keratin"
                ]
              }
            ]
          },
          {
            "sub": "Melanocytes",
            "body": [
              {
                "bullets": [
                  "อยู่ที่ **stratum basale**",
                  "เป็น dendritic clear cells",
                  "**produce melanin pigment**"
                ]
              }
            ]
          },
          {
            "sub": "Langerhans cells",
            "body": [
              {
                "bullets": [
                  "**มาจาก bone marrow**",
                  "อยู่ที่ **stratum spinosum**",
                  "เป็น dendritic clear cells เมื่อย้อม H&E",
                  "**antigen-presenting cells**"
                ]
              }
            ]
          },
          {
            "sub": "Merkel cells",
            "body": [
              {
                "bullets": [
                  "อยู่ที่ **stratum basale**",
                  "เป็น clear cell หรือ squamous cell",
                  "**mechanoreceptors**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ข้อสอบชอบสลับกัน คือ melanocyte กับ Merkel cell อยู่ stratum basale ส่วน Langerhans cell อยู่ stratum spinosum",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Dermis 2 ชั้น",
        "source": "Integument p.20",
        "body": [
          {
            "sub": "Superficial / papillary layer",
            "body": [
              {
                "bullets": [
                  "เป็นส่วนที่ยื่นเป็น **dermal papilla**",
                  "**loose CNT**",
                  "มี elastic fiber, fibrocytes, mast cell, plasma cell",
                  "มี blood vessels, nerve fiber และ arrector pili"
                ]
              }
            ]
          },
          {
            "sub": "Deep / reticular layer",
            "body": [
              {
                "bullets": [
                  "**dense irregular CNT**",
                  "**collagen fiber**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hypodermis / subcutis / subcutaneous",
        "source": "Integument p.21",
        "body": [
          {
            "bullets": [
              "ประกอบด้วย **loose CNT และ adipocytes**",
              "**ไม่นับเป็นส่วนหนึ่งของ skin**",
              "ทำหน้าที่ยึด skin กับ fascia, skeletal muscle และ bone ที่อยู่ข้างใต้",
              "**ไม่มีที่ wall of hoof, sole of hoof, claws, horns, teats และ eyelids**"
            ]
          },
          {
            "callout": "ลิสต์ตำแหน่งที่ absent มี 6 ที่ ท่องให้ครบ สไลด์เขียนไว้ว่า \"Absent in the wall of hoof ,sole of hoof, claws, horns, teats and eyelids\"",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Skin appendages และโครงสร้างของ hair",
        "source": "Integument p.23-24",
        "body": [
          {
            "text": "Skin appendages ในเด็คนี้มี 3 อย่าง คือ **hair, hair follicles และ skin glands**"
          },
          {
            "sub": "Hair shaft",
            "body": [
              {
                "bullets": [
                  "**cuticle, cortex, medulla**"
                ]
              }
            ]
          },
          {
            "sub": "Hair root",
            "body": [
              {
                "bullets": [
                  "**Hair bulb**",
                  "**Hair papilla (dermal hair papilla)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Hair follicles และ root sheath",
        "source": "Integument p.26",
        "body": [
          {
            "bullets": [
              "เกิดจากการ **invagination ของ epidermis ลงไปใน dermis**",
              "ล้อมรอบ hair root และ hair bulb"
            ]
          },
          {
            "sub": "Outer (external) root sheath",
            "body": [
              {
                "text": "**corresponds กับ stratum basale และ stratum spinosum**"
              }
            ]
          },
          {
            "sub": "Inner (internal) root sheath มี 3 ชั้น",
            "body": [
              {
                "bullets": [
                  "**outer pale epithelial layer (Henle's layer)**",
                  "**inner granular epithelial layer (Huxley's layer)**",
                  "**root cuticle**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dermal sheath (CNT root sheath)",
        "source": "Integument p.29",
        "body": [
          {
            "text": "ต่อเนื่องกับ dermis และล้อมรอบ hair follicle ประกอบด้วย"
          },
          {
            "bullets": [
              "**Glassy membrane**",
              "**Dermal hair papilla**",
              "**Arrector pili** ซึ่งเป็น smooth muscle ที่เกาะกับ dermal sheath"
            ]
          }
        ]
      },
      {
        "heading": "Types of hair follicle",
        "source": "Integument p.31",
        "body": [
          {
            "bullets": [
              "**Single hair follicle**",
              "**Compound hair follicle**",
              "**Tactile (sinus) hair follicle**"
            ]
          }
        ]
      },
      {
        "heading": "Tactile hair follicle องค์ประกอบที่ต้องชี้ได้ในภาพ",
        "source": "Integument p.35-36",
        "body": [
          {
            "bullets": [
              "**Tactile hair** (มี cortex และ medulla)",
              "**Inner root sheath**",
              "**Outer root sheath**",
              "**Glassy membrane**",
              "**Inner dermal sheath / sinus pad**",
              "**Blood sinus (annular sinus)**",
              "**Outer dermal sheath (outer of CNT sheath)**"
            ]
          },
          {
            "text": "หน้า p.36 เป็นภาพติด label ตรงกับลิสต์นี้ ได้แก่ inner dermal sheath, sinus pad, outer root sheath, blood sinus และ outer dermal sheath"
          }
        ]
      },
      {
        "heading": "Hair growth cycle",
        "source": "Integument p.38",
        "body": [
          {
            "bullets": [
              "**Anagen phase (growing phase)**",
              "**Catagen phase (intermediate phase)**",
              "**Telogen phase (resting phase)**",
              "**Renewed anagen phase**"
            ]
          },
          {
            "callout": "สไลด์ให้แค่ชื่อเฟสตามลำดับ ไม่ได้บอกระยะเวลาหรือสัดส่วนของแต่ละเฟส สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Skin glands และการจำแนก",
        "source": "Integument p.40-43",
        "body": [
          {
            "text": "Skin gland ที่เด็คนี้ไล่ทีละอันมี 5 ชนิด"
          },
          {
            "bullets": [
              "**Sebaceous gland**",
              "**Sweat gland**",
              "**Ceruminous gland**",
              "**Tarsal gland**",
              "**Mammary gland**"
            ]
          },
          {
            "text": "การจำแนกตาม **mode of secretion** แบ่งเป็น **merocrine gland, apocrine gland และ holocrine gland**"
          },
          {
            "callout": "สไลด์ p.42 (mode of secretion) และ p.43 (anatomical classification) มีแต่หัวเรื่องกับภาพ ไม่มีข้อความอธิบายความต่างของแต่ละ mode และไม่มีรายการของ anatomical classification เลย สไลด์ไม่ได้บอก และ tarsal gland ก็ถูกลิสต์ไว้เฉย ๆ ไม่มีสไลด์ลงรายละเอียดตามมา",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Sebaceous gland",
        "source": "Integument p.44",
        "body": [
          {
            "bullets": [
              "เป็น **simple, simple branched หรือ compound alveolar glands**",
              "ภายในเต็มไปด้วยเซลล์ (flat, cuboidal, polyhedral)",
              "**Holocrine secretion**",
              "**associated with hair follicle**",
              "**ไม่พบที่ footpads, horns และ nasal plate**"
            ]
          }
        ]
      },
      {
        "heading": "Sweat gland",
        "source": "Integument p.46-47",
        "body": [
          {
            "bullets": [
              "เป็น **simple, branched หรือ tubular gland**",
              "โดยทั่วไป **associated with hair follicle**",
              "**มี lumen กว้าง**",
              "มักพบ **myoepithelial cell (basket cell)** ล้อมรอบอยู่ที่ basal lamina"
            ]
          },
          {
            "sub": "Merocrine sweat gland",
            "body": [
              {
                "bullets": [
                  "**stratified cuboidal epithelium**",
                  "พบที่ **footpad, nasal plate, frog of hoof**"
                ]
              }
            ]
          },
          {
            "sub": "Apocrine sweat gland",
            "body": [
              {
                "bullets": [
                  "**cuboidal หรือ low columnar cell**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์บอกตำแหน่งที่พบเฉพาะของ merocrine sweat gland เท่านั้น ส่วน apocrine sweat gland สไลด์ให้แค่ชนิดเซลล์ ไม่ได้บอกตำแหน่ง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Ceruminous gland",
        "source": "Integument p.51",
        "body": [
          {
            "bullets": [
              "อยู่ที่ **external ear canal**",
              "เป็น **simple coiled tubular gland**",
              "เป็น **modified sweat gland ชนิด apocrine sweat gland**",
              "**associated with sebaceous gland**"
            ]
          },
          {
            "text": "สมการที่สไลด์เขียนไว้ตรง ๆ คือ **sweat + sebum + epi. = ear wax (cerumen)**"
          }
        ]
      },
      {
        "heading": "Mammary gland",
        "source": "Integument p.54",
        "body": [
          {
            "bullets": [
              "เป็น **compound tubulo-alveolar gland**",
              "ถูกแบ่งเป็น **lobules ด้วย interlobular CNT**",
              "หลั่งแบบ **merocrine และ apocrine**",
              "บุด้วย **simple cuboidal ถึง columnar epithelium** มีทั้ง active และ inactive stage",
              "พบ **lipid droplet ที่ apex ของเซลล์**"
            ]
          }
        ]
      },
      {
        "heading": "ทางเดินน้ำนมของ mammary gland ตามแผนภาพ",
        "source": "Integument p.55",
        "body": [
          {
            "text": "สไลด์เป็นแผนภาพไล่จากต่อมออกไปสู่ปลายเต้า พร้อมกำกับ epithelium ของท่อสองอันแรก"
          },
          {
            "bullets": [
              "**Lobule (alveoli)**",
              "**Intralobular duct** เป็น simple cuboidal epithelium",
              "**Interlobular duct** เป็น stratified cuboidal epithelium",
              "**Lactiferous duct**",
              "**Teat sinus**",
              "**Teat canal (papillary duct)** แล้วออกที่ opening"
            ]
          },
          {
            "callout": "จำคู่ epithelium ให้แม่น intralobular duct = simple cuboidal ส่วน interlobular duct = stratified cuboidal ท่อที่เหลือสไลด์ไม่ได้ระบุชนิด epithelium",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Special epidermal structures",
        "source": "Integument p.59",
        "body": [
          {
            "bullets": [
              "**Hoof**",
              "**Claw**",
              "**Horn**"
            ]
          },
          {
            "callout": "สไลด์ลงรายละเอียดเฉพาะ hoof จนจบเด็ค ส่วน claw กับ horn มีแค่ชื่อในหัวข้อนี้ ไม่มีสไลด์เนื้อหาตามมาเลย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Hoof ส่วน periople และ coronet",
        "source": "Integument p.60, p.62",
        "body": [
          {
            "bullets": [
              "**Perioplic horn (periople)**",
              "**Coronet คือรอยต่อระหว่าง periople กับ skin**"
            ]
          },
          {
            "text": "ภาพ label ที่ตามมาแยกให้เห็นว่า **hoof capsule คือส่วน epidermis ส่วน corium คือ dermis** และชี้ perioplic horn, coronary horn กับ laminar horn บนภาพเดียวกัน"
          }
        ]
      },
      {
        "heading": "Wall of hoof แบ่งเป็น 3 ชั้น",
        "source": "Integument p.64",
        "body": [
          {
            "bullets": [
              "**Perioplic horn = stratum externum**",
              "**Coronary horn = stratum medium** ซึ่งประกอบด้วย **tubular horn และ intertubular horn**",
              "**Laminar horn = stratum internum**"
            ]
          },
          {
            "callout": "สไลด์พิมพ์เลขข้อผิด ใช้เลข 2. ซ้ำสองครั้ง (coronary horn และ laminar horn) แต่เนื้อหาคือสามชั้นตามลำดับจากนอกเข้าใน externum ไป medium ไป internum",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การจับคู่ epidermis กับ dermis ของ hoof",
        "source": "Integument p.67",
        "body": [
          {
            "text": "สไลด์ทำเป็นตารางสองคอลัมน์ ฝั่งซ้าย epidermis ฝั่งขวา dermis จับคู่กันตรง ๆ"
          },
          {
            "bullets": [
              "**Perioplic horn คู่กับ perioplic corium**",
              "**Coronary horn คู่กับ coronary corium**",
              "**Laminar horn คู่กับ laminar corium**",
              "ภายใน laminar layer แบ่งเป็น **primary horny lamina คู่กับ primary corial lamina**",
              "และ **secondary horny lamina คู่กับ secondary corial lamina ซึ่งสไลด์กำกับว่า horse only ทั้งสองฝั่ง**"
            ]
          },
          {
            "callout": "ประโยคที่ต้องจำคือ secondary lamina ทั้งฝั่ง horny และฝั่ง corial มีเฉพาะในม้า",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ภาพ hoof ที่ต้องอ่านให้ออก",
        "source": "Integument p.70-73",
        "body": [
          {
            "text": "ชุดนี้เป็นภาพติด label ไม่มีคำบรรยาย label ที่ปรากฏได้แก่"
          },
          {
            "bullets": [
              "ใน coronary horn ชี้ **tubular horn และ intertubular horn**",
              "**primary laminar horn** คู่กับ **primary laminar corium**",
              "**secondary laminar horn** คู่กับ **secondary laminar corium**",
              "หน้าเปรียบเทียบต่างชนิดสัตว์ ชี้ corium, primary laminar horn และ coronary horn บน hoof ของสัตว์อีกชนิด (ชื่อชนิดบนสไลด์เป็นภาษาไทยที่ text layer อ่านออกมาไม่ครบ) และอีกหน้าเป็น buffalo's hoof ชี้ **primary corial lamina กับ primary horny lamina**"
            ]
          }
        ]
      },
      {
        "heading": "Buffalo's hoof slide B196 อ่าน label ให้ครบ",
        "source": "Integument p.75-77",
        "body": [
          {
            "text": "สไลด์ให้คีย์ตัวอักษรของ slide B196 ไว้ตรง ๆ ใช้เทียบตอนดูกล้องได้เลย"
          },
          {
            "bullets": [
              "**a = perioplic horn**",
              "**b = perioplic corium** และ **b' = corial papilla of perioplic corium**",
              "**c = stratum germinativum**",
              "**d = stratum granulosum**",
              "**e = coronary horn**",
              "**f = perioplic fold**",
              "**g = coronary corium** และ **g' = corial papilla of coronary corium**"
            ]
          },
          {
            "text": "อีกหน้าของ slide B196 เป็น longitudinal section ของ coronary horn กับ laminar horn โดย **a = tubular horn ใน coronary horn, b = intertubular horn cells, c และ d = laminar horn**"
          },
          {
            "callout": "หน้า p.75 ยังชี้ stratum spinosum กับ stratum granulosum บนภาพ buffalo's hoof ด้วย ซึ่งเป็นจุดที่เชื่อมเนื้อหา epidermis ตอนต้นเด็คกับ hoof ตอนท้ายเข้าด้วยกัน",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "histo--laboratory-of-nervous-system-histology": {
    "topic": "histo--laboratory-of-nervous-system-histology",
    "title": "Lab nervous system histology: รายการสไลด์และโครงสร้างที่ต้องชี้ให้ได้",
    "icon": "🔬",
    "summary": "เดคนี้มีหน้าเดียว และเป็น slides list ของ lab ล้วน ๆ คือบอกว่าแต่ละเบอร์สไลด์ (A.40, B.183, A.45, B.117, B.187, B.176, B.186, DD, B.120, A.18, B.181, B.195, K.13) เป็นอวัยวะอะไร และในสไลด์นั้นต้องชี้โครงสร้างอะไรบ้าง ไม่มีคำอธิบายกลไก ไม่มีวิธีย้อมสี ไม่มีรูป และไม่มีคำบรรยายเชิงเนื้อหาใด ๆ นอกจากลักษณะของ ganglion cell ใน spinal ganglion ที่สไลด์เขียนขยายไว้สั้น ๆ ใช้เดคนี้เป็นเช็กลิสต์ตอนส่องกล้อง มากกว่าจะใช้เป็นโน้ตอ่านสอบทฤษฎี",
    "sections": [
      {
        "heading": "เดคนี้เป็นอะไร และใช้ยังไง",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "text": "หัวสไลด์เขียนตรง ๆ ว่า **Laboratory of nervous system histology: slides list** คือเป็นรายการสไลด์ที่ต้องดูใน lab ระบบประสาท พร้อมชื่อโครงสร้างที่ต้องหาให้เจอในแต่ละสไลด์"
          },
          {
            "text": "สไลด์แบ่งเป็น 8 กลุ่มตามเบอร์สไลด์ ได้แก่ spinal ganglion, celiacomesenteric ganglion, cerebrum, cerebellum, spinal cord, jejunum (ANS plexus), Pacinian corpuscle และ Meisner corpuscle"
          },
          {
            "callout": "เดคไม่ได้บอกวิธีย้อม ไม่ได้บอกกำลังขยาย ไม่ได้บอกเกณฑ์ให้คะแนน และไม่มีคำอธิบายหน้าที่ของโครงสร้างใด ๆ มีระบุแค่ว่าบางสไลด์เป็น silver stain (B187, B186) เท่านั้น",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "A.40 และ B.183 spinal ganglion",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "sub": "Neuron (ganglion cells) — กลุ่มเดียวในเดคที่มีคำบรรยายลักษณะ",
            "body": [
              {
                "bullets": [
                  "**large round cell**",
                  "**euchromatin nucleus** และ **prominent nucleolus**",
                  "**Nissl body (RER)**",
                  "**axon hillock**",
                  "**lipofuschin** สไลด์ระบุว่าดูใน **B183**"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างอื่นที่ต้องชี้ในสไลด์เดียวกัน",
            "body": [
              {
                "bullets": [
                  "**Satellite (glia) cells**",
                  "**Myelinated nerve fiber** ประกอบด้วย myelin sheath, axon, node of Ranvier, Schwann cells, fibroblast",
                  "**Perineurium**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "A.45 celiacomesenteric ganglion (ANS)",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "bullets": [
              "**Neuron** สไลด์กำกับว่าเป็น **post ganglionic neuron: sympathetic**",
              "**Non myelinated nerve fiber** พร้อม **Schwann cells**"
            ]
          },
          {
            "text": "จุดที่ต่างจาก A.40/B.183 อย่างชัดเจนคือ ganglion อันนี้เดคเขียนเป็น **non myelinated nerve fiber** ส่วน spinal ganglion เขียนเป็น myelinated nerve fiber"
          },
          {
            "callout": "เดคไม่ได้อธิบายว่าทำไม autonomic ganglion จึงเป็น non myelinated fiber สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "B.117 cerebrum และ B.187 cerebrum (silver stain)",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "sub": "Cerebral cortex (gray matter)",
            "body": [
              {
                "bullets": [
                  "neuron",
                  "oligodendrocytes",
                  "astrocytes"
                ]
              }
            ]
          },
          {
            "sub": "Cerebral medulla (white matter)",
            "body": [
              {
                "bullets": [
                  "**tracts (myelinated fiber)**",
                  "oligodendrocyte",
                  "astrocytes"
                ]
              }
            ]
          },
          {
            "text": "นอกจากนี้ต้องชี้ **Pia mater** และ **multipolar neurons** โดยสไลด์ระบุว่า multipolar neurons ให้ดูใน **B187 (silver stain)**"
          }
        ]
      },
      {
        "heading": "B.176 cerebellum และ B.186 cerebellum (silver stain)",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "sub": "Cerebellar cortex (gray matter) — 3 ชั้น",
            "body": [
              {
                "bullets": [
                  "**molecular layer**",
                  "**Purkinje cell layer**",
                  "**granular cell layer**"
                ]
              },
              {
                "text": "เซลล์ที่ต้องชี้ในคอร์เทกซ์คือ **Purkinje cell, granule cell, basket cells** และ **multipolar neuron** ซึ่งเดคระบุว่าให้ดูใน **B186 (silver stain)**"
              }
            ]
          },
          {
            "sub": "Cerebellar medulla (white matter)",
            "body": [
              {
                "bullets": [
                  "**tract (myelinated fibers)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "DD spinal cord และ B.120",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "sub": "Gray matter",
            "body": [
              {
                "bullets": [
                  "**dorsal horn (interneurons)**",
                  "**ventral horn (motor neurons)**"
                ]
              }
            ]
          },
          {
            "sub": "White matter",
            "body": [
              {
                "bullets": [
                  "**dorsal, lateral, ventral funiculus** ซึ่งเป็น myelinated nerve fiber"
                ]
              }
            ]
          },
          {
            "text": "ต้องชี้ **Central canal** ด้วย โดยเดคกำกับว่าบุด้วย **ependymal glia cells** และให้หา **oligodendrocyte** กับ **astrocytes** ในสไลด์นี้ด้วย"
          }
        ]
      },
      {
        "heading": "A.18 jejunum: ANS ในผนังลำไส้",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "text": "สไลด์ให้ดู autonomic nervous system 2 plexus โดยจำแหน่งที่อยู่เป็นหลัก"
          },
          {
            "bullets": [
              "**Submucosal plexus** อยู่ **between connective tissue layer and muscular layer**",
              "**Myenteric plexus** อยู่ **between 2 layers of muscular wall**"
            ]
          },
          {
            "callout": "เดคไม่ได้เขียนชื่อพ้อง เช่น Meissner plexus หรือ Auerbach plexus ไว้ตรงหัวข้อนี้ และไม่ได้บอกหน้าที่ของทั้งสอง plexus",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Sensory receptor: Pacinian และ Meisner corpuscle",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "bullets": [
              "**B.181 penis และ B.195 pancreas** ให้หา **Pacinian corpuscle**",
              "**K.13 fingertip** ให้หา **Meisner (tactile) corpuscles** (สะกดตามสไลด์)"
            ]
          },
          {
            "callout": "เดคบอกแค่ว่าเจอ corpuscle ชนิดไหนในสไลด์ไหน ไม่ได้อธิบายโครงสร้างชั้น lamella หรือชนิดของ stimulus ที่รับ สไลด์ไม่ได้บอก",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สรุปเช็กลิสต์ก่อนเข้า lab",
        "source": "Laboratory of nervous system histology p.1",
        "body": [
          {
            "text": "เดคทั้งหมดสรุปได้เป็นการจับคู่ เบอร์สไลด์ → อวัยวะ → โครงสร้างที่ต้องชี้ ซึ่งเป็นรูปแบบที่ตรงกับการสอบ lab practical"
          },
          {
            "bullets": [
              "**A.40, B.183** spinal ganglion (lipofuschin ดูที่ B183)",
              "**A.45** celiacomesenteric ganglion, post ganglionic sympathetic neuron",
              "**B.117, B.187** cerebrum (B187 silver stain, multipolar neurons)",
              "**B.176, B.186** cerebellum (B186 silver stain, multipolar neuron)",
              "**DD, B.120** spinal cord",
              "**A.18** jejunum, submucosal และ myenteric plexus",
              "**B.181, B.195** Pacinian corpuscle",
              "**K.13** Meisner (tactile) corpuscles"
            ]
          }
        ]
      }
    ]
  },
  "histo--lymphatic-organ-i": {
    "topic": "histo--lymphatic-organ-i",
    "title": "Lymphatic organ I: Thymus และ Lymph node",
    "icon": "📖",
    "lecturer": "Asst. Prof. Promporn Raksaseri",
    "summary": "เดคนี้ (45 สไลด์) ปูพื้น immune system แล้วลงลึก lymphatic organ 2 อวัยวะเท่านั้นคือ thymus (สไลด์ 14-29) และ lymph node (สไลด์ 30-45) โดยเนื้อความจริงกระจุกอยู่ที่ cortex vs medulla ของ thymus, positive/negative selection, blood-thymus barrier, และโครงสร้าง cortex/paracortex/medulla ของ lymph node พร้อมเส้นทางการไหลของ lymph สไลด์จำนวนไม่น้อย (11-13, 16-18, 22, 24, 27, 33, 35, 37, 43) เป็นรูปประกอบหรือ URL อ้างอิงล้วน ไม่มีข้อความอธิบาย ส่วน spleen tonsils MALTs GALTs ถูกระบุไว้ใน objectives แต่ไม่มีเนื้อหาในเดคนี้",
    "sections": [
      {
        "heading": "Immune system และ Lymphatic system คืออะไร",
        "source": "Lymphatic organ I p.2, p.4",
        "body": [
          {
            "text": "**The immune system provides defense or immunity against infectious agents** สไลด์ให้นิยามสั้น ๆ แค่นี้ แล้วอธิบายต่อในเชิง histology"
          },
          {
            "text": "ในเชิง histology ระบบนี้ประกอบด้วยประชากร leukocytes ที่มีจำนวนมากและหลากหลาย กระจายอยู่ในเนื้อเยื่อทุกส่วนของร่างกาย ร่วมกับ lymphoid organs ซึ่งเชื่อมต่อกันด้วย blood circulation และ lymphatic circulation เท่านั้น"
          },
          {
            "sub": "Lymphatic system ประกอบด้วย 3 ส่วน (p.4)",
            "body": [
              {
                "bullets": [
                  "**group of cells** เดินทางไปยัง lymphatic organ และ tissues ผ่าน blood circulation และ lymphatic circulation",
                  "**lymphatic tissues** เป็นแหล่ง proliferation, differentiation และ maturation ของ lymphocytes",
                  "**organs**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Objectives ของบทนี้",
        "source": "Lymphatic organ I p.3",
        "body": [
          {
            "bullets": [
              "แยกและจำแนกเซลล์ใน immune system ได้ ได้แก่ T cells, B cells, antigen presenting cells (APCs), plasma cells เป็นต้น",
              "รู้หน้าที่ของเซลล์แต่ละชนิดใน immune system",
              "แยก lymphatic organs ได้ ได้แก่ thymus, lymph node, spleen, tonsils, MALTs และ GALTs",
              "อธิบาย physiology ที่สัมพันธ์กับ histology ของ lymphatic organs เหล่านั้นได้"
            ]
          },
          {
            "callout": "objectives ระบุ spleen, tonsils, MALTs, GALTs ไว้ด้วย แต่เดค Part I นี้มีเนื้อหาเฉพาะ thymus และ lymph node เท่านั้น อวัยวะที่เหลือสไลด์ชุดนี้ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Immunocompetent vs Activated",
        "source": "Lymphatic organ I p.5",
        "body": [
          {
            "text": "สไลด์นี้เป็นแผนภาพเทียบสองสถานะ โดยมีข้อความกำกับสั้น ๆ เท่านั้น"
          },
          {
            "bullets": [
              "**Immunocompetent** คือ recognize self vs nonself ได้แล้ว แต่ยัง naïve คือยัง recognize antigen ไม่ได้",
              "**Immunocompetent and can recognize antigen** คือสถานะ activated"
            ]
          }
        ]
      },
      {
        "heading": "คุณสมบัติ 4 ข้อของ immune response",
        "source": "Lymphatic organ I p.6",
        "body": [
          {
            "text": "สไลด์เปิดด้วยคำว่า Defense แล้วระบุว่า **the immune response exhibits four distinctive properties**"
          },
          {
            "bullets": [
              "**specificity** ความสามารถของ adaptive immune system ในการเล็งเป้าไปที่ pathogen ที่จำเพาะ",
              "**diversity** มีรูปแบบภูมิคุ้มกันหลายแบบเพื่อป้องกันได้ดีขึ้น ขึ้นกับ pattern ของการเกิดและความรุนแรงของ pathogen",
              "**memory**",
              "**self/non-self recognition** แยกโครงสร้างที่เป็นของร่างกายเอง (self) ออกจากสิ่งแปลกปลอม (nonself)"
            ]
          },
          {
            "sub": "Innate vs Adaptive ตามที่สไลด์แบ่ง",
            "body": [
              {
                "bullets": [
                  "**Innate immunity** คือ granulocytes และ leucocytes อื่น ๆ เป็นแบบ non-specific",
                  "**Adaptive immunity** คือ lymphocytes และ APCs จำเพาะต่อ microbial invader"
                ]
              },
              {
                "text": "สไลด์เขียนกำกับท้ายไว้ว่า TCR, BCR และ CD marker คือ specific cluster of differentiation marker"
              }
            ]
          }
        ]
      },
      {
        "heading": "Antigen และ Antibody",
        "source": "Lymphatic organ I p.7",
        "body": [
          {
            "text": "**Antibody คือ glycoprotein ใน immunoglobulin family ที่ทำปฏิกิริยาอย่างจำเพาะกับ antigenic determinant**"
          },
          {
            "callout": "สไลด์นี้ให้คำนิยามของ antibody อย่างเดียว ไม่ได้ให้นิยามของ antigen แยกไว้ แม้หัวสไลด์จะเขียนว่า Antigen and Antibody",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Cells of the immune system 1: B-lymphocyte",
        "source": "Lymphatic organ I p.8",
        "body": [
          {
            "bullets": [
              "เป็น **small lymphocytes**",
              "**immunocompetent ที่ bone marrow และที่ bursa of Fabricius ในนก**",
              "ทำหน้าที่ใน **humoral immune response** (Ag-Ab complex) คือ immune response ที่อาศัยการสร้าง antibody"
            ]
          }
        ]
      },
      {
        "heading": "Cells of the immune system 2: T-lymphocyte",
        "source": "Lymphatic organ I p.9",
        "body": [
          {
            "bullets": [
              "**immunocompetent ที่ thymus**",
              "มี **TCR** แสดงออกบนผิวเซลล์ และ recognize specific antigen ได้",
              "มี cell surface markers ที่ใช้ระบุชนิดของ T-cell ได้แก่ cytotoxic, helper, suppressor หรือ regulatory",
              "**recognize ได้เฉพาะ epitope ที่เซลล์อื่นนำมาเสนอให้เท่านั้น**",
              "ทำหน้าที่ใน cell-mediated immune response"
            ]
          }
        ]
      },
      {
        "heading": "Cells of the immune system 3: Antigen presenting cells (APCs)",
        "source": "Lymphatic organ I p.10",
        "body": [
          {
            "text": "APCs เป็นส่วนหนึ่งของ mononuclear phagocytic cells"
          },
          {
            "bullets": [
              "**Professional APCs** ได้แก่ macrophages, specialized dendritic cells ใน lymphoid organs (เช่น thymus, lymph node, skin) และ epithelial reticular cells ใน thymus",
              "**Non-Professional APCs** ได้แก่ fibroblasts และ vascular endothelial cells ซึ่งมี transient expression ของ MHC ระหว่างเกิด inflammation"
            ]
          },
          {
            "text": "**Major Histocompatibility complex (MHC) คือชุดของ cell surface molecule ที่เป็นตัวกลางในการปฏิสัมพันธ์ระหว่าง leukocytes กับ leukocytes อื่นหรือกับเซลล์ของร่างกาย**"
          },
          {
            "text": "อักษรกำกับรูปในสไลด์ M คือ macrophage, R คือ reticular cells, T คือ trabeculae (Mescher, 2016)"
          }
        ]
      },
      {
        "heading": "สไลด์รูป Cell mediated และ Humoral immune response",
        "source": "Lymphatic organ I p.11-13",
        "body": [
          {
            "text": "สามสไลด์นี้เป็นแผนภาพล้วน หัวสไลด์เขียนว่า Cell mediated-Immune Response (p.11) และ Humoral Immune Response (p.12) ส่วน p.13 ไม่มีหัวข้อ ทั้งสามสไลด์อ้าง Mescher, 2016 และ **ไม่มีข้อความอธิบายกลไกในตัวสไลด์เลย** ต้องดูรูปจากไฟล์สไลด์จริงประกอบ"
          }
        ]
      },
      {
        "heading": "Thymus: ภาพรวมและเซลล์ที่พบ",
        "source": "Lymphatic organ I p.15, p.19",
        "body": [
          {
            "text": "สไลด์ระบุว่า thymus เป็น **epithelial lymphoid organ** (p.15)"
          },
          {
            "sub": "Cells in thymus (p.19)",
            "body": [
              {
                "bullets": [
                  "**T lymphoblasts (thymocytes)**",
                  "**macrophages**",
                  "**epithelial reticular cells หรือ thymic epithelial cells (TECs)** มีลักษณะผสมระหว่าง epithelial cells และ reticular cells มี large euchromatic nuclei กับ pale cytoplasm และ morphology กับ function หลากหลาย",
                  "**dendritic cells** ซึ่งสไลด์กำกับไว้ว่า **ไม่สามารถเห็นได้ด้วย H&E**"
                ]
              }
            ]
          },
          {
            "text": "p.17 มีคำกำกับรูปว่า incomplete separated medulla ส่วน p.16, p.18 และ p.22 เป็นรูปหรือ URL อ้างอิงล้วน ไม่มีข้อความ"
          }
        ]
      },
      {
        "heading": "Thymic cortex",
        "source": "Lymphatic organ I p.20",
        "body": [
          {
            "bullets": [
              "**epithelial reticular cells Type I, II, III**",
              "**cytoreticulum เกิดจากการเชื่อมต่อกันของ process ของ TECs ด้วย desmosome**",
              "**T-lymphocytes**"
            ]
          }
        ]
      },
      {
        "heading": "Thymic medulla และ Hassall's corpuscle",
        "source": "Lymphatic organ I p.21",
        "body": [
          {
            "bullets": [
              "**ติดสีจางกว่า cortex**",
              "**มี lymphocytes น้อยกว่า และมี epithelial reticular cells มากกว่า**",
              "**epithelial reticular cells Type IV, V, VI**"
            ]
          },
          {
            "sub": "Thymic corpuscle (Hassall's corpuscle)",
            "body": [
              {
                "bullets": [
                  "เกิดจาก **Type VI epithelial reticular cells** ซึ่งเป็นเซลล์ขนาดใหญ่ ติดสีจาง มารวมตัวซ้อนกันเป็นวง (whorl-shaped)",
                  "สไลด์ระบุว่า speculate ว่าทำหน้าที่เป็น **site of death T-cell ใน medulla**",
                  "**จำนวน thymic corpuscle เพิ่มขึ้นตามอายุ**",
                  "**Produce interleukins** ซึ่งเป็น cytokines ชนิดหนึ่ง สำคัญต่อ T cell proliferation และ maturation",
                  "**Contains keratohyaline granules**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Histophysiology of the Thymus: positive และ negative selection",
        "source": "Lymphatic organ I p.23",
        "body": [
          {
            "text": "**Primary function ของ thymus คือ instruct immunoincompetent ให้กลายเป็น immunocompetent T-cell โดยอาศัย positive selection ใน cortex และ negative selection ใน medulla**"
          },
          {
            "sub": "In cortex: T cells ต้องผ่าน 3 ข้อ",
            "body": [
              {
                "bullets": [
                  "express surface markers **CD4, CD8** ซึ่งสไลด์กำกับว่า **ทำหน้าที่เป็น co-receptor ของ TCR**",
                  "TCR ต้องจับกับ **MHC molecules ของ epithelial reticular cells** ได้",
                  "**TCR ต้องไม่ recognize self antigen** (บน APC cells) สไลด์กำกับว่า ถ้า recognize self antigen จะเกิด auto-immune disease"
                ]
              }
            ]
          },
          {
            "sub": "In medulla",
            "body": [
              {
                "text": "T cells เกิด maturation และกลายเป็น immunocompetent"
              }
            ]
          },
          {
            "callout": "p.24 เป็นรูป cortex กับ medulla ประกอบ ไม่มีข้อความอธิบายเพิ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "หน้าที่ของ Epithelial reticular cells (TECs)",
        "source": "Lymphatic organ I p.25",
        "body": [
          {
            "bullets": [
              "**แยก thymic cortex ออกจากภายนอกอย่างสมบูรณ์ เพื่อป้องกันไม่ให้ developing T-cells สัมผัสกับ foreign antigens**",
              "**สร้าง hormone อย่างน้อย 4 ชนิดที่จำเป็นต่อ maturation ของ T-cell ได้แก่ thymosin, thymopoietin, thymulin และ thymic humoral factor**",
              "ส่งเสริม T-cell proliferation และการแสดงออกของ surface markers",
              "ทำหน้าที่เป็น APCs โดย express MHC molecules"
            ]
          }
        ]
      },
      {
        "heading": "Vascular supply ของ thymus",
        "source": "Lymphatic organ I p.26",
        "body": [
          {
            "text": "สไลด์วางลำดับเส้นทางไว้ดังนี้ immunoincompetent T-cell จาก bone marrow เข้าที่ corticomedullary junction แล้วไป periphery of cortex ไป deep cortex และไป medulla"
          },
          {
            "text": "**Post capillary venules ที่ corticomedullary junction หรือใน medulla เป็นตัวนำ immunocompetent T cells ออกสู่ blood circulation และ secondary lymphoid organs**"
          },
          {
            "callout": "p.27 หัวสไลด์เขียนว่า Blood supply in thymus แต่มีเพียง URL อ้างอิงกับรูป ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "T cell production ตามลำดับในสไลด์",
        "source": "Lymphatic organ I p.28",
        "body": [
          {
            "bullets": [
              "**T progenitor (stem cells) จาก bone marrow** วิ่งผ่าน capillaries ที่ CMJ ไปยัง outer cortex",
              "เกิด **clonal expansion** และสร้าง cell surface receptors",
              "ถูกกำกับโดย **macrophages ที่หลั่ง IL-1** และ **epithelial reticular cells ที่หลั่ง thymosin**",
              "เกิด **positive selection of T cells**",
              "**ค่อย ๆ เคลื่อนเข้าหา medulla ด้วยแรงดันจาก T progenitor cells ที่เข้ามาใหม่** เพื่อเข้าสู่ negative selection และ T cell maturation"
            ]
          }
        ]
      },
      {
        "heading": "Blood thymus barrier",
        "source": "Lymphatic organ I p.29",
        "body": [
          {
            "bullets": [
              "**capillaries ใน cortex เป็นชนิด continuous type มี basal lamina หนา และถูกห่อหุ้มด้วยปลอกของ type I epithelial reticular cells กลายเป็น blood-thymus barrier**",
              "โครงสร้างนี้จัดวางเพื่อ **ปกป้อง developing T-cell จาก blood borne molecules** ผลที่ได้คือ non-sensitized T cell",
              "**Epithelial reticular cells เป็นตัวควบคุมว่าจะยอมให้ self-macromolecules ผ่านหรือไม่**"
            ]
          }
        ]
      },
      {
        "heading": "Lymph node: นิยามและองค์ประกอบ",
        "source": "Lymphatic organ I p.31",
        "body": [
          {
            "bullets": [
              "**เป็นโครงสร้างรูปไข่ที่มี capsule หุ้ม แทรกอยู่บนเส้นทางของ lymph vessels ทำหน้าที่เป็น filter กำจัด bacteria และสิ่งแปลกปลอมอื่น ๆ**",
              "**parenchyma ประกอบด้วย T และ B lymphocytes, APCs และ macrophages ซึ่งมี phagocytic activity**"
            ]
          }
        ]
      },
      {
        "heading": "เส้นทางการไหลของ lymph ผ่าน lymph node",
        "source": "Lymphatic organ I p.32",
        "body": [
          {
            "text": "สไลด์เรียงลำดับไว้ตรง ๆ ต้องจำให้ได้ทั้งลำดับ"
          },
          {
            "bullets": [
              "**Afferent lymph vessel**",
              "**Subcapsular sinus**",
              "**Trabecular (cortical) sinus**",
              "**Medullary sinus**",
              "**Efferent lymph vessel**"
            ]
          },
          {
            "callout": "p.35 เป็นรูปประกอบ มีคำกำกับว่า capsule, subcapsular และ trabecular sinuses และ reticular cells พร้อม URL อ้างอิง ไม่มีข้อความอธิบาย ส่วน p.33 เป็นรูปล้วน ไม่มีคำกำกับและไม่มี URL",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Histology of lymph node: 5 ส่วนหลัก",
        "source": "Lymphatic organ I p.34, p.36",
        "body": [
          {
            "bullets": [
              "**Capsule**",
              "**Sinuses**",
              "**Cortex**",
              "**Paracortex**",
              "**Medulla**"
            ]
          },
          {
            "sub": "อักษรกำกับรูปที่ต้องอ่านออก (p.34)",
            "body": [
              {
                "bullets": [
                  "LN คือ lymphatic nodule, CT คือ connective tissue หรือ capsule",
                  "MS คือ medullary sinus, MC คือ medullary cord",
                  "S คือ subcapsular sinus, C คือ capsule, N คือ lymphatic nodule"
                ]
              }
            ]
          },
          {
            "sub": "Cortex (p.36)",
            "body": [
              {
                "bullets": [
                  "**เป็นร่างแห 3 มิติของ reticular connective tissue (reticular cells กับ reticular fibers) ซึ่งเป็นโครงสร้างค้ำจุนของ lymph node ทั้งก้อน**",
                  "ประกอบด้วย lymphatic nodules (lymphoid follicle) หลายอัน",
                  "มี capsule คลุมอยู่"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Lymphoid nodules ใน cortex: primary vs secondary",
        "source": "Lymphatic organ I p.38",
        "body": [
          {
            "sub": "Primary lymphoid nodules",
            "body": [
              {
                "bullets": [
                  "อยู่ใน cortex",
                  "**เป็นกลุ่มทรงกลมของ B lymphocytes ทั้ง virgin B cells และ B memory cells**"
                ]
              }
            ]
          },
          {
            "sub": "Secondary lymphoid nodules",
            "body": [
              {
                "bullets": [
                  "**ติดสีจางที่ germinal center (GC) ซึ่งอยู่กลาง lymphoid follicle**",
                  "**เกิดขึ้นเฉพาะเมื่อมี antigenic challenge เท่านั้น**",
                  "เป็นแหล่งสร้าง lymphoblasts, B memory cell และ plasma cell",
                  "M ในรูปคือ mantle layer"
                ]
              }
            ]
          },
          {
            "sub": "Follicular dendritic cells",
            "body": [
              {
                "bullets": [
                  "สไลด์กำกับว่า **ต้องย้อม IHC จึงจะเห็น** และ **ทำหน้าที่เป็น APC**",
                  "เป็น non-migratory cells",
                  "**อยู่ตรงกลางของ primary และ secondary lymphoid follicles เพื่อดักจับ antigens**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Paracortex",
        "source": "Lymphatic organ I p.39",
        "body": [
          {
            "bullets": [
              "**เป็นบริเวณของ lymph node ระหว่าง cortex กับ medulla**",
              "**ส่วนใหญ่เป็น T cells จึงเรียกว่า thymus dependent zone ของ lymph node**",
              "**APCs อพยพมาที่บริเวณนี้เพื่อนำเสนอ epitope-MHC II complex ให้ T helper cells**",
              "**Activated T helper cells จะ proliferate ทำให้ความกว้างของ paracortex เพิ่มขึ้น**",
              "T cells ที่สร้างใหม่จะเคลื่อนไปที่ medullary sinuses ออกจาก lymph node แล้วไปยังบริเวณที่มี antigenic activity"
            ]
          },
          {
            "callout": "p.37 เป็นรูป cortex, paracortex และ medulla ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Medulla ของ lymph node",
        "source": "Lymphatic organ I p.40, p.41",
        "body": [
          {
            "bullets": [
              "**ประกอบด้วย lymph sinuses ขนาดใหญ่และคดเคี้ยว (medullary sinuses) ล้อมรอบด้วยกลุ่มของ lymphoid cells ที่เรียกว่า medullary cords**",
              "**Medullary cord ประกอบด้วย lymphocytes, plasma cells และ macrophages ที่พันอยู่ในร่างแหของ reticular fibers** โดยมี process ยื่นเข้าไปใน sinuses เพื่อ phagocytose สิ่งแปลกปลอม"
            ]
          },
          {
            "text": "อักษรกำกับรูป p.41 MS คือ medullary sinus, MC คือ medullary cord และลูกศรชี้ที่ plasma cells (Mescher, 2014)"
          }
        ]
      },
      {
        "heading": "Function of lymph node",
        "source": "Lymphatic organ I p.42",
        "body": [
          {
            "text": "**หน้าที่คือ filter the lymph และตอบสนองทาง immunology ต่อ antigens** สไลด์แจกแจงกลไกเป็น 3 ข้อ"
          },
          {
            "bullets": [
              "**macrophage** ทำทั้ง filtration และ immune response เข้ามาทาง lymph vessels ดักจับ antigen ใน lymph แล้วอพยพเข้า cortex เพื่อนำเสนอต่อ lymphocytes",
              "**reticular cells และ cell processes ของ sinuses ทำให้ lymph ไหลช้าลง เปิดโอกาสให้ macrophages ได้พบกับ antigens**",
              "**Lymphocytes เข้าสู่ lymph node ทาง high endothelial venule (HEV)** ไปยัง lymphatic nodules ใน cortex"
            ]
          },
          {
            "sub": "ชะตากรรมของ lymphocytes ที่เข้ามา",
            "body": [
              {
                "bullets": [
                  "**activated B cells เคลื่อนไป medulla กลายเป็น plasma cells สร้าง antibody**",
                  "**B cell ที่ differentiate ไม่สมบูรณ์ กลายเป็น memory B cells**",
                  "**T lymphocytes ไปที่ deep cortex และ paracortex เกิด clonal expansion**"
                ]
              }
            ]
          },
          {
            "callout": "p.43 หัวสไลด์เขียนว่า High Endothelial Venule (HEV) แต่เป็นรูปล้วน สไลด์ไม่ได้บอกรายละเอียดโครงสร้างของ HEV เพิ่มเติม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lymph node กับ antigen recognition และ secondary response",
        "source": "Lymphatic organ I p.44",
        "body": [
          {
            "bullets": [
              "**lymph node เป็น site of antigen recognition เพราะ APCs ที่สัมผัส antigen จะอพยพไปยัง lymph node ที่ใกล้ที่สุด แล้วนำเสนอ epitope-MHC complex ให้ lymphocytes ทำให้ T cells recognize antigen ได้**",
              "ถ้า antigen ถูก recognize และ B cells ถูก activate **B cell นั้นจะย้ายไปที่ primary lymphoid nodule แล้วเปลี่ยนเป็น secondary lymphoid nodule** เซลล์ที่เกิดใหม่ differentiate เป็น B memory และ plasma cells ออกจาก cortex ไปสร้าง medullary cord",
              "**plasma cells ที่เกิดใหม่ 10% อยู่ต่อใน medulla และปล่อย antibody เข้าสู่ medullary sinuses ส่วนที่เหลือเดินทางไป bone marrow และสร้าง antibody จนกระทั่งตาย**",
              "**B memory cells บางส่วนอยู่ต่อใน primary lymphoid nodules แต่ส่วนใหญ่ออกจาก lymph node ไปอาศัยใน secondary lymphatic organs อื่น**",
              "**ด้วยวิธีนี้ เมื่อเจอ antigen เดิมซ้ำครั้งที่สอง จะมี memory cells จำนวนมากพร้อมใช้ ร่างกายจึงตอบสนองแบบ secondary response ได้รวดเร็วและรุนแรง**"
            ]
          }
        ]
      },
      {
        "heading": "สไลด์สรุป Enemy at the gates",
        "source": "Lymphatic organ I p.45",
        "body": [
          {
            "text": "สไลด์ปิดท้ายเป็นแผนภาพสรุปที่มีแต่คำสั้น ๆ กระจายรอบรูป ไม่มีประโยคอธิบาย คำที่ปรากฏได้แก่ APC, T, in blood circulation, lymph node, proliferate, bone marrow, blood circulation, Tact, B, form secondary LN, paracortex expansion, memory B, plasma cell, activated และ germinal center in lymphatic nodules"
          },
          {
            "callout": "ลำดับเหตุการณ์ที่แน่นอนของแผนภาพนี้ สไลด์ไม่ได้เขียนเป็นข้อความ ให้ดูรูปในไฟล์สไลด์จริงประกอบกับเนื้อหา p.42 และ p.44",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "histo--lymphatic-organs-ii": {
    "topic": "histo--lymphatic-organs-ii",
    "title": "Lymphatic organs II: MALT, tonsils และ spleen",
    "icon": "📖",
    "lecturer": "Asst. Prof. Dr. Promporn Raksaseri, Department of Anatomy",
    "summary": "เด็คนี้ต่อจาก Lymphatic organs I โดยเน้น secondary lymphoid organ ที่ไม่มีแคปซูลสมบูรณ์และม้าม แบ่งเป็น 3 ก้อนใหญ่: (1) MALT รวม diffuse lymphoid tissue, lymphatic nodules, M cell (p.2-5) (2) tonsils (p.6-8) และ (3) spleen ซึ่งกินพื้นที่มากที่สุดตั้งแต่โครงสร้าง หลอดเลือด white pulp red pulp marginal zone ไปจนถึง histophysiology (p.9-24) ปิดท้ายด้วย follicular dendritic cell (p.26-27) ข้อควรรู้อย่างซื่อสัตย์คือประมาณ 11 จาก 29 สไลด์เป็นรูปภาพหรือลิงก์อ้างอิงล้วน ๆ ไม่มีข้อความอธิบาย (p.8, 10, 11, 13, 15, 17, 18, 22, 25, 28, 29) เนื้อหาที่จับต้องได้จึงมาจากสไลด์ที่เหลือ",
    "sections": [
      {
        "heading": "MALT คืออะไร และอยู่ที่ไหน",
        "source": "Lymphatic organs II p.2",
        "body": [
          {
            "text": "**MALT (Mucosa-Associated Lymphoid Tissue) เป็น secondary lymphoid structure ซึ่งเป็นที่ที่ lymphocyte ส่วนใหญ่ถูก activate โดยการ antigen presentation** สไลด์จัดกลุ่ม secondary lymphoid structure ไว้ 3 อย่างคือ MALT, lymph node และ spleen"
          },
          {
            "bullets": [
              "Mucosa ของ digestive, respiratory และ urogenital tract เป็นตำแหน่งที่เชื้อโรคเข้าสู่ร่างกายได้บ่อย",
              "เพื่อป้องกันผู้บุกรุกเหล่านี้ mucosal connective tissue จึงมี lymphocyte กระจายอยู่จำนวนมาก, IgA secreting plasma cells, APCs และ lymphoid nodules ซึ่งทั้งหมดรวมกันเรียกว่า MALT"
            ]
          }
        ]
      },
      {
        "heading": "Diffuse lymphoid tissue และ lymphatic nodules",
        "source": "Lymphatic organs II p.3",
        "body": [
          {
            "text": "สไลด์แบ่งองค์ประกอบเป็น 2 ส่วนคือ (1) localized lymphocyte infiltration และ (2) lymphoid nodules ใน mucosa ของ gastrointestinal, respiratory และ urinary tract โดยตำแหน่งที่พบ lymphocyte คือ lamina propria (ใน tunica mucosa) และ tunica submucosa"
          },
          {
            "text": "หน้าที่คือ **guard the body against pathogenic substances และเป็นตำแหน่งของ initial immune response**"
          },
          {
            "sub": "เส้นทางของ lymphocyte หลังเจอ antigen",
            "body": [
              {
                "text": "หลัง lymphocyte สัมผัส antigen จะเดินทางไปที่ regional lymph node เพื่อ proliferation และ differentiation จากนั้น progeny ของเซลล์เหล่านี้จะกลับมาที่ lamina propria ในสภาพ effector B และ T cells"
              }
            ]
          },
          {
            "sub": "เซลล์อื่นที่พบร่วม และการเรียกชื่อตามตำแหน่ง",
            "body": [
              {
                "bullets": [
                  "Reticular cells, plasma cells, APCs เช่น macrophages",
                  "Non-encapsulated lymphoid tissue เรียกรวมว่า MALT",
                  "GALT = gut-associated lymphoid tissue",
                  "BALT = bronchus-associated lymphoid tissue"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์นี้แยกภาพเป็น isolated lymphatic nodule กับ aggregated lymphatic nodules แต่ไม่ได้เขียนคำนิยามความต่างของสองแบบนี้เป็นข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ภาพ aggregated lymphatic nodules",
        "source": "Lymphatic organs II p.4",
        "body": [
          {
            "text": "สไลด์นี้เป็นภาพประกอบพร้อมคีย์ตัวย่อ ไม่มีคำบรรยายเชิงเนื้อหาเพิ่ม"
          },
          {
            "bullets": [
              "V = villi, N = lymphoid nodules จากภาพ ileum ย้อม H&E ดูด้วย light microscope",
              "ภาพ SEM ที่ลอก epithelial cells ออก แสดง lymphoid nodules (N)"
            ]
          }
        ]
      },
      {
        "heading": "M cell ใน Peyer's patch",
        "source": "Lymphatic organs II p.5",
        "body": [
          {
            "text": "สไลด์แสดงภาพ TEM ของ Peyer's patch พร้อมคีย์ B = brush border, E = cytoplasm ของ enterocyte ข้างเคียง, L = lymphocytes, D = dendritic cells, BM = basement membrane"
          },
          {
            "sub": "ลักษณะของ M (Microfold) cell",
            "body": [
              {
                "bullets": [
                  "มี short apical fold แต่ **ไม่มี brush border**",
                  "มี large intracellular pocket ที่มี T cells, B cells และ dendritic cells อยู่ชั่วคราว (transient)",
                  "**antigen ใน intestinal lumen จะถูกจับเข้ามาที่ intracellular pocket แล้ว dendritic cells เป็นตัว uptake ต่อ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Tonsils: ชนิดและตำแหน่ง",
        "source": "Lymphatic organs II p.6",
        "body": [
          {
            "bullets": [
              "Palatine tonsils เป็นคู่ (pairs) และมองเห็นได้",
              "Pharyngeal tonsil ลักษณะ diffuse",
              "Lingual tonsils ขนาดเล็ก อยู่ที่ base of the tongue"
            ]
          }
        ]
      },
      {
        "heading": "Tonsils: โครงสร้าง เยื่อบุ และเซลล์",
        "source": "Lymphatic organs II p.7",
        "body": [
          {
            "text": "**Tonsil เป็น incompletely encapsulated aggregation ของ lymphoid nodule ที่เฝ้าทางเข้าของ oral pharynx** วางแทรกอยู่ในเส้นทางของ antigen ที่มากับอากาศและที่กินเข้าไป (airborne และ ingested antigens) และตอบสนองต่อ antigen เหล่านี้ด้วยการสร้าง lymphocyte และก่อ immune response"
          },
          {
            "sub": "Epithelium ตามตำแหน่ง",
            "body": [
              {
                "bullets": [
                  "Oropharynx: stratified squamous epithelium",
                  "Nasopharynx: pseudostratified columnar epithelium"
                ]
              }
            ]
          },
          {
            "sub": "จุดที่สไลด์ระบุเป็นเฉพาะสัตว์",
            "body": [
              {
                "text": "**Lingual tonsil ใน horse, pigs และ ruminants มี tonsillar crypts (tonsillar fossulae)** โดยสไลด์กำกับไว้ว่ามีได้หลายตำแหน่ง"
              }
            ]
          },
          {
            "sub": "เซลล์ที่พบ",
            "body": [
              {
                "bullets": [
                  "Lymphocytes, PMN, macrophages",
                  "Salivary corpuscles พบใน tonsillar fossulae"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.8 เป็นภาพ tonsil ของคนล้วน ๆ ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Spleen: ภาพรวม หน้าที่ และองค์ประกอบหลัก",
        "source": "Lymphatic organs II p.9",
        "body": [
          {
            "text": "**ม้ามเป็น largest lymphoid organ ในร่างกาย และจัดเป็น secondary lymphoid organ**"
          },
          {
            "sub": "หน้าที่ 3 ข้อตามสไลด์",
            "body": [
              {
                "bullets": [
                  "immunologic capacity ของ T cell และ B cell proliferation",
                  "antibody formation",
                  "filter of the blood โดยทำลาย old erythrocytes"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้าง",
            "body": [
              {
                "bullets": [
                  "Hilum: ที่ที่ arteries และ nerves เข้า และที่ veins กับ lymph vessel ออก",
                  "Capsule: dense, irregular fibroelastic connective tissue บางครั้งมี smooth muscle cells",
                  "Trabeculae",
                  "Parenchyma: เป็น 3-dimensional network ของ reticular fibers และ reticular cells รวมทั้ง venous sinuses"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ p.10 และ p.11 เป็นภาพโครงสร้างม้ามจากเว็บอ้างอิงภายนอก ไม่มีข้อความบรรยายของตัวเอง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Vascular supply ของม้าม",
        "source": "Lymphatic organs II p.12",
        "body": [
          {
            "text": "สไลด์ไล่ทางเดินเลือดขาออกไว้ว่า **splenic sinuses ไป veins of the pulp ไป splenic vein และไป portal vein**"
          },
          {
            "sub": "ลำดับหลอดเลือดแดง",
            "body": [
              {
                "bullets": [
                  "Trabecular arteries",
                  "**Central artery (central arteriole หรือ artery of the white pulp) อยู่ตรงกลางของ periarterial lymphatic sheath (PALS)** ซึ่ง PALS คือ tunica adventitia ที่ถูกแทรกด้วย sheath ของ lymphocyte",
                  "Penicillar arteries: เข้าสู่ red pulp"
                ]
              }
            ]
          },
          {
            "sub": "แขนงย่อยของ penicillar arteries",
            "body": [
              {
                "bullets": [
                  "pulp arteriole",
                  "**sheathed arteriole หรือ sheathed capillary หรือ ellipsoid** = ส่วนที่ผนังหลอดเลือดหนาขึ้นเพราะถูกล้อมด้วย sheath ของ macrophages",
                  "terminal arterial capillaries"
                ]
              }
            ]
          },
          {
            "text": "สไลด์อ้างอิง Mesher, 2016"
          }
        ]
      },
      {
        "heading": "PALS และ central artery",
        "source": "Lymphatic organs II p.14",
        "body": [
          {
            "text": "**PALS = periarterial lymphatic sheath คือ T lymphocytes ที่แทรกอยู่ใน tunica adventitia ของ central artery**"
          },
          {
            "text": "คีย์ภาพ: W = white pulp, R = red pulp, ลูกศร = PALS"
          },
          {
            "callout": "p.13, p.15 เป็นภาพเนื้อเยื่อที่มีเพียงป้ายกำกับ white pulp กับ red pulp หรือไม่มีข้อความเลย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "White pulp และ marginal zone",
        "source": "Lymphatic organs II p.16",
        "body": [
          {
            "text": "**White pulp = PALS (ประกอบด้วย T lymphocytes) + splenic (lymphatic) nodules**"
          },
          {
            "bullets": [
              "พบบ่อยว่า lymphoid nodules ซึ่งประกอบด้วย B lymphocytes ถูกล้อมอยู่ภายใน PALS และ **ดัน central arteriole ไปอยู่ตำแหน่งขอบ (peripheral position)**",
              "Lymphoid nodules อาจแสดง germinal centers ซึ่งบ่งชี้ว่ามี antigenic challenge",
              "Marginal sinuses = small vascular channels ที่ล้อมรอบ lymphoid nodules",
              "**White pulp ถูกล้อมด้วย marginal zone ซึ่งเป็นตัวคั่นระหว่าง white pulp กับ red pulp** ประกอบด้วย plasma cells, T และ B lymphocytes, macrophages และ interdigitating dendritic cells (APCs)"
            ]
          },
          {
            "callout": "p.17 และ p.18 เป็นภาพ marginal zone ล้วน ไม่มีคำอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Primary vs secondary lymphatic nodule",
        "source": "Lymphatic organs II p.19",
        "body": [
          {
            "text": "**Primary lymphatic nodule ประกอบด้วย small lymphocytes เป็นหลัก**"
          },
          {
            "sub": "Secondary lymphatic nodule ประกอบด้วย 2 ส่วน",
            "body": [
              {
                "text": "(1) **Germinal center ติดสีจาง (lightly stain) เพราะเต็มไปด้วย large immature lymphocytes ได้แก่ lymphoblasts และ plasmablasts** ซึ่งนิวเคลียสของเซลล์อ่อนเหล่านี้มี euchromatin ปริมาณมาก GC แทน cascade ของการ activation และ proliferation ของ lymphocyte, การ differentiation เป็น plasma cell และการสร้าง antibody"
              },
              {
                "text": "(2) **Mantle zone คือวงนอกของ small lymphocytes ที่ล้อมรอบ germinal center**"
              }
            ]
          }
        ]
      },
      {
        "heading": "เหตุการณ์ที่เกิดขึ้นที่ marginal zone",
        "source": "Lymphatic organs II p.20",
        "body": [
          {
            "text": "**ช่องว่างกว้างระหว่าง endothelial cells ของ sinuses ทำให้ antigen เข้าถึง parenchyma ของม้ามได้**"
          },
          {
            "bullets": [
              "APCs เช่น macrophages คอยค้นหา antigen ในเลือด",
              "Macrophages จัดการ microorganisms ที่อยู่ในเลือด",
              "T และ B lymphocytes ที่หมุนเวียนในกระแสเลือดออกจาก bloodstream เพื่อเข้าสู่ตำแหน่งที่มันชอบภายใน white pulp",
              "Lymphocytes เข้าสัมผัสกับ interdigitating dendritic cells (APCs) เมื่อจดจำ epitope-MHC complex ได้ ก็เริ่ม immune response ภายใน white pulp"
            ]
          },
          {
            "sub": "แยกให้ออกระหว่าง dendritic cell สองชนิด",
            "body": [
              {
                "bullets": [
                  "**Interdigitating dendritic cells (IDC) คือชื่อเฉพาะของ dendritic cell ที่อยู่ใน T-cell area ของ secondary lymphoid tissue** ได้แก่ lymph nodes และ spleen",
                  "**Follicular dendritic cells (FDCs) เป็น antigen-presenting dendritic cell ชนิดพิเศษที่จำกัดอยู่เฉพาะใน lymphoid follicles เป็นส่วนใหญ่**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Red pulp",
        "source": "Lymphatic organs II p.21",
        "body": [
          {
            "bullets": [
              "**Splenic sinuses**: มี endothelial lining ที่ถูกล้อมด้วย reticular fibers และมี macrophages จำนวนมากใน sinuses",
              "**Splenic cords**: loose network ของ reticular fibers"
            ]
          },
          {
            "callout": "p.22 เป็นภาพ red pulp ล้วน ไม่มีข้อความอธิบาย",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Histophysiology ของม้าม",
        "source": "Lymphatic organs II p.23",
        "body": [
          {
            "sub": "หน้าที่ 4 ข้อ",
            "body": [
              {
                "bullets": [
                  "filtration of the blood",
                  "formation of lymphoid cells",
                  "elimination หรือ inactivation ของ bloodborne antigens",
                  "destruction of erythrocytes"
                ]
              }
            ]
          },
          {
            "sub": "ที่ marginal zone และ marginal sinus",
            "body": [
              {
                "bullets": [
                  "**Plasma cell ที่สะสมอยู่จะสร้าง Ab หรือย้ายไป bone marrow แล้วปล่อย Ab เข้า bone marrow sinuses**",
                  "ที่ marginal sinus: macrophages phagocytose bloodborne antigen แล้วถูกกำจัดต่อใน splenic sinuses ของ red pulp"
                ]
              }
            ]
          },
          {
            "sub": "การสร้าง lymphoid cells",
            "body": [
              {
                "text": "Lymphoid cells ถูกสร้างใน white pulp เพื่อตอบสนองต่อ antigenic challenge โดย **B cells และ plasma cells อยู่ใน nodules ส่วน T cells อยู่ใน PALS** จากนั้น B และ T cells ที่สร้างใหม่จะเข้าสู่ marginal sinuses แล้วย้ายไปยังตำแหน่งที่มี antigenic challenge หรือกลายเป็นส่วนหนึ่งของ circulatory pool ของ lymphocyte"
              }
            ]
          },
          {
            "text": "Soluble bloodborne antigens ถูก inactivate ด้วย Ab ก่อน แล้ว macrophages จึง phagocytose"
          }
        ]
      },
      {
        "heading": "การทำลายเม็ดเลือดแดงในม้าม",
        "source": "Lymphatic organs II p.24",
        "body": [
          {
            "text": "**เม็ดเลือดแดงที่มี deformability ลดลงจะผ่าน slit ในม้ามไม่ได้ จึงถูกกักไว้ใน splenic cord และถูกทำลายโดย macrophage ในที่สุด** (สไลด์อ้าง Thiagarajan et al., 2021)"
          },
          {
            "bullets": [
              "**ช่องว่างระหว่าง endothelial cells ที่อยู่ติดกันของ splenic sinuses กว้าง 2-3 µm** ทำให้ macrophage เคลื่อนจาก splenic cord แทรกผ่านระหว่าง endothelial cells เข้าไปใน sinus แล้ว phagocytose RBC เก่าได้",
              "ระหว่างการทำลาย RBC ใน macrophage จะมีการปล่อย Fe2+ ออกจาก hemoglobin เก็บไว้ใน macrophage แล้วส่งกลับเข้าสู่ circulation เพื่อนำกลับไปใช้ใหม่ โดยหลักคือใช้ใน erythropoiesis"
            ]
          }
        ]
      },
      {
        "heading": "Follicular dendritic cell (FDC): ลักษณะทางเซลล์วิทยา",
        "source": "Lymphatic organs II p.26",
        "body": [
          {
            "text": "**FDC มี mesenchymal origin**"
          },
          {
            "bullets": [
              "นิวเคลียสกลม (round nuclei)",
              "nucleoli อยู่ตรงกลาง (centrally located)",
              "chromatin แบบ bland และ dispersed"
            ]
          }
        ]
      },
      {
        "heading": "FDC ใน reactive germinal center",
        "source": "Lymphatic organs II p.27",
        "body": [
          {
            "text": "สไลด์นี้เป็นภาพจากแหล่งอ้างอิงภายนอกพร้อมคำบรรยายภาพว่า **FDC ใน reactive germinal center มักดูออกได้จากนิวเคลียสขนาดกลาง ที่มีเยื่อหุ้มนิวเคลียสขอบเขตชัดเจน (well demarcated membranes) และมี nucleolus เล็กเพียงอันเดียว** โดย paired nuclei มักแสดง membrane molding (ตำแหน่งที่ลูกศรชี้)"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นรูปหรือแหล่งอ้างอิงล้วน",
        "source": "Lymphatic organs II p.25",
        "body": [
          {
            "text": "หน้า Conclusion (p.25) เป็นแผนภาพสรุปจาก Mesher, 2014 โดยไม่มีข้อความสรุปเป็นตัวหนังสือ ดังนั้น **สไลด์ไม่ได้บอก** ว่าอาจารย์สรุปประเด็นใดเป็นข้อ ๆ ถ้าต้องการสรุป ให้ย้อนกลับไปดูจากภาพในสไลด์จริง"
          },
          {
            "text": "หน้าอื่นที่ไม่มีเนื้อหาเป็นข้อความ: p.8 (ภาพ tonsil คน), p.10 และ p.11 (โครงสร้างม้ามจากลิงก์ภายนอก), p.13, p.15, p.17, p.18, p.22 (ภาพ white pulp / marginal zone / red pulp), p.28 (ลิงก์ Yale medcell lymphatics lab) และ p.29 (ว่าง)"
          },
          {
            "callout": "อ่านโน้ตนี้คู่กับไฟล์สไลด์ตัวจริงเสมอ เพราะภาพเกือบทั้งหมดของเด็คนี้คือส่วนที่ต้องดูด้วยตา ไม่สามารถถอดเป็นข้อความได้",
            "kind": "tip"
          }
        ]
      }
    ]
  },
  "histo--male-reproductive-system": {
    "topic": "histo--male-reproductive-system",
    "title": "Male Reproductive System",
    "icon": "📖",
    "summary": "เด็คนี้ไล่ระบบสืบพันธุ์เพศผู้ตามลำดับทางเดินของ spermatozoa ตั้งแต่ testis (tunica albuginea, septula/mediastinum, testicular lobule, seminiferous tubule, tubuli recti, rete testis) ผ่าน epididymis, ductus deferens, accessory glands, urethra ไปจนถึง penis และ prepuce โดยเน้น histological structure และชนิด epithelium ของแต่ละส่วน พร้อมความแตกต่างระหว่างสปีชีส์ของต่อมและชนิด penis สไลด์ที่ 47 เป็นต้นไป (p.47-59) เป็นชุด lab slide checklist บอกชื่อโครงสร้างที่ต้องหาให้เจอในสไลด์จริง แทบไม่มีคำอธิบายเพิ่ม ส่วน p.1, 28, 33, 40, 41, 60 เป็นหน้าที่ไม่มี text (เป็นรูปหรือหน้าเปล่า) สไลด์ไม่ได้อธิบายกลไกระดับ molecular ของ spermatogenesis หรือ capacitation เพิ่มเติมนอกจากชื่อขั้นตอน",
    "sections": [
      {
        "heading": "องค์ประกอบและหน้าที่ของระบบ",
        "source": "Male Reproductive System p.2-3",
        "body": [
          {
            "text": "เด็คแบ่งอวัยวะออกเป็น **7 ส่วน** แล้วไล่อธิบายทีละส่วนตามลำดับนี้ทั้งเล่ม"
          },
          {
            "bullets": [
              "1. Testis",
              "2. Epididymis",
              "3. Ductus deferens",
              "4. Accessory (sex) glands",
              "5. Urethra",
              "6. Penis",
              "7. Prepuce"
            ]
          },
          {
            "sub": "Functions ที่สไลด์ระบุ (p.3)",
            "body": [
              {
                "bullets": [
                  "Produce spermatozoa",
                  "Produce hormones",
                  "Transport spermatozoa",
                  "Maturate and store spermatozoa",
                  "Secrete necessary fluid",
                  "Copulate and deposit spermatozoa",
                  "Protect penis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Testis: เปลือกและโครงร่างพยุง",
        "source": "Male Reproductive System p.4-7",
        "body": [
          {
            "text": "หัวข้อย่อยของ testis ที่สไลด์วางไว้ (p.4) คือ 1.1 Tunica albuginea, 1.2 Septula testis และ Mediastinum testis, 1.3 Testicular lobule (Interstitial tissue + Seminiferous tubules), 1.4 Straight testicular tubules (Tubuli recti), 1.5 Rete testis, 1.6 Testicular blood supply"
          },
          {
            "sub": "Tunica albuginea (p.5-6)",
            "body": [
              {
                "bullets": [
                  "**Thick dense irregular connective tissue** ที่คลุม testis",
                  "Rich of collagen fibers และมี elastic fibers บ้าง",
                  "ในบางสปีชีส์เช่น **horse และ pig** พบ smooth muscles และ vascular layer ด้วย",
                  "รูปใน p.6 ให้ label 3 อย่าง คือ tunica albuginea, smooth muscles, vascular layer"
                ]
              }
            ]
          },
          {
            "sub": "Septula testis และ Mediastinum testis (p.7)",
            "body": [
              {
                "bullets": [
                  "**Septula testis** = thin fibrous partition ที่แผ่จาก tunica albuginea เข้าไปหา mediastinum testis และแบ่ง testis ออกเป็น **testicular lobules**",
                  "**Mediastinum testis** = ก้อน fibrous tissue ที่ต่อเนื่องกับ tunica albuginea ผ่าน septula testis และภายในมี **rete testis (testicular network)** อยู่"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Interstitial tissue และ Leydig cell",
        "source": "Male Reproductive System p.8-10",
        "body": [
          {
            "text": "ภายใน testicular lobule มี 2 องค์ประกอบ คือ **1.3.1 Interstitial tissue (IT)** และ **1.3.2 Seminiferous tubules (ST)** (p.8)"
          },
          {
            "sub": "องค์ประกอบของ interstitial tissue (p.9)",
            "body": [
              {
                "bullets": [
                  "Interstitial cells หรือ **Leydig cells**",
                  "Loose connective tissue: fibrocytes, collagen และ elastic fibers",
                  "Blood vessels และ lymph vessels"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะและหน้าที่ของ Leydig cell (p.10)",
            "body": [
              {
                "bullets": [
                  "เซลล์ขนาดใหญ่ มี **lipid inclusions**",
                  "รูปร่าง irregular หรือ polyhedral มี spherical nucleus",
                  "**Produce testosterone** ซึ่งมีผลต่อ libido, growth of accessory glands, secondary sex characteristics และ spermatogenesis (ทำงานร่วมกับ FSH)",
                  "ใน **boar** ผลิต estrogen ด้วย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ผนัง Seminiferous tubule",
        "source": "Male Reproductive System p.11",
        "body": [
          {
            "text": "สไลด์ไล่ชั้นจากนอกเข้าใน **3 ชั้น**"
          },
          {
            "bullets": [
              "**Lamina propria (LP)** ประกอบด้วย peritubular cells (myofibroblasts), collagen และ blood vessels",
              "**Basal lamina**",
              "**Seminiferous epithelium (SE)** ประกอบด้วย Sertoli (sustentacular) cells และ spermatogenic cells"
            ]
          }
        ]
      },
      {
        "heading": "Sertoli cell และ Blood-testis barrier",
        "source": "Male Reproductive System p.12-13",
        "body": [
          {
            "sub": "หน้าที่ของ Sertoli cell (p.12)",
            "body": [
              {
                "bullets": [
                  "Protect, support, nourish",
                  "Phagocytize",
                  "Produce **androgen binding protein (ABP)** และ **inhibin**",
                  "**Blood testis barrier**",
                  "**Spermiation**"
                ]
              }
            ]
          },
          {
            "sub": "Blood-testis barrier (p.13)",
            "body": [
              {
                "bullets": [
                  "เกิดจาก **tight junction (zonula occludens)** ระหว่าง Sertoli cells ซึ่งแบ่ง seminiferous epithelium ออกเป็น **adluminal compartment** และ **basal compartment**",
                  "หน้าที่คือ protect micro-environment ใน adluminal compartment ไม่ให้ถูกรบกวนจากภายนอก"
                ]
              }
            ]
          },
          {
            "callout": "จำคู่: ABP กับ inhibin มาจาก Sertoli cell ส่วน testosterone มาจาก Leydig cell (p.10 กับ p.12) เป็นจุดที่ถามสลับกันได้ง่าย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Spermatogenesis: 3 ขั้นตอนใหญ่",
        "source": "Male Reproductive System p.14-15",
        "body": [
          {
            "sub": "1. Spermatocytogenesis",
            "body": [
              {
                "text": "จาก **spermatogonia** ไปเป็น **primary spermatocytes**"
              }
            ]
          },
          {
            "sub": "2. Meiosis (I และ II)",
            "body": [
              {
                "text": "Primary spermatocytes ไปเป็น secondary spermatocytes แล้วไปเป็น **round spermatids**"
              }
            ]
          },
          {
            "sub": "3. Spermiogenesis",
            "body": [
              {
                "text": "จาก round spermatids ไปเป็น elongated spermatids จนกลายเป็น **spermatozoa**"
              }
            ]
          },
          {
            "callout": "ข้อสังเกตที่สไลด์เขียนไว้เอง (p.15): **secondary spermatocytes มักหาไม่เจอในสไลด์** เพราะมันเข้าและจบ meiosis II อย่างรวดเร็ว เซลล์ที่สไลด์ให้ระบุจริงคือ spermatogonia, primary spermatocytes, round spermatids, elongated spermatids และ spermatozoa",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Spermiogenesis: 4 phases",
        "source": "Male Reproductive System p.16-17",
        "body": [
          {
            "bullets": [
              "**1. Golgi phase** Golgi vesicles รวมตัวกันเป็น **single acrosomal vesicle** อันเดียว",
              "**2. Cap phase** เกิด **acrosomal cap** และเริ่มสร้าง flagellum",
              "**3. Acrosomal phase** nucleus หนาแน่นขึ้นและยืดยาวขึ้น เห็น acrosomal cap ชัดเจน",
              "**4. Maturation phase** mitochondria มารวมกันที่ **middle piece** และมีการกำจัด **residual body**"
            ]
          },
          {
            "text": "หน้า p.17 เป็นรูปให้ label ตามลำดับ acrosomal vesicle, acrosomal cap, acrosomal cap, residual body ซึ่งตรงกับ 4 phase ข้างต้น"
          }
        ]
      },
      {
        "heading": "โครงสร้าง Spermatozoa",
        "source": "Male Reproductive System p.18-19",
        "body": [
          {
            "sub": "การแบ่งส่วน (p.18)",
            "body": [
              {
                "bullets": [
                  "**Head**",
                  "**Tail** แบ่งย่อยเป็น neck (connecting piece), middle piece, principal piece และ end piece"
                ]
              }
            ]
          },
          {
            "sub": "ส่วน head (p.19)",
            "body": [
              {
                "bullets": [
                  "**Acrosomal cap (acrosome)** ภายในมี **hydrolytic enzymes** ได้แก่ hyaluronidase, aryl phosphatase, esterase และ acrosin",
                  "**Equatorial segment**",
                  "**Post-acrosomal region**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Capacitation ตามที่สไลด์แสดง",
        "source": "Male Reproductive System p.20",
        "body": [
          {
            "text": "สไลด์แสดงการดู stage ของ capacitation ด้วย **fluorescent chlortetracycline (CTC) staining** โดยแบ่งเป็น 3 stage"
          },
          {
            "bullets": [
              "**Non-capacitated (A1)**",
              "**Capacitated (A2)**",
              "**Acrosome-reacted sperm (A3)**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่า capacitation เกิดขึ้นที่ไหน ใช้เวลาเท่าไร หรือลวดลาย CTC ของแต่ละ stage ต่างกันอย่างไร ให้ตอบเท่าที่สไลด์ให้คือชื่อ stain กับชื่อ 3 stage",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Tubuli recti, Rete testis และ Testicular blood supply",
        "source": "Male Reproductive System p.21-23",
        "body": [
          {
            "sub": "Straight testicular tubules (Tubuli recti) (p.21)",
            "body": [
              {
                "bullets": [
                  "อยู่ต่อจาก **terminal segment of seminiferous tubule** แล้วเปิดเข้าสู่ **rete testis**",
                  "เป็นท่อ narrow และ short",
                  "Epithelium เป็นได้ทั้ง **simple squamous, simple cuboidal หรือ simple columnar**"
                ]
              }
            ]
          },
          {
            "sub": "Rete testis (p.22)",
            "body": [
              {
                "bullets": [
                  "เป็น **network of canals ภายใน mediastinum testis**",
                  "**Simple squamous หรือ simple cuboidal epithelium**",
                  "มี testicular fluid อยู่ภายใน"
                ]
              }
            ]
          },
          {
            "sub": "Testicular blood supply (p.23)",
            "body": [
              {
                "bullets": [
                  "Testicular arteries",
                  "Testicular veins ที่จัดตัวเป็น **pampiniform plexus** ทำหน้าที่ **blood cooling** และ **hormone transfer**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Epididymis: Efferent ductules และ Ductus epididymis",
        "source": "Male Reproductive System p.24-26",
        "body": [
          {
            "text": "สไลด์แบ่ง epididymis เป็น 2 ส่วนคือ **efferent ductules** และ **ductus epididymis** (p.24)"
          },
          {
            "sub": "Efferent ductules (p.25)",
            "body": [
              {
                "bullets": [
                  "เชื่อม **rete testis เข้ากับ ductus epididymis**",
                  "ส่วนใหญ่เป็น **simple columnar epithelium**",
                  "มีทั้ง **ciliated cells และ nonciliated cells**"
                ]
              }
            ]
          },
          {
            "sub": "Ductus epididymis (p.26)",
            "body": [
              {
                "bullets": [
                  "แบ่งเป็น **head, body และ tail**",
                  "**Pseudostratified columnar epithelium และ stereocilia**",
                  "ที่ **tail** epithelium เตี้ยลงและ lumen กว้างที่สุด",
                  "**Sperm maturation ที่ head และ body**",
                  "**Sperm storage ที่ tail**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่แยก efferent ductules ออกจาก ductus epididymis ในสไลด์คือชนิด epithelium (simple columnar ที่มี ciliated + nonciliated cells เทียบกับ pseudostratified columnar + stereocilia)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Ductus deferens",
        "source": "Male Reproductive System p.27",
        "body": [
          {
            "bullets": [
              "**Pseudostratified columnar epithelium with short stereocilia** อาจมีหรือไม่มี **mucosal folds** ก็ได้",
              "Propria-submucosa",
              "**Thick tunica muscularis**",
              "ในสัตว์บางชนิดส่วนปลายพบต่อม จึงเรียกว่า **Ampulla of ductus deferens**",
              "ชั้นนอกสุดเป็น Tunica adventitia หรือ Tunica serosa"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุว่า 'สัตว์บางชนิด' ที่มี ampulla คือสปีชีส์ใดบ้างในหน้านี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Semen, Seminal plasma และรายชื่อ Accessory glands",
        "source": "Male Reproductive System p.29",
        "body": [
          {
            "bullets": [
              "**Semen** = spermatozoa บวกกับ **seminal plasma (fluid)**",
              "**Seminal plasma** = สารคัดหลั่งจาก **rete testis, epididymis และ male accessory glands**"
            ]
          },
          {
            "sub": "Accessory glands ที่สไลด์ระบุ",
            "body": [
              {
                "bullets": [
                  "Glands in **ampulla of ductus deferens**",
                  "**Vesicular gland**",
                  "**Prostate gland**",
                  "**Bulbourethral gland**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Accessory glands ทีละต่อม",
        "source": "Male Reproductive System p.30-32, 34",
        "body": [
          {
            "sub": "Glands in ampulla of ductus deferens (p.30)",
            "body": [
              {
                "bullets": [
                  "**Simple branched tubuloalveolar glands** อยู่ใน propria-submucosa",
                  "พบใน **stallion, ruminants และ dog**",
                  "**ไม่มีใน boar และ cat**"
                ]
              }
            ]
          },
          {
            "sub": "Vesicular gland (p.31)",
            "body": [
              {
                "bullets": [
                  "**Compound tubular หรือ tubuloalveolar gland**",
                  "**Absent in carnivores**",
                  "**Pseudostratified columnar epithelium**",
                  "Secretory product: **Fructose**"
                ]
              }
            ]
          },
          {
            "sub": "Prostate gland (p.32)",
            "body": [
              {
                "bullets": [
                  "**Compound tubuloalveolar gland** ประกอบด้วย 2 ส่วน",
                  "**External (compact) portion หรือ body of prostate** ซึ่ง **absent in small ruminants**",
                  "**Internal (disseminate) portion** อยู่ใน propria-submucosa ของ prostatic urethra ซึ่ง **absent in stallions**",
                  "Epithelial lining: simple cuboidal หรือ columnar epithelium และเป็น stratified columnar หรือ transitional ที่ส่วน terminal",
                  "Secretory products: **initiating sperm motility** และ **neutralizing semen**"
                ]
              }
            ]
          },
          {
            "sub": "Bulbourethral gland (p.34)",
            "body": [
              {
                "bullets": [
                  "**Compound tubular** ใน boar, cat, buck",
                  "**Tubuloalveolar** ใน stallion, bull, ram",
                  "**Absent in dogs**",
                  "**Simple columnar epithelium**",
                  "Secretory products: neutralizing urethra, lubricating vagina และสร้าง **post-ejaculatory cervical seal หรือ 'gelatin plug' ใน boar**"
                ]
              }
            ]
          },
          {
            "callout": "ข้อ 'absent' ทั้งชุดคือจุดออกข้อสอบ: ampulla glands ไม่มีใน boar และ cat, vesicular gland ไม่มีใน carnivores, body of prostate ไม่มีใน small ruminants, disseminate prostate ไม่มีใน stallion, bulbourethral gland ไม่มีใน dog",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Urethra",
        "source": "Male Reproductive System p.35-37",
        "body": [
          {
            "sub": "การแบ่งส่วนและ histological structure (p.35)",
            "body": [
              {
                "text": "แบ่งเป็น **1. Prostatic urethra, 2. Membranous urethra, 3. Spongiose (penile) urethra**"
              },
              {
                "bullets": [
                  "**Transitional epithelium**",
                  "Propria-submucosa ที่มี erectile tissues และ loose CNT, lymphatic tissue และ nodules",
                  "**Urethral gland พบใน stallion และ cat**",
                  "Tunica muscularis"
                ]
              }
            ]
          },
          {
            "sub": "Prostatic urethra และ Membranous urethra (p.36)",
            "body": [
              {
                "bullets": [
                  "**Prostatic urethra** ทอดจาก urinary bladder ผ่าน prostate gland มี erectile tissues พัฒนาปานกลาง และ propria-submucosa มี **disseminate portion ของ prostate gland** อยู่",
                  "**Membranous urethra** อยู่ระหว่าง prostate gland กับ bulb of the penis"
                ]
              }
            ]
          },
          {
            "sub": "Spongiose (penile) urethra (p.37)",
            "body": [
              {
                "bullets": [
                  "เป็นส่วนต่อจาก membranous urethra และอยู่ในองคชาต",
                  "มี erectile tissue พัฒนาดี เรียกว่า **corpus spongiosum**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Penis: macroanatomy, histology และชนิดของ penis",
        "source": "Male Reproductive System p.38-39, 42-43",
        "body": [
          {
            "sub": "แบ่งตาม macroanatomy (p.38)",
            "body": [
              {
                "bullets": [
                  "**1. Root of penis** ประกอบด้วย crus of penis และ bulb of penis",
                  "**2. Body of penis**",
                  "**3. Glans penis** ซึ่งมี **bulbus glandis (only in canine)** และ **pars longa glandis (only in canine)**"
                ]
              }
            ]
          },
          {
            "sub": "แบ่งตาม histology (p.39)",
            "body": [
              {
                "bullets": [
                  "**1. Corpus cavernosum penis (CCP)** อยู่ที่ body of penis เป็น pair cavernous erectile tissue มี tunica albuginea, median septum และ trabeculae",
                  "**2. Corpus spongiosum (CS) หรือ Corpus cavernosum urethra (CCU)** เป็น cavernous erectile tissue ที่ล้อมรอบ penile urethra",
                  "**3. Glans penis in dog** คือ bulbus glandis และ pars longa glandis ซึ่งพบ cavernous erectile tissue ของทั้งสองส่วน"
                ]
              }
            ]
          },
          {
            "sub": "ชนิดของ penis (p.43)",
            "body": [
              {
                "bullets": [
                  "**1. Vascular type** ได้แก่ stallion, man, dog, tom",
                  "**2. Fibroelastic type** ได้แก่ bull, ram, buck, boar"
                ]
              }
            ]
          },
          {
            "callout": "p.40 และ 41 เป็นหน้ารูปที่ไม่มี text ส่วน p.42 มีเพียง label 'Bulbus glandis' และ 'Pars longa glandis' และ p.44 มีเพียงบรรทัดเดียวว่า 'Penis in animals' สไลด์ไม่ได้อธิบายความแตกต่างเชิงกลไกของ vascular type กับ fibroelastic type",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Prepuce",
        "source": "Male Reproductive System p.45-46",
        "body": [
          {
            "text": "**Tube-like fold of skin** ที่ห่อหุ้มส่วน cranial ของ penis และ glans penis แบ่งเป็น external layer (lamina) และ internal layer (lamina) (p.45)"
          },
          {
            "sub": "External layer (p.46)",
            "body": [
              {
                "bullets": [
                  "**Keratinized stratified squamous epithelium**",
                  "Sebaceous glands, sweat glands และ hair follicles"
                ]
              }
            ]
          },
          {
            "sub": "Internal layer (p.46)",
            "body": [
              {
                "bullets": [
                  "**Non-keratinized stratified squamous epithelium**",
                  "**Solitary lymphatic nodule**"
                ]
              }
            ]
          },
          {
            "callout": "คีย์แยกสองชั้นคือ keratinized (นอก มีขน มีต่อม) เทียบกับ non-keratinized (ใน มี lymphatic nodule) ซึ่งย้ำอีกครั้งใน slide A11 ที่ p.59",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Lab slide checklist: testis และ epididymis",
        "source": "Male Reproductive System p.47-52",
        "body": [
          {
            "text": "ตั้งแต่ p.47 เป็นต้นไปเป็นส่วน **Histological slides for male reproductive system** ซึ่งเป็นรายการโครงสร้างที่ต้องหาให้เจอในสไลด์จริง ไม่ได้เพิ่มเนื้อหาทฤษฎีใหม่"
          },
          {
            "sub": "โครงสร้างที่ต้องระบุใน testis (p.48-49)",
            "body": [
              {
                "bullets": [
                  "Tunica albuginea, septula testis, mediastinum testis พร้อม rete testis",
                  "Interstitial tissue พร้อม Leydig cell",
                  "Seminiferous tubules พร้อม spermatogenic cells และ Sertoli cells",
                  "Efferent ductules และ ductus epididymis (head และ tail)"
                ]
              }
            ]
          },
          {
            "sub": "Efferent ductules (p.50)",
            "body": [
              {
                "text": "หาให้เจอ simple columnar epithelium, ciliated cells และ nonciliated cells"
              }
            ]
          },
          {
            "sub": "Slide PT1 testis, B102 testis หรือ Testis02 (p.51-52)",
            "body": [
              {
                "bullets": [
                  "Seminiferous tubules, Sertoli cells และ spermatogenic cells (spermatogonia, primary spermatocyte, round spermatid, elongated spermatid, spermatozoa)",
                  "Interstitial tissue พร้อม Leydig cell (interstitial cell)",
                  "Ductus epididymis: pseudostratified columnar epithelium with stereocilia, loose CNT และ smooth muscle fibers, และ **cluster of spermatozoa**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Lab slide checklist: ductus deferens, urethra, penis, prepuce",
        "source": "Male Reproductive System p.53-59",
        "body": [
          {
            "sub": "Ductus deferens (p.53)",
            "body": [
              {
                "bullets": [
                  "T. mucosa: pseudostratified columnar epithelium และ stereocilia",
                  "Propria-submucosa (loose CNT)",
                  "T. muscularis: **very thick smooth muscle**",
                  "T. adventitia หรือ T. serosa"
                ]
              }
            ]
          },
          {
            "sub": "Pelvic urethra ส่วน prostatic (p.54)",
            "body": [
              {
                "text": "หา internal (disseminate) portion ที่อยู่ใน propria-submucosa ของ urethra และ external (compact) portion"
              }
            ]
          },
          {
            "sub": "Penis ที่ระดับ body (p.55)",
            "body": [
              {
                "bullets": [
                  "Corpus cavernosum penis (CCP): tunica albuginea, cavernous spaces, CNT septum หรือ median septum",
                  "Penile urethra",
                  "Corpus spongiosum (CS) หรือ corpus cavernosum urethra (CCU)"
                ]
              }
            ]
          },
          {
            "sub": "Glans penis ของสุนัข (p.56-58)",
            "body": [
              {
                "bullets": [
                  "ระดับ **bulbus glandis** (p.56): cavernous tissue ของ bulbus glandis, **os penis**, urethral groove, penile urethra, corpus spongiosum และ **retractor penis muscles**",
                  "ระดับ **pars longa glandis** (p.57): cavernous tissue ของ pars longa glandis, os penis, urethral groove, penile urethra, corpus spongiosum",
                  "p.58 เพิ่ม non-keratinized stratified squamous epithelium ของ **prepuce (internal layer)** และ isolated lymphatic nodules เข้ามาในภาพเดียวกัน"
                ]
              }
            ]
          },
          {
            "sub": "Slide A 11: Prepuce (Dog) (p.59)",
            "body": [
              {
                "bullets": [
                  "External layer: keratinized stratified squamous epithelium (thin hairy skin) พร้อม hair follicles, sweat glands, sebaceous glands",
                  "Internal layer: non-keratinized stratified squamous epithelium"
                ]
              }
            ]
          },
          {
            "callout": "**Os penis** (p.56-58) และ **retractor penis muscles** (p.56) ปรากฏเฉพาะในส่วน lab slide ของสุนัข สไลด์บรรยายช่วงต้นไม่ได้พูดถึงสองโครงสร้างนี้เลย",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "histo--nervous-system": {
    "topic": "histo--nervous-system",
    "title": "Nervous System",
    "icon": "🔬",
    "summary": "ชีต Nervous System 45 หน้า แต่เกือบทั้งหมดเป็นสไลด์รูป (ภาพ histology และแผนภาพ) ที่ไม่มี text layer ให้อ่าน ข้อความที่มีจริงคือคำ label ชิ้นส่วนของ neuron หนึ่งหน้า และ bullet สั้น ๆ ของ glial cells แต่ละชนิดทั้ง CNS และ PNS (astrocyte, oligodendrocyte, microglia, ependymal cell, choroid plexus epithelial cell, Schwann cell, satellite cell) ปิดท้ายด้วยหน้าชื่ออวัยวะ (brain, spinal cord, ganglion) และหน้าที่ของ enteric plexus ในทางเดินอาหาร ส่วน myelination, synapse, และ receptor มีแต่หัวข้อกับคำ label ไม่มีคำอธิบายในตัวอักษร",
    "sections": [
      {
        "heading": "ส่วนประกอบของ neuron ตาม label ในสไลด์",
        "source": "Nervous System p.5",
        "body": [
          {
            "text": "สไลด์นี้เป็นภาพ neuron ที่ชี้ label ไว้ ไม่มีคำอธิบายเป็นประโยค คำที่ต้องจำคือชื่อชิ้นส่วนตามที่สไลด์เขียน"
          },
          {
            "sub": "ตัวเซลล์ (cell body)",
            "body": [
              {
                "bullets": [
                  "**soma / perikaryon** คือชื่อเรียกตัวเซลล์",
                  "**neurolemma**",
                  "**Nissl's substance**",
                  "**round euchromatic nucleus** นิวเคลียสกลม euchromatic",
                  "**lipofuschin**"
                ]
              }
            ]
          },
          {
            "sub": "processes (แขนงของเซลล์)",
            "body": [
              {
                "bullets": [
                  "**axon** และ **axon hillock**",
                  "**terminal bulb (bouton)** ที่ปลาย axon",
                  "**dendrites** และ **dendritic spine (gemule)** บน dendrite"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกหน้าที่หรือรายละเอียดของแต่ละชิ้นส่วน ให้ตอบตามชื่อ label ที่อาจารย์ชี้ในรูป",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Nerve fiber และ myelination",
        "source": "Nervous System p.12-13",
        "body": [
          {
            "text": "p.12 มีแค่คำว่า **SCHWANN CELL** กำกับรูป ส่วน p.13 เป็นภาพเปรียบเทียบเส้นใยประสาท"
          },
          {
            "bullets": [
              "**MYELINATED NERVE FIBERS** เทียบกับ **NON MYELINATED NERVE FIBERS**",
              "คำที่สไลด์ชี้บนเส้นใยที่มี myelin คือ **NODE OF RANVIER** และ **INTERNODE**"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้บอกว่า myelinated กับ non myelinated ต่างกันอย่างไรในเชิงการนำสัญญาณ มีแต่ชื่อและภาพ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Synapse",
        "source": "Nervous System p.14, 16-17",
        "body": [
          {
            "text": "p.14 เป็นภาพ synapse พร้อม label สามคำ"
          },
          {
            "bullets": [
              "**presynaptic**",
              "**postsynaptic**",
              "**synaptic cleft** สไลด์เขียนขนาดไว้ว่า **(15-20 nM)**"
            ]
          },
          {
            "text": "p.16 และ p.17 พาดหัวว่า **TYPES OF SYNAPSE** ทั้งสองหน้า แต่ตัวชนิดของ synapse อยู่ในรูปอย่างเดียว สไลด์ไม่ได้พิมพ์ชื่อชนิดไว้เป็นข้อความ"
          }
        ]
      },
      {
        "heading": "Receptor ที่สไลด์ยกมา",
        "source": "Nervous System p.19-20",
        "body": [
          {
            "bullets": [
              "p.19 **MECHANORECEPTOR**",
              "p.20 **MUSCLE SPINDLE (PROPRIOCEPTOR)**"
            ]
          },
          {
            "callout": "ทั้งสองหน้ามีแต่ชื่อหัวข้อกับภาพ สไลด์ไม่ได้บอกโครงสร้างหรือกลไกการทำงาน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "CNS glial cells: Astrocyte",
        "source": "Nervous System p.21-22",
        "body": [
          {
            "text": "**เป็น glial cell ที่ใหญ่ที่สุด (the largest glial cell)** มี multiple radiating processes"
          },
          {
            "bullets": [
              "ยึด neuron เข้ากับ capillaries และกับ pia mater (bind neuron to capillaries and to pia mater)",
              "**STRUCTURAL SUPPORT**: end feet (**glial limiting membrane**)",
              "**PROTECTION**: limit penetrating of substances into CNS",
              "**GLIOSIS**: สร้าง scar เพื่อ seal off ส่วนที่บาดเจ็บ"
            ]
          }
        ]
      },
      {
        "heading": "CNS glial cells: Oligodendrocyte",
        "source": "Nervous System p.24",
        "body": [
          {
            "bullets": [
              "เป็น glial cell ขนาดเล็ก มี processes ไม่กี่อัน (the small glial cell with a few processes)",
              "**สร้าง myelin sheath เพื่อ insulating axon**"
            ]
          }
        ]
      },
      {
        "heading": "CNS glial cells: Microglia",
        "source": "Nervous System p.25",
        "body": [
          {
            "bullets": [
              "**เป็น glia ที่เล็กที่สุด และมี mesoderm origin**",
              "ทำหน้าที่เป็น **macrophage in brain tissue: phagocytic function**",
              "รูปร่างที่สไลด์ระบุ: heterochromatic elongated nucleus, numerous processes with small branches"
            ]
          }
        ]
      },
      {
        "heading": "CNS glial cells: Ependymal cells และ choroid plexus",
        "source": "Nervous System p.26-27",
        "body": [
          {
            "sub": "Ependymal cells (p.26)",
            "body": [
              {
                "bullets": [
                  "**บุ brain ventricles และ central canal of spinal cord**",
                  "หน้าที่: propulsion of CSF, secrete and transport substance จาก CSF เข้าสู่ blood circulation"
                ]
              }
            ]
          },
          {
            "sub": "Modified ependymal cells: choroid plexus epithelial cells (p.27)",
            "body": [
              {
                "bullets": [
                  "= **ependymal cells + capillary mass** พบใน brain ventricles",
                  "**FUNCTION: synthesis CSF**",
                  "เป็น cuboidal cells ที่มี bulging luminal surface และมี cilia/microvilli"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "PNS glial cells: Schwann cell (neurolemmocyte)",
        "source": "Nervous System p.28-29",
        "body": [
          {
            "text": "เซลล์ที่ wrapping around ไปตามความยาวของ axon"
          },
          {
            "bullets": [
              "**axonal ensheathment (myelination)**",
              "nourishment to neuron",
              "**axon guidance in regenerating axon**"
            ]
          },
          {
            "text": "p.29 เป็นภาพหัวข้อ AXON GUIDANCE BY SCHWANN CELLS TO REGENERATE AXON ไม่มีคำอธิบายเป็นข้อความ"
          }
        ]
      },
      {
        "heading": "PNS glial cells: Satellite cell",
        "source": "Nervous System p.31",
        "body": [
          {
            "bullets": [
              "**เป็นเซลล์ที่ล้อมรอบ soma ของ neuron ใน ganglia**",
              "หน้าที่: structural and physiological supports ให้ neuron",
              "maintain microenvironments ของ neuron"
            ]
          }
        ]
      },
      {
        "heading": "อวัยวะที่สไลด์ให้ดูภาพ histology",
        "source": "Nervous System p.32-35",
        "body": [
          {
            "text": "ช่วงท้ายของชีตเป็นสไลด์ภาพพร้อมชื่ออวัยวะเท่านั้น"
          },
          {
            "bullets": [
              "**BRAIN** แยกเป็น **CEREBRUM: cerebral cortex** และ **CEREBELLUM: cerebellar cortex** (p.32-33)",
              "**SPINAL CORD** (p.34)",
              "**GANGLION** (p.35)"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนชั้น (layer) หรือชนิดเซลล์ของ cerebral/cerebellar cortex ไว้เป็นข้อความ ต้องอาศัยรูปกับที่อาจารย์บรรยาย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Enteric plexus ในทางเดินอาหาร",
        "source": "Nervous System p.36",
        "body": [
          {
            "text": "หน้าที่ตามที่สไลด์เขียน"
          },
          {
            "bullets": [
              "**control motility, exocrine & endocrine secretions และ blood flow ของ GI tract**",
              "**regulate inflammatory and immunological processes**"
            ]
          },
          {
            "text": "สองกลุ่มที่สไลด์ระบุชื่อไว้คือ **SUBMUCOSAL PLEXUS** และ **MYENTERIC PLEXUS** แต่สไลด์ไม่ได้บอกว่าแต่ละ plexus อยู่ชั้นไหนหรือคุมอะไรต่างกัน"
          }
        ]
      },
      {
        "heading": "ข้อจำกัดของชีตนี้",
        "source": "Nervous System",
        "body": [
          {
            "text": "หน้าที่ไม่มีข้อความให้อ่านเลย (เป็นภาพล้วนหรือหน้าปก) ได้แก่ p.1-4, p.6-11, p.15, p.18, p.23, p.30 และ p.37-45 รวมแล้วเกินครึ่งของชีต"
          },
          {
            "callout": "เนื้อหาที่หายไปเยอะที่สุดคือช่วง p.6-11 (ต่อจากโครงสร้าง neuron) และ p.37-45 (ท้ายชีต) ถ้าจะอ่านสอบต้องเปิดไฟล์สไลด์จริงหรือคลิปเรียนย้อนหลังประกอบ โน้ตนี้ครอบคลุมเฉพาะส่วนที่มีตัวอักษร",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "histo--placenta-lab-manual": {
    "topic": "histo--placenta-lab-manual",
    "title": "Placenta lab manual — สไลด์แล็บรกเปรียบเทียบ 5 ชนิดสัตว์",
    "icon": "🔬",
    "summary": "คู่มือแล็บรกที่เนื้อหาส่วนใหญ่เป็นภาพ histology ครับ (จำนวนหน้ายังไม่นิ่ง ไฟล์ที่แปลงมาประกาศหัวไฟล์ว่า PAGES=14 แต่มีตัวคั่นหน้าไปจนถึง === PAGE 15 === ถ้านับสไลด์ในเด็คจริงอาจได้ 14) มีเพียง 5 หน้าที่มีคำบรรยายจริง คือ equine (microplacentome), ruminant (placentome), หน้าบรรยาย maternal blood vessels กับ marginal hematoma, canine (syntrophoblast vs cytotrophoblast) และ rabbit (การจำแนก placenta กับ 4 zone) ส่วนหน้าอื่นมีแค่หัวข้อชื่อสัตว์หรือตัวอักษรกำกับภาพ (A, B, C, D) และหน้า 9 เป็นต้นไปไม่มีข้อความเลย โน้ตนี้จึงจับได้เฉพาะสิ่งที่สไลด์เขียนไว้เป็นตัวหนังสือ ที่เหลือต้องดูภาพจริงในคาบแล็บ",
    "sections": [
      {
        "heading": "Equine — microplacentome",
        "source": "Placenta lab manual p.2",
        "body": [
          {
            "text": "ในม้า small tufts of branched chorioallantoic villi จะสอดประสาน (interdigitate) เข้ากับ crypts ของ endometrium **กระจุก villi รวมกับ crypts เรียกว่า microplacentomes**"
          },
          {
            "bullets": [
              "สไลด์ย้ำให้สังเกตว่า chorioallantoic villi ถูกล้อมรอบด้วย endometrial crypt",
              "ตัว villi ภายในมี blood vessels และ connective tissue",
              "ผิวนอกของ villi คลุมด้วย trophoblast cells ที่ติดสีชมพู (pink-stained)"
            ]
          }
        ]
      },
      {
        "heading": "Ruminant — placentome",
        "source": "Placenta lab manual p.3",
        "body": [
          {
            "text": "ภาพเป็น section ตัดผ่าน placentome ซึ่งเกิดจากการจับคู่ระหว่าง **cotyledon (clumps of chorioallantoic villi) กับ uterine caruncle**"
          },
          {
            "bullets": [
              "cryptal (maternal) epithelium เป็น cuboidal หรือ flattened",
              "epithelium ของ chorioallantoic villus ประกอบด้วยเซลล์รูปร่างไม่สม่ำเสมอ (irregularly shaped cells) และ **binucleate giant cells**"
            ]
          },
          {
            "callout": "จุดที่สไลด์ให้ใช้แยกฝั่งในภาพ F = fetal side, M = maternal side โดย **fetal CNT ซีดกว่าฝั่ง maternal**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Maternal blood vessels กับ marginal hematoma",
        "source": "Placenta lab manual p.5",
        "body": [
          {
            "bullets": [
              "**maternal blood vessels บุด้วย endothelial cells ที่มี nuclei โป่งนูน (bulging nuclei)**",
              "ส่วนของ marginal hematoma ประกอบด้วย compartments ขนาดใหญ่ที่เต็มไปด้วยเลือด ซึ่งเลือดนั้นมาจากการตกเลือดของ uterine blood vessels (hemorrhaging uterine blood vessels)"
            ]
          },
          {
            "callout": "หน้านี้มีเพียงคำบรรยายภาพกับตัวอักษรกำกับ (A) **สไลด์ไม่ได้เขียนกำกับว่าเป็น species ใด** ทราบเพียงว่าหน้าก่อนหน้า (หน้า 4) ขึ้นหัวข้อว่า Feline",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Canine — การจัดเรียงชั้น trophoblast",
        "source": "Placenta lab manual p.7",
        "body": [
          {
            "bullets": [
              "**Syntrophoblast อยู่ติดกับ maternal CNT ส่วน cytotrophoblast อยู่ติดกับ fetal CNT**",
              "maternal CNT ติดสีชมพูมากกว่า fetal CNT",
              "maternal endothelium สูงกว่า (higher than) fetal endothelium"
            ]
          },
          {
            "text": "หน้าเดียวกันนี้มีคำว่า Feline กำกับภาพอีกภาพหนึ่งด้วย แต่สไลด์ไม่ได้เขียนคำบรรยายของภาพ feline ไว้ **ต้องดูภาพจริงเอาเอง**"
          }
        ]
      },
      {
        "heading": "Rabbit placenta — การจำแนกและ 4 zone",
        "source": "Placenta lab manual p.8",
        "body": [
          {
            "text": "**Rabbit placenta = discoidal, labyrinthine, deciduate, hemochorial**"
          },
          {
            "sub": "ทาง histology แบ่งเป็น 4 zone",
            "body": [
              {
                "bullets": [
                  "labyrinth zone",
                  "junctional zone",
                  "decidua zone of necrosis",
                  "decidua zone of separation"
                ]
              }
            ]
          },
          {
            "callout": "ไฟล์ข้อความของสไลด์หน้านี้ตกตัวอักษรไปหลายตัว ชื่อ zone ทั้งสี่กับคำจำแนกด้านบนอ่านได้ครบ แต่ยังมีอีกหนึ่งบรรทัดบนสไลด์ที่อ่านไม่ออก **จึงบอกไม่ได้ว่าบรรทัดนั้นเขียนอะไร**",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "หน้าที่เป็นภาพล้วน ไม่มีคำบรรยาย",
        "source": "Placenta lab manual p.1, p.4, p.6, p.9-15",
        "body": [
          {
            "bullets": [
              "หน้า 1 มีคำว่า RUMINANT กับตัวอักษรกำกับภาพ B และยังมีอีกสองบรรทัดที่การแปลงไฟล์อ่านไม่ออก คือ \"лйлм\" กับ \"E\\P6D\\LDPARQC6ULEVXZNDWDTQDVADJXO\" **จึงบอกไม่ได้ว่าสองบรรทัดนั้นเขียนอะไร** (บรรทัดที่อ่านไม่ออกแบบเดียวกันในหน้า 5 ถอดออกมาได้เป็นคำบรรยายเต็ม ๆ สองประโยค)",
              "หน้า 4 มีแต่หัวข้อ Feline",
              "หน้า 6 มีแต่ตัวอักษรกำกับภาพ B, C, D ไม่มีข้อความอธิบายเลย",
              "หน้า 9 จนถึงหน้าสุดท้าย ไม่มีข้อความใด ๆ"
            ]
          },
          {
            "callout": "เกินครึ่งของ deck นี้เป็นภาพ histology ที่ไม่มีคำบรรยายกำกับ **โน้ตนี้ครอบคลุมได้เฉพาะหน้าที่มีตัวหนังสือเท่านั้น** ตัวอักษร A, B, C, D บนสไลด์คือ label ของภาพ ซึ่งสไลด์ไม่ได้บอกว่าแต่ละตัวชี้ที่โครงสร้างอะไร ต้องจดจากคาบแล็บ",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "histo--placenta": {
    "topic": "histo--placenta",
    "title": "Placenta",
    "icon": "📖",
    "lecturer": "Assoc. Prof. Dr. Sayamon Srisuwatanasagul",
    "summary": "เด็คนี้ปูพื้น histomorphology ของ placenta แล้วเดินผ่านระบบ classification 5 แบบ (choriovitelline vs allantochorionic, degree of uterine destruction, area of attachment, fetomaternal tissue barrier, maternal-fetal interface) ก่อนไล่ทีละสปีชีส์ pig, horse, ruminant, carnivore (dog/cat), rabbit โดยตั้งชื่อหัวสไลด์เป็นชุด classification 4 คำของสปีชีส์นั้นเลย จุดที่ควรรู้ล่วงหน้า คือเกินหนึ่งในสามของเด็ค (ประมาณ 16 จาก 40 สไลด์) เป็นสไลด์รูป photomicrograph กับ diagram ที่มีแต่หัวเรื่องและ URL ไม่มีข้อความอธิบาย ดังนั้นเนื้อหาที่เป็นตัวหนังสือจริง ๆ กระจุกอยู่ที่สไลด์ classification และสไลด์แรกของแต่ละสปีชีส์ ส่วน objective ข้อ 3 ที่ให้ identify cell types นั้นเด็คให้ผ่านรูปเป็นหลัก มีคำอธิบายตัวย่อของเซลล์บนสไลด์แค่ 2 แผ่น",
    "sections": [
      {
        "heading": "Objectives ของบทนี้",
        "source": "Placenta p.2",
        "body": [
          {
            "bullets": [
              "เข้าใจ **histomorphology of the placenta**",
              "แยกความแตกต่างระหว่างสปีชีส์ได้ (distinguish between different species)",
              "identify different cell types ใน placental tissue ว่าเป็น **fetal หรือ maternal placenta**"
            ]
          },
          {
            "callout": "objective ข้อ 3 คือกุญแจของแล็บ เวลาดูสไลด์ให้ถามตัวเองก่อนเสมอว่าเนื้อเยื่อที่มองอยู่เป็นฝั่ง fetal หรือ maternal",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Placentation คืออะไร",
        "source": "Placenta p.3",
        "body": [
          {
            "text": "Placenta เป็น **fetomaternal organ** ที่พัฒนาขึ้นตอน implantation ของ blastocyst คือมีทั้งส่วนที่มาจากลูกและส่วนที่มาจากแม่ประกอบกัน"
          },
          {
            "text": "**Fetal placenta ประกอบด้วย chorion, allantois, amnion และ vestigial yolk sac**"
          }
        ]
      },
      {
        "heading": "Fetal membranes ทั้ง 4 ชั้น",
        "source": "Placenta p.4",
        "body": [
          {
            "bullets": [
              "**Chorion** เป็น outermost membrane และเป็นชั้นที่สัมผัสกับ maternal uterine endometrium",
              "**Allantois** เป็น continuous layer ที่หุ้มถุงเรียกว่า allantoic cavity โดย chorion กับ outer layer ของ allantois จะ fuse กันเป็น **chorioallantois**",
              "**Amnion** อยู่ใกล้ fetus ที่สุด เป็น fluid-filled cavity ที่บรรจุ fetus ไว้",
              "**Yolk sac** เป็น outpouching ของ endodermal embryonic midgut ทำหน้าที่ nourish embryo ก่อนที่ definitive placenta จะสร้างเสร็จ"
            ]
          }
        ]
      },
      {
        "heading": "Placental circulation ทิศทางของเลือดและของเสีย",
        "source": "Placenta p.6",
        "body": [
          {
            "bullets": [
              "Oxygen diffuse จาก maternal blood ใน **intervillous space** ผ่าน trophoblasts ใน chorionic villi เข้าสู่ fetal bloodstream",
              "Waste products จาก fetal blood ใน capillaries ของ chorionic villi diffuse ออกไปยัง maternal blood ใน intervillous space"
            ]
          },
          {
            "callout": "**Umbilical vein นำ oxygenated blood และ nutrients จาก placenta ไปหา fetus ส่วน umbilical arteries (ไม่ใช่ vein) นำ deoxygenated blood และ waste products กลับไปที่ placenta** สไลด์เน้นวงเล็บคำว่า not the vein ไว้เอง แปลว่าเป็นจุดที่คนสลับกันบ่อย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Classification แบบที่ 1: choriovitelline vs allantochorionic",
        "source": "Placenta p.8",
        "body": [
          {
            "sub": "Choriovitelline (yolk sac) placenta",
            "body": [
              {
                "text": "ผนัง yolk sac (endoderm) fuse กับ chorion (trophoblast และ mesoderm) แล้วจึง appose กับ endometrium"
              },
              {
                "text": "**เป็น transitory และมีความสำคัญน้อยใน domestic animals**"
              }
            ]
          },
          {
            "sub": "Allantochorionic placenta",
            "body": [
              {
                "text": "เกิดจากการ fusion ของ allantois กับ chorion"
              }
            ]
          }
        ]
      },
      {
        "heading": "Classification แบบที่ 2: degree of uterine destruction",
        "source": "Placenta p.9",
        "body": [
          {
            "bullets": [
              "**Nondeciduate placenta**: trophoblasts ไม่ invade endometrium อย่างมีนัยสำคัญ ไม่มีการสูญเสีย maternal tissue และ **domestic animals ส่วนใหญ่เป็น nondeciduate**",
              "**Deciduate placenta**: trophoblasts invade และทำลาย superficial endometrium ซึ่ง endometrium ตอบสนองด้วยการสร้างเซลล์ขนาดใหญ่รูป polygonal เรียกว่า **decidual cells**"
            ]
          },
          {
            "text": "ระดับความรุนแรงต่างกันตามกลุ่มสัตว์ **dogs และ cats เป็น mildly deciduate ส่วน rodents และ primates เป็น fully deciduate**"
          }
        ]
      },
      {
        "heading": "Classification แบบที่ 3: area of fetomaternal attachment",
        "source": "Placenta p.10, 12",
        "body": [
          {
            "bullets": [
              "**Diffuse placentation**: chorionic villi มีอยู่ทั่วทั้งผิวของ endometrium พบใน **sow, mare, camel, llama**",
              "**Cotyledonary placenta**: chorionic villi แตกแขนงเป็นกระจุกแยกกันเรียก **cotyledons** ไปเกาะกับ endometrial prominences ที่มีอยู่ก่อนแล้วเรียก **caruncles** เมื่อรวมกันจะเรียกว่า **placentome** พบใน **ruminant**",
              "**Zonary placenta**: chorionic projections เรียงเป็นแถบคล้ายวงแหวนพาดขวางรอบตัว fetus พบใน **carnivores**",
              "**Discoid placenta**: chorion เกาะกับ endometrial stroma เป็นบริเวณรูปจานหนึ่งหรือสองจาน พบใน **primate, rabbit, rodent**"
            ]
          },
          {
            "callout": "จำสมการ cotyledon (ฝั่งลูก) + caruncle (ฝั่งแม่) = placentome ข้อสอบชอบถามว่าคำไหนเป็นของฝั่งไหน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Classification แบบที่ 4: fetomaternal tissue barrier",
        "source": "Placenta p.13-16",
        "body": [
          {
            "text": "**มีชั้นเนื้อเยื่อได้มากที่สุด 6 ชั้นที่คั่นระหว่าง fetal และ maternal circulation** (p.13) เรียงตามที่สไลด์ให้มา"
          },
          {
            "bullets": [
              "(1) maternal capillary endothelium",
              "(2) maternal connective tissue",
              "(3) uterine epithelium",
              "(4) chorionic epithelium (i.e. trophoblast)",
              "(5) allantochorionic connective tissue (mesenchyme)",
              "(6) allantochorionic capillary endothelium"
            ]
          },
          {
            "sub": "Epitheliochorial (p.14)",
            "body": [
              {
                "text": "**มีครบทั้ง 6 ชั้น** พบใน sow, ruminant, horse"
              }
            ]
          },
          {
            "sub": "Syndesmochorial (p.15)",
            "body": [
              {
                "text": "**เหลือ 5 ชั้น เพราะ uterine epithelium ถูก erode** ชนิดนี้เกิดแบบ focally ใน ruminants หลังจากที่ epitheliochorial placenta ตั้งตัวแล้ว และเกิดใน pathological circumstances"
              }
            ]
          },
          {
            "sub": "Endotheliochorial (p.15)",
            "body": [
              {
                "text": "**uterine epithelium และ connective tissue ถูก erode เหลือ 4 ชั้น** พบใน carnivores"
              }
            ]
          },
          {
            "sub": "Hemochorial (p.16)",
            "body": [
              {
                "text": "**maternal layers ถูก erode หมด เหลือ trophoblasts สัมผัสกับ maternal blood โดยตรง** พบใน primate, rabbit, rodent"
              }
            ]
          }
        ]
      },
      {
        "heading": "Classification แบบที่ 5: maternal and fetal tissue interface",
        "source": "Placenta p.18",
        "body": [
          {
            "bullets": [
              "**Folded**: fetal tissues มี macroscopic undulations เรียก **plicae** และมี microscopic ridges (**rugae ในหมู, lamellae ใน carnivores**) ที่ interlock กับ infoldings ของ endometrium ที่เรียกว่า **fossae**",
              "**Villous**: chorionic villous protrusions ที่แตกแขนง interdigitate กับ **maternal crypts** พบใน horse, ruminant, human",
              "**Labyrinthine**: trophoblasts สร้าง intercommunicating network กับ maternal capillaries"
            ]
          },
          {
            "callout": "p.17 มีแต่หัวเรื่อง Classification : maternal and fetal tissue interface กับรูป ไม่มีข้อความ คำอธิบายทั้งหมดอยู่บน p.18",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Pig: diffuse, fold, non-deciduate, epitheliochorial",
        "source": "Placenta p.19",
        "body": [
          {
            "bullets": [
              "ช่วงต้นของ development **yolk sac มีขนาดใหญ่ แล้ว regress หลัง day 20**",
              "**Trophoblast epithelium เป็น columnar ที่ base ของ folded ridges แล้วกลายเป็น flattened ที่ tips**",
              "มี **areola-gland complexes** เกิดขึ้นเหนือช่องเปิดของ uterine glands"
            ]
          }
        ]
      },
      {
        "heading": "Horse: diffuse, villous, non-deciduate, epitheliochorial",
        "source": "Placenta p.20, 25, 26",
        "body": [
          {
            "sub": "Microcotyledons และ chorionic girdle (p.20)",
            "body": [
              {
                "text": "allantochorion กับ uterine epithelium ที่อยู่ติดกันเกิด specialized folding กลายเป็น **microcotyledons ทั่วเกือบทั้ง placenta หลัง day 60**"
              },
              {
                "text": "**Chorionic girdle** คือ trophoblasts ที่ proliferate อย่างรวดเร็ว อยู่ระหว่าง yolk sac ที่กำลัง regress กับ chorioallantois ที่กำลังพัฒนา trophoblasts เหล่านี้จะกลายเป็น **binucleate** แล้ว **invade endometrium ราว day 37** ทำลาย uterine endothelium และฝังตัวใน stroma เพื่อสร้าง **endometrial cups**"
              }
            ]
          },
          {
            "sub": "Endometrial cups และ eCG (p.25)",
            "body": [
              {
                "text": "Endometrial cups กระจายอยู่ทั่วผิวของ placenta และยื่นเข้าไปใน allantoic cavity"
              },
              {
                "text": "**ทำหน้าที่ผลิต equine chorionic gonadotropin (ECG) ซึ่ง stabilize hormonal function ของ corpora lutea และตรวจพบใน serum ของแม่ม้าระหว่าง 40 ถึง 120 วันของการตั้งท้อง**"
              }
            ]
          },
          {
            "sub": "Hippomanes (p.25-26)",
            "body": [
              {
                "text": "เป็นก้อนนิ่ม สีน้ำตาลเข้ม โดยปกติลอยอิสระอยู่ใน allantoic fluid หรืออาจติดค้างอยู่ใน fetal membranes (เรียก **allantoic calculi**)"
              },
              {
                "text": "**เป็น concretions ของ minerals และ salts จากการผลิต fetal urine และไม่ใช่สิ่งผิดปกติที่จะพบ**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Ruminant: cotyledonary, villous, non-deciduate, epitheliochorial",
        "source": "Placenta p.28",
        "body": [
          {
            "bullets": [
              "**Trophoblastic epithelium ที่ base ของ villi โดยทั่วไปเป็น columnar แล้วกลายเป็น cuboidal ที่ tips**",
              "เนื่องจาก fetal villi interdigitate อยู่ใน maternal crypts **fetal tissue จึงอาจค้างอยู่ใน caruncles หลังคลอดได้**"
            ]
          },
          {
            "callout": "เทียบกับหมูให้ดี ปลาย villi ของ ruminant กลายเป็น cuboidal แต่ปลาย ridge ของหมูกลายเป็น flattened ทั้งคู่เริ่มจาก columnar ที่ฐานเหมือนกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Carnivore: zonary, labyrinthine, mildly deciduate, endotheliochorial",
        "source": "Placenta p.31, 32, 34",
        "body": [
          {
            "text": "ระยะแรกมี **choriovitelline placenta ที่กว้างขวาง ซึ่ง invade และ erode uterine tissue แล้วจึง regress** (p.31)"
          },
          {
            "sub": "Carnivore placenta ประกอบด้วย 3 ชั้น (p.31)",
            "body": [
              {
                "bullets": [
                  "**Labyrinthine layer**",
                  "**Junctional zone**: มี terminal lamellae, maternal vessels และ glandular secretions โดย**ชั้นนี้ขยายใหญ่ในสุนัข**",
                  "**Glandular zone**: เป็นชั้นลึกที่สุด มี dilated secreting glands และ **decidual cells**"
                ]
              }
            ]
          },
          {
            "sub": "Marginal hematomas และ trophoblast (p.32)",
            "body": [
              {
                "text": "**Marginal hematomas เกิดแบบสุ่ม การที่ trophoblasts ย่อยสลาย extravasated blood ทำให้เกิด meconium สีเขียวหรือน้ำตาล**"
              },
              {
                "text": "**Syncytiotrophoblasts เป็นส่วนใหญ่ของ trophoblastic layer**"
              }
            ]
          },
          {
            "sub": "ตัวย่อบนรูป photomicrograph (p.34)",
            "body": [
              {
                "bullets": [
                  "CT = connective tissue",
                  "SY = syncytiotrophoblast",
                  "CY = cytotrophoblast",
                  "SZ = spongy zone",
                  "GC = glandular chamber"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rabbit: discoidal, labyrinthine, deciduate, hemochorial",
        "source": "Placenta p.37-38",
        "body": [
          {
            "text": "สไลด์กระต่ายให้แค่ชุด classification ที่หัวเรื่องกับรูป ส่วนข้อความเดียวที่มีคือคำอธิบายตัวย่อบนภาพ (p.38)"
          },
          {
            "bullets": [
              "LZ = labyrinth zone",
              "JZ = junctional zone",
              "DN = decidual zone of necrosis",
              "DS = decidual zone of separation",
              "UM = uterine myometrium"
            ]
          },
          {
            "callout": "**สไลด์ไม่ได้บอก**รายละเอียดกลไกหรือ histology ของกระต่ายเพิ่มเติมนอกจากตัวย่อชุดนี้ ให้ตอบเท่าที่เด็คให้ไว้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สรุปชุด classification 4 คำของแต่ละสปีชีส์ (ตามหัวสไลด์)",
        "source": "Placenta p.19-38",
        "body": [
          {
            "text": "หัวเรื่องของทุกสไลด์สปีชีส์เขียนเป็นชุด 4 คำเรียงเหมือนกัน คือ attachment area, interface, degree of uterine destruction, tissue barrier **ท่องเป็นชุดจะได้ทั้ง 4 classification ในครั้งเดียว**"
          },
          {
            "bullets": [
              "**Pig**: diffuse, fold, non-deciduate, epitheliochorial",
              "**Horse**: diffuse, villous, non-deciduate, epitheliochorial",
              "**Ruminant**: cotyledonary, villous, non-deciduate, epitheliochorial",
              "**Carnivore (dog และ cat)**: zonary, labyrinthine, mildly deciduate, endotheliochorial",
              "**Rabbit**: discoidal, labyrinthine, deciduate, hemochorial"
            ]
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นรูปล้วน ต้องดูจากไฟล์จริง",
        "source": "Placenta p.5, 7, 11, 17, 21-24, 27, 29-30, 33, 35-36, 39-40",
        "body": [
          {
            "text": "สไลด์กลุ่มนี้มีแต่หัวเรื่องกับ diagram หรือ photomicrograph และลิงก์ที่มา ไม่มีข้อความบรรยาย จดโน้ตจากตัวหนังสือจึงดึงอะไรออกมาไม่ได้ ต้องเปิดไฟล์สไลด์ดูรูปเอง"
          },
          {
            "bullets": [
              "p.5 และ p.7 Fetal membranes เป็นรูป",
              "p.11 หัวเรื่อง area of fetomaternal attachment มีคำว่า Diffuse กับรูป",
              "p.17 หัวเรื่อง maternal and fetal tissue interface เป็นรูป",
              "p.21-24 และ p.27 ม้า เป็นรูป",
              "p.29-30 ruminant เป็นรูป",
              "p.33 dog, p.35-36 cat, p.39 rabbit เป็นรูป",
              "p.40 มีแต่ลิงก์อ้างอิงเรื่อง placentation in different species"
            ]
          },
          {
            "callout": "objective ข้อ 3 ที่ให้ identify different cell types อาศัยสไลด์รูปกลุ่มนี้เป็นหลัก แต่**เด็คให้ label ของเซลล์ไว้แค่ 2 แผ่นคือ p.34 (carnivore) กับ p.38 (rabbit)** ที่เหลือ**สไลด์ไม่ได้บอก**ว่าโครงสร้างในรูปชื่ออะไร",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "histo--respiratory-system": {
    "topic": "histo--respiratory-system",
    "title": "Respiratory System",
    "icon": "📖",
    "summary": "สไลด์ Histology of Respiratory System มี 29 หน้า แต่มีข้อความจริงเพียง 8 หน้า (หน้า 1, 2, 3, 11, 15, 18, 19, 20) ที่เหลือเป็นสไลด์ภาพ histology ล้วนซึ่งไม่มี text layer ให้อ่าน เนื้อหาที่เป็นตัวหนังสือครอบคลุม การแบ่งส่วนของ respiratory system (conducting / respiratory / ventilating part), epithelium ของ nasal vestibule, ชั้นผนังแบบ tubular structure และ typical epithelium พร้อมข้อยกเว้น, ตำแหน่งเกาะของ trachealis muscle ที่ต่างกันตามชนิดสัตว์, การแตกแขนงของ tracheobronchial tree, epithelium ของ bronchiole แต่ละระดับ, องค์ประกอบของ blood-air barrier และเซลล์ใน interalveolar septum รายละเอียดอื่นนอกเหนือจากนี้ต้องดูจากภาพในสไลด์เอง",
    "sections": [
      {
        "heading": "โครงสร้างของ Respiratory System แบ่งเป็น 3 ส่วน",
        "source": "Respiratory System p.1",
        "body": [
          {
            "text": "สไลด์เปิดเรื่องด้วยการแบ่ง Structure of RS ออกเป็น 3 ส่วนตามหน้าที่"
          },
          {
            "bullets": [
              "**Conducting part: Nose ถึง terminal bronchiole**",
              "**Respiratory part: Respiratory bronchiole ถึง alveolus** ซึ่งสไลด์ระบุว่าเป็น **Functional lung unit (1 acinus)**",
              "**Ventilating part: Thorax, intercostal muscle, abdominal muscle, lung**"
            ]
          },
          {
            "callout": "จุดที่ต้องแยกให้ออกคือเส้นแบ่งอยู่ที่ terminal bronchiole กับ respiratory bronchiole ส่วนหน้าที่ของแต่ละส่วนโดยละเอียด สไลด์ไม่ได้บอก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Nasal vestibule",
        "source": "Respiratory System p.2",
        "body": [
          {
            "text": "หน้า Anatomy of Respiratory System เขียนถึง **Muzzle ของสุนัข** และ **Nasal vestibule**"
          },
          {
            "bullets": [
              "Nasal vestibule บุด้วย **Keratinized stratified squamous epithelium + pigment** ลักษณะคล้ายผิวหนัง (~ skin)"
            ]
          },
          {
            "callout": "สไลด์ให้เฉพาะ epithelium ของ nasal vestibule ส่วนโครงสร้างอื่นของ nasal cavity เช่น respiratory region หรือ olfactory region สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Tubular Structure ของผนังทางเดินหายใจ",
        "source": "Respiratory System p.3",
        "body": [
          {
            "sub": "ชั้นของผนังตามที่สไลด์เรียงไว้",
            "body": [
              {
                "bullets": [
                  "**Tunica mucosa (Respiratory mucosa)** ประกอบด้วย Epithelium*, Lamina propria, Lamina muscularis* โดยสไลด์กำกับว่า \"Propria – submucosa\"",
                  "**Tunica submucosa**: Loose CNT, gland, blood vessel, nerve ending",
                  "**Cartilage**",
                  "**Tunica muscularis**",
                  "**Tunica adventitia หรือ serosa (mesothelium)**"
                ]
              }
            ]
          },
          {
            "text": "**Typical epithelium ของทางเดินหายใจ = Ciliated pseudostratified columnar epithelium with goblet cell**"
          },
          {
            "sub": "ตำแหน่งที่เป็นข้อยกเว้น ไม่ได้ใช้ typical epithelium",
            "body": [
              {
                "bullets": [
                  "Nasal vestibule",
                  "Vocal fold",
                  "Bronchiole",
                  "Alveolar duct",
                  "Alveolar sac",
                  "Alveolus"
                ]
              }
            ]
          },
          {
            "callout": "อาจารย์ใส่เครื่องหมาย * ไว้ที่ Epithelium และ Lamina muscularis และ ** ไว้ที่ Tunica muscularis แต่สไลด์ไม่ได้เขียนว่าเครื่องหมายนี้หมายถึงอะไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Trachealis muscle ต่างกันตามชนิดสัตว์",
        "source": "Respiratory System p.11",
        "body": [
          {
            "text": "หน้าหลอดลมระบุตำแหน่งการขึงของ Trachealis muscle เทียบระหว่างกลุ่มสัตว์"
          },
          {
            "bullets": [
              "**human, horse, pig, cattle**: ขึงปลายขอบ cartilage ทั้งสองข้าง **ทางด้านใน**",
              "**Carnivore**: ขึงปลายขอบ cartilage ทั้งสองข้าง **ทางด้านนอก**"
            ]
          },
          {
            "callout": "ข้อแตกต่างที่หน้านี้ระบุมีข้อเดียว คือ ด้านใน กับ ด้านนอก ของขอบ cartilage",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Tracheobronchial tree",
        "source": "Respiratory System p.15",
        "body": [
          {
            "bullets": [
              "การแตกแขนงเป็นแบบ **Pseudodichotomous branching** (สไลด์อ้างที่มา Anderson, 1994)",
              "**\"Bronchopulmonary segment\"** อยู่ที่ระดับ **Tertiary (Segmental) bronchus**"
            ]
          },
          {
            "callout": "จำนวน bronchopulmonary segment ในแต่ละชนิดสัตว์ หรือความแตกต่างของ lobation สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Bronchiole ไล่ตามลำดับจนถึง Alveolar duct",
        "source": "Respiratory System p.18",
        "body": [
          {
            "bullets": [
              "**Primary, secondary bronchiole: Simple columnar epithelium**",
              "**Tertiary (terminal) bronchiole: Simple cuboidal epithelium** มี **Myoelastic layer** และ fold และ **No cartilage**",
              "**Respiratory bronchiole: Simple cuboidal / squamous (alveolus) epithelium**",
              "**Alveolar duct: Knoblike appearance** จาก smooth muscle cell"
            ]
          },
          {
            "callout": "ลำดับ epithelium ที่บางลงเรื่อย ๆ columnar ไป cuboidal ไป squamous คือแกนของหน้านี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Blood-air barrier",
        "source": "Respiratory System p.19",
        "body": [
          {
            "text": "**Blood-air barrier มีชื่อเรียกอื่นว่า Respiratory membrane หรือ Alveolar-capillary membrane** สไลด์ไล่องค์ประกอบไว้ 6 ข้อตามลำดับ"
          },
          {
            "bullets": [
              "1. **Pulmonary surfactant**",
              "2. **Alveolar epithelial cell (Type I, II)**",
              "3. **Basement membrane of alveolar epithelium**",
              "4. **Basement membrane of endothelial lining of blood vessel**",
              "5. **Endothelial cell of blood vessel**",
              "6. **Red blood cell (RBC)**"
            ]
          },
          {
            "callout": "สไลด์นับ RBC เป็นข้อที่ 6 ของ barrier ด้วย ส่วนความหนาของ barrier เป็นตัวเลขเท่าไร สไลด์ไม่ได้บอก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Interalveolar septum",
        "source": "Respiratory System p.20",
        "body": [
          {
            "bullets": [
              "**Type I pneumocyte (squamous cell) 97%**",
              "**Type II pneumocyte (cuboid cell) 3%** โดยสไลด์เขียนต่อท้าย Type II ว่า **Pulmonary surfactant** และ **Can change to Type I pneumocyte**",
              "**Pulmonary alveolar macrophage (PAM)**"
            ]
          },
          {
            "callout": "ตัวเลข 97% กับ 3% เป็นสัดส่วนที่สไลด์ระบุไว้ตรง ๆ ต้องจำคู่กับชนิดเซลล์",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หน้าที่เป็นภาพ histology ล้วน",
        "source": "Respiratory System p.4-10, 12-14, 16-17, 21-29",
        "body": [
          {
            "text": "หน้าเหล่านี้ไม่มีข้อความใด ๆ ใน text layer เลย เป็นสไลด์ภาพ histology ล้วน ซึ่งน่าจะเป็นภาพประกอบของหัวข้อข้างเคียง เช่น ภาพช่วงหลังหน้า Tubular structure ภาพช่วงหลอดลม และภาพช่วงท้ายหลัง interalveolar septum"
          },
          {
            "callout": "จำเป็นต้องเปิดไฟล์สไลด์จริงเพื่อดูภาพเหล่านี้ เพราะเนื้อหาที่อาจารย์สอนจากภาพไม่ปรากฏเป็นตัวหนังสือ และโน้ตนี้ไม่ได้เดาแทน",
            "kind": "warn"
          }
        ]
      }
    ]
  },
  "histo--special-sense": {
    "topic": "histo--special-sense",
    "title": "Special Sense: จุลกายวิภาคของตาและหู",
    "icon": "🔬",
    "lecturer": "Sayamon Srisuwatanasagul",
    "summary": "เด็คนี้ครอบคลุม special sense organs 2 อวัยวะ คือ The Eye (สไลด์ 2-34) และ The Ear (สไลด์ 37-71) ฝั่งตาไล่จากชั้นของลูกตา 3 ชั้น cornea 5 ชั้น tapetum lucidum ciliary body และ accommodation iris aqueous humor retina 10 ชั้น lens ไปจนถึง eyelid conjunctiva และ tear ฝั่งหูไล่จาก external middle inner ear ossicles labyrinth vestibular apparatus organ of Corti และ mechanism of hearing ข้อควรรู้ก่อนอ่าน คือ เด็คนี้เป็นสไลด์บรรยายที่มีรูปประกอบเยอะมาก สไลด์จำนวนมาก (เช่น 3, 5, 10, 16, 19, 24, 25, 30, 47, 50, 56, 58-60, 62, 65-71) มี text layer ว่างเปล่าหรือมีแค่ชื่อหัวข้อ เช่น p.19 มีแค่คำว่า Pupil และ p.66 มีแค่ The Cochlea ส่วน p.42 มีแต่ลิงก์ ResearchGate จึงสรุปเป็นตัวหนังสือไม่ได้ ต้องกลับไปดูรูปในสไลด์จริง และข้อความภาษาไทยในเด็คบางสไลด์ (12, 15, 18, 22, 35, 36) มีปัญหา font ทำให้ตัวอักษรเพี้ยน จุดที่อ่านไม่ออกจะระบุไว้ว่าสไลด์ไม่ได้บอกหรืออ่านไม่ออก",
    "sections": [
      {
        "heading": "ภาพรวมของ The Eye: หน้าที่และ 3 ชั้นของผนังลูกตา",
        "source": "Special Sense p.2",
        "body": [
          {
            "text": "หน้าที่ของตาคือ **transform light into electrical impulses ที่ส่งไปยัง brain แล้วสมองสร้างเป็นภาพ (images)**"
          },
          {
            "text": "ผนังลูกตาแบ่งเป็น 3 ชั้น จำเป็นโครงหลักของทั้งเด็คนี้"
          },
          {
            "bullets": [
              "**Fibrous layer: sclera และ cornea**",
              "**Vascular layer (uvea): choroid, ciliary body และ iris**",
              "**Neuroepithelial layer: retina**"
            ]
          }
        ]
      },
      {
        "heading": "Compartments of the eye",
        "source": "Special Sense p.4",
        "body": [
          {
            "bullets": [
              "**Anterior compartment: อยู่ระหว่าง cornea กับ vitreous body** แบ่งเป็น anterior chamber และ posterior chamber และ **fills with aqueous humor**",
              "**Posterior compartment: อยู่ระหว่าง lens กับ retina และ fills with vitreous body**"
            ]
          }
        ]
      },
      {
        "heading": "Sclera",
        "source": "Special Sense p.6",
        "body": [
          {
            "bullets": [
              "หน้าที่ maintain shape of the eye",
              "**คลุม 3 ใน 4 ของพื้นที่ด้านหลัง (posterior area) ของลูกตา**",
              "เนื้อเยื่อเป็น **dense irregular connective tissue (CNT)**",
              "อาจพบ melanocyte ได้ (melanocyte may be presented)"
            ]
          }
        ]
      },
      {
        "heading": "Cornea: 5 ชั้น",
        "source": "Special Sense p.7",
        "body": [
          {
            "text": "**Cornea เป็น avascular และ transparent** ประกอบด้วย 5 ชั้น เรียงจากด้านหน้าไปด้านหลัง"
          },
          {
            "bullets": [
              "1. **Corneal epithelium (ant. epi.): non-keratinized stratified squamous epi.**",
              "2. Subepithelial basement membrane (ant. limiting lamina)",
              "3. **Substantia propia (corneal stroma): layer of collagen fibers, fibroblast ที่เรียกว่า keratocyte และ amorphous ground substance**",
              "4. Posterior limiting lamina (Descemet's membrane)",
              "5. **Posterior epithelium (corneal endothelium): simple sq. หรือ cuboidal epi.**"
            ]
          },
          {
            "callout": "จุดที่ออกสอบง่ายคือ epithelium หัวกับท้ายไม่เหมือนกัน ด้านหน้าเป็น non-keratinized stratified squamous ส่วนด้านหลังเป็น simple squamous หรือ cuboidal",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Corneoscleral junction (limbus)",
        "source": "Special Sense p.9",
        "body": [
          {
            "bullets": [
              "**sclera overlaps cornea ที่ corneoscleral junction**",
              "**cornea ไม่มีเส้นเลือด สารอาหารจึงมาถึงโดย diffusion จาก blood vessels และจาก aqueous humor**",
              "**Canal of schlemn พบใน primate (สไลด์ทำเครื่องหมายเน้นไว้) และ dog**"
            ]
          }
        ]
      },
      {
        "heading": "Vascular layer (Uvea): choroid",
        "source": "Special Sense p.11",
        "body": [
          {
            "text": "**Choroid หนาและ richly vascularized อยู่ระหว่าง sclera กับ retina** แบ่งเป็น 5 ชั้น"
          },
          {
            "bullets": [
              "suprachoroid layer",
              "vascular layer",
              "**tapetum lucidum** (สไลด์ทำเครื่องหมายเน้นไว้)",
              "choriocapillary layer",
              "**basal complex: แยก choroid ออกจาก retina**"
            ]
          }
        ]
      },
      {
        "heading": "Tapetum lucidum",
        "source": "Special Sense p.12",
        "body": [
          {
            "bullets": [
              "**ช่วยเพิ่มความเข้มของแสง โดยคุณสมบัติในการหักเหของแสง**",
              "**พบบริเวณ fundus ซึ่งเป็นบริเวณด้านในของครึ่งหลังของลูกตา ที่สามารถมองเห็นได้เมื่อใช้ opthalmoscope**",
              "**Avascular**",
              "**Carnivore: เซลล์หลายเหลี่ยม เรียกว่า tapetum cellurosum**",
              "**Herbivore: เป็นชั้นเนื้อเยื่อเกี่ยวพัน เรียกว่า tapetum fibrosum**"
            ]
          },
          {
            "callout": "ข้อความไทยในสไลด์นี้ font เพี้ยนหนัก ส่วนที่ถอดได้แน่คือคู่ carnivore กับ herbivore และคำว่า fundus กับ avascular ถ้าจะจำรายละเอียดกลไกมากกว่านี้ต้องกลับไปดูสไลด์ตัวจริง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Ciliary body",
        "source": "Special Sense p.13",
        "body": [
          {
            "bullets": [
              "**เป็น rostral continuation of the choroid**",
              "**Extends from the ora serrata ไปจนถึง iris**",
              "**หน้าที่คือ ยึดเลนส์และเปลี่ยนแปลงรูปร่างของเลนส์ (accomodation) เพื่อปรับระยะโฟกัสของภาพ**"
            ]
          }
        ]
      },
      {
        "heading": "ส่วนประกอบของ ciliary body",
        "source": "Special Sense p.14",
        "body": [
          {
            "sub": "ciliary process",
            "body": [
              {
                "bullets": [
                  "เป็น rostral projection ของ ciliary body เข้าไปหา lens",
                  "**Aqueous humor production**",
                  "**zonular fiber attached to lens capsule**"
                ]
              }
            ]
          },
          {
            "sub": "ciliary muscle",
            "body": [
              {
                "text": "**เป็น smooth muscle อยู่ภายใน loose CNT**"
              }
            ]
          }
        ]
      },
      {
        "heading": "Accomodation",
        "source": "Special Sense p.15",
        "body": [
          {
            "text": "สไลด์อธิบายกลไกเป็น 2 ทาง"
          },
          {
            "bullets": [
              "**contraction ของ ciliary m. ทำให้ ciliary process ถูกดึงไปข้างหน้า แรงดึงที่กระทำต่อ lens capsule จะลดลง ทำให้เลนส์มีรูปร่างกลมมากขึ้น เกิดการโฟกัสภาพในระยะใกล้**",
              "**ถ้า ciliary muscle คลายตัว ciliary process ถูกดึงไปข้างหลัง zonular fiber จะดึง lens capsule ทำให้รูปร่างของเลนส์ยาวขึ้น เกิดการโฟกัสภาพของวัตถุในระยะไกล**"
            ]
          },
          {
            "callout": "จำเป็นคู่ตรงข้าม ciliary muscle หดตัว = เลนส์กลม = มองใกล้ ส่วน ciliary muscle คลายตัว = zonular fiber ดึง = เลนส์ยาว = มองไกล",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Iris",
        "source": "Special Sense p.17",
        "body": [
          {
            "bullets": [
              "**เป็นส่วนที่อยู่หน้าที่สุด (most anterior part) อยู่ rostral ต่อ lens และอยู่ระหว่าง anterior chamber กับ posterior chamber**",
              "**Pupil คือช่องที่ทำให้ anterior chamber และ posterior chamber ติดต่อกัน**",
              "เนื้อเยื่อเป็น richly vascularized CNT",
              "**Melanocytes ร่วมกับ posterior pigmented epithelium ของ ciliary body เป็นตัวกำหนดสีของ iris**"
            ]
          }
        ]
      },
      {
        "heading": "Muscles of iris",
        "source": "Special Sense p.18",
        "body": [
          {
            "bullets": [
              "**Dilator muscle อยู่ขอบหลังของ iris การหดตัวทำให้ pupil กว้างขึ้น**",
              "**Sphinctor (constrictor) muscle อยู่บริเวณส่วนปลายของ iris การหดตัวทำให้ pupil แคบลง**"
            ]
          }
        ]
      },
      {
        "heading": "Aqueous humor",
        "source": "Special Sense p.20",
        "body": [
          {
            "bullets": [
              "**เป็น watery fluid ที่หล่อเลี้ยง lens และ cornea**",
              "**สร้างโดย ciliary epithelium, capillaries ของ ciliary process และ fibrocytes**",
              "**ไหลผ่าน pupil เข้าสู่ anterior chamber**",
              "**drained ที่ iridocorneal angle (filtration angle) ผ่าน intrascleral venous plexus**"
            ]
          }
        ]
      },
      {
        "heading": "Iridocorneal junction",
        "source": "Special Sense p.21",
        "body": [
          {
            "bullets": [
              "อยู่ที่ periphery ของ anterior chamber",
              "**ถ้า drainage ไม่เพียงพอ (inadequate drainage) จะทำให้ intraocular pressure เพิ่มขึ้น** สไลด์ทำเครื่องหมายเน้นไว้"
            ]
          },
          {
            "callout": "สไลด์ชี้แค่ว่า inadequate drainage ทำให้ความดันในลูกตาสูงขึ้น ไม่ได้ตั้งชื่อโรคหรือบอกการรักษาไว้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Neuroepithelial layer: retina แบ่งตามการรับภาพ",
        "source": "Special Sense p.22",
        "body": [
          {
            "bullets": [
              "**Pars optica retinae: 2/3 ด้านหลังของ eyeball เป็นบริเวณที่แสงผ่านไปถึงได้ (optical part, visual part)**",
              "**Pars ceca retinae: เป็นส่วนที่ไม่สามารถรับภาพได้ มีชั้นของเซลล์เพียง 2 ชั้น คือ pigmented และ nonpigmented epithelium**",
              "**Ora serrata: บริเวณรอยต่อระหว่างส่วน sensitive กับ insensitive ของ retina**"
            ]
          }
        ]
      },
      {
        "heading": "10 layers of retina",
        "source": "Special Sense p.23",
        "body": [
          {
            "text": "สไลด์ไล่ชื่อ 10 ชั้นตามลำดับ ควรท่องตามลำดับนี้"
          },
          {
            "bullets": [
              "**retinal pigment epithelium: simp. cuboidal**",
              "**photoreceptive layer (layer of rods and cones)**",
              "external limiting membrane",
              "outer nuclear layer",
              "outer plexiform layer",
              "inner nuclear layer",
              "inner plexiform layer",
              "ganglion cell layer",
              "optic nerve fiber layer",
              "internal limiting membrane"
            ]
          }
        ]
      },
      {
        "heading": "Photoreceptive layer (layer of rod and cone)",
        "source": "Special Sense p.26",
        "body": [
          {
            "bullets": [
              "**เป็นที่อยู่ของส่วน photoreceptive ของ first neuron ของ visual pathway**",
              "**Rod cells ถูกกระตุ้นด้วย dim light**",
              "**Cone cells ถูกกระตุ้นด้วย bright light และรับผิดชอบ color vision**"
            ]
          }
        ]
      },
      {
        "heading": "Area centralis และ blind spot",
        "source": "Special Sense p.27",
        "body": [
          {
            "sub": "Area centralis (p.27)",
            "body": [
              {
                "bullets": [
                  "**เป็นบริเวณที่เห็นภาพคมชัดที่สุด (most acute vision)**",
                  "**มี cone cells และ ganglion cells มากกว่าบริเวณอื่น**",
                  "**optic nerve fiber layer บางกว่า**"
                ]
              }
            ]
          },
          {
            "sub": "Blind spot (p.28)",
            "body": [
              {
                "text": "**เป็นบริเวณที่ไม่พบ photoreceptor cells** สไลด์หน้านี้มีแต่หัวข้อกับรูป ไม่ได้อธิบายรายละเอียดเพิ่ม"
              }
            ]
          }
        ]
      },
      {
        "heading": "Lens และ zonular fiber",
        "source": "Special Sense p.29",
        "body": [
          {
            "text": "Lens ประกอบด้วย 3 ส่วน"
          },
          {
            "bullets": [
              "**lens capsule: elastic fiber และ basement membrane ของ lens epithelium**",
              "**lens epithelium: simple cuboidal อยู่ที่ ant. surface**",
              "**lens fibers: long, prism shaped**"
            ]
          },
          {
            "bullets": [
              "**Lens เป็น avascular ได้สารอาหารจาก aqueous humor และ vitreous body**",
              "**Zonular fiber: bundle of collagen fibers ที่มาจาก basal lamina ของ ciliary body และไปเกาะที่ lens capsule**"
            ]
          }
        ]
      },
      {
        "heading": "Eyelids (palpebrae)",
        "source": "Special Sense p.31",
        "body": [
          {
            "bullets": [
              "มี upper และ lower eyelids",
              "**Tarsal gland (Meibomian gland) เป็น modified sebaceous gland**"
            ]
          }
        ]
      },
      {
        "heading": "Conjunctiva และ 3rd eyelid",
        "source": "Special Sense p.32",
        "body": [
          {
            "bullets": [
              "**Palpebral conjunctiva: stratified columnar**",
              "**3rd eyelid: เป็น conjunctival fold มี T-shaped hyaline cartilage และมี gland of 3rd eyelid**"
            ]
          },
          {
            "text": "**ชนิดของ gland of 3rd eyelid ต่างกันตามสัตว์ ตรงนี้ออกสอบง่าย**"
          },
          {
            "bullets": [
              "**serous: horse, cat**",
              "**mucous: pig**",
              "**seromucous: dog, cow**"
            ]
          }
        ]
      },
      {
        "heading": "Tear",
        "source": "Special Sense p.33",
        "body": [
          {
            "bullets": [
              "**สร้างจาก lacrimal gland, tarsal gland, gland of 3rd eyelid และ goblet cells ของ conjunctiva**",
              "**Lacrimal gland เป็น serous gland ชนิด tubuloalveolar type**"
            ]
          }
        ]
      },
      {
        "heading": "Dog vision",
        "source": "Special Sense p.34",
        "body": [
          {
            "bullets": [
              "**สุนัขเห็นสีได้น้อยกว่าคน (Dogs see fewer colors than we do)**",
              "**ระดับการมองเห็นอยู่ในช่วง 20/75**",
              "**Field of view ของตาสุนัขปกติ 240 องศา คน 180 องศา แมว 200 องศา**",
              "**สุนัขและแมวมองเห็นในที่แสงน้อยได้ดีกว่าคนประมาณ 7 เท่า**"
            ]
          }
        ]
      },
      {
        "heading": "The ear: แบ่ง 3 ส่วน",
        "source": "Special Sense p.37",
        "body": [
          {
            "bullets": [
              "**External ear: pinna (auricle) และ external auditory meatus**",
              "**Middle ear: tympanic cavity, auditory ossicles และ auditory tube**",
              "**Inner ear: osseous และ membranous labyrinth**"
            ]
          },
          {
            "callout": "สไลด์ 35 และ 36 เป็นสไลด์คั่นหัวข้อหู หัวข้อภาษาไทยอ่านไม่ออกจาก text layer และสไลด์ 36 มีลิงก์อ้างอิง veteriankey.com/the-ear-and-eye เท่านั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Middle ear: tympanic membrane และ tympanic cavity",
        "source": "Special Sense p.38",
        "body": [
          {
            "bullets": [
              "**Tympanic membrane เป็นตัวแบ่ง external auditory canal กับ tympanic cavity**",
              "**Epithelium ของ tympanic membrane ด้านนอกเป็น keratinized stratified squamous epithelium ด้านในเป็น simple squamous epithelium**",
              "**Tympanic cavity: simple squamous epithelium หรือ cuboidal epithelium**"
            ]
          }
        ]
      },
      {
        "heading": "Auditory tube และ guttural pouch",
        "source": "Special Sense p.39",
        "body": [
          {
            "bullets": [
              "**Auditory tube เชื่อม tympanic cavity กับ nasopharynx**",
              "**ในม้า ส่วนที่ขยายลงด้านล่าง (ventral expansion) ของ auditory tube เรียกว่า the guttural pouch**"
            ]
          }
        ]
      },
      {
        "heading": "The ossicles",
        "source": "Special Sense p.40",
        "body": [
          {
            "text": "**Ossicles วางตัวอยู่ระหว่าง tympanic membrane กับ vestibular oval window**"
          },
          {
            "bullets": [
              "**The malleus: inserts เข้าไปใน connective tissue ของ tympanic membrane**",
              "**The incus: เชื่อมระหว่าง malleus กับ stapes**",
              "**The stapes: เกาะกับ membrane ที่คลุม vestibular windows**"
            ]
          },
          {
            "bullets": [
              "**การเคลื่อนไหวของ ossicles ถูกควบคุมโดย tensor tympani และ stapedius muscle (p.41)**",
              "**ossicles ส่งต่อ vibration ของ tympanic membrane ไปยัง perilymph ของ internal ear (p.41)**"
            ]
          }
        ]
      },
      {
        "heading": "The inner ear: osseous labyrinth",
        "source": "Special Sense p.44",
        "body": [
          {
            "text": "**Inner ear ประกอบด้วย osseous labyrinth และ membranous labyrinth (p.43)** โดย osseous labyrinth แบ่งเป็น vestibule, semicircular canals และ cochlea"
          },
          {
            "bullets": [
              "**Vestibule: central space ที่ติดต่อกับ tympanic cavity ผ่าน vestibular window (p.45)**",
              "**Semicircular canals: มี anterior, posterior และ lateral canals ปลายที่ขยายออกเรียกว่า ampulla ossea (p.45)**"
            ]
          }
        ]
      },
      {
        "heading": "Cochlea และช่องภายใน",
        "source": "Special Sense p.46",
        "body": [
          {
            "text": "**Cochlea canals มีรูปร่าง spiral shape** ภายใน cochlea มี membranous labyrinth อยู่ แบ่งช่องเป็น"
          },
          {
            "bullets": [
              "**Cochlear ducts (Scala media)**",
              "**Scala vestibuli: dorsal compartment**",
              "**Scala tympani: ventral compartment**",
              "**helicotrema: ช่องเปิดเล็ก ๆ ที่ cupula ซึ่งทำให้ scala vestibuli กับ scala tympani ติดต่อกัน**"
            ]
          },
          {
            "callout": "สไลด์ 55 ซ้ำเนื้อหาหน้านี้ทั้งหน้า ไม่ได้เพิ่มข้อมูลใหม่",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Membranous labyrinth",
        "source": "Special Sense p.48",
        "body": [
          {
            "bullets": [
              "**บุด้วย simple squamous epithelium และภายในบรรจุ endolymph**",
              "**ภายนอกล้อมรอบด้วย perilymph**",
              "**Vestibular apparatus ประกอบด้วย utricle, saccule และ semicircular ducts**"
            ]
          },
          {
            "callout": "คู่ที่ต้องไม่สลับกัน endolymph อยู่ใน membranous labyrinth ส่วน perilymph อยู่รอบนอก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Vestibular apparatus: macula และ crista ampullaris",
        "source": "Special Sense p.51",
        "body": [
          {
            "bullets": [
              "**Utricle และ Saccule เชื่อมกันด้วย utriculosaccular duct**",
              "**Macula utriculi และ macula sacculi เป็น sensory area ภายใน utricle และ saccule**"
            ]
          },
          {
            "text": "หน้าที่ของ macula ตามสไลด์"
          },
          {
            "bullets": [
              "**detect linear acceleration**",
              "**head position**",
              "**control of posture, gait and equilibrium**"
            ]
          },
          {
            "text": "**Crista ampullaris เป็น ridge-shaped sensory receptor อยู่ใน ampulla ของ semicircular ducts**"
          }
        ]
      },
      {
        "heading": "Crista ampullaris",
        "source": "Special Sense p.53",
        "body": [
          {
            "bullets": [
              "**ประกอบด้วย supporting cells และ epithelial receptor cells**",
              "**apical sterocilia และ cilia ของ sensory cells ยื่นเข้าไปใน cupula**",
              "**Cupula เป็น gelatinous structure**",
              "**การเคลื่อนไหวของ cupula ทำให้ตรวจจับการเปลี่ยนแปลงของ speed of rotation ได้**"
            ]
          }
        ]
      },
      {
        "heading": "Cochlear duct (Scala media)",
        "source": "Special Sense p.57",
        "body": [
          {
            "bullets": [
              "**อยู่ระหว่าง scala vestibuli กับ scala tympani**",
              "**แยกจาก scala vestibuli ด้วย vestibular membrane**",
              "**แยกจาก scala tympani ด้วย basilar membrane**"
            ]
          }
        ]
      },
      {
        "heading": "Organ of Corti (spiral organ)",
        "source": "Special Sense p.61",
        "body": [
          {
            "bullets": [
              "**อยู่ใน cochlear duct**",
              "**เป็น receptor organ for sound**",
              "**ประกอบด้วย sensory cells และ supporting cells โดย sensory cells คือ inner และ outer hair cells**",
              "**Tectorial membrane: gelatinous structure ที่วางทับอยู่เหนือ spiral organ**",
              "**ปลายของ stereocilia ส่วนใหญ่ของ sensory cells ยึดติดกับ tectorial membrane**"
            ]
          }
        ]
      },
      {
        "heading": "Mechanism of hearing",
        "source": "Special Sense p.63",
        "body": [
          {
            "text": "สไลด์ไล่ลำดับเป็นสายโซ่ ควรจำเป็นลำดับ"
          },
          {
            "bullets": [
              "**เสียงทำให้เกิด vibration ที่ tympanic membrane**",
              "**ส่งต่อไปยัง the ossicles**",
              "**ไปยัง the scala vestibuli**",
              "**pressure change ใน perilymph ทำให้เกิด displacement ของ basilar membrane**",
              "**displacement ของ basilar membrane ทำให้เกิด displacement ของ sensory cell stereocilia (p.64)**",
              "**เกิดการปล่อย electrical impulse ไปตาม auditory nerve (p.64)**",
              "**สมองแปลผลออกมาเป็นเสียง (p.64)**"
            ]
          },
          {
            "callout": "สไลด์ 63 แนบลิงก์วิดีโอ YouTube ไว้ประกอบ ไม่ได้มีเนื้อหาข้อความเพิ่ม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สไลด์ที่เป็นรูปล้วน ต้องกลับไปดูของจริง",
        "source": "Special Sense",
        "body": [
          {
            "text": "เด็คนี้มีสไลด์จำนวนมากที่ text layer ว่างเปล่าหรือมีแค่หัวข้อ เพราะเนื้อหาอยู่ในรูป histology หรือแผนภาพ สรุปเป็นตัวหนังสือแทนไม่ได้"
          },
          {
            "bullets": [
              "ฝั่งตา: p.3, 5, 10, 16, 19, 24, 25, 30 เป็นรูปประกอบของโครงสร้างที่บรรยายไว้ในสไลด์ข้างเคียง",
              "ฝั่งหู: p.42 (ลิงก์ ResearchGate เรื่อง otic anatomy and physiology ของ dog และ cat), p.47, 49, 50, 54, 56, 58, 59, 60, 62, 65, 66 (The Cochlea), 67 (Organ of Corti), 68, 69, 70 (Semicircular duct), 71",
              "**หัวข้อที่ต้องดูรูปแน่ ๆ คือ Pupil (p.19), Crista Ampullaris (p.54), The Cochlea (p.66), Organ of Corti (p.67) และ Semicircular duct (p.70) เพราะเป็นสไลด์ที่มีแต่ชื่อหัวข้อกับภาพ**",
              "p.52 ไม่ใช่สไลด์รูปล้วน สไลด์เขียนไว้เต็มบรรทัดว่า Macula utriculi and macula sacculi: sensory area within utericle and saccule ซึ่งซ้ำกับ p.51"
            ]
          }
        ]
      }
    ]
  },
  "histo--tissue-preparation": {
    "topic": "histo--tissue-preparation",
    "title": "Tissue Preparation ทางจุลกายวิภาค",
    "icon": "📖",
    "summary": "เด็คนี้เปิดด้วยนิยามของ histology และเครื่องมือที่ใช้ดู (light microscope, electron microscope, slide scanner) แล้วไล่ขั้นตอนเตรียมเนื้อเยื่อแบบ paraffin ตั้งแต่ obtaining fresh specimen ไปจนถึง fixation, dehydration, clearing และ infiltration, embedding, sectioning และ H&E staining ปิดท้ายด้วย specialized histotechniques, รายชื่อ special stain ทีละตัว และ artifacts ที่พบบนสไลด์ ต้องรู้ไว้ว่าหลายหน้าในเด็ค (หน้า 2, 3, 5, 8, 9, 16, 19, 22 และหน้าสุดท้าย) เป็นหน้าหัวข้อหรือหน้ารูปล้วน ไม่มีข้อความอธิบายให้จดตาม",
    "sections": [
      {
        "heading": "Histology คืออะไร",
        "source": "tissue preparation p.1-3",
        "body": [
          {
            "text": "**Histology คือ study of the microanatomy of cells, tissues, and organs as seen through a microscope** คือการศึกษาโครงสร้างระดับจุลภาคของเซลล์ เนื้อเยื่อ และอวัยวะ ผ่านกล้องจุลทรรศน์"
          },
          {
            "text": "หน้า 2 ขึ้นหัวข้อ Cell type in tissue พร้อมคำว่า Epithelial cell และหน้า 3 ขึ้นหัวข้อ Histology of the gut ทั้งสองหน้าเป็นหน้ารูป ไม่มีข้อความอธิบายเพิ่ม สไลด์ไม่ได้บอกรายละเอียดของ cell type หรือของ gut ไว้ในเด็คนี้"
          }
        ]
      },
      {
        "heading": "เครื่องมือที่ใช้ดูเนื้อเยื่อ",
        "source": "tissue preparation p.4-8",
        "body": [
          {
            "text": "สไลด์แบ่งเครื่องมือเป็น **3 อย่าง คือ Light microscope, Electron microscope และ Slide scanner**"
          },
          {
            "sub": "Electron microscope",
            "body": [
              {
                "bullets": [
                  "เป็นเทคนิคสำหรับ obtaining high resolution images ทั้งของ biological และ non-biological specimens",
                  "**มี 2 ชนิดหลัก คือ transmission EM (TEM) และ scanning EM (SEM)**"
                ]
              }
            ]
          },
          {
            "sub": "Slide scanner",
            "body": [
              {
                "text": "สไลด์บอกไว้สั้น ๆ ว่าให้ภาพเซลล์แบบ reliable and high-resolution และแปะลิงก์วิดีโอ YouTube ไว้ประกอบ ไม่ได้อธิบายหลักการทำงานเพิ่ม"
              }
            ]
          },
          {
            "callout": "หน้า 8 ขึ้นหัวข้อ Function of Digital microscope ไว้เฉย ๆ แต่ไม่มีข้อความใต้หัวข้อเลย สไลด์ไม่ได้บอกว่า digital microscope ทำหน้าที่อะไรบ้าง",
            "kind": "flag"
          },
          {
            "text": "หน้า 5 (Light microscope) เป็นหน้ารูปล้วน ไม่มีข้อความอธิบาย"
          }
        ]
      },
      {
        "heading": "ขั้นที่ 1 Obtaining a fresh specimen และ Fixation",
        "source": "tissue preparation p.11-12",
        "body": [
          {
            "text": "ขั้นแรกของ tissue preparation คือ obtaining from fresh specimen แล้ว **fixed specimen as soon as possible** คือรีบแช่น้ำยาให้เร็วที่สุด"
          },
          {
            "sub": "Fixation",
            "body": [
              {
                "bullets": [
                  "Aim คือ **preservation of cells and tissue, prevent autolysis, to coagulate and harden tissue**",
                  "แช่ specimen ใน fixative เช่น formaldehyde solution (formalin) โดยสไลด์ระบุ **10% formalin**",
                  "**should fix for between 6 and 24 hours**",
                  "Fixative อื่นที่สไลด์ยกมา ได้แก่ Potassium dichromate, Glutaraldehyde, Mercuric chloride"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Dehydration, Clearing และ Infiltration",
        "source": "tissue preparation p.13-14",
        "body": [
          {
            "sub": "Dehydration",
            "body": [
              {
                "bullets": [
                  "**ดึง fixating solution และ tissue fluid ออกให้หมด**",
                  "**Alcohols are most commonly used for dehydration**",
                  "ใช้ alcohol หลาย % concentration ในเวลาที่ต่างกัน สไลด์ไม่ได้บอกว่าแต่ละ % ใช้กี่นาที"
                ]
              }
            ]
          },
          {
            "sub": "Clearing และ Infiltration",
            "body": [
              {
                "bullets": [
                  "ในขั้น clearing แอลกอฮอล์จะถูกแทนที่ด้วย organic solvents เช่น **xylene หรือ toluene**",
                  "จากนั้น **Infiltration with paraffin**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Embedding",
        "source": "tissue preparation p.15",
        "body": [
          {
            "bullets": [
              "คือการฝังเนื้อเยื่อใน solid medium เพื่อ **facilitate sectioning** ให้ตัดได้",
              "**Paraffin is used commonly for light microscopy**",
              "**Resins ใช้ได้ทั้ง LM และ EM**",
              "ตัวอย่างจะถูกวางใน melted paraffin แล้วให้ความร้อนเพื่อไล่ dehydrating material ออกให้หมด"
            ]
          }
        ]
      },
      {
        "heading": "Sectioning (Slicing)",
        "source": "tissue preparation p.17",
        "body": [
          {
            "text": "เนื้อเยื่อที่อยู่ใน paraffin block จะถูกนำมาตัดเป็นแผ่นบาง สไลด์เทียบเครื่องตัด 3 แบบ ซึ่งต่างกันที่ความหนาและสภาพเนื้อเยื่อที่ใช้"
          },
          {
            "bullets": [
              "**Microtome ตัด thin sections ประมาณ 1-50 µm จาก fixed tissue**",
              "**Vibratome ใช้ vibrating blade ตัดหนากว่า ประมาณ 100-200 µm จาก fresh หรือ fixed tissue**",
              "**Cryostat ตัดจาก deep-frozen blocks ซึ่ง usually of unfixed tissue**"
            ]
          },
          {
            "callout": "ตัวเลขช่วงความหนาบนหน้านี้ text layer เพี้ยน ส่วนที่อ่านได้ตรง ๆ คือ 1- ของ microtome และ 100- ของ vibratome ส่วนเลขท้าย 50 กับ 200 ถอดจากรหัสตัวอักษรที่เพี้ยน ถ้าเปิดไฟล์สไลด์จริงให้เช็คตัวเลขซ้ำอีกครั้ง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Staining ด้วย H&E",
        "source": "tissue preparation p.18",
        "body": [
          {
            "text": "สไลด์ยก **Histochemical stain by H&E staining (hematoxylin and eosin stain)** เป็นการย้อมพื้นฐาน"
          },
          {
            "bullets": [
              "**Hematoxylin ให้สี dark blue หรือ purple ติด cell nucleus รวมถึง ribosomes และ rough endoplasmic reticulum ของ cytoplasm**",
              "**Eosin เป็นกรด ให้สี pink ติด cytoplasm**"
            ]
          }
        ]
      },
      {
        "heading": "Specialized Histotechniques",
        "source": "tissue preparation p.20-21",
        "body": [
          {
            "text": "สไลด์บอกว่าเทคนิคกลุ่มนี้ใช้เพื่อ **to learn structure and function** และ **to locate molecular components**"
          },
          {
            "bullets": [
              "**Histochemistry และ cytochemistry** คือ identification และ localization ของ specific chemical ในเนื้อเยื่อและเซลล์",
              "**Immunohistochemistry** คือการตรวจหาสารจำเพาะ เช่น protein ในเนื้อเยื่อและเซลล์ โดยใช้ antibody labeling",
              "**In situ hybridization** คือเทคนิคระบุ specific mRNA species ในเซลล์แต่ละเซลล์บน tissue section",
              "**Autoradiography** อาศัยการ incorporate radiolabeled precursors หรือ substrates เข้าไปในเซลล์"
            ]
          },
          {
            "text": "หน้า 22 ขึ้นหัวข้อ Immunohistochemical เป็นหน้ารูป ไม่มีข้อความอธิบายเพิ่ม"
          }
        ]
      },
      {
        "heading": "Special stain แต่ละตัวใช้ดูอะไร",
        "source": "tissue preparation p.23-28",
        "body": [
          {
            "text": "ส่วนนี้ไล่ special stain ทีละตัว หน้าละหนึ่งสี ควรจำคู่ stain กับสิ่งที่มันชี้ให้เห็น"
          },
          {
            "bullets": [
              "**Alcian blue** ทำปฏิกิริยากับสารที่มี anionic groups เช่น acid mucosubstances และ acid mucins ใช้ในห้องแล็บเพื่อ demonstrate acid mucins ที่หลั่งจาก connective และ epithelial tissue tumors ต่าง ๆ",
              "**Giemsa stain** เป็นส่วนผสมของ methylene blue กับ eosin ใช้ในการ differentiation of cells, การตรวจทางพยาธิของ blood และ bone marrow films และ demonstration ของ parasites เช่น malaria",
              "**Toluidine blue** เป็นสีที่ versatile ย้อม nuclei เป็นสีน้ำเงิน และ **ใช้ระบุ mast cells**",
              "**Trichrome (Masson)** สำหรับ connective tissue โดย collagen เป็นสีน้ำเงิน nuclei สีดำ ส่วน cytoplasm, keratin และ muscle fiber เป็นสีแดง",
              "**Congo red** ใช้ระบุ deposits ของ protein ในเนื้อเยื่อที่เรียกว่า amyloid",
              "**Periodic acid-Schiff (PAS)** สำหรับ carbohydrates ได้แก่ basement membrane, glycogen, mucin และ amyloid deposit"
            ]
          }
        ]
      },
      {
        "heading": "Artifacts",
        "source": "tissue preparation p.29",
        "body": [
          {
            "text": "หน้าสุดท้ายที่มีเนื้อหาพูดถึง **artifacts** สิ่งที่โผล่มาบนสไลด์แต่ไม่ใช่โครงสร้างจริงของเนื้อเยื่อ"
          },
          {
            "bullets": [
              "**Extraneous material**",
              "**Folds**",
              "**Cracks**"
            ]
          },
          {
            "callout": "บรรทัดคำอธิบายภาษาไทยใต้คำว่า Artifacts บนหน้านี้ ตัวอักษรเพี้ยนจนอ่านไม่ออก จึงไม่ขอเดาข้อความ ส่วนที่แน่ชัดคือชื่อ artifacts 3 แบบด้านบน",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "histo--urinary-system": {
    "topic": "histo--urinary-system",
    "title": "Urinary System",
    "icon": "🔬",
    "lecturer": "Asst. Prof. Promporn Raksaseri",
    "summary": "เด็คนี้ไล่จุลกายวิภาคของ urinary system ตั้งแต่ renal capsule ลงไปถึง urethra โดยเน้นโครงสร้างที่ต้องดูออกในสไลด์จริง ได้แก่ องค์ประกอบและหน้าที่ของระบบ, uriniferous tubule กับจำนวน nephron รายชนิดสัตว์, unilobar vs multilobar kidney, cortex (pars convoluta / pars radiata) และ medulla, renal corpuscle กับ filtration barrier, mesangial cells, PCT/DCT/loop of Henle/collecting duct รวมทั้ง water permeability ของแต่ละส่วน, papillary duct และ area cribrosa, JGA และหน้าที่ในการคุม GFR, แล้วจบที่ ureter, urinary bladder, urethra สไลด์จำนวนมากเป็นภาพ micrograph หรือแผนภาพล้วนที่ไม่มีข้อความ (p.5, 11, 12, 18, 23, 25, 26, 34, 39, 40, 41, 43, 44, 46, 47) จึงถอดเป็นโน้ตไม่ได้ นอกจากคำ label ที่พิมพ์ไว้ และ p.51 เป็นรายการอ้างอิงหนังสือ 5 เล่ม",
    "sections": [
      {
        "heading": "องค์ประกอบและหน้าที่ของ urinary system",
        "source": "Urinary System p.2",
        "body": [
          {
            "text": "ระบบนี้ประกอบด้วย **(1) Kidneys (2) Ureter (3) Urinary bladder (4) Urethra**"
          },
          {
            "sub": "หน้าที่ 7 ข้อตามสไลด์",
            "body": [
              {
                "bullets": [
                  "Regulation of the balance between water and electrolytes (inorganic anions) and the acid balance",
                  "Excretion of metabolic wastes along with excess water and electrolytes",
                  "Excretion of many bioactive substances, including many drugs",
                  "Regulation of arterial blood pressure by secretion of **renin**",
                  "Secretion of **erythropoietin** to stimulate the RBC production",
                  "Conversion of the prohormone vitamin D to the active form calcitriol (สไลด์สะกดว่า calciterol)",
                  "Induce gluconeogenesis during starvation"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Uriniferous tubule และจำนวน nephron รายชนิดสัตว์",
        "source": "Urinary System p.4",
        "body": [
          {
            "text": "**Uriniferous tubule (1 functional unit) = nephron + CD** และ **Nephron = renal corpuscle + renal tubule**"
          },
          {
            "sub": "จำนวน nephron ต่อไต (หน่วยล้าน) ตามสไลด์",
            "body": [
              {
                "bullets": [
                  "Horse 2.7",
                  "Ox 4",
                  "Pig 1",
                  "Small ruminants 0.5",
                  "Dog 0.18-0.4"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ชนิดของ nephron",
        "source": "Urinary System p.6",
        "body": [
          {
            "bullets": [
              "**Cortical nephron with short loop of Henle** predominate ใน horse และ ruminants",
              "**Juxtaglomerular nephron with long loops of Henle** predominate ใน ox, pig, dog และ cat"
            ]
          },
          {
            "callout": "สไลด์เขียน ruminants ไว้ในกลุ่มแรก แต่เขียน ox ไว้ในกลุ่มที่สอง ทั้งที่ ox ก็เป็น ruminant สไลด์ไม่ได้อธิบายว่าจะให้ตีความอย่างไร ตอนตอบข้อสอบให้ยึดตามที่อาจารย์เขียนไว้ทั้งสองบรรทัด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Renal function 4 กระบวนการ",
        "source": "Urinary System p.7",
        "body": [
          {
            "bullets": [
              "**Filtration**: water และ solutes ในเลือดออกจาก vascular space เข้าสู่ lumen ของ nephron",
              "**Secretion**: สารเคลื่อนจาก epithelial cells ของ tubules เข้าสู่ lumen โดยปกติหลังจากรับสารมาจาก interstitium และ capillaries รอบ ๆ",
              "**Reabsorption**: สารเคลื่อนจาก tubular lumen ผ่าน epithelium เข้าสู่ interstitium และ capillaries รอบ ๆ",
              "Excretion"
            ]
          },
          {
            "callout": "สไลด์เขียนหัวข้อ Excretion ไว้แต่ไม่ได้ให้คำจำกัดความต่อ (สไลด์ไม่ได้บอก) ต่างจากอีก 3 ข้อที่มีคำอธิบายครบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Unilobar vs multilobar kidney",
        "source": "Urinary System p.8",
        "body": [
          {
            "bullets": [
              "**Unilobar kidneys**: ปลายของ medullary pyramids เชื่อมรวมกันเป็น **renal crest** พบใน dog, cat, horse, small ruminant",
              "**Multilobar kidneys**: apices ของ medullary pyramids แยกกันอยู่และยื่นเข้าไปใน **renal calyces** พบใน large ruminant (ox), pigs, human"
            ]
          }
        ]
      },
      {
        "heading": "Renal capsule",
        "source": "Urinary System p.9",
        "body": [
          {
            "text": "เป็น dense irregular connective tissue (collagen, elastic fibers) ทำหน้าที่ protect from injury"
          },
          {
            "sub": "ปริมาณ smooth muscle ใน capsule ต่างกันตามชนิดสัตว์",
            "body": [
              {
                "bullets": [
                  "**Ruminant: smooth m. (+++)**",
                  "**Pig, horse, dog: smooth m. (++)**",
                  "**Cat: no smooth m.**"
                ]
              }
            ]
          },
          {
            "bullets": [
              "มี delicate fibers เชื่อมระหว่าง capsule กับ parenchyma",
              "Pathological processes อาจทำให้ capsule ยึดติดกับ parenchyma แน่นขึ้น"
            ]
          }
        ]
      },
      {
        "heading": "ภาพรวม cortex และ medulla",
        "source": "Urinary System p.10",
        "body": [
          {
            "text": "ไตประกอบด้วย **(1) renal cortex และ (2) renal medulla** โดยในภาพสไลด์ระบุ A = cortex, B = outer medulla, C = inner medulla"
          }
        ]
      },
      {
        "heading": "Renal cortex: pars convoluta และ pars radiata",
        "source": "Urinary System p.13",
        "body": [
          {
            "sub": "1. Pars convoluta (cortical labyrinth)",
            "body": [
              {
                "bullets": [
                  "Renal corpuscle",
                  "Proximal convoluted tubule",
                  "Distal convoluted tubule"
                ]
              }
            ]
          },
          {
            "sub": "2. Pars radiata (medullary rays)",
            "body": [
              {
                "bullets": [
                  "Collecting duct",
                  "**Straight portion of nephron = proximal straight tubule และ thick ascending limb (TAL) หรือ distal straight tubule**"
                ]
              }
            ]
          },
          {
            "text": "Label ในภาพ: 1 adipose tissue, 2 capsule, 3 renal corpuscle, 4 cortical labyrinth, 5 medullary ray"
          }
        ]
      },
      {
        "heading": "Renal medulla",
        "source": "Urinary System p.14",
        "body": [
          {
            "bullets": [
              "Collecting duct",
              "Thick segments of loop of Henle",
              "Thin segments of loop of Henle",
              "Vasa recta"
            ]
          },
          {
            "text": "Label ในภาพประกอบ: 1 renal capsule, 2 renal corpuscle, 3 cortical labyrinth, 4 medullary ray, 5 medulla"
          }
        ]
      },
      {
        "heading": "Blood supply และหลอดเลือดที่ต้องรู้จัก",
        "source": "Urinary System p.15-16",
        "body": [
          {
            "text": "สไลด์ p.15 เป็นแผนภาพ blood supply to the kidneys มีข้อความกำกับเพียงว่าเส้นเลือด pass between medullary ray"
          },
          {
            "bullets": [
              "**Vasa recta's function = maintain osmotic gradient in medulla**",
              "**Peritubular capillary network supply cortical labyrinth**"
            ]
          }
        ]
      },
      {
        "heading": "Renal corpuscle",
        "source": "Urinary System p.17",
        "body": [
          {
            "bullets": [
              "**1. Glomerulus** = a network of capillary located in the Bowman's capsule",
              "**2. Glomerular (Bowman) capsule** แบ่งเป็น visceral layer (internal) ที่ห่อ glomerular capillary ด้วย **podocytes** ซึ่งมี primary processes และ pedicels และ parietal layer ที่เป็น **simple squamous epithelium** มี basal lamina อยู่ด้านนอก",
              "**3. Capsular (urinary) space** อยู่ระหว่าง visceral และ parietal layer ของ Bowman capsule"
            ]
          },
          {
            "text": "สไลด์ชี้ตำแหน่ง **vascular pole** และ **tubular pole** ไว้บนภาพ"
          }
        ]
      },
      {
        "heading": "Filtration barrier",
        "source": "Urinary System p.19",
        "body": [
          {
            "text": "**Filtration occurs through a structure with 3 parts** และมีข้อความกำกับส่วนหนึ่งของภาพว่า produced by endothelial cells and podocytes and contains negative charge"
          },
          {
            "callout": "สไลด์หน้านี้ระบุแค่ว่าโครงสร้างที่ filtrate ต้องผ่านมี 3 ส่วน แต่ตัวข้อความบนสไลด์ไม่ได้พิมพ์ชื่อทั้ง 3 ส่วนออกมา",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Mesangial cells",
        "source": "Urinary System p.20",
        "body": [
          {
            "text": "**Mesangial cells = vascular pericytes ที่มี contractile properties และสร้าง component ของ external lamina**"
          },
          {
            "sub": "ตำแหน่ง",
            "body": [
              {
                "bullets": [
                  "**Extraglomerular mesangial cells**: อยู่ที่ vascular pole",
                  "**Intraglomerular mesangial cells**: อยู่ระหว่าง glomerular capillaries"
                ]
              }
            ]
          },
          {
            "sub": "ลักษณะทางจุลกายวิภาค",
            "body": [
              {
                "bullets": [
                  "รูปร่างแปลก คล้ายกระสวย (bizarre, spindle-like) นิวเคลียส heterochromatic และมีรอยเว้า (indented)",
                  "Cytoplasm มี myofibrils เบาบาง",
                  "**ติดสีเข้มกว่า podocytes และมี matrix**"
                ]
              }
            ]
          },
          {
            "sub": "หน้าที่ 4 ข้อ",
            "body": [
              {
                "bullets": [
                  "Physical support ของ capillaries ภายใน glomerulus",
                  "หดตัวปรับตามการเปลี่ยนแปลงของ blood pressure เพื่อช่วยรักษา filtration rate ให้เหมาะสม",
                  "Phagocytosis ของ protein aggregate ที่ glomerular filter และ antigen antibody complex",
                  "Secretion ของ cytokines, prostaglandins และ factors อื่นเพื่อ immune defense และ repair ของ glomerulus"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อ่าน renal corpuscle จากสไลด์จริง (label ที่อาจารย์ให้)",
        "source": "Urinary System p.21-22",
        "body": [
          {
            "sub": "Renal corpuscle, dog (p.21)",
            "body": [
              {
                "bullets": [
                  "A = capsular epithelium",
                  "B = capsular space",
                  "C = glomerulus",
                  "D = afferent arteriole",
                  "**E = JG cells (in tunica media)**",
                  "F = mesangial cells",
                  "**G = macula densa**",
                  "H = distal convoluted tubule",
                  "I = proximal convoluted tubule"
                ]
              }
            ]
          },
          {
            "sub": "Renal corpuscle and related structures (p.22)",
            "body": [
              {
                "bullets": [
                  "1 capsular epithelium, 2 urinary space, 3 glomerulus, 4 macula densa, 5 distal convoluted tubule, 6 proximal convoluted tubules"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Histophysiology of glomerular filtration",
        "source": "Urinary System p.24",
        "body": [
          {
            "bullets": [
              "**20% ของ blood plasma ที่เข้าสู่ glomerulus ถูก filter เข้าสู่ capsular space**",
              "Initial glomerular filtrate มีองค์ประกอบทางเคมีคล้าย plasma **ยกเว้นมี protein น้อยมาก**",
              "Glomerular filter กั้น plasma proteins ส่วนใหญ่ไว้ แต่ **protein ขนาดเล็กรวมทั้ง polypeptide hormones ส่วนใหญ่ผ่านเข้าไปใน filtrate ได้**"
            ]
          }
        ]
      },
      {
        "heading": "Proximal convoluted tubule (PCT)",
        "source": "Urinary System p.27",
        "body": [
          {
            "bullets": [
              "**Simple cuboidal epithelium**",
              "ท่อยาวและคดเคี้ยว (long and tortuous) กินพื้นที่ cortex เกือบทั้งหมด พบใน cortical labyrinth",
              "ทำหน้าที่ reabsorption และ secretion",
              "**มากกว่า 50% ของน้ำและ electrolytes รวมทั้ง organic nutrient ทั้งหมด (glucose, amino acids, vitamins ฯลฯ) ที่ถูก filter ที่ renal corpuscle ถูกดูดกลับที่ PCT** ผ่านผนัง tubule เข้าสู่ plasma ของ peritubular capillary"
            ]
          }
        ]
      },
      {
        "heading": "ลักษณะเซลล์ PCT เทียบกับ DCT",
        "source": "Urinary System p.28",
        "body": [
          {
            "sub": "Proximal tubule cells (PCT)",
            "body": [
              {
                "bullets": [
                  "Central nuclei",
                  "**Cytoplasm acidophilic จัด เพราะมี mitochondria มาก**",
                  "**Long microvilli เกิดเป็น brush border เด่นชัดใน lumen ช่วย reabsorption**",
                  "Ultrastructure: ที่ฐานของ microvilli มี pits และ vesicles จำนวนมาก บ่งชี้ endocytosis",
                  "มี long basal membrane invaginations และ lateral interdigitations กับเซลล์ข้างเคียง"
                ]
              }
            ]
          },
          {
            "sub": "Distal convoluted tubule (DCT)",
            "body": [
              {
                "bullets": [
                  "Simple cuboidal epithelium แต่เซลล์เล็กกว่า PT",
                  "DCT คดเคี้ยว (tortuous)",
                  "**เห็นนิวเคลียสมากกว่า PT**",
                  "**Mitochondria น้อยกว่า PT จึง acidophilic น้อยกว่า**",
                  "**อัตราการ reabsorb Na+ ถูกควบคุมโดย aldosterone**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Transport mechanism ใน proximal tubules",
        "source": "Urinary System p.29",
        "body": [
          {
            "sub": "1. Transcellular reabsorption",
            "body": [
              {
                "bullets": [
                  "Active: ใช้ ATP",
                  "Passive",
                  "มี transmembrane ion pumps, ion channels, transporters, enzymes และ carrier proteins"
                ]
              }
            ]
          },
          {
            "sub": "2. Paracellular transport",
            "body": [
              {
                "bullets": [
                  "น้ำและ solutes เคลื่อนแบบ passive ระหว่างเซลล์ตาม osmotic gradient",
                  "**ผ่าน epithelial leaky tight junction**"
                ]
              }
            ]
          },
          {
            "sub": "3. Receptor-mediated endocytosis",
            "body": [
              {
                "bullets": [
                  "Protein ขนาดเล็กใน filtrate ถูกดูดกลับด้วย receptor-mediated endocytosis แล้วย่อยใน cuboidal cells หรือถูกย่อยโดย peptidase ที่ luminal surface",
                  "**Organic anions และ cations ไม่ได้ถูก filter ผ่าน renal corpuscle แต่ถูกปล่อยที่ peritubular capillaries แล้ว uptake เข้า proximal tubule cells ก่อนถูก secrete เข้าสู่ filtrate**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Loop of Henle",
        "source": "Urinary System p.30",
        "body": [
          {
            "bullets": [
              "รูปตัว U อยู่ใน medulla ต่อมาจาก proximal straight tubule",
              "ประกอบด้วย thick segment และ thin segment",
              "เยื่อบุเป็น simple cuboidal epithelium หรือ simple squamous epithelium",
              "**Thin segment: organelles น้อย บ่งชี้ว่าเป็น passive transport เป็นหลัก และ impermeable to water**",
              "**Thick segment: simple cuboidal epithelium ที่มี mitochondria จำนวนมาก บ่งชี้ active transport (Na, Cl)**"
            ]
          }
        ]
      },
      {
        "heading": "Collecting duct system และ water permeability",
        "source": "Urinary System p.31",
        "body": [
          {
            "text": "แต่ละ nephron เทของเหลวเข้าสู่ collecting duct system ของ uriniferous tubule ซึ่งประกอบด้วย **connecting tubules, collecting ducts และ papillary ducts**"
          },
          {
            "bullets": [
              "**DCT responses to aldosterone**",
              "**Collecting duct is impermeable to water แต่ภายใต้ ADH จะ permeable**",
              "**TAL: impermeable to water และ urea แต่เซลล์มี chloride pump**",
              "Thin ascending limb: moderate permeable to water",
              "Thin descending limb: highly permeable to water"
            ]
          },
          {
            "callout": "จุดที่สไลด์เขียนไม่ตรงกันเอง p.30 บอกว่า thin segment impermeable to water แต่ p.31 แยกย่อยว่า thin descending limb highly permeable และ thin ascending limb moderate permeable สไลด์ไม่ได้อธิบายว่าจะให้ยึดอันไหน ควรถามอาจารย์ก่อนสอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Collecting duct cells",
        "source": "Urinary System p.32",
        "body": [
          {
            "sub": "1. Principal cells",
            "body": [
              {
                "bullets": [
                  "ติดสีจาง organelles น้อย microvilli เบาบาง ขอบเขตเซลล์ชัดเจน",
                  "มี basal membrane infolding",
                  "**Collecting duct ใน medulla = final site of water reabsorption**",
                  "**มี aquaporins (integral membrane pore protein ที่เป็น channel เฉพาะสำหรับโมเลกุลน้ำ)**",
                  "**ตอบสนองต่อ Anti-Diuretic hormone (ADH) หรือ vasopressin จาก pituitary gland เพื่อเพิ่มการดูดน้ำกลับผ่าน collecting duct cells (permeable to water)**"
                ]
              }
            ]
          },
          {
            "sub": "2. Intercalated cells",
            "body": [
              {
                "bullets": [
                  "**Mitochondria มากกว่า**",
                  "มี apical folds ยื่นออกมา",
                  "**รักษา acid-base balance โดย secrete H+/HCO3-**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อ่านภาพ outer medulla",
        "source": "Urinary System p.33",
        "body": [
          {
            "text": "Label ที่อาจารย์ให้ในภาพ outer medulla: **A = collecting duct, B = thick limbs, C = thin limb, D = vasa recta**"
          }
        ]
      },
      {
        "heading": "Papillary duct, renal pelvis และ area cribrosa",
        "source": "Urinary System p.35",
        "body": [
          {
            "text": "สไลด์แสดงลำดับ papillary duct ต่อเข้า renal pelvis แล้วต่อไปยัง ureter"
          },
          {
            "text": "**Area cribrosa เป็นบริเวณส่วนปลายสุดของ papilla ที่มี papillary duct มาเปิดจำนวนหลายท่อ ทำให้เห็นบริเวณนี้มีลักษณะเป็นรูพรุน**"
          }
        ]
      },
      {
        "heading": "เยื่อบุของ renal papilla และ papillary duct",
        "source": "Urinary System p.36-37",
        "body": [
          {
            "bullets": [
              "Renal papilla, dog: **A = papillary duct (simple columnar)**",
              "Renal papilla (goat): 1 = vasa recta, 2 = thin segment, **3 = renal papilla (columnar)**"
            ]
          }
        ]
      },
      {
        "heading": "Juxtaglomerular apparatus (JGA)",
        "source": "Urinary System p.38",
        "body": [
          {
            "bullets": [
              "ส่วน straight part ของ distal tubule มาสัมผัสกับ arteriole ที่ **vascular pole** ของ renal corpuscle",
              "**เซลล์ตรงนั้นเปลี่ยนเป็นทรง columnar และเรียงชิดกันแน่นกลายเป็น macula densa (MD)**",
              "Macula densa เป็นส่วนพิเศษของ sensory structure ที่เรียกว่า JGA",
              "**JGA รับผิดชอบ feedback mechanism ที่ควบคุม glomerular blood flow เพื่อรักษา rate of glomerular filtration ให้คงที่**"
            ]
          },
          {
            "sub": "Macula densa",
            "body": [
              {
                "bullets": [
                  "Apical nuclei",
                  "Basal golgi apparatus",
                  "มี ion channels และ transporters หลากหลายระบบ"
                ]
              }
            ]
          },
          {
            "sub": "JG cells",
            "body": [
              {
                "bullets": [
                  "**JG cells = modified smooth muscle cells ของ tunica media ใน afferent arteriole**",
                  "**นิวเคลียสกลม มี rough ER, golgi complex และ zymogen granules (secretion of renin)**"
                ]
              }
            ]
          },
          {
            "sub": "Lacis cells",
            "body": [
              {
                "bullets": [
                  "**Lacis cells (extraglomerular mesangial cells)** อยู่ที่ vascular pole ทำหน้าที่ supportive, contractile และ defensive"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หน้าที่ของ JGA ใน autoregulation ของ GFR และการคุมความดันเลือด",
        "source": "Urinary System p.42",
        "body": [
          {
            "sub": "1. เมื่อ arterial blood pressure เพิ่มขึ้น",
            "body": [
              {
                "text": "ลำดับตามสไลด์: glomerular capillary pressure เปลี่ยน ทำให้ GFR เปลี่ยน แล้ว **luminal concentration ของ Na และ Cl ใน TAL สูงขึ้น** macula densa detect ได้ จึง **release adenosine และ vasoactive compounds ทำให้เกิด afferent arteriole contraction** แล้ว glomerular pressure และ GFR เปลี่ยนตาม"
              }
            ]
          },
          {
            "sub": "2. เมื่อ arterial blood pressure ลดลง",
            "body": [
              {
                "text": "มี autonomic stimulation มายัง JGA และ **baroreceptor function ใน afferent arteriole (จาก JG cells)** ทำให้ **JG release renin เข้าสู่ blood circulation**"
              }
            ]
          },
          {
            "callout": "สไลด์หน้านี้ใช้ลูกศรขึ้นและลงกำกับแต่ละขั้น (เช่น GFR ขึ้นหรือลง) ซึ่งสัญลักษณ์ลูกศรไม่ติดมากับข้อความที่ถอดออกมา จึงระบุทิศทางของแต่ละขั้นจากไฟล์ข้อความไม่ได้ ให้เปิดสไลด์จริงดูทิศลูกศรก่อนท่อง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Ureter",
        "source": "Urinary System p.45",
        "body": [
          {
            "bullets": [
              "**Stellate shaped lumen**",
              "**Tunica mucosa: transitional epithelium**",
              "**Propria submucosa: มี mucosal gland ใน horse และ donkey**",
              "**Tunica muscularis: long-cir-long**",
              "Tunica serosa: loose CNT"
            ]
          },
          {
            "text": "Label ในภาพ: 1 tunica mucosa, 2 propria submucosa, 3 mucosal gland, 4 tunica muscularis, 5 tunica serosa โดยสไลด์เทียบภาพ horse กับ cat"
          }
        ]
      },
      {
        "heading": "Urinary bladder",
        "source": "Urinary System p.48",
        "body": [
          {
            "text": "Urinary bladder (pig) label ตามสไลด์: **1 transitional epithelium, 2 lamina propria, 3 muscularis mucosae, 4 tunica submucosa, 5 tunica muscularis**"
          }
        ]
      },
      {
        "heading": "Urethra",
        "source": "Urinary System p.49-50",
        "body": [
          {
            "bullets": [
              "**Mucosa: transitional epithelium**",
              "**Cavernous sinus / cavernous plexus ใน propria submucosa**",
              "**Feline female urethra: ไม่มี muscularis mucosae**",
              "**Urethral crest (mucosal fold) พบใน cat**"
            ]
          },
          {
            "text": "สไลด์ p.50 เทียบภาพ feline female urethra กับ canine female urethra โดยชี้ตำแหน่ง mucosal fold และ cavernous plexus"
          }
        ]
      }
    ]
  }
};
