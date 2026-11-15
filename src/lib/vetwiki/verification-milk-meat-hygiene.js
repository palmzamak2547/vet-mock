// ============================================================
// VetWiki — reference-verification overlay, Milk and Meat Hygiene notes of 2569
// ============================================================
// One claim per section added on 15 Nov 2026, each cross-checked against a real
// external source (./sources.js): the supporting words of the source are quoted
// in the claim's `review.rationale`, and a second reader fetched the source again
// and found them there. verification.js merges this overlay in code with the
// curated and the generated ones, so no key of one object literal can shadow another.
// ============================================================

/** @type {Record<string, Record<string, {claims: object[]}>>} */
export const MILK_MEAT_HYGIENE_VERIFICATIONS = {
  "milk-meat-hygiene--milk-cleaning": {
    "milk-meat-hygiene--milk-cleaning--cip-ระหว่าง-pasteurization-ลำดับการล้างท่อน้ำนม": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--cip-ระหว่าง-pasteurization-ลำดับการล้างท่อน้ำนม--v1",
          "statement": "CIP มาตรฐานในโรงงานนมล้างด้วยน้ำ แล้วล้างด้วยด่าง (โซเดียมไฮดรอกไซด์) ล้างน้ำ ล้างด้วยกรด (กรดไนตริก) แล้วล้างน้ำอีกครั้ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16216371",
              "locator": "Abstract (Int J Food Microbiol 2006;106(3):254-62)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "a standard clean-in-place (CIP) regime (water rinse, 1% sodium hydroxide at 65 degrees C for 10 min, water rinse, 1.0% nitric acid at 65 degrees C for 10 min, water rinse)"
          }
        }
      ]
    },
    "milk-meat-hygiene--milk-cleaning--sterilization-disinfection-antiseptic-disinfectant-และคำที่ใกล้ก": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--sterilization-disinfection-antiseptic-disinfectant-และคำที่ใกล้ก--v1",
          "statement": "Antiseptic ใช้กับเนื้อเยื่อและผิวหนังที่มีชีวิต ส่วน disinfectant ใช้กับวัตถุไม่มีชีวิตเท่านั้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-2008",
              "locator": "Introduction, definitions of germicide, antiseptic and disinfectant",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Antiseptics are germicides applied to living tissue and skin; disinfectants are antimicrobials applied only to inanimate objects."
          }
        }
      ]
    },
    "milk-meat-hygiene--milk-cleaning--alcohol-และ-aldehydes": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--alcohol-และ-aldehydes--v1",
          "statement": "กลไกที่น่าจะเป็นไปได้ที่สุดของ alcohol คือการทำให้โปรตีนเสียสภาพ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-2008",
              "locator": "Alcohol, Mode of Action",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The most feasible explanation for the antimicrobial action of alcohol is denaturation of proteins."
          }
        }
      ]
    },
    "milk-meat-hygiene--milk-cleaning--chlorhexidine-และกลุ่ม-iodine": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--chlorhexidine-และกลุ่ม-iodine--v1",
          "statement": "ประสิทธิภาพของ chlorine และ iodine ถูก organic matter รบกวนได้ง่าย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-2008",
              "locator": "Factors affecting efficacy, Organic and Inorganic Matter",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Chlorine and iodine disinfectants, in particular, are prone to such interaction."
          }
        }
      ]
    },
    "milk-meat-hygiene--milk-cleaning--halogen-compounds-chlorine-และ-sodium-hypochlorite": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--halogen-compounds-chlorine-และ-sodium-hypochlorite--v1",
          "statement": "ฤทธิ์ฆ่าเชื้อของ chlorine มาจาก hypochlorous acid (HOCl) ที่ไม่แตกตัว และลดลงเมื่อ pH สูงขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-2008",
              "locator": "Chlorine and Chlorine Compounds",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The microbicidal activity of chlorine is attributed largely to undissociated hypochlorous acid (HOCl). ... The disinfecting efficacy of chlorine decreases with an increase in pH"
          }
        }
      ]
    },
    "milk-meat-hygiene--milk-cleaning--organic-acid-และ-oxidizing-agents": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--organic-acid-และ-oxidizing-agents--v1",
          "statement": "Hydrogen peroxide ออกฤทธิ์ด้วยการสร้าง hydroxyl free radical ที่ทำลายไขมันของเยื่อหุ้มเซลล์ DNA และองค์ประกอบสำคัญอื่นของเซลล์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-2008",
              "locator": "Hydrogen Peroxide, Mode of Action",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Hydrogen peroxide works by producing destructive hydroxyl free radicals that can attack membrane lipids, DNA, and other essential cell components."
          }
        }
      ]
    },
    "milk-meat-hygiene--milk-cleaning--phenolic-compounds-และ-surface-active-agents": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--phenolic-compounds-และ-surface-active-agents--v1",
          "statement": "phenol ความเข้มข้นสูงเป็นพิษต่อโปรโตพลาซึมอย่างรุนแรง ทำลายผนังเซลล์และทำให้โปรตีนตกตะกอน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-2008",
              "locator": "Phenolics, Mode of Action",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In high concentrations, phenol acts as a gross protoplasmic poison, penetrating and disrupting the cell wall and precipitating the cell proteins."
          }
        }
      ]
    },
    "milk-meat-hygiene--milk-cleaning--สารทำความสะอาดในโรงงาน-ด่าง-และกรด": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--สารทำความสะอาดในโรงงาน-ด่าง-และกรด--v1",
          "statement": "ในโรงงานนม การล้างด้วยด่างและกรดใช้ลดจำนวนแบคทีเรียที่เกาะบนพื้นผิวสเตนเลส",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16216371",
              "locator": "Abstract (Int J Food Microbiol 2006;106(3):254-62)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "quantify the effectiveness of caustic and acid wash steps in reducing the number of viable bacteria attached to stainless steel (SS) surfaces"
          }
        }
      ]
    },
    "milk-meat-hygiene--milk-cleaning--เหตุที่ใช้-disinfectant-แล้วไม่ได้ผล": {
      "claims": [
        {
          "id": "milk-meat-hygiene--milk-cleaning--เหตุที่ใช้-disinfectant-แล้วไม่ได้ผล--v1",
          "statement": "organic matter เช่น เลือดและหนอง รบกวนฤทธิ์ของ disinfectant ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-2008",
              "locator": "Factors affecting efficacy, Organic and Inorganic Matter",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Organic matter in the form of serum, blood, pus, or fecal or lubricant material can interfere with the antimicrobial activity of disinfectants in at least two ways."
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-hygiene-intro": {
    "milk-meat-hygiene--meat-hygiene-intro--เนื้อสัตว์-meat-คืออะไร-และแบ่งเป็นกี่ประเภท": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-hygiene-intro--เนื้อสัตว์-meat-คืออะไร-และแบ่งเป็นกี่ประเภท--v1",
          "statement": "Codex นิยามเนื้อ (meat) ว่าเป็นทุกส่วนของสัตว์ที่ตั้งใจหรือได้รับการตัดสินว่าปลอดภัยและเหมาะสมสำหรับการบริโภคของมนุษย์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CXC 58-2005, Section 3 Definitions",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Meat All parts of an animal that are intended for, or have been judged as safe and suitable for, human consumption."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-hygiene-intro--ชนิดของ-muscle-fiber": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-hygiene-intro--ชนิดของ-muscle-fiber--v1",
          "statement": "muscle fiber ชนิด I (slow-twitch oxidative) มี myoglobin และเอนไซม์ oxidative metabolism สูง และเนื้อมีสีแดงมากขึ้นเมื่อมีสัดส่วนชนิดนี้มาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32593014",
              "locator": "Abstract (Meat Sci 2020;169:108160)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The slow-twitch oxidative fiber (MyHCI) is rich in myoglobin and mitochondrial oxidative metabolic enzymes, and the increased expression of MyHCI fiber in pork has resulted in higher redness value."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-hygiene-intro--muscle-protein-3-กลุ่ม": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-hygiene-intro--muscle-protein-3-กลุ่ม--v1",
          "statement": "Myoglobin เป็น sarcoplasmic protein ชนิด heme ที่ให้สีเนื้อเป็นหลัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23190143",
              "locator": "Abstract (Annu Rev Food Sci Technol 2013;4:79-99)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Myoglobin is the sarcoplasmic heme protein primarily responsible for the meat color"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-hygiene-intro--โปรตีน-และ-dipeptide-ที่ใช้จำแนกชนิดเนื้อ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-hygiene-intro--โปรตีน-และ-dipeptide-ที่ใช้จำแนกชนิดเนื้อ--v1",
          "statement": "สัดส่วนของ histidine dipeptide (anserine, carnosine, balenine) ในกล้ามเนื้อหมูต่างจากสัตว์ชนิดอื่น จึงใช้ประมาณสัดส่วนเนื้อหมูในเนื้อแปรรูปได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22056065",
              "locator": "Abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Because the ratio of these dipeptides in skeletal muscle of the pig is different from that in other species commonly used for meat, it is possible to estimate the proportion of pig meat in processed meats."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-hygiene-intro--lipid-และ-fatty-acid": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-hygiene-intro--lipid-และ-fatty-acid--v1",
          "statement": "องค์ประกอบกรดไขมันกำหนดความแข็งหรือความมันของเนื้อเยื่อไขมันและความคงตัวต่อการออกซิเดชันของกล้ามเนื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22062452",
              "locator": "Abstract, last paragraph",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Fatty acid composition determines the firmness/oiliness of adipose tissue and the oxidative stability of muscle, which in turn affects flavour and muscle colour."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-hygiene-intro--คาร์โบไฮเดรต-แร่ธาตุ-และวิตามิน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-hygiene-intro--คาร์โบไฮเดรต-แร่ธาตุ-และวิตามิน--v1",
          "statement": "เนื้อสัตว์เป็นแหล่งที่ดีของ iron, zinc, วิตามิน B12 และวิตามิน B complex อื่น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23273468",
              "locator": "Abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Meat is a valuable source of high biological value protein, iron, vitamin B12 as well as other B complex vitamins, zinc, selenium and phosphorus."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-hygiene-intro--meat-hygiene-นิยามและขอบเขตการควบคุม": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-hygiene-intro--meat-hygiene-นิยามและขอบเขตการควบคุม--v1",
          "statement": "Meat inspection และ meat hygiene ต้องทำให้เนื้อและผลิตภัณฑ์เนื้อปลอดภัยและ wholesome สำหรับการบริโภคของมนุษย์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-fao-a",
              "locator": "Chapter 1, HACCP Concept in Meat Inspection",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Meat Inspection and Meat Hygiene shall make sure that meat and meat products are safe and wholesome for human consumption."
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-seafood": {
    "milk-meat-hygiene--meat-seafood--water-และ-protein": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--water-และ-protein--v1",
          "statement": "โปรตีน structural (myofibrillar) คิดเป็น 70-80% ของโปรตีนในกล้ามเนื้อปลา สูงกว่าในสัตว์เลี้ยงลูกด้วยนมที่ 40% และ connective tissue protein มีเพียงประมาณ 3% ในปลากระดูกแข็ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-quality-and-quality-changes-in-fresh-fish-fao-fisheries",
              "locator": "Chapter 4, 4.3 Proteins",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Structural proteins (actin, myosin, tropormyosin and actomyosin), which constitute 70-80 % of the total protein content (compared with 40 % in mammals)...Connective tissue proteins (collagen), which constitute approximately 3 % of the -protein in teleostei"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--non-protein-nitrogen-compounds-npn": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--non-protein-nitrogen-compounds-npn--v1",
          "statement": "ส่วนประกอบหลักของ non-protein nitrogen ในปลา ได้แก่ ammonia, TMAO, creatine, free amino acid, nucleotide และ urea (ในปลากระดูกอ่อน)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-quality-and-quality-changes-in-fresh-fish-fao-fisheries",
              "locator": "Chapter 4, 4.1 Composition, non-protein nitrogen (NPN) fraction",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The major components in this fraction are: volatile bases such as ammonia and trimethylamine oxide (TMAO), creatine, free amino-acids, nucleotides and purine bases, and, in the case of cartilaginous fish, urea."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--lipid-และ-fatty-acids": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--lipid-และ-fatty-acids--v1",
          "statement": "ปลา pelagic เป็น fatty fish ที่เก็บไขมันในเนื้อเยื่อลำตัว ส่วนปลา demersal เป็น lean fish ที่เก็บไขมันเฉพาะที่ตับ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-quality-and-quality-changes-in-fresh-fish-fao-fisheries",
              "locator": "Chapter 3, 3.1 Classification of fish (table)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "pelagic fish fatty fish (store lipids in body tissue) herring, mackerel, sardine tuna, sprat demersal fish lean (white) fish (store lipids in liver only) cod, haddock, hake grouper, seabass"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--minor-components-และ-dark-muscle-กับ-white-muscle": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--minor-components-และ-dark-muscle-กับ-white-muscle--v1",
          "statement": "Dark muscle ของปลามี lipid และ myoglobin สูงกว่า light muscle และไขมันสูงนั้นทำให้เกิดปัญหากลิ่นหืน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-quality-and-quality-changes-in-fresh-fish-fao-fisheries",
              "locator": "Chapter 3, 3.2 Anatomy and physiology, muscle",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There are many differences in the chemical composition of the two muscle types, some of the more noteworthy being higher levels of lipids and myoglobin in the dark muscle. ... From a technological point of view, the high lipid content of dark muscle is important because of problems with rancidity."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--seafood-quality-freshness-และปัจจัยที่มีผลต่อคุณภาพปลา": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--seafood-quality-freshness-และปัจจัยที่มีผลต่อคุณภาพปลา--v1",
          "statement": "ช่วงวางไข่ ปลาสร้างต่อมเพศในช่วงที่กินอาหารน้อยหรือไม่กินเลย ทำให้สำรองโปรตีนและไขมันลดลง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-quality-and-quality-changes-in-fresh-fish-fao-fisheries",
              "locator": "Chapter 3, seasonal variations and the reproductive cycle",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This gonadal development causes a depletion of the protein and lipid reserves of the fish since it takes place during a period of low or no food intake"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--deterioration-spoilage-rigor-mortis-chemical-microbiological-และ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--deterioration-spoilage-rigor-mortis-chemical-microbiological-และ--v1",
          "statement": "หลังปลาตาย กล้ามเนื้อคลายตัวก่อน แล้วเข้าสู่ rigor mortis และ pH ลดลงจาก glycolysis โดยในปลา cod pH สุดท้ายอยู่ที่ 6.1-6.5",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-quality-and-quality-changes-in-fresh-fish-fao-fisheries",
              "locator": "Chapter 5, Rigor mortis; post mortem glycolysis and pH",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Immediately after death the muscle is totally relaxed and the limp elastic texture usually persists for some hours, whereafter the muscle will contract. ... In cod, the pH drops from 6.8 to an ultimate pH of 6.1-6.5."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--evaluation-of-fish-freshness-quality": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--evaluation-of-fish-freshness-quality--v1",
          "statement": "Quality Index Method (QIM) เป็นวิธีประเมินทางประสาทสัมผัสที่ให้คะแนนแบบ demerit ตามรายการ attribute แล้วรวมเป็น quality index",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39272609",
              "locator": "Introduction (PMC11395173)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The protocol QIM is a list of attributes scored in demerits, where the sum of such demerits produces the quality index (QI)."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--seafood-toxins-causes-of-seafood-intoxications": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--seafood-toxins-causes-of-seafood-intoxications--v1",
          "statement": "สาร phycotoxin ที่ทำให้เกิดอาหารทะเลเป็นพิษสร้างโดยสาหร่ายเซลล์เดียว และผ่านห่วงโซ่อาหารผ่านหอย กุ้งปู และปลา ไปสู่คน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-marine-biotoxins-fao-food-and-nutrition-paper-80-2004",
              "locator": "1. Introduction",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "there are micro-algal species (about 75) which have the capacity to produce potent toxins (called phycotoxins) that can find their way through levels of the food chain (e.g. molluscs, crustaceans and finfish) and are ultimately consumed by humans"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--shellfish-poisoning-asp-dsp-azp-psp-nsp": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--shellfish-poisoning-asp-dsp-azp-psp-nsp--v1",
          "statement": "NSP เกิดจากการกินหอยสองฝาที่ปนเปื้อน brevetoxin ซึ่งผลิตหลักโดย dinoflagellate Karenia brevis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19005578",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Neurotoxic shellfish poisoning (NSP) is caused by consumption of molluscan shellfish contaminated with brevetoxins primarily produced by the dinoflagellate, Karenia brevis."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--fish-poisoning-ciguatera-puffer-fish-scombroid": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--fish-poisoning-ciguatera-puffer-fish-scombroid--v1",
          "statement": "Histamine fish poisoning หรือ scombroid poisoning เป็นสาเหตุที่พบบ่อยที่สุดของพิษจากปลาทั่วโลก และอาการคล้ายปฏิกิริยาภูมิแพ้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25876709",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Histamine fish poisoning, also known as scombroid poisoning, is the most common cause of ichythyotoxicosis worldwide... The symptoms associated with histamine fish poisoning are similar to that of an allergic reaction."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-seafood--ตารางสรุป-seafood-intoxications": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-seafood--ตารางสรุป-seafood-intoxications--v1",
          "statement": "Scombroid poisoning เกิดจากการจัดการปลาไม่เหมาะสม: การแช่เย็นไม่เพียงพอหลังจับทำให้แบคทีเรียสร้าง histamine",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20152850",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Inadequate cooling following harvest promotes bacterial histamine production, and can result in outbreaks of scombroid poisoning."
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-microbiology": {
    "milk-meat-hygiene--meat-microbiology--เนื้อสัตว์ปนเปื้อนจากไหน-และเชื้อกลุ่มใดสำคัญ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--เนื้อสัตว์ปนเปื้อนจากไหน-และเชื้อกลุ่มใดสำคัญ--v1",
          "statement": "การถลกหนังและการนำเครื่องในออกเป็นจุดที่สิ่งสกปรกจากหนังและเนื้อหาในทางเดินอาหารอาจปนเปื้อนสู่เนื้อ จึงต้องทำโดยหลีกเลี่ยงการถ่ายโอนนี้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14968981",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "...performing skinning and eviscerating operations in manners that avoid the transfer of filth from the hide to the meat or the spillage of gut contents."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--ปัจจัยที่มีผลต่อการโตของเชื้อ-ระยะการโต-สารอาหาร-และออกซิเจน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--ปัจจัยที่มีผลต่อการโตของเชื้อ-ระยะการโต-สารอาหาร-และออกซิเจน--v1",
          "statement": "Lag phase คือช่วงที่แบคทีเรียที่เข้าสู่สภาพแวดล้อมใหม่ยังไม่แบ่งตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30642990",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Lag is a temporary period of nonreplication seen in bacteria that are introduced to new media."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--ปัจจัยที่มีผลต่อการโตของเชื้อ-อุณหภูมิ-water-activity-และ-ph": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--ปัจจัยที่มีผลต่อการโตของเชื้อ-อุณหภูมิ-water-activity-และ-ph--v1",
          "statement": "การโตของเชื้อก่อโรคในอาหารถูกจำกัดร่วมกันด้วยอุณหภูมิ water activity และ pH",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11055952",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "We modeled the effects of temperature, water activity, pH, and lactic acid levels on the growth of two strains of Listeria monocytogenes in tryptone soya yeast extract broth."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--จำนวนเชื้อกับสัญญาณของการเน่าเสีย": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--จำนวนเชื้อกับสัญญาณของการเน่าเสีย--v1",
          "statement": "การเสียของเนื้อดิบเกิดจากการโตของจุลินทรีย์ระหว่างเก็บ และชนิดกับจำนวนเชื้อขึ้นกับการปนเปื้อนตั้งต้นและสภาพการเก็บ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22682877",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The spoilage of raw meat is mainly due to undesired microbial development in meat during storage. The type of bacteria and their loads depend on the initial meat contamination and on the specific storage conditions"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--แบคทีเรียที่ทำให้เนื้อเสีย-ผิวกับส่วนลึก-และตัวหลักในเนื้อที่เก็": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--แบคทีเรียที่ทำให้เนื้อเสีย-ผิวกับส่วนลึก-และตัวหลักในเนื้อที่เก็--v1",
          "statement": "Pseudomonas บางชนิดเป็นแบคทีเรียที่ทำให้เนื้อสดเสียที่พบบ่อย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37026560",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Some Pseudomonas species are common meat spoilage bacteria that are often associated with the spoilage of fresh meat."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--แบคทีเรียที่ทำให้เนื้อเสีย-เนื้อบรรจุสูญญากาศ-และเชื้อไม่ใช้อากา": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--แบคทีเรียที่ทำให้เนื้อเสีย-เนื้อบรรจุสูญญากาศ-และเชื้อไม่ใช้อากา--v1",
          "statement": "เมื่อการโตของแบคทีเรียที่ทำให้เสียแบบใช้อากาศถูกยับยั้ง lactic acid bacteria อาจเป็นกลุ่มเด่นในเนื้อที่บรรจุในฟิล์มซึมผ่านก๊าซต่ำ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-6354082",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "When the growth of aerobic spoilage bacteria is inhibited, lactic acid bacteria may become the dominant component of the microbial flora of meats. This occurs with cured meats and with meats packaged in films of low gas permeability."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--เชื้อก่อโรคที่พบบนเนื้อ-แบคทีเรีย-ไวรัส-และปรสิต": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--เชื้อก่อโรคที่พบบนเนื้อ-แบคทีเรีย-ไวรัส-และปรสิต--v1",
          "statement": "การกินสัตว์ปีกที่ปรุงไม่สุกและ cross-contamination จากเนื้อดิบเป็นปัจจัยเสี่ยงหลักของ campylobacteriosis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10549422",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The consumption of undercooked poultry and cross-contamination of other foods with uncooked meat products are leading risk factors for human campylobacteriosis."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--ยีสต์และราบนเนื้อ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--ยีสต์และราบนเนื้อ--v1",
          "statement": "พบยีสต์ที่ทนอุณหภูมิต่ำในเนื้อวัวบรรจุสูญญากาศแช่เย็น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26678125",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Chilled vacuum-packed beef (n = 50) sampled from 15 different producers was found to have a mean psychrotolerant yeast count of 3.76 log cfu per cm(2)."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--เชื้อในเนื้อที่เพิ่งชำแหละ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--เชื้อในเนื้อที่เพิ่งชำแหละ--v1",
          "statement": "ในกระบวนการฆ่า เนื้อถูกปนเปื้อนซ้ำได้จากเครื่องจักร อุจจาระระหว่างนำเครื่องในออก และการสัมผัสของคน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23726208",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "recontamination with MRSA might occur via surface treating machinery, as a result of fecal contamination at evisceration, or via increased human handling"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--เชื้อในเนื้อแช่เย็นและเนื้อแช่แข็ง": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--เชื้อในเนื้อแช่เย็นและเนื้อแช่แข็ง--v1",
          "statement": "อุณหภูมิเก็บเป็นปัจจัยหนึ่งที่กำหนดความหลากหลายของแบคทีเรียที่โตในเนื้อดิบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22682877",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This review focuses on the composition of raw meat spoilage microbiota and the influence of storage conditions such as temperature, packaging atmosphere and use of different preservatives on the bacterial diversity developing in raw meat."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--เนื้อบรรจุ-สีของเนื้อ-บรรจุภัณฑ์แบบผู้บริโภค-และสูญญากาศ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--เนื้อบรรจุ-สีของเนื้อ-บรรจุภัณฑ์แบบผู้บริโภค-และสูญญากาศ--v1",
          "statement": "การสัมผัสออกซิเจนทำให้เกิด oxymyoglobin ซึ่งทำให้เนื้อสีแดงสว่างขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31927436",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Blooming is critical to surface colour in addition to pigment and achromatic factors and causes meat to become lighter (higher L*) and redder (higher a*) due to the formation of oxymyoglobin (OMb)."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--เนื้อ-dfd-ที่บรรจุสูญญากาศ-และสรุปเชื้อใน-3-สภาพของเนื้อ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--เนื้อ-dfd-ที่บรรจุสูญญากาศ-และสรุปเชื้อใน-3-สภาพของเนื้อ--v1",
          "statement": "เนื้อสุกร DFD บรรจุสูญญากาศมีจำนวนเชื้อสูงกว่าเนื้อกลุ่มอื่นเมื่อเก็บ 35 วัน เพราะ ultimate pH สูงกว่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20374811",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "after 35 d of storage, total aerobic mesophilic and presumptive lactic acid bacteria counts were higher (P<0.05) in DFD pork due to its higher ultimate pH."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--แหล่งปนเปื้อนและการควบคุมเชื้อบนเนื้อ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--แหล่งปนเปื้อนและการควบคุมเชื้อบนเนื้อ--v1",
          "statement": "การพ่นกรดอินทรีย์ เช่น lactic acid ลดเชื้อก่อโรคบนผิวซากได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11198442",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Organic acids have been shown to be effective in reducing the presence of pathogenic bacteria on hot beef carcass surfaces"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--การตรวจทางจุลชีววิทยาของเนื้อและซาก-และ-indicator-organism": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--การตรวจทางจุลชีววิทยาของเนื้อและซาก-และ-indicator-organism--v1",
          "statement": "การประเมินสุขลักษณะซากใช้การ swab แล้วนับ total viable count, coliform และ Enterobacteriaceae",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15109799",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "For each sample, total viable counts (TVC), Escherichia coli, total coliforms and Enterobacteriaceae were enumerated."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--มาตรฐานจุลชีววิทยา-เนื้อแช่เย็นและแช่แข็ง-dld-และ-dmsc": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--มาตรฐานจุลชีววิทยา-เนื้อแช่เย็นและแช่แข็ง-dld-และ-dmsc--v1",
          "statement": "กรมปศุสัตว์กำหนดเกณฑ์ Aerobic plate count ของเนื้อสัตว์ไว้ที่ไม่เกิน 5 × 10⁵ CFU/g",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-analysis-of-prevalence-of-total-microorganisms-in-raw-ch",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "DLD set criteria for APC at 5 x 105 CFU / g."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-microbiology--มาตรฐานจุลชีววิทยา-เนื้อปรุงสุก-dld-เทียบกับเนื้อดิบ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-microbiology--มาตรฐานจุลชีววิทยา-เนื้อปรุงสุก-dld-เทียบกับเนื้อดิบ--v1",
          "statement": "เกณฑ์ Aerobic plate count ของเนื้อดิบตามกรมปศุสัตว์คือไม่เกิน 5 × 10⁵ CFU/g",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-analysis-of-prevalence-of-total-microorganisms-in-raw-ch",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "DLD set criteria for APC at 5 x 105 CFU / g."
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-storage": {
    "milk-meat-hygiene--meat-storage--เกณฑ์ของวิธีเก็บรักษาเนื้อสัตว์": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--เกณฑ์ของวิธีเก็บรักษาเนื้อสัตว์--v1",
          "statement": "ถ้าไม่มีการควบคุมอุณหภูมิและสภาพแวดล้อมที่เหมาะสม เนื้อสัตว์เสี่ยงต่อการอยู่รอดและเพิ่มจำนวนของเชื้อก่อโรคและจุลินทรีย์ที่ทำให้เน่าเสีย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 8.7 Temperature control, para 81",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In the absence of suitable temperature, humidity and other environmental controls, meat is particularly vulnerable to survival and growth of pathogens and spoilage micro-organisms."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--ปัจจัยภายนอก-extrinsic-factor-อุณหภูมิและความชื้นสัมพัทธ์": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--ปัจจัยภายนอก-extrinsic-factor-อุณหภูมิและความชื้นสัมพัทธ์--v1",
          "statement": "จุลินทรีย์ที่ทำให้เนื้อเสียโตที่อุณหภูมิต่างกัน บางชนิดเพิ่มจำนวนได้ราว 10 °C และบางชนิดที่อุณหภูมิสูงกว่า เช่น 30 °C",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Meat processing hygiene, Meat spoilage through micro-organisms",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Some may multiply already at temperatures at around 10°C, others at higher temperatures, for example 30°C."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--ปัจจัยภายนอก-ออกซิเจน-คาร์บอนไดออกไซด์-จุลินทรีย์รบกวนกัน-และสภา": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--ปัจจัยภายนอก-ออกซิเจน-คาร์บอนไดออกไซด์-จุลินทรีย์รบกวนกัน-และสภา--v1",
          "statement": "ปัจจัยหลักของการถนอมอาหาร ได้แก่ อุณหภูมิ, pH, aw, Eh (ศักย์รีดอกซ์ ซึ่งเกี่ยวกับออกซิเจน) และ competitive flora (จุลินทรีย์ที่แข่งกัน) และทั้งหมดมีผลต่อกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10791741",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the principles of major preservative factors for foods (e.g., temperature, pH, a(w), Eh, competitive flora), and their interactions"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--ปัจจัยภายใน-ph": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--ปัจจัยภายใน-ph--v1",
          "statement": "ยิ่ง pH ของเนื้อต่ำ สภาพก็ยิ่งไม่เอื้อต่อการโตของแบคทีเรียที่เป็นอันตราย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Meat, fat and other edible carcass parts, Changes of pH",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The lower the pH, the less favourable conditions for the growth of harmful bacteria."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--ปัจจัยภายใน-water-activity-aw": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--ปัจจัยภายใน-water-activity-aw--v1",
          "statement": "แบคทีเรียไม่โตเมื่อ water activity ต่ำกว่า 0.91",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Principles of meat processing technology, Curing, salt",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Bacteria do not grow at a water activity below 0.91"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--ปัจจัยภายใน-สารอาหารและสารต้านจุลินทรีย์ในเนื้อ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--ปัจจัยภายใน-สารอาหารและสารต้านจุลินทรีย์ในเนื้อ--v1",
          "statement": "Nisin เป็น bacteriocin ที่ได้จากแบคทีเรียและยับยั้งการโตของแบคทีเรีย (แต่โดยทั่วไปไม่อนุญาตให้ใช้ในอุตสาหกรรมเนื้อ)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Meat processing technology, Preservatives (antibiotics)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "nisin (= bacteriocin deriving from Strept. lactis bacteria), suppresses bacterial growth"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--หลักการถนอมเนื้อสัตว์-6-วิธี-และการแช่เย็น": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--หลักการถนอมเนื้อสัตว์-6-วิธี-และการแช่เย็น--v1",
          "statement": "เนื้อที่ผ่านการตรวจแล้วต้องลดอุณหภูมิและ/หรือ water activity ให้เร็วที่สุดเท่าที่ทำได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 9.7, para 146",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "held under conditions that reduce its temperature and/or water activity as quickly as possible, unless cut up or de-boned pre-rigor"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--การแช่แข็ง-freezing": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--การแช่แข็ง-freezing--v1",
          "statement": "ไส้กรอกสดที่แช่แข็งลึกที่ -18 °C เก็บได้นานถึง 3 เดือน ขณะที่แช่เย็นเก็บได้ราว 3 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Fresh processed meat products, Storage and preparation for consumption",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Their maximum storage life is normally three days at +4°C or below. If the product is deep-frozen at -18°C, the storage life can be extended up to three months."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--การปรุงสุก-cooking-pasteurization-และ-sterilization": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--การปรุงสุก-cooking-pasteurization-และ-sterilization--v1",
          "statement": "การปรุงด้วยความร้อนต่ำกว่า 100 °C (ส่วนมาก 60-85 °C) เรียก pasteurization ส่วนที่สูงกว่า 100 °C เรียก sterilization",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Principles of meat processing technology, Heat treatment",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Heat treatment at temperatures below 100°C, mostly in the temperature range of 60 to 85°C, also called \"pasteurization\" or simply \"cooking\". ... Heat treatment at temperatures of above 100°C, also called \"sterilization\"."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--การทำให้แห้ง-dehydration-และการฉายรังสี-irradiation": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--การทำให้แห้ง-dehydration-และการฉายรังสี-irradiation--v1",
          "statement": "การฉายรังสี (gamma, x-ray หรือ electron) ใช้ลดหรือกำจัดการปนเปื้อนของจุลินทรีย์ในอาหารในบางประเทศที่กฎหมายอนุญาต",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Glossary, Irradiation",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "irradiation by ionizing high energy gamma rays, x-rays, or in some cases by high energy of electron sources, is used in some countries (where such treatments are legal) for reducing or eliminating microbial contamination in food"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--สารเคมีถนอมเนื้อ-เกลือ-ไนไตรท์-แลคเตท": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--สารเคมีถนอมเนื้อ-เกลือ-ไนไตรท์-แลคเตท--v1",
          "statement": "เกลือลด water activity ของเนื้อ ทำให้น้ำเหลือน้อยและสภาพไม่เอื้อต่อการโตของจุลินทรีย์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Principles of meat processing technology, Curing, salt",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The water loosely bound to the protein molecules as well as \"free\" water will be attracted by the sodium and chloride ions causing a reduction of the water activity (aw)"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--สีของเนื้อ-cured-และเนื้อแปรรูป": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--สีของเนื้อ-cured-และเนื้อแปรรูป--v1",
          "statement": "โซเดียมไนไตรท์ทำปฏิกิริยากับเม็ดสีแดงของเนื้อ ได้สีแดงของเนื้อ cured ที่ทนความร้อน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Principles of meat processing technology, Curing",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Sodium nitrite has the ability to react with the red meat pigment to form the heat stable red curing colour"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--การบรรจุหีบห่อ-packaging-เหตุผลและคุณสมบัติของวัสดุ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--การบรรจุหีบห่อ-packaging-เหตุผลและคุณสมบัติของวัสดุ--v1",
          "statement": "วัสดุบรรจุเนื้อต้องเหมาะสมกับการใช้ และเก็บและใช้อย่างถูกสุขลักษณะ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 9.7, packaging provisions",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Where meat is packaged or wrapped: ... packaging material should be suitable for use, stored and used in a hygienic manner"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-storage--สูญญากาศ-map-cap-และวัสดุบรรจุ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-storage--สูญญากาศ-map-cap-และวัสดุบรรจุ--v1",
          "statement": "การบรรจุสูญญากาศที่เติมก๊าซป้องกัน (ส่วนผสมมักเป็น CO2 และ N2) ยับยั้งการโตของแบคทีเรียและรักษาสีเนื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Mixer/blender, Vacuum packaging machine",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Such protective gas atmospheres inside the product package inhibit bacterial growth and stabilize the meat colour."
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-quality": {
    "milk-meat-hygiene--meat-quality--เนื้อสดและคุณภาพเนื้อสัตว์": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-quality--เนื้อสดและคุณภาพเนื้อสัตว์--v1",
          "statement": "เนื้อสด (fresh meat) คือเนื้อที่นอกจากแช่เย็นแล้วไม่ผ่านการแปรรูปเพื่อถนอม นอกจากการบรรจุป้องกัน และยังมีลักษณะธรรมชาติ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 3, Definitions: Fresh meat",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Meat that apart from refrigeration has not been treated for the purpose of preservation other than through protective packaging and which retains its natural characteristics."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-quality--postmortem-changes-และปัจจัยที่มีผล": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-quality--postmortem-changes-และปัจจัยที่มีผล--v1",
          "statement": "หลังฆ่า glycogen ในกล้ามเนื้อส่วนใหญ่ถูกสลายเป็นกรดแลคติกใน 12 ชั่วโมงแรก ทำให้ pH ลดลง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Meat, fat and other edible carcass parts, Changes of pH",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "most of which is broken down to lactic acid in the muscle meat in the first hours (up to 12 hours) after slaughtering."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-quality--คุณภาพเฉพาะของเนื้อวัวและเนื้อหมู-pse-dfd-halothane-gene-rn-gene": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-quality--คุณภาพเฉพาะของเนื้อวัวและเนื้อหมู-pse-dfd-halothane-gene-rn-gene--v1",
          "statement": "PSE ดูซีด นิ่ม และผิวเปียก พบบ่อยในสุกร ส่วน DFD เกิดเมื่อ pH ไม่ลดต่ำกว่า 6.0 ได้เนื้อสีเข้ม แข็ง แห้ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Meat, fat and other edible carcass parts, PSE and DFD",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "It can be recognized in the meat as a pale colour, a soft, almost mushy texture and a very wet surface (pale, soft, exudative = PSE meat). ... The muscle pH24 does not fall below pH 6.0. This produces dark, firm, dry (DFD) meat."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-quality--wholesomeness-อนามัยเนื้อสัตว์-และ-hazards-to-consumers": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-quality--wholesomeness-อนามัยเนื้อสัตว์-และ-hazards-to-consumers--v1",
          "statement": "Hazard คือ biological, chemical หรือ physical agent หรือสภาพของอาหารที่อาจก่อผลเสียต่อสุขภาพ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 3, Definitions: Hazard",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A biological, chemical or physical agent in, or condition of, food with the potential to cause an adverse health effect."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-quality--conditions-that-support-bacterial-growth-fat-tom-และอุณหภูมิ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-quality--conditions-that-support-bacterial-growth-fat-tom-และอุณหภูมิ--v1",
          "statement": "แบคทีเรียส่วนใหญ่โตดีที่สุดที่ 30-37 °C",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meat-processing-technology-for-small-to-medium-scale-pro",
              "locator": "Meat processing hygiene, Meat spoilage through micro-organisms",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Most bacteria can optimally grow in the range between 30°C and 37°C"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-quality--wholesomeness-ด้านประโยชน์ต่อสุขภาพ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-quality--wholesomeness-ด้านประโยชน์ต่อสุขภาพ--v1",
          "statement": "ในเนื้อสัตว์มีการประเมินความสมดุลของกรดไขมันด้วยอัตราส่วน polyunsaturated ต่อ saturated (P:S) และอัตราส่วน n-6:n-3",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9292774",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "pork and poultry have a favourable balance between polyunsaturated and saturated fatty acids (P:S) and grazing ruminants produce muscle with a desirable n-6:n-3 polyunsaturated fatty acid ratio"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-quality--prevention-control-of-hazards-in-food-chain-และ-safe-handling": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-quality--prevention-control-of-hazards-in-food-chain-และ-safe-handling--v1",
          "statement": "ควรแยกเนื้อดิบออกจากอาหารอื่น และนำเนื้อสัตว์เข้าตู้เย็นหรือแช่แข็งภายใน 2 ชั่วโมงหลังซื้อหรือปรุง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-safe-food-handling-2024",
              "locator": "Separate; Chill",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Separate raw meat, poultry, seafood, and eggs from other foods in your grocery shopping cart, grocery bags, and refrigerator. ... Refrigerate or freeze meat, poultry, eggs, seafood, and other perishables within 2 hours of cooking or purchasing."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-quality--wholesomeness-in-the-us-และ-triangle-of-needs": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-quality--wholesomeness-in-the-us-และ-triangle-of-needs--v1",
          "statement": "กฎหมายสหรัฐฯ กำหนดให้เจ้าหน้าที่ตรวจสัตว์ก่อนเข้าโรงฆ่าเพื่อป้องกันเนื้อที่ไม่ปลอดภัยออกสู่ตลาด (Federal Meat Inspection Act)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-21-u-s-code-603-examination-of-animals-prior-to-slaughte",
              "locator": "21 U.S.C. 603(a)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the Secretary shall cause to be made, by inspectors appointed for that purpose, an examination and inspection of all amenable species before they shall be allowed to enter into any slaughtering, packing, meat-canning, rendering, or similar establishment"
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-molecular": {
    "milk-meat-hygiene--meat-molecular--molecular-biology-genomic-techniques-และการปรับปรุงคุณภาพเนื้อ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-molecular--molecular-biology-genomic-techniques-และการปรับปรุงคุณภาพเนื้อ--v1",
          "statement": "Genomics ใช้ genome mapping และการระบุ quantitative trait loci ในการหาตัวทำนายคุณภาพเนื้อ เช่น ความนุ่ม และใช้ปรับปรุงการคัดเลือกสัตว์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22063926",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Genome mapping, comparative genomics and identification of quantitative trait loci and polymorphisms are the subject of active investigation to gain a better knowledge of the structure and function of genes."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-molecular--candidate-gene-approach-genome-scan-approach-และ-fine-mapping": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-molecular--candidate-gene-approach-genome-scan-approach-และ-fine-mapping--v1",
          "statement": "การทำ microarray เปรียบเทียบกล้ามเนื้อโคที่นุ่มกับเหนียว ระบุยีนที่แสดงออกต่างกัน (differentially expressed genes) ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21901422",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Microarray and RT-PCR analyses identified 53 genes that were differentially expressed in LD samples categorized as either tough or tender"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-molecular--important-genes-affecting-meat-quality-in-farm-animals": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-molecular--important-genes-affecting-meat-quality-in-farm-animals--v1",
          "statement": "ยีน calpain (micro-calpain) มีบทบาทหลักต่อการย่อยสลายโปรตีนกล้ามเนื้อหลังตาย (postmortem proteolysis) ซึ่งสัมพันธ์กับความนุ่มของเนื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16971586",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "micro-calpain is largely responsible for postmortem proteolysis."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-molecular--halal-authentication-of-raw-meat-และ-halal-meat-supply-chain": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-molecular--halal-authentication-of-raw-meat-และ-halal-meat-supply-chain--v1",
          "statement": "สุกรเป็นเนื้อที่ศาสนาอิสลามห้ามบริโภค และผู้ผลิตบางรายใช้เนื้อหรือไขมันสุกรโดยไม่ระบุบนฉลาก ซึ่งเป็น adulteration ที่ตรวจด้วยตาเปล่าไม่ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40477685",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Some food items like pork or dog meat are banned to be consumed by the followers of the mentioned religions. However, illegally, some food producers in various countries use either the meat or the fat of the banned animals during food production without being mentioned in the label"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-molecular--pork-detection-techniques-pcr-elisa-immunochromatographic-assays": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-molecular--pork-detection-techniques-pcr-elisa-immunochromatographic-assays--v1",
          "statement": "ชุดตรวจแบบ lateral flow (immunochromatographic) ตรวจสุกรได้เร็ว ง่าย ต้นทุนต่ำ แต่ใช้เป็นการทดสอบยืนยันขั้นสุดท้ายได้ยาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37535014",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Despite the benefits of rapidity, simplicity, low cost, high sensitivity, and specificity, researchers face challenges when using LFD as a final confirmation test."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-molecular--สรุป-analytical-techniques-ใน-halal-authentication": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-molecular--สรุป-analytical-techniques-ใน-halal-authentication--v1",
          "statement": "เทคนิคตรวจการปลอมปนเนื้อสัตว์ที่ใช้กันหลักๆ อาศัย DNA (PCR) และโปรตีน (chromatography) ส่วน FTIR spectroscopy เป็นวิธีที่ง่ายกว่าและใช้ตรวจเนื้อและผลิตภัณฑ์เนื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31453165",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Some instrumental techniques have been applied for the detection of meat adulteration, mainly relied on DNA and protein using polymerase chain reaction and chromatographic methods, respectively."
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-slaughter": {
    "milk-meat-hygiene--meat-slaughter--พฤติกรรมสัตว์และการต้อน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--พฤติกรรมสัตว์และการต้อน--v1",
          "statement": "สิ่งรบกวนที่ทำให้สัตว์ในโรงฆ่าไม่เดิน ได้แก่ เสียงแหลมสูง เสียงลมรั่ว และลมพัดตามทางเดินเข้าหาสัตว์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8756875",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "distractions that impede animal movement, such as sparkling reflections on a wet floor, air hissing, high-pitched noise, or air drafts blowing down the chute toward approaching animals"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--พื้นที่ต่อตัวและการขนส่งสัตว์": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--พื้นที่ต่อตัวและการขนส่งสัตว์--v1",
          "statement": "สุกรที่ขนส่งต้องมีพื้นที่พอให้นอนลงได้ระหว่างเดินทาง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9602513",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Current UK legislation and EU Directive 95/29/EC specify that, in general, pigs must have sufficient space to lie down during transit."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--วิธีทำให้สลบ-stunning-และการทำให้สลบด้วยกลไก": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--วิธีทำให้สลบ-stunning-และการทำให้สลบด้วยกลไก--v1",
          "statement": "ในโค captive bolt แบบ penetrating ทำให้สลบสนิททุกตัว ส่วนแบบ non-penetrating ได้ผลน้อยกว่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30685511",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The study showed that pneumatic PCB stunning was effective in rendering all bulls unconscious, while NPCB was less effective."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การทำให้สลบด้วยไฟฟ้าโดยตรง-direct-electrical-stunning": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การทำให้สลบด้วยไฟฟ้าโดยตรง-direct-electrical-stunning--v1",
          "statement": "Head-only electrical stunning ในสุกรเป็นกระบวนการที่ฟื้นกลับได้ และได้ผลเต็มที่ประมาณ 15 วินาทีหลังสิ้นสุดการช็อต จึงต้องปล่อยเลือดให้ทัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21183712",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Head-only electrical stunning is a reversible procedure that is optimally effective for approximately 15 s after stun completion."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การทำให้สลบด้วย-water-bath-สัตว์ปีก": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การทำให้สลบด้วย-water-bath-สัตว์ปีก--v1",
          "statement": "ประสิทธิภาพของการทำให้สัตว์ปีกสลบด้วย water bath ขึ้นกับ voltage ความถี่ และกระแสไฟที่ผ่านตัวสัตว์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20181854",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This study addressed requirements for stunner settings (i.e., voltage, wave oscillation frequency) and response parameters (i.e., applied current, behavior) affecting effective water bath stunning."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การทำให้สลบด้วยแก๊ส-gas-stunning": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การทำให้สลบด้วยแก๊ส-gas-stunning--v1",
          "statement": "สุกรที่โรงฆ่าเชิงพาณิชย์ทำให้สลบด้วย CO2 ความเข้มข้น 90% และมีการศึกษาแก๊สผสม N2 กับ CO2 เป็นทางเลือก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22436284",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "compare them with the commercial stunning of 90% CO2 (90C)"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าสัตว์-และสิ่งที่กำหนดการออกแบบ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าสัตว์-และสิ่งที่กำหนดการออกแบบ--v1",
          "statement": "สถานที่ที่ใช้ฆ่าสัตว์ (abattoir) คือ establishment ที่ฆ่าและตัดแต่งสัตว์เพื่อเป็นอาหารของคน และต้องได้รับการอนุมัติ ขึ้นทะเบียน หรือขึ้นบัญชีโดยหน่วยงานผู้มีอำนาจ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 3 Definitions, Abattoir",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Any establishment where specified animals are slaughtered and dressed for human consumption and that is approved, registered and/or listed by the competent authority for such purposes."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--ที่ตั้งและสาธารณูปโภค": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--ที่ตั้งและสาธารณูปโภค--v1",
          "statement": "โรงฆ่าต้องมีที่ตั้ง การออกแบบ และการก่อสร้างที่ลดการปนเปื้อนของเนื้อให้น้อยที่สุด และน้ำต้องเป็นน้ำสะอาดดื่มได้เว้นแต่ใช้น้ำมาตรฐานอื่นได้โดยไม่ปนเปื้อนเนื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 8.1 Principles, i and vi",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Establishments should be located, designed and constructed so that contamination of meat is minimised to the greatest extent practicable. ... Water should be potable except where water of a different standard can be used without leading to contamination of meat."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การออกแบบโรงและสุขลักษณะ-โซนสะอาดกับโซนสกปรก": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การออกแบบโรงและสุขลักษณะ-โซนสะอาดกับโซนสกปรก--v1",
          "statement": "สายการฆ่าต้องออกแบบให้ซากเคลื่อนไปข้างหน้าต่อเนื่องในแบบที่ไม่ทำให้เกิดการปนเปื้อนข้าม และบริเวณทำให้สลบกับปล่อยเลือดแยกจากบริเวณตัดแต่งซาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 8.3 Design and construction of slaughter areas, paras 64 and 66",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Stunning and bleeding areas should be separated from dressing areas ... Where slaughter is carried out the processing line should be designed so that there is constant progress of animals in a manner that does not cause cross-contamination."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--คอกพักสัตว์-lairage-และทางเดิน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--คอกพักสัตว์-lairage-และทางเดิน--v1",
          "statement": "คอกพักสัตว์ (lairage) ต้องมีพื้นปูหรือเป็นแบบ slatted ที่ระบายน้ำดี และออกแบบให้ตรวจสัตว์ก่อนฆ่า (ante-mortem inspection) ได้สะดวก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 8.2 Design and construction of lairages, para 62",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "floors are paved or slatted and allow good drainage; ... ante-mortem inspection is facilitated"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การปล่อยเลือด-bleeding": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การปล่อยเลือด-bleeding--v1",
          "statement": "การปล่อยเลือดควรให้สมบูรณ์ที่สุดเท่าที่ทำได้ และเลือดที่ใช้เป็นอาหารต้องเก็บและจัดการอย่างถูกสุขลักษณะ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 9 slaughter and dressing, para 122",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "bleeding should be as complete as possible; if blood is intended for food, it should be collected and handled in a hygienic manner"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การลวกและถอนขน-scalding-picking-dehairing": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การลวกและถอนขน-scalding-picking-dehairing--v1",
          "statement": "สัตว์ปีกลวกแบบ soft scald ที่ 50 °C (220 วินาที) และ hard scald ที่ 57.7 °C (120 วินาที) ในงานวิจัยการลดอุณหภูมิซากไก่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21325244",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "One-third of the birds were hard scalded (57.7°C, 120 s) and subjected to WC (an ice slurry immersion at 0°C). The remaining birds were soft scalded (50°C, 220 s)"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การควักเครื่องใน-evisceration": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การควักเครื่องใน-evisceration--v1",
          "statement": "ในการควักเครื่องใน ไม่ให้ตัดลำไส้ออกจากกระเพาะหรือเปิดลำไส้ เว้นแต่มัดลำไส้ไว้ก่อนเพื่อกันการหก ยกเว้นสัตว์ปีก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, para. 125 (dressing)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "intestines should not be severed from the stomach during evisceration and no other opening should be made into an intestine, unless the intestines are first effectively tied to prevent spillage, except in the case of poultry and game birds"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การลดอุณหภูมิซาก-chilling-immersion-กับ-air-chilling": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การลดอุณหภูมิซาก-chilling-immersion-กับ-air-chilling--v1",
          "statement": "การลดอุณหภูมิซากไก่ในสหรัฐใช้แบบแช่น้ำ (water immersion chilling) เป็นหลัก ส่วนตลาดอื่นทั่วโลกใช้ air chilling เป็นหลัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33653941",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This step is accomplished most commonly by water immersion chilling in the United States, while air chilling methods dominate other global markets."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--แผนผังโรงฆ่าสุกร-ลำดับขั้นและโซน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--แผนผังโรงฆ่าสุกร-ลำดับขั้นและโซน--v1",
          "statement": "ส่วนทำให้สลบและปล่อยเลือด รวมทั้งส่วนลวกและขูดขน ควรแยกจากส่วนตกแต่งซาก เพื่อลดการปนเปื้อนข้าม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, section 8.3, paras. 64-65",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Stunning and bleeding areas should be separated from dressing areas (either physically or by distance), so that cross-contamination of animals is minimised. ... Areas for scalding, dehairing, defeathering, scraping and singeing (or similar operations) should also be appropriately separated from dressing areas."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าสุกร-รับสุกรและทำให้สลบ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าสุกร-รับสุกรและทำให้สลบ--v1",
          "statement": "การพักสุกรในคอกพักก่อนฆ่าช่วยให้สุกรฟื้นจากความเครียดจากการขนส่ง และเวลาพักที่เหมาะสมกับคุณภาพเนื้อสำหรับสุกรส่วนใหญ่คือ 1-3 ชั่วโมง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12934728",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Keeping pigs in lairage provides a buffer to supply the slaughter line and allows the pigs to recover from the stress of transport. ... In terms of pork quality, optimal lairage times for most pigs in the UK are probably one to three hours."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าสุกร-แทงคอ-ลวก-และขูดขน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าสุกร-แทงคอ-ลวก-และขูดขน--v1",
          "statement": "น้ำลวกสุกรควรอุณหภูมิสูงพอ (62 °C) เพื่อลดการปนเปื้อนซาก โดยเฉพาะ Salmonella ถ้าน้ำลวกปนเปื้อน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14959787",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "To reduce carcass contamination, it is recommended to ensure sufficiently high temperatures of scalding water (62 degrees C) and appropriate cleaning and disinfection of the polishing equipment at least once a day"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าสุกร-ตัดหัว-ควักเครื่องใน-ผ่าซีก-และลดอุณหภูมิ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าสุกร-ตัดหัว-ควักเครื่องใน-ผ่าซีก-และลดอุณหภูมิ--v1",
          "statement": "ส่วนของสัตว์ที่นำออกก่อนการตรวจซากหลังฆ่า เช่น หัวและเครื่องใน ต้องระบุได้ว่าเป็นของซากเดียวกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, para. 128",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Parts of slaughtered animals that have been removed before post-mortem inspection is performed should remain identifiable, as belonging to a single carcass (or a group of carcasses) when required for post-mortem judgement."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--การบรรจุ-จัดเก็บ-และขนส่งซาก-เนื้อ-และผลผลิต-ใช้เหมือนกันทั้งสาม": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--การบรรจุ-จัดเก็บ-และขนส่งซาก-เนื้อ-และผลผลิต-ใช้เหมือนกันทั้งสาม--v1",
          "statement": "พื้นที่จัดส่งเนื้อต้องป้องกันการปนเปื้อนจากสิ่งแวดล้อมและการเปลี่ยนแปลงอุณหภูมิที่ไม่พึงประสงค์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, section 8.4, para. 72",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Establishments should have an appropriate area, sufficiently protected from environmental contamination and capable of preventing adverse temperature variations, for dispatching meat."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--แผนผังโรงฆ่าสัตว์ปีก-ลำดับขั้นและโซน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--แผนผังโรงฆ่าสัตว์ปีก-ลำดับขั้นและโซน--v1",
          "statement": "สายการผลิตของโรงฆ่าควรออกแบบให้สัตว์เคลื่อนไปข้างหน้าอย่างต่อเนื่องโดยไม่ก่อการปนเปื้อนข้าม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, section 8.3, para. 66",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Where slaughter is carried out the processing line should be designed so that there is constant progress of animals in a manner that does not cause cross-contamination."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าสัตว์ปีก-รับสัตว์-ทำให้สลบ-และเชือดคอ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าสัตว์ปีก-รับสัตว์-ทำให้สลบ-และเชือดคอ--v1",
          "statement": "สัตว์ปีกถูกทำให้สลบอย่างได้ผลด้วยกระแสไฟฟ้าเฉลี่ย 111 mA นาน 1 วินาที เมื่อจุ่มหัวในอ่างน้ำที่เป็นขั้วไฟฟ้าขั้วหนึ่ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18809881",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "broilers were effectively stunned with an average current of 111 mA (50 V, 640 Hz, sinusoidal alternating current) for 1 s when using a water bath in which the head of the broiler was immersed in water"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าสัตว์ปีก-ลวก-ถอนขน-แยกหัว-และตัดแข้ง": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าสัตว์ปีก-ลวก-ถอนขน-แยกหัว-และตัดแข้ง--v1",
          "statement": "สัตว์ที่ผ่านการลวกหรือเผาต้องขูดหรือถอนขน ขนอ่อน และสิ่งสกปรกออกให้หมด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, para. 122",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "slaughtered animals that are scalded, flamed or similarly treated should be scoured of all bristles, hair, scurf, feathers, cuticles and dirt"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าสัตว์ปีก-แยกเครื่องใน-ล้าง-ลดอุณหภูมิ-และตัดแต่ง": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าสัตว์ปีก-แยกเครื่องใน-ล้าง-ลดอุณหภูมิ-และตัดแต่ง--v1",
          "statement": "ซากสัตว์ปีกหลังถอนขนทำความสะอาดจากฝุ่น ขน และสิ่งปนเปื้อนได้อย่างมีประสิทธิภาพด้วยน้ำสะอาดเท่านั้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, para. 123",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Poultry and farmed game birds, following de-feathering, can only be effectively cleaned of dust, feathers and other contaminants by the application of potable water."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--แผนผังโรงฆ่าโค-กระบือ-ลำดับขั้นและโซน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--แผนผังโรงฆ่าโค-กระบือ-ลำดับขั้นและโซน--v1",
          "statement": "สมองและไขสันหลังของโคเป็น specified risk material (SRM) ที่ต้องกันออกจากห่วงโซ่อาหารมนุษย์เพราะ BSE",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22063762",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In the absence of reliable live animal tests for the presence of BSE in cattle, a number of measures have been applied to exclude specified risk materials (SRM) from the human food chain."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าโค-กระบือ-รับสัตว์-ทำให้สลบ-และปล่อยเลือด": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าโค-กระบือ-รับสัตว์-ทำให้สลบ-และปล่อยเลือด--v1",
          "statement": "การปล่อยเลือดควรให้ออกให้มากที่สุดเท่าที่ทำได้ และเลือดที่จะใช้เป็นอาหารต้องเก็บอย่างถูกสุขลักษณะ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, para. 122",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "bleeding should be as complete as possible; if blood is intended for food, it should be collected and handled in a hygienic manner"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าโค-กระบือ-แยกหัว-ตัดหาง-ข้อขา-และเอาหนังออก": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าโค-กระบือ-แยกหัว-ตัดหาง-ข้อขา-และเอาหนังออก--v1",
          "statement": "เมื่อเริ่มเลาะหนังแล้ว ซากต้องแยกจากกันไม่ให้สัมผัสกันจนกว่าจะตรวจและตัดสินซากหลังฆ่าเสร็จ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, para. 125",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Once the removal of the hide/fleece has commenced, or dehairing has occurred, animal bodies should be separated from each other to avoid contact, and this should be maintained until each carcass has been inspected and judged by a competent person undertaking post-mortem inspection."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-slaughter--โรงฆ่าโค-กระบือ-เครื่องใน-ผ่าซีก-ลดอุณหภูมิ-และตัดแต่ง": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-slaughter--โรงฆ่าโค-กระบือ-เครื่องใน-ผ่าซีก-ลดอุณหภูมิ-และตัดแต่ง--v1",
          "statement": "โรงฆ่าต้องมีห้องที่ออกแบบและหุ้มฉนวนเหมาะสมสำหรับการลดอุณหภูมิ แช่เย็น และแช่แข็งเนื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "CAC/RCP 58-2005, section 8.4, para. 69",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Appropriately designed and insulated rooms should be available as necessary for cooling, chilling and freezing of meat."
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-ante-post-mortem": {
    "milk-meat-hygiene--meat-ante-post-mortem--วัตถุประสงค์และหลักทั่วไปของ-meat-inspection": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--วัตถุประสงค์และหลักทั่วไปของ-meat-inspection--v1",
          "statement": "วัตถุประสงค์ของ meat inspection มีสองข้อ คือให้ฆ่าเฉพาะสัตว์ที่ดูแข็งแรงปกติ และให้เนื้อปลอดโรคและไม่เสี่ยงต่อสุขภาพมนุษย์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-fao-a",
              "locator": "Chapter 1, Meat inspection procedures",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "To ensure that only apparently healthy, physiologically normal animals are slaughtered for human consumption and that abnormal animals are separated and dealt with accordingly. To ensure that meat from animals is free from disease, wholesome and of no risk to human health."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--ผลการตัดสินหลัง-am-และหลัง-pm": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--ผลการตัดสินหลัง-am-และหลัง-pm--v1",
          "statement": "การตัดสินซากหลังฆ่าต้องแยกรอยโรคแบบ localized กับ generalized และแบบ acute กับ chronic ระยะ chronic มักตัดทิ้งเฉพาะส่วนที่เป็นโดยไม่ทิ้งทั้งซาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-fao-a",
              "locator": "Chapter 1, Carcass judgement (acute versus chronic conditions)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The judgement in the chronic stage is less severe and frequently the removal of affected portions is required without the condemnation of the carcass."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--am-วัตถุประสงค์-ข้อมูลและเอกสาร": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--am-วัตถุประสงค์-ข้อมูลและเอกสาร--v1",
          "statement": "วัตถุประสงค์ของ antemortem inspection รวมถึงแยกสัตว์สกปรกเพื่อลดการปนเปื้อนในพื้นที่ฆ่า และให้สัตว์ที่บาดเจ็บถูกฆ่าฉุกเฉินอย่างมีมนุษยธรรม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-fao-a",
              "locator": "Chapter 1, Antemortem inspection",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "to reduce contamination on the killing floor by separating the dirty animals and condemning the diseased animals if required by regulation. to ensure that injured animals or those with pain and suffering receive emergency slaughter and that animals are treated humanely."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--am-วิธีตรวจและเวลา": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--am-วิธีตรวจและเวลา--v1",
          "statement": "การตรวจก่อนฆ่าทำภายใน 24 ชั่วโมงก่อนฆ่า และตรวจซ้ำถ้าการฆ่าเลื่อนเกินหนึ่งวัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-fao-a",
              "locator": "Chapter 1, Antemortem inspection",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Antemortem examination should be done within 24 hours of slaughter and repeated if slaughter has been delayed over a day."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--am-ความผิดปกติที่ดู-8-ข้อ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--am-ความผิดปกติที่ดู-8-ข้อ--v1",
          "statement": "ความผิดปกติที่ตรวจก่อนฆ่าได้แก่ การหายใจ พฤติกรรม การเดิน ท่าทาง โครงสร้าง สิ่งคัดหลั่ง สี และกลิ่น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-fao-a",
              "locator": "Chapter 1, Antemortem inspection",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Abnormalities in respiration Abnormalities in behaviour Abnormalities in gait Abnormalities in posture Abnormalities in structure and conformation Abnormal discharges or protrusions from body openings Abnormal colour Abnormal odour"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--am-ของสัตว์ปีก": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--am-ของสัตว์ปีก--v1",
          "statement": "สัตว์ปีกที่อยู่ในลังหรือ liner ตรวจก่อนฆ่าได้เพียงสภาพทั่วไปแบบผิวเผิน ส่วนที่เหลือตรวจหลังแขวนบน shackle และก่อนปล่อยเลือด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Postmortem inspection of poultry (antemortem inspection of birds)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Antemortem inspection of birds presents some difficulties if the birds are placed in crates or liners, and hence only a superficial inspection of their general condition is carried out. The remainder of the poultry examination should take place after the birds have been hung in shackles and before they are bled."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--pm-วิธีตรวจ-การจัดเรียงซาก-และการสรุปผล": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--pm-วิธีตรวจ-การจัดเรียงซาก-และการสรุปผล--v1",
          "statement": "การตรวจซากหลังชำแหละควรทำให้เร็วที่สุดหลัง dressing เสร็จ เพื่อตรวจจับความผิดปกติ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Postmortem inspection, routine postmortem examination",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Routine postmortem examination of a carcass should be carried out as soon as possible after the completion of dressing in order to detect any abnormalities"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--จำแนกรอยโรค-acute-กับ-chronic-และ-localized-กับ-generalized": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--จำแนกรอยโรค-acute-กับ-chronic-และ-localized-กับ-generalized--v1",
          "statement": "Localized คือรอยโรคถูกกลไกป้องกันของสัตว์จำกัดอยู่ในบริเวณหรืออวัยวะหนึ่ง ส่วน generalized คือกลไกป้องกันหยุดการลามทางระบบไหลเวียนเลือดหรือน้ำเหลืองไม่ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Localized versus generalized conditions",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In a localized condition, a lesion is restricted by the animal defense mechanisms to a certain area or organ. ... In a generalized condition, the animal's defense mechanisms are unable to stop the spread of the disease process by way of the circulatory or lymphatic systems."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--ข้อกำหนดขั้นต่ำของ-pm-การตรวจหัว": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--ข้อกำหนดขั้นต่ำของ-pm-การตรวจหัว--v1",
          "statement": "ข้อกำหนดขั้นต่ำสำหรับหัว: ต่อมน้ำเหลือง submaxillary, parotid และ retropharyngeal ดูและกรีดเปิดด้วยการกรีดหลายรอยหรือฝานเป็นแผ่น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Guidelines for minimum postmortem inspection requirements, Heads",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Lymph nodes (Fig. 1) Submaxillary Incise(a) Parotid Incise(a) Retropharyngeal Incise(a) View and incise by multiple incision or slicing."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--pm-การตรวจเครื่องใน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--pm-การตรวจเครื่องใน--v1",
          "statement": "ข้อกำหนดขั้นต่ำสำหรับปอด: ดูและคลำ และเปิด bronchi ด้วยการกรีดตามขวางผ่าน diaphragmatic lobes ยกเว้นแกะและแพะ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Guidelines for minimum postmortem inspection requirements, Lungs",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Lungs (Fig. 3) View and palpate. Except in sheep and goats, the bronchi should be opened up by a transverse incision across the diaphragmatic lobes."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--pm-การตรวจซากและต่อมน้ำเหลืองของซาก": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--pm-การตรวจซากและต่อมน้ำเหลืองของซาก--v1",
          "statement": "ข้อกำหนดขั้นต่ำสำหรับต่อมน้ำเหลืองของซาก: superficial inguinal ในตัวผู้และ supramammary ในตัวเมียให้คลำ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Guidelines for minimum postmortem inspection requirements, Carcass, Lymph nodes",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Lymph nodes 1 Superficial inguinal (male) (Fig. 10) - Palpate Supramammary (female) - Palpate (a)"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--pm-ของสัตว์ปีก-วิธีตรวจ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--pm-ของสัตว์ปีก-วิธีตรวจ--v1",
          "statement": "การตรวจหลังฆ่าสัตว์ปีกใช้การดู คลำ และดมกลิ่น และแขวนซากที่ 2 หรือ 3 จุดตามชนิดของสัตว์ปีก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Postmortem inspection of poultry",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "P/M examination consist of viewing, palpation and smell. ... Carcasses must be suspended at 2 or 3 points depending on the class of poultry."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--pm-ของสัตว์ปีก-สภาพโดยรวม-ข้อ-hock-และผิวด้านใน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--pm-ของสัตว์ปีก-สภาพโดยรวม-ข้อ-hock-และผิวด้านใน--v1",
          "statement": "ซากสัตว์ปีกที่เป็น septicemia ต้อง condemn ส่วนรอยโรคเฉพาะที่ของข้อหรือ tendon sheath ให้ทำลายเฉพาะส่วนที่เป็น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Poultry bacterial diseases, Pasteurellosis (fowl cholera), Judgement",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Localized lesions of pasteurellosis such as infection of wattles, joints or tendon sheaths require the condemnation of the affected parts; the rest of the carcass is approved. Septicemic carcasses should be condemned ."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--pm-ของสัตว์ปีก-เครื่องใน-ผิวภายนอก-และซากที่ต้อง-condemn": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--pm-ของสัตว์ปีก-เครื่องใน-ผิวภายนอก-และซากที่ต้อง-condemn--v1",
          "statement": "ซากสัตว์ปีกที่เป็น lymphoid leucosis ต้อง condemn",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Poultry viral diseases, Avian leucosis complex (lymphoid leucosis), Judgement",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The carcass of a bird affected with lymphoid leucosis is condemned."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--ภาวะทางพยาธิวิทยาทั่วไป-fever-และ-septicemia": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--ภาวะทางพยาธิวิทยาทั่วไป-fever-และ-septicemia--v1",
          "statement": "Septicemia คือภาวะจากแบคทีเรียก่อโรคและสารพิษในเลือด และวินิจฉัยแน่นอนได้ด้วยการแยกเชื้อจากกระแสเลือดเท่านั้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "General pathological conditions, Septicemia",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Septicemia is a morbid condition caused by the presence of pathogenic bacteria and their associated toxins in the blood. The positive diagnosis of septicemia can only be made by isolation of the causative organism from the blood stream."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--pigmentation-hemorrhage-hematoma-และ-bruises": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--pigmentation-hemorrhage-hematoma-และ-bruises--v1",
          "statement": "เลือดออกในกล้ามเนื้อสัมพันธ์กับการทำให้สลบด้วยไฟฟ้าที่ไม่เหมาะสมในสุกรและแกะ การขนส่งนาน และความเครียดก่อนฆ่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "General pathological conditions, Haemorrhage and Haematoma",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Haemorrhage is also associated with vitamin C deficiencies, a sudden increase in blood pressure with weakened blood vessels, and improper electric current stunning in pigs and sheep. Lengthy transportation, exposure to stress before slaughter, hot weather and excitement are some of the other factors"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--abscess-emaciation-edema-tumors-calcification-และกลิ่นผิดปกติ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--abscess-emaciation-edema-tumors-calcification-และกลิ่นผิดปกติ--v1",
          "statement": "ฝีคือการสะสมของหนองเฉพาะที่ที่แยกจากเนื้อเยื่อรอบข้างด้วยแคปซูลเส้นใย โดยฝีตับพบเชื้อ Actinomyces, Streptococcus และ Staphylococcus บ่อย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "General pathological conditions, Abscess",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "An abscess is a localized collection of pus separated from the surrounding tissue by a fibrous capsule. The most common bacteria in liver abscesses include Actinomyces (Corynebacterium) pyogenes, Streptococcus spp. and Staphylococcus spp."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--เกณฑ์ตัดสินซาก-โรคจากไวรัส": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--เกณฑ์ตัดสินซาก-โรคจากไวรัส--v1",
          "statement": "ใน FMD ประเทศหรือเขตที่ปลอดโรคห้ามรับสัตว์ป่วยหรือสงสัยเข้าโรงฆ่า และถ้าสงสัยตอน PM ให้ condemn ซากและเครื่องใน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Foot-and-mouth disease, Judgement",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In countries or in zones within a country free or nearly free of FMD diseased or suspect animals are prohibited to be admitted in an abattoir or slaughtered. If FMD is suspected on postmortem examination the carcass and viscera are condemned"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--เกณฑ์ตัดสินซาก-โรคจากแบคทีเรีย": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--เกณฑ์ตัดสินซาก-โรคจากแบคทีเรีย--v1",
          "statement": "ซากสุกรที่เป็น brucellosis ต้อง condemn",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-manual-on-meat-inspection-for-developing-countries-1994",
              "locator": "Swine diseases, Brucellosis, Judgement",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Judgement : Carcass affected with brucellosis is condemned ."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-ante-post-mortem--เกณฑ์ตัดสินซาก-พยาธิ-โปรโตซัว-ปรสิตสัตว์ขาปล้อง-และ-pse-dfd": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-ante-post-mortem--เกณฑ์ตัดสินซาก-พยาธิ-โปรโตซัว-ปรสิตสัตว์ขาปล้อง-และ-pse-dfd--v1",
          "statement": "ความเครียดก่อนฆ่าและการจัดการหลังฆ่าช่วงแรก ทำให้โปรตีนเสียสภาพและกล้ามเนื้อกักน้ำได้ไม่ดี ซึ่งเป็นกลไกของ PSE ในเนื้อสุกร",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22062597",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "antemortem stress and early postmortem processing practices (e.g. chilling rate) that can influence the development and severity of the PSE phenomenon. Some of these factors are known to cause protein denaturation at the early stage of postmortem and directly contribute to poor water-holding capacity"
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-pest-control": {
    "milk-meat-hygiene--meat-pest-control--ปัญหาจาก-pest-ชนิดของ-pest-และหลักการควบคุม-4-ข้อ": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-pest-control--ปัญหาจาก-pest-ชนิดของ-pest-และหลักการควบคุม-4-ข้อ--v1",
          "statement": "แมลงสาบนำแบคทีเรียแพร่ในสิ่งแวดล้อมได้ และอาจแพร่การติดเชื้อโดยเฉพาะที่มากับอาหาร จึงเป็นปัญหาของ pest ในโรงงานอาหาร",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31219601",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Cockroach bacterial contaminants may result in the dissemination of opportunistic or pathogenic infections, particularly nosocomial and foodborne infections."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-pest-control--rodents-และ-rodent-control-proofing": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-pest-control--rodents-และ-rodent-control-proofing--v1",
          "statement": "โรงฆ่าสัตว์ต้องออกแบบสถานที่ให้จำกัดทางเข้าและที่อยู่อาศัยของ pest ซึ่งเป็นหลักของ proofing",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 6 (establishment design and facilities), facility requirements list",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "access and harbouring of pests are effectively restricted"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-pest-control--direct-demolition-baits-rodenticides-และ-rodent-traps": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-pest-control--direct-demolition-baits-rodenticides-และ-rodent-traps--v1",
          "statement": "Brodifacoum เป็น superwarfarin ที่จับ vitamin K epoxide reductase แรงกว่า warfarin จึงฆ่าหนูที่ดื้อ warfarin ได้ (กลไก anticoagulation)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27244102",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Compared to warfarin, superwarfarins have much longer half-lives and stronger affinity to vitamin K epoxide reductase and therefore can cause death in warfarin-resistant rodents."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-pest-control--cockroaches-และ-cockroach-control": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-pest-control--cockroaches-และ-cockroach-control--v1",
          "statement": "เหยื่อล่อที่มี boric acid ลดประชากรแมลงสาบเยอรมันได้อย่างมีประสิทธิผล",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15154503",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "These data indicate that liquid formulations of boric acid effectively reduce the burden of cockroach infestation in swine production."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-pest-control--insect-controls": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-pest-control--insect-controls--v1",
          "statement": "โปรแกรมควบคุม pest เป็นส่วนสำคัญของการบำรุงรักษาและสุขาภิบาลในโรงฆ่าสัตว์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2005",
              "locator": "Section 10, para 166 (pest control programmes)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Pest control programmes are an essential part of maintenance and sanitation"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-pest-control--รายละเอียดจากเอกสารอ่านประกอบ-fumigation-กับดัก-ultrasound-แมลงว": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-pest-control--รายละเอียดจากเอกสารอ่านประกอบ-fumigation-กับดัก-ultrasound-แมลงว--v1",
          "statement": "แมลงวัน (filth flies รวมถึง Musca domestica) เป็นพาหะนำแบคทีเรียก่อโรคทางกล",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26228457",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The mechanical transmission of pathogenic bacteria by synanthropic filth flies is widely recognized."
          }
        }
      ]
    }
  },
  "milk-meat-hygiene--meat-egg-micro": {
    "milk-meat-hygiene--meat-egg-micro--ความสำคัญของจุลินทรีย์กับไข่-และโครงสร้างของไข่": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-egg-micro--ความสำคัญของจุลินทรีย์กับไข่-และโครงสร้างของไข่--v1",
          "statement": "Salmonella Enteritidis เป็นเชื้อที่ทำให้เกิดการระบาดที่เกี่ยวข้องกับไข่ จึงเป็นประเด็น foodborne disease ของไข่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15504264",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A Salmonella enterica serovar Enteritidis epidemic in the United States began in 1978, spread to much of the country in the following decade, and began declining in 1996."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-egg-micro--egg-shell-structure-true-layer-pores-shell-accessory-material-sh": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-egg-micro--egg-shell-structure-true-layer-pores-shell-accessory-material-sh--v1",
          "statement": "cuticle ที่สมบูรณ์อุดรูหายใจของเปลือกไข่และเป็นเกราะป้องกันการเจาะของจุลินทรีย์ โดยความหนาและการปกคลุมขึ้นกับอายุแม่ไก่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35281050",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "An intact cuticle forms a pore plug to occlude respiratory pores and is an effective physical and chemical barrier against microbial penetration. ... its composition, thickness and degree of coverage are dependent on species, hen age, and physiological stressors."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-egg-micro--compartmentalization-การเสียสภาพ-และการรักษาความสดของไข่": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-egg-micro--compartmentalization-การเสียสภาพ-และการรักษาความสดของไข่--v1",
          "statement": "ไข่ที่เคลือบน้ำมันเก็บที่ 22 °C เสียน้ำหนักเท่าไข่แช่เย็น 4 °C ส่วนไข่ไม่เคลือบที่ 22 °C เสียน้ำหนักมากที่สุด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41447765",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The greatest decreases in egg weight were observed in eggs at 22 °C: A-U, A-W, and A-21 W (P < 0.0001). A-O eggs had comparable egg weight loss to eggs stored at 4 °C."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-egg-micro--eggs-as-aseptically-packaged-food-และ-routes-of-bacterial-transm": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-egg-micro--eggs-as-aseptically-packaged-food-และ-routes-of-bacterial-transm--v1",
          "statement": "Salmonella Enteritidis เข้าไปอยู่ในไข่แดงของไข่ที่ออกมาได้ผ่านทาง transovarian transmission หลังติดเชื้อที่อวัยวะสืบพันธุ์ของแม่ไก่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11332500",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Salmonella enteritidis was recovered from three yolks of the laid eggs (7.0%), suggesting egg contamination from the transovarian transmission of S. enteritidis."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-egg-micro--antimicrobial-defense-ของไข่": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-egg-micro--antimicrobial-defense-ของไข่--v1",
          "statement": "โปรตีนไข่ขาว ได้แก่ lysozyme และ ovotransferrin มีฤทธิ์ต้านจุลชีพ (จากหลักฐานส่วนใหญ่ในระดับทดลอง)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42134140",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Albumen proteins, including lysozyme, ovotransferrin, and ovomucoid, have demonstrated antimicrobial and immunomodulatory activities mainly in experimental settings."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-egg-micro--trans-shell-transmission-ปัจจัยและการป้องกัน": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-egg-micro--trans-shell-transmission-ปัจจัยและการป้องกัน--v1",
          "statement": "แบคทีเรียแกรมลบที่เคลื่อนที่ได้ เช่น Pseudomonas และ Alcaligenes เจาะผ่านเปลือกไข่ได้บ่อยที่สุด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16822571",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Pseudomonas sp. (60%) and Alcaligenes sp. (58%) were primary invaders followed by S. enteritidis (43%)"
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-egg-micro--salmonella-transmission": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-egg-micro--salmonella-transmission--v1",
          "statement": "เชื้อ SE เจาะผ่านเปลือกไข่ได้ และการปนเปื้อนของเปลือกเมื่อสิ้นสุดการเก็บสัมพันธ์กับการเจาะของเชื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17388050",
              "locator": "abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Shell contamination at the end of storage was highly correlated with SE penetration."
          }
        }
      ]
    },
    "milk-meat-hygiene--meat-egg-micro--การล้างไข่-ten-commandments-of-washing-eggs": {
      "claims": [
        {
          "id": "milk-meat-hygiene--meat-egg-micro--การล้างไข่-ten-commandments-of-washing-eggs--v1",
          "statement": "น้ำล้างไข่ต้องอุ่นกว่าอุณหภูมิภายในไข่ที่จะล้าง (อย่างน้อย 90 °F และสูงกว่าไข่อย่างน้อย 20 °F) ตลอดรอบการล้าง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-7-cfr-56-76-facility-operations-and-equipment-washing-of",
              "locator": "7 CFR 56.76, washing requirements, item (3)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The temperature of the wash water shall be maintained at 90 °F (32.2 °C) or higher, and shall be at least 20 °F (6.7 °C) warmer than the internal temperature of the eggs to be washed."
          }
        }
      ]
    }
  }
};
