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
//   scope      WHERE this definition is true. Either the string
//              'universal' (the concept does not change with species or
//              discipline — azotemia, ALT, Salmonella) or an array of
//              subject ids / family names from SCOPE_FAMILIES below.
//              A card only opens on a question whose subject the scope
//              covers. There is no default: an entry without a scope is
//              a lint error, because the old `subjects` field was
//              written once, never read by any code, and drifted until
//              every entry claimed com3+com4 whether or not it was true.
//
// IRON RULE 0 — clinical accuracy first. If a definition is uncertain
// for a niche species/context, the field is left out rather than
// invented. Reviewers: flag any entry that misrepresents textbook
// consensus.
//
// The same rule is why scope exists. A term can be spelled identically
// in two disciplines and mean different things: IBD is inflammatory
// bowel disease to a small-animal clinician and infectious bursal
// disease to a poultry one, PCV is packed cell volume next to a
// haematology question and porcine circovirus next to a swine one.
// Showing the wrong one is worse than showing nothing, so a term that
// resolves to no in-scope entry is simply not underlined.
// ============================================================

// Subject families — shorthand for a scope that covers a whole
// discipline. Ids are the same subject ids the question bank uses
// (src/data/curriculum.js); lint:glossary fails on an unknown one.
export const SCOPE_FAMILIES = {
  'small-animal': ['com1', 'com2', 'com3', 'com4', 'com5', 'vca', 'poa-clinical',
    'surg1', 'surg2', 'surg3', 'vet-imaging', 'repro-lect', 'repro', 'comp-repro-clinic'],
  ruminant: ['cliapprum', 'practrum', 'herd-health-rum', 'ruminant-clinical'],
  swine: ['swine-clinic', 'swine-herd', 'swine-repro'],
  avian: ['avian-medicine', 'poultry'],
  equine: ['equine-medicine', 'equine-repro'],
  aquatic: ['aquatic-clinic'],
  exotic: ['exotic'],
  'public-health': ['zoonoses', 'one-health', 'epidemiology', 'milk-meat-hygiene',
    'food-industry', 'food-safety-y4', 'livestock-pathology', 'vet-juris'],
  'basic-science': ['biochem-1', 'vet-histo', 'vet-neuroanat', 'vet-dev-anat',
    'vet-pharm-2', 'rec-adv-bioscience'],
};

export const GLOSSARY = [
  // ────────────────────────────────────────────────────────────
  // Symptoms / clinical signs
  // ────────────────────────────────────────────────────────────
  { term: 'azotemia', aliases: ['azotaemia'], category: 'symptom', thai: 'อะโซเทเมีย',
    defShort: 'BUN/creatinine สูง — บ่งบอก renal dysfunction หรือ pre-/post-renal cause',
    defLong: 'การเพิ่มขึ้นของ nitrogenous waste (urea, creatinine) ในเลือด แบ่งเป็น pre-renal (dehydration, low perfusion), renal (intrinsic kidney injury) และ post-renal (urethral obstruction). ตรวจร่วมกับ USG เพื่อจำแนก: USG > 1.030 (dog) มัก pre-renal. Azotemia ที่มี clinical signs ร่วมเรียก uremia.',
    scope: 'universal', synonyms: ['high BUN', 'high creatinine'] },
  { term: 'tachycardia', aliases: [], category: 'symptom', thai: 'หัวใจเต้นเร็ว',
    defShort: 'HR เร็วผิดปกติ — sinus (pain/fever/hypovolemia) หรือ pathologic (VT/SVT)',
    defLong: 'อัตราการเต้นของหัวใจที่สูงกว่า species-specific norm (dog > 160 small, > 140 large; cat > 220). Sinus tachycardia เป็น compensatory response; non-sinus (VT/SVT) ต้อง ECG diagnose. รักษาตามสาเหตุ — fluid resuscitation, analgesia, antiarrhythmic ตามชนิด.',
    scope: 'universal', synonyms: ['fast heart rate'] },
  { term: 'bradycardia', aliases: [], category: 'symptom', thai: 'หัวใจเต้นช้า',
    defShort: 'HR ต่ำกว่า normal — vagal tone, drug effect, AV block, hyperkalemia',
    defLong: 'อัตราการเต้นของหัวใจต่ำ (large dog < 60, small dog < 80, cat < 130). สาเหตุพบบ่อย: high vagal tone (เช่น GI dz), beta-blocker overdose, hyperkalemia (atrial standstill ใน urethral obstruction cat), AV block. แก้ที่ underlying cause; atropine + pacing สำหรับ symptomatic.',
    scope: 'universal', synonyms: ['slow heart rate'] },
  { term: 'polyuria', aliases: [], category: 'symptom', thai: 'ปัสสาวะมาก',
    defShort: 'urine output สูงผิดปกติ — มากับ polydipsia (PU/PD complex)',
    defLong: 'ปริมาณ urine ที่ขับออกมากเกิน norm (> 50 mL/kg/day dog). มักมาคู่กับ polydipsia (PU/PD). DDx ที่พบบ่อย: DM, CKD, Cushing\'s, hyperthyroidism (cat), DI, hypercalcemia, pyometra. Workup: USG (isosthenuric บ่งบอกตามไต), CBC/chem, water deprivation test เมื่อ ddx แคบแล้ว.',
    scope: 'universal', synonyms: ['PU/PD'] },
  { term: 'polydipsia', aliases: [], category: 'symptom', thai: 'กระหายน้ำมาก',
    defShort: 'น้ำดื่มเกิน norm (dog > 100 mL/kg/day) — มากับ polyuria',
    defLong: 'การดื่มน้ำมากผิดปกติ. มัก secondary ต่อ polyuria (compensatory) ไม่ใช่ primary thirst defect. Workup เหมือน PU. Primary polydipsia (psychogenic) ใน dog หายาก แต่ rule-out ต้อง water deprivation test.',
    scope: 'universal', synonyms: ['PU/PD'] },
  { term: 'anorexia', aliases: [], category: 'symptom', thai: 'เบื่ออาหาร',
    defShort: 'ไม่กิน — non-specific แต่ early sign ของหลายโรค โดยเฉพาะ cat',
    defLong: 'การไม่กินอาหาร เป็น non-specific clinical sign ที่ early แต่สำคัญ. ใน cat การ anorexia > 2-3 วันเสี่ยง hepatic lipidosis. หาสาเหตุ systematic: GI, dental, metabolic, neoplasia, behavioral. Appetite stimulant (mirtazapine, capromorelin) เป็น symptomatic ขณะหาสาเหตุ.',
    scope: 'universal', synonyms: ['inappetence'] },
  { term: 'lethargy', aliases: [], category: 'symptom', thai: 'ซึม',
    defShort: 'พลังงานลดลง, ตอบสนองช้า — non-specific, ของจริงต้องสังเกตเทียบ baseline',
    defLong: 'ลดลงของ activity และ responsiveness. Mild → severe: dull, obtunded, stuporous, comatose. เป็น window ของหลาย systemic dz (anemia, sepsis, metabolic, neuro). ประเมินคู่กับ mentation + vital signs.',
    scope: 'universal', synonyms: ['depression', 'dullness'] },
  { term: 'dyspnea', aliases: ['dyspnoea'], category: 'symptom', thai: 'หายใจลำบาก',
    defShort: 'หายใจลำบาก — แยก upper airway (stridor), lower (wheeze), pleural, parenchymal',
    defLong: 'การหายใจที่ผู้ป่วยต้องใช้แรงเพิ่ม. Localize ก่อน treat: upper airway (inspiratory stridor), lower airway (expiratory wheeze, asthma), pleural space (restrictive, short shallow), parenchymal (crackles, edema). O2 supplementation ก่อนทำหัตถการในผู้ป่วยที่ unstable.',
    scope: 'universal', synonyms: ['respiratory distress'] },
  { term: 'cyanosis', aliases: [], category: 'symptom', thai: 'ผิวเขียวคล้ำ',
    defShort: 'mucous membrane สีน้ำเงิน — deoxyHb > 5 g/dL — severe hypoxia',
    defLong: 'สีผิว/เยื่อเมือกที่เป็นน้ำเงินจาก deoxygenated Hb > 5 g/dL. Central cyanosis = systemic hypoxia (cardiac shunt, severe pulmonary dz, methemoglobinemia). Peripheral cyanosis = local poor perfusion. ใน anemic animal อาจไม่เห็น cyanosis แม้ severe hypoxic.',
    scope: 'universal', synonyms: ['blue mm'] },
  { term: 'jaundice', aliases: ['icterus'], category: 'symptom', thai: 'ดีซ่าน',
    defShort: 'sclera/mm สีเหลือง — bilirubin สูง — pre-/hepatic/post-hepatic',
    defLong: 'สีเหลืองของ sclera, mucous membrane, skin จาก bilirubin > ~2-3 mg/dL. Pre-hepatic = hemolysis (IMHA, Babesia, Heinz body). Hepatic = liver dz. Post-hepatic = biliary obstruction (mucocele, pancreatitis, neoplasia). Workup: CBC/smear/Coombs ก่อน chase liver disease.',
    scope: 'universal', synonyms: ['icteric'] },
  { term: 'ascites', aliases: [], category: 'symptom', thai: 'ท้องมาน',
    defShort: 'ของเหลวสะสมใน peritoneal cavity — transudate vs exudate vs hemorrhagic',
    defLong: 'การสะสมของ fluid ใน peritoneal cavity. Causes: right-sided CHF, hypoalbuminemia (PLN/PLE), portal hypertension, neoplasia, FIP, septic peritonitis, hemoabdomen. Diagnostic abdominocentesis + fluid analysis (TP, cellularity, cytology, culture) เป็น core diagnostic step.',
    scope: 'universal', synonyms: ['abdominal effusion'] },
  { term: 'edema', aliases: ['oedema'], category: 'symptom', thai: 'บวมน้ำ',
    // Uterine oedema on a mare-cycle scan is a normal oestrogen effect,
    // and pulmonary oedema has its own management — neither is this card.
    notAfter: ['uterine', 'endometrial', 'pulmonary', 'มดลูก'],
    defShort: 'ของเหลวสะสมใน interstitium — pitting (low oncotic) vs non-pitting',
    defLong: 'สะสมของ extracellular fluid ใน interstitial space. Pitting edema มัก hypoalbuminemic (PLN, PLE, liver failure). Non-pitting = lymphatic obstruction. Pulmonary edema = life-threatening; ดู respiratory rate + lung sounds.',
    scope: 'universal' },
  { term: 'regurgitation', aliases: [], category: 'symptom', thai: 'สำรอก',
    // "mitral regurgitation" is a leaking valve, not food coming back up.
    notAfter: ['mitral', 'tricuspid', 'aortic', 'pulmonic', 'valvular'],
    defShort: 'อาหารออกจากปากแบบ passive — esophageal — แยกจาก vomit',
    defLong: 'การออกของอาหาร/น้ำลายจาก esophagus แบบ passive ไม่มี abdominal effort. ต่างจาก vomit ที่มี prodromal nausea + active retching. Causes: megaesophagus (myasthenia, idiopathic), esophagitis, stricture, vascular ring anomaly, foreign body. High aspiration pneumonia risk.',
    scope: 'universal', synonyms: ['regurgitate'] },

  // ────────────────────────────────────────────────────────────
  // Diseases
  // ────────────────────────────────────────────────────────────
  { term: 'pyometra', aliases: [], category: 'disease', thai: 'มดลูกอักเสบเป็นหนอง',
    defShort: 'มดลูกอักเสบมีหนอง — intact female ใน diestrus — open vs closed cervix',
    defLong: 'การติดเชื้อแบคทีเรียในมดลูกของ intact female ขณะ diestrus (progesterone-mediated endometrial hyperplasia + immune suppression). Open pyometra = cervix เปิด, discharge ออก, less critical. Closed = ไม่มี discharge, septic/endotoxic shock risk สูง. Treatment of choice = OVH; medical (aglepristone + abx) สำหรับ breeder.',
    scope: ['small-animal'], synonyms: ['uterine infection'] },
  { term: 'parvovirus', aliases: ['parvo', 'CPV'], category: 'disease', thai: 'พาร์โว',
    defShort: 'CPV-2 — hemorrhagic enteritis + leukopenia ใน puppy unvaccinated',
    defLong: 'Canine parvovirus-2 (CPV-2 และ subtypes 2a/2b/2c) attacks rapidly-dividing cells: GI crypts (hemorrhagic diarrhea, vomiting) และ bone marrow (severe leukopenia/neutropenia). Fecal Ag SNAP เป็น first-line diagnostic แม้ false-negative ได้. Treatment = aggressive supportive: IV fluid, antiemetic (maropitant), broad-spectrum abx for translocation, isolation. Mortality ลดลงมากเมื่อ early aggressive treat.',
    scope: ['small-animal'] },
  { term: 'FIP', aliases: ['feline infectious peritonitis'], category: 'disease', thai: 'เยื่อบุช่องท้องอักเสบในแมว',
    defShort: 'coronavirus mutation ในแมว — wet (effusive) vs dry (non-effusive)',
    defLong: 'การกลายพันธุ์ของ feline coronavirus (FCoV) ภายใน individual cat — ไม่ใช่ contagious ตรงๆ. Wet (effusive) = pyogranulomatous vasculitis → high-protein effusion (Rivalta+); Dry = granulomas ในอวัยวะ (ตา, ระบบประสาท). Diagnosis: คุณลักษณะ effusion + signalment + AGP elevation + PCR; tissue PCR ถ้าทำได้. GS-441524 (remdesivir analogue) เปลี่ยน prognosis จาก fatal เป็น curable.',
    scope: ['small-animal'] },
  { term: 'FeLV', aliases: ['feline leukemia virus'], category: 'disease', thai: 'ไวรัสมะเร็งเม็ดเลือดขาวแมว',
    defShort: 'retrovirus — vertical + saliva — lymphoma + cytopenia',
    defLong: 'Gammaretrovirus, transmits โดย saliva (mutual grooming, bite), vertically. Progressive infection → lymphoma, leukemia, immunosuppression, cytopenia. SNAP test = antigen (p27). Confirm with PCR. Vaccine: แนะนำในลูกแมวทุกตัว และในแมวโตที่ยังมีความเสี่ยง (ออกนอกบ้าน อยู่รวมฝูง หรือร่วมบ้านกับแมว FeLV+) ต้องตรวจสถานะก่อนฉีดเสมอ. Co-infection กับ FIV เป็น clinical concern.',
    scope: ['small-animal'] },
  { term: 'FIV', aliases: ['feline immunodeficiency virus'], category: 'disease', thai: 'ไวรัสภูมิคุ้มกันบกพร่องแมว',
    defShort: 'lentivirus — bite transmission — immunosuppression late stage',
    defLong: 'Lentivirus เกี่ยวข้องกับ HIV. Transmitted ผ่าน bite wound เป็นหลัก (intact male outdoor cat highest risk). Stages: acute → asymptomatic carrier (years) → AIDS-like immunosuppression. SNAP = antibody (vaccinated cat false-positive — ต้อง history check). Combo SNAP กับ FeLV เป็น standard pre-adoption.',
    scope: ['small-animal'] },
  { term: 'kennel cough', aliases: ['CIRDC', 'canine infectious respiratory disease'], category: 'disease', thai: 'ไอในสุนัข',
    defShort: 'multi-agent upper-airway infection — Bordetella + parainfluenza + others',
    defLong: 'Canine infectious respiratory disease complex (CIRDC). Multiple agents: Bordetella bronchiseptica, CPiV, CAV-2, CIV, Mycoplasma. Hallmark = sudden honking cough, tracheal sensitivity. Self-limiting in healthy; abx (doxycycline) for prolonged or systemic signs. Intranasal vaccine combo (Bordetella+CPiV) preferred over injectable.',
    scope: ['small-animal'] },
  { term: 'distemper', aliases: ['CDV', 'canine distemper'], category: 'disease', thai: 'ดิสเทมเปอร์',
    defShort: 'morbillivirus — biphasic fever, oculonasal d/c, GI, neuro signs, hard pad',
    defLong: 'Morbillivirus closely related to measles. Phases: subclinical → systemic (fever, oculonasal discharge, GI) → neurologic (myoclonus, seizure — may be delayed weeks). Classic แต่ไม่ pathognomonic: hyperkeratosis ของ nasal planum + foot pad ("hard pad") — DDx pemphigus foliaceus, zinc-responsive dermatosis, hepatocutaneous syndrome. Diagnosis: RT-PCR, IHC. Treatment supportive — vaccine prevention is key.',
    scope: ['small-animal'] },
  { term: 'hepatic lipidosis', aliases: ['feline fatty liver'], category: 'disease', thai: 'ตับไขมัน',
    defShort: 'ตับไขมันในแมว — secondary ต่อ anorexia/stress — life-threatening',
    defLong: 'การสะสม triglyceride ใน hepatocytes ของ cat. Almost always secondary to anorexia (other illness, stress, dietary change). Anorexia → peripheral fat mobilization ท่วมท้น แต่ hepatocyte oxidize และ export เป็น VLDL ไม่ทัน (แมวสังเคราะห์ apoprotein ได้จำกัด และขาด arginine/taurine/carnitine/methionine ซ้ำเติม) → triglyceride คั่งในตับ. Diagnosis: classic signalment (obese cat, recent anorexia) + hepatomegaly + cytology. Treatment = aggressive nutritional support (E-tube/N-tube), correct underlying cause.',
    scope: ['small-animal'] },
  { term: 'FLUTD', aliases: ['feline lower urinary tract disease'], category: 'disease', thai: 'โรคทางเดินปัสสาวะส่วนล่างของแมว',
    defShort: 'umbrella term — FIC (idiopathic), urolith, plug, neoplasia, infection',
    defLong: 'Umbrella diagnosis: feline idiopathic cystitis (FIC, > 60%), uroliths, urethral plug, UTI (uncommon, < 2% in young cat), neoplasia. Obstruction = emergency (hyperkalemia, AKI). Management: relieve obstruction → fluid/K correction → environmental modification (Multimodal Environmental MOdification, MEMO). Diet management (S/O, c/d).',
    scope: ['small-animal'] },
  { term: 'hyperthyroidism', aliases: [], category: 'disease', thai: 'ไทรอยด์เป็นพิษ',
    defShort: 'thyroid hormone excess — common ใน older cat — weight loss + polyphagia',
    defLong: 'การหลั่ง thyroid hormone มากเกิน. ในแมว อายุ > 8-10 ปี, มัก functional adenoma; carcinoma rare. Classic: weight loss แม้กินมาก, polydipsia, vomiting, tachycardia, palpable goiter. T4 elevated; free T4 ED ถ้า T4 borderline. Treatments: methimazole (medical), I-131 (curative), thyroidectomy, prescription diet (y/d).',
    scope: ['small-animal'] },
  { term: 'hypothyroidism', aliases: [], category: 'disease', thai: 'ไทรอยด์ต่ำ',
    defShort: 'thyroid hormone deficiency — common ใน middle-aged dog — lethargy + weight gain',
    defLong: 'การขาด thyroid hormone, primary > 95% (lymphocytic thyroiditis or idiopathic atrophy). Classic: lethargy, weight gain ไม่กินเพิ่ม, dermatologic (bilateral symmetric alopecia, "rat tail"), neurologic. T4 + TSH + free T4 ED; euthyroid sick syndrome ทำ T4 ต่ำ false-positive. Levothyroxine ตลอดชีวิต, monitor 4-6 hr post-pill T4.',
    scope: ['small-animal'] },
  { term: 'diabetes mellitus', aliases: [], category: 'disease', thai: 'เบาหวาน',
    defShort: 'insulin deficiency/resistance — hyperglycemia + glucosuria — PU/PD/PP/WL',
    defLong: 'การขาด insulin (dog, Type 1-like) หรือ insulin resistance + beta cell dysfunction (cat, Type 2-like). 4 classic clinical signs: PU, PD, polyphagia, weight loss. Diagnosis: persistent hyperglycemia + glucosuria; fructosamine ยืนยัน (avoids stress hyperglycemia ใน cat). Treatment: insulin (lente/glargine), diet (low-carb cat, high-fiber dog), monitor BG curve + fructosamine.',
    scope: ['small-animal'] },
  { term: "Addison's", aliases: ['Addisons', 'hypoadrenocorticism'], category: 'disease', thai: 'แอดดิสัน',
    defShort: 'cortisol +/- aldosterone deficiency — "great pretender" — Na:K < 27 classic',
    defLong: 'Primary adrenocortical insufficiency. ขาด cortisol + (ส่วนใหญ่) aldosterone. Classic: waxing-waning GI + lethargy, hypovolemic shock + bradycardia (paradoxical หลัง hyperkalemia). Na:K < 27 highly suggestive แต่ ไม่ specific 100%. Diagnose: ACTH stimulation test (low pre + post cortisol). Acute crisis: fluids + dexamethasone. Long-term: fludrocortisone PO (mineralo + gluco) หรือ DOCP ฉีด q25d — DOCP เป็น mineralocorticoid อย่างเดียว ต้องให้ prednisolone ควบเสมอ.',
    scope: ['small-animal'] },
  { term: "Cushing's", aliases: ['Cushings', 'hyperadrenocorticism', 'HAC'], category: 'disease', thai: 'คุชชิ่ง',
    defShort: 'cortisol excess — PU/PD, pot belly, alopecia — LDDST or ACTH stim',
    defLong: 'Hyperadrenocorticism. Pituitary-dependent (PDH, ~85%) หรือ adrenal tumor (~15%). Classic: PU/PD, polyphagia, pot-bellied, bilateral symmetric alopecia, thin skin, calcinosis cutis. Screening: urine cortisol:creatinine (sensitive, not specific). Confirmation: LDDST (preferred) หรือ ACTH stim. Differentiate PDH vs AT: HDDST, abd ultrasound, eACTH. Treatment: trilostane, mitotane, adrenalectomy.',
    scope: ['small-animal'] },
  { term: 'IBD', aliases: ['inflammatory bowel disease'], category: 'disease', thai: 'ลำไส้อักเสบเรื้อรัง',
    defShort: 'idiopathic chronic enteropathy — diagnose of exclusion + biopsy',
    defLong: 'Chronic GI signs > 3 wk หลังจาก exclude parasites, infection, dietary, neoplasia. Categorized by response: food-responsive, antibiotic-responsive, steroid-responsive (immunosuppressant-responsive). Biopsy (endoscopic หรือ full-thickness) ต้องทำเพื่อ confirm + grade lymphoplasmacytic vs eosinophilic vs granulomatous infiltrate. Treatment ladder: diet trial → metronidazole/tylosin → prednisolone → cyclosporine/chlorambucil.',
    scope: ['small-animal'] },

  // ────────────────────────────────────────────────────────────
  // Drugs
  // ────────────────────────────────────────────────────────────
  { term: 'enrofloxacin', aliases: ['Baytril'], category: 'drug', thai: 'อีโนฟลอกซาซิน',
    defShort: 'fluoroquinolone — broad-spectrum — DNA gyrase inhibitor',
    defLong: 'Veterinary fluoroquinolone. Bactericidal (DNA gyrase + topoisomerase IV). Spectrum: Gram-neg incl Pseudomonas, some Gram-pos, atypicals (Mycoplasma). Caveats: cartilage damage in young growing dog (avoid < skeletal maturity), retinal toxicity ใน cat at > 5 mg/kg (use marbofloxacin/pradofloxacin in cat instead). Dosing: dog 5-20 mg/kg q24h.',
    scope: ['small-animal'], synonyms: ['fluoroquinolone'] },
  { term: 'doxycycline', aliases: ['Vibramycin'], category: 'drug', thai: 'ดอกซีไซคลีน',
    defShort: 'tetracycline — broad-spec + intracellular — kennel cough, tick-borne',
    defLong: 'Tetracycline class. Bacteriostatic, 30S inhibitor. First-line for tick-borne disease (Ehrlichia, Anaplasma, Rickettsia), Mycoplasma, Bordetella, leptospirosis. Caveats: esophageal stricture in cat (give with water bolus/food), tooth discoloration in growing animal, photosensitivity. Dose: 5-10 mg/kg q12-24h.',
    scope: ['small-animal'] },
  { term: 'metronidazole', aliases: ['Flagyl'], category: 'drug', thai: 'เมโทรนิดาโซล',
    defShort: 'antiprotozoal + anaerobic abx — Giardia, IBD adjunct',
    defLong: 'Nitroimidazole. Antiprotozoal (Giardia, amebiasis, Trichomonas ของ bovine/avian — ไม่ครอบคลุม feline Tritrichomonas foetus ที่ต้องใช้ ronidazole) + activity against anaerobes (Clostridium, Bacteroides). Use in IBD เป็น immunomodulator/biofilm disruptor. Adverse: dose-related neurotoxicity (ataxia, nystagmus) — limit ≤ 50 mg/kg/day, ใช้จริง 10-15 mg/kg q12h. Bitter taste; mask in liquid.',
    scope: ['small-animal'] },
  { term: 'prednisolone', aliases: ['pred'], category: 'drug', thai: 'เพรดนิโซโลน',
    defShort: 'glucocorticoid — anti-inflammatory + immunosuppressive — dose-dependent',
    defLong: 'Synthetic glucocorticoid. Activated form (vs prednisone — cat คน convert ไม่ดี → ใช้ prednisolone). Anti-inflam dose ~0.5-1 mg/kg/day; immunosuppressive 2-4 mg/kg/day. Adverse: iatrogenic Cushing\'s, PU/PD, polyphagia, GI ulcer (avoid concurrent NSAID), DM induction, immunosuppression. Taper gradually after > 2 weeks to avoid Addisonian crisis.',
    scope: ['small-animal'], synonyms: ['steroid', 'glucocorticoid'] },
  { term: 'furosemide', aliases: ['Lasix', 'frusemide'], category: 'drug', thai: 'ฟูโรเซไมด์',
    defShort: 'loop diuretic — first-line for cardiogenic pulmonary edema in CHF',
    defLong: 'Loop diuretic, blocks NKCC2 ใน thick ascending limb. Rapid onset (IV 5 min, PO 30 min). Indications: CHF (cardiogenic pulmonary edema first-line), hypercalcemia adjunct, refractory hypertension. Adverse: hypokalemia, dehydration, ototoxicity (high-dose), pre-renal azotemia. Cat lower CHF dose than dog (~1-2 mg/kg q12-24h chronic).',
    scope: ['small-animal'] },
  { term: 'pimobendan', aliases: ['Vetmedin'], category: 'drug', thai: 'พิโมเบนแดน',
    defShort: 'inodilator — positive inotrope + vasodilator — MMVD, DCM mainstay',
    defLong: 'Inodilator: Ca-sensitizer (positive inotrope without ↑ O2 demand) + PDE3 inhibitor (vasodilator). Mainstay for canine CHF (MMVD, DCM). EPIC trial: pimobendan delays onset of CHF in pre-clinical stage B2 MMVD. Dose 0.25-0.3 mg/kg PO q12h, ideally on empty stomach. ห้ามใช้เมื่อเพิ่ม cardiac output ไม่ได้ — HCM ที่มี dynamic LVOT obstruction, aortic stenosis.',
    scope: ['small-animal'] },
  { term: 'enalapril', aliases: ['Enacard'], category: 'drug', thai: 'อีนาลาพริล',
    defShort: 'ACE inhibitor — afterload reduction, proteinuria management',
    defLong: 'Angiotensin-converting enzyme inhibitor. Blocks Ang I → Ang II conversion. Indications: CHF (afterload reduction), PLN (reduces proteinuria), systemic hypertension. Adverse: pre-renal azotemia (monitor BUN/creat 5-7 days after start), hypotension, hyperkalemia. Cat: benazepril preferred (less renal-dependent clearance).',
    scope: ['small-animal'], synonyms: ['ACE inhibitor', 'ACEi'] },
  { term: 'marbofloxacin', aliases: ['Marbocyl'], category: 'drug', thai: 'มาร์โบฟลอกซาซิน',
    defShort: 'fluoroquinolone ที่เสี่ยง retinal toxicity ในแมวต่ำกว่า enrofloxacin',
    defLong: 'Fluoroquinolone alternative to enrofloxacin in cat: retinotoxic risk ต่ำกว่าแต่ไม่เป็นศูนย์ และขึ้นกับขนาดยา ให้ตาม label เท่านั้น. Spectrum similar (Gram-neg, atypicals, some Gram-pos). Once-daily dosing. Still avoid in growing dog if possible.',
    scope: ['small-animal'] },
  { term: 'clavamox', aliases: ['amoxicillin clavulanate', 'co-amoxiclav', 'Augmentin'], category: 'drug', thai: 'คลาวาม็อกซ์',
    defShort: 'amoxicillin + clavulanic acid — first-line empiric many infections',
    defLong: 'Amoxicillin + clavulanic acid (beta-lactamase inhibitor). Broad spectrum incl beta-lactamase-producing organisms (Staph). First-line empiric for skin/soft tissue, UTI (uncomplicated), aspiration pneumonia. Dose 12.5-25 mg/kg q12h. GI upset common.',
    scope: ['small-animal'] },
  { term: 'fenbendazole', aliases: ['Panacur'], category: 'drug', thai: 'เฟนเบนดาโซล',
    defShort: 'benzimidazole anthelmintic — broad-spec incl Giardia',
    defLong: 'Benzimidazole. Binds tubulin, disrupts parasite microtubules. Spectrum: roundworm, hookworm, whipworm, tapeworm (Taenia not Dipylidium), Giardia (5-day course). Wide safety margin; safe in pregnant/lactating. Common Giardia dose: 50 mg/kg PO q24h × 3-5 days.',
    scope: ['small-animal'] },
  { term: 'milbemycin', aliases: ['milbemycin oxime', 'Interceptor'], category: 'drug', thai: 'มิลเบไมซิน',
    defShort: 'macrocyclic lactone — heartworm prevention + intestinal nematode',
    defLong: 'Macrocyclic lactone. Heartworm preventative (Dirofilaria immitis larva) + intestinal nematode control (hookworm, roundworm, whipworm). Safer in MDR1-mutant collies than ivermectin. Often combined (lufenuron, praziquantel). ต้องตรวจ heartworm (antigen + microfilaria) ก่อนเริ่มในสุนัขที่ไม่เคยกินยาป้องกันต่อเนื่อง.',
    scope: ['small-animal'] },
  { term: 'ivermectin', aliases: [], category: 'drug', thai: 'ไอเวอร์เม็กติน',
    defShort: 'macrocyclic lactone — caution in MDR1 mutant collies',
    defLong: 'Macrocyclic lactone. Heartworm prevention low-dose; high-dose for ectoparasites (Demodex, Sarcoptes). MDR1 (ABCB1) mutation in herding breeds (Collie, Aussie, Sheltie) → blood-brain barrier breach → neurotoxicity (ataxia, seizure, coma). Test MDR1 before high-dose use in at-risk breeds.',
    scope: ['small-animal'] },

  // ────────────────────────────────────────────────────────────
  // Lab values
  // ────────────────────────────────────────────────────────────
  { term: 'BUN', aliases: ['blood urea nitrogen'], category: 'lab-value', thai: 'BUN',
    defShort: 'urea nitrogen — kidney marker, affected by protein intake + GI bleed',
    defLong: 'ค่า nitrogen ใน urea, by-product ของ protein catabolism, excreted by kidney. Elevated = azotemia (pre-/renal/post-renal). Confounders: high-protein meal (mild ↑), GI bleeding (gut absorbs blood protein), severe liver dz can lower BUN. Best interpreted กับ creatinine + USG.',
    scope: 'universal' },
  { term: 'creatinine', aliases: ['creat'], category: 'lab-value', thai: 'ครีอะตินีน',
    defShort: 'muscle breakdown product — renal function marker, less diet-dependent than BUN',
    defLong: 'By-product ของ muscle creatine phosphate, excreted by glomerular filtration. Less affected by diet/GI bleed than BUN — more specific renal marker. แต่ insensitive early (lose ~75% nephron function before rise). SDMA + USG ช่วย early detection.',
    scope: 'universal' },
  { term: 'ALT', aliases: ['alanine aminotransferase'], category: 'lab-value', thai: 'ALT',
    defShort: 'hepatocellular enzyme — leakage marker — half-life dog ~60h, cat ~6h',
    defLong: 'Alanine aminotransferase, cytoplasmic enzyme ใน hepatocyte. Elevated = hepatocellular damage/necrosis. Half-life dog ~60 hr, cat ~6 hr (cat ALT rise indicates acute injury). Magnitude doesn\'t correlate with prognosis; trend over time is more useful.',
    scope: 'universal' },
  { term: 'ALP', aliases: ['alkaline phosphatase', 'AlkPhos'], category: 'lab-value', thai: 'ALP',
    defShort: 'cholestasis marker + steroid-induced — cat ALP rise more specific',
    defLong: 'Alkaline phosphatase, multiple isoforms: liver (cholestasis), bone (growth, osteosarcoma), intestinal และ placental (half-life สั้น มักไม่ขึ้นใน serum), steroid-induced isoform (only in dog — corticosteroid, Cushing\'s). Cat ALP ↑ is more specific for hepatobiliary dz (short half-life, no steroid isoform).',
    scope: 'universal' },
  { term: 'GGT', aliases: ['gamma-glutamyl transferase'], category: 'lab-value', thai: 'GGT',
    defShort: 'cholestasis enzyme — cat more sensitive than ALP for hepatic lipidosis',
    defLong: 'Gamma-glutamyl transferase. Cholestasis marker. ใน cat hepatic lipidosis, GGT มัก disproportionately normal/mildly elevated vs ALP markedly elevated — classic teaching point. ใน dog, GGT parallels ALP for cholestasis but less sensitive overall.',
    scope: 'universal' },
  { term: 'hematocrit', aliases: ['HCT', 'PCV', 'packed cell volume'], category: 'lab-value', thai: 'ค่าฮีมาโตคริต',
    defShort: 'RBC volume fraction — anemia (low) vs polycythemia (high)',
    defLong: 'PCV/HCT: percent volume of packed RBCs in centrifuged blood. Dog normal ~37-55%, cat ~28-45%. Low = anemia (regenerative vs non-regen — check reticulocyte). High = polycythemia (dehydration, primary, secondary to hypoxia). Pair with TP estimate from same spun tube.',
    scope: 'universal' },
  { term: 'reticulocyte', aliases: ['retic'], category: 'lab-value', thai: 'เรติคูโลไซต์',
    defShort: 'immature RBC — measure regenerative response to anemia',
    defLong: 'Immature non-nucleated RBC, polychromatophilic on Diff-Quik. Absolute count > 60-95K/μL dog = regenerative anemia. Cat: only aggregate reticulocytes count (punctate are residual from preceding 1-3 wk). Regenerative anemia = bone marrow responding (peripheral loss/destruction). Non-regen = primary BM disease or insufficient time (< 3-5 days).',
    scope: 'universal' },
  { term: 'USG', aliases: ['urine specific gravity'], category: 'lab-value', thai: 'USG',
    defShort: 'urine concentration — interpretation depends on hydration + azotemia',
    defLong: 'Urine specific gravity = measure of urine concentration. Dog adequate concentrate > 1.030, cat > 1.035. Isosthenuria 1.008-1.012 = ไตเสีย concentrate/dilute ability. Interpret กับ hydration: USG ต่ำใน dehydrated/azotemic animal = renal failure (kidney ไม่สามารถ concentrate ตอบสนอง). USG ต่ำใน well-hydrated animal = appropriate.',
    scope: 'universal' },
  { term: 'Coombs test', aliases: ['DAT', 'direct antiglobulin test', "Coombs'"], category: 'lab-value', thai: 'คูมส์เทสต์',
    defShort: 'direct antiglobulin test — IgG/C3 bound to RBC — IMHA',
    defLong: 'Direct antiglobulin test (DAT). Detects IgG หรือ C3 bound to RBC surface. Positive in immune-mediated hemolytic anemia (IMHA). False-neg ~25-40% (low Ab density). False-pos in some chronic dz. Better: in-saline agglutination (spherocytes + auto-agglutination) + reticulocyte count + ghost cells on smear.',
    scope: 'universal' },

  // ────────────────────────────────────────────────────────────
  // Organisms
  // ────────────────────────────────────────────────────────────
  { term: 'E. coli', aliases: ['Escherichia coli'], category: 'organism', thai: 'อีโคไล',
    defShort: 'Gram-neg enteric — UTI, neonatal sepsis, mastitis, peritonitis',
    defLong: 'Gram-negative facultative anaerobe, Enterobacteriaceae. Normal gut flora; pathogenic strains cause UTI (uropathogenic E. coli — #1 isolate), neonatal septicemia, peritonitis, mastitis. Antimicrobial choice ตาม culture/susceptibility — ESBL emerging concern.',
    scope: 'universal' },
  { term: 'Salmonella', aliases: [], category: 'organism', thai: 'ซาลโมเนลล่า',
    defShort: 'Gram-neg enteric — zoonotic — raw-fed pet, reptile, poultry',
    defLong: 'Gram-negative rod, Enterobacteriaceae. Zoonotic. Clinical: enteritis (esp. puppy/kitten), bacteremia, septicemia. Sources: contaminated food (raw diet), reptiles (asymptomatic carrier), poultry. Public health concern for immunocompromised handlers. Treatment controversial — many recommend supportive only for uncomplicated case to avoid prolonging carrier state.',
    scope: 'universal' },
  { term: 'Staphylococcus pseudintermedius', aliases: ['S. pseudintermedius'], category: 'organism', thai: 'สแตฟิโลค็อกคัส พซูโดอินเทอร์มีเดียส',
    defShort: 'Gram-pos coccus — #1 canine pyoderma — MRSP emerging',
    defLong: 'Gram-positive coccus, primary commensal/pathogen ของ dog skin. #1 cause of canine superficial pyoderma. Methicillin-resistant SP (MRSP) emerging — multi-drug-resistant, often only chloramphenicol/amikacin/topicals work. Culture + susceptibility for any recurrent/non-responsive pyoderma.',
    scope: ['small-animal'] },
  { term: 'Pasteurella', aliases: ['Pasteurella multocida'], category: 'organism', thai: 'พาสเจอเรลล่า',
    defShort: 'Gram-neg coccobacillus — cat oral flora — cat-bite cellulitis classic',
    defLong: 'Gram-negative coccobacillus. Normal oral flora ของ cat (~90%) และ dog. Cat bite/scratch → rapid-onset cellulitis (hours), often with lymphangitis. Treatment: amoxicillin/clavulanate first-line. Pulmonary form in rabbit ("snuffles") เป็น chronic respiratory dz.',
    scope: 'universal' },
  { term: 'Bordetella', aliases: ['Bordetella bronchiseptica'], category: 'organism', thai: 'บอร์เดเทลล่า',
    defShort: 'Gram-neg — major kennel cough agent — intranasal vaccine preferred',
    defLong: 'Bordetella bronchiseptica. Gram-negative coccobacillus, attaches to respiratory cilia. Major component of canine infectious respiratory disease complex (CIRDC, "kennel cough"). Intranasal vaccine = faster mucosal immunity than parenteral; combined with CPiV. Doxycycline first-line abx for symptomatic case.',
    scope: 'universal' },
  { term: 'Mycoplasma haemofelis', aliases: ['Mhf', 'feline hemoplasmosis'], category: 'organism', thai: 'ไมโคพลาสมา ฮีโมเฟลิส',
    defShort: 'feline hemotropic — RBC parasite — acute hemolytic anemia',
    defLong: 'Hemotropic Mycoplasma (formerly Haemobartonella felis). Adheres to RBC surface → immune-mediated hemolytic anemia. Two species in cat: M. haemofelis (more pathogenic, acute crisis), Candidatus M. haemominutum (less). PCR diagnosis (cyclic parasitemia → smear unreliable). Doxycycline 4-6 wk.',
    scope: ['small-animal'] },
  { term: 'Ehrlichia', aliases: ['Ehrlichia canis'], category: 'organism', thai: 'เออร์ลิเชีย',
    defShort: 'tick-borne rickettsia — thrombocytopenia, pancytopenia — doxycycline',
    defLong: 'Obligate intracellular Gram-neg, Rickettsiales. Transmitted by Rhipicephalus sanguineus (brown dog tick) — common in tropics incl Thailand. Phases: acute → subclinical → chronic (pancytopenia, hypergammaglobulinemia, bleeding). Diagnosis: 4DX SNAP (Ab), PCR (DNA). Treatment: doxycycline 5 mg/kg q12h × 28 days.',
    scope: ['small-animal'] },
  { term: 'Anaplasma', aliases: ['Anaplasma phagocytophilum', 'Anaplasma platys'], category: 'organism', thai: 'อะนาพลาสมา',
    defShort: 'tick-borne rickettsia — granulocytic or platelet inclusion',
    defLong: 'Rickettsiales. A. phagocytophilum (granulocytic anaplasmosis, Ixodes tick) — fever, lethargy, lameness, thrombocytopenia. A. platys (canine cyclic thrombocytopenia, R. sanguineus). 4DX SNAP screens; PCR confirms species. Doxycycline 28 days.',
    scope: ['small-animal'] },
  { term: 'Babesia', aliases: ['Babesia canis', 'Babesia gibsoni'], category: 'organism', thai: 'บาบีเซีย',
    defShort: 'tick-borne protozoa — intra-RBC parasite — hemolytic anemia',
    defLong: 'Tick-borne protozoan parasite of RBC. Large form (B. canis subspecies) - Rhipicephalus tick. Small form (B. gibsoni) — pit-bull breed cluster, often fight-transmitted. Clinical: hemolytic anemia, thrombocytopenia, splenomegaly. Diagnosis: blood smear (low sensitivity), PCR. Treatment: imidocarb (large form), atovaquone+azithromycin (gibsoni, but not always curative).',
    scope: ['small-animal'] },
  { term: 'Cryptosporidium', aliases: [], category: 'organism', thai: 'คริปโตสปอริเดียม',
    defShort: 'protozoan enteric — zoonotic — small oocyst, acid-fast staining',
    defLong: 'Apicomplexan protozoan. Small oocyst (~5 μm, smaller than Giardia cyst). Zoonotic — calf-handler outbreaks classic. In young/immunocompromised → watery diarrhea. Diagnosis: acid-fast stain ของ fecal smear, PCR. Treatment limited (azithromycin, paromomycin); supportive care + zoonotic precaution main.',
    scope: 'universal' },
  { term: 'Giardia', aliases: ['Giardia duodenalis'], category: 'organism', thai: 'จิอาเดีย',
    defShort: 'protozoan enteric — trophozoite + cyst — fenbendazole 5 days',
    defLong: 'Flagellated protozoan. Trophozoite (active) ใน small intestine → cyst (environmental form). Fecal-oral transmission; water-borne outbreaks. Clinical: small-bowel diarrhea, malabsorption. Diagnosis: SNAP fecal Ag (best single-sample), zinc sulfate flotation (cyst — intermittent shedding, 3 samples), direct smear (trophozoite, fresh sample only). Treatment: fenbendazole 50 mg/kg × 3-5 days, metronidazole second-line. Bathing + environmental decontamination key.',
    scope: 'universal' },
  { term: 'Demodex', aliases: ['Demodex canis', 'demodicosis'], category: 'organism', thai: 'ไรขี้เรื้อนเปียก',
    defShort: 'cigar-shaped mite — deep skin scrape — isoxazoline first-line',
    defLong: 'Cigar-shaped mite, normal skin commensal in low numbers. Demodicosis = clinical disease when proliferates (juvenile-onset usually genetic immunodeficiency; adult-onset rule out endocrine/neoplasia/immunosuppression). Localized vs generalized. Diagnosis: deep skin scrape (or trichogram). Treatment: isoxazoline (afoxolaner, fluralaner, sarolaner) revolutionized — replaced amitraz dips. Generalized demodicosis = lifelong management consideration.',
    scope: ['small-animal'] },
  { term: 'Sarcoptes', aliases: ['Sarcoptes scabiei', 'scabies'], category: 'organism', thai: 'ไรขี้เรื้อนแห้ง',
    defShort: 'burrowing mite — intense pruritus — zoonotic, ear-pinnal-pedal reflex',
    defLong: 'Sarcoptes scabiei var canis. Burrowing mite → intense pruritus (very different from Demodex). Zoonotic (transient lesions ใน human). Predilection: pinnal margins, elbows, hocks. Ear-pinnal-pedal scratch reflex highly suggestive. Skin scrape low sensitivity (only ~30%) — empirical treatment trial reasonable. Isoxazoline first-line; selamectin / advocate / amitraz alternatives.',
    scope: ['small-animal'] },
  { term: 'Notoedres', aliases: ['Notoedres cati', 'feline scabies'], category: 'organism', thai: 'ไรขี้เรื้อนแมว',
    defShort: 'feline scabies — pruritic head/neck — selamectin treatment',
    defLong: 'Feline sarcoptid mite. Pruritic, crusty lesions starting on ear tip, head, neck — can generalize. Less common in well-cared cat population. Skin scrape diagnostic (more readily found than canine Sarcoptes). Treatment: selamectin (off-label) repeated, isoxazoline (off-label). Treat all in-contact cat.',
    scope: ['small-animal'] },

  // ──────────────────────────────────────────────────────────
  // Poultry / avian medicine
  // ──────────────────────────────────────────────────────────
  { term: 'aMPV', aliases: ['avian metapneumovirus', 'swollen head syndrome', 'turkey rhinotracheitis', 'metapneumovirus', 'SHS', 'TRT', 'โรคหัวบวม'], category: 'disease', thai: 'โรคหัวบวม',
    defShort: 'Metapneumovirus — โรคหัวบวม/TRT — ciliostasis เปิดทางเชื้อแทรก — ป่วยมากแต่ตายน้อย',
    defLong: 'aMPV อยู่ใน genus Metapneumovirus family Pneumoviridae เป็น RNA สายเดี่ยวสายลบ มีเปลือกหุ้ม แบ่งเป็น 4 subtypes คือ A, B, C, D โดยที่พบบ่อยคือ A และ B ส่วนนกป่าเป็น natural reservoir. ในไก่งวงเรียก turkey rhinotracheitis (TRT) อัตราป่วยอาจสูงถึง 100% และอัตราตายอาจถึง 50% ในลูกไก่งวง ส่วนในไก่แสดงออกเป็น swollen head syndrome หรือโรคหัวบวม. ไวรัสเพิ่มจำนวนที่ upper respiratory tract ทำให้เกิด ciliostasis และสูญเสีย cilia จึงเปิดทางให้เชื้อแทรกซ้อนเข้ามา ภาพหัวบวมที่เห็นจึงมักเป็นผลร่วมของเชื้อแทรก ทำให้ morbidity สูงแต่ mortality ต่ำถ้าไม่มี secondary infection. ระยะฟักตัว 3-5 วัน หายภายใน 10-14 วัน ติดได้ทุกอายุทาง direct contact และ aerosol นอกจากระบบหายใจยังก่อความผิดปกติของระบบสืบพันธุ์ และการเก็บตัวอย่างต้องทำให้ทันช่วงที่ยังมีเชื้ออยู่',
    scope: ['avian'] },
  { term: 'ascites syndrome', aliases: ['ascites', 'pulmonary hypertension syndrome', 'water belly', 'ท้องมาน'], category: 'disease', thai: 'ภาวะท้องมานในไก่เนื้อ',
    defShort: 'ไก่เนื้อโตเร็ว — hypoxia → polycythemia → pulmonary hypertension → RV failure → ท้องมาน',
    defLong: 'ในไก่เนื้อ ascites ไม่ได้อ่านแบบเดียวกับสัตว์เลี้ยง แต่เป็น pulmonary hypertension syndrome ของไก่ที่โตเร็วจนความต้องการออกซิเจนแซงความสามารถของปอดและหัวใจห้องขวา. ลำดับพยาธิกำเนิดคือการระบายอากาศไม่ดี heat stress หรือโรคทางเดินหายใจ ทำให้เกิด hypoxia แล้วต่อด้วย polycythemia, pulmonary hypertension, RV hypertrophy, RV failure, hepatic congestion และจบที่น้ำคั่งในช่องท้อง. หัวใจของกลไกอยู่ที่หัวใจห้องขวาและความดันในปอด ไม่ใช่หัวใจห้องซ้ายหรือ systemic hypertension ซึ่งเป็นตัวลวงที่เจอบ่อยในข้อสอบ. เป็นหนึ่งในสาเหตุการตายที่ต้องนึกถึงเมื่อผ่าซากไก่เนื้อ ร่วมกับ yolk sac infection, chilling, overheating และ starve-out การแก้จึงอยู่ที่การจัดการโรงเรือน การระบายอากาศ และอัตราการโต',
    scope: ['avian'] },
  { term: 'avian influenza', aliases: ['HPAI', 'LPAI', 'highly pathogenic avian influenza', 'avian influenza virus', 'bird flu', 'ไข้หวัดนก'], category: 'disease', thai: 'โรคไข้หวัดนก',
    defShort: 'Influenza A ในสัตว์ปีก — HPAI มีเฉพาะ H5/H7, LPAI เช่น H9N2 — วัคซีนต้องมี H ตรงสายพันธุ์',
    defLong: 'AI ในสัตว์ปีกเกิดจาก Influenza type A (family Orthomyxoviridae) แบ่ง subtype ตาม hemagglutinin H1-H16 และ neuraminidase N1-N9 โดย HPAI พบเฉพาะ H5 กับ H7 และไม่ใช่ทุกสายพันธุ์ของ H5/H7 ที่รุนแรง ส่วน LPAI พบได้ทุก subtype เช่น H9N2 ที่เด่นเรื่องหน้าบวม ตาบวม ไข่ลด มากกว่าจะทำให้ตายเยอะ. เกณฑ์ห้องปฏิบัติการคือ IVPI มากกว่า 1.2 นับเป็น HPAI ระยะฟักตัว 3 วันถึง 2 สัปดาห์ อัตราตาย 0-100% รอยโรคที่ชี้ทางคือหน้าและเหนียงบวมคล้ำ เลือดออกใต้ผิวหนังที่แข้งและตีน กับจุดเลือดออกที่ขั้วหัวใจและไขมันช่องท้อง ส่วน DDx หลักคือ HPAI แยกจาก ND และ LPAI แยกจาก ILT, infectious coryza และ MG. ไทยรายงานโรคทางการครั้งแรกปี 2547 ที่สุพรรณบุรี เชื้อ H5N1 ไม่มีประกาศโรคอีกหลังปี 2551 และกลับมาส่งออกเนื้อไก่ได้ปี 2555 มาตรการคือการทำลายเชื้อร่วมกับเขตเฝ้าระวังรัศมี 10 กิโลเมตร. หลักของวัคซีนเชื้อตายคือ H ต้องตรงกับสายพันธุ์ที่ระบาด ส่วน N ไม่ตรงก็ยังใช้ได้ และ vectored vaccine ที่ใช้กับ AI คือ HVT-AIV กับ Pox-AIV',
    scope: ['avian'] },
  { term: 'avian reovirus', aliases: ['reovirus', 'viral arthritis', 'tenosynovitis', 'avian orthoreovirus'], category: 'disease', thai: 'ไวรัสรีโอในสัตว์ปีก',
    defShort: 'Orthoreovirus — viral arthritis/tenosynovitis ที่ hock ไก่เนื้อ — แยกเชื้อได้ไม่เท่ากับเป็นโรค',
    defLong: 'Avian reovirus (genus Orthoreovirus, family Reoviridae) เป็น RNA สายคู่ ที่พบได้ทั่วไปในฝูง ราว 85-90% ของเชื้อที่แยกได้อยู่ในลำไส้หรือระบบหายใจโดยไม่ก่อโรค การเพาะแยกเชื้อจึงต้องอ่านคู่กับรอยโรคและตำแหน่งที่เก็บตัวอย่างเสมอ ไม่ใช่พบเชื้อแล้วสรุปว่าเป็นโรค. โรคที่เด่นคือ viral arthritis หรือ tenosynovitis พบมากในไก่เนื้อสายพันธุ์หนัก ไก่อายุน้อยไวกว่า และรุนแรงขึ้นเมื่อมี coccidiosis, IBD หรืออาหารไม่เหมาะสมเป็นปัจจัยโน้มนำ. ระยะเฉียบพลันเห็นเอ็นรอบ hock บวมอักเสบ น้ำในข้อหนืดสีฟางหรือปนเลือด และ petechial hemorrhage ส่วนระยะเรื้อรังเอ็นแข็ง ไม่ยืดหยุ่น มี calcification และ fibrocartilaginous pannus ที่ distal tibiotarsus จนเอ็นขาดได้. ในฝูงพ่อแม่พันธุ์มักแสดงช่วงก่อนให้ไข่หรือช่วงให้ไข่ ทำให้ขาเจ็บ ไข่ลด อัตราผสมติดและอัตราฟักต่ำลง และไวรัสถ่ายทอดผ่านไข่ได้',
    scope: ['avian'] },
  { term: 'bursa of Fabricius', aliases: ['bursa', 'bursal', 'ต่อมเบอร์ซา', 'เบอร์ซา'], category: 'anatomy', thai: 'ต่อมเบอร์ซา',
    defShort: 'อวัยวะน้ำเหลืองปฐมภูมิเฉพาะสัตว์ปีก — ที่บ่ม B cell — เป้าหมายของ IBDV และฝ่อเองตามอายุ',
    defLong: 'Bursa of Fabricius เป็น primary lymphoid organ ที่มีเฉพาะในนก ทำหน้าที่ให้ B lymphocyte พัฒนา คู่กับ thymus ที่ดูแลสาย T ขณะที่ไก่ไม่มี lymph node แบบสัตว์เลี้ยงลูกด้วยนม. ลูกไก่มี bursa ตั้งแต่แรกเกิดแล้ว involute เองราว 15 สัปดาห์ ซึ่งเป็นเหตุผลว่าทำไม IBD จึงเป็นโรคของไก่ช่วง 3-6 สัปดาห์และแทบไม่เจอหลัง 8 สัปดาห์. ในทางคลินิก bursa คือของกลางที่ใช้อ่านหลายโรค: IBDV ทำลาย B cell ในนั้นจนบวมแล้วฝ่อ MDV ผ่านมาช่วง early cytolytic phase และ REV ทำให้เกิด bursal lymphoma. เวลาผ่าซากจึงต้องเทียบขนาด bursa กับอายุไก่ก่อนเสมอ เพราะ bursa ฝ่อในไก่โตเป็นเรื่องปกติ ไม่ใช่รอยโรค',
    scope: ['avian'] },
  { term: 'chicken infectious anemia', aliases: ['CIAV', 'chicken anemia virus', 'chicken infectious anaemia', 'blue wing disease'], category: 'disease', thai: 'โรคโลหิตจางติดต่อในไก่',
    defShort: 'CIAV gyrovirus ทำลาย hemocytoblast + thymus — aplastic anemia ในลูกไก่ — age resistance ชัด',
    defLong: 'CIAV เป็น DNA สายเดี่ยวขนาดเล็ก ไม่มีเปลือกหุ้ม จัดในกลุ่ม Gyrovirus ทนมาก ผ่านตัวกรองขนาด 25 nm ได้ ทน chloroform และ ether และยังอยู่รอดหลังความร้อน 80 องศา 15 นาที จึงล้างเชื้อออกจากโรงเรือนยาก. เซลล์เป้าหมายคือ hemocytoblast ในไขกระดูกและ lymphoblast ในไทมัส ผลจึงเป็น aplastic anemia คู่กับ immunosuppression โดย HCT เริ่มต่ำกว่าปกติราววันที่ 8 หลังรับเชื้อ และต่ำสุดราววันที่ 16. Age resistance ชัดเจนมาก ลูกไก่อายุ 1 สัปดาห์ป่วยเพียงเล็กน้อยและไม่ตาย ส่วนอายุ 2 สัปดาห์ในการทดลองไม่แสดงอาการ ลูกไก่ที่มี MDA ยังติดเชื้อและแพร่เชื้อได้แม้ไม่ป่วย และตัวที่หายยัง shed ได้ถึงราวอายุ 5-7 สัปดาห์. วินิจฉัยเชื้อโดยตรงด้วย PCR หรือ DNA probe จาก buffy coat หรืออวัยวะภายใน และคุมด้วยวัคซีนเชื้อเป็นในพ่อแม่พันธุ์อายุราว 13-15 สัปดาห์ หรือ 4-5 สัปดาห์ก่อนเริ่มไข่ โดยห้ามให้ช่วงกำลังวางไข่เพราะเชื้อวัคซีนอาจผ่านไข่ได้',
    scope: ['avian'] },
  { term: 'coccidiosis', aliases: ['Eimeria', 'coccidia', 'avian coccidiosis', 'โรคบิด'], category: 'disease', thai: 'โรคบิด',
    defShort: 'โรคบิดจาก Eimeria — ตำแหน่งรอยโรคในลำไส้บอกชนิด — คุมด้วยยาในอาหารและ shuttle program',
    defLong: 'Eimeria เป็นโปรโตซัวที่ oocyst ต้อง sporulate ในวัสดุรองนอนที่ชื้นและอุ่นก่อนจึงติดต่อได้ ไก่เนื้อที่เลี้ยงบนพื้นจึงเสี่ยงช่วง 3-6 สัปดาห์ และ wet litter คือปัจจัยหลักของการระบาด. ตำแหน่งรอยโรคเป็นตัวแยกชนิด: E. acervulina ที่ duodenum เห็นแถบขาวเรียงขวางคล้ายขั้นบันได, E. necatrix ที่ลำไส้ส่วนกลางเห็น salt and pepper คือจุดขาวสลับจุดเลือดออก, E. maxima ลำไส้ส่วนกลางพองหนามี mucus ปนของเหลวสีส้ม และ E. tenella ที่ caecum ทำให้ถ่ายเป็นเลือดและมี cecal core. คุมด้วยยากันบิดผสมอาหาร เช่น toltrazuril, amprolium, sulfaquinoxaline และ decoquinate ร่วมกับ shuttle program คือการสลับกลุ่มยาระหว่างอาหารแต่ละระยะภายในรุ่นเดียวกันเพื่อชะลอการดื้อยา. อีกทางคือวัคซีนเชื้อเป็นที่เป็น oocyst ของ Eimeria หลายชนิด ให้ลูกไก่ตั้งแต่สัปดาห์แรกทางน้ำหรือการสเปรย์ และต้องแยกจาก necrotic enteritis จาก Clostridium perfringens ที่มักตามมาหลังลำไส้ถูกทำลาย',
    scope: ['avian'] },
  { term: 'CRD', aliases: ['chronic respiratory disease', 'Mycoplasma gallisepticum', 'mycoplasmosis', 'MG infection'], category: 'disease', thai: 'โรคทางเดินหายใจเรื้อรัง',
    defShort: 'Mycoplasma gallisepticum ไม่มี cell wall — หายใจมีเสียง ไข่ลด ติดผ่านไข่ — beta-lactam ไม่ได้ผล',
    defLong: 'CRD เกิดจาก Mycoplasma gallisepticum (MG) ซึ่งเป็นแบคทีเรียขนาดเล็กที่ไม่มีผนังเซลล์ จึงใช้ beta-lactam ไม่ได้ผล ยาที่ใช้คือ tylosin, tilmicosin, doxycycline หรือ enrofloxacin. ติดต่อทั้งแนวดิ่งผ่านไข่ราว 3-5% และแนวราบทาง aerosol, direct contact และ fomites ระยะฟักตัว 2-3 สัปดาห์ อาการคือหายใจมีเสียง มีน้ำมูก ไอ ตาแฉะ หน้าและหนังตาบวม กินลด ไข่ลด อัตราป่วยสูงแต่ตายต่ำถ้าไม่มีเชื้อแทรก และไก่งวงไวต่อโรคกว่าไก่. เมื่อมี E. coli แทรกจะเห็น perihepatitis, pericarditis และ airsacculitis ตามมา ซึ่งเป็นภาพที่ทำให้สับสนกับ colibacillosis ตัวเดียว. วินิจฉัยโดย swab จาก choanal cleft หรือ palatine fissure ยืนยันด้วย PCR ส่วน serology ใช้ SPA เป็น screening (ไวแต่จำเพาะต่ำ ต้องยืนยันด้วย ELISA ที่อ่าน IgY) วัคซีนเชื้อเป็นมีสายพันธุ์ 6/85, ts-11 และ F รวมถึงแบบ vector FP-MG',
    scope: ['avian'] },
  { term: 'fowlpox', aliases: ['fowl pox', 'FPV', 'fowlpox virus', 'avipoxvirus', 'avian pox', 'โรคฝีดาษไก่'], category: 'disease', thai: 'โรคฝีดาษไก่',
    defShort: 'Avipoxvirus — dry form ตุ่มที่หนังไม่มีขน, wet form แผ่นเยื่อในคอ — ยุงเป็นพาหะ',
    defLong: 'ในบริบทสัตว์ปีก FPV คือ fowlpox virus (genus Avipoxvirus, family Poxviridae) เป็น DNA สายคู่ มีเปลือกหุ้ม รูปร่าง brick-shape ไม่ใช่ feline panleukopenia virus. ติดเข้าทางบาดแผล โดยมีแมลงและยุงเป็นพาหะ หรือหายใจเอาขนกับสะเก็ดแห้งเข้าไป ระยะฟักตัว 4-10 วัน โรคแพร่ช้าและเชื้ออยู่ในสะเก็ดแห้งได้นาน จึงต้องพักเล้าให้นานพอ. Cutaneous form (dry) เป็น nodular lesion บนผิวหนังส่วนที่ไม่มีขน เช่น หงอน เหนียง เปลือกตา แข้ง อัตราตายต่ำ ส่วน diphtheritic form (wet) เป็นแผ่นเยื่อสีเหลืองในปาก หลอดอาหาร และทางเดินหายใจส่วนต้น อัตราตายสูงกว่า และพบทั้งสองฟอร์มในไก่ตัวเดียวได้. Histopathology เห็น eosinophilic cytoplasmic inclusion body คือ Bollinger bodies ที่ห่ออนุภาคไวรัส Borrell bodies ไว้ วัคซีนเชื้อเป็นแทง wing web ตั้งแต่อายุ 4 สัปดาห์ขึ้นไป แล้วสุ่มไก่อย่างน้อย 50 ตัวต่อโรงเรือนดูตุ่มนูนแข็งที่ 5-10 วันหลังทำวัคซีน ถ้าพบตัวที่ไม่ขึ้นตุ่มมากกว่า 10% ต้องทำวัคซีนใหม่ทั้งโรงเรือน',
    scope: ['avian'] },
  { term: 'IBD', aliases: ['Gumboro', 'infectious bursal disease', 'IBDV', 'infectious bursal disease virus'], category: 'disease', thai: 'โรคกัมโบโร',
    defShort: 'Gumboro — birnavirus ทำลาย B cell ใน bursa ไก่ 3-6 สัปดาห์ — กดภูมิจนวัคซีนอื่นไม่ขึ้น',
    defLong: 'IBDV เป็น RNA สายคู่ ไม่มีเปลือกหุ้ม อยู่ใน family Birnaviridae genus Avibirnavirus ติดทาง fecal-oral แล้วเพิ่มจำนวนใน lymphocyte ของทางเดินอาหารก่อน เกิด viremia ครั้งแรกราว 5 ชั่วโมงไปที่ bursa และครั้งที่สองราว 12 ชั่วโมงไปไตกับกล้ามเนื้อ. ผ่าซากวันที่ 2-3 เห็น bursa บวมมี gelatinous yellow transudate สีเหลืองคลุม serosa วันที่ 4 โตเป็นสองเท่าเปลี่ยนเป็นสีครีมมีจุดเลือดออก วันที่ 5 น้ำหนักกลับมาปกติเป็นสีเทา และวันที่ 9 ฝ่อเหลือราวหนึ่งในสามของเดิม ร่วมกับจุดเลือดออกที่กล้ามเนื้อ เลือดออกรอยต่อ proventriculus กับ gizzard และไตบวม. มี 2 serotype แต่มีเพียง serotype 1 ที่ก่อโรคในไก่ และไม่มี cross protection ระหว่าง serotype ผลหลักคือ immunosuppression จนตอบสนองวัคซีนอื่นได้ไม่ดี. คุมด้วยวัคซีนเชื้อเป็น intermediate หรือแบบ immune complex โดยจับจังหวะ MDA ให้ทันก่อนเกิด protection gap ชนิด intermediate plus เลี่ยงในไก่อายุน้อยกว่า 10 วันหรือสุขภาพไม่ดี และแยก field strain จาก vaccine strain ด้วย RT-PCR ร่วมกับ sequencing',
    scope: ['avian'] },
  { term: 'ICPI', aliases: ['intracerebral pathogenicity index'], category: 'lab-value', thai: 'ค่าดัชนีความรุนแรงเมื่อฉีดเข้าสมอง',
    defShort: 'ดัชนีฉีดเข้าสมองลูกไก่ 1 วัน แยก pathotype ของ NDV — มากกว่า 1.5 คือ velogenic',
    defLong: 'ICPI ทำโดยฉีดไวรัส 0.05 ml เจือจาง 1:10 (HA titer มากกว่า 16) เข้าสมองลูกไก่ SPF อายุ 1 วัน หรือ 24-40 ชั่วโมง จำนวน 10 ตัว แล้วให้คะแนนทุกวันเป็นเวลา 8 วัน โดย 0 คือปกติ 1 คือป่วย 2 คือตาย แล้วหาค่าเฉลี่ย. แปลผลคือมากกว่า 1.5 เป็น velogenic, 0.7-1.5 เป็น mesogenic และน้อยกว่า 0.7 เป็น lentogenic โดยค่า ICPI ตั้งแต่ 0.7 ขึ้นไปนับเป็นเชื้อก่อโรครุนแรงที่ต้องรายงาน WOAH. อีกสองวิธีที่ใช้คู่กันคือ MDT ในไข่ไก่ฟัก (น้อยกว่า 60 ชั่วโมงเป็น velogenic, 60-90 ชั่วโมงเป็น mesogenic, มากกว่า 90 ชั่วโมงเป็น lentogenic) และ IVPI ที่ปัจจุบันใช้กับไข้หวัดนกมากกว่า โดย IVPI มากกว่า 1.2 นับเป็น HPAI',
    scope: ['avian'] },
  { term: 'ILT', aliases: ['infectious laryngotracheitis', 'ILTV', 'GaHV-1', 'Gallid herpesvirus 1', 'โรคกล่องเสียงอักเสบติดต่อ'], category: 'disease', thai: 'โรคกล่องเสียงอักเสบติดต่อ',
    defShort: 'GaHV-1 herpesvirus — hemorrhagic tracheitis ยืดคออ้าปาก — ตัวหายแล้วเป็นพาหะ latent',
    defLong: 'ILT เกิดจาก Gallid herpesvirus type 1 (genus Iltovirus, subfamily Alphaherpesvirinae) เป็น DNA สายคู่ มีเปลือกหุ้ม เข้าทำลาย epithelial cell ของ larynx และ trachea ระยะฟักตัว 3-7 วัน มักพบในไก่อายุ 8 สัปดาห์ขึ้นไป แต่พบได้ตั้งแต่ 3 สัปดาห์. อาการเด่นคือยืดคออ้าปากหายใจ ไอออกมาเป็นเมือกปนเลือด เยื่อบุตาอักเสบมี frothy ocular secretion และ infraorbital sinus บวม อัตราป่วย 90-100% อัตราตาย 5-20% รอยโรคคือ hemorrhagic tracheitis ที่ larynx และ trachea ส่วนต้น กับ mucoid plug อุดหลอดลมจนไก่ขาดอากาศ. จุดที่ทำให้คุมยากคือไก่ที่หายแล้วเป็น latent carrier โดยไวรัสหลบอยู่ใน trigeminal ganglion และกลับมาแบ่งตัวปล่อยเชื้อเมื่อไก่เครียด. วัคซีนเชื้อเป็นมี CEO (หยอดตา ละลายน้ำ หรือ coarse spray ป้องกันได้ดีกว่าแต่แพ้วัคซีนง่ายกว่า โดยเฉพาะ coarse spray ในไก่เนื้อ) กับ TCO (หยอดตาอย่างเดียว) และมี recombinant FPV-ILT กับ HVT-ILT ใช้ร่วมกับ biosecurity แบบ all in all out',
    scope: ['avian'] },
  { term: 'infectious bronchitis', aliases: ['IBV', 'infectious bronchitis virus', 'โรคหลอดลมอักเสบติดต่อ'], category: 'disease', thai: 'โรคหลอดลมอักเสบติดต่อ',
    defShort: 'IBV gammacoronavirus — หายใจ + ไข่ + ไตอักเสบ QX — serotype ไม่ cross protect กัน',
    defLong: 'IBV อยู่ใน genus Gammacoronavirus เป็น RNA สายเดี่ยวสายบวก มีเปลือกหุ้ม จำแนก genotype ด้วย S1 gene เป็น GI-1 ถึง GI-29 และ GII-VII โดย GI-1 คือกลุ่ม Massachusetts (Mass/M41/H120), GI-13 คือ 4/91 และ GI-19 คือ QX. ติดทาง aerosol ระยะฟักตัวสั้นมากราว 36 ชั่วโมง แพร่ทั้งฝูงภายใน 2 วัน และหายได้เองภายใน 14 วัน morbidity ขึ้นได้ถึง 100% แต่ตัวไวรัสเองไม่ค่อยฆ่าไก่ ที่ทำให้ตายคือ secondary infection จาก E. coli หรือ Mycoplasma. เป้าหมายคือ ciliated epithelial cell ของ trachea แล้ว viremia ไปยัง oviduct ไต และ cecal tonsil จึงแสดงได้สามระบบ คือ ระบบหายใจ ระบบสืบพันธุ์ (ไข่ลด คุณภาพเปลือกแย่ และ false layer ถ้าติดตอนอายุน้อย) และไตอักเสบแบบ QX. แต่ละ serotype ไม่ cross protect กัน การเลือกวัคซีนจึงต้องอิงสายพันธุ์ที่ระบาดในพื้นที่ ควบคู่ biosecurity และการจัดการ',
    scope: ['avian'] },
  { term: 'infectious coryza', aliases: ['coryza', 'Avibacterium paragallinarum', 'Haemophilus paragallinarum', 'โรคหวัดหน้าบวม'], category: 'disease', thai: 'โรคหวัดหน้าบวม',
    defShort: 'Avibacterium paragallinarum ต้องการ NAD — หน้าบวม ไซนัสอักเสบ ไข่ลด — ซ่อนที่ infraorbital sinus',
    defLong: 'Avibacterium paragallinarum เป็น Gram negative nonmotile rod หรือ coccobacilli ที่ต้องการ NAD จึงไม่ขึ้นบน agar ธรรมดา ต้องเลี้ยงคู่กับ Staphylococcus ที่สร้าง NAD ให้ แล้วจะเห็นขึ้นเป็น satellite colony รอบโคโลนีของ Staph. ระยะฟักตัวสั้น 24-72 ชั่วโมง อาการคือจาม มีน้ำมูก หน้าและไซนัสบวม เยื่อบุตาอักเสบ และไข่ลด 10-40% อัตราป่วยสูงแต่อัตราตายต่ำ ยกเว้นมี MG, fowlpox หรือ E. coli ร่วมด้วยจะรุนแรงขึ้นและพบ airsacculitis กับปอดอักเสบ. เชื้ออยู่แค่ทางเดินหายใจส่วนบนไม่ลงไปที่ปอด และชอบหลบที่ infraorbital sinus ซึ่งเลือดไปเลี้ยงน้อย อาการจึงดีขึ้นตอนให้ยาแต่ตัวที่หายมักเป็นพาหะต่อ. มี 3 serovars คือ A, B, C และ bacterin ที่ใช้ประกอบด้วย serovar A กับ C เข็มแรกอายุ 8-10 สัปดาห์ แล้วกระตุ้นอีก 4 สัปดาห์ถัดมา แอนติบอดีหลังทำวัคซีนอยู่ได้ราว 9 เดือน',
    scope: ['avian'] },
  { term: 'Marek\'s disease', aliases: ['Marek', 'Mareks', 'Marek disease', 'MDV', 'GaHV-2', 'โรคมาเร็กซ์'], category: 'disease', thai: 'โรคมาเร็กซ์',
    defShort: 'MDV serotype 1 herpesvirus — T-cell lymphoma + เส้นประสาทโต — วัคซีน HVT วันแรก',
    defLong: 'MDV serotype 1 (GaHV-2) เป็นตัวก่อโรคและก่อเนื้องอก ส่วน serotype 2 (GaHV-3 เช่น SB-1) และ serotype 3 (HVT) ไม่ก่อเนื้องอกและถูกใช้ทำวัคซีน โดยสายพันธุ์ CVI988 หรือ Rispens อยู่ใน serotype 1. ไก่สูดเชื้อเข้าไปติด macrophage ที่ปอดก่อน แล้วถูกพาไปม้าม ไทมัส และ bursa ภายในราว 24 ชั่วโมง เกิด early cytolytic phase จากนั้นราววันที่ 7 ไวรัสแฝงใน CD4+ T lymphocyte และเริ่มปล่อย cell-free virus ที่ feather follicle epithelium ราววันที่ 8-10 ก่อนเข้า transformation phase เป็น T-cell lymphoma ตั้งแต่ 3-4 สัปดาห์หลังติดเชื้อ. ในตัวไก่ไวรัสเป็น cell-associated ซึ่งถูกทำลายง่าย แต่ cell-free virion ที่ปนมากับรังแคขนอยู่ในสิ่งแวดล้อมได้หลายเดือน และ MDV ไม่ติดต่อผ่านไข่. Classical หรือ neural form เห็นเป็นไก่ผอม ขาลาก ปีกตก และเส้นประสาท sciatic ข้างหนึ่งโตกว่าปกติ พบช่วงอายุ 2-12 เดือน วัคซีนเป็นชนิด cell-associated ให้ in-ovo หรือ SC วันแรก ต้องละลายเร็วในน้ำราว 27 องศา ประมาณ 30 วินาที แล้วผสม diluent อุณหภูมิห้อง',
    scope: ['avian'] },
  { term: 'Newcastle disease', aliases: ['NDV', 'Newcastle', 'Newcastle disease virus', 'APMV-1', 'โรคนิวคาสเซิล'], category: 'disease', thai: 'โรคนิวคาสเซิล',
    defShort: 'APMV-1 paramyxovirus — หายใจ + ทางเดินอาหาร + ประสาท — 1 serotype, 21 genotypes',
    defLong: 'NDV (Avian paramyxovirus type 1, family Paramyxoviridae) เป็น RNA สายเดี่ยวสายลบ มีเปลือกหุ้ม ติดทาง aerosol และ oral-fecal ระยะฟักตัว 2-15 วัน โดยมากราว 5-6 วัน และไม่มีการติดต่อแนวดิ่งเพราะตัวอ่อนตายคาไข่ไปก่อน. แบ่งเป็น 5 pathotypes คือ viscerotropic velogenic, neurotropic velogenic, mesogenic, lentogenic และ asymptomatic enteric โดย WOAH ใช้ MDT, ICPI และ IVPI เป็นเกณฑ์ตัดสิน. อาการและรอยโรคแยกเป็นสามระบบ: หายใจ (necrotic และ hemorrhagic ที่ trachea ส่วนต้น พบใน vvNDV), ทางเดินอาหาร (ขี้เขียวเหลว hemorrhagic proventriculus GALT เน่า ม้ามโตคั่งเลือด) และประสาท (tremor, torticollis, อัมพาตปีกหรือขาข้างเดียว) โดยรอยโรคของระบบประสาทส่วนกลางไม่เห็นจาก gross lesion. NDV มี serotype เดียวแต่ 21 genotypes ซึ่ง cross protect กันได้ genotype I กับ II ใช้ทำวัคซีน และ genotype VII สำคัญในเอเชียตะวันออกเฉียงใต้ ประเด็นที่ผู้สอนย้ำคือวัคซีนกันอาการและการตายได้ แต่ไม่กันการติดเชื้อ',
    scope: ['avian'] },

  // ──────────────────────────────────────────────────────────
  // Swine
  // ──────────────────────────────────────────────────────────
  { term: 'Actinobacillus pleuropneumoniae', aliases: ['APP', 'A. pleuropneumoniae', 'porcine pleuropneumonia'], category: 'organism', thai: 'แอกทิโนบาซิลลัส เพลอโรนิวโมเนีย',
    defShort: 'แกรมลบ coccobacilli — peracute ตายใน 6-8 ชม. ฟองเลือดที่จมูก + fibrinous pleuritis',
    defLong: 'APP เป็นแบคทีเรียแกรมลบรูป coccobacilli ในวงศ์ Pasteurellaceae ก่อโรคผ่าน Apx toxin แบบ peracute สุกรซึมและตายภายใน 6-8 ชั่วโมง ไข้สูงกว่า 104 องศาฟาเรนไฮต์ มี blood-tinged frothy exudate ออกจากปากและจมูก แบบ acute ตายใน 24-48 ชั่วโมง ส่วนแบบ chronic อาการไม่ชัดและกลายเป็นพาหะ รอยโรคคือ hemorrhagic และ fibrinonecrotic pneumonia ร่วมกับ fibrinous pleuritis ที่เด่นบริเวณกลีบ dorsocaudal ซึ่งเป็นจุดแยกจาก pneumonic pasteurellosis ที่เยื่อหุ้มปอดใสและแห้ง วินิจฉัยด้วย bacterial isolation เป็น gold standard ต่อยอด sensitivity test ได้ ร่วมกับ PCR และ ELISA ต่อ ApxIV ซึ่งเชื้อสร้างเฉพาะในตัวสัตว์ จึงใช้แยกสัตว์ติดเชื้อออกจากสัตว์ที่ได้วัคซีนตามหลัก DIVA',
    scope: ['swine'] },
  { term: 'atrophic rhinitis', aliases: ['progressive atrophic rhinitis', 'PAR', 'non-progressive atrophic rhinitis', 'NPAR'], category: 'disease', thai: 'จมูกอักเสบชนิดกระดูกจมูกฝ่อในสุกร',
    defShort: 'NPAR จาก Bordetella, PAR จาก toxigenic P. multocida — turbinate ฝ่อ จมูกเบี้ยว',
    defLong: 'NPAR เกิดจาก toxigenic Bordetella bronchiseptica ให้อาการจาม ฟุดฟิด และน้ำมูก ส่วน PAR เกิดจาก toxigenic Pasteurella multocida ที่สร้าง dermonecrotic toxin จากยีน toxA เดี่ยว ๆ หรือร่วมกับ B. bronchiseptica toxin ทั้งสองตัวรบกวนการสร้างกระดูกโดยยับยั้ง osteoblast และเร่งการสลายกระดูกโดย osteoclast จึงทำให้ nasal turbinate ฝ่อ ใบหน้าผิดรูป สันจมูกสั้นและเบี้ยวไปด้านข้าง มีคราบน้ำตาที่แก้ม และเลือดออกจมูกซึ่งพบเฉพาะ PAR ประเมินโดยตัดขวางจมูกที่ระดับ premolar 1 ถึง 2 แล้วให้ snout score 0 ถึง 5 ร่วมกับ morphometric index ยาช่วยได้เฉพาะระยะแรกและไม่ทำให้กระดูกที่ฝ่อกลับมา จึงคุมด้วยวัคซีน toxoid ในแม่สุกรเพื่อส่งภูมิผ่าน colostrum',
    scope: ['swine'] },
  { term: 'exudative epidermitis', aliases: ['greasy pig disease', 'greasy pig', 'Staphylococcus hyicus', 'S. hyicus'], category: 'disease', thai: 'ผิวหนังอักเสบมีของเหลวซึมในลูกสุกร',
    defShort: 'Staphylococcus hyicus + exfoliative toxin — สะเก็ดมันสีน้ำตาล ช่วงแรกไม่คัน',
    defLong: 'เกิดจาก Staphylococcus hyicus ซึ่งเป็น commensal บนผิวหนัง เมื่อผิวหนังมีบาดแผลจากการกัดกัน พื้นคอกหยาบ การตัดหางหรือตัดเบอร์หู หรือมีไรขี้เรื้อนร่วมด้วย เชื้อจึงฉวยโอกาสและปล่อย exfoliative toxin รอยโรคเป็น seborrheic exudate มันสีน้ำตาล เริ่มที่หน้าแล้วลามไปใบหูและลำตัว ผิวหนา ลอกเป็นสะเก็ด และช่วงแรกไม่คัน ซึ่งเป็นจุดแยกจาก sarcoptic mange ที่คันมาก ลูกสุกรดูดนมและสุกรอนุบาลช่วงอายุราว 3 ถึง 30 วันเป็นกลุ่มที่รุนแรงที่สุด ลุกลามทั้งตัวและตายจากการเสียน้ำและโปรตีนทางผิวหนัง ส่วนสุกรรุ่นและสุกรโตที่มีภูมิแล้วมักเป็นหย่อมเฉพาะที่ ความรุนแรงและอัตราตายต่ำกว่า แต่ยังกระทบการเจริญเติบโต รักษาด้วยการอาบยาฆ่าเชื้อร่วมกับยาฉีดกลุ่ม penicillin, ampicillin หรือ ceftiofur',
    scope: ['swine'] },
  { term: 'ileitis', aliases: ['Lawsonia intracellularis', 'L. intracellularis', 'proliferative enteropathy', 'porcine proliferative enteropathy'], category: 'disease', thai: 'ลำไส้อักเสบชนิดหนาตัวในสุกร',
    defShort: 'Lawsonia intracellularis — PHE ถ่ายดำตายเฉียบพลัน, PIA โตช้าไม่สม่ำเสมอ',
    defLong: 'Lawsonia intracellularis เป็นแบคทีเรีย obligate intracellular ที่ทำให้ mucosa ของ ileum หนาตัวจนมีลักษณะคล้ายสายยาง รูปแบบเฉียบพลันคือ PHE พบในสุกรสาวและสุกรโต ซีด ถ่ายดำแบบ melena และตายเฉียบพลัน ส่วนรูปแบบเรื้อรังคือ PIA ในสุกรรุ่นอายุราว 8-20 สัปดาห์ ถ่ายเหลวสีคล้ำ โตช้าและโตไม่สม่ำเสมอ การตรวจฝั่ง antigen ใช้ fecal PCR, bacterial culture และ fecal count ส่วนฝั่ง antibody ใช้ ELISA และ IPMA ส่วน DDx ที่ต้องแยกคือ swine dysentery และ salmonellosis รักษาด้วย tylosin, lincomycin หรือ tiamulin และมีวัคซีนเชื้อเป็นชนิดให้กินก่อนเข้าเล้าขุน',
    scope: ['swine'] },
  { term: 'MMA', aliases: ['mastitis-metritis-agalactia', 'PDS', 'postpartum dysgalactia syndrome'], category: 'disease', thai: 'กลุ่มอาการเต้านมอักเสบ มดลูกอักเสบ และน้ำนมแห้ง',
    defShort: 'กลุ่มอาการหลังคลอด 12-72 ชม. — เต้านมอักเสบ มดลูกอักเสบ น้ำนมแห้ง — E. coli บ่อยสุด',
    defLong: 'MMA หรือ PDS เป็นปัญหาหลังคลอดที่พบบ่อยที่สุดของแม่สุกร เกิดภายใน 12-72 ชั่วโมงหลังคลอด สาเหตุเป็นแบบหลายปัจจัย เชื้อที่พบบ่อยที่สุดคือ E. coli ร่วมกับ Klebsiella และ Streptococcus บวกกับ endotoxin ความเครียด และการจัดการ โดยมีปัจจัยเสี่ยงคือคลอดนาน dystocia รกค้าง และท้องผูก แม่แสดงไข้ เบื่ออาหาร เต้านมบวมแดงร้อนเจ็บ มี vaginal discharge เป็นหนองเมื่อมี metritis และน้ำนมลดจนลูกหิว ตัวเย็น น้ำตาลในเลือดต่ำ และโตไม่ทัน รักษาด้วย oxytocin 10 IU ร่วมกับยาปฏิชีวนะเช่น ceftiofur และ NSAID เช่น flunixin ป้องกันด้วยการคุมท้องผูก ให้น้ำเพียงพอ และสุขาภิบาลซองคลอด ระวังว่า vaginal discharge ช่วง 3-5 วันแรกหลังคลอดอาจเป็น lochia ตามปกติ',
    scope: ['swine'] },
  { term: 'Mycoplasma hyopneumoniae', aliases: ['M. hyopneumoniae', 'Mhp', 'enzootic pneumonia', 'MPS'], category: 'organism', thai: 'ไมโคพลาสมา ไฮโอนิวโมเนีย',
    defShort: 'ตัวเริ่มของ PRDC — ไอแห้งเรื้อรัง ป่วยมากตายน้อย — consolidation ที่ cranioventral lobe',
    defLong: 'M. hyopneumoniae ยึดเกาะ cilia ของ trachea, bronchi และ bronchioles ทำให้เกิด ciliostasis ตามด้วยการสูญเสีย cilia และกดภูมิคุ้มกันเฉพาะที่ จึงเป็นเชื้อตัวเริ่มต้นของ PRDC ที่เปิดทางให้ Pasteurella multocida และ APP ตามมา ระยะฟักตัวตามธรรมชาติ 10-16 วัน มีผลมากกับสุกรอายุราว 3-6 เดือน อาการเด่นคือไอแห้งเรื้อรัง อัตราป่วยสูงแต่อัตราตายต่ำ และการเจริญเติบโตลดลง รอยโรคคือ purple to gray consolidation ที่ cranioventral lobes เนื้อปอด atelectatic คล้ายเนื้อสัตว์ เชื้อไม่มีผนังเซลล์ ยากลุ่ม beta-lactam จึงไม่ได้ผล ต้องใช้ pleuromutilin, tetracycline, lincosamide, macrolide หรือ quinolone ร่วมกับวัคซีนแบบ two-shot และ biosecurity',
    scope: ['swine'] },
  { term: 'PCV2', aliases: ['PCV', 'porcine circovirus', 'porcine circovirus type 2', 'PCVAD', 'PMWS'], category: 'disease', thai: 'เซอร์โคไวรัสสุกร ชนิดที่ 2',
    defShort: 'ssDNA circovirus — PMWS ในสุกร 5-12 สัปดาห์ ผอมแห้ง ต่อมน้ำเหลืองโต — คุมด้วยวัคซีน',
    defLong: 'PCV2 เป็นไวรัส ssDNA ขนาดเล็กที่ก่อกลุ่มอาการรวมเรียกว่า PCVAD โดยตัวหลักคือ PMWS ในสุกรอายุ 5-12 สัปดาห์ ซึ่งผอมแห้ง ซีด ตัวเหลือง ต่อมน้ำเหลืองโตโดยเฉพาะ inguinal และตายราว 5-30 เปอร์เซ็นต์ อีกรูปแบบคือ PDNS ในสุกรขุนอายุ 12-14 สัปดาห์ ที่มีจุดแดงม่วงนูนตามสะโพกและขาร่วมกับ glomerulonephritis จาก type III hypersensitivity วินิจฉัยด้วยสามอย่างประกอบกัน คืออาการทางคลินิก, lymphoid depletion จาก histopath หรือ IHC และปริมาณไวรัสสูงจาก quantitative PCR เป็นโรคไวรัสจึงไม่ตอบสนองต่อยาปฏิชีวนะ และคุมด้วยวัคซีน subunit Cap protein เข็มเดียวที่อายุ 3 สัปดาห์',
    scope: ['swine'] },
  { term: 'PED', aliases: ['PEDV', 'porcine epidemic diarrhea', 'porcine epidemic diarrhoea'], category: 'disease', thai: 'โรคท้องร่วงระบาดในสุกร',
    defShort: 'alpha coronavirus — ท้องเสียเป็นน้ำ อาเจียน ในลูกดูดนม ยิ่งอายุน้อยยิ่งตาย',
    defLong: 'PEDV เป็น alphacoronavirus กลุ่มเดียวกับ TGEV ทำลาย villous enterocyte ของลำไส้เล็ก ลูกสุกรดูดนมโดยเฉพาะอายุต่ำกว่า 1 สัปดาห์ท้องเสียเป็นน้ำ อาเจียน ขาดน้ำ และตายได้เกือบทั้งครอกเมื่อฝูงไม่เคยมีภูมิ ความรุนแรงลดลงเมื่อลูกสุกรอายุมากขึ้น อาการแยกจาก TGE ด้วยตาเปล่าไม่ได้ ต้องยืนยันด้วย PCR จากอุจจาระหรือเนื้อเยื่อลำไส้ หัวใจของการควบคุมคือ lactogenic immunity ผ่านการสร้างภูมิในแม่ โดยโปรแกรมที่บันทึกไว้คือฉีดวัคซีนแม่อุ้มท้องก่อนคลอด 4 และ 2 สัปดาห์ ร่วมกับการจัดการโรงเรือนคลอดและ biosecurity',
    scope: ['swine'] },
  { term: 'PRRS', aliases: ['PRRSV', 'porcine reproductive and respiratory syndrome'], category: 'disease', thai: 'พีอาร์อาร์เอส',
    defShort: 'แท้งท้ายคอก ลูกมัมมี่ ในแม่ + ปอดบวมในสุกรรุ่น — ELISA หา antibody, PCR หาเชื้อ',
    defLong: 'PRRSV เป็นไวรัสในวงศ์ Arteriviridae ให้สองกลุ่มอาการ ฝั่งสืบพันธุ์คือแท้งช่วงท้ายของการอุ้มท้อง ลูกมัมมี่ ลูกตายแรกคลอด และลูกอ่อนแอ ส่วนฝั่งหายใจคือปอดบวมและไอเรื้อรังในสุกรอนุบาลถึงสุกรรุ่น พร้อม ADG ที่ลดลง เชื้อเป็นตัวนำของ PRDC จึงมักเจอ co-infection กับ Streptococcus suis, Mycoplasma hyopneumoniae และ APP ซึ่งดันอัตราตายขึ้น วินิจฉัยด้วย ELISA สำหรับ antibody และ PCR สำหรับการติดเชื้อปัจจุบัน วัคซีนป้องกันได้ไม่เต็มที่เพราะเชื้อมีหลายสายพันธุ์และ cross-protection จำกัด การคุมโรคจึงใช้วัคซีนร่วมกับ biosecurity และ acclimatization ของสุกรสาว โดยโปรแกรมที่บันทึกไว้คือฉีดลูกสุกรอายุ 4-5 สัปดาห์ ตอนที่ maternal antibody เริ่มลดลงพอให้วัคซีนติด',
    scope: ['swine'] },
  { term: 'PSY', aliases: ['pigs per sow per year', 'pigs weaned per sow per year', 'PWSY'], category: 'lab-value', thai: 'จำนวนลูกสุกรหย่านมต่อแม่ต่อปี',
    defShort: 'KPI หลักของฝูงแม่พันธุ์ — ลูกหย่านมต่อแม่ต่อปี — ฟาร์มสมัยใหม่อยู่ช่วง 24-30',
    defLong: 'PSY คือจำนวนลูกสุกรหย่านมต่อแม่ต่อปี ประมาณได้จากลูกหย่านมทั้งปีหารด้วยจำนวนแม่ในฟาร์ม เป็น KPI ตัวบนสุดของ production tree ซึ่งแตกเป็นสองขา คือจำนวนลูกหย่านมต่อครอก คูณกับจำนวนครอกต่อแม่ต่อปี ช่วงเป้าหมายของฟาร์มสมัยใหม่อยู่ที่ 24-30 โดยฟาร์มระดับ top ทำได้เกิน 30 และจำนวนรอบการผลิตมาตรฐานอยู่ที่ราว 2.3 รอบต่อปี ตัวขับที่ทำให้ PSY ขึ้นคือขนาดครอกและจำนวนรอบที่มากขึ้น ส่วนตัวที่ต้องกดลงคือลูกตายแรกคลอด ลูกมัมมี่ อัตราตายก่อนหย่านม และ non-productive day',
    scope: ['swine'] },
  { term: 'Streptococcus suis', aliases: ['S. suis', 'strep suis'], category: 'organism', thai: 'สเตรปโตค็อกคัส ซูอิส',
    defShort: 'zoonotic — meningitis, arthritis, septicemia ในสุกรหลังหย่านม — serotype 2 พบมากสุด',
    defLong: 'S. suis เป็น early colonizer ที่อยู่ใน upper respiratory tract โดยเฉพาะ tonsil และโพรงจมูก เข้ามาตั้งแต่ระหว่างคลอดหรือหลังคลอดไม่นาน จึงกำจัดออกจากฝูงได้ยากแม้ทำ segregated early weaning ก่อโรคมากในลูกสุกรหลังหย่านมถึงอายุราว 10 สัปดาห์ ให้ภาพ septicemia, meningitis แบบ paddling และ opisthotonus, arthritis, endocarditis และ polyserositis ปัจจุบันจำแนกได้ 35 ซีโรไทป์ โดยซีโรไทป์ 2 พบมากที่สุดทั้งในสุกรและในคน penicillin หรือ amoxicillin ยังเป็นยาแรกและยิ่งรักษาเร็วยิ่งฟื้นตัวดี เป็นเชื้อ zoonotic ที่จัดเป็นโรคจากการประกอบอาชีพในผู้สัมผัสสุกรหรือผลิตภัณฑ์ และในคนให้ภาพเยื่อหุ้มสมองอักเสบร่วมกับการสูญเสียการได้ยิน',
    scope: ['swine'] },
  { term: 'swine dysentery', aliases: ['Brachyspira hyodysenteriae', 'B. hyodysenteriae', 'Brachyspira'], category: 'disease', thai: 'โรคบิดมูกเลือดในสุกร',
    defShort: 'Brachyspira hyodysenteriae — mucohaemorrhagic colitis ในสุกรรุ่นถึงขุน — tiamulin',
    defLong: 'B. hyodysenteriae เป็น spirochete แกรมลบที่ก่อ mucohaemorrhagic colitis ที่ลำไส้ใหญ่ ต่างจาก ileitis ที่รอยโรคอยู่ที่ลำไส้เล็กส่วนปลาย สุกรรุ่นถึงสุกรขุนเริ่มด้วยถ่ายเป็นมูก แล้วมีเลือดปน และกลายเป็นถ่ายเหลวกลิ่นเหม็นจัด น้ำหนักลดเร็วและอ่อนแอ ผนังลำไส้ใหญ่หนาและมีมูกเลือดคลุม วินิจฉัยด้วย PCR จากอุจจาระหรือเนื้อเยื่อลำไส้ใหญ่ ร่วมกับ dark-field microscopy และการเพาะเชื้อ ยาที่บันทึกไว้คือ tiamulin ขนาด 10 mg/kg หรือ oxytetracycline โดยควรทำ sensitivity test ประกอบ ส่วน B. pilosicoli ก่อ spirochaetal colitis ที่อาการเบากว่าและถ่ายเป็นน้ำปนมูก',
    scope: ['swine'] },
  { term: 'TGE', aliases: ['TGEV', 'transmissible gastroenteritis'], category: 'disease', thai: 'โรคลำไส้อักเสบติดต่อในสุกร',
    defShort: 'alpha coronavirus — อาเจียน ท้องเสีย นมไม่ย่อย ตายสูงมากในลูกอายุต่ำกว่า 2 สัปดาห์',
    defLong: 'TGEV เป็น alphacoronavirus ติดต่อทาง fecal-oral ลูกสุกรแรกเกิดอาเจียน ท้องเสียรุนแรง อุจจาระมีนมไม่ย่อย ขาดน้ำเร็ว และอัตราตายสูงมากในลูกอายุต่ำกว่า 2 สัปดาห์ โดยอัตราตายลดลงตามอายุที่มากขึ้น แม่สุกรมักเบื่ออาหารและน้ำนมลดชั่วคราว ป้องกันโดยคุมวัตถุดิบอาหารไม่ให้ปนเปื้อน และสร้างภูมิในแม่อุ้มท้องเพื่อส่งผ่าน colostrum ปัจจุบันพบน้อยลงเพราะ PED เข้ามาแทนที่ในหลายพื้นที่ และเนื่องจากอาการคาบเกี่ยวกับ PED การแยกสองโรคต้องใช้ PCR',
    scope: ['swine'] },
  { term: 'WSI', aliases: ['wean-to-service interval'], category: 'lab-value', thai: 'ระยะหย่านมถึงผสม',
    defShort: 'ช่วงหย่านมถึงผสมใหม่ — 1-7 วันถือว่าดี ส่วนใหญ่ 4-5 วัน — ยิ่งยาวยิ่งผสมติดแย่',
    defLong: 'WSI คือจำนวนวันจากหย่านมจนแม่สุกรได้รับการผสมครั้งถัดไป ช่วง 1-7 วันสัมพันธ์กับความสมบูรณ์พันธุ์ที่ดี โดยส่วนใหญ่อยู่ที่ 4-5 วัน ช่วง 8-14 วันเริ่มเสี่ยง และเกิน 15 วันมักให้ผลผสมติดแย่ ฟาร์มจึงตั้งเป้าให้แม่ส่วนใหญ่กลับสัดภายใน 7 วัน สาเหตุที่ทำให้ WSI ยาวคือสภาพแม่ช่วงเลี้ยงลูกไม่ดี BCS ลดมาก และอาหารระยะให้นมไม่พอ ซึ่งทำให้การกลับสัดช้าและกระทบครอกถัดไป WSI ที่ยาวยังเป็นแหล่งสำคัญของ non-productive day จึงกดค่า PSY ลงโดยตรง',
    scope: ['swine'] },

  // ──────────────────────────────────────────────────────────
  // Ruminant practice
  // ──────────────────────────────────────────────────────────
  { term: 'BCS', aliases: ['body condition score'], category: 'lab-value', thai: 'คะแนนความสมบูรณ์ร่างกาย',
    defShort: 'สเกล 1-5 ในโคนม — dry-off 3.25-3.50, peak lactation 2.50-2.75',
    defLong: 'คะแนนไขมันสำรองที่ประเมินจาก tailhead, hook และ pin ในโคนมใช้สเกล 1-5. เป้าหมายตามช่วงการผลิต คือ dry-off 3.25-3.50 เพื่อเลี่ยง fat cow syndrome, วันคลอด 3.25-3.50 ตามเลกเชอร์ (หลักฐานภายนอกใช้ 3.00-3.25), peak lactation ราว 60 วัน 2.50-2.75 และ mid-late lactation 3.00-3.25. BCS ที่ตกเกิน 0.5 หน่วยในช่วง transition จัดเป็นกลุ่มเสี่ยง และตกเกิน 1 หน่วยระหว่างคลอดถึง peak ถือว่ามากเกินไป เสี่ยง ketosis กับกลับเป็นสัดช้า ส่วนวัวที่ก่อนคลอด BCS เกิน 3.75 เป็นกลุ่มเสี่ยง Type 2 ketosis',
    scope: ['ruminant'] },
  { term: 'BHBA', aliases: ['beta-hydroxybutyrate', 'BHB', 'ketone body'], category: 'lab-value', thai: 'บีตาไฮดรอกซีบิวทิเรต',
    defShort: 'ketone body ที่ใช้ตัดสิน ketosis — subclinical 1.2 mM ขึ้นไป, clinical 3.0 mM ขึ้นไป',
    defLong: 'BHBA เป็น ketone body ที่คงตัวที่สุดในเลือด จึงใช้เป็นตัวตัดสิน ketosis ในโคนม. Cut-off ที่ใช้ในวิชานี้คือต่ำกว่า 1.0 mM ปกติ, 1.2-2.9 mM subclinical ketosis, 3.0 mM ขึ้นไป clinical ketosis ส่วนช่วง dry ถือว่าเริ่มสูงเมื่อเกิน 0.6 mM. วัดข้างคอกด้วย handheld ketone meter หรือ ketone strip ส่วน milk strip ไวน้อยกว่า. อ่านคู่กับ NEFA ซึ่งบอกระดับ lipolysis (เลกเชอร์ cliapprum ใช้ก่อนคลอดเกิน 0.4 และหลังคลอดเกิน 0.7 mM ส่วน HHM ใช้ช่วง dry เกิน 0.3 และหลังคลอดเกิน 0.7 mM)',
    scope: ['ruminant'] },
  { term: 'bloat', aliases: ['ruminal tympany', 'rumen tympany', 'tympany', 'ท้องอืด'], category: 'disease', thai: 'ท้องอืดในกระเพาะรูเมน',
    defShort: 'free-gas เรอไม่ออก vs frothy โฟมคลุม cardia — แยกให้ได้ก่อนเลือกวิธีระบาย',
    defLong: 'Free gas bloat (primary) เกิดเมื่อเรอไม่ออก เช่น choke, vagal damage หรือ hypocalcemia แก้ด้วยการใส่ orogastric tube ระบายแก๊ส. Frothy bloat (secondary) เกิดจากโฟมคงตัวจากโปรตีนพืชตระกูลถั่วหรือธัญพืชบดละเอียด โฟมคลุม cardia ทำให้ระบายผ่าน tube ไม่ได้ ต้องให้ anti-foaming agent เช่น poloxalene หรือน้ำมันพืช 250 mL ป้อนทางปาก. ท้องด้านซ้ายป่องชัด รายที่หายใจลำบากถึงขั้นคุกคามชีวิตทำ trocharization ที่ left paralumbar fossa จุดสูงสุดของรอยบวม โดยยอมรับความเสี่ยง peritonitis ส่วนรายที่ดื้อจริงจึงทำ rumenotomy. Bloat ยังเป็นสาเหตุหนึ่งของ rumen hypomotility และเป็นความเสี่ยงสำคัญของวัวที่วางยาสลบหรืออยู่ท่า recumbent นาน',
    scope: ['ruminant'] },
  { term: 'DMI', aliases: ['dry matter intake'], category: 'lab-value', thai: 'ปริมาณวัตถุแห้งที่กินได้',
    defShort: 'น้ำหนักอาหารที่กิน คูณ %DM — lactating 3-4% ของ BW, dry cow 2-2.5%',
    defLong: 'DMI คือน้ำหนักอาหารตามที่ให้ (as fed) คูณด้วย %DM ของอาหารนั้น เช่น TMR 30 kg ที่ DM 48% เท่ากับ 14.4 kg DM ต่อวัน. เป้าหมายในโคนม lactating อยู่ที่ 3-4% ของน้ำหนักตัว (Holstein 600 kg ราว 18-24 kg DM ต่อวัน) ส่วน dry cow 2-2.5% และถ้าต่ำกว่า 2.5% ของน้ำหนักตัวในโครีดนมถือว่าลดลงรุนแรง. DMI ที่ตกเป็นสัญญาณเตือนแรกของ subclinical ketosis, mastitis, lameness และ LDA. ปัจจัยที่กด DMI ได้แก่ NDF ในสูตรสูงเกิน, heat stress, ท้องแก่ที่มดลูกเบียดกระเพาะ และโรค subclinical',
    scope: ['ruminant'] },
  { term: 'Fasciola gigantica', aliases: ['liver fluke', 'fascioliasis', 'fasciolosis', 'fluke', 'พยาธิใบไม้ตับ'], category: 'organism', thai: 'พยาธิใบไม้ตับ',
    defShort: 'trematode ในท่อน้ำดี — วัวเลี้ยงปล่อยที่ลุ่ม ซีด ผอม ดีซ่านโดยไม่มีไข้',
    defLong: 'พยาธิใบไม้ตับของสัตว์เคี้ยวเอื้องในเขตร้อน ตัวแบนรูปใบไม้ อาศัยในท่อน้ำดี และต้องผ่านหอยเป็น intermediate host จึงผูกกับแปลงหญ้าที่ลุ่มน้ำขัง. อาการคือผอม ซีด hypoproteinemia และรูปแบบดีซ่านที่ไม่มีไข้ในโค ซึ่งเป็น DDx ที่ต้องแยกจาก anaplasmosis. การตรวจอุจจาระต้องใช้ sedimentation เพราะไข่หนักและไม่ลอยในวิธี flotation และในทางปฏิบัติ เจอไข่ fluke แม้ฟองเดียวก็รักษาเพราะทำลายอวัยวะ ต่างจาก strongyle ที่ดูจำนวน epg ก่อน. คนละตัวกับ rumen fluke (Paramphistomum) ที่ตัวเต็มวัยเกาะใน rumen และก่อโรคน้อย โดยตัวอ่อนในลำไส้เล็กเป็นตัวก่อโรคเมื่อติดหนัก (Merck Veterinary Manual)',
    scope: ['ruminant'] },
  { term: 'hardware disease', aliases: ['TRP', 'traumatic reticuloperitonitis', 'traumatic reticulopericarditis'], category: 'disease', thai: 'โรคจากวัตถุแหลมในกระเพาะรังผึ้ง',
    defShort: 'ลวดหรือตะปูทิ่มผนัง reticulum — grunt test บวก fibrinogen สูง — magnet หรือ rumenotomy',
    defLong: 'วัวกลืนโลหะแหลมเข้าไป ตกลงไปอยู่ reticulum ด้าน cranioventral แล้วแรงบีบตัวดันให้ทะลุผนัง เกิด peritonitis เฉพาะที่ และถ้าทะลุ diaphragm ต่อไปถึง pericardium จะเป็น pericarditis พบมากในวัวโตและช่วงท้องแก่ที่มดลูกเบียด reticulum. Dx ต้องหลายทางประกอบกัน ได้แก่ pain test (บีบ wither, pole test ใต้ xiphoid, กด xiphoid ให้ grunt), ฟังเสียงหัวใจอู้อี้หรือมี rub, metal detector, เลือดพบ neutrophilia with left shift กับ fibrinogen มากกว่า 700 mg/dL, ร่วมกับ radiograph และ ultrasound. Tx คือ cow magnet ป้อนทางปาก (ลงไปอยู่ reticulum ไม่ใช่ rumen) สำหรับป้องกันและเคสแรกเริ่ม ส่วน definitive คือ rumenotomy ทาง left flank เอา foreign body ออก ร่วมกับยาปฏิชีวนะและ NSAID. Prognosis ดีเมื่อยังไม่มี peritonitis แต่แย่มากเมื่อมี pericarditis',
    scope: ['ruminant'] },
  { term: 'ketosis', aliases: ['acetonemia', 'hyperketonemia', 'คีโตซิส'], category: 'disease', thai: 'คีโตซิส',
    defShort: 'NEB หลังคลอดทำให้ BHBA สูง — Type 1 นมพีคน้ำตาลต่ำ, Type 2 วัวอ้วนน้ำตาลสูง',
    defLong: 'Negative energy balance ช่วง transition ทำให้เกิด lipolysis, NEFA เข้าตับ แล้วสร้าง ketone bodies (acetone, acetoacetate, BHBA). Type 1 เกิดช่วง 3-6 สัปดาห์หลังคลอดตอนนมพีค เป็น hyperketonemia ร่วมกับ hypoglycemia ส่วน Type 2 เกิด 0-2 สัปดาห์หลังคลอดในวัวอ้วนที่ BCS ก่อนคลอดเกิน 3.75 เป็น hyperketonemia ร่วมกับ hyperglycemia จาก insulin resistance. Dx ใช้ blood BHBA โดย subclinical เริ่มที่ 1.2 mM และ clinical ที่ 3.0 mM ขึ้นไป, subclinical ketosis เพิ่มความเสี่ยง LDA และทำให้น้ำนมลด. Tx คือ propylene glycol ป้อนทางปาก ส่วนเคส clinical เพิ่ม dextrose 50% IV; ในแพะแกะรูปแบบก่อนคลอดที่อุ้มลูกแฝดเรียก pregnancy toxemia',
    scope: ['ruminant'] },
  { term: 'laminitis', aliases: ['กีบอักเสบ'], category: 'disease', thai: 'กีบอักเสบ',
    defShort: 'carb overload ทำให้ acidosis แล้ว endotoxin ทำลาย corium — subclinical จบที่ sole ulcer',
    defLong: 'เริ่มจากกินคาร์โบไฮเดรตย่อยง่ายมากเกินหรือเปลี่ยนสูตรอาหารกะทันหัน ทำให้ rumen acidosis, แบคทีเรีย gram-negative ตายแล้วปล่อย endotoxin, เกิด vasoactive amines และหลอดเลือดใน corium ของกีบเสียหาย. รูปแบบ subclinical ที่พบบ่อยในฟาร์มโคนมทำให้ P3 จมลง แล้วตามมาด้วย sole ulcer ในอีก 2-3 เดือน จึงต้องย้อนไปแก้การจัดการอาหาร ไม่ใช่ดูแค่กีบ. จัดอยู่ในกลุ่ม non-infectious lameness คู่กับ sole ulcer และ interdigital fibroma ต่างจากกลุ่ม infectious อย่าง digital dermatitis (Treponema) และ foot rot (Fusobacterium necrophorum). ป้องกันด้วย R:C ที่พอเหมาะ, effective fiber พอ, เปลี่ยนอาหารช้าๆ ร่วมกับ footbath และ claw trimming ปีละ 2 ครั้ง',
    scope: ['ruminant'] },
  { term: 'LDA', aliases: ['left displaced abomasum', 'displaced abomasum', 'abomasal displacement'], category: 'disease', thai: 'กระเพาะแท้เคลื่อนไปทางซ้าย',
    defShort: 'กระเพาะแท้ลอยไปอยู่ผนังท้องซ้าย — ping ซ้ายซี่โครง 9-13 — เดือนแรกหลังคลอด',
    defLong: 'Abomasum (กระเพาะแท้) สะสมแก๊สจาก volatile fatty acid แล้วลอยขึ้นไปแทรกระหว่าง rumen กับผนังท้องด้านซ้าย พบมากที่สุดในเดือนแรกหลังคลอดของโคนม. Dx ใช้ auscultation คู่ percussion ได้เสียง ping โลหะที่สีข้างซ้ายระดับซี่โครง 9-13 ส่วนบน อุจจาระมักเหลวละเอียดเหนียวและมีเงามัน. ปัจจัยร่วมคือ ketosis, hypocalcemia, retained placenta, metritis และอาหาร concentrate สูง effective fiber ต่ำ กับ DMI ที่ตก. Tx คือ right flank omentopexy, left abomasopexy หรือ roll-and-toggle ที่คา toggle ไว้ 4-6 สัปดาห์',
    scope: ['ruminant'] },
  { term: 'mastitis', aliases: ['clinical mastitis', 'subclinical mastitis', 'เต้านมอักเสบ', 'intramammary infection'], category: 'disease', thai: 'เต้านมอักเสบ',
    defShort: 'แบ่ง 3 ระดับ — mild นมผิดปกติ, moderate เต้าอักเสบด้วย, severe มี systemic sign',
    defLong: 'Clinical mastitis แบ่งความรุนแรง 3 ระดับ คือ mild ที่น้ำนมเป็นก้อนหรือลิ่มแต่เต้าและตัววัวปกติ (60-90% ของเคส ใช้ intramammary ก็พอ), moderate ที่น้ำนมผิดปกติร่วมกับเต้าบวมร้อนเจ็บแต่ยังไม่มี systemic sign (10-30%) และ severe หรือ toxic ที่มี systemic sign ร่วม เช่น ไข้เกิน 39.5°C หรือ hypothermia, tachycardia, ขาดน้ำ, rumen หยุดทำงาน (น้อยกว่า 5% ของเคส). กลุ่ม severe มักเป็น coliform ที่ปล่อย endotoxin จึงต้องให้ทั้ง systemic และ intramammary ร่วมกับ IV fluid และ NSAID เพราะ intramammary อย่างเดียวกระจายยาไม่พอในภาวะช็อก. Subclinical ติดตามด้วย SCC โดยเป้าหมายรายตัวต่ำกว่า 200,000 cell/mL และ bulk tank ต่ำกว่า 500,000 cell/mL, ส่วน on-farm culture อ่านผลใน 24 ชั่วโมงช่วยให้เคส no growth ไม่ต้องใช้ยาปฏิชีวนะ ยกเว้น toxic mastitis ที่รักษาทันทีโดยไม่รอผล',
    scope: ['ruminant'] },
  { term: 'metritis', aliases: ['puerperal metritis', 'มดลูกอักเสบ'], category: 'disease', thai: 'มดลูกอักเสบหลังคลอด',
    defShort: 'มดลูกอักเสบภายใน 21 วันหลังคลอด — discharge แดงน้ำตาลกลิ่นเหม็น — puerperal คือมีไข้ร่วม',
    defLong: 'การอักเสบติดเชื้อของมดลูกในช่วงหลังคลอด โดย Merck Veterinary Manual นับภายใน 21 วันหลังคลอดและส่วนใหญ่เกิดใน 10 วันแรก ลักษณะคือมดลูกโตคลำได้ มี discharge เหลวสีแดงน้ำตาลกลิ่นเหม็น. เรียก puerperal metritis เมื่อมี systemic sign ร่วม เช่น ไข้ ซึม กินลด น้ำนมตก. มักตามหลัง retained placenta, dystocia, ลูกแฝด และ hypocalcemia และเป็นหนึ่งในสาเหตุ endotoxemia ที่ทำให้ rumen hypomotility. ในโปรแกรมหลังคลอดของฟาร์ม การเฝ้า metritis ทำช่วง DIM 7-14 ขณะที่ CUI ซึ่งเป็นการตรวจหลังมดลูกฟื้นตัวทำที่ DIM 30-60',
    scope: ['ruminant'] },
  { term: 'milk fever', aliases: ['parturient paresis', 'hypocalcemia', 'ไข้น้ำนม'], category: 'disease', thai: 'ไข้น้ำนม',
    defShort: 'hypocalcemia 0-3 วันหลังคลอด — ล้มนอน sternal คอพับ ตัวเย็น — Ca borogluconate ช้าๆ IV',
    defLong: 'แคลเซียมในเลือดตกเร็วเพราะ colostrum ดึง Ca ไปมาก ขณะที่แม่โคแก่ mobilize Ca ผ่าน PTH, vitamin D และ Mg ได้ไม่ทัน พบมากช่วง 24 ชั่วโมงถึง 3 วันหลังคลอด. Stage 1 ขาอ่อนตัวสั่นกัดฟัน, stage 2 ล้มนอน sternal คอพับเข้าหาลำตัว หัวใจเบา ตัวเย็น, stage 3 นอนตะแคง หมดสติ กล้ามเนื้ออ่อนปวกเปียก. Dx serum Ca ต่ำกว่าปกติชัดเจน (ปกติ 2.2-2.6 mmol/L) แต่ในสนามมักรักษาตามอาการก่อนผลเลือด. Tx คือ calcium borogluconate ทาง IV ช้าๆ พร้อมฟังหัวใจกัน arrhythmia (เลกเชอร์ HHM ใช้ 40% 400 mL ใน 5-10 นาที ส่วน OSCE ใช้ 23% ราว 500 mL ใน 10-20 นาที) แล้วตามด้วย SC, ป้องกันด้วย negative DCAD diet ก่อนคลอดแล้วเปลี่ยนเป็น positive DCAD หลังคลอด',
    scope: ['ruminant'] },
  { term: 'RDA', aliases: ['right displaced abomasum', 'RTA', 'right torsion abomasum', 'abomasal volvulus', 'RAV'], category: 'disease', thai: 'กระเพาะแท้เคลื่อนไปทางขวา',
    defShort: 'ping ด้านขวา — RDA ธรรมดา vs RTA ที่บิดแล้วช็อกเร็ว — Cl ต่ำ K ต่ำ alkalosis',
    defLong: 'Abomasum เคลื่อนไปอยู่ด้านขวา ถ้าบิดหมุนเป็น right torsion (RTA) หรือ volvulus จะอุดทางออก แก๊สกับของเหลวคั่งและเลือดไปเลี้ยงไม่พอ. Dx ได้ ping ที่สีข้างขวาระดับเดียวกับ LDA ร่วมกับ electrolyte แบบ hypochloremic hypokalemic metabolic alkalosis (Cl ต่ำ, K ต่ำ, HCO3 สูง). RTA ดำเนินโรคเร็วใน 12-48 ชั่วโมง ท้องขวาป่อง HR เกิน 100 ขาดน้ำรุนแรง โดย lactate เกิน 4 mM, HR เกิน 100 และขาดน้ำเกิน 10% บอก prognosis ที่แย่. Tx คือ decompress แล้ว de-rotate ทาง right flank ตามด้วย omentopexy หรือ pyloropexy, mortality 25-40% แม้ผ่าตัด เทียบกับ LDA ที่ต่ำกว่า 10%',
    scope: ['ruminant'] },
  { term: 'retained placenta', aliases: ['retained fetal membranes', 'รกค้าง'], category: 'disease', thai: 'รกค้าง',
    defShort: 'ไม่ขับรกภายใน 24 ชม. หลังคลอด — เปิดทางให้ metritis — ไม่ดึงรกด้วยมือ',
    defLong: 'ปกติโคขับรกออกภายในไม่กี่ชั่วโมงหลังคลอด ถ้ายังค้างเกิน 24 ชั่วโมงถือเป็น retained fetal membranes (Merck Veterinary Manual). ปัจจัยเสี่ยงคือ hypocalcemia, dystocia, ลูกแฝด, แท้ง, คลอดก่อนกำหนด และการขาด selenium กับ vitamin E. เป็นหนึ่งในกลุ่มโรคของ transition period ที่มาคู่กับ ketosis, milk fever และ LDA และเป็นทางเปิดไปสู่ metritis. การดึงรกด้วยมือทำให้ caruncle ฉีกและมดลูกอักเสบหนักขึ้น แนวทางจึงเน้นแก้ hypocalcemia, เฝ้าไข้กับ systemic sign และให้ยาปฏิชีวนะเมื่อมีข้อบ่งชี้ มากกว่าการดึงออก',
    scope: ['ruminant'] },
  { term: 'SARA', aliases: ['subacute ruminal acidosis', 'subacute rumen acidosis'], category: 'disease', thai: 'ภาวะกรดในกระเพาะรูเมนแบบกึ่งเฉียบพลัน',
    defShort: 'rumen pH ตกเป็นช่วงจาก concentrate สูง fiber ต่ำ — milk fat ลด, laminitis, LDA ตามมา',
    defLong: 'อาหารข้นมากกับ effective fiber น้อยทำให้ fermentable carbohydrate สูง กรดสะสม และ rumen pH ตกเป็นช่วงๆ โดยไม่ถึงระดับ acute lactic acidosis (เลกเชอร์ในวิชานี้ให้ช่วงต่างกัน GI VDTT 5.0-5.5 ส่วน HHM 5.5-5.8). ผลตามมาคือ milk fat depression ผ่าน trans-10 C18:1, laminitis จาก endotoxin, LDA และ sole ulcer. Dx ระดับฝูงดูที่ milk fat ตกกับ fat:protein ต่ำกว่า 1.1, วัวเคี้ยวเอื้องน้อยกว่า 5 ตัวใน 10 ตัว และ particle size ของอาหารที่เล็กเกิน ส่วน rumenocentesis ใช้ยืนยันรายตัว. แก้ด้วย buffer NaHCO3, หญ้าหยาบ 2.5-5 cm, NDF 28-34%, peNDF 20-30% และเปลี่ยนสูตรอาหารอย่างช้าๆ',
    scope: ['ruminant'] },
  { term: 'sole ulcer', aliases: ['Rusterholz ulcer', 'pododermatitis circumscripta'], category: 'disease', thai: 'แผลหลุมพื้นกีบ',
    defShort: 'zone 4 รอยต่อส้นกับพื้นกีบ กีบนอกขาหลัง — ตามหลัง subclinical laminitis',
    defLong: 'แผลที่พื้นกีบตำแหน่ง zone 4 ซึ่งเป็นรอยต่อ axial ระหว่างส้นกับพื้นกีบ มักเป็นที่กีบด้านนอก (lateral claw) ของขาหลังเพราะรับน้ำหนักมากกว่า. เกิดตามหลัง subclinical laminitis ที่ทำให้ P3 จมลงไปกด corium ใต้ส้น จึงเป็นปัญหาการจัดการอาหารและพื้นคอกพอๆ กับปัญหาที่กีบเอง. Tx คือ corrective trim เอาน้ำหนักออกจากกีบที่เป็น แล้วใส่ block ที่กีบอีกข้างพร้อมดูแลแผล. ถ้าลุกลามถึงกระดูกหรือข้อจนเป็น osteomyelitis หรือ septic arthritis จึงพิจารณา digital amputation ระดับ S2 ซึ่งตัดที่หนึ่งในสามส่วนปลายของ P2',
    scope: ['ruminant'] },

  // ──────────────────────────────────────────────────────────
  // Equine
  // ──────────────────────────────────────────────────────────
  { term: 'colic', aliases: ['equine colic'], category: 'symptom', thai: 'ปวดท้องในม้า (โคลิก)',
    defShort: 'อาการปวดท้อง ไม่ใช่การวินิจฉัยสุดท้าย — GI คือ shock organ ของม้า จึงเป็นภาวะฉุกเฉินเสมอ',
    defLong: 'Colic เป็นกลุ่มอาการปวดท้อง ไม่ใช่ชื่อโรค สาเหตุมาจากทางเดินอาหารเอง หรือเป็น referred pain จากตับ ไต กระเพาะปัสสาวะ กระดูก และระบบสืบพันธุ์ เช่น การตกไข่ มดลูกบิด การเป็นสัด และการคลอด. อาการที่เห็นคือ pawing ยืดท้อง หายใจเร็ว เหงื่อออกมาก เตะท้อง ล้มนอนและกลิ้ง ซึ่งอันตรายเพราะกระเพาะแตกและลำไส้บิดได้ ม้าอาเจียนไม่ได้เพราะมุมที่หลอดอาหารต่อกระเพาะแหลมมากและ cardiac sphincter แข็งแรง. การประเมินใช้ vital signs, gut sound 4 ตำแหน่ง, NG tube, rectal palpation, ultrasound แบบ FLASH 6 ตำแหน่ง และ lactate ซึ่งม้าปกติต่ำกว่า 1 mmol/L โดยค่าจาก peritoneal fluid แม่นกว่าเลือด. ชนิดที่เอกสารสรุปไว้คือ spasmodic colic, pelvic flexure impaction, nephrosplenic entrapment, GI displacement และ sand colic ที่พบบ่อยในไทย',
    scope: ['equine'] },
  { term: 'composite colic score', aliases: ['CCS'], category: 'lab-value', thai: 'คะแนนรวมประเมินม้าปวดท้อง',
    defShort: 'คะแนนรวมหลายพารามิเตอร์ในเคส colic — เกิน 14 คือกลุ่มที่ต้องผ่าตัดหรือพิจารณาการุณยฆาต',
    defLong: 'CCS รวมค่าจากหลายพารามิเตอร์เข้าด้วยกัน ได้แก่ HR, RR, temperature, CRT, mucous membrane, gut sound, lactate, ผล NG tube, rectal palpation, ultrasound, ปริมาณอุจจาระ, การตอบสนองต่อยาลดปวด และท้องกาง. เกณฑ์ที่เอกสารใช้คือ คะแนนไม่เกิน 14 ให้รักษาด้วยยาอย่างเดียว ถ้าเกิน 14 ต้องผ่าตัดหรือพิจารณาการุณยฆาต. เอกสารเตือนไว้เองว่าอย่าเชื่อคะแนนอย่างเดียว เพราะบางเคสคะแนนต่ำแต่ม้าไม่ไหว การประเมินม้าจริงข้างตัวสำคัญกว่าตัวเลข',
    scope: ['equine'] },
  { term: 'EHV-1', aliases: ['equine herpesvirus-1', 'equine herpesvirus 1', 'EHV type 1'], category: 'disease', thai: 'เฮอร์ปีส์ไวรัสม้าชนิดที่ 1',
    defShort: 'แท้งในแม่ม้าและ myeloencephalopathy — คนละโรคกับ EHV-3 ที่เป็น coital exanthema',
    defLong: 'EHV type 1 ทำให้แม่ม้าแท้ง และก่อ encephalomyelitis หรือ equine herpesvirus myeloencephalopathy ได้ ส่วน EHV type 3 เป็นคนละโรค คือ equine coital exanthema ที่เป็นตุ่มใสบนอวัยวะเพศภายนอก. ผลทางจุลพยาธิวิทยาของลูกม้าแท้งที่ช่วยยืนยัน EHV-1 คือ eosinophilic intranuclear inclusion body. การป้องกันในแม่ม้าท้องคือฉีด EHV-1 ร่วมกับ influenza 3 ครั้ง ที่เดือน 5, 7 และ 9 ของการตั้งท้อง เพื่อส่งภูมิผ่านน้ำนม. เมื่อมีเคสแท้ง ให้แยกแม่ม้าและจัดการซากกับรกอย่างระมัดระวัง เพราะไวรัสแพร่ต่อในฝูงได้ (Merck Veterinary Manual)',
    scope: ['equine'] },
  { term: 'EIA', aliases: ['equine infectious anemia', 'equine infectious anaemia', 'swamp fever'], category: 'disease', thai: 'โรคโลหิตจางติดเชื้อในม้า',
    defShort: 'lentivirus ในม้า ตรวจด้วย AGID หรือ Coggins test — ม้าที่ติดเป็น carrier ตลอดชีวิต',
    defLong: 'Equine infectious anaemia เกิดจาก lentivirus ในวงศ์ Retroviridae แพร่โดยแมลงดูดเลือดปากแทงอย่าง tabanid และโดยเข็มหรือเลือดที่ปนเปื้อน ม้าที่ติดแล้วเป็น carrier ตลอดชีวิต และเป็นโรคที่ต้องแจ้ง (WOAH). อาการมีตั้งแต่แบบเฉียบพลันที่ไข้สูงร่วมกับ thrombocytopenia และ anemia ไปจนถึงแบบเรื้อรังที่ผอมลง บวมน้ำ และมีจุดเลือดออกที่เยื่อเมือก. การตรวจมาตรฐานคือ AGID หรือ Coggins test ซึ่งในสถานีเคสม้าผอมที่เลี้ยงรวมกับวัวและไม่เคยตรวจโรคก่อนซื้อ เป็นชุดตรวจที่ได้คะแนนคู่กับ Woo technique สำหรับ Trypanosoma. ไม่มีวัคซีนและไม่มีการรักษา จึงจัดการด้วยการคัดแยกม้าผลบวกออก และพึงระวังว่านอกวิชาม้า ตัวย่อ EIA หมายถึง enzyme immunoassay',
    scope: ['equine'] },
  { term: 'endometrial cup', aliases: ['endometrial cups'], category: 'anatomy', thai: 'เอนโดมีเทรียลคัพ',
    defShort: 'โครงสร้างจาก trophoblast วัน 35-40 ที่สร้าง eCG — เส้นแบ่งของการกลับเป็นสัดหลังเสียตัวอ่อน',
    defLong: 'วันที่ 35-40 ของการตั้งท้อง trophoblast พิเศษสร้าง endometrial cup ขึ้นที่เยื่อบุมดลูก ซึ่งหลั่ง eCG ชื่อเดิมคือ PMSG และออกฤทธิ์คล้าย LH ในม้า. eCG ทำให้เกิดการตกไข่เพิ่มและได้ accessory CL ที่สร้าง progesterone ค้ำการตั้งท้องช่วงราววัน 35-120 ก่อนที่รกจะรับช่วงสร้าง P4 ต่อตั้งแต่วัน 150. Cup ไม่สลายไปตามตัวอ่อน ถ้าตัวอ่อนตายหลังวัน 35-40 cup ที่สร้างแล้วจะยังหลั่ง eCG ต่อ แม่ม้าจึงไม่กลับมาเป็นสัดอีกราว 3 เดือนจนกว่า cup จะสลายเอง. นี่คือเหตุผลที่การลดจำนวนลูกแฝดควรทำให้เสร็จก่อนวันที่ 35',
    scope: ['equine'] },
  { term: 'failure of passive transfer', aliases: ['FPT'], category: 'disease', thai: 'ภาวะรับภูมิคุ้มกันจากนมน้ำเหลืองไม่สำเร็จ',
    defShort: 'ลูกม้า IgG น้อยกว่า 400 mg/dL — ภูมิของแม่ผ่านรกไม่ได้ จึงขึ้นกับ colostrum อย่างเดียว',
    defLong: 'ภูมิคุ้มกันของแม่ม้าผ่านรกไม่ได้ (รกม้าเป็นแบบ epitheliochorial ตาม Equine Internal Medicine) ลูกม้าจึงได้ IgG จาก colostrum เท่านั้น โดยควรกินนมน้ำเหลืองมากกว่า 1 ลิตรภายใน 12 ชั่วโมงแรก. เกณฑ์ที่ใช้คือ serum IgG ที่ 24 ชั่วโมงมากกว่า 800 mg/dL ถือว่าผ่าน ต่ำกว่า 400 mg/dL คือ FPT เต็มรูปแบบ ส่วนช่วง 400-800 mg/dL เป็น partial failure ที่ยังเสี่ยงติดเชื้อ. การจัดการขึ้นกับอายุ ลูกม้าอายุน้อยกว่า 12 ชั่วโมงให้ colostrum ทางปากได้ แต่เกิน 12 ชั่วโมงลำไส้ปิดแล้ว ต้องให้ plasma ทางหลอดเลือดดำ 1-2 ลิตร. ลูกม้าที่ FPT มาด้วยอ่อนแรง ดูดนมไม่ดี และ sepsis',
    scope: ['equine'] },
  { term: 'gastric reflux', aliases: ['nasogastric reflux'], category: 'symptom', thai: 'น้ำย้อนจากกระเพาะ',
    defShort: 'น้ำที่ไหลออกทาง NG tube เกิน 4 ลิตร — บ่งถึงการอุดตันที่ลำไส้เล็ก ไม่ drenching ต่อ',
    defLong: 'เมื่อสอด nasogastric tube แล้วมีน้ำไหลออกมามากกว่า 4 ลิตร เรียกว่า gastric reflux ซึ่งเป็นคอนเทนต์ของลำไส้เล็กผสมกับเอนไซม์ย่อยอาหารที่ไหลย้อนกลับขึ้นมา. แปลว่าอาหารน่าจะติดอยู่ที่ลำไส้เล็ก กรณีนี้จะไม่ drenching เพิ่มเพราะไม่ช่วยอะไร ทำแค่ lavage แล้วหาทางวินิจฉัยด้วยวิธีอื่น. เทียบกับผลอื่นของ NG tube คือ คอนเทนต์น้อยกว่า 0.5 ลิตรตัด impaction กับ tympany ออกได้ ส่วนแก๊สร่วมกับคอนเทนต์มากกว่า 0.5 ลิตรบ่งถึงการอุดตัน และ dry content บ่งถึงภาวะขาดน้ำ. เนื่องจากม้าอาเจียนไม่ได้ reflux จึงไม่แสดงออกมาเอง ต้องสอดท่อจึงจะรู้',
    scope: ['equine'] },
  { term: 'laminitis', aliases: [], category: 'disease', thai: 'กีบอักเสบ (ลามิไนติส)',
    defShort: 'lamellae ที่ยึด distal phalanx กับผนังกีบล้มเหลว — เจ็บขาหน้าสองข้าง digital pulse แรง',
    defLong: 'การอักเสบและความล้มเหลวของ lamellae ที่ยึด distal phalanx เข้ากับผนังกีบ ถ้าคุมไม่ได้กระดูกจะหมุนหรือทรุดลง (Merck Veterinary Manual, Equine Internal Medicine). เส้นทางที่เอกสารในวิชานี้ชี้ไว้มีสามทาง คือ endocrinopathic จาก PPID และภาวะ insulin resistance, จาก endotoxemia เมื่อแบคทีเรียแกรมลบตายแล้วปล่อย endotoxin, และจากการใช้ depot corticosteroid. อาการคลาสสิกคือเจ็บขาหน้าทั้งสองข้าง ยืนถ่ายน้ำหนักไปข้างหลัง digital pulse แรงขึ้นและกีบอุ่น ประเมินความรุนแรงด้วย Obel grade (Merck). การจัดการต้องแก้ต้นเหตุควบคู่กับ analgesia การพักบนพื้นนุ่ม และการแต่งกีบโดยช่างตีเกือกที่ชำนาญ ซึ่งใน PPID ที่คุม laminitis ไม่ได้เป็นเหตุผลหนึ่งที่พิจารณาการุณยฆาต',
    scope: ['equine'] },
  { term: 'nephrosplenic entrapment', aliases: ['nephrosplenic space'], category: 'disease', thai: 'ลำไส้ใหญ่ติดค้างในช่องระหว่างไตซ้ายกับม้าม',
    defShort: 'large colon เลื่อนไปค้างในช่องระหว่างไตซ้ายกับม้าม — ultrasound ไม่เห็นไตกับม้ามเพราะแก๊สบัง',
    defLong: 'Colon ขยับขึ้นไปอยู่ในช่องว่างระหว่างไตซ้ายกับม้าม ซึ่งเป็นที่มาของชื่อ nephrosplenic. บน ultrasound จะไม่เห็นม้ามและไตซ้ายตามที่ควรเห็น เพราะมีแก๊สใน colon บังอยู่ด้านหน้า จำง่ายว่าอวัยวะที่ควรเห็นกลับหายไป ไม่ใช่เห็นก้อนเพิ่ม. จัดอยู่ในกลุ่ม GI displacement ซึ่งในม้ามักต้องผ่าตัดรักษา และตำแหน่งม้ามที่อยู่ติดไตซ้ายเป็น landmark เดียวกับที่ใช้ตอนซาวน์ช่องท้องม้า',
    scope: ['equine'] },
  { term: 'pelvic flexure impaction', aliases: ['pelvic flexure'], category: 'disease', thai: 'อาหารอัดแน่นที่ส่วนโค้งเชิงกรานของลำไส้ใหญ่',
    defShort: 'จุดพลิกจาก LVC ไป LDC ที่ลำไส้แคบลง — ตำแหน่ง impaction ในม้าที่ไม่ได้เคลื่อนไหว',
    defLong: 'Colon ม้าเรียงเป็น cecum, RVC, sternal flexure, LVC, pelvic flexure, LDC, diaphragmatic flexure, RDC แล้วต่อเข้า small colon โดย ventral colon ไล่จากขวาไปซ้าย ส่วน dorsal colon ไล่กลับจากซ้ายไปขวา และ pelvic flexure คือจุดพลิก. เป็นตำแหน่งที่เกิด impaction บ่อย มักในม้าที่ไม่ได้เคลื่อนไหว เช่น ขาเจ็บ หรือช่วงอากาศหนาว. รักษาด้วยการสอด NG tube ใส่น้ำและพาราฟิน ให้ IV fluid และผ่าตัดถ้าจำเป็น',
    scope: ['equine'] },
  { term: 'pneumovagina', aliases: ['Caslick vulvoplasty', 'Caslick\'s vulvoplasty', 'Caslick\'s operation', 'Caslick'], category: 'disease', thai: 'ภาวะลมเข้าช่องคลอดในแม่ม้า',
    defShort: 'ลมถูกดูดเข้าช่องคลอดจาก vulvar conformation ที่ไม่ดี — แก้ด้วย Caslick vulvoplasty',
    defLong: 'สาเหตุหลักคือ poor conformation ของ vulva ทำให้ปากช่องคลอดปิดไม่สนิท ลมและสิ่งสกปรกจึงถูกดูดเข้าไป นำไปสู่ endometritis และภาวะมีบุตรยาก. ด่านกั้นทางกายภาพที่เอกสารระบุคือ vulva lips และ vestibulovaginal fold ส่วนตำรามาตรฐานนับ cervix เป็นด่านที่สาม. การแก้ที่ได้ผลคือ Caslick vulvoplasty หรือ Caslick\'s operation คือเย็บปิดขอบบนของ vulva ให้เหลือช่องเปิดด้านล่างพอปัสสาวะได้ ไม่ใช่ Buhner\'s operation ซึ่งใช้กับช่องคลอดปลิ้นในโค. แม่ม้าที่เคยเย็บ Caslick ไว้ ต้องเปิดรอยเย็บราว 2 สัปดาห์ก่อนคลอด ถ้าไม่เปิดฝีเย็บจะฉีกขาดตอนลูกออก และถ้าไม่เคยเย็บก็ไม่ต้องทำ',
    scope: ['equine'] },
  { term: 'PPID', aliases: ['pituitary pars intermedia dysfunction', 'equine Cushing\'s disease', 'equine Cushing\'s'], category: 'disease', thai: 'พีพีไอดี (คุชชิ่งในม้า)',
    defShort: 'dopaminergic neuron เสื่อม pars intermedia โตและหลั่ง ACTH สูง — ไม่ใช่เนื้องอกต่อมหมวกไต',
    defLong: 'พยาธิกำเนิดคือเซลล์ประสาทที่หลั่ง dopamine จาก hypothalamus เสื่อม ทำให้ pars intermedia hyperplasia หรือเกิด adenoma แล้วหลั่ง ACTH สูงขึ้น ไม่ใช่เนื้องอกที่ต่อมหมวกไต และไม่ใช่การแบ่ง pituitary-dependent กับ adrenal tumour แบบสุนัข. พบในม้าอายุมากกว่า 15 ปี ไม่จำเพาะพันธุ์หรือเพศ มาด้วย hypertrichosis ผลัดขนช้า กล้ามเนื้อแนวสันหลังลด เหงื่อออกผิดปกติ PU/PD ท้องป่อง ติดเชื้อซ้ำ และ laminitis. Lab พบ hyperglycemia, hyperinsulinemia, hypertriglyceridemia และ fecal egg count สูง วินิจฉัยด้วย basal ACTH ที่แปลผลเทียบค่าตัดตามฤดูกาล และใช้ TRH stimulation test เมื่อผลก้ำกึ่ง. รักษาด้วย pergolide เริ่ม 2 ug/kg PO วันละครั้ง ปรับเพิ่มได้ถึง 6-10 ug/kg เพิ่ม cyproheptadine เมื่อตอบสนองไม่ดี ควบคู่กับการคุม laminitis แต่งกีบ และคุมการติดเชื้อ',
    scope: ['equine'] },
  { term: 'pyometra', aliases: ['mare pyometra'], category: 'disease', thai: 'มดลูกเป็นหนองในแม่ม้า',
    defShort: 'หนองคั่งในมดลูกแม่ม้า cervix ปิด ร่วมกับ CL ที่ยัง active — รักษาด้วย PGF2alpha ไม่ใช่ OVH',
    defLong: 'หนองคั่งในโพรงมดลูกของแม่ม้า มักไม่เห็น discharge เพราะ cervix ปิด และตัวม้ามักไม่ป่วยทั้งระบบ ต่างจาก metritis หลังคลอดที่ไข้สูง ซึม ไม่กิน และเจ็บมดลูก. จุดที่แยกออกจาก bacterial endometritis คือรังไข่ยังมี CL ที่ active ค้างอยู่ ส่วน cytology เหมือนกันคือ PMN สูงและพบ bacteria และ ultrasound เห็นมดลูกใหญ่มี fluid. การรักษาคือ PGF2alpha เช่น cloprostenol เพื่อทำ luteolysis ย่น luteal phase ให้ม้ากลับเป็นสัด cervix เปิดและระบายหนองออกได้ ร่วมกับ drainage, uterine lavage และ antibiotics. แม่ม้าที่ยังไม่ทำหมันจึงไม่ได้ไปที่ ovariohysterectomy แบบสุนัขแมว ส่วน hysterectomy เป็นทางเลือกสุดท้ายเมื่อรักษาด้วยยาไม่ได้จริง',
    scope: ['equine'] },
  { term: 'sarcoid', aliases: ['equine sarcoid'], category: 'disease', thai: 'ซาร์คอยด์ (เนื้องอกผิวหนังม้า)',
    defShort: 'เนื้องอกผิวหนังที่พบบ่อยที่สุดในม้า สัมพันธ์กับ BPV-1 หรือ BPV-2 — มี 6 รูปแบบทางคลินิก',
    defLong: 'เป็นเนื้องอกผิวหนังที่พบบ่อยที่สุดในม้า ไม่จำเพาะอายุหรือเพศ สัมพันธ์กับ bovine papillomavirus BPV-1 เป็นหลักหรือ BPV-2 และสงสัยว่ามีแมลงเป็นพาหะ. มักอยู่บริเวณที่ขนบาง ได้แก่ ศีรษะ ขาหนีบ และท้องด้านล่าง แบ่งเป็น 6 รูปแบบคือ occult, verrucose, nodular, fibroblastic, mixed และ malevolent. วินิจฉัยจากลักษณะและตำแหน่ง แล้วยืนยันด้วย biopsy ร่วมกับ histopathology แม้การตัดชิ้นเนื้อจะมีความเสี่ยงทำให้รอยโรคกำเริบก็ยังจำเป็น แยกจาก SCC, habronemiasis, exuberant granulation tissue และ papillomatosis. การรักษาเลือกให้เหมาะรายตัว ตั้งแต่ benign neglect ในรอยโรคเล็กและคงที่ ไปจนถึง laser excision ที่เอกสารระบุว่าให้ผลดีที่สุด ส่วน sharp excision ไม่แนะนำและ cryotherapy กลับเป็นซ้ำสูง',
    scope: ['equine'] },
  { term: 'strangles', aliases: ['Streptococcus equi subsp. equi', 'S. equi subsp. equi'], category: 'disease', thai: 'สแตรงเกิลส์ (ฝีที่ต่อมน้ำเหลืองในม้า)',
    defShort: 'Streptococcus equi subsp. equi — ไข้ น้ำมูกเป็นหนอง ต่อมน้ำเหลืองใต้คางและหลังคอหอยเป็นฝี',
    defLong: 'โรคติดเชื้อทางเดินหายใจส่วนต้นของม้าจาก Streptococcus equi subsp. equi ซึ่งอยู่ในกลุ่ม bacterial disease ที่วิชานี้จัดไว้คู่กับ tetanus, glanders และ CEM. อาการคือไข้ น้ำมูกเป็นหนอง กลืนลำบาก และ abscess ของ submandibular กับ retropharyngeal lymph node ที่อาจแตกออกมา (Merck Veterinary Manual). การเก็บตัวอย่างใช้ deep nasopharyngeal swab หรือ guttural pouch lavage ส่งเพาะเชื้อและ PCR ม้าที่หายแล้วบางตัวเป็น carrier ที่เก็บเชื้อไว้ใน guttural pouch จึงต้องคัดกรองก่อนนำเข้ารวมฝูง (Merck). ภาวะแทรกซ้อนที่ต้องรู้จักคือ bastard strangles ที่ฝีกระจายไปอวัยวะอื่น และ purpura haemorrhagica ซึ่งเป็น immune-mediated vasculitis ตามหลังการติดเชื้อ',
    scope: ['equine'] },
  { term: 'uterine edema', aliases: ['uterine oedema', 'uterine edema score', 'uterine oedema score'], category: 'symptom', thai: 'ภาวะมดลูกบวมน้ำ',
    defShort: 'ลักษณะบวมน้ำของมดลูกบน ultrasound ให้คะแนน 0-4 — สูงสุดคือ estrus ส่วน 0 คือ diestrus',
    defLong: 'ภาพบวมน้ำของ endometrial fold บน ultrasound ทางทวารหนัก ให้คะแนน 0 ถึง 4 โดย 0 คือไม่มี edema เป็นผลโดยตรงจาก estrogen ที่ขึ้นตาม follicle ซึ่งโตใกล้ตกไข่. อ่านคู่กับสิ่งที่พบบนรังไข่เพื่อจัดระยะวงรอบ: follicle 3.5 ซม. ร่วมกับ edema +4 คือ estrus ส่วนการพบ CL ร่วมกับ edema เท่ากับ 0 และ uterine tone fair to good คือ diestrus. มดลูกนิ่ม รังไข่เล็ก มีเพียง follicle ราว 1 ซม. หลายใบและไม่มี CL คือ anestrus. ต่างจาก edema ทั่วไปในสัตว์เล็กที่สืบไปหา hypoalbuminemia หรือ lymphatic obstruction ตรงนี้เป็น physiologic hormone effect ไม่ใช่พยาธิสภาพ',
    scope: ['equine'] },

  // ──────────────────────────────────────────────────────────
  // Veterinary public health, food and milk hygiene, epidemiology
  // ──────────────────────────────────────────────────────────
  { term: 'ante-mortem inspection', aliases: ['antemortem inspection', 'AM inspection', 'การตรวจสัตว์ก่อนฆ่า'], category: 'lab-value', thai: 'การตรวจสัตว์ก่อนฆ่า',
    defShort: 'ตรวจสัตว์มีชีวิตก่อนเข้าฆ่า — ประวัติ สวัสดิภาพ สุขภาพ — จบที่ disposition 5 แบบ',
    defLong: 'AM inspection ดู general behavior, nutritional status หรือ BCS, ความสะอาด และอาการของโรค เพื่อให้เฉพาะสัตว์ที่ดูแข็งแรงและปกติทางสรีรวิทยาเข้าฆ่า และแยกสัตว์ผิดปกติออก การตรวจที่ครบต้องคลุมสามชั้น คือประวัติการเลี้ยง การรักษาและวัคซีนพร้อมเอกสารเคลื่อนย้ายและแหล่งที่มา การประเมินสวัสดิภาพ และการสังเกตหรือตรวจร่างกายสัตว์จริงที่โรงพัก การตัดสินหรือ disposition มี 5 แบบ ได้แก่ pass, hold เพื่อตรวจซ้ำ, suspect ซึ่งยังเข้าฆ่าได้แต่แยกลำดับและตรวจละเอียด, condemned และ emergency slaughter สำหรับสัตว์ที่บาดเจ็บรักษาไม่ได้และการชะลอจะกระทบสวัสดิภาพแต่เนื้อยังปลอดภัย เกณฑ์ไข้สูงที่ทำให้สัตว์กีบไม่เหมาะเข้าฆ่าคือสุกรตั้งแต่ 106 องศาฟาเรนไฮต์ และโค กระบือ แพะ แกะ ตั้งแต่ 105 องศาฟาเรนไฮต์',
    scope: ['public-health'] },
  { term: 'antibiotic residue', aliases: ['drug residue', 'antimicrobial residue', 'withdrawal period', 'withdrawal time', 'MRL', 'maximum residue limit', 'ยาตกค้าง', 'ระยะหยุดยา'], category: 'drug', thai: 'ยาปฏิชีวนะตกค้าง',
    defShort: 'ยาที่เหลือในน้ำนมหรือเนื้อเกิน MRL — กันด้วย withdrawal period — น้ำนมดิบต้องตรวจไม่พบ',
    defLong: 'Withdrawal period คือช่วงเวลาหลังหยุดใช้ยาจนความเข้มข้นในเนื้อเยื่อหรือน้ำนมลดต่ำกว่า MRL หรือ maximum residue limit สาเหตุรากของการตกค้างเกินคือ withdrawal time ไม่พอ การใช้ยานอกฉลาก หรืออาหารและน้ำที่ปนเปื้อน น้ำนมโคดิบตามมาตรฐานต้องตรวจไม่พบยาต้านจุลชีพด้วยชุดทดสอบเบื้องต้นคือ Delvo test ซึ่งอาศัยการยับยั้งการเจริญของแบคทีเรียทดสอบ จึงจับได้เฉพาะกลุ่มยาต้านจุลชีพ ไม่ใช่วัตถุเจือปนอาหารหรือสารพิษจากเชื้อรา ในแผน HACCP ของนม UHT จุดรับน้ำนมถูกกำหนดเป็น CCP โดยมี critical limit ว่าต้องไม่มี antibiotic residue และในโรงเชือดสัตว์ปีกต้องตรวจ treatment record ตาม VPOM ถ้าไม่ผ่านให้เลื่อนแผนเชือด นอกจากความเสี่ยงต่อผู้บริโภคและ AMR ยาตกค้างยังฆ่าแบคทีเรียหมัก ทำให้ผลิตภัณฑ์นมหมักคุณภาพต่ำ',
    scope: ['public-health'] },
  { term: 'California Mastitis Test', aliases: ['CMT'], category: 'lab-value', thai: 'การทดสอบเต้านมอักเสบแบบแคลิฟอร์เนีย',
    defShort: 'cow-side test ประเมิน SCC — detergent สลายเซลล์ ปล่อย DNA เป็นเจล ยิ่งหนืดยิ่งอักเสบแรง',
    defLong: 'CMT ใช้ anionic detergent ทำลายเยื่อหุ้มเซลล์โซมาติกและเยื่อหุ้มนิวเคลียส ปลดปล่อย DNA ออกมาจับตัวเป็นเจล ความหนืดที่เห็นจึงแปรตามจำนวนเซลล์ ทำให้ประเมิน SCC ได้ข้างเต้าโดยไม่ต้องส่งห้องปฏิบัติการ เป็น cow-side test คือทำข้างตัวโคขณะรีดและรู้ผลทันที ต่างจาก Wisconsin mastitis test ที่เป็น on-farm test และต่างจาก direct microscopic count กับ electronic counter ที่เป็นงานห้องปฏิบัติการ ที่จุดรับน้ำนม CMT และ SCC ถูกจัดไว้ในชุดตรวจก่อนเทลงถังรวม เพราะเป็นการดูสุขภาพเต้านมของน้ำนมรายฟาร์ม ข้อจำกัดคือ CMT บอกระดับการอักเสบเท่านั้น ไม่ได้บอกชนิดเชื้อ และไม่ใช่เครื่องมือคัดกรองวัณโรคในฝูงซึ่งต้องใช้ tuberculin skin test ที่ตัวสัตว์',
    scope: ['public-health'] },
  { term: 'Furstenberg\'s rosette', aliases: ['Furstenberg rosette', 'Furstenbergs rosette', 'Fuerstenberg\'s rosette', 'Fuerstenbergs rosette', 'rosette of Furstenberg'], category: 'anatomy', thai: 'ฟูร์สเทนเบิร์กโรเซตต์',
    defShort: 'รอยพับเยื่อเมือกที่รอยต่อ teat cistern กับ teat canal เป็นด่านกันเชื้อ ไม่ใช่กล้ามเนื้อหูรูด',
    defLong: 'Furstenberg\'s rosette คือกลุ่มรอยพับของเยื่อเมือกที่ปลายบนของ teat cistern ตรงรอยต่อกับ teat canal ทำหน้าที่เป็นด่านกรองเชื้อและกักน้ำนม ไม่ใช่กล้ามเนื้อ จุดที่สับสนบ่อยมีสองจุด จุดแรกคือกล้ามเนื้อหูรูดที่กันน้ำนมรั่วจริงคือ teat sphincter ที่ล้อมรอบ streak canal ตรงปลายหัวนม จุดที่สองคือรอยพับที่กั้นระหว่าง gland cistern กับ teat cistern คือ annular fold หรือ annular ring ไม่ใช่ rosette เชื้อก่อ mastitis เข้าเต้าทาง teat canal เป็นหลัก การจุ่มหัวนมหลังรีดจึงเป็นมาตรการสำคัญ ฟาร์มที่ไม่จุ่มหัวนมพบ Corynebacterium bovis และ SCC สูงขึ้นได้',
    scope: ['public-health'] },
  { term: 'HACCP', aliases: ['hazard analysis critical control point', 'CCP', 'critical control point', 'critical limit'], category: 'lab-value', thai: 'ระบบวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุม',
    defShort: 'ระบบความปลอดภัยอาหาร 7 หลักการ — หา CCP แล้วคุมด้วย critical limit ที่วัดได้จริง',
    defLong: 'เจ็ดหลักการเรียงตามลำดับคือ hazard analysis, ระบุ CCP, กำหนด critical limit เป็นตัวเลขที่วัดได้เช่นอุณหภูมิ เวลา pH, monitoring, corrective action, verification และ documentation โดยก่อนหน้านั้นต้องทำ primary 5 steps ตั้งแต่ตั้งทีม HACCP จนถึงตรวจ flow diagram กับหน้างานจริง CCP คือจุดที่ต้องใช้มาตรการควบคุมเพื่อป้องกัน กำจัด หรือลดอันตรายให้อยู่ระดับยอมรับได้ คุณสมบัติคือวัดหรือสังเกตได้ กำหนด tolerance ได้ และมีมาตรการแก้ไขเมื่อเบี่ยงเบน ต่างจาก CP ที่ความเสี่ยงต่ำ Codex ให้ใช้ decision tree 4 คำถามเป็น guideline ไม่ใช่สูตรตายตัว และถ้าไม่มี prerequisite ที่ดีอย่าง GMP GHP GAP หรือ biosecurity แผน HACCP ก็แทบไม่สำเร็จ ตัวอย่างนม UHT คือ CCP ที่จุดรับน้ำนม จุด UHT sterilization และ aseptic filling',
    scope: ['public-health'] },
  { term: 'incidence', aliases: ['cumulative incidence', 'incidence rate', 'incidence risk', 'incidence proportion', 'attack rate', 'อุบัติการณ์'], category: 'lab-value', thai: 'อุบัติการณ์',
    defShort: 'จำนวนรายใหม่ต่อประชากรเสี่ยง — วัดว่าโรคเกิดใหม่เร็วแค่ไหน ไม่ใช่จำนวนที่มีอยู่',
    defLong: 'Cumulative incidence หรือ incidence risk คือจำนวน case ใหม่หารด้วย population at risk ณ จุดเริ่มต้น โดยต้องตัดสัตว์ที่เป็นโรคอยู่ก่อนแล้วออกจากตัวหาร เพราะไม่มีโอกาสกลายเป็น case ใหม่ ส่วน incidence rate ใช้ผลรวมของเวลาที่แต่ละตัวอยู่ในภาวะเสี่ยงเป็นตัวหาร หน่วยจึงมีเวลาต่อท้ายเสมอ เช่น ต่อ 1,000 animal-month Attack rate ในงานสอบสวนโรคคือ incidence proportion ของการระบาดนั้น คือจำนวนป่วยรายใหม่หารด้วยจำนวนประชากรที่เสี่ยง ณ จุดเริ่มต้น อย่าสับกับ morbidity rate ที่เป็นป่วยต่อประชากรทั้งหมด mortality rate ที่เป็นตายต่อประชากรทั้งหมด และ case-fatality rate ที่เป็นตายต่อจำนวนป่วย',
    scope: ['public-health'] },
  { term: 'methylene blue reduction test', aliases: ['methylene blue test', 'MBRT', 'methylene blue', 'resazurin test', 'resazurin'], category: 'lab-value', thai: 'การทดสอบการลดสีเมทิลีนบลู',
    defShort: 'ดูเวลาที่สีน้ำเงินจางหาย เชื้อยิ่งมากยิ่งจางเร็ว — น้ำนมดิบต้องนานกว่า 4 ชั่วโมง',
    defLong: 'เป็น dye reduction test ที่ประมาณปริมาณจุลินทรีย์ทางอ้อม แบคทีเรียที่ยังมีชีวิตทำให้สภาวะรีดิวซ์เพิ่มขึ้นจน methylene blue เปลี่ยนจากสีน้ำเงินเป็นไม่มีสี เชื้อยิ่งมากสียิ่งจางเร็ว จึงไม่ต้องเพาะเชื้อ มกษ. 6003-2553 กำหนดน้ำนมโคดิบต้องใช้เวลาลดสีมากกว่า 4 ชั่วโมง หรือใช้ resazurin ที่ 1 ชั่วโมงต้องไม่ต่ำกว่าเกรด 4.5 ที่ศูนย์รวบรวมน้ำนม วิธีนี้อยู่ในชุดตรวจหลังเทน้ำนมลงถังรวมคู่กับการตรวจยาปฏิชีวนะด้วย Delvo test ขณะที่การตรวจสี กลิ่น alcohol test และ CMT ทำก่อนเทลงถัง ต่างจาก alcohol test และ clot on boiling ที่บอกความคงตัวของโปรตีนจากความเป็นกรด ไม่ได้ประมาณจำนวนเชื้อ',
    scope: ['public-health'] },
  { term: 'pasteurisation', aliases: ['pasteurization', 'pasteurized', 'pasteurised', 'LTLT', 'HTST', 'UHT', 'พาสเจอร์ไรส์', 'พาสเจอไรซ์'], category: 'lab-value', thai: 'การพาสเจอร์ไรส์',
    defShort: 'ฆ่าเชื้อก่อโรคด้วยความร้อนต่ำกว่าจุดเดือด — LTLT 63C 30 นาที หรือ HTST 72C 15 วินาที',
    defLong: 'ตามกฎหมายไทย pasteurization คือ LTLT มากกว่า 63 องศาเซลเซียส นานกว่า 30 นาที หรือ HTST มากกว่า 72 องศาเซลเซียส นานกว่า 15 วินาที แล้วทำให้เย็นลงทันที ส่วน sterilization คือมากกว่า 100 องศาเซลเซียส นานกว่า 15 นาที และ UHT คือมากกว่า 133 องศาเซลเซียส นานกว่า 1 วินาที นมพาสเจอร์ไรส์เก็บที่ต่ำกว่า 8 องศาเซลเซียส ได้ไม่เกิน 10 วันนับจากวันบรรจุ ขณะที่ UHT และ sterilized milk เก็บที่อุณหภูมิห้องได้ จุดที่สับสนบ่อยคือความร้อนระดับ pasteurization ฆ่าเชื้อได้แต่ไม่ทำลาย heat-stable enterotoxin ของ S. aureus และไม่ทำลายสปอร์ของ Bacillus หรือ Clostridium จึงยังเกิด spoilage หรือ food poisoning ได้ ที่สำคัญไม่แพ้กันคือ post-pasteurization contamination ซึ่งเป็นปัญหาใหญ่ของอุตสาหกรรมนม',
    scope: ['public-health'] },
  { term: 'post-mortem inspection', aliases: ['postmortem inspection', 'PM inspection', 'meat inspection', 'การตรวจซาก'], category: 'lab-value', thai: 'การตรวจซากหลังฆ่า',
    defShort: 'ตรวจซากและเครื่องในหลังฆ่า — แยก localized กับ generalized และ acute กับ chronic',
    defLong: 'PM inspection คือการตัดสินซากหรือ carcass judgement โดยจำแนกว่ารอยโรคเป็น localized หรือ generalized และเป็น acute หรือ chronic เพราะรอยโรคเฉพาะที่มักตัดแต่งออกแล้วปล่อยผ่านได้ ส่วน generalized มักนำไปสู่การทำลายทั้งซาก ตรวจอย่างเป็นระบบตามลำดับจากหัวและลิ้น ปอดและเยื่อหุ้มปอด หัวใจและเยื่อหุ้มหัวใจ ตับและกะบังลม ม้าม ไต ทางเดินอาหาร กล้ามเนื้อ ต่อมน้ำเหลือง แล้วจึงประเมินทั้งซาก รอยโรคที่พบบ่อยได้แก่ granuloma ของวัณโรค cysticercosis ฝีในตับ ปอดอักเสบ และเต้านมอักเสบ ผลการตัดสินไล่ตั้งแต่ผ่าน ตัดแต่งเฉพาะส่วนแล้วลดเกรด ส่งทำอาหารสัตว์หรือ rendering จนถึง total condemnation และทั้ง AM กับ PM เป็นหน้าที่ของสัตวแพทย์ตามกฎหมาย',
    scope: ['public-health'] },
  { term: 'predictive value', aliases: ['PPV', 'NPV', 'positive predictive value', 'negative predictive value'], category: 'lab-value', thai: 'ค่าทำนายผลบวกและผลลบ',
    defShort: 'PPV คือสัดส่วนเป็นโรคจริงในกลุ่มผลบวก, NPV คือไม่เป็นโรคจริงในกลุ่มผลลบ',
    defLong: 'PPV เท่ากับ TP หารด้วย TP บวก FP และ NPV เท่ากับ TN หารด้วย TN บวก FN จุดต่างสำคัญจาก sensitivity และ specificity คือ predictive value ตั้งตัวหารตามผลตรวจ ไม่ใช่ตามสถานะโรคจริง ตัวอย่างจากตาราง TP 90, FP 60, FN 10, TN 120 จะได้ PPV เท่ากับ 90 หารด้วย 150 เป็น 60% และ NPV เท่ากับ 120 หารด้วย 130 เป็น 92.3% Predictive value ขึ้นกับความชุก เมื่อ prevalence สูงขึ้นโดย threshold และ spectrum ของโรคคงเดิม PPV จะสูงขึ้นและ NPV จะลดลง ขณะที่ sensitivity กับ specificity ไม่เปลี่ยน นี่คือเหตุผลที่ผลบวกจากการ screening ในประชากรที่ความชุกต่ำต้องยืนยันซ้ำเสมอ',
    scope: ['public-health'] },
  { term: 'prevalence', aliases: ['point prevalence', 'period prevalence', 'apparent prevalence', 'ความชุก'], category: 'lab-value', thai: 'ความชุก',
    defShort: 'สัดส่วนที่มีโรคอยู่ในประชากรเสี่ยง — เป็นภาพนิ่ง ไม่บอกความเร็วที่โรคเกิดใหม่',
    defLong: 'Prevalence คือจำนวน case ที่มีอยู่หารด้วยจำนวนประชากรเสี่ยงในช่วงเวลานั้น ต่างจาก incidence ที่นับเฉพาะ case ใหม่ Point prevalence วัด ณ จุดเวลาเดียว ส่วน period prevalence กวาดทั้งช่วงเวลาจึงมักได้ค่าสูงกว่าเมื่อเทียบกัน Apparent prevalence คือสัดส่วนผลบวกต่อจำนวนที่ตรวจ ซึ่งขึ้นกับ sensitivity และ specificity ของชุดตรวจ จึงไม่เท่ากับ true prevalence ในงานเฝ้าระวังยังมี design prevalence คือระดับความชุกที่ตั้งไว้ว่าระบบต้องจับให้ได้ เช่น ระบบที่มี sensitivity 95% ที่ design prevalence 1% แปลว่ามีโอกาส 95% ที่จะเจอสัตว์ติดเชื้ออย่างน้อยหนึ่งตัวถ้าประชากรติดเชื้ออยู่จริงที่ระดับ 1%',
    scope: ['public-health'] },
  { term: 'R0', aliases: ['basic reproduction number', 'basic reproductive number', 'R naught', 'R nought'], category: 'lab-value', thai: 'ค่าการแพร่เชื้อพื้นฐาน',
    defShort: 'จำนวนตัวที่ติดเชื้อใหม่โดยเฉลี่ยจากผู้ป่วย 1 ตัว ในประชากรที่ไวรับทั้งหมด',
    defLong: 'นิยามตามที่เลกเชอร์วางไว้คือ the average number of new infections caused by one infected animal introduced into a fully susceptible population การแปลผลมีสามระดับ คือ R0 มากกว่า 1 การระบาดขยายตัว R0 เท่ากับ 1 โรคคงอยู่ในระดับเดิม และ R0 น้อยกว่า 1 โรคค่อยหายไปเอง Herd immunity คือภาวะที่ประชากรมีสัดส่วนผู้มีภูมิคุ้มกันมากพอ ไม่ว่าจะจากการติดเชื้อมาก่อนหรือจากวัคซีน จนการแพร่ในประชากรถูกจำกัด และโดยหลักการยิ่ง R0 สูง สัดส่วนที่ต้องมีภูมิก็ยิ่งต้องสูงตาม เอกสารเรียนไม่ได้ระบุตัวเลขเปอร์เซ็นต์ของ herd immunity ไว้ บอกเพียงว่าต้องมากพอ จึงอย่าตอบเป็นตัวเลขถ้าโจทย์ไม่ได้ให้มา',
    scope: ['public-health'] },
  { term: 'relative risk', aliases: ['risk ratio'], category: 'lab-value', thai: 'ความเสี่ยงสัมพัทธ์',
    defShort: 'RR = incidence กลุ่มสัมผัส หารด้วยกลุ่มไม่สัมผัส — มากกว่า 1 คือสัมพันธ์เชิงบวก',
    defLong: 'จากตาราง 2x2 ที่กลุ่ม exposed มีเป็นโรค A และไม่เป็นโรค B ส่วนกลุ่ม non-exposed มี C และ D สูตรคือ RR เท่ากับ A หาร A บวก B ทั้งก้อน หารด้วย C หาร C บวก D ขณะที่ odds ratio เท่ากับ A ส่วน B หารด้วย C ส่วน D จุดต่างที่ควรจำคือตัวส่วนของ RR ใช้ทั้งแถว แต่ OR ใช้เฉพาะกลุ่มที่ไม่เป็นโรค การแปลผลเหมือนกันทั้งคู่ คือมากกว่า 1 สัมพันธ์เชิงบวก เท่ากับ 1 ไม่มีความสัมพันธ์ น้อยกว่า 1 สัมพันธ์เชิงลบ ส่วน attributable risk เป็นการลบ ไม่ใช่การหาร คือ incidence ของกลุ่มสัมผัสลบด้วย incidence ของกลุ่มไม่สัมผัส จึงเป็นส่วนที่โทษการสัมผัสได้ เลือกใช้ตาม design คือ RR สร้างจาก incidence ของทั้งสองกลุ่มจึงเป็นดัชนีของ cohort study ส่วน case-control ที่ตั้งต้นจาก outcome ต้องใช้ odds ratio แทน',
    scope: ['public-health'] },
  { term: 'reservoir', aliases: ['reservoir host', 'แหล่งรังโรค'], category: 'organism', thai: 'แหล่งรังโรค',
    defShort: 'ที่อยู่ตามธรรมชาติที่เชื้ออาศัย เจริญ และเพิ่มจำนวน — คน สัตว์ ดิน น้ำ อาหาร',
    defLong: 'นิยามที่เลกเชอร์ใช้คือ the natural habitat where a pathogen normally lives, grows, and multiplies และเป็นหนึ่งใน 6 ข้อต่อของ chain of infection แบ่งเป็น animal reservoir อย่างค้างคาว สัตว์ป่า สัตว์ฟันแทะ human reservoir และ environmental reservoir อย่างดิน น้ำ และวัสดุรองพื้น จุดที่ต้องแยกให้ออกคือ reservoir host มัก harbour เชื้อโดยไม่แสดงอาการ ต่างจาก host ที่แสดงอาการทางคลินิก แม้บางโรคจะเป็นได้ทั้งสองอย่าง เช่น rabies ในแรคคูนและค้างคาว ค้างคาวถูกยกเป็น reservoir host ของ rabies, Nipah, Ebola, SARS-CoV, MERS-CoV และ Hendra ส่วนการตัดข้อต่อนี้ทำด้วย cleaning disinfection สำหรับ environmental reservoir และ pest control กับการคัดทิ้ง carrier สำหรับ biological reservoir',
    scope: ['public-health'] },
  { term: 'sensitivity & specificity', aliases: ['sensitivity', 'specificity', 'diagnostic sensitivity', 'diagnostic specificity', 'ความไว', 'ความจำเพาะ'], category: 'lab-value', thai: 'ความไวและความจำเพาะของชุดตรวจ',
    defShort: 'Se คือโอกาสตรวจบวกเมื่อเป็นโรคจริง, Sp คือโอกาสตรวจลบเมื่อไม่เป็นโรค',
    defLong: 'Sensitivity เท่ากับ TP หารด้วย TP บวก FN คือ P ของผลบวกเมื่อสัตว์เป็นโรคจริง ส่วน specificity เท่ากับ TN หารด้วย TN บวก FP คือ P ของผลลบเมื่อสัตว์ไม่เป็นโรค ทั้งคู่ตั้งตัวหารจากสถานะ gold standard ไม่ใช่จากผลตรวจ ต่อเนื่องจากนั้น false-negative probability เท่ากับ 1 ลบ sensitivity และ false-positive probability เท่ากับ 1 ลบ specificity การเลือกใช้จำง่ายว่าความไวสูงช่วยคัดออก คือ rule out ต้องการ sensitivity สูงเพื่อลด false negative ส่วน rule in ต้องการ specificity สูงเพื่อลด false positive ค่าทั้งสองไม่เปลี่ยนเพราะ prevalence เพียงอย่างเดียว ต่างจาก PPV และ NPV และ ROC curve คือกราฟที่วาง sensitivity บนแกนตั้งกับ 1 ลบ specificity บนแกนนอน',
    scope: ['public-health'] },
  { term: 'somatic cell count', aliases: ['SCC', 'somatic cell', 'เซลล์โซมาติก'], category: 'lab-value', thai: 'จำนวนเซลล์โซมาติกในน้ำนม',
    defShort: 'จำนวนเม็ดเลือดขาวในน้ำนม บอกระดับการอักเสบของเต้านม — น้ำนมดิบต้องต่ำกว่า 500,000 cells/mL',
    defLong: 'SCC คือจำนวนเม็ดเลือดขาวที่เข้ามาในน้ำนมเมื่อเชื้อผ่าน teat canal เข้าไปทำลาย secretory cell จึงเป็นดัชนีของการอักเสบ ไม่ใช่การนับแบคทีเรีย เต้าที่ไม่ติดเชื้อทั่วไปอยู่ราว 100,000-200,000 เซลล์ต่อมิลลิลิตร ส่วน มกษ. 6003-2553 กำหนดน้ำนมโคดิบต้องต่ำกว่า 500,000 cells/mL และเกณฑ์รับซื้อจัดช่วง 400,001-500,000 เป็นช่วงไม่เพิ่มไม่ลดราคา เมื่อ SCC เกิน 400,000 cells/mL จะมี free fatty acid สูงขึ้น กลิ่นหืน rennet coagulation ช้าลง และ yield ของชีสลด วิธีวัดมีตั้งแต่ CMT ข้างเต้า Wisconsin mastitis test ไปจนถึง electronic counter และ direct microscopic count ในห้องปฏิบัติการ',
    scope: ['public-health'] },
  { term: 'spillover', aliases: ['zoonotic spillover', 'spillover event'], category: 'disease', thai: 'การข้ามสายพันธุ์ของเชื้อสู่โฮสต์ใหม่',
    defShort: 'เชื้อข้ามจาก reservoir host (HR) ไปติดโฮสต์ชนิดใหม่ (HS) ได้สำเร็จ',
    defLong: 'Spillover คือการแพร่เชื้อจาก HR ไปสู่ HS ส่วนทิศทางย้อนกลับ คือเชื้อออกจากคนซึ่งเป็น HS ไปติดสัตว์ชนิดอื่น เรียก spillback หรือ reverse zoonosis เส้นทางที่เลกเชอร์วางไว้คือ reservoir host ไปสู่ secondary หรือ spillover host แล้วจึงถึงคน โดยเชื้อตัวเดียวกันก่อโรคไม่เท่ากันในแต่ละ host เชื้อจะ spillover สำเร็จก็ต่อเมื่อผ่าน barrier ครบทุกชั้น ตั้งแต่ reservoir density, pathogen prevalence, ระดับการปล่อยเชื้อ, การอยู่รอดและการกระจายของเชื้อ, การสัมผัสของ spillover host จนถึงความไวรับ ในลำดับ 4 stages ของการเกิดโรคอุบัติใหม่ contact กับ spillover เป็นสองขั้นที่จำเป็นเสมอ ส่วน sustained intra-HS transmission กับ genetic adaptation เป็นขั้นที่จำเป็นต่อ pandemic เท่านั้น เช่น rabies หยุดอยู่แค่ spillover เพราะไม่ติดจากคนสู่คน',
    scope: ['public-health'] },
  { term: 'total plate count', aliases: ['TPC', 'standard plate count', 'SPC', 'total bacterial count', 'TBC', 'aerobic plate count'], category: 'lab-value', thai: 'จำนวนจุลินทรีย์ทั้งหมดโดยการเพาะเลี้ยง',
    defShort: 'จำนวนแบคทีเรียที่เพาะขึ้นได้ต่อ mL หรือ g — บอกสุขอนามัยของกระบวนการ ไม่ใช่ตัวชี้ความปลอดภัย',
    defLong: 'TPC หรือ standard plate count คือจำนวนโคโลนีที่เจริญบนอาหารเลี้ยงเชื้อ รายงานเป็น cfu/mL หรือ cfu/g ใช้บอก process integrity และ sanitation แต่ไม่ใช่ safety indicator เพราะเชื้อก่อโรคที่อันตรายอาจมีจำนวนน้อยจนค่ารวมยังดูปกติ น้ำนมโคดิบตาม มกษ. 6003-2553 กำหนด standard plate count น้อยกว่า 5 x 10^5 cfu/mL, coliform น้อยกว่า 10^4 cfu/mL และ thermoduric count น้อยกว่า 10^3 cfu/mL ฝั่งเนื้อ เนื้อดิบกำหนด aerobic plate count ไม่เกิน 5.0 x 10^5 CFU/g ส่วนเนื้อปรุงสุกไม่เกิน 1.0 x 10^5 CFU/g การตรวจเชื้อปนเปื้อนขั้นต่ำของเนื้อคือ total plate count ร่วมกับ Enterobacteriaceae และ coliforms',
    scope: ['public-health'] },
  { term: 'vector', aliases: ['biological vector', 'mechanical vector', 'vector-borne', 'พาหะ'], category: 'organism', thai: 'พาหะนำโรค',
    defShort: 'ตัวพาเชื้อไปสู่โฮสต์ — mechanical แค่พาไป ส่วน biological เชื้อเพิ่มจำนวนในตัว',
    defLong: 'Vector-borne เป็นรูปแบบหนึ่งของ indirect transmission และแบ่งเป็นสองชนิดที่ข้อสอบชอบให้แยก Mechanical vector เป็นตัวพาทางกายภาพเท่านั้น เชื้อไม่เพิ่มจำนวนและไม่พัฒนาในตัว vector จึงแพร่ต่อได้ทันที ตัวอย่างคือ stable fly พา anaplasmosis และเข็มฉีดยาพา bovine leukosis Biological vector คือเชื้อเพิ่มจำนวนหรือพัฒนาอยู่ในตัว vector จึงเป็นส่วนจำเป็นของวงจรชีวิตเชื้อ และต้องรอ extrinsic incubation period ก่อนจะแพร่ต่อได้ ตัวอย่างคือ Culicoides กับ bluetongue virus เห็บกับ Babesia และยุงกับ Rift Valley fever การควบคุมใช้ acaricide และ insecticide การกักสัตว์ในช่วงที่ vector ออกหากิน การระบายน้ำขัง และการกางมุ้งลวด',
    scope: ['public-health'] },
  { term: 'zoonosis', aliases: ['zoonoses', 'zoonotic disease', 'zoonotic', 'โรคติดต่อระหว่างสัตว์และคน'], category: 'disease', thai: 'โรคติดต่อระหว่างสัตว์และคน',
    defShort: 'โรคที่ติดต่อระหว่างสัตว์กับคน — 75% ของโรคติดเชื้ออุบัติใหม่มีต้นกำเนิด zoonotic',
    defLong: 'ตัวเลขที่เอกสารเรียนใช้คู่กันคือโรคติดเชื้ออุบัติใหม่ในคนราว 75% เป็น zoonotic และราว 60% ของโรคในคนเกี่ยวข้องกับ multi-host pathogen โดยตัวเลขชุดหลังมีที่มาจาก Taylor et al. 2001 ซึ่งนับเชื้อก่อโรคในคน 1,415 species และพบ 868 species หรือ 61% ที่เป็น zoonotic การจำแนกตามเส้นทางชีววิทยาแบ่งเป็นสี่แบบ คือ direct zoonoses ติดจากสัตว์สู่คนโดยตรงเช่น Cheyletiella, cyclozoonoses ที่คนกับสัตว์ติดสลับกันในวงจรเช่น Taenia solium, metazoonoses ที่ต้องมี arthropod vector เช่น sandfly กับ Leishmania และ saprozoonoses ที่ติดผ่านสิ่งแวดล้อมเช่นไข่ Toxocara ในดิน ทิศทางย้อนกลับจากคนไปสู่สัตว์เรียก reverse zoonosis หรือ spillback',
    scope: ['public-health'] },

  // ──────────────────────────────────────────────────────────
  // Aquatic animal medicine
  // ──────────────────────────────────────────────────────────
  // Written only from the aquatic notes (notes-y5-aquatic.js) and the
  // summaries of the recordings (video-summaries-aquatic-clinic.js); the
  // recording each card leans on is named above it. Where a compilation and
  // the lecture disagree (carp pox), the card says nothing rather than pick.
  // Shrimp biology hHvKF5h22RU [74:27]-[78:57]; pale, shrunken organ in AHPND: fn03KM77X7Q, 4nLqFMqASgg.
  { term: 'hepatopancreas', aliases: [], category: 'anatomy', thai: 'ตับและตับอ่อน',
    defShort: 'ตับและตับอ่อนของกุ้ง — สร้างน้ำย่อย สะสมอาหาร อวัยวะเมแทบอลิซึมหลัก — ปกติสีน้ำตาลเข้มเต็มหัว',
    defLong: 'อวัยวะในส่วนหัวของกุ้งที่ชื่อไทยว่าตับและตับอ่อน อาหารผ่านกระเพาะเข้ามาแล้วอวัยวะนี้สร้างน้ำย่อย ย่อยและดูดซึมกลับ และเก็บสะสมอาหารไว้ ส่วนที่เหลือขับออกทางลำไส้ด้านหลัง จึงเป็นอวัยวะทางเมแทบอลิซึมที่สำคัญที่สุดของกุ้ง ถ้าทำงานไม่ได้กุ้งจะไม่โต และเพราะเป็นที่สะสมอาหารจึงมักถูกเชื้อโจมตี. อวัยวะที่สุขภาพดีมีสีน้ำตาลเข้มและเต็มบริเวณหัว ส่วนที่ซีดและฝ่อเล็กลงเป็นภาพที่เห็นได้ด้วยตาในโรค AHPND. ทางจุลกายวิภาคเป็นท่อเรียงกันคล้ายนิ้วมือ มีช่องว่างตรงกลางและเซลล์หลายชนิดบุโดยรอบ ใช้ประเมินสุขภาพกุ้งได้',
    scope: ['aquatic'] },
  // hHvKF5h22RU [79:07]-[81:49].
  { term: 'antennal gland', aliases: ['green gland'], category: 'anatomy', thai: 'ต่อมขับถ่ายของกุ้ง',
    defShort: 'อวัยวะขับของเสียของกุ้ง เป็นท่อที่เปิดออกข้างปาก — ส่วนแอมโมเนียออกทางเหงือกเป็นหลัก',
    defLong: 'กุ้งขับของเสียผ่านเหงือกเป็นหลักเช่นเดียวกับปลา แอมโมเนียและคาร์บอนไดออกไซด์ออกทางเหงือก และเหงือกยังปรับสมดุลโซเดียม โพแทสเซียม และคลอไรด์ ซึ่งทำงานหนักขึ้นเมื่อแอมโมเนียสูงหรือความเค็มไม่เหมาะสม. ส่วนปัสสาวะออกทาง antennal gland หรือ green gland ซึ่งเป็นอวัยวะลักษณะเป็นท่อ เปิดออกบริเวณข้างปาก และเป็นช่องที่เชื้อโรคเข้าไปได้บ้าง',
    scope: ['aquatic'] },
  // DEYzFQDOYHk [147:35]-[152:31]; microsporidian, growth, PCR: fn03KM77X7Q.
  { term: 'EHP', aliases: ['Enterocytozoon hepatopenaei', 'E. hepatopenaei'], category: 'organism', thai: 'ไมโครสปอริเดียในตับกุ้ง',
    defShort: 'Enterocytozoon hepatopenaei — ไมโครสปอริเดียที่ทำให้กุ้งไม่ตายแต่ไม่โต FCR สูง — สปอร์ผนังหนาฆ่ายาก',
    defLong: 'EHP เป็นเชื้อกลุ่มไมโครสปอริเดียที่ติดในตับและตับอ่อนของกุ้ง จุดที่ทำให้ร้ายกว่าโรคที่ทำให้ตายคือกุ้งไม่ตายแต่ไม่โต กุ้งอายุเท่ากันกินอาหารเท่ากันแต่ตัวไม่โต FCR จึงสูงมากและฟาร์มขาดทุนจากค่าอาหารซึ่งเป็นต้นทุนหลัก จึงต้องติดตาม ADG และ FCR ตลอดการเลี้ยง. เมื่อพบร่วมกับแบคทีเรียอีกชนิดจะเกิดโรคขี้ขาวและการตายรุนแรง. สปอร์มีผนังหนามากจึงฆ่าได้ยาก การเตรียมบ่อจึงใช้ความเป็นด่าง เช่นโรยปูน ให้สปอร์ยิงตัวออกมาก่อน แล้วจึงลงคลอรีน ยืนยันเชื้อด้วย PCR และปัจจุบันยังควบคุมให้หมดไม่ได้',
    scope: ['aquatic'] },
  // fn03KM77X7Q, 4nLqFMqASgg; notes-y5-aquatic aqua-disease-control หมวด ฉ. (7).
  { term: 'WSSV', aliases: ['white spot syndrome virus', 'โรคตัวแดงดวงขาว'], category: 'disease', thai: 'โรคตัวแดงดวงขาว',
    defShort: 'White spot syndrome virus — ไวรัสที่ร้ายแรงที่สุดของกุ้งเลี้ยง จุดขาวใต้เปลือก ตายได้ทั้งบ่อ',
    defLong: 'WSSV ก่อโรคตัวแดงดวงขาว (white spot disease) ซึ่งเป็นโรคไวรัสที่ร้ายแรงที่สุดของกุ้งเลี้ยง เห็นจุดขาวใต้เปลือก และอัตราตายสูงจนตายได้ทั้งบ่อ. เป็นโรคระบาดในสัตว์น้ำ หมวด ฉ. ตามประกาศภายใต้ พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2558 เจ้าของต้องแจ้งภายใน 12 ชั่วโมงเมื่อพบ. ไม่มีวัคซีนสำหรับโรคกุ้ง การควบคุมจึงพึ่ง biosecurity ทุกขั้นตอน ได้แก่ลูกกุ้งปลอดเชื้อ (SPF) การฆ่าเชื้อระหว่างรอบ และการกรองน้ำเข้า ยืนยันด้วย real-time PCR',
    scope: ['aquatic'] },
  // fn03KM77X7Q; notes-y5-aquatic aqua-disease-control หมวด ฉ. (33).
  { term: 'IMNV', aliases: ['infectious myonecrosis virus', 'infectious myonecrosis'], category: 'disease', thai: 'โรคไอเอ็มเอ็น',
    defShort: 'Infectious myonecrosis virus — ไวรัสก่อโรคกล้ามเนื้อตาย (IMN) ในกุ้ง — โรคระบาดสัตว์น้ำตาม พ.ร.บ. 2558',
    defLong: 'IMNV ก่อโรคไอเอ็มเอ็น (IMN หรือ infectious myonecrosis) ในกุ้ง ชื่อโรคบอกรอยโรคหลักคือการตายของกล้ามเนื้อ (myonecrosis). อยู่ในบัญชีโรคระบาดในสัตว์น้ำ หมวด ฉ. ตามประกาศกระทรวงเกษตรและสหกรณ์ภายใต้ พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2558 เจ้าของต้องแจ้งภายใน 12 ชั่วโมงเมื่อพบ. ตัวย่อในบัญชีเดียวกันใกล้กันมาก ระวังสับสนระหว่าง IMN กับ IPN (infectious pancreatic necrosis) และระหว่าง IHHN กับ IHN',
    scope: ['aquatic'] },
  // fn03KM77X7Q, 4nLqFMqASgg; DEYzFQDOYHk [141:02]-[141:57]; notes หมวด ฉ. (24).
  { term: 'AHPND', aliases: ['EMS', 'acute hepatopancreatic necrosis disease', 'early mortality syndrome'], category: 'disease', thai: 'โรคเอเอชพีเอ็นดี',
    defShort: 'Acute hepatopancreatic necrosis disease (EMS) — V. parahaemolyticus ที่มียีนสารพิษ — ตับและตับอ่อนซีดฝ่อ',
    defLong: 'AHPND หรือ EMS เป็นโรคจากแบคทีเรีย เกิดจาก Vibrio parahaemolyticus สายพันธุ์ที่มียีนสร้างสารพิษ Pir A/B ภาพที่เห็นได้ด้วยตาคือตับและตับอ่อนซีดและฝ่อเล็กลง. เป็นหนึ่งในโรคที่ทำให้อุตสาหกรรมกุ้งไทยต้องเพิ่มขั้นตอน biosecurity ทั้งระบบ และอยู่ในบัญชีโรคระบาดในสัตว์น้ำ หมวด ฉ. ตาม พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2558. การควบคุมคือตากบ่อ ใส่ปูน และตั้งระบบ biosecurity ใหม่ ยืนยันด้วย PCR',
    scope: ['aquatic'] },
  // fn03KM77X7Q; notes-y5-aquatic aqua-disease-control หมวด ฉ. (19).
  { term: 'YHV', aliases: ['yellow head virus', 'yellow head disease'], category: 'disease', thai: 'โรคหัวเหลือง',
    defShort: 'Yellow head virus — ไวรัสก่อโรคหัวเหลืองในกุ้ง — โรคระบาดในสัตว์น้ำตาม พ.ร.บ. โรคระบาดสัตว์ 2558',
    defLong: 'YHV ก่อโรคหัวเหลือง (infection with yellow head virus) ในกุ้ง เป็นหนึ่งในโรคไวรัสสำคัญของกุ้งเลี้ยงร่วมกับ WSSV, TSV, IHHNV และ IMNV และเคยระบาดหนักในยุคที่ไทยเลี้ยงกุ้งกุลาดำเป็นหลัก. อยู่ในบัญชีโรคระบาดในสัตว์น้ำ หมวด ฉ. ตาม พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2558 ไม่มีวัคซีนสำหรับโรคกุ้ง การควบคุมจึงใช้ biosecurity และลูกกุ้งปลอดเชื้อ ยืนยันด้วย PCR',
    scope: ['aquatic'] },
  // Frog diseases CwDZzlE9Xzg [39:46]-[42:14]; ornamental fish Nto0dg3GP1w [72:06]-[78:29]; lcYOKEmEWb8.
  { term: 'Aeromonas', aliases: ['Aeromonas hydrophila', 'A. hydrophila', 'red-leg syndrome'], category: 'organism', thai: 'แอโรโมแนส',
    defShort: 'แกรมลบประจำถิ่นในน้ำ — เลือดออกที่ผิวหนังและอวัยวะภายใน — โรคขาแดงในกบ มักเป็น secondary infection',
    defLong: 'Aeromonas hydrophila เป็นแบคทีเรียแกรมลบที่อยู่ในน้ำทุกแห่ง ชื่อแปลว่าชอบน้ำ ก่อโรคได้ในสัตว์น้ำหลายชนิดทั้งปลาและกบ และติดคนที่สัมผัสสัตว์น้ำป่วยได้. บางสายพันธุ์มีสารพิษที่ทำให้เลือดรั่วออกจากหลอดเลือด จึงเห็นเลือดออกทั้งที่ผิวหนังและอวัยวะภายใน ในกบเรียกโรคขาแดงเพราะเลือดออกใต้ผิวหนังบริเวณขา ในปลาดุกเนื้อที่ควรขาวกลายเป็นสีแดง ส่วนอาการอื่นไม่จำเพาะ คือซึม ไม่กินอาหาร มีแผล. ก่อโรคแบบ primary ได้เมื่อเลี้ยงหนาแน่น แต่มักเป็น secondary infection หลังความเครียด น้ำไม่ดี หรือแผลจากปรสิต การจัดการคือลดอาหาร ทำน้ำและพื้นบ่อให้สะอาด คัดตัวป่วยออก แล้วจึงใช้ยาผสมอาหารหรือจุลินทรีย์',
    scope: ['aquatic'] },
  // Nto0dg3GP1w [72:06]-[73:08], [73:25]-[75:57]; lcYOKEmEWb8; vaccine target: rGCxK_2ivRs.
  { term: 'Edwardsiella', aliases: [], category: 'organism', thai: 'เอ็ดเวิร์ดเซลลา',
    defShort: 'แบคทีเรียแกรมลบก่อโรคในปลา — พบมากในปลาเนื้อที่เลี้ยงหนาแน่น ปลาดุกและปลาหนัง',
    defLong: 'Edwardsiella เป็นแบคทีเรียแกรมลบกลุ่มเดียวกับ Aeromonas, Pseudomonas และ Vibrio ที่ก่อโรคในสัตว์น้ำ มักพบในปลาที่เลี้ยงเป็นอาหารแบบหนาแน่น และในปลาดุกกับปลาหนัง และมีรายงานในกบเลี้ยงด้วย. ภาพของโรคแบคทีเรียในปลาโดยรวมคือระบาดเร็ว ตายมาก เลือดออก ตาบวม และท้องมาน (dropsy) เป็นทั้งตัวและหลายตัวในบ่อ ต่างจากโรคปรสิตที่ทยอยตายทีละน้อยและมักเป็นจุดขาว. การวินิจฉัยมาตรฐานคือเพาะเชื้อ ถ้าเพาะจากเลือดได้จะบอกได้ว่าเป็น systemic infection และเป็นเชื้อหนึ่งที่มีวัคซีนใช้ในปลา',
    scope: ['aquatic'] },
  // Nto0dg3GP1w [71:22]-[72:01], [81:44]-[83:28]; CwDZzlE9Xzg [42:14]-[43:52].
  { term: 'Streptococcus', aliases: ['streptococcosis'], category: 'organism', thai: 'สเตรปโตคอกคัส',
    defShort: 'แกรมบวกแทบตัวเดียวที่ก่อโรคในสัตว์น้ำ — ว่ายวงสว่าน ตาโปน — ปลานิล ปลาหมอสี ตายมากช่วงน้ำอุ่น',
    defLong: 'แบคทีเรียก่อโรคในสัตว์น้ำเกือบทั้งหมดเป็นแกรมลบ Streptococcus เป็นแกรมบวกแทบจะตัวเดียว การย้อมแกรมจึงช่วยชี้เชื้อได้เร็ว. พบบ่อยในปลานิลและปลาหมอสี อาการเด่นคืออาการทางประสาท ปลาว่ายวงสว่านเสียการทรงตัวจนควบคุมทิศทางไม่ได้ ต่างจากปลาที่ครีบเสียซึ่งยังพยุงตัวขึ้นมากินอาหารได้ ร่วมกับตาโปนขาวบวมเพราะเชื้อเข้าไปอยู่ในช่องว่างในตา จุดเลือดออกหรือหนองที่ผิวหนัง และท้องบวมน้ำ. อัตราตายสูงช่วงอุณหภูมิสูง ส่วนอุณหภูมิต่ำมักเป็นแบบเรื้อรัง ปลานิลบางส่วนและกบทนเชื้อได้โดยไม่ป่วยเฉียบพลัน แต่เกิด granuloma ในหลายอวัยวะแทน',
    scope: ['aquatic'] },
  // Nto0dg3GP1w [73:13]-[73:25], [83:36]-[84:37].
  { term: 'columnaris', aliases: ['columnaris disease', 'cotton wool disease', 'Flavobacterium columnare', 'F. columnare'], category: 'disease', thai: 'โรคคอลัมนาริส',
    defShort: 'Flavobacterium columnare — รอยโรคเป็นใยฟูคล้ายรา — เหงือกเน่า ขูดส่องเห็นเชื้อเกาะกันเป็นกอง',
    defLong: 'Columnaris หรือ cotton wool disease เกิดจากแบคทีเรียกลุ่มมิกโซแบคทีเรีย (Flavobacterium columnare) รอยโรคภายนอกเป็นใยฟูจนอาจคิดว่าเป็นเชื้อรา แต่เมื่อขูดมาส่องจะเห็นแบคทีเรียรวมกลุ่มกันเป็นกองเป็นก้อน ซึ่งแบคทีเรียชนิดอื่นไม่ทำ จึงอาจวินิจฉัยได้โดยไม่ต้องเพาะเชื้อ. ตำแหน่งที่ร้ายที่สุดคือเหงือก เกิดเหงือกเน่าเป็นแผลจนปลาตายจากการหายใจไม่ได้ ถ้าเป็นตามตัวก็เน่าเป็นฟูใหญ่เช่นกัน',
    scope: ['aquatic'] },
  // Nto0dg3GP1w [88:11]-[91:34]; notes-y5-aquatic aqua-disease-control หมวด ฉ. (2).
  { term: 'KHV', aliases: ['koi herpesvirus', 'koi herpes virus', 'KHV disease', 'koi herpesvirus disease'], category: 'disease', thai: 'โรคเคเอชวี',
    defShort: 'Koi herpesvirus — อันตรายต่อปลาคาร์ป ผิวซีด เหงือกเน่า — ชอบน้ำเย็น ในไทยมักเป็นพาหะไม่แสดงอาการ',
    defLong: 'KHV เป็น herpesvirus ที่อันตรายและทำให้ปลาคาร์ปเสียหายมาก รอยโรคคือผิวซีด เหงือกเน่า และอาจมีท้องบวมน้ำ ดูจากภายนอกได้ยาก ยกเว้นเปิดดูเหงือกในรายที่เป็นรุนแรง. ไวรัสชอบน้ำเย็น ส่วนน้ำที่เลี้ยงปลาคาร์ปในไทยอุณหภูมิค่อนข้างสูง ปลาจึงมักเป็นพาหะโดยไม่แสดงอาการ. โรคไวรัสในปลารักษาไม่ได้ และ KHV อยู่ในบัญชีโรคระบาดในสัตว์น้ำ หมวด ฉ. ตาม พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2558',
    scope: ['aquatic'] },
  // Frog diseases CwDZzlE9Xzg [59:18]-[63:09]; notes หมวด ฉ. (16); lcYOKEmEWb8.
  { term: 'Ranavirus', aliases: ['ranaviral disease'], category: 'organism', thai: 'รานาไวรัส',
    defShort: 'ไวรัสตัวเดียวที่มีรายงานในกบเลี้ยง — แผลหลุมสีแดงที่หัวและขา ทยอยตาย บางครั้งถึง 100% — ไม่มียารักษา',
    defLong: 'Ranavirus เป็นไวรัสตัวเดียวที่มีรายงานในกบเลี้ยง ชื่อตั้งตามกบ ปัจจุบันพบค่อนข้างน้อย แต่อยู่ในบัญชีโรคระบาดในสัตว์น้ำ หมวด ฉ. ตาม พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2558. อาการไม่จำเพาะคือว่ายน้ำผิดปกติและอ่อนแรง ส่วนอาการเด่นคือแผลหลุมสีแดงที่หัวและขาร่วมกับการทยอยตาย ตายเร็วและมาก บางครั้งถึง 100% โดยเฉพาะช่วงอากาศเปลี่ยน ต้นฝนถึงหน้าหนาว. ติดได้เมื่อกบกินกัน ทางน้ำ และจากพ่อแม่พันธุ์ และมักมี Aeromonas ติดแทรกร่วม ทางพยาธิวิทยาพบ inclusion body ยืนยันด้วย PCR. ไม่มีการรักษาและวัคซีนยังอยู่ในขั้นวิจัย การป้องกันคือบ่อ น้ำ และอาหารที่สะอาด ระบบ biosecurity และไม่รวมสัตว์ใหม่กับสัตว์เดิม',
    scope: ['aquatic'] },
  // Amphibian medicine ktxMaLGGfhE [55:12]-[56:53]; notes หมวด ฉ. (3); D5LZtcXUYso, lcYOKEmEWb8.
  { term: 'Batrachochytrium dendrobatidis', aliases: ['Batrachochytrium', 'B. dendrobatidis', 'chytridiomycosis', 'chytrid fungus'], category: 'organism', thai: 'เชื้อราไคทริด',
    defShort: 'เชื้อราก่อ chytridiomycosis ที่ผิวหนังสัตว์สะเทินน้ำสะเทินบก — ระบาดในธรรมชาติ ชอบอุณหภูมิต่ำ — ตรวจด้วย PCR',
    defLong: 'Batrachochytrium dendrobatidis เป็นเชื้อราที่ก่อ chytridiomycosis หรือโรคไคทริดฟังกัส ซึ่งเป็นปัญหาระดับโลกของสัตว์สะเทินน้ำสะเทินบก เกิดการระบาดในธรรมชาติมาก่อนและทำให้กบในแหล่งน้ำตายเป็นจำนวนมาก. เชื้อก่อปัญหาที่ผิวหนัง ซึ่งเป็นอวัยวะที่กบใช้หายใจและดูดซึมสาร รุนแรงมากในประชากรที่ไม่เคยได้รับเชื้อ และตายภายในราว 1 สัปดาห์. เชื้อมักเกิดในอุณหภูมิค่อนข้างต่ำ ในไทยซึ่งอุณหภูมิสูงจึงน่าจะยังไม่มีการระบาด วินิจฉัยด้วย PCR และเป็นโรคระบาดในสัตว์น้ำ หมวด ฉ. ตาม พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2558',
    scope: ['aquatic'] },
  // Nto0dg3GP1w [72:06]-[72:59]; V. parahaemolyticus and AHPND: fn03KM77X7Q, 4nLqFMqASgg; Ht4uH8mzYQ8.
  { term: 'Vibrio', aliases: ['vibriosis', 'Vibrio parahaemolyticus', 'V. parahaemolyticus'], category: 'organism', thai: 'วิบริโอ',
    defShort: 'แบคทีเรียแกรมลบของสัตว์น้ำเค็มและน้ำกร่อย ปลาน้ำจืดพบน้อยมาก — สายที่มียีนสารพิษก่อ AHPND ในกุ้ง',
    defLong: 'Vibrio เป็นแบคทีเรียแกรมลบกลุ่มเดียวกับ Aeromonas, Pseudomonas และ Edwardsiella ทำให้เกิดโรคในสัตว์น้ำเค็ม ปลาน้ำจืดพบได้น้อยมาก ถ้าเลี้ยงในน้ำกร่อยก็อาจพบได้ ส่วนในปลาน้ำจืด Aeromonas และ Pseudomonas เป็นตัวที่พบแทน. ในกุ้ง vibriosis เกิดได้จากหลายสปีชีส์ และ V. parahaemolyticus สายพันธุ์ที่มียีนสร้างสารพิษ Pir A/B เป็นสาเหตุของ AHPND หรือ EMS. โรคแบคทีเรียในสัตว์น้ำมักระบาดเร็ว ตายมาก และมักเป็น secondary infection หลังความเครียดหรือน้ำไม่เหมาะสม',
    scope: ['aquatic'] },
];

// ────────────────────────────────────────────────────────────
// Scope resolution — which entry is true for THIS question
// ────────────────────────────────────────────────────────────
// A term key can now point at more than one entry, because the same
// spelling means different things in different disciplines. Resolution
// is deliberately conservative:
//
//   1. an entry whose scope names this subject wins (most specific)
//   2. otherwise a 'universal' entry
//   3. otherwise nothing — the word is left as plain text
//
// Step 3 is the point. Underlining a word and then defining it wrong is
// worse than not offering the definition at all, and a student reading
// at 1am cannot be expected to notice that the card is about the wrong
// species.
export function expandScope(scope) {
  if (scope === 'universal') return 'universal';
  const out = new Set();
  for (const s of scope || []) {
    const fam = SCOPE_FAMILIES[s];
    if (fam) for (const id of fam) out.add(id);
    else out.add(s);
  }
  return out;
}

// term key (lowercased) → entries that can answer to it.
const TERM_INDEX = new Map();
function indexKey(key, entry) {
  const k = String(key).toLowerCase();
  if (!TERM_INDEX.has(k)) TERM_INDEX.set(k, []);
  TERM_INDEX.get(k).push(entry);
}
for (const entry of GLOSSARY) {
  entry.__scope = expandScope(entry.scope);
  indexKey(entry.term, entry);
  for (const alias of entry.aliases || []) indexKey(alias, entry);
}

// Synonyms map separately — used by related-Q matching only, never by
// the detector (they are looser and would fire on the wrong thing).
const SYNONYM_INDEX = new Map();
for (const entry of GLOSSARY) {
  for (const syn of entry.synonyms || []) {
    const k = syn.toLowerCase();
    if (!SYNONYM_INDEX.has(k)) SYNONYM_INDEX.set(k, []);
    SYNONYM_INDEX.get(k).push(entry);
  }
}

// Stable identity for an entry, so the build-time related-question
// index survives entries being reordered or added. Term alone is not
// enough now that one spelling can carry two scoped meanings.
export function entryKey(entry) {
  const scope = entry.scope === 'universal' ? 'universal' : (entry.scope || []).slice().sort().join('+');
  return `${entry.term.toLowerCase()}|${scope}`;
}

// Resolve a term for a given question subject. `subject` may be null,
// which means "no context" — then only a universal entry can answer,
// because picking one discipline's meaning at random is the bug this
// whole file exists to stop.
export function resolveGlossaryEntry(termOrAlias, subject) {
  if (!termOrAlias) return null;
  const key = String(termOrAlias).toLowerCase();
  const candidates = TERM_INDEX.get(key) || SYNONYM_INDEX.get(key) || [];
  if (candidates.length === 0) return null;
  if (subject) {
    const scoped = candidates.find((e) => e.__scope !== 'universal' && e.__scope.has(subject));
    if (scoped) return scoped;
  }
  return candidates.find((e) => e.__scope === 'universal') || null;
}

// Back-compat shim for callers with no question context. Same rule:
// without a subject only a universal entry can answer.
export function findGlossaryEntry(termOrAlias, subject = null) {
  return resolveGlossaryEntry(termOrAlias, subject);
}

// Does any entry claim this key at all? Used by the detector to build
// its regex — resolution then decides whether a hit actually opens.
export function getAllDetectableTerms() {
  return Array.from(TERM_INDEX.keys());
}

// All searchable strings for related-Q matching (terms + aliases +
// synonyms — broader net, searched inside full Q text).
export function getAllSearchableStrings(entry) {
  if (!entry) return [];
  return [
    entry.term,
    ...(entry.aliases || []),
    ...(entry.synonyms || []),
  ].filter(Boolean);
}
