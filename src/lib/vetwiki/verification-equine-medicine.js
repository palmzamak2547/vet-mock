// ============================================================
// VetWiki — reference-verification overlay, Equine Medicine notes of 2569
// ============================================================
// One claim per section added on 15 Nov 2026, each cross-checked against a real
// external source (./sources.js): the supporting words of the source are quoted
// in the claim's `review.rationale`, and a second reader fetched the source again
// and found them there. verification.js merges this overlay in code with the
// curated and the generated ones, so no key of one object literal can shadow another.
// ============================================================

/** @type {Record<string, Record<string, {claims: object[]}>>} */
export const EQUINE_MEDICINE_VERIFICATIONS = {
  "equine-medicine--equine-nutrition": {
    "equine-medicine--equine-nutrition--ธรรมชาติของม้าและทางเดินอาหาร": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--ธรรมชาติของม้าและทางเดินอาหาร--v1",
          "statement": "ม้าหมักอาหารหยาบในลำไส้ส่วนหลัง (cecum และ large colon) ส่วนสารอาหารที่หนีการย่อยในลำไส้เล็กจะถูกจุลินทรีย์ใน large intestine ย่อยต่อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Nutritional Requirements, introduction (digestive physiology)",
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
            "rationale": "Any nutrient sources that escape small intestinal digestion and absorption are passed on for microbial degradation in the large intestine."
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--อาหารต้องให้อะไร-และความต้องการเคี้ยว": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--อาหารต้องให้อะไร-และความต้องการเคี้ยว--v1",
          "statement": "ม้าใช้อาหารหยาบ เช่น หญ้า ถั่ว และหญ้าแห้ง เป็นแหล่งอาหารหลักหรือแหล่งเดียวได้ เพราะมีการหมักใน cecum และ large colon",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Nutritional Requirements, introduction",
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
            "rationale": "can use forages such as pasture/range grasses and legumes, preserved hays, and other forage-based feeds as major or sole sources of nutrition because of fermentation in the cecum and large colon."
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--น้ำ": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--น้ำ--v1",
          "statement": "ม้าโตที่อยู่ในสภาพ thermoneutral ต้องการน้ำขั้นต่ำเพื่อคงสภาพ 5 ลิตรต่อ 100 kg ต่อวัน และม้า 500 kg ที่ทำงานน้อยกินน้ำ 21-29 ลิตรต่อวัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Water Requirements of Horses and Other Equids",
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
            "rationale": "The average minimal maintenance daily water requirement of a sedentary adult horse in a thermoneutral environment is 5 L/100 kg body weight/day . A 500-kg adult horse in minimal work will typically drink 21–29 L of water per day"
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--โปรตีนและกรดอะมิโน": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--โปรตีนและกรดอะมิโน--v1",
          "statement": "โปรตีนคุณภาพสูงสำหรับม้าต้องมีกรดอะมิโนจำเป็น โดยเฉพาะ lysine, methionine และ threonine",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Protein and Amino Acids Requirements of Horses",
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
            "rationale": "A high-quality protein includes essential amino acids —in particular, lysine, methionine, and threonine ."
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--พลังงาน": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--พลังงาน--v1",
          "statement": "ความต้องการพลังงานของม้า (Mcal digestible energy) ต่างกันตามระยะ maintenance, growth, pregnancy, lactation และงาน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Energy Requirements of Horses and Other Equids",
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
            "rationale": "Energy requirements (expressed as Mcal digestible energy for horses) are different for maintenance, growth, pregnancy, lactation, and work."
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--แหล่งพลังงาน-ชนิดกล้ามเนื้อ-และการเลือกอาหารตามงาน": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--แหล่งพลังงาน-ชนิดกล้ามเนื้อ-และการเลือกอาหารตามงาน--v1",
          "statement": "พลังงานของม้าส่วนใหญ่มาจากคาร์โบไฮเดรตและไขมัน โปรตีนปกติไม่ได้ใช้เป็นแหล่งพลังงานและให้พลังงานน้อยมาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Protein and Amino Acids Requirements of Horses",
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
            "rationale": "Energy predominantly comes from carbohydrates and fat, whereas dietary protein is normally not used as an energy source and contributes very little to overall energy production."
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--แร่ธาตุ-dod-ในลูกม้า-และน้ำนมแม่ม้า": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--แร่ธาตุ-dod-ในลูกม้า-และน้ำนมแม่ม้า--v1",
          "statement": "ทองแดงเป็นแร่ธาตุสำคัญต่อเอนไซม์ที่เกี่ยวกับเนื้อเยื่อเกี่ยวพัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Copper Requirements of Horses",
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
            "rationale": "Copper is an important mineral for enzymes that affect connective tissue, mobilization of iron stores, mitochondrial integrity, melanin, and detoxification of superoxide"
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--อิเล็กโทรไลต์และ-heat-stress-index": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--อิเล็กโทรไลต์และ-heat-stress-index--v1",
          "statement": "เหงื่อม้าเป็น hypertonic ม้าจึงเสียอิเล็กโทรไลต์ โดยเฉพาะโซเดียม คลอไรด์ และโพแทสเซียมมากเมื่อเหงื่อออก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Sodium/salt requirements (sweat losses)",
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
            "rationale": "Horses are able to sweat at higher rates than any other mammal, and equine sweat is hypertonic. As such, horses can lose high quantities of electrolytes, particularly sodium, chloride, and potassium, when they sweat"
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--วิตามิน-bcs-และ-tes": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--วิตามิน-bcs-และ-tes--v1",
          "statement": "การป้อนอาหารควรปรับให้ BCS อยู่ระหว่าง 4 ถึง 6 ตามมาตรา Henneke 9 คะแนน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Table notes, Body Condition Scores for Horses",
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
            "rationale": "Amounts fed should be adjusted to maintain a body condition score (BCS) between 4 and 6 on the Henneke Body Condition 9-point scale"
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--อาหารหยาบ-ปริมาณ-แปลงหญ้า-และหญ้าแห้ง": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--อาหารหยาบ-ปริมาณ-แปลงหญ้า-และหญ้าแห้ง--v1",
          "statement": "คำแนะนำปัจจุบันให้ม้าได้อาหารหยาบอย่างน้อย 1.5-2% ของน้ำหนักตัวต่อวันตามฐาน dry matter",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Feeding forage (Nutritional Requirements)",
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
            "rationale": "Current recommendations are that horses receive at least 1.5–2% of their body weight (BW) in forage per day on a DM basis."
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--คุณภาพหญ้าและ-rfv": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--คุณภาพหญ้าและ-rfv--v1",
          "statement": "หญ้าที่มี lignin ต่ำกว่า (ในแอลฟัลฟา) ถูกมองว่าเป็นแหล่งอาหารหยาบคุณภาพสูงกว่า เพราะย่อยได้ดีขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34013333",
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
            "rationale": "Reduced lignin alfalfa (Medicago sativa L.) has the potential to provide a higher-quality forage source for livestock by improving forage digestibility."
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--เมื่อหญ้าไม่พอ-อาหารแทนหญ้า-อาหารข้น-ไขมัน-ธัญพืช-และฉลาก": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--เมื่อหญ้าไม่พอ-อาหารแทนหญ้า-อาหารข้น-ไขมัน-ธัญพืช-และฉลาก--v1",
          "statement": "การเพิ่มแคลอรีทำได้โดยค่อยๆ เพิ่มอาหารข้นไขมันสูงหรือน้ำมัน ซึ่งเหมาะกับม้าผอมที่ต้องใช้อาหาร NSC ต่ำ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Energy Requirements, increasing caloric intake",
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
            "rationale": "slowly adding a high-fat concentrate, adding oil (ideal for underweight metabolic horses that require low-NSC diets)"
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--แป้ง-hindgut-acidosis-และ-gastric-ulcer": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--แป้ง-hindgut-acidosis-และ-gastric-ulcer--v1",
          "statement": "การให้อาหารเป็นมื้อห่าง การได้น้ำตาลและแป้งสูง และการขาดอาหารหยาบ สัมพันธ์กับความเสี่ยง equine squamous gastric disease ที่เพิ่มขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31637798",
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
            "rationale": "Nutritional factors such as intermittent feeding, high sugars and starch intake, large amounts of straw as forage and prolonged time without access to forage have all been associated with an increased risk of equine squamous gastric disease (ESGD)."
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--จัดอาหารทั้งชุด-ติดตาม-และตัวอย่าง": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--จัดอาหารทั้งชุด-ติดตาม-และตัวอย่าง--v1",
          "statement": "อาหารข้นสูตรเฉพาะหรือ ration balancer ใช้เสริมอาหารหยาบได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-nutritional-requirements-of-horses-and-other-equids-2026",
              "locator": "Pregnancy and Lactation Requirements",
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
            "rationale": "In general, a concentrate specifically formulated for broodmares and growing foals is recommended to supplement forage; an alternative is adding an appropriate amount of a ration balancer to the diet"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-infectious": {
    "equine-medicine--equine-infectious--ภาพรวมโรคติดเชื้อในม้า": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--ภาพรวมโรคติดเชื้อในม้า--v1",
          "statement": "Hendra virus เป็น henipavirus ที่ติดคนได้และตายสูง ก่อการข้ามสปีชีส์ซ้ำในออสเตรเลียตั้งแต่ปี 1994",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42689109",
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
            "rationale": "Hendra virus (HeV) is a highly lethal zoonotic henipavirus that has caused recurrent cross-species spillover events in Australia since 1994."
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--rabies": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--rabies--v1",
          "statement": "เมื่อม้าแสดงอาการ rabies โรคแทบทุกรายถึงตาย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-rabies-in-horses-2026",
              "locator": "Rabies in Horses (owner version), overview",
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
            "rationale": "Once a horse shows signs of rabies, the disease is almost always fatal."
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--african-horse-sickness-ahs": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--african-horse-sickness-ahs--v1",
          "statement": "ในม้า AHS แพร่โดยริ้นกัด Culicoides เป็นพาหะหลักของไวรัสทั้ง 9 serotypes",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-african-horse-sickness-2026",
              "locator": "Transmission of African Horse Sickness",
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
            "rationale": "Culicoides spp are the principal vectors of all 9 known serotypes of AHSV."
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--equine-herpesvirus-ehv": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--equine-herpesvirus-ehv--v1",
          "statement": "EHV-1 ทำให้แท้งช่วงท้ายของการตั้งท้อง หรือโรคระบบประสาท (EHM) ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-equine-herpesvirus-infection-equine-viral-rhinopneumonit",
              "locator": "Introduction",
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
            "rationale": "EHV-1 may also cause late term abortions or neurologic disease (equine herpesvirus myeloencephalopathy, EHM)."
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--equine-infectious-anemia-eia": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--equine-infectious-anemia-eia--v1",
          "statement": "EIA แพร่ทางกลไกโดยแมลงดูดเลือด โดยเฉพาะ horse flies และ deer flies",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-equine-infectious-anemia-2026",
              "locator": "Etiology and Epidemiology",
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
            "rationale": "The principal mode of natural transmission of EIA is mechanical transmission by blood-feeding insects, especially horse flies and deer flies."
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--equine-influenza": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--equine-influenza--v1",
          "statement": "ไวรัส equine influenza ชนิด A subtype H3N8 พบครั้งแรกปี 1963 และกลายเป็นโรคประจำถิ่นในหลายประเทศ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-equine-influenza-2026",
              "locator": "Etiology",
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
            "rationale": "Equine influenza (Orthomyxovirus) A/equine type-2 H3N8 was first recognized in 1963 and has subsequently become endemic in many countries."
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--equine-encephalomyelitis-และ-japanese-encephalitis": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--equine-encephalomyelitis-และ-japanese-encephalitis--v1",
          "statement": "ในโรค JE ม้าเป็น dead-end host ส่วนสุกรเป็น amplifier ที่สำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-japanese-encephalitis-aetiology-epidemiology-diagnosis-p",
              "locator": "Epidemiology, Hosts",
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
            "rationale": "Horses are the primary affected domestic animals of JE though essentially a dead-end host; other equids (donkeys) are also susceptible • Pigs act as important amplifiers of the virus producing high viraemias that infect mosquito vectors"
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--tetanus": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--tetanus--v1",
          "statement": "Tetanus เกิดจากพิษที่สร้างโดยแบคทีเรีย Clostridium tetani ซึ่งพบในดิน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tetanus-in-horses-2026",
              "locator": "Overview",
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
            "rationale": "The toxin is produced by the bacterium Clostridium tetani"
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--strangles": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--strangles--v1",
          "statement": "Strangles แพร่ทางสัมผัสโดยตรงกับม้าป่วย หรือผ่านอุปกรณ์ที่ปนเปื้อน (fomites)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-strangles-in-horses-2026",
              "locator": "Etiology and Epidemiology",
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
            "rationale": "Transmission is via direct contact with infected horses or with any number of contaminated fomites."
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--glanders-และ-contagious-equine-metritis-cem": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--glanders-และ-contagious-equine-metritis-cem--v1",
          "statement": "Glanders เป็นโรคติดต่อของ equids ที่มักตาย เกิดจากแบคทีเรีย Burkholderia mallei",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-glanders-in-horses-and-other-equids-2026",
              "locator": "Overview",
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
            "rationale": "Glanders is a contagious, usually fatal disease of Equidae caused by the bacterium Burkholderia mallei"
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--trypanosomiasis-และ-equine-piroplasmosis": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--trypanosomiasis-และ-equine-piroplasmosis--v1",
          "statement": "Equine piroplasmosis เกิดจาก Theileria equi หรือ Babesia caballi",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-babesiosis-in-animals-2026",
              "locator": "Horses",
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
            "rationale": "Equine piroplasmosis is caused by Theileria (formerly Babesia ) equi or B caballi"
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--guttural-pouch-mycosis": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--guttural-pouch-mycosis--v1",
          "statement": "Guttural pouch mycosis เป็นการติดเชื้อราที่ guttural pouch ซึ่งสาเหตุที่พบบ่อยคือ Aspergillus",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-guttural-pouch-disease-in-horses-2026",
              "locator": "Guttural Pouch Mycosis",
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
            "rationale": "Guttural pouch mycosis is a fungal infection of the guttural pouch. Aspergillus species of fungus are common causes of these infections"
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--equine-biosecurity": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--equine-biosecurity--v1",
          "statement": "Biosecurity คือชุดแนวปฏิบัติด้านการจัดการที่จำกัดการแพร่ของโรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-biosecurity-handout-2025",
              "locator": "Page 1",
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
            "rationale": "Biosecurity is a set of management practices that limit the spread of disease."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-respi": {
    "equine-medicine--equine-respi--sinusitis-ในม้า": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--sinusitis-ในม้า--v1",
          "statement": "Sinusitis ในม้าแบ่งเป็น primary และ secondary โดย secondary sinusitis เกิดตามโรคอื่น เช่น การติดเชื้อที่ปลายรากฟัน sinus cyst หรือก้อนในบริเวณ ethmoturbinate",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24467610",
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
            "rationale": "Underlying diseases were primary (n = 1) and secondary sinusitis (4) because of apical dental infection (1), sinus cyst (2), or masses in the ethmoturbinate region (2)."
          }
        }
      ]
    },
    "equine-medicine--equine-respi--การหายใจขณะพักและขณะออกกำลัง-poor-performance": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--การหายใจขณะพักและขณะออกกำลัง-poor-performance--v1",
          "statement": "ขณะควบ ม้ามีรูปแบบการหายใจที่เชื่อมกับจังหวะการเคลื่อนที่ (locomotor-respiratory coupling)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17402485",
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
            "rationale": "Locomotor-respiratory coupled (LRC) breath types are a feature of galloping exercise in horses."
          }
        }
      ]
    },
    "equine-medicine--equine-respi--การเก็บตัวอย่าง-ttw-bal-thoracocentesis-sinocentesis": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--การเก็บตัวอย่าง-ttw-bal-thoracocentesis-sinocentesis--v1",
          "statement": "Transtracheal aspirate ใช้เก็บตัวอย่างสำหรับ cytology และเพาะเชื้อในม้าที่สงสัย lower respiratory tract disease",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39693736",
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
            "rationale": "Transtracheal aspirate is indicated to collect samples for cytology and bacteriologic culture in cases of suspected pneumonia or other lower respiratory tract disease."
          }
        }
      ]
    },
    "equine-medicine--equine-respi--ethmoid-hematoma": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--ethmoid-hematoma--v1",
          "statement": "Progressive ethmoidal hematoma รักษาด้วยการฉีด 4% formaldehyde ผ่านกล้อง endoscope เข้าก้อนโดยตรง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9605229",
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
            "rationale": "PEHs were injected transendoscopically with 4% formaldehyde solution."
          }
        }
      ]
    },
    "equine-medicine--equine-respi--guttural-pouch-empyema-mycosis-tympany": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--guttural-pouch-empyema-mycosis-tympany--v1",
          "statement": "Guttural pouch empyema คือการสะสม purulent exudate ในกระพุ้งคอ มักตามหลังการติดเชื้อแบคทีเรีย (ส่วนใหญ่ Streptococcus spp.) ของทางเดินหายใจส่วนบน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-guttural-pouch-disease-in-horses-2023",
              "locator": "Guttural pouch empyema",
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
            "rationale": "Guttural pouch empyema is defined as unilateral or bilateral accumulation of purulent exudate in the guttural pouch. The infection usually develops subsequent to a bacterial (primarily Streptococcus spp) infection of the upper respiratory tract."
          }
        }
      ]
    },
    "equine-medicine--equine-respi--pharynx-และ-larynx-lymphoid-hyperplasia-ddsp-epiglottic-entrapme": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--pharynx-และ-larynx-lymphoid-hyperplasia-ddsp-epiglottic-entrapme--v1",
          "statement": "DDSP คือภาวะที่ขอบ caudal ของ soft palate เคลื่อนขึ้นไปอยู่เหนือ epiglottis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-dorsal-displacement-of-the-soft-palate-in-horses-2023",
              "locator": "Overview",
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
            "rationale": "Dorsal displacement of the soft palate (DDSP) occurs when the caudal free-margin of the soft palate displaces dorsal to the epiglottis."
          }
        }
      ]
    },
    "equine-medicine--equine-respi--pneumonia-pleuropneumonia-pleural-effusion": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--pneumonia-pleuropneumonia-pleural-effusion--v1",
          "statement": "Streptococcus equi zooepidemicus เป็นเชื้อที่แยกได้บ่อยที่สุดในม้าที่เป็น pleuropneumonia",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-pleuropneumonia-in-horses-pleuritis-pleurisy-2023",
              "locator": "Etiology",
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
            "rationale": "Streptococcus equi zooepidemicus is most frequently isolated."
          }
        }
      ]
    },
    "equine-medicine--equine-respi--equine-asthma-iad-และ-rao": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--equine-asthma-iad-และ-rao--v1",
          "statement": "Neutrophilic airway inflammation เป็นลักษณะของ severe equine asthma ส่วน mild-moderate asthma อาจเป็น neutrophilic, eosinophilic หรือ mastocytic ผสมกันได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-asthma-in-horses-heaves-recurrent-airway-obstruction-inf",
              "locator": "Pathophysiology of equine asthma",
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
            "rationale": "Neutrophilic airway inflammation characterizes severe equine asthma while mild-moderate asthma can present as any combination of neutrophilic, eosinophilic, or mastocytic inflammation."
          }
        }
      ]
    },
    "equine-medicine--equine-respi--exercise-induced-pulmonary-hemorrhage-eiph": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--exercise-induced-pulmonary-hemorrhage-eiph--v1",
          "statement": "Epistaxis พบเพียงส่วนน้อย (~5%) ของม้าที่เป็น EIPH ส่วนการส่องกล้องพบเลือดใน tracheobronchial tree 45-75% ของม้าแข่ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-exercise-induced-pulmonary-hemorrhage-in-horses-2023",
              "locator": "Etiology and Pathogenesis",
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
            "rationale": "Epistaxis is seen in a small proportion (~5%) of horses with EIPH. Blood in the tracheobronchial tree is identified in 45%–75% of racehorses via endoscopic examination"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-parasites": {
    "equine-medicine--equine-parasites--ภาพรวม-ปรสิตเรียงตามอวัยวะ": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--ภาพรวม-ปรสิตเรียงตามอวัยวะ--v1",
          "statement": "ปรสิตหลายชนิดติดเชื้อในระบบทางเดินอาหารของม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-gastrointestinal-parasites-of-horses-2026",
              "locator": "Introduction",
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
            "rationale": "Numerous parasites can infect the digestive system of horses"
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--พยาธิตัวตืด-anoplocephalidae": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--พยาธิตัวตืด-anoplocephalidae--v1",
          "statement": "Oribatid mite ที่ม้ากินโดยบังเอิญขณะเล็มหญ้าเป็น intermediate host ของ Anoplocephala perfoliata",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-diseases-resulting-from-gastrointestinal-parasites-in-ho",
              "locator": "Anoplocephala perfoliata",
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
            "rationale": "Free-living and commonly occurring oribatid mites, accidentally ingested by horses while grazing, act as intermediate hosts for A perfoliata"
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--พยาธิในกระเพาะ-trichostrongylus-axei-habronema-และ-draschia": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--พยาธิในกระเพาะ-trichostrongylus-axei-habronema-และ-draschia--v1",
          "statement": "ม้าติด stomach worms (Habronema และ Draschia) จากการกินแมลงวันบ้านหรือแมลงวันคอก (หรือตัวอ่อน) ที่มีตัวอ่อนพยาธิ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-gastrointestinal-parasites-of-horses-2026",
              "locator": "Table: Common Gastrointestinal Parasites of Horses",
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
            "rationale": "Horses ingest house or stable flies (or their larvae) that contain larvae of the stomach worms."
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--พยาธิเส้นด้าย-strongyloides-westeri": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--พยาธิเส้นด้าย-strongyloides-westeri--v1",
          "statement": "Strongyloides westeri ติดจากแม่ม้าสู่ลูกม้าทางน้ำนม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-gastrointestinal-parasites-of-horses-2026",
              "locator": "Table: Common Gastrointestinal Parasites of Horses",
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
            "rationale": "Strongyloides westeri Transmitted from mares to foals in milk."
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--พยาธิไส้เดือนม้า-parascaris-equorum": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--พยาธิไส้เดือนม้า-parascaris-equorum--v1",
          "statement": "ไข่ Parascaris ที่ม้ากินเข้าไปฟักเป็นตัวอ่อน L3 ซึ่งเริ่มเดินทางผ่านตับสู่ปอด (hepatotracheal migration)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-diseases-resulting-from-gastrointestinal-parasites-in-ho",
              "locator": "Ascarid-Associated Colic in Horses",
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
            "rationale": "Once ingested by a horse, ascarid eggs hatch, and L3 larvae begin hepatotracheal migration, arriving in the lungs approximately 1 week after infection."
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--พยาธิหัวเข็มหมุด-oxyuris-equi": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--พยาธิหัวเข็มหมุด-oxyuris-equi--v1",
          "statement": "ไข่ของ Oxyuris equi ที่รอบทวารหนักเห็นเป็นก้อนสีขาวถึงเหลืองคล้ายสะเก็ด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-gastrointestinal-parasites-of-horses-2026",
              "locator": "Table: Common Gastrointestinal Parasites of Horses",
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
            "rationale": "Egg masses around anus appear as white to yellow crusty mass."
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--พยาธิสตรองกายม้า-large-และ-small-strongyles": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--พยาธิสตรองกายม้า-large-และ-small-strongyles--v1",
          "statement": "S. vulgaris เป็นหนึ่งในพยาธิที่ก่อโรครุนแรงที่สุดในม้า ตัวอ่อนเคลื่อนผ่าน cranial mesenteric artery ทำให้เกิด arteritis และ thromboembolism",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38827589",
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
            "rationale": "Strongylus vulgaris is one of the most pathogenic nematodes affecting equids. Larval migration through the cranial mesenteric artery (CMA) with attendant arteritis and thromboembolism can result in fatal non-strangulating intestinal infarction."
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--strongylidosis-การวินิจฉัยและงานวิจัยในไทย": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--strongylidosis-การวินิจฉัยและงานวิจัยในไทย--v1",
          "statement": "ในไทย ivermectin กำจัด strongyle ตัวเต็มวัยได้ภายใน 2 สัปดาห์ แต่ egg reappearance period สั้นลงเหลือ 6 สัปดาห์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38396542",
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
            "rationale": "although ivermectin effectively eliminated adult strongyle parasites within two weeks post-treatment, the ERP was shortened to 6 weeks post-treatment with a mean FECR of 70.4% (95% CI 46.1-84.0)"
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--strongylidosis-รักษา-ควบคุม-และการดื้อยา": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--strongylidosis-รักษา-ควบคุม-และการดื้อยา--v1",
          "statement": "Egg reappearance period ที่สั้นลงใช้เป็นตัวชี้วัดว่าพยาธิไวต่อยาลดลง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42731192",
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
            "rationale": "A shortened egg reappearance period (ERP) is frequently used as an indicator of reduced susceptibility."
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--พยาธิในเลือด-equine-piroplasmosis-และ-trypanosomiasis": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--พยาธิในเลือด-equine-piroplasmosis-และ-trypanosomiasis--v1",
          "statement": "Equine piroplasmosis เป็นโรคที่เห็บนำจากเชื้อ Theileria equi และ Babesia caballi ซึ่งอยู่ในเม็ดเลือดแดง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39205808",
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
            "rationale": "Equine piroplasmosis (EP) is a global tick-borne disease of equids caused by the intraerythrocytic apicomplexan parasites Theileria equi and Babesia caballi"
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--โรคผิวหนังจากปรสิต-เหา-ไร-summer-sores-และหนอนแมลงวัน": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--โรคผิวหนังจากปรสิต-เหา-ไร-summer-sores-และหนอนแมลงวัน--v1",
          "statement": "Habronemiasis ติดต่อผ่านแมลงวัน ตัวอ่อนที่ตกบนแผลทำให้เกิด summer sores ที่หายยาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40816495",
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
            "rationale": "The parasite is transmitted via flies, and larvae deposited in wounds result in difficult-to-heal \"summer sores\"."
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--พยาธิในตา-setaria": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--พยาธิในตา-setaria--v1",
          "statement": "ตัวเต็มวัย Setaria อยู่ในช่องท้อง แต่ตัวอ่อนอาจเคลื่อนผิดที่เข้าตาม้า ทำให้กระจกตาขุ่นและตาบอด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39180621",
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
            "rationale": "Adult worms belong to the Setariidae family and typically reside in the peritoneal cavity of ungulates. However, immature forms of these species may aberrantly migrate to the eyes of cattle, buffalo, goats, horses and several other hosts, leading to corneal opacity and blindness."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-lameness": {
    "equine-medicine--equine-lameness--นิยาม-และเป้าหมายของการตรวจ": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--นิยาม-และเป้าหมายของการตรวจ--v1",
          "statement": "Lameness ไม่ใช่โรค แต่เป็น clinical sign ที่แสดงความเจ็บปวด ข้อจำกัดเชิงกล หรือการทำงานของระบบประสาทและกล้ามเนื้อที่เปลี่ยนไป",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-overview-of-lameness-in-horses-2025",
              "locator": "Overview, paragraph 2",
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
            "rationale": "Lameness is not a disease itself, but a clinical sign. It is a manifestation of pain, mechanical restrictions causing alteration of stance or gait, or altered neuromuscular function."
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--ประวัติ-และการสร้าง-baseline": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--ประวัติ-และการสร้าง-baseline--v1",
          "statement": "การตรวจม้าขาเจ็บเริ่มจากการซักประวัติอย่างละเอียด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-lameness-examination-in-horses-2024",
              "locator": "The Lameness Examination, paragraph 2",
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
            "rationale": "The examination begins with a comprehensive medical history."
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--ตรวจตอนพัก-conformation-และความสมมาตร": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--ตรวจตอนพัก-conformation-และความสมมาตร--v1",
          "statement": "ตรวจ conformation และดูความสมมาตร การบวม กล้ามเนื้อที่หายไป ท่ายืนผิดปกติ และบาดแผล",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-lameness-examination-in-horses-2024",
              "locator": "The Lameness Examination, paragraph on visual evaluation",
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
            "rationale": "Conformation should be evaluated and the horse visually checked for symmetry, swellings, muscle loss, abnormal stance, and obvious injuries."
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--walk-และ-trot-เกรด-1-5-ขาหน้า-และขาหลัง": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--walk-และ-trot-เกรด-1-5-ขาหน้า-และขาหลัง--v1",
          "statement": "อาการที่สม่ำเสมอที่สุดของขาหน้าเจ็บข้างเดียวคือ head nod: หัวและคอยกขึ้นเมื่อขาที่เจ็บลงน้ำหนัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-lameness-examination-in-horses-2024",
              "locator": "The Lameness Examination, recognition of lameness",
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
            "rationale": "The most consistent sign of a unilateral forelimb lameness is the head nod. The head and neck of the horse rise when the lame forelimb strikes the ground and is weightbearing, and they fall when the sound limb strikes the ground."
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--การคลำทีละส่วน-และ-manipulative-tests": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--การคลำทีละส่วน-และ-manipulative-tests--v1",
          "statement": "Flexion test ขาหลังงอขาค้างไว้ 30-60 วินาทีแล้วให้ trot ออกทันทีเพื่อดูว่าอาการเจ็บเกิดหรือเด่นขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-lameness-examination-in-horses-2024",
              "locator": "The Lameness Examination, flexion tests",
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
            "rationale": "The limb is flexed for 30–60 seconds and the horse is trotted away from the examiner to determine whether lameness is created or accentuated."
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--imaging-และการตรวจเสริม": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--imaging-และการตรวจเสริม--v1",
          "statement": "Nuclear medicine (scintigraphy) ให้ข้อมูลเชิงหน้าที่ของ bone turnover การไหลเวียนเลือด และการอักเสบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42527218",
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
            "rationale": "Equine nuclear medicine provides functional information on bone turnover, perfusion, inflammation and tracer biodistribution."
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--diagnostic-analgesia-หลักการ-ยาชา-และกลยุทธ์": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--diagnostic-analgesia-หลักการ-ยาชา-และกลยุทธ์--v1",
          "statement": "Diagnostic regional anesthesia ใช้หาตำแหน่งที่เจ็บเมื่อรู้ว่าเจ็บที่ขาข้างใดแต่ยังไม่รู้ตำแหน่งบนขา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-lameness-examination-in-horses-2024",
              "locator": "The Lameness Examination, diagnostic regional anesthesia",
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
            "rationale": "Diagnostic regional anesthesia should be used to determine the area of pain whenever the lameness can be localized to a specific limb but not to a specific site on the limb"
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--บล็อกขาหน้า-และแผนผังแปลผลบล็อกปลายขา": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--บล็อกขาหน้า-และแผนผังแปลผลบล็อกปลายขา--v1",
          "statement": "การบล็อกที่ปลายขาหน้าทำได้ทั้ง perineural (palmar digital หรือ abaxial sesamoid), DIP joint และ navicular bursa และใช้เปรียบเทียบผลกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8467786",
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
            "rationale": "Analgesia of the distal interphalangeal (DIP) joint and of the navicular bursa was performed independently in the lame or lamer forelimb of 59 horses, in which lameness was significantly improved by perineural analgesia of either the palmar digital or palmar (abaxial sesamoid) nerves."
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--บล็อกขาหลัง-และ-local-infiltration": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--บล็อกขาหลัง-และ-local-infiltration--v1",
          "statement": "ขาหลังใช้ perineural analgesia ของ tibial และ fibular nerve ร่วมกับ intra-articular analgesia (tarsocrural) เพื่อหาตำแหน่งที่เจ็บ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15779631",
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
            "rationale": "Tarsocrural joint analgesia produced improvement in lameness in 6/11 horses (55%) and perineural analgesia of the tibial and fibular nerves complete soundness in 6/14 horses (43%) in which it was performed"
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--แปลผลบล็อก-ผลลบลวง-และผลบวกลวง": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--แปลผลบล็อก-ผลลบลวง-และผลบวกลวง--v1",
          "statement": "perineural analgesia ไม่แม่นพอจะแยกความเจ็บที่มาจาก DIP joint ออกจาก navicular bursa จึงต้องแปลผลบล็อกอย่างระวัง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35488427",
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
            "rationale": "Our results suggest that perineural analgesia is not reliable enough to differentiate pain originating from DIPJ and NB."
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--ข้อควรระวังอื่น-และกรณีที่ไม่ควรบล็อก": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--ข้อควรระวังอื่น-และกรณีที่ไม่ควรบล็อก--v1",
          "statement": "ไม่ควรทำ diagnostic regional anesthesia เมื่อสงสัยกระดูกหัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-lameness-examination-in-horses-2024",
              "locator": "The Lameness Examination, fracture caution",
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
            "rationale": "Similarly, diagnostic regional anesthesia should not be performed when a fracture is suspected."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-hoof": {
    "equine-medicine--equine-hoof--กายวิภาคของกีบ": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--กายวิภาคของกีบ--v1",
          "statement": "กีบมี dermal (sensitive) และ epidermal (insensitive) laminae เชื่อมกันเหมือนซิป ยึด bony column กับ hoof capsule",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-laminitis-in-horses-2024",
              "locator": "first paragraph",
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
            "rationale": "The bony column of the limb of the horse is suspended from the inside of the hoof capsule by interlocking dermal and epidermal laminae. ... In laminitis, a series of pathophysiological events causes injury to dermal (sensitive) and epidermal (insensitive) laminae, weakening this attachment."
          }
        }
      ]
    },
    "equine-medicine--equine-hoof--hoof-balance": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--hoof-balance--v1",
          "statement": "ความผิดปกติของ hoof/pastern axis, มุมกีบไม่เท่ากัน และ under-run, contracted, sheared heels พบบ่อยกว่าในม้าที่ขาเจ็บเมื่อเทียบกับม้าปกติ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-lameness-examination-in-horses-2024",
              "locator": "Examination at rest, hoof examination",
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
            "rationale": "A number of abnormalities such as an abnormal hoof/pastern axis; mismatched hoof angles; under-run, contracted, and sheared heels; and disproportionate hoof size are seen more frequently in lame than in sound horses."
          }
        }
      ]
    },
    "equine-medicine--equine-hoof--deformities-ของขาในลูกม้า-dods": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--deformities-ของขาในลูกม้า-dods--v1",
          "statement": "Flexural deformity วินิจฉัยจากการที่ digit, fetlock หรือ carpus เหยียดหรืองอมากเกิน (hyperextension หรือ hyperflexion)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-flexural-deformities-in-horses-2025",
              "locator": "introduction",
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
            "rationale": "The diagnosis is apparent on clinical examination, based on hyperextension or hyperflexion of the digit, fetlock, or carpus."
          }
        }
      ]
    },
    "equine-medicine--equine-hoof--โรคของ-hoof-capsule-ภายนอก": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--โรคของ-hoof-capsule-ภายนอก--v1",
          "statement": "White line disease คือภาวะ keratolytic ของชั้นลึกของ stratum medium ในผนังกีบ ทำให้ผนังกีบแยกตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-white-line-disease-in-horses-2024",
              "locator": "introduction",
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
            "rationale": "White line disease in horses is a keratolytic condition affecting the deeper layers of the stratum medium of the hoof wall."
          }
        }
      ]
    },
    "equine-medicine--equine-hoof--โรคของโครงสร้างภายในกีบ-และ-subsolar-abscess": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--โรคของโครงสร้างภายในกีบ-และ-subsolar-abscess--v1",
          "statement": "ความเจ็บของ hoof abscess มาจากแรงดันที่เพิ่มขึ้นเร็วภายในโพรงกีบที่ยืดหยุ่นน้อย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-hoof-abscesses-in-horses-2024",
              "locator": "Etiology and Pathophysiology",
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
            "rationale": "The pain that is responsible for the lameness associated with hoof abscesses in horses is due to the rapid increase in pressure within the low-compliance environment of the hoof capsule."
          }
        }
      ]
    },
    "equine-medicine--equine-hoof--laminitis-นิยาม-สาเหตุ-และระยะ": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--laminitis-นิยาม-สาเหตุ-และระยะ--v1",
          "statement": "Laminitis คือการอักเสบและการแยกของ laminae ของกีบ สาเหตุในม้ารวมถึง carbohydrate overload, น้ำหนักที่ลงขามากเกิน และ endotoxemia",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-laminitis-in-horses-2024",
              "locator": "introduction",
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
            "rationale": "Laminitis is the inflammation and subsequent separation of the laminae of the hoof. Causes in horses include carbohydrate overload, excess weight bearing, and endotoxemia."
          }
        }
      ]
    },
    "equine-medicine--equine-hoof--laminitis-การรักษาตามช่วงเวลา": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--laminitis-การรักษาตามช่วงเวลา--v1",
          "statement": "ยาที่ใช้รักษา laminitis เพื่อรักษาเลือดมาเลี้ยงเท้า ได้แก่ acepromazine และยาอื่น ส่วน NSAIDs ใช้จัดการความปวดและการอักเสบเป็นหลัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-laminitis-in-horses-2024",
              "locator": "Treatment",
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
            "rationale": "Drugs administered to help maintain or improve the blood supply to the foot include acepromazine, pentoxifylline, isoxsuprine, aspirin, and heparin. NSAIDs are most commonly used to manage pain and inflammation."
          }
        }
      ]
    },
    "equine-medicine--equine-hoof--conformation-ของกีบ-และ-hoof-tester-ตอนตรวจขาเจ็บ": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--conformation-ของกีบ-และ-hoof-tester-ตอนตรวจขาเจ็บ--v1",
          "statement": "Hoof tester ใช้กดโครงสร้างภายในโพรงกีบเพื่อหาจุดที่เจ็บ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-lameness-examination-in-horses-2024",
              "locator": "Figure caption: Applying hoof testers",
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
            "rationale": "Hoof testers are used to compress structures inside the hoof capsule to detect pain."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-tendon": {
    "equine-medicine--equine-tendon--อุบัติการณ์-และเอ็นที่บาดเจ็บบ่อย": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--อุบัติการณ์-และเอ็นที่บาดเจ็บบ่อย--v1",
          "statement": "Tendinitis พบบ่อยที่สุดในม้าที่ใช้งานวิ่งเร็ว โดยเฉพาะม้าแข่ง และการบาดเจ็บของ SDFT พบบ่อยที่ขาหน้าของ Thoroughbred",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tendinitis-in-horses-2025",
              "locator": "introduction",
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
            "rationale": "Tendinitis is the most common in horses used for fast work, particularly racehorses. Superficial digital flexor tendon (SDFT) injuries commonly occur in the forelimb of Thoroughbred racehorses."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--โครงสร้าง-histology-และ-physiology-ของ-tendon": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--โครงสร้าง-histology-และ-physiology-ของ-tendon--v1",
          "statement": "โครงสร้างและการเรียงตัวตามแนวแกนของ type I collagen fibrils สำคัญต่อ tensile strength ของ tendon และ tenocytes สร้างและรักษา extracellular matrix",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16005620",
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
            "rationale": "The structure and organisation of the extracellular matrix, and in particular the axial alignment of type I collagen fibrils, are essential for the tensile strength of tendons. The resident tenocytes synthesize and maintain the composition of the extracellular matrix"
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--สาเหตุ-พยาธิกำเนิด-และระยะการซ่อม": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--สาเหตุ-พยาธิกำเนิด-และระยะการซ่อม--v1",
          "statement": "SDFT tendinitis มักเกิดหลังออกกำลังเร็ว สัมพันธ์กับ overextension, สภาพร่างกายไม่พร้อม, ความล้า และการฝึกต่อเนื่องทั้งที่ tendon อักเสบอยู่แล้ว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tendinitis-in-horses-2025",
              "locator": "Etiology",
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
            "rationale": "SDFT tendinitis in horses usually appears after fast exercise and is associated with overextension and poor conditioning, fatigue, poor racetrack conditions, and persistent training when inflammatory problems in the tendon already exist."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--อาการ-การวินิจฉัย-และเทคนิค-ultrasound": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--อาการ-การวินิจฉัย-และเทคนิค-ultrasound--v1",
          "statement": "Ultrasonography (probe เชิงเส้นความถี่สูง 7.5-15 MHz) เป็นเครื่องมือที่ใช้บ่อยที่สุดเพื่อบันทึกการบาดเจ็บของ tendon ในม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tendinitis-in-horses-2025",
              "locator": "Diagnosis",
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
            "rationale": "Ultrasonography (high-frequency [7.5–15 MHz] linear probes) is the most commonly used and available diagnostic tool for documenting tendon injury in horses."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--ภาพ-ultrasound-acute-ระหว่างหาย-และ-chronic": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--ภาพ-ultrasound-acute-ระหว่างหาย-และ-chronic--v1",
          "statement": "ภาพ ultrasound ของ tendon บาดเจ็บเห็น tendon โตขึ้น, hypoechogenicity เฉพาะที่หรือทั่วเส้น และ fiber ขาดหรือ remodel ในระดับต่างกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tendinitis-in-horses-2025",
              "locator": "Diagnosis",
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
            "rationale": "Tendon enlargement, focal or generalized hypoechogenicity, and varying degrees of tendon fiber disruption or remodeling can be visualized."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--recurrence": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--recurrence--v1",
          "statement": "การศึกษาใน 219 ตัวพบ reinjury rate ของ SDF tendonitis ที่ขาที่รักษา 42.5-44.4% ในกลุ่มที่ใช้ controlled exercise อย่างเดียว หรือเสริม hyaluronan หรือ PSGAG",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15253082",
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
            "rationale": "There was no significant difference in reinjury rate of the treated limb(s) between Groups A, B, Ci and Cii (42.5-44.4%) (P>0.9)."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--suspensory-ligament-3-syndromes": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--suspensory-ligament-3-syndromes--v1",
          "statement": "รอยโรคของ suspensory ligament แบ่งตามตำแหน่งเป็น proximal region, body และ branches",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-suspensory-desmitis-in-horses-2025",
              "locator": "introduction",
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
            "rationale": "Lesions are typically classified as affecting the proximal region, body, or branches of the suspensory ligament."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--inferior-check-ligament-icl-desmitis": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--inferior-check-ligament-icl-desmitis--v1",
          "statement": "การบาดเจ็บของ inferior check ligament พบน้อยในม้าแข่งแต่พบบ่อยใน ponies และ warmblood",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-inferior-check-ligament-desmitis-in-horses-2025",
              "locator": "introduction",
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
            "rationale": "Injury of the ICL is relatively uncommon in racehorses but is common in ponies and warmblood breeds."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--หลักการรักษา-และการประเมินคุณภาพการหาย": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--หลักการรักษา-และการประเมินคุณภาพการหาย--v1",
          "statement": "tendon หายช้า และเนื้อซ่อมมักมีความแข็งแรงเชิงกลด้อยกว่า tendon เดิมเพราะ collagen เรียงตัวไม่เป็นระเบียบเมื่อเกิด scar",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tendon-disorders-in-animals-2026",
              "locator": "introduction",
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
            "rationale": "However, because of this relatively poor blood supply, tendon healing can be prolonged, and the resultant repair tissue is usually of inferior mechanical strength compared to the original, uninjured tendon. This weakening is due to the rearrangement of collagen fibers in a less organized fashion as scar tissue forms."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--conservative-treatment-และโปรแกรม-controlled-exercise": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--conservative-treatment-และโปรแกรม-controlled-exercise--v1",
          "statement": "Tendinitis รักษาได้ผลดีที่สุดในระยะ acute: พักคอก ประคบเย็น และให้ยาต้านการอักเสบทั้งระบบอย่างเข้มข้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tendinitis-in-horses-2025",
              "locator": "Treatment",
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
            "rationale": "Tendinitis in horses is best treated in the early, acute stage. The horse should be stall-rested, and the swelling and inflammation should be treated aggressively with cold packs and systemic anti-inflammatory agents."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--physical-therapies-counter-irritation-และศัลยกรรม": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--physical-therapies-counter-irritation-และศัลยกรรม--v1",
          "statement": "การรักษา tendinitis เรื้อรังที่เคยใช้ ได้แก่ superficial point firing (ประโยชน์น่าสงสัย) และ percutaneous tendon splitting",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tendinitis-in-horses-2025",
              "locator": "Treatment",
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
            "rationale": "Other treatments for chronic tendinitis in horses have included superficial point firing (which is of questionable benefit) and percutaneous tendon splitting."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--ยาฉีดเข้ารอยโรค-growth-factors-และ-stem-cells": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--ยาฉีดเข้ารอยโรค-growth-factors-และ-stem-cells--v1",
          "statement": "การฉีด corticosteroid เข้าใน tendon เป็นข้อห้าม เพราะยับยั้งกลไกการซ่อม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tendinitis-in-horses-2025",
              "locator": "Treatment, Pearls & Pitfalls",
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
            "rationale": "Intratendinous corticosteroid injections are contraindicated because they inhibit repair mechanisms."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-anesthesia": {
    "equine-medicine--equine-anesthesia--ทำไมการวางยาม้าจึงต่างออกไป": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--ทำไมการวางยาม้าจึงต่างออกไป--v1",
          "statement": "หลังวางยาสลบม้าอาจเกิด myopathy จาก hypoperfusion ของกล้ามเนื้อที่ถูกกดทับ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-traumatic-toxic-and-anesthetic-myopathies-in-horses-2026",
              "locator": "Postanesthetic Myopathy",
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
            "rationale": "After anesthesia, horses may develop severe muscle pain and weakness in one or more muscle groups. Hypoperfusion of compressed muscle groups with resultant high intracompartmental pressure is the most important causative factor for focal muscle involvement."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--ประเมินก่อนวางยา": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--ประเมินก่อนวางยา--v1",
          "statement": "ในการศึกษา CEPEF4 (ม้า 47,396 ตัว) odds ของการตายเพิ่มขึ้นใน ASA grade สูงขึ้นและหัตถการเร่งด่วน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40695694",
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
            "rationale": "Logistic regression analyses revealed an increase in the odds of death for pregnant mares, geriatrics, thin horses, those with a higher American Society of Anesthesiologists grade, urgent procedures and those lasting < 1 hour or > 2 hours."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--เลือก-standing-หรือ-general-anesthesia": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--เลือก-standing-หรือ-general-anesthesia--v1",
          "statement": "standing sedation เป็นทางเลือกที่ปลอดภัยและคุ้มค่ากว่า general anesthesia ในม้า แต่ต้องให้ยาพอบล็อก stimulus response โดยไม่ทำให้ ataxia หรือล้มนอน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41200548",
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
            "rationale": "Standing sedation is a safe and cost-effective alternative to general anesthesia in horses, but challenges include achieving adequate drug effect to block the stimulus response without inducing ataxia or recumbency."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--sedation-alpha-2-agonists-และ-tranquilizers": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--sedation-alpha-2-agonists-และ-tranquilizers--v1",
          "statement": "หลังใช้ acepromazine ในม้าพบ penile prolapse ค้างได้ และเสี่ยงมากขึ้นเมื่อโดสสูง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tranquilizers-sedatives-and-analgesics-for-treatment-of",
              "locator": "Acepromazine, Pearls & Pitfalls",
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
            "rationale": "In horses, persistent penile prolapse has been reported after the use of acepromazine and might depend on the dose, with higher doses being associated with increased risk."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--opioids-neuroleptanalgesia-guaifenesin-และยาชาเฉพาะที่": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--opioids-neuroleptanalgesia-guaifenesin-และยาชาเฉพาะที่--v1",
          "statement": "การเติม butorphanol และ midazolam ขนาดต่ำเข้ากับ detomidine CRI ทำให้ sedation เพิ่มขึ้นเป็นขั้นและ ataxia เพิ่มขึ้นด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41200548",
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
            "rationale": "the sequential addition of low-dose CRIs of butorphanol and midazolam to detomidine CRIs is associated with a stepwise increase in sedation and ataxia."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--induction-และ-intubation": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--induction-และ-intubation--v1",
          "statement": "งานเปรียบเทียบ induction ในม้าใช้ xylazine 1 mg/kg ร่วมกับ ketamine 2 mg/kg เป็น protocol มาตรฐานก่อนวางยา TIVA ด้วย guaifenesin-ketamine-xylazine",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42716191",
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
            "rationale": "randomly assigned to XC (xylazine 1 mg/kg and ketamine 2 mg/kg) or XCM (xylazine 0.5 mg/kg, ketamine 2 mg/kg, and midazolam 0.1 mg/kg). Anesthesia was maintained with continuous guaifenesin, ketamine, and xylazine infusion."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--ท่านอนและการป้องกันการบาดเจ็บ": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--ท่านอนและการป้องกันการบาดเจ็บ--v1",
          "statement": "ภาวะ arterial oxygen ต่ำเป็นภาวะแทรกซ้อนที่พบบ่อยในม้าที่วางยาสลบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33066990",
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
            "rationale": "Low arterial oxygen is a common complication in anesthetized horses"
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--maintenance-inhalant-mac-tiva-piva": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--maintenance-inhalant-mac-tiva-piva--v1",
          "statement": "ในม้า การคงสลบด้วย isoflurane หรือ sevoflurane ทำที่ความเข้มข้น 1.2 เท่าของ minimum alveolar concentration (MAC)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22126682",
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
            "rationale": "Anesthesia was maintained for 2 hours with isoflurane or sevoflurane at 1.2 times the minimum alveolar concentration"
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--monitoring": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--monitoring--v1",
          "statement": "ภาวะความดันต่ำระหว่างวางยาม้านิยามที่ MAP ต่ำกว่า 70 mmHg และแก้ด้วยสารน้ำและ dobutamine",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16476002",
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
            "rationale": "hypotension was redefined as MAP <70 mmHg, and was managed using high-volume fluid therapy and dobutamine"
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--ยาเสริม-inotropes-vasopressors-anticholinergics": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--ยาเสริม-inotropes-vasopressors-anticholinergics--v1",
          "statement": "ในม้าที่วางยาสลบด้วย isoflurane หรือ sevoflurane ใช้ dobutamine infusion เพื่อคงความดันให้ปกติ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22126682",
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
            "rationale": "Normotension was maintained via a dobutamine infusion."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--multimodal-analgesia-และ-nsaids": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--multimodal-analgesia-และ-nsaids--v1",
          "statement": "right dorsal colitis ทำให้ colic เรื้อรังและสัมพันธ์กับการใช้ NSAIDs ระยะยาวในม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38113643",
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
            "rationale": "Right dorsal colitis causes chronic colic associated with long-term treatment with nonsteroidal antiinflammatory drugs (NSAIDs)."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--recovery-และภาวะแทรกซ้อน": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--recovery-และภาวะแทรกซ้อน--v1",
          "statement": "กระดูกหักรุนแรง (catastrophic fracture) เป็นสาเหตุหลักของการตายช่วง recovery จากการวางยาสลบม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26970940",
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
            "rationale": "Catastrophic fractures, however, have become the greatest cause of recovery-associated mortality."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--การวางยาภาคสนาม-field-anesthesia": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--การวางยาภาคสนาม-field-anesthesia--v1",
          "statement": "โปรโตคอลวางยาภาคสนามในม้าต้องให้ระยะเวลาและความลึกพอ โดยไม่เสียความปลอดภัยหรือคุณภาพการฟื้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31965616",
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
            "rationale": "The ideal field anaesthetic protocol for castration will offer an adequate duration and depth of anaesthesia using a single injection without compromising safety or recovery quality."
          }
        }
      ]
    },
    "equine-medicine--equine-anesthesia--การุณยฆาต": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--การุณยฆาต--v1",
          "statement": "AAEP ยอมรับ potassium chloride หรือ magnesium sulfate เข้มข้นทางหลอดเลือดดำ เมื่อม้าอยู่ใน surgical plane ของ general anesthesia",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-euthanasia-guidelines-2026",
              "locator": "Acceptable euthanasia techniques list",
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
            "rationale": "A concentrated solution of either potassium chloride (intravenous) or magnesium sulfate (intravenous) with the horse in a surgical plane of general anesthesia."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-dentistry": {
    "equine-medicine--equine-dentistry--โครงสร้างฟันม้า-hypsodont-anisognathism-infundibulum-และ-dental-": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--โครงสร้างฟันม้า-hypsodont-anisognathism-infundibulum-และ-dental---v1",
          "statement": "ฟัน cheek teeth ของม้าเป็น hypsodont มี crown ยาวที่ถูก coronal cementum คลุมทั้งหมดตั้งแต่ฟันขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24470439",
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
            "rationale": "they possess long crowns that are completely covered by coronal cement at eruption"
          }
        }
      ]
    },
    "equine-medicine--equine-dentistry--สูตรฟัน-และศัพท์บอกด้านของฟัน": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--สูตรฟัน-และศัพท์บอกด้านของฟัน--v1",
          "statement": "wolf tooth คือ premolar ซี่แรกของม้า ซึ่งเป็นฟันเหลือร่องรอยที่ไม่มีบทบาทในการเคี้ยว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31547760",
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
            "rationale": "The equine first premolar is now considered a vestigial tooth that does not play a role in mastication."
          }
        }
      ]
    },
    "equine-medicine--equine-dentistry--ระบบเรียกชื่อฟัน-3-ระบบ-anatomical-cheek-teeth-modified-triadan": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--ระบบเรียกชื่อฟัน-3-ระบบ-anatomical-cheek-teeth-modified-triadan--v1",
          "statement": "ในระบบ Triadan เลข 108 คือ premolar ซี่ที่ 4 ด้านขวาบน (หลักแรก 1 = upper right, 08 = premolar 4)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41457381",
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
            "rationale": "the right permanent fourth premolar (Triadan 108)"
          }
        }
      ]
    },
    "equine-medicine--equine-dentistry--การคะเนอายุจากฟัน-หลักการ-และฟันน้ำนม": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--การคะเนอายุจากฟัน-หลักการ-และฟันน้ำนม--v1",
          "statement": "การประมาณอายุม้าจากฟันไม่เคยแม่นยำ เพราะแต่ละตัวต่างกันมาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8533255",
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
            "rationale": "the estimation of age from dentition can never be precise"
          }
        }
      ]
    },
    "equine-medicine--equine-dentistry--การคะเนอายุ-ฟันแท้ตั้งแต่-2-ปีครึ่งถึงม้าแก่": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--การคะเนอายุ-ฟันแท้ตั้งแต่-2-ปีครึ่งถึงม้าแก่--v1",
          "statement": "การขึ้นของฟันตัดเป็นลักษณะที่คงเส้นคงวาที่สุดในการคะเนอายุ แต่ไม่น่าเชื่อถือสมบูรณ์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8533255",
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
            "rationale": "The eruption of the incisor teeth was the most consistent feature but it was not totally reliable."
          }
        }
      ]
    },
    "equine-medicine--equine-dentistry--การตรวจช่องปาก-อุปกรณ์-sedation-ประวัติ-และการตรวจภายนอก": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--การตรวจช่องปาก-อุปกรณ์-sedation-ประวัติ-และการตรวจภายนอก--v1",
          "statement": "การตรวจช่องปากม้าอย่างครบถ้วนทำภายใต้ sedation และใช้ full-mouth speculum",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17286128",
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
            "rationale": "All horses were sedated and a full-mouth speculum was used to facilitate a complete oral examination."
          }
        }
      ]
    },
    "equine-medicine--equine-dentistry--การตรวจในช่องปาก-ความถี่การตรวจ-และกฎการวินิจฉัย": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--การตรวจในช่องปาก-ความถี่การตรวจ-และกฎการวินิจฉัย--v1",
          "statement": "ม้าที่ปล่อยแทะหญ้าตามแปลงมักต้องทำฟันปีละครั้ง ส่วนม้าที่เลี้ยงในคอกกินหญ้าแห้งและอาหารเม็ดอาจต้องตรวจช่องปากและทำฟันปีละสองครั้ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-overview-of-general-dentistry-in-horses-2024",
              "locator": "Routine Dental Prophylaxis and Extractions",
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
            "rationale": "Horses that graze on free range or grass usually require yearly dental prophylaxis; horses that are confined to stalls and essentially fed hay and grain may require twice-yearly oral examinations and dental prophylaxis."
          }
        }
      ]
    },
    "equine-medicine--equine-dentistry--ความผิดปกติของฟันม้า": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--ความผิดปกติของฟันม้า--v1",
          "statement": "sharp enamel point เกิดที่ขอบ buccal ของฟันบนและขอบ lingual ของฟันล่าง และแก้ด้วยการตะไบฟัน (floating)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-irregular-wear-of-the-dentition-in-horses-2024",
              "locator": "Irregular wear of the dentition",
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
            "rationale": "results in the development of enamel points on the buccal edges of the upper arcades and on the lingual edges of the lower arcades. Enamel points are best treated by regular dental equilibration (ie, teeth floating)."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-gi": {
    "equine-medicine--equine-gi--กายวิภาคและเส้นทางของอาหาร": {
      "claims": [
        {
          "id": "equine-medicine--equine-gi--กายวิภาคและเส้นทางของอาหาร--v1",
          "statement": "ม้าไม่มีถุงน้ำดี น้ำดีหลั่งตรงจากตับ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-digestive-system-2024",
              "locator": "Small intestine",
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
            "rationale": "Bile is continuously secreted by the liver as the horse doesn’t have a gall bladder in which to store it."
          }
        }
      ]
    },
    "equine-medicine--equine-gi--การตรวจ-ฟัง-gut-sound-4-ตำแหน่ง": {
      "claims": [
        {
          "id": "equine-medicine--equine-gi--การตรวจ-ฟัง-gut-sound-4-ตำแหน่ง--v1",
          "statement": "การไม่ได้ยินเสียงลำไส้อาจบ่งชี้การเคลื่อนไหวของลำไส้บกพร่องหรือเลือดไปเลี้ยงไม่พอ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-colic-in-horses-2026",
              "locator": "The Veterinarian's Examination of a Horse with Colic (table), auscultation",
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
            "rationale": "Lack of sounds may indicate impaired motility or blood flow."
          }
        }
      ]
    },
    "equine-medicine--equine-gi--การตรวจ-ultrasound-radiography-และ-rectal-palpation": {
      "claims": [
        {
          "id": "equine-medicine--equine-gi--การตรวจ-ultrasound-radiography-และ-rectal-palpation--v1",
          "statement": "FLASH เป็นโปรโตคอลอัลตราซาวด์ช่องท้องที่ตำแหน่งภายนอก 7 จุดในม้า colic ซึ่งเห็นของเหลวอิสระและลำไส้ผิดปกติได้ และสัตวแพทย์ที่ไม่ชำนาญก็ใช้ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20347357",
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
            "rationale": "FLASH was able to show free abdominal fluid and abnormal intestinal loops, with a mean time of 10.7 min required to complete the protocol."
          }
        }
      ]
    },
    "equine-medicine--equine-gi--choke-และ-equine-gastric-ulcer-syndrome-egus": {
      "claims": [
        {
          "id": "equine-medicine--equine-gi--choke-และ-equine-gastric-ulcer-syndrome-egus--v1",
          "statement": "EGUS เป็นคำรวมของรอยโรคที่หลอดอาหารส่วนปลาย กระเพาะส่วน nonglandular และ glandular และ duodenum ส่วนต้น และการส่องกล้องกระเพาะตอนท้องว่างเป็นวิธีวินิจฉัยที่ชัดเจนเพียงวิธีเดียว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-gastric-ulcers-in-horses-2026",
              "locator": "Gastric Ulcers in Horses, Overview and Diagnosis",
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
            "rationale": "Gastroscopic visualization of the ulcers in an empty stomach is the only definitive method of diagnosis."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-colic-bestfit": {
    "equine-medicine--equine-colic-bestfit--colic-คืออะไร-สาเหตุโน้มนำ-และอาการ": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--colic-คืออะไร-สาเหตุโน้มนำ-และอาการ--v1",
          "statement": "Colic เป็นคำกว้างสำหรับภาวะที่ทำให้ม้าปวดท้อง และอาการที่พบบ่อยได้แก่ ขุดพื้นด้วยเท้าหน้า หันมองสีข้าง นอนและกลิ้ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-colic-in-horses-2026",
              "locator": "Colic in Horses, introduction and signs",
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
            "rationale": "colic has become a broad term for a variety of conditions that cause horses to experience abdominal pain."
          }
        }
      ]
    },
    "equine-medicine--equine-colic-bestfit--ค่าปกติ-และ-lactate-บอกความรุนแรง": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--ค่าปกติ-และ-lactate-บอกความรุนแรง--v1",
          "statement": "lactate ในเลือดสูงขึ้นหลักๆ จาก anaerobic tissue metabolism เมื่อ oxygen delivery ไม่พอ และเกิดร่วมกับ sepsis และการอักเสบรุนแรงได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22180135",
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
            "rationale": "Anaerobic tissue metabolism resulting from inadequate oxygen delivery (DO2) is the most important cause of an increase in blood lactate concentration in equine patients."
          }
        }
      ]
    },
    "equine-medicine--equine-colic-bestfit--ng-tube-ตรวจและรักษาในตัว": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--ng-tube-ตรวจและรักษาในตัว--v1",
          "statement": "การใส่สายผ่านจมูกลงกระเพาะระบายแก๊สหรือของเหลวได้ เพราะม้าอาเจียนไม่ได้ และ reflux มากกว่า 4 ลิตรเป็นหนึ่งในข้อบ่งชี้ผ่าตัด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-colic-in-horses-2026",
              "locator": "Colic in Horses, stomach tube; indications for surgery",
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
            "rationale": "Because horses cannot vomit, the tube can allow release of gas or fluid that would otherwise result in stomach rupture."
          }
        }
      ]
    },
    "equine-medicine--equine-colic-bestfit--rectal-palpation-และ-abdominocentesis": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--rectal-palpation-และ-abdominocentesis--v1",
          "statement": "การเจาะเก็บน้ำช่องท้องดู protein และเม็ดเลือดขาวบอกความเสียหายของลำไส้ได้ และ rectal examination ให้คลำลำไส้ ตำแหน่งและเนื้อหาในลำไส้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-colic-in-horses-2026",
              "locator": "The Veterinarian's Examination of a Horse with Colic (table)",
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
            "rationale": "Composition (protein and white blood cells) can reveal extent of intestinal damage."
          }
        }
      ]
    },
    "equine-medicine--equine-colic-bestfit--composite-colic-score-ccs-และการตัดสินทางรักษา": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--composite-colic-score-ccs-และการตัดสินทางรักษา--v1",
          "statement": "ข้อบ่งชี้ผ่าตัดในม้า colic ได้แก่ ปวดคุมไม่ได้ ของเหลวจากสายกระเพาะมากกว่า 4 ลิตร ไม่ได้ยินเสียงลำไส้ ผลน้ำช่องท้องผิดปกติ หรือพบการอุดตัน/เคลื่อนที่จาก rectal examination",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-colic-in-horses-2026",
              "locator": "Colic in Horses, surgery",
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
            "rationale": "more than 4 liters of fluid retrieved from the stomach tube no intestinal sounds heard with a stethoscope abnormalities within a fluid sample from the abdomen"
          }
        }
      ]
    },
    "equine-medicine--equine-colic-bestfit--การรักษาทางยา-fluid-และการพาเดิน": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--การรักษาทางยา-fluid-และการพาเดิน--v1",
          "statement": "ม้า colic หลายตัวได้ประโยชน์จากการให้สารน้ำเพื่อป้องกัน dehydration โดยให้ผ่านสายกระเพาะหรือทางเส้นเลือด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-colic-in-horses-2026",
              "locator": "Fluid Treatment",
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
            "rationale": "Many horses with colic benefit from fluid treatment to prevent dehydration and maintain blood supply to the kidneys and other vital organs."
          }
        }
      ]
    },
    "equine-medicine--equine-colic-bestfit--การรักษาทางยา-ยาลดปวดและยาคลายกล้ามเนื้อเรียบ": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--การรักษาทางยา-ยาลดปวดและยาคลายกล้ามเนื้อเรียบ--v1",
          "statement": "ยาลดปวดในม้า colic ได้แก่ ยาต้านอักเสบ ยากล่อมประสาทที่ลดปวดด้วย และ narcotics และการใส่สายกระเพาะช่วยลดปวดจากการระบายของเหลวที่คั่ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-colic-in-horses-2026",
              "locator": "Colic in Horses, pain relief",
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
            "rationale": "Examples include anti-inflammatory drugs, sedatives that also reduce pain, and narcotics."
          }
        }
      ]
    },
    "equine-medicine--equine-colic-bestfit--common-colic-5-แบบ": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--common-colic-5-แบบ--v1",
          "statement": "Nephrosplenic entrapment คือ left dorsal displacement ของ large colon ที่จัดการได้ทั้งทางยา (conservative) และการผ่าตัด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39891548",
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
            "rationale": "Conservative and surgical management of left dorsal displacement and nephrosplenic ligament entrapment of the large colon (NSLE) is well described in horses."
          }
        }
      ]
    },
    "equine-medicine--equine-colic-bestfit--เมื่อไรควรพิจารณาการุณยฆาต": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--เมื่อไรควรพิจารณาการุณยฆาต--v1",
          "statement": "ในม้า colic พารามิเตอร์ทางคลินิกอย่าง heart rate, capillary refill time และสีเยื่อเมือกสัมพันธ์กับการตาย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19642409",
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
            "rationale": "Clinical parameters found to be significantly associated with death by univariate analysis were medical/surgical treatment, location of lesion, severity of lesion, mucous membrane colour (MM), capillary refill time (CRT) and heart rate."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-colic-surgery": {
    "equine-medicine--equine-colic-surgery--สัญญาณที่ชี้ว่าต้องผ่าตัดหรือส่งต่อ": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-surgery--สัญญาณที่ชี้ว่าต้องผ่าตัดหรือส่งต่อ--v1",
          "statement": "การตรวจน้ำในช่องท้อง (abdominocentesis) ช่วยให้สัตวแพทย์จัดการม้า colic ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35044063",
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
            "rationale": "Interpreting changes in peritoneal fluid helps clinicians manage colic and other diseases in horses."
          }
        }
      ]
    },
    "equine-medicine--equine-colic-surgery--งดอาหารก่อนและหลังผ่าตัดช่องท้อง": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-surgery--งดอาหารก่อนและหลังผ่าตัดช่องท้อง--v1",
          "statement": "มีการศึกษาเปรียบเทียบการงดอาหารรอบผ่าตัดในม้า (ไม่งด เทียบกับงด 10 ชม. ก่อนผ่า)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38866041",
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
            "rationale": "45 horses presenting for elective orthopedic procedures were randomly assigned to 1 of 3 groups: not fasted (NF; continuous access to hay perioperatively), fasted muzzled (FM; 10-hour preoperative fast with slow refeeding postoperatively and muzzle placement)"
          }
        }
      ]
    },
    "equine-medicine--equine-colic-surgery--เตรียมม้า-ผ่า-colon-และหลังผ่าตัด": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-surgery--เตรียมม้า-ผ่า-colon-และหลังผ่าตัด--v1",
          "statement": "ในม้าที่นอนหงาย (dorsal recumbency) การเคลื่อนของผนังอกถูกจำกัดและปอดถูกอวัยวะในช่องท้องกด ทำให้ alveoli ยุบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34359177",
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
            "rationale": "In dorsally recumbent horses, chest wall movement is restricted and the lungs are compressed by the abdominal organs, leading to the collapse of the alveoli."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-pythium": {
    "equine-medicine--equine-pythium--สาเหตุ-ชื่อเรียก-และการติดต่อ": {
      "claims": [
        {
          "id": "equine-medicine--equine-pythium--สาเหตุ-ชื่อเรียก-และการติดต่อ--v1",
          "statement": "Pythiosis ในม้าเกิดจาก Pythium insidiosum เป็นโรค granulomatous เรื้อรังที่มีแผลที่ผิวหนัง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42558222",
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
            "rationale": "Pythiosis, caused by Pythium insidiosum, is a chronic granulomatous disease of horses characterized by invasive, ulcerative, and pyogranulomatous cutaneous lesions."
          }
        }
      ]
    },
    "equine-medicine--equine-pythium--อาการและลักษณะแผล": {
      "claims": [
        {
          "id": "equine-medicine--equine-pythium--อาการและลักษณะแผล--v1",
          "statement": "Pythiosis ผิวหนังพบบ่อยที่สุดในม้า มักเป็นแผลเดี่ยวที่บริเวณขา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38967702",
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
            "rationale": "Cutaneous pythiosis was the most prevalent form, generally presenting as single lesions in the appendicular region"
          }
        }
      ]
    },
    "equine-medicine--equine-pythium--การวินิจฉัย": {
      "claims": [
        {
          "id": "equine-medicine--equine-pythium--การวินิจฉัย--v1",
          "statement": "ตรวจ anti-P. insidiosum IgG ด้วย immunochromatographic test (ICT) ใช้วินิจฉัย pythiosis ในคนและสัตว์ รวมถึงม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27118800",
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
            "rationale": "This study aims to develop an immunochromatographic test (ICT), using the bacterial protein A/G, to detect anti-P. insidiosum IgGs in humans and animals"
          }
        }
      ]
    },
    "equine-medicine--equine-pythium--การรักษาและความปลอดภัยของผู้ทำแผล": {
      "claims": [
        {
          "id": "equine-medicine--equine-pythium--การรักษาและความปลอดภัยของผู้ทำแผล--v1",
          "statement": "การรักษา pythiosis ในม้าที่พบบ่อยที่สุดคือการผ่าตัด มักร่วมกับ chemotherapy และ immunotherapy",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38967702",
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
            "rationale": "Various treatments have been employed, with surgery, often combined with chemotherapy and immunotherapy, being the most common."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-ophth": {
    "equine-medicine--equine-ophth--orbit-การมองเห็น-และ-reflex": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--orbit-การมองเห็น-และ-reflex--v1",
          "statement": "ม้ามี binocular overlap ที่ชี้ลงตามแนวจมูก และมีจุดบอดตรงหน้าหน้าผาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10505953",
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
            "rationale": "binocular overlap is oriented down the nose, with a blind area directly in front of the forehead."
          }
        }
      ]
    },
    "equine-medicine--equine-ophth--เปลือกตา-eyelid": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--เปลือกตา-eyelid--v1",
          "statement": "การซ่อมเปลือกตา (eyelid repair) เป็นหัตถการ standing ที่พบบ่อยในเวชปฏิบัติม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34119404",
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
            "rationale": "common standing surgical procedures such as eyelid repair or instillation of a subpalpebral lavage system"
          }
        }
      ]
    },
    "equine-medicine--equine-ophth--conjunctiva-และท่อน้ำตา": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--conjunctiva-และท่อน้ำตา--v1",
          "statement": "Nasolacrimal duct atresia ในม้ามีขี้ตาเป็นหนองเรื้อรัง และไม่มีรูเปิดท่อน้ำตาในโพรงจมูก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24666475",
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
            "rationale": "The nasolacrimal orifice was absent in the left nasal meatum, and anterograde irrigation of left nasolacrimal duct was not possible."
          }
        }
      ]
    },
    "equine-medicine--equine-ophth--กระจกตา-cornea-กายวิภาค-การตรวจ-และหลักการ": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--กระจกตา-cornea-กายวิภาค-การตรวจ-และหลักการ--v1",
          "statement": "การตรวจผิวตาม้าแนะนำให้ย้อม fluorescein และ Rose Bengal",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11397288",
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
            "rationale": "slit-lamp examination of the ocular surface before and after fluorescein dye application is recommended to detect dry eye problems. Rose Bengal dye application is also recommended in many cases."
          }
        }
      ]
    },
    "equine-medicine--equine-ophth--keratitis-และการรักษากระจกตา": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--keratitis-และการรักษากระจกตา--v1",
          "statement": "sub-palpebral lavage system มีภาวะแทรกซ้อน โดยที่พบบ่อยที่สุดคือ footplate หลุดจาก conjunctival fornix",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40567141",
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
            "rationale": "The most common major complication was displacement of the lavage footplate from the conjunctival fornix (7/69; 10%)."
          }
        }
      ]
    },
    "equine-medicine--equine-ophth--squamous-cell-carcinoma-ของตาและ-adnexa": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--squamous-cell-carcinoma-ของตาและ-adnexa--v1",
          "statement": "UV exposure มีส่วนทำให้เกิด squamous cell carcinoma ของตาม้า ผ่านการกลายพันธุ์ของ TP53",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41748902",
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
            "rationale": "TP53 mutations appear to contribute to eoSCC development, potentially as a consequence of UV-light exposure"
          }
        }
      ]
    },
    "equine-medicine--equine-ophth--uvea-uveitis-และ-equine-recurrent-uveitis-eru": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--uvea-uveitis-และ-equine-recurrent-uveitis-eru--v1",
          "statement": "Recurrent uveitis เป็นสาเหตุนำของตาบอดในม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7591929",
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
            "rationale": "Recurrent uveitis, a leading cause of blindness in horses, often develops as a sequela to systemic leptospirosis."
          }
        }
      ]
    },
    "equine-medicine--equine-ophth--เลนส์-ต้อกระจก-และ-glaucoma": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--เลนส์-ต้อกระจก-และ-glaucoma--v1",
          "statement": "Transscleral cyclophotocoagulation ด้วย diode laser ลด IOP ในม้าที่เป็น glaucoma",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20500721",
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
            "rationale": "IOP remained significantly lower than pretreatment values at all periods of clinical follow-up"
          }
        }
      ]
    },
    "equine-medicine--equine-ophth--retina-equine-fundus-และโรคของ-retina": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--retina-equine-fundus-และโรคของ-retina--v1",
          "statement": "ม้ามีหลอดเลือด retina ขนาดเล็กอยู่เฉพาะบริเวณใกล้ optic disc (paurangiotic pattern)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-2772405",
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
            "rationale": "In the horse and the guinea pig the retinal blood vessels are minute and restricted to the direct neighbourhood of the optic disc (paurangiotic pattern)."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-neonatal": {
    "equine-medicine--equine-neonatal--อายุครรภ์-และนมน้ำเหลืองกับการรับภูมิคุ้มกัน": {
      "claims": [
        {
          "id": "equine-medicine--equine-neonatal--อายุครรภ์-และนมน้ำเหลืองกับการรับภูมิคุ้มกัน--v1",
          "statement": "Colostrum คุณภาพดีมีลักษณะเหนียว สีเหลือง ข้น และมี specific gravity > 1.060 ในแม่ม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-failure-of-transfer-of-passive-immunity-in-large-animals",
              "locator": "Overview",
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
            "rationale": "Good-quality colostrum tends to be sticky, yellow, and thick with a specific gravity of > 1.060 in mares."
          }
        }
      ]
    },
    "equine-medicine--equine-neonatal--ระยะคลอดในส่วนที่เกี่ยวกับลูกม้า": {
      "claims": [
        {
          "id": "equine-medicine--equine-neonatal--ระยะคลอดในส่วนที่เกี่ยวกับลูกม้า--v1",
          "statement": "รกม้า (fetal membranes) โดยปกติถูกขับออกภายใน 3 ชั่วโมงหลังคลอด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-retained-fetal-membranes-in-mares-2022",
              "locator": "Overview",
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
            "rationale": "Equine fetal membranes are normally expelled within 3 hours after parturition"
          }
        }
      ]
    },
    "equine-medicine--equine-neonatal--การดูแลลูกม้าหลังคลอดทันที": {
      "claims": [
        {
          "id": "equine-medicine--equine-neonatal--การดูแลลูกม้าหลังคลอดทันที--v1",
          "statement": "ลูกม้าน้ำหนัก 50 kg ควรได้ colostrum คุณภาพดีอย่างน้อย 1.5-2 L (ราว 70-75 g IgG) แบ่งให้หลายมื้อในช่วง 12-18 ชั่วโมงแรกหลังคลอด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-failure-of-transfer-of-passive-immunity-in-large-animals",
              "locator": "Treatment and prevention",
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
            "rationale": "A 50-kg foal requires a minimum 1.5–2 L (ideally 5%–12% of body wt) of good-quality colostrum (~70–75 g of IgG), fed over multiple feedings in the first 12–18 hours after birth."
          }
        }
      ]
    },
    "equine-medicine--equine-neonatal--ลูกม้ากำพร้า-การหย่านม-วัคซีน-และการถ่ายพยาธิ": {
      "claims": [
        {
          "id": "equine-medicine--equine-neonatal--ลูกม้ากำพร้า-การหย่านม-วัคซีน-และการถ่ายพยาธิ--v1",
          "statement": "ลูกม้าที่เกิดจากแม่ที่ได้รับวัคซีนและได้ colostrum มักมีภูมิคุ้มกันป้องกันโรคได้ถึงราว 6 เดือน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-vaccinations-for-a-horse-2025",
              "locator": "Foals",
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
            "rationale": "Foals (young horses) born to vaccinated mothers usually have protection from diseases for up to 6 months if they drink the mare's colostrum"
          }
        }
      ]
    },
    "equine-medicine--equine-neonatal--ความผิดปกติที่พบบ่อยในลูกม้าแรกเกิด": {
      "claims": [
        {
          "id": "equine-medicine--equine-neonatal--ความผิดปกติที่พบบ่อยในลูกม้าแรกเกิด--v1",
          "statement": "Meconium impaction ในลูกม้ามักตอบสนองต่อการรักษาทางยา ซึ่งมี enema เป็นหลัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-meconium-impaction-in-foals-2022",
              "locator": "Treatment",
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
            "rationale": "Many cases of meconium impaction respond to medical therapy, including judicious use of analgesics, IV fluid therapy, oral laxatives (4–8 oz mineral oil administered via a nasogastric tube; 1–2 oz milk of magnesia), and enemas as the mainstay of therapy."
          }
        }
      ]
    },
    "equine-medicine--equine-neonatal--neonatal-isoerythrolysis-ni": {
      "claims": [
        {
          "id": "equine-medicine--equine-neonatal--neonatal-isoerythrolysis-ni--v1",
          "statement": "ม้ามี major blood groups 8 กลุ่ม (A, C, D, K, P, Q, U, T) และภาวะ NI เป็นโรคภูมิคุ้มกันของลูกม้าที่เกิดจากหมู่เลือดแม่กับลูกเข้ากันไม่ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-blood-groups-and-blood-transfusions-in-horses-2019",
              "locator": "Blood groups",
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
            "rationale": "This immune disorder in the foal is called neonatal isoerythrolysis. In horses there are 8 major blood groups: A, C, D, K, P, Q, U, and T."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-derm": {
    "equine-medicine--equine-derm--ซักประวัติ-และโรคตามพันธุ์-สี-อายุ": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--ซักประวัติ-และโรคตามพันธุ์-สี-อายุ--v1",
          "statement": "HERDA ใน Quarter Horse เป็นโรคผิวหนังเสื่อมที่ถ่ายทอดทางพันธุกรรม (เดิมเรียก hyperelastosis cutis)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21118319",
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
            "rationale": "Hereditary equine regional dermal asthenia (HERDA) in Quarter Horses is an inherited degenerative skin disease. Initially reported as hyperelastosis cutis"
          }
        }
      ]
    },
    "equine-medicine--equine-derm--ตรวจผิวหนัง-และเก็บตัวอย่าง": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--ตรวจผิวหนัง-และเก็บตัวอย่าง--v1",
          "statement": "ผล skin scraping ที่เป็นลบไม่ตัดโรค mange ออก ต้อง biopsy เพื่อวินิจฉัยได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-mange-in-horses-2023",
              "locator": "Sarcoptic mange",
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
            "rationale": "Negative skin scrapings do not exclude the disease; biopsy may establish a diagnosis."
          }
        }
      ]
    },
    "equine-medicine--equine-derm--คันจากปรสิตภายนอกและแมลง": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--คันจากปรสิตภายนอกและแมลง--v1",
          "statement": "เหาของม้ามี 2 ชนิดคือ Haematopinus asini (เหาดูดเลือด) และ Damalinia equi (เหากัด)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-lice-in-horses-and-donkeys-2023",
              "locator": "Overview",
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
            "rationale": "Haematopinus asini (the horse bloodsucking louse) and Damalinia equi (the horse biting louse)."
          }
        }
      ]
    },
    "equine-medicine--equine-derm--hypersensitivity-culicoides-และ-atopic-dermatitis": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--hypersensitivity-culicoides-และ-atopic-dermatitis--v1",
          "statement": "Insect bite hypersensitivity ของม้าเป็น allergic dermatitis แบบ IgE-mediated ที่เกิดจากการถูกริ้น Culicoides spp. กัด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39403119",
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
            "rationale": "Insect bite hypersensitivity (IBH) is an IgE-mediated allergic dermatitis of horses caused by bites of Culicoides spp."
          }
        }
      ]
    },
    "equine-medicine--equine-derm--สะเก็ดและขุย-dermatophytosis-และ-dermatophilosis": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--สะเก็ดและขุย-dermatophytosis-และ-dermatophilosis--v1",
          "statement": "Trichophyton equinum เป็นสาเหตุหลักของ dermatophytosis ในม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-dermatophytosis-in-horses-2025",
              "locator": "Overview",
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
            "rationale": "Trichophyton equinum and T mentagrophytes are the primary causes of dermatophytosis in horses"
          }
        }
      ]
    },
    "equine-medicine--equine-derm--erosion-habronemiasis-และ-coital-exanthema": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--erosion-habronemiasis-และ-coital-exanthema--v1",
          "statement": "Equine coital exanthema (EHV-3) ไม่มีวัคซีนหรือการรักษาจำเพาะ และแนะนำให้พักการผสมพันธุ์เพื่อให้รอยโรคหายและป้องกันการแพร่โรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-equine-coital-exanthema-2024",
              "locator": "Treatment",
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
            "rationale": "There are no vaccines or specific treatments. Sexual rest is recommended to allow lesions to heal and to prevent disease transmission."
          }
        }
      ]
    },
    "equine-medicine--equine-derm--ขนผิดปกติ-ppid-equine-cushing-s-disease": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--ขนผิดปกติ-ppid-equine-cushing-s-disease--v1",
          "statement": "Pergolide เริ่มขนาด 2 mcg/kg PO ทุก 24 ชั่วโมง แล้วปรับตามการตอบสนอง เป็นการรักษา PPID",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-hypertrichosis-associated-with-adenomas-of-the-pars-inte",
              "locator": "Treatment",
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
            "rationale": "Pergolide (starting dosage, 2 mcg/kg, PO, every 24 hours, then titrated according to individual response)"
          }
        }
      ]
    },
    "equine-medicine--equine-derm--เนื้องอก-sarcoid-และ-papillomatosis": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--เนื้องอก-sarcoid-และ-papillomatosis--v1",
          "statement": "Bovine papillomavirus (BPV) โดยเฉพาะ type 1 และ 2 ถือเป็นสาเหตุหลักของ equine sarcoid",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-equine-sarcoids-2021",
              "locator": "Etiology",
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
            "rationale": "Bovine papillomavirus (BPV), primarily types 1 and 2, is now considered the main etiologic agent of equine sarcoids."
          }
        }
      ]
    },
    "equine-medicine--equine-derm--เนื้องอก-scc-melanoma-และ-eosinophilic-granuloma": {
      "claims": [
        {
          "id": "equine-medicine--equine-derm--เนื้องอก-scc-melanoma-และ-eosinophilic-granuloma--v1",
          "statement": "เนื้องอก melanocytic ส่วนใหญ่ในม้าพบในม้าสีเทา (gray) ที่ขนเปลี่ยนเป็นเทาหรือขาวตามอายุ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tumors-of-melanocytic-origin-in-animals-2021",
              "locator": "Tumors of Melanocytic Origin in Horses",
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
            "rationale": "Most melanocytic neoplasms are in gray horses, in which the coat turns gray (or white) with age."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-surgery-wound": {
    "equine-medicine--equine-surgery-wound--การไหลของงานในโรงพยาบาล-ห้องเตรียม-checklist-ห้อง-induction": {
      "claims": [
        {
          "id": "equine-medicine--equine-surgery-wound--การไหลของงานในโรงพยาบาล-ห้องเตรียม-checklist-ห้อง-induction--v1",
          "statement": "การใช้ surgical safety checklist (WHO) ลดอัตราตายจาก 1.5% เป็น 0.8% (หลักฐานจากศัลยกรรมในคน; แนวคิด sign in / time out / sign out)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19144931",
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
            "rationale": "The rate of death was 1.5% before the checklist was introduced and declined to 0.8% afterward"
          }
        }
      ]
    },
    "equine-medicine--equine-surgery-wound--ระยะการหายของแผล-และม้าเทียบ-pony": {
      "claims": [
        {
          "id": "equine-medicine--equine-surgery-wound--ระยะการหายของแผล-และม้าเทียบ-pony--v1",
          "statement": "การหายแบบ second intention เร็วกว่าในม้า pony เมื่อเทียบกับม้า และเร็วกว่าที่แผลลำตัวเมื่อเทียบกับแผลที่ขา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15691597",
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
            "rationale": "Second-intention repair is faster in ponies than in horses and faster in body wounds than in limb wounds."
          }
        }
      ]
    },
    "equine-medicine--equine-surgery-wound--เลือกวิธีปิดแผล-ไหม-รูปแบบการเย็บ-และ-drain": {
      "claims": [
        {
          "id": "equine-medicine--equine-surgery-wound--เลือกวิธีปิดแผล-ไหม-รูปแบบการเย็บ-และ-drain--v1",
          "statement": "การเลือกชนิดการปิดแผลหรือการหายของแผลที่เหมาะสมต้องพิจารณาลักษณะของแต่ละแผลเป็นรายกรณี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30342805",
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
            "rationale": "providing the tools to decide which type of closure or healing is best in a given situation...Each wound must be considered as a unique problem"
          }
        }
      ]
    },
    "equine-medicine--equine-surgery-wound--dressing-การจำกัดการขยับ-และ-exuberant-granulation-tissue": {
      "claims": [
        {
          "id": "equine-medicine--equine-surgery-wound--dressing-การจำกัดการขยับ-และ-exuberant-granulation-tissue--v1",
          "statement": "ใน limb wound ของม้า inflammatory response ที่อ่อนและเรื้อรังยับยั้ง wound contraction และทำให้เกิด exuberant granulation tissue",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15691597",
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
            "rationale": "In horses,leukocytes produce fewer mediators, initiating a weak inflammatory response, which becomes chronic. This inhibits wound contraction and gives rise to the formation of exuberant granulation tissue."
          }
        }
      ]
    },
    "equine-medicine--equine-surgery-wound--การพันแผล-หลัก-3-ชั้น-และพันตามตำแหน่ง": {
      "claims": [
        {
          "id": "equine-medicine--equine-surgery-wound--การพันแผล-หลัก-3-ชั้น-และพันตามตำแหน่ง--v1",
          "statement": "Bandage และ cast ช่วยพยุงกระบวนการหายของแผลโดยรวม แต่อาจกระตุ้น exuberant granulation tissue จึงต้องใช้อย่างระวัง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15691597",
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
            "rationale": "Bandages and casts stimulate the formation of exuberant granulation tissue; however, they are advantageous in many respects and play an important role in support of the overall healing process."
          }
        }
      ]
    }
  }
};
