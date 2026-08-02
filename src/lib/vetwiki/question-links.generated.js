// ============================================================
// question-links.generated.js — AUTO-GENERATED, do NOT hand-edit
// ============================================================
// Regenerate with: node scripts/apply-question-links.mjs <judged.json> --write
//
// Most questions reach their article through their own topic. These are the
// ones that cannot: they come from past-paper compilations, so their stored
// topic is the name of the compilation ("vca/dogcat", "mahahon-*") and there is
// no article by that name — the reader gets a question wrong and has nowhere to
// go, even though the article they need already exists and is already verified.
//
// Each entry was proposed by term-overlap retrieval and then judged, because a
// retrieval score is word overlap, not evidence that the article answers the
// question. A wrong link is worse than none: it teaches the reader that the
// article is useless.
//
// 316 link(s): 214 answer the question directly, 102 give supporting context.
// ============================================================

/** @type {Record<string, {subject: string, topic: string, sectionId: string, confidence: string}>} */
export const QUESTION_LINKS = {
  "9": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--surgical-procedure",
    "confidence": "supporting"
  },
  "60": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--vaginal-cytology-by-cycle-stage",
    "confidence": "strong"
  },
  "61": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--vaginal-cytology-by-cycle-stage",
    "confidence": "strong"
  },
  "65": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--oxytocin-critical-use",
    "confidence": "supporting"
  },
  "69": {
    "subject": "practrum",
    "topic": "penile-deviation",
    "sectionId": "practrum--penile-deviation--indications-mechanism",
    "confidence": "supporting"
  },
  "71": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--clinical-drug-matching",
    "confidence": "strong"
  },
  "74": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--vaginal-cytology-by-cycle-stage",
    "confidence": "strong"
  },
  "75": {
    "subject": "repro-lect",
    "topic": "surgical-neutering",
    "sectionId": "repro-lect--surgical-neutering--ovarian-remnant-syndrome-ors-aj-tt-favorite",
    "confidence": "supporting"
  },
  "76": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ovulation-timing-aj-kc",
    "confidence": "strong"
  },
  "79": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--clinical-drug-matching",
    "confidence": "supporting"
  },
  "230": {
    "subject": "repro-lect",
    "topic": "repro-ultrasound",
    "sectionId": "repro-lect--repro-ultrasound--pregnancy-timeline-canine-days-post-lh-surge",
    "confidence": "strong"
  },
  "232": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ovulation-timing-aj-kc",
    "confidence": "strong"
  },
  "233": {
    "subject": "repro-lect",
    "topic": "repro-ultrasound",
    "sectionId": "repro-lect--repro-ultrasound--fetal-viability",
    "confidence": "supporting"
  },
  "234": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ai-quality-threshold",
    "confidence": "strong"
  },
  "236": {
    "subject": "repro-lect",
    "topic": "repro-ultrasound",
    "sectionId": "repro-lect--repro-ultrasound--pregnancy-timeline-canine-days-post-lh-surge",
    "confidence": "strong"
  },
  "238": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--clinical-drug-matching",
    "confidence": "strong"
  },
  "240": {
    "subject": "com3",
    "topic": "er-anes",
    "sectionId": "com3--er-anes--dystocia-caesarean",
    "confidence": "strong"
  },
  "267": {
    "subject": "com4",
    "topic": "derm-endocrine",
    "sectionId": "com4--derm-endocrine--hyperadrenocorticism-cushing-s-hac",
    "confidence": "strong"
  },
  "268": {
    "subject": "com3",
    "topic": "metabolic-er",
    "sectionId": "com3--metabolic-er--addisonian-crisis-hypoadrenocorticism",
    "confidence": "strong"
  },
  "1500": {
    "subject": "com3",
    "topic": "cpcr",
    "sectionId": "com3--cpcr--rhythm-interpretation",
    "confidence": "strong"
  },
  "1501": {
    "subject": "com3",
    "topic": "triage",
    "sectionId": "com3--triage--primary-survey-abcde",
    "confidence": "strong"
  },
  "1503": {
    "subject": "com3",
    "topic": "triage",
    "sectionId": "com3--triage--approach-to-emergency-patients",
    "confidence": "strong"
  },
  "1504": {
    "subject": "com3",
    "topic": "metabolic-er",
    "sectionId": "com3--metabolic-er--addisonian-crisis-hypoadrenocorticism",
    "confidence": "strong"
  },
  "1506": {
    "subject": "com3",
    "topic": "ataxia-tremor",
    "sectionId": "com3--ataxia-tremor--peripheral-vs-central-vestibular",
    "confidence": "supporting"
  },
  "1510": {
    "subject": "com3",
    "topic": "acute-abdomen",
    "sectionId": "com3--acute-abdomen--categorization",
    "confidence": "strong"
  },
  "1512": {
    "subject": "com3",
    "topic": "nutrition",
    "sectionId": "com3--nutrition--rer-calculation",
    "confidence": "strong"
  },
  "1514": {
    "subject": "com3",
    "topic": "neuro-er",
    "sectionId": "com3--neuro-er--acute-spinal-cord-injury",
    "confidence": "supporting"
  },
  "1515": {
    "subject": "com3",
    "topic": "ataxia-tremor",
    "sectionId": "com3--ataxia-tremor--tremor-classification",
    "confidence": "supporting"
  },
  "1516": {
    "subject": "com3",
    "topic": "spinal",
    "sectionId": "com3--spinal--other-spinal-disorders",
    "confidence": "supporting"
  },
  "1518": {
    "subject": "com3",
    "topic": "ataxia-tremor",
    "sectionId": "com3--ataxia-tremor--cerebellar-disease-features",
    "confidence": "strong"
  },
  "1519": {
    "subject": "com3",
    "topic": "triage",
    "sectionId": "com3--triage--6-perfusion-parameters-circulation",
    "confidence": "strong"
  },
  "1520": {
    "subject": "com3",
    "topic": "triage",
    "sectionId": "com3--triage--resuscitation-secondary-survey",
    "confidence": "strong"
  },
  "1522": {
    "subject": "com3",
    "topic": "neuro-exam",
    "sectionId": "com3--neuro-exam--hand-off-examination",
    "confidence": "strong"
  },
  "1523": {
    "subject": "com3",
    "topic": "cpcr",
    "sectionId": "com3--cpcr--step-4-advanced-life-support",
    "confidence": "strong"
  },
  "1526": {
    "subject": "com3",
    "topic": "ataxia-tremor",
    "sectionId": "com3--ataxia-tremor--tremor-classification",
    "confidence": "strong"
  },
  "1529": {
    "subject": "com3",
    "topic": "er-anes",
    "sectionId": "com3--er-anes--urethral-obstruction-cat",
    "confidence": "strong"
  },
  "1531": {
    "subject": "com3",
    "topic": "spinal",
    "sectionId": "com3--spinal--terminology",
    "confidence": "strong"
  },
  "1533": {
    "subject": "com3",
    "topic": "nutrition",
    "sectionId": "com3--nutrition--simple-vs-stress-starvation",
    "confidence": "strong"
  },
  "1535": {
    "subject": "com3",
    "topic": "spinal",
    "sectionId": "com3--spinal--hansen-type-i-ivdd",
    "confidence": "strong"
  },
  "1537": {
    "subject": "com3",
    "topic": "nutrition",
    "sectionId": "com3--nutrition--feeding-protocol",
    "confidence": "strong"
  },
  "1538": {
    "subject": "com3",
    "topic": "seizure",
    "sectionId": "com3--seizure--classification-ivetf-2015",
    "confidence": "supporting"
  },
  "1539": {
    "subject": "com3",
    "topic": "shock",
    "sectionId": "com3--shock--treatment",
    "confidence": "strong"
  },
  "1541": {
    "subject": "com3",
    "topic": "nutrition",
    "sectionId": "com3--nutrition--rer-calculation",
    "confidence": "strong"
  },
  "1542": {
    "subject": "com3",
    "topic": "acute-abdomen",
    "sectionId": "com3--acute-abdomen--categorization",
    "confidence": "strong"
  },
  "1543": {
    "subject": "com3",
    "topic": "triage",
    "sectionId": "com3--triage--6-perfusion-parameters-circulation",
    "confidence": "strong"
  },
  "1544": {
    "subject": "com3",
    "topic": "neuro-exam",
    "sectionId": "com3--neuro-exam--hand-off-examination",
    "confidence": "supporting"
  },
  "1545": {
    "subject": "com3",
    "topic": "nutrition",
    "sectionId": "com3--nutrition--simple-vs-stress-starvation",
    "confidence": "supporting"
  },
  "1546": {
    "subject": "com3",
    "topic": "ataxia-tremor",
    "sectionId": "com3--ataxia-tremor--peripheral-vs-central-vestibular",
    "confidence": "strong"
  },
  "1547": {
    "subject": "com3",
    "topic": "spinal",
    "sectionId": "com3--spinal--other-spinal-disorders",
    "confidence": "strong"
  },
  "1549": {
    "subject": "com3",
    "topic": "acute-abdomen",
    "sectionId": "com3--acute-abdomen--pain-management",
    "confidence": "supporting"
  },
  "1551": {
    "subject": "com3",
    "topic": "neuro-er",
    "sectionId": "com3--neuro-er--head-trauma-assessment",
    "confidence": "strong"
  },
  "1552": {
    "subject": "com3",
    "topic": "spinal",
    "sectionId": "com3--spinal--hansen-type-ii-ivdd",
    "confidence": "supporting"
  },
  "1554": {
    "subject": "com3",
    "topic": "ataxia-tremor",
    "sectionId": "com3--ataxia-tremor--peripheral-vs-central-vestibular",
    "confidence": "strong"
  },
  "1555": {
    "subject": "com3",
    "topic": "triage",
    "sectionId": "com3--triage--6-perfusion-parameters-circulation",
    "confidence": "strong"
  },
  "1558": {
    "subject": "com3",
    "topic": "cpcr",
    "sectionId": "com3--cpcr--step-1-3-basic-life-support",
    "confidence": "supporting"
  },
  "1559": {
    "subject": "com3",
    "topic": "neuro-er",
    "sectionId": "com3--neuro-er--acute-spinal-cord-injury",
    "confidence": "strong"
  },
  "1560": {
    "subject": "com3",
    "topic": "spinal",
    "sectionId": "com3--spinal--other-spinal-disorders",
    "confidence": "strong"
  },
  "1561": {
    "subject": "com3",
    "topic": "ataxia-tremor",
    "sectionId": "com3--ataxia-tremor--tremor-classification",
    "confidence": "strong"
  },
  "1562": {
    "subject": "com3",
    "topic": "cpcr",
    "sectionId": "com3--cpcr--step-1-3-basic-life-support",
    "confidence": "supporting"
  },
  "1563": {
    "subject": "com3",
    "topic": "cpcr",
    "sectionId": "com3--cpcr--recognition-team",
    "confidence": "strong"
  },
  "1564": {
    "subject": "com3",
    "topic": "resp-cv-er",
    "sectionId": "com3--resp-cv-er--respiratory-patterns",
    "confidence": "supporting"
  },
  "1566": {
    "subject": "com3",
    "topic": "metabolic-er",
    "sectionId": "com3--metabolic-er--diabetic-ketoacidosis-dka",
    "confidence": "strong"
  },
  "1567": {
    "subject": "com3",
    "topic": "er-anes",
    "sectionId": "com3--er-anes--drug-summary",
    "confidence": "strong"
  },
  "1569": {
    "subject": "com3",
    "topic": "shock",
    "sectionId": "com3--shock--5-types-of-shock",
    "confidence": "strong"
  },
  "1570": {
    "subject": "com3",
    "topic": "er-anes",
    "sectionId": "com3--er-anes--drug-summary",
    "confidence": "supporting"
  },
  "1571": {
    "subject": "com3",
    "topic": "metabolic-er",
    "sectionId": "com3--metabolic-er--diabetic-ketoacidosis-dka",
    "confidence": "strong"
  },
  "1709": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--vaccine-strategy-rolling-reaction-concept",
    "confidence": "supporting"
  },
  "1712": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--antibodies-maternal-immunity",
    "confidence": "strong"
  },
  "1715": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--major-avian-zoonoses-viral",
    "confidence": "strong"
  },
  "1729": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--vaccine-strategy-rolling-reaction-concept",
    "confidence": "supporting"
  },
  "1740": {
    "subject": "poultry",
    "topic": "avian-drugs",
    "sectionId": "poultry--avian-drugs--common-conditions-first-line-drugs",
    "confidence": "strong"
  },
  "2054": {
    "subject": "repro-lect",
    "topic": "exotic-repro",
    "sectionId": "repro-lect--exotic-repro--common-exotic-repro-flags",
    "confidence": "supporting"
  },
  "2060": {
    "subject": "repro-lect",
    "topic": "gonadectomy-risk",
    "sectionId": "repro-lect--gonadectomy-risk--benefits",
    "confidence": "strong"
  },
  "2061": {
    "subject": "repro-lect",
    "topic": "surgical-neutering",
    "sectionId": "repro-lect--surgical-neutering--cervical-stump-issues-post-ovh",
    "confidence": "strong"
  },
  "2062": {
    "subject": "repro-lect",
    "topic": "gonadectomy-risk",
    "sectionId": "repro-lect--gonadectomy-risk--predisposed-breed-lists-aj-sc-จำไปให้หมด",
    "confidence": "strong"
  },
  "2063": {
    "subject": "repro-lect",
    "topic": "gonadectomy-risk",
    "sectionId": "repro-lect--gonadectomy-risk--predisposed-breed-lists-aj-sc-จำไปให้หมด",
    "confidence": "strong"
  },
  "2064": {
    "subject": "repro-lect",
    "topic": "gonadectomy-risk",
    "sectionId": "repro-lect--gonadectomy-risk--predisposed-breed-lists-aj-sc-จำไปให้หมด",
    "confidence": "strong"
  },
  "2066": {
    "subject": "com4",
    "topic": "behavior-med",
    "sectionId": "com4--behavior-med--medical-causes-of-behavioral-signs",
    "confidence": "supporting"
  },
  "2067": {
    "subject": "repro-lect",
    "topic": "gonadectomy-risk",
    "sectionId": "repro-lect--gonadectomy-risk--detriments-to-discuss",
    "confidence": "supporting"
  },
  "2080": {
    "subject": "repro-lect",
    "topic": "surgical-neutering",
    "sectionId": "repro-lect--surgical-neutering--definitions",
    "confidence": "strong"
  },
  "2081": {
    "subject": "repro-lect",
    "topic": "surgical-neutering",
    "sectionId": "repro-lect--surgical-neutering--male-techniques",
    "confidence": "supporting"
  },
  "2083": {
    "subject": "repro-lect",
    "topic": "surgical-neutering",
    "sectionId": "repro-lect--surgical-neutering--ovarian-remnant-syndrome-ors-aj-tt-favorite",
    "confidence": "strong"
  },
  "2084": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--aglepristone-3-indications-หลัก",
    "confidence": "supporting"
  },
  "2088": {
    "subject": "repro-lect",
    "topic": "surgical-neutering",
    "sectionId": "repro-lect--surgical-neutering--ohe-technical-points",
    "confidence": "supporting"
  },
  "3002": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--past-exam-mapping-vet-85-final-q1-3-q9-10",
    "confidence": "strong"
  },
  "3006": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--local-anesthesia-lidocaine-2",
    "confidence": "strong"
  },
  "3008": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--pre-op-post-op",
    "confidence": "supporting"
  },
  "3015": {
    "subject": "practrum",
    "topic": "animal-nutrition",
    "sectionId": "practrum--animal-nutrition--dmi-calculation",
    "confidence": "strong"
  },
  "3016": {
    "subject": "practrum",
    "topic": "animal-nutrition",
    "sectionId": "practrum--animal-nutrition--r-c-ratio-particle-size",
    "confidence": "strong"
  },
  "3017": {
    "subject": "practrum",
    "topic": "animal-nutrition",
    "sectionId": "practrum--animal-nutrition--r-c-ratio-particle-size",
    "confidence": "strong"
  },
  "3019": {
    "subject": "practrum",
    "topic": "animal-nutrition",
    "sectionId": "practrum--animal-nutrition--nutritional-values",
    "confidence": "strong"
  },
  "3038": {
    "subject": "practrum",
    "topic": "penile-deviation",
    "sectionId": "practrum--penile-deviation--indications-mechanism",
    "confidence": "strong"
  },
  "3039": {
    "subject": "practrum",
    "topic": "penile-deviation",
    "sectionId": "practrum--penile-deviation--drug-protocol-lecture-2026",
    "confidence": "strong"
  },
  "3040": {
    "subject": "practrum",
    "topic": "penile-deviation",
    "sectionId": "practrum--penile-deviation--indications-mechanism",
    "confidence": "strong"
  },
  "3051": {
    "subject": "practrum",
    "topic": "animal-nutrition",
    "sectionId": "practrum--animal-nutrition--nutritional-values",
    "confidence": "strong"
  },
  "3054": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--antinutritional-factors-สารต่อต้านในวัตถุดิบ",
    "confidence": "strong"
  },
  "3056": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--antinutritional-factors-สารต่อต้านในวัตถุดิบ",
    "confidence": "supporting"
  },
  "3061": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--local-regional-block-selection",
    "confidence": "strong"
  },
  "3062": {
    "subject": "practrum",
    "topic": "dehorning",
    "sectionId": "practrum--dehorning--anatomy-anesthesia",
    "confidence": "strong"
  },
  "3069": {
    "subject": "practrum",
    "topic": "dehorning",
    "sectionId": "practrum--dehorning--disbudding-methods-comparison",
    "confidence": "supporting"
  },
  "3070": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--surgical-procedure",
    "confidence": "strong"
  },
  "3071": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--pre-op-post-op",
    "confidence": "strong"
  },
  "4001": {
    "subject": "poultry",
    "topic": "biosecurity",
    "sectionId": "poultry--biosecurity--3-levels-of-biosecurity",
    "confidence": "strong"
  },
  "4004": {
    "subject": "poultry",
    "topic": "biosecurity",
    "sectionId": "poultry--biosecurity--sampling-for-surveillance",
    "confidence": "strong"
  },
  "4005": {
    "subject": "poultry",
    "topic": "biosecurity",
    "sectionId": "poultry--biosecurity--sampling-for-surveillance",
    "confidence": "strong"
  },
  "4006": {
    "subject": "poultry",
    "topic": "biosecurity",
    "sectionId": "poultry--biosecurity--sampling-for-surveillance",
    "confidence": "supporting"
  },
  "4008": {
    "subject": "poultry",
    "topic": "avian-drugs",
    "sectionId": "poultry--avian-drugs--drug-withdrawal-period",
    "confidence": "supporting"
  },
  "4009": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--past-exam-mapping-l8-nutrition",
    "confidence": "strong"
  },
  "4010": {
    "subject": "poultry",
    "topic": "avian-drugs",
    "sectionId": "poultry--avian-drugs--banned-drugs-thailand-poultry",
    "confidence": "strong"
  },
  "4012": {
    "subject": "poultry",
    "topic": "quality-assurance",
    "sectionId": "poultry--quality-assurance--quality-assurance-5-ด้าน",
    "confidence": "strong"
  },
  "4013": {
    "subject": "poultry",
    "topic": "quality-assurance",
    "sectionId": "poultry--quality-assurance--pdca-cycle-deming-wheel",
    "confidence": "strong"
  },
  "4014": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--major-avian-zoonoses-bacterial",
    "confidence": "supporting"
  },
  "4016": {
    "subject": "poultry",
    "topic": "quality-assurance",
    "sectionId": "poultry--quality-assurance--five-freedoms-welfare",
    "confidence": "strong"
  },
  "4017": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--major-avian-zoonoses-bacterial",
    "confidence": "strong"
  },
  "4018": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--major-avian-zoonoses-bacterial",
    "confidence": "strong"
  },
  "4019": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--major-avian-zoonoses-viral",
    "confidence": "strong"
  },
  "4020": {
    "subject": "zoonoses",
    "topic": "zoo-ai-basic",
    "sectionId": "zoonoses--zoo-ai-basic--hpai-h5n1-outbreak-origin-spread",
    "confidence": "supporting"
  },
  "4022": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--major-avian-zoonoses-fungal-parasitic",
    "confidence": "strong"
  },
  "4028": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--pasgar-score-chick-quality-at-24h",
    "confidence": "strong"
  },
  "4030": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--common-causes-of-first-week-mortality",
    "confidence": "supporting"
  },
  "4031": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--protein-amino-acids",
    "confidence": "strong"
  },
  "4032": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--protein-amino-acids",
    "confidence": "strong"
  },
  "4033": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--protein-amino-acids",
    "confidence": "strong"
  },
  "4034": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--fat-essential-fatty-acid",
    "confidence": "strong"
  },
  "4035": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--minerals-calcium-phosphorus-สำคัญมาก",
    "confidence": "strong"
  },
  "4036": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--minerals-calcium-phosphorus-สำคัญมาก",
    "confidence": "strong"
  },
  "4037": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--dietary-electrolyte-balance-deb-trace-minerals-vitamins",
    "confidence": "strong"
  },
  "4038": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--heat-stress-nutrition-management",
    "confidence": "strong"
  },
  "4039": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--minerals-calcium-phosphorus-สำคัญมาก",
    "confidence": "strong"
  },
  "4040": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--dietary-fiber-feed-additives-enzymes-probiotics-botanicals",
    "confidence": "strong"
  },
  "4041": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--minerals-calcium-phosphorus-สำคัญมาก",
    "confidence": "strong"
  },
  "4042": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--minerals-calcium-phosphorus-สำคัญมาก",
    "confidence": "strong"
  },
  "4043": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--broiler-diet-phases-starter-grower-finisher",
    "confidence": "strong"
  },
  "4044": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--layer-diet-phases-starter-grower-developer-pre-lay-production",
    "confidence": "strong"
  },
  "4045": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--layer-diet-phases-starter-grower-developer-pre-lay-production",
    "confidence": "strong"
  },
  "4046": {
    "subject": "poultry",
    "topic": "avian-drugs",
    "sectionId": "poultry--avian-drugs--drug-withdrawal-period",
    "confidence": "supporting"
  },
  "4047": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--past-exam-mapping-l8-nutrition",
    "confidence": "supporting"
  },
  "4053": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--major-avian-zoonoses-bacterial",
    "confidence": "supporting"
  },
  "4058": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--antinutritional-factors-สารต่อต้านในวัตถุดิบ",
    "confidence": "strong"
  },
  "4060": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--avian-influenza-hpai-detail",
    "confidence": "strong"
  },
  "5000": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--ga-potential-problems",
    "confidence": "strong"
  },
  "5002": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--pre-medication-sedation",
    "confidence": "strong"
  },
  "5003": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--sedation-alpha-2-agonist",
    "confidence": "strong"
  },
  "5004": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--sedation-alpha-2-agonist",
    "confidence": "strong"
  },
  "5005": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--local-anesthesia-lidocaine-2",
    "confidence": "supporting"
  },
  "5006": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--block-decision-tree-clinical-scenario",
    "confidence": "strong"
  },
  "5007": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--local-anesthesia-lidocaine-2",
    "confidence": "strong"
  },
  "5010": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--diagnostic-ping-sound-map",
    "confidence": "strong"
  },
  "5011": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--lda-left-displaced-abomasum",
    "confidence": "supporting"
  },
  "5012": {
    "subject": "cliapprum",
    "topic": "gi-vdtt",
    "sectionId": "cliapprum--gi-vdtt--rumen-fluid-analysis-cowside",
    "confidence": "strong"
  },
  "5013": {
    "subject": "cliapprum",
    "topic": "gi-vdtt",
    "sectionId": "cliapprum--gi-vdtt--rumen-ph-spectrum",
    "confidence": "strong"
  },
  "5016": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--local-anesthetic-pharmacology",
    "confidence": "strong"
  },
  "5018": {
    "subject": "cliapprum",
    "topic": "gi-vdtt",
    "sectionId": "cliapprum--gi-vdtt--bloat-tympany",
    "confidence": "supporting"
  },
  "5020": {
    "subject": "practrum",
    "topic": "hoof-trim",
    "sectionId": "practrum--hoof-trim--hoof-anatomy-claw-zones",
    "confidence": "supporting"
  },
  "5021": {
    "subject": "cliapprum",
    "topic": "hoof-health-fleet",
    "sectionId": "cliapprum--hoof-health-fleet--footbath-protocol",
    "confidence": "strong"
  },
  "5023": {
    "subject": "practrum",
    "topic": "hoof-trim",
    "sectionId": "practrum--hoof-trim--routine-care-disease-categories",
    "confidence": "strong"
  },
  "5024": {
    "subject": "practrum",
    "topic": "hoof-trim",
    "sectionId": "practrum--hoof-trim--routine-care-disease-categories",
    "confidence": "supporting"
  },
  "5025": {
    "subject": "practrum",
    "topic": "hoof-trim",
    "sectionId": "practrum--hoof-trim--routine-care-disease-categories",
    "confidence": "strong"
  },
  "5026": {
    "subject": "practrum",
    "topic": "hoof-trim",
    "sectionId": "practrum--hoof-trim--digital-amputation-s2-sole-ulcer-osteomyelitis",
    "confidence": "strong"
  },
  "5027": {
    "subject": "practrum",
    "topic": "dehorning",
    "sectionId": "practrum--dehorning--anatomy-anesthesia",
    "confidence": "strong"
  },
  "5028": {
    "subject": "practrum",
    "topic": "dehorning",
    "sectionId": "practrum--dehorning--anatomy-anesthesia",
    "confidence": "strong"
  },
  "5029": {
    "subject": "practrum",
    "topic": "dehorning",
    "sectionId": "practrum--dehorning--post-op-complication-sinusitis",
    "confidence": "strong"
  },
  "5030": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--surgical-procedure",
    "confidence": "strong"
  },
  "5031": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--rumenotomy-overlap-with-vet-prac-rum-aj-ea",
    "confidence": "strong"
  },
  "5033": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--lda-left-displaced-abomasum",
    "confidence": "strong"
  },
  "5036": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--lda-left-displaced-abomasum",
    "confidence": "supporting"
  },
  "5040": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--block-decision-tree-clinical-scenario",
    "confidence": "strong"
  },
  "5048": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--rumenotomy-overlap-with-vet-prac-rum-aj-ea",
    "confidence": "supporting"
  },
  "5049": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--surgical-procedure",
    "confidence": "strong"
  },
  "5051": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--surgical-procedure",
    "confidence": "strong"
  },
  "5052": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--lda-left-displaced-abomasum",
    "confidence": "strong"
  },
  "5053": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--rda-rav-right-displaced-abomasum-volvulus-surgical-emergency",
    "confidence": "strong"
  },
  "5054": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--surgical-procedure",
    "confidence": "supporting"
  },
  "5062": {
    "subject": "practrum",
    "topic": "dehorning",
    "sectionId": "practrum--dehorning--post-op-complication-sinusitis",
    "confidence": "supporting"
  },
  "5067": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--pre-medication-sedation",
    "confidence": "supporting"
  },
  "5069": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--local-regional-block-selection",
    "confidence": "strong"
  },
  "5070": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--local-anesthesia-lidocaine-2",
    "confidence": "strong"
  },
  "5072": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--local-anesthesia-lidocaine-2",
    "confidence": "strong"
  },
  "5074": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--cecal-dilatation-dislocation-cdd",
    "confidence": "supporting"
  },
  "5075": {
    "subject": "com3",
    "topic": "acute-abdomen",
    "sectionId": "com3--acute-abdomen--fluid-analysis-key",
    "confidence": "supporting"
  },
  "5078": {
    "subject": "cliapprum",
    "topic": "gi-vdtt",
    "sectionId": "cliapprum--gi-vdtt--rumen-ph-spectrum",
    "confidence": "strong"
  },
  "5079": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--reticulum-specific-procedures",
    "confidence": "supporting"
  },
  "5080": {
    "subject": "cliapprum",
    "topic": "gi-vdtt",
    "sectionId": "cliapprum--gi-vdtt--gi-motility-disorders",
    "confidence": "strong"
  },
  "5082": {
    "subject": "cliapprum",
    "topic": "hoof-health-fleet",
    "sectionId": "cliapprum--hoof-health-fleet--tli-framework-4-elements",
    "confidence": "strong"
  },
  "5083": {
    "subject": "cliapprum",
    "topic": "hoof-health-fleet",
    "sectionId": "cliapprum--hoof-health-fleet--tli-framework-4-elements",
    "confidence": "strong"
  },
  "5084": {
    "subject": "cliapprum",
    "topic": "hoof-health-fleet",
    "sectionId": "cliapprum--hoof-health-fleet--tli-framework-4-elements",
    "confidence": "supporting"
  },
  "5085": {
    "subject": "cliapprum",
    "topic": "hoof-health-fleet",
    "sectionId": "cliapprum--hoof-health-fleet--interpretation-tree-decision-logic",
    "confidence": "strong"
  },
  "5086": {
    "subject": "cliapprum",
    "topic": "hoof-health-fleet",
    "sectionId": "cliapprum--hoof-health-fleet--interpretation-tree-decision-logic",
    "confidence": "strong"
  },
  "5087": {
    "subject": "cliapprum",
    "topic": "hoof-health-fleet",
    "sectionId": "cliapprum--hoof-health-fleet--locomotion-score-lcs-sprecher-1997",
    "confidence": "strong"
  },
  "5088": {
    "subject": "cliapprum",
    "topic": "hoof-health-fleet",
    "sectionId": "cliapprum--hoof-health-fleet--locomotion-score-lcs-sprecher-1997",
    "confidence": "strong"
  },
  "5089": {
    "subject": "practrum",
    "topic": "hoof-trim",
    "sectionId": "practrum--hoof-trim--hoof-anatomy-claw-zones",
    "confidence": "supporting"
  },
  "6002": {
    "subject": "exotic",
    "topic": "rodent-fish-health",
    "sectionId": "exotic--rodent-fish-health--common-signs-of-illness-in-aquarium-fish",
    "confidence": "strong"
  },
  "6071": {
    "subject": "exotic",
    "topic": "aquarium-water-quality-ph",
    "sectionId": "exotic--aquarium-water-quality-ph--essential-aquarium-maintenance-nitrogen-cycle-protection",
    "confidence": "supporting"
  },
  "6080": {
    "subject": "food-industry",
    "topic": "fiqc-aquatic",
    "sectionId": "food-industry--fiqc-aquatic--อันตรายทางชีวภาพในสัตว์น้ำ",
    "confidence": "supporting"
  },
  "6104": {
    "subject": "com4",
    "topic": "derm-endocrine",
    "sectionId": "com4--derm-endocrine--hyperadrenocorticism-cushing-s-hac",
    "confidence": "supporting"
  },
  "6112": {
    "subject": "exotic",
    "topic": "rabbit-chinchilla-care",
    "sectionId": "exotic--rabbit-chinchilla-care--buying-physical-exam-checklist-for-first-time-rabbits",
    "confidence": "supporting"
  },
  "6114": {
    "subject": "exotic",
    "topic": "rodent-fish-health",
    "sectionId": "exotic--rodent-fish-health--biting-triggers-safe-handling-in-small-animals",
    "confidence": "supporting"
  },
  "6115": {
    "subject": "exotic",
    "topic": "rabbit-nutritional-requirements",
    "sectionId": "exotic--rabbit-nutritional-requirements--nutrient-requirements-fiber-balance-in-rabbits",
    "confidence": "strong"
  },
  "6116": {
    "subject": "repro-lect",
    "topic": "exotic-repro",
    "sectionId": "repro-lect--exotic-repro--rabbit-repro-pearls",
    "confidence": "supporting"
  },
  "6120": {
    "subject": "exotic",
    "topic": "zoo-vet",
    "sectionId": "exotic--zoo-vet--vaccination-protocols",
    "confidence": "strong"
  },
  "6130": {
    "subject": "exotic",
    "topic": "bird-noninfect",
    "sectionId": "exotic--bird-noninfect--ectoparasites-knemidocoptes",
    "confidence": "strong"
  },
  "6132": {
    "subject": "exotic",
    "topic": "bird-infect",
    "sectionId": "exotic--bird-infect--pdd-proventricular-dilatation-disease",
    "confidence": "strong"
  },
  "6133": {
    "subject": "exotic",
    "topic": "bird-infect",
    "sectionId": "exotic--bird-infect--pbfd-psittacine-beak-and-feather-disease",
    "confidence": "strong"
  },
  "6134": {
    "subject": "exotic",
    "topic": "bird-noninfect",
    "sectionId": "exotic--bird-noninfect--anesthesia",
    "confidence": "strong"
  },
  "6144": {
    "subject": "exotic",
    "topic": "bird-noninfect",
    "sectionId": "exotic--bird-noninfect--nutritional-husbandry-diseases",
    "confidence": "supporting"
  },
  "6153": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--sedation-alpha-2-agonist",
    "confidence": "supporting"
  },
  "6156": {
    "subject": "com5",
    "topic": "feline-uri",
    "sectionId": "com5--feline-uri--5-pathogens-overview",
    "confidence": "supporting"
  },
  "6157": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--pre-medication-sedation",
    "confidence": "supporting"
  },
  "6213": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--avian-immune-system-anatomy",
    "confidence": "supporting"
  },
  "6214": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--vaccine-strategy-rolling-reaction-concept",
    "confidence": "strong"
  },
  "6215": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--avian-influenza-hpai-detail",
    "confidence": "supporting"
  },
  "6220": {
    "subject": "poultry",
    "topic": "avian-zoonosis",
    "sectionId": "poultry--avian-zoonosis--major-avian-zoonoses-bacterial",
    "confidence": "strong"
  },
  "6221": {
    "subject": "poultry",
    "topic": "avian-drugs",
    "sectionId": "poultry--avian-drugs--common-conditions-first-line-drugs",
    "confidence": "supporting"
  },
  "6231": {
    "subject": "exotic",
    "topic": "bird-infect",
    "sectionId": "exotic--bird-infect--fungal-candidiasis-thrush",
    "confidence": "strong"
  },
  "6240": {
    "subject": "poultry",
    "topic": "biosecurity",
    "sectionId": "poultry--biosecurity--sampling-for-surveillance",
    "confidence": "supporting"
  },
  "6242": {
    "subject": "poultry",
    "topic": "biosecurity",
    "sectionId": "poultry--biosecurity--sampling-for-surveillance",
    "confidence": "strong"
  },
  "6280": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--vaccine-strategy-rolling-reaction-concept",
    "confidence": "supporting"
  },
  "6281": {
    "subject": "poultry",
    "topic": "first-week-mortality",
    "sectionId": "poultry--first-week-mortality--vaccine-strategy-rolling-reaction-concept",
    "confidence": "supporting"
  },
  "6290": {
    "subject": "poultry",
    "topic": "avian-drugs",
    "sectionId": "poultry--avian-drugs--drug-withdrawal-period",
    "confidence": "supporting"
  },
  "6291": {
    "subject": "poultry",
    "topic": "avian-drugs",
    "sectionId": "poultry--avian-drugs--common-conditions-first-line-drugs",
    "confidence": "strong"
  },
  "6292": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--heat-stress-nutrition-management",
    "confidence": "strong"
  },
  "6300": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--protein-amino-acids",
    "confidence": "strong"
  },
  "6303": {
    "subject": "poa-clinical",
    "topic": "poa-edema",
    "sectionId": "poa-clinical--poa-edema--สรุปเคส-heartworm-ร่วมกับ-right-sided-chf",
    "confidence": "supporting"
  },
  "6312": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--egg-quality-production-diet",
    "confidence": "strong"
  },
  "6403": {
    "subject": "zoonoses",
    "topic": "zoo-protozoal",
    "sectionId": "zoonoses--zoo-protozoal--type-of-parasitic-zoonoses-4-categories",
    "confidence": "supporting"
  },
  "6422": {
    "subject": "com4",
    "topic": "derm-nutrition",
    "sectionId": "com4--derm-nutrition--zinc-responsive-dermatosis",
    "confidence": "supporting"
  },
  "6431": {
    "subject": "exotic",
    "topic": "small-mammal-pig-zoonoses",
    "sectionId": "exotic--small-mammal-pig-zoonoses--zoonoses-spread-from-rodents-potbellied-pigs-to-humans",
    "confidence": "supporting"
  },
  "6470": {
    "subject": "poultry",
    "topic": "avian-drugs",
    "sectionId": "poultry--avian-drugs--common-conditions-first-line-drugs",
    "confidence": "supporting"
  },
  "6482": {
    "subject": "poultry",
    "topic": "nutrition",
    "sectionId": "poultry--nutrition--protein-amino-acids",
    "confidence": "strong"
  },
  "6483": {
    "subject": "com4",
    "topic": "peds-geri",
    "sectionId": "com4--peds-geri--pediatric-neonatal-4hs",
    "confidence": "supporting"
  },
  "6612": {
    "subject": "com4",
    "topic": "imha",
    "sectionId": "com4--imha--pathogenesis",
    "confidence": "supporting"
  },
  "6631": {
    "subject": "equine-medicine",
    "topic": "equine-respi",
    "sectionId": "equine-medicine--equine-respi--urt-vs-lrt-specific-diseases",
    "confidence": "supporting"
  },
  "6642": {
    "subject": "equine-medicine",
    "topic": "equine-gi",
    "sectionId": "equine-medicine--equine-gi--esophagus-choke",
    "confidence": "supporting"
  },
  "6644": {
    "subject": "equine-medicine",
    "topic": "equine-colic-bestfit",
    "sectionId": "equine-medicine--equine-colic-bestfit--approach-classification-decision-tree",
    "confidence": "supporting"
  },
  "6650": {
    "subject": "equine-medicine",
    "topic": "equine-tendon",
    "sectionId": "equine-medicine--equine-tendon--incidence",
    "confidence": "strong"
  },
  "6651": {
    "subject": "practrum",
    "topic": "hoof-trim",
    "sectionId": "practrum--hoof-trim--routine-care-disease-categories",
    "confidence": "supporting"
  },
  "6701": {
    "subject": "equine-medicine",
    "topic": "equine-colic-surgery",
    "sectionId": "equine-medicine--equine-colic-surgery--pre-op-intra-op-pictures-case-slides",
    "confidence": "strong"
  },
  "6810": {
    "subject": "cliapprum",
    "topic": "gi-vdtt",
    "sectionId": "cliapprum--gi-vdtt--acute-lactic-acidosis-grain-engorgement",
    "confidence": "strong"
  },
  "6811": {
    "subject": "cliapprum",
    "topic": "metabolism-nutrition",
    "sectionId": "cliapprum--metabolism-nutrition--past-exam-mapping-sunsun84-kim85-metabolism",
    "confidence": "supporting"
  },
  "6814": {
    "subject": "practrum",
    "topic": "rumenotomy",
    "sectionId": "practrum--rumenotomy--cow-magnet-hardware-disease-prevention",
    "confidence": "strong"
  },
  "6871": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--lda-left-displaced-abomasum",
    "confidence": "strong"
  },
  "6872": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--hardware-disease-trp-traumatic-reticuloperitonitis",
    "confidence": "strong"
  },
  "6873": {
    "subject": "cliapprum",
    "topic": "gi-vdtt",
    "sectionId": "cliapprum--gi-vdtt--bloat-tympany",
    "confidence": "strong"
  },
  "6901": {
    "subject": "cliapprum",
    "topic": "gi-surgery-sawita",
    "sectionId": "cliapprum--gi-surgery-sawita--rumenotomy-overlap-with-vet-prac-rum-aj-ea",
    "confidence": "strong"
  },
  "6902": {
    "subject": "practrum",
    "topic": "dehorning",
    "sectionId": "practrum--dehorning--method-by-age",
    "confidence": "strong"
  },
  "6911": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--patient-preparation",
    "confidence": "strong"
  },
  "6922": {
    "subject": "cliapprum",
    "topic": "metabolism-nutrition",
    "sectionId": "cliapprum--metabolism-nutrition--transition-period-3-weeks-pre-post-calving",
    "confidence": "strong"
  },
  "7002": {
    "subject": "com5",
    "topic": "gi-protozoa",
    "sectionId": "com5--gi-protozoa--toxoplasma-gondii",
    "confidence": "strong"
  },
  "7004": {
    "subject": "com4",
    "topic": "derm-parasitic",
    "sectionId": "com4--derm-parasitic--fleas-fad",
    "confidence": "strong"
  },
  "7005": {
    "subject": "com4",
    "topic": "derm-parasitic",
    "sectionId": "com4--derm-parasitic--mites-comparison",
    "confidence": "supporting"
  },
  "7012": {
    "subject": "com4",
    "topic": "imha",
    "sectionId": "com4--imha--pathogenesis",
    "confidence": "supporting"
  },
  "7020": {
    "subject": "com5",
    "topic": "vaccine",
    "sectionId": "com5--vaccine--feline-vaccines-summary-wsava-2024",
    "confidence": "strong"
  },
  "7021": {
    "subject": "com5",
    "topic": "vaccine",
    "sectionId": "com5--vaccine--canine-vaccines-summary-wsava-2024",
    "confidence": "strong"
  },
  "7022": {
    "subject": "com5",
    "topic": "vaccine",
    "sectionId": "com5--vaccine--canine-puppy-schedule-wsava-2024-vpat-2024",
    "confidence": "strong"
  },
  "7023": {
    "subject": "com5",
    "topic": "rabies",
    "sectionId": "com5--rabies--prevention-pre-exposure-thai-rabies-cpg",
    "confidence": "strong"
  },
  "7031": {
    "subject": "com4",
    "topic": "imha",
    "sectionId": "com4--imha--clinical-signs-diagnosis",
    "confidence": "strong"
  },
  "7045": {
    "subject": "com3",
    "topic": "metabolic-er",
    "sectionId": "com3--metabolic-er--acute-kidney-injury-aki",
    "confidence": "supporting"
  },
  "7050": {
    "subject": "com3",
    "topic": "shock",
    "sectionId": "com3--shock--treatment",
    "confidence": "strong"
  },
  "7053": {
    "subject": "com3",
    "topic": "cpcr",
    "sectionId": "com3--cpcr--step-1-3-basic-life-support",
    "confidence": "strong"
  },
  "7060": {
    "subject": "com3",
    "topic": "nutrition",
    "sectionId": "com3--nutrition--essential-amino-acids-in-cats",
    "confidence": "strong"
  },
  "7061": {
    "subject": "com3",
    "topic": "resp-cv-er",
    "sectionId": "com3--resp-cv-er--pulmonary-edema",
    "confidence": "strong"
  },
  "7062": {
    "subject": "com3",
    "topic": "metabolic-er",
    "sectionId": "com3--metabolic-er--addisonian-crisis-hypoadrenocorticism",
    "confidence": "strong"
  },
  "7063": {
    "subject": "com4",
    "topic": "derm-endocrine",
    "sectionId": "com4--derm-endocrine--hyperadrenocorticism-cushing-s-hac",
    "confidence": "strong"
  },
  "7065": {
    "subject": "com5",
    "topic": "cve",
    "sectionId": "com5--cve--clinical-signs-cpv",
    "confidence": "strong"
  },
  "7067": {
    "subject": "com3",
    "topic": "metabolic-er",
    "sectionId": "com3--metabolic-er--urethral-obstruction",
    "confidence": "strong"
  },
  "7101": {
    "subject": "practrum",
    "topic": "bovine-anesthesia",
    "sectionId": "practrum--bovine-anesthesia--sedation-alpha-2-agonist",
    "confidence": "supporting"
  },
  "7102": {
    "subject": "com3",
    "topic": "shock",
    "sectionId": "com3--shock--treatment",
    "confidence": "supporting"
  },
  "7110": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--aglepristone-3-indications-หลัก",
    "confidence": "supporting"
  },
  "7111": {
    "subject": "repro-lect",
    "topic": "infertility",
    "sectionId": "repro-lect--infertility--queen-specific-traps",
    "confidence": "supporting"
  },
  "7120": {
    "subject": "com4",
    "topic": "derm-allergic",
    "sectionId": "com4--derm-allergic--treatment-multimodal",
    "confidence": "strong"
  },
  "7121": {
    "subject": "com4",
    "topic": "derm-autoimmune",
    "sectionId": "com4--derm-autoimmune--treatment-autoimmune-skin-overall",
    "confidence": "strong"
  },
  "7131": {
    "subject": "com3",
    "topic": "spinal",
    "sectionId": "com3--spinal--hansen-type-i-ivdd",
    "confidence": "strong"
  },
  "7132": {
    "subject": "com3",
    "topic": "seizure",
    "sectionId": "com3--seizure--aed-first-line",
    "confidence": "strong"
  },
  "7136": {
    "subject": "com4",
    "topic": "behavior-med",
    "sectionId": "com4--behavior-med--canine-psychopharmacology-behavior-drugs",
    "confidence": "strong"
  },
  "7160": {
    "subject": "com3",
    "topic": "er-anes",
    "sectionId": "com3--er-anes--urethral-obstruction-cat",
    "confidence": "strong"
  },
  "8009": {
    "subject": "com5",
    "topic": "cve",
    "sectionId": "com5--cve--pathogenesis",
    "confidence": "strong"
  },
  "8010": {
    "subject": "poa-clinical",
    "topic": "poa-edema",
    "sectionId": "poa-clinical--poa-edema--สรุปเคส-heartworm-ร่วมกับ-right-sided-chf",
    "confidence": "supporting"
  },
  "8038": {
    "subject": "com4",
    "topic": "derm-fungal",
    "sectionId": "com4--derm-fungal--dermatophytosis-ringworm",
    "confidence": "strong"
  },
  "8043": {
    "subject": "com4",
    "topic": "imha",
    "sectionId": "com4--imha--clinical-signs-diagnosis",
    "confidence": "strong"
  },
  "8045": {
    "subject": "poa-clinical",
    "topic": "poa-edema",
    "sectionId": "poa-clinical--poa-edema--สรุปเคส-heartworm-ร่วมกับ-right-sided-chf",
    "confidence": "supporting"
  },
  "8060": {
    "subject": "com4",
    "topic": "peds-geri",
    "sectionId": "com4--peds-geri--pediatric-neonatal-4hs",
    "confidence": "supporting"
  },
  "52004": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--progestin-adverse-effects-ออก-2-ล้านข้อ-จำไป",
    "confidence": "strong"
  },
  "52005": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--cabergoline-pseudopregnancy-lactation",
    "confidence": "strong"
  },
  "52006": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--progestin-adverse-effects-ออก-2-ล้านข้อ-จำไป",
    "confidence": "strong"
  },
  "52007": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--hormone-groups-จำให้ได้",
    "confidence": "strong"
  },
  "52008": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--progestin-adverse-effects-ออก-2-ล้านข้อ-จำไป",
    "confidence": "strong"
  },
  "52010": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--progestin-adverse-effects-ออก-2-ล้านข้อ-จำไป",
    "confidence": "strong"
  },
  "52013": {
    "subject": "repro-lect",
    "topic": "hormonal-applications",
    "sectionId": "repro-lect--hormonal-applications--oxytocin-critical-use",
    "confidence": "strong"
  },
  "52014": {
    "subject": "repro-lect",
    "topic": "repro-ultrasound",
    "sectionId": "repro-lect--repro-ultrasound--male-u-s-specifics",
    "confidence": "strong"
  },
  "52016": {
    "subject": "repro-lect",
    "topic": "repro-ultrasound",
    "sectionId": "repro-lect--repro-ultrasound--male-u-s-specifics",
    "confidence": "strong"
  },
  "52019": {
    "subject": "repro-lect",
    "topic": "repro-ultrasound",
    "sectionId": "repro-lect--repro-ultrasound--clinical-pitfall",
    "confidence": "supporting"
  },
  "52021": {
    "subject": "repro-lect",
    "topic": "repro-ultrasound",
    "sectionId": "repro-lect--repro-ultrasound--fetal-sex-determination",
    "confidence": "strong"
  },
  "52024": {
    "subject": "repro-lect",
    "topic": "infertility",
    "sectionId": "repro-lect--infertility--sperm-terminology",
    "confidence": "strong"
  },
  "52030": {
    "subject": "repro-lect",
    "topic": "infertility",
    "sectionId": "repro-lect--infertility--male-workup-tom-stud-dog",
    "confidence": "supporting"
  },
  "52031": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ovulation-timing-aj-kc",
    "confidence": "strong"
  },
  "52033": {
    "subject": "repro-lect",
    "topic": "infertility",
    "sectionId": "repro-lect--infertility--queen-specific-traps",
    "confidence": "supporting"
  },
  "52034": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--collection-methods-aj-tt",
    "confidence": "strong"
  },
  "52035": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--collection-methods-aj-tt",
    "confidence": "strong"
  },
  "52036": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--semen-evaluation-framework",
    "confidence": "strong"
  },
  "52037": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ovulation-timing-aj-kc",
    "confidence": "strong"
  },
  "52038": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ovulation-timing-aj-kc",
    "confidence": "strong"
  },
  "52039": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ai-routes",
    "confidence": "strong"
  },
  "52040": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ai-routes",
    "confidence": "strong"
  },
  "52042": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ai-quality-threshold",
    "confidence": "strong"
  },
  "52043": {
    "subject": "repro-lect",
    "topic": "semen-ai",
    "sectionId": "repro-lect--semen-ai--ovulation-timing-aj-kc",
    "confidence": "supporting"
  },
  "52044": {
    "subject": "repro-lect",
    "topic": "biotech",
    "sectionId": "repro-lect--biotech--art-toolbox",
    "confidence": "strong"
  },
  "52045": {
    "subject": "repro-lect",
    "topic": "biotech",
    "sectionId": "repro-lect--biotech--art-toolbox",
    "confidence": "strong"
  },
  "52047": {
    "subject": "repro-lect",
    "topic": "biotech",
    "sectionId": "repro-lect--biotech--embryo-development-timeline-dog",
    "confidence": "strong"
  },
  "52049": {
    "subject": "repro-lect",
    "topic": "biotech",
    "sectionId": "repro-lect--biotech--embryo-development-timeline-dog",
    "confidence": "strong"
  },
  "52050": {
    "subject": "repro-lect",
    "topic": "biotech",
    "sectionId": "repro-lect--biotech--scnt-cloning",
    "confidence": "strong"
  },
  "52051": {
    "subject": "repro-lect",
    "topic": "biotech",
    "sectionId": "repro-lect--biotech--art-toolbox",
    "confidence": "supporting"
  },
  "52052": {
    "subject": "repro-lect",
    "topic": "biotech",
    "sectionId": "repro-lect--biotech--why-dogs-cats-matter-for-conservation",
    "confidence": "supporting"
  },
  "52053": {
    "subject": "repro-lect",
    "topic": "semen-preservation",
    "sectionId": "repro-lect--semen-preservation--cryobiology-logic",
    "confidence": "supporting"
  },
  "94204": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--local-anesthetic-pharmacology",
    "confidence": "supporting"
  },
  "94205": {
    "subject": "cliapprum",
    "topic": "ruminant-anesthesia",
    "sectionId": "cliapprum--ruminant-anesthesia--local-anesthetic-pharmacology",
    "confidence": "supporting"
  },
  "94209": {
    "subject": "com3",
    "topic": "neuro-exam",
    "sectionId": "com3--neuro-exam--spinal-localization",
    "confidence": "supporting"
  }
};

export default QUESTION_LINKS;
