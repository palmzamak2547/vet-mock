// ============================================================
// VetWiki — reference-verification overlay, Aquatic Animal Clinic notes of 2569
// ============================================================
// One claim per section added on 15 Nov 2026, each cross-checked against a real
// external source (./sources.js): the supporting words of the source are quoted
// in the claim's `review.rationale`, and a second reader fetched the source again
// and found them there. verification.js merges this overlay in code with the
// curated and the generated ones, so no key of one object literal can shadow another.
// ============================================================

/** @type {Record<string, Record<string, {claims: object[]}>>} */
export const AQUATIC_CLINIC_VERIFICATIONS = {
  "aquatic-clinic--aqua-toxicology": {
    "aquatic-clinic--aqua-toxicology--แหล่งมลพิษทางน้ำ": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--แหล่งมลพิษทางน้ำ--v1",
          "statement": "โรงบำบัดน้ำเสียและน้ำไหลบ่าจากพื้นที่เกษตรเป็นแหล่งที่ปล่อยสารปนเปื้อนลงแหล่งน้ำ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21820383",
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
            "rationale": "ammonia; one of multiple contaminants arising from wastewater treatment plants and agricultural runoff"
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--ระยะของผลพิษในสัตว์น้ำ": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--ระยะของผลพิษในสัตว์น้ำ--v1",
          "statement": "ปลาที่สัมผัสสารเคมีมีการชดเชย (compensation) และฟื้นตัว (recovery) ของระดับฮอร์โมนได้ ขึ้นกับความเข้มข้นและเวลา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19440503",
              "locator": "abstract, Results",
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
            "rationale": "plasma E2 concentrations recovered by the eighth day of exposure in the 3-microg/L group and within 1 day of cessation of exposure in the 30-microg/L group, indicating concentration- and time-dependent physiologic compensation and recovery"
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--ปัจจัยที่ทำให้ความเป็นพิษต่างกัน-การสัมผัส": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--ปัจจัยที่ทำให้ความเป็นพิษต่างกัน-การสัมผัส--v1",
          "statement": "ในการทดลองพิษกับปลา สารถูกให้ทางน้ำที่ความเข้มข้นกำหนดเป็นช่วงเวลาหนึ่ง แล้วย้ายไปน้ำสะอาดเพื่อดูการฟื้นตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19440503",
              "locator": "abstract, Methods",
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
            "rationale": "Fish were exposed via water to 0, 3, or 30 microg FAD/L for 8 days and then held in clean water for 8 days"
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--ปัจจัยที่ทำให้ความเป็นพิษต่างกัน-น้ำรอบตัวสัตว์": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--ปัจจัยที่ทำให้ความเป็นพิษต่างกัน-น้ำรอบตัวสัตว์--v1",
          "statement": "ความกระด้างของน้ำ (แคลเซียม) ควบคุมการดูดซึมและความเป็นพิษของโลหะ เช่น สังกะสี ที่เหงือกปลา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10958959",
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
            "rationale": "Water hardness is known to control the uptake and toxicity of zinc and other metals through either chemical competition, biological acclimation, or both processes."
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--ปัจจัยที่ทำให้ความเป็นพิษต่างกัน-ตัวสิ่งมีชีวิต": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--ปัจจัยที่ทำให้ความเป็นพิษต่างกัน-ตัวสิ่งมีชีวิต--v1",
          "statement": "ชนิดสัตว์ต่างกันตอบสนองต่อสารเคมีชุดเดียวกันต่างกัน แม้อยู่ในห่วงโซ่อาหารเดียวกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34626844",
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
            "rationale": "This study demonstrates that the severity of the effects caused by the exposure to a mixture of pesticides can differ among species from the same trophic chain."
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--กรอบ-adverse-outcome-pathway-aop": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--กรอบ-adverse-outcome-pathway-aop--v1",
          "statement": "AOP เชื่อม molecular initiating event (MIE) ไปยัง adverse outcome (AO) ผ่าน key events (KE) ที่เชื่อมกันด้วย key event relationships (KER)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29051992",
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
            "rationale": "AOP links a molecular initiating event (MIE) to the adverse outcome (AO) via key events (KE), in a way specified by key event relationships (KER)."
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--ตัวอย่าง-aop-endocrine-disruptor-ที่ยับยั้ง-aromatase": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--ตัวอย่าง-aop-endocrine-disruptor-ที่ยับยั้ง-aromatase--v1",
          "statement": "Fadrozole ซึ่งยับยั้ง aromatase ทำให้ E2 และ vitellogenin ในพลาสมาปลาตัวเมียลดลง และ fecundity ลดลง เพราะ E2 กระตุ้นตับสร้าง vitellogenin",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11961225",
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
            "rationale": "In females, this inhibition was accompanied by a concentration-dependent decrease in plasma E2 and vitellogenin concentrations; the latter observation is consistent with the fact that activation of the estrogen receptor by E2 initiates hepatic vitellogenin production in oviparous vertebrates."
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--สารเคมีตัวเดียว-หลายเส้นทาง": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--สารเคมีตัวเดียว-หลายเส้นทาง--v1",
          "statement": "AOP หลายเส้นทางต่อกันเป็นเครือข่าย (AOP network) ได้ เพราะมีการใช้ event ร่วมกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32278258",
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
            "rationale": "semantic analysis enabled AOP networks to be constructed at the level of phenotypic profiles based on similarities, complementing those based on event sharing"
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--biochemical-marker": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--biochemical-marker--v1",
          "statement": "Cytochrome P450 1A (CYP1A) ใช้เป็น biomarker ติดตามการปนเปื้อนของน้ำด้วย PAHs, PCBs และ dioxins",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32504241",
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
            "rationale": "Cytochrome P4501A (CYP1A) has been used as a specific biomarker for monitoring water contamination such as PAHs, PCBs and dioxins."
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--กรณีศึกษา-มลพิษทำให้สัตว์น้ำเสี่ยงต่อปรสิตและเชื้อโรค": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--กรณีศึกษา-มลพิษทำให้สัตว์น้ำเสี่ยงต่อปรสิตและเชื้อโรค--v1",
          "statement": "ยากำจัดวัชพืชเพิ่มความไวต่อการติดปรสิต trematode ของตัวอ่อนสัตว์น้ำ โดยกดภูมิคุ้มกันของลูกอ๊อด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30895712",
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
            "rationale": "herbicides indirectly increased host susceptibility and trematode infections by (1) increasing time spent in susceptible early developmental stages and (2) suppressing tadpole immunity."
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--ปัจจัยที่ทำให้ความเป็นพิษต่างกัน-ภาพรวมและสารเคมี": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--ปัจจัยที่ทำให้ความเป็นพิษต่างกัน-ภาพรวมและสารเคมี--v1",
          "statement": "ผลรวมของสารเคมีหลายตัวต่อสิ่งมีชีวิตในน้ำอาจเป็นแบบ additive, synergistic หรือ antagonistic จึงต้องทดสอบพิษของสารผสม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39519349",
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
            "rationale": "The review underscores the necessity of conducting mixture toxicity testing to assess whether the combined effects of CNMs and co-existing pollutants are additive, synergistic, or antagonistic."
          }
        }
      ]
    },
    "aquatic-clinic--aqua-toxicology--สารเคมีผสม-chemical-mixtures": {
      "claims": [
        {
          "id": "aquatic-clinic--aqua-toxicology--สารเคมีผสม-chemical-mixtures--v1",
          "statement": "การประเมินพิษของสารเคมีผสม (mixture toxicity assessment) เป็นเรื่องที่เกี่ยวข้องกับการพัฒนาเครือข่าย AOP",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29488651",
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
            "rationale": "the development of guidance related to AOP network development was identified as a critical need. This not only included questions focusing directly on AOP networks, but also on related topics such as mixture toxicity assessment"
          }
        }
      ]
    }
  }
};
