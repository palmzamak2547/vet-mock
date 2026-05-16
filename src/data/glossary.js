// ============================================================
// glossary.js — inline vet-term definitions (AMBOSS-style)
// ============================================================
// Each medical term appearing inside a Q stem (or RichText body
// wrapped by TermLinkedRichText) gets a subtle dotted underline.
// Tap → TermPopup shows the entry + a button to open related Qs.
//
// Schema (every field optional except `term`):
//   term       English canonical (lowercase used for lookup)
//   aliases    alt spellings/abbreviations (matched case-insensitive)
//   synonyms   semantic equivalents reused for related-Q matching
//              (NOT included in detection regex by default — they may
//              be more ambiguous)
//   thai       Thai translation / gloss
//   defShort   one-line summary, ideally < 120 chars — shown bold
//   defLong    3-4 sentences with clinical context
//   category   one of: 'symptom' | 'disease' | 'drug' | 'lab-value'
//                       | 'anatomy' | 'organism'
//   subjects   subject IDs where this term is exam-relevant
//              (e.g. ['com3', 'com4'])
//
// IRON RULE 0 — clinical accuracy first. If a definition is uncertain
// for a niche species/context, the field is left out rather than
// invented. Reviewers: flag any entry that misrepresents textbook
// consensus.
// ============================================================

export const GLOSSARY = [
  // ────────────────────────────────────────────────────────────
  // Symptoms / clinical signs
  // ────────────────────────────────────────────────────────────
  { term: 'azotemia', aliases: ['azotaemia'], category: 'symptom', thai: 'อะโซเทเมีย',
    defShort: 'BUN/creatinine สูง — บ่งบอก renal dysfunction หรือ pre-/post-renal cause',
    defLong: 'การเพิ่มขึ้นของ nitrogenous waste (urea, creatinine) ในเลือด แบ่งเป็น pre-renal (dehydration, low perfusion), renal (intrinsic kidney injury) และ post-renal (urethral obstruction). ตรวจร่วมกับ USG เพื่อจำแนก: USG > 1.030 (dog) มัก pre-renal. Azotemia ที่มี clinical signs ร่วมเรียก uremia.',
    subjects: ['com3', 'com4', 'cliapprum'], synonyms: ['high BUN', 'high creatinine'] },
  { term: 'tachycardia', aliases: [], category: 'symptom', thai: 'หัวใจเต้นเร็ว',
    defShort: 'HR เร็วผิดปกติ — sinus (pain/fever/hypovolemia) หรือ pathologic (VT/SVT)',
    defLong: 'อัตราการเต้นของหัวใจที่สูงกว่า species-specific norm (dog > 160 small, > 140 large; cat > 220). Sinus tachycardia เป็น compensatory response; non-sinus (VT/SVT) ต้อง ECG diagnose. รักษาตามสาเหตุ — fluid resuscitation, analgesia, antiarrhythmic ตามชนิด.',
    subjects: ['com3', 'com4'], synonyms: ['fast heart rate'] },
  { term: 'bradycardia', aliases: [], category: 'symptom', thai: 'หัวใจเต้นช้า',
    defShort: 'HR ต่ำกว่า normal — vagal tone, drug effect, AV block, hyperkalemia',
    defLong: 'อัตราการเต้นของหัวใจต่ำ (dog < 60, cat < 140 ทั่วไป). สาเหตุพบบ่อย: high vagal tone (เช่น GI dz), beta-blocker overdose, hyperkalemia (atrial standstill ใน urethral obstruction cat), AV block. แก้ที่ underlying cause; atropine + pacing สำหรับ symptomatic.',
    subjects: ['com3', 'com4'], synonyms: ['slow heart rate'] },
  { term: 'polyuria', aliases: ['PU'], category: 'symptom', thai: 'ปัสสาวะมาก',
    defShort: 'urine output สูงผิดปกติ — มากับ polydipsia (PU/PD complex)',
    defLong: 'ปริมาณ urine ที่ขับออกมากเกิน norm (> 50 mL/kg/day dog). มักมาคู่กับ polydipsia (PU/PD). DDx ที่พบบ่อย: DM, CKD, Cushing\'s, hyperthyroidism (cat), DI, hypercalcemia, pyometra. Workup: USG (isosthenuric บ่งบอกตามไต), CBC/chem, water deprivation test เมื่อ ddx แคบแล้ว.',
    subjects: ['com3', 'com4'], synonyms: ['PU/PD'] },
  { term: 'polydipsia', aliases: ['PD'], category: 'symptom', thai: 'กระหายน้ำมาก',
    defShort: 'น้ำดื่มเกิน norm (dog > 100 mL/kg/day) — มากับ polyuria',
    defLong: 'การดื่มน้ำมากผิดปกติ. มัก secondary ต่อ polyuria (compensatory) ไม่ใช่ primary thirst defect. Workup เหมือน PU. Primary polydipsia (psychogenic) ใน dog หายาก แต่ rule-out ต้อง water deprivation test.',
    subjects: ['com3', 'com4'], synonyms: ['PU/PD'] },
  { term: 'anorexia', aliases: [], category: 'symptom', thai: 'เบื่ออาหาร',
    defShort: 'ไม่กิน — non-specific แต่ early sign ของหลายโรค โดยเฉพาะ cat',
    defLong: 'การไม่กินอาหาร เป็น non-specific clinical sign ที่ early แต่สำคัญ. ใน cat การ anorexia > 2-3 วันเสี่ยง hepatic lipidosis. หาสาเหตุ systematic: GI, dental, metabolic, neoplasia, behavioral. Appetite stimulant (mirtazapine, capromorelin) เป็น symptomatic ขณะหาสาเหตุ.',
    subjects: ['com3', 'com4', 'exotic'], synonyms: ['inappetence'] },
  { term: 'lethargy', aliases: [], category: 'symptom', thai: 'ซึม',
    defShort: 'พลังงานลดลง, ตอบสนองช้า — non-specific, ของจริงต้องสังเกตเทียบ baseline',
    defLong: 'ลดลงของ activity และ responsiveness. Mild → severe: dull, obtunded, stuporous, comatose. เป็น window ของหลาย systemic dz (anemia, sepsis, metabolic, neuro). ประเมินคู่กับ mentation + vital signs.',
    subjects: ['com3', 'com4'], synonyms: ['depression', 'dullness'] },
  { term: 'dyspnea', aliases: ['dyspnoea'], category: 'symptom', thai: 'หายใจลำบาก',
    defShort: 'หายใจลำบาก — แยก upper airway (stridor), lower (wheeze), pleural, parenchymal',
    defLong: 'การหายใจที่ผู้ป่วยต้องใช้แรงเพิ่ม. Localize ก่อน treat: upper airway (inspiratory stridor), lower airway (expiratory wheeze, asthma), pleural space (restrictive, short shallow), parenchymal (crackles, edema). O2 supplementation ก่อนทำหัตถการในผู้ป่วยที่ unstable.',
    subjects: ['com3', 'com4'], synonyms: ['respiratory distress'] },
  { term: 'cyanosis', aliases: [], category: 'symptom', thai: 'ผิวเขียวคล้ำ',
    defShort: 'mucous membrane สีน้ำเงิน — deoxyHb > 5 g/dL — severe hypoxia',
    defLong: 'สีผิว/เยื่อเมือกที่เป็นน้ำเงินจาก deoxygenated Hb > 5 g/dL. Central cyanosis = systemic hypoxia (cardiac shunt, severe pulmonary dz, methemoglobinemia). Peripheral cyanosis = local poor perfusion. ใน anemic animal อาจไม่เห็น cyanosis แม้ severe hypoxic.',
    subjects: ['com3', 'com4'], synonyms: ['blue mm'] },
  { term: 'jaundice', aliases: ['icterus'], category: 'symptom', thai: 'ดีซ่าน',
    defShort: 'sclera/mm สีเหลือง — bilirubin สูง — pre-/hepatic/post-hepatic',
    defLong: 'สีเหลืองของ sclera, mucous membrane, skin จาก bilirubin > ~2-3 mg/dL. Pre-hepatic = hemolysis (IMHA, Babesia, Heinz body). Hepatic = liver dz. Post-hepatic = biliary obstruction (mucocele, pancreatitis, neoplasia). Workup: CBC/smear/Coombs ก่อน chase liver disease.',
    subjects: ['com3', 'com4'], synonyms: ['icteric'] },
  { term: 'ascites', aliases: [], category: 'symptom', thai: 'ท้องมาน',
    defShort: 'ของเหลวสะสมใน peritoneal cavity — transudate vs exudate vs hemorrhagic',
    defLong: 'การสะสมของ fluid ใน peritoneal cavity. Causes: right-sided CHF, hypoalbuminemia (PLN/PLE), portal hypertension, neoplasia, FIP, septic peritonitis, hemoabdomen. Diagnostic abdominocentesis + fluid analysis (TP, cellularity, cytology, culture) เป็น core diagnostic step.',
    subjects: ['com3', 'com4'], synonyms: ['abdominal effusion'] },
  { term: 'edema', aliases: ['oedema'], category: 'symptom', thai: 'บวมน้ำ',
    defShort: 'ของเหลวสะสมใน interstitium — pitting (low oncotic) vs non-pitting',
    defLong: 'สะสมของ extracellular fluid ใน interstitial space. Pitting edema มัก hypoalbuminemic (PLN, PLE, liver failure). Non-pitting = lymphatic obstruction. Pulmonary edema = life-threatening; ดู respiratory rate + lung sounds.',
    subjects: ['com3', 'com4'] },
  { term: 'regurgitation', aliases: [], category: 'symptom', thai: 'สำรอก',
    defShort: 'อาหารออกจากปากแบบ passive — esophageal — แยกจาก vomit',
    defLong: 'การออกของอาหาร/น้ำลายจาก esophagus แบบ passive ไม่มี abdominal effort. ต่างจาก vomit ที่มี prodromal nausea + active retching. Causes: megaesophagus (myasthenia, idiopathic), esophagitis, stricture, vascular ring anomaly, foreign body. High aspiration pneumonia risk.',
    subjects: ['com3', 'com4'], synonyms: ['regurgitate'] },

  // ────────────────────────────────────────────────────────────
  // Diseases
  // ────────────────────────────────────────────────────────────
  { term: 'pyometra', aliases: [], category: 'disease', thai: 'มดลูกอักเสบเป็นหนอง',
    defShort: 'มดลูกอักเสบมีหนอง — intact female ใน diestrus — open vs closed cervix',
    defLong: 'การติดเชื้อแบคทีเรียในมดลูกของ intact female ขณะ diestrus (progesterone-mediated endometrial hyperplasia + immune suppression). Open pyometra = cervix เปิด, discharge ออก, less critical. Closed = ไม่มี discharge, septic/endotoxic shock risk สูง. Treatment of choice = OVH; medical (aglepristone + abx) สำหรับ breeder.',
    subjects: ['com3', 'com4', 'repro'], synonyms: ['uterine infection'] },
  { term: 'parvovirus', aliases: ['parvo', 'CPV'], category: 'disease', thai: 'พาร์โว',
    defShort: 'CPV-2 — hemorrhagic enteritis + leukopenia ใน puppy unvaccinated',
    defLong: 'Canine parvovirus-2 (CPV-2 และ subtypes 2a/2b/2c) attacks rapidly-dividing cells: GI crypts (hemorrhagic diarrhea, vomiting) และ bone marrow (severe leukopenia/neutropenia). Fecal Ag SNAP เป็น first-line diagnostic แม้ false-negative ได้. Treatment = aggressive supportive: IV fluid, antiemetic (maropitant), broad-spectrum abx for translocation, isolation. Mortality ลดลงมากเมื่อ early aggressive treat.',
    subjects: ['com3', 'com4'] },
  { term: 'FIP', aliases: ['feline infectious peritonitis'], category: 'disease', thai: 'เยื่อบุช่องท้องอักเสบในแมว',
    defShort: 'coronavirus mutation ในแมว — wet (effusive) vs dry (non-effusive)',
    defLong: 'การกลายพันธุ์ของ feline coronavirus (FCoV) ภายใน individual cat — ไม่ใช่ contagious ตรงๆ. Wet (effusive) = pyogranulomatous vasculitis → high-protein effusion (Rivalta+); Dry = granulomas ในอวัยวะ (ตา, ระบบประสาท). Diagnosis: คุณลักษณะ effusion + signalment + AGP elevation + PCR; tissue PCR ถ้าทำได้. GS-441524 (remdesivir analogue) เปลี่ยน prognosis จาก fatal เป็น curable.',
    subjects: ['com3', 'com4'] },
  { term: 'FeLV', aliases: ['feline leukemia virus'], category: 'disease', thai: 'ไวรัสมะเร็งเม็ดเลือดขาวแมว',
    defShort: 'retrovirus — vertical + saliva — lymphoma + cytopenia',
    defLong: 'Gammaretrovirus, transmits โดย saliva (mutual grooming, bite), vertically. Progressive infection → lymphoma, leukemia, immunosuppression, cytopenia. SNAP test = antigen (p27). Confirm with PCR. Vaccine available; recommended for outdoor cat. Co-infection กับ FIV เป็น clinical concern.',
    subjects: ['com3', 'com4'] },
  { term: 'FIV', aliases: ['feline immunodeficiency virus'], category: 'disease', thai: 'ไวรัสภูมิคุ้มกันบกพร่องแมว',
    defShort: 'lentivirus — bite transmission — immunosuppression late stage',
    defLong: 'Lentivirus เกี่ยวข้องกับ HIV. Transmitted ผ่าน bite wound เป็นหลัก (intact male outdoor cat highest risk). Stages: acute → asymptomatic carrier (years) → AIDS-like immunosuppression. SNAP = antibody (vaccinated cat false-positive — ต้อง history check). Combo SNAP กับ FeLV เป็น standard pre-adoption.',
    subjects: ['com3', 'com4'] },
  { term: 'kennel cough', aliases: ['CIRDC', 'canine infectious respiratory disease'], category: 'disease', thai: 'ไอในสุนัข',
    defShort: 'multi-agent upper-airway infection — Bordetella + parainfluenza + others',
    defLong: 'Canine infectious respiratory disease complex (CIRDC). Multiple agents: Bordetella bronchiseptica, CPiV, CAV-2, CIV, Mycoplasma. Hallmark = sudden honking cough, tracheal sensitivity. Self-limiting in healthy; abx (doxycycline) for prolonged or systemic signs. Intranasal vaccine combo (Bordetella+CPiV) preferred over injectable.',
    subjects: ['com3', 'com4'] },
  { term: 'distemper', aliases: ['CDV', 'canine distemper'], category: 'disease', thai: 'ดิสเทมเปอร์',
    defShort: 'morbillivirus — biphasic fever, oculonasal d/c, GI, neuro signs, hard pad',
    defLong: 'Morbillivirus closely related to measles. Phases: subclinical → systemic (fever, oculonasal discharge, GI) → neurologic (myoclonus, seizure — may be delayed weeks). Pathognomonic: hyperkeratosis ของ nasal planum + foot pad ("hard pad disease"). Diagnosis: RT-PCR, IHC. Treatment supportive — vaccine prevention is key.',
    subjects: ['com3', 'com4'] },
  { term: 'hepatic lipidosis', aliases: ['HL', 'feline fatty liver'], category: 'disease', thai: 'ตับไขมัน',
    defShort: 'ตับไขมันในแมว — secondary ต่อ anorexia/stress — life-threatening',
    defLong: 'การสะสม triglyceride ใน hepatocytes ของ cat. Almost always secondary to anorexia (other illness, stress, dietary change). Cat ไม่สามารถ mobilize protein-bound fat efficiently → massive lipid influx. Diagnosis: classic signalment (obese cat, recent anorexia) + hepatomegaly + cytology. Treatment = aggressive nutritional support (E-tube/N-tube), correct underlying cause.',
    subjects: ['com3', 'com4'] },
  { term: 'FLUTD', aliases: ['feline lower urinary tract disease'], category: 'disease', thai: 'โรคทางเดินปัสสาวะส่วนล่างของแมว',
    defShort: 'umbrella term — FIC (idiopathic), urolith, plug, neoplasia, infection',
    defLong: 'Umbrella diagnosis: feline idiopathic cystitis (FIC, > 60%), uroliths, urethral plug, UTI (uncommon, < 2% in young cat), neoplasia. Obstruction = emergency (hyperkalemia, AKI). Management: relieve obstruction → fluid/K correction → environmental modification (Multimodal Environmental MOdification, MEMO). Diet management (S/O, c/d).',
    subjects: ['com3', 'com4'] },
  { term: 'hyperthyroidism', aliases: [], category: 'disease', thai: 'ไทรอยด์เป็นพิษ',
    defShort: 'thyroid hormone excess — common ใน older cat — weight loss + polyphagia',
    defLong: 'การหลั่ง thyroid hormone มากเกิน. ในแมว อายุ > 8-10 ปี, มัก functional adenoma; carcinoma rare. Classic: weight loss แม้กินมาก, polydipsia, vomiting, tachycardia, palpable goiter. T4 elevated; free T4 ED ถ้า T4 borderline. Treatments: methimazole (medical), I-131 (curative), thyroidectomy, prescription diet (y/d).',
    subjects: ['com3', 'com4'] },
  { term: 'hypothyroidism', aliases: [], category: 'disease', thai: 'ไทรอยด์ต่ำ',
    defShort: 'thyroid hormone deficiency — common ใน middle-aged dog — lethargy + weight gain',
    defLong: 'การขาด thyroid hormone, primary > 95% (lymphocytic thyroiditis or idiopathic atrophy). Classic: lethargy, weight gain ไม่กินเพิ่ม, dermatologic (bilateral symmetric alopecia, "rat tail"), neurologic. T4 + TSH + free T4 ED; euthyroid sick syndrome ทำ T4 ต่ำ false-positive. Levothyroxine ตลอดชีวิต, monitor 4-6 hr post-pill T4.',
    subjects: ['com3', 'com4'] },
  { term: 'diabetes mellitus', aliases: ['DM'], category: 'disease', thai: 'เบาหวาน',
    defShort: 'insulin deficiency/resistance — hyperglycemia + glucosuria — PU/PD/PP/WL',
    defLong: 'การขาด insulin (dog, Type 1-like) หรือ insulin resistance + beta cell dysfunction (cat, Type 2-like). 4 classic clinical signs: PU, PD, polyphagia, weight loss. Diagnosis: persistent hyperglycemia + glucosuria; fructosamine ยืนยัน (avoids stress hyperglycemia ใน cat). Treatment: insulin (lente/glargine), diet (low-carb cat, high-fiber dog), monitor BG curve + fructosamine.',
    subjects: ['com3', 'com4'] },
  { term: "Addison's", aliases: ['Addisons', 'hypoadrenocorticism'], category: 'disease', thai: 'แอดดิสัน',
    defShort: 'cortisol +/- aldosterone deficiency — "great pretender" — Na:K < 27 classic',
    defLong: 'Primary adrenocortical insufficiency. ขาด cortisol + (ส่วนใหญ่) aldosterone. Classic: waxing-waning GI + lethargy, hypovolemic shock + bradycardia (paradoxical หลัง hyperkalemia). Na:K < 27 highly suggestive แต่ ไม่ specific 100%. Diagnose: ACTH stimulation test (low pre + post cortisol). Acute crisis: fluids + dexamethasone + DOCP/fludrocortisone replacement long-term.',
    subjects: ['com3', 'com4'] },
  { term: "Cushing's", aliases: ['Cushings', 'hyperadrenocorticism', 'HAC'], category: 'disease', thai: 'คุชชิ่ง',
    defShort: 'cortisol excess — PU/PD, pot belly, alopecia — LDDST or ACTH stim',
    defLong: 'Hyperadrenocorticism. Pituitary-dependent (PDH, ~85%) หรือ adrenal tumor (~15%). Classic: PU/PD, polyphagia, pot-bellied, bilateral symmetric alopecia, thin skin, calcinosis cutis. Screening: urine cortisol:creatinine (sensitive, not specific). Confirmation: LDDST (preferred) หรือ ACTH stim. Differentiate PDH vs AT: HDDST, abd ultrasound, eACTH. Treatment: trilostane, mitotane, adrenalectomy.',
    subjects: ['com3', 'com4'] },
  { term: 'IBD', aliases: ['inflammatory bowel disease'], category: 'disease', thai: 'ลำไส้อักเสบเรื้อรัง',
    defShort: 'idiopathic chronic enteropathy — diagnose of exclusion + biopsy',
    defLong: 'Chronic GI signs > 3 wk หลังจาก exclude parasites, infection, dietary, neoplasia. Categorized by response: food-responsive, antibiotic-responsive, steroid-responsive (immunosuppressant-responsive). Biopsy (endoscopic หรือ full-thickness) ต้องทำเพื่อ confirm + grade lymphoplasmacytic vs eosinophilic vs granulomatous infiltrate. Treatment ladder: diet trial → metronidazole/tylosin → prednisolone → cyclosporine/chlorambucil.',
    subjects: ['com3', 'com4'] },

  // ────────────────────────────────────────────────────────────
  // Drugs
  // ────────────────────────────────────────────────────────────
  { term: 'enrofloxacin', aliases: ['Baytril'], category: 'drug', thai: 'อีโนฟลอกซาซิน',
    defShort: 'fluoroquinolone — broad-spectrum — DNA gyrase inhibitor',
    defLong: 'Veterinary fluoroquinolone. Bactericidal (DNA gyrase + topoisomerase IV). Spectrum: Gram-neg incl Pseudomonas, some Gram-pos, atypicals (Mycoplasma). Caveats: cartilage damage in young growing dog (avoid < skeletal maturity), retinal toxicity ใน cat at > 5 mg/kg (use marbofloxacin/pradofloxacin in cat instead). Dosing: dog 5-20 mg/kg q24h.',
    subjects: ['com3', 'com4'], synonyms: ['fluoroquinolone'] },
  { term: 'doxycycline', aliases: ['Vibramycin'], category: 'drug', thai: 'ดอกซีไซคลีน',
    defShort: 'tetracycline — broad-spec + intracellular — kennel cough, tick-borne',
    defLong: 'Tetracycline class. Bacteriostatic, 30S inhibitor. First-line for tick-borne disease (Ehrlichia, Anaplasma, Rickettsia), Mycoplasma, Bordetella, leptospirosis. Caveats: esophageal stricture in cat (give with water bolus/food), tooth discoloration in growing animal, photosensitivity. Dose: 5-10 mg/kg q12-24h.',
    subjects: ['com3', 'com4'] },
  { term: 'metronidazole', aliases: ['Flagyl'], category: 'drug', thai: 'เมโทรนิดาโซล',
    defShort: 'antiprotozoal + anaerobic abx — Giardia, IBD adjunct',
    defLong: 'Nitroimidazole. Antiprotozoal (Giardia, Trichomonas, amebiasis) + activity against anaerobes (Clostridium, Bacteroides). Use in IBD เป็น immunomodulator/biofilm disruptor. Adverse: dose-related neurotoxicity (ataxia, nystagmus) — limit ≤ 50 mg/kg/day, ideally 10-15. Bitter taste; mask in liquid.',
    subjects: ['com3', 'com4'] },
  { term: 'prednisolone', aliases: ['pred'], category: 'drug', thai: 'เพรดนิโซโลน',
    defShort: 'glucocorticoid — anti-inflammatory + immunosuppressive — dose-dependent',
    defLong: 'Synthetic glucocorticoid. Activated form (vs prednisone — cat คน convert ไม่ดี → ใช้ prednisolone). Anti-inflam dose ~0.5-1 mg/kg/day; immunosuppressive 2-4 mg/kg/day. Adverse: iatrogenic Cushing\'s, PU/PD, polyphagia, GI ulcer (avoid concurrent NSAID), DM induction, immunosuppression. Taper gradually after > 2 weeks to avoid Addisonian crisis.',
    subjects: ['com3', 'com4'], synonyms: ['steroid', 'glucocorticoid'] },
  { term: 'furosemide', aliases: ['Lasix', 'frusemide'], category: 'drug', thai: 'ฟูโรเซไมด์',
    defShort: 'loop diuretic — first-line for cardiogenic pulmonary edema in CHF',
    defLong: 'Loop diuretic, blocks NKCC2 ใน thick ascending limb. Rapid onset (IV 5 min, PO 30 min). Indications: CHF (cardiogenic pulmonary edema first-line), hypercalcemia adjunct, refractory hypertension. Adverse: hypokalemia, dehydration, ototoxicity (high-dose), pre-renal azotemia. Cat lower CHF dose than dog (~1-2 mg/kg q12-24h chronic).',
    subjects: ['com3', 'com4'] },
  { term: 'pimobendan', aliases: ['Vetmedin'], category: 'drug', thai: 'พิโมเบนแดน',
    defShort: 'inodilator — positive inotrope + vasodilator — MMVD, DCM mainstay',
    defLong: 'Inodilator: Ca-sensitizer (positive inotrope without ↑ O2 demand) + PDE3 inhibitor (vasodilator). Mainstay for canine CHF (MMVD, DCM). EPIC trial: pimobendan delays onset of CHF in pre-clinical stage B2 MMVD. Dose 0.25-0.3 mg/kg PO q12h, ideally on empty stomach.',
    subjects: ['com3', 'com4'] },
  { term: 'enalapril', aliases: ['Enacard'], category: 'drug', thai: 'อีนาลาพริล',
    defShort: 'ACE inhibitor — afterload reduction, proteinuria management',
    defLong: 'Angiotensin-converting enzyme inhibitor. Blocks Ang I → Ang II conversion. Indications: CHF (afterload reduction), PLN (reduces proteinuria), systemic hypertension. Adverse: pre-renal azotemia (monitor BUN/creat 5-7 days after start), hypotension, hyperkalemia. Cat: benazepril preferred (less renal-dependent clearance).',
    subjects: ['com3', 'com4'], synonyms: ['ACE inhibitor', 'ACEi'] },
  { term: 'marbofloxacin', aliases: ['Marbocyl'], category: 'drug', thai: 'มาร์โบฟลอกซาซิน',
    defShort: 'cat-safer fluoroquinolone — no retinal toxicity at label dose',
    defLong: 'Fluoroquinolone alternative to enrofloxacin in cat (no retinal toxicity at label 2.75 mg/kg). Spectrum similar (Gram-neg, atypicals, some Gram-pos). Once-daily dosing. Still avoid in growing dog if possible.',
    subjects: ['com3', 'com4'] },
  { term: 'clavamox', aliases: ['amoxicillin clavulanate', 'co-amoxiclav', 'Augmentin'], category: 'drug', thai: 'คลาวาม็อกซ์',
    defShort: 'amoxicillin + clavulanic acid — first-line empiric many infections',
    defLong: 'Amoxicillin + clavulanic acid (beta-lactamase inhibitor). Broad spectrum incl beta-lactamase-producing organisms (Staph). First-line empiric for skin/soft tissue, UTI (uncomplicated), aspiration pneumonia. Dose 12.5-25 mg/kg q12h. GI upset common.',
    subjects: ['com3', 'com4'] },
  { term: 'fenbendazole', aliases: ['Panacur'], category: 'drug', thai: 'เฟนเบนดาโซล',
    defShort: 'benzimidazole anthelmintic — broad-spec incl Giardia',
    defLong: 'Benzimidazole. Binds tubulin, disrupts parasite microtubules. Spectrum: roundworm, hookworm, whipworm, tapeworm (Taenia not Dipylidium), Giardia (5-day course). Wide safety margin; safe in pregnant/lactating. Common Giardia dose: 50 mg/kg PO q24h × 3-5 days.',
    subjects: ['com3', 'com4'] },
  { term: 'milbemycin', aliases: ['milbemycin oxime', 'Interceptor'], category: 'drug', thai: 'มิลเบไมซิน',
    defShort: 'macrocyclic lactone — heartworm prevention + intestinal nematode',
    defLong: 'Macrocyclic lactone. Heartworm preventative (Dirofilaria immitis larva) + intestinal nematode control (hookworm, roundworm, whipworm). Safer in MDR1-mutant collies than ivermectin. Often combined (lufenuron, praziquantel).',
    subjects: ['com3', 'com4'] },
  { term: 'ivermectin', aliases: [], category: 'drug', thai: 'ไอเวอร์เม็กติน',
    defShort: 'macrocyclic lactone — caution in MDR1 mutant collies',
    defLong: 'Macrocyclic lactone. Heartworm prevention low-dose; high-dose for ectoparasites (Demodex, Sarcoptes). MDR1 (ABCB1) mutation in herding breeds (Collie, Aussie, Sheltie) → blood-brain barrier breach → neurotoxicity (ataxia, seizure, coma). Test MDR1 before high-dose use in at-risk breeds.',
    subjects: ['com3', 'com4'] },

  // ────────────────────────────────────────────────────────────
  // Lab values
  // ────────────────────────────────────────────────────────────
  { term: 'BUN', aliases: ['blood urea nitrogen'], category: 'lab-value', thai: 'BUN',
    defShort: 'urea nitrogen — kidney marker, affected by protein intake + GI bleed',
    defLong: 'ค่า nitrogen ใน urea, by-product ของ protein catabolism, excreted by kidney. Elevated = azotemia (pre-/renal/post-renal). Confounders: high-protein meal (mild ↑), GI bleeding (gut absorbs blood protein), severe liver dz can lower BUN. Best interpreted กับ creatinine + USG.',
    subjects: ['com3', 'com4'] },
  { term: 'creatinine', aliases: ['creat'], category: 'lab-value', thai: 'ครีอะตินีน',
    defShort: 'muscle breakdown product — renal function marker, less diet-dependent than BUN',
    defLong: 'By-product ของ muscle creatine phosphate, excreted by glomerular filtration. Less affected by diet/GI bleed than BUN — more specific renal marker. แต่ insensitive early (lose ~75% nephron function before rise). SDMA + USG ช่วย early detection.',
    subjects: ['com3', 'com4'] },
  { term: 'ALT', aliases: ['alanine aminotransferase'], category: 'lab-value', thai: 'ALT',
    defShort: 'hepatocellular enzyme — leakage marker — half-life dog ~60h, cat ~6h',
    defLong: 'Alanine aminotransferase, cytoplasmic enzyme ใน hepatocyte. Elevated = hepatocellular damage/necrosis. Half-life dog ~60 hr, cat ~6 hr (cat ALT rise indicates acute injury). Magnitude doesn\'t correlate with prognosis; trend over time is more useful.',
    subjects: ['com3', 'com4'] },
  { term: 'ALP', aliases: ['alkaline phosphatase', 'AlkPhos'], category: 'lab-value', thai: 'ALP',
    defShort: 'cholestasis marker + steroid-induced — cat ALP rise more specific',
    defLong: 'Alkaline phosphatase, multiple isoforms: liver (cholestasis), bone (growth, osteosarcoma), steroid-induced isoform (only in dog — corticosteroid, Cushing\'s). Cat ALP ↑ is more specific for hepatobiliary dz (short half-life, no steroid isoform).',
    subjects: ['com3', 'com4'] },
  { term: 'GGT', aliases: ['gamma-glutamyl transferase'], category: 'lab-value', thai: 'GGT',
    defShort: 'cholestasis enzyme — cat more sensitive than ALP for hepatic lipidosis',
    defLong: 'Gamma-glutamyl transferase. Cholestasis marker. ใน cat hepatic lipidosis, GGT มัก disproportionately normal/mildly elevated vs ALP markedly elevated — classic teaching point. ใน dog, GGT parallels ALP for cholestasis but less sensitive overall.',
    subjects: ['com3', 'com4'] },
  { term: 'hematocrit', aliases: ['HCT', 'PCV', 'packed cell volume'], category: 'lab-value', thai: 'ค่าฮีมาโตคริต',
    defShort: 'RBC volume fraction — anemia (low) vs polycythemia (high)',
    defLong: 'PCV/HCT: percent volume of packed RBCs in centrifuged blood. Dog normal ~37-55%, cat ~28-45%. Low = anemia (regenerative vs non-regen — check reticulocyte). High = polycythemia (dehydration, primary, secondary to hypoxia). Pair with TP estimate from same spun tube.',
    subjects: ['com3', 'com4'] },
  { term: 'reticulocyte', aliases: ['retic'], category: 'lab-value', thai: 'เรติคูโลไซต์',
    defShort: 'immature RBC — measure regenerative response to anemia',
    defLong: 'Immature non-nucleated RBC, polychromatophilic on Diff-Quik. Absolute count > 60-95K/μL dog = regenerative anemia. Cat: only aggregate reticulocytes count (punctate are residual from preceding 1-3 wk). Regenerative anemia = bone marrow responding (peripheral loss/destruction). Non-regen = primary BM disease or insufficient time (< 3-5 days).',
    subjects: ['com3', 'com4'] },
  { term: 'USG', aliases: ['urine specific gravity'], category: 'lab-value', thai: 'USG',
    defShort: 'urine concentration — interpretation depends on hydration + azotemia',
    defLong: 'Urine specific gravity = measure of urine concentration. Dog adequate concentrate > 1.030, cat > 1.035. Isosthenuria 1.008-1.012 = ไตเสีย concentrate/dilute ability. Interpret กับ hydration: USG ต่ำใน dehydrated/azotemic animal = renal failure (kidney ไม่สามารถ concentrate ตอบสนอง). USG ต่ำใน well-hydrated animal = appropriate.',
    subjects: ['com3', 'com4'] },
  { term: 'Coombs test', aliases: ['DAT', 'direct antiglobulin test', "Coombs'"], category: 'lab-value', thai: 'คูมส์เทสต์',
    defShort: 'direct antiglobulin test — IgG/C3 bound to RBC — IMHA',
    defLong: 'Direct antiglobulin test (DAT). Detects IgG หรือ C3 bound to RBC surface. Positive in immune-mediated hemolytic anemia (IMHA). False-neg ~25-40% (low Ab density). False-pos in some chronic dz. Better: in-saline agglutination (spherocytes + auto-agglutination) + reticulocyte count + ghost cells on smear.',
    subjects: ['com3', 'com4'] },

  // ────────────────────────────────────────────────────────────
  // Organisms
  // ────────────────────────────────────────────────────────────
  { term: 'E. coli', aliases: ['Escherichia coli'], category: 'organism', thai: 'อีโคไล',
    defShort: 'Gram-neg enteric — UTI, neonatal sepsis, mastitis, peritonitis',
    defLong: 'Gram-negative facultative anaerobe, Enterobacteriaceae. Normal gut flora; pathogenic strains cause UTI (uropathogenic E. coli — #1 isolate), neonatal septicemia, peritonitis, mastitis. Antimicrobial choice ตาม culture/susceptibility — ESBL emerging concern.',
    subjects: ['com3', 'com4'] },
  { term: 'Salmonella', aliases: [], category: 'organism', thai: 'ซาลโมเนลล่า',
    defShort: 'Gram-neg enteric — zoonotic — raw-fed pet, reptile, poultry',
    defLong: 'Gram-negative rod, Enterobacteriaceae. Zoonotic. Clinical: enteritis (esp. puppy/kitten), bacteremia, septicemia. Sources: contaminated food (raw diet), reptiles (asymptomatic carrier), poultry. Public health concern for immunocompromised handlers. Treatment controversial — many recommend supportive only for uncomplicated case to avoid prolonging carrier state.',
    subjects: ['com3', 'com4'] },
  { term: 'Staphylococcus pseudintermedius', aliases: ['S. pseudintermedius', 'SP'], category: 'organism', thai: 'สแตฟิโลค็อกคัส พซูโดอินเทอร์มีเดียส',
    defShort: 'Gram-pos coccus — #1 canine pyoderma — MRSP emerging',
    defLong: 'Gram-positive coccus, primary commensal/pathogen ของ dog skin. #1 cause of canine superficial pyoderma. Methicillin-resistant SP (MRSP) emerging — multi-drug-resistant, often only chloramphenicol/amikacin/topicals work. Culture + susceptibility for any recurrent/non-responsive pyoderma.',
    subjects: ['com3', 'com4'] },
  { term: 'Pasteurella', aliases: ['Pasteurella multocida'], category: 'organism', thai: 'พาสเจอเรลล่า',
    defShort: 'Gram-neg coccobacillus — cat oral flora — cat-bite cellulitis classic',
    defLong: 'Gram-negative coccobacillus. Normal oral flora ของ cat (~90%) และ dog. Cat bite/scratch → rapid-onset cellulitis (hours), often with lymphangitis. Treatment: amoxicillin/clavulanate first-line. Pulmonary form in rabbit ("snuffles") เป็น chronic respiratory dz.',
    subjects: ['com3', 'com4', 'exotic'] },
  { term: 'Bordetella', aliases: ['Bordetella bronchiseptica'], category: 'organism', thai: 'บอร์เดเทลล่า',
    defShort: 'Gram-neg — major kennel cough agent — intranasal vaccine preferred',
    defLong: 'Bordetella bronchiseptica. Gram-negative coccobacillus, attaches to respiratory cilia. Major component of canine infectious respiratory disease complex (CIRDC, "kennel cough"). Intranasal vaccine = faster mucosal immunity than parenteral; combined with CPiV. Doxycycline first-line abx for symptomatic case.',
    subjects: ['com3', 'com4'] },
  { term: 'Mycoplasma haemofelis', aliases: ['Mhf', 'feline hemoplasmosis'], category: 'organism', thai: 'ไมโคพลาสมา ฮีโมเฟลิส',
    defShort: 'feline hemotropic — RBC parasite — acute hemolytic anemia',
    defLong: 'Hemotropic Mycoplasma (formerly Haemobartonella felis). Adheres to RBC surface → immune-mediated hemolytic anemia. Two species in cat: M. haemofelis (more pathogenic, acute crisis), Candidatus M. haemominutum (less). PCR diagnosis (cyclic parasitemia → smear unreliable). Doxycycline 4-6 wk.',
    subjects: ['com3', 'com4'] },
  { term: 'Ehrlichia', aliases: ['Ehrlichia canis'], category: 'organism', thai: 'เออร์ลิเชีย',
    defShort: 'tick-borne rickettsia — thrombocytopenia, pancytopenia — doxycycline',
    defLong: 'Obligate intracellular Gram-neg, Rickettsiales. Transmitted by Rhipicephalus sanguineus (brown dog tick) — common in tropics incl Thailand. Phases: acute → subclinical → chronic (pancytopenia, hypergammaglobulinemia, bleeding). Diagnosis: 4DX SNAP (Ab), PCR (DNA). Treatment: doxycycline 5 mg/kg q12h × 28 days.',
    subjects: ['com3', 'com4'] },
  { term: 'Anaplasma', aliases: ['Anaplasma phagocytophilum', 'Anaplasma platys'], category: 'organism', thai: 'อะนาพลาสมา',
    defShort: 'tick-borne rickettsia — granulocytic or platelet inclusion',
    defLong: 'Rickettsiales. A. phagocytophilum (granulocytic anaplasmosis, Ixodes tick) — fever, lethargy, lameness, thrombocytopenia. A. platys (canine cyclic thrombocytopenia, R. sanguineus). 4DX SNAP screens; PCR confirms species. Doxycycline 28 days.',
    subjects: ['com3', 'com4'] },
  { term: 'Babesia', aliases: ['Babesia canis', 'Babesia gibsoni'], category: 'organism', thai: 'บาบีเซีย',
    defShort: 'tick-borne protozoa — intra-RBC parasite — hemolytic anemia',
    defLong: 'Tick-borne protozoan parasite of RBC. Large form (B. canis subspecies) - Rhipicephalus tick. Small form (B. gibsoni) — pit-bull breed cluster, often fight-transmitted. Clinical: hemolytic anemia, thrombocytopenia, splenomegaly. Diagnosis: blood smear (low sensitivity), PCR. Treatment: imidocarb (large form), atovaquone+azithromycin (gibsoni, but not always curative).',
    subjects: ['com3', 'com4'] },
  { term: 'Cryptosporidium', aliases: ['crypto'], category: 'organism', thai: 'คริปโตสปอริเดียม',
    defShort: 'protozoan enteric — zoonotic — small oocyst, acid-fast staining',
    defLong: 'Apicomplexan protozoan. Small oocyst (~5 μm, smaller than Giardia cyst). Zoonotic — calf-handler outbreaks classic. In young/immunocompromised → watery diarrhea. Diagnosis: acid-fast stain ของ fecal smear, PCR. Treatment limited (azithromycin, paromomycin); supportive care + zoonotic precaution main.',
    subjects: ['com3', 'com4'] },
  { term: 'Giardia', aliases: ['Giardia duodenalis'], category: 'organism', thai: 'จิอาเดีย',
    defShort: 'protozoan enteric — trophozoite + cyst — fenbendazole 5 days',
    defLong: 'Flagellated protozoan. Trophozoite (active) ใน small intestine → cyst (environmental form). Fecal-oral transmission; water-borne outbreaks. Clinical: small-bowel diarrhea, malabsorption. Diagnosis: SNAP fecal Ag (best single-sample), zinc sulfate flotation (cyst — intermittent shedding, 3 samples), direct smear (trophozoite, fresh sample only). Treatment: fenbendazole 50 mg/kg × 3-5 days, metronidazole second-line. Bathing + environmental decontamination key.',
    subjects: ['com3', 'com4'] },
  { term: 'Demodex', aliases: ['Demodex canis', 'demodicosis'], category: 'organism', thai: 'ไรขี้เรื้อนเปียก',
    defShort: 'cigar-shaped mite — deep skin scrape — isoxazoline first-line',
    defLong: 'Cigar-shaped mite, normal skin commensal in low numbers. Demodicosis = clinical disease when proliferates (juvenile-onset usually genetic immunodeficiency; adult-onset rule out endocrine/neoplasia/immunosuppression). Localized vs generalized. Diagnosis: deep skin scrape (or trichogram). Treatment: isoxazoline (afoxolaner, fluralaner, sarolaner) revolutionized — replaced amitraz dips. Generalized demodicosis = lifelong management consideration.',
    subjects: ['com3', 'com4'] },
  { term: 'Sarcoptes', aliases: ['Sarcoptes scabiei', 'scabies'], category: 'organism', thai: 'ไรขี้เรื้อนแห้ง',
    defShort: 'burrowing mite — intense pruritus — zoonotic, ear-pinnal-pedal reflex',
    defLong: 'Sarcoptes scabiei var canis. Burrowing mite → intense pruritus (very different from Demodex). Zoonotic (transient lesions ใน human). Predilection: pinnal margins, elbows, hocks. Ear-pinnal-pedal scratch reflex highly suggestive. Skin scrape low sensitivity (only ~30%) — empirical treatment trial reasonable. Isoxazoline first-line; selamectin / advocate / amitraz alternatives.',
    subjects: ['com3', 'com4'] },
  { term: 'Notoedres', aliases: ['Notoedres cati', 'feline scabies'], category: 'organism', thai: 'ไรขี้เรื้อนแมว',
    defShort: 'feline scabies — pruritic head/neck — selamectin treatment',
    defLong: 'Feline sarcoptid mite. Pruritic, crusty lesions starting on ear tip, head, neck — can generalize. Less common in well-cared cat population. Skin scrape diagnostic (more readily found than canine Sarcoptes). Treatment: selamectin (off-label) repeated, isoxazoline (off-label). Treat all in-contact cat.',
    subjects: ['com3', 'com4'] },
];

// ────────────────────────────────────────────────────────────
// Pre-built lookup index — runs once at module load.
// Maps every term + alias + synonym → canonical entry (lowercased).
// Aliases are matched by the detection regex; synonyms are NOT
// (kept for related-Q text scanning only — see term-detect.js).
// ────────────────────────────────────────────────────────────
const TERM_INDEX = new Map();
for (const entry of GLOSSARY) {
  TERM_INDEX.set(entry.term.toLowerCase(), entry);
  for (const alias of entry.aliases || []) {
    TERM_INDEX.set(alias.toLowerCase(), entry);
  }
}

// Synonyms map separately — used by related-Q matcher only.
const SYNONYM_INDEX = new Map();
for (const entry of GLOSSARY) {
  for (const syn of entry.synonyms || []) {
    SYNONYM_INDEX.set(syn.toLowerCase(), entry);
  }
}

// Case-insensitive lookup by term, alias, or synonym. Returns the
// canonical glossary entry or null. Used by TermPopup + term-detect.
export function findGlossaryEntry(termOrAliasOrSyn) {
  if (!termOrAliasOrSyn) return null;
  const key = String(termOrAliasOrSyn).toLowerCase();
  return TERM_INDEX.get(key) || SYNONYM_INDEX.get(key) || null;
}

// All terms (canonical + aliases) used for the detection regex.
// Synonyms NOT included — too ambiguous for word-boundary matching.
export function getAllDetectableTerms() {
  return Array.from(TERM_INDEX.keys());
}

// All searchable strings for related-Q matching (terms + aliases +
// synonyms — broader net, search inside full Q text).
export function getAllSearchableStrings(entry) {
  if (!entry) return [];
  return [
    entry.term,
    ...(entry.aliases || []),
    ...(entry.synonyms || []),
  ].filter(Boolean);
}
