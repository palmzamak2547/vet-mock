// ============================================================
// VetWiki — reference-verification overlay, Epidemiology notes of 2569
// ============================================================
// One claim per section added on 14 Nov 2026, each cross-checked against a real
// external source (./sources.js): the supporting words of the source are quoted
// in the claim's `review.rationale`, and a second reader fetched the source again
// and found them there. verification.js merges this overlay in code with the
// curated and the generated ones, so no key of one object literal can shadow another.
// ============================================================

/** @type {Record<string, Record<string, {claims: object[]}>>} */
export const EPIDEMIOLOGY_VERIFICATIONS = {
  "epidemiology--epidem-disease-frequency": {
    "epidemiology--epidem-disease-frequency--epidemiology-กับคำถามหลักของการวัดความถี่ของโรค": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--epidemiology-กับคำถามหลักของการวัดความถี่ของโรค--v1",
          "statement": "Epidemiology คือ the study of the distribution และ determinants ของ health-related states or events ใน specified populations และการนำไปใช้ควบคุมปัญหาสุขภาพ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 1, Section 1: Definition of Epidemiology",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Epidemiology is the study of the distribution and determinants of health-related states or events in specified populations, and the application of this study to the control of health problems"
          }
        }
      ]
    },
    "epidemiology--epidem-disease-frequency--prevalence-ความชุก": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--prevalence-ความชุก--v1",
          "statement": "Point prevalence คือ prevalence ที่วัด ณ จุดเวลาหนึ่ง ส่วน period prevalence คือ prevalence ที่วัดตลอดช่วงเวลาหนึ่ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 2: Morbidity frequency measures, Prevalence",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Point prevalence refers to the prevalence measured at a particular point in time. It is the proportion of persons with a particular disease or attribute on a particular date. Period prevalence refers to prevalence measured over an interval of time."
          }
        }
      ]
    },
    "epidemiology--epidem-disease-frequency--incidence-อุบัติการณ์-cumulative-incidence-และ-incidence-rate": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--incidence-อุบัติการณ์-cumulative-incidence-และ-incidence-rate--v1",
          "statement": "เมื่อไม่สนใจ individual time ค่า new case / PAR เรียกได้หลายชื่อ เช่น cumulative incidence และ incidence risk (incidence proportion)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 2: Morbidity frequency measures, Incidence proportion or risk",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Synonyms include attack rate, risk, probability of getting disease, and cumulative incidence."
          }
        }
      ]
    },
    "epidemiology--epidem-disease-frequency--health-index-อัตราการตาย": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--health-index-อัตราการตาย--v1",
          "statement": "Proportional mortality ratio (PMR) ตอบคำถามว่าในบรรดาการตายทั้งหมด มีสัดส่วนเท่าใดที่ตายจากโรคหนึ่ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 3: Mortality frequency measures, Proportionate mortality",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Each cause is expressed as a percentage of all deaths, and the sum of the causes must add to 100%. These proportions are not mortality rates, because the denominator is all deaths rather than the population in which the deaths occurred."
          }
        }
      ]
    },
    "epidemiology--epidem-disease-frequency--morbidity-rate-case-fatality-rate-และ-attack-rate": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--morbidity-rate-case-fatality-rate-และ-attack-rate--v1",
          "statement": "Case-fatality rate (อัตราป่วยตาย) = จำนวนที่ตายด้วยโรคหนึ่ง / จำนวนที่ป่วยด้วยโรคนั้น x 100",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 3: Mortality frequency measures, Case-fatality rate",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The case-fatality rate is the proportion of persons with a particular condition (cases) who die from that condition. It is a measure of the severity of the condition."
          }
        }
      ]
    },
    "epidemiology--epidem-disease-frequency--measurement-of-association-determinant-risk-factor-และ-absolute-": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--measurement-of-association-determinant-risk-factor-และ-absolute---v1",
          "statement": "การ infer association ไปเป็น causation ใช้ The Bradford Hill Criteria 9 ข้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26425136",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In 1965, Sir Austin Bradford Hill published nine \"viewpoints\" to help determine if observed epidemiologic associations are causal."
          }
        }
      ]
    },
    "epidemiology--epidem-disease-frequency--rr-pr-irr-odds-และ-or": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--rr-pr-irr-odds-และ-or--v1",
          "statement": "เมื่อเทียบ incidence rate ของสองกลุ่ม (เช่น female กับ male) จะได้ incidence rate ratio (IRR)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 5: Measures of association, Rate ratio",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A rate ratio compares the incidence rates, person-time rates, or mortality rates of two groups."
          }
        }
      ]
    },
    "epidemiology--epidem-disease-frequency--การแปลผล-ratio-95-ci-และ-confounder": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--การแปลผล-ratio-95-ci-และ-confounder--v1",
          "statement": "Ratio มี null value เท่ากับ 1 คือไม่แตกต่างกันระหว่าง 2 กลุ่ม ส่วน ratio > 1 หมายถึงเพิ่มโอกาสการเกิดโรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 5: Measures of association, Risk ratio",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A risk ratio of 1.0 indicates identical risk among the two groups. A risk ratio greater than 1.0 indicates an increased risk for the group in the numerator, usually the exposed group."
          }
        }
      ]
    },
    "epidemiology--epidem-disease-frequency--attributable-risk-ar-ar-par-par": {
      "claims": [
        {
          "id": "epidemiology--epidem-disease-frequency--attributable-risk-ar-ar-par-par--v1",
          "statement": "Attributable risk proportion (AR%) = [(risk expose – risk unexposed) / risk expose] x 100 คือสัดส่วนของโรคในกลุ่ม exposed ที่เกิดจาก exposure",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 6: Measures of public health impact, Attributable proportion",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Thus, the attributable proportion is the amount of disease in the exposed group attributable to the exposure. It represents the expected reduction in disease if the exposure could be removed (or never existed)."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-test-agreement": {
    "epidemiology--epidem-test-agreement--agreement-ของ-test-คืออะไร": {
      "claims": [
        {
          "id": "epidemiology--epidem-test-agreement--agreement-ของ-test-คืออะไร--v1",
          "statement": "เมื่อเทียบ test ใหม่ (Test B) กับ test เดิม (Test A) สิ่งที่วัดคือ agreement of the test ว่า test ใหม่เข้ากันกับ test เดิมได้ดีเพียงใด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-2868172",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In clinical measurement comparison of a new measurement technique with an established one is often needed to see whether they agree sufficiently for the new to replace the old."
          }
        }
      ]
    },
    "epidemiology--epidem-test-agreement--cohen-s-kappa": {
      "claims": [
        {
          "id": "epidemiology--epidem-test-agreement--cohen-s-kappa--v1",
          "statement": "ในสูตร Cohen's kappa κ = (p_o − p_e) / (1 − p_e) นั้น p_o คือ observed agreement และ p_e คือ expected agreement (agreement ที่เกิดโดยบังเอิญ)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23092060",
              "locator": "full text (PMC3900052), section Cohen's kappa",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Where Pr(a) represents the actual observed agreement, and Pr(e) represents chance agreement."
          }
        }
      ]
    },
    "epidemiology--epidem-test-agreement--weighted-kappa-กรณีมีหลาย-category": {
      "claims": [
        {
          "id": "epidemiology--epidem-test-agreement--weighted-kappa-กรณีมีหลาย-category--v1",
          "statement": "Weighted kappa ใช้กรณีที่เรามีหลาย category (ที่เรียงลำดับได้)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29766350",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "When two (or more) observers are independently categorizing a set of observations, Cohen's kappa has become the most notable measure of interobserver agreement. When the categories are ordinal, a weighted form of kappa becomes desirable."
          }
        }
      ]
    },
    "epidemiology--epidem-test-agreement--test-ที่ให้ค่า-continuous-scatter-plot-และ-pearson-s-r": {
      "claims": [
        {
          "id": "epidemiology--epidem-test-agreement--test-ที่ให้ค่า-continuous-scatter-plot-และ-pearson-s-r--v1",
          "statement": "สำหรับ test ที่ให้ค่า continuous การใช้ Pearson's correlation coefficient (r) อย่างเดียวอาจมีคำถามเรื่องการนำไปใช้วัด agreement",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-2868172",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Such investigations are often analysed inappropriately, notably by using correlation coefficients. The use of correlation is misleading."
          }
        }
      ]
    },
    "epidemiology--epidem-test-agreement--วิธีที่แนะนำสำหรับ-continuous-data-และหัวข้อให้ศึกษาเพิ่ม": {
      "claims": [
        {
          "id": "epidemiology--epidem-test-agreement--วิธีที่แนะนำสำหรับ-continuous-data-และหัวข้อให้ศึกษาเพิ่ม--v1",
          "statement": "Intraclass-correlation coefficient (ICC) เป็นวิธีที่แนะนำสำหรับทดสอบ reliability ของ continuous data",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27330520",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Intraclass correlation coefficient (ICC) is a widely used reliability index in test-retest, intrarater, and interrater reliability analyses."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-data-analysis": {
    "epidemiology--epidem-data-analysis--ทำไมต้องวิเคราะห์ข้อมูล-และขั้นตอน-data-analysis": {
      "claims": [
        {
          "id": "epidemiology--epidem-data-analysis--ทำไมต้องวิเคราะห์ข้อมูล-และขั้นตอน-data-analysis--v1",
          "statement": "Clean the data เป็นขั้นตอนหนึ่งใน steps in data analysis ก่อน analyze data",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16138788",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In this policy forum the authors argue that data cleaning is an essential part of the research process, and should be incorporated into study design."
          }
        }
      ]
    },
    "epidemiology--epidem-data-analysis--data-analysis-in-epidemiology-ภาพรวม": {
      "claims": [
        {
          "id": "epidemiology--epidem-data-analysis--data-analysis-in-epidemiology-ภาพรวม--v1",
          "statement": "Distribution ในนิยาม epidemiology วิเคราะห์ผ่าน spatial and temporal analysis ตาม Time, Place, Person",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 1, Section 1: Definition of Epidemiology, Distribution",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Pattern refers to the occurrence of health-related events by time, place, and person."
          }
        }
      ]
    },
    "epidemiology--epidem-data-analysis--measure-of-disease-frequency-prevalence": {
      "claims": [
        {
          "id": "epidemiology--epidem-data-analysis--measure-of-disease-frequency-prevalence--v1",
          "statement": "Prevalence measures existing cases (ทั้ง new และ preexisting cases) ส่วน incidence measures new cases",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 2: Morbidity frequency measures, Prevalence",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "prevalence includes new and pre-existing cases whereas incidence includes new cases only."
          }
        }
      ]
    },
    "epidemiology--epidem-data-analysis--measure-of-disease-frequency-cumulative-incidence-และ-incidence-": {
      "claims": [
        {
          "id": "epidemiology--epidem-data-analysis--measure-of-disease-frequency-cumulative-incidence-และ-incidence---v1",
          "statement": "Incidence rate IR = I / PT โดย PT คือ total time ที่ disease-free individuals ถูกสังเกต (time at risk)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 2: Morbidity frequency measures, Incidence rate or person-time rate",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Incidence rate or person-time rate is a measure of incidence that incorporates time directly into the denominator."
          }
        }
      ]
    },
    "epidemiology--epidem-data-analysis--measure-of-association-risk-ratio-relative-risk": {
      "claims": [
        {
          "id": "epidemiology--epidem-data-analysis--measure-of-association-risk-ratio-relative-risk--v1",
          "statement": "RR > 1.0 หมายถึง positive association หรือ increased risk ใน exposed เทียบกับ unexposed ส่วน RR < 1.0 หมายถึง decreased risk (protective factor)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 5: Measures of association, Risk ratio",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A risk ratio greater than 1.0 indicates an increased risk for the group in the numerator, usually the exposed group. A risk ratio less than 1.0 indicates a decreased risk for the exposed group, indicating that perhaps exposure actually protects"
          }
        }
      ]
    },
    "epidemiology--epidem-data-analysis--measure-of-association-odds-ratio-และการเลือกใช้-rr-หรือ-or": {
      "claims": [
        {
          "id": "epidemiology--epidem-data-analysis--measure-of-association-odds-ratio-และการเลือกใช้-rr-หรือ-or--v1",
          "statement": "OR approximately the same as RR เมื่อ prevalence of disease ต่ำ และ case-control ใช้ OR",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 5: Measures of association, Odds ratio",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "when the health outcome is uncommon, the odds ratio provides a reasonable approximation of the risk ratio. Another attractive feature is that the odds ratio can be calculated with data from a case-control study"
          }
        }
      ]
    },
    "epidemiology--epidem-data-analysis--logistic-regression-และการอ่าน-odds-ratio-จากโมเดล": {
      "claims": [
        {
          "id": "epidemiology--epidem-data-analysis--logistic-regression-และการอ่าน-odds-ratio-จากโมเดล--v1",
          "statement": "Logistic regression ใช้กับ dependent variable (y) ที่เป็น dichotomous variable และผลของ independent variables รายงานเป็น odds ratio",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21996075",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "logistic regression is an efficient and powerful way to analyze the effect of a group of independent variables on a binary outcome by quantifying each independent variable's unique contribution."
          }
        }
      ]
    },
    "epidemiology--epidem-data-analysis--other-epidemiological-data-analyses": {
      "claims": [
        {
          "id": "epidemiology--epidem-data-analysis--other-epidemiological-data-analyses--v1",
          "statement": "Spatial analysis ใช้ spatial scan statistics หา clusters of disease",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22807146",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Spatial scan statistics are widely used tools for detection of disease clusters."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-dx-screening": {
    "epidemiology--epidem-dx-screening--screening-test-diagnostic-test-accuracy-และ-precision": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--screening-test-diagnostic-test-accuracy-และ-precision--v1",
          "statement": "Accuracy คือความสามารถของการวัดที่ให้ค่าเข้าใกล้ค่าจริง ส่วน Precision คือการวัดซ้ำแล้วได้ค่าเดิมสม่ำเสมอ ซึ่งค่าที่ได้อาจไม่ใช่ค่าจริง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-chapter-1-1-6-validation-of-diagnostic-assays-for-infect",
              "locator": "Section A.2.3 Operating range of the assay",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Accuracy is the closeness of a test value to the expected (true) value (mean or median) for a reference standard reagent of known concentration or titre. Precision is the degree of dispersion (variance, standard deviation [SD] or coefficient of variation [Cv])"
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--validity-sensitivity-specificity-และ-accuracy": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--validity-sensitivity-specificity-และ-accuracy--v1",
          "statement": "Sensitivity คือสัดส่วนของสัตว์ที่เป็นโรคจริงที่ test ให้ผลบวก P(T+|D+) และ Specificity คือสัดส่วนของสัตว์ที่ไม่เป็นโรคจริงที่ test ให้ผลลบ P(T-|D-) โดยเทียบกับ gold standard",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-chapter-1-1-6-validation-of-diagnostic-assays-for-infect",
              "locator": "Section B.2 Stage 2 - Diagnostic performance of the assay",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "DSe (proportion of samples from known infected animals that test positive in an assay) and DSp (the proportion of samples from known uninfected animals that test negative in an assay) are the primary performance indicators established during validation of an assay"
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--predictive-values-ppv-และ-npv": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--predictive-values-ppv-และ-npv--v1",
          "statement": "Positive predictive value (PPV) คือความน่าจะเป็นที่สัตว์ซึ่งให้ผล test บวกจะเป็นโรคจริง P(D+|T+)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29209603",
              "locator": "Full text (PMC5701930), Definitions: Defining Sensitivity and PPV",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Expressed differently and more economically, PPV is the probability that people with a positive screening test result indeed do have the condition of interest."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--bayes-theorem-false-positive-false-negative-และผลของ-prevalence": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--bayes-theorem-false-positive-false-negative-และผลของ-prevalence--v1",
          "statement": "Prevalence affect predictive value: PPV และ NPV เปลี่ยนไปตาม prevalence ของโรคในประชากรที่ตรวจ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17407452",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Positive and negative predictive values provide estimates of probability of disease but both parameters vary according to disease prevalence."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--การเลือกชุดทดสอบ-rule-in-และ-rule-out": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--การเลือกชุดทดสอบ-rule-in-และ-rule-out--v1",
          "statement": "Rule-in ใช้ test ที่มีความจำเพาะสูง (Spec สูง) เพราะ false positive น้อย ผลบวกจึงบอกว่าเป็นโรคจริงได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29209603",
              "locator": "Full text (PMC5701930), Uses and Misuses of Sensitivity and Specificity",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Expressed differently, high specificity permits people to be confidently regarded as having a condition if their diagnostic test yields a positive result. They can be “ruled in”"
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--serial-testing-และ-parallel-testing": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--serial-testing-และ-parallel-testing--v1",
          "statement": "Serial testing decrease sensitivity but increase specificity และ Parallel testing increase sensitivity but decrease specificity",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-chapter-1-1-6-validation-of-diagnostic-assays-for-infect",
              "locator": "Section A.1, box 'Multiple testing'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Series testing increases DSp but decreases DSe and increases PV+ and LR+."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--การเลือก-cut-point-roc-curve-และ-youden-j-index": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--การเลือก-cut-point-roc-curve-และ-youden-j-index--v1",
          "statement": "Youden index (J) เป็นค่าสรุปของ ROC curve ที่ใช้เลือก cut-point ของ test",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16161804",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The Youden Index is a frequently used summary measure of the ROC (Receiver Operating Characteristic) curve. It both, measures the effectiveness of a diagnostic marker and enables the selection of an optimal threshold value (cutoff point) for the marker."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--เกณฑ์เลือกเครื่องมือคัดกรอง-และหัวข้อให้ศึกษาเพิ่ม": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--เกณฑ์เลือกเครื่องมือคัดกรอง-และหัวข้อให้ศึกษาเพิ่ม--v1",
          "statement": "เครื่องมือ (test) สำหรับคัดกรองโรคต้องปลอดภัย และถูกต้องแม่นยำ คือมี sensitivity และ specificity เพียงพอ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-disease-screening-statistics-teaching-tools-1999",
              "locator": "What criteria should be considered for an effective screening program?",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Suitability criteria includes adequate sensitivity and specificity, low cost, ease of administration, safe,"
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--module-1-เป้าหมายของบทเรียน-pre-lab-diagnostic-tools": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--module-1-เป้าหมายของบทเรียน-pre-lab-diagnostic-tools--v1",
          "statement": "Screening: prioritize sensitivity และ Confirmation: prioritize specificity",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-chapter-1-1-6-validation-of-diagnostic-assays-for-infect",
              "locator": "Section A.1, box 'Multiple testing'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Confirmatory testing follows the series testing approach because a positive result from a screening test (high DSe) needs to be confirmed by a second test with a high DSp."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--module-1-คำถามวินิจฉัยและ-reference-standard": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--module-1-คำถามวินิจฉัยและ-reference-standard--v1",
          "statement": "เราประเมิน test เทียบกับ reference standard แต่ต้องประเมินด้วยว่า reference standard นั้นเชื่อถือได้หรือไม่ เพราะ reference standard ที่ไม่สมบูรณ์ทำให้ค่า sensitivity และ specificity ที่ประเมินได้คลาดเคลื่อน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-chapter-1-1-6-validation-of-diagnostic-assays-for-infect",
              "locator": "Section B.2.2 Samples from animals of unknown status",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "When the so-called reference standard (true infection status) is imperfect, which is the rule with any diagnostic tests used to test field samples, estimates of DSe and DSp for the candidate assay based on this standard will be flawed."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--module-1-ตาราง-2x2-วัว-1-000-ตัว": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--module-1-ตาราง-2x2-วัว-1-000-ตัว--v1",
          "statement": "90% sensitivity ไม่ได้แปลว่าสัตว์ผลบวกมีโอกาสติดเชื้อ 90% คำถามนั้นเป็นเรื่องของ PPV",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29209603",
              "locator": "Full text (PMC5701930), Summary Regarding Definitions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the values for those two metrics should not be relied on when making decisions about individual people in screening situations. In that second context, use of PPVs and NPVs is more appropriate."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--module-1-prevalence-กับ-predictive-values": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--module-1-prevalence-กับ-predictive-values--v1",
          "statement": "Sensitivity และ specificity เป็นคุณสมบัติของ test ส่วน PPV และ NPV ขึ้นกับด้วยว่าการติดเชื้อพบบ่อยแค่ไหนในประชากรที่ตรวจ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-chapter-1-1-6-validation-of-diagnostic-assays-for-infect",
              "locator": "Section B.4.2 Interpretation of test results",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "predictive values are not inherent characteristics of a specific diagnostic test, but are a function of its DSe and DSp and the local prevalence of infection in a defined population at a given point in time."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--module-1-เลือก-test-ให้ตรงกับการตัดสินใจ": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--module-1-เลือก-test-ให้ตรงกับการตัดสินใจ--v1",
          "statement": "Test performance ควรได้รับการพิสูจน์ (validated) สำหรับ species และการใช้งานที่ตั้งใจ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-chapter-1-1-6-validation-of-diagnostic-assays-for-infect",
              "locator": "Introduction",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "All diagnostic assays regardless of whether they are used in the laboratory or as point-of-care tests should be validated for the species and specimen in which they will be used."
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--module-1-freedom-from-infection-monitoring-surveillance-และ-timi": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--module-1-freedom-from-infection-monitoring-surveillance-และ-timi--v1",
          "statement": "จำนวนตัวอย่างที่ต้องสุ่มเพื่อให้ตรวจพบการติดเชื้อได้ตามเป้า ขึ้นกับ design prevalence และ test sensitivity ของการตรวจรายตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-sample-size-to-achieve-specified-population-level-or-her",
              "locator": "Page description, Outputs list",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Required sample size for the given target population sensitivity, design prevalence and unit sensitivity"
          }
        }
      ]
    },
    "epidemiology--epidem-dx-screening--module-1-parallel-or-กับ-serial-and": {
      "claims": [
        {
          "id": "epidemiology--epidem-dx-screening--module-1-parallel-or-กับ-serial-and--v1",
          "statement": "สูตรคูณ Se และ Sp ของ parallel และ serial testing อาศัย conditional independence ถ้า test มี correlated errors ต้องประเมินประสิทธิภาพรวมจริงตามนั้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10802336",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Compared with values expected if tests are conditionally independent, a positive dependence in test sensitivity reduces the sensitivity of parallel test interpretation and a positive dependence in test specificity reduces the specificity of serial interpretation."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-software": {
    "epidemiology--epidem-software--openepi-หน้าคำนวณที่สไลด์ใช้-และค่าที่กรอก": {
      "claims": [
        {
          "id": "epidemiology--epidem-software--openepi-หน้าคำนวณที่สไลด์ใช้-และค่าที่กรอก--v1",
          "statement": "ช่อง Design effect (DEFF) ใส่ 1.0 for random sample และใส่ค่าอื่นสำหรับ complex sample surveys",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-documentation-for-sample-size-for-a-proportion-kevin-m-s",
              "locator": "Input values: Design Effect",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "if simple random sampling is to be used to select individuals (or whatever the element of analysis), then the design effect (DEFF) should be left as one. If a cluster-type survey is being used in the sampling methodology, the DEFF is frequently larger than one"
          }
        }
      ]
    },
    "epidemiology--epidem-software--more-formulas-epitools-และ-g-power": {
      "claims": [
        {
          "id": "epidemiology--epidem-software--more-formulas-epitools-และ-g-power--v1",
          "statement": "FreeCalc เป็นการคำนวณ sample size เพื่อพิสูจน์ disease freedom สำหรับ imperfect tests",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9541947",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This paper presents a new formula that calculates the exact probability of detecting diseased animals, and considers both imperfect tests and finite population size."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-observational-study": {
    "epidemiology--epidem-observational-study--เริ่มจากคำถาม-แล้วจึงเลือกแบบการศึกษา": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--เริ่มจากคำถาม-แล้วจึงเลือกแบบการศึกษา--v1",
          "statement": "เมื่อผลลัพธ์หายาก (rare disease) แบบการศึกษาที่มักเหมาะคือ case-control study",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12533370",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Case controlled studies compare groups retrospectively. They seek to identify possible predictors of outcome and are useful for studying rare diseases or outcomes."
          }
        }
      ]
    },
    "epidemiology--epidem-observational-study--objective-และ-measurement": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--objective-และ-measurement--v1",
          "statement": "Risk (cumulative incidence) คือจำนวน new cases หารด้วยจำนวนสัตว์ที่ปลอดโรคตอนเริ่มต้น (initially disease-free) ในช่วงเวลาที่กำหนด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 2 (Incidence proportion or risk)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Incidence proportion is the proportion of an initially disease-free population that develops disease"
          }
        }
      ]
    },
    "epidemiology--epidem-observational-study--design-1-cross-sectional-study": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--design-1-cross-sectional-study--v1",
          "statement": "Cross-sectional study วัดความชุก (prevalence) ของโรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 1, Section 7 (Analytic epidemiology: cross-sectional studies)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The cross-sectional study tends to assess the presence (prevalence) of the health outcome"
          }
        }
      ]
    },
    "epidemiology--epidem-observational-study--design-2-cohort-study": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--design-2-cohort-study--v1",
          "statement": "Cohort study เริ่มจากสถานะ exposure แล้วติดตามเปรียบเทียบการเกิดโรคระหว่างกลุ่ม Exposed กับ Unexposed",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 1, Section 7 (Analytic epidemiology: cohort studies)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the investigator compares the disease rate in the exposed group with the disease rate in the unexposed group."
          }
        }
      ]
    },
    "epidemiology--epidem-observational-study--design-3-case-control-study": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--design-3-case-control-study--v1",
          "statement": "Case-control เลือกจาก outcome คือ Cases (Disease +) และ Controls (Disease −) แล้วมองย้อนอดีตหา exposure",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35656416",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "After cases and controls are identified, researchers \"look back\" to determine what past events (exposures), if any, are significantly associated with caseness."
          }
        }
      ]
    },
    "epidemiology--epidem-observational-study--เทียบแบบการศึกษาเคียงกัน": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--เทียบแบบการศึกษาเคียงกัน--v1",
          "statement": "ต้องการประมาณ current prevalence of infection ใช้ cross-sectional survey ตรงที่สุด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12533370",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Cross sectional studies are used to determine prevalence. They are relatively quick and easy but do not permit distinction between cause and effect."
          }
        }
      ]
    },
    "epidemiology--epidem-observational-study--จากตาราง-2-2-สู่-or-rr-pr-ar-และ-chi-square": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--จากตาราง-2-2-สู่-or-rr-pr-ar-และ-chi-square--v1",
          "statement": "Odds ratio (OR) เป็น measure ที่ใช้เด่นใน case-control",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 5 (Odds ratio)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The odds ratio is the measure of choice in a case-control study"
          }
        }
      ]
    },
    "epidemiology--epidem-observational-study--validity-random-error-bias-confounding-interaction": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--validity-random-error-bias-confounding-interaction--v1",
          "statement": "Confounder (C) ต้องสัมพันธ์กับทั้ง exposure (E) และ outcome (Y) และไม่อยู่ใน causal pathway ระหว่าง E กับ Y",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20516714",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The first criterion is that the variable needs to be associated with the exposure. The second criterion is that the variable needs to be associated with the outcome or disease. The third criterion is that the variable should not be an intermediate variable"
          }
        }
      ]
    },
    "epidemiology--epidem-observational-study--นำไปใช้-exit-ticket-workshop-brucellosis-และ-checklist-สุดท้าย": {
      "claims": [
        {
          "id": "epidemiology--epidem-observational-study--นำไปใช้-exit-ticket-workshop-brucellosis-และ-checklist-สุดท้าย--v1",
          "statement": "เมื่อโรคพบได้น้อย (เช่น 1% ของฟาร์ม) ให้เลือก case-control โดยเริ่มจากโรคหายากแล้วเปรียบเทียบประวัติ exposure",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32658653",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Case-control studies are particularly appropriate for studying disease outbreaks, rare diseases, or outcomes of interest."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-sample-size": {
    "epidemiology--epidem-sample-size--ทำไมต้องสุ่มตัวอย่าง-และทำไมต้องคำนวณ-sample-size": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--ทำไมต้องสุ่มตัวอย่าง-และทำไมต้องคำนวณ-sample-size--v1",
          "statement": "ขนาดตัวอย่างเล็กไปทำให้พลาดผลที่มีจริง (missed effects, false negative) ส่วนใหญ่ไปทำให้สิ้นเปลืองทรัพยากร (wasted resources) และมีปัญหาจริยธรรม (ethical concerns)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24250214",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "If a researcher select less number of animals it may lead to missing of any significant difference even if it exist in population and if more number of animals selected then it may lead to unnecessary wastage of resources and may lead to ethical issues."
          }
        }
      ]
    },
    "epidemiology--epidem-sample-size--standard-deviation-standard-error-z-score-และ-confidence-interva": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--standard-deviation-standard-error-z-score-และ-confidence-interva--v1",
          "statement": "การกระจายของ sample mean วัดด้วย Standard Error of the mean (SE) ส่วน standard deviation (SD) วัดการกระจายของข้อมูล",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26045923",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "SD is the dispersion of data in a normal distribution. In other words, SD indicates how accurately the mean represents sample data. However the meaning of SEM includes statistical inference based on the sampling distribution. SEM is the SD of the theoretical distribution of the sample means"
          }
        }
      ]
    },
    "epidemiology--epidem-sample-size--hypothesis-testing-significance-level-power-และ-effect-size": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--hypothesis-testing-significance-level-power-และ-effect-size--v1",
          "statement": "Power = 1 − probability of false negative (type II error; β) และ significance level (α) คือความน่าจะเป็นของ Type I error",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33633058",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "a power analysis is performed to determine the sample size required to test an effect within allowable probabilities of Type I error (α) or Type II error (β). The power of a study is related to Type II error by 1-β."
          }
        }
      ]
    },
    "epidemiology--epidem-sample-size--sampling-unit-sampling-frame-และวิธีสุ่ม": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--sampling-unit-sampling-frame-และวิธีสุ่ม--v1",
          "statement": "วิธีสุ่มแบบ probability ได้แก่ simple random, systematic, stratified, cluster และ multistage sampling",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27356461",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There are five main types of probability sampling including simple random sampling, systematic sampling, stratified sampling, cluster sampling, and multi-stage sampling."
          }
        }
      ]
    },
    "epidemiology--epidem-sample-size--ก่อนคำนวณ-และสูตรสำหรับค่าเฉลี่ย-mean": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--ก่อนคำนวณ-และสูตรสำหรับค่าเฉลี่ย-mean--v1",
          "statement": "ไม่มีสูตรเดียวที่ใช้ได้กับทุกสถานการณ์ (Different questions need different formulas)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24049221",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "It is very important to understand that different study design need different method of sample size calculation and one formula cannot be used in all designs."
          }
        }
      ]
    },
    "epidemiology--epidem-sample-size--สัดส่วน-proportion-finite-population-imperfect-test-และ-freedom-": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--สัดส่วน-proportion-finite-population-imperfect-test-และ-freedom---v1",
          "statement": "Sample size สำหรับประมาณ prevalence คือ n₀ = Z²α/2 × p × (1 − p) / d²",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-sample-size-to-estimate-a-proportion-or-apparent-prevale",
              "locator": "formula section of the calculator page",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Sample size is calculated using the formula: n = (Z2 x P x (1 - P))/e2"
          }
        }
      ]
    },
    "epidemiology--epidem-sample-size--clustering-multi-stage-sampling-และการปรับสำหรับ-dropout-หรือข้อ": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--clustering-multi-stage-sampling-และการปรับสำหรับ-dropout-หรือข้อ--v1",
          "statement": "DEFF = 1 + (m − 1)ρ โดย m = the average number of subjects sampled per cluster และ ρ คือ intraclass correlation coefficient (ICC)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31024678",
              "locator": "full text (PMC6477104), letter body",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The value of Deff for prevalence estimation in a cross-sectional study depends on the average number of subjects sampled per cluster (n) as well as ICC: Deff= 1 + p (n – 1) p=ICC"
          }
        }
      ]
    },
    "epidemiology--epidem-sample-size--unmatched-case-control-และ-cohort-หรือ-rct": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--unmatched-case-control-และ-cohort-หรือ-rct--v1",
          "statement": "ในสูตร unmatched case-control r = ratio of controls to cases, p₁ = expected proportion of cases ที่มี exposure และ p₂ = expected proportion of controls ที่มี exposure",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-documentation-for-sample-size-for-an-unmatched-case-cont",
              "locator": "Kelsey formula variable definitions",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "r = ratio of controls to cases p 1 = proportion of cases with exposure and q 1 = 1 - p 1 p 2 = proportion of controls with exposure and q 2 = 1 - p 2"
          }
        }
      ]
    },
    "epidemiology--epidem-sample-size--แบบฝึกหัดและงานแล็บ": {
      "claims": [
        {
          "id": "epidemiology--epidem-sample-size--แบบฝึกหัดและงานแล็บ--v1",
          "statement": "การเพิ่ม sample size ไม่ได้ขจัด bias ซึ่งเป็นความคลาดเคลื่อนอย่างเป็นระบบ (Does increasing sample size eliminate selection bias? No)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38972732",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Even in studies with large sample sizes, which typically benefit from small variances in estimates, there is a risk of producing estimates that are precisely inaccurate if the study suffers from systematic errors or biases, including confounding bias."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-applied-stats": {
    "epidemiology--epidem-applied-stats--ชนิดของข้อมูลและชนิดของสถิติ": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--ชนิดของข้อมูลและชนิดของสถิติ--v1",
          "statement": "Ordinal คือ Qualitative (Categorical) data ที่มี ranked or ordered scale เช่น disease severity grade (mild, moderate, severe) ต่างจาก Nominal ที่ไม่มีลำดับ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11940268",
              "locator": "Introduction (PMC full text PMC137399)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Qualitative data fall into two categories: unordered qualitative data, such as ventilatory support (none, non-invasive, intermittent positive-pressure ventilation, oscillatory); and ordered qualitative data, such as severity of disease (mild, moderate, severe)."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--data-visualization-ตารางและกราฟ": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--data-visualization-ตารางและกราฟ--v1",
          "statement": "Bar chart ใช้กับ discrete or qualitative data โดยแท่งมี constant width และ length proportional to frequency",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 4, Section 4, Bar charts",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Appropriate data for bar charts include discrete data (e.g., race or cause of death) or variables treated as though they were discrete (age groups)."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--normal-distribution-และ-central-limit-theorem": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--normal-distribution-และ-central-limit-theorem--v1",
          "statement": "Central limit theorem: sufficiently large random samples ทำให้ distribution of the sample means will approximate a normal distribution ไม่ว่า population distribution จะมีรูปทรงใด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11983040",
              "locator": "From sample to population (PMC full text PMC137296)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "if the samples are sufficiently large (greater than approximately 30 in practice) then this distribution of sample means is known to be Normal, regardless of the underlying distribution of the population."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--data-summarization-measures-of-central-tendency": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--data-summarization-measures-of-central-tendency--v1",
          "statement": "Mean มี main disadvantage คือ affected by extreme observations ส่วน Median เป็น useful descriptive measure เมื่อมี extremely high or low values",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 2, Section 8",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The advantage of the median is that it is not affected by a few extremely high or low observations. Therefore, when a set of data is skewed, the median is more representative of the data than is the mean."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--measures-of-dispersion-และ-shape": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--measures-of-dispersion-และ-shape--v1",
          "statement": "Interquartile range (IQR) คือ difference between the 75th and 25th percentiles (IQR = Q3 − Q1)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 2, Section 7, Interquartile range",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The interquartile range is a measure of spread used most commonly with the median. It represents the central portion of the distribution, from the 25th percentile to the 75th percentile."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--inferential-statistics-estimation-และ-confidence-interval": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--inferential-statistics-estimation-และ-confidence-interval--v1",
          "statement": "95% confidence interval หมายถึงเรา 95% confident ว่าช่วงที่คำนวณจาก sample contains the true population mean (μ)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11983040",
              "locator": "The standard error and confidence interval (PMC full text PMC137296)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "given a 95% confidence interval based on a single sample, the investigator can be 95% confident that the true population mean (i.e. the real measurement of interest) lies somewhere within that range."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--hypothesis-testing-และ-p-value": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--hypothesis-testing-และ-p-value--v1",
          "statement": "p-value คือ probability of an observed (or more extreme) result assuming that the null hypothesis is true",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12133182",
              "locator": "What is a P value? (PMC full text PMC137449)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the probability of seeing the observed difference, or greater, just by chance if the null hypothesis is true."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--การเลือก-test-tests-of-significance": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--การเลือก-test-tests-of-significance--v1",
          "statement": "ANOVA ใช้เปรียบเทียบ ≥3 groups ภายใต้เงื่อนไข normal distribution & equal variance",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15025774",
              "locator": "Assumptions and limitations (PMC full text PMC420045)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The underlying assumptions for one-way analysis of variance are that the observations are independent and randomly selected from Normal populations with equal variances."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--parametric-tests-normality-z-test-t-test-anova": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--parametric-tests-normality-z-test-t-test-anova--v1",
          "statement": "ถ้า sample size ใหญ่พอ (> 30 or 40) การละเมิด normality assumption should not cause major problems",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23843808",
              "locator": "1. Background (PMC full text PMC3693611)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "With large enough sample sizes (> 30 or 40), the violation of the normality assumption should not cause major problems"
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--analysis-of-qualitative-variables-chi-squared-และ-fisher-s-exact": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--analysis-of-qualitative-variables-chi-squared-และ-fisher-s-exact--v1",
          "statement": "ถ้า expected counts เล็ก มักเลือก Fisher's exact test สำหรับ 2×2 table แทน Chi-squared test",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14975045",
              "locator": "Limitations (PMC full text PMC420070)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "For two by two tables, Yates' correction or Fisher's exact test can be used when the samples are small."
          }
        }
      ]
    },
    "epidemiology--epidem-applied-stats--correlation-และ-linear-regression": {
      "claims": [
        {
          "id": "epidemiology--epidem-applied-stats--correlation-และ-linear-regression--v1",
          "statement": "Correlation วัด closeness of the association ระหว่าง 2 continuous variables ส่วน Linear regression ให้ equation of the straight line ที่ใช้ prediction ตัวแปรหนึ่งจากอีกตัวแปรหนึ่ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14624685",
              "locator": "Introduction (PMC full text PMC374386)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Correlation quantifies the strength of the linear relationship between a pair of variables, whereas regression expresses the relationship in the form of an equation."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-current-research": {
    "epidemiology--epidem-current-research--big-data-จาก-record-รายตัวสู่-population-intelligence": {
      "claims": [
        {
          "id": "epidemiology--epidem-current-research--big-data-จาก-record-รายตัวสู่-population-intelligence--v1",
          "statement": "Public reports (news and reports of unusual deaths) ใช้ generate signals for investigation ผ่านระบบ machine-learning surveillance ด้านสุขภาพสัตว์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34950760",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "PADI-web (Platform for Automated extraction of animal Disease Information from the web) is a biosurveillance system dedicated to monitoring online news sources for the detection of emerging animal infectious diseases."
          }
        }
      ]
    },
    "epidemiology--epidem-current-research--ai-ผู้ช่วยที่ยังต้องใช้-judgment": {
      "claims": [
        {
          "id": "epidemiology--epidem-current-research--ai-ผู้ช่วยที่ยังต้องใช้-judgment--v1",
          "statement": "headline accuracy ซ่อน sensitivity เป็นศูนย์ได้เมื่อโรคพบน้อย: เมื่อสัตว์ปกติมีมากกว่าสัตว์ป่วยมาก accuracy อาจสูงเกินจริงขณะที่ PPV ต่ำ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36683137",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "can distort measures of predictive accuracy in misleading ways, and make the overall predictive accuracy and the discriminatory ability of a predictive model appear spuriously high."
          }
        }
      ]
    },
    "epidemiology--epidem-current-research--complex-disease-systems-และ-one-health": {
      "claims": [
        {
          "id": "epidemiology--epidem-current-research--complex-disease-systems-และ-one-health--v1",
          "statement": "One Health thinking ต้องให้หลายฝ่าย (veterinarian, human-health team, environmental team, laboratory specialists, farmers, local authorities) ทำงานร่วมกัน เพราะสุขภาพคน สัตว์ และสิ่งแวดล้อมเชื่อมกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35737670",
              "locator": "Box 1, Definition (PMC full text PMC9223325)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The approach mobilizes multiple sectors, disciplines, and communities at varying levels of society to work together to foster well-being and tackle threats to health and ecosystems"
          }
        }
      ]
    },
    "epidemiology--epidem-current-research--amr-ปัญหาเชิงระบบ-ไม่ใช่ปัญหาจากแหล่งเดียว": {
      "claims": [
        {
          "id": "epidemiology--epidem-current-research--amr-ปัญหาเชิงระบบ-ไม่ใช่ปัญหาจากแหล่งเดียว--v1",
          "statement": "อย่านำเสนอ livestock เป็นแหล่งเดียวของ Antimicrobial resistance หรือคิดว่าการแพร่ไปทางเดียว เพราะ AMR ขับเคลื่อนจากการใช้ยาและการแพร่เชื้อดื้อยาข้าม human, animal และ environmental sectors",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29600770",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The drivers of antimicrobial resistance include antimicrobial use and abuse in human, animal, and environmental sectors and the spread of resistant bacteria and resistance determinants within and between these sectors and around the globe."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-outbreak-investigation": {
    "epidemiology--epidem-outbreak-investigation--module-3-เป้าหมายของบทเรียน-pre-lab-outbreak-investigation": {
      "claims": [
        {
          "id": "epidemiology--epidem-outbreak-investigation--module-3-เป้าหมายของบทเรียน-pre-lab-outbreak-investigation--v1",
          "statement": "Case-fatality proportion เป็นคำที่แม่นยำกว่า fatality rate เพราะค่านี้เป็น proportion ไม่ใช่ rate",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 3 (Mortality frequency measures, case-fatality rate)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The case-fatality rate is the proportion of persons with a particular condition (cases) who die from that condition. ... The case-fatality rate is a proportion, not a true rate."
          }
        }
      ]
    },
    "epidemiology--epidem-outbreak-investigation--module-3-case-definition": {
      "claims": [
        {
          "id": "epidemiology--epidem-outbreak-investigation--module-3-case-definition--v1",
          "statement": "อย่าใส่ exposure ที่กำลังสอบสวนลงใน case definition เพราะจะประเมิน exposure นั้นอย่างเป็นธรรมไม่ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 6, Section 2, Step 4: Construct a working case definition",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The case definition must not include the exposure or risk factor you are interested in evaluating."
          }
        }
      ]
    },
    "epidemiology--epidem-outbreak-investigation--module-3-หา-case-และสร้าง-line-list": {
      "claims": [
        {
          "id": "epidemiology--epidem-outbreak-investigation--module-3-หา-case-และสร้าง-line-list--v1",
          "statement": "line list บันทึกหนึ่งแถวต่อสัตว์หนึ่งตัว (one row per case)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 6, Section 2, Step 5: Find cases systematically and record information (line listing)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "while each row represents a different case"
          }
        }
      ]
    },
    "epidemiology--epidem-outbreak-investigation--module-3-population-at-risk-และ-time-at-risk": {
      "claims": [
        {
          "id": "epidemiology--epidem-outbreak-investigation--module-3-population-at-risk-และ-time-at-risk--v1",
          "statement": "Incidence rate ใช้ time at risk ที่สะสมของสัตว์ทุกตัวเป็นตัวหาร ส่วน incidence proportion ใช้ประชากรตอนเริ่ม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 2 (Incidence rate / person-time rate)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Incidence rate or person-time rate is a measure of incidence that incorporates time directly into the denominator. ... The denominator is the sum of the time each person was observed, totaled for all persons."
          }
        }
      ]
    },
    "epidemiology--epidem-outbreak-investigation--module-3-หกค่าของ-disease-frequency": {
      "claims": [
        {
          "id": "epidemiology--epidem-outbreak-investigation--module-3-หกค่าของ-disease-frequency--v1",
          "statement": "attack rate คือ cumulative incidence ที่ใช้กับ outbreak และเป็น proportion (risk) ไม่ใช่ animal-time rate",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 2 (Incidence proportion or risk)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Synonyms include attack rate, risk, probability of getting disease, and cumulative incidence."
          }
        }
      ]
    },
    "epidemiology--epidem-outbreak-investigation--module-3-epidemic-curve-และรูปแบบ-outbreak": {
      "claims": [
        {
          "id": "epidemiology--epidem-outbreak-investigation--module-3-epidemic-curve-และรูปแบบ-outbreak--v1",
          "statement": "Mixed outbreak มี peak แบบ common source ช่วงแรก ตามด้วย secondary spread (propagated)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 1, Section 11: Epidemic Disease Occurrence (patterns of epidemics)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Some epidemics have features of both common-source epidemics and propagated epidemics"
          }
        }
      ]
    },
    "epidemiology--epidem-outbreak-investigation--module-3-index-case-incubation-period-และ-exposure-window": {
      "claims": [
        {
          "id": "epidemiology--epidem-outbreak-investigation--module-3-index-case-incubation-period-และ-exposure-window--v1",
          "statement": "Incubation period คือช่วงจากการติดเชื้อถึงเริ่มมีอาการทางคลินิก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 1, Section 9: Natural History and Spectrum of Disease",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This stage of subclinical disease, extending from the time of exposure to onset of disease symptoms, is usually called the incubation period for infectious diseases, and the latency period for chronic diseases."
          }
        }
      ]
    },
    "epidemiology--epidem-outbreak-investigation--module-3-เทียบ-exposure-milk-batch-x": {
      "claims": [
        {
          "id": "epidemiology--epidem-outbreak-investigation--module-3-เทียบ-exposure-milk-batch-x--v1",
          "statement": "เทียบ attack rate ของกลุ่มที่ได้รับ exposure (exposed) กับกลุ่มที่ไม่ได้รับ (unexposed) แล้วคิด RR = AR exposed / AR unexposed",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 6, Section 2, Step 8: Evaluate hypotheses epidemiologically",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The attack rate is high among those exposed to the item ... The attack rate is low among those not exposed, so the difference or ratio between attack rates is high."
          }
        }
      ]
    }
  },
  "epidemiology--epidem-control-prevention": {
    "epidemiology--epidem-control-prevention--นิยาม-control-eradication-elimination": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--นิยาม-control-eradication-elimination--v1",
          "statement": "Disease control คือการลดการเกิดโรคให้อยู่ใน acceptable level ด้วยมาตรการที่ตั้งใจทำ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18309706",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Conventionally control of disease is defined as the reduction of disease burden to a locally acceptable level. Elimination of disease is defined as the reduction to zero of the incidence in a defined geographical area"
          }
        }
      ]
    },
    "epidemiology--epidem-control-prevention--ธรรมชาติของโรค-และปัจจัยสามทางระบาดวิทยา": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--ธรรมชาติของโรค-และปัจจัยสามทางระบาดวิทยา--v1",
          "statement": "ปัจจัยสามทางระบาดวิทยา (epidemiological triad) ได้แก่ ตัวสัตว์ (host) สิ่งแวดล้อม (environment) และตัวก่อโรค (agent)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 1, Section 8: Concepts of Disease Occurrence (epidemiologic triad)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The triad consists of an external agent, a susceptible host, and an environment that brings the host and agent together."
          }
        }
      ]
    },
    "epidemiology--epidem-control-prevention--หลักการป้องกันโรค-และการป้องกัน-3-ระดับ": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--หลักการป้องกันโรค-และการป้องกัน-3-ระดับ--v1",
          "statement": "การป้องกันปฐมภูมิ (primary prevention) ทำก่อนเกิดโรค โดยกำจัดหรือลดสาเหตุ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38233316",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Primary prevention efforts (eg, screening for antenatal risk factors, use of trauma-informed care) are aimed at preventing a traumatic childbirth experience and childbirth-related posttraumatic stress disorder in the first place by eliminating or reducing risk factors"
          }
        }
      ]
    },
    "epidemiology--epidem-control-prevention--เป้าหมาย-มาตรการ-และการจัดลำดับวิธีควบคุม": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--เป้าหมาย-มาตรการ-และการจัดลำดับวิธีควบคุม--v1",
          "statement": "stamping out คือการทำลายสัตว์ที่ป่วยและสัตว์ที่สงสัยว่าป่วยในฝูงทันที",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-terrestrial-animal-health-code-glossary-2018",
              "locator": "Glossary, entry 'Stamping-out policy', item a)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the killing of the animals which are affected and those suspected of being affected in the herd or flock and,"
          }
        }
      ]
    },
    "epidemiology--epidem-control-prevention--กรณีศึกษาไข้หวัดนก-ความเป็นมาและการระบาดในไทย": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--กรณีศึกษาไข้หวัดนก-ความเป็นมาและการระบาดในไทย--v1",
          "statement": "ตรวจพบ HPAI ครั้งแรกในไทยเดือนมกราคม 2547 จากฟาร์มไก่ไข่ในจังหวัดสุพรรณบุรี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16318716",
              "locator": "Full text (PMC3367332), Poultry in Thailand and HPAI Virus Introduction",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "On January 23, 2004, the Thai national reference laboratory (National Institute of Animal Health [NIAH]) officially confirmed the presence of an H5 HPAI virus in a layer chicken farm in Suphanburi Province"
          }
        }
      ]
    },
    "epidemiology--epidem-control-prevention--ไข้หวัดนก-การทำลายสัตว์-การควบคุมเคลื่อนย้าย-และการจัดเขต": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--ไข้หวัดนก-การทำลายสัตว์-การควบคุมเคลื่อนย้าย-และการจัดเขต--v1",
          "statement": "ประเทศไทยควบคุมไข้หวัดนกด้วยการทำลายสัตว์ปีก (stamping out) และจ่ายค่าชดใช้ทำลายสัตว์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16318716",
              "locator": "Full text (PMC3367332), Consequences of Epidemic",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The Thai government used a stamping-out policy to control HPAI outbreaks and compensated farmers for their losses."
          }
        }
      ]
    },
    "epidemiology--epidem-control-prevention--ไข้หวัดนก-การเฝ้าระวัง-นิยามโรค-การสอบสวน-biosecurity-และประชาสั": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--ไข้หวัดนก-การเฝ้าระวัง-นิยามโรค-การสอบสวน-biosecurity-และประชาสั--v1",
          "statement": "ตัวอย่าง (เช่น cloacal swab) ส่งสถาบันสุขภาพสัตว์แห่งชาติ และตรวจด้วย Isolation by egg inoculation",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16318716",
              "locator": "Full text (PMC3367332), Control Measures: Surveillance and Diagnosis",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Swab samples as well as sick or dead bird specimens were submitted to NIAH or regional laboratories. All samples were processed for virus isolation in embryonated chicken eggs"
          }
        }
      ]
    },
    "epidemiology--epidem-control-prevention--module-4-monitoring-surveillance-และความถี่ของการทำงาน": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--module-4-monitoring-surveillance-และความถี่ของการทำงาน--v1",
          "statement": "Surveillance คือการเก็บ วิเคราะห์ แปลผล และสื่อสารข้อมูลสุขภาพอย่างเป็นระบบ เพื่อให้ลงมือได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-terrestrial-animal-health-code-glossary-2018",
              "locator": "Glossary, entry 'Surveillance'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "means the systematic ongoing collection, collation, and analysis of information related to animal health"
          }
        }
      ]
    },
    "epidemiology--epidem-control-prevention--module-4-ประเมินผลโปรแกรม-เศรษฐกิจสังคม-และ-roadmap": {
      "claims": [
        {
          "id": "epidemiology--epidem-control-prevention--module-4-ประเมินผลโปรแกรม-เศรษฐกิจสังคม-และ-roadmap--v1",
          "statement": "Relative reduction = (1 − RR) × 100",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-centers-for-disease-co-na",
              "locator": "Lesson 3, Section 6: Measures of Public Health Impact (vaccine efficacy)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Vaccine efficacy and vaccine effectiveness measure the proportionate reduction in cases among vaccinated persons. ... Alternatively, VE = 1 − RR = 1 − 0.28 = 72%"
          }
        }
      ]
    }
  },
  "epidemiology--epidem-govt-policy": {
    "epidemiology--epidem-govt-policy--woah-terrestrial-animal-health-code": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--woah-terrestrial-animal-health-code--v1",
          "statement": "Terrestrial Animal Health Code เป็นมาตรฐานเพื่อปรับปรุงสุขภาพสัตว์ สวัสดิภาพสัตว์ และสาธารณสุขสัตวแพทย์ทั่วโลก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-terrestrial-animal-health-code-user-s-guide-2024",
              "locator": "User's guide, Introduction",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The WOAH Terrestrial Animal Health Code (hereafter referred to as the Terrestrial Code) establishes standards for the improvement of terrestrial animal health and welfare and veterinary public health worldwide."
          }
        }
      ]
    },
    "epidemiology--epidem-govt-policy--รายชื่อโรคของ-woah-และเงื่อนไขการขึ้นบัญชี": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--รายชื่อโรคของ-woah-และเงื่อนไขการขึ้นบัญชี--v1",
          "statement": "เงื่อนไขในการกำหนดโรคใน LIST ของ WOAH ได้แก่ มีการระบาดข้ามประเทศ และมีประเทศที่สามารถปลอดโรคได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-terrestrial-animal-health-code-chapter-1-2-criteria-for",
              "locator": "Article 1.2.2",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "International spread of the pathogenic agent (via live animals or their products, vectors or fomites) has been proven. AND At least one country has demonstrated freedom or impending freedom from the disease, infection or infestation in populations of susceptible animals"
          }
        }
      ]
    },
    "epidemiology--epidem-govt-policy--กรอบแผนปฏิบัติการ-กฎหมาย-และ-one-health": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--กรอบแผนปฏิบัติการ-กฎหมาย-และ-one-health--v1",
          "statement": "กฎหมายด้านการปศุสัตว์ฉบับหนึ่งคือ พรบ.โรคระบาดสัตว์ ปี พ.ศ. 2558",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-animal-epidemics-act-b-e-2558-2015-english-translation-p",
              "locator": "Section 1",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Section 1.  This Act is called the “Animal Epidemics Act, B.E. 2558 (2015)”."
          }
        }
      ]
    },
    "epidemiology--epidem-govt-policy--การเฝ้าระวังโรค-surveillance-และการรายงานโรค": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--การเฝ้าระวังโรค-surveillance-และการรายงานโรค--v1",
          "statement": "Risk-based veterinary surveillance ใช้วิธี exposure and risk assessment ร่วมกับการออกแบบแบบดั้งเดิม เพื่อให้การเก็บข้อมูลเหมาะสมและ cost-effective",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-world-organisation-for-na",
              "locator": "Article 1.4.4, Risk-based methods",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Risk-based methods should be based on a risk assessment and are useful to optimise the use of surveillance resources."
          }
        }
      ]
    },
    "epidemiology--epidem-govt-policy--การเสริมสร้างภูมิคุ้มกันโรค-โปรแกรมวัคซีน": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--การเสริมสร้างภูมิคุ้มกันโรค-โปรแกรมวัคซีน--v1",
          "statement": "โปรแกรมการรณรงค์ฉีดวัคซีน FMD ในโคนม (Dairy cattle) ทำ 3 ครั้งต่อปี (3 times a year)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32204373",
              "locator": "free full text (PMC7143784), section 4. Discussion",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In this study, we examined the effects of vaccine administration because vaccination programs were applied three times a year to all dairy farms as recommended by the DLD [36]."
          }
        }
      ]
    },
    "epidemiology--epidem-govt-policy--การควบคุมเคลื่อนย้ายสัตว์-และการประเมินความเสี่ยงการนำเข้า": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--การควบคุมเคลื่อนย้ายสัตว์-และการประเมินความเสี่ยงการนำเข้า--v1",
          "statement": "การควบคุมเคลื่อนย้ายสัตว์ ซากสัตว์ระหว่างประเทศ ใช้ Health requirement และ Health certification",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-terrestrial-animal-health-code-chapter-5-1-general-oblig",
              "locator": "Article 5.1.1",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Veterinary Authorities of Member Countries should base their import requirements on the standards of WOAH. These requirements should be included in the model certificates approved by WOAH which are included from Chapters 5.10. to 5.12."
          }
        }
      ]
    },
    "epidemiology--epidem-govt-policy--การปรับระบบการป้องกันโรคในฟาร์ม-gfm-และมาตรา-7": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--การปรับระบบการป้องกันโรคในฟาร์ม-gfm-และมาตรา-7--v1",
          "statement": "มาตรา 7 แห่งพระราชบัญญัติโรคระบาดสัตว์ พ.ศ.2558 กำหนดว่าเจ้าของสัตว์ (ช้าง ม้า โค กระบือ แพะ แกะ กวาง สุกร หมูป่า, สุนัข และแมว, นก ไก่ เป็ด ห่าน) มีหน้าที่ป้องกันและควบคุมโรคระบาด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-animal-epidemics-act-b-e-2558-2015-english-translation-p",
              "locator": "Section 7",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Section 7. For the purpose of prevention and control of epidemics, an owner of the following animals shall comply with the prevention and control system for epidemics: (1) elephant, horse, cow, buffalo, goat, sheep, deer, pig, wild boar; (2) dog, cat; (3) bird, chicken, duck, goose;"
          }
        }
      ]
    },
    "epidemiology--epidem-govt-policy--การควบคุมโรค-outbreak-response-ตาม-พ-ร-บ-โรคระบาดสัตว์-พ-ศ-2558": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--การควบคุมโรค-outbreak-response-ตาม-พ-ร-บ-โรคระบาดสัตว์-พ-ศ-2558--v1",
          "statement": "มาตรการภายใต้ พ.ร.บ.โรคระบาดสัตว์ พ.ศ. 2558 รวมถึงการทำความสะอาดและทำลายเชื้อโรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-animal-epidemics-act-b-e-2558-2015-english-translation-p",
              "locator": "Section 13 (6)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "(6) to clean up and disinfect epidemic pathogens in the area where epidemic pathogens exist or are suspected of existing, in accordance with the prescribed methods."
          }
        }
      ]
    },
    "epidemiology--epidem-govt-policy--ฟาร์มและพื้นที่ปลอดโรค-ข้อมูลการผลิต-televet-และการประชาสัมพันธ์": {
      "claims": [
        {
          "id": "epidemiology--epidem-govt-policy--ฟาร์มและพื้นที่ปลอดโรค-ข้อมูลการผลิต-televet-และการประชาสัมพันธ์--v1",
          "statement": "การสร้างพื้นที่ปลอดโรคปากและเท้าเปื่อยในภาคตะวันออกของประเทศไทย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35275134",
              "locator": "abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-14",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This paper proposes an evaluation framework and assessment tools for use in the evaluation of the current foot and mouth disease (FMD) control policies in Thailand and their implementation in the eastern region of the country (the proposed FMD-free zone)."
          }
        }
      ]
    }
  }
};
