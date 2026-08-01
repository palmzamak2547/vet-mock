// ============================================================
// VetWiki — machine-generated verification overlay
// ============================================================
// Written by `node scripts/ingest-verifications.mjs <claims> --subject <id> --write`.
// DO NOT hand-edit: the next ingest run rewrites this file wholesale.
//
// Hand-curated overlays live in ./verification.js, which deep-merges this file
// on top of them. The split exists because these two must never collide:
// appending a second `'com5--rabies': {...}` key to one object literal is
// last-one-wins, which silently deleted three hand-verified rabies claims the
// first time this pipeline ran a subject that already had an overlay. The unit
// test caught it. Merging in code instead of concatenating text makes that
// class of loss impossible.
//
// Every claim here cites a source whose identifier was resolved against NCBI
// E-utilities or Crossref, with the returned title compared to the registered
// one, before it was written.
// ============================================================

/** @type {Record<string, Record<string, {claims: object[]}>>} */
export const GENERATED_VERIFICATIONS = {
  "com5--rabies": {
    "com5--rabies--transmission-pathogenesis": {
      "claims": [
        {
          "id": "com5--rabies--transmission-pathogenesis--v1",
          "statement": "สุนัขที่ติดเชื้อสามารถขับ rabies virus ออกทางน้ำลายได้ตั้งแต่ก่อนแสดงอาการ โดยการทดลองพบขับเชื้อได้นานถึง 7 วันก่อนแสดงอาการใน Mexican strain และนานถึง 13 วันก่อนแสดงอาการใน Ethiopian strain",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7077094",
              "locator": "145(5):715-9",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Four of these dogs excreted virus in the saliva up to 13 days before signs of disease were observed. ... Eight of these dogs also excreted virus in the saliva up to seven days before signs of disease were observed. These findings indicate t"
          }
        }
      ]
    },
    "com5--rabies--diagnosis": {
      "claims": [
        {
          "id": "com5--rabies--diagnosis--v1",
          "statement": "direct rapid immunohistochemical test (dRIT) ตรวจหา rabies virus antigen ในตัวอย่างสมองภาคสนามที่แช่แข็งหรือเก็บถนอมใน glycerol ได้ และในการประเมินภาคสนามให้ความไวและความจำเพาะ 100% เมื่อเทียบกับ direct fluorescent antibody test (DFA) ซึ่งเป็นวิธีมาตรฐานเดิม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16494761",
              "locator": "12(2):310-3",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A direct rapid immunohistochemical test (dRIT) was evaluated under field and laboratory conditions to detect rabies virus antigen in frozen and glycerol-preserved field brain samples from northwestern Tanzania. Compared to the direct fluore"
          }
        }
      ]
    },
    "com5--rabies--post-exposure-สัตว์": {
      "claims": [
        {
          "id": "com5--rabies--post-exposure-สัตว์--v1",
          "statement": "สุนัขและแมวที่เคยได้รับวัคซีนพิษสุนัขบ้าแต่ขาดช่วง (out-of-date) ตอบสนองต่อการฉีดกระตุ้นได้ไม่ด้อยกว่าตัวที่ฉีดครบตามกำหนด โดยสัตว์ทุกตัวมี antirabies antibody titer ≥ 0.5 IU/mL ภายใน 5-15 วันหลัง booster ซึ่งสนับสนุนแนวทางฉีดกระตุ้นทันทีแล้วสังเกตอาการ 45 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25554936",
              "locator": "246(2):205-11",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "All animals had an antirabies antibody titer ≥ 0.5 IU/mL 5 to 15 days after booster vaccination. ... Findings supported immediate booster vaccination followed by observation for 45 days of dogs and cats with an out-of-date vaccination statu"
          }
        }
      ]
    },
    "com5--rabies--animal-management-สัตว์ที่กัดคน": {
      "claims": [
        {
          "id": "com5--rabies--animal-management-สัตว์ที่กัดคน--v1",
          "statement": "ในสุนัข 957 ตัวและแมว 94 ตัวที่ยืนยันว่าเป็นโรคพิษสุนัขบ้า ทุกตัวตายภายในไม่เกิน 10 วันหลังเข้ารับการกักสังเกตอาการ จึงรองรับแนวทางกักขังและสังเกตอาการสัตว์ที่กัดคนเป็นเวลา 10 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15307040",
              "locator": "39(2):278-80",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A total of 1820 dogs and 332 cats that appeared ill or had bitten humans or animals were observed for ≥10 days. Of these, 957 dogs and 94 cats that were confirmed to be rabid survived <10 days after admission to our institution. This study "
          }
        }
      ]
    },
    "com5--rabies--post-exposure-คน-who-thai-categories": {
      "claims": [
        {
          "id": "com5--rabies--post-exposure-คน-who-thai-categories--v1",
          "statement": "WHO แบ่งการสัมผัสสัตว์สงสัยโรคพิษสุนัขบ้าเป็น 3 category: category I (สัมผัสตัวหรือให้อาหารสัตว์ ถูกเลียที่ผิวหนังปกติ) ล้างผิวหนังที่สัมผัส ไม่ต้องให้ PEP; category II (งับผิวหนังที่ไม่มีสิ่งปกคลุม ข่วนหรือถลอกโดยไม่มีเลือดออก) ล้างแผล + ฉีดวัคซีนทันที; category III (กัดหรือข่วนทะลุผิวหนังหนึ่งหรือหลายแผล น้ำลายสัมผัสเยื่อเมือกหรือผิวหนังที่มีแผล และการสัมผัสค้างคาวโดยตรง) ล้างแผล + ฉีดวัคซีนทันที + ให้ rabies immunoglobulin หรือ monoclonal antibody โดยการล้างแผลให้ล้างด้วยน้ำและสบู่อย่างน้อย 15 นาที",
          "evidenceStatus": "expert-consensus",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-world-health-organizat-2024",
              "locator": "Table \"Categories of contact with suspect rabid animal\" and the post-exposure prophylaxis section (fact sheet last updated 5 June 2024)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Category I \"touching or feeding animals, animal licks on intact skin\" requires \"Washing of exposed skin surfaces, no PEP\"; Category II \"nibbling of uncovered skin, minor scratches or abrasions without bleeding\" requires \"Wound washing and i"
          }
        }
      ]
    },
    "com5--rabies--หลัก-3-ป-คาถา-5-ย": {
      "claims": [
        {
          "id": "com5--rabies--หลัก-3-ป-คาถา-5-ย--v1",
          "statement": "ประเทศไทยเริ่มโครงการกำจัดโรคพิษสุนัขบ้าในสัตว์ระดับชาติในปี 2012 โดยตั้งเป้ากำจัดโรคภายในปี 2020 และมากกว่า 90% ของผู้เสียชีวิตด้วยโรคพิษสุนัขบ้าในไทยเป็นผู้ที่ไม่ได้รับ post-exposure prophylaxis หรือหยุดรับ PEP กลางคัน ซึ่งเน้นย้ำ ป ที่ 3 คือป้องกันหลังถูกกัดและฉีดวัคซีนให้ครบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32106251",
              "locator": "14(2):e0007248",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Although rabies is vaccine preventable, more than 90% of persons who died of rabies in Thailand either did not receive or inappropriately discontinued post-exposure prophylaxis (PEP). In 2012 Thailand launched a national animal rabies elimi"
          }
        }
      ]
    }
  },
  "com5--cve": {
    "com5--cve--pathogenesis": {
      "claims": [
        {
          "id": "com5--cve--pathogenesis--v1",
          "statement": "CPV เข้าไป replicate ใน crypt epithelium ของลำไส้ → lesion ที่เด่นคือ crypt epithelial necrosis, crypt lumen ยุบหรือขยาย และ villous atrophy (คล้าย panleukopenia ในแมว)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-505892",
              "locator": "Vet Pathol 1979;16(6):680-6, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Microscopic lesions resembling those of panleukopenia in cats were seen in the intestines. The predominant features were necrosis of crypt epithelium, collapse or dilation of crypt lumina and villous atrophy. ... Fluorescent antibody was us"
          }
        }
      ]
    },
    "com5--cve--diagnosis": {
      "claims": [
        {
          "id": "com5--cve--diagnosis--v1",
          "statement": "Fecal rapid antigen test สำหรับ CPV มี specificity สูงมาก (ในการศึกษานี้ 100%) แต่ sensitivity ต่ำเมื่อเทียบกับ PCR (22.2% ในตัวอย่างทั้งหมด, 76.5% เมื่อตรวจทันทีหลังเก็บ) ดังนั้นผลลบไม่ตัดโรค parvo ออกจาก differential diagnosis แต่ผลบวกแทบยืนยันการติดเชื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25707551",
              "locator": "J Virol Methods 2015;215-216:52-5, abstract (Results and Conclusion)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The sensitivity of the Quicking rapid diagnostic test compared to PCR in the total number of samples, in samples from non-vaccinated dogs and in samples tested directly after collection were 22.22% ..., 26.67% ... and 76.47% ... respectivel"
          }
        }
      ]
    },
    "com5--cve--treatment-supportive-ไม่มี-specific-antiviral": {
      "claims": [
        {
          "id": "com5--cve--treatment-supportive-ไม่มี-specific-antiviral--v1",
          "statement": "rFeIFN-ω 2.5 MU/kg IV วันละครั้ง 3 วันติดต่อกัน ร่วมกับ supportive care ลด mortality ของ canine parvoviral enteritis อย่างมีนัยสำคัญ (ตาย 3/43 ในกลุ่ม IFN เทียบกับ 14/49 ในกลุ่ม placebo, P = 0.0096)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12572939",
              "locator": "Vet Rec 2003;152(4):105-8, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "94 dogs from one to 28 months old were randomly assigned to two groups which were treated intravenously either with IFN (2.5 million units/kg) or placebo once a day for three consecutive days ... there were only three deaths in the IFN grou"
          }
        },
        {
          "id": "com5--cve--treatment-supportive-ไม่มี-specific-antiviral--v2",
          "statement": "Early enteral nutrition ทาง nasoesophageal tube เริ่ม 12 ชม.หลังรับเข้ารักษา ทำให้ demeanor, appetite, vomiting และ diarrhea กลับสู่ปกติเร็วกว่ากลุ่ม NPO ประมาณ 1 วัน และน้ำหนักขึ้นอย่างมีนัยสำคัญ แต่ในการศึกษานี้ survival ไม่ต่างกันอย่างมีนัยสำคัญ (13/15 vs 15/15, P = .48)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14658714",
              "locator": "J Vet Intern Med 2003;17(6):791-8, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Median time to normalization of demeanor, appetite, vomiting, and diarrhea was 1 day shorter for the EEN group for each variable. ... Thirteen NPO dogs and all EEN dogs survived (P = .48). The EEN group showed earlier clinical improvement a"
          }
        }
      ]
    },
    "com5--cve--prevention-client-communication": {
      "claims": [
        {
          "id": "com5--cve--prevention-client-communication--v1",
          "statement": "Sodium hypochlorite inactivate canine parvovirus ได้สมบูรณ์ ขณะที่ quaternary ammonium compound (QUAT) disinfectant รุ่นใหม่ ที่เจือจางตามที่ผู้ผลิตแนะนำ ไม่ inactivate CPV อย่างมีนัยสำคัญ ที่ contact time 10 นาที อุณหภูมิห้อง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7634062",
              "locator": "J Am Anim Hosp Assoc 1995;31(3):254-8, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Disinfectants were used at the manufacturers' recommended dilutions with isolates of feline herpesvirus, feline calicivirus, and canine parvovirus, and a contact time of 10 minutes at room temperature. ... Canine parvovirus was not inactiva"
          }
        },
        {
          "id": "com5--cve--prevention-client-communication--v2",
          "statement": "เข็มสุดท้ายของ primary vaccination series ต้องฉีดตอนอายุ ≥ 16 สัปดาห์ เพื่อเอาชนะ maternally derived antibody (MDA) interference — การจบชุดวัคซีนก่อน 16 สัปดาห์สัมพันธ์กับการติดเชื้อ CPV-2 อย่างมีนัยสำคัญ (P < 0.001) ขณะที่สายพันธุ์วัคซีนและจำนวนเข็มไม่สัมพันธ์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41888840",
              "locator": "BMC Vet Res 2026;22(1), abstract (Results and Conclusions)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Early finishing of the primary vaccination series was significantly associated with CPV-2 infection (P < 0.001), whereas vaccinal strain and number of doses were not. ... Finishing the primary vaccination series at >= 16 weeks of age, in ac"
          }
        }
      ]
    }
  },
  "com5--feline-uri": {
    "com5--feline-uri--fhv-1-feline-viral-rhinotracheitis-details": {
      "claims": [
        {
          "id": "com5--feline-uri--fhv-1-feline-viral-rhinotracheitis-details--v1",
          "statement": "FHV-1 ทำให้เกิด latent infection ตลอดชีวิตในแมวที่หายป่วยแล้ว โดย primary site of latency คือ trigeminal ganglion และมี periodic reactivation ได้ โดยเฉพาะหลัง stress",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17296160",
              "locator": "Vet Res 2007;38(2):337-54, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "clinically recovered cats become latently infected carriers which undergo periodic episodes of virus reactivation, particularly after a stress. The primary site of latency is the trigeminal ganglion."
          }
        }
      ]
    },
    "com5--feline-uri--treatment": {
      "claims": [
        {
          "id": "com5--feline-uri--treatment--v1",
          "statement": "Famciclovir 90 mg/kg PO วันละ 3 ครั้ง นาน 21 วัน ลด disease score, ลดความถี่ของการ shed herpetic DNA และลด histologic conjunctivitis score ในแมวที่ถูกทำให้ติดเชื้อ FHV-1 เมื่อเทียบกับ placebo",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21194340",
              "locator": "Am J Vet Res 2011;72(1):85-95, abstract (randomized controlled trial, 16 SPF cats)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Cats were treated orally with famciclovir (90 mg/kg; n = 10) or a similar volume of lactose (400 mg; 6) 3 times/d for 21 days... disease scores were lower in famciclovir-treated cats than in lactose-treated cats... herpetic DNA was shed les"
          }
        },
        {
          "id": "com5--feline-uri--treatment--v2",
          "statement": "การรักษา Chlamydia felis ด้วย doxycycline ต้องให้อย่างน้อย 28 วัน (ประมาณ 4 สัปดาห์) เพราะคอร์ส 7, 14 และในบางตัวแม้ 21 วัน ยังไม่สามารถกำจัดเชื้อได้ และมี recurrence หลังหยุดยา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15815009",
              "locator": "J Clin Microbiol 2005;43(4):1858-64, abstract (15 cats, doxycycline 10 mg/kg/day PO)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "It was concluded that 7, 14, and, in some cases, 21 days of treatment with oral doxycycline will not eliminate C. felis infection. At least 28 days of treatment with doxycycline is required to ensure elimination of the organism."
          }
        },
        {
          "id": "com5--feline-uri--treatment--v3",
          "statement": "Enrofloxacin แบบ systemic ในแมวอาจทำให้เกิด acute diffuse retinal degeneration และตาบอดได้ จึงควรใช้ไม่เกินขนาดที่ผู้ผลิตแนะนำคือ 5 mg/kg q24h",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11422990",
              "locator": "Vet Ophthalmol 2001;4(2):99-106, abstract (retrospective series, 17 cats)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Parenteral and/or oral [corrected] enrofloxacin is potentially retinotoxic in some cats, and may result in acute and diffuse retinal degeneration. Blindness often results, but some cats may regain vision. Practitioners should adhere closely"
          }
        }
      ]
    },
    "com5--feline-uri--vaccination-management": {
      "claims": [
        {
          "id": "com5--feline-uri--vaccination-management--v1",
          "statement": "วัคซีน FHV-1 ทั้งชนิด inactivated และ modified-live ป้องกัน disease ได้พอสมควร แต่ไม่ป้องกัน infection แม้จะลด viral shedding ลงได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17296160",
              "locator": "Vet Res 2007;38(2):337-54, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Conventional inactivated and modified-live vaccines are available and protect reasonably well against disease but not infection, although viral shedding may be reduced."
          }
        }
      ]
    },
    "com5--feline-uri--fcv-details": {
      "claims": [
        {
          "id": "com5--feline-uri--fcv-details--v1",
          "statement": "Virulent systemic FCV เกิดขึ้นได้ในแมวที่เคยได้รับวัคซีน FCV (สายพันธุ์ F9) แบบฉีดมาก่อน และมี mortality สูง โดยใน epizootic ที่รายงานครั้งแรกอยู่ที่ 33-50%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10781727",
              "locator": "Vet Microbiol 2000;73(4):281-300, abstract (FCV-Ari epizootic)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The mortality in field cats, deliberately infected laboratory cats, and inadvertently infected laboratory cats ranged from 33-50%... However, all of the field cats, including the three that died, had been previously immunized with parentera"
          }
        }
      ]
    }
  },
  "com5--gi-protozoa": {
    "com5--gi-protozoa--tritrichomonas-foetus-in-cats": {
      "claims": [
        {
          "id": "com5--gi-protozoa--tritrichomonas-foetus-in-cats--v1",
          "statement": "ในการสำรวจแมว 117 ตัวจาก 89 cattery วิธีตรวจ T. foetus ให้ผลบวกไม่เท่ากัน คือ direct fecal smear 5/36 (~14%), fecal culture ใน InPouch TF 20/36 (~56%) และ fecal PCR 34/36 (~94%) ดังนั้น smear ที่ให้ผลลบไม่สามารถ rule out การติดเชื้อได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15184456",
              "locator": "42(6):2707-2710",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Prevalence of T. foetus was 31% among cats (36 out of 117) and catteries (28 out of 89) based on results of fecal smear examination (5 out of 36), fecal culture in modified Diamond's medium (9 out of 36), fecal culture in In Pouch TF medium"
          }
        },
        {
          "id": "com5--gi-protozoa--tritrichomonas-foetus-in-cats--v2",
          "statement": "Ronidazole ขนาด 30-50 mg/kg PO q12h นาน 14 วัน กำจัด T. foetus ในแมวได้ (PCR-negative) ในขณะที่ขนาดต่ำ 10 mg/kg ทำให้ infection relapse ในแมวทดลองทุกตัวภายใน 2-20 สัปดาห์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16734086",
              "locator": "20(3):536-543",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In experimentally induced infection, RDZ at 10 mg/kg caused initial improvement, but infection relapsed in all 5 cats 2 to 20 weeks after treatment. At 30 or 50 mg/kg, 10/10 cats were negative for T. foetus infection for follow-up durations"
          }
        }
      ]
    },
    "com5--gi-protozoa--giardia": {
      "claims": [
        {
          "id": "com5--gi-protozoa--giardia--v1",
          "statement": "Fenbendazole 50 mg/kg PO q24h เป็นขนาดที่มีหลักฐาน controlled trial ว่าทำให้ตรวจไม่พบ Giardia cyst ในอุจจาระสุนัข (6/6 ตัว โดย zinc sulfate concentration technique) เทียบกับกลุ่มควบคุมที่ยังพบ cyst 5/6 ตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7978640",
              "locator": "55(7):988-990",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Giardia cysts were not detected in the feces of 6 of 6 group-1 dogs (as determined by use of the zinc sulfate concentration technique) after fenbendazole treatment (50 mg/kg of body weight, PO, q 24 h, for 3 doses). ... However, cysts were "
          }
        }
      ]
    },
    "com5--gi-protozoa--cryptosporidium": {
      "claims": [
        {
          "id": "com5--gi-protozoa--cryptosporidium--v1",
          "statement": "Paromomycin ที่ให้ทางปากในแมวมีรายงานทำให้เกิด acute renal failure (4 ตัว) และ 3 ใน 4 ตัวเกิด deafness ร่วมกับ cataract ตามมา โดยเชื่อว่าเกิดจากขนาดยาที่สูงเกินร่วมกับการดูดซึมยาผ่าน intestinal mucosa ที่บาดเจ็บ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10613215",
              "locator": "215(12):1821-1823",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Acute renal failure was diagnosed in 4 cats receiving paromomycin orally for treatment of infectious enteritis. All 4 cats responded to fluid therapy and recovered normal or near-normal renal function; however, 3 of the cats subsequently be"
          }
        },
        {
          "id": "com5--gi-protozoa--cryptosporidium--v2",
          "statement": "Cryptosporidium canis เป็น species หลักที่ก่อโรคในสุนัข และ C. felis ในแมว โดยพบ C. parvum ได้บ้างในทั้งสองชนิด และมีข้อมูล subtyping ที่ยืนยันการเกิด zoonotic transmission ระหว่างสัตว์เลี้ยงกับเจ้าของ แม้จะมีรายงานไม่มาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33848499",
              "locator": "51(10):787-795",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Among them, Cryptosporidium canis and Cryptosporidium felis are dominant species causing canine and feline cryptosporidiosis, respectively. Some Cryptosporidium parvum infections have also been identified in both groups of animals. ... Data"
          }
        }
      ]
    },
    "com5--gi-protozoa--cystoisospora-canis-felis": {
      "claims": [
        {
          "id": "com5--gi-protozoa--cystoisospora-canis-felis--v1",
          "statement": "Toltrazuril (9 mg/kg ในรูปแบบร่วมกับ emodepside) ลดการขับ oocyst ของ Isospora (Cystoisospora) canis และ I. ohioensis-complex ในลูกสุนัขได้ 90.2-100% เมื่อให้ช่วง prepatent และ 91.5-100% เมื่อให้ช่วง patent อีกทั้งกลุ่มที่รักษาช่วง prepatent มีจำนวนวันที่ท้องเสียน้อยกว่ากลุ่มควบคุมอย่างมีนัยสำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21739371",
              "locator": "109 Suppl 1:S9-S20",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Oocyst counts were reduced by 90.2 - 100 % while the control groups continued to exhibit an adequate infection ... Faecal oocyst counts were reduced by 91.5 - 100 %. In all three studies the number of days with diarrhoea was significantly l"
          }
        }
      ]
    }
  },
  "com5--sporo-crypto": {
    "com5--sporo-crypto--เปรียบเทียบ-sporo-vs-crypto": {
      "claims": [
        {
          "id": "com5--sporo-crypto--เปรียบเทียบ-sporo-vs-crypto--v1",
          "statement": "Sporotrichosis เป็น zoonosis จริง โดยการสัมผัสแมวที่ติดเชื้อคือ major mode of transmission สู่คน โดยเฉพาะในพื้นที่ endemic เช่น บราซิล และบุคลากรต้องสวมถุงมือเมื่อจับแมวที่มี skin nodule/ulcer และเมื่อจัดการตัวอย่างส่งตรวจ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23813827",
              "locator": "J Feline Med Surg 2013;15(7):619-23, sections \"Transmission\" and \"Zoonotic risk\" of the abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Contact with infected cats is the major mode of transmission to humans"
          }
        }
      ]
    },
    "com5--sporo-crypto--sporotrichosis-pathogenesis-3-clinical-forms": {
      "claims": [
        {
          "id": "com5--sporo-crypto--sporotrichosis-pathogenesis-3-clinical-forms--v1",
          "statement": "การติดเชื้อเกิดจาก traumatic inoculation ของ conidia จากพืชและดินเป็นหลัก และแมวส่วนใหญ่แสดงอาการแบบ cutaneous form คือ ulcerated nodules หลายจุดร่วมกับ draining tracts ที่ผิวหนัง ส่วน lymphadenopathy, respiratory signs และ systemic dissemination อาจพบได้เช่นกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23813827",
              "locator": "J Feline Med Surg 2013;15(7):619-23, \"Clinical signs\" section of the abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Most cases in cats are cutaneous, presenting as multiple ulcerated nodules and draining tracts"
          }
        }
      ]
    },
    "com5--sporo-crypto--sporotrichosis-treatment": {
      "claims": [
        {
          "id": "com5--sporo-crypto--sporotrichosis-treatment--v1",
          "statement": "Itraconazole ยังเป็นยาอันดับแรก (first choice) สำหรับ sporotrichosis ในแมว และการให้ร่วมกับ potassium iodide ขนาด 2.5-20 mg/kg/วัน ในแมว naive 30 ตัว ได้ cure rate 96.15% ที่ค่ามัธยฐาน 14 สัปดาห์ โดยพบ adverse effects 50% ซึ่งจัดการได้ด้วยการหยุดยาชั่วคราวและ/หรือให้ยาบำรุงตับ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27207412",
              "locator": "Med Mycol 2016;54(7):684-90, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Itraconazole (ITZ) remains the first choice for treating this disease in cats"
          }
        }
      ]
    },
    "com5--sporo-crypto--cryptococcosis-overview": {
      "claims": [
        {
          "id": "com5--sporo-crypto--cryptococcosis-overview--v1",
          "statement": "แมวรับเชื้อ Cryptococcus จากสิ่งแวดล้อมที่ปนเปื้อน โดย basidiospore เป็น infectious propagule ที่เข้าสู่ระบบหายใจแล้วก่อ primary infection และมูลนก โดยเฉพาะมูลนกพิราบ เป็นสภาพแวดล้อมที่เอื้อต่อการเพิ่มจำนวนของ C. neoformans",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23813826",
              "locator": "J Feline Med Surg 2013;15(7):611-8, \"Infection\" section of the abstract",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Basidiospores are the infectious propagules of Cryptococcus species as they penetrate the respiratory system"
          }
        }
      ]
    },
    "com5--sporo-crypto--cryptococcosis-diagnosis": {
      "claims": [
        {
          "id": "com5--sporo-crypto--cryptococcosis-diagnosis--v1",
          "statement": "Latex cryptococcal antigen agglutination test (LCAT) เป็นวิธีที่ยอมรับเป็น gold standard ในสัตว์ป่วย เมื่อเทียบ lateral flow assay (LFA) กับ LCAT พบ sensitivity 92% ในแมวและ 100% ในสุนัข แต่ specificity เพียง 81% และ 84% ตามลำดับ ดังนั้น LFA เหมาะเป็น screening test เพื่อ rule out และผลบวกจาก LFA ควรยืนยันด้วย LCAT",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31220311",
              "locator": "Med Mycol 2020;58(1):39-46, abstract (528 serum specimens: 129 cats, 108 dogs, 291 koalas)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The LCAT is a proven and well-accepted method in veterinary patients"
          }
        }
      ]
    },
    "com5--sporo-crypto--cryptococcosis-treatment": {
      "claims": [
        {
          "id": "com5--sporo-crypto--cryptococcosis-treatment--v1",
          "statement": "Fluconazole ชนิดกินขนาด 50 mg/แมว ทุก 12 ชั่วโมง ให้การตอบสนองดีอย่างสม่ำเสมอโดยไม่พบผลข้างเคียง ใน case series แมว 29 ตัวที่เป็น cryptococcosis ตามธรรมชาติ (ช่วงขนาดที่ใช้ทั้งชุด 25-100 mg ทุก 12 ชั่วโมง)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1588463",
              "locator": "J Med Vet Mycol 1992;30(2):133-44, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "50 mg per cat, given every 12 h, produced a consistently good response"
          }
        }
      ]
    }
  },
  "com5--vaccine": {
    "com5--vaccine--wsava-2024-highlights": {
      "claims": [
        {
          "id": "com5--vaccine--wsava-2024-highlights--v1",
          "statement": "WSAVA 2024 (VGG) เลื่อน booster เข็มแรกหลังชุด puppy/kitten series มาที่อายุ 6 เดือน (จากเดิม 12 เดือน) จากนั้น revaccinate core vaccine ทุก 3 ปี และสนับสนุนการใช้ serological titre testing ประกอบการตัดสินใจ revaccination",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38568777",
              "locator": "J Small Anim Pract 2024;65(5):277-316. ไม่ระบุเลขหัวข้อย่อย/หน้าที่แน่นอน เพราะยังไม่ได้ยืนยันตำแหน่งของข้อแนะนำนี้ในตัวเอกสาร",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": ""
          }
        }
      ]
    },
    "com5--vaccine--window-of-susceptibility-cpv": {
      "claims": [
        {
          "id": "com5--vaccine--window-of-susceptibility-cpv--v1",
          "statement": "ลูกสุนัขที่มี CPV hemagglutination-inhibition (HI) titer ≥ 1:80 ต้านทาน oronasal challenge ด้วย virulent CPV ได้ แต่ maternally derived antibody ที่ตรวจพบได้ตั้งแต่ titer ≥ 1:10 ก็รบกวน active immunization แล้ว ช่วงระหว่าง 1:10 ถึง 1:80 จึงเป็น window of susceptibility (ไม่ป้องกันโรค แต่ยัง block วัคซีน)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7056660",
              "locator": "J Am Vet Med Assoc 1982;180(1):37-42",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Pups with hemagglutination-inhibition titers greater than or equal to 1:80 were immune to oronasal challenge with virulent CPV, but any detectable hemagglutination-inhibition antibody (titer greater than or equal to 1:10) interfered with ac"
          }
        }
      ]
    },
    "com5--vaccine--protective-antibody-titers-canine": {
      "claims": [
        {
          "id": "com5--vaccine--protective-antibody-titers-canine--v1",
          "statement": "เกณฑ์ titer ที่ใช้ตัดสินว่าสุนัขยังมี serologic protection คือ CDV serum neutralization ≥ 1:32, CAV-1 และ CAV-2 serum neutralization ≥ 1:16 และ CPV hemagglutination inhibition ≥ 1:80",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14710876",
              "locator": "J Am Vet Med Assoc 2004;224(1):55-60",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Dogs were considered to have responded serologically if they had a day-0 serum neutralization titer to CDV > or = 1:32; a serum neutralization titer to CAV-1, CAV-2, or CPIV > or = 1:16; a hemagglutination inhibition titer to CPV > or = 1:8"
          }
        }
      ]
    },
    "com5--vaccine--out-of-date-rabies-post-exposure-anamnestic-response": {
      "claims": [
        {
          "id": "com5--vaccine--out-of-date-rabies-post-exposure-anamnestic-response--v1",
          "statement": "สุนัขและแมวที่เคยได้รับ rabies vaccine มาก่อน ไม่ว่า vaccination status จะ current หรือ out-of-date เมื่อได้ booster ทุกตัวมี antirabies antibody titer ≥ 0.5 IU/mL ที่ 5-15 วันหลังฉีด และสุนัขกลุ่ม out-of-date ตอบสนองไม่ด้อยกว่ากลุ่ม current จึงสนับสนุนแนวทาง booster ทันทีแล้ว observe 45 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25554936",
              "locator": "J Am Vet Med Assoc 2015;246(2):205-11",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "All animals had an antirabies antibody titer >/= 0.5 IU/mL 5 to 15 days after booster vaccination. Dogs with an out-of-date vaccination status had a higher median increase in titer... Findings supported immediate booster vaccination followe"
          }
        }
      ]
    },
    "com5--vaccine--canine-puppy-schedule-wsava-2024-vpat-2024": {
      "claims": [
        {
          "id": "com5--vaccine--canine-puppy-schedule-wsava-2024-vpat-2024--v1",
          "statement": "ความเสี่ยงเกิด vaccine-associated adverse event ภายใน 3 วันหลังฉีดในสุนัขเพิ่มขึ้นตามจำนวนวัคซีนที่ให้ต่อการมาแต่ละครั้ง โดยเพิ่มขึ้น 27% ต่อวัคซีน 1 เข็มที่เพิ่มในสุนัขน้ำหนัก ≤ 10 kg และ 12% ในสุนัข > 10 kg อัตราโดยรวม 38.2 ต่อ 10,000 ตัวที่ได้รับวัคซีน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16220670",
              "locator": "J Am Vet Med Assoc 2005;227(7):1102-8",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "4,678 adverse events (38.2/10,000 dogs vaccinated) were associated with administration of 3,439,576 doses of vaccine to 1,226,159 dogs. The VAAE rate decreased significantly as body weight increased... each additional vaccine significantly "
          }
        }
      ]
    },
    "com5--vaccine--feline-kitten-schedule": {
      "claims": [
        {
          "id": "com5--vaccine--feline-kitten-schedule--v1",
          "statement": "แมวที่มี FeLV status ไม่ชัดเจนควรได้รับการตรวจ FeLV ก่อนฉีดวัคซีน FeLV และลูกแมวเริ่มฉีดเข็มแรกที่อายุ 8-9 สัปดาห์ เข็มที่สองที่ 12 สัปดาห์ แล้ว booster อีก 1 ปีถัดมา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19481036",
              "locator": "J Feline Med Surg 2009;11(7):565-74",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "All cats with an uncertain FeLV status should be tested prior to vaccination. All healthy cats at potential risk of exposure should be vaccinated against FeLV. Kittens should be vaccinated at 8-9 weeks of age, with a second vaccination at 1"
          }
        }
      ]
    }
  },
  "com3--triage": {
    "com3--triage--6-perfusion-parameters-circulation": {
      "claims": [
        {
          "id": "com3--triage--6-perfusion-parameters-circulation--v1",
          "statement": "แมวที่มี severe sepsis มักแสดง bradycardia ร่วมกับ pale mucous membrane, weak pulse และ hypothermia ซึ่งต่างจากสุนัขที่มัก tachycardia",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10953718",
              "locator": "217(4):531-5",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Results suggest that severe sepsis in cats is characterized by lethargy, pale mucous membranes, signs of diffuse abdominal pain, tachypnea, bradycardia, weak pulses, anemia, hypoalbuminemia, hypothermia, and icterus."
          }
        },
        {
          "id": "com3--triage--6-perfusion-parameters-circulation--v2",
          "statement": "CRT > 2 วินาที เป็นหนึ่งใน 6 เกณฑ์ที่ใช้นิยาม shock ในสุนัข ร่วมกับ HR > 120/min, RR > 40/min, rectal temperature < 37.8 องศาเซลเซียส, venous lactate > 2.5 mmol/L และ Doppler BP < 90 mmHg โดยถือว่าเป็น shock เมื่อผิดปกติ 3 ข้อขึ้นไปจาก 6 ข้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32965089",
              "locator": "30(6):670-676",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Shock was defined as abnormalities in ≥3 of the 6 following criteria: HR > 120/min, RR > 40/min, CRT > 2 seconds, rectal temperature <37.8°C (100.0°F), venous plasma lactate concentration >2.5 mmol/L, or DBP < 90 mm Hg."
          }
        },
        {
          "id": "com3--triage--6-perfusion-parameters-circulation--v3",
          "statement": "ปลายขาเย็น วัดเป็น rectal-interdigital temperature gradient (RITG) กว้างขึ้นอย่างมีนัยสำคัญในสุนัขที่มี shock โดย cutoff 11.6 องศาฟาเรนไฮต์ ให้ specificity 90% ต่อการวินิจฉัย shock (AUC 0.76)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32965089",
              "locator": "30(6):670-676",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Receiver operator curve analysis indicated a RITG cutoff point of 11.6°F had 90% specificity for the diagnosis of shock (area under the curve = 0.7604)."
          }
        }
      ]
    },
    "com3--triage--resuscitation-secondary-survey": {
      "claims": [
        {
          "id": "com3--triage--resuscitation-secondary-survey--v1",
          "statement": "สุนัขโตที่สุขภาพดีมี sleeping respiratory rate เฉลี่ย 13 breaths/min และแทบไม่เคยเกิน 30 breaths/min ดังนั้น RR > 30 ขณะพักหรือหลับ ถือว่าผิดปกติ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22240295",
              "locator": "93(2):965-9",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This study shows that apparently healthy adult dogs generally have SRR(mean) <30 breaths/min and rarely exceed this rate at any time."
          }
        }
      ]
    }
  },
  "com3--shock": {
    "com3--shock--sirs-sepsis-septic-shock": {
      "claims": [
        {
          "id": "com3--shock--sirs-sepsis-septic-shock--v1",
          "statement": "เกณฑ์ SIRS ในสุนัขใช้ความผิดปกติ 2 ใน 4 ข้อขึ้นไป จาก temperature, heart rate, respiratory rate และ WBC ซึ่งเป็นเกณฑ์ที่ sensitive แต่ไม่ specific ต่อการวินิจฉัย sepsis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9381665",
              "locator": "26(5):393-7",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The sensitivity and specificity of the grouped criteria (> or = two of four; temperature, heart rate, respiratory rate, WBC) varied according to ranges of normal used ... These criteria may be used for a sensitive, but nonspecific, diagnosi"
          }
        },
        {
          "id": "com3--shock--sirs-sepsis-septic-shock--v2",
          "statement": "ตามนิยาม Sepsis-3 septic shock คือ sepsis ที่ต้องใช้ vasopressor เพื่อคง mean arterial pressure ที่ 65 mmHg ขึ้นไป ร่วมกับ serum lactate > 2 mmol/L เมื่อแก้ hypovolemia แล้ว ซึ่งสัมพันธ์กับ hospital mortality มากกว่า 40%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26903338",
              "locator": "JAMA 2016;315(8):801-10, septic shock clinical criteria in the Conclusions and Relevance section. I have not verified an internal recommendation or table number, so none is given.",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Patients with septic shock can be clinically identified by a vasopressor requirement to maintain a mean arterial pressure of 65 mm Hg or greater and serum lactate level greater than 2 mmol/L (>18 mg/dL) in the absence of hypovolemia. This c"
          }
        }
      ]
    },
    "com3--shock--diagnosis": {
      "claims": [
        {
          "id": "com3--shock--diagnosis--v1",
          "statement": "Shock index (SI) = HR / SBP โดยใช้ cutoff SI > 1.0 แยกสุนัขที่อยู่ในภาวะ shock ออกจากสุนัขปกติได้ AUROC 0.89 (sensitivity 90%, specificity 89%) สุนัข shock มี median SI 1.37 เทียบกับสุนัขสุขภาพดี median 0.78",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23855723",
              "locator": "23(5):538-44",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Receiver operator characteristic curve analysis suggested a SI cut-off of 1.0, yielding an area under the receiver operator characteristic (AUROC) of 0.89 (Specificity (Sp) 89, Sensitivity (Sn) 90) when comparing dogs deemed in shock with h"
          }
        },
        {
          "id": "com3--shock--diagnosis--v2",
          "statement": "ในสุนัขที่ admit ด้วย shock ค่า lactate แรกรับเพียงค่าเดียวแยก survivor จาก non-survivor ไม่ได้ แต่ lactate clearance ที่ 1, 10, 16, 24 และ 36 ชั่วโมง สูงกว่าในกลุ่มที่รอดอย่างมีนัยสำคัญ ดังนั้นควรติดตาม lactate ซ้ำ ไม่ใช่ดูค่าเดียว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31290240",
              "locator": "29(5):505-513",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Admission venous plasma lactate concentration did not differ between groups (P = 0.2) ... Lactate clearance at 1, 10, 16, 24, and 36 hours, and final lactate clearance were greater in survivors versus nonsurvivors (P < 0.05)."
          }
        }
      ]
    },
    "com3--shock--treatment": {
      "claims": [
        {
          "id": "com3--shock--treatment--v1",
          "statement": "ขนาด shock dose ของ isotonic crystalloid (LRS) ในสุนัขที่ใช้ในการศึกษาทางคลินิกคือ 60-90 ml/kg และการให้ hypertonic saline-dextran 5 ml/kg ให้ผล resuscitation เทียบเท่าโดยใช้ปริมาตรของเหลวรวมน้อยกว่าอย่างมีนัยสำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9018357",
              "locator": "210(2):226-30",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Initially, HSD solution (5 ml/kg of body weight) or LRS (60 to 90 ml/kg) was administered ... Administration of HSD rapidly restored cardiorespiratory function and induced resuscitation equivalent to administration of large volumes of LRS."
          }
        },
        {
          "id": "com3--shock--treatment--v2",
          "statement": "Hypertonic saline 7.5% ขนาด 4 ml/kg ใช้เป็น resuscitation bolus ในสุนัข GDV ที่มี shock ได้ โดยทั้ง hypertonic saline และ HES 130/0.4 ทำให้เกิดแนวโน้ม hypocoagulability คล้ายกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34657371",
              "locator": "31(6):698-707",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Dogs affected by GDV and shock were randomly assigned to receive HES at 10 mL/kg or HS at 4 mL/kg every 15 minutes ... In dogs affected by GDV, HES or HS infusion caused a similar tendency toward hypocoagulability, with few differences betw"
          }
        }
      ]
    }
  },
  "com3--cpcr": {
    "com3--cpcr--step-1-3-basic-life-support": {
      "claims": [
        {
          "id": "com3--cpcr--step-1-3-basic-life-support--v1",
          "statement": "การกดหน้าอกใน CPR สุนัขและแมวควรทำที่อัตราอย่างน้อย 100 ครั้ง/นาที ที่ความลึก 1/3 ถึง 1/2 ของความกว้างหน้าอก และหยุดกดให้น้อยที่สุด (minimal pauses)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22676283",
              "locator": "RECOVER 2012 Part 3: Basic life support, J Vet Emerg Crit Care 22(Suppl 1):S26-43",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "performing chest compressions at a rate of at least 100/min at a compression depth of one-third to half the width of the chest with minimal pauses"
          }
        },
        {
          "id": "com3--cpcr--step-1-3-basic-life-support--v2",
          "statement": "ผู้ป่วยที่ยังไม่ได้ใส่ท่อช่วยหายใจ (non-intubated) ใช้อัตราส่วน compression:ventilation = 30:2 ส่วนผู้ป่วยที่ใส่ ET tube แล้วให้ ventilate 8-10 ครั้ง/นาที",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22676283",
              "locator": "RECOVER 2012 Part 3: Basic life support, J Vet Emerg Crit Care 22(Suppl 1):S26-43",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "early instigation of ventilation at a rate of 8-10 breaths/min in intubated patients, or using a 30:2 compression/ventilation ratio in nonintubated patients"
          }
        }
      ]
    },
    "com3--cpcr--step-4-advanced-life-support": {
      "claims": [
        {
          "id": "com3--cpcr--step-4-advanced-life-support--v1",
          "statement": "Epinephrine ขนาด standard dose (low dose) 0.01 mg/kg เป็นขนาดที่มีหลักฐานสนับสนุนหนักแน่นสำหรับใช้ระหว่าง CPR ในสุนัขและแมว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22676286",
              "locator": "RECOVER 2012 Part 4: Advanced life support, J Vet Emerg Crit Care 22(Suppl 1):S44-64",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There is strong evidence supporting the use of standard-dose (0.01 mg/kg) epinephrine in CPR"
          }
        },
        {
          "id": "com3--cpcr--step-4-advanced-life-support--v2",
          "statement": "RECOVER 2024 ไม่แนะนำ high-dose epinephrine แม้ทำ CPR มานาน และแนะนำให้ atropine เพียงครั้งเดียวเมื่อมีข้อบ่งชี้ ส่วน shockable rhythm ที่ defibrillate ครั้งแรกไม่สำเร็จ แนะนำเพิ่มพลังงาน defibrillator เป็นสองเท่าหนึ่งครั้ง และพิจารณา lidocaine ในสุนัข และ/หรือ amiodarone ในแมว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38924633",
              "locator": "2024 RECOVER Guidelines: Advanced Life Support, J Vet Emerg Crit Care 34(Suppl 1):44-75",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "We recommend against high-dose epinephrine even after prolonged CPR and suggest that atropine, when indicated, is used only once. In animals with a shockable rhythm in which initial defibrillation was unsuccessful, we recommend doubling the"
          }
        },
        {
          "id": "com3--cpcr--step-4-advanced-life-support--v3",
          "statement": "การ monitor EtCO2 (capnography) ระหว่าง CPR ใช้ยืนยันตำแหน่ง ET tube, บ่งชี้การเกิด ROSC, ประเมินคุณภาพการกดหน้าอก และใช้ชี้นำการทำ basic life support",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38924672",
              "locator": "2024 RECOVER Guidelines: Monitoring, J Vet Emerg Crit Care 34(Suppl 1):76-103 (5 ใน 24 treatment recommendations เกี่ยวกับ EtCO2)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "verify correct intubation, identify return of spontaneous circulation, evaluate quality of CPR, and guide basic life support measures"
          }
        }
      ]
    },
    "com3--cpcr--rhythm-interpretation": {
      "claims": [
        {
          "id": "com3--cpcr--rhythm-interpretation--v1",
          "statement": "VF และ pulseless VT เป็น rhythm ที่ต้องรีบทำ electrical defibrillation โดยเลือกใช้เครื่องแบบ biphasic เป็นอันดับแรก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22676286",
              "locator": "RECOVER 2012 Part 4: Advanced life support, J Vet Emerg Crit Care 22(Suppl 1):S44-64",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "early electrical defibrillation for animals experiencing CPA due to ventricular fibrillation or pulseless ventricular tachycardia, preferentially using a biphasic defibrillator"
          }
        }
      ]
    }
  },
  "com3--resp-cv-er": {
    "com3--resp-cv-er--pulmonary-edema": {
      "claims": [
        {
          "id": "com3--resp-cv-er--pulmonary-edema--v1",
          "statement": "Cardiogenic pulmonary edema จาก MMVD ในระยะ acute (hospital-based Stage C): ACVIM แนะนำ furosemide 2 mg/kg IV หรือ IM แล้วให้ซ้ำ 2 mg/kg IV/IM ทุก 1 ชั่วโมง จนกว่าอาการทาง respiratory จะดีขึ้นชัดเจน (respiratory rate และ effort ลดลง) หรือจนได้ขนาดรวม 8 mg/kg ภายใน 4 ชั่วโมง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30974015",
              "locator": "Section 6.5.2 Recommendations for acute (hospital-based) treatment of Stage C (verified in the PMC full text, PMC6524084); J Vet Intern Med 2019;33(3):1127-1140",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Furosemide 2 mg/kg administered IV (or intramuscularly [IM]), followed by 2 mg/kg IV or IM hourly until the patient's respiratory signs are substantially improved (ie, respiratory rate and effort are decreased) or a total dosage of 8 mg/kg "
          }
        },
        {
          "id": "com3--resp-cv-er--pulmonary-edema--v2",
          "statement": "ในรายที่ pulmonary edema รุนแรงถึงชีวิต (มีฟองฟูออกจากปาก ร่วมกับ severe dyspnea, ภาพรังสีเป็น white-out lung, หรือตอบสนองต่อ furosemide bolus ไม่ดีโดย respiratory effort และ rate ไม่ดีขึ้นภายใน 2 ชั่วโมง) อาจให้ furosemide ต่อเป็น CRI ขนาด 0.66-1 mg/kg/hour หลังจาก bolus แรก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30974015",
              "locator": "Section 6.5.2 Recommendations for acute (hospital-based) treatment of Stage C (verified in the PMC full text, PMC6524084); J Vet Intern Med 2019;33(3):1127-1140",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "For life-threatening pulmonary edema (ie, expectoration of froth associated with severe dyspnea, radiographic white-out lung, poor initial response to furosemide bolus with failure of respiratory effort and rate to improve over 2 hours), fu"
          }
        }
      ]
    },
    "com3--resp-cv-er--pleural-space-disease": {
      "claims": [
        {
          "id": "com3--resp-cv-er--pleural-space-disease--v1",
          "statement": "ในภาวะหัวใจล้มเหลวเฉียบพลัน ACVIM แนะนำให้ทำ mechanical drainage คือ thoracocentesis (และ abdominal paracentesis) เพื่อระบาย effusion ที่มากพอจะรบกวน ventilation หรือทำให้เกิด respiratory distress",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30974015",
              "locator": "Section 6.5.2 Recommendations for acute (hospital-based) treatment of Stage C (verified in the PMC full text, PMC6524084); J Vet Intern Med 2019;33(3):1127-1140",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Mechanical treatments (eg, abdominal paracentesis, thoracentesis) are recommended to relieve effusions judged sufficient to impair ventilation or cause respiratory distress. (Class I, LOE: expert opinion)"
          }
        },
        {
          "id": "com3--resp-cv-er--pleural-space-disease--v2",
          "statement": "TFAST ไม่น่าเชื่อถือสำหรับวินิจฉัย pneumothorax ในสุนัขและแมวหลัง trauma โดยมี agreement กับ CT ในระดับ poor (kappa = -0.06 เมื่อทำโดย ER clinician และ -0.12 เมื่อทำโดย radiology) ขณะที่การตรวจหา pleural free fluid ได้ agreement ระดับ fair to moderate (kappa = 0.53 และ 0.36 ตามลำดับ)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29901282",
              "locator": "Abstract, Results and Conclusions; J Vet Emerg Crit Care 2018;28(5):429-435",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There was moderate to excellent agreement between AFAST and CT for detection of free peritoneal fluid (ER K = 0.82; radiology K = 0.53), fair to moderate agreement between TFAST and CT for detection of pleural free fluid (ER K = 0.53; radio"
          }
        }
      ]
    },
    "com3--resp-cv-er--cardiac-tamponade": {
      "claims": [
        {
          "id": "com3--resp-cv-er--cardiac-tamponade--v1",
          "statement": "ภาวะแทรกซ้อนหลักของการระบาย pericardial effusion คือ arrhythmia: ในสุนัข 18 ตัวที่ใส่ pericardial catheter พบ new arrhythmia 6/18 ราย และ 4 ใน 6 รายนั้นต้องได้รับ antiarrhythmic therapy (คิดเป็น 22% ของทั้งหมด) โดยไม่พบภาวะแทรกซ้อนด้านการติดเชื้อหรือ functional complication",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31228330",
              "locator": "Abstract, Results and Conclusions; J Vet Emerg Crit Care 2019;29(4):413-417",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The main adverse events reported were new arrhythmias in 6/18 cases, with 4 of these 6 patients being administered anti-arrhythmic therapy. No infectious or functional complications were reported. ... Their use is associated with a rate of "
          }
        },
        {
          "id": "com3--resp-cv-er--cardiac-tamponade--v2",
          "statement": "Cardiac hemangiosarcoma ในสุนัขปรากฏเป็นก้อนที่ atrium หรือ auricle และมี acute risk of death จาก cardiac tamponade; ในสุนัข 27 ตัวที่ได้รับ palliative radiotherapy ความถี่ของการทำ pericardiocentesis ลดจากเฉลี่ย 1.1 ครั้ง/สัปดาห์ ก่อนฉายรังสี เหลือ 0.18 ครั้ง/สัปดาห์ หลังฉายรังสี (p = 0.01) โดยมี median overall survival time 137 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40443234",
              "locator": "Abstract; Vet Comp Oncol 2025;23(3):432-441",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Canine cardiac hemangiosarcoma (cHSA) represents a complex clinical challenge in that those afflicted have an acute risk of death due to cardiac tamponade and high morbidity and mortality given the frequency of metastasis. ... Twenty-seven "
          }
        }
      ]
    }
  },
  "com3--neuro-er": {
    "com3--neuro-er--head-trauma-assessment": {
      "claims": [
        {
          "id": "com3--neuro-er--head-trauma-assessment--v1",
          "statement": "Modified Glasgow Coma Scale (MGCS) ใช้ทำนาย outcome ในสุนัข head trauma ได้ โดยสุนัขที่ได้คะแนน 8 มีความน่าจะเป็นที่จะรอดใน 48 ชั่วโมงแรกประมาณ 50%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11817064",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The MGCS could predict the probability of survival in the 1st 48 hrs after head trauma with 50% probability in a patient with a score of 8."
          }
        },
        {
          "id": "com3--neuro-er--head-trauma-assessment--v2",
          "statement": "MGCS ที่ลดลงเป็นตัวทำนาย nonsurvival ที่แรงที่สุดในสุนัข head trauma โดยคะแนน ≤ 11 มี sensitivity 84% และ specificity 73% ในการทำนายการไม่รอดชีวิตจนถึงวันกลับบ้าน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26112259",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Decreased MGCS score was the strongest predictor of nonsurvival; a score ≤ 11 was 84% sensitive and 73% specific for predicting nonsurvival."
          }
        }
      ]
    },
    "com3--neuro-er--treatment-of-icp": {
      "claims": [
        {
          "id": "com3--neuro-er--treatment-of-icp--v1",
          "statement": "การให้ methylprednisolone IV ในผู้ป่วย head injury เพิ่มอัตราตายภายใน 2 สัปดาห์ (21.1% vs placebo 17.9%, RR 1.18, 95% CI 1.09-1.27) จึงเป็นเหตุผลที่ไม่ใช้ corticosteroid routine ใน head trauma",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15474134",
              "locator": "Abstract, findings",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Compared with placebo, the risk of death from all causes within 2 weeks was higher in the group allocated corticosteroids (1052 [21.1%] vs 893 [17.9%] deaths; relative risk 1.18 [95% CI 1.09-1.27]; p=0.0001)."
          }
        },
        {
          "id": "com3--neuro-er--treatment-of-icp--v2",
          "statement": "hyperosmolar agent ที่ใช้ลด intracranial pressure ในสุนัขได้แก่ 20% mannitol 1 g/kg IV และ 7.2% hypertonic saline 4 ml/kg โดย HTS ทำให้ plasma sodium และ chloride สูงขึ้นแบบคงอยู่ ส่วน mannitol ทำให้ลดลงชั่วคราว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33236379",
              "locator": "Abstract, methods and conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Fifteen dogs received a single dose (4 mL/kg) of 7.2% hypertonic saline (HTS), 13 dogs received 20% mannitol (MAN) 1 g/kg IV."
          }
        }
      ]
    },
    "com3--neuro-er--acute-spinal-cord-injury": {
      "claims": [
        {
          "id": "com3--neuro-er--acute-spinal-cord-injury--v1",
          "statement": "การประเมิน deep pain perception (DPP) ก่อนผ่าตัดคือตัวชี้ prognosis ที่สำคัญ สุนัขที่ไม่มี DPP กลับมาเดินได้ 12/29 ตัว เทียบกับ 71/75 ตัวในกลุ่มที่ DPP ยังอยู่ และถ้ากลับมาเดินได้ก็ใช้เวลานานกว่ามาก (median 91 วัน vs 14 วัน)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36161381",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the 50-step test provided decisive evidence that deep pain-negative dogs were less likely to recover ambulation than dogs with intact pain perception (12/29 recovered vs 71/75 ...) and, if they did recover, it took much longer (median 91 da"
          }
        }
      ]
    }
  },
  "com3--neuro-exam": {
    "com3--neuro-exam--hand-on-examination": {
      "claims": [
        {
          "id": "com3--neuro-exam--hand-on-examination--v1",
          "statement": "Cutaneous trunci reflex cut-off ใช้ระบุตำแหน่ง thoracolumbar spinal cord lesion ได้ โดยจุด cut-off อยู่ห่างจากตำแหน่ง lesion ที่รุนแรงที่สุดไปทาง caudal 0-4 vertebrae (พบ cut-off ใน 80% ของสุนัข)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22845846",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Cutaneous trunci reflex cut-off was evident in 33 (80%) of dogs. The cut-off level was 0 to 4 vertebrae caudal to the maximal spinal cord lesion in all dogs."
          }
        },
        {
          "id": "com3--neuro-exam--hand-on-examination--v2",
          "statement": "การหายไปของ cutaneous trunci reflex สัมพันธ์กับความรุนแรงของ spinal cord injury ที่มากขึ้น และหายไปตั้งแต่ grade ที่ยังไม่รุนแรงเท่ากับการเสีย ambulation",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22845846",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The presence of a cut-off significantly correlated with increasing severity (P=0.0001). Loss of the reflex occurred at less severe grades than loss of ambulation"
          }
        },
        {
          "id": "com3--neuro-exam--hand-on-examination--v3",
          "statement": "การสูญเสีย deep pain perception บ่งชี้ prognosis ที่แย่กว่ามาก สุนัขที่ deep pain negative กลับมาเดินได้เพียง 12/29 ตัว เทียบกับ 71/75 ตัวที่ pain perception ยังอยู่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36161381",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "deep pain-negative dogs were less likely to recover ambulation than dogs with intact pain perception (12/29 recovered vs 71/75"
          }
        }
      ]
    }
  },
  "com3--seizure": {
    "com3--seizure--definitions": {
      "claims": [
        {
          "id": "com3--seizure--definitions--v1",
          "statement": "Epilepsy ตามนิยาม IVETF 2015 คือโรคของสมองที่มี enduring predisposition ที่จะเกิด epileptic seizure ซึ่งในทางปฏิบัติใช้เกณฑ์ว่ามี unprovoked epileptic seizure อย่างน้อย 2 ครั้ง ห่างกันมากกว่า 24 ชั่วโมง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26316133",
              "locator": "Section 'Definitions', subsection 'Epilepsy'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Epilepsy is defined as a disease of the brain characterized by an enduring predisposition to generate epileptic seizures. This definition is usually practically applied as having at least two unprovoked epileptic seizures >24 h apart"
          }
        }
      ]
    },
    "com3--seizure--phases-of-seizure": {
      "claims": [
        {
          "id": "com3--seizure--phases-of-seizure--v1",
          "statement": "IVETF แนะนำว่าไม่ควรใช้คำว่า aura ในทางสัตวแพทย์ เพราะสัญญาณที่เจ้าของเห็นก่อนชักจริง ๆ แล้วคือ focal seizure onset ซึ่งเป็นส่วนหนึ่งของ ictus ไม่ใช่ระยะแยกต่างหาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26316133",
              "locator": "Section 'Terms describing epileptic seizure semiology', footnote 'What is an aura?'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The group recommends that the term aura is not used in veterinary medicine. The signs occurring as the first indication of seizure activity (marking the beginning of ictus) and interpreted by the dog owner as a warning sign is indeed a foca"
          }
        }
      ]
    },
    "com3--seizure--cluster-vs-status": {
      "claims": [
        {
          "id": "com3--seizure--cluster-vs-status--v1",
          "statement": "Status epilepticus นิยามว่าเป็น seizure ที่ยาวนานเกิน 5 นาที และ IVETF ยังรวมกรณีมี seizure ตั้งแต่ 2 ครั้งขึ้นไปโดยไม่ฟื้นสติระหว่างครั้งไว้ในนิยามด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37921621",
              "locator": "Section 2.1 'Duration and frequency'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A similar time frame of 5 minutes was used to define SE by the International Veterinary Epilepsy Task Force (IVETF); the task force also included ≥ 2 seizures without recovery of consciousness in between in their definition of SE."
          }
        },
        {
          "id": "com3--seizure--cluster-vs-status--v2",
          "statement": "Cluster seizures นิยามกว้าง ๆ ทั้งในคนและสัตว์ว่ามี self-limiting seizure มากกว่า 2 ครั้งภายในช่วง 24 ชั่วโมง และมีความเสี่ยงต่อ neuronal damage ใกล้เคียง status epilepticus รวมทั้งอาจดำเนินไปเป็น status ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37921621",
              "locator": "Section 2.1 'Duration and frequency'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Cluster seizures are broadly defined in humans and animals as >2 self-limiting seizures over a period of 24 hours."
          }
        }
      ]
    },
    "com3--seizure--aed-first-line": {
      "claims": [
        {
          "id": "com3--seizure--aed-first-line--v1",
          "statement": "Phenobarbital เป็น first-line AED ในสุนัข โดยลดความถี่ของ seizure ได้ประมาณ 60-93% เมื่อคุมระดับยาในพลาสมาที่ therapeutic range 25-35 mg/l และใน RCT ที่เทียบกับ bromide พบว่า 85% ของสุนัขกลุ่ม PB ไม่ชักนาน 6 เดือน เทียบกับ 52% ในกลุ่ม bromide",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26316233",
              "locator": "Section on Phenobarbital, subsection 'Efficacy'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "PB seems to be effective in decreasing seizure frequency in approximately 60−93 % of dogs with idiopathic epilepsy when plasma concentrations are maintained within the therapeutic range of 25−35 mg/l ... 85 % of dogs administered PB became "
          }
        }
      ]
    },
    "com3--seizure--status-epilepticus-emergency-tx": {
      "claims": [
        {
          "id": "com3--seizure--status-epilepticus-emergency-tx--v1",
          "statement": "ในสุนัขที่ได้ phenobarbital เรื้อรัง ต้องเพิ่มขนาด diazepam ทาง IV หรือ rectal เป็นสองเท่า เพราะ phenobarbital เหนี่ยวนำ cytochrome P450 ทำให้ระดับ benzodiazepine ลดลง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26316233",
              "locator": "Section on Phenobarbital, subsection 'Pharmacokinetic interactions'",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "As diazepam is used as first-line medicine for emergency use (e.g. status epilepticus) in practice it should be emphasized to double the IV or rectal dose of diazepam in dogs treated chronically with PB"
          }
        },
        {
          "id": "com3--seizure--status-epilepticus-emergency-tx--v2",
          "statement": "Levetiracetam ทาง IV (30 หรือ 60 mg/kg) ให้เพิ่มหลัง IV diazepam ในสุนัขที่มี status epilepticus หรือ acute repetitive seizures มี responder rate 56% เทียบกับ placebo 10% และลดจำนวน diazepam bolus ที่ต้องใช้อย่างมีนัยสำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22295898",
              "locator": "Abstract, methods and results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The responder rate (defined as dogs with no additional seizures after administration of the study medication) after LEV was 56% compared with 10% for placebo (P = .06). Dogs in the placebo group required significantly more boluses of diazep"
          }
        }
      ]
    }
  },
  "com3--ataxia-tremor": {
    "com3--ataxia-tremor--peripheral-vs-central-vestibular": {
      "claims": [
        {
          "id": "com3--ataxia-tremor--peripheral-vs-central-vestibular--v1",
          "statement": "Idiopathic vestibular disease สัมพันธ์กับอายุที่มากขึ้น น้ำหนักตัวที่มากขึ้น อาการที่ดีขึ้นเอง pathological nystagmus facial nerve paresis การไม่มี Horner's syndrome และ peripheral localisation ส่วน ischaemic infarct สัมพันธ์กับอายุมาก อาการแบบ peracute และ central localisation",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33739504",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Idiopathic vestibular disease was associated with higher age, higher bodyweight, improving clinical signs, pathological nystagmus, facial nerve paresis, absence of Horner's syndrome and a peripheral localisation."
          }
        }
      ]
    },
    "com3--ataxia-tremor--idiopathic-geriatric-vestibular-syndrome": {
      "claims": [
        {
          "id": "com3--ataxia-tremor--idiopathic-geriatric-vestibular-syndrome--v1",
          "statement": "Idiopathic vestibular disease เป็นสาเหตุที่พบบ่อยที่สุดของ vestibular syndrome ในสุนัข (78 จาก 239 ตัว) และ 95% ของสุนัขที่มาด้วย vestibular syndrome เกิดจาก 8 โรคเท่านั้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33739504",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Ninety-five percent of dogs were represented by eight conditions: idiopathic vestibular disease (n = 78 dogs), otitis media interna (n = 54), meningoencephalitis of unknown origin (n = 35), brain neoplasia (n = 26), ischaemic infarct (n = 2"
          }
        }
      ]
    },
    "com3--ataxia-tremor--tremor-classification": {
      "claims": [
        {
          "id": "com3--ataxia-tremor--tremor-classification--v1",
          "statement": "Idiopathic head tremor syndrome พบมากใน Bulldog, Labrador Retriever, Boxer และ Doberman Pinscher (รวมกัน 69% ของเคส) สุนัขมี mentation ปกติ 93% การเบี่ยงเบนความสนใจหยุดอาการได้ 87% และส่วนใหญ่ไม่ตอบสนองต่อ antiepileptic drugs",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26064776",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Bulldogs, Labrador Retrievers, Boxers, and Doberman Pinschers comprised 69%; mixed breeds comprised 17%. ... Mentation was normal in 93%. Distractions abated the tremor in 87%. Most dogs did not respond to antiepileptic drugs."
          }
        }
      ]
    },
    "com3--ataxia-tremor--cerebellar-disease-features": {
      "claims": [
        {
          "id": "com3--ataxia-tremor--cerebellar-disease-features--v1",
          "statement": "การติดเชื้อ feline parvovirus (feline panleukopenia virus) ในระยะ in utero หรือ neonatal ทำให้เกิด cerebellar hypoplasia ในลูกแมว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24923754",
              "locator": "Abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In utero or neonatal infection can result in cerebellar hypoplasia."
          }
        },
        {
          "id": "com3--ataxia-tremor--cerebellar-disease-features--v2",
          "statement": "การทดลองฉีด feline panleukopenia virus ให้ลูกแมวแรกเกิดทำให้เกิด cerebellar hypoplasia และ degeneration ที่ตรวจพบเมื่อ 22-43 วันหลังฉีด โดยพบ viral antigen จำเพาะใน cerebellar Purkinje cells",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16558064",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Macroscopic lesions included thymic atrophy in animals examined at 4 to 14 DPI and cerebellar hypoplasia and degeneration in animals examined at 22 to 43 DPI. ... Specific fluorescence was demonstrated with panleukopenia antiglobulin conjug"
          }
        }
      ]
    }
  },
  "com3--spinal": {
    "com3--spinal--hansen-type-i-ivdd": {
      "claims": [
        {
          "id": "com3--spinal--hansen-type-i-ivdd--v1",
          "statement": "Chondrodystrophy และ intervertebral disc disease ในสุนัขเกิดจาก FGF4 retrogene ที่แทรกบนโครโมโซม CFA12 ซึ่งให้ odds ratio ของ IVDD สูงถึง 51.23 (95% CI 46.69-56.20)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29073074",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The retrogene segregated with limb length and had an odds ratio of 51.23 (95% CI = 46.69, 56.20) for IVDD."
          }
        }
      ]
    },
    "com3--spinal--vertebral-fracture": {
      "claims": [
        {
          "id": "com3--spinal--vertebral-fracture--v1",
          "statement": "Deep pain perception เป็นตัวชี้ prognosis ที่สำคัญที่สุดในการบาดเจ็บ spinal cord แบบรุนแรง สุนัขที่ไม่มี DPP กลับมาเดินได้เพียง 12/29 ตัว และใช้เวลา median 91 วัน เทียบกับ 71/75 ตัวและ median 14 วันในกลุ่มที่มี DPP",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36161381",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "deep pain-negative dogs were less likely to recover ambulation than dogs with intact pain perception (12/29 recovered vs 71/75 ...) and, if they did recover, it took much longer (median 91 days vs median 14 days"
          }
        }
      ]
    },
    "com3--spinal--modified-frankel-scale-grade": {
      "claims": [
        {
          "id": "com3--spinal--modified-frankel-scale-grade--v1",
          "statement": "สุนัขเกรดรุนแรงสุด (plegia และไม่มี deep pain perception) ที่ผ่าตัด decompression กลับมาเดินได้ประมาณ 41% (12 จาก 29 ตัว) ซึ่งใกล้เคียงแต่ต่ำกว่าตัวเลข guarded 50% ที่ตำราไทยมักอ้าง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36161381",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "deep pain-negative dogs were less likely to recover ambulation than dogs with intact pain perception (12/29 recovered vs 71/75"
          }
        }
      ]
    },
    "com3--spinal--other-spinal-disorders": {
      "claims": [
        {
          "id": "com3--spinal--other-spinal-disorders--v1",
          "statement": "Cervical spondylomyelopathy (Wobbler) มีตำแหน่งกดทับหลักที่ C5-6 และ C6-7 ทั้งในสุนัขพันธุ์ใหญ่และพันธุ์ยักษ์ โดยพันธุ์ใหญ่มักเป็น disc-associated กดทับทาง ventral (82.6%) ส่วนพันธุ์ยักษ์มักเกิดจาก osseous changes (77.2%) และมีหลายจุดกดทับ (85.8%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22093094",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The main site of compression was at C5-6 and C6-7 in both large-breed (91.3%) and giant-breed (72.4%) dogs. The main cause and direction of compression was disc-associated and ventral in 19 (82.6%) of the large-breed dogs while osseous chan"
          }
        },
        {
          "id": "com3--spinal--other-spinal-disorders--v2",
          "statement": "Atlantoaxial instability เป็นความผิดปกติแต่กำเนิดที่พบเด่นในสุนัขพันธุ์ toy แสดงอาการ cranial cervical myelopathy ตั้งแต่อายุน้อย ตั้งแต่ปวดคอไปจนถึงอัมพาต และการผ่าตัดมี prognosis ที่ดีโดยทั่วไป",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26631590",
              "locator": "Abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Atlantoaxial instability is a congenital neurologic condition predominantly affecting toy breed dogs. Neurologic signs of a cranial cervical myelopathy typically present at a young age and can range from cervical pain (hyperesthesia) to par"
          }
        },
        {
          "id": "com3--spinal--other-spinal-disorders--v3",
          "statement": "สุนัขที่มี peracute non-progressive T3-L3 myelopathy จาก ANNPE หรือ FCE มี prognosis ดี โดย 99% กลับมาเดินได้ แต่ยังเหลือ motor deficit ในระยะยาว 83.6% (ANNPE) และ 92.5% (FCE) และ faecal incontinence พบใน ANNPE มากกว่า FCE ประมาณ 5 เท่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28784693",
              "locator": "Abstract, results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Ambulatory function was regained in 99 per cent of cases, with persistent motor deficits in 83.6 per cent and 92.5 per cent of dogs with presumptive ANNPE and FCEM, respectively. ... Faecal incontinence was five times more likely in dogs wi"
          }
        }
      ]
    }
  },
  "com3--acute-abdomen": {
    "com3--acute-abdomen--fluid-analysis-key": {
      "claims": [
        {
          "id": "com3--acute-abdomen--fluid-analysis-key--v1",
          "statement": "ใน septic peritoneal effusion ค่าต่างของ glucose ระหว่างเลือดกับ fluid (blood-to-fluid glucose difference) > 20 mg/dL ใช้แยก septic ออกจาก non-septic effusion ได้ โดยในสุนัขมี sensitivity 100% และ specificity 100% ส่วนในแมว sensitivity 86% และ specificity 100% และแม่นยำกว่าการดู fluid glucose อย่างเดียว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12692761",
              "locator": "Vet Surg 2003;32(2):161-6",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A blood-to-fluid glucose (BFG) difference > 20 mg/dL was 100% sensitive and 100% specific for the diagnosis of septic peritoneal effusion in dogs. ... In cats, the BFG difference was 86% sensitive and 100% specific for a diagnosis of septic"
          }
        },
        {
          "id": "com3--acute-abdomen--fluid-analysis-key--v2",
          "statement": "ใน bile peritonitis ค่า bilirubin ในของเหลวช่องท้องสูงกว่า serum bilirubin อย่างน้อย 2 เท่าอย่างสม่ำเสมอ และการวัด bilirubin ของ effusion เป็น test เดียวที่วินิจฉัย bile leakage ได้ถูกต้อง 100% ก่อนผ่าตัดในการศึกษานี้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9068158",
              "locator": "Vet Surg 1997;26(2):90-8",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Determination of the bilirubin concentration of the abdominal effusion was the only diagnostic test that was 100% effective in diagnosing bile leakage before surgical intervention. The bilirubin concentration of the effusion was consistentl"
          }
        },
        {
          "id": "com3--acute-abdomen--fluid-analysis-key--v3",
          "statement": "ใน uroperitoneum ของแมว ค่า creatinine และ K+ ในของเหลวช่องท้องสูงกว่าใน serum โดยมี mean serum : effusion ratio ประมาณ 1 : 2 สำหรับ creatinine และ 1 : 1.9 สำหรับ potassium ซึ่งใช้เป็นตัวชี้บ่ง uroperitoneum ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9657166",
              "locator": "J Am Anim Hosp Assoc 1998;34(4):315-24",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The creatinine or potassium (K+) concentration in the serum compared to that in the peritoneal effusion (mean ratio, 1:2 and 1:1.9, respectively) was a useful indicator for UP."
          }
        }
      ]
    },
    "com3--acute-abdomen--afast-4-point-scan": {
      "claims": [
        {
          "id": "com3--acute-abdomen--afast-4-point-scan--v1",
          "statement": "AFAST ให้ abdominal fluid score (AFS) เป็น 4-point scale ตั้งแต่ AFS 0 (ไม่พบ fluid ทุก quadrant) ถึง AFS 4 (พบ fluid ทุก quadrant) โดยสุนัขที่ได้ AFS 3 หรือ 4 มี PCV และ total plasma protein ลดลงมากกว่า และต้องการ blood transfusion มากกว่าสุนัขที่ AFS ต่ำกว่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19821883",
              "locator": "J Vet Emerg Crit Care 2009;19(5):426-37",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "An AFS was assigned to each dog based on the number of AFAST fluid-positive quadrants identified using a 4-point scale: AFS 0 (negative for fluid in all quadrants) to AFS 4 (positive for fluid in all quadrants). ... Dogs with AFS scores of "
          }
        }
      ]
    },
    "com3--acute-abdomen--categorization": {
      "claims": [
        {
          "id": "com3--acute-abdomen--categorization--v1",
          "statement": "GDV จัดเป็นภาวะ critical ที่ต้องผ่าตัดทันที โดยพบ gastric necrosis ใน 37% ของสุนัข GDV และสุนัขที่มี gastric necrosis รอดชีวิตเพียง 66% เทียบกับ 98% ในกลุ่มที่ไม่มี ส่วน preoperative plasma lactate > 6.0 mmol/L สัมพันธ์กับอัตรารอด 58% เทียบกับ 99% เมื่อ lactate < 6.0 mmol/L",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10397065",
              "locator": "J Am Vet Med Assoc 1999;215(1):49-52",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "69 of 70 (99%) dogs with plasma lactate concentration < 6.0 mmol/L survived, compared with 18 of 31 (58%) dogs with plasma lactate concentration > 6.0 mmol/L ... Gastric necrosis was identified in 38 (37%) dogs. ... Sixty-two of 63 (98%) do"
          }
        }
      ]
    }
  },
  "com3--metabolic-er": {
    "com3--metabolic-er--diabetic-ketoacidosis-dka": {
      "claims": [
        {
          "id": "com3--metabolic-er--diabetic-ketoacidosis-dka--v1",
          "statement": "การรักษา DKA ในสุนัขด้วย regular insulin แบบ low-dose continuous IV infusion ใช้ขนาด 2.2 U/kg ต่อ 24 ชั่วโมง และสุนัขส่วนใหญ่ (15 จาก 21 ตัว) ต้องได้รับ potassium supplementation ระหว่างการรักษา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8496083",
              "locator": "J Am Vet Med Assoc 1993;202(8):1266-72",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In a prospective clinical trial, low-dose, continuous, IV infusion of insulin (dosage, 2.2 U/kg of body weight, q 24 h) was used to treat 21 dogs with diabetic ketoacidosis. ... Potassium supplementation was required in 15 of 21 dogs."
          }
        },
        {
          "id": "com3--metabolic-er--diabetic-ketoacidosis-dka--v2",
          "statement": "แมวที่เป็น diabetic ketosis/ketoacidosis มักมีโรคร่วม (39 จาก 42 ตัว) ได้แก่ hepatic lipidosis, cholangiohepatitis, pancreatitis, chronic renal failure, urinary tract infection และ neoplasia ส่วนผลแล็บที่พบบ่อยคือ hyperglycemia, hypokalemia, hypophosphatemia, hyponatremia, low total CO2, azotemia, glycosuria และ ketonuria",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9227749",
              "locator": "J Am Vet Med Assoc 1997;211(2):188-92",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Common laboratory findings were hyperglycemia, hyponatremia, hypochloremia, hypokalemia, hypocalcemia, hypophosphatemia, low total CO2 content, hyperosmolality, high serum alanine transaminase activity, azotemia, glycosuria, and ketonuria. "
          }
        },
        {
          "id": "com3--metabolic-er--diabetic-ketoacidosis-dka--v3",
          "statement": "Hypophosphatemia เป็นภาวะแทรกซ้อนที่พบระหว่างให้ insulin CRI ใน DKA ของแมว และรุนแรงพอที่ต้องให้ phosphate supplementation (พบ 3 จาก 9 ตัวในกลุ่ม regular insulin และ 1 จาก 9 ตัวในกลุ่ม lispro insulin)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29513157",
              "locator": "J Feline Med Surg 2018;21(2):115-123",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Two cats in group R developed hypoglycaemia during the CRI of insulin. One cat in group L and three cats in group R developed hypophosphataemia, which required phosphate supplementation."
          }
        }
      ]
    },
    "com3--metabolic-er--addisonian-crisis-hypoadrenocorticism": {
      "claims": [
        {
          "id": "com3--metabolic-er--addisonian-crisis-hypoadrenocorticism--v1",
          "statement": "Na : K ratio เป็น screening test ที่ดีสำหรับ canine hypoadrenocorticism โดย cutoff ที่ Na : K <= 22 ให้ sensitivity 92% และ specificity 91% (ROC AUC 0.905) และการรวมกับ neutrophil-to-lymphocyte ratio <= 2.3 มีความจำเพาะสูงจนใช้ rule in โรคได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25119630",
              "locator": "Tierarztl Prax Ausg K Kleintiere Heimtiere 2014;42(4):223-30",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The best single variables to diagnose HA were the endogenous ACTH concentration (area under the ROC curve [ROC AUC] 0.97; cutoff > 50 pmol/l: sensitivity 96%, specificity 100%) and the Na/KR (ROC AUC 0.905; cutoff <= 22: sensitivity 92%, sp"
          }
        },
        {
          "id": "com3--metabolic-er--addisonian-crisis-hypoadrenocorticism--v2",
          "statement": "ในสุนัข hypoadrenocorticism 225 ตัว พบ hyperkalemia 215 ตัว, hyponatremia 183 ตัว และ hypochloremia 94 ตัว ร่วมกับ azotemia และ hyperphosphatemia ในสุนัขส่วนใหญ่ และ ACTH stimulation test ให้ baseline cortisol ต่ำถึงค่อนข้างต่ำโดยแทบไม่เพิ่มขึ้นหลังให้ ACTH",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8682712",
              "locator": "J Am Vet Med Assoc 1996;208(1):85-91",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Serum electrolyte changes included hyperkalemia (n = 215), hyponatremia (183), hypochloremia (94), and hypercalcemia (69). ... In all dogs, ACTH stimulation testing revealed a low to low-normal baseline serum cortisol concentration with lit"
          }
        }
      ]
    },
    "com3--metabolic-er--urethral-obstruction": {
      "claims": [
        {
          "id": "com3--metabolic-er--urethral-obstruction--v1",
          "statement": "แมวที่มี urethral obstruction พบ electrocardiographic abnormalities 21 จาก 33 ตัว (63.6%) ในวันที่รับเข้ารักษา และความผิดปกติทาง ECG หายไปในวันถัดมาหลังได้รับการแก้ไข electrolyte และ acid-base",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34566314",
              "locator": "Vet World 2021;14(8):2002-2008",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Electrocardiographic abnormalities were observed in 21/33 (63.63%) of the felines on admission day. The electrocardiographic abnormalities were no longer observed on the subsequent days. ... This study suggests the sum and severity of elect"
          }
        }
      ]
    }
  },
  "com3--er-anes": {
    "com3--er-anes--gdv-anesthesia": {
      "claims": [
        {
          "id": "com3--er-anes--gdv-anesthesia--v1",
          "statement": "ในสุนัข GDV การพบ cardiac arrhythmia ก่อนผ่าตัดสัมพันธ์กับ overall mortality ที่เพิ่มขึ้นอย่างมีนัยสำคัญ และ arrhythmia หลังผ่าตัดสัมพันธ์กับ postoperative mortality ที่เพิ่มขึ้น จึงต้อง monitor ECG ต่อเนื่องในช่วง post-op",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20194364",
              "locator": "46(2):97-102",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The factor that was associated with a significant increase in overall mortality was the presence of preoperative cardiac arrhythmias. Factors that were associated with a significant increase in postoperative mortality were postoperative car"
          }
        },
        {
          "id": "com3--er-anes--gdv-anesthesia--v2",
          "statement": "IV lidocaine ถูกใช้ในการจัดการ GDV เพื่อรับมือกับ ischaemia-reperfusion injury และ cardiac arrhythmia โดยรายงาน mortality rate ของ GDV ในสุนัขอยู่ที่ 10-28% แม้ได้รับการรักษาทั้งทางยาและการผ่าตัดอย่างเหมาะสม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25496926",
              "locator": "29(3):81-5",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Therapy with intravenous lidocaine may play a central role in combating IRI and cardiac arrhythmias. ... Despite appropriate medical and surgical treatment, the reported mortality rate in dogs with GDV is high (10%-28%)."
          }
        }
      ]
    },
    "com3--er-anes--urethral-obstruction-cat": {
      "claims": [
        {
          "id": "com3--er-anes--urethral-obstruction-cat--v1",
          "statement": "ในแมวเพศผู้ที่มี urethral obstruction ร่วมกับ K+ > 7.5 mEq/L การให้ IV fluid ร่วมกับ calcium gluconate และการปลดการอุดตันโดยเร็ว ลด potassium จาก median 9.1 เหลือ 5.4 mEq/L ภายใน 4 ชั่วโมง โดยการเติม insulin-dextrose, terbutaline หรือ sodium bicarbonate ไม่ได้ให้ประโยชน์เพิ่มขึ้นอย่างมีนัยสำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40562375",
              "locator": "263(10):1268-1272",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The median baseline and 4-hour potassium for all cats was 9.1 mEq/L (range, 7.5 to 11.8 mEq/L) and 5.4 mEq/L (range, 4 to 8 mEq/L) respectively. ... There was no significant difference in percentage change in potassium between groups. ... P"
          }
        }
      ]
    },
    "com3--er-anes--dystocia-caesarean": {
      "claims": [
        {
          "id": "com3--er-anes--dystocia-caesarean--v1",
          "statement": "ใน caesarean section ของสุนัข การ induce ด้วย alfaxalone สัมพันธ์กับ neonatal vitality (modified Apgar score) ที่ดีกว่า propofol ในช่วง 60 นาทีแรกหลังคลอด (ผลต่างของคะแนนโดยรวมประมาณ 3.3) แต่สัดส่วนลูกสุนัขที่รอดชีวิตไม่ต่างกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23932170",
              "locator": "80(8):850-4",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Apgar scores in the alfaxalone group were greater than those in the propofol group at 5, 15, and 60 minutes after delivery; the overall estimated score difference between the groups was 3.3 (confidence interval 95%: 1.6-4.9; P < 0.001). ..."
          }
        }
      ]
    },
    "com3--er-anes--drug-summary": {
      "claims": [
        {
          "id": "com3--er-anes--drug-summary--v1",
          "statement": "Dexmedetomidine (α2-agonist) แบบ CRI ลด heart rate, cardiac output, cardiac index และ oxygen delivery อย่างมีนัยสำคัญ พร้อมกับเพิ่ม systemic vascular resistance index ในสุนัขที่วางยาสลบด้วย sevoflurane",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28698692",
              "locator": "58(7):729-734",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "These effects were characterized by a significant (< 0.001) decrease in heart rate, cardiac output, cardiac index, oxygen delivery, and pulmonary vascular resistance index, and a significant (< 0.001) increase in mean and diastolic arterial"
          }
        },
        {
          "id": "com3--er-anes--drug-summary--v2",
          "statement": "Propofol induction ทำให้ MAP ลดลงอย่างมีนัยสำคัญในช่วง 45-75 วินาทีแรก และพบ hypotension (MAP < 60 mmHg) 3/12 (25%) ตัว เทียบกับ alfaxalone 1/14 (8%) ในสุนัขสุขภาพดีที่ได้ premedication แม้ความแตกต่างระหว่างกลุ่มจะไม่ถึงระดับนัยสำคัญทางสถิติ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39323870",
              "locator": "11:1442670",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Treatment P resulted in a significant decrease in MAP between 45 and 75 s during the induction period... During induction, hypotension was detected in 3/12 (25%) dogs in Group P and 1/14 (8%) in Group A. In healthy premedicated dogs, propof"
          }
        }
      ]
    }
  },
  "com3--nutrition": {
    "com3--nutrition--why-nutrition-matters": {
      "claims": [
        {
          "id": "com3--nutrition--why-nutrition-matters--v1",
          "statement": "Hepatic lipidosis เป็นภาวะ liver dysfunction ที่พบบ่อยที่สุดในแมว โดย classic presentation คือแมวน้ำหนักเกินที่หยุดกินอาหารเป็นเวลาหลายวันถึงหลายสัปดาห์แล้วน้ำหนักลด ถ้าตรวจพบเร็วและรักษาถูกต้อง prognosis ดี ถ้าไม่ prognosis เลวร้าย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29478399",
              "locator": "20(3):217-227",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Hepatic lipidosis (HL) is the most common form of liver dysfunction in cats. If recognized early and treated appropriately, the prognosis is good; if not, the prognosis is grave. ... The classic presentation is that of an overweight cat tha"
          }
        }
      ]
    },
    "com3--nutrition--when-to-start-feeding": {
      "claims": [
        {
          "id": "com3--nutrition--when-to-start-feeding--v1",
          "statement": "ในสุนัขที่ผ่าตัด septic peritonitis การเริ่ม enteral nutrition ภายใน 24 ชั่วโมงหลังผ่าตัด (early enteral nutrition) ไม่เพิ่ม gastrointestinal complication เมื่อเทียบกับการเริ่มช้าหรือไม่ให้เลย และกลุ่มที่ไม่ได้รับ enteral nutrition เลยมีอัตรารอดต่ำกว่า (46% เทียบกับ 81%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28282229",
              "locator": "53(2):90-95",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There was no significant difference in the number of gastrointestinal complications postoperatively between the EEN, LEN, and NEN groups... although fewer dogs in the NEN group survived compared to the EEN/LEN combined group (46% [6/13] ver"
          }
        }
      ]
    },
    "com3--nutrition--feeding-tubes-selection": {
      "claims": [
        {
          "id": "com3--nutrition--feeding-tubes-selection--v1",
          "statement": "Esophagostomy tube (E-tube) มี complication rate รวมประมาณ 44.4% (สุนัข 43.1%, แมว 45.5%) โดย infection ที่ตำแหน่ง stoma พบในแมว 17.8% และสุนัข 13.7%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31294877",
              "locator": "33(5):2014-2019",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "One hundred patients (44.4%) experienced a complication related to tube placement, with a similar complication rate among dogs (43.1%) and cats (45.5%). Twenty-two cats (17.8%) and 14 dogs (13.7%) developed signs of infection at the E-tube "
          }
        }
      ]
    },
    "com3--nutrition--feeding-protocol": {
      "claims": [
        {
          "id": "com3--nutrition--feeding-protocol--v1",
          "statement": "Refeeding syndrome คือภาวะ severe hypophosphatemia ที่เกิดหลังเริ่มให้ enteral หรือ parenteral nutrition ในสัตว์ป่วยที่น้ำหนักลดอย่างรุนแรง และมีรายงานยืนยันในแมวที่เป็น hepatic lipidosis หลังเริ่ม enteral nutrition",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21719333",
              "locator": "13(8):614-7",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Refeeding syndrome is characterized by severe hypophosphatemia occurring in patients given enteral or parenteral nutrition after severe weight loss. ... This report describes a case of a domestic shorthair cat diagnosed with hepatic lipidos"
          }
        }
      ]
    },
    "com3--nutrition--essential-amino-acids-in-cats": {
      "claims": [
        {
          "id": "com3--nutrition--essential-amino-acids-in-cats--v1",
          "statement": "Taurine deficiency ในแมวสัมพันธ์กับ myocardial failure แบบ dilated cardiomyopathy และการเสริม taurine ทางปากทำให้ left ventricular function กลับมาเป็นปกติได้ (reversible cardiomyopathy)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-3616607",
              "locator": "237(4816):764-8",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "low plasma taurine concentrations associated with echocardiographic evidence of myocardial failure were observed in 21 cats fed commercial cat foods and in 2 of 11 cats fed a purified diet containing marginally low concentrations of taurine"
          }
        },
        {
          "id": "com3--nutrition--essential-amino-acids-in-cats--v2",
          "statement": "แมวที่อดอาหารข้ามคืนแล้วได้รับอาหารที่ขาด arginine เพียงมื้อเดียว เกิด hyperammonemia และแสดงอาการ ammonia toxicity ภายใน 2 ชั่วโมง โดยมีแมวหนึ่งตัวตายภายใน 4.5 ชั่วโมงหลังกินอาหารเพียง 8 กรัม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-619464",
              "locator": "199(4327):431-2",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Near-adult cats, fasted overnight, and given a single meal of a complete amino acid diet without arginine, developed hyperammonemia and showed clinical symptoms of ammonia toxicity within 2 hours. One cat (2.7 kilograms) died 4.5 hours afte"
          }
        }
      ]
    }
  },
  "com3--ai-vet": {
    "com3--ai-vet--hallucination-risk-mitigation": {
      "claims": [
        {
          "id": "com3--ai-vet--hallucination-risk-mitigation--v1",
          "statement": "ในการทดสอบ multimodal GPT-based model กับ canine cutaneous neoplasm 51 ราย ได้ strict diagnostic accuracy 66.7% และ broad accuracy 90.2% โดยผู้วิจัยระบุว่าความเสี่ยงของ output ที่ดูสมเหตุสมผลแต่ไม่ตรงกับ diagnosis จริง (plausible but non-concordant outputs) ทำให้ต้องมี human supervision อย่างเข้มงวด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42450777",
              "locator": "16(13):2070",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Overall, the model achieved a strict diagnostic accuracy of 66.7% (34/51; 95% CI: 53.0-78.0) and a broad diagnostic accuracy of 90.2% (46/51; 95% CI: 79.0-95.7). ... However, reduced entity-level specificity, variable descriptive quality, a"
          }
        }
      ]
    },
    "com3--ai-vet--limitations-to-know": {
      "claims": [
        {
          "id": "com3--ai-vet--limitations-to-know--v1",
          "statement": "ในการอ่าน thoracic radiograph ของสุนัขและแมว deep learning network มี overall error rate 10.7% ต่ำกว่าสัตวแพทย์ (16.8%) แต่กลุ่มสัตวแพทย์ที่ใช้ AI ช่วย (17.2%) ไม่ได้ดีกว่าสัตวแพทย์ที่อ่านเอง และตัว network เองระบุเพียงชนิดของ lesion ไม่ได้ให้ diagnosis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32996208",
              "locator": "61(6):619-627",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The overall error rate of the network was significantly better than the overall error rate of the veterinarians or the veterinarians aided by the network (10.7% vs 16.8% vs 17.2%, P = .001). ... The current network only provides help in det"
          }
        },
        {
          "id": "com3--ai-vet--limitations-to-know--v2",
          "statement": "Multi-label CNN ที่จำแนก thoracic radiograph ของสุนัขมี AUC มากกว่า 0.8 ในทุก radiographic finding ยกเว้น bronchial pattern และ interstitial pattern และ generalization ไปยังภาพจากเครื่องถ่ายอีกระบบหนึ่งแตกต่างกันอย่างมีนัยสำคัญระหว่างสถาปัตยกรรมสองแบบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33597566",
              "locator": "11(1):3964",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The CNN based on ResNet-50 had an Area Under the Receive-Operator Curve (AUC) above 0.8 for all the included radiographic findings except for bronchial and interstitial patterns both on Data Set 1 and Data Set 2. ... Statistically significa"
          }
        }
      ]
    },
    "com3--ai-vet--ethics-citation": {
      "claims": [
        {
          "id": "com3--ai-vet--ethics-citation--v1",
          "statement": "องค์กรด้านจริยธรรมการตีพิมพ์ รวมถึง ICMJE และ COPE ได้กำหนดชัดเจนว่า large language model เช่น ChatGPT ไม่เข้าเกณฑ์การเป็น author เนื่องจากไม่สามารถรับผิดชอบ (accountability) ต่อผลงานได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38693669",
              "locator": "32(7):1148-1158",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Notable ethics organizations, including the ICMJE and COPE, alongside leading publishers, have instituted ethics clauses explicitly stating that such models do not meet the criteria for authorship due to accountability issues."
          }
        }
      ]
    },
    "com3--ai-vet--privacy-phi": {
      "claims": [
        {
          "id": "com3--ai-vet--privacy-phi--v1",
          "statement": "การนำ AI มาใช้ในทางสัตวแพทย์ต้องจัดการประเด็นทางจริยธรรมและกฎหมายเฉพาะทาง ได้แก่ data privacy, การขอความยินยอมจากเจ้าของสัตว์ (owner consent) และผลของ AI output ต่อการตัดสินใจทางคลินิก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38599232",
              "locator": "262(8):1090-1098",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Incorporating AI into veterinary medicine requires addressing unique ethical and legal considerations, including data privacy, owner consent, and the impact of AI outputs on decision-making."
          }
        }
      ]
    },
    "com3--ai-vet--prompt-engineering-best-practice": {
      "claims": [
        {
          "id": "com3--ai-vet--prompt-engineering-best-practice--v1",
          "statement": "ในการใช้ LLM ดึงข้อมูลทางคลินิกจาก veterinary electronic health record มีการเสนอ practical framework ที่ครอบคลุม data preparation, platform and privacy considerations และ prompt engineering โดย prompt-based LLM ทำ information extraction ได้ด้วย annotated data set ที่เล็กกว่าวิธี supervised แบบเดิม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42460772",
              "locator": "Online ahead of print: 3009858261461761",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In the veterinary literature, larger data sets were more commonly used to train supervised models, whereas human studies increasingly employed prompt-based LLMs, such as LLaMA and GPT, enabling IE with smaller annotated data sets. We develo"
          }
        }
      ]
    }
  },
  "com4--derm-bacterial": {
    "com4--derm-bacterial--etiologic-agents": {
      "claims": [
        {
          "id": "com4--derm-bacterial--etiologic-agents--v1",
          "statement": "Superficial bacterial folliculitis (SBF) ในสุนัข โดยทั่วไปมีสาเหตุจาก Staphylococcus pseudintermedius และมักรักษาด้วย systemic antimicrobial",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24720433",
              "locator": "Background section of the guideline abstract; Vet Dermatol 2014;25(3):163-e43. Exact clause/section number within the full guideline not verified.",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Superficial bacterial folliculitis (SBF) is usually caused by Staphylococcus pseudintermedius and routinely treated with systemic antimicrobial agents."
          }
        },
        {
          "id": "com4--derm-bacterial--etiologic-agents--v2",
          "statement": "การได้รับยาปฏิชีวนะมาก่อนเป็น risk factor ของ MRSP pyoderma โดยสุนัขกลุ่ม MRSP ได้รับ beta-lactam มาก่อน 98% เทียบกับ MSSP 82% (P = 0.007) และได้ยาหลายคอร์ส หลาย class มากกว่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26909526",
              "locator": "Results and Conclusions of the abstract; Vet Dermatol 2016;27(2):72-8e20. Retrospective study of 53 MRSP and 45 MSSP pyoderma cases.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "More cases with MRSP (98%) received beta-lactam drugs than those with MSSP (82%; P = 0.007) and the proportion of MRSP cases that had received concurrent immunomodulatory therapy was higher (62% versus 42%; P = 0.048)."
          }
        },
        {
          "id": "com4--derm-bacterial--etiologic-agents--v3",
          "statement": "ในสุนัข pyoderma ที่โรงพยาบาลอ้างอิงแห่งหนึ่งในประเทศไทย (2019-2020) พบ oxacillin-resistant mecA-positive S. pseudintermedius 33/87 isolates (37.9%) จากสุนัข 15/46 ตัว และทุก isolate ที่ดื้อ oxacillin เป็น multidrug-resistant",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39272398",
              "locator": "Results of the abstract; Animals (Basel) 2024;14(17):2613. 87 isolates from 46 dogs, referral hospital in Thailand, 2019-2020.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Among the 87 isolates, 33 isolates (37.9%) recovered from 15 dogs were oxacillin-resistant (OR-MRSP), while 54 isolates (62.1%) from 31 dogs were oxacillin-susceptible (OS-MRSP). All OR-MRSP isolates exhibited multidrug resistance (MDR), an"
          }
        }
      ]
    },
    "com4--derm-bacterial--diagnosis-treatment": {
      "claims": [
        {
          "id": "com4--derm-bacterial--diagnosis-treatment--v1",
          "statement": "ควรทำ culture and susceptibility ในสุนัขที่เคยได้ยาปฏิชีวนะหลายคอร์ส หรือได้ยาภายใน 1 เดือนก่อนเก็บตัวอย่าง เพราะสัมพันธ์กับ meticillin resistance (60.7%, P = 0.009) และ multidrug resistance (61.9%, P = 0.029)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27870236",
              "locator": "Results and Conclusions of the abstract; Vet Dermatol 2016;27(6):468-e125.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Antimicrobial therapy within 1 month prior to sampling was also associated with MR (60.7%; P = 0.009) and multidrug resistance (61.9%; P = 0.029). ... Treatment based upon culture and susceptibility testing is highly recommended for dogs th"
          }
        },
        {
          "id": "com4--derm-bacterial--diagnosis-treatment--v2",
          "statement": "Cephalexin ทำให้ canine superficial pyoderma หายทุกตัวใน 14-42 วัน (median 28 วัน) โดยให้ยาต่อจนถึง 14 วันหลัง clinical remission และขนาด 30 mg/kg PO วันละครั้ง ได้ผลไม่ต่างจากการแบ่งให้ q12h",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18631220",
              "locator": "Materials/Methods and Results of the abstract; J Small Anim Pract 2008;49(8):384-91. 20 dogs per arm.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Resolution of superficial pyoderma was obtained in all dogs in 14 to 42 days (median 28 days for both groups), with no difference between groups. ... Once-daily cephalexin is as effective as twice-daily cephalexin in the treatment of canine"
          }
        },
        {
          "id": "com4--derm-bacterial--diagnosis-treatment--v3",
          "statement": "Topical 4% chlorhexidine digluconate shampoo (สัปดาห์ละ 2 ครั้ง) ร่วมกับ solution (วันละครั้ง) นาน 4 สัปดาห์ ให้ผลไม่ต่างจาก amoxicillin-clavulanic acid 25 mg/kg q12h นาน 4 สัปดาห์ ใน canine superficial pyoderma และทำให้อาการหายทุกตัวรวมถึงรายที่ติด MRSP",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26140535",
              "locator": "Methods, Results and Conclusions of the abstract; Vet Dermatol 2015;26(5):339-44,e72. Group T n=31, Group S n=20; S. pseudintermedius from 48 dogs including 8 MRSP.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Treatment with chlorhexidine products resulted in resolution of clinical signs in all dogs including those infected with MRSP. ... Topical therapy with chlorhexidine digluconate products may be as effective as systemic therapy with amoxicil"
          }
        }
      ]
    }
  },
  "com4--derm-fungal": {
    "com4--derm-fungal--diagnosis": {
      "claims": [
        {
          "id": "com4--derm-fungal--diagnosis--v1",
          "statement": "ตาม WAVD clinical consensus guidelines ไม่มี diagnostic test ใดเป็น gold standard เดี่ยว ๆ สำหรับ dermatophytosis ในสุนัขและแมว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28516493",
              "locator": "Conclusions and clinical importance of the guideline abstract; Vet Dermatol 2017;28(3):266-e68. Exact section number within the full guideline not verified.",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "No one diagnostic test was identified as the gold standard."
          }
        },
        {
          "id": "com4--derm-fungal--diagnosis--v2",
          "statement": "ในแมว shelter การตรวจด้วย Wood's lamp มี sensitivity 71% และ specificity 92% เมื่อเทียบกับการเพาะเชื้อบน Sabouraud's agar โดยแมว 48.57% เรืองแสง ขณะที่เพาะเชื้อขึ้น 64.29% และในแมวที่มีรอยโรคทางผิวหนัง 81.58% เรืองแสง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37982054",
              "locator": "Results section and Tables 1 and 4; Vet Med (Praha) 2023;68(7):281-286. n = 70 shelter cats, October 2021.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The prevalence of by diagnosis on Sabouraud's agar was 64.29% of cats, with the help of Wood's lamp 48.57% of cats showed positive fluorescence. The sensitivity of the Wood lamp examination was 71% and the specificity was 92%."
          }
        }
      ]
    },
    "com4--derm-fungal--treatment": {
      "claims": [
        {
          "id": "com4--derm-fungal--treatment--v1",
          "statement": "การรักษา dermatophytosis ให้สำเร็จต้องใช้ systemic oral antifungal ร่วมกับ topical disinfection ของเส้นขนพร้อมกัน และการทำความสะอาดเชิงกายภาพเป็นสิ่งสำคัญที่สุดในการ decontaminate สิ่งแวดล้อม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28516493",
              "locator": "Conclusions and clinical importance of the guideline abstract; Vet Dermatol 2017;28(3):266-e68. Exact section number within the full guideline not verified.",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Successful treatment requires concurrent use of systemic oral antifungals and topical disinfection of the hair coat. ... systemic antifungal drugs have a wide margin of safety and physical cleaning is most important for decontamination of t"
          }
        }
      ]
    },
    "com4--derm-fungal--dermatophytosis-ringworm": {
      "claims": [
        {
          "id": "com4--derm-fungal--dermatophytosis-ringworm--v1",
          "statement": "อัตราการแยกเชื้อ dermatophyte จากแมวสูงกว่าสุนัขอย่างมีนัยสำคัญ (15.9% ของ 1,389 ตัวอย่าง เทียบกับ 8.1% ของ 2,193, P < 0.001) และพบบ่อยกว่าในแมวพันธุ์ Persian และ chinchilla (P ≤ 0.002)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32958545",
              "locator": "Results of the abstract; Vet Rec 2020;187(10):e87. 27-year laboratory submission review, Royal Veterinary College.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Proportional isolation from cats (15.9 per cent of 1389) exceeded that of dogs (8.1 per cent of 2193) (P<0.001). ... Dermatophytes were more frequent (P≤0.001) in samples from first-opinion rather than referral practice, and from Jack Russe"
          }
        },
        {
          "id": "com4--derm-fungal--dermatophytosis-ringworm--v2",
          "statement": "Dermatophytosis เป็นโรคผิวหนังที่ติดต่อได้และติดต่อจากสัตว์สู่คนได้ แต่ภาวะแทรกซ้อนรุนแรงจากการติดต่อสัตว์สู่คนพบได้น้อยมาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28516493",
              "locator": "Background and Conclusions of the guideline abstract; Vet Dermatol 2017;28(3):266-e68. Exact section number within the full guideline not verified.",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "It is an important skin disease because it is contagious, infectious and can be transmitted to people. ... Finally, serious complications of animal-human transmission are exceedingly rare."
          }
        }
      ]
    },
    "com4--derm-fungal--malassezia-dermatitis": {
      "claims": [
        {
          "id": "com4--derm-fungal--malassezia-dermatitis--v1",
          "statement": "Malassezia เป็นกลุ่ม lipophilic yeast ที่วิวัฒนาการมาเป็นทั้ง skin commensal และ opportunistic cutaneous pathogen และมีทั้ง topical และ systemic therapy ที่ได้ผล โดยเฉพาะเมื่อระบุและแก้ไข predisposing factor ร่วมด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31957204",
              "locator": "Background and Conclusions of the guideline abstract; Vet Dermatol 2020;31(1):28-74. Exact section number within the full guideline not verified.",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The genus Malassezia is comprised of a group of lipophilic yeasts that have evolved as skin commensals and opportunistic cutaneous pathogens of a variety of mammals and birds. ... A range of topical and systemic therapies is known to be eff"
          }
        }
      ]
    }
  },
  "com4--derm-parasitic": {
    "com4--derm-parasitic--mites-comparison": {
      "claims": [
        {
          "id": "com4--derm-parasitic--mites-comparison--v1",
          "statement": "Fluralaner ครั้งเดียว (แบบกินหรือแบบหยดหลัง) กำจัดไรได้อย่างน้อย 98.0% ของสุนัขที่เป็น generalized demodicosis ทั้งวันที่ 56 และ 84 โดยติดตามด้วย deep skin scrapings ขณะที่ imidacloprid-moxidectin แบบทาซ้ำหลายครั้งได้เพียง 87.5% ซึ่งไม่ผ่านเกณฑ์ efficacy",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32527282",
              "locator": "Methods and Results of the abstract; Parasit Vectors 2020;13(1):304. 134 dogs enrolled across 5 European countries, 124 completed.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "At each visit (Days 0, 28, 56, 84), dogs were monitored for demodectic mites using deep skin scrapings and observed for health and for severity of skin lesions. ... A single treatment with oral or spot-on fluralaner was efficacious, each el"
          }
        },
        {
          "id": "com4--derm-parasitic--mites-comparison--v2",
          "statement": "Sarcoptic mange วินิจฉัยยากเพราะอาการคล้ายโรคอื่น มี cross-antigenicity และวิธีตรวจที่มีอยู่มี sensitivity ต่ำ จึงมักใช้ therapeutic trial เพื่อยืนยันโรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37798627",
              "locator": "Background of the abstract; BMC Vet Res 2023;19(1):189. Critically appraised topic, not a primary trial.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Because of clinical similarity with other diseases, cross-antigenicity, and low sensitivity of available diagnostic methods, therapeutical trial is frequently used to confirm the disease."
          }
        },
        {
          "id": "com4--derm-parasitic--mites-comparison--v3",
          "statement": "ยาที่ทำให้ canine sarcoptic mange หายทั้งทาง parasitological และ clinical ได้แก่ afoxolaner, fluralaner, sarolaner และ macrocyclic lactone เช่น selamectin, moxidectin และ milbemycin oxime",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37798627",
              "locator": "Results and Conclusions of the abstract; BMC Vet Res 2023;19(1):189.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Analysis of the results showed that afoxolaner, fluralaner and sarolaner as well as several macrocyclic lactones such as selamectin, moxidectin and milbemycin oxime can lead to parasitological and clinical cure."
          }
        }
      ]
    },
    "com4--derm-parasitic--fleas-fad": {
      "claims": [
        {
          "id": "com4--derm-parasitic--fleas-fad--v1",
          "statement": "Ctenocephalides felis เป็น flea ที่พบมากที่สุดในสุนัขและแมวเลี้ยงในเอเชียตะวันออกและเอเชียตะวันออกเฉียงใต้ (รวมประเทศไทย) โดยพบในแมว 97.85% และสุนัข 75% รองลงมาคือ Ctenocephalides orientis ในสุนัข 18.75% และพบในแมวเพียง 5.2%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35545848",
              "locator": "Results of the abstract; Zoonoses Public Health 2022;69(6):704-720. 93 cats, 96 dogs, 189 fleas; countries sampled included Indonesia, Malaysia, the Philippines, Taiwan and Thailand.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Ctenocephalides felis was the dominant flea species infesting both cats (97.85%) and dogs (75%) followed by Ctenocephalides orientis in dogs (18.75%) and rarely in cats (5.2%)."
          }
        }
      ]
    },
    "com4--derm-parasitic--ticks": {
      "claims": [
        {
          "id": "com4--derm-parasitic--ticks--v1",
          "statement": "Rhipicephalus sanguineus เป็นเห็บหลักที่พบบนสุนัขและแมวจรในวัดเขตกรุงเทพมหานคร และตรวจพบเชื้อ Bartonella koehlerae และ Bartonella phoceensis อย่างละ 1.25% ในเห็บชนิดนี้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34474805",
              "locator": "Results of the abstract; Vet Parasitol Reg Stud Reports 2021;25:100612. 343 ectoparasites from free-ranging cats and dogs across Bangkok temple clusters.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The major parasitizing ticks and fleas in this study were Rhipicephalus sanguineus and Ctenocephalides felis, respectively. ... the gltA amplicons revealed the presence of B. henselae (4.78%) and B. clarridgeiae (4.78%) in C. felis, and B. "
          }
        },
        {
          "id": "com4--derm-parasitic--ticks--v2",
          "statement": "Speed of kill ของ afoxolaner และ fluralaner ต่อ Rhipicephalus sanguineus ไม่เร็วพอที่จะป้องกันการถ่ายทอด Ehrlichia canis (สุนัขติดเชื้อ 4/8 และ 2/8 ตัวตามลำดับ) ขณะที่ permethrin/imidacloprid แบบหยดหลังบล็อกการถ่ายทอดได้ทั้งหมด (0/8)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27317101",
              "locator": "Results and Conclusions of the abstract; Parasit Vectors 2016;9(1):348. Blinded parallel-group study, 32 dogs in 4 groups of 8.",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "None of the dogs treated with the Advantix® spot-on became infected with E. canis, whereas six out of eight untreated control dogs acquired the infection. Furthermore, E. canis infection was diagnosed in four out of eight dogs treated with "
          }
        }
      ]
    }
  },
  "com4--derm-allergic": {
    "com4--derm-allergic--favrot-criteria-diagnosis": {
      "claims": [
        {
          "id": "com4--derm-allergic--favrot-criteria-diagnosis--v1",
          "statement": "Favrot criteria (2010) เสนอเกณฑ์วินิจฉัย canine atopic dermatitis ไว้ 2 ชุด โดยมี sensitivity ประมาณ 80-85% และ specificity ประมาณ 79-85% ซึ่งดีกว่า Willemse และ Prélaud criteria",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20187911",
              "locator": "Vet Dermatol 21(1):23-31, abstract (Results and Conclusions)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "two sets of criteria associated with sensitivity and specificity ranging from 80% to 85% and from 79% to 85%, respectively, are proposed. It is finally demonstrated that these new sets of criteria provide better sensitivity and specificity,"
          }
        },
        {
          "id": "com4--derm-allergic--favrot-criteria-diagnosis--v2",
          "statement": "Intradermal test และการตรวจ serum allergen-specific IgE ใช้เพื่อเลือก allergen สำหรับใส่ใน extract ของ allergen-specific immunotherapy เท่านั้น ไม่ได้ใช้วินิจฉัย atopic dermatitis ซึ่งอาศัย history + clinical examination + การตัด differential diagnosis อื่นออก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30323921",
              "locator": "Clin Transl Allergy 8:41, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In dogs and cats, the diagnosis of atopic dermatitis is based on history, clinical examination and exclusion of other differential diagnoses. Intradermal testing or testing for serum allergen-specific Immunoglobulin E is only used to identi"
          }
        }
      ]
    },
    "com4--derm-allergic--treatment-multimodal": {
      "claims": [
        {
          "id": "com4--derm-allergic--treatment-multimodal--v1",
          "statement": "ตาม ICADA 2015 guidelines ยาที่ลด chronic pruritus และ skin lesion ของ canine AD ได้ผลดีที่สุดคือ topical และ oral glucocorticoid, oral ciclosporin, oral oclacitinib และ injectable recombinant interferon ส่วน allergen-specific immunotherapy (ASIT) กับ proactive intermittent topical glucocorticoid เป็นเพียง 2 มาตรการที่น่าจะป้องกันหรือชะลอการกลับเป็นซ้ำของ flare ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26276051",
              "locator": "BMC Vet Res 11:210, abstract (Results). ไม่ทราบเลขหัวข้อ/ย่อหน้าใน full text จึงไม่ระบุ",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The medications currently most effective in reducing chronic pruritus and skin lesions are topical and oral glucocorticoids, oral ciclosporin, oral oclacitinib, and, where available, injectable recombinant interferons. Allergen-specific imm"
          }
        },
        {
          "id": "com4--derm-allergic--treatment-multimodal--v2",
          "statement": "Oclacitinib ให้ขนาด 0.4-0.6 mg/kg PO q12h นาน 14 วัน แล้วลดเหลือ q24h และมี onset of action เร็วกว่า ciclosporin โดยลด pruritus ได้มากกว่าอย่างมีนัยสำคัญตั้งแต่วันแรกจนถึงวันที่ 28 และเกิด gastrointestinal adverse event น้อยกว่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25496303",
              "locator": "Vet Dermatol 26(1):23-30, e7-8, abstract (Methods, Results and Conclusions)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Enrolled animals were randomized to receive oral oclacitinib (0.4-0.6 mg/kg twice daily for 14 days, then once daily) or oral ciclosporin (3.2-6.6 mg/kg once daily) for 12 weeks... oclacitinib had a faster onset of action and a lower freque"
          }
        }
      ]
    },
    "com4--derm-allergic--fad-food-allergy": {
      "claims": [
        {
          "id": "com4--derm-allergic--fad-food-allergy--v1",
          "statement": "Elimination diet trial ต้องนานอย่างน้อย 8 สัปดาห์ จึงจะวินิจฉัย cutaneous adverse food reaction ได้ครอบคลุมมากกว่า 90% ของสุนัขและแมว โดยที่ 5 สัปดาห์ในสุนัขและ 6 สัปดาห์ในแมวจะมีมากกว่า 80% ที่อาการสงบแล้ว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26310322",
              "locator": "BMC Vet Res 11:225, abstract (Results and Conclusions)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "by 5 weeks in dogs and 6 weeks in cats after starting an elimination diet, more than 80 % of patients had achieved a remission of clinical signs of CAFR. Increasing the diet trial duration to 8 weeks leads to a complete remission in more th"
          }
        },
        {
          "id": "com4--derm-allergic--fad-food-allergy--v2",
          "statement": "Food allergen ที่เป็นสาเหตุของ cutaneous adverse food reaction บ่อยที่สุดในสุนัขคือ beef, dairy products, chicken และ wheat ส่วนในแมวคือ beef, fish และ chicken จึงควรเริ่ม food challenge ด้วย beef และ dairy products",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26753610",
              "locator": "BMC Vet Res 12:9, abstract (Results and Conclusions)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the most likely food allergens contributing to canine CAFRs are beef, dairy products, chicken, and wheat. The most common food allergens in cats are beef, fish and chicken."
          }
        }
      ]
    }
  },
  "com4--derm-autoimmune": {
    "com4--derm-autoimmune--pemphigus-complex": {
      "claims": [
        {
          "id": "com4--derm-autoimmune--pemphigus-complex--v1",
          "statement": "Pemphigus foliaceus (PF) เป็น autoimmune skin disease ที่พบบ่อยที่สุดในสุนัข",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20738839",
              "locator": "Vet Dermatol 22(2):132-142, abstract (ประโยคเปิด)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Pemphigus foliaceus (PF) is the most common canine autoimmune skin disease."
          }
        },
        {
          "id": "com4--derm-autoimmune--pemphigus-complex--v2",
          "statement": "Autoantigen หลักของ canine pemphigus foliaceus คือ desmocollin-1 (DSC1) ไม่ใช่ desmoglein-1 (DSG1) โดยตรวจพบ anti-DSC1 IgG ใน 86% ของ cPF sera ที่ให้ผลบวกด้วย indirect immunofluorescence ขณะที่มีเพียง 6% เท่านั้นที่จับ DSG1 ร่วมด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22884397",
              "locator": "Vet Immunol Immunopathol 149(3-4):197-207, abstract (Results)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Desmoglein-1 (DSG1), the major human PF antigen, represents only a minor autoantigen in canine PF (cPF)... Fifty-seven of 75 IIFpos cPF (86%) and 7/10 of IIFneg cPF sera (70%) contained detectable anti-DSC1 IgG... Five cPF sera (6%) recogni"
          }
        }
      ]
    },
    "com4--derm-autoimmune--bullous-pemphigoid-dle": {
      "claims": [
        {
          "id": "com4--derm-autoimmune--bullous-pemphigoid-dle--v1",
          "statement": "ใน bullous pemphigoid ของสุนัขและคน autoantibody ที่ basement membrane จะจับ type XVII collagen ขนาด 180 kDa (BP180, BPAG2) และ/หรือ plakin epidermal isoform ขนาด 230 kDa คือ BPAG1e (BP230)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10421100",
              "locator": "Vet Pathol 36(4):328-335, abstract (ประโยคเปิด)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In humans and dogs, bullous pemphigoid (BP) is an autoimmune blistering disease associated with the production of basement membrane autoantibodies that target the 180-kd type XVII collagen (BP180, BPAG2) and/or the 230-kd plakin epidermal i"
          }
        },
        {
          "id": "com4--derm-autoimmune--bullous-pemphigoid-dle--v2",
          "statement": "ในกลุ่ม autoimmune subepidermal blistering disease ของสุนัข bullous pemphigoid พบเพียงประมาณ 10% ขณะที่ mucous membrane pemphigoid พบบ่อยที่สุดประมาณ 48% รองลงมาคือ epidermolysis bullosa acquisita ประมาณ 26%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36849885",
              "locator": "BMC Vet Res 19(1):55, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Canine AISBDs are the best characterised, particularly the more common variants such as mucous membrane pemphigoid (48%), epidermolysis bullosa acquisita (EBA) (26%), and bullous pemphigoid (10%)."
          }
        },
        {
          "id": "com4--derm-autoimmune--bullous-pemphigoid-dle--v3",
          "statement": "รอยโรค nasal planum ของ discoid lupus erythematosus ในสุนัข (loss of architecture, depigmentation, erosion หรือ ulceration) มี histopathology เป็น lichenoid และ interface dermatitis แต่ในพื้นที่ที่ leishmaniosis ระบาด canine leishmaniosis ให้ภาพทางคลินิกและ histopathology คล้ายกันมาก จึงต้องตรวจหาเชื้อร่วมด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28133824",
              "locator": "Vet Dermatol 28(2):200-e46, abstract (Results and Conclusions)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Lichenoid and interface dermatitis were observed in both DLE and CanL cases... in areas endemic for leishmaniosis, the presence of the parasite should be investigated in canine nasal planum dermatitis showing clinical and histopathological "
          }
        }
      ]
    },
    "com4--derm-autoimmune--treatment-autoimmune-skin-overall": {
      "claims": [
        {
          "id": "com4--derm-autoimmune--treatment-autoimmune-skin-overall--v1",
          "statement": "แมวทนต่อ azathioprine ได้น้อยกว่าสุนัข ซึ่งสอดคล้องกับระดับ thiopurine methyltransferase (TPMT) ใน red blood cell ที่ต่ำกว่ามาก คือ สุนัข 17.9 ± 3.79 U/mL เทียบกับแมว 2.76 ± 0.70 U/mL",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11012112",
              "locator": "J Vet Intern Med 14(5):499-502, abstract (Results and Conclusions)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "mean RBC values +/- standard deviation of 17.9 +/- 3.79 U/mL in dogs; 2.76 +/- 0.70 U/mL in cats... These findings are consistent with the lower tolerance for azathioprine in cats as compared with dogs."
          }
        }
      ]
    }
  },
  "com4--derm-endocrine": {
    "com4--derm-endocrine--hypothyroidism": {
      "claims": [
        {
          "id": "com4--derm-endocrine--hypothyroidism--v1",
          "statement": "Hypothyroidism เป็น endocrinopathy ที่พบบ่อยที่สุดในสุนัข",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17619004",
              "locator": "37(4):647-69",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Hypothyroidism is the most common endocrinopathy in the dog."
          }
        },
        {
          "id": "com4--derm-endocrine--hypothyroidism--v2",
          "statement": "ในสุนัขที่ได้รับการวินิจฉัยว่าเป็น hypothyroidism พบ dermatological abnormality ประมาณ 80% ของเคส โดยเป็น alopecia 56%, poor coat quality 30% และ hyperpigmentation 20%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10596870",
              "locator": "145(17):481-7",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "dermatological abnormalities (80 per cent), including alopecia (56 per cent), poor coat quality (30 per cent) and hyperpigmentation (20 per cent)"
          }
        },
        {
          "id": "com4--derm-endocrine--hypothyroidism--v3",
          "statement": "การ monitor levothyroxine ใช้ post-pill T4 ที่ 4-6 ชั่วโมงหลังให้ยา เพราะ serum thyroid hormone ขึ้นสูงสุดในช่วงเวลานี้ ทั้งใน regimen วันละครั้งและวันละสองครั้ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1517142",
              "locator": "201(4):623-9",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Thyroid hormone concentrations peaked at 4 to 6 hours after oral administration of L-thyroxine for once-a-day and twice-a-day dosage regimens."
          }
        }
      ]
    },
    "com4--derm-endocrine--hyperadrenocorticism-cushing-s-hac": {
      "claims": [
        {
          "id": "com4--derm-endocrine--hyperadrenocorticism-cushing-s-hac--v1",
          "statement": "Trilostane ในสุนัข HAC ให้แบบ q12h โดย initial dose ที่ต่ำ (0.21-1.1 mg/kg q12h) ก็ได้ผลดี และ mean dose ที่ประเมิน 1 ปีในกลุ่ม PDH ที่ตอบสนองดีอยู่ที่ 1.7 mg/kg q12h",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21627507",
              "locator": "238(11):1441-51",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "47 dogs were treated orally with trilostane (0.21 to 1.1 mg/kg [0.1 to 0.5 mg/lb], q 12 h). ... Mean trilostane dosage at 1-year reevaluation in dogs with a good response was 1.7 mg/kg (0.8 mg/lb), twice daily"
          }
        }
      ]
    },
    "com4--derm-endocrine--sex-hormone-dermatosis": {
      "claims": [
        {
          "id": "com4--derm-endocrine--sex-hormone-dermatosis--v1",
          "statement": "Sertoli cell tumour ใน cryptorchid dog ทำให้เกิด feminizing syndrome ได้ (bilateral alopecia, pendulous preputial sheath, oestrogen ในเลือดสูง) และอาการหายสนิทภายใน 3 เดือนหลัง orchiectomy",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22705745",
              "locator": "13(2):207-9",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Two dogs were admitted for bilateral skin alopecia and weight loss. Both animals were cryptorchid and displayed a pendulous preputial sheath, prostate hypertrophy, and increased levels of circulating oestrogen. ... Complete remission of all"
          }
        }
      ]
    },
    "com4--derm-endocrine--alopecia-x-bsc-black-skin-disease": {
      "claims": [
        {
          "id": "com4--derm-endocrine--alopecia-x-bsc-black-skin-disease--v1",
          "statement": "Alopecia X รักษาด้วย melatonin เริ่มที่ 3-6 mg ทุก 12 ชั่วโมง ในสุนัขที่เป็น euthyroid และ normo-cortisolemic โดยรวมแล้ว 62% มี hair re-growth บางส่วนถึงทั้งหมด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15500479",
              "locator": "15(5):278-84",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Twenty-nine neutered, euthyroid, and normo-cortisolemic dogs were enrolled in the study (23 Pomeranians, three keeshonds, two miniature poodles, and one Siberian husky). ... Melatonin was administered initially at 3-6 mg, every 12 h. ... In"
          }
        }
      ]
    }
  },
  "com4--derm-nutrition": {
    "com4--derm-nutrition--zinc-responsive-dermatosis": {
      "claims": [
        {
          "id": "com4--derm-nutrition--zinc-responsive-dermatosis--v1",
          "statement": "Siberian Husky เป็นสายพันธุ์ที่พบ zinc-responsive dermatosis มากที่สุด และ skin biopsy พบ parakeratosis ในสุนัขทุกตัวในซีรีส์ 41 เคส",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11360336",
              "locator": "12(2):101-9",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The Siberian husky was the predominant breed affected. Periocular crusts were the most common clinical sign and parakeratosis was noted in the skin biopsy specimens of all dogs."
          }
        },
        {
          "id": "com4--derm-nutrition--zinc-responsive-dermatosis--v2",
          "statement": "Periocular crust เป็น clinical sign ที่พบบ่อยที่สุดของ zinc-responsive dermatosis และ starting dose ที่ผู้เขียนแนะนำคือ elemental zinc 2-3 mg/kg/วัน PO",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11360336",
              "locator": "12(2):101-9",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Periocular crusts were the most common clinical sign ... The authors recommend a starting dose of 2-3 mg kg-1 elemental zinc per day in the treatment of this disorder."
          }
        },
        {
          "id": "com4--derm-nutrition--zinc-responsive-dermatosis--v3",
          "statement": "Parakeratotic hyperkeratosis ไม่จำเพาะกับ zinc-responsive dermatosis เพราะยังพบใน primary idiopathic seborrhoea, necrolytic migratory erythema, Malassezia dermatitis และ hereditary nasal hyperkeratosis ดังนั้นจึงต้องแปลผล biopsy ร่วมกับ response to zinc supplementation",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11896970",
              "locator": "13(1):43-7",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Cases examined included dogs with primary idiopathic seborrhoea, necrolytic migratory erythema (NME), Malassezia dermatitis, zinc-responsive dermatosis, hereditary nasal hyperkeratosis of Labrador Retriever dogs, thallotoxicosis and CFP."
          }
        }
      ]
    },
    "com4--derm-nutrition--vitamin-a-efa-deficiency": {
      "claims": [
        {
          "id": "com4--derm-nutrition--vitamin-a-efa-deficiency--v1",
          "statement": "Vitamin A-responsive dermatosis รักษาด้วย vitamin A ขนาด supraphysiologic และมีรายงานในสุนัขพันธุ์ Cocker Spaniel",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9868266",
              "locator": "128(12 Suppl):2783S-2789S",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Supraphysiologic doses of vitamin A have been used in the management of vitamin A-responsive dermatosis in Cocker spaniels; other keratinization defects and seborrheic conditions may respond to retinoid therapy."
          }
        },
        {
          "id": "com4--derm-nutrition--vitamin-a-efa-deficiency--v2",
          "statement": "ในรายงานต้นฉบับของ vitamin A-responsive dermatosis สุนัข 3 ตัวที่ lesion คล้าย seborrhoeic dermatitis และ biopsy เข้าได้กับ phrynoderma หายสนิทและรวดเร็วหลังให้ vitamin A ในขณะที่สุนัขอีก 7 ตัวที่ lesion คล้ายกันแต่ histopathology ไม่เข้ากับ phrynoderma หรือ follicular keratosis ไม่ตอบสนอง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-6221006",
              "locator": "182(7):687-90",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The skin lesions resolved rapidly and completely with vitamin A therapy. Seven other dogs with similar lesions but with histopathologic findings not compatible with phrynoderma or follicular keratosis did not respond to vitamin A therapy."
          }
        }
      ]
    },
    "com4--derm-nutrition--generic-dog-food-disease-protein-malnutrition": {
      "claims": [
        {
          "id": "com4--derm-nutrition--generic-dog-food-disease-protein-malnutrition--v1",
          "statement": "ปัจจุบัน nutritional deficiency ที่ทำให้เกิดโรคผิวหนังพบไม่บ่อยแล้ว เพราะการให้อาหารสำเร็จรูปที่ complete and balanced อย่างแพร่หลาย แต่ deficiency ของ n-6 polyunsaturated fatty acid, zinc และ vitamins ยังเกิดขึ้นได้ในบางกรณี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9868266",
              "locator": "128(12 Suppl):2783S-2789S",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Nutritional deficiencies are now uncommon as a result of the widespread feeding of complete and balanced pet foods. Deficiencies of (n-6) polyunsaturated fatty acids, zinc and vitamins, however, do arise in certain animal- or product-relate"
          }
        }
      ]
    }
  },
  "com4--derm-intro": {
    "com4--derm-intro--skin-anatomy-fundamentals": {
      "claims": [
        {
          "id": "com4--derm-intro--skin-anatomy-fundamentals--v1",
          "statement": "สุนัขมี sweat gland ที่ footpad ซึ่งทำงานจริงขณะวิ่ง และถูกควบคุมแบบ cholinergic เพราะ atropine sulfate บล็อกการหลั่งเหงื่อนี้ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1200160",
              "locator": "229(5):1400-2",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "We found that all of these animals sweat on their paws while running. Blocking this sweating with atropine sulfate dramatically decreased the coefficient of static friction between the paw and the tread of an inclined treadmill."
          }
        },
        {
          "id": "com4--derm-intro--skin-anatomy-fundamentals--v2",
          "statement": "ผิวหนังแมวปกติมี primary hair เส้นหนาตรง ล้อมรอบด้วย secondary hair หลายเส้นเป็นกลุ่มเดียวกัน ตรวจยืนยันด้วย dermoscopy เทียบกับ histology",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25354768",
              "locator": "26(1):14-7",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "With a hand-held dermoscope at 10-fold magnification, thick, straight primary hairs surrounded by multiple secondary hairs were observed. ... Correspondence was observed between dermoscopic and histological results."
          }
        }
      ]
    },
    "com4--derm-intro--hair-cycle-hormone-control": {
      "claims": [
        {
          "id": "com4--derm-intro--hair-cycle-hormone-control--v1",
          "statement": "Thyroid hormone เป็น stimulator ของ anagen โดย T4 ยืดระยะ anagen และเพิ่ม proliferation ของ hair matrix keratinocyte ส่วน T3 และ T4 ลด apoptosis ของเซลล์เหล่านี้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18728176",
              "locator": "93(11):4381-8",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "T4 up-regulates the proliferation of hair matrix keratinocytes, whereas their apoptosis is down-regulated by T3 and T4. T4 also prolongs the duration of the hair growth phase (anagen) in vitro, possibly due to the down-regulation of TGF-bet"
          }
        }
      ]
    },
    "com4--derm-intro--diagnostic-techniques-top-7": {
      "claims": [
        {
          "id": "com4--derm-intro--diagnostic-techniques-top-7--v1",
          "statement": "Wood's lamp เป็น screening test ไม่ใช่ definitive test สำหรับ dermatophytosis โดยในแมวศูนย์พักพิงมี sensitivity 66.8% และ specificity 74.8% เมื่อเทียบกับ DTM culture",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30776947",
              "locator": "21(12):1198-1205",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Wood's lamp examinations had a sensitivity of 66.8% (95% CI 60.2-73.4) and a specificity of 74.8% (95% CI 64.2-85.1) compared with dermatophyte test medium (DTM) culture."
          }
        },
        {
          "id": "com4--derm-intro--diagnostic-techniques-top-7--v2",
          "statement": "DTM culture จากแมวที่ติด M. canis ขึ้น colony ที่มองเห็นได้ก่อน 7 วัน (median 4 วัน) ส่วน fomite carrier ขึ้นก่อน 12 วัน (median 5 วัน) ภายใต้สภาวะ incubation ที่คงที่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30776947",
              "locator": "21(12):1198-1205",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Under consistent incubation conditions, 202/202 diagnostic DTM plates for-infected cats showed recognizable colony growth before 7 days (median 4 days), and 19/19 fomite carrier cat cultures showed growth before 12 days (median 5 days)."
          }
        },
        {
          "id": "com4--derm-intro--diagnostic-techniques-top-7--v3",
          "statement": "สำหรับ dermatophytosis ในสุนัขและแมว ไม่มี diagnostic test ตัวใดตัวหนึ่งที่เป็น gold standard ส่วน Wood's lamp และ direct examination มี positive และ negative predictability ที่ดี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28516493",
              "locator": "Vet Dermatol 2017;28(3):266-e68. I am not certain of the internal section or clause number within the guideline, so I am not supplying one.",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "No one diagnostic test was identified as the gold standard. ... Wood's lamp and direct examinations have good positive and negative predictability, systemic antifungal drugs have a wide margin of safety and physical cleaning is most importa"
          }
        }
      ]
    }
  },
  "com4--imha": {
    "com4--imha--clinical-signs-diagnosis": {
      "claims": [
        {
          "id": "com4--imha--clinical-signs-diagnosis--v1",
          "statement": "การวินิจฉัย IMHA แบบ firm ตาม ACVIM consensus ต้องมี marker ของ immune-mediated destruction เป็นบวกอย่างน้อย 2 อย่าง (saline agglutination test/SAT, direct antiglobulin test/DAT-Coombs, flow cytometry) หรือมี SAT บวกที่ยังคงอยู่หลังล้าง RBC ร่วมกับต้องมี sign of hemolysis อย่างน้อย 1 ข้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30806491",
              "locator": "Figure 2 diagnostic algorithm caption; J Vet Intern Med 2019;33(2):313-334",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "biomarkers of immune-mediated destruction should next be assessed, including the saline agglutination test (SAT), direct antiglobulin test (DAT), and/or flow cytometry (FC); at least 2 should be present, or a positive SAT that persists with"
          }
        },
        {
          "id": "com4--imha--clinical-signs-diagnosis--v2",
          "statement": "Saline agglutination test ที่ทำโดยผสม saline 4 หยดกับเลือด 1 หยด มี reported specificity 100% (95% CI 95-100%) สำหรับ IMHA ในสุนัข ขณะที่การผสมเลือดกับ saline อัตราส่วน 1:1 ได้ specificity ต่ำกว่า คือ 95% (95% CI 88-99%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30806491",
              "locator": "Section 3.2.2 'Positive saline agglutination test'; J Vet Intern Med 2019;33(2):313-334",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Saline agglutination testing performed by mixing 4 drops of saline with 1 drop of blood has a reported specificity of 100% (95% CI, 95%-100%) for IMHA in dogs. Mixing blood and saline 1:1 yielded a specificity of 95% (95% CI, 88%-99%)"
          }
        },
        {
          "id": "com4--imha--clinical-signs-diagnosis--v3",
          "statement": "Spherocytes ใช้เป็น diagnostic criterion ได้เฉพาะในสุนัขเท่านั้น เพราะ RBC ของแมวไม่แสดง central pallor อย่างสม่ำเสมอ และเกณฑ์ ≥5 spherocytes ต่อ ×100 oil immersion field ให้ sensitivity เพียง 63% (95% CI 39-84%) แต่ specificity 95% (95% CI 76-100%) สำหรับ IMHA ในสุนัข",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30806491",
              "locator": "Section 3.2.1 'Prominent spherocytosis'; J Vet Intern Med 2019;33(2):313-334",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Spherocytes should be used as a diagnostic criterion only in dogs because feline erythrocytes do not consistently display central pallor."
          }
        }
      ]
    },
    "com4--imha--treatment": {
      "claims": [
        {
          "id": "com4--imha--treatment--v1",
          "statement": "ACVIM consensus แนะนำเริ่ม prednisolone หรือ prednisone ที่ initial PO dosage 2-3 mg/kg/day หลังวินิจฉัย IMHA ได้แล้ว โดยสุนัขที่หนักเกิน 25 kg ให้คิดขนาดตาม body surface area (50-60 mg/m2/day) แทน mg/kg",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30847984",
              "locator": "Recommendation 7; J Vet Intern Med 2019;33(3):1141-1172",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "We recommend that prednisolone or prednisone at an initial PO dosage of 2-3 mg/kg/day"
          }
        },
        {
          "id": "com4--imha--treatment--v2",
          "statement": "แนะนำ (strong) ให้ thromboprophylaxis ในสุนัข IMHA ทุกตัว ยกเว้นตัวที่มี severe thrombocytopenia (platelet count < 30,000/μL) และถ้าเลือกใช้ antiplatelet drug ให้ใช้ clopidogrel มากกว่า aspirin โดย clopidogrel ขนาด 1.1-4.0 mg/kg PO q24h",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30847984",
              "locator": "Recommendations 38 and 42; J Vet Intern Med 2019;33(3):1141-1172",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "We recommend that thromboprophylaxis be provided for all dogs with IMHA, except those with severe thrombocytopenia (platelet count <30 000/μL)."
          }
        }
      ]
    },
    "com4--imha--itp-immune-mediated-thrombocytopenia": {
      "claims": [
        {
          "id": "com4--imha--itp-immune-mediated-thrombocytopenia--v1",
          "statement": "ในสุนัขที่สงสัย primary ITP การให้ vincristine 0.02 mg/kg IV ครั้งเดียว ร่วมกับ glucocorticoid ขนาด immunosuppressive มีหลักฐานระดับ moderately strong ว่าเร่งให้ platelet count ฟื้นตัวเร็วขึ้นและลดระยะเวลานอนโรงพยาบาล ส่วนในแมวยังไม่แนะนำให้ใช้ vincristine",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38779941",
              "locator": "Guideline on glucocorticoids plus vincristine, and Non-PICO 1 'What dosage of vincristine should be used?'; J Vet Intern Med 2024;38(4):1982-2007",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There is moderately strong evidence that the use of a single IV administration of vincristine at the appropriate dosage of 0.02 mg/kg or a single hIVIg infusion at a minimum dosage of 0.5 g/kg IV over 6-12 hours in dogs with presumed pITP, "
          }
        }
      ]
    }
  },
  "com4--immune-drugs": {
    "com4--immune-drugs--glucocorticoid-prednisolone-first-line": {
      "claims": [
        {
          "id": "com4--immune-drugs--glucocorticoid-prednisolone-first-line--v1",
          "statement": "ถ้า starting dosage ของ prednisone/prednisolone สูงกว่า 2 mg/kg/day ACVIM consensus แนะนำ (strength: strong) ให้ลดลงมาที่ ≤2 mg/kg/day ภายใน 1-2 สัปดาห์แรกของการรักษา ถ้าสุนัขตอบสนอง (PCV/Hct คงที่หรือเพิ่มขึ้น)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30847984",
              "locator": "Recommendation 8; J Vet Intern Med 2019;33(3):1141-1172",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "If the starting dosage of prednisone or prednisolone is >2 mg/kg/day, we recommend that it be decreased to ≤2 mg/kg/day within the first 1-2 weeks of treatment, provided the dog is responding to treatment, as demonstrated by a stable or inc"
          }
        },
        {
          "id": "com4--immune-drugs--glucocorticoid-prednisolone-first-line--v2",
          "statement": "เมื่อเข้าสู่ remission แล้ว การ taper glucocorticoid แนะนำให้ลดขนาดลงประมาณ 25% ทุก 2-4 สัปดาห์ โดยต้องยืนยันว่า platelet count คงที่ทันทีก่อนการลดขนาดแต่ละครั้ง และโดยทั่วไปยังต้องให้ glucocorticoid ต่ออีกหลายเดือน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38779941",
              "locator": "Non-PICO 14 'In dogs and cats with pITP, how should prednisolone or prednisone be tapered if animals are in remission?'; J Vet Intern Med 2024;38(4):1982-2007",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "We suggest decreasing the glucocorticoid dosage by approximately 25% every 2-4 weeks provided platelet count is stable and confirmed immediately before each dosage reduction."
          }
        }
      ]
    },
    "com4--immune-drugs--steroid-sparing-agents-comparison": {
      "claims": [
        {
          "id": "com4--immune-drugs--steroid-sparing-agents-comparison--v1",
          "statement": "การขาด thiopurine methyltransferase (TPMT) ซึ่งเป็น key enzyme ใน metabolism ของ azathioprine ทำให้เกิด azathioprine toxicity ในแมวและในคน ส่วนในสุนัข TPMT expression แปรผัน แต่การขาด TPMT ไม่ได้ดูสัมพันธ์กับ severe toxicity ที่บางครั้งพบในสุนัข",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30847984",
              "locator": "Section on azathioprine adverse effects (preceding Recommendation 20); J Vet Intern Med 2019;33(3):1141-1172",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Deficiencies in a key enzyme involved in azathioprine metabolism, thiopurine methyltransferase (TPMT), can cause azathioprine toxicity in cats and people. Although TPMT expression in dogs is variable, TPMT deficiency does not appear to be a"
          }
        },
        {
          "id": "com4--immune-drugs--steroid-sparing-agents-comparison--v2",
          "statement": "ในแมว ถ้าพิจารณาแล้วว่าจำเป็นต้องใช้ยากดภูมิตัวที่ 2 ร่วมกับ glucocorticoid ACVIM ITP consensus ระบุให้พิจารณา chlorambucil หรือ modified cyclosporine (ไม่ได้ระบุ azathioprine เป็นทางเลือกในแมว)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38779941",
              "locator": "Guideline (cats) on use of a 2nd immunosuppressive drug with glucocorticoids; J Vet Intern Med 2024;38(4):1982-2007",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "If use of a 2nd immunosuppressive drug in combination with glucocorticoids is deemed to be indicated in cats, either chlorambucil or modified cyclosporine can be considered."
          }
        },
        {
          "id": "com4--immune-drugs--steroid-sparing-agents-comparison--v3",
          "statement": "สุนัขที่ได้รับ cyclosporine ควรได้รับการ monitor สำหรับ gastrointestinal adverse effects และ gingival overgrowth (gingival hyperplasia)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30847984",
              "locator": "Recommendation 20; J Vet Intern Med 2019;33(3):1141-1172",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "We recommend that dogs receiving cyclosporine be monitored for gastrointestinal adverse effects and gingival overgrowth."
          }
        }
      ]
    },
    "com4--immune-drugs--approach-drug-selection-logic": {
      "claims": [
        {
          "id": "com4--immune-drugs--approach-drug-selection-logic--v1",
          "statement": "ไม่แนะนำให้ใช้ยากดภูมิพร้อมกันเกิน 2 ตัว เพราะไม่มีหลักฐานว่าการเพิ่มยาตัวที่ 3 ทำให้ผลลัพธ์ดีขึ้น ในขณะที่การกดภูมิเพิ่มขึ้นทำให้เกิด adverse effects ถ้าไม่ตอบสนองควรพิจารณา 'เปลี่ยน' ยาตัวที่ 2 แทนการเพิ่มยาตัวที่ 3",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38779941",
              "locator": "Guideline (dogs) on combining glucocorticoids with a 2nd immunosuppressive drug; J Vet Intern Med 2024;38(4):1982-2007",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There is no evidence that adding a 3rd immunosuppressive drug improves outcomes whereas further immunosuppression can result in adverse effects. Administration of more than 2 immunosuppressive drugs is not recommended, but changing the 2nd "
          }
        }
      ]
    }
  },
  "com4--ibd": {
    "com4--ibd--ibd-definition-classification": {
      "claims": [
        {
          "id": "com4--ibd--ibd-definition-classification--v1",
          "statement": "38-89% ของสุนัขที่เป็น chronic inflammatory enteropathy (CIE) เป็น food-responsive จึงทำให้การปรับอาหารเป็นจุดเริ่มต้นการรักษาเชิงวินิจฉัยที่เหมาะสม และสุนัขจำนวนมากคง clinical remission ระยะยาว (>3 เดือน) ได้ด้วยการจัดการทางอาหารเพียงอย่างเดียว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41742497",
              "locator": "Section on dietary treatment as a test of treatment; J Vet Intern Med 2026;40(1)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Dietary modification as a test of treatment is an adequate therapeutic (ie, diagnostic treatment) starting point because 38–89% of dogs with CIE are food-responsive, and many dogs maintain long-term (>3 months) clinical remission on dietary"
          }
        }
      ]
    },
    "com4--ibd--clinical-signs-diagnosis": {
      "claims": [
        {
          "id": "com4--ibd--clinical-signs-diagnosis--v1",
          "statement": "Dietary treatment trial เป็น first-choice diagnostic recommendation ในสุนัขที่สงสัย CIE โดยทำก่อน invasive diagnostic tests ถ้าสัตว์ยัง clinically stable และไม่ hypo-/anorexic และการตอบสนองต่ออาหารหลังให้แบบ exclusive อย่างน้อย 2 สัปดาห์ จึงยืนยัน food-responsive phenotype ของ CIE",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41742497",
              "locator": "Sections 'Dietary treatment trial' and 'Additional diagnostic treatment trials'; J Vet Intern Med 2026;40(1)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Dietary treatment trials are the preferred first-choice diagnostic recommendation in dogs suspected of having CIE before invasive diagnostic tests ... are performed, provided they are clinically stable and not hypo- or anorexic."
          }
        },
        {
          "id": "com4--ibd--clinical-signs-diagnosis--v2",
          "statement": "จำนวน endoscopic biopsy sample ที่เพียงพอซึ่งแนะนำต่ออวัยวะคือ stomach 6 ชิ้น, duodenum 10-15 ชิ้น, ileum 3-5 ชิ้น และ colon 9-12 ชิ้น และควรประเมิน H&E-stained section ของแต่ละ segment ด้วยเกณฑ์ WSAVA หรือ modified WSAVA เพื่อประเมินความรุนแรงของ inflammatory และ morphologic lesion",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41742497",
              "locator": "Sections on endoscopy and 'Histopathologic evaluation'; J Vet Intern Med 2026;40(1)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The recommended number of adequate endoscopic biopsy samples obtained from each organ includes: stomach (= 6), duodenum (= 10-15), ileum (= 3-5), and colon (= 9-12)."
          }
        },
        {
          "id": "com4--ibd--clinical-signs-diagnosis--v3",
          "statement": "Hypocobalaminemia เป็น negative prognostic factor ใน CIE พบได้ 19-61% ของสุนัขที่เป็น CIE แต่ค่า cobalamin ที่ปกติไม่ได้ตัดโรค CIE ออก และภาวะ hypofolatemia พบได้ 1-47% ของสุนัขที่เป็นโรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41742497",
              "locator": "Section on laboratory evaluation and biomarkers; J Vet Intern Med 2026;40(1)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Hypocobalaminemia is a negative prognostic factor, affecting 19–61% of dogs with CIE, but normocobalaminemia does not exclude CIE. Intracellular cobalamin deficiency can occur with low-normal serum cobalamin concentration."
          }
        }
      ]
    },
    "com4--ibd--treatment-step-wise": {
      "claims": [
        {
          "id": "com4--ibd--treatment-step-wise--v1",
          "statement": "ในสุนัข CIE ที่ล้มเหลวจาก dietary trial ขนาดยาปฏิชีวนะที่รายงานคือ tylosin 25 mg/kg q24h นาน 7 วัน, metronidazole 10-15 mg/kg q12h นาน 21 วัน หรือ rifaximin 25 mg/kg q12h นาน 21 วัน แต่ด้วยหลัก antimicrobial stewardship (สุนัขมัก relapse เร็วหลังหยุดยา และยาปฏิชีวนะเหนี่ยวนำ intestinal dysbiosis ระยะยาว) ยาปฏิชีวนะควรถูกเก็บไว้สำหรับเคสที่ล้มเหลวจากการรักษาอื่นแล้ว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41742497",
              "locator": "Section on antimicrobial treatment of CIE; J Vet Intern Med 2026;40(1)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In dogs with CIE that have failed dietary trials, antibiotics such as tylosin (25 mg/kg q24h for 7 days), metronidazole (10-15 mg/kg q12h for 21 days), or rifaximin (25 mg/kg q12h for 21 days)"
          }
        }
      ]
    },
    "com4--ibd--glomerulonephritis-gn-overview": {
      "claims": [
        {
          "id": "com4--ibd--glomerulonephritis-gn-overview--v1",
          "statement": "Standard therapy ของ glomerular disease ในสุนัข ซึ่งประกอบด้วยการประเมินและจัดการ proteinuria, การยับยั้ง renin-angiotensin-aldosterone system, การปรับอาหาร, การวินิจฉัยและรักษา systemic hypertension และการประเมินและจัดการ body fluid volume status แนะนำให้ใช้ในสุนัขที่เป็นโรคทุกตัวไม่ว่าสาเหตุจะเป็นอะไร",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24635378",
              "locator": "Abstract and scope statement; J Vet Intern Med 2013;27 Suppl 1:S27-43",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Standard therapy forms the basic foundation for care of dogs with glomerular disease, as it is herein recommended for use in all affected animals regardless of causation of the disease."
          }
        }
      ]
    }
  },
  "com4--sle": {
    "com4--sle--definition-diagnostic-criteria": {
      "claims": [
        {
          "id": "com4--sle--definition-diagnostic-criteria--v1",
          "statement": "SLE คือ systemic autoimmune disease ที่มีลักษณะเด่นคือมี antinuclear antibody ร่วมกับ multisystemic immune-mediated inflammation อย่างไรก็ตามในสุนัขยังไม่มีระบบเกณฑ์วินิจฉัย SLE ที่ได้รับการยอมรับเป็นสากล การศึกษาที่ผ่านมาจึงมักนำเกณฑ์ที่ใช้ในคนมาปรับใช้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37737539",
              "locator": "Introduction and Discussion; J Vet Intern Med 2023;37(6):2482-2487",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Although no universally recognized system for SLE diagnosis has been established in dogs, previous studies have routinely applied criteria used in humans."
          }
        },
        {
          "id": "com4--sle--definition-diagnostic-criteria--v2",
          "statement": "การศึกษาที่รวมเกณฑ์วินิจฉัย canine SLE ที่ตีพิมพ์ไว้ 4 ระบบเข้าด้วยกัน (SLE 31 ตัว, control 122 ตัว) พบว่า SLE สัมพันธ์กับ polyarthritis, hematologic abnormalities, renal damage, dermatologic disorders และผล antinuclear antibody test เป็นบวก โดยสมการสุดท้ายจำแนกสุนัขป่วยได้ถูกต้อง 93.5% และ control ได้ถูกต้อง 98.4%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-4073644",
              "locator": "Am J Vet Res 1985;46(11):2340-2345",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The log-linear method showed an association between SLE and polyarthritis, hematologic abnormalities, renal damage, dermatologic disorders, and antinuclear antibody test response (positive)."
          }
        }
      ]
    },
    "com4--sle--clinical-signs-by-organ": {
      "claims": [
        {
          "id": "com4--sle--clinical-signs-by-organ--v1",
          "statement": "Immune-mediated polyarthritis ในสุนัขส่วนใหญ่เป็นชนิด non-erosive โดยจากสุนัข IMPA 79 ตัว มีเพียง 13 ตัว (16%) ที่เป็น erosive IMPA และสุนัข erosive ทั้ง 13 ตัวมี erosive lesion ที่ข้อ carpus",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27823373",
              "locator": "Results and Conclusions; J Am Vet Med Assoc 2016;249(10):1156-1164",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "13 of 79 (16%) dogs had erosive IMPA. ... All 13 dogs had erosive lesions in their carpal joints."
          }
        }
      ]
    },
    "com4--sle--laboratory-diagnosis": {
      "claims": [
        {
          "id": "com4--sle--laboratory-diagnosis--v1",
          "statement": "ห้องปฏิบัติการที่รายงานถือ serum ANA titer < 160 เป็น seronegative และแนะนำให้จำกัดการส่งตรวจ ANA เฉพาะสุนัขที่มี major sign ที่เข้าได้กับ SLE อย่างน้อย 1 ข้อ เพราะการตรวจ ANA ในสุนัขที่ไม่มี major clinical หรือ clinicopathologic abnormality ไม่เป็นการตรวจที่มีประโยชน์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17501657",
              "locator": "Results and Conclusions; J Am Vet Med Assoc 2007;230(8):1180-1183",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Results suggested that measurement of ANA titer was not a useful diagnostic test in dogs without any major clinical or clinicopathologic abnormalities suggestive of SLE. ... Findings suggest that it would be reasonable to limit the use of t"
          }
        },
        {
          "id": "com4--sle--laboratory-diagnosis--v2",
          "statement": "ผล ANA เป็นบวกได้ในสุนัขที่ seroreactive ต่อเชื้อ vector-borne โดยพบ ANA ร่วมด้วยใน 75% ของสุนัขที่ seroreactive ต่อ Bartonella vinsonii subsp. berkhoffii และ 16.7% ของสุนัขที่ seroreactive ต่อ Ehrlichia canis (แต่ 0% ของสุนัขที่ seroreactive ต่อ Rickettsia rickettsii) ดังนั้น ANA จึงไม่จำเพาะต่อ SLE",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14765731",
              "locator": "Results and Conclusions; J Vet Intern Med 2004;18(1):47-51",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "When analyzed on the basis of reactivity to a specific infectious agent, 75% of the B vinsonii (berkhoffii) seroreactors, 16.7% of the E canis seroreactors, and 0% of the R rickettsii seroreactors had concurrent ANAs."
          }
        },
        {
          "id": "com4--sle--laboratory-diagnosis--v3",
          "statement": "LE cell test มีความจำเพาะ (specific) แต่ไม่ไว (not sensitive) เมื่อใช้ยืนยันการวินิจฉัย canine SLE ส่วน ANA test จะช่วยสนับสนุนการวินิจฉัย SLE ได้ก็ต่อเมื่อพิจารณาทั้ง antibody titer และ staining pattern ร่วมกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7224294",
              "locator": "Am J Vet Res 1980;41(10):1662-1666",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The antinuclear antibody test was useful in supporting the diagnosis of systemic lupus erythematosus (SLE) only when both antibody titer and the staining pattern were taken into consideration. The lupus erythematosus cell test was specific "
          }
        }
      ]
    }
  },
  "com4--peds-geri": {
    "com4--peds-geri--pediatric-neonatal-4hs": {
      "claims": [
        {
          "id": "com4--peds-geri--pediatric-neonatal-4hs--v1",
          "statement": "ในลูกสุนัข intestinal barrier closure (gut closure) เริ่มตั้งแต่ 4-8 ชั่วโมงหลังคลอด และสมบูรณ์ที่ 16-24 ชั่วโมง โดยลูกสุนัขที่ได้ colostrum ตอนอายุ 0-4 ชม. มี serum IgG ที่ 48 ชม. สูงกว่ากลุ่มที่ได้ตอน 8-12 ชม. และ 16-24 ชม. อย่างมีนัยสำคัญ (1.68 vs 0.79 vs 0.35 g/L, p < 0.001)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23279496",
              "locator": "Reprod Domest Anim 2012;47 Suppl 6:190-3, abstract (IgG absorption by time of colostrum administration)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In the canine species, gut closure seems thus to begin as early as 4-8 h after birth and to be complete at 16-24 h. Consequently, this phenomenon appears to occur earlier in puppies than in most other species."
          }
        }
      ]
    },
    "com4--peds-geri--nei-neonatal-erythrolysis-isoerythrolysis": {
      "claims": [
        {
          "id": "com4--peds-geri--nei-neonatal-erythrolysis-isoerythrolysis--v1",
          "statement": "NEI ในแมวเกิดเมื่อลูกแมว blood type A หรือ AB ได้รับ anti-A alloantibodies ผ่าน colostrum จากแม่แมว type B การป้องกันคือแยกลูกแมวกลุ่มเสี่ยงออกจากแม่แมว type B ในวันแรกของชีวิต แล้วให้ colostrum หรือนมจากแม่แมว type A แทนได้อย่างปลอดภัย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9404300",
              "locator": "J Reprod Fertil Suppl 1997;51:313-6, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Kittens at risk of neonatal isoerythrolysis must be removed from their type B queen during the first day of life and may safely receive milk or colostrum from a type A queen."
          }
        },
        {
          "id": "com4--peds-geri--nei-neonatal-erythrolysis-isoerythrolysis--v2",
          "statement": "ข้อมูลความชุก blood type ในกรุงเทพฯ และปริมณฑล แมว 97.5% เป็น type A, 2.5% เป็น type B, ไม่พบ type AB โดยแมว domestic shorthair (DSH) ทุกตัวเป็น type A ทำให้ความเสี่ยง NEI จากการผสมแบบสุ่มใน DSH ประเมินได้เท่ากับ 0% ส่วน type B พบใน Persian 17.1% และ Scottish Fold 4%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34031915",
              "locator": "Vet Clin Pathol 2021;50(2):198-202, abstract (n = 229 DSH, 91 purebred, 39 districts Bangkok + 4 provinces)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "All DSH cats were type A. Type B blood was found in 17.1% of Persian and 4% of Scottish Fold cats. Due to the blood type frequencies in DSH cats, the potential risk of major transfusion reactions, minor transfusion reactions, or NI was 0%."
          }
        }
      ]
    },
    "com4--peds-geri--fading-puppy-kitten-syndrome": {
      "claims": [
        {
          "id": "com4--peds-geri--fading-puppy-kitten-syndrome--v1",
          "statement": "น้ำหนักแรกเกิดต่ำเป็น risk factor สำคัญของ neonatal mortality ในลูกสุนัข จากลูกสุนัข 4,971 ตัว 10 สายพันธุ์ อัตราตายในช่วง 3 สัปดาห์แรกเท่ากับ 4.2% ในกลุ่มน้ำหนักปกติ, 8.8% ในกลุ่ม low birth weight (LBW) และ 55.3% ในกลุ่ม very low birth weight (VLBW)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32972422",
              "locator": "BMC Vet Res 2020;16(1):354, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Mortality rates were 4.2, 8.8 and 55.3%, in the normal, LBW and VLBW groups, accounting for 48.7, 47.9 and 3.4% of the included puppies, respectively."
          }
        }
      ]
    },
    "com4--peds-geri--geriatric-physiologic-changes": {
      "claims": [
        {
          "id": "com4--peds-geri--geriatric-physiologic-changes--v1",
          "statement": "ความชุกของ CKD ในแมวสูงกว่าที่มักอ้างกัน ในแมวที่สุ่มมาจาก 4 ช่วงอายุ (6 เดือน ถึง 20 ปี) พบ CKD 50% และในแมวที่คัดเข้าการศึกษา degenerative joint disease พบ 68.8% โดย CKD พบได้บ่อยตั้งแต่อายุ 1 ถึง 15 ปี ไม่ใช่เฉพาะแมวสูงวัย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24217707",
              "locator": "J Feline Med Surg 2014;16(6):465-72, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The prevalence of CKD in the RS and DJD groups was higher than expected at 50% and 68.8%, respectively. CKD was common in cats between 1 and 15 years of age, with a similar prevalence of CKD stages 1 and 2 across age groups in both the RS a"
          }
        },
        {
          "id": "com4--peds-geri--geriatric-physiologic-changes--v2",
          "statement": "SDMA เพิ่มขึ้นก่อน serum creatinine ในแมวที่เป็น CKD จากแมว CKD 21 ตัว SDMA สูงเกินค่าอ้างอิงก่อน creatinine ใน 17/21 ตัว เฉลี่ย 17.0 เดือน (ช่วง 1.5-48 เดือน) โดย SDMA มี sensitivity 100% เทียบกับ creatinine 17% แต่ specificity ต่ำกว่า (91% เทียบกับ 100%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25231385",
              "locator": "J Vet Intern Med 2014;28(6):1676-83, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Symmetric dimethylarginine became increased before sCr in 17/21 cats (mean, 17.0 months; range, 1.5-48 months). Serum SDMA had higher sensitivity (100%) compared with sCr (17%), but lower specificity (91% versus 100%) and positive predictiv"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-gi": {
    "equine-medicine--equine-gi--exam-techniques-9-tools": {
      "claims": [
        {
          "id": "equine-medicine--equine-gi--exam-techniques-9-tools--v1",
          "statement": "เกณฑ์ nasogastric reflux > 2 L ที่ใช้บอกว่า reflux มีนัยสำคัญ มาจาก case definition ของ postoperative ileus (POI) ซึ่งกำหนดว่าม้ามี gastric reflux > 2 L ร่วมกับ pulse rate ≥ 60 ครั้ง/นาที หรือมีอาการปวดท้อง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7744649",
              "locator": "volume 205, issue 12, pages 1748-1752",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Horses with a pulse rate of > or = 60 beats/min or signs of abdominal pain, which were also accompanied by a volume of > 2 L of material that refluxed from the stomach during the postoperative period (excluding horses with anterior enteriti"
          }
        },
        {
          "id": "equine-medicine--equine-gi--exam-techniques-9-tools--v2",
          "statement": "peritoneal fluid ปกติของม้าใส ไม่มีกลิ่น สีเหลืองอ่อน; การเปลี่ยนสีจาก golden ไป orange ไป red สะท้อนปริมาณ RBC ที่เพิ่มขึ้น และพบบ่อยใน strangulating intestinal lesions โดยการประเมิน peritoneal fluid ครบชุดประกอบด้วย gross appearance, nucleated cell count, total protein, RBC count, lactate, cytology และ culture",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35044063",
              "locator": "volume 32, supplement S1, pages 81-96",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The transformation of peritoneal fluid color from golden to orange to red represents increasing levels of RBCs, common with strangulating intestinal lesions."
          }
        },
        {
          "id": "equine-medicine--equine-gi--exam-techniques-9-tools--v3",
          "statement": "peritoneal fluid L-lactate ต่อ total solids ratio ที่ 3.6 แยก large colon strangulating obstruction ออกจาก non-strangulating ได้ดี (AUC 0.84, sensitivity 78%, specificity 81%) แต่ sensitivity ระดับนี้ยังต้องแปลผลร่วมกับอาการทางคลินิกและการตอบสนองต่อการรักษาเริ่มต้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40448701",
              "locator": "volume 39, issue 4, article e70121",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "PFTS ratio of 3.6 had good ability to discriminate between LCSO and LCNSO (AUC, 0.84; 95% CI, 0.78-0.90) with sensitivity and specificity of 78% and 81% to predict LCSO, respectively."
          }
        },
        {
          "id": "equine-medicine--equine-gi--exam-techniques-9-tools--v4",
          "statement": "ในม้า acute colic ค่า blood lactate > 4 mmol/L บ่งชี้ prognosis ที่ guarded และ haematocrit > 0.5 L/L บ่งชี้ severe dehydration ขณะที่ haematocrit < 0.45 L/L บ่งชี้ภาวะขาดน้ำเล็กน้อยถึงไม่มี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23608894",
              "locator": "volume 41, issue 2, pages 124-134",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Additionally, the blood lactate concentration rises with increasing intestinal compromise with a concentration of > 4 mmol/l indicating a guarded prognosis. However, it is crucial to assess laboratory values only in the context of the clini"
          }
        }
      ]
    },
    "equine-medicine--equine-gi--lecture-3-management-of-equine-gi-disorders": {
      "claims": [
        {
          "id": "equine-medicine--equine-gi--lecture-3-management-of-equine-gi-disorders--v1",
          "statement": "strangulating lesions มี mortality สูงกว่า non-strangulating อย่างชัดเจน (30/50 คือ 60% เทียบกับ 15/85 คือ 18%) และรอยโรคที่ small intestine พยากรณ์แย่กว่า large intestine (17/27 คือ 63% เทียบกับ 28/108 คือ 26%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19642409",
              "locator": "volume 41, issue 5, pages 482-486",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The overall mortality rate was 51/208 (25%); 5/72 (7%) in medically treated cases, 46/136 (34%) in surgical cases, 30/50 (60%) in strangulating lesions and 15/85 (18%) in nonstrangulating lesions, 17/27 (63%) in cases involving small intest"
          }
        }
      ]
    },
    "equine-medicine--equine-gi--esophagus-choke": {
      "claims": [
        {
          "id": "equine-medicine--equine-gi--esophagus-choke--v1",
          "statement": "esophageal stricture ที่ตามมาจาก esophageal obstruction แก้ไขได้ด้วย endoscopic balloon dilatation ในม้ายืน sedate; ในรายงาน 9 ตัว ม้าที่ไม่รอดทุกตัวอายุน้อยกว่า 1 ปี และมีภาวะแทรกซ้อนเช่น megaesophagus, obstruction ที่แก้ไม่หาย หรือ severe aspiration pneumonia",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26118925",
              "locator": "volume 29, issue 4, pages 1105-1111",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Five horses survived (survival at writing ranged from 2 to 11 years after discharge) and all nonsurvivors were <1 year of age and presented with concurrent problems or developed complications including megaesophagus, unresolved esophageal o"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-colic-bestfit": {
    "equine-medicine--equine-colic-bestfit--approach-classification-decision-tree": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-bestfit--approach-classification-decision-tree--v1",
          "statement": "ม้าที่มี intestinal ischaemia จาก strangulating obstruction มี peritoneal lactate สูงกว่ากลุ่ม non-strangulating obstruction ชัดเจน (8.45 mmol/L เทียบกับ 2.09 mmol/L) และ peritoneal fluid lactate ทำนาย strangulation ได้ดีกว่า blood lactate",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16028624",
              "locator": "volume 37, issue 4, pages 342-346",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Horses with ISSO had a higher peritoneal lactate value (8.45 mmol/l) than those with nonstrangulating obstruction (2.09 mmo/l). ... Peritoneal fluid lactate is a better predictor of ISSO than blood lactate and may aid in early detection of "
          }
        },
        {
          "id": "equine-medicine--equine-colic-bestfit--approach-classification-decision-tree--v2",
          "statement": "peritoneal lactate cut-off ที่ 3.75 mmol/L ให้ sensitivity 81% และ specificity 92% ในการทำนาย strangulating lesion (PPV 85%, NPV 90%) จึงเป็นตัวชี้วัดที่จำเพาะสูงแต่ sensitivity ไม่พอจะใช้คัดออก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30588637",
              "locator": "volume 48, issue 2, pages 152-158",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A peritoneal lactate cutoff level of 3.75 mmol/L yielded a sensitivity of 81% and a specificity of 92% (PPV = 85% and NPV = 90%, respectively) for predicting a strangulating lesion."
          }
        },
        {
          "id": "equine-medicine--equine-colic-bestfit--approach-classification-decision-tree--v3",
          "statement": "serosanguineous peritoneal fluid เป็นตัวแปรแรกรับที่สัมพันธ์กับ strangulating obstruction แรงที่สุด (OR 35.34, 95% CI 10.10-122.94) และการใช้หลายตัวแปรร่วมกันทำนายได้ดีกว่าการใช้ค่า lactate เดี่ยว ๆ (AUC ROC 0.91)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37539736",
              "locator": "volume 56, issue 3, pages 437-448",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The final multivariable model for predicting SO included marked abdominal pain (OR 5.31, CI 1.40-20.18), rectal temperature (OR 0.30, CI 0.14-0.64), serosanguineous peritoneal fluid (OR 35.34, CI 10.10-122.94), peritoneal-blood l-lactate (O"
          }
        },
        {
          "id": "equine-medicine--equine-colic-bestfit--approach-classification-decision-tree--v4",
          "statement": "heart rate ที่ ≥ 60 ครั้ง/นาที สัมพันธ์กับการไม่รอดชีวิตหลัง small intestinal resection (OR 5.6, 95% CI 1.5-20.6) ร่วมกับ postoperative ileus และการต้อง repeat celiotomy",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12358046",
              "locator": "volume 34, issue 5, pages 450-454",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Multiple logistic analysis indicated that postoperative ileus (OR = 29.7; 95% CI 2.5-354.6), repeat celiotomy (OR = 18; CI 1.7-187.6), and an elevated heart rate of > or = 60 beats/min (OR = 5.6; CI 1.5-20.6) were the principal factors asso"
          }
        },
        {
          "id": "equine-medicine--equine-colic-bestfit--approach-classification-decision-tree--v5",
          "statement": "อัตรารอดถึงออกจากโรงพยาบาลของม้า colic ที่รักษาทางยาอยู่ที่ 91% สูงกว่ากลุ่มผ่าตัดที่ 77% (รวมทุกกลุ่ม 88%) โดยรอยโรคที่ small intestine พยากรณ์แย่กว่า large intestine และม้ากลุ่มรักษาทางยาที่มี heart rate แรกรับสูงมีอัตรารอดต่ำกว่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40392043",
              "locator": "volume 96, issue 1, pages 23-32",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Of 415 cases, 375 were treated (292 medically, 83 surgically). 91% of medically, 77% of surgically treated, and 88% overall survived. ... Survival was associated with treatment type and surgical lesion site (lower for small intestinal than "
          }
        }
      ]
    }
  },
  "equine-medicine--equine-colic-surgery": {
    "equine-medicine--equine-colic-surgery--techniques-step-by-step": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-surgery--techniques-step-by-step--v1",
          "statement": "ในม้าที่ผ่าตัด small intestinal strangulating lesion การทำ resection-anastomosis และ jejunocecostomy สัมพันธ์กับการต้อง repeat celiotomy และการไม่รอดถึงออกจากโรงพยาบาล ขณะที่ผลต่างระหว่าง lactate ในช่องท้องกับ lactate เลือดส่วนปลาย และ intraoperative tachycardia สัมพันธ์กับการไม่รอด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28152199",
              "locator": "volume 46, issue 3, pages 345-353",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The difference between abdominal and peripheral lactate concentrations and intraoperative tachycardia were associated with not surviving to anesthetic recovery or hospital discharge. ... Performing resection-anastomosis and jejunocecostomy "
          }
        }
      ]
    },
    "equine-medicine--equine-colic-surgery--specific-surgical-cases-slides-4": {
      "claims": [
        {
          "id": "equine-medicine--equine-colic-surgery--specific-surgical-cases-slides-4--v1",
          "statement": "postoperative ileus (POI) เกิดใน 31 จาก 148 ตัว คือ 21% ของม้าที่ผ่าตัด colic และแม้อัตราตายรวมจะต่ำ (10/148 คือ 7%) แต่ 4 ใน 10 คือ 40% ของการตายระยะสั้นหลังผ่าตัดมีสาเหตุจาก POI",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7744649",
              "locator": "volume 205, issue 12, pages 1748-1752",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Of 148 horses, 117 were assigned to the reference population, and 31 (21%) developed POI. ... Of 148 horses, only 10 (7%) died; however, 4 of the 10 (40%) deaths in the short-term postoperative period were attributable to POI."
          }
        },
        {
          "id": "equine-medicine--equine-colic-surgery--specific-surgical-cases-slides-4--v2",
          "statement": "ปัจจัยเสี่ยงของ postoperative ileus หลังผ่าตัด small intestine ได้แก่ heart rate ที่สูงขึ้น (OR 1.05 ต่อการเพิ่ม 1 ครั้ง/นาที), reflux แรกรับมากกว่า 8 L (OR 3.02) และการทำ small intestinal resection (OR 2.46); ในการศึกษานี้การให้ lidocaine ป้องกันสัมพันธ์กับ POI ที่ลดลง (OR 0.25)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19422470",
              "locator": "volume 23, issue 3, pages 606-611",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Significant associations of high heart rate (odds ratio [OR] = 1.05, 95% confidence interval [CI] 1.03-1.08), the presence of more than 8 L of reflux at admission (OR = 3.02, 95% CI 1.13-8.02) and the performance of a small intestinal resec"
          }
        },
        {
          "id": "equine-medicine--equine-colic-surgery--specific-surgical-cases-slides-4--v3",
          "statement": "postoperative ileus เป็นปัจจัยที่สัมพันธ์กับการไม่รอดชีวิตแรงที่สุดหลัง small intestinal resection (OR 29.7, 95% CI 2.5-354.6) รองลงมาคือการต้อง repeat celiotomy (OR 18)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12358046",
              "locator": "volume 34, issue 5, pages 450-454",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Multiple logistic analysis indicated that postoperative ileus (OR = 29.7; 95% CI 2.5-354.6), repeat celiotomy (OR = 18; CI 1.7-187.6), and an elevated heart rate of > or = 60 beats/min (OR = 5.6; CI 1.5-20.6) were the principal factors asso"
          }
        },
        {
          "id": "equine-medicine--equine-colic-surgery--specific-surgical-cases-slides-4--v4",
          "statement": "ม้าที่ออกจากโรงพยาบาลได้หลังผ่าตัด colic มีอัตรารอดเกิน 12 เดือน 84%; ภาวะแทรกซ้อนที่พบบ่อยที่สุดหลังออกจากโรงพยาบาลคือ colic ซ้ำ (35.1% ของม้าที่ผ่า laparotomy ครั้งเดียว) และเกิด ventral hernia 8%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16028618",
              "locator": "volume 37, issue 4, pages 310-314",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The long-term (>12 months) survival rate for 204 horses discharged after colic surgery and for which follow-up information was available was 84%. The most common complication after discharge was colic, affecting 35.1% of horses following a "
          }
        },
        {
          "id": "equine-medicine--equine-colic-surgery--specific-surgical-cases-slides-4--v5",
          "statement": "epiploic foramen entrapment พบ 5% ของม้าที่ผ่า celiotomy เพราะ colic; ค่า peritoneal protein ก่อนผ่าตัดสูงกว่าในกลุ่มที่ไม่รอด (39.4 ± 5.10 เทียบกับ 26.6 ± 14.0, P < 0.05) และ post operative adynamic ileus เป็นภาวะแทรกซ้อนหลังผ่าตัดที่พบบ่อยที่สุด (7/44 คือ 16%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8654353",
              "locator": "volume 27, issue 5, pages 373-380",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Preoperative peritoneal protein level was a good prognostic indicator as it was significantly greater in the nonsurvivor (39.4 +/- 5.10) group than in the survivor group (26.6 +/- 14.0) (P<0.05). ... Seven horses (16%) showed post operative"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-lameness": {
    "equine-medicine--equine-lameness--approach-nerve-blocks-detail": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--approach-nerve-blocks-detail--v1",
          "statement": "การให้เกรดด้วย AAEP lameness scale มี inter-clinician agreement ต่ำเมื่อ lameness ระดับน้อย: เมื่อ mean AAEP lameness score ≤ 1.5 clinicians เห็นตรงกันว่าขานั้น lame หรือไม่เพียง 61.9% (kappa = 0.23) แต่เมื่อ mean score > 1.5 เห็นตรงกันถึง 93.1% (kappa = 0.86)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20156242",
              "locator": "Equine Vet J 42(2):92-97",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "When the mean AAEP lameness score was >1.5 clinicians agreed whether or not a limb was lame 93.1% of the time (kappa= 0.86), but when the mean score was < or = 1.5 they agreed 61.9% (kappa= 0.23) of the time."
          }
        },
        {
          "id": "equine-medicine--equine-lameness--approach-nerve-blocks-detail--v2",
          "statement": "ใน low 4-point nerve block, contrast medium ที่ฉีดรอบ palmar nerve แพร่ขึ้นบน (proximal) ตามเวลาแต่ไม่เคยเลย mid-metacarpal region ไปได้ ดังนั้น lameness ที่ดีขึ้นหลัง low 4-point จึงไม่น่าเกิดจาก pain ที่ proximal metacarpal region และต้องระวังว่าเข็มอาจทะลุเข้า digital flexor tendon sheath (DFTS) โดยไม่ตั้งใจ (พบ 6/20 = 30% ของ cadaver limbs)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20716191",
              "locator": "Equine Vet J 42(6):512-518",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Proximal diffusion of local anaesthetic solution after a low 4-point nerve block is unlikely to be responsible for decreasing lameness caused by pain in the proximal Mc region. The DFTS may be penetrated inadvertently when performing a low "
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--4-routes-ของ-diagnostic-analgesia": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--4-routes-ของ-diagnostic-analgesia--v1",
          "statement": "Intra-articular analgesia ของ distal interphalangeal (DIP) joint และ intra-bursal analgesia ของ navicular bursa ต่างก็ทำให้ sole บางส่วนชาได้ ดังนั้นเมื่อ lameness ดีขึ้นหลัง block 2 ทางนี้ ห้ามตัด pain ที่ toe region ของ sole ออกจาก differential diagnosis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12489872",
              "locator": "J Vet Med A Physiol Pathol Clin Med 49(9):478-481",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Analgesia of the DIP joint as well as the NB appeared to be able to desensitize a portion of the sole. It was concluded that pain arising from the toe region of the sole should not be excluded as a cause of lameness when lameness is attenua"
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--diagnostic-analgesia-basic-considerations": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--diagnostic-analgesia-basic-considerations--v1",
          "statement": "Perineural analgesia ของ palmar digital nerves ไม่ไวพอที่จะใช้ตัด foot pain ออก: ในม้า 46 ตัวที่ MRI ยืนยันว่ามี deep digital flexor tendon (DDFT) lesion ใน digit, palmar digital analgesia ทำให้ lameness หายเพียง 11 ตัว (24%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14649360",
              "locator": "Equine Vet J 35(7):681-690",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Lameness was abolished by palmar digital analgesia in only 11 of 46 horses (24%). ... Lameness is not reliably improved by palmar digital analgesia, but may be improved by intra-articular analgesia of the DIP joint in at least 68% of horses"
          }
        }
      ]
    },
    "equine-medicine--equine-lameness--baseline-establishment-visual-palpation": {
      "claims": [
        {
          "id": "equine-medicine--equine-lameness--baseline-establishment-visual-palpation--v1",
          "statement": "การประเมินด้วยตาเพียงอย่างเดียวมีขีดจำกัดแม้ทำโดยผู้มีประสบการณ์: ในโมเดล induced sole-pressure lameness (ม้า 15 ตัว) inertial sensor system ระบุขาที่ถูกต้องได้ก่อน consensus ของสัตวแพทย์ม้า 3 คนใน 35/60 trials (58.33%) ขณะที่สัตวแพทย์ระบุได้ก่อนเพียง 5/60 trials (8.33%) และเท่ากันใน 20/60 trials (33.33%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22563674",
              "locator": "Equine Vet J 44(6):652-656",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The inertial sensor system selected the correct limb before the 3 veterinarians in 35 trials (58.33%), the evaluators selected the correct limb before the inertial sensors in 5 trials (8.33%), and in 20 trials (33.33%) they selected the cor"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-hoof": {
    "equine-medicine--equine-hoof--pathologic-conditions": {
      "claims": [
        {
          "id": "equine-medicine--equine-hoof--pathologic-conditions--v1",
          "statement": "Laminitis ถูกให้เกรดความรุนแรงด้วย Obel system ซึ่งพัฒนาขึ้นในปี 1948 จากเคสที่สัมพันธ์กับ sepsis; ปัจจุบัน endocrinopathic laminitis เป็นรูปแบบที่พบบ่อยที่สุดและอาการอาจไม่ชัดหรือคาบเกี่ยวระหว่าง 2 Obel grades จึงมีการเสนอ modified Obel method ที่ให้คะแนนแยกตามอาการแบบ scale 0-12",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31211020",
              "locator": "PeerJ 7:e7084",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Laminitis is a common equine disease characterized by foot pain, and is commonly diagnosed using a five-grade Obel system developed in 1948 using sepsis-related cases. However, endocrinopathic laminitis is now the most common form of the di"
          }
        },
        {
          "id": "equine-medicine--equine-hoof--pathologic-conditions--v2",
          "statement": "Laminitis ถูกเหนี่ยวนำได้ด้วย prolonged hyperinsulinaemia ขณะ glucose ปกติ (euglycaemic hyperinsulinaemic clamp): ponies กลุ่มที่ได้ insulin ทั้ง 5 ตัวเกิด clinical และ histological laminitis ระดับ Obel grade 2 ในเท้าทั้ง 4 ข้างภายใน 72 ชั่วโมง (เฉลี่ย 55.4 ± 5.5 ชั่วโมง) ขณะที่ control 4 ตัวไม่มีตัวใดเป็นเลย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17719811",
              "locator": "Vet J 174(3):530-535",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "All ponies in the treatment group developed clinical and histological laminitis (Obel grade 2) in all four feet within 72 h (55.4+/-5.5h), whereas none of the control ponies developed laminitis. ... The data show that laminitis can be induc"
          }
        },
        {
          "id": "equine-medicine--equine-hoof--pathologic-conditions--v3",
          "statement": "ในม้า 75 ตัวที่เจ็บ digit แต่ตรวจ radiograph และ ultrasound แล้วไม่พบความผิดปกติชัดเจน, MRI พบ DDFT lesion เป็นสาเหตุหลักของ lameness 46 ตัว (61%) แยกเป็น primary DDFT injury 32 ตัว (43%) และ DDF tendonitis ร่วมกับ navicular bone pathology 14 ตัว (19%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14649360",
              "locator": "Equine Vet J 35(7):681-690",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Forty-six (61%) of 75 horses examined using MRI had lesions of the DDFT considered to be a major contributor to lameness. Thirty-two horses (43%) had primary DDFT injuries and 14 (19%) a combination of DDF tendonitis and navicular bone path"
          }
        },
        {
          "id": "equine-medicine--equine-hoof--pathologic-conditions--v4",
          "statement": "Nuclear scintigraphy ในม้าที่เจ็บเท้าหน้า 264 ตัวมี high specificity แต่ low sensitivity ในการตรวจจับ MRI lesions ของ navicular bone, DDFT และ collateral ligaments ของ DIP joint ดังนั้นผล scintigraphy ที่เป็นลบไม่ตัด injury ที่มีนัยสำคัญออก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17722728",
              "locator": "Equine Vet J 39(4):350-355",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There was high specificity, but low sensitivity of scintigraphy for detection of MR lesions of the navicular bone, the DDFT and the CLs of the DIP joint. ... However, a negative scintigraphic result does not preclude significant injuries."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-tendon": {
    "equine-medicine--equine-tendon--incidence": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--incidence--v1",
          "statement": "จากประชากรม้า Thoroughbred flat racehorse ของ Japan Racing Association 10,262 ตัวในปี 1999, prevalence ของ forelimb SDF tendonitis เท่ากับ 11.1% (1,130 เคส) และ forelimb suspensory ligament desmitis เท่ากับ 3.61% (370 เคส) โดยนับรวมทั้งการบาดเจ็บช่วง training และช่วงแข่ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15163043",
              "locator": "Equine Vet J 36(4):346-350",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The prevalence of forelimb SDFT tendonitis and SL desmitis was 11.1% (1130 cases) and 3.61% (370 cases) of the population, respectively."
          }
        },
        {
          "id": "equine-medicine--equine-tendon--incidence--v2",
          "statement": "การเคยบาดเจ็บ SDFT มาก่อนเป็นปัจจัยเสี่ยงที่เพิ่ม odds ของการเกิด SDF tendinopathy ซ้ำ ร่วมกับพื้นสนามที่แข็งขึ้น (firmer going), อายุที่มากขึ้นตอนลงแข่งครั้งแรก และการแข่งในฤดูร้อน (retrospective cohort ของ UK hurdle racing 2001-2009, 1,031 case starts vs 168,637 control starts)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22372389",
              "locator": "Equine Vet J 44(5):564-569",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Variables found to be associated with increased odds of SDF tendinopathy included: firmer going; increased horse age at first race; having had a previous SDFT injury; and racing in the summer compared to other seasons."
          }
        },
        {
          "id": "equine-medicine--equine-tendon--incidence--v3",
          "statement": "อัตรา re-injury หลัง SDFT injury สูงมากเมื่อรักษาแบบเดิม: บทความทบทวนของ Smith (2008) รายงานว่าม้าแข่ง 168 ตัวที่ได้รับ autologous bone marrow-derived MSC มี re-injury 18% ในกลุ่มที่กลับมาทำงานเต็มที่ ซึ่งเทียบกับตัวเลข 56% ที่รายงานในการศึกษาก่อนหน้าของ conventional management",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18608378",
              "locator": "Disabil Rehabil 30(20-22):1752-1758",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "For horses which had returned to full work, 18% had re-injured, which compared favourably to previous studies on conventional management (56% re-injury rate)."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--tendinopathies-anatomical-breakdown": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--tendinopathies-anatomical-breakdown--v1",
          "statement": "SDF tendonitis เกิดที่ forelimb มากกว่า hindlimb อย่างชัดเจนในม้าแข่ง flat: ในประชากรเดียวกัน forelimb SDF tendonitis 11.1% (1,130 เคส) เทียบกับ hindlimb เพียง 0.06% (6 เคส) และ suspensory ligament desmitis forelimb 3.61% (370 เคส) เทียบกับ hindlimb 0.14% (14 เคส)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15163043",
              "locator": "Equine Vet J 36(4):346-350",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The prevalence of forelimb SDFT tendonitis and SL desmitis was 11.1% (1130 cases) and 3.61% (370 cases) of the population, respectively. In the hindlimb, there were 0.06% (6 cases) and 0.14% (14 cases), respectively."
          }
        }
      ]
    },
    "equine-medicine--equine-tendon--pathology-tx": {
      "claims": [
        {
          "id": "equine-medicine--equine-tendon--pathology-tx--v1",
          "statement": "หลังฉีด autologous bone marrow-derived mesenchymal stem cells เข้า lesion ของ SDFT, reinjury percentage ของม้าแข่ง 113 ตัวที่ติดตามได้อย่างน้อย 2 ปีหลังกลับมาทำงานเต็มที่เท่ากับ 27.4% (National Hunt 25.7%, n = 105; flat 50%, n = 8) ซึ่งต่ำกว่าที่เคยรายงานสำหรับม้า National Hunt ที่รักษาด้วยวิธีอื่นอย่างมีนัยสำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21615465",
              "locator": "Equine Vet J 44(1):25-32",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The reinjury percentage of all racehorses with follow-up (n = 113) undergoing MSC treatment was 27.4%, with the rate for flat (n = 8) and National Hunt (n = 105) racehorses being 50 and 25.7%, respectively. This was significantly less than "
          }
        },
        {
          "id": "equine-medicine--equine-tendon--pathology-tx--v2",
          "statement": "ในม้า Thoroughbred 469 ตัวของ Hong Kong Jockey Club, ultrasonographic cross-sectional area ที่ maximal injury zone เป็นตัวทำนายที่สำคัญที่สุดของการกลับมาแข่งสำเร็จ (ครบ ≥ 5 races) ในเคส SDFT tendonitis ที่มี core lesion: ถ้า lesion < 50% ของ total cross-sectional area โอกาสกลับมาแข่งสำเร็จ 29-35% แต่ถ้า ≥ 50% ลดลงเหลือ 11-16%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29352495",
              "locator": "Equine Vet J 50(5):602-608",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "If the lesion was <50% of the total cross-sectional area, horses had 29-35% probability of successfully racing again, but if it was >=50% this decreased to 11-16%. 2) For cases of SDFT tendonitis without a core lesion, longitudinal fibre pa"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-ortho": {
    "equine-medicine--equine-ortho--lecture-intro-case-images": {
      "claims": [
        {
          "id": "equine-medicine--equine-ortho--lecture-intro-case-images--v1",
          "statement": "Complicated mandibular fracture ในม้า 6 ตัว (foal 1, pony 1, horse 4) ที่ซ่อมด้วย locking compression plate (LCP 4.5/5.0 mm จำนวน 1-3 แผ่น; foal ใช้ LCP 3.5 mm 2 แผ่น) ร่วมกับ cerclage wire ระหว่าง incisor กับ premolar teeth ในผู้ป่วยส่วนใหญ่ หายสนิททุกตัวโดยได้ผลทั้ง functional และ cosmetic ดีเยี่ยม; complications ที่พบ ได้แก่ seroma, screw และ wire breakage, implant infection และ apical tooth root infection",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19151871",
              "locator": "Vet Comp Orthop Traumatol 22(1):54-58",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Each horse underwent locking compression plate (LCP) osteosynthesis consisting of open fracture reduction and application of one to three 4.5/5.0 mm LCP at the ventral, lateral or caudal aspect of the mandible under fluoroscopic control. Tw"
          }
        },
        {
          "id": "equine-medicine--equine-ortho--lecture-intro-case-images--v2",
          "statement": "ในม้า 89 ตัวที่มี fracture ของ rostral portion ของ mandible และ maxilla, short-term complications เกิดใน 24 ตัว (27%) โดย soft tissue infection และ wire loosening หรือ wire failure เป็น complication ที่พบบ่อยที่สุดทั้งระยะสั้นและระยะยาว แต่ long-term functional และ cosmetic outcome ยังดี (favourable) ในทุกชนิดของ fracture และทุกวิธีซ่อม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10363097",
              "locator": "J Am Vet Med Assoc 214(11):1648-1652",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Short-term complications developed in 24 of 89 (27%) horses. Soft tissue infections and wire loosening or failure were the most common short-term and long-term complications. ... Long-term functional and cosmetic outcomes were favorable for"
          }
        }
      ]
    },
    "equine-medicine--equine-ortho--topics-expected-จาก-lecturer-hint": {
      "claims": [
        {
          "id": "equine-medicine--equine-ortho--topics-expected-จาก-lecturer-hint--v1",
          "statement": "Proximal interphalangeal joint (pastern) arthrodesis ด้วย locking compression plate ในม้า 29 ตัว มี median convalescent time หลังผ่าตัด 7 เดือน; จาก 23 ตัวที่ยังมีชีวิตตอน follow-up มี 22 ตัวไม่ขาเป๋และ 18 ตัวกลับไปใช้งานตามวัตถุประสงค์เดิม โดยม้าที่ผ่าตัดด้วยเหตุอื่นที่ไม่ใช่ middle phalanx (P2) fracture มีโอกาสกลับไปทำงานที่ระดับเดิมมากกว่าอย่างมีนัยสำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30451612",
              "locator": "J Am Vet Med Assoc 253(11):1460-1466",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Median convalescent time after surgery (with no riding or unrestricted exercise) was 7 months. Four horses were euthanized; of 23 known alive at follow-up, 22 were not lame, and 18 had returned to their intended use (8 and 10 at higher and "
          }
        },
        {
          "id": "equine-medicine--equine-ortho--topics-expected-จาก-lecturer-hint--v2",
          "statement": "เมื่อเจ้าของไม่สามารถเลือก surgical arthrodesis ได้, facilitated ankylosis ของ proximal interphalangeal joint ด้วยการฉีด intra-articular ethyl alcohol เป็นทางเลือกที่ใช้ได้: ม้า 34 ตัวที่ติดตามอย่างน้อย 6 เดือน มี 17 ตัว (50%) ไม่ขาเป๋ และ 13 ตัว (38%) ดีขึ้นแต่ยังเป๋ โดย median time จนหายเป๋หรือกลับมาทำงานคือ 8 เดือน และเกิด complications 6 ตัว (4 ตัวเป็นแบบไม่รุนแรงและชั่วคราว)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23253080",
              "locator": "Equine Vet J 45(4):442-447",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "While surgical arthrodesis is the treatment of choice for osteoarthritis of the proximal interphalangeal joint, some clients are unable to pursue surgery due to costs. ... Thirty-four horses were included in the study. At the time of follow"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-infectious": {
    "equine-medicine--equine-infectious--outline-agents-4-หมวด": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--outline-agents-4-หมวด--v1",
          "statement": "Strangles ในม้าเกิดจากแบคทีเรีย Streptococcus equi subsp. equi เป็น upper respiratory disease ที่ติดต่อได้สูง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28335829",
              "locator": "vol 13(1), article 75",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Streptococcus equi subsp equi (S. equi) is the cause of \"equine strangles\" which is a highly infectious upper respiratory disease."
          }
        },
        {
          "id": "equine-medicine--equine-infectious--outline-agents-4-หมวด--v2",
          "statement": "Contagious equine metritis (CEM) เกิดจากเชื้อ Taylorella equigenitalis และ gold standard ในการ isolate และ identify เชื้อคือ culture method ตาม WOAH (World Organisation for Animal Health) Terrestrial Manual",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34871752",
              "locator": "vol 110, article 103829",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The gold standard method to isolate and identify Taylorella equigenitalis, the contagious agent of equine metritis, is the culture method according to the World Organisation for Animal Health Terrestrial Manual."
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--deep-dive-แต่ละ-agent-vaccination-schedule": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--deep-dive-แต่ละ-agent-vaccination-schedule--v1",
          "statement": "การตรวจหา S. equi carrier ควรเก็บตัวอย่างจาก guttural pouch lavage (GPL) ไม่ใช่ nasopharynx เพราะโอกาสตรวจพบ S. equi DNA จาก GPL สูงกว่าตัวอย่าง nasopharyngeal ประมาณ 51 เท่า (OR 51.0, P < 0.0001)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28335829",
              "locator": "vol 13(1), article 75",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Detection of S. equi DNA was 51 times more likely from the GPL samples than nasopharyngeal samples (OR 51.0, P < 0.0001). ... This study demonstrates that guttural pouch lavage specimens should be used to detect S. equi"
          }
        },
        {
          "id": "equine-medicine--equine-infectious--deep-dive-แต่ละ-agent-vaccination-schedule--v2",
          "statement": "ม้าที่ติดเชื้อ S. equi ไม่จำเป็นต้องแสดงอาการ strangles โดยในรายงานหนึ่ง carrier (ติดเชื้อนานกว่า 40 วัน) 12 จาก 25 ตัวไม่มี clinical signs จึงแนะนำให้ทำ guttural pouch endoscopy ร่วมกับ lavage แล้วส่ง PCR เพื่อคัดกรอง carrier",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26517620",
              "locator": "vol 247(10), pp 1161-1168",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Clinical signs of strangles were not evident in 12 of 25 cases classified as S equi carriers (infected > 40 days). ... We recommend that guttural pouch endoscopy and lavage with PCR assay of lavage fluid samples be performed to identify S e"
          }
        }
      ]
    },
    "equine-medicine--equine-infectious--viral-disease-เน้นที่เจอใน-th": {
      "claims": [
        {
          "id": "equine-medicine--equine-infectious--viral-disease-เน้นที่เจอใน-th--v1",
          "statement": "AHS outbreak ในไทยปี 2020 ที่ฟาร์มม้าภาคตะวันออกเฉียงเหนือ เกิดจาก African horse sickness virus serotype 1 และผล whole-genome sequencing บ่งชี้ว่าน่าจะเป็นการนำไวรัสเข้าสู่ไทยครั้งเดียว (single introduction)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34287126",
              "locator": "vol 27(8), pp 2208-2211",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The viruses belonged to serotype 1 and contained unique amino acids (95V,166S, 660I in virus capsid protein 2), suggesting a single virus introduction to Thailand."
          }
        },
        {
          "id": "equine-medicine--equine-infectious--viral-disease-เน้นที่เจอใน-th--v2",
          "statement": "AHSV เป็น arthropod-borne virus ที่มี mortality สูง แบ่งเป็น 9 serotypes (AHSV-1 ถึง AHSV-9) ตาม immunogenicity ของ VP2 และ outbreak ในไทยปี 2020 (AHSV-1) เป็นการเกิดโรคนี้ครั้งแรกใน Southeast Asia",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41156774",
              "locator": "vol 13(10), article 2314",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "AHSV has high mortality and is endemic to sub-Saharan Africa. It has been classified into nine distinct serotypes (AHSV-1 to AHSV-9) based on VP2 immunogenicity. The AHS outbreak in Thailand in 2020, caused by AHSV-1, marked the first occur"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-rvf": {
    "equine-medicine--equine-rvf--anatomy-rvf-diagram": {
      "claims": [
        {
          "id": "equine-medicine--equine-rvf--anatomy-rvf-diagram--v1",
          "statement": "Third-degree perineal laceration และ rectovaginal / rectovestibular fistula ในแม่ม้าเป็นการบาดเจ็บที่เกิดตามหลังการคลอด และ rectovaginal fistula formation เองก็เป็นหนึ่งใน complication ของการผ่าตัดซ่อมด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15959984",
              "locator": "vol 53(2), pp 257-264",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Complications of the currently used methods include rectovaginal fistula formation, urine pooling, complete dehiscence of the repair, constipation, tenesmus and difficulty of performance in the practice. ... This method was performed on eig"
          }
        }
      ]
    },
    "equine-medicine--equine-rvf--anesthesia-approach": {
      "claims": [
        {
          "id": "equine-medicine--equine-rvf--anesthesia-approach--v1",
          "statement": "Epidural xylazine ขนาด 0.17-0.22 mg/kg ให้ caudal analgesia นานอย่างน้อย 3.5 ชั่วโมง ซึ่งเพียงพอสำหรับ perineal procedure เช่น rectovaginal laceration repair โดยม้าไม่เกิด ataxia",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-2361505",
              "locator": "vol 22(3), pp 180-181",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Xylazine was administered into the epidural space of nine horses to facilitate various perineal manipulations (ie rectovaginal laceration repair, replacement of prolapsed rectum and urethral extension). The resulting caudal analgesia was su"
          }
        }
      ]
    },
    "equine-medicine--equine-rvf--suture-technique-six-bite-auer-equine-surgery": {
      "claims": [
        {
          "id": "equine-medicine--equine-rvf--suture-technique-six-bite-auer-equine-surgery--v1",
          "statement": "Six-bite suture pattern ใช้ reconstruct ชั้น vestibular shelf / vaginal flap ในการซ่อม third-degree perineal laceration และ rectovestibular fistula ในแม่ม้า (รายงานใช้ polyglactin 910 size 2)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40963117",
              "locator": "vol 21(1), article 538",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "While the vestibular shelf/vaginal flap was reconstructed using size 2 polyglactin 910 suture material in six-bite suture pattern."
          }
        }
      ]
    },
    "equine-medicine--equine-rvf--post-op-complications": {
      "claims": [
        {
          "id": "equine-medicine--equine-rvf--post-op-complications--v1",
          "statement": "Dehiscence และ fistula formation เป็น complication หลักของการซ่อม third-degree perineal laceration แบบ one-stage โดยในแม่ม้า 17 ตัว มี primary healing 14 ตัว, complete dehiscence 1 ตัว และ partial dehiscence ที่เกิด fistula ตามมา 2 ตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1413472",
              "locator": "vol 21(5), pp 378-381",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Third-degree perineal lacerations or rectovestibular fistulae in 17 mares were repaired surgically by a one-stage method. Primary healing occurred in 14 mares; there were one complete dehiscence and two partial dehiscences with fistula form"
          }
        },
        {
          "id": "equine-medicine--equine-rvf--post-op-complications--v2",
          "statement": "Breeding prognosis หลังผ่าตัดซ่อมค่อนข้างดี จากแม่ม้า 47 ตัวที่มี third-degree perineal laceration หรือ rectovestibular fistula กลุ่มที่นำไปผสม 32 ตัว ตั้งท้อง 24 ตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-3882647",
              "locator": "vol 186(3), pp 265-269",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Of 32 mares bred, 24 became pregnant, suggesting that surgical repair is indicated in any mare with sufficient genetic potential. Perineal trauma after surgical repair was recorded in 3 of 20 mares at subsequent parturition."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-pythium": {
    "equine-medicine--equine-pythium--source-caveat-no-handout": {
      "claims": [
        {
          "id": "equine-medicine--equine-pythium--source-caveat-no-handout--v1",
          "statement": "Pythium insidiosum เป็น oomycete ที่ต้องอาศัย aquatic environment ในการดำเนิน life cycle และ host ที่ไวต่อโรคจะติดเชื้อเมื่อสัมผัสเชื้อในพื้นที่น้ำขัง (swampy areas) โดย kunkers สามารถปล่อย zoospores เริ่ม asexual cycle ใหม่ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24326464",
              "locator": "vol 177(1-2), pp 123-127",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "P. insidiosum requires an aquatic environment to develop its life cycle, and the susceptible hosts are contaminated when they contact the microorganism in swampy areas. The equine pythiosis is characterized by the formation of irregular mas"
          }
        },
        {
          "id": "equine-medicine--equine-pythium--source-caveat-no-handout--v2",
          "statement": "Lesion ของ equine pythiosis มักอยู่ที่ limbs และ ventral thoracoabdominal wall เป็น nodule หรือ tumor-like mass ที่มี ulceration และ serosanguineous discharge หน้าตัดพบ fistulous tracts ที่มี kunkers อยู่ภายใน และ incidence สูงสุดหลังฤดูฝน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34607686",
              "locator": "vol 105, article 103726",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The lesions were preferentially located on the limbs and ventral thoracoabdominal wall and characterized by nodules or tumor-like masses with ulcerations and serosanguineous discharge. The cut surface showed fistulous tracts containing kunk"
          }
        },
        {
          "id": "equine-medicine--equine-pythium--source-caveat-no-handout--v3",
          "statement": "การ isolate P. insidiosum ควรเพาะจาก kunkers ที่สดบน selective media เพราะ isolation rate จาก fresh kunkers สูงถึง 94.6% เทียบกับ fresh tissue เพียง 8.3%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12152807",
              "locator": "vol 14(4), pp 288-294",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Overall, isolation rates were higher from fresh kunkers (94.6%) and stored kunkers (76.4%) than from fresh tissues (8.3%) or stored tissues (4.6%). Isolation of P. insidiosum also occurred more often on antibiotic-containing media than on n"
          }
        },
        {
          "id": "equine-medicine--equine-pythium--source-caveat-no-handout--v4",
          "statement": "Nested PCR ใช้ยืนยัน P. insidiosum ได้ โดยรอบแรกใช้ universal fungal primers ITS1/ITS4 ได้ product ขนาด 800 bp แล้วรอบสองใช้ P. insidiosum-specific primers PI1/PI2 ได้ amplicon ขนาด 105 bp",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-21188592",
              "locator": "vol 62(4), pp 1225-1229",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Universal fungal primers (ITS1 and ITS4) were used during the first-round of PCR to amplify ITS1, 5.8s, and ITS2. A second-round of PCR was conducted with P. insidiosum-specific primers (PI1 and PI2) to amplify a variable region within this"
          }
        },
        {
          "id": "equine-medicine--equine-pythium--source-caveat-no-handout--v5",
          "statement": "ยา antimicrobial โดยทั่วไปไม่ได้ผลกับ pythiosis จึงถือว่า radical surgery คือการรักษาหลัก และโรคสามารถกลับเป็นซ้ำได้หลังผ่าตัด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34696188",
              "locator": "vol 9(10), article 1080",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Antimicrobial drugs are ineffective. Radical surgery is an essential treatment. Pythiosis can resume post-surgically."
          }
        },
        {
          "id": "equine-medicine--equine-pythium--source-caveat-no-handout--v6",
          "statement": "Immunotherapy ด้วย P. insidiosum antigens (PIA) ในม้าที่เป็น pythiosis ไม่ได้เพิ่ม survival rate อย่างชัดเจน (ทั้งกลุ่มที่ได้และไม่ได้ PIA รอดใกล้เคียงกันประมาณ 70%) แต่ลดความจำเป็นในการผ่าตัดลงมาก (22.8% เทียบกับ 75.2%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34696188",
              "locator": "vol 9(10), article 1080",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Both PIA-immunized and unimmunized horses with pythiosis showed a similar survival rate of ~70%; however, demands for surgical intervention were much lesser in the immunized cases (22.8% vs. 75.2%)."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-respi": {
    "equine-medicine--equine-respi--urt-vs-lrt-specific-diseases": {
      "claims": [
        {
          "id": "equine-medicine--equine-respi--urt-vs-lrt-specific-diseases--v1",
          "statement": "**Equine asthma** เป็นคำร่มที่ ACVIM panel เลือกใช้ครอบคลุมทั้ง **IAD = mild-moderate equine asthma** และ **RAO/SPRAO (heaves) = severe equine asthma** โดยถือเป็น spectrum ของ chronic airway inflammation ที่คล้าย human asthma ไม่ใช่คนละโรคกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26806374",
              "locator": "J Vet Intern Med 2016;30(2):503-15, introduction and Table 1",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Recurrent airway obstruction (heaves) and IAD represent a spectrum of chronic inflammatory disease of the airways in horses resembling human asthma in many respects. Therefore, the panel chose to use the term \"equine asthma\" syndrome, as re"
          }
        },
        {
          "id": "equine-medicine--equine-respi--urt-vs-lrt-specific-diseases--v2",
          "statement": "BALF cytology ที่เข้าได้กับ **IAD (mild-moderate equine asthma)** คือ neutrophils **> 10%** หรือ mast cells **> 5%** หรือ eosinophils **> 5%** ค่าที่อยู่ระหว่าง reference กับ cut-off เหล่านี้ถือว่า equivocal และขึ้นกับเทคนิคที่ใช้เก็บ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26806374",
              "locator": "J Vet Intern Med 2016;30(2):503-15, section 'Airway Cytology'",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Regardless of the procedure, BALF cytology values of >10% neutrophils, >5% mast cells and >5% eosinophils are consistent with IAD, and values in between are equivocal and likely technique dependent."
          }
        },
        {
          "id": "equine-medicine--equine-respi--urt-vs-lrt-specific-diseases--v3",
          "statement": "**RAO (severe equine asthma)** แยกจาก IAD ได้ด้วย BALF neutrophilia ที่เด่นชัด **> 25%** ร่วมกับ tracheal mucus score **> 2/5** จาก endoscopy และ severe exercise intolerance",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26806374",
              "locator": "J Vet Intern Med 2016;30(2):503-15, section 'Differential Diagnoses - Recurrent Airway Obstruction'",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Also, severe exercise intolerance in RAO and a combination of pronounced BALF neutrophilia (neutrophil percentages >25%) and tracheal mucus accumulation (endoscopic mucus grades >2/5) may indicate RAO."
          }
        },
        {
          "id": "equine-medicine--equine-respi--urt-vs-lrt-specific-diseases--v4",
          "statement": "**RAO** พบเป็นหลักในม้าอายุ **มากกว่า 7 ปี** ขณะที่ **IAD** พบได้ในม้าทุกช่วงอายุและมี clinical signs ที่ subtle กว่า คือ poor performance กับ occasional cough โดย **หายใจปกติขณะพัก** (ไม่มี increased respiratory effort at rest)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26806374",
              "locator": "J Vet Intern Med 2016;30(2):503-15, introduction and Table 1",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Recurrent airway obstruction principally affects horses over 7 years of age. In contrast, IAD can affect horses of all ages and clinical signs are usually subtle, including poor performance and occasional coughing but with normal breathing "
          }
        },
        {
          "id": "equine-medicine--equine-respi--urt-vs-lrt-specific-diseases--v5",
          "statement": "**Rhodococcus equi** ทำให้เกิด chronic purulent bronchopneumonia ในลูกม้าอายุ **น้อยกว่า 6 เดือน** โดยสายพันธุ์ที่ virulent จะมี plasmid ขนาดใหญ่ **80-90 kb** ที่ encode **VapA (virulence-associated protein A)** ซึ่งเป็นตัวที่สัมพันธ์กับการเกิดโรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20064668",
              "locator": "Vet Immunol Immunopathol 2010;135(1-2):1-11, abstract (epub 2009)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Rhodococcus equi is recognised to cause chronic purulent bronchopneumonia in foals of less than 6 months of age. Virulent strains of the bacteria possess a large 80-90 kb plasmid encoding several virulence-associated proteins, including vir"
          }
        },
        {
          "id": "equine-medicine--equine-respi--urt-vs-lrt-specific-diseases--v6",
          "statement": "การรักษา R. equi pneumonia ในลูกม้าที่แนะนำยังคงเป็น **macrolide ร่วมกับ rifampin** และการทำ screening เพื่อรักษา subclinical case ตั้งแต่เนิ่นๆ สัมพันธ์กับการเกิด **antimicrobial-resistant R. equi** ในอเมริกาเหนือ ส่วนการป้องกันที่มีขายจริงยังมีแต่ passive immunisation เพราะยังไม่มีวัคซีนที่ได้ผล",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35188690",
              "locator": "Equine Vet J 2022;54(3):481-494, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Screening tests have been used to implement earlier detection and treatment of foals with presumed subclinical R. equi pneumonia to reduce mortality and severity of disease. Unfortunately, this practice has been linked to the emergence of a"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-neonatal": {
    "equine-medicine--equine-neonatal--parturition-in-the-mare-gestation-length": {
      "claims": [
        {
          "id": "equine-medicine--equine-neonatal--parturition-in-the-mare-gestation-length--v1",
          "statement": "Gestation length ของม้า Thoroughbred เฉลี่ย **344.1 ± 0.49 วัน** โดยมีพิสัยกว้างถึง **315-388 วัน** ซึ่งทุกช่วงในพิสัยนี้ยังให้ลูกม้าที่รอด (viable) ได้ จึงสำคัญมากตอนจะตัดสินว่าลูกม้าตัวไหนเป็น dysmaturity",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12417119",
              "locator": "Anim Reprod Sci 2002;74(3-4):175-85, abstract; n = 433 Thoroughbred pregnancies dated by sequential ultrasound",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "An average gestation length of 344.1 +/- 0.49 days was evident. ... It is concluded that (i) the gestation length range (315-388 days), all resulting in viable foals is noteworthy and of clinical importance when considering the classificati"
          }
        },
        {
          "id": "equine-medicine--equine-neonatal--parturition-in-the-mare-gestation-length--v2",
          "statement": "Gestation length ในม้าแปรผันตามหลายปัจจัย คือ **ยาวขึ้นเมื่อลูกม้าเป็นตัวผู้** และ **ยาวขึ้นตามอายุแม่ม้า** โดยตัวแม่ม้าเองอธิบายความแปรปรวนของ gestation length ได้ **18%** ส่วนพ่อม้า **4%** จึงต้องดู signalment ก่อนตัดสินว่าเกินกำหนดจริงไหม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29475570",
              "locator": "Anim Reprod Sci 2018;191:22-33, abstract; 16,226 pregnancies, 5,959 mares, 290 stallions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The GL ranged from 306 to 390 days, with a mean length of 347.0 +/- 14.4 days. Mating of mares with stallions aged 17 years and older resulted in a significantly longer GL compared to younger stallions. Furthermore, the GL significantly inc"
          }
        }
      ]
    },
    "equine-medicine--equine-neonatal--stages-of-labor-neonatal-critical-care": {
      "claims": [
        {
          "id": "equine-medicine--equine-neonatal--stages-of-labor-neonatal-critical-care--v1",
          "statement": "เกณฑ์วินิจฉัย **failure of passive transfer (FPT)** ในลูกม้าแรกเกิดคือ serum immunoglobulin **< 8 g/L (800 mg/dL)** โดย immunocrit ที่ค่าเทียบเท่า 9.5% ให้ sensitivity **94%** และ specificity **82%** เทียบกับ agarose gel electrophoresis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31975477",
              "locator": "Equine Vet J 2020;52(5):760-764, abstract; 211 newborn Thoroughbred foals",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A cut-off value of 8 g/L of serum immunoglobulins by agarose gel electrophoresis and its equivalent of 9.5% for the immunocrit test was indicative of failure of passive transfer. The sensitivity and specificity of the immunocrit method at t"
          }
        },
        {
          "id": "equine-medicine--equine-neonatal--stages-of-labor-neonatal-critical-care--v2",
          "statement": "การดูดซึม colostral immunoglobulin ที่ small intestine ของลูกม้า **สูงสุดในช่วงถึงประมาณ 8 ชั่วโมงหลังคลอด** แล้วค่อยๆ ลดลงจน **เป็นศูนย์หลัง 24 ชั่วโมง** (gut closure) จึงเป็นเหตุผลว่าทำไมต้องให้ colostrum ให้ทันหน้าต่างนี้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31975477",
              "locator": "Equine Vet J 2020;52(5):760-764, abstract, opening rationale",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In newborn foals the absorption of colostrum immunoglobulins in the small intestine is maximal up to 8 hours after birth and then progressively decreases to become null after 24 hours post-partum."
          }
        },
        {
          "id": "equine-medicine--equine-neonatal--stages-of-labor-neonatal-critical-care--v3",
          "statement": "การประเมิน FPT ในลูกม้าใช้เกณฑ์ serum IgG สองระดับคือ **< 400 mg/dL** และ **< 800 mg/dL** โดย stall-side screening ด้วย Brix refractometry ของน้ำนมแม่ก่อน-หลังลูกดูดนม ให้ negative predictive value **97.3%** และ **96.3%** ตามลำดับ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22785030",
              "locator": "J Vet Med Sci 2012;74(11):1387-95, abstract; 31 foals, 14 dams, serum IgG by single radial immunodiffusion",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the NPVs of DVRI for detecting serum IgG concentrations<400 mg/dl and<800 mg/dl were 97.3% and 96.3% when the cutoff value is set to 6% and 10%, respectively. The results suggest that measurement of DVRI is useful in assessing FPT as an ini"
          }
        },
        {
          "id": "equine-medicine--equine-neonatal--stages-of-labor-neonatal-critical-care--v4",
          "statement": "**Neonatal encephalopathy (NE) / neonatal maladjustment syndrome (NMS)** หรือ dummy foal หมายถึงลูกม้าแรกเกิดที่มี neurologic signs แบบ **non-infectious** ในช่วง immediate postpartum โดยกลไกหลักที่เชื่อกันคือ cerebral ischemia, hypoxia และ inflammation ที่นำไปสู่ neuronal/glial dysfunction กับ excitotoxicity และนอกจาก supportive treatment ควรพิจารณาให้ antimicrobials ด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31088699",
              "locator": "Vet Clin North Am Equine Pract 2019;35(2):363-378, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Neonatal encephalopathy (NE) and neonatal maladjustment syndrome (NMS) are terms used for newborn foals that develop noninfectious neurologic signs in the immediate postpartum period. Cerebral ischemia, hypoxia, and inflammation leading to "
          }
        }
      ]
    }
  },
  "equine-medicine--equine-anesthesia": {
    "equine-medicine--equine-anesthesia--หัวข้อมาตรฐาน-equine-anesthesia-ขอบเขตคาด": {
      "claims": [
        {
          "id": "equine-medicine--equine-anesthesia--หัวข้อมาตรฐาน-equine-anesthesia-ขอบเขตคาด--v1",
          "statement": "จาก CEPEF Phase 1-2 (41,824 cases จาก 62 clinics) ม้าที่ได้รับ general anaesthesia มี overall death rate ภายใน 7 วัน = 1.9% (95% CI 1.8-2.0) และเมื่อตัดเคส emergency abdominal surgery (colic) ออก death rate ของกลุ่ม noncolic ลดเหลือ 0.9% (95% CI 0.8-1.0)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28404360",
              "locator": "Vet Anaesth Analg 29(4):159-170, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "an overall death rate of 1.9% (95% CI: 1.8-2.0)"
          }
        },
        {
          "id": "equine-medicine--equine-anesthesia--หัวข้อมาตรฐาน-equine-anesthesia-ขอบเขตคาด--v2",
          "statement": "ใน CEPEF กลุ่ม noncolic ที่เสียชีวิต สาเหตุการตายแบ่งเป็น cardiac arrest หรือ postoperative cardiovascular collapse 109 ราย (33%) และ fractures ร่วมกับ myopathies 107 ราย (32%) กล่าวคือสองกลุ่มนี้รวมกันเป็นราวสองในสามของการตายทั้งหมด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28404360",
              "locator": "Vet Anaesth Analg 29(4):159-170, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There were 109 (33%) deaths from cardiac arrest or post-operative cardiovascular collapse, with 107 (32%) from fractures and myopathies."
          }
        },
        {
          "id": "equine-medicine--equine-anesthesia--หัวข้อมาตรฐาน-equine-anesthesia-ขอบเขตคาด--v3",
          "statement": "CEPEF4 (ข้อมูล 6 เดือนแรก, 6,701 general anaesthesia และ 1,955 standing sedation จาก 69 ศูนย์) รายงาน 7-day mortality รวมของ general anaesthesia = 1.0%, กลุ่มที่ไม่ใช่ exploratory laparotomy for colic = 0.6%, กลุ่ม colic = 3.4% และ standing sedation = 0.2%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34573515",
              "locator": "Animals 11(9):2549, Abstract and preliminary results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the overall mortality rate for general anaesthesia within the seven-day outcome period was 1.0%"
          }
        },
        {
          "id": "equine-medicine--equine-anesthesia--หัวข้อมาตรฐาน-equine-anesthesia-ขอบเขตคาด--v4",
          "statement": "ในยุคที่ maintenance ใช้ isoflurane และ sevoflurane เป็นหลัก การศึกษาล่าสุดรายงาน intraoperative cardiac arrest น้อยลงกว่ายุค halothane แต่ catastrophic fractures กลายเป็นสาเหตุอันดับหนึ่งของการตายที่เกิดในช่วง recovery",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26970940",
              "locator": "Vet Anaesth Analg 43(3):242-255, review conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Catastrophic fractures, however, have become the greatest cause of recovery-associated mortality."
          }
        },
        {
          "id": "equine-medicine--equine-anesthesia--หัวข้อมาตรฐาน-equine-anesthesia-ขอบเขตคาด--v5",
          "statement": "การเปลี่ยนนิยาม hypotension จาก MAP <60 mmHg (แก้ด้วย low-volume crystalloid, etilefrine หรือ dopamine) เป็น MAP <70 mmHg (แก้ด้วย high-volume fluid therapy ร่วมกับ dobutamine) สัมพันธ์กับจำนวนม้าที่มี muscle enzyme สูงขึ้นหลัง halothane anaesthesia ลดลงจาก 5 ใน 17 ตัว เหลือ 1 ใน 18 ตัว แต่ความต่างนี้ยังไม่ถึงนัยสำคัญทางสถิติ (p = 0.088) ผู้เขียนจึงสรุปได้เพียงว่าการรักษา MAP >70 mmHg อาจ (may) ช่วยลดความรุนแรงของ myopathy",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16476002",
              "locator": "Vet Anaesth Analg 33(2):122-127, Results and Conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Maintaining MAP >70 mmHg with high-volume fluid therapy and dobutamine may help to reduce the severity of myopathy."
          }
        },
        {
          "id": "equine-medicine--equine-anesthesia--หัวข้อมาตรฐาน-equine-anesthesia-ขอบเขตคาด--v6",
          "statement": "ในม้า colic การให้ alpha-2 agonist detomidine 20 หรือ 40 µg/kg IV ให้ analgesia และ sedation ดีกว่า butorphanol 0.1 mg/kg และดีกว่า flunixin meglumine 1.0 mg/kg อย่างมีนัยสำคัญ โดยที่ขนาด 40 µg/kg analgesia ถูกจัดว่า highly satisfactory 93.3% และ satisfactory 6.7% เทียบกับ butorphanol ที่ไม่มีม้าตัวใดถูกจัดในสองระดับนี้เลย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9118091",
              "locator": "Equine Vet J Suppl (7):111-116, blind multicentre trial in 152 horses",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Analgesia was rated as highly satisfactory or satisfactory in 93.3 per cent and 6.7 per cent of the horses receiving 40 micrograms/kg bwt of detomidine"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-acupuncture": {
    "equine-medicine--equine-acupuncture--tcvm-theory-cases": {
      "claims": [
        {
          "id": "equine-medicine--equine-acupuncture--tcvm-theory-cases--v1",
          "statement": "systematic review ของ controlled clinical trials ทาง veterinary acupuncture (randomized controlled trials 14 เรื่อง และ nonrandomized controlled trials 17 เรื่อง) สรุปว่ายังไม่มีหลักฐานหนักแน่นพอที่จะแนะนำหรือปฏิเสธ acupuncture สำหรับภาวะใดๆ ในสัตว์เลี้ยง โดยคุณภาพ methodology ของ trial เหล่านี้ประเมินด้วย Jadad score แล้วอยู่ในระดับต่ำโดยเฉลี่ย และมีเพียง cutaneous pain กับ diarrhea ที่ข้อมูลชวนให้ศึกษาต่อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16734078",
              "locator": "J Vet Intern Med 20(3):480-488, Conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "there is no compelling evidence to recommend or reject acupuncture for any condition in domestic animals"
          }
        },
        {
          "id": "equine-medicine--equine-acupuncture--tcvm-theory-cases--v2",
          "statement": "ใน randomized controlled crossover ในม้า 8 ตัว การทำ electroacupuncture 2 ชั่วโมงที่จุด Bladder 21, Bladder 25 และ Bladder 27 ทั้งสองข้าง ร่วมกับ Bai hui และ Stomach 36 (ข้างขวา) เพิ่ม rectal pain threshold ได้ แต่ได้น้อยกว่า butorphanol 0.1 mg/kg IV (174 ± 35 เทียบกับ 214 ± 24 mmHg balloon pressure) ขณะที่ electroacupuncture ทำให้เกิดการเปลี่ยนแปลงทาง cardiovascular และ respiratory น้อยมาก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12602580",
              "locator": "Am J Vet Res 64(2):137-144, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Butorphanol produced greater increases in rectal pain threshold, compared with EA (mean +/- SD, 214 +/- 24 vs 174 +/- 35 mm Hg of balloon pressure)."
          }
        },
        {
          "id": "equine-medicine--equine-acupuncture--tcvm-theory-cases--v3",
          "statement": "prospective randomized single-blinded crossover pilot ในม้า 8 ตัว พบว่า acupuncture 3 ครั้งภายใน 8 วัน ลด hip hike difference อย่างมีนัยสำคัญในทุกเงื่อนไขการเดิน (เช่น control 6.3 ± 6.4 mm เทียบกับ treatment -0.2 ± 6.4 mm, p = 0.007) และลด subjective lameness score (OR 0.51, 95% CI 0.34-0.78) แต่ global score ไม่ต่างกันอย่างมีนัยสำคัญ (OR 0.53, p = 0.12)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26946316",
              "locator": "Vet Anaesth Analg 44(1):154-162, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Acupuncture can change horses' gaits to a degree appreciable by objective and subjective analyses."
          }
        },
        {
          "id": "equine-medicine--equine-acupuncture--tcvm-theory-cases--v4",
          "statement": "ใน controlled blinded randomized block pilot (ม้า 4 ตัว, ทำ corneal epithelial debridement) กลุ่ม electroacupuncture ได้ ocular pain score รวม 1356 ซึ่งดีกว่า control 1580 และดีกว่า phenylbutazone 1397 แต่กลุ่มเดียวที่ต่างจาก control อย่างมีนัยสำคัญคือ flunixin meglumine (score 1114, p = 0.01 ในช่วง 46 ชั่วโมงแรก) ผู้เขียนจึงสรุปว่า flunixin meglumine ลดปวดตาได้ดีที่สุด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33663725",
              "locator": "J Equine Vet Sci 98:103375, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Flunixin meglumine was the most effective treatment at reducing ocular pain in the horse."
          }
        },
        {
          "id": "equine-medicine--equine-acupuncture--tcvm-theory-cases--v5",
          "statement": "overview of systematic reviews ที่ตีพิมพ์ระหว่าง ค.ศ. 2000-2022 ประเมิน systematic review ของ veterinary acupuncture ด้วยเครื่องมือ AMSTAR 2 แล้วพบว่าอยู่ในระดับคุณภาพต่ำทั้งหมด จนไม่สามารถประเมินความน่าเชื่อถือของ primary RCT และ CCT 35 เรื่องที่รวมอยู่ในนั้นได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39284363",
              "locator": "Homeopathy 114(2):106-116, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The systematic reviews of acupuncture and phytotherapy were all of low quality, preventing formal assessment of their reviewed RCTs/CCTs."
          }
        }
      ]
    },
    "equine-medicine--equine-acupuncture--covering-topics-3-หมวด": {
      "claims": [
        {
          "id": "equine-medicine--equine-acupuncture--covering-topics-3-หมวด--v1",
          "statement": "scoping review ของหลักฐาน acupuncture ในสัตว์เลี้ยง (สุนัข แมว ม้า) พบ citation ที่เกี่ยวข้อง 843 เรื่อง โดย narrative review เป็นสัดส่วนมากที่สุด (43%) มี experimental studies 179 เรื่อง และ case report หรือ case series 175 เรื่อง สุนัขเป็นสัตว์ที่ถูกศึกษามากที่สุด และ musculoskeletal conditions เป็นข้อบ่งใช้ที่พบบ่อยที่สุด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29224586",
              "locator": "Anim Health Res Rev 18(2):177-185, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "We identified 179 experimental studies and 175 case reports/case series that examined the efficacy of acupuncture."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-parasites": {
    "equine-medicine--equine-parasites--วัตถุประสงค์-โรคปรสิตหนอนพยาธิในม้า": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--วัตถุประสงค์-โรคปรสิตหนอนพยาธิในม้า--v1",
          "statement": "การสำรวจม้า 79 ตัวจาก 11 ฟาร์มใน จ.นครศรีธรรมราช พบ GI parasite รวม 74.7% โดย single strongyle infection มีสัดส่วนสูงสุดที่ 50.6% และ pooled strongyle sample ทั้ง 11 ตัวอย่างให้ผลบวกต่อ cyathostomins ด้วย conventional PCR",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39829659",
              "locator": "Abstract, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The overall prevalence of GI parasites was 74.7%, with single strongyle infections accounting for the highest proportion at 50.6% ... All 11 pooled strongyle samples were positive for cyathostomins"
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--outline-4-หมวดตามอวัยวะ": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--outline-4-หมวดตามอวัยวะ--v1",
          "statement": "Cyathostomins (small strongyles) ถือเป็นปรสิตที่พบบ่อยที่สุดและก่อโรคมากที่สุดในม้าปัจจุบัน โดยกลุ่มอาการ larval cyathostominosis ซึ่งเกิดจาก mass emergence ของ inhibited larval stages มี fatality rate สูงแม้จะได้รับการดูแลตามมาตรฐานที่ดีที่สุด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19778462",
              "locator": "Abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The small strongyles of horses, also known as cyathostomins, are considered the most prevalent and pathogenic parasites of horses today. The clinical syndrome of larval cyathostominosis which occurs as a result of mass emergence of inhibite"
          }
        },
        {
          "id": "equine-medicine--equine-parasites--outline-4-หมวดตามอวัยวะ--v2",
          "statement": "Anoplocephala perfoliata เป็น significant risk factor ของ ileal impaction colic (odds ratio 34.0 เมื่อวินิจฉัยด้วยวิธี coprological) และของ spasmodic colic (odds ratio 8.0) โดยความเสี่ยงต่อ spasmodic colic เพิ่มขึ้นตาม infection intensity",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9622319",
              "locator": "Abstract, matched case-control results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Cases of spasmodic colic were much more likely (odds ratio = 8.0) to be associated with A. perfoliata infection detected coprologically than controls ... For cases of ileal impaction, a strong association was found between colic and A. perf"
          }
        }
      ]
    },
    "equine-medicine--equine-parasites--รายละเอียดแต่ละหมวด": {
      "claims": [
        {
          "id": "equine-medicine--equine-parasites--รายละเอียดแต่ละหมวด--v1",
          "statement": "FECRT ยังเป็น method of choice สำหรับประเมิน anthelmintic efficacy ภาคสนามและวินิจฉัย anthelmintic resistance โดย WAAVP guideline ฉบับ 2023 เปลี่ยนมาแนะนำ paired design (เทียบ FEC ก่อนและหลังการให้ยาในสัตว์ตัวเดียวกัน) แทน unpaired treated-vs-control design และเปลี่ยนเกณฑ์เข้าร่วมจาก minimum mean EPG ของกลุ่ม เป็น minimum total number of eggs counted",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37121092",
              "locator": "Abstract, list of four important differences from the previous FECRT recommendations. ไม่ระบุเลข threshold ที่นี่ เพราะ abstract บอกเพียงว่า thresholds ถูกปรับให้ต่างกันตาม host species ยา และชนิดปรสิต ต้องเปิด full text ส่วน horses เพื่อดูตัวเลขจริง",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "it is now generally recommended to perform the FECRT based on pre- and post-treatment FEC of the same animals (paired study design), rather than on post-treatment FEC of both treated and untreated (control) animals (unpaired study design). "
          }
        },
        {
          "id": "equine-medicine--equine-parasites--รายละเอียดแต่ละหมวด--v2",
          "statement": "Resistance ต่อ benzimidazoles และ pyrimidines (pyrantel) พบแพร่หลายมากใน cyathostomin population ทั่วโลก และในระยะหลังมีการยืนยัน macrocyclic lactone resistance ใน cyathostomins ด้วย ทำให้ multi-drug resistance กำลังกลายเป็นภาวะปกติในฝูงม้าที่มีการจัดการ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36342004",
              "locator": "Abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Resistance to benzimidazoles and pyrimidines is highly prevalent in cyathostomin populations around the world, and macrocyclic lactone resistance has been documented in cyathostomins in recent years as well ... multi-drug resistance is beco"
          }
        },
        {
          "id": "equine-medicine--equine-parasites--รายละเอียดแต่ละหมวด--v3",
          "statement": "Strongylid egg reappearance period (ERP) สั้นลงชัดเจน โดยในช่วงปี 1990s ประเมินไว้ที่ 8-10 สัปดาห์สำหรับ ivermectin และ 12-16 สัปดาห์สำหรับ moxidectin แต่การศึกษาหลังปี ค.ศ. 2000 หลายชิ้นพบ ERP เหลือ 5 สัปดาห์ทั้งสองตัวยา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36342004",
              "locator": "Abstract, egg reappearance period section",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In the 1990s, ERP estimates were 8-10 and 12-16 weeks for ivermectin and moxidectin, respectively, while several studies published after year 2000 found ERPs to be 5 weeks for both compounds. This is a clear change in anthelmintic performan"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-nutrition": {
    "equine-medicine--equine-nutrition--bcs-tes-scoring-your-horse": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--bcs-tes-scoring-your-horse--v1",
          "statement": "Body Condition Score (BCS) ในม้าใช้ scale 9 ระดับ (x/9) และในงานวิจัยนิยามม้าอ้วน (obese) ที่ BCS ≥ 7/9",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26424915",
              "locator": "Abstract, materials and methods (group definitions)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Thirty-five light breed horses with body condition scores (BCS) of 3/9 to 9/9 were studied, including 7 obese, normoinsulinemic (BCS ≥ 7, resting serum insulin < 30 μIU/mL) and 6 obese, hyperinsulinemic (resting serum insulin ≥ 30 μIU/mL) h"
          }
        },
        {
          "id": "equine-medicine--equine-nutrition--bcs-tes-scoring-your-horse--v2",
          "statement": "BCS ไม่ใช่ดัชนีที่ดีสำหรับติดตามการลดน้ำหนักระยะแรก โดยในโพนี่อ้วนที่ถูกจำกัดอาหาร 12 สัปดาห์ BCS คงที่ทั้งที่น้ำหนักตัวลดจริง ขณะที่ heart girth, belly girth, rump width และความหนา subcutaneous fat ที่ rib-eye ลดลงอย่างมีนัยสำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20840575",
              "locator": "Abstract, results and conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "BCS remained constant. Heart and belly girths, rump width and subcutaneous fat depth at rib-eye decreased significantly with time and BM ... BCS was not a useful index of early weight loss but heart and belly girths and subcutaneous rib-eye"
          }
        }
      ]
    },
    "equine-medicine--equine-nutrition--รายละเอียดต่อ-slides-10-diet-provides-feeds": {
      "claims": [
        {
          "id": "equine-medicine--equine-nutrition--รายละเอียดต่อ-slides-10-diet-provides-feeds--v1",
          "statement": "ECEIM consensus แนะนำว่าม้าที่ต้องลดน้ำหนักควรได้ mixed species grass hay-based diet ที่ 1.25-1.5% ของ actual body mass เป็น dry matter intake (หรือ 1.4-1.7% ของ BM as fed) ซึ่งโดยทั่วไปเทียบเท่า digestible energy ประมาณ 64-94% ของ maintenance requirement",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30724412",
              "locator": "Section 7.1 Dietary energy restriction",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In general, daily allowance of a mixed species grass hay-based diet of 1.25%-1.5% of actual BM as DMI, or 1.4%-1.7% of actual BM as fed, is recommended, typically corresponding to a digestible energy (DE) intake of 64%-94% of maintenance re"
          }
        },
        {
          "id": "equine-medicine--equine-nutrition--รายละเอียดต่อ-slides-10-diet-provides-feeds--v2",
          "statement": "ECEIM consensus แนะนำให้ตั้งเป้าการลดน้ำหนักที่ 0.5-1.0% ของ body mass ต่อสัปดาห์ และติดตามใกล้ชิดเพื่อให้ถึงเป้าแต่ไม่เกินเป้า เพราะการลดน้ำหนักเร็วกว่านั้นสัมพันธ์กับ serum triglyceride และ non-esterified fatty acid ที่สูงขึ้นจาก lipolysis ที่เพิ่มขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30724412",
              "locator": "Section 7.1 Dietary energy restriction",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "more rapid BM losses have been associated with increases in serum triglycerides and non-esterified fatty acid concentrations, reflecting increased lipolysis ... Consequently, energy restriction should be targeted toward achieving 0.5%-1.0% "
          }
        },
        {
          "id": "equine-medicine--equine-nutrition--รายละเอียดต่อ-slides-10-diet-provides-feeds--v3",
          "statement": "ในการศึกษาโพนี่อ้วน Welsh Mountain การให้ hay ที่ 2% ของ body mass เป็น daily dry matter intake ถูกใช้เป็นระดับ maintenance ส่วนการจำกัดที่ 1% ของ BM นาน 7 สัปดาห์ ทำให้น้ำหนักตัวลดลง 7.11-11.59%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32131835",
              "locator": "Abstract, methods and results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "individuals were fed the same hay to maintenance (2% body mass (BM) as daily dry matter (DM) intake), animals underwent a 7-week period of dietary restriction (1% BM hay as daily DM intake) ... Losses in body mass ranged from 7.11 to 11.59%"
          }
        },
        {
          "id": "equine-medicine--equine-nutrition--รายละเอียดต่อ-slides-10-diet-provides-feeds--v4",
          "statement": "ในม้าที่ถูกทำให้อ้วนด้วยอาหาร isocaloric กลุ่มที่ได้ cereal-rich meal มี insulin sensitivity ต่ำกว่ากลุ่ม control อย่างมีนัยสำคัญ (P < 0.001) ขณะที่กลุ่ม fat-rich ไม่ต่างจาก control ผู้วิจัยจึงสรุปว่าการให้ cereal-rich meal ดูจะเป็นตัวกำหนด insulin sensitivity มากกว่าการเหนี่ยวนำให้อ้วนเพียงอย่างเดียว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27387720",
              "locator": "Abstract, results and conclusion",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The CHO group had lower insulin sensitivity (SI; P <0.001) and higher acute insulin response to glucose (P = 0.002) than the CON group. In contrast, the FAT group was no different to the control group ... The provision of cereal-rich meals "
          }
        }
      ]
    }
  },
  "equine-medicine--equine-dentistry": {
    "equine-medicine--equine-dentistry--dental-anatomy-hypsodont-anisognathism": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--dental-anatomy-hypsodont-anisognathism--v1",
          "statement": "Infundibular cemental hypoplasia (การอุด cementum ไม่สมบูรณ์ใน infundibulum ของ maxillary cheek teeth) จัดเป็น non-pathological developmental abnormality พบใน >50% ของ cheek teeth ที่ไม่มีหลักฐานโรคฟัน และ >70% ของฟันที่เป็นโรค โดยพบมากที่สุดที่ first molar (Triadan 09) ที่ 75%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26831172",
              "locator": "Abstract, results (688 non-diseased and 55 diseased maxillary cheek teeth)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Infundibular cemental hypoplasia was defined as a non-pathological developmental abnormality and was detected in >50% of CT with no evidence of dental diseases and in >70% of diseased CT. The first molar (Triadan 09) showed the highest prev"
          }
        }
      ]
    },
    "equine-medicine--equine-dentistry--dental-nomenclature-ageing-pathology": {
      "claims": [
        {
          "id": "equine-medicine--equine-dentistry--dental-nomenclature-ageing-pathology--v1",
          "statement": "EOTRH (equine odontoclastic tooth resorption and hypercementosis) เป็นโรคฟันที่เจ็บและ progressive ซึ่งกระทบ incisor และ canine ของม้าสูงอายุเป็นหลัก วินิจฉัยด้วยภาพรังสี ในการสำรวจม้าอายุ ≥10 ปี จำนวน 142 ตัวที่ Berlin-Brandenburg พบ 94% มี radiological change ของ incisor อย่างน้อยระดับเล็กน้อย และ 62% มีระดับปานกลางถึงรุนแรง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29067719",
              "locator": "Abstract, results (142 horses aged 10 years and older)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Equine odontoclastic tooth resorption and hypercementosis (EOTRH) is a painful and progressive dental disease that mainly affects the incisors and canine teeth of aged horses ... Overall, 94% of all horses had at least minor and 62% had mod"
          }
        },
        {
          "id": "equine-medicine--equine-dentistry--dental-nomenclature-ageing-pathology--v2",
          "statement": "รอยโรคระยะแรกของ EOTRH เกิดที่ด้าน palatal/lingual ของ incisor ทำให้ dorsoventral intraoral radiograph มีข้อจำกัดในการตรวจพบ โดยฟันที่ภาพรังสีจัดว่าปกติกลับพบรอยโรคเมื่อตรวจ macroscopic 13.7% และเมื่อตรวจด้วย micro-CT ถึง 58.1%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35302672",
              "locator": "Abstract, results and conclusions (20 cadaveric horse heads)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Early, subtle lesions develop on the palatal/lingual side of incisors. While radiographically detected lesions were confirmed macroscopically and on the µCT scans, numerous teeth which were radiographically classified as healthy displayed l"
          }
        },
        {
          "id": "equine-medicine--equine-dentistry--dental-nomenclature-ageing-pathology--v3",
          "statement": "ในม้า thoroughbred 434 ตัวที่ทราบอายุจริง การมี hook ที่ upper corner incisor และ Galvayne's groove ไม่มีประโยชน์ในการประมาณอายุ ส่วน dental star เป็น attritional feature ที่สัมพันธ์กับอายุมากที่สุด และ eruption ของ incisor เป็น feature ที่คงเส้นคงวาที่สุดแต่ก็ยังไม่น่าเชื่อถือทั้งหมด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8533255",
              "locator": "Abstract, results and conclusion",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The eruption of the incisor teeth was the most consistent feature but it was not totally reliable. The presence of a hook on the upper corner incisor and Galvayne's groove proved to be of no value when estimating age and, of the attritional"
          }
        },
        {
          "id": "equine-medicine--equine-dentistry--dental-nomenclature-ageing-pathology--v4",
          "statement": "ในม้าลากเกวียนลูกผสม 70 ตัวทางตอนใต้ของบราซิลที่ไม่เคยได้รับการทำฟันมาก่อน ความผิดปกติในช่องปากที่พบบ่อยที่สุดคือ excessively sharp enamel points 98.6% รองลงมาคือ cheek tooth diastema 65.7% และ mucosal ulcer 65.7%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33118460",
              "locator": "Abstract, results (cross-sectional survey of 70 horses)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Excessively sharp enamel points (98.6%), cheek tooth diastema (65.7%), and mucosal ulcers (65.7%) occurred most frequently. Diastemata were more likely to be present between maxillary and mandibular Triadan 06/07 and mandibular 10/11."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-tumors": {
    "equine-medicine--equine-tumors--4-tumor-types-covered": {
      "claims": [
        {
          "id": "equine-medicine--equine-tumors--4-tumor-types-covered--v1",
          "statement": "Sarcoid เป็น cutaneous neoplasm ที่พบบ่อยที่สุดในม้า — ใน survey ของ equine cutaneous/mucocutaneous neoplasms 536 ราย sarcoid คิดเป็น 51.4% ของเนื้องอกทั้งหมด และ mean age ตอนวินิจฉัยคือ 9 ปี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16566271",
              "locator": "J Vet Diagn Invest 18(1):123-6",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Sarcoids represented 51.4% of all neoplasms and 15.18% of total equine accessions."
          }
        },
        {
          "id": "equine-medicine--equine-tumors--4-tumor-types-covered--v2",
          "statement": "Squamous cell carcinoma (SCC) เป็นเนื้องอกผิวหนัง/เยื่อเมือกที่พบรองจาก sarcoid (18.3% ของ 536 neoplasms) โดย ocular SCC พบบ่อยใน Paint และ Quarter Horse ส่วน penile/preputial SCC พบบ่อยใน Appaloosa และ Quarter Horse; mean age ของม้าที่เป็น ocular SCC = 13 ปี ซึ่งน้อยกว่ากลุ่ม penile/preputial (21 ปี)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16566271",
              "locator": "J Vet Diagn Invest 18(1):123-6",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Squamous cell carcinoma constituted 18.3% of all neoplasms and 5.41% of total equine accessions. Ocular squamous cell carcinoma was most common in paints and quarter horses, and penile/preputial squamous cell carcinoma was most common in ap"
          }
        },
        {
          "id": "equine-medicine--equine-tumors--4-tumor-types-covered--v3",
          "statement": "Equine sarcoid สัมพันธ์กับ bovine papillomavirus โดย BPV-1 เป็น type หลักที่พบในยุโรป — ในการศึกษาม้าที่โปแลนด์ ตรวจพบ BPV DNA ใน 21/40 (52.5%) ของ sarcoid ที่วินิจฉัยทางคลินิก และในจำนวนนี้เป็น BPV-1 20 ราย ส่วน BPV-2 พบเพียง 1 ราย (4.8%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30997762",
              "locator": "Pol J Vet Sci 22(1):25-29",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The DNA was detected in 21/40 (52.5%) of clinically diagnosed sarcoids."
          }
        },
        {
          "id": "equine-medicine--equine-tumors--4-tumor-types-covered--v4",
          "statement": "Melanoma ในม้าสีเทา (gray) พบได้บ่อยมากและเพิ่มตามอายุ — epidemiological survey ใน Camargue-type gray-skinned horses 264 ตัว พบ prevalence รวม 31.4% และสูงถึง 67% ในม้าอายุมากกว่า 15 ปี โดยตำแหน่งที่พบบ่อยที่สุดคือใต้โคนหาง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10761996",
              "locator": "Pigment Cell Res 13(1):47-51",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the prevalence of melanomas in the overall population was 31.4%; ... the incidence of melanomas was significantly correlated with age, giving a prevalence of 67% at ages > 15 years; ... the most frequently occurring body site of these tumor"
          }
        }
      ]
    },
    "equine-medicine--equine-tumors--case-01-scc-at-medial-canthus": {
      "claims": [
        {
          "id": "equine-medicine--equine-tumors--case-01-scc-at-medial-canthus--v1",
          "statement": "SCC เป็นมะเร็งที่พบบ่อยที่สุดของตาม้า และมักเริ่มต้นที่ limbus แล้วลุกลามเข้า cornea ทำให้เสียการมองเห็นหรือเสียลูกตาได้ ซึ่งตรงกับ case นี้ที่มี mass ที่ medial palpebral conjunctiva และ corneal limbus",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28425625",
              "locator": "Int J Cancer 141(2):342-353",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Squamous cell carcinoma (SCC) is the most common cancer of the equine eye, frequently originating at the limbus, with the potential to invade the cornea, cause visual impairment, and result in loss of the eye."
          }
        },
        {
          "id": "equine-medicine--equine-tumors--case-01-scc-at-medial-canthus--v2",
          "statement": "Intratumoral (intralesional) cisplatin ใน purified sesame oil ขนาด 1 mg ต่อเนื้อเยื่อ 1 cm³ ให้ 4 ครั้ง ห่างกันครั้งละ 2 สัปดาห์ โดยเริ่มครั้งแรกตอนผ่าตัด ให้ relapse-free survival ประมาณ 92 ± 5% ที่ 1 ปี และ 77 ± 11% ที่ 4 ปี ในม้า 27 ตัว (32 tumors) โดย local toxicosis น้อยและไม่รบกวนการหายของแผล",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7890578",
              "locator": "J Am Vet Med Assoc 205(8):1170-6",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Dosage was 1 mg of cisplatin/cm3 of tissue. The mean relapse-free interval was 41 +/- 3.7 months. The estimates of overall relapse-free survival rates were 92 +/- 5% at 1 year and 77 +/- 11% at 4 years."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-ophth": {
    "equine-medicine--equine-ophth--per-organ-deep-dive": {
      "claims": [
        {
          "id": "equine-medicine--equine-ophth--per-organ-deep-dive--v1",
          "statement": "Equine recurrent uveitis (ERU) เป็นสาเหตุอันดับหนึ่งของภาวะตาบอดในม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36199161",
              "locator": "Equine Vet J 55(5):820-830",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Equine recurrent uveitis (ERU) is the leading cause of blindness for horses"
          }
        },
        {
          "id": "equine-medicine--equine-ophth--per-organ-deep-dive--v2",
          "statement": "ในตาม้าที่เป็น ERU ตรวจพบหลักฐานการติดเชื้อ Leptospira ในลูกตาสูงมาก — จาก intraocular samples ของตา ERU พบ MAT titre ตั้งแต่ 1:100 ขึ้นไป 83% และตรวจพบ leptospiral DNA ด้วย PCR 72% ขณะที่ตาปกติและตาที่อักเสบจาก uveitis สาเหตุอื่นตรวจไม่พบ antibody เลย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36006363",
              "locator": "Vet Sci 9(8):448; 1387 ERU eyes, 237 non-ERU uveitis eyes, 216 healthy controls",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In 83% of intraocular samples from ERU eyes, antibody titers of 1:100 or higher were detectable by microscopic agglutination test (MAT). ... In 72% of the intraocular specimens, leptospiral DNA was detectable by PCR. No antibodies were dete"
          }
        },
        {
          "id": "equine-medicine--equine-ophth--per-organ-deep-dive--v3",
          "statement": "Appaloosa มีโอกาสเกิด insidious ERU (การอักเสบเรื้อรังระดับต่ำในลูกตา) มากกว่าสายพันธุ์อื่น และ leopard complex spotting allele (LP) บน ECA1 เป็น genetic risk factor ที่ยืนยันซ้ำได้ใน cohort ที่สอง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31793009",
              "locator": "Anim Genet 51(1):111-116",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Appaloosas are more likely than any other breed to develop insidious ERU, distinguished by low-grade chronic intraocular inflammation, suggesting a genetic predisposition. ... In a second cohort (n = 98), only an association with the LP all"
          }
        },
        {
          "id": "equine-medicine--equine-ophth--per-organ-deep-dive--v4",
          "statement": "เชื้อแบคทีเรียที่แยกได้บ่อยที่สุดจาก equine bacterial ulcerative keratitis คือ Streptococcus equi subspecies zooepidemicus และ Pseudomonas aeruginosa — จาก 65 isolates พบ P. aeruginosa 14 ราย (22%) และ S. equi ssp. zooepidemicus 13 ราย (20%) ส่วน Staphylococcus aureus 4 ราย (6%)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14641828",
              "locator": "Vet Ophthalmol 6(4):309-13",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Streptococcus equi subspecies zooepidemicus and Pseudomonas aeruginosa were the most common organisms isolated from cases of equine bacterial keratitis referred to the University of Florida's VMTH for the years 1991-2000."
          }
        },
        {
          "id": "equine-medicine--equine-ophth--per-organ-deep-dive--v5",
          "statement": "Keratomycosis ในม้าเกิดจาก Aspergillus spp. และ Fusarium spp. เป็นหลัก — ในม้า 66 ตัว (66 ตา) เพาะเชื้อได้ Aspergillus 41 ตา (63%) และ Fusarium 24 ตา (37%) และ genus ของเชื้อราไม่สัมพันธ์กับความจำเป็นต้องผ่าตัดหรือกับการต้องควักลูกตา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27061354",
              "locator": "Vet Ophthalmol 20(2):140-146",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Aspergillus spp. was cultured from 41 eyes (63%), while 24 eyes (37%) cultured Fusarium spp. ... Genus of fungus cultured was not significantly associated with the need for surgical intervention nor was it significantly associated with the "
          }
        },
        {
          "id": "equine-medicine--equine-ophth--per-organ-deep-dive--v6",
          "statement": "Subpalpebral lavage (SPL) system ใช้ให้ยาหยอดตาบ่อย ๆ ในม้าที่เจ็บตาและไม่ยอมให้หยอด — จาก 61 ระบบ พบภาวะแทรกซ้อนรวม 8 ราย (13.1%) โดยพบใน upper eyelid 23.3% และ lower eyelid 4.2% ซึ่งความแตกต่างยังไม่ถึงระดับมีนัยสำคัญทางสถิติ (P = 0.06) และ median duration of use = 7.5 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35830905",
              "locator": "J Equine Vet Sci 117:104076",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Uneventful outcomes occurred in 53 cases (86.9%) and complications were recorded in 8 cases (13.1%). Seven complications were reported for upper eyelid systems (23.3%) and 1 complication for lower eyelid systems (4.2%). The complication rat"
          }
        }
      ]
    }
  },
  "equine-medicine--equine-poa": {
    "equine-medicine--equine-poa--pe-lameness-diagnostic-workflow-กรอบ-poa": {
      "claims": [
        {
          "id": "equine-medicine--equine-poa--pe-lameness-diagnostic-workflow-กรอบ-poa--v1",
          "statement": "Palmar digital (PD) nerve block ด้วย mepivacaine ให้ analgesia เต็มที่ในช่วง 15 นาที ถึง 1 ชั่วโมงหลังฉีด จึงต้องประเมิน lameness ในหน้าต่างเวลานี้ หลังจาก 1-2 ชั่วโมงฤทธิ์เริ่มลดลง และกลับสู่ค่าก่อน block ที่ 24 ชั่วโมง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15656504",
              "locator": "Equine Vet J 2004;36(8):723-6, Results and Conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The palmar digital nerve block was fully effective between 15 mins and 1 h. The analgesic effect began to subside between 1 and 2 h but sufficient analgesia persisted to affect gait characteristics beyond 2 h. When using a palmar digital ne"
          }
        },
        {
          "id": "equine-medicine--equine-poa--pe-lameness-diagnostic-workflow-กรอบ-poa--v2",
          "statement": "การตอบสนองต่อ perineural analgesia (palmar digital หรือ abaxial sesamoid block) บอกได้เพียงว่า pain อยู่ในเท้า แต่ไม่น่าเชื่อถือพอที่จะแยกว่า pain มาจาก distal interphalangeal joint (coffin joint) หรือจาก navicular bursa",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35488427",
              "locator": "Equine Vet J 2023;55(2):253-260, Conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Our results suggest that perineural analgesia is not reliable enough to differentiate pain originating from DIPJ and NB. Early evaluation of the DIPJ-A and NB-A can determine the origin of the pain."
          }
        },
        {
          "id": "equine-medicine--equine-poa--pe-lameness-diagnostic-workflow-กรอบ-poa--v3",
          "statement": "เมื่อทำ intra-synovial analgesia ผลของ navicular bursa block จะดีขึ้นแล้วคงที่ ส่วนผลของ distal interphalangeal joint block ยังเปลี่ยนแปลงต่อได้ถึง 10 นาที จึงควรอ่านผล DIPJ block ตั้งแต่ระยะแรก (2 และ 5 นาที)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35488427",
              "locator": "Equine Vet J 2023;55(2):253-260, Results and Conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A positive NB-A produced a high degree of improvement that remained stable, whereas the DIPJ-A improved over time... An improvement following NB-A was constant over time, but an improvement following DIPJ-A varied by up to 10 min."
          }
        }
      ]
    },
    "equine-medicine--equine-poa--poa-answer-key-station-2-lameness-video-questions": {
      "claims": [
        {
          "id": "equine-medicine--equine-poa--poa-answer-key-station-2-lameness-video-questions--v1",
          "statement": "ในม้าที่พบ radiographic abnormality ของ navicular bone 35 ตัว มี 25 ตัว (71%) ที่เห็นรอยโรคได้เฉพาะในท่า palmaroproximal-palmarodistal oblique เท่านั้น ดังนั้นการถ่ายภาพรังสียืนยัน navicular disease ต้องมีท่านี้เสมอ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8467786",
              "locator": "Equine Vet J 1993;25(2):93-8, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Radiographic abnormalities of the navicular bone in the lame or lamer limb were detected in 35 horses, all of which showed some response to analgesia of the navicular bursa. In 25 of these horses (71%) changes were only identifiable in the "
          }
        },
        {
          "id": "equine-medicine--equine-poa--poa-answer-key-station-2-lameness-video-questions--v2",
          "statement": "การให้ lameness grade แบบ subjective ตาม AAEP lameness scale มี inter-observer agreement ต่ำเมื่อ lameness เบา (mean score ≤ 1.5 agreement 61.9%, kappa 0.23) แต่สูงเมื่อ mean score > 1.5 (agreement 93.1%, kappa 0.86)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20156242",
              "locator": "Equine Vet J 2010;42(2):92-7, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "When the mean AAEP lameness score was >1.5 clinicians agreed whether or not a limb was lame 93.1% of the time (kappa= 0.86), but when the mean score was < or = 1.5 they agreed 61.9% (kappa= 0.23) of the time."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-lapove": {
    "equine-medicine--equine-lapove--title-lecturer": {
      "claims": [
        {
          "id": "equine-medicine--equine-lapove--title-lecturer--v1",
          "statement": "ข้อบ่งชี้ของ laparoscopic ovariectomy ในม้า ได้แก่ การทำหมัน (neutering) ปัญหา fertility การกำจัดพฤติกรรมผิดปกติที่สัมพันธ์กับฮอร์โมน ovarian tumour และ ovarian haematoma หรือ cyst ที่ไม่ยุบเอง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22092147",
              "locator": "Vet Surg 2011;40(8):1009-14, Methods",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Indications for surgery were neutering, fertility problems, elimination of hormone-related abnormal behavior, ovarian tumors as well as nonregressive ovarian hematomas or cysts."
          }
        }
      ]
    },
    "equine-medicine--equine-lapove--01-laparoscopic-fundamental-mis-principles": {
      "claims": [
        {
          "id": "equine-medicine--equine-lapove--01-laparoscopic-fundamental-mis-principles--v1",
          "statement": "Laparoscopic ovariectomy ทำได้ในม้ายืน sedate โดยมี morbidity ต่ำ จากรายงาน 157 ตัว มีม้าเกิดภาวะแทรกซ้อนหลังผ่าตัด 17 ตัว (10.8%) เช่น incisional drainage, incisional infection, seroma, dehiscence, ไข้ชั่วคราว และปวดท้องเล็กน้อย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22092147",
              "locator": "Vet Surg 2011;40(8):1009-14, Results and Conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Seventeen mares (10.8%) developed postoperative complications (eg, incisional drainage, incisional infection, seroma formation, dehiscence, transient fever and mild abdominal discomfort)... Laparoscopic ovariectomy in standing sedated mares"
          }
        },
        {
          "id": "equine-medicine--equine-lapove--01-laparoscopic-fundamental-mis-principles--v2",
          "statement": "ในม้าที่ผ่าตัด laparoscopic ovariectomy ภาวะแทรกซ้อนที่แผล flank พบเฉพาะในม้าที่มี ovary ขนาดมากกว่า 12 ซม. และ 15 ใน 17 ตัวนั้น (88%) ใช้ electrosurgical instrument ในการ dissect mesovarium",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22092147",
              "locator": "Vet Surg 2011;40(8):1009-14, Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "All mares with flank incisional problems had ovarian size >12 cm and in 15 (88%) of these mares electrosurgical instruments were used for mesovarial dissection."
          }
        }
      ]
    },
    "equine-medicine--equine-lapove--case-study-ovariectomy-steps": {
      "claims": [
        {
          "id": "equine-medicine--equine-lapove--case-study-ovariectomy-steps--v1",
          "statement": "Standing laparoscopic ovariectomy เข้าถึง ovary ผ่าน 3 portal ต่อข้าง คือ 2 portal ที่ paralumbar fossa และอีก 1 portal ระหว่างซี่โครงที่ 17 และ 18 ข้างเดียวกัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20459500",
              "locator": "Vet Surg 2010;39(6):737-41, Methods",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Ovaries were approached via 3 portal sites, 2 in the paralumbar fossa and a 3rd between the 17th and 18th ribs on the ipsilateral side."
          }
        },
        {
          "id": "equine-medicine--equine-lapove--case-study-ovariectomy-steps--v2",
          "statement": "Pneumoperitoneum ด้วย CO2 ที่ความดัน 15 mmHg ในม้ายืนที่ sedate ด้วย detomidine 0.02 มก./กก. ร่วมกับ butorphanol 0.02 มก./กก. IV ไม่ทำให้เกิดผลเสียต่อ cardiopulmonary function, blood gas, haematology หรือ plasma chemistry แต่กระตุ้น inflammatory response เล็กน้อยในช่องท้อง (total nucleated cell count ใน peritoneal fluid สูงขึ้นที่ 24 ชั่วโมง)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12755432",
              "locator": "Equine Vet J 2003;35(3):283-90, Methods, Results and Conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Pneumoperitoneum with CO2 during standing laparoscopy in healthy horses does not cause adverse alterations in cardiopulmonary, haematology or plasma chemistry variables, but does induce a mild inflammatory response within the peritoneal cav"
          }
        },
        {
          "id": "equine-medicine--equine-lapove--case-study-ovariectomy-steps--v3",
          "statement": "ขั้นตอนสำคัญคือทำให้ mesovarium ชาด้วยยาชาเฉพาะที่ก่อน แล้วจึงตัดแยกด้วย vessel sealing device ปล่อย ovary ค้างไว้ในช่องท้อง ก่อนนำออกในขั้นตอนถัดไป",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24962687",
              "locator": "Vet Surg 2014;43(6):663-7, Methods",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "After sedation, 3 laparoscopic portals were made in the paralumbar fossa. The mesovarium was desensitized and dissected using a vessel sealing device, and the ovary was left free in the abdomen."
          }
        }
      ]
    }
  },
  "equine-medicine--equine-farabella": {
    "equine-medicine--equine-farabella--lecture-content-จาก-pdf-preview": {
      "claims": [
        {
          "id": "equine-medicine--equine-farabella--lecture-content-จาก-pdf-preview--v1",
          "statement": "Complicated mandibular fracture ในม้าซ่อมได้ด้วย locking compression plate (LCP) osteosynthesis โดยใช้ LCP ขนาด 4.5/5.0 มม. จำนวน 1-3 แผ่นที่ด้าน ventral, lateral หรือ caudal ของ mandible (ในลูกม้าใช้ LCP 3.5 มม. 2 แผ่น) รายงาน 6 ตัวหายสนิททุกตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19151871",
              "locator": "Vet Comp Orthop Traumatol 2009;22(1):54-8, Methods and Results",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Each horse underwent locking compression plate (LCP) osteosynthesis consisting of open fracture reduction and application of one to three 4.5/5.0 mm LCP at the ventral, lateral or caudal aspect of the mandible under fluoroscopic control. Tw"
          }
        },
        {
          "id": "equine-medicine--equine-farabella--lecture-content-จาก-pdf-preview--v2",
          "statement": "Fracture ของส่วน rostral ของ mandible และ maxilla ในม้า 89 ตัว เกิด short-term complication 24 ตัว (27%) โดย soft tissue infection และ wire loosening หรือ wire failure พบบ่อยที่สุด แต่ long-term functional และ cosmetic outcome ดีในทุก fracture type และทุกวิธีซ่อม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10363097",
              "locator": "J Am Vet Med Assoc 1999;214(11):1648-52, Results and Conclusions",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Short-term complications developed in 24 of 89 (27%) horses. Soft tissue infections and wire loosening or failure were the most common short-term and long-term complications... Long-term functional and cosmetic outcomes were favorable for a"
          }
        }
      ]
    },
    "equine-medicine--equine-farabella--falabella-breed-orthopedic-relevance": {
      "claims": [
        {
          "id": "equine-medicine--equine-farabella--falabella-breed-orthopedic-relevance--v1",
          "statement": "Chondrodysplastic dwarfism ใน Miniature horse เป็น autosomal recessive disorder ที่สัมพันธ์กับ mutation ในยีน aggrecan (ACAN)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34281639",
              "locator": "J Equine Vet Sci 2021;103:103643, Introduction",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In Miniature horses, dwarfism can occur as chondrodysplastic dwarfism, an autosomal recessive disorder associated with five mutations (D1, D2, D3*, D4 and c.6465A > T variant) in the aggrecan (ACAN) gene."
          }
        },
        {
          "id": "equine-medicine--equine-farabella--falabella-breed-orthopedic-relevance--v2",
          "statement": "Miniature horse ที่เป็น chondrodysplastic dwarf ในรายงาน genotype D4/D4 มีลักษณะ domed head ที่ใหญ่ผิดสัดส่วนกับลำตัว, mandibular prognathism และขาสั้นโค้ง โดยเฉพาะบริเวณ proximal ของ metatarsal bone ภาพรังสีพบขอบ subchondral bone ของ long bone ไม่เรียบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31906815",
              "locator": "J Vet Diagn Invest 2020;32(1):99-102, Case description",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Clinically, the 2 dwarfs had a domed head that was large compared to the rest of the body, mandibular prognathism, and short and bowed limbs, mainly in the proximal region of the metatarsal bones. Radiographic examination revealed contour i"
          }
        }
      ]
    }
  },
  "poultry--first-week-mortality": {
    "poultry--first-week-mortality--common-causes-of-first-week-mortality": {
      "claims": [
        {
          "id": "poultry--first-week-mortality--common-causes-of-first-week-mortality--v1",
          "statement": "Escherichia coli ทำให้เกิด disease syndrome หลายแบบในสัตว์ปีก รวมถึง yolk sac infection (omphalitis), respiratory tract infection และ septicemia และ colisepticemia เป็นสาเหตุสำคัญที่ทำให้ first-week mortality ในลูกไก่สูงขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33752065",
              "locator": "Poult Sci 2021;100(5):101039, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Escherichia coli (E. coli) causes various disease syndromes in poultry, including yolk sac infection (omphalitis), respiratory tract infection, and septicemia."
          }
        },
        {
          "id": "poultry--first-week-mortality--common-causes-of-first-week-mortality--v2",
          "statement": "ลูกไก่ที่สะดือปิดไม่สนิท (second-grade navel คือมี residual yolk membrane หรือ black button ใหญ่กว่า 2 มม.) ตรวจพบเชื้อเจริญใน yolk sac ตั้งแต่วันลงเล้า โดยเชื้อเด่นคือ Enterococcus faecalis และการตายในสัปดาห์แรกมีสาเหตุหลักจาก E. faecalis และ Escherichia coli",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41223811",
              "locator": "Poult Sci 2025;104(12):106031, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "At placement, second-grade chicks presented bacterial growth in the yolk sac content, predominantly by Enterococcus faecalis. ... In the first week after placement, high mortality was observed, mainly due to infection with Enterococcus faec"
          }
        }
      ]
    },
    "poultry--first-week-mortality--past-exam-mapping-l14-immunology-first-week": {
      "claims": [
        {
          "id": "poultry--first-week-mortality--past-exam-mapping-l14-immunology-first-week--v1",
          "statement": "Bacterial omphalitis เป็นสาเหตุสำคัญของการตายในลูกไก่แรกฟัก โดยการสำรวจฟาร์มไก่เนื้อในอียิปต์พบอัตราการเกิด omphalitis 37.21% และแยกเชื้อ Escherichia coli, Salmonella spp. และ Staphylococcus aureus ได้จาก yolk sac ของลูกไก่ที่เป็นโรค",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38633165",
              "locator": "Open Vet J 2024;14(1):284-291, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Bacterial Omphalitis has been reported as a significant cause of mortalities in newly hatched broiler chicks. ... The overall incidence rate of omphalitis was 37.21%."
          }
        }
      ]
    },
    "poultry--first-week-mortality--pasgar-score-chick-quality-at-24h": {
      "claims": [
        {
          "id": "poultry--first-week-mortality--pasgar-score-chick-quality-at-24h--v1",
          "statement": "Pasgar score ไม่ใช่สเกล 0-5 คะแนน งานตีพิมพ์รายงานค่า Pasgar score เฉลี่ยสูงกว่า 5 ได้ เช่น 9.21 บวกลบ 0.89 ในกลุ่มไข่ฟักที่ฆ่าเชื้อด้วย clove essential oil",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33142469",
              "locator": "Poult Sci 2020;99(11):5509-5516, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In the Pasgar© score assessment, it was determined that the clove essential oil (9.21 ± 0.89%) had a superior effect on the physical quality of the chicks compared with the effects of the other treatments."
          }
        },
        {
          "id": "poultry--first-week-mortality--pasgar-score-chick-quality-at-24h--v2",
          "statement": "ค่าเฉลี่ย Pasgar score ของฝูงไม่มีความสัมพันธ์กับการเจริญเติบโตหรืออัตราตายหลังฟัก โดย navel quality ที่ไม่ดีเป็น quality trait เดียวที่สัมพันธ์กับการโตช้าหลังฟัก และลูกไก่เกรด 2 (Q2) มีอัตราตายถึง 62.50% ที่อายุ 7 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22717141",
              "locator": "Animal 2012;6(10):1677-83, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There were no correlations between mean Pasgar©score and post-hatch growth or mortality, and suboptimal navel quality was the only quality trait associated with lower post-hatch growth. ... early mortality in Q2 chicks was high (62.50% at 7"
          }
        }
      ]
    },
    "poultry--first-week-mortality--first-week-mortality-targets": {
      "claims": [
        {
          "id": "poultry--first-week-mortality--first-week-mortality-targets--v1",
          "statement": "first week mortality (FWM) ที่วัดได้จริงในฟาร์มการค้าอยู่ในระดับประมาณ 1% โดยค่าเฉลี่ยของ Ross 308 เท่ากับ 1.40% และของสายพันธุ์โตช้ากว่าอย่าง Hubbard JA787 เท่ากับ 0.76%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38198918",
              "locator": "Poult Sci 2023;103(3):103395, abstract; retrospective cohort of 64,651,804 broilers from 4,228 flocks",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Descriptively, there were notable differences in mortality at all stages of the production cycle, with higher mean mortalities in Ross 308 (1.40% FWM, 3.05% MAFW, and 0.063% DOA) than in Hubbard JA787 (0.76% FWM, 1.49% MAFW, and 0.015% DOA)"
          }
        }
      ]
    }
  },
  "poultry--biosecurity": {
    "poultry--biosecurity--bio-exclusion-vs-bio-containment": {
      "claims": [
        {
          "id": "poultry--biosecurity--bio-exclusion-vs-bio-containment--v1",
          "statement": "bio-exclusion คือมาตรการกันไม่ให้โรคเข้าฟาร์ม ส่วน biocontainment คือมาตรการกันไม่ให้โรคแพร่ออกไปหลังจากสงสัยหรือตรวจพบโรคแล้ว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18411931",
              "locator": "Dev Biol (Basel) 2007;130:13-21, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "biosecurity (bio-exclusion to keep the disease out and biocontainment to keep the disease from spreading once suspected or detected)"
          }
        }
      ]
    },
    "poultry--biosecurity--3-levels-of-biosecurity": {
      "claims": [
        {
          "id": "poultry--biosecurity--3-levels-of-biosecurity--v1",
          "statement": "การประเมิน biosecurity ในฟาร์มสัตว์ปีกแบ่งคะแนนออกเป็น 3 ระดับ คือ conceptual, structural และ operational (ตรงกับ procedural ในโน้ต)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39912880",
              "locator": "Vet Med Sci 2025;11(2):e70232, abstract; survey of 400 poultry farms",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The mean conceptual, structural and operational biosecurity scores obtained by the farms were 4.7 ± 1.2, 11.6 ± 2.7 and 17.1 ± 4.1, respectively."
          }
        },
        {
          "id": "poultry--biosecurity--3-levels-of-biosecurity--v2",
          "statement": "downtime ระหว่างรุ่นที่สั้นกว่า 7 วัน เป็นปัจจัยเสี่ยงที่มีนัยสำคัญต่อการติดเชื้อ Campylobacter ในฟาร์มไก่เนื้อ ร่วมกับโรงเรือนอายุเกิน 5 ปี และการไม่ฆ่าเชื้อรอบโรงเรือนระหว่างเลี้ยง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32460154",
              "locator": "Prev Vet Med 2020;180:105034, abstract; 84 farms, multivariable logistic regression",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In risk factor analysis, the following factors were found to be significantly associated with Campylobacter infection: shed older than five years, birds older than 30 days, flock size with more than 1500 birds, downtime less than seven days"
          }
        }
      ]
    },
    "poultry--biosecurity--key-disinfectants": {
      "claims": [
        {
          "id": "poultry--biosecurity--key-disinfectants--v1",
          "statement": "ต้องทำความสะอาดเอา organic matter ออกก่อนใช้น้ำยาฆ่าเชื้อเสมอ เพราะการมี organic matter อยู่ทำลายฤทธิ์ virucidal ของ sodium hypochlorite ได้จนหมด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30178730",
              "locator": "Epidemiol Infect 2018;146(15):2010-2013, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Results also confirm the importance of cleaning before disinfection since the presence of organic matter totally abrogated the virucidal activity of sodium hypochlorite solutions against the three CPV-2 strains."
          }
        }
      ]
    },
    "poultry--biosecurity--sampling-for-surveillance": {
      "claims": [
        {
          "id": "poultry--biosecurity--sampling-for-surveillance--v1",
          "statement": "boot swab หรือ boot sock เป็นชนิดตัวอย่างที่ไวที่สุดสำหรับการตรวจหา Salmonella ในระดับฟาร์มไก่เนื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23624481",
              "locator": "Appl Environ Microbiol 2013;79(13):4106-14, abstract; prospective cohort of 55 commercial broiler flocks",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Boot socks were the most sensitive sample type for detection of Salmonella on the farm, whereas litter samples had the strongest association with Salmonella loads in pre- and postchill carcass rinses."
          }
        },
        {
          "id": "poultry--biosecurity--sampling-for-surveillance--v2",
          "statement": "จำนวนตัวอย่างที่เก็บมีผลโดยตรงต่อโอกาสตรวจพบโรค การเก็บ boot swab 5 คู่ทำให้โอกาสตรวจพบฝูงพ่อแม่พันธุ์ที่ติด Salmonella ภายใน 3 สัปดาห์แรกหลังติดเชื้อสูงขึ้นชัดเจน เทียบกับการเก็บเพียง 2 คู่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33173102",
              "locator": "Sci Rep 2020;10(1):19441, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Results suggested that after 10 and 100 infected hens were seeded, the likelihood of detecting an infected parent flock within the three first weeks after the infection was strongly influenced by the taking of five boot swabs (95% CI 70-100"
          }
        }
      ]
    }
  },
  "poultry--avian-drugs": {
    "poultry--avian-drugs--pk-pd-principles": {
      "claims": [
        {
          "id": "poultry--avian-drugs--pk-pd-principles--v1",
          "statement": "PK/PD index ที่ใช้เป็น routine ในสัตวแพทย์มี 2 ตัว คือ fAUC/MIC (สัดส่วน AUC ของยาอิสระในพลาสมาต่อ MIC) และ fT>MIC (ระยะเวลาที่ระดับยาอิสระในพลาสมาสูงกว่า MIC ตลอด dosing interval) โดย MIC เป็นค่าหลักที่ใช้สร้าง index เหล่านี้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33089523",
              "locator": "J Vet Pharmacol Ther 2021;44(2):172-200, abstract and PK/PD principles overview",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Two PK/PD indices are routinely used in veterinary medicine ... (fAUC/MIC) and the time that free plasma concentration exceeds the MIC over the dosing interval (fT > MIC)."
          }
        }
      ]
    },
    "poultry--avian-drugs--antimicrobial-classification": {
      "claims": [
        {
          "id": "poultry--avian-drugs--antimicrobial-classification--v1",
          "statement": "Enrofloxacin ซึ่งเป็น fluoroquinolone ถูกประเมินด้วย concentration-dependent indices — ในไก่เนื้อที่ได้ยา 10 mg/kg ต่อ Salmonella Enteritidis ได้ Cmax/MIC90 = 7.64 (ป้อน PO) และ 13.48 (IV) และ 24-h AUC/MIC90 ประมาณ 42 ทั้งสองเส้นทาง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30944537",
              "locator": "J Vet Sci 2019;20(2):e15, PK/PD integration results in abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The C/MICwere 7.64 ± 0.2 and 13.48 ± 0.7 and the 24 h AUC/MICwere 41.68 ± 0.1 and 42.26 ± 0.3 after administering the drug through PO and IV routes"
          }
        }
      ]
    },
    "poultry--avian-drugs--banned-drugs-thailand-poultry": {
      "claims": [
        {
          "id": "poultry--avian-drugs--banned-drugs-thailand-poultry--v1",
          "statement": "Chloramphenicol (CAP) ถูกคณะกรรมการร่วม FAO/WHO แนะนำให้ห้ามใช้ในสัตว์ที่ให้ผลผลิตเป็นอาหาร เนื่องจากอันตรายต่อสาธารณสุข ได้แก่ aplastic anaemia, leukaemia, allergy, antibacterial resistance และ carcinogenicity",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25208093",
              "locator": "Food Addit Contam Part A 2014;31(11):1834-9, abstract (rationale for the CAP ban)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "recommended banning the use of chloramphenicol (CAP) in food animals due to its public health hazards of aplastic anaemia, leukaemia, allergy, antibacterial resistance and carcinogenicity"
          }
        },
        {
          "id": "poultry--avian-drugs--banned-drugs-thailand-poultry--v2",
          "statement": "Nitrofurans เช่น furaltadone ถูกห้ามใช้ในการเลี้ยงปศุสัตว์ในหลายประเทศรวมทั้ง EU เพราะกังวลฤทธิ์ก่อมะเร็งในคน และ tissue-bound metabolite ยังตกค้างข้าม withdrawal — หลังหยุดยา 3 สัปดาห์ยังตรวจพบ AMOZ 270 µg/kg ในเนื้อ, 80 µg/kg ในตับ และ 331 µg/kg ในกึ๋น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22011291",
              "locator": "J Agric Food Chem 2011;59(22):11927-34, depletion results in abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "concentrations of 270 μg/kg in meat, 80 μg/kg in liver, and 331 μg/kg in gizzard were determined ... 3 weeks after withdrawal of treatment"
          }
        }
      ]
    },
    "poultry--avian-drugs--drug-withdrawal-period": {
      "claims": [
        {
          "id": "poultry--avian-drugs--drug-withdrawal-period--v1",
          "statement": "Withdrawal time ของ enrofloxacin ในไก่ขึ้นกับสายพันธุ์ — หลังป้อน 10 mg/kg นาน 5 วัน สายขนขาว (AA broiler, WOD168) ได้ WT ประมาณ 2.30-2.64 วัน ขณะที่สายขนเหลืองและไก่กระดูกดำได้ 8.16-39.74 วัน โดย skin with fat เป็น limiting tissue",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42056824",
              "locator": "Poult Sci 2026;105(7):107002, withdrawal-time estimates (EMA 95/95 approach, residues expressed as ENR plus CIP)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Overall WTs were 2.30 to 2.64 days for white-feathered lines and 8.16 to 39.74 days for yellow-feathered breeds"
          }
        }
      ]
    },
    "poultry--avian-drugs--common-conditions-first-line-drugs": {
      "claims": [
        {
          "id": "poultry--avian-drugs--common-conditions-first-line-drugs--v1",
          "statement": "Mycoplasma gallisepticum และ M. synoviae ที่แยกได้จากไก่ในเอเชีย (รวมไทย) ส่วนใหญ่ยังมี MIC ต่ำต่อ tetracyclines, tiamulin และ tylvalosin แต่พบ isolate ที่ tilmicosin MIC ≥64 µg/ml และ isolate ที่ tilmicosin MIC สูงทุกตัวมี tylosin MIC สูงร่วมด้วย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33068825",
              "locator": "Vet Microbiol 2020;250:108840, MIC results (37 isolates from 7 Asian countries including Thailand)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Increased tilmicosin MICs were observed in both M. synoviae and M. gallisepticum isolates (≥64 μg/ml MICvalues) and this was seen in all isolates with high tylosin MICs."
          }
        }
      ]
    }
  },
  "poultry--quality-assurance": {
    "poultry--quality-assurance--five-domains-model-newer-2020": {
      "claims": [
        {
          "id": "poultry--quality-assurance--five-domains-model-newer-2020--v1",
          "statement": "Five Domains Model ฉบับปี 2020 ประกอบด้วย 1 Nutrition, 2 Physical Environment, 3 Health, 4 Behavioural Interactions และ 5 Mental State โดย domain ที่ 1-4 ชี้ปัจจัยที่ก่อ affect ทั้งลบและบวก ซึ่งไปประเมินรวมที่ domain 5 (Mental State)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33066335",
              "locator": "Animals (Basel) 2020;10(10):1870, description of the five domains in the abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The domains of the most up-to-date Model described here are: 1 Nutrition, 2 Physical Environment, 3 Health, 4 Behavioural Interactions and 5 Mental State."
          }
        }
      ]
    },
    "poultry--quality-assurance--key-metrics": {
      "claims": [
        {
          "id": "poultry--quality-assurance--key-metrics--v1",
          "statement": "อุบัติการณ์ contact dermatitis (footpad dermatitis และ hock burn) ในไก่เนื้อถูกกำหนดโดย litter moisture content เป็นหลัก และโดย growth rate เป็นปัจจัยรอง จึงใช้ FPD score เป็น welfare KPI ที่สะท้อนคุณภาพวัสดุรองพื้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35245808",
              "locator": "Poult Sci 2022;101(4):101768, conclusions on contact dermatitis (14 strains, 7,216 birds, 164 pens)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the overall high litter moisture content and to a lesser extent growth rate influenced the incidence of contact dermatitis"
          }
        },
        {
          "id": "poultry--quality-assurance--key-metrics--v2",
          "statement": "Slow-growth trade-off เป็นตัวเลขที่วัดได้ — ไก่สายพันธุ์ conventional ถึงน้ำหนักเป้าหมาย ~2.1 kg ที่ 34 วัน ขณะที่สายโตช้าใช้ 48 วัน และที่ ~3.2 kg ใช้ 48 วัน เทียบกับ 62 วัน โดยสาย conventional มีอุบัติการณ์ footpad dermatitis สูงกว่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35245808",
              "locator": "Poult Sci 2022;101(4):101768, target-weight schedule (TW1 and TW2) and FPD incidence",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "(TW1: 34 d for CONV and 48 d for SG strains) and 3.2 kg (TW2: 48 d for CONV and 62 d for SG strains)"
          }
        },
        {
          "id": "poultry--quality-assurance--key-metrics--v3",
          "statement": "เกณฑ์ USDA จัดไข่เป็นคุณภาพ AA เมื่อค่า Haugh unit ตั้งแต่ 72 ขึ้นไป โดย Haugh unit คำนวณจาก albumen height ปรับตามน้ำหนักไข่",
          "evidenceStatus": "expert-consensus",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-united-states-departme-na",
              "locator": "ส่วนว่าด้วย interior quality / albumen quality ที่ให้ค่า Haugh unit สำหรับคุณภาพ AA (72 ขึ้นไป). ไม่ยืนยันเลขหน้าและปีของฉบับปรับปรุงล่าสุด — ควรตรวจกับฉบับปัจจุบันของ USDA AMS ก่อนอ้างเลขหน้า",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": ""
          }
        }
      ]
    },
    "poultry--quality-assurance--egg-quality-parameters": {
      "claims": [
        {
          "id": "poultry--quality-assurance--egg-quality-parameters--v1",
          "statement": "Albumen height, Haugh unit และค่าคุณภาพไข่แดง สูงสุดที่สัปดาห์ที่ 0 และต่ำสุดที่สัปดาห์ที่ 12 ของการเก็บแบบ cold storage โดยอัตราการเสื่อมไม่แตกต่างกันระหว่างระบบเลี้ยง conventional cage, enriched colony cage และ cage-free aviary",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24795324",
              "locator": "Poult Sci 2014;93(5):1282-8, quality change over 12 weeks of cold storage",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Albumen height, Haugh unit, and yolk quality measurements were all greatest at 0 and lowest at 12 wk of storage"
          }
        }
      ]
    },
    "poultry--quality-assurance--gap-haccp-iso-standards": {
      "claims": [
        {
          "id": "poultry--quality-assurance--gap-haccp-iso-standards--v1",
          "statement": "HACCP ตาม Codex ประกอบด้วย 7 principles — วิเคราะห์อันตราย, กำหนด CCP, กำหนด critical limit, กำหนดระบบ monitoring, กำหนด corrective action, ทำ validation และ verification, และจัดทำเอกสารและบันทึก",
          "evidenceStatus": "expert-consensus",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "guide-codex-alimentarius-com-2020",
              "locator": "Chapter Two, Hazard Analysis and Critical Control Point (HACCP) System and Guidelines for its Application, section listing the seven HACCP principles. ไม่ยืนยันเลขข้อย่อยที่แน่นอน (ตัวเอกสารมีการปรับปรุงปี 2020 และแก้ไขเพิ่มเติมหลังจากนั้น)",
              "kind": "guideline"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": ""
          }
        }
      ]
    }
  },
  "poultry--avian-zoonosis": {
    "poultry--avian-zoonosis--avian-influenza-hpai-detail": {
      "claims": [
        {
          "id": "poultry--avian-zoonosis--avian-influenza-hpai-detail--v1",
          "statement": "การติดเชื้อ avian influenza H5N1 ในคนเกือบทั้งหมดมาจากการสัมผัสสัตว์ปีก จากผู้ป่วยยืนยัน 856 รายใน 5 ประเทศ (อินโดนีเซีย กัมพูชา เวียดนาม จีน อียิปต์) ช่วง พ.ค. 1997 ถึง พ.ย. 2017 พบว่า 96.1% มีประวัติ poultry exposure และ case fatality rate รวม = 52.8% (452/856 ราย)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29886690",
              "locator": "Abstract, results; 52(6):661-667",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "A total of 856 cases were reported in five countries with Egypt had the most cases (44.3%). ... 96.1% of cases had the history of poultry exposure. ... 452 death cases were reported in five countries, and the fatality rate was 52.8%."
          }
        },
        {
          "id": "poultry--avian-zoonosis--avian-influenza-hpai-detail--v2",
          "statement": "H7N9 ในคนสัมพันธ์กับการสัมผัส live poultry market เป็นหลัก โดยในมณฑลเจ้อเจียง ประเทศจีน ผู้ป่วยระลอกแรก (มี.ค. ถึง เม.ย. 2013) 80% และระลอกสอง (ต.ค. 2013 ถึง ก.พ. 2014) 66% มีประวัติสัมผัสตลาดค้าสัตว์ปีกมีชีวิต ส่วน case fatality rate = 22% และ 42% ตามลำดับ (P = 0.023)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25286879",
              "locator": "Abstract, results; 143(9):1839-45",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The case-fatality rate was 22% in the first wave and 42% in the second (P = 0.023). ... The proportion of those exposed to live poultry markets were 80% and 66%, respectively."
          }
        }
      ]
    },
    "poultry--avian-zoonosis--major-avian-zoonoses-bacterial": {
      "claims": [
        {
          "id": "poultry--avian-zoonosis--major-avian-zoonoses-bacterial--v1",
          "statement": "Salmonella Enteritidis colonize ovary และ preovulatory follicles ของแม่ไก่ไข่ได้สูงกว่า serovar อื่นอย่างมีนัยสำคัญ (P < 0.05, เทียบ 6 serovars) และตรวจพบเชื้อในไข่แดงของไข่ที่ออกมา 7.0% ซึ่งเป็นหลักฐานสนับสนุนการปนเปื้อนไข่แบบ transovarian",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11332500",
              "locator": "Abstract, results; 45(1):61-9",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Salmonella enteritidis was recovered from three yolks of the laid eggs (7.0%), suggesting egg contamination from the transovarian transmission of S. enteritidis. ... the ovary and preovulatory follicles were colonized by S. enteritidis with"
          }
        },
        {
          "id": "poultry--avian-zoonosis--major-avian-zoonoses-bacterial--v2",
          "statement": "ไก่เนื้อ (broiler) เป็นแหล่งหลักของ Campylobacter ที่ทำให้เกิด food poisoning ในคน และ Campylobacter jejuni เป็นสปีชีส์เด่น คิดเป็น 94.5% ของ isolates ทั้งหมด 1,102 ตัวอย่างจากไก่เนื้อ โค สุกร และสุนัข ในเดนมาร์ก (สุ่มเก็บปี 2015 ถึง 2021)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37672837",
              "locator": "Abstract, background and results; 102(11):103025",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Campylobacter is a common cause of food poisoning in many countries, with broilers being the main source. ... The data included 1,102 isolates from free-range (n = 209), conventional broilers (n = 577), cattle (n = 261), pigs (n = 30), and "
          }
        },
        {
          "id": "poultry--avian-zoonosis--major-avian-zoonoses-bacterial--v3",
          "statement": "Chlamydia psittaci ทำให้เกิด chlamydiosis ในนก และเป็นสาเหตุของ zoonotic psittacosis ในคน โดยในการสอบสวนการระบาดที่ร้านขายและเพาะพันธุ์นกในรัฐวอชิงตัน (นกราว 1,000 ตัว) นก psittacine ทุกตัวได้รับ oral doxycycline นาน 45 วัน ร่วมกับปิดสถานที่เพื่อฆ่าเชื้อสิ่งแวดล้อม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37157946",
              "locator": "Abstract, methods and results; 70(6):572-577",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Chlamydia psittaci is a bacterium that causes chlamydiosis in birds and can cause zoonotic psittacosis in people. ... The facility was closed for environmental disinfection, and all psittacines were treated with oral doxycycline for 45 days"
          }
        }
      ]
    },
    "poultry--avian-zoonosis--major-avian-zoonoses-viral": {
      "claims": [
        {
          "id": "poultry--avian-zoonosis--major-avian-zoonoses-viral--v1",
          "statement": "คนติดเชื้อ avian paramyxovirus type 1 (Newcastle disease virus) ได้น้อยมาก และผู้ที่ติดส่วนใหญ่มีอาการเป็น mild conjunctivitis แต่มีรายงานเด็กอายุ 2 ปีที่ภูมิคุ้มกันบกพร่องเกิด neurologic infection จาก pigeon variant ของ APMV-1 แล้วเสียชีวิต ดังนั้นการเรียกว่า self-limiting จึงจริงเฉพาะกรณีทั่วไป ไม่ใช่ทุกกรณี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37987582",
              "locator": "Abstract; 29(12):2482-2487",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Humans are rarely affected; those who are predominantly experience mild conjunctivitis. We report a fatal case of neurologic disease in a 2-year-old immunocompromised child in Australia."
          }
        }
      ]
    }
  },
  "poultry--nutrition": {
    "poultry--nutrition--energy-requirements-me-ที่สำคัญ": {
      "claims": [
        {
          "id": "poultry--nutrition--energy-requirements-me-ที่สำคัญ--v1",
          "statement": "การลดความหนาแน่นพลังงาน (ME) ในสูตรอาหารไก่เนื้อ ทำให้ feed intake เพิ่มขึ้น และ FCR สูงขึ้น (คือแย่ลง) สอดคล้องกับหลักที่ว่าไก่กินอาหารเพื่อให้ได้พลังงานตามความต้องการ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38096665",
              "locator": "Poult Sci 103(2):103260",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The results indicated that the LND diet led to greater average daily feed intake (ADFI) from d 1 to 42 and feed conversion ratio (FCR) from d 22 to 42 (P < 0.05)."
          }
        }
      ]
    },
    "poultry--nutrition--protein-amino-acids": {
      "claims": [
        {
          "id": "poultry--nutrition--protein-amino-acids--v1",
          "statement": "Methionine เป็น first limiting amino acid ในอาหารไก่เนื้อที่ใช้ข้าวโพดและกากถั่วเหลืองเป็นวัตถุดิบหลัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35278757",
              "locator": "Poult Sci 101(5):101762",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Methionine (Met) is the first limiting amino acid in corn and soybean meal-based diets (containing L-Met) in broiler chickens, which are often supplemented with synthetic DL-Met or DL-Hydroxy Met (OH-Met)."
          }
        },
        {
          "id": "poultry--nutrition--protein-amino-acids--v2",
          "statement": "ใน ideal amino acid profile ของไก่ ใช้ Lysine เป็นตัวอ้างอิงเท่ากับ 100 แล้วแสดงกรดอะมิโนตัวอื่นเป็นสัดส่วนเทียบกับ Lysine",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26479521",
              "locator": "Animals (Basel) 3(3):558-73",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the derived amino acid efficiency data were utilized to derive ideal amino acid ratios for the starter period: Lys (100): Thr (60): Trp (19): Arg (105): Ile (55): Val (63); and the grower period: Lys (100): Thr (62): Trp (17): Arg (105): Il"
          }
        }
      ]
    },
    "poultry--nutrition--minerals-calcium-phosphorus-สำคัญมาก": {
      "claims": [
        {
          "id": "poultry--nutrition--minerals-calcium-phosphorus-สำคัญมาก--v1",
          "statement": "ในไก่ไข่ช่วงท้ายของการให้ผลผลิต แหล่งแคลเซียมที่มีอนุภาคหยาบเป็นสัดส่วนสูง (ประมาณสองในสามเป็นอนุภาคใหญ่ เช่น หินเกล็ดหรือเปลือกหอย) ให้คุณภาพเปลือกไข่ ทั้งน้ำหนักเปลือก ความหนา และความแข็งแรง ดีกว่าสูตรที่ใช้หินป่นละเอียดในสัดส่วนสูง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17364543",
              "locator": "Br Poult Sci 48(1):71-5",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "As a source of calcium in this stage of production, a feed mixture containing two-thirds large particles should be used (limestone grit or oyster shell)."
          }
        }
      ]
    },
    "poultry--nutrition--feed-processing-grinding-pelleting-crumbling": {
      "claims": [
        {
          "id": "poultry--nutrition--feed-processing-grinding-pelleting-crumbling--v1",
          "statement": "การแปรรูปอาหารเป็น crumble หรือ pellet ช่วยลด selective feeding และให้ FCR กับน้ำหนักตัวดีกว่าอาหารรูป mash ในไก่เนื้อระยะแรก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25881586",
              "locator": "Poult Sci 94(7):1549-56",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Crumble diets improved FCR at 14 d, but CC worsened FCR. ... These data demonstrated that pelleting and crumbling reduced the impact of CC, produced a more consistent feed intake, and reduced selective feeding, and that CC stimulated gizzar"
          }
        }
      ]
    },
    "poultry--nutrition--antinutritional-factors-สารต่อต้านในวัตถุดิบ": {
      "claims": [
        {
          "id": "poultry--nutrition--antinutritional-factors-สารต่อต้านในวัตถุดิบ--v1",
          "statement": "Aflatoxin ในอาหารที่ระดับตั้งแต่ 1 mg/kg (1 ppm) ขึ้นไป ทำให้ไก่เนื้อเจริญเติบโตลดลงอย่างรุนแรงและกดการตอบสนองทางภูมิคุ้มกัน โดยที่ระดับ 2 mg/kg พบน้ำหนักสัมพัทธ์ของตับเพิ่มขึ้นและ bursa of Fabricius ลดลง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15484726",
              "locator": "Br Poult Sci 45(4):512-8",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "AF at a dietary concentration of 1 mg/kg or more and OA at 2 mg/kg or more, either alone or in combination, caused severe reductions in growth and immune response."
          }
        }
      ]
    }
  },
  "repro-lect--semen-ai": {
    "repro-lect--semen-ai--semen-evaluation-framework": {
      "claims": [
        {
          "id": "repro-lect--semen-ai--semen-evaluation-framework--v1",
          "statement": "ในสุนัข fertility ลดลงชัดเจนเมื่อ normal sperm morphology < 60% — dog ที่มี normal morphology > 60% ให้ fertility 61% (14/23 bitches) ขณะที่ dog ที่ < 60% ให้ fertility เพียง 13% (2/15 bitches)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-8229933",
              "locator": "vol 47, pp 257-260",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The percentage normal morphology below which fertility was adversely affected was found to be 60%: the fertility of dogs with > 60% normal morphology was 61% (14 of 23 inseminated bitches) whereas the fertility of dogs with < 60% normal mor"
          }
        }
      ]
    },
    "repro-lect--semen-ai--ai-quality-threshold": {
      "claims": [
        {
          "id": "repro-lect--semen-ai--ai-quality-threshold--v1",
          "statement": "สำหรับ frozen-thawed dog semen การ inseminate ด้วย progressively motile normal spermatozoa (PMNS) > 150 x 10^6 ให้ pregnancy rate สูงกว่าการใช้ < 100 x 10^6 อย่างมีนัยสำคัญ (76% เทียบกับ 52%, p = .003)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27885720",
              "locator": "vol 52 Suppl 2, pp 275-280",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "When stratified by PMNS, pregnancy rates were as follows: >150 x 10PMNS - 76% (110/145), 100-150 x 10- 68% (87/128) and <100 x 10PMNS - 52% (41/79). Pregnancy rate was significantly higher when >150 x 10PMNS (p = .003) or 100-150 x10PMNS (p"
          }
        }
      ]
    },
    "repro-lect--semen-ai--ovulation-timing-aj-kc": {
      "claims": [
        {
          "id": "repro-lect--semen-ai--ovulation-timing-aj-kc--v1",
          "statement": "ค่าเฉลี่ย serum progesterone ที่ estimated LH surge (LH0) = 2.7 ± 0.6 ng/mL และที่ estimated ovulation (LH+2) = 4.8 ± 0.9 ng/mL, LH+3 = 7.2 ± 1.3 ng/mL (จาก 1,420 estrous cycles, ไม่ต่างกันตาม breed หรือ body weight)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30388469",
              "locator": "vol 125, pp 37-42",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The mean (±SD) progesterone concentration at estimated LH0 was 2.7 ± 0.6 ng/ml and at the time of estimated ovulation it was 4.8 ± 0.9 ng/ml and 7.2 ± 1.3 ng/ml (LH+2 and LH+3 respectively)."
          }
        },
        {
          "id": "repro-lect--semen-ai--ovulation-timing-aj-kc--v2",
          "statement": "ช่วงเวลาจาก preovulatory LH surge ถึง ovulation ประมาณ 2 วัน และถึง post-ovulatory oocyte maturation ประมาณ 4 วัน ซึ่งเป็นช่วงที่แปรปรวนน้อยมากระหว่างตัว ต่างจาก duration ของ proestrus (3-21 วัน) และ estrus (3-21 วัน) ที่แปรปรวนสูง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-2695640",
              "locator": "vol 39, pp 3-25",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "However, there appears to be very little variation in the intervals from LH surge to ovulation (2 days), to post-ovulatory oocyte maturation (approximately 4 days), to implantation (approximately 18 days), to selected developmental stages o"
          }
        }
      ]
    },
    "repro-lect--semen-ai--vaginal-cytology-by-cycle-stage": {
      "claims": [
        {
          "id": "repro-lect--semen-ai--vaginal-cytology-by-cycle-stage--v1",
          "statement": "Day 6 rule: ovulation เกิดก่อน Day 1 ของ diestrus (นิยามจาก vaginal cytology) เฉลี่ย 6.8 ± 1.4 วัน จึงใช้ Day 1 ย้อนคำนวณวันตกไข่ได้ (retrospective estimate)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16726929",
              "locator": "vol 35(3), pp 603-611",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Based on vaginal cytology, ovulation took place 6.9 +/- 1.6 d (n = 15) after 80% of the squamous cells were superficial and 6.8 +/- 1.4 d (n = 16) before Day 1."
          }
        }
      ]
    },
    "repro-lect--semen-ai--ai-routes": {
      "claims": [
        {
          "id": "repro-lect--semen-ai--ai-routes--v1",
          "statement": "Endoscopic-assisted transcervical intrauterine insemination (EIU) ด้วย frozen-thawed semen ให้ pregnancy rate สูงกว่า laparotomy (surgical) insemination อย่างมีนัยสำคัญ (65% เทียบกับ 45%, P < 0.05) และไม่พบ complication ในกลุ่ม EIU",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25082020",
              "locator": "vol 82(6), pp 844-850",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Overall, pregnancy rate was greater (P < 0.05) in the EIU group (65%) than in the SIU group (45%). ... Complications in the SIU group included anesthetic-induced bradycardia during surgery, significant postsurgery pain, seroma formation ove"
          }
        }
      ]
    }
  },
  "repro-lect--semen-preservation": {
    "repro-lect--semen-preservation--what-can-be-cryopreserved": {
      "claims": [
        {
          "id": "repro-lect--semen-preservation--what-can-be-cryopreserved--v1",
          "statement": "Sperm cryopreservation ในสุนัขใช้ได้จริงในระดับสูง — frozen-thawed dog semen ให้ overall pregnancy rate 84% (21/25) ซึ่งใกล้เคียงกับที่คาดหวังได้จาก well controlled natural mating",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10729025",
              "locator": "vol 51(6), pp 1045-1058",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The overall pregnancy rate of 84% (21/25) was close to what can be expected from well controlled natural matings."
          }
        }
      ]
    },
    "repro-lect--semen-preservation--cryobiology-logic": {
      "claims": [
        {
          "id": "repro-lect--semen-preservation--cryobiology-logic--v1",
          "statement": "Conventional canine freezing protocol ใช้ egg yolk 20% ร่วมกับ glycerol 5% (final concentration) ที่ความเข้มข้น sperm 100 x 10^6/mL",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22681386",
              "locator": "vol 48(1), pp 165-170",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The first aliquot (C, control) was frozen in liquid nitrogen using a conventional protocol to reach a final concentration of 100 x 10(6) spermatozoa/ml, 20% egg yolk and 5% glycerol."
          }
        }
      ]
    },
    "repro-lect--semen-preservation--egg-yolk-extender-เด่น-aj-tt": {
      "claims": [
        {
          "id": "repro-lect--semen-preservation--egg-yolk-extender-เด่น-aj-tt--v1",
          "statement": "Egg yolk ใน freezing extender ใช้ปกป้อง spermatozoa จาก cold shock และฤทธิ์ป้องกันนี้เชื่อกันเป็นหลักว่ามาจาก low density lipoproteins (LDL); LDL ที่สกัดแล้วให้ผลดีที่สุดที่ความเข้มข้น 8% ใน bull semen extender",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12035979",
              "locator": "vol 57(6), pp 1695-1706",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Hen egg yolk is widely used as a cryoprotective agent in semen freezing extenders in order to protect the spermatozoa against cold shock. The protective action of yolk is largely presumed to be due to low density lipoproteins (LDL). ... The"
          }
        }
      ]
    },
    "repro-lect--semen-preservation--cryopreservation-workflow": {
      "claims": [
        {
          "id": "repro-lect--semen-preservation--cryopreservation-workflow--v1",
          "statement": "Thaw เร็วที่ 70°C นาน 8 วินาที ให้ post-thaw survival และ thermoresistance ของ dog spermatozoa ดีกว่า thaw ที่ 37°C นาน 15 วินาที อย่างมีนัยสำคัญ (P < 0.0001)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11097040",
              "locator": "vol 54(6), pp 859-875",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The best post-thaw survival and thermoresistance of spermatozoa was obtained when Equex was present in the extender (P<0.0001); the semen dilution was performed in 2 steps instead of 1 (P<0.0001); the freezing was carried out using the box "
          }
        },
        {
          "id": "repro-lect--semen-preservation--cryopreservation-workflow--v2",
          "statement": "Deep freezing ด้วย computerized freezing machine ที่ควบคุม freezing curve ให้ post-thaw motility และ viability ของ dog spermatozoa ดีกว่าการแช่แข็งใน styrofoam box เหนือไอ LN2 เพราะอุณหภูมิภายใน straw แกว่งน้อยกว่า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16359725",
              "locator": "vol 66(2), pp 173-182",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Deep freezing in the machine resulted in better motility and viability than in the box. The combination centrifugation-Uppsala extender-machine was superior to all other combinations, which was most evident after storage at +5 degrees C for"
          }
        }
      ]
    }
  },
  "repro-lect--hormonal-applications": {
    "repro-lect--hormonal-applications--aglepristone-3-indications-หลัก": {
      "claims": [
        {
          "id": "repro-lect--hormonal-applications--aglepristone-3-indications-หลัก--v1",
          "statement": "Protocol การรักษา open-cervix pyometra ในสุนัขด้วย aglepristone คือ 10 mg/kg SC ในวันที่ 1, 2 และ 8 หลังวินิจฉัย โดยอาจให้ร่วมกับ cloprostenol 1 µg/kg",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39287059",
              "locator": "48(1):22-29, Materials and methods (treatment groups)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Antigestagen (10 mg/kg aglepristone on Days 1, 2, and 8 after diagnosis; n = 5), and Antigestagen + luteolytic (aglepristone plus 1 μg/kg of cloprostenol from Days 1-7; n = 5)"
          }
        }
      ]
    },
    "repro-lect--hormonal-applications--progestin-adverse-effects-ออก-2-ล้านข้อ-จำไป": {
      "claims": [
        {
          "id": "repro-lect--hormonal-applications--progestin-adverse-effects-ออก-2-ล้านข้อ-จำไป--v1",
          "statement": "Feline fibroadenomatous hyperplasia (FAH) มี endogenous progesterone และ exogenous progestogen เป็นปัจจัยสำคัญในการเกิดโรค พบมากในแมวเพศเมียอายุน้อย และรักษาด้วย progesterone receptor blocker aglepristone ได้ผล 21 จาก 22 ตัว หายสนิทภายใน 1-4 สัปดาห์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12465769",
              "locator": "16(6):710-3, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Endogenous progesterone and exogenous progestogens play an important role in the genesis of FAH... All but 1 cat responded with a complete and lasting remission of signs after 1-4 weeks of treatment."
          }
        },
        {
          "id": "repro-lect--hormonal-applications--progestin-adverse-effects-ออก-2-ล้านข้อ-จำไป--v2",
          "statement": "ในสุนัข exogenous progestin และ endogenous progesterone กระตุ้นการสร้าง growth hormone จากต่อมน้ำนม ทำให้เกิด GH excess ซึ่งอาจนำไปสู่ acromegaly และ insulin resistance",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12914747",
              "locator": "13 Suppl A:S158-64, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "in dogs exogenous progestins and endogenous progesterone can induce GH excess. This GH excess originates form the mammary gland and may give rise to acromegaly and insulin resistance."
          }
        }
      ]
    },
    "repro-lect--hormonal-applications--cabergoline-pseudopregnancy-lactation": {
      "claims": [
        {
          "id": "repro-lect--hormonal-applications--cabergoline-pseudopregnancy-lactation--v1",
          "statement": "Cabergoline ขนาด 5 µg/kg/วัน นาน 5-10 วัน มีประสิทธิผลในการรักษา pseudopregnancy ในสุนัข โดยกลไกคือยับยั้งการหลั่ง prolactin ส่วน bromocriptine ใช้ 10-100 µg/kg/วัน นาน 10-14 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11928922",
              "locator": "36(6):283-8, abstract (treatment section)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Inhibition of PRL release by ergot derivatives [bromocriptine (10-100 microg/kg per day for 10-14 days], cabergoline (5 microg/kg per day during 5-10 days), metergoline (0.2 mg/kg per day during 8-10 days) has proved to be effective for the"
          }
        }
      ]
    },
    "repro-lect--hormonal-applications--oxytocin-critical-use": {
      "claims": [
        {
          "id": "repro-lect--hormonal-applications--oxytocin-critical-use--v1",
          "statement": "จากการศึกษา dystocia ในสุนัข 530 ตัว 54 สายพันธุ์ การรักษาด้วยยาที่ใช้ oxytocin สัมพันธ์กับการสูญเสียลูกสุนัขมากกว่ายาชนิดอื่น และระยะเวลาของ expulsion stage เป็นปัจจัยที่มีผลต่อการรอดชีวิตของลูกสุนัขมากที่สุด (p < 0.001)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19754554",
              "locator": "44 Suppl 2:141-7, abstract (results)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Duration of expulsion stage had the highest influence on puppy survival (p < 0.001). In the case of medical treatment, medication with oxytocin led to higher puppy losses compared with other medicaments."
          }
        }
      ]
    },
    "repro-lect--hormonal-applications--hypoluteoidism-aj-sp-เน้น": {
      "claims": [
        {
          "id": "repro-lect--hormonal-applications--hypoluteoidism-aj-sp-เน้น--v1",
          "statement": "Hypoluteoidism คือภาวะที่สร้าง progesterone ไม่เพียงพอ ซึ่งเพิ่มความเสี่ยงต่อการสูญเสียการตั้งท้องอย่างมีนัยสำคัญ และรักษาด้วย medroxyprogesterone acetate (MPA) ขนาด 0.1 mg/kg PO วันละครั้ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40989644",
              "locator": "15(6):2671-2681, abstract (background and methods)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Hypoluteoidism, defined as inadequate progesterone production, significantly increases the risk of pregnancy loss and reproductive failure... The experimental group received treatment with exogenous progesterone [medroxyprogesterone acetate"
          }
        }
      ]
    }
  },
  "repro-lect--infertility": {
    "repro-lect--infertility--bitch-infertility-definition": {
      "claims": [
        {
          "id": "repro-lect--infertility--bitch-infertility-definition--v1",
          "statement": "Brucella canis ทำให้เกิด canine brucellosis ซึ่งแสดงออกด้วยการแท้งเป็นกลุ่มและ reproductive failure และเป็นโรคติดต่อสู่คน (occupational risk ของสัตวแพทย์และผู้เพาะพันธุ์) การวินิจฉัยในสุนัขอาศัย serology เป็นหลัก แต่ความแม่นยำของชุดตรวจที่มีอยู่ยังต่ำ จึงมีการใช้ molecular methods เพิ่มขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33738302",
              "locator": "8:594291, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In dogs, canine brucellosis manifests with abortion outbreaks, reproductive failure, enlargement of lymph nodes... it is an occupational risk for veterinarians, breeders, laboratory workers... The diagnosis in dogs is largely based on serol"
          }
        }
      ]
    },
    "repro-lect--infertility--male-workup-tom-stud-dog": {
      "claims": [
        {
          "id": "repro-lect--infertility--male-workup-tom-stud-dog--v1",
          "statement": "ค่า alkaline phosphatase ใน seminal plasma มากกว่า 5,000 U/L บ่งชี้ว่า ejaculate สมบูรณ์ ส่วนน้อยกว่า 5,000 U/L สัมพันธ์กับ incomplete ejaculation เนื่องจากทั้ง ALP และ carnitine ถูกสร้างที่ epididymis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17512045",
              "locator": "68(3):322-8, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Both carnitine and alkaline phosphatase (AP) are produced in the epididymis; seminal plasma AP concentrations>5000 U/L indicate a normal ejaculate, whereas <5000 U/L is associated with incomplete ejaculation."
          }
        },
        {
          "id": "repro-lect--infertility--male-workup-tom-stud-dog--v2",
          "statement": "ก่อนสรุปว่าสุนัขเพศผู้เป็น azoospermia ต้องเก็บน้ำเชื้อซ้ำหลายครั้งต่อหน้าแม่สุนัขที่เป็นสัด เพื่อตัดปัจจัยเรื่องประสบการณ์ไม่พอและการกระตุ้นทางเพศไม่พอออกไปก่อน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17512045",
              "locator": "68(3):322-8, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Azoospermia is an ejaculate consisting of seminal plasma but lacking sperm; repeated semen collections in the presence of an estrual bitch will rule out inadequate experience and lack of sexual stimulation."
          }
        }
      ]
    },
    "repro-lect--infertility--sperm-terminology": {
      "claims": [
        {
          "id": "repro-lect--infertility--sperm-terminology--v1",
          "statement": "Azoospermia นิยามว่าเป็น ejaculate ที่มี seminal plasma แต่ไม่มีตัวอสุจิเลย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17512045",
              "locator": "68(3):322-8, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Azoospermia is an ejaculate consisting of seminal plasma but lacking sperm"
          }
        }
      ]
    },
    "repro-lect--infertility--queen-specific-traps": {
      "claims": [
        {
          "id": "repro-lect--infertility--queen-specific-traps--v1",
          "statement": "แมวที่ได้รับการผสมหลายครั้ง (2-3 ครั้งใน 30 นาที) มีการหลั่ง LH มากกว่าแมวที่ผสมครั้งเดียวอย่างมีนัยสำคัญ และการไม่หลั่ง LH เลยพบเฉพาะในแมวที่ผสมในวันที่ 2 ของการเป็นสัด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-4040972",
              "locator": "75(1):145-52, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Females receiving multiple matings had significantly greater releases of LH as measured by the area under the curve than those receiving single matings... the only failure in release of LH was in queens on Day 2."
          }
        },
        {
          "id": "repro-lect--infertility--queen-specific-traps--v2",
          "statement": "ค่า progesterone ในแมวยังคงต่ำกว่า 1 ng/mL ตลอด 24 ชั่วโมงแรกหลังผสม การเจาะ P4 เร็วเกินไปจึงยืนยันการตกไข่ไม่ได้ งานวิจัยนี้ถือว่าตกไข่เมื่อ P4 สูงขึ้นในช่วง 7-30 วันหลังผสม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-4040972",
              "locator": "75(1):145-52, abstract",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "ovulation was assumed to have occurred if progesterone values were elevated 7-30 days after coitus... Progesterone values remained less than 1 ng/ml for 24 h after coitus."
          }
        }
      ]
    }
  },
  "repro-lect--surgical-neutering": {
    "repro-lect--surgical-neutering--ovarian-remnant-syndrome-ors-aj-tt-favorite": {
      "claims": [
        {
          "id": "repro-lect--surgical-neutering--ovarian-remnant-syndrome-ors-aj-tt-favorite--v1",
          "statement": "ในซีรีส์ ORS 21 ตัว (สุนัข 19 แมว 2) ovarian remnant ทั้งหมดถูกพบที่บริเวณ ovarian pedicle ซึ่งเป็นตำแหน่งปกติของรังไข่ ไม่ถือเป็น ectopic tissue ผู้วิจัยจึงสรุปว่า surgical error ระหว่าง OVH เป็นสาเหตุที่สงสัยของ ORS",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20187819",
              "locator": "236(5):548-53",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Ovarian remnants were found in typical locations for ovaries and were not considered ectopic tissue; thus, surgical error during OHE was suspected as the cause of ORS."
          }
        },
        {
          "id": "repro-lect--surgical-neutering--ovarian-remnant-syndrome-ors-aj-tt-favorite--v2",
          "statement": "ในสุนัข ovarian remnant พบที่รังไข่ข้างขวาบ่อยกว่าข้างซ้ายอย่างมีนัยสำคัญ และอาการทางคลินิกอาจไม่ถูกสังเกตจนหลายปีหลัง OVH",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20187819",
              "locator": "236(5):548-53",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The right ovary in dogs was affected significantly more often than the left ovary. Seven animals had neoplasms of the reproductive system. These animals had a significantly longer interval between OHE and diagnosis of ORS than did the 14 an"
          }
        },
        {
          "id": "repro-lect--surgical-neutering--ovarian-remnant-syndrome-ors-aj-tt-favorite--v3",
          "statement": "การผ่าตัดเอาเนื้อเยื่อรังไข่ที่เหลือออกเป็นการรักษาเดียวที่หายขาด และให้ผลดีกว่าเมื่อทำในช่วงที่ remnant มี hormonal activity เพราะช่วยหาตำแหน่งได้ง่ายขึ้น; ในซีรีส์ 93 ราย (สุนัข 70 แมว 23) พบ neoplastic transformation ใน 10% ของสุนัข",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41227437",
              "locator": "15(21):3106",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Surgical excision of residual ovarian tissue was the only curative treatment, with improved outcomes when performed during hormonally active phases of the oestrous cycle to optimize remnant localisation. Histopathology confirmed ovarian tis"
          }
        },
        {
          "id": "repro-lect--surgical-neutering--ovarian-remnant-syndrome-ors-aj-tt-favorite--v4",
          "statement": "ค่า AMH ≥ 0.1 ng/mL (µg/L) ใช้เป็น cut-off บ่งชี้ว่ามี ovarian tissue ในสุนัขเพศเมีย โดยจำแนกสุนัขที่ทำหมันแล้วถูกต้อง 51/52 ตัว (98%) แต่จำแนกสุนัขที่ยังไม่ทำหมันถูกต้องเพียง 64/73 ตัว (88%) จึงอาจให้ผลลบลวงในตัวที่ยังมีรังไข่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29028571",
              "locator": "106:15-20",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "An AMH concentration of ≥0.1 μg/L, and an LH concentration of ≤1 μg/L, was set as the cut-off for presence of ovarian tissue. ... In total 64 of the 73 intact bitches (88%) were correctly identified using AMH, and 70/73 (96%) intact bitches"
          }
        }
      ]
    },
    "repro-lect--surgical-neutering--cervical-stump-issues-post-ovh": {
      "claims": [
        {
          "id": "repro-lect--surgical-neutering--cervical-stump-issues-post-ovh--v1",
          "statement": "Stump pyometra เกิดได้ในสุนัขเพศเมียที่ทำ OVH ไปแล้ว โดยรายงานส่วนใหญ่สัมพันธ์กับ ovarian remnant syndrome แต่ก็มีรายงานในตัวที่ไม่มี ovarian remnant",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36571806",
              "locator": "9(1):47-52",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "While most cases of stump pyometra involve ovarian remnant syndrome, this case report describes a stump pyometra in a dog without remnant tissue that was undergoing treatment with tamoxifen."
          }
        }
      ]
    },
    "repro-lect--surgical-neutering--ohe-technical-points": {
      "claims": [
        {
          "id": "repro-lect--surgical-neutering--ohe-technical-points--v1",
          "statement": "Haemorrhage จาก ovarian pedicle เป็นภาวะแทรกซ้อนที่รายงานหลัง OVH แบบเปิดหน้าท้อง และอาจรุนแรงถึงต้องผ่าตัดซ้ำ (1 ใน 18 ตัวในการศึกษาเปรียบเทียบ OVH กับ laparoscopic OVH)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14687188",
              "locator": "33(1):62-9",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Surgical complications with OVH were hemorrhage from an ovarian pedicle requiring reoperation (1 dog), dehiscence of the abdominal wall (1), and seroma (1)."
          }
        }
      ]
    }
  },
  "repro-lect--gonadectomy-risk": {
    "repro-lect--gonadectomy-risk--benefits": {
      "claims": [
        {
          "id": "repro-lect--gonadectomy-risk--benefits--v1",
          "statement": "จาก systematic review หลักฐานที่ว่าการทำหมันลดความเสี่ยง mammary tumour ในสุนัขเพศเมีย และหลักฐานที่ว่าอายุที่ทำหมันมีผล ถูกตัดสินว่า weak และไม่เพียงพอที่จะใช้ตั้งคำแนะนำที่หนักแน่น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22647210",
              "locator": "53(6):314-22",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Due to the limited evidence available and the risk of bias in the published results, the evidence that neutering reduces the risk of mammary neoplasia, and the evidence that age at neutering has an effect, are judged to be weak and are not "
          }
        }
      ]
    },
    "repro-lect--gonadectomy-risk--predisposed-breed-lists-aj-sc-จำไปให้หมด": {
      "claims": [
        {
          "id": "repro-lect--gonadectomy-risk--predisposed-breed-lists-aj-sc-จำไปให้หมด--v1",
          "statement": "ใน cohort Rottweiler 683 ตัว ตัวที่ทำ gonadectomy ก่อนอายุ 1 ปี มีความเสี่ยง bone sarcoma ตลอดชีวิตประมาณ 1 ใน 4 และเสี่ยงสูงกว่าตัวที่ไม่ทำหมันอย่างมีนัยสำคัญทั้งสองเพศ (RR 3.8 ในเพศผู้, RR 3.1 ในเพศเมีย)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12433723",
              "locator": "11(11):1434-40",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Male and female dogs that underwent gonadectomy before 1 year of age had an approximate one in four lifetime risk for bone sarcoma and were significantly more likely to develop bone sarcoma than dogs that were sexually intact [RR +/-95% CI "
          }
        },
        {
          "id": "repro-lect--gonadectomy-risk--predisposed-breed-lists-aj-sc-จำไปให้หมด--v2",
          "statement": "ในสุนัข 168,636 ตัวที่เข้ารับบริการ primary-care practice ในอังกฤษ prevalence ของ mast cell tumour รวมคือ 0.27% โดยสูงสุดใน Boxer 1.95%, Golden Retriever 1.39% และ Weimaraner 0.85% ส่วน Boxer, Pug และ Staffordshire Bull Terrier มี odds สูงกว่าสุนัขพันธุ์ผสม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26401329",
              "locator": "2:1",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Within a population of 168,636 dogs, 453 had MCT, yielding a prevalence of 0.27% (95% confidence interval (CI) 0.24% - 0.29%). The highest breed type specific prevalences were for the Boxer at 1.95% (95% CI 1.40% - 2.51%), Golden Retriever "
          }
        }
      ]
    },
    "repro-lect--gonadectomy-risk--detriments-to-discuss": {
      "claims": [
        {
          "id": "repro-lect--gonadectomy-risk--detriments-to-discuss--v1",
          "statement": "Acquired urinary incontinence จาก urethral sphincter incompetence พบประมาณ 20% ของสุนัขเพศเมียที่ทำหมัน โดยตัวที่น้ำหนักมากกว่า 20 kg เสี่ยงราว 30% ส่วนตัวเล็กเสี่ยงราว 10% และใน Boxer พบสูงถึง 65%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9411733",
              "locator": "139(6):271-6 (German, English abstract)",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Acquired urinary incontinence occurs in 20% of spayed dogs and there exists a strong correlation between body weight and the risk of urinary incontinence. Bitches with a body weight of more than 20 kg have a risk of 30% white smaller dogs h"
          }
        },
        {
          "id": "repro-lect--gonadectomy-risk--detriments-to-discuss--v2",
          "statement": "ในสุนัขพันธุ์ผสม กลุ่มที่น้ำหนัก 20 kg ขึ้นไป การทำหมันก่อนอายุ 1 ปี สัมพันธ์กับความเสี่ยง joint disorder (hip dysplasia, cranial cruciate ligament tear, elbow dysplasia) สูงกว่าตัวที่ไม่ทำหมันอย่างมีนัยสำคัญ โดยทั่วไปประมาณ 3 เท่า ส่วนกลุ่มที่น้ำหนักน้อยกว่า 20 kg ไม่พบความเสี่ยงเพิ่ม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32851043",
              "locator": "7:472",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "However, in the three categories of dogs weighing 20 kg or more, neutering before 1 year generally was significantly associated with risks of one or more joint disorders above that of dogs left intact, commonly to 3 times the level of intac"
          }
        }
      ]
    },
    "repro-lect--gonadectomy-risk--decision-rule": {
      "claims": [
        {
          "id": "repro-lect--gonadectomy-risk--decision-rule--v1",
          "statement": "GnRH agonist slow-release implant (เช่น deslorelin) ลดพฤติกรรมที่ขึ้นกับ testosterone ได้ในอัตราใกล้เคียงกับการตอนด้วยการผ่าตัด จึงใช้เป็น trial ก่อนตัดสินใจตอนถาวรได้ แต่ไม่พบว่าช่วยลด aggression ต่อคน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28025851",
              "locator": "52 Suppl 2:336-347",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Rates of improvement of the respective behaviour are comparable to those after surgical castration, making GnRH A-SRI a valuable option to predict castration-related effects on behaviour and to identify animals where surgical castration wil"
          }
        }
      ]
    }
  },
  "repro-lect--biotech": {
    "repro-lect--biotech--why-dogs-cats-matter-for-conservation": {
      "claims": [
        {
          "id": "repro-lect--biotech--why-dogs-cats-matter-for-conservation--v1",
          "statement": "Teratospermia นิยามว่าการหลั่งน้ำเชื้อที่มี spermatozoa รูปร่างปกติน้อยกว่า 40% พบในราว 70% ของชนิดหรือชนิดย่อยของ felid ที่มีการศึกษา และอสุจิที่ผิดรูปจาก teratospermic felid ไม่สามารถ fertilize oocyte ได้ใน IVF",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11787186",
              "locator": "Vol 57, pages 423-33",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Especially significant is the trait of teratospermia (ejaculation of < 40% morphologically normal spermatozoa) that commonly occurs in about 70% of the felid species or subspecies studied to date. ... It is apparent from IVF that deformed s"
          }
        },
        {
          "id": "repro-lect--biotech--why-dogs-cats-matter-for-conservation--v2",
          "statement": "Cheetah เป็น felid ที่มี genetic variability ต่ำที่สุด (polymorphism 2-4%, average heterozygosity 0.0004-0.014) จาก population bottleneck ตามด้วย inbreeding และมีคุณภาพน้ำเชื้อต่ำ คือมี morphological abnormalities ราว 79% ของ spermatozoa",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-3467370",
              "locator": "Vol 84, issue 2, pages 508-11",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "the quality of semen specimens from east African cheetahs was poor, with a low concentration of spermatozoa (25.3 X 10(6) per ejaculate) and a high incidence of morphological abnormalities (79%). ... Estimates of polymorphism (2-4%) and ave"
          }
        }
      ]
    },
    "repro-lect--biotech--art-toolbox": {
      "claims": [
        {
          "id": "repro-lect--biotech--art-toolbox--v1",
          "statement": "ICSI คือการฉีด spermatozoon เพียงตัวเดียวเข้าไปใน cytoplasm ของ oocyte ระยะ metaphase II ใช้แก้ severe male-factor infertility และมีประสิทธิภาพเหนือกว่า partial zona dissection (PZD) และ subzonal insemination (SUZI)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11499344",
              "locator": "Vol 63, issue 3, pages 193-240",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "ICSI--the injection of a single spermatozoon into the cytoplasm of a fertilizable metaphase II oocyte--has proved to be more efficient than PZD and SUZI for the alleviation of severe male-factor infertility."
          }
        },
        {
          "id": "repro-lect--biotech--art-toolbox--v2",
          "statement": "สุนัขตกไข่เป็น oocyte ที่ยังอยู่ระยะ germinal vesicle (ยังไม่ maturation) และต้องใช้เวลา 48-72 ชั่วโมงใน oviduct จึงจะไปถึง metaphase II และ fertilize ได้ ต่างจาก mammal ชนิดอื่น จึงทำให้ IVM เป็นขั้นตอนวิกฤตของ ART ในสุนัข",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34557482",
              "locator": "Vol 9, article 694889",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Unlike other mammals, bitches ovulate oocytes in the germinal vesicle stage and complete metaphase II (MII) after 48-72 h in the oviductal environment and become fertilizable."
          }
        }
      ]
    },
    "repro-lect--biotech--embryo-development-timeline-dog": {
      "claims": [
        {
          "id": "repro-lect--biotech--embryo-development-timeline-dog--v1",
          "statement": "ในสุนัข embryo เริ่มเคลื่อนจาก oviduct เข้าสู่ uterus ประมาณวันที่ 11 หลัง LH surge และอยู่ใน uterus ครบทุกตัวภายในวันที่ 13 โดยพัฒนาถึงระยะ morula ภายใน 11-13 วัน และถึงระยะ blastocyst ภายใน 14 วันหลัง LH surge",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18202549",
              "locator": "Vol 54, issue 2, pages 135-7",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The embryos migrated from the oviduct to the uterus beginning on day 11 after the LH surge. This transport must be completed within 24 h. By day 13 after the LH surge, all of the embryos had moved and were localized in the uterus. The embry"
          }
        }
      ]
    },
    "repro-lect--biotech--scnt-cloning": {
      "claims": [
        {
          "id": "repro-lect--biotech--scnt-cloning--v1",
          "statement": "Interspecies SCNT (iSCNT) ที่ย้าย somatic nucleus ของสัตว์ใกล้สูญพันธุ์เข้าสู่ enucleated oocyte ของสปีชีส์อื่น ถูกเสนอเป็นทางเลือกเมื่อ oocyte ของสปีชีส์นั้นหายาก แต่ embryo มักไม่พัฒนาเป็นลูกที่รอด เนื่องจาก reprogramming ไม่สมบูรณ์และความไม่เข้ากันระหว่าง nucleus กับ mitochondria ของ cytoplasm",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25511933",
              "locator": "Vol 15, issue 1, article 1113",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Interspecies somatic cell nuclear transfer (iSCNT) has been regarded as a potential alternative for rescuing highly endangered species and can be used as a model for studying nuclear-cytoplasmic interactions. However, iSCNT embryos often fa"
          }
        }
      ]
    }
  },
  "repro-lect--genetics": {
    "repro-lect--genetics--core-formulas": {
      "claims": [
        {
          "id": "repro-lect--genetics--core-formulas--v1",
          "statement": "Narrow-sense heritability (h2) นิยามว่าเป็นสัดส่วนของ phenotypic variance ที่อธิบายได้ด้วยผลรวมของ additive genetic effects",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35888189",
              "locator": "Vol 12, issue 7, article 1101",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "This work aimed at estimating narrow-sense heritability, defined as the proportion of the phenotypic variance explained by the sum of additive genetic effects, via Haseman-Elston regression"
          }
        },
        {
          "id": "repro-lect--genetics--core-formulas--v2",
          "statement": "Heritability เป็น population parameter ที่ไม่มีหน่วย ใช้เปรียบเทียบความสำคัญสัมพัทธ์ของ gene กับ environment ต่อความแปรผันของลักษณะภายในและระหว่างประชากร และเป็นตัวกำหนด response to selection",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18319743",
              "locator": "Vol 9, issue 4, pages 255-66",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Heritability allows a comparison of the relative importance of genes and environment to the variation of traits within and across populations. The concept of heritability and its definition as an estimable, dimensionless population paramete"
          }
        }
      ]
    },
    "repro-lect--genetics--selection-types": {
      "claims": [
        {
          "id": "repro-lect--genetics--selection-types--v1",
          "statement": "Disruptive selection ที่บังคับผสมเฉพาะตัวที่อยู่ปลายสองข้างของการกระจาย ทำให้ phenotypic variability ของลักษณะเชิงปริมาณสูงขึ้น ต่างจาก stabilizing selection ที่คัดไปทางค่ากลาง ซึ่งพิสูจน์ในการทดลองคัดเลือกขนาด thorax ของ Drosophila melanogaster",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-4205048",
              "locator": "Vol 75, issue 4, pages 695-708",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Phenotypic variability was high in two disruptive selection lines with compulsory mating of opposite extremes (D(-)). The mechanism of the change in variability was different in these replicate lines. In D(-)-1 the change was obtained by an"
          }
        }
      ]
    },
    "repro-lect--genetics--applied-breeding-tools": {
      "claims": [
        {
          "id": "repro-lect--genetics--applied-breeding-tools--v1",
          "statement": "GBLUP ใช้ genomic relationship matrix ที่สร้างจาก genetic marker ทั้งจีโนม แทน pedigree relationship matrix แบบเดิม ในการจำลองของ VanRaden reliability ของ predicted net merit ในพ่อพันธุ์โคอายุน้อยเพิ่มจาก 32% เป็น 63%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18946147",
              "locator": "Vol 91, issue 11, pages 4414-23",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Linear model predictions of breeding values were computed by 3 equivalent methods: 1) iteration for individual allele effects followed by summation across loci to obtain estimated breeding values, 2) selection index including a genomic rela"
          }
        },
        {
          "id": "repro-lect--genetics--applied-breeding-tools--v2",
          "statement": "การคัดเลือกโดยใช้ predicted breeding value (EBV) ให้ genetic progress เร็วกว่าการคัดจาก phenotype โดยตรง โดย heritability ของ hip dysplasia และ elbow dysplasia ในสุนัขพันธุ์ Rottweiler และ Bernese Mountain Dog อยู่ระหว่าง 0.34 ถึง 0.42",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19134076",
              "locator": "Vol 125, issue 6, pages 403-12",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Estimated heritabilities for HD and ED were between 0.34 and 0.42. ... Genetic trends indicated a genetic improvement in both traits. However, a faster genetic progress is expected if selection is based on predicted breeding values rather t"
          }
        },
        {
          "id": "repro-lect--genetics--applied-breeding-tools--v3",
          "statement": "Inbreeding ที่สูงขึ้นสัมพันธ์กับ fertility ที่ลดลง โดยในสุนัขพันธุ์ Entlebucher Mountain Dog การเพิ่ม inbreeding ของแม่สุนัข 1% คาดว่าทำให้ litter size แรกเกิดลดลงราว 0.1 ตัว",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28460671",
              "locator": "Vol 95, pages 163-170",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The age of the dam and parental inbreeding were identified as significant predictors with a negative effect on litter size at birth. For the litter size at registration the age and inbreeding of the dam had a significant negative effect and"
          }
        }
      ]
    }
  },
  "repro-lect--repro-ultrasound": {
    "repro-lect--repro-ultrasound--major-uses": {
      "claims": [
        {
          "id": "repro-lect--repro-ultrasound--major-uses--v1",
          "statement": "ในสุนัข gestation length ที่นับจากวันผสม (day of mating) แปรปรวนสูง การทำนายวันคลอดจากจุดนี้จึงคลาดเคลื่อนมาก เมื่อยืนยันการตั้งท้องแล้ว ultrasonography คือเครื่องมือที่มีประโยชน์ที่สุดในการทำนายวันคลอด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16420324",
              "locator": "Vol 41, Issue 1, pages 27-32",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "In bitches, the length of gestation is highly variable when measured from the day of mating, thus prediction of parturition may be greatly inaccurate when determined from this point. ... when pregnancy is ascertained, ultrasonography is the"
          }
        }
      ]
    },
    "repro-lect--repro-ultrasound--pregnancy-timeline-canine-days-post-lh-surge": {
      "claims": [
        {
          "id": "repro-lect--repro-ultrasound--pregnancy-timeline-canine-days-post-lh-surge--v1",
          "statement": "ในสุนัขที่จับเวลาแม่นยำจาก preovulatory LH surge โครงสร้างแรกที่ตรวจพบด้วย ultrasound คือ chorionic cavity (gestational sac) ที่ day 20 ส่วน embryo พร้อม heartbeat ตรวจพบได้ที่ day 23-25 และ fetal skeleton ที่ day 33-39",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1595959",
              "locator": "Vol 53, Issue 3, pages 342-351",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Gestation was timed from the day of the preovulatory luteinizing hormone surge. ... Gestational ages at earliest detection of the following features were: chorionic cavity at day 20; placental layers in the uterine wall at day 22 to 24; zon"
          }
        },
        {
          "id": "repro-lect--repro-ultrasound--pregnancy-timeline-canine-days-post-lh-surge--v2",
          "statement": "ระยะเวลาตั้งท้องของสุนัขเท่ากับ 65 วันนับจาก LH surge และการวัด fetal measurement ที่ 30 วันหลัง LH surge ให้การทำนายวันคลอดแม่นยำที่สุด โดยไม่ขึ้นกับ body weight หรือ litter size",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-14511784",
              "locator": "Vol 60, Issue 7, pages 1309-1317",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The length of canine gestation is 65 days from the luteinizing hormone (LH) surge. ... Using stepwise logisitic regression, the most accurate prediction of parturition date was obtained when fetuses were measured at 30 days after the LH sur"
          }
        }
      ]
    },
    "repro-lect--repro-ultrasound--fetal-sex-determination": {
      "claims": [
        {
          "id": "repro-lect--repro-ultrasound--fetal-sex-determination--v1",
          "statement": "การระบุเพศ fetus ด้วย ultrasound อาศัยตำแหน่งของ genital tubercle ซึ่ง migrate ไปทาง caudal ในเพศเมียและไปทาง cranial ในเพศผู้ โดยยังมองไม่เห็น genital tubercle ก่อน day 26 และใช้ระบุเพศได้ในช่วง day 33-50 ของการตั้งท้อง (kappa 0.8 เทียบกับเพศตอนคลอด)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26748721",
              "locator": "Vol 165, pages 56-68",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "The genital tubercle is not visible before 26 days; between 26 and 30 days, it is visible between the pelvic limbs; between 33 and 50 days, the position of the genital tubercle enables sex determination as it migrates caudally in the female"
          }
        }
      ]
    },
    "repro-lect--repro-ultrasound--fetal-viability": {
      "claims": [
        {
          "id": "repro-lect--repro-ultrasound--fetal-viability--v1",
          "statement": "เกณฑ์ fetal heart rate ในสุนัข: มากกว่า 220 bpm ถือว่าปกติ, 180-220 bpm = slight fetal distress, น้อยกว่า 180 bpm = severe fetal distress โดยพบ bowel movement ในลูกสุนัขทุกตัวที่มี HR น้อยกว่า 180 bpm",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11787152",
              "locator": "Vol 57, pages 215-219",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Fetuses were considered to be normal when heart rate, determined by a Doppler flowmeter was > 220 beats min-1; suffering from slight fetal distress when heart rate was between 180 and 220 beats min-1; suffering from severe fetal distress wh"
          }
        }
      ]
    },
    "repro-lect--repro-ultrasound--male-u-s-specifics": {
      "claims": [
        {
          "id": "repro-lect--repro-ultrasound--male-u-s-specifics--v1",
          "statement": "บน B-mode ultrasound ของ prostate ในสุนัข descriptor ที่ผู้อ่านภาพใช้ส่วนใหญ่สัมพันธ์กับ underlying pathology ได้ไม่ดี มีเพียง cysts ที่จำเพาะกับ benign prostatic hyperplasia และ parenchymal mineralization ที่จำเพาะกับ adenocarcinoma",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23279509",
              "locator": "Vol 47 Suppl 6, pages 238-242",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "There was also poor association between these descriptors and the underlying pathology, with the only unique descriptors being 'cysts' for benign prostatic hyperplasia and 'parenchymal mineralization' for adenocarcinoma."
          }
        }
      ]
    }
  },
  "repro-lect--exotic-repro": {
    "repro-lect--exotic-repro--rabbit-repro-pearls": {
      "claims": [
        {
          "id": "repro-lect--exotic-repro--rabbit-repro-pearls--v1",
          "statement": "กระต่ายเป็น reflex (induced) ovulator โดย coitus กระตุ้นให้เกิด hypothalamic GnRH release เพิ่มขึ้นราว 100 เท่าภายใน 1 ชั่วโมง พร้อมกับ LH surge ในกระแสเลือด ขณะที่ sham-mated does ไม่พบการเปลี่ยนแปลงของ GnRH, LH, FSH หรือ PRL เลย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-2117523",
              "locator": "Vol 127, Issue 3, pages 1176-1185",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "An approximately 100-fold increase in GnRH release was observed within 1 h of coitus (pre, 1.15 +/- 0.29 pg/ml; peak, 106.67 +/- 37.42 pg/ml; n = 6; P less than 0.05). Concomitant surges of LH and PRL in the peripheral circulation were obse"
          }
        }
      ]
    },
    "repro-lect--exotic-repro--common-exotic-repro-flags": {
      "claims": [
        {
          "id": "repro-lect--exotic-repro--common-exotic-repro-flags--v1",
          "statement": "ในหนูตะเภา (guinea pig) ทั้งความชุกและขนาดของ ovarian cyst เพิ่มขึ้นตามอายุอย่างมีนัยสำคัญทางสถิติ (prevalence P น้อยกว่า 0.02, size P น้อยกว่า 0.01) ขณะที่ reproductive history ไม่มีความสัมพันธ์อย่างมีนัยสำคัญกับความชุกของ cyst",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12831102",
              "locator": "Vol 44, Issue 6, pages 257-260",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "No statistically significant correlation between reproductive history and the prevalence of cysts was detected at the 95 per cent confidence level. A statistically significant relationship was found, however, between cyst size and age (P<0."
          }
        },
        {
          "id": "repro-lect--exotic-repro--common-exotic-repro-flags--v2",
          "statement": "Estrogen ในขนาดปานกลางทำให้เกิด lethal bone marrow depression ใน ferret และสุนัข โดย carnivore ไวต่อ estrogen toxicity มากกว่า rodent และการตายสัมพันธ์กับ hemorrhage",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-2203070",
              "locator": "Vol 47, Issue 2, pages 203-218",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Carnivores are more susceptible than rodents. ... Susceptibility declines in the order cat, ferret, rat and mouse, dog. ... Moderate doses elicit anemia in rats, but lethal bone marrow depression in dogs and ferrets. Death is associated wit"
          }
        },
        {
          "id": "repro-lect--exotic-repro--common-exotic-repro-flags--v3",
          "statement": "ปัญหาระบบสืบพันธุ์ที่พบบ่อยใน captive male lizard ได้แก่ hemipenile plug ใน hemipenial sac และ prolapse ของ hemipenis ทั้งแบบข้างเดียว (unilateral) และสองข้าง (bilateral)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28169180",
              "locator": "Vol 20, Issue 2, pages 411-438",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Common reproductive problems in captive male lizards are hemipenile plugs in hemipenial sac, unilateral prolapse of hemipenis, or bilateral prolapse of hemipene. ... Female captive lizards suffer from cloacal prolapse, preovulatory follicul"
          }
        },
        {
          "id": "repro-lect--exotic-repro--common-exotic-repro-flags--v4",
          "statement": "ใน case series ของ black-tufted marmoset 3 ตัวที่มี dystocia (prolonged labor 6-8 ชั่วโมง) radiograph พบ twin fetuses ทั้ง 3 ตัว และต้องทำ cesarean section เพราะ body size เล็กเกินกว่าจะทำ obstetrical manipulation ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42465719",
              "locator": "Vol 13, article 1857325",
              "kind": "primary-literature"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-01",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Over a four-month period, three unrelated adult females presented with prolonged and difficult labor lasting 6-8 h that began during the midnight hours. Radiographic examination in ventrodorsal and lateral views revealed the presence of twi"
          }
        }
      ]
    }
  }
};

export default GENERATED_VERIFICATIONS;
