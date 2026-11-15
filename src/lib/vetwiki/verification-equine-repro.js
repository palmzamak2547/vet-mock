// ============================================================
// VetWiki — reference-verification overlay, Equine Reproduction notes of 2569
// ============================================================
// One claim per section added on 15 Nov 2026, each cross-checked against a real
// external source (./sources.js): the supporting words of the source are quoted
// in the claim's `review.rationale`, and a second reader fetched the source again
// and found them there. verification.js merges this overlay in code with the
// curated and the generated ones, so no key of one object literal can shadow another.
// ============================================================

/** @type {Record<string, Record<string, {claims: object[]}>>} */
export const EQUINE_REPRO_VERIFICATIONS = {
  "equine-repro--eqrepro-endometritis": {
    "equine-repro--eqrepro-endometritis--หน้าที่ของมดลูกและ-endometrium": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--หน้าที่ของมดลูกและ-endometrium--v1",
          "statement": "ใน endometrium ของม้า oxytocin receptor และ PTGS2 เป็นองค์ประกอบหลักของ luteolytic pathway ที่ทำให้ PGF2α หลั่งในรอบสัด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24679480",
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
            "rationale": "Endometrial oxytocin receptors (OXTR) and prostaglandin-endoperoxide synthase 2 (PTGS2) are central components of the luteolytic pathway in cyclic mares"
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--contamination-กับ-infection": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--contamination-กับ-infection--v1",
          "statement": "Spermatozoa กระตุ้น PMN เข้ามาใน lumen ของมดลูก จึง endometritis ชั่วคราวหลังผสมเป็นปฏิกิริยาปกติทางสรีรวิทยา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10734380",
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
            "rationale": "Recent studies have demonstrated that spermatozoa trigger PMN chemotaxis into the uterine lumen. This observation suggests that a transient endometritis is a normal physiological response to breeding."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--กลไกป้องกันของมดลูก": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--กลไกป้องกันของมดลูก--v1",
          "statement": "การเสียกลไก physical clearance ของมดลูกเชื่อว่ามีบทบาทหลักต่อความไวต่อ persistent endometritis ในม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10734380",
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
            "rationale": "A breakdown of uterine physical clearance mechanisms is currently believed to play a major role in susceptibility to persistent endometritis."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--นิยามของ-endometritis-และภาวะที่ใกล้เคียง": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--นิยามของ-endometritis-และภาวะที่ใกล้เคียง--v1",
          "statement": "Metritis คือการอักเสบของมดลูกทุกชั้น ส่วน endometritis เป็นการอักเสบตื้นกว่าที่เกิดเฉพาะ endometrium",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37191856",
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
            "rationale": "Metritis is associated with inflammation of all uterine layers (endometrium, myometrium and perimetrium), whereas endometritis is a more superficial inflammation involving solely the endometrium."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--ชนิดของ-endometritis-และ-pbie": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--ชนิดของ-endometritis-และ-pbie--v1",
          "statement": "การระบายน้ำเชื้อออกไม่ดีหรือภูมิคุ้มกันไม่พอ อาจทำให้เกิด persistent mating-induced endometritis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37191856",
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
            "rationale": "Improper drainage of the ejaculatory fluid or an inadequate immune response may result in persistent mating-induced endometritis."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--ปัจจัยเสี่ยงและเชื้อที่เกี่ยวข้อง": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--ปัจจัยเสี่ยงและเชื้อที่เกี่ยวข้อง--v1",
          "statement": "ความผิดปกติของกายวิภาคอวัยวะเพศ การบีบตัวของ myometrium การระบายน้ำเหลือง cervix และการเสื่อมตามวัย เป็นพื้นฐานของความไวต่อ endometritis ในแม่ม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19660076",
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
            "rationale": "Defects in genital anatomy, myometrial contractions, lymphatic drainage, mucociliary clearance, cervical function, plus vascular degeneration and inflamm-ageing underlie susceptibility to endometritis."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--ผลของ-endometritis-ต่อ-fertility": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--ผลของ-endometritis-ต่อ-fertility--v1",
          "statement": "Endometritis เป็นสาเหตุสำคัญของ infertility ในม้า เกิดจากการกำจัดเชื้อ sperm และ exudate หลังผสมไม่สำเร็จ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19660076",
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
            "rationale": "Endometritis, a major cause of mare infertility arising from failure to remove bacteria, spermatozoa and inflammatory exudate post-breeding, is often undiagnosed."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--adverse-outcomes-การอักเสบกระทบระบบสืบพันธุ์อย่างไร": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--adverse-outcomes-การอักเสบกระทบระบบสืบพันธุ์อย่างไร--v1",
          "statement": "Endometritis ทั้งหลังคลอดและหลังผสมทำให้สภาพแวดล้อมของตัวอ่อนและ placenta ไม่เหมาะสม และอาจกระทบการอยู่รอดของ sperm",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37191856",
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
            "rationale": "Both postpartum and postmating endometritis interferes with fertility by creating a suboptimal environment for embryo development and placentation, and chronic endometritis may have an impact on sperm survival and fertilization ability."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--การวินิจฉัย-clinical-และ-subclinical-endometritis": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--การวินิจฉัย-clinical-และ-subclinical-endometritis--v1",
          "statement": "การวินิจฉัย endometritis ในม้าอาศัย uterine fluid, vaginal discharge, cytology และ culture",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19660076",
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
            "rationale": "Diagnosis is made through detecting uterine fluid, vaginitis, vaginal discharge, short inter-oestrous intervals, inflammatory uterine cytology and positive uterine culture."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--ultrasonography": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--ultrasonography--v1",
          "statement": "แม่ม้าที่เป็น subclinical endometritis ต้องติดตามด้วย ultrasound หลังผสม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19660076",
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
            "rationale": "Mares with subclinical endometritis require careful monitoring by ultrasound post-breeding."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--culture-cytology-และ-biopsy": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--culture-cytology-และ-biopsy--v1",
          "statement": "Cytology ของ endometrium พบม้าที่มีการอักเสบเฉียบพลันได้เป็นสองเท่าของ culture swab และ culture จาก biopsy หรือ uterine fluid ไวกว่า swab",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20591061",
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
            "rationale": "Culturing endometrial biopsy tissue or uterine fluids are more sensitive methods for identifying Escherichia coli than culture swab while endometrial cytology identifies twice as many mares with acute inflammation than uterine culture swab."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--diagnostic-decision-tree": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--diagnostic-decision-tree--v1",
          "statement": "Uterine cytology ไวกว่า culture สองเท่าในการตรวจ endometritis จึงพบการอักเสบได้แม้ culture ไม่พบเชื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19660076",
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
            "rationale": "uterine cytology is twice as sensitive as culture in detecting endometritis."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--treatment-ภาพรวม-และเป้าหมายที่-1-ระบายสิ่งที่คั่งในมดลูก": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--treatment-ภาพรวม-และเป้าหมายที่-1-ระบายสิ่งที่คั่งในมดลูก--v1",
          "statement": "Post-mating-induced endometritis รักษามาตรฐานด้วย uterine irrigation และ ecbolics",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20591061",
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
            "rationale": "post-mating-induced endometritis is classically treated with uterine irrigation and ecbolics"
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--เป้าหมายที่-2-คุมการติดเชื้อด้วย-antibiotics": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--เป้าหมายที่-2-คุมการติดเชื้อด้วย-antibiotics--v1",
          "statement": "Acute endometritis รักษาได้ด้วย antibiotics แบบ systemic หรือใส่เข้ามดลูก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20591061",
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
            "rationale": "acute endometritis is treated with either systemic or intra-uterine antibiotics"
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--เป้าหมายที่-3-ลดการอักเสบ-และการรักษาทางเลือก": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--เป้าหมายที่-3-ลดการอักเสบ-และการรักษาทางเลือก--v1",
          "statement": "N-acetylcysteine เป็นยา mucolytic ที่มีฤทธิ์ต้านการอักเสบ ใช้ infuse เข้ามดลูกม้าที่เป็น persistent endometritis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23623166",
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
            "rationale": "N-acetylcysteine (NAC), a mucolytic agent with anti-inflammatory properties"
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--pyometra": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--pyometra--v1",
          "statement": "Pyometra ในม้ารักษาแบบ conservative ด้วยการระบายและล้างมดลูก ร่วมกับยาต้านอักเสบและต้านจุลชีพ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31145499",
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
            "rationale": "Conservative therapy consists of draining and flushing the uterus, and systemic anti-inflammatory and antimicrobial treatment."
          }
        }
      ]
    },
    "equine-repro--eqrepro-endometritis--ป้องกันการกลับเป็นซ้ำ-และงานวิจัยล่าสุด": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-endometritis--ป้องกันการกลับเป็นซ้ำ-และงานวิจัยล่าสุด--v1",
          "statement": "รูปร่าง vulva ที่ผิดปกติเป็นปัจจัยเสี่ยงต่อการติดเชื้อมดลูก และการเย็บปิด vulva (Caslick) ช่วยให้ fertility ดีขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16268960",
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
            "rationale": "Changes in the conformation of the vulva predispose the mare to uterine infection. Vulvoplasty for closure of the upper vulvar lips improves fertility."
          }
        }
      ]
    }
  },
  "equine-repro--eqrepro-male": {
    "equine-repro--eqrepro-male--breeding-soundness-examination-ของพ่อม้า": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--breeding-soundness-examination-ของพ่อม้า--v1",
          "statement": "Breeding soundness evaluation ของพ่อม้ารวมประวัติ พฤติกรรมการผสม การเก็บและตรวจน้ำเชื้อ และการตรวจโรคติดเชื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1576547",
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
            "rationale": "The evaluation should include historical data about the medical aspects of the horse's performance and breeding career, observations and breeding behavior characteristics, collection and evaluation of semen, tests to determine freedom from infectious or contagious disease"
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--penis-vascular-type-urethral-process-และ-fossa-glandis": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--penis-vascular-type-urethral-process-และ-fossa-glandis--v1",
          "statement": "ใน penis ของม้าเมื่อ vasodilation จะมีเลือดเข้าเติม corpus cavernosum และ corpus spongiosum มากขึ้นตอน erection",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24049919",
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
            "rationale": "After vasodilation with mild stimulation from an electroejaculator, there was increased filling of the CCP and corpus spongiosum penis."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--clinical-examination-ของ-penis-และ-prepuce": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--clinical-examination-ของ-penis-และ-prepuce--v1",
          "statement": "Penile prolapse ที่ยาวนานในม้าพบร่วมกับ phenothiazine tranquilizer ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-9290825",
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
            "rationale": "Prolonged penile prolapse in horses has been reported in association with administration of phenothiazine tranquilizers, trauma, neuropathies, severe general debilitation or exhaustion, starvation, rabies, herpes myeloencephalitis, equine infectious anemia, and purpura hemorrhagica."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--diseases-of-penis-and-prepuce-และการ-swab": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--diseases-of-penis-and-prepuce-และการ-swab--v1",
          "statement": "Equine coital exanthema เป็นโรคติดต่อทางเพศสัมพันธ์ที่เกิดรอยโรคที่อวัยวะเพศภายนอก มี EHV-3 (equid alphaherpesvirus 3) เป็นสาเหตุ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34451519",
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
            "rationale": "Equine coital exanthema (ECE) is a highly contagious, venereally-transmitted mucocutaneous disease, characterized by the formation of papules, vesicles, pustules and ulcers on the external genital organs of mares and stallions, and caused by equid alphaherpesvirus 3 (EHV-3)."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--scrotum-scrotal-sac": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--scrotum-scrotal-sac--v1",
          "statement": "การสร้าง sperm ของม้าพ่อพันธุ์ต้องการอุณหภูมิต่ำกว่าอุณหภูมิแกนกลางของร่างกายเล็กน้อย จึงต้องมี thermoregulation",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37970501",
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
            "rationale": "Spermatogenesis in animals such as stallions is a temperature-dependent process, ideally occurring at temperatures slightly below the core body temperature."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--testis-testicular-descent-และ-cryptorchidism": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--testis-testicular-descent-และ-cryptorchidism--v1",
          "statement": "Cryptorchidism คือการที่ testis หนึ่งหรือสองข้างไม่ลงสู่ scrotum",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17379650",
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
            "rationale": "Cryptorchidism is failure of one or both testes to descend into the scrotum."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--spermatogenesis-และการควบคุม": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--spermatogenesis-และการควบคุม--v1",
          "statement": "Spermatogenesis แบ่งเป็น spermatocytogenesis, meiosis และ spermiogenesis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16728209",
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
            "rationale": "Activities of these three germ cells divide spermatogenesis into spermatocytogenesis, meiosis, and spermiogenesis, respectively."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--clinical-examination-ของ-scrotum-และ-testis": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--clinical-examination-ของ-scrotum-และ-testis--v1",
          "statement": "Scrotal width ของพ่อม้ามีสหสัมพันธ์กับ daily sperm production และ daily sperm output",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-289781",
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
            "rationale": "Scrotal width was correlated (P less than 0.01) with daily sperm production (r = 0.75) and daily sperm output (r = 0.55) and was generally the most repeatable measurement."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--epididymis-และ-vas-deferens": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--epididymis-และ-vas-deferens--v1",
          "statement": "sperm จาก cauda epididymis ของพ่อม้าเก็บมาแช่แข็งและประเมินความสามารถในการปฏิสนธิได้ และหลังละลายอาจดีกว่า sperm จาก ejaculate ในพ่อม้า subfertile",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42863643",
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
            "rationale": "After thawing, epididymal sperm from subfertile stallions exhibited better sperm kinetics, structural and functional viability, and fertility than ejaculated sperm."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--accessory-sex-glands-gel-fraction-และ-ampullary-obstruction": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--accessory-sex-glands-gel-fraction-และ-ampullary-obstruction--v1",
          "statement": "seminal plasma ของพ่อม้ามีสารที่มาจาก epididymis และ accessory glands",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20546178",
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
            "rationale": "Seminal plasma (SP) contains several types of compounds derived from the epididymides and accessory glands."
          }
        }
      ]
    },
    "equine-repro--eqrepro-male--stallion-behaviors-และการผสมตามธรรมชาติ": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-male--stallion-behaviors-และการผสมตามธรรมชาติ--v1",
          "statement": "ปัญหาพฤติกรรมการผสมของพ่อม้ามีตั้งแต่ความสนใจทางเพศไม่พอหรือไม่คงที่ ไปจนถึงตอบสนองรุนแรงเกินไป",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27726992",
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
            "rationale": "the problems can range from inadequate or variable sexual interest and response to overenthusiastic or aggressive response beyond the ability of the handlers to safely direct and control."
          }
        }
      ]
    }
  },
  "equine-repro--eqrepro-ai": {
    "equine-repro--eqrepro-ai--stallion-selection-และโรคที่ติดต่อทางการผสมพันธุ์": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-ai--stallion-selection-และโรคที่ติดต่อทางการผสมพันธุ์--v1",
          "statement": "EVA ทำให้พ่อม้าเป็น carrier ถาวรที่ขับไวรัสออกทางน้ำเชื้อ และสหภาพยุโรปบังคับตรวจ EVA ในพ่อม้าที่ใช้ AI",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38150796",
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
            "rationale": "Equine viral arteritis (EVA) can induce a persistent carrier state in stallions which then shed the virus via semen. About 30 years ago, obligatory EVA testing of stallions used for artificial insemination (AI) was implemented in the European Union."
          }
        }
      ]
    },
    "equine-repro--eqrepro-ai--semen-collection-และ-artificial-vagina": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-ai--semen-collection-และ-artificial-vagina--v1",
          "statement": "น้ำเชื้อพ่อม้าเก็บได้ด้วย artificial vagina บน phantom หรือแม่ม้า หรือด้วยการกระตุ้นด้วยยา และวิธีเก็บมีผลต่อปริมาตรและความเข้มข้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37835729",
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
            "rationale": "Semen can be collected with an artificial vagina on a phantom or a mare, by electro-ejaculation under anesthesia, or after pharmacological induction. The collection method influences the semen volume and concentration"
          }
        }
      ]
    },
    "equine-repro--eqrepro-ai--ejaculation-และส่วนประกอบของน้ำเชื้อ": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-ai--ejaculation-และส่วนประกอบของน้ำเชื้อ--v1",
          "statement": "การ ejaculate ประกอบด้วย emission ของ sperm และของเหลวจาก accessory glands เข้า urethra แล้วบีบออกผ่าน urethra",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1576554",
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
            "rationale": "important events of ejaculation include emission of sperm and the accessory gland fluids into the urethra, simultaneous closure of the bladder neck, and forceful ejaculation of the combined semen through the urethra."
          }
        }
      ]
    },
    "equine-repro--eqrepro-ai--semen-evaluation": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-ai--semen-evaluation--v1",
          "statement": "Motility เป็นพารามิเตอร์หลักของการประเมินน้ำเชื้อพ่อม้า และสัมพันธ์กับ fertility ของน้ำเชื้อสดหรือแช่แข็ง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37835729",
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
            "rationale": "Motility analysis remains a core parameter, as it is associated with fresh or frozen dose fertility."
          }
        }
      ]
    },
    "equine-repro--eqrepro-ai--handling-semen-extender-และน้ำเชื้อ-3-ชนิด": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-ai--handling-semen-extender-และน้ำเชื้อ-3-ชนิด--v1",
          "statement": "การผสมเทียมในม้าอาศัยน้ำเชื้อแช่เย็นที่ขนส่งเป็นหลัก และ sperm ม้าไวต่อความเย็นจนจำกัดระยะเวลาเก็บ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-42800388",
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
            "rationale": "Artificial insemination in horses largely relies on cooled transported semen, but stallion spermatozoa are highly sensitive to cold stress, limiting storage duration."
          }
        }
      ]
    },
    "equine-repro--eqrepro-ai--frozen-semen": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-ai--frozen-semen--v1",
          "statement": "พ่อม้าแต่ละตัวมีคุณภาพน้ำเชื้อหลังแช่แข็งต่างกันมาก ซึ่งเป็นข้อจำกัดสำคัญของอุตสาหกรรมม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27417910",
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
            "rationale": "Stallion-to-stallion variability in the quality of cryopreserved ejaculates postthaw affects the commercial acceptability of frozen semen and thus is a major constraint for the equine industry."
          }
        }
      ]
    },
    "equine-repro--eqrepro-ai--mare-preparation-เวลาผสม-และเทคนิค-intrauterine-insemination": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-ai--mare-preparation-เวลาผสม-และเทคนิค-intrauterine-insemination--v1",
          "statement": "ในม้าการตกไข่เหนี่ยวนำได้ด้วย hCG, rLH หรือ GnRH analogue (deslorelin) และตกไข่ราว 36 ชั่วโมงหลังให้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18554709",
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
            "rationale": "Ovulation is routinely induced with human chorionic gonadotropin (hCG), recombinant LH (rLH), or the GnRH analogue Deslorelin. On average, ovulation occurs approximately 36h after treatment"
          }
        }
      ]
    },
    "equine-repro--eqrepro-ai--post-insemination-management": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-ai--post-insemination-management--v1",
          "statement": "การตั้งท้องแฝดในแม่ม้าไม่พึงประสงค์ และการตรวจ ultrasound ระยะแรกทำให้จัดการลดเหลือตัวเดียวได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34624812",
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
            "rationale": "multiple pregnancies in mare are always undesirable, early ultrasound diagnosis makes possible management of twin pregnancies and extra embryo removal."
          }
        }
      ]
    }
  },
  "equine-repro--eqrepro-stallion-infect": {
    "equine-repro--eqrepro-stallion-infect--สาเหตุของ-infertility-ในพ่อม้า-ภาพรวม": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-stallion-infect--สาเหตุของ-infertility-ในพ่อม้า-ภาพรวม--v1",
          "statement": "Equine coital exanthema เกิดจาก herpesvirus ที่ทำรอยโรคที่อวัยวะเพศภายนอก และติดต่อผ่านการผสมพันธุ์เป็นหลัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40485269",
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
            "rationale": "Equine Coital Exanthema (ECE) is an endemic herpesvirus disease primarily affecting the external genitalia and impairing mating activities in horses. ... Transmission occurs primarily through mating activities"
          }
        }
      ]
    },
    "equine-repro--eqrepro-stallion-infect--behavioural-problems": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-stallion-infect--behavioural-problems--v1",
          "statement": "พ่อม้าส่วนใหญ่ปรับตัวกับการจัดการได้ และปัญหาพฤติกรรมแก้ได้ด้วยการตรวจและการปรับ housing กับ handling",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27726992",
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
            "rationale": "most domestic stallions can adapt to management and breeding programs. ... This article discusses veterinary evaluation as well as housing and handling strategies for addressing stallion breeding behavior problems."
          }
        }
      ]
    },
    "equine-repro--eqrepro-stallion-infect--problems-associated-with-ejaculation": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-stallion-infect--problems-associated-with-ejaculation--v1",
          "statement": "ความผิดปกติของ ejaculation ในพ่อม้าที่พบบ่อยคือ emission failure, ejaculation failure และปัสสาวะปนในน้ำเชื้อ และหลายรายมาจากปัญหา musculoskeletal หรือ psychogenic",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-1576554",
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
            "rationale": "In stallions, the most common ejaculation disorders are emission and ejaculation failure, and urine contamination of semen. ... In a large percentage of cases, an ejaculation appears to be a result of musculoskeletal disorders or to be psychogenic in nature"
          }
        }
      ]
    },
    "equine-repro--eqrepro-stallion-infect--poor-semen-quality-และ-azoospermia": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-stallion-infect--poor-semen-quality-และ-azoospermia--v1",
          "statement": "ใน stallion ที่ดูเหมือน ejaculate แต่ azoospermic ระดับ alkaline phosphatase ใน seminal plasma ที่ต่ำชี้ไปที่ blockage ของ excurrent duct หรือ retrograde ejaculation ส่วนระดับสูงชี้ไปที่ testicular defect",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22488664",
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
            "rationale": "If ALP activity is low, the possibility of either blockage to sperm outflow in the excurrent duct system or retrograde ejaculation should be pursued diagnostically. If ALP activity is high, the possibility of a testicular defect should be pursued diagnostically."
          }
        }
      ]
    },
    "equine-repro--eqrepro-stallion-infect--contagious-equine-metritis-cem": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-stallion-infect--contagious-equine-metritis-cem--v1",
          "statement": "T. equigenitalis แพร่ทาง infected semen ที่ส่งไป และทาง fomites ที่ปนเปื้อนใน stallion collection centre",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20889687",
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
            "rationale": "Shipment of infective semen and indirect venereal contact in stallion collection centers through the use of contaminated fomites were major factors in the spread of T. equigenitalis."
          }
        }
      ]
    },
    "equine-repro--eqrepro-stallion-infect--equine-herpesvirus-type-3-equine-coital-exanthema": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-stallion-infect--equine-herpesvirus-type-3-equine-coital-exanthema--v1",
          "statement": "Equine coital exanthema เกิดจาก equid alphaherpesvirus 3 ติดต่อทาง direct contact ระหว่างผสมพันธุ์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34451519",
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
            "rationale": "caused by equid alphaherpesvirus 3 (EHV-3). The infection is endemic worldwide and the virus is transmitted mainly through direct contact during sexual intercourse and by contaminated instruments during reproductive maneuvers in breeding facilities."
          }
        }
      ]
    },
    "equine-repro--eqrepro-stallion-infect--equine-viral-arteritis-eva": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-stallion-infect--equine-viral-arteritis-eva--v1",
          "statement": "EAV ทำให้ม้าแท้งและเกิด persistent infection ในโฮสต์ ซึ่งทำให้มีการขับไวรัสออกทางน้ำเชื้อและแพร่ทางเพศสัมพันธ์ และ EAV อยู่ใน family Arteriviridae",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29172072",
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
            "rationale": "they both cause abortion in pregnant animals and establish persistent infection in their natural hosts, which fosters viral shedding in semen leading to sexual transmission."
          }
        }
      ]
    },
    "equine-repro--eqrepro-stallion-infect--dourine-trypanosoma-equiperdum": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-stallion-infect--dourine-trypanosoma-equiperdum--v1",
          "statement": "Dourine เกิดจาก Trypanosoma equiperdum และแพร่โดยตรงจากสัตว์ตัวหนึ่งไปอีกตัวหนึ่งระหว่างผสมพันธุ์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41200335",
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
            "rationale": "Trypanosoma equiperdum is a protozoan parasite that causes the sexually transmitted disease known as \"dourine\" in horses. This chronic illness is directly spread from one animal to another during mating."
          }
        }
      ]
    }
  },
  "equine-repro--eqrepro-surgery": {
    "equine-repro--eqrepro-surgery--castration-วัตถุประสงค์และช่วงเวลาที่ทำ": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--castration-วัตถุประสงค์และช่วงเวลาที่ทำ--v1",
          "statement": "การตอนใช้เป็นมาตรการแก้พฤติกรรมทางเพศและความก้าวร้าวที่ไม่พึงประสงค์ในม้าพ่อพันธุ์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-4038698",
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
            "rationale": "When castration was examined as a therapeutic measure to eliminate sexual and aggressive behavior in stallions in which the behavior had become objectionable, it was found that the operation was effective on sexual behavior and aggression toward people in 60% to 70% of horses"
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--standing-castration-กับ-recumbent-castration": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--standing-castration-กับ-recumbent-castration--v1",
          "statement": "ม้าปกติตอนได้ทั้งแบบยืนด้วย sedation และ regional anaesthesia หรือแบบนอนด้วย general anaesthesia ส่วน cryptorchid ทำดีที่สุดภายใต้ general anaesthesia ในสถานที่ผ่าตัด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10451725",
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
            "rationale": "Castration of the normal horse can be performed using sedation and regional anaesthesia while the horse is standing, or under general anaesthesia when it is recumbent. Castration of cryptorchid horses is best performed under general anaesthesia at a surgical facility."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--castration-anesthesia-restraint-และ-local-anesthesia": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--castration-anesthesia-restraint-และ-local-anesthesia--v1",
          "statement": "ในการตอนม้าที่ได้ general anaesthesia มีการฉีดยาชาเข้า testis ข้างละ 10 mL (lidocaine เทียบกับ mepivacaine)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32090383",
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
            "rationale": "Thirty-four stallions were anaesthetised using xylazine-ketamine and randomly selected to receive 10 mL either lidocaine or mepivacaine injected into each testicle."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--open-castration-technique": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--open-castration-technique--v1",
          "statement": "ใน ambulatory practice ของสวีเดน การตอนแบบยืนด้วย open technique โดยไม่เย็บแผลเป็นที่นิยม ส่วนในโรงพยาบาลนิยม closed technique แบบเย็บแผล",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-43026618",
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
            "rationale": "In Sweden, standing, open castration with un-sutured incisions was preferred in ambulatory practice, whereas a closed, sutured technique dominated in the hospitals."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--closed-castration-technique": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--closed-castration-technique--v1",
          "statement": "ความเสี่ยง evisceration ดูเหมือนต่ำถ้าปิด parietal tunic เมื่อจบการผ่าตัด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38993145",
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
            "rationale": "Evisceration was most commonly reported in draught breeds and Standardbreds, and the risk appeared low if the parietal tunic was closed at the end of surgery."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--emasculator": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--emasculator--v1",
          "statement": "Serra และ Reimer emasculator ใช้บ่อยในการตอนม้า แต่ต่างกันที่ jaw profile และกลไกการห้ามเลือด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28636747",
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
            "rationale": "The Serra and Reimer emasculators are frequently used in equine orchiectomy. They differ in jaw profile and the mechanism by which they achieve haemostasis."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--post-operative-management-หลัง-castration": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--post-operative-management-หลัง-castration--v1",
          "statement": "อาการบวมหรือ oedema เป็นภาวะแทรกซ้อนที่รายงานบ่อยที่สุดหลังตอนม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38993145",
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
            "rationale": "Eighteen different complications were reported, with swelling or oedema being the most common."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--post-operative-complication-หลัง-castration": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--post-operative-complication-หลัง-castration--v1",
          "statement": "ภาวะแทรกซ้อนหลังตอนม้าที่รายงานได้แก่ บวม เลือดออกมาก eventration funiculitis peritonitis hydrocele และ penile damage",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10451725",
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
            "rationale": "Reported complications of castration include postoperative swelling, excessive haemorrhage, eventration, funiculitis, peritonitis, hydrocele, penile damage and continued stallion-like behaviour."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--cryptorchid": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--cryptorchid--v1",
          "statement": "cryptorchidectomy ทำด้วย standing laparoscopy หรือ open inguinal orchiectomy ภายใต้ general anaesthesia",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33371184",
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
            "rationale": "Cryptorchidectomy was achieved with standing laparoscopy (44/70 cases, 62.8%), or with open inguinal orchiectomy in general anesthesia (26/70 cases, 37.2%)."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--tumor-of-penis-และ-penile-circumcision-reefing": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--tumor-of-penis-และ-penile-circumcision-reefing--v1",
          "statement": "เนื้องอกของ penis และ prepuce ในม้า ได้แก่ squamous cell carcinoma, sarcoid และ melanoma",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26464915",
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
            "rationale": "The diagnosed neoplasms were penile and preputial squamous cell carcinomas (SCCs; n = 15); sarcoid (n = 4); a-fibrosarcoma; and a melanoma."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--amputation-of-penis": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--amputation-of-penis--v1",
          "statement": "partial phallectomy แบบ modified Vinsot ใช้ latex tourniquet และสร้าง linear urethrostomy",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20590499",
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
            "rationale": "Modifications to the original technique included creation of a linear urethrostomy, alteration of the location and shape of the urethrostomy, application of a latex tourniquet"
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--caslick-s-operation": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--caslick-s-operation--v1",
          "statement": "แม่ม้าที่ช่องคลอด (vulva) กว้างเสี่ยง pneumovagina ซึ่งทำให้ fertility ลดลง และรักษาด้วย Caslick operation ที่ลดขนาดช่อง vulva",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10343366",
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
            "rationale": "Mares with a large vulvar orifice have an increased risk of pneumovagina, which is associated with reduced fertility. Treatment is by means of the Caslick operation, by which size of the vulvar orifice is reduced."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--perineal-laceration-3-ระดับ-และ-recto-vaginal-fistula": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--perineal-laceration-3-ระดับ-และ-recto-vaginal-fistula--v1",
          "statement": "การผ่าตัดซ่อม third-degree perineal laceration หรือ rectovestibular fistula ในแม่ม้า ทำให้ 24 จาก 32 ตัวที่ถูกผสมตั้งท้องได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-3882647",
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
            "rationale": "Of 32 mares bred, 24 became pregnant, suggesting that surgical repair is indicated in any mare with sufficient genetic potential."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--endoscopic-removal-ของ-endometrial-cyst": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--endoscopic-removal-ของ-endometrial-cyst--v1",
          "statement": "endometrial cyst ที่อยู่ใน lumen ตัดออกได้ในม้ายืนด้วย endoscope และลวดที่คล้องที่ฐาน cyst แล้วตัดด้วยไฟฟ้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10573803",
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
            "rationale": "Endometrial cysts located in the lumen can be removed surgically from the standing mare. After placement of the endoscope, a wire is placed, via the biopsy channel, around the base of cyst, which is then cut through by cauterization."
          }
        }
      ]
    },
    "equine-repro--eqrepro-surgery--caesarean-section": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-surgery--caesarean-section--v1",
          "statement": "Dystocia พบไม่บ่อยในม้า และ caesarean section หรือการดึงลูกออกทำในราว 13.9% ของเคส",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39394153",
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
            "rationale": "Dystocia is rare in horses, but is life-threatening for mares and foals... A caesarean section or an extraction was performed in 13.9% of the cases."
          }
        }
      ]
    }
  },
  "equine-repro--eqrepro-pregnancy": {
    "equine-repro--eqrepro-pregnancy--early-pregnancy-0-40-วัน-oviductal-transportation-และ-pge2": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--early-pregnancy-0-40-วัน-oviductal-transportation-และ-pge2--v1",
          "statement": "ตัวอ่อนม้าเข้า uterus ที่ราว 144-156 ชั่วโมงหลัง ovulation โดย PGE2 จากตัวอ่อนช่วยคลายกล้ามเนื้อเรียบของ isthmus",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20681173",
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
            "rationale": "Equine embryos enter the uterus 144-156 h after ovulation... further onward movement of embryos to the uterus is facilitated by secretion of prostaglandin E2 (PGE2) by the embryos, which relaxes the smooth muscle of the isthmus."
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--endometrial-cups-ecg-และ-accessory-cl-35-60-วัน": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--endometrial-cups-ecg-และ-accessory-cl-35-60-วัน--v1",
          "statement": "endometrial cups สร้าง chorionic gonadotrophin (eCG) ที่กระตุ้นให้เกิด secondary corpora lutea ในรังไข่แม่ม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11999314",
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
            "rationale": "the thickened, annulate chorionic girdle, invades the maternal endometrium to form the unique endometrial cups. These secrete a chorionic gonadotrophin that synergizes with pituitary follicle-stimulating hormone to induce secondary luteal development"
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--mid-pregnancy-40-180-วัน-และ-placentation": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--mid-pregnancy-40-180-วัน-และ-placentation--v1",
          "statement": "เมื่อ chorioallantoic placenta พัฒนา progesterone ลดลงตามการหายไปของ endometrial cups และ eCG และถูกแทนด้วย 5α-dihydroprogesterone (5α-pregnane)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31252409",
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
            "rationale": "Progesterone declines as the endometrial cups and eCG disappears, replaced by 5α-dihydroprogesterone (DHP), a potent equine progesterone receptor (PR) agonist, as the chorioallantoic placenta develops."
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--late-pregnancy-180-340-วัน-และ-length-of-gestation": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--late-pregnancy-180-340-วัน-และ-length-of-gestation--v1",
          "statement": "อายุครรภ์เฉลี่ยของ Thoroughbred อยู่ราว 344 วัน และช่วง 315-388 วันให้ลูกมีชีวิตได้ทั้งหมด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12417119",
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
            "rationale": "An average gestation length of 344.1 +/- 0.49 days was evident... the gestation length range (315-388 days), all resulting in viable foals is noteworthy and of clinical importance"
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--routine-pregnancy-checks-และ-twin-management": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--routine-pregnancy-checks-และ-twin-management--v1",
          "statement": "ท้องแฝดในม้าไม่พึงประสงค์ และต้องวินิจฉัยตั้งแต่ mobility phase (ก่อน fixation ราว day 16-17) จึงจัดการ twin reduction ได้ผลดี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-38594910",
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
            "rationale": "Twin gestation in the mare is undesirable and can have disastrous consequences... A pregnancy diagnosis in the mobility phase is imperative for a good outcome in the event of twin reduction."
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--routine-care-of-pregnant-mare": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--routine-care-of-pregnant-mare--v1",
          "statement": "EHV-1 ทำให้แม่ม้าท้องแท้ง และ vaccination ยังเป็นวิธีป้องกันหลัก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32172913",
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
            "rationale": "Respiratory distress, abortion in pregnant mares, neurological disorders, and neonatal foal deaths represent EHV-1 infection. Despite the limited success of inactivated, subunit, live, and DNA vaccines, ... vaccination remains the prime preventive option"
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--mammary-gland-colostrum-และสัญญาณใกล้คลอด": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--mammary-gland-colostrum-และสัญญาณใกล้คลอด--v1",
          "statement": "เมื่อ calcium carbonate ในสารคัดหลั่งเต้านมก่อนคลอด ≥ 200 ppm แม่ม้าราว 51% คลอดใน 24 ชั่วโมง และ 97% ใน 72 ชั่วโมง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16727305",
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
            "rationale": "prefoaling mammary secretion calcium carbonate >/= 200 ppm) indicated that 51.4% of late term pregnant mares would foal within the ensuing 24-hour period, 84.1% within 48 hours and 97.2% within 72 hours."
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--stages-of-parturition": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--stages-of-parturition--v1",
          "statement": "การคลอดลูกใน Stage II ที่ล่าช้าเกิน 40 นาทีสัมพันธ์กับอัตราตายของลูกม้าที่เพิ่มขึ้นอย่างมีนัยสำคัญ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22594021",
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
            "rationale": "A delay in foal delivery beyond 40 min of Stage II of labour was associated with a significant increase in foal mortality."
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--hormonal-regulation-และสรุปของส่วนแม่ม้า": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--hormonal-regulation-และสรุปของส่วนแม่ม้า--v1",
          "statement": "eCG จาก endometrial cups กระตุ้น luteal steroidogenesis และ DHEA จาก fetal gonad เป็นสารตั้งต้นของ oestrone sulphate จากรก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31252409",
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
            "rationale": "stimulation of luteal steroidogeneisis by equine chorionic gonadotropin (eCG) from the endometrial cups... Foetal gonadal dehydroepiandrosterone fuels placental oestrone sulphate secretion"
          }
        }
      ]
    },
    "equine-repro--eqrepro-pregnancy--maternal-recognition-of-pregnancy-ในแม่ม้า": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-pregnancy--maternal-recognition-of-pregnancy-ในแม่ม้า--v1",
          "statement": "สัญญาณ maternal recognition of pregnancy ในม้ายังไม่มีการระบุตัวได้ชัดเจน โดยการทดลองที่พยายามพิสูจน์ว่า estrogen จากตัวอ่อนเป็นตัวยืดอายุ corpus luteum ให้ผลไม่สรุป ส่วนกลไกที่ยืนยันได้คือการลดการหลั่ง PGF2alpha จาก endometrium ผ่านการลด expression ของเอนไซม์สังเคราะห์ prostaglandin และการลด oxytocin receptor ตรงกับที่สไลด์บอกว่าสารตัวนี้ยังไม่ทราบชื่อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26450499",
              "locator": "Abstract, maternal recognition section (vol 216, pp 165-188)",
              "kind": "journal"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-08-09",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "During maternal recognition of pregnancy, endometrial PGF2alpha release is attenuated, a consequence of reduced expression of key enzymes involved in prostaglandin production... Results of experiments attempting to prove that conceptus-deri"
          }
        }
      ]
    }
  },
  "equine-repro--eqrepro-postpartum": {
    "equine-repro--eqrepro-postpartum--post-parturition-check-ของแม่ม้า": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-postpartum--post-parturition-check-ของแม่ม้า--v1",
          "statement": "รกค้าง (retained fetal membranes) เป็นภาวะหลังคลอดที่พบบ่อยที่สุดในแม่ม้า จึงต้องตรวจว่ารกออกครบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31279434",
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
            "rationale": "Retained fetal membranes are the most common postpartum condition in mares. Although the incidence of retained fetal membranes is low, the consequences for the health of the mare can be severe"
          }
        }
      ]
    },
    "equine-repro--eqrepro-postpartum--intrapartum-conditions-1-red-bag-abortion-และ-uterine-inertia": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-postpartum--intrapartum-conditions-1-red-bag-abortion-และ-uterine-inertia--v1",
          "statement": "premature placental separation ของ chorioallantois เป็นปัจจัยเสี่ยงสำคัญของภาวะขาดออกซิเจนในลูกม้า",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35622344",
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
            "rationale": "Equine premature placental separation (PPS) is poorly understood and represents an important risk factor for fetal/neonatal hypoxia."
          }
        }
      ]
    },
    "equine-repro--eqrepro-postpartum--intrapartum-conditions-2-premature-mammary-development-placental": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-postpartum--intrapartum-conditions-2-premature-mammary-development-placental--v1",
          "statement": "ในม้าที่เกิด placentitis จากการทดลอง การให้ trimethoprim sulfamethoxazole, pentoxifylline และ altrenogest (progestin) ทำให้คลอดลูกมีชีวิต 83% เทียบกับ 0% ในกลุ่มไม่รักษา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-20416936",
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
            "rationale": "More mares in Group TREAT delivered viable foals (10/12; 83%; P < 0.05) than mares in Group UNTREAT (0/5; 0%)."
          }
        }
      ]
    },
    "equine-repro--eqrepro-postpartum--intrapartum-conditions-3-uterine-torsion-retained-fetal-membrane": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-postpartum--intrapartum-conditions-3-uterine-torsion-retained-fetal-membrane--v1",
          "statement": "uterine torsion เป็นภาวะแทรกซ้อน 5-10% ของช่วง trimester สุดท้ายในม้า และแก้ด้วยการผ่าตัดเปิดสีข้างหรือ midline",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-40993602",
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
            "rationale": "Uterine torsion in mares belongs to maternal pregnancy disorders, accounting for 5-10% of complications in the last trimester of pregnancy. Two surgical techniques for repositioning uterine torsion are used"
          }
        }
      ]
    },
    "equine-repro--eqrepro-postpartum--dystocia": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-postpartum--dystocia--v1",
          "statement": "Dystocia พบ 10.1% ของการคลอดในงานศึกษา 1047 ราย และสาเหตุที่พบบ่อยที่สุดคือความผิดปกติของ posture ลูก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-22594021",
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
            "rationale": "Dystocia occurred in 10.1% of all births... The most common cause of dystocia was abnormalities of fetal posture."
          }
        }
      ]
    },
    "equine-repro--eqrepro-postpartum--post-partum-breeding-foal-heat": {
      "claims": [
        {
          "id": "equine-repro--eqrepro-postpartum--post-partum-breeding-foal-heat--v1",
          "statement": "Pregnancy rate ของแม่ม้าที่ผสมที่ foal heat ต่ำกว่าที่ผสมที่ heat ครั้งที่สอง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32534765",
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
            "rationale": "PregR in mares bred on FH was lower compared with SH (P < .01)"
          }
        }
      ]
    }
  }
};
