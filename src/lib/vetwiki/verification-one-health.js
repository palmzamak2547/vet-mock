// ============================================================
// VetWiki — reference-verification overlay, One Health notes of 2569
// ============================================================
// One claim per section added on 15 Nov 2026, each cross-checked against a real
// external source (./sources.js): the supporting words of the source are quoted
// in the claim's `review.rationale`, and a second reader fetched the source again
// and found them there. verification.js merges this overlay in code with the
// curated and the generated ones, so no key of one object literal can shadow another.
// ============================================================

/** @type {Record<string, Record<string, {claims: object[]}>>} */
export const ONE_HEALTH_VERIFICATIONS = {
  "one-health--oh-env-carcinogen": {
    "one-health--oh-env-carcinogen--คำศัพท์-ghg-vocs-pm": {
      "claims": [
        {
          "id": "one-health--oh-env-carcinogen--คำศัพท์-ghg-vocs-pm--v1",
          "statement": "PM10 คืออนุภาคเส้นผ่านศูนย์กลางไม่เกิน 10 ไมครอน และ PM2.5 คืออนุภาคละเอียดไม่เกิน 2.5 ไมครอน (PM10 จึงรวมอนุภาคขนาดเล็กกว่านั้นด้วย)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-particulate-matter-pm-basics-2025",
              "locator": "PM basics, what is PM",
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
            "rationale": "PM 10 : inhalable particles, with diameters that are generally 10 micrometers and smaller; and PM 2.5 : fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller."
          }
        }
      ]
    },
    "one-health--oh-env-carcinogen--ก๊าซเรือนกระจกต่อกิโลกรัมอาหาร-และผลต่อการค้า": {
      "claims": [
        {
          "id": "one-health--oh-env-carcinogen--ก๊าซเรือนกระจกต่อกิโลกรัมอาหาร-และผลต่อการค้า--v1",
          "statement": "ผลิตภัณฑ์สัตว์ที่มีผลกระทบต่ำที่สุดก็ยังมักก่อผลกระทบสิ่งแวดล้อมสูงกว่าอาหารพืชที่ใช้ทดแทน จึงมีผลต่อการเปลี่ยนอาหารและการสื่อสารผลกระทบถึงผู้บริโภค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29853680",
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
            "rationale": "Most strikingly, impacts of the lowest-impact animal products typically exceed those of vegetable substitutes, providing new evidence for the importance of dietary change."
          }
        }
      ]
    },
    "one-health--oh-env-carcinogen--farm-to-fork-life-cycle-assessment": {
      "claims": [
        {
          "id": "one-health--oh-env-carcinogen--farm-to-fork-life-cycle-assessment--v1",
          "statement": "การประเมินผลกระทบสิ่งแวดล้อมของอาหารรวมข้อมูลตลอดห่วงโซ่อุปทาน ตั้งแต่ฟาร์มถึงผู้แปรรูป บรรจุภัณฑ์ และผู้ค้าปลีก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29853680",
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
            "rationale": "we consolidated data covering five environmental indicators; 38,700 farms; and 1600 processors, packaging types, and retailers."
          }
        }
      ]
    },
    "one-health--oh-env-carcinogen--intensive-livestock-production-สิ่งที่ปล่อยออกจากฟาร์ม": {
      "claims": [
        {
          "id": "one-health--oh-env-carcinogen--intensive-livestock-production-สิ่งที่ปล่อยออกจากฟาร์ม--v1",
          "statement": "ฝุ่นจากฟาร์มปศุสัตว์เข้มข้นมีเศษขน ผิวหนัง มูล อนุภาคอาหารสัตว์ และจุลชีพ ซึ่งกระทบสุขภาพสัตว์ คนงานและผู้อยู่ใกล้เคียง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36368402",
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
            "rationale": "Dust emitted from intensive poultry production operations contains feather and skin fragments, faeces, feed particles, microorganisms and other pollutants, which can adversely impact poultry health as well as the health of farm workers and nearby inhabitants."
          }
        }
      ]
    },
    "one-health--oh-env-carcinogen--แผนผังผลกระทบ-1-การผลิตอาหารสัตว์": {
      "claims": [
        {
          "id": "one-health--oh-env-carcinogen--แผนผังผลกระทบ-1-การผลิตอาหารสัตว์--v1",
          "statement": "การผลิตและแปรรูปอาหารสัตว์เป็นแหล่งปล่อยก๊าซเรือนกระจกหลักของภาคปศุสัตว์ (ร้อยละ 45)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tackling-climate-change-through-livestock-a-global-asses",
              "locator": "Executive summary, emissions",
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
            "rationale": "Feed production and processing, and enteric fermentation from ruminants are the two main sources of emissions, representing 45 and 39 percent of sector emissions"
          }
        }
      ]
    },
    "one-health--oh-env-carcinogen--แผนผังผลกระทบ-2-ฟาร์มและคุณภาพอากาศ": {
      "claims": [
        {
          "id": "one-health--oh-env-carcinogen--แผนผังผลกระทบ-2-ฟาร์มและคุณภาพอากาศ--v1",
          "statement": "การเติมไนโตรเจนที่ทำให้ดินเป็นกรดมากขึ้นลดความหลากหลายของแบคทีเรียและราในดิน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35043220",
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
            "rationale": "reduced soil pH under N addition was the main factor driving variations in soil microbial diversity and community structure in this grassland."
          }
        }
      ]
    },
    "one-health--oh-env-carcinogen--แผนผังผลกระทบ-3-คุณภาพน้ำ": {
      "claims": [
        {
          "id": "one-health--oh-env-carcinogen--แผนผังผลกระทบ-3-คุณภาพน้ำ--v1",
          "statement": "ไนโตรเจนและฟอสฟอรัสส่วนเกินทำให้สาหร่ายบานซึ่งเมื่อตายและย่อยสลายจะใช้ออกซิเจนในน้ำ จนออกซิเจนละลายน้ำต่ำและสัตว์น้ำอยู่ไม่ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-the-effects-environment-nutrient-pollution-2025",
              "locator": "Dead Zones and Hypoxia",
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
            "rationale": "Nutrient pollution fuels the growth of harmful algal blooms (HABs) which have negative impacts on aquatic ecosystems. ... When the algae eventually die, they consume the oxygen in the water column as they decompose."
          }
        }
      ]
    },
    "one-health--oh-env-carcinogen--กลยุทธ์ลดความเสี่ยงต่อสุขภาพจากสิ่งแวดล้อม": {
      "claims": [
        {
          "id": "one-health--oh-env-carcinogen--กลยุทธ์ลดความเสี่ยงต่อสุขภาพจากสิ่งแวดล้อม--v1",
          "statement": "การปรับปรุงพันธุ์และสุขภาพสัตว์ลดสัตว์ส่วนที่ไม่ได้ผลิต และลดการปล่อยก๊าซที่เกี่ยวข้อง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-tackling-climate-change-through-livestock-a-global-asses",
              "locator": "Executive summary, mitigation",
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
            "rationale": "Improved breeding and animal health help to shrink the herd overhead (i.e. unproductive part of the herd) and related emissions."
          }
        }
      ]
    }
  },
  "one-health--oh-env-mutagen": {
    "one-health--oh-env-mutagen--sentinel-species-คืออะไร": {
      "claims": [
        {
          "id": "one-health--oh-env-mutagen--sentinel-species-คืออะไร--v1",
          "statement": "สัตว์เลี้ยงที่สัมผัสสารพิษเหมือนมนุษย์ทั้งเส้นทาง ขนาด และระยะเวลา มักแสดงอาการก่อนมนุษย์ ทำให้ใช้เป็นสัญญาณเตือนล่วงหน้าได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32532580",
              "locator": "abstract, conclusions",
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
            "rationale": "Companion animals, when similarly exposed to toxic substances as humans regarding route, dose, and chronicity often mount symptoms and signs in advance of humans."
          }
        }
      ]
    },
    "one-health--oh-env-mutagen--กรณีผู้ป่วยพิษปรอทที่แมวในบ้านเป็นสัญญาณเตือน": {
      "claims": [
        {
          "id": "one-health--oh-env-mutagen--กรณีผู้ป่วยพิษปรอทที่แมวในบ้านเป็นสัญญาณเตือน--v1",
          "statement": "รายงานผู้ป่วยพิษปรอทจากการสูดดม ซึ่งสุนัขและแมวในบ้านตายก่อนที่ผู้ป่วยจะมีอาการ เป็นสัญญาณเตือนล่วงหน้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32532580",
              "locator": "abstract, objectives",
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
            "rationale": "The death of exposed pets prior to the mounting of symptoms in the exposed humans was advance warning of the near-fatal presentation to come."
          }
        }
      ]
    },
    "one-health--oh-env-mutagen--สัตวแพทย์-ปกป้องสุขภาพทั้งสัตว์และคน": {
      "claims": [
        {
          "id": "one-health--oh-env-mutagen--สัตวแพทย์-ปกป้องสุขภาพทั้งสัตว์และคน--v1",
          "statement": "การระบุ toxidrome ในสัตว์เลี้ยงช่วยให้พบการสัมผัสสารในคนระยะแรกและให้การรักษาได้เร็ว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32532580",
              "locator": "abstract, discussion",
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
            "rationale": "Identifying the toxidrome in a companion animal allows for subclinical identification of exposure and consequences in the human that permits early treatment and intervention."
          }
        }
      ]
    },
    "one-health--oh-env-mutagen--สารพิษในบ้าน-6-ชนิด-ภาพรวม": {
      "claims": [
        {
          "id": "one-health--oh-env-mutagen--สารพิษในบ้าน-6-ชนิด-ภาพรวม--v1",
          "statement": "ปรอท ตะกั่ว Teflon สารกำจัดวัชพืช และแร่ใยหิน ก่อสัญญาณและอาการที่คาดการณ์ได้ในสัตว์เลี้ยงก่อนที่จะพบในคน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32532580",
              "locator": "abstract, discussion",
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
            "rationale": "Mercury, lead, Teflon, herbicide, and asbestos exposures present with predictable signs and symptoms in companion animals prior to presenting in humans."
          }
        }
      ]
    },
    "one-health--oh-env-mutagen--teflon-และปรอท": {
      "claims": [
        {
          "id": "one-health--oh-env-mutagen--teflon-และปรอท--v1",
          "statement": "นกค็อกคาเทลห้าตัวตายภายใน 30 นาทีจากควันกระทะเคลือบ PTFE ที่ร้อนเกิน และเจ้าของเป็น polymer fume fever ภายในหนึ่งชั่วโมงแล้วหายภายใน 24 ชั่วโมง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1119084",
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
            "rationale": "died within 30 minutes following exposure to fumes from a frying pan coated with the \"non-stick\" plastic polytetrafluoroethylene (PTFE) that had accidentally overheated. Within an hour the owner developed symptoms of \"polymer fume fever\" but recovered in the next 24 hours."
          }
        }
      ]
    },
    "one-health--oh-env-mutagen--ตะกั่ว-แร่ใยหิน-และสารกำจัดวัชพืช": {
      "claims": [
        {
          "id": "one-health--oh-env-mutagen--ตะกั่ว-แร่ใยหิน-และสารกำจัดวัชพืช--v1",
          "statement": "สุนัข mesothelioma สัมพันธ์กับสมาชิกในบ้านที่ทำงานหรืองานอดิเรกเกี่ยวกับแร่ใยหิน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-6641667",
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
            "rationale": "An asbestos-related occupation or hobby of a household member and use of flea repellents on the dog were significantly associated with mesothelioma."
          }
        }
      ]
    },
    "one-health--oh-env-mutagen--สัตว์เลี้ยงเป็นแบบจำลองมะเร็งและความชราของคน": {
      "claims": [
        {
          "id": "one-health--oh-env-mutagen--สัตว์เลี้ยงเป็นแบบจำลองมะเร็งและความชราของคน--v1",
          "statement": "สุนัขเลี้ยงเป็นมะเร็งเองตามธรรมชาติในอัตราประมาณห้าเท่าของคน และมีระบบภูมิคุ้มกันครบถ้วน จึงเป็นแบบจำลองมะเร็งของคน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37778398",
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
            "rationale": "Pet dogs develop spontaneous cancers at a rate estimated to be five times higher than that of humans, providing a unique opportunity to study disease biology and evaluate novel therapeutic strategies in a model system that possesses an intact immune system and mirrors key aspects of human cancer biology."
          }
        }
      ]
    }
  },
  "one-health--oh-gmo": {
    "one-health--oh-gmo--gmo-คืออะไร-ทำไมต้องมี-และตัวอย่าง": {
      "claims": [
        {
          "id": "one-health--oh-gmo--gmo-คืออะไร-ทำไมต้องมี-และตัวอย่าง--v1",
          "statement": "GMO คือสิ่งมีชีวิต (พืช สัตว์ จุลชีพ) ที่สารพันธุกรรมถูกเปลี่ยนในแบบที่ไม่เกิดตามธรรมชาติจากการผสมพันธุ์หรือ recombination",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-food-genetically-modified-2014",
              "locator": "Q: What are genetically modified (GM) organisms and GM foods?",
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
            "rationale": "Genetically modified organisms (GMOs) can be defined as organisms (i.e. plants, animals or microorganisms) in which the genetic material (DNA) has been altered in a way that does not occur naturally by mating and/or natural recombination."
          }
        }
      ]
    },
    "one-health--oh-gmo--อาหารจาก-gmo-ห่วงโซ่อาหาร-และกรอบ-one-health": {
      "claims": [
        {
          "id": "one-health--oh-gmo--อาหารจาก-gmo-ห่วงโซ่อาหาร-และกรอบ-one-health--v1",
          "statement": "สัตว์ที่ผลิตอาหารกินชีวมวลของพืช GE ทั่วโลกร้อยละ 70 ถึง 90 พืช GM จึงเข้าห่วงโซ่อาหารผ่านปศุสัตว์ด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25184846",
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
            "rationale": "Globally, food-producing animals consume 70 to 90% of genetically engineered (GE) crop biomass."
          }
        }
      ]
    },
    "one-health--oh-gmo--สุขภาพคน-ผลโดยตรงและการประเมินความปลอดภัยอาหาร": {
      "claims": [
        {
          "id": "one-health--oh-gmo--สุขภาพคน-ผลโดยตรงและการประเมินความปลอดภัยอาหาร--v1",
          "statement": "การประเมินความปลอดภัยอาหาร GM พิจารณาความเป็นพิษ การก่อภูมิแพ้ ผลทางโภชนาการ และผลที่ไม่ได้ตั้งใจ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-food-genetically-modified-2014",
              "locator": "Q: How is a safety assessment of GM food conducted?",
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
            "rationale": "The safety assessment of GM foods generally focuses on: (a) direct health effects (toxicity), (b) potential to provoke allergic reaction (allergenicity); (c) specific components thought to have nutritional or toxic properties; (d) the stability of the inserted gene"
          }
        }
      ]
    },
    "one-health--oh-gmo--สุขภาพคน-ผลทางอ้อมต่อสุขภาพกายและเศรษฐกิจ": {
      "claims": [
        {
          "id": "one-health--oh-gmo--สุขภาพคน-ผลทางอ้อมต่อสุขภาพกายและเศรษฐกิจ--v1",
          "statement": "พืช GM ทำให้แนวปฏิบัติทางการเกษตรเปลี่ยนทางอ้อม ทั้งการใช้สารกำจัดศัตรูพืช การขยายพื้นที่เกษตร และรูปแบบการปลูก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39208101",
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
            "rationale": "GM crops have led to indirect changes in agricultural practices, including pesticide use, agricultural expansion, and cropping patterns, with profound environmental implications."
          }
        }
      ]
    },
    "one-health--oh-gmo--สุขภาพสัตว์-อาหารสัตว์-gm": {
      "claims": [
        {
          "id": "one-health--oh-gmo--สุขภาพสัตว์-อาหารสัตว์-gm--v1",
          "statement": "สัตว์ที่กินอาหาร GE มีสมรรถนะและสุขภาพเทียบเท่าสัตว์ที่กินพืชสายพันธุ์ isogenic ที่ไม่ใช่ GE",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25184846",
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
            "rationale": "Numerous experimental studies have consistently revealed that the performance and health of GE-fed animals are comparable with those fed isogenic non-GE crop lines."
          }
        }
      ]
    },
    "one-health--oh-gmo--สุขภาพสิ่งแวดล้อม": {
      "claims": [
        {
          "id": "one-health--oh-gmo--สุขภาพสิ่งแวดล้อม--v1",
          "statement": "ผลของพืช GM ต่อความหลากหลายทางชีวภาพ การทำลายป่า และสุขภาพคนมีทั้งด้านบวกและลบ ขึ้นกับลักษณะที่ดัดแปลงและขนาดพื้นที่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39208101",
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
            "rationale": "Recent studies paint a nuanced picture of these environmental impacts, with mixed effects of GM crop adoption on biodiversity, deforestation, and human health that vary with the GM trait and geographic scale."
          }
        }
      ]
    },
    "one-health--oh-gmo--การป้องกันและควบคุม-และสถานะในประเทศไทย": {
      "claims": [
        {
          "id": "one-health--oh-gmo--การป้องกันและควบคุม-และสถานะในประเทศไทย--v1",
          "statement": "ไทยมีการห้ามปลูกพืช GM เชิงพาณิชย์โดยพฤตินัย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-biotechnology-and-other-new-production-technologies-annu",
              "locator": "Section: public acceptance, cultivation",
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
            "rationale": "Due to these concerns, Thailand has a de facto ban on the commercial cultivation of genetically modified plants."
          }
        }
      ]
    }
  },
  "one-health--oh-livestock-waste": {
    "one-health--oh-livestock-waste--one-health-กับการจัดการของเสีย": {
      "claims": [
        {
          "id": "one-health--oh-livestock-waste--one-health-กับการจัดการของเสีย--v1",
          "statement": "น้ำเสียจากปศุสัตว์เป็นแหล่งสำคัญของสิ่งปนเปื้อนจุลชีพ และการจัดการของเสียที่ดีขึ้นช่วยปกป้องสุขภาพสิ่งแวดล้อมและสาธารณสุขใน One Health",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41734682",
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
            "rationale": "livestock wastewater represents a significant source of microbial contaminants. ... within the One Health framework, emphasizing the importance of improving waste management to protect environmental and public health."
          }
        }
      ]
    },
    "one-health--oh-livestock-waste--ของเสียจากฟาร์มปศุสัตว์และปัญหาที่ตามมา": {
      "claims": [
        {
          "id": "one-health--oh-livestock-waste--ของเสียจากฟาร์มปศุสัตว์และปัญหาที่ตามมา--v1",
          "statement": "ของเสียจากปศุสัตว์ก่อมลพิษต่อน้ำ อากาศ และดิน ซึ่งตรงกับที่โน้ตสรุปว่าส่งผลต่อดิน น้ำ อากาศ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19369065",
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
            "rationale": "water pollution by nitrates and through eutrophication; air pollution, particularly ammonia and greenhouse gases emissions, and soil pollution because of nutrient accumulation"
          }
        }
      ]
    },
    "one-health--oh-livestock-waste--หลัก-3-ประการ-และการลดปริมาณของเสีย-reduce": {
      "claims": [
        {
          "id": "one-health--oh-livestock-waste--หลัก-3-ประการ-และการลดปริมาณของเสีย-reduce--v1",
          "statement": "การปรับอาหารสุกรเพื่อลดสารอาหารที่ขับออกมากับมูลและกลิ่นทำได้จริง เป็นตัวอย่างการลดของเสียที่แหล่งกำเนิด (ด้านอาหารสัตว์)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15137450",
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
            "rationale": "Manipulation of the pig's diet to reduce nutrient excretions and odors is feasible and practical."
          }
        }
      ]
    },
    "one-health--oh-livestock-waste--การนำของเสียไปใช้ประโยชน์-reuse": {
      "claims": [
        {
          "id": "one-health--oh-livestock-waste--การนำของเสียไปใช้ประโยชน์-reuse--v1",
          "statement": "มูลสุกรใช้เป็นวัตถุดิบของการย่อยแบบไม่ใช้อากาศ ได้ก๊าซชีวภาพและกากหมักที่มีธาตุอาหารสูงนำไปใช้เป็นปุ๋ยได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36129010",
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
            "rationale": "Pig manure was used as the primary feedstock, fed and processed to biogas and nutrient-rich digestate by the anaerobic digestion process."
          }
        }
      ]
    },
    "one-health--oh-livestock-waste--การบำบัด-treatment-ขั้นตอนและกระบวนการ-3-ประเภท": {
      "claims": [
        {
          "id": "one-health--oh-livestock-waste--การบำบัด-treatment-ขั้นตอนและกระบวนการ-3-ประเภท--v1",
          "statement": "การบำบัดน้ำเสียใช้กระบวนการทางกายภาพ (ตะแกรง การตกตะกอนด้วยแรงโน้มถ่วง) และทางเคมี (เติมสารเคมีเพื่อให้ตกตะกอน) และทางชีวภาพ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-primer-for-municipal-wastewater-treatment-systems-epa-83",
              "locator": "Collecting and Treating Wastewater: Physical; Chemical",
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
            "rationale": "usually by passing wastewater through screens to remove debris and solids. In addition, solids that are heavier than water will settle out from wastewater by gravity. ... Chemicals can be used to create changes in pollutants that increase the removal of these new forms by physical processes."
          }
        }
      ]
    },
    "one-health--oh-livestock-waste--ระบบบ่อบำบัด-ponding-system": {
      "claims": [
        {
          "id": "one-health--oh-livestock-waste--ระบบบ่อบำบัด-ponding-system--v1",
          "statement": "ในเขตร้อน ระบบบ่อบำบัดต่อเนื่องใช้บ่อไม่ใช้อากาศ บ่อหมักผสม (facultative) และบ่อผึ่ง (maturation) เรียงกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17506426",
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
            "rationale": "a 3-log unit pathogen reduction by treatment in anaerobic, facultative and single maturation ponds is required for both restricted and unrestricted irrigation"
          }
        }
      ]
    },
    "one-health--oh-livestock-waste--ระบบก๊าซชีวภาพ-biogas-system": {
      "claims": [
        {
          "id": "one-health--oh-livestock-waste--ระบบก๊าซชีวภาพ-biogas-system--v1",
          "statement": "ระบบย่อยแบบไม่ใช้อากาศ เช่น UASB ใช้ได้สำเร็จในการย่อยมูลสุกร",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19220987",
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
            "rationale": "The results showed that UASB, anaerobic baffled reactors, CSTR, and anaerobic sequencing batch reactor (ASBR) were successfully utilized in anaerobic processing of swine manure at both mesophilic and thermophilic conditions."
          }
        }
      ]
    },
    "one-health--oh-livestock-waste--เลือกระบบบำบัด-และมาตรฐานน้ำทิ้งฟาร์มสุกร": {
      "claims": [
        {
          "id": "one-health--oh-livestock-waste--เลือกระบบบำบัด-และมาตรฐานน้ำทิ้งฟาร์มสุกร--v1",
          "statement": "ไทยกำหนดมาตรฐานน้ำทิ้งฟาร์มสุกรแยกตามขนาด โดยฟาร์มใหญ่คือเกิน 600 หน่วยปศุสัตว์ ฟาร์มกลาง 60-600 หน่วย (1 หน่วย = 500 กก.)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-environmental-health-and-welfare-issues-on-thai-livestoc",
              "locator": "Section 3.1.2, Table 3.1 Effluent Standard for Pig Farm, note 2",
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
            "rationale": "Large farm denotes a farm with more than 600 Livestock Unit (LU.), medium farm is 60-600 LU, and small farm is 6-<60 LU, 1 LU. = 500 kg."
          }
        }
      ]
    }
  },
  "one-health--oh-import-risk": {
    "one-health--oh-import-risk--import-risk-คืออะไร-และกรอบ-woah": {
      "claims": [
        {
          "id": "one-health--oh-import-risk--import-risk-คืออะไร-และกรอบ-woah--v1",
          "statement": "ตาม WOAH ถ้า hazard identification ไม่พบอันตรายที่เกี่ยวกับการนำเข้า การประเมินความเสี่ยงสรุปจบได้ ไม่ต้องประเมินต่อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-aquatic-animal-health-code-chapter-2-1-import-risk-analy",
              "locator": "Article 2.1.2, Hazard identification",
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
            "rationale": "The risk assessment should be concluded if hazard identification fails to identify hazards associated with the importation."
          }
        }
      ]
    },
    "one-health--oh-import-risk--entry-assessment-และ-exposure-assessment": {
      "claims": [
        {
          "id": "one-health--oh-import-risk--entry-assessment-และ-exposure-assessment--v1",
          "statement": "Entry assessment คือการบรรยาย biological pathway ที่การนำเข้าจะพาเชื้อก่อโรคเข้ามา และประมาณความน่าจะเป็นที่กระบวนการนั้นเกิดครบ ทั้งเชิงคำพูดหรือตัวเลข",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-aquatic-animal-health-code-chapter-2-1-import-risk-analy",
              "locator": "Article 2.1.4, 1. Entry assessment",
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
            "rationale": "Entry assessment consists of describing the biological pathway(s) necessary for an importation activity to introduce a pathogenic agent into a particular environment, and estimating the probability of that complete process occurring"
          }
        }
      ]
    },
    "one-health--oh-import-risk--likelihood-เชิงคุณภาพ-และ-matrix-ที่ใช้รวมค่า": {
      "claims": [
        {
          "id": "one-health--oh-import-risk--likelihood-เชิงคุณภาพ-และ-matrix-ที่ใช้รวมค่า--v1",
          "statement": "รายงาน IRA ของออสเตรเลียประเมินเชิงคุณภาพด้วย descriptor ของ likelihood และรวมค่าด้วย matrix ของกฎการรวม likelihood",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-generic-import-risk-analysis-report-for-prawns-and-prawn",
              "locator": "Section 3.2.2, Tables 3.1 and 3.2",
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
            "rationale": "was evaluated and reported using qualitative likelihood descriptors ... Likelihoods were combined using the matrix of rules for combining descriptive likelihoods shown in Table 3.2."
          }
        }
      ]
    },
    "one-health--oh-import-risk--consequence-assessment": {
      "claims": [
        {
          "id": "one-health--oh-import-risk--consequence-assessment--v1",
          "statement": "Consequence assessment บรรยายความสัมพันธ์ระหว่างการสัมผัสเชื้อกับผลที่ตามมา ซึ่งมีทั้งทางตรงและทางอ้อม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-aquatic-animal-health-code-chapter-2-1-import-risk-analy",
              "locator": "Article 2.1.4, 3. Consequence assessment",
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
            "rationale": "Consequence assessment consists of describing the relationship between specified exposures to a biological agent and the consequences of those exposures."
          }
        }
      ]
    },
    "one-health--oh-import-risk--risk-estimation-palee-partial-annual-risk-และ-overall-annual-ris": {
      "claims": [
        {
          "id": "one-health--oh-import-risk--risk-estimation-palee-partial-annual-risk-และ-overall-annual-ris--v1",
          "statement": "PALEE ของแต่ละ exposure group คำนวณจากผลคูณของ LR กับ PLE ของ group นั้นโดยใช้ matrix การรวม likelihood",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-generic-import-risk-analysis-report-for-prawns-and-prawn",
              "locator": "Section 3.2.6 Calculation of the partial annual likelihood of entry and exposure (PALEE)",
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
            "rationale": "The PALEE for each exposure group was calculated by determining the product of the likelihood of release (LR) and the corresponding partial likelihood of exposure (PLE)"
          }
        }
      ]
    },
    "one-health--oh-import-risk--ตัวอย่าง-wssv-ในกุ้งนำเข้าออสเตรเลีย-ภูมิหลัง-entry-และ-exposure": {
      "claims": [
        {
          "id": "one-health--oh-import-risk--ตัวอย่าง-wssv-ในกุ้งนำเข้าออสเตรเลีย-ภูมิหลัง-entry-และ-exposure--v1",
          "statement": "IRA ประเมินว่า LR ของ WSSV จากกุ้งทั้งตัว ดิบ แช่แข็ง ไม่มีชีวิต จากฟาร์ม เพื่อบริโภค แบบไม่มีข้อจำกัด อยู่ในระดับสูง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-generic-import-risk-analysis-report-for-prawns-and-prawn",
              "locator": "Section 6.1 Release assessment, WSSV likelihood of release",
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
            "rationale": "The LR of WSSV via the unrestricted importation of non-viable, farm-sourced, frozen, uncooked, whole prawns intended for human consumption is estimated to be high."
          }
        }
      ]
    },
    "one-health--oh-import-risk--ตัวอย่าง-wssv-consequence-และ-risk-estimation": {
      "claims": [
        {
          "id": "one-health--oh-import-risk--ตัวอย่าง-wssv-consequence-และ-risk-estimation--v1",
          "statement": "unrestricted risk ของ WSSV ที่รวม partial annual risk ของสามกลุ่มเท่ากับ high ซึ่งเกิน ALOP ของออสเตรเลียจึงต้องมี risk management",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-generic-import-risk-analysis-report-for-prawns-and-prawn",
              "locator": "Section 6.4 Overall risk determination, Conclusion",
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
            "rationale": "The unrestricted risk associated with WSSV is determined (by combining the three partial annual risks associated with each exposure group) to be high. The unrestricted risk exceeds Australia's ALOP and, therefore, risk management is deemed necessary."
          }
        }
      ]
    },
    "one-health--oh-import-risk--risk-management-ของ-wssv": {
      "claims": [
        {
          "id": "one-health--oh-import-risk--risk-management-ของ-wssv--v1",
          "statement": "IRA ระบุมาตรการที่ลด overall risk ของ WSSV จาก high เป็นอย่างน้อย very low เพื่อให้ถึง ALOP ของออสเตรเลีย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-generic-import-risk-analysis-report-for-prawns-and-prawn",
              "locator": "Section 15.2 Pathogenic agent-specific risk management measures, White spot syndrome virus",
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
            "rationale": "The IRA team considers that the following risk management measures would each reduce the overall WSSV risk from high to at least very low, thereby achieving Australia's ALOP."
          }
        }
      ]
    }
  }
};
