// ============================================================
// VetWiki — reference-verification overlay, Swine Medicine notes of 2569
// ============================================================
// One claim per section added on 15 Nov 2026, each cross-checked against a real
// external source (./sources.js): the supporting words of the source are quoted
// in the claim's `review.rationale`, and a second reader fetched the source again
// and found them there. verification.js merges this overlay in code with the
// curated and the generated ones, so no key of one object literal can shadow another.
// ============================================================

/** @type {Record<string, Record<string, {claims: object[]}>>} */
export const SWINE_CLINIC_VERIFICATIONS = {
  "swine-clinic--swine-ileitis-bacti": {
    "swine-clinic--swine-ileitis-bacti--ภาพรวมโรคทางเดินอาหารสุกร-และแนวทางแยกสาเหตุ": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--ภาพรวมโรคทางเดินอาหารสุกร-และแนวทางแยกสาเหตุ--v1",
          "statement": "การพบเชื้อก่อโรคท้องเสียในลูกสุกรสัมพันธ์กับอายุ โดย Isospora suis (coccidiosis) พบเด่นในลูกสุกรดูดนมช่วงสัปดาห์ที่ 2-3 ของชีวิต (อายุ 1-3 สัปดาห์)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11315526",
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
            "rationale": "The occurrence of the pathogens was significantly associated with the age of the animals examined (P < 0.001). Isospora suis was predominantly isolated from suckling piglets (in the second and third week of life)"
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--proliferative-enteropathy-ileitis-ชื่อ-รูปแบบ-สาเหตุ-และพยาธิกำเ": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--proliferative-enteropathy-ileitis-ชื่อ-รูปแบบ-สาเหตุ-และพยาธิกำเ--v1",
          "statement": "Proliferative enteropathy เกิดจาก Lawsonia intracellularis ซึ่งเป็นแบคทีเรีย obligate intracellular และมีลักษณะเด่นคือลำไส้หนาตัวจากการเพิ่มจำนวนของ enterocyte",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24476941",
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
            "rationale": "Proliferative enteropathy is an infectious disease caused by an obligate intracellular bacterium, Lawsonia intracellularis, and characterized by thickening of the intestinal epithelium due to enterocyte proliferation."
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--proliferative-enteropathy-การวินิจฉัย": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--proliferative-enteropathy-การวินิจฉัย--v1",
          "statement": "Indirect ELISA ที่ใช้เชื้อ Lawsonia intracellularis ที่ผ่าน sonication เป็น antigen (sonicated whole cell antigen) มี sensitivity 89.8% และ specificity 99.4%",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18319429",
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
            "rationale": "an indirect enzyme-linked immunosorbent assay (ELISA) using a sonicated pure culture of Lawsonia intracellularis as the antigen (So-ELISA). ... The optimal cut-off for So-ELISA was set at 0.45 OD with 89.8% sensitivity and 99.4% specificity"
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--proliferative-enteropathy-การแพร่-การรักษา-วัคซีน-และยาฆ่าเชื้อ": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--proliferative-enteropathy-การแพร่-การรักษา-วัคซีน-และยาฆ่าเชื้อ--v1",
          "statement": "MIC ของยาต่อ L. intracellularis ทดสอบด้วย tissue culture และหมายถึงความเข้มข้นต่ำสุดที่ยับยั้งการโตของเชื้อได้ 99% โดย carbadox, tiamulin และ valnemulin ออกฤทธิ์ดีที่สุดต่อเชื้อในเซลล์ (intracellular MIC ต่ำที่สุด)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-18823723",
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
            "rationale": "The MIC of each antimicrobial against L. intracellularis was determined using a tissue culture system and was identified as the lowest concentration that inhibited 99% of L. intracellularis growth ... When tested for intracellular activity, carbadox, tiamulin, and valnemulin were the most active antimicrobials"
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--clostridial-enteritis-ในลูกสุกรแรกเกิด": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--clostridial-enteritis-ในลูกสุกรแรกเกิด--v1",
          "statement": "C. perfringens type C ก่อ necrotic enteritis ที่รุนแรงถึงตายในลูกสุกรแรกเกิด และป้องกันได้ด้วยการให้ toxoid แก่แม่สุกรก่อนคลอดร่วมกับสุขาภิบาลที่ดี",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-31955664",
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
            "rationale": "Clostridium perfringens type C causes severe and lethal necrotic enteritis (NE) in newborn piglets. ... Prevention of the disease is achieved by immunization of pregnant sows with C. perfringens type C toxoid vaccines, combined with proper sanitation on farms."
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--brachyspira-swine-dysentery-และ-colonic-spirochetosis": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--brachyspira-swine-dysentery-และ-colonic-spirochetosis--v1",
          "statement": "Swine dysentery ทำให้ท้องเสียมีมูกและเลือด พบบ่อยในสุกรรุ่นและขุน โดยลำไส้ใหญ่อักเสบแบบมีมูกเลือด (mucohemorrhagic typhlocolitis) หลังติดเชื้อ Brachyspira ชนิด strong hemolysis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27288432",
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
            "rationale": "Swine dysentery is a severe enteric disease in pigs, which is characterized by bloody to mucoid diarrhea ... most often observed in grower-finisher pigs, wherein susceptible pigs develop a significant mucohemorrhagic typhlocolitis following infection with strongly hemolytic spirochetes of the genus Brachyspira."
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--yersinia-infection": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--yersinia-infection--v1",
          "statement": "Y. enterocolitica ทนอุณหภูมิต่ำได้ ติดต่อสู่คนทางอาหาร และมีสุกรเป็นแหล่งรังโรคหลัก จึงเป็นประเด็น zoonosis ที่สำคัญทางสาธารณสุข",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-41012721",
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
            "rationale": "Y. enterocolitica is a cold-tolerant, foodborne pathogen that poses a significant risk to public health, with pigs identified as its main reservoir."
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--mastitis-metritis-agalactia-syndrome-mma": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--mastitis-metritis-agalactia-syndrome-mma--v1",
          "statement": "Endotoxin จาก E. coli รบกวนฮอร์โมนการสร้างน้ำนม โดยกดระดับ prolactin ในแม่สุกรหลังคลอด ซึ่งอาจเป็นสาเหตุของการไม่มีน้ำนม (lactation failure)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-6369541",
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
            "rationale": "An endotoxin produced by Escherichia coli caused a decrease in prolactin concentrations in the plasma of sows when given at low dosages 2 days postpartum. ... Some cases of lactation failure in the periparturient sow may thus be due to endotoxins suppressing prolactin concentrations."
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--colibacillosis-enterotoxigenic-e-coli-และ-edema-disease": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--colibacillosis-enterotoxigenic-e-coli-และ-edema-disease--v1",
          "statement": "ETEC ก่อท้องเสียทั้งในลูกสุกรแรกเกิดและหลังหย่านม โดยสายพันธุ์ก่อโรคจำแนกตาม fimbria เช่น K88, K99 และ 987P และสร้าง enterotoxin ได้แก่ LT, STa และ STb",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28794894",
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
            "rationale": "The ETEC causing neonatal colibacillosis mostly carry the fimbriae F4 (k88), F5 (k99), F6 (987P) or F41, while the ETEC of post-weaning diarrhoea carry the fimbriae F4 (k88) and F18. ... such as the heat stable toxin a (STa), the heat stable toxin b (STb), and the heat labile toxin (LT)."
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--campylobacter-species": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--campylobacter-species--v1",
          "statement": "Campylobacter สำคัญในแง่ zoonosis จากอาหาร โดยสุกรเป็นแหล่งรังโรคหลักของ C. coli และเป็นแหล่งเชื้อสู่คนได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32046038",
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
            "rationale": "Campylobacter spp. are among the microorganisms most commonly associated with foodborne disease. Swine are known to be the main reservoir of Campylobacter coli and a possible source infection of humans as a result of carcass contamination at slaughter."
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--salmonellosis-ในสุกร": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--salmonellosis-ในสุกร--v1",
          "statement": "รูปแบบ septicemic salmonellosis ในสุกรมักเกิดจาก S. choleraesuis ส่วนรูปแบบ enteric salmonellosis มักเกิดจาก S. typhimurium",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-793690",
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
            "rationale": "Animals dying with the septicemic form usually yielded Salmonella choleraesuis var. kunzendorf on culture. Salmonella typhimurium was the usual isolate from cases of enteric salmonellosis."
          }
        }
      ]
    },
    "swine-clinic--swine-ileitis-bacti--coccidiosis-balantidiasis-yeast-infection-และ-gastric-ulcer": {
      "claims": [
        {
          "id": "swine-clinic--swine-ileitis-bacti--coccidiosis-balantidiasis-yeast-infection-และ-gastric-ulcer--v1",
          "statement": "Swine coccidiosis เกิดจาก Isospora suis ทำให้ลูกสุกรท้องเสีย เชื้อเจริญแบบ asexual และ sexual ในเซลล์บุผิวลำไส้ และรอยโรคอยู่ที่ jejunum และ ileum",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7352366",
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
            "rationale": "Isospora suis, when inoculated into piglets, produced diarrhea, dehydration, weight loss and death. Gross lesions were characterized by a fibrino-necrotic membrane within the jejunum and ileum. ... Asexual and sexual stages of I. suis were seen within the intestinal epithelium"
          }
        }
      ]
    }
  },
  "swine-clinic--swine-trichinosis": {
    "swine-clinic--swine-trichinosis--ทริคิโนซิส-สถานะทางกฎหมาย-เชื้อ-และโฮสต์": {
      "claims": [
        {
          "id": "swine-clinic--swine-trichinosis--ทริคิโนซิส-สถานะทางกฎหมาย-เชื้อ-และโฮสต์--v1",
          "statement": "โรคทริคิเนลลาอยู่ในรายชื่อ \"โรคระบาด\" ตามพระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558 ร่วมกับโรคอื่น เช่น โรคอหิวาต์สุกร โรคสมองอักเสบนิปาห์ และโรคปากและเท้าเปื่อย",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-animal-epidemics-act-b-e-2558-2015-english-translation-p",
              "locator": "Section 4, definition of “epidemic”",
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
            "rationale": "“epidemic” means duck plague, avian influenza, salmonellosis, trichinosis, Newcastle disease, brucellosis, foot and mouth disease, rabies, rinderpest, leptospirosis, equine infectious anemia, mad cow disease, Nipah encephalitis, swine fever"
          }
        }
      ]
    },
    "swine-clinic--swine-trichinosis--ทริคิโนซิส-วงชีวิต": {
      "claims": [
        {
          "id": "swine-clinic--swine-trichinosis--ทริคิโนซิส-วงชีวิต--v1",
          "statement": "ตัวอ่อนที่กินเข้าไปถูกย่อยออกจากเนื้อแล้วโตเป็นตัวเต็มวัยในลำไส้เล็ก ตัวเมียออกตัวอ่อนซึ่งเข้าระบบน้ำเหลืองและกระแสเลือด กระจายทั่วร่างกายแล้วฝังตัวในกล้ามเนื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "woah-terrestrial-manual-2024",
              "locator": "Chapter 3.1.22 Trichinellosis (infection with Trichinella spp.), section A Introduction",
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
            "rationale": "larvae (L1) are released by digestion and burrow into the villi of the small intestine. They develop into adults ... females release new-born larvae (NBL), which migrate via venules and lymphatics into the general circulation. The NBL are distributed throughout the body where they invade striated muscle cells"
          }
        }
      ]
    },
    "swine-clinic--swine-trichinosis--ทริคิโนซิส-อาการในสัตว์และในคน": {
      "claims": [
        {
          "id": "swine-clinic--swine-trichinosis--ทริคิโนซิส-อาการในสัตว์และในคน--v1",
          "statement": "ในคน ระยะที่พยาธิตัวแก่อยู่ในลำไส้เล็กมีอาการปวดท้อง อาเจียน และท้องเดิน ส่วนระยะที่ตัวอ่อนไชเข้ากล้ามเนื้อมีไข้ ปวดกล้ามเนื้อ เปลือกตาบวม ตาแดง ผื่น และเลือดออกใต้เล็บ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-trichinellosis-dpdx-laboratory-identification-of-parasit",
              "locator": "Parasite Biology, Clinical Presentation",
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
            "rationale": "Intestinal invasion can be accompanied by gastrointestinal symptoms (diarrhea, abdominal pain, vomiting). Larval migration into muscle tissues (one week after infection) can cause periorbital and facial edema, conjunctivitis, fever, myalgias, splinter hemorrhages, rashes, and peripheral eosinophilia."
          }
        }
      ]
    },
    "swine-clinic--swine-trichinosis--ทริคิโนซิส-การวินิจฉัย-การรักษา-และการควบคุม": {
      "claims": [
        {
          "id": "swine-clinic--swine-trichinosis--ทริคิโนซิส-การวินิจฉัย-การรักษา-และการควบคุม--v1",
          "statement": "การวินิจฉัยทริคิโนซิสอาศัยผลตรวจเลือดที่ eosinophil สูงกว่าปกติมาก และการตัดชิ้นเนื้อจากกล้ามเนื้อไปตรวจทางปรสิตวิทยา",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12150691",
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
            "rationale": "High eosinophilia and increased creatine phosphokinase activity are the most frequently observed laboratory features and the parasitological examination of a muscle biopsy and the detection of specific circulating antibodies will confirm the diagnosis."
          }
        }
      ]
    },
    "swine-clinic--swine-trichinosis--ทริคิโนซิสในประเทศไทย": {
      "claims": [
        {
          "id": "swine-clinic--swine-trichinosis--ทริคิโนซิสในประเทศไทย--v1",
          "statement": "รายงานทริคิโนซิสในคนครั้งแรกของประเทศไทยเกิดในปี พ.ศ. 2505 (ค.ศ. 1962) ที่อำเภอแม่สะเรียง จังหวัดแม่ฮ่องสอน และการระบาดพบมากในภาคเหนือ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-17072975",
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
            "rationale": "The earliest record of trichinosis in Thailand was in 1962 in the Mae Sariang District, Mae Hong Son Province. ... The outbreaks were more common in the northern areas, especially in rural areas where people ate raw or under-cooked pork and/or wild animals."
          }
        }
      ]
    },
    "swine-clinic--swine-trichinosis--ทริพพาโนโซโมซิส-trypanosomosis-ในสุกร": {
      "claims": [
        {
          "id": "swine-clinic--swine-trichinosis--ทริพพาโนโซโมซิส-trypanosomosis-ในสุกร--v1",
          "statement": "การติดเชื้อ Trypanosoma evansi ในสุกรมักไม่แสดงอาการชัด แต่พบไข้ โลหิตจาง (ซีด) ผอม แท้งลูก และอาการทางประสาท เช่น อัมพาต ได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-24024184",
              "locator": "full text (PMC3760267), section 6.4 Pigs",
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
            "rationale": "Infection in pigs has long been reported as very mild or symptomless ... Pig infection is often chronic with not only intermittent fever, anaemia, loss of weight, abortion, and cutaneous rash, but also late nervous evolution, with hind leg paralysis"
          }
        }
      ]
    }
  },
  "swine-clinic--swine-csf": {
    "swine-clinic--swine-csf--ภาพรวมลักษณะโรค-csf": {
      "claims": [
        {
          "id": "swine-clinic--swine-csf--ภาพรวมลักษณะโรค-csf--v1",
          "statement": "ลักษณะโรค CSF ขึ้นกับ 2 ฝั่ง คือ host factors และ viral factors จึงแสดงออกเป็นกลุ่มอาการได้หลายแบบ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28430168",
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
            "rationale": "Depending on both virus and host factors, a wide range of clinical syndromes can be observed and thus, laboratory confirmation is mandatory."
          }
        }
      ]
    },
    "swine-clinic--swine-csf--อาการ-atypical-กับ-typical-signs": {
      "claims": [
        {
          "id": "swine-clinic--swine-csf--อาการ-atypical-กับ-typical-signs--v1",
          "statement": "Atypical signs ของ CSF ได้แก่ fever, inappetence, gastrointestinal signs และ conjunctivitis ส่วน typical signs ได้แก่ ataxia, paresis and paralysis, convulsions, cyanosis และเลือดออกที่ผิวหนัง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28430168",
              "locator": "Section 3, Clinical Signs and Pathomorphological Lesions",
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
            "rationale": "unspecific (often referred to as “atypical”) clinical signs like high fever, anorexia, gastrointestinal symptoms, general weakness, and conjunctivitis ... neurological signs can occur including incoordination, paresis, paralysis and convulsions. At the same time, skin hemorrhages or cyanosis can appear"
          }
        }
      ]
    },
    "swine-clinic--swine-csf--รอยโรค-และ-congenital-csf": {
      "claims": [
        {
          "id": "swine-clinic--swine-csf--รอยโรค-และ-congenital-csf--v1",
          "statement": "Congenital CSF ทำให้เกิด abortion, fetal mummification และ stillbirths และ splenic infarcts เป็นรอยโรคหนึ่งของ CSF",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28430168",
              "locator": "Section 3, Clinical Signs and Pathomorphological Lesions",
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
            "rationale": "leads to absorption or mummification of the fetuses and to abortions or stillbirth ... Splenic infarctions can occur and are considered pathognomic for CSF"
          }
        }
      ]
    },
    "swine-clinic--swine-csf--การดำเนินโรค-acute-chronic-late-onset-และการติดเชื้อในแม่อุ้มท้อ": {
      "claims": [
        {
          "id": "swine-clinic--swine-csf--การดำเนินโรค-acute-chronic-late-onset-และการติดเชื้อในแม่อุ้มท้อ--v1",
          "statement": "Late-onset course เกิดจากการติดเชื้อก่อนคลอดช่วงอุ้มท้อง 50-70 วัน เกิด immunotolerance ลูกสุกรเป็น persistent infection ที่ดูปกติอยู่หลายเดือนแล้วตายในที่สุด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28430168",
              "locator": "Section 3, Clinical Signs and Pathomorphological Lesions",
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
            "rationale": "When infected between days 50 and 70 of pregnancy, an immunotolerance phenomenon can be induced and persistently infected offspring are born. The problem is that those piglets seem to be healthy and survive for several months but die due to the so-called late onset form of CSF."
          }
        }
      ]
    },
    "swine-clinic--swine-csf--pathogenesis-และระบาดวิทยา": {
      "claims": [
        {
          "id": "swine-clinic--swine-csf--pathogenesis-และระบาดวิทยา--v1",
          "statement": "CSFV แบ่งตัวครั้งแรกที่ tonsil ต่อไป regional lymph nodes แล้วเข้ากระแสเลือด (viremia) ไปยัง spleen, bone marrow และ lymph nodes",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28430168",
              "locator": "Section 4, Pathogenesis and Immune Responses",
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
            "rationale": "Infection with CSFV is followed by primary replication in the tonsils ... The virus reaches the regional lymph nodes through lymphatic vessels. Here further replication takes place and the virus is spread via blood to secondary replication sites such as spleen, bone marrow, and visceral lymph nodes"
          }
        }
      ]
    },
    "swine-clinic--swine-csf--การตรวจทางห้องปฏิบัติการ": {
      "claims": [
        {
          "id": "swine-clinic--swine-csf--การตรวจทางห้องปฏิบัติการ--v1",
          "statement": "ข้อเสียของการตรวจแอนติบอดีต่อ CSFV คือ cross reaction กับ pestivirus อื่น เช่น BVDV และ BDV",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "woah-terrestrial-manual-2024",
              "locator": "Chapter 3.9.3 Classical swine fever (infection with classical swine fever virus), section B.2.3 Comparative neutralisation test",
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
            "rationale": "Sera from pigs infected with BVDV, BDV or other pestiviruses may show cross-neutralising antibody titres that react in the FAVN or NPLA and produce false positive results indicating the pigs were infected with CSFV."
          }
        }
      ]
    },
    "swine-clinic--swine-csf--วัคซีน-csf-mlv-การทำวัคซีนแม่-และระดับ-sn-titer": {
      "claims": [
        {
          "id": "swine-clinic--swine-csf--วัคซีน-csf-mlv-การทำวัคซีนแม่-และระดับ-sn-titer--v1",
          "statement": "MLV vaccines ของ CSF เป็นวัคซีนที่ highly efficient and safe และให้ protection ได้เร็วภายใน 5 วันหลังฉีด",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28430168",
              "locator": "Section 7, Vaccination, and Section 4, Pathogenesis and Immune Responses",
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
            "rationale": "Highly efficacious and safe live-attenuated CSF vaccines have existed for decades ... Immunization with live attenuated CSFV can be efficient as early as 3–5 days post vaccination"
          }
        }
      ]
    },
    "swine-clinic--swine-csf--วัคซีนล้มเหลว-คำถามใหม่-และบทเรียนจากเกาะเชจู": {
      "claims": [
        {
          "id": "swine-clinic--swine-csf--วัคซีนล้มเหลว-คำถามใหม่-และบทเรียนจากเกาะเชจู--v1",
          "statement": "เกาะเชจูปลอด CSF และหยุดทำวัคซีนในปี 1999 แล้ว CSF กลับมาระบาดต่อเนื่องหลังวัคซีนสายพันธุ์ LOM ถูกนำเข้าไปโดยไม่ตั้งใจในปี 2014",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-29553332",
              "locator": "full text (PMC5875281), main text",
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
            "rationale": "Jeju Island, South Korea, became a classical swine fever virus (CSFV)–free area, and vaccination efforts ceased there in 1999 ... Since CSFV vaccine was accidentally introduced onto Jeju Island in 2014, continuous LOM outbreaks have occurred"
          }
        }
      ]
    }
  },
  "swine-clinic--swine-asf": {
    "swine-clinic--swine-asf--ภาพรวม-high-fatality-ยังไม่มีวัคซีน-จึงเหลือ-prevent-detect-resp": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--ภาพรวม-high-fatality-ยังไม่มีวัคซีน-จึงเหลือ-prevent-detect-resp--v1",
          "statement": "ASF มี high fatality (mortality เข้าใกล้ 100%) และสิ่งที่ทำได้คือ Prevent, Detect, Respond",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32582778",
              "locator": "abstract, and full text (PMC7296109), Introduction",
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
            "rationale": "Prevention, early detection, prompt reaction, and communication play a crucial role in African swine fever (ASF) control. ... most isolates of ASFV cause acute hemorrhagic fever in domestic pigs and result in mortality nearing 100%"
          }
        }
      ]
    },
    "swine-clinic--swine-asf--ประวัติการแพร่ระบาดทั่วโลก-และ-asf-ในไทย": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--ประวัติการแพร่ระบาดทั่วโลก-และ-asf-ในไทย--v1",
          "statement": "ASFV มี 24 genotypes โดย genotype 2 เข้า Georgia ในปี 2007 แล้วแพร่ไปยุโรปและเอเชีย และไทยยืนยัน ASF อย่างเป็นทางการในปี 2022",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39272387",
              "locator": "abstract, and full text (PMC11394130), section 1 Introduction",
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
            "rationale": "Of the 24 identified ASFV genotypes, genotype II is the primary cause for the pandemic occurring in Europe and Asia since its emergence in Georgia in 2007. ... In 2022, Thailand officially announced its first case of ASF"
          }
        }
      ]
    },
    "swine-clinic--swine-asf--host-ของ-asfv": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--host-ของ-asfv--v1",
          "statement": "Wild suids ของแอฟริกาที่เป็น host ของ ASFV ได้แก่ common warthogs (Phacochoerus africanus), bushpigs (Potamochoerus larvatus) และ red river hogs (Potamochoerus porcus)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32509811",
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
            "rationale": "African wild swine like bushpigs (Potamochoerus larvatus), red river hogs (Potamochoerus porcus), and warthogs (Phacochoerus africanus) can be infected by ASFV showing no clinical signs of disease and acting as natural reservoir hosts."
          }
        }
      ]
    },
    "swine-clinic--swine-asf--etiology-african-swine-fever-virus-asfv": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--etiology-african-swine-fever-virus-asfv--v1",
          "statement": "ASFV อยู่ใน family Asfarviridae genus Asfivirus และแบ่งได้ 24 genotypes ด้วย genetic variation ที่ p72 marker",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "woah-terrestrial-manual-2024",
              "locator": "Chapter 3.9.1 African swine fever (infection with African swine fever virus), Summary and section A Introduction",
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
            "rationale": "ASFV is the only member of the Asfarviridae family, genus Asfivirus. ... sequencing of the 3’ terminal end of the B646L open reading frame encoding the p72 protein major capsid protein, which differentiates up to 24 distinct genotypes"
          }
        }
      ]
    },
    "swine-clinic--swine-asf--ความทนทานของไวรัส-การทำลายเชื้อ-และการทำความสะอาด": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--ความทนทานของไวรัส-การทำลายเชื้อ-และการทำความสะอาด--v1",
          "statement": "ASFV ถูกทำลายด้วยความร้อนที่ 56°C 70 นาที หรือ 60°C 20 นาที ทน pH ช่วง 3.9-11.5 และ serum เพิ่มความทนทาน เช่นที่ pH 13.4 อยู่ได้ 21 ชั่วโมงถ้าไม่มี serum แต่ 7 วันถ้ามี serum",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "web-african-swine-fever-oie-technical-disease-card-2019",
              "locator": "Aetiology, Resistance to physical and chemical action (p.1)",
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
            "rationale": "Heat inactivated by 56°C/70 minutes; 60°C/20 minutes. pH: Inactivated by pH <3.9 or >11.5 in serum-free medium. Serum increases the resistance of the virus, e.g. at pH 13.4 – resistance lasts up to 21 hours without serum, and 7 days with serum."
          }
        }
      ]
    },
    "swine-clinic--swine-asf--clinical-courses-peracute-acute-subacute-chronic": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--clinical-courses-peracute-acute-subacute-chronic--v1",
          "statement": "Peracute ASF จากสายพันธุ์ highly virulent มี clinical course เร็วมาก ไข้สูงถึง 42°C และตายเฉียบพลันโดยไม่แสดงอาการได้ ส่วน acute ASF มี mortality อาจถึง 100% ภายใน 7 วัน",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32509811",
              "locator": "full text (PMC7248413), Peracute ASF and Acute ASF: Clinical Signs and Lesions",
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
            "rationale": "Highly virulent strains are typically responsible for this clinical course, characterized by a very rapid clinical course, with high fever (up to 42°C), anorexia, lethargy, and sometimes sudden death without signs of disease. ... the mortality rates may reach up to 100% in affected farms within 7 days"
          }
        }
      ]
    },
    "swine-clinic--swine-asf--pathogenesis": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--pathogenesis--v1",
          "statement": "ใน ASF แบบ acute และ subacute เกิด vascular changes รุนแรง รวมถึง disseminated intravascular coagulation (DIC)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-23376310",
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
            "rationale": "In acute and subacute forms of ASF, severe vascular changes are present, with hemorrhages in different organs (mainly melena, epistaxis, erythema, renal petechiaes and diffuse hemorrhages in lymph nodes), pulmonary edema, disseminate intravascular coagulation and thrombocytopenia."
          }
        }
      ]
    },
    "swine-clinic--swine-asf--ระบาดวิทยา-วงจรโรค-และการแพร่ในฟาร์ม": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--ระบาดวิทยา-วงจรโรค-และการแพร่ในฟาร์ม--v1",
          "statement": "ในสุกรที่ติดเชื้อ ASFV เลือด (blood) มี virus titers สูงกว่า nasal fluid และ rectal fluid",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25256695",
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
            "rationale": "Close to the onset of clinical signs, higher ASFV titres were found in blood compared with nasal and rectal fluid samples among all pigs."
          }
        }
      ]
    },
    "swine-clinic--swine-asf--การแพร่ในยุคปัจจุบัน-modern-world-modern-transmission": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--การแพร่ในยุคปัจจุบัน-modern-world-modern-transmission--v1",
          "statement": "รถและคนที่เข้าออกหลายฟาร์มเป็นตัวพา ASFV เข้าฟาร์ม (mechanical dissemination)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33369865",
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
            "rationale": "Swill feeding is the major contributing factor for small farms while mechanical dissemination of vehicles and personnel is the major contributing factor for large farms."
          }
        }
      ]
    },
    "swine-clinic--swine-asf--prevent-biosecurity": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--prevent-biosecurity--v1",
          "statement": "ระบบ biosecurity ของฟาร์มสุกรมี 8 ประเด็น ซึ่งรวมถึง fence/wall รอบฟาร์ม และ staff entrance corridor",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-34960821",
              "locator": "full text (PMC8704102), section 3.5 High Levels of Biosecurity and Table 4",
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
            "rationale": "A typical pig farm biosecurity mainly includes eight aspects, as shown in Table 4. Among them, staff entrances and isolation rooms need to be constructed with special consideration. ... A fence around a pig farm can act as a physical barrier to prevent outsiders from entering the pig farm area"
          }
        }
      ]
    },
    "swine-clinic--swine-asf--detect-การตรวจหาสุกรติดเชื้อ-asfv": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--detect-การตรวจหาสุกรติดเชื้อ-asfv--v1",
          "statement": "ซากสุกรตายใช้ superficial inguinal lymph nodes ตรวจหา ASFV ได้ โดยไม่ต้องเปิดผ่าซากซึ่งทำให้เชื้อปนเปื้อนพื้นที่",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35062287",
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
            "rationale": "However, obtaining these samples requires opening up the carcasses, which is time-consuming, requires skilled labour and often leads to contamination of the premises ... by sampling SILN, we can detect all pigs that succumb to highly virulent and moderately virulent ASFV strains (100% sensitivity)"
          }
        }
      ]
    },
    "swine-clinic--swine-asf--respond-depopulation-stamping-out-และหลักเกณฑ์ฟาร์มปลอดโรค": {
      "claims": [
        {
          "id": "swine-clinic--swine-asf--respond-depopulation-stamping-out-และหลักเกณฑ์ฟาร์มปลอดโรค--v1",
          "statement": "Partial depopulation เอาออกเฉพาะสุกรส่วนที่ติดเชื้อ ไม่ทำลายทั้งฟาร์ม และต้องอาศัย early detection กับการ culling สุกรที่ติดเชื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-39057794",
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
            "rationale": "Selective culling, also known as the \"tooth extraction approach\", is a strategy for controlling African swine fever (ASF) by removing only sick and suspect animals instead of the entire herd ... early diagnosis of ASF and systematic removal of infected pigs are critical components"
          }
        }
      ]
    }
  },
  "swine-clinic--swine-greasypig": {
    "swine-clinic--swine-greasypig--greasy-pig-สาเหตุ-และการติดต่อ": {
      "claims": [
        {
          "id": "swine-clinic--swine-greasypig--greasy-pig-สาเหตุ-และการติดต่อ--v1",
          "statement": "Exudative epidermitis เกิดจาก staphylococci ได้หลายชนิด โดย S. hyicus เป็นสาเหตุที่รู้จักกัน และ S. chromogenes ซึ่งเป็น normal flora บนผิวหนังสุกรก็ก่อโรคได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-15708827",
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
            "rationale": "Staphylococcus chromogenes is closely related to Staphylococcus hyicus, which is recognised as the causative agent of exudative epidermitis (EE) in pigs. S. chromogenes is part of the normal skin flora of pigs ... The results of this study show that S. chromogenes may cause exudative epidermitis in pigs."
          }
        }
      ]
    },
    "swine-clinic--swine-greasypig--greasy-pig-พยาธิกำเนิด-และปัจจัยโน้มนำ": {
      "claims": [
        {
          "id": "swine-clinic--swine-greasypig--greasy-pig-พยาธิกำเนิด-และปัจจัยโน้มนำ--v1",
          "statement": "Exfoliative toxins ของ Staphylococcus hyicus ทำลาย epidermis จึงเกิด exudative epidermitis",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16257503",
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
            "rationale": "Virulent strains of Staphylococcus hyicus can cause exudative epidermitis in pigs. The major symptom of this disease is exfoliation of the skin in the upper stratum spinosum. Exfoliation of the skin is strongly associated with exfoliative toxin including ExhA, ExhB, ExhC, ExhD, SHETA, and SHETB."
          }
        }
      ]
    },
    "swine-clinic--swine-greasypig--greasy-pig-อาการ-และการวินิจฉัย": {
      "claims": [
        {
          "id": "swine-clinic--swine-greasypig--greasy-pig-อาการ-และการวินิจฉัย--v1",
          "statement": "Exudative epidermitis เริ่มจากผิวหนังแดง แล้วรอยโรคที่มี exudate ลามออกไปโดยไม่คัน วินิจฉัยจากอาการและรอยโรค ร่วมกับ bacterial culture",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "merck-vet-manual",
              "locator": "Integumentary System, Exudative Epidermitis in Pigs (Greasy Pig Disease): summary at the head of the page (full review Jan 2026)",
              "kind": "textbook"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Clinical signs include depression and reddening of the skin, followed by rapid spread of exudative, nonpruritic pustules. Diagnosis is based on clinical signs and confirmed by bacterial culture of lesions."
          }
        }
      ]
    },
    "swine-clinic--swine-greasypig--greasy-pig-การรักษา-และการควบคุม": {
      "claims": [
        {
          "id": "swine-clinic--swine-greasypig--greasy-pig-การรักษา-และการควบคุม--v1",
          "statement": "รักษา exudative epidermitis ด้วยยาต้านจุลชีพร่วมกับยาฆ่าเชื้อที่ผิวหนัง ทดแทนน้ำและอิเล็กโทรไลต์ และควบคุมโดยลดบาดแผล เช่น ตัดฟันลูกสุกร",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "merck-vet-manual",
              "locator": "Integumentary System, Exudative Epidermitis in Pigs (Greasy Pig Disease): summary, and Treatment and Control (full review Jan 2026)",
              "kind": "textbook"
            }
          ],
          "review": {
            "reviewedBy": "reference-verified",
            "reviewedAt": "2026-11-15",
            "method": "reference-cross-check",
            "approvedScopes": [
              "learning",
              "assessment"
            ],
            "rationale": "Treatment with antimicrobials is most successful when combined with topical antiseptic sprays. Severely affected pigs might require fluids and electrolytes. ... Other procedures that can decrease the severity of exudative epidermitis outbreaks include clipping the needle teeth of neonatal pigs"
          }
        }
      ]
    },
    "swine-clinic--swine-greasypig--mycoplasma-suis-สาเหตุ-การติดต่อ-และพยาธิกำเนิด": {
      "claims": [
        {
          "id": "swine-clinic--swine-greasypig--mycoplasma-suis-สาเหตุ-การติดต่อ-และพยาธิกำเนิด--v1",
          "statement": "กลไกที่ Mycoplasma suis ทำให้เม็ดเลือดแดงเสียหาย ได้แก่ adhesion, invasion, immune-mediated hemolysis และ eryptosis รวมทั้ง interaction with endothelial cells",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-25128978",
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
            "rationale": "Pathogenetic mechanisms of M. suis include direct destruction of red blood cells by adhesion, invasion, nutrient scavenging, immune-mediated lysis and eryptosis, as well as endothelial targeting."
          }
        }
      ]
    },
    "swine-clinic--swine-greasypig--mycoplasma-suis-อาการ-วินิจฉัย-และการรักษา": {
      "claims": [
        {
          "id": "swine-clinic--swine-greasypig--mycoplasma-suis-อาการ-วินิจฉัย-และการรักษา--v1",
          "statement": "การติดเชื้อ Mycoplasma suis มีตั้งแต่ subclinical ไปจนถึงแสดงอาการชัดเจน และวินิจฉัยได้ด้วย PCR จากเลือด กับการดู Giemsa-stained blood smears",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-32099660",
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
            "rationale": "consequences are highly variable with some infected pigs never exhibiting clinical disease ... the comparison of qPCR results with microscopic investigation of Giemsa-stained blood smears revealed a lower sensitivity of the microscopic method"
          }
        }
      ]
    }
  },
  "swine-clinic--swine-repro": {
    "swine-clinic--swine-repro--reproductive-failure-สาเหตุและการสืบประวัติ": {
      "claims": [
        {
          "id": "swine-clinic--swine-repro--reproductive-failure-สาเหตุและการสืบประวัติ--v1",
          "statement": "สาเหตุของ reproductive failure ในแม่สุกรมีทั้ง viral infections เช่น PRV และ PPV, แบคทีเรีย เช่น leptospirosis และ pyrexia จาก systemic infection เช่น Erysipelas",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-37724658",
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
            "rationale": "Some may have a special affinity for the reproductive tract and the foetuses (e.g. Aujeszky's disease virus, parvovirus, Leptospira sp.), while others may cause clinical disease or fever in sows (e.g. swine influenza viruses, Erysipelothrix rhusiopathiae), subsequently leading to abortion."
          }
        }
      ]
    },
    "swine-clinic--swine-repro--ตกขาว-น้ำนมแห้ง-และ-production-failure": {
      "claims": [
        {
          "id": "swine-clinic--swine-repro--ตกขาว-น้ำนมแห้ง-และ-production-failure--v1",
          "statement": "ลูกหย่านมต่อแม่ต่อปี (PW/S/Y) แยกดูได้จาก litters/sow/year (L/S/Y) กับจำนวนลูกหย่านมต่อครอก ซึ่งขึ้นกับ litter size (live-born) และ preweaning mortality",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28405457",
              "locator": "full text (PMC5382409), section Reproductive performance of sows",
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
            "rationale": "There are two branches in productivity trees of PWSY in breeding herds (Fig. 1): one is the number of pigs weaned per sow, and the other is the number of litters per sow per year. The number of pigs weaned depends on the number of PBA and preweaning mortality"
          }
        }
      ]
    },
    "swine-clinic--swine-repro--porcine-parvovirus-ppv": {
      "claims": [
        {
          "id": "swine-clinic--swine-repro--porcine-parvovirus-ppv--v1",
          "statement": "PPV ทำให้ reproductive failure ของแม่ โดยมีลูกมัมมี่เพิ่มขึ้น และถ้าติดเชื้อตั้งแต่ต้นของการอุ้มท้อง embryo จะตายและถูกดูดซึม ทำให้ครอกเล็ก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-10844195",
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
            "rationale": "A typical epidemic of PPV-induced reproductive failure is presented as an increased number of mummified fetuses and sometimes, entire litters are mummified. If infection with PPV is very early in gestation, the number of liveborn pigs may be further reduced as a result of embryonic death and resorption."
          }
        }
      ]
    },
    "swine-clinic--swine-repro--porcine-brucellosis-brucella-suis": {
      "claims": [
        {
          "id": "swine-clinic--swine-repro--porcine-brucellosis-brucella-suis--v1",
          "statement": "B. suis biovar 1 และ 3 ก่อโรค brucellosis ในสุกร และสอง biovar นี้ก่อโรคในคนได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30050849",
              "locator": "full text (PMC6042558), section Taxonomy of the pathogen",
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
            "rationale": "B. suis is currently subdivided into five biovars with biovars 1, 2, and 3 being responsible for brucellosis in swine. While biovars 1 and 3 are pathogenic in humans, biovar 2 appears to be a very rare cause of human infection."
          }
        }
      ]
    },
    "swine-clinic--swine-repro--กลุ่มอาการ-mma-ในแม่สุกร": {
      "claims": [
        {
          "id": "swine-clinic--swine-repro--กลุ่มอาการ-mma-ในแม่สุกร--v1",
          "statement": "กลุ่มอาการ MMA มีชื่ออื่นว่า Postpartum Dysgalactia Syndrome (PPDS) และแม่สุกรที่ท้องผูกช่วงอุ้มท้องเสี่ยงเกิด MMA มากขึ้น",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26891575",
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
            "rationale": "Mastitis-Metritis-Agalactia (MMA), also known as postpartum dysgalactia syndrome (PPDS) is the most important disease complex in sows after birth ... Important risk factors identified were in gilts the integration into the herd after the first farrowing, in gestating sows firm fecal consistency"
          }
        }
      ]
    },
    "swine-clinic--swine-repro--prrs-porcine-reproductive-and-respiratory-syndrome": {
      "claims": [
        {
          "id": "swine-clinic--swine-repro--prrs-porcine-reproductive-and-respiratory-syndrome--v1",
          "statement": "PRRS MLV เป็นวัคซีนแบบ leaky: ไวรัสวัคซีนยังเพิ่มจำนวนในตัวสุกร ทำให้เกิด viremia และขับเชื้อได้ และไม่ให้ sterilising immunity",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33918580",
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
            "rationale": "MLV can still replicate in the host, inducing viremia and virus shedding, and it fails to confer sterilizing immunity against PRRSV infection"
          }
        }
      ]
    }
  },
  "swine-clinic--swine-control-dx": {
    "swine-clinic--swine-control-dx--biosecurity-ลดปริมาณเชื้อ-และแยกกลุ่มสัตว์": {
      "claims": [
        {
          "id": "swine-clinic--swine-control-dx--biosecurity-ลดปริมาณเชื้อ-และแยกกลุ่มสัตว์--v1",
          "statement": "Biosecurity แบ่งเป็น external biosecurity ที่ลดโอกาสนำเชื้อเข้าฟาร์ม และ internal biosecurity ที่ลดการแพร่ของเชื้อภายในฟาร์ม",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-33397483",
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
            "rationale": "Biosecurity can be defined as the application of measures aimed to reduce the probability of the introduction (external biosecurity) and further spread of pathogens within the farm (internal biosecurity)"
          }
        }
      ]
    },
    "swine-clinic--swine-control-dx--แยกกลุ่มสัตว์-p0-1-batch-production-และ-multi-site": {
      "claims": [
        {
          "id": "swine-clinic--swine-control-dx--แยกกลุ่มสัตว์-p0-1-batch-production-และ-multi-site--v1",
          "statement": "การจัดการ biosecurity ของฟาร์มสุกรใช้ multisite production, parity segregation, batch production และระบบ all-in all-out",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36504860",
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
            "rationale": "Traditional biosecurity management strategies through multisite production, parity segregation, batch production, the adoption of all-in all-out production systems"
          }
        }
      ]
    },
    "swine-clinic--swine-control-dx--internal-biosecurity-หลัง-asf-และการลงสุกรใหม่": {
      "claims": [
        {
          "id": "swine-clinic--swine-control-dx--internal-biosecurity-หลัง-asf-และการลงสุกรใหม่--v1",
          "statement": "การลงสุกรใหม่หลัง ASF ต้องคุมยานพาหนะ บุคลากรและผู้มาเยือน fomites พาหะและสัตว์รบกวน อาหารและน้ำ ปรับปรุงโครงสร้างพื้นฐาน และใช้ sentinel pigs",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-36504860",
              "locator": "full text (PMC9732666), the part on repopulating pig farms after ASF",
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
            "rationale": "the control of vehicles, personnel / visitors, fomites, vectors / pests, food and water supply for humans and pigs, infrastructure renovation / disinfection, the application of closed systems for the pig houses, changes of the environment, the distribution of sentinel pigs"
          }
        }
      ]
    },
    "swine-clinic--swine-control-dx--early-weaning-การแยกกัก-และการปรับสภาพสุกรทดแทน": {
      "claims": [
        {
          "id": "swine-clinic--swine-control-dx--early-weaning-การแยกกัก-และการปรับสภาพสุกรทดแทน--v1",
          "statement": "Medicated early weaning คือการหย่านมลูกสุกรเร็วร่วมกับการให้ยา เพื่อให้ได้สุกรที่ปลอดจากเชื้อประจำถิ่นของฝูงเดิม เช่น Mycoplasma hyopneumoniae และ Bordetella bronchiseptica",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-7445326",
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
            "rationale": "A field trial was conducted to assess the value of medicated early weaning for obtaining pigs free from some of the pathogens endemic in their herd of origin. ... No evidence could be found of mycoplasma or bordetella."
          }
        }
      ]
    },
    "swine-clinic--swine-control-dx--แนวทางวินิจฉัยระดับฝูง-ผลแล็บ-serology-และ-farm-pattern": {
      "claims": [
        {
          "id": "swine-clinic--swine-control-dx--แนวทางวินิจฉัยระดับฝูง-ผลแล็บ-serology-และ-farm-pattern--v1",
          "statement": "PRRS ELISA ใช้ S/P ratio 0.4 เป็นจุดตัด โดยค่าต่ำกว่า 0.4 ถือว่าเป็นลบ และใช้ ELISA ติดตามฝูงในแนวทาง test and removal",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-11227190",
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
            "rationale": "In order to be classified as a PRRSV-negative herd, all samples collected over the 12-month monitoring period were required to be negative by ELISA (s/p ratio < 0.4)."
          }
        }
      ]
    }
  },
  "swine-clinic--swine-prv-je": {
    "swine-clinic--swine-prv-je--je-ไวรัส-โฮสต์-และวงจรการแพร่": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--je-ไวรัส-โฮสต์-และวงจรการแพร่--v1",
          "statement": "สุกรเป็น amplifying host ของ JEV โดยสุกรที่มี viremia เป็นแหล่งเชื้อให้ยุง Culex",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-35631096",
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
            "rationale": "The enzootic transmission of JEV involves two types of amplifying hosts, swine and avian species. ... viremic pigs are a source of infectious viruses for competent mosquito species, especially Culex tritaeniorhynchus in the endemic regions"
          }
        }
      ]
    },
    "swine-clinic--swine-prv-je--je-อาการตามกลุ่มสุกร-และการวินิจฉัย": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--je-อาการตามกลุ่มสุกร-และการวินิจฉัย--v1",
          "statement": "JEV ในสุกรโตไม่แสดงอาการ แต่ทำให้แม่สุกรอุ้มท้องเกิด reproductive failure และลูกสุกรที่ติดเชื้อมีอาการทางระบบประสาทได้",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-28284628",
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
            "rationale": "Although infection in adult swine does not result in symptomatic disease, it is considered a significant reproductive problem causing abortion, still-birth and birth defects. Infected piglets can display fatal neurological disease."
          }
        }
      ]
    },
    "swine-clinic--swine-prv-je--je-ช่วงเวลาของ-viremia-การขับเชื้อ-และตัวอย่างที่ควรเก็บ": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--je-ช่วงเวลาของ-viremia-การขับเชื้อ-และตัวอย่างที่ควรเก็บ--v1",
          "statement": "หลังติดเชื้อ JEV พบ viral load สูงสุดที่ tonsils และวันที่ 11 หลังติดเชื้อ ซึ่งพ้นช่วง viremia แล้ว viral RNA ใน tonsils ยังไม่ลดลง",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-26911997",
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
            "rationale": "in particular the tonsils with the overall highest viral loads, was observed. In this organ, even 11 days post infection, the latest time point of the experiment, no apparent decrease in viral RNA loads and live virus was found"
          }
        }
      ]
    },
    "swine-clinic--swine-prv-je--je-การตอบสนองของฟาร์ม": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--je-การตอบสนองของฟาร์ม--v1",
          "statement": "การควบคุม JEV ทำได้ด้วยการควบคุมยุงและการฉีดวัคซีนให้คน ร่วมกับการปรับการเลี้ยงสัตว์",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-19067628",
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
            "rationale": "Control of JEV is achieved through human and/or swine vaccination, changes in animal husbandry, mosquito control, or a combination of these strategies."
          }
        }
      ]
    },
    "swine-clinic--swine-prv-je--nipah-virus-disease-nivd": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--nipah-virus-disease-nivd--v1",
          "statement": "Nipah virus ในสุกรก่อโรคสมองอักเสบและโรคทางเดินหายใจโดยอัตราตายค่อนข้างต่ำ และค้างคาวผลไม้ Pteropus เป็น reservoir ตามธรรมชาติ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-12637075",
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
            "rationale": "in pigs, encephalitis and respiratory diseases but with a relatively low mortality rate ... Fruitbats of Pteropid species were identified as the natural reservoir hosts."
          }
        }
      ]
    },
    "swine-clinic--swine-prv-je--pseudorabies-เชื้อ-และลักษณะของโรค": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--pseudorabies-เชื้อ-และลักษณะของโรค--v1",
          "statement": "Pseudorabies virus (PRV) เป็น herpesvirus ของสุกรใน subfamily Alphaherpesvirinae และเป็นสาเหตุของ Aujeszky's disease",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16148307",
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
            "rationale": "Pseudorabies virus (PRV) is a herpesvirus of swine, a member of the Alphaherpesvirinae subfamily, and the etiological agent of Aujeszky's disease."
          }
        }
      ]
    },
    "swine-clinic--swine-prv-je--pseudorabies-พยาธิกำเนิด-และ-latent-infection": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--pseudorabies-พยาธิกำเนิด-และ-latent-infection--v1",
          "statement": "PRV ติดที่เยื่อบุทางเดินหายใจก่อน แล้วเป็น latent infection ในระบบประสาท และ reactivation ทำให้สุกรแพร่เชื้อได้อีก",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-16148307",
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
            "rationale": "PRV infection progresses from acute infection of the respiratory epithelium to latent infection in the peripheral nervous system. Sporadic reactivation from latency can transmit PRV to new hosts."
          }
        }
      ]
    },
    "swine-clinic--swine-prv-je--pseudorabies-การตรวจทางห้องปฏิบัติการ": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--pseudorabies-การตรวจทางห้องปฏิบัติการ--v1",
          "statement": "Oral fluid ใช้ตรวจ DNA ของ ADV ด้วย PCR ได้ โดยพบผลบวกร้อยละ 20 ถึง 100 ตั้งแต่วันที่ 3 ถึง 21 หลังติดเชื้อ",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-30015417",
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
            "rationale": "ADV DNA was detected in oral fluid samples (20% to 100%) from 3 to 21 days postinoculation (DPI), but not in serum."
          }
        }
      ]
    },
    "swine-clinic--swine-prv-je--pseudorabies-วัคซีน-marker-vaccine-และ-diva": {
      "claims": [
        {
          "id": "swine-clinic--swine-prv-je--pseudorabies-วัคซีน-marker-vaccine-และ-diva--v1",
          "statement": "วัคซีน PRV แบบ marker ใช้คู่กับชุดตรวจทาง serology ที่เข้าคู่กัน เพื่อแยกสุกรที่ได้วัคซีนจากสุกรที่ติดเชื้อสนาม (DIVA)",
          "evidenceStatus": "established",
          "reviewStatus": "verified",
          "sourceRefs": [
            {
              "sourceId": "pmid-27890448",
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
            "rationale": "the concept of DIVA, i.e. the serological differentiation of vaccinated from field-virus infected animals by the use of marker vaccines and respective companion diagnostic tests"
          }
        }
      ]
    }
  }
};
